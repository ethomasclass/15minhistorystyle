# Chapters 1 and 2: the cold open in the locked room, the pull back out of her window to the palace (hard cuts that carry
# the motion), and the Declaration on the desk. Timed to placeholder voice timings at 185 wpm.
import os, sys
from ep import *

T1 = Timeline('ch01_the_locked_room', 185)
T2 = Timeline('ch02_the_question', 185)
O2 = T1.dur                                     # chapter 2 starts here
at2 = lambda p, k=1: O2 + T2.at(p, k)
end2 = lambda p, k=1: O2 + T2.end(p, k)
S = EpStage('ch01_02', O2 + T2.dur, bg='#111111', grain=0.5)
S.defs.append(COMMON_DEFS)

# ---- the room, the hall, the window outside, the palace
QX, QB, QH = 330, 950, 470                     # the Queen at the window, from behind (reused cut-out, curtain pose)
room = plate(S, 'a1_prison_room') + cut(S, 'c1_queen', 3, QX, QB, QH, gid='queen')
GX, GB, GH = 1130, 712, 300
hall = plate(S, 'a3_palace_hall') + cut(S, 's2_honolulu_men', 6, GX, GB, GH, gid='guard')
_, w = finfo('a2_palace_window')
x0, y0, x1, y1 = w['x0'], w['y0'], w['x1'], w['y1']
inside = (f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" fill="#1c1a17"/>'
          f'<rect x="{x0}" y="{y0}" width="{(x1 - x0) * 0.28:.0f}" height="{y1 - y0}" fill="#2a2724"/>'
          f'<rect x="{x1 - (x1 - x0) * 0.28:.0f}" y="{y0}" width="{(x1 - x0) * 0.28:.0f}" height="{y1 - y0}" fill="#2a2724"/>')
window = plate(S, 'a2_palace_window') + inside
palace = plate(S, 'p4_palace')
DECL = S.img(RAW('declaration_5000.jpg'))
desk = (desk_bg(S.img(HSI('desk_grid_black.jpg')), 9000, 6000).replace(f'x="{960 - 4500}"', 'x="-1500"').replace(f'y="{540 - 3000}"', 'y="-1500"')
        + f'<rect x="40" y="60" width="5000" height="5917" fill="#000" opacity="0.55" filter="url(#soft)"/>'
        + f'<image href="{DECL}" x="0" y="0" width="5000" height="5917"/>'
        + tag(0, 5990, 'DECLARATION OF INDEPENDENCE, 1776 · 1823 STONE ENGRAVING · U.S. NATIONAL ARCHIVES', 54, '#d6f3ee')
        + '<g id="spot"></g>')
for gid, body in (('ROOM', room), ('HALL', hall), ('WIN', window), ('PAL', palace), ('DESK', desk)):
    S.world.append(f'<g id="{gid}" opacity="0">{body}</g>')
S.over.append('<g id="ov"></g>')

# ---- times
t_guard, t_window = T1.at("There's an armed"), T1.at('From her window')
t_pull = O2 + 0.2                                 # the pull back starts with "So here's the question"
t_out = at2('It didn\'t happen')                  # out of the window (cut 1, carried)
t_wide = at2('Some of them')                      # cut 2 to the palace, carried
t_decl = at2('But first')
PHR = (595, 1270, 1195, 1345)                     # "the consent of the governed" on the engraving (world px)
pcx, pcy = (PHR[0] + PHR[2]) / 2, (PHR[1] + PHR[3]) / 2

SH = Shots([
    (0.0, 'ROOM', Camera([(0, 1500, 560, 1.22), (t_guard, 760, 600, 1.14)], wobble=0.8)),
    (t_guard, 'HALL', Camera([(t_guard, 960, 520, 1.0), (t_window, 960, 500, 1.12)], wobble=0.8)),
    (t_window, 'ROOM', Camera([(t_window, 330, 560, 1.75), (t_pull, 330, 560, 1.86), (t_pull + 2.5, 360, 560, 1.7), (t_out, 600, 560, 1.0)], wobble=0.8)),
    (t_out, 'WIN', Camera([(t_out, 960, 633, 2.6), (t_out + 1.2, 960, 620, 1.6), (t_wide, 960, 560, 1.0)], wobble=0.8)),
    (t_wide, 'PAL', Camera([(t_wide, 960, 470, 1.9), (t_wide + 1.0, 960, 500, 1.25), (t_decl, 960, 540, 1.02)], wobble=0.8)),
    (t_decl, 'DESK', Camera([(t_decl, 2500, 1800, 0.34), (at2('America told'), 1600, 1400, 0.6), (at2('the consent of'), pcx, pcy + 20, 2.1),
                             (S.dur, pcx, pcy + 20, 2.25)], wobble=1.0)),
])
S.sounds.append(['ambience-room-tone-30s', 0.0, 0.45, 0.5, 0.6, t_out])
S.sounds.append(['clock-tick', 0.0, 0.1, 0.4, 0.3, t_guard])
S.sounds.append(['forest_birds', t_out, 0.35, 0.6, 0.4, t_decl - t_out])
S.sounds.append(['ambience-room-tone-30s', t_decl, 0.4, 0.5, 0.5, S.dur - t_decl])


def frame(t):
    tq = step12(t)
    gid, T, O = SH.frame(t)
    T['queen'] = breathe(t, QX, QB, 0)
    T['guard'] = breathe(t, GX, GB, 1)
    h, o = {}, ''
    if gid == 'ROOM' and T1.at("It's 1895") < t < t_guard:
        o += slip(1780, 990, 'ʻIolani Palace, 1895   ', 32, clamp((tq - T1.at("It's 1895")) / 0.9), anchor='end', rot=1.2)
    sp = ''
    if gid == 'DESK':
        p = ease((t - at2('the consent of')) / 0.5)
        if p > 0:
            d = f'M-2000,-2000 h9000 v10000 h-9000 z M{PHR[0] - 20},{PHR[1] - 20} V{PHR[3] + 25} H{PHR[2] + 20} V{PHR[1] - 20} z'
            sp = f'<path d="{d}" fill="#0c0b09" fill-rule="evenodd" opacity="{0.55 * p:.3f}"/>'
    h['spot'] = sp
    h['ov'] = o
    return {'t': T, 'o': O, 'h': h}


if __name__ == '__main__':
    S.write(frame)
