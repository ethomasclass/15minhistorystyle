# python3 tools/anim_encode.py build/anim out.mp4
# Applies the paper and print pass to every frame (static maps, made once, so the paper holds still while the picture
# moves), builds the sound track from the channel's sfx, and encodes with ffmpeg.
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.io import wavfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from press import noise
from facet import GRAIN, W, H

d, out = sys.argv[1], sys.argv[2]
HERE = os.path.dirname(os.path.abspath(__file__))
SFX = os.path.join(HERE, '..', '..', '..', 'sfx')
FPS = 30

# ---- paper maps
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}"><defs>{GRAIN}</defs><rect width="{W}" height="{H}" fill="#fff"/>'
       f'<rect width="{W}" height="{H}" filter="url(#blotch)" style="mix-blend-mode:multiply" opacity="0.55"/>'
       f'<rect width="{W}" height="{H}" filter="url(#grain)" style="mix-blend-mode:multiply" opacity="0.22"/>'
       f'<rect width="{W}" height="{H}" fill="url(#vig)" style="mix-blend-mode:multiply"/></svg>')
open(os.path.join(d, 'paper.svg'), 'w').write(svg)
subprocess.run(['node', os.path.join(HERE, 'render.mjs'), os.path.join(d, 'paper.svg'), os.path.join(d, 'paper.png')], check=True)
MUL = np.asarray(Image.open(os.path.join(d, 'paper.png')).convert('RGB'), np.float32) / 255
seed = 5
r = np.random.default_rng(seed)
pap = np.array((233, 219, 184), np.float32) / 255
dens = (noise(H, W, 90, seed) - 0.5) * 0.07 + (noise(H, W, 9, seed + 1) - 0.5) * 0.03
MUL = MUL * (1 + dens[..., None])
fine = r.random((H, W)).astype(np.float32)
clump = noise(H, W, 3.2, seed + 2)
fib = Image.new('L', (W, H), 0)
dr = ImageDraw.Draw(fib)
for _ in range(int(W * H / 9000)):
    x, y, a, L = r.random() * W, r.random() * H, r.random() * np.pi, 6 + r.random() * 22
    dr.line([(x, y), (x + np.cos(a) * L, y + np.sin(a) * L)], fill=int(60 + r.random() * 90), width=1)
FIB = (np.asarray(fib.filter(ImageFilter.GaussianBlur(0.6)), np.float32) / 255 * 0.07 * np.where(noise(H, W, 40, seed + 3) > 0.5, 1.0, -1.0))[..., None]
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
edge = np.minimum(np.minimum(xx, W - 1 - xx), np.minimum(yy, H - 1 - yy))
WEAR = (np.clip(1 - (edge + (noise(H, W, 22, seed + 4) - 0.5) * 12) / 9, 0, 1) * 0.3)[..., None]

def press(im):
    im = im.copy()
    im[..., 0] = np.roll(im[..., 0], 1, axis=1)
    im[..., 2] = np.roll(im[..., 2], -1, axis=0)
    im = im * MUL
    lum = im.mean(-1)
    drop = (fine > 0.994 - 0.012 * (1 - lum) - 0.02 * (clump > 0.74)).astype(np.float32)[..., None] * 0.5
    im = im * (1 - drop) + pap * drop
    im = im + FIB
    im = im * (1 - WEAR) + pap * WEAR
    return (np.clip(im, 0, 1) * 255 + 0.5).astype(np.uint8)

# ---- sound
ev = json.load(open(os.path.join(d, 'events.json')))
SR = 44100
n = int(ev['dur'] * SR)
mix = np.zeros((n, 2), np.float32)
def load(name):
    sr, a = wavfile.read(os.path.join(SFX, name + '.wav'))
    a = a.astype(np.float32) / 32768
    return a if a.ndim == 2 else np.stack([a, a], 1)
def put(a, t, vol):
    i = int(t * SR)
    a = a[:max(0, n - i)]
    mix[i:i + len(a)] += a * vol
birds = load('forest_birds')[:n]
fade = np.clip(np.minimum(np.arange(len(birds)) / (SR * 1.0), (len(birds) - np.arange(len(birds))) / (SR * 1.2)), 0, 1)[:, None]
mix[:len(birds)] += birds * fade * 0.35
tick = load('tick')
for k, t in enumerate(ev['ticks']):
    put(tick, max(0, t - 0.02), 0.16 + 0.05 * ((k * 37) % 5) / 5)
creak = load('rope_creak')
for t in ev['creaks']:
    c = creak.copy(); m = len(c)
    c *= np.clip(np.minimum(np.arange(m) / (SR * 0.3), (m - np.arange(m)) / (SR * 1.0)), 0, 1)[:, None]
    put(c, t, 0.3)
morse = load('morse_code')
m = len(morse)
morse = morse * np.clip(np.minimum(np.arange(m) / (SR * 0.5), (m - np.arange(m)) / (SR * 1.0)), 0, 1)[:, None]
put(morse, 4.4, 0.1)
mix *= np.clip((n - np.arange(n)) / (SR * 0.8), 0, 1)[:, None]
wavfile.write(os.path.join(d, 'audio.wav'), SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16))

# ---- encode
frames = sorted(f for f in os.listdir(os.path.join(d, 'f')) if f.endswith('.png'))
ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                       '-i', os.path.join(d, 'audio.wav'), '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p',
                       '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
for k, f in enumerate(frames):
    im = np.asarray(Image.open(os.path.join(d, 'f', f)).convert('RGB'), np.float32) / 255
    ff.stdin.write(press(im).tobytes())
ff.stdin.close(); ff.wait()
print('ok', out, len(frames), 'frames')
