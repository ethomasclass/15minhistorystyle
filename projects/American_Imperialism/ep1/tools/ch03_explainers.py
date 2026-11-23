# Chapter 3, "The Old Guard": the explainer shots, each keyed to the narration's words (public/audio/ch03_the_old_guard):
#   globe_fence  "For most of the 1800s ... stay out of it": a vector globe turns to the U.S. (teal, the lower 48 only;
#                Alaska is still Russian), and a teal fence goes up along its coasts on "stay out of it"
#   alaska       "bought Alaska from Russia for $7.2 million ... less than two cents an acre": the real Treasury warrant
#                slides onto the desk, $7,200,000 counts up, the camera glides to a vector Alaska and a two-cent piece
#                lands by one (enlarged) acre
#   gold         "gold" (the humor cut): hard cut, a nugget drops on the desk and stops dead, then a second of nothing
#   census       "the frontier ... So where next?": the 1890 census map; settlement inks in west on the map's own data;
#                a teal pencil hunts for the frontier line and lifts away with nothing drawn; the Census Office line typed;
#                the ink reaches the coast and beads; the camera slides off the map's edge into the wall map's open sea
#   python3 tools/ch03_explainers.py [key ...]          renders each, then renders/tests/ch03_explainers.mp4
#   python3 tools/ch03_explainers.py --still key t ...  stills at t s into the piece (negative: from the end)
# Map data: Natural Earth 1:50m land and admin-0 countries (public domain), cut into build/geo once.
import json, math, os, shutil, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vkit import *   # noqa: F401,F403
from vkit import EP, KIT
from kit import card, Spline, ease_in
import vocab
from vocab import ne, rings, render_stills, join

STEM = 'ch03_the_old_guard'
W0 = Words(STEM)
GEO = os.path.join(EP, 'build', 'geo')
PARTS = os.path.join(EP, 'build', 'ch03_parts')
OUT = os.path.join(EP, 'renders', 'tests')
os.makedirs(PARTS, exist_ok=True)
Image.MAX_IMAGE_PIXELS = None
SEA, SEA2, GRAT = '#7fa6a2', '#6f9997', '#e9dbb8'          # the pitch-room wall map (pacmap.wall_texture)
PAPER_INK = '#5b5040'


# ================================================================ geometry
def dp(pts, tol):
    """Douglas-Peucker in degrees (a closed ring is done as two halves)"""
    if len(pts) < 4:
        return pts
    if pts[0] == pts[-1]:
        m = len(pts) // 2
        return dp(pts[:m + 1], tol)[:-1] + dp(pts[m:], tol)
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        (x0, y0), (x1, y1) = pts[i], pts[j]
        dx, dy = x1 - x0, y1 - y0
        L = math.hypot(dx, dy) or 1e-9
        best, bk = -1, -1
        for k in range(i + 1, j):
            x, y = pts[k]
            d = abs(dy * (x - x0) - dx * (y - y0)) / L
            if d > best:
                best, bk = d, k
        if best > tol:
            keep[bk] = True
            stack += [(i, bk), (bk, j)]
    return [p for p, k in zip(pts, keep) if k]


def land(tol=0.18):
    p = os.path.join(GEO, f'land_50m_dp{tol}.json')
    if not os.path.exists(p):
        src = json.load(open(os.path.join(EP, 'assets', 'geo', 'ne_50m_land.geojson')))['features']
        out = []
        for r in rings(src):
            xs, ys = [q[0] for q in r], [q[1] for q in r]
            if max(xs) - min(xs) < 0.5 and max(ys) - min(ys) < 0.5:
                continue
            s = dp([tuple(q) for q in r], tol)
            if len(s) >= 4:
                out.append([[round(x, 3), round(y, 3)] for x, y in s])
        json.dump(out, open(p, 'w'))
    return json.load(open(p))


def usa():
    """the lower 48 (one ring), Alaska's rings (lon 0..360), and the lower 48's two sea coasts as runs of points"""
    p = os.path.join(GEO, 'usa_50m.json')
    if not os.path.exists(p):
        feats = ne('ne_50m_admin_0_countries')['features']
        us = [f for f in feats if f['properties'].get('ADM0_A3') == 'USA'][0]
        polys = us['geometry']['coordinates']
        l48 = max(polys, key=lambda q: len(q[0]))[0]
        ak = [q[0] for q in polys if min(y for _, y in q[0]) > 50]
        coast = set()
        for r in rings(json.load(open(os.path.join(EP, 'assets', 'geo', 'ne_50m_land.geojson')))['features']):
            coast.update((round(x, 2), round(y, 2)) for x, y in r)
        runs, cur = [], []
        for x, y in l48:
            if (round(x, 2), round(y, 2)) in coast:
                cur.append((x, y))
            elif cur:
                runs.append(cur); cur = []
        if cur:
            runs.append(cur)
        runs = [r for r in runs if len(r) > 100]

        def resample(r, step):
            out, acc = [r[0]], 0.0
            for (x0, y0), (x1, y1) in zip(r, r[1:]):
                acc += math.hypot((x1 - x0) * math.cos(math.radians(y0)), y1 - y0)
                if acc >= step:
                    out.append((x1, y1)); acc = 0.0
            return out
        json.dump({'lower48': [[round(x, 3), round(y, 3)] for x, y in dp([tuple(q) for q in l48], 0.04)],
                   'alaska': [[[round(x % 360, 3), round(y, 3)] for x, y in dp([tuple(q) for q in r], 0.03)] for r in ak],
                   'coast': [[[round(x, 3), round(y, 3)] for x, y in resample(r, 0.75)] for r in runs]}, open(p, 'w'))
    return json.load(open(p))


def ortho(lon, lat, lon0, lat0):
    lam, phi, p0 = math.radians(lon - lon0), math.radians(lat), math.radians(lat0)
    cp = math.cos(phi)
    return (cp * math.sin(lam), math.cos(p0) * math.sin(phi) - math.sin(p0) * cp * math.cos(lam),
            math.sin(p0) * math.sin(phi) + math.cos(p0) * cp * math.cos(lam))


def clip_ring(ring, lon0, lat0):
    """a ring cut to the near hemisphere (unit disk, y up); where it runs behind, the cut follows the limb"""
    P = [ortho(x, y, lon0, lat0) for x, y in ring]
    if all(p[2] < 0 for p in P):
        return None
    if all(p[2] >= 0 for p in P):
        return [(p[0], p[1]) for p in P]
    out, n = [], len(P)
    for i in range(n):
        p, q = P[i], P[(i + 1) % n]
        if p[2] >= 0:
            out.append((p[0], p[1], 'v'))
        if (p[2] >= 0) != (q[2] >= 0):
            s = p[2] / (p[2] - q[2])
            ix, iy = p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s
            r = math.hypot(ix, iy) or 1.0
            out.append((ix / r, iy / r, 'x' if p[2] >= 0 else 'n'))
    res, m = [], len(out)
    for k in range(m):
        res.append(out[k][:2])
        if out[k][2] == 'x' and out[(k + 1) % m][2] == 'n':
            nx = out[(k + 1) % m]
            a0, a1 = math.atan2(out[k][1], out[k][0]), math.atan2(nx[1], nx[0])
            d = (a1 - a0 + math.pi) % (2 * math.pi) - math.pi
            st = max(1, int(abs(d) / math.radians(4)))
            res += [(math.cos(a0 + d * j / st), math.sin(a0 + d * j / st)) for j in range(1, st)]
    return res


# ================================================================ encode with sound effects
def encode_mix(S, stem, a, b, out, sfx_vol=0.35):
    """vkit.encode_clip, but keeps the effects track (encode.py mixes S.sounds) under the narration"""
    if not S.sounds:
        return encode_clip(S.name, stem, a, b, out)
    d = S.dir
    subprocess.run(['node', os.path.join(KIT, 'anim_render.mjs'), d], check=True, capture_output=True)
    subprocess.run([sys.executable, os.path.join(KIT, 'encode.py'), d, os.path.join(d, 'silent.mp4')], check=True, capture_output=True)
    wav = os.path.join(EP, 'public', 'audio', stem + '.wav')
    flt = (f'[1:a]afade=t=out:st={b - a - 0.08:.3f}:d=0.08,apad[n];[0:a]volume={sfx_vol}[s];'
           '[n][s]amix=inputs=2:duration=shortest:normalize=0[a]')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(d, 'silent.mp4'), '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', wav,
                    '-filter_complex', flt, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', out], check=True)
    return out


def wide_desk(S, x0=-2400, y0=-1600, w=7200, h=4300, cx=960, cy=480, r=1500):
    """the warm desk (vkit.desk) over a wider area, for shots whose camera travels"""
    S.defs.append(f'<radialGradient id="deskw" gradientUnits="userSpaceOnUse" cx="{cx}" cy="{cy}" r="{r}"><stop offset="0" stop-color="#2a2620"/>'
                  '<stop offset="0.6" stop-color="#16140f"/><stop offset="1" stop-color="#0d0c09"/></radialGradient>')
    S.world.append(f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" fill="url(#deskw)"/><g opacity="0.12">'
                   + ''.join(f'<rect x="{x0}" y="{y}" width="{w}" height="1" fill="#fff" opacity="0.35"/>' for y in range(y0 + 32, y0 + h, 64)) + '</g>')


def to_screen(cam, t, wx, wy):
    x, y, z, r = cam.at(t)
    dx, dy = (wx - x) * z, (wy - y) * z
    c, s = math.cos(math.radians(r)), math.sin(math.radians(r))
    return W / 2 + dx * c - dy * s, H / 2 + dx * s + dy * c


# ================================================================ globe_fence
def globe_fence():
    a = 0.0
    b = W0.at('Staying') - 0.3
    Wd = Words(STEM, t0=a)
    t_am, t_rest, t_stay, t_end = Wd.at('America had'), Wd.at('rest of the world'), Wd.at('stay out of it'), Wd.end('stay out of it')
    S = stage('ch03_globe_fence', b - a, bg=False)
    wide_desk(S)
    CX, CY, R = 960, 548, 430
    S.defs.append('<radialGradient id="gocean" cx="40%" cy="36%" r="70%"><stop offset="0" stop-color="#1d3834"/>'
                  '<stop offset="1" stop-color="#0e1b19"/></radialGradient>'
                  f'<clipPath id="gclip"><circle cx="{CX}" cy="{CY}" r="{R}"/></clipPath>')
    S.world.append(f'<ellipse cx="{CX + 30}" cy="{CY + R + 26}" rx="{R * 0.9}" ry="{R * 0.11:.0f}" fill="#000" opacity="0.45" filter="url(#soft)"/>')
    S.world.append('<g id="globe"></g>')
    S.over.append('<g id="ov"></g>')
    LAND = land()
    U = usa()
    cam = Camera([(0, 960, 540, 0.97), (t_stay - 0.4, 960, 530, 1.03), (t_end + 0.1, 968, 505, 1.5), (b - a, 968, 503, 1.55)], wobble=0.8)

    def proj(lon0, lat0, ring):
        c = clip_ring(ring, lon0, lat0)
        if not c:
            return ''
        return 'M' + ' L'.join(f'{CX + R * x:.1f},{CY - R * y:.1f}' for x, y in c) + 'z'

    def frame(t):
        tq = step12(t)
        u = ease_io(t / (t_stay + 0.2))
        lon0, lat0 = -62 - 36 * u, 26 + 10 * u                    # the globe turns from the Atlantic to the U.S.
        s = pop(t, 0.04, 0.42)
        o = f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="url(#gocean)"/><g clip-path="url(#gclip)">'
        # graticule, near side only
        for lo in range(-180, 180, 30):
            seg = []
            for la in range(-90, 91, 5):
                x, y, z = ortho(lo, la, lon0, lat0)
                seg.append(f'{CX + R * x:.1f},{CY - R * y:.1f}' if z > 0 else None)
            o += ''.join(f'<polyline points="{" ".join(p)}" fill="none" stroke="{CREAM}" stroke-width="1.5" opacity="0.1"/>'
                         for p in _runs(seg))
        for la in range(-60, 90, 30):
            seg = []
            for lo in range(-180, 181, 5):
                x, y, z = ortho(lo, la, lon0, lat0)
                seg.append(f'{CX + R * x:.1f},{CY - R * y:.1f}' if z > 0 else None)
            o += ''.join(f'<polyline points="{" ".join(p)}" fill="none" stroke="{CREAM}" stroke-width="1.5" opacity="0.1"/>'
                         for p in _runs(seg))
        lc = BONE_D if t < t_rest else BONE
        o += f'<path d="{"".join(proj(lon0, lat0, r) for r in LAND)}" fill="{lc}" fill-rule="nonzero"/>'
        # the U.S.: the lower 48 fills teal on "America"
        if t >= t_am:
            f = clamp((tq - t_am) / 0.25)
            o += f'<path d="{proj(lon0, lat0, U["lower48"])}" fill="{TE}" opacity="{f:.2f}"/>'
        # the fence along both coasts, rising post by post from "stay" to "it"
        if t >= t_stay - 0.05:
            up = clamp((tq - t_stay + 0.05) / (t_end - t_stay + 0.25))
            for run in U['coast']:
                n = len(run)
                pts = []
                for i, (lo, la) in enumerate(run):
                    x, y, z = ortho(lo, la, lon0, lat0)
                    h = 15 * clamp((up * n - i) / 3)
                    pts.append((CX + R * x, CY - R * y, h if z > 0.06 else -1))
                for hh in (6, 12):
                    seg = [f'{x:.1f},{y - hh:.1f}' if h >= 14.9 else None for x, y, h in pts]
                    for p in _runs(seg):
                        o += f'<polyline points="{" ".join(p)}" fill="none" stroke="{INK}" stroke-width="4.5" stroke-linejoin="round"/>'
                        o += f'<polyline points="{" ".join(p)}" fill="none" stroke="{TE}" stroke-width="2" stroke-linejoin="round"/>'
                for k, (x, y, h) in enumerate(pts):
                    if h > 0 and k % 3 == 0:
                        o += (f'<line x1="{x:.1f}" y1="{y + 1:.1f}" x2="{x:.1f}" y2="{y - h - 1:.1f}" stroke="{INK}" stroke-width="5.5" stroke-linecap="round"/>'
                              f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{x:.1f}" y2="{y - h:.1f}" stroke="{TE}" stroke-width="3" stroke-linecap="round"/>')
        o += '</g>'
        o += f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="none" stroke="{BONE_D}" stroke-width="3" opacity="0.5"/>'
        o = f'<g transform="translate({CX},{CY}) scale({s:.4f}) translate({-CX},{-CY})">{o}</g>'
        return {'t': {'CAM': cam.transform(t)}, 'h': {'globe': o, 'ov': ''}}
    return S, frame, STEM, a, b


def _runs(seg):
    out, cur = [], []
    for p in seg:
        if p is None:
            if len(cur) > 1:
                out.append(cur)
            cur = []
        else:
            cur.append(p)
    if len(cur) > 1:
        out.append(cur)
    return out


# ================================================================ alaska
MAP_X, MAP_Y, MAP_W, MAP_H = 1980, 200, 1180, 800              # the Alaska sheet on the desk (world px)
AK_LON0, AK_LON1, AK_LAT0, AK_LAT1 = 170.0, 232.0, 50.5, 72.5
ACRE = (206.5, 64.8)                                             # interior Alaska, west of the Tanana valley


def ak_xy(lon, lat):
    kx = math.cos(math.radians(61.5))
    sx = (MAP_W - 80) / ((AK_LON1 - AK_LON0) * kx)
    sy = sx
    return (MAP_X + 40 + (lon % 360 - AK_LON0) * kx * sx, MAP_Y + 40 + (AK_LAT1 - lat) * sy)


def ak_scale():
    return (MAP_W - 80) / ((AK_LON1 - AK_LON0) * math.cos(math.radians(61.5)))   # px per degree of latitude


def two_cent(r):
    """the U.S. two-cent piece (1864-73): bronze, a shield, the value in a wreath; flat"""
    leaves = ''.join(f'<ellipse cx="{r * 0.62 * math.cos(math.radians(a)):.1f}" cy="{r * 0.62 * math.sin(math.radians(a)):.1f}" rx="{r * 0.09:.1f}" '
                     f'ry="{r * 0.04:.1f}" fill="{OR_D}" transform="rotate({a + 90} {r * 0.62 * math.cos(math.radians(a)):.1f} {r * 0.62 * math.sin(math.radians(a)):.1f})"/>'
                     for a in list(range(20, 165, 18)) + list(range(195, 340, 18)))
    return (f'<circle r="{r}" fill="{OR_D}"/><circle r="{r * 0.9:.1f}" fill="{OR}"/><circle r="{r * 0.84:.1f}" fill="none" stroke="{OR_D}" stroke-width="{r * 0.03:.1f}"/>'
            + leaves + text(0, r * 0.12, '2', r * 0.75, 'Abril', INK, 'middle')
            + text(0, r * 0.42, 'CENTS', r * 0.2, 'Inter8', INK, 'middle', extra='letter-spacing="1"'))


def alaska():
    a = W0.at('bought Alaska') - 0.35
    b = W0.at('A few critics') - 0.06
    Wd = Words(STEM, t0=a)
    t_ak, t_rus, t_mil0, t_mil1 = Wd.at('Alaska from'), Wd.at('Russia'), Wd.at('$7.2 million'), Wd.end('$7.2 million')
    t_works, t_less, t_two, t_acre, t_acre_e = Wd.at('which works out'), Wd.at('less than'), Wd.at('two cents'), Wd.at('an acre'), Wd.end('an acre')
    S = stage('ch03_alaska', b - a, bg=False)
    wide_desk(S, cx=1200, cy=520, r=2200)
    # the warrant, as a print with a cream border (it slides in)
    chk = S.img(os.path.join(EP, 'img', 'raw', 'nara_alaska_check.jpg'))
    CW, CH = 1040, 1040 * 381 / 770
    S.world.append(f'<g id="chk">' + card(chk, 760 - CW / 2, 150, CW, CH, rot=-1.2) + '</g>')
    # the Alaska sheet: Natural Earth coastlines, Alaska teal, its neighbours bone
    LAND = land(0.05)
    U = usa()
    S.defs.append(f'<clipPath id="akclip"><rect x="{MAP_X}" y="{MAP_Y}" width="{MAP_W}" height="{MAP_H}"/></clipPath>')

    def path(rs):
        return ''.join('M' + ' L'.join('%.1f,%.1f' % ak_xy(x, y) for x, y in r) + 'z' for r in rs)
    near = [r for r in LAND if any((x % 360) > AK_LON0 - 15 and (x % 360) < AK_LON1 + 15 and y > AK_LAT0 - 8 for x, y in r)]
    near = [[[x % 360, y] for x, y in r] for r in near]
    grat = ''
    for lo in range(170, 240, 10):
        x0, y0 = ak_xy(lo, AK_LAT1 + 2); x1, y1 = ak_xy(lo, AK_LAT0 - 2)
        grat += f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{PAPER_INK}" stroke-width="1.2" opacity="0.18"/>'
    for la in range(50, 75, 5):
        x0, y0 = ak_xy(AK_LON0 - 5, la); x1, y1 = ak_xy(AK_LON1 + 5, la)
        grat += f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{PAPER_INK}" stroke-width="1.2" opacity="0.18"/>'
    lx, ly = ak_xy(207, 67.2)
    S.world.append(f'<rect x="{MAP_X + 12}" y="{MAP_Y + 20}" width="{MAP_W}" height="{MAP_H}" fill="#000" opacity="0.5" filter="url(#soft)"/>'
                   f'<rect x="{MAP_X}" y="{MAP_Y}" width="{MAP_W}" height="{MAP_H}" fill="{CREAM}"/>'
                   f'<g clip-path="url(#akclip)">{grat}<path d="{path(near)}" fill="{BONE_D}"/>'
                   f'<path d="{path(U["alaska"])}" fill="{TE}" stroke="{TE_D}" stroke-width="1.5" stroke-linejoin="round"/></g>'
                   + text(lx, ly, 'ALASKA', 26, 'Plex', INK, 'middle', extra='letter-spacing="5"')
                   + tag(MAP_X, MAP_Y + MAP_H + 34, 'COASTLINES: NATURAL EARTH', 16, TAG))
    S.world.append('<g id="ak"></g>')
    S.over.append('<g id="ov"></g>')
    ax, ay = ak_xy(*ACRE)
    SQ = 9                                                       # the acre, drawn this big (world px)
    times = int(round(SQ / (0.0636 / 111.32 * ak_scale()) / 50.0) * 50)
    CR = 30                                                      # the coin's radius
    cx, cy = ax - CR * 0.95, ay - CR * 0.55                     # it lands just up and left of the acre, touching it
    cam = Camera([(0, 760, 520, 1.0), (t_works, 760, 530, 1.03), (t_less + 0.1, MAP_X + MAP_W / 2, MAP_Y + MAP_H / 2, 1.0),
                  (t_two, (MAP_X + MAP_W / 2 + ax) / 2, (MAP_Y + MAP_H / 2 + ay) / 2, 1.35),
                  (t_acre_e + 0.15, ax - 10, ay + 4, 2.3), (b - a, ax - 10, ay + 4, 2.4)], wobble=0.9)

    def frame(t):
        tq = step12(t)
        T = {'CAM': cam.transform(t)}
        # the warrant slides onto the desk
        v = ease_out(clamp(t / 0.75), 3)
        T['chk'] = f'translate({(1 - v) * 900:.1f},{-(1 - v) * 620:.1f}) rotate({(1 - v) * 9:.2f} 760 400)'
        w = ''
        if t >= 0.75:
            w += f'<g opacity="{clamp((t - 0.75) / 0.25):.3f}">' + tag(760 - CW / 2 - 18, 150 + CH + 58,
                                                                        'TREASURY WARRANT FOR THE PURCHASE OF ALASKA, 1868 · NATIONAL ARCHIVES', 17) + '</g>'
        # $7,200,000 counts up on "$7.2 million"
        if t >= t_mil0:
            u = ease_out(clamp((tq - t_mil0) / (t_mil1 - t_mil0 + 0.15)), 2)
            val = int(7_200_000 * u / 1000) * 1000
            w += text(760, 905, f'${val:,}', 118, 'Inter8', CREAM, 'middle', extra='style="font-feature-settings:\'tnum\'"')
        # the acre, then the coin
        ov = ''
        if t >= t_less:
            w += g(ax, ay, pop(t, t_less, 0.3), f'<rect x="{-SQ / 2}" y="{-SQ / 2}" width="{SQ}" height="{SQ}" fill="{CREAM}" stroke="{INK}" stroke-width="1.6"/>')
        if t >= t_two:
            u = clamp((tq - t_two) / 0.25)
            k = 1 + 1.4 * (1 - u) ** 2                            # falls toward the desk: big and high, then down, stop
            w += g(cx + 10 * (k - 1), cy + 14 * (k - 1), 1.0, f'<ellipse rx="{CR}" ry="{CR * 0.95}" fill="#000" opacity="{0.25 + 0.15 * u:.2f}" filter="url(#soft4)"/>')
            w += g(cx, cy - 40 * (k - 1), k, two_cent(CR))
        if t >= t_acre:                                          # the label on the screen, by the acre
            sx, sy = to_screen(cam, t, ax + SQ / 2, ay + SQ / 2)
            op = clamp((t - t_acre) / 0.25)
            ov += (f'<g opacity="{op:.3f}"><line x1="{sx + 6:.1f}" y1="{sy + 6:.1f}" x2="{sx + 70:.1f}" y2="{sy + 70:.1f}" stroke="{INK}" stroke-width="3"/>'
                   + text(sx + 80, sy + 92, '1 ACRE', 40, 'Plex', INK, extra='letter-spacing="2"')
                   + text(sx + 80, sy + 128, f'(DRAWN ABOUT {times} TIMES TOO BIG)', 22, 'Plex', PAPER_INK) + '</g>')
        return {'t': T, 'h': {'ak': w, 'ov': ov}}
    return S, frame, STEM, a, b


# ================================================================ gold
def nugget():
    pts = [(-118, 6), (-96, -38), (-52, -66), (4, -72), (58, -58), (104, -26), (122, 14), (86, 44), (24, 56), (-46, 50), (-98, 34)]
    d = 'M' + ' L'.join(f'{x},{y}' for x, y in pts) + 'z'
    return (f'<path d="{d}" fill="{OR_D}"/>'
            f'<path d="M-96,-38 L-52,-66 L4,-72 L-10,-30 L-60,-14 z" fill="{OR}"/>'
            f'<path d="M4,-72 L58,-58 L104,-26 L54,-8 L-10,-30 z" fill="#ffb54d"/>'
            f'<path d="M-60,-14 L-10,-30 L54,-8 L30,22 L-40,18 z" fill="{OR}"/>'
            f'<path d="M54,-8 L104,-26 L122,14 L86,44 L30,22 z" fill="{OR_D}"/>'
            f'<path d="M-118,6 L-96,-38 L-60,-14 L-40,18 L-98,34 z" fill="#c06f08"/>'
            f'<path d="M-40,18 L30,22 L86,44 L24,56 L-46,50 z" fill="#b5680a"/>'
            f'<path d="M-30,-52 L-8,-58 L-20,-40 z" fill="{CREAM}" opacity="0.55"/>'
            f'<ellipse cx="18" cy="-4" rx="9" ry="5" fill="#b5680a"/><ellipse cx="-70" cy="10" rx="7" ry="4" fill="#9a5806"/>'
            f'<ellipse cx="70" cy="18" rx="6" ry="4" fill="#9a5806"/>')


def gold():
    a = W0.at('gold') - 0.07                                     # the hard cut lands two frames before the word
    t_there = W0.end('gold there')
    b = t_there + 0.06                                           # the narration stops here; the picture holds a second
    S = stage('ch03_gold', t_there - a + 1.1, bg=False)
    wide_desk(S)
    S.world.append('<g id="ng"></g>')
    S.over.append('<g id="ov"></g>')
    LAND = 0.25                                                  # 3 drawings of fall, then it stops dead
    S.sound('dry-thud', LAND - 0.02, 0.7)
    cam = Camera([(0, 960, 540, 1.0), (S.dur, 960, 540, 1.0)], wobble=0.5)
    GX, GY = 960, 640

    def frame(t):
        tq = step12(t)
        u = clamp(tq / LAND)
        y = GY - 900 * (1 - u ** 2)
        o = (f'<ellipse cx="{GX + 6}" cy="{GY + 52}" rx="{130 * (0.6 + 0.4 * u):.1f}" ry="22" fill="#000" opacity="{0.15 + 0.3 * u:.2f}" filter="url(#soft4)"/>'
             + g(GX, y, 1.0, nugget()))
        return {'t': {'CAM': cam.transform(t)}, 'h': {'ng': o, 'ov': ''}}
    return S, frame, STEM, a, b


# ================================================================ census
MW = 4800
CROP = (90, 70, 9420, 6240)                                      # the scan inside its black border


def k24(x, y):
    """a point on the 2400-px proof of the scan -> world px on the map"""
    s = 9498 / 2400
    return ((x * s - CROP[0]) * MW / (CROP[2] - CROP[0]), (y * s - CROP[1]) * MW / (CROP[2] - CROP[0]))


X_EAST, X_WEST = k24(2100, 0)[0], k24(240, 0)[0]                 # the ink's run, Atlantic to Pacific
BEADS = [(347, 200), (337, 250), (320, 300), (300, 350), (280, 400), (262, 450), (252, 500), (236, 550), (242, 600), (250, 650),
         (266, 700), (272, 750), (282, 800), (300, 850), (340, 900), (390, 950)]      # just inside the coast, north to south


def census_parts():
    """colour.jpg (the scan), base.jpg (the same map with its density shading washed out to paper) and arrival.png
    (when the ink reaches each point: east first, dense ground before thin, a little noise for a bleeding edge)"""
    pc, pb, pa = (os.path.join(PARTS, f) for f in ('census_colour.jpg', 'census_base.jpg', 'census_arrival.npy'))
    if all(os.path.exists(p) for p in (pc, pb, pa)):
        return pc, pb, pa
    im = Image.open(os.path.join(EP, 'img', 'archival', 'ch03_census_1890_population_distribution.jpg')).crop(CROP)
    MH = round(MW * im.height / im.width)
    im = im.resize((MW, MH), Image.LANCZOS).convert('RGB')
    im.save(pc, quality=90)
    A = np.asarray(im, np.float32)
    r, gg, bb = A[..., 0], A[..., 1], A[..., 2]
    warm = np.clip((r - bb - 55) / 40, 0, 1)                       # the density tints (buff to brown-red), not ink or water
    paper = np.array([239, 229, 199], np.float32)
    base = A * (1 - warm[..., None]) + paper * warm[..., None]
    Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).save(pb, quality=90)
    # arrival at a quarter size
    sw, sh = MW // 4, MH // 4
    small = np.asarray(im.resize((sw, sh), Image.BILINEAR), np.float32)
    wsm = np.clip((small[..., 0] - small[..., 2] - 55) / 40, 0, 1)
    dens = wsm * np.clip(1 - small.mean(-1) / 255 * 1.1, 0, 1) * 2.2
    dens = np.asarray(Image.fromarray((np.clip(dens, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6)), np.float32) / 255
    xs = np.arange(sw, dtype=np.float32)[None, :] * 4
    u = np.clip((X_EAST - xs) / (X_EAST - X_WEST), -0.1, 1.1)
    rng = np.random.default_rng(7)
    noise = np.zeros((sh, sw), np.float32)
    for sc, amp in ((96, 1.0), (32, 0.5), (12, 0.25)):
        n = rng.standard_normal((sh // sc + 2, sw // sc + 2)).astype(np.float32)
        noise += amp * np.asarray(Image.fromarray(n).resize((sw, sh), Image.BICUBIC), np.float32)
    noise /= np.abs(noise).max()
    T = 0.04 + 0.9 * u + 0.05 * noise - 0.07 * dens
    np.save(pa, T.astype(np.float32))
    return pc, pb, pa


def ink_path(T, p, scale=4.0):
    """the region the ink has reached (T < p) as one even-odd SVG path in world px"""
    import cv2
    m = np.ascontiguousarray((T < p).astype(np.uint8) * 255)
    cs, _ = cv2.findContours(m, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    d = []
    for c in cs:
        if cv2.contourArea(c) < 3:
            continue
        c = cv2.approxPolyDP(c, 0.6, True).reshape(-1, 2)
        if len(c) >= 3:
            d.append('M' + ' L'.join(f'{x * scale + scale / 2:.0f},{y * scale + scale / 2:.0f}' for x, y in c) + 'z')
    return ''.join(d)


def pencil():
    """a teal pencil, tip at 0,0, lying along +x"""
    return (f'<path d="M0,0 L60,-15 L60,15 z" fill="{BONE_D}"/><path d="M0,0 L20,-5 L20,5 z" fill="{INK}"/>'
            f'<path d="M60,-15 L60,15 L470,15 L470,-15 z" fill="{TE}"/><rect x="60" y="-15" width="410" height="9" fill="#7ff0de"/>'
            f'<rect x="60" y="5" width="410" height="10" fill="{TE_D}"/>'
            f'<rect x="470" y="-16" width="38" height="32" fill="{BONE_D}"/><rect x="478" y="-16" width="4" height="32" fill="#a89f8e"/>'
            f'<rect x="494" y="-16" width="4" height="32" fill="#a89f8e"/><path d="M508,-16 L540,-16 Q548,0 540,16 L508,16 z" fill="#b9b1a3"/>')


def census():
    a = W0.at('the frontier') - 0.07
    b = W0.end('So where next?') + 0.9
    Wd = Words(STEM, t0=a)
    t_edge, t_began = Wd.at('the edge'), Wd.end('Native land began')
    t_cens, t_there, t_line, t_any = Wd.at('census reported'), Wd.at('there can hardly'), Wd.end('frontier line'), Wd.at('anymore')
    t_asfar, t_conc, t_full, t_so, t_next = Wd.at('As far as'), Wd.at('concerned'), Wd.end('was full'), Wd.at('So where'), Wd.end('So where next?')
    pc, pb, pa = census_parts()
    S = stage('ch03_census', b - a, bg=False)
    hc, hb = S.img(pc), S.img(pb)
    TF = np.load(pa)
    MH = TF.shape[0] * 4
    cache = {}

    def region(p):
        k = round(p, 4)
        if k not in cache:
            cache[k] = ink_path(TF, p)
        return cache[k]
    # the world: the wall map's sea everywhere (with its faint graticule), the census sheet lying on it
    grat = ''.join(f'<line x1="{x}" y1="-3000" x2="{x}" y2="{MH + 3000}" stroke="{GRAT}" stroke-width="2.5" opacity="0.22"/>' for x in range(-4800, MW + 2400, 240))
    grat += ''.join(f'<line x1="-6000" y1="{y}" x2="{MW + 3000}" y2="{y}" stroke="{GRAT}" stroke-width="2.5" opacity="0.22"/>' for y in range(-2400, MH + 2400, 240))
    S.world.append(f'<rect x="-6000" y="-3000" width="{MW + 9000}" height="{MH + 6000}" fill="{SEA}"/>'
                   f'<rect x="-6000" y="-3000" width="{MW + 9000}" height="{MH + 6000}" fill="{SEA2}" opacity="0.35"/>' + grat)
    S.defs.append('<filter id="inkblur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="5"/></filter>'
                  f'<mask id="inkm" maskUnits="userSpaceOnUse" x="-100" y="-100" width="{MW + 200}" height="{MH + 200}"><g id="inkg"></g></mask>'
                  f'<mask id="wetm" maskUnits="userSpaceOnUse" x="-100" y="-100" width="{MW + 200}" height="{MH + 200}"><g id="wetg"></g></mask>')
    S.world.append(f'<rect x="18" y="30" width="{MW}" height="{MH}" fill="#000" opacity="0.45" filter="url(#soft)"/>'
                   f'<image href="{hb}" x="0" y="0" width="{MW}" height="{MH}"/>'
                   f'<image href="{hc}" x="0" y="0" width="{MW}" height="{MH}" mask="url(#inkm)"/>'
                   f'<image href="{hc}" x="0" y="0" width="{MW}" height="{MH}" mask="url(#wetm)" style="mix-blend-mode:multiply" opacity="0.6"/>'
                   '<g id="cz"></g>')
    S.over.append('<g id="ov"></g>')
    ink = Spline([(0, 0.30), (t_edge, 0.33), (t_began, 0.50), (t_cens, 0.56), (t_any, 0.66), (t_conc, 0.80), (t_full - 0.2, 1.1)])
    sf = k24(250, 0)[0]                                          # the coast at San Francisco's longitude, more or less
    cam = Camera([(0, 3150, 1480, 0.92), (t_began, 2450, 1430, 0.9), (t_cens, 2200, 1420, 0.9), (t_any, 1900, 1400, 0.9),
                  (t_full, 950, 1360, 0.88), (t_so, 760, 1350, 0.88), (t_so + 1.05, -1500, 1330, 0.9), (b - a, -1560, 1330, 0.9)],
                 wobble=1.0)
    # the pencil: waypoints of the tip (world px) and its height over the paper; it never touches down
    HUNT = [(2350, 1180, 40), (2190, 1480, 9), (2260, 1700, 34), (2040, 1460, 7), (1930, 1180, 36), (2090, 1320, 6), (1990, 1590, 26)]
    hunt_t = [t_cens + 0.55 + i * (t_any - t_cens - 0.6) / (len(HUNT) - 1) for i in range(len(HUNT))]
    beads = [k24(x, y) for x, y in BEADS]
    words = 'there can hardly be said to be a frontier line'.split()
    from PIL import ImageFont
    QW = round(ImageFont.truetype(os.path.join(KIT, '..', 'fonts', 'SpecialElite.ttf'), 50).getlength('“' + ' '.join(words) + '”')) + 84
    QX0 = round(960 - QW / 2)
    i0 = Wd._find('there can hardly be said')[0]
    wt = [Wd.w[i0 + k]['s'] - a for k in range(len(words))] + [t_line]

    def tip(t):
        if t < hunt_t[0]:
            u = ease_out(clamp((t - t_cens) / 0.55))
            x0, y0, h0 = 2900, 760, 320
            x1, y1, h1 = HUNT[0]
            return x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, h0 + (h1 - h0) * u
        for i in range(len(HUNT) - 1):
            if t < hunt_t[i + 1]:
                u = ease_io((t - hunt_t[i]) / (hunt_t[i + 1] - hunt_t[i]))
                (x0, y0, h0), (x1, y1, h1) = HUNT[i], HUNT[i + 1]
                return x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, h0 + (h1 - h0) * u - 26 * math.sin(math.pi * u)
        x, y, h = HUNT[-1]
        if t >= t_any:                                           # it lifts away, nothing drawn
            u = ease_in(clamp((t - t_any) / 0.7), 2)
            return x + 700 * u, y - 900 * u, h + 500 * u
        return x, y, h

    def frame(t):
        tq = step12(t)
        p = ink(tq)
        if p >= 1.05:
            ink_m = f'<rect x="-100" y="-100" width="{MW + 200}" height="{MH + 200}" fill="#fff"/>'
            wet_m = ''
        else:
            ink_m = f'<path d="{region(p)}" fill="#fff" fill-rule="evenodd" filter="url(#inkblur)"/>'
            wet_m = ink_m + f'<path d="{region(p - 0.03)}" fill="#000" fill-rule="evenodd" filter="url(#inkblur)"/>'
        cz = ''
        # the ink beads along the coast as it arrives
        if t >= t_full - 0.8:
            for k, (bx, by) in enumerate(beads):
                tb = t_full - 0.8 + k * 0.06
                if t >= tb:
                    rr = 9 + 5 * ((k * 7) % 3) / 2
                    cz += g(bx - 4, by, pop(t, tb, 0.3, 2.2), f'<circle r="{rr:.1f}" fill="#6e2316" opacity="0.92"/>'
                                                               f'<circle cx="{-rr * 0.3:.1f}" cy="{-rr * 0.35:.1f}" r="{rr * 0.28:.1f}" fill="{CREAM}" opacity="0.5"/>')
        # the pencil
        if t_cens <= t < t_any + 0.75:
            x, y, h = tip(tq)
            k = 1 + h / 900
            body = pencil()
            cz += (f'<g transform="translate({x + h * 0.7:.1f},{y + h * 0.9:.1f}) rotate(-34)" opacity="0.35" filter="url(#soft4)">'
                   f'<path d="M0,0 L60,-15 L470,-15 L470,15 L60,15 z" fill="#2a1c10"/></g>'
                   f'<g transform="translate({x:.1f},{y:.1f}) rotate(-34) scale({k:.3f})">{body}</g>')
        ov = ''
        # the map's credit, and the Census Office's line typed on a slip
        if t < t_so:
            ov += (f'<rect x="96" y="984" width="1130" height="38" rx="4" fill="{CREAM}" opacity="0.88"/>'
                   + tag(110, 1010, 'DISTRIBUTION OF THE POPULATION, 1890 · STATISTICAL ATLAS, 11TH CENSUS (1898) · LIBRARY OF CONGRESS', 16, PAPER_INK))
        if t_there - 0.15 <= t < t_asfar:
            s = 1.06 - 0.06 * clamp((tq - t_there + 0.15) / 0.17)
            typed = ''
            for k, w in enumerate(words):
                if tq >= wt[k]:
                    n = len(w) if k == len(words) - 1 and tq >= t_line else max(1, int(len(w) * clamp((tq - wt[k]) / max(0.1, min(0.3, wt[k + 1] - wt[k])))))
                    typed += ('' if k == 0 else ' ') + w[:n]
            q = '“' + typed + ('”' if tq >= t_line else '')
            ov += (f'<g transform="translate(960,860) scale({s:.3f}) translate(-960,-860)">'
                   f'<rect x="{QX0}" y="782" width="{QW}" height="150" fill="#000" opacity="0.4" filter="url(#soft4)" transform="translate(6,8)"/>'
                   f'<rect x="{QX0}" y="782" width="{QW}" height="150" fill="{CREAM}" filter="url(#tear)"/>'
                   + text(QX0 + 42, 860, q, 50, 'Elite', INK)
                   + tag(QX0 + 44, 906, 'U.S. CENSUS OFFICE, EXTRA CENSUS BULLETIN NO. 2, 1891', 17, PAPER_INK) + '</g>')
        return {'t': {'CAM': cam.transform(t)}, 'h': {'inkg': ink_m, 'wetg': wet_m, 'cz': cz, 'ov': ov}}
    return S, frame, STEM, a, b


PIECES = {'globe_fence': globe_fence, 'alaska': alaska, 'gold': gold, 'census': census}


if __name__ == '__main__':
    args = sys.argv[1:]
    if args[:1] == ['--still']:
        S, frame, stem, a, b = PIECES[args[1]]()
        S.write(frame)
        ts = [S.dur + float(x) if float(x) < 0 else float(x) for x in args[2:]]
        print('\n'.join(render_stills(S, ts, os.path.join(EP, 'build', 'stills'))))
        sys.exit()
    keys = args or list(PIECES)
    clips = []
    for k in keys:
        S, frame, stem, a, b = PIECES[k]()
        S.write(frame)
        clips.append(encode_mix(S, stem, a, b, os.path.join(S.dir, 'clip.mp4')))
        print('clip', k, round(S.dur, 2), 's', flush=True)
    os.makedirs(OUT, exist_ok=True)
    print('reel', join(clips, os.path.join(OUT, 'ch03_explainers.mp4')))
