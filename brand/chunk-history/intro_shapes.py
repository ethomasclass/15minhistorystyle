"""Export the Quarter past mark and the Two slabs wordmark as polygons for the 3D intro.

Run: python3 intro_shapes.py  -> intro/src/shapes.json (y up, mark centred on 0,0, 1 unit = 1/256 of the mark)
"""
import json
import os

from shapely.geometry import box
from shapely.ops import unary_union

from build import clock, parts, TEAL, CORAL
from wordmarks import w2_slabs, bounds

HERE = os.path.dirname(os.path.abspath(__file__))


def polys(layers, cx, cy, k):
    out = []
    for col, g in layers:
        for p in parts(g):
            f = lambda cs: [[round((x - cx) * k, 3), round((cy - y) * k, 3)] for x, y in list(cs)[:-1]]
            c = p.centroid
            out.append({"color": col, "outer": f(p.exterior.coords), "holes": [f(r.coords) for r in p.interiors],
                        "cx": round((c.x - cx) * k, 3), "cy": round((cy - c.y) * k, 3), "area": round(p.area * k * k, 1)})
    return out


# the teal splits into chunks along invisible lines (no gap), so the assembled frame is the exact logo
teal, coral = clock()[0][1], unary_union([g for c, g in clock()[1:]])
quads = [box(-1, -1, 128, 128), box(-1, 128, 128, 257), box(128, 128, 257, 257)]
chunks = [(TEAL, teal.intersection(q)) for q in quads] + [(CORAL, coral)]
mark = polys(chunks, 128, 128, 1 / 256)
for i, m in enumerate(mark):
    m["group"] = i
wm = w2_slabs()
x0, y0, x1, y1 = bounds(wm)
wm = polys(wm, (x0 + x1) / 2, (y0 + y1) / 2, 1 / 256)
for m in wm:
    m["group"] = 0 if m["color"] == TEAL else 1
json.dump({"mark": mark, "wordmark": wm, "wordmarkWidth": (x1 - x0) / 256, "wordmarkHeight": (y1 - y0) / 256},
          open(os.path.join(HERE, "intro", "src", "shapes.json"), "w"))
print(len(mark), "mark pieces;", len(wm), "wordmark pieces")
for m in mark: print(m["color"], m["cx"], m["cy"], m["area"])
