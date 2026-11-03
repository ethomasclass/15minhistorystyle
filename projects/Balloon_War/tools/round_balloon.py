"""Draw the Fu-Go paper balloon as a cut-paper shape: a round sphere of paper panels (gores) with seams, a small nozzle, and
optionally its rig (shroud lines to the black ring and its little sandbags). Supersampled for clean edges. Returns RGBA.

Used to replace AI balloons that came out as teardrops (hot-air shape); also usable as its own animated layer.

  from round_balloon import balloon
  im = balloon(diameter=270, rig='ring' | 'tether' | None)
"""
import math
import numpy as np
from PIL import Image, ImageDraw

LIGHT, MID, DARK = (238, 118, 96), (229, 109, 88), (196, 92, 74)  # sampled from the Flow paper balloons
INK = (13, 12, 9)


def balloon(diameter, rig='ring', ss=4, seed=1):
    R = diameter / 2
    rig_h = {'ring': diameter * 1.35, 'tether': diameter * 0.12, None: 0}[rig]
    W = int(diameter * 1.1 * ss); H = int((diameter * 1.05 + rig_h) * ss)
    cx, cy, r = W / 2, R * 1.02 * ss, R * ss
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    dx, dy = (xx - cx) / r, (yy - cy) / r
    inside = dx * dx + dy * dy <= 1
    # longitude of each point on the sphere: vertical paper panels
    rr = np.sqrt(np.clip(1 - dy * dy, 1e-6, 1))
    lon = np.arcsin(np.clip(dx / rr, -1, 1))
    n = 7  # visible panels
    band = (lon + math.pi / 2) / (math.pi / n)
    frac = band - np.floor(band)
    idx = np.floor(band).astype(int)
    rgb = np.zeros((H, W, 3))
    rgb[:] = MID
    rgb[(idx % 2) == 0] = LIGHT
    seam = (np.minimum(frac, 1 - frac) < 0.035 / max(rr.mean(), 0.3)) & inside
    rgb[seam] = DARK
    # a faint shade toward the bottom-left edge, like curved paper
    shade = np.clip((dx * -0.4 + dy * 0.6), 0, 1)[..., None] * 0.10
    rgb = rgb * (1 - shade)
    # paper grain
    rng = np.random.default_rng(seed)
    rgb += rng.normal(0, 2.2, rgb.shape)
    a = inside.astype(float)
    im = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), a * 255]).astype(np.uint8), 'RGBA')
    d = ImageDraw.Draw(im)
    # nozzle (appendix) at the bottom
    ny = cy + r
    d.polygon([(cx - r * 0.07, ny - r * 0.03), (cx + r * 0.07, ny - r * 0.03), (cx + r * 0.045, ny + r * 0.09), (cx - r * 0.045, ny + r * 0.09)], fill=MID + (255,))
    lw = max(1, int(diameter * ss / 260))
    if rig == 'ring':
        ry = ny + rig_h * ss * 0.55
        rw = r * 0.22
        for k in range(-3, 4):
            ang = k * 0.2
            sx, sy = cx + math.sin(ang) * r * 0.95, cy + math.cos(ang) * r * 0.95
            d.line([(sx, sy), (cx + k * rw / 3.5, ry)], fill=INK + (255,), width=lw)
        d.ellipse([cx - rw, ry - rw * 0.22, cx + rw, ry + rw * 0.22], outline=INK + (255,), width=lw * 3)
        for k in range(-3, 4):  # sandbags hanging round the ring
            bx = cx + k * rw / 3.2; by = ry + rw * 0.25
            d.line([(bx, ry), (bx, by)], fill=INK + (255,), width=lw)
            d.ellipse([bx - rw * 0.11, by, bx + rw * 0.11, by + rw * 0.34], fill=INK + (255,))
        d.line([(cx, ry), (cx, ry + rig_h * ss * 0.38)], fill=INK + (255,), width=lw)  # the release line
        d.ellipse([cx - rw * 0.16, ry + rig_h * ss * 0.36, cx + rw * 0.16, ry + rig_h * ss * 0.45], fill=INK + (255,))
    elif rig == 'tether':
        ty = ny + rig_h * ss
        for k in range(-3, 4):
            ang = k * 0.18
            sx, sy = cx + math.sin(ang) * r * 0.96, cy + math.cos(ang) * r * 0.96
            d.line([(sx, sy), (cx, ty)], fill=INK + (255,), width=lw)
    return im.resize((W // ss, H // ss), Image.LANCZOS), (cx / ss, cy / ss)
