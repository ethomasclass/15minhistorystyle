# Scene 2: the salted "diamond field" on a mesa in Colorado Territory, 1872, as Clarence King's survey party finds it.
import math, sys
import numpy as np
from facet import *
from trees import scene_tree

seed(23)
B = []
B.append(f'<rect width="{W}" height="760" fill="{PAL["sky"]}"/>')
B.append(cloud(1350, 300, 1300, 330, PAL['cream'], n=11))
B.append(cloud(1700, 120, 700, 200, PAL['cream'], n=7))
B.append(cloud(300, 420, 600, 140, PAL['sky2'], n=8))
B.append(construction(820, 470, 360, a0=190, a1=320))

def mesa(x0, x1, top, base, slope, col):
    """A flat-topped mesa silhouette with talus slopes."""
    return poly([(x0 - slope, base), (x0, top + 8), (x0 + 30, top), (x1 - 30, top), (x1, top + 10), (x1 + slope * 1.3, base)], col)

B.append(seam(mesa(1150, 1700, 560, 720, 120, PAL['mist1'])))
B.append(seam(mesa(1500, 2000, 600, 760, 90, PAL['mist1'])))
B.append(seam(poly(ridgeline(-40, W + 40, 680, 40, 80, 2.2), PAL['mist2'])))
B.append(seam(mesa(1300, 1620, 650, 800, 100, PAL['mist3'])))
B.append(seam(poly(ridgeline(900, W + 40, 760, 35, 70, 5.5), PAL['mist3'])))

# valley floor far below, right side
floor = [(800, 790), (W + 20, 770), (W + 20, H + 20), (800, H + 20)]
B.append(seam(facets(floor, PAL['sand'][1:], hill_h(0.004, 70), cell=140, contrast=0.4, bias=0.05)))
# a dry creek
B.append(f'<path d="M1950,880 C1700,900 1600,850 1420,900 S1100,1000 900,980" stroke="{PAL["sky2"]}" stroke-width="9" fill="none"/>')
for i in range(14):  # sagebrush dots
    x, y = 1000 + rng.random() * 900, 830 + rng.random() * 230
    B.append(leaf_cluster(x, y, 9 + rng.random() * 8, PAL['olive_lt'][:2], k=5))

# the main mesa cliff (sandstone), its top and the rim
top_y = 590
cliff = [(250, top_y + 15), (420, top_y), (900, top_y + 8), (1180, top_y + 2), (1230, top_y + 40), (1260, 760),
         (1300, 900), (1340, H + 20), (180, H + 20)]
B.append(seam(facets(cliff, PAL['sand'], ridge_h(0.022, 110, 0.12, phase=0.4), cell=62, contrast=1.15, jitter=0.35)))
B.append(facets([(1180, top_y + 2), (1230, top_y + 40), (1260, 760), (1300, 900), (1340, H + 20), (1180, H + 20), (1150, 800)],
                PAL['sand'][:3], ridge_h(0.03, 90, 0.1), cell=55, contrast=0.9))  # shadowed east face
# dark cracks running down the face
for x, w in [(560, 18), (820, 12), (1010, 22)]:
    B.append(poly([(x, top_y + 30), (x + w, top_y + 40), (x + w * 0.4 + 30, H + 20), (x - w + 10, H + 20)], PAL['sand'][0], 'opacity="0.85"'))
mesa_top = [(250, top_y + 15), (420, top_y), (900, top_y + 8), (1180, top_y + 2), (1230, top_y + 40), (1050, top_y + 48), (600, top_y + 44), (250, top_y + 50)]
B.append(seam(facets(mesa_top, PAL['olive_lt'], hill_h(0.01, 50), cell=50, contrast=0.6)))
B.append(f'<polyline points="{pts(mesa_top[:5])}" fill="none" stroke="{PAL["sand"][4]}" stroke-width="4"/>')

# the party on the rim
y0 = top_y + 6
# Clarence King at the transit (the yellow instrument, like the telescope in the poster)
tx = 780
for dx in (-26, 0, 24):
    B.append(f'<line x1="{tx}" y1="{y0 - 52}" x2="{tx + dx}" y2="{y0 + 2}" stroke="{PAL["ink"]}" stroke-width="3"/>')
B.append(poly([(tx - 22, y0 - 66), (tx + 26, y0 - 72), (tx + 28, y0 - 58), (tx - 20, y0 - 52)], PAL['yellow']))
B.append(figure(tx - 46, y0, 15, PAL['blue'], hat=PAL['ink']))
# the two men who salted the field: one kneeling over a pan, one standing by
B.append(figure(980, y0 + 2, 15, PAL['orange'], pose='kneel', hat=PAL['trunk']))
B.append(f'<ellipse cx="1020" cy="{y0 - 2}" rx="20" ry="6" fill="{PAL["ink2"]}"/>')
B.append(figure(1080, y0, 15, PAL['pink'], hat=PAL['trunk']))
# the glint
def glint(x, y, s, c):
    return poly([(x, y - s), (x + s * .18, y - s * .18), (x + s, y), (x + s * .18, y + s * .18), (x, y + s), (x - s * .18, y + s * .18), (x - s, y), (x - s * .18, y - s * .18)], c)
B.append(glint(1022, y0 - 18, 16, PAL['cream']))
B.append(glint(1046, y0 - 4, 7, PAL['yellow']))
# a pack mule
mx = 520
B.append(poly([(mx, y0 - 46), (mx + 70, y0 - 46), (mx + 72, y0 - 20), (mx - 2, y0 - 20)], '#6b5a48'))
B.append(poly([(mx + 66, y0 - 50), (mx + 92, y0 - 66), (mx + 100, y0 - 56), (mx + 76, y0 - 36)], '#6b5a48'))
B.append(poly([(mx + 14, y0 - 62), (mx + 56, y0 - 62), (mx + 60, y0 - 44), (mx + 10, y0 - 44)], PAL['cream2']))
for lx in (mx + 4, mx + 16, mx + 56, mx + 66):
    B.append(f'<line x1="{lx}" y1="{y0 - 22}" x2="{lx}" y2="{y0 + 2}" stroke="#4e4134" stroke-width="5"/>')

# framing: junipers and pines left, a tall angular tree right
B.append(scene_tree(30, 1110, 940, lean=0.02, spread=0.24, n_branches=7, seed=21))
B.append(pine(300, 1100, 420))
B.append(pine(220, 1110, 330))
B.append(scene_tree(1830, 1110, 900, lean=-0.05, spread=0.36, n_branches=7, seed=27))
B.append(scene_tree(1600, 1110, 430, lean=0.03, n_branches=5, seed=31, leaf=26))

B.append(title(390, 160, ['The Salted', 'Field'], size=64))
B.append(f'<text x="392" y="330" font-family="Special Elite" font-size="28" fill="{PAL["ink2"]}">Colorado Territory - 1872</text>')

open(sys.argv[1], 'w').write(finish('\n'.join(B)))
