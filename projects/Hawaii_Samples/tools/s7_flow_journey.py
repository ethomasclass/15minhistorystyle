# Sample 7: the portal journey with Google Flow artwork. 44.5 s.
#   harbour --push, hard cut (motion carried)--> hull close-up -> (porthole) -> wardroom -> (framed picture) -> palace
#   --push, hard cut--> tower close-up -> (window) -> the Queen's room -> (the page) -> her words --CUT--> archival
#   portrait on the teal gridded desk.
# Flow plates are paintings (1376x768), so they cannot be zoomed a hundredfold like the code drawings: wide -> close-up
# steps are fast pushes cut on the move (the channel's `carry`), and the four doorway fly-throughs stay.
# Needs: python3 tools/flow_prep.py (from the project folder) first.
import os, json, math
import numpy as np
from kit import *
from portal import Scene, Journey

S = Stage('s7_flow_journey', 44.5, bg='#111111', grain=0.5)
S.defs.append(COMMON_DEFS)
I = lambda p: os.path.join(ROOT, p)
INFO = json.load(open(I('img/flow/flow.json')))
rng = np.random.default_rng(5)


def plate(name):
    """a Flow plate filling the 1920x1080 design space, with its edge colours as bleed beyond it"""
    e = INFO[name]['edges']
    return (f'<rect x="-6000" y="-6000" width="6000" height="14000" fill="{e["left"]}"/><rect x="1920" y="-6000" width="6000" height="14000" fill="{e["right"]}"/>'
            f'<rect x="-1" y="-6000" width="1922" height="6001" fill="{e["top"]}"/><rect x="-1" y="1079" width="1922" height="6000" fill="{e["bottom"]}"/>'
            f'<image href="{S.img(I(f"img/flow/{name}.jpg"))}" x="0" y="0" width="1920" height="1080"/>')


def cut(sheet, n, x, bottom, h, flip=False, shadow=True):
    """a cut-out figure standing with its feet at (x, bottom), h px tall"""
    c = INFO[sheet]['cutouts'][n - 1]
    w = c['w'] * h / c['h']
    o = ''
    if shadow:
        o += f'<ellipse cx="{x:.0f}" cy="{bottom - 6:.0f}" rx="{w * 0.5:.0f}" ry="{h * 0.03:.0f}" fill="#000" opacity="0.28"/>'
    t = f' transform="translate({2 * x:.1f} 0) scale(-1 1)"' if flip else ''
    return o + f'<image href="{S.img(I("img/flow/" + c["file"]))}" x="{x - w / 2:.1f}" y="{bottom - h:.1f}" width="{w:.1f}" height="{h:.1f}"{t}/>'


# ---- doorways from the detected magenta
g = INFO['p2_hull_porthole']
hole2 = f'M{g["cx"] - g["r"]},{g["cy"]} a{g["r"]},{g["r"]} 0 1 0 {2 * g["r"]},0 a{g["r"]},{g["r"]} 0 1 0 {-2 * g["r"]},0 Z'
F2 = (g['cx'], g['cy'], 2 * g['r'] * 0.8716 * 0.98)
g = INFO['p3_wardroom']
hole3 = f'M{g["x0"]},{g["y0"]} H{g["x1"]} V{g["y1"]} H{g["x0"]} Z'
w3 = min(g['x1'] - g['x0'], (g['y1'] - g['y0']) * 16 / 9)
F3 = ((g['x0'] + g['x1']) / 2, (g['y0'] + g['y1']) / 2, w3)
g = INFO['p5_tower_window']
aw = g['x1'] - g['x0']
hole5 = f'M{g["x0"]},{g["y1"]} V{g["y0"] + aw / 2} A{aw / 2},{aw / 2} 0 0 1 {g["x1"]},{g["y0"] + aw / 2} V{g["y1"]} Z'
F5 = ((g['x0'] + g['x1']) / 2, (g['y0'] + aw / 2 + g['y1']) / 2, aw * 0.98)
g = INFO['p6_queens_room']
q = g['quad']
hole6 = 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in q) + ' Z'
top_len = math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1])
side = math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1])
rot6 = math.degrees(math.atan2(q[1][1] - q[0][1], q[1][0] - q[0][0]))
F6 = (g['cx'], g['cy'], min(top_len * 0.9, side * 0.86 * 16 / 9), rot6)

# ---- scenes
s_harbour = plate('p1_harbour')
s_hull = plate('p2_hull_porthole')
s_ward = plate('p3_wardroom') + cut('c2_navy', 1, 330, 1150, 760)
s_palace = plate('p4_palace')
s_tower = plate('p5_tower_window')
s_room = plate('p6_queens_room') + cut('c1_queen', 2, 690, 1085, 800)
s_page = '<rect x="-6000" y="-6000" width="14000" height="14000" fill="#f1e7cf"/>'
for k in range(60):
    y = rng.uniform(-200, 1300); x = rng.uniform(-300, 2100)
    s_page += f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x + rng.uniform(-60, 60):.0f}" y2="{y + rng.uniform(-14, 14):.0f}" stroke="#b9ab88" stroke-width="2" opacity="0.35"/>'
s_page += '<g id="words"></g>'

T_C1, T_C2, T_CUT, END = 5.0, 22.0, 40.0, 44.5
JA = Journey([Scene('harbour', s_harbour, keys=[(0.0, 900, 520, 1.0), (3.2, 980, 600, 1.26), (T_C1, 1013, 676, 3.3)])], [0.0, T_C1], prefix='A')
JB = Journey([Scene('hull', s_hull, hole2, F2, keys=[(T_C1, 960, 520, 1.02), (T_C1 + 0.35, 960, 525, 1.15), (7.2, 960, 535, 1.27)]),
              Scene('wardroom', s_ward, hole3, F3, keys=[(11.4, 900, 570, 1.2), (13.6, 1150, 520, 1.36)]),
              Scene('palace', s_palace, keys=[(18.2, 960, 520, 1.15), (20.2, 958, 470, 1.5), (T_C2, 958, 432, 3.5)])],
             [T_C1, 9.6, 16.4, T_C2], prefix='B')
JC = Journey([Scene('tower', s_tower, hole5, F5, keys=[(T_C2, 960, 560, 1.02), (T_C2 + 0.35, 960, 565, 1.15), (24.2, 960, 600, 1.27)]),
              Scene('room', s_room, hole6, F6, keys=[(28.4, 900, 560, 1.18), (30.6, 1100, 650, 1.36)], m0=3.0),
              Scene('page', s_page, keys=[(35.0, 960, 540, 1.12), (T_CUT, 960, 540, 1.2)])],
             [T_C2, 26.6, 33.4, T_CUT], prefix='C')
for J in (JA, JB, JC):
    d_, b_ = J.markup()
    S.defs.append(d_); S.world.append(b_)

# ---- after the last cut: the archival portrait on the teal gridded desk
por = S.img(I('img/raw/loc_liliuokalani_1891.jpg'))
cutg = f'<image href="{S.img(I("img/desk_grid_teal.jpg"))}" x="-200" y="-150" width="2400" height="1350" preserveAspectRatio="xMidYMid slice"/>'
cutg += card(por, 1010, 110, 620, 787, rot=2.5)
cutg += '<g transform="rotate(2.5 1320 503)">' + tag(994, 950, 'LILIʻUOKALANI, c. 1891 · LIBRARY OF CONGRESS PPMSCA-53150', 18, '#d6f3ee') + '</g>'
S.over.append(f'<g id="CUT" opacity="0">{cutg}</g><g id="ov"></g>')
cutcam = Camera([(T_CUT, 1000, 540, 1.04), (END, 1080, 520, 1.12)], wobble=1.0)

# ---- sound
for name, t0, vol, dur in [('waves_beach', 0.0, 0.5, 9.9), ('rope_creak', 9.6, 0.3, 7.0), ('ambience-room-tone-30s', 9.6, 0.5, 7.0),
                           ('forest_birds', 16.4, 0.4, 10.4), ('ambience-room-tone-30s', 26.6, 0.55, 7.0), ('clock-tick', 27.6, 0.12, 5.4)]:
    S.sounds.append([name, t0, vol, 0.8, 0.6, dur])
for tc in (T_C1, T_C2):                                   # the carried cuts
    S.sound('whoosh', tc - 0.5, 0.42); S.sound('tick', tc - 0.02, 0.3)
for tp in (9.6, 16.4, 26.6, 33.4):                        # the fly-throughs
    S.sound('whoosh', tp - 1.15, 0.34); S.sound('swell-soft-3s', tp - 2.6, 0.22); S.sound('impact-wood-light', tp + 0.05, 0.16)
T_W = 34.4
S.sounds.append(['quill', T_W + 0.2, 0.4, 0.3, 0.1, 4.4])
S.sound('stamp-thud', T_W + 4.4, 0.35)
S.sound('whoosh', T_CUT - 0.05, 0.45); S.sound('paper_slap_soft', T_CUT + 0.02, 0.6)
S.sounds.append(['ambience-room-tone-30s', T_CUT, 0.5, 0.8, 0.1, 4.5])
LABELS = [(0.6, 4.0, 'Honolulu Harbor, January 1893'), (10.6, 14.2, 'aboard the USS Boston'), (17.2, 20.6, 'ʻIolani Palace'), (27.6, 31.2, 'inside the palace')]
LINES = ['“I yield to the superior force', 'of the United States of America …', 'I do this under protest …”']


def frame(t):
    tq = step12(t)
    Tm, Om = {}, {}
    for J in (JA, JB, JC):
        Om.update(J.hidden())
    if t >= T_CUT:
        Om['CUT'] = 1; Tm['CUT'] = cutcam.transform(t)
    else:
        Om['CUT'] = 0
        J = JA if t < T_C1 else (JB if t < T_C2 else JC)
        _, tj, oj = J.frame(t)
        Tm.update(tj); Om.update(oj)
    wd = text(250, 250, 'HONOLULU · JANUARY 17, 1893', 30, 'Plex', '#6b6047', extra='letter-spacing="5"')
    for j, ln in enumerate(LINES):
        n = int(len(ln) * clamp((tq - (T_W + j * 1.5)) / 1.25))
        if n > 0:
            wd += text(250, 430 + j * 124, ln[:n], 86, 'Playfair7', '#1d1812')
    wd += drawn_path('M250,716 C520,726 860,710 1120,720', clamp((tq - (T_W + 4.2)) / 0.5), TEAL, 9)
    o = ''
    for a0, a1, s_ in LABELS:
        if a0 < t < a1:
            o += slip(120, 990, s_, 30, clamp((tq - a0) / 0.9))
    if T_W + 4.4 < t < T_CUT:
        o += highlight(250, 900, 'Under protest', 84, prog=clamp((t - T_W - 4.4) / (8 / 30)))
    if t >= T_CUT + 0.5:
        o += highlight(110, 170, 'Liliʻuokalani', 88, prog=clamp((t - T_CUT - 0.5) / (8 / 30)))
        o += slip(120, 290, 'Queen of Hawaiʻi, 1891–1893', 30, clamp((tq - T_CUT - 1.0) / 1.0))
    return {'t': Tm, 'o': Om, 'h': {'words': wd, 'ov': o}}


if __name__ == '__main__':
    S.write(frame)
