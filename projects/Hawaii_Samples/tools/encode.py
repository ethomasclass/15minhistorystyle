# python3 tools/encode.py build/<name> out.mp4
# Frames -> MP4 with a light finish (moving film grain, a soft vignette) and a sound track mixed from events.json.
# Sounds are looked up in this project's sfx/ (CC0, see sfx/LICENSES_excerpt.txt) and then the channel's sfx/.
# Mix: effects are summed at their cue volumes, a bed (if any) fades in and out, then the whole is normalised to
# about -16 LUFS (no voice yet; the channel masters at -14 with the narration on top).
import json, os, subprocess, sys
import numpy as np
from PIL import Image
from scipy.io import wavfile
from scipy.signal import resample_poly

d, out = sys.argv[1], sys.argv[2]
HERE = os.path.dirname(os.path.abspath(__file__))
SFX = [os.path.join(HERE, '..', 'sfx'), os.path.join(HERE, '..', '..', '..', 'sfx')]
FPS, SR = 30, 44100
ev = json.load(open(os.path.join(d, 'events.json')))
n = int(ev['dur'] * SR)
mix = np.zeros((n, 2), np.float32)
cache = {}


def load(name):
    if name in cache:
        return cache[name]
    for base in SFX:
        p = os.path.join(base, name + '.wav')
        if os.path.exists(p):
            sr, a = wavfile.read(p)
            a = a.astype(np.float32) / (32768 if a.dtype == np.int16 else (2 ** 31 if a.dtype == np.int32 else 1))
            if a.ndim == 1:
                a = np.stack([a, a], 1)
            if sr != SR:
                a = resample_poly(a, SR, sr, axis=0).astype(np.float32)
            cache[name] = a[:, :2]
            return cache[name]
    raise FileNotFoundError(name)


def put(a, t, vol, fade_out=None):
    i = int(max(0, t) * SR)
    a = a[:max(0, n - i)] * vol
    if fade_out:
        m = len(a); f = int(fade_out * SR)
        if f and m > f:
            a = a.copy(); a[-f:] *= np.linspace(1, 0, f)[:, None]
    mix[i:i + len(a)] += a


if ev.get('bed'):
    name, vol = ev['bed']
    b = load(name)
    while len(b) < n:
        b = np.concatenate([b, b])
    b = b[:n] * np.clip(np.minimum(np.arange(n) / (SR * 1.2), (n - np.arange(n)) / (SR * 1.5)), 0, 1)[:, None]
    mix += b * vol
for s in ev['sounds']:
    name, t, vol = s[:3]
    put(load(name), t, vol, s[3] if len(s) > 3 else None)
mix *= np.clip((n - np.arange(n)) / (SR * 0.6), 0, 1)[:, None]
rms = np.sqrt(np.mean(mix ** 2) + 1e-12)
mix *= min(10 ** (-19 / 20) / rms, 0.95 / (np.abs(mix).max() + 1e-9))
wavfile.write(os.path.join(d, 'audio.wav'), SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16))

# ---- picture finish
frames = sorted(f for f in os.listdir(os.path.join(d, 'f')) if f.endswith('.png'))
w, h = Image.open(os.path.join(d, 'f', frames[0])).size
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
r = np.hypot((xx - w / 2) / (w / 2), (yy - h / 2) / (h / 2))
VIG = (1 - 0.22 * np.clip((r - 0.55) / 0.75, 0, 1) ** 1.6)[..., None]
G = float(ev.get('grain', 0.6))
rng = np.random.default_rng(3)
ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{w}x{h}', '-r', str(FPS), '-i', '-',
                       '-i', os.path.join(d, 'audio.wav'), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
                       '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
small = None
for k, f in enumerate(frames):
    im = np.asarray(Image.open(os.path.join(d, 'f', f)).convert('RGB'), np.float32) / 255
    if k % 2 == 0:            # grain changes on twos, like film at 12 drawings a second would read
        g = rng.standard_normal((h // 2, w // 2)).astype(np.float32)
        small = np.asarray(Image.fromarray(((g * 0.25 + 0.5).clip(0, 1) * 255).astype(np.uint8)).resize((w, h), Image.BILINEAR), np.float32) / 255 - 0.5
    lum = im.mean(-1, keepdims=True)
    im = im * VIG + small[..., None] * 0.06 * G * (0.4 + 0.6 * (1 - np.abs(lum - 0.5) * 2))
    ff.stdin.write((np.clip(im, 0, 1) * 255 + 0.5).astype(np.uint8).tobytes())
ff.stdin.close(); ff.wait()
print('ok', out, len(frames), 'frames')
