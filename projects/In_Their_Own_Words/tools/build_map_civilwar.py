"""Build the channel's own vector map for a video: Natural Earth outlines projected (Albers conic) into map
pixels, plus the video's historical regions, written as SVG path data to public/maps/<name>.json for
src/kit/map3d.tsx (the tilted, Vox-style map).

  python3 tools/build_map.py <natural-earth-geojson-dir>

Natural Earth is public domain (naturalearthdata.com). Download these GeoJSON files into one folder first:
  ne_10m_land, ne_10m_lakes, ne_10m_rivers_lake_centerlines, ne_10m_rivers_north_america,
  ne_10m_admin_0_countries, ne_10m_admin_1_states_provinces
(https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/<name>.geojson)

Adapted from The Exact Spot (mex1846) for the Civil War series: 1861 states, the war's rivers, every place the scripts name.
map seen at video scale. Each region's source is noted next to it below.
"""
import json, math, os, sys

NAME = "civwar1861"
BBOX = (-100.0, 24.5, -66.0, 47.5)          # lon0, lat0, lon1, lat1: Texas to Maine, the Gulf to the Great Lakes
W = 6000                                    # map width in pixels (height follows)
LAT1, LAT2, LAT0, LON0 = 29.5, 45.5, 37.5, -84.0
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
            # distance to the chord (or to the point itself when the chord closes a ring)
            d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / L if L > 1e-9 else math.hypot(pts[i][0] - x1, pts[i][1] - y1)
            if d > best:
                best, bi = d, i
        if best > tol:
            keep[bi] = True
            stack += [(a, bi), (bi, b)]
    return [p for p, k in zip(pts, keep) if k]


def in_box(coords, pad=3.0):
    return any(BBOX[0] - pad <= lo <= BBOX[2] + pad and BBOX[1] - pad <= la <= BBOX[3] + pad for lo, la in coords)


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


def chain(segs, start):
    """Order a river's line segments into one line starting nearest `start` (lon, lat)."""
    segs = [list(s) for s in segs]
    d2 = lambda a, b: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2
    # first segment: the one with an endpoint nearest start, oriented away from it
    i = min(range(len(segs)), key=lambda i: min(d2(segs[i][0], start), d2(segs[i][-1], start)))
    s = segs.pop(i)
    line = s if d2(s[0], start) <= d2(s[-1], start) else s[::-1]
    while segs:
        end = line[-1]
        i = min(range(len(segs)), key=lambda i: min(d2(segs[i][0], end), d2(segs[i][-1], end)))
        s = segs[i]
        if min(d2(s[0], end), d2(s[-1], end)) > 0.15 ** 2:
            break
        segs.pop(i)
        line += s[1:] if d2(s[0], end) <= d2(s[-1], end) else s[::-1][1:]
    return line




def main(src):
    land = [g for f in load(src, "ne_10m_land") for g in rings_of(f["geometry"]) if in_box(g, 0)]
    lakes = [g for f in load(src, "ne_10m_lakes") for g in rings_of(f["geometry"]) if in_box(g, 0)]

    # rivers the three Civil War videos name or need (both Natural Earth river files)
    want = {"Mississippi": ["Mississippi"], "Ohio": ["Ohio"], "Missouri": ["Missouri"], "Tennessee": ["Tennessee"],
            "Cumberland": ["Cumberland"], "Potomac": ["Potomac"], "Rappahannock": ["Rappahannock"],
            "Arkansas": ["Arkansas"], "Red": ["Red"], "Savannah": ["Savannah"], "Shenandoah": ["Shenandoah"]}
    riv = {k: [] for k in want}
    for f in load(src, "ne_10m_rivers_lake_centerlines") + load(src, "ne_10m_rivers_north_america"):
        nm = (f["properties"].get("name") or "").strip()
        for k, names in want.items():
            if nm in names:
                for g in rings_of(f["geometry"]):
                    if in_box(g, 0) and g not in riv[k]:
                        riv[k].append(g)
    # the Red River of the South only (Natural Earth has no James River at this scale)
    riv["Red"] = [g for g in riv["Red"] if all(p[1] < 37 for p in g)]

    # the lower Mississippi, Cairo -> the Gulf: the river the Union had to take to cut the Confederacy in two
    miss = chain(riv["Mississippi"], (-89.41, 28.94))                       # mouth -> upstream
    lower = []
    for p in miss:
        lower.append(p)
        if p[1] >= 37.0:
            break

    # Sherman's March to the Sea, Nov 15 - Dec 21, 1864, simplified to one line through the towns his wings passed
    sherman = [(-84.39, 33.75), (-83.86, 33.60), (-83.47, 33.60), (-83.23, 33.08), (-82.81, 32.98),
               (-82.41, 33.00), (-81.94, 32.80), (-81.55, 32.45), (-81.09, 32.08)]

    # Emancipation Proclamation exemptions inside the Confederacy (approximate, for a video-scale map):
    # the 13 named Louisiana parishes around New Orleans, and the Virginia counties named in the Proclamation
    # (Norfolk / Portsmouth / Elizabeth City / York area and the Eastern Shore). West Virginia and Tennessee are
    # exempt too; draw those with the state tiles.
    exempt_la = [(-91.6, 29.5), (-91.3, 30.25), (-90.4, 30.2), (-89.6, 30.05), (-89.3, 29.9), (-89.0, 29.3),
                 (-89.4, 28.9), (-90.4, 29.05), (-91.3, 29.2)]
    exempt_va_tide = [(-76.75, 37.30), (-76.25, 37.30), (-75.95, 36.85), (-75.95, 36.55), (-76.55, 36.55), (-76.75, 36.95)]
    exempt_va_shore = [(-76.05, 37.10), (-75.95, 37.95), (-75.25, 38.03), (-75.55, 37.60), (-75.90, 37.10)]

    def big(ring):
        q = [px(lo, la) for lo, la in ring]
        xs, ys = [a for a, _ in q], [b for _, b in q]
        return (max(xs) - min(xs)) * (max(ys) - min(ys)) > 4000

    def pts(line, tol=1.0):
        return [[round(x, 1), round(y, 1)] for x, y in dp([px(lo, la) for lo, la in line], tol)]

    states = {}
    for f in load(src, "ne_10m_admin_1_states_provinces"):
        p = f["properties"]
        if p.get("adm0_a3") in ("USA", "MEX", "CAN") and any(in_box(g, 3) for g in rings_of(f["geometry"])):
            states[f"{p['adm0_a3']}:{p['name']}"] = path(rings_of(f["geometry"]), tol=1.5)

    places = {
        # capitals and cities
        "washingtonDC": (-77.04, 38.90), "richmond": (-77.44, 37.54), "montgomery": (-86.30, 32.38),
        "charleston": (-79.93, 32.78), "savannah": (-81.09, 32.08), "milledgeville": (-83.23, 33.08),
        "atlanta": (-84.39, 33.75), "baltimore": (-76.61, 39.29), "philadelphia": (-75.17, 39.95), "newYork": (-74.00, 40.71),
        "boston": (-71.06, 42.36), "newOrleans": (-90.07, 29.95), "memphis": (-90.05, 35.15), "nashville": (-86.78, 36.16),
        "chattanooga": (-85.31, 35.05), "cairo": (-89.18, 37.00), "springfieldIL": (-89.65, 39.80), "galveston": (-94.80, 29.30),
        "jacksonMS": (-90.18, 32.30), "norfolk": (-76.29, 36.85), "petersburg": (-77.40, 37.23),
        # forts, battles and events in the three scripts
        "fortSumter": (-79.87, 32.75), "fortWagner": (-79.88, 32.71), "fortMonroe": (-76.31, 37.00),
        "bullRun": (-77.52, 38.81), "antietam": (-77.74, 39.47), "gettysburg": (-77.23, 39.83),
        "vicksburg": (-90.88, 32.35), "portHudson": (-91.27, 30.69), "appomattox": (-78.80, 37.38),
        "andersonville": (-84.14, 32.20), "fordsTheatre": (-77.03, 38.90),
        # blockade stations (the Anaconda Plan's coast)
        "hamptonRoads": (-76.33, 36.97), "capeFear": (-77.95, 33.90), "charlestonBar": (-79.80, 32.70),
        "savannahBar": (-80.85, 32.03), "fernandina": (-81.46, 30.67), "pensacola": (-87.30, 30.33),
        "mobileBay": (-88.03, 30.23), "mississippiMouth": (-89.25, 29.15), "galvestonBar": (-94.72, 29.33),
    }

    out = {
        "name": NAME, "size": [W, H], "bbox": BBOX,
        "proj": {"type": "albers", "lat1": LAT1, "lat2": LAT2, "lat0": LAT0, "lon0": LON0, "k": K, "xmin": XMIN, "ymax": YMAX},
        "land": path(land), "lakes": path(lakes),
        "landMain": path([g for g in land if big(g)]),
        "rivers": {k: path(v, closed=False, tol=0.8) for k, v in riv.items() if v},
        "regions": {
            "exemptLouisiana": path([exempt_la]), "exemptVaTidewater": path([exempt_va_tide]),
            "exemptVaShore": path([exempt_va_shore]),
        },
        "lines": {"lowerMississippi": path([lower], closed=False), "sherman": path([sherman], closed=False)},
        "polylines": {"sherman": pts(sherman), "lowerMississippi": pts(lower, 1.5)},
        "states": states,
        "places": {k: [round(c, 1) for c in px(*v)] for k, v in places.items()},
    }
    dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "maps", NAME + ".json")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    json.dump(out, open(dest, "w"), separators=(",", ":"))
    print(f"wrote {dest}: {W}x{H}, {os.path.getsize(dest) // 1024} KB; rivers {sorted(out['rivers'])}; "
          f"{len(states)} states; lower Mississippi {len(lower)} pts {lower[0]}..{lower[-1]}")


if __name__ == "__main__":
    main(sys.argv[1])
