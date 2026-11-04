"""Split a silhouette painting into SilScene's 4 planes by colour and region, not by depth (Nov 2026).

Depth estimation (tools/sil_layers.py) is unreliable on flat silhouette art: it cut figures, window bars, walls, lamp cones and
paper ribbons in two, so the halves slid apart when the camera moved, and it left ghost outlines and smears on the planes behind.
This builds the planes from masks a per-scene recipe draws from the painting's own colours (ink, coral, cream paper, cool
teal...), so every object sits whole on ONE plane. Most scenes use only 2-3 real planes; an unused band is written as an empty
(transparent) webp, so the file layout (L0-L2.webp, L3.jpg, 4 bands) and the chapters stay the same. The painting is never
edited: each plane carries the painting's own pixels, plus a fill only where it is hidden behind a nearer plane.

  python3 tools/sil_regions.py BW14_aug15_dc BW13_presses ...      (all recipes: python3 tools/sil_regions.py all)

For a plane k the recipe gives a mask (bool, painting px). build():
  * L0..L2: the painting under the mask (soft 1 px edge). Where a nearer plane covers this one (plus EDGE px, its anti-aliased
    rim) and up to EXTEND px beyond, the plane continues with a smooth fill grown from its own pixels, so a slide shows this
    plane's colours, never a hole or the nearer object's outline.
  * L3: the painting with everything nearer (plus EDGE px) filled from the back plate's own pixels (push-pull fill: smooth,
    no streaks), except `keep` areas (smooth gradients a soft-edged nearer plane fades into).
  * `alpha`: an optional float alpha for a plane (a feathered edge into a smooth gradient, e.g. BW14's ceiling into the glow).
"""
import json
import os
import sys

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
SRC = os.path.join(ROOT, 'public/img/gen/scenes/2x/{}.jpg')
OUT = os.path.join(ROOT, 'public/img/layers/sil/{}/')


# ───────────────────────── helpers for recipes ─────────────────────────
class Pic:
    def __init__(self, name):
        self.name = name
        self.im = np.array(Image.open(SRC.format(name)).convert('RGB'))
        self.H, self.W = self.im.shape[:2]
        f = self.im.astype(np.int32)
        self.r, self.g, self.b = f[..., 0], f[..., 1], f[..., 2]
        self.mx = np.maximum(np.maximum(self.r, self.g), self.b)
        self.mn = np.minimum(np.minimum(self.r, self.g), self.b)
        self.lum = (0.299 * self.r + 0.587 * self.g + 0.114 * self.b)
        self.yy, self.xx = np.mgrid[0:self.H, 0:self.W]

    def poly(self, pts, scale=2.0):
        """Polygon in preview px (1376 x 768 = painting / 2) -> bool mask."""
        p = (np.array(pts, float) * scale).astype(np.int32)
        m = np.zeros((self.H, self.W), np.uint8)
        cv2.fillPoly(m, [p], 1)
        return m.astype(bool)

    def coral(self):
        return (self.r > 150) & (self.r - self.g > 45) & (self.r - self.b > 45)


def big(mask, n=400):
    """Connected pieces larger than n px."""
    lab, k = ndi.label(mask)
    if k == 0:
        return mask
    sizes = ndi.sum(mask, lab, range(1, k + 1))
    return np.isin(lab, 1 + np.flatnonzero(sizes > n))


def touching(mask, seed):
    """Connected pieces of `mask` that touch `seed`."""
    lab, k = ndi.label(mask, structure=np.ones((3, 3)))
    ids = np.unique(lab[seed & mask])
    ids = ids[ids > 0]
    return np.isin(lab, ids)


def close(mask, it=2):
    return ndi.binary_closing(mask, iterations=it)


def disk(r):
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))


def dil(mask, r):
    if r <= 0:
        return mask.astype(bool)
    return cv2.dilate(mask.astype(np.uint8), disk(r)) > 0


def ero(mask, r):
    if r <= 0:
        return mask.astype(bool)
    return cv2.erode(mask.astype(np.uint8), disk(r)) > 0


# ───────────────────────── fills ─────────────────────────
def pushpull(img, known):
    """Fill the unknown pixels of `img` smoothly from the known ones (a weighted image pyramid: down with weights, back up)."""
    img = img.astype(np.float32)
    w = known.astype(np.float32)
    pyr = []
    cur, cw = img * w[..., None], w
    while min(cur.shape[:2]) > 4:
        pyr.append((cur, cw))
        h, wd = cur.shape[:2]
        cur = cv2.resize(cur, ((wd + 1) // 2, (h + 1) // 2), interpolation=cv2.INTER_AREA)
        cw = cv2.resize(cw, ((wd + 1) // 2, (h + 1) // 2), interpolation=cv2.INTER_AREA)
    up = cur / np.maximum(cw, 1e-6)[..., None]
    for cur, cw in reversed(pyr):
        h, wd = cur.shape[:2]
        u = cv2.resize(up, (wd, h), interpolation=cv2.INTER_LINEAR)
        val = cur / np.maximum(cw, 1e-6)[..., None]
        a = np.clip(cw * 4, 0, 1)[..., None]   # a level's own pixels win once they have some weight
        up = val * a + u * (1 - a)
    return up


def fill(im, known, scale=0.5, blur=0):
    """Painting with the unknown pixels filled (push-pull at `scale`), known pixels untouched."""
    H, W = known.shape
    if known.all():
        return im.copy()
    s_im = cv2.resize(im, (int(W * scale), int(H * scale)), interpolation=cv2.INTER_AREA)
    s_kn = cv2.resize(ero(known, 2).astype(np.uint8), (int(W * scale), int(H * scale)), interpolation=cv2.INTER_NEAREST) > 0
    f = pushpull(s_im, s_kn)
    if blur:
        f = cv2.GaussianBlur(f, (0, 0), blur)
    f = cv2.resize(f, (W, H), interpolation=cv2.INTER_CUBIC)
    return np.where(known[..., None], im, np.clip(f, 0, 255).astype(np.uint8))


def soft(mask, px=0.9, grow=1):
    a = cv2.GaussianBlur(dil(mask, grow).astype(np.float32), (0, 0), px)
    return np.clip(a, 0, 1)


def snap(pic, mask, band=14, ref=16, scale=0.5):
    """Move a rough mask's edge onto the painting's real edge: inside a +-band px strip, each pixel goes to the side whose
    local colour (a smooth fill from that side's pixels at least `ref` px from the rough edge) it is closer to."""
    inner, outer = ero(mask, ref), ero(~mask, ref)
    a = fill(pic.im, inner, scale).astype(np.float32)
    b = fill(pic.im, outer, scale).astype(np.float32)
    x = pic.im.astype(np.float32)
    closer = ((x - a) ** 2).sum(-1) < ((x - b) ** 2).sum(-1)
    strip = dil(mask, band) & ~ero(mask, band)
    out = np.where(strip, closer, mask)
    out = ndi.binary_opening(out, iterations=1)
    return close(out, 1)


# ───────────────────────── build ─────────────────────────
def build(pic, masks, alpha=None, keep=None, edge=6, extend=90, ext=None, note='', fill_scale=0.5):
    """masks: [m0, m1, m2] bool or None (nearer wins). alpha: optional per-plane float alpha overriding the soft mask.
    keep: bool areas where the back plate keeps the painting even though a nearer plane covers it. ext: optional per-plane
    bool masks where that plane continues under nearer planes (default: EXTEND px around its own pixels)."""
    im, H, W = pic.im, pic.H, pic.W
    alpha = alpha or [None] * 3
    ext = ext or [None] * 3
    ms = []
    taken = np.zeros((H, W), bool)
    for m in masks:
        m = np.zeros((H, W), bool) if m is None else (m & ~taken)
        ms.append(m)
        taken |= m
    out = OUT.format(pic.name)
    os.makedirs(out, exist_ok=True)
    nearer = np.zeros((H, W), bool)
    for k in range(3):
        m = ms[k]
        if not m.any():
            Image.fromarray(np.zeros((H, W, 4), np.uint8)).save(out + f'L{k}.webp', quality=50)
            continue
        cover = dil(nearer, edge)                          # hidden behind a nearer plane (and its rim)
        known = m & ~cover
        e = ext[k] if ext[k] is not None else (dil(m, extend) & cover)
        e = e & ~known
        rgb = fill(im, known, fill_scale) if (e.any() or (m & cover).any()) else im
        a = alpha[k] if alpha[k] is not None else soft(m)
        a = np.maximum(a, soft(e, 1.2, 0) * (dil(m, 3) | nearer))   # the extension is opaque where it is hidden or joins m
        a = np.where(e & ~dil(m, 3) & ~nearer, 0, a)
        rgba = np.dstack([rgb, (np.clip(a, 0, 1) * 255).astype(np.uint8)])
        Image.fromarray(rgba).save(out + f'L{k}.webp', quality=92)
        nearer |= m
    # back plate
    known = ~dil(nearer, edge)
    if keep is not None:
        known |= keep
    back = fill(im, known, fill_scale)
    fa = cv2.GaussianBlur((~known).astype(np.float32), (0, 0), 1.5)[..., None]
    back = (im * (1 - fa) + back * fa).astype(np.uint8)
    back = np.where(known[..., None], im, back)
    Image.fromarray(back).save(out + 'L3.jpg', quality=92)
    meta = json.load(open(out + 'layers.json')) if os.path.exists(out + 'layers.json') else {}
    meta.update({'size': [W, H], 'bands': 4, 'method': f'colour/region split (tools/sil_regions.py {pic.name}), not depth',
                 'share': [float(m.mean()) for m in ms] + [float(1 - taken.mean())]})
    if note:
        meta['note'] = note
    meta.pop('thresholds', None)
    json.dump(meta, open(out + 'layers.json', 'w'))
    pal = np.array([[200, 30, 30], [40, 160, 40], [30, 120, 200]], np.uint8)
    prev = im.copy()
    for k in range(3):
        prev[ms[k]] = (0.45 * im[ms[k]] + 0.55 * pal[k]).astype(np.uint8)
    Image.fromarray(prev).resize((W // 3, H // 3)).save(out + 'preview.jpg', quality=80)
    print(pic.name, 'share', [round(float(m.mean()), 3) for m in ms])


# ───────────────────────── recipes ─────────────────────────
RECIPES = {}


def recipe(fn):
    RECIPES[fn.__name__.replace('r_', '')] = fn
    return fn


# (recipes are defined below)


def main():
    names = sys.argv[1:]
    if names == ['all']:
        names = sorted(RECIPES)
    for n in names:
        key = next((k for k in RECIPES if n.startswith(k)), None)
        if key is None:
            sys.exit(f'no recipe for {n}; have {sorted(RECIPES)}')
        RECIPES[key]()


@recipe
def r_BW14():
    """BW14 (the corridor, Aug 15 in Washington). The depth split cut the receding walls, the windows and the floor's light
    bars into bands that tore apart. Now the whole corridor (both walls, the door, the windows, the floor) is ONE plane, L1 (the
    door card's plane, ch09/door.tsx CARD_PLANE = 1); the dark ceiling, the glow and the view out of the far end (the Capitol)
    are the back plate. L0 and L2 are empty."""
    p = Pic('BW14_aug15_dc')
    back = p.poly([(316, -4), (917, 297), (917, 476), (1197, 476), (1197, 295), (1344, -4)])
    back = snap(p, back, band=10, ref=14)
    build(p, [None, ~back, None], note='corridor on L1 whole; ceiling, glow and the far view on L3')


if __name__ == '__main__':
    main()
