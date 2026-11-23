# Ep 1, chapter 6: Honolulu harbor, 16 January 1893, late afternoon. USS Boston (1887 protected cruiser of the White
# Squadron) at anchor off the waterfront; her cutters pull for the Fort Street landing with sailors and Marines. Built
# in the diorama style after the Flow plates h1_honolulu_harbor_1893 and s4_cruiser_side_1887, checked against the
# period photographs (img/archival ch06_uss_boston_*, ch05_*): two buff funnels between the masts, square-rigged yards on
# both masts with round tops, cowl ventilators, a plumb ram bow; the waterfront of timber wharves, iron-roofed sheds and
# two-storey verandas, palms and dense trees, Punchbowl, the Koʻolau ridges behind and Diamond Head down the coast.
# Shots, keyed to the chapter 6 narration (public/audio/ch06_the_heist.words.json):
#   H1  "The help came from the American minister in Honolulu, John Stevens"   the harbor wide: the Boston at anchor, the
#        waterfront and the mountains; a slow push in (the Stevens lower third sits over this)
#   H2  "who ordered sailors and Marines ashore from the warship USS Boston"  low on the water off the landing: the cutters
#        row toward and past the camera, the Boston behind them, Diamond Head down the coast
#   xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python harbor.py -- <out_dir> [scale%] [mode: wide|boats|anim]
#   mode anim renders the frames in FRAMES (comma list) or the whole timeline
import bpy, bmesh, math, os, sys, random
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/harbor'
SCALE = int(argv[1]) if len(argv) > 1 else 100
MODE = argv[2] if len(argv) > 2 else 'wide'
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
box, prism, mesh_from, ico, cyl, empty, mat, lin = (CG[k] for k in ('box', 'prism', 'mesh_from', 'ico', 'cyl', 'empty', 'mat', 'lin'))
person, stand = PG['person'], PG['stand']
sc = bpy.context.scene
KEEP = {'sun', 'cam', 'target', 'Human Armature', 'Human_Mesh'}
for ob in list(bpy.data.objects):
    if ob.name not in KEEP:
        bpy.data.objects.remove(ob, do_unlink=True)
CG['MOVERS'].clear()
FPS = 30
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


STEM = 'ch06_the_heist'
T0 = _wt(STEM, 'The help came') - 0.05                       # H1 starts (chapter 6 time)
T_H2 = _wt(STEM, 'who ordered') - 0.05                       # H2 starts
T_END = _wt(STEM, 'Minister here') - 0.05                    # the street (landing.py) takes over
N = int(round((T_END - T0) * FPS))
FB = int(round((T_H2 - T0) * FPS))
sc.frame_start, sc.frame_end = 0, N - 1
TQ = [math.floor(f / FPS * 12) / 12 for f in range(N)]       # animation time, stepped at 12 fps
print('HARBOR TIMES', round(T0, 2), round(T_H2, 2), round(T_END, 2), 'frames', N, 'cut at', FB)
rnd = random.Random(1893)

# ---- palette (from the Flow plates h1 and s4)
WATER, WATER_DK, GLINT, GLINT_DK = '#5f8e93', '#4f7c83', '#dfe2d4', '#46717a'
HULL, HULL_SH, BOOT, DECK = '#e9e4d6', '#d5d0c2', '#34332f', '#b5a684'
BUFF, BUFF_DK, SPAR, RIG, IRON = '#cfae6e', '#3a3630', '#a3855a', '#3e3832', '#2f2e2b'
SAIL = '#ddd4bf'
GUN = '#3c3d3b'
LAND, LAND_DRY, MTN, MTN_DK, RIDGE, ROCK = '#7f8a4c', '#9a9660', '#7a9259', '#5e7352', '#8c9a6a', '#8d9183'
TREE = ['#3f5233', '#4a5f38', '#56693d']
WOOD, WOOD_DK, PILE = '#8b7457', '#6b5640', '#56473a'
WALLS = ['#e2d7bd', '#d8ccae', '#9b4a3a', '#a85a44', '#8f9a92', '#c9bfa4', '#7f8c90', '#b69a74']
ROOFS = ['#7d8282', '#6c7373', '#8a5c44', '#5f5b53', '#8d8b84']
TRIM_W, WIN = '#efe8d6', '#363b39'
CLOUD = '#ead9ae'


def adopt(parent, before):
    """parent every new top-level object (made since `before`) to `parent`, keeping its place"""
    for ob in bpy.data.objects:
        if ob not in before and ob.parent is None and ob is not parent:
            ob.parent = parent


def loft(name, sections, col, cap=True):
    """faces between consecutive point rows (same count each); cap closes the first and last rows"""
    n = len(sections[0])
    verts = [v for s in sections for v in s]
    faces = []
    for j in range(len(sections) - 1):
        for i in range(n - 1):
            a = j * n + i
            faces.append((a, a + 1, a + n + 1, a + n))
    if cap:
        faces.append(tuple(range(n))[::-1])
        faces.append(tuple(range((len(sections) - 1) * n, len(sections) * n)))
    return mesh_from(name, verts, faces, col)


def line(name, p0, p1, r=0.05, col=RIG):
    return cyl(name, p0, p1, r, r, col, n=4)


def flag(name, png, L, H, loc, rot_z=0.0, parent=None, wave=0.045):
    """a flag on a subdivided plane in metres (hoist at local x = 0, flying toward +x), waving at 12 fps"""
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=24, y_subdivisions=12, size=1)
    fl = bpy.context.active_object
    fl.name = name
    for v in fl.data.vertices:                                # grid in local xy, x 0..L, y -H..0; turned upright below
        x, y = v.co.x + 0.5, v.co.y + 0.5
        v.co = Vector((x * L, (y - 1.0) * H, 0.0))
    for p in fl.data.polygons:
        p.use_smooth = False
    fm = bpy.data.materials.get('flag_' + png) or bpy.data.materials.new('flag_' + png)
    if not fm.use_nodes:
        fm.use_nodes = True
        tex = fm.node_tree.nodes.new('ShaderNodeTexImage')
        tex.image = bpy.data.images.load(os.path.join(HERE, 'assets', png))
        fm.node_tree.links.new(tex.outputs['Color'], fm.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
        fm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 1.0
    fl.data.materials.append(fm)
    # the wave modifier displaces along local z (across the flag once it is stood up), travelling along x from the hoist
    wv = fl.modifiers.new('wave', 'WAVE')
    wv.use_x, wv.use_y = True, False
    wv.height, wv.width, wv.speed, wv.narrowness = wave * L, L * 0.33, 0.05 * L, 1.0
    wv.start_position_x = -0.3 * L
    fl.location = loc
    fl.rotation_euler = (math.pi / 2, 0, rot_z)
    if parent:
        fl.parent = parent
    ph = rnd.uniform(0, 30)
    for f in range(N):
        wv.time_offset = ph + f - math.floor(f / FPS * 12) / 12 * FPS
        wv.keyframe_insert('time_offset', frame=f)
    for fc in fl.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'
    return fl


# ================================================================ the water: big flat facets, light and dark slivers
def facets(name, x0, x1, y0, y1, nx, ny, amp, col, seed, z=0.0):
    rr = random.Random(seed)
    verts, faces = [], []
    for j in range(ny + 1):
        for i in range(nx + 1):
            jx = rr.uniform(-0.35, 0.35) * (x1 - x0) / nx if 0 < i < nx else 0.0
            jy = rr.uniform(-0.35, 0.35) * (y1 - y0) / ny if 0 < j < ny else 0.0
            verts.append((x0 + (x1 - x0) * i / nx + jx, y0 + (y1 - y0) * j / ny + jy, z + rr.uniform(-amp, amp)))
    for j in range(ny):
        for i in range(nx):
            a = j * (nx + 1) + i
            if (i + j) % 2:
                faces += [(a, a + 1, a + nx + 2), (a, a + nx + 2, a + nx + 1)]
            else:
                faces += [(a, a + 1, a + nx + 1), (a + 1, a + nx + 2, a + nx + 1)]
    return mesh_from(name, verts, faces, col)


facets('water', -900, 900, -900, -1.0, 150, 75, 0.2, WATER, 1)
facets('water_far', -16000, 16000, -16000, 0.0, 64, 32, 0.6, WATER, 2, z=-0.9)


def slivers(name, n, col, seed, y0=-700, y1=-20, x0=-600, x1=600):
    """long thin horizontal wedges on the water, like the plate's highlights"""
    rr = random.Random(seed)
    verts, faces = [], []
    for k in range(n):
        y = rr.uniform(y0, y1)
        x = rr.uniform(x0, x1)
        d = abs(y) + 40
        L = rr.uniform(0.015, 0.045) * d
        w = rr.uniform(0.004, 0.011) * d
        a = len(verts)
        verts += [(x - L / 2, y, 0.24), (x + L / 2, y + w * 0.2, 0.24), (x + L * 0.1, y + w, 0.24)]
        faces.append((a, a + 1, a + 2))
    return mesh_from(name, verts, faces, col)


slivers('glints', 380, GLINT, 3)
slivers('glints_dk', 380, GLINT_DK, 4)

# ================================================================ the land
PBX, PBY = 760.0, 1750.0                                      # Punchbowl (Puowaina), behind the town to the right


def ground(name, x0, x1, y0, y1, nx, ny, hfun, col, seed=5):
    """a faceted height field; the border rows stay straight so it meets the quay and other meshes cleanly"""
    rr = random.Random(seed)
    verts, faces = [], []
    for j in range(ny + 1):
        for i in range(nx + 1):
            x = x0 + (x1 - x0) * i / nx + (rr.uniform(-0.3, 0.3) * (x1 - x0) / nx if 0 < i < nx else 0.0)
            y = y0 + (y1 - y0) * j / ny + (rr.uniform(-0.3, 0.3) * (y1 - y0) / ny if 0 < j < ny else 0.0)
            verts.append((x, y, hfun(x, y)))
    for j in range(ny):
        for i in range(nx):
            a = j * (nx + 1) + i
            if (i + j) % 2:
                faces += [(a, a + 1, a + nx + 2), (a, a + nx + 2, a + nx + 1)]
            else:
                faces += [(a, a + 1, a + nx + 1), (a + 1, a + nx + 2, a + nx + 1)]
    return mesh_from(name, verts, faces, col)


def town_h(x, y):
    z = 2.2 + 0.02 * y
    r = math.hypot(x - PBX, (y - PBY) * 1.2)
    if r < 330:                                               # the crater: a broad low cone with a flat rim
        z += 105 * (0.8 + 0.2 * (r / 330) ** 3)
    else:
        z += 105 * math.exp(-((r - 330) / 230) ** 2)
    return z


ground('land', -5000, 5000, 0.0, 3600, 100, 36, town_h, LAND)
box('quay', -1200, -1.0, -1.5, 300, 0.4, 2.15, '#7d705e')                 # the bulkhead along the harbor front


def coast_h(x, y):
    yc = -(x - 260) * 0.27                                    # the shore runs east-south-east toward Waikiki
    return -3.0 if y < yc else 2.2


ground('coast', 260, 9000, -2700, 0.0, 70, 26, coast_h, LAND)


def ridges(x, y):
    """the Koʻolau: a high crest with spur ridges running down toward the town, valleys between"""
    crest = 1000 + 230 * math.sin(x * 0.0011 + 0.4) + 150 * abs(math.sin(x * 0.0031 + 1.0))
    d = (5200 - y) / 3300.0                                   # 0 at the crest line, 1 at the foot
    if d < 0:
        return crest * max(0.0, 1 + d * 1.5)
    base = crest * math.exp(-(d * 1.3) ** 2)
    u = (x + 420 * math.sin(y * 0.0011)) / 1400.0             # spur ridges, sharp-crested, with V valleys between
    sp = 1 - abs(math.sin(math.pi * u))
    sp2 = 1 - abs(math.sin(math.pi * u * 2.7 + 0.8))
    return base * (0.36 + 0.54 * sp ** 1.2 + 0.1 * sp2) * (1 - 0.3 * min(1.0, d))


ground('koolau', -12000, 12000, 1900, 9000, 210, 56, ridges, MTN)


def rock_faces(ob, col, steep=0.5, seed=9):
    """steep faces take a second (rock) colour, as in the plate's grey cliffs among the green"""
    rr = random.Random(seed)
    ob.data.materials.append(mat(col))
    for p in ob.data.polygons:
        if p.normal.z < steep or rr.random() < 0.025:
            p.material_index = 1


rock_faces(bpy.data.objects['koolau'], ROCK)


def waianae(x, y):
    return 520 * math.exp(-((x + 15000) / 4500) ** 2 - ((y - 9000) / 3500) ** 2) + 120 * math.sin(x * 0.001) ** 2


ground('waianae', -24000, -9000, 3000, 16000, 30, 20, waianae, MTN_DK)


def diamond(x, y):
    """Lēʻahi (Diamond Head): a tuff crater whose high rim is on the seaward side"""
    cx, cy = 5000.0, -2350.0
    dx, dy = (x - cx) / 900.0, (y - cy) / 750.0
    r = math.hypot(dx, dy)
    a = math.atan2(dy, dx)
    rim = 120 + 105 * max(0.0, -math.sin(a + 0.5)) ** 1.5    # highest on the south-west
    if r < 0.75:
        return 70 + (rim - 70) * (r / 0.75) ** 3
    return max(-3.0, rim * math.exp(-((r - 0.75) / 0.45) ** 2))


ground('diamondhead', 3700, 6400, -3500, -1300, 32, 28, diamond, RIDGE)
def blobs(name, items, col):
    """many low-poly lumps in one mesh (tree canopies, cloud banks): items are (centre, radius, squash, seed)"""
    bm = bmesh.new()
    for loc, r, sq, seed in items:
        rr = random.Random(seed)
        ret = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=r)
        for v in ret['verts']:
            v.co = Vector((v.co.x * sq[0] * (1 + rr.uniform(-0.15, 0.15)), v.co.y * sq[1] * (1 + rr.uniform(-0.15, 0.15)),
                           v.co.z * sq[2] * (1 + rr.uniform(-0.15, 0.15)))) + Vector(loc)
    return CG['obj_from_bm'](name, bm, col)


CL = []                                                       # cloud banks resting on the ridges, heaviest at the left as in the plate
for ci, (cx, cy, cz, cw, n) in enumerate(((-4300, 6400, 1250, 2600, 14), (-1200, 7400, 1500, 1500, 9), (3600, 7600, 1650, 1700, 9), (8200, 6800, 1450, 1600, 8))):
    for k in range(n):
        CL.append(((cx + (k - n / 2) * cw * 0.11, cy + (k % 3) * 120, cz + (k % 4) * 70 - (abs(k - n / 2) / n) * 260), cw * (0.1 + 0.03 * (k % 3)), (2.1, 1.0, 0.45), ci * 20 + k))
blobs('clouds', CL, CLOUD)

# ================================================================ the wharves (the Fort Street landing at x ~ -60)
DZ = 2.2                                                      # wharf deck level
box('wharf', -420, -14.0, DZ - 0.35, 250, 0.0, DZ, WOOD)
for k in range(int(670 / 3.5)):
    x = -418 + k * 3.5
    cyl(f'pile{k}', (x, -14.1, -1.2), (x, -14.1, DZ - 0.2), 0.22, 0.22, PILE, n=6)
box('fender', -420, -14.45, DZ - 0.9, 250, -14.25, DZ - 0.55, WOOD_DK)
PIER = (-68.0, -52.0, -64.0)                                  # the landing pier: x0, x1, its outer end y
box('pier', PIER[0], PIER[2], DZ - 0.35, PIER[1], -14.0, DZ, WOOD)
for k in range(13):
    y = PIER[2] + 0.2 + k * 4.0
    for x in (PIER[0] + 0.3, PIER[1] - 0.3):
        cyl(f'ppile{k}{x:.0f}', (x, y, -1.2), (x, y, DZ - 0.2), 0.22, 0.22, PILE, n=6)
for k in range(9):                                            # landing steps down to the water at the pier end
    box(f'lstep{k}', PIER[0] + 4.5, PIER[2] - 0.6 - k * 0.32, DZ - 0.3 - k * 0.27, PIER[0] + 8.5, PIER[2] - 0.3 - k * 0.32, DZ - 0.15 - k * 0.27, WOOD_DK)
for k, x in enumerate((-60.5, -55.0, -66.0)):
    cyl(f'bollard{k}', (x, PIER[2] + 1.0 + k * 9, DZ), (x, PIER[2] + 1.0 + k * 9, DZ + 0.55), 0.18, 0.15, IRON, n=8)
# cargo on the wharf: sugar bags, barrels, crates
for k in range(40):
    x = rnd.uniform(-400, 240)
    if -75 < x < -45:
        continue
    y = rnd.uniform(-12.5, -2.0)
    kind = rnd.random()
    if kind < 0.4:
        for j in range(rnd.randint(2, 5)):
            box(f'sack{k}{j}', x + j * 0.7, y, DZ + (j % 2) * 0.35, x + j * 0.7 + 0.65, y + 1.1, DZ + 0.35 + (j % 2) * 0.35, '#c8b98f')
    elif kind < 0.7:
        for j in range(rnd.randint(2, 4)):
            cyl(f'barrel{k}{j}', (x + j * 0.75, y, DZ), (x + j * 0.75, y, DZ + 0.9), 0.32, 0.32, '#7a5a3c', n=8)
    else:
        s = rnd.uniform(0.8, 1.4)
        box(f'crate{k}', x, y, DZ, x + s, y + s, DZ + s * 0.8, '#a58a62')

# ================================================================ the waterfront town
def hip_roof(name, x0, y0, x1, y1, z, rise, col, ov=0.5):
    x0, y0, x1, y1 = x0 - ov, y0 - ov, x1 + ov, y1 + ov
    w, d = x1 - x0, y1 - y0
    if w >= d:
        a, b = (x0 + d / 2, (y0 + y1) / 2), (x1 - d / 2, (y0 + y1) / 2)
    else:
        a, b = ((x0 + x1) / 2, y0 + w / 2), ((x0 + x1) / 2, y1 - w / 2)
    v = [(x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z), (a[0], a[1], z + rise), (b[0], b[1], z + rise)]
    if w >= d:
        f = [(0, 1, 5, 4), (2, 3, 4, 5), (3, 0, 4), (1, 2, 5), (3, 2, 1, 0)]
    else:
        f = [(1, 2, 5, 4), (3, 0, 4, 5), (0, 1, 4), (2, 3, 5), (3, 2, 1, 0)]
    return mesh_from(name, v, f, col)


def gable_y(name, x0, y0, x1, y1, z, rise, roof, wall, ov=0.5):
    """a gable roof with its ridge running along y (gable end to the water), and the gable wall triangles"""
    xm = (x0 + x1) / 2
    prism(name + 'gw', [(x0, z), (x1, z), (xm, z + rise)], y0, y1, wall)
    t = 0.18
    for s in (-1, 1):
        xe = x0 - ov if s < 0 else x1 + ov
        ze = z - ov * rise / ((x1 - x0) / 2)
        prism(f'{name}r{s}', [(xm, z + rise + t), (xe, ze + t), (xe, ze), (xm, z + rise)], y0 - ov, y1 + ov, roof)


def windows(name, x0, x1, y, z0, h, n, col=WIN, trim=None, wz=1.5, ww=0.9):
    for k in range(n):
        x = x0 + (k + 0.5) * (x1 - x0) / n
        if trim:
            box(f'{name}t{k}', x - ww / 2 - 0.12, y - 0.08, z0 - 0.12, x + ww / 2 + 0.12, y + 0.01, z0 + wz + 0.15, trim)
        box(f'{name}{k}', x - ww / 2, y - 0.12, z0, x + ww / 2, y + 0.01, z0 + wz, col)


def veranda(name, x0, x1, y, z0, floors, fh, depth, col, rail):
    """a two-level veranda across the front (the front faces -y): posts, floor, rails, a shed roof"""
    yf = y - depth
    n = max(2, int((x1 - x0) / 2.6))
    for k in range(n + 1):
        x = x0 + k * (x1 - x0) / n
        box(f'{name}p{k}', x - 0.09, yf, z0, x + 0.09, yf + 0.18, z0 + floors * fh, col)
    for fl in range(1, floors):
        z = z0 + fl * fh
        box(f'{name}fl{fl}', x0 - 0.1, yf - 0.05, z - 0.2, x1 + 0.1, y, z, col)
        box(f'{name}rl{fl}', x0, yf - 0.02, z + 0.95, x1, yf + 0.1, z + 1.05, rail)
        box(f'{name}rb{fl}', x0, yf + 0.02, z + 0.12, x1, yf + 0.06, z + 0.95, rail)
    zt = z0 + floors * fh
    mesh_from(name + 'roof', [(x0 - 0.3, y, zt + 0.5), (x1 + 0.3, y, zt + 0.5), (x1 + 0.3, yf - 0.4, zt - 0.1), (x0 - 0.3, yf - 0.4, zt - 0.1)],
              [(0, 1, 2, 3)], ROOFS[1])


def building(name, x0, y0, w, d, floors, wall, roof, kind, ground):
    z0 = ground
    fh = 3.7
    H = floors * fh
    if kind == 'shed':                                        # a gabled warehouse, its gable end to the water
        box(name, x0, y0, z0, x0 + w, y0 + d, z0 + H, wall)
        gable_y(name + 'g', x0, y0, x0 + w, y0 + d, z0 + H, w * 0.28, roof, wall)
        box(name + 'door', x0 + w * 0.3, y0 - 0.1, z0, x0 + w * 0.7, y0 + 0.02, z0 + H * 0.75, '#3b3530')
        return
    box(name, x0, y0, z0, x0 + w, y0 + d, z0 + H, wall)
    for fl in range(floors):
        windows(f'{name}w{fl}', x0 + 0.6, x0 + w - 0.6, y0, z0 + fl * fh + 0.9, 1.7, max(1, int(w / 2.8)), trim=TRIM_W if wall in (WALLS[2], WALLS[3]) else None)
    if kind == 'veranda':
        veranda(name + 'v', x0, x0 + w, y0, z0, floors, fh, 2.6, TRIM_W, '#d9d2bf')
        hip_roof(name + 'r', x0, y0, x0 + w, y0 + d, z0 + H, min(w, d) * 0.3, roof)
    elif kind == 'brick':
        box(name + 'cor', x0 - 0.25, y0 - 0.25, z0 + H - 0.1, x0 + w + 0.25, y0 + d, z0 + H + 0.3, TRIM_W)
        box(name + 'par', x0, y0, z0 + H + 0.3, x0 + w, y0 + 0.3, z0 + H + 1.1, wall)
        box(name + 'flat', x0, y0, z0 + H, x0 + w, y0 + d, z0 + H + 0.25, roof)
    else:
        hip_roof(name + 'r', x0, y0, x0 + w, y0 + d, z0 + H, min(w, d) * 0.32, roof)


def tree(name, x, y, z, h, w, seed):
    rr = random.Random(seed)
    cyl(name + 't', (x, y, z), (x + rr.uniform(-0.5, 0.5), y, z + h * 0.6), w * 0.05, w * 0.035, '#5e4632')
    for k in range(rr.randint(4, 7)):
        ico(f'{name}{k}', (x + rr.uniform(-0.4, 0.4) * w, y + rr.uniform(-0.3, 0.3) * w, z + h * rr.uniform(0.55, 0.95)),
            w * rr.uniform(0.26, 0.38), TREE[k % 3], 1, (1.3, 1.1, 0.75), seed=seed * 13 + k)


def palm(x, y, z, h, lean, L, seed):
    CG['palm'](x, y, h, lean, 11, L, seed)
    bpy.data.objects[f'palm{seed}'].location.z = z


# the front row along the harbor: warehouses on the wharf apron and two-storey verandas, then rows behind
x = -560.0
k = 0
while x < 330:
    w = rnd.uniform(11, 24)
    if -75 < x + w and x < -45:                               # leave the street at the head of the landing pier open
        x = -45.0
        continue
    kind = rnd.choice(['shed', 'shed', 'veranda', 'brick', 'plain', 'veranda'])
    floors = 1 if kind == 'shed' else rnd.choice([1, 2, 2])
    wall = rnd.choice(WALLS[:2] + WALLS[5:]) if kind == 'shed' else rnd.choice(WALLS)
    if kind == 'brick':
        wall = rnd.choice(WALLS[2:4])
    building(f'b0_{k}', x, 3.0 + rnd.uniform(0, 3), w, rnd.uniform(12, 20), floors, wall, rnd.choice(ROOFS), kind, town_h(x, 3))
    x += w + rnd.uniform(1.0, 5.0)
    k += 1
for row, (y0, y1, dens) in enumerate(((32, 60, 0.75), (70, 110, 0.65), (125, 180, 0.55), (195, 260, 0.5), (280, 360, 0.45))):
    x = -760.0 - row * 60
    while x < 520 + row * 60:
        w = rnd.uniform(9, 18)
        if rnd.random() < dens:
            y = rnd.uniform(y0, y1 - 12)
            kind = rnd.choice(['veranda', 'plain', 'plain', 'brick'] if row < 2 else ['plain', 'plain', 'veranda'])
            wall = rnd.choice(WALLS[2:4]) if kind == 'brick' else rnd.choice(WALLS)
            building(f'b{row + 1}_{k}', x, y, w, rnd.uniform(9, 14), rnd.choice([1, 2]), wall, rnd.choice(ROOFS), kind, town_h(x, y))
        else:
            tree(f'tr{row}_{k}', x + w / 2, rnd.uniform(y0, y1), town_h(x, y0), rnd.uniform(9, 14), rnd.uniform(8, 13), 500 + k)
        x += w + rnd.uniform(2, 7)
        k += 1
# beyond: roofs among dense trees up to the foot of Punchbowl and the ridges
CAN = [[], [], []]
for j in range(4200):
    x = rnd.uniform(-3400, 3600)
    y = 370 + 2100 * rnd.random() ** 1.6
    if math.hypot(x - PBX, (y - PBY) * 1.2) < 380:
        continue
    z = town_h(x, y)
    if rnd.random() < 0.18 and y < 1500:
        w, d = rnd.uniform(8, 14), rnd.uniform(8, 12)
        box(f'h{j}', x, y, z, x + w, y + d, z + 5.0, rnd.choice(WALLS))
        hip_roof(f'hr{j}', x, y, x + w, y + d, z + 5.0, 3.0, rnd.choice(ROOFS))
    else:
        r = rnd.uniform(8, 15) * (1 + y / 3000)
        CAN[j % 3].append(((x, y, z + r * 0.55), r, (1.4, 1.2, 0.72), 900 + j))
for k in range(3):
    blobs(f'canopy{k}', CAN[k], TREE[k])
# landmarks over the roofs: a twin-spired brick church, a square stone church tower, and the clock tower of the
# Government Building (Aliʻiōlani Hale) with the Hawaiian flag
def spire(name, x, y, z, h, col, roof):
    box(name, x - 2.2, y - 2.2, z, x + 2.2, y + 2.2, z + h, col)
    mesh_from(name + 'sp', [(x - 2.4, y - 2.4, z + h), (x + 2.4, y - 2.4, z + h), (x + 2.4, y + 2.4, z + h), (x - 2.4, y + 2.4, z + h), (x, y, z + h + h * 0.8)],
              [(0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4)], roof)


zc = town_h(-330, 420)
box('kaum', -345, 420, zc, -315, 450, zc + 11, '#9b4a3a')
spire('kaum1', -342, 418, zc, 22, '#9b4a3a', '#5f5b53')
spire('kaum2', -318, 418, zc, 22, '#9b4a3a', '#5f5b53')
zk = town_h(330, 470)
box('kawa', 318, 470, zk, 342, 500, zk + 10, '#b9ae95')
box('kawat', 325, 462, zk, 335, 472, zk + 21, '#b9ae95')
for k in range(4):
    box(f'kawac{k}', 325 + k * 2.6, 461.6, zk + 21, 326.6 + k * 2.6, 472.4, zk + 22.4, '#b9ae95')
zg = town_h(190, 330)
box('gbld', 160, 330, zg, 222, 348, zg + 11, '#d9cdb0')
box('gtow', 186, 326, zg, 196, 336, zg + 25, '#d9cdb0')
box('gtowc', 185.5, 325.5, zg + 25, 196.5, 336.5, zg + 26.2, TRIM_W)
cyl('gpole', (191, 331, zg + 26), (191, 331, zg + 34), 0.12, 0.08, IRON, n=6)
flag('gflag', 'hawaii_flag.png', 6.0, 3.0, (191, 331, zg + 33.8), 0.0)
cyl('custpole', (-120, 10, DZ), (-120, 10, DZ + 16), 0.12, 0.08, IRON, n=6)
flag('custflag', 'hawaii_flag.png', 3.4, 1.7, (-120, 10, DZ + 15.8), 0.2)
# palms along the waterfront and in the town; trees between the front buildings
for i in range(34):
    xp = rnd.uniform(-500, 300)
    if -80 < xp < -40:
        continue
    yp = rnd.choice([rnd.uniform(1, 3), rnd.uniform(25, 34), rnd.uniform(60, 75)])
    palm(xp, yp, town_h(xp, yp), rnd.uniform(13, 21), rnd.uniform(-0.12, 0.12), rnd.uniform(4.2, 5.4), 40 + i)
for i in range(14):                                           # palms along the coast toward Waikiki
    xp = rnd.uniform(320, 2600)
    yp = -(xp - 260) * 0.27 + rnd.uniform(8, 60)
    palm(xp, yp, coast_h(xp, yp), rnd.uniform(12, 18), rnd.uniform(-0.12, 0.12), 4.4, 80 + i)
for i in range(140):                                          # the trees of Kakaʻako and Waikiki along the coast
    xp = rnd.uniform(300, 4300)
    yp = -(xp - 260) * 0.27 + rnd.uniform(15, 500)
    ico(f'ct{i}', (xp, yp, coast_h(xp, yp) + 6), rnd.uniform(8, 16), TREE[i % 3], 1, (1.4, 1.2, 0.7), seed=1500 + i)
for i in range(30):
    xp = rnd.uniform(320, 3800)
    yp = -(xp - 260) * 0.27 + rnd.uniform(20, 300)
    box(f'ch{i}', xp, yp, coast_h(xp, yp), xp + 9, yp + 8, coast_h(xp, yp) + 4.2, rnd.choice(WALLS))
    hip_roof(f'chr{i}', xp, yp, xp + 9, yp + 8, coast_h(xp, yp) + 4.2, 2.6, rnd.choice(ROOFS))

# ================================================================ USS Boston (bow +x, port side +y), then placed in the harbor
before = set(bpy.data.objects)
L, B = 86.0, 12.8
ZD = 5.0                                                      # main deck above the waterline


def hw(f):
    """half-breadth at the deck, f = 0 at the stern to 1 at the bow"""
    if f < 0.32:
        return B / 2 * (0.5 + 0.5 * math.sin(math.pi / 2 * f / 0.32))
    if f < 0.58:
        return B / 2
    return max(0.08, B / 2 * (1 - ((f - 0.58) / 0.42) ** 1.7))


def hwl(f):
    if f < 0.32:
        return B / 2 * 0.97 * (0.22 + 0.78 * math.sin(math.pi / 2 * f / 0.32))
    return hw(f) * 0.97


def fx(f):
    return -L / 2 + f * L


def zdeck(f):
    return ZD + 0.7 * max(0.0, (f - 0.72) / 0.28) ** 2 + 0.2 * max(0.0, (0.15 - f) / 0.15)


ST = [0.0, 0.02, 0.06, 0.12, 0.2, 0.3, 0.42, 0.55, 0.66, 0.76, 0.85, 0.92, 0.97, 1.0]
secs = []
for f in ST:
    x, h, hl, zd = fx(f), hw(f), hwl(f), zdeck(f)
    sx = 2.8 * max(0.0, (0.08 - f) / 0.08)                   # the counter stern: the lower hull starts further forward
    secs.append([(x, -h, zd), (x, -h, zd * 0.45), (x + sx * 0.6, -hl, 0.0), (x + sx, -hl * 0.7, -2.6), (x + sx, 0.0, -3.2),
                 (x + sx, hl * 0.7, -2.6), (x + sx * 0.6, hl, 0.0), (x, h, zd * 0.45), (x, h, zd)])
loft('bos_hull', secs, HULL)
mesh_from('bos_deck', [p for s in secs for p in (s[0], s[-1])],
          [(2 * j, 2 * j + 2, 2 * j + 3, 2 * j + 1) for j in range(len(secs) - 1)], DECK)
boot = []
for f in ST[1:]:
    x, h, hl = fx(f), hw(f), hwl(f)
    b35 = hl + (h - hl) * (0.4 / (zdeck(f) * 0.45)) + 0.03
    boot.append([(x, -b35, 0.4), (x, -hl - 0.03, -0.3), (x, hl + 0.03, -0.3), (x, b35, 0.4)])
loft('bos_boot', boot, BOOT, cap=False)
# rails along the deck edges (stanchions and a top rail) at the bow and stern, where there is no superstructure
for side in (-1, 1):
    for (fa, fb) in ((0.01, 0.2), (0.76, 0.97)):
        pts = [(fx(fa + (fb - fa) * k / 8), side * (hw(fa + (fb - fa) * k / 8) - 0.1), zdeck(fa + (fb - fa) * k / 8)) for k in range(9)]
        for k in range(8):
            p0, p1 = Vector(pts[k]), Vector(pts[k + 1])
            line(f'brail{side}{fa}{k}', p0 + Vector((0, 0, 1.0)), p1 + Vector((0, 0, 1.0)), 0.04, TRIM_W)
            line(f'bstan{side}{fa}{k}', p0, p0 + Vector((0, 0, 1.0)), 0.035, TRIM_W)
# portholes and the hull's gunports
for side in (-1, 1):
    for k in range(30):
        f = 0.05 + k * 0.03
        if 0.25 < f < 0.74 and k % 2:
            continue
        x = fx(f)
        y = side * (hw(f) + 0.02)
        box(f'port{side}{k}', x - 0.18, y - 0.03, 3.25, x + 0.18, y + 0.03, 3.6, BOOT)
    for f in (0.12, 0.86):
        x, y = fx(f), side * (hw(f) + 0.02)
        box(f'hgp{side}{f}', x - 0.55, y - 0.04, ZD - 1.6, x + 0.55, y + 0.04, ZD - 0.6, '#55534c')
# the superstructure amidships with its gunports (6-inch guns), the hurricane deck, boats and davits
SX0, SX1, SW, SH = fx(0.21), fx(0.75), 5.0, 2.5
box('bos_super', SX0, -SW, ZD, SX1, SW, ZD + SH, HULL)
box('bos_hdeck', SX0 - 0.3, -SW - 0.3, ZD + SH, SX1 + 0.3, SW + 0.3, ZD + SH + 0.18, DECK)
box('bos_hband', SX0 - 0.32, -SW - 0.32, ZD + SH - 0.05, SX1 + 0.32, SW + 0.32, ZD + SH + 0.1, HULL_SH)
for side in (-1, 1):
    for k, x in enumerate((SX0 + 5, SX0 + 13, SX0 + 22, SX0 + 31, SX0 + 40)):
        y = side * (SW + 0.02)
        box(f'sgp{side}{k}', x - 0.6, y - 0.04, ZD + 0.7, x + 0.6, y + 0.04, ZD + 1.9, '#55534c')
        if k in (1, 3):
            cyl(f'sgun{side}{k}', (x, side * SW, ZD + 1.3), (x, side * (SW + 2.8), ZD + 1.3), 0.17, 0.13, GUN, n=8)
    for k in range(10):
        x = SX0 + 2 + k * 4.4
        box(f'swin{side}{k}', x - 0.25, side * (SW + 0.02) - 0.03, ZD + 1.15, x + 0.25, side * (SW + 0.02) + 0.03, ZD + 1.5, BOOT)
    for k in range(13):                                       # the hurricane deck's rail
        x = SX0 + k * (SX1 - SX0) / 12
        line(f'hstan{side}{k}', (x, side * SW, ZD + SH + 0.18), (x, side * SW, ZD + SH + 1.1), 0.035, TRIM_W)
    line(f'hrail{side}', (SX0, side * SW, ZD + SH + 1.1), (SX1, side * SW, ZD + SH + 1.1), 0.04, TRIM_W)
# the 8-inch guns on barbettes at the ends of the superstructure: forward one to port, aft one to starboard
for (f, side, d) in ((0.79, 1, 1), (0.17, -1, -1)):
    x, y = fx(f), side * 2.6
    cyl(f'barb{f}', (x, y, ZD), (x, y, ZD + 1.6), 2.6, 2.6, HULL, n=14)
    box(f'shield{f}', x - 1.6, y - 1.3, ZD + 1.6, x + 1.4, y + 1.3, ZD + 3.0, HULL_SH)
    cyl(f'gun8{f}', (x + d * 1.2, y, ZD + 2.2), (x + d * 7.5, y, ZD + 2.3), 0.33, 0.24, GUN, n=8)
# funnels (buff, black tops), their casings, the cowl ventilators
for k, f in enumerate((0.46, 0.57)):
    x = fx(f)
    box(f'casing{k}', x - 2.0, -2.0, ZD + SH, x + 2.0, 2.0, ZD + SH + 1.4, HULL)
    cyl(f'funnel{k}', (x, 0, ZD + SH), (x, 0, ZD + SH + 10.5), 1.3, 1.3, BUFF, n=12)
    cyl(f'ftop{k}', (x, 0, ZD + SH + 10.5), (x, 0, ZD + SH + 11.3), 1.33, 1.33, BUFF_DK, n=12)
    cyl(f'fpipe{k}', (x - 1.5, 0.6, ZD + SH), (x - 1.5, 0.6, ZD + SH + 11.6), 0.14, 0.14, BUFF, n=6)
for k, (x, y, h) in enumerate(((fx(0.40), 2.6, 2.6), (fx(0.40), -2.6, 2.6), (fx(0.52), 3.0, 3.0), (fx(0.52), -3.0, 3.0),
                                (fx(0.63), 2.4, 2.4), (fx(0.63), -2.4, 2.4), (fx(0.35), 0.0, 2.2), (fx(0.69), 3.6, 2.0))):
    z0 = ZD + SH
    cyl(f'vent{k}', (x, y, z0), (x, y, z0 + h), 0.32, 0.32, BUFF, n=8)
    d = 1 if k % 2 else -1
    cyl(f'cowl{k}', (x - 0.2, y, z0 + h - 0.2), (x + 0.45, y, z0 + h + 0.25), 0.5, 0.62, BUFF, n=8)
    cyl(f'cowlm{k}', (x + 0.47, y, z0 + h + 0.27), (x + 0.5, y, z0 + h + 0.3), 0.5, 0.5, BUFF_DK, n=8)
# the bridge, forward of the funnels, and the chart house
BXB = fx(0.665)
box('chart', BXB - 1.6, -1.8, ZD + SH, BXB + 1.6, 1.8, ZD + SH + 2.4, HULL)
box('bridge', BXB - 1.3, -6.2, ZD + SH + 2.4, BXB + 1.3, 6.2, ZD + SH + 2.6, DECK)
for side in (-1, 1):
    line(f'bpost{side}', (BXB, side * 5.6, ZD + SH), (BXB, side * 5.6, ZD + SH + 2.4), 0.09, TRIM_W)
    box(f'bscreen{side}', BXB - 1.3, side * 6.2 - 0.05, ZD + SH + 2.6, BXB + 1.3, side * 6.2 + 0.05, ZD + SH + 3.5, HULL)
box('bscreen_f', BXB + 1.25, -6.2, ZD + SH + 2.6, BXB + 1.35, 6.2, ZD + SH + 3.5, HULL)
# masts, tops, yards with furled sails, gaffs, a little rigging
MASTS = [(0.69, 0.0), (0.28, -1.8)]                           # (position, height offset): fore, main
for mi, (f, dh) in enumerate(MASTS):
    x = fx(f)
    zb = ZD + SH
    cyl(f'mast{mi}', (x, 0, zb), (x, 0, 21 + dh), 0.45, 0.36, SPAR, n=8)
    cyl(f'top{mi}', (x, 0, 18.4 + dh), (x, 0, 18.9 + dh), 1.9, 1.9, '#6e5a40', n=12)
    cyl(f'tmast{mi}', (x, 0, 19.5 + dh), (x, 0, 31.2 + dh), 0.28, 0.22, SPAR, n=6)
    box(f'xtree{mi}', x - 0.5, -1.4, 30.5 + dh, x + 0.5, 1.4, 30.7 + dh, '#6e5a40')
    cyl(f'tgmast{mi}', (x, 0, 30.6 + dh), (x, 0, 39.6 + dh), 0.16, 0.1, SPAR, n=6)
    ico(f'truck{mi}', (x, 0, 39.7 + dh), 0.22, SPAR, 1)
    for yi, (z, yl) in enumerate(((17.6, 16.0), (24.6, 12.0), (32.0, 8.6), (36.4, 5.6))):
        z += dh
        yl *= 0.93 if mi else 1.0
        cyl(f'yard{mi}{yi}', (x + 0.4, -yl / 2, z), (x + 0.4, yl / 2, z), 0.16, 0.16, SPAR, n=6)
        if yi < 3:
            cyl(f'furl{mi}{yi}', (x + 0.55, -yl / 2 + 0.8, z - 0.25), (x + 0.55, yl / 2 - 0.8, z - 0.25), 0.3, 0.3, SAIL, n=6)
    cyl(f'gaff{mi}', (x - 0.4, 0, 19.0 + dh), (x - 8.5, 0, 23.5 + dh), 0.14, 0.11, SPAR, n=6)
    for side in (-1, 1):                                      # shrouds: lower mast to the deck edge, topmast to the top's rim
        for k, dx in enumerate((-1.6, 0.0, 1.6)):
            fe = f + dx / L - 0.02
            line(f'shroud{mi}{side}{k}', (x + dx * 0.2, side * 1.7, 18.4 + dh), (x + dx - 1.5, side * (SW + 0.1), zb + 0.2), 0.045)
            line(f'tshroud{mi}{side}{k}', (x, side * 0.25, 30.5 + dh), (x + dx * 0.5 - 0.6, side * 1.8, 18.9 + dh), 0.035)
        line(f'bstay{mi}{side}', (x, 0, 38.0 + dh), (x - 14, side * (hw(f - 0.16) - 0.2), zdeck(f - 0.16) + 0.5), 0.04)
line('forestay', (fx(0.69), 0, 21.0), (fx(0.995), 0, zdeck(1.0) + 1.0), 0.06)
line('ftopstay', (fx(0.69), 0, 38.5), (fx(1.0) + 1.5, 0, zdeck(1.0) + 1.8), 0.045)
line('mainstay', (fx(0.28), 0, 37.2), (fx(0.69), 0, 21.5), 0.045)
cyl('jibboom', (fx(0.99), 0, zdeck(1.0) + 0.5), (fx(1.0) + 3.0, 0, zdeck(1.0) + 1.8), 0.14, 0.1, SPAR, n=6)
# ship's boats on the hurricane deck and at the quarter davits


def small_hull(name, Lb, Bb, Hb, col, gun=WOOD_DK, x0=0.0, y0=0.0, z0=0.0, axis='y'):
    """an open boat hull, bow toward +axis; returns nothing (objects are named from `name`)"""
    rows, rails = [], []
    for k in range(9):
        f = k / 8
        hb = Bb / 2 * (0.68 + 0.32 * math.sin(math.pi * min(1.0, f / 0.55) / 2)) if f < 0.55 else max(0.03, Bb / 2 * (1 - ((f - 0.55) / 0.45) ** 1.6))
        s = -Lb / 2 + f * Lb
        zs = Hb * (1 + 0.25 * (abs(f - 0.45) / 0.55) ** 2)
        row = [(-hb, zs), (-hb * 0.9, Hb * 0.25), (-hb * 0.45, -Hb * 0.5), (0, -Hb * 0.6), (hb * 0.45, -Hb * 0.5), (hb * 0.9, Hb * 0.25), (hb, zs)]
        if axis == 'y':
            rows.append([(x0 + a, y0 + s, z0 + b) for a, b in row])
        else:
            rows.append([(x0 + s, y0 + a, z0 + b) for a, b in row])
    loft(name, rows, col, cap=False)
    mesh_from(name + 'tr', rows[0], [tuple(range(7))], col)
    for side in (0, 6):
        pts = [Vector(r[side]) for r in rows]
        for k in range(8):
            line(f'{name}gw{side}{k}', pts[k], pts[k + 1], 0.06, gun)


for side in (-1, 1):
    for k, f in enumerate((0.33, 0.62)):
        small_hull(f'dboat{side}{k}', 7.5, 1.9, 0.75, HULL, x0=fx(f), y0=side * 3.4, z0=ZD + SH + 0.9, axis='x')
        for dx in (-3.0, 3.0):
            box(f'chock{side}{k}{dx}', fx(f) + dx - 0.15, side * 3.4 - 0.6, ZD + SH + 0.18, fx(f) + dx + 0.15, side * 3.4 + 0.6, ZD + SH + 0.55, WOOD_DK)
    small_hull(f'qboat{side}', 8.0, 2.0, 0.8, HULL, x0=fx(0.12), y0=side * (hw(0.12) + 1.4), z0=ZD + 1.6, axis='x')
    for dx in (-3.2, 3.2):
        x = fx(0.12) + dx
        line(f'davit{side}{dx}', (x, side * (hw(0.12) - 0.2), ZD), (x, side * (hw(0.12) + 0.6), ZD + 4.2), 0.1, TRIM_W)
        line(f'davit2{side}{dx}', (x, side * (hw(0.12) + 0.6), ZD + 4.2), (x, side * (hw(0.12) + 1.4), ZD + 3.9), 0.1, TRIM_W)
        line(f'fall{side}{dx}', (x, side * (hw(0.12) + 1.4), ZD + 3.9), (x, side * (hw(0.12) + 1.4), ZD + 2.3), 0.03, RIG)
# the accommodation ladder on the port (shore) side, and the anchor chain from the starboard hawse
LX = fx(0.48)
lad = box('ladder', -3.2, -0.5, -0.07, 3.2, 0.5, 0.07, WOOD)
lad.location = (LX - 2.6, B / 2 + 1.0, ZD * 0.5)
lad.rotation_euler = (0, math.atan2(ZD - 0.6, 5.8), math.radians(0))
box('lplat', LX - 6.8, B / 2 + 0.4, 0.45, LX - 4.8, B / 2 + 1.7, 0.6, WOOD)
line('lrail', (LX + 0.2, B / 2 + 1.5, ZD + 1.0), (LX - 5.4, B / 2 + 1.5, 1.6), 0.03, TRIM_W)
line('chain', (fx(0.95), -1.6, ZD - 0.5), (fx(0.95) + 12, -2.4, -0.2), 0.08, IRON)
box('hawse', fx(0.95) - 0.4, -hw(0.95) - 0.05, ZD - 1.0, fx(0.95) + 0.4, -hw(0.95) + 0.05, ZD - 0.3, BOOT)
cyl('ensstaff', (fx(0.0) - 0.4, 0, zdeck(0.0)), (fx(0.0) - 1.2, 0, zdeck(0.0) + 7.5), 0.09, 0.06, SPAR, n=6)
cyl('jackstaff', (fx(1.0) - 0.4, 0, zdeck(1.0)), (fx(1.0) - 0.2, 0, zdeck(1.0) + 4.5), 0.07, 0.05, SPAR, n=6)
# a few of the ship's company along the rails (the rest are in the boats)
BOSTON = empty('boston', (0, 0, 0))
adopt(BOSTON, before)
BOS_X, BOS_Y, BOS_R = 40.0, -190.0, math.radians(-6)
BOSTON.location = (BOS_X, BOS_Y, 0.0)
BOSTON.rotation_euler = (0, 0, BOS_R)
bpy.context.view_layer.update()


def on_ship(p):
    return BOSTON.matrix_world @ Vector(p)


flag('ensign', 'us_flag_44.png', 3.8, 2.0, on_ship((fx(0.0) - 1.2, 0, zdeck(0.0) + 7.4)), BOS_R + math.pi, wave=0.04)
flag('jack', 'us_jack_44.png', 1.6, 1.1, on_ship((fx(1.0) - 0.2, 0, zdeck(1.0) + 4.4)), BOS_R + math.pi, wave=0.03)
flag('pennant', 'us_pennant.png', 6.0, 0.35, on_ship((fx(0.28), 0, 37.9)), BOS_R + math.pi, wave=0.06)
for k, (f, side) in enumerate(((0.83, -1), (0.86, -1), (0.9, -1), (0.1, -1), (0.07, 1), (0.84, 1), (0.88, 1))):
    p = on_ship((fx(f), side * (hw(f) - 0.8), zdeck(f)))
    r_, a_ = person(f'deck{k}', 'sailor', tuple(p), math.degrees(BOS_R) + (180 if side < 0 else 0))
    stand(a_, N, k=k * 0.7)

# ================================================================ other shipping: a bark alongside the wharf, a schooner
def sailing_ship(name, Ls, Bs, Fs, hull_col, masts, loc, rz, yards=True):
    b4 = set(bpy.data.objects)
    rows = []
    for k in range(11):
        f = k / 10
        h = Bs / 2 * (0.75 + 0.25 * math.sin(math.pi * min(1.0, f / 0.5) / 2)) if f < 0.5 else max(0.06, Bs / 2 * (1 - ((f - 0.5) / 0.5) ** 1.8))
        x = -Ls / 2 + f * Ls
        zs = Fs + 0.8 * abs(f - 0.45)
        rows.append([(x, -h, zs), (x, -h * 0.95, 0.4), (x, -h * 0.5, -2.0), (x, 0, -2.5), (x, h * 0.5, -2.0), (x, h * 0.95, 0.4), (x, h, zs)])
    loft(name + 'hull', rows, hull_col)
    mesh_from(name + 'deck', [p for s in rows for p in (s[0], s[-1])], [(2 * j, 2 * j + 2, 2 * j + 3, 2 * j + 1) for j in range(len(rows) - 1)], DECK)
    box(name + 'band', -Ls / 2 + 1, -Bs / 2 - 0.05, Fs - 0.6, Ls / 2 - 5, Bs / 2 + 0.05, Fs - 0.35, '#d9d0bb' if hull_col != HULL else '#3a3a36')
    for mi, (fxm, hm, square) in enumerate(masts):
        x = -Ls / 2 + fxm * Ls
        cyl(f'{name}m{mi}', (x, 0, Fs), (x, 0, hm), 0.32, 0.12, SPAR, n=6)
        if square and yards:
            for yi, (zf, yl) in enumerate(((0.42, 0.9), (0.6, 0.75), (0.76, 0.58), (0.88, 0.42))):
                z = Fs + (hm - Fs) * zf
                cyl(f'{name}y{mi}{yi}', (x, -Bs * yl, z), (x, Bs * yl, z), 0.12, 0.12, SPAR, n=6)
                cyl(f'{name}f{mi}{yi}', (x + 0.15, -Bs * yl + 0.5, z - 0.2), (x + 0.15, Bs * yl - 0.5, z - 0.2), 0.22, 0.22, SAIL, n=6)
        else:
            cyl(f'{name}g{mi}', (x - 0.3, 0, Fs + (hm - Fs) * 0.62), (x - 0.3 - Ls * 0.22, 0, Fs + (hm - Fs) * 0.7), 0.1, 0.1, SPAR, n=6)
            cyl(f'{name}bm{mi}', (x - 0.3, 0, Fs + 1.2), (x - 0.3 - Ls * 0.26, 0, Fs + 1.4), 0.12, 0.12, SPAR, n=6)
            cyl(f'{name}bf{mi}', (x - 0.6, 0, Fs + 1.55), (x - Ls * 0.24, 0, Fs + 1.7), 0.25, 0.25, SAIL, n=6)
        for side in (-1, 1):
            line(f'{name}sh{mi}{side}', (x, side * 0.3, Fs + (hm - Fs) * 0.55), (x - 1.2, side * Bs / 2, Fs), 0.04)
    cyl(name + 'bsp', (Ls / 2 - 1, 0, Fs + 0.6), (Ls / 2 + Ls * 0.18, 0, Fs + 2.6), 0.22, 0.1, SPAR, n=6)
    line(name + 'stay', (-Ls / 2 + masts[0][0] * Ls, 0, masts[0][1] - 1), (Ls / 2 + Ls * 0.17, 0, Fs + 2.5), 0.04)
    e = empty(name, (0, 0, 0))
    adopt(e, b4)
    e.location = loc
    e.rotation_euler = (0, 0, rz)
    return e


sailing_ship('bark', 46.0, 9.0, 4.0, '#2f302d', [(0.78, 34.0, True), (0.52, 36.0, True), (0.26, 28.0, False)], (150.0, -20.0, 0.0), math.radians(180))
sailing_ship('schooner', 32.0, 7.0, 3.0, '#e5dfcf', [(0.62, 25.0, False), (0.36, 26.0, False)], (-200.0, -21.0, 0.0), 0.0)
sailing_ship('brig', 34.0, 8.0, 3.4, '#3a3530', [(0.7, 27.0, True), (0.38, 28.5, True)], (-300.0, -120.0, 0.0), math.radians(-20))

# ================================================================ the cutters, pulling for the landing
MARINE_COAT, MARINE_LEGS, WHITE_BELT = '#1d2438', '#6f85a2', '#ece6d6'
P = PG
P['COSTUMES']['marine'] = dict(coat=MARINE_COAT, skin='#d9b38f', hair='#4a3a2c', legs=MARINE_LEGS, shoes='#15171c',
                               parts=[('belt', 'Hips', lambda: P['band'](P['ZW'], 0.16), WHITE_BELT),
                                      ('cross', 'Spine2', P['sash'], WHITE_BELT),
                                      ('collar', 'Spine2', lambda: P['collar'](0.14), MARINE_COAT),
                                      ('buttons', 'Spine2', P['buttons'], '#c9a648'),
                                      ('cap', 'Head', P['peaked_cap'], '#1a2030'), ('peak', 'Head', P['visor'], '#111111')])
REACH = {'RightArm': (40, 0, -70), 'LeftArm': (40, 0, 70), 'RightForeArm': (0, 0, -20), 'LeftForeArm': (0, 0, 20)}
PULL = {'RightArm': (72, 0, 12), 'LeftArm': (72, 0, -12), 'RightForeArm': (0, 0, -95), 'LeftForeArm': (0, 0, 95)}
HOLD = {'RightArm': (80, 0, -12), 'RightForeArm': (0, 0, -88), 'LeftArm': (78, 0, 9), 'LeftForeArm': (0, 0, 40)}
HIPZ = 0.93                                                   # hip height above the soles (metres)
PERIOD = 2.3                                                  # one stroke, seconds
BOAT_V = 1.7                                                  # metres per second


def hand_pos(arm, side='Right'):
    bpy.context.view_layer.update()
    body = [o for o in arm.children if o.type == 'MESH' and o.data.vertices and len(o.vertex_groups) > 10][0]
    ev = body.evaluated_get(bpy.context.evaluated_depsgraph_get()).data
    gn = {g.index: g.name for g in body.vertex_groups}
    ids = [v.index for v in body.data.vertices if v.groups and gn[max(v.groups, key=lambda g: g.weight).group].startswith(side + 'Hand')]
    return body.matrix_world @ (sum((ev.vertices[i].co for i in ids), Vector()) / len(ids))


def seated(name, costume, boat, lx, ly, seat_z, heading, pose):
    """a seated figure in a boat: a pivot at the seat (it leans), the body hanging from it with the legs under the floor"""
    pv = empty(name + '_pv', (lx, ly, seat_z), boat)
    root, arm = person(name, costume, (0, 0, 0), heading)
    root.parent = pv
    root.location = (0, 0, -HIPZ)
    stand(arm, N, pose=pose, breathe=False)
    return pv, root, arm


CUTTERS = []


def cutter(name, start, heading, phase, crew, marines):
    """a 30-foot cutter, bow toward +y in its own frame: 4 double-banked thwarts of rowers, armed men in the stern sheets"""
    b4 = set(bpy.data.objects)
    bt = empty(name, (0, 0, 0))
    Lb, Bb = 9.0, 2.3
    small_hull(name + 'h', Lb, Bb, 0.78, '#e6e0cf', WOOD_DK)
    box(name + 'floor', -0.85, -3.6, 0.12, 0.85, 3.0, 0.2, '#8c7656')
    THW = [2.3, 1.15, 0.0, -1.15]
    for k, y in enumerate(THW):
        box(f'{name}th{k}', -1.05, y - 0.15, 0.38, 1.05, y + 0.15, 0.45, '#9a8462')
    box(name + 'sheets', -1.0, -4.1, 0.38, 1.0, -2.3, 0.45, '#9a8462')
    adopt(bt, b4)
    rowers, oars = [], []
    for k, y in enumerate(THW):
        for side in (-1, 1):
            pv, root, arm = seated(f'{name}r{k}{side}', crew, bt, side * 0.42, y, 0.46, 180, REACH)
            rowers.append((pv, arm, side))
            ol = empty(f'{name}ol{k}{side}', (side * 1.12, y - 0.45, 0.82), bt)
            dip = empty(f'{name}od{k}{side}', (0, 0, 0), ol)
            cyl(f'{name}oar{k}{side}', (-side * 1.15, 0, 0.02), (side * 3.0, 0, 0), 0.04, 0.035, '#c9b48a', n=4, parent=dip)
            box(f'{name}blade{k}{side}', min(side * 2.5, side * 3.4), -0.09, -0.02, max(side * 2.5, side * 3.4), 0.09, 0.02, '#c9b48a', parent=dip)
            oars.append((ol, dip, side))
    pas = []
    for k, (x, y, hd) in enumerate(((-0.62, -2.6, 90), (0.62, -2.6, -90), (-0.62, -3.4, 90), (0.62, -3.4, -90))):
        c = 'marine' if marines else 'sailor'
        pv, root, arm = seated(f'{name}p{k}', c, bt, x, y, 0.46, hd, HOLD)
        pas.append(arm)
    pv, root, arm = seated(f'{name}cox', 'officer', bt, 0.0, -4.0, 0.46, 0, {'RightArm': (80, 0, -30), 'RightForeArm': (0, 0, -40)})
    bt.location = start
    bt.rotation_euler = (0, 0, math.radians(heading))
    CUTTERS.append((bt, start, heading, phase, rowers, oars, pas))
    return bt


AH = 38.0                                                     # the course: toward the landing pier, north-west
CUT_START = [((-2.0, -128.0, 0.0), 0.0, 'sailor', False), ((14.0, -140.0, 0.0), 0.8, 'sailor', True), ((-18.0, -146.0, 0.0), 1.5, 'sailor', False)]
for i, (st, ph, crew, mar) in enumerate(CUT_START):
    cutter(f'cut{i}', st, AH, ph, crew, mar)
# a cutter still alongside at the ladder, half loaded
cutter('cut_l', tuple(on_ship((LX - 6.0, B / 2 + 3.2, 0.0))), math.degrees(BOS_R) + 180, 0.0, 'sailor', True)
CUTTERS[-1] = CUTTERS[-1][:3] + (None,) + CUTTERS[-1][4:]


def smooth(t):
    t = min(1.0, max(0.0, t))
    return t * t * (3 - 2 * t)


for bt, start, heading, phase, rowers, oars, pas in CUTTERS:
    a = math.radians(heading)
    dirv = Vector((-math.sin(a), math.cos(a), 0))
    for f, tq in enumerate(TQ):
        if phase is None:                                     # the loading boat lies still, oars tossed (upright)
            continue
        s = ((tq + phase) / PERIOD) % 1.0
        drive = s < 0.42
        p = smooth(s / 0.42) if drive else 1 - smooth((s - 0.42) / 0.58)
        d = BOAT_V * tq + 0.18 * math.sin(2 * math.pi * (tq + phase) / PERIOD)
        bt.location = Vector(start) + dirv * d + Vector((0, 0, 0.03 * math.sin(tq * 2.1 + phase)))
        bt.rotation_euler = (0.012 * math.sin(tq * 1.7 + phase), 0.01 * math.sin(tq * 1.3), a)
        bt.keyframe_insert('location', frame=f)
        bt.keyframe_insert('rotation_euler', frame=f)
        for pv, arm, side in rowers:
            pv.rotation_euler = (math.radians(20 * (1 - p) - 14 * p), 0, 0)
            pv.keyframe_insert('rotation_euler', frame=f)
            act = arm.animation_data.action
            for bn in REACH:
                for i in range(3):
                    fc = act.fcurves.find(f'pose.bones["{bn}"].rotation_euler', index=i)
                    v = REACH[bn][i] * (1 - p) + PULL[bn][i] * p
                    fc.keyframe_points.insert(f, math.radians(v)).interpolation = 'CONSTANT'
        for ol, dip, side in oars:
            ol.rotation_euler = (0, 0, side * math.radians(30 * (1 - p) - 26 * p))
            dip.rotation_euler = (0, side * (0.2 if drive else 0.05), 0)
            ol.keyframe_insert('rotation_euler', frame=f)
            dip.keyframe_insert('rotation_euler', frame=f)
    if phase is None:
        bt.location = start
        for ol, dip, side in oars:
            ol.rotation_euler = (0, 0, 0)
            dip.rotation_euler = (0, side * -1.35, 0)             # oars tossed upright
    for ob in [bt] + [r[0] for r in rowers] + [o[0] for o in oars] + [o[1] for o in oars]:
        if ob.animation_data and ob.animation_data.action:
            for fc in ob.animation_data.action.fcurves:
                for kp in fc.keyframe_points:
                    kp.interpolation = 'CONSTANT'
# rifles held upright by the men in the stern sheets
sc.frame_set(0)
for bt, start, heading, phase, rowers, oars, pas in CUTTERS:
    for k, arm in enumerate(pas):
        h = hand_pos(arm)
        loc = bt.matrix_world.inverted() @ h
        cyl(f'{bt.name}rs{k}', (loc.x, loc.y, 0.2), (loc.x, loc.y, loc.z + 0.1), 0.04, 0.032, '#5a4532', n=6, parent=bt)
        cyl(f'{bt.name}rb{k}', (loc.x, loc.y, loc.z + 0.05), (loc.x, loc.y, loc.z + 0.55), 0.016, 0.014, '#2b2622', n=6, parent=bt)
# people watching from the landing pier and the wharf
for k, (c, x, y, hd) in enumerate((('gentleman', -63.0, -60.0, 200), ('worker', -57.0, -58.5, 170), ('worker', -61.5, -55.0, 185),
                                   ('holoku', -66.0, -40.0, 190), ('gentleman', -48.0, -11.5, 200), ('worker', -40.0, -12.0, 160),
                                   ('officer', -59.5, -62.0, 180))):
    r_, a_ = person(f'onl{k}', c, (x, y, DZ), hd)
    stand(a_, N, k=k * 0.9)

# ---- palms sway (stepped at 12 fps)
for f, tq in enumerate(TQ):
    for ob, kind, ph, amp in CG['MOVERS']:
        ob.rotation_euler[1] = amp * math.sin(tq * (1.7 if kind == 'frond' else 1.1) + ph)
        ob.keyframe_insert('rotation_euler', frame=f)
for ob, *_ in CG['MOVERS']:
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'

# ---- light: a late-afternoon sun from the south-west, a bluer sky toward the top
sun = bpy.data.objects['sun']
sun.rotation_euler = (math.radians(63), 0, math.radians(-55))
sun.data.energy = 4.4
sun.data.color = (1.0, 0.92, 0.8)
sun.data.shadow_cascade_max_distance = 900
sun.data.shadow_cascade_count = 4
sun.data.shadow_cascade_exponent = 0.85
ramp = [n for n in sc.world.node_tree.nodes if n.type == 'VALTORGB'][0]
ramp.color_ramp.elements[0].color = lin('#86a9b3')
ramp.color_ramp.elements[1].color = lin('#e2ded0')
ramp.color_ramp.elements[1].position = 0.7

# ---- the finishing pass
LK = {'__name__': 'look'}
exec(compile(open(os.path.join(HERE, 'look.py')).read(), os.path.join(HERE, 'look.py'), 'exec'), LK)
LK['finish'](sc, fill_strength=0.7, haze=(250.0, 9000.0, 0.5), rules={
    WATER: (0.16, 0.012, None, 1.0), WATER_DK: (0.16, 0.012, None, 1.0), GLINT: (0.0, 0.1, None, 1.0), GLINT_DK: (0.0, 0.1, None, 1.0),
    HULL: (0.03, 0.15, None, 1.0), HULL_SH: (0.03, 0.15, None, 1.0), BUFF: (0.04, 0.5, None, 1.0),
    LAND: (0.14, 0.004, None, 1.0), MTN: (0.16, 0.0012, None, 1.0), ROCK: (0.12, 0.002, None, 1.0), MTN_DK: (0.12, 0.0008, None, 1.0), RIDGE: (0.14, 0.003, None, 1.0),
    CLOUD: (0.05, 0.003, None, 1.0), WOOD: (0.1, 0.25, None, 1.0), '#e6e0cf': (0.03, 0.4, None, 1.0)})

# the sky keeps its colour: the haze (mist pass) is mostly held off pixels at infinite depth
sc.view_layers[0].use_pass_z = True
ct = sc.node_tree
rl = [n for n in ct.nodes if n.type == 'R_LAYERS'][0]
mmul = [n for n in ct.nodes if n.type == 'MATH'][0]
mixn = [n for n in ct.nodes if n.type == 'MIX_RGB'][0]
gt = ct.nodes.new('CompositorNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = 30000.0
ct.links.new(rl.outputs['Depth'], gt.inputs[0])
k1 = ct.nodes.new('CompositorNodeMath'); k1.operation = 'MULTIPLY_ADD'; k1.inputs[1].default_value = -0.7; k1.inputs[2].default_value = 1.0
ct.links.new(gt.outputs[0], k1.inputs[0])
k2 = ct.nodes.new('CompositorNodeMath'); k2.operation = 'MULTIPLY'
ct.links.new(mmul.outputs[0], k2.inputs[0]); ct.links.new(k1.outputs[0], k2.inputs[1])
ct.links.new(k2.outputs[0], mixn.inputs['Fac'])

# ================================================================ cameras: H1 the harbor wide, H2 the cutters
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
cam.data.clip_start, cam.data.clip_end = 0.2, 40000
cam.data.lens = 45
KEYS = [  # frame, camera position, look-at; H1 pushes in slowly, H2 drifts with the boats
    (0, (55.0, -455.0, 15.0), (22.0, 0.0, 44.0)), (FB - 1, (52.0, -432.0, 15.2), (20.0, 0.0, 43.0)),
    (FB, (-58.0, -100.0, 2.3), (45.0, -175.0, 9.0)), (N - 1, (-60.0, -95.0, 2.4), (40.0, -178.0, 9.0))]
LENS = [(0, 45.0), (FB, 40.0)]
for f, pos, look in KEYS:
    cam.location = pos; cam.keyframe_insert('location', frame=f)
    tgt.location = look; tgt.keyframe_insert('location', frame=f)
for f, ln in LENS:
    cam.data.lens = ln
    cam.data.keyframe_insert('lens', frame=f)
for ob in (cam, tgt):
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT' if int(kp.co[0]) == FB - 1 else 'LINEAR'
for fc in cam.data.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = 'CONSTANT'
cam.data.dof.use_dof = True
cfc = {fc.array_index: fc for fc in cam.animation_data.action.fcurves if fc.data_path == 'location'}
for f in list(range(0, N, 6)) + [FB - 1, FB]:
    c = Vector([cfc[i].evaluate(f) for i in range(3)])
    subj = Vector((BOS_X, BOS_Y, 8.0)) if f < FB else CUTTERS[0][0].matrix_world.translation
    cam.data.dof.focus_distance = (subj - c).length if f < FB else 34.0
    cam.data.dof.aperture_fstop = 22.0 if f < FB else 5.6
    cam.data.dof.keyframe_insert('focus_distance', frame=f)
    cam.data.dof.keyframe_insert('aperture_fstop', frame=f)
for fc in cam.data.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = 'CONSTANT'

sc.render.resolution_percentage = SCALE
os.makedirs(OUT, exist_ok=True)
if MODE == 'wide':
    FR = [int(os.environ.get('FRAME', FB // 2))]
elif MODE == 'boats':
    FR = [int(os.environ.get('FRAME', FB + (N - FB) // 2))]
else:
    FR = [int(v) for v in os.environ['FRAMES'].split(',')] if os.environ.get('FRAMES') else range(N)
import time
for f in FR:
    sc.frame_set(f)
    sc.render.filepath = os.path.join(OUT, f'harbor_{MODE}.png' if MODE in ('wide', 'boats') else f'{f:04d}.png')
    t = time.time()
    bpy.ops.render.render(write_still=True)
    print('FRAME', f, round(time.time() - t, 2), flush=True)
