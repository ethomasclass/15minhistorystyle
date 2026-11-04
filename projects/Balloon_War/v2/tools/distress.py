"""A wear mask for printed things (a logo sticker, a stamp): white with alpha, where the alpha has lost ink in specks,
worn patches, scratches and cracks. Use it as a CSS mask over the logo.
usage: distress.py out.png [width=1600] [height=600] [seed=1] [wear=0.5]"""
import sys
import numpy as np
import cv2
out = sys.argv[1]
W = int(sys.argv[2]) if len(sys.argv) > 2 else 1600
H = int(sys.argv[3]) if len(sys.argv) > 3 else 600
seed = int(sys.argv[4]) if len(sys.argv) > 4 else 1
wear = float(sys.argv[5]) if len(sys.argv) > 5 else 0.5
rng = np.random.default_rng(seed)

def noise(scale, octaves=3):
    o = np.zeros((H, W), np.float32); amp = 1
    for k in range(octaves):
        s = max(2, int(scale / 2 ** k))
        o += amp * cv2.resize(rng.random((H // s + 2, W // s + 2)).astype(np.float32), (W, H), interpolation=cv2.INTER_CUBIC)
        amp *= 0.5
    return (o - o.min()) / (o.max() - o.min())

a = np.ones((H, W), np.float32)
# worn patches: big soft areas where the ink has rubbed thin, with ragged edges
patches = noise(W / 6, 4)
a -= np.clip((patches - (0.78 - 0.25 * wear)) * 6, 0, 1) * 0.85
# fine specks of lost ink
specks = noise(6, 2)
a -= (specks > (0.82 - 0.12 * wear)).astype(np.float32) * 0.9
# scratches: long thin lines
sc = np.zeros((H, W), np.float32)
for i in range(int(6 + 10 * wear)):
    p = np.array([rng.uniform(0, W), rng.uniform(0, H)]); ang = rng.uniform(-0.5, 0.5) + (np.pi if rng.random() < 0.5 else 0)
    q = p + np.array([np.cos(ang), np.sin(ang)]) * rng.uniform(W * 0.1, W * 0.5)
    cv2.line(sc, tuple(p.astype(int)), tuple(q.astype(int)), 1.0, int(rng.integers(1, 3)), cv2.LINE_AA)
# cracks: branching random walks
for i in range(int(4 + 8 * wear)):
    p = np.array([rng.uniform(0, W), rng.uniform(0, H)]); ang = rng.uniform(0, 2 * np.pi); path = [p.copy()]
    for s in range(int(rng.integers(8, 30))):
        ang += rng.normal(0, 0.5); p = p + np.array([np.cos(ang), np.sin(ang)]) * rng.uniform(8, 20); path.append(p.copy())
    cv2.polylines(sc, [np.array(path, np.int32)], False, 1.0, 2, cv2.LINE_AA)
a -= sc * 0.95
# overall fade, uneven
a *= 0.55 + 0.35 * noise(W / 3, 2)
a = np.clip(a, 0, 1)
img = np.dstack([np.full((H, W), 255, np.uint8)] * 3 + [(a * 255).astype(np.uint8)])
cv2.imwrite(out, img)
print(out, W, H)
