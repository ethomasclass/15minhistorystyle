# Episode 1 build kit: the Hawaiʻi-samples kit (camera, stage, marks, portal engine) plus
#   - placeholder timing from the script (words at the locked pace, pauses at [beat]/[pause] and punctuation), so scenes are
#     timed to words now and re-timed when the real voice arrives (swap timeline() for the ElevenLabs word timings);
#   - shots: hard cuts on the word, each shot its own group with its own camera;
#   - desk pieces: cards, typed quote cards, quote pages.
import os, sys, re, math
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.abspath(os.path.join(HERE, '..'))
HS = os.path.abspath(os.path.join(EP, '..', '..', 'Hawaii_Samples'))
sys.path.insert(0, os.path.join(HS, 'tools'))
from kit import *                      # noqa: E402,F401
from kit import escape                 # noqa: E402

RAW = lambda p: os.path.join(EP, 'img', 'raw', p)
HSI = lambda p: os.path.join(HS, 'img', p)
PAUSE = {'beat': 0.55, 'pause': 0.9}


class EpStage(Stage):
    def __init__(self, name, dur, **kw):
        super().__init__(name, dur, **kw)
        self.dir = os.path.join(EP, 'build', name)
        os.makedirs(self.dir, exist_ok=True)


# ---------------------------------------------------------------- placeholder timing
def norm(w):
    return re.sub(r"[^\w$ʻ']", '', w.replace('’', "'")).lower()


class Timeline:
    """word start/end times for one chapter file, at wpm. at('phrase') = when the phrase starts, end('phrase') = when it ends."""

    def __init__(self, slug, wpm=185, gaps=None):
        txt = open(os.path.join(EP, 'script', slug + '.txt')).read()
        sec = 60 / wpm
        t, self.w = 0.35, []
        for para in txt.strip().split('\n\n'):
            for tok in re.findall(r'\[[^\]]+\]|\S+', para):
                if tok.startswith('['):
                    t += PAUSE.get(tok[1:-1], 0)
                    continue
                n = norm(tok)
                if not n:
                    continue
                d = sec * (0.55 + 0.45 * len(n) / 4.7)
                self.w.append((n, t, t + d))
                t += d
                if tok[-1] in '.?!:"”' or tok.endswith('."'):
                    t += 0.28
                elif tok[-1] in ',;':
                    t += 0.12
            t += 0.45
        self.dur = t + 0.6
        for phrase, g in (gaps or {}).items():          # silent holds for the humor cuts (no narration under them)
            i = self._find(phrase)[0]
            self.w = self.w[:i] + [(n, a + g, b + g) for n, a, b in self.w[i:]]
            self.dur += g

    def _find(self, phrase, k=1):
        ws = [norm(x) for x in phrase.split()]
        ws = [x for x in ws if x]
        hit = 0
        for i in range(len(self.w) - len(ws) + 1):
            if all(self.w[i + j][0] == ws[j] for j in range(len(ws))):
                hit += 1
                if hit == k:
                    return i, i + len(ws) - 1
        raise KeyError(phrase)

    def at(self, phrase, k=1):
        return self.w[self._find(phrase, k)[0]][1]

    def end(self, phrase, k=1):
        return self.w[self._find(phrase, k)[1]][2]


# ---------------------------------------------------------------- shots (hard cuts)
class Shots:
    """[(start, id, camera)]; frame(t) -> transforms and opacities for every shot group"""

    def __init__(self, shots):
        self.s = sorted(shots, key=lambda s: s[0])

    def active(self, t):
        a = self.s[0]
        for s in self.s:
            if t >= s[0]:
                a = s
        return a

    def frame(self, t):
        a = self.active(t)
        T = {a[1]: a[2].transform(t)}
        O = {s[1]: 0 for s in self.s}
        O[a[1]] = 1
        return a[1], T, O


# ---------------------------------------------------------------- desk pieces
def desk_bg(href, w=4200, h=2400):
    return f'<image href="{href}" x="{960 - w / 2}" y="{540 - h / 2}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice"/>'


def paper(x, y, w, h, rot=0.0, fill='#efe5cc'):
    return (f'<g transform="rotate({rot} {x + w / 2:.1f} {y + h / 2:.1f})"><rect x="{x + 12}" y="{y + 18}" width="{w}" height="{h}" fill="#000" opacity="0.5" filter="url(#soft)"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" filter="url(#tear)"/></g>')


def typed(x, y, lines, size, prog, fill='#2b2620', family='Elite', lh=1.45):
    """lines typed on in order; prog 0..1 over all characters (already stepped by the caller)"""
    total = sum(len(l) for l in lines)
    n = int(total * clamp(prog))
    o = ''
    for i, l in enumerate(lines):
        if n <= 0:
            break
        o += text(x, y + i * size * lh, l[:n], size, family, fill)
        n -= len(l)
    return o


def placeholder(label):
    return (f'<rect x="1340" y="34" width="560" height="44" fill="#000" opacity="0.6"/>'
            + text(1360, 64, 'PLACEHOLDER · ' + label, 20, 'Plex', '#ff6f61', extra='letter-spacing="1"'))


# ---------------------------------------------------------------- Flow plates and cut-outs
import json as _json
EPI = lambda p: os.path.join(EP, 'img', p)
_INFO = {}


def finfo(name):
    for root in (EPI('flow'), HSI('flow')):
        f = os.path.join(root, 'flow.json')
        if f not in _INFO and os.path.exists(f):
            _INFO[f] = _json.load(open(f))
        if f in _INFO and name in _INFO[f]:
            return root, _INFO[f][name]
    raise KeyError(name)


def plate(S, name):
    """a Flow plate filling the 1920x1080 design space, with its edge colours as bleed beyond it"""
    root, d = finfo(name)
    e = d['edges']
    return (f'<rect x="-6000" y="-6000" width="6000" height="14000" fill="{e["left"]}"/><rect x="1920" y="-6000" width="6000" height="14000" fill="{e["right"]}"/>'
            f'<rect x="-1" y="-6000" width="1922" height="6001" fill="{e["top"]}"/><rect x="-1" y="1079" width="1922" height="6000" fill="{e["bottom"]}"/>'
            f'<image href="{S.img(os.path.join(root, name + ".jpg"))}" x="0" y="0" width="1920" height="1080"/>')


def cut(S, sheet, n, x, bottom, h, flip=False, shadow=True, gid=None):
    """cut-out n (1-based) of a sheet, feet at (x, bottom), h px tall; optional group id for breathing/animation"""
    root, d = finfo(sheet)
    c = d['cutouts'][n - 1]
    w = c['w'] * h / c['h']
    o = ''
    if shadow:
        o += f'<ellipse cx="{x:.0f}" cy="{bottom - 4:.0f}" rx="{w * 0.45:.0f}" ry="{max(4, h * 0.025):.0f}" fill="#000" opacity="0.25"/>'
    t = f' transform="translate({2 * x:.1f} 0) scale(-1 1)"' if flip else ''
    img = f'<image href="{S.img(os.path.join(root, c["file"]))}" x="{x - w / 2:.1f}" y="{bottom - h:.1f}" width="{w:.1f}" height="{h:.1f}"{t}/>'
    return o + (f'<g id="{gid}">{img}</g>' if gid else img)


def breathe(t, x, bottom, k=0, amp=0.008):
    """a slow breathing scale about the feet, on twos"""
    tq = step12(t)
    s = 1 + amp * math.sin(tq * 1.6 + k * 2.1)
    r = 0.25 * math.sin(tq * 0.8 + k * 1.3)
    return f'translate({x} {bottom}) rotate({r:.2f}) scale(1 {s:.4f}) translate({-x} {-bottom})'
