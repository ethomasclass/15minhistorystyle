# Rough thumbnail mock-ups in the channel's split format: a cut-out figure in the middle (grayscale, teal edge), an
# amber-toned picture on the left, a teal-toned picture on the right, two lines of type bottom-left (white on black, then
# big black on coral). Run from this folder: python3 thumb_mock.py
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
from rembg import remove, new_session

RAW = '../../Hawaii_Samples/img/raw/'
FLOW = '../../Hawaii_Samples/img/flow/'
FONT = '../../Hawaii_Samples/fonts/AbrilFatface-full.ttf'
FALL = '../../Hawaii_Samples/fonts/PlayfairDisplay-900-full.ttf'   # Abril has no ʻokina
W, H = 1280, 720
CORAL, TEAL, INK = (255, 111, 97), (47, 224, 196), (17, 17, 17)
os.makedirs('cut', exist_ok=True)
sess = None


def cutout(name):
    global sess
    out = f'cut/{name}.png'
    if not os.path.exists(out):
        sess = sess or new_session('isnet-general-use')
        remove(Image.open(RAW + name + '.jpg').convert('RGB'), session=sess).save(out)
    return Image.open(out)


def duo(im, dark, light, size, focus=(0.5, 0.5)):
    im = ImageOps.fit(im.convert('L'), size, centering=focus)
    im = ImageOps.autocontrast(im, cutoff=1)
    return ImageOps.colorize(im, dark, light)


def figure(name, h, crop=None, poly=None):
    im = cutout(name)
    if poly:                                # keep only the person (drop the throne drapery behind the Queen)
        m = Image.new('L', im.size, 0)
        ImageDraw.Draw(m).polygon([(x * im.width, y * im.height) for x, y in poly], fill=255)
        m = m.filter(ImageFilter.GaussianBlur(3))
        a = np.minimum(np.asarray(im.split()[3]), np.asarray(m))
        im.putalpha(Image.fromarray(a))
    if crop:
        w0, h0 = im.size
        im = im.crop((int(crop[0] * w0), int(crop[1] * h0), int(crop[2] * w0), int(crop[3] * h0)))
    im = im.resize((int(im.width * h / im.height), h), Image.LANCZOS)
    a = im.split()[3]
    g = ImageOps.autocontrast(im.convert('L'), cutoff=1)
    g = Image.merge('RGBA', (g, g, g, a))
    edge = a.filter(ImageFilter.MaxFilter(9))
    halo = Image.new('RGBA', im.size, TEAL + (0,)); halo.putalpha(edge)
    rim = a.filter(ImageFilter.MaxFilter(3)); white = Image.new('RGBA', im.size, (240, 240, 230, 0)); white.putalpha(rim)
    out = Image.new('RGBA', im.size, (0, 0, 0, 0))
    out.alpha_composite(halo); out.alpha_composite(white); out.alpha_composite(g)
    return out


def run(d, x, y, txt, size, fill, measure=False):
    """draw txt in Abril, falling back to Playfair for glyphs Abril lacks; returns the width"""
    f, g = ImageFont.truetype(FONT, size), ImageFont.truetype(FALL, size)
    for ch in txt:
        fn = g if ch == 'ʻ' else f
        if not measure:
            d.text((x, y), ch, font=fn, fill=fill, anchor='ls')
        x += fn.getlength(ch)
    return x


def words(img, l1, l2, x=34, s2=150):
    d = ImageDraw.Draw(img)
    while run(d, x, 0, l2, s2, INK, True) > W * 0.58:
        s2 -= 4
    base2 = H - 30                          # line 2 sits on the bottom edge, never past it
    d.rectangle((0, base2 - s2 * 0.42, run(d, x, 0, l2, s2, INK, True) + 26, H), fill=CORAL)
    run(d, x, base2, l2, s2, INK)
    base1 = base2 - s2 * 0.78 - 18
    w1 = run(d, x, 0, l1, 64, INK, True)
    d.rectangle((x - 14, base1 - 56, w1 + 14, base1 + 16), fill=INK)
    run(d, x, base1, l1, 64, (245, 242, 235))


def grain(img):
    n = np.random.default_rng(1).normal(0, 9, (H, W, 1))
    a = np.clip(np.asarray(img.convert('RGB'), np.float32) + n, 0, 255).astype(np.uint8)
    im = Image.fromarray(a)
    mask = Image.new('L', (W, H), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, W, H), 28, fill=255)
    bg = Image.new('RGB', (W, H), (14, 14, 14)); bg.paste(im, (0, 0), mask)
    return bg


def make(out, left, right, fig, l1, l2, split=0.47, fig_x=0.5, **kw):
    img = Image.new('RGBA', (W, H))
    sx = int(W * split)
    img.paste(left.resize((sx, H)) if left.size != (sx, H) else left, (0, 0))
    img.paste(right, (sx, 0))
    img.alpha_composite(fig, (int(W * fig_x - fig.width / 2), H - fig.height))
    words(img, l1, l2, **kw)
    grain(img).save(out, quality=92)
    print(out)


AMB = ((28, 18, 8), (236, 178, 84))
TEA = ((6, 26, 24), (120, 228, 206))
sx = int(W * 0.47)

if __name__ == "__main__":
    # A: the Queen between the landing party and the palace
    make('A_who_took_hawaii.jpg',
         duo(Image.open(RAW + 'boston_landing.jpg'), *AMB, (sx, H)),
         duo(Image.open(FLOW + 'p4_palace.jpg'), *TEA, (W - sx, H), (0.55, 0.4)),
         figure('loc_liliuokalani_1891', 640, (0.2, 0.2, 0.7, 0.66), poly=[(.40,.24),(.50,.225),(.535,.30),(.535,.36),(.59,.37),(.61,.43),(.63,.53),(.65,.70),(.24,.70),(.26,.55),(.28,.43),(.30,.38),(.37,.355),(.385,.31)]), 'WHO TOOK', 'HAWAIʻI?')

    # B: Dole between the annexation ceremony and the Queen
    make('B_yes_that_dole.jpg',
         duo(Image.open(RAW + 'loc_annexation_ceremony.jpg'), *AMB, (sx, H)),
         duo(Image.open(RAW + 'loc_liliuokalani_portrait.jpg'), *TEA, (W - sx, H), (0.5, 0.25)),
         figure('loc_dole', 660, (0, 0, 1, 0.7)), 'YES, THAT', 'DOLE.', s2=190)

    # C: the Queen between the USS Boston and the palace grounds
    make('C_her_own_palace.jpg',
         duo(Image.open(RAW + 'loc_uss_boston_1891.jpg'), *AMB, (sx, H)),
         duo(Image.open(RAW + 'loc_palace_grounds.jpg'), *TEA, (W - sx, H)),
         figure('loc_liliuokalani_1891', 640, (0.2, 0.2, 0.7, 0.66), poly=[(.40,.24),(.50,.225),(.535,.30),(.535,.36),(.59,.37),(.61,.43),(.63,.53),(.65,.70),(.24,.70),(.26,.55),(.28,.43),(.30,.38),(.37,.355),(.385,.31)]), 'LOCKED IN', 'HER PALACE', s2=130)
