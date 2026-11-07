"""Portrait -> aged bust cut-out (PNG with alpha): no border, no mount, no oval; the sitter cut out of the page (the channel's
rule since West Ep 2), then aged like an old print: a faint warm tone, lifted blacks and softened highlights, film grain, a few
dust specks and fine scratches. The shadow is added on the desk, not baked in.

  python3 tools/bust_cut.py <src> <out.png> [--crop x0,y0,x1,y1 (fractions)] [--bust 0.62] [--model u2net_human_seg] [--seed 3]
--bust   keep this fraction of the subject's height from the top of the head (head and shoulders); 1 keeps everything
"""
import argparse
import numpy as np, cv2
from PIL import Image
from rembg import new_session, remove

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--crop', default=''); ap.add_argument('--bust', type=float, default=0.62)
ap.add_argument('--model', default='u2net_human_seg'); ap.add_argument('--seed', type=int, default=3)
ap.add_argument('--tone', type=float, default=0.10)
ap.add_argument('--erode', type=int, default=2, help='px to pull the edge in (more on a light page)')
a = ap.parse_args(); rng = np.random.default_rng(a.seed)

im = Image.open(a.src).convert('RGB')
if a.crop:
    x0, y0, x1, y1 = [float(v) for v in a.crop.split(',')]; W, H = im.size
    im = im.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
alpha = np.array(remove(im, session=new_session(a.model), post_process_mask=True))[:, :, 3].astype(np.float32)
# keep the largest piece, fill its holes, soften the edge a touch
hard = (alpha > 128).astype(np.uint8)
k, lab, st, _ = cv2.connectedComponentsWithStats(hard)
keep = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA])); obj = (lab == keep).astype(np.uint8)
inv = 1 - obj; k2, lab2, st2, _ = cv2.connectedComponentsWithStats(inv); h, w = obj.shape
lum = np.asarray(im.convert('L')).astype(np.float32) / 255
bgl = np.median(np.concatenate([lum[:12].ravel(), lum[:, :12].ravel(), lum[:, -12:].ravel()]))
for i in range(1, k2):                     # fill enclosed holes, unless they are the page background showing through
    x, y, bw, bh, _ = st2[i]
    if x > 0 and y > 0 and x + bw < w and y + bh < h and abs(lum[lab2 == i].mean() - bgl) > 0.12: obj[lab2 == i] = 1
alpha = np.minimum(alpha, obj * 255.0)
alpha = cv2.erode(alpha, np.ones((3, 3), np.uint8), iterations=a.erode)   # pull the edge in past the light halo of the page
alpha = cv2.GaussianBlur(alpha, (0, 0), 1.0)
# bust crop: from the top of the head down a fraction of the subject's height, with a soft fade at the cut
ys, xs = np.nonzero(alpha > 128); top, bot = ys.min(), ys.max()
cut = int(top + a.bust * (bot - top))
fade = np.clip((cut - np.arange(h)) / 40.0, 0, 1)[:, None]
alpha = alpha * fade
# age the print
g = np.asarray(im.convert('L')).astype(np.float32) / 255
g = 0.07 + 0.86 * g                                            # lift blacks, roll off whites
g = cv2.GaussianBlur(g, (0, 0), 0.6)
grain = cv2.GaussianBlur(rng.normal(0, 1, g.shape).astype(np.float32), (0, 0), 0.8) * 0.035
g = np.clip(g + grain, 0, 1)
for _ in range(int(h * w / 60000)):                            # dust specks, light and dark
    cy, cx, r = rng.integers(0, h), rng.integers(0, w), rng.uniform(0.6, 2.2)
    cv2.circle(g, (int(cx), int(cy)), int(round(r)), float(rng.choice([0.92, 0.12])), -1, lineType=cv2.LINE_AA)
sc = np.zeros_like(g)                                           # fine scratches, faint
for _ in range(5):
    x0_ = rng.integers(0, w); ln = rng.integers(h // 10, h // 4); y0_ = rng.integers(0, h - ln)
    cv2.line(sc, (int(x0_), int(y0_)), (int(x0_ + rng.integers(-12, 12)), int(y0_ + ln)), 1.0, 1, lineType=cv2.LINE_AA)
g = g * (1 - 0.22 * sc) + 0.85 * 0.22 * sc
vig = 1 - 0.18 * (((np.mgrid[0:h, 0:w][1] - w / 2) / (w / 2)) ** 2 + ((np.mgrid[0:h, 0:w][0] - h / 2) / (h / 2)) ** 2) / 2
g = np.clip(g * vig, 0, 1)
t = a.tone
rgb = np.dstack([g * (1 + 0.10 * t / 0.1 * 0.6), g * (1 + 0.03 * t / 0.1), g * (1 - 0.10 * t / 0.1 * 0.6)])
rgb = np.clip(rgb, 0, 1)
ys, xs = np.nonzero(alpha > 8); pad = 16
box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(w, xs.max() + pad), min(h, ys.max() + pad))
out = Image.fromarray(np.dstack([(rgb * 255).astype(np.uint8), alpha.astype(np.uint8)]), 'RGBA').crop(box)
out.thumbnail((1400, 1400), Image.LANCZOS); out.save(a.out); print(a.out, out.size)
