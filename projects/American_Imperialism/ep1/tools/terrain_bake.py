# A continuous terrain grid for the 3D maps (blender/terrain3d.py): the heightmap from tools/geo_bake.py (AWS Terrarium:
# SRTM on land, GEBCO under the sea), upsampled and lightly smoothed, with the shoreline taken from a mapped coastline
# (U.S. Census TIGER water areas, as in relief_bake.py) so harbors and lochs sit below sea level and the land above it.
#   python3 tools/terrain_bake.py assets/geo/oahu_hm.json assets/geo/oahu_water.json assets/geo/oahu_terrain.npz [up] [blur]
import json, sys
import numpy as np
import cv2
from PIL import Image, ImageDraw

src, water_p, out = sys.argv[1], sys.argv[2], sys.argv[3]
UP = int(sys.argv[4]) if len(sys.argv) > 4 else 2
BLUR = float(sys.argv[5]) if len(sys.argv) > 5 else 1.2
d = json.load(open(src))
w, h = d['w'], d['h']
a = np.array(d['data'], dtype=np.float32).reshape(h, w)
W_, H_ = w * UP, h * UP
big = cv2.GaussianBlur(cv2.resize(a, (W_, H_), interpolation=cv2.INTER_CUBIC), (0, 0), BLUR)

bb = d['bounds']
toxy = lambda lon, lat: ((lon - bb['lon0']) / (bb['lon1'] - bb['lon0']) * W_, (bb['lat1'] - lat) / (bb['lat1'] - bb['lat0']) * H_)
SS = 4                                               # the mask is drawn 4x finer, then averaged: a soft, exact shoreline
im = Image.new('L', (W_ * SS, H_ * SS), 0)
dr = ImageDraw.Draw(im)
shapes = json.load(open(water_p))['shapes']
sc = lambda p: (p[0] * SS, p[1] * SS)
for r in shapes[0]['rings']:
    if r['hole']:
        dr.polygon([sc(toxy(*p)) for p in r['ring']], fill=255)
for shp in shapes[1:]:
    for r in shp['rings']:
        if not r['hole']:
            dr.polygon([sc(toxy(*p)) for p in r['ring']], fill=0)
    for r in shp['rings']:
        if r['hole']:
            dr.polygon([sc(toxy(*p)) for p in r['ring']], fill=255)
land = np.asarray(im.resize((W_, H_), Image.BOX), dtype=np.float32) / 255.0      # 0 sea .. 1 land, fractional on the coast

# land rises from the shore: at least a few metres inland, a shelf just below the water off it, real depth further out
z = np.where(land > 0.5, np.maximum(big, 2.0 + 12.0 * (land - 0.5)), np.minimum(big, -1.5 - 6.0 * (0.5 - land)))
np.savez_compressed(out, z=z.astype(np.float32), land=land.astype(np.float16), kmW=d['kmW'], kmH=d['kmH'],
                    bounds=json.dumps(bb), source=d.get('source', ''))
print(out, z.shape, float(z.min()), float(z.max()))


# ---- the mesh for Blender (its Python has no numpy): raw float32 vertices and colours, int32 quads, and a small JSON header
import os
EXAG, SEA_K, SEA_MAX = 3.0, 0.5, 1600.0             # vertical exaggeration on land; the sea floor shallower and clipped
WU, HU = d['kmW'] / 10, d['kmH'] / 10               # map units: 1 = 10 km
BASE = -SEA_MAX * SEA_K / 10000 * EXAG - 0.03


def lin(hx):
    c = [int(hx[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return np.array([((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c])


def ramp(v, stops):
    xs_ = np.array([s_ for s_, _ in stops], dtype=np.float64)
    cs = np.array([lin(c) for _, c in stops])
    return np.stack([np.interp(v, xs_, cs[:, k]) for k in range(3)], -1)


H2, W2 = z.shape
zz = np.where(z >= 0, z * EXAG / 10000, -np.minimum(-z, SEA_MAX) * SEA_K * EXAG / 10000)
zz[0, :] = zz[-1, :] = zz[:, 0] = zz[:, -1] = BASE   # the edges drop to the base: a clean cut slab
X, Y = np.meshgrid((np.arange(W2) / (W2 - 1) - 0.5) * WU, (0.5 - np.arange(H2) / (H2 - 1)) * HU)
verts = np.stack([X, Y, zz], -1).reshape(-1, 3).astype(np.float32)
ii = np.arange(H2 * W2).reshape(H2, W2)
quads = np.stack([ii[:-1, :-1], ii[1:, :-1], ii[1:, 1:], ii[:-1, 1:]], -1).reshape(-1, 4).astype(np.int32)
# colours by height: sea floor slate to shallow teal-grey; land coral warming to a pale top, a little darker where steep
LAND_STOPS = [(0, '#b8433c'), (150, '#cf5a4f'), (500, '#e27b6d'), (900, '#f0a191'), (1250, '#f8c9bb')]
SEA_STOPS = [(-1600, '#1b2d2e'), (-400, '#3c5f5e'), (-60, '#6f9995'), (0, '#9cc0b8')]
col = np.where((z >= 0)[..., None], ramp(z, LAND_STOPS), ramp(z, SEA_STOPS))
gy, gx = np.gradient(z * EXAG, 70.0 / UP)
slope = np.clip(np.hypot(gx, gy) / 2.5, 0, 1)
col = col * (1 - 0.28 * slope[..., None] * (z >= 0)[..., None])
col = np.concatenate([col.reshape(-1, 3), np.ones((H2 * W2, 1))], 1).astype(np.float32)
stem = os.path.splitext(out)[0]
verts.tofile(stem + '_verts.f32'); quads.tofile(stem + '_quads.i32'); col.tofile(stem + '_cols.f32')
json.dump(dict(w=W2, h=H2, wu=WU, hu=HU, base=BASE, exag=EXAG, bounds=bb, source=d.get('source', '')), open(stem + '_mesh.json', 'w'))
print('mesh', stem, verts.shape, quads.shape)
