"""Split a silhouette painting into SilScene's 4 planes by colour and region, not by depth (The Balloon War v2, Nov 2026).

Depth estimation (tools/sil_layers.py + Depth Anything) is unreliable on flat silhouette art: it cut figures, window bars, walls,
lamp cones and paper ribbons in two, so the halves slid apart when the camera moved, and it left ghost outlines and smears on the
planes behind. This builds the planes from masks drawn from the painting's own colours (ink, coral, cream paper, cool teal...),
so every object sits whole on ONE plane. The rules that made it work:
  * each object whole on one plane (a man with his desk and both window bars; a girl with her table and the sheet on it);
  * a continuous structure on ONE plane (a corridor's two walls, floor and door; a fence; a press with its paper ribbon): a
    receding wall split into bands tears when it slides;
  * soft things stay with what makes them (chimney smoke with its chimney, a lamp with its light cone), or all in the fog;
  * most scenes need only 2-3 real planes; an unused band is written as an empty (transparent) webp, so the file layout
    (L0-L2.webp, L3.jpg, 4 bands, layers.json) and SilScene stay the same;
  * the painting is never edited: each plane carries its own pixels, plus a fill only where a nearer plane hides it.
Then run the stress test, tools/sil_stress.py, and look: nothing may tear, double or leave a ghost.

  python3 tools/sil_regions.py SC04 --ink                 # quick split: all ink touching the bottom edge on L0, the rest on L3
  python3 tools/sil_regions.py SC04 --ink=45 --plane=1 --shadow=12 --fill=rows
  python3 tools/sil_regions.py SC07 --tiers=22,52,100     # flat-tone painting, darker = nearer: tiers by max(R,G,B) on L0..L2
  python3 tools/sil_regions.py SC05 SC09 ...              # run this video's recipes (below); `all` runs every recipe

The quick modes are a start; most scenes want a recipe (a function decorated @recipe, named r_<prefix of the painting name>,
with a docstring saying what is on each plane and why). Fourteen worked recipes (beach figures with a balloon, a theatre floor
by tone rows, a pressroom with paper ribbons, a corridor on one plane, a house snapped to its edges, cranes on strings, a town
by colour) are in projects/Balloon_War/tools/sil_regions.py in the style repo: copy the pattern, not the coordinates.

For a plane k the recipe gives a mask (bool, painting px). build():
  * L0..L2: the painting under the mask (soft 1 px edge). Where a nearer plane covers this one (plus EDGE px, its anti-aliased
    rim) and up to EXTEND px beyond, the plane continues with a smooth fill grown from its own pixels, so a slide shows this
    plane's colours, never a hole or the nearer object's outline.
  * L3: the painting with everything nearer (plus EDGE px) filled from the back plate's own pixels (push-pull fill: smooth,
    no streaks; or row by row for banded skies and beaches; or mixed), except `keep` areas.
  * `shadow`: the paper-cut style paints a soft drop shadow beside each shape; it travels with the shape (black + alpha) and is
    filled out of the planes behind, so no shadow outline is left there.
Helpers for recipes: front_ink (ink connected to the ground), tiers (flat tones by brightness, rims kept with the nearer
shape), snap (a rough polygon moved onto the painting's real edge), below_top (a ground plane's extension stays below its
top edge), touching / big / close / dil / ero, Pic.coral(), Pic.poly(); fills pushpull / rowfill / fill.
Needs: pip install pillow numpy opencv-python-headless scipy.
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
SRC = os.environ.get('SIL_SRC', os.path.join(ROOT, 'public/img/gen/scenes/2x/{}.jpg'))   # the palette-locked 2x upscale
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
        """Polygon in preview px (painting / 2: 1376 x 768 for a 2752 x 1536 upscale; read them off preview.jpg x 1.5) -> bool mask."""
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


def below_top(m, nearer, pad=2):
    """For a ground plane: the area below its top edge, with the edge carried straight across the columns where a nearer shape
    hides it (interpolated between the columns where the edge meets open sky). Its extension under nearer planes stays in
    here, so the ground never grows up into the sky behind a post or a figure."""
    H, W = m.shape
    has = m.any(0)
    top = np.where(has, m.argmax(0), H)
    above = np.clip(top - 4, 0, H - 1)
    near = dil(nearer, 3)
    valid = has & ~near[above, np.arange(W)]
    xs = np.arange(W)
    t = np.interp(xs, xs[valid], top[valid]) if valid.any() else top.astype(float)
    return np.arange(H)[:, None] >= (t[None, :] - pad)


def tiers(p, cuts, edge=3, grad=14):
    """Split a painting built in flat tones (darker = nearer) into tiers by brightness (`cuts` on max(R,G,B)). The anti-aliased
    rim of each shape (in-between tones on a sharp edge) goes with the darker, nearer shape, so no outline of it is left on the
    tier behind. Returns a label image (0 = nearest)."""
    lab = np.digitize(p.mx, cuts).astype(np.uint8)
    g = (cv2.dilate(p.mx.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(int)
         - cv2.erode(p.mx.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(int)) > grad
    g = dil(g, 1)
    mx = p.mx.astype(np.float32)
    for k in range(1, len(cuts) + 1):
        # the tier's own local tone; a rim pixel is darker than it (a bright sharpening halo is not the shape's: it stays and
        # is filled on the plane behind)
        own = (lab == k).astype(np.float32)
        ref = cv2.blur(mx * own, (15, 15)) / np.maximum(cv2.blur(own, (15, 15)), 1e-3)
        for j in range(k):
            rim = (lab == k) & dil(lab == j, edge) & g & (mx < ref - 3)
            lab[rim] = j
    return lab


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


def rowfill(im, known, scale=0.5, sy=3):
    """Fill row by row between the nearest known pixels left and right, then smooth vertically a little: seamless for a
    back plate painted in horizontal bands (sky, mountains, mist, sea), where a 2-D fill smears one band into the next."""
    H, W = known.shape
    h, w = int(H * scale), int(W * scale)
    s_im = cv2.resize(im, (w, h), interpolation=cv2.INTER_AREA).astype(np.float32)
    s_kn = cv2.resize(ero(known, 2).astype(np.uint8), (w, h), interpolation=cv2.INTER_NEAREST) > 0
    out = s_im.copy()
    xs = np.arange(w)
    for y in range(h):
        k = s_kn[y]
        if k.all() or not k.any():
            continue
        for c in range(3):
            out[y, ~k, c] = np.interp(xs[~k], xs[k], s_im[y, k, c])
    sm = cv2.GaussianBlur(out, (0, 0), sigmaX=1.5, sigmaY=sy)
    out = np.where(s_kn[..., None], out, sm)
    f = cv2.resize(out, (W, H), interpolation=cv2.INTER_CUBIC)
    return np.where(known[..., None], im, np.clip(f, 0, 255).astype(np.uint8))


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
def build(pic, masks, alpha=None, keep=None, edge=6, extend=90, ext=None, note='', fill_scale=0.5, shadow=0, back_fill='smooth', paint=None):
    """masks: [m0, m1, m2] bool or None (nearer wins). alpha: optional per-plane float alpha overriding the soft mask.
    keep: bool areas where the back plate keeps the painting even though a nearer plane covers it. ext: optional per-plane
    bool masks where that plane continues under nearer planes (default: EXTEND px around its own pixels).
    back_fill: 'rows' fills the back plate row by row (for horizontal bands of sky, mountains and mist); 'mixed' fills
    narrow gaps (behind a trunk) row by row and wide ones smoothly.
    paint: optional per-plane (mask, rgb image): those pixels of the plane take that colour (an un-mixed soft matte).
    shadow: px of the soft drop shadow the paper-cut style paints beside each shape. It travels with the shape (as black with
    alpha = how much it darkens what is behind) and is filled out of the planes behind, so no shadow ghost is left there."""
    im, H, W = pic.im, pic.H, pic.W
    alpha = alpha or [None] * 3
    ext = ext or [None] * 3
    reach = max(edge, shadow + 2)
    ms = []
    taken = np.zeros((H, W), bool)
    for m in masks:
        m = np.zeros((H, W), bool) if m is None else (m & ~taken)
        ms.append(m)
        taken |= m
    out = OUT.format(pic.name)
    os.makedirs(out, exist_ok=True)
    lum = lambda x: x.astype(np.float32) @ np.array([0.299, 0.587, 0.114], np.float32)
    nearer = np.zeros((H, W), bool)
    for k in range(3):
        m = ms[k]
        if not m.any():
            Image.fromarray(np.zeros((H, W, 4), np.uint8)).save(out + f'L{k}.webp', quality=50)
            continue
        cover = dil(nearer, reach)                         # hidden behind a nearer plane (and its rim and shadow)
        known = m & ~cover
        e = ext[k] if ext[k] is not None else (dil(m, extend) & cover)
        e = e & ~known
        rgb = fill(im, known, fill_scale) if (e.any() or (m & cover).any()) else im
        a = alpha[k] if alpha[k] is not None else soft(m)
        a = np.maximum(a, soft(e, 1.2, 0) * (dil(m, 3) | nearer))   # the extension is opaque where it is hidden or joins m
        a = np.where(e & ~dil(m, 3) & ~nearer, 0, a)
        if shadow:
            z = dil(m, shadow) & ~dil(m, 1) & ~nearer & ~e & ~taken     # only over the back plate (not over a farther plane)
            behind = fill(im, ~dil(taken, shadow + 2), fill_scale)
            sa = np.clip(1 - (lum(im) + 2) / (lum(behind) + 2), 0, 0.4)  # a drop shadow darkens a little; more is a wrong guess
            sa = cv2.GaussianBlur(sa, (0, 0), 1.0) * z
            rgb = np.where(z[..., None] & (sa[..., None] > a[..., None]), np.uint8(8), rgb)
            a = np.maximum(a, sa)
        if paint and paint[k] is not None:
            rgb = np.where(paint[k][0][..., None], paint[k][1], rgb)
        rgba = np.dstack([rgb, (np.clip(a, 0, 1) * 255).astype(np.uint8)])
        Image.fromarray(rgba).save(out + f'L{k}.webp', quality=92)
        nearer |= m
    # back plate
    unknown = dil(nearer, reach)
    if keep is not None:
        unknown &= ~keep
    if back_fill == 'rows':
        back = rowfill(im, ~unknown, fill_scale)
    elif back_fill == 'mixed':
        # row fill across narrow gaps (a trunk, a post), the smooth fill across wide ones (a crown, a figure)
        run = np.zeros((H, W), np.float32)
        for y in range(H):
            u = unknown[y]
            if not u.any():
                continue
            d = np.diff(np.concatenate([[0], u.view(np.int8), [0]]))
            st, en = np.flatnonzero(d == 1), np.flatnonzero(d == -1)
            for a0, b0 in zip(st, en):
                run[y, a0:b0] = b0 - a0
        w = np.clip((160 - run) / 60, 0, 1).astype(np.float32)
        w = cv2.GaussianBlur(w, (0, 0), 3)[..., None]
        back = (rowfill(im, ~unknown, fill_scale, sy=9) * w + fill(im, ~unknown, fill_scale) * (1 - w)).astype(np.uint8)
    else:
        back = fill(im, ~unknown, fill_scale)
    fa = np.maximum(unknown, cv2.GaussianBlur(unknown.astype(np.float32), (0, 0), 1.5))[..., None]
    back = (im * (1 - fa) + back * fa).astype(np.uint8)
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


def front_ink(p, ink, bottom_rows=6, near=8, minpx=60):
    """The ink connected to the bottom edge (the ground and everything standing on it), plus the small ink pieces within
    `near` px of it (gear teeth, tool handles)."""
    seed = np.zeros_like(ink)
    seed[-bottom_rows:] = True
    f = touching(ink, seed)
    f |= touching(ink & big(ink, minpx), dil(f, near))
    return f


# This video's recipes go here. The pattern (from The Balloon War v2's BW09, a girl at a low table under a lamp):
#
# @recipe
# def r_SC09():
#     """SC09 (the girl at the table). L0 = the girl, her brush, the table and the coral sheet on it (one piece); L3 = the hall
#     with the lamp and its cone. L1, L2 empty."""
#     p = Pic('SC09_girl_table')
#     f = front_ink(p, p.mx < 45)                                                       # the ink standing on the ground
#     f |= snap(p, p.poly([(512, 521), (1047, 521), (1163, 607), (410, 616)]), band=6, ref=8)   # the table top, snapped to its edge
#     f |= touching(p.coral(), dil(f, 3))                                               # the coral sheet lying on it
#     build(p, [close(f, 1), None, None], note='girl + table + coral sheet on L0; hall, lamp and cone on L3')


def quick(name, opts):
    p = Pic(name)
    fill_mode = opts.get('fill', 'smooth')
    shadow = int(opts.get('shadow', 0))
    if 'tiers' in opts:
        cuts = [int(c) for c in opts['tiers'].split(',')][:3]
        lab = tiers(p, cuts)
        ms = [big(close(lab == k, 1), 300) for k in range(3)]
        ms += [None] * (3 - len(ms))
        build(p, ms[:3], shadow=shadow, back_fill=fill_mode, note=f'tone tiers {cuts} (quick mode)')
    else:
        cut = int(opts.get('ink') or 60)
        f = front_ink(p, (p.mx < cut) & (p.r >= p.b - 4))   # warm ink (a teal-black sky is not ink)
        f = close(f, 1)
        masks = [None, None, None]
        masks[int(opts.get('plane', 0))] = f
        build(p, masks, shadow=shadow, back_fill=fill_mode, note=f'ink < {cut} touching the ground on L{opts.get("plane", 0)} (quick mode)')


def main():
    names = [a for a in sys.argv[1:] if not a.startswith('--')]
    opts = dict((a[2:].split('=', 1) + [''])[:2] for a in sys.argv[1:] if a.startswith('--'))
    if not names:
        sys.exit(__doc__)
    if names == ['all']:
        names = sorted(RECIPES)
    for n in names:
        if 'ink' in opts or 'tiers' in opts:
            quick(n, opts)
            continue
        key = next((k for k in RECIPES if n.startswith(k)), None)
        if key is None:
            sys.exit(f'no recipe for {n}; have {sorted(RECIPES)} (or use --ink / --tiers)')
        RECIPES[key]()


if __name__ == '__main__':
    main()
