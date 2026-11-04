"""BW12 (Price at his desk) split by colour, not depth: depth estimation cut the man in two (head and body on different planes)
and broke the left window bar between planes, so it slid apart when the camera moved (the user's note, Nov 4 2026).

  L0  the warm ink: the man, chair, desk, lamp, papers, floor, plus the lamp's light cone
  L1  empty (kept so SilScene's 4-plane layout and fog placement stay the same)
  L2  the cool near-dark: both window bars (whole, top to bottom), the near buildings and the wall under the window,
      extended under the desk so nothing opens up behind it
  L3  the city and sky, with everything in front inpainted

  python3 tools/bw12_layers.py      (reads public/img/gen/scenes/2x/BW12_price_desk.jpg, writes public/img/layers/sil/BW12_price_desk/)
"""
import json
import os

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = 'public/img/gen/scenes/2x/BW12_price_desk.jpg'
OUT = 'public/img/layers/sil/BW12_price_desk/'

im = np.array(Image.open(SRC).convert('RGB'))
H, W, _ = im.shape
f = im.astype(int)
r, g, b = f[..., 0], f[..., 1], f[..., 2]
yy, xx = np.mgrid[0:H, 0:W]

# warm ink (#0d0c09-ish: r > b, all dark)
ink = (r - b >= 5) & (np.maximum(np.maximum(r, g), b) < 70)
# the light cone and the lit papers (cream) inside a polygon from the lamp head down to the desk top (preview coords /1000 x /557)
poly = np.array([(566, 250), (612, 257), (627, 362), (440, 362)], float)
poly[:, 0] *= W / 1000; poly[:, 1] *= H / 557
cone = np.zeros((H, W), np.uint8); cv2.fillPoly(cone, [poly.astype(np.int32)], 1)
cone = cone.astype(bool) & (g > 60)
# the lamp (shade, thin arm, base): inside its box the dark, not-teal pixels (the arm is a hair too neutral for `ink`)
lamp = (xx > 0.560 * W) & (xx < 0.660 * W) & (yy > 0.375 * H) & (yy < 0.600 * H) & (np.maximum(np.maximum(r, g), b) < 90) & (g - r < 10)
fg = ink | cone | lamp
fg = ndi.binary_closing(fg, iterations=2)
fg = ndi.binary_fill_holes(fg)
# drop specks
lab, n = ndi.label(fg); sizes = ndi.sum(fg, lab, range(1, n + 1))
fg = np.isin(lab, 1 + np.flatnonzero(sizes > 400))

# cool near-dark (#111b1b..#1c3332): g well above r, dark
cool = (g - r >= 8) & (g <= 40) & ~fg
# window bars: columns that stay dark from the top of the frame down to the skyline
top = slice(0, int(0.30 * H))
colmean = f[top, :, 1].mean(0)
smooth = ndi.uniform_filter1d(colmean, 61)
bars = np.flatnonzero((colmean < smooth - 12) & (colmean < 45))
bar_mask = np.zeros((H, W), bool)
if len(bars):
    groups = np.split(bars, np.flatnonzero(np.diff(bars) > 3) + 1)
    for gr in groups:
        if len(gr) < 6:
            continue
        x0, x1 = gr[0] - 8, gr[-1] + 9
        bar_mask[:, x0:x1] = True
        print(f'window bar x {x0}-{x1} ({len(gr)} px)')
bar_mask &= (g <= 46) | fg  # only the bar's own dark pixels (and where the ink covers it)
# near region = the cool dark below the bright sky, connected to the bottom edge, plus the bars
low = cool & (yy > 0.28 * H)
lab, n = ndi.label(low | bar_mask)
keep = set(np.unique(lab[-3:, :])) | set(np.unique(lab[bar_mask]))
keep.discard(0)
near = np.isin(lab, list(keep)) & (low | bar_mask)
near = ndi.binary_closing(near, iterations=2)
# under the desk/chair: the wall continues behind the ink below the windowsill
sill = int(0.63 * H)
near_full = near | (fg & (yy >= sill)) | (bar_mask & fg)

def soft(mask, px=1.2):
    a = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), px)
    return np.clip(a * 1.15, 0, 1)

def rgba(rgb, a):
    return Image.fromarray(np.dstack([rgb, (a * 255).astype(np.uint8)]))

os.makedirs(OUT, exist_ok=True)
# L0: the original pixels under the foreground mask
rgba(im, soft(fg)).save(OUT + 'L0.webp', quality=92)
# L1: empty
rgba(im, np.zeros((H, W))).save(OUT + 'L1.webp', quality=50)
# L2: near pixels; under the ink (below the sill) fill with the wall colour by inpainting from the near pixels
hole = (near_full & ~near).astype(np.uint8)
small = cv2.resize(im, (W // 2, H // 2), interpolation=cv2.INTER_AREA)
fill = cv2.inpaint(small, cv2.resize(hole * 255, (W // 2, H // 2), interpolation=cv2.INTER_NEAREST), 6, cv2.INPAINT_TELEA)
fill = cv2.resize(fill, (W, H), interpolation=cv2.INTER_CUBIC)
l2 = np.where(hole[..., None].astype(bool), fill, im)
rgba(l2, soft(near_full)).save(OUT + 'L2.webp', quality=92)
# L3: the back plate, everything in front inpainted (a little wider than the masks so no dark fringe is left)
dark = (np.maximum(np.maximum(r, g), b) < 60) & (yy > 0.28 * H)
front = ndi.binary_dilation(fg | near_full | dark | bar_mask, iterations=6).astype(np.uint8) * 255
small_front = cv2.resize(front, (W // 4, H // 4), interpolation=cv2.INTER_NEAREST)
bg = cv2.inpaint(cv2.resize(im, (W // 4, H // 4), interpolation=cv2.INTER_AREA), small_front, 12, cv2.INPAINT_TELEA)
bg = cv2.resize(bg, (W, H), interpolation=cv2.INTER_CUBIC)
fa = cv2.GaussianBlur(front.astype(np.float32) / 255, (0, 0), 3)[..., None]
l3 = (im * (1 - fa) + bg * fa).astype(np.uint8)
Image.fromarray(l3).save(OUT + 'L3.jpg', quality=92)

meta = json.load(open(OUT + 'layers.json')) if os.path.exists(OUT + 'layers.json') else {}
meta.update({'size': [W, H], 'bands': 4, 'method': 'colour split (tools/bw12_layers.py), not depth',
             'share': [float(fg.mean()), 0.0, float(near_full.mean()), 1.0]})
json.dump(meta, open(OUT + 'layers.json', 'w'))
prev = Image.fromarray(im).resize((W // 4, H // 4))
prev.save(OUT + 'preview.jpg', quality=80)
print('fg', round(fg.mean(), 3), 'near', round(near_full.mean(), 3))
