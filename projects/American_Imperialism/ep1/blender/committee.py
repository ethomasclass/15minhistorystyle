# Ep 1, chapter 6: the Committee of Safety. A Honolulu law office at night, January 1893, built in Blender after the Flow
# plate d2_committee_room: teal walls over dark wainscot, bookcases on three walls, a tall window with the night sky, the
# mountains and a palm in silhouette, and a brass oil lamp pooling warm light on a long table. Two states of the table:
# bare, and with rifles laid out on it in a row (the deadpan cut on "Safety").
# Shots, keyed to the chapter 6 narration (public/audio/ch06_the_heist.words.json); frame 0 is "In January":
#   K1  "In January 1893, they acted"     the empty office, the table bare, the lamp lit; a slow push down the table
#   K2  "Safety." (hard cut)              the same frame, the rifles now on the table; a snap zoom (lens 28 to 50 in 6
#                                         frames) onto the row of rifles, then a slow creep, held to "This one had help"
#   K3  "This one had help. The help"     join 16: the camera rises off the rifles to the tall window and flies out
#                                         through its upper-left pane, crossing the glass on "help" (the path is shared
#                                         with harbor.py through join16.py); from K3 on the night outside is hidden, so in
#                                         mode window the pane is transparent and the harbor is laid in behind it
# The lamp flickers on twos at 12 fps; the palm outside sways on the same steps.
#   xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python committee.py -- <out_dir> [scale%] [mode]
#   mode: a still, or several comma-separated: bare (K1), rifles_cut (K2's first frame), rifles (K2 after the zoom),
#         anim (render the frames in $FRAMES, "all" or a comma list, into <out_dir>/NNNN.png),
#         window (join 16: from a second before K3 to the crossing, every $STEP-th frame, with a transparent background,
#         into <out_dir>/window/NNNN.png; frame F_K3 here is frame 0 of harbor.py)
import bpy, bmesh, math, os, sys, random, time
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/committee'
SCALE = int(argv[1]) if len(argv) > 1 else 100
MODES = (argv[2] if len(argv) > 2 else 'rifles').split(',')
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


T0 = _wt('ch06_the_heist', 'In January 1893') - 0.05
T_CUT = _wt('ch06_the_heist', 'Safety') - 0.05
J16 = {'_wt': _wt, '__name__': 'join16'}
exec(compile(open(os.path.join(HERE, 'join16.py')).read(), os.path.join(HERE, 'join16.py'), 'exec'), J16)
T_END = J16['T_X'] + 2.0 / FPS                               # the room ends as the camera crosses the window (join 16)
F_CUT, N = int(round((T_CUT - T0) * FPS)), int(round((T_END - T0) * FPS))
F_K3 = int(round((J16['T_K3'] - T0) * FPS))
F_ZOOM = F_CUT + 7                                          # the snap zoom starts a beat after the cut
sc.frame_start, sc.frame_end = 0, N - 1
print('COMMITTEE TIMES', round(T0, 2), round(T_CUT, 2), round(T_END, 2), 'frames', F_CUT, N, 'K3 from', F_K3)

# ---- palette (from the plate)
WALL, WAIN, WAIN_DK = '#2c4744', '#3b2a1f', '#2c1f17'
FLOOR, FLOOR_DK = '#2a1f18', '#1f1712'
CASE, CASE_DK, CASE_BK = '#4d3524', '#3a281b', '#20160f'
TABLE, TABLE_DK = '#6a4329', '#4e3120'
LEATHER = '#28392d'
CHAIR, CHAIR_DK = '#5a3c26', '#3f2a1b'
BRASS, BRASS_DK = '#b8904a', '#8a6a34'
WOOD_R, STEEL, STEEL_DK = '#6e3a20', '#3b3d3f', '#2a2b2c'
mat(STEEL, 0.35), mat(STEEL_DK, 0.4), mat(BRASS, 0.3), mat(BRASS_DK, 0.4)                # a little shine on the metal
BOOKS = ['#6b2a22', '#5a2620', '#2e4a3a', '#24402f', '#6a4a2e', '#7c5a36', '#3a3a52', '#4a2c26']
GILT = '#b39550'


def boxes(name, items, col, parent=None):
    """many blocks in one mesh: items are (x0, y0, z0, x1, y1, z1[, lean]) with lean (radians) tipping the block
    sideways about its bottom corner on the side it leans to"""
    bm = bmesh.new()
    for it in items:
        x0, y0, z0, x1, y1, z1 = it[:6]
        lean = it[6] if len(it) > 6 else 0.0
        px = x1 if lean > 0 else x0
        vs = []
        for (x, y, z) in ((x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)):
            dx, dz = x - px, z - z0
            c, s = math.cos(lean), math.sin(lean)
            vs.append(bm.verts.new((px + dx * c + dz * s, y, z0 - dx * s + dz * c)))
        for f in ((0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)):
            bm.faces.new([vs[i] for i in f])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return CG['obj_from_bm'](name, bm, col, parent)


def emit(name, hexcol, strength=1.0, shadow=True):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    e = nt.nodes.new('ShaderNodeEmission')
    e.inputs['Color'].default_value = lin(hexcol)
    e.inputs['Strength'].default_value = strength
    o = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(e.outputs[0], o.inputs['Surface'])
    if not shadow:
        m.shadow_method = 'NONE'
    return m


def recolor(ob, m):
    ob.data.materials.clear()
    ob.data.materials.append(m)


# ---- the room: back wall at y = Y1, side walls at x = +-XW, floor and ceiling
XW, Y0, Y1, ZC = 4.6, -7.0, 5.0, 3.7
ZWAIN = 1.0                                                 # top of the dark wainscot
box('floor', -XW, Y0, -0.05, XW, Y1, 0.0, FLOOR)
boxes('planks', [(-XW, Y0, 0.0, -XW + 0.01, Y1, 0.004)] + [(-XW + k * 0.32, Y0, 0.0, -XW + k * 0.32 + 0.012, Y1, 0.004) for k in range(1, 29)], FLOOR_DK)
box('ceiling', -XW, Y0, ZC, XW, Y1 + 0.3, ZC + 0.1, '#1f2a28')
WX, WW, WZ0, WZ1 = -2.35, 1.25, 1.0, 3.15                   # the window on the back wall: centre x, width, sill, head
for (x0, x1) in ((-XW, WX - WW / 2), (WX + WW / 2, XW)):
    box(f'bwall{x0:.0f}', x0, Y1, 0, x1, Y1 + 0.2, ZC, WALL)
box('bwall_lo', WX - WW / 2, Y1, 0, WX + WW / 2, Y1 + 0.2, WZ0, WALL)
box('bwall_hi', WX - WW / 2, Y1, WZ1, WX + WW / 2, Y1 + 0.2, ZC, WALL)
for sx in (-1, 1):
    box(f'side{sx}', sx * XW - (0 if sx > 0 else 0.2), Y0, 0, sx * XW + (0.2 if sx > 0 else 0), Y1, ZC, WALL)
# wainscot and picture rail along the walls (the bookcases stand in front of most of it)
box('wain_b', -XW, Y1 - 0.04, 0, XW, Y1, ZWAIN, WAIN)
box('wcap_b', -XW, Y1 - 0.07, ZWAIN, XW, Y1, ZWAIN + 0.06, WAIN_DK)
box('skirt_b', -XW, Y1 - 0.06, 0, XW, Y1, 0.18, WAIN_DK)
for sx in (-1, 1):
    x = sx * XW
    box(f'wain{sx}', x - (0.04 if sx > 0 else 0), Y0, 0, x + (0 if sx > 0 else 0.04), Y1, ZWAIN, WAIN)
    box(f'wcap{sx}', x - (0.07 if sx > 0 else 0), Y0, ZWAIN, x + (0 if sx > 0 else 0.07), Y1, ZWAIN + 0.06, WAIN_DK)
box('prail_b', -XW, Y1 - 0.05, ZC - 0.35, XW, Y1, ZC - 0.3, WAIN_DK)
box('cornice_b', -XW, Y1 - 0.12, ZC - 0.14, XW, Y1, ZC, WAIN)
for sx in (-1, 1):
    box(f'cornice{sx}', sx * XW - (0.12 if sx > 0 else 0), Y0, ZC - 0.14, sx * XW + (0 if sx > 0 else 0.12), Y1, ZC, WAIN)

# ---- the window: a deep frame, four lights, the sill; outside, the night (an unlit sky, stars, mountains, a palm)
FR = WAIN
box('wframe_l', WX - WW / 2 - 0.12, Y1 - 0.08, WZ0 - 0.05, WX - WW / 2, Y1 + 0.2, WZ1 + 0.12, FR)
box('wframe_r', WX + WW / 2, Y1 - 0.08, WZ0 - 0.05, WX + WW / 2 + 0.12, Y1 + 0.2, WZ1 + 0.12, FR)
box('wframe_t', WX - WW / 2 - 0.16, Y1 - 0.1, WZ1, WX + WW / 2 + 0.16, Y1 + 0.2, WZ1 + 0.16, FR)
box('wsill', WX - WW / 2 - 0.2, Y1 - 0.16, WZ0 - 0.1, WX + WW / 2 + 0.2, Y1 + 0.2, WZ0, FR)
box('wapron', WX - WW / 2 - 0.12, Y1 - 0.06, WZ0 - 0.3, WX + WW / 2 + 0.12, Y1, WZ0 - 0.1, WAIN_DK)
box('wmull', WX - 0.03, Y1 + 0.08, WZ0, WX + 0.03, Y1 + 0.13, WZ1, FR)
box('wtran', WX - WW / 2, Y1 + 0.08, (WZ0 + WZ1) / 2 - 0.03, WX + WW / 2, Y1 + 0.13, (WZ0 + WZ1) / 2 + 0.03, FR)
box('wmeet', WX - WW / 2, Y1 + 0.13, (WZ0 + WZ1) / 2 - 0.05, WX + WW / 2, Y1 + 0.16, (WZ0 + WZ1) / 2 + 0.05, FR)
SKY_Y = Y1 + 5.0
bpy.ops.mesh.primitive_plane_add(size=1)
sky = bpy.context.active_object
sky.name = 'nightsky'
sky.scale = (16, 8, 1)
sky.rotation_euler = (math.radians(90), 0, 0)
sky.location = (WX, SKY_Y, 2.0)
sm = bpy.data.materials.new('nightsky')
sm.use_nodes = True
nt = sm.node_tree
for n in list(nt.nodes):
    nt.nodes.remove(n)
tco = nt.nodes.new('ShaderNodeTexCoord')
sep = nt.nodes.new('ShaderNodeSeparateXYZ')
rmp = nt.nodes.new('ShaderNodeValToRGB')
rmp.color_ramp.interpolation = 'CONSTANT'                   # painted bands of night, as in the plate
for pos, hx in ((0.0, '#3b5680'), (0.47, '#2f4872'), (0.53, '#263d66'), (0.6, '#1e3259'), (0.7, '#18284b')):
    el = rmp.color_ramp.elements.new(pos) if pos > 0.0 else rmp.color_ramp.elements[0]
    el.color = lin(hx)
rmp.color_ramp.elements.remove(rmp.color_ramp.elements[-1])
ems = nt.nodes.new('ShaderNodeEmission')
ems.inputs['Strength'].default_value = 1.0
out = nt.nodes.new('ShaderNodeOutputMaterial')
nt.links.new(tco.outputs['Generated'], sep.inputs[0])
nt.links.new(sep.outputs['Y'], rmp.inputs['Fac'])
nt.links.new(rmp.outputs['Color'], ems.inputs['Color'])
nt.links.new(ems.outputs[0], out.inputs['Surface'])
sky.data.materials.append(sm)
STAR = emit('star', '#f4efd8', 3.0)
rs = random.Random(5)
for k in range(14):
    x, z = WX - 1.5 + rs.uniform(-1.4, 1.4), rs.uniform(2.5, 3.7)
    s = ico(f'star{k}', (x, SKY_Y - 0.2, z), rs.uniform(0.018, 0.03), '#ffffff', 1)
    recolor(s, STAR)
MTN = emit('mtn', '#22355a', 1.0)
MTN2 = emit('mtn2', '#1a2a49', 1.0)
m1 = prism('mtn_far', [(-8, 0), (-8, 1.5), (-5, 2.0), (-3.2, 1.75), (-1.8, 2.3), (-0.6, 1.8), (0.8, 2.05), (3, 1.4), (8, 1.6), (8, 0)], SKY_Y - 1.0, SKY_Y - 0.9, '#000000')
recolor(m1, MTN)
m2 = prism('mtn_near', [(-8, 0), (-8, 1.2), (-4.5, 1.55), (-2.6, 1.25), (-1.2, 1.7), (0.4, 1.3), (3, 1.45), (8, 1.1), (8, 0)], SKY_Y - 2.0, SKY_Y - 1.9, '#000000')
recolor(m2, MTN2)
for ob in (m1, m2):
    ob.location.x = WX
PALM_M = emit('palmsil', '#0d1626', 1.0)
before = set(bpy.data.objects)
CG['palm'](WX - 0.7, Y1 + 3.0, 6.4, -0.1, 12, 4.4, 31)
bpy.data.objects['palm31'].scale = (0.4, 0.4, 0.4)           # (the kit's fronds have a fixed width: build big, scale down)
OUTSIDE = [o for o in bpy.data.objects if o not in before] + [sky, m1, m2] + [o for o in bpy.data.objects if o.name.startswith('star')]
for ob in set(bpy.data.objects) - before:
    if ob.type == 'MESH':
        recolor(ob, PALM_M)

# ---- the bookcases: a cabinet base with panelled doors, open shelves of books above, a cornice; built facing -y at the
# origin and turned into place


def bookcase(name, loc, rot_z, w, h=3.1, d=0.42, nsh=5, seed=0):
    root = empty(name, (0, 0, 0))
    rr = random.Random(seed)
    zb = 0.85                                               # top of the cabinet base
    box(name + 'sideL', -w / 2, 0, 0, -w / 2 + 0.06, d, h, CASE, root)
    box(name + 'sideR', w / 2 - 0.06, 0, 0, w / 2, d, h, CASE, root)
    box(name + 'back', -w / 2, d - 0.03, 0, w / 2, d, h, CASE_BK, root)
    box(name + 'corn', -w / 2 - 0.05, -0.05, h, w / 2 + 0.05, d + 0.02, h + 0.12, CASE, root)
    box(name + 'corn2', -w / 2 - 0.02, -0.02, h - 0.1, w / 2 + 0.02, d, h, CASE_DK, root)
    box(name + 'base', -w / 2, 0.0, 0, w / 2, d, zb, CASE, root)
    box(name + 'baset', -w / 2 - 0.03, -0.04, zb, w / 2 + 0.03, d, zb + 0.04, CASE, root)
    box(name + 'plinth', -w / 2 - 0.02, -0.02, 0, w / 2 + 0.02, d, 0.1, CASE_DK, root)
    ndoor = max(1, round(w / 0.55))
    dw = (w - 0.12) / ndoor
    boxes(name + 'doors', [(-w / 2 + 0.06 + k * dw + 0.05, -0.02, 0.18, -w / 2 + 0.06 + (k + 1) * dw - 0.05, 0.0, zb - 0.08) for k in range(ndoor)], CASE_DK, root)
    ncol = max(1, round(w / 0.95))
    cw = (w - 0.12) / ncol
    for c in range(1, ncol):
        box(f'{name}div{c}', -w / 2 + 0.06 + c * cw - 0.025, 0, zb, -w / 2 + 0.06 + c * cw + 0.025, d, h, CASE, root)
    sh_h = (h - 0.1 - zb) / nsh
    shelves, books, gilt = [], {c: [] for c in BOOKS}, []
    for k in range(1, nsh):
        z = zb + k * sh_h
        shelves.append((-w / 2 + 0.06, 0.0, z - 0.03, w / 2 - 0.06, d - 0.03, z))
    for k in range(nsh):
        z0 = zb + 0.04 if k == 0 else zb + k * sh_h
        for c in range(ncol):
            x = -w / 2 + 0.06 + c * cw + (0.03 if c else 0.0)
            xe = -w / 2 + 0.06 + (c + 1) * cw - 0.03
            while x < xe - 0.05:
                if rr.random() < 0.06:                      # a gap on the shelf
                    x += rr.uniform(0.06, 0.18)
                    continue
                bw = rr.uniform(0.035, 0.075)
                bh = min(sh_h - 0.06, rr.uniform(0.62, 0.9) * (sh_h - 0.04))
                bd = rr.uniform(0.2, 0.28)
                col = rr.choice(BOOKS)
                lean = 0.0
                if rr.random() < 0.05 and x + bw + 0.1 < xe:            # one leans on its neighbour
                    lean = -rr.uniform(0.18, 0.32)
                    x += bh * math.sin(-lean) * 0.9
                yf = rr.uniform(0.02, 0.06)
                books[col].append((x, yf, z0, x + bw, yf + bd, z0 + bh, lean))
                if lean == 0.0 and rr.random() < 0.7:
                    for zz in (0.12, 0.82) if rr.random() < 0.6 else (0.12,):
                        gilt.append((x + 0.004, yf - 0.004, z0 + bh * zz, x + bw - 0.004, yf, z0 + bh * zz + 0.012))
                x += bw + 0.002
    boxes(name + 'shelves', shelves, CASE, root)
    for col, it in books.items():
        if it:
            boxes(f'{name}bk{col}', it, col, root)
    if gilt:
        boxes(name + 'gilt', gilt, GILT, root)
    root.location = loc
    root.rotation_euler[2] = rot_z
    return root


bookcase('bc_b1', (-0.15, Y1 - 0.44, 0), 0, 1.9, seed=1)
bookcase('bc_b2', (1.85, Y1 - 0.44, 0), 0, 1.9, seed=2)
bookcase('bc_b3', (3.65, Y1 - 0.44, 0), 0, 1.6, seed=3)
bookcase('bc_l1', (-XW + 0.44, 3.4, 0), math.pi / 2, 1.9, seed=4)
bookcase('bc_l2', (-XW + 0.44, 1.4, 0), math.pi / 2, 1.9, seed=5)
bookcase('bc_l3', (-XW + 0.44, -0.6, 0), math.pi / 2, 1.9, seed=6)
bookcase('bc_r1', (XW - 0.44, 3.4, 0), -math.pi / 2, 1.9, seed=7)
bookcase('bc_r2', (XW - 0.44, 1.4, 0), -math.pi / 2, 1.9, seed=8)
bookcase('bc_r3', (XW - 0.44, -0.6, 0), -math.pi / 2, 1.9, seed=9)
# a framed document between the window and the bookcases (a law office: the diploma, the licence)
box('dipf', -1.62, Y1 - 0.04, 1.75, -1.18, Y1, 2.32, '#6a4a2a')
box('dip', -1.58, Y1 - 0.05, 1.79, -1.22, Y1 - 0.04, 2.28, '#bfb294')

# ---- the long table (running away from the camera), the chairs, the lamp
TX0, TX1, TY0, TY1, TZ = -0.95, 0.95, -1.6, 3.2, 0.78
box('tabletop', TX0, TY0, TZ - 0.06, TX1, TY1, TZ, TABLE)
box('inlay', TX0 + 0.12, TY0 + 0.12, TZ, TX1 - 0.12, TY1 - 0.12, TZ + 0.003, LEATHER)          # the green leather writing top
box('tedge', TX0 - 0.02, TY0 - 0.02, TZ - 0.1, TX1 + 0.02, TY1 + 0.02, TZ - 0.06, TABLE_DK)
box('apron', TX0 + 0.08, TY0 + 0.08, TZ - 0.22, TX1 - 0.08, TY1 - 0.08, TZ - 0.1, TABLE_DK)
for x in (TX0 + 0.1, TX1 - 0.2):
    for y in (TY0 + 0.1, (TY0 + TY1) / 2 - 0.05, TY1 - 0.2):
        box(f'tleg{x:.1f}{y:.1f}', x, y, 0, x + 0.1, y + 0.1, TZ - 0.22, TABLE_DK)
        box(f'tfoot{x:.1f}{y:.1f}', x - 0.015, y - 0.015, 0, x + 0.115, y + 0.115, 0.06, TABLE_DK)


def chair(name, cx, cy, rot_z):
    """a bentwood office armchair, built facing -y (back at +y) and turned into place"""
    root = empty(name, (0, 0, 0))
    box(name + 'seat', -0.25, -0.25, 0.44, 0.25, 0.25, 0.5, CHAIR, root)
    for dx in (-0.22, 0.18):
        for dy in (-0.22, 0.18):
            box(f'{name}l{dx}{dy}', dx, dy, 0, dx + 0.04, dy + 0.04, 0.44, CHAIR_DK, root)
    box(name + 'back', -0.25, 0.2, 0.5, 0.25, 0.25, 1.0, CHAIR, root)
    box(name + 'top', -0.27, 0.19, 0.95, 0.27, 0.27, 1.04, CHAIR_DK, root)
    for sx in (-1, 1):
        box(f'{name}arm{sx}', sx * 0.25 - 0.03, -0.22, 0.68, sx * 0.25 + 0.03, 0.25, 0.72, CHAIR_DK, root)
        box(f'{name}armp{sx}', sx * 0.25 - 0.02, -0.2, 0.5, sx * 0.25 + 0.02, -0.16, 0.7, CHAIR_DK, root)
    root.location = (cx, cy, 0)
    root.rotation_euler[2] = rot_z
    return root


for i, (y, a) in enumerate(((-0.6, 0.18), (1.0, -0.1), (2.5, 0.12))):
    chair(f'chR{i}', TX1 + 0.5, y, -math.pi / 2 + a)
for i, (y, a) in enumerate(((0.2, -0.15), (1.9, 0.08))):
    chair(f'chL{i}', TX0 - 0.5, y, math.pi / 2 + a)
chair('chEnd', 0.15, TY1 + 0.55, math.pi + 0.2)
# the brass oil lamp: an octagonal foot, a round font, the burner collar, a glass chimney and the flame
LX, LY = 0.42, 2.3
cyl('lfoot', (LX, LY, TZ), (LX, LY, TZ + 0.025), 0.085, 0.08, BRASS_DK, n=8)
cyl('lstem', (LX, LY, TZ + 0.025), (LX, LY, TZ + 0.07), 0.035, 0.03, BRASS, n=8)
cyl('lfont', (LX, LY, TZ + 0.07), (LX, LY, TZ + 0.13), 0.075, 0.085, BRASS, n=10)
cyl('lfont2', (LX, LY, TZ + 0.13), (LX, LY, TZ + 0.17), 0.085, 0.05, BRASS, n=10)
cyl('lcollar', (LX, LY, TZ + 0.17), (LX, LY, TZ + 0.2), 0.04, 0.045, BRASS_DK, n=8)
cyl('lkey', (LX + 0.03, LY - 0.02, TZ + 0.185), (LX + 0.075, LY - 0.05, TZ + 0.185), 0.008, 0.008, BRASS_DK, n=6)
GLOW = emit('chimney', '#ffd9a0', 2.2, shadow=False)
ch1 = cyl('lchim', (LX, LY, TZ + 0.2), (LX, LY, TZ + 0.27), 0.038, 0.058, '#ffffff', n=12)
ch2 = cyl('lchim2', (LX, LY, TZ + 0.27), (LX, LY, TZ + 0.42), 0.058, 0.03, '#ffffff', n=12)
for ob in (ch1, ch2):
    recolor(ob, GLOW)
FLM = emit('flame', '#fff1c8', 12.0, shadow=False)
fl = ico('lflame', (LX, LY, TZ + 0.245), 0.018, '#ffffff', 1, (1, 1, 2.0))
recolor(fl, FLM)
lp = bpy.data.lights.new('lamp', 'POINT')
lp.energy, lp.color, lp.shadow_soft_size = 320, (1.0, 0.72, 0.42), 0.02
lpo = bpy.data.objects.new('lamp', lp)
sc.collection.objects.link(lpo)
lpo.location = (LX, LY, TZ + 0.3)
pl = bpy.data.lights.new('lamppool', 'SPOT')                # the pool on the table, as the plate paints it: a soft cone
pl.energy, pl.color, pl.spot_size, pl.spot_blend, pl.shadow_soft_size = 700, (1.0, 0.74, 0.46), math.radians(62), 0.7, 0.05
plo = bpy.data.objects.new('lamppool', pl)
sc.collection.objects.link(plo)
plo.location = (LX - 0.2, LY - 1.0, TZ + 1.9)
plo.rotation_euler = (math.radians(-14), math.radians(-5), 0)
bl = bpy.data.lights.new('lampbody', 'POINT')               # the flame's light on the lamp's own brass, from the front
bl.energy, bl.color, bl.shadow_soft_size = 6, (1.0, 0.75, 0.45), 0.05
blo = bpy.data.objects.new('lampbody', bl)
sc.collection.objects.link(blo)
blo.location = (LX - 0.12, LY - 0.3, TZ + 0.25)
# moonlight through the window: a cool rectangle of light falling into the room, and a dim cool fill from the window wall
ml = bpy.data.lights.new('moon', 'AREA')
ml.energy, ml.size, ml.color = 60, 1.2, (0.55, 0.68, 1.0)
mlo = bpy.data.objects.new('moon', ml)
sc.collection.objects.link(mlo)
mlo.location = (WX + 0.4, Y1 + 1.2, WZ1 + 0.6)
mlo.rotation_euler = (math.radians(-38), 0, math.radians(-6))
bpy.data.objects['sun'].data.energy = 0.0                   # indoors at night: no sun

# ---- the rifles (the second state): eight rifles laid across the table in a row, butts to the left, and two paper
# cartridge boxes. Each is built along +x with its sights up, then laid on its side


def rifle(name, x, y, yaw, flip=False):
    root = empty(name, (0, 0, 0))
    st = prism(name + 'stock', [(0.0, 0.04), (0.0, -0.1), (0.05, -0.095), (0.3, -0.03), (0.35, -0.012), (0.42, -0.016),
                                (0.5, -0.016), (0.53, -0.004), (0.94, 0.004), (0.96, 0.014), (0.96, 0.026), (0.52, 0.026),
                                (0.4, 0.024), (0.34, 0.012), (0.2, 0.03), (0.05, 0.04)][::-1], -0.021, 0.021, WOOD_R)
    st.parent = root
    cyl(name + 'barrel', (0.38, 0, 0.036), (1.22, 0, 0.036), 0.012, 0.011, STEEL, n=8, parent=root)
    box(name + 'recv', 0.36, -0.017, 0.0, 0.52, 0.017, 0.05, STEEL, root)
    box(name + 'hammer', 0.375, -0.006, 0.05, 0.395, 0.006, 0.075, STEEL_DK, root)
    box(name + 'trig', 0.43, -0.004, -0.045, 0.44, 0.004, -0.02, STEEL_DK, root)
    box(name + 'guard', 0.40, -0.006, -0.05, 0.49, 0.006, -0.042, STEEL, root)
    box(name + 'guard2', 0.40, -0.006, -0.05, 0.408, 0.006, -0.02, STEEL, root)
    box(name + 'butt', -0.006, -0.022, -0.086, 0.0, 0.022, 0.036, STEEL_DK, root)
    for bx in (0.74, 0.98):
        box(f'{name}band{bx}', bx - 0.01, -0.024, -0.006, bx + 0.01, 0.024, 0.05, STEEL, root)
    box(name + 'sight', 1.19, -0.003, 0.046, 1.2, 0.003, 0.058, STEEL_DK, root)
    box(name + 'rsight', 0.56, -0.006, 0.046, 0.6, 0.006, 0.056, STEEL_DK, root)
    cyl(name + 'rod', (0.55, 0, -0.012), (1.2, 0, -0.012), 0.004, 0.004, STEEL_DK, n=4, parent=root)
    root.rotation_euler = (math.radians(90 if not flip else -90), 0, yaw)
    root.location = (x, y, TZ + 0.028)
    return root


RIFLES = []
rr = random.Random(8)
for k in range(8):
    y = -1.25 + k * 0.38
    RIFLES.append(rifle(f'rifle{k}', -0.6 + rr.uniform(-0.03, 0.03), y, math.radians(rr.uniform(-2.5, 2.5))))
for k, (x, y, a) in enumerate(((0.55, 1.85, 8), (0.3, 1.95, -14))):
    b = box(f'cbox{k}', -0.07, -0.045, 0, 0.07, 0.045, 0.05, '#b9a57a')
    l = box(f'cboxl{k}', -0.071, -0.03, 0.012, 0.071, 0.03, 0.038, '#e3d8bd', b)
    b.location, b.rotation_euler[2] = (x, y, TZ), math.radians(a)
    RIFLES += [b, l]
STATE2 = []
for r in RIFLES:
    STATE2.append(r)
    STATE2 += list(r.children_recursive)
# a few loose papers and an inkstand on the bare table (moved aside to make room for the rifles in the second state)
PAPER = '#d8cdb0'
for i, (x, y, a) in enumerate(((-0.35, 0.3, 8), (0.25, -0.5, -10), (0.45, 1.25, 5))):
    p = box(f'paper{i}', x - 0.15, y - 0.2, TZ + 0.003, x + 0.15, y + 0.2, TZ + 0.007, PAPER)
    p.rotation_euler[2] = math.radians(a)
box('inkstand', -0.55, 2.7, TZ, -0.25, 2.9, TZ + 0.03, '#2a2420')
cyl('inkwell', (-0.45, 2.8, TZ + 0.03), (-0.45, 2.8, TZ + 0.08), 0.03, 0.025, '#1f2a2a', n=8)
STATE1 = [bpy.data.objects[f'paper{i}'] for i in range(3)]
for ob in STATE2:
    ob.hide_render = True; ob.keyframe_insert('hide_render', frame=0)
    ob.hide_render = False; ob.keyframe_insert('hide_render', frame=F_CUT)
for ob in STATE1:
    ob.hide_render = False; ob.keyframe_insert('hide_render', frame=0)
    ob.hide_render = True; ob.keyframe_insert('hide_render', frame=F_CUT)
for ob in OUTSIDE:                                          # K3: the painted night goes, the harbor is laid in behind the glass
    ob.hide_render = False; ob.keyframe_insert('hide_render', frame=0)
    ob.hide_render = True; ob.keyframe_insert('hide_render', frame=F_K3)

# ---- the lamp's flicker and the palm's sway, both stepped at 12 fps
rf = random.Random(3)
for f in range(0, N, 1):
    tq = math.floor(f / FPS * 12) / 12
    if f == 0 or math.floor(f / FPS * 12) != math.floor((f - 1) / FPS * 12):
        fk = 1 + 0.05 * math.sin(tq * 9.1) + rf.uniform(-0.04, 0.04)
        lp.energy, pl.energy = 320 * fk, 700 * fk
        lp.keyframe_insert('energy', frame=f)
        pl.keyframe_insert('energy', frame=f)
    for ob, kind, ph, amp in CG['MOVERS']:
        ob.rotation_euler[1] = amp * math.sin(tq * (1.7 if kind == 'frond' else 1.1) + ph)
        ob.keyframe_insert('rotation_euler', frame=f)
for ob in [o for o, *_ in CG['MOVERS']] + [lp, pl]:
    ad = ob.animation_data
    for fc in ad.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'

# ---- the finishing pass, then the camera
LK = {'__name__': 'look'}
exec(compile(open(os.path.join(HERE, 'look.py')).read(), os.path.join(HERE, 'look.py'), 'exec'), LK)
LK['finish'](sc, fill_strength=0.6, shadow_fill='#4f7a76', haze=(60.0, 400.0, 0.0), rules={
    WALL: (0.10, 0.7, None, 1.0), WAIN: (0.08, 0.9, None, 1.0), FLOOR: (0.10, 0.6, None, 1.0), TABLE: (0.08, 1.1, None, 1.0), LEATHER: (0.12, 1.5, None, 1.0),
    CASE: (0.08, 1.0, None, 1.0), CASE_DK: (0.08, 1.0, None, 1.0), WOOD_R: (0.06, 3.0, None, 1.0), PAPER: (0.03, 2.0, None, 1.0)})
ee = sc.eevee
ee.use_bloom, ee.bloom_threshold, ee.bloom_intensity, ee.bloom_radius = True, 1.2, 0.06, 5.0
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
# K1: down the table from its near end, a little above eye level, as in the plate; a slow push
# K2: the same frame on the cut, then the snap zoom onto the row of rifles and a creep in
A_POS, A_LOOK = (0.85, -5.6, 2.05), (-0.55, 3.6, 0.95)
B_POS, B_LOOK = (0.6, -4.7, 1.95), (-0.45, 3.6, 0.98)
Z_LOOK = (0.05, 0.5, 0.78)
KEYS = [(0, A_POS, A_LOOK, 28), (F_CUT - 1, B_POS, B_LOOK, 28), (F_CUT, A_POS, A_LOOK, 28), (F_ZOOM, A_POS, A_LOOK, 28),
        (F_ZOOM + 6, (0.55, -3.1, 2.85), Z_LOOK, 40), (F_K3, (0.6, -3.35, 2.8), (0.05, 0.55, 0.78), 43)]
for f in range(F_K3 + 1, N):                                # K3, every frame from the shared path
    p_, l_, ln_ = J16['room'](T0 + f / FPS)
    KEYS.append((f, tuple(p_), tuple(l_), ln_))
for f, pos, look, lens in KEYS:
    cam.location = pos; cam.keyframe_insert('location', frame=f)
    tgt.location = look; tgt.keyframe_insert('location', frame=f)
    cam.data.lens = lens; cam.data.keyframe_insert('lens', frame=f)
for ad in (cam.animation_data, tgt.animation_data, cam.data.animation_data):
    for fc in ad.action.fcurves:
        for kp in fc.keyframe_points:
            f = int(kp.co[0])
            kp.interpolation = 'CONSTANT' if f in (F_CUT - 1, F_CUT) else ('LINEAR' if f in (0, F_ZOOM + 6) or f >= F_K3 else 'BEZIER')
            if f == F_ZOOM:
                kp.interpolation = 'EXPO'                    # the snap: fast out of the start, settling onto the rifles
                kp.easing = 'EASE_OUT'
cam.data.dof.use_dof = True
cam.data.dof.aperture_fstop = 2.2
for f, d in ((0, 6.6), (F_CUT, 6.6), (F_ZOOM, 6.6), (F_ZOOM + 6, 3.95), (F_K3, 4.15)):
    cam.data.dof.focus_distance = d
    cam.data.dof.keyframe_insert('focus_distance', frame=f)
cam.data.dof.keyframe_insert('aperture_fstop', frame=F_K3)
for f in range(F_K3 + 1, N):                                # K3: focus follows the window, stopping down a little
    p_, l_, ln_ = J16['room'](T0 + f / FPS)
    u_ = (f - F_K3) / max(1, N - 1 - F_K3)
    cam.data.dof.focus_distance = max(0.3, min(4.15 + u_ * 3, (J16['PANE'] - p_).length))
    cam.data.dof.aperture_fstop = 2.2 + 3.4 * min(1.0, u_ * 1.5)
    cam.data.dof.keyframe_insert('focus_distance', frame=f)
    cam.data.dof.keyframe_insert('aperture_fstop', frame=f)
cam.data.clip_start = 0.03
sc.render.resolution_percentage = SCALE
os.makedirs(OUT, exist_ok=True)
STILL = {'bare': F_CUT // 2, 'rifles_cut': F_CUT + 2, 'rifles': F_ZOOM + 20}
for mode in MODES:
    if mode == 'anim':
        fr = os.environ.get('FRAMES', '')
        frames = range(N) if fr == 'all' else [int(v) for v in fr.split(',') if v]
        paths = [(f, os.path.join(OUT, f'{f:04d}.png')) for f in frames]
    elif mode == 'window':
        sc.render.film_transparent = True
        sc.render.image_settings.color_mode = 'RGBA'
        paths = [(f, os.path.join(OUT, 'window', f'{f:04d}.png')) for f in range(int(os.environ.get('FROM', F_K3 - 16)), N, int(os.environ.get('STEP', '1')))]
    else:
        paths = [(STILL[mode], os.path.join(OUT, f'committee_{mode}.png'))]
    for f, p in paths:
        if os.path.exists(p) and os.path.getsize(p) > 0 and not os.environ.get('FORCE'):   # resumable: keep frames already written
            continue
        sc.frame_set(f)
        sc.render.filepath = p
        t = time.time()
        bpy.ops.render.render(write_still=True)
        print('FRAME', mode, f, round(time.time() - t, 2), 's', flush=True)
