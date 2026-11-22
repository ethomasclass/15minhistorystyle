# Shared kit for the Hawaii technique samples.
#   Spline / Camera   monotone cubic camera (Fritsch-Carlson, from cinematic-skill, MIT): no overshoot, zoom in log space,
#                     holds drift instead of freezing, a faint handheld wobble; camera speed drives whooshes.
#   Stage             writes base.html (fonts, a world group under the camera, an overlay group) and frames.ndjson
#                     for tools/anim_render.mjs, plus events.json for tools/anim_encode.py.
#   helpers           photo cards with source tags, Highlight titles, Nanum notes, typed text, a loupe.
# Channel rules kept: one camera that glides, marks that step at 12 drawings a second, cuts on a beat with no
# dissolves, every picture credited in mono, titles in the orange tape box, teal marks.
import bisect, json, math, os, shutil
from xml.sax.saxutils import escape

W, H, FPS = 1920, 1080, 30
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..'))
TEAL, ORANGE, INK, CORAL, CREAM, BONE = '#2FE0C4', '#FF9F1C', '#111111', '#FF6F61', '#f4efe6', '#EDE7DC'
DESK = 'radial-gradient(ellipse at 45% 40%, #2a2620 0%, #16140f 70%, #0d0c09 100%)'

FONTS = {  # family: file (full fonts: the channel's subset woff2 files lack the ʻokina and kahakō)
    'Playfair': 'PlayfairDisplay-900-full.ttf', 'Playfair7': 'PlayfairDisplay-700-full.ttf', 'Inter': 'Inter-600-full.ttf',
    'Inter8': 'Inter-800-full.ttf', 'Plex': 'IBMPlexMono-full.ttf', 'Abril': 'AbrilFatface-full.ttf',
    'Nanum': 'NanumPenScript-full.ttf', 'Fell': 'IMFellEnglish.ttf', 'FellI': 'IMFellEnglishItalic.ttf',
    'Noto': 'NotoSerif-400.ttf', 'NotoI': 'NotoSerif-400i.ttf', 'Elite': 'SpecialElite.ttf',
}
# glyph fallbacks: Abril and Nanum have no ʻokina or kahakō, so the browser borrows them from these
FAM = {'Abril': "'Abril','Playfair'", 'Nanum': "'Nanum','Inter'", 'Fell': "'Fell','Noto'", 'FellI': "'FellI','NotoI'", 'Elite': "'Elite','Plex'"}


def fam(name):
    return FAM.get(name, f"'{name}'")


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease(u):
    u = clamp(u); return u * u * (3 - 2 * u)


def ease_out(u, p=3):
    u = clamp(u); return 1 - (1 - u) ** p


def ease_in(u, p=2):
    return clamp(u) ** p


def back_out(u, s=1.6):
    u = clamp(u) - 1; return 1 + u * u * ((s + 1) * u + s)


def step12(t):
    """time quantised to 12 drawings a second (for marks and figures)"""
    return math.floor(t * 12 + 1e-6) / 12


class Spline:
    """Monotone cubic (Fritsch-Carlson) through (t, value) keys: no overshoot, and it keeps moving through keys on a
    monotone run, so a 'hold' made of two close keys drifts rather than stopping dead. (cinematic-skill, MIT)"""

    def __init__(self, keys):
        keys = sorted(keys)
        self.t = [k[0] for k in keys]; self.v = [k[1] for k in keys]
        n = len(keys)
        d = [(self.v[i + 1] - self.v[i]) / max(1e-9, self.t[i + 1] - self.t[i]) for i in range(n - 1)]
        m = [0.0] * n
        if n > 1:
            m[0], m[-1] = d[0], d[-1]
        for i in range(1, n - 1):
            m[i] = 0.0 if d[i - 1] * d[i] <= 0 else (d[i - 1] + d[i]) / 2
        for i in range(n - 1):
            if d[i] == 0:
                m[i] = m[i + 1] = 0.0; continue
            a, b = m[i] / d[i], m[i + 1] / d[i]
            s = a * a + b * b
            if s > 9:
                k = 3 / math.sqrt(s); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]
        self.m = m

    def __call__(self, t):
        T = self.t
        if len(T) == 1 or t <= T[0]:
            return self.v[0]
        if t >= T[-1]:
            return self.v[-1]
        i = bisect.bisect_right(T, t) - 1
        h = T[i + 1] - T[i]; u = (t - T[i]) / h
        h00 = 2 * u ** 3 - 3 * u ** 2 + 1; h10 = u ** 3 - 2 * u ** 2 + u
        h01 = -2 * u ** 3 + 3 * u ** 2; h11 = u ** 3 - u ** 2
        return h00 * self.v[i] + h10 * h * self.m[i] + h01 * self.v[i + 1] + h11 * h * self.m[i + 1]


class Camera:
    """keys: (t, x, y, zoom[, rot]) = the world point at frame centre, the zoom (1 = world px to screen px).
    Zoom is splined in log space so pushes feel even. wobble: px of handheld drift at zoom 1."""

    def __init__(self, keys, wobble=1.6):
        self.x = Spline([(k[0], k[1]) for k in keys]); self.y = Spline([(k[0], k[2]) for k in keys])
        self.z = Spline([(k[0], math.log(k[3])) for k in keys])
        self.r = Spline([(k[0], k[4] if len(k) > 4 else 0.0) for k in keys])
        self.wobble = wobble
        self.cut = []                       # times of hard cuts (the wobble phase jumps there)

    def at(self, t):
        x, y, z, r = self.x(t), self.y(t), math.exp(self.z(t)), self.r(t)
        w = self.wobble
        x += w * (math.sin(t * 0.83 + 1.1) * 0.6 + math.sin(t * 1.71 + 2.3) * 0.3) / z
        y += w * (math.sin(t * 0.67 + 0.4) * 0.6 + math.sin(t * 1.39 + 4.1) * 0.3) / z
        r += 0.06 * w * math.sin(t * 0.51 + 0.7)
        return x, y, z, r

    def transform(self, t):
        x, y, z, r = self.at(t)
        return f'translate({W / 2} {H / 2}) rotate({r:.3f}) scale({z:.5f}) translate({-x:.2f} {-y:.2f})'

    def speed(self, t, dt=1 / FPS):
        """on-screen speed in px/s (pan at the current zoom plus zoom change), for whooshes"""
        x0, y0, z0, _ = self.at(t); x1, y1, z1, _ = self.at(t + dt)
        return (math.hypot(x1 - x0, y1 - y0) * z0 + abs(math.log(z1 / z0)) * 900) / dt


def whooshes(cam, t0, t1, thresh=900, vol=0.28, name='whoosh'):
    """a whoosh at the start of every fast camera move (camera speed crossing thresh)"""
    out, above, t = [], False, t0
    while t < t1:
        s = cam.speed(t)
        if s > thresh and not above:
            out.append([name, max(0, t - 0.12), vol])
        above = s > thresh * 0.7 if above else s > thresh
        t += 1 / FPS
    return out


# ---------------------------------------------------------------- the stage
class Stage:
    def __init__(self, name, dur, bg='#111', press=True, grain=0.6):
        self.name, self.dur, self.bg, self.press, self.grain = name, dur, bg, press, grain
        self.dir = os.path.join(ROOT, 'build', name)
        os.makedirs(self.dir, exist_ok=True)
        self.defs, self.world, self.over, self.sounds, self.bed = [], [], [], [], None
        self.n_img = 0

    def img(self, path):
        """copy a picture into the build folder; return its href"""
        self.n_img += 1
        ext = os.path.splitext(path)[1]
        dst = f'i{self.n_img}{ext}'
        shutil.copy(path, os.path.join(self.dir, dst))
        return dst

    def sound(self, name, t, vol):
        self.sounds.append([name, round(t, 3), vol])

    def write(self, frame_fn):
        faces = ''.join(f"@font-face{{font-family:'{k}';src:url('file://{os.path.join(ROOT, 'fonts', v)}')}}" for k, v in FONTS.items())
        bg = self.bg if not self.bg.startswith('radial') else '#16140f'
        html = (f'<!doctype html><html><head><meta charset="utf-8"><style>{faces}html,body{{margin:0;background:{bg}}}svg{{display:block}}</style></head><body>'
                f'<svg id="stage" xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs>{"".join(self.defs)}</defs>'
                f'<g id="CAM">{"".join(self.world)}</g>{"".join(self.over)}</svg></body></html>')
        open(os.path.join(self.dir, 'base.html'), 'w').write(html)
        with open(os.path.join(self.dir, 'frames.ndjson'), 'w') as fh:
            for f in range(int(round(self.dur * FPS))):
                fh.write(json.dumps(frame_fn(f / FPS)) + '\n')
        ev = {'dur': self.dur, 'sounds': self.sounds, 'press': self.press, 'grain': self.grain}
        if self.bed:
            ev['bed'] = self.bed
        json.dump(ev, open(os.path.join(self.dir, 'events.json'), 'w'))
        print('ok', self.name, int(round(self.dur * FPS)), 'frames')


# ---------------------------------------------------------------- pieces
def text(x, y, s, size, family='Inter', fill=CREAM, anchor='start', weight=None, extra=''):
    w = f' font-weight="{weight}"' if weight else ''
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{fam(family)}" font-size="{size}" fill="{fill}" text-anchor="{anchor}"'
            f'{w} xml:space="preserve" {extra}>{escape(s)}</text>')


def tag(x, y, s, size=17, fill='#d9d2c4', anchor='start'):
    """the mono source credit every picture carries"""
    return text(x, y, s, size, 'Plex', fill, anchor, extra='letter-spacing="0.5"')


def card(href, x, y, w, h, border=True, shadow=True, rot=0.0, tagline=None, iid=None):
    """a photo card: cream border, soft shadow, optional credit line under it"""
    b = max(8, 0.025 * w) if border else 0
    idattr = f' id="{iid}"' if iid else ''
    o = f'<g{idattr} transform="rotate({rot} {x + w / 2:.1f} {y + h / 2:.1f})">'
    if shadow:
        o += f'<rect x="{x - b + 10:.1f}" y="{y - b + 16:.1f}" width="{w + 2 * b:.1f}" height="{h + 2 * b:.1f}" fill="#000" opacity="0.5" filter="url(#soft)"/>'
    if border:
        o += f'<rect x="{x - b:.1f}" y="{y - b:.1f}" width="{w + 2 * b:.1f}" height="{h + 2 * b:.1f}" fill="{CREAM}"/>'
    o += f'<image href="{href}" x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" preserveAspectRatio="xMidYMid slice"/>'
    if tagline:
        o += tag(x - b, y + h + b + 26, tagline)
    return o + '</g>'


COMMON_DEFS = '''
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="soft4" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="bw"><feColorMatrix type="saturate" values="0"/></filter>
<filter id="sepia"><feColorMatrix type="matrix" values="0.36 0.62 0.12 0 0.04  0.32 0.56 0.11 0 0.03  0.25 0.45 0.09 0 0.02  0 0 0 1 0"/></filter>
<filter id="tear" x="-5%" y="-20%" width="110%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
'''


def highlight(x, y, words, size=88, after=None, prog=1.0, rot=-2.0, fill=ORANGE):
    """the channel's Highlight: Abril caps on a torn orange strip that wipes on from the left (8 frames)"""
    wch = size * 0.62 * len(words) + size * 0.5
    hh = size * 1.18
    p = clamp(prog)
    o = f'<g transform="rotate({rot} {x} {y})"><clipPath id="hl{int(x)}{int(y)}"><rect x="{x - 10}" y="{y - hh}" width="{(wch + 20) * p:.1f}" height="{hh * 1.4}"/></clipPath>'
    o += f'<g clip-path="url(#hl{int(x)}{int(y)})"><rect x="{x}" y="{y - hh * 0.86:.1f}" width="{wch:.1f}" height="{hh:.1f}" fill="{fill}" filter="url(#tear)"/>'
    o += text(x + size * 0.25, y, words.upper(), size, 'Abril', INK) + '</g>'
    if after and p >= 1:
        o += text(x + wch + size * 0.3, y, after.upper(), size, 'Abril', fill)
    return o + '</g>'


def note(x, y, s, size=58, fill=TEAL, prog=1.0, anchor='start'):
    """Nanum handwriting written on left to right (stepped), with a hard ink outline"""
    n = int(len(s) * clamp(prog))
    if n <= 0:
        return ''
    return (f'<text x="{x}" y="{y}" font-family="{fam("Nanum")}" font-size="{size * 1.55:.0f}" fill="{fill}" stroke="{INK}" stroke-width="6" '
            f'paint-order="stroke" stroke-linejoin="round" text-anchor="{anchor}" xml:space="preserve">{escape(s[:n])}</text>')


def drawn_path(d, prog, color=TEAL, width=7, iid=None, extra=''):
    """a teal mark that draws on (prog 0..1, already stepped by the caller)"""
    if prog <= 0:
        return ''
    return (f'<path d="{d}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="{1 - clamp(prog):.4f}" stroke="{color}" '
            f'stroke-width="{width}" fill="none" stroke-linecap="round" stroke-linejoin="round" {extra}/>')


def loop_path(cx, cy, rx, ry, seed=1, turns=1.12):
    """a hand-drawn loop: an ellipse that overshoots its start, slightly wobbly"""
    pts = []
    n = 48
    for i in range(int(n * turns) + 1):
        a = -math.pi * 0.6 + 2 * math.pi * i / n
        k = 1 + 0.04 * math.sin(i * 0.9 + seed) + 0.02 * math.sin(i * 2.3 + seed * 2)
        pts.append((cx + rx * k * math.cos(a), cy + ry * k * math.sin(a) + i * 0.15))
    return 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts)


def slip(x, y, s, size=40, prog=1.0, pink=False, rot=-1.5, anchor='start'):
    """the channel's Slip: a note on a torn paper slip (cream with deep-teal ink, or pink with dark-red ink) that slaps
    on, then the words write on. Readable on any picture."""
    if prog <= 0:
        return ''
    fs = size * 1.55
    w = fs * 0.335 * len(s) + fs * 0.8
    hh = fs * 1.05
    x0 = x if anchor == 'start' else x - w
    bg, ink = ('#f6c9c4', '#7a1d16') if pink else ('#f3ead8', '#0f5b52')
    k = clamp(prog * 6)                                  # the slip slaps on in the first sixth
    sc = 1.08 - 0.08 * k
    n = int(len(s) * clamp((prog - 0.15) / 0.85))
    o = f'<g transform="rotate({rot} {x0 + w / 2:.1f} {y:.1f}) translate({x0 + w / 2:.1f} {y - hh * 0.35:.1f}) scale({sc:.3f}) translate({-(x0 + w / 2):.1f} {-(y - hh * 0.35):.1f})">'
    o += f'<rect x="{x0 + 6:.1f}" y="{y - hh * 0.78 + 8:.1f}" width="{w:.1f}" height="{hh:.1f}" fill="#000" opacity="0.35" filter="url(#soft4)"/>'
    o += f'<rect x="{x0:.1f}" y="{y - hh * 0.78:.1f}" width="{w:.1f}" height="{hh:.1f}" fill="{bg}" filter="url(#tear)"/>'
    if n > 0:
        o += f'<text x="{x0 + fs * 0.4:.1f}" y="{y:.1f}" font-family="{fam("Nanum")}" font-size="{fs:.0f}" fill="{ink}" xml:space="preserve">{escape(s[:n])}</text>'
    return o + '</g>'
