# Sample 2, "Three days on one clock": January 14-17, 1893 on a single running timeline. 18 s.
# A teal timeline draws along the bottom of a long desk; a date readout and a playhead run along it; at each event a
# card slaps down above its pin with a dashed leader; the last card is the Queen's own words. Then the whole board
# pulls back so the four days are seen at once (lemo-opuscar's Visual Investigation: everything on one clock, the
# readout changes scale, the board becomes the index). Every claim is from the Apology Resolution, Public Law 103-150.
import os, math
from PIL import Image
from kit import *

S = Stage('s2_clock', 18.0, bg='#16140f')
S.defs.append(COMMON_DEFS)
I = lambda p: os.path.join(ROOT, p)
DAY = 1180                                         # world px per day
X0 = 400                                           # midnight, Saturday January 14
TL_Y = 1180
BW, BH = X0 * 2 + DAY * 4, 1700
S.world.append(f'<image href="{S.img(I("img/desk.jpg"))}" x="0" y="0" width="{BW}" height="{BH}" preserveAspectRatio="none"/>')
DAYS = ['SAT · JAN 14', 'SUN · JAN 15', 'MON · JAN 16', 'TUE · JAN 17']
xt = lambda d: X0 + d * DAY                        # d = days since midnight Jan 14

# ---- the events (d in days; pins sit mid-day where the hour is not on record)
EV = [
    dict(d=0.5, when='SAT · JAN 14 · 1893', img='img/raw/loc_liliuokalani_1891.jpg', w=420, h=534, cy=560,
         head='The Queen’s government', body=['The U.S. Minister and a small group of', 'non-Hawaiian residents plan to overthrow it'],
         credit='LILIʻUOKALANI, c. 1891 · LIBRARY OF CONGRESS'),
    dict(d=2.5, when='MON · JAN 16 · 1893', img='img/raw/boston_landing.jpg', w=700, h=542, cy=600,
         head='U.S. forces land', body=['Armed sailors and marines from the', 'USS Boston come ashore in Honolulu'],
         credit='USS BOSTON LANDING FORCE · HAWAIʻI STATE ARCHIVES PP-36-3-002'),
    dict(d=3.62, when='TUE · JAN 17 · AFTERNOON', img='img/raw/loc_dole.jpg', w=360, h=518, cy=560, dx=-330,
         head='A “Provisional Government”', body=['The Committee of Safety deposes the', 'monarchy; Sanford Dole heads it'],
         credit='SANFORD B. DOLE · LIBRARY OF CONGRESS'),
    dict(d=3.86, when='TUE · JAN 17 · 1893', quote=True, cy=470, dx=420),
]
T_EV = [2.2, 6.0, 9.6, 12.4]                       # when each card lands
PLAY = Spline([(0.0, -0.05), (0.6, 0.0)] + [(t - 0.35, e['d']) for t, e in zip(T_EV, EV)] + [(13.6, 3.95), (18, 3.98)])

# ---- the timeline (static parts: day blocks, labels; the line itself draws on per frame)
st = ''
for k in range(4):
    x = xt(k)
    st += f'<rect x="{x}" y="{TL_Y - 1030}" width="{DAY}" height="1080" fill="#ffffff" opacity="{0.018 if k % 2 else 0.035}"/>'
    st += text(x + 30, TL_Y + 92, DAYS[k], 40, 'Plex', '#8f887a', extra='letter-spacing="4"')
S.world.append(st)
S.world.append('<g id="tl"></g><g id="cards"></g>')
S.over.append('<g id="ov"></g>')

ims = {i: S.img(I(e['img'])) for i, e in enumerate(EV) if 'img' in e}


def card_svg(i, e, k):
    """k: drawings since it landed (0, 1, 2... -> settles); returns the card and its leader"""
    x = xt(e['d'])
    if e.get('quote'):
        w, hgt = 1020, 520
    else:
        w, hgt = max(e['w'] + 60, 660), e['h'] + 250
    cx, cy = x + e.get('dx', 40), e['cy']
    x0, y0 = cx - w / 2, cy - hgt / 2
    sc = [1.10, 1.03, 1.0][min(k, 2)]
    sh = [40, 22, 14][min(k, 2)]
    rot = [-3.2, -1.2, -1.6][min(k, 2)] * (1 if i % 2 else -1)
    o = f'<g transform="translate({cx} {cy}) scale({sc}) rotate({rot}) translate({-cx} {-cy})">'
    o += f'<rect x="{x0 + sh * 0.4:.1f}" y="{y0 + sh:.1f}" width="{w}" height="{hgt}" fill="#000" opacity="0.5" filter="url(#soft)"/>'
    o += f'<rect x="{x0}" y="{y0}" width="{w}" height="{hgt}" fill="{CREAM}"/>'
    if e.get('quote'):
        o += text(x0 + 60, y0 + 90, 'LILIʻUOKALANI, 17 JANUARY 1893', 24, 'Plex', '#6b6457', extra='letter-spacing="3"')
        lines = ['“I yield to the superior force', 'of the United States of America …', 'I do this under protest.”']
        for j, ln in enumerate(lines):
            o += text(x0 + 60, y0 + 200 + j * 86, ln, 62, 'Playfair7', INK)
        o += tag(x0 + 60, y0 + hgt - 40, 'FROM HER PROTEST, AS QUOTED IN PUBLIC LAW 103-150 (1993)', 18, '#6b6457')
    else:
        o += f'<image href="{ims[i]}" x="{cx - e["w"] / 2:.1f}" y="{y0 + 30}" width="{e["w"]}" height="{e["h"]}" preserveAspectRatio="xMidYMid slice" filter="url(#bw)"/>'
        ty = y0 + 30 + e['h'] + 62
        o += text(x0 + 30, ty, e['head'], 42, 'Playfair7', INK)
        for j, b in enumerate(e['body']):
            o += text(x0 + 30, ty + 48 + j * 34, b, 27, 'Inter', '#3a352d')
        o += tag(x0 + 30, y0 + hgt - 18, e['credit'], 14, '#7a7365')
    o += '</g>'
    # dashed leader from the card down to its pin on the timeline
    o += f'<path d="M{cx},{y0 + hgt} L{x},{TL_Y - 16}" stroke="{TEAL}" stroke-width="4" stroke-dasharray="10 9" fill="none" opacity="0.9"/>'
    o += f'<circle cx="{x}" cy="{TL_Y}" r="15" fill="{CORAL if e.get("quote") else TEAL}" stroke="{INK}" stroke-width="4"/>'
    return o


cam = Camera([
    (0.0, xt(0.05) + 500, 700, 0.62), (0.8, xt(0.12) + 520, 700, 0.62),
    (2.2, xt(0.5) + 120, 760, 0.8), (4.4, xt(0.62) + 140, 760, 0.8),
    (6.0, xt(2.5) + 60, 780, 0.8), (8.2, xt(2.6) + 100, 780, 0.8),
    (9.6, xt(3.62) - 300, 760, 0.8), (11.2, xt(3.62) - 220, 760, 0.8),
    (12.4, xt(3.86) + 360, 700, 0.84), (13.8, xt(3.86) + 400, 700, 0.86),
    (15.6, BW / 2 + 330, 740, 0.33), (18.0, BW / 2 + 330, 740, 0.325),
], wobble=1.2)
S.sounds += whooshes(cam, 0, S.dur, thresh=650, vol=0.24)
S.bed = ['ambience-room-tone-30s', 0.45]
for t, e in zip(T_EV, EV):
    S.sound('stamp' if e.get('quote') else 'paper_slap_soft', t - 0.03, 0.5 if e.get('quote') else 0.55)
# a clock tick each time the playhead crosses midnight
prev = PLAY(0)
for f in range(int(S.dur * FPS)):
    t = f / FPS; p = PLAY(t)
    if math.floor(p) > math.floor(prev) and p > 0:
        S.sound('clock-tick', t, 0.5)
    prev = p


def frame(t):
    tq = step12(t)
    h = {}
    p = PLAY(t)
    x = xt(max(0.0, p))
    # timeline: the drawn part (teal), the ticks, the playhead
    L = f'<line x1="{xt(0)}" y1="{TL_Y}" x2="{x:.1f}" y2="{TL_Y}" stroke="{TEAL}" stroke-width="7" stroke-linecap="round"/>'
    for k in range(5):
        if xt(k) <= x + 1:
            L += f'<line x1="{xt(k)}" y1="{TL_Y - 34}" x2="{xt(k)}" y2="{TL_Y + 34}" stroke="{TEAL}" stroke-width="5"/>'
            for hh in range(1, 24):
                xx = xt(k) + hh * DAY / 24
                if xx <= x and k < 4:
                    L += f'<line x1="{xx:.1f}" y1="{TL_Y - (14 if hh % 6 else 22)}" x2="{xx:.1f}" y2="{TL_Y}" stroke="{TEAL}" stroke-width="2" opacity="0.6"/>'
    L += f'<line x1="{x:.1f}" y1="{TL_Y - 70}" x2="{x:.1f}" y2="{TL_Y + 40}" stroke="{CREAM}" stroke-width="4"/><circle cx="{x:.1f}" cy="{TL_Y - 70}" r="9" fill="{CREAM}"/>'
    h['tl'] = L
    C = ''
    for i, (te, e) in enumerate(zip(T_EV, EV)):
        if tq >= te:
            C += card_svg(i, e, int((tq - te) * 12 + 1e-6))
    h['cards'] = C
    # the readout (screen space), top right: the date of the playhead, changing at each event
    o = ''
    cur = 0
    for i, te in enumerate(T_EV):
        if t >= te - 0.35:
            cur = i
    label = EV[cur]['when'] if t >= T_EV[0] - 0.35 else 'SAT · JAN 14 · 1893'
    if t < 15.0:
        o += f'<rect x="1290" y="46" width="590" height="96" fill="#111" opacity="0.85"/>'
        o += text(1585, 108, label, 36, 'Plex', CREAM, 'middle', extra='letter-spacing="3"')
    if t > 15.4:
        o += highlight(110, 170, 'Three days', 88, prog=clamp((t - 15.4) / (8 / 30)))
        o += slip(120, 290, 'January 14–17, 1893', 30, clamp((tq - 15.9) / 1.0))
        o += tag(110, 1040, 'DATES AND WORDING: APOLOGY RESOLUTION, PUBLIC LAW 103-150 (1993)', 18, '#bdb5a6')
    h['ov'] = o
    return {'t': {'CAM': cam.transform(t)}, 'h': h}


S.sound('stamp-thud', 15.4, 0.35)
S.write(frame)
