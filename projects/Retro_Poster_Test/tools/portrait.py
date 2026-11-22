# Poster portraits: a head-and-shoulders bust for medium shots of named people, in the same flat, faceted language as
# the wide scenes (tools/figures.py is untouched and still draws the small faceless figures). No outlines: the face is
# read from a few shade planes (eye socket, nose, lip, cheek), a simple eye and brow, hair and whiskers.
#
# bust() returns an ORDERED list of (stage, svg) pieces, so a scene can show them all at once (a still) or lay them down
# one at a time (tools/reveal.py), the "drawn before your eyes" idea from claude-drawing-skill's staged paintings.
#
# The bust is designed facing right with the light from the upper right, in units of one head height, origin at the
# centre of the head. place() mirrors it by default, so it faces left into the scene's upper-left light.
import math
from facet import PAL, pts
from figures import tint, rpoly


def _p(L, fill, r=0.0, op=None):
    """polygon in head units (3 decimals; facet.pts rounds to 0.1, which is far too coarse here)"""
    P = ' '.join(f'{a:.3f},{b:.3f}' for a, b in L)
    st = f' stroke="{fill}" stroke-width="{2 * r:.3f}" stroke-linejoin="round"' if r else ''
    return f'<polygon points="{P}" fill="{fill}"{st}' + (f' opacity="{op}"' if op is not None else '') + '/>'


def bust(skin='#d9b38f', hair='#3a2e25', coat='#33414f', shirt=None, cravat='#2a2622', moustache='walrus', beard=None,
         hair_style='parted', hat=None, hat_col='#2f2c28', buttons=None, age=0.0):
    shirt = shirt or PAL['cream']
    buttons = buttons or PAL['yellow']
    S = []                                          # (stage, svg)
    add = lambda stage, svg: S.append((stage, svg))
    T = lambda svg: f'<g transform="translate(0 -0.1)">{svg}</g>'    # the torso sits a little higher: a shorter neck
    sk_d = tint(skin, -0.16)

    # ---- flats: coat, neck, shirt
    add('flat', T(_p([(-1.4, 2.3), (-1.22, 1.08), (-.68, .75), (-.28, .62), (.2, .66), (.72, .85), (1.1, 1.18), (1.22, 2.3)], coat, 0.03)))
    add('flat', _p([(-.22, .28), (.16, .4), (.18, .74), (-.3, .72)], sk_d, 0.02))
    add('flat', T(_p([(-.27, .62), (.2, .66), (.02, 1.16)], shirt)))
    # ---- head
    head = [(.02, -.5), (.26, -.44), (.37, -.2), (.4, -.1), (.56, .08), (.46, .14), (.44, .21), (.41, .3), (.4, .43),
            (.24, .51), (-.06, .42), (-.27, .22), (-.36, 0), (-.44, -.2), (-.3, -.45)]
    add('flat', _p(head, skin, 0.025))
    add('flat', _p([(-.33, -.1), (-.25, -.12), (-.23, .08), (-.3, .12)], sk_d, 0.025))                         # ear
    # ---- hair
    if hair_style == 'parted':
        hp = [(.3, -.36), (.27, -.49), (.1, -.57), (-.14, -.585), (-.34, -.5), (-.46, -.32), (-.47, -.1), (-.43, .1), (-.37, .16),
              (-.31, .1), (-.33, -.04), (-.25, -.14), (-.19, -.08), (-.17, .06), (-.1, .04), (-.1, -.24), (.04, -.36), (.2, -.34)]
    elif hair_style == 'short':
        hp = [(.28, -.4), (.2, -.54), (-.08, -.6), (-.38, -.5), (-.48, -.22), (-.44, .06), (-.36, -.02), (-.27, -.13),
              (-.2, -.06), (-.14, -.3), (.05, -.4)]
    elif hair_style == 'long':
        hp = [(.3, -.38), (.24, -.55), (-.08, -.63), (-.42, -.52), (-.58, -.2), (-.6, .3), (-.46, .55), (-.28, .4),
              (-.36, -.02), (-.27, -.13), (-.2, -.04), (-.15, -.26), (.03, -.37), (.2, -.36)]
    else:
        hp = None
    if hp:
        add('flat', _p(hp, hair, 0.025))
    # ---- shade planes (the light is upper right, so shadow falls left and down)
    add('shade', T(_p([(-1.4, 2.3), (-1.22, 1.08), (-.68, .75), (-.3, .64), (-.2, 2.3)], '#000', 0, 0.2)))        # coat, back
    add('shade', T(_p([(-.28, .62), (.0, 1.14), (-.14, 1.6), (-.46, 1.02)], tint(coat, 0.16))))                   # near lapel
    add('shade', T(_p([(.2, .66), (.02, 1.14), (.22, 1.5), (.42, .98)], tint(coat, -0.22))))                      # far lapel
    add('shade', _p([(-.3, -.27), (-.06, -.32), (-.03, 0), (-.1, .26), (-.06, .42), (-.27, .22), (-.36, 0)], '#000', 0, 0.13))   # cheek side
    add('shade', _p([(.05, -.17), (.39, -.18), (.39, -.06), (.2, -.025), (.07, -.06)], '#000', 0, 0.16))        # eye socket
    add('shade', _p([(.33, -.1), (.41, -.1), (.5, .09), (.34, .135)], '#000', 0, 0.15))                           # side of nose
    add('shade', _p([(.2, .315), (.4, .3), (.37, .375), (.23, .385)], '#000', 0, 0.12))                          # under the lip
    add('shade', _p([(-.2, .34), (.16, .44), (.17, .5), (-.24, .46)], '#000', 0, 0.18))                           # under the jaw
    if hp:
        add('shade', _p([(.27, -.49), (.1, -.57), (-.14, -.585), (-.2, -.53), (.0, -.5), (.2, -.42)], tint(hair, 0.16)))   # hair, lit top
        add('shade', _p([(-.34, -.5), (-.46, -.32), (-.47, -.1), (-.43, .1), (-.37, .16), (-.38, -.1), (-.32, -.38)], tint(hair, -0.25)))   # hair, back
    if age > 0:
        add('shade', _p([(.1, .02), (.3, .1), (.28, .13), (.08, .05)], '#000', 0, 0.1 * age))                    # cheek line
        add('shade', _p([(.02, -.3), (.3, -.31), (.3, -.295), (.02, -.285)], '#000', 0, 0.1 * age))              # brow line
    # ---- details: eyes, brows, mouth, whiskers, collar, cravat, buttons
    ink = '#26221f'
    add('detail', _p([(.11, -.088), (.2, -.126), (.29, -.088), (.2, -.06)], ink))
    add('detail', _p([(.44, .118), (.51, .1), (.47, .145)], '#000', 0, 0.35))                                      # nostril
    add('detail', _p([(.345, -.092), (.383, -.112), (.402, -.09), (.375, -.074)], ink))
    add('detail', _p([(.06, -.19), (.2, -.218), (.32, -.195), (.2, -.188)], hair, 0.007))
    add('detail', _p([(.335, -.195), (.412, -.205), (.412, -.175)], hair, 0.004))
    add('detail', _p([(.29, .25), (.425, .243), (.41, .268)], tint(skin, -0.45)))
    if moustache == 'walrus':
        add('detail', _p([(.455, .15), (.3, .135), (.12, .2), (.06, .34), (.2, .285), (.36, .25), (.49, .31), (.5, .21)], hair, 0.012))
        add('detail', _p([(.3, .135), (.455, .15), (.44, .19), (.28, .18)], tint(hair, 0.18)))
    elif moustache == 'trim':
        add('detail', _p([(.45, .16), (.3, .145), (.18, .2), (.3, .215), (.46, .22)], hair, 0.01))
    if beard == 'full':
        add('detail', _p([(-.26, .1), (-.12, .16), (.08, .3), (.3, .3), (.44, .28), (.42, .5), (.26, .66), (.0, .62), (-.22, .4)], hair, 0.02))
        add('detail', _p([(.08, .3), (.3, .3), (.44, .28), (.42, .42), (.2, .44)], tint(hair, 0.14)))
    elif beard == 'chin':
        add('detail', _p([(.24, .38), (.4, .36), (.4, .54), (.28, .64), (.2, .5)], hair, 0.02))
    add('detail', T(_p([(-.27, .6), (-.05, .67), (-.14, .87)], '#f6efd9', 0.012)))
    add('detail', T(_p([(.2, .645), (.02, .685), (.1, .88)], tint('#f6efd9', -0.1), 0.012)))
    if cravat:
        add('detail', T(_p([(-.09, .69), (.06, .69), (.11, .88), (.01, 1.08), (-.11, .88)], cravat, 0.012)))
    for by in (1.34, 1.62, 1.9):
        add('detail', T(f'<circle cx="{.04 - (by - 1.34) * .02:.3f}" cy="{by}" r="0.032" fill="{buttons}"/>'))
    if hat == 'slouch':
        add('detail', _p([(-.95, -.3), (-.5, -.42), (.3, -.42), (.85, -.24), (.4, -.3), (-.5, -.3)], hat_col, 0.03))
        add('detail', _p([(-.46, -.36), (.3, -.38), (.22, -.86), (-.06, -.78), (-.38, -.84)], hat_col, 0.03))
        add('detail', _p([(-.06, -.78), (.22, -.86), (.3, -.38), (-.02, -.37)], tint(hat_col, 0.14)))
        add('detail', _p([(-.46, -.42), (.3, -.44), (.3, -.36), (-.46, -.34)], tint(hat_col, -0.3)))
    elif hat == 'kepi':
        add('detail', _p([(-.46, -.36), (.34, -.38), (.3, -.62), (-.4, -.78)], hat_col, 0.03))
        add('detail', _p([(-.46, -.36), (.34, -.38), (.34, -.3), (-.46, -.28)], tint(hat_col, -0.3)))
        add('detail', _p([(.3, -.34), (.72, -.24), (.32, -.26)], '#23211e', 0.012))
    return S


def place(pieces, x, y, u, mirror=True):
    """put bust pieces into scene pixels: (x, y) is the centre of the head, u the head height"""
    sx = -u if mirror else u
    return [(st, f'<g transform="translate({x} {y}) scale({sx} {u})">{svg}</g>') for st, svg in pieces]
