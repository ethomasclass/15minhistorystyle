# Chapter 8, "Under Protest": the quiet chapter. Desk and real documents only (plus the room it returns to), slower
# camera, teal marks only, no coral, no jokes, room tone only. Timed to placeholder voice timings (168 wpm).
import os
from ep import *

TL = Timeline('ch08_under_protest', 168)
S = EpStage('ch08', TL.dur, bg='#111111', grain=0.45)
S.defs.append(COMMON_DEFS)
DESK = S.img(HSI('desk_grid_black.jpg'))
import json
INFO = json.load(open(HSI('flow/flow.json')))

t_room, t_eight, t_court = TL.at('to this room'), TL.at('Eight days later'), TL.at('a fine of')
t_palace, t_parole, t_pet = TL.at('My palace'), TL.at('She was let out'), TL.at('One petition alone')
t_book, t_quote, t_july = TL.at('In 1898, she published'), TL.at('Oh, honest Americans'), TL.at('On July 7th')
t_navy = TL.at('suddenly a navy base')

# ---- A: her portrait, January 1895
por = S.img(HSI('raw/loc_liliuokalani_portrait.jpg'))
A = desk_bg(DESK) + card(por, 700, 150, 560, 708, rot=-1.5)
A += '<g transform="rotate(-1.5 980 504)">' + tag(690, 912, 'LILIʻUOKALANI · LIBRARY OF CONGRESS', 18, '#d6f3ee') + '</g>'
# ---- B: the room (placeholder until the Flow plate a1_prison_room arrives)
B = (f'<image href="{S.img(HSI("flow/p6_queens_room.jpg"))}" x="0" y="0" width="1920" height="1080"/>'
     f'<image href="{S.img(HSI("flow/c1_queen_3.png"))}" x="{330 - 449 * 0.95 / 2:.0f}" y="{1080 - 826 * 0.95:.0f}" width="{449 * 0.95:.0f}" height="{826 * 0.95:.0f}"/>'
     + '<polygon points="' + ' '.join(f'{x:.0f},{y:.0f}' for x, y in INFO['p6_queens_room']['quad']) + '" fill="#ece3cc"/>'
     '<rect x="-100" y="-100" width="2120" height="1280" fill="#0b1a18" opacity="0.35"/>')
# ---- C: the sentence, typed
C = desk_bg(DESK) + paper(430, 300, 1060, 470, rot=0.8) + '<g id="typedC"></g>'
# ---- D: "My palace was my prison."
D = desk_bg(DESK) + paper(300, 340, 1320, 360, rot=-1.0, fill='#f1e7cf') + '<g id="quoteD"></g>'
# ---- E: the petition on the light table
pet = S.img(HSI('raw/nara_hawaiipetition.jpg'))
E = (f'<image href="{S.img(HSI("lighttable.jpg"))}" x="-640" y="-360" width="3200" height="1800" preserveAspectRatio="xMidYMid slice"/>'
     f'<rect x="512" y="64" width="{723 * 0.9:.0f}" height="{1200 * 0.9:.0f}" fill="#000" opacity="0.22" filter="url(#soft4)"/>'
     f'<image href="{pet}" x="500" y="50" width="{723 * 0.9:.0f}" height="{1200 * 0.9:.0f}"/>'
     + tag(500, 1150, 'PETITION AGAINST ANNEXATION, 1897 · U.S. NATIONAL ARCHIVES, RG 46', 17, '#3b372f') + '<g id="countE"></g>')
# ---- F: her words, written onto a page
F = desk_bg(DESK) + paper(250, 140, 1420, 800, rot=0.4, fill='#f1e7cf') + '<g id="wordsF"></g>'
# ---- G: the Newlands Resolution
res = S.img(HSI('raw/nara_hawaiiresolution.jpg'))
G = desk_bg(DESK) + card(res, 640, 90, 640, 878, rot=1.2)
G += '<g transform="rotate(1.2 960 529)">' + tag(630, 1010, 'JOINT RESOLUTION TO ANNEX HAWAIʻI, 1898 · U.S. NATIONAL ARCHIVES', 17, '#d6f3ee') + '</g>'

for gid, body in zip('ABCDEFG', (A, B, C, D, E, F, G)):
    S.world.append(f'<g id="{gid}" opacity="0">{body}</g>')
S.over.append('<g id="ov"></g>')

SH = Shots([
    (0.0, 'A', Camera([(0, 980, 520, 1.0), (t_room, 980, 500, 1.07)], wobble=0.8)),
    (t_room, 'B', Camera([(t_room, 900, 560, 1.04), (t_court, 860, 560, 1.14)], wobble=0.8)),
    (t_court, 'C', Camera([(t_court, 960, 540, 1.02), (t_palace, 960, 540, 1.08)], wobble=0.8)),
    (t_palace, 'D', Camera([(t_palace, 960, 520, 1.05), (t_parole, 960, 520, 1.12)], wobble=0.8)),
    (t_parole, 'E', Camera([(t_parole, 900, 560, 0.95), (t_pet, 960, 540, 1.0), (t_book, 980, 520, 1.06)], wobble=0.8)),
    (t_book, 'F', Camera([(t_book, 960, 540, 1.0), (t_july, 960, 540, 1.06)], wobble=0.8)),
    (t_july, 'G', Camera([(t_july, 960, 530, 1.03), (S.dur, 960, 530, 1.1)], wobble=0.8)),
])

SENT = ['"a fine of $5,000, and', 'imprisonment at hard labor', 'for five years."']
QUOTE = ['"Oh, honest Americans, as Christians hear me', 'for my down-trodden people! Their form of', 'government is as dear to them as yours is',
         'precious to you. Quite as warmly as you love', 'your country, so they love theirs."']
S.sounds.append(['ambience-room-tone-30s', 0.0, 0.45, 1.0, 1.0, S.dur])
S.sounds.append(['clock-tick', t_room, 0.12, 0.3, 0.2, t_court - t_room])


def frame(t):
    tq = step12(t)
    gid, T, O = SH.frame(t)
    h = {}
    o = ''
    if gid == 'A' and t > TL.at('In January 1895'):
        o += slip(1720, 210, 'January 1895', 34, clamp((tq - TL.at('In January 1895')) / 0.9), anchor='end', rot=1.5)
    if gid == 'B':
        o += placeholder('a1_prison_room (Flow)')
        if t > t_eight:
            o += slip(1720, 210, 'January 24, 1895', 34, clamp((tq - t_eight) / 0.9), anchor='end', rot=1.5)
    if gid == 'C':
        p = clamp((tq - t_court) / (TL.end('five years') - t_court))
        h['typedC'] = typed(520, 440, SENT, 62, p) + (tag(520, 730, "LILIʻUOKALANI, HAWAII'S STORY BY HAWAII'S QUEEN, 1898", 18, '#5b5040') if p >= 1 else '')
        if p >= 1:
            h['typedC'] += drawn_path('M520,668 C700,674 900,664 1010,670', clamp((tq - TL.end('five years') - 0.2) / 0.5), TEAL, 8)
    if gid == 'D':
        p = clamp((tq - TL.at('My palace')) / (TL.end('my prison') - TL.at('My palace')))
        s = '"My palace was my prison."'
        h['quoteD'] = text(380, 560, s[:int(len(s) * p)], 92, 'Playfair7', '#1d1812')
        if p >= 1:
            h['quoteD'] += tag(380, 650, "LILIʻUOKALANI, HAWAII'S STORY BY HAWAII'S QUEEN, 1898", 18, '#5b5040')
    if gid == 'E' and t > t_pet:
        n = int(21269 * ease_out((t - t_pet) / 1.6, 3))
        c = '<rect x="1250" y="720" width="560" height="190" fill="#111" opacity="0.85"/>'
        c += text(1530, 825, f'{n:,}', 104, 'Playfair', CREAM, 'middle')
        if t > TL.at('on 556 pages'):
            c += text(1530, 880, 'NAMES · 556 PAGES', 26, 'Plex', '#d9d2c4', 'middle', extra='letter-spacing="3"')
        h['countE'] = c
    if gid == 'F':
        o2 = text(340, 250, 'HAWAII\'S STORY BY HAWAII\'S QUEEN · 1898', 24, 'Plex', '#6b6047', extra='letter-spacing="4"')
        if t > t_quote:
            p = clamp((tq - t_quote) / (TL.end('love theirs') - t_quote))
            o2 += typed(340, 400, QUOTE, 58, p, '#1d1812', 'Playfair7', 1.5)
        h['wordsF'] = o2
    if gid == 'G':
        o += slip(1720, 210, 'July 7, 1898', 34, clamp((tq - t_july) / 0.9), anchor='end', rot=1.5)
        if t > t_navy:
            o += slip(200, 1000, 'at war with Spain   ', 30, clamp((tq - TL.at('at war with Spain')) / 0.9), rot=-1.2)
    h['ov'] = o
    return {'t': T, 'o': O, 'h': h}


if __name__ == '__main__':
    S.write(frame)
