"""Make an archival photo look like a worn, creased print (no border): fold lines with a light ridge and a dark valley,
a web of fine cracks, chipped and torn edges with white paper fibres, a few stains, grain. Output is a PNG with alpha,
so the photo sits straight on the board.

  python3 tools/crease.py in.jpg out.png [--seed N] [--width 900] [--tone 0.12] [--folds 2] [--tear 1]

--tone   warmth (0 = neutral grey, 0.12 = faintly aged, 0.3 = sepia). The channel stays near-B&W, so the default is low.
--folds  how many long creases (1-3)
--tear   0 = edges only chipped, 1 = one bigger torn bite, 2 = two
"""
import argparse
import numpy as np
import cv2

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--seed', type=int, default=1)
ap.add_argument('--width', type=int, default=900)
ap.add_argument('--tone', type=float, default=0.12)
ap.add_argument('--folds', type=int, default=2)
ap.add_argument('--tear', type=int, default=1)
ap.add_argument('--crop', default='', help='x0,y0,x1,y1 as fractions: cut the photo out of its mount first (no frames)')
a = ap.parse_args()
rng = np.random.default_rng(a.seed)

img = cv2.imread(a.src, cv2.IMREAD_GRAYSCALE)
if a.crop:
    x0, y0, x1, y1 = [float(v) for v in a.crop.split(',')]
    hh, ww = img.shape
    img = img[int(y0 * hh):int(y1 * hh), int(x0 * ww):int(x1 * ww)]
h0, w0 = img.shape
W = a.width; H = int(W * h0 / w0)
img = cv2.resize(img, (W, H), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
# contrast like an old silver print: lift the blacks a little, keep the highlights
lo, hi = np.percentile(img, [1, 99])
img = np.clip((img - lo) / max(1e-3, hi - lo), 0, 1)
img = 0.08 + 0.86 * img

def smooth_noise(scale, octaves=3):
    out = np.zeros((H, W), np.float32)
    amp = 1.0
    for o in range(octaves):
        s = max(2, int(scale / (2 ** o)))
        n = rng.random((H // s + 2, W // s + 2)).astype(np.float32)
        out += amp * cv2.resize(n, (W, H), interpolation=cv2.INTER_CUBIC)
        amp *= 0.5
    return out / out.max()

shade = np.zeros((H, W), np.float32)    # added light (+) / shadow (-)
cracks = np.zeros((H, W), np.float32)   # paper showing through (0..1)

# --- folds: a long, slightly wandering line; light ridge on one side, dark valley on the other, a bend in the tone
for f in range(a.folds):
    if rng.random() < 0.5:   # roughly vertical
        p0 = np.array([rng.uniform(0.2, 0.8) * W, -10.0]); p1 = np.array([rng.uniform(0.2, 0.8) * W, H + 10.0])
    else:                    # roughly horizontal or diagonal
        p0 = np.array([-10.0, rng.uniform(0.15, 0.85) * H]); p1 = np.array([W + 10.0, rng.uniform(0.15, 0.85) * H])
    n = 40
    t = np.linspace(0, 1, n)[:, None]
    pts = p0 + (p1 - p0) * t
    normal = np.array([-(p1 - p0)[1], (p1 - p0)[0]]); normal /= np.linalg.norm(normal)
    pts += normal * (np.cumsum(rng.normal(0, 1.2, n)))[:, None]
    ridge = np.zeros((H, W), np.float32); valley = np.zeros((H, W), np.float32)
    cv2.polylines(ridge, [pts.astype(np.int32)], False, 1.0, 2, cv2.LINE_AA)
    cv2.polylines(valley, [(pts + normal * 2.5).astype(np.int32)], False, 1.0, 2, cv2.LINE_AA)
    shade += cv2.GaussianBlur(ridge, (0, 0), 1.0) * 0.45 - cv2.GaussianBlur(valley, (0, 0), 1.4) * 0.35
    # the paper is bent: one side of the fold a touch lighter
    yy, xx = np.mgrid[0:H, 0:W]
    side = ((xx - p0[0]) * normal[0] + (yy - p0[1]) * normal[1])
    shade += np.clip(side / (W * 0.6), -1, 1) * 0.04
    # cracks crowd along the fold
    for k in range(int(10 + rng.random() * 10)):
        i = rng.integers(0, n)
        cracks_seed = pts[i] + rng.normal(0, 6, 2)
        p = cracks_seed.copy()
        d = (p1 - p0) / np.linalg.norm(p1 - p0) * (1 if rng.random() < 0.5 else -1)
        path = [p.copy()]
        for s in range(int(rng.integers(6, 22))):
            ang = np.arctan2(d[1], d[0]) + rng.normal(0, 0.6)
            d = np.array([np.cos(ang), np.sin(ang)])
            p = p + d * rng.uniform(5, 14)
            path.append(p.copy())
        cv2.polylines(cracks, [np.array(path, np.int32)], False, rng.uniform(0.5, 1.0), 1, cv2.LINE_AA)

# --- a web of fine cracks over the whole print (random walks that branch)
for k in range(int(28 + rng.random() * 20)):
    p = np.array([rng.uniform(0, W), rng.uniform(0, H)])
    ang = rng.uniform(0, np.pi * 2)
    path = [p.copy()]
    for s in range(int(rng.integers(5, 26))):
        ang += rng.normal(0, 0.5)
        p = p + np.array([np.cos(ang), np.sin(ang)]) * rng.uniform(6, 18)
        path.append(p.copy())
        if rng.random() < 0.08:
            q = p.copy(); qa = ang + rng.choice([-1, 1]) * rng.uniform(0.6, 1.2)
            sub = [q.copy()]
            for _ in range(int(rng.integers(3, 9))):
                qa += rng.normal(0, 0.5); q = q + np.array([np.cos(qa), np.sin(qa)]) * rng.uniform(5, 12); sub.append(q.copy())
            cv2.polylines(cracks, [np.array(sub, np.int32)], False, rng.uniform(0.3, 0.8), 1, cv2.LINE_AA)
    cv2.polylines(cracks, [np.array(path, np.int32)], False, rng.uniform(0.35, 0.9), 1, cv2.LINE_AA)

# --- stains and scuffs
blot = smooth_noise(min(W, H) / 3)
stain = np.clip((blot - 0.6) * 3, 0, 1) * 0.12
scuff = np.clip((smooth_noise(min(W, H) / 30, 2) - 0.85) * 6, 0, 1) * 0.05

# --- edges: worn, chipped, and a torn bite or two
edge = smooth_noise(min(W, H) / 14, 4)
yy, xx = np.mgrid[0:H, 0:W]
dist = np.minimum(np.minimum(xx, W - 1 - xx), np.minimum(yy, H - 1 - yy)).astype(np.float32)
alpha = (dist > 3 + edge * 14).astype(np.float32)
for b in range(a.tear):
    # a bite out of one side
    side = rng.integers(0, 4)
    c = rng.uniform(0.2, 0.8)
    cx, cy = [(c * W, 0), (W, c * H), (c * W, H), (0, c * H)][side]
    r = rng.uniform(0.07, 0.13) * min(W, H)
    wob = smooth_noise(min(W, H) / 20, 3)
    bite = ((xx - cx) ** 2 + (yy - cy) ** 2) < (r * (0.75 + 0.5 * wob)) ** 2
    alpha[bite] = 0
alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
# white paper fibres along every torn edge: a thin bright band just inside the edge
inner = cv2.erode(alpha, np.ones((5, 5), np.uint8))
fibre = np.clip(alpha - inner, 0, 1) * (0.55 + 0.45 * smooth_noise(6, 2))
edge_wear = np.clip(1 - dist / 40, 0, 1) * 0.10

# --- put it together
tone = img + shade - stain + scuff + edge_wear
tone = np.where(cracks > 0, tone * (1 - cracks) + (0.93) * cracks, tone)
tone = np.where(fibre > 0, tone * (1 - fibre) + 0.95 * fibre, tone)
tone += rng.normal(0, 0.025, (H, W)).astype(np.float32)
tone = np.clip(tone, 0, 1)
# warmth: a faint aged paper colour, mostly in the lights
warm = np.array([0.94, 0.90, 0.80], np.float32)       # RGB of aged paper
rgb = np.stack([tone, tone, tone], -1)
rgb = rgb * (1 - a.tone) + rgb * warm * a.tone + (1 - rgb) * 0.0
out = np.dstack([(rgb[..., ::-1] * 255).astype(np.uint8), (alpha * 255).astype(np.uint8)])
cv2.imwrite(a.out, out)
print(a.out, W, H)
