# Stills of the gridded desk in four colours, each dressed the same way (two archive cards, a Highlight, a Slip, a
# hand-drawn loop, a source tag), to choose which surfaces alternate with the black one.
#   python3 desk_variants.py && for v in black teal coral bone; do node anim_render.mjs ../build/desk_$v; done
import os
from kit import *

I = lambda p: os.path.join(ROOT, p)
# surface, mark colour, loop colour, tag colour, note
V = {'black': (TEAL, CORAL, '#d9d2c4'), 'teal': (CREAM, CORAL, '#d6f3ee'), 'coral': (TEAL, CREAM, '#ffe6de'), 'bone': ('#0f5b52', CORAL, '#4a463e')}
for name, (mark, loop, tagc) in V.items():
    S = Stage(f'desk_{name}', 1 / 30, bg='#111')
    S.defs.append(COMMON_DEFS)
    S.world.append(f'<image href="{S.img(I(f"img/desk_grid_{name}.jpg"))}" x="0" y="0" width="1920" height="1080"/>')
    S.world.append(card(S.img(I('img/raw/nara_hawaiipetition.jpg')), 1250, 150, 430, 714, rot=4))
    S.world.append(card(S.img(I('img/raw/loc_liliuokalani_1891.jpg')), 820, 170, 520, 660, rot=-3))
    S.world.append(drawn_path(loop_path(1465, 250, 200, 60, seed=2), 1, loop, 7))
    S.world.append(drawn_path('M640,640 C700,560 760,520 810,500', 1, mark, 7) + drawn_path('M772,498 L812,500 L800,538', 1, mark, 7))
    S.world.append(note(250, 700, 'her own words', 44, mark))
    S.world.append(highlight(110, 170, 'Liliʻuokalani', 88))
    S.world.append(slip(120, 290, 'Queen of Hawaiʻi, 1891–1893', 30))
    S.world.append(tag(110, 1040, 'LILIʻUOKALANI, c. 1891 · LIBRARY OF CONGRESS   |   PETITION, 1897 · NATIONAL ARCHIVES', 18, tagc))
    S.write(lambda t: {})
