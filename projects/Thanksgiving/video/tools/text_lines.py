"""Find the text lines on a scanned page so loops and underlines land on the right line (not one off).

  python3 tools/text_lines.py public/img/ch05/polk_diary_429.jpg [x0 x1]

Prints each line's centre y and its x extent in source pixels. Rows are averaged across the text column (x0..x1,
default the middle 80% of the page); a row counts as text when it is clearly darker than the paper. Use the centre
as the loop's cy and the extent for its rx, then check one still against the page.
"""
import sys
import numpy as np
from PIL import Image

im = np.asarray(Image.open(sys.argv[1]).convert('L'), np.float32)
h, w = im.shape
x0, x1 = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (int(w * 0.1), int(w * 0.9))
col = im[:, x0:x1]
paper = np.percentile(col, 90)
ink = (col < paper - 60).mean(axis=1)                  # share of dark pixels per row
ink = np.convolve(ink, np.ones(5) / 5, mode='same')
on = ink > max(0.02, ink.max() * 0.12)
lines, y = [], 0
while y < h:
    if on[y]:
        y0 = y
        while y < h and on[y]:
            y += 1
        if y - y0 >= 6:
            band = col[y0:y] < paper - 60
            xs = np.nonzero(band.any(axis=0))[0]
            lines.append((y0, y, x0 + xs.min(), x0 + xs.max()))
    y += 1
for i, (a, b, l, r) in enumerate(lines, 1):
    print(f'{i:3d}  y {a:5d}-{b:5d}  centre {(a + b) // 2:5d}   x {l:5d}-{r:5d}  (cx {(l + r) // 2}, rx {(r - l) // 2})')
