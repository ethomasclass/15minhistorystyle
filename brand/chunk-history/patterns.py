"""Seamless background patterns for Chunk History, built from the Quarter past mark's parts.

Run: python3 patterns.py  -> final/pattern-*.svg (one tile each) and patterns.png (preview)
"""
import io
import math
import os
import random

import cairosvg
from PIL import Image, ImageDraw
from shapely.geometry import box
from shapely.ops import unary_union

from build import TEAL, CORAL, INK, chamfer, seam, by_side, d
from board import font

HERE = os.path.dirname(os.path.abspath(__file__))
FIN = os.path.join(HERE, "final")
DIM_T, DIM_C = "#1d3b37", "#3d2523"   # teal and coral mixed into ink: quiet enough to sit behind type


def tile_svg(T, layers, bg=INK):
    body = "".join(f'<path fill="{c}" fill-rule="evenodd" d="{d(g)}"/>' for c, g in layers if not g.is_empty)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {T} {T}" width="{T}" height="{T}">'
            f'<rect width="{T}" height="{T}" fill="{bg}"/>{body}</svg>')


def mini_tablet(x, y, s, quarter):
    """A small notched tablet; with quarter=True its 12-to-3 quarter is cracked off."""
    g = chamfer(box(x, y, x + s, y + s), s * 0.14)
    n, dep = s * 0.08, s * 0.12
    cx, cy = x + s / 2, y + s / 2
    g = g.difference(unary_union([box(cx - n / 2, y - 1, cx + n / 2, y + dep), box(cx - n / 2, y + s - dep, cx + n / 2, y + s + 1),
                                  box(x - 1, cy - n / 2, x + dep, cy + n / 2), box(x + s - dep, cy - n / 2, x + s + 1, cy + n / 2)]))
    g = g.difference(chamfer(box(x + s * 0.3, y + s * 0.3, x + s * 0.7, y + s * 0.7), s * 0.05))
    if not quarter:
        return [(DIM_T, g)], []
    w = s * 0.05
    q, rest = by_side(g, unary_union([seam((cx, y - 2), (cx, cy + w), w), seam((cx - w, cy), (x + s + 2, cy), w)]),
                      lambda p: p.x > cx and p.y < cy)
    return [(DIM_T, rest)], [(DIM_C, q)]


def p1_dials(T=480):
    """A grid of small dials; one in five has its quarter-hour cracked off in coral."""
    rnd, L, C = random.Random(7), [], []
    n, s = 4, 80
    step = T / n
    for i in range(n):
        for j in range(n):
            a, b = mini_tablet(i * step + (step - s) / 2, j * step + (step - s) / 2, s, rnd.random() < 0.2)
            L += a
            C += b
    return L + C


def p2_cracks(T=480):
    """Parallel 45-degree cracks, broken into chunks; a few chunks picked out in coral."""
    rnd, lines, coral = random.Random(3), [], []
    gap = T / 8
    for k in range(-8, 17):
        x0 = k * gap
        y = 0
        while y < T * 2:
            ln = rnd.choice([40, 60, 90, 120])
            seg = seam((x0 + y, y), (x0 + y + ln / math.sqrt(2), y + ln / math.sqrt(2)), 6)
            (coral if rnd.random() < 0.08 else lines).append(seg)
            y += ln / math.sqrt(2) + 18
    clip = box(0, 0, T, T)
    def wrap(gs):   # copy shifted by one tile so edges meet seamlessly
        from shapely import affinity
        u = unary_union([affinity.translate(g, dx, 0) for g in gs for dx in (-T, 0, T)])
        return u.intersection(clip)
    return [(DIM_T, wrap(lines)), (DIM_C, wrap(coral))]


def p3_chunks(T=480):
    """A loose wall of chamfered blocks in staggered courses, like stacked chunks of stone."""
    rnd, L, C = random.Random(11), [], []
    h, g = 38, 10                                   # 10 courses of 48 fill the 480 tile exactly
    from shapely import affinity
    for r in range(T // (h + g)):
        y = r * (h + g) + g / 2
        widths, left = [], T
        while left > 0:                             # widths that sum (with gaps) to exactly T
            w = rnd.choice([60, 80, 120, 160])
            w = left - g if left - g - w < 50 else w
            widths.append(w)
            left -= w + g
        x = -rnd.randint(0, 80)                     # stagger the course; it wraps around the tile
        for w in widths:
            blk = chamfer(box(x, y, x + w, y + h), 8)
            (C if rnd.random() < 0.07 else L).append(blk)
            x += w + g
    clip = box(0, 0, T, T)
    fold = lambda gs: unary_union([affinity.translate(b, dx, 0) for b in gs for dx in (0, T)]).intersection(clip)
    return [(DIM_T, fold(L)), (DIM_C, fold(C))]


PATTERNS = [("dials", p1_dials, "Dials", "Small notched tablets; every few, the quarter-hour cracks off in coral."),
            ("cracks", p2_cracks, "Cracks", "The tablet's 45-degree break, repeated as broken diagonal chunks."),
            ("chunks", p3_chunks, "Chunks", "Chamfered blocks in staggered courses: a wall of chunks.")]


def main():
    os.makedirs(FIN, exist_ok=True)
    W, H = 2400, 1900
    im = Image.new("RGB", (W, H), INK)
    dr = ImageDraw.Draw(im)
    for i, (key, fn, name, note) in enumerate(PATTERNS):
        T = 480
        svg = tile_svg(T, fn(T))
        open(os.path.join(FIN, f"pattern-{key}.svg"), "w").write(svg)
        tile = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode(), output_width=T))).convert("RGB")
        x0 = 60 + i * 790
        area = Image.new("RGB", (740, 1500))
        for ty in range(0, 1500, T):
            for tx in range(0, 740, T):
                area.paste(tile, (tx, ty))
        # a title strip on top, to judge it behind type
        ad = ImageDraw.Draw(area)
        ad.rectangle((0, 640, 740, 860), fill=INK)
        ad.text((40, 690), "THE EXACT SPOT", font=font(56, True), fill="#F4EFE6")
        ad.text((40, 770), "a chunk of history", font=font(30), fill=TEAL)
        im.paste(area, (x0, 60))
        dr.text((x0, 1600), f"{i + 1}  {name}", font=font(36, True), fill="#F4EFE6")
        dr.text((x0, 1660), note, font=font(22), fill="#C9C3B8")
    im.save(os.path.join(HERE, "patterns.png"))
    print("ok")


main()
