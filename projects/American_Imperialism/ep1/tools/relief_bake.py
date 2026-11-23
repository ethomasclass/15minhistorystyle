# Paper-relief contours for the 3D maps: a heightmap from tools/geo_bake.py (AWS Terrarium: SRTM on land, GEBCO under the
# sea) cut into stacked sheets, one per contour level, as polygons with holes, in map units (1 unit = 10 km, centred).
# Blender (blender/map3d.py) extrudes each level into one sheet of card, so the island reads as layered paper.
#   python3 tools/relief_bake.py assets/geo/oahu_hm.json assets/geo/oahu_relief.json [land_step_m] [sea_step_m] [water.json]
import json, math, sys
import numpy as np
import cv2
import mapbox_earcut as earcut                      # pip install mapbox-earcut: polygons with holes to triangles

src, out = sys.argv[1], sys.argv[2]
LAND_STEP = float(sys.argv[3]) if len(sys.argv) > 3 else 100.0
SEA_STEP = float(sys.argv[4]) if len(sys.argv) > 4 else 400.0
d = json.load(open(src))
w, h = d['w'], d['h']
a = np.array(d['data'], dtype=np.float32).reshape(h, w)
UP = 4                                              # upsample and soften, so the cut edges are smooth curves, not pixels
big = cv2.resize(a, (w * UP, h * UP), interpolation=cv2.INTER_CUBIC)
big = cv2.GaussianBlur(big, (0, 0), 2.4)
sx, sy = d['kmW'] / 10.0 / (w * UP), d['kmH'] / 10.0 / (h * UP)   # map units per upsampled pixel
cx, cy = w * UP / 2, h * UP / 2
WATER = sys.argv[5] if len(sys.argv) > 5 else None
if WATER:                                           # a mapped shoreline (e.g. TIGER water areas) decides land from sea, since
    from PIL import Image, ImageDraw                # the elevation data reads harbors and lochs as a few metres above the sea
    bb = d['bounds']
    W_, H_ = w * UP, h * UP
    toxy = lambda lon, lat: ((lon - bb['lon0']) / (bb['lon1'] - bb['lon0']) * W_, (bb['lat1'] - lat) / (bb['lat1'] - bb['lat0']) * H_)
    im = Image.new('L', (W_, H_), 0)               # land: the islands cut out of the ocean polygon, then every bay, loch and
    dr = ImageDraw.Draw(im)                         # lagoon cut back out of them (and their own islands, like Ford Island, put back)
    shapes = json.load(open(WATER))['shapes']       # largest first; the first is the open ocean round the island
    for r in shapes[0]['rings']:
        if r['hole']:
            dr.polygon([toxy(*p) for p in r['ring']], fill=255)
    for shp in shapes[1:]:
        for r in shp['rings']:
            if not r['hole']:
                dr.polygon([toxy(*p) for p in r['ring']], fill=0)
        for r in shp['rings']:
            if r['hole']:
                dr.polygon([toxy(*p) for p in r['ring']], fill=255)
    water = np.asarray(im) < 128
    big = np.where(water, np.minimum(big, -2.0), np.maximum(big, 2.0))


def rings_at(level):
    m = (big >= level).astype(np.uint8) * 255
    cs, hier = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    shapes = []
    if hier is None:
        return shapes
    hier = hier[0]
    for i, c in enumerate(cs):
        if hier[i][3] != -1:                        # holes are collected with their outer ring
            continue
        if cv2.contourArea(c) < 60:
            continue
        ring = [cv2.approxPolyDP(c, 0.8, True)]
        k = hier[i][2]
        while k != -1:
            if cv2.contourArea(cs[k]) >= 60:
                ring.append(cv2.approxPolyDP(cs[k], 0.8, True))
            k = hier[k][0]
        rings = [[[round((p[0][0] - cx) * sx, 4), round((cy - p[0][1]) * sy, 4)] for p in r] for r in ring if len(r) >= 3]
        flat = np.array([q for r in rings for q in r], dtype=np.float64)
        ends = np.cumsum([len(r) for r in rings]).astype(np.uint32)
        tris = earcut.triangulate_float64(flat, ends).reshape(-1, 3).tolist()   # indices into the rings' points, in order
        shapes.append(dict(rings=rings, tris=tris))
    return shapes


levels = []
lo = math.floor(float(big.min()) / SEA_STEP) * SEA_STEP
z = lo + SEA_STEP
k = 0
while z < 0:                                        # the sea floor shelves, shallowest on top
    levels.append(dict(kind='sea', m=z, shapes=rings_at(z)))
    z += SEA_STEP
z = 0.0
while z < float(big.max()):                         # the land, sheet by sheet
    levels.append(dict(kind='land', m=z, shapes=rings_at(z if z > 0 else 0.5)))
    z += LAND_STEP
json.dump(dict(name=d['name'], bounds=d['bounds'], kmW=d['kmW'], kmH=d['kmH'], w_units=d['kmW'] / 10, h_units=d['kmH'] / 10,
               floor_m=lo, levels=levels, source=d.get('source', '')), open(out, 'w'))
print(out, len(levels), 'levels', sum(len(l['shapes']) for l in levels), 'shapes')
