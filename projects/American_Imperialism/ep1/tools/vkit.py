# Shared pieces for the Ep 1 explainer, voice-card and evidence scenes (the vector style in the channel palette).
#   palette and desk, stage(), Words (timings from the narration), pops and eases, tablets, figures, encode_clip()
import json, math, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.abspath(os.path.join(HERE, '..'))
KIT = os.path.join(EP, '..', '..', 'Hawaii_Samples', 'tools')
sys.path.insert(0, KIT)
from kit import (Stage, Camera, clamp, back_out, ease_out, ease, step12, text, highlight, tag,   # noqa: E402,F401
                 loop_path, COMMON_DEFS, W, H, FPS)

# the brand palette (brand/palette.json): teal draws and explains, orange labels, coral is the subject, ink is type on
# colour; cream and bone for paper things; all on the warm dark desk
CREAM, BONE, BONE_D, INK = '#F4EFE6', '#EDE7DC', '#cfc6b4', '#111111'
OR, OR_D, TE, TE_D, CO, CO_D = '#FF9F1C', '#d47f0c', '#2FE0C4', '#1fae98', '#FF6F61', '#d4514a'
TAG = '#b9b1a3'
DESK_GRAD = ('<radialGradient id="desk" cx="45%" cy="40%" r="75%"><stop offset="0" stop-color="#2a2620"/>'
             '<stop offset="0.7" stop-color="#16140f"/><stop offset="1" stop-color="#0d0c09"/></radialGradient>')


def desk():
    return ('<rect width="1920" height="1080" fill="url(#desk)"/><g opacity="0.12">'
            + ''.join(f'<rect x="0" y="{y}" width="1920" height="1" fill="#fff" opacity="0.35"/>' for y in range(32, 1080, 64)) + '</g>')


def stage(name, dur, grain=0.35, bg=True):
    S = Stage(name, dur, bg='#16140f', press=False, grain=grain)
    S.dir = os.path.join(EP, 'build', name)
    os.makedirs(S.dir, exist_ok=True)
    S.defs.append(COMMON_DEFS.replace('stdDeviation="14"', 'stdDeviation="10"'))
    S.defs.append(DESK_GRAD)
    if bg:
        S.world.append(desk())
    return S


def _norm(w):
    return re.sub(r"[^a-z0-9ʻ']", '', w.lower().replace('’', "'"))


class Words:
    """word timings of one narration chapter, from t0 (s) on; times returned relative to t0"""

    def __init__(self, stem, t0=0.0):
        self.w = json.load(open(os.path.join(EP, 'public', 'audio', stem + '.words.json')))['words']
        self.t0 = t0
        self.stem = stem

    def _find(self, phrase, k=1):
        p = [_norm(x) for x in phrase.split()]
        toks = [_norm(x['w']) for x in self.w]
        n = 0
        for i in range(len(toks) - len(p) + 1):
            if self.w[i]['s'] < self.t0 - 0.05:
                continue
            if toks[i:i + len(p)] == p:
                n += 1
                if n == k:
                    return i, i + len(p) - 1
        raise KeyError(phrase)

    def at(self, phrase, k=1):
        return self.w[self._find(phrase, k)[0]]['s'] - self.t0

    def end(self, phrase, k=1):
        return self.w[self._find(phrase, k)[1]]['e'] - self.t0


def pop(t, t0, d=0.34, s=1.6):
    """a pop-on on twos (12 fps): 0 before t0, overshoots, settles at 1"""
    return back_out((step12(t) - t0) / d, s) if t >= t0 else 0.0


def pop_s(t, t0, d=0.34, s=1.6):
    """the same, smooth"""
    return back_out((t - t0) / d, s) if t >= t0 else 0.0


def ease_io(u):
    u = clamp(u)
    return 4 * u ** 3 if u < 0.5 else 1 - (-2 * u + 2) ** 3 / 2


def g(x, y, s, body, rot=0.0, op=1.0):
    if s <= 0.001 or op <= 0.001:
        return ''
    return f'<g transform="translate({x:.1f},{y:.1f}) rotate({rot:.2f}) scale({s:.4f})" opacity="{op:.3f}">{body}</g>'


def tablet(w, h, c):
    """a block with cut corners, like the logo's slabs, centred on 0,0 (half-sizes w, h)"""
    return f'M{-w + c},{-h} L{w - c},{-h} L{w},{-h + c} L{w},{h - c} L{w - c},{h} L{-w + c},{h} L{-w},{h - c} L{-w},{-h + c} z'


def slab(w, h, c):
    """the same from its top-left corner"""
    return f'M{c},0 L{w - c},0 L{w},{c} L{w},{h - c} L{w - c},{h} L{c},{h} L0,{h - c} L0,{c} z'


def shadow(w, dy):
    return f'<ellipse cx="0" cy="{dy}" rx="{w}" ry="{w * 0.16:.1f}" fill="#000" opacity="0.3" filter="url(#soft)"/>'


def figure(h, coat, skin='#e6c3a1', hair='#3a2a20', hat=None):
    """a simple flat figure, h tall, feet at y=0 (faceless, like every figure in the series)"""
    hr = h * 0.13
    o = (f'<rect x="{-h * 0.2:.1f}" y="{-h * 0.72:.1f}" width="{h * 0.4:.1f}" height="{h * 0.72:.1f}" rx="{h * 0.12:.1f}" fill="{coat}"/>'
         f'<rect x="{h * 0.02:.1f}" y="{-h * 0.72:.1f}" width="{h * 0.18:.1f}" height="{h * 0.72:.1f}" rx="{h * 0.08:.1f}" fill="#000" opacity="0.18"/>'
         f'<circle cy="{-h * 0.72 - hr * 1.15:.1f}" r="{hr:.1f}" fill="{skin}"/>'
         f'<path d="M{-hr:.1f},{-h * 0.72 - hr * 1.2:.1f} A{hr:.1f},{hr:.1f} 0 0,1 {hr:.1f},{-h * 0.72 - hr * 1.2:.1f} z" fill="{hair}"/>')
    if hat:
        o += f'<rect x="{-hr * 1.05:.1f}" y="{-h * 0.72 - hr * 3.0:.1f}" width="{hr * 2.1:.1f}" height="{hr * 1.1:.1f}" fill="{hat}"/>'
        o += f'<rect x="{-hr * 1.6:.1f}" y="{-h * 0.72 - hr * 2.0:.1f}" width="{hr * 3.2:.1f}" height="{hr * 0.25:.1f}" fill="{hat}"/>'
    return o


def encode_clip(name, stem, a, b, out, fade=0.12):
    """frames -> mp4 (the kit's finish), then the narration from `stem` between a and b seconds laid under it"""
    d = os.path.join(EP, 'build', name)
    subprocess.run(['node', os.path.join(KIT, 'anim_render.mjs'), d], check=True, capture_output=True)
    subprocess.run([sys.executable, os.path.join(KIT, 'encode.py'), d, os.path.join(d, 'silent.mp4')], check=True, capture_output=True)
    wav = os.path.join(EP, 'public', 'audio', stem + '.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(d, 'silent.mp4'), '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', wav,
                    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', f'afade=t=out:st={b - a - fade:.3f}:d={fade},apad',
                    '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
    return out
