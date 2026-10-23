"""Build the Sea Islands map for the forty-acres test: the Georgia/South Carolina/Florida coast, the Field Order 15
strip (approximate: land within 30 miles of the sea, from Charleston south to the St. Johns River), Edisto Island,
and a grid of 40-acre plots clipped to the island. Writes public/maps/sea_islands.json for src/kit/map3d.tsx.

  python3 tools/build_sea_islands.py <data-dir>

<data-dir> holds (public domain, U.S. Census Bureau / Natural Earth):
  cb/cb_2018_us_state_500k.*                     https://www2.census.gov/geo/tiger/GENZ2018/shp/cb_2018_us_state_500k.zip
  aw_45019/, aw_45029/ tl_2023_<county>_areawater  https://www2.census.gov/geo/tiger/TIGER2023/AREAWATER/
  ne_10m_rivers_north_america.geojson            natural-earth-vector/geojson
"""
import json, math, os, sys
import shapefile
from shapely.geometry import shape, box, Point, Polygon, MultiPolygon, LineString, MultiLineString
from shapely.ops import unary_union
from shapely import affinity

D = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'maps', 'sea_islands.json')
BBOX = (-88.0, 25.5, -74.5, 37.5)
W = 30000
LAT0 = 31.75
KX = math.cos(math.radians(LAT0))
K = W / ((BBOX[2] - BBOX[0]) * KX)
H = round((BBOX[3] - BBOX[1]) * K)
KM = K / 111.32  # map px per km (north-south)


def proj(g):
    return affinity.affine_transform(g, [KX * K, 0, 0, -K, -BBOX[0] * KX * K, BBOX[3] * K])


def px(lon, lat):
    return [round((lon - BBOX[0]) * KX * K, 1), round((BBOX[3] - lat) * K, 1)]


def ring(coords):
    pts = list(coords)
    return 'M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pts[:-1]) + 'Z'


def path(g, tol=0.8):
    g = g.simplify(tol)
    if g.is_empty:
        return ''
    polys = list(g.geoms) if g.geom_type == 'MultiPolygon' else [g] if g.geom_type == 'Polygon' else []
    out = []
    for p in polys:
        if p.area < 4:
            continue
        out.append(ring(p.exterior.coords))
        out += [ring(i.coords) for i in p.interiors if Polygon(i).area > 4]
    return ''.join(out)


def lines(g, tol=0.8):
    g = g.simplify(tol)
    ls = list(g.geoms) if g.geom_type.startswith('Multi') or g.geom_type == 'GeometryCollection' else [g]
    return ''.join('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in l.coords) for l in ls if l.geom_type == 'LineString' and l.length > 3)


B = box(*BBOX)
r = shapefile.Reader(os.path.join(D, 'cb', 'cb_2018_us_state_500k'))
states = {s.record['STUSPS']: shape(s.shape.__geo_interface__).buffer(0) for s in r.shapeRecords() if s.record['STUSPS'] in ('SC', 'GA', 'FL', 'NC', 'AL', 'TN', 'VA', 'MS', 'KY', 'WV', 'MD', 'DE')}
water = []
for c in ('45019', '45029'):
    rr = shapefile.Reader(os.path.join(D, f'aw_{c}', f'tl_2023_{c}_areawater'))
    water += [shape(s.shape.__geo_interface__).buffer(0) for s in rr.shapeRecords()]
water = unary_union(water)
land_ll = unary_union(list(states.values())).intersection(B).difference(water)
land = proj(land_ll)

# Edisto Island: the land piece containing a point in the middle of the island
pieces = list(land_ll.geoms)
edisto_ll = next(p for p in pieces if p.contains(Point(-80.30, 32.55)))
edisto = proj(edisto_ll)

# Field Order 15 (approximate): land within 30 miles of the open sea, from Charleston south to the St. Johns River
sea = proj(B.difference(unary_union(list(states.values()))))
band = proj(box(-82.3, 30.25, -78.0, 32.80))   # the Atlantic coast only
strip = land.intersection(sea.buffer(30 * 1.609 * KM)).intersection(band)

# rivers (Natural Earth), clipped
rv = json.load(open(os.path.join(D, 'ne_10m_rivers_north_america.geojson')))
rivers = {}
for f in rv['features']:
    if not f['geometry']:
        continue
    g = shape(f['geometry'])
    if g.intersects(B):
        nm = f['properties'].get('name') or f'r{len(rivers)}'
        d = lines(proj(g.intersection(B)), 2.0)
        if d:
            rivers[nm] = rivers.get(nm, '') + d

# 40-acre plots: squares of 402.3 m on a side, clipped to the island, kept if mostly on land
side = 0.4023 * KM
x0, y0, x1, y1 = edisto.bounds
plots = []
gx = x0
while gx < x1:
    gy = y0
    while gy < y1:
        cell = box(gx, gy, gx + side, gy + side)
        part = cell.intersection(edisto)
        if not part.is_empty and part.area > 0.45 * cell.area:
            c = part.centroid
            plots.append({'d': path(part, 0.3), 'c': [round(c.x, 1), round(c.y, 1)]})
        gy += side
    gx += side
# growth order: outward from the landing near the north end of the island, with a little noise
import random
random.seed(4)
ox, oy = px(-80.33, 32.60)
plots.sort(key=lambda p: math.hypot(p['c'][0] - ox, p['c'][1] - oy) + random.random() * side * 3)

data = {
    'size': [W, H], 'land': path(land, 2.0), 'landMain': path(land, 2.0), 'lakes': '',
    'rivers': rivers, 'regions': {'fo15': path(strip, 2.5), 'edisto': path(edisto, 0.6)}, 'lines': {},
    'states': {f'USA:{k}': lines(proj(v.boundary.intersection(B)), 2.0) for k, v in states.items()},
    'places': {'Charleston': px(-79.93, 32.78), 'Savannah': px(-81.09, 32.08), 'Beaufort': px(-80.67, 32.43),
               'St. Johns River': px(-81.45, 30.39), 'Edisto Island': px(-80.30, 32.56), 'Jacksonville': px(-81.66, 30.33)},
    'polylines': {}, 'nations': {}, 'plots': plots, 'km': KM,
}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(data, open(OUT, 'w'), separators=(',', ':'))
print(f'{W}x{H}  {KM:.1f} px/km  plots {len(plots)}  strip area {strip.area / KM**2:.0f} km2  edisto {edisto.area / KM**2:.0f} km2  {os.path.getsize(OUT) // 1024} KB')
