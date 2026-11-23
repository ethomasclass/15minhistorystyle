# Ep 1 cold open (chapters 1 and 2 up to "But first"), built in Blender in the diorama style, copied from the Flow plates
# (p4_palace, a1_prison_room, a3_palace_hall). Shots, timed to the placeholder narration:
#   A  0.00-5.23   the locked room: the Queen at the window, from behind; the camera drifts from the door toward her
#   B  5.23-7.78   the upstairs hall: a guard of the Republic stands at her door
#   C1 7.78-24.5   back in the room, close behind her; a slow push toward the window
#   C2 24.5-41.37  outside: the camera pulls back from her window and cranes up to the whole palace, the flag waving
#   (then the hard cut to the Declaration on the desk, which stays 2D)
#   xvfb-run -a blender -b --python coldopen.py -- <out_dir> <first> <last> [scale%]
import bpy, bmesh, math, os, sys
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/coldopen'
F0, F1 = (int(argv[1]), int(argv[2])) if len(argv) > 2 else (0, 0)
SCALE = int(argv[3]) if len(argv) > 3 else 100
KIT = os.path.join(HERE, '..', '..', 'tests', 'blender_church')

# ---- the kit: the church scene's helpers, light, sky and compositor, and the people library
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
box, prism, mesh_from, ico, cyl, empty, mat, lin, terrain = (CG[k] for k in ('box', 'prism', 'mesh_from', 'ico', 'cyl', 'empty', 'mat', 'lin', 'terrain'))
person, stand, bake, WALK = PG['person'], PG['stand'], PG['bake'], PG['WALK']
sc = bpy.context.scene
KEEP = {'sun', 'cam', 'target', 'Human Armature', 'Human_Mesh'}
for ob in list(bpy.data.objects):                          # clear the church set; keep light, camera and the body template
    if ob.name not in KEEP:
        bpy.data.objects.remove(ob, do_unlink=True)
CG['MOVERS'].clear()
FPS = 30
DUR = 41.37
N = int(DUR * FPS)
sc.frame_start, sc.frame_end = 0, N - 1
T_B, T_C1, T_C2 = 5.23, 7.78, 24.5

# ---- palette (from the Flow palace plate)
STONE, STONE_LT, STONE_DK, BASE = '#ddd4ba', '#e8e1cb', '#c9bea2', '#b3a78c'
DARK, SLATE, SLATE_DK, IRON = '#2e2d27', '#666d74', '#4b535c', '#34322d'
LAWN, PATH = '#8a8d4c', '#c3b495'


def cutter(name, x0, y0, z0, x1, y1, z1):
    c = box(name, x0, y0, z0, x1, y1, z1, '#ff00ff')
    c.hide_render = True
    c.display_type = 'WIRE'
    return c


def cut(ob, c):
    m = ob.modifiers.new('cut', 'BOOLEAN')
    m.operation, m.object, m.solver = 'DIFFERENCE', c, 'EXACT'


def arch_panel(name, x0, x1, y0, y1, z0, zs, z1, col):
    """a wall panel between z0 and z1 with a round-arched opening from the floor z0 up to the spring line zs"""
    r = (x1 - x0) / 2 - 0.22
    cx = (x0 + x1) / 2
    pts = [(x0, z1), (x0, z0), (cx - r, z0), (cx - r, zs)]
    pts += [(cx - r * math.cos(math.pi * k / 10), zs + r * math.sin(math.pi * k / 10)) for k in range(1, 10)]
    pts += [(cx + r, zs), (cx + r, z0), (x1, z0), (x1, z1)]
    return prism(name, pts[::-1], y0, y1, col)


# ================================================================ ʻIolani Palace (front faces -y)
GND = 0.0
BZ, F1Z, F2Z, EZ = 2.4, 2.4, 7.9, 13.4               # basement top, floors, eave
box('basement', -22.2, -0.4, GND, 22.2, 30, BZ, BASE)
for x in [-20.4 + 2.9 * k for k in range(15)]:
    if abs(x) > 5.5:
        box(f'bhole{x:.0f}', x - 0.55, -0.45, 0.35, x + 0.55, -0.3, 1.8, '#8f8670')
main = box('main', -16.3, 3.0, BZ, 16.3, 30, EZ, STONE)
for z in (F2Z - 0.25, EZ - 0.5):
    box(f'band{z}', -16.3, 2.9, z, 16.3, 3.05, z + 0.3, STONE_LT)
# verandas on two floors: floor slabs, arched bays on slender columns, balustrades
for side in (-1, 1):
    x0, x1 = (4.0, 16.3) if side > 0 else (-16.3, -4.0)
    bw = (x1 - x0) / 5
    for fz, top in ((F1Z, F2Z), (F2Z, EZ)):
        box(f'slab{side}{fz}', x0, -0.2, fz, x1, 3.0, fz + 0.3, STONE_LT)
        for k in range(5):
            bx0 = x0 + k * bw
            arch_panel(f'arch{side}{fz}{k}', bx0, bx0 + bw, -0.05, 0.35, fz + 0.3, top - 1.75, top, STONE)
            for j in range(10):                            # balusters
                xb = bx0 + 0.35 + j * (bw - 0.7) / 9
                box(f'bal{side}{fz}{k}{j}', xb - 0.05, 0.0, fz + 0.3, xb + 0.05, 0.12, fz + 1.2, STONE_LT)
            box(f'rail{side}{fz}{k}', bx0 + 0.22, -0.05, fz + 1.2, bx0 + bw - 0.22, 0.17, fz + 1.32, STONE_LT)
        box(f'vfloor{side}{fz}', x0, 0.35, fz + 0.3, x1, 3.0, fz + 0.32, '#8f8670')
    box(f'roofbal{side}', x0, -0.1, EZ, x1, 0.3, EZ + 1.0, STONE_LT)
for k in range(60):                                        # the roofline balustrade's balusters, as dark gaps
    x = -15.9 + k * 0.54
    if abs(x) > 4.2:
        box(f'rb{k}', x - 0.06, -0.12, EZ + 0.25, x + 0.06, -0.08, EZ + 0.8, '#8f977d')


def tower(name, x0, x1, y0, y1, top, roof_top, oc_r):
    box(name, x0, y0, BZ, x1, y1, top, STONE_LT)
    for z in range(int(BZ) + 1, int(top), 1):              # quoins
        for xq in (x0 - 0.06, x1 - 0.3):
            box(f'{name}q{z}{xq:.0f}', xq, y0 - 0.06, z, xq + 0.36, y0 + 0.2, z + 0.35, STONE_DK)
    box(name + 'corn', x0 - 0.35, y0 - 0.35, top, x1 + 0.35, y1 + 0.35, top + 0.5, STONE_LT)
    i = 0.12 * (x1 - x0)
    mesh_from(name + 'roof', [(x0 - 0.1, y0 - 0.1, top + 0.5), (x1 + 0.1, y0 - 0.1, top + 0.5), (x1 + 0.1, y1 + 0.1, top + 0.5), (x0 - 0.1, y1 + 0.1, top + 0.5),
                              (x0 + i, y0 + i, roof_top), (x1 - i, y0 + i, roof_top), (x1 - i, y1 - i, roof_top), (x0 + i, y1 - i, roof_top)],
              [(0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7), (4, 5, 6, 7)], SLATE)
    for k in range(9):                                     # iron cresting
        xc = x0 + i + k * (x1 - x0 - 2 * i) / 8
        box(f'{name}cr{k}', xc - 0.04, y0 + i - 0.04, roof_top, xc + 0.04, y0 + i + 0.04, roof_top + 0.8, IRON)
    box(name + 'crail', x0 + i, y0 + i - 0.05, roof_top + 0.75, x1 - i, y0 + i + 0.05, roof_top + 0.85, IRON)
    cx = (x0 + x1) / 2
    cyl(name + 'oc', (cx, y0 - 0.1 + (roof_top - top) * 0.1, (top + roof_top) / 2 + 0.3), (cx, y0 - 0.4, (top + roof_top) / 2 + 0.3), oc_r, oc_r, STONE_LT, n=14)


tower('towerL', -22.2, -16.1, -0.6, 5.5, 16.2, 19.6, 0.55)
tower('towerR', 16.1, 22.2, -0.6, 5.5, 16.2, 19.6, 0.55)
tower('towerC', -4.3, 4.3, -1.0, 6.0, 18.4, 23.2, 0.8)
# the central tower's openings are real recesses, so sun and shade fall inside them: three deep-set upper windows,
# a loggia behind the big arch with glazed doors at its back, and an entrance vestibule with the palace's panelled doors
TC = bpy.data.objects['towerC']
GLASS, GLASS_LT, DOORW = '#55616b', '#8d9893', '#5e4330'
for x in (-1.9, 0.0, 1.9):                                 # the central tower's three upper windows
    arch_panel(f'cwin{x}', x - 0.6, x + 0.6, -1.15, -1.0, 15.6, 17.2, 17.8, STONE_LT)
    cut(TC, cutter(f'cwincut{x}', x - 0.38, -1.3, 15.6, x + 0.38, -0.5, 17.62))
    box(f'cwing{x}', x - 0.38, -0.58, 15.6, x + 0.38, -0.52, 17.62, GLASS)
    box(f'cwinv{x}', x - 0.025, -0.62, 15.6, x + 0.025, -0.56, 17.62, STONE_LT)
    box(f'cwinh{x}', x - 0.38, -0.62, 16.55, x + 0.38, -0.56, 16.61, STONE_LT)
    box(f'cwins{x}', x - 0.45, -1.25, 15.5, x + 0.45, -0.5, 15.62, STONE_LT)
arch_panel('bigarch', -2.6, 2.6, -1.15, -1.0, 9.6, 11.2, 13.9, STONE_LT)       # crown at 13.58, under the panel top
cut(TC, cutter('loggiacut', -2.36, -1.3, 9.65, 2.36, 1.4, 13.7))
box('loggia_floor', -2.36, -1.0, 9.6, 2.36, 1.42, 9.66, '#b9ad91')
box('loggia_back', -2.36, 1.38, 9.65, 2.36, 1.48, 13.7, STONE)
for xs in (-1, 1):                                         # glazed double doors and a transom at the back of the loggia
    box(f'ld{xs}', xs * 0.02, 1.3, 9.66, xs * 0.82, 1.38, 12.35, DOORW)
    for zz in (9.75, 11.0):
        box(f'ldg{xs}{zz}', xs * 0.12, 1.27, zz + 0.12, xs * 0.72, 1.3, zz + 1.12, GLASS)
box('ltran_f', -0.92, 1.28, 12.35, 0.92, 1.38, 13.05, DOORW)
box('ltran', -0.8, 1.26, 12.45, 0.8, 1.28, 12.95, GLASS)
box('balcony', -2.8, -1.8, 9.4, 2.8, -1.0, 9.65, STONE_LT)
for k in range(13):                                        # the balcony's balustrade, across the arch
    xb = -2.4 + k * 0.4
    box(f'lbal{k}', xb - 0.05, -1.7, 9.65, xb + 0.05, -1.6, 10.5, STONE_LT)
box('lrail', -2.6, -1.75, 10.5, 2.6, -1.55, 10.62, STONE_LT)
arch_panel('doorarch', -1.8, 1.8, -1.15, -1.0, BZ, 5.0, 6.6, STONE_LT)
cut(TC, cutter('vestcut', -1.56, -1.3, BZ, 1.56, 1.85, 6.6))
box('vest_floor', -1.56, -1.3, BZ - 0.3, 1.56, 1.85, BZ, BASE)
box('vest_back', -1.56, 1.8, BZ, 1.56, 1.9, 6.6, STONE)
for xs in (-1, 1):                                         # the front doors: panelled wood with etched-glass lights
    box(f'fd{xs}', xs * 0.02, 1.72, BZ, xs * 0.78, 1.8, BZ + 3.1, DOORW)
    box(f'fdg{xs}', xs * 0.14, 1.69, BZ + 1.3, xs * 0.66, 1.72, BZ + 2.85, GLASS_LT)
    box(f'fdp{xs}', xs * 0.14, 1.69, BZ + 0.2, xs * 0.66, 1.72, BZ + 1.1, '#4a3424')
box('fdtran_f', -0.9, 1.7, BZ + 3.1, 0.9, 1.8, BZ + 3.85, DOORW)
box('fdtran', -0.78, 1.67, BZ + 3.2, 0.78, 1.7, BZ + 3.75, GLASS_LT)
vl = bpy.data.lights.new('vestibule', 'POINT')             # a little lamplight inside the vestibule
vl.energy, vl.color, vl.shadow_soft_size = 60, (1.0, 0.86, 0.65), 0.3
vlo = bpy.data.objects.new('vestibule', vl)
sc.collection.objects.link(vlo)
vlo.location = (0, 0.6, BZ + 3.6)
for k in range(10):                                        # the grand staircase
    box(f'st{k}', -5.4 - k * 0.15, -1.1 - (k + 1) * 0.55, GND, 5.4 + k * 0.15, -1.1 - k * 0.55, BZ - k * 0.24, STONE_DK if k % 2 else BASE)
cyl('flagpole', (0, 2.5, 23.2), (0, 2.5, 31.5), 0.09, 0.06, IRON, n=8)
ico('finial', (0, 2.5, 31.6), 0.18, IRON, 1)

# the Hawaiian flag: a texture painted here, on a subdivided plane that waves
FLAGPNG = os.path.join(HERE, 'assets', 'hawaii_flag.png')       # painted by make_flag in the header comment's tools
os.makedirs(OUT, exist_ok=True)
HAVE_FLAG = os.path.exists(FLAGPNG)
bpy.ops.mesh.primitive_grid_add(x_subdivisions=24, y_subdivisions=12, size=1)
fl = bpy.context.active_object
fl.name = 'flag'
fl.scale = (3.6, 1.8, 1)
fl.rotation_euler = (math.radians(90), 0, 0)
fl.location = (1.9, 2.5, 30.4)
fm = bpy.data.materials.new('flag')
fm.use_nodes = True
if HAVE_FLAG:
    tex = fm.node_tree.nodes.new('ShaderNodeTexImage')
    tex.image = bpy.data.images.load(FLAGPNG)
    fm.node_tree.links.new(tex.outputs['Color'], fm.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
fm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 1.0
fl.data.materials.append(fm)
wv = fl.modifiers.new('wave', 'WAVE')
wv.use_x, wv.use_y, wv.height, wv.width, wv.speed, wv.narrowness = True, False, 0.16, 1.2, 0.18, 1.0
wv.start_position_x = -1.9
for p in fl.data.polygons:
    p.use_smooth = False
for f in range(0, N, 1):                                   # the wave steps at 12 fps like everything else
    wv.time_offset = f - math.floor(f / FPS * 12) / 12 * FPS
    wv.keyframe_insert('time_offset', frame=f)
for fc in fl.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = 'CONSTANT'

# ================================================================ the Queen's room, behind an upper-floor window (right wing)
RX0, RX1, RY0, RY1, RZ0, RZ1 = 6.6, 12.6, 3.3, 9.6, F2Z + 0.3, EZ - 0.35
WX = 10.15                                                 # window centre, on a veranda bay
cut(main, cutter('roomvoid', RX0, RY0, RZ0, RX1, RY1, RZ1))
cut(main, cutter('roomwin', WX - 0.8, 2.6, RZ0 + 0.9, WX + 0.8, 3.6, RZ0 + 4.0))
for k in (1, 2):
    box(f'rwm{k}', WX - 0.8, 3.02, RZ0 + 0.9 + 3.1 * k / 3 - 0.03, WX + 0.8, 3.08, RZ0 + 0.9 + 3.1 * k / 3 + 0.03, STONE_LT)
box('rwmv', WX - 0.03, 3.02, RZ0 + 0.9, WX + 0.03, 3.08, RZ0 + 4.0, STONE_LT)
box('rwsill', WX - 1.0, 2.75, RZ0 + 0.78, WX + 1.0, 3.3, RZ0 + 0.92, STONE_LT)
WALL, WOOD, WOOD_DK = '#e4d9bf', '#6e4e34', '#4a3424'
box('rfloor', RX0, RY0, RZ0, RX1, RY1, RZ0 + 0.05, '#4f3a2a')
for k in range(13):
    box(f'rplank{k}', RX0, RY0 + 0.45 * k, RZ0 + 0.05, RX1, RY0 + 0.45 * k + 0.012, RZ0 + 0.055, '#3e2d20')
box('rug', RX0 + 1.4, RY0 + 1.2, RZ0 + 0.05, RX1 - 1.6, RY1 - 1.6, RZ0 + 0.065, '#7a7462')
box('rugin', RX0 + 1.7, RY0 + 1.5, RZ0 + 0.065, RX1 - 1.9, RY1 - 1.9, RZ0 + 0.07, '#8c8572')
# thin inner walls (plaster), with the window wall left open where the window is
T = 0.06
box('rwall_w', RX0, RY0, RZ0, RX0 + T, RY1, RZ1, WALL)
box('rwall_e', RX1 - T, RY0, RZ0, RX1, RY1, RZ1, WALL)
box('rwall_n', RX0, RY1 - T, RZ0, RX1, RY1, RZ1, WALL)
for (x0, x1) in ((RX0, WX - 0.8), (WX + 0.8, RX1)):
    box(f'rwall_s{x0:.0f}', x0, RY0, RZ0, x1, RY0 + T, RZ1, WALL)
box('rwall_sb', WX - 0.8, RY0, RZ0, WX + 0.8, RY0 + T, RZ0 + 0.9, WALL)
box('rwall_st', WX - 0.8, RY0, RZ0 + 4.0, WX + 0.8, RY0 + T, RZ1, WALL)
box('rceil', RX0, RY0, RZ1 - 0.05, RX1, RY1, RZ1, '#ece4cf')
for (x0, y0, x1, y1) in ((RX0 + T, RY0 + T, RX0 + T + 0.03, RY1 - T), (RX1 - T - 0.03, RY0 + T, RX1 - T, RY1 - T),
                         (RX0 + T, RY1 - T - 0.03, RX1 - T, RY1 - T), (RX0 + T, RY0 + T, RX1 - T, RY0 + T + 0.03)):
    box(f'rskirt{x0:.1f}{y0:.1f}', x0, y0, RZ0, x1, y1, RZ0 + 0.3, WOOD_DK)                 # skirting board
    box(f'rprail{x0:.1f}{y0:.1f}', x0, y0, RZ1 - 0.75, x1, y1, RZ1 - 0.68, WOOD)             # picture rail
# the window from inside: deep reveal, sill, and heavy dark curtains drawn back on a pole
box('rsill_in', WX - 0.95, RY0 - 0.05, RZ0 + 0.84, WX + 0.95, RY0 + 0.2, RZ0 + 0.92, WOOD)
cyl('cpole', (WX - 1.5, RY0 + 0.25, RZ0 + 4.25), (WX + 1.5, RY0 + 0.25, RZ0 + 4.25), 0.03, 0.03, WOOD_DK, n=6)
CURT = '#232323'
for sx in (-1, 1):
    for k in range(3):                                     # three folds a side, so the curtain has facets
        x = WX + sx * (0.95 + k * 0.17)
        box(f'curt{sx}{k}', x - 0.1, RY0 + 0.1 + 0.05 * (k % 2), RZ0 + 0.08, x + 0.1, RY0 + 0.24 + 0.05 * (k % 2), RZ0 + 4.2, CURT)
    box(f'tie{sx}', WX + sx * 1.1 - 0.25, RY0 + 0.08, RZ0 + 1.55, WX + sx * 1.1 + 0.25, RY0 + 0.3, RZ0 + 1.62, '#3a3a3a')
# the iron bed (by the window wall, as in the plate), table with pitcher and basin, chair, panelled door
BX0, BX1, BY0, BY1 = RX0 + 0.25, RX0 + 1.25, RY0 + 0.5, RY0 + 2.6
box('mattress', BX0, BY0, RZ0 + 0.42, BX1, BY1, RZ0 + 0.6, '#efe9da')
box('blanket', BX0 - 0.03, BY0 + 0.6, RZ0 + 0.3, BX1 + 0.03, BY1 + 0.03, RZ0 + 0.63, '#e3dccb')
box('pillow', BX0 + 0.1, BY0 + 0.08, RZ0 + 0.6, BX1 - 0.1, BY0 + 0.45, RZ0 + 0.7, '#f4f0e6')
IRON_B = '#24221f'
for yb, hb in ((BY0, 1.05), (BY1, 0.8)):
    for xb in (BX0, BX1):
        cyl(f'bpost{xb:.1f}{yb:.1f}', (xb, yb, RZ0), (xb, yb, RZ0 + hb), 0.022, 0.022, IRON_B, n=6)
    for zb in (hb - 0.05, 0.45):
        cyl(f'brail{yb:.1f}{zb}', (BX0, yb, RZ0 + zb), (BX1, yb, RZ0 + zb), 0.016, 0.016, IRON_B, n=6)
    for k in range(1, 6):
        xs = BX0 + k * (BX1 - BX0) / 6
        cyl(f'bspin{yb:.1f}{k}', (xs, yb, RZ0 + 0.45), (xs, yb, RZ0 + hb - 0.05), 0.008, 0.008, IRON_B, n=4)
TX = RX0 + 0.35                                            # table and chair against the back (west) wall
box('table', TX - 0.3, RY0 + 3.3, RZ0 + 0.72, TX + 0.3, RY0 + 4.2, RZ0 + 0.78, WOOD)
for (dx, dy) in ((-0.25, 3.35), (0.22, 3.35), (-0.25, 4.12), (0.22, 4.12)):
    box(f'tleg{dx}{dy}', TX + dx, RY0 + dy, RZ0, TX + dx + 0.04, RY0 + dy + 0.04, RZ0 + 0.72, WOOD_DK)
cyl('basin', (TX, RY0 + 3.6, RZ0 + 0.78), (TX, RY0 + 3.6, RZ0 + 0.86), 0.12, 0.17, '#e6e1d4', n=10)
cyl('jug', (TX + 0.02, RY0 + 3.95, RZ0 + 0.78), (TX + 0.02, RY0 + 3.95, RZ0 + 1.04), 0.075, 0.05, '#e6e1d4', n=10)
cyl('jugneck', (TX + 0.02, RY0 + 3.95, RZ0 + 1.04), (TX + 0.02, RY0 + 3.95, RZ0 + 1.1), 0.05, 0.065, '#e6e1d4', n=10)
CX_, CY_ = RX0 + 0.75, RY0 + 4.75
box('chair_seat', CX_ - 0.22, CY_ - 0.22, RZ0 + 0.45, CX_ + 0.22, CY_ + 0.22, RZ0 + 0.5, WOOD_DK)
for (dx, dy) in ((-0.2, -0.2), (0.17, -0.2), (-0.2, 0.17), (0.17, 0.17)):
    box(f'cleg{dx}{dy}', CX_ + dx, CY_ + dy, RZ0, CX_ + dx + 0.03, CY_ + dy + 0.03, RZ0 + 0.45, WOOD_DK)
for k in range(4):
    box(f'cspl{k}', CX_ - 0.22, CY_ - 0.17 + k * 0.11, RZ0 + 0.5, CX_ - 0.19, CY_ - 0.14 + k * 0.11, RZ0 + 1.05, WOOD_DK)
box('ctop', CX_ - 0.23, CY_ - 0.22, RZ0 + 1.0, CX_ - 0.18, CY_ + 0.22, RZ0 + 1.1, WOOD_DK)
DY0, DY1 = RY1 - 1.75, RY1 - 0.7                           # the locked door, on the back wall
box('rdoorframe', RX0 + T, DY0 - 0.12, RZ0, RX0 + T + 0.05, DY1 + 0.12, RZ0 + 2.42, WOOD_DK)
box('rdoor', RX0 + T + 0.02, DY0, RZ0, RX0 + T + 0.07, DY1, RZ0 + 2.3, WOOD)
for (y0, y1, z0, z1) in ((DY0 + 0.12, DY1 - 0.12, RZ0 + 1.3, RZ0 + 2.15), (DY0 + 0.12, DY1 - 0.12, RZ0 + 0.15, RZ0 + 1.15)):
    box(f'rdpanel{z0:.1f}', RX0 + T + 0.07, y0, z0, RX0 + T + 0.1, y1, z1, '#5d4230')
ico('rknob', (RX0 + T + 0.13, DY1 - 0.1, RZ0 + 1.05), 0.035, '#b8923e', 1)
rf = bpy.data.lights.new('roomfill', 'AREA')
rf.energy, rf.size, rf.color = 70, 4.0, (1.0, 0.92, 0.82)
rfo = bpy.data.objects.new('roomfill', rf)
sc.collection.objects.link(rfo)
rfo.location = ((RX0 + RX1) / 2, (RY0 + RY1) / 2 + 0.5, RZ1 - 0.15)
wl = bpy.data.lights.new('windowlight', 'AREA')            # daylight through the window, soft, onto the floor
wl.energy, wl.size, wl.color = 260, 1.6, (1.0, 0.95, 0.85)
wlo = bpy.data.objects.new('windowlight', wl)
sc.collection.objects.link(wlo)
wlo.location = (WX, RY0 - 0.3, RZ0 + 2.6)
wlo.rotation_euler = (math.radians(55), 0, 0)

# the Queen at the window, from behind
QX, QY = WX - 0.1, RY0 + 0.75
q_root, q_arm = person('queen', 'queen', (QX, QY, RZ0 + 0.05), 180)
stand(q_arm, N, pose={'LeftArm': (60, 0, 25), 'LeftForeArm': (0, 0, 35)}, k=0.3)   # one hand raised toward the glass

# ================================================================ the upstairs hall (a separate set, away from the palace), after a3_palace_hall
HX, HW, HL, HH = 300.0, 2.2, 24.0, 4.8
HWALL = '#d9d8bd'
box('h_floor', HX - HW, -2, 0, HX + HW, HL, 0.05, '#6a4a30')
for k in range(11):
    box(f'h_pl{k}', HX - HW + k * 0.4, -2, 0.05, HX - HW + k * 0.4 + 0.012, HL, 0.055, '#4a3424')
box('h_ceiling', HX - HW - 0.1, -2, HH, HX + HW + 0.1, HL, HH + 0.1, '#e1dcc6')
box('h_cornice', HX - HW, -2, HH - 0.3, HX - HW + 0.25, HL, HH, '#cfc9ad')
box('h_cornice2', HX + HW - 0.25, -2, HH - 0.3, HX + HW, HL, HH, '#cfc9ad')
box('h_coffer', HX - 1.2, -2, HH - 0.12, HX + 1.2, HL - 1, HH, '#d6d0b8')
box('h_wall_r', HX + HW, -2, 0, HX + HW + 0.15, HL, HH, HWALL)
OPEN = [(5.0, 7.2), (11.0, 13.2), (17.0, 19.2)]            # tall openings on the left, where the sun comes in
ys = [-2.0] + [v for o in OPEN for v in o] + [HL]
for i in range(0, len(ys), 2):
    box(f'h_wall_l{i}', HX - HW - 0.15, ys[i], 0, HX - HW, ys[i + 1], HH, HWALL)
for (y0, y1) in OPEN:
    box(f'h_lintel{y0:.0f}', HX - HW - 0.15, y0, 3.4, HX - HW, y1, HH, HWALL)
    box(f'h_jamb{y0:.0f}a', HX - HW - 0.05, y0 - 0.12, 0, HX - HW + 0.04, y0, 3.5, '#cfc9ad')
    box(f'h_jamb{y0:.0f}b', HX - HW - 0.05, y1, 0, HX - HW + 0.04, y1 + 0.12, 3.5, '#cfc9ad')
for sx in (-1, 1):                                         # panelled wainscot on both walls (not across the openings)
    xw = HX + sx * HW
    segs = [(-2, HL)] if sx > 0 else [(ys[i], ys[i + 1]) for i in range(0, len(ys), 2)]
    for (y0, y1) in segs:
        box(f'h_wain{sx}{y0:.0f}', xw - 0.05 if sx > 0 else xw, y0, 0.05, xw if sx > 0 else xw + 0.05, y1, 1.25, WOOD)
        box(f'h_wcap{sx}{y0:.0f}', xw - 0.09 if sx > 0 else xw, y0, 1.25, xw if sx > 0 else xw + 0.09, y1, 1.33, WOOD_DK)
        n = max(1, int((y1 - y0) / 1.1))
        for k in range(n):
            py0 = y0 + 0.12 + k * (y1 - y0) / n
            py1 = py0 + (y1 - y0) / n - 0.24
            box(f'h_wp{sx}{y0:.0f}{k}', xw - 0.08 if sx > 0 else xw + 0.05, py0, 0.25, xw - 0.05 if sx > 0 else xw + 0.08, py1, 1.08, WOOD_DK)
box('h_end', HX - HW - 0.1, HL - 0.1, 0, HX + HW + 0.1, HL + 0.1, HH, HWALL)
box('h_endwain', HX - HW, HL - 0.15, 0.05, HX + HW, HL - 0.1, 1.25, WOOD)
box('h_doorf', HX - 0.72, HL - 0.2, 0.05, HX + 0.72, HL - 0.1, 2.65, WOOD_DK)
box('h_door', HX - 0.58, HL - 0.25, 0.05, HX + 0.58, HL - 0.15, 2.5, WOOD)
for (z0, z1) in ((1.4, 2.35), (0.2, 1.25)):
    for xs in (-1, 1):
        box(f'h_dp{z0}{xs}', HX + xs * 0.29 - 0.2, HL - 0.28, z0, HX + xs * 0.29 + 0.2, HL - 0.25, z1, '#5d4230')
ico('h_knob', (HX + 0.45, HL - 0.3, 1.1), 0.035, '#b8923e', 1)
box('h_table', HX + HW - 0.55, HL - 1.6, 0.75, HX + HW - 0.05, HL - 1.0, 0.8, WOOD)
box('h_tleg', HX + HW - 0.33, HL - 1.35, 0.05, HX + HW - 0.27, HL - 1.25, 0.75, WOOD_DK)
cyl('h_lamp', (HX + HW - 0.3, HL - 1.3, 0.8), (HX + HW - 0.3, HL - 1.3, 1.1), 0.07, 0.05, '#b8923e', n=8)
cyl('h_chimney', (HX + HW - 0.3, HL - 1.3, 1.1), (HX + HW - 0.3, HL - 1.3, 1.4), 0.06, 0.03, '#efe6c8', n=8)
box('h_mirrorf', HX + HW - 0.08, 9.6, 1.7, HX + HW - 0.02, 11.6, 3.5, '#9c8a62')     # the mirror on the right wall
box('h_mirror', HX + HW - 0.1, 9.8, 1.9, HX + HW - 0.08, 11.4, 3.3, '#8f9a92')
for k, yl in enumerate((6, 14, 21)):
    hl = bpy.data.lights.new(f'hall{k}', 'POINT')
    hl.energy, hl.color = 120, (1.0, 0.9, 0.75)
    hlo = bpy.data.objects.new(f'hall{k}', hl)
    sc.collection.objects.link(hlo)
    hlo.location = (HX, yl, HH - 0.5)
GX, GY = HX + 0.95, HL - 0.6                               # the guard, beside the door, facing down the hall
g_root, g_arm = person('guard', 'guard', (GX, GY, 0.05), 180)
stand(g_arm, N, pose=PG['ORDER_ARMS'], k=1.1)               # at attention, rifle grounded at his right foot
PG['order_arms']('guard', g_arm)

# ================================================================ the grounds, the mountains, palms
terrain('lawn', -200, 200, -160, 140, 24, 16, lambda x, y: 0.4 * math.sin(x * 0.07) * math.cos(y * 0.09) - 0.25, LAWN)
box('walk', -4.2, -160, 0.0, 4.2, -6.6, 0.03, PATH)
box('drive', -60, -10.0, 0.0, 60, -7.6, 0.03, PATH)


def peaks(x, y):
    h = 0
    for (px, py, ph, pw) in ((-60, 230, 70, 60), (20, 260, 55, 70), (90, 225, 60, 55), (-150, 250, 45, 60), (160, 265, 40, 60)):
        h += ph * math.exp(-((x - px) ** 2 + (y - py) ** 2 * 0.6) / (2 * pw * pw))
    return h + 3 * math.sin(x * 0.07) * math.sin(y * 0.05)


terrain('mountains', -420, 420, 130, 460, 44, 18, peaks, '#7d8b69')
for k in range(40):
    x = -150 + k * 7.6
    if abs(x) > 26:
        ico(f'tl{k}', (x, 40 + (k % 3) * 6, 3), 5 + (k % 4), '#3f4b33', 1, (1.3, 1.0, 0.9), seed=k)
for i, (x, y, h, lean) in enumerate(((-30, -8, 17, 0.1), (-26, 6, 12, -0.05), (-36, 2, 14, 0.05), (29, -6, 16, -0.12), (34, 5, 12, 0.06), (25, 10, 11, 0.04))):
    CG['palm'](x, y, h, lean, 12, 4.6 if h > 14 else 3.4, 40 + i)
for ci, (cx, cyy, cz, cw) in enumerate(((-90, 330, 110, 85), (100, 340, 95, 75), (10, 300, 135, 50))):
    for k in range(9):
        ico(f'cl{ci}{k}', (cx + (k - 4) * cw * 0.12, cyy + (k % 3) * 5, cz + (k % 2) * 4), cw * (0.2 + 0.03 * (k % 3)), '#ead9ae', 1, (1.4, 0.8, 0.75), seed=ci * 20 + k)

# depth layers for the pull-back: low hedges and iron lamp posts along the walk (repeats that shrink into the distance),
# shrubs along the basement, and two tall palms near the camera's last position whose crowns frame the top corners
HEDGE = '#3c4a30'
for sx in (-1, 1):
    box(f'hedge{sx}', sx * 4.6 - 0.45, -150, 0.0, sx * 4.6 + 0.45, -11.0, 0.85, HEDGE)
    for k in range(7):
        y = -14 - k * 9.0
        x = sx * 5.6
        cyl(f'lp{sx}{k}', (x, y, 0), (x, y, 3.3), 0.07, 0.05, IRON, n=6)
        box(f'lpb{sx}{k}', x - 0.14, y - 0.14, 0, x + 0.14, y + 0.14, 0.4, IRON)
        box(f'lpl{sx}{k}', x - 0.17, y - 0.17, 3.3, x + 0.17, y + 0.17, 3.8, '#e9dfbf')
        mesh_from(f'lpc{sx}{k}', [(x - 0.22, y - 0.22, 3.8), (x + 0.22, y - 0.22, 3.8), (x + 0.22, y + 0.22, 3.8), (x - 0.22, y + 0.22, 3.8), (x, y, 4.15)],
                  [(0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4)], IRON)
for k in range(26):
    x = -21.5 + k * 1.72
    if abs(x) > 6.2:
        ico(f'shrub{k}', (x, -1.6, 0.5), 0.85 + 0.2 * (k % 3), HEDGE, 1, (1.2, 0.9, 0.8), seed=200 + k)
CG['palm'](21.5, -57, 17, -0.08, 12, 4.8, 77)
CG['palm'](-5.0, -64, 21, 0.12, 12, 4.6, 78)
CG['palm'](24.0, -36, 13, 0.05, 12, 3.8, 79)

# soldiers of the Republic on the grounds: two sentries at the foot of the steps, and men walking their rounds
# (they start walking at the cut outside; walking steps at 12 fps and moves at the speed of the planted foot)
for i, sx in enumerate((-1, 1)):
    s_root, s_arm = person(f'sentry{i}', 'guard', (sx * 6.3, -8.0, 0.0), 180)
    stand(s_arm, N, pose=PG['ORDER_ARMS'], k=0.4 + i)
    PG['order_arms'](f'sentry{i}', s_arm)
PATROL = [((-28.0, -8.6), -90, 0.0), ((-29.3, -9.3), -90, 0.15), ((27.0, -8.9), 90, 1.2), ((1.9, -12.5), 180, 0.6)]
TQ = [math.floor(f / FPS * 12) / 12 for f in range(N)]
for i, ((x, y), hd, t0) in enumerate(PATROL):
    p_root, p_arm = person(f'patrol{i}', 'patrol', (x, y, 0.0), hd)
    TT = [max(0.0, tq - T_C2 - t0) for tq in TQ]
    a = math.radians(hd)
    for f, tt in enumerate(TT):
        p_root.location = (x - math.sin(a) * PG['V'] * tt, y + math.cos(a) * PG['V'] * tt, 0.0)
        p_root.keyframe_insert('location', frame=f)
    for fc in p_root.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'
    bake(p_arm, WALK, TT, PG['RATE'], phase=i * 3.0)

# the sun through the Queen's window: a hard spot along the sun's own direction, so the floor gets a window-shaped patch
bpy.context.view_layer.update()
SD = bpy.data.objects['sun'].matrix_world.to_3x3() @ Vector((0, 0, -1))
sp = bpy.data.lights.new('winsun', 'SPOT')
sp.energy, sp.color, sp.shadow_soft_size, sp.spot_size, sp.spot_blend = 2600, (1.0, 0.9, 0.72), 0.0, math.radians(32), 0.05
spo = bpy.data.objects.new('winsun', sp)
sc.collection.objects.link(spo)
wc = Vector((WX, 3.0, RZ0 + 2.45))
spo.location = wc - SD * 2.2
spo.rotation_euler = SD.to_track_quat('-Z', 'Y').to_euler()
print('SUN DIR', tuple(round(v, 2) for v in SD), 'winsun at', tuple(round(v, 2) for v in spo.location))

# sway for the palms (stepped at 12 fps)
for f in range(0, N):
    tq = math.floor(f / FPS * 12) / 12
    for ob, kind, ph, amp in CG['MOVERS']:
        ob.rotation_euler[1] = amp * math.sin(tq * (1.7 if kind == 'frond' else 1.1) + ph)
        ob.keyframe_insert('rotation_euler', frame=f)
for ob, *_ in CG['MOVERS']:
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'


# ---- the finishing pass: facets, coursing, bevels, cool shadow fill, grade, haze (look.py)
LK = {'__name__': 'look'}
exec(compile(open(os.path.join(HERE, 'look.py')).read(), os.path.join(HERE, 'look.py'), 'exec'), LK)
LK['finish'](sc, fill_strength=0.75, rules={
    STONE: (0.08, 0.3, 0.62, 0.9), STONE_LT: (0.08, 0.3, 0.62, 0.91), STONE_DK: (0.05, 0.3, None, 1.0), BASE: (0.07, 0.3, 0.45, 0.84),
    SLATE: (0.08, 0.6, 0.28, 0.85), SLATE_DK: (0.08, 0.6, 0.28, 0.85), WALL: (0.13, 0.5, None, 1.0), HWALL: (0.12, 0.42, None, 1.0),
    LAWN: (0.12, 0.08, None, 1.0), '#7d8b69': (0.14, 0.02, None, 1.0), PATH: (0.08, 0.2, None, 1.0), '#ead9ae': (0.04, 0.03, None, 1.0),
    CURT: (0.12, 1.6, None, 1.0), HEDGE: (0.12, 0.4, None, 1.0), '#3f4b33': (0.12, 0.15, None, 1.0)})

# ================================================================ cameras: one camera, cut between shots by jumping
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
cam.data.lens = 32
FA, FB, FC1, FC2 = 0, int(T_B * FPS), int(T_C1 * FPS), int(T_C2 * FPS)
KEYS = [  # frame, camera position, look-at, interpolation into the next key
    (FA, (RX1 - 0.5, RY1 - 0.5, RZ0 + 1.65), (RX0 + 1.6, RY0 + 0.6, RZ0 + 1.45)), (FB - 1, (RX1 - 1.1, RY1 - 1.0, RZ0 + 1.62), (RX0 + 1.9, RY0 + 0.4, RZ0 + 1.5)),
    (FB, (HX - 0.6, HL - 9.5, 1.6), (HX + 0.3, HL, 1.25)), (FC1 - 1, (HX - 0.6, HL - 8.6, 1.6), (HX + 0.3, HL, 1.25)),
    (FC1, (QX + 0.55, QY + 2.6, RZ0 + 1.6), (QX - 0.15, RY0 - 3, RZ0 + 1.85)), (FC2 - 1, (QX + 0.35, QY + 1.7, RZ0 + 1.6), (QX - 0.1, RY0 - 3, RZ0 + 1.85)),
    (FC2, (WX, -5.5, RZ0 + 2.2), (WX, 3.5, RZ0 + 2.3)), (FC2 + 150, (WX - 1.0, -16, RZ0 + 3.0), (WX - 3, 4, RZ0 + 1.6)),
    (int(36.58 * FPS), (12, -72, 16), (0, 8, 12.5)), (N - 1, (10.5, -76, 17), (0, 8, 12.8))]
for f, pos, look in KEYS:
    cam.location = pos; cam.keyframe_insert('location', frame=f)
    tgt.location = look; tgt.keyframe_insert('location', frame=f)
for ob in (cam, tgt):
    for fc in ob.animation_data.action.fcurves:
        kps = fc.keyframe_points
        for i, kp in enumerate(kps):
            f = int(kp.co[0])
            # a jump between shots: hold until the cut frame
            kp.interpolation = 'CONSTANT' if f in (FB - 1, FC1 - 1, FC2 - 1) else 'BEZIER'
            kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'

# ---- shallow focus indoors (a miniature's depth of field), sharp outside; focus follows the subject of each shot
cam.data.dof.use_dof = True
cfc = {fc.array_index: fc for fc in cam.animation_data.action.fcurves if fc.data_path == 'location'}
SUBJ = [(FA, FB, Vector((QX, QY, RZ0 + 1.5)), 1.4), (FB, FC1, Vector((GX, GY, 1.4)), 1.6), (FC1, FC2, Vector((QX, QY, RZ0 + 1.55)), 1.4),
        (FC2, FC2 + 150, Vector((WX, 3.0, RZ0 + 2.0)), 8.0), (FC2 + 150, N, Vector((0, 4, 12)), 22.0)]
for a, b, P, fs in SUBJ:
    for f in list(range(a, b, 6)) + [b - 1]:
        c = Vector([cfc[i].evaluate(f) for i in range(3)])
        cam.data.dof.focus_distance = (P - c).length
        cam.data.dof.aperture_fstop = fs
        cam.data.dof.keyframe_insert('focus_distance', frame=f)
        cam.data.dof.keyframe_insert('aperture_fstop', frame=f)
for fc in cam.data.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = 'CONSTANT' if fc.data_path.endswith('fstop') else 'LINEAR'
sc.render.resolution_percentage = SCALE
for lt, on in ((wl, 260), (rf, 70), (sp, 2600)):                       # the room's lamps are off for the exterior shot (they glow through the glass)
    lt.energy = on; lt.keyframe_insert('energy', frame=0)
    lt.energy = on * 0.08; lt.keyframe_insert('energy', frame=FC2)
    for kp in lt.animation_data.action.fcurves[0].keyframe_points:
        kp.interpolation = 'CONSTANT'

FR = range(F0, min(F1, N - 1) + 1)
if os.environ.get('FRAMES', '').startswith('every:'):          # every:<step>:<offset>, skipping frames already on disk
    st_, of_ = map(int, os.environ['FRAMES'].split(':')[1:])
    FR = [f for f in range(of_, N, st_) if not os.path.exists(os.path.join(OUT, f'{f:04d}.png'))]
elif os.environ.get('FRAMES'):
    FR = [int(v) for v in os.environ['FRAMES'].split(',')]
for f in FR:
    sc.frame_set(f)
    sc.render.filepath = os.path.join(OUT, f'{f:04d}.png')
    import time
    t = time.time()
    bpy.ops.render.render(write_still=True)
    print('FRAME', f, round(time.time() - t, 2), flush=True)
