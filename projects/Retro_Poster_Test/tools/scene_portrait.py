# Scene type 2, the portrait: Thaddeus Lowe in the basket of the Intrepid, 1862. A medium shot with a face, in the same
# palette and paper as the wide poster scenes. build() returns ordered (stage, svg) pieces: all at once they are the
# still; tools/reveal.py lays them down one by one.
import math, sys
import numpy as np
from facet import *
from figures import tint
from portrait import bust, place


def build():
    seed(41)
    S = []
    add = lambda st, svg: S.append((st, svg))
    HX, HY, U = 1190, 400, 330          # centre of the head, head height

    # ---- guide lines (the drawing's scaffolding; they stay, faint, like the arcs in the wide scenes)
    g = f'stroke="{PAL["cream"]}" stroke-width="2" fill="none" opacity="0.75"'
    add('guide', f'<circle cx="{HX}" cy="{HY}" r="330" {g} pathLength="1"/>')
    add('guide', f'<line x1="{HX}" y1="{HY - 410}" x2="{HX}" y2="{HY + 410}" {g} pathLength="1"/>')
    add('guide', f'<line x1="{HX - 410}" y1="{HY}" x2="{HX + 410}" y2="{HY}" {g} pathLength="1"/>')
    add('guide', f'<path d="M{HX - 520},{HY + 330} Q{HX},{HY + 250} {HX + 520},{HY + 330}" {g} pathLength="1"/>')

    # ---- far below: sky, clouds, ridges, the camp
    add('sky', sky(PAL['sky'], '#c9d3c8', 800))
    add('bg', cloud2(380, 300, 900, 250, PAL['cream'], belly='#e2d3ac', n=9))
    add('bg', cloud2(1700, 520, 620, 150, PAL['sky2'], belly='#a9bab6', n=7))
    add('bg', cloud2(1560, 170, 520, 130, PAL['cream2'], belly='#d8c79d', n=7))
    for y, amp, col, sv in [(700, 50, PAL['mist1'], 1.3), (742, 44, PAL['mist2'], 4.1)]:
        add('bg', seam(facets(ridgeline(-40, W + 40, y, amp, 70, sv), tones(col, 4, 0.07), hill_h(0.006, 120), cell=85, contrast=0.9)) + mist(y + 40, 60, op=0.4))
    valley = [(-20, 790), (W + 20, 780), (W + 20, H + 20), (-20, H + 20)]
    v = seam(facets(valley, PAL['olive_lt'], hill_h(0.003, 90, (0, 0.05)), cell=150, contrast=0.4, bias=0.1))
    v += f'<path d="M-20,930 C300,900 520,860 760,850 S1300,830 1940,800" stroke="{PAL["sky2"]}" stroke-width="16" fill="none"/>'
    for row, (y, s_, n) in enumerate([(826, 6, 60), (842, 7, 52), (860, 8, 44)]):
        for i in range(n):
            x = 30 + i * (1860 / n) + (rng.random() - .5) * 10
            if 700 < x < 900:
                continue
            v += poly([(x, y - s_), (x - s_ * .9, y), (x + s_ * .9, y)], PAL['cream']) + poly([(x, y - s_), (x + s_ * .9, y), (x, y)], '#d9c9a0')
    add('bg', v)

    # ---- ropes behind him, running up to the balloon
    apex = (HX, -1500)
    for bx in (1010, 1400):
        add('rope', f'<line x1="{bx}" y1="1000" x2="{apex[0] + (bx - HX) * 0.6:.0f}" y2="-40" stroke="{PAL["ink2"]}" stroke-width="7" stroke-linecap="round"/>')

    # ---- Lowe
    S.extend(place(bust(skin='#dbb692', hair='#33291f', coat='#33414f', moustache='walrus', hair_style='parted', age=0.6), HX, HY, U))

    # ---- the basket rim and the near ropes
    rim = [(430, 1100), (470, 940), (1930, 905), (1930, 1100)]
    wick = facets(rim, ['#5f4829', '#7a5e36', '#927244', '#a98651'], ridge_h(0.05, 50, 0.05), cell=44, contrast=1.0)
    wick += poly([(462, 944), (1930, 908), (1930, 884), (466, 920)], '#b9965c')
    wick += poly([(1190, 912), (1930, 894), (1930, 884), (1190, 902)], '#000', 'opacity="0.12"')
    add('front', seam(wick))
    for bx in (700, 1690):
        add('front', f'<line x1="{bx}" y1="930" x2="{apex[0] + (bx - HX) * 0.72:.0f}" y2="-40" stroke="{PAL["ink"]}" stroke-width="9" stroke-linecap="round"/>')
    add('front', f'<ellipse cx="640" cy="955" rx="34" ry="52" fill="{PAL["cream2"]}"/><ellipse cx="652" cy="962" rx="20" ry="40" fill="#000" opacity="0.1"/>')
    return S, (HX, HY, U)


TITLE = ['Thaddeus Lowe']
SUB = ['Chief Aeronaut,', 'Union Army Balloon Corps', '1862']


def title_svg(n1=999, n2=999, rule=1.0):
    o = f'<g font-family="Special Elite" fill="{PAL["ink"]}"><text x="130" y="210" font-size="68" xml:space="preserve">{TITLE[0][:n1]}</text>'
    o += f'<rect x="130" y="258" width="{176 * rule:.1f}" height="3"/>'
    k = n2
    for i, line in enumerate(SUB):
        o += f'<text x="132" y="{316 + i * 42}" font-size="30" fill="{PAL["ink2"]}" xml:space="preserve">{line[:max(0, k)]}</text>'
        k -= len(line)
    return o + '</g>'


if __name__ == '__main__':
    S, _ = build()
    order = {'sky': 0, 'bg': 1, 'guide': 2, 'rope': 3, 'flat': 4, 'shade': 5, 'detail': 6, 'front': 7}
    body = ''.join(svg for st, svg in sorted(S, key=lambda p: order[p[0]]))
    open(sys.argv[1], 'w').write(finish(body + title_svg()))
