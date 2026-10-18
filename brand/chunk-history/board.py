"""Render concepts on the channel's dark ink: big symbol, 64/32/16 px, avatar circle, lockup.

Run: python3 board.py            -> concepts.png  (concepts A-C)
     python3 board.py tablets    -> tablets.png   (the carved-C tablet family)
"""
import io
import os
import sys

import cairosvg
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
C = os.path.join(HERE, "concepts")
INK = "#111111"
COLW, ROWH = 620, 970


def png(svg, w):
    return Image.open(io.BytesIO(cairosvg.svg2png(url=svg, output_width=w))).convert("RGBA")


def font(n, bold=False):
    f = "/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf" % ("-Bold" if bold else "")
    return ImageFont.truetype(f, n) if os.path.exists(f) else ImageFont.load_default()


def circle(n):
    m = Image.new("L", (n, n), 0)
    ImageDraw.Draw(m).ellipse((0, 0, n - 1, n - 1), fill=255)
    return m


def wrap(t, n):
    out, line = [], ""
    for w in t.split():
        if len(line) + len(w) + 1 > n:
            out.append(line)
            line = w
        else:
            line = (line + " " + w).strip()
    return out + [line]


def column(sym, lock, name, note, rec):
    im = Image.new("RGB", (COLW, ROWH), INK)
    dr = ImageDraw.Draw(im)
    big = png(sym, 360)
    im.paste(big, (130, 40), big)
    sx = 130
    for s in (64, 32, 16):  # true sizes
        t = png(sym, s)
        im.paste(t, (sx, 440 + (64 - s)), t)
        sx += s + 28
    # avatar: YouTube crops the picture to a circle
    av = Image.new("RGBA", (120, 120), INK)
    m = png(sym, 84)
    av.paste(m, (18, 18), m)
    im.paste(Image.new("RGB", (124, 124), "#3a3a3a"), (366, 412), circle(124))
    im.paste(av, (368, 414), circle(120))
    lk = png(lock, 560)
    im.paste(lk, (30, 560), lk)
    dr.text((30, 800), name + ("   ← recommended" if rec else ""), font=font(30, True),
            fill="#2FE0C4" if rec else "#F4EFE6")
    for j, line in enumerate(wrap(note, 44)):
        dr.text((30, 850 + 32 * j), line, font=font(22), fill="#C9C3B8")
    dr.text((130, 520), "64 / 32 / 16 px", font=font(16), fill="#8a857c")
    dr.text((372, 540), "avatar", font=font(16), fill="#8a857c")
    return im


def board(keys, names, notes, out, recommend=None, prefix="concept", cols=3):
    rows = (len(keys) + cols - 1) // cols
    im = Image.new("RGB", (COLW * min(cols, len(keys)), ROWH * rows), INK)
    for i, (k, name, note) in enumerate(zip(keys, names, notes)):
        col = column(os.path.join(C, f"{prefix}-{k}-symbol.svg"), os.path.join(C, f"{prefix}-{k}-lockup.svg"),
                     name, note, recommend == i + 1)
        im.paste(col, ((i % cols) * COLW, (i // cols) * ROWH))
    im.save(out)


CONCEPTS = (["a", "b", "c"], ["A  Cut stone C", "B  The lifted chunk", "C  Two chunks"],
            ["The original idea, redrawn: six chunks, mitred corners, one gap width, one chamfer angle, no hairlines.",
             "The C is seven blocks, and one is lifted out: history, one chunk at a time.",
             "The C, split along one 45-degree crack into two chunks: the simplest, boldest cut."])

TABLETS = (["t1", "t2", "t3", "t4", "t5", "t6"],
           ["1  Split tablet", "2  Quarter hour", "3  Shorts tablet", "4  Swipe", "5  The chip", "6  Quarter ticks"],
           ["The C carved as a ring with a narrow mouth, through a tablet broken corner to corner.",
            "The top-right quarter cracks off in coral, like a quarter-hour on a clock: one short chunk.",
            "The tablet takes the 9:16 Shorts frame and breaks on the diagonal.",
            "A Shorts-shaped tablet in three chunks, like clips in a feed; the one with the C slides in.",
            "One small chip knocks off the corner: the chunk is short, the tablet is all of history.",
            "Quarter-hour notches cut in the edges, like a clock dial: a short, timed piece of history."])

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "tablets":
        board(*TABLETS, os.path.join(HERE, "tablets.png"), prefix="tablet")
    else:
        board(*CONCEPTS, os.path.join(HERE, "concepts.png"), recommend=1)
