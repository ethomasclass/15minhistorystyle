"""Split the Fox family plate (1848 'Advent of Spiritualism') into 2.5D parallax layers.

Writes public/img/test/plate_*.png:
  plate_bg.png        the plate with the portraits and the house painted out (paper fill)
  plate_<name>.png    each portrait on its own transparent layer, soft oval edge
  plate_house.png     the house, fence and trees, soft rectangular edge
  plate_house_mask.png  tight silhouette of the house itself, for the coral tint
Also prints the layer boxes as JSON for src/test/plate.ts.
"""
import json, sys
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC = 'public/img/test/fox_family.jpg'
OUT = 'public/img/test/'
im = np.array(Image.open(SRC).convert('RGB'))
H, W = im.shape[:2]

PORTRAITS = {  # cx, cy, rx, ry in source pixels
    'top': (740, 880, 205, 230), 'left': (452, 1060, 195, 220), 'right': (1075, 1105, 195, 222),
    'bl': (362, 1482, 205, 228), 'br': (1120, 1482, 205, 232),
}
HOUSE_BOX = (370, 1715, 1095, 2080)
CAPTION = (505, 1375, 990, 1455)  # 'HIS WIFE AND DAUGHTERS' runs into the lower portraits: keep it on the paper layer
HOUSE_POLY = [(403, 1870), (583, 1825), (580, 1805), (620, 1761), (623, 1761), (623, 1730), (663, 1730), (663, 1761),
              (947, 1759), (977, 1805), (977, 2003), (407, 2003)]

def soft(mask_l: Image.Image, blur: float) -> np.ndarray:
    return np.array(mask_l.filter(ImageFilter.GaussianBlur(blur))).astype(np.float32) / 255

hole = Image.new('L', (W, H), 0)
d = ImageDraw.Draw(hole)
boxes = {}
for k, (cx, cy, rx, ry) in PORTRAITS.items():
    d.ellipse((cx - rx * 1.06, cy - ry * 1.06, cx + rx * 1.06, cy + ry * 1.06), fill=255)
    m = Image.new('L', (W, H), 0)
    ImageDraw.Draw(m).ellipse((cx - rx * 0.86, cy - ry * 0.86, cx + rx * 0.86, cy + ry * 0.86), fill=255)
    ImageDraw.Draw(m).rectangle(CAPTION, fill=0)
    a = soft(m, rx * 0.09)
    x0, y0, x1, y1 = cx - rx, cy - ry, cx + rx, cy + ry
    rgba = np.dstack([im, (a * 255).astype(np.uint8)])[y0:y1, x0:x1]
    Image.fromarray(rgba, 'RGBA').save(OUT + f'plate_{k}.png')
    boxes[k] = [x0, y0, x1 - x0, y1 - y0]

d.rectangle(CAPTION, fill=0)
x0, y0, x1, y1 = HOUSE_BOX
d.rectangle((x0 + 8, y0 + 8, x1 - 8, y1 - 8), fill=255)
m = Image.new('L', (W, H), 0)
ImageDraw.Draw(m).rectangle((x0 + 30, y0 + 30, x1 - 30, y1 - 30), fill=255)
a = soft(m, 16)
Image.fromarray(np.dstack([im, (a * 255).astype(np.uint8)])[y0:y1, x0:x1], 'RGBA').save(OUT + 'plate_house.png')
boxes['house'] = [x0, y0, x1 - x0, y1 - y0]

hm = Image.new('L', (x1 - x0, y1 - y0), 0)
ImageDraw.Draw(hm).polygon([(x - x0, y - y0) for x, y in HOUSE_POLY], fill=255)
hm = hm.filter(ImageFilter.GaussianBlur(1.5))
Image.merge('RGBA', [hm, hm, hm, hm]).save(OUT + 'plate_house_mask.png')

# Background: paint the holes out. Inpaint at quarter size (big holes smear less), upscale, add paper grain back.
small = cv2.resize(im, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
hs = cv2.resize(np.array(hole), (W // 4, H // 4), interpolation=cv2.INTER_NEAREST)
fill = cv2.inpaint(cv2.cvtColor(small, cv2.COLOR_RGB2BGR), hs, 9, cv2.INPAINT_TELEA)
fill = cv2.cvtColor(cv2.resize(fill, (W, H), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2RGB).astype(np.float32)
fill = cv2.GaussianBlur(fill, (0, 0), 6)
paper = np.median(im[40:300, 40:300].reshape(-1, 3), axis=0)  # plain paper in the top-left corner
fill = 0.45 * fill + 0.55 * paper  # lean toward plain paper so dark smears don't show at the edges
rng = np.random.default_rng(7)
fill += rng.normal(0, 5, fill.shape[:2])[..., None]
ha = soft(hole, 6)[..., None]
bg = im * (1 - ha) + fill * ha
Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).save(OUT + 'plate_bg.jpg', quality=92)
json.dump({'size': [W, H], 'boxes': boxes, 'housePoly': HOUSE_POLY}, sys.stdout)
