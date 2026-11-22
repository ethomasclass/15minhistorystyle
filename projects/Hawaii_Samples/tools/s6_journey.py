# Sample 6, "One move": a 43-second illustrated journey with four fly-through transitions and one hard cut.
#   harbour -> (porthole) -> the Boston's wardroom -> (framed picture) -> ʻIolani Palace -> (tower window)
#   -> the Queen's room -> (the page on her desk) -> her words -> CUT -> the archival portrait on the desk.
# All illustration until the cut; the cut shows how the illustrated mode hands over to archival pictures on the desk.
import os, sys, math
import numpy as np
import s4_window as P                               # the palace drawing from sample 4
import facet as F
from facet import facets, poly, PAL, hill_h, ridge_h, tones
from figures import person, SKIN, tint
from kit import *
from portal import Scene, Journey

S = Stage('s6_journey', 43.0, bg='#111111', grain=0.5)
S.defs.append(COMMON_DEFS)
I = lambda p: os.path.join(ROOT, p)
F.seed(31)
rng = np.random.default_rng(5)
BIG = lambda col, y0=-3000, y1=5000: f'<rect x="-4000" y="{y0}" width="10000" height="{y1 - y0}" fill="{col}"/>'
rect = lambda x, y, w, h, col, extra='': f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{col}" {extra}/>'
circ = lambda x, y, r, col, extra='': f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{col}" {extra}/>'

# ================================================================== scene 1: Honolulu harbour, January 1893
HOR = 620
s1 = BIG(PAL['sky'], -3000, HOR) + f'<rect x="-4000" y="{HOR - 260}" width="10000" height="260" fill="#c9d4cb" opacity="0.75"/>'
s1 += F.cloud2(420, 250, 880, 220, PAL['cream'], belly='#e2d3ac', n=9) + F.cloud2(1560, 170, 640, 150, PAL['cream2'], belly='#d8c79d', n=8)
dh = [(-200, HOR), (150, HOR - 20), (300, HOR - 70), (420, HOR - 110), (520, HOR - 128), (610, HOR - 170), (690, HOR - 205), (740, HOR - 168),
      (830, HOR - 132), (940, HOR - 84), (1060, HOR - 40), (1200, HOR - 8), (1400, HOR)]
s1 += facets(dh, ['#5f6f5a', '#74846a', '#8a9879', '#a3ad8c'], ridge_h(0.02, 60, 0.1), cell=70, contrast=1.0)   # Lēʻahi (Diamond Head)
s1 += poly([(-4000, HOR - 6), (1700, HOR - 6), (1700, HOR + 4), (-4000, HOR + 4)], '#56684a')
s1 += BIG('#6f9997', HOR, 5000) + f'<rect x="-4000" y="{HOR + 150}" width="10000" height="4000" fill="#5d8a8a"/><rect x="-4000" y="{HOR + 330}" width="10000" height="4000" fill="#4f7b7d"/>'
for k in range(70):                                   # flat wave strokes
    x, y = rng.uniform(-300, 2200), rng.uniform(HOR + 14, 1200)
    w = rng.uniform(40, 170) * (0.5 + (y - HOR) / 500)
    s1 += poly([(x, y), (x + w, y - 2), (x + w * 0.9, y + 5), (x + w * 0.1, y + 6)], '#a9c6c0' if k % 3 else '#3f6a6e', 'opacity="0.55"')
# the USS Boston at anchor
WL, DK = 770, 700
hull = [(610, DK), (1500, DK), (1560, DK - 6), (1520, WL), (640, WL), (600, DK + 20)]
s1 += poly([(640, WL), (1520, WL), (1500, WL + 70), (680, WL + 70)], '#2f5559', 'opacity="0.55"')       # reflection
s1 += poly(hull, '#ece4d0') + poly([(605, DK + 34), (1548, DK + 26), (1520, WL), (640, WL)], '#d3c9b0')
s1 += poly([(640, WL - 9), (1524, WL - 9), (1520, WL), (640, WL)], '#8f3b2e')
s1 += rect(760, DK - 40, 560, 40, '#d9c08a') + rect(760, DK - 40, 560, 8, '#c4a96f')                        # deckhouse
s1 += rect(990, DK - 150, 62, 112, '#c9a86a') + rect(990, DK - 150, 62, 22, '#2c2a26') + rect(1040, DK - 150, 12, 112, '#000', 'opacity="0.12"')
for mx, mh in ((830, 330), (1240, 310)):                # masts, tops and yards
    s1 += f'<line x1="{mx}" y1="{DK - 40}" x2="{mx}" y2="{DK - mh}" stroke="#3a3229" stroke-width="7"/>'
    s1 += rect(mx - 20, DK - mh * 0.62, 40, 12, '#3a3229') + f'<line x1="{mx - 70}" y1="{DK - mh * 0.8}" x2="{mx + 70}" y2="{DK - mh * 0.8}" stroke="#3a3229" stroke-width="4"/>'
    for dx in (-150, 150):
        s1 += f'<line x1="{mx}" y1="{DK - mh + 12}" x2="{mx + dx}" y2="{DK - 4}" stroke="#3a3229" stroke-width="1.4" opacity="0.7"/>'
s1 += f'<line x1="830" y1="{DK - 322}" x2="1240" y2="{DK - 302}" stroke="#3a3229" stroke-width="1.4" opacity="0.7"/>'
for gx, d in ((690, -1), (1430, 1)):                    # guns behind shields
    s1 += f'<line x1="{gx}" y1="{DK - 16}" x2="{gx + d * 70}" y2="{DK - 22}" stroke="#2c2a26" stroke-width="8"/>' + poly([(gx - 22, DK), (gx + 22, DK), (gx + 16, DK - 30), (gx - 16, DK - 30)], '#b9ad94')
for bx in (880, 1120):                                  # boats on davits
    s1 += poly([(bx, DK - 62), (bx + 90, DK - 62), (bx + 78, DK - 46), (bx + 12, DK - 46)], '#f1e9d6') + f'<line x1="{bx + 10}" y1="{DK - 40}" x2="{bx + 10}" y2="{DK - 74}" stroke="#3a3229" stroke-width="3"/><line x1="{bx + 80}" y1="{DK - 40}" x2="{bx + 80}" y2="{DK - 74}" stroke="#3a3229" stroke-width="3"/>'
s1 += f'<line x1="640" y1="{DK}" x2="628" y2="{DK - 80}" stroke="#3a3229" stroke-width="3"/>' + rect(590, DK - 80, 38, 5, '#b22234') + rect(590, DK - 75, 38, 5, '#f4efe6') + rect(590, DK - 70, 38, 5, '#b22234') + rect(590, DK - 65, 38, 5, '#f4efe6') + rect(608, DK - 80, 20, 11, '#3c3b6e')
PH = (1040.0, 736.0, 9.0)                               # the porthole we fly through
for px in range(700, 1480, 44):
    if abs(px - PH[0]) > 20:
        s1 += circ(px + 4, 736, 4.2, '#3a3934')
s1 += circ(PH[0], PH[1], PH[2] + 2.6, '#a8833c') + circ(PH[0], PH[1], PH[2] + 0.6, '#6d5527')
s1 += P.palm(150, 930, 520, 0.14, 11) + P.palm(40, 960, 400, 0.22, 12)
s1 += poly([(-4000, 900), (330, 900), (420, 940), (470, 1010), (480, 5000), (-4000, 5000)], '#8f8a52') + poly([(-4000, 900), (330, 900), (420, 940), (-4000, 930)], '#b3ad6a')
hole1 = f'M{PH[0] - PH[2]},{PH[1]} a{PH[2]},{PH[2]} 0 1 0 {2 * PH[2]},0 a{PH[2]},{PH[2]} 0 1 0 {-2 * PH[2]},0 Z'
F1 = (PH[0], PH[1], 2 * PH[2] * 0.8716)

# ================================================================== scene 2: the wardroom of the Boston
WOOD = ['#5a4130', '#6b4f37', '#7d5e42', '#8f6e4f']
s2 = BIG(WOOD[1])
for x in range(-2000, 4000, 120):
    s2 += rect(x, -3000, 4, 8000, WOOD[0], 'opacity="0.55"')
s2 += rect(-4000, -3000, 10000, 3110, '#3d2c1f') + rect(-4000, 96, 10000, 14, WOOD[3])                 # deckhead and a beam
for x in range(-1900, 4000, 420):
    s2 += rect(x, -3000, 46, 3096, '#33251a')
s2 += rect(-4000, 640, 10000, 14, WOOD[3]) + rect(-4000, 654, 10000, 5000, WOOD[0])                    # dado rail, lower wall
s2 += rect(-4000, 900, 10000, 5000, '#2e2219')                                                          # deck
for px in (300, 560):                                   # two portholes with daylight and the sea
    s2 += circ(px, 360, 78, '#a8833c') + circ(px, 360, 66, '#c9d4cb') + f'<path d="M{px - 66},{372} A66,66 0 0 0 {px + 66},{372} Z" fill="#6f9997"/>' + circ(px, 360, 66, 'none', 'stroke="#6d5527" stroke-width="6"')
    for a in range(0, 360, 60):
        s2 += circ(px + 72 * math.cos(math.radians(a)), 360 + 72 * math.sin(math.radians(a)), 4, '#6d5527')
s2 += '<radialGradient id="lampg" gradientUnits="userSpaceOnUse" cx="930" cy="330" r="620"><stop offset="0" stop-color="#f6d998" stop-opacity="0.42"/><stop offset="1" stop-color="#f6d998" stop-opacity="0"/></radialGradient>' + rect(200, -300, 1500, 1300, 'url(#lampg)')
s2 += f'<line x1="930" y1="110" x2="930" y2="230" stroke="#6d5527" stroke-width="5"/>' + poly([(880, 290), (980, 290), (955, 232), (905, 232)], '#b8902f') + poly([(930, 290), (980, 290), (955, 232), (930, 232)], '#8f6f22') + circ(930, 304, 18, '#f6e2a8')
# the framed picture: the way on to the palace
FR = (1360.0, 385.0, 380.0)
fw2, fh2 = FR[2], FR[2] * 9 / 16
s2 += rect(FR[0] - fw2 / 2 - 34, FR[1] - fh2 / 2 - 34, fw2 + 68, fh2 + 68, '#000', 'opacity="0.35" filter="url(#soft4)"')
s2 += rect(FR[0] - fw2 / 2 - 30, FR[1] - fh2 / 2 - 30, fw2 + 60, fh2 + 60, '#a8833c') + rect(FR[0] - fw2 / 2 - 22, FR[1] - fh2 / 2 - 22, fw2 + 44, fh2 + 44, '#c9a23a') + rect(FR[0] - fw2 / 2 - 8, FR[1] - fh2 / 2 - 8, fw2 + 16, fh2 + 16, '#6d5527')
hole2 = f'M{FR[0] - fw2 / 2},{FR[1] - fh2 / 2} h{fw2} v{fh2} h{-fw2} Z'
s2 += circ(1700, 300, 46, '#a8833c') + circ(1700, 300, 38, '#f1e7cf') + f'<line x1="1700" y1="300" x2="1700" y2="272" stroke="#2c2a26" stroke-width="4"/><line x1="1700" y1="300" x2="1722" y2="308" stroke="#2c2a26" stroke-width="4"/>'
# the officer at the table (legs hidden behind it), then the table and what lies on it
off, _ = person(470, 1010, 560, 'sit', facing=1, coat='#2c3a4d', coat_len=0.4, trousers='#f1e9d6', hat='cap', hat_col='#1f2a38', beard=True,
                belt=None, shadow=False, arm_b=38, elbow_b=58, arm_a=30, elbow_a=70, lean=8, head=10)
s2 += off
s2 += poly([(250, 760), (1650, 760), (1720, 830), (180, 830)], WOOD[3]) + rect(180, 830, 1540, 26, WOOD[2]) + rect(260, 856, 40, 400, WOOD[0]) + rect(1600, 856, 40, 400, WOOD[0])
chart = [(700, 772), (1180, 768), (1230, 822), (670, 826)]
s2 += poly(chart, '#efe6d2') + poly([(820, 790), (900, 782), (990, 786), (1060, 796), (1090, 808), (1010, 814), (930, 812), (850, 806)], '#b9c8a8') + \
    '<line x1="1120" y1="778" x2="1150" y2="816" stroke="#8f3b2e" stroke-width="2"/><line x1="1105" y1="800" x2="1168" y2="794" stroke="#8f3b2e" stroke-width="2"/>'
s2 += '<line x1="760" y1="812" x2="800" y2="780" stroke="#b8902f" stroke-width="5"/><line x1="800" y1="780" x2="826" y2="816" stroke="#b8902f" stroke-width="5"/>'
s2 += poly([(1330, 800), (1430, 800), (1420, 772), (1340, 772)], '#1f2a38') + rect(1330, 792, 100, 8, '#c9a23a') + poly([(1420, 800), (1470, 806), (1424, 808)], '#111')
s2 += poly([(560, 800), (610, 800), (604, 768), (566, 768)], '#f1e9d6') + rect(556, 800, 58, 6, '#d9c9a0')

# ================================================================== scene 3: ʻIolani Palace (from sample 4)
s3 = ''.join(P.B) + ''.join(P.pal) + f'<path d="{P.win_path()}" fill="none" stroke="#bdb29a" stroke-width="1.6"/>' + '<g id="flag3"></g>' + \
    '<g id="palms3">' + P.palm(210, P.GY + 30, 520, 0.12, 1) + P.palm(1700, P.GY + 30, 560, -0.1, 2) + P.palm(1790, P.GY + 40, 400, -0.18, 3) + P.palm(120, P.GY + 40, 380, 0.2, 4) + '</g>'
s3 = BIG(PAL['sky'], -3000, 400) + BIG(PAL['olive_lt'][2], 1300, 5000) + s3
hole3 = P.win_path()
F3 = (P.WX, 308.5, 22.0)

# ================================================================== scene 4: the Queen's room
s4 = BIG('#2a3a33') + rect(-4000, 120, 10000, 12, '#6b5338') + rect(-4000, 700, 10000, 5000, '#3b2f25') + rect(-4000, 690, 10000, 14, '#6b5338') + rect(-4000, 940, 10000, 5000, '#241c16')
s4 += '<radialGradient id="roomg" gradientUnits="userSpaceOnUse" cx="1250" cy="430" r="900"><stop offset="0" stop-color="#f4d9a0" stop-opacity="0.30"/><stop offset="1" stop-color="#f4d9a0" stop-opacity="0"/></radialGradient>' + rect(-200, -400, 2600, 1700, 'url(#roomg)')
s4 += rect(150, 160, 300, 540, '#ece4d0') + rect(166, 176, 268, 508, '#b9cdc7') + rect(296, 176, 8, 508, '#ece4d0') + rect(166, 420, 268, 8, '#ece4d0')
s4 += poly([(166, 560), (240, 500), (300, 540), (380, 470), (434, 520), (434, 684), (166, 684)], '#7a8648')                    # garden beyond the glass
s4 += poly([(120, 150), (200, 150), (176, 700), (110, 700)], '#d9cdb0') + poly([(400, 150), (480, 150), (490, 700), (424, 700)], '#d9cdb0')   # curtains
for kx, col in ((1640, '#a9473a'), (1760, '#dfb43a')):  # kāhili, the feather standards of the aliʻi
    s4 += f'<line x1="{kx}" y1="930" x2="{kx}" y2="250" stroke="#6b4327" stroke-width="9"/>' + rect(kx - 34, 190, 68, 190, col, 'rx="30"') + rect(kx, 190, 34, 190, '#000', 'rx="30" opacity="0.14"') + poly([(kx - 40, 940), (kx + 40, 940), (kx + 22, 900), (kx - 22, 900)], '#4a3222')
queen, _ = person(1010, 940, 600, 'stand', facing=1, coat='#2b2630', dress=True, strap='#e6d6ae', hair='#2a2622', skin=SKIN[1], shadow=False,
                  arm_b=30, elbow_b=34, arm_a=14, elbow_a=26, lean=6, head=16)
s4 += queen
s4 += poly([(700, 640), (1560, 640), (1650, 760), (610, 760)], '#8a5a35') + poly([(700, 640), (1560, 640), (1566, 648), (694, 648)], '#a87245')   # the koa desk top
s4 += rect(610, 760, 1040, 30, '#6b4327') + rect(640, 790, 980, 150, '#5a371f') + rect(680, 810, 260, 110, '#6b4327') + rect(1320, 810, 260, 110, '#6b4327') + circ(810, 865, 9, '#c9a23a') + circ(1450, 865, 9, '#c9a23a')
PG = (1250.0, 702.0, 176.0, -7.0)                       # the page: centre, width, tilt
pw4, ph4 = PG[2], PG[2] * 9 / 16
page_t = f'rotate({PG[3]} {PG[0]} {PG[1]})'
s4 += f'<g transform="{page_t}">' + rect(PG[0] - pw4 / 2 - 34, PG[1] - ph4 / 2 + 18, pw4 + 40, ph4, '#e2d6b8') + rect(PG[0] - pw4 / 2 - 3, PG[1] - ph4 / 2 - 3, pw4 + 6, ph4 + 6, '#cfc2a0') + '</g>'
c, s_ = math.cos(math.radians(PG[3])), math.sin(math.radians(PG[3]))
corner = lambda dx, dy: (PG[0] + dx * c - dy * s_, PG[1] + dx * s_ + dy * c)
q4 = [corner(-pw4 / 2, -ph4 / 2), corner(pw4 / 2, -ph4 / 2), corner(pw4 / 2, ph4 / 2), corner(-pw4 / 2, ph4 / 2)]
hole4 = 'M' + ' L'.join(f'{x:.2f},{y:.2f}' for x, y in q4) + ' Z'
s4 += circ(1440, 690, 30, '#1c1a17') + circ(1440, 684, 20, '#2c3a4d') + '<line x1="1380" y1="738" x2="1470" y2="660" stroke="#f1e9d6" stroke-width="5"/>' + poly([(1470, 660), (1492, 632), (1478, 664)], '#f1e9d6')
s4 += rect(820, 596, 14, 60, '#b8902f') + poly([(760, 600), (894, 600), (866, 540), (788, 540)], '#3f5a4c') + rect(800, 652, 54, 10, '#8f6f22')
s4 += poly([(900, 700), (1060, 694), (1072, 730), (906, 738)], '#efe6d2') + poly([(910, 690), (1066, 684), (1060, 694), (900, 700)], '#d9cdb0')

# ================================================================== scene 5: the page
s5 = BIG('#f1e7cf')
for k in range(60):
    y = rng.uniform(-200, 1300); x = rng.uniform(-300, 2100)
    s5 += f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x + rng.uniform(-60, 60):.0f}" y2="{y + rng.uniform(-14, 14):.0f}" stroke="#b9ab88" stroke-width="2" opacity="0.35"/>'
s5 += '<g id="words"></g>'

SC = [Scene('harbour', s1, hole1, F1, keys=[(0.0, 900, 520, 1.0), (3.6, 980, 560, 1.16), (4.4, 1000, 590, 1.24)]),
      Scene('wardroom', s2, hole2, FR, keys=[(8.6, 880, 560, 1.16), (11.2, 1020, 520, 1.3), (12.2, 1100, 480, 1.4)]),
      Scene('palace', s3, hole3, F3, keys=[(16.8, 960, 520, 1.14), (19.6, 960, 460, 1.4), (20.6, 960, 400, 1.7)]),
      Scene('room', s4, hole4, PG, keys=[(25.2, 1040, 520, 1.16), (27.8, 1120, 560, 1.34), (28.8, 1180, 620, 1.55)]),
      Scene('page', s5, None, None, keys=[(33.2, 960, 540, 1.12), (38.5, 960, 540, 1.2)])]
T = [0.0, 7.0, 15.0, 23.5, 31.5, 38.5]
J = Journey(SC, T)
jd, jb = J.markup()
S.defs.append(jd)
S.world.append(jb)

# ---- after the cut: the archival portrait on the desk (the channel's other mode)
por = S.img(I('img/raw/loc_liliuokalani_1891.jpg'))
cut = f'<image href="{S.img(I("img/desk.jpg"))}" x="-200" y="-150" width="2400" height="1470" preserveAspectRatio="none"/>'
for gx in range(-200, 2200, 80):
    cut += f'<line x1="{gx}" y1="-150" x2="{gx}" y2="1320" stroke="#f4efe6" stroke-width="1" opacity="0.05"/>'
for gy in range(-150, 1320, 80):
    cut += f'<line x1="-200" y1="{gy}" x2="2200" y2="{gy}" stroke="#f4efe6" stroke-width="1" opacity="0.05"/>'
cut += card(por, 1010, 110, 620, 787, rot=2.5)
cut += f'<g transform="rotate(2.5 1320 503)">' + tag(994, 950, 'LILIʻUOKALANI, c. 1891 · LIBRARY OF CONGRESS PPMSCA-53150', 18, '#d9d2c4') + '</g>'
S.over.append(f'<g id="CUT" opacity="0">{cut}</g><g id="ov"></g>')
T_CUT = T[5]
cutcam = Camera([(T_CUT, 1000, 540, 1.04), (43.0, 1080, 520, 1.12)], wobble=1.0)

# ---- sound: one ambience per place, a whoosh into each frame, a soft landing
amb = [('waves_beach', 0.0, 0.5, 7.4), ('rope_creak', 7.0, 0.3, 8.2), ('ambience-room-tone-30s', 7.0, 0.5, 8.2), ('forest_birds', 15.0, 0.4, 8.8),
       ('ambience-room-tone-30s', 23.5, 0.55, 8.2), ('clock-tick', 24.5, 0.12, 6.5)]
for name, t0, vol, dur in amb:
    S.sounds.append([name, t0, vol, 0.8, 0.6, dur])
for k in range(1, 5):
    S.sound('whoosh', T[k] - 1.15, 0.34)
    S.sound('swell-soft-3s', T[k] - 2.6, 0.22)
    S.sound('impact-wood-light', T[k] + 0.05, 0.16)
S.sounds.append(['quill', 32.6, 0.4, 0.3, 0.1, 4.4])
S.sound('stamp-thud', 36.6, 0.35)
S.sound('whoosh', T_CUT - 0.05, 0.45)
S.sound('paper_slap_soft', T_CUT + 0.02, 0.6)
S.sounds.append(['ambience-room-tone-30s', T_CUT, 0.5, 0.8, 0.1, 4.5])
LABELS = [(0.6, 4.6, 'Honolulu Harbor, January 1893'), (8.2, 12.4, 'aboard the USS Boston'), (16.4, 20.4, 'ʻIolani Palace'), (24.8, 28.6, 'inside the palace')]
L1 = '“I yield to the superior force'
L2 = 'of the United States of America …'
L3 = 'I do this under protest …”'


def frame(t):
    tq = step12(t)
    a, Tm, Om = J.frame(t)
    h = {}
    if t >= T_CUT:
        Om = {k: 0 for k in Om}
        Om['CUT'] = 1
        Tm['CUT'] = cutcam.transform(t)
    else:
        Om['CUT'] = 0
    # the flag on the palace, on twos
    f = ''
    if 2 in [int(k[1:]) for k, v in Om.items() if v and k != 'CUT']:
        fw, fh, FX, FY0 = 92, 56, P.FX, P.FY - 136
        def Pt(u, v):
            return (FX + u * fw, FY0 + v * fh + math.sin(u * 5 - tq * 6) * (2 + 6 * u) + u * 4)
        for i in range(8):
            for j in range(8):
                f += poly([Pt(i / 8, j / 8), Pt((i + 1) / 8, j / 8), Pt((i + 1) / 8, (j + 1) / 8), Pt(i / 8, (j + 1) / 8)], ['#f4efe6', '#c0392b', '#2c4f8c'][j % 3])
        f += poly([Pt(0, 0), Pt(0.45, 0), Pt(0.45, 0.5), Pt(0, 0.5)], '#24407a')
        a_, b_, c_, d_ = Pt(0, 0.25), Pt(0.45, 0.25), Pt(0.22, 0), Pt(0.22, 0.5)
        f += f'<line x1="{a_[0]:.1f}" y1="{a_[1]:.1f}" x2="{b_[0]:.1f}" y2="{b_[1]:.1f}" stroke="#f4efe6" stroke-width="5"/><line x1="{c_[0]:.1f}" y1="{c_[1]:.1f}" x2="{d_[0]:.1f}" y2="{d_[1]:.1f}" stroke="#f4efe6" stroke-width="5"/>'
        f += f'<line x1="{a_[0]:.1f}" y1="{a_[1]:.1f}" x2="{b_[0]:.1f}" y2="{b_[1]:.1f}" stroke="#c0392b" stroke-width="2.5"/><line x1="{c_[0]:.1f}" y1="{c_[1]:.1f}" x2="{d_[0]:.1f}" y2="{d_[1]:.1f}" stroke="#c0392b" stroke-width="2.5"/>'
    h['flag3'] = f
    # the words on the page (written on, stepped)
    wd = ''
    t0 = 32.4
    wd += text(250, 250, 'HONOLULU · JANUARY 17, 1893', 30, 'Plex', '#6b6047', extra='letter-spacing="5"')
    for j, (ln, ts) in enumerate([(L1, t0), (L2, t0 + 1.4), (L3, t0 + 3.0)]):
        n = int(len(ln) * clamp((tq - ts) / 1.25))
        if n > 0:
            wd += text(250, 430 + j * 124, ln[:n], 86, 'Playfair7', '#1d1812')
    u = clamp((tq - (t0 + 4.2)) / 0.5)
    wd += drawn_path('M250,716 C520,726 860,710 1120,720', u, TEAL, 9)
    h['words'] = wd
    # overlay: place names, credits, the title
    o = ''
    for a0, a1, s_ in LABELS:
        if a0 < t < a1:
            o += slip(120, 990, s_, 30, clamp((tq - a0) / 0.9))
    if t < T_CUT:
        o += tag(1810, 1040, 'ILLUSTRATION' if t < 31.5 else 'HER WORDS, AS QUOTED IN PUBLIC LAW 103-150 · ILLUSTRATION', 17, '#f4efe6' if 7 < t < 15 or 23.5 < t < 31.5 else '#3a3934', 'end')
    if 36.6 < t < T_CUT:
        o += highlight(250, 900, 'Under protest', 84, prog=clamp((t - 36.6) / (8 / 30)))
    if t >= T_CUT + 0.5:
        o += highlight(110, 170, 'Liliʻuokalani', 88, prog=clamp((t - T_CUT - 0.5) / (8 / 30)))
        o += slip(120, 290, 'Queen of Hawaiʻi, 1891–1893', 30, clamp((tq - T_CUT - 1.0) / 1.0))
    h['ov'] = o
    return {'t': Tm, 'o': Om, 'h': h}


if __name__ == '__main__':
    S.write(frame)
