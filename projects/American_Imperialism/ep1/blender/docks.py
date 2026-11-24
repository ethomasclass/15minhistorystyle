# Ep 1, chapter 4: the Businessman's world, an American port in the 1890s, built in Blender after the Flow plate c5_docks
# (and the period photos ch04_buffalo_grain_elevator_1883, ch04_illinois_steel_works_1890s): a plank wharf running away
# from the camera, brick warehouses on the left, a steam freighter moored on the right, and down the middle the goods
# piling up: crates, barrels, wheat sacks, cotton bales and steel beams. Dockworkers carry loads along the lanes (walks
# stepped at 12 fps, moving at the speed of the planted foot). Across the water: a grain elevator, mill chimneys smoking,
# hills. Shots, keyed to the narration (ch04):
#   WIDE  "America's farms and factories..."   the wharf from above the goods, a slow drift in
#   PUSH  "If you make too much of something"  low along the stacks, tracking down the wharf with the ship behind them
#   xvfb-run -a blender -b --python docks.py -- <out_dir> [scale%] [mode: wide|push|anim]
#   (wide and push write one still each; anim renders the frames in $FRAMES, or all of them)
import bpy, bmesh, math, os, sys, random
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/docks'
SCALE = int(argv[1]) if len(argv) > 1 else 100
MODE = argv[2] if len(argv) > 2 else 'wide'
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
RND = random.Random(1890)
import json as _json


def _wt(stem, phrase, end=False):
    """start (or end) time of a phrase in a narration chapter"""
    ws = _json.load(open(os.path.join(HERE, '..', 'public', 'audio', stem + '.words.json')))['words']
    nm = lambda w: ''.join(ch for ch in w.lower() if ch.isalnum() or ch in "'ʻ")
    p = [nm(x) for x in phrase.split()]
    for i in range(len(ws) - len(p) + 1):
        if [nm(w['w']) for w in ws[i:i + len(p)]] == p:
            return ws[i + len(p) - 1]['e'] if end else ws[i]['s']
    raise KeyError(phrase)


T0 = _wt('ch04_the_pitch_meeting', "America's farms") - 0.6        # the docks take over from the easel board here
T_PUSH = _wt('ch04_the_pitch_meeting', 'If you make') - 0.05
T_END = _wt('ch04_the_pitch_meeting', 'Anywhere with people') - 0.05
FW, N = int(round((T_PUSH - T0) * FPS)), int(round((T_END - T0) * FPS))
sc.frame_start, sc.frame_end = 0, N - 1
TQ = [math.floor(f / FPS * 12) / 12 for f in range(N)]            # scene time, stepped at 12 fps
print('DOCKS TIMES', round(T0, 2), round(T_PUSH, 2), round(T_END, 2), FW, N)

# ---- palette (from the plate)
BRICK, BRICK_DK, MORTAR = '#8c4a3a', '#6c3529', '#7a4235'
ROOF, ROOF_DK, DOORWAY, DOORWOOD = '#43403c', '#2f2d2a', '#211d19', '#5a4a3a'
DECK, DECK_DK, PILE = '#7d6b55', '#5d4f3f', '#4f4336'
CRATE, CRATE_LT, CRATE_DK = '#a3845a', '#b8986a', '#7d6443'
BARREL, HOOP = '#8a6a48', '#3d342c'
SACK, SACK_DK = '#b9a27a', '#9c8762'
COTTON, BAND = '#cbbf9f', '#5a5044'
STEEL, STEEL_DK, DUNNAGE = '#5b5652', '#3a3633', '#6e5a44'           # mill-scale steel, a little rust in it
HULL, BOOT, STRAKE, WHITE = '#2a2826', '#8a3a2e', '#ddd2b8', '#e6dfcc'
FUNNEL, FUNNEL_TOP, MAST, RIG = '#c9a86a', '#1f1d1b', '#6a5a46', '#3a332c'
WATER, WATER_LT = '#86a09f', '#b3c6c0'
HILL, HILL_DK, LAND = '#8a9a86', '#74867a', '#8f8a70'


# ---- one mesh from many coloured boxes and polygons (crates, barrels, the ship), so the scene stays light
class MB:
    def __init__(s):
        s.v, s.f, s.m, s.cols = [], [], [], []

    def ci(s, col):
        if col not in s.cols:
            s.cols.append(col)
        return s.cols.index(col)

    def poly(s, verts, faces, col):
        n = len(s.v)
        s.v += [tuple(v) for v in verts]
        c = s.ci(col)
        for f in faces:
            s.f.append(tuple(i + n for i in f))
            s.m.append(c)

    def box(s, x0, y0, z0, x1, y1, z1, col, R=None, piv=None):
        vs = [(x, y, z) for z in (z0, z1) for y in (y0, y1) for x in (x0, x1)]
        if R is not None:
            p = Vector(piv) if piv else Vector(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
            vs = [tuple(p + R @ (Vector(v) - p)) for v in vs]
        s.poly(vs, [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4), (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)], col)

    def cyl(s, p0, p1, r0, r1, col, n=8, caps=True):
        p0, p1 = Vector(p0), Vector(p1)
        rot = (p1 - p0).to_track_quat('Z', 'Y').to_matrix()
        vs = [p0 + rot @ Vector((r0 * math.cos(2 * math.pi * k / n), r0 * math.sin(2 * math.pi * k / n), 0)) for k in range(n)]
        vs += [p1 + rot @ Vector((r1 * math.cos(2 * math.pi * k / n), r1 * math.sin(2 * math.pi * k / n), 0)) for k in range(n)]
        fs = [(k, (k + 1) % n, n + (k + 1) % n, n + k) for k in range(n)]
        if caps:
            fs += [tuple(range(n))[::-1], tuple(range(n, 2 * n))]
        s.poly(vs, fs, col)

    def build(s, name, loc=(0, 0, 0)):
        me = bpy.data.meshes.new(name)
        me.from_pydata(s.v, [], s.f)
        me.validate()
        for c in s.cols:
            me.materials.append(mat(c))
        for p, mi in zip(me.polygons, s.m):
            p.material_index = mi
            p.use_smooth = False
        ob = bpy.data.objects.new(name, me)
        ob.location = loc
        sc.collection.objects.link(ob)
        return ob


def inst(src, name, loc, rz=0.0, sc_=(1, 1, 1), rx=0.0, ry=0.0):
    """a linked duplicate (shares the mesh)"""
    ob = src.copy()
    ob.name = name
    sc.collection.objects.link(ob)
    ob.location, ob.rotation_euler, ob.scale = loc, (rx, ry, rz), sc_
    ob.hide_render = False
    return ob


def Rz(a):
    return Matrix.Rotation(a, 3, 'Z')


# ================================================================ the wharf (top at z = 0), the water (z = -1.4)
WX0, WX1, WY0, WY1 = -9.0, 9.0, -30.0, 74.0
ZW = -1.4
box('wharf', WX0, WY0, -0.45, WX1, WY1, 0.0, DECK)
mb = MB()
for k in range(37):                                         # plank seams, running down the wharf
    x = WX0 + 0.5 * k
    mb.box(x - 0.012, WY0, 0.0, x + 0.012, WY1, 0.006, DECK_DK)
for k in range(int((WY1 - WY0) / 4.2)):                     # plank butt joints, staggered
    for j in range(36):
        if (j + k) % 3 == 0:
            y = WY0 + 4.2 * k + (j % 3) * 1.4
            mb.box(WX0 + 0.5 * j, y - 0.01, 0.0, WX0 + 0.5 * j + 0.5, y + 0.01, 0.006, DECK_DK)
mb.build('seams')
mb = MB()
for k in range(int((WY1 - WY0) / 2.6) + 1):                 # piles along the open edge and the end, the stringer, fenders
    y = WY0 + 2.6 * k
    mb.cyl((WX1 + 0.1, y, ZW - 1.0), (WX1 + 0.1, y, -0.1), 0.2, 0.2, PILE, n=7)
    mb.box(WX1 + 0.05, y - 0.15, -1.2, WX1 + 0.35, y + 0.15, 0.25, DECK_DK)
for k in range(8):
    x = WX0 + 0.6 + k * 2.4
    mb.cyl((x, WY1 + 0.1, ZW - 1.0), (x, WY1 + 0.1, -0.1), 0.2, 0.2, PILE, n=7)
mb.box(WX1, WY0, -0.6, WX1 + 0.12, WY1, 0.12, DECK_DK)
mb.box(WX0, WY1, -0.6, WX1, WY1 + 0.12, 0.12, DECK_DK)
for k, y in enumerate((-12, 4, 30, 50, 66)):              # iron bollards
    mb.cyl((WX1 - 0.6, y, 0), (WX1 - 0.6, y, 0.55), 0.2, 0.17, HOOP, n=8)
    mb.cyl((WX1 - 0.6, y, 0.55), (WX1 - 0.6, y, 0.66), 0.25, 0.25, HOOP, n=8)
mb.build('piles')

bpy.ops.mesh.primitive_plane_add(size=1)
wt = bpy.context.active_object
wt.name = 'water'
wt.scale = (2400, 2400, 1)
wt.location = (0, 500, ZW)
wt.data.materials.append(mat(WATER))
mb = MB()                                                   # long pale streaks on the water, as in the plate
for k in range(60):
    x = RND.uniform(12, 160) * (1 if k % 4 else -1) if k % 4 else RND.uniform(-140, 140)
    y = RND.uniform(60, 420) if k % 4 == 0 else RND.uniform(-20, 300)
    if abs(x) < 26 and y < 90:
        continue
    L = RND.uniform(6, 30) * (1 + y / 200)
    mb.box(x - L / 2, y - 0.15 - y * 0.002, ZW + 0.01, x + L / 2, y + 0.15 + y * 0.002, ZW + 0.02, WATER_LT)
mb.build('streaks')
box('quay_land', -600, -60, -0.6, WX0, 92, 0.0, '#8d8470')     # the land the warehouses stand on

# ================================================================ the brick warehouses (left), wall face at x = WX0
WHX0 = -24.0
EAVE, RIDGE = 7.6, 10.6


def brick_material():
    """the plate's patchy brick: a brick texture in world space, mapped on whichever wall the face is on"""
    m = bpy.data.materials.new(BRICK)                       # named by its base colour, so the look rules can find it
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Roughness'].default_value = 1.0
    b.inputs['Specular IOR Level'].default_value = 0.1
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(geo.outputs['Position'], sep.inputs[0])
    sn = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(geo.outputs['Normal'], sn.inputs[0])
    ab = nt.nodes.new('ShaderNodeMath'); ab.operation = 'ABSOLUTE'
    nt.links.new(sn.outputs['Y'], ab.inputs[0])
    gt = nt.nodes.new('ShaderNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = 0.5
    nt.links.new(ab.outputs[0], gt.inputs[0])
    mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'FLOAT'
    nt.links.new(gt.outputs[0], mx.inputs['Factor'])
    nt.links.new(sep.outputs['Y'], mx.inputs['A'])
    nt.links.new(sep.outputs['X'], mx.inputs['B'])
    cv = nt.nodes.new('ShaderNodeCombineXYZ')
    nt.links.new(mx.outputs['Result'], cv.inputs['X'])
    nt.links.new(sep.outputs['Z'], cv.inputs['Y'])
    br = nt.nodes.new('ShaderNodeTexBrick')
    br.offset, br.squash, br.squash_frequency = 0.5, 1.0, 2
    br.inputs['Color1'].default_value = lin(BRICK)
    br.inputs['Color2'].default_value = lin(BRICK_DK)
    br.inputs['Mortar'].default_value = lin(MORTAR)
    br.inputs['Scale'].default_value = 1.0
    br.inputs['Mortar Size'].default_value = 0.025
    br.inputs['Bias'].default_value = -0.25
    br.inputs['Brick Width'].default_value = 0.95
    br.inputs['Row Height'].default_value = 0.34
    nt.links.new(cv.outputs[0], br.inputs['Vector'])
    # a second, coarser brick field multiplied over the first: patches of lighter and darker brick, like the plate
    br2 = nt.nodes.new('ShaderNodeTexBrick')
    br2.offset = 0.5
    br2.inputs['Color1'].default_value = (1.0, 1.0, 1.0, 1)
    br2.inputs['Color2'].default_value = (0.72, 0.68, 0.66, 1)
    br2.inputs['Mortar Size'].default_value = 0.0
    br2.inputs['Brick Width'].default_value = 1.9
    br2.inputs['Row Height'].default_value = 0.68
    br2.inputs['Bias'].default_value = 0.5
    nt.links.new(cv.outputs[0], br2.inputs['Vector'])
    mm = nt.nodes.new('ShaderNodeMixRGB'); mm.blend_type = 'MULTIPLY'; mm.inputs['Fac'].default_value = 1.0
    nt.links.new(br.outputs['Color'], mm.inputs['Color1'])
    nt.links.new(br2.outputs['Color'], mm.inputs['Color2'])
    nt.links.new(mm.outputs['Color'], b.inputs['Base Color'])
    CG['MATS'][BRICK] = m
    return m


brick_material()
BAYS = 9                                                    # bays along the wharf, each with a tall door
BY0, BYL = -14.0, 7.4                                       # first bay, bay length
WHY1 = BY0 + BAYS * BYL
box('wh_wall', WHX0, BY0, 0, WX0, WHY1, EAVE, BRICK)
box('wh_plinth', WX0 - 0.02, BY0, 0, WX0 + 0.12, WHY1, 0.55, '#5d4a3f')
prism('wh_gable', [(WHX0 - 0.6, EAVE), (WX0 + 0.7, EAVE), ((WHX0 + WX0) / 2, RIDGE)], BY0 - 0.5, WHY1 + 0.5, ROOF)
box('wh_endwall', WHX0, BY0 - 0.02, 0, WX0, BY0, EAVE, BRICK)
prism('wh_endgable', [(WHX0, EAVE), (WX0, EAVE), ((WHX0 + WX0) / 2, RIDGE - 0.35)], BY0 - 0.25, BY0, BRICK)
mb = MB()
for k in range(BAYS + 1):                                   # brick pilasters between the bays, and the cornice
    y = BY0 + k * BYL
    mb.box(WX0 - 0.05, y - 0.35, 0, WX0 + 0.28, y + 0.35, EAVE - 0.2, BRICK_DK)
mb.box(WX0, BY0, EAVE - 0.55, WX0 + 0.45, WHY1, EAVE - 0.2, BRICK_DK)
mb.box(WX0, BY0, EAVE - 0.2, WX0 + 0.75, WHY1, EAVE, '#3a3632')
DOORS = []
for k in range(BAYS):                                       # tall doorways, dark inside, with a sliding door half open
    yc = BY0 + (k + 0.5) * BYL
    w, h = 3.2, 4.6
    mb.box(WX0 - 0.2, yc - w / 2, 0.0, WX0 + 0.02, yc + w / 2, h, DOORWAY)
    mb.box(WX0 + 0.02, yc - w / 2 - 0.25, h, WX0 + 0.2, yc + w / 2 + 0.25, h + 0.45, '#7a6a58')        # stone lintel
    sd = 1 if k % 2 else -1
    mb.box(WX0 + 0.05, yc + sd * 0.4 - w / 2 + (w / 2 if sd > 0 else 0), 0.05, WX0 + 0.17, yc + sd * 0.4 + (w / 2 if sd > 0 else 0), h - 0.1, DOORWOOD)
    mb.box(WX0 + 0.1, yc - w / 2 - 0.5, h + 0.55, WX0 + 0.16, yc + w / 2 + 0.5, h + 0.62, HOOP)        # the door's rail
    for j in (-1, 1):                                       # two small upper windows a bay
        mb.box(WX0 - 0.1, yc + j * 1.1 - 0.4, 5.55, WX0 + 0.02, yc + j * 1.1 + 0.4, 6.75, DOORWAY)
        mb.box(WX0 + 0.02, yc + j * 1.1 - 0.5, 5.45, WX0 + 0.16, yc + j * 1.1 + 0.5, 5.55, '#7a6a58')
    DOORS.append(yc)
mb.build('wh_detail')
# the dark interiors: a few goods just inside the doors catch a little light
for k, yc in enumerate(DOORS[:4]):
    for j in range(3):
        box(f'inside{k}{j}', WX0 - 2.6 + j * 0.3, yc - 1.2 + j * 0.8, 0, WX0 - 1.6 + j * 0.3, yc - 0.4 + j * 0.8, 0.8 + 0.3 * (j % 2), '#3e3328')
# more warehouses and roofs behind, stepping inland (the city's waterfront)
for k, (x0, y0, x1, y1, h) in enumerate(((-46, -10, -28, 30, 11), (-44, 34, -27, 66, 9), (-70, -20, -50, 50, 14), (-38, 70, -12, 92, 8))):
    box(f'back{k}', x0, y0, 0, x1, y1, h, BRICK)
    prism(f'backroof{k}', [(x0 - 0.4, h), (x1 + 0.4, h), ((x0 + x1) / 2, h + 3.0)], y0 - 0.4, y1 + 0.4, ROOF_DK)
cyl('wh_chimney', (-56, 20, 14), (-56, 20, 24), 1.0, 0.8, BRICK_DK, n=8)

# ================================================================ the goods, piling up down the middle of the wharf
# source meshes (hidden), then linked duplicates
SRC = {}


def crate_src(name, w, d, h, body, frame):
    mb = MB()
    t = 0.07
    mb.box(-w / 2 + 0.02, -d / 2 + 0.02, 0.0, w / 2 - 0.02, d / 2 - 0.02, h - 0.01, body)
    for sx in (-1, 1):                                      # corner posts
        for sy in (-1, 1):
            mb.box(sx * w / 2 - (t if sx > 0 else 0), sy * d / 2 - (t if sy > 0 else 0), 0, sx * w / 2 + (0 if sx > 0 else t), sy * d / 2 + (0 if sy > 0 else t), h, frame)
    for z in (0.0, h - t):                                  # rims, top and bottom
        mb.box(-w / 2 - 0.01, -d / 2 - 0.01, z, w / 2 + 0.01, -d / 2 + t, z + t, frame)
        mb.box(-w / 2 - 0.01, d / 2 - t, z, w / 2 + 0.01, d / 2 + 0.01, z + t, frame)
        mb.box(-w / 2 - 0.01, -d / 2, z, -w / 2 + t, d / 2, z + t, frame)
        mb.box(w / 2 - t, -d / 2, z, w / 2 + 0.01, d / 2, z + t, frame)
    for sy in (-1, 1):                                      # a diagonal brace on the two long faces
        L = math.hypot(w - 2 * t, h - 2 * t)
        a = math.atan2(h - 2 * t, w - 2 * t) * (1 if sy > 0 else -1)
        R = Matrix.Rotation(-a, 3, 'Y')
        y0 = sy * d / 2 - (0.0 if sy > 0 else 0.015)
        mb.box(-L / 2, y0 - 0.015 if sy > 0 else y0, h / 2 - t / 2, L / 2, y0 + 0.0 if sy > 0 else y0 + 0.015, h / 2 + t / 2, frame, R=R, piv=(0, y0, h / 2))
    for sx in (-1, 1):                                      # and on the ends
        L = math.hypot(d - 2 * t, h - 2 * t)
        a = math.atan2(h - 2 * t, d - 2 * t) * sx
        R = Matrix.Rotation(a, 3, 'X')
        x0 = sx * w / 2
        mb.box(x0 - 0.015, -L / 2, h / 2 - t / 2, x0 + 0.015, L / 2, h / 2 + t / 2, frame, R=R, piv=(x0, 0, h / 2))
    for k in range(1, 4):                                   # board seams on the top
        mb.box(-w / 2 + t, -d / 2 + k * d / 4 - 0.008, h - 0.01, w / 2 - t, -d / 2 + k * d / 4 + 0.008, h + 0.002, frame)
    ob = mb.build(name)
    ob.hide_render = True
    return ob, (w, d, h)


SRC['crateA'] = crate_src('src_crateA', 1.25, 1.0, 0.95, CRATE, CRATE_DK)
SRC['crateB'] = crate_src('src_crateB', 0.95, 0.85, 0.75, CRATE_LT, CRATE_DK)
SRC['crateC'] = crate_src('src_crateC', 1.7, 0.9, 0.7, CRATE, '#8a7049')
SRC['crateD'] = crate_src('src_crateD', 1.1, 1.1, 1.1, '#9a7b52', CRATE_DK)


def barrel_src():
    mb = MB()
    prof = [(0.0, 0.3), (0.12, 0.34), (0.45, 0.37), (0.78, 0.34), (0.9, 0.3)]
    n = 12
    for i in range(len(prof) - 1):
        (z0, r0), (z1, r1) = prof[i], prof[i + 1]
        mb.cyl((0, 0, z0), (0, 0, z1), r0, r1, BARREL, n=n, caps=False)
    for z in (0.08, 0.26, 0.64, 0.82):
        r = 0.3 + 0.07 * math.sin(math.pi * z / 0.9) + 0.012
        mb.cyl((0, 0, z - 0.025), (0, 0, z + 0.025), r, r, HOOP, n=n, caps=False)
    mb.cyl((0, 0, 0.84), (0, 0, 0.87), 0.29, 0.29, '#6e5238', n=n)
    mb.cyl((0, 0, 0.0), (0, 0, 0.03), 0.29, 0.29, '#6e5238', n=n)
    ob = mb.build('src_barrel')
    ob.hide_render = True
    return ob


SRC['barrel'] = barrel_src()


def lumpy(name, size, col, bands=(), band_col=BAND, seed=0, sub=2, pinch=0.0):
    """a soft bundle: a subdivided box with its faces bulged and jittered (a sack, a cotton bale), with optional ties"""
    rr = random.Random(seed)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=sub, use_grid_fill=True)
    sx, sy, sz = size
    for v in bm.verts:
        p = v.co
        m = max(abs(p.x), abs(p.y), abs(p.z)) * 2
        q = p.normalized() * 0.5
        b = p.lerp(q, 0.45)                                 # bulge toward a sphere
        b *= 1 + rr.uniform(-0.05, 0.05)
        if pinch:                                           # gathered ends (a sack's tied neck)
            b.y *= 1 - pinch * (abs(p.y) * 2) ** 3 * 0
            b.x *= 1 - pinch * (abs(p.y) * 2) ** 4
            b.z *= 1 - pinch * (abs(p.y) * 2) ** 4
        v.co = Vector((b.x * sx, b.y * sy, b.z * sz + sz / 2))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = False
    me.materials.append(mat(col))
    if bands:
        me.materials.append(mat(band_col))
        for p in me.polygons:
            c = p.center
            if any(abs(c.y - b * sy) < sy * 0.09 for b in bands):
                p.material_index = 1
    ob = bpy.data.objects.new(name, me)
    sc.collection.objects.link(ob)
    ob.hide_render = True
    return ob


def bale_src(name, size, col, bands, seed):
    """a cotton bale in jute bagging, pressed hard: a pillowy block with iron bands round it, and tufts at the ends"""
    ob = lumpy(name, size, col, seed=seed, sub=2)
    me = ob.data
    for v in me.vertices:                                   # rounder: push the faces out
        c = Vector((v.co.x / size[0], v.co.y / size[1], (v.co.z - size[2] / 2) / size[2]))
        k = 1 + 0.08 * (1 - min(1, abs(c.y) * 2))
        v.co.x *= k
        v.co.z = size[2] / 2 + (v.co.z - size[2] / 2) * k
    mb = MB()
    n = 20
    for b in bands:                                         # each band follows the bale's rounded section (a superellipse)
        y = b * size[1]
        kb = 1 + 0.08 * (1 - min(1, abs(b) * 2))
        rings = []
        for yy, rs in ((y - 0.022, 1.02), (y - 0.022, 1.07), (y + 0.022, 1.07), (y + 0.022, 1.02)):
            rg = []
            for i in range(n):
                t = 2 * math.pi * i / n
                cx, sz = math.cos(t), math.sin(t)
                rg.append((size[0] / 2 * kb * rs * math.copysign(abs(cx) ** (2 / 3), cx), yy,
                           size[2] / 2 + size[2] / 2 * kb * rs * math.copysign(abs(sz) ** (2 / 3), sz)))
            rings.append(rg)
        vs = [v for rg in rings for v in rg]
        mb.poly(vs, [(j * n + i, j * n + (i + 1) % n, (j + 1) * n + (i + 1) % n, (j + 1) * n + i) for j in range(3) for i in range(n)], BAND)
    bo = mb.build(name + '_bands')
    bo.hide_render = True
    jm = bpy.data.meshes.new(name + 'j')
    import bmesh as _bm
    bm_ = _bm.new()
    bm_.from_mesh(me)
    bm_.from_mesh(bo.data)
    bm_.to_mesh(jm)
    bm_.free()
    jm.materials.append(mat(col))
    jm.materials.append(mat(BAND))
    nb = len(me.polygons)
    for i, p in enumerate(jm.polygons):
        p.material_index = 0 if i < nb else 1
        p.use_smooth = False
    ob.data = jm
    bpy.data.objects.remove(bo, do_unlink=True)
    return ob


SRC['bale'] = bale_src('src_bale', (0.95, 1.45, 0.8), COTTON, (-0.36, -0.12, 0.12, 0.36), 3)
SRC['bale2'] = bale_src('src_bale2', (0.9, 1.4, 0.85), '#c8bc9f', (-0.33, 0.0, 0.33), 5)
SRC['sack'] = lumpy('src_sack', (0.5, 0.95, 0.34), SACK, seed=7, sub=2, pinch=0.35)
SRC['sack2'] = lumpy('src_sack2', (0.52, 0.9, 0.36), SACK_DK, seed=9, sub=2, pinch=0.35)


def beam_src(L=7.5, h=0.3, wf=0.16):
    """a rolled I-beam lying on its flange (12-inch section): two flanges and the web, with the ends showing the I"""
    mb = MB()
    t = 0.025
    mb.box(-wf / 2, -L / 2, 0, wf / 2, L / 2, t, STEEL)
    mb.box(-wf / 2, -L / 2, h - t, wf / 2, L / 2, h, STEEL)
    mb.box(-0.014, -L / 2, t, 0.014, L / 2, h - t, STEEL_DK)
    ob = mb.build('src_beam')
    ob.hide_render = True
    return ob


SRC['beam'] = beam_src()


def rail_bundle_src(L=9.0):
    mb = MB()
    for i in range(5):
        x = -0.36 + i * 0.18
        mb.box(x - 0.06, -L / 2, 0, x + 0.06, L / 2, 0.02, STEEL_DK)
        mb.box(x - 0.012, -L / 2, 0.02, x + 0.012, L / 2, 0.11, STEEL_DK)
        mb.box(x - 0.03, -L / 2, 0.11, x + 0.03, L / 2, 0.15, STEEL)
    ob = mb.build('src_rails')
    ob.hide_render = True
    return ob


SRC['rails'] = rail_bundle_src()
CNT = [0]


def put(kind, x, y, z=0.0, rz=0.0, s=(1, 1, 1)):
    CNT[0] += 1
    src = SRC[kind][0] if isinstance(SRC[kind], tuple) else SRC[kind]
    return inst(src, f'{kind}{CNT[0]}', (x, y, z), rz, s)


def crate_stack(x0, y0, nx, ny, nz, kind='crateA', taper=1, seed=0, jit=0.05):
    """a pyramid of crates, each layer smaller; returns the top height"""
    rr = random.Random(seed)
    w, d, h = SRC[kind][1]
    top = 0
    for k in range(nz):
        ax, ay = max(1, nx - (k * taper + 1) // 2), max(1, ny - (k * taper) // 3)
        for i in range(ax):
            for j in range(ay):
                if 0 < k < nz - 1 and rr.random() < 0.1:
                    continue
                kd = kind if rr.random() < 0.75 else rr.choice(['crateA', 'crateB', 'crateD'])
                ww, dd, hh = SRC[kd][1]
                cx = x0 + (i + 0.5 + (nx - ax) / 2) * (w + 0.05)
                cy = y0 + (j + 0.5 + (ny - ay) / 2) * (d + 0.05)
                put(kd, cx + rr.uniform(-jit, jit), cy + rr.uniform(-jit, jit), k * h, rr.uniform(-0.06, 0.06))
                top = max(top, k * h + hh)
    return top


def sack_pile(x0, y0, nx, nz, along=True, seed=0):
    """sacks laid in rows, each row a little shorter: a heap like grain stacked on a wharf"""
    rr = random.Random(seed)
    for k in range(nz):
        for i in range(nx - k):
            for j in range(3 if k < 2 else 2):
                kd = 'sack' if rr.random() < 0.6 else 'sack2'
                x = x0 + (i + 0.5 * k) * 0.55
                y = y0 + j * 1.0 + 0.5 * (k % 2) + rr.uniform(-0.06, 0.06)
                put(kd, x, y, k * 0.29, rr.uniform(-0.12, 0.12) + (0 if along else math.pi / 2))


def bale_stack(x0, y0, nx, ny, nz, seed=0):
    rr = random.Random(seed)
    for k in range(nz):
        for i in range(nx - k):
            for j in range(ny):
                kd = 'bale' if rr.random() < 0.6 else 'bale2'
                put(kd, x0 + (i + 0.5 * k) * 1.0, y0 + j * 1.5 + rr.uniform(-0.05, 0.05), k * 0.8, rr.uniform(-0.06, 0.06))


def barrels(x0, y0, nx, ny, two=False, seed=0):
    rr = random.Random(seed)
    for i in range(nx):
        for j in range(ny):
            if rr.random() < 0.1:
                continue
            put('barrel', x0 + i * 0.72 + rr.uniform(-0.04, 0.04), y0 + j * 0.72 + rr.uniform(-0.04, 0.04), 0, rr.uniform(0, 6))
            if two and i < nx - 1 and j < ny - 1 and rr.random() < 0.5:
                put('barrel', x0 + i * 0.72 + 0.36, y0 + j * 0.72 + 0.36, 0.88, rr.uniform(0, 6))


def beam_stack(x0, y0, nlay, n=7, seed=0):
    """steel I-beams as a yard stacks them: each layer of beams standing upright on their flanges, a hand's width apart,
    on three timber sticks across; the layers set in a little each time, the beams' ends a little ragged"""
    rr = random.Random(seed)
    z = 0.0
    P = 0.26                                                 # beam pitch: 0.16 flange + a 0.10 gap
    for k in range(nlay):
        m = n - k
        xa = x0 + k * P / 2
        for d in (-2.6, 0.0, 2.6):                           # the sticks: 4x4 timbers, a little proud each side
            box(f'dun{x0:.0f}{y0:.0f}{k}{d}', xa - 0.12, y0 + d - 0.05, z, xa + m * P + 0.02, y0 + d + 0.05, z + 0.1, DUNNAGE)
        z += 0.1
        for i in range(m):
            put('beam', xa + i * P + 0.08, y0 + rr.uniform(-0.25, 0.25), z, rr.uniform(-0.006, 0.006))
        z += 0.3


# the arrangement (lanes left clear by the warehouse doors, x < -5.6, and along the ship, x > 5.6)
# near the camera
crate_stack(-5.2, -11.5, 2, 1, 2, 'crateA', seed=1)
put('crateB', -4.4, -8.4, 0, 0.3)
crate_stack(-4.6, -16.0, 2, 1, 2, 'crateB', seed=31)
barrels(4.2, -15.6, 2, 2, seed=32)
put('crateA', 3.0, -14.6, 0, 0.2)
bale_stack(2.6, -12.0, 2, 2, 2, seed=2)
barrels(-1.2, -9.0, 3, 2, seed=3)
# the middle distance: everything piling up
crate_stack(-5.3, -4.0, 4, 2, 4, 'crateA', seed=4)
sack_pile(-0.8, -5.0, 5, 4, seed=5)
bale_stack(2.4, -5.6, 3, 3, 3, seed=6)
barrels(-1.6, 1.5, 4, 3, two=True, seed=7)
crate_stack(1.6, 1.0, 3, 2, 4, 'crateD', seed=8)
beam_stack(-5.2, 9.5, 4, 8, seed=9)
crate_stack(-1.6, 6.0, 4, 3, 5, 'crateC', seed=10)
sack_pile(2.6, 7.0, 5, 5, seed=11)
put('rails', 4.2, 16.0, 0.0)
put('rails', 4.2, 16.0, 0.16)
put('rails', 3.3, 16.0, 0.0)
crate_stack(-5.3, 15.0, 5, 3, 7, 'crateA', seed=12)
bale_stack(0.6, 14.5, 3, 3, 4, seed=13)
crate_stack(1.8, 21.0, 3, 3, 5, 'crateB', seed=14)
beam_stack(-5.0, 25.0, 5, 9, seed=15)
sack_pile(-1.0, 22.0, 5, 4, seed=16)
bale_stack(-5.2, 30.4, 4, 3, 3, seed=20)
crate_stack(-1.0, 30.2, 4, 3, 8, 'crateD', seed=17)
sack_pile(-5.2, 36.6, 6, 4, seed=24)
crate_stack(-1.4, 36.8, 5, 3, 7, 'crateA', seed=19)
barrels(-5.1, 41.0, 5, 3, two=True, seed=18)
crate_stack(-5.0, 44.5, 7, 4, 9, 'crateC', seed=21)
crate_stack(-4.0, 54.0, 6, 4, 5, 'crateB', seed=22)
crate_stack(-4.5, 61.0, 7, 4, 8, 'crateA', seed=23)
print('GOODS', CNT[0], 'pieces')

# a sling of sacks swinging over the wharf from the ship's derrick (it sways, stepped)
SLING = empty('sling', (7.0, 21.0, 9.5))
for k in range(5):
    s_ = inst(SRC['sack' if k % 2 else 'sack2'], f'slsack{k}', (-0.25 + (k % 2) * 0.5, -0.45 + (k // 2) * 0.45, -3.4 + (k // 4) * 0.3), 0.1 * k, (1, 1, 1))
    s_.parent = SLING
mb = MB()
for sx in (-1, 1):
    for sy in (-1, 1):
        mb.cyl((sx * 0.55, sy * 0.6, -3.3), (0, 0, -1.6), 0.015, 0.015, RIG, n=4)
mb.cyl((0, 0, -1.6), (0, 0, 0), 0.02, 0.02, RIG, n=4)
mb.box(-0.08, -0.08, -1.75, 0.08, 0.08, -1.55, HOOP)
sl = mb.build('slingrope')
sl.parent = SLING

# ================================================================ the steam freighter, moored along the wharf, bow toward the camera
XC, BEAM, Y_BOW, LEN = 16.6, 12.0, 6.0, 84.0
DECKZ = 2.6


def half_breadth(t):
    if t < 0.2:
        return BEAM / 2 * math.sin(t / 0.2 * math.pi / 2) ** 0.75
    if t > 0.88:
        return BEAM / 2 * (1 - 0.45 * ((t - 0.88) / 0.12) ** 1.6)
    return BEAM / 2


def deck_z(t):
    return DECKZ + 1.7 * max(0.0, 1 - t / 0.22) ** 2 + 0.8 * max(0.0, (t - 0.85) / 0.15) ** 2


ST = [i / 40 for i in range(41)]
LEVELS = [(-3.0, BOOT), (ZW, BOOT), (ZW + 0.75, HULL), (None, STRAKE), (0.55, HULL)]   # None: the deck line; 0.55: bulwark top (above deck)
mb = MB()
for side in (-1, 1):
    rows = []
    for t in ST:
        b = half_breadth(t)
        dz = deck_z(t)
        zs = [-3.0, ZW, ZW + 0.75, dz - 0.35, dz + 1.0]
        row = []
        for j, z in enumerate(zs):
            rake = 0.0 if t > 0.05 else (z - ZW) * 0.32 * (1 - t / 0.05)       # the stem rakes forward above the water
            shape = 1.0 if z > ZW - 0.5 else 0.8
            row.append((XC + side * max(b * shape, 0.02), Y_BOW + t * LEN - rake, z))
        rows.append(row)
    verts = [v for r in rows for v in r]
    nl = 5
    for j, col in enumerate((BOOT, BOOT, HULL, STRAKE)):
        fs = []
        for i in range(len(ST) - 1):
            a, b_ = i * nl + j, (i + 1) * nl + j
            fs.append((a, b_, b_ + 1, a + 1) if side > 0 else (a, a + 1, b_ + 1, b_))
        mb.poly(verts, fs, col)
# the transom (stern), closing the two sides
for j, z in enumerate((ZW + 0.75, DECKZ + 1.4)):
    pass
bt = half_breadth(1.0)
mb.poly([(XC - bt, Y_BOW + LEN, ZW), (XC + bt, Y_BOW + LEN, ZW), (XC + bt, Y_BOW + LEN, deck_z(1.0) + 1.0), (XC - bt, Y_BOW + LEN, deck_z(1.0) + 1.0)], [(0, 1, 2, 3)], HULL)
hull = mb.build('hull')
hull.modifiers.new('solid', 'SOLIDIFY').thickness = 0.18
# the deck
mb = MB()
dv = []
for t in ST:
    b = half_breadth(t) - 0.1
    dv += [(XC - max(b, 0.01), Y_BOW + t * LEN, deck_z(t)), (XC + max(b, 0.01), Y_BOW + t * LEN, deck_z(t))]
mb.poly(dv, [(2 * i, 2 * i + 1, 2 * i + 3, 2 * i + 2) for i in range(len(ST) - 1)], '#8a7a62')
# bulwark cap rail
for side in (-1, 1):
    for i in range(len(ST) - 1):
        t0, t1 = ST[i], ST[i + 1]
        p0 = (XC + side * (half_breadth(t0) - 0.05), Y_BOW + t0 * LEN, deck_z(t0) + 1.0)
        p1 = (XC + side * (half_breadth(t1) - 0.05), Y_BOW + t1 * LEN, deck_z(t1) + 1.0)
        mb.cyl(p0, p1, 0.09, 0.09, STRAKE, n=4)
mb.build('deck')
S = lambda t: Y_BOW + t * LEN
mb = MB()
# hatches with their coamings and tarpaulins
for (t0, t1) in ((0.16, 0.24), (0.3, 0.37), (0.62, 0.69), (0.76, 0.83)):
    mb.box(XC - 2.6, S(t0), DECKZ, XC + 2.6, S(t1), DECKZ + 0.9, '#5a4c3c')
    mb.box(XC - 2.4, S(t0) + 0.2, DECKZ + 0.9, XC + 2.4, S(t1) - 0.2, DECKZ + 1.0, '#6b6252')
# the bridge deckhouse amidships, white, with dark windows, the wheelhouse on top, and lifeboats
YB0, YB1 = S(0.42), S(0.53)
mb.box(XC - 4.2, YB0, DECKZ, XC + 4.2, YB1, DECKZ + 2.5, WHITE)
mb.box(XC - 5.4, YB0 - 0.6, DECKZ + 2.5, XC + 5.4, YB1 + 0.3, DECKZ + 2.7, '#bdb4a0')
mb.box(XC - 2.4, YB0 + 0.6, DECKZ + 2.7, XC + 2.4, YB0 + 4.0, DECKZ + 4.9, WHITE)
mb.box(XC - 2.8, YB0 + 0.3, DECKZ + 4.9, XC + 2.8, YB0 + 4.3, DECKZ + 5.1, '#bdb4a0')
for k in range(6):
    x = XC - 2.0 + k * 0.8
    mb.box(x - 0.22, YB0 + 0.56, DECKZ + 3.6, x + 0.22, YB0 + 0.62, DECKZ + 4.4, '#33383a')
for k in range(7):
    y = YB0 + 1.0 + k * 1.3
    for sx in (-1, 1):
        mb.box(XC + sx * 4.22 - 0.03, y - 0.3, DECKZ + 1.2, XC + sx * 4.22 + 0.03, y + 0.3, DECKZ + 1.9, '#33383a')
for sx in (-1, 1):                                          # lifeboats in their chocks, with davits
    for yy in (YB0 + 2.0, YB1 - 2.8):
        mb.cyl((XC + sx * 4.6, yy - 1.6, DECKZ + 3.2), (XC + sx * 4.6, yy + 1.6, DECKZ + 3.2), 0.55, 0.55, WHITE, n=8)
        mb.box(XC + sx * 4.6 - 0.5, yy - 1.4, DECKZ + 3.15, XC + sx * 4.6 + 0.5, yy + 1.4, DECKZ + 3.5, '#bfb6a2')
        for dy in (-1.8, 1.8):
            mb.cyl((XC + sx * 4.0, yy + dy, DECKZ + 2.7), (XC + sx * 4.9, yy + dy, DECKZ + 4.6), 0.06, 0.06, RIG, n=4)
# the forecastle and the poop: raised decks at bow and stern
mb.box(XC - 5.0, S(0.02), deck_z(0.03) - 0.05, XC + 5.0, S(0.1), deck_z(0.03) + 0.05, '#8a7a62')
mb.box(XC - 5.2, S(0.88), DECKZ, XC + 5.2, S(0.97), DECKZ + 1.9, WHITE)
# the funnel (buff with a black top), raked aft, and ventilator cowls
FY = YB1 + 2.2
mb.cyl((XC, FY, DECKZ + 2.5), (XC, FY + 1.5, DECKZ + 12.0), 1.25, 1.25, FUNNEL, n=14)
mb.cyl((XC, FY + 1.5, DECKZ + 12.0), (XC, FY + 1.8, DECKZ + 13.9), 1.27, 1.27, FUNNEL_TOP, n=14)
for sx, yy in ((-1, FY - 3), (1, FY - 3), (-1, FY + 3.5), (1, FY + 3.5)):
    mb.cyl((XC + sx * 2.6, yy, DECKZ), (XC + sx * 2.6, yy, DECKZ + 3.6), 0.28, 0.28, WHITE, n=8)
    mb.cyl((XC + sx * 2.6, yy, DECKZ + 3.6), (XC + sx * 2.6, yy - 0.5, DECKZ + 4.2), 0.32, 0.55, WHITE, n=8)
    mb.cyl((XC + sx * 2.6, yy - 0.5, DECKZ + 4.2), (XC + sx * 2.6, yy - 0.55, DECKZ + 4.2), 0.48, 0.48, '#3a2a22', n=8)
# masts with crosstrees, topmasts, derrick booms
MASTS = [(S(0.27), 22.0), (S(0.73), 21.0)]
for k, (my, mh) in enumerate(MASTS):
    mb.cyl((XC, my, DECKZ), (XC, my, DECKZ + mh * 0.7), 0.32, 0.24, MAST, n=8)
    mb.cyl((XC, my, DECKZ + mh * 0.66), (XC, my, DECKZ + mh), 0.16, 0.08, MAST, n=6)
    mb.box(XC - 2.2, my - 0.12, DECKZ + mh * 0.66, XC + 2.2, my + 0.12, DECKZ + mh * 0.66 + 0.15, MAST)
    mb.box(XC - 3.2, my - 0.1, DECKZ + mh * 0.48, XC + 3.2, my + 0.1, DECKZ + mh * 0.48 + 0.18, MAST)
    for sy in (-1, 1):                                      # two derricks a mast, one fore and one aft
        if k == 0 and sy < 0:
            continue
        mb.cyl((XC, my + sy * 0.4, DECKZ + 1.6), (XC + 1.2, my + sy * 9.0, DECKZ + 6.5), 0.14, 0.1, MAST, n=6)
    # shrouds from the hounds to the ship's side, and the stays
    for sx in (-1, 1):
        for d in (-1.6, -0.5, 0.6, 1.7):
            t_ = (my + d - Y_BOW) / LEN
            mb.cyl((XC + sx * 0.25, my, DECKZ + mh * 0.66), (XC + sx * (half_breadth(t_) - 0.1), my + d, deck_z(t_) + 1.0), 0.035, 0.035, RIG, n=4)
mb.cyl((XC, MASTS[0][0], DECKZ + MASTS[0][1]), (XC, Y_BOW - 0.6, deck_z(0) + 1.0), 0.035, 0.035, RIG, n=4)
mb.cyl((XC, MASTS[0][0], DECKZ + MASTS[0][1]), (XC, MASTS[1][0], DECKZ + MASTS[1][1]), 0.03, 0.03, RIG, n=4)
mb.cyl((XC, MASTS[1][0], DECKZ + MASTS[1][1]), (XC, S(0.99), deck_z(1) + 1.9), 0.035, 0.035, RIG, n=4)
mb.cyl((XC, FY + 1.3, DECKZ + 11.0), (XC - 4.5, FY - 2, DECKZ + 2.7), 0.025, 0.025, RIG, n=4)
mb.cyl((XC, FY + 1.3, DECKZ + 11.0), (XC + 4.5, FY - 2, DECKZ + 2.7), 0.025, 0.025, RIG, n=4)
# the derrick working over the wharf: a boom swung out from the foremast, its fall down to the sling
mb.cyl((XC - 0.3, MASTS[0][0] - 0.4, DECKZ + 1.6), (SLING.location.x, SLING.location.y, SLING.location.z + 0.4), 0.15, 0.1, MAST, n=6)
mb.cyl((XC, MASTS[0][0], DECKZ + MASTS[0][1] * 0.66), (SLING.location.x, SLING.location.y, SLING.location.z + 0.4), 0.03, 0.03, RIG, n=4)
# the gangway from the wharf to the deck
GY = S(0.37) + 2.0
mb.box(WX1 - 0.4, GY - 0.45, 0.05, XC - 4.0, GY + 0.45, 0.12, '#7a6a55', R=Matrix.Rotation(-math.atan2(DECKZ + 1.0, XC - 4.0 - WX1), 3, 'Y'), piv=(WX1 - 0.4, GY, 0.1))
# mooring lines: bow and stern to the bollards
for (bx, by), (sx_, sy_, sz_) in (((WX1 - 0.6, 4), (XC - 4.6, S(0.12), deck_z(0.12) + 0.6)),
                                  ((WX1 - 0.6, 66), (XC - 5.0, S(0.75), DECKZ + 0.6))):
    a, b = Vector((bx, by, 0.6)), Vector((sx_, sy_, sz_))
    pts = [a.lerp(b, u) - Vector((0, 0, 0.9 * math.sin(math.pi * u))) for u in (0, 0.25, 0.5, 0.75, 1.0)]
    for i in range(4):
        mb.cyl(pts[i], pts[i + 1], 0.05, 0.05, '#6a5c48', n=4)
mb.build('ship')
# the name board at the bow (cream), the anchor
box('hawse', XC - BEAM / 2 * 0.62 - 0.05, Y_BOW + 3.0, DECKZ + 0.6, XC - BEAM / 2 * 0.62 + 0.05, Y_BOW + 3.7, DECKZ + 1.2, '#1a1918')

# ================================================================ across the water: the far shore, a grain elevator, mills smoking, hills
terrain('farland', -700, 700, 230, 300, 30, 4, lambda x, y: 1.5 + 2.5 * math.sin(x * 0.02) * (y - 230) / 70, LAND)


def hills(x, y):
    h = 0
    for (px, py, ph, pw) in ((-260, 520, 95, 120), (-60, 600, 70, 140), (180, 540, 110, 110), (420, 580, 85, 120), (-480, 600, 70, 120)):
        h += ph * math.exp(-((x - px) ** 2 + (y - py) ** 2 * 0.8) / (2 * pw * pw))
    return h + 4 * math.sin(x * 0.03) * math.sin(y * 0.04) - 2


terrain('hills', -900, 900, 290, 800, 46, 16, hills, HILL)
mb = MB()
# the grain elevator (tall timber, a cupola on the ridge), after the Buffalo photograph
EX, EY = -62.0, 252.0
mb.box(EX - 9, EY - 7, 0, EX + 9, EY + 7, 30, '#5a4636')
mb.poly([(EX - 9.5, EY - 7.5, 30), (EX + 9.5, EY - 7.5, 30), (EX, EY - 7.5, 36), (EX - 9.5, EY + 7.5, 30), (EX + 9.5, EY + 7.5, 30), (EX, EY + 7.5, 36)],
        [(0, 1, 2), (5, 4, 3), (0, 2, 5, 3), (1, 4, 5, 2)], ROOF_DK)
mb.box(EX - 2, EY - 2, 34, EX + 2, EY + 2, 39, '#5a4636')
mb.box(EX - 2.4, EY - 2.4, 39, EX + 2.4, EY + 2.4, 40, ROOF_DK)
mb.box(EX + 9, EY - 5, 0, EX + 20, EY + 5, 18, '#655040')
mb.box(EX - 30, EY - 6, 0, EX - 12, EY + 6, 22, '#5e4a3a')
mb.box(EX - 30.5, EY - 6.5, 22, EX - 11.5, EY + 6.5, 23, ROOF_DK)
# a steel works farther along: sheds, stoves, chimneys
for k, (x, w, h) in enumerate(((40, 30, 9), (78, 24, 12), (110, 36, 8), (150, 20, 10), (-140, 40, 8), (-110, 22, 11))):
    mb.box(x - w / 2, 248, 0, x + w / 2, 262, h, '#6a5a4c' if k % 2 else '#75645a')
    mb.poly([(x - w / 2 - 0.5, 247.5, h), (x + w / 2 + 0.5, 247.5, h), (x + w / 2 + 0.5, 262.5, h), (x - w / 2 - 0.5, 262.5, h), (x - w / 2, 255, h + 4), (x + w / 2, 255, h + 4)],
            [(0, 1, 5, 4), (2, 3, 4, 5), (0, 4, 3), (1, 2, 5)], ROOF_DK)
CHIMNEYS = [(52.0, 258.0, 34.0), (64.0, 256.0, 28.0), (96.0, 258.0, 38.0), (128.0, 256.0, 30.0), (-126.0, 256.0, 32.0)]
for x, y, h in CHIMNEYS:
    mb.cyl((x, y, 0), (x, y, h), 1.4, 1.0, '#4a3a32', n=8)
for k in range(4):                                          # blast-furnace stoves
    mb.cyl((84 + k * 5.0, 268, 0), (84 + k * 5.0, 268, 16), 2.0, 2.0, '#5c5450', n=10)
    mb.poly([(84 + k * 5.0 + 2.0 * math.cos(a * math.pi / 5), 268 + 2.0 * math.sin(a * math.pi / 5), 16) for a in range(10)] + [(84 + k * 5.0, 268, 18)],
            [(a, (a + 1) % 10, 10) for a in range(10)], '#4a4440')
mb.build('farshore')
# ships out in the harbour: a three-masted barque at anchor, a small steamer
mb = MB()
for (sx, sy, L, masts) in ((70.0, 150.0, 40.0, 3), (-30.0, 190.0, 30.0, 1)):
    mb.box(sx - 4, sy - L / 2, ZW - 0.5, sx + 4, sy + L / 2, ZW + 2.2, HULL)
    mb.box(sx - 4.1, sy - L / 2, ZW + 1.9, sx + 4.1, sy + L / 2, ZW + 2.3, STRAKE)
    if masts == 3:
        for m_ in range(3):
            my = sy - L / 3 + m_ * L / 3
            mb.cyl((sx, my, ZW + 2), (sx, my, ZW + 26 - 2 * m_), 0.3, 0.15, MAST, n=6)
            for z in (10, 16, 21):
                mb.box(sx - 6 + z * 0.15, my - 0.15, ZW + z, sx + 6 - z * 0.15, my + 0.15, ZW + z + 0.3, MAST)
    else:
        mb.box(sx - 2.5, sy - 5, ZW + 2.2, sx + 2.5, sy + 4, ZW + 4.5, WHITE)
        mb.cyl((sx, sy + 1, ZW + 4.5), (sx, sy + 1.5, ZW + 10), 0.8, 0.8, HULL, n=8)
        mb.cyl((sx, sy - 10, ZW + 2), (sx, sy - 10, ZW + 14), 0.2, 0.12, MAST, n=6)
mb.build('harbourships')

# clouds: long soft cream banks low over the hills, as in the plate (smooth-ish ellipsoids with flat bottoms)
CLOUD = '#ece1c6'
for ci, (cx, cyy, cz, cw) in enumerate(((-420, 1000, 330, 260), (-60, 1150, 430, 220), (330, 1000, 300, 300), (720, 1100, 420, 220), (-800, 1150, 450, 240))):
    rr = random.Random(ci)
    for k in range(7):
        u = (k - 3) / 3
        r = cw * (0.32 - 0.14 * abs(u)) * rr.uniform(0.85, 1.1)
        ico(f'cl{ci}{k}', (cx + u * cw * 0.85, cyy + rr.uniform(-30, 30), cz + r * 0.25), r, CLOUD, 2, (1.6, 0.6, 0.62), seed=ci * 20 + k)
    box(f'clbase{ci}', cx - cw * 1.05, cyy - 40, cz - 4, cx + cw * 1.05, cyy + 40, cz + cw * 0.05, CLOUD)

# ================================================================ smoke from the far chimneys and the freighter's funnel (stepped)
PUFFS = []


def smoke(name, base, n, size, rise, drift, col, life=7.0, seed=0):
    """a chain of puffs leaving a stack: each puff rises and drifts downwind, swells, and goes round again"""
    rr = random.Random(seed)
    for k in range(n):
        p = ico(f'{name}{k}', (0, 0, 0), 1.0, col, 2, (1.4, 1.0, 0.8), seed=seed * 50 + k)
        PUFFS.append((p, Vector(base), k / n, size, rise, Vector(drift), life, rr.uniform(0, 6)))


for i, (x, y, h) in enumerate(CHIMNEYS):
    smoke(f'smk{i}', (x, y, h + 0.5), 8, 1.6, 12.0 + 3 * (i % 2), (-22.0, 6.0, 0.0), '#bfbab0' if i % 2 else '#99948c', life=8.0 + i, seed=i + 1)
smoke('fun', (XC, FY + 1.8, DECKZ + 14.0), 7, 0.9, 7.0, (-9.0, 5.0, 0), '#cfc8ba', life=5.0, seed=9)


def animate_smoke():
    for f in range(N):
        tq = TQ[f]
        for p, base, ph, size, rise, drift, life, wob in PUFFS:
            s = (tq / life + ph) % 1.0
            p.location = base + Vector((0, 0, rise * s ** 0.8)) + drift * s ** 1.3 + Vector((0.4 * size * math.sin(tq * 0.8 + wob), 0, 0))
            k = size * (0.45 + 1.6 * s ** 0.7) * (1 if s < 0.92 else (1 - s) / 0.08)
            p.scale = (k, k, k)
            p.keyframe_insert('location', frame=f)
            p.keyframe_insert('scale', frame=f)
    for p, *_ in PUFFS:
        for fc in p.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = 'CONSTANT'


animate_smoke()

# gulls wheeling over the wharf (wings flap, stepped)
GULLS = []
for g in range(4):
    root = empty(f'gull{g}', (0, 0, 0))
    mb = MB()
    mb.poly([(0, -0.25, 0), (0, 0.3, 0.02), (0.08, 0.0, 0.03)], [(0, 1, 2)], '#ece8dc')
    mb.poly([(0, -0.25, 0), (0, 0.3, 0.02), (-0.08, 0.0, 0.03)], [(0, 2, 1)], '#ece8dc')
    mb.build(f'gullbody{g}').parent = root
    wings = []
    for sx in (-1, 1):
        w_ = empty(f'gw{g}{sx}', (0, 0.05, 0.02), root)
        mb = MB()
        mb.poly([(0, -0.15, 0), (sx * 0.55, -0.05, 0.12), (sx * 1.05, -0.3, 0.0), (0, 0.15, 0)], [(0, 1, 2), (0, 3, 1)] if sx > 0 else [(0, 2, 1), (0, 1, 3)], '#e4e0d4')
        mb.build(f'gwing{g}{sx}').parent = w_
        wings.append((w_, sx))
    GULLS.append((root, wings, g))
for f in range(N):
    tq = TQ[f]
    for root, wings, g in GULLS:
        a = tq * (0.12 + 0.03 * g) + g * 1.7
        cx, cy, r, z = ((4.0, 26.0, 9.0, 15.0), (-2.0, 40.0, 12.0, 19.0), (10.0, 14.0, 7.0, 12.5), (2.0, 55.0, 14.0, 22.0))[g]
        root.location = (cx + r * math.cos(a), cy + r * math.sin(a), z + 0.8 * math.sin(tq * 0.7 + g))
        root.rotation_euler = (0, 0, a + math.pi)
        root.keyframe_insert('location', frame=f)
        root.keyframe_insert('rotation_euler', frame=f)
        flap = 0.55 * math.sin(tq * 7.0 + g * 2) if (int(tq * 0.5 + g) % 3) else 0.1
        for w_, sx in wings:
            w_.rotation_euler = (0, -sx * flap, 0)
            w_.keyframe_insert('rotation_euler', frame=f)
    s_ = SLING
    s_.rotation_euler = (0.06 * math.sin(tq * 1.3), 0.05 * math.sin(tq * 0.9 + 1), 0.08 * math.sin(tq * 0.5))
    s_.keyframe_insert('rotation_euler', frame=f)
for ob in [r for r, *_ in GULLS] + [w for _, ws, _ in GULLS for w, _ in ws] + [SLING]:
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'

# ================================================================ the dockworkers
# costumes added here: shirt sleeves, a dark vest, a flat cap or a soft felt hat; work trousers
C = PG['COSTUMES']
band, ZC_, flat_cap, boater, boater_brim, hat_band = PG['band'], PG['ZC'], PG['flat_cap'], PG['boater'], PG['boater_brim'], PG['hat_band']
R0, C0, scaled, capped, disc = PG['R0'], PG['C0'], PG['scaled'], PG['capped'], PG['disc']


def felt_hat():
    """a soft felt work hat: a rounded crown with a dent, a short drooping brim"""
    return capped([R0, scaled(R0, 1.02, C0, 0.3), scaled(R0, 0.8, C0, 0.42)])


def felt_brim():
    return disc(scaled(R0, 0.98, C0), scaled(R0, 1.45, C0, -0.06, 1.38), curl=-0.04)


SHIRTS = ['#d6ccb4', '#7d8fa0', '#a45d45', '#e2dccd', '#8d8a7a', '#6f7f8f']
VESTS = ['#3b3631', '#4a4038', '#2f3236', '#55493c']
TROUS = ['#3d3a35', '#4b4a52', '#5a4a3a', '#44403a']
SKINS = ['#d9b38f', '#c89d7a', '#8f6a4c', '#6e4f3a', '#b98a66', '#5e4232']
for i in range(6):
    hat = [('cap', 'Head', flat_cap, ['#3a3631', '#55504a', '#2f2c2a'][i % 3])] if i % 3 != 2 else \
          [('hat', 'Head', felt_hat, '#4a4136'), ('brim', 'Head', felt_brim, '#4a4136')]
    vest = [('vest', 'Spine1', lambda: band(ZC_ - 0.3, 0.5, off=0.05), VESTS[i % 4])] if i % 2 == 0 else []
    C[f'dock{i}'] = dict(coat=SHIRTS[i], skin=SKINS[i], hair='#2a2622', legs=TROUS[i % 4], shoes='#24201c',
                         parts=vest + hat + [('belt', 'Hips', lambda: band(PG['ZW'], 0.1, off=0.04), '#2a2420')])
C['clerk'] = dict(coat='#2e2b28', skin='#d9b38f', hair='#5b4330', legs='#3a3631', shoes='#1d1b18',
                  parts=[('tails', 'Hips', lambda: PG['tails'](1.6, 0.75), '#2e2b28'), ('collar', 'Spine2', lambda: PG['collar'](0.16), '#efe9dc'),
                         ('hat', 'Head', lambda: capped([R0, scaled(R0, 1.03, C0, 0.3), scaled(R0, 0.75, C0, 0.42)]), '#1f1d1a'),
                         ('brim', 'Head', lambda: disc(scaled(R0, 0.98, C0), scaled(R0, 1.3, C0, 0.0, 1.2), curl=0.05), '#1f1d1a')])


def body_axes(arm):
    """front, up and right of a person, in its armature's space (after stand()'s reset of the hips)"""
    bpy.context.view_layer.update()
    H = arm.pose.bones['Hips'].matrix
    F, U = Vector(H.col[2][:3]).normalized(), Vector(H.col[1][:3]).normalized()
    return F, U, F.cross(U)


def solve(arm, aims, base=None):
    """a pose for stand()/hold(): `base` bones as given (degrees), then each bone in `aims` turned so it points along a
    direction given in body terms (front, up, right). Returns {bone: (x, y, z) degrees}."""
    hq = [WALK.fcurves.find('pose.bones["Hips"].rotation_quaternion', index=i).evaluate(WALK.frame_range[0]) for i in range(4)]
    tw = math.hypot(hq[0], hq[2])
    act = arm.animation_data.action
    arm.animation_data.action = None
    for pb in arm.pose.bones:
        pb.location = (0, 0, 0)
        pb.rotation_quaternion = (hq[0] / tw, 0, hq[2] / tw, 0) if pb.name == 'Hips' else (1, 0, 0, 0)
        pb.rotation_euler = (0, 0, 0)
    out = {}
    for bn, (x, y, z) in (base or {}).items():
        pb = arm.pose.bones[bn]
        pb.rotation_mode = 'XYZ'
        pb.rotation_euler = (math.radians(x), math.radians(y), math.radians(z))
        out[bn] = (x, y, z)
    F, U, R = body_axes(arm)
    for bn, d in aims:
        pb = arm.pose.bones[bn]
        pb.rotation_mode = 'XYZ'
        bpy.context.view_layer.update()
        M = pb.matrix.copy()
        y_ = Vector(M.col[1][:3]).normalized()
        want = (F * d[0] + U * d[1] + R * d[2]).normalized()
        R3 = y_.rotation_difference(want).to_matrix() @ M.to_3x3()
        M2 = R3.to_4x4()
        M2.translation = M.translation
        pb.matrix = M2
        bpy.context.view_layer.update()
        out[bn] = tuple(math.degrees(v) for v in pb.rotation_euler)
    arm.animation_data.action = act
    return out


def hold(arm, pose):
    """override bones of a baked walk with a fixed pose (a load held), keeping the legs and body walking"""
    act = arm.animation_data.action
    for bn, (x, y, z) in pose.items():
        for fc in list(act.fcurves):
            if fc.data_path.startswith(f'pose.bones["{bn}"].rotation'):
                act.fcurves.remove(fc)
        arm.pose.bones[bn].rotation_mode = 'XYZ'
        for i, v in enumerate((x, y, z)):
            act.fcurves.new(f'pose.bones["{bn}"].rotation_euler', index=i).keyframe_points.insert(0, math.radians(v)).interpolation = 'CONSTANT'


ZERO_SH = {'LeftShoulder': (0, 0, 0), 'RightShoulder': (0, 0, 0)}
LOADS = {   # arm aims (front, up, right) for each kind of load
    'sack': [('RightArm', (0.25, 0.25, 1.0)), ('RightForeArm', (0.15, 1.0, -0.55))],
    'crate': [('LeftArm', (0.45, -0.9, -0.12)), ('RightArm', (0.45, -0.9, 0.12)), ('LeftForeArm', (1.0, 0.25, 0.1)), ('RightForeArm', (1.0, 0.25, -0.1))],
    'truck': [('LeftArm', (0.35, -0.95, -0.15)), ('RightArm', (0.35, -0.95, 0.15)), ('LeftForeArm', (0.75, -0.55, 0.0)), ('RightForeArm', (0.75, -0.55, 0.0))],
    'none': [],
}
VP = PG['VPTS']
HEADY = PG['bone_head']


def hands_raw(arm, bone='Spine2'):
    """the posed hands in raw body units, in the frame a shell parented to `bone` is built in (so a load made there sits
    in the hands as the body walks)"""
    bpy.context.view_layer.update()
    body = [o for o in arm.children if o.type == 'MESH' and o.data.vertices and len(o.vertex_groups) > 10][0]
    ev = body.evaluated_get(bpy.context.evaluated_depsgraph_get()).data
    gn = {g.index: g.name for g in body.vertex_groups}
    pb = arm.pose.bones[bone]
    to_raw = PG['bone_parent_inverse'](bone).inverted() @ (arm.matrix_world @ pb.matrix @ Matrix.Translation((0, pb.length, 0))).inverted()
    out = {}
    for side in ('Left', 'Right'):
        ids = [v.index for v in body.data.vertices if v.groups and gn[max(v.groups, key=lambda g: g.weight).group].startswith(side + 'Hand')]
        out[side] = to_raw @ (body.matrix_world @ (sum((ev.vertices[i].co for i in ids), Vector()) / len(ids)))
    return out


def load_mesh(kind, hands=None):
    """the load in raw body units (the body faces +x, its right is -y, z up), to ride on the chest bone; with `hands`
    (hands_raw) it is fitted to them: the crate held between the palms, the sack with the right hand on it"""
    sh = HEADY('RightArm')
    if kind == 'sack':                                      # a sack across the right shoulder, beside the head
        cx, cy, cz = -0.15, sh.y - 0.15, sh.z + 0.62
        sx_, sy_, sz_ = 1.45, 0.6, 0.45
        if hands:                                           # slide it toward the right hand until the palm rests on its side
            h = hands['Right']
            c = Vector((cx, cy, cz))
            d = (c - h)
            c = h + d.normalized() * (sz_ * 0.95)
            cx, cy = c.x, c.y
            cz = max(cz - 0.1, c.z)
    else:                                                   # a crate held against the belly
        cx, cy, cz = 1.15, 0.0, 3.45
        sx_, sy_, sz_ = 0.7, 0.62, 0.55
        if hands:                                           # between the palms: its sides where the hands are
            hl, hr = hands['Left'], hands['Right']
            m = (hl + hr) / 2
            sy_ = max(0.35, abs(hl.y - hr.y) / 2 - 0.12)
            cx, cy, cz = m.x - 0.05, m.y, m.z + 0.1
    if kind == 'sack':
        rr = random.Random(4)
        bm = bmesh.new()
        bmesh.ops.create_cube(bm, size=1.0)
        bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=2, use_grid_fill=True)
        for v in bm.verts:
            p = v.co.lerp(v.co.normalized() * 0.5, 0.4) * (1 + rr.uniform(-0.05, 0.05))
            p.y *= 1 - 0.35 * (abs(v.co.x) * 2) ** 4
            p.z *= 1 - 0.35 * (abs(v.co.x) * 2) ** 4 - 0.25 * max(0, v.co.z) * 0     # draped: flatter on top
            v.co = Vector((cx + p.x * sx_ * 2, cy + p.y * sy_ * 2, cz + p.z * sz_ * 2 - 0.35 * (abs(p.x) * 2) ** 2))
        verts = [tuple(v.co) for v in bm.verts]
        faces = [tuple(v.index for v in f.verts) for f in bm.faces]
        bm.free()
        return (verts, faces), SACK
    vs = [(cx + sx * sx_, cy + sy * sy_, cz + sz * sz_) for sz in (-1, 1) for sy in (-1, 1) for sx in (-1, 1)]
    return (vs, [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4), (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)]), CRATE_LT


PEOPLE = []


def walker(name, costume, start, heading, t0, kind, phase, stop=None):
    """a dockworker walking from `start` along `heading`, carrying `kind`, from scene time t0 (until `stop` s, then he stands)"""
    x, y = start
    root, arm = person(name, costume, (x, y, 0.0), heading)
    pose = dict(ZERO_SH, **solve(arm, LOADS[kind])) if kind != 'none' else {}
    TT = [min(max(0.0, tq - t0), stop if stop else 1e9) for tq in TQ]
    a = math.radians(heading)
    for f, tt in enumerate(TT):
        root.location = (x - math.sin(a) * PG['V'] * tt, y + math.cos(a) * PG['V'] * tt, 0.0)
        root.keyframe_insert('location', frame=f)
    for fc in root.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'
    bake(arm, WALK, TT, PG['RATE'], phase=phase)
    if pose:
        hold(arm, pose)
    if kind in ('sack', 'crate'):
        sc.frame_set(0)
        vf, col = load_mesh(kind, hands_raw(arm))
        PG['shell'](f'{name}_load', vf, col, arm, 'Spine2').modifiers.clear()
    if kind == 'truck':                                     # a two-wheeled hand truck with a cotton bale, pushed ahead
        bpy.context.view_layer.update()
        mb = MB()
        fx, fy = -math.sin(a), math.cos(a)                  # forward
        rx, ry = math.cos(a), math.sin(a)
        P = lambda f_, r_, z_: (x + fx * f_ + rx * r_, y + fy * f_ + ry * r_, z_)
        for s in (-0.22, 0.22):
            mb.cyl(P(0.42, s, 0.95), P(1.05, s, 0.25), 0.025, 0.025, '#4a3a2c', n=4)
            mb.cyl(P(1.05, s * 1.35, 0.2), P(1.05, s * 1.6, 0.2), 0.2, 0.2, HOOP, n=10)
        mb.cyl(P(1.05, -0.32, 0.2), P(1.05, 0.32, 0.2), 0.02, 0.02, HOOP, n=4)
        tr = mb.build(f'{name}_truck')
        bl = inst(SRC['bale'], f'{name}_bale', P(1.02, 0, 0.12), a + math.pi / 2, (0.85, 0.75, 0.85), ry=0)
        bl.rotation_euler = (0, 0, 0)
        bl.rotation_mode = 'XYZ'
        bl.matrix_world = Matrix.Translation(P(1.0, 0, 0.18)) @ Matrix.Rotation(a, 4, 'Z') @ Matrix.Rotation(math.radians(-22), 4, 'X') @ Matrix.Rotation(math.pi / 2, 4, 'Z') @ Matrix.Diagonal((0.85, 0.75, 0.85, 1))
        bpy.context.view_layer.update()
        for ob in (tr, bl):
            mw = ob.matrix_world.copy()
            ob.parent = root
            ob.matrix_parent_inverse = root.matrix_world.inverted()
            ob.matrix_world = mw
    PEOPLE.append(root)
    return root, arm


def worker_stand(name, costume, loc, heading, pose_aims, k=0.0, base=None):
    root, arm = person(name, costume, (loc[0], loc[1], loc[2] if len(loc) > 2 else 0.0), heading)
    pose = solve(arm, pose_aims, base) if (pose_aims or base) else {}
    stand(arm, N, pose=dict(ZERO_SH, **pose) if pose else None, k=k)
    return root, arm


# the right lane, along the ship: men carrying sacks up toward the gangway, others coming back for more
walker('dkA', 'dock0', (7.2, -6.0), 0, 0.0, 'sack', 0.0)
walker('dkB', 'dock3', (6.6, -9.5), 0, 0.4, 'sack', 5.0)
walker('dkC', 'dock1', (7.4, 12.5), 180, 0.0, 'none', 9.0)
walker('dkD', 'dock4', (6.3, 2.5), 0, 0.2, 'crate', 13.0)
walker('dkE', 'dock2', (7.6, 20.5), 180, 0.8, 'none', 3.0)
# the left lane, by the warehouse doors
walker('dkF', 'dock5', (-7.0, 12.0), 180, 0.3, 'truck', 7.0)
walker('dkG', 'dock1', (-6.6, 14.5), 0, 0.0, 'sack', 11.0)
walker('dkH', 'dock4', (-6.3, 40.0), 180, 4.0, 'crate', 2.0)
walker('dkK', 'dock5', (6.8, 28.0), 0, 0.3, 'sack', 6.0)
walker('dkL', 'dock0', (7.3, 44.0), 180, 0.0, 'none', 10.0)
walker('dkM', 'dock3', (-7.0, 56.0), 180, 0.0, 'sack', 4.0)
worker_stand('dkN', 'dock2', (8.3, 25.5, 0.0), 250, [('RightArm', (0.3, 0.6, 0.8)), ('RightForeArm', (0.3, 1.0, 0.0))], k=0.2)
walker('dkI', 'dock2', (-7.4, 34.0), 0, 0.5, 'sack', 15.0)
# two standing: a man on the steel stack checking the tally, a clerk with a ledger
worker_stand('dkJ', 'dock3', (-2.6, 12.2, 0.0), 210, [('LeftArm', (0.6, -0.75, -0.3)), ('LeftForeArm', (0.9, 0.3, 0.3))], k=0.5)
worker_stand('clerk', 'clerk', (4.4, -1.0, 0.0), 230, [('LeftArm', (0.4, -0.9, -0.2)), ('LeftForeArm', (0.9, 0.35, 0.35)), ('RightArm', (0.4, -0.9, 0.2)), ('RightForeArm', (0.85, 0.3, -0.45))], k=1.1)
box('ledger', 4.55, -1.45, 1.02, 4.85, -1.2, 1.05, '#3a2a22').rotation_euler[2] = math.radians(40)

# ---- the sun: high, from in front and to the right, so the crate fronts and the warehouse wall take the light
so = bpy.data.objects['sun']
SDIR = Vector((-0.42, 0.62, -0.66)).normalized()            # the direction the light travels
so.rotation_euler = SDIR.to_track_quat('-Z', 'Y').to_euler()
so.data.energy = 4.4
so.data.shadow_cascade_max_distance = 120

# ---- the finishing pass: facets, coursing, bevels, cool shadow fill, grade, haze (look.py)
LK = {'__name__': 'look'}
exec(compile(open(os.path.join(HERE, 'look.py')).read(), os.path.join(HERE, 'look.py'), 'exec'), LK)
LK['finish'](sc, fill_strength=0.7, haze=(60.0, 900.0, 0.42), rules={
    DECK: (0.10, 0.35, None, 1.0), DECK_DK: (0.0, 1.0, None, 1.0), CRATE: (0.10, 1.1, None, 1.0), CRATE_LT: (0.10, 1.1, None, 1.0), CRATE_DK: (0.06, 1.2, None, 1.0),
    WATER: (0.10, 0.04, None, 1.0), WATER_LT: (0.0, 1.0, None, 1.0), HULL: (0.15, 0.3, None, 1.0), WHITE: (0.05, 0.5, 0.5, 0.95), ROOF: (0.10, 0.4, 0.4, 0.86),
    COTTON: (0.06, 1.4, None, 1.0), SACK: (0.08, 1.4, None, 1.0), STEEL: (0.08, 1.0, None, 1.0), HILL: (0.16, 0.012, None, 1.0), LAND: (0.12, 0.03, None, 1.0),
    '#ebdcb4': (0.05, 0.02, None, 1.0), FUNNEL: (0.06, 0.6, None, 1.0)})
w = sc.world.node_tree                                       # the plate's sky: pale blue-grey above, warm cream at the horizon
rmp = [n for n in w.nodes if n.type == 'VALTORGB'][0]
rmp.color_ramp.elements[0].color = lin('#9fb8bc')
rmp.color_ramp.elements[1].color = lin('#e9dfc6')
mixc = [n for n in sc.node_tree.nodes if n.type == 'MIX_RGB'][0]
mixc.inputs[2].default_value = lin('#d9d8c6')               # the haze colour

# ================================================================ cameras: the wide, a cut, then the push along the stacks
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
KEYS = [(0, 27, (1.0, -19.5, 4.3), (0.4, 30.0, 2.9)), (FW - 1, 27, (1.3, -17.0, 4.0), (0.6, 30.0, 2.9)),
        (FW, 26, (-7.2, 12.5, 1.9), (-1.6, 50.0, 3.4)), (N - 1, 26, (-7.2, 19.0, 1.9), (-1.2, 56.0, 3.4))]
for f, lens, pos, look in KEYS:
    cam.location = pos; cam.keyframe_insert('location', frame=f)
    tgt.location = look; tgt.keyframe_insert('location', frame=f)
    cam.data.lens = lens; cam.data.keyframe_insert('lens', frame=f)
for ob in (cam, tgt, cam.data):
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT' if int(kp.co[0]) == FW - 1 else 'BEZIER'
            kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
cam.data.dof.use_dof = True
cam.data.clip_end = 5000
cfc = {fc.array_index: fc for fc in cam.animation_data.action.fcurves if fc.data_path == 'location'}
SUBJ = [(0, FW, Vector((0.5, 10.0, 2.0)), 9.0), (FW, N, Vector((-4.5, 30.0, 2.0)), 5.6)]
for a, b, P, fs in SUBJ:
    for f in list(range(a, b, 6)) + [b - 1]:
        c = Vector([cfc[i].evaluate(f) for i in range(3)])
        cam.data.dof.focus_distance = (P - c).length
        cam.data.dof.aperture_fstop = fs
        cam.data.dof.keyframe_insert('focus_distance', frame=f)
        cam.data.dof.keyframe_insert('aperture_fstop', frame=f)
for fc in cam.data.animation_data.action.fcurves:
    if 'dof' in fc.data_path:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT' if fc.data_path.endswith('fstop') else 'LINEAR'
sc.render.resolution_percentage = SCALE
os.makedirs(OUT, exist_ok=True)

import time
if os.environ.get('DEBUG_PEOPLE'):
    for f in (0, FW, int(os.environ['DEBUG_PEOPLE'])):
        sc.frame_set(f)
        print('PEOPLE', f, [(r.name, tuple(round(v, 1) for v in r.matrix_world.translation)) for r in PEOPLE])
        print('CAM', f, tuple(round(v, 1) for v in cam.matrix_world.translation))
    sys.exit(0)
if MODE in ('wide', 'push'):
    f = int(FW * 0.5) if MODE == 'wide' else FW + int((N - FW) * 0.5)
    FR = [(f, os.path.join(OUT, f'docks_{MODE}.png'))]
else:
    FR = [(int(v), None) for v in os.environ['FRAMES'].split(',')] if os.environ.get('FRAMES') else [(f, None) for f in range(N)]
for f, path in FR:
    sc.frame_set(f)
    sc.render.filepath = path or os.path.join(OUT, f'{f:04d}.png')
    t = time.time()
    bpy.ops.render.render(write_still=True)
    print('FRAME', f, round(time.time() - t, 2), flush=True)
