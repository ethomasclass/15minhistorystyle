"""Bake small, sourced data files for drawn 3D pieces (src/fx/), from The Balloon War v2 (its full baker, with the NOAA 20CRv3
wind field read over OPeNDAP, is projects/Balloon_War/public/data/bake_fx_data.py; its sources are written up in fx_data.md
beside it: do the same for every piece, and say on screen what the data is, e.g. "winds: January 1945 monthly mean").

  python3 tools/geo_bake.py coast public/data/pacific_coast.json --bbox=118,12,252,68 [--thin=0.25] [--min-area=0.3] [--land=PATH]
      Natural Earth 1:50m land (public domain; download ne_50m_land.geojson from naturalearthdata.com or the
      nvkelso/natural-earth-vector repo into public/data/) clipped to lon0,lat0,lon1,lat1 with longitudes in 0..360 (so a
      Pacific map stays in one piece; use -180..180 bounds as 180..360 for the Americas). Feed it to mapgeo.tsx MapTop.
  python3 tools/geo_bake.py heightmap public/data/coast_hm.json --name=coast --bbox=34.88,35.86,139.72,140.92 --w=240 --h=236 [--zoom=11] [--sea]
      AWS Terrarium elevation tiles (Mapzen; SRTM/GEBCO/NED, s3.amazonaws.com/elevation-tiles-prod) resampled to a w x h grid
      over lat0,lat1,lon0,lon1, in metres; --sea clamps the sea to 0 m (a coastline). Feed it to terrain.tsx buildTerrain.
      Tiles are cached in out/tiles/. Keep w x h small (a few hundred): the JSON is bundled into the video.
"""
import json, math, os, sys, urllib.request
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, '..', 'out', 'tiles')

# ───────────────────────── coastlines (Natural Earth 1:50m land) ─────────────────────────
def rings360(LAND):
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

def coast(LAND, bbox, d, min_area):
    x0, y0, x1, y1 = bbox
    out = []
    for r in rings360(LAND):
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

# ───────────────────────── heightmaps (AWS Terrarium) ─────────────────────────
URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
def tile_xy(lat, lon, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    r = math.radians(lat)
    return x, (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n
def get_tile(z, x, y):
    p = os.path.join(CACHE, f't_{z}_{x}_{y}.png')
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


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    o = dict((a[2:].split('=', 1) + [''])[:2] for a in sys.argv[1:] if a.startswith('--'))
    if len(args) != 2:
        sys.exit(__doc__)
    kind, out = args
    if kind == 'coast':
        land = json.load(open(o.get('land') or os.path.join(HERE, '..', 'public', 'data', 'ne_50m_land.geojson')))
        bbox = tuple(float(x) for x in o['bbox'].split(','))
        rings = coast(land, bbox, float(o.get('thin', 0.2)), float(o.get('min-area', 0.05)))
        json.dump({'source': f'Natural Earth 1:50m land (public domain), clipped to lon {bbox[0]}..{bbox[2]}, lat {bbox[1]}..{bbox[3]} (lon in 0..360)',
                   'bbox': bbox, 'coast': rings}, open(out, 'w'), separators=(',', ':'))
        print(out, len(rings), 'rings')
    elif kind == 'heightmap':
        os.makedirs(CACHE, exist_ok=True)
        lat0, lat1, lon0, lon1 = (float(x) for x in o['bbox'].split(','))
        z, w, h = int(o.get('zoom', 11)), int(o['w']), int(o['h'])
        hm = bake(lat0, lat1, lon0, lon1, z, w, h)
        if 'sea' in o:
            hm = np.clip(hm, 0, None)
        km_w = (lon1 - lon0) * 111.32 * math.cos(math.radians((lat0 + lat1) / 2))
        km_h = (lat1 - lat0) * 110.95
        res = {'name': o.get('name', os.path.basename(out).split('.')[0]), 'bounds': dict(lat0=lat0, lat1=lat1, lon0=lon0, lon1=lon1), 'w': w, 'h': h,
               'kmW': round(km_w, 3), 'kmH': round(km_h, 3), 'min': round(float(hm.min()), 1), 'max': round(float(hm.max()), 1), 'zoom': z,
               'source': 'AWS Terrarium elevation tiles (Mapzen; SRTM / GEBCO / USGS NED), s3.amazonaws.com/elevation-tiles-prod' + ('; sea clamped to 0 m' if 'sea' in o else ''),
               'data': [int(round(x)) for x in hm.flatten()]}
        json.dump(res, open(out, 'w'), separators=(',', ':'))
        print(out, f'{km_w:.0f} x {km_h:.0f} km', res['min'], '-', res['max'], 'm')
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main()
