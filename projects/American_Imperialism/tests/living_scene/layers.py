# Split the palace plate into moving layers: sky, clouds, mountains, palace+grounds, palms (each its own group), flag.
# Masks come from colour inside hand-set regions; what's behind a moving layer is filled by inpainting, then every layer
# is traced to vector shapes separately.
import json, os
import numpy as np
import cv2
from PIL import Image
from scipy import ndimage

SRC = '../../../Hawaii_Samples/img/flow/p4_palace.jpg'
os.makedirs('layers', exist_ok=True)
a = np.asarray(Image.open(SRC).convert('RGB')).astype(np.int16)
H, W = a.shape[:2]
r, g, b = a[..., 0], a[..., 1], a[..., 2]
mx = a.max(-1)
yy, xx = np.mgrid[0:H, 0:W]

# ---- palms: dark greens and dark trunks, at the sides, above the lawn
side = (xx < 400) | (xx > 1520)
green_dark = (g >= r - 6) & (g >= b) & (mx < 150)
trunk = (r >= g) & (g >= b - 4) & (mx < 120) & (r - b > 12)
palm = side & (yy < 1012) & (green_dark | trunk)
palm = ndimage.binary_closing(palm, iterations=2)
palm = ndimage.binary_opening(palm, iterations=1)
lab, n = ndimage.label(palm)
sizes = ndimage.sum(palm, lab, range(1, n + 1))
palms = []
for k, s in enumerate(sizes, 1):
    if s < 3000:
        continue
    m = lab == k
    ys, xs = np.nonzero(m)
    base_y = ys.max()
    base_x = int(np.median(xs[ys > base_y - 20]))
    palms.append(dict(mask=m, base=(base_x, int(base_y)), top=int(ys.min()), bbox=(int(xs.min()), int(ys.min()), int(xs.max()), int(base_y))))
print('palms', len(palms), [p['bbox'] for p in palms])

# ---- flag (and its pole) at the top of the central tower
flag = np.zeros((H, W), bool)
fx0, fy0, fx1, fy1 = 940, 20, 1125, 150
reg = (xx >= fx0) & (xx <= fx1) & (yy >= fy0) & (yy <= fy1)
sat = (mx - a.min(-1)) > 40
flag = reg & (sat | (mx > 225))                    # red, blue and the white stripes
flag = ndimage.binary_closing(flag, iterations=3) & reg
flag = ndimage.binary_fill_holes(flag)
lab, n = ndimage.label(flag)
if n:
    sizes = ndimage.sum(flag, lab, range(1, n + 1))
    flag = lab == (int(np.argmax(sizes)) + 1)
ys, xs = np.nonzero(flag)
FLAG = dict(bbox=(int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())))
print('flag', FLAG)

# ---- clouds: cream, in the upper sky (not mountains, not palace)
sky_reg = (yy < 470)
cream = (r > 200) & (g > 185) & (b > 150) & (r - b > 18)
cloud = sky_reg & cream & ~flag
cloud = ndimage.binary_opening(ndimage.binary_closing(cloud, iterations=2), iterations=2)
lab, n = ndimage.label(cloud)
sizes = ndimage.sum(cloud, lab, range(1, n + 1))
cloud = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 4000])

# ---- mountains: sage greens behind the palace, above the lawn and below the sky band
mount = (yy > 140) & (yy < 940) & (g >= r - 10) & (g >= b) & (mx >= 110) & (mx < 215) & ~side
mount = ndimage.binary_opening(ndimage.binary_closing(mount, iterations=3), iterations=2)

pm = np.zeros((H, W), bool)
for p in palms:
    pm |= p['mask']
masks = dict(palms=pm, flag=flag, cloud=cloud, mount=mount)
for k, m in masks.items():
    Image.fromarray((m * 255).astype(np.uint8)).save(f'layers/mask_{k}.png')
json.dump(dict(palms=[{k: v for k, v in p.items() if k != 'mask'} for p in palms], flag=FLAG), open('layers/info.json', 'w'), indent=1)
for i, p in enumerate(palms):
    Image.fromarray((p['mask'] * 255).astype(np.uint8)).save(f'layers/mask_palm{i}.png')

# ---- preview: each mask tinted over the plate
pv = a.astype(np.float32).copy()
for m, c in ((pm, (255, 0, 0)), (flag, (0, 0, 255)), (cloud, (255, 0, 255)), (mount, (0, 255, 255))):
    pv[m] = pv[m] * 0.4 + np.array(c) * 0.6
Image.fromarray(pv.astype(np.uint8)).resize((960, 540)).save('layers/preview.jpg')
