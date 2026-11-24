# Ep 1 thumbnail from the Google Flow scene (flow_set_v1.jpg: the Queen between USS Boston and ʻIolani Palace). 
#   F3_split_bw.jpg  the series' split format, darker: amber left, teal right; the Queen in black and white with a neon
#                    teal line and glow round her; title top left in the sky
# Run from this folder: python3 thumb_flow.py
import colorsys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageEnhance
from rembg import remove, new_session
from thumb_mock import words, grain, W, H, TEAL, AMB, TEA

SRC = Image.open('flow_set_v1.jpg').convert('RGB')
S = SRC.resize((W, int(SRC.height * W / SRC.width)), Image.LANCZOS)
S = ImageOps.fit(S, (W, H), centering=(0.5, 0.45))


def navy(im, box):
    """khaki uniforms in box (fractions) -> dark navy blue: only on the marching figures (a rembg cut of the box), not
    the sand they walk on; belts, faces and rifles keep their own colour"""
    x0, y0, x1, y1 = [int(v) for v in (box[0] * W, box[1] * H, box[2] * W, box[3] * H)]
    crop = im.crop((x0, y0, x1, y1))
    big = crop.resize((crop.width * 3, crop.height * 3), Image.LANCZOS)
    fig = remove(big, session=new_session('isnet-general-use')).split()[3].resize(crop.size, Image.LANCZOS)
    reg = np.asarray(crop, np.float32) / 255
    r, g, b = reg[..., 0], reg[..., 1], reg[..., 2]
    mx, mn = reg.max(-1), reg.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1e-4)
    khaki = ((r > b) & (sat > 0.10) & (mx > 0.18)).astype(np.float32)
    k = khaki * (np.asarray(fig, np.float32) / 255)
    k = np.asarray(Image.fromarray((k * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)), np.float32)[..., None] / 255
    lum = (0.3 * r + 0.59 * g + 0.11 * b)[..., None]
    nv = np.concatenate([lum * 0.30, lum * 0.36, lum * 0.62], -1)
    out = reg * (1 - k) + nv * k
    a = np.asarray(im).copy()
    a[y0:y1, x0:x1] = (np.clip(out, 0, 1) * 255).astype(np.uint8)
    return Image.fromarray(a)


def words_top(img, l1, l2, x=34, s2=120):
    """the series type, top left in the sky: white on black, then big black on coral"""
    from thumb_mock import run, INK, CORAL
    d = ImageDraw.Draw(img)
    w1 = run(d, x, 0, l1, 60, INK, True)
    d.rectangle((x - 14, 28, w1 + 14, 28 + 76), fill=INK)
    run(d, x, 28 + 58, l1, 60, (245, 242, 235))
    base2 = 28 + 76 + 18 + int(s2 * 0.74)
    w2 = run(d, x, 0, l2, s2, INK, True)
    d.rectangle((0, base2 - int(s2 * 0.74) - 8, w2 + 26, base2 + 16), fill=CORAL)
    run(d, x, base2, l2, s2, INK)



# the Queen cut out (rembg, kept to the part of the frame she stands in)
if not os.path.exists('cut/flow_queen.png'):
    remove(S, session=new_session('isnet-general-use')).save('cut/flow_queen.png')
Q = Image.open('cut/flow_queen.png')
m = Image.new('L', (W, H), 0)
ImageDraw.Draw(m).polygon([(0.455 * W, H), (0.47 * W, 0.62 * H), (0.5 * W, 0.5 * H), (0.53 * W, 0.2 * H), (0.6 * W, 0.15 * H),
                           (0.68 * W, 0.22 * H), (0.72 * W, 0.55 * H), (0.77 * W, 0.62 * H), (0.79 * W, H)], fill=255)
alpha = Image.fromarray(np.minimum(np.asarray(Q.split()[3]), np.asarray(m.filter(ImageFilter.GaussianBlur(4)))))
Q.putalpha(alpha)


def queen_layer(warm=1.0, halo=True):
    q = ImageEnhance.Contrast(Q.convert('RGB')).enhance(1.08)
    q = ImageEnhance.Color(q).enhance(warm)
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    if halo:
        edge = alpha.filter(ImageFilter.MaxFilter(11))
        h_ = Image.new('RGBA', (W, H), TEAL + (0,)); h_.putalpha(edge); out.alpha_composite(h_)
        rim = alpha.filter(ImageFilter.MaxFilter(3))
        w_ = Image.new('RGBA', (W, H), (245, 240, 228, 0)); w_.putalpha(rim); out.alpha_composite(w_)
    qq = q.convert('RGBA'); qq.putalpha(alpha); out.alpha_composite(qq)
    return out


# F3: the series split, darker; the Queen in black and white with a neon teal line round her
AMB_D = ((16, 10, 4), (196, 136, 58))
TEA_D = ((4, 18, 17), (64, 176, 156))
sx = int(W * 0.47)
left = ImageOps.colorize(ImageOps.autocontrast(S.crop((0, 0, sx, H)).convert('L'), cutoff=1), *AMB_D)
right = ImageOps.colorize(ImageOps.autocontrast(S.crop((sx, 0, W, H)).convert('L'), cutoff=1), *TEA_D)
f3 = Image.new('RGBA', (W, H)); f3.paste(left, (0, 0)); f3.paste(right, (sx, 0))
glow = alpha.filter(ImageFilter.MaxFilter(17)).filter(ImageFilter.GaussianBlur(10))      # the neon's soft glow
g_ = Image.new('RGBA', (W, H), TEAL + (0,)); g_.putalpha(glow.point(lambda v: int(v * 0.85))); f3.alpha_composite(g_)
line = alpha.filter(ImageFilter.MaxFilter(9))                                             # the hard neon line
l_ = Image.new('RGBA', (W, H), (120, 255, 232, 0)); l_.putalpha(line); f3.alpha_composite(l_)
bw = ImageOps.autocontrast(Q.convert('RGB').convert('L'), cutoff=0.6)
bw = ImageEnhance.Contrast(bw.convert('RGB')).enhance(1.12).convert('RGBA'); bw.putalpha(alpha)
f3.alpha_composite(bw)
words_top(f3, 'WHO TOOK', 'HAWAIʻI?')
grain(f3).save('F3_split_bw.jpg', quality=92)
print('F3_split_bw.jpg')
