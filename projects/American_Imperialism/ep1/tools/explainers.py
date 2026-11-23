# The Ep 1 explainers (flat vector, the chapter 5 badge look), each keyed to the narration's words:
#   coal          ch 4  "ruled the sea ... bases and coaling stations"   the coal gauge map (real Pacific coastlines)
#   tariff_1875   ch 6  "Sugar coming into the United States ... Plantations boomed"   the tariff gate
#   tariff_1890   ch 6  "Then, in 1890 ... it would get the bonus too"   the same gate, the booth gone, the bonus chute
#   vote          ch 8  "Not with a treaty ... a majority in each house"   two-thirds against a majority (quiet palette)
#   pacific1898   ch 8  "at war with Spain ... looked useful"   Hawaiʻi between San Francisco and Manila (quiet)
# Each piece is a function returning (S, frame, stem, a, b).
#   python3 tools/explainers.py                       render every piece and join them into renders/tests/explainers.mp4
#   python3 tools/explainers.py coal vote             render only these (the join takes whatever is listed)
#   python3 tools/explainers.py --stills coal 1.5 6   a few PNG stills (times in s into the piece) in build/explainer_stills
import math, os, shutil, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vkit import *   # noqa: F401,F403
from vkit import EP, KIT
from pacmap import Pac, PLACES, COAST

OUT = os.path.join(EP, 'renders', 'tests')
SEA, SEA_D, LAND, LAND_D = '#1d1b17', '#0d0c09', BONE_D, '#a89f8e'
GOLD = '#ffd27a'
HAW_BOX = (199, 18, 206, 23)                     # the Hawaiian chain's rings in the coastline data (lon, lat box)


def hawaii_rings(m, fill):
    """the Hawaiian islands drawn again on top of the land, in their own colour"""
    d = ''
    for ring in COAST:
        lo = [p[0] % 360 for p in ring]
        la = [p[1] for p in ring]
        if HAW_BOX[0] <= min(lo) and max(lo) <= HAW_BOX[2] and HAW_BOX[1] <= min(la) and max(la) <= HAW_BOX[3]:
            d += 'M' + ' L'.join('%.1f,%.1f' % m.xy(a, b) for a, b in ring) + 'z'
    return f'<path d="{d}" fill="{fill}" stroke="{fill}" stroke-width="2.5" stroke-linejoin="round"/>'


def map_tablet(m, cid, outline=TE, land=LAND, land_d=LAND_D, grat_op=0.08, c=40):
    """the Pacific on a cut-corner tablet: sea, a faint graticule, real coastlines, the outline"""
    path = f'M{m.x + c},{m.y} L{m.x + m.w - c},{m.y} L{m.x + m.w},{m.y + c} L{m.x + m.w},{m.y + m.h - c} L{m.x + m.w - c},{m.y + m.h} ' \
           f'L{m.x + c},{m.y + m.h} L{m.x},{m.y + m.h - c} L{m.x},{m.y + c} z'
    return (f'<clipPath id="{cid}"><path d="{path}"/></clipPath>'
            f'<path d="{path}" fill="{SEA_D}" transform="translate(10,12)"/><path d="{path}" fill="{SEA}"/>'
            f'<g clip-path="url({"#" + cid})">{m.graticule(15, BONE, grat_op, 1.5)}{m.land_svg(land, shade=land_d, dx=3, dy=4)}</g>'
            f'<path d="{path}" fill="none" stroke="{outline}" stroke-width="6"/>')


def pin(fill, shade, k=1.0):
    """a map pin, its tip at 0,0"""
    return (f'<g transform="scale({k})"><path d="M0,0 C-6,-16 -22,-28 -22,-46 A22,22 0 1,1 22,-46 C22,-28 6,-16 0,0 z" fill="{shade}" transform="translate(3,3)"/>'
            f'<path d="M0,0 C-6,-16 -22,-28 -22,-46 A22,22 0 1,1 22,-46 C22,-28 6,-16 0,0 z" fill="{fill}"/>'
            f'<circle cy="-46" r="8.5" fill="{SEA}"/></g>')


def drop_pin(t, t0, x, y, fill, shade, k=1.0):
    """a pin that drops onto the map on twos, with a ring on the water where it lands"""
    if t < t0:
        return ''
    u = (step12(t) - t0) / 0.25
    dy = -90 * (1 - ease_out(clamp(u), 2))
    sq = 1.0 if u < 1 else 1 + 0.12 * math.exp(-(u - 1) * 3) * math.cos((u - 1) * 9)
    o = ''
    if 1 <= u < 3.2:
        r = 10 + (u - 1) * 16
        o += f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{r:.1f}" ry="{r * 0.4:.1f}" fill="none" stroke="{fill}" stroke-width="3" opacity="{0.8 * (1 - (u - 1) / 2.2):.3f}"/>'
    return o + f'<g transform="translate({x:.1f},{y + dy:.1f}) scale({1 / sq:.3f},{sq:.3f})">{pin(fill, shade, k)}</g>'


def dashed(p0, p1, prog, color=TE, w=5, dash='14 11', op=1.0):
    if prog <= 0:
        return ''
    x = p0[0] + (p1[0] - p0[0]) * clamp(prog)
    y = p0[1] + (p1[1] - p0[1]) * clamp(prog)
    return (f'<line x1="{p0[0]:.1f}" y1="{p0[1]:.1f}" x2="{x:.1f}" y2="{y:.1f}" stroke="{color}" stroke-width="{w}" '
            f'stroke-dasharray="{dash}" stroke-linecap="round" opacity="{op:.3f}"/>')


def steamship():
    """a side-on steamer facing left (bow at -x), waterline at y=0, about 130 px long"""
    return (f'<ellipse cx="4" cy="10" rx="70" ry="7" fill="#000" opacity="0.35"/>'
            f'<path d="M-66,-8 L60,-8 L54,12 L-48,12 z" fill="{CREAM}"/>'
            f'<path d="M-56,3 L57,3 L54,12 L-48,12 z" fill="{BONE_D}"/>'
            f'<rect x="-66" y="-11" width="126" height="5" fill="{INK}"/>'
            f'<rect x="-22" y="-30" width="58" height="20" fill="{BONE}"/>'
            + ''.join(f'<rect x="{x}" y="-25" width="8" height="8" fill="{INK}"/>' for x in (-14, 0, 14, 26))
            + f'<rect x="2" y="-56" width="17" height="27" fill="{BONE_D}"/><rect x="2" y="-56" width="17" height="7" fill="{INK}"/>'
            f'<rect x="-44" y="-58" width="3" height="48" fill="{BONE_D}"/><rect x="40" y="-48" width="3" height="38" fill="{BONE_D}"/>'
            f'<path d="M-44,-56 L-10,-34 M-44,-56 L41,-46" stroke="{BONE_D}" stroke-width="1.5"/>')


def smoke(tq, moving):
    if not moving:
        return ''
    o = ''
    for k in range(4):
        age = ((tq * 1.6 + k / 4) % 1.0)
        o += (f'<circle cx="{14 + age * 70:.1f}" cy="{-64 - age * 26:.1f}" r="{6 + age * 11:.1f}" fill="{BONE}" '
              f'opacity="{0.55 * (1 - age):.3f}"/>')
    return o


def gauge(level, blink=False, n=8):
    """the coal gauge: a dark panel, eight cells that empty one by one"""
    lit = int(math.ceil(level * n - 1e-6))
    o = (f'<path d="{tablet(150, 46, 14)}" fill="{SEA_D}" transform="translate(6,8)"/>'
         f'<path d="{tablet(150, 46, 14)}" fill="#111"/>'
         f'<path d="{tablet(150, 46, 14)}" fill="none" stroke="{BONE_D if not blink else CREAM}" stroke-width="{3 if not blink else 6}"/>')
    for i in range(n):
        x = -128 + i * 32.5
        if i < lit:
            o += f'<rect x="{x:.1f}" y="-28" width="26" height="56" fill="{TE}"/><rect x="{x + 17:.1f}" y="-28" width="9" height="56" fill="{TE_D}"/>'
        else:
            o += f'<rect x="{x + 1.5:.1f}" y="-26.5" width="23" height="53" fill="none" stroke="{TE_D}" stroke-width="3" opacity="0.6"/>'
    return o


# ================================================================ 1 · the coal gauge map (ch 4)
def coal():
    stem = 'ch04_the_pitch_meeting'
    W0 = Words(stem)
    a = W0.at('ruled the sea') - 0.12
    b = W0.at('it is equally vain') - 0.08
    Wd = Words(stem, t0=a)
    S = stage('ex_coal', b - a)
    m = Pac(111.5, 72.5, 1697, 935, bbox=(112, -18, 250, 58))
    S.world.append(map_tablet(m, 'coalclip') + hawaii_rings(m, CO))
    S.over.append('<g id="ov"></g>')
    SF, HNL, MID, YOK, SAM = (m.xy(*PLACES[k]) for k in ('San Francisco', 'Honolulu', 'Midway', 'Yokohama', 'Samoa'))

    T_SEA, T_SHIPS, T_STEAM, T_COAL = Wd.at('sea'), Wd.at('ships'), Wd.at('Steamships'), Wd.at('coal')
    T_FAST = Wd.end('through it fast')
    T_CUT, T_REFUEL = Wd.at('places to refuel') - 0.05, Wd.at('refuel')
    T_SCAT, T_OCEAN, T_COALING = Wd.at('scattered'), Wd.at('ocean'), Wd.at('coaling stations')
    REACH = 0.55                                         # how far toward Asia a full gauge gets you
    D_FULL = REACH * math.dist(SF, YOK)

    # the second run: legs (t_start, t_end, from, to); refills at the stations in between
    LEGS = [(T_CUT + 0.12, T_REFUEL + 0.3, SF, HNL), (T_SCAT + 0.02, T_SCAT + 0.6, HNL, MID), (T_SCAT + 0.95, T_COALING, MID, YOK)]
    REFILL = 0.25

    def run2(tq):
        """ship position, moving?, gauge level on the second run (each leg leaves full; the gauge refills at a station)"""
        for i, (t0, t1, p0, p1) in enumerate(LEGS):
            if tq < t0:
                if i == 0:
                    return p0, False, 1.0
                q = LEGS[i - 1]
                arr = 1 - math.dist(q[2], q[3]) / D_FULL
                return p0, False, arr + (1 - arr) * clamp((tq - q[1] - 0.06) / REFILL)
            if tq < t1:
                e = ease_io((tq - t0) / (t1 - t0))
                return (p0[0] + (p1[0] - p0[0]) * e, p0[1] + (p1[1] - p0[1]) * e), True, 1 - math.dist(p0, p1) * e / D_FULL
        return YOK, False, 1 - math.dist(MID, YOK) / D_FULL

    def frame(t):
        tq = step12(t)
        o = ''
        # San Francisco and the goal
        o += f'<circle cx="{SF[0]:.1f}" cy="{SF[1]:.1f}" r="9" fill="{CREAM}" stroke="{SEA}" stroke-width="3"/>'
        o += tag(SF[0] - 22, SF[1] + 42, 'SAN FRANCISCO', 19, CREAM, 'end')
        o += f'<circle cx="{YOK[0]:.1f}" cy="{YOK[1]:.1f}" r="9" fill="{CREAM}" stroke="{SEA}" stroke-width="3"/>'
        if t >= T_SEA - 0.1:
            o += highlight(176, 250, 'ASIA', 50, prog=(tq - T_SEA + 0.1) / 0.27)
        first = t < T_CUT
        if first:
            # the try: straight for Asia on one load of coal
            o += dashed(SF, YOK, (tq - T_SHIPS - 0.15) / 0.5, BONE, 4, '10 12', 0.55)
            u = clamp((tq - T_COAL - 0.05) / (T_FAST - 0.12 - T_COAL - 0.05))
            e = ease_out(u, 1.6)
            pos = (SF[0] + (YOK[0] - SF[0]) * REACH * e, SF[1] + (YOK[1] - SF[1]) * REACH * e)
            moving = 0 < u < 1
            lvl = 1 - e
            ang = math.degrees(math.atan2(YOK[1] - SF[1], YOK[0] - SF[0])) - 180
        else:
            pos, moving, lvl = run2(tq)
            ang = 0.0
            for (t0, t1, p0, p1) in LEGS:
                if tq >= t0:
                    ang = math.degrees(math.atan2(p1[1] - p0[1], p1[0] - p0[0])) - 180
        # coaling stations: Honolulu first (Hawaiʻi, in coral), then others scattered across the ocean
        if not first:
            o += dashed(SF, HNL, (tq - T_CUT) / 0.3, TE, 5)
            o += dashed(HNL, MID, (tq - T_SCAT + 0.1) / 0.25, TE, 5)
            o += dashed(MID, YOK, (tq - T_SCAT - 0.6) / 0.35, TE, 5)
            o += drop_pin(t, T_CUT, HNL[0], HNL[1], CO, CO_D)
            o += drop_pin(t, T_SCAT - 0.1, MID[0], MID[1], TE, TE_D, 0.8)
            o += drop_pin(t, T_OCEAN, SAM[0], SAM[1], TE, TE_D, 0.8)
            o += highlight(HNL[0] + 30, HNL[1] + 74, 'HAWAIʻI', 40, prog=(tq - T_CUT - 0.15) / 0.27)
            if t >= T_COALING:
                o += highlight(612, 742, 'COALING STATIONS', 46, prog=(tq - T_COALING) / 0.27)
            if tq >= T_COALING:                         # made it: a ring at Asia
                u = (tq - T_COALING) / 0.5
                if u < 1:
                    o += f'<circle cx="{YOK[0]:.1f}" cy="{YOK[1]:.1f}" r="{14 + 40 * u:.1f}" fill="none" stroke="{TE}" stroke-width="5" opacity="{1 - u:.3f}"/>'
        # the ship
        sp = pop(t, T_SHIPS, 0.34)
        if sp > 0:
            bob = 2.5 * math.sin(tq * 5.0)
            ang = (ang + 180) % 360 - 180
            o += g(pos[0], pos[1] - 6 + bob, sp * 0.9, smoke(tq, moving) + steamship(), rot=max(-12, min(12, ang * 0.5)))
        # the gauge
        gs = pop(t, T_STEAM, 0.34)
        if gs > 0:
            blink = first and lvl <= 0.001 and t > T_FAST - 0.05 and int(tq * 4) % 2 == 0
            o += g(1610, 872, gs, gauge(max(0.0, lvl), blink))
            if t >= T_COAL:
                o += highlight(1468, 806, 'COAL', 40, prog=(tq - T_COAL) / 0.27)
        return {'h': {'ov': o}}
    return S, frame, stem, a, b


# ================================================================ the tariff gate (ch 6)
GROUND, GX, BOOTH_X, STOP, Q2, Q3 = 800, 845, 705, 560, 415, 270   # ground line, gate post, toll booth, where a sack waits to pay, the queue
BORDER = 875
ZOOM = 'translate(960,640) scale(1.18) translate(-960,-640)'       # the gate scene is drawn a little larger than its layout


def sack(fill, shade, label, tcol=INK):
    """a sugar sack, its bottom centre at 0,0, about 136 px wide"""
    return (f'<ellipse cx="0" cy="2" rx="70" ry="10" fill="#000" opacity="0.35"/>'
            f'<path d="M-62,0 Q-76,-62 -50,-102 Q-40,-120 -25,-124 L25,-124 Q40,-120 50,-102 Q76,-62 62,0 Q0,10 -62,0 z" fill="{fill}"/>'
            f'<path d="M12,-124 L25,-124 Q40,-120 50,-102 Q76,-62 62,0 Q38,7 16,8 Q50,-52 12,-124 z" fill="{shade}"/>'
            f'<path d="M-25,-124 Q-12,-142 0,-130 Q12,-142 25,-124 Q0,-117 -25,-124 z" fill="{shade}"/>'
            f'<rect x="-28" y="-131" width="56" height="9" rx="4" fill="{INK}"/>'
            f'<text x="-4" y="-50" font-family="\'Inter8\'" font-size="27" fill="{tcol}" text-anchor="middle" letter-spacing="2">SUGAR</text>'
            + text(-4, -22, label, 17, 'Plex', tcol, 'middle', extra='letter-spacing="1.5"'))


def coin(r=14):
    return (f'<circle r="{r}" fill="{GOLD}" stroke="{OR_D}" stroke-width="4"/>'
            f'<circle r="{r * 0.55:.1f}" fill="none" stroke="{OR_D}" stroke-width="2.5"/>')


def coin_stack(n, x, y):
    """n coins stacked flat, their bottom at y"""
    o = ''
    for i in range(n):
        cy = y - 6 - i * 7
        o += f'<rect x="{x - 17}" y="{cy}" width="34" height="7" fill="{OR_D}"/><ellipse cx="{x}" cy="{cy + 7}" rx="17" ry="6" fill="{OR_D}"/>'
        o += f'<ellipse cx="{x}" cy="{cy}" rx="17" ry="6" fill="{GOLD}"/>'
    return o


def booth(n_coins, wave=None, sign_prog=None, tq=0.0):
    """the toll booth (drawn in place, behind the road)"""
    x0 = BOOTH_X - 80
    o = (f'<rect x="{x0 + 10}" y="{GROUND - 6}" width="170" height="14" fill="#000" opacity="0.3" filter="url(#soft4)"/>'
         f'<rect x="{x0}" y="{GROUND - 240}" width="160" height="240" fill="{CREAM}"/>'
         f'<rect x="{x0 + 118}" y="{GROUND - 240}" width="42" height="240" fill="{BONE_D}"/>'
         f'<path d="M{x0 - 18},{GROUND - 236} L{x0 + 178},{GROUND - 236} L{x0 + 160},{GROUND - 272} L{x0},{GROUND - 272} z" fill="{TE_D}"/>'
         f'<rect x="{x0 + 26}" y="{GROUND - 200}" width="84" height="68" fill="#2a2620"/>'
         f'<rect x="{x0 + 18}" y="{GROUND - 134}" width="100" height="10" fill="{BONE_D}"/>'
         f'<rect x="{x0 + 50}" y="{GROUND - 100}" width="40" height="100" fill="{BONE_D}" opacity="0.6"/>')
    o += coin_stack(n_coins, x0 + 92, GROUND - 134)
    if wave is not None:                                 # a teal glove waves the sack through
        o += (f'<g transform="translate({x0 + 40},{GROUND - 150}) rotate({wave:.1f})">'
              f'<rect x="-9" y="-46" width="18" height="46" rx="8" fill="{TE_D}"/><circle cy="-52" r="17" fill="{TE}"/>'
              + ''.join(f'<rect x="{-16 + k * 9}" y="-82" width="7" height="24" rx="3.5" fill="{TE}"/>' for k in range(4))
              + f'<rect x="12" y="-60" width="16" height="7" rx="3.5" fill="{TE}" transform="rotate(-30 12 -60)"/></g>')
    if sign_prog is not None:
        o += highlight(x0 - 4, GROUND - 292, 'TARIFF', 40, prog=sign_prog, rot=-1.5)
    return o


def gate(lift):
    """the post and the striped arm; lift 0 = down (closed), 1 = up"""
    ang = 82 * lift
    arm = (f'<g transform="rotate({ang:.1f} {GX} {GROUND - 118})">'
           f'<rect x="{GX - 212}" y="{GROUND - 128}" width="212" height="20" rx="4" fill="{CREAM}"/>'
           + ''.join(f'<rect x="{GX - 200 + k * 48}" y="{GROUND - 128}" width="22" height="20" fill="{INK}"/>' for k in range(4))
           + f'<rect x="{GX - 222}" y="{GROUND - 126}" width="14" height="40" rx="3" fill="{BONE_D}"/></g>')
    return (f'<rect x="{GX - 9}" y="{GROUND - 150}" width="30" height="150" fill="{BONE_D}"/>'
            f'<rect x="{GX + 9}" y="{GROUND - 150}" width="12" height="150" fill="{LAND_D}"/>'
            + arm + f'<circle cx="{GX}" cy="{GROUND - 118}" r="13" fill="{INK}" stroke="{BONE_D}" stroke-width="4"/>')


def scenery(t, tq, us_label=True):
    """the ground, the border line and the two side labels"""
    o = (f'<rect x="0" y="{GROUND}" width="1920" height="10" fill="{BONE_D}" opacity="0.5"/>'
         f'<rect x="0" y="{GROUND + 10}" width="1920" height="270" fill="#000" opacity="0.12"/>'
         f'<line x1="{BORDER}" y1="370" x2="{BORDER}" y2="{GROUND + 90}" stroke="{TE}" stroke-width="5" stroke-dasharray="18 14" opacity="0.9"/>')
    o += text(BORDER - 40, 400, 'FOREIGN SUGAR', 22, 'Plex', TAG, 'end', extra='letter-spacing="3"')
    if us_label:
        o += text(BORDER + 40, 400, 'THE UNITED STATES', 22, 'Plex', TAG, 'start', extra='letter-spacing="3"')
    return o


class Walk:
    """a sack's track: hold at x, then moves (t0, t1, x1); hops on twos while it moves"""

    def __init__(self, x, moves):
        self.x0, self.moves = x, moves

    def at(self, tq):
        x = self.x0
        for t0, t1, x1 in self.moves:
            if tq < t0:
                return x, 0.0
            if tq < t1:
                u = (tq - t0) / (t1 - t0)
                hops = max(1, round(abs(x1 - x) / 110))
                return x + (x1 - x) * ease_io(u), -20 * abs(math.sin(math.pi * hops * u))
            x = x1
        return x, 0.0


def coin_flight(tq, t0, x, d=0.3):
    """a coin tossed from a sack at x into the booth window; None before and after"""
    u = (tq - t0) / d
    if u < 0 or u >= 1:
        return ''
    sx, sy = x, GROUND - 150
    ex, ey = BOOTH_X + 12, GROUND - 145
    px, py = sx + (ex - sx) * u, sy + (ey - sy) * u - 90 * math.sin(math.pi * u)
    return g(px, py, 1.0, coin(13), rot=u * 300)


def price_tag(x, n, s):
    """a cream price tag over a sack, n coins on it"""
    body = (f'<line x1="0" y1="14" x2="0" y2="40" stroke="{BONE_D}" stroke-width="3"/>'
            f'<path d="{tablet(46, 24, 8)}" fill="{CREAM}"/>'
            + ''.join(g(-17 * (n - 1) + 34 * k, 0, 1.0, coin(13)) for k in range(n)))
    return g(x, GROUND - 176, s, body)


def tariff_1875():
    stem = 'ch06_the_heist'
    W0 = Words(stem)
    a = W0.at('Sugar coming into') - 0.25
    b = W0.end('Plantations boomed') + 0.25
    Wd = Words(stem, t0=a)
    S = stage('ex_tariff_1875', b - a)
    S.over.append('<g id="ov"></g>')
    T_SUGAR, T_COMING, T_STATES, T_ANOTHER = Wd.at('Sugar'), Wd.at('coming'), Wd.at('States'), Wd.at('another country')
    T_TAX, T_BORDER, T_TARIFF = Wd.at('tax at the border'), Wd.at('border'), Wd.at('called a tariff') + 0.5
    T_1875, T_HAW, T_NO = Wd.at('1875'), Wd.at('Hawaiian sugar'), Wd.at('no tariff at all')
    T_CHEAP, T_PLANT, T_BOOM = Wd.at('cheaper'), Wd.at('Plantations'), Wd.at('boomed')
    US = {'CUBA': 1650, 'BRAZIL': 1470, 'JAVA': 1290, 'HAWAIʻI': 1000}
    # who pays when: (coin time, arm up, arm down)
    PAY = [(T_TAX, T_BORDER, T_BORDER + 0.95), (T_TARIFF + 0.1, T_TARIFF + 0.45, T_TARIFF + 1.25), (T_1875 + 0.75, T_1875 + 1.05, T_1875 + 1.9)]
    SACKS = [('CUBA', BONE, BONE_D, T_SUGAR, Walk(-120, [(T_COMING, T_TAX - 0.3, STOP), (T_BORDER + 0.15, T_BORDER + 1.05, US['CUBA'])])),
             ('BRAZIL', BONE, BONE_D, T_STATES - 0.3, Walk(-120, [(T_STATES - 0.3, T_TAX - 0.1, Q2), (T_BORDER + 0.25, T_BORDER + 0.7, STOP),
                                                                     (T_TARIFF + 0.55, T_TARIFF + 1.35, US['BRAZIL'])])),
             ('JAVA', BONE, BONE_D, T_ANOTHER, Walk(-120, [(T_ANOTHER, T_TAX + 0.2, Q3), (T_BORDER + 0.35, T_BORDER + 0.8, Q2),
                                                           (T_TARIFF + 0.55, T_TARIFF + 1.0, STOP), (T_1875 + 1.15, T_1875 + 1.85, US['JAVA'])])),
             ('HAWAIʻI', CO, CO_D, T_HAW - 0.1, Walk(-120, [(T_HAW - 0.1, T_NO - 0.25, STOP), (T_NO + 0.3, T_NO + 1.0, US['HAWAIʻI'])]))]
    PILE = [(1140, 0, 1.0, False), (1070, -116, 1.0, False), (1074, -232, 1.0, False)]   # x, dy, scale, behind

    def frame(t):
        tq = step12(t)
        o = scenery(t, tq)
        n_coins = sum(1 for c, _, _ in PAY if tq >= c + 0.3)
        wave = None
        if T_NO - 0.1 <= tq < T_NO + 1.0:
            wave = 25 * math.sin((tq - T_NO) * 2 * math.pi * 2.2)
        sign = (tq - T_TARIFF + 0.5) / 0.27 if t >= T_TARIFF - 0.5 else None
        o += booth(n_coins, wave, sign, tq)
        # the arm: up while each payer goes through; up for the Hawaiian sack with no coin; up again for the boom
        lift = 0.0
        for up, dn in [(u_, d_) for _, u_, d_ in PAY] + [(T_NO + 0.05, T_NO + 1.1), (T_PLANT, 1e9)]:
            if up <= tq < dn + 0.25:
                lift = max(lift, ease_out(clamp((tq - up) / 0.25)) * (1 - ease(clamp((tq - dn) / 0.25))))
        o += gate(lift)
        for c, _, _ in PAY:
            o += coin_flight(tq, c, STOP + 20)
        pile = ['', '']
        for k, (px, dy, ps, back) in enumerate(PILE):
            s = pop(t, T_BOOM - 0.05 + k * 0.16, 0.3)
            if s > 0:
                pile[back] += g(px, GROUND + dy, s * ps, sack(CO, CO_D, 'HAWAIʻI') if not back else sack(CO_D, '#b8443e', 'HAWAIʻI'))
        o += pile[1]
        for name, fill, shade, t_in, walk in SACKS:
            if t < t_in:
                continue
            x, hy = walk.at(tq)
            o += g(x, GROUND + hy, 1.0, sack(fill, shade, name))
        # cheaper: the price tags (tariff paid on top of the price), the Hawaiian one without it
        if T_CHEAP - 0.05 <= t < T_PLANT - 0.05:
            for k, (name, xx) in enumerate(US.items()):
                o += price_tag(xx, 1 if name == 'HAWAIʻI' else 2, pop(t, T_CHEAP - 0.05 + 0.08 * (3 - k), 0.3))
            o += highlight(US['HAWAIʻI'] - 96, GROUND - 228, 'CHEAPER', 38, prog=(tq - T_CHEAP - 0.2) / 0.27)
        o += pile[0]                                      # plantations boomed: the Hawaiian sugar piles up
        o = f'<g transform="{ZOOM}">{o}</g>'
        if t >= T_1875:
            o += highlight(140, 200, '1875', 70, prog=(tq - T_1875) / 0.27)
        return {'h': {'ov': o}}
    return S, frame, stem, a, b


def chute(x, shake=0.0):
    """the bonus chute on its rail: a hopper, a spout"""
    x += shake
    return (f'<rect x="{x - 62}" y="226" width="124" height="96" fill="{BONE_D}"/>'
            f'<rect x="{x + 22}" y="226" width="40" height="96" fill="{LAND_D}"/>'
            f'<path d="M{x - 62},322 L{x + 62},322 L{x + 24},366 L{x - 24},366 z" fill="{LAND_D}"/>'
            f'<rect x="{x - 20}" y="364" width="40" height="150" fill="{BONE_D}"/>'
            f'<rect x="{x + 6}" y="364" width="14" height="150" fill="{LAND_D}"/>'
            f'<rect x="{x - 26}" y="506" width="52" height="16" fill="{INK}"/>'
            f'<circle cx="{x}" cy="274" r="26" fill="{GOLD}" stroke="{OR_D}" stroke-width="5"/>'
            f'<text x="{x}" y="286" font-family="\'Inter8\'" font-size="32" fill="{OR_D}" text-anchor="middle">$</text>'
            f'<rect x="{x - 40}" y="214" width="80" height="14" fill="{INK}"/>')


def badge_num(x, y, n, s):
    return g(x, y, s, f'<circle r="24" fill="{TE}"/><text y="11" font-family="\'Inter8\'" font-size="30" fill="{INK}" text-anchor="middle">{n}</text>')


def tariff_1890():
    stem = 'ch06_the_heist'
    W0 = Words(stem)
    a = W0.at('Then, in 1890') - 0.25
    b = W0.at('In 1891') - 0.05
    Wd = Words(stem, t0=a)
    S = stage('ex_tariff_1890', b - a)
    S.over.append('<g id="ov"></g>')
    T_1890, T_MCK, T_TOOK, T_OFF = Wd.at('1890'), Wd.at('McKinley'), Wd.at('It took'), Wd.at('off all foreign')
    T_EVERY, T_HEAD, T_GONE = Wd.at("everyone's sugar"), Wd.at('head start'), Wd.at('gone overnight')
    T_PAID, T_GROW, T_INSIDE = Wd.at('And it paid'), Wd.at('growers'), Wd.at('inside the United States')
    T_BONUS, T_TWO = Wd.at('bonus of two'), Wd.at('two cents')
    T_HSUG, T_DIDNT, T_WASNT = Wd.at('Hawaiian sugar didn\'t'), Wd.at("didn't get the bonus"), Wd.at("wasn't part")
    T_SO, T_BECAME = Wd.at('So the planters'), Wd.at('became part of America')
    T_AMER, T_TOO = Wd.at('American sugar'), Wd.at('bonus too')
    HX, G1, G2 = 1310, 1480, 1650
    cuba = Walk(STOP, [(T_EVERY, T_EVERY + 1.0, 1140)])
    java = Walk(Q2, [(T_EVERY + 0.1, T_EVERY + 1.15, 980)])
    # the chute's rides: (t0, t1, x)
    RIDES = [(T_BONUS + 0.55, T_BONUS + 0.85, G2), (T_HSUG, T_HSUG + 0.5, HX), (T_SO, T_SO + 0.5, G2), (T_TOO - 0.6, T_TOO - 0.1, HX)]
    DROPS = {G1: [T_BONUS + k * 0.15 for k in range(3)], G2: [T_BONUS + 0.9 + k * 0.15 for k in range(3)],
             HX: [T_TOO + k * 0.15 for k in range(3)]}
    FALL = 0.22

    def chute_x(tq):
        x = G1
        for t0, t1, x1 in RIDES:
            if tq < t0:
                return x
            if tq < t1:
                return x + (x1 - x) * ease_io((tq - t0) / (t1 - t0))
            x = x1
        return x

    def frame(t):
        tq = step12(t)
        o = scenery(t, tq)
        # 1: the toll booth and the gate are lifted away
        up = ease_out(clamp((tq - T_OFF) / 0.45), 2) if tq >= T_OFF else 0.0
        if up < 1:
            dy = -820 * up
            o += f'<g transform="translate(0,{dy:.1f})">' + booth(3, None, 1.0) + gate(0.0) + '</g>'
        o += badge_num(BORDER, 330, 1, pop(t, T_TOOK, 0.3))
        # the sacks
        for name, walk in (('JAVA', java), ('CUBA', cuba)):
            x, hy = walk.at(tq)
            o += g(x, GROUND + hy, 1.0, sack(BONE, BONE_D, name))
        hs = sack(CO, CO_D, 'HAWAIʻI')
        o += g(HX, GROUND, 1.0, hs)
        for gx_, k in ((G1, 0), (G2, 1)):
            s = pop(t, T_GROW + 0.12 * k, 0.32)
            if s > 0:
                o += g(gx_, GROUND, s, sack(TE, TE_D, 'U.S.'))
        # the head start (the old CHEAPER tag) blinks, then falls off
        if t < T_GONE + 0.6:
            vis = not (T_HEAD <= tq < T_GONE and int((tq - T_HEAD) * 6) % 2 == 1)
            fu = clamp((tq - T_GONE) / 0.5) if tq >= T_GONE else 0.0
            if vis and fu < 1:
                o += (f'<g transform="translate(0,{260 * fu * fu:.1f}) rotate({18 * fu:.1f} {HX} {GROUND - 200})" opacity="{1 - fu:.3f}">'
                      + highlight(HX - 96, GROUND - 168, 'CHEAPER', 38) + '</g>')
        # 2: the bonus chute pays U.S. growers
        cs = pop(t, T_PAID, 0.34)
        if cs > 0:
            cx = chute_x(tq)
            shake = 4 * math.sin(tq * 60) if T_DIDNT <= tq < T_DIDNT + 0.35 else 0.0
            o += g(0, 0, 1.0, f'<rect x="990" y="200" width="860" height="14" fill="{INK}"/>'
                              f'<rect x="990" y="200" width="860" height="5" fill="{BONE_D}" opacity="0.6"/>' + chute(cx, shake), op=min(1, cs))
            o += badge_num(962, 207, 2, pop(t, T_PAID + 0.1, 0.3))
        # the boundary of what counts as grown inside the United States
        if t >= T_INSIDE:
            left = 1395 - (1395 - 1225) * ease_out(clamp((tq - T_BECAME - 0.2) / 0.45))
            bl = T_WASNT <= tq < T_WASNT + 0.75 and int((tq - T_WASNT) * 6) % 2 == 1
            p = clamp((tq - T_INSIDE) / 0.4)
            if not bl:
                w_, h_ = 1745 - left, 250
                per = 2 * (w_ + h_)
                o += (f'<rect x="{left:.1f}" y="{GROUND - 220}" width="{w_:.1f}" height="{h_}" rx="18" fill="none" stroke="{TE}" stroke-width="5" '
                      f'stroke-dasharray="16 12" opacity="{min(1, p * 2):.3f}"/>')
                o += f'<g opacity="{p:.3f}">' + text((left + 1745) / 2, GROUND + 64, 'GROWN INSIDE THE U.S.', 20, 'Plex', TE, 'middle', extra='letter-spacing="2"') + '</g>'
        # the flag: Hawaiian sugar would count as American
        fs = pop(t, T_AMER + 0.2, 0.3)
        if fs > 0:
            fl = (f'<rect x="-2" y="-120" width="5" height="128" fill="{INK}"/>'
                  + ''.join(f'<rect x="3" y="{-120 + i * 52 / 7:.1f}" width="74" height="{52 / 7 + 0.4:.1f}" fill="{CO if i % 2 == 0 else CREAM}"/>' for i in range(7))
                  + f'<rect x="3" y="-120" width="32" height="{52 * 4 / 7:.1f}" fill="{INK}"/>'
                  + ''.join(f'<circle cx="{8 + c * 7}" cy="{-115 + r * 6.5}" r="1.6" fill="{CREAM}"/>' for r in range(4) for c in range(4)))
            dyf = -60 * (1 - min(1, (step12(t) - T_AMER - 0.2) / 0.15)) if t < T_AMER + 0.35 else 0
            o += g(HX + 36, GROUND - 108 + dyf, 1.15, fl, rot=10)
        # the coins: fall from the spout and stack on the sacks
        for sx, times in DROPS.items():
            n = 0
            for td in times:
                if tq >= td + FALL:
                    n += 1
                elif tq >= td:
                    u = (tq - td) / FALL
                    o += g(sx, 522 + (GROUND - 132 - 522) * u * u, 1.0, coin(13))
            if n:
                o += coin_stack(n, sx, GROUND - 128)
        o = f'<g transform="{ZOOM}">{o}</g>'
        if t >= T_TWO:
            o += highlight(1440, 985, '2¢ A POUND', 46, prog=(tq - T_TWO) / 0.27)
        if t >= T_1890:
            o += highlight(140, 170, '1890', 70, prog=(tq - T_1890) / 0.27)
        if t >= T_MCK:
            o += highlight(140, 262, 'MCKINLEY TARIFF', 50, prog=(tq - T_MCK) / 0.27)
        return {'h': {'ov': o}}
    return S, frame, stem, a, b


# ================================================================ the quiet chapter (ch 8): bone and teal only, slower
def qpop(t, t0, d=0.6):
    """a quiet pop: on twos, slower, almost no overshoot"""
    return back_out((step12(t) - t0) / d, 0.5) if t >= t0 else 0.0


def vote():
    stem = 'ch08_under_protest'
    W0 = Words(stem)
    a = W0.at('Not with a treaty') - 0.2
    b = W0.at('war with Spain') - 0.1                 # the map comes in on "at war with Spain"
    Wd = Words(stem, t0=a)
    S = stage('ex_vote', b - a, grain=0.3)
    S.over.append('<g id="ov"></g>')
    T_TREATY, T_TWO, T_SENATE = Wd.at('treaty'), Wd.at('two-thirds'), Wd.at('Senate')
    T_JOINT, T_MAJ, T_EACH = Wd.at('joint resolution'), Wd.at('majority'), Wd.at('each house')
    BASE, TOP = 860, 420                                  # the bars run from BASE up to TOP (100 %)
    SUPPORT = 0.56                                        # the same senators in both panels; the House a little more
    PANEL = '#1d1b17'

    def ylev(v):
        return BASE - (BASE - TOP) * v

    def bar(x, w, fill_v, color, label):
        o = (f'<rect x="{x - w / 2:.1f}" y="{TOP}" width="{w}" height="{BASE - TOP}" fill="#14120e" stroke="{BONE_D}" stroke-width="2" opacity="0.9"/>')
        if fill_v > 0:
            o += f'<rect x="{x - w / 2:.1f}" y="{ylev(fill_v):.1f}" width="{w}" height="{(BASE - TOP) * fill_v:.1f}" fill="{color}"/>'
        return o + text(x, BASE + 44, label, 22, 'Plex', BONE_D, 'middle', extra='letter-spacing="3"')

    def line(x0, x1, v, label, p):
        if p <= 0:
            return ''
        y = ylev(v)
        return (f'<line x1="{x0}" y1="{y:.1f}" x2="{x0 + (x1 - x0) * clamp(p):.1f}" y2="{y:.1f}" stroke="{BONE}" stroke-width="4" stroke-dasharray="12 9"/>'
                + (text(x1 + 16, y + 8, label, 22, 'Plex', BONE, 'start', extra='letter-spacing="2"') if p >= 1 else ''))

    def panel(cx, s, title, sub):
        body = (f'<path d="{tablet(400, 380, 40)}" fill="#0d0c09" transform="translate(8,10)"/>'
                f'<path d="{tablet(400, 380, 40)}" fill="{PANEL}" stroke="{BONE_D}" stroke-width="3"/>')
        return g(cx, 560, s, body) + (f'<g opacity="{clamp(s):.3f}">' + text(cx, 262, title, 54, 'Abril', BONE, 'middle')
                                      + text(cx, 312, sub, 20, 'Plex', BONE_D, 'middle', extra='letter-spacing="2"') + '</g>' if s > 0.6 else '')

    def frame(t):
        tq = step12(t)
        o = ''
        # the treaty: two-thirds of the Senate; the bar fills and stops short
        s1 = qpop(t, T_TREATY - 0.1)
        if s1 > 0:
            o += panel(500, s1, 'A TREATY', 'NEEDED TWO-THIRDS OF THE SENATE')
            if s1 > 0.9:
                f = SUPPORT * ease_out(clamp((tq - T_TWO - 0.1) / 1.1), 2)
                short = tq >= T_TWO + 1.3
                col = TE if not short else BONE_D
                o += bar(440, 150, f, col, 'SENATE')
                o += line(350, 560, 2 / 3, '2/3', (tq - T_TWO) / 0.5)
                if short:                                 # the gap it never closed
                    gp = clamp((tq - T_TWO - 1.3) / 0.4)
                    y0, y1 = ylev(SUPPORT), ylev(2 / 3)
                    o += (f'<path d="M530,{y0:.1f} L545,{y0:.1f} L545,{y1:.1f} L530,{y1:.1f}" fill="none" stroke="{BONE}" stroke-width="3" opacity="{gp:.3f}"/>')
        # the joint resolution: a majority in each house; both bars cross it
        s2 = qpop(t, T_JOINT - 0.1)
        if s2 > 0:
            o += panel(1420, s2, 'A JOINT RESOLUTION', 'NEEDED A MAJORITY IN EACH HOUSE')
            if s2 > 0.9:
                fs = SUPPORT * ease_out(clamp((tq - T_MAJ - 0.1) / 0.9), 2)
                fh = 0.70 * ease_out(clamp((tq - T_MAJ - 0.3) / 0.9), 2)
                o += bar(1260, 140, fs, TE, 'SENATE') + bar(1470, 140, fh, TE, 'HOUSE')
                o += line(1170, 1560, 0.5, 'MAJORITY', (tq - T_MAJ + 0.25) / 0.55)
                for x_, v_, t_ in ((1260, fs, T_MAJ + 0.25), (1470, fh, T_EACH - 0.05)):
                    if v_ > 0.5:                          # a small tick once a bar is over the line
                        y = ylev(v_) - 30
                        o += g(x_, y, qpop(t, t_ + 0.55, 0.4),
                               f'<path d="M-16,0 L-4,12 L18,-14" fill="none" stroke="{TE}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>')
        return {'h': {'ov': o}}
    return S, frame, stem, a, b


def pacific1898():
    stem = 'ch08_under_protest'
    W0 = Words(stem)
    a = W0.at('war with Spain') - 0.1
    b = min(W0.end('looked useful') + 1.15, 79.8)
    Wd = Words(stem, t0=a)
    S = stage('ex_pacific1898', b - a, grain=0.3)
    m = Pac(140, 150, 1640, 796, bbox=(112, -10, 248, 56))
    S.world.append('<g id="camg">' + map_tablet(m, 'pacclip', outline=BONE_D, land=BONE_D, land_d='#8f877a', grat_op=0.06)
                   + f'<rect x="140" y="150" width="1640" height="796" fill="#0d0c09" opacity="0.28" clip-path="url(#pacclip)"/>'
                   + hawaii_rings(m, BONE) + '<g id="ov"></g></g>')
    SF, HNL, MNL = (m.xy(*PLACES[k]) for k in ('San Francisco', 'Honolulu', 'Manila'))
    T_WAR, T_SPAIN, T_SUD = Wd.at('war with Spain') - 0.05, Wd.at('Spain'), Wd.at('suddenly')
    T_BASE, T_MID, T_PAC, T_USE = Wd.at('navy base'), Wd.at('middle'), Wd.at('Pacific'), Wd.at('looked useful')
    ZX, ZY = 700, 560                                 # pushes in toward the middle, keeping Manila's label clear of the edge
    DUR = b - a

    def dots(p0, p1, prog, n):
        o = ''
        for k in range(1, n):
            if k / n > prog:
                break
            x, y = p0[0] + (p1[0] - p0[0]) * k / n, p0[1] + (p1[1] - p0[1]) * k / n
            o += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5.5" fill="{TE}"/>'
        return o

    def city(p, label, s, dx, dy, anchor):
        if s <= 0:
            return ''
        return (g(p[0], p[1], s, f'<circle r="11" fill="{BONE}" stroke="#0d0c09" stroke-width="3"/>')
                + f'<g opacity="{clamp(s):.3f}">' + tag(p[0] + dx, p[1] + dy, label, 21, BONE, anchor) + '</g>')

    def frame(t):
        tq = step12(t)
        z = 1 + 0.06 * ease_io(t / DUR)                   # the camera: a slow push (smooth, not on twos)
        cam = f'translate({ZX},{ZY}) scale({z:.4f}) translate({-ZX},{-ZY})'
        o = ''
        o += dots(SF, HNL, clamp((tq - T_SUD) / 1.3), 22)
        o += dots(HNL, MNL, clamp((tq - T_PAC + 0.25) / 1.2), 40)
        o += city(SF, 'SAN FRANCISCO', qpop(t, T_WAR - 0.3), -20, -26, 'end')
        o += city(MNL, 'MANILA', qpop(t, T_SPAIN), -24, 8, 'end')
        hs = qpop(t, T_MID)
        if hs > 0:
            o += g(HNL[0], HNL[1], hs, f'<circle r="15" fill="{BONE}" stroke="#0d0c09" stroke-width="3"/>')
            if tq >= T_USE:                               # it looks useful: a slow teal ring settles round it
                u = clamp((tq - T_USE) / 0.8)
                o += f'<circle cx="{HNL[0]:.1f}" cy="{HNL[1]:.1f}" r="{90 - 40 * ease_out(u):.1f}" fill="none" stroke="{TE}" stroke-width="6" opacity="{u:.3f}"/>'
            o += f'<g opacity="{clamp(hs):.3f}">' + text(HNL[0], HNL[1] + 112, 'HAWAIʻI', 54, 'Abril', BONE, 'middle') + '</g>'
        return {'t': {'camg': cam}, 'h': {'ov': o}}
    return S, frame, stem, a, b


PIECES = {'coal': coal, 'tariff_1875': tariff_1875, 'tariff_1890': tariff_1890, 'vote': vote, 'pacific1898': pacific1898}


def stills(key, times):
    """render a few frames of one piece to PNG (build/explainer_stills/<key>_<t>.png), without rendering the clip"""
    S, frame, stem, a, b = PIECES[key]()
    d = os.path.join(EP, 'build', 'explainer_stills', key)
    shutil.rmtree(d, ignore_errors=True)
    S.dir = d
    os.makedirs(d, exist_ok=True)
    ts = [float(x) for x in times]
    S.write(frame)                                         # writes base.html and every frame; keep only the chosen ones
    lines = open(os.path.join(d, 'frames.ndjson')).read().splitlines()
    open(os.path.join(d, 'frames.ndjson'), 'w').write('\n'.join(lines[min(len(lines) - 1, int(round(x * FPS)))] for x in ts) + '\n')
    subprocess.run(['node', os.path.join(KIT, 'anim_render.mjs'), d], check=True, capture_output=True)
    outs = []
    for i, x in enumerate(ts):
        p = os.path.join(EP, 'build', 'explainer_stills', f'{key}_{x:05.2f}.png')
        shutil.move(os.path.join(d, 'f', f'{i:04d}.png'), p)
        outs.append(p)
    print('\n'.join(outs))
    print('piece', key, 'is', round(b - a, 2), 's')


if __name__ == '__main__':
    args = sys.argv[1:]
    if args[:1] == ['--stills']:
        stills(args[1], args[2:])
        sys.exit()
    keys = args or list(PIECES)
    clips = []
    for k in keys:
        S, frame, stem, a, b = PIECES[k]()
        S.write(frame)
        clips.append(encode_clip(S.name, stem, a, b, os.path.join(S.dir, 'clip.mp4')))
        print('clip', k, round(b - a, 2), 's', flush=True)
    os.makedirs(OUT, exist_ok=True)
    inp = []
    for c in clips:
        inp += ['-i', c]
    n = len(clips)
    flt = ''.join(f'[{i}:v][{i}:a]' for i in range(n)) + f'concat=n={n}:v=1:a=1[v][a]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inp + ['-filter_complex', flt, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264',
                    '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', os.path.join(OUT, 'explainers.mp4')], check=True)
    print('reel', os.path.join(OUT, 'explainers.mp4'))
