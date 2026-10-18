"""Build the Chunk History logo concepts as clean SVG (no text, no filters).

Run: python3 build.py   (needs shapely). Writes concepts/*.svg.
Colours are the channel palette (brand/palette.json): teal #2FE0C4, coral #FF6F61.
"""
import os
from shapely.geometry import Polygon, LineString, MultiPolygon, box
from shapely.ops import unary_union
from shapely import affinity

TEAL, CORAL, INK = "#2FE0C4", "#FF6F61", "#111111"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "concepts")
MITRE, BEVEL, FLAT = 2, 3, 2


def chamfer(geom, c):
    """45-degree chamfer of leg c on every convex corner; concave corners stay sharp."""
    return geom.buffer(-c, join_style=MITRE, mitre_limit=10).buffer(c, join_style=BEVEL)


def seam(p, q, g):
    """A cut of width g along p-q, extended past both ends."""
    return LineString([p, q]).buffer(g / 2, cap_style=FLAT)


def parts(geom):
    return list(geom.geoms) if isinstance(geom, MultiPolygon) else [geom]


def d(geom):
    out = []
    for poly in parts(geom):
        for ring in [poly.exterior, *poly.interiors]:
            pts = list(ring.coords)[:-1]
            out.append("M" + " L".join(f"{x:.1f} {y:.1f}".replace(".0 ", " ").replace(".0", "") + "" for x, y in pts) + " Z")
    return " ".join(out)


def svg(w, h, layers, title):
    body = "\n".join(f'  <path fill="{col}" fill-rule="evenodd" d="{d(g)}"/>' for col, g in layers if not g.is_empty)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" '
            f'aria-labelledby="title">\n  <title id="title">{title}</title>\n{body}\n</svg>\n')


def write(name, w, h, layers, title):
    with open(os.path.join(OUT, name), "w") as f:
        f.write(svg(w, h, layers, title))


def mono(layers, col):
    return [(col, unary_union([g for _, g in layers]))]


# ---------- Concept A: the segmented C, rebuilt on a grid ----------
# Outer square 24..232, stroke 64, opening 88..168, outer corners chamfered 24.
C_OUTER = Polygon([(208, 24), (232, 48), (232, 88), (88, 88), (88, 168), (232, 168), (232, 208),
                   (208, 232), (48, 232), (24, 208), (24, 48), (48, 24)])


def concept_a():
    g = 10
    cuts = unary_union([seam((10, 10), (100, 100), g), seam((10, 246), (100, 156), g),   # mitred corners
                        seam((160, 0), (160, 100), g), seam((160, 156), (160, 256), g),  # split each bar
                        seam((0, 128), (100, 128), g)])                                  # split the stem
    pieces = sorted(parts(chamfer(C_OUTER.difference(cuts), 4)), key=lambda p: p.centroid.coords[0])
    # walk the C from the top end to the bottom end and alternate colours
    order = sorted(pieces, key=lambda p: _walk(p.centroid))
    return [(TEAL if i % 2 == 0 else CORAL, p) for i, p in enumerate(order)]


def _walk(pt):
    x, y = pt.x, pt.y
    if y < 88 and x > 60:
        return 0 if x > 160 else 1
    if y > 168 and x > 60:
        return 5 if x > 160 else 4
    return 2 if y < 128 else 3


# ---------- Concept B: seven blocks, one chunk lifted out ----------
def concept_b():
    size, gap, x0, y0, lift = 64, 12, 13, 27, 14
    cells = [(0, 0), (1, 0), (0, 1), (0, 2), (1, 2), (2, 2)]
    blk = lambda c, r, dx=0, dy=0: chamfer(box(x0 + c * (size + gap) + dx, y0 + r * (size + gap) + dy,
                                              x0 + c * (size + gap) + size + dx, y0 + r * (size + gap) + size + dy), 10)
    return [(TEAL, unary_union([blk(c, r) for c, r in cells])), (CORAL, blk(2, 0, lift, -lift))]


# ---------- Concept C: the C broken into two chunks ----------
def concept_c():
    crack = seam((8, 200), (104, 104), 12)  # 45 degrees, across the stem only
    top, bottom = sorted(parts(C_OUTER.difference(crack)), key=lambda g: g.centroid.y)
    return [(TEAL, chamfer(top, 4)), (CORAL, chamfer(bottom, 4))]


# ---------- Wordmark: chunky chamfered caps, cap height 100, stroke 24 ----------
S = 24


def diag(p, q, clip):
    return LineString([p, q]).buffer(S * 0.62, cap_style=FLAT).intersection(clip)


def letter(ch):
    W = 76
    B = lambda x, y, w, h: box(x, y, x + w, y + h)
    if ch == "C":
        g = unary_union([B(0, 0, W, S), B(0, 0, S, 100), B(0, 100 - S, W, S)])
    elif ch == "H":
        g = unary_union([B(0, 0, S, 100), B(W - S, 0, S, 100), B(0, 38, W, S)])
    elif ch == "U":
        g = unary_union([B(0, 0, S, 100), B(W - S, 0, S, 100), B(0, 100 - S, W, S)])
    elif ch == "N":
        W = 82
        g = unary_union([B(0, 0, S, 100), B(W - S, 0, S, 100),
                         diag((W / 2 - 34.64, -10), (W / 2 + 34.64, 110), box(0, 0, W, 100))])
    elif ch == "K":
        clip = box(0, 0, W, 100)
        g = unary_union([B(0, 0, S, 100), diag((S, 58), (S + 64, -6), clip), diag((S + 10, 40), (S + 70, 104), clip)])
    elif ch == "I":
        W = S
        g = B(0, 0, S, 100)
    elif ch == "S":
        g = unary_union([B(0, 0, W, S), B(0, 0, S, 62), B(0, 38, W, S), B(W - S, 38, S, 62), B(0, 100 - S, W, S)])
    elif ch == "T":
        g = unary_union([B(0, 0, W, S), B((W - S) / 2, 0, S, 100)])
    elif ch == "O":
        g = B(0, 0, W, 100).difference(B(S, S, W - 2 * S, 100 - 2 * S))
    elif ch == "R":
        clip = box(0, 0, W, 100)
        g = unary_union([B(0, 0, S, 100), B(0, 0, W, S), B(W - S, 0, S, 62), B(0, 38, W, S),
                         diag((30, 50), (W + 10, 112), clip)])
    elif ch == "Y":
        clip = box(0, 0, W, 62)
        g = unary_union([diag((-6, -6), (W / 2 + 4, 62), clip), diag((W + 6, -6), (W / 2 - 4, 62), clip),
                         B((W - S) / 2, 52, S, 48)])
    return chamfer(g, 8), W


def word(text, x=0, track=18):
    shapes = []
    for ch in text:
        g, w = letter(ch)
        shapes.append(affinity.translate(g, x, 0))
        x += w + track
    return unary_union(shapes), x - track


def wordmark(x0=0, y0=0, scale=1.0, shadow=5):
    a, end = word("CHUNK")
    b, end2 = word("HISTORY", end + 44)
    t = lambda g, dx=0, dy=0: affinity.translate(affinity.scale(g, scale, scale, origin=(0, 0)), x0 + dx, y0 + dy)
    sh = shadow * scale
    return [(CORAL, t(a, sh, sh)), (TEAL, t(b, sh, sh)), (TEAL, t(a)), (CORAL, t(b))], end2 * scale


def lockup(mark_layers, name):
    W = 1120
    wm, ww = wordmark(scale=1.0)
    wm = [(c, affinity.translate(g, (W - ww) / 2, 316)) for c, g in wm]
    mk = [(c, affinity.translate(affinity.scale(g, 1.1, 1.1, origin=(0, 0)), (W - 256 * 1.1) / 2, 0)) for c, g in mark_layers]
    write(name, W, 430, mk + wm, "Chunk History logo")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for key, fn in [("a", concept_a), ("b", concept_b), ("c", concept_c)]:
        layers = fn()
        write(f"concept-{key}-symbol.svg", 256, 256, layers, "Chunk History symbol")
        write(f"concept-{key}-symbol-black.svg", 256, 256, mono(layers, "#000000"), "Chunk History symbol")
        lockup(layers, f"concept-{key}-lockup.svg")
    wm, ww = wordmark(x0=4, y0=4)
    write("wordmark.svg", int(ww + 16), 112, wm, "Chunk History wordmark")
    print("ok")
