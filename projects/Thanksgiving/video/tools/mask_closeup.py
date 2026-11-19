"""Full-resolution check of subject masks: each source cropped to its mask (with margin), outline in teal beside the cut-out on grey.

  python3 tools/mask_closeup.py out/closeup.jpg polk lincoln houston

Look at every edge here before building layers; the small contact sheet (mask_preview.py) hides ragged edges and holes.
"""
import sys, os
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
PUB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public'); out = sys.argv[1]; names = sys.argv[2:]
JOBS = {}
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mask.py')).read()
import ast
node = next(n for n in ast.parse(src).body if isinstance(n, ast.Assign) and getattr(n.targets[0], 'id', '') == 'JOBS')
JOBS = ast.literal_eval(node.value)
# the per-chapter jobs too (tools/mask_jobs/*.py), which mask.py merges in at run time
import glob as _glob
for _p in sorted(_glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mask_jobs', '*.py'))):
    for _n in ast.parse(open(_p).read()).body:
        if isinstance(_n, ast.Assign) and getattr(_n.targets[0], 'id', '') == 'JOBS':
            JOBS.update(ast.literal_eval(_n.value))
        elif isinstance(_n, ast.Expr) and isinstance(_n.value, ast.Call) and getattr(_n.value.func, 'attr', '') == 'update' and _n.value.args:
            JOBS.update(ast.literal_eval(_n.value.args[0]))
tiles = []
for n in names:
    im = Image.open(os.path.join(PUB, JOBS[n][0])).convert('RGB')
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
sheet.save(out); print(out, sheet.size)
