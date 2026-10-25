# refine.py name --sub/--add/--only/--keep trace.json [...]  (like tools/refine_mask.py, for mask_jobs entries)
import sys, json, os
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, '/home/user/15minhistorystyle/projects/American_West/ep1/tools')
from trace import clean, save
PUB = '/home/user/15minhistorystyle/projects/American_West/ep1/public'
name = sys.argv[1]
m = np.asarray(Image.open(f'{PUB}/img/masks/{name}_subject.png').convert('L')) > 127
size = (m.shape[1], m.shape[0])
args = sys.argv[2:]
for op, path in zip(args[::2], args[1::2]):
    p = Image.new('L', size, 0); d = ImageDraw.Draw(p)
    for poly in json.load(open(path)): d.polygon([tuple(q) for q in poly], fill=255)
    p = np.asarray(p) > 127
    m = {'--sub': m & ~p, '--add': m | p, '--only': p, '--keep': m & p}[op]
out = clean((m * 255).astype(np.uint8), close=5, min_area=5000)
save(name, size, {'subject': out})
