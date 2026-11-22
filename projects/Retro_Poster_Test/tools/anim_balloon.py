# Animated test of the balloon scene: 12 s, 30 fps. Depth planes under a slow push-in camera; the crew heave on the
# ropes, the balloon bobs, a guard walks up, the flag waves, smoke rises, and the title types on.
#   python3 tools/anim_balloon.py            -> build/anim/{L_*.svg, base.html, frames.ndjson, events.json}
# Static layers are rendered once (tools/anim_render.mjs); everything that moves is regenerated per frame.
# Rule 3 of the channel: figures and marks step at 12 drawings a second, the camera and the balloon glide.
import json, math, os, sys
import numpy as np
from facet import *
from figures import *
from trees import scene_tree

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'build', 'anim')
os.makedirs(OUT, exist_ok=True)
FPS, DUR = 30, 12.0
N = int(FPS * DUR)
MX, MY = 200, 110                      # overscan round every layer, so the camera never shows an edge
LW, LH = W + 2 * MX, H + 2 * MY
BLUE, LTBLUE, KEPI = PAL['blue'], '#6f8194', '#39485a'
seed(11)


def layer(name, body):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{LW}" height="{LH}" viewBox="{-MX} {-MY} {LW} {LH}">'
           f'<defs>{GRAIN}</defs>{body}</svg>')
    open(os.path.join(OUT, f'L_{name}.svg'), 'w').write(svg)
    return f'<image href="L_{name}.png" x="{-MX}" y="{-MY}" width="{LW}" height="{LH}"/>'


# ================================================================== static layers
X0, X1 = -MX - 60, W + MX + 60
B = [f'<defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{PAL["sky"]}"/>'
     f'<stop offset="1" stop-color="#c3cfc6"/></linearGradient></defs>'
     f'<rect x="{X0}" y="{-MY - 20}" width="{X1 - X0}" height="{700 + MY + 20}" fill="url(#skyg)"/>'
     f'<rect x="{X0}" y="680" width="{X1 - X0}" height="{H}" fill="#c3cfc6"/>']
IM_SKY = layer('sky', ''.join(B))

B = [cloud2(420, 330, 1100, 300, PAL['cream'], belly='#e2d3ac', n=10), cloud2(250, 120, 900, 260, PAL['cream'], n=8),
     cloud2(1650, 470, 700, 170, PAL['sky2'], belly='#a9bab6', n=8), cloud2(1500, 220, 520, 120, PAL['cream2'], belly='#d8c79d', n=7),
     cloud2(-260, 500, 420, 110, PAL['sky2'], n=6)]
IM_CLOUDS = layer('clouds', ''.join(B))

B = []
for y, amp, col, sv in [(560, 70, PAL['mist1'], 1.3), (600, 60, PAL['mist2'], 4.1), (648, 46, PAL['mist3'], 7.7)]:
    R = ridgeline(X0, X1, y, amp, 70, sv)
    R[0], R[-1] = (X0, H + MY + 20), (R[-1][0], H + MY + 20)
    B.append(seam(facets(R, tones(col, 4, 0.07), hill_h(0.006, 120), cell=85, contrast=0.9)))
    B.append(mist(y + 46, 70, op=0.42))
IM_RIDGES = layer('ridges', ''.join(B))


def tent(x, y, s):
    return (poly([(x + s * .9, y), (x + s * 2.0, y + s * .22), (x, y)], '#1f2a38', 'opacity="0.16"')
            + poly([(x, y - s), (x - s * .9, y), (x, y)], PAL['cream'])
            + poly([(x, y - s), (x + s * .9, y), (x, y)], '#d9c9a0')
            + poly([(x, y - s), (x + s * .15, y), (x - s * .15, y)], PAL['ink2']))


def wagon(x, y, s=1.0):
    o = poly([(x - 26 * s, y - 12 * s), (x + 26 * s, y - 12 * s), (x + 24 * s, y - 4 * s), (x - 24 * s, y - 4 * s)], PAL['trunk'])
    o += poly([(x - 25 * s, y - 12 * s), (x - 20 * s, y - 32 * s), (x + 20 * s, y - 32 * s), (x + 25 * s, y - 12 * s)], PAL['cream'])
    o += poly([(x, y - 32 * s), (x + 20 * s, y - 32 * s), (x + 25 * s, y - 12 * s), (x + 2 * s, y - 12 * s)], '#d9c9a0')
    for wx in (-15, 15):
        o += f'<circle cx="{x + wx * s}" cy="{y - 3 * s}" r="{7 * s}" fill="none" stroke="{PAL["ink"]}" stroke-width="{2.4 * s}"/>'
    return o


B = []
valley = [(X0, 655), (X1, 640), (X1, H + MY + 20), (X0, H + MY + 20)]
B.append(seam(facets(valley, PAL['olive_lt'], hill_h(0.003, 90, (0, 0.05)), cell=170, contrast=0.38, bias=0.1)))
for i in range(9):
    x0 = -180 + i * 270 + rng.random() * 60
    B.append(poly([(x0, 668), (x0 + 150, 664), (x0 + 190, 678), (x0 + 20, 683)], PAL['olive'][2 + i % 2], 'opacity="0.55"'))
B.append(f'<path d="M150,1250 C380,1000 560,900 690,820 S860,720 1010,676" stroke="{PAL["cream2"]}" stroke-width="26" fill="none" stroke-linecap="round" opacity="0.9"/>')
for row, (y, s, n) in enumerate([(700, 15, 34), (738, 19, 28), (786, 25, 22)]):
    for i in range(n):
        x = -160 + i * (2100 / n) + (row * 31 % 40) + (rng.random() - .5) * 18
        if (640 < x < 760 and row > 0) or (1120 < x and row == 2):
            continue
        B.append(tent(x, y + (rng.random() - .5) * 6, s))
B.append(wagon(500, 806, 1.1)); B.append(wagon(580, 800, 1.0)); B.append(wagon(1420, 730, 0.8))
B.append(f'<line x1="310" y1="822" x2="462" y2="822" stroke="{PAL["trunk"]}" stroke-width="2"/>')
for i, x in enumerate([330, 366, 404, 440]):
    B.append(mule(x, 842, 30, facing=1 if i % 2 else -1, col=['#6e5c49', '#4a3f33', '#8a7558', '#5b4a3b'][i], horse=True, shadow=False))
B.append(f'<line x1="700" y1="792" x2="700" y2="652" stroke="{PAL["ink"]}" stroke-width="3"/>')
B.append(poly([(628, 792), (640, 770), (652, 792)], PAL['orange']))
for x, y, pose, f in [(606, 800, 'sit', 1), (672, 796, 'stand', -1), (905, 742, 'carry', -1), (1240, 760, 'stand', 1), (1300, 762, 'ease', -1)]:
    B.append(person(x, y, 38 if y > 750 else 30, pose, facing=f, coat=BLUE, coat_len=.6, trousers=LTBLUE, hat='kepi', hat_col=KEPI, shadow=False)[0])
IM_VALLEY = layer('valley', ''.join(B))

# the launch ground
top = [(600, 925), (760, 868), (980, 840), (1250, 828), (1500, 838), (1720, 852), (1940, 836), (X1, 826)]
rise = [(520, H + MY + 20)] + top + [(X1, H + MY + 20)]
gy = lambda x: float(np.interp(x, [p[0] for p in top], [p[1] for p in top]))
B = [seam(facets(rise, PAL['olive'], hill_h(0.004, 110, (0.02, -0.08)), cell=130, contrast=0.6, bias=-0.06)),
     f'<polyline points="{pts(top)}" fill="none" stroke="{PAL["olive_lt"][3]}" stroke-width="5" stroke-linejoin="bevel"/>']
for x in (640, 705, 1090, 1410, 1610, 1780):
    B.append(tuft(x, gy(x) + 6, 22 + rng.random() * 10))
B.append(rock(1068, gy(1068) + 18, 56)); B.append(rock(1795, gy(1795) + 20, 44))
B.append(poly([(1254, gy(1262) + 6), (1262, gy(1262) - 40), (1272, gy(1262) + 6)], PAL['trunk']))
kx = 1352
B.append(poly([(kx - 34, gy(kx) + 4), (kx + 6, gy(kx) + 4), (kx + 6, gy(kx) - 26), (kx - 34, gy(kx) - 26)], '#6d5a43'))
B.append(poly([(kx - 14, gy(kx) + 4), (kx + 6, gy(kx) + 4), (kx + 6, gy(kx) - 26), (kx - 14, gy(kx) - 26)], '#58483a'))
wx, wy = 1700, gy(1700) + 6
B.append(poly([(wx - 86, wy - 30), (wx + 86, wy - 30), (wx + 86, wy - 104), (wx - 86, wy - 104)], '#5d6f7d'))
B.append(poly([(wx, wy - 30), (wx + 86, wy - 30), (wx + 86, wy - 104), (wx, wy - 104)], '#4b5b68'))
B.append(poly([(wx - 92, wy - 104), (wx + 92, wy - 104), (wx + 86, wy - 114), (wx - 86, wy - 114)], '#33414f'))
B.append(poly([(wx - 30, wy - 114), (wx - 12, wy - 114), (wx - 12, wy - 150), (wx - 30, wy - 150)], PAL['ink2']))
B.append(f'<text x="{wx - 76}" y="{wy - 62}" font-family="Special Elite" font-size="15" fill="{PAL["cream"]}">GAS GENERATOR</text>')
for k in (-52, 52):
    B.append(f'<circle cx="{wx + k}" cy="{wy - 24}" r="26" fill="none" stroke="{PAL["ink"]}" stroke-width="6"/>')
    for a in range(0, 180, 45):
        B.append(f'<line x1="{wx + k - 24 * math.cos(math.radians(a)):.1f}" y1="{wy - 24 - 24 * math.sin(math.radians(a)):.1f}" x2="{wx + k + 24 * math.cos(math.radians(a)):.1f}" y2="{wy - 24 + 24 * math.sin(math.radians(a)):.1f}" stroke="{PAL["ink"]}" stroke-width="2.5"/>')
B.append(rope([(wx - 86, wy - 40), (1560, gy(1560) + 22), (1420, gy(1420) + 30), (1290, gy(1290) + 14)], col='#4b4a44', w=5, sag=0.05))
IM_RISE = layer('rise', ''.join(B))

# the balloon, with its basket and the two men in it
cx, cy, r = 1230, 310, 165
env = [(cx + r * math.cos(a) * 0.93, cy + r * math.sin(a) * (1.05 if math.sin(a) > 0 else 1.0)) for a in np.linspace(0, 2 * math.pi, 48, endpoint=False)]
env = [(x, y + (max(0, y - cy) ** 1.6) * 0.012) for x, y in env]
sphere = lambda x, y: 300 * math.sqrt(max(0.0, 1 - ((x - cx) / (r * 1.25)) ** 2 - ((y - cy - 10) / (r * 1.25)) ** 2))
bal = facets(env, ['#7d5f37', '#9f7e4c', '#c4a267', '#dcc086', '#ecd9a7'], sphere, cell=46, contrast=1.25, jitter=0.3)
for k in range(-3, 4):
    f_ = k / 3.6
    bal += f'<path d="M{cx},{cy - r + 2} C{cx + f_ * r * 1.25:.1f},{cy - r * .6} {cx + f_ * r * 1.25:.1f},{cy + r * .5} {cx + f_ * 22:.1f},{cy + r + 24}" stroke="{PAL["ink2"]}" stroke-width="1.6" fill="none" opacity="0.5"/>'
bal += f'<rect x="{cx - 118}" y="{cy - 14}" width="236" height="44" fill="{PAL["cream"]}" opacity="0.92"/>'
bal += f'<text x="{cx - 4}" y="{cy + 18}" text-anchor="middle" font-family="Special Elite" font-size="34" fill="{PAL["red"]}" letter-spacing="4">INTREPID</text>'
neck_y = cy + r + 26
bal += poly([(cx - 22, neck_y - 8), (cx + 22, neck_y - 8), (cx + 10, neck_y + 22), (cx - 10, neck_y + 22)], '#9f7e4c')
bx, by = cx, neck_y + 100
for dx in (-60, -25, 25, 60):
    bal += f'<line x1="{cx + dx * 1.8}" y1="{cy + r * .55}" x2="{bx + dx * .5}" y2="{by - 24}" stroke="{PAL["ink2"]}" stroke-width="1.4"/>'
s, Ja = person(bx - 15, by + 2, 62, 'glass', coat='#3d4d5e', coat_len=1.2, trousers=LTBLUE, hat='slouch', beard=True, shadow=False)
bal += s + tool(Ja, Ja['u'], 'glass')
bal += person(bx + 14, by + 2, 60, 'write', facing=-1, coat=PAL['orange'], coat_len=.6, hat='bowler', shadow=False)[0]
bal += poly([(bx - 40, by - 26), (bx + 40, by - 26), (bx + 33, by + 8), (bx - 33, by + 8)], '#8a6a3c')
bal += poly([(bx, by - 26), (bx + 40, by - 26), (bx + 33, by + 8), (bx, by + 8)], '#6f5530')
for k in range(-3, 4):
    bal += f'<line x1="{bx + k * 11}" y1="{by - 26}" x2="{bx + k * 9.5}" y2="{by + 8}" stroke="#5a4426" stroke-width="1.2" opacity="0.6"/>'
for sx in (-44, 44):
    bal += f'<ellipse cx="{bx + sx}" cy="{by - 4}" rx="7" ry="11" fill="{PAL["cream2"]}"/>'
IM_BAL = layer('balloon', bal)

crag = [(X0, 770), (90, 752), (230, 772), (318, 846), (336, 1000), (356, H + MY + 20), (X0, H + MY + 20)]
B = [seam(facets(crag, PAL['rock'], ridge_h(0.03, 90, 0.1), cell=62, contrast=1.1))]
ctop = [(X0, 770), (90, 752), (230, 772), (210, 792), (60, 786), (X0, 792)]
B.append(facets(ctop, PAL['olive'], hill_h(0.02, 40), cell=40))
B.append(moss(250, 800, 70)); B.append(moss(120, 790, 90)); B.append(moss(300, 900, 46))
IM_CRAG = layer('crag', ''.join(B))

IM_PINES = layer('pines', pine(1880, 905, 250) + pine(1832, 900, 170))
TREES = [  # (svg image, foot x, foot y, sway amplitude deg, phase)
    (scene_tree(60, 1150, 970, lean=0.04, spread=0.38, seed=5, airy=0.55, clump=0.055, outdir=OUT), 60, 1150, 0.5, 0.0),
    (scene_tree(1860, 1150, 900, lean=-0.05, spread=0.4, seed=8, airy=0.55, clump=0.055, outdir=OUT), 1860, 1150, 0.45, 2.0),
    (scene_tree(400, 880, 250, lean=0.02, n_branches=5, seed=12, leaf=20, airy=0.0, clump=0.11, outdir=OUT), 400, 880, 0.8, 4.0),
]

# ================================================================== the stage
font = 'file://' + os.path.abspath(os.path.join(HERE, '..', 'fonts', 'SpecialElite.ttf'))
tree_g = ''.join(f'<g id="T{i}">{im.replace("file://" + os.path.abspath(OUT) + "/", "")}</g>' for i, (im, *_r) in enumerate(TREES))
html = f'''<!doctype html><html><head><style>@font-face{{font-family:'Special Elite';src:url('{font}')}}
html,body{{margin:0;background:{PAL["paper"]}}}svg{{display:block}}</style></head><body>
<svg id="stage" xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs>{GRAIN}</defs>
<g id="P0">{IM_SKY}</g><g id="P1">{IM_CLOUDS}<g id="DB"></g></g><g id="P2">{IM_RIDGES}</g>
<g id="P3">{IM_VALLEY}<g id="D3"></g></g>
<g id="P4"><g id="DA"></g><g id="BAL">{IM_BAL}</g>{IM_RISE}<g id="D4"></g></g>
<g id="P5">{IM_CRAG}<g id="D5"></g></g>
<g id="P6">{tree_g}{IM_PINES}</g>
<g id="DT"></g></svg></body></html>'''
open(os.path.join(OUT, 'base.html'), 'w').write(html)

# ================================================================== motion
CX, CY = 1040, 560
ease = lambda u: 0.5 - 0.5 * math.cos(math.pi * max(0.0, min(1.0, u)))


def cam(d, t, ex=0.0, ey=0.0):
    e = ease(t / DUR)
    s = 1.015 + 0.08 * e * (0.3 + 0.7 * d)
    return f'translate({CX} {CY}) scale({s:.5f}) translate({-CX - 40 * e * d + ex:.2f} {-CY - 56 * e * d + ey:.2f})'


def blend(a, b, k):
    return {q: a[q] * (1 - k) + b[q] * k for q in a}


def soldier(x, f, P, y=None, h=150, **kw):
    a = dict(coat=BLUE, coat_len=.6, trousers=LTBLUE, hat='kepi', hat_col=KEPI, belt='#23211e')
    a.update(kw)
    return person(x, (gy(x) + 4) if y is None else y, h, 'stand', facing=f, **a, **P)


def walk_pose(ph, A=24, rifle_arm=False):
    P = dict(POSES['walk'])
    P.update(thigh_a=A * math.sin(ph), thigh_b=-A * math.sin(ph), knee_a=5 + 24 * max(0, math.cos(ph)),
             knee_b=5 + 24 * max(0, -math.cos(ph)), arm_a=-A * math.sin(ph), elbow_a=20, arm_b=A * math.sin(ph), elbow_b=24, lean=4)
    if rifle_arm:
        P.update(arm_b=10, elbow_b=42)
    return P


EVENTS = {'ticks': [], 'creaks': [], 'taps': []}
TITLE, SUB = 'Above the Lines', 'Fair Oaks, Virginia - 1862'
T_TITLE, T_SUB, CPS = 1.5, 3.4, 13.0


def frame(i):
    t = i / FPS
    tq = math.floor(t * 12) / 12          # figures and marks are drawn on twos
    Tm, Hm = {}, {}
    Tm['P0'] = cam(0.0, t); Tm['P1'] = cam(0.06, t, ex=5.0 * t); Tm['P2'] = cam(0.18, t)
    Tm['P3'] = cam(0.38, t); Tm['P4'] = cam(0.6, t); Tm['P5'] = cam(0.8, t); Tm['P6'] = cam(1.0, t)
    for k, (_im, fx, fy, amp, ph) in enumerate(TREES):
        a = amp * math.sin(2 * math.pi * t / 5.5 + ph) + amp * 0.35 * math.sin(2 * math.pi * t / 2.1 + ph * 2)
        Tm[f'T{k}'] = f'rotate({a:.3f} {fx} {fy})'

    # ---- balloon: bobs and sways on its ropes
    dx = 6 * math.sin(2 * math.pi * t / 7 + 1) + 2 * math.sin(2 * math.pi * t / 2.4)
    dy = 7 * math.sin(2 * math.pi * t / 5) - 3 * math.cos(2 * math.pi * t / 2.4) + 30 - 70 * ease(t / DUR)   # paid out: it rises
    rot = 1.3 * math.sin(2 * math.pi * t / 6 + 0.5)
    Tm['BAL'] = f'translate({dx:.2f} {dy:.2f}) rotate({rot:.3f} {bx} {by})'
    BK = (bx + dx, by + 8 + dy)

    # ---- construction arc draws on
    p = ease((t - 0.3) / 1.6)
    arc_r = 330
    a0, a1 = math.radians(195), math.radians(345)
    x0, y0 = cx + arc_r * math.cos(a0), cy + arc_r * math.sin(a0)
    x1, y1 = cx + arc_r * math.cos(a1), cy + arc_r * math.sin(a1)
    Hm['DA'] = (f'<g stroke="{PAL["cream"]}" stroke-width="1.8" fill="none" opacity="0.7">'
                f'<path d="M{x0:.1f},{y0:.1f} A{arc_r},{arc_r} 0 0 1 {x1:.1f},{y1:.1f}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="{1 - p:.3f}"/>'
                f'<g opacity="{ease((t - 1.5) / 0.5):.2f}"><line x1="{cx}" y1="{cy - arc_r * 1.05:.1f}" x2="{cx}" y2="{cy - arc_r * 0.55:.1f}"/>'
                f'<line x1="{cx - arc_r * 0.25:.1f}" y1="{cy - arc_r * .8:.1f}" x2="{cx + arc_r * 0.25:.1f}" y2="{cy - arc_r * .8:.1f}"/></g></g>')

    # ---- the crew: heave (reach up the rope) and pull (lean back), out of step with each other
    per = 2.4
    k = lambda off: 0.5 - 0.5 * math.cos(2 * math.pi * (tq / per + off))
    haul, pull = POSES['haul'], POSES['pull']
    s1, J1 = soldier(1005, 1, blend(haul, pull, k(0.0)))
    s2, J2 = soldier(900, 1, blend(haul, pull, k(-0.12)), skin=SKIN[3], hat='cap', hat_col=KEPI)
    s3, J3 = soldier(1490, -1, blend(haul, pull, k(0.5)), beard=True)
    s4, J4 = soldier(1590, -1, blend(haul, pull, k(0.38)), coat='#5d6f7d')
    D = rope([BK, (1262, gy(1262) - 30)], sag=0.02)
    D += rope([(BK[0] - 30, BK[1]), J1['hand_b'], J2['hand_b'], (835, gy(835) - 6), (800, gy(800) + 2)], sag=0.03)
    D += rope([(BK[0] + 30, BK[1]), J3['hand_b'], J4['hand_b'], (1650, gy(1650) - 4), (1672, gy(1672) + 4)], sag=0.03)
    D += s2 + s1 + s3 + s4
    # the officer follows the balloon through his glass
    P = dict(POSES['glass']); P['lean'] = -4 + 2.0 * math.sin(2 * math.pi * tq / 5); P['head'] = -14 + 3 * math.sin(2 * math.pi * tq / 5)
    s, J = soldier(1140, 1, P, coat='#33414f', coat_len=1.5, hat='slouch', hat_col='#2f2c28', beard=True, belt=PAL['red'])
    D += s + tool(J, J['u'], 'glass')
    # the telegraph operator taps his key; the wire runs up to the basket
    tap = (int(tq * 12) * 7919) % 5 in (0, 1) and t > 1.0
    P = dict(POSES['kneel']); P['elbow_b'] = 46 + (10 if tap else 0)
    D += f'<path d="M{kx - 14},{gy(kx) - 26} Q{kx - 120},{(gy(kx) + BK[1]) / 2:.1f} {BK[0] + 20:.1f},{BK[1]:.1f}" stroke="{PAL["ink2"]}" stroke-width="1.3" fill="none" stroke-dasharray="3 6"/>'
    D += soldier(kx + 62, -1, P, coat=PAL['pink'], coat_len=.3, hat=None, hair=HAIR[1], sleeves=PAL['cream2'])[0]
    # the guard walks up from the left and halts
    t_stop = 3.6
    if tq < t_stop:
        gx = 612 + 52 * tq
        P = walk_pose(2 * math.pi * tq / 1.3, rifle_arm=True)
    else:
        gx = 612 + 52 * t_stop
        P = blend(walk_pose(2 * math.pi * t_stop / 1.3, rifle_arm=True), POSES['carry'], ease((tq - t_stop) / 0.5))
    s, J = soldier(gx, 1, P, strap=PAL['cream'])
    D += s + rifle(J, J['u'])
    Hm['D4'] = D

    # ---- the camp: flag, smoke, men walking
    D = ''
    fx0, fy0, fw, fh, nseg = 702, 654, 58, 34, 8
    def fpt(u, v):
        wv = math.sin(u * 5.2 - tq * 7.0) * (2 + 5 * u)
        return (fx0 + u * fw, fy0 + v * fh + u * 6 + wv)
    for j in range(nseg):
        u0, u1 = j / nseg, (j + 1) / nseg
        D += poly([fpt(u0, 0), fpt(u1, 0), fpt(u1, 1), fpt(u0, 1)], PAL['red'])
        for st in range(3):
            v0 = 0.14 + st * 0.3
            D += poly([fpt(u0, v0), fpt(u1, v0), fpt(u1, v0 + 0.13), fpt(u0, v0 + 0.13)], PAL['cream'])
        if u1 <= 0.45:
            D += poly([fpt(u0, 0), fpt(u1, 0), fpt(u1, 0.5), fpt(u0, 0.5)], PAL['blue'])
    for j in range(8):
        q = (t / 7.0 + j / 8) % 1.0
        D += f'<circle cx="{640 + q * 80 + math.sin(j * 1.7 + q * 5) * 12:.1f}" cy="{768 - q * 230:.1f}" r="{9 + q * 40:.1f}" fill="{PAL["cream"]}" opacity="{0.5 * (1 - q) ** 1.3:.3f}"/>'
    for (x0_, y_, h_, f_, sp) in [(820, 770, 38, 1, 15), (1080, 712, 30, -1, 11), (230, 760, 38, 1, 15), (1500, 722, 30, -1, 10)]:
        D += person(x0_ + f_ * sp * tq, y_, h_, 'stand', facing=f_, coat=BLUE, coat_len=.6, trousers=LTBLUE, hat='kepi', hat_col=KEPI,
                    shadow=False, **walk_pose(2 * math.pi * tq / 1.0 + x0_, A=22))[0]
    Hm['D3'] = D

    # ---- a few birds cross the sky
    D = ''
    for j, (bx0, by0, sp, sz) in enumerate([(2050, 300, 62, 9), (2110, 330, 60, 7), (2160, 290, 64, 8), (2400, 420, 50, 6), (2450, 440, 52, 6)]):
        x_, y_ = bx0 - sp * t, by0 + 10 * math.sin(t * 0.8 + j)
        fl = math.sin(tq * 9 + j * 1.3) * sz * 0.8
        D += f'<path d="M{x_ - sz * 1.4:.1f},{y_ - fl:.1f} L{x_:.1f},{y_:.1f} L{x_ + sz * 1.4:.1f},{y_ - fl:.1f}" stroke="{PAL["ink2"]}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    Hm['DB'] = D

    # ---- the artist on the crag, sketching
    P = dict(POSES['sit']); P['elbow_b'] = 74 + 7 * math.sin(tq * 9.0) ; P['head'] = 6 + 5 * math.sin(2 * math.pi * tq / 4)
    s, J = person(236, 776, 128, 'stand', facing=1, coat='#7a6c4f', coat_len=.3, trousers='#4b4a44', hat='straw', hat_col='#cbb88a', vest=PAL['cream'], shadow=False, **P)
    Hm['D5'] = s + tool(J, J['u'], 'book')

    # ---- the title types on
    n1 = int(max(0, min(len(TITLE), (tq - T_TITLE) * CPS)))
    n2 = int(max(0, min(len(SUB), (tq - T_SUB) * CPS * 1.4)))
    D = f'<g font-family="Special Elite" fill="{PAL["ink"]}">'
    D += f'<text x="560" y="150" font-size="64" xml:space="preserve">{TITLE[:n1]}</text>'
    if n1 == len(TITLE):
        wd = 166 * ease((t - (T_TITLE + len(TITLE) / CPS)) / 0.35)
        D += f'<rect x="560" y="198" width="{wd:.1f}" height="3"/>'
    D += f'<text x="562" y="250" font-size="28" fill="{PAL["ink2"]}" xml:space="preserve">{SUB[:n2]}</text></g>'
    Hm['DT'] = D
    return {'t': Tm, 'h': Hm}


with open(os.path.join(OUT, 'frames.ndjson'), 'w') as fh:
    for i in range(N):
        fh.write(json.dumps(frame(i)) + '\n')

# sound cues
for j in range(len(TITLE)):
    if TITLE[j] != ' ':
        EVENTS['ticks'].append(round(T_TITLE + j / CPS, 3))
for j in range(len(SUB)):
    if SUB[j] != ' ':
        EVENTS['ticks'].append(round(T_SUB + j / (CPS * 1.4), 3))
EVENTS['creaks'] = [0.6, 5.4]
EVENTS['dur'] = DUR
json.dump(EVENTS, open(os.path.join(OUT, 'events.json'), 'w'))
print('ok', N, 'frames')
