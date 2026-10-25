# mask_closeup for the sample masks (sources from smask.py JOBS)
import sys, os, re
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
PUB = "/home/user/15minhistorystyle/projects/American_West/ep1/public"
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "smask.py")).read()
J = dict(re.findall(r'"(s_\w+)": \("([^"]+)"', src))
out, names = sys.argv[1], sys.argv[2:]
tiles = []
for n in names:
    im = Image.open(os.path.join(PUB, J[n])).convert('RGB')
    m = Image.open(os.path.join(PUB, 'img', 'masks', n + '_subject.png')).convert('L')
    a = np.asarray(m) > 127; ys, xs = np.nonzero(a)
    pad = 0.08 * max(np.ptp(xs), np.ptp(ys))
    box = (max(0, int(xs.min() - pad)), max(0, int(ys.min() - pad)), min(im.width, int(xs.max() + pad)), min(im.height, int(ys.max() + pad)))
    c = im.crop(box); mc = m.crop(box)
    s = 700 / c.height; c = c.resize((int(c.width * s), 700)); mc = mc.resize(c.size)
    edge = mc.filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 60 else 0)
    o = c.copy(); o.paste((47, 224, 196), mask=edge.filter(ImageFilter.MaxFilter(3)))
    cut = Image.new('RGB', c.size, (120, 120, 120)); cut.paste(c, mask=mc)
    t = Image.new('RGB', (c.width * 2 + 10, 730), 'black'); t.paste(o, (0, 30)); t.paste(cut, (c.width + 10, 30))
    ImageDraw.Draw(t).text((6, 6), n, fill='white'); tiles.append(t)
W = sum(t.width for t in tiles) + 10 * len(tiles); sheet = Image.new('RGB', (W, 730), 'black'); x = 0
for t in tiles: sheet.paste(t, (x, 0)); x += t.width + 10
sheet.save(out, quality=88); print(out, sheet.size)
