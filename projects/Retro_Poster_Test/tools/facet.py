# Retro faceted-poster kit: flat, posterised planes lit from the upper left, paper grain, typewriter titles.
# Scenes are plain Python that call these helpers and return SVG; render.mjs turns the SVG into a PNG.
import math
import numpy as np
from scipy.spatial import Delaunay

W, H = 1920, 1080

PAL = {
    'paper': '#e9dbb8', 'cream': '#f2e6c6', 'cream2': '#e6d6ae',
    'sky': '#a7b9b6', 'sky2': '#b9c7c0', 'mist1': '#b3bfb8', 'mist2': '#9aaaa6', 'mist3': '#86978f',
    'ink': '#3a3934', 'ink2': '#4b4a44',
    'rock': ['#4c4b45', '#66655d', '#7f7d73', '#9a978b', '#b4b0a0'],
    'sand': ['#7a6c4f', '#97875f', '#b3a175', '#cbb88a', '#ddcb9d'],
    'olive': ['#3f4527', '#555c31', '#6c733c', '#878c48', '#a3a45a'],
    'olive_lt': ['#6c733c', '#878c48', '#a3a45a', '#bdb96e'],
    'pine': ['#2f3a2a', '#3f4c33', '#53603d'],
    'orange': '#d4732c', 'pink': '#d98b8c', 'yellow': '#dfb43a', 'blue': '#4f6377', 'red': '#a9473a',
    'trunk': '#4a3f33',
}

rng = np.random.default_rng(7)


def seed(n):
    global rng
    rng = np.random.default_rng(n)


# ---------- value noise ----------
_perm = np.random.default_rng(3).random((256, 256))


def vnoise(x, y):
    xi, yi = np.floor(x).astype(int), np.floor(y).astype(int)
    xf, yf = x - xi, y - yi
    u, v = xf * xf * (3 - 2 * xf), yf * yf * (3 - 2 * yf)
    g = lambda a, b: _perm[(a % 256), (b % 256)]
    return (g(xi, yi) * (1 - u) * (1 - v) + g(xi + 1, yi) * u * (1 - v)
            + g(xi, yi + 1) * (1 - u) * v + g(xi + 1, yi + 1) * u * v)


def fbm(x, y, oct=3):
    s, a, f = 0.0, 1.0, 1.0
    for _ in range(oct):
        s = s + a * vnoise(x * f, y * f)
        a *= 0.5
        f *= 2
    return s


# ---------- geometry ----------
def pts(p):
    return ' '.join(f'{x:.1f},{y:.1f}' for x, y in p)


def poly(p, fill, extra=''):
    return f'<polygon points="{pts(p)}" fill="{fill}" {extra}/>'


def inside(p, poly_):
    x, y = p
    n, c = len(poly_), False
    j = n - 1
    for i in range(n):
        xi, yi = poly_[i]
        xj, yj = poly_[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-9) + xi:
            c = not c
        j = i
    return c


def resample(poly_, step):
    out = []
    for i in range(len(poly_)):
        a, b = np.array(poly_[i], float), np.array(poly_[(i + 1) % len(poly_)], float)
        n = max(1, int(np.linalg.norm(b - a) / step))
        for k in range(n):
            out.append(tuple(a + (b - a) * k / n))
    return out


_clip_id = [0]


def facets(poly_, ramp, height, cell=70, light=(-0.62, -0.55, 0.56), jitter=0.45, contrast=1.0, bias=0.0, stroke=True):
    """Fill a polygon with Delaunay facets, each shaded flat from a height field and posterised to the ramp."""
    xs = [p[0] for p in poly_]
    ys = [p[1] for p in poly_]
    P = list(resample(poly_, cell * 0.9))
    for gx in np.arange(min(xs), max(xs) + cell, cell):
        for gy in np.arange(min(ys), max(ys) + cell, cell):
            q = (gx + (rng.random() - .5) * cell * jitter * 2, gy + (rng.random() - .5) * cell * jitter * 2)
            if inside(q, poly_):
                P.append(q)
    P = np.array(P)
    tri = Delaunay(P)
    L = np.array(light, float)
    L /= np.linalg.norm(L)
    _clip_id[0] += 1
    cid = f'c{_clip_id[0]}'
    out = [f'<clipPath id="{cid}"><polygon points="{pts(poly_)}"/></clipPath><g clip-path="url(#{cid})">',
           poly(poly_, ramp[len(ramp) // 2])]
    for s in tri.simplices:
        a, b, c = P[s]
        cen = (a + b + c) / 3
        if not inside(tuple(cen), poly_):
            continue
        A = np.array([a[0], a[1], height(a[0], a[1])])
        B = np.array([b[0], b[1], height(b[0], b[1])])
        C = np.array([c[0], c[1], height(c[0], c[1])])
        n = np.cross(B - A, C - A)
        if n[2] < 0:
            n = -n
        n /= np.linalg.norm(n) + 1e-9
        d = float(np.dot(n, L))
        t = np.clip(((d - 0.35) * 1.6 * contrast) + 0.5 + bias, 0, 0.999)
        col = ramp[int(t * len(ramp))]
        sk = f'stroke="{col}" stroke-width="1.2" stroke-linejoin="round"' if stroke else ''
        out.append(poly([a, b, c], col, sk))
    out.append('</g>')
    return '\n'.join(out)


def ridge_h(freq=0.02, amp=60, yamp=0.15, n=0.006, namp=40, phase=0.0):
    """Height field for cliffs: vertical ridges (sawtooth in x) plus noise, so planes run up and down."""
    def h(x, y):
        k = (x * freq + fbm(x * n, y * n * 0.4) * 2 + phase)
        return amp * np.abs((k % 2) - 1) + yamp * y + namp * fbm(x * n * 2, y * n * 2)
    return h


def hill_h(scale=0.004, amp=160, tilt=(0, 0)):
    def h(x, y):
        return amp * fbm(x * scale, y * scale) + tilt[0] * x + tilt[1] * y
    return h


def ridgeline(x0, x1, y, amp, step, seedv=0, sharp=True):
    """A jagged mountain silhouette from x0 to x1 around height y (closed down to the bottom)."""
    p = [(x0, H + 10)]
    x = x0
    while x <= x1 + step:
        v = fbm(x * 0.004 + seedv, seedv) - 0.75
        if sharp:
            v += (rng.random() - .5) * 0.35
        p.append((x, y - v * amp))
        x += step * (0.6 + rng.random() * 0.8)
    p.append((x1 + step, H + 10))
    return p


def cloud(cx, cy, w, h, fill, n=9, flat=True):
    """Flat scalloped cloud: a union of circles sitting on a flat base."""
    out = [f'<g fill="{fill}">']
    for i in range(n):
        t = i / (n - 1)
        r = h * (0.35 + 0.65 * math.sin(math.pi * t) ** 0.8) * (0.8 + rng.random() * .4)
        x = cx - w / 2 + w * t
        out.append(f'<circle cx="{x:.1f}" cy="{cy - r * 0.55:.1f}" r="{r:.1f}"/>')
    if flat:
        out.append(f'<rect x="{cx - w / 2:.1f}" y="{cy - h * .3:.1f}" width="{w:.1f}" height="{h * .3:.1f}"/>')
    out.append('</g>')
    return '\n'.join(out)


def leaf_cluster(cx, cy, r, ramp, k=5):
    """An angular foliage clump: a dark base shard and lighter shards toward the upper left."""
    out = []
    for layer, col in enumerate(ramp):
        rr = r * (1 - layer * 0.18)
        ox, oy = -layer * r * 0.12, -layer * r * 0.14
        m = k + rng.integers(0, 3)
        pp = []
        for i in range(m):
            a = 2 * math.pi * i / m + rng.random() * 0.5
            d = rr * (0.55 + rng.random() * 0.55)
            pp.append((cx + ox + math.cos(a) * d * 1.15, cy + oy + math.sin(a) * d * 0.8))
        out.append(poly(pp, col))
    return '\n'.join(out)


def tree(x, y, hgt, ramp=None, lean=0.0, clumps=7, spread=0.55):
    """Mid-century angular deciduous tree: a branching trunk with faceted clumps."""
    ramp = ramp or PAL['olive'][1:]
    out = []
    top = (x + lean * hgt, y - hgt)
    w = hgt * 0.025
    out.append(poly([(x - w, y), (x + w, y), (top[0] + w * .3, top[1]), (top[0] - w * .3, top[1])], PAL['trunk']))
    nodes = []
    for i in range(clumps):
        t = 0.35 + 0.65 * (i / max(1, clumps - 1))
        bx, by = x + (top[0] - x) * t, y + (top[1] - y) * t
        side = -1 if i % 2 else 1
        ex = bx + side * hgt * spread * (0.4 + rng.random() * 0.5) * (1.1 - t * 0.6)
        ey = by - hgt * (0.05 + rng.random() * 0.12)
        out.append(f'<line x1="{bx:.1f}" y1="{by:.1f}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="{PAL["trunk"]}" stroke-width="{max(1.5, w * .55):.1f}" stroke-linecap="round"/>')
        nodes.append((ex, ey, hgt * (0.085 + rng.random() * 0.05)))
    nodes.append((top[0], top[1], hgt * 0.15))
    for nx, ny, r in nodes:
        out.append(leaf_cluster(nx, ny, r, ramp))
    return '\n'.join(out)


def pine(x, y, hgt, ramp=None, tiers=5):
    ramp = ramp or PAL['pine']
    out = [f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y - hgt}" stroke="{PAL["trunk"]}" stroke-width="{hgt * .03:.1f}"/>']
    for i in range(tiers):
        t = i / tiers
        ty = y - hgt * (0.15 + t * 0.85)
        bw = hgt * 0.32 * (1 - t * 0.75)
        by = ty + hgt * 0.32
        out.append(poly([(x, ty), (x - bw, by), (x, by - hgt * .04)], ramp[2]))
        out.append(poly([(x, ty), (x + bw, by), (x, by - hgt * .04)], ramp[0]))
    return '\n'.join(out)


def figure(x, y, s, coat, legs=None, hat=None, pose='stand'):
    """A tiny mid-century figure, feet at (x, y), height about 4.2*s."""
    legs = legs or PAL['ink']
    out = []
    out.append(poly([(x - s * .35, y - s * 1.6), (x - s * .1, y), (x + s * .05, y), (x - s * .02, y - s * 1.6)], legs))
    out.append(poly([(x + s * .02, y - s * 1.6), (x + s * .15, y), (x + s * .38, y), (x + s * .35, y - s * 1.6)], legs))
    if pose == 'kneel':
        out = [poly([(x - s * .5, y - s * .9), (x + s * .5, y - s * .9), (x + s * .6, y), (x - s * .4, y)], legs)]
        y += s * 0.7
    out.append(poly([(x - s * .5, y - s * 1.5), (x + s * .5, y - s * 1.5), (x + s * .38, y - s * 3.3), (x - s * .38, y - s * 3.3)], coat))
    out.append(poly([(x, y - s * 1.5), (x + s * .5, y - s * 1.5), (x + s * .38, y - s * 3.3), (x, y - s * 3.3)], '#00000022'))
    out.append(f'<circle cx="{x:.1f}" cy="{y - s * 3.75:.1f}" r="{s * .42:.1f}" fill="#c9a07c"/>')
    if hat:
        out.append(poly([(x - s * .65, y - s * 3.95), (x + s * .65, y - s * 3.95), (x + s * .4, y - s * 4.15), (x - s * .4, y - s * 4.15)], hat))
        out.append(poly([(x - s * .38, y - s * 4.1), (x + s * .38, y - s * 4.1), (x + s * .3, y - s * 4.55), (x - s * .3, y - s * 4.55)], hat))
    return '\n'.join(out)


def construction(cx, cy, r, a0=200, a1=330, col=None, cross=True, op=0.7):
    col = col or PAL['cream']
    a0r, a1r = math.radians(a0), math.radians(a1)
    x0, y0 = cx + r * math.cos(a0r), cy + r * math.sin(a0r)
    x1, y1 = cx + r * math.cos(a1r), cy + r * math.sin(a1r)
    large = 1 if (a1 - a0) % 360 > 180 else 0
    out = [f'<g stroke="{col}" stroke-width="1.8" fill="none" opacity="{op}">',
           f'<path d="M{x0:.1f},{y0:.1f} A{r},{r} 0 {large} 1 {x1:.1f},{y1:.1f}"/>']
    if cross:
        out.append(f'<line x1="{cx:.1f}" y1="{cy - r * 1.05:.1f}" x2="{cx:.1f}" y2="{cy - r * 0.55:.1f}"/>')
        out.append(f'<line x1="{cx - r * 0.25:.1f}" y1="{cy - r * .8:.1f}" x2="{cx + r * 0.25:.1f}" y2="{cy - r * .8:.1f}"/>')
    out.append('</g>')
    return '\n'.join(out)


def title(x, y, lines, size=58, rule=True, col=None):
    col = col or PAL['ink']
    out = [f'<g font-family="Special Elite" fill="{col}" font-size="{size}">']
    for i, l in enumerate(lines):
        out.append(f'<text x="{x}" y="{y + i * size * 1.15:.1f}">{l}</text>')
    if rule:
        ry = y + (len(lines) - 1) * size * 1.15 + size * 0.75
        out.append(f'<rect x="{x}" y="{ry:.1f}" width="{size * 2.6:.1f}" height="3"/>')
    out.append('</g>')
    return '\n'.join(out)


GRAIN = '''
<filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="4" result="n"/>
  <feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer><feFuncA type="linear" slope="0.55"/></feComponentTransfer>
</filter>
<filter id="blotch" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="9"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.22  0 0 0 0.9 -0.25"/>
</filter>
<filter id="seam" x="-5%" y="-5%" width="115%" height="115%">
  <feDropShadow dx="5" dy="7" stdDeviation="4" flood-color="#1f2a38" flood-opacity="0.28"/>
</filter>
<filter id="flatshadow" x="-50%" y="-50%" width="200%" height="200%">
  <feColorMatrix type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.15  0 0 0 0 0.2  0 0 0 1 0"/>
</filter>
<radialGradient id="vig" cx="50%" cy="48%" r="75%">
  <stop offset="60%" stop-color="#5a4426" stop-opacity="0"/>
  <stop offset="100%" stop-color="#5a4426" stop-opacity="0.35"/>
</radialGradient>
'''


def seam(svg):
    """Flat-vector depth cue (from claude-drawing-skill's FlatVector): a lifted layer drops a short soft shadow."""
    return f'<g filter="url(#seam)">{svg}</g>'


def finish(body, w=W, h=H):
    """Wrap the scene: paper base, then the scene, then blotchy paper tone, grain and a warm vignette."""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
<defs>{GRAIN}</defs>
<rect width="{w}" height="{h}" fill="{PAL['paper']}"/>
{body}
<rect width="{w}" height="{h}" filter="url(#blotch)" style="mix-blend-mode:multiply" opacity="0.55"/>
<rect width="{w}" height="{h}" filter="url(#grain)" style="mix-blend-mode:multiply" opacity="0.22"/>
<rect width="{w}" height="{h}" fill="url(#vig)" style="mix-blend-mode:multiply"/>
</svg>'''


# ---------------------------------------------------------------- second-pass kit (sky, mist, ground detail)
def _hex(c):
    c = c.lstrip('#')
    return [int(c[i:i + 2], 16) for i in (0, 2, 4)]


def shift(c, k):
    """k < 0 darkens, k > 0 lightens"""
    v = [int(a + (255 - a) * k) if k > 0 else int(a * (1 + k)) for a in _hex(c)]
    return '#%02x%02x%02x' % tuple(max(0, min(255, a)) for a in v)


def tones(c, n=4, spread=0.1):
    """a posterised ramp around one colour, dark to light"""
    return [shift(c, -spread + 2 * spread * i / (n - 1)) for i in range(n)]


_uid = [0]


def uid(p='u'):
    _uid[0] += 1
    return f'{p}{_uid[0]}'


def sky(top, bottom, y1):
    g = uid('sky')
    return (f'<defs><linearGradient id="{g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}"/>'
            f'<stop offset="1" stop-color="{bottom}"/></linearGradient></defs><rect width="{W}" height="{y1}" fill="url(#{g})"/>')


def cloud2(cx, cy, w, h, fill, belly=None, n=9, drop=0.3):
    """cloud() with a flat belly tone: the part of the cloud that a copy shifted up does not cover"""
    body = cloud(cx, cy, w, h, '#fff', n=n)
    m = uid('m')
    out = body.replace('fill="#fff"', f'fill="{fill}"')
    if belly:
        out += (f'<mask id="{m}"><g>{body}</g><g transform="translate(0 {-h * drop:.1f})">{body.replace("#fff", "#000")}</g></mask>'
                f'<rect x="{cx - w:.0f}" y="{cy - h * 2:.0f}" width="{w * 2:.0f}" height="{h * 3:.0f}" fill="{belly}" mask="url(#{m})"/>')
    return out


def mist(y, h, col=None, op=0.5):
    """a horizontal band of haze that fades out above and below"""
    col = col or PAL['cream']
    g = uid('mist')
    return (f'<defs><linearGradient id="{g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{col}" stop-opacity="0"/>'
            f'<stop offset="0.6" stop-color="{col}" stop-opacity="{op}"/><stop offset="1" stop-color="{col}" stop-opacity="0"/>'
            f'</linearGradient></defs><rect x="-400" y="{y - h / 2:.0f}" width="{W + 800}" height="{h}" fill="url(#{g})"/>')


def tuft(x, y, h, col=None, n=4):
    col = col or PAL['olive'][1]
    out = ''
    for i in range(n):
        a = (i - (n - 1) / 2) * 0.28 + (rng.random() - .5) * 0.2
        w = h * 0.13
        out += poly([(x - w + i * w * 0.6, y), (x + w + i * w * 0.6, y), (x + i * w * 0.6 + math.sin(a) * h, y - math.cos(a) * h * (0.7 + rng.random() * 0.4))], col)
    return out


def moss(x, y, w, ramp=None):
    """a flat patch of moss or scrub: two or three wide shards"""
    ramp = ramp or PAL['olive'][1:4]
    out = ''
    for i, col in enumerate(ramp):
        ww = w * (1 - i * 0.22)
        hh = w * 0.22 * (1 - i * 0.2)
        ox = -i * w * 0.08
        p = [(x + ox - ww * .5, y), (x + ox - ww * .3, y - hh), (x + ox + ww * .1, y - hh * (0.8 + rng.random() * .5)),
             (x + ox + ww * .5, y - hh * .3), (x + ox + ww * .45, y + hh * .25), (x + ox - ww * .2, y + hh * .35)]
        out += poly(p, col)
    return out


def rock(x, y, w, ramp=None):
    """a small faceted boulder sitting on (x, y)"""
    ramp = ramp or PAL['rock']
    h = w * 0.6
    out = poly([(x - w * .5, y), (x - w * .38, y - h * .7), (x - w * .05, y - h), (x + w * .32, y - h * .75), (x + w * .5, y)], ramp[1])
    out += poly([(x - w * .5, y), (x - w * .38, y - h * .7), (x - w * .05, y - h), (x - w * .1, y)], ramp[3])
    out += poly([(x - w * .05, y - h), (x + w * .32, y - h * .75), (x + w * .1, y - h * .4), (x - w * .1, y)], ramp[2])
    return out


def rope(points, col=None, w=2.2, sag=0.0):
    """a rope through a list of points, sagging a little between them"""
    col = col or PAL['ink']
    d = f'M{points[0][0]:.1f},{points[0][1]:.1f}'
    for a, b in zip(points, points[1:]):
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag * math.hypot(b[0] - a[0], b[1] - a[1])
        d += f' Q{mx:.1f},{my:.1f} {b[0]:.1f},{b[1]:.1f}'
    return f'<path d="{d}" stroke="{col}" stroke-width="{w}" fill="none" stroke-linecap="round"/>'
