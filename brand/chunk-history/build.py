"""Build the Chunk History logo concepts as clean SVG (no text, no filters).

Run: python3 build.py   (needs shapely). Writes concepts/*.svg.
Colours are the channel palette (brand/palette.json): teal #2FE0C4, coral #FF6F61.
"""
import math
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


# ---------- Tablet family: a black C carved through a broken stone tablet ----------
def carved_c(x0, y0, x1, y1, t, mouth):
    """A C as a hole: a square ring with a mouth narrower than its counter, so the tablet inside the C
    hangs on a neck and reads as the C's inside, not as the middle bar of an E or G."""
    cy = (y0 + y1) / 2
    ring = box(x0, y0, x1, y1).difference(box(x0 + t, y0 + t, x1 - t, y1 - t))
    return chamfer(ring.difference(box(x1 - t - 1, cy - mouth / 2, x1 + 1, cy + mouth / 2)), 6)


def tablet(x0, y0, x1, y1, c=30):
    return chamfer(box(x0, y0, x1, y1), c)


def by_side(geom, cut, side):
    """Break geom along cut; side(piece) -> True puts a fragment in the first group."""
    pieces = parts(geom.difference(cut))
    a = unary_union([p for p in pieces if side(p.representative_point())])
    b = unary_union([p for p in pieces if not side(p.representative_point())])
    return a, b


SQ_C = (56, 56, 200, 200, 38, 34)          # carved C for the square tablet
DIAG = seam((-10, 266), (266, -10), 10)    # 45-degree break, corner to corner
above_diag = lambda c: c.x + c.y < 256


def t1_split():
    """Square tablet, diagonal break, carved C."""
    a, b = by_side(tablet(16, 16, 240, 240).difference(carved_c(*SQ_C)), DIAG, above_diag)
    return [(TEAL, chamfer(a, 3)), (CORAL, chamfer(b, 3))]


def t2_quarter():
    """The top-right quarter cracks off in coral, like a quarter-hour on a clock: one short chunk of the whole."""
    g = tablet(16, 16, 240, 240).difference(carved_c(*SQ_C))
    cx, cy = 128, 128
    cut = unary_union([seam((cx, 0), (cx, cy + 5), 10), seam((cx - 5, cy), (256, cy), 10)])
    q, rest = by_side(g, cut, lambda c: c.x > cx and c.y < cy)
    return [(TEAL, chamfer(rest, 3)), (CORAL, chamfer(q, 3))]


SH_W = 140
SH_X = (256 - SH_W) / 2
SH_TAB = lambda: tablet(SH_X, 8, SH_X + SH_W, 248, 22).difference(carved_c(SH_X + 22, 74, SH_X + SH_W - 22, 182, 30, 28))


def t3_shorts():
    """The tablet in the tall Shorts frame, broken on a 45-degree diagonal."""
    k = SH_X + SH_W / 2 + 128
    a, b = by_side(SH_TAB(), seam((k - 200, 200), (k, 0), 10), lambda c: c.x + c.y < k)
    return [(TEAL, chamfer(a, 3)), (CORAL, chamfer(b, 3))]


def t4_swipe():
    """A Shorts-shaped tablet in three short chunks, like clips in a feed; the one with the C slides in."""
    cut = unary_union([seam((0, 58), (256, 58), 10), seam((0, 198), (256, 198), 10)])
    pieces = parts(SH_TAB().difference(cut))
    grp = lambda lo, hi: unary_union([p for p in pieces if lo <= p.centroid.y < hi])
    return [(TEAL, chamfer(grp(0, 58), 3)), (CORAL, chamfer(affinity.translate(grp(58, 198), 12, 0), 3)),
            (TEAL, chamfer(grp(198, 256), 3))]


def t5_chip():
    """One small chip knocked off the corner: the chunk is short, the tablet is all of history."""
    g = tablet(16, 24, 232, 240).difference(carved_c(52, 60, 196, 204, 38, 34))
    chip, rest = by_side(g, seam((150, 250), (250, 150), 10), lambda c: c.x + c.y > 400)
    return [(TEAL, chamfer(rest, 3)), (CORAL, chamfer(affinity.translate(chip, 10, 4), 3))]


def t6_ticks():
    """Split tablet with four quarter-hour notches cut in its edges: a short, timed piece of history."""
    n = 12
    notches = unary_union([box(128 - n / 2, 8, 128 + n / 2, 34), box(128 - n / 2, 222, 128 + n / 2, 248),
                           box(8, 128 - n / 2, 34, 128 + n / 2)])
    g = tablet(16, 16, 240, 240).difference(carved_c(*SQ_C)).difference(notches)
    a, b = by_side(g, DIAG, above_diag)
    return [(TEAL, chamfer(a, 3)), (CORAL, chamfer(b, 3))]


# ---------- Clock tablets: option 6's dial notches + option 2's quarter-hour ----------
def dial_notches(minor=False, major=(12, 24), small=(8, 14)):
    """Notches where the clock hours meet the tablet's edge (16..240): 12/3/6/9 always, the other eight if minor."""
    out = []
    for h in range(12):
        if h % 3 and not minor:
            continue
        w, dep = major if h % 3 == 0 else small
        a = math.radians(h * 30)
        dx, dy = math.sin(a), -math.cos(a)
        k = 112 / max(abs(dx), abs(dy))           # ray from the centre to the square's edge
        x, y = 128 + dx * k, 128 + dy * k
        if abs(dx) >= abs(dy):                     # left or right edge
            out.append(box(x - dep if dx > 0 else x - 8, y - w / 2, x + 8 if dx > 0 else x + dep, y + w / 2))
        else:                                      # top or bottom edge
            out.append(box(x - w / 2, y - dep if dy > 0 else y - 8, x + w / 2, y + 8 if dy > 0 else y + dep))
    return unary_union(out)


def clock(minor=False, lift=0, five=False, seam_w=10, pivot=False, flip=False):
    g = tablet(16, 16, 240, 240).difference(carved_c(*SQ_C)).difference(dial_notches(minor))
    if pivot:
        g = g.difference(chamfer(box(116, 116, 140, 140), 6))
    cuts = [seam((128, 0), (128, 128 + seam_w / 2), seam_w), seam((128 - seam_w / 2, 128), (256, 128), seam_w)]
    if five:  # the quarter in three five-minute chunks: cracks at 30 and 60 degrees past twelve
        for deg in (30, 60):
            a = math.radians(deg)
            cuts.append(seam((128, 128), (128 + 200 * math.sin(a), 128 - 200 * math.cos(a)), 8))
    q, rest = by_side(g, unary_union(cuts), lambda c: c.x > 128 and c.y < 128)
    if lift:
        q = affinity.translate(q, lift, -lift)
    a, b = (TEAL, CORAL) if not flip else (CORAL, TEAL)
    return [(a, chamfer(rest, 3))] + [(b, chamfer(p, 3)) for p in parts(q)]


def q1_dial():
    """Option 6 completed: all four quarter notches, diagonal break."""
    g = tablet(16, 16, 240, 240).difference(carved_c(*SQ_C)).difference(dial_notches())
    a, b = by_side(g, DIAG, above_diag)
    return [(TEAL, chamfer(a, 3)), (CORAL, chamfer(b, 3))]


def bezel(minor=False, five=False):
    """The coral quarter is only the rim between the edge and the carved C, from 12 to 3; the C stays whole."""
    g = tablet(16, 16, 240, 240).difference(carved_c(*SQ_C)).difference(dial_notches(minor))
    x0, y0, x1, y1 = SQ_C[:4]
    cuts = [seam((128, 0), (128, y0 + 4), 10), seam((x1 - 4, 128), (256, 128), 10),
            seam((x1 + 1, 100), (x1 + 1, 128), 8)]         # free the rim from the upper half of the C's neck
    if five:  # the rim quarter in three five-minute chunks, cracks at exactly 30 and 60 degrees past twelve
        for deg in (30, 60):
            a = math.radians(deg)
            cuts.append(seam((128 + 100 * math.sin(a), 128 - 100 * math.cos(a)),
                             (128 + 200 * math.sin(a), 128 - 200 * math.cos(a)), 8))
    inside = box(x0 - 2, y0 - 2, x1 + 5, y1 + 2)
    q, rest = by_side(g, unary_union(cuts),
                      lambda c: c.x > 128 and c.y < 128 and not inside.contains(c))
    return [(TEAL, chamfer(rest, 3))] + [(CORAL, chamfer(p, 3)) for p in parts(q)]


CLOCKS = [("q1", q1_dial),
          ("q2", lambda: clock()),
          ("q3", lambda: clock(minor=True)),
          ("q4", lambda: bezel()),
          ("q5", lambda: bezel(minor=True)),
          ("q6", lambda: bezel(minor=True, five=True))]


TABLETS = [("t1", t1_split), ("t2", t2_quarter), ("t3", t3_shorts), ("t4", t4_swipe), ("t5", t5_chip), ("t6", t6_ticks)]


# ---------- Wordmark: chunky chamfered caps, cap height 100, stroke 24 ----------
S = 24


def diag(p, q, clip, s=S):
    return LineString([p, q]).buffer(s * 0.62, cap_style=FLAT).intersection(clip)


def letter(ch, s=S, cham=8):
    """Block capital on a 100-unit cap height with stroke s; returns (shape, advance width)."""
    W = 76
    m = (100 - s) / 2  # top of the middle bar
    B = lambda x, y, w, h: box(x, y, x + w, y + h)
    if ch == "C":
        g = unary_union([B(0, 0, W, s), B(0, 0, s, 100), B(0, 100 - s, W, s)])
    elif ch == "H":
        g = unary_union([B(0, 0, s, 100), B(W - s, 0, s, 100), B(0, m, W, s)])
    elif ch == "U":
        g = unary_union([B(0, 0, s, 100), B(W - s, 0, s, 100), B(0, 100 - s, W, s)])
    elif ch == "N":
        W = 82
        g = unary_union([B(0, 0, s, 100), B(W - s, 0, s, 100),
                         diag((W / 2 - 34.64, -10), (W / 2 + 34.64, 110), box(0, 0, W, 100), s)])
    elif ch == "K":
        clip = box(0, 0, W, 100)
        g = unary_union([B(0, 0, s, 100), diag((s, 58), (s + 64, -6), clip, s), diag((s + 10, 40), (s + 70, 104), clip, s)])
    elif ch == "I":
        W = s
        g = B(0, 0, s, 100)
    elif ch == "S":
        g = unary_union([B(0, 0, W, s), B(0, 0, s, m + s), B(0, m, W, s), B(W - s, m, s, 100 - m), B(0, 100 - s, W, s)])
    elif ch == "T":
        g = unary_union([B(0, 0, W, s), B((W - s) / 2, 0, s, 100)])
    elif ch == "O":
        g = B(0, 0, W, 100).difference(B(s, s, W - 2 * s, 100 - 2 * s))
    elif ch == "R":
        clip = box(0, 0, W, 100)
        g = unary_union([B(0, 0, s, 100), B(0, 0, W, s), B(W - s, 0, s, m + s), B(0, m, W, s),
                         diag((s + 6, 50), (W + 10, 112), clip, s)])
    elif ch == "Y":
        clip = box(0, 0, W, m + s)
        g = unary_union([diag((-6, -6), (W / 2 + 4, m + s), clip, s), diag((W + 6, -6), (W / 2 - 4, m + s), clip, s),
                         B((W - s) / 2, m + s - 10, s, 100 - m - s + 10)])
    return chamfer(g, cham), W


def word(text, x=0, track=18, s=S, cham=8):
    shapes = []
    for ch in text:
        g, w = letter(ch, s, cham)
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
    for key, fn in TABLETS + CLOCKS:
        layers = fn()
        write(f"tablet-{key}-symbol.svg", 256, 256, layers, "Chunk History symbol")
        lockup(layers, f"tablet-{key}-lockup.svg")
    wm, ww = wordmark(x0=4, y0=4)
    write("wordmark.svg", int(ww + 16), 112, wm, "Chunk History wordmark")
    print("ok")
