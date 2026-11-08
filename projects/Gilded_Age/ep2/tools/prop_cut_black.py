"""Cut out props shot on BLACK (white objects: paper, a crane, a card) to transparent WebPs, like prop_cut.py does for props on
white. Alpha comes from brightness above the black background (soft edge), the largest object is kept, and small holes inside it
are filled; real openings touching the outside stay open (The Balloon War v2: the paper crane, the washi stack, the door card).
Sources: public/img/props/src/<name>.jpg (or .png), prompted as "a white ... on a pure black background".

  python3 tools/prop_cut_black.py paper_crane washi_stack door_card
"""
import os, sys
import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "public", "img", "desk", "src")
OUT = os.path.join(HERE, "..", "public", "img", "desk")
LO, HI, MAX_HOLE = 38, 70, 4000
for n in sys.argv[1:]:
    p = os.path.join(SRC, n + ".jpg")
    im = np.asarray(Image.open(p if os.path.exists(p) else p[:-4] + ".png").convert("RGB"))
    v = im.max(-1).astype(np.float32)
    bg = np.median(np.concatenate([v[:40].ravel(), v[-40:].ravel(), v[:, :40].ravel(), v[:, -40:].ravel()]))
    a = np.clip((v - bg - (LO - 20)) / (HI - LO), 0, 1)
    hard = (a > 0.5).astype(np.uint8)
    k, lab, st, _ = cv2.connectedComponentsWithStats(hard)
    keep = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    obj = (lab == keep).astype(np.uint8)
    obj = cv2.dilate(obj, np.ones((9, 9), np.uint8))
    inv = 1 - (a > 0.5).astype(np.uint8)
    k2, lab2, st2, _ = cv2.connectedComponentsWithStats(inv)
    h, w = a.shape
    for i in range(1, k2):
        x, y, bw, bh, area = st2[i]
        if area < MAX_HOLE and x > 0 and y > 0 and x + bw < w and y + bh < h:
            a[lab2 == i] = 1
    a = a * obj
    rgba = np.dstack([im, (a * 255).astype(np.uint8)])
    ys, xs = np.nonzero(a > 0.04)
    pad = 12
    cut = Image.fromarray(rgba, "RGBA").crop((max(0, xs.min() - pad), max(0, ys.min() - pad), min(w, xs.max() + pad), min(h, ys.max() + pad)))
    cut.thumbnail((1600, 1600), Image.LANCZOS)
    cut.save(os.path.join(OUT, n + ".webp"), quality=90, method=6)
    print(n, cut.size)
