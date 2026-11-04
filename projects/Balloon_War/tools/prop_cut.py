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
    cut.putalpha(Image.fromarray(a))
    ys, xs = np.nonzero(a)
    pad = 12
    box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(im.width, xs.max() + pad), min(im.height, ys.max() + pad))
    cut = cut.crop(box)
    cut.thumbnail((1600, 1600), Image.LANCZOS)
    cut.save(os.path.join(OUT, n + ".webp"), quality=90, method=6)
    print(n, cut.size)
