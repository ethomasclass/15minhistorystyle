# Puts the 3D map shots (blender/mapshots.py frames in build/maps3d/<mode>/) together into the join tests, with the haze
# passes, the dissolves and the neighbouring shots' handoff frames cut in, and the narration under them.
#   python3 tools/maps3d_cut.py 11|8|14|23|sheet [--size=960x540]
# Frames that were not rendered (motion tests render every 2nd frame) hold the previous one.
import json, math, os, subprocess, sys
import numpy as np
import cv2
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.abspath(os.path.join(HERE, '..'))
B = os.path.join(EP, 'build', 'maps3d')
TR = os.path.join(EP, 'renders', 'tests', 'transitions')
AUD = os.path.join(EP, 'public', 'audio')
os.makedirs(TR, exist_ok=True)
opts = dict((a[2:].split('=', 1) + [''])[:2] for a in sys.argv[2:] if a.startswith('--'))
W, H = (int(v) for v in opts.get('size', '960x540').split('x'))
FPS = 30
BONE = np.array([0xED, 0xE7, 0xDC], np.float32)
ORANGE = np.array([0xFF, 0x9F, 0x1C], np.float32)


def words(stem):
    return json.load(open(os.path.join(AUD, stem + '.words.json')))['words']


def wt(stem, phrase, end=False):
    ws = words(stem)
    nm = lambda w: ''.join(ch for ch in w.lower() if ch.isalnum() or ch in "'ʻ")
    p = [nm(x) for x in phrase.split()]
    for i in range(len(ws) - len(p) + 1):
        if [nm(w['w']) for w in ws[i:i + len(p)]] == p:
            return ws[i + len(p) - 1]['e'] if end else ws[i]['s']
    raise KeyError(phrase)


def ease(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def img(path):
    a = Image.open(path).convert('RGB')
    if a.size != (W, H):
        a = a.resize((W, H), Image.LANCZOS)
    return np.asarray(a).astype(np.float32)


class Frames:
    """a rendered shot: frame f (0-based), holding the last rendered frame at or before f"""

    def __init__(self, mode):
        self.dir = os.path.join(B, mode)
        self.meta = json.load(open(os.path.join(self.dir, 'shot.json')))
        self.have = sorted(int(f[:4]) for f in os.listdir(self.dir) if f.endswith('.png') and f[:4].isdigit())
        self.n, self.t0 = self.meta['n'], self.meta['t0']
        self._c = {}

    def at(self, f):
        f = max(0, min(self.n - 1, f))
        k = max([h for h in self.have if h <= f] or [self.have[0]])
        if k not in self._c:
            self._c = {k: img(os.path.join(self.dir, f'{k:04d}.png'))}
        return self._c[k]

    def t(self, t):
        return self.at(int(round((t - self.t0) * FPS)))


# ---- the haze: soft bone cloud that thickens patchily and thins the same way, drifting outward as the camera moves
_rng = np.random.default_rng(7)
_oct = [cv2.resize(_rng.random((n_, int(n_ * 16 / 9) + 1)).astype(np.float32), (W * 2, H * 2), interpolation=cv2.INTER_CUBIC)
        for n_ in (3, 6, 12, 24)]


def cloud(t, zoom=0.35):
    z = math.exp(zoom * t)
    acc = np.zeros((H, W), np.float32)
    for k, o in enumerate(_oct):
        zz = z * (1 + 0.15 * k)
        M = np.float32([[1 / zz, 0, W * (1 - 1 / zz) + 0.37 * k * W * 0.1], [0, 1 / zz, H * (1 - 1 / zz)]])
        acc += cv2.warpAffine(o, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT) * (0.5 ** k)
    acc /= sum(0.5 ** k for k in range(len(_oct)))
    return (acc - acc.min()) / (acc.max() - acc.min() + 1e-6)


def haze(frame, a, t):
    if a <= 0:
        return frame
    n = cloud(t)
    v = np.clip(a * 1.6 - 0.6 + n * 0.6, 0, 1)
    al = (v * v * (3 - 2 * v))[..., None]
    col = BONE * (0.975 + 0.025 * n[..., None])
    return frame * (1 - al) + col * al


def flat(c):
    return np.broadcast_to(np.asarray(c, np.float32), (H, W, 3)).copy()


def encode(name, frames_fn, n, audio=None):
    """frames_fn(i) -> HxWx3 float; audio: (wav, start_s) laid from the clip's start"""
    out = os.path.join(TR, name)
    cmd = ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-']
    if audio:
        wav, ss = audio
        cmd += (['-ss', f'{ss:.3f}'] if ss >= 0 else []) + ['-i', wav, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '128k', '-shortest']
        if ss < 0:
            cmd += ['-af', f'adelay={int(-ss * 1000)}|{int(-ss * 1000)}']
    cmd += ['-c:v', 'libx264', '-preset', 'medium', '-crf', '24', '-pix_fmt', 'yuv420p', out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(n):
        p.stdin.write(np.clip(frames_fn(i), 0, 255).astype(np.uint8).tobytes())
    p.stdin.close()
    p.wait()
    print(out, n, 'frames', f'{os.path.getsize(out) / 1e6:.1f} MB')
    return out


class Video:
    def __init__(self, path):
        self.path = path
        self.cache = {}

    def frames(self, t0, t1):
        d = os.path.join(B, 'vid_' + os.path.basename(self.path).split('.')[0] + f'_{t0:.2f}')
        if not os.path.isdir(d):
            os.makedirs(d)
            subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t0:.3f}', '-i', self.path, '-t', f'{t1 - t0:.3f}', '-vf', f'scale={W}:{H}',
                            '-r', str(FPS), os.path.join(d, '%04d.png')], check=True)
        return [img(os.path.join(d, f)) for f in sorted(os.listdir(d))]


# ================================================================ the joins
def join11():
    """the ch 5 card's last seconds, the dive, the harbor H1 still (with a slow push) after a short dissolve"""
    head = Video(os.path.join(EP, 'build', 'vec_ch05', 'silent.mp4')).frames(15.9, 18.84)
    sh = Frames('dive')
    card = img(os.path.join(B, 'ch05_last.png'))
    h1 = Image.open(os.path.join(B, 'harbor_h1', 'harbor_wide.png')).convert('RGB')
    nh, nd, nt = len(head), sh.n, int(1.6 * FPS)
    XF = 12                                                   # dive -> H1 dissolve (frames)

    def h1_at(k):
        z = 1 + 0.012 * k / nt
        w_, h_ = h1.size
        cw, ch = w_ / z, h_ / z
        return np.asarray(h1.crop(((w_ - cw) / 2, (h_ - ch) / 2, (w_ + cw) / 2, (h_ + ch) / 2)).resize((W, H), Image.LANCZOS)).astype(np.float32)

    def fr(i):
        if i < nh:
            return head[i]
        j = i - nh
        if j < nd:
            f = sh.at(j)
            if j < 9:                                         # off the card frame itself
                u = ease(j / 9)
                f = card * (1 - u) + f * u
            if j >= nd - XF:
                u = ease((j - (nd - XF)) / XF)
                f = f * (1 - u) + h1_at(0) * u
            return f
        return h1_at(j - nd)
    n = nh + nd + nt
    # ch 5's words end before the card head; ch 6 starts as the dive lands in the harbor
    t6 = (nh + nd - XF) / FPS - 0.3
    return encode('11_dive.mp4', fr, n, audio=(os.path.join(AUD, 'ch06_the_heist.wav'), -t6))


def join8():
    pa, oa = Frames('pacific'), Frames('oahu8')
    ST = 'ch04_the_pitch_meeting'
    T_SAT = wt(ST, 'sat one of')
    h8 = img(os.path.join(B, 'h8_crop.png'))
    HEAD = 0.5
    t_start, t_end = pa.t0 - HEAD, oa.t0 + (oa.n - 1) / FPS
    SW = T_SAT + 0.35                                         # behind the thickest haze, the Pacific gives way to Oʻahu
    n = int(round((t_end - t_start) * FPS))

    def fr(i):
        t = t_start + i / FPS
        if t < pa.t0:
            return h8
        f = pa.t(t) if t < SW else oa.t(t)
        a = ease((t - (T_SAT - 0.4)) / 0.65) if t < SW else 1 - ease((t - (SW + 0.1)) / 0.55)
        return haze(f, a, t - (T_SAT - 0.4))
    return encode('08_pacific.mp4', fr, n, audio=(os.path.join(AUD, ST + '.wav'), t_start))


def join14():
    sh = Frames('pearl')
    HEAD, TAIL = 0.5, 0.4
    n = int(round((HEAD + sh.n / FPS + TAIL) * FPS))
    nh = int(HEAD * FPS)

    def fr(i):
        if i < nh:
            return flat(BONE)
        j = i - nh
        if j >= sh.n:
            return flat(ORANGE)
        a = 1 - ease((j / FPS - 0.15) / 1.25)
        return haze(sh.at(j), a, j / FPS + 1.0)
    return encode('14_pearl_pin.mp4', fr, n, audio=(os.path.join(AUD, 'ch06_the_heist.wav'), sh.t0 - HEAD))


def join23():
    sh = Frames('quiet')
    start = img(os.path.join(TR, '23_pearl_start.png'))
    HEAD = 0.5
    nh = int(HEAD * FPS)
    n = nh + sh.n
    return encode('23_pearl_quiet.mp4', lambda i: start if i < nh else sh.at(i - nh), n,
                  audio=(os.path.join(AUD, 'ch09_back_to_the_question.wav'), sh.t0 - HEAD))


def sheet():
    """key frames of all four shots, labelled"""
    from PIL import ImageDraw, ImageFont
    rows = []
    picks = [('11', '11_dive.mp4', [0.2, 3.3, 3.9, 4.6, 5.3, 6.4, 7.6, 8.6]),
             ('8', '08_pacific.mp4', [0.2, 0.9, 1.6, 2.4, 3.3, 4.0, 5.2, 7.5]),
             ('14', '14_pearl_pin.mp4', [0.3, 1.0, 1.8, 2.6, 3.2, 4.4, 5.8, 6.5]),
             ('23', '23_pearl_quiet.mp4', [0.2, 2.5, 4.5, 6.0, 7.5, 8.6, 11.0, 16.0])]
    tw, th = 480, 270
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 18)
    except OSError:
        font = ImageFont.load_default()
    for tag, mp4, ts in picks:
        p = os.path.join(TR, mp4)
        if not os.path.exists(p):
            continue
        row = Image.new('RGB', (tw * len(ts), th), (20, 20, 20))
        for k, t in enumerate(ts):
            tmp = os.path.join(B, 'sheet_tmp.png')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', p, '-frames:v', '1', '-vf', f'scale={tw}:{th}', tmp])
            if os.path.exists(tmp):
                im = Image.open(tmp).convert('RGB')
                d = ImageDraw.Draw(im)
                d.rectangle([0, 0, 120, 24], fill=(0, 0, 0))
                d.text((6, 3), f'{tag}  {t:.1f}s', fill=(240, 240, 240), font=font)
                row.paste(im, (k * tw, 0))
                os.remove(tmp)
        rows.append(row)
    sh = Image.new('RGB', (max(r.width for r in rows), sum(r.height + 6 for r in rows)), (10, 10, 10))
    y = 0
    for r in rows:
        sh.paste(r, (0, y))
        y += r.height + 6
    out = os.path.join(TR, 'maps3d_sheet.jpg')
    sh.save(out, quality=86)
    print(out)


if __name__ == '__main__':
    {'11': join11, '8': join8, '14': join14, '23': join23, 'sheet': sheet}[sys.argv[1]]()
