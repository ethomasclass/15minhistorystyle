"""Compare real typefaces for the Chunk History wordmark next to the Quarter past mark.

Fonts are free Google Fonts (SIL Open Font License), downloaded to FONT_DIR; not committed.
Run: python3 fonts_board.py <font_dir>  -> fonts.png
"""
import io
import os
import sys

import cairosvg
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FD = sys.argv[1]
TEAL, CORAL, INK = "#2FE0C4", "#FF6F61", "#111111"


def f(name, size, wght=None):
    ft = ImageFont.truetype(os.path.join(FD, name), size)
    if wght:
        ft.set_variation_by_axes([wght])
    return ft


def mark(px):
    return Image.open(io.BytesIO(cairosvg.svg2png(url=os.path.join(HERE, "concepts", "tablet-q2-symbol.svg"),
                                                  output_width=px))).convert("RGBA")


# name, note, (font for CHUNK), (font for HISTORY), uppercase gap
ROWS = [
    ("Chakra Petch  Bold + Light", "Cut corners like the tablet; the closest match to the mark.",
     ("ChakraPetch-Bold.ttf", None), ("ChakraPetch-Light.ttf", None)),
    ("Chakra Petch  Bold", "One weight, both words.", ("ChakraPetch-Bold.ttf", None), ("ChakraPetch-Bold.ttf", None)),
    ("Oxanium  ExtraBold", "Chamfered, squarer and techier.", ("Oxanium[wght].ttf", 800), ("Oxanium[wght].ttf", 800)),
    ("Russo One", "Heavy, rounded-square, sporty.", ("RussoOne-Regular.ttf", None), ("RussoOne-Regular.ttf", None)),
    ("Saira Stencil One", "Stencil breaks echo the cracks in the tablet.",
     ("SairaStencilOne-Regular.ttf", None), ("SairaStencilOne-Regular.ttf", None)),
    ("Bungee", "Retro signage; closest to your original's spirit.", ("Bungee-Regular.ttf", None), ("Bungee-Regular.ttf", None)),
    ("Big Shoulders Display  Black", "Condensed poster type; history-museum feel.",
     ("BigShouldersDisplay[wght].ttf", 900), ("BigShouldersDisplay[wght].ttf", 900)),
    ("Teko  SemiBold", "Condensed, squared; fits long titles.", ("Teko[wght].ttf", 600), ("Teko[wght].ttf", 600)),
    ("Archivo Black", "Plain heavy grotesque; the safest choice.", ("ArchivoBlack-Regular.ttf", None), ("ArchivoBlack-Regular.ttf", None)),
    ("Chakra Petch + Abril Fatface", "Modern chunk, classic history serif (your other channel's display face).",
     ("ChakraPetch-Bold.ttf", None), ("AbrilFatface-Regular.ttf", None)),
]


def setline(dr, x, y, a, b, size):
    fa, fb = f(a[0], size, a[1]), f(b[0], size, b[1])
    dr.text((x, y), "CHUNK", font=fa, fill=TEAL, anchor="ls")
    x += dr.textlength("CHUNK", font=fa) + size * 0.28
    dr.text((x, y), "HISTORY", font=fb, fill=CORAL, anchor="ls")
    return x + dr.textlength("HISTORY", font=fb)


def lockup(a, b, size):
    """Mark + one-line name, cropped tight, transparent."""
    im = Image.new("RGBA", (int(size * 14), int(size * 2.2)), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    m = mark(int(size * 1.6))
    im.paste(m, (0, int(size * 0.3)), m)
    setline(dr, int(size * 2.05), int(size * 1.48), a, b, size)
    return im.crop(im.getbbox())


def main():
    rowh, W = 190, 1900
    im = Image.new("RGB", (W, rowh * len(ROWS) + 20), INK)
    dr = ImageDraw.Draw(im)
    lab = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 17)
    for i, (name, note, a, b) in enumerate(ROWS):
        y = 20 + i * rowh
        dr.text((30, y + 18), f"{i + 1}  {name}", font=lab, fill="#F4EFE6")
        dr.text((30, y + 52), note, font=sub, fill="#C9C3B8")
        big = lockup(a, b, 74)
        big.thumbnail((1080, 140))
        im.paste(big, (30, y + 80 - 10 + (110 - big.height) // 2 + 10), big)
        small = lockup(a, b, 74)
        small.thumbnail((200, 60))
        im.paste(small, (1650, y + 90), small)
        dr.line((30, y + rowh - 4, W - 30, y + rowh - 4), fill="#2a2a2a")
    dr.text((1650, 4), "200 px wide", font=sub, fill="#8a857c")
    im.save(os.path.join(HERE, "fonts.png"))


main()
