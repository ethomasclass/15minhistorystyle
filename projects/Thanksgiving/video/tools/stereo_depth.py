"""Split a stereo card into left/right photos, align them, and compute a depth map.
usage: stereo_depth.py card.tif out_dir  lx0 ly0 lx1 ly1  rx0 rx1   (full-res pixel boxes; right uses same y)"""
import sys, os, numpy as np, cv2
src, out = sys.argv[1], sys.argv[2]
lx0, ly0, lx1, ly1, rx0, rx1 = map(int, sys.argv[3:9])
os.makedirs(out, exist_ok=True)
card = cv2.imread(src, cv2.IMREAD_COLOR)
g = cv2.cvtColor(card, cv2.COLOR_BGR2GRAY)
L = g[ly0:ly1, lx0:lx1]; R = g[ly0:ly1, rx0:rx1]
h = min(L.shape[0], R.shape[0]); w = min(L.shape[1], R.shape[1]); L = L[:h, :w]; R = R[:h, :w]
# align R to L with a similarity transform from SIFT matches, then remove the mean horizontal shift
sift = cv2.SIFT_create(8000)
k1, d1 = sift.detectAndCompute(L, None); k2, d2 = sift.detectAndCompute(R, None)
m = cv2.BFMatcher().knnMatch(d2, d1, k=2)
good = [a for a, b in m if a.distance < 0.7 * b.distance]
p2 = np.float32([k2[a.queryIdx].pt for a in good]); p1 = np.float32([k1[a.trainIdx].pt for a in good])
# vertical alignment only: y1 = a*x2 + b*y2 + c (robust); horizontal offset left free (that's the depth)
rng = np.random.default_rng(1); best = None
A = np.c_[p2[:, 0], p2[:, 1], np.ones(len(p2))]
for _ in range(3000):
    i = rng.choice(len(p2), 3, replace=False)
    try: sol = np.linalg.solve(A[i], p1[i, 1])
    except np.linalg.LinAlgError: continue
    err = np.abs(A @ sol - p1[:, 1]); n = (err < 1.5).sum()
    if best is None or n > best[0]: best = (n, sol)
inl = np.abs(A @ best[1] - p1[:, 1]) < 1.5
sol = np.linalg.lstsq(A[inl], p1[inl, 1], rcond=None)[0]
dx = p1[inl, 0] - p2[inl, 0]
x0 = float(np.median(dx))
print('matches', len(good), 'y-inliers', int(inl.sum()), 'ymodel', np.round(sol, 4).tolist(), 'median dx', round(x0, 1))
M = np.float32([[1, 0, x0], [sol[0], sol[1], sol[2]]])
Rw = cv2.warpAffine(R, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
dx = dx - x0
np.save(os.path.join(out, 'matches.npy'), np.c_[p1[inl], dx])
print('disparity spread (full res) %.1f..%.1f' % (np.percentile(dx, 1), np.percentile(dx, 99)))
# disparity at half resolution
s = 0.5
Ls = cv2.resize(L, None, fx=s, fy=s, interpolation=cv2.INTER_AREA); Rs = cv2.resize(Rw, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
cl = cv2.createCLAHE(2.0, (8, 8)); Ls = cl.apply(Ls); Rs = cl.apply(Rs)
lo = int(np.floor(np.percentile(dx, 1) * s)) - 8; hi = int(np.ceil(np.percentile(dx, 99) * s)) + 8
# SGBM wants left-minus-right positive; our dx = right->left offset after warp. Shift R so min disparity is >= 0
shift = -lo if lo < 0 else 0
nd = ((hi - lo) // 16 + 1) * 16
RsS = np.roll(Rs, shift, axis=1)
bs = 7
sg = cv2.StereoSGBM_create(minDisparity=0, numDisparities=nd, blockSize=bs, P1=8*bs*bs, P2=32*bs*bs, uniquenessRatio=8,
                           speckleWindowSize=120, speckleRange=2, disp12MaxDiff=2, mode=cv2.STEREO_SGBM_MODE_HH)
disp = sg.compute(Ls, RsS).astype(np.float32) / 16.0
valid = disp > 0
print('disp range', lo, hi, 'valid %.2f' % valid.mean())
# fill holes by inpainting, then edge-aware smoothing guided by the photo
d = disp.copy(); d[~valid] = 0
dn = cv2.normalize(d, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
filled = cv2.inpaint(dn, (~valid).astype(np.uint8) * 255, 9, cv2.INPAINT_TELEA)
sm = cv2.bilateralFilter(filled, 15, 40, 15)
sm = cv2.medianBlur(sm, 9)
cv2.imwrite(os.path.join(out, 'left.png'), L); cv2.imwrite(os.path.join(out, 'right_aligned.png'), Rw)
cv2.imwrite(os.path.join(out, 'disp_raw.png'), dn); cv2.imwrite(os.path.join(out, 'depth.png'), sm)
col = cv2.applyColorMap(sm, cv2.COLORMAP_TURBO); cv2.imwrite(os.path.join(out, 'depth_preview.jpg'), cv2.resize(col, None, fx=0.5, fy=0.5))
