"""Contact sheet per archival-image topic: python3 tools/sheet.py [topic ...] -> research/sheets/<topic>.jpg
(Ep 5 copy of ep4/tools/sheet.py; labels show file name and pixel size, files under 1000 px are marked SMALL)"""
import os, sys
from PIL import Image, ImageDraw, ImageFont
Image.MAX_IMAGE_PIXELS = None
HERE = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(HERE, '..', 'public', 'img'); OUT = os.path.join(HERE, '..', 'research', 'sheets')
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 15)
topics = sys.argv[1:] or sorted(d for d in os.listdir(R) if os.path.isdir(os.path.join(R, d)))
for t in topics:
    files = sorted(f for f in os.listdir(os.path.join(R, t)) if f.endswith('.jpg'))
    if not files: continue
    cw, ch, cols = 600, 440, 3
    rows = (len(files) + cols - 1) // cols
    s = Image.new('RGB', (cols * (cw + 20) + 20, rows * (ch + 70) + 60), (13, 12, 9)); d = ImageDraw.Draw(s)
    d.text((20, 18), f'EPISODE 5 ARCHIVAL IMAGES · {t} · {len(files)}', fill=(244, 239, 230), font=font)
    for i, f in enumerate(files):
        im = Image.open(os.path.join(R, t, f)); w, h = im.size
        im = im.convert('RGB'); im.thumbnail((cw, ch))
        x, y = 20 + (i % cols) * (cw + 20), 60 + (i // cols) * (ch + 70)
        s.paste(im, (x, y))
        d.text((x, y + im.height + 6), f[:64], fill=(255, 159, 28), font=font)
        d.text((x, y + im.height + 26), f'{w}x{h}' + ('  SMALL' if max(w, h) < 1000 else ''), fill=(200, 200, 200), font=font)
    os.makedirs(OUT, exist_ok=True); s.save(os.path.join(OUT, t + '.jpg'), quality=82); print('sheet', t, len(files))
