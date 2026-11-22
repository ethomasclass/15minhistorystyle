# Scene 1: Professor Lowe's balloon Intrepid tethered over the Union lines at Fair Oaks, Virginia, June 1862.
import math, sys
import numpy as np
from facet import *
from trees import scene_tree

seed(11)
B = []

# sky and clouds
B.append(f'<rect width="{W}" height="700" fill="{PAL["sky"]}"/>')
B.append(cloud(420, 330, 1100, 300, PAL['cream'], n=10))
B.append(cloud(250, 120, 900, 260, PAL['cream'], n=8))
B.append(cloud(1650, 470, 700, 170, PAL['sky2'], n=8))
B.append(cloud(1500, 220, 520, 120, PAL['cream2'], n=7))
B.append(construction(1240, 330, 330, a0=195, a1=345))

# distant ridges, far = lightest
for y, amp, col, sv in [(560, 70, PAL['mist1'], 1.3), (600, 60, PAL['mist2'], 4.1), (650, 50, PAL['mist3'], 7.7)]:
    B.append(poly(ridgeline(-40, W + 40, y, amp, 70, sv), col))

# valley floor, faceted, with the camp
valley = [(-20, 660), (W + 20, 640), (W + 20, H + 20), (-20, H + 20)]
B.append(seam(facets(valley, PAL['olive_lt'], hill_h(0.003, 90, (0, 0.05)), cell=150, contrast=0.45, bias=0.08)))

def tent(x, y, s):
    return (poly([(x, y - s), (x - s * .9, y), (x, y)], PAL['cream'])
            + poly([(x, y - s), (x + s * .9, y), (x, y)], PAL['cream2'])
            + poly([(x, y - s), (x + s * .15, y), (x - s * .15, y)], PAL['ink2']))

for row, (y, s, n) in enumerate([(700, 16, 26), (740, 20, 22), (790, 25, 18)]):
    for i in range(n):
        x = 120 + i * (1500 / n) + (row * 31 % 40) + (rng.random() - .5) * 18
        if 980 < x < 1380 and row == 2:
            continue
        B.append(tent(x, y + (rng.random() - .5) * 6, s))
# smoke from a cook fire
for i in range(6):
    B.append(f'<circle cx="{620 + i * 9 + math.sin(i) * 14:.0f}" cy="{770 - i * 34}" r="{12 + i * 5}" fill="{PAL["cream"]}" opacity="{0.55 - i * 0.07:.2f}"/>')

# foreground rise on the right (the launch ground)
rise = [(820, H + 20), (900, 905), (1100, 870), (1380, 860), (1650, 880), (1940, 840), (1940, H + 20)]
B.append(seam(facets(rise, PAL['olive'], hill_h(0.004, 110, (0.02, -0.08)), cell=120, contrast=0.7, bias=0.1)))
B.append(f'<polyline points="{pts(rise[1:-1])}" fill="none" stroke="{PAL["olive_lt"][3]}" stroke-width="5" stroke-linejoin="bevel"/>')
# a cliff edge on the far left, like the poster's crag
crag = [(-20, 760), (90, 745), (210, 770), (300, 840), (330, 1000), (350, H + 20), (-20, H + 20)]
B.append(seam(facets(crag, PAL['rock'], ridge_h(0.03, 90, 0.1), cell=60, contrast=1.1)))
top = [(-20, 760), (90, 745), (210, 770), (190, 790), (60, 785), (-20, 790)]
B.append(seam(facets(top, PAL['olive'], hill_h(0.02, 40), cell=40)))

# the balloon
cx, cy, r = 1240, 330, 165
env = [(cx + r * math.cos(a) * 0.93, cy + r * math.sin(a) * (1.05 if math.sin(a) > 0 else 1.0)) for a in np.linspace(0, 2 * math.pi, 48, endpoint=False)]
env = [(x, y + (max(0, y - cy) ** 1.6) * 0.012) for x, y in env]  # slightly pear-shaped
sphere = lambda x, y: 300 * math.sqrt(max(0.0, 1 - ((x - cx) / (r * 1.25)) ** 2 - ((y - cy - 10) / (r * 1.25)) ** 2))
B.append(seam(facets(env, ['#7d5f37', '#9f7e4c', '#c4a267', '#dcc086', '#ecd9a7'], sphere, cell=46, contrast=1.25, jitter=0.3)))
# gores
for k in range(-3, 4):
    f = k / 3.6
    d = f'M{cx},{cy - r + 2} C{cx + f * r * 1.25:.1f},{cy - r * .6} {cx + f * r * 1.25:.1f},{cy + r * .5} {cx + f * 22:.1f},{cy + r + 24}'
    B.append(f'<path d="{d}" stroke="{PAL["ink2"]}" stroke-width="1.6" fill="none" opacity="0.55"/>')
# name band
B.append(f'<rect x="{cx - 118}" y="{cy - 14}" width="236" height="44" fill="{PAL["cream"]}" opacity="0.9"/>')
B.append(f'<text x="{cx - 4}" y="{cy + 18}" text-anchor="middle" font-family="Special Elite" font-size="34" fill="{PAL["red"]}" letter-spacing="4">INTREPID</text>')
# neck, net, basket
neck_y = cy + r + 26
B.append(poly([(cx - 22, neck_y - 8), (cx + 22, neck_y - 8), (cx + 10, neck_y + 22), (cx - 10, neck_y + 22)], '#9f7e4c'))
bx, by = cx, neck_y + 95
for dx in (-60, -25, 25, 60):
    B.append(f'<line x1="{cx + dx * 1.8}" y1="{cy + r * .55}" x2="{bx + dx * .45}" y2="{by - 22}" stroke="{PAL["ink2"]}" stroke-width="1.4"/>')
B.append(figure(bx - 14, by - 20, 7, PAL['blue'], hat=PAL['ink']))
B.append(figure(bx + 12, by - 20, 7, PAL['orange']))
B.append(poly([(bx - 38, by - 26), (bx + 38, by - 26), (bx + 32, by + 6), (bx - 32, by + 6)], '#8a6a3c'))
B.append(poly([(bx, by - 26), (bx + 38, by - 26), (bx + 32, by + 6), (bx, by + 6)], '#6f5530'))

# tethers to the ground crew
anchors = [(1010, 900), (1500, 885), (1260, 935)]
for ax, ay in anchors:
    B.append(f'<path d="M{bx},{by + 6} Q{(bx + ax) / 2 + 30},{(by + ay) / 2 + 40} {ax},{ay - 30}" stroke="{PAL["ink"]}" stroke-width="2" fill="none"/>')
crew = [(990, 905, PAL['blue']), (1025, 900, PAL['blue']), (1480, 890, PAL['blue']), (1520, 886, PAL['blue']),
        (1250, 940, PAL['blue']), (1290, 938, PAL['pink'])]
for x, y, c in crew:
    B.append(figure(x, y, 14, c, hat=PAL['ink']))

# framing trees, cropped by the edges like the poster
B.append(scene_tree(80, 1110, 920, lean=0.04, spread=0.36, n_branches=7, seed=5))
B.append(scene_tree(1850, 1110, 840, lean=-0.05, spread=0.38, n_branches=7, seed=8))
B.append(pine(1745, 900, 230))
B.append(pine(1800, 905, 180))
B.append(scene_tree(380, 900, 280, lean=0.02, n_branches=4, seed=12, leaf=24, airy=0.0, clump=0.13))

B.append(title(560, 150, ['Above the Lines'], size=64))
B.append(f'<text x="562" y="250" font-family="Special Elite" font-size="28" fill="{PAL["ink2"]}">Fair Oaks, Virginia - 1862</text>')

open(sys.argv[1], 'w').write(finish('\n'.join(B)))
