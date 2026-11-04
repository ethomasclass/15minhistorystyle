"""Trace a real portrait into a silhouette: background removed (rembg mask), cut off at the chest with the curved
"bust" line of a period paper silhouette, smoothed. Writes a filled PNG (alpha) and an SVG outline path.

  python3 tools/silhouette.py photo.jpg mask.png out_stem --cut 0.62 [--depth 0.10] [--fill-shoulders]

--cut              where the bust line sits (fraction of the image height)
--fill-shoulders   for vignetted portraits: square off the shoulders below the widest row, so the bust isn't ragged
"""
import argparse, json
import numpy as np, cv2

ap = argparse.ArgumentParser()
ap.add_argument('photo'); ap.add_argument('mask'); ap.add_argument('out')
ap.add_argument('--cut', type=float, default=0.62); ap.add_argument('--depth', type=float, default=0.10)
ap.add_argument('--thresh', type=float, default=0.45); ap.add_argument('--fill-shoulders', action='store_true')
ap.add_argument('--trim', default='', help='x0,y0,x1,y1 fractions: ignore the mask outside this box (card edges)')
a = ap.parse_args()

m = cv2.imread(a.mask, cv2.IMREAD_GRAYSCALE).astype(np.float32) / 255
H, W = m.shape
if a.trim:
    x0, y0, x1, y1 = [float(v) for v in a.trim.split(',')]
    keep = np.zeros_like(m); keep[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)] = 1; m *= keep
b = (m > a.thresh).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(b)
b = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
ycut = int(a.cut * H)
ys, xs = np.nonzero(b)
if a.fill_shoulders:
    # below the widest row, keep the full width between its outer edges (a squared-off shoulder line)
    widths = [(np.ptp(xs[ys == y]) if (ys == y).any() else 0) for y in range(H)]
    yw = int(np.argmax(widths[: ycut]))
    row = xs[ys == yw]
    # symmetric shoulders around the head's centre line
    top = ys.min(); head = xs[(ys > top) & (ys < top + (yw - top) * 0.5)]
    hc = (head.min() + head.max()) / 2; half = max(hc - row.min(), row.max() - hc)
    b[yw:ycut, int(hc - half):int(hc + half) + 1] = 1
# the bust line: a curve, lowest in the middle
ys, xs = np.nonzero(b)
cx = (xs.min() + xs.max()) / 2; hw = (xs.max() - xs.min()) / 2
yy, xx = np.mgrid[0:H, 0:W]
b[yy > ycut - a.depth * H * np.clip(((xx - cx) / hw) ** 2, 0, 1)] = 0
# fill any holes (a white collar, a highlight) and smooth the edge
cs, _ = cv2.findContours(b, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
b = np.zeros_like(b); cv2.drawContours(b, [max(cs, key=cv2.contourArea)], -1, 1, -1)
b = cv2.GaussianBlur(b.astype(np.float32), (0, 0), 2.0)
b = (b > 0.5).astype(np.uint8)
ys, xs = np.nonzero(b)
x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
crop = b[y0:y1, x0:x1]
cv2.imwrite(a.out + '.png', np.dstack([np.full_like(crop, 255)] * 3 + [crop * 255]))
cs, _ = cv2.findContours(crop, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
c = max(cs, key=cv2.contourArea)
c = cv2.approxPolyDP(c, 1.0, True)[:, 0, :]
d = 'M' + 'L'.join(f'{x},{y}' for x, y in c) + 'Z'
json.dump({'w': int(x1 - x0), 'h': int(y1 - y0), 'd': d}, open(a.out + '.json', 'w'))
print(a.out, x1 - x0, y1 - y0, len(c), 'points')
