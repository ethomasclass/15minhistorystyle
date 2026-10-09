# Look book: 20 evenly spaced frames from a finished video in a 5x4 sheet, for the style repo's techniques/lookbook/.
#   python3 lookbook.py <video.mp4> <out.jpg> "<Title>"     (needs Pillow, and ffmpeg on PATH or imageio-ffmpeg)
import re, shutil, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
src, out, title = sys.argv[1], sys.argv[2], sys.argv[3]
FF = shutil.which('ffmpeg')
if not FF:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()
m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", subprocess.run([FF, '-i', src], capture_output=True, text=True).stderr)
dur = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
N=20; cols=5; tw,th=384,216
sheet=Image.new('RGB',(cols*tw, (N//cols)*th+40),(13,12,9))
d=ImageDraw.Draw(sheet)
d.text((10,10), f"{title}  ({int(dur//60)}:{int(dur%60):02d})  frames every {dur/(N+1):.0f}s", fill=(244,239,230))
for i in range(N):
    t=dur*(i+1)/(N+1)
    p=subprocess.run([FF,'-v','error','-ss',f'{t:.2f}','-i',src,'-frames:v','1','-vf',f'scale={tw}:{th}','-f','image2pipe','-vcodec','png','-'],capture_output=True)
    import io
    im=Image.open(io.BytesIO(p.stdout)).convert('RGB')
    x,y=(i%cols)*tw,(i//cols)*th+40
    sheet.paste(im,(x,y))
    d.text((x+6,y+th-16), f"{int(t//60)}:{int(t%60):02d}", fill=(47,224,196))
sheet.save(out, quality=88)
print(out, dur)
