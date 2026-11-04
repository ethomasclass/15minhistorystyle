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
    no streaks; or row by row for banded skies and beaches), except `keep` areas.
  * `alpha`: an optional float alpha for a plane (a soft matte, e.g. BW15's chimney smoke fading into the sky).
  * `shadow`: the paper-cut style paints a soft drop shadow beside each shape; it travels with the shape (black + alpha) and is
    filled out of the planes behind, so no shadow outline is left there.
Helpers for recipes: front_ink (ink connected to the ground), tiers (flat tones by brightness, rims kept with the nearer
shape), snap (a rough polygon moved onto the painting's real edge), below_top (a ground plane's extension stays below its
top edge), touching / big / close.
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


def rowfill(im, known, scale=0.5):
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
    sm = cv2.GaussianBlur(out, (0, 0), sigmaX=2, sigmaY=9)
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
        back = (rowfill(im, ~unknown, fill_scale) * w + fill(im, ~unknown, fill_scale) * (1 - w)).astype(np.uint8)
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


def front_ink(p, ink, bottom_rows=6, near=8, minpx=60):
    """The ink connected to the bottom edge (the ground and everything standing on it), plus the small ink pieces within
    `near` px of it (gear teeth, tool handles)."""
    seed = np.zeros_like(ink)
    seed[-bottom_rows:] = True
    f = touching(ink, seed)
    f |= touching(ink & big(ink, minpx), dil(f, near))
    return f


@recipe
def r_BW13():
    """BW13 (the presses). The depth split put the paper ribbons, the lamp cones and the presses on different planes in pieces
    (ribbons and cones ghosted and split). Now: L0 = the presses, the men, the floor and the paper ribbons running through the
    presses (one piece); L3 = the hall behind with the hanging lamps and their light cones whole (each lamp with its own
    cone), the far presses and the fog. L1, L2 empty."""
    p = Pic('BW13_presses')
    ink = (p.mx < 62) & (p.r >= p.b)                 # warm ink (the teal-black ceiling is not ink)
    f = front_ink(p, ink)
    core = touching((p.lum > 225) & (p.r - p.b < 30), dil(f, 4))       # the paper's lit faces
    pale = (p.lum > 150) & (p.r - p.b < 36)
    shade = pale & (p.yy > 2 * 470) & (p.xx < 2 * 1000)   # its shaded turns (low in the frame only: higher up the fog is as pale)
    paper = touching(shade | core, core)
    f = close(f | paper, 1)
    f |= touching(ink & big(ink, 60), dil(f, 8))      # roller ends and handles that only touch the paper
    # the paper seen through the holes in a press frame: a hole that is mostly paper-coloured goes whole with the press
    lab, n = ndi.label(~f)
    for i in range(1, n + 1):
        h = lab == i
        if h.sum() < 0.004 * h.size and not (h[0].any() or h[-1].any() or h[:, 0].any() or h[:, -1].any()) and pale[h].mean() > 0.4:
            f |= h
    build(p, [f, None, None], note='presses, men, floor, paper on L0; lamps with their cones and the hall on L3')


@recipe
def r_BW08():
    """BW08 (the girls on the theatre floor). The depth split doubled some girls (half a girl on each of two planes) and cut the
    lamps from their cones. The girls are flat tones, darker = nearer, with a clear gap between the rows (mx 12-20 front row,
    28-66 the second row, 72+ the faint third row in the fog), so the split is by tone, each girl whole:
      L0  the front row (near-black), their tables whole with the sheets on them (the coral sheet included), cushions, floor edge
      L1  the second row (dark grey; the fog is as dark only where it is teal, so teal-ness `t` keeps it out)
      L3  the theatre, the fog, the faint third row, the lamps with their cones, the light pools on the floor
    L2 is empty."""
    p = Pic('BW08_theater_girls')
    t = (p.g + p.b) / 2 - p.r                      # teal-ness: the fog is teal, the girls neutral
    low = p.yy > 2 * 470                           # below the lamps
    f0 = big((p.mx < 24) & low, 2000)
    f0 = snap(p, f0, band=12, ref=14) & low        # hazy edges of a front girl (a touch lighter) go with her, by local colour
    tables = [[(690, 551), (768, 551), (845, 642), (640, 642), (640, 600)],   # the long middle table
              [(930, 588), (1120, 588), (1135, 645), (930, 645)],              # the right table, cream sheets
              [(1290, 553), (1376, 553), (1376, 650), (1290, 650)],            # the far right table
              [(210, 600), (410, 600), (415, 650), (210, 650)]]                # the coral sheet's table
    for tb in tables:
        f0 |= snap(p, p.poly(tb), band=6, ref=8)
    f0 |= touching(p.coral(), dil(f0, 3))
    f1 = big((p.mx >= 24) & (p.mx < 68) & (t < 12.5) & low & ~dil(f0, 3), 3000)
    f1 |= dil(f1, 12) & (p.mx < 82) & (t < 12.5) & ~dil(f0, 3)        # the second-row girls' lighter edges
    f1 = ndi.binary_fill_holes(big(close(f1, 2), 3000)) & ~f0
    f1 = ndi.binary_opening(f1, iterations=2)
    # extend only a little under nearer girls: a long extension paints a grey copy of the front girl's outline onto the fog
    build(p, [f0, f1, None], extend=24, note='front row + tables on L0, second row on L1, lamps+cones+fog+third row on L3')


@recipe
def r_BW09():
    """BW09 (Rei at the table). The depth split put the coral sheet and the table's top on two planes (the sheet's edge doubled)
    and smeared table pieces onto the plane behind. Now: L0 = Rei, the brush, the table and the coral sheet on it (one piece);
    L3 = the theatre with the lamp and its cone. L1, L2 empty."""
    p = Pic('BW09_rei')
    f = front_ink(p, p.mx < 45)
    f |= snap(p, p.poly([(512, 521), (1047, 521), (1163, 607), (1163, 616), (410, 616)]), band=6, ref=8)   # the table top
    f |= touching(p.coral(), dil(f, 3))
    f = close(f, 1)
    build(p, [f, None, None], note='Rei + table + coral sheet on L0; theatre, lamp and cone on L3')


@recipe
def r_BW07():
    """BW07 (the weatherman on the roof). The depth split put the man on one plane and the roof he stands on on another (his
    feet slid on it), and left a grey ghost of him in the sky. Now: L0 = the man, his theodolite, the building and the near ground
    (one ink piece); L2 = the fields from the near band up to the village line, with the dark houses, trees and the field dividers
    (one receding ground); L3 = the mist band, the mountains, the sky and the balloon. L1 empty."""
    p = Pic('BW07_weatherman')
    f = front_ink(p, (p.mx < 60) & (p.r >= p.b - 4))
    seed = np.zeros_like(f)
    seed[-4:] = True
    g = touching((p.lum < 160) & (p.yy > 2 * 495), seed | dil(f, 2)) & ~f
    g = ndi.binary_fill_holes(g) & ~f
    g &= ~(p.poly([(250, 300), (490, 300), (490, 535), (250, 535)]))   # nothing between his legs and the tripod's
    build(p, [f, None, g], ext=[None, None, dil(g, 90) & below_top(g, f)], shadow=22, back_fill='rows', note='man + roof + near ground on L0, the fields on L2, mist/mountains/sky/balloon on L3')


@recipe
def r_BW10():
    """BW10 (the Wyoming flash). The depth split put the fence, windmill, men and barn on one plane but left pieces of the fence
    rails and the windmill hub on the plane behind (ghost rails, a doubled hub). Now: L0 = all the ink (ground, fence, windmill,
    men, barn), one piece; L2 = the teal mesas; L3 = the sky, the sun, the coral flash and parachute (as they were). L1 empty."""
    p = Pic('BW10_wyoming_flash')
    f = front_ink(p, (p.mx < 60) & (p.r >= p.b - 6))
    seed = np.zeros_like(f)
    seed[-4:] = True
    g = touching((((p.g - p.r) > 30) & (p.yy > 2 * 400)) | f, seed) & ~f
    g |= ndi.binary_fill_holes(g | f) & ~(g | f) & (p.yy > 2 * 450)     # the dark ground strips between the fence rails
    build(p, [f, None, g], ext=[None, None, dil(g, 90) & below_top(g, f)], shadow=20, note='ink (fence, windmill, men, barn, ground) on L0, mesas on L2, sky on L3')


@recipe
def r_BW11():
    """BW11 (smokejumpers; not used in a chapter yet). The depth split cut both smoke columns in two (their tops on the back plate,
    the rest a plane nearer: a notch opened when they slid) and left ghost tree tips behind the ridge. Now: L0 = all the ink
    (the near slope and the tree ridge, black on black); L2 = the two smoke columns whole, with the plane; L3 = the sky, the
    hills and the parachutes, filled row by row. L1 empty."""
    p = Pic('BW11_smokejumpers')
    f = front_ink(p, (p.mx < 50) & (p.r >= p.b - 6))
    sm = big((p.lum > 150) & ((p.r - p.b) > 14) & (p.r >= p.g - 2) & (p.xx > 2 * 600), 20000)
    sm = ndi.binary_fill_holes(close(sm, 2))
    # the pale horizon strip has the smoke's colour: keep it only where a column runs through it
    a, b = 2 * 296, 2 * 350
    cols = np.convolve((sm[a - 4] | sm[b + 4]).astype(float), np.ones(41), 'same') > 0
    strip = np.zeros_like(sm)
    strip[a:b] = True
    sm &= ~(strip & ~cols[None, :])
    sm = big(sm, 20000)
    pale = (p.lum > 120) & ((p.r - p.b) > 8) & (p.yy > 2 * 400)
    sm |= touching(pale, dil(sm, 12)) & ~f               # the smoke's last puffs between the tree tips
    box = p.poly([(1000, 186), (1162, 186), (1162, 234), (1000, 234)])
    local = cv2.GaussianBlur(p.lum.astype(np.float32), (0, 0), 25)
    plane = dil(big(box & (p.lum < local - 12), 200), 2)   # the plane and its thin wings, darker than the sky around
    sm |= plane
    build(p, [f, None, sm & ~f], extend=16, shadow=16, back_fill='rows', note='ink on L0, smoke columns + plane on L2, sky/hills/parachutes on L3')


@recipe
def r_BW06():
    """BW06 (the raid over Tokyo). The depth split cut the left house in three (its upper roof, wall and lower roof on different
    planes) and put pieces of the right house's eaves on the plane behind. Now, by colour: L0 = the warm-brown houses (all the near
    town, one piece; they overlap each other anyway); L1 = the darkest teal town with the pagoda, and the two bombers; L2 = the
    lighter teal town behind; L3 = the hills and the sky."""
    p = Pic('BW06_raid_tokyo')
    f0 = front_ink(p, (p.r >= p.b + 4) & (p.mx < 110))
    f0 = ndi.binary_fill_holes(f0)                   # the darker tiles inside the roofs
    teal = p.g > p.r + 12
    d1 = close(touching(teal & (p.lum < 42) & ~f0, p.poly([(560, 560), (1000, 560), (1000, 640), (560, 640)])), 1)
    d1 = ndi.binary_fill_holes(d1) & ~f0
    bombers = big((p.r >= p.b) & (p.mx < 70) & (p.yy < 2 * 300), 2000)
    local = cv2.GaussianBlur(p.lum.astype(np.float32), (0, 0), 20)
    bombers |= touching((p.lum < local - 15) & (p.yy < 2 * 300), dil(bombers, 3))   # the thin propellers
    d2 = big(teal & (p.lum >= 40) & (p.lum < 100) & (p.yy > 2 * 380) & ~f0 & ~d1, 3000)
    d2 = ndi.binary_fill_holes(d2 | d1 | f0) & ~(d1 | f0) & (p.yy > 2 * 380)
    build(p, [f0, d1 | bombers, d2], shadow=16, note='houses on L0, dark town + pagoda + bombers on L1, lighter town on L2')


@recipe
def r_BW15():
    """BW15 (the boy outside the house, Aug 15 in Japan). The depth split left dashed ghost lines of the house's edges on the
    plane behind, specks around the corn, and the chimney smoke on another plane than its chimney. Now: L0 = the warm ink (the
    ground, the bean poles, the boy, the corn); L1 = the house whole (with its window and radio), the village, the garden and
    the dark hill at left, plus the chimney smoke (a soft matte: it fades into the sky); L3 = the sky, the mist and the pale
    hills. L2 empty."""
    p = Pic('BW15_aug15_japan')
    f0 = front_ink(p, (p.mx < 40) & (p.r >= p.b - 3))
    beans = f0 & (p.yy < 2 * 640) & (p.xx < 2 * 430)     # the bean poles stand against the house: they go with it (they cross
    f0 &= ~beans                                         # its window, whose bars are the same ink)
    house = snap(p, p.poly([(330, 145), (590, 326), (548, 336), (548, 598), (120, 598), (120, 336), (75, 328)]), band=16, ref=18)
    seed = np.zeros_like(f0)
    seed[-4:] = True
    lim = np.where(p.xx > 2 * 548, p.yy > 2 * 388, p.yy > 2 * 300)    # below the hill line (right of the house: below the mist)
    v = touching((p.lum < 125) & (p.g >= p.r) & ~f0 & lim, seed | dil(f0, 3)) | house | beans
    # the smoke: one grey-teal column (core ~ #64797 7) laid semi-transparently over the sky, the mist and the hill, down to the
    # chimney. It goes on L1 with the village and its chimney, un-mixed: pure smoke colour + alpha, where alpha comes from how
    # much darker each pixel is than the background beside it (the lower of the brightest pixels to its left and to its right,
    # so a slanting hill edge is not taken for smoke). The back plate gets the background filled row by row.
    zone = p.poly([(872, 0), (995, 0), (995, 392), (950, 392), (950, 470), (910, 470), (910, 392), (872, 392)])
    d = np.abs(p.im.astype(np.float32) - rowfill(p.im, ~zone, 0.5).astype(np.float32)).sum(-1) * zone
    wgt = np.clip(d - 20, 0, None)
    cx = (wgt * p.xx).sum(1) / np.maximum(wgt.sum(1), 1e-3)
    ok = wgt.sum(1) > 50
    rows = np.arange(p.H)
    cx = ndi.uniform_filter1d(np.interp(rows, rows[ok], cx[ok]), 41)
    zone = (np.abs(p.xx - cx[:, None]) < 2 * 24) & (p.yy < 2 * 446)          # down to the chimney top
    L = p.lum.astype(np.float32)
    win = 2 * 26
    mx_l = ndi.maximum_filter1d(L, win, axis=1, origin=win // 2 - 1)          # brightest in [x - win, x)
    mx_r = ndi.maximum_filter1d(L, win, axis=1, origin=-(win // 2))          # brightest in (x, x + win]
    bgl = np.minimum(mx_l, mx_r)
    S = np.array([100, 121, 119], np.float32)
    Sl = float(S @ np.array([0.299, 0.587, 0.114], np.float32))
    sa = np.clip((bgl - L - 3) / np.maximum(bgl - Sl, 8), 0, 1)
    sa = cv2.GaussianBlur(sa, (0, 0), 1.0) * cv2.GaussianBlur(ero(zone, 4).astype(np.float32), (0, 0), 3)
    sa[v & ~f0] = 0
    smoke = sa > 0.04
    a1 = np.maximum(soft(v & ~f0), np.where(f0, 0, sa))
    paint = (smoke & ~v, np.broadcast_to(S.astype(np.uint8), p.im.shape))
    build(p, [f0, v | smoke, None], alpha=[None, a1, None], paint=[None, paint, None], shadow=14, back_fill='rows',
          note='ink + boy + corn on L0, house + village + smoke on L1, sky/mist/hills on L3')


@recipe
def r_BW16():
    """BW16 (the bookstore). The depth split put the shop front on one plane and the lit window behind it (the cream light, the
    photograph, the shelf of books) on another, with smears under the frame, and left the window's light and frame edges
    ghosting. Now: L0 = the whole shop (awning, frame, the window and everything in it, the woman at its door, the counter) and
    the near ground, one piece; L3 = the street (one receding alley: buildings, poles, wires). L1, L2 empty. The photograph's
    glow (ch09 Bookstore, plane 1) rides L1's weight, a pixel or two from L0 with that camera move."""
    p = Pic('BW16_bookstore')
    comp = front_ink(p, (p.mx < 32) & (p.r >= p.b))
    shop = np.zeros_like(comp)
    for y in range(p.H):
        xs = np.flatnonzero(comp[y, 2 * 600:])
        if len(xs):
            shop[y, 2 * 600 + xs[0]:] = True
    f = (comp | shop)
    f = close(f, 2)
    build(p, [f, None, None], shadow=12, note='the shop (front, window, woman, counter) + ground on L0, the street on L3')


def beach(name, plane, balloon=False):
    p = Pic(name)
    f = front_ink(p, (p.mx < 60) & (p.r >= p.b - 4))        # the boys, their ropes, the gas cylinders, the near ground
    if balloon:
        # the balloon drawn by tools/round_balloon.py (centre 730,524, r 272 in painting px), its shroud lines and the rope, whole
        cx, cy, R = 730, 524, 272
        disc = (p.xx - cx) ** 2 + (p.yy - cy) ** 2 <= (R + 3) ** 2
        box = (p.xx > cx - R - 12) & (p.xx < cx + R + 12) & (p.yy > cy) & (p.yy < cy + R + 140)
        lines = touching(box & (p.lum < 70), dil(disc, 4) | f)
        f |= disc | lines | touching(p.coral(), dil(disc, 2))
    masks = [None, None, None]
    masks[plane] = f
    build(p, masks, shadow=20, back_fill='rows', note='boys, cylinders, ground' + (', the balloon and its lines' if balloon else '') +
          f' on L{plane}; sand, sea, hills and sky on L3 (row fill)')


@recipe
def r_BW01():
    """BW01 (the beach at dawn, the balloon held on its rope). After the depth split and tools/bw01_balloon_fix.py the boys,
    the balloon and the ground sat on L1 but the cylinders' and boys' outlines and drop shadows were left as broken dark dashes on
    the sand plane behind, with an opaque box of sea under the balloon. Now: L1 (the boys' plane, as before) = the boys, the
    cylinders, the near ground, and the drawn balloon with its shroud lines and rope, straight from the painting (it replaces
    bw01_balloon_fix.py); L3 = the sand, the sea, the hills and the sky, filled row by row. L0, L2 empty."""
    beach('BW01_beach_dawn', 1, balloon=True)


@recipe
def r_BW02():
    """BW02 (the release: the same beach, no balloon; ch04 lets the balloon_ring cut-out rise on plane 3). Same ghost dashes
    as BW01 on the sand plane. Now: L0 = the boys, the cylinders and the near ground (as before); L3 = sand, sea, hills, sky
    (row fill: seamless for the horizontal bands). L1, L2 empty."""
    beach('BW02_release', 0)


@recipe
def r_BW04():
    """BW04 (the road near Bly). The depth split cut the trees across planes and left the near trees' branch outlines, bits of
    sky and a car-shaped smear on the plane behind. The painting is flat tones in tiers (max RGB: near ink < 22, the second row
    of trees 30-45, the forest band 60-75, hills and sky > 100), so each tier is a plane, every tree whole:
      L0 the near trees, the car and the road; L1 the second row of trees and their slope; L2 the forest band; L3 hills and sky."""
    p = Pic('BW04_bly_road')
    lab = tiers(p, [22, 52, 100])
    ms = [big(close(lab == k, 1), 300) for k in range(3)]
    build(p, ms, shadow=12, back_fill='mixed', note='tone tiers: near trees + car + road L0, second row L1, forest band L2, hills + sky L3')


@recipe
def r_BW05():
    """BW05 (the cranes in the woods). The depth split left bits of the near bushes on a plane of their own (torn from the
    bushes) and dark specks of branches behind the trees. Now: L0 = all the near ink (trees, branches, ground, bushes, the stone)
    with the four strings of coral cranes whole (strings, cranes and their shading: what differs from the forest filled across
    each string's strip); L3 = the forest behind, the hills and the sky. L1, L2 empty. (The second-row forest has the dark sky's
    tone, so it is not split from it.)"""
    p = Pic('BW05_cranes')
    lab = tiers(p, [22])
    f = big(lab == 0, 300)
    strips = np.zeros_like(f)
    for x, y0, y1 in [(323, 300, 500), (422, 300, 500), (451, 300, 560), (481, 330, 510)]:
        strips |= p.poly([(x - 26, y0), (x + 26, y0), (x + 26, y1), (x - 26, y1)])
    bg = rowfill(p.im, ~strips, 0.5).astype(np.float32)
    d = np.abs(p.im.astype(np.float32) - bg).sum(-1)
    cranes = big(close(strips & (d > 30), 2), 150) | (strips & p.coral())
    f |= dil(cranes, 1) & strips
    build(p, [f, None, None], shadow=12, back_fill='mixed', note='near ink + the crane strings on L0, the forest/hills/sky on L3')


if __name__ == '__main__':
    main()
