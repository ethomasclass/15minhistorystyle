"""Ep 2 AI props and plates → scene-ready files: plates lose any border Gemini drew and are cropped back to 16:9, then
everything is weathered (props light with no crease, plates medium) into public/img/props/.

  python3 tools/prep_props.py [name ...]

Masks for the props then come from tools/mask.py (jobs in tools/mask_jobs/props.py).
"""
import os, subprocess, sys
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "review", "ai_props")
DST = os.path.join(HERE, "..", "public", "img", "props")
EXTRA = {"L3_river_crossing": (0, 0, 0, 40)}  # extra px to cut (left, top, right, bottom): L3's invented caption


def unframe(im):
    """Step in from each edge past a light, flat border and the thin line that closes it."""
    a = np.asarray(im.convert("L"), np.float32)
    h, w = a.shape

    def edge(lines):
        i = 0
        while i < len(lines) // 5 and lines[i].mean() > 185 and lines[i].std() < 18:
            i += 1
        return i + 10 if i else 0  # past the frame line too
    t, b = edge(a), edge(a[::-1])
    l, r = edge(a.T), edge(a.T[::-1])
    return im.crop((l, t, w - r, h - b))


def to169(im):
    w, h = im.size
    if w / h > 16 / 9:
        nw = int(h * 16 / 9); x = (w - nw) // 2; return im.crop((x, 0, x + nw, h))
    nh = int(w * 9 / 16); y = (h - nh) // 2; return im.crop((0, y, w, y + nh))


def main(names):
    os.makedirs(DST, exist_ok=True)
    for f in sorted(os.listdir(SRC)):
        n, ext = os.path.splitext(f)
        if ext != ".png" or n.endswith("_orig") or (names and n not in names):
            continue
        src = os.path.join(SRC, f)
        if n.startswith("L"):
            im = unframe(Image.open(src).convert("RGB"))
            l, t, r, b = EXTRA.get(n, (0, 0, 0, 0))
            im = to169(im.crop((l, t, im.width - r, im.height - b)))
            tmp = os.path.join(DST, n + "_tmp.png"); im.save(tmp)
            subprocess.run([sys.executable, os.path.join(HERE, "weather.py"), tmp, os.path.join(DST, n + ".jpg"), "--preset", "medium"], check=True)
            os.remove(tmp)
        else:
            subprocess.run([sys.executable, os.path.join(HERE, "weather.py"), src, os.path.join(DST, n + ".jpg"), "--preset", "light", "--no-crease"], check=True)
        print(n)


if __name__ == "__main__":
    main(sys.argv[1:])
