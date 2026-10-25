"""The West series map used by ch01-ch03 (public/img/ch01/west_map.json): Natural Earth 1:50m outlines (public domain),
Albers conic for the trans-Mississippi West, clipped to a box, plus the two 1860s lines from town control points and
the approximate 1851 Fort Laramie treaty hunting grounds. Read by src/kit/ch01_extra.tsx (WestMap).

  python3 review/build_ch01-03_westmap.py <dir with ne_50m_land/lakes/rivers_lake_centerlines/admin_1_states_provinces_lakes .geojson>
"""
import json, math, os, sys

NE = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "img", "ch01", "west_map.json")
BBOX = (-127.0, 26.0, -85.0, 50.5)
W = 4000
LAT1, LAT2, LAT0, LON0 = 30.0, 46.0, 38.0, -106.0
TOL = 1.2
r = math.radians
_n = (math.sin(r(LAT1)) + math.sin(r(LAT2))) / 2
_C = math.cos(r(LAT1)) ** 2 + 2 * _n * math.sin(r(LAT1))
_rho = lambda lat: math.sqrt(_C - 2 * _n * math.sin(r(lat))) / _n
_rho0 = _rho(LAT0)


def albers(lon, lat):
    th = _n * r(lon - LON0)
    p = _rho(lat)
    return p * math.sin(th), _rho0 - p * math.cos(th)


edge = [albers(BBOX[0] + (BBOX[2] - BBOX[0]) * i / 50, la) for i in range(51) for la in (BBOX[1], BBOX[3])]
edge += [albers(lo, BBOX[1] + (BBOX[3] - BBOX[1]) * i / 50) for i in range(51) for lo in (BBOX[0], BBOX[2])]
XMIN, XMAX = min(p[0] for p in edge), max(p[0] for p in edge)
YMIN, YMAX = min(p[1] for p in edge), max(p[1] for p in edge)
K = W / (XMAX - XMIN)
H = round((YMAX - YMIN) * K)


def px(lon, lat):
    x, y = albers(lon, lat)
    return ((x - XMIN) * K, (YMAX - y) * K)


def dp(pts, tol):
    if len(pts) < 3:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    st = [(0, len(pts) - 1)]
    while st:
        a, b = st.pop()
        (x1, y1), (x2, y2) = pts[a], pts[b]
        L = math.hypot(x2 - x1, y2 - y1) or 1e-9
        best, bi = 0, -1
        for i in range(a + 1, b):
            d = abs((x2 - x1) * (y1 - pts[i][1]) - (x1 - pts[i][0]) * (y2 - y1)) / L
            if d > best:
                best, bi = d, i
        if best > tol:
            keep[bi] = True
            st += [(a, bi), (bi, b)]
    return [p for p, k in zip(pts, keep) if k]


PAD = 300
BOX = (-PAD, -PAD, W + PAD, H + PAD)


def clip(poly):
    """Sutherland-Hodgman against BOX."""
    def side(pts, inside, inter):
        out = []
        for i in range(len(pts)):
            a, b = pts[i - 1], pts[i]
            if inside(b):
                if not inside(a):
                    out.append(inter(a, b))
                out.append(b)
            elif inside(a):
                out.append(inter(a, b))
        return out
    x0, y0, x1, y1 = BOX
    lx = lambda X: (lambda p: p[0] >= X if X == x0 else p[0] <= X, lambda a, b: (X, a[1] + (b[1] - a[1]) * (X - a[0]) / (b[0] - a[0])))
    ly = lambda Y: (lambda p: p[1] >= Y if Y == y0 else p[1] <= Y, lambda a, b: (a[0] + (b[0] - a[0]) * (Y - a[1]) / (b[1] - a[1]), Y))
    for f in (lx(x0), lx(x1), ly(y0), ly(y1)):
        if not poly:
            return poly
        poly = side(poly, *f)
    return poly


def rings(geom):
    if geom["type"] == "Polygon":
        return geom["coordinates"]
    if geom["type"] == "MultiPolygon":
        return [r_ for p in geom["coordinates"] for r_ in p]
    return []


def lines(geom):
    if geom["type"] == "LineString":
        return [geom["coordinates"]]
    if geom["type"] == "MultiLineString":
        return geom["coordinates"]
    return []


def near(lonlat):
    lo, la = lonlat
    return BBOX[0] - 8 < lo < BBOX[2] + 8 and BBOX[1] - 6 < la < BBOX[3] + 6


def poly_d(rs):
    out = []
    for ring in rs:
        if not any(near(p) for p in ring):
            continue
        raw = [px(*p) for p in ring if near(p)]
        m = len(raw) // 2
        pts = clip(dp(raw[:m + 1], TOL) + dp(raw[m:], TOL)[1:])  # a closed ring: simplify its two halves
        if len(pts) >= 3:
            out.append("M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + " Z")
    return " ".join(out)


def line_d(ls):
    out = []
    for ln in ls:
        seg = [px(*p) for p in ln if near(p)]
        seg = dp(seg, TOL)
        if len(seg) >= 2:
            out.append("M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in seg))
    return " ".join(out)


load = lambda n: json.load(open(os.path.join(NE, n + ".geojson")))["features"]
land = poly_d([r_ for f in load("ne_50m_land") for r_ in rings(f["geometry"])])
lakes = poly_d([r_ for f in load("ne_50m_lakes") for r_ in rings(f["geometry"])])
rivers = {}
for f in load("ne_50m_rivers_lake_centerlines"):
    nm = f["properties"].get("name")
    if nm in ("Missouri", "Mississippi", "Colorado", "Snake", "Columbia", "Arkansas", "Rio Grande", "Sacramento"):
        d = line_d(lines(f["geometry"]))
        if d:
            rivers[nm] = (rivers.get(nm, "") + " " + d).strip()
states = {}
for f in load("ne_50m_admin_1_states_provinces_lakes"):
    p = f["properties"]
    if p.get("adm0_a3") not in ("USA", "CAN", "MEX"):
        continue
    d = poly_d(rings(f["geometry"]))
    if d:
        states[f"{p['adm0_a3']}:{p['name']}"] = d

LL = {
    "sacramento": (-121.49, 38.58), "omaha": (-95.94, 41.26), "promontory": (-112.55, 41.62), "donner": (-120.33, 39.32),
    "cheyenne": (-104.82, 41.14), "saltLake": (-111.89, 40.76), "chicago": (-87.63, 41.88), "sanFrancisco": (-122.42, 37.77),
    "newOrleans": (-90.07, 29.95), "elPaso": (-106.49, 31.76), "sanDiego": (-117.16, 32.72), "northPlatte": (-100.77, 41.12),
    "denver": (-104.99, 39.74), "stLouis": (-90.2, 38.63), "reno": (-119.81, 39.53), "powderRiver": (-106.0, 44.3),
}
UP = [(-95.94, 41.26), (-97.37, 41.43), (-99.08, 40.70), (-100.77, 41.12), (-102.26, 40.99), (-102.98, 41.14), (-104.82, 41.14),
      (-105.40, 41.13), (-105.59, 41.31), (-107.24, 41.79), (-109.47, 41.53), (-110.96, 41.27), (-111.44, 40.97), (-111.97, 41.22), (-112.55, 41.62)]
CP = [(-121.49, 38.58), (-120.95, 39.10), (-120.33, 39.32), (-120.18, 39.33), (-119.81, 39.53), (-119.28, 39.63), (-118.47, 40.18),
      (-117.74, 40.97), (-116.93, 40.64), (-116.10, 40.71), (-115.76, 40.83), (-114.96, 41.11), (-113.12, 41.74), (-112.55, 41.62)]
# 1850s Pacific Railroad Survey corridors, simplified: one northern (Chicago - South Pass - Sacramento), one southern (32nd parallel)
NORTH = [(-87.63, 41.88), (-91.5, 41.7), (-95.94, 41.26), (-100.8, 41.1), (-104.56, 42.2), (-108.9, 42.35), (-111.89, 40.76),
         (-115.8, 40.8), (-119.8, 39.5), (-121.49, 38.58), (-122.42, 37.77)]
SOUTH = [(-90.07, 29.95), (-93.75, 32.5), (-96.8, 32.8), (-101.9, 32.0), (-106.49, 31.76), (-110.97, 32.22), (-114.62, 32.69), (-117.16, 32.72)]
# approximate 1851 Fort Laramie treaty territories of the Lakota (Sioux), Cheyenne and Arapaho, merged and simplified
HUNT = [(-100.6, 46.8), (-104.0, 46.5), (-106.8, 45.0), (-107.1, 43.0), (-106.5, 42.3), (-105.6, 41.0), (-105.2, 39.5), (-104.9, 38.1),
        (-102.0, 37.9), (-100.2, 38.4), (-100.8, 40.0), (-101.4, 41.3), (-101.0, 42.8), (-100.4, 44.0), (-100.3, 45.6)]

to_px = lambda pts: [[round(x, 1), round(y, 1)] for x, y in (px(*p) for p in pts)]
data = dict(size=[W, H], land=land, lakes=lakes, rivers=rivers, states=states,
            places={k: [round(c, 1) for c in px(*v)] for k, v in LL.items()},
            polylines=dict(up=to_px(UP), cp=to_px(CP), north=to_px(NORTH), south=to_px(SOUTH), hunt=to_px(HUNT)))
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(data, open(OUT, "w"), separators=(",", ":"))
print(OUT, W, H, os.path.getsize(OUT) // 1024, "KB", len(states), "states")
