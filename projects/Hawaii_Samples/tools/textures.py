# Procedural surfaces (no AI needed): the channel's dark desk with wood grain and paper fibre, and an archive light table.
import numpy as np
from PIL import Image, ImageFilter


def noise(h, w, scale, seed):
    r = np.random.default_rng(seed)
    s = r.random((max(2, int(h / scale) + 2), max(2, int(w / scale) + 2))).astype(np.float32)
    return np.asarray(Image.fromarray((s * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255


def desk(w, h, path, seed=1):
    """DarkPaper (#2a2620 -> #16140f -> #0d0c09) with a faint walnut grain and fibres"""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.hypot((xx - 0.45 * w) / (0.75 * w), (yy - 0.4 * h) / (0.75 * h))
    c0, c1, c2 = np.array([42, 38, 32]), np.array([22, 20, 15]), np.array([13, 12, 9])
    t = np.clip(r / 0.7, 0, 1)[..., None]
    base = np.where(t < 1, c0 * (1 - t) + c1 * t, c1)
    base = np.where((r > 0.7)[..., None], c1 * (1 - np.clip((r[..., None] - 0.7) / 0.3, 0, 1)) + c2 * np.clip((r[..., None] - 0.7) / 0.3, 0, 1), base)
    warp = noise(h, w, 260, seed) * 40 + noise(h, w, 60, seed + 1) * 6
    grain = 0.5 + 0.5 * np.sin((yy + warp) * 0.045 + noise(h, w, 300, seed + 2) * 14)
    grain = grain ** 3
    fib = noise(h, w, 2.2, seed + 3) - 0.5
    img = base * (1 + 0.06 * (grain[..., None] - 0.3)) * (1 + 0.05 * fib[..., None])
    img *= (0.94 + 0.12 * noise(h, w, 500, seed + 4))[..., None]
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(path, quality=92)


def lighttable(w, h, path, seed=2):
    """a backlit opal glass panel in a dark bevelled frame, brightest a little left of centre, with faint dust"""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    m = 70
    inside = (xx > m) & (xx < w - m) & (yy > m) & (yy < h - m)
    r = np.hypot((xx - 0.44 * w) / (0.62 * w), (yy - 0.47 * h) / (0.62 * h))
    glow = np.clip(1.0 - 0.35 * r ** 1.6, 0, 1)
    warm = np.array([247, 244, 236]) * glow[..., None] + np.array([224, 214, 196]) * (1 - glow[..., None]) * 0.25
    warm *= (0.985 + 0.03 * noise(h, w, 30, seed))[..., None]
    dust = (np.random.default_rng(seed).random((h, w)) > 0.9993).astype(np.float32)
    dust = np.asarray(Image.fromarray((dust * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1)), np.float32) / 255
    warm *= (1 - 0.5 * dust[..., None])
    edge = np.minimum(np.minimum(xx - m, w - m - xx), np.minimum(yy - m, h - m - yy))
    warm *= np.clip(0.82 + edge / 140, 0.82, 1)[..., None]
    frame = np.array([28, 27, 25]) * (0.8 + 0.4 * noise(h, w, 8, seed + 1))[..., None]
    bevel = np.clip(1 - np.abs(np.minimum(np.minimum(xx, w - xx), np.minimum(yy, h - yy)) - m * 0.5) / (m * 0.5), 0, 1)
    frame = frame * (1 + 0.6 * bevel[..., None] * (yy < h / 2)[..., None])
    img = np.where(inside[..., None], warm, frame)
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(path, quality=92)


if __name__ == '__main__':
    desk(4400, 2700, 'img/desk.jpg')
    lighttable(3000, 1900, 'img/lighttable.jpg')
    print('ok')
