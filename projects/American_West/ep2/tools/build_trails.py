"""Ep 2's layer of the series map: cattle trails, the railheads, the Long Walk, the 1868 Great Sioux Reservation and the
places the episode names, in the same projection and pixel space as Ep 1's map (public/img/ch01/west_map.json, built by
ep1/review/build_ch01-03_westmap.py: Albers conic, 4000 px wide). Control points are approximate (lon, lat) along each
route as the period maps draw them; the routes are drawn smooth, so treat them as "about here", like any trail map.

  python3 tools/build_trails.py      # writes public/img/maps/ep2_trails.json
"""
import json, math, os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "img", "maps", "ep2_trails.json")
BBOX = (-127.0, 26.0, -85.0, 50.5)
W = 4000
LAT1, LAT2, LAT0, LON0 = 30.0, 46.0, 38.0, -106.0
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


def px(lon, lat):
    x, y = albers(lon, lat)
    return [round((x - XMIN) * K, 1), round((YMAX - y) * K, 1)]


PLACES = {
    "sanAntonio": (-98.49, 29.42), "austin": (-97.74, 30.27), "fortWorth": (-97.33, 32.75), "abilene": (-97.21, 38.92),
    "dodgeCity": (-100.02, 37.75), "sedalia": (-93.23, 38.70), "kansasCity": (-94.58, 39.10), "ogallala": (-101.72, 41.13),
    "fortBelknap": (-98.67, 33.15), "horsehead": (-102.27, 31.24), "fortSumner": (-104.24, 34.47), "denver": (-104.99, 39.74),
    "cheyenne": (-104.82, 41.14), "canyonDeChelly": (-109.50, 36.13), "fortDefiance": (-109.07, 35.74),
    "albuquerque": (-106.65, 35.08), "deadwood": (-103.73, 44.38), "blackHills": (-103.70, 44.00), "fortLaramie": (-104.56, 42.21),
    "helena": (-112.03, 46.59), "medora": (-103.52, 46.91), "dekalb": (-88.75, 41.93), "chicago": (-87.63, 41.88),
    "piedrasNegras": (-100.52, 28.70), "fortSmith": (-94.40, 35.39), "redRiverStation": (-97.78, 33.85),
    "doansCrossing": (-99.33, 34.43), "lead": (-103.77, 44.35),
}
LINES = {
    # the cattle trails (ch 3), each from south Texas north
    "chisholm": [(-98.49, 29.42), (-97.74, 30.27), (-97.15, 31.55), (-97.33, 32.75), (-97.78, 33.85), (-97.96, 34.50),
                 (-97.95, 35.53), (-97.88, 36.40), (-97.61, 37.03), (-97.34, 37.69), (-97.21, 38.92)],
    "western": [(-99.07, 29.73), (-99.14, 30.05), (-99.43, 31.83), (-99.30, 32.72), (-99.26, 33.59), (-99.33, 34.43),
                (-99.45, 35.50), (-99.57, 36.57), (-100.02, 37.75), (-100.80, 39.30), (-101.72, 41.13)],
    "shawnee": [(-98.49, 29.42), (-97.74, 30.27), (-97.15, 31.55), (-96.80, 32.78), (-96.70, 33.90), (-95.90, 34.80),
                (-95.25, 35.80), (-94.73, 37.02), (-94.10, 37.90), (-93.23, 38.70)],
    "goodnightLoving": [(-98.67, 33.15), (-99.80, 32.20), (-100.90, 31.50), (-102.27, 31.24), (-103.20, 32.20),
                        (-103.90, 33.40), (-104.24, 34.47), (-104.90, 35.60), (-104.40, 36.99), (-104.61, 38.25),
                        (-104.99, 39.74), (-104.82, 41.14)],
    # the railroads the trails ran to (ch 2): the Union Pacific Eastern Division (Kansas Pacific) to Abilene by 1867,
    # on to Denver by 1870; the Santa Fe to Dodge City, 1872
    "kansasPacific": [(-94.58, 39.10), (-95.68, 39.05), (-96.83, 39.03), (-97.21, 38.92), (-97.61, 38.84), (-99.33, 38.88),
                      (-101.80, 38.90), (-103.40, 39.30), (-104.99, 39.74)],
    "santaFe": [(-95.68, 39.05), (-96.18, 38.40), (-97.35, 38.05), (-97.93, 38.06), (-99.10, 38.20), (-100.02, 37.75)],
    "kcToChicago": [(-94.58, 39.10), (-92.30, 39.60), (-91.40, 40.40), (-89.60, 41.40), (-87.63, 41.88)],
    # the Long Walk (ch 4): Fort Defiance → Fort Wingate → Albuquerque → east to Fort Sumner (one of the routes)
    "longWalk": [(-109.07, 35.74), (-108.55, 35.48), (-107.60, 35.20), (-106.65, 35.08), (-106.10, 34.90), (-105.40, 34.75),
                 (-104.24, 34.47)],
    # the escape south (ch 5): central Texas to the Rio Grande at Piedras Negras
    "southToMexico": [(-97.74, 30.27), (-98.49, 29.42), (-99.50, 29.00), (-100.52, 28.70)],
    # the miners' arrow into the Black Hills (ch 6): from the Union Pacific at Cheyenne
    "toTheHills": [(-104.82, 41.14), (-104.56, 42.21), (-104.10, 43.40), (-103.73, 44.38)],
    # Custer's 1874 route (approximate): Fort Abraham Lincoln → the Hills → back
    "custer1874": [(-100.85, 46.77), (-102.40, 45.90), (-103.60, 44.90), (-103.70, 44.00), (-103.30, 44.60), (-101.80, 45.70),
                   (-100.85, 46.77)],
}
# the 1868 Great Sioux Reservation (Fort Laramie Treaty, Article 2), simplified: today's South Dakota west of the Missouri
REGIONS = {
    "greatSioux1868": [(-104.05, 45.94), (-100.65, 45.94), (-100.50, 45.40), (-100.40, 44.60), (-99.90, 44.20),
                       (-99.40, 43.50), (-98.50, 43.00), (-104.05, 43.00)],
    "blackHills": [(-104.05, 44.55), (-103.60, 44.70), (-103.20, 44.45), (-103.15, 43.95), (-103.40, 43.55),
                   (-103.85, 43.50), (-104.05, 43.75)],
}

out = {"note": "Ep 2 layer, same pixel space as west_map.json (4000 px wide); approximate routes",
       "places": {k: px(*v) for k, v in PLACES.items()},
       "lines": {k: [px(*p) for p in v] for k, v in LINES.items()},
       "regions": {k: [px(*p) for p in v] for k, v in REGIONS.items()}}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(out, open(OUT, "w"), indent=1)
# sanity: Ep 1's own Chicago and Denver should land where Ep 1 put them
print("chicago", out["places"]["chicago"], "denver", out["places"]["denver"])
