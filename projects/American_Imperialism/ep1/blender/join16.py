# Join 16 (chapter 6, "This one had help. The help came"): the committee room's camera rises from the rifles to the tall
# window and flies out through its upper-left pane; outside is Honolulu harbor (harbor.py) in the late afternoon, and the
# flight carries on over the roofs, swings round USS Boston and settles into the harbor wide H1.
# One camera path shared by committee.py (the inside, K3) and harbor.py (the head H0 before H1), so both sets render the
# same move: inside the room the harbor camera copies the room camera through a fixed placement of the room in the
# harbor's world (the window faces the harbor, so room +y is harbor -y), and the room's render is laid over the harbor's
# with its window transparent. Night to afternoon: the harbor seen through the glass is graded from night to day as the
# camera closes on the window (in the composite, see tools in build/sets), so the sky brightens as the camera passes it.
# Use: exec this file with _wt (the word timer) in its globals, then call the functions below. Times are chapter 6 seconds.
import math
from mathutils import Vector

STEM_ = 'ch06_the_heist'
T_K3 = _wt(STEM_, 'This one had help') - 0.1                   # the rise starts
T_X = _wt(STEM_, 'The help came') + 0.22                       # the camera crosses the window, on "help"
T_B = _wt(STEM_, 'John Stevens') - 0.45                        # the flight has settled into H1's slow push
# the room (committee.py coordinates): the window's upper-left pane, which the camera flies through
WX, WW, WZ0, WZ1, Y1 = -2.35, 1.25, 1.0, 3.15, 5.0
PANE = Vector((WX - WW / 4, Y1 + 0.1, (WZ0 + WZ1) / 2 + (WZ1 - WZ0) / 4))
# where that pane sits in the harbor's world: a third-floor office behind the waterfront, looking down Fort Street's
# roofs to the harbor (room +x is harbor -x, room +y is harbor -y)
PANE_H = Vector((-34.0, 30.0, 15.0))
CROOM = [Vector(v) for v in ((0.6, -3.35, 2.8), (0.0, -1.9, 3.05), (-1.9, 0.4, 2.9), (PANE.x, 2.4, PANE.z + 0.05),
                              (PANE.x, 3.9, PANE.z), PANE, (PANE.x, 7.0, PANE.z + 0.3))]
LROOM = [Vector((0.05, 0.55, 0.78)), Vector((PANE.x, 40.0, PANE.z - 3.5))]
LENS0, LENS_X, LENS_H1 = 43.0, 26.0, 45.0


def to_harbor(v):
    d = Vector(v) - PANE
    return PANE_H + Vector((-d.x, -d.y, d.z))


def _cr(P, s):
    """Catmull-Rom through P at parameter s in [0, len(P) - 1]"""
    i = min(int(s), len(P) - 2)
    t = s - i
    p0, p1, p2, p3 = P[max(i - 1, 0)], P[i], P[i + 1], P[min(i + 2, len(P) - 1)]
    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3)


def _arc(P, n=400):
    pts = [_cr(P, (len(P) - 1) * k / n) for k in range(n + 1)]
    acc = [0.0]
    for a, b in zip(pts, pts[1:]):
        acc.append(acc[-1] + (b - a).length)
    return pts, acc


def _at(pts, acc, s):
    s = max(0.0, min(acc[-1], s))
    lo, hi = 0, len(acc) - 1
    while hi - lo > 1:
        m = (lo + hi) // 2
        if acc[m] <= s:
            lo = m
        else:
            hi = m
    t = (s - acc[lo]) / max(1e-9, acc[hi] - acc[lo])
    return pts[lo].lerp(pts[hi], t)


def _ss(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


_RP, _RA = _arc(CROOM)
S_X = _RA[int(400 * 5 / 6)]                                   # arc length to the pane (control point 5 of 6 segments)
D_K3 = T_X - T_K3
V_X = 2.0 * S_X / D_K3                                        # s = S_X u^2: from rest, accelerating, through the glass


def room(t):
    """the room camera (committee coordinates) at chapter time t: position, look-at, lens"""
    u = (t - T_K3) / D_K3
    s = S_X * u * u if u <= 1 else S_X + V_X * (t - T_X)
    pos = _at(_RP, _RA, s)
    look = LROOM[0].lerp(PANE, _ss(u / 0.45)).lerp(LROOM[1], _ss((u - 0.45) / 0.4))   # turn to the window, then through it
    lens = LENS0 + (LENS_X - LENS0) * _ss(u / 0.9)
    return pos, look, lens


def harbor(t, h1_pos, h1_look):
    """the harbor camera at chapter time t (T_K3 to T_B): a copy of the room camera until the crossing, then the flight
    over the roofs, round the Boston and into H1 (h1_pos, h1_look: H1's camera at T_B)"""
    if t <= T_X:
        p, l, ln = room(t)
        return to_harbor(p), to_harbor(l), ln
    x0 = to_harbor(PANE)
    v0 = (to_harbor(_at(_RP, _RA, S_X + 0.05)) - x0).normalized()
    P = [x0, x0 + v0 * 6.0, Vector((-30.0, -12.0, 30.0)), Vector((-88.0, -168.0, 42.0)), Vector((-38.0, -350.0, 27.0)), Vector(h1_pos)]
    pts, acc = _arc(P)
    S = acc[-1]
    D = T_B - T_X
    u = (t - T_X) / D
    m0 = V_X * D                                              # Hermite in arc length: leaves the glass at the room's speed,
    m1 = 6.0 * D                                              # settles at about H1's own creep
    s = (u ** 3 - 2 * u * u + u) * m0 + (-2 * u ** 3 + 3 * u * u) * S + (u ** 3 - u * u) * m1
    pos = _at(pts, acc, s)
    fwd = to_harbor(LROOM[1])
    boston = Vector((40.0, -190.0, 8.0))
    look = fwd.lerp(boston, _ss(u / 0.35)).lerp(Vector(h1_look), _ss((u - 0.45) / 0.55))
    lens = LENS_X + (LENS_H1 - LENS_X) * _ss((u - 0.3) / 0.7)
    return pos, look, lens
