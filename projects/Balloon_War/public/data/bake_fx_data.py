"""Bake the small data files for the v2 3D pieces (v2/src/fx/*). Run with python3 -I from anywhere:

    python3 -I bake_fx_data.py <scratch_dir>

<scratch_dir> must already hold uwnd.ascii and vwnd.ascii (see pacific_winds.md for the OPeNDAP URLs); Terrarium tiles are
cached there too. Writes, next to this script:
  pacific_winds.json   NOAA-CIRES-DOE 20CRv3 250 hPa u/v, January 1945 monthly mean, 1 deg grid, plus NE 50m coastlines
                       for the North Pacific slab (lon in 0..360)
  landing_coast.json   NE 50m land for the LandingMap (North America, lon in 0..360 so the Aleutians stay together)
  chiba_hm.json        AWS Terrarium heightmap of the Boso peninsula (Chiba), sea clamped to 0 m, + its 0 m coastline
"""
import io, json, math, os, re, sys, urllib.request
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SCR = sys.argv[1]

# ───────────────────────── coastlines (Natural Earth 1:50m land, public domain) ─────────────────────────
LAND = json.load(open(os.path.join(HERE, 'ne_50m_land.geojson')))

def rings360():
    for f in LAND['features']:
        g = f['geometry']
        polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
        for p in polys:
            r = p[0]
            lons = [x for x, _ in r]
            shift = 360 if max(lons) <= 0 else 0  # NE splits rings at 180, so a whole ring is west or east
            yield [[x + shift if x < 0 and shift else x, y] for x, y in r]

def clip(ring, x0, y0, x1, y1):
    """Sutherland-Hodgman against a rectangle."""
    def side(pts, inside, inter):
        out = []
        for i in range(len(pts)):
            a, b = pts[i - 1], pts[i]
            ia, ib = inside(a), inside(b)
            if ib:
                if not ia: out.append(inter(a, b))
                out.append(b)
            elif ia:
                out.append(inter(a, b))
        return out
    def ix(xc):
        return lambda a, b: [xc, a[1] + (b[1] - a[1]) * (xc - a[0]) / (b[0] - a[0])]
    def iy(yc):
        return lambda a, b: [a[0] + (b[0] - a[0]) * (yc - a[1]) / (b[1] - a[1]), yc]
    pts = ring
    for inside, inter in [(lambda p: p[0] >= x0, ix(x0)), (lambda p: p[0] <= x1, ix(x1)), (lambda p: p[1] >= y0, iy(y0)), (lambda p: p[1] <= y1, iy(y1))]:
        if not pts: break
        pts = side(pts, inside, inter)
    return pts

def thin(r, d):
    out = [r[0]]
    for p in r[1:]:
        if math.hypot(p[0] - out[-1][0], p[1] - out[-1][1]) >= d: out.append(p)
    return out

def coast(bbox, d, min_area):
    x0, y0, x1, y1 = bbox
    out = []
    for r in rings360():
        xs = [p[0] for p in r]; ys = [p[1] for p in r]
        if max(xs) < x0 or min(xs) > x1 or max(ys) < y0 or min(ys) > y1: continue
        c = clip(r, x0, y0, x1, y1)
        if len(c) < 3: continue
        c = thin(c, d)
        if len(c) < 3: continue
        a = 0.5 * abs(sum(c[i - 1][0] * c[i][1] - c[i][0] * c[i - 1][1] for i in range(len(c))))
        if a < min_area: continue
        out.append([[round(x, 3), round(y, 3)] for x, y in c])
    return out

# ───────────────────────── winds (20CRv3) ─────────────────────────
def load(p):
    txt = open(p).read().split('---------------------------------------------', 1)[1]
    a = np.full((5, 2, 66, 161), np.nan)
    for m in re.finditer(r'\[(\d+)\]\[(\d+)\]\[(\d+)\], ([^\n]+)', txt):
        t, l, j = map(int, m.groups()[:3])
        vals = [float(x) for x in m.group(4).split(',') if x.strip()]
        if len(vals) == 161: a[t, l, j, :] = vals
    assert not np.isnan(a).any()
    return a

u = load(os.path.join(SCR, 'uwnd.ascii'))  # [Nov44..Mar45][300, 250 hPa][lat 10..75 N][lon 110..270 E]
v = load(os.path.join(SCR, 'vwnd.ascii'))
T, L = 2, 1  # January 1945, 250 hPa
uu, vv = u[T, L], v[T, L]
wind = {
    'source': 'NOAA-CIRES-DOE Twentieth Century Reanalysis V3 (20CRv3), monthly mean u/v on pressure levels, ensemble mean; '
              'NOAA PSL THREDDS Datasets/20thC_ReanV3/Monthlies/prsMO/{u,v}wnd.mon.mean.nc',
    'month': '1945-01', 'level_hPa': 250, 'units': 'm/s',
    'lat0': 10, 'lon0': 110, 'dlat': 1, 'dlon': 1, 'nlat': 66, 'nlon': 161,
    'max_speed': round(float(np.hypot(uu, vv).max()), 1),
    'u': [round(float(x), 1) for x in uu.flatten()],
    'v': [round(float(x), 1) for x in vv.flatten()],
    'coast_source': 'Natural Earth 1:50m land (public domain), clipped to lon 118..252 E, lat 12..68 N',
    'coast': coast((118, 12, 252, 68), 0.25, 0.3),
}
json.dump(wind, open(os.path.join(HERE, 'pacific_winds.json'), 'w'), separators=(',', ':'))
print('winds', wind['max_speed'], 'm/s max;', len(wind['coast']), 'rings')

landing = {'source': 'Natural Earth 1:50m land (public domain), clipped to lon 160..300 E, lat 14..74 N (lon in 0..360)',
           'coast': coast((160, 14, 300, 74), 0.18, 0.05)}
json.dump(landing, open(os.path.join(HERE, 'landing_coast.json'), 'w'), separators=(',', ':'))
print('landing', len(landing['coast']), 'rings')

# ───────────────────────── Chiba heightmap (AWS Terrarium) ─────────────────────────
URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
def tile_xy(lat, lon, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    r = math.radians(lat)
    return x, (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n
def get_tile(z, x, y):
    p = os.path.join(SCR, f't_{z}_{x}_{y}.png')
    if not os.path.exists(p):
        with urllib.request.urlopen(URL.format(z=z, x=x, y=y), timeout=60) as r: data = r.read()
        open(p, 'wb').write(data)
    a = np.asarray(Image.open(p).convert('RGB')).astype(np.float64)
    return a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
def bake(lat0, lat1, lon0, lon1, z, w, h):
    x0, y0 = tile_xy(lat1, lon0, z); x1, y1 = tile_xy(lat0, lon1, z)
    tx0, ty0, tx1, ty1 = int(x0), int(y0), int(x1), int(y1)
    mos = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256))
    for ty in range(ty0, ty1 + 1):
        for tx in range(tx0, tx1 + 1):
            mos[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = get_tile(z, tx, ty)
    out = np.zeros((h, w))
    for j in range(h):
        lat = lat1 + (lat0 - lat1) * j / (h - 1)
        for i in range(w):
            lon = lon0 + (lon1 - lon0) * i / (w - 1)
            fx, fy = tile_xy(lat, lon, z)
            px, py = (fx - tx0) * 256 - 0.5, (fy - ty0) * 256 - 0.5
            ix_, iy_ = int(math.floor(px)), int(math.floor(py))
            ax, ay = px - ix_, py - iy_
            ix_, iy_ = max(0, min(mos.shape[1] - 2, ix_)), max(0, min(mos.shape[0] - 2, iy_))
            out[j, i] = (mos[iy_, ix_] * (1 - ax) * (1 - ay) + mos[iy_, ix_ + 1] * ax * (1 - ay) + mos[iy_ + 1, ix_] * (1 - ax) * ay + mos[iy_ + 1, ix_ + 1] * ax * ay)
    return out
B = dict(lat0=34.88, lat1=35.86, lon0=139.72, lon1=140.92)
hm = bake(B['lat0'], B['lat1'], B['lon0'], B['lon1'], 11, 240, 236)
sea_min = float(hm.min())
land = np.clip(hm, 0, None)
km_w = (B['lon1'] - B['lon0']) * 111.32 * math.cos(math.radians((B['lat0'] + B['lat1']) / 2))
km_h = (B['lat1'] - B['lat0']) * 110.95
chiba = {'name': 'chiba', 'bounds': B, 'w': 240, 'h': 236, 'kmW': round(km_w, 3), 'kmH': round(km_h, 3), 'min': 0, 'max': round(float(land.max()), 1),
         'sea_min_m': round(sea_min), 'zoom': 11,
         'source': 'AWS Terrarium elevation tiles (Mapzen; SRTM / GEBCO), s3.amazonaws.com/elevation-tiles-prod; sea clamped to 0 m',
         'data': [int(round(x)) for x in land.flatten()]}
json.dump(chiba, open(os.path.join(HERE, 'chiba_hm.json'), 'w'), separators=(',', ':'))
print('chiba', f'{km_w:.0f} x {km_h:.0f} km', 'max', chiba['max'], 'sea min', sea_min)
