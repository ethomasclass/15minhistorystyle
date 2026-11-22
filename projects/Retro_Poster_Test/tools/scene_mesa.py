# Scene 2: the salted "diamond field" on a mesa in Colorado Territory, 1872, as Clarence King's survey party finds it.
import math, sys
import numpy as np
from facet import *
from figures import *
from trees import scene_tree

seed(23)
B = []
B.append(sky(PAL['sky'], '#c6d0c4', 780))
B.append(cloud2(1350, 300, 1300, 330, PAL['cream'], belly='#e2d3ac', n=11))
B.append(cloud2(1700, 120, 700, 200, PAL['cream'], n=7))
B.append(cloud2(300, 420, 600, 140, PAL['sky2'], belly='#a9bab6', n=8))
B.append(construction(820, 430, 360, a0=190, a1=320))

def mesa(x0, x1, top, base, slope):
    return [(x0 - slope, base), (x0, top + 8), (x0 + 30, top), (x1 - 30, top), (x1, top + 10), (x1 + slope * 1.3, base)]

# ---------------------------------------------------------------- distance
for P_, col in [(mesa(1080, 1560, 548, 740, 120), PAL['mist2']), (mesa(1500, 2000, 600, 770, 90), PAL['mist1'])]:
    B.append(seam(facets(P_, tones(col, 3, 0.05), hill_h(0.004, 80, (0.25, 0)), cell=130, contrast=0.5)))
B.append(mist(690, 90, op=0.45))
B.append(seam(facets(ridgeline(-40, W + 40, 690, 40, 80, 2.2), tones(PAL['mist2'], 4, 0.07), hill_h(0.006, 110), cell=80, contrast=0.9)))
B.append(seam(facets(mesa(1340, 1640, 668, 810, 100), tones(PAL['mist3'], 3, 0.06), hill_h(0.004, 80, (0.25, 0)), cell=120, contrast=0.5)))
B.append(mist(770, 70, op=0.4))

# valley floor far below
floor = [(700, 792), (W + 20, 772), (W + 20, H + 20), (700, H + 20)]
B.append(seam(facets(floor, PAL['sand'][1:], hill_h(0.004, 70), cell=150, contrast=0.4, bias=0.05)))
B.append(f'<path d="M1950,880 C1700,900 1600,850 1420,900 S1100,1000 900,980" stroke="{PAL["sky2"]}" stroke-width="10" fill="none"/>')
B.append(f'<path d="M1950,876 C1700,896 1600,846 1420,896" stroke="{PAL["cream"]}" stroke-width="2" fill="none" opacity="0.7"/>')
for i in range(22):  # sagebrush and small junipers
    x, y = 1330 + rng.random() * 600, 820 + rng.random() * 240
    if rng.random() < 0.3:
        B.append(pine(x, y, 26 + (y - 800) * 0.16, tiers=3))
    else:
        B.append(moss(x, y, 26 + (y - 800) * 0.12, PAL['olive_lt'][:3]))

# ---------------------------------------------------------------- the mesa
top_y = 606
cliff = [(230, top_y + 15), (420, top_y), (900, top_y + 8), (1250, top_y + 2), (1300, top_y + 40), (1326, 760),
         (1362, 900), (1400, H + 20), (160, H + 20)]
B.append(seam(facets(cliff, PAL['sand'], ridge_h(0.022, 110, 0.12, phase=0.4), cell=62, contrast=1.15, jitter=0.35)))
east = [(1250, top_y + 2), (1300, top_y + 40), (1326, 760), (1362, 900), (1400, H + 20), (1240, H + 20), (1215, 800)]
B.append(facets(east, PAL['sand'][:3], ridge_h(0.03, 90, 0.1), cell=55, contrast=0.9))
for x, w in [(560, 18), (840, 12), (1050, 22)]:   # deep cracks
    B.append(poly([(x, top_y + 34), (x + w, top_y + 44), (x + w * 0.4 + 30, H + 20), (x - w + 10, H + 20)], PAL['sand'][0], 'opacity="0.85"'))
# talus at the foot
for x, y, w in [(1400, 1040, 120), (1470, 1070, 90), (1340, 1075, 70)]:
    B.append(rock(x, y, w, PAL['sand']))
mesa_top = [(230, top_y + 15), (420, top_y), (900, top_y + 8), (1250, top_y + 2), (1300, top_y + 40), (1100, top_y + 50), (600, top_y + 46), (230, top_y + 52)]
B.append(seam(facets(mesa_top, PAL['sand'][2:], hill_h(0.01, 50), cell=60, contrast=0.5)))
B.append(f'<polyline points="{pts(mesa_top[:5])}" fill="none" stroke="{PAL["sand"][4]}" stroke-width="4"/>')
gy = lambda x: float(np.interp(x, [230, 420, 900, 1250], [top_y + 15, top_y, top_y + 8, top_y + 2]))
# scrub on the rim and on ledges down the face
for x in (300, 470, 640, 860, 1215):
    B.append(moss(x, gy(x) + 30, 60 + rng.random() * 40))
for x, y, w in [(470, 760, 60), (700, 880, 50), (930, 720, 44), (1130, 840, 56), (380, 940, 70), (990, 1010, 50)]:
    B.append(moss(x, y, w))
for x in (350, 900, 1195):
    B.append(tuft(x, gy(x) + 8, 20))

# ---------------------------------------------------------------- the party on the rim
hh = 132
def man(x, pose, f, **kw):
    return person(x, gy(x) + 12, hh, pose, facing=f, **kw)

# the pack mules
B.append(mule(500, gy(500) + 10, 74, facing=-1, col='#4a3f33'))
B.append(mule(385, gy(385) + 14, 80, facing=1, col='#6e5c49', pack=PAL['cream2']))
# the geologist taking notes
s, J = man(620, 'write', 1, coat=PAL['olive'][1], coat_len=1.0, trousers='#6b6a63', hat='straw', hat_col='#cbb88a', vest=PAL['cream'])
B.append(s + tool(J, J['u'], 'book'))
# Clarence King bent to the transit
s, J = man(740, 'bend', 1, coat=PAL['blue'], coat_len=1.3, trousers='#5b5144', hat='slouch', hat_col='#2f2c28', beard=True)
B.append(s)
tx, ty = 834, gy(834) + 12
for dx in (-30, 2, 30):
    B.append(f'<line x1="{tx}" y1="{ty - 78}" x2="{tx + dx}" y2="{ty}" stroke="{PAL["ink"]}" stroke-width="3.5"/>')
B.append(poly([(tx - 24, ty - 94), (tx + 24, ty - 100), (tx + 26, ty - 86), (tx - 22, ty - 80)], PAL['yellow']))
B.append(poly([(tx - 8, ty - 84), (tx + 8, ty - 84), (tx + 6, ty - 72), (tx - 6, ty - 72)], PAL['ink2']))
# the rodman with a striped survey rod
s, J = man(1215, 'point', -1, coat='#8a5a4a', coat_len=.5, trousers='#4b4a44', hat='cap', hat_col='#3a332b', arm_b=62, elbow_b=30)
rx, ry = J['hand_b']
for k in range(8):
    B.append(poly([(rx - 4, ry + 60 - k * 28), (rx + 4, ry + 60 - k * 28), (rx + 4, ry + 32 - k * 28), (rx - 4, ry + 32 - k * 28)], PAL['red'] if k % 2 else PAL['cream']))
B.append(s)
# the two men who salted the field: one kneeling over his pan, one standing by with his hands on his hips
s, J = man(955, 'kneel', 1, coat=PAL['orange'], coat_len=.3, trousers='#5b5144', hat='slouch', hat_col='#5a4a3a', sleeves=PAL['cream2'], beard=True)
B.append(s + tool(J, J['u'], 'pan'))
px, py = J['hand_b']
def glint(x, y, s_, c):
    return poly([(x, y - s_), (x + s_ * .18, y - s_ * .18), (x + s_, y), (x + s_ * .18, y + s_ * .18), (x, y + s_), (x - s_ * .18, y + s_ * .18), (x - s_, y), (x - s_ * .18, y - s_ * .18)], c)
B.append(glint(px + 12, py - 16, 20, PAL['cream']))
B.append(glint(px + 40, py - 2, 8, PAL['yellow']))
s, J = man(1090, 'hips', -1, view='front', coat='#7a6c4f', coat_len=2.0, trousers='#4b4a44', hat='bowler', hat_col='#2f2c28', vest=PAL['pink'], beard=True)
B.append(s)
B.append(tool({'hand_b': (1150, gy(1150) + 12 - hh / 8)}, hh / 8, 'pick'))

# ---------------------------------------------------------------- framing
B.append(scene_tree(30, 1110, 940, lean=0.02, spread=0.26, seed=21, airy=0.5, clump=0.055))
B.append(pine(300, 1100, 420)); B.append(pine(220, 1110, 330))
B.append(scene_tree(1830, 1110, 900, lean=-0.05, spread=0.38, seed=27, airy=0.55, clump=0.055))
B.append(scene_tree(1610, 1110, 430, lean=0.03, n_branches=5, seed=31, leaf=24, airy=0.0, clump=0.1))

B.append(title(390, 150, ['The Salted', 'Field'], size=64))
B.append(f'<text x="392" y="320" font-family="Special Elite" font-size="28" fill="{PAL["ink2"]}">Colorado Territory - 1872</text>')

open(sys.argv[1], 'w').write(finish('\n'.join(B)))
