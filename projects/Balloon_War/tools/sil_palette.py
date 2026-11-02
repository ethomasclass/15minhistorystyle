"""Palette lock for silhouette paintings: map any painting onto the Balloon War silhouette palette.

  python3 tools/sil_palette.py in.jpg out.jpg [--accent=keep|none] [--quiet]

Gemini drifts (one scene comes back peach, the next purple). This forces every scene onto the same colours:
  1. a gradient map: each pixel's brightness picks a colour on the PALETTE ramp (warm ink black -> deep teal-slate
     haze -> pale sage -> cream glow), so foreground silhouettes, distance layers and sky always use the same tones;
  2. one accent: pixels that are strongly saturated and warm (the light named in the prompt) are re-coloured CORAL,
     their brightness kept (a bright core goes toward cream, like a glow). --accent=none drops the accent;
  3. --quiet uses the flatter, lighter QUIET ramp (fog, no glow) for the heavy chapter.
Run it after generation and before tools/sil_layers.py, so every depth plane is already in palette.
"""
import sys
import numpy as np
from PIL import Image

def hexrgb(h):
    h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], float)

# brightness stop -> colour (channel desk ink, teal-slate distance, cream light)
PALETTE = [(0.00, '#0d0c09'), (0.10, '#111b1b'), (0.26, '#1c3332'), (0.44, '#335652'),
           (0.62, '#5f857f'), (0.80, '#a3bab2'), (0.93, '#dfe0d6'), (1.00, '#F4EFE6')]
QUIET = [(0.00, '#141615'), (0.20, '#2a3432'), (0.45, '#55625f'), (0.70, '#8f9a95'),
         (0.88, '#c3c8c2'), (1.00, '#e6e4dc')]
CORAL, CREAM = hexrgb('#FF6F61'), hexrgb('#F4EFE6')

def ramp(L, stops):
    xs = np.array([s for s, _ in stops]); cs = np.stack([hexrgb(c) for _, c in stops])
    return np.stack([np.interp(L, xs, cs[:, k]) for k in range(3)], -1)

def lock(im, lo=None, hi=None, accent=True, quiet=False):
    """im: float RGB 0..1 (H, W, 3). lo/hi: the brightness range to stretch (pass the full painting's, when locking its
    layers one by one, so every plane uses the same mapping). Returns uint8 RGB."""
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    L = 0.2126 * r + 0.7152 * g + 0.0722 * b
    if lo is None:
        lo, hi = np.percentile(L, 1), np.percentile(L, 99.5)
    Ln = np.clip((L - lo) / max(hi - lo, 1e-3), 0, 1)
    out = ramp(Ln, QUIET if quiet else PALETTE)
    if accent and not quiet:
        mx, mn = im.max(-1), im.min(-1)
        sat = (mx - mn) / np.maximum(mx, 1e-3)
        hue = np.zeros_like(mx)
        d = np.maximum(mx - mn, 1e-6)
        rr = mx == r; gg = (mx == g) & ~rr
        hue[rr] = ((g - b)[rr] / d[rr]) % 6
        hue[gg] = (b - r)[gg] / d[gg] + 2
        hue = hue * 60
        warm = (hue < 55) | (hue > 330)
        w = np.clip((sat - 0.45) / 0.3, 0, 1) * np.clip((mx - 0.35) / 0.3, 0, 1) * warm
        glow = (np.clip((Ln - 0.9) / 0.1, 0, 1) * 0.7)[..., None]
        acc = CORAL * (0.55 + 0.45 * np.clip(Ln, 0, 1))[..., None] * (1 - glow) + CREAM * glow
        out = out * (1 - w[..., None]) + acc * w[..., None]
    return np.clip(out, 0, 255).astype(np.uint8)


def brightness_range(im):
    L = 0.2126 * im[..., 0] + 0.7152 * im[..., 1] + 0.0722 * im[..., 2]
    return np.percentile(L, 1), np.percentile(L, 99.5)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    opts = [a for a in sys.argv[1:] if a.startswith('--')]
    src, dst = args
    im = np.asarray(Image.open(src).convert('RGB')).astype(float) / 255
    out = lock(im, accent='--accent=none' not in opts, quiet='--quiet' in opts)
    Image.fromarray(out).save(dst, quality=92)


if __name__ == '__main__':
    main()
