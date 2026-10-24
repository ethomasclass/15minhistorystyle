"""Build the 1861-65 United States base map for Ep 1 ch02/ch03 (Union / Confederacy, Sherman's march).
Writes public/maps/us1861.json for src/kit/map3d.tsx. States are closed polygons (for slabs), keyed 'USA:<Name>' so
the kit's UNION_FREE_1861 / BORDER_1861 / CONFEDERACY_1861 lists work.

  python3 build_us1861.py <ne-dir (land, rivers)> <dir with ne_10m_lakes + boundary lines> <cb dir> <out.json>

Sources (public domain): U.S. Census Bureau cartographic boundaries 2018 (states, 1:500k); Natural Earth 10m land,
lakes, rivers, land boundary lines.
"""
import json, math, os, sys
import shapefile
from shapely.geometry import shape, box, Polygon, LineString, MultiLineString
from shapely.ops import unary_union, transform

NE, NE2, CB, OUT = sys.argv[1:5]
BBOX = (-128.0, 18.0, -52.0, 58.0)
W = 7000
LAT1, LAT2, LAT0, LON0 = 29.5, 45.5, 37.5, -96.0
r = math.radians
_n = (math.sin(r(LAT1)) + math.sin(r(LAT2))) / 2
_C = math.cos(r(LAT1)) ** 2 + 2 * _n * math.sin(r(LAT1))
_rho = lambda lat: math.sqrt(_C - 2 * _n * math.sin(r(lat))) / _n
_rho0 = _rho(LAT0)


def albers(lon, lat):
    th = _n * r(lon - LON0)
    p = _rho(lat)
    return p * math.sin(th), _rho0 - p * math.cos(th)


_edge = [albers(BBOX[0] + (BBOX[2] - BBOX[0]) * i / 60, lat) for i in range(61) for lat in (BBOX[1], BBOX[3])]
_edge += [albers(lon, BBOX[1] + (BBOX[3] - BBOX[1]) * i / 60) for i in range(61) for lon in (BBOX[0], BBOX[2])]
XMIN, XMAX = min(p[0] for p in _edge), max(p[0] for p in _edge)
YMIN, YMAX = min(p[1] for p in _edge), max(p[1] for p in _edge)
K = W / (XMAX - XMIN)
H = round((YMAX - YMIN) * K)


def px(lon, lat):
    x, y = albers(lon, lat)
    return [round((x - XMIN) * K, 1), round((YMAX - y) * K, 1)]


def _tx(xs, ys, zs=None):
    pts = [albers(x, y) for x, y in zip(xs, ys)]
    return tuple((p[0] - XMIN) * K for p in pts), tuple((YMAX - p[1]) * K for p in pts)


def proj(g):
    return transform(_tx, g)


def ring(coords):
    pts = list(coords)
    return 'M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pts[:-1]) + 'Z'


def path(g, tol=1.0, minarea=6):
    g = g.simplify(tol)
    if g.is_empty:
        return ''
    polys = list(g.geoms) if g.geom_type in ('MultiPolygon', 'GeometryCollection') else [g]
    out = []
    for p in polys:
        if p.geom_type != 'Polygon' or p.area < minarea:
            continue
        out.append(ring(p.exterior.coords))
        out += [ring(i.coords) for i in p.interiors if Polygon(i).area > minarea]
    return ''.join(out)


def lines(g, tol=1.2, minlen=4):
    g = g.simplify(tol)
    ls = list(g.geoms) if g.geom_type.startswith('Multi') or g.geom_type == 'GeometryCollection' else [g]
    return ''.join('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in l.coords) for l in ls if l.geom_type == 'LineString' and l.length > minlen)


B = box(*BBOX)
land_ll = unary_union([shape(f['geometry']).buffer(0) for f in json.load(open(os.path.join(NE, 'ne_10m_land.geojson')))['features']]).intersection(B)
lakes_ll = unary_union([shape(f['geometry']).buffer(0) for f in json.load(open(os.path.join(NE2, 'ne_10m_lakes.geojson')))['features']
                        if f['properties'].get('scalerank', 9) <= 3 and shape(f['geometry']).intersects(B)]).intersection(B)
land = proj(land_ll.difference(lakes_ll))
lakes = proj(lakes_ll)

rd = shapefile.Reader(os.path.join(CB, 'cb_2018_us_state_500k'))
skip = {'AK', 'HI', 'PR', 'VI', 'GU', 'MP', 'AS'}
states_ll = {s.record['NAME']: shape(s.shape.__geo_interface__).buffer(0) for s in rd.shapeRecords() if s.record['STUSPS'] not in skip}
states = {k: proj(v) for k, v in states_ll.items()}

U = lambda names: unary_union([states[n] for n in names])
FREE = ['Maine', 'New Hampshire', 'Vermont', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New York', 'New Jersey', 'Pennsylvania', 'Ohio',
        'Indiana', 'Illinois', 'Michigan', 'Wisconsin', 'Iowa', 'Minnesota', 'California', 'Oregon', 'Kansas']
BORDER = ['Delaware', 'Maryland', 'Kentucky', 'Missouri']
CONF = ['South Carolina', 'Mississippi', 'Florida', 'Alabama', 'Georgia', 'Louisiana', 'Texas', 'Virginia', 'West Virginia', 'Arkansas', 'North Carolina', 'Tennessee']

rv = json.load(open(os.path.join(NE, 'ne_10m_rivers_lake_centerlines.geojson')))
rivers = {}
for f in rv['features']:
    if not f['geometry'] or (f['properties'].get('scalerank') or 9) > 6:
        continue
    g = shape(f['geometry'])
    if g.intersects(B):
        nm = f['properties'].get('name') or f'r{len(rivers)}'
        d = lines(proj(g.intersection(B)), 2.0, 8)
        if d:
            rivers[nm] = rivers.get(nm, '') + d

bl = json.load(open(os.path.join(NE2, 'ne_10m_admin_0_boundary_lines_land.geojson')))
intl = unary_union([shape(f['geometry']) for f in bl['features'] if 'United States' in (f['properties'].get('ADM0_LEFT') or '') + (f['properties'].get('ADM0_RIGHT') or '')
                    or 'United States' in json.dumps(f['properties'])]).intersection(B)

PL = {'Atlanta': (-84.39, 33.75), 'Savannah': (-81.09, 32.08), 'Milledgeville': (-83.23, 33.08), 'Millen': (-81.95, 32.80), 'Charleston': (-79.93, 32.78),
      'Washington': (-77.04, 38.90), 'Richmond': (-77.44, 37.54), 'Columbia': (-81.03, 34.00), 'New Orleans': (-90.07, 29.95), 'Edisto Island': (-80.30, 32.56),
      'Jacksonville': (-81.66, 30.33)}
data = {
    'size': [W, H], 'land': path(land, 1.6), 'landMain': path(land, 1.6), 'lakes': path(lakes, 1.2),
    'rivers': rivers,
    'regions': {'union': path(U(FREE + BORDER), 1.4), 'free': path(U(FREE), 1.4), 'border': path(U(BORDER), 1.4), 'confed': path(U(CONF), 1.4),
                'us': path(unary_union(list(states.values())), 1.4)},
    'lines': {'intl': lines(proj(intl), 1.5)},
    'states': {f'USA:{k}': path(v, 1.2) for k, v in states.items()},
    'places': {k: px(*v) for k, v in PL.items()},
    'polylines': {}, 'nations': {}, 'km': K / 111.32 * 1.0,
}
json.dump(data, open(OUT, 'w'), separators=(',', ':'))
print(W, H, os.path.getsize(OUT) // 1024, 'KB', len(data['states']), 'states', len(rivers), 'rivers', data['places'])
