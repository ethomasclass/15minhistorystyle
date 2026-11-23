# Ep 1, chapter 6: "his cousin James arrived and started growing pineapples", James Dole's first fields at Wahiawā on
# Oʻahu, about 1900 to 1901, built in Blender after the Flow plate d4_pineapple_fields: long rows of pineapple plants (low
# spiky rosettes, some carrying their fruit) on bare red earth, running away to the plain between the two mountain ranges,
# a farm wagon loaded with fruit standing in a lane, and a few field hands at a distance (faceless kit figures in plain
# work clothes and hats). People step at 12 fps. One shot, keyed to the narration (ch06):
#   ROWS  "his cousin James"   low over the rows, a slow push down a furrow
#   xvfb-run -a blender -b --python pineapple.py -- <out_dir> [scale%] [mode: rows|anim]
import bpy, bmesh, math, os, sys, random
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/pineapple'
SCALE = int(argv[1]) if len(argv) > 1 else 100
MODE = argv[2] if len(argv) > 2 else 'rows'
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
RND = random.Random(1901)
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


T0 = _wt('ch06_the_heist', 'his cousin James') - 0.3
T_END = _wt('ch06_the_heist', 'is where the name') - 0.05
N = int(round((T_END - T0) * FPS))
sc.frame_start, sc.frame_end = 0, N - 1
TQ = [math.floor(f / FPS * 12) / 12 for f in range(N)]            # scene time, stepped at 12 fps
print('PINEAPPLE TIMES', round(T0, 2), round(T_END, 2), N)

# ---- palette (from the plate)
EARTH, EARTH_DK, EARTH_LT = '#8a3a2a', '#6e2a1f', '#9a4a34'
LEAF, LEAF_LT, LEAF_DK = '#7f9a86', '#9db3a0', '#647f6d'
FRUIT, FRUIT_DK, CROWN = '#d6a240', '#b07e2c', '#4f6e48'
MTN, MTN_FAR, GRASS = '#5f7a4c', '#7d957f', '#7a8f4e'
WOOD, WOOD_DK = '#8a6a48', '#5e4632'


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


# ================================================================ the ground: red earth, the plain, the mountains either side
RW = 1.6                                                    # row spacing (m); the camera walks a furrow at x = 0
YMAX = 520.0
terrain('earth', -400, 400, -60, YMAX + 20, 40, 40, lambda x, y: 0.05 * math.sin(x * 0.3) * math.sin(y * 0.17) - 0.02, EARTH)
terrain('plain', -3000, 3000, YMAX + 10, 4000, 50, 30, lambda x, y: -0.3 + 3 * math.sin(x * 0.004) * min(1, (y - YMAX) / 400), GRASS)


def ranges(x, y):
    h = 0
    # the Waiʻanae range on the left, the Koʻolau on the right, the plain between them
    for (px, py, ph, pw) in ((-1500, 2600, 640, 600), (-900, 2300, 420, 420), (-2300, 2800, 520, 600), (-500, 2500, 260, 300),
                             (1300, 2900, 420, 540), (1900, 2700, 480, 520), (800, 2700, 220, 320), (2600, 3000, 380, 520)):
        h += ph * math.exp(-math.sqrt((x - px) ** 2 + (y - py) ** 2 * 0.8) / (pw * 0.6))
    rid = 40 * abs(math.sin(x * 0.006 + 0.6 * math.sin(y * 0.004))) + 18 * abs(math.sin(x * 0.017 + y * 0.003))
    foot = min(1.0, max(0.0, (y - 1700) / 500)) ** 1.5
    return (h + rid * min(1.0, h / 100)) * foot - 2


terrain('mountains', -4000, 4000, 1600, 4200, 64, 24, ranges, MTN)
terrain('farrange', -5000, 5000, 4200, 6000, 60, 8, lambda x, y: (160 + 90 * abs(math.sin(x * 0.004)) + 50 * abs(math.sin(x * 0.011 + 2))) * min(1, (y - 4200) / 600) - 10, MTN_FAR)
# the furrows: dark bands between the rows, running to the horizon
mb = MB()
NR = 34
for i in range(-NR, NR + 1):
    x = i * RW
    mb.poly([(x - 0.28, -40, 0.012), (x + 0.28, -40, 0.012), (x + 0.28, YMAX, 0.012), (x - 0.28, YMAX, 0.012)], [(0, 1, 2, 3)], EARTH_DK)
mb.build('furrows')
# a farm lane between the blocks (the wagon stands in it), at the right
LANE0, LANE1 = 4.1, 8.1

# ================================================================ the plants: rosettes of sword leaves, near ones full, far ones simpler,
# the rows beyond 220 m a single ridge of leaf points
def rosette(mb, x, y, rr, n, L, fruit=False):
    for k in range(n):
        a = 2 * math.pi * k / n + rr.uniform(-0.25, 0.25)
        e = math.radians(rr.uniform(28, 72))                # elevation of the leaf
        ln = L * rr.uniform(0.7, 1.1)
        d = Vector((math.cos(a) * math.cos(e), math.sin(a) * math.cos(e), math.sin(e)))
        side = Vector((-math.sin(a), math.cos(a), 0)) * 0.06
        base = Vector((x, y, 0.08))
        mid = base + d * ln * 0.55
        tip = base + d * ln + Vector((math.cos(a), math.sin(a), 0)) * 0.12 * ln - Vector((0, 0, 0.18 * ln * math.cos(e)))
        col = (LEAF, LEAF_LT, LEAF_DK, LEAF)[(k + int(x * 7)) % 4]
        mb.poly([base - side, base + side, mid + side * 0.8, mid - side * 0.8, tip], [(0, 1, 2, 3), (3, 2, 4)], col)
    if fruit:                                               # the fruit on its short stalk in the heart of the plant, its crown
        h = rr.uniform(0.38, 0.5)
        mb.cyl((x, y, 0.1), (x, y, h), 0.025, 0.025, LEAF_DK, n=4, caps=False)
        bm = bmesh.new()
        bmesh.ops.create_icosphere(bm, subdivisions=2 if y < 40 else 1, radius=1.0)
        vs = [(x + v.co.x * 0.085 * (1 - 0.15 * v.co.z ** 2), y + v.co.y * 0.085 * (1 - 0.15 * v.co.z ** 2), h + 0.14 + v.co.z * 0.15) for v in bm.verts]
        fs = [tuple(v.index for v in f.verts) for f in bm.faces]
        bm.free()
        mb.poly(vs, fs[0::2], FRUIT)
        mb.poly(vs, fs[1::2], FRUIT_DK)
        for k in range(10):                                 # the crown
            a = 2 * math.pi * k / 10 + 0.3 * (k % 2)
            d = Vector((math.cos(a) * (0.55 if k % 2 else 0.3), math.sin(a) * (0.55 if k % 2 else 0.3), 0.9)).normalized()
            b = Vector((x, y, h + 0.27))
            s = Vector((-math.sin(a), math.cos(a), 0)) * 0.022
            mb.poly([b - s, b + s, b + d * (0.17 if k % 2 else 0.22)], [(0, 1, 2)], CROWN)


FRUITS = []
for band_, (y0, y1, n, L, step, dens) in enumerate(((-6, 40, 20, 0.88, 0.6, 1.0), (40, 110, 13, 0.88, 0.66, 1.0), (110, 230, 8, 0.92, 0.8, 1.0))):
    mb = MB()
    rr = random.Random(band_)
    xr = NR if band_ < 2 else NR
    for i in range(-xr, xr + 1):
        xc = i * RW + RW / 2                                # plants sit between the furrows
        if LANE0 < xc < LANE1:
            continue
        y = y0 + rr.uniform(0, step)
        while y < y1:
            fruit = band_ < 2 and rr.random() < (0.06 if band_ == 0 else 0.035)
            rosette(mb, xc + rr.uniform(-0.08, 0.08), y, rr, n, L * rr.uniform(0.85, 1.1), fruit)
            y += step * rr.uniform(0.9, 1.1)
    mb.build(f'plants{band_}')
# far: each row a jagged ridge of leaf points
mb = MB()
for i in range(-NR, NR + 1):
    xc = i * RW + RW / 2
    if LANE0 < xc < LANE1:
        continue
    vs = []
    y = 230.0
    while y < YMAX:
        h = RND.uniform(0.55, 0.85)
        vs += [(xc - 0.55, y, 0.05), (xc, y + 0.4, h), (xc + 0.55, y, 0.05)]
        y += 0.9
    nq = len(vs) // 3
    fs = []
    for k in range(nq - 1):
        a = 3 * k
        fs += [(a, a + 3, a + 4, a + 1), (a + 1, a + 4, a + 5, a + 2)]
    mb.poly(vs, fs, LEAF if i % 2 else LEAF_DK)
mb.build('plants_far')
# the far edge of the field: a windbreak of trees and the green plain beyond
for k in range(50):
    x = -420 + k * 17 + RND.uniform(-5, 5)
    ico(f'wb{k}', (x, YMAX + 30 + RND.uniform(-6, 6), 4), RND.uniform(4, 7), '#425a3a', 1, (1.3, 1.0, 1.0), seed=k)

# ================================================================ the wagon, loaded with fruit, standing in the lane
WX, WY = 6.1, 15.5
mb = MB()


def wheel(cx, cy, cz, r, n=12):
    for k in range(16):                                     # the rim
        a0, a1 = 2 * math.pi * k / 16, 2 * math.pi * (k + 1) / 16
        mb.cyl((cx, cy + r * math.cos(a0), cz + r * math.sin(a0)), (cx, cy + r * math.cos(a1), cz + r * math.sin(a1)), 0.05, 0.05, WOOD_DK, n=4)
    for k in range(n):                                      # spokes
        a = 2 * math.pi * k / n
        mb.cyl((cx, cy, cz), (cx, cy + r * 0.95 * math.cos(a), cz + r * 0.95 * math.sin(a)), 0.022, 0.018, WOOD, n=4)
    mb.cyl((cx - 0.12, cy, cz), (cx + 0.12, cy, cz), 0.1, 0.1, WOOD_DK, n=8)


for sx in (-1, 1):
    wheel(WX + sx * 0.85, WY - 1.3, 0.55, 0.55)
    wheel(WX + sx * 0.85, WY + 1.3, 0.62, 0.62)
mb.cyl((WX - 0.9, WY - 1.3, 0.55), (WX + 0.9, WY - 1.3, 0.55), 0.05, 0.05, WOOD_DK, n=6)
mb.cyl((WX - 0.9, WY + 1.3, 0.62), (WX + 0.9, WY + 1.3, 0.62), 0.05, 0.05, WOOD_DK, n=6)
mb.box(WX - 0.75, WY - 2.0, 0.9, WX + 0.75, WY + 2.0, 1.0, WOOD_DK)                       # bed
for sx in (-1, 1):                                          # sideboards, plank by plank
    for k in range(3):
        mb.box(WX + sx * 0.75 - 0.03, WY - 2.0, 1.0 + k * 0.2, WX + sx * 0.75 + 0.03, WY + 2.0, 1.17 + k * 0.2, WOOD if k % 2 else '#7a5c3e')
for sy in (-1, 1):
    for k in range(3):
        mb.box(WX - 0.75, WY + sy * 2.0 - 0.03, 1.0 + k * 0.2, WX + 0.75, WY + sy * 2.0 + 0.03, 1.17 + k * 0.2, WOOD if k % 2 else '#7a5c3e')
for sx in (-1, 1):
    for sy in (-1.95, -0.6, 0.6, 1.95):
        mb.box(WX + sx * 0.78 - 0.04, WY + sy - 0.04, 0.95, WX + sx * 0.78 + 0.04, WY + sy + 0.04, 1.62, WOOD_DK)
mb.cyl((WX, WY - 2.0, 0.85), (WX - 0.2, WY - 4.6, 0.05), 0.05, 0.04, WOOD, n=6)           # the tongue, resting on the ground
mb.build('wagon')
mb = MB()
rr = random.Random(77)
for k in range(110):                                        # the load: fruit heaped above the boards, crowns up
    x, y = WX + rr.uniform(-0.62, 0.62), WY + rr.uniform(-1.85, 1.85)
    z = 1.05 + rr.uniform(0, 0.5) + 0.35 * (1 - (abs(x - WX) / 0.7) ** 2) * (1 - (abs(y - WY) / 2.0) ** 4)
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1.0)
    tilt = Matrix.Rotation(rr.uniform(-0.6, 0.6), 3, 'X') @ Matrix.Rotation(rr.uniform(-0.6, 0.6), 3, 'Y')
    vs = [tuple(Vector((x, y, z)) + tilt @ Vector((v.co.x * 0.085, v.co.y * 0.085, v.co.z * 0.13))) for v in bm.verts]
    fs = [tuple(v.index for v in f.verts) for f in bm.faces]
    bm.free()
    mb.poly(vs, fs[0::2], FRUIT)
    mb.poly(vs, fs[1::2], FRUIT_DK)
    top = Vector((x, y, z)) + tilt @ Vector((0, 0, 0.12))
    for j in range(5):
        a = 2 * math.pi * j / 5
        d = tilt @ Vector((math.cos(a) * 0.5, math.sin(a) * 0.5, 0.85)).normalized()
        s = tilt @ Vector((-math.sin(a), math.cos(a), 0)) * 0.02
        mb.poly([top - s, top + s, top + d * 0.15], [(0, 1, 2)], CROWN)
mb.build('wagonload')
# baskets of picked fruit by the lane
for k, (bx, by) in enumerate(((LANE0 + 0.3, 18.5), (LANE0 + 0.5, 26.0), (LANE1 - 0.4, 30.0))):
    cyl(f'basket{k}', (bx, by, 0), (bx, by, 0.4), 0.26, 0.32, '#a88a5a', n=10)
    for j in range(5):
        ico(f'bf{k}{j}', (bx + 0.12 * math.cos(j * 1.3), by + 0.12 * math.sin(j * 1.3), 0.45), 0.09, FRUIT, 1, (1, 1, 1.4), seed=k * 10 + j)

# ================================================================ the field hands, at a distance
C = PG['COSTUMES']
band, R0, C0, scaled, capped, disc, hat_band = PG['band'], PG['R0'], PG['C0'], PG['scaled'], PG['capped'], PG['disc'], PG['hat_band']
BELT = lambda: band(PG['ZW'], 0.1, off=0.04)


def straw_crown():
    return capped([R0, scaled(R0, 1.02, C0, 0.3), scaled(R0, 0.85, C0, 0.38)])


def straw_brim():
    return disc(scaled(R0, 0.98, C0), scaled(R0, 2.0, C0, -0.1, 1.9), curl=-0.06)


def cone_hat():
    return capped([scaled(R0, 2.3, C0, -0.12), scaled(R0, 1.05, C0, 0.3), scaled(R0, 0.25, C0, 0.62)])


C['pine_jp'] = dict(coat='#d6cfbd', skin='#c79e78', hair='#1f1c1a', legs='#2e3442', shoes='#2a2622',
                    parts=[('crown', 'Head', straw_crown, '#cdb98a'), ('brim', 'Head', straw_brim, '#cdb98a'), ('belt', 'Hips', BELT, '#3a4a66')])
C['pine_cn'] = dict(coat='#3c4a63', skin='#c9a27a', hair='#1f1c1a', legs='#2f3a4c', shoes='#2a2622',
                    parts=[('hat', 'Head', cone_hat, '#c9b07a'), ('belt', 'Hips', BELT, '#2a2a30')])
C['pine_hw'] = dict(coat='#4d6488', skin='#8a6143', hair='#1f1c1a', legs='#c9bea6', shoes='#2a2622',
                    parts=[('crown', 'Head', straw_crown, '#c2a86e'), ('brim', 'Head', lambda: disc(scaled(R0, 0.98, C0), scaled(R0, 1.7, C0, -0.06, 1.62), curl=-0.04), '#c2a86e'),
                           ('band', 'Head', lambda: hat_band(0.03, 0.08), '#3a2e25'), ('belt', 'Hips', BELT, '#2a2420')])
C['pine_jp2'] = dict(coat='#34405a', skin='#c79e78', hair='#1f1c1a', legs='#d6cfbd', shoes='#2a2622',
                     parts=[('crown', 'Head', straw_crown, '#d3c294'), ('brim', 'Head', straw_brim, '#d3c294'), ('belt', 'Hips', BELT, '#d6cfbd')])


def body_axes(arm):
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
    act = arm.animation_data.action
    for bn, (x, y, z) in pose.items():
        for fc in list(act.fcurves):
            if fc.data_path.startswith(f'pose.bones["{bn}"].rotation'):
                act.fcurves.remove(fc)
        arm.pose.bones[bn].rotation_mode = 'XYZ'
        for i, v in enumerate((x, y, z)):
            act.fcurves.new(f'pose.bones["{bn}"].rotation_euler', index=i).keyframe_points.insert(0, math.radians(v)).interpolation = 'CONSTANT'


def work(arm, pa, pb_, period, phase, n):
    """a two-pose work cycle, stepped at 12 fps"""
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
        u = ((TQ[f] + phase) / period) % 1.0
        w = 0.5 - 0.5 * math.cos(2 * math.pi * u)
        for bn in bones:
            a, b = pa.get(bn, pb_.get(bn)), pb_.get(bn, pa.get(bn))
            for i in range(3):
                fcs[(bn, i)].keyframe_points.insert(f, math.radians(a[i] + (b[i] - a[i]) * w)).interpolation = 'CONSTANT'
    for b, k_ in PG['SCALE_BONES'].items():
        for i in range(3):
            act.fcurves.new(f'pose.bones["{b}"].scale', index=i).keyframe_points.insert(0, k_).interpolation = 'CONSTANT'
    arm.animation_data.action = act


ZERO_SH = {'LeftShoulder': (0, 0, 0), 'RightShoulder': (0, 0, 0)}
PICK_A = [('RightArm', (0.7, -0.7, 0.15)), ('RightForeArm', (0.6, -0.8, -0.1)), ('LeftArm', (0.5, -0.85, -0.15)), ('LeftForeArm', (0.7, -0.4, 0.3))]
PICK_B = [('RightArm', (0.6, -0.75, 0.3)), ('RightForeArm', (0.8, -0.55, 0.1)), ('LeftArm', (0.6, -0.8, -0.1)), ('LeftForeArm', (0.75, -0.5, 0.2))]
BEND_A = {'Spine': (34, 0, 0), 'Spine1': (16, 0, 0), 'Neck': (-16, 0, 0)}
BEND_B = {'Spine': (28, 0, 0), 'Spine1': (12, 0, 0), 'Neck': (-12, 0, 0)}
for i, (cos, x, y, hd, ph) in enumerate((('pine_jp', 2.4, 25.0, 200, 0.0), ('pine_cn', 11.2, 31.0, 160, 0.8), ('pine_hw', -6.4, 44.0, 190, 1.5), ('pine_cn', 13.6, 58.0, 170, 0.4))):
    r_, a_ = person(f'pick{i}', cos, (x, y, 0.0), hd)
    pa = dict(ZERO_SH, **solve(a_, PICK_A, BEND_A))
    pb_ = dict(ZERO_SH, **solve(a_, PICK_B, BEND_B))
    work(a_, pa, pb_, 1.8 + 0.2 * i, ph, N)
# one carrying a basket of fruit on his shoulder down the lane toward the wagon
x, y, hd = LANE0 + 1.3, 30.0, 180
root, arm = person('carry', 'pine_jp2', (x, y, 0.0), hd)
pose = dict(ZERO_SH, **solve(arm, [('RightArm', (0.25, 0.25, 1.0)), ('RightForeArm', (0.15, 1.0, -0.55))]))
TT = list(TQ)
a = math.radians(hd)
for f, tt in enumerate(TT):
    root.location = (x - math.sin(a) * PG['V'] * tt, y + math.cos(a) * PG['V'] * tt, 0.0)
    root.keyframe_insert('location', frame=f)
for fc in root.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = 'CONSTANT'
bake(arm, WALK, TT, PG['RATE'], phase=4.0)
hold(arm, pose)
sh = PG['bone_head']('RightArm')
bvs, bfs = PG['frustum'](sh.z + 0.3, sh.z + 1.0, 0.62, 0.78, n=10, cx=0.0, cy=sh.y - 0.35, sx=1.0, sy=1.0, cap=True)
PG['shell']('carry_basket', (bvs, bfs), '#a88a5a', arm, 'Spine2')
# a man standing by the wagon
r_, a_ = person('wagoner', 'pine_hw', (WX - 1.4, WY - 2.6, 0.0), 120)
stand(a_, N, pose=dict(ZERO_SH, **solve(a_, [('LeftArm', (0.5, -0.8, -0.2)), ('LeftForeArm', (0.8, 0.4, 0.3))])), k=0.4)

# clouds: soft cream banks, the plate's big heap at the right
CLOUD = '#ece1c6'
for ci, (cx, cyy, cz, cw) in enumerate(((-900, 3200, 820, 420), (-200, 3600, 1100, 360), (700, 3000, 700, 520), (1500, 3400, 1000, 380), (300, 3800, 1500, 300))):
    rr = random.Random(ci)
    for k in range(7):
        u = (k - 3) / 3
        r = cw * (0.32 - 0.14 * abs(u)) * rr.uniform(0.85, 1.1)
        ico(f'cl{ci}{k}', (cx + u * cw * 0.85, cyy + rr.uniform(-30, 30), cz + r * 0.25), r, CLOUD, 2, (1.6, 0.6, 0.62), seed=ci * 20 + k)
    box(f'clbase{ci}', cx - cw * 1.05, cyy - 40, cz - 4, cx + cw * 1.05, cyy + 40, cz + cw * 0.05, CLOUD)

# ---- the sun: from the front right, mid-afternoon, so each plant throws its shadow across the furrow
so = bpy.data.objects['sun']
SDIR = Vector((-0.58, 0.42, -0.62)).normalized()
so.rotation_euler = SDIR.to_track_quat('-Z', 'Y').to_euler()
so.data.energy = 4.4
so.data.shadow_cascade_max_distance = 90

# ---- the finishing pass
LK = {'__name__': 'look'}
exec(compile(open(os.path.join(HERE, 'look.py')).read(), os.path.join(HERE, 'look.py'), 'exec'), LK)
LK['finish'](sc, fill_strength=0.72, haze=(140.0, 3600.0, 0.34), rules={
    EARTH: (0.12, 0.12, None, 1.0), EARTH_DK: (0.08, 0.2, None, 1.0), LEAF: (0.05, 1.0, None, 1.0), LEAF_LT: (0.05, 1.0, None, 1.0), LEAF_DK: (0.05, 1.0, None, 1.0),
    MTN: (0.22, 0.004, None, 1.0), MTN_FAR: (0.10, 0.002, None, 1.0), GRASS: (0.12, 0.01, None, 1.0), CLOUD: (0.05, 0.015, None, 1.0), WOOD: (0.1, 1.5, None, 1.0)})
w = sc.world.node_tree
rmp = [n for n in w.nodes if n.type == 'VALTORGB'][0]
rmp.color_ramp.elements[0].color = lin('#b4c3bd')
rmp.color_ramp.elements[1].color = lin('#ebe2c8')
mixc = [n for n in sc.node_tree.nodes if n.type == 'MIX_RGB'][0]
mixc.inputs[2].default_value = lin('#d6d6c2')

# ================================================================ the camera: low in a furrow, pushing slowly down the rows
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
cam.data.clip_end = 9000
cam.data.lens = 26
KEYS = [(0, (0.0, -4.0, 1.25), (0.6, 120.0, 2.6)), (N - 1, (0.0, -1.6, 1.35), (0.6, 122.0, 2.6))]
for f, pos, look in KEYS:
    cam.location = pos; cam.keyframe_insert('location', frame=f)
    tgt.location = look; tgt.keyframe_insert('location', frame=f)
for ob in (cam, tgt):
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'BEZIER'
            kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
cam.data.dof.use_dof = True
cam.data.dof.focus_distance, cam.data.dof.aperture_fstop = 14.0, 5.6
sc.render.resolution_percentage = SCALE
os.makedirs(OUT, exist_ok=True)

import time
if MODE == 'rows':
    FR = [(int(N * 0.5), os.path.join(OUT, 'pineapple_rows.png'))]
else:
    FR = [(int(v), None) for v in os.environ['FRAMES'].split(',')] if os.environ.get('FRAMES') else [(f, None) for f in range(N)]
for f, path in FR:
    sc.frame_set(f)
    sc.render.filepath = path or os.path.join(OUT, f'{f:04d}.png')
    t = time.time()
    bpy.ops.render.render(write_still=True)
    print('FRAME', f, round(time.time() - t, 2), flush=True)
