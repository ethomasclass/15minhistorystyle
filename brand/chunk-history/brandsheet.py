"""Final Chunk History logo files and the brand sheet: Quarter past mark + Two slabs wordmark.

Run: python3 brandsheet.py  -> final/*.svg, final/*.png, brand-sheet.png
"""
import io
import os

import cairosvg
from PIL import Image, ImageDraw
from shapely.ops import unary_union

from build import TEAL, CORAL, INK, svg, clock, mono
from board import font
from wordmarks import w2_slabs, place, bounds

HERE = os.path.dirname(os.path.abspath(__file__))
FIN = os.path.join(HERE, "final")
CREAM = "#F4EFE6"
PALETTE = [("Teal", TEAL, "47 224 196"), ("Coral", CORAL, "255 111 97"), ("Ink", INK, "17 17 17"), ("Cream", CREAM, "244 239 230")]


def norm(layers, pad=0):
    x0, y0, x1, y1 = bounds(layers)
    return place(layers, pad - x0, pad - y0), x1 - x0 + 2 * pad, y1 - y0 + 2 * pad


def save(name, layers, w, h):
    with open(os.path.join(FIN, name), "w") as f:
        f.write(svg(round(w), round(h), layers, "Chunk History logo"))
    return os.path.join(FIN, name)


def assets():
    os.makedirs(FIN, exist_ok=True)
    mark, mw, mh = norm(clock())
    wm, ww, wh = norm(w2_slabs())
    # horizontal: mark as tall as 1.5x the slabs, gap = a quarter of the mark
    k = wh * 1.5 / mh
    gap = mh * k * 0.25
    horiz = place(mark, 0, 0, k) + place(wm, mw * k + gap, (mh * k - wh) / 2)
    hw, hh = mw * k + gap + ww, mh * k
    # stacked: mark centred above the slabs, mark 80% of the slab width... capped at 2.4x slab height
    ks = min(ww * 0.42 / mw, 2.6 * wh / mh)
    sgap = mh * ks * 0.22
    stack = place(mark, (ww - mw * ks) / 2, 0, ks) + place(wm, 0, mh * ks + sgap)
    sw, sh = ww, mh * ks + sgap + wh
    sets = {"mark": (mark, mw, mh), "wordmark": (wm, ww, wh), "horizontal": (horiz, hw, hh), "stacked": (stack, sw, sh)}
    out = {}
    for name, (L, w, h) in sets.items():
        out[name] = save(f"chunk-history-{name}.svg", L, w, h)
        for tag, col in (("white", "#FFFFFF"), ("black", "#000000"), ("teal", TEAL)):
            out[f"{name}-{tag}"] = save(f"chunk-history-{name}-{tag}.svg", mono(L, col), w, h)
    return out


def png(path, w):
    return Image.open(io.BytesIO(cairosvg.svg2png(url=path, output_width=int(w)))).convert("RGBA")


def fit(path, w, h):
    im = png(path, w)
    if im.height > h:
        im = png(path, w * h / im.height)
    return im


def tile(size, bg, path, frac=0.72, circle=False):
    t = Image.new("RGBA", (size, size), bg)
    m = fit(path, size * frac, size * frac)
    t.paste(m, ((size - m.width) // 2, (size - m.height) // 2), m)
    if circle:
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
        t.putalpha(mask)
    return t


def exports(a):
    tile(800, INK, a["mark"], 0.62).convert("RGB").save(os.path.join(FIN, "avatar-800.png"))
    w = Image.new("RGBA", (150, 150), (0, 0, 0, 0))
    m = fit(a["mark"], 150, 150)
    w.paste(m, ((150 - m.width) // 2, (150 - m.height) // 2), m)
    w.save(os.path.join(FIN, "watermark-150.png"))
    b = Image.new("RGB", (2560, 1440), INK)          # safe area 1546x423, centred
    lk = fit(a["horizontal"], 1300, 300)
    b.paste(lk, ((2560 - lk.width) // 2, (1440 - lk.height) // 2), lk)
    b.save(os.path.join(FIN, "banner-2560x1440.png"))


def sheet(a):
    W, H = 2400, 3000
    im = Image.new("RGB", (W, H), INK)
    dr = ImageDraw.Draw(im)
    h1, h2, body, small = font(56, True), font(30, True), font(24), font(19)
    mute, rule = "#8a857c", "#2a2a2a"

    def head(y, t, sub=None):
        dr.text((100, y), t, font=h2, fill=CREAM)
        if sub:
            dr.text((100, y + 44), sub, font=body, fill="#C9C3B8")
        dr.line((100, y - 30, W - 100, y - 30), fill=rule, width=2)

    dr.text((100, 90), "CHUNK HISTORY", font=h1, fill=CREAM)
    dr.text((100, 165), "Brand sheet  ·  logo, colour, usage", font=body, fill=mute)

    # primary lockup
    lk = fit(a["horizontal"], 1800, 420)
    im.paste(lk, ((W - lk.width) // 2, 300), lk)
    dr.text((100, 770), "Primary: horizontal lockup. The Quarter past mark beside the Two slabs wordmark.", font=body, fill="#C9C3B8")

    # versions
    y = 900
    head(y, "Lockups", "Use the horizontal lockup by default; stacked where width is tight; the mark alone when the name is nearby.")
    st = fit(a["stacked"], 620, 520)
    im.paste(st, (100, y + 120), st)
    mk = fit(a["mark"], 420, 420)
    im.paste(mk, (900, y + 170), mk)
    wm = fit(a["wordmark"], 900, 200)
    im.paste(wm, (1420, y + 330), wm)
    for x, t in ((100, "Stacked"), (900, "Mark"), (1420, "Wordmark")):
        dr.text((x, y + 670), t, font=small, fill=mute)

    # colour
    y = 1660
    head(y, "Colour", "Teal and coral from the channel palette, always on ink. Cream for text on dark.")
    for i, (n, hx, rgb) in enumerate(PALETTE):
        x = 100 + i * 560
        dr.rectangle((x, y + 110, x + 500, y + 330), fill=hx, outline="#3a3a3a" if hx == INK else None, width=2)
        dr.text((x, y + 350), n, font=h2, fill=CREAM)
        dr.text((x, y + 392), f"{hx}   RGB {rgb}", font=body, fill="#C9C3B8")

    # one-colour and backgrounds
    y = 2160
    head(y, "One colour", "When two colours aren't possible: white on dark, black on light, teal on ink.")
    for i, (bg, key) in enumerate(((INK, "horizontal-white"), (CREAM, "horizontal-black"), (INK, "horizontal-teal"))):
        x = 100 + i * 740
        dr.rectangle((x, y + 110, x + 700, y + 330), fill=bg, outline="#3a3a3a", width=2)
        l1 = fit(a[key], 600, 150)
        im.paste(l1, (x + (700 - l1.width) // 2, y + 110 + (220 - l1.height) // 2), l1)

    # sizes and rules
    y = 2560
    head(y, "On YouTube", None)
    av = tile(200, INK, a["mark"], 0.62, circle=True)
    dr.ellipse((98, y + 28, 302, y + 232), outline="#3a3a3a", width=2)
    im.paste(av, (100, y + 30), av)
    for i, s in enumerate((64, 32, 16)):
        t = fit(a["mark"], s, s)
        im.paste(t, (380 + i * 100, y + 130 - s // 2), t)
    dr.text((100, y + 250), "Avatar (circle crop)        64 / 32 / 16 px", font=small, fill=mute)
    rules = ["Clear space: one notch-to-crack width (a quarter of the mark) on every side.",
             "Minimum: mark 16 px; horizontal lockup 160 px wide; below that use the mark alone.",
             "Don't recolour the slabs, swap teal and coral, stretch, outline, or add shadows.",
             "Lettering is custom-drawn block capitals; don't retype the name in a font."]
    for i, r in enumerate(rules):
        dr.text((900, y + 20 + i * 52), "·  " + r, font=body, fill="#C9C3B8")
    im.save(os.path.join(HERE, "brand-sheet.png"))


if __name__ == "__main__":
    a = assets()
    exports(a)
    sheet(a)
    print("ok")
