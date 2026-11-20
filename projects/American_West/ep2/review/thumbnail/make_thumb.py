# Thumbnail from the user's collage (source_user.jpg): left panel orange, right panel teal, Grant cut out, enlarged, B/W with a teal trace;
# "WHO GOT / RICH?" in Abril Fatface on torn tape. Run from this folder: python3 make_thumb.py (needs AbrilFatface.ttf here, from public/fonts).
import numpy as np, cv2, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
W, H = 1280, 720
TEAL, ORANGE, CORAL, INK = (47, 224, 196), (255, 159, 28), (255, 111, 97), (17, 17, 17)
src = Image.open("source_user.jpg").convert("RGB")
s = W / src.width; src = src.resize((W, round(src.height * s)), Image.LANCZOS).crop((0, 0, W, H))
g = np.asarray(ImageOps.autocontrast(src.convert("L"), cutoff=1), np.float32) / 255
def duo(col, dark=(14, 12, 10)):
    d, c = np.array(dark, np.float32), np.array(col, np.float32)
    return d + (c - d) * g[..., None] ** 1.1
x = np.arange(W)[None, :, None] / s           # source-px x of each column
left = np.clip((560 - x) / 14, 0, 1); right = np.clip((x - 885) / 14, 0, 1)
mid = 1 - left - right
ink = np.array((14, 12, 10), np.float32) + g[..., None] * 34   # the middle panel goes dark desk
bg = duo(ORANGE) * left + duo(TEAL) * right + ink * mid
bg = Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8))
# grain + vignette
rng = np.random.default_rng(3); n = rng.normal(0, 9, (H, W, 1))
v = np.asarray(bg, np.float32) + n
yy, xx = np.mgrid[0:H, 0:W]; vig = 1 - 0.35 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
bg = Image.fromarray(np.clip(v * vig[..., None], 0, 255).astype(np.uint8))
# Grant: hard alpha, biggest piece, B/W, enlarged
cut = Image.open("grant_cut.png"); a = (np.asarray(cut.split()[-1]) > 140).astype(np.uint8) * 255
k, lab, st, _ = cv2.connectedComponentsWithStats(a); a = ((lab == 1 + np.argmax(st[1:, 4])) * 255).astype(np.uint8)
a = cv2.GaussianBlur(a, (3, 3), 0)
gray = ImageOps.autocontrast(cut.convert("L"), cutoff=0.5).point(lambda p: min(255, int(p * 1.05)))
grant = Image.merge("RGBA", [gray, gray, gray, Image.fromarray(a)]).crop(Image.fromarray(a).getbbox())
GH = 760; grant = grant.resize((round(grant.width * GH / grant.height), GH), Image.LANCZOS)
gx, gy = 640 - grant.width // 2 + 40, H - GH + 70
# teal trace + contact shadow
al = np.asarray(grant.split()[-1])
ring = cv2.dilate((al > 128).astype(np.uint8), np.ones((9, 9), np.uint8)) * 255
trace = Image.new("RGBA", grant.size, TEAL + (0,)); trace.putalpha(Image.fromarray(ring))
sh = Image.new("RGBA", grant.size, (0, 0, 0, 0)); sh.putalpha(Image.fromarray(ring).filter(ImageFilter.GaussianBlur(18)).point(lambda p: int(p * 0.85)))
canvas = bg.convert("RGBA")
canvas.alpha_composite(sh, (gx + 14, gy + 10)); canvas.alpha_composite(trace, (gx, gy)); canvas.alpha_composite(grant, (gx, gy))
# title
d = ImageDraw.Draw(canvas)
def tape(box, col, seed):
    r = random.Random(seed); x0, y0, x1, y1 = box; pts = []
    for i in range(14): pts.append((x0 + (x1 - x0) * i / 13, y0 + r.uniform(-6, 6)))
    for i in range(6): pts.append((x1 + r.uniform(-8, 8), y0 + (y1 - y0) * i / 5))
    for i in range(14): pts.append((x1 - (x1 - x0) * i / 13, y1 + r.uniform(-6, 6)))
    for i in range(6): pts.append((x0 + r.uniform(-8, 8), y1 - (y1 - y0) * i / 5))
    lay = Image.new("RGBA", canvas.size, (0, 0, 0, 0)); ImageDraw.Draw(lay).polygon(pts, fill=col + (255,))
    shd = Image.new("RGBA", canvas.size, (0, 0, 0, 0)); ImageDraw.Draw(shd).polygon([(p[0] + 8, p[1] + 10) for p in pts], fill=(0, 0, 0, 170))
    canvas.alpha_composite(shd.filter(ImageFilter.GaussianBlur(8))); canvas.alpha_composite(lay)
F1 = ImageFont.truetype("AbrilFatface.ttf", 118); F2 = ImageFont.truetype("AbrilFatface.ttf", 210)
# "WHO GOT" on an ink-black torn strip, "RICH?" on orange tape, bottom left over the orange panel
t1, t2 = "WHO GOT", "RICH?"
b1 = d.textbbox((0, 0), t1, font=F1); b2 = d.textbbox((0, 0), t2, font=F2)
x1, y1 = 34, 360
tape((x1 - 18, y1 + b1[1] - 14, x1 + b1[2] + 22, y1 + b1[3] + 16), INK, 4)
d.text((x1, y1), t1, font=F1, fill=(255, 255, 255))
x2, y2 = 30, 470
tape((x2 - 16, y2 + b2[1] - 10, x2 + b2[2] + 22, y2 + b2[3] + 14), CORAL, 9)
d.text((x2, y2), t2, font=F2, fill=INK)
canvas.convert("RGB").save("thumb_A.png"); canvas.convert("RGB").resize((640, 360), Image.LANCZOS).save("thumb_A_small.png")
