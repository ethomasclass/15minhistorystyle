"""Masks for props drawn on plain white (the AI prop sheets), where rembg punches holes in pale parts or keeps only one
of two objects.

  python3 tools/mask_white.py <name> ...            # white-paper mask: anything not paper-white in the clean original
  python3 tools/mask_white.py --fill <name> ...     # keep the rembg mask from tools/mask.py, only fill its small holes
  python3 tools/mask_white.py --fill --hole=60000 p6_nugget   # a bigger limit for one prop

Both fill holes smaller than MAX_HOLE px only, so real openings (a spur's loop, the gaps between corral rails, the sky
between fence posts) stay open. The white-paper mask keeps every piece above MIN_AREA (both spurs, every post).
Reads public/img/props/<name>.jpg (and review/ai_props/<name>.png, the clean original), writes what mask.py writes.
"""
import os, sys
import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from trace import save  # noqa: E402

PUB = os.path.join(HERE, "..", "public")
THR, MAX_HOLE, MIN_AREA = 20, 6000, 1500


def fill_small(m):
    inv = cv2.bitwise_not(m)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(inv)
    h, w = m.shape
    for i in range(1, n):
        x, y, bw, bh, area = stats[i]
        if area < MAX_HOLE and x > 0 and y > 0 and x + bw < w and y + bh < h:
            m[lab == i] = 255
    return m


def white(name):
    im = Image.open(os.path.join(PUB, "img", "props", name + ".jpg")).convert("RGB")
    raw = Image.open(os.path.join(HERE, "..", "review", "ai_props", name + ".png")).convert("RGB").resize(im.size, Image.LANCZOS)
    a = cv2.GaussianBlur(np.asarray(raw, np.float32), (0, 0), 1.5)
    m = ((np.linalg.norm(a - [255, 255, 255], axis=2) > THR) * 255).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    m = fill_small(m)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    keep = np.isin(lab, [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] >= MIN_AREA])
    save(name, im.size, {"subject": (keep * 255).astype(np.uint8)})


def fill(name):
    p = os.path.join(PUB, "img", "masks", name + "_subject.png")
    m = (np.asarray(Image.open(p).convert("L")) > 128).astype(np.uint8) * 255
    save(name, (m.shape[1], m.shape[0]), {"subject": fill_small(m)})


if __name__ == "__main__":
    args = sys.argv[1:]
    mode = fill if "--fill" in args else white
    for a in args:
        if a.startswith("--hole="):
            MAX_HOLE = int(a.split("=")[1])  # a bigger hole to close (the nugget's quartz)
    for n in [a for a in args if not a.startswith("--")]:
        mode(n); print(n)
