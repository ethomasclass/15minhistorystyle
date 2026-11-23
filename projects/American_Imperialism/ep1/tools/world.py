# The code-drawn world kit: everything in the illustrated scenes is drawn here, copying the Google Flow plates for layout
# and palette (the plates are the model, never the picture). Each scene returns static SVG (in a 1920x1080 design space,
# with bleed) plus a function of time for what moves. All motion is stepped by the caller (12 fps).
import math
import numpy as np
from ep import HS                                               # noqa: F401  (sets the kit path)
from people import person, gait, walker, toil, react, mix, SKIN, HAIR, tint, PERIOD, DUTY, A as STRIDE   # noqa: F401
import facet as F
from facet import facets, poly, ridge_h, hill_h, seed

seed(23)
P2 = lambda q: ' '.join(f'{x:.1f},{y:.1f}' for x, y in q)

# ---------------------------------------------------------------- shared palette (from the Flow plates)
SKY_T, SKY_B = '#b8c5b8', '#cdd0bf'
CLOUD, BELLY = '#e6d6ad', '#cfb88c'
MTN = ['#55634f', '#5f6e59', '#6b7a62', '#748265', '#838e73', '#93a083']
FAR = ['#7f8b6d', '#8d987b', '#9aa48a', '#a8b096']
TREE = ['#3a4630', '#404d35', '#4b5a3d']
LAWN = ['#7d8245', '#878b4b', '#8f9150', '#9a9b58']
PALM = ['#414e32', '#4f5936', '#5f6b3a', '#6f7a42', '#7f8a4c']
TRUNK = ['#53402c', '#664d34']
SEA = ['#3f6a6b', '#4f7776', '#5e8784', '#6f9997', '#86aba6']
WOOD = ['#4a3726', '#5a4130', '#6e5038', '#86643f', '#9c7a4f', '#b08e5e']
BRICK = ['#4f2a20', '#5e3226', '#6b3b2c', '#7a4532', '#8a5038']
ROCK = ['#3f4230', '#4d523a', '#5e6545', '#6c7550', '#7e855e', '#8f9670']
COAL = ['#151510', '#1f1e17', '#2a2920', '#37352a']
IVORY = ['#bdb7a3', '#d3cdb7', '#e4dfcc', '#efeadb']


def sky(top=SKY_T, bot=SKY_B, gid='skyg'):
    return (f'<linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bot}"/></linearGradient>'
            f'<rect x="-3000" y="-3000" width="7920" height="6000" fill="url(#{gid})"/>')


def drift_group(gid, svg):
    return f'<g id="{gid}">{svg}</g>'


# ---------------------------------------------------------------- palms (each frond sways on its own)
def palm_specs(palms):
    """palms: [(base x, base y, crown x, crown y, frond length, n fronds, seed, fan)] -> precomputed frond angles"""
    out = []
    for p in palms:
        r = np.random.default_rng(p[6])
        n = p[5]
        if p[7]:
            angs = np.linspace(-185, 5, n) + r.uniform(-8, 8, n)
        else:
            base = [-200, -175, -150, -128, -100, -70, -45, -22, 5, -60, -115]
            angs = np.array(base[:n]) + r.uniform(-6, 6, n)
        out.append((p, [(a, p[4] * r.uniform(0.8, 1.1), r.uniform(0, 6.28), int(r.integers(0, 3))) for a in angs]))
    return out


def frond(cx, cy, ang, L, droop, wmax, cols):
    n = 9
    sp = []
    for i in range(n + 1):
        s = i / n
        a = math.radians(ang)
        sp.append((cx + L * s * math.cos(a), cy + L * s * math.sin(a) + droop * L * s * s))
    up, dn = [], []
    for i, (x, y) in enumerate(sp):
        s = i / n
        if i < n:
            dx, dy = sp[i + 1][0] - x, sp[i + 1][1] - y
        L2 = math.hypot(dx, dy) or 1
        nx, ny = -dy / L2, dx / L2
        w = wmax * math.sin(math.pi * min(1, s * 1.15)) * (1.0 if i % 2 else 0.55)
        up.append((x + nx * w, y + ny * w))
        dn.append((x - nx * w * 0.8, y - ny * w * 0.8))
    return (f'<polygon points="{P2(sp + up[::-1])}" fill="{cols[1]}"/><polygon points="{P2(sp + dn[::-1])}" fill="{cols[0]}"/>'
            f'<polyline points="{P2(sp)}" fill="none" stroke="{cols[0]}" stroke-width="2"/>')


def palms(tq, specs, wind=1.0):
    o = ''
    for (bx, by, cx, cy, L, n, sd, fan), spec in specs:
        h = by - cy
        gust = (0.6 + 0.4 * math.sin(tq * 0.35 + sd)) * wind
        sway = math.sin(tq * 1.1 + sd * 1.7) * gust
        ccx = cx + sway * h * 0.012
        mx, my = (bx + ccx) / 2 + (cx - bx) * 0.3, (by + cy) / 2
        left, right = [], []
        for i in range(15):
            s = i / 14
            x = (1 - s) ** 2 * bx + 2 * (1 - s) * s * mx + s * s * ccx
            y = (1 - s) ** 2 * by + 2 * (1 - s) * s * my + s * s * cy
            w = (h * 0.024 + 3) * (1 - 0.45 * s)
            left.append((x - w, y)); right.append((x + w, y))
        o += f'<polygon points="{P2(left + right[::-1])}" fill="{TRUNK[1]}"/>'
        o += f'<polygon points="{P2(right + [((p[0] + q[0]) / 2, p[1]) for p, q in zip(right[::-1], left[::-1])])}" fill="{TRUNK[0]}" opacity="0.6"/>'
        for i in sorted(range(len(spec)), key=lambda i: -abs(spec[i][0] + 90)):
            a, Lf, ph, c = spec[i]
            wob = (5 + 4 * gust) * math.sin(tq * 1.6 + ph) + sway * 6
            droop = (0.25 if fan else 0.55) + 0.06 * math.sin(tq * 1.3 + ph)
            cols = (PALM[c], PALM[c + 2]) if a < -90 or a > -60 else (PALM[c + 1], PALM[c + 2])
            o += frond(ccx, cy, a + wob, Lf, droop, Lf * (0.11 if fan else 0.1), cols)
        o += f'<circle cx="{ccx:.1f}" cy="{cy:.1f}" r="{L * 0.05 + 3:.1f}" fill="{PALM[0]}"/>'
    return o


# ---------------------------------------------------------------- broadleaf trees (breadfruit), swaying as clumps
def tree_specs(trees):
    out = []
    for (x, base, h, w, sd) in trees:
        r = np.random.default_rng(sd)
        clumps = [(x + r.uniform(-0.45, 0.45) * w, base - h * r.uniform(0.45, 0.95), r.uniform(0.22, 0.34) * w, r.uniform(0, 6.28)) for _ in range(9)]
        clumps.sort(key=lambda c: -c[1])
        out.append(((x, base, h, w, sd), clumps))
    return out


def trees(tq, specs):
    o = ''
    for (x, base, h, w, sd), clumps in specs:
        o += poly([(x - 9, base), (x + 9, base), (x + 5, base - h * 0.55), (x - 5, base - h * 0.55)], TRUNK[0])
        for (cx, cy, r, ph) in clumps:
            dx = 2.5 * math.sin(tq * 1.2 + ph) * (base - cy) / h
            k = int((ph * 10) % 3)
            pts = [(cx + dx + r * math.cos(a) * (0.9 + 0.12 * math.sin(a * 3 + ph)), cy + r * 0.8 * math.sin(a)) for a in np.linspace(0, 2 * math.pi, 11)[:-1]]
            o += f'<polygon points="{P2(pts)}" fill="{PALM[k]}"/>'
            half = [(cx + dx, cy)] + [p for p, a in zip(pts, np.linspace(0, 2 * math.pi, 11)[:-1]) if math.pi * 0.9 < a < math.pi * 1.9]
            o += f'<polygon points="{P2(half)}" fill="{PALM[k + 2]}"/>'
    return o


# ---------------------------------------------------------------- flags
def flag_hawaii(tq, x0, y0, Wf, Hf):
    def P(u, v):
        a = Hf * 0.07 * u ** 1.2
        return (x0 + u * Wf * (1 - 0.04 * math.cos(2 * math.pi * (1.3 * u - 0.9 * tq)) * u),
                y0 + v * Hf + a * math.sin(2 * math.pi * (1.3 * u - 0.9 * tq)) - Hf * 0.02 * u)

    def band(u0, u1, v0, v1, col, n=14, extra=''):
        top = [P(u0 + (u1 - u0) * i / n, v0) for i in range(n + 1)]
        bot = [P(u0 + (u1 - u0) * i / n, v1) for i in reversed(range(n + 1))]
        return f'<polygon points="{P2(top + bot)}" fill="{col}" {extra}/>'

    def line(a, b, col, w):
        pts = [P(a[0] + (b[0] - a[0]) * k / 6, a[1] + (b[1] - a[1]) * k / 6) for k in range(7)]
        return f'<polyline points="{P2(pts)}" fill="none" stroke="{col}" stroke-width="{w}"/>'
    o = ''.join(band(0, 1, i / 8, (i + 1) / 8, c) for i, c in enumerate(['#ece4d0', '#a8322c', '#2c3f73'] * 3) if i < 8)
    cu, cv = 0.42, 0.5
    o += band(0, cu, 0, cv, '#2c3f73', 8)
    k = Wf / 142
    for a_, b_ in (((0, 0), (cu, cv)), ((0, cv), (cu, 0))):
        o += line(a_, b_, '#ece4d0', 5 * k) + line(a_, b_, '#a8322c', 1.8 * k)
    for a_, b_ in (((cu / 2, 0), (cu / 2, cv)), ((0, cv / 2), (cu, cv / 2))):
        o += line(a_, b_, '#ece4d0', 8 * k) + line(a_, b_, '#a8322c', 4 * k)
    for i in range(10):
        u0, u1 = i / 10, (i + 1) / 10
        d = math.cos(2 * math.pi * (1.3 * (u0 + u1) / 2 - 0.9 * tq))
        o += band(u0, u1, 0, 1, '#000' if d > 0 else '#fff', 3, f'opacity="{abs(d) * 0.12:.3f}"')
    return o


def flag_us(tq, x0, y0, Wf, Hf, wave=1.0):
    """the 1890s U.S. flag: thirteen stripes, a blue canton with rows of small stars"""
    def P(u, v):
        a = Hf * 0.07 * u ** 1.2 * wave
        return (x0 + u * Wf, y0 + v * Hf + a * math.sin(2 * math.pi * (1.3 * u - 0.9 * tq)))

    def band(u0, u1, v0, v1, col, n=12, extra=''):
        top = [P(u0 + (u1 - u0) * i / n, v0) for i in range(n + 1)]
        bot = [P(u0 + (u1 - u0) * i / n, v1) for i in reversed(range(n + 1))]
        return f'<polygon points="{P2(top + bot)}" fill="{col}" {extra}/>'
    o = ''.join(band(0, 1, i / 13, (i + 1) / 13, '#a8322c' if i % 2 == 0 else '#ece4d0') for i in range(13))
    o += band(0, 0.4, 0, 7 / 13, '#2c3f73', 6)
    for r in range(6):
        for c in range(8):
            x, y = P(0.03 + c * 0.048, 0.05 + r * 0.085)
            o += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{Hf * 0.012:.1f}" fill="#ece4d0"/>'
    for i in range(10):
        u0, u1 = i / 10, (i + 1) / 10
        d = math.cos(2 * math.pi * (1.3 * (u0 + u1) / 2 - 0.9 * tq))
        o += band(u0, u1, 0, 1, '#000' if d > 0 else '#fff', 3, f'opacity="{abs(d) * 0.12 * wave:.3f}"')
    return o


# ---------------------------------------------------------------- smoke, water, gulls
def smoke(tq, x, y, rate=1.4, life=7.0, rise=26, wind=(-55, -8), size=40, cols=('#57534a', '#6b665b', '#7f796b'), seed_=0):
    """faceted smoke puffs rising from (x, y) and blown by the wind, oldest drawn first"""
    o = ''
    r = np.random.default_rng(seed_)
    jit = r.uniform(-1, 1, 400)
    n0 = int((tq - life) * rate)
    for i in range(max(0, n0), int(tq * rate) + 1):
        age = tq - i / rate
        if age < 0 or age > life:
            continue
        a = age / life
        px = x + wind[0] * age + jit[i % 400] * 10 * a
        py = y - rise * age + wind[1] * age
        rr = size * (0.5 + 1.6 * a)
        k = i % 3
        pts = [(px + rr * math.cos(t) * (0.85 + 0.25 * math.sin(3 * t + i)), py + rr * 0.75 * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 8)[:-1]]
        o += f'<polygon points="{P2(pts)}" fill="{cols[k]}" opacity="{0.92 * (1 - a) ** 0.7:.2f}"/>'
    return o


def sea_bands(tq, y0, y1, x0=-600, x1=2520, n=9, cols=SEA, speed=14):
    """drifting flat bands of a calm sea: each band a slow sine wave"""
    o = poly([(x0, y0), (x1, y0), (x1, y1 + 600), (x0, y1 + 600)], cols[2])
    for i in range(n):
        yy = y0 + (y1 - y0) * (i + 0.5) / n
        amp = 2 + 5 * i / n
        ph = tq * (0.6 + 0.1 * i) + i
        top = [(x, yy + amp * math.sin(x * 0.012 + ph) + 0.5 * amp * math.sin(x * 0.031 - ph)) for x in range(x0, x1 + 1, 60)]
        h = (y1 - y0) / n * (0.35 + 0.25 * math.sin(i * 1.7))
        bot = [(x, y + h) for x, y in top[::-1]]
        o += f'<polygon points="{P2(top + bot)}" fill="{cols[(i % 2) * 2 + (1 if i > n / 2 else 0)]}" opacity="0.55"/>'
    return o


def gulls(tq, flock, col='#ece7d8', dark='#5a564c'):
    """flock: [(x0, y, speed, size, phase)]; each gull glides and flaps"""
    o = ''
    for x0, y, v, s, ph in flock:
        x = x0 + v * tq
        yb = y + 6 * math.sin(tq * 0.8 + ph)
        f = math.sin(tq * 7 + ph)
        wy = -s * 0.35 * f
        o += f'<path d="M{x - s:.1f},{yb + wy:.1f} Q{x - s * 0.45:.1f},{yb - s * 0.25 + wy * 0.5:.1f} {x:.1f},{yb:.1f} Q{x + s * 0.45:.1f},{yb - s * 0.25 + wy * 0.5:.1f} {x + s:.1f},{yb + wy:.1f}" fill="none" stroke="{col}" stroke-width="{s * 0.16:.1f}" stroke-linecap="round"/>'
        o += f'<circle cx="{x:.1f}" cy="{yb + 1:.1f}" r="{s * 0.1:.1f}" fill="{dark}"/>'
    return o


# ---------------------------------------------------------------- props
def crate(x, y, w, h, k=2, side=0.0):
    """a wooden crate standing on (x, y) (bottom-left), front face w x h, optional top/side face for depth"""
    c = WOOD
    o = ''
    d = h * 0.22
    if side:
        o += poly([(x + w, y), (x + w + d * side, y - d), (x + w + d * side, y - h - d), (x + w, y - h)], c[max(0, k - 1)])
    o += poly([(x, y - h), (x + w, y - h), (x + w + d * side, y - h - d), (x + d * side, y - h - d)], c[min(5, k + 2)])
    o += poly([(x, y), (x + w, y), (x + w, y - h), (x, y - h)], c[k])
    b = max(3, w * 0.07)
    o += f'<rect x="{x}" y="{y - h}" width="{w}" height="{h}" fill="none" stroke="{c[max(0, k - 2)]}" stroke-width="{b:.1f}"/>'
    o += f'<line x1="{x + b}" y1="{y - b}" x2="{x + w - b}" y2="{y - h + b}" stroke="{c[max(0, k - 2)]}" stroke-width="{b:.1f}"/>'
    return o


def barrel(x, y, w, h, k=3):
    c = WOOD
    o = f'<path d="M{x + w * 0.08:.1f},{y} Q{x - w * 0.04:.1f},{y - h / 2:.1f} {x + w * 0.08:.1f},{y - h} L{x + w * 0.92:.1f},{y - h} Q{x + w * 1.04:.1f},{y - h / 2:.1f} {x + w * 0.92:.1f},{y} Z" fill="{c[k]}"/>'
    o += f'<path d="M{x + w * 0.5:.1f},{y} Q{x + w * 1.04:.1f},{y - h / 2:.1f} {x + w * 0.92:.1f},{y - h} L{x + w * 0.6:.1f},{y - h} Q{x + w * 0.8:.1f},{y - h / 2:.1f} {x + w * 0.5:.1f},{y} Z" fill="{c[k - 1]}" opacity="0.7"/>'
    for f_ in (0.2, 0.8):
        o += f'<rect x="{x + w * 0.02:.1f}" y="{y - h * f_ - 3:.1f}" width="{w * 0.96:.1f}" height="6" fill="#3a3a34"/>'
    o += f'<ellipse cx="{x + w / 2:.1f}" cy="{y - h:.1f}" rx="{w * 0.42:.1f}" ry="{w * 0.1:.1f}" fill="{c[k + 1]}"/>'
    return o


def bale(x, y, w, h):
    o = f'<rect x="{x}" y="{y - h}" width="{w}" height="{h}" rx="{h * 0.22:.1f}" fill="#e6dcc4"/>'
    o += f'<rect x="{x + w * 0.55}" y="{y - h}" width="{w * 0.45}" height="{h}" rx="{h * 0.22:.1f}" fill="#d2c6aa"/>'
    for f_ in (0.25, 0.5, 0.75):
        o += f'<rect x="{x + w * f_ - 2:.1f}" y="{y - h}" width="4" height="{h}" fill="#7a6a52"/>'
    return o


def sack(x, y, w, h, col='#b49c72'):
    return (f'<path d="M{x},{y} Q{x - w * 0.08:.1f},{y - h * 0.5:.1f} {x + w * 0.15:.1f},{y - h} L{x + w * 0.85:.1f},{y - h} Q{x + w * 1.08:.1f},{y - h * 0.5:.1f} {x + w},{y} Z" fill="{col}"/>'
            f'<path d="M{x + w * 0.55:.1f},{y} Q{x + w * 1.08:.1f},{y - h * 0.5:.1f} {x + w * 0.85:.1f},{y - h} L{x + w * 0.65:.1f},{y - h} Z" fill="#000" opacity="0.15"/>')


# ================================================================ scenes
class Scene:
    """static: SVG; dyn(tq): SVG of what moves; groups: ids inside static that dyn fills, keyed to the returned dict"""
    def __init__(self, static, dyn):
        self.static, self.dyn = static, dyn


def scene_docks(prefix, t0=0.0):
    """An American wharf around 1890, piled with more than it can hold (copied from Flow c5_docks)."""
    o = sky()
    o += F.cloud2(320, 120, 820, 150, CLOUD, belly=BELLY, n=10) + F.cloud2(1560, 80, 760, 130, CLOUD, belly=BELLY, n=9)
    o += facets([(600, 600), (700, 520), (820, 470), (930, 500), (1050, 540), (1200, 560), (1200, 620), (600, 620)], FAR, hill_h(0.01, 40), cell=60, contrast=0.6)
    o += facets([(1180, 560), (1300, 470), (1420, 430), (1560, 470), (1700, 520), (2400, 540), (2400, 620), (1180, 620)], FAR, hill_h(0.01, 40), cell=60, contrast=0.6)
    o += f'<g id="{prefix}sea"></g>'
    # the warehouse, in perspective, receding from the left edge
    wall = [(-300, 1080), (-300, -40), (760, 430), (760, 760)]
    o += facets(wall, BRICK, hill_h(0.02, 20), cell=60, contrast=0.4, stroke=True)
    for i in range(26):                                        # brick courses converging to the vanishing point
        f_ = i / 26
        y_left = -40 + 1120 * f_
        y_right = 430 + 330 * f_
        o += f'<line x1="-300" y1="{y_left:.0f}" x2="760" y2="{y_right:.0f}" stroke="{BRICK[0]}" stroke-width="2" opacity="0.5"/>'
    rb = np.random.default_rng(9)
    for i in range(26):
        f0, f1 = i / 26, (i + 1) / 26
        off = 0.5 if i % 2 else 0.0
        for j in range(24):
            if rb.random() < 0.45:
                continue
            u0, u1 = (j + off) / 24, (j + off + 0.8) / 24
            def wpt(u, f_):
                x = -300 + 1060 * u ** 0.85
                yl, yr = -40 + 1120 * f_, 430 + 330 * f_
                return (x, yl + (yr - yl) * (x + 300) / 1060)
            q = [wpt(u0, f0 + 0.004), wpt(u1, f0 + 0.004), wpt(u1, f1 - 0.006), wpt(u0, f1 - 0.006)]
            o += poly(q, BRICK[int(rb.integers(0, 5))])
    o += poly([(-300, -40), (760, 430), (760, 412), (-300, -90)], '#3b3a35')            # the roof edge
    for (xa, xb) in ((-120, 90), (200, 360), (460, 570), (650, 720)):                  # the open doors
        ya_t, ya_b = -40 + (xa + 300) / 1060 * 470 + 120 * (1 - (xa + 300) / 1060), 1080 - (xa + 300) / 1060 * 320
        yb_t, yb_b = -40 + (xb + 300) / 1060 * 470 + 120 * (1 - (xb + 300) / 1060), 1080 - (xb + 300) / 1060 * 320
        o += poly([(xa, ya_b - 40), (xb, yb_b - 30), (xb, yb_t + 60), (xa, ya_t + 80)], '#2a1f19')
        o += poly([(xa, ya_t + 80), (xb, yb_t + 60), (xb, yb_t + 70), (xa, ya_t + 92)], BRICK[0])
    # the wharf deck
    o += poly([(-300, 1080), (760, 760), (2400, 760), (2400, 1400), (-300, 1400)], WOOD[2])
    for i in range(30):
        x = -300 + i * 110
        o += f'<line x1="{x}" y1="1400" x2="{760 + (x - 760) * 0.1:.0f}" y2="760" stroke="{WOOD[1]}" stroke-width="3" opacity="0.7"/>'
    # the steamship, moored on the right: low black hull with a raised bow, buff funnel, two masts
    sx, dy = 1250, 90
    for xm, ym in ((sx + 190, 150), (sx + 540, 110)):
        o += f'<line x1="{xm}" y1="{ym}" x2="{xm}" y2="{470 + dy}" stroke="#3a3530" stroke-width="7"/>'
        o += f'<line x1="{xm - 80}" y1="{ym + 60}" x2="{xm + 80}" y2="{ym + 60}" stroke="#3a3530" stroke-width="5"/>'
        for dx in (-170, -70, 70, 190):
            o += f'<line x1="{xm}" y1="{ym}" x2="{xm + dx}" y2="{455 + dy}" stroke="#4a443c" stroke-width="2"/>'
    o += poly([(sx + 330, 470 + dy), (sx + 330, 250 + dy), (sx + 392, 250 + dy), (sx + 392, 470 + dy)], '#d8c79a')
    o += poly([(sx + 362, 250 + dy), (sx + 392, 250 + dy), (sx + 392, 470 + dy), (sx + 362, 470 + dy)], '#c2b07f')
    o += poly([(sx + 330, 250 + dy), (sx + 392, 250 + dy), (sx + 392, 285 + dy), (sx + 330, 285 + dy)], '#2a2824')
    o += poly([(sx + 150, 470 + dy), (sx + 560, 470 + dy), (sx + 560, 410 + dy), (sx + 150, 410 + dy)], '#e2dbc6')
    o += poly([(sx + 380, 470 + dy), (sx + 560, 470 + dy), (sx + 560, 410 + dy), (sx + 380, 410 + dy)], '#cfc6ae')
    for x in range(sx + 170, sx + 550, 34):
        o += f'<rect x="{x}" y="{428 + dy}" width="14" height="14" fill="#3a3732"/>'
    hull = [(sx - 30, 430 + dy), (sx + 60, 465 + dy), (sx + 780, 470 + dy), (sx + 760, 600 + dy), (sx + 90, 610 + dy)]
    o += poly(hull, '#2c2a24') + poly([(sx + 400, 468 + dy), (sx + 780, 470 + dy), (sx + 760, 600 + dy), (sx + 400, 606 + dy)], '#24221d')
    o += poly([(sx + 90, 610 + dy), (sx + 760, 600 + dy), (sx + 754, 632 + dy), (sx + 100, 640 + dy)], '#8f3b2e')
    o += poly([(sx - 30, 430 + dy), (sx + 60, 465 + dy), (sx + 780, 470 + dy), (sx + 780, 482 + dy), (sx + 58, 478 + dy), (sx - 30, 444 + dy)], '#e2dbc6')
    o += f'<path d="M{sx + 60},{520 + dy} Q{sx - 100},{600 + dy} {sx - 250},{700 + dy}" fill="none" stroke="#c9b98f" stroke-width="5"/>'
    # cargo: crates, barrels, bales, sacks; far ones small, near ones big
    r = np.random.default_rng(3)
    for row, (yb, s, n, x0, x1) in enumerate([(760, 0.42, 9, 820, 1240), (820, 0.55, 8, 760, 1260), (900, 0.75, 7, 640, 1300)]):
        for k in range(n):
            x = x0 + (x1 - x0) * k / n + r.uniform(-15, 15)
            stack = int(r.integers(1, 4 - row))
            for j in range(stack):
                w = 150 * s * r.uniform(0.85, 1.15)
                o += crate(x, yb - j * 110 * s, w, 100 * s, int(r.integers(1, 4)), side=0.6)
    for x, y, s in ((560, 920, 0.9), (640, 930, 0.95), (720, 925, 0.9), (1000, 1000, 1.0), (1090, 1010, 1.05), (1180, 1000, 1.0)):
        o += barrel(x, y, 90 * s, 120 * s, 3)
    for x, y, w, h in ((1300, 930, 210, 120), (1340, 1030, 240, 140), (1560, 1050, 250, 150), (1500, 940, 200, 115), (1430, 830, 190, 110)):
        o += bale(x, y, w, h)
    for x, y in ((880, 1000), (940, 1010)):
        o += sack(x, y, 80, 100)
    o += crate(170, 1060, 200, 160, 2, side=0.5) + crate(240, 900, 150, 120, 3, side=0.5) + crate(-40, 1080, 180, 150, 1, side=0.5)
    o += f'<g id="{prefix}dyn"></g>'
    flock = [(400, 160, 22, 26, 0.0), (520, 210, 18, 18, 1.4), (1060, 230, 26, 22, 2.2), (1190, 270, 20, 14, 3.1)]
    sk = (('c3',))

    def dyn(tq):
        return {f'{prefix}sea': sea_bands(tq, 560, 760, 560, 2400, 6, [SEA[3], SEA[4], SEA[3], SEA[4]]),
                f'{prefix}dyn': gulls(tq, flock)}
    return Scene(o, dyn)


def scene_coaling(prefix):
    """A U.S. cruiser at a coaling station on a rocky Pacific island (copied from Flow c6_coaling_station)."""
    o = sky('#a9c1bb', '#cfd3bf', prefix + 'sk')
    o += F.cloud2(420, 120, 900, 170, CLOUD, belly=BELLY, n=10) + F.cloud2(1640, 170, 720, 160, CLOUD, belly=BELLY, n=9)
    o += f'<g id="{prefix}sea"></g>'
    # the island
    isl = [(1240, 1100), (1290, 940), (1420, 860), (1560, 700), (1640, 540), (1720, 460), (1800, 520), (1880, 640), (2000, 760), (2300, 900), (2300, 1100)]
    o += F.seam(facets(isl, ROCK, ridge_h(0.012, 80, 0.1), cell=70, contrast=1.1))
    o += facets([(1180, 1100), (1240, 980), (1380, 930), (1560, 950), (1700, 1010), (1760, 1100)], ROCK, ridge_h(0.02, 40, 0.1), cell=55, contrast=1.0)
    # coal heaps, the shed and the lighthouse
    for cx, cy, w, h in ((1400, 870, 150, 70), (1520, 885, 180, 85), (1650, 880, 150, 70), (1470, 905, 130, 55)):
        o += facets([(cx - w / 2, cy + 10), (cx - w * 0.2, cy - h * 0.8), (cx + w * 0.1, cy - h), (cx + w / 2, cy + 10)], COAL, ridge_h(0.05, 20, 0.1), cell=26, contrast=1.2)
    o += poly([(1600, 820), (1700, 820), (1700, 760), (1600, 760)], WOOD[2]) + poly([(1588, 765), (1650, 725), (1712, 765)], WOOD[1])
    o += f'<rect x="1640" y="785" width="22" height="35" fill="#2a2420"/>'
    lx, ly = 1440, 720
    o += poly([(lx - 22, ly), (lx + 22, ly), (lx + 15, ly - 120), (lx - 15, ly - 120)], IVORY[3]) + poly([(lx, ly), (lx + 22, ly), (lx + 15, ly - 120), (lx, ly - 120)], IVORY[1])
    o += poly([(lx - 22, ly - 120), (lx + 22, ly - 120), (lx + 22, ly - 128), (lx - 22, ly - 128)], '#3a3832')
    o += f'<rect x="{lx - 13}" y="{ly - 155}" width="26" height="27" fill="#e9d38f"/><path d="M{lx - 17},{ly - 155} L{lx},{ly - 175} L{lx + 17},{ly - 155} Z" fill="#3a3832"/>'
    # the pier on piles
    o += poly([(820, 846), (1410, 836), (1410, 852), (820, 864)], WOOD[3])
    for x in range(840, 1410, 70):
        o += f'<rect x="{x}" y="850" width="10" height="{80 - (x - 840) * 0.02:.0f}" fill="{WOOD[1]}"/>'
    o += poly([(820, 846), (1410, 836), (1410, 840), (820, 850)], WOOD[4])
    # the cruiser, side-on: white hull, red boot-topping, buff upperworks, two funnels, two masts
    hx = 160
    o += f'<line x1="{hx + 230}" y1="740" x2="{hx + 230}" y2="400" stroke="#6b5a40" stroke-width="9"/><line x1="{hx + 700}" y1="740" x2="{hx + 700}" y2="390" stroke="#6b5a40" stroke-width="9"/>'
    for xm, ym in ((hx + 230, 400), (hx + 700, 390)):
        o += f'<line x1="{xm - 45}" y1="{ym + 50}" x2="{xm + 45}" y2="{ym + 50}" stroke="#6b5a40" stroke-width="6"/>'
    o += poly([(hx + 180, 770), (hx + 820, 770), (hx + 800, 720), (hx + 210, 720)], '#d9cfae') + poly([(hx + 500, 770), (hx + 820, 770), (hx + 800, 720), (hx + 500, 720)], '#c4b993')
    for fx in (hx + 380, hx + 560):
        o += poly([(fx, 720), (fx + 56, 720), (fx + 52, 560), (fx + 4, 560)], '#d8c79a') + poly([(fx + 28, 720), (fx + 56, 720), (fx + 52, 560), (fx + 28, 560)], '#c2b07f')
        o += poly([(fx + 2, 560), (fx + 54, 560), (fx + 54, 535), (fx + 2, 535)], '#2a2824')
    o += poly([(hx - 60, 760), (hx + 1000, 750), (hx + 940, 860), (hx + 40, 870)], IVORY[3]) + poly([(hx + 470, 755), (hx + 1000, 750), (hx + 940, 860), (hx + 470, 866)], IVORY[2])
    o += poly([(hx + 40, 870), (hx + 940, 860), (hx + 930, 880), (hx + 52, 890)], '#8f3b2e')
    for x in range(hx + 80, hx + 900, 46):
        o += f'<circle cx="{x}" cy="{800 - (x - hx) * 0.008:.0f}" r="5" fill="#3a3832"/>'
    o += f'<g id="{prefix}dyn"></g>'

    def dyn(tq):
        s = (smoke(tq + 8, hx + 408, 530, rate=2.2, life=8.0, rise=24, wind=(-62, -12), size=52, cols=('#3f3d37', '#4f4c44', '#625e53'), seed_=1)
             + smoke(tq + 8.4, hx + 588, 530, rate=2.2, life=8.0, rise=24, wind=(-62, -12), size=52, cols=('#3f3d37', '#4f4c44', '#625e53'), seed_=2))
        ppl = ''
        for i, (x, y) in enumerate([(1420, 862), (1505, 875), (1595, 866)]):
            P = toil(tq, 'bend', 'haul', 1.5, i * 0.33)
            svg, _ = person(x, y, 70, 'bend', facing=-1, coat='#27324a', trousers='#27324a', skin=SKIN[i % 3], hair=HAIR[0], hat='cap',
                            hat_col='#1f2a3c', shadow=False, **P)
            ppl += svg
        for i, (x0, d) in enumerate([(1390, 0.0), (1460, 3.2)]):
            tt = (tq + d) % 9.0
            svg, J, x = walker(tt, x0, 840, 66, facing=-1, t0=0, t1=8.5, arms='shoulder', shadow=False, coat='#27324a', trousers='#27324a',
                               skin=SKIN[1], hair=HAIR[0], hat='cap', hat_col='#1f2a3c')
            ppl += svg + sack(J['shoulder'][0] - 10, J['shoulder'][1] + 2, 20, 22, '#2a2920')
        return {f'{prefix}sea': sea_bands(tq, 640, 1100, -600, 2520, 10), f'{prefix}dyn': s + ppl}
    return Scene(o, dyn)


def scene_church(prefix, t_arrive=0.0):
    """A white mission church in Hawaiʻi, 1880s, Sunday morning (copied from Flow c7_mission_church)."""
    o = sky()
    o += F.cloud2(300, 110, 800, 150, CLOUD, belly=BELLY, n=10) + F.cloud2(1560, 230, 700, 150, CLOUD, belly=BELLY, n=9)
    o += F.seam(facets([(-400, 900), (-400, 520), (0, 400), (200, 300), (420, 190), (560, 230), (700, 330), (900, 300), (1100, 360), (1300, 440),
                        (1500, 480), (1700, 420), (1900, 470), (2400, 520), (2400, 900)], MTN, ridge_h(0.005, 110, 0.12, namp=30), cell=110, contrast=1.0))
    o += poly([(-400, 1000), (-400, 800), (300, 790), (700, 810), (1300, 805), (1700, 790), (2400, 800), (2400, 1000)], TREE[1])
    o += facets([(-500, 905), (2500, 905), (2500, 1400), (-500, 1400)], LAWN, hill_h(0.003, 60), cell=170, contrast=0.35, bias=0.1)
    o += poly([(-500, 1000), (2500, 1000), (2500, 1014), (-500, 1014)], '#c8bb9c')
    o += poly([(895, 1000), (1025, 1000), (1120, 1400), (800, 1400)], '#c3b495')
    # the church: gabled meeting house, porch gable, tower and steeple
    cx = 960
    ch = []
    ch.append(poly([(cx - 270, 980), (cx + 270, 980), (cx + 270, 760), (cx - 270, 760)], IVORY[2]))
    for y in range(770, 980, 14):
        ch.append(f'<line x1="{cx - 270}" y1="{y}" x2="{cx + 270}" y2="{y}" stroke="{IVORY[0]}" stroke-width="2" opacity="0.6"/>')
    ch.append(poly([(cx - 300, 768), (cx, 610), (cx + 300, 768)], IVORY[3]) + poly([(cx, 610), (cx + 300, 768), (cx + 255, 768), (cx, 638)], IVORY[1]))
    ch.append(poly([(cx - 110, 980), (cx + 110, 980), (cx + 110, 790), (cx - 110, 790)], IVORY[3]))
    ch.append(poly([(cx - 130, 796), (cx, 720), (cx + 130, 796)], IVORY[2]))
    ch.append(poly([(cx - 70, 720), (cx + 70, 720), (cx + 70, 560), (cx - 70, 560)], IVORY[3]) + poly([(cx, 720), (cx + 70, 720), (cx + 70, 560), (cx, 560)], IVORY[1]))
    ch.append(poly([(cx - 80, 560), (cx + 80, 560), (cx + 80, 548), (cx - 80, 548)], IVORY[2]))
    ch.append(poly([(cx - 52, 548), (cx + 52, 548), (cx + 52, 470), (cx - 52, 470)], IVORY[3]))
    ch.append(f'<path d="M{cx - 18},540 V500 A18,18 0 0 1 {cx + 18},500 V540 Z" fill="#4a4c48"/>')
    ch.append(poly([(cx - 58, 470), (cx, 330), (cx + 58, 470)], IVORY[2]) + poly([(cx, 330), (cx + 58, 470), (cx, 470)], IVORY[0]))
    ch.append(f'<line x1="{cx}" y1="330" x2="{cx}" y2="300" stroke="#6a6458" stroke-width="4"/>')
    for x in (cx - 210, cx - 160, cx + 160, cx + 210):
        ch.append(poly([(x - 18, 940), (x + 18, 940), (x + 18, 830), (x - 18, 830)], '#5a6260') + f'<line x1="{x}" y1="830" x2="{x}" y2="940" stroke="{IVORY[3]}" stroke-width="3"/>')
    ch.append(poly([(cx - 34, 980), (cx + 34, 980), (cx + 34, 870), (cx - 34, 870)], '#4a3a2c') + f'<rect x="{cx - 2}" y="870" width="4" height="110" fill="#3a2c22"/>')
    ch.append(poly([(cx - 52, 850), (cx + 52, 850), (cx + 52, 812), (cx - 52, 812)], '#5a6260'))
    for k in range(5):
        ch.append(f'<rect x="{cx - 150 - k * 12}" y="{980 + k * 5}" width="{300 + k * 24}" height="6" fill="{IVORY[2] if k % 2 else IVORY[1]}"/>')
    o += F.seam(''.join(ch))
    o += f'<g id="{prefix}dyn"></g>'
    PSP = palm_specs([(70, 1040, 110, 340, 260, 9, 11, False), (210, 980, 205, 640, 120, 12, 12, True), (1700, 960, 1705, 650, 110, 12, 13, True),
                      (1880, 1050, 1840, 330, 270, 9, 14, False)])
    TSP = tree_specs([(560, 1000, 230, 260, 21), (1360, 1000, 230, 260, 22)])
    LOOKS = [dict(coat='#e8e0cc', dress=True, skin=SKIN[3], hair=HAIR[3], hat='bonnet', hat_col='#f1ead8'),
             dict(coat='#2f2c28', coat_len=1.3, trousers='#2b2a28', skin=SKIN[3], hair=HAIR[3]),
             dict(coat='#d98b8c', dress=True, skin=SKIN[1], hair=HAIR[3]),
             dict(coat='#3c4a3d', coat_len=1.2, trousers='#2f2c28', skin=SKIN[0], hair=HAIR[4], hat='top', beard=True),
             dict(coat='#f1ead8', dress=True, skin=SKIN[0], hair=HAIR[1], hat='bonnet', hat_col='#e3d9c2'),
             dict(coat='#4f5d6a', coat_len=0.5, trousers='#3a3a34', skin=SKIN[3], hair=HAIR[0])]
    sched = [(-80, 1046, 200, 1, 0.0, 6.0), (-260, 1052, 190, 1, 0.5, 7.4), (-460, 1048, 120, 1, 0.9, 8.6),
             (2000, 1046, 200, -1, 0.2, 6.2), (2200, 1050, 195, -1, 0.7, 7.0), (2420, 1044, 185, -1, 1.1, 7.6)]

    def dyn(tq):
        s = trees(tq, TSP)
        for i, (x0, y, h, f, d, walk) in enumerate(sched):
            svg, J, x = walker(tq, x0, y, h, facing=f, t0=t_arrive + d, t1=t_arrive + d + walk, phase=0.2 * i, **LOOKS[i])
            s += svg
        return {f'{prefix}dyn': s + palms(tq, PSP)}
    return Scene(o, dyn)
