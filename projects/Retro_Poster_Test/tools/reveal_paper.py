# The portrait as real cut paper, with movement. 16.5 s, 30 fps.
#   python3 tools/reveal_paper.py && node tools/anim_render.mjs build/paper && python3 tools/anim_encode.py build/paper video/portrait_paper_16s.mp4
# A kraft board; a torn sky sheet is laid on it and taped; guide lines are pencilled; then every piece of the picture
# arrives the way a hand places paper: held above the page (a little larger, turned, a wide soft shadow), lowered in a
# few stop-motion steps until the shadow is a thin contact line. Shade is rubbed on in pencil. Last, a jointed arm on
# a brass pin swings a spyglass up to his eye and the head tips to meet it: a paper puppet.
# The existing poster scenes and the first portrait reveal are untouched; this is a separate treatment.
import json, math, os, subprocess
import numpy as np
from facet import *
from figures import tint, rpoly
from scene_portrait import build, title_svg, TITLE, SUB
import paper

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'build', 'paper')
os.makedirs(OUT, exist_ok=True)
FPS, DUR = 30, 16.5
S, (HX, HY, U) = build()
INSET = 30
COAT, SKIN = '#33414f', '#dbb692'

# ================================================================== the pieces
P = []          # dicts: stage, svg, filt, shadow, group, vector


def piece(stage, svg, filt=None, shadow=True, group=None, vector=False, clip=False):
    if clip:
        svg = f'<g clip-path="url(#sheet)">{svg}</g>'
    P.append(dict(stage=stage, svg=svg, filt=filt, shadow=shadow, group=group, vector=vector))


piece('board', f'<rect x="-120" y="-120" width="{W + 240}" height="{H + 240}" fill="#a98660" filter="url(#kraft)"/>', shadow=False)
for st, svg in S:
    if st == 'sky':
        piece('sky', svg + f'<rect x="0" y="780" width="{W}" height="{H}" fill="#c9d3c8"/>', 'torn', clip=True)
for k, (tx, ty, rot) in enumerate([(150, 34, -8), (W - 150, 34, 7)]):
    piece('tape', f'<g transform="translate({tx} {ty}) rotate({rot})"><rect x="-62" y="-20" width="124" height="40" fill="#e9dfbb" opacity="0.86"/></g>', 'cutfine')
for st, svg in S:
    if st == 'guide':
        piece('guide', svg, vector=True, shadow=False)
nb = 0
for st, svg in S:
    if st == 'bg':
        piece('bg', svg, 'torn2' if nb < 3 else 'torn', clip=True); nb += 1
for st, svg in S:
    if st == 'rope':
        piece('rope', svg, 'cutfine')
for st, svg in S:
    if st in ('flat', 'shade', 'detail'):
        grp = None if 'translate(0 -0.1)' in svg else 'head'
        if st == 'shade':
            piece('shade', svg, vector=True, shadow=False, group=grp)
        else:
            piece(st, svg, 'cutfine', group=grp)

# ---- the jointed arm and the spyglass (drawn raised; the arm group turns about the elbow pin)
E, SH = np.array([890.0, 760.0]), np.array([952.0, 650.0])
P0, P1 = np.array([1062.0, 372.0]), np.array([735.0, 318.0])
HD = P0 + 0.3 * (P1 - P0)


def quad(a, b, wa, wb):
    d = (b - a) / np.linalg.norm(b - a)
    n = np.array([-d[1], d[0]])
    return [tuple(a + n * wa), tuple(b + n * wb), tuple(b - n * wb), tuple(a - n * wa)]


piece('arm', rpoly(quad(SH, E, 64, 54), tint(COAT, 0.04), 10), 'cutfine')
WR = E + 0.84 * (HD - E)
piece('arm', rpoly(quad(E, WR, 50, 34), tint(COAT, 0.1), 8), 'cutfine', group='arm')
piece('arm', rpoly(quad(WR, E + 0.91 * (HD - E), 37, 35), '#f6efd9', 3), 'cutfine', group='arm')
tube = ''
for a, b, hw, col in [(0.0, 0.32, 11, '#b8902f'), (0.3, 0.64, 15, '#c9a23a'), (0.62, 1.0, 19, PAL['yellow'])]:
    tube += rpoly(quad(P0 + a * (P1 - P0), P0 + b * (P1 - P0), hw, hw), col, 2)
for a, hw in [(0.3, 16), (0.62, 20), (0.985, 21)]:
    tube += rpoly(quad(P0 + a * (P1 - P0), P0 + (a + 0.02) * (P1 - P0), hw, hw), '#5a4426', 1)
piece('arm', tube, 'cutfine', group='arm')
hand = [(HD[0] + 40 * math.cos(a) * (1.0 if i % 2 else 0.88), HD[1] + 42 * math.sin(a)) for i, a in enumerate(np.linspace(0, 2 * math.pi, 9)[:-1])]
piece('arm', rpoly(hand, SKIN, 6) + rpoly([(HD[0] - 20, HD[1] - 34), (HD[0] + 6, HD[1] - 52), (HD[0] + 22, HD[1] - 30)], tint(SKIN, -0.1), 5), 'cutfine', group='arm')
piece('arm', f'<circle cx="{E[0]}" cy="{E[1]}" r="11" fill="#c9a23a"/><circle cx="{E[0] - 3}" cy="{E[1] - 3}" r="4" fill="#f1dc8a"/>', 'cutfine')
for st, svg in S:
    if st == 'front':
        piece('front', svg, 'cut2')
for i, p in enumerate(P):
    p['id'] = f'p{i}'

# ================================================================== rasterise once
font = 'file://' + os.path.abspath(os.path.join(HERE, '..', 'fonts', 'SpecialElite.ttf'))
DEFS = GRAIN + paper.defs() + f'<clipPath id="sheet"><rect x="{INSET}" y="{INSET}" width="{W - 2 * INSET}" height="{H - 2 * INSET}"/></clipPath>'
M = 120
body = ''.join(f'<g id="{p["id"]}" data-piece="1"' + (' data-vector="1"' if p['vector'] else '') + (f' filter="url(#{p["filt"]})"' if p['filt'] else '') + f'>{p["svg"]}</g>' for p in P)
open(os.path.join(OUT, 'pieces.html'), 'w').write(
    f'<!doctype html><html><head><style>@font-face{{font-family:"Special Elite";src:url("{font}")}}html,body{{margin:0;background:transparent}}svg{{display:block}}</style></head><body>'
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W + 2 * M}" height="{H + 2 * M}" viewBox="{-M} {-M} {W + 2 * M} {H + 2 * M}"><defs>{DEFS}</defs>{body}</svg></body></html>')
subprocess.run(['node', os.path.join(HERE, 'paper_pieces.mjs'), OUT], check=True)
BOX = json.load(open(os.path.join(OUT, 'pieces.json')))

# ================================================================== the stage
els = ''
for p in P:
    if p['vector']:
        dash = ' stroke-dasharray="1" stroke-dashoffset="1"' if p['stage'] == 'guide' else ''
        els += f'<g id="{p["id"]}" opacity="0"{dash}>{p["svg"]}</g>'
    else:
        x, y, w, h = BOX[p['id']]
        els += f'<g id="{p["id"]}" opacity="{1 if p["stage"] == "board" else 0}"><image href="pc_{p["id"]}.png" x="{x}" y="{y}" width="{w}" height="{h}"/></g>'
html = f'''<!doctype html><html><head><style>@font-face{{font-family:'Special Elite';src:url('{font}')}}
html,body{{margin:0;background:#a98660}}svg{{display:block}}</style></head><body>
<svg id="stage" xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs>{GRAIN}{paper.shadows()}</defs>
<g id="CAM">{els}</g><g id="DT"></g></svg></body></html>'''
open(os.path.join(OUT, 'base.html'), 'w').write(html)

# ================================================================== timing
start, snd = {}, []
STEPS = [1.0, 0.75, 0.45, 0.18, 0.0]            # lift over the five drawings of a placement
land = lambda t: t + (len(STEPS) - 1) / 12
plan = {'sky': (0.5, 0.0, 'page_turn', 0.3), 'tape': (1.25, 0.3, 'tape_press', 0.3), 'bg': (3.0, 0.3, 'paper_slap_soft', 0.24),
        'rope': (4.6, 0.16, 'block_tap_soft', 0.1), 'flat': (5.0, 0.24, 'paper_slap_soft', 0.2), 'detail': (7.7, 0.13, 'block_tap_soft', 0.12),
        'arm': (9.9, 0.14, 'card_slide_soft', 0.18), 'front': (10.9, 0.25, 'paper_slap_soft', 0.24)}
count = {}
for p in P:
    st = p['stage']
    if st in plan:
        t0, gap, sound, vol = plan[st]
        k = count.get(st, 0); count[st] = k + 1
        start[p['id']] = t0 + k * gap
        snd.append([sound, land(start[p['id']]) - 0.03, vol * (0.8 + 0.4 * ((k * 37) % 5) / 5)])
k = 0
for p in P:
    if p['stage'] == 'guide':
        start[p['id']] = 1.9 + k * 0.26; snd.append(['pencil_soft', start[p['id']], 0.22]); k += 1
k = 0
for p in P:
    if p['stage'] == 'shade':
        start[p['id']] = 6.4 + k * 0.09
        if k % 3 == 0:
            snd.append(['pencil_soft', start[p['id']], 0.12])
        k += 1
T_ARM, T_TITLE, T_SUB, CPS = 12.0, 13.0, 14.0, 14.0
snd.append(['paper_rustle', T_ARM - 0.05, 0.3])
snd.append(['block_tap_soft', T_ARM + 0.82, 0.16])
subtxt = ''.join(SUB)
snd += [['tick', T_TITLE + j / CPS - 0.02, 0.17] for j, ch in enumerate(TITLE[0]) if ch != ' ']
snd += [['tick', T_SUB + j / (CPS * 1.5) - 0.02, 0.12] for j, ch in enumerate(subtxt) if ch != ' ']

rs = np.random.default_rng(9)
ARR = {}
for p in P:
    if p['id'] in BOX:
        x, y, w, h = BOX[p['id']]
        cx, cy = x + w / 2, y + h / 2
        d = np.array([cx - W / 2, cy - H / 2 - 60.0])
        d = d / (np.linalg.norm(d) + 1e-6)
        big = max(w, h)
        ARR[p['id']] = (cx, cy, d[0] * 52, d[1] * 52 - 22, (rs.random() - 0.5) * 12 * min(1.0, 420 / big), 0.05 * min(1.0, 700 / big) + 0.012)

ease = lambda u: 0.5 - 0.5 * math.cos(math.pi * max(0.0, min(1.0, u)))
NECK = (HX + 0.05 * U, HY + 0.45 * U)
CAMC = (HX - 150, HY + 80)
with open(os.path.join(OUT, 'frames.ndjson'), 'w') as fh:
    for f in range(int(FPS * DUR)):
        t = f / FPS
        tq = math.floor(t * 12) / 12
        o, tr, at = {}, {}, {}
        e_arm = ease((tq - T_ARM) / 0.8)
        th = 165 * (1 - e_arm) - 4 * math.sin(math.pi * min(1.0, max(0.0, (tq - T_ARM - 0.8) / 0.35)))     # swing up, a small settle
        head_a = -3.5 * ease((tq - T_ARM - 0.3) / 0.6)
        for p in P:
            i, st = p['id'], p['stage']
            if st == 'board':
                continue
            grp = ''
            if p['group'] == 'head':
                grp = f'rotate({head_a:.2f} {NECK[0]:.1f} {NECK[1]:.1f}) '
            elif p['group'] == 'arm':
                grp = f'rotate({th:.2f} {E[0]} {E[1]}) '
            if st == 'guide':
                o[i] = 1 if t >= start[i] else 0
                at[i] = {'stroke-dashoffset': f'{1 - ease((t - start[i]) / 0.5):.3f}'}
            elif st == 'shade':
                n = int((tq - start[i]) * 12 + 1e-6)
                o[i] = 0 if tq < start[i] else [0.4, 0.75, 1][min(n, 2)]
                tr[i] = grp or 'translate(0 0)'
            else:
                if tq < start[i]:
                    o[i] = 0
                    continue
                o[i] = 1
                n = int((tq - start[i]) * 12 + 1e-6)
                L = STEPS[min(n, len(STEPS) - 1)]
                cx, cy, ox, oy, rot, sc = ARR[i]
                if p['group'] == 'arm':
                    rot = 0
                tr[i] = (f'translate({ox * L:.1f} {oy * L:.1f}) ' + grp + f'rotate({rot * L:.2f} {cx:.1f} {cy:.1f}) '
                         f'translate({cx:.1f} {cy:.1f}) scale({1 + sc * L:.4f}) translate({-cx:.1f} {-cy:.1f})')
                if p['shadow']:
                    at[i] = {'filter': f'url(#sh{round(L * (paper.N_SH - 1))})'}
        s = 1.0 + 0.075 * ease(t / DUR)
        tr['CAM'] = f'translate({CAMC[0]} {CAMC[1]}) scale({s:.5f}) translate({-CAMC[0]} {-CAMC[1]})'
        n1 = int(max(0, min(len(TITLE[0]), (tq - T_TITLE) * CPS)))
        n2 = int(max(0, min(len(subtxt), (tq - T_SUB) * CPS * 1.5)))
        rule = ease((t - (T_TITLE + len(TITLE[0]) / CPS)) / 0.35)
        fh.write(json.dumps({'t': tr, 'o': o, 'a': at, 'h': {'DT': title_svg(n1, n2, rule) if n1 else ''}}) + '\n')
json.dump({'dur': DUR, 'bed': ['forest_birds', 0.15], 'sounds': snd}, open(os.path.join(OUT, 'events.json'), 'w'))
print('ok', len(P), 'pieces')
