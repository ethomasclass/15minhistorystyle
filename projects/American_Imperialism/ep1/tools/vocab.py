# The Ep 1 vocabulary cards, one spec per term (CARDS below), all in the look of the COUP card (kit_reel.seg_c):
#   a small flat vignette acts the word out on the spoken words, the definition builds word by word in cream on the
#   desk on the narrator's own timing (Hawaiʻi in coral, the U.S. in teal), then the term wipes on on the orange strip
#   with how to say it in teal Plex beside it.
#   python3 tools/vocab.py [key ...]            renders each card, then renders/tests/vocab_cards.mp4
#   python3 tools/vocab.py --still key t ...    writes frames only and renders the stills at t (s into the card)
# Hawaiʻi is drawn from Natural Earth 1:10m land (public domain), cut once to build/geo/hawaii_10m.json.
import json, math, os, shutil, subprocess, sys
from xml.sax.saxutils import escape
from PIL import ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vkit import *   # noqa: F401,F403
from vkit import EP, KIT, _norm

FONTS = os.path.join(KIT, '..', 'fonts')
F_INTER = os.path.join(FONTS, 'Inter-800-full.ttf')
F_ABRIL = os.path.join(FONTS, 'AbrilFatface-full.ttf')
OUT = os.path.join(EP, 'renders', 'tests')
GEO = os.path.join(EP, 'build', 'geo')
NE_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
TEAL_INK = '#138c79'
SAFE_X0, SAFE_X1, SAFE_Y0, SAFE_Y1 = 96, 1824, 54, 1026          # text stays inside the outer 5%


# ================================================================ geometry
def ne(name):
    """a Natural Earth geojson (public domain), fetched once into build/geo"""
    p = os.path.join(GEO, name + '.geojson')
    if not os.path.exists(p):
        os.makedirs(GEO, exist_ok=True)
        subprocess.run(['curl', '-sS', '-L', '-o', p, NE_URL + name + '.geojson'], check=True)
    return json.load(open(p))


def rings(feats):
    for f in feats:
        gm = f['geometry']
        for poly in (gm['coordinates'] if gm['type'] == 'MultiPolygon' else [gm['coordinates']]):
            yield poly[0]


def hawaii():
    """the eight main islands, outer rings (lon, lat), from Natural Earth 1:10m land"""
    p = os.path.join(GEO, 'hawaii_10m.json')
    if not os.path.exists(p):
        rs = [r for r in rings(ne('ne_10m_land')['features']) if all(-160.6 < x < -154.5 and 18.8 < y < 22.4 for x, y in r)]
        json.dump([[[round(x, 4), round(y, 4)] for x, y in r] for r in rs if len(r) >= 8], open(p, 'w'))
    return json.load(open(p))


def islands_svg(w, fill=CO, shade=CO_D, stroke=None, sw=3, frac=None):
    """the islands centred on 0,0, w px wide (local equirectangular, cos-lat corrected); frac clips the fill to a
    left-to-right sweep (for the annexation recolour)"""
    lon0, lon1, lat0, lat1 = -160.3, -154.75, 18.85, 22.3
    k = w / ((lon1 - lon0) * math.cos(math.radians(20.6)))
    h = (lat1 - lat0) * k

    def xy(x, y):
        return ((x - lon0) * math.cos(math.radians(20.6)) * k - w / 2, (lat1 - y) * k - h / 2)
    d = ''.join('M' + ' L'.join('%.1f,%.1f' % xy(x, y) for x, y in r) + 'z' for r in hawaii())
    st = f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ''
    o = f'<path d="{d}" fill="{shade}" transform="translate(5,7)"/>' if shade else ''
    o += f'<path d="{d}" fill="{fill}"{st}/>'
    return o, d


# ================================================================ type
_fc = {}


def font(path, size):
    k = (path, size)
    if k not in _fc:
        _fc[k] = ImageFont.truetype(path, size)
    return _fc[k]


def strip(x, y, word, size, prog=1.0, rot=-2.0):
    """the channel's Highlight (kit.highlight), with the strip measured from the real Abril widths so long words fit"""
    wch = font(F_ABRIL, size).getlength(word) + size * 0.5
    hh = size * 1.18
    p = clamp(prog)
    cid = f'st{int(x)}{int(y)}'
    return (f'<g transform="rotate({rot} {x:.1f} {y:.1f})"><clipPath id="{cid}"><rect x="{x - 10:.1f}" y="{y - hh:.1f}" '
            f'width="{(wch + 20) * p:.1f}" height="{hh * 1.4:.1f}"/></clipPath><g clip-path="url(#{cid})">'
            f'<rect x="{x:.1f}" y="{y - hh * 0.86:.1f}" width="{wch:.1f}" height="{hh:.1f}" fill="{OR}" filter="url(#tear)"/>'
            + text(x + size * 0.25, y, word, size, 'Abril', INK) + '</g></g>')


def term_layout(term, pron):
    """strip size and the x of the strip and of the pronunciation, centred as a pair inside the safe area"""
    for s in range(120, 60, -4):
        ps = max(34, min(52, round(s * 0.44)))
        sw = font(F_ABRIL, s).getlength(term) + s * 0.5
        pw = 0.6 * ps * len(pron)
        tot = sw + 34 + pw
        if tot <= 1560:
            x0 = 960 - tot / 2
            return s, ps, x0, x0 + sw + 34, sw
    raise ValueError(term)


def def_layout(words):
    """size and lines for the definition (real Inter 800 widths): one line if it fits, else two balanced lines"""
    for size in (58, 54, 50, 46):
        f = font(F_INTER, size)
        full = f.getlength(' '.join(words))
        if full <= 1520:
            return size, [list(range(len(words)))]
        best = None
        for k in range(1, len(words)):
            a, b = f.getlength(' '.join(words[:k])), f.getlength(' '.join(words[k:]))
            if max(a, b) <= 1520 and (best is None or max(a, b) < best[0]):
                best = (max(a, b), k)
        if best:
            return size, [list(range(best[1])), list(range(best[1], len(words)))]
    raise ValueError(words)


# ================================================================ the vignettes (each draws around 960, 400; y 130..650)
def plat(cx, cy, w, d, h, top, side, front=None):
    """an oblique slab (a country, a plot of ground): top face w x d (d drawn up and to the right), h thick"""
    ox, oy = d * 0.55, -d * 0.45
    x0, x1 = cx - w / 2, cx + w / 2
    front = front or side
    return (f'<ellipse cx="{cx + ox / 2:.1f}" cy="{cy + h + 14:.1f}" rx="{w * 0.62:.1f}" ry="{w * 0.07:.1f}" fill="#000" opacity="0.3" filter="url(#soft)"/>'
            f'<path d="M{x1},{cy} L{x1 + ox},{cy + oy} L{x1 + ox},{cy + oy + h} L{x1},{cy + h} z" fill="{side}"/>'
            f'<rect x="{x0}" y="{cy}" width="{w}" height="{h}" fill="{front}"/>'
            f'<path d="M{x0},{cy} L{x0 + ox},{cy + oy} L{x1 + ox},{cy + oy} L{x1},{cy} z" fill="{top}"/>')


def picket(x, y, h, c=TE):
    return (f'<path d="M{x - 6:.1f},{y:.1f} L{x - 6:.1f},{y - h + 8:.1f} L{x:.1f},{y - h:.1f} L{x + 6:.1f},{y - h + 8:.1f} L{x + 6:.1f},{y:.1f} z" '
            f'fill="{c}" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>')


def sack(label='SUGAR', fill=BONE, shade=BONE_D):
    """a sugar sack, bottom centre at 0,0"""
    return (shadow(70, 2)
            + f'<path d="M-62,0 C-74,-40 -70,-92 -48,-118 L-30,-132 L30,-132 L48,-118 C70,-92 74,-40 62,0 z" fill="{fill}"/>'
            + f'<path d="M20,-132 L30,-132 L48,-118 C70,-92 74,-40 62,0 L26,0 C40,-40 44,-90 20,-132 z" fill="{shade}" opacity="0.7"/>'
            + f'<path d="M-30,-132 L-38,-150 L-14,-142 L0,-156 L14,-142 L38,-150 L30,-132 z" fill="{shade}"/>'
            + f'<rect x="-34" y="-136" width="68" height="9" rx="4" fill="{INK}" opacity="0.55"/>'
            + text(0, -50, label, 22, 'Inter8', INK, 'middle', extra='letter-spacing="1"'))


def coin(r=22):
    return (f'<circle r="{r}" fill="{OR_D}"/><circle r="{r * 0.78:.1f}" fill="{OR}"/>'
            + text(0, r * 0.36, '$', r * 1.05, 'Inter8', OR_D, 'middle'))


def icon_tariff(t, tq, C):
    t_sug, t_us, t_from = C.at('Sugar'), C.at('United States'), C.at('from another')
    t_paid, t_tax, t_bord, t_call = C.at('paid'), C.at('tax'), C.at('border'), C.at('called a')
    GX, GY = 1010, 590
    o = ''
    # the road, the U.S. side tinted teal, the border line
    if t >= t_sug:
        o += f'<rect x="440" y="{GY}" width="1040" height="14" rx="7" fill="{BONE_D}" opacity="0.35"/>'
    if t >= t_us:
        u = ease_out((tq - t_us) / 0.35)
        o += f'<rect x="{GX}" y="{GY}" width="{470 * u:.1f}" height="14" fill="{TE}"/>'
        o += f'<line x1="{GX}" y1="{GY + 40}" x2="{GX}" y2="{GY + 40 - 330 * u:.1f}" stroke="{CREAM}" stroke-width="4" stroke-dasharray="14 12"/>'
        if u >= 1:
            o += text(GX + 235, GY + 62, 'UNITED STATES', 24, 'Plex', TE, 'middle', extra='letter-spacing="2"')
    # the booth on the U.S. side, the barrier arm
    s = pop(t, t_us, 0.34)
    if s > 0:
        booth = (shadow(90, 2)
                 + f'<rect x="-70" y="-180" width="140" height="180" fill="{TE}"/><rect x="30" y="-180" width="40" height="180" fill="{TE_D}"/>'
                 + f'<path d="M-92,-176 L92,-176 L80,-206 L-80,-206 z" fill="{TE_D}"/>'
                 + f'<rect x="-46" y="-146" width="70" height="52" fill="{CREAM}"/><rect x="-46" y="-104" width="70" height="10" fill="{INK}" opacity="0.25"/>')
        if t_tax + 0.45 <= t < t_tax + 0.8:                          # the window lights as the coin goes in
            booth += f'<rect x="-46" y="-146" width="70" height="52" fill="{OR}" opacity="0.55"/>'
        o += g(GX + 110, GY, s, booth)
        ang = 72 * ease_out((tq - t_bord) / 0.4) if t >= t_bord else 0.0
        arm = (f'<g transform="rotate({ang:.1f})"><rect x="-300" y="-9" width="300" height="18" rx="9" fill="{CREAM}"/>'
               + ''.join(f'<rect x="{-288 + i * 56}" y="-9" width="26" height="18" fill="{INK}"/>' for i in range(5)) + '</g>')
        o += g(GX - 8, GY - 92, s, f'<rect x="-10" y="-14" width="20" height="106" fill="{BONE_D}"/>' + arm + f'<circle r="13" fill="{INK}"/><circle r="5" fill="{CREAM}"/>')
    # the sack: arrives from abroad, waits at the arm, pays, walks through
    if t >= t_sug:
        u1 = ease_io((tq - t_from) / 0.85) if t >= t_from else 0.0
        u2 = ease_io((tq - t_call) / 0.6) if t >= t_call else 0.0
        sx = 520 + (GX - 150 - 520) * u1 + 440 * u2
        hop = -14 * abs(math.sin(tq * 9.5)) if (0 < u1 < 1 or 0 < u2 < 1) else 0
        sk = g(sx, GY + hop, pop(t, t_sug, 0.34), sack())
        o = sk + o if u2 <= 0.25 else o + sk                  # behind the arm while it waits, in front once through
        # the coin: pops over the sack on "paid", flies into the booth window on "tax"
        if t >= t_paid and t < t_tax + 0.5:
            cx0, cy0 = GX - 150, GY - 196
            cx1, cy1 = GX + 99, GY - 120
            v = ease_io((tq - t_tax) / 0.45) if t >= t_tax else 0.0
            cx, cy = cx0 + (cx1 - cx0) * v, cy0 + (cy1 - cy0) * v - 90 * math.sin(math.pi * v)
            o += g(cx, cy, pop(t, t_paid, 0.3) * (1 - 0.6 * v), coin(24))
    return o


def icon_coup(t, tq, C):
    from kit_reel import building, rifle
    tw = C.tw
    t_grp, t_take, t_force = tw[1], tw[3], tw[6]
    o = ''
    down = 1 - ease((tq - t_force) / 0.35)
    up2 = ease((tq - t_force - 0.4) / 0.45)
    o += g(1130, 600, pop(t, tw[5] - 0.1), building(down if t >= t_force else 1.0, up2 if t >= t_force + 0.4 else 0))
    walk = ease_io((t - t_take) / 1.0)
    for j, (h, coat, hat) in enumerate(((200, BONE_D, INK), (186, TE_D, INK), (194, '#8a8378', INK), (178, BONE, INK))):
        fx = 560 + j * 70 + 110 * walk
        fig = figure(h, coat, hat=hat) + (g(h * 0.16, -h * 0.35, 1.0, rifle()) if t >= t_force else '')
        o += g(fx, 600 + (j % 2) * 18, pop(t, t_grp + j * 0.08), fig)
    return o


def icon_intervention(t, tq, C):
    t_step, t_aff, t_prot, t_int = C.at('Stepping'), C.at('affairs'), C.at('to protect'), C.at('own interests')
    Y = 500
    o = ''
    s0 = pop(t, 0.05, 0.34)
    # two plots of ground and the border between them: yours (teal), another country's (bone)
    o += g(700, Y, s0, plat(0, 0, 400, 90, 34, TE, TE_D, '#1a9481'), op=1.0)
    o += g(1240, Y, s0, plat(0, 0, 440, 90, 34, BONE, BONE_D, '#bdb3a0'))
    o += g(0, 0, 1.0 if s0 >= 1 else 0, f'<line x1="969" y1="{Y + 60}" x2="969" y2="{Y - 160}" stroke="{CREAM}" stroke-width="4" stroke-dasharray="14 12"/>')
    # their house and their own person; your crate on their ground (a teal band: it is yours)
    house = (f'<rect x="-70" y="-110" width="140" height="110" fill="{BONE}"/><rect x="20" y="-110" width="50" height="110" fill="{BONE_D}"/>'
             f'<path d="M-90,-106 L0,-168 L90,-106 z" fill="#8a8378"/><rect x="-22" y="-60" width="34" height="60" fill="{INK}"/>')
    o += g(1280, Y + 14, pop(t, 0.15, 0.34), house)
    step_back = 22 * ease_out((tq - t_aff) / 0.3) if t >= t_aff else 0
    o += g(1135 + step_back, Y + 22, pop(t, 0.2, 0.34), figure(150, '#8a8378', hat=INK))
    crate = (shadow(52, 2) + f'<rect x="-48" y="-80" width="96" height="80" fill="#a89f8e"/><rect x="18" y="-80" width="30" height="80" fill="#8a8378"/>'
             f'<path d="M-48,-80 L48,0 M48,-80 L-48,0" stroke="#7a7266" stroke-width="5"/>'
             f'<rect x="-48" y="-50" width="96" height="16" fill="{TE}"/>')
    o += g(1400, Y + 40, pop(t, 0.25, 0.34), crate)
    # you step over the line into their affairs
    hops = [(0.0, 790), (0.28, 880), (0.56, 1000), (0.84, 1060)]
    fx = 790
    for dt, x in hops:
        if t >= t_step + dt:
            fx = x
    hop = -18 if any(t_step + dt <= t < t_step + dt + 0.12 for dt, _ in hops[1:]) else 0
    o += g(fx, Y + 30 + hop, pop(t, 0.3, 0.34), figure(170, TE, hat=INK))
    # to protect your own interests: a teal ring around the crate
    if t >= t_prot:
        pr = clamp(step12(t - t_prot) / 0.6)
        o += (f'<circle cx="1400" cy="{Y}" r="88" fill="none" stroke="{TE}" stroke-width="8" stroke-dasharray="{553 * pr:.1f} 700" '
              f'transform="rotate(-90 1400 {Y})" stroke-linecap="round"/>')
    if t >= t_int:
        o += g(1400, Y - 114, pop(t, t_int, 0.3), f'<circle r="15" fill="{TE}" stroke="{INK}" stroke-width="3"/><path d="M-6,0 L-1,6 L8,-6" stroke="{INK}" stroke-width="4" fill="none" stroke-linecap="round"/>')
    return o


def dome(w, h):
    return (f'<path d="M{-w},0 A{w},{h} 0 0,1 {w},0 z" fill="{TE}" opacity="0.14"/>'
            f'<path d="M{-w},0 A{w},{h} 0 0,1 {w},0" fill="none" stroke="{TE}" stroke-width="9" stroke-linecap="round"/>'
            f'<path d="M{-w * 0.62:.1f},{-h * 0.62:.1f} A{w * 0.8:.1f},{h * 0.8:.1f} 0 0,1 {-w * 0.1:.1f},{-h * 0.96:.1f}" fill="none" stroke="{CREAM}" stroke-width="5" opacity="0.6" stroke-linecap="round"/>')


def flag_teal(s=1.0):
    return (f'<rect x="-3" y="-90" width="6" height="90" fill="{CREAM}"/><rect x="3" y="-90" width="62" height="40" fill="{TE}" stroke="{INK}" stroke-width="2.5"/>'
            + ''.join(f'<rect x="3" y="{-90 + 8 * k + 4}" width="62" height="4" fill="{TE_D}"/>' for k in range(4))
            + f'<rect x="3" y="-90" width="26" height="20" fill="{TE_D}"/>')


def icon_protect(t, tq, C):
    t_haw, t_under, t_am, t_prot = C.at('Hawaiʻi'), C.at('under'), C.at("America's"), C.at('protection')
    CX, CY, BY, DW, DH = 960, 488, 630, 400, 350
    o = ''
    isl, _ = islands_svg(400)
    o += g(CX, CY, pop(t, t_haw - 0.05, 0.36), isl)
    if t >= t_under:
        v = ease_out((tq - t_under) / 0.42)
        dy = -260 * (1 - v)
        o += g(CX, BY + dy, 1.0, dome(DW, DH))
        if t >= t_am:
            o += g(CX, BY + dy - DH, pop(t, t_am, 0.3), flag_teal())
        if t >= t_prot:                                               # it locks: the rim thickens, a glint runs over it
            gl = clamp(step12(t - t_prot) / 0.5)
            if gl < 1:
                a = math.pi * (1 - gl)
                o += f'<circle cx="{CX + DW * math.cos(a):.1f}" cy="{BY - DH * math.sin(a):.1f}" r="12" fill="{CREAM}"/>'
            o += f'<line x1="{CX - DW - 20}" y1="{BY}" x2="{CX + DW + 20}" y2="{BY}" stroke="{TE}" stroke-width="9" stroke-linecap="round"/>'
    return o


def icon_annex(t, tq, C):
    t_us, t_off, t_add, t_it = C.at('United States'), C.at('officially'), C.at('add'), C.at('to itself')
    o = ''
    # the U.S.: a big teal slab, like the strong country on the IMPERIALISM card
    o += g(700, 420, pop(t, t_us, 0.4), f'<path d="{tablet(210, 140, 34)}" fill="{TE_D}" transform="translate(8,10)"/><path d="{tablet(210, 140, 34)}" fill="{TE}"/>'
                                         + text(0, 14, 'UNITED STATES', 30, 'Plex', INK, 'middle', extra='letter-spacing="2"'))
    # Hawaiʻi: the islands pop in, slide across to the slab, then the slab's outline takes them in and they fill teal
    if t >= t_off:
        v = ease_io((tq - t_add) / 0.7) if t >= t_add else 0.0
        x = 1330 - 210 * v
        frac = clamp((tq - t_it - 0.25) / 0.5) if t >= t_it else 0.0
        isl, d = islands_svg(380)
        body = isl
        if frac > 0:
            body += (f'<clipPath id="anx"><rect x="-200" y="-200" width="{400 * frac:.1f}" height="400"/></clipPath>'
                     f'<path d="{d}" fill="{TE}" stroke="{CO}" stroke-width="3" clip-path="url(#anx)"/>')
        o += g(x, 430, pop(t, t_off, 0.34), body)
        if v <= 0:
            o += f'<g opacity="{clamp((t - t_off - 0.3) / 0.25):.3f}">' + text(x, 560, 'HAWAIʻI', 26, 'Plex', CO, 'middle', extra='letter-spacing="3"') + '</g>'
    if t >= t_it:
        pr = clamp(step12(t - t_it) / 0.55)
        dash = 'stroke-dasharray="18 12"' if pr >= 1 else f'pathLength="1" stroke-dasharray="{pr:.3f} 1"'
        o += f'<rect x="465" y="250" width="900" height="380" rx="40" fill="none" stroke="{TE}" stroke-width="7" {dash}/>'
    return o


def swords():
    b = (f'<line x1="-46" y1="46" x2="40" y2="-40" stroke="{CREAM}" stroke-width="8" stroke-linecap="round"/>'
         f'<line x1="-48" y1="22" x2="-22" y2="48" stroke="{CREAM}" stroke-width="8" stroke-linecap="round"/>')
    return f'<g>{b}</g><g transform="scale(-1,1)">{b}</g>'


def chain(n=5):
    o = ''
    for k in range(n):
        x = (k - (n - 1) / 2) * 38
        o += (f'<ellipse cx="{x:.1f}" cy="0" rx="24" ry="13" fill="none" stroke="{BONE}" stroke-width="7"/>' if k % 2 == 0 else
              f'<ellipse cx="{x:.1f}" cy="0" rx="24" ry="5" fill="none" stroke="{BONE_D}" stroke-width="7"/>')
    return o


def icon_isolation(t, tq, C):
    t_stay, t_out, t_oth, t_wars, t_all = C.at('Staying'), C.at('out of other'), C.at("other countries'"), C.at('wars'), C.at('alliances')
    o = ''
    # America: a teal slab; a teal fence goes up around it, picket by picket
    PX, PY, W_, D_ = 640, 470, 360, 150
    ox, oy = D_ * 0.55, -D_ * 0.45
    s = pop(t, t_stay - 0.1, 0.36)
    body = plat(0, 0, W_, D_, 40, TE, TE_D, '#1a9481')
    o += g(PX, PY, s, body)
    if s >= 1:
        # posts on the slab's four top edges, going up one by one round the slab, then the rails; back to front
        x0, x1, k = PX - W_ / 2 + 14, PX + W_ / 2 - 14, 0.86
        corners = [(x0, PY + 6), (x0 + ox * k, PY + oy * k + 6), (x1 + ox * k, PY + oy * k + 6), (x1, PY + 6)]
        ring = []
        for (ax, ay), (bx, by), n in zip(corners, corners[1:] + corners[:1], (3, 8, 3, 8)):
            ring += [(ax + (bx - ax) * i / n, ay + (by - ay) * i / n) for i in range(n)]
        up = [clamp((step12(t) - t_out - i * 0.035) / 0.16) for i in range(len(ring))]
        rails = ''
        if min(up) >= 1:
            for (ax, ay), (bx, by) in zip(corners, corners[1:] + corners[:1]):
                for hgt in (18, 40):
                    rails += f'<line x1="{ax:.1f}" y1="{ay - hgt:.1f}" x2="{bx:.1f}" y2="{by - hgt:.1f}" stroke="{TE}" stroke-width="5" stroke-linecap="round"/>'
        back = [i for i in range(len(ring)) if ring[i][1] < PY - 20]
        front = [i for i in range(len(ring)) if i not in back]
        for i in sorted(back, key=lambda i: ring[i][1]):
            if up[i] > 0:
                o += picket(ring[i][0], ring[i][1], 52 * up[i])
        o += rails
        for i in sorted(front, key=lambda i: ring[i][1]):
            if up[i] > 0:
                o += picket(ring[i][0], ring[i][1], 52 * up[i])
    # the other countries: three bone slabs, wars between two, an alliance chaining two
    C3 = [(1170, 330), (1480, 380), (1260, 560)]
    for j, (cx, cy) in enumerate(C3):
        o += g(cx, cy, pop(t, t_oth + j * 0.1, 0.32), plat(0, 0, 170, 70, 22, BONE, BONE_D, '#bdb3a0'))
    if t >= t_wars:
        o += g(1350, 330, pop(t, t_wars, 0.3), swords())
    if t >= t_all:
        o += g(1385, 470, pop(t, t_all, 0.3), f'<g transform="rotate(-38)">{chain(7)}</g>')
    return o


# ================================================================ the cards
CARDS = {
    'coup': dict(stem='ch06_the_heist', start='A small group taking', defn='a small group taking a government by force',
                 term='COUP', pron='/ koo /', icon=icon_coup, hold=1.3),
    'tariff': dict(stem='ch06_the_heist', start='Sugar coming into', def_at='a tax at the border', defn='a tax at the border',
                   term='TARIFF', pron='/ TAIR-if /', icon=icon_tariff, hold=1.0),
    'interventionism': dict(stem='ch06_the_heist', start='Stepping into another', defn="stepping into another country's affairs to protect your own interests",
                            term='INTERVENTIONISM', pron='/ in-ter-VEN-shuh-niz-um /', icon=icon_intervention, hold=1.0),
    'protectorate': dict(stem='ch06_the_heist', start='put Hawaiʻi under', defn="put Hawaiʻi under America's protection",
                         term='PROTECTORATE', pron='/ pruh-TEK-tuh-rit /', icon=icon_protect, hold=1.0,
                         colors={'hawaiʻi': CO, "america's": TE}),
    'annexation': dict(stem='ch06_the_heist', start='the United States to officially', defn='the United States to officially add Hawaiʻi to itself',
                       term='ANNEXATION', pron='/ an-ek-SAY-shun /', icon=icon_annex, hold=1.1,
                       colors={'hawaiʻi': CO, 'united': TE, 'states': TE}),
    'isolationism': dict(stem='ch03_the_old_guard', start='Staying out of', defn="staying out of other countries' wars and alliances",
                         term='ISOLATIONISM', pron='/ eye-suh-LAY-shuh-niz-um /', icon=icon_isolation, hold=0.8),
}
ORDER = ['isolationism', 'tariff', 'coup', 'interventionism', 'protectorate', 'annexation']


class Cue:
    """word times for one card, relative to its start"""

    def __init__(self, Wd, tw, t_term):
        self.Wd, self.tw, self.term = Wd, tw, t_term

    def at(self, phrase, k=1):
        return self.Wd.at(phrase, k)


def build(key):
    c = CARDS[key]
    W0 = Words(c['stem'])
    a = max(0.0, W0.at(c['start']) - c.get('lead', 0.3))
    term_word = c.get('term_at', c['term'].lower())
    b = W0.end(term_word) + c.get('hold', 1.2)
    Wd = Words(c['stem'], t0=a)
    S = stage('vocab_' + key, b - a)
    S.over.append('<g id="ov"></g>')
    DEF = c['defn'].split()
    i0 = Wd._find(c.get('def_at', c['start']))[0]
    for k, w in enumerate(DEF):                                  # the words on screen are the words spoken
        assert _norm(Wd.w[i0 + k]['w']) == _norm(w), (key, w, Wd.w[i0 + k]['w'])
    tw = [Wd.w[i0 + k]['s'] - a for k in range(len(DEF))]
    t_term = Wd.at(term_word)
    C = Cue(Wd, tw, t_term)
    cols = c.get('colors', {})
    dsize, lines = def_layout(DEF)
    ys = [790] if len(lines) == 1 else [742, 812]
    s, ps, xs, xp, sw = term_layout(c['term'], c['pron'])
    py = 960 - (s - ps) * 0.37 - sw * 0.017

    def frame(t):
        tq = step12(t)
        o = c['icon'](t, tq, C)
        # the definition, word by word on its spoken time
        for y, rng in zip(ys, lines):
            spans = ''.join(f'<tspan fill="{cols.get(_norm(DEF[i]), CREAM)}" fill-opacity="{clamp((t - tw[i] + 0.03) / 0.2):.3f}">{escape(DEF[i])} </tspan>'
                            for i in rng)
            o += f'<text x="960" y="{y}" font-family="\'Inter8\'" font-size="{dsize}" fill="{CREAM}" text-anchor="middle" xml:space="preserve">{spans}</text>'
        # the term on the orange strip, and how to say it
        if t >= t_term:
            o += strip(xs, 960, c['term'], s, prog=(tq - t_term) / 0.27)
            if t >= t_term + 0.3:
                o += f'<g opacity="{clamp((t - t_term - 0.3) / 0.25):.3f}">' + text(xp, py, c['pron'], ps, 'Plex', TE) + '</g>'
        return {'h': {'ov': o}}
    return S, frame, c['stem'], a, b


def render_stills(S, times, dest):
    """render a few frames of a written stage to PNG (for checking), copied to dest"""
    os.makedirs(dest, exist_ok=True)
    outs = []
    for t in times:
        i = min(int(round(t * FPS)), int(round(S.dur * FPS)) - 1)
        subprocess.run(['node', os.path.join(KIT, 'anim_render.mjs'), S.dir, str(i), str(i)], check=True, capture_output=True)
        p = os.path.join(dest, f'{S.name}_{i:04d}.png')
        shutil.copy(os.path.join(S.dir, 'f', f'{i:04d}.png'), p)
        outs.append(p)
    return outs


def join(clips, out):
    inp = []
    for c in clips:
        inp += ['-i', c]
    n = len(clips)
    flt = ''.join(f'[{i}:v][{i}:a]' for i in range(n)) + f'concat=n={n}:v=1:a=1[v][a]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inp + ['-filter_complex', flt, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264',
                    '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', out], check=True)
    return out


if __name__ == '__main__':
    args = sys.argv[1:]
    if args[:1] == ['--still']:
        key, ts = args[1], [float(x) for x in args[2:]]
        S, frame, stem, a, b = build(key)
        S.write(frame)
        print('\n'.join(render_stills(S, ts, os.path.join(EP, 'build', 'stills'))))
        sys.exit()
    keys = args or ORDER
    clips = []
    for k in keys:
        S, frame, stem, a, b = build(k)
        S.write(frame)
        clips.append(encode_clip(S.name, stem, a, b, os.path.join(S.dir, 'clip.mp4')))
        print('clip', k, round(b - a, 2), 's', flush=True)
    os.makedirs(OUT, exist_ok=True)
    print('reel', join(clips, os.path.join(OUT, 'vocab_cards.mp4')))
