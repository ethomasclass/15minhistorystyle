# The IMPERIALISM vocabulary card (ch 4), on the cream board page: it is what the easel board shows in the pitch room,
# and after the camera pushes into the board it carries on full screen. Frame 0 is the blank page the board shows.
#   "A strong country taking control of weaker places, either by owning them outright or by running them from the
#    outside, is called imperialism"
#   python3 tools/card_imperialism.py      (frames in build/card_imperialism/f; frame 0 is copied to blender/assets)
import os, shutil, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vkit import *   # noqa: F401,F403
from vkit import EP

PAGE, PAGE_D, LINE_ = '#efe6d0', '#e2d7bd', '#d9cdb1'
W0 = Words('ch04_the_pitch_meeting')
A = W0.at('A strong country taking') - 0.05            # the card starts the moment the board fills the frame
B = W0.end('is called imperialism') + 0.9
Wd = Words('ch04_the_pitch_meeting', t0=A)
S = stage('card_imperialism', B - A, bg=False, grain=0.3)
S.world.append(f'<rect width="1920" height="1080" fill="{PAGE}"/>'
               + ''.join(f'<rect x="0" y="{y}" width="1920" height="2" fill="{LINE_}" opacity="0.5"/>' for y in range(120, 1080, 96)))
S.over.append('<g id="ov"></g>')
DEF = 'a strong country taking control of weaker places, either by owning them outright or by running them from the outside'.split()
i0 = Wd._find('A strong country taking')[0]
TW = [Wd.w[i0 + k]['s'] - A for k in range(len(DEF))]
T_STRONG, T_WEAK, T_OWN, T_RUN, T_TERM = TW[1], TW[6], TW[10], TW[15], Wd.at('imperialism')
TEAL_INK = '#138c79'
SMALL = [(-330, -60, 'own'), (-250, 150, 'own'), (330, -80, 'run'), (260, 140, 'run')]


def frame(t):
    tq = step12(t)
    o = ''
    cx, cy = 960, 400
    # the strong country: a big teal slab with its shade
    s = pop(t, T_STRONG - 0.05, 0.4)
    if s > 0:
        o += g(cx, cy, s, f'<path d="{tablet(130, 110, 30)}" fill="{TE_D}" transform="translate(8,10)"/>'
                         f'<path d="{tablet(130, 110, 30)}" fill="{TE}"/>'
                         f'<path d="M130,-80 L130,80 L100,110 L-100,110 Z" fill="{TE_D}" opacity="0.5"/>')
    # the weaker places; two get owned outright (they fill with the country's colour), two get run from outside (strings)
    for j, (dx, dy, kind) in enumerate(SMALL):
        ps = pop(t, T_WEAK + j * 0.1, 0.32)
        if ps <= 0:
            continue
        x, y = cx + dx, cy + dy
        owned = kind == 'own' and t >= T_OWN + j * 0.25
        u = ease((tq - T_OWN - j * 0.25) / 0.3) if owned else 0.0
        fill = TE if u >= 1 else BONE_D
        body = (f'<path d="{tablet(62, 50, 16)}" fill="#c8bca0" transform="translate(5,6)"/>'
                f'<path d="{tablet(62, 50, 16)}" fill="{fill}"/>')
        if 0 < u < 1:                                    # the colour sweeps across as it is taken over
            body += f'<clipPath id="own{j}"><rect x="-62" y="-50" width="{124 * u:.1f}" height="100"/></clipPath><path d="{tablet(62, 50, 16)}" fill="{TE}" clip-path="url(#own{j})"/>'
        o += g(x, y, ps, body)
        if kind == 'run' and t >= T_RUN + (j - 2) * 0.25:
            p = ease_out(clamp((t - T_RUN - (j - 2) * 0.25) / 0.45))
            ex, ey = cx + dx * 0.42, cy + dy * 0.42
            o += (f'<path d="M{ex:.0f},{ey:.0f} L{ex + (x - ex) * p:.0f},{ey + (y - ey - 50) * p:.0f}" stroke="{TEAL_INK}" stroke-width="5" '
                  f'stroke-dasharray="14 10" fill="none"/>')
            if p >= 1:                                   # the place keeps its own look, held on a string
                o += f'<circle cx="{x}" cy="{y - 50}" r="7" fill="{TEAL_INK}"/>'
    o = f'<g transform="translate(960,400) scale(1.5) translate(-960,-400)">{o}</g>'      # the picture, larger
    # the definition, word by word, laid out by the browser
    spans = ''.join(f'<tspan fill-opacity="{clamp((t - t0 + 0.03) / 0.2):.3f}">{w} </tspan>' for w, t0 in zip(DEF, TW))
    o += (f'<text x="960" y="790" font-family="\'Inter8\'" font-size="52" fill="{INK}" text-anchor="middle" xml:space="preserve">'
          f'<tspan x="960">{spans[:0]}</tspan>' + ''.join(
              f'<tspan x="960" dy="{0 if k == 0 else 66}">' + ''.join(
                  f'<tspan fill-opacity="{clamp((t - TW[i] + 0.03) / 0.2):.3f}">{DEF[i]} </tspan>' for i in rng) + '</tspan>'
              for k, rng in enumerate((range(0, 10), range(10, len(DEF))))) + '</text>')
    # the term on the orange strip, and how to say it
    if t >= T_TERM:
        sw = 100 * 0.62 * 11 + 50
        x0 = 960 - (sw + 30 + 470) / 2                    # the strip and the pronunciation, centred as a pair
        o += highlight(x0, 1000, 'IMPERIALISM', 100, prog=(tq - T_TERM) / 0.27)
        if t >= T_TERM + 0.3:
            o += f'<g opacity="{clamp((t - T_TERM - 0.3) / 0.25):.3f}">' + text(x0 + sw + 30, 975, '/ im-PEER-ee-uh-liz-um /', 34, 'Plex', TEAL_INK) + '</g>'
    return {'h': {'ov': o}}


if __name__ == '__main__':
    S.write(frame)
    print('card', round(B - A, 2), 's; starts at', round(A, 2), 's into ch 4')
