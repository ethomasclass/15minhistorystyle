# The print pass: makes a clean render look like ink on old paper. python3 tools/press.py in.png out.png
#   ink dropout (specks of bare paper, more in the darks), uneven ink density, a 1 px plate misregistration,
#   paper fibres, and worn, slightly lighter edges.
import sys
import numpy as np
from PIL import Image, ImageFilter

def noise(h, w, scale, seed):
    r = np.random.default_rng(seed)
    small = r.random((max(2, int(h / scale) + 2), max(2, int(w / scale) + 2))).astype(np.float32)
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(im, np.float32) / 255

def press(src, dst, paper=(233, 219, 184), seed=5):
    im = np.asarray(Image.open(src).convert('RGB'), np.float32) / 255
    h, w, _ = im.shape
    pap = np.array(paper, np.float32) / 255
    r = np.random.default_rng(seed)
    # plate misregistration: the warm plate sits one pixel off
    im[..., 0] = np.roll(im[..., 0], 1, axis=1)
    im[..., 2] = np.roll(im[..., 2], -1, axis=0)
    # uneven ink density
    dens = (noise(h, w, 90, seed) - 0.5) * 0.07 + (noise(h, w, 9, seed + 1) - 0.5) * 0.03
    im = im * (1 + dens[..., None])
    # ink dropout: fine specks where the paper shows through, more where the ink is dark
    lum = im.mean(-1)
    fine = r.random((h, w)).astype(np.float32)
    clump = noise(h, w, 3.2, seed + 2)
    thresh = 0.994 - 0.012 * (1 - lum) - 0.02 * (clump > 0.74)
    drop = (fine > thresh).astype(np.float32)
    drop = np.asarray(Image.fromarray((drop * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.5)), np.float32) / 255
    im = im * (1 - drop[..., None] * 0.55) + pap * drop[..., None] * 0.55
    # paper fibres
    fib = Image.new('L', (w, h), 0)
    from PIL import ImageDraw
    d = ImageDraw.Draw(fib)
    for _ in range(int(w * h / 9000)):
        x, y, a, L = r.random() * w, r.random() * h, r.random() * np.pi, 6 + r.random() * 22
        d.line([(x, y), (x + np.cos(a) * L, y + np.sin(a) * L)], fill=int(60 + r.random() * 90), width=1)
    f = np.asarray(fib.filter(ImageFilter.GaussianBlur(0.6)), np.float32) / 255
    sign = np.where(noise(h, w, 40, seed + 3) > 0.5, 1.0, -1.0)
    im = im + (f * 0.07 * sign)[..., None]
    # worn edges
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    edge = np.minimum(np.minimum(xx, w - 1 - xx), np.minimum(yy, h - 1 - yy))
    wear = np.clip(1 - (edge + (noise(h, w, 22, seed + 4) - 0.5) * 12) / 9, 0, 1)
    im = im * (1 - wear[..., None] * 0.3) + pap * wear[..., None] * 0.3
    Image.fromarray((np.clip(im, 0, 1) * 255 + 0.5).astype(np.uint8)).save(dst)

if __name__ == '__main__':
    press(sys.argv[1], sys.argv[2])
    print('ok', sys.argv[2])
