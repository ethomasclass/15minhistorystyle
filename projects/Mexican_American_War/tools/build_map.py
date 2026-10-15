"""Build the channel's own vector map for a video: Natural Earth outlines projected (Albers conic) into map
pixels, plus the video's historical regions, written as SVG path data to public/maps/<name>.json for
src/kit/map3d.tsx (the tilted, Vox-style map).

  python3 tools/build_map.py <natural-earth-geojson-dir>

Natural Earth is public domain (naturalearthdata.com). Download these GeoJSON files into one folder first:
  ne_10m_land, ne_10m_lakes, ne_10m_rivers_lake_centerlines, ne_10m_rivers_north_america,
  ne_10m_admin_0_countries, ne_10m_admin_1_states_provinces
(https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/<name>.geojson)

Historical borders are drawn from their legal descriptions (rivers + meridians + parallels), simplified for a
map seen at video scale. Each region's source is noted next to it below.
"""
import json, math, os, sys

NAME = "mex1846"
BBOX = (-126.0, 14.0, -74.0, 45.0)          # lon0, lat0, lon1, lat1 kept on the map
W = 6000                                    # map width in pixels (height follows)
LAT1, LAT2, LAT0, LON0 = 20.0, 40.0, 28.0, -100.0
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

    # rivers by name (both Natural Earth river files; the North America one has the small Texas rivers)
    want = {"Rio Grande": ["Rio Grande", "Grande"], "Nueces": ["Nueces"], "Gila": ["Gila"], "Colorado": ["Colorado"],
            "Sabine": ["Sabine"], "Red": ["Red"], "Arkansas": ["Arkansas"], "Brazos": ["Brazos"], "Pecos": ["Pecos"],
            "Guadalupe": ["Guadalupe"], "San Antonio": ["San Antonio"], "Conchos": ["Conchos", "Rio Conchos"],
            "Mississippi": ["Mississippi"], "Missouri": ["Missouri"], "Sacramento": ["Sacramento"], "San Joaquin": ["San Joaquin"]}
    riv = {k: [] for k in want}
    for f in load(src, "ne_10m_rivers_lake_centerlines") + load(src, "ne_10m_rivers_north_america"):
        nm = (f["properties"].get("name") or "").strip()
        for k, names in want.items():
            if nm in names:
                for g in rings_of(f["geometry"]):
                    if in_box(g, 0) and g not in riv[k]:
                        riv[k].append(g)
    # keep only the North American Colorado / Red / Guadalupe etc. near the region
    riv["Colorado"] = [g for g in riv["Colorado"] if min(p[0] for p in g) < -105]   # the Colorado of the West, not of Texas
    riv["Red"] = [g for g in riv["Red"] if all(-104 < p[0] < -90 and 30 < p[1] < 37 for p in g)]
    riv["Guadalupe"] = [g for g in riv["Guadalupe"] if all(-100 < p[0] < -96 for p in g)]
    riv["San Antonio"] = [g for g in riv["San Antonio"] if all(-100 < p[0] < -96 for p in g)]

    rio = chain(riv["Rio Grande"], (-97.15, 25.95))           # mouth -> source
    nue = chain(riv["Nueces"], (-97.6, 27.85))                # mouth -> source
    gila = chain(riv["Gila"], (-114.6, 32.73))                # mouth (Yuma) -> source
    red = chain(riv["Red"], (-94.0, 33.6))                    # downstream end of the stretch we need -> west
    ark = chain(riv["Arkansas"], (-94.4, 35.4))               # -> source
    sab = chain(riv["Sabine"], (-93.85, 29.75))               # mouth -> north

    def upto(line, pred):
        out = []
        for p in line:
            out.append(p)
            if pred(p): break
        return out

    # The Nueces Strip (claimed by Texas from 1836, by Mexico as Tamaulipas/Coahuila): between the Nueces and the Rio Grande.
    rio_lower = upto(rio, lambda p: p[0] <= -100.9)                       # mouth -> about Del Rio
    strip = nue + rio_lower[::-1]

    # Republic of Texas as claimed, Dec 1836: Rio Grande mouth -> source, north to 42N, then the Adams-Onis line (1819).
    ark_up = [p for p in ark if p[0] <= -100.0]                            # Arkansas from 100W to its source
    red_w = [p for p in red if -100.0 <= p[0] <= -94.04]                  # Red River 94W .. 100W
    sab_up = upto(sab, lambda p: p[1] >= 32.0)
    # Adams-Onis line from the Pacific east and south to the Gulf, in order:
    red_east = sorted(red_w, key=lambda p: p[0])                            # west -> east along the Red
    ark_down = ark_up[::-1]                                                 # source -> 100W
    ao = [(-130.0, 42.0), (-106.3, 42.0)] + ark_down + [(-100.0, 34.56)] + red_east + [(-94.04, 33.55), (-94.04, 32.0)] + sab_up[::-1]
    texas_claim = rio + [(rio[-1][0], 42.0), (-106.3, 42.0)] + ark_down + [(-100.0, 34.56)] + red_east + \
        [(-94.04, 33.55), (-94.04, 32.0)] + sab_up[::-1] + [(-93.5, 27.5), (-97.0, 24.5)]

    # Mexico in 1821-1836: today's Mexico plus everything south of the Adams-Onis line.
    mexico_now = [g for f in load(src, "ne_10m_admin_0_countries") if f["properties"].get("ADM0_A3") == "MEX" for g in rings_of(f["geometry"])]
    mex_north = ao + [(-93.5, 27.0), (-93.5, 24.0), (-130.0, 24.0)]

    # The Mexican Cession (Treaty of Guadalupe Hidalgo, 1848), simplified: 42N, the Texas claim line, the Rio Grande
    # down to El Paso, west along the old New Mexico line to the Gila, down the Gila, then to the Pacific south of San Diego.
    rio_up_from_elpaso = [p for p in rio if p[1] >= 31.75]
    gila_up = [p for p in gila if p[0] <= -108.4] or gila
    cession = [(-130.0, 42.0), (rio[-1][0], 42.0)] + rio_up_from_elpaso[::-1] + [(-108.25, 31.78), (-108.25, gila_up[-1][1])] + \
        gila_up[::-1] + [(-114.72, 32.72), (-117.12, 32.53), (-130.0, 32.53)]
    # The Gadsden Purchase (1853), simplified.
    gadsden = [(-106.53, 31.78), (-108.21, 31.78), (-108.21, 31.33), (-111.07, 31.33), (-114.81, 32.49), (-114.72, 32.72)] + gila_up + [(-108.25, 31.78)]

    states = {}
    for f in load(src, "ne_10m_admin_1_states_provinces"):
        p = f["properties"]
        if p.get("adm0_a3") in ("USA", "MEX") and any(in_box(g, 0) for g in rings_of(f["geometry"])):
            states[f"{p['adm0_a3']}:{p['name']}"] = path(rings_of(f["geometry"]), tol=1.5)

    places = {
        "matamoros": (-97.50, 25.88), "fortTexas": (-97.49, 25.92), "corpusChristi": (-97.40, 27.80), "carricitos": (-97.72, 26.03),
        "sanAntonio": (-98.49, 29.42), "gonzales": (-97.45, 29.50), "goliad": (-97.39, 28.67), "sanJacinto": (-95.08, 29.75),
        "washingtonBrazos": (-96.15, 30.32), "sanFelipe": (-96.10, 29.80), "saltillo": (-101.00, 25.42), "monclova": (-101.42, 26.90),
        "mexicoCity": (-99.13, 19.43), "veracruz": (-96.13, 19.17), "chapultepec": (-99.18, 19.42), "monterrey": (-100.31, 25.67),
        "buenaVista": (-101.04, 25.35), "cerroGordo": (-96.73, 19.45), "zacatecas": (-102.58, 22.77), "santaFe": (-105.94, 35.69),
        "elPaso": (-106.49, 31.76), "sanFrancisco": (-122.42, 37.77), "losAngeles": (-118.24, 34.05), "sanDiego": (-117.16, 32.72),
        "sonoma": (-122.46, 38.29), "coloma": (-120.89, 38.80), "neworleans": (-90.07, 29.95), "havana": (-82.38, 23.13),
        "washingtonDC": (-77.04, 38.90), "springfieldIL": (-89.65, 39.80), "delRio": (-100.90, 29.36), "laredo": (-99.51, 27.51),
        "austin": (-97.74, 30.27), "houston": (-95.37, 29.76), "independence": (-94.42, 39.09),
    }

    out = {
        "name": NAME, "size": [W, H], "bbox": BBOX,
        "proj": {"type": "albers", "lat1": LAT1, "lat2": LAT2, "lat0": LAT0, "lon0": LON0, "k": K, "xmin": XMIN, "ymax": YMAX},
        "land": path(land), "lakes": path(lakes),
        "rivers": {k: path(v, closed=False, tol=0.8) for k, v in riv.items() if v},
        "regions": {
            "nuecesStrip": path([strip]), "texasClaim": path([texas_claim]), "mexicoNorth": path([mex_north]),
            "mexicoNow": path(mexico_now), "cession": path([cession]), "gadsden": path([gadsden]),
        },
        "lines": {"adamsOnis": path([ao], closed=False), "nueces": path([nue], closed=False), "rioGrande": path([rio], closed=False),
                  "rioLower": path([rio_lower], closed=False)},
        "states": states,
        "places": {k: [round(c, 1) for c in px(*v)] for k, v in places.items()},
    }
    dest = os.path.join(os.path.dirname(__file__), "..", "public", "maps", NAME + ".json")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    json.dump(out, open(dest, "w"), separators=(",", ":"))
    print(f"wrote {dest}: {W}x{H}, {os.path.getsize(dest) // 1024} KB; rivers {sorted(out['rivers'])}; "
          f"Rio Grande {len(rio)} pts {rio[0]}..{rio[-1]}, Nueces {len(nue)} pts {nue[0]}..{nue[-1]}, Gila {gila[0]}..{gila[-1]}")


if __name__ == "__main__":
    main(sys.argv[1])
