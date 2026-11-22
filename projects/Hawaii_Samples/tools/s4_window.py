# Sample 4, "Through the palace window": from the poster illustration into the archive. 16 s.
# A faceted travel-poster ʻIolani Palace (the Retro_Poster_Test style). The camera pushes in on the central tower and
# keeps going, through an upper window (zoom in log space, onetake's zoom-through idea), into a dim room where her
# 1891 portrait hangs. The room sits deeper than the facade, so it grows more slowly: real parallax, no dissolve.
import os, sys, math
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'Retro_Poster_Test', 'tools'))
import facet as F
from facet import facets, poly, PAL, hill_h, ridge_h, ridgeline, tones, seed, rng
from kit import *

S = Stage('s4_window', 16.0, bg='#a7b9b6', grain=0.5)
S.defs.append(COMMON_DEFS)
I = lambda p: os.path.join(ROOT, p)
seed(7)

STONE = ['#a79c86', '#bdb29a', '#cfc4ab', '#ddd3bb', '#e8dfc8']
SLATE = ['#3f454c', '#535a62', '#666d74', '#7b8187']
DARK = '#2c2a26'
GY = 800                                            # ground line
B = []

# ---------------------------------------------------------------- sky, mountains, lawn
B.append(F.sky(PAL['sky'], '#c9d4cb', 820).replace(f'width="{F.W}"', 'width="2600" x="-340"').replace('height="820"', 'height="1100" y="-280"'))
B.append(F.cloud2(360, 260, 900, 230, PAL['cream'], belly='#e2d3ac', n=9))
B.append(F.cloud2(1580, 190, 700, 170, PAL['cream2'], belly='#d8c79d', n=8))
B.append(F.cloud2(1200, 480, 520, 110, PAL['sky2'], belly='#a9bab6', n=7))
B.append(F.seam(facets(ridgeline(-340, 2260, 640, 120, 90, 3.3), tones(PAL['mist2'], 4, 0.06), hill_h(0.004, 140), cell=110, contrast=0.8)))
B.append(F.mist(700, 120, op=0.5))
lawn = [(-340, GY - 10), (2260, GY - 10), (2260, 1400), (-340, 1400)]
B.append(F.seam(facets(lawn, PAL['olive_lt'], hill_h(0.003, 60), cell=150, contrast=0.35, bias=0.1)))
B.append(poly([(890, GY), (1030, GY), (1120, 1400), (800, 1400)], '#d9cdb0'))          # the front walk

# ---------------------------------------------------------------- the palace (front elevation)
L0, R0 = 360, 1560
pal = []
pal.append(poly([(L0 - 20, GY), (R0 + 20, GY), (R0 + 20, 740), (L0 - 20, 740)], STONE[2]))   # raised basement
for x in range(L0 + 30, R0 - 20, 70):
    pal.append(f'<rect x="{x}" y="752" width="30" height="26" fill="{DARK}" opacity="0.55"/>')
pal.append(facets([(L0, 740), (R0, 740), (R0, 360), (L0, 360)], STONE, hill_h(0.01, 30), cell=90, contrast=0.35, bias=0.08))
# two floors of verandas: arches on slender columns
for y0, y1 in [(560, 730), (385, 552)]:
    pal.append(poly([(L0 + 130, y1), (R0 - 130, y1), (R0 - 130, y0), (L0 + 130, y0)], '#4a463e'))
    n = 14
    bw = (R0 - L0 - 260) / n
    for k in range(n):
        x = L0 + 130 + k * bw
        if 840 < x + bw / 2 < 1080:
            continue
        pal.append(f'<path d="M{x + 6},{y1} V{y0 + 50} A{bw / 2 - 6},{bw / 2 - 6} 0 0 1 {x + bw - 6},{y0 + 50} V{y1} Z" fill="#2e2b26"/>')
        pal.append(f'<rect x="{x + bw * 0.3:.1f}" y="{y0 + 70}" width="{bw * 0.4:.1f}" height="{y1 - y0 - 80}" fill="#1c1a17" opacity="0.8"/>')
        pal.append(f'<rect x="{x - 3}" y="{y0 + 30}" width="9" height="{y1 - y0 - 30}" fill="{STONE[4]}"/>')
    pal.append(f'<rect x="{L0 + 130}" y="{y1 - 16}" width="{R0 - L0 - 260}" height="16" fill="{STONE[3]}"/>')
    for x in range(L0 + 136, R0 - 130, 14):
        pal.append(f'<rect x="{x}" y="{y1 - 42}" width="5" height="26" fill="{STONE[3]}"/>')
    pal.append(f'<rect x="{L0 + 130}" y="{y1 - 46}" width="{R0 - L0 - 260}" height="7" fill="{STONE[3]}"/>')
pal.append(poly([(L0 - 14, 372), (R0 + 14, 372), (R0 + 14, 352), (L0 - 14, 352)], STONE[4]))   # cornice
for x in range(L0, R0, 16):
    pal.append(f'<rect x="{x}" y="326" width="7" height="26" fill="{STONE[3]}"/>')
pal.append(poly([(L0 - 6, 330), (R0 + 6, 330), (R0 + 6, 320), (L0 - 6, 320)], STONE[4]))


def tower(x0, x1, top, roof_h, flag=False):
    o = facets([(x0, 740), (x1, 740), (x1, top), (x0, top)], STONE, hill_h(0.02, 20), cell=60, contrast=0.4, bias=0.12)
    o += f'<rect x="{x0}" y="{top}" width="{x1 - x0}" height="{740 - top}" fill="none" stroke="{STONE[1]}" stroke-width="3"/>'
    for y in range(top + 30, 740, 40):
        o += f'<line x1="{x0}" y1="{y}" x2="{x0 + 14}" y2="{y}" stroke="{STONE[1]}" stroke-width="5"/><line x1="{x1 - 14}" y1="{y}" x2="{x1}" y2="{y}" stroke="{STONE[1]}" stroke-width="5"/>'
    o += poly([(x0 - 14, top), (x1 + 14, top), (x1 + 14, top - 14), (x0 - 14, top - 14)], STONE[4])
    rp = [(x0 - 6, top - 14), (x1 + 6, top - 14), (x1 - 18, top - 14 - roof_h), (x0 + 18, top - 14 - roof_h)]
    o += facets(rp, SLATE, ridge_h(0.05, 30, 0.1), cell=40, contrast=0.9)
    o += poly([(x0 + 14, top - 14 - roof_h), (x1 - 14, top - 14 - roof_h), (x1 - 14, top - 24 - roof_h), (x0 + 14, top - 24 - roof_h)], STONE[3])
    for x in np.arange(x0 + 18, x1 - 14, 9):
        o += f'<rect x="{x:.0f}" y="{top - 44 - roof_h}" width="3" height="20" fill="{DARK}"/>'
    cx = (x0 + x1) / 2
    o += f'<circle cx="{cx}" cy="{top - 14 - roof_h * 0.5}" r="{(x1 - x0) * 0.1:.0f}" fill="{STONE[3]}" stroke="{DARK}" stroke-width="3"/>'
    return o


pal.append(tower(L0, L0 + 140, 300, 70))
pal.append(tower(R0 - 140, R0, 300, 70))
CT0, CT1, CTOP = 860, 1060, 250
pal.append(tower(CT0, CT1, CTOP, 92))
# the central tower's upper window row (the window we go through is the middle one)
WIN = []
for k, x in enumerate([905, 960, 1015]):
    WIN.append((x, 300))
    pal.append(f'<path d="M{x - 15},{332} V{288} A15,15 0 0 1 {x + 15},{288} V{332} Z" fill="{STONE[4]}"/>')
WX, WY = 960, 302                                   # window centre
WWID, WTOP, WBOT = 22, 280, 326
win_path = lambda dx=0: f'M{WX - WWID / 2 + dx},{WBOT} V{WTOP + WWID / 2} A{WWID / 2},{WWID / 2} 0 0 1 {WX + WWID / 2 + dx},{WTOP + WWID / 2} V{WBOT} Z'
for x in (905, 1015):
    pal.append(f'<path d="{win_path(x - WX)}" fill="#2c3330"/><line x1="{x}" y1="{WTOP + 4}" x2="{x}" y2="{WBOT}" stroke="{STONE[3]}" stroke-width="2.5"/>')
# lower tower: the entrance arch and a balcony
pal.append(f'<path d="M920,740 V640 A40,40 0 0 1 1000,640 V740 Z" fill="#26231f"/>')
pal.append(f'<path d="M900,560 V470 A60,60 0 0 1 1020,470 V560 Z" fill="#33302a"/>')
pal.append(f'<rect x="880" y="540" width="160" height="10" fill="{STONE[4]}"/>')
# grand staircase
for k in range(9):
    y = GY - 6 - k * 7
    pal.append(f'<rect x="{850 + k * 4}" y="{y}" width="{220 - k * 8}" height="7" fill="{STONE[3] if k % 2 else STONE[2]}"/>')
# the Hawaiian flag on the central tower (8 stripes, Union in the canton)
FX, FY = 960, CTOP - 120
pal.append(f'<line x1="{FX}" y1="{CTOP - 106}" x2="{FX}" y2="{FY - 140}" stroke="{DARK}" stroke-width="4"/>')
S.world.append('<g id="sky">' + ''.join(B) + '</g>')

# ---------------------------------------------------------------- the room behind the window (drawn tiny, deeper)
por = S.img(I('img/raw/loc_liliuokalani_1891.jpg'))
RW, RH = 84, 54
rx0, ry0 = WX - RW / 2, WY - RH / 2
room = f'<rect x="{rx0}" y="{ry0}" width="{RW}" height="{RH}" fill="#2a3a33"/>'
room += f'<rect x="{rx0}" y="{ry0 + RH * 0.66}" width="{RW}" height="{RH * 0.34}" fill="#3b2f25"/>'
room += f'<rect x="{rx0}" y="{ry0 + RH * 0.64}" width="{RW}" height="{RH * 0.025}" fill="#6b5338"/>'
room += f'<radialGradient id="lamp" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#f4d9a0" stop-opacity="0.35"/><stop offset="1" stop-color="#f4d9a0" stop-opacity="0"/></radialGradient>'
room += f'<rect x="{rx0}" y="{ry0}" width="{RW}" height="{RH}" fill="url(#lamp)"/>'
PWd, PHd = 15.4, 19.6                                # the portrait in its frame
px0, py0 = WX - PWd / 2, WY - PHd / 2 - 1.2
room += f'<rect x="{px0 - 2.0:.2f}" y="{py0 - 2.0:.2f}" width="{PWd + 4:.2f}" height="{PHd + 4:.2f}" fill="#000" opacity="0.45" filter="url(#roomsh)"/>'
room += f'<rect x="{px0 - 1.6:.2f}" y="{py0 - 1.6:.2f}" width="{PWd + 3.2:.2f}" height="{PHd + 3.2:.2f}" fill="#a8833c"/>'
room += f'<rect x="{px0 - 1.0:.2f}" y="{py0 - 1.0:.2f}" width="{PWd + 2:.2f}" height="{PHd + 2:.2f}" fill="#d9c394"/>'
room += f'<image href="{por}" x="{px0:.2f}" y="{py0:.2f}" width="{PWd}" height="{PHd}" preserveAspectRatio="xMidYMid slice"/>'
S.defs.append('<filter id="roomsh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="0.8"/></filter>')
S.world.append(f'<g id="room">{room}</g>')

# ---------------------------------------------------------------- the facade, with the window cut out of it
S.defs.append(f'<mask id="winmask" maskUnits="userSpaceOnUse" x="-400" y="-400" width="2800" height="2000"><rect x="-400" y="-400" width="2800" height="2000" fill="#fff"/><path d="{win_path()}" fill="#000"/></mask>')
S.world.append(f'<g id="facade"><g mask="url(#winmask)">{"".join(pal)}</g>')
S.world.append(f'<path d="{win_path()}" fill="none" stroke="{STONE[1]}" stroke-width="1.6"/>')
S.world.append(f'<line x1="{WX}" y1="{WTOP + 3}" x2="{WX}" y2="{WBOT}" stroke="#ece4d0" stroke-width="1.2" id="mull"/>')
S.world.append(f'<line x1="{WX - WWID / 2}" y1="{WTOP + 19}" x2="{WX + WWID / 2}" y2="{WTOP + 19}" stroke="#ece4d0" stroke-width="1.2"/>')
S.world.append('<g id="flag"></g></g>')

# palms in front, framing (faceted fronds)


def palm(x, base, h, lean=0.0, seed_=0):
    r = np.random.default_rng(seed_)
    top = (x + lean * h, base - h)
    o = ''
    n = 10
    for i in range(n):
        t0, t1 = i / n, (i + 1) / n
        a = (x + (top[0] - x) * (t0 ** 1.4), base - h * t0); b = (x + (top[0] - x) * (t1 ** 1.4), base - h * t1)
        w0, w1 = 11 - 4 * t0, 11 - 4 * t1
        o += poly([(a[0] - w0, a[1]), (a[0] + w0, a[1]), (b[0] + w1, b[1]), (b[0] - w1, b[1])], '#6b5a45' if i % 2 else '#5b4b39')
    for k in range(11):
        ang = -math.pi / 2 + (k - 5) * 0.5 + r.normal() * 0.08
        L = h * (0.42 + 0.1 * r.random())
        droop = 0.55 + 0.25 * abs(k - 5) / 5
        pts_u, pts_d = [], []
        for j in range(9):
            u = j / 8
            px = top[0] + math.cos(ang) * L * u
            py = top[1] + math.sin(ang) * L * u + droop * L * u * u
            w = (1 - u) * 0.07 * L + 2
            nx, ny = -math.sin(ang), math.cos(ang)
            pts_u.append((px + nx * w, py + ny * w)); pts_d.append((px - nx * w, py - ny * w))
        o += poly(pts_u + pts_d[::-1], ['#4a5530', '#5f6b3a', '#7a8648'][k % 3])
    return o


S.world.append('<g id="palms">' + palm(210, GY + 30, 520, 0.12, 1) + palm(1700, GY + 30, 560, -0.1, 2) + palm(1790, GY + 40, 400, -0.18, 3) + palm(120, GY + 40, 380, 0.2, 4) + '</g>')
S.over.append('<g id="ov"></g>')

# ---------------------------------------------------------------- camera: wide -> tower -> through the window -> portrait
Z_IN = 1920 / WWID * 1.9                             # well past the window
cam = Camera([
    (0.0, 960, 520, 1.0), (1.2, 960, 515, 1.03),
    (3.6, WX, WY + 40, 2.2),                          # settle on the tower
    (4.4, WX, WY + 30, 2.6),
    (7.4, WX, WY - 0.2, Z_IN),                         # through the window
    (9.0, WX, WY - 0.25, Z_IN * 1.08),
    (16.0, WX, WY - 0.3, Z_IN * 1.14),
], wobble=1.0)
z_ref = 2.6


def room_k(t):
    """the room is deeper: it scales up more slowly than the facade (1 = glued to the facade)"""
    z = cam.at(t)[2]
    return min(1.0, (z_ref / z) ** 0.33) if z > z_ref else 1.0


S.sounds += whooshes(cam, 0, S.dur, thresh=900, vol=0.3)
S.bed = ['forest_birds', 0.28]
S.sound('swell-soft-3s', 4.6, 0.35)
S.sound('ambience-room-tone-30s', 7.2, 0.5)
T_T = 10.0
S.sound('stamp-thud', T_T, 0.35)


def frame(t):
    tq = step12(t)
    k = room_k(t)
    # the flag waves on twos
    f = ''
    fw, fh = 92, 56
    for i in range(8):
        u0, u1 = i / 8, (i + 1) / 8
        col = ['#f4efe6', '#c0392b', '#2c4f8c'][i % 3]
        def P(u, v):
            return (FX + u * fw, FY - 136 + v * fh + math.sin(u * 5 - tq * 6) * (2 + 6 * u) + u * 4)
        for j in range(8):
            v0, v1 = j / 8, (j + 1) / 8
            f += poly([P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)], ['#f4efe6', '#c0392b', '#2c4f8c'][j % 3])
    f += poly([(FX, FY - 136), (FX + fw * 0.45, FY - 136 + 2), (FX + fw * 0.45, FY - 136 + fh * 0.5 + 2), (FX, FY - 136 + fh * 0.5)], '#24407a')
    f += f'<line x1="{FX}" y1="{FY - 136 + fh * 0.25}" x2="{FX + fw * 0.45}" y2="{FY - 136 + fh * 0.25 + 1}" stroke="#f4efe6" stroke-width="5"/><line x1="{FX + fw * 0.22}" y1="{FY - 136}" x2="{FX + fw * 0.22}" y2="{FY - 136 + fh * 0.5}" stroke="#f4efe6" stroke-width="5"/>'
    f += f'<line x1="{FX}" y1="{FY - 136 + fh * 0.25}" x2="{FX + fw * 0.45}" y2="{FY - 136 + fh * 0.25 + 1}" stroke="#c0392b" stroke-width="2.5"/><line x1="{FX + fw * 0.22}" y1="{FY - 136}" x2="{FX + fw * 0.22}" y2="{FY - 136 + fh * 0.5}" stroke="#c0392b" stroke-width="2.5"/>'
    o = ''
    if 0.4 < t < 3.4:
        o += slip(120, 980, 'ʻIolani Palace, Honolulu', 30, clamp((tq - 0.6) / 1.0))
    if t > T_T:
        o += highlight(110, 170, 'Liliʻuokalani', 88, prog=clamp((t - T_T) / (8 / 30)))
        o += slip(120, 290, 'Queen of Hawaiʻi, 1891–1893', 30, clamp((tq - T_T - 0.5) / 1.0))
        o += tag(110, 1040, 'PORTRAIT: LILIʻUOKALANI, 1891 · LIBRARY OF CONGRESS PPMSCA-53150 · PALACE: ILLUSTRATION', 18, '#d9d2c4')
    z = cam.at(t)[2]
    gone = 0 if z > 1920 / WWID * 1.08 else 1
    return {'o': {'facade': gone, 'palms': gone}, 't': {'CAM': cam.transform(t), 'room': f'translate({WX} {WY}) scale({k:.5f}) translate({-WX} {-WY})'}, 'h': {'flag': f, 'ov': o}}


if __name__ == '__main__':
    S.write(frame)
