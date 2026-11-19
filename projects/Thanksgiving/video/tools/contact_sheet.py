"""Sheets from tools/contact.mjs frames:  python3 tools/contact_sheet.py <dir> Ch01 [everySeconds=4]  -> <dir>/Ch01_1.jpg ... (5 x 6, 384 px)"""
import glob, sys
from PIL import Image, ImageDraw
d, cid = sys.argv[1], sys.argv[2]
every = float(sys.argv[3]) if len(sys.argv) > 3 else 4
files = sorted(glob.glob(f"{d}/{cid}/*.jpeg"))
cols, rows, w, h = 5, 6, 384, 216
for p in range(0, len(files), cols * rows):
    part = files[p:p + cols * rows]
    sheet = Image.new("RGB", (cols * w, ((len(part) + cols - 1) // cols) * h), "black")
    dr = ImageDraw.Draw(sheet)
    for i, f in enumerate(part):
        x, y = (i % cols) * w, (i // cols) * h
        sheet.paste(Image.open(f).convert("RGB").resize((w, h)), (x, y))
        dr.text((x + 5, y + 3), f"{(p + i) * every:.0f}s", fill="yellow")
    o = f"{d}/{cid}_{p // (cols * rows) + 1}.jpg"
    sheet.save(o, quality=82)
    print(o)
