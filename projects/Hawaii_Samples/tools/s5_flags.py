# Sample 5, "Same frame, different flag": match cuts between the illustration and the 1898 photograph. 14 s.
# The poster ʻIolani Palace and the Library of Congress photograph of the annexation ceremony are registered on the
# palace itself (the central tower's axis, width and window row), so every hard cut lands on the same building in
# the same place. One camera push runs across all the cuts (horizon-montage's idea: a global camera through hard cuts).
# The cuts quicken; in each return to the illustration the Hawaiian flag is lower; then the U.S. flag goes up.
import os, math
import s4_window as P                               # the palace drawing (sky, facade, palms) from sample 4
from facet import poly
from kit import *

S = Stage('s5_flags', 14.0, bg='#111111', grain=0.55)
S.defs.append(COMMON_DEFS)
I = lambda p: os.path.join(ROOT, p)

# ---- shot 1: the illustration (no window cut-out needed here)
S.world.append('<g id="illus">' + ''.join(P.B) + ''.join(P.pal) +
               f'<path d="{P.win_path()}" fill="#2c3330"/><line x1="{P.WX}" y1="{P.WTOP + 4}" x2="{P.WX}" y2="{P.WBOT}" stroke="#ddd3bb" stroke-width="2.5"/>'
               + '<g id="flag"></g>' + P.palm(210, P.GY + 30, 520, 0.12, 1) + P.palm(1700, P.GY + 30, 560, -0.1, 2) + '</g>')
# ---- shot 2: the photograph, registered on the tower axis (x 1003 -> 960) and the tower's window row (y 520 -> 310)
K = 200 / 252
ph = S.img(I('img/raw/loc_annexation_ceremony.jpg'))
pw, phh = 1536 * K, 1240 * K
px, py = 960 - 1003 * K, 285 - 520 * K
S.world.append(f'<g id="photo" opacity="0"><rect x="-400" y="-600" width="2800" height="2200" fill="#111"/>'
               f'<image href="{ph}" x="{px:.1f}" y="{py:.1f}" width="{pw:.1f}" height="{phh:.1f}" filter="url(#bw)"/></g>')
S.over.append('<g id="ov"></g>')

# ---- the cut list: (start, shot, flag) flag = ('hi', drop px) or ('us', rise 0..1) or None
CUTS = [(0.0, 'illus', ('hi', 0)), (2.6, 'photo', None), (4.2, 'illus', ('hi', 45)), (5.2, 'photo', None),
        (6.0, 'illus', ('hi', 95)), (6.6, 'photo', None), (7.05, 'illus', ('hi', 140)), (7.4, 'photo', None),
        (7.7, 'illus', None), (7.95, 'photo', None), (8.2, 'illus', ('us', None))]
cam = Camera([(0.0, 960, 215, 2.42), (14.0, 960, 190, 2.95)], wobble=0.8)
S.bed = ['forest_birds', 0.18]
for k, (t, shot, fl) in enumerate(CUTS[1:]):
    S.sound('tick', t - 0.02, 0.42)
S.sound('whoosh', 2.55, 0.25)
S.sound('stinger-serious-low', 8.15, 0.5)
S.sound('swell-soft-3s', 8.4, 0.3)
T_T = 10.6
S.sound('stamp-thud', T_T, 0.35)
FX, FTOP = P.FX, P.FY - 136                         # pole x, the flag's top position


def flag_svg(kind, drop, tq):
    fw, fh = 92, 56
    y0 = FTOP + drop
    o = ''
    def Pt(u, v):
        return (FX + u * fw, y0 + v * fh + math.sin(u * 5 - tq * 6) * (2 + 6 * u) + u * 4)
    if kind == 'hi':
        for i in range(8):
            u0, u1 = i / 8, (i + 1) / 8
            for j in range(8):
                v0, v1 = j / 8, (j + 1) / 8
                o += poly([Pt(u0, v0), Pt(u1, v0), Pt(u1, v1), Pt(u0, v1)], ['#f4efe6', '#c0392b', '#2c4f8c'][j % 3])
        o += poly([Pt(0, 0), Pt(0.45, 0), Pt(0.45, 0.5), Pt(0, 0.5)], '#24407a')
        a, b, c, d = Pt(0, 0.25), Pt(0.45, 0.25), Pt(0.22, 0), Pt(0.22, 0.5)
        o += f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="#f4efe6" stroke-width="5"/><line x1="{c[0]:.1f}" y1="{c[1]:.1f}" x2="{d[0]:.1f}" y2="{d[1]:.1f}" stroke="#f4efe6" stroke-width="5"/>'
        o += f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="#c0392b" stroke-width="2.5"/><line x1="{c[0]:.1f}" y1="{c[1]:.1f}" x2="{d[0]:.1f}" y2="{d[1]:.1f}" stroke="#c0392b" stroke-width="2.5"/>'
    else:
        for i in range(8):
            u0, u1 = i / 8, (i + 1) / 8
            for j in range(13):
                v0, v1 = j / 13, (j + 1) / 13
                o += poly([Pt(u0, v0), Pt(u1, v0), Pt(u1, v1), Pt(u0, v1)], '#b22234' if j % 2 == 0 else '#f4efe6')
        o += poly([Pt(0, 0), Pt(0.4, 0), Pt(0.4, 7 / 13), Pt(0, 7 / 13)], '#3c3b6e')
        for r in range(5):
            for c in range(6):
                q = Pt(0.04 + c * 0.062, 0.06 + r * 0.095)
                o += f'<circle cx="{q[0]:.1f}" cy="{q[1]:.1f}" r="1.6" fill="#f4efe6"/>'
    return o


def frame(t):
    tq = step12(t)
    cur = [c for c in CUTS if c[0] <= t][-1]
    shot, fl = cur[1], cur[2]
    fs = ''
    if fl:
        if fl[0] == 'hi':
            fs = flag_svg('hi', fl[1], tq)
        else:
            rise = ease_out((tq - 8.2) / 1.9, 2)
            fs = flag_svg('us', 150 * (1 - rise), tq)
    o = ''
    if shot == 'photo':
        o += tag(110, 1040, 'ANNEXATION CEREMONY, ʻIOLANI PALACE, AUGUST 1898 · LIBRARY OF CONGRESS', 18, '#e8e1d2')
    else:
        o += tag(110, 1040, 'ʻIOLANI PALACE · ILLUSTRATION', 18, '#3a3934')
    if t < 2.5:
        o += slip(120, 290, 'ʻIolani Palace, 1891', 30, clamp((tq - 0.4) / 0.9))
    if 2.6 <= t < 4.2:
        o += slip(120, 290, 'the same palace, 1898', 30, clamp((tq - 2.7) / 0.9), pink=True)
    if t > T_T:
        o += highlight(110, 170, 'August 12, 1898', 84, prog=clamp((t - T_T) / (8 / 30)))
        o += slip(120, 290, 'the Hawaiian flag comes down', 30, clamp((tq - T_T - 0.5) / 1.0))
    return {'t': {'CAM': cam.transform(t)}, 'o': {'illus': 1 if shot == 'illus' else 0, 'photo': 1 if shot == 'photo' else 0},
            'h': {'flag': fs, 'ov': o}}


S.write(frame)
