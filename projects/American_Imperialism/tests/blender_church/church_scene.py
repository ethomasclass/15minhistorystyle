# Blender test: the Hawaiian mission church (copied from the Google Flow plate c7_mission_church) built as a low-poly
# diorama in code. Flat-shaded faces give the poster facets for free; one hard sun gives real shadows; mist fades the
# mountains; palms, trees and people move. People walk with the same gait solver as the 2D rig (planted feet, knees solved),
# stepped at 12 fps; the camera glides at 30.
#   xvfb-run -a blender -b --python church_scene.py -- <out_dir> <first> <last> [engine] [scale%]
import bpy, bmesh, math, os, sys, random
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/church'
F0, F1 = (int(argv[1]), int(argv[2])) if len(argv) > 2 else (0, 0)
ENGINE = argv[3] if len(argv) > 3 else 'BLENDER_EEVEE'
SCALE = int(argv[4]) if len(argv) > 4 else 100
FPS, DUR = 30, 9.0
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', 'Retro_Poster_Test', 'tools'))
random.seed(7)

# ---------------------------------------------------------------- reset
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.fps = FPS
sc.frame_start, sc.frame_end = 0, int(DUR * FPS) - 1


def lin(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4) for v in c) + (1.0,)


MATS = {}


def mat(hexcol, rough=1.0):
    if hexcol in MATS:
        return MATS[hexcol]
    m = bpy.data.materials.new(hexcol)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(hexcol)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Specular IOR Level'].default_value = 0.15
    MATS[hexcol] = m
    return m


def obj_from_bm(name, bm, col, parent=None):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = False
    ob = bpy.data.objects.new(name, me)
    sc.collection.objects.link(ob)
    ob.data.materials.append(mat(col))
    if parent:
        ob.parent = parent
    return ob


def box(name, x0, y0, z0, x1, y1, z1, col, parent=None):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector(((x0 + x1) / 2 + v.co.x * (x1 - x0), (y0 + y1) / 2 + v.co.y * (y1 - y0), (z0 + z1) / 2 + v.co.z * (z1 - z0)))
    return obj_from_bm(name, bm, col, parent)


def prism(name, pts2d, y0, y1, col, axis='y'):
    """an extruded polygon: pts2d in (x, z), extruded along y from y0 to y1 (a gable, a roof)"""
    bm = bmesh.new()
    a = [bm.verts.new((x, y0, z)) for x, z in pts2d]
    b = [bm.verts.new((x, y1, z)) for x, z in pts2d]
    bm.faces.new(a[::-1]); bm.faces.new(b)
    n = len(pts2d)
    for i in range(n):
        bm.faces.new((a[i], a[(i + 1) % n], b[(i + 1) % n], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return obj_from_bm(name, bm, col)


def mesh_from(name, verts, faces, col, parent=None):
    bm = bmesh.new()
    vs = [bm.verts.new(v) for v in verts]
    for f in faces:
        try:
            bm.faces.new([vs[i] for i in f])
        except ValueError:
            pass
    return obj_from_bm(name, bm, col, parent)


def ico(name, loc, r, col, sub=1, sq=(1, 1, 1), parent=None, seed=0):
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=r)
    rr = random.Random(seed)
    for v in bm.verts:
        v.co = Vector((v.co.x * sq[0] * (1 + rr.uniform(-0.12, 0.12)), v.co.y * sq[1] * (1 + rr.uniform(-0.12, 0.12)),
                       v.co.z * sq[2] * (1 + rr.uniform(-0.12, 0.12)))) + Vector(loc)
    return obj_from_bm(name, bm, col, parent)


def cyl(name, p0, p1, r0, r1, col, n=6, parent=None):
    p0, p1 = Vector(p0), Vector(p1)
    d = p1 - p0
    bm = bmesh.new()
    rot = d.to_track_quat('Z', 'Y').to_matrix()
    ring0 = [bm.verts.new(p0 + rot @ Vector((r0 * math.cos(2 * math.pi * k / n), r0 * math.sin(2 * math.pi * k / n), 0))) for k in range(n)]
    ring1 = [bm.verts.new(p1 + rot @ Vector((r1 * math.cos(2 * math.pi * k / n), r1 * math.sin(2 * math.pi * k / n), 0))) for k in range(n)]
    for k in range(n):
        bm.faces.new((ring0[k], ring0[(k + 1) % n], ring1[(k + 1) % n], ring1[k]))
    bm.faces.new(ring0[::-1]); bm.faces.new(ring1)
    return obj_from_bm(name, bm, col, parent)


def empty(name, loc, parent=None):
    e = bpy.data.objects.new(name, None)
    sc.collection.objects.link(e)
    e.location = loc
    if parent:
        e.parent = parent
    return e


# ---------------------------------------------------------------- palette (from the Flow plate)
IVORY, IVORY_LT, TRIM = '#e2dccb', '#efeadc', '#f6f2e8'
ROOF, ROOF_DK = '#c8c2b0', '#aaa493'
GLASS, DOOR, STONE, STEP = '#4a5250', '#5a4130', '#a39a85', '#d8cfba'
LAWN, LAWN2, PATH = '#8a8d4c', '#7b8044', '#c3b495'
MTN, TREE_DK, TRUNK = '#7d8b69', '#3f4b33', '#5e4632'
FROND = ['#4f5936', '#5f6b3a', '#6f7a42']
CANOPY = ['#4a5a33', '#566a3a', '#62743f']
CLOUD = '#ead9ae'

# ---------------------------------------------------------------- ground
def terrain(name, x0, x1, y0, y1, nx, ny, hfun, col):
    verts, faces = [], []
    for j in range(ny + 1):
        for i in range(nx + 1):
            x = x0 + (x1 - x0) * i / nx + random.uniform(-0.3, 0.3) * (x1 - x0) / nx
            y = y0 + (y1 - y0) * j / ny + random.uniform(-0.3, 0.3) * (y1 - y0) / ny
            verts.append((x, y, hfun(x, y)))
    for j in range(ny):
        for i in range(nx):
            a = j * (nx + 1) + i
            if (i + j) % 2:
                faces += [(a, a + 1, a + nx + 2), (a, a + nx + 2, a + nx + 1)]
            else:
                faces += [(a, a + 1, a + nx + 1), (a + 1, a + nx + 2, a + nx + 1)]
    return mesh_from(name, verts, faces, col)


terrain('lawn', -160, 160, -120, 90, 22, 14, lambda x, y: 0.7 * math.sin(x * 0.11) * math.cos(y * 0.13) + 0.35 * math.sin(x * 0.31 + y * 0.23) - 0.4, LAWN)
box('path', -1.8, -120, 0.0, 1.8, -2.2, 0.03, PATH)
box('walk', -160, -6.4, 0.0, 160, -5.6, 0.035, PATH)
for k in range(46):                                    # the dark treeline behind the church
    x = -150 + k * 6.6
    ico(f'tl{k}', (x, 70 + random.uniform(-6, 6), 3), random.uniform(4, 7), TREE_DK, 1, (1.3, 1.0, 0.9), seed=k)


def peaks(x, y):
    h = 0
    for (px, py, ph, pw) in ((-40, 300, 44, 55), (45, 340, 30, 60), (120, 305, 36, 48), (-140, 320, 30, 55), (190, 335, 26, 55), (70, 255, 14, 30)):
        h += ph * math.exp(-((x - px) ** 2 + (y - py) ** 2 * 0.6) / (2 * pw * pw))
    return h + 3 * math.sin(x * 0.07) * math.sin(y * 0.05)


terrain('mountains', -420, 420, 160, 460, 44, 18, peaks, MTN)

# ---------------------------------------------------------------- the church (front faces -y)
W, D, WH = 12.0, 18.0, 6.0                              # nave width, depth, wall height
RIDGE = WH + 4.2
box('foundation', -W / 2 - 0.15, -0.1, 0, W / 2 + 0.15, D + 0.1, 0.55, STONE)
box('nave', -W / 2, 0, 0.55, W / 2, D, WH, IVORY)
prism('nave_gable', [(-W / 2, WH), (W / 2, WH), (0, RIDGE)], 0, D, IVORY)
# the roof: two slopes overhanging the walls, with thickness
OV = 0.45
for sgn in (-1, 1):
    pts = [(0, RIDGE + 0.22), (sgn * (W / 2 + OV), WH - 0.3 + 0.22), (sgn * (W / 2 + OV), WH - 0.3), (0, RIDGE)]
    prism(f'roof{sgn}', pts, -OV, D + OV, ROOF)
# clapboards: thin shadow-casting strips across the front and the right side
for k in range(15):
    z = 0.8 + k * 0.36
    box(f'cbF{k}', -W / 2, -0.04, z, W / 2, 0.0, z + 0.05, IVORY_LT)
    box(f'cbS{k}', W / 2, 0, z, W / 2 + 0.04, D, z + 0.05, IVORY_LT)
# corner boards and the rake (gable edge) trim
for x in (-W / 2 - 0.08, W / 2 - 0.27):
    box(f'corner{x}', x, -0.12, 0.55, x + 0.35, 0.05, WH, TRIM)
box('corner_back', W / 2 - 0.05, D - 0.35, 0.55, W / 2 + 0.12, D + 0.05, WH, TRIM)
for sgn in (-1, 1):
    L = math.hypot(W / 2 + OV, RIDGE - WH + 0.3)
    a = math.atan2(RIDGE - WH + 0.3, W / 2 + OV)
    rk = box(f'rake{sgn}', -L / 2, -0.25, -0.17, L / 2, 0.02, 0.17, TRIM)
    rk.location = (sgn * (W / 2 + OV) / 2, -OV - 0.02, (RIDGE + WH - 0.3) / 2 + 0.05)
    rk.rotation_euler = (0, sgn * a, 0)
    box(f'return{sgn}', sgn * (W / 2 + OV) - (0.0 if sgn > 0 else -0.0) - (1.4 if sgn > 0 else 0), -OV - 0.1, WH - 0.35,
        sgn * (W / 2 + OV) + (0 if sgn > 0 else 1.4), 0.1, WH - 0.05, TRIM)
box('frieze', W / 2, -0.1, WH - 0.55, W / 2 + 0.1, D, WH - 0.05, TRIM)


def window(name, x, y, z0, w, h, face='front'):
    """a tall framed window: frame, dark glass set back, muntins, a sill and a capped lintel"""
    if face == 'front':
        box(name + 'f', x - w / 2 - 0.15, y - 0.12, z0 - 0.1, x + w / 2 + 0.15, y + 0.02, z0 + h + 0.12, TRIM)
        box(name + 'g', x - w / 2, y - 0.14, z0, x + w / 2, y - 0.02, z0 + h, GLASS)
        for k in (1, 2):
            box(name + f'mh{k}', x - w / 2, y - 0.16, z0 + h * k / 3 - 0.025, x + w / 2, y - 0.13, z0 + h * k / 3 + 0.025, TRIM)
        box(name + 'mv', x - 0.025, y - 0.16, z0, x + 0.025, y - 0.13, z0 + h, TRIM)
        box(name + 's', x - w / 2 - 0.28, y - 0.3, z0 - 0.22, x + w / 2 + 0.28, y + 0.02, z0 - 0.08, TRIM)
        box(name + 'c', x - w / 2 - 0.3, y - 0.28, z0 + h + 0.1, x + w / 2 + 0.3, y + 0.02, z0 + h + 0.32, TRIM)
    else:
        box(name + 'f', x - 0.02, y - w / 2 - 0.15, z0 - 0.1, x + 0.12, y + w / 2 + 0.15, z0 + h + 0.12, TRIM)
        box(name + 'g', x + 0.02, y - w / 2, z0, x + 0.14, y + w / 2, z0 + h, GLASS)
        box(name + 's', x - 0.02, y - w / 2 - 0.28, z0 - 0.22, x + 0.3, y + w / 2 + 0.28, z0 - 0.08, TRIM)
        box(name + 'c', x - 0.02, y - w / 2 - 0.3, z0 + h + 0.1, x + 0.28, y + w / 2 + 0.3, z0 + h + 0.32, TRIM)


for i, x in enumerate((-4.6, -3.4, 3.4, 4.6)):
    window(f'wf{i}', x, 0, 1.9, 0.75, 2.6)
for i, y in enumerate((3.5, 7.5, 11.5, 15.5)):
    window(f'ws{i}', W / 2, y, 1.9, 0.9, 2.8, face='side')
# the porch with its gable, door, transom and steps
PW, PD, PH = 5.0, 2.2, 5.6
box('porch', -PW / 2, -PD, 0.55, PW / 2, 0.05, PH, IVORY)
prism('porch_gable', [(-PW / 2, PH), (PW / 2, PH), (0, PH + 2.3)], -PD, 0.05, IVORY)
for sgn in (-1, 1):
    pts = [(0, PH + 2.3 + 0.18), (sgn * (PW / 2 + 0.35), PH - 0.25 + 0.18), (sgn * (PW / 2 + 0.35), PH - 0.25), (0, PH + 2.3)]
    prism(f'proof{sgn}', pts, -PD - 0.35, 0.3, ROOF)
    L = math.hypot(PW / 2 + 0.35, 2.55)
    a = math.atan2(2.55, PW / 2 + 0.35)
    rk = box(f'prake{sgn}', -L / 2, -0.2, -0.13, L / 2, 0.02, 0.13, TRIM)
    rk.location = (sgn * (PW / 2 + 0.35) / 2, -PD - 0.37, PH - 0.25 + 1.3)
    rk.rotation_euler = (0, sgn * a, 0)
for x in (-PW / 2 - 0.06, PW / 2 - 0.24):
    box(f'pcorner{x}', x, -PD - 0.12, 0.55, x + 0.3, -PD + 0.1, PH, TRIM)
box('door_frame', -1.05, -PD - 0.12, 0.55, 1.05, -PD + 0.02, 3.7, TRIM)
box('door', -0.85, -PD - 0.14, 0.55, 0.85, -PD - 0.04, 3.2, DOOR)
for x0 in (-0.75, 0.08):
    for z0 in (0.8, 2.0):
        box(f'panel{x0}{z0}', x0, -PD - 0.17, z0, x0 + 0.67, -PD - 0.13, z0 + 0.95, '#4d3828')
box('transom', -0.85, -PD - 0.14, 3.28, 0.85, -PD - 0.04, 3.6, GLASS)
box('door_cap', -1.25, -PD - 0.32, 3.72, 1.25, -PD + 0.02, 3.95, TRIM)
oc = cyl('oculus', (0, -PD - 0.1, PH + 0.9), (0, -PD - 0.02, PH + 0.9), 0.55, 0.55, TRIM, n=12)
cyl('oculus_g', (0, -PD - 0.13, PH + 0.9), (0, -PD - 0.09, PH + 0.9), 0.38, 0.38, GLASS, n=12)
for k in range(6):
    box(f'step{k}', -2.4 - k * 0.25, -PD - 0.45 - k * 0.42, 0, 2.4 + k * 0.25, -PD - k * 0.42, 0.55 - k * 0.09, STEP)
# the tower, belfry and steeple
TX, TY0, TY1 = 1.75, 0.2, 3.7
box('tower', -TX, TY0, WH, TX, TY1, 12.2, IVORY)
for z in (WH + 0.1, 11.7):
    box(f'tband{z}', -TX - 0.12, TY0 - 0.12, z, TX + 0.12, TY1 + 0.12, z + 0.35, TRIM)
for x in (-TX - 0.06, TX - 0.24):
    box(f'tcorner{x}', x, TY0 - 0.1, WH, x + 0.3, TY0 + 0.1, 12.2, TRIM)
window('tw', 0, TY0, 8.1, 0.7, 2.2)
box('belfry_base', -TX - 0.25, TY0 - 0.25, 12.2, TX + 0.25, TY1 + 0.25, 12.6, TRIM)
BX = 1.3
box('belfry', -BX, TY0 + 0.45, 12.6, BX, TY1 - 0.45, 15.2, IVORY_LT)
for k in range(5):                                     # louvres in the belfry opening
    z = 13.1 + k * 0.38
    box(f'louvre{k}', -0.7, TY0 + 0.32, z, 0.7, TY0 + 0.5, z + 0.12, '#8f8a7a')
box('belfry_open', -0.75, TY0 + 0.4, 13.0, 0.75, TY0 + 0.47, 15.0, '#3c403e')
box('belfry_cap', -BX - 0.25, TY0 + 0.2, 15.2, BX + 0.25, TY1 - 0.2, 15.55, TRIM)
cy = (TY0 + TY1) / 2
mesh_from('steeple', [(-1.25, cy - 1.25, 15.55), (1.25, cy - 1.25, 15.55), (1.25, cy + 1.25, 15.55), (-1.25, cy + 1.25, 15.55), (0, cy, 22.5)],
          [(0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4), (3, 2, 1, 0)], IVORY_LT)
cyl('finial', (0, cy, 22.5), (0, cy, 23.6), 0.06, 0.04, '#6a6458', n=6)
ico('finial_ball', (0, cy, 22.65), 0.16, '#6a6458', 1)

# ---------------------------------------------------------------- trees and palms (they move)
MOVERS = []                                             # (object, kind, phase, amplitude)


def breadfruit(x, y, h, w, seed):
    root = empty(f'tree{seed}', (x, y, 0))
    cyl(f'trunk{seed}', (0, 0, 0), (0.3, 0.2, h * 0.55), 0.35, 0.22, TRUNK, parent=root)
    crown = empty(f'crown{seed}', (0, 0, h * 0.5), root)
    rr = random.Random(seed)
    for k in range(9):
        ico(f'c{seed}{k}', (rr.uniform(-0.45, 0.45) * w, rr.uniform(-0.35, 0.35) * w, rr.uniform(0.0, 0.5) * h), rr.uniform(0.25, 0.36) * w,
            CANOPY[k % 3], 1, parent=crown, seed=seed * 10 + k)
    MOVERS.append((crown, 'tree', rr.uniform(0, 6), 0.035))


def palm(x, y, h, lean, n, L, seed):
    rr = random.Random(seed)
    root = empty(f'palm{seed}', (x, y, 0))
    pts = []
    for i in range(9):
        s = i / 8
        pts.append(Vector((lean * h * s * s, 0.2 * lean * h * s * s, h * s)))
    for i in range(8):
        cyl(f'pt{seed}{i}', pts[i], pts[i + 1], 0.32 * (1 - 0.4 * i / 8), 0.32 * (1 - 0.4 * (i + 1) / 8), TRUNK, n=6, parent=root)
    crown = empty(f'pc{seed}', pts[-1], root)
    MOVERS.append((root, 'palm', rr.uniform(0, 6), 0.012))
    for k in range(n):
        ang = 2 * math.pi * k / n + rr.uniform(-0.2, 0.2)
        up = rr.uniform(-0.15, 0.45)
        fe = empty(f'f{seed}{k}', (0, 0, 0), crown)
        fe.rotation_euler = (0, 0, ang)
        verts, faces = [], []
        seg = 8
        for i in range(seg + 1):
            s = i / seg
            px = L * s
            pz = L * (up * s - 0.55 * s * s)
            wdt = 0.55 * math.sin(math.pi * min(1, s * 1.1)) + 0.05
            verts += [(px, -wdt, pz - 0.12 * wdt), (px, 0, pz + 0.12), (px, wdt, pz - 0.12 * wdt)]
        for i in range(seg):
            a = i * 3
            faces += [(a, a + 3, a + 4, a + 1), (a + 1, a + 4, a + 5, a + 2)]
        fr = mesh_from(f'fr{seed}{k}', verts, faces, FROND[k % 3], parent=fe)
        MOVERS.append((fe, 'frond', rr.uniform(0, 6), 0.09))


breadfruit(-12.5, 3.5, 8.5, 7.5, 1)
breadfruit(13.5, 4.5, 8.5, 7.5, 2)
palm(-17, -14, 16, 0.12, 11, 4.8, 3)
palm(-21, 6, 10, -0.05, 12, 3.2, 4)
palm(20, 6, 11, 0.06, 12, 3.4, 5)
palm(18, -12, 17, -0.14, 11, 5.0, 6)

# ---------------------------------------------------------------- clouds (low-poly, lit by the sun)
for ci, (cx, cyy, cz, cw) in enumerate(((-120, 430, 118, 90), (110, 430, 100, 80), (20, 400, 140, 50))):
    for k in range(9):
        ico(f'cl{ci}{k}', (cx + random.uniform(-0.5, 0.5) * cw, cyy + random.uniform(-8, 8), cz + random.uniform(-4, 6)),
            random.uniform(0.18, 0.3) * cw, CLOUD, 1, (1.4, 0.8, 0.75), seed=ci * 20 + k)

# ---------------------------------------------------------------- people (low-poly, the 2D rig's gait)

U = 0.2125                                              # head unit: 8 units = 1.7 m
A_ST, DUTY, PERIOD, LIFT = 1.15, 0.6, 0.9, 0.42


def ik(dx, dy):
    l1, l2 = 1.9, 1.95
    d = min(math.hypot(dx, dy), l1 + l2 - 1e-3)
    al = math.atan2(dx, dy)
    th = al + math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))
    kn = math.pi - math.acos((l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2))
    return th, kn


def gait(ph):
    hip = 3.7 - 0.07 * math.cos(4 * math.pi * ph)
    P = {'hip': hip}
    for k, off in (('a', 0.0), ('b', 0.5)):
        p = (ph + off) % 1
        if p < DUTY:
            fx, fy = A_ST * (1 - 2 * p / DUTY), hip
        else:
            s = (p - DUTY) / (1 - DUTY)
            e = s * s * (3 - 2 * s)
            fx, fy = -A_ST + 2 * A_ST * e, hip - LIFT * math.sin(math.pi * s)
        P['th_' + k], P['kn_' + k] = ik(fx, fy)
    c = math.cos(2 * math.pi * ph)
    P['arm_a'], P['arm_b'] = -0.42 * c, 0.42 * c
    return P


def figure(name, coat, legs, skin, hat=None, dress=False, hatcol='#2f2c28', hair='#2a2622'):
    root = empty(name, (0, 0, 0))
    hipE = empty(name + '_hip', (0, 0, 3.7 * U), root)
    parts = {'root': root, 'hip': hipE}
    for k, sx in (('a', -0.17), ('b', 0.17)):
        th = empty(f'{name}_th{k}', (sx, 0, 0), hipE)
        cyl(f'{name}_thm{k}', (0, 0, 0), (0, 0, -1.9 * U), 0.11, 0.085, legs, parent=th)
        kn = empty(f'{name}_kn{k}', (0, 0, -1.9 * U), th)
        cyl(f'{name}_shm{k}', (0, 0, 0), (0, 0, -1.85 * U), 0.08, 0.06, legs, parent=kn)
        box(f'{name}_ft{k}', -0.06, -0.06, -1.95 * U - 0.05, 0.06, 0.2, -1.95 * U + 0.03, '#2a2622', parent=kn)
        parts['th' + k], parts['kn' + k] = th, kn
    torso = mesh_from(name + '_torso', [(-0.2, -0.12, 0), (0.2, -0.12, 0), (0.2, 0.12, 0), (-0.2, 0.12, 0),
                                        (-0.24, -0.13, 2.4 * U), (0.24, -0.13, 2.4 * U), (0.24, 0.13, 2.4 * U), (-0.24, 0.13, 2.4 * U)],
                      [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)], coat, parent=hipE)
    if dress:
        mesh_from(name + '_skirt', [(0, 0, 0.1)] + [(0.5 * math.cos(2 * math.pi * k / 8), 0.42 * math.sin(2 * math.pi * k / 8), -3.4 * U) for k in range(8)]
                  + [(0.2 * math.cos(2 * math.pi * k / 8), 0.14 * math.sin(2 * math.pi * k / 8), 0.1) for k in range(8)],
                  [(9 + k, 9 + (k + 1) % 8, 1 + (k + 1) % 8, 1 + k) for k in range(8)], coat, parent=hipE)
    else:
        mesh_from(name + '_coattail', [(-0.22, -0.13, 0.05), (0.22, -0.13, 0.05), (0.26, 0.14, 0.05), (-0.26, 0.14, 0.05),
                                       (-0.27, -0.12, -1.0 * U), (0.27, -0.12, -1.0 * U), (0.3, 0.16, -1.0 * U), (-0.3, 0.16, -1.0 * U)],
                  [(0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)], coat, parent=hipE)
    head = ico(name + '_head', (0, 0.01, 2.4 * U + 0.42 * U + 0.22), 0.13, skin, 1, (0.95, 1.0, 1.15), parent=hipE)
    ico(name + '_hair', (0, 0.045, 2.4 * U + 0.42 * U + 0.27), 0.125, hair, 1, (1.0, 0.95, 0.9), parent=hipE)
    cyl(name + '_neck', (0, 0, 2.4 * U), (0, 0, 2.4 * U + 0.15), 0.05, 0.05, skin, parent=hipE)
    if hat == 'top':
        cyl(name + '_hat', (0, 0.02, 2.4 * U + 0.6), (0, 0.02, 2.4 * U + 0.85), 0.11, 0.115, hatcol, n=8, parent=hipE)
        cyl(name + '_brim', (0, 0.02, 2.4 * U + 0.6), (0, 0.02, 2.4 * U + 0.62), 0.19, 0.19, hatcol, n=10, parent=hipE)
    if hat == 'bonnet':
        ico(name + '_bon', (0, 0.06, 2.4 * U + 0.42 * U + 0.27), 0.16, hatcol, 1, (1.0, 1.1, 1.0), parent=hipE)
    for k, sx in (('a', -0.28), ('b', 0.28)):
        sh = empty(f'{name}_sh{k}', (sx, 0, 2.3 * U), hipE)
        cyl(f'{name}_arm{k}', (0, 0, 0), (0, 0, -1.4 * U), 0.075, 0.06, coat, parent=sh)
        el = empty(f'{name}_el{k}', (0, 0, -1.4 * U), sh)
        cyl(f'{name}_fa{k}', (0, 0, 0), (0, 0, -1.25 * U), 0.06, 0.05, coat, parent=el)
        ico(f'{name}_hand{k}', (0, 0, -1.3 * U), 0.05, skin, 1, parent=el)
        parts['sh' + k], parts['el' + k] = sh, el
    return parts


WALKERS = [  # name, look, start (x, y), heading (deg, 0 = walking +y, toward the church), start time, walk time
    ('w1', dict(coat='#e8e0cc', legs='#e8e0cc', skin='#8f6a4c', hat='bonnet', hatcol='#f1ead8', dress=True), (-1.0, -24), 0, 0.0, 9.0),
    ('w2', dict(coat='#2f2c28', legs='#2b2a28', skin='#8f6a4c'), (0.9, -26.5), 0, 0.2, 9.0),
    ('w3', dict(coat='#d98b8c', legs='#d98b8c', skin='#c79b78', dress=True), (-13, -8.0), -90, 0.0, 9.0),
    ('w4', dict(coat='#3c4a3d', legs='#2f2c28', skin='#d9b38f', hat='top', hatcol='#2b2824'), (-15.5, -6.6), -90, 0.6, 9.0),
    ('w5', dict(coat='#f1ead8', legs='#f1ead8', skin='#d9b38f', hat='bonnet', hatcol='#e3d9c2', dress=True), (13, -7.4), 90, 0.3, 9.0),
    ('w6', dict(coat='#4f5d6a', legs='#3a3a34', skin='#8f6a4c'), (15.5, -6.2), 90, 0.9, 9.0)]
FIGS = [(figure(n, **look), (x, y), hd, t0, tw) for n, look, (x, y), hd, t0, tw in WALKERS] if os.environ.get('CHURCH_PEOPLE', '1') == '1' else []
V = 2 * A_ST * U / (DUTY * PERIOD)                      # m/s: the planted foot's speed, so no sliding

# ---------------------------------------------------------------- animation: keyframes per frame, stepped at 12 fps
def key(ob, path, frame):
    ob.keyframe_insert(data_path=path, frame=frame)


for f in range(sc.frame_start, sc.frame_end + 1):
    t = f / FPS
    tq = math.floor(t * 12) / 12
    for ob, kind, ph, amp in MOVERS:
        if kind == 'frond':
            ob.rotation_euler[1] = amp * math.sin(tq * 1.7 + ph) + 0.04 * math.sin(tq * 0.4 + ph)
            key(ob, 'rotation_euler', f)
        elif kind == 'palm':
            ob.rotation_euler[1] = amp * math.sin(tq * 1.1 + ph)
            key(ob, 'rotation_euler', f)
        else:
            ob.rotation_euler[1] = amp * math.sin(tq * 1.2 + ph)
            ob.rotation_euler[0] = amp * 0.6 * math.sin(tq * 0.9 + ph)
            key(ob, 'rotation_euler', f)
    for parts, (x0, y0), hd, t0, tw in FIGS:
        tt = min(max(tq - t0, 0), tw)
        a = math.radians(hd)
        d = V * tt
        root = parts['root']
        root.location = (x0 - math.sin(a) * d, y0 + math.cos(a) * d, 0)
        root.rotation_euler = (0, 0, a)
        P = gait((tt / PERIOD) % 1)
        parts['hip'].location = (0, 0, P['hip'] * U)
        for k in 'ab':
            parts['th' + k].rotation_euler = (P['th_' + k], 0, 0)
            parts['kn' + k].rotation_euler = (-P['kn_' + k], 0, 0)
            parts['sh' + k].rotation_euler = (P['arm_' + k], 0, 0)
            parts['el' + k].rotation_euler = (0.35, 0, 0)
        for ob in (root, parts['hip']) + tuple(parts[k] for k in parts if k[:2] in ('th', 'kn', 'sh', 'el')):
            if ob is root or ob is parts['hip']:
                key(ob, 'location', f)
            key(ob, 'rotation_euler', f)
for ob in bpy.data.objects:
    if ob.animation_data and ob.animation_data.action:
        for fc in ob.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = 'CONSTANT'

# ---------------------------------------------------------------- light, sky, camera
sun = bpy.data.lights.new('sun', 'SUN')
sun.energy = 4.6
sun.angle = math.radians(0.6)
sun.color = (1.0, 0.95, 0.86)
so = bpy.data.objects.new('sun', sun)
sc.collection.objects.link(so)
so.rotation_euler = (math.radians(52), math.radians(-28), math.radians(-36))   # from the front left, high

world = bpy.data.worlds.new('sky')
sc.world = world
world.use_nodes = True
nt = world.node_tree
bg = nt.nodes['Background']
tc = nt.nodes.new('ShaderNodeTexCoord')
sep = nt.nodes.new('ShaderNodeSeparateXYZ')
ramp = nt.nodes.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].position = 0.0
ramp.color_ramp.elements[0].color = lin('#a9bdb5')
ramp.color_ramp.elements[1].position = 0.75
ramp.color_ramp.elements[1].color = lin('#e6dabd')
nt.links.new(tc.outputs['Window'], sep.inputs[0])
inv = nt.nodes.new('ShaderNodeMath'); inv.operation = 'SUBTRACT'; inv.inputs[0].default_value = 1.0
nt.links.new(sep.outputs['Y'], inv.inputs[1])
nt.links.new(inv.outputs[0], ramp.inputs['Fac'])
nt.links.new(ramp.outputs['Color'], bg.inputs['Color'])
bg.inputs['Strength'].default_value = 1.0
# the sky looks bright to the camera but lights the scene more dimly, so shadows stay deep
lp = nt.nodes.new('ShaderNodeLightPath'); amb = nt.nodes.new('ShaderNodeBackground'); amb.inputs['Strength'].default_value = 0.55
mixw = nt.nodes.new('ShaderNodeMixShader'); out = nt.nodes['World Output']
nt.links.new(ramp.outputs['Color'], amb.inputs['Color'])
nt.links.new(lp.outputs['Is Camera Ray'], mixw.inputs['Fac'])
nt.links.new(amb.outputs[0], mixw.inputs[1]); nt.links.new(bg.outputs[0], mixw.inputs[2])
nt.links.new(mixw.outputs[0], out.inputs['Surface'])
world.mist_settings.start, world.mist_settings.depth = 90, 700

cam_d = bpy.data.cameras.new('cam')
cam_d.lens = 45
cam = bpy.data.objects.new('cam', cam_d)
sc.collection.objects.link(cam)
sc.camera = cam
tgt = empty('target', (0, 0, 7.0))
tr = cam.constraints.new('TRACK_TO')
tr.target, tr.track_axis, tr.up_axis = tgt, 'TRACK_NEGATIVE_Z', 'UP_Y'
for f, (pos, look) in ((0, ((9, -60, 3.4), (0.5, 0, 10.0))), (int(DUR * FPS) - 1, ((6, -45, 4.6), (0.5, 0, 10.6)))):
    cam.location = pos
    key(cam, 'location', f)
    tgt.location = look
    key(tgt, 'location', f)
for ob in (cam, tgt):
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'SINE'

# ---------------------------------------------------------------- render settings and the mist composite
sc.render.engine = ENGINE
sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
sc.render.resolution_percentage = SCALE
sc.view_settings.view_transform = 'Standard'
sc.view_settings.look = 'None'
vl = sc.view_layers[0]
vl.use_pass_mist = True
if ENGINE == 'BLENDER_EEVEE':
    ee = sc.eevee
    ee.taa_render_samples = 16
    ee.use_gtao = True
    ee.gtao_distance = 3.0
    ee.gtao_factor = 1.4
    ee.use_soft_shadows = False
    ee.shadow_cascade_size = '4096'
    ee.shadow_cube_size = '2048'
    sun.shadow_cascade_max_distance = 140
    sun.shadow_cascade_count = 4
else:
    sc.cycles.samples = 24
    sc.cycles.use_denoising = False
    sc.cycles.device = 'CPU'
sc.use_nodes = True
ct = sc.node_tree
for n in list(ct.nodes):
    ct.nodes.remove(n)
rl = ct.nodes.new('CompositorNodeRLayers')
mix = ct.nodes.new('CompositorNodeMixRGB')
mix.inputs[2].default_value = lin('#d7d6c2')
mcurve = ct.nodes.new('CompositorNodeMath')
mcurve.operation, mcurve.inputs[1].default_value = 'MULTIPLY', 0.38
comp = ct.nodes.new('CompositorNodeComposite')
ct.links.new(rl.outputs['Mist'], mcurve.inputs[0])
ct.links.new(mcurve.outputs[0], mix.inputs['Fac'])
ct.links.new(rl.outputs['Image'], mix.inputs[1])
ct.links.new(mix.outputs[0], comp.inputs['Image'])

if not os.environ.get('CHURCH_NORENDER'):
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'church_scene.blend'))
    os.makedirs(OUT, exist_ok=True)
    import time
    for f in range(F0, F1 + 1):
        sc.frame_set(f)
        sc.render.filepath = os.path.join(OUT, f'{f:04d}.png')
        t = time.time()
        bpy.ops.render.render(write_still=True)
        print('FRAME', f, round(time.time() - t, 2), flush=True)
