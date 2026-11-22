# The portrait assembles itself: guide lines are drawn, the sky washes in, then every flat shape, shade plane and
# detail is laid down in order, like cut paper being placed, and the caption types on. 14 s, 30 fps.
#   python3 tools/reveal_portrait.py && node tools/anim_render.mjs build/reveal && python3 tools/anim_encode.py build/reveal video/portrait_reveal_14s.mp4
# The idea is claude-drawing-skill's staged paintings ("watch the picture being made"), done shape by shape.
import json, math, os
from facet import *
from scene_portrait import build, title_svg, TITLE, SUB

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'build', 'reveal')
os.makedirs(OUT, exist_ok=True)
FPS, DUR = 30, 14.0
S, (HX, HY, U) = build()
Z = {'sky': 0, 'bg': 1, 'guide': 2, 'rope': 3, 'flat': 4, 'shade': 5, 'detail': 6, 'front': 7}
idx = sorted(range(len(S)), key=lambda i: (Z[S[i][0]], i))      # draw order (back to front)

# ---- when each piece arrives
start, snd = {}, []
t = 0.4
for i in [i for i in range(len(S)) if S[i][0] == 'guide']:
    start[i] = t; snd.append(['pencil_soft', t, 0.22]); t += 0.32
start.update({i: 1.7 for i in range(len(S)) if S[i][0] == 'sky'})
plan = [('bg', 2.3, 0.26, 'card_slide_soft', 0.2), ('rope', 3.7, 0.16, 'block_tap_soft', 0.14), ('flat', 4.1, 0.2, 'paper_slap_soft', 0.2),
        ('shade', 5.5, 0.11, 'block_tap_soft', 0.1), ('detail', 6.9, 0.115, 'block_tap_soft', 0.13), ('front', 8.9, 0.22, 'paper_slap_soft', 0.2)]
for st, t0, gap, sound, vol in plan:
    k = 0
    for i in range(len(S)):
        if S[i][0] == st:
            start[i] = t0 + k * gap
            snd.append([sound, start[i], vol * (0.8 + 0.4 * ((i * 37) % 5) / 5)])
            k += 1
T_TITLE, T_SUB, CPS = 9.9, 11.0, 14.0
for j, ch in enumerate(TITLE[0]):
    if ch != ' ':
        snd.append(['tick', T_TITLE + j / CPS - 0.02, 0.17])
subtxt = ''.join(SUB)
for j, ch in enumerate(subtxt):
    if ch != ' ':
        snd.append(['tick', T_SUB + j / (CPS * 1.5) - 0.02, 0.12])

# ---- the stage: every piece once, hidden; frames only change opacity, offset and dash
font = 'file://' + os.path.abspath(os.path.join(HERE, '..', 'fonts', 'SpecialElite.ttf'))
body = ''.join(f'<g id="p{i}" opacity="0"' + (' stroke-dasharray="1" stroke-dashoffset="1"' if S[i][0] == 'guide' else '') + f'>{S[i][1]}</g>' for i in idx)
html = f'''<!doctype html><html><head><style>@font-face{{font-family:'Special Elite';src:url('{font}')}}
html,body{{margin:0;background:{PAL["paper"]}}}svg{{display:block}}</style></head><body>
<svg id="stage" xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs>{GRAIN}</defs>
<g id="CAM">{body}</g><g id="DT"></g></svg></body></html>'''
open(os.path.join(OUT, 'base.html'), 'w').write(html)

ease = lambda u: 0.5 - 0.5 * math.cos(math.pi * max(0.0, min(1.0, u)))
with open(os.path.join(OUT, 'frames.ndjson'), 'w') as fh:
    for f in range(int(FPS * DUR)):
        t = f / FPS
        tq = math.floor(t * 12) / 12
        o, tr, at = {}, {}, {}
        for i in range(len(S)):
            st = S[i][0]
            if st == 'guide':
                p = ease((t - start[i]) / 0.55)
                o[f'p{i}'] = 1 if t >= start[i] else 0
                at[f'p{i}'] = {'stroke-dashoffset': f'{1 - p:.3f}'}
            elif st == 'sky':
                o[f'p{i}'] = round(ease((t - start[i]) / 0.7), 3)
            else:
                n = int((tq - start[i]) * 12 + 1e-6)            # drawings since it arrived: 0, 1, 2 -> placed
                if tq < start[i]:
                    o[f'p{i}'] = 0
                else:
                    o[f'p{i}'] = [0.55, 0.85, 1][min(n, 2)]
                    dy = [-14, -4, 0][min(n, 2)] if st != 'shade' else 0
                    tr[f'p{i}'] = f'translate(0 {dy})'
        s = 1.0 + 0.06 * ease(t / DUR)
        tr['CAM'] = f'translate({HX - 120} {HY + 60}) scale({s:.5f}) translate({-(HX - 120)} {-(HY + 60)})'
        n1 = int(max(0, min(len(TITLE[0]), (tq - T_TITLE) * CPS)))
        n2 = int(max(0, min(len(subtxt), (tq - T_SUB) * CPS * 1.5)))
        rule = ease((t - (T_TITLE + len(TITLE[0]) / CPS)) / 0.35)
        fh.write(json.dumps({'t': tr, 'o': o, 'a': at, 'h': {'DT': title_svg(n1, n2, rule) if n1 else ''}}) + '\n')
json.dump({'dur': DUR, 'bed': ['forest_birds', 0.2], 'sounds': snd}, open(os.path.join(OUT, 'events.json'), 'w'))
print('ok', len(S), 'pieces')
