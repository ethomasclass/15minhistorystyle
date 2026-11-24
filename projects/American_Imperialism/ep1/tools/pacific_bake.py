# The Pacific relief for the 3D map shots (blender/mapshots.py, join 8): AWS Terrarium elevation (SRTM on land, GEBCO
# under the sea; tiles fetched and cached by tools/geo_bake.py) over a Pacific-centred box that crosses the date line,
# resampled to an equirectangular grid in the wall map's projection (tools/pacmap.py), the shoreline from the same
# Natural Earth 1:50m coast as the wall map (assets/geo/pacific_coast.json), so the relief lies exactly under the map.
# Writes the same raw mesh files as tools/terrain_bake.py (verts, quads, colours, a JSON header) plus the map UV frame.
#   python3 tools/pacific_bake.py assets/geo/pacific_terrain [zoom=5] [step_deg=0.15]
# Map units: 1 = 10 km at the latitude of Honolulu (x), true km in y; the origin is lon 202 E, lat 21.3 N (the H8 frame
# centre). Land and sea floor share one vertical exaggeration (EXAG), the sea floor clipped at SEA_MAX.
import json, math, os, sys
import numpy as np
import cv2
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import geo_bake  # noqa: E402  (its get_tile fetches and caches Terrarium tiles in out/tiles)

stem = sys.argv[1]
Z = int(sys.argv[2]) if len(sys.argv) > 2 else 5
STEP = float(sys.argv[3]) if len(sys.argv) > 3 else 0.1
LON0, LON1, LAT0, LAT1 = 150.0, 254.0, -16.0, 58.0          # lon in 0..360 (the frame is lon 157..247, lat -7.8..50.4)
LONC, LATC = 202.0, 21.3
KX = 111.32 * math.cos(math.radians(LATC)) / 10              # map units per degree of longitude
KY = 110.95 / 10                                              # map units per degree of latitude
EXAG, SEA_MAX = 12.0, 6500.0
os.makedirs(geo_bake.CACHE, exist_ok=True)

lons = np.arange(LON0, LON1 + 1e-6, STEP)
lats = np.arange(LAT1, LAT0 - 1e-6, -STEP)                    # north to south (image rows)
W, H = len(lons), len(lats)
n = 2 ** Z
r = np.radians(lats)
fy = (1 - np.log(np.tan(r) + 1 / np.cos(r)) / np.pi) / 2 * n
# a continuous mosaic over tile columns (unwrapped), each column fetched as x mod n
gx = (lons + 180) / 360 * n                                   # unwrapped tile x (lon 150..254 -> 29.3..38.6 at z5)
tx0, tx1 = int(math.floor(gx.min())), int(math.floor(gx.max()))
ty0, ty1 = int(math.floor(fy.min())), int(math.floor(fy.max()))
mos = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256))
for ty in range(ty0, ty1 + 1):
    for tx in range(tx0, tx1 + 1):
        mos[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = geo_bake.get_tile(Z, tx % n, ty)
px = ((gx - tx0) * 256 - 0.5).astype(np.float32)
py = ((fy - ty0) * 256 - 0.5).astype(np.float32)
mx, my = np.meshgrid(px, py)
hm = cv2.remap(mos.astype(np.float32), mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
hm = cv2.GaussianBlur(hm, (0, 0), 0.8)
print('heights', hm.shape, float(hm.min()), float(hm.max()))

# the shoreline from the wall map's own coastline, drawn 4x finer and averaged
SS = 4
coast = json.load(open(os.path.join(HERE, '..', 'assets', 'geo', 'pacific_coast.json')))['coast']
im = Image.new('L', (W * SS, H * SS), 0)
dr = ImageDraw.Draw(im)
for ring in coast:
    pts = [((lo % 360 - LON0) / STEP * SS + SS / 2, (LAT1 - la) / STEP * SS + SS / 2) for lo, la in ring]
    if len(pts) > 2:
        dr.polygon(pts, fill=255)
land = np.asarray(im.resize((W, H), Image.BOX), dtype=np.float32) / 255.0
z = np.where(land > 0.5, np.maximum(hm, 20.0 + 200.0 * (land - 0.5)), np.minimum(hm, -20.0 - 200.0 * (0.5 - land)))
z = np.maximum(z, -SEA_MAX)

# Hawaiʻi (the subject) is coral; every other shore is the wall map's cream
LO, LA = np.meshgrid(lons, lats)
hawaii = (LO > 199.0) & (LO < 206.5) & (LA > 18.4) & (LA < 23.2)


def lin(hx):
    c = [int(hx[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return np.array([((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c])


def ramp(v, stops):
    xs_ = np.array([s_ for s_, _ in stops], dtype=np.float64)
    cs = np.array([lin(c) for _, c in stops])
    return np.stack([np.interp(v, xs_, cs[:, k]) for k in range(3)], -1)


CORAL = [(0, '#b8433c'), (300, '#cf5a4f'), (1200, '#e27b6d'), (2500, '#f0a191'), (4000, '#f8c9bb')]
CREAM = [(0, '#c9b78f'), (400, '#d8c7a0'), (1500, '#e6d8b5'), (3000, '#f2e8cf'), (4500, '#faf5e8')]
SEA = [(-6500, '#142426'), (-5000, '#1b2d2e'), (-3500, '#284242'), (-2000, '#3c5f5e'), (-600, '#557d7b'), (-100, '#6f9995'), (0, '#8fb5ae')]
col = np.where((z >= 0)[..., None], np.where(hawaii[..., None], ramp(z, CORAL), ramp(z, CREAM)), ramp(z, SEA))
gy, gx_ = np.gradient(z * EXAG, STEP * 111000.0)
slope = np.clip(np.hypot(gx_, gy) / 2.5, 0, 1)
col = col * (1 - 0.25 * slope[..., None] * (z >= 0)[..., None])

zz = z * EXAG / 10000.0
BASE = -SEA_MAX * EXAG / 10000.0 - 0.6
zz[0, :] = zz[-1, :] = zz[:, 0] = zz[:, -1] = BASE
X, Y = np.meshgrid((lons - LONC) * KX, (lats - LATC) * KY)
verts = np.stack([X, Y, zz], -1).reshape(-1, 3).astype(np.float32)
ii = np.arange(H * W).reshape(H, W)
quads = np.stack([ii[:-1, :-1], ii[1:, :-1], ii[1:, 1:], ii[:-1, 1:]], -1).reshape(-1, 4).astype(np.int32)
col = np.concatenate([col.reshape(-1, 3), np.ones((H * W, 1))], 1).astype(np.float32)
verts.tofile(stem + '_verts.f32'); quads.tofile(stem + '_quads.i32'); col.tofile(stem + '_cols.f32')
WU, HU = (LON1 - LON0) * KX, (LAT1 - LAT0) * KY
json.dump(dict(w=W, h=H, wu=WU, hu=HU, base=BASE, exag=EXAG, kx=KX, ky=KY, lonc=LONC, latc=LATC,
               bounds=dict(lon0=LON0, lon1=LON1, lat0=LAT0, lat1=LAT1), centre=[(LON0 + LON1) / 2, (LAT0 + LAT1) / 2],
               mapbox=[95, -50, 300, 68],
               source='AWS Terrarium elevation tiles (Mapzen; SRTM / GEBCO), s3.amazonaws.com/elevation-tiles-prod; '
                      'coast: Natural Earth 1:50m land (public domain)'), open(stem + '_mesh.json', 'w'))
print(stem, W, H, 'verts', len(verts), 'base', BASE)
