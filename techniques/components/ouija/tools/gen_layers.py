"""2.5D layers for the Gemini paintings that have a subject mask.

For each public/img/masks/<name>_magenta.png (made by tools/trace.py from the mask pass), writes
  public/img/gen/layers/<name>_fg.png   the subject alone, soft-edged, on transparency
  public/img/gen/layers/<name>_bg.jpg   the painting with the subject painted out (so it can slide behind)
The background fill only has to hold up at the edges: the subject layer covers it except for the few
pixels the parallax uncovers.

  python3 tools/gen_layers.py            # every painting with a mask
  python3 tools/gen_layers.py ch01_basement
"""
import glob, os, sys
import cv2
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(HERE, "..", "public", "img")
OUT = os.path.join(PUB, "gen", "layers")


def run(name):
    im = np.asarray(Image.open(os.path.join(PUB, "gen", name + ".jpg")).convert("RGB"))
    m = np.asarray(Image.open(os.path.join(PUB, "masks", name + "_magenta.png")).convert("L"))
    if m.shape != im.shape[:2]:
        m = cv2.resize(m, (im.shape[1], im.shape[0]), interpolation=cv2.INTER_NEAREST)
    h, w = m.shape
    # subject: grown 3 px (the mask pass hugs the outline tightly), feathered 2 px
    fg_a = cv2.GaussianBlur(cv2.dilate(m, np.ones((7, 7), np.uint8)), (0, 0), 2)
    os.makedirs(OUT, exist_ok=True)
    Image.fromarray(np.dstack([im, fg_a])).save(os.path.join(OUT, name + "_fg.png"), optimize=True)
    # background: inpaint a generously grown hole at half size, upscale, keep the original grain on top
    hole = cv2.dilate(m, np.ones((25, 25), np.uint8))
    s = 2
    small = cv2.resize(im, (w // s, h // s), interpolation=cv2.INTER_AREA)
    hs = cv2.resize(hole, (w // s, h // s), interpolation=cv2.INTER_NEAREST)
    fill = cv2.inpaint(cv2.cvtColor(small, cv2.COLOR_RGB2BGR), hs, 15, cv2.INPAINT_TELEA)
    fill = cv2.cvtColor(cv2.resize(fill, (w, h), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2RGB).astype(np.float32)
    fill = cv2.GaussianBlur(fill, (0, 0), 3) + np.random.default_rng(1).normal(0, 4, (h, w, 1))
    a = (cv2.GaussianBlur(hole, (0, 0), 4).astype(np.float32) / 255)[..., None]
    bg = im * (1 - a) + fill * a
    Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name + "_bg.jpg"), quality=92)
    print("layers", name)


if __name__ == "__main__":
    names = sys.argv[1:] or sorted(os.path.basename(p)[:-len("_magenta.png")] for p in glob.glob(os.path.join(PUB, "masks", "*_magenta.png")))
    for n in names:
        run(n)
