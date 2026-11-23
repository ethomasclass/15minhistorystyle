# Ep 1, chapter 4: the pitch room, a Washington office in the 1890s, built in Blender after the Flow plate c1_pitch_room.
# Dark vertical panelling, two tall windows with heavy green curtains, a hanging lamp, the long polished table with six
# chairs (papers, glasses, a carafe), the Pacific map on the back wall, the easel with its blank board at the end of the
# table (the board is the portal into each pitcher's world). The four pitchers: the businessman, the naval captain, the
# minister and the lecturer.
#   xvfb-run -a blender -b --python pitchroom.py -- <out_dir> [scale%] [mode: empty|full]
import bpy, math, os, sys
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/pitchroom'
SCALE = int(argv[1]) if len(argv) > 1 else 100
MODE = argv[2] if len(argv) > 2 else 'full'
KIT = os.path.join(HERE, '..', '..', 'tests', 'blender_church')

# ---- the kit: helpers, light, sky and compositor from the church scene, and the people library
saved = sys.argv
sys.argv = [sys.argv[0], '--', '/tmp/unused', 'lib']
PG = {'__file__': os.path.join(KIT, 'people_samples.py'), '__name__': 'people'}
try:
    exec(compile(open(PG['__file__']).read(), PG['__file__'], 'exec'), PG)
except Exception as e:
    if type(e).__name__ != 'LibDone':
        raise
sys.argv = saved
CG = PG['G']
box, prism, mesh_from, ico, cyl, empty, mat = (CG[k] for k in ('box', 'prism', 'mesh_from', 'ico', 'cyl', 'empty', 'mat'))
person, stand = PG['person'], PG['stand']
sc = bpy.context.scene
KEEP = {'sun', 'cam', 'target', 'Human Armature', 'Human_Mesh'}
for ob in list(bpy.data.objects):
    if ob.name not in KEEP:
        bpy.data.objects.remove(ob, do_unlink=True)
CG['MOVERS'].clear()
FPS = 30

# ---- palette (from the plate)
PANEL, PANEL_DK, GROOVE = '#5c4330', '#4a3526', '#352619'
FLOOR, FLOOR_DK = '#3a2c22', '#2e231b'
TABLE, TABLE_DK = '#8a5634', '#6a4128'
CHAIR, CHAIR_DK = '#4a3020', '#3a2518'
CURT, CURT_DK, CURT_LT = '#3f5a2c', '#2b4020', '#58703a'
SILL = '#5a4130'
PAPER, GLASS = '#e9dfc4', '#b9cfcf'
BRASS = '#b08a4a'

# ---- the room: back wall at y = 8, side walls at x = +-7, floor and ceiling
X0, X1, Y1, ZC = -7.0, 7.0, 8.0, 4.4
box('floor', X0, -6, -0.05, X1, Y1, 0.0, FLOOR)
for k in range(20):
    x = X0 + k * 0.7
    box(f'fb{k}', x, -6, 0.0, x + 0.012, Y1, 0.004, FLOOR_DK)
box('ceiling', X0, -6, ZC - 0.02, X1, Y1 + 0.4, ZC + 0.1, '#4a3828')
WIN = [(-5.3, 1.25), (-1.4, 1.25)]                         # (centre x, width) of the two windows
Z_W0, Z_W1 = 0.95, 3.55
# back wall in pieces around the windows, then panel boards and grooves
xs = [X0] + [v for c, w in WIN for v in (c - w / 2, c + w / 2)] + [X1]
for i in range(0, len(xs), 2):
    box(f'bw{i}', xs[i], Y1, 0, xs[i + 1], Y1 + 0.15, ZC, PANEL)
for c, w in WIN:
    box(f'bwlo{c}', c - w / 2, Y1, 0, c + w / 2, Y1 + 0.15, Z_W0, PANEL)
    box(f'bwhi{c}', c - w / 2, Y1, Z_W1, c + w / 2, Y1 + 0.15, ZC, PANEL)
for k in range(int((X1 - X0) / 0.62)):
    x = X0 + 0.31 + k * 0.62
    if any(abs(x - c) < w / 2 + 0.05 for c, w in WIN) and True:
        box(f'gr{k}lo', x - 0.012, Y1 - 0.01, 0, x + 0.012, Y1, Z_W0, GROOVE)
        box(f'gr{k}hi', x - 0.012, Y1 - 0.01, Z_W1, x + 0.012, Y1, ZC, GROOVE)
    else:
        box(f'gr{k}', x - 0.012, Y1 - 0.01, 0, x + 0.012, Y1, ZC, GROOVE)
box('baseboard', X0, Y1 - 0.05, 0, X1, Y1, 0.22, PANEL_DK)
box('rail', X0, Y1 - 0.06, ZC - 0.32, X1, Y1, ZC - 0.24, PANEL_DK)
for sx in (-1, 1):
    box(f'side{sx}', sx * X1 - (0.15 if sx > 0 else 0), -6, 0, sx * X1 + (0.0 if sx > 0 else 0.15), Y1, ZC, PANEL_DK)
# the windows: frames, sashes, bright sky beyond, heavy curtains in folds
for c, w in WIN:
    box(f'sky{c}', c - w / 2 - 0.2, Y1 + 0.6, Z_W0 - 0.2, c + w / 2 + 0.2, Y1 + 0.65, Z_W1 + 0.2, '#dfe8e3')
    box(f'sill{c}', c - w / 2 - 0.12, Y1 - 0.12, Z_W0 - 0.08, c + w / 2 + 0.12, Y1 + 0.15, Z_W0, SILL)
    for xx in (c - w / 2, c - 0.025, c + w / 2 - 0.05):
        box(f'mull{c}{xx:.2f}', xx, Y1 + 0.05, Z_W0, xx + 0.05, Y1 + 0.1, Z_W1, SILL)
    for zz in (Z_W0 + (Z_W1 - Z_W0) * 0.5, Z_W1 - 0.05):
        box(f'tran{c}{zz:.2f}', c - w / 2, Y1 + 0.05, zz, c + w / 2, Y1 + 0.1, zz + 0.05, SILL)
    box(f'pelmet{c}', c - w / 2 - 0.55, Y1 - 0.2, Z_W1 + 0.15, c + w / 2 + 0.55, Y1, Z_W1 + 0.4, PANEL_DK)
    for sx in (-1, 1):
        for k in range(4):                                   # four folds a side, alternating light and dark
            x = c + sx * (w / 2 + 0.06 + k * 0.13)
            col = (CURT, CURT_DK, CURT_LT, CURT_DK)[k]
            box(f'curt{c}{sx}{k}', x - 0.08, Y1 - 0.16 + 0.04 * (k % 2), 0.05, x + 0.08, Y1 - 0.04, Z_W1 + 0.15, col)
# the map on the back wall (the Pacific), in a wooden frame with a cream mat
MX0, MX1, MZ0, MZ1 = 1.0, 5.9, 1.55, 4.0
box('mapframe', MX0 - 0.12, Y1 - 0.06, MZ0 - 0.12, MX1 + 0.12, Y1, MZ1 + 0.12, '#7a5434')
box('mapmat', MX0 - 0.05, Y1 - 0.075, MZ0 - 0.05, MX1 + 0.05, Y1 - 0.06, MZ1 + 0.05, '#e9dcbc')
bpy.ops.mesh.primitive_plane_add(size=1)
mp = bpy.context.active_object
mp.name = 'map'
mp.scale = ((MX1 - MX0), (MZ1 - MZ0), 1)
mp.rotation_euler = (math.radians(90), 0, 0)
mp.location = ((MX0 + MX1) / 2, Y1 - 0.08, (MZ0 + MZ1) / 2)
mm = bpy.data.materials.new('pitchmap')
mm.use_nodes = True
tx = mm.node_tree.nodes.new('ShaderNodeTexImage')
tx.image = bpy.data.images.load(os.path.join(HERE, 'assets', 'pitch_map.png'))
mm.node_tree.links.new(tx.outputs['Color'], mm.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
mm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 1.0
mp.data.materials.append(mm)

# ---- the table, six chairs, papers, glasses, carafe
TX0, TX1, TY0, TY1, TZ = -5.6, 2.6, 2.9, 4.7, 0.78
box('tabletop', TX0, TY0, TZ - 0.07, TX1, TY1, TZ, TABLE)
box('apron', TX0 + 0.1, TY0 + 0.1, TZ - 0.2, TX1 - 0.1, TY1 - 0.1, TZ - 0.07, TABLE_DK)
for x in (TX0 + 0.15, TX1 - 0.25, (TX0 + TX1) / 2 - 0.05):
    for y in (TY0 + 0.15, TY1 - 0.25):
        box(f'tleg{x:.1f}{y:.1f}', x, y, 0, x + 0.1, y + 0.1, TZ - 0.2, TABLE_DK)


def chair(name, cx, cy, face):
    """face: +1 faces +y (back toward the camera), -1 faces -y"""
    box(name + 'seat', cx - 0.24, cy - 0.24, 0.46, cx + 0.24, cy + 0.24, 0.52, CHAIR)
    for dx in (-0.21, 0.17):
        for dy in (-0.21, 0.17):
            box(f'{name}l{dx}{dy}', cx + dx, cy + dy, 0, cx + dx + 0.04, cy + dy + 0.04, 0.46, CHAIR_DK)
    by = cy - face * 0.24
    box(name + 'top', cx - 0.25, by - 0.03, 1.02, cx + 0.25, by + 0.03, 1.12, CHAIR)
    for k in range(5):
        x = cx - 0.2 + k * 0.1
        box(f'{name}s{k}', x - 0.018, by - 0.02, 0.52, x + 0.018, by + 0.02, 1.02, CHAIR_DK)
    for sx in (-1, 1):
        box(f'{name}p{sx}', cx + sx * 0.23 - 0.025, by - 0.03, 0.46, cx + sx * 0.23 + 0.025, by + 0.03, 1.14, CHAIR)


for i, x in enumerate((-4.4, -1.6, 1.2)):
    chair(f'ch_b{i}', x, TY1 + 0.45, -1)                    # behind the table, facing the camera
    chair(f'ch_f{i}', x + 0.3, TY0 - 0.45, 1)               # this side, backs to the camera
for i, (x, y, r) in enumerate(((-4.6, 3.4, 8), (-3.6, 4.1, -5), (-1.9, 3.5, 12), (-0.8, 4.2, -9), (0.6, 3.4, 4), (1.6, 4.0, -12))):
    p = box(f'paper{i}', x - 0.22, y - 0.15, TZ, x + 0.22, y + 0.15, TZ + 0.005, PAPER)
    p.rotation_euler[2] = math.radians(r)
for i, (x, y) in enumerate(((-5.0, 3.9), (-2.7, 3.3), (-1.2, 3.9), (0.1, 3.3), (2.0, 3.7))):
    cyl(f'glass{i}', (x, y, TZ), (x, y, TZ + 0.13), 0.04, 0.047, GLASS, n=10)
cyl('carafe', (-2.0, 3.85, TZ), (-2.0, 3.85, TZ + 0.2), 0.09, 0.07, GLASS, n=12)
cyl('carafe_neck', (-2.0, 3.85, TZ + 0.2), (-2.0, 3.85, TZ + 0.32), 0.04, 0.03, GLASS, n=12)

# ---- the easel and its blank board (the portal), at the end of the table
EX, EY = 4.3, 4.2
BW, BH, BZ = 1.15, 1.45, 1.05                                # the board: width, height, bottom edge
board = box('board', EX - BW / 2, EY - 0.03, BZ, EX + BW / 2, EY, BZ + BH, '#efe6d0')
box('boardframe', EX - BW / 2 - 0.05, EY, BZ - 0.05, EX + BW / 2 + 0.05, EY + 0.04, BZ + BH + 0.05, '#8a6a45')
for sx in (-1, 1):
    cyl(f'eleg{sx}', (EX + sx * 0.5, EY - 0.25, 0), (EX + sx * 0.12, EY + 0.02, BZ + BH + 0.25), 0.025, 0.02, '#8a6a45', n=6)
cyl('eleg_back', (EX, EY + 0.7, 0), (EX, EY + 0.05, BZ + BH + 0.1), 0.025, 0.02, '#8a6a45', n=6)
box('eledge', EX - 0.6, EY - 0.12, BZ - 0.08, EX + 0.6, EY + 0.04, BZ - 0.03, '#8a6a45')

# ---- the hanging lamp over the table, and the light: daylight through the windows, the lamp's warm pool
LX, LY = -3.2, 3.8
cyl('lampcord', (LX, LY, ZC), (LX, LY, 2.55), 0.008, 0.008, '#222222', n=4)
cyl('lampshade', (LX, LY, 2.55), (LX, LY, 2.25), 0.07, 0.38, BRASS, n=12)
ico('lampbulb', (LX, LY, 2.24), 0.06, '#fff3d0', 1)
lp = bpy.data.lights.new('lamp', 'SPOT')
lp.energy, lp.color, lp.spot_size, lp.spot_blend, lp.shadow_soft_size = 1300, (1.0, 0.85, 0.62), math.radians(95), 0.35, 0.2
lpo = bpy.data.objects.new('lamp', lp)
sc.collection.objects.link(lpo)
lpo.location = (LX, LY, 2.2)
for i, (c, w) in enumerate(WIN):
    wl = bpy.data.lights.new(f'win{i}', 'AREA')
    wl.energy, wl.size, wl.color = 520, 1.4, (0.86, 0.93, 1.0)
    wo = bpy.data.objects.new(f'win{i}', wl)
    sc.collection.objects.link(wo)
    wo.location = (c, Y1 - 0.2, (Z_W0 + Z_W1) / 2)
    wo.rotation_euler = (math.radians(-75), 0, 0)
fill = bpy.data.lights.new('roomfill', 'AREA')
fill.energy, fill.size, fill.color = 520, 7.0, (1.0, 0.9, 0.78)
fo = bpy.data.objects.new('roomfill', fill)
sc.collection.objects.link(fo)
fo.location = (0, 0.5, ZC - 0.2)
bpy.data.objects['sun'].data.energy = 0.0                    # indoors: no sun

# ---- the four pitchers, standing behind the table in a loose row (only in 'full')
N = 60
if MODE == 'full':
    PITCHERS = [('businessman', (-3.1, 5.75), 182, {}), ('captain', (-1.0, 6.0), 178, {}),
                ('minister', (0.9, 5.8), 186, {'RightArm': (60, 0, -20), 'RightForeArm': (0, 0, -60)}),
                ('lecturer', (2.9, 5.6), 200, {'RightArm': (40, 0, -30), 'RightForeArm': (0, 0, -20)})]
    for i, (cos, (x, y), hd, pose) in enumerate(PITCHERS):
        root, arm = person(f'p_{cos}', cos, (x, y, 0.0), hd)
        stand(arm, N, pose=pose, k=i * 0.7)

# ---- the finishing pass, then the camera after the plate (eye level, square to the back wall)
LK = {'__name__': 'look'}
exec(compile(open(os.path.join(HERE, 'look.py')).read(), os.path.join(HERE, 'look.py'), 'exec'), LK)
LK['finish'](sc, fill_strength=0.7, haze=(60.0, 400.0, 0.0), rules={
    PANEL: (0.10, 0.9, None, 1.0), PANEL_DK: (0.08, 0.9, None, 1.0), FLOOR: (0.10, 0.6, None, 1.0), TABLE: (0.07, 1.2, None, 1.0),
    CURT: (0.10, 1.4, None, 1.0), CURT_DK: (0.10, 1.4, None, 1.0), CURT_LT: (0.10, 1.4, None, 1.0), PAPER: (0.03, 2.0, None, 1.0)})
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
cam.data.lens = 30
cam.location, tgt.location = (-0.6, -4.6, 1.65), (-0.2, 8.0, 1.75)
cam.data.dof.use_dof = True
cam.data.dof.focus_distance = 9.0
cam.data.dof.aperture_fstop = 4.0
sc.frame_start, sc.frame_end = 0, N - 1
sc.render.resolution_percentage = SCALE
os.makedirs(OUT, exist_ok=True)
sc.frame_set(0)
sc.render.filepath = os.path.join(OUT, f'pitchroom_{MODE}.png')
bpy.ops.render.render(write_still=True)
print('PITCHROOM', MODE, 'written')
