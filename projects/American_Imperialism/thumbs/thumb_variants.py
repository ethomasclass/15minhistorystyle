# Thumbnail experiments on the Flow scene (flow_set_v1.jpg): richer tritone splits (straight or diagonal, amber or teal on
# the left), the Queen in black and white with a neon teal line, the title AMERICANS / LOCKED HER UP and a hand-drawn
# arrow to her. Writes V1..V4 and a sheet. Run from this folder: python3 thumb_variants.py
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageEnhance
from thumb_mock import run, grain, W, H, TEAL, CORAL, INK

SRC = ImageOps.fit(Image.open('flow_set_v1.jpg').convert('RGB'), (W, H), centering=(0.5, 0.45))
Q = Image.open('cut/flow_queen.png')
m = Image.new('L', (W, H), 0)
ImageDraw.Draw(m).polygon([(0.455 * W, H), (0.47 * W, 0.62 * H), (0.5 * W, 0.5 * H), (0.53 * W, 0.2 * H), (0.6 * W, 0.15 * H),
                           (0.68 * W, 0.22 * H), (0.72 * W, 0.55 * H), (0.77 * W, 0.62 * H), (0.79 * W, H)], fill=255)
ALPHA = Image.fromarray(np.minimum(np.asarray(Q.split()[3]), np.asarray(m.filter(ImageFilter.GaussianBlur(4)))))

# richer tritones: deep shadow, a saturated middle, a bright highlight
AMBER = ((22, 10, 2), (178, 92, 14), (255, 214, 128))
TEALT = ((2, 18, 22), (10, 122, 116), (150, 246, 226))


def tritone(im, tones):
    g = np.asarray(ImageOps.autocontrast(im.convert('L'), cutoff=1), np.float32) / 255
    g = np.clip((g - 0.5) * 1.12 + 0.5, 0, 1)
    d, mid, l = [np.array(c, np.float32) for c in tones]
    lo = d + (mid - d) * np.clip(g * 2, 0, 1)[..., None]
    hi = mid + (l - mid) * np.clip(g * 2 - 1, 0, 1)[..., None]
    out = np.where((g < 0.5)[..., None], lo, hi)
    return Image.fromarray(out.astype(np.uint8))


def split_mask(kind):
    mk = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(mk)
    if kind == 'straight':
        d.rectangle((0, 0, int(W * 0.47), H), fill=255)
    else:                                               # diagonal: from high on the right down behind her
        d.polygon([(0, 0), (int(W * 0.74), 0), (int(W * 0.52), H), (0, H)], fill=255)
    return mk                                           # 255 = the left tone


def queen(base):
    glow = ALPHA.filter(ImageFilter.MaxFilter(17)).filter(ImageFilter.GaussianBlur(10))
    g_ = Image.new('RGBA', (W, H), TEAL + (0,)); g_.putalpha(glow.point(lambda v: int(v * 0.9))); base.alpha_composite(g_)
    l_ = Image.new('RGBA', (W, H), (120, 255, 232, 0)); l_.putalpha(ALPHA.filter(ImageFilter.MaxFilter(9))); base.alpha_composite(l_)
    bw = ImageOps.autocontrast(Q.convert('RGB').convert('L'), cutoff=0.6)
    bw = ImageEnhance.Contrast(bw.convert('RGB')).enhance(1.12).convert('RGBA'); bw.putalpha(ALPHA)
    base.alpha_composite(bw)


def title(img, x=34, s2=112):
    d = ImageDraw.Draw(img)
    w1 = run(d, x, 0, 'AMERICANS', 58, INK, True)
    d.rectangle((x - 14, 28, w1 + 14, 28 + 74), fill=INK)
    run(d, x, 28 + 57, 'AMERICANS', 58, (245, 242, 235))
    lines = ['LOCKED', 'HER UP']
    y = 28 + 74 + 14
    ends = []
    for ln in lines:
        w2 = run(d, x, 0, ln, s2, INK, True)
        d.rectangle((0, y, w2 + 22, y + int(s2 * 0.84)), fill=CORAL)
        run(d, x, y + int(s2 * 0.76), ln, s2, INK)
        ends.append((w2 + 22, y + int(s2 * 0.42)))
        y += int(s2 * 0.84) + 10
    return ends[-1]


def arrow(img, start, end, col=(255, 255, 255), w=11):
    """a hand-drawn curved arrow: a quadratic bow from start to end, a two-stroke head"""
    S = 3
    lay = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    (x0, y0), (x1, y1) = start, end
    cx, cy = (x0 + x1) / 2 + 30, min(y0, y1) - 40
    pts = [((1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1)
           for t in [i / 60 for i in range(61)]]
    sh = [(x * S + 5 * S, y * S + 6 * S) for x, y in pts]
    d.line(sh, fill=(0, 0, 0, 140), width=w * S, joint='curve')
    d.line([(x * S, y * S) for x, y in pts], fill=col + (255,), width=w * S, joint='curve')
    ang = math.atan2(pts[-1][1] - pts[-5][1], pts[-1][0] - pts[-5][0])
    for da in (2.55, -2.55):
        hx, hy = x1 + 46 * math.cos(ang + da), y1 + 46 * math.sin(ang + da)
        d.line([(hx * S + 5 * S, hy * S + 6 * S), (x1 * S + 5 * S, y1 * S + 6 * S)], fill=(0, 0, 0, 140), width=w * S)
        d.line([(hx * S, hy * S), (x1 * S, y1 * S)], fill=col + (255,), width=w * S)
    img.alpha_composite(lay.resize((W, H), Image.LANCZOS))


def make(name, kind, left_tones, right_tones, arrow_col=(255, 255, 255)):
    L, R = tritone(SRC, left_tones), tritone(SRC, right_tones)
    img = Image.composite(L, R, split_mask(kind)).convert('RGBA')
    queen(img)
    end = title(img)
    arrow(img, (end[0] + 18, end[1]), (int(W * 0.565), int(H * 0.30)), arrow_col)
    out = grain(img)
    out.save(name, quality=92)
    return out


vs = [make('V1_straight_amber_left.jpg', 'straight', AMBER, TEALT),
      make('V2_straight_teal_left.jpg', 'straight', TEALT, AMBER),
      make('V3_diagonal_amber_left.jpg', 'diagonal', AMBER, TEALT),
      make('V4_diagonal_teal_left.jpg', 'diagonal', TEALT, AMBER, arrow_col=(255, 214, 128))]
sheet = Image.new('RGB', (W, H), (20, 20, 20))
for i, v in enumerate(vs):
    sheet.paste(v.resize((W // 2, H // 2)), ((i % 2) * W // 2, (i // 2) * H // 2))
sheet.save('V_sheet.jpg', quality=90)
print('V1..V4, V_sheet.jpg')
