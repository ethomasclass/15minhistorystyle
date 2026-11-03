"""Assets for the PaperStage prototype (no Gemini credits): two Diamond Hoax silhouette paintings, already split into
depth layers, palette-locked plane by plane, plus a hinged puppet cut from sil_arnold.

  python3 tools/stage_test_prep.py   -> public/img/stage_test/
"""
import json, os, sys
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from sil_palette import lock, brightness_range  # noqa: E402

DH = os.path.join(HERE, '..', '..', 'Diamond_Hoax', 'public', 'img')
OUT = os.path.join(HERE, '..', 'public', 'img', 'stage_test')
W = 1600  # plenty for a test


def lock_card(name, card):
    src = os.path.join(DH, 'gen', 'scenes', name + '.jpg')
    full = np.asarray(Image.open(src).convert('RGB')).astype(float) / 255
    lo, hi = brightness_range(full)
    d = os.path.join(DH, 'layers', 'sil', name)
    meta = json.load(open(os.path.join(d, 'layers.json')))
    os.makedirs(os.path.join(OUT, card), exist_ok=True)
    n = meta['bands']
    for k in range(n):
        fn = f'L{k}.webp' if k < n - 1 else f'L{k}.jpg'
        im = Image.open(os.path.join(d, fn)).convert('RGBA')
        a = np.asarray(im).astype(float) / 255
        rgb = lock(a[..., :3], lo, hi)
        h = round(im.size[1] * W / im.size[0])
        out = Image.fromarray(np.dstack([rgb, (a[..., 3] * 255).astype(np.uint8)]), 'RGBA').resize((W, h), Image.LANCZOS)
        out.save(os.path.join(OUT, card, f'L{k}.png'), optimize=True)
    print(card, name, n, 'layers')
    return n


def puppet():
    im = np.asarray(Image.open(os.path.join(DH, 'props', 'sil_arnold.webp')).convert('RGBA')).copy()
    H, Wd = im.shape[:2]
    PX, PY, R, CUT = 212, 612, 38, 200          # elbow pivot (px), joint disc radius, cut line (x)
    yy, xx = np.mgrid[0:H, 0:Wd]
    disc = (xx - PX) ** 2 + (yy - PY) ** 2 <= R * R
    arm_zone = (xx < CUT) & (yy > 470) & (yy < 820)
    arm = im.copy(); arm[..., 3] = np.where(arm_zone | (disc & (im[..., 3] > 0)), im[..., 3], 0)
    body = im.copy(); body[..., 3] = np.where(arm_zone & ~disc, 0, im[..., 3])
    bag = np.zeros((H, Wd), bool)  # (no coral on the puppet: the hand and bag are one black shape; the scene's lantern is the accent)
    # warm ink black, like the desk
    for p in (arm, body):
        nb = ~bag if p is arm else np.ones((H, Wd), bool)
        dark = (p[..., 3] > 0) & nb & (p[..., :3].mean(-1) < 120)
        p[dark, 0], p[dark, 1], p[dark, 2] = 13, 12, 9
    os.makedirs(os.path.join(OUT, 'puppet'), exist_ok=True)
    Image.fromarray(body).save(os.path.join(OUT, 'puppet', 'body.png'), optimize=True)
    Image.fromarray(arm).save(os.path.join(OUT, 'puppet', 'arm.png'), optimize=True)
    json.dump({'size': [Wd, H], 'pivot': [PX, PY]}, open(os.path.join(OUT, 'puppet', 'puppet.json'), 'w'))
    print('puppet', Wd, H)


if __name__ == '__main__':
    a = lock_card('sil_salting', 'card1')
    b = lock_card('sil_fever', 'card2')
    puppet()
    json.dump({'card1': a, 'card2': b}, open(os.path.join(OUT, 'cards.json'), 'w'))
