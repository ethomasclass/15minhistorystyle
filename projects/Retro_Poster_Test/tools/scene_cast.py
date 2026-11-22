# Character sheet: the figure rig at large size, to check proportions, clothes, poses and shadows.
import sys
from facet import *
from figures import *

B = [f'<rect x="0" y="880" width="{W}" height="200" fill="{PAL["cream2"]}"/>']
G = 880
def put(svg_j, extra=''):
    B.append(svg_j[0] + extra)
    return svg_j[1]

h = 330
J = put(person(150, G, h, 'carry', coat=PAL['blue'], coat_len=.7, trousers='#6f8194', hat='kepi', hat_col='#39485a', belt='#23211e', strap=PAL['cream'], beard=True))
B.append(rifle(J, J['u']))
J = put(person(400, G, h, 'haul', coat=PAL['blue'], coat_len=.5, trousers='#6f8194', hat='kepi', hat_col='#39485a', belt='#23211e'))
J = put(person(640, G, h, 'glass', coat='#3d4d5e', coat_len=1.6, trousers='#6f8194', hat='slouch', hat_col='#2f2c28', beard=True, belt='#a9473a'))
B.append(tool(J, J['u'], 'glass'))
J = put(person(900, G, h, 'kneel', coat=PAL['orange'], coat_len=.3, trousers='#5b5144', hat='slouch', hat_col='#5a4a3a', sleeves=PAL['cream2']))
B.append(tool(J, J['u'], 'pan'))
J = put(person(1150, G, h, 'hips', view='back', coat=PAL['pink'], coat_len=.4, trousers=PAL['ink2'], hair='#3a2e25'))
J = put(person(1380, G, h, 'walk', coat='#7a6c4f', coat_len=2.2, trousers='#4b4a44', hat='bowler', hat_col='#2f2c28', collar=PAL['cream']))
J = put(person(1600, G, h * .96, 'shade', facing=-1, coat='#8a5a4a', dress=True, hat='bonnet', hat_col=PAL['cream2'], hair='#5b4330'))
J = put(person(1790, G, h, 'write', facing=-1, coat=PAL['olive'][1], coat_len=1.0, trousers='#6b6a63', hat='straw', hat_col='#cbb88a', vest=PAL['cream']))
B.append(tool(J, J['u'], 'book', -1))
B.append(mule(960, 560, 150, facing=1, pack=PAL['cream2']))
B.append(mule(1300, 560, 150, facing=-1, col='#4a3f33', horse=True))
B.append(title(80, 110, ['The cast'], size=56))
open(sys.argv[1], 'w').write(finish('\n'.join(B)))
