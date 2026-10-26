"""Check a rendered short's cover: save frame 0 full size, and lay out the frames YouTube is likely to grab.

  python3 cover_frames.py review/shorts/My_Short.mp4 out/cover      [extra seconds ...]

Writes <outdir>/cover_frame0.jpg (the frame to pick in the YouTube app) and <outdir>/cover_sheet.jpg: frame 0 and
the 25%, 50% and 75% points (plus any extra seconds), at 9:16, labelled. YouTube doesn't document which frame it
uses for a Short's cover, so every one of these should read as a thumbnail: the headline, a real picture (a face
if possible), nothing half-drawn, not the outro.
"""
import os, re, subprocess, sys
import imageio_ffmpeg
from PIL import Image, ImageDraw

src, out, extra = sys.argv[1], sys.argv[2], [float(s) for s in sys.argv[3:]]
FF = imageio_ffmpeg.get_ffmpeg_exe()
os.makedirs(out, exist_ok=True)
info = subprocess.run([FF, "-i", src], capture_output=True, text=True).stderr
h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", info).groups()
dur = int(h) * 3600 + int(m) * 60 + float(s)
subprocess.run([FF, "-v", "error", "-y", "-i", src, "-frames:v", "1", os.path.join(out, "cover_frame0.jpg")], check=True)
points = [("0:00 (frame 0)", 0.0), ("25%", dur * 0.25), ("50%", dur * 0.5), ("75%", dur * 0.75)] + [(f"{t:.1f}s", t) for t in extra if t < dur - 0.05]
skipped = [t for t in extra if t >= dur - 0.05]
w, hh = 300, 533
sheet = Image.new("RGB", (w * len(points), hh + 22), "white")
d = ImageDraw.Draw(sheet)
for i, (label, t) in enumerate(points):
    f = os.path.join(out, f"_cover_{i}.jpg")
    subprocess.run([FF, "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", src, "-frames:v", "1", "-vf", f"scale={w}:{hh}", f], check=True)
    sheet.paste(Image.open(f), (i * w, 22))
    d.text((i * w + 6, 5), f"{label} = {t:.1f}s", fill="black")
    os.remove(f)
sheet.save(os.path.join(out, "cover_sheet.jpg"), quality=88)
if skipped:
    print("skipped (past the end):", ", ".join(f"{t:.1f}s" for t in skipped))
print(f"{dur:.1f}s long; wrote {out}/cover_frame0.jpg and {out}/cover_sheet.jpg")
