"""Render the concepts on the channel's dark ink: big symbol, 64/32/16 px, avatar circle, lockup."""
import io, os, sys
import cairosvg
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
C = os.path.join(HERE, "concepts")
INK = "#111111"


def png(svg, w, h=None):
    return Image.open(io.BytesIO(cairosvg.svg2png(url=svg, output_width=w, output_height=h))).convert("RGBA")


def font(n, bold=False):
    for f in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]:
        if os.path.exists(f):
            return ImageFont.truetype(f, n)
    return ImageFont.load_default()


def board(keys, names, notes, out, recommend=None):
    colw, W = 620, 620 * len(keys)
    im = Image.new("RGB", (W, 970), INK)
    dr = ImageDraw.Draw(im)
    for i, (k, name, note) in enumerate(zip(keys, names, notes)):
        x = i * colw
        sym = os.path.join(C, f"concept-{k}-symbol.svg")
        im.paste(big := png(sym, 360), (x + 130, 40), big)
        sx = x + 130
        for s in (64, 32, 16):  # true sizes
            t = png(sym, s)
            im.paste(t, (sx, 440 + (64 - s)), t)
            sx += s + 28
        # avatar: YouTube crops to a circle
        av = Image.new("RGBA", (120, 120), INK)
        m = png(sym, 84)
        av.paste(m, (18, 18), m)
        mask = Image.new("L", (120, 120), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, 119, 119), fill=255)
        ring = Image.new("RGB", (124, 124), "#3a3a3a")
        im.paste(ring, (x + 366, 412), ImageDraw.Draw(Image.new("L", (124, 124))) and _circle(124))
        im.paste(av, (x + 368, 414), mask)
        lk = png(os.path.join(C, f"concept-{k}-lockup.svg"), 560)
        im.paste(lk, (x + 30, 560), lk)
        dr.text((x + 30, 800), name + ("   ← recommended" if recommend == i + 1 else ""), font=font(30, True),
                fill="#2FE0C4" if recommend == i + 1 else "#F4EFE6")
        y = 850
        for line in _wrap(note, 44):
            dr.text((x + 30, y), line, font=font(22), fill="#C9C3B8")
            y += 32
        dr.text((x + 130, 520), "64 / 32 / 16 px", font=font(16), fill="#8a857c")
        dr.text((x + 372, 540), "avatar", font=font(16), fill="#8a857c")
    im.save(out)


def _circle(n):
    m = Image.new("L", (n, n), 0)
    ImageDraw.Draw(m).ellipse((0, 0, n - 1, n - 1), fill=255)
    return m


def _wrap(t, n):
    out, line = [], ""
    for w in t.split():
        if len(line) + len(w) + 1 > n:
            out.append(line)
            line = w
        else:
            line = (line + " " + w).strip()
    return out + [line]


if __name__ == "__main__":
    board("abc", ["A  Cut stone C", "B  The lifted chunk", "C  Two chunks"],
          ["The original idea, redrawn: six chunks, mitred corners, one gap width, one chamfer angle, no hairlines.",
           "The C is seven blocks, and one is lifted out: history, one chunk at a time.",
           "The C, split along one 45-degree crack into two chunks: the simplest, boldest cut."],
          os.path.join(HERE, sys.argv[1] if len(sys.argv) > 1 else "concepts.png"), recommend=1)
