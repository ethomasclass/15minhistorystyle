# Poster people: a small jointed rig drawn as flat shapes (no outlines, no faces), in the proportions of a real figure
# (8 units tall), with period clothes, hats, hair, a shade side and a cast shadow. Inspired by the pose rig in
# claude-drawing-skill's spot-illustration style; written for SVG so figures stay separate layers.
#
#   svg, J = person(x, y, h, pose='walk', facing=1, coat='#4f6377', hat='kepi')
#   J holds absolute joints (hand_a, hand_b, head, shoulder, hip, eye) for ropes, tools and props.
import math
from facet import PAL, pts

SKIN = ['#d9b38f', '#c79b78', '#e3c4a2', '#8f6a4c']
HAIR = ['#3a2e25', '#5b4330', '#8a6a45', '#2a2622', '#9a968c']


def tint(c, k):
    """k < 0 darkens toward black, k > 0 lightens toward white"""
    c = c.lstrip('#')
    v = [int(c[i:i + 2], 16) for i in (0, 2, 4)]
    v = [int(a + (255 - a) * k) if k > 0 else int(a * (1 + k)) for a in v]
    return '#%02x%02x%02x' % tuple(max(0, min(255, a)) for a in v)


def _d(a, s=1):
    """unit vector for an angle measured from straight down, positive toward s (screen y is down)"""
    a = math.radians(a)
    return (s * math.sin(a), math.cos(a))


def _add(p, v, k=1.0):
    return (p[0] + v[0] * k, p[1] + v[1] * k)


def seg(p0, p1, w0, w1, fill):
    """a tapered limb between two joints, with round ends"""
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dx, dy) or 1e-6
    nx, ny = -dy / L, dx / L
    q = [(p0[0] + nx * w0, p0[1] + ny * w0), (p1[0] + nx * w1, p1[1] + ny * w1),
         (p1[0] - nx * w1, p1[1] - ny * w1), (p0[0] - nx * w0, p0[1] - ny * w0)]
    return (f'<polygon points="{pts(q)}" fill="{fill}"/>'
            f'<circle cx="{p0[0]:.1f}" cy="{p0[1]:.1f}" r="{w0:.1f}" fill="{fill}"/>'
            f'<circle cx="{p1[0]:.1f}" cy="{p1[1]:.1f}" r="{w1:.1f}" fill="{fill}"/>')


def rpoly(p, fill, r=0.0, extra=''):
    """polygon with corners rounded by a same-colour stroke"""
    s = f'stroke="{fill}" stroke-width="{2 * r:.1f}" stroke-linejoin="round"' if r else ''
    return f'<polygon points="{pts(p)}" fill="{fill}" {s} {extra}/>'


def ell(cx, cy, rx, ry, fill, extra=''):
    return f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{fill}" {extra}/>'


# angles in degrees. lean: torso from vertical (+ forward). thigh: from down (+ forward); knee: bend (shin swings back).
# arm: upper arm from down (+ forward, 180 = straight up); elbow: bend (forearm swings forward/up). a = far side, b = near.
POSES = {
    'stand': dict(lean=0, head=0, thigh_a=5, knee_a=2, thigh_b=-5, knee_b=2, arm_a=6, elbow_a=12, arm_b=-8, elbow_b=14),
    'ease': dict(lean=-2, head=4, thigh_a=10, knee_a=10, thigh_b=-4, knee_b=0, arm_a=20, elbow_a=95, arm_b=-12, elbow_b=18),
    'walk': dict(lean=5, head=0, thigh_a=26, knee_a=8, thigh_b=-20, knee_b=26, arm_a=-28, elbow_a=22, arm_b=30, elbow_b=28),
    'haul': dict(lean=-20, head=-22, thigh_a=34, knee_a=22, thigh_b=-6, knee_b=14, arm_a=128, elbow_a=14, arm_b=112, elbow_b=22),
    'pull': dict(lean=-12, head=-10, thigh_a=28, knee_a=16, thigh_b=-12, knee_b=18, arm_a=80, elbow_a=28, arm_b=62, elbow_b=38),
    'point': dict(lean=0, head=-4, thigh_a=6, knee_a=2, thigh_b=-6, knee_b=2, arm_a=-6, elbow_a=14, arm_b=98, elbow_b=4),
    'glass': dict(lean=-4, head=-14, thigh_a=8, knee_a=2, thigh_b=-8, knee_b=2, arm_a=96, elbow_a=118, arm_b=84, elbow_b=128),
    'kneel': dict(lean=34, head=18, thigh_a=88, knee_a=96, thigh_b=6, knee_b=96, arm_a=58, elbow_a=38, arm_b=44, elbow_b=46),
    'bend': dict(lean=38, head=10, thigh_a=14, knee_a=14, thigh_b=-10, knee_b=10, arm_a=72, elbow_a=52, arm_b=58, elbow_b=62),
    'sit': dict(lean=4, head=0, thigh_a=86, knee_a=84, thigh_b=80, knee_b=82, arm_a=30, elbow_a=70, arm_b=20, elbow_b=74),
    'carry': dict(lean=2, head=0, thigh_a=14, knee_a=4, thigh_b=-12, knee_b=12, arm_a=-10, elbow_a=18, arm_b=10, elbow_b=42),
    'hips': dict(lean=-3, head=-6, thigh_a=7, knee_a=0, thigh_b=-7, knee_b=0, arm_a=34, elbow_a=-96, arm_b=34, elbow_b=-96),
    'shade': dict(lean=-2, head=-8, thigh_a=6, knee_a=0, thigh_b=-6, knee_b=0, arm_a=10, elbow_a=10, arm_b=118, elbow_b=128),
    'write': dict(lean=6, head=22, thigh_a=6, knee_a=2, thigh_b=-6, knee_b=2, arm_a=26, elbow_a=92, arm_b=18, elbow_b=98),
}


def hat_svg(kind, c, u, f, col, view):
    cx, cy = c
    P = lambda L: [(cx + f * a * u, cy + b * u) for a, b in L]
    dk = tint(col, -0.3)
    o = ''
    if kind == 'kepi':
        o += rpoly(P([(-.52, -.2), (.47, -.26), (.4, -.66), (-.46, -.84)]), col, 0.04 * u)
        o += rpoly(P([(-.52, -.2), (.47, -.26), (.46, -.36), (-.51, -.32)]), dk)
        if view != 'back':
            o += rpoly(P([(.36, -.27), (.92, -.14), (.4, -.16)]), '#23211e', 0.02 * u)
    elif kind == 'slouch':
        o += ell(cx, cy - .3 * u, 1.02 * u, .17 * u, col)
        o += rpoly(P([(-.47, -.3), (.47, -.3), (.37, -.9), (0, -.8), (-.37, -.9)]), col, 0.04 * u)
        o += rpoly(P([(-.47, -.3), (.47, -.3), (.45, -.42), (-.45, -.42)]), dk)
        o += f'<polygon points="{pts([(cx, cy - .3 * u), (cx + .47 * u, cy - .3 * u), (cx + .37 * u, cy - .9 * u), (cx, cy - .8 * u)])}" fill="#000" opacity="0.14"/>'
    elif kind == 'straw':
        o += ell(cx, cy - .3 * u, 1.1 * u, .17 * u, col)
        o += rpoly(P([(-.45, -.3), (.45, -.3), (.4, -.66), (-.4, -.66)]), col, 0.05 * u)
        o += rpoly(P([(-.45, -.3), (.45, -.3), (.44, -.4), (-.44, -.4)]), dk)
    elif kind == 'bowler':
        o += ell(cx, cy - .32 * u, .74 * u, .12 * u, col)
        arc = [(cx + .46 * u * math.cos(a), cy - .34 * u - .5 * u * math.sin(a)) for a in [i * math.pi / 12 for i in range(13)]]
        o += rpoly(arc, col)
    elif kind == 'top':
        o += ell(cx, cy - .34 * u, .72 * u, .11 * u, col)
        o += rpoly(P([(-.42, -.34), (.42, -.34), (.46, -1.22), (-.46, -1.22)]), col, 0.02 * u)
        o += rpoly(P([(-.42, -.34), (.42, -.34), (.42, -.48), (-.42, -.48)]), dk)
    elif kind == 'bonnet':
        o += ell(cx - f * .12 * u, cy - .12 * u, .62 * u, .66 * u, col)
        o += rpoly(P([(.1, -.72), (.62, -.5), (.6, .1), (.3, .2)]), tint(col, 0.25), 0.05 * u)
    elif kind == 'cap':
        o += rpoly(P([(-.5, -.22), (.5, -.26), (.4, -.56), (-.3, -.66)]), col, 0.08 * u)
        if view != 'back':
            o += rpoly(P([(.4, -.3), (.86, -.2), (.42, -.18)]), dk, 0.02 * u)
    return o


def person(x, y, h, pose='stand', facing=1, view='side', coat=None, coat_len=0.6, trousers=None, boots='#2c2925',
           skin=None, hair=None, hat=None, hat_col=None, beard=False, belt=None, strap=None, collar=None, dress=False,
           shadow=True, shade=0.17, sleeves=None, vest=None, **over):
    coat = coat or PAL['blue']
    trousers = trousers or PAL['ink2']
    skin = skin or SKIN[0]
    hair = HAIR[0] if hair is None else hair
    sleeves = sleeves or coat
    P = dict(POSES[pose]); P.update(over)
    u, f = h / 8.0, facing
    side = view == 'side'
    far, near = tint(trousers, -0.2), trousers

    hip = (0.0, 0.0)
    L = math.radians(P['lean'])
    up = (f * math.sin(L), -math.cos(L)) if side else (0.0, -1.0)
    fr = (f * math.cos(L), f * math.sin(L) * f) if side else (1.0, 0.0)
    sc = _add(hip, up, 2.45 * u)                    # between the shoulders
    J = {}

    # ---- legs: 'a' is the far leg (or screen-left in front/back view), 'b' the near leg
    legs = {}
    for k in 'ab':
        s = f if side else (-1 if k == 'a' else 1)
        off = 0.0 if side else (-0.34 if k == 'a' else 0.34) * u
        hp = (hip[0] + off, hip[1])
        th = P['thigh_' + k] if side else abs(P['thigh_' + k]) * 0.6 + 3
        kn = _add(hp, _d(th, s), 1.9 * u)
        sh_ang = th - P['knee_' + k] if side else th * 0.5
        an = _add(kn, _d(sh_ang, s), 1.95 * u)
        if side and sh_ang < -55:                    # shin lying on the ground: toes point back along it
            toe = _add(an, _d(sh_ang, s), 0.55 * u)
        else:
            toe = (an[0] + (f if side else s * 0.45) * 0.58 * u, an[1] + 0.2 * u)
        legs[k] = (hp, kn, an, toe)
    ground = max(max(l[2][1] + 0.3 * u, l[3][1] + 0.11 * u, l[1][1] + 0.34 * u) for l in legs.values())
    if dress:
        ground = max(ground, 4.05 * u)

    def leg(k, col):
        hp, kn, an, toe = legs[k]
        o = seg(hp, kn, 0.5 * u, 0.4 * u, col) + seg(kn, an, 0.38 * u, 0.27 * u, col)
        mid = _add(kn, (an[0] - kn[0], an[1] - kn[1]), 0.52)
        bc = boots if col == near else tint(boots, -0.15)
        o += seg(mid, an, 0.31 * u, 0.25 * u, bc) + seg((an[0], an[1] + 0.1 * u), toe, 0.2 * u, 0.11 * u, bc)
        return o

    # ---- torso outline
    def along(t, k):
        p = _add(hip, up, 2.45 * u * t)
        return _add(p, fr, k * u)
    if side:
        back = [(0, -.5), (.35, -.44), (.75, -.5), (1.0, -.4)]
        front = [(1.0, .38), (.75, .58), (.35, .47), (0, .46)]
        torso = [along(t, k) for t, k in back] + [along(t, k) for t, k in front]
        if f > 0:
            shade_half = [along(t, 0) for t in (0, .35, .75, 1.0)] + [along(t, k) for t, k in front]
        else:
            shade_half = [along(t, 0) for t in (1.0, .75, .35, 0)] + [along(t, k) for t, k in back]
        hw = 0.56
    else:
        torso = [along(0, -.78), along(.35, -.68), along(.78, -.9), along(.96, -.95), along(1.08, -.3),
                 along(1.08, .3), along(.96, .95), along(.78, .9), along(.35, .68), along(0, .78)]
        shade_half = [along(0, 0), along(1.08, 0), along(1.08, .3), along(.96, .95), along(.78, .9), along(.35, .68),
                      along(0, .78)]
        hw = 0.86
    o_torso = rpoly(torso, coat, 0.07 * u)
    # coat skirt / dress
    o_skirt, skirt_shade = '', ''
    def tails(t, half, hem, wd, r):
        wl, wr = sorted([along(t, -half), along(t, half)])
        mid = along(t, 0)
        sk = [wl, (hem[0] - wd, hem[1]), (hem[0] + wd, hem[1]), wr]
        sh = [mid, (hem[0] + 0.05 * u, hem[1]), (hem[0] + wd, hem[1]), wr]
        return rpoly(sk, coat, r), f'<polygon points="{pts(sh)}" fill="#000" opacity="{shade}"/>'
    if dress:
        o_skirt, skirt_shade = tails(.3, hw, (hip[0], ground - 0.1 * u), 1.35 * u, 0.1 * u)
    elif coat_len > 0:
        la, lb = legs['a'], legs['b']
        avg = ((la[1][0] + lb[1][0]) / 2 - hip[0], (la[1][1] + lb[1][1]) / 2 - hip[1])
        n = math.hypot(*avg) or 1
        hem = _add(hip, (avg[0] / n, avg[1] / n), coat_len * u)
        spread = abs(la[1][0] - lb[1][0]) * 0.5 * min(1.0, coat_len / 1.9)
        o_skirt, skirt_shade = tails(.25, hw - .04, hem, (hw + 0.06 + 0.1 * coat_len) * u + spread, 0.07 * u)
    o_shade = f'<polygon points="{pts(shade_half)}" fill="#000" opacity="{shade}"/>' + skirt_shade

    # ---- arms
    arms = {}
    for k in 'ab':
        s = f if side else (-1 if k == 'a' else 1)
        sp = _add(sc, up, -0.2 * u)
        sp = _add(sp, fr, (0.0 if side else (-0.8 if k == 'a' else 0.8)) * u)
        a = P['arm_' + k]
        el = _add(sp, _d(a, s), 1.45 * u)
        wr = _add(el, _d(a + P['elbow_' + k], s), 1.3 * u)
        hd = _add(wr, _d(a + P['elbow_' + k], s), 0.2 * u)
        arms[k] = (sp, el, wr, hd)

    def arm(k, col):
        sp, el, wr, hd = arms[k]
        return (seg(sp, el, 0.36 * u, 0.3 * u, col) + seg(el, wr, 0.29 * u, 0.24 * u, col)
                + f'<circle cx="{hd[0]:.1f}" cy="{hd[1]:.1f}" r="{0.21 * u:.1f}" fill="{skin}"/>')

    # ---- neck and head
    nk = _add(sc, up, 0.42 * u)
    ha = math.radians(P['lean'] * 0.5 + P['head']) if side else 0.0
    hc = (nk[0] + f * math.sin(ha) * 0.5 * u, nk[1] - math.cos(ha) * 0.5 * u) if side else (nk[0], nk[1] - 0.5 * u)
    o_head = seg(_add(sc, up, -0.05 * u), _add(nk, up, 0.1 * u), 0.2 * u, 0.19 * u, tint(skin, -0.12))
    hx, hy = hc
    if view == 'back':
        o_head += ell(hx, hy, 0.47 * u, 0.56 * u, hair or skin)
    else:
        o_head += ell(hx, hy, 0.47 * u, 0.56 * u, hair or skin)
        if side:
            o_head += ell(hx + f * 0.13 * u, hy + 0.1 * u, 0.36 * u, 0.45 * u, skin)
            o_head += rpoly([(hx + f * 0.44 * u, hy - 0.02 * u), (hx + f * 0.6 * u, hy + 0.14 * u), (hx + f * 0.42 * u, hy + 0.2 * u)], skin, 0.02 * u)
            if beard:
                o_head += rpoly([(hx - f * 0.05 * u, hy + 0.2 * u), (hx + f * 0.44 * u, hy + 0.16 * u), (hx + f * 0.4 * u, hy + 0.62 * u), (hx + f * 0.1 * u, hy + 0.66 * u)], hair, 0.05 * u)
        else:
            o_head += ell(hx, hy + 0.1 * u, 0.38 * u, 0.44 * u, skin)
            if beard:
                o_head += ell(hx, hy + 0.4 * u, 0.33 * u, 0.24 * u, hair)
    half = [(hx + 0.47 * u * math.cos(a), hy + 0.56 * u * math.sin(a)) for a in [-math.pi / 2 + i * math.pi / 10 for i in range(11)]]
    o_head += f'<polygon points="{pts(half)}" fill="#000" opacity="{shade * 0.8:.2f}"/>'
    if hat:
        o_head += hat_svg(hat, hc, u, f if side else 1, hat_col or '#2f2c28', view)

    # ---- details
    det = ''
    if collar and view != 'back':
        cpt = [along(1.0, .1 if side else -.22), along(1.0, .38 if side else .22), along(.8, .5 if side else 0)]
        det += rpoly(cpt, collar, 0.02 * u)
    if vest and view == 'front':
        det += rpoly([along(1.0, -.22), along(1.0, .22), along(.2, .3), along(.2, -.3)], vest)
    if belt:
        det += rpoly([along(.2, -hw + .06), along(.2, hw - .08), along(.32, hw - .08), along(.32, -hw + .06)], belt)
    if strap:
        det += rpoly([along(1.0, -.3), along(1.0, -.12), along(.22, hw - .1), along(.22, hw - .3)], strap)

    far_s = tint(sleeves, -0.2)
    if side:
        body = (arm('a', far_s) + leg('a', far) + leg('b', near) + o_skirt + o_torso + o_shade + det + o_head
                + arm('b', sleeves))
    elif view == 'back':
        body = (leg('a', near) + leg('b', tint(near, -0.12)) + arm('a', sleeves) + arm('b', far_s) + o_skirt + o_torso
                + o_shade + det + o_head)
    else:
        body = (leg('a', near) + leg('b', tint(near, -0.12)) + o_skirt + o_torso + o_shade + det + arm('a', sleeves)
                + arm('b', far_s) + o_head)
    if dress and side:
        body = (arm('a', far_s) + leg('a', far) + leg('b', near) + o_torso + o_skirt + o_shade + det + o_head
                + arm('b', sleeves))

    ty = y - ground
    out = ''
    if shadow:
        out += (f'<g transform="translate({x:.1f} {y:.1f}) matrix(1 0 -0.8 -0.2 0 0) translate(0 {-ground:.1f})" '
                f'filter="url(#flatshadow)" opacity="0.26">{body}</g>')
    out += f'<g transform="translate({x:.1f} {ty:.1f})">{body}</g>'
    A = lambda p: (p[0] + x, p[1] + ty)
    J = dict(hand_a=A(arms['a'][3]), hand_b=A(arms['b'][3]), head=A(hc), shoulder=A(sc), hip=A(hip),
             eye=A((hx + f * 0.42 * u, hy)), foot_a=A(legs['a'][2]), foot_b=A(legs['b'][2]), u=u, top=A((hx, hy - 0.6 * u)))
    return out, J


# ---------------------------------------------------------------- animals and props
def mule(x, y, h, facing=1, col='#6e5c49', pack=None, horse=False, shadow=True):
    """a mule (or horse) in profile; h = height at the withers. Feet on (x, y)."""
    f = facing
    T = lambda L: [(f * a * h, -b * h) for a, b in L]
    dk, lt = tint(col, -0.22), tint(col, 0.14)
    o = ''
    # far legs
    for (ax, kx, hx_) in ((.3, .33, .31), (-.44, -.5, -.46)):
        o += seg(T([(ax, .68)])[0], T([(kx, .34)])[0], .075 * h, .05 * h, dk) + seg(T([(kx, .34)])[0], T([(hx_, .03)])[0], .05 * h, .04 * h, dk)
    # tail
    o += f'<path d="M{f * -.68 * h:.1f},{-.9 * h:.1f} Q{f * -.86 * h:.1f},{-.75 * h:.1f} {f * -.8 * h:.1f},{-.38 * h:.1f}" stroke="{tint(col, -0.4)}" stroke-width="{.05 * h:.1f}" fill="none" stroke-linecap="round"/>'
    body = T([(-.66, .96), (-.3, 1.02), (.2, 1.0), (.46, 1.06), (.56, .84), (.44, .6), (.1, .54), (-.36, .56), (-.64, .62), (-.72, .8)])
    o += rpoly(body, col, .03 * h)
    o += rpoly(T([(-.7, .72), (-.36, .56), (.1, .54), (.44, .6), (.54, .78), (.2, .68), (-.3, .7)]), dk, .02 * h)
    # neck, head, ears, mane
    o += rpoly(T([(.36, 1.02), (.62, 1.4), (.82, 1.34), (.56, .8)]), col, .03 * h)
    o += rpoly(T([(.38, 1.04), (.62, 1.42), (.68, 1.42), (.46, 1.04)]), tint(col, -0.45), .015 * h)
    hd = [(.6, 1.42), (.8, 1.5), (1.02, 1.2), (1.04, 1.08), (.93, 1.05), (.74, 1.26)]
    o += rpoly(T(hd), col, .025 * h)
    o += rpoly(T([(.93, 1.05), (1.04, 1.08), (1.02, 1.2), (.94, 1.18)]), lt, .02 * h)
    ear = 1.0 if not horse else 0.5
    o += rpoly(T([(.66, 1.46), (.6, 1.46 + .32 * ear), (.73, 1.5)]), dk, .015 * h)
    o += rpoly(T([(.74, 1.5), (.75, 1.5 + .32 * ear), (.83, 1.49)]), col, .015 * h)
    # near legs
    for (ax, kx, hx_) in ((.42, .44, .43), (-.56, -.62, -.57)):
        o += seg(T([(ax, .7)])[0], T([(kx, .34)])[0], .085 * h, .055 * h, col) + seg(T([(kx, .34)])[0], T([(hx_, .03)])[0], .055 * h, .042 * h, col)
        o += rpoly(T([(hx_ - .05, .0), (hx_ + .06, .0), (hx_ + .04, .08), (hx_ - .04, .08)]), '#2c2925')
    if pack:
        o += rpoly(T([(-.42, 1.0), (.22, .98), (.26, 1.24), (.0, 1.34), (-.4, 1.28)]), pack, .04 * h)
        o += rpoly(T([(-.1, 1.0), (.22, .98), (.26, 1.24), (.0, 1.34)]), tint(pack, -0.14), .02 * h)
        o += rpoly(T([(-.2, .56), (-.14, .56), (-.1, 1.3), (-.16, 1.3)]), '#3a332b')
        o += rpoly(T([(-.5, .92), (-.3, .9), (-.28, .66), (-.5, .7)]), tint(pack, -0.3), .02 * h)
    out = ''
    if shadow:
        out += f'<g transform="translate({x:.1f} {y:.1f}) matrix(1 0 -0.8 -0.2 0 0)" filter="url(#flatshadow)" opacity="0.26">{o}</g>'
    return out + f'<g transform="translate({x:.1f} {y:.1f})">{o}</g>'


def rifle(J, u, f=1, col='#3b3129'):
    """a rifle carried at the shoulder: from the near hand up past the shoulder"""
    hx, hy = J['hand_b']
    sx, sy = J['shoulder']
    tip = (sx - f * 0.6 * u, sy - 2.2 * u)
    dx, dy = hx - tip[0], hy - tip[1]
    n = math.hypot(dx, dy) or 1
    butt = (hx + dx / n * 0.9 * u, hy + dy / n * 0.9 * u)
    return (f'<line x1="{hx:.1f}" y1="{hy:.1f}" x2="{tip[0]:.1f}" y2="{tip[1]:.1f}" stroke="{col}" stroke-width="{0.12 * u:.1f}" stroke-linecap="round"/>'
            f'<line x1="{butt[0]:.1f}" y1="{butt[1]:.1f}" x2="{hx - dx / n * 0.8 * u:.1f}" y2="{hy - dy / n * 0.8 * u:.1f}" stroke="#5a4532" stroke-width="{0.26 * u:.1f}" stroke-linecap="round"/>')


def tool(J, u, kind='pick', f=1):
    hx, hy = J['hand_b']
    if kind == 'pick':
        top = (hx + f * 0.5 * u, hy - 2.6 * u)
        return (f'<line x1="{hx - f * 0.2 * u:.1f}" y1="{hy + 1.0 * u:.1f}" x2="{top[0]:.1f}" y2="{top[1]:.1f}" stroke="#6d5a43" stroke-width="{0.13 * u:.1f}" stroke-linecap="round"/>'
                f'<path d="M{top[0] - 0.9 * u:.1f},{top[1] + 0.35 * u:.1f} Q{top[0]:.1f},{top[1] - 0.3 * u:.1f} {top[0] + 0.9 * u:.1f},{top[1] + 0.35 * u:.1f}" stroke="#3a3934" stroke-width="{0.16 * u:.1f}" fill="none" stroke-linecap="round"/>')
    if kind == 'shovel':
        bot = (hx + f * 0.6 * u, hy + 3.2 * u)
        return (f'<line x1="{hx - f * 0.3 * u:.1f}" y1="{hy - 1.6 * u:.1f}" x2="{bot[0]:.1f}" y2="{bot[1]:.1f}" stroke="#6d5a43" stroke-width="{0.13 * u:.1f}" stroke-linecap="round"/>'
                + rpoly([(bot[0] - 0.3 * u, bot[1] - 0.2 * u), (bot[0] + 0.3 * u, bot[1] - 0.2 * u), (bot[0] + 0.2 * u, bot[1] + 0.6 * u), (bot[0] - 0.2 * u, bot[1] + 0.6 * u)], '#4b4a44', 0.04 * u))
    if kind == 'pan':
        return ell(hx + f * 0.5 * u, hy + 0.15 * u, 0.85 * u, 0.24 * u, '#4b4a44') + ell(hx + f * 0.5 * u, hy + 0.1 * u, 0.62 * u, 0.14 * u, '#8c8a80')
    if kind == 'glass':
        ex, ey = J['eye']
        return f'<line x1="{ex:.1f}" y1="{ey:.1f}" x2="{ex + f * 1.7 * u:.1f}" y2="{ey - 0.5 * u:.1f}" stroke="{PAL["yellow"]}" stroke-width="{0.3 * u:.1f}" stroke-linecap="round"/>'
    if kind == 'book':
        return rpoly([(hx - 0.1 * u, hy - 0.5 * u), (hx + f * 0.8 * u, hy - 0.6 * u), (hx + f * 0.85 * u, hy + 0.15 * u), (hx, hy + 0.2 * u)], PAL['cream'], 0.03 * u)
    return ''
