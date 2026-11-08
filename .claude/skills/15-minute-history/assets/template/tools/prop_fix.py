"""Fixes for cut-outs whose pale or dark insides were taken for background (Gilded Age Ep 1, Nov 7).
  python3 tools/prop_fix.py fill p02_railroad_watch p07_tin_plate     # rembg cut, then fill every enclosed hole (white dial, white enamel)
  python3 tools/prop_fix.py fillblack p09_inspection_certificate      # black-bg cut with no hole-size limit (the dark wax seal)
  python3 tools/prop_fix.py base p03_edison_bulb_lit                  # glass from brightness, the dark brass base from rembg"""
import os, sys
import cv2, numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.join(HERE, '..', 'public', 'img', 'props', 'src'); OUT = os.path.join(HERE, '..', 'public', 'img', 'props')

def rembg_alpha(im):
    from rembg import new_session, remove
    a = np.array(remove(im, session=new_session('isnet-general-use'), post_process_mask=True))[:, :, 3]
    a[a < 24] = 0; return a

def bright_alpha(im):
    v = np.asarray(im).max(-1).astype(np.float32)
    bg = np.median(np.concatenate([v[:40].ravel(), v[-40:].ravel(), v[:, :40].ravel(), v[:, -40:].ravel()]))
    return np.clip((v - bg - 18) / 32, 0, 1)

def fill_holes(a):
    hard = (a > 127).astype(np.uint8); inv = 1 - hard
    k, lab, st, _ = cv2.connectedComponentsWithStats(inv); h, w = a.shape
    for i in range(1, k):
        x, y, bw, bh, _ = st[i]
        if x > 0 and y > 0 and x + bw < w and y + bh < h: a[lab == i] = 255
    return a

def save(n, im, a):
    ys, xs = np.nonzero(a > 10); pad = 12; h, w = a.shape
    cut = Image.fromarray(np.dstack([np.asarray(im), a]).astype(np.uint8), 'RGBA').crop(
        (max(0, xs.min() - pad), max(0, ys.min() - pad), min(w, xs.max() + pad), min(h, ys.max() + pad)))
    cut.thumbnail((1600, 1600), Image.LANCZOS); cut.save(os.path.join(OUT, n + '.webp'), quality=90, method=6); print(n, cut.size)

mode = sys.argv[1]
for n in sys.argv[2:]:
    im = Image.open(os.path.join(SRC, n + '.jpg')).convert('RGB')
    if mode == 'fill':
        a = fill_holes(rembg_alpha(im))
    elif mode == 'fillblack':
        b = bright_alpha(im); hard = (b > 0.5).astype(np.uint8)
        k, lab, st, _ = cv2.connectedComponentsWithStats(hard); keep = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
        obj = cv2.dilate((lab == keep).astype(np.uint8), np.ones((9, 9), np.uint8))
        a = fill_holes((b * obj * 255).astype(np.uint8))
    elif mode == 'base':
        b = (bright_alpha(im) * 255).astype(np.uint8); r = rembg_alpha(im)
        ys = np.nonzero(r.max(1) > 127)[0]; cut_row = int(ys.min() + 0.72 * (ys.max() - ys.min()))   # lower 28% = collar and screw base
        a = b.copy(); a[cut_row:] = np.maximum(b[cut_row:], r[cut_row:])
    save(n, im, a)
