# Poster trees painted with the claude-drawing-skill SunlitGreen canopy (angular 'chip' leaves, flat posterised
# olive tones, a lit stripe on each limb), cut out with a transparent background so the SVG scenes can place them.
# The canopy paints onto an opaque canvas, so each tree is painted twice, on black and on white, and
# alpha = 1 - (white - black); colour = black / alpha.
import os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'vendor'))
from sunlitgreen import SunlitGreen

OLIVE = ['#353b22', '#4b522c', '#646b37', '#80864a', '#a2a35e']
BARK, BARK_LIT = '#463b30', '#6e5d49'


def _paint(bg, W, H, fn, seed):
    s = SunlitGreen(W, H, seed=seed, keep_stages=False, light=(-0.6, -0.7, 0.45))
    s.C[:] = bg
    fn(s)
    return s.C.copy()


def cutout(path, W, H, fn, seed=1):
    b = _paint(0.0, W, H, fn, seed)
    w = _paint(1.0, W, H, fn, seed)
    a = np.clip(1 - (w - b).mean(-1), 0, 1)
    rgb = np.where(a[..., None] > 1e-3, b / np.maximum(a[..., None], 1e-3), 0)
    img = np.dstack([np.clip(rgb, 0, 1), a])
    Image.fromarray((img * 255 + 0.5).astype(np.uint8), 'RGBA').save(path)
    return path


def poster_tree(path, W, H, base_x, trunk_top, clumps, branches=(), trunk_w=(26, 10), tones=OLIVE, leaf=16.0, seed=1,
                far=0.0):
    """trunk from (base_x, H) up to trunk_top; branches = list of point paths; clumps = (cx, cy, rx, ry) in px."""
    def fn(s):
        s.limb([(base_x, H + 10), ((base_x + trunk_top[0]) / 2, (H + trunk_top[1]) / 2), trunk_top],
               trunk_w[0], trunk_w[1], colour=BARK, lit=BARK_LIT, seed=seed)
        for i, b in enumerate(branches):
            s.limb(b, max(4, trunk_w[1] * 0.8), 3, colour=BARK, lit=BARK_LIT, seed=seed + i + 1)
        s.canopy(clumps, tones=tones, leaf=leaf, shape='chip', holes=0.0, sub=3.0, mottle=0.08, noise=0.18,
                 levels=(0.0, 0.34, 0.5, 0.64, 0.8), edge_leaves=1.0, airy=0.25, twigs=8, twig_colour=BARK,
                 far=far, haze='#b3bfb8', seed=seed)
    return cutout(path, W, H, fn, seed)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'build/tree_test.png'
    W, H = 700, 1100
    clumps = [(350, 260, 170, 120), (230, 430, 150, 110), (470, 470, 160, 110), (300, 620, 140, 95), (440, 160, 110, 80)]
    br = [[(350, 700), (250, 520), (200, 430)], [(350, 600), (460, 500), (500, 450)], [(350, 450), (420, 260)]]
    poster_tree(out, W, H, 340, (360, 220), clumps, br)
    print('ok', out)


_n = [0]


def scene_tree(x, base, h, lean=0.0, spread=0.42, n_branches=8, seed=1, leaf=30.0, tones=OLIVE, far=0.0,
               airy=0.42, clump=0.065, outdir=None):
    """Grow a poster tree of height h whose trunk foot sits at (x, base) in scene px; return an SVG <image>.
    The canvas is sized from the clumps, so nothing is clipped."""
    outdir = outdir or os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'build')
    r = np.random.default_rng(seed)
    top = (lean * h, -h)
    branches, clumps = [], []
    for i in range(n_branches):
        t = 0.38 + 0.55 * i / max(1, n_branches - 1)
        sx, sy = top[0] * t, top[1] * t
        side = -1 if i % 2 else 1
        reach = h * spread * (0.55 + 0.4 * r.random()) * (1.15 - 0.6 * t)
        ex, ey = sx + side * reach, sy - h * (0.08 + 0.1 * r.random())
        branches.append([(sx, sy), ((sx + ex) / 2, (sy + ey) / 2 - h * 0.03), (ex, ey)])
        rr = h * (clump + 0.035 * r.random())
        clumps.append((ex, ey - rr * 0.2, rr * 1.25, rr))
        if r.random() < 0.7:      # a smaller clump part-way along the branch, so foliage follows the limbs
            q = 0.45 + 0.25 * r.random()
            clumps.append((sx + (ex - sx) * q, sy + (ey - sy) * q - rr * 0.5, rr * 0.8, rr * 0.62))
    rr = h * (clump + 0.03)
    clumps.append((top[0], top[1] + rr * 0.5, rr * 1.2, rr))
    K = np.array(clumps)
    pad = leaf * 2.5 + 20
    x0 = min((K[:, 0] - K[:, 2]).min(), -h * 0.05) - pad
    x1 = max((K[:, 0] + K[:, 2]).max(), h * 0.05) + pad
    y0 = (K[:, 1] - K[:, 3]).min() - pad
    W, H = int(x1 - x0), int(-y0 + 12)
    ox, oy = -x0, -y0          # trunk foot in canvas px
    sh = lambda P: [(px + ox, py + oy) for px, py in P]
    branches = [sh(b) for b in branches]
    clumps = [(cx + ox, cy + oy, a, b) for cx, cy, a, b in clumps]
    T = (top[0] + ox, top[1] + oy)
    # the canopy scales leaves by min(W, H) / 1000; undo that so `leaf` is in scene px
    k = min(W, H) / 1000
    import hashlib
    key = hashlib.md5(repr((h, lean, spread, n_branches, seed, leaf, list(tones), far, airy, clump)).encode()).hexdigest()[:10]
    path = os.path.abspath(os.path.join(outdir, f'tree_{key}.png'))

    def fn(s):
        s.limb([(ox, H + 10), ((ox + T[0]) / 2, (oy + T[1]) / 2), T], h * 0.03, h * 0.009, colour=BARK,
               lit=BARK_LIT, seed=seed)
        for j, b in enumerate(branches):
            s.limb(b, h * 0.009, h * 0.003, colour=BARK, lit=BARK_LIT, seed=seed + j)
        s.canopy(clumps, tones=tones, leaf=leaf / k, shape='chip', holes=0.0, sub=2.0, mottle=0.05, noise=0.1,
                 levels=(0.0, 0.34, 0.5, 0.64, 0.8), airy=airy, twigs=0, far=far, haze='#b3bfb8', seed=seed)
    if not os.path.exists(path):
        cutout(path, W, H, fn, seed)
    return f'<image href="file://{path}" x="{x - ox:.0f}" y="{base - oy:.0f}" width="{W}" height="{H}"/>'
