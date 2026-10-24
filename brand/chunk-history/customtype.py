"""Custom lettering ideas for Chunk History: six styles, each borrowing one part of the Quarter past mark.

Run: python3 customtype.py  -> concepts/wm-f*.svg and customtype.png
"""
import os

from shapely.geometry import box
from shapely.ops import unary_union
from shapely import affinity

from build import TEAL, CORAL, chamfer, seam, by_side, word
from wordmarks import build, board, GAP_WORDS

HERE = os.path.dirname(os.path.abspath(__file__))


def pair(style=None, s=26, W=76, track=18, cham=6, gap=GAP_WORDS, first=None):
    """CHUNK in teal, HISTORY in coral, one line, in a given letter style."""
    a, ea = word("CHUNK", s=s, W=W, track=track, cham=cham, style=style)
    b, _ = word("HISTORY", ea + gap, s=s, W=W, track=track, cham=cham, style=style)
    return [(TEAL, a), (CORAL, b)]


# 1. Tablet cut: every letter trimmed to the tablet's chamfered square, so each letter is a little slab.
def tablet_cut(g, ch, w):
    return chamfer(g.intersection(chamfer(box(0, 0, w, 100), min(20, w * 0.3))), 3)


# 2. Cracked: one 45-degree crack through every letter, at the same place, like the tablet's break.
def cracked(g, ch, w):
    cx = w / 2
    return g.difference(seam((cx - 70, 50 + 70 + 14), (cx + 70, 50 - 70 + 14), 7))


# 3. Dial notches: small notches where 12, 3, 6 and 9 meet each letter's edge.
def notched(g, ch, w):
    n, d = 8, 8
    cuts = [box(w / 2 - n / 2, -1, w / 2 + n / 2, d), box(w / 2 - n / 2, 100 - d, w / 2 + n / 2, 101),
            box(-1, 50 - n / 2, d, 50 + n / 2), box(w - d, 50 - n / 2, w + 1, 50 + n / 2)]
    return g.difference(unary_union(cuts))


# 4. Carved inline: a groove cut into every stroke, like letters chiselled in stone (and a nod to the
#    original logo's retro outlines, without the extra layers).
def inline(g, ch, w):
    groove = g.buffer(-6.5, join_style=2).difference(g.buffer(-10, join_style=2))
    return g.difference(groove)


# 6. Quarter C: the C of CHUNK breaks at 12 o'clock like the mark, and its top-right quarter is coral.
def quarter_c():
    layers = pair(tablet_cut)
    s, W = 26, 76
    c = tablet_cut(chamfer(unary_union([box(0, 0, W, s), box(0, 0, s, 100), box(0, 100 - s, W, 100)]), 6), "C", W)
    q, rest = by_side(c, seam((W / 2, -5), (W / 2, s + 5), 6), lambda p: p.x > W / 2 and p.y < 50)
    a, ea = word("HUNK", W + 18, s=s, style=tablet_cut, cham=6)
    return [(TEAL, unary_union([rest, a])), (CORAL, q), layers[1]]


OPTIONS = [
    ("f1", lambda: pair(tablet_cut), "1  Tablet cut",
     "Every letter trimmed to the tablet's chamfered square, so each one is a small slab."),
    ("f2", lambda: pair(cracked), "2  Cracked",
     "One 45-degree crack through every letter, in the same place: the whole name broken into chunks."),
    ("f3", lambda: pair(notched), "3  Dial notches",
     "Small notches where 12, 3, 6 and 9 meet each letter, borrowed from the dial."),
    ("f4", lambda: pair(inline, s=30), "4  Carved inline",
     "A groove chiselled into every stroke: carved stone, and a nod to your original's retro outlines."),
    ("f5", lambda: pair(tablet_cut, s=20, W=52, track=12, gap=30), "5  Tall poster",
     "Narrow, tall slabs: a history-museum poster, and it fits long thumbnail titles."),
    ("f6", quarter_c, "6  Quarter C",
     "Tablet-cut letters; the C of CHUNK breaks at 12 o'clock like the mark, its top arm the coral quarter."),
]

if __name__ == "__main__":
    build(OPTIONS)
    board(os.path.join(HERE, "customtype.png"), OPTIONS, rowh=300)
    print("ok")
