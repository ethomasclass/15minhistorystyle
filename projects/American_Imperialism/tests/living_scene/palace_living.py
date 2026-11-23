# Living-scene test: ʻIolani Palace redrawn entirely in code, copying the Google Flow plate (p4_palace) for layout,
# proportions and colours. Every element is its own object: sky, three cloud banks that drift, two mountain ranges and a
# treeline at different depths (parallax), the palace in vector (sharp at any zoom), a flag that waves, palms whose
# fronds each sway, and people: the marching landing party and townspeople from the movement test, plus the Admiral
# copied from the Flow figure and drawn with the same rig. 16 s: a wide drift, then a deep push into the tower window.
import os, sys, math
import numpy as np
TESTDIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(TESTDIR, '..', '..', 'ep1', 'tools'))
from ep import *                                                          # noqa
from people import person, gait, react, SKIN, HAIR, tint, PERIOD, A as STRIDE, DUTY   # noqa
import facet as F                                                         # noqa  (path set by people)
from facet import facets, poly, ridge_h, hill_h, seed                     # noqa

DUR = 16.0
S = EpStage('test_living_palace', DUR, bg='#c0c9b8', grain=0.5)
S.dir = os.path.join(TESTDIR, "build")
os.makedirs(S.dir, exist_ok=True)
S.defs.append(COMMON_DEFS)
S.defs.append(F.GRAIN)
S.defs.append('<filter id="flatshadow"><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter>')
seed(11)

# ---- colours sampled from the Flow plate
SKY_T, SKY_B = '#b8c5b8', '#cdd0bf'
CLOUD, BELLY = '#e6d6ad', '#cfb88c'
MTN = ['#55634f', '#5f6e59', '#6b7a62', '#748265', '#838e73', '#93a083']
FAR = ['#66745a', '#727f63', '#7f8b6d', '#8d987b']
TREE = ['#3a4630', '#404d35', '#4b5a3d']
LAWN = ['#7d8245', '#878b4b', '#8f9150', '#9a9b58']
PATH, STRIP = '#c3b495', '#c8bb9c'
STONE = ['#b3a78c', '#c9bea2', '#d6cbaf', '#ddd4ba', '#e6dfc8']
DARK, DARK2 = '#2e2d27', '#24231f'
SLATE = ['#4b535c', '#5d6670', '#6e7882', '#828b93']
BAL = '#8f977d'
PALM = ['#414e32', '#4f5936', '#5f6b3a', '#6f7a42', '#7f8a4c']
TRUNK = ['#53402c', '#664d34']

# ================================================================ static layers
sky = (f'<linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{SKY_T}"/><stop offset="1" stop-color="{SKY_B}"/></linearGradient>'
       f'<rect x="-1500" y="-900" width="4920" height="2400" fill="url(#skyg)"/>')
clouds = [F.cloud2(330, 92, 900, 160, CLOUD, belly=BELLY, n=10), F.cloud2(1590, 250, 780, 190, CLOUD, belly=BELLY, n=9),
          F.cloud2(1290, 120, 330, 70, '#e9dcb8', belly='#d8c69c', n=6)]
far = F.seam(facets([(1300, 1000), (1300, 600), (1420, 545), (1600, 488), (1720, 530), (1850, 545), (2000, 575), (2600, 610), (2600, 1000)],
                    FAR, ridge_h(0.006, 70, 0.1), cell=100, contrast=0.9))
far += facets([(-700, 1000), (-700, 600), (-300, 560), (0, 520), (120, 470), (230, 520), (400, 600), (400, 1000)], FAR, ridge_h(0.008, 60, 0.1),
              cell=90, contrast=0.8)
mtn = F.seam(facets([(-500, 1000), (-500, 640), (0, 545), (180, 432), (330, 320), (583, 187), (700, 262), (860, 335), (1010, 395), (1180, 452),
                     (1360, 540), (1460, 1000)], MTN, ridge_h(0.0045, 120, 0.12, namp=30), cell=120, contrast=1.1))
tree = F.seam(poly([(-600, 1000), (-600, 760), (-200, 745), (30, 760), (200, 742), (330, 760), (420, 790), (1500, 790), (1580, 700), (1700, 712),
                    (1820, 690), (1960, 705), (2500, 700), (2500, 1000)], TREE[1]))
tree += poly([(-600, 1000), (-600, 830), (400, 840), (1520, 840), (2500, 830), (2500, 1000)], TREE[0])

# ---- the ground
GY = 928
lawn = facets([(-700, 935), (2620, 935), (2620, 1500), (-700, 1500)], LAWN, hill_h(0.003, 60), cell=170, contrast=0.35, bias=0.1)
lawn += poly([(-700, 938), (2620, 938), (2620, 956), (-700, 956)], STRIP)
lawn += poly([(822, 945), (1102, 945), (1210, 1500), (712, 1500)], PATH)
lawn += poly([(822, 945), (845, 945), (735, 1500), (712, 1500)], '#b3a586')

# ---- the palace (front elevation, measured off the Flow plate)
pal = []


def bays(x0, x1, y_top, y_arch, y_bal, y_bot, n=5):
    o = poly([(x0, y_top), (x1, y_top), (x1, y_bot), (x0, y_bot)], DARK)
    bw = (x1 - x0) / n
    for k in range(n):
        x = x0 + k * bw
        r = bw / 2 - 9
        o += f'<path d="M{x + 9:.1f},{y_bal} V{y_arch + r:.1f} A{r:.1f},{r:.1f} 0 0 1 {x + bw - 9:.1f},{y_arch + r:.1f} V{y_bal} Z" fill="{DARK2}"/>'
        o += f'<rect x="{x + bw * 0.32:.1f}" y="{y_arch + r + 14:.1f}" width="{bw * 0.36:.1f}" height="{y_bal - y_arch - r - 14:.1f}" fill="#1b1a17" opacity="0.7"/>'
        if k:
            o += f'<rect x="{x - 4:.1f}" y="{y_top + 8}" width="8" height="{y_bot - y_top - 8}" fill="{STONE[4]}"/>'
    o += f'<rect x="{x0}" y="{y_bal}" width="{x1 - x0}" height="5" fill="{STONE[4]}"/>'
    for x in np.arange(x0 + 6, x1 - 4, 11):
        o += f'<rect x="{x:.1f}" y="{y_bal + 5}" width="5" height="{y_bot - y_bal - 13}" fill="{STONE[3]}"/>'
    o += f'<rect x="{x0}" y="{y_bot - 8}" width="{x1 - x0}" height="8" fill="{STONE[4]}"/>'
    return o


def wing(x0, x1):
    o = facets([(x0, 446), (x1, 446), (x1, 845), (x0, 845)], STONE[1:], hill_h(0.01, 25), cell=80, contrast=0.3, bias=0.1)
    o += poly([(x0 - 2, 446), (x1 + 2, 446), (x1 + 2, 457), (x0 - 2, 457)], STONE[4])
    for x in np.arange(x0 + 8, x1 - 6, 15):
        o += f'<rect x="{x:.1f}" y="457" width="8" height="24" rx="2" fill="{BAL}"/>'
    o += poly([(x0, 481), (x1, 481), (x1, 492), (x0, 492)], STONE[4])
    o += bays(x0, x1, 512, 532, 630, 682)
    o += poly([(x0, 680), (x1, 680), (x1, 692), (x0, 692)], STONE[3])
    o += bays(x0, x1, 692, 702, 805, 845)
    return o


def tower(x0, x1, top, roof_top, cx_circle, r_circle, body_col=STONE):
    o = facets([(x0, top), (x1, top), (x1, 845), (x0, 845)], body_col[2:], hill_h(0.02, 18), cell=60, contrast=0.35, bias=0.15)
    for y in range(top + 26, 845, 38):
        o += f'<rect x="{x0}" y="{y}" width="12" height="7" fill="{STONE[1]}"/><rect x="{x1 - 12}" y="{y}" width="12" height="7" fill="{STONE[1]}"/>'
    o += poly([(x0 - 10, top - 14), (x1 + 10, top - 14), (x1 + 10, top + 4), (x0 - 10, top + 4)], STONE[4])
    rt0, rt1 = x0 + 0.13 * (x1 - x0), x1 - 0.13 * (x1 - x0)
    roof = [(x0 - 3, top - 14), (x1 + 3, top - 14), (rt1, roof_top), (rt0, roof_top)]
    o += facets(roof, SLATE, ridge_h(0.05, 30, 0.1), cell=36, contrast=0.9)
    o += poly([(rt0 - 2, roof_top), (rt1 + 2, roof_top), (rt1 + 2, roof_top - 7), (rt0 - 2, roof_top - 7)], STONE[3])
    for x in np.arange(rt0 + 3, rt1 - 1, 8):
        o += f'<rect x="{x:.1f}" y="{roof_top - 27}" width="3" height="20" fill="#3a3832"/>'
    o += f'<rect x="{rt0}" y="{roof_top - 29}" width="{rt1 - rt0}" height="3" fill="#3a3832"/>'
    o += f'<circle cx="{cx_circle}" cy="{(top - 14 + roof_top) / 2:.0f}" r="{r_circle}" fill="{STONE[3]}" stroke="#34322d" stroke-width="3.5"/>'
    return o


pal.append(poly([(361, 843), (1564, 843), (1564, GY), (361, GY)], STONE[0]))           # raised basement
pal.append(poly([(361, 843), (1564, 843), (1564, 853), (361, 853)], STONE[2]))
for x in list(np.linspace(430, 790, 6)) + list(np.linspace(1115, 1475, 6)):
    pal.append(f'<path d="M{x - 16:.0f},{GY - 4} V888 A16,16 0 0 1 {x + 16:.0f},888 V{GY - 4} Z" fill="#8f8670"/>')
pal.append(wing(518, 868))
pal.append(wing(1058, 1408))
pal.append(tower(373, 523, 432, 345, 448, 14))
pal.append(tower(1402, 1552, 432, 345, 1477, 14))
pal.append(tower(863, 1064, 384, 275, 962, 21))
for x in (906, 962, 1016):                                                             # the tower's three upper windows
    pal.append(f'<path d="M{x - 12},{458} V{422} A12,12 0 0 1 {x + 12},{422} V{458} Z" fill="{STONE[4]}"/>')
    pal.append(f'<path d="M{x - 9},{455} V{424} A9,9 0 0 1 {x + 9},{424} V{455} Z" fill="#33322c"/>')
    pal.append(f'<rect x="{x - 1}" y="416" width="2" height="39" fill="{STONE[3]}" opacity="0.8"/>')
pal.append(f'<path d="M905,668 V598 A57,57 0 0 1 1019,598 V668 Z" fill="{DARK}"/>')
pal.append(f'<rect x="898" y="666" width="128" height="9" fill="{STONE[4]}"/><rect x="905" y="675" width="114" height="8" fill="#3a3832"/>')
pal.append(f'<path d="M925,845 V758 A37,37 0 0 1 999,758 V845 Z" fill="{DARK2}"/>')
for k in range(12):                                                                    # the grand staircase
    y = 846 + k * 8
    w = 238 + k * 4
    pal.append(f'<rect x="{962 - w / 2:.0f}" y="{y}" width="{w}" height="8" fill="{STONE[2] if k % 2 else STONE[1]}"/>')
pal.append(poly([(836, 843), (850, 843), (840, 944), (824, 944)], STONE[3]))
pal.append(poly([(1074, 843), (1088, 843), (1100, 944), (1084, 944)], STONE[3]))
pal.append(f'<line x1="962" y1="250" x2="962" y2="30" stroke="#2c2a26" stroke-width="5"/><circle cx="962" cy="28" r="5" fill="#2c2a26"/>')

for gid, body in (('SKY', sky), ('CL0', clouds[0]), ('CL1', clouds[1]), ('CL2', clouds[2]), ('FAR', far), ('MTN', mtn), ('TREE', tree),
                  ('MAIN', lawn + ''.join(pal) + '<g id="flag"></g><g id="people"></g>'), ('PALMS', '<g id="palms"></g>')):
    S.world.append(f'<g id="{gid}">{body}</g>')
DEPTH = {'SKY': 0.12, 'CL0': 0.25, 'CL1': 0.3, 'CL2': 0.28, 'FAR': 0.5, 'MTN': 0.68, 'TREE': 0.85, 'MAIN': 1.0, 'PALMS': 1.05}
DRIFT = {'CL0': 9.0, 'CL1': 6.0, 'CL2': 12.0}


# ================================================================ things that move
def flag(tq):
    """the Hawaiian flag: eight stripes (white, red, blue from the top) and the Union in the canton, waving"""
    x0, y0, Wf, Hf = 966, 34, 142, 100
    def P(u, v):
        a = 7 * u ** 1.2
        y = y0 + v * Hf + a * math.sin(2 * math.pi * (1.3 * u - 0.9 * tq)) - 2 * u
        x = x0 + u * Wf * (1 - 0.04 * math.cos(2 * math.pi * (1.3 * u - 0.9 * tq)) * u)
        return x, y
    def band(u0, u1, v0, v1, col, n=14):
        top = [P(u0 + (u1 - u0) * i / n, v0) for i in range(n + 1)]
        bot = [P(u0 + (u1 - u0) * i / n, v1) for i in reversed(range(n + 1))]
        return f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in top + bot)}" fill="{col}"/>'
    def line(pts_uv, col, w):
        return f'<polyline points="{" ".join("%.1f,%.1f" % P(u, v) for u, v in pts_uv)}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="butt"/>'
    o = ''
    for i, col in enumerate(['#ece4d0', '#a8322c', '#2c3f73'] * 3):
        if i < 8:
            o += band(0, 1, i / 8, (i + 1) / 8, col)
    cu, cv = 0.42, 0.5
    o += band(0, cu, 0, cv, '#2c3f73', 8)
    seg = lambda a, b: [(a[0] + (b[0] - a[0]) * k / 6, a[1] + (b[1] - a[1]) * k / 6) for k in range(7)]
    for a_, b_ in (((0, 0), (cu, cv)), ((0, cv), (cu, 0))):
        o += line(seg(a_, b_), '#ece4d0', 5) + line(seg(a_, b_), '#a8322c', 1.8)
    o += line(seg((cu / 2, 0), (cu / 2, cv)), '#ece4d0', 8) + line(seg((0, cv / 2), (cu, cv / 2)), '#ece4d0', 8)
    o += line(seg((cu / 2, 0), (cu / 2, cv)), '#a8322c', 4) + line(seg((0, cv / 2), (cu, cv / 2)), '#a8322c', 4)
    for i in range(10):                                                                # light and shade on the folds
        u0, u1 = i / 10, (i + 1) / 10
        d = math.cos(2 * math.pi * (1.3 * (u0 + u1) / 2 - 0.9 * tq))
        o += band(u0, u1, 0, 1, '#000' if d > 0 else '#fff', 3).replace('/>', f' opacity="{abs(d) * 0.12:.3f}"/>')
    return o


PALMS = [  # base x, base y, crown x, crown y, frond length, fronds, seed, fan (small palms are rounder)
    (22, 1030, 52, 250, 300, 9, 1, False), (100, 902, 98, 648, 110, 12, 2, True), (266, 902, 270, 582, 132, 12, 3, True),
    (1898, 1030, 1874, 318, 310, 9, 4, False), (1668, 914, 1673, 612, 122, 12, 5, True), (1851, 902, 1852, 650, 96, 10, 6, True)]
PRNG = {p[6]: np.random.default_rng(p[6]) for p in PALMS}
PSPEC = {}
for p in PALMS:
    r = PRNG[p[6]]
    n = p[5]
    if p[7]:
        angs = np.linspace(-185, 5, n) + r.uniform(-8, 8, n)
    else:
        angs = np.array([-200, -175, -150, -128, -100, -70, -45, -22, 5][:n]) + r.uniform(-6, 6, n)
    PSPEC[p[6]] = [(a, p[4] * r.uniform(0.8, 1.1), r.uniform(0, 6.28), r.integers(0, 3)) for a in angs]


def frond(cx, cy, ang, L, droop, wmax, cols):
    """a faceted frond: a drooping spine with shard-like leaflets, light on the upper side and dark below"""
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
    f = lambda q: ' '.join(f'{x:.1f},{y:.1f}' for x, y in q)
    return (f'<polygon points="{f(sp + up[::-1])}" fill="{cols[1]}"/><polygon points="{f(sp + dn[::-1])}" fill="{cols[0]}"/>'
            f'<polyline points="{f(sp)}" fill="none" stroke="{cols[0]}" stroke-width="2"/>')


def palms(tq):
    o = ''
    for bx, by, cx, cy, L, n, sd, fan in PALMS:
        h = by - cy
        gust = 0.6 + 0.4 * math.sin(tq * 0.35 + sd)
        sway = math.sin(tq * 1.1 + sd * 1.7) * gust
        ccx = cx + sway * h * 0.012
        mx, my = (bx + ccx) / 2 + (cx - bx) * 0.3, (by + cy) / 2
        segs = 14
        left, right = [], []
        for i in range(segs + 1):
            s = i / segs
            x = (1 - s) ** 2 * bx + 2 * (1 - s) * s * mx + s * s * ccx
            y = (1 - s) ** 2 * by + 2 * (1 - s) * s * my + s * s * cy
            w = (h * 0.024 + 3) * (1 - 0.45 * s)
            left.append((x - w, y)); right.append((x + w, y))
        tr = left + right[::-1]
        o += f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in tr)}" fill="{TRUNK[1]}"/>'
        o += f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in right + [(p[0] - (p[0] - q[0]) * 0.5, p[1]) for p, q in zip(right[::-1], left[::-1])])}" fill="{TRUNK[0]}" opacity="0.6"/>'
        spec = PSPEC[sd]
        order = sorted(range(len(spec)), key=lambda i: -abs(spec[i][0] + 90))         # back fronds first
        for i in order:
            a, Lf, ph, c = spec[i]
            wob = (5 + 4 * gust) * math.sin(tq * 1.6 + ph) + sway * 6
            droop = (0.25 if fan else 0.55) + 0.06 * math.sin(tq * 1.3 + ph)
            cols = (PALM[c], PALM[c + 2]) if a < -90 or a > -60 else (PALM[c + 1], PALM[c + 2])
            o += frond(ccx, cy, a + wob, Lf, droop, Lf * (0.11 if fan else 0.1), cols)
        o += f'<circle cx="{ccx:.1f}" cy="{cy:.1f}" r="{L * 0.05 + 3:.1f}" fill="{PALM[0]}"/>'
    return o


# ---- people: the landing party and townspeople (as in the movement test), and the Admiral
MH = 168
V = 2 * STRIDE * (MH / 8) / (DUTY * PERIOD)
NAVY, TAN = '#27324a', '#b79a68'
rng = np.random.default_rng(8)
men = []
for rank, (y, dk) in enumerate(((952, -0.12), (976, 0.0))):
    for i in range(7):
        men.append(dict(x0=150 - i * 104 - rank * 34, y=y, dk=dk, h=MH * (1 + rng.uniform(-0.025, 0.025)), skin=SKIN[int(rng.integers(0, 3))],
                        hair=HAIR[int(rng.integers(0, 4))], rank=rank))
men.sort(key=lambda m: (m['rank'], -m['x0']))
LEAD_X0 = 300


def shouldered(J):
    u = J['u']; hx, hy = J['hand_b']; sx, sy = J['shoulder']
    tip = (sx - 0.35 * u, sy - 1.9 * u)
    dx, dy = tip[0] - hx, tip[1] - hy
    n = math.hypot(dx, dy)
    bx, by = hx - dx / n * 0.45 * u, hy - dy / n * 0.45 * u
    return (f'<line x1="{bx:.1f}" y1="{by:.1f}" x2="{tip[0]:.1f}" y2="{tip[1]:.1f}" stroke="#2b2622" stroke-width="{0.1 * u:.1f}" stroke-linecap="round"/>'
            f'<line x1="{bx:.1f}" y1="{by:.1f}" x2="{hx + dx * 0.5:.1f}" y2="{hy + dy * 0.5:.1f}" stroke="#5a4532" stroke-width="{0.22 * u:.1f}" stroke-linecap="round"/>'
            f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="{0.2 * u:.1f}" fill="#d9b38f"/>')


FOLK = [(770, 930, 146, 'stand', 'shade', dict(coat='#8a3b33', dress=True, hair=HAIR[3], skin=SKIN[1], hat='straw', hat_col='#d9c79a'), 0.0),
        (838, 934, 150, 'ease', 'point', dict(coat='#d8cfba', coat_len=0.5, trousers='#5a5346', hair=HAIR[3], skin=SKIN[3], hat='straw', hat_col='#cdb98a'), 0.5),
        (1350, 932, 150, 'hips', 'stand', dict(coat='#3c4a3d', coat_len=1.2, trousers='#2f2c28', hair=HAIR[4], skin=SKIN[0], hat='bowler', beard=True), 0.2),
        (1420, 930, 144, 'stand', 'shade', dict(coat='#e3d9c2', dress=True, hair=HAIR[3], skin=SKIN[3]), 0.7),
        (1680, 934, 150, 'ease', 'hips', dict(coat='#6f5a3d', coat_len=0.6, trousers='#3d382f', hair=HAIR[0], skin=SKIN[1], hat='slouch', hat_col='#5b4a36'), 0.4)]
from people import mix                                                                 # noqa


def people(tq):
    o = ''
    lead = LEAD_X0 + V * tq
    for i, (x, y, h, p0, p1, look, dly) in enumerate(FOLK):
        P = react(tq, (x - 330 - LEAD_X0) / V + dly, p0, p1)
        P['lean'] += 0.9 * math.sin(tq * 1.9 + i * 1.7)
        P['head'] += 2.5 * math.sin(tq * 0.8 + i)
        facing = -1 if lead < x + 20 else 1
        turning = abs(lead - (x + 20)) < V / 12 * 1.5
        svg, _ = person(x, y, h, p0, facing=facing, view='front' if turning else 'side', **look, **P)
        o += svg
    ph = (tq / PERIOD) % 1
    P = gait(ph)
    P['arm_b'], P['elbow_b'] = 6, 34
    for m in men:
        x = m['x0'] + V * tq
        if x < -200 or x > 2120:
            continue
        c = tint(NAVY, m['dk'])
        svg, J = person(x, m['y'], m['h'], 'walk', facing=1, coat=c, coat_len=0.25, trousers=c, boots=tint(TAN, m['dk']), skin=m['skin'],
                        hair=m['hair'], hat='cap', hat_col=tint('#1f2a3c', m['dk']), collar='#c9d4dd', belt=tint(TAN, -0.1), **P)
        o += svg + shouldered(J)
    svg, J = person(lead, 964, MH * 1.03, 'walk', facing=1, coat='#1f2a3c', coat_len=1.5, trousers='#e9e1cf', skin=SKIN[0], hair=HAIR[1],
                    hat='kepi', hat_col='#1f2a3c', beard=True, belt='#c9a648', **gait(ph, swing=30))
    o += svg
    # the Admiral, copied from the Flow figure: long navy frock coat, navy trousers, peaked cap. Walks in, stops, points.
    AH, AY, AT0, AT1 = 330, 1062, 0.6, 6.4
    av = 2 * STRIDE * (AH / 8) / (DUTY * PERIOD)
    ax = -160 + av * (min(tq, AT1) - AT0) if tq > AT0 else -160
    look = dict(coat='#1f2a44', coat_len=2.0, trousers='#1f2a44', boots='#15171c', skin=SKIN[0], hair=HAIR[1], hat='cap', hat_col='#1b2333',
                collar='#e8e2d4', sleeves='#1f2a44')
    if AT0 < tq < AT1:
        svg, _ = person(ax, AY, AH, 'walk', facing=1, **look, **gait(((tq - AT0) / PERIOD) % 1, swing=22))
    else:
        P = react(tq, AT1 + 0.5, 'stand', 'point', 0.6)
        P['lean'] += 0.6 * math.sin(tq * 1.7)
        svg, _ = person(ax, AY, AH, 'stand', facing=1, **look, **P)
    return o + svg


# ================================================================ camera, with each layer at its own depth
cam = Camera([(0, 900, 560, 1.04), (9.0, 1010, 585, 1.15), (10.6, 985, 540, 1.55), (14.4, 962, 438, 7.2), (DUR, 962, 438, 7.8)], wobble=0.8)
S.sounds.append(['forest_birds', 0.0, 0.35, 0.8, 0.8, DUR])
for k in range(int(9.5 / (PERIOD / 2))):
    S.sound('dry-thud', k * PERIOD / 2 + 0.02, 0.08)


def frame(t):
    tq = step12(t)
    x, y, z, r = cam.at(t)
    T = {}
    for gid, p in DEPTH.items():
        zl = z ** p
        xl, yl = 960 + (x - 960) * p, 540 + (y - 540) * p
        if gid in DRIFT:
            xl -= DRIFT[gid] * tq
        T[gid] = f'translate(960 540) rotate({r * p:.3f}) scale({zl:.5f}) translate({-xl:.2f} {-yl:.2f})'
    h = {'flag': flag(tq), 'palms': palms(tq), 'people': people(tq) if z < 2.5 else ''}
    return {'t': T, 'h': h}


if __name__ == '__main__':
    S.write(frame)
