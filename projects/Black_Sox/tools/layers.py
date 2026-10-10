"""2.5D parallax layers for any picture that has a subject mask (archival photo or Flow card).

Reads the source path from tools/mask.py JOBS and the mask from public/img/masks/<name>_subject.png, and writes
  public/img/layers/<name>_fg.webp  the subject alone, soft-edged, on transparency
  public/img/layers/<name>_bg.jpg   the picture with the subject painted out, so the subject can slide over it
The background fill only has to hold up at the edges: the subject layer covers it except for the few pixels the
parallax uncovers. Generalised from Good Luck's gen_layers.py (which needed a Gemini magenta pass).

  python3 tools/layers.py              # every mask job that has a mask
  python3 tools/layers.py cicotte landis
"""
import os, sys
import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
PUB = os.path.join(HERE, "..", "public")
OUT = os.path.join(PUB, "img", "layers")
MAX = 2400


def jobs():
    import ast
    src = open(os.path.join(HERE, "mask.py")).read()
    node = next(n for n in ast.parse(src).body if isinstance(n, ast.Assign) and getattr(n.targets[0], "id", "") == "JOBS")
    return ast.literal_eval(node.value)


def run(name, src, grow=3, hole_px=25):
    pic = Image.open(os.path.join(PUB, src)).convert("RGB")
    if max(pic.size) > MAX:                  # layers only need to hold up at 1080p with a push; the scene stretches them
        pic.thumbnail((MAX, MAX), Image.LANCZOS)
    im = np.asarray(pic)
    m = np.asarray(Image.open(os.path.join(PUB, "img", "masks", name + "_subject.png")).convert("L"))
    if m.shape != im.shape[:2]:
        m = cv2.resize(m, (im.shape[1], im.shape[0]), interpolation=cv2.INTER_NEAREST)
    m = (m > 128).astype(np.uint8) * 255
    h, w = m.shape
    k = max(3, int(round(min(w, h) / 1000 * grow)) * 2 + 1)         # scale the grow with the picture
    fg_a = cv2.GaussianBlur(cv2.dilate(m, np.ones((k, k), np.uint8)), (0, 0), max(1.5, k / 4))
    os.makedirs(OUT, exist_ok=True)
    rgb = im * (fg_a[..., None] > 0)          # blank the hidden pixels so the PNG compresses
    Image.fromarray(np.dstack([rgb.astype(np.uint8), fg_a])).save(os.path.join(OUT, name + "_fg.webp"), quality=90, method=5)
    hk = max(9, int(round(min(w, h) / 1000 * hole_px)) * 2 + 1)
    hole = cv2.dilate(m, np.ones((hk, hk), np.uint8))
    s = 2 if max(w, h) < 3000 else 4
    small = cv2.resize(im, (w // s, h // s), interpolation=cv2.INTER_AREA)
    hs = cv2.resize(hole, (w // s, h // s), interpolation=cv2.INTER_NEAREST)
    fill = cv2.inpaint(cv2.cvtColor(small, cv2.COLOR_RGB2BGR), hs, 15, cv2.INPAINT_TELEA)
    fill = cv2.cvtColor(cv2.resize(fill, (w, h), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2RGB).astype(np.float32)
    fill = cv2.GaussianBlur(fill, (0, 0), 3) + np.random.default_rng(1).normal(0, 4, (h, w, 1))   # keep some grain
    a = (cv2.GaussianBlur(hole, (0, 0), 4).astype(np.float32) / 255)[..., None]
    bg = im * (1 - a) + fill * a
    Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name + "_bg.jpg"), quality=92)
    print("layers", name, f"{w}x{h}")


if __name__ == "__main__":
    J = jobs()
    names = sys.argv[1:] or [n for n in J if os.path.exists(os.path.join(PUB, "img", "masks", n + "_subject.png"))]
    for n in names:
        run(n, J[n][0])
