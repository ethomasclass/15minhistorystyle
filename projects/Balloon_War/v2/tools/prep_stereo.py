"""Turn an aligned stereo pair + a depth map into the layers for src/tests/StereoTest.tsx.

  python3 tools/stereo_depth.py card.tif work lx0 ly0 lx1 ly1 rx0 rx1     # split, align, sparse matches
  python3 tools/mono_depth.py depth_anything_v2_small.onnx work/left.png work/mono.png work/matches.npy
  python3 tools/prep_stereo.py card.tif work public/img/tests/stereo

Writes card.jpg (the whole card, grey), left.jpg / right.jpg (the two photos, the far plane lined up so a flick shows
only real parallax), near.png (the near objects cut out with alpha), bg.jpg (the photo with the near objects painted
out), depth.png (near layer) and depth_bg.png (back layer). Needs opencv-python-headless, numpy, scipy.
"""
import os, sys, cv2, numpy as np

card_path, work, out = sys.argv[1:4]
os.makedirs(out, exist_ok=True)
card = cv2.imread(card_path, 0)
cv2.imwrite(f'{out}/card.jpg', cv2.resize(card, (2400, int(2400 * card.shape[0] / card.shape[1])), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 90])

L = cv2.imread(f'{work}/left.png', 0); R = cv2.imread(f'{work}/right_aligned.png', 0)
m = np.load(f'{work}/matches.npy'); x, y, d = m.T
mono = cv2.imread(f'{work}/mono.png', -1).astype(np.float32) / 65535
# the two prints are slightly sheared: fit the horizontal offset of the far points as a plane and take it out
v = mono[y.astype(int), x.astype(int)]
A = np.c_[x, y, np.ones_like(x)]; far = v < np.percentile(v, 40)
c = np.linalg.lstsq(A[far], d[far], rcond=None)[0]
h, w = R.shape
Rw = cv2.warpAffine(R, np.float32([[1 + c[0], c[1], c[2]], [0, 1, 0]]), (w, h), flags=cv2.INTER_CUBIC | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
L2, R2, mono = L[40:-40, 40:-40], Rw[40:-40, 40:-40], mono[40:-40, 40:-40]
s = 2000 / L2.shape[1]
L = cv2.resize(L2, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
cv2.imwrite(f'{out}/left.jpg', L, [cv2.IMWRITE_JPEG_QUALITY, 90])
cv2.imwrite(f'{out}/right.jpg', cv2.resize(R2, None, fx=s, fy=s, interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 90])
H, W = L.shape
dep = cv2.resize(mono, (W, H), interpolation=cv2.INTER_AREA)

# near objects: much nearer than their surroundings, tall, edges snapped to the photo (dark brick on lighter ground)
k = 351
loc = cv2.GaussianBlur(cv2.erode(dep, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))), (0, 0), 40)
fg = ((dep - loc) > 0.30).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(fg)
keep = np.zeros_like(fg)
for i in range(1, n):
    if st[i, cv2.CC_STAT_HEIGHT] > 0.45 * H:
        keep[lab == i] = 1
fg = cv2.morphologyEx(keep, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
zone = cv2.dilate(fg, np.ones((31, 31), np.uint8)) - cv2.erode(fg, np.ones((31, 31), np.uint8))
g = cv2.GaussianBlur(L, (0, 0), 1.5)
t, _ = cv2.threshold(g[zone > 0], 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
mk = fg.copy(); mk[zone > 0] = (g < t)[zone > 0]
n, lab, st, _ = cv2.connectedComponentsWithStats(mk)
m2 = np.zeros_like(mk)
for i in range(1, n):
    if fg[lab == i].mean() > 0.5 and st[i, cv2.CC_STAT_AREA] > 2000:
        m2[lab == i] = 1
m2 = cv2.morphologyEx(m2, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
alpha = cv2.GaussianBlur((m2 * 255).astype(np.uint8), (0, 0), 1.0)
cv2.imwrite(f'{out}/near.png', cv2.merge([L, L, L, alpha]))

# back layer: paint the near objects out (with grain added back), and a smooth depth under them
band = cv2.dilate(m2, np.ones((15, 15), np.uint8))
Ls = cv2.resize(L, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)
ms = cv2.resize(band, (Ls.shape[1], Ls.shape[0]), interpolation=cv2.INTER_NEAREST) * 255
bg = cv2.resize(cv2.inpaint(Ls, ms, 20, cv2.INPAINT_TELEA), (W, H), interpolation=cv2.INTER_CUBIC)
noise = cv2.GaussianBlur(np.random.default_rng(2).normal(0, 9, (H, W)).astype(np.float32), (0, 0), 0.8)
bg = np.clip(bg.astype(np.float32) + noise, 0, 255).astype(np.uint8)
cv2.imwrite(f'{out}/bg.jpg', np.where(band > 0, bg, L), [cv2.IMWRITE_JPEG_QUALITY, 90])
ds = cv2.resize(dep, (Ls.shape[1], Ls.shape[0]), interpolation=cv2.INTER_AREA)
dbg = cv2.inpaint((ds * 255).astype(np.uint8), ms, 20, cv2.INPAINT_TELEA)
dbg = cv2.bilateralFilter(cv2.resize(dbg, (1024, int(1024 * H / W)), interpolation=cv2.INTER_AREA), 9, 30, 5)
cv2.imwrite(f'{out}/depth_bg.png', cv2.GaussianBlur(dbg, (0, 0), 10))
dn = cv2.dilate(cv2.resize(dep, (1024, int(1024 * H / W)), interpolation=cv2.INTER_AREA), np.ones((9, 9), np.uint8))
cv2.imwrite(f'{out}/depth.png', (cv2.GaussianBlur(dn, (0, 0), 2) * 255).astype(np.uint8))
print('wrote', out)
