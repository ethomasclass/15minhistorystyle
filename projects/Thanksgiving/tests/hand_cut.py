"""Cut the silhouette hands out of their pale grey Flow backgrounds -> RGBA PNG (the ink, plus any white cuff it encloses).
Background = light pixels connected to the top, left or bottom edge (not the right edge: the sleeve leaves the frame there)."""
import sys, cv2, numpy as np
src, dst = sys.argv[1], sys.argv[2]
im = cv2.imread(src); h, w = im.shape[:2]
lum = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
light = (lum > 95).astype(np.uint8)
bg = np.zeros((h + 2, w + 2), np.uint8)
ff = light.copy()
seeds = [(x, 0) for x in range(0, w, 8)] + [(x, h - 1) for x in range(0, w, 8)] + [(0, y) for y in range(0, h, 8)]
mask = np.zeros((h + 2, w + 2), np.uint8)
for (x, y) in seeds:
    if light[y, x] and not mask[y + 1, x + 1]:
        cv2.floodFill(ff, mask, (x, y), 2, flags=4 | (255 << 8))
back = mask[1:-1, 1:-1] > 0
fg = (~back).astype(np.uint8)
# keep the biggest component (the hand + sleeve), drop specks
n, lab, st, _ = cv2.connectedComponentsWithStats(fg)
# `card`: keep only the hand (the flat black card it held is a separate shape behind the thumb's outline: dropped, so a real
# card can be drawn under the thumb); otherwise keep every big piece
if len(sys.argv) > 3: fg = np.isin(lab, [i for i in range(1, n) if st[i, 4] > 2000 and st[i, 0] > 560]).astype(np.uint8)
else: fg = np.isin(lab, [i for i in range(1, n) if st[i, 4] > 2000]).astype(np.uint8)
# close hairline gaps (the white line between the thumb and the card) so the pieces read as one shape
# light pockets inside the shape: big ones are cuffs/sleeves (kept), small ones are shadow slivers between fingers (dropped)
# or, with `close`, the hairline detail lines on the thumb (painted ink)
pock = ((lum > 95) & (fg > 0)).astype(np.uint8)
n2, lab2, st2, _ = cv2.connectedComponentsWithStats(pock)
small = np.isin(lab2, [i for i in range(1, n2) if st2[i, 4] < (3000 if len(sys.argv) > 3 else 20000)])
if len(sys.argv) > 3: im[small] = (8, 8, 8)
else:
    fg[small] = 0
    # grey shadow slivers between the fingers (darker than the light test, lighter than the ink), left of the sleeve
    xs = np.arange(w)[None, :]
    fg[(lum > 45) & (xs < 1080)] = 0
fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
a = cv2.GaussianBlur(fg.astype(np.float32), (3, 3), 0)
# colour: ink stays ink; enclosed light (cuffs) becomes the desk's cream
out = np.dstack([im, (a * 255).astype(np.uint8)])
x, y, ww, hh = cv2.boundingRect(fg)
print(dst, 'bbox', x, y, ww, hh, 'size', w, h)
cv2.imwrite(dst, out)
