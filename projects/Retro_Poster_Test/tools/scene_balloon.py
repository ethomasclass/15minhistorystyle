# Scene 1: Professor Lowe's balloon Intrepid tethered over the Union lines at Fair Oaks, Virginia, June 1862.
import math, sys
import numpy as np
from facet import *
from figures import *
from trees import scene_tree

seed(11)
B = []
BLUE, LTBLUE, KEPI = PAL['blue'], '#6f8194', '#39485a'

# ---------------------------------------------------------------- sky
B.append(sky(PAL['sky'], '#c3cfc6', 680))
B.append(cloud2(420, 330, 1100, 300, PAL['cream'], belly='#e2d3ac', n=10))
B.append(cloud2(250, 120, 900, 260, PAL['cream'], n=8))
B.append(cloud2(1650, 470, 700, 170, PAL['sky2'], belly='#a9bab6', n=8))
B.append(cloud2(1500, 220, 520, 120, PAL['cream2'], belly='#d8c79d', n=7))
B.append(construction(1230, 310, 330, a0=195, a1=345))

# ---------------------------------------------------------------- distance: faceted ridges with haze between them
for y, amp, col, sv in [(560, 70, PAL['mist1'], 1.3), (600, 60, PAL['mist2'], 4.1), (648, 46, PAL['mist3'], 7.7)]:
    B.append(seam(facets(ridgeline(-40, W + 40, y, amp, 70, sv), tones(col, 4, 0.07), hill_h(0.006, 120), cell=85, contrast=0.9)))
    B.append(mist(y + 46, 70, op=0.42))

# ---------------------------------------------------------------- the valley and the camp
valley = [(-20, 655), (W + 20, 640), (W + 20, H + 20), (-20, H + 20)]
B.append(seam(facets(valley, PAL['olive_lt'], hill_h(0.003, 90, (0, 0.05)), cell=170, contrast=0.38, bias=0.1)))
for i in range(7):   # far fields: thin plough strips
    x0 = 80 + i * 270 + rng.random() * 60
    B.append(poly([(x0, 668), (x0 + 150, 664), (x0 + 190, 678), (x0 + 20, 683)], PAL['olive'][2 + i % 2], 'opacity="0.55"'))
B.append(f'<path d="M250,1100 C420,960 560,900 690,820 S860,720 1010,676" stroke="{PAL["cream2"]}" stroke-width="26" fill="none" stroke-linecap="round" opacity="0.9"/>')

def tent(x, y, s):
    return (poly([(x + s * .9, y), (x + s * 2.0, y + s * .22), (x, y)], '#1f2a38', 'opacity="0.16"')
            + poly([(x, y - s), (x - s * .9, y), (x, y)], PAL['cream'])
            + poly([(x, y - s), (x + s * .9, y), (x, y)], '#d9c9a0')
            + poly([(x, y - s), (x + s * .15, y), (x - s * .15, y)], PAL['ink2']))

for row, (y, s, n) in enumerate([(700, 15, 27), (738, 19, 22), (786, 25, 17)]):
    for i in range(n):
        x = 110 + i * (1560 / n) + (row * 31 % 40) + (rng.random() - .5) * 18
        if (640 < x < 760 and row > 0) or (x > 1120 and row == 2):
            continue
        B.append(tent(x, y + (rng.random() - .5) * 6, s))

def wagon(x, y, s=1.0):
    o = poly([(x - 26 * s, y - 12 * s), (x + 26 * s, y - 12 * s), (x + 24 * s, y - 4 * s), (x - 24 * s, y - 4 * s)], PAL['trunk'])
    o += poly([(x - 25 * s, y - 12 * s), (x - 20 * s, y - 32 * s), (x + 20 * s, y - 32 * s), (x + 25 * s, y - 12 * s)], PAL['cream'])
    o += poly([(x, y - 32 * s), (x + 20 * s, y - 32 * s), (x + 25 * s, y - 12 * s), (x + 2 * s, y - 12 * s)], '#d9c9a0')
    for wx in (-15, 15):
        o += f'<circle cx="{x + wx * s}" cy="{y - 3 * s}" r="{7 * s}" fill="none" stroke="{PAL["ink"]}" stroke-width="{2.4 * s}"/>'
    return o

B.append(wagon(500, 806, 1.1)); B.append(wagon(580, 800, 1.0)); B.append(wagon(1420, 730, 0.8))
B.append(f'<line x1="310" y1="822" x2="462" y2="822" stroke="{PAL["trunk"]}" stroke-width="2"/>')
for i, x in enumerate([330, 366, 404, 440]):   # picketed horses
    B.append(mule(x, 842, 30, facing=1 if i % 2 else -1, col=['#6e5c49', '#4a3f33', '#8a7558', '#5b4a3b'][i], horse=True, shadow=False))
# flag
B.append(f'<line x1="700" y1="792" x2="700" y2="652" stroke="{PAL["ink"]}" stroke-width="3"/>')
B.append(poly([(702, 654), (760, 660), (756, 692), (702, 688)], PAL['red']))
for k in range(3):
    B.append(poly([(702, 660 + k * 10), (759, 665 + k * 10), (759, 669 + k * 10), (702, 664 + k * 10)], PAL['cream']))
B.append(poly([(702, 654), (728, 657), (727, 673), (702, 671)], PAL['blue']))
# cook fire and smoke
B.append(poly([(628, 792), (640, 770), (652, 792)], PAL['orange']))
for i in range(6):
    B.append(f'<circle cx="{640 + i * 9 + math.sin(i) * 14:.0f}" cy="{760 - i * 34}" r="{12 + i * 5}" fill="{PAL["cream"]}" opacity="{0.5 - i * 0.07:.2f}"/>')
# small soldiers about the camp
for x, y, pose, f in [(606, 800, 'sit', 1), (672, 796, 'stand', -1), (820, 770, 'walk', 1), (905, 742, 'carry', -1),
                      (1050, 712, 'walk', -1), (250, 760, 'walk', 1), (1240, 760, 'stand', 1), (1300, 762, 'ease', -1)]:
    s, J = person(x, y, 38 if y > 750 else 30, pose, facing=f, coat=BLUE, coat_len=.6, trousers=LTBLUE, hat='kepi', hat_col=KEPI, shadow=False)
    B.append(s)

# ---------------------------------------------------------------- the launch ground (foreground rise)
top = [(600, 925), (760, 868), (980, 840), (1250, 828), (1500, 838), (1720, 852), (1940, 836)]
rise = [(540, H + 20)] + top + [(1940, H + 20)]
gy = lambda x: float(np.interp(x, [p[0] for p in top], [p[1] for p in top]))
B.append(seam(facets(rise, PAL['olive'], hill_h(0.004, 110, (0.02, -0.08)), cell=130, contrast=0.6, bias=-0.06)))
B.append(f'<polyline points="{pts(top)}" fill="none" stroke="{PAL["olive_lt"][3]}" stroke-width="5" stroke-linejoin="bevel"/>')
for x in (640, 705, 1090, 1410, 1610, 1780):
    B.append(tuft(x, gy(x) + 6, 22 + rng.random() * 10))
B.append(rock(1068, gy(1068) + 18, 56)); B.append(rock(1795, gy(1795) + 20, 44))

# rock crag, lower left, with a newspaper artist sitting on it
crag = [(-20, 770), (90, 752), (230, 772), (318, 846), (336, 1000), (350, H + 20), (-20, H + 20)]
B.append(seam(facets(crag, PAL['rock'], ridge_h(0.03, 90, 0.1), cell=62, contrast=1.1)))
ctop = [(-20, 770), (90, 752), (230, 772), (210, 792), (60, 786), (-20, 792)]
B.append(facets(ctop, PAL['olive'], hill_h(0.02, 40), cell=40))
B.append(moss(250, 800, 70)); B.append(moss(120, 790, 90)); B.append(moss(300, 900, 46))

# ---------------------------------------------------------------- the balloon
cx, cy, r = 1230, 310, 165
env = [(cx + r * math.cos(a) * 0.93, cy + r * math.sin(a) * (1.05 if math.sin(a) > 0 else 1.0)) for a in np.linspace(0, 2 * math.pi, 48, endpoint=False)]
env = [(x, y + (max(0, y - cy) ** 1.6) * 0.012) for x, y in env]
sphere = lambda x, y: 300 * math.sqrt(max(0.0, 1 - ((x - cx) / (r * 1.25)) ** 2 - ((y - cy - 10) / (r * 1.25)) ** 2))
bal = facets(env, ['#7d5f37', '#9f7e4c', '#c4a267', '#dcc086', '#ecd9a7'], sphere, cell=46, contrast=1.25, jitter=0.3)
for k in range(-3, 4):
    f_ = k / 3.6
    d = f'M{cx},{cy - r + 2} C{cx + f_ * r * 1.25:.1f},{cy - r * .6} {cx + f_ * r * 1.25:.1f},{cy + r * .5} {cx + f_ * 22:.1f},{cy + r + 24}'
    bal += f'<path d="{d}" stroke="{PAL["ink2"]}" stroke-width="1.6" fill="none" opacity="0.5"/>'
bal += f'<rect x="{cx - 118}" y="{cy - 14}" width="236" height="44" fill="{PAL["cream"]}" opacity="0.92"/>'
bal += f'<text x="{cx - 4}" y="{cy + 18}" text-anchor="middle" font-family="Special Elite" font-size="34" fill="{PAL["red"]}" letter-spacing="4">INTREPID</text>'
neck_y = cy + r + 26
bal += poly([(cx - 22, neck_y - 8), (cx + 22, neck_y - 8), (cx + 10, neck_y + 22), (cx - 10, neck_y + 22)], '#9f7e4c')
B.append(seam(bal))
bx, by = cx, neck_y + 100
for dx in (-60, -25, 25, 60):
    B.append(f'<line x1="{cx + dx * 1.8}" y1="{cy + r * .55}" x2="{bx + dx * .5}" y2="{by - 24}" stroke="{PAL["ink2"]}" stroke-width="1.4"/>')
s, Ja = person(bx - 15, by + 2, 62, 'glass', coat='#3d4d5e', coat_len=1.2, trousers=LTBLUE, hat='slouch', beard=True, shadow=False)
B.append(s + tool(Ja, Ja['u'], 'glass'))
s, Jb = person(bx + 14, by + 2, 60, 'write', facing=-1, coat=PAL['orange'], coat_len=.6, hat='bowler', shadow=False)
B.append(s)
B.append(poly([(bx - 40, by - 26), (bx + 40, by - 26), (bx + 33, by + 8), (bx - 33, by + 8)], '#8a6a3c'))
B.append(poly([(bx, by - 26), (bx + 40, by - 26), (bx + 33, by + 8), (bx, by + 8)], '#6f5530'))
for k in range(-3, 4):
    B.append(f'<line x1="{bx + k * 11}" y1="{by - 26}" x2="{bx + k * 9.5}" y2="{by + 8}" stroke="#5a4426" stroke-width="1.2" opacity="0.6"/>')
for sx in (-44, 44):   # sandbags
    B.append(f'<ellipse cx="{bx + sx}" cy="{by - 4}" rx="7" ry="11" fill="{PAL["cream2"]}"/>')

# ---------------------------------------------------------------- the ground crew
hh = 150
def soldier(x, pose, f, **kw):
    a = dict(coat=BLUE, coat_len=.6, trousers=LTBLUE, hat='kepi', hat_col=KEPI, belt='#23211e')
    a.update(kw)
    return person(x, gy(x) + 4, hh, pose, facing=f, **a)

s1, J1 = soldier(1005, 'haul', 1)
s2, J2 = soldier(900, 'pull', 1, skin=SKIN[3], hat='cap', hat_col=KEPI)
s3, J3 = soldier(1490, 'haul', -1, beard=True)
s4, J4 = soldier(1590, 'pull', -1, coat='#5d6f7d')
# ropes run from the basket through the hands, then trail on the ground
B.append(rope([(bx - 30, by + 8), J1['hand_b'], J2['hand_b'], (835, gy(835) - 6), (800, gy(800) + 2)], sag=0.03))
B.append(rope([(bx + 30, by + 8), J3['hand_b'], J4['hand_b'], (1650, gy(1650) - 4), (1672, gy(1672) + 4)], sag=0.03))
B.append(rope([(bx, by + 8), (1262, gy(1262) - 30)], sag=0.02))
B.append(poly([(1254, gy(1262) + 6), (1262, gy(1262) - 40), (1272, gy(1262) + 6)], PAL['trunk']))   # anchor stake
B += [s2, s1, s3, s4]
# the officer with a spyglass, and the telegraph operator at his key (Lowe wired reports down from the basket)
s, J = soldier(1140, 'glass', 1, coat='#33414f', coat_len=1.5, hat='slouch', hat_col='#2f2c28', beard=True, belt=PAL['red'])
B.append(s + tool(J, J['u'], 'glass'))
kx = 1352
B.append(poly([(kx - 34, gy(kx) + 4), (kx + 6, gy(kx) + 4), (kx + 6, gy(kx) - 26), (kx - 34, gy(kx) - 26)], '#6d5a43'))
B.append(poly([(kx - 14, gy(kx) + 4), (kx + 6, gy(kx) + 4), (kx + 6, gy(kx) - 26), (kx - 14, gy(kx) - 26)], '#58483a'))
B.append(f'<path d="M{kx - 14},{gy(kx) - 26} Q{kx - 120},{(gy(kx) + by) / 2} {bx + 20},{by + 8}" stroke="{PAL["ink2"]}" stroke-width="1.3" fill="none" stroke-dasharray="3 6"/>')
s, J = soldier(kx + 62, 'kneel', -1, coat=PAL['pink'], coat_len=.3, hat=None, hair=HAIR[1], sleeves=PAL['cream2'])
B.append(s)
s, J = soldier(742, 'carry', 1, strap=PAL['cream'])
B.append(s + rifle(J, J['u']))

# Lowe's gas generator wagon
wx, wy = 1700, gy(1700) + 6
B.append(poly([(wx - 86, wy - 30), (wx + 86, wy - 30), (wx + 86, wy - 104), (wx - 86, wy - 104)], '#5d6f7d'))
B.append(poly([(wx, wy - 30), (wx + 86, wy - 30), (wx + 86, wy - 104), (wx, wy - 104)], '#4b5b68'))
B.append(poly([(wx - 92, wy - 104), (wx + 92, wy - 104), (wx + 86, wy - 114), (wx - 86, wy - 114)], '#33414f'))
B.append(poly([(wx - 30, wy - 114), (wx - 12, wy - 114), (wx - 12, wy - 150), (wx - 30, wy - 150)], PAL['ink2']))
B.append(f'<text x="{wx - 76}" y="{wy - 62}" font-family="Special Elite" font-size="15" fill="{PAL["cream"]}">GAS GENERATOR</text>')
for k in (-52, 52):
    B.append(f'<circle cx="{wx + k}" cy="{wy - 24}" r="26" fill="none" stroke="{PAL["ink"]}" stroke-width="6"/>')
    for a in range(0, 180, 45):
        B.append(f'<line x1="{wx + k - 24 * math.cos(math.radians(a)):.1f}" y1="{wy - 24 - 24 * math.sin(math.radians(a)):.1f}" x2="{wx + k + 24 * math.cos(math.radians(a)):.1f}" y2="{wy - 24 + 24 * math.sin(math.radians(a)):.1f}" stroke="{PAL["ink"]}" stroke-width="2.5"/>')
B.append(rope([(wx - 86, wy - 40), (1560, gy(1560) + 22), (1420, gy(1420) + 30), (1290, gy(1290) + 14)], col='#4b4a44', w=5, sag=0.05))

# ---------------------------------------------------------------- framing trees
B.append(scene_tree(60, 1110, 930, lean=0.04, spread=0.38, seed=5, airy=0.55, clump=0.055))
B.append(scene_tree(1860, 1110, 860, lean=-0.05, spread=0.4, seed=8, airy=0.55, clump=0.055))
B.append(pine(1880, 905, 250)); B.append(pine(1832, 900, 170))
B.append(scene_tree(400, 880, 250, lean=0.02, n_branches=5, seed=12, leaf=20, airy=0.0, clump=0.11))

# the artist on the crag
s, J = person(236, 776, 128, 'sit', facing=1, coat='#7a6c4f', coat_len=.3, trousers='#4b4a44', hat='straw', hat_col='#cbb88a', vest=PAL['cream'], shadow=False)
B.append(s + tool(J, J['u'], 'book'))

B.append(title(560, 150, ['Above the Lines'], size=64))
B.append(f'<text x="562" y="250" font-family="Special Elite" font-size="28" fill="{PAL["ink2"]}">Fair Oaks, Virginia - 1862</text>')

open(sys.argv[1], 'w').write(finish('\n'.join(B)))
