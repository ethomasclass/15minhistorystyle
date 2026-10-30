"""Coastlines for src/fx/MoneyMap.tsx: Natural Earth 1:50m land (public domain, naturalearthdata.com) clipped to the North
Atlantic world from San Francisco to London, Mercator-projected, simplified, written to coast.json next to this file.

  python3 -I src/fx/moneymap/build_coast.py /path/to/ne_50m_land.geojson

Output: {"bbox": [lon0, lat0, lon1, lat1], "rings": [[[x, y], ...], ...]} with x = lon (deg) and y = Mercator northing in
degrees (so x and y share a scale); rings are closed land outlines clipped to the box (for fills); the coastline is each
ring minus the edges that lie on the box border.
"""
import json, math, os, sys

BBOX = (-132.0, 14.0, 22.0, 63.0)  # lon0, lat0, lon1, lat1
TOL = 0.1  # Douglas-Peucker tolerance, degrees


def merc(lat):
    return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))


def clip(ring, box):
    """Sutherland-Hodgman against an axis-aligned box (x0, y0, x1, y1)."""
    x0, y0, x1, y1 = box
    edges = [(lambda p: p[0] >= x0, lambda a, b: (x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0]))),
             (lambda p: p[0] <= x1, lambda a, b: (x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0]))),
             (lambda p: p[1] >= y0, lambda a, b: (a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0)),
             (lambda p: p[1] <= y1, lambda a, b: (a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1))]
    out = ring
    for inside, cut in edges:
        if not out:
            break
        inp, out = out, []
        prev = inp[-1]
        for cur in inp:
            if inside(cur):
                if not inside(prev):
                    out.append(cut(prev, cur))
                out.append(cur)
            elif inside(prev):
                out.append(cut(prev, cur))
            prev = cur
    return out


def dp(pts, tol):
    if len(pts) < 3:
        return pts
    a, b = pts[0], pts[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    L = math.hypot(dx, dy) or 1e-9
    best, bi = -1, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * (pts[i][0] - a[0]) - dx * (pts[i][1] - a[1])) / L
        if d > best:
            best, bi = d, i
    if best > tol:
        return dp(pts[:bi + 1], tol)[:-1] + dp(pts[bi:], tol)
    return [a, b]


def main(path):
    gj = json.load(open(path))
    box = (BBOX[0], merc(BBOX[1]), BBOX[2], merc(BBOX[3]))
    rings = []
    for feat in gj["features"]:
        g = feat["geometry"]
        polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for poly in polys:
            outer = poly[0]
            lons = [p[0] for p in outer]
            lats = [p[1] for p in outer]
            if max(lons) < BBOX[0] or min(lons) > BBOX[2] or max(lats) < BBOX[1] or min(lats) > BBOX[3]:
                continue
            pts = [(p[0], merc(max(-85, min(85, p[1])))) for p in outer]
            c = clip(pts[:-1], box)
            if len(c) < 3:
                continue
            # a closed ring: split at the point farthest from the start, simplify both halves
            k = max(range(len(c)), key=lambda i: math.hypot(c[i][0] - c[0][0], c[i][1] - c[0][1]))
            c = dp(c[:k + 1], TOL)[:-1] + dp(c[k:] + [c[0]], TOL)
            if len(c) < 4:
                continue
            area = abs(sum(c[i][0] * c[i + 1][1] - c[i + 1][0] * c[i][1] for i in range(len(c) - 1))) / 2
            if area < 0.4:
                continue
            rings.append([[round(x, 2), round(y, 2)] for x, y in c])
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "coast.json")
    json.dump({"bbox": [box[0], box[1], box[2], box[3]], "rings": rings}, open(out, "w"), separators=(",", ":"))
    print(out, len(rings), "rings", sum(len(r) for r in rings), "points")


if __name__ == "__main__":
    main(sys.argv[1])
