"""Thumbnail H: the user's BUILT BY KIDS image + BOMBS above it (Inter Black narrowed to BUILT, BUILT's own speckles) and the
channel teal trace on the girl (birefnet-portrait mask, crop at 780,180). Run from projects/Balloon_War: python3 tools/thumb_H_compose.py"""
import sys
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage as ndi

D = 'public/img/gen/thumb/'  # run from projects/Balloon_War
SRC = D + 'user_built_by_kids.jpg'
TEAL = (47, 224, 196)
S = float(sys.argv[1]) if len(sys.argv) > 1 else 0.80

im = np.array(Image.open(SRC).convert('RGB'))
H, W, _ = im.shape
f = im.astype(int)
r, g, b = f[..., 0], f[..., 1], f[..., 2]
yy, xx = np.mgrid[0:H, 0:W]

# --- 1. the existing text block (BUILT + BY KIDS tape), with its dark outline
zone = (xx > 70) & (xx < 1010) & (yy > 140) & (yy < 830)
white = (f.min(2) > 185) & zone
tape = (r > 190) & (g > 100) & (g < 200) & (b < 110) & zone
letters = ndi.binary_fill_holes(ndi.binary_closing(white, iterations=3))  # BUILT shapes incl. their speckles
tape_fill = ndi.binary_fill_holes(ndi.binary_closing(tape, iterations=4))
block = ndi.binary_dilation(letters | tape_fill, iterations=13)            # + the black outline / shadow
y0, y1 = np.where(block.any(1))[0][[0, -1]]
x0, x1 = np.where(block.any(0))[0][[0, -1]]

# --- 2. clear it from the background (inpaint at half res), then darken the left a touch so no smear shows
hole = ndi.binary_dilation(block, iterations=6).astype(np.uint8) * 255
small = cv2.resize(im, (W // 2, H // 2), interpolation=cv2.INTER_AREA)
bg = cv2.inpaint(small, cv2.resize(hole, (W // 2, H // 2), interpolation=cv2.INTER_NEAREST), 9, cv2.INPAINT_TELEA)
bg = cv2.resize(bg, (W, H), interpolation=cv2.INTER_CUBIC)
ha = cv2.GaussianBlur(hole.astype(np.float32) / 255, (0, 0), 4)[..., None]
base = im * (1 - ha) + bg * ha
grad = (np.clip(1 - xx / 1250.0, 0, 1) ** 0.8)[..., None] * 0.5
base = (base * (1 - grad)).astype(np.uint8)

# --- 3. cut the block out (soft alpha), scale it, place it lower
alpha = cv2.GaussianBlur(block.astype(np.float32), (0, 0), 1.5)
blk = np.dstack([im, (alpha * 255).astype(np.uint8)])[y0:y1 + 1, x0:x1 + 1]
blk = Image.fromarray(blk).resize((int((x1 - x0 + 1) * S), int((y1 - y0 + 1) * S)), Image.LANCZOS)

# --- 4. BOMBS: Inter Black narrowed to BUILT's proportions, white, dark outline, BUILT's own speckles
lb = np.where(letters)
ly0, ly1, lx0, lx1 = lb[0].min(), lb[0].max(), lb[1].min(), lb[1].max()
built_h, built_w = ly1 - ly0 + 1, lx1 - lx0 + 1
cap = int(built_h * S)                                       # same height as the scaled BUILT
F = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Black.otf', 400)
bb = F.getbbox('BOMBS')
txt = Image.new('L', (bb[2] - bb[0] + 40, bb[3] - bb[1] + 40), 0)
ImageDraw.Draw(txt).text((20 - bb[0], 20 - bb[1]), 'BOMBS', font=F, fill=255)
ref = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Black.otf', 400).getbbox('BUILT')
squeeze = (built_w / built_h) / ((ref[2] - ref[0]) / (ref[3] - ref[1]))      # match BUILT's narrowness
tw = int((txt.width - 40) * cap / (txt.height - 40) * squeeze)
txt = txt.crop((20, 20, txt.width - 20, txt.height - 20)).resize((tw, cap), Image.LANCZOS)
tm = np.array(txt).astype(np.float32) / 255
# speckles from BUILT: dark pixels inside the letter shapes, tiled to BOMBS' size
_sp = (letters & ~white)[ly0:ly1 + 1, lx0:lx1 + 1]
_lab, _n = ndi.label(_sp); _sz = ndi.sum(_sp, _lab, range(1, _n + 1))
spk_src = np.isin(_lab, 1 + np.flatnonzero(_sz < 250)).astype(np.uint8) * 255   # specks only, not the letters' counters
spk = cv2.resize(spk_src, (int(built_w * S), cap), interpolation=cv2.INTER_AREA)
reps = int(np.ceil(tw / spk.shape[1]))
spk = np.tile(spk, (1, reps))[:, :tw][:, ::-1].astype(np.float32) / 255      # mirrored so it doesn't repeat BUILT exactly
pad = 16
outline = cv2.dilate((tm > 0.5).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * 9 + 1, 2 * 9 + 1)))
canvas = np.zeros((cap + 2 * pad, tw + 2 * pad, 4), np.float32)
ol = np.pad(outline, pad).astype(np.float32)
ol = cv2.GaussianBlur(ol, (0, 0), 1.0)
canvas[..., :3] = 0; canvas[..., 3] = ol * 0.96                                    # near-black outline (#0d0c09-ish)
canvas[..., 0] = 13; canvas[..., 1] = 12; canvas[..., 2] = 9
fill = np.pad(tm, pad)
sp = np.pad(spk, pad)
col = np.where((sp > 0.45)[..., None], np.array([13, 12, 9], np.float32), np.array([250, 250, 249], np.float32))
canvas[..., :3] = canvas[..., :3] * (1 - fill[..., None]) + col * fill[..., None]
canvas[..., 3] = np.maximum(canvas[..., 3], fill)
canvas[..., 3] *= 255
bombs = Image.fromarray(canvas.clip(0, 255).astype(np.uint8))

# --- 5. the teal trace on the girl (birefnet portrait mask, crop at 780,180)
m = np.array(Image.open(D + 'user_built_by_kids_girl_mask.png').convert('L')).astype(np.float32) / 255
full = np.zeros((H, W), np.float32); full[180:180 + m.shape[0], 780:780 + m.shape[1]] = m
mm = cv2.GaussianBlur((full > 0.5).astype(np.float32), (0, 0), 3) > 0.5
mm = ndi.binary_dilation(mm, iterations=7)                     # sits just outside her edge
cs, _ = cv2.findContours(mm.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
c = max(cs, key=cv2.contourArea)[:, 0, :].astype(np.float32)
# hand-drawn feel: tiny smooth wobble along the path
t = np.arange(len(c)); rng = np.random.default_rng(7)
wob = ndi.gaussian_filter1d(rng.normal(0, 2.2, (len(c), 2)), 18, axis=0, mode='wrap')
c = ndi.gaussian_filter1d(c, 2, axis=0, mode='wrap') + wob
stroke = Image.new('L', (W, H), 0)
ci = np.clip(c.round().astype(int), 0, [W - 1, H - 1])
below = np.array([not mm[min(H - 1, y + 16), x] and mm[max(0, y - 16), x] for x, y in ci])
lap = below & (ci[:, 0] > 925) & (ci[:, 0] < 1475)
lap = ndi.binary_closing(lap, iterations=6)
dr = ImageDraw.Draw(stroke)
seg = []
for p, skip in zip(list(c) + [c[0]], list(lap) + [lap[0]]):
    if skip:
        if len(seg) > 1: dr.line(seg, fill=255, width=9, joint='curve')
        seg = []
    else:
        seg.append(tuple(p))
if len(seg) > 1: dr.line(seg, fill=255, width=9, joint='curve')
glow = stroke.filter(ImageFilter.GaussianBlur(9))

# --- compose
out = Image.fromarray(base).convert('RGBA')
teal = Image.new('RGBA', (W, H), TEAL + (0,))
gl = teal.copy(); gl.putalpha(glow.point(lambda v: int(v * 0.55)))
out.alpha_composite(gl)
st = teal.copy(); st.putalpha(stroke)
out.alpha_composite(st)
bx, by = 116 - 4, 150
out.alpha_composite(bombs, (bx - pad, by - pad))
gy = by + cap + int(36 * S)
out.alpha_composite(blk, (x0 + int((lx0 - x0) * (1 - S)) - 4 + (bx - lx0) + int((lx0 - x0) * S) - int((lx0 - x0) * (1 - S)) + int((lx0-x0)*(1-S)), gy - int((ly0 - y0) * S)))
out = out.convert('RGB')
out.save('v2/renders/thumbnails/Balloon_War_v2_H_2000.png')
out.resize((1280, 720), Image.LANCZOS).save('v2/renders/thumbnails/Balloon_War_v2_H.png')
print('BUILT', built_w, built_h, 'BOMBS', tw, cap, 'block', x1 - x0, y1 - y0, 'group top', gy)
