"""Age an image so it reads as a printed, handled 19th-century plate: halftone dots, slight colour misregistration,
paper fibre, foxing, stains, a fold crease and worn edges. Everything is procedural and seeded, so a re-run gives the
same result. Used on AI lithograph plates (and optionally archival scans) before they go into a scene.

  python3 tools/weather.py <in> <out> [--preset light|medium|heavy] [--seed N] [--no-halftone] [--no-crease]

Output is 1920 wide (height keeps the aspect). Presets set every strength at once; individual flags override.
"""
import argparse
import numpy as np
from PIL import Image, ImageFilter

PRESETS = {
    #           halftone  dot   misreg  fibre  foxing  stain  crease  edge   fade
    'light':  dict(ht=0.18, cell=5, mis=1, fib=0.05, fox=12, stain=0.06, crease=0.0, edge=0.12, fade=0.06),
    'medium': dict(ht=0.30, cell=6, mis=2, fib=0.08, fox=30, stain=0.12, crease=0.5, edge=0.22, fade=0.12),
    'heavy':  dict(ht=0.45, cell=7, mis=3, fib=0.12, fox=70, stain=0.20, crease=1.0, edge=0.35, fade=0.20),
}


def noise(h, w, scale, rng):
    """Smooth value noise in 0..1 at roughly `scale` px features."""
    sh, sw = max(2, h // scale + 2), max(2, w // scale + 2)
    small = Image.fromarray((rng.random((sh, sw)) * 255).astype(np.uint8))
    return np.asarray(small.resize((w, h), Image.BICUBIC), dtype=np.float32) / 255.0


def fbm(h, w, rng, scales=(400, 160, 60, 20)):
    out = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for s in scales:
        out += noise(h, w, s, rng) * amp
        tot += amp
        amp *= 0.55
    return out / tot


def halftone(rgb, cell, strength):
    """CMY-style dot screens at three angles, blended over the image by `strength`."""
    h, w, _ = rgb.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    out = np.ones_like(rgb)
    for c, ang in zip(range(3), (15, 75, 45)):
        a = np.deg2rad(ang)
        u = (xx * np.cos(a) + yy * np.sin(a)) / cell
        v = (-xx * np.sin(a) + yy * np.cos(a)) / cell
        du, dv = u - np.round(u), v - np.round(v)
        dist = np.sqrt(du * du + dv * dv)            # 0 at dot centre .. ~0.7 at cell corner
        ink = 1.0 - rgb[..., c]                      # how much of this ink the pixel needs
        radius = np.sqrt(np.clip(ink, 0, 1)) * 0.62  # dot area ~ ink
        out[..., c] = np.where(dist < radius, 0.0, 1.0)
    # soften the dots slightly so they don't alias at 1080p
    soft = np.asarray(Image.fromarray((out * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)),
                      np.float32) / 255.0
    return rgb * (1 - strength) + soft * strength


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('dst')
    ap.add_argument('--preset', default='medium', choices=PRESETS)
    ap.add_argument('--seed', type=int, default=1)
    ap.add_argument('--no-halftone', action='store_true')
    ap.add_argument('--no-crease', action='store_true')
    a = ap.parse_args()
    p = dict(PRESETS[a.preset])
    if a.no_halftone:
        p['ht'] = 0.0
    if a.no_crease:
        p['crease'] = 0.0
    rng = np.random.default_rng(a.seed)

    im = Image.open(a.src).convert('RGB')
    W = 1920
    im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
    rgb = np.asarray(im, np.float32) / 255.0
    h, w, _ = rgb.shape

    # 1. fade: lift the blacks, pull saturation down a touch, warm the whites toward old paper
    paper = np.array([0.93, 0.89, 0.80], np.float32)
    grey = rgb.mean(axis=2, keepdims=True)
    rgb = rgb * (1 - p['fade']) + grey * p['fade'] * 0.5 + paper * p['fade'] * 0.5
    rgb = rgb * (0.94 + 0.06 * paper)

    # 2. misregistration: nudge the red and blue plates a pixel or two
    m = p['mis']
    if m:
        rgb[..., 0] = np.roll(rgb[..., 0], (m, -m), axis=(0, 1))
        rgb[..., 2] = np.roll(rgb[..., 2], (-m // 2 or -1, m), axis=(0, 1))

    # 3. halftone screen
    if p['ht'] > 0:
        rgb = halftone(rgb, p['cell'], p['ht'])

    # 4. paper fibre: fine anisotropic noise, multiplied in
    fib = noise(h, w, 3, rng) * 0.6 + noise(h, w, 9, rng) * 0.4
    streak = np.asarray(Image.fromarray((fib * 255).astype(np.uint8)).resize((w // 6, h), Image.BILINEAR)
                        .resize((w, h), Image.BILINEAR), np.float32) / 255.0
    rgb *= (1 - p['fib']) + p['fib'] * (0.5 * fib + 0.5 * streak)[..., None] * 2 - p['fib'] * 0.5

    # 5. stains: big soft blotches, tea-coloured
    st = np.clip((fbm(h, w, rng) - 0.55) * 3.0, 0, 1)[..., None]
    tea = np.array([0.80, 0.66, 0.45], np.float32)
    rgb = rgb * (1 - p['stain'] * st) + rgb * tea * p['stain'] * st

    # 6. foxing: small brown spots with soft halos
    fox = np.zeros((h, w), np.float32)
    for _ in range(p['fox']):
        cx, cy = rng.integers(0, w), rng.integers(0, h)
        r = rng.uniform(1.5, 9) * (3 if rng.random() < 0.1 else 1)
        y0, y1 = max(0, int(cy - 3 * r)), min(h, int(cy + 3 * r))
        x0, x1 = max(0, int(cx - 3 * r)), min(w, int(cx + 3 * r))
        yy, xx = np.mgrid[y0:y1, x0:x1]
        d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
        fox[y0:y1, x0:x1] = np.maximum(fox[y0:y1, x0:x1], np.clip(1 - d, 0, 1) ** 1.5 * rng.uniform(0.3, 0.8))
    brown = np.array([0.62, 0.42, 0.25], np.float32)
    rgb = rgb * (1 - fox[..., None]) + rgb * brown * fox[..., None]

    # 7. crease: one fold, a light ridge beside a soft shadow, with broken fibres along it
    if p['crease'] > 0:
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        x0 = w * rng.uniform(0.3, 0.7)
        slope = rng.uniform(-0.08, 0.08)
        d = xx - (x0 + slope * (yy - h / 2))
        wobble = (noise(h, w, 40, rng) - 0.5) * 6
        d = d + wobble
        ridge = np.exp(-((d - 1.5) / 1.6) ** 2) * 0.22 - np.exp(-((d + 2.5) / 3.5) ** 2) * 0.28
        crack = (noise(h, w, 2, rng) > 0.7) * np.exp(-(d / 1.2) ** 2) * 0.35
        rgb = rgb + (ridge * p['crease'])[..., None] + (crack * p['crease'])[..., None] * (paper - rgb)

    # 8. worn edges: darker, rougher toward the border
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    edge = np.minimum.reduce([xx, w - 1 - xx, yy, h - 1 - yy]) / (0.12 * min(h, w))
    edge = np.clip(edge + (noise(h, w, 160, rng) - 0.5) * 0.35 + (noise(h, w, 6, rng) - 0.5) * 0.08, 0, 1)
    rgb *= (1 - p['edge'] * (1 - edge) ** 2)[..., None]

    Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8)).save(a.dst, quality=92)
    print(a.dst)


if __name__ == '__main__':
    main()
