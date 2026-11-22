# Sample 3, "21,269 names": the Kūʻē petition on a light table. 17 s.
# The camera glides across the table (the annexation resolution, the Queen's protest) to one page of the 1897
# petition. A loupe lands on its heading, reads down to "earnestly protest against the annexation", which lights up,
# finds the date, then reads down the names. It lifts, the table pulls back, and the count lands.
# From lemo-opuscar's Archive Light Table grammar: glide, loupe landing, the line lights up, pull back to the table.
# No cuts. Every document is a real scan (U.S. National Archives); the stack of pages behind is marked illustrative.
import os, math
from PIL import Image
from kit import *

S = Stage('s3_petition', 17.0, bg='#151412', grain=0.45)
S.defs.append(COMMON_DEFS)
I = lambda p: os.path.join(ROOT, p)
TW, TH = 3200, 2300
S.world.append(f'<image href="{S.img(I("img/lighttable.jpg"))}" x="0" y="0" width="{TW}" height="{TH}"/>')

# ---- documents on the table
pet = S.img(I('img/raw/nara_hawaiipetition.jpg'))
K = 1.22                                           # petition: world px per source px
PX, PY = 860, 420
PW, PH = 723 * K, 1200 * K
# an illustrative stack of pages beneath it (the petition ran to 556 pages)
S.world.append('<g id="stack"></g>')
S.world.append(f'<rect x="{PX + 10}" y="{PY + 16}" width="{PW}" height="{PH}" fill="#000" opacity="0.18" filter="url(#soft4)"/>')
S.world.append(f'<image href="{pet}" x="{PX}" y="{PY}" width="{PW}" height="{PH}"/>')
S.world.append('<g id="dim"></g>')
S.world.append(tag(PX, PY + PH + 40, 'PETITION AGAINST ANNEXATION, 1897 · HUI ALOHA ʻĀINA · U.S. NATIONAL ARCHIVES, RG 46', 19, '#3b372f'))
q = S.img(I('img/raw/nara_hawaiiqueen.jpg'))
QX, QY, QW, QH, QR = 1970, 520, 759 * 0.92, 1200 * 0.92, 2.5
S.world.append(f'<g transform="rotate({QR} {QX + QW / 2} {QY + QH / 2})"><rect x="{QX + 8}" y="{QY + 14}" width="{QW}" height="{QH}" fill="#000" opacity="0.18" filter="url(#soft4)"/>'
               f'<image href="{q}" x="{QX}" y="{QY}" width="{QW}" height="{QH}"/>' + tag(QX, QY + QH + 36, 'LILIʻUOKALANI, PROTEST, 19 DEC 1898 · NATIONAL ARCHIVES', 17, '#3b372f') + '</g>')
r = S.img(I('img/raw/nara_hawaiiresolution.jpg'))
RX, RY, RW, RH, RR = 2480, 760, 800 * 0.86, 1098 * 0.86, -4
S.world.append(f'<g transform="rotate({RR} {RX + RW / 2} {RY + RH / 2})"><rect x="{RX + 8}" y="{RY + 14}" width="{RW}" height="{RH}" fill="#000" opacity="0.18" filter="url(#soft4)"/>'
               f'<image href="{r}" x="{RX}" y="{RY}" width="{RW}" height="{RH}"/></g>')
# cotton gloves, so the table reads as an archive table
S.world.append('<g opacity="0.92"><path d="M300,1560 q40,-120 120,-110 q70,5 90,60 l60,190 q-40,40 -110,30 z" fill="#f1eee6"/><path d="M380,1610 q30,-110 100,-100 q60,8 80,60 l50,170 q-40,30 -100,20 z" fill="#e7e3d9"/></g>')
S.world.append('<g id="lens"></g>')
S.over.append('<g id="ov"></g>')

# ---- where things are on the scan (source px)
src = lambda x, y: (PX + x * K, PY + y * K)
HEAD = src(545, 42)
LINE = (380, 263, 706, 284)                       # "...said League, earnestly protest against the annexation of"
DATE = src(62, 341)
ROW = lambda i: src(150, 395 + (i - 1) * 32.6)

# ---- the camera and the loupe's path
cam = Camera([
    (0.0, 2680, 1240, 0.62), (0.7, 2620, 1230, 0.62),
    (2.4, PX + PW / 2, PY + PH * 0.42, 0.66),        # glide to the petition
    (3.2, HEAD[0], HEAD[1] + 120, 1.15),              # push to the heading
    (4.6, HEAD[0], HEAD[1] + 160, 1.2),
    (5.6, src(545, 274)[0], src(545, 274)[1], 1.25),  # down to the protest line
    (7.0, src(540, 280)[0], src(540, 280)[1], 1.28),
    (7.9, DATE[0] + 220, DATE[1] + 60, 1.22),         # the date
    (8.6, DATE[0] + 230, DATE[1] + 120, 1.2),
    (10.6, ROW(10)[0] + 120, ROW(10)[1], 1.15),       # reading down the names
    (12.0, PX + PW / 2 + 380, PY + PH * 0.5, 0.55),   # pull back to the whole table
    (17.0, PX + PW / 2 + 400, PY + PH * 0.5, 0.53),
], wobble=1.2)
LENS = [(3.0, HEAD[0], HEAD[1]), (4.7, HEAD[0], HEAD[1]), (5.5, *src(560, 273)), (7.1, *src(560, 273)), (7.8, *DATE),
        (8.7, *DATE), (9.0, *ROW(1)), (10.7, *ROW(12))]
lx, ly = Spline([(a, b) for a, b, c in LENS]), Spline([(a, c) for a, b, c in LENS])
T_LAND, T_LIFT = 3.0, 10.8
R_L, MAG = 170, 1.75

S.bed = ['hum-lighttable', 0.16]
S.sound('ambience-room-tone-30s', 0, 0.35)
S.sound('paper-handle-2', 0.4, 0.3)
S.sound('impact-wood-light', T_LAND + 0.32, 0.4)
S.sound('pencil-write', 6.0, 0.45)
S.sound('impact-wood-light', T_LIFT + 0.05, 0.25)
S.sounds += whooshes(cam, 0, S.dur, thresh=650, vol=0.2)
T_COUNT, T_TITLE = 12.2, 14.4
for k in range(9):
    S.sound('tick', T_COUNT + 1.6 * (k / 8) ** 0.7, 0.18 + 0.02 * k)
S.sound('stamp-thud', T_TITLE, 0.4)


def lens_state(t):
    """lift above the page (0 = resting on it, 1 = held high) and the lens centre"""
    lift = 1 - ease_out((t - T_LAND) / 0.4) if t < T_LIFT else ease_out((t - T_LIFT) / 0.4)
    return lift, lx(t), ly(t)


def frame(t):
    tq = step12(t)
    h = {}
    # ---- the loupe
    lift, cx, cy = lens_state(t)
    on = T_LAND - 0.25 < t < T_LIFT + 0.45
    L = ''
    if on:
        rr = R_L * (1 + 0.25 * lift)
        a = 1 - lift
        sx, sy = cx + 18 + 60 * lift, cy + 26 + 80 * lift
        L += f'<circle cx="{sx:.1f}" cy="{sy:.1f}" r="{rr + 14:.1f}" fill="#000" opacity="{0.22 * a + 0.08:.2f}" filter="url(#soft)"/>'
        L += f'<clipPath id="lc"><circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rr:.1f}"/></clipPath>'
        m = 1 + (MAG - 1) * a
        L += f'<g clip-path="url(#lc)"><rect x="{cx - rr}" y="{cy - rr}" width="{2 * rr}" height="{2 * rr}" fill="#f6f3ea"/>'
        L += f'<g transform="translate({cx:.1f} {cy:.1f}) scale({m:.4f}) translate({-cx:.1f} {-cy:.1f})"><image href="{pet}" x="{PX}" y="{PY}" width="{PW}" height="{PH}"/>{dim_layer(t, tq)}</g>'
        L += f'<circle cx="{cx - rr * 0.35:.1f}" cy="{cy - rr * 0.4:.1f}" r="{rr * 0.55:.1f}" fill="#fff" opacity="0.07"/></g>'
        L += f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rr + 9:.1f}" fill="none" stroke="#1d1c1a" stroke-width="20"/>'
        L += f'<path d="M{cx - (rr + 9) * 0.8:.1f},{cy - (rr + 9) * 0.6:.1f} A{rr + 9},{rr + 9} 0 0 1 {cx + (rr + 9) * 0.3:.1f},{cy - (rr + 9) * 0.95:.1f}" fill="none" stroke="#6b6a66" stroke-width="5"/>'
    h['lens'] = L
    h['dim'] = dim_layer(t, tq)
    # ---- the illustrative stack, fanning out on the pull back
    st = ''
    p = ease((t - 11.2) / 1.6)
    if p > 0:
        for k in range(14, 0, -1):
            dx, dy = -k * 26 * p, k * 9 * p
            st += f'<rect x="{PX + dx:.1f}" y="{PY + dy:.1f}" width="{PW}" height="{PH}" fill="#ece3cf" stroke="#cbbf a6" stroke-width="2" opacity="{0.95:.2f}"/>'.replace('#cbbf a6', '#cbbfa6')
            for j in range(18):
                st += f'<rect x="{PX + dx + 40}" y="{PY + dy + 420 + j * 52}" width="{PW - 90 - (j * 37 % 120)}" height="5" fill="#8c8270" opacity="0.25"/>'
    h['stack'] = st
    # ---- overlay: the count, the label, the title
    o = ''
    if t > T_COUNT:
        n = int(21269 * ease_out((t - T_COUNT) / 1.8, 3))
        o += f'<rect x="1180" y="770" width="640" height="200" fill="#111" opacity="0.82"/>'
        o += text(1500, 880, f'{n:,}', 112, 'Playfair', CREAM, 'middle')
        o += text(1500, 940, 'SIGNATURES · 556 PAGES', 26, 'Plex', '#d9d2c4', 'middle', extra='letter-spacing="3"')
    if 3.6 < t < 10.6:
        o += slip(110, 1010, 'kūʻē: to oppose, to resist', 30, clamp((tq - 3.8) / 1.0))
    if 7.9 < t < 10.6:
        o += slip(1810, 1010, 'Honolulu, September 11, 1897', 30, clamp((tq - 8.0) / 1.0), anchor='end', rot=1.2)
    if t > T_TITLE:
        o += highlight(110, 170, 'Kūʻē petition', 92, prog=clamp((t - T_TITLE) / (8 / 30)))
        o += slip(120, 290, 'collected Sept. 11 – Oct. 2, 1897', 30, clamp((tq - T_TITLE - 0.5) / 1.2))
    h['ov'] = o
    return {'t': {'CAM': cam.transform(t)}, 'h': h}


def dim_layer(t, tq):
    """the line lights up: the page dims round one line, and a teal underline draws under it"""
    p = ease((t - 5.6) / 0.5) * (1 - ease((t - 7.4) / 0.5))
    if p <= 0:
        return ''
    x0, y0, x1, y1 = [v * K for v in LINE]
    x0 += PX; x1 += PX; y0 += PY; y1 += PY
    d = f'M{PX},{PY} h{PW} v{PH} h{-PW} z M{x0 - 8},{y0 - 6} V{y1 + 6} H{x1 + 8} V{y0 - 6} z'
    o = f'<path d="{d}" fill="#1a1712" fill-rule="evenodd" opacity="{0.42 * p:.3f}"/>'
    u = clamp((tq - 5.9) / 0.6)
    o += drawn_path(f'M{x0},{y1 + 8} C{x0 + 120},{y1 + 11} {x1 - 120},{y1 + 5} {x1},{y1 + 9}', u * (1 if t < 7.4 else 1), TEAL, 5,
                    extra=f'opacity="{p:.3f}"')
    return o


S.write(frame)
