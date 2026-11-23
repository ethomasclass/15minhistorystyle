# Style test: flat vector illustration and type motion for chapter 5 ("The Same Islands"), timed to the real narration.
# Four illustrated badges (one per pitch) pop on and get labels; each pitch then gets its own illustrated item; at the end
# the four badges converge on an illustrated Hawaiian island chain. Motion steps at 12 drawings a second.
#   python3 tools/vec_test.py && node ../../Hawaii_Samples/tools/anim_render.mjs build/vec_ch05 && \
#   python3 ../../Hawaii_Samples/tools/anim_encode.py build/vec_ch05 build/vec_ch05/silent.mp4
import json, math, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.abspath(os.path.join(HERE, '..'))
sys.path.insert(0, os.path.join(EP, '..', '..', 'Hawaii_Samples', 'tools'))
from kit import Stage, clamp, back_out, ease_out, ease, step12, text   # noqa: E402

WORDS = json.load(open(os.path.join(EP, 'public', 'audio', 'ch05_the_same_islands.words.json')))['words']


def at(word, k=1):
    n = 0
    for w in WORDS:
        if w['w'].strip('?."“”').lower().startswith(word.lower()):
            n += 1
            if n == k:
                return w['s']
    raise KeyError(word)


DUR = WORDS[-1]['e'] + 3.0
S = Stage('vec_ch05', DUR, bg='#1f2f38', press=False, grain=0.35)
S.dir = os.path.join(EP, 'build', 'vec_ch05')
os.makedirs(S.dir, exist_ok=True)

# ---- palette: the channel's colours as flat fills, each with a darker shade for the turned side
BG, BG2 = '#1f2f38', '#25404b'
CREAM, INK = '#f4efe6', '#16181a'
OR, OR_D = '#FF9F1C', '#d47f0c'
TE, TE_D = '#2FE0C4', '#1fae98'
CO, CO_D = '#FF6F61', '#d4514a'
SAND, SAND_D, SAND_T = '#e9d6a8', '#c8b07c', '#7a5c33'
SEA, SEA_D, LAND, LAND_D = '#2e7d8f', '#245f6d', '#86ab5d', '#6a8d46'
NAVY = '#24345e'

S.defs.append('<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>')
S.world.append(f'<rect width="1920" height="1080" fill="{BG}"/><circle cx="960" cy="560" r="620" fill="{BG2}"/>'
               f'<circle cx="960" cy="560" r="430" fill="{BG}" opacity="0.35"/>')
S.over.append('<g id="ov"></g>')


def pop(t, t0, d=0.34):
    """scale for a pop-on (stepped at 12 fps), 0 before t0"""
    return back_out((step12(t) - t0) / d) if t >= t0 else 0.0


def g(x, y, s, body, rot=0.0, op=1.0):
    if s <= 0.001 or op <= 0.001:
        return ''
    return f'<g transform="translate({x:.1f},{y:.1f}) rotate({rot:.2f}) scale({s:.4f})" opacity="{op:.3f}">{body}</g>'


def shadow(w, dy):
    return f'<ellipse cx="0" cy="{dy}" rx="{w}" ry="{w * 0.16:.1f}" fill="#000" opacity="0.28" filter="url(#soft)"/>'


# ---------------------------------------------------------------- icons (drawn around 0,0, about 200 px across)
def badge(fill, shade, icon):
    return (f'<circle r="130" fill="{shade}"/><circle r="130" fill="{fill}" clip-path="inset(0 0 0 0)"/>'
            f'<path d="M-130,0 A130,130 0 0,0 130,0 A130,95 0 0,1 -130,0 z" fill="{shade}" opacity="0.55"/>'
            f'<circle r="112" fill="none" stroke="{CREAM}" stroke-width="5" opacity="0.5"/>{icon}')


def coins():
    o = ''
    for k, y in enumerate((40, 5, -30)):
        o += (f'<rect x="-58" y="{y - 2}" width="116" height="26" fill="{OR_D}"/><ellipse cy="{y + 24}" rx="58" ry="18" fill="{OR_D}"/>'
              f'<ellipse cy="{y}" rx="58" ry="18" fill="#ffd27a"/><ellipse cy="{y}" rx="40" ry="11" fill="none" stroke="{OR_D}" stroke-width="4"/>')
    return o + f'<text x="0" y="-22" font-family="\'Inter8\'" font-size="34" fill="{OR_D}" text-anchor="middle">$</text>'


def anchor(c=INK):
    return (f'<g fill="none" stroke="{c}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round">'
            f'<circle cx="0" cy="-62" r="17"/><path d="M0,-45 V62"/><path d="M-36,-22 H36"/>'
            f'<path d="M-62,18 Q-55,66 0,66 Q55,66 62,18"/><path d="M-74,28 L-62,16 L-50,30"/><path d="M74,28 L62,16 L50,30"/></g>')


def bible():
    return (f'<rect x="-52" y="-66" width="104" height="132" rx="8" fill="{INK}"/><rect x="-52" y="-66" width="18" height="132" fill="#2c2f33"/>'
            f'<rect x="-6" y="-40" width="14" height="70" fill="{CREAM}"/><rect x="-26" y="-22" width="54" height="13" fill="{CREAM}"/>'
            f'<rect x="44" y="-60" width="10" height="120" fill="#e9e2d2"/>')


def microscope(c=INK, k=1.0):
    return (f'<g transform="scale({k})" fill="{c}"><rect x="-64" y="58" width="128" height="16" rx="6"/>'
            f'<path d="M-10,58 Q-40,20 -6,-6 L8,6 Q-16,26 12,58 z"/>'
            f'<rect x="-6" y="-80" width="30" height="78" rx="6" transform="rotate(-24 9 -41)"/>'
            f'<rect x="-34" y="18" width="62" height="10" rx="3"/><circle cx="26" cy="-60" r="9" fill="{CREAM}" opacity="0.6"/></g>')


ICONS = [(OR, OR_D, coins(), 'MARKETS'), (TE, TE_D, anchor(), 'A NAVY BASE'), (CO, CO_D, bible(), 'MISSIONARIES'),
         (CREAM, '#cfc6b4', microscope(), '"SCIENCE"')]


# ---------------------------------------------------------------- the big items
def sack():
    return (shadow(170, 190) +
            f'<path d="M-150,170 Q-175,40 -120,-60 Q-95,-110 -60,-118 L60,-118 Q95,-110 120,-60 Q175,40 150,170 Q0,200 -150,170 z" fill="{SAND}"/>'
            f'<path d="M30,-118 L60,-118 Q95,-110 120,-60 Q175,40 150,170 Q90,186 40,190 Q110,60 30,-118 z" fill="{SAND_D}"/>'
            f'<path d="M-60,-118 Q-30,-150 0,-128 Q30,-150 60,-118 Q0,-104 -60,-118 z" fill="{SAND_D}"/>'
            f'<rect x="-64" y="-126" width="128" height="18" rx="7" fill="{SAND_T}"/>'
            f'<text x="-8" y="40" font-family="\'Inter8\'" font-size="64" fill="{SAND_T}" text-anchor="middle" letter-spacing="4">SUGAR</text>'
            f'<text x="-8" y="96" font-family="\'Inter8\'" font-size="30" fill="{SAND_T}" text-anchor="middle" letter-spacing="6" opacity="0.8">HAWAIʻI</text>'
            + ''.join(f'<circle cx="{x}" cy="{y}" r="5" fill="{CREAM}"/>' for x, y in ((150, 184), (172, 190), (190, 186), (165, 194), (205, 192))))


def flag():
    o = shadow(150, 150)
    for i in range(13):
        o += f'<rect x="-150" y="{-100 + i * 200 / 13:.1f}" width="300" height="{200 / 13 + 0.6:.1f}" fill="{CO if i % 2 == 0 else CREAM}"/>'
    o += f'<rect x="-150" y="-100" width="125" height="{200 * 7 / 13:.1f}" fill="{NAVY}"/>'
    for r, n in enumerate((8, 7, 7, 7, 7, 8)):                # the 44-star flag of 1891
        for c in range(n):
            o += f'<circle cx="{-140 + (c + (0.5 if n == 7 else 0)) * 14.6:.1f}" cy="{-91 + r * 15.4:.1f}" r="3.0" fill="{CREAM}"/>'

    o += f'<rect x="-158" y="-104" width="8" height="270" rx="3" fill="{INK}"/>'
    o += f'<path d="M-150,-100 L150,-100 L150,100 L-150,100 z" fill="#000" opacity="0.08"/>'
    return o


# approximate coastline points (longitude, latitude) for the main islands; enough for a flat illustration
COAST = {
    'Niihau': [(-160.25, 21.97), (-160.07, 22.02), (-160.05, 21.85), (-160.24, 21.78)],
    'Kauai': [(-159.78, 22.15), (-159.55, 22.23), (-159.33, 22.13), (-159.30, 21.95), (-159.45, 21.87), (-159.68, 21.95), (-159.79, 22.03)],
    'Oahu': [(-158.28, 21.58), (-158.10, 21.70), (-157.98, 21.71), (-157.82, 21.55), (-157.70, 21.44), (-157.65, 21.31),
             (-157.81, 21.25), (-157.95, 21.33), (-158.11, 21.30), (-158.23, 21.42)],
    'Molokai': [(-157.31, 21.15), (-157.02, 21.20), (-156.71, 21.16), (-156.73, 21.08), (-157.05, 21.06), (-157.29, 21.10)],
    'Lanai': [(-157.06, 20.86), (-156.92, 20.92), (-156.80, 20.82), (-156.91, 20.73), (-157.04, 20.77)],
    'Maui': [(-156.68, 20.92), (-156.56, 21.03), (-156.47, 20.90), (-156.34, 20.94), (-156.12, 20.92), (-155.98, 20.73),
             (-156.12, 20.62), (-156.38, 20.58), (-156.44, 20.78), (-156.57, 20.80), (-156.69, 20.87)],
    'Kahoolawe': [(-156.70, 20.56), (-156.56, 20.60), (-156.53, 20.53), (-156.65, 20.50)],
    'Hawaii': [(-155.87, 20.27), (-155.55, 20.13), (-155.08, 19.86), (-154.81, 19.52), (-155.25, 19.27), (-155.68, 18.91),
               (-155.90, 19.08), (-155.96, 19.57), (-156.06, 19.73), (-155.83, 20.03)],
}
KLAT = math.cos(math.radians(20.8))


def isle_path(name, cx, cy, k, lon0=-157.6, lat0=20.6):
    pts = [(cx + (lo - lon0) * KLAT * k, cy - (la - lat0) * k) for lo, la in COAST[name]]
    d = 'M' + ' Q'.join(f'{(pts[i][0] + pts[i - 1][0]) / 2:.1f},{(pts[i][1] + pts[i - 1][1]) / 2:.1f} {pts[i][0]:.1f},{pts[i][1]:.1f}'
                        for i in range(len(pts)))
    return d + ' z'


def harbor():
    """O\u02bbahu on the sea, with Pearl Harbor marked"""
    k, lon0, lat0 = 520, -157.97, 21.48
    land = isle_path('Oahu', 0, 0, k, lon0, lat0)
    px, py = (-157.97 - lon0) * KLAT * k, -(21.37 - lat0) * k
    return (f'<circle r="215" fill="{SEA_D}"/><circle r="200" fill="{SEA}"/>'
            f'<path d="{land}" fill="{LAND_D}" transform="translate(5,7)"/><path d="{land}" fill="{LAND}"/>'
            f'<circle cx="{px:.1f}" cy="{py:.1f}" r="15" fill="{SEA}" stroke="{CREAM}" stroke-width="5"/>'
            f'<circle r="200" fill="none" stroke="{CREAM}" stroke-width="10"/>'), (px, py)


def steamer(c=INK):
    return (f'<path d="M-60,0 L60,0 L48,22 L-52,22 z" fill="{c}"/><rect x="-34" y="-20" width="60" height="20" fill="{CREAM}"/>'
            f'<rect x="-8" y="-46" width="16" height="28" fill="{CO}"/>')


def church():
    return (shadow(170, 170) +
            f'<rect x="-150" y="0" width="230" height="170" fill="{CREAM}"/><rect x="40" y="0" width="40" height="170" fill="#d9d0bd"/>'
            f'<path d="M-170,4 L-35,-90 L100,4 z" fill="{CO_D}"/><path d="M-35,-90 L100,4 L60,4 z" fill="#b8443e"/>'
            f'<rect x="80" y="-70" width="80" height="240" fill="{CREAM}"/><rect x="132" y="-70" width="28" height="240" fill="#d9d0bd"/>'
            f'<path d="M72,-70 L120,-190 L168,-70 z" fill="{CO_D}"/><path d="M120,-190 L168,-70 L140,-70 z" fill="#b8443e"/>'
            f'<rect x="104" y="-40" width="32" height="44" rx="16" fill="{INK}"/>'
            f'<rect x="-60" y="70" width="56" height="100" rx="26" fill="{SAND_T}"/>'
            + ''.join(f'<rect x="{x}" y="40" width="34" height="56" rx="16" fill="{SEA_D}"/>' for x in (-130, 10)))


def person(h, coat, hair, k):
    """a simple flat figure, h tall, feet at y=0"""
    hr = h * 0.13
    return (f'<rect x="{-h * 0.2:.1f}" y="{-h * 0.72:.1f}" width="{h * 0.4:.1f}" height="{h * 0.72:.1f}" rx="{h * 0.12:.1f}" fill="{coat}"/>'
            f'<rect x="{h * 0.02:.1f}" y="{-h * 0.72:.1f}" width="{h * 0.18:.1f}" height="{h * 0.72:.1f}" rx="{h * 0.08:.1f}" fill="#000" opacity="0.18"/>'
            f'<circle cy="{-h * 0.72 - hr * 1.15:.1f}" r="{hr:.1f}" fill="#e6c3a1"/>'
            f'<path d="M{-hr:.1f},{-h * 0.72 - hr * 1.2:.1f} A{hr:.1f},{hr:.1f} 0 0,1 {hr:.1f},{-h * 0.72 - hr * 1.2:.1f} z" fill="{hair}"/>')


def certificate():
    lines = ''.join(f'<rect x="-120" y="{-60 + i * 30}" width="{240 - (i % 2) * 70}" height="9" rx="4" fill="#cfc6b4"/>' for i in range(5))
    return (shadow(170, 175) + f'<rect x="-170" y="-170" width="340" height="340" fill="{CREAM}"/>'
            f'<rect x="-150" y="-150" width="300" height="300" fill="none" stroke="#cfc6b4" stroke-width="6"/>'
            f'<text x="0" y="-100" font-family="\'Playfair\'" font-size="40" fill="{INK}" text-anchor="middle">Certificate</text>' + lines)


def stamp():
    return (f'<g transform="rotate(-12)"><rect x="-150" y="-46" width="300" height="92" rx="10" fill="none" stroke="{CO}" stroke-width="10"/>'
            f'<text x="0" y="22" font-family="\'Inter8\'" font-size="62" fill="{CO}" text-anchor="middle" letter-spacing="6">APPROVED</text></g>')


def islands(p=1.0):
    o = (f'<rect x="-430" y="-240" width="860" height="480" rx="40" fill="{SEA}"/>'
         f'<rect x="-430" y="-240" width="860" height="480" rx="40" fill="none" stroke="{CREAM}" stroke-width="8"/>')
    names = list(COAST)
    for i, n in enumerate(names):
        s_ = back_out((p * len(names) - i) / 1.6) if p * len(names) > i else 0
        if s_ > 0:
            d = isle_path(n, 0, 0, 138, -157.53, 20.57)
            o += (f'<g transform="scale({s_:.3f})"><path d="{d}" fill="{LAND_D}" transform="translate(4,6)"/>'
                  f'<path d="{d}" fill="{LAND}"/></g>')
    return o


OAHU = ((-157.97 + 157.53) * KLAT * 138, -(21.40 - 20.57) * 138)       # Pearl Harbor on the island card


# ---------------------------------------------------------------- timing
T4, T_DIFF = at('Four'), at('different')
T_MKT, T_SUGAR, T_AMER = at('Markets'), at('sugar'), at('America')
T_NAVY, T_HARB = at('navy'), at('harbor')
T_MISS, T_THREE = at('Missionaries'), at('Three')
T_SCI, T_RIGHT, T_RIGHT_E = at('science'), at('right'), WORDS[-1]['e']
T_END = T_RIGHT_E + 0.35
TOPICS = [(T_MKT, T_NAVY), (T_NAVY, T_MISS), (T_MISS, T_SCI), (T_SCI, T_END)]
ROW_X = [420, 780, 1140, 1500]
TOP_X = [960 - 330 + i * 220 for i in range(4)]


def frame(t):
    tq = step12(t)
    o, lines = '', []
    if t >= T_END:
        o += g(960, 600, pop(t, T_END + 0.1, 0.4), islands(clamp((tq - T_END - 0.1) / 0.9)))
    badges = ''
    # the four badges: big row, then a small strip across the top, then they converge on the islands
    shrink = ease_out((tq - (T_MKT - 0.3)) / 0.35)
    conv = ease((tq - T_END) / 0.7)
    for i, (fill, shade, icon, label) in enumerate(ICONS):
        s0 = pop(t, T4 + i * 0.14)
        x = ROW_X[i] + (TOP_X[i] - ROW_X[i]) * shrink
        y = 470 + (150 - 470) * shrink
        s = s0 * (1 - 0.58 * shrink)
        active = next((k for k, (a, b) in enumerate(TOPICS) if a <= t < b), None)
        op = 1.0 if shrink < 1 or active is None or active == i else 0.35
        if conv > 0:
            ex, ey = ((560, 300), (1360, 300), (560, 900), (1360, 900))[i]
            x, y = x + (ex - x) * conv, y + (ey - y) * conv
            s = s0 * (0.42 + 0.18 * conv)
            op = 1.0
            lp = clamp((tq - T_END - 0.75) / 0.4)
            if lp > 0:
                tx, ty = 960 + OAHU[0], 600 + OAHU[1]
                lines.append(f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x + (tx - x) * lp:.0f}" y2="{y + (ty - y) * lp:.0f}" stroke="{fill}" '
                             f'stroke-width="7" stroke-dasharray="16 12" stroke-linecap="round"/>')
        badges += g(x, y, s, badge(fill, shade, icon), op=op)
        if t >= T_DIFF + i * 0.16 and shrink < 1:
            n = int(clamp((tq - T_DIFF - i * 0.16) / 0.5) * len(label) + 0.999)
            o += f'<g opacity="{1 - shrink:.3f}">' + text(ROW_X[i], 690, label[:n], 40, 'Inter8', CREAM, 'middle', extra='letter-spacing="3"') + '</g>'
    # the item for each pitch (pops on its word, shrinks away when the next pitch starts)
    def out(t1):
        return 1 - ease((tq - t1) / 0.2) if tq >= t1 else 1.0
    if T_SUGAR - 0.05 <= t < T_NAVY + 0.25:
        k = out(T_NAVY)
        o += g(760, 620, pop(t, T_SUGAR) * k, sack())
        p = clamp((tq - (T_AMER - 0.6)) / 0.6)
        if p > 0:
            o += f'<path d="M930,600 Q1060,520 1180,600" fill="none" stroke="{CREAM}" stroke-width="12" stroke-linecap="round" stroke-dasharray="{300 * p:.0f} 400" opacity="{k:.3f}"/>'
            if p >= 1:
                o += f'<path d="M1150,575 L1188,605 L1146,628" fill="none" stroke="{CREAM}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="{k:.3f}"/>'
        o += g(1380, 600, pop(t, T_AMER) * k, flag())
    if T_NAVY - 0.05 <= t < T_MISS + 0.25:
        k = out(T_MISS)
        hb, (hx, hy) = harbor()
        o += g(960, 610, pop(t, T_HARB - 0.25) * k, hb)
        sp = clamp((tq - T_HARB) / 1.2)
        if T_HARB <= t:
            o += g(960 + hx + 230 * (1 - ease_out(sp)), 610 + hy + 60 * (1 - ease_out(sp)), 0.45 * k, steamer(INK))
        if t >= T_HARB + 0.2:
            o += f'<g opacity="{k:.3f}">' + text(960, 870, 'PEARL HARBOR', 38, 'Inter8', CREAM, 'middle', extra='letter-spacing="4"') + '</g>'
    if T_MISS - 0.05 <= t < T_SCI + 0.25:
        k = out(T_SCI)
        o += g(680, 640, pop(t, T_MISS) * k, church())
        for j, (h, coat, hair) in enumerate(((230, NAVY, '#c9c4bb'), (205, TE_D, '#3a2a20'), (165, OR_D, '#3a2a20'))):
            o += g(1080 + j * 150, 810, pop(t, T_THREE + j * 0.25) * k, person(h, coat, hair, j))
    if T_SCI - 0.05 <= t < T_END + 0.2:
        k = out(T_END)
        o += g(700, 640, pop(t, T_SCI) * k, shadow(150, 92) + f'<circle r="0"/>' + microscope(INK, 1.9))
        o += g(1240, 620, pop(t, at('told')) * k, certificate())
        if t >= T_RIGHT:
            sl = clamp((tq - T_RIGHT) / 0.17)
            o += g(1240, 640, (2.2 - 1.2 * sl) * k, stamp(), op=sl)
    o += ''.join(lines) + badges
    if t >= T_END + 1.2:
        o += text(960, 1000, 'THE SAME ISLANDS', 44, 'Inter8', CREAM, 'middle', extra='letter-spacing="6"')
    return {'h': {'ov': o}}


if __name__ == '__main__':
    S.write(frame)
