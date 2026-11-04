"""Cut generated props (public/img/props/src/<name>.jpg, object on white) out to transparent WebPs:
public/img/props/<name>.webp, trimmed to the object with a small margin, longest side <= 1600 px.

  python3 tools/prop_cut.py              # all
  python3 tools/prop_cut.py barmbrack    # some
"""
import glob, os, sys
import numpy as np
from PIL import Image
from rembg import new_session, remove

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "public", "img", "props", "src")
OUT = os.path.join(HERE, "..", "public", "img", "props")
names = sys.argv[1:] or [os.path.basename(f)[:-4] for f in sorted(glob.glob(os.path.join(SRC, "*.jpg")))]
sess = new_session("isnet-general-use")
for n in names:
    im = Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")
    cut = remove(im, session=sess, post_process_mask=True)
    a = np.array(cut)[:, :, 3]
    a[a < 24] = 0                                     # drop the faint shadow haze
    if os.environ.get("FILL_HOLES"):
        # put back enclosed pale parts rembg took for background (a barometer's dial, paste in a pot): any hole not touching
        # the edge whose source colour differs from the white backdrop gets its own pixels back (Balloon War, Nov 2026)
        import cv2
        src = np.asarray(im).astype(np.float32)
        bgc = np.median(np.concatenate([src[:20].reshape(-1, 3), src[-20:].reshape(-1, 3)]), 0)
        holes = (a < 128).astype(np.uint8)
        k, lab, st, _ = cv2.connectedComponentsWithStats(holes)
        H, W = a.shape
        for i in range(1, k):
            x, y, bw, bh, area = st[i]
            if x == 0 or y == 0 or x + bw >= W or y + bh >= H:
                continue
            m = lab == i
            if np.abs(src[m] - bgc).mean() > 12:
                a[m] = 255
        cut = Image.fromarray(np.dstack([np.asarray(im), a]).astype(np.uint8), "RGBA")
    if not os.environ.get("FILL_HOLES"):
        cut.putalpha(Image.fromarray(a))
    ys, xs = np.nonzero(a)
    pad = 12
    box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(im.width, xs.max() + pad), min(im.height, ys.max() + pad))
    cut = cut.crop(box)
    cut.thumbnail((1600, 1600), Image.LANCZOS)
    cut.save(os.path.join(OUT, n + ".webp"), quality=90, method=6)
    print(n, cut.size)
