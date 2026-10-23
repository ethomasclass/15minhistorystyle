"""Crop a source image with a labelled pixel grid (and, optionally, a mask's edge in teal) for hand-tracing polygons.

  python3 tools/trace_grid.py public/img/ch04/houston.jpg out/grid.jpg 200 300 1400 1900 100 [public/img/masks/houston_subject.png]

Read the source-pixel coordinates off the grid, write the polygon to tools/traces/<name>.json, apply it with
tools/refine_mask.py, then look again with the mask argument until the teal edge sits on the subject.
"""
import sys
from PIL import Image, ImageDraw, ImageFilter

src, out, x0, y0, x1, y1, step = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:8])
mask = sys.argv[8] if len(sys.argv) > 8 else None
im = Image.open(src).convert('RGB').crop((x0, y0, x1, y1))
if mask:
    m = Image.open(mask).convert('L').crop((x0, y0, x1, y1))
    e = m.filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 60 else 0).filter(ImageFilter.MaxFilter(5))
    im.paste((47, 224, 196), mask=e)
k = min(1400 / im.width, 1000 / im.height)
im = im.resize((int(im.width * k), int(im.height * k)))
d = ImageDraw.Draw(im)
for x in range((x0 // step + 1) * step, x1, step):
    X = (x - x0) * k
    d.line([(X, 0), (X, im.height)], fill=(255, 0, 0))
    d.text((X + 2, 2), str(x), fill=(255, 255, 0))
for y in range((y0 // step + 1) * step, y1, step):
    Y = (y - y0) * k
    d.line([(0, Y), (im.width, Y)], fill=(255, 0, 0))
    d.text((2, Y + 2), str(y), fill=(255, 255, 0))
im.save(out)
print(im.size, k)
