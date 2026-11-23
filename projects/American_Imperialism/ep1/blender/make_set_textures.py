# Textures for the chapter 4 and 6 sets (system python3 + PIL; run once, writes into assets/):
#   us_flag_44.png        the 44-star U.S. flag (July 1891 to July 1896): 13 stripes, stars in rows of 8, 7, 7, 7, 7, 8,
#                         proportions 1.9 : 1 (the canton 7 stripes deep and 0.76 of the hoist wide)
#   chart_diagram.png     the lecturer's chart: a branching tree drawn as a "scientific" diagram, one branch climbing
#                         highest and arrowed; labels are ink strokes, not words
#   chart_blank.png       the same sheet, blank (the cut "It wasn't.")
#   senate_carpet.png     one tile (2 m square) of the Senate floor's carpet: deep red, a gold lozenge lattice, rosettes
#   python3 make_set_textures.py
import math, os, random
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(HERE, 'assets')
RED, WHITE, BLUE = (168, 44, 42), (236, 230, 216), (38, 52, 92)


def star(d, cx, cy, r, col):
    pts = []
    for k in range(10):
        a = -math.pi / 2 + k * math.pi / 5
        rr = r if k % 2 == 0 else r * 0.382
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=col)


def us_flag(path, H=600):
    S = 4                                                   # supersample, then shrink (clean star edges)
    h, w = H * S, int(H * 1.9) * S
    im = Image.new('RGB', (w, h), WHITE)
    d = ImageDraw.Draw(im)
    sh = h / 13
    for k in range(13):
        if k % 2 == 0:
            d.rectangle([0, round(k * sh), w, round((k + 1) * sh)], fill=RED)
    cw, ch = 0.76 * h, 7 * sh
    d.rectangle([0, 0, round(cw), round(ch)], fill=BLUE)
    rows = [8, 7, 7, 7, 7, 8]
    r = 0.0616 * h / 2 * 1.0                                # star diameter 0.0616 of the hoist
    for i, n in enumerate(rows):
        y = ch * (i + 0.5) / len(rows)
        mx = cw * 0.06
        for j in range(n):
            x = mx + (cw - 2 * mx) * (j + 0.5) / n
            star(d, x, y, r, WHITE)
    im = im.resize((w // S, h // S), Image.LANCZOS)
    im.save(path)
    print('wrote', path, im.size)


def paper(W, H, seed):
    rr = random.Random(seed)
    im = Image.new('RGB', (W, H), (232, 222, 196))
    d = ImageDraw.Draw(im)
    for _ in range(900):                                    # soft mottling, so the sheet is paper and not a flat card
        x, y = rr.uniform(0, W), rr.uniform(0, H)
        r = rr.uniform(10, 60)
        t = rr.uniform(-7, 5)
        c = tuple(int(v + t) for v in (232, 222, 196))
        d.ellipse([x - r, y - r, x + r, y + r], fill=c)
    im = im.filter(ImageFilter.GaussianBlur(18))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W - 1, H - 1], outline=(200, 186, 156), width=6)
    for (x, y) in ((40, 40), (W - 40, 40)):                 # the two pins at the top corners
        d.ellipse([x - 9, y - 9, x + 9, y + 9], fill=(150, 120, 70))
    return im


def chart(path, blank):
    W, H = 1200, 1500
    im = paper(W, H, 3)
    if blank:
        im.save(path)
        print('wrote', path)
        return
    INK, ACC = (46, 38, 32), (143, 59, 46)
    S = 2
    big = im.resize((W * S, H * S))
    d = ImageDraw.Draw(big)
    def L(p, q, wdt=6, col=INK):
        d.line([(p[0] * S, p[1] * S), (q[0] * S, q[1] * S)], fill=col, width=wdt * S)
    def dot(p, r=13, col=INK):
        d.ellipse([(p[0] - r) * S, (p[1] - r) * S, (p[0] + r) * S, (p[1] + r) * S], fill=col)
    def label(p, n, wdt=150, wdt_px=4):                    # a written label: a loose line of handwriting, as a wavy stroke
        rr = random.Random(int(p[0] * 7 + p[1]))
        for k in range(n):
            ln = wdt * rr.uniform(0.75, 1.0)
            pts, x = [], p[0]
            while x < p[0] + ln:
                pts.append((x * S, (p[1] + k * 26 + 5 * math.sin(x * 0.21 + rr.uniform(0, 3)) * rr.uniform(0.4, 1.0)) * S))
                x += 7
                if rr.random() < 0.04:                          # a word break
                    d.line(pts, fill=INK, width=wdt_px * S); pts = []; x += 14
            if len(pts) > 1:
                d.line(pts, fill=INK, width=wdt_px * S)
    # the title: two lines of "writing" across the top, ruled under
    label((230, 110), 1, 740, 6)
    label((380, 160), 1, 440, 5)
    L((170, 215), (1030, 215), 3)
    # the axis: a tall arrow up the left side, with ticks
    L((150, 1390), (150, 330), 6)
    d.polygon([(150 * S, 290 * S), (128 * S, 345 * S), (172 * S, 345 * S)], fill=INK)
    for k in range(9):
        y = 1350 - k * 115
        L((134, y), (166, y), 4)
    # the tree: one stem climbs to the top in red and ends in an arrow; the side branches leave it and stop short
    # at a bar, each lower than the last one it passed
    stem = [(620, 1400), (620, 1240), (600, 1090), (628, 940), (604, 790), (630, 640), (610, 500), (618, 340)]
    for p, q in zip(stem, stem[1:]):
        L(p, q, 9, ACC)
    d.polygon([(618 * S, 285 * S), (592 * S, 345 * S), (644 * S, 345 * S)], fill=ACC)
    for i, p in enumerate(stem[1:-1]):
        sd = -1 if i % 2 == 0 else 1
        ln = 250 - i * 18
        a = math.radians(52 + i * 3)
        q = (p[0] + sd * ln * math.sin(a), p[1] - ln * math.cos(a))
        L(p, q, 6)
        dot(p, 12, ACC)
        ux, uy = math.cos(a) * 18, sd * math.sin(a) * 18      # the bar across the end, square to the branch
        L((q[0] - ux, q[1] - uy), (q[0] + ux, q[1] + uy), 6)
        label((q[0] + 30, q[1] - 6) if sd > 0 else (q[0] - 170, q[1] - 6), 1, 140)
    # the key in the corner: three entries
    for k in range(3):
        L((860, 1260 + k * 44), (900, 1260 + k * 44), 7, ACC if k == 0 else INK)
        label((918, 1255 + k * 44), 1, 140)
    im = big.resize((W, H), Image.LANCZOS)
    im.save(path)
    print('wrote', path)


def carpet(path, W=512):
    S = 2
    im = Image.new('RGB', (W * S, W * S), (112, 38, 34))
    d = ImageDraw.Draw(im)
    w = W * S
    GOLD, DK, MID = (164, 122, 60), (84, 26, 26), (132, 50, 40)
    for (cx, cy) in ((0, 0), (w, 0), (0, w), (w, w), (w / 2, w / 2)):     # the lozenge lattice
        r = w / 2
        d.polygon([(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)], outline=GOLD, width=10 * S)
        d.polygon([(cx, cy - r * 0.42), (cx + r * 0.42, cy), (cx, cy + r * 0.42), (cx - r * 0.42, cy)], fill=DK)
        d.polygon([(cx, cy - r * 0.26), (cx + r * 0.26, cy), (cx, cy + r * 0.26), (cx - r * 0.26, cy)], fill=GOLD)
        d.ellipse([cx - r * 0.09, cy - r * 0.09, cx + r * 0.09, cy + r * 0.09], fill=MID)
    for (cx, cy) in ((w / 2, 0), (0, w / 2), (w, w / 2), (w / 2, w)):       # small rosettes where the lattice crosses
        r = w * 0.06
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=MID, outline=GOLD, width=4 * S)
    im = im.resize((W, W), Image.LANCZOS)
    im.save(path)
    print('wrote', path)


if __name__ == '__main__':
    carpet(os.path.join(A, 'senate_carpet.png'))
    us_flag(os.path.join(A, 'us_flag_44.png'))
    chart(os.path.join(A, 'chart_diagram.png'), False)
    chart(os.path.join(A, 'chart_blank.png'), True)
