"""Bake small heightmaps for the Mesa / LoopingRide 3D pieces from the public AWS Terrarium tiles.

    python3 -I bake_heightmap.py <tile_cache_dir>

Terrarium: height_m = (R*256 + G + B/256) - 32768 (Mapzen/AWS "elevation-tiles-prod", public, no key).
Writes, next to this script:
  mesa.json / mesa.png      the diamond field close-up (Diamond Field flat, GNIS 40.9930 N 108.8437 W; Diamond Peak
                            40.9504 N 108.8780 W; CO-WY line at 41 N)
  region.json / region.png  zoomed out to Rawlins, WY (41.7911 N 107.2387 W)
JSON: {name, bounds{lat0,lat1,lon0,lon1}, w, h, kmW, kmH, min, max, source, data:[h rows north->south, west->east, metres]}
"""
import io, json, math, os, sys, urllib.request
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = sys.argv[1]
URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'

def tile_xy(lat, lon, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    r = math.radians(lat)
    y = (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n
    return x, y

def get_tile(z, x, y):
    p = os.path.join(CACHE, f'{z}_{x}_{y}.png')
    if not os.path.exists(p):
        with urllib.request.urlopen(URL.format(z=z, x=x, y=y), timeout=60) as r:
            data = r.read()
        with open(p, 'wb') as f:
            f.write(data)
    a = np.asarray(Image.open(p).convert('RGB')).astype(np.float64)
    return a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768

def bake(name, lat0, lat1, lon0, lon1, z, w, h):
    # tile range (lat1 is north)
    x0, y0 = tile_xy(lat1, lon0, z)
    x1, y1 = tile_xy(lat0, lon1, z)
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
            ix, iy = int(math.floor(px)), int(math.floor(py))
            ax, ay = px - ix, py - iy
            ix, iy = max(0, min(mos.shape[1] - 2, ix)), max(0, min(mos.shape[0] - 2, iy))
            v = (mos[iy, ix] * (1 - ax) * (1 - ay) + mos[iy, ix + 1] * ax * (1 - ay) + mos[iy + 1, ix] * (1 - ax) * ay + mos[iy + 1, ix + 1] * ax * ay)
            out[j, i] = v
    km_w = (lon1 - lon0) * 111.32 * math.cos(math.radians((lat0 + lat1) / 2))
    km_h = (lat1 - lat0) * 110.95
    mn, mx = float(out.min()), float(out.max())
    meta = {'name': name, 'bounds': {'lat0': lat0, 'lat1': lat1, 'lon0': lon0, 'lon1': lon1}, 'w': w, 'h': h,
            'kmW': round(km_w, 3), 'kmH': round(km_h, 3), 'min': round(mn, 1), 'max': round(mx, 1), 'zoom': z,
            'source': 'AWS Terrarium elevation tiles (Mapzen; SRTM/USGS NED), s3.amazonaws.com/elevation-tiles-prod',
            'data': [int(round(v)) for v in out.flatten()]}
    with open(os.path.join(HERE, f'{name}.json'), 'w') as f:
        json.dump(meta, f, separators=(',', ':'))
    Image.fromarray(((out - mn) / (mx - mn) * 255).astype(np.uint8)).save(os.path.join(HERE, f'{name}.png'))
    print(name, w, h, f'{km_w:.1f} x {km_h:.1f} km', f'{mn:.0f}-{mx:.0f} m')

bake('mesa', 40.930, 41.050, -108.960, -108.770, 13, 200, 160)
bake('region', 40.780, 41.960, -109.180, -106.980, 10, 240, 168)
