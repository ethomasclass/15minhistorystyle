# Chapter 4, "The Pitch Meeting": the pitch room, the two definitions on the desk, then each pitcher at the easel and a
# flight through the board into that pitch's world, where people move (code-drawn, as in the movement test). The map
# beat ("It belonged to a queen") peeks at Honolulu Harbor through the map. The "Scientist" stays on paper.
import os
from ep import *
from portal import Scene, Journey
from people import person, walker, toil, SKIN, HAIR, tint

TL = Timeline('ch04_the_pitch_meeting', 185)
S = EpStage('ch04', TL.dur, bg='#111111', grain=0.5)
S.defs.append(COMMON_DEFS)
S.defs.append('<filter id="flatshadow"><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter>')
DESK = S.img(HSI('desk_grid_black.jpg'))
at, end = TL.at, TL.end

t_two, t_bus, t_adm = at('Two words'), at('The Businessman'), at('The Admiral')
t_pac, t_pre, t_sci = at("And here's the thing about"), at('The Preacher'), at('The "Scientist."')
t_strong = at("Josiah Strong's own book")

# ---- the easel with a pitcher beside it (pose 1 presenting); the board is the doorway
_, ez = finfo('c2_pitch_easel')
bx0, by0, bx1, by1 = ez['x0'], ez['y0'], ez['x1'], ez['y1']
hole = f'M{bx0},{by0} H{bx1} V{by1} H{bx0} Z'
F = ((bx0 + bx1) / 2, (by0 + by1) / 2, min(bx1 - bx0, (by1 - by0) * 16 / 9) * 0.985)
PITCHER = {'bus': 1, 'adm': 3, 'pre': 5, 'sci': 7}


def easel(who, gid):
    return plate(S, 'c2_pitch_easel') + cut(S, 's1_pitchers', PITCHER[who], 420, 1050, 700, gid=gid)


# ---- the worlds (people are drawn per frame into the named groups)
docks = plate(S, 'c5_docks') + '<g id="pp_docks"></g>'
coal = plate(S, 'c6_coaling_station') + '<g id="pp_coal"></g>'
church = plate(S, 'c7_mission_church') + '<g id="pp_church"></g>'

JB = Journey([Scene('ez', easel('bus', 'pz1'), hole, F, keys=[(t_bus, 960, 560, 1.0), (t_bus + 1.4, 900, 520, 1.12)]),
              Scene('docks', docks, keys=[(at('More wheat') + 1.0, 900, 640, 1.08), (t_adm, 760, 700, 1.15)])],
             [t_bus, t_bus + 2.6, t_adm], prefix='B')
JA = Journey([Scene('ez', easel('adm', 'pz2'), hole, F, keys=[(t_adm, 960, 560, 1.0), (t_adm + 1.4, 900, 520, 1.12)]),
              Scene('coal', coal, keys=[(at('Steamships burned') , 1100, 760, 1.25), (t_pac, 1250, 820, 1.55)])],
             [t_adm, t_adm + 2.8, t_pac], prefix='A')
JP = Journey([Scene('ez', easel('pre', 'pz3'), hole, F, keys=[(t_pre, 960, 560, 1.0), (t_pre + 1.4, 900, 520, 1.12)]),
              Scene('church', church, keys=[(at('His pitch'), 960, 700, 1.05), (t_sci, 960, 760, 1.15)])],
             [t_pre, t_pre + 2.6, t_sci], prefix='P')
for J in (JB, JA, JP):
    d_, b_ = J.markup()
    S.defs.append(d_)
    S.world.append(b_)

# ---- simple shots: the room, the desk, the map, the Scientist's board
_, mp = finfo('c3_pitch_map')
mcx, mcy, mr = mp['cx'], mp['cy'], mp['r']
S.defs.append(f'<clipPath id="mapc"><circle cx="{mcx}" cy="{mcy}" r="{mr}"/></clipPath>')
harbour = S.img(HSI('flow/p1_harbour.jpg'))
MAP = (plate(S, 'c3_pitch_map') +
       f'<g clip-path="url(#mapc)"><image href="{harbour}" x="{mcx - mr * 2.2}" y="{mcy - mr * 1.24}" width="{mr * 4.4}" height="{mr * 2.48}"/></g>'
       f'<circle cx="{mcx}" cy="{mcy}" r="{mr}" fill="none" stroke="#3a3326" stroke-width="3"/>')
SCI = easel('sci', 'pz4') + f'<rect x="{bx0}" y="{by0}" width="{bx1 - bx0}" height="{by1 - by0}" fill="#efe5cc"/><g id="board"></g>'
for gid, body in (('ROOM', plate(S, 'c1_pitch_room')), ('VOC', desk_bg(DESK) + '<g id="voc"></g>'), ('MAP', MAP), ('SCI', SCI)):
    S.world.append(f'<g id="{gid}" opacity="0">{body}</g>')
S.over.append('<g id="ov"></g>')

SEG = [
    (0.0, 'ROOM', Camera([(0, 960, 540, 1.0), (t_two, 1050, 560, 1.12)], wobble=0.8)),
    (t_two, 'VOC', Camera([(t_two, 960, 540, 1.0), (t_bus, 960, 540, 1.05)], wobble=0.8)),
    (t_bus, 'J', JB), (t_adm, 'J', JA),
    (t_pac, 'MAP', Camera([(t_pac, 960, 540, 1.0), (at('It belonged'), mcx, mcy, 2.3), (t_pre, mcx, mcy, 2.45)], wobble=0.8)),
    (t_pre, 'J', JP),
    (t_sci, 'SCI', Camera([(t_sci, 960, 560, 1.0), (t_sci + 1.6, 960, 495, 1.95), (TL.dur, 960, 495, 2.05)], wobble=0.8)),
]
ALL_IDS = ['ROOM', 'VOC', 'MAP', 'SCI']


def seg_at(t):
    a = SEG[0]
    for s in SEG:
        if t >= s[0]:
            a = s
    return a


# ---- people in the worlds
LOOKS = [dict(coat='#5a4b3a', coat_len=0.2, trousers='#3b362e', skin=SKIN[0], hair=HAIR[0], hat='cap', hat_col='#2f2c28'),
         dict(coat='#7a6a52', coat_len=0.0, trousers='#2f2f36', skin=SKIN[3], hair=HAIR[3], hat='slouch', hat_col='#4a3c2c'),
         dict(coat='#9a8a6c', coat_len=0.0, trousers='#4b4033', skin=SKIN[1], hair=HAIR[1], hat='cap', hat_col='#3a332b'),
         dict(coat='#46505a', coat_len=0.2, trousers='#2b2a28', skin=SKIN[2], hair=HAIR[0], hat='bowler')]
_, sp = finfo('s3_props')
CRATE, SACK = (S.img(os.path.join(EPI('flow'), sp['cutouts'][k - 1]['file'])) for k in (12, 11))


def pp_docks(tq):
    o = ''
    for i, (x0, y, h, t0, arms) in enumerate([(-120, 1070, 330, t_bus + 1.6, 'carry'), (-520, 1060, 320, t_bus + 1.9, 'shoulder'),
                                               (-900, 1075, 340, t_bus + 2.2, 'carry'), (2050, 975, 260, t_bus + 2.0, 'swing')]):
        f = -1 if x0 > 1000 else 1
        svg, J, x = walker(tq, x0, y, h, facing=f, t0=t0, arms=arms, phase=0.3 * i, **LOOKS[i])
        if arms == 'carry':
            hx, hy = J['hand_b']
            cw = h * 0.36
            svg += f'<image href="{CRATE}" x="{hx - cw * 0.35 * f - cw / 2:.0f}" y="{hy - cw * 0.55:.0f}" width="{cw:.0f}" height="{cw * 0.62:.0f}"/>'
        if arms == 'shoulder':
            sx, sy = J['shoulder']
            cw = h * 0.3
            svg += f'<image href="{SACK}" x="{sx - cw / 2:.0f}" y="{sy - cw * 0.95:.0f}" width="{cw:.0f}" height="{cw * 1.08:.0f}"/>'
        o += svg
    return o


def pp_coal(tq):
    o = ''
    for i, (x, y) in enumerate([(1410, 902), (1500, 910), (1590, 896)]):
        P = toil(tq, 'bend', 'haul', 1.5, i * 0.33)
        svg, _ = person(x, y, 78, 'bend', facing=-1, coat='#27324a', trousers='#27324a', skin=SKIN[i % 3], hair=HAIR[0], hat='cap',
                        hat_col='#1f2a3c', shadow=False, **P)
        o += svg
    for i, (x0, t0) in enumerate([(1290, t_adm + 2.4), (1360, t_adm + 4.6)]):
        svg, J, x = walker(tq, x0, 842, 72, facing=-1, t0=t0, t1=t0 + 9, arms='shoulder', shadow=False, coat='#27324a', trousers='#27324a',
                           skin=SKIN[1], hair=HAIR[0], hat='cap', hat_col='#1f2a3c')
        o += svg
    return o


CH_LOOKS = [dict(coat='#e8e0cc', dress=True, skin=SKIN[3], hair=HAIR[3], hat='bonnet', hat_col='#f1ead8'),
            dict(coat='#2f2c28', coat_len=1.3, trousers='#2b2a28', skin=SKIN[3], hair=HAIR[3]),
            dict(coat='#d98b8c', dress=True, skin=SKIN[1], hair=HAIR[3]),
            dict(coat='#3c4a3d', coat_len=1.2, trousers='#2f2c28', skin=SKIN[0], hair=HAIR[4], hat='top', beard=True),
            dict(coat='#f1ead8', dress=True, skin=SKIN[0], hair=HAIR[1], hat='bonnet', hat_col='#e3d9c2'),
            dict(coat='#4f5d6a', coat_len=0.5, trousers='#3a3a34', skin=SKIN[3], hair=HAIR[0])]


def pp_church(tq):
    o = ''
    sched = [(-80, 1046, 200, 1, 0.0, 6.0), (-260, 1052, 190, 1, 0.5, 7.4), (-460, 1048, 120, 1, 0.9, 8.6),
             (2000, 1046, 200, -1, 0.2, 6.2), (2200, 1050, 195, -1, 0.7, 7.0), (2420, 1044, 185, -1, 1.1, 7.6)]
    for i, (x0, y, h, f, d, walk) in enumerate(sched):
        t0 = t_pre + 2.0 + d
        svg, J, x = walker(tq, x0, y, h, facing=f, t0=t0, t1=t0 + walk, phase=0.2 * i, **CH_LOOKS[i])
        o += svg
    return o


def frame(t):
    tq = step12(t)
    s = seg_at(t)
    T, O, h = {}, {g: 0 for g in ALL_IDS}, {}
    for J in (JB, JA, JP):
        O.update(J.hidden())
    if s[1] == 'J':
        _, tj, oj = s[2].frame(t)
        T.update(tj); O.update(oj)
    else:
        O[s[1]] = 1
        T[s[1]] = s[2].transform(t)
    for i, gid in enumerate(('pz1', 'pz2', 'pz3', 'pz4')):
        T[gid] = breathe(t, 420, 1050, i)
    h['pp_docks'] = pp_docks(tq) if s[2] is JB else ''
    h['pp_coal'] = pp_coal(tq) if s[2] is JA else ''
    h['pp_church'] = pp_church(tq) if s[2] is JP else ''
    o = ''
    if s[1] == 'VOC':
        v = ''
        ti, tv, tb = at('Imperialism'), at('And interventionism'), at('The model')
        v += highlight(160, 260, 'Imperialism', 84, prog=clamp((t - ti) / (8 / 30)))
        v += note(180, 360, 'a strong country taking control', 34, prog=clamp((tq - ti - 0.5) / 1.0))
        v += note(180, 425, 'of weaker places', 34, prog=clamp((tq - ti - 1.4) / 0.6))
        if t > tv:
            v += highlight(900, 600, 'Interventionism', 84, prog=clamp((t - tv) / (8 / 30)))
            v += note(920, 700, "stepping into other countries'", 34, prog=clamp((tq - tv - 0.5) / 1.0))
            v += note(920, 765, 'affairs for your own interests', 34, prog=clamp((tq - tv - 1.4) / 0.8))
        if t > tb:
            o += slip(1760, 1000, 'the model: the British Empire   ', 30, clamp((tq - tb) / 0.9), anchor='end', rot=1.2)
        h['voc'] = v
    labels = {JB: 'The Businessman', JA: 'The Admiral', JP: 'The Preacher'}
    if s[2] in labels and t < s[0] + 2.4:
        o += highlight(110, 170, labels[s[2]], 80, prog=clamp((t - s[0] - 0.15) / (8 / 30)))
    if s[1] == 'SCI':
        if t < t_sci + 2.4:
            o += highlight(110, 170, 'The "Scientist"', 80, prog=clamp((t - t_sci - 0.15) / (8 / 30)))
        b = ''
        if t < t_strong:
            ts = at('survival of the fittest')
            p = clamp((tq - ts) / (end('survival of the fittest') - ts))
            b += typed(bx0 + 60, by0 + 200, ['"survival of the fittest"'], 54, p)
            if p >= 1:
                b += tag(bx0 + 60, by0 + 270, 'HERBERT SPENCER, PRINCIPLES OF BIOLOGY, 1864', 15, '#5b5040')
            if t > at("It's called"):
                b += text(bx0 + 60, by0 + 360, 'Social Darwinism', 40, 'Playfair7', '#8f3b2e')
        else:
            ts = at('the final competition')
            p = clamp((tq - ts) / (end('being schooled') - ts))
            b += typed(bx0 + 50, by0 + 130, ['"the final competition of races,', 'for which the Anglo-Saxon', 'is being schooled."'], 42, p)
            if p >= 1:
                b += tag(bx0 + 50, by0 + 330, 'JOSIAH STRONG, OUR COUNTRY, 1885', 15, '#5b5040')
        h['board'] = b
    if s[1] == 'MAP' and t > at('It belonged'):
        o += slip(1760, 1000, 'Honolulu   ', 32, clamp((tq - at('It belonged')) / 0.9), anchor='end', rot=1.2)
    h['ov'] = o
    return {'t': T, 'o': O, 'h': h}


if __name__ == '__main__':
    S.write(frame)
