"""Build the North Atlantic map for the tilted 3D map (src/kit/map3d.tsx, `MapData`): Natural Earth outlines projected
(Albers conic, centred on mid-ocean) into map pixels, plus the famine-emigration sea routes, written as SVG path data to
public/img/maps/atlantic.json. Used by src/fx/AtlanticMap.tsx (chapter 3, "Coffin Ships and Pumpkins").

  python3 -I tools/build_map_atlantic.py /home/user/ne_data

Adapted from projects/Mexican_American_War/tools/build_map.py. Natural Earth is public domain (naturalearthdata.com).
Download these GeoJSON files into one folder first (kept outside the repo):
  ne_50m_land, ne_50m_lakes, ne_50m_admin_0_boundary_lines_land
(https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/<name>.geojson)

The 1:50m set is plenty at video scale for a whole-ocean map (10m makes a much bigger file for no visible gain).
Land polygons are clipped to a padded box first (Eurasia and North America are single giant rings).

Routes: great-circle legs through a few sea waypoints (south of Newfoundland, around Cape Cod / Sandy Hook, up the
Gulf of St. Lawrence), so the lines arc the way the sailing routes did without crossing land.
"""
import json, math, os, sys

NAME = "atlantic"
BBOX = (-80.0, 35.0, 5.0, 60.0)             # lon0, lat0, lon1, lat1 kept on the map
CLIP = (-100.0, 24.0, 25.0, 72.0)           # land is clipped to this (well outside any camera view)
W = 6000                                    # map width in pixels (height follows)
LAT1, LAT2, LAT0, LON0 = 40.0, 56.0, 47.5, -37.5
TOL = 1.0                                   # simplification tolerance, map pixels

# --- projection ---------------------------------------------------------------------------------------------
r = math.radians
_n = (math.sin(r(LAT1)) + math.sin(r(LAT2))) / 2
_C = math.cos(r(LAT1)) ** 2 + 2 * _n * math.sin(r(LAT1))
_rho = lambda lat: math.sqrt(_C - 2 * _n * math.sin(r(lat))) / _n
_rho0 = _rho(LAT0)


def albers(lon, lat):
    th = _n * r(lon - LON0)
    p = _rho(lat)
    return p * math.sin(th), _rho0 - p * math.cos(th)


_edge = [albers(BBOX[0] + (BBOX[2] - BBOX[0]) * i / 50, lat) for i in range(51) for lat in (BBOX[1], BBOX[3])]
_edge += [albers(lon, BBOX[1] + (BBOX[3] - BBOX[1]) * i / 50) for i in range(51) for lon in (BBOX[0], BBOX[2])]
XMIN, XMAX = min(p[0] for p in _edge), max(p[0] for p in _edge)
YMIN, YMAX = min(p[1] for p in _edge), max(p[1] for p in _edge)
K = W / (XMAX - XMIN)
H = round((YMAX - YMIN) * K)


def px(lon, lat):
    x, y = albers(lon, lat)
    return ((x - XMIN) * K, (YMAX - y) * K)


# --- geometry helpers ---------------------------------------------------------------------------------------
def dp(pts, tol):
    """Douglas-Peucker simplification (iterative)."""
    if len(pts) < 3:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy)
        best, bi = -1, -1
        for i in range(a + 1, b):
            d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / L if L > 1e-9 else math.hypot(pts[i][0] - x1, pts[i][1] - y1)
            if d > best:
                best, bi = d, i
        if best > tol:
            keep[bi] = True
            stack += [(a, bi), (bi, b)]
    return [p for p, k in zip(pts, keep) if k]


def clip_ring(ring, box=CLIP):
    """Sutherland-Hodgman: clip a polygon ring (lon, lat) to an axis-aligned box."""
    x0, y0, x1, y1 = box
    edges = [(lambda p: p[0] >= x0, lambda a, b: _ix(a, b, x0, 0)), (lambda p: p[0] <= x1, lambda a, b: _ix(a, b, x1, 0)),
             (lambda p: p[1] >= y0, lambda a, b: _ix(a, b, y0, 1)), (lambda p: p[1] <= y1, lambda a, b: _ix(a, b, y1, 1))]
    out = list(ring)
    for inside, cut in edges:
        if not out:
            break
        src, out = out, []
        prev = src[-1]
        for cur in src:
            if inside(cur):
                if not inside(prev):
                    out.append(cut(prev, cur))
                out.append(cur)
            elif inside(prev):
                out.append(cut(prev, cur))
            prev = cur
    return out


def _ix(a, b, v, axis):
    t = (v - a[axis]) / (b[axis] - a[axis])
    p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    p[axis] = v
    return p


def in_box(coords, box=CLIP):
    return any(box[0] <= lo <= box[2] and box[1] <= la <= box[3] for lo, la in coords)


def path(rings, closed=True, tol=TOL):
    out = []
    for ring in rings:
        pts = dp([px(lo, la) for lo, la in ring], tol)
        if len(pts) < (3 if closed else 2):
            continue
        out.append("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + ("Z" if closed else ""))
    return "".join(out)


def rings_of(geom):
    t, c = geom["type"], geom["coordinates"]
    if t == "Polygon":
        return c
    if t == "MultiPolygon":
        return [ring for poly in c for ring in poly]
    if t == "LineString":
        return [c]
    if t == "MultiLineString":
        return c
    return []


def load(d, f):
    return json.load(open(os.path.join(d, f + ".geojson")))["features"]


# --- great circles ------------------------------------------------------------------------------------------
def gc(a, b, n=40):
    """Great-circle points from a to b (lon, lat)."""
    def v(p):
        lo, la = r(p[0]), r(p[1])
        return (math.cos(la) * math.cos(lo), math.cos(la) * math.sin(lo), math.sin(la))
    A, B = v(a), v(b)
    om = math.acos(max(-1, min(1, sum(x * y for x, y in zip(A, B)))))
    out = []
    for i in range(n + 1):
        t = i / n
        s1 = math.sin((1 - t) * om) / math.sin(om) if om > 1e-9 else 1 - t
        s2 = math.sin(t * om) / math.sin(om) if om > 1e-9 else t
        x, y, z = (s1 * A[k] + s2 * B[k] for k in range(3))
        out.append((math.degrees(math.atan2(y, x)), math.degrees(math.atan2(z, math.hypot(x, y)))))
    return out


def chaikin(pts, it=2):
    for _ in range(it):
        q = [pts[0]]
        for a, b in zip(pts, pts[1:]):
            q += [(0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]), (0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1])]
        q.append(pts[-1])
        pts = q
    return pts


def route(*stops, n=24):
    """A smooth curve (centripetal Catmull-Rom, in map pixels) through sea waypoints `stops` (lon, lat); the mid-ocean
    stretch is sampled along great circles first so it bends the way a real crossing does."""
    ll = [stops[0]]
    for a, b in zip(stops, stops[1:]):
        ll += gc(a, b, 3 if math.dist(a, b) > 8 else 1)[1:]
    P = [px(*p) for p in ll]
    P = [P[0]] + P + [P[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        def tj(ti, a, b):
            return ti + max(1e-6, math.dist(a, b)) ** 0.5
        t0 = 0.0; t1 = tj(t0, p0, p1); t2 = tj(t1, p1, p2); t3 = tj(t2, p2, p3)
        for k in range(n):
            t = t1 + (t2 - t1) * k / n
            def L(a, b, ta, tb):
                return [(tb - t) / (tb - ta) * a[j] + (t - ta) / (tb - ta) * b[j] for j in (0, 1)]
            A1, A2, A3 = L(p0, p1, t0, t1), L(p1, p2, t1, t2), L(p2, p3, t2, t3)
            B1, B2 = L(A1, A2, t0, t2), L(A2, A3, t1, t3)
            out.append(L(B1, B2, t1, t2))
    out.append(P[-2])
    return [[round(x, 1), round(y, 1)] for x, y in dp(out, 0.5)]


def main(src):
    land = [clip_ring(g) for f in load(src, "ne_50m_land") for g in rings_of(f["geometry"]) if in_box(g)]
    land = [g for g in land if len(g) >= 3]
    lakes = [clip_ring(g) for f in load(src, "ne_50m_lakes") for g in rings_of(f["geometry"]) if in_box(g)]
    lakes = [g for g in lakes if len(g) >= 3]
    # the US-Canada line (as settled by 1842 in the east) for a faint dashed border
    border = [g for f in load(src, "ne_50m_admin_0_boundary_lines_land")
              for g in rings_of(f["geometry"]) if in_box(g, (-85, 40, -60, 50))]

    def area(ring):
        q = [px(lo, la) for lo, la in ring]
        xs, ys = [a for a, _ in q], [b for _, b in q]
        return (max(xs) - min(xs)) * (max(ys) - min(ys))

    def near(ring, lon, lat):
        xs, ys = [p[0] for p in ring], [p[1] for p in ring]
        return min(xs) <= lon <= max(xs) and min(ys) <= lat <= max(ys)

    ireland = [g for g in land if near(g, -8.0, 53.0) and area(g) > 1e4 and not near(g, -2.0, 54.0)]
    britain = [g for g in land if near(g, -2.0, 54.0) and area(g) > 1e4]

    places = {
        "cork": (-8.47, 51.90), "cobh": (-8.30, 51.85), "dublin": (-6.26, 53.35), "liverpool": (-2.98, 53.41),
        "boston": (-71.06, 42.36), "newYork": (-74.01, 40.71), "quebec": (-71.21, 46.81),
        "grosseIle": (-70.67, 47.03), "london": (-0.13, 51.51), "halifax": (-63.57, 44.65), "stJohns": (-52.71, 47.56),
        "ireland": (-8.0, 53.2), "britain": (-1.8, 52.6), "atlantic": (-37.0, 46.5), "america": (-77.5, 42.8),
        "canada": (-73.5, 49.0), "newfoundland": (-56.0, 48.8), "midOcean": (-38.0, 49.0),
    }

    # sea routes, origin -> destination (all leave Ireland round its south coast or through the North Channel / Irish Sea)
    routes = {
        "corkBoston": route((-8.30, 51.82), (-10.6, 51.2), (-30.0, 49.6), (-50.0, 45.2), (-62.0, 42.9), (-68.0, 42.45), (-70.85, 42.35)),
        "corkNewYork": route((-8.30, 51.82), (-11.0, 51.0), (-30.0, 47.2), (-50.0, 42.2), (-66.0, 40.35), (-72.0, 40.25), (-73.95, 40.47)),
        "liverpoolNewYork": route((-3.10, 53.45), (-4.9, 53.0), (-6.0, 52.0), (-10.0, 50.4), (-30.0, 44.8), (-52.0, 40.2), (-68.0, 39.7),
                                  (-73.95, 40.42)),
        "dublinQuebec": route((-6.10, 53.35), (-5.6, 54.2), (-6.4, 55.5), (-10.0, 55.8), (-30.0, 53.5), (-49.5, 47.6), (-55.0, 45.9),
                              (-59.6, 47.3), (-63.6, 48.95), (-66.5, 49.3), (-68.6, 48.55), (-70.6, 47.15), (-71.15, 46.82)),
    }

    out = {
        "name": NAME, "size": [W, H], "bbox": BBOX,
        "proj": {"type": "albers", "lat1": LAT1, "lat2": LAT2, "lat0": LAT0, "lon0": LON0, "k": K, "xmin": XMIN, "ymax": YMAX},
        "land": path(land), "lakes": path(lakes),
        # the mainland and big islands only (what raised slabs clip to)
        "landMain": path([g for g in land if area(g) > 4000]),
        "rivers": {},
        "regions": {"ireland": path(ireland), "britain": path(britain)},
        "lines": {"border": path(border, closed=False, tol=1.2),
                  **{k: "M" + "L".join(f"{x},{y}" for x, y in v) for k, v in routes.items()}},
        "polylines": routes,
        "nations": {},
        "states": {},
        "places": {k: [round(c, 1) for c in px(*v)] for k, v in places.items()},
    }
    dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "img", "maps", NAME + ".json")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    json.dump(out, open(dest, "w"), separators=(",", ":"))
    print(f"wrote {os.path.normpath(dest)}: {W}x{H}, {os.path.getsize(dest) // 1024} KB; land rings {len(land)}, "
          f"ireland {len(ireland)}, britain {len(britain)}, border {len(border)}; routes "
          + ", ".join(f"{k} {len(v)} pts" for k, v in routes.items()))
    for k, v in out["places"].items():
        print(f"  {k:14s} {v}")


if __name__ == "__main__":
    main(sys.argv[1])
