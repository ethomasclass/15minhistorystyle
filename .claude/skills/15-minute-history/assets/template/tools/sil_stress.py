"""Stress-test a silhouette scene's parallax planes before building on them (The Balloon War v2, Nov 2026).

  python3 tools/sil_stress.py BW04_bly_road BW13_presses ...      -> out/stress/<name>.jpg, one sheet per scene
  python3 tools/sil_stress.py --shifts=12,24,36 --y NAME           (--y shifts vertically too)

SilScene only moves the planes a little, so a torn object, a ghost outline or a hole can hide in a still and show only when the
camera moves. This exaggerates the move: each plane is shifted by `s` px per step of depth (the nearest plane most, the back plate
not at all), for s = 12, 24 and 36 px both ways, and the six results are laid out on one sheet (top row to the left, bottom row
to the right). Look at every tile: an object split across two planes comes apart, a rim or drop shadow left on a farther plane
shows as a dark outline beside its shape, an extension too short shows a hole. Fix the recipe in tools/sil_regions.py and run
it again; ship a scene only when all six tiles are clean.
"""
import os
import sys

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, '..', 'public', 'img', 'layers', 'sil')
OUT = os.path.join(HERE, '..', 'out', 'stress')
TW, TH = 1376, 768


def tile(name, s, vertical):
    d = os.path.join(BASE, name)
    files = sorted(f for f in os.listdir(d) if f[0] == 'L' and f[1].isdigit())
    k = len(files)
    c = Image.open(os.path.join(d, files[-1])).convert('RGBA').resize((TW, TH))
    for i in range(k - 2, -1, -1):
        layer = Image.open(os.path.join(d, files[i])).convert('RGBA').resize((TW, TH))
        dx = (k - 1 - i) * s
        t = Image.new('RGBA', (TW, TH), (0, 0, 0, 0))
        t.paste(layer, (dx, dx // 2 if vertical else 0))
        c.alpha_composite(t)
    ImageDraw.Draw(c).text((10, 8), f'{name}  shift {s:+d} px per plane', fill=(255, 80, 80, 255))
    return c.convert('RGB')


def main():
    names = [a for a in sys.argv[1:] if not a.startswith('--')]
    opts = dict((a[2:].split('=', 1) + [''])[:2] for a in sys.argv[1:] if a.startswith('--'))
    if not names:
        sys.exit(__doc__)
    shifts = [int(x) for x in (opts.get('shifts') or '12,24,36').split(',')]
    os.makedirs(OUT, exist_ok=True)
    for n in names:
        row = [-s for s in reversed(shifts)] + shifts
        tiles = [tile(n, s, 'y' in opts) for s in row]
        cols = len(shifts)
        sheet = Image.new('RGB', (TW * cols, TH * 2))
        for j, t in enumerate(tiles):
            sheet.paste(t, ((j % cols) * TW, (j // cols) * TH))
        p = os.path.join(OUT, f'{n}.jpg')
        sheet.save(p, quality=85)
        print(p)


if __name__ == '__main__':
    main()
