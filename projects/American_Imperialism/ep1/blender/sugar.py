# Ep 1, chapter 6: "Plantations boomed", a Hawaiian sugar plantation between 1875 and 1890, built in Blender after the
# Flow plates d1_cane_fields and d5_sugar_mill_1880s and the photograph ch06_papaikou_sugar_mill_1880s: cane fields in a
# patchwork running up to green mountains, the mill (stone below, timber above, iron roofs) with its tall brick chimney
# smoking, a wooden flume on trestles bringing cane down from the upper fields, and a narrow-gauge line with a small tank
# engine pulling cane carts in to the cane shed. At a distance, a gang of field workers cutting cane: Chinese, Japanese,
# Portuguese and Native Hawaiian laborers in plain work clothes and hats (faceless kit figures, no caricature).
# Everything that moves steps at 12 fps (smoke, the train, the workers' cane knives, the palms). Shots, keyed to the
# narration (ch06):
#   WIDE  "Plantations boomed"         from above the near field: rows of cane, the road in, the mill, the mountains.
#                                      Join 13: it opens held for half a second with the far edge of the fields against the
#                                      mountains' foot at 60% down the frame (y = 648 of 1080), where the tariff gate's flat
#                                      green horizon strip sits, then drifts
#   MILL  "Many of them were the sons"  closer on the mill: the train of cane carts rolling in past the cane shed, a slow
#                                      creep to "the right to use"; then join 14: the camera rises up the chimney with the
#                                      smoke and into the plume, until the frame is a flat field of bone haze #EDE7DC on
#                                      "called" (the 3D Oʻahu starts from that haze on "Pearl Harbor")
# Clouds and the chimney's smoke are fx.py's painted heaps and plume.
#   xvfb-run -a blender -b --python sugar.py -- <out_dir> [scale%] [mode: wide|mill|anim|fields|rise]
#   fields: the WIDE's first 1.5 s, rise: the last 3 s of MILL; both every $STEP-th frame into <out_dir>/<mode>/
import bpy, bmesh, math, os, sys, random
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/sugar'
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
RND = random.Random(1880)
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


T0 = _wt('ch06_the_heist', 'Plantations boomed') - 0.3
T_MILL = _wt('ch06_the_heist', 'Many of them') - 0.05
T_RISE = _wt('ch06_the_heist', 'the right to use') - 0.1      # join 14: the rise up the smoke starts
T_HAZE = _wt('ch06_the_heist', 'called Pearl Harbor')         # the frame is all haze
T_END = _wt('ch06_the_heist', 'Pearl Harbor') - 0.05          # the 3D Oʻahu takes over
FW, N = int(round((T_MILL - T0) * FPS)), int(round((T_END - T0) * FPS))
F_RISE, F_HAZE = int(round((T_RISE - T0) * FPS)), int(round((T_HAZE - T0) * FPS))
FX = {'sc': sc, 'lin': lin, '__name__': 'fx'}
exec(compile(open(os.path.join(HERE, 'fx.py')).read(), os.path.join(HERE, 'fx.py'), 'exec'), FX)
sc.frame_start, sc.frame_end = 0, N - 1
TQ = [math.floor(f / FPS * 12) / 12 for f in range(N)]            # scene time, stepped at 12 fps
print('SUGAR TIMES', round(T0, 2), round(T_MILL, 2), round(T_END, 2), FW, N)

# ---- palette (from the plates)
CANE, CANE_LT, CANE_DK, STALK = '#56703a', '#768f44', '#3a4d2e', '#7a7a44'
YOUNG, YOUNG2, PASTURE = '#8fae52', '#a3bb5e', '#86a04c'
SOIL, SOIL_DK, ROAD = '#8d5a3c', '#6e4430', '#9a6a48'
MTN, MTN_DK, MTN_LT = '#56724a', '#40593c', '#6d8a55'
STONE, STONE_DK, MORTAR = '#9b968a', '#7d786e', '#b3ad9f'
TIMBER, TIMBER_DK, BATTEN = '#8a7458', '#6b5843', '#5c4b3a'
RUST, IRON_GR, RUST_LT = '#8a5e44', '#7b7770', '#a0785a'
BRICKC, BRICKC_DK = '#8e5a40', '#6e4232'
DOOR = '#2a231d'
RAIL, TIE = '#3a3632', '#5a4636'


# ---- one mesh from many coloured boxes and polygons, so the scene stays light
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


def stone_material(hexname, c1, c2, mortar, bw, rh, ms=0.03):
    """block masonry in world space, mapped on whichever wall the face is on (a brick texture with big irregular blocks)"""
    m = bpy.data.materials.new(hexname)
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
    out = None
    for k, (w_, h_, a_, bias) in enumerate(((bw, rh, None, -0.1), (bw * 1.7, rh * 2, None, 0.4))):
        br = nt.nodes.new('ShaderNodeTexBrick')
        br.offset, br.squash, br.squash_frequency = 0.5 - 0.15 * k, 0.8, 3
        br.inputs['Color1'].default_value = lin(c1) if k == 0 else (1, 1, 1, 1)
        br.inputs['Color2'].default_value = lin(c2) if k == 0 else (0.86, 0.85, 0.83, 1)
        br.inputs['Mortar'].default_value = lin(mortar) if k == 0 else (1, 1, 1, 1)
        br.inputs['Mortar Size'].default_value = ms if k == 0 else 0.0
        br.inputs['Bias'].default_value = bias
        br.inputs['Brick Width'].default_value = w_
        br.inputs['Row Height'].default_value = h_
        nt.links.new(cv.outputs[0], br.inputs['Vector'])
        if out is None:
            out = br.outputs['Color']
        else:
            mm = nt.nodes.new('ShaderNodeMixRGB'); mm.blend_type = 'MULTIPLY'; mm.inputs['Fac'].default_value = 1.0
            nt.links.new(out, mm.inputs['Color1'])
            nt.links.new(br.outputs['Color'], mm.inputs['Color2'])
            out = mm.outputs['Color']
    nt.links.new(out, b.inputs['Base Color'])
    CG['MATS'][hexname] = m
    return m


stone_material(STONE, STONE, STONE_DK, MORTAR, 0.62, 0.36, 0.035)
stone_material(BRICKC, BRICKC, BRICKC_DK, '#7a4a38', 0.5, 0.2, 0.02)

# ================================================================ the ground, the roads, the mountains
GZ = lambda x, y: 0.0                                       # the plain is flat around the mill; it rises gently to the north
terrain('plain', -2400, 2400, -600, 1200, 60, 36, lambda x, y: 0.15 * math.sin(x * 0.05) * math.cos(y * 0.04) - 0.2, PASTURE)


def ridges(x, y):
    h = 0
    for (px, py, ph, pw) in ((-480, 1500, 210, 260), (-120, 1650, 190, 280), (260, 1450, 240, 240), (640, 1600, 200, 260), (-860, 1600, 170, 240),
                             (90, 1180, 80, 170), (-300, 1160, 70, 150)):
        h += ph * math.exp(-math.sqrt((x - px) ** 2 + (y - py) ** 2 * 0.7) / (pw * 0.62))     # peaked, like the plates' volcanic ridges
    rid = 34 * abs(math.sin(x * 0.012 + 0.5 * math.sin(y * 0.01))) + 12 * abs(math.sin(x * 0.031 + y * 0.008))
    foot = min(1.0, max(0.0, (y - 930) / 260)) ** 1.5     # the slopes rise out of the plain
    return (h + rid * min(1.0, h / 80)) * foot - 3


terrain('mountains', -2200, 2200, 900, 2200, 70, 24, ridges, MTN)


def far_range(x, y):
    h = 0
    for (px, py, ph, pw) in ((-900, 3000, 420, 420), (-200, 3200, 380, 380), (500, 2900, 460, 380), (1200, 3100, 400, 420)):
        h += ph * math.exp(-math.sqrt((x - px) ** 2 + (y - py) ** 2) / (pw * 0.7))
    return h + 30 * abs(math.sin(x * 0.006)) - 20


terrain('farrange', -3000, 3000, 2300, 3600, 50, 12, far_range, '#7d958a')
# the yard round the mill, and the roads (red earth)
mb = MB()
mb.poly([(-70, -30, 0.02), (60, -30, 0.02), (60, 40, 0.02), (-70, 40, 0.02)], [(0, 1, 2, 3)], SOIL)
ROADPTS = [(-68, -260), (-67, -140), (-64, -95), (-54, -60), (-38, -36), (-18, -20)]
for i in range(len(ROADPTS) - 1):
    (x0, y0), (x1, y1) = ROADPTS[i], ROADPTS[i + 1]
    d = Vector((x1 - x0, y1 - y0, 0)).normalized()
    nrm = Vector((-d.y, d.x, 0)) * 3.2
    mb.poly([(x0 - nrm.x, y0 - nrm.y, 0.04), (x0 + nrm.x, y0 + nrm.y, 0.04), (x1 + nrm.x, y1 + nrm.y, 0.04), (x1 - nrm.x, y1 - nrm.y, 0.04)], [(0, 1, 2, 3)], ROAD)
for k in range(6):                                          # wheel ruts and darker patches in the yard
    x0, y0 = RND.uniform(-60, 40), RND.uniform(-28, 30)
    a = RND.uniform(0, math.pi)
    d = Vector((math.cos(a), math.sin(a), 0)) * RND.uniform(8, 20)
    n_ = Vector((-d.y, d.x, 0)).normalized() * RND.uniform(1.5, 4)
    mb.poly([(x0 - n_.x, y0 - n_.y, 0.03), (x0 + d.x - n_.x * 0.6, y0 + d.y - n_.y * 0.6, 0.03), (x0 + d.x + n_.x, y0 + d.y + n_.y, 0.03), (x0 + n_.x * 0.7, y0 + n_.y * 0.7, 0.03)], [(0, 1, 2, 3)], SOIL_DK)
mb.build('yard')

# ================================================================ the cane: fields in a patchwork, rows of clumps near the camera, faceted masses far away
CAM_WIDE = Vector((-66.0, -150.0, 8.5))


def clump_geo(mb, x, y, H, rr, cols):
    """one cane stool: a few stalks and a spray of long arching blades near the top"""
    for k in range(3):
        bx, by = x + rr.uniform(-0.18, 0.18), y + rr.uniform(-0.18, 0.18)
        h = H * rr.uniform(0.75, 1.0)
        lean = (rr.uniform(-0.15, 0.15), rr.uniform(-0.15, 0.15))
        mb.poly([(bx - 0.03, by, 0), (bx + 0.03, by, 0), (bx + lean[0] * h + 0.02, by + lean[1] * h, h), (bx + lean[0] * h - 0.02, by + lean[1] * h, h)],
                [(0, 1, 2, 3)], STALK)
        top = Vector((bx + lean[0] * h, by + lean[1] * h, h))
        for j in range(3):                                  # blades: two-segment arching strips
            a = rr.uniform(0, 2 * math.pi)
            L = rr.uniform(0.9, 1.5)
            up = rr.uniform(0.3, 0.9)
            d = Vector((math.cos(a), math.sin(a), 0))
            s = Vector((-d.y, d.x, 0)) * 0.07
            base = top - Vector((0, 0, rr.uniform(0.0, 0.6)))
            mid = base + d * L * 0.5 + Vector((0, 0, up * L * 0.55))
            tip = base + d * L + Vector((0, 0, up * L * 0.25 - 0.35 * L))
            mb.poly([base - s * 0.4, base + s * 0.4, mid + s, mid - s, tip], [(0, 1, 2, 3), (3, 2, 4)], cols[(k + j) % len(cols)])


def field(name, x0, y0, x1, y1, H, cols, rows_along='y', detail=None, seed=0, cut=None):
    """a field of cane between (x0, y0) and (x1, y1), H tall. Near the camera (detail) it is rows of stools over a dark
    core; far away a faceted mass with a jagged top. `cut` = (side, depth): a strip along one edge already cut (stubble)."""
    rr = random.Random(seed)
    d = (Vector(((x0 + x1) / 2, (y0 + y1) / 2, 0)) - CAM_WIDE).length if detail is None else (0 if detail else 999)
    mb = MB()
    if d < 130:
        core = H * 0.6
        mb.box(x0 + 1.3, y0 + 1.3, 0, x1 - 1.3, y1 - 1.3, core, CANE_DK)
        sp, rs = 0.75, 1.5
        if rows_along == 'y':
            nr, nc = int((x1 - x0) / rs), int((y1 - y0) / sp)
            P = lambda i, j: (x0 + (i + 0.5) * rs, y0 + (j + 0.5) * sp)
        else:
            nr, nc = int((y1 - y0) / rs), int((x1 - x0) / sp)
            P = lambda i, j: (x0 + (j + 0.5) * sp, y0 + (i + 0.5) * rs)
        for i in range(nr):
            for j in range(nc):
                x, y = P(i, j)
                inner = min(x - x0, x1 - x, y - y0, y1 - y) > 3.0
                # inside the field only the tops show above the core: keep every other stool there
                if inner and (i + j) % 2:
                    continue
                clump_geo(mb, x, y, H * rr.uniform(0.9, 1.1), rr, cols)
    else:
        # a mass: grid top with jittered heights, sides falling to the ground
        nx, ny = max(2, int((x1 - x0) / 3.0)), max(2, int((y1 - y0) / 3.0))
        verts, faces = [], []
        for j in range(ny + 1):
            for i in range(nx + 1):
                edge = i in (0, nx) or j in (0, ny)
                verts.append((x0 + (x1 - x0) * i / nx, y0 + (y1 - y0) * j / ny, H * (0.85 if edge else rr.uniform(0.85, 1.15))))
        for j in range(ny):
            for i in range(nx):
                a = j * (nx + 1) + i
                faces += [(a, a + 1, a + nx + 2), (a, a + nx + 2, a + nx + 1)] if (i + j) % 2 else [(a, a + 1, a + nx + 1), (a + 1, a + nx + 2, a + nx + 1)]
        mb.poly(verts, faces, cols[rr.randrange(len(cols))])
        mb.box(x0, y0, 0, x1, y1, H * 0.85, cols[0])
    ob = mb.build(name)
    return ob


GREENS = [[CANE, CANE_LT], [CANE_LT, '#6e8c40'], ['#567236', CANE], ['#6b8a3c', '#88a44c']]
NF = 0
# the near fields either side of the road (detailed)
field('f_nearL1', -130, -200, -72, -112, 3.6, [CANE, CANE_LT, '#6e8c40'], 'y', True, 1)
field('f_nearL2', -130, -112, -78, -82, 3.6, [CANE, CANE_LT, '#6e8c40'], 'y', True, 3)
field('f_nearL3', -130, -82, -68, -56, 3.6, [CANE, CANE_LT, '#6e8c40'], 'y', True, 4)
field('f_nearR', -60, -200, -6, -66, 3.4, [CANE, '#6e8c40', CANE_LT], 'y', True, 2)
# the cut strip at the top of the left field: stubble, cut cane in piles, the gang at work
mb = MB()
for k in range(140):                                        # the cut strip along the roadside edge: stubble
    x, y = RND.uniform(-77.6, -72.5), RND.uniform(-111, -83)
    mb.cyl((x, y, 0), (x + RND.uniform(-0.05, 0.05), y, RND.uniform(0.15, 0.4)), 0.03, 0.025, STALK, n=4, caps=False)
for k in range(10):                                         # bundles of cut cane lying in the strip
    x, y = RND.uniform(-76.5, -73.5), -109 + k * 2.6 + RND.uniform(-0.5, 0.5)
    a = math.pi / 2 + RND.uniform(-0.3, 0.3)
    for j in range(7):
        d = Vector((math.cos(a), math.sin(a), 0))
        o = Vector((-d.y, d.x, 0)) * (j % 4 - 1.5) * 0.08
        p = Vector((x, y, 0.05 + 0.07 * (j // 4))) + o
        mb.cyl(p - d * 1.4, p + d * 1.4, 0.035, 0.035, '#8a8a4a' if j % 2 else STALK, n=5)
mb.poly([(-78, -112, 0.03), (-71, -112, 0.03), (-71, -82, 0.03), (-78, -82, 0.03)], [(0, 1, 2, 3)], '#9a8a52')
mb.build('cutstrip')
# the field beyond the cut strip (its far side) and the patchwork beyond, in blocks separated by roads
for gy, y0 in enumerate(range(-50, 520, 58)):
    for gx, x0 in enumerate(range(-460, 470, 74)):
        x1, y1 = x0 + 68, y0 + 52
        if x1 > -78 and x0 < 66 and y0 < 46:                # keep the mill and its yard clear
            continue
        if y1 < -40 and x0 > -160 and x1 < 2:
            continue
        rr = random.Random(gx * 100 + gy)
        kind = rr.random()
        if kind < 0.18:                                     # freshly planted or young: low and light
            H, cols = 0.6 + rr.random() * 0.8, [YOUNG, YOUNG2]
        elif kind < 0.25:                                   # fallow, red earth
            mb = MB()
            mb.poly([(x0, y0, 0.03), (x1, y0, 0.03), (x1, y1, 0.03), (x0, y1, 0.03)], [(0, 1, 2, 3)], SOIL)
            mb.build(f'fallow{gx}_{gy}')
            continue
        else:
            H, cols = 3.0 + rr.random() * 0.9, GREENS[rr.randrange(4)]
        field(f'f{gx}_{gy}', x0, y0, x1, y1, H, cols, 'y' if rr.random() < 0.5 else 'x', None, gx * 37 + gy)
        NF += 1
print('FIELDS', NF)

# ================================================================ the mill (front faces -y, toward the camera)
mb = MB()


def gable_house(x0, y0, x1, y1, wall_h, ridge_h, wall_col, roof_cols, gable_col, ridge_axis='x', over=0.6, monitor=False, seed=0):
    """walls, timber gables, an iron roof in sheets of mixed rust and grey, an optional raised monitor along the ridge"""
    rr = random.Random(seed)
    mb.box(x0, y0, 0, x1, y1, wall_h, wall_col)
    if ridge_axis == 'x':
        ym = (y0 + y1) / 2
        mb.poly([(x0, y0, wall_h), (x0, y1, wall_h), (x0, ym, ridge_h), (x1, y0, wall_h), (x1, y1, wall_h), (x1, ym, ridge_h)], [(0, 1, 2), (3, 5, 4)], gable_col)
        for side in (-1, 1):                                # sheets running down the slope
            ye, yr = (y0 - over, ym) if side < 0 else (y1 + over, ym)
            ze = wall_h - over * (ridge_h - wall_h) / ((y1 - y0) / 2)
            nsh = int((x1 - x0 + 2 * over) / 1.2)
            for k in range(nsh):
                xa = x0 - over + k * (x1 - x0 + 2 * over) / nsh
                xb = xa + (x1 - x0 + 2 * over) / nsh
                c = roof_cols[rr.randrange(len(roof_cols))]
                lift = 0.02 * (k % 2)
                mb.poly([(xa, ye, ze + lift), (xb, ye, ze + lift), (xb, yr, ridge_h + 0.05 + lift), (xa, yr, ridge_h + 0.05 + lift)], [(0, 1, 2, 3) if side < 0 else (0, 3, 2, 1)], c)
        mb.box(x0 - over, ym - 0.15, ridge_h, x1 + over, ym + 0.15, ridge_h + 0.18, '#5a5650')
        if monitor:                                         # the raised ventilator along the ridge, louvred
            mh = 1.4
            mb.box(x0 + 2, ym - 1.4, ridge_h - 0.4, x1 - 2, ym + 1.4, ridge_h + mh, gable_col)
            for k in range(int((x1 - x0 - 4) / 0.5)):
                xx = x0 + 2.2 + k * 0.5
                mb.box(xx, ym - 1.45, ridge_h + 0.1, xx + 0.25, ym + 1.45, ridge_h + mh - 0.2, BATTEN)
            mb.poly([(x0 + 1.5, ym - 2.0, ridge_h + mh - 0.1), (x1 - 1.5, ym - 2.0, ridge_h + mh - 0.1), (x1 - 1.5, ym, ridge_h + mh + 0.7), (x0 + 1.5, ym, ridge_h + mh + 0.7),
                     (x0 + 1.5, ym + 2.0, ridge_h + mh - 0.1), (x1 - 1.5, ym + 2.0, ridge_h + mh - 0.1)], [(0, 1, 2, 3), (3, 2, 5, 4)], roof_cols[0])
    else:
        xm = (x0 + x1) / 2
        mb.poly([(x0, y0, wall_h), (x1, y0, wall_h), (xm, y0, ridge_h), (x0, y1, wall_h), (x1, y1, wall_h), (xm, y1, ridge_h)], [(0, 2, 1), (3, 4, 5)], gable_col)
        for side in (-1, 1):
            xe, xr = (x0 - over, xm) if side < 0 else (x1 + over, xm)
            ze = wall_h - over * (ridge_h - wall_h) / ((x1 - x0) / 2)
            nsh = int((y1 - y0 + 2 * over) / 1.2)
            for k in range(nsh):
                ya = y0 - over + k * (y1 - y0 + 2 * over) / nsh
                yb = ya + (y1 - y0 + 2 * over) / nsh
                c = roof_cols[rr.randrange(len(roof_cols))]
                lift = 0.02 * (k % 2)
                mb.poly([(xe, ya, ze + lift), (xe, yb, ze + lift), (xr, yb, ridge_h + 0.05 + lift), (xr, ya, ridge_h + 0.05 + lift)], [(0, 3, 2, 1) if side < 0 else (0, 1, 2, 3)], c)
        mb.box(xm - 0.15, y0 - over, ridge_h, xm + 0.15, y1 + over, ridge_h + 0.18, '#5a5650')


def battens(x0, x1, y, z0, z1, step=0.55, face=-1):
    """vertical board-and-batten on a timber wall facing -y (face=-1) or +y"""
    for k in range(int((x1 - x0) / step)):
        x = x0 + 0.2 + k * step
        mb.box(x, y + face * 0.06, z0, x + 0.09, y, z1, BATTEN)


ROOFS = [RUST, IRON_GR, RUST_LT, '#6e6a62', RUST]
# the mill house: stone ground storey, timber upper storey, a monitor roof (the big building of the plates)
MX0, MX1, MY0, MY1 = -12.0, 12.0, -6.5, 6.5
mb.box(MX0, MY0, 0, MX1, MY1, 5.2, STONE)
mb.box(MX0 + 0.15, MY0 + 0.15, 5.2, MX1 - 0.15, MY1 - 0.15, 8.6, TIMBER)
battens(MX0 + 0.15, MX1 - 0.15, MY0 + 0.15, 5.3, 8.6)
mb.box(MX0 - 0.1, MY0 - 0.12, 5.1, MX1 + 0.1, MY1 + 0.12, 5.35, '#6b5a46')           # the sill beam between stone and timber
gable_house(MX0 + 0.15, MY0 + 0.15, MX1 - 0.15, MY1 - 0.15, 8.6, 12.4, TIMBER, ROOFS, TIMBER_DK, 'x', 0.8, True, 1)
for k, x in enumerate((-9.5, -6.0, 6.0, 9.5)):             # windows in the stone, shuttered openings above
    mb.box(x - 0.6, MY0 - 0.08, 1.6, x + 0.6, MY0 + 0.05, 3.6, DOOR)
    mb.box(x - 0.75, MY0 - 0.15, 3.6, x + 0.75, MY0 + 0.02, 3.85, STONE_DK)
    mb.box(x - 0.75, MY0 - 0.15, 1.45, x + 0.75, MY0 + 0.02, 1.6, STONE_DK)
    mb.box(x - 0.5, MY0 + 0.0, 6.2, x + 0.5, MY0 + 0.16, 7.6, DOOR)
mb.box(-2.0, MY0 - 0.08, 0, 2.0, MY0 + 0.05, 4.2, DOOR)                            # the big door
mb.box(-2.3, MY0 - 0.18, 4.2, 2.3, MY0 + 0.02, 4.6, STONE_DK)
mb.box(-2.0, MY0 - 0.2, 0.0, -1.85, MY0 + 0.0, 4.2, TIMBER_DK)
mb.box(1.85, MY0 - 0.2, 0.0, 2.0, MY0 + 0.0, 4.2, TIMBER_DK)
mb.box(-3.9, MY0 - 0.25, 0.05, -2.05, MY0 - 0.1, 4.15, TIMBER)                     # a door leaf slid open
for k in range(5):
    mb.box(-3.85 + k * 0.38, MY0 - 0.3, 0.05, -3.77 + k * 0.38, MY0 - 0.24, 4.15, BATTEN)
# quoins at the corners of the stone storey
for z in range(0, 5):
    for (x, s) in ((MX0, 1), (MX1, -1)):
        mb.box(x - 0.08 if s > 0 else x - 0.62, MY0 - 0.08, z + 0.05, x + 0.62 if s > 0 else x + 0.08, MY0 + 0.4, z + 0.5 + 0.0, STONE_DK if z % 2 else '#a9a397')
# the boiling house, lower, to the east
BX0, BX1, BY0, BY1 = 12.0, 32.0, -4.5, 5.5
mb.box(BX0, BY0, 0, BX1, BY1, 4.4, STONE)
gable_house(BX0, BY0, BX1, BY1, 4.4, 7.4, STONE, ROOFS, TIMBER_DK, 'x', 0.6, True, 2)
for k in range(5):
    x = BX0 + 2.0 + k * 4.0
    mb.box(x - 0.55, BY0 - 0.08, 1.2, x + 0.55, BY0 + 0.05, 3.2, DOOR)
    mb.box(x - 0.7, BY0 - 0.15, 3.2, x + 0.7, BY0 + 0.02, 3.45, STONE_DK)
# the cane shed: open sided, a roof on posts, to the west, where the carts are unloaded
SX0, SX1, SY0, SY1 = -30.0, -12.0, -8.0, 6.0
for k in range(7):
    x = SX0 + 0.3 + k * (SX1 - SX0 - 0.6) / 6
    for y in (SY0 + 0.3, SY1 - 0.3):
        mb.box(x - 0.15, y - 0.15, 0, x + 0.15, y + 0.15, 4.6, TIMBER_DK)
    mb.box(x - 0.1, SY0, 4.5, x + 0.1, SY1, 4.7, TIMBER_DK)
mb.box(SX0, SY0, 4.5, SX1, SY0 + 0.3, 4.75, TIMBER_DK)
mb.box(SX0, SY1 - 0.3, 4.5, SX1, SY1, 4.75, TIMBER_DK)
rr_ = random.Random(5)
for side in (-1, 1):
    ym = (SY0 + SY1) / 2
    ye = SY0 - 1.0 if side < 0 else SY1 + 1.0
    nsh = 16
    for k in range(nsh):
        xa = SX0 - 0.8 + k * (SX1 - SX0 + 0.8) / nsh
        xb = xa + (SX1 - SX0 + 0.8) / nsh
        c = ROOFS[rr_.randrange(5)]
        lift = 0.02 * (k % 2)
        mb.poly([(xa, ye, 4.3 + lift), (xb, ye, 4.3 + lift), (xb, ym, 6.9 + lift), (xa, ym, 6.9 + lift)], [(0, 1, 2, 3) if side < 0 else (0, 3, 2, 1)], c)
mb.poly([(SX0, SY0 + 0.3, 4.7), (SX0, SY1 - 0.3, 4.7), (SX0, (SY0 + SY1) / 2, 6.8)], [(0, 1, 2)], TIMBER)
mb.poly([(SX0 - 0.05, SY0, 4.3), (SX0 - 0.05, SY1, 4.3), (SX0 - 0.05, (SY0 + SY1) / 2, 6.9)], [(0, 2, 1)], TIMBER_DK)
# the chimney: square brick on a stone base, tapering, with a corbelled cap
CHX, CHY, CHH = 4.0, 10.5, 27.0
mb.box(CHX - 2.0, CHY - 2.0, 0, CHX + 2.0, CHY + 2.0, 3.0, STONE)
mb.poly([(CHX + sx * 1.6, CHY + sy * 1.6, 3.0) for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1))] + [(CHX + sx * 1.05, CHY + sy * 1.05, CHH) for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1))],
        [(0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)], BRICKC)
mb.box(CHX - 1.3, CHY - 1.3, CHH, CHX + 1.3, CHY + 1.3, CHH + 0.5, BRICKC_DK)
mb.box(CHX - 1.15, CHY - 1.15, CHH + 0.5, CHX + 1.15, CHY + 1.15, CHH + 0.9, BRICKC)
mb.box(CHX - 0.8, CHY - 0.8, CHH + 0.85, CHX + 0.8, CHY + 0.8, CHH + 0.92, '#1e1a17')
# a timber store and the sugar house behind, a water tank on a stand
gable_house(-8, 14, 10, 24, 4.0, 6.8, TIMBER, ROOFS, TIMBER_DK, 'x', 0.5, False, 4)
battens(-8, 10, 14, 0.2, 4.0)
mb.box(-3, 13.9, 0, -1, 14.0, 2.8, DOOR)
mb.box(4, 13.9, 0, 6, 14.0, 2.8, DOOR)
gable_house(34, 6, 48, 16, 3.6, 6.0, TIMBER, ROOFS, TIMBER_DK, 'y', 0.5, False, 5)
battens(34, 48, 6, 0.2, 3.6)
for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
    mb.cyl((-20 + sx * 1.6, 18 + sy * 1.6, 0), (-20 + sx * 1.2, 18 + sy * 1.2, 6.0), 0.12, 0.12, TIMBER_DK, n=5)
mb.cyl((-20, 18, 6.0), (-20, 18, 9.0), 2.2, 2.2, TIMBER, n=14)
for z in (6.6, 7.5, 8.4):
    mb.cyl((-20, 18, z), (-20, 18, z + 0.1), 2.23, 2.23, '#3a3632', n=14)
mb.poly([(-20 + 2.3 * math.cos(a * math.pi / 7), 18 + 2.3 * math.sin(a * math.pi / 7), 9.0) for a in range(14)] + [(-20, 18, 10.2)], [(a, (a + 1) % 14, 14) for a in range(14)], RUST)
# cane piled in the shed and outside, and bagasse
for k in range(40):
    x, y = RND.uniform(SX0 + 1, SX1 - 1), RND.uniform(SY0 + 1.5, SY1 - 1.5)
    a = RND.uniform(-0.25, 0.25)
    d = Vector((math.cos(a), math.sin(a), 0))
    z = 0.06 + RND.uniform(0, 1.2) * (1 - abs(y - (SY0 + SY1) / 2) / 6)
    mb.cyl(Vector((x, y, z)) - d * 1.5, Vector((x, y, z)) + d * 1.5, 0.05, 0.05, '#8a8a4a' if k % 3 else STALK, n=5)
# heaps of cut cane waiting by the line, and a stack of bagasse (crushed cane, dried for the boiler fires)
for (hx, hy, n) in ((-44.0, -15.5, 60), (-36.0, -15.0, 45), (-27.0, 9.5, 50)):
    for k in range(n):
        x, y = hx + RND.uniform(-2.2, 2.2), hy + RND.uniform(-1.2, 1.2)
        a = RND.uniform(-0.2, 0.2)
        d = Vector((math.cos(a), math.sin(a), RND.uniform(-0.04, 0.04)))
        z = 0.06 + RND.uniform(0, 1.0) * (1 - (abs(y - hy) / 1.4) ** 2)
        mb.cyl(Vector((x, y, z)) - d * 1.5, Vector((x, y, z)) + d * 1.5, 0.05, 0.05, ('#8a8a4a', STALK, '#9a9456', '#6e7a3e')[k % 4], n=5)
mb.poly([(34 + 6 * math.cos(a * math.pi / 5), -14 + 4 * math.sin(a * math.pi / 5), 0.02) for a in range(10)] + [(34, -14, 3.2)], [(a, (a + 1) % 10, 10) for a in range(10)], '#b5a36e')
mb.build('mill')
# the gang's camp and the manager's house, small, off to the east among trees
mb = MB()
for k in range(6):
    x = 78 + k * 9
    mb.box(x, 30, 0, x + 6, 35, 2.6, '#e6dfcc')
    mb.poly([(x - 0.3, 29.7, 2.6), (x + 6.3, 29.7, 2.6), (x + 6.3, 35.3, 2.6), (x - 0.3, 35.3, 2.6), (x - 0.3, 32.5, 4.0), (x + 6.3, 32.5, 4.0)],
            [(0, 1, 5, 4), (2, 3, 4, 5), (0, 4, 3), (1, 2, 5)], RUST if k % 2 else IRON_GR)
    mb.box(x + 2.5, 29.95, 0, x + 3.4, 30.0, 1.9, DOOR)
mb.box(-120, 70, 0, -104, 82, 4.0, '#ece6d6')
mb.poly([(-121, 69, 4.0), (-103, 69, 4.0), (-103, 83, 4.0), (-121, 83, 4.0), (-112, 76, 7.0)], [(0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4)], '#6e6a62')
mb.box(-121, 66.5, 0, -103, 70, 0.4, '#d9d2c0')
for k in range(6):
    mb.box(-120.5 + k * 3.3, 66.7, 0.4, -120.2 + k * 3.3, 67.0, 3.6, '#ece6d6')
mb.build('camp')

# ================================================================ the flume: a timber trough on trestles, from the upper fields to the mill
mb = MB()
FL = [Vector((-14.0, 2.0, 5.0)), Vector((-60.0, 30.0, 6.0)), Vector((-150.0, 78.0, 7.5)), Vector((-300.0, 150.0, 9.0))]
for i in range(len(FL) - 1):
    a, b = FL[i], FL[i + 1]
    L = (b - a).length
    n = int(L / 5.0)
    d = (b - a).normalized()
    s = Vector((-d.y, d.x, 0))
    for k in range(n):
        p0, p1 = a + (b - a) * (k / n), a + (b - a) * ((k + 1) / n)
        mb.poly([p0 - s * 0.45 + Vector((0, 0, 0.5)), p0 - s * 0.2, p0 + s * 0.2, p0 + s * 0.45 + Vector((0, 0, 0.5)),
                 p1 - s * 0.45 + Vector((0, 0, 0.5)), p1 - s * 0.2, p1 + s * 0.2, p1 + s * 0.45 + Vector((0, 0, 0.5))],
                [(0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6)], TIMBER)
        q = p0
        for sx in (-1, 1):                                  # a trestle bent: two splayed legs, a cap, a cross brace
            mb.cyl(q + s * sx * 0.3, Vector((q.x, q.y, 0)) + s * sx * 1.3, 0.1, 0.12, TIMBER_DK, n=4)
        mb.box(q.x - 0.15, q.y - 0.15, q.z - 0.2, q.x + 0.15, q.y + 0.15, q.z, TIMBER_DK)
        mb.cyl(Vector((q.x, q.y, q.z * 0.35)) - s * 1.0, Vector((q.x, q.y, q.z * 0.75)) + s * 0.6, 0.05, 0.05, TIMBER_DK, n=4)
mb.build('flume')

# ================================================================ the railway: narrow gauge, from the fields to the cane shed
PATH0 = [(-6.0, -10.5), (-30.0, -10.5), (-52.0, -10.5), (-70.0, -7.0), (-92.0, 2.0), (-120.0, 14.0), (-160.0, 24.0), (-230.0, 32.0), (-320.0, 36.0)]


def catmull(pts, n=10):
    P = [Vector((x, y, 0.0)) for x, y in pts]
    P = [P[0] * 2 - P[1]] + P + [P[-1] * 2 - P[-2]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(n):
            t = k / n
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    out.append(P[-2])
    return out


TRK = catmull(PATH0, 12)
SL = [0.0]
for i in range(1, len(TRK)):
    SL.append(SL[-1] + (TRK[i] - TRK[i - 1]).length)


def at(s):
    """position and direction along the track at arc length s (from the shed end)"""
    s = max(0.0, min(SL[-1] - 0.01, s))
    i = next(k for k in range(1, len(SL)) if SL[k] >= s)
    u = (s - SL[i - 1]) / (SL[i] - SL[i - 1])
    p = TRK[i - 1].lerp(TRK[i], u)
    d = (TRK[i] - TRK[i - 1]).normalized()
    return p, d


mb = MB()
G2 = 0.46                                                   # half the 3 ft gauge
s = 0.0
while s < SL[-1] - 1:
    p, d = at(s)
    nrm = Vector((-d.y, d.x, 0))
    c = [p + nrm * 0.75 - d * 0.12, p + nrm * 0.75 + d * 0.12, p - nrm * 0.75 + d * 0.12, p - nrm * 0.75 - d * 0.12]
    mb.poly([v + Vector((0, 0, 0.05)) for v in c] + [v + Vector((0, 0, 0.14)) for v in c], [(4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)], TIE)
    s += 0.7
for side in (-1, 1):
    for i in range(len(TRK) - 1):
        a, b = TRK[i], TRK[i + 1]
        d = (b - a).normalized()
        nrm = Vector((-d.y, d.x, 0)) * side * G2
        o0, o1 = a + nrm, b + nrm
        w = Vector((-d.y, d.x, 0)) * 0.035
        mb.poly([o0 - w + Vector((0, 0, 0.14)), o1 - w + Vector((0, 0, 0.14)), o1 + w + Vector((0, 0, 0.14)), o0 + w + Vector((0, 0, 0.14)),
                 o0 - w + Vector((0, 0, 0.24)), o1 - w + Vector((0, 0, 0.24)), o1 + w + Vector((0, 0, 0.24)), o0 + w + Vector((0, 0, 0.24))],
                [(4, 5, 6, 7), (0, 1, 5, 4), (2, 3, 7, 6)], RAIL)
for i in range(len(TRK) - 1):
    a, b = TRK[i], TRK[i + 1]
    d = (b - a).normalized()
    nrm = Vector((-d.y, d.x, 0)) * 1.2
    mb.poly([a - nrm + Vector((0, 0, 0.04)), b - nrm + Vector((0, 0, 0.04)), b + nrm + Vector((0, 0, 0.04)), a + nrm + Vector((0, 0, 0.04))], [(0, 1, 2, 3)], '#7d6a55')
mb.build('track')


def cart_src():
    """a cane cart: a flat car on four small wheels, stake sides, heaped with cut cane (it runs along +x)"""
    mb = MB()
    L, W = 4.2, 1.7
    mb.box(-L / 2, -W / 2, 0.55, L / 2, W / 2, 0.72, '#6a5440')
    for sx in (-1, 1):
        for sy in (-1, 1):
            mb.cyl((sx * 1.25, sy * 0.46 - 0.06 * sy, 0.32), (sx * 1.25, sy * 0.46 + 0.06 * sy, 0.32), 0.3, 0.3, '#2e2a26', n=10)
        mb.box(sx * L / 2 - 0.15, -0.3, 0.45, sx * L / 2 + 0.15, 0.3, 0.6, '#4a3a2c')
    for k in range(5):                                      # stakes
        x = -L / 2 + 0.2 + k * (L - 0.4) / 4
        for sy in (-1, 1):
            mb.box(x - 0.06, sy * W / 2 - 0.06, 0.72, x + 0.06, sy * W / 2 + 0.06, 2.1, '#5a4636')
    rr = random.Random(11)
    for k in range(70):                                     # the load: stalks lying lengthwise, heaped in the middle
        y = rr.uniform(-0.75, 0.75)
        z = 0.8 + rr.uniform(0, 1.5) * (1 - (abs(y) / 0.9) ** 2) + 0.2
        x = rr.uniform(-0.3, 0.3)
        a = rr.uniform(-0.08, 0.08)
        d = Vector((math.cos(a), math.sin(a), rr.uniform(-0.05, 0.05)))
        p = Vector((x, y, z))
        mb.cyl(p - d * 2.15, p + d * 2.15, 0.05, 0.05, ('#8a8a4a', STALK, '#9a9456', '#6e7a3e')[k % 4], n=5)
    for k in range(10):                                     # trash leaves on top
        x, y = rr.uniform(-1.8, 1.8), rr.uniform(-0.6, 0.6)
        mb.poly([(x - 0.4, y - 0.1, 2.35), (x + 0.5, y, 2.5), (x - 0.3, y + 0.15, 2.4)], [(0, 1, 2)], '#a3a060')
    ob = mb.build('src_cart')
    ob.hide_render = True
    return ob


def loco_src():
    """a little plantation tank engine (0-4-2), front toward +x"""
    mb = MB()
    BL = '#2c3630'
    mb.box(-3.0, -0.85, 0.5, 2.6, 0.85, 0.8, '#2a2622')                                   # frame
    mb.box(2.6, -0.95, 0.45, 2.75, 0.95, 0.85, '#8a3a2e')                                  # buffer beam
    mb.cyl((-0.9, 0, 1.55), (2.4, 0, 1.55), 0.62, 0.62, BL, n=12)                          # boiler
    mb.cyl((2.4, 0, 1.55), (2.55, 0, 1.55), 0.64, 0.64, '#22201e', n=12)                   # smokebox door
    for sy in (-1, 1):                                                                      # side tanks
        mb.box(-0.6, sy * 0.62 - 0.0 if sy > 0 else -0.98, 0.8, 1.9, 0.98 if sy > 0 else -0.62, 1.8, BL)
        mb.box(-0.6, (0.98 if sy > 0 else -0.98) - 0.02, 1.25, 1.9, (0.98 if sy > 0 else -0.98) + 0.02 * sy, 1.35, '#b08a4a')
    mb.cyl((2.0, 0, 2.1), (2.0, 0, 3.0), 0.16, 0.2, '#22201e', n=8)                         # stack
    mb.cyl((2.0, 0, 3.0), (2.0, 0, 3.4), 0.2, 0.36, '#22201e', n=8)                         # flared top
    mb.cyl((0.8, 0, 2.1), (0.8, 0, 2.55), 0.26, 0.2, '#b08a4a', n=8)                        # dome
    mb.box(-2.9, -0.95, 0.8, -0.9, 0.95, 3.0, BL)                                           # cab
    mb.box(-3.05, -1.05, 3.0, -0.75, 1.05, 3.15, '#3a3632')
    for sy in (-1, 1):
        mb.box(-2.4, sy * 0.95 - 0.02, 2.0, -1.4, sy * 0.95 + 0.02, 2.7, '#1a1816')
    mb.box(2.65, -0.2, 1.95, 2.85, 0.2, 2.3, '#3a3632')                                     # lamp
    for x in (1.4, 0.0):
        for sy in (-1, 1):
            mb.cyl((x, sy * 0.5, 0.48), (x, sy * 0.62, 0.48), 0.45, 0.45, '#2e2a26', n=12)
    for sy in (-1, 1):
        mb.cyl((-2.2, sy * 0.5, 0.32), (-2.2, sy * 0.62, 0.32), 0.3, 0.3, '#2e2a26', n=10)
    ob = mb.build('src_loco')
    ob.hide_render = True
    return ob


CART, LOCO = cart_src(), loco_src()
TRAIN = [inst(LOCO, 'loco', (0, 0, 0))] + [inst(CART, f'cart{k}', (0, 0, 0)) for k in range(7)]
GAP = [0.0, 5.0] + [4.6] * 6                               # spacing along the track to each car
# the train comes in toward the shed (s decreases), easing to a crawl as it reaches the shed
S_START, V_TR = 40.5, 2.6
PARKED = [inst(CART, f'parked{k}', (0, 0, 0)) for k in range(3)]   # empties waiting under the shed roof
for k, ob in enumerate(PARKED):
    p, d = at(3.0 + k * 4.7)
    ob.location = (p.x, p.y, 0.0)
    ob.rotation_euler = (0, 0, math.atan2(d.y, d.x))


def train_s(t):
    return max(18.0, S_START - V_TR * t)


for f in range(N):
    tq = TQ[f]
    s0 = train_s(tq)
    acc = 0.0
    for k, ob in enumerate(TRAIN):
        acc += GAP[k]
        p, d = at(s0 + acc)
        ob.location = (p.x, p.y, 0.0)
        ob.rotation_euler = (0, 0, math.atan2(-d.y, -d.x))   # facing toward the shed
        ob.keyframe_insert('location', frame=f)
        ob.keyframe_insert('rotation_euler', frame=f)
for ob in TRAIN:
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'

# ================================================================ smoke: the chimney's long plume, the engine's puffs (stepped)
PUFFS = []


def smoke(name, base, n, size, rise, drift, col, life=7.0, seed=0, follow=None):
    rr = random.Random(seed)
    for k in range(n):
        p = ico(f'{name}{k}', (0, 0, 0), 1.0, col, 2, (1.4, 1.0, 0.8), seed=seed * 50 + k)
        PUFFS.append((p, Vector(base), k / n, size, rise, Vector(drift), life, rr.uniform(0, 6), follow))


SMOKE_M = FX['soft_mat']('smoke', '#efe9de', '#a29f97', lo=0.15, hi=1.2, feather=0.45, alpha=0.92)
PLUME = FX['Plume']('chim', (CHX, CHY, CHH + 1.0), SMOKE_M, n=34, r0=1.0, r1=8.5, rise=34.0, drift=(34.0, 14.0, 0.0), life=9.0, seed=1)
PLUME.key(range(N), TQ)
smoke('loco', (0, 0, 0), 6, 0.32, 2.6, (-1.5, 3.0, 0.0), '#a9a49a', life=1.8, seed=3, follow=True)
for p_, *_ in PUFFS:                                          # the engine's puffs in the same painted smoke
    p_.data.materials.clear()
    p_.data.materials.append(SMOKE_M)
    for poly in p_.data.polygons:
        poly.use_smooth = True


def loco_stack(t):
    p, d = at(train_s(t))
    return Vector((p.x, p.y, 3.4)) - d * 2.0


for f in range(N):
    tq = TQ[f]
    for p, base, ph, size, rise, drift, life, wob, follow in PUFFS:
        s = (tq / life + ph) % 1.0
        b = loco_stack(tq - s * life) if follow else base
        p.location = b + Vector((0, 0, rise * s ** 0.7)) + drift * s ** 1.4 + Vector((0.3 * size * math.sin(tq * 0.8 + wob), 0, 0))
        k = size * (0.5 + 1.8 * s ** 0.7) * (1 if s < 0.9 else (1 - s) / 0.1)
        p.scale = (k * 1.2, k, k * 0.8)
        p.keyframe_insert('location', frame=f)
        p.keyframe_insert('scale', frame=f)
for p, *_ in PUFFS:
    for fc in p.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'

# ================================================================ trees: palms round the mill and along the road, a few shade trees
for i, (x, y, h, lean) in enumerate(((-36, -16, 14, 0.08), (-40, 12, 12, -0.06), (24, -14, 15, 0.1), (36, -10, 11, -0.05), (52, 0, 13, 0.07),
                                     (-46, -40, 12, -0.1), (60, 24, 14, 0.05), (-6, 30, 12, 0.04), (16, 34, 13, -0.07))):
    CG['palm'](x, y, h, lean, 12, 3.8 if h > 12 else 3.2, 60 + i)
for i, (x, y) in enumerate(((70, 40), (100, 44), (-98, 64), (-130, 60), (130, 36))):
    CG['breadfruit'](x, y, 9.0, 8.0, 80 + i)
for k in range(30):                                         # a windbreak line of trees far off
    x = -400 + k * 28 + RND.uniform(-6, 6)
    ico(f'wb{k}', (x, 470 + RND.uniform(-8, 8), 5), RND.uniform(5, 8), '#3f5533', 1, (1.2, 1.0, 1.1), seed=k)

# clouds: banks over the mountains, cream
CLOUD = '#ece1c6'
CLOUD_M = FX['soft_mat']('cloud', '#f6efdc', '#aab2b0', lo=0.15, hi=1.25, feather=0.6, shadows=False)
for ci, (cx, cyy, cz, cw) in enumerate(((-560, 1700, 400, 280), (-120, 1800, 540, 240), (330, 1650, 450, 320), (820, 1750, 540, 260), (-980, 1800, 580, 260))):
    FX['bank'](f'cl{ci}', (cx, cyy, cz), cw * 2.0, CLOUD_M, seed=ci + 3, n=3, height=cw * 0.42)

# ================================================================ the field workers
C = PG['COSTUMES']
band, ZC_, boater, boater_brim, hat_band = PG['band'], PG['ZC'], PG['boater'], PG['boater_brim'], PG['hat_band']
R0, C0, scaled, capped, disc = PG['R0'], PG['C0'], PG['scaled'], PG['capped'], PG['disc']


def cone_hat():
    """a broad conical straw hat"""
    return capped([scaled(R0, 2.3, C0, -0.12), scaled(R0, 1.05, C0, 0.3), scaled(R0, 0.25, C0, 0.62)])


def straw_crown():
    return capped([R0, scaled(R0, 1.02, C0, 0.3), scaled(R0, 0.85, C0, 0.38)])


def straw_brim():
    return disc(scaled(R0, 0.98, C0), scaled(R0, 2.0, C0, -0.1, 1.9), curl=-0.06)


def felt_hat():
    return capped([R0, scaled(R0, 1.02, C0, 0.32), scaled(R0, 0.8, C0, 0.44)])


def felt_brim():
    return disc(scaled(R0, 0.98, C0), scaled(R0, 1.5, C0, -0.05, 1.42), curl=-0.04)


def head_cloth():
    rb, c = PG['hring'](PG['ZB'] + 0.05, 0.06)
    return capped([rb, scaled(rb, 1.0, c, 0.18), scaled(rb, 0.7, c, 0.3)])


BELT = lambda: band(PG['ZW'], 0.1, off=0.04)
# plain work clothes, after plantation photographs: indigo and blue denim, unbleached cotton, the palaka work shirt
C['field_cn'] = dict(coat='#3c4a63', skin='#c9a27a', hair='#1f1c1a', legs='#2f3a4c', shoes='#2a2622',
                     parts=[('hat', 'Head', cone_hat, '#c9b07a'), ('belt', 'Hips', BELT, '#2a2a30')])
C['field_cn2'] = dict(coat='#4a5a72', skin='#c29a72', hair='#1f1c1a', legs='#3a3f4a', shoes='#2a2622',
                      parts=[('hat', 'Head', cone_hat, '#b99f6a'), ('belt', 'Hips', BELT, '#2a2a30')])
C['field_jp'] = dict(coat='#d6cfbd', skin='#c79e78', hair='#1f1c1a', legs='#2e3442', shoes='#2a2622',
                     parts=[('crown', 'Head', straw_crown, '#cdb98a'), ('brim', 'Head', straw_brim, '#cdb98a'), ('belt', 'Hips', BELT, '#3a4a66')])
C['field_jp2'] = dict(coat='#34405a', skin='#c79e78', hair='#1f1c1a', legs='#d6cfbd', shoes='#2a2622',
                      parts=[('cloth', 'Head', head_cloth, '#e6e0d0'), ('belt', 'Hips', BELT, '#d6cfbd')])
C['field_pt'] = dict(coat='#6f86a0', skin='#d0a884', hair='#3a2e25', legs='#5a4a3a', shoes='#2a2622',
                     parts=[('hat', 'Head', felt_hat, '#4a4136'), ('brim', 'Head', felt_brim, '#4a4136'), ('belt', 'Hips', BELT, '#2a2420')])
C['field_hw'] = dict(coat='#4d6488', skin='#8a6143', hair='#1f1c1a', legs='#c9bea6', shoes='#2a2622',
                     parts=[('crown', 'Head', straw_crown, '#c2a86e'), ('brim', 'Head', lambda: disc(scaled(R0, 0.98, C0), scaled(R0, 1.7, C0, -0.06, 1.62), curl=-0.04), '#c2a86e'),
                            ('band', 'Head', lambda: hat_band(0.03, 0.08), '#3a2e25'), ('belt', 'Hips', BELT, '#2a2420')])


def knife():
    """a cane knife in the right fist: a broad blade jutting forward from the hand (raw body units)"""
    h = PG['bone_head']('RightHand')
    t = PG['bone_tail']('RightHand')
    p = h + (t - h) * 0.5
    vs = [(p.x + 0.1, p.y - 0.06, p.z - 0.05), (p.x + 0.1, p.y + 0.06, p.z - 0.05), (p.x + 1.55, p.y + 0.06, p.z - 0.12), (p.x + 1.6, p.y - 0.06, p.z - 0.0),
          (p.x + 0.1, p.y - 0.06, p.z + 0.18), (p.x + 0.1, p.y + 0.06, p.z + 0.18), (p.x + 1.55, p.y + 0.06, p.z + 0.32), (p.x + 1.6, p.y - 0.06, p.z + 0.36)]
    return vs, [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]


def body_axes(arm):
    """front, up and right of a person, in its armature's space (after stand()'s reset of the hips)"""
    bpy.context.view_layer.update()
    H = arm.pose.bones['Hips'].matrix
    F, U = Vector(H.col[2][:3]).normalized(), Vector(H.col[1][:3]).normalized()
    return F, U, F.cross(U)


def solve(arm, aims, base=None):
    """a pose: `base` bones as given (degrees), then each bone in `aims` turned so it points along a direction given in
    body terms (front, up, right). Returns {bone: (x, y, z) degrees}."""
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
BEND = {'Spine': (26, 0, 0), 'Spine1': (14, 0, 0), 'Neck': (-18, 0, 0)}
# cutting: the knife up and back, then down and across to the base of the stalks; the left hand grips the stalks
CUT_UP = [('RightArm', (0.1, 0.55, 0.85)), ('RightForeArm', (0.5, 0.85, 0.1)), ('LeftArm', (0.7, -0.7, -0.2)), ('LeftForeArm', (0.8, -0.5, 0.2))]
CUT_DN = [('RightArm', (0.75, -0.6, 0.25)), ('RightForeArm', (0.75, -0.6, -0.25)), ('LeftArm', (0.7, -0.7, -0.2)), ('LeftForeArm', (0.8, -0.5, 0.2))]


def work(arm, pa, pb_, period, phase, n):
    """a two-pose work cycle, stepped at 12 fps: up (a third of the cycle), a quick stroke down, a pause, back up"""
    act = bpy.data.actions.new(arm.name + '_work')
    hq = [WALK.fcurves.find('pose.bones["Hips"].rotation_quaternion', index=i).evaluate(WALK.frame_range[0]) for i in range(4)]
    tw = math.hypot(hq[0], hq[2])
    for pb in arm.pose.bones:
        pb.location = (0, 0, 0)
        pb.rotation_quaternion = (hq[0] / tw, 0, hq[2] / tw, 0) if pb.name == 'Hips' else (1, 0, 0, 0)
        pb.rotation_euler = (0, 0, 0)
    bones = sorted(set(pa) | set(pb_))
    fcs = {}
    for bn in bones:
        arm.pose.bones[bn].rotation_mode = 'XYZ'
        for i in range(3):
            fcs[(bn, i)] = act.fcurves.new(f'pose.bones["{bn}"].rotation_euler', index=i)
    for f in range(n):
        tq = TQ[f]
        u = ((tq + phase) / period) % 1.0
        w = 0.0 if u < 0.45 else (min(1.0, (u - 0.45) / 0.12) if u < 0.75 else max(0.0, 1 - (u - 0.75) / 0.25))   # 0 = up, 1 = down
        for bn in bones:
            a, b = pa.get(bn, pb_.get(bn)), pb_.get(bn, pa.get(bn))
            for i in range(3):
                fcs[(bn, i)].keyframe_points.insert(f, math.radians(a[i] + (b[i] - a[i]) * w)).interpolation = 'CONSTANT'
    for b, k_ in PG['SCALE_BONES'].items():
        for i in range(3):
            act.fcurves.new(f'pose.bones["{b}"].scale', index=i).keyframe_points.insert(0, k_).interpolation = 'CONSTANT'
    arm.animation_data.action = act


def cutter(name, costume, x, y, heading, phase, period=1.5):
    root, arm = person(name, costume, (x, y, 0.0), heading)
    pa = dict(ZERO_SH, **solve(arm, CUT_UP, BEND))
    pb_ = dict(ZERO_SH, **solve(arm, CUT_DN, BEND))
    work(arm, pa, pb_, period, phase, N)
    PG['shell'](name + '_knife', knife(), '#9a9a96', arm, 'RightHand').modifiers.clear()
    return root


GANG = [('field_cn', -78.4, -101.5, 8), ('field_jp', -78.6, -98.0, -6), ('field_hw', -78.3, -94.6, 4), ('field_cn2', -78.5, -91.2, 10),
        ('field_pt', -78.4, -87.8, -4), ('field_jp2', -78.6, -84.4, 6)]
for i, (cos, x, y, hd) in enumerate(GANG):                  # facing into the standing cane (west)
    cutter(f'cut{i}', cos, x, y, 90 + hd, i * 0.37, 1.4 + 0.1 * (i % 3))
# two men carrying bundles of cane from the strip toward the road, and a luna (field overseer) standing, a hand on his hip
PEOPLE = []


def bundle():
    """a sheaf of cut cane across the right shoulder, the stalks running front to back (raw body units)"""
    sh = PG['bone_head']('RightArm')
    V_, F_ = [], []
    for k, (dy, dz, r) in enumerate(((0.0, 0.0, 0.3), (-0.22, 0.12, 0.2), (0.18, 0.2, 0.18))):
        v, f = PG['tube']((-3.6, sh.y - 0.25 + dy, sh.z + 0.42 + dz), (3.2, sh.y - 0.25 + dy, sh.z + 0.62 + dz),
                          [(0.0, r * 0.6), (0.08, r), (0.92, r), (1.0, r * 0.7)], n=6, caps=True)
        n0 = len(V_)
        V_ += v
        F_ += [tuple(i + n0 for i in q) for q in f]
    return V_, F_


for i, (cos, (x, y), hd, t0, ph) in enumerate((('field_hw', (-74.0, -101.0), 0, 0.0, 3.0), ('field_jp', (-73.2, -95.0), 180, 0.6, 9.0))):
    root, arm = person(f'carry{i}', cos, (x, y, 0.0), hd)
    pose = dict(ZERO_SH, **solve(arm, [('RightArm', (0.25, 0.25, 1.0)), ('RightForeArm', (0.15, 1.0, -0.55))]))
    TT = [max(0.0, tq - t0) for tq in TQ]
    a = math.radians(hd)
    for f, tt in enumerate(TT):
        root.location = (x - math.sin(a) * PG['V'] * tt, y + math.cos(a) * PG['V'] * tt, 0.0)
        root.keyframe_insert('location', frame=f)
    for fc in root.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'
    bake(arm, WALK, TT, PG['RATE'], phase=ph)
    hold(arm, pose)
    PG['shell'](f'carry{i}_cane', bundle(), '#8a8a4a', arm, 'Spine2').modifiers.clear()
C['luna'] = dict(coat='#e6e0d0', skin='#d9b38f', hair='#5b4330', legs='#4a4540', shoes='#2a2622',
                 parts=[('hat', 'Head', felt_hat, '#8a7a5c'), ('brim', 'Head', felt_brim, '#8a7a5c'), ('belt', 'Hips', BELT, '#3a2e25')])
lr, la = person('luna', 'luna', (-71.0, -88.0, 0.0), 100)
stand(la, N, pose=dict(ZERO_SH, **solve(la, [('LeftArm', (-0.1, -0.7, -0.75)), ('LeftForeArm', (0.6, 0.2, 0.75))])), k=0.6)
# at the mill: men unloading a cart into the shed, one with a bundle walking in
LIFT_UP = [('RightArm', (0.75, 0.35, 0.3)), ('RightForeArm', (0.8, 0.55, -0.2)), ('LeftArm', (0.75, 0.35, -0.3)), ('LeftForeArm', (0.8, 0.55, 0.2))]
LIFT_DN = [('RightArm', (0.6, -0.75, 0.2)), ('RightForeArm', (0.8, -0.3, -0.35)), ('LeftArm', (0.6, -0.75, -0.2)), ('LeftForeArm', (0.8, -0.3, 0.35))]
for i, (cos, (x, y), hd, k) in enumerate((('field_pt', (-24.6, -13.0), 0, 0.2), ('field_cn2', (-20.0, -13.2), 0, 0.9))):
    r_, a_ = person(f'mill{i}', cos, (x, y, 0.0), hd)     # pulling cane down off a cart, stepped
    pa = dict(ZERO_SH, **solve(a_, LIFT_UP, {'Spine': (-4, 0, 0), 'Spine1': (0, 0, 0), 'Neck': (-10, 0, 0)}))
    pb_ = dict(ZERO_SH, **solve(a_, LIFT_DN, {'Spine': (22, 0, 0), 'Spine1': (10, 0, 0), 'Neck': (-10, 0, 0)}))
    work(a_, pa, pb_, 2.2, k, N)
r_, a_ = person('mill2', 'field_hw', (-16.0, -7.0, 0.0), 200)
stand(a_, N, k=1.4)

# sway for palms and trees (stepped at 12 fps)
for f in range(0, N):
    tq = TQ[f]
    for ob, kind, ph, amp in CG['MOVERS']:
        ob.rotation_euler[1] = amp * math.sin(tq * (1.7 if kind == 'frond' else 1.1) + ph)
        ob.keyframe_insert('rotation_euler', frame=f)
for ob, *_ in CG['MOVERS']:
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'

# ---- the sun: late morning, high, from the camera's left, so the mill's front and the cane rows take side light
so = bpy.data.objects['sun']
SDIR = Vector((0.55, 0.5, -0.67)).normalized()
so.rotation_euler = SDIR.to_track_quat('-Z', 'Y').to_euler()
so.data.energy = 4.5
so.data.shadow_cascade_max_distance = 200

# ---- the finishing pass
LK = {'__name__': 'look'}
exec(compile(open(os.path.join(HERE, 'look.py')).read(), os.path.join(HERE, 'look.py'), 'exec'), LK)
LK['finish'](sc, fill_strength=0.72, haze=(120.0, 2600.0, 0.36), rules={
    CANE: (0.14, 0.15, None, 1.0), CANE_LT: (0.14, 0.15, None, 1.0), CANE_DK: (0.12, 0.2, None, 1.0), '#6e8c40': (0.14, 0.15, None, 1.0),
    YOUNG: (0.14, 0.05, None, 1.0), YOUNG2: (0.14, 0.05, None, 1.0), PASTURE: (0.14, 0.03, None, 1.0), SOIL: (0.12, 0.08, None, 1.0), ROAD: (0.1, 0.1, None, 1.0),
    MTN: (0.22, 0.008, None, 1.0), '#7d958a': (0.12, 0.004, None, 1.0), SOIL_DK: (0.1, 0.1, None, 1.0), TIMBER: (0.12, 0.5, None, 1.0), TIMBER_DK: (0.10, 0.5, None, 1.0), RUST: (0.10, 0.6, None, 1.0), IRON_GR: (0.10, 0.6, None, 1.0),
    RUST_LT: (0.10, 0.6, None, 1.0), CLOUD: (0.05, 0.02, None, 1.0), '#c3beb2': (0.05, 0.4, None, 1.0)})
w = sc.world.node_tree
rmp = [n for n in w.nodes if n.type == 'VALTORGB'][0]
rmp.color_ramp.elements[0].color = lin('#97b8c2')
rmp.color_ramp.elements[1].color = lin('#e8dfc4')
mixc = [n for n in sc.node_tree.nodes if n.type == 'MIX_RGB'][0]
mixc.inputs[2].default_value = lin('#cfd4c0')

# ================================================================ cameras: the wide, a cut, then the mill
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
cam.data.clip_end = 6000
# join 13: aim the WIDE's opening so the far edge of the fields (where the plain meets the mountains' foot) is 60% down
HZ = Vector((-34.0, 1000.0, 0.5))
def _ndc_y(pos, look, lens, pt):
    q = (Vector(look) - Vector(pos)).to_track_quat('-Z', 'Y')
    v = q.inverted() @ (pt - Vector(pos))
    return 0.5 + (v.y / -v.z) / (2 * 18.0 * (1080 / 1920) / lens)
lo_, hi_ = -60.0, 80.0
for _ in range(50):                                          # bisect the look-at height for ndc y = 0.4 (from the bottom)
    mid_ = (lo_ + hi_) / 2
    if _ndc_y(CAM_WIDE, (-34.0, 60.0, mid_), 30, HZ) > 0.4:
        lo_ = mid_
    else:
        hi_ = mid_
LOOK_W0 = (-34.0, 60.0, mid_)
print('WIDE opening look-at z', round(mid_, 3), 'horizon ndc', round(_ndc_y(CAM_WIDE, LOOK_W0, 30, HZ), 4))
F_HOLD = int(round(0.5 * FPS))
KEYS = [(0, 30, tuple(CAM_WIDE), LOOK_W0), (F_HOLD, 30, tuple(CAM_WIDE), LOOK_W0),
        (FW - 1, 30, tuple(CAM_WIDE + Vector((0.6, 4.0, -0.3))), (-33.0, 60.0, 9.0)),
        (FW, 26, (-41.0, -35.0, 2.1), (-18.0, -1.0, 8.2)), (F_RISE, 26, (-38.6, -34.0, 2.15), (-15.8, -0.3, 8.3))]
# join 14: up the chimney with the smoke and into the plume (every frame, accelerating from the creep)
RP = [Vector(v) for v in ((-38.6, -34.0, 2.15), (-30.0, -24.0, 8.0), (-12.0, -6.0, 22.0), (4.0, 6.0, 36.0), (13.0, 13.0, 45.0), (20.0, 17.0, 52.0))]
RL = [Vector(v) for v in ((-15.8, -0.3, 8.3), (CHX, CHY, CHH + 2.0), (30.0, 22.0, 60.0))]
def _cr(P, t):
    i = min(int(t), len(P) - 2); t -= i
    p0, p1, p2, p3 = P[max(i - 1, 0)], P[i], P[i + 1], P[min(i + 2, len(P) - 1)]
    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3)
for f in range(F_RISE + 1, N):
    u = min(1.0, (f - F_RISE) / (F_HAZE - F_RISE))
    e = u * u * (2 - u) if u < 1 else 1.0                     # out of the creep, flying fast into the plume
    pos = _cr(RP, e * (len(RP) - 1.001))
    w = u * u * (3 - 2 * u)
    look = RL[0].lerp(RL[1], min(1.0, w / 0.5)).lerp(RL[2], max(0.0, (w - 0.4) / 0.6))
    KEYS.append((f, 26 - 4 * w, tuple(pos), tuple(look)))
for f, lens, pos, look in KEYS:
    cam.location = pos; cam.keyframe_insert('location', frame=f)
    tgt.location = look; tgt.keyframe_insert('location', frame=f)
    cam.data.lens = lens; cam.data.keyframe_insert('lens', frame=f)
for ob in (cam, tgt, cam.data):
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT' if int(kp.co[0]) == FW - 1 else ('LINEAR' if int(kp.co[0]) > F_RISE else 'BEZIER')
            kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
cam.data.dof.use_dof = True
cfc = {fc.array_index: fc for fc in cam.animation_data.action.fcurves if fc.data_path == 'location'}
SUBJ = [(0, FW, Vector((-10.0, 0.0, 6.0)), 16.0), (FW, F_RISE, Vector((-30.0, -10.5, 2.0)), 8.0), (F_RISE, N, Vector((CHX, CHY, CHH)), 11.0)]
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
# the haze: once the camera is in the plume the frame settles on flat bone, the colour the 3D Oʻahu starts from
ct = sc.node_tree
comp = [n for n in ct.nodes if n.type == 'COMPOSITE'][0]
src = comp.inputs['Image'].links[0].from_socket
hz = ct.nodes.new('CompositorNodeMixRGB')
hz.inputs[2].default_value = lin('#EDE7DC')
ct.links.new(src, hz.inputs[1])
ct.links.new(hz.outputs['Image'], comp.inputs['Image'])
for f, v in ((0, 0.0), (F_HAZE - 12, 0.0), (F_HAZE, 1.0)):
    hz.inputs[0].default_value = v
    hz.inputs[0].keyframe_insert('default_value', frame=f)
sc.render.resolution_percentage = SCALE
os.makedirs(OUT, exist_ok=True)

import time
if MODE in ('wide', 'mill'):
    f = int(FW * 0.6) if MODE == 'wide' else FW + int((N - FW) * 0.6)
    FR = [(f, os.path.join(OUT, f'sugar_{MODE}.png'))]
elif MODE in ('fields', 'rise'):
    st_ = int(os.environ.get('STEP', '1'))
    rng = range(0, int(1.5 * FPS), st_) if MODE == 'fields' else range(max(FW, N - 3 * FPS), N, st_)
    FR = [(f, os.path.join(OUT, MODE, f'{f:04d}.png')) for f in rng]
else:
    FR = [(int(v), None) for v in os.environ['FRAMES'].split(',')] if os.environ.get('FRAMES') else [(f, None) for f in range(N)]
for f, path in FR:
    sc.frame_set(f)
    sc.render.filepath = path or os.path.join(OUT, f'{f:04d}.png')
    t = time.time()
    bpy.ops.render.render(write_still=True)
    print('FRAME', f, round(time.time() - t, 2), flush=True)
