"""Halftone a picture for the collage look: B&W, contrast pushed, printed as round dots on cream (or ink on orange).
usage: halftone.py in.jpg out.png [cell=7] [paper=f4efe6] [ink=111111] [width=900]"""
import sys
from PIL import Image, ImageDraw, ImageOps, ImageFilter
src, out = sys.argv[1], sys.argv[2]
cell = int(sys.argv[3]) if len(sys.argv) > 3 else 7
paper = '#' + (sys.argv[4] if len(sys.argv) > 4 else 'f4efe6')
ink = '#' + (sys.argv[5] if len(sys.argv) > 5 else '111111')
width = int(sys.argv[6]) if len(sys.argv) > 6 else 900
im = Image.open(src).convert('L')
im = im.resize((width, int(width * im.height / im.width)), Image.LANCZOS)
im = ImageOps.autocontrast(im, cutoff=2).filter(ImageFilter.UnsharpMask(2, 120, 2))
S = 4  # draw big, shrink for smooth dots
W, H = im.size
o = Image.new('RGB', (W * S, H * S), paper)
d = ImageDraw.Draw(o)
for y in range(0, H, cell):
    for x in range(0, W, cell):
        # offset every other row, like a printed screen
        xx = x + (cell // 2 if (y // cell) % 2 else 0)
        v = im.getpixel((min(W - 1, xx), y)) / 255
        r = (1 - v) ** 0.9 * cell * 0.72
        if r > 0.3:
            cx, cy = (xx + cell / 2) * S, (y + cell / 2) * S
            d.ellipse([cx - r * S, cy - r * S, cx + r * S, cy + r * S], fill=ink)
o.resize((W, H), Image.LANCZOS).save(out)
print(out, W, H)
