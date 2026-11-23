# People who move, drawn in code with the poster figure rig (as in the Hawaiʻi movement test, sample 8):
# a solved walk (planted feet, knees by inverse kinematics, speed set from the stride so nothing slides), poses eased
# with a small anticipation, all stepped at 12 fps by the caller.
import math, os, sys
from ep import HS, clamp, ease, back_out
sys.path.insert(0, os.path.join(HS, '..', 'Retro_Poster_Test', 'tools'))
from figures import person, POSES, SKIN, HAIR, tint   # noqa: E402,F401

A, DUTY, PERIOD, LIFT = 1.15, 0.6, 0.9, 0.42


def ik(dx, dy):
    l1, l2 = 1.9, 1.95
    d = min(math.hypot(dx, dy), l1 + l2 - 1e-3)
    al = math.atan2(dx, dy)
    th = al + math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))
    kn = math.pi - math.acos((l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2))
    return math.degrees(th), math.degrees(kn)


def gait(ph, swing=24, arms='swing'):
    hip = 3.7 - 0.07 * math.cos(4 * math.pi * ph)
    P = dict(lean=2, head=0)
    for k, off in (('a', 0.0), ('b', 0.5)):
        p = (ph + off) % 1
        if p < DUTY:
            fx, fy = A * (1 - 2 * p / DUTY), hip
        else:
            s = (p - DUTY) / (1 - DUTY)
            fx, fy = -A + 2 * A * ease(s), hip - LIFT * math.sin(math.pi * s)
        P['thigh_' + k], P['knee_' + k] = ik(fx, fy)
    c = math.cos(2 * math.pi * ph)
    if arms == 'carry':                       # both hands forward and up, holding something in front
        P.update(arm_a=40, elbow_a=70, arm_b=46, elbow_b=64, lean=5)
    elif arms == 'shoulder':                  # a sack on the near shoulder
        P.update(arm_a=-swing * c, elbow_a=16 + 6 * c, arm_b=150, elbow_b=150, lean=7)
    else:
        P.update(arm_a=-swing * c, elbow_a=16 + 6 * c, arm_b=swing * c, elbow_b=16 - 6 * c)
    return P


def speed(h):
    """px per second at which a walker of height h must move so its planted foot doesn't slide"""
    return 2 * A * (h / 8) / (DUTY * PERIOD)


def walker(tq, x0, y, h, facing=1, t0=0.0, t1=1e9, phase=0.0, arms='swing', **look):
    """a person walking from x0 (at t0) in the facing direction, stopping at t1. Returns (svg, joints, x)."""
    v = speed(h)
    tt = clamp(tq, t0, t1) - t0
    x = x0 + facing * v * tt
    if t0 <= tq < t1:
        P = gait((tt / PERIOD + phase) % 1, arms=arms)
        svg, J = person(x, y, h, 'walk', facing=facing, **look, **P)
    else:
        svg, J = person(x, y, h, 'stand', facing=facing, **look)
    return svg, J, x


def mix(p0, p1, u):
    a, b = POSES[p0], POSES[p1]
    return {k: a[k] + (b[k] - a[k]) * u for k in a}


def react(tq, t_react, p0, p1, dur=0.55):
    """ease from pose p0 to p1 at t_react: a small move the wrong way first, then the move with an overshoot"""
    u = (tq - t_react) / dur
    if u <= 0:
        return mix(p0, p1, 0)
    if u < 0.2:
        return mix(p0, p1, -0.12 * math.sin(math.pi * u / 0.2))
    return mix(p0, p1, back_out(clamp((u - 0.2) / 0.8), 1.4))


def toil(tq, p0, p1, period=1.4, k=0.0):
    """a repeated work motion between two poses (shoveling, hauling), eased both ways"""
    u = 0.5 - 0.5 * math.cos(2 * math.pi * (tq / period + k))
    return mix(p0, p1, u)
