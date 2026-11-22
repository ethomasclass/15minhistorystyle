# Procedural surfaces (no AI needed): the channel's dark desk with wood grain and paper fibre, and an archive light table.
import numpy as np
from PIL import Image, ImageFilter


def noise(h, w, scale, seed):
    r = np.random.default_rng(seed)
    s = r.random((max(2, int(h / scale) + 2), max(2, int(w / scale) + 2))).astype(np.float32)
    return np.asarray(Image.fromarray((s * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255


def desk(w, h, path, seed=1, cols=((42, 38, 32), (22, 20, 15), (13, 12, 9)), grid=0, grid_col=(244, 239, 230), grid_op=0.06):
    """The desk: a radial fall-off through three colours (default DarkPaper #2a2620 -> #16140f -> #0d0c09) with a
    faint walnut grain and fibres. grid > 0 rules a notebook grid of that pitch (px) into the surface."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.hypot((xx - 0.45 * w) / (0.75 * w), (yy - 0.4 * h) / (0.75 * h))
    c0, c1, c2 = [np.array(c, np.float32) for c in cols]
    t = np.clip(r / 0.7, 0, 1)[..., None]
    base = c0 * (1 - t) + c1 * t
    t2 = np.clip((r[..., None] - 0.7) / 0.3, 0, 1)
    base = base * (1 - t2) + c2 * t2
    warp = noise(h, w, 260, seed) * 40 + noise(h, w, 60, seed + 1) * 6
    grain = (0.5 + 0.5 * np.sin((yy + warp) * 0.045 + noise(h, w, 300, seed + 2) * 14)) ** 3
    fib = noise(h, w, 2.2, seed + 3) - 0.5
    img = base * (1 + 0.06 * (grain[..., None] - 0.3)) * (1 + 0.05 * fib[..., None])
    img *= (0.94 + 0.12 * noise(h, w, 500, seed + 4))[..., None]
    if grid:
        g = ((xx % grid) < 1.6) | ((yy % grid) < 1.6)
        heavy = ((xx % (grid * 5)) < 2.4) | ((yy % (grid * 5)) < 2.4)
        a = (g * grid_op + heavy * grid_op * 0.9)[..., None] * (0.7 + 0.6 * noise(h, w, 40, seed + 5))[..., None]
        img = img * (1 - a) + np.array(grid_col, np.float32) * a
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
    # gridded surfaces: the black desk, and the channel's teal and coral taken deep enough to sit under pictures
    desk(2880, 1620, 'img/desk_grid_black.jpg', grid=96)
    desk(2880, 1620, 'img/desk_grid_teal.jpg', seed=3, cols=((24, 92, 84), (13, 60, 56), (7, 36, 34)), grid=96, grid_col=(190, 255, 244), grid_op=0.07)
    desk(2880, 1620, 'img/desk_grid_coral.jpg', seed=5, cols=((196, 86, 74), (150, 58, 50), (98, 36, 32)), grid=96, grid_col=(255, 226, 214), grid_op=0.08)
    desk(2880, 1620, 'img/desk_grid_bone.jpg', seed=7, cols=((237, 231, 220), (222, 213, 196), (196, 185, 164)), grid=96, grid_col=(60, 110, 104), grid_op=0.16)
    lighttable(3000, 1900, 'img/lighttable.jpg')
    print('ok')
