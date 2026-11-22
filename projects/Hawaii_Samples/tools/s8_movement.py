# Sample 8: people who move. 12.5 s, no portal, one hard cut.
#   Shot 1 (wide): a landing party marches past ʻIolani Palace. Shot 2 (tracking, close): the same column at 2.3x.
#   Three kinds of people share the plate so they can be compared:
#     - the marching column, the officer and the townspeople are DRAWN IN CODE (Retro_Poster_Test/tools/figures.py):
#       the walk is solved per frame (feet planted while on the ground, knees by inverse kinematics, the column's
#       speed set from the stride so nothing slides), and the townspeople act by easing between poses;
#     - the two sentries and the officer with the spyglass are Google Flow cut-outs with a breathing loop only.
#   People step at 12 fps (the channel's marks rate); the camera glides at 30.
import os, sys, json, math
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'Retro_Poster_Test', 'tools'))
from figures import person, rifle, POSES, SKIN, HAIR, tint
from kit import *

DUR, T_CUT = 12.5, 6.5
S = Stage('s8_movement', DUR, bg='#111111', grain=0.5)
S.defs.append(COMMON_DEFS)
S.defs.append('<filter id="flatshadow"><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter>')
I = lambda p: os.path.join(ROOT, p)
INFO = json.load(open(I('img/flow/flow.json')))
rng = np.random.default_rng(8)

e = INFO['p4_palace']['edges']
plate = (f'<rect x="-3000" y="-3000" width="7920" height="3001" fill="{e["top"]}"/><rect x="-3000" y="1079" width="7920" height="3000" fill="{e["bottom"]}"/>'
         f'<rect x="-3000" y="0" width="3001" height="1080" fill="{e["left"]}"/><rect x="1919" y="0" width="3000" height="1080" fill="{e["right"]}"/>'
         f'<image href="{S.img(I("img/flow/p4_palace.jpg"))}" x="0" y="0" width="1920" height="1080"/>')

# ---- Flow cut-outs (breathing only)
FLOW = [('c2_navy', 2, 1512, 936, 150, True), ('c2_navy', 3, 896, 893, 132, False), ('c2_navy', 4, 1026, 893, 132, True)]
flow_svg = ''
for i, (sheet, n, x, bottom, h, flip) in enumerate(FLOW):
    c = INFO[sheet]['cutouts'][n - 1]
    w = c['w'] * h / c['h']
    t_ = f' transform="translate({2 * x:.1f} 0) scale(-1 1)"' if flip else ''
    flow_svg += (f'<ellipse cx="{x}" cy="{bottom - 3}" rx="{w * 0.5:.0f}" ry="5" fill="#000" opacity="0.25"/>'
                 f'<g id="fc{i}"><image href="{S.img(I("img/flow/" + c["file"]))}" x="{x - w / 2:.1f}" y="{bottom - h:.1f}" width="{w:.1f}" height="{h:.1f}"{t_}/></g>')

S.world.append(plate + '<g id="far"></g>' + flow_svg + '<g id="march"></g><g id="fore"></g>')
S.over.append('<g id="ov"></g>')


# ---- the walk
def ik(dx, dy):
    """thigh and knee angles (deg) that put the ankle at (dx forward, dy down) from the hip, in head units"""
    l1, l2 = 1.9, 1.95
    d = min(math.hypot(dx, dy), l1 + l2 - 1e-3)
    al = math.atan2(dx, dy)
    th = al + math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))
    kn = math.pi - math.acos((l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2))
    return math.degrees(th), math.degrees(kn)


A, DUTY, PERIOD, LIFT = 1.15, 0.6, 0.9, 0.42       # half stride (head units), share of the cycle a foot is planted, s per cycle


def gait(ph, swing=24, carry=False):
    hip = 3.7 - 0.07 * math.cos(4 * math.pi * ph)   # lowest when a heel lands, highest over the planted foot
    P = dict(lean=2, head=0)
    for k, off in (('a', 0.0), ('b', 0.5)):
        p = (ph + off) % 1
        if p < DUTY:                                # planted: the foot goes back under the body at the body's own speed
            fx, fy = A * (1 - 2 * p / DUTY), hip
        else:                                       # swinging forward, lifted
            s = (p - DUTY) / (1 - DUTY)
            fx, fy = -A + 2 * A * ease(s), hip - LIFT * math.sin(math.pi * s)
        P['thigh_' + k], P['knee_' + k] = ik(fx, fy)
    c = math.cos(2 * math.pi * ph)
    P['arm_a'], P['elbow_a'] = -swing * c, 16 + 6 * c
    if carry:
        P['arm_b'], P['elbow_b'] = 6, 34           # the near hand cups the rifle butt at the hip
    else:
        P['arm_b'], P['elbow_b'] = swing * c, 16 - 6 * c
    return P


MH = 168                                            # marcher height, px
V = 2 * A * (MH / 8) / (DUTY * PERIOD)              # px per second: the planted foot's speed, so no sliding
NAVY, TAN = '#27324a', '#b79a68'
FILES, GAP = 7, 104
men = []
for rank, (y, dk) in enumerate(((952, -0.12), (976, 0.0))):
    for i in range(FILES):
        men.append(dict(x0=250 - i * GAP - rank * 34, y=y, dk=dk, h=MH * (1 + rng.uniform(-0.025, 0.025)), skin=SKIN[int(rng.integers(0, 3))],
                        hair=HAIR[int(rng.integers(0, 4))], rank=rank))
men.sort(key=lambda m: (m['rank'], -m['x0']))
LEAD_X0 = 400


def shouldered(J):
    """a rifle at shoulder arms: butt in the near hand, barrel up past the shoulder"""
    u = J['u']; hx, hy = J['hand_b']; sx, sy = J['shoulder']
    tip = (sx - 0.35 * u, sy - 1.9 * u)
    dx, dy = tip[0] - hx, tip[1] - hy
    n = math.hypot(dx, dy)
    bx, by = hx - dx / n * 0.45 * u, hy - dy / n * 0.45 * u
    mx, my = hx + dx * 0.5, hy + dy * 0.5
    return (f'<line x1="{bx:.1f}" y1="{by:.1f}" x2="{tip[0]:.1f}" y2="{tip[1]:.1f}" stroke="#2b2622" stroke-width="{0.1 * u:.1f}" stroke-linecap="round"/>'
            f'<line x1="{bx:.1f}" y1="{by:.1f}" x2="{mx:.1f}" y2="{my:.1f}" stroke="#5a4532" stroke-width="{0.22 * u:.1f}" stroke-linecap="round"/>'
            f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="{0.2 * u:.1f}" fill="#d9b38f"/>')


def column(tq):
    ph = (tq / PERIOD) % 1
    P, o = gait(ph, carry=True), ''
    for m in men:
        x = m['x0'] + V * tq
        if x < -160 or x > 2080:
            continue
        c = tint(NAVY, m['dk'])
        svg, J = person(x, m['y'], m['h'], 'walk', facing=1, coat=c, coat_len=0.25, trousers=c, boots=tint(TAN, m['dk']), skin=m['skin'],
                        hair=m['hair'], hat='cap', hat_col=tint('#1f2a3c', m['dk']), collar='#c9d4dd', belt=tint(TAN, -0.1), **P)
        o += svg + shouldered(J)
    Po = gait(ph, swing=30)                         # the officer walks ahead, arms free
    svg, J = person(LEAD_X0 + V * tq, 964, MH * 1.03, 'walk', facing=1, coat='#1f2a3c', coat_len=1.5, trousers='#e9e1cf', skin=SKIN[0],
                    hair=HAIR[1], hat='kepi', hat_col='#1f2a3c', beard=True, belt='#c9a648', **Po)
    return o + svg


# ---- townspeople: ease between poses when the column reaches them (anticipation is the small dip before the move)
def mix(p0, p1, u):
    a, b = POSES[p0], POSES[p1]
    return {k: a[k] + (b[k] - a[k]) * u for k in a}


FOLK = [  # x, y, h, start pose, reaction pose, look (kwargs), delay
    (770, 930, 146, 'stand', 'shade', dict(coat='#8a3b33', dress=True, hair=HAIR[3], skin=SKIN[1], hat='straw', hat_col='#d9c79a'), 0.0),
    (838, 934, 150, 'ease', 'point', dict(coat='#d8cfba', coat_len=0.5, trousers='#5a5346', hair=HAIR[3], skin=SKIN[3], hat='straw', hat_col='#cdb98a'), 0.5),
    (878, 936, 92, 'stand', 'point', dict(coat='#c7b48a', coat_len=0.3, trousers='#6b5d49', hair=HAIR[0], skin=SKIN[1]), 0.9),
    (1350, 932, 150, 'hips', 'stand', dict(coat='#3c4a3d', coat_len=1.2, trousers='#2f2c28', hair=HAIR[4], skin=SKIN[0], hat='bowler', beard=True), 0.2),
    (1420, 930, 144, 'stand', 'shade', dict(coat='#e3d9c2', dress=True, hair=HAIR[3], skin=SKIN[3]), 0.7),
    (1680, 934, 150, 'ease', 'hips', dict(coat='#6f5a3d', coat_len=0.6, trousers='#3d382f', hair=HAIR[0], skin=SKIN[1], hat='slouch', hat_col='#5b4a36'), 0.4),
]


def folk(tq):
    o = ''
    lead = LEAD_X0 + V * tq
    for i, (x, y, h, p0, p1, look, dly) in enumerate(FOLK):
        t_react = (x - 330 - LEAD_X0) / V + dly         # when the officer is about 330 px away
        u = (tq - t_react) / 0.55
        if u <= 0:
            P = mix(p0, p1, 0)
        elif u < 0.2:
            P = mix(p0, p1, -0.12 * math.sin(math.pi * u / 0.2))     # anticipation: a little the wrong way first
        else:
            P = mix(p0, p1, back_out(clamp((u - 0.2) / 0.8), 1.4))   # then the move, overshooting and settling
        br = math.sin(tq * 1.9 + i * 1.7)
        P['lean'] += 0.9 * br; P['head'] += 2.5 * math.sin(tq * 0.8 + i)
        facing = -1 if lead < x + 20 else 1              # they watch the column come, then turn to watch it go
        turning = abs(lead - (x + 20)) < V / 12 * 1.5    # one drawing face-on in between: a turn, not a flip
        svg, _ = person(x, y, h, p0, facing=facing, view='front' if turning else 'side', **look, **P)
        o += svg
    return o


FORE = [(140, 1100, 270, dict(coat='#3a3a34', coat_len=1.3, trousers='#2a2925', hair=HAIR[3], hat='slouch', hat_col='#3a3128'), 0.3),
        (1560, 1104, 262, dict(coat='#7c3a35', dress=True, hair=HAIR[3], skin=SKIN[1]), 1.2),
        (1700, 1102, 276, dict(coat='#cfc6b2', coat_len=0.5, trousers='#4a4439', hair=HAIR[0], skin=SKIN[3], hat='straw', hat_col='#cdb98a'), 2.1)]


def fore(tq):
    o = ''
    for x, y, h, look, ph in FORE:
        svg, _ = person(x, y, h, 'stand', view='back', shadow=False, **look)
        o += f'<g transform="rotate({0.7 * math.sin(tq * 1.3 + ph):.2f} {x} {y})">{svg}</g>'
    return o


cam1 = Camera([(0.0, 940, 600, 1.06), (T_CUT, 1010, 640, 1.2)], wobble=1.0)
x_c = lambda t: LEAD_X0 + V * t - 150                    # shot 2 tracks beside the head of the column
cam2 = Camera([(T_CUT, x_c(T_CUT), 868, 2.25), (DUR, x_c(DUR), 862, 2.4)], wobble=1.4)

S.sounds.append(['forest_birds', 0.0, 0.35, 0.8, 0.6, DUR])
for k in range(int(DUR / (PERIOD / 2))):                 # a footfall every half cycle
    S.sound('dry-thud', k * PERIOD / 2 + 0.02, 0.10 if k * PERIOD / 2 < T_CUT else 0.2)
S.sound('tick', T_CUT - 0.02, 0.3)
LABELS = [(0.5, 3.4, 'drawn in code: the column, the officer, the townspeople'), (3.6, 6.3, 'Flow cut-outs: two sentries on the steps, the spyglass at right (breathing only)'),
          (7.0, 12.2, 'close: feet stay planted, knees solved, people on twos')]


def frame(t):
    tq = step12(t)
    T = {'CAM': (cam1 if t < T_CUT else cam2).transform(t)}
    for i, (sheet, n, x, bottom, h, flip) in enumerate(FLOW):
        s = 1 + 0.009 * math.sin(tq * 1.7 + i * 2.1)
        r = 0.35 * math.sin(tq * 0.9 + i * 1.3)
        T[f'fc{i}'] = f'translate({x} {bottom}) rotate({r:.2f}) scale(1 {s:.4f}) translate({-x} {-bottom})'
    o = ''
    for a0, a1, s_ in LABELS:
        if a0 < t < a1:
            o += slip(110, 1000, s_, 28, clamp((tq - a0) / 0.9))
    return {'t': T, 'h': {'far': folk(tq), 'march': column(tq), 'fore': fore(tq), 'ov': o}}


if __name__ == '__main__':
    S.write(frame)
