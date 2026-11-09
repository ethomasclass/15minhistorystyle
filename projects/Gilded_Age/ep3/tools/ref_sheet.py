"""Contact sheet per reference folder: python3 tools/ref_sheet.py [scene ...] -> research/ref_sheets/<scene>.jpg"""
import os, sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(HERE, '..', 'public', 'img', 'ref'); OUT = os.path.join(HERE, '..', 'research', 'ref_sheets')
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 16)
scenes = sys.argv[1:] or sorted(os.listdir(R))
for sc in scenes:
    files = sorted(f for f in os.listdir(os.path.join(R, sc)) if f.endswith('.jpg'))
    if not files: continue
    cw, ch, cols = 600, 440, 3
    rows = (len(files) + cols - 1) // cols
    s = Image.new('RGB', (cols * (cw + 20) + 20, rows * (ch + 50) + 60), (13, 12, 9)); d = ImageDraw.Draw(s)
    d.text((20, 18), f'EPISODE 3 REFERENCES · {sc}', fill=(244, 239, 230), font=font)
    for i, f in enumerate(files):
        im = Image.open(os.path.join(R, sc, f)).convert('RGB'); im.thumbnail((cw, ch))
        x, y = 20 + (i % cols) * (cw + 20), 60 + (i // cols) * (ch + 50)
        s.paste(im, (x, y)); d.text((x, y + im.height + 6), f[:62], fill=(255, 159, 28), font=font)
    os.makedirs(OUT, exist_ok=True); s.save(os.path.join(OUT, sc + '.jpg'), quality=85); print('sheet', sc, len(files))
