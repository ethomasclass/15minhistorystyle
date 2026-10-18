"""Wordmark options for Chunk History, each paired with the chosen Quarter past mark.

Run: python3 wordmarks.py  -> concepts/wm-*.svg and wordmarks.png
"""
import io
import math
import os

import cairosvg
from PIL import Image, ImageDraw
from shapely.geometry import box
from shapely.ops import unary_union
from shapely import affinity

from build import (TEAL, CORAL, OUT, S, chamfer, seam, parts, by_side, word, write, clock)
from board import font, wrap, INK

HERE = os.path.dirname(os.path.abspath(__file__))
GAP_WORDS = 44


def t(g, dx=0, dy=0, k=1.0):
    return affinity.translate(affinity.scale(g, k, k, origin=(0, 0)), dx, dy)


def bounds(layers):
    return unary_union([g for _, g in layers]).bounds


def place(layers, x, y, k=1.0):
    return [(c, t(g, x, y, k)) for c, g in layers]


# ---------- the options (each returns layers at cap height 100, origin top-left) ----------
def w1_shadow():
    """Today's lettering: block caps, a thin offset shadow in the other colour."""
    a, end = word("CHUNK")
    b, _ = word("HISTORY", end + GAP_WORDS)
    return [(CORAL, t(a, 5, 5)), (TEAL, t(b, 5, 5)), (TEAL, a), (CORAL, b)]


def w2_slabs():
    """Each word knocked out of its own chamfered slab: two chunks, side by side."""
    pad, gap = 20, 16
    a, ea = word("CHUNK")
    b, eb = word("HISTORY")
    sa = chamfer(box(-pad, -pad, ea + pad, 100 + pad), 16).difference(a.buffer(0))
    sb = t(chamfer(box(-pad, -pad, eb + pad, 100 + pad), 16).difference(b), ea + 2 * pad + gap)
    return [(TEAL, sa), (CORAL, sb)]


def w3_stacked():
    """CHUNK big over HISTORY small and wide-tracked, both the same width."""
    a, ea = word("CHUNK")
    k = 0.46
    nat = sum(76 if ch != "I" else S for ch in "HISTORY")
    track = (ea / k - nat) / 6
    b, eb = word("HISTORY", track=track)
    return [(TEAL, a), (CORAL, t(b, 0, 100 + 22, k))]


def dial_o(col_ring, col_quarter):
    """The O of HISTORY as a tiny Quarter past dial: square ring, four notches, coral quarter."""
    W = 100
    g = chamfer(box(0, 0, W, 100), 14).difference(chamfer(box(24, 24, W - 24, 76), 4))
    notches = unary_union([box(W / 2 - 5, -2, W / 2 + 5, 12), box(W / 2 - 5, 88, W / 2 + 5, 102),
                           box(-2, 45, 12, 55), box(88, 45, 102, 55)])
    g = g.difference(notches)
    cuts = unary_union([seam((W / 2, -5), (W / 2, 30), 7), seam((70, 50), (W + 5, 50), 7)])
    q, rest = by_side(g, cuts, lambda c: c.x > W / 2 and c.y < 50)
    return [(col_ring, rest), (col_quarter, q)], W


def w4_dial_o():
    """One line, flat colour; the O of HISTORY is a tiny Quarter past dial."""
    a, x = word("CHUNK")
    x += GAP_WORDS
    layers = [(TEAL, a)]
    for part in ("HIST", "O", "RY"):
        if part == "O":
            o, w = dial_o(CORAL, TEAL)
            layers += place(o, x, 0)
            x += w + 18
        else:
            g, e = word(part, x)
            layers.append((CORAL, g))
            x = e + 18
    return layers


def w5_weights():
    """Weight contrast: CHUNK heavy, HISTORY light, one line, flat colour."""
    a, ea = word("CHUNK", s=30)
    b, _ = word("HISTORY", ea + GAP_WORDS - 10, s=13, cham=4)
    return [(TEAL, a), (CORAL, b)]


def w6_stacked_slabs():
    """The stacked words knocked out of two slabs, the lower one set a step to the right."""
    pad = 18
    a, ea = word("CHUNK")
    k = 0.46
    nat = sum(76 if ch != "I" else S for ch in "HISTORY")
    b, _ = word("HISTORY", track=(ea / k - nat) / 6)
    b = t(b, 0, 0, k)
    top = chamfer(box(-pad, -pad, ea + pad, 100 + pad), 14).difference(a)
    bot = t(chamfer(box(-pad, -12, ea + pad, 46 + 12), 10).difference(b), 22, 100 + pad + 12 + 12)
    return [(TEAL, top), (CORAL, bot)]


OPTIONS = [
    ("w1", w1_shadow, "1  Shadow (today's)", "Your current lettering, cleaned up: block caps with a thin offset shadow in the other colour."),
    ("w2", w2_slabs, "2  Two slabs", "Each word carved out of its own slab, like the tablet: two chunks side by side."),
    ("w3", w3_stacked, "3  Stacked", "CHUNK big, HISTORY small and spaced to the same width: compact, fits beside the mark."),
    ("w4", w4_dial_o, "4  Dial O", "Flat colour, one line; the O in HISTORY is a tiny Quarter past dial."),
    ("w5", w5_weights, "5  Heavy + light", "CHUNK heavy, HISTORY light: the chunk is the hero, history is the subject."),
    ("w6", w6_stacked_slabs, "6  Stacked slabs", "The stacked words carved into two slabs, the lower one stepped out like a pulled chunk."),
]


def build():
    mark = clock()
    for key, fn, _, _ in OPTIONS:
        wm = fn()
        x0, y0, x1, y1 = bounds(wm)
        pad = 8
        wm = place(wm, pad - x0, pad - y0)
        ww, wh = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
        write(f"wm-{key}.svg", round(ww), round(wh), wm, "Chunk History wordmark")
        # horizontal lockup: mark as tall as the wordmark block (at least 1.7x the cap height)
        mh = max(wh - 2 * pad, 170)
        k = mh / 256 * 256 / 224          # the tablet spans 16..240 of the 256 canvas
        mk = place(mark, -16 * k, -16 * k, k)
        gap = 0.32 * mh
        wy = (mh - (wh - 2 * pad)) / 2
        lk = place(mk, pad, pad) + place(wm, pad + mh + gap - pad, wy)
        write(f"wm-{key}-lockup.svg", round(mh + gap + ww + pad), round(mh + 2 * pad), lk, "Chunk History logo")


def png(svg, w):
    return Image.open(io.BytesIO(cairosvg.svg2png(url=svg, output_width=w))).convert("RGBA")


def board(out):
    rowh, W = 330, 1900
    im = Image.new("RGB", (W, rowh * len(OPTIONS) + 20), INK)
    dr = ImageDraw.Draw(im)
    for i, (key, _, name, note) in enumerate(OPTIONS):
        y = 20 + i * rowh
        dr.text((30, y + 10), name, font=font(28, True), fill="#F4EFE6")
        for j, line in enumerate(wrap(note, 30)):
            dr.text((30, y + 56 + 30 * j), line, font=font(20), fill="#C9C3B8")
        lk = png(os.path.join(OUT, f"wm-{key}-lockup.svg"), 980)
        if lk.height > rowh - 40:
            lk = png(os.path.join(OUT, f"wm-{key}-lockup.svg"), int(980 * (rowh - 40) / lk.height))
        im.paste(lk, (440, y + (rowh - 20 - lk.height) // 2), lk)
        for j, wpx in enumerate((300, 160)):     # small: a banner corner, a watermark
            sm = png(os.path.join(OUT, f"wm-{key}-lockup.svg"), wpx)
            im.paste(sm, (1480, y + 30 + j * 130), sm)
        dr.text((1480, y + rowh - 40), "300 / 160 px wide", font=font(16), fill="#8a857c")
        dr.line((30, y + rowh - 6, W - 30, y + rowh - 6), fill="#2a2a2a", width=1)
    im.save(out)


if __name__ == "__main__":
    build()
    board(os.path.join(HERE, "wordmarks.png"))
    print("ok")
