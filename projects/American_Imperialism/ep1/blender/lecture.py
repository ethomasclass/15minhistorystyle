# Ep 1, chapter 4: the "Scientist." An 1880s lecture hall, built in Blender after the Flow plate c8_lecture_hall_1880s:
# tiered benches curving round a low stage, a lectern, a large chart on an easel, the lecturer (costume 'lecturer') with a
# pointer at the chart, gas lamps on the walls, tall windows with dark green curtains and late sun slanting through them.
# Two states of the chart: a simple diagram (a stem that climbs to an arrow, the side branches stopped short), and blank.
# Shots, keyed to the chapter 4 narration (public/audio/ch04_the_pitch_meeting.words.json). The timeline holds the shots
# back to back; each starts on its word:
#   L1  "The 'Scientist.'"     (to "Herbert")    the hall from the top of the benches, the lecturer at his chart; a slow
#                                                push (this frame is the picture on the pitch-room easel the camera flies into)
#   L2  "It sounded like"      (to "It wasn't")  the lecturer and the chart from the front benches; his pointer climbs the
#                                                red stem on twos
#   L3  "It wasn't."           (to "The Preacher") hard cut, the same frame: the chart is blank, the pointer stopped
#   xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python lecture.py -- <out_dir> [scale%] [mode]
#   mode: a still, or several comma-separated: wide (L1), chart (L2), blank (L3), anim (the frames in $FRAMES)
import bpy, bmesh, math, os, sys, random, time
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/lecture'
SCALE = int(argv[1]) if len(argv) > 1 else 100
MODES = (argv[2] if len(argv) > 2 else 'chart').split(',')
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


CH = 'ch04_the_pitch_meeting'
SHOTS = [('L1', _wt(CH, 'The Scientist') - 0.05, _wt(CH, 'Herbert Spencer') - 0.05),
         ('L2', _wt(CH, 'It sounded like') - 0.05, _wt(CH, "It wasn't") - 0.05),
         ('L3', _wt(CH, "It wasn't") - 0.05, _wt(CH, 'The Preacher and') - 0.05)]
FS = {}
f = 0
for name, t0, t1 in SHOTS:
    n = int(round((t1 - t0) * FPS))
    FS[name] = (f, f + n)
    print('SHOT', name, 'narration', round(t0, 2), 'to', round(t1, 2), 'frames', f, f + n - 1)
    f += n
N = f
sc.frame_start, sc.frame_end = 0, N - 1

# ---- palette (from the plate)
WALL, WALL_LT, WAIN, WAIN_DK = '#6b604c', '#7c7058', '#4a3320', '#36251a'
FLOOR, STEP = '#34382c', '#3f4234'
BENCH, BENCH_LT, BENCH_DK = '#8a5a2e', '#9c6a36', '#5e3d22'
STAGE, STAGE_DK = '#7a5230', '#5a3b22'
CURT, CURT_DK, CURT_LT = '#1f4a2c', '#163a22', '#2a5a36'
BOARD, FRAMEW = '#2c3e30', '#5a3b22'
BRASS = '#a8843f'


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


def arc_block(bm, c, r0, r1, a0, a1, z0, z1, n=None):
    """an annular sector (angles in degrees, 0 = toward -y from the centre c, positive toward +x), from z0 to z1"""
    n = n or max(3, int(abs(a1 - a0) / 6))
    rings = []
    for (r, z) in ((r0, z0), (r1, z0), (r1, z1), (r0, z1)):
        rings.append([bm.verts.new((c[0] + r * math.sin(math.radians(a0 + (a1 - a0) * k / n)),
                                    c[1] - r * math.cos(math.radians(a0 + (a1 - a0) * k / n)), z)) for k in range(n + 1)])
    for i in range(4):
        A, B = rings[i], rings[(i + 1) % 4]
        for k in range(n):
            bm.faces.new((A[k], A[k + 1], B[k + 1], B[k]))
    bm.faces.new([rings[i][0] for i in range(4)])
    bm.faces.new([rings[i][n] for i in range(4)][::-1])


def arc_obj(name, parts, col):
    bm = bmesh.new()
    for p in parts:
        arc_block(bm, *p)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return CG['obj_from_bm'](name, bm, col)


# ---- the room: the front (stage) wall at y = YF, the back wall behind the top bench at y = YB, the window wall at x = XL
XL, XR, YB, YF, ZC = -8.6, 9.6, -7.6, 8.0, 7.2
C = (0.5, 4.6)                                              # the centre the benches curve round
box('floor', XL, YB, -0.05, XR, YF, 0.0, FLOOR)
box('ceiling', XL - 0.3, YB - 0.3, ZC, XR + 0.3, YF + 0.3, ZC + 0.2, '#3a3428')
for k in range(9):                                          # ceiling beams
    y = YB + 0.8 + k * (YF - YB - 1.6) / 8
    box(f'beam{k}', XL, y - 0.15, ZC - 0.35, XR, y + 0.15, ZC, WAIN_DK)
box('wall_f', XL, YF, 0, XR, YF + 0.3, ZC, WALL)
box('wall_b', XL, YB - 0.3, 0, XR, YB, ZC, WALL)
box('wall_r', XR, YB - 0.3, 0, XR + 0.3, YF + 0.3, ZC, WALL)
WINS = [-5.6, -2.0, 1.6, 5.2]                               # window centres along the left wall (y)
WW, WZ0, WZ1 = 1.3, 1.9, 5.9
ys = [YB - 0.3] + [v for c in WINS for v in (c - WW / 2, c + WW / 2)] + [YF + 0.3]
for i in range(0, len(ys), 2):
    box(f'wall_l{i}', XL - 0.4, ys[i], 0, XL, ys[i + 1], ZC, WALL)
for c in WINS:
    box(f'wl_lo{c}', XL - 0.4, c - WW / 2, 0, XL, c + WW / 2, WZ0, WALL)
    box(f'wl_hi{c}', XL - 0.4, c - WW / 2, WZ1, XL, c + WW / 2, ZC, WALL)
# wainscot on every wall
for (x0, y0, x1, y1) in ((XL, YF - 0.05, XR, YF), (XL, YB, XR, YB + 0.05), (XR - 0.05, YB, XR, YF), (XL, YB, XL + 0.05, YF)):
    box(f'wain{x0:.0f}{y0:.0f}', x0, y0, 0, x1, y1, 1.3, WAIN)
    box(f'wcap{x0:.0f}{y0:.0f}', x0 - (0.03 if x1 - x0 < 1 else 0), y0 - (0.03 if y1 - y0 < 1 else 0), 1.3, x1, y1, 1.38, WAIN_DK)
    box(f'cor{x0:.0f}{y0:.0f}', x0 - (0.1 if x1 - x0 < 1 else 0), y0 - (0.1 if y1 - y0 < 1 else 0), ZC - 0.5, x1, y1, ZC - 0.35, WAIN_DK)
# the windows: deep reveals, glazing bars, a bright late-afternoon sky outside; heavy curtains in folds, a pelmet
SKYM = emit('sky', '#f1e6c6', 1.6)
for c in WINS:
    s_ = box(f'sky{c}', XL - 3.0, c - WW, WZ0 - 1.0, XL - 2.95, c + WW, WZ1 + 1.0, '#ffffff')
    recolor(s_, SKYM)
    box(f'wsill{c}', XL - 0.4, c - WW / 2 - 0.1, WZ0 - 0.08, XL + 0.12, c + WW / 2 + 0.1, WZ0, WAIN)
    for yy in (c - 0.025,):
        box(f'wmul{c}', XL - 0.25, yy, WZ0, XL - 0.2, yy + 0.05, WZ1, '#d8cfb4')
    for k in range(1, 6):
        z = WZ0 + k * (WZ1 - WZ0) / 6
        box(f'wbar{c}{k}', XL - 0.25, c - WW / 2, z - 0.025, XL - 0.2, c + WW / 2, z + 0.025, '#d8cfb4')
    box(f'pelmet{c}', XL, c - WW / 2 - 0.6, WZ1 + 0.1, XL + 0.25, c + WW / 2 + 0.6, WZ1 + 0.5, WAIN_DK)
    for sy in (-1, 1):
        for k in range(4):
            y = c + sy * (WW / 2 + 0.05 + k * 0.14)
            col = (CURT, CURT_DK, CURT_LT, CURT_DK)[k]
            box(f'curt{c}{sy}{k}', XL + 0.02 + 0.05 * (k % 2), y - 0.09, 0.0, XL + 0.18 + 0.05 * (k % 2), y + 0.09, WZ1 + 0.12, col)
# the gas lamps: a bracket from the wall, a glass lantern with its flame, a brass cap; a warm light against the wall
GLASSL = emit('gaslight', '#ffcf86', 3.0, shadow=False)
GASL = []


def gas_lamp(name, p, out):
    """p: the wall point; out: unit vector into the room"""
    p, o = Vector(p), Vector(out)
    cyl(name + 'arm', p, p + o * 0.35 + Vector((0, 0, 0.05)), 0.02, 0.018, BRASS, n=6)
    q = p + o * 0.38
    cyl(name + 'cup', q + Vector((0, 0, -0.05)), q + Vector((0, 0, 0.04)), 0.04, 0.07, BRASS, n=8)
    g = cyl(name + 'glass', q + Vector((0, 0, 0.04)), q + Vector((0, 0, 0.3)), 0.08, 0.1, '#ffffff', n=8)
    recolor(g, GLASSL)
    cyl(name + 'cap', q + Vector((0, 0, 0.3)), q + Vector((0, 0, 0.4)), 0.11, 0.03, BRASS, n=8)
    lt = bpy.data.lights.new(name, 'POINT')
    lt.energy, lt.color, lt.shadow_soft_size = 45, (1.0, 0.74, 0.42), 0.05
    lo = bpy.data.objects.new(name, lt)
    sc.collection.objects.link(lo)
    lo.location = q + Vector((0, 0, 0.18)) + o * 0.02
    GASL.append(lt)


for i, y in enumerate((-3.8, -0.2, 3.4, 6.7)):
    gas_lamp(f'gasL{i}', (XL, y, 3.7), (1, 0, 0))
for i, x in enumerate((-4.6, 7.6)):
    gas_lamp(f'gasF{i}', (x, YF, 3.4), (0, -1, 0))
for i, y in enumerate((-4.5, 0.5)):
    gas_lamp(f'gasR{i}', (XR, y, 3.7), (-1, 0, 0))
# the chalkboard on the front wall behind the stage, in a wooden frame with a chalk ledge
box('board_f', -0.6, YF - 0.06, 1.55, 6.9, YF, 4.35, FRAMEW)
box('board', -0.48, YF - 0.08, 1.67, 6.78, YF - 0.06, 4.23, BOARD)
box('ledge', -0.6, YF - 0.18, 1.5, 6.9, YF - 0.06, 1.58, FRAMEW)
for k, x in enumerate((0.6, 4.9)):                           # old chalk ghosts on the board
    box(f'chalk{k}', x, YF - 0.085, 3.3 - 0.4 * k, x + 1.1 - 0.3 * k, YF - 0.08, 3.33 - 0.4 * k, '#56685a')
box('door_f', 7.6, YF - 0.06, 0, 8.9, YF, 2.6, WAIN_DK)
box('door', 7.7, YF - 0.08, 0, 8.8, YF - 0.06, 2.5, WAIN)

# ---- the stage: a low platform with cut corners, two steps down at the front
SZ = 0.45
pts = [(-3.0, YF), (-3.0, 4.3), (-2.3, 3.4), (3.6, 3.4), (4.3, 4.3), (4.3, YF)]
bm = bmesh.new()
lo_ = [bm.verts.new((x, y, 0)) for x, y in pts]
hi_ = [bm.verts.new((x, y, SZ)) for x, y in pts]
bm.faces.new(lo_[::-1]); bm.faces.new(hi_)
for i in range(len(pts)):
    bm.faces.new((lo_[i], lo_[(i + 1) % len(pts)], hi_[(i + 1) % len(pts)], hi_[i]))
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
CG['obj_from_bm']('stage', bm, STAGE)
box('stage_lip', -2.3, 3.36, SZ - 0.06, 3.6, 3.42, SZ, STAGE_DK)
box('step1', -0.1, 2.9, 0, 1.3, 3.4, SZ * 0.5, STAGE_DK)
box('step2', -0.1, 3.15, SZ * 0.5, 1.3, 3.4, SZ, STAGE_DK)

# ---- the benches: seven tiers round the stage, each a step up from the last, with a curved bench and a writing ledge in
# front; an aisle up the middle. The tier floors run out to the walls (clipped to the room)
NT, R0, DR, DZ = 7, 4.7, 1.08, 0.36
floors, seats, backs, desks, fronts = [], [], [], [], []
for k in range(NT):
    r = R0 + k * DR
    z = (k + 1) * DZ
    outer = r + DR * 0.5 if k < NT - 1 else r + 9.0
    floors.append((C, r - DR * 0.5, outer, -78, 78, 0.0, z, 26))
    for side in (-1, 1):
        ag = math.degrees(math.asin(0.55 / r))               # the aisle
        wall_x = (C[0] - XL - 0.4) if side < 0 else (XR - C[0] - 0.4)
        am = min(72.0, math.degrees(math.asin(min(1.0, wall_x / (r + 0.5)))))
        a0, a1 = (ag, am) if side > 0 else (-am, -ag)
        seats.append((C, r + 0.02, r + 0.42, a0, a1, z, z + 0.45))
        backs.append((C, r + 0.4, r + 0.5, a0, a1, z + 0.45, z + 0.95))
        desks.append((C, r - 0.5, r - 0.16, a0, a1, z + 0.74, z + 0.8))
        fronts.append((C, r - 0.5, r - 0.44, a0, a1, z, z + 0.74))
tiers = arc_obj('tiers', floors, STEP)
roomclip = box('roomclip', XL + 0.01, YB + 0.01, -1, XR - 0.01, 3.0, 5, '#ff00ff')
roomclip.hide_render = True
roomclip.display_type = 'WIRE'
bmod = tiers.modifiers.new('clip', 'BOOLEAN')
bmod.operation, bmod.object, bmod.solver = 'INTERSECT', roomclip, 'EXACT'
arc_obj('seats', seats, BENCH_LT)
arc_obj('backs', backs, BENCH)
arc_obj('desks', desks, BENCH_LT)
arc_obj('fronts', fronts, BENCH_DK)

# ---- the lectern, the easel and the chart
LX_, LY_ = -1.0, 5.0
box('lect_base', LX_ - 0.42, LY_ - 0.32, SZ, LX_ + 0.42, LY_ + 0.32, SZ + 0.12, STAGE_DK)
box('lect_body', LX_ - 0.32, LY_ - 0.24, SZ + 0.12, LX_ + 0.32, LY_ + 0.24, SZ + 1.0, STAGE)
box('lect_panel', LX_ - 0.24, LY_ - 0.26, SZ + 0.25, LX_ + 0.24, LY_ - 0.24, SZ + 0.88, STAGE_DK)
mesh_from('lect_top', [(LX_ - 0.4, LY_ - 0.34, SZ + 1.02), (LX_ + 0.4, LY_ - 0.34, SZ + 1.02), (LX_ + 0.4, LY_ + 0.3, SZ + 1.2),
                       (LX_ - 0.4, LY_ + 0.3, SZ + 1.2), (LX_ - 0.4, LY_ - 0.34, SZ + 0.96), (LX_ + 0.4, LY_ - 0.34, SZ + 0.96),
                       (LX_ + 0.4, LY_ + 0.3, SZ + 0.96), (LX_ - 0.4, LY_ + 0.3, SZ + 0.96)],
          [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)], STAGE)
box('lect_book', LX_ - 0.2, LY_ - 0.15, SZ + 1.07, LX_ + 0.2, LY_ + 0.12, SZ + 1.12, '#5a2620').rotation_euler[0] = math.radians(-15)
EX, EY, EA = 2.0, 6.7, math.radians(-12)                    # the easel: centre, and its turn toward the benches
CW, CHT, CZ = 1.36, 1.7, SZ + 0.95                          # the chart: width, height, bottom edge
easel = empty('easel', (0, 0, 0))
for sx in (-1, 1):
    cyl(f'eleg{sx}', (sx * 0.62, 0.08, SZ), (sx * 0.2, 0.08, CZ + CHT + 0.3), 0.03, 0.025, FRAMEW, n=6, parent=easel)
cyl('eleg_b', (0, 0.85, SZ), (0, 0.12, CZ + CHT + 0.15), 0.03, 0.025, FRAMEW, n=6, parent=easel)
box('eledge', -0.8, -0.1, CZ - 0.07, 0.8, 0.06, CZ - 0.01, FRAMEW, easel)
box('chartback', -CW / 2 - 0.03, 0.0, CZ - 0.02, CW / 2 + 0.03, 0.03, CZ + CHT + 0.02, '#4a3320', easel)
box('chartbar', -CW / 2 - 0.06, -0.02, CZ + CHT - 0.02, CW / 2 + 0.06, 0.04, CZ + CHT + 0.05, FRAMEW, easel)
bpy.ops.mesh.primitive_plane_add(size=1)
ch = bpy.context.active_object
ch.name = 'chart'
ch.scale = (CW, CHT, 1)
ch.rotation_euler = (math.radians(90), 0, 0)
ch.location = (0, -0.005, CZ + CHT / 2)
ch.parent = easel
CHM = {}
for st in ('diagram', 'blank'):
    m = bpy.data.materials.new('chart_' + st)
    m.use_nodes = True
    tx = m.node_tree.nodes.new('ShaderNodeTexImage')
    tx.image = bpy.data.images.load(os.path.join(HERE, 'assets', f'chart_{st}.png'))
    b = m.node_tree.nodes['Principled BSDF']
    m.node_tree.links.new(tx.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = 1.0
    b.inputs['Specular IOR Level'].default_value = 0.1
    CHM[st] = m
ch.data.materials.append(CHM['diagram'])
ch2 = ch.copy()
ch2.data = ch.data.copy()
ch2.name = 'chart_blank'
sc.collection.objects.link(ch2)
ch2.data.materials[0] = CHM['blank']
easel.location = (EX, EY, 0)
easel.rotation_euler[2] = EA
bpy.context.view_layer.update()
CHART_W = ch.matrix_world


def on_chart(u, v, off=0.025):
    """a point on the chart's face: u, v in 0..1 from its bottom left, off metres in front of it"""
    return CHART_W @ Vector((u - 0.5, v - 0.5, 0)) + (CHART_W.to_3x3() @ Vector((0, 0, 1))).normalized() * off


# the chart changes on the cut to L3: the diagram sheet is swapped for the blank one
for ob, (a, b) in ((ch, (False, True)), (ch2, (True, False))):
    ob.hide_render = a; ob.keyframe_insert('hide_render', frame=0)
    ob.hide_render = b; ob.keyframe_insert('hide_render', frame=FS['L3'][0])

# ---- the lecturer, beside the chart, three-quarters to the benches, pointer in his right hand on the chart
PX, PY, PH = 3.15, 6.05, 196
POSE = {'RightArm': (-28, 0, 22), 'RightForeArm': (0, 0, -8), 'RightHand': (0, 0, -10),
        'LeftArm': (80, 0, 10), 'LeftForeArm': (0, 0, 14),
        'RightHandIndex1': (70, 0, 0), 'RightHandIndex2': (75, 0, 0), 'RightHandIndex3': (60, 0, 0), 'RightHandThumb2': (30, 0, 0)}
l_root, l_arm = person('lecturer', 'lecturer', (PX, PY, SZ), PH)
act = stand(l_arm, N, pose=POSE, k=0.5)
sc.frame_set(0)
bpy.context.view_layer.update()
body = [o for o in l_arm.children if o.type == 'MESH' and o.data.vertices and len(o.vertex_groups) > 10][0]
ev = body.evaluated_get(bpy.context.evaluated_depsgraph_get()).data
gn = {g.index: g.name for g in body.vertex_groups}
ids = [v.index for v in body.data.vertices if v.groups and gn[max(v.groups, key=lambda g: g.weight).group].startswith('RightHand')]
HAND = body.matrix_world @ (sum((ev.vertices[i].co for i in ids), Vector()) / len(ids))
TIP = on_chart(0.515, 0.40)                                 # the pointer starts low on the stem and climbs it in L2
d = (TIP - HAND).normalized()
print('POINTER', 'hand', tuple(round(v, 2) for v in HAND), 'tip', tuple(round(v, 2) for v in TIP), 'length', round((TIP - HAND).length, 2))
ptr = cyl('pointer', HAND - d * 0.08, TIP, 0.011, 0.005, '#2a2018', n=6)
knob = cyl('pointer_knob', HAND - d * 0.12, HAND - d * 0.07, 0.016, 0.016, '#2a2018', n=6)
pb = l_arm.pose.bones['RightHand']
M = l_arm.matrix_world @ pb.matrix @ Matrix.Translation((0, pb.length, 0))
for ob in (ptr, knob):
    ob.parent = l_arm
    ob.parent_type = 'BONE'
    ob.parent_bone = 'RightHand'
    ob.matrix_parent_inverse = M.inverted()
# L2: the pointer climbs the stem on twos (the arm lifts CLIMB degrees over the shot); L3 holds it where it stopped
CLIMB = 30.0
fcx = act.fcurves.find('pose.bones["RightArm"].rotation_euler', index=0)
fcx.keyframe_points.clear()
a_, b_ = FS['L2']
for fr in range(0, N, 2):
    u = min(1.0, max(0.0, (fr - a_) / max(1, b_ - a_)))
    if fr >= b_:
        u = 1.0
    if fr < a_:
        u = 0.0
    fcx.keyframe_points.insert(fr, math.radians(POSE['RightArm'][0] - CLIMB * u)).interpolation = 'CONSTANT'
if FS['L3'][0] % 2:
    fcx.keyframe_points.insert(FS['L3'][0], math.radians(POSE['RightArm'][0] - CLIMB)).interpolation = 'CONSTANT'

# ---- the light: late sun through the left windows, the gas lamps, a warm fill
sun = bpy.data.objects['sun']
SD = Vector((1.0, 0.42, -0.55)).normalized()
sun.rotation_euler = SD.to_track_quat('-Z', 'Y').to_euler()
sun.data.energy, sun.data.color = 5.5, (1.0, 0.88, 0.68)
fill = bpy.data.lights.new('roomfill', 'AREA')
fill.energy, fill.size, fill.color = 450, 12.0, (1.0, 0.86, 0.68)
fo = bpy.data.objects.new('roomfill', fill)
sc.collection.objects.link(fo)
fo.location = (0.5, 0.0, ZC - 0.6)
for i, c in enumerate(WINS):                                 # the late sun's glow through each window
    wl = bpy.data.lights.new(f'win{i}', 'AREA')
    wl.energy, wl.size, wl.color = 260, 1.3, (1.0, 0.86, 0.62)
    wo = bpy.data.objects.new(f'win{i}', wl)
    sc.collection.objects.link(wo)
    wo.location = (XL + 0.3, c, (WZ0 + WZ1) / 2)
    wo.rotation_euler = SD.to_track_quat('-Z', 'Y').to_euler()
stg = bpy.data.lights.new('stagelight', 'AREA')              # the lamps along the front wall throw a soft light on the stage
stg.energy, stg.size, stg.color = 170, 3.0, (1.0, 0.8, 0.55)
so_ = bpy.data.objects.new('stagelight', stg)
sc.collection.objects.link(so_)
so_.location = (1.5, 3.0, 4.2)
so_.rotation_euler = (math.radians(35), 0, 0)
for lt in GASL:                                             # the gas flames flicker a little, on twos
    rr = random.Random(hash(lt.name) % 1000)
    for fr in range(0, N, 3):
        lt.energy = 45 * (1 + rr.uniform(-0.05, 0.05))
        lt.keyframe_insert('energy', frame=fr)
    for kp in lt.animation_data.action.fcurves[0].keyframe_points:
        kp.interpolation = 'CONSTANT'

# ---- the finishing pass, then the cameras
LK = {'__name__': 'look'}
exec(compile(open(os.path.join(HERE, 'look.py')).read(), os.path.join(HERE, 'look.py'), 'exec'), LK)
LK['finish'](sc, fill_strength=0.35, shadow_fill='#8a9a84', haze=(60.0, 400.0, 0.0), rules={
    WALL: (0.12, 0.5, None, 1.0), WALL_LT: (0.12, 0.5, None, 1.0), WAIN: (0.08, 0.9, None, 1.0), FLOOR: (0.10, 0.5, None, 1.0),
    STEP: (0.10, 0.5, None, 1.0), BENCH: (0.08, 0.8, None, 1.0), BENCH_LT: (0.08, 0.8, None, 1.0), BENCH_DK: (0.08, 0.8, None, 1.0),
    CURT: (0.12, 1.4, None, 1.0), CURT_DK: (0.12, 1.4, None, 1.0), CURT_LT: (0.12, 1.4, None, 1.0), BOARD: (0.10, 0.9, None, 1.0)})
ee = sc.eevee
ee.use_bloom, ee.bloom_threshold, ee.bloom_intensity, ee.bloom_radius = True, 1.3, 0.04, 5.0
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
CHC = on_chart(0.5, 0.55, 0.0)
KEYS = [  # frame, camera, look-at, lens
    (FS['L1'][0], (6.4, -6.2, 5.5), (-0.6, 5.0, 1.0), 22), (FS['L1'][1] - 1, (6.0, -5.5, 5.25), (-0.4, 5.0, 1.05), 22),
    (FS['L2'][0], (-0.4, 0.9, 2.15), (2.5, 6.4, 1.75), 38), (FS['L2'][1] - 1, (-0.25, 1.15, 2.15), (2.5, 6.4, 1.75), 38),
    (FS['L3'][0], (-0.25, 1.15, 2.15), (2.5, 6.4, 1.75), 38), (N - 1, (-0.25, 1.15, 2.15), (2.5, 6.4, 1.75), 38)]
CUTS = {FS['L1'][1] - 1, FS['L2'][1] - 1}
for fr, pos, look, lens in KEYS:
    cam.location = pos; cam.keyframe_insert('location', frame=fr)
    tgt.location = look; tgt.keyframe_insert('location', frame=fr)
    cam.data.lens = lens; cam.data.keyframe_insert('lens', frame=fr)
for ad in (cam.animation_data, tgt.animation_data, cam.data.animation_data):
    for fc in ad.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT' if int(kp.co[0]) in CUTS else 'LINEAR'
cam.data.dof.use_dof = True
for fr, dist, fs in ((FS['L1'][0], 13.5, 4.0), (FS['L2'][0], 6.0, 2.4)):
    cam.data.dof.focus_distance, cam.data.dof.aperture_fstop = dist, fs
    cam.data.dof.keyframe_insert('focus_distance', frame=fr)
    cam.data.dof.keyframe_insert('aperture_fstop', frame=fr)
for fc in cam.data.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = 'CONSTANT'
sc.render.resolution_percentage = SCALE
os.makedirs(OUT, exist_ok=True)
STILL = {'wide': FS['L1'][0] + 20, 'chart': FS['L2'][0] + 20, 'blank': FS['L3'][0] + 4}
for mode in MODES:
    if mode == 'anim':
        fr_ = os.environ.get('FRAMES', '')
        paths = [(fr, os.path.join(OUT, f'{fr:04d}.png')) for fr in (range(N) if fr_ == 'all' else [int(v) for v in fr_.split(',') if v])]
    else:
        paths = [(STILL[mode], os.path.join(OUT, f'lecture_{mode}.png'))]
    for fr, p in paths:
        sc.frame_set(fr)
        sc.render.filepath = p
        t = time.time()
        bpy.ops.render.render(write_still=True)
        print('FRAME', mode, fr, round(time.time() - t, 2), 's', flush=True)
