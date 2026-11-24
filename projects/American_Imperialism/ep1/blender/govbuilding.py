# Ep 1, chapter 6: Aliʻiōlani Hale, the Government Building in Honolulu, built in Blender after the Flow plate
# d3_government_building and the period photographs (ch06_government_building_aliiolani_hale_1898book, the clock tower over
# the arcades; ch06_proclamation_republic_july4_1894_1896book, the crowd and the strings of flags). Two storeys of arched
# verandas between end pavilions, the central tower with its clock and belvedere, the flagstaff on top; the statue of
# Kamehameha I (1883) in front; lawn, palms and trees, the Koʻolau behind.
# Two states, back to back on the timeline, keyed to the chapter 6 narration (public/audio/ch06_the_heist.words.json):
#   G1  "On February 1st"  (to "protectorate")  February 1, 1893: from the lawn past the statue, up at the tower; the U.S.
#                                               flag (44 stars) goes up the staff on twos, reaching the top on "flag", and
#                                               flies; the camera tilts up with it, then (join 18) cranes up and in so that
#                                               on "flag" it is square on the flag, the stripes horizontal and filling the
#                                               frame, flying gently (the lead matches them into the parchment's lines)
#   G2  "On July 4th"      (to "A few years")   July 4, 1894, the Republic: the building dressed in bunting, strings of
#                                               flags from the tower, a crowd on the lawn, the Hawaiian flag (the Republic
#                                               kept it) on the staff; the wide from the street, a slow push
#   xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python govbuilding.py -- <out_dir> [scale%] [mode]
#   mode: a still, or several comma-separated: flag_low (G1, the flag starting up), flag (G1, the flag at the top),
#         republic (G2), flag_end (join 18: G1's frame on "flag"), anim (the frames in $FRAMES), flagrun (join 18: G1
#         from the start to a second past "flag", every $STEP-th frame, into <out_dir>/flagrun/)
import bpy, bmesh, math, os, sys, random, time
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/govbuilding'
SCALE = int(argv[1]) if len(argv) > 1 else 100
MODES = (argv[2] if len(argv) > 2 else 'flag').split(',')
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
box, prism, mesh_from, ico, cyl, empty, mat, lin, terrain = (CG[k] for k in ('box', 'prism', 'mesh_from', 'ico', 'cyl', 'empty', 'mat', 'lin', 'terrain'))
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


CH = 'ch06_the_heist'
SHOTS = [('G1', _wt(CH, 'On February 1st') - 0.05, _wt(CH, 'protectorate') - 0.05),
         ('G2', _wt(CH, 'On July 4th') - 0.05, _wt(CH, 'A few years later') - 0.05)]
FS = {}
f = 0
for name, t0, t1 in SHOTS:
    n = int(round((t1 - t0) * FPS))
    FS[name] = (f, f + n)
    print('SHOT', name, 'narration', round(t0, 2), 'to', round(t1, 2), 'frames', f, f + n - 1)
    f += n
N = f
sc.frame_start, sc.frame_end = 0, N - 1
T_G1 = SHOTS[0][1]
F_UP0 = FS['G1'][0] + 8                                                         # the flag starts up a beat into the shot
F_UP1 = FS['G1'][0] + int(round((_wt(CH, 'flag and put') - T_G1) * FPS)) - 4   # and is at the top just before "flag"

# ---- palette (the plate's cream stone, a little warmer than the palace's), slate, iron, the grounds
STONE, STONE_LT, STONE_DK, BASE = '#dccbaa', '#e8dcc0', '#c4b08c', '#b5a283'
DARK, SLATE, IRON = '#2f2c26', '#5d6670', '#34322d'
LAWN, PATH, ROAD = '#8a8d4c', '#c3b495', '#b8a582'
BRONZE, GILT = '#3a2e24', '#c9a44a'


def arch_panel(name, x0, x1, y0, y1, z0, zs, z1, col, inset=0.22):
    """a wall panel between z0 and z1 with a round-arched opening from the floor z0 up to the spring line zs"""
    r = (x1 - x0) / 2 - inset
    cx = (x0 + x1) / 2
    pts = [(x0, z1), (x0, z0), (cx - r, z0), (cx - r, zs)]
    pts += [(cx - r * math.cos(math.pi * k / 10), zs + r * math.sin(math.pi * k / 10)) for k in range(1, 10)]
    pts += [(cx + r, zs), (cx + r, z0), (x1, z0), (x1, z1)]
    return prism(name, pts[::-1], y0, y1, col)


def recolor(ob, m):
    ob.data.materials.clear()
    ob.data.materials.append(m)


def emit(name, hexcol, strength=1.0):
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
    return m


# ================================================================ Aliʻiōlani Hale (front faces -y; the arcade face at y = 0)
GND = 0.0
BZ, F2, EZ, PZ = 1.3, 6.4, 11.6, 12.5                       # basement top, upper floor, eave, top of the parapet
XP, XT = 14.5, 3.6                                          # the end pavilions start at |x| = XP; the tower is |x| < XT
XE = 20.5                                                   # the building's ends
box('basement', -XE, -0.6, GND, XE, 16, BZ, BASE)
box('main', -XE + 0.4, 2.6, BZ, XE - 0.4, 16, EZ, STONE)
box('vback_lo', -XP, 2.55, BZ, XP, 2.6, F2, STONE_LT)
box('vback_hi', -XP, 2.55, F2, XP, 2.6, EZ, STONE_LT)
# the verandas: two storeys of round arches on paired piers, balustrades on both floors, the cornice and parapet over them
GL, DOORW = '#4f5a60', '#5e4330'
for side in (-1, 1):
    x0, x1 = (XT, XP) if side > 0 else (-XP, -XT)
    nb = 5
    bw = (x1 - x0) / nb
    for fz, top, zs in ((BZ, F2, F2 - 1.6), (F2, EZ, EZ - 1.6)):
        box(f'slab{side}{fz}', x0, -0.25, fz, x1, 2.6, fz + 0.3, STONE_LT)
        box(f'vfloor{side}{fz}', x0, 0.3, fz + 0.3, x1, 2.55, fz + 0.32, '#9a8f78')
        for k in range(nb):
            bx0 = x0 + k * bw
            arch_panel(f'arch{side}{fz}{k}', bx0, bx0 + bw, -0.1, 0.35, fz + 0.3, zs, top, STONE)
            for xx in (bx0 + 0.04, bx0 + bw - 0.3):         # pilaster strips on the piers
                box(f'pier{side}{fz}{k}{xx:.1f}', xx, -0.16, fz + 0.3, xx + 0.26, -0.1, zs, STONE_LT)
            box(f'kst{side}{fz}{k}', bx0 + bw / 2 - 0.14, -0.18, zs + bw / 2 - 0.22 - 0.1, bx0 + bw / 2 + 0.14, -0.1, zs + bw / 2 - 0.22 + 0.32, STONE_LT)
            for j in range(9):                              # balusters
                xb = bx0 + 0.42 + j * (bw - 0.84) / 8
                box(f'bal{side}{fz}{k}{j}', xb - 0.05, -0.05, fz + 0.3, xb + 0.05, 0.08, fz + 1.2, STONE_LT)
            box(f'rail{side}{fz}{k}', bx0 + 0.25, -0.08, fz + 1.2, bx0 + bw - 0.25, 0.12, fz + 1.32, STONE_LT)
            # behind each arch: a tall door or window in the veranda's back wall
            dx = bx0 + bw / 2
            arch_panel(f'vwin{side}{fz}{k}', dx - 0.75, dx + 0.75, 2.45, 2.55, fz + 0.32, fz + 3.0, fz + 3.9, STONE_LT, inset=0.15)
            box(f'vgl{side}{fz}{k}', dx - 0.6, 2.52, fz + 0.32, dx + 0.6, 2.54, fz + 3.6, GL)
        box(f'band{side}{fz}', x0, -0.2, top - 0.35, x1, 0.4, top, STONE_LT)
# the cornice and parapet with a balustrade across the whole front, and urns over the piers
box('cornice', -XE, -0.5, EZ, XE, 16.3, EZ + 0.35, STONE_LT)
box('corn_dk', -XE + 0.1, -0.4, EZ - 0.12, XE - 0.1, 16.2, EZ, STONE_DK)
box('parapet_b', -XE, -0.35, EZ + 0.35, XE, -0.05, EZ + 0.5, STONE_LT)
for k in range(76):
    x = -XE + 0.35 + k * (2 * XE - 0.7) / 75
    box(f'pb{k}', x - 0.07, -0.3, EZ + 0.5, x + 0.07, -0.12, PZ - 0.15, '#cbbd9e')
box('parapet_t', -XE, -0.38, PZ - 0.15, XE, -0.02, PZ, STONE_LT)
box('roof', -XE + 0.4, 0.0, EZ + 0.35, XE - 0.4, 16, EZ + 0.6, '#9f978a')
# the end pavilions: projecting, with arched windows on both floors, quoins, a heavier cornice
for side in (-1, 1):
    x0, x1 = (XP, XE) if side > 0 else (-XE, -XP)
    box(f'pav{side}', x0, -1.6, BZ, x1, 14, EZ, STONE)
    box(f'pavcorn{side}', x0 - 0.3, -2.0, EZ, x1 + 0.3, 14, EZ + 0.45, STONE_LT)
    box(f'pavpar{side}', x0 - 0.2, -1.9, EZ + 0.45, x1 + 0.2, -1.5, PZ + 0.4, STONE_LT)
    for z in range(2, int(EZ), 1):
        for xq in (x0 - 0.06, x1 - 0.34):
            box(f'pq{side}{z}{xq:.0f}', xq, -1.68, z, xq + 0.4, -1.5, z + 0.42, STONE_DK)
    box(f'pband{side}', x0, -1.75, F2 - 0.2, x1, -1.5, F2 + 0.15, STONE_LT)
    for fz in (BZ + 0.9, F2 + 0.9):
        for xc in ((x0 + x1) / 2 - 1.6, (x0 + x1) / 2 + 1.6):
            arch_panel(f'pwin{side}{fz}{xc:.0f}', xc - 0.95, xc + 0.95, -1.75, -1.6, fz, fz + 2.6, fz + 3.6, STONE_LT, inset=0.2)
            box(f'pgl{side}{fz}{xc:.0f}', xc - 0.75, -1.62, fz, xc + 0.75, -1.58, fz + 3.3, GL)
            box(f'psill{side}{fz}{xc:.0f}', xc - 1.0, -1.95, fz - 0.15, xc + 1.0, -1.6, fz, STONE_LT)
    for k in range(4):                                       # urns on the pavilion parapet
        xu = x0 + 0.6 + k * (x1 - x0 - 1.2) / 3
        cyl(f'urn{side}{k}', (xu, -1.7, PZ + 0.4), (xu, -1.7, PZ + 0.85), 0.16, 0.22, STONE_LT, n=8)
    box(f'pbase{side}', x0 - 0.1, -1.8, GND, x1 + 0.1, 14, BZ, BASE)
for x in [-19.0 + 1.9 * k for k in range(21)]:              # the basement's small arched vents
    if abs(x) > XT + 0.6:
        yv = -1.85 if abs(x) > XP else -0.65
        box(f'vent{x:.1f}', x - 0.35, yv, 0.3, x + 0.35, yv + 0.1, 1.0, '#8a7f68')

# the central tower: an entrance pavilion with the great arched doorway and a loggia over it, then the tower above the roof
# with the clock, the belvedere and its roof, and the flagstaff
TY0, TY1 = -2.2, 4.5
box('tower_lo', -XT, TY0, BZ, XT, TY1, EZ + 0.6, STONE_LT)
box('tcorn1', -XT - 0.3, TY0 - 0.35, EZ, XT + 0.3, TY1, EZ + 0.6, STONE_LT)
for z in range(2, int(EZ), 1):
    for xq in (-XT - 0.06, XT - 0.34):
        box(f'tq{z}{xq:.0f}', xq, TY0 - 0.08, z, xq + 0.4, TY0 + 0.1, z + 0.42, STONE_DK)
arch_panel('doorarch', -2.0, 2.0, TY0 - 0.12, TY0 + 0.02, BZ, BZ + 3.0, F2 - 0.1, STONE, inset=0.35)
box('door_rec', -1.65, TY0 + 0.3, BZ, 1.65, TY0 + 0.4, F2 - 0.1, '#5a5348')
for xs in (-1, 1):
    box(f'door{xs}', xs * 0.03, TY0 + 0.25, BZ, xs * 0.9, TY0 + 0.3, BZ + 3.4, DOORW)
box('dtran', -0.95, TY0 + 0.25, BZ + 3.45, 0.95, TY0 + 0.3, BZ + 4.3, GL)
box('tband', -XT, TY0 - 0.15, F2 - 0.1, XT, TY0 + 0.1, F2 + 0.25, STONE_LT)
for i, xc in enumerate((-1.95, 0.0, 1.95)):                 # the loggia's three arches
    arch_panel(f'tlog{i}', xc - 0.95, xc + 0.95, TY0 - 0.12, TY0 + 0.02, F2 + 0.25, F2 + 2.8, EZ - 0.2, STONE, inset=0.2)
box('tlog_rec', -2.7, TY0 + 0.2, F2 + 0.25, 2.7, TY0 + 0.3, EZ - 0.3, '#6a6052')
for k in range(15):
    xb = -2.6 + k * 0.37
    box(f'tlbal{k}', xb - 0.05, TY0 - 0.25, F2 + 0.25, xb + 0.05, TY0 - 0.12, F2 + 1.15, STONE_LT)
box('tlrail', -2.8, TY0 - 0.3, F2 + 1.15, 2.8, TY0 - 0.06, F2 + 1.27, STONE_LT)
box('tlbalc', -3.0, TY0 - 0.55, F2 + 0.05, 3.0, TY0 + 0.1, F2 + 0.25, STONE_LT)
# the tower above the roof: the clock stage, the belvedere of arches, the roof
CS0, CS1, BV0, BV1 = EZ + 0.6, 17.4, 17.8, 20.6
TX = 2.6
TCY = (TY0 + 0.6 + TY1) / 2
box('clockstage', -TX, TY0 + 0.6, CS0, TX, TY1 - 0.6, CS1, STONE_LT)
for xq in (-TX - 0.06, TX - 0.34):
    for z in range(int(CS0) + 1, int(CS1)):
        box(f'cq{z}{xq:.0f}', xq, TY0 + 0.52, z, xq + 0.4, TY0 + 0.7, z + 0.42, STONE_DK)
box('ccorn', -TX - 0.35, TY0 + 0.25, CS1, TX + 0.35, TY1 - 0.25, CS1 + 0.4, STONE_LT)
FACE = emit('clockface', '#efe9d8', 0.9)
for (nm_, c, axis) in (('cf', (0, TY0 + 0.5, 15.2), (0, -1, 0)), ('cfe', (TX + 0.1, TCY, 15.2), (1, 0, 0)), ('cfw', (-TX - 0.1, TCY, 15.2), (-1, 0, 0))):
    c, a = Vector(c), Vector(axis)
    cyl(nm_ + 'ring', c - a * 0.02, c + a * 0.1, 1.05, 1.05, STONE_DK, n=20)
    fc_ = cyl(nm_, c + a * 0.1, c + a * 0.13, 0.9, 0.9, '#ffffff', n=20)
    recolor(fc_, FACE)
    # the hands: a morning hour
    for ang, ln, w in ((math.radians(-60), 0.55, 0.05), (math.radians(60), 0.78, 0.035)):
        u = Vector((-a.y, a.x, 0)) if abs(a.z) < 0.5 else Vector((1, 0, 0))
        p0 = c + a * 0.15
        p1 = p0 + (u * math.sin(ang) + Vector((0, 0, 1)) * math.cos(ang)) * ln
        cyl(f'{nm_}h{ln}', p0, p1, w, w * 0.7, '#1f1d1a', n=4)
box('belv_floor', -TX, TY0 + 0.6, CS1 + 0.4, TX, TY1 - 0.6, BV0, STONE_LT)
for (nm_, y0, y1) in (('bf', TY0 + 0.55, TY0 + 0.7),):
    for i, xc in enumerate((-1.6, 0.0, 1.6)):
        arch_panel(f'belv{i}', xc - 0.85, xc + 0.85, y0, y1, BV0, BV0 + 1.6, BV1, STONE_LT, inset=0.18)
for sx in (-1, 1):
    for i, yc in enumerate((TCY - 1.6, TCY, TCY + 1.6)):
        p = arch_panel(f'belvs{sx}{i}', -0.85, 0.85, -0.075, 0.075, BV0, BV0 + 1.6, BV1, STONE_LT, inset=0.18)
        p.rotation_euler[2] = math.pi / 2
        p.location = (sx * (TX - 0.07), yc, 0)
box('belv_core', -TX + 0.4, TY0 + 1.1, BV0, TX - 0.4, TY1 - 1.1, BV1, '#4a4740')
box('bcorn', -TX - 0.4, TY0 + 0.2, BV1, TX + 0.4, TY1 - 0.2, BV1 + 0.45, STONE_LT)
RZ0, RZ1 = BV1 + 0.45, 24.2
i_ = 0.9
mesh_from('troof', [(-TX - 0.3, TY0 + 0.3, RZ0), (TX + 0.3, TY0 + 0.3, RZ0), (TX + 0.3, TY1 - 0.3, RZ0), (-TX - 0.3, TY1 - 0.3, RZ0),
                    (-0.35, TCY - 0.35, RZ1), (0.35, TCY - 0.35, RZ1), (0.35, TCY + 0.35, RZ1), (-0.35, TCY + 0.35, RZ1)],
          [(0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7), (4, 5, 6, 7)], SLATE)
box('tlantern', -0.45, TCY - 0.45, RZ1, 0.45, TCY + 0.45, RZ1 + 0.5, STONE_LT)
POLE0, POLE1 = RZ1 + 0.5, RZ1 + 9.0
cyl('flagpole', (0, TCY, POLE0), (0, TCY, POLE1), 0.1, 0.06, '#e8e4da', n=8)
ico('finial', (0, TCY, POLE1 + 0.12), 0.17, GILT, 1)
cyl('halyard', (0.09, TCY - 0.02, POLE0 + 0.3), (0.09, TCY - 0.02, POLE1 - 0.05), 0.012, 0.012, '#d9d2c0', n=4)
# the front steps: a broad flight down from the doorway, with low cheek walls
for k in range(9):
    box(f'st{k}', -3.4 - k * 0.06, TY0 - 0.6 - (k + 1) * 0.42, GND, 3.4 + k * 0.06, TY0 - 0.6 - k * 0.42, BZ - k * 0.145, STONE_DK if k % 2 else BASE)
for sx in (-1, 1):
    box(f'cheek{sx}', sx * 3.4 - 0.35, TY0 - 4.4, GND, sx * 3.4 + 0.35, TY0, BZ + 0.55, STONE_LT)
box('landing', -3.4, TY0 - 0.65, GND, 3.4, TY0, BZ, BASE)

# ================================================================ the flags: the U.S. flag (G1) and the Hawaiian flag (G2)
FLAGS = {}
for key, png, w in (('us', 'us_flag_44.png', 1.9), ('haw', 'hawaii_flag.png', 2.0)):
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=26, y_subdivisions=13, size=1)
    fl = bpy.context.active_object
    fl.name = 'flag_' + key
    H = 2.1
    fl.scale = (H * w, H, 1)
    fl.rotation_euler = (math.radians(90), 0, 0)
    fm = bpy.data.materials.new('flag_' + key)
    fm.use_nodes = True
    tex = fm.node_tree.nodes.new('ShaderNodeTexImage')
    tex.image = bpy.data.images.load(os.path.join(HERE, 'assets', png))
    fm.node_tree.links.new(tex.outputs['Color'], fm.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
    fm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 1.0
    fl.data.materials.append(fm)
    wv = fl.modifiers.new('wave', 'WAVE')
    wv.use_x, wv.use_y, wv.height, wv.width, wv.speed, wv.narrowness = True, False, 0.2, 1.3, 0.2, 1.0
    wv.start_position_x = -H * w / 2
    for p in fl.data.polygons:
        p.use_smooth = False
    FLAGS[key] = (fl, H * w, H)
for f_ in range(N):                                         # the flags wave on twos, like everything else
    tq = f_ - math.floor(f_ / FPS * 12) / 12 * FPS
    for key, (fl, W_, H_) in FLAGS.items():
        fl.modifiers['wave'].time_offset = tq
        fl.modifiers['wave'].keyframe_insert('time_offset', frame=f_)
# the U.S. flag climbs the staff on twos (12 fps), easing into the top; the Hawaiian flag is at the top in G2
us, UW, UH = FLAGS['us']
ZTOP = POLE1 - UH / 2 - 0.15
ZBOT = POLE0 + UH / 2 + 0.4
for f_ in range(N):
    step = math.floor(f_ / FPS * 12) / 12 * FPS
    u = min(1.0, max(0.0, (step - F_UP0) / max(1, F_UP1 - F_UP0)))
    u = 1 - (1 - u) ** 1.3
    us.location = (0.1 + UW / 2, TCY, ZBOT + (ZTOP - ZBOT) * u)
    us.keyframe_insert('location', frame=f_)
haw, HW_, HH_ = FLAGS['haw']
haw.location = (0.1 + HW_ / 2, TCY, POLE1 - HH_ / 2 - 0.15)

# ================================================================ the Republic's bunting (G2): swags of red, white and blue along
# both veranda rails and the tower balcony, rosettes at the hang points, strings of pennants from the tower to the lawn
RED, WHITE, BLUE = '#a8322d', '#ece5d6', '#2c3d6e'
G2_ONLY = []


def swag(name, p0, p1, sag, w=0.5, n=10):
    """a festoon of three bands (red, white, blue from the top) hanging between p0 and p1, on the facade (normal -y)"""
    p0, p1 = Vector(p0), Vector(p1)
    for bi, col in enumerate((RED, WHITE, BLUE)):
        vs, fs = [], []
        for k in range(n + 1):
            u = k / n
            c = p0.lerp(p1, u)
            dz = -sag * 4 * u * (1 - u)
            top = c + Vector((0, -0.04 * bi - 0.02, dz - bi * w / 3 * (1 + 0.6 * 4 * u * (1 - u))))
            bot = top + Vector((0, -0.01, -w / 3 * (1 + 0.6 * 4 * u * (1 - u))))
            vs += [tuple(top), tuple(bot)]
        for k in range(n):
            fs.append((2 * k, 2 * k + 2, 2 * k + 3, 2 * k + 1))
        G2_ONLY.append(mesh_from(f'{name}{bi}', vs, fs, col))


for side in (-1, 1):
    x0, x1 = (XT, XP) if side > 0 else (-XP, -XT)
    bw = (x1 - x0) / 5
    for fz in (BZ, F2):
        for k in range(5):
            a, b = x0 + k * bw + 0.2, x0 + (k + 1) * bw - 0.2
            swag(f'sw{side}{fz}{k}', (a, -0.2, fz + 1.3), (b, -0.2, fz + 1.3), 0.45, 0.55)
            r_ = ico(f'ros{side}{fz}{k}', (a, -0.3, fz + 1.28), 0.18, RED, 1, (1, 0.4, 1))
            G2_ONLY.append(r_)
swag('swt', (-2.8, TY0 - 0.42, F2 + 1.25), (2.8, TY0 - 0.42, F2 + 1.25), 0.6, 0.7)
for sx in (-1, 1):                                          # the tower's swags, hung from the clock stage's corners
    swag(f'swc{sx}', (sx * 0.2, TY0 + 0.4, CS1 - 0.3), (sx * TX, TY0 + 0.4, CS1 - 0.3), 0.5, 0.45)


def pennants(name, p0, p1, sag, n):
    p0, p1 = Vector(p0), Vector(p1)
    pts = []
    for k in range(n + 1):
        u = k / n
        pts.append(p0.lerp(p1, u) + Vector((0, 0, -sag * 4 * u * (1 - u))))
    for k in range(n):
        G2_ONLY.append(cyl(f'{name}l{k}', pts[k], pts[k + 1], 0.012, 0.012, '#2a2620', n=3))
        if k % 1 == 0:
            m = pts[k].lerp(pts[k + 1], 0.5)
            d = (pts[k + 1] - pts[k]).normalized()
            col = (RED, WHITE, BLUE, '#d8b44a')[k % 4]
            G2_ONLY.append(mesh_from(f'{name}p{k}', [tuple(m - d * 0.22), tuple(m + d * 0.22), tuple(m + Vector((0, 0, -0.6)))], [(0, 1, 2)], col))


pennants('penL', (-0.2, TCY, POLE0 + 2.5), (-24.0, -14.0, 3.2), 1.8, 26)
pennants('penR', (0.2, TCY, POLE0 + 2.5), (24.0, -14.0, 3.2), 1.8, 26)
pennants('penL2', (-XT, TY0, EZ + 0.4), (-17.0, -20.0, 3.4), 1.2, 18)
pennants('penR2', (XT, TY0, EZ + 0.4), (17.0, -20.0, 3.4), 1.2, 18)
for sx in (-1, 1):                                          # the masts the pennant strings run down to
    for (x, y) in ((24.0, -14.0), (17.0, -20.0)):
        G2_ONLY.append(cyl(f'mast{sx}{x}', (sx * x, y, 0), (sx * x, y, 3.6), 0.08, 0.06, '#e8e4da', n=6))

# ================================================================ the statue of Kamehameha I on its pedestal, the grounds
KY = -19.0
box('kbase1', -2.2, KY - 2.2, GND, 2.2, KY + 2.2, 0.35, '#8a8274')
box('kbase2', -1.5, KY - 1.5, 0.35, 1.5, KY + 1.5, 0.9, '#8a8274')
box('kplinth', -0.95, KY - 0.95, 0.9, 0.95, KY + 0.95, 3.6, '#9a9284')
box('kcap', -1.15, KY - 1.15, 3.6, 1.15, KY + 1.15, 3.9, '#8a8274')
for k in range(4):                                          # the bronze relief panels on the plinth
    a = k * math.pi / 2
    cx_, cy_ = 0.96 * math.sin(a), KY - 0.96 * math.cos(a)
    p = box(f'krel{k}', -0.55, -0.03, 1.4, 0.55, 0.03, 3.1, BRONZE)
    p.location = (cx_, cy_, 0)
    p.rotation_euler[2] = a
for k in range(24):                                         # the iron fence round it
    a = 2 * math.pi * k / 24
    x, y = 3.0 * math.cos(a), KY + 3.0 * math.sin(a)
    cyl(f'kf{k}', (x, y, 0), (x, y, 1.1), 0.03, 0.03, IRON, n=4)
for k in range(24):
    a0_, a1_ = 2 * math.pi * k / 24, 2 * math.pi * (k + 1) / 24
    cyl(f'kfr{k}', (3.0 * math.cos(a0_), KY + 3.0 * math.sin(a0_), 1.0), (3.0 * math.cos(a1_), KY + 3.0 * math.sin(a1_), 1.0), 0.025, 0.025, IRON, n=4)
COSTS = PG['COSTUMES']
COSTS['kamehameha'] = dict(coat=BRONZE, skin=BRONZE, hair=BRONZE, legs=BRONZE, shoes=BRONZE,
                           parts=[('cloak', 'Hips', lambda: PG['tails'](1.0, 0.9), GILT),
                                  ('cape', 'Spine2', lambda: PG['collar'](0.22, 0.06), GILT),
                                  ('malo', 'Hips', lambda: PG['band'](PG['ZW'] - 0.1, 0.32, off=0.06), GILT),
                                  ('helmet', 'Head', PG['flat_cap'], GILT)])
mat(BRONZE, 0.45), mat(GILT, 0.35)
k_root, k_arm = person('kamehameha', 'kamehameha', (0, KY, 3.9), 180)
k_root.scale = tuple(v * 1.6 for v in k_root.scale)
stand(k_arm, 2, pose={'RightArm': (22, 0, -62), 'RightForeArm': (0, 0, -10), 'RightHand': (0, 0, -20),
                      'LeftArm': (72, 0, 16), 'LeftForeArm': (0, 0, -60)}, breathe=False)
sc.frame_set(0)
bpy.context.view_layer.update()
body = [o for o in k_arm.children if o.type == 'MESH' and o.data.vertices and len(o.vertex_groups) > 10][0]
ev = body.evaluated_get(bpy.context.evaluated_depsgraph_get()).data
gn = {g.index: g.name for g in body.vertex_groups}
ids = [v.index for v in body.data.vertices if v.groups and gn[max(v.groups, key=lambda g: g.weight).group].startswith('LeftHand')]
LH = body.matrix_world @ (sum((ev.vertices[i].co for i in ids), Vector()) / len(ids))
cyl('kspear', (LH.x, LH.y, 3.95), (LH.x, LH.y, LH.z + 1.6), 0.035, 0.03, BRONZE, n=6)
print('STATUE left hand', tuple(round(v, 2) for v in LH))
# the lawn, the walk and the drive, King Street in front
terrain('lawn', -200, 200, -160, 140, 24, 16, lambda x, y: 0.3 * math.sin(x * 0.07) * math.cos(y * 0.09) - 0.2, LAWN)
box('walk', -2.4, -16.4, 0.0, 2.4, TY0 - 4.4, 0.03, PATH)
box('walk2', -2.4, -28.0, 0.0, 2.4, -21.6, 0.03, PATH)
for k in range(16):                                         # the oval drive round the statue
    a0_, a1_ = 2 * math.pi * k / 16, 2 * math.pi * (k + 1) / 16
    mesh_from(f'oval{k}', [(5.2 * math.cos(a0_), KY + 3.4 * math.sin(a0_), 0.02), (5.2 * math.cos(a1_), KY + 3.4 * math.sin(a1_), 0.02),
                           (7.2 * math.cos(a1_), KY + 4.6 * math.sin(a1_), 0.02), (7.2 * math.cos(a0_), KY + 4.6 * math.sin(a0_), 0.02)], [(0, 1, 2, 3)], PATH)
box('street', -200, -36, 0.0, 200, -28, 0.035, ROAD)
for sx in (-1, 1):
    box(f'hedge{sx}', sx * 9.0 - 6, -27.3, 0.0, sx * 9.0 + 6, -26.7, 0.55, '#3c4a30')
    for k in range(12):
        x = sx * (4.5 + k * 1.6)
        ico(f'shrub{sx}{k}', (x, -2.6 if abs(x) < XP else -3.4, 0.5), 0.8 + 0.15 * (k % 3), '#3c4a30', 1, (1.2, 0.9, 0.8), seed=300 + k + (sx > 0) * 20)


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
for i, (x, y, h, lean) in enumerate(((-27, -6, 17, 0.1), (-31, 6, 12, -0.05), (-36, -2, 14, 0.05), (27, -8, 16, -0.12), (33, 4, 13, 0.06),
                                     (-14, -27, 15, 0.08), (21, -33, 18, -0.06))):
    CG['palm'](x, y, h, lean, 12, 4.6 if h > 14 else 3.6, 60 + i)
for i, (x, y, h, w) in enumerate(((-24, 12, 10, 9), (24, 13, 10.5, 10), (-40, 14, 9, 8))):
    CG['breadfruit'](x, y, h, w, 90 + i)
FX = {'sc': sc, 'lin': lin, '__name__': 'fx'}                # clouds: fx.py's painted heaps
exec(compile(open(os.path.join(HERE, 'fx.py')).read(), os.path.join(HERE, 'fx.py'), 'exec'), FX)
CLOUD_M = FX['soft_mat']('cloud', '#f6efdc', '#aab4b0', lo=0.15, hi=1.25, feather=0.6, shadows=False)
for ci, (cx, cyy, cz, cw) in enumerate(((-90, 330, 100, 85), (100, 340, 85, 75), (10, 300, 125, 50), (-75, 330, 165, 60), (85, 345, 190, 70))):
    FX['bank'](f'cl{ci}', (cx, cyy, cz), cw * 1.6, CLOUD_M, seed=ci + 21, n=3, height=cw * 0.35)

# ================================================================ the crowd for the proclamation (G2): men in dark coats and boaters,
# women in white and in holokū, sailors; standing on the lawn before the steps, facing the building
CROWD_COSTS = ['gentleman', 'businessman', 'worker', 'holoku', 'missionary', 'gentleman', 'sailor', 'officer', 'worker', 'businessman']
COSTS['white_dress'] = dict(COSTS['missionary'], coat='#ece6d8', legs='#ece6d8',
                            parts=[('dress', 'Hips', lambda: PG['skirt'](0.42, 1.04), '#ece6d8'),
                                   ('waist', 'Hips', lambda: PG['band'](PG['ZW'], 0.1), '#d8d0bf'),
                                   ('collar', 'Spine2', lambda: PG['collar'](0.17), '#f4f0e6'),
                                   ('crown', 'Head', PG['boater'], '#d9c79a'), ('brim', 'Head', PG['boater_brim'], '#d9c79a')])
CROWD_COSTS += ['white_dress', 'white_dress']
rc = random.Random(4)
CROWD = []
pts_ = []
while len(pts_) < 22:
    x, y = rc.uniform(-9.5, 9.5), rc.uniform(-13.0, -7.2)
    if abs(x) < 3.6 and y > -8.6:
        continue
    if all((x - a) ** 2 + (y - b) ** 2 > 0.9 ** 2 for a, b in pts_):
        pts_.append((x, y))
for i, (x, y) in enumerate(pts_):
    hd = math.degrees(math.atan2(-x, -(y - 4))) * 0.6 + rc.uniform(-12, 12)   # facing the doorway, more or less
    root, arm = person(f'crowd{i}', CROWD_COSTS[i % len(CROWD_COSTS)], (x, y, 0.0), hd)
    stand(arm, N, k=rc.uniform(0, 6))
    CROWD.append(root)
for root in CROWD:
    G2_ONLY.append(root)
    G2_ONLY += list(root.children_recursive)
G1_ONLY = [us]
for ob in G2_ONLY + [haw]:
    ob.hide_render = True; ob.keyframe_insert('hide_render', frame=0)
    ob.hide_render = False; ob.keyframe_insert('hide_render', frame=FS['G2'][0])
for ob in G1_ONLY:
    ob.hide_render = False; ob.keyframe_insert('hide_render', frame=0)
    ob.hide_render = True; ob.keyframe_insert('hide_render', frame=FS['G2'][0])

# sway for the palms and trees (stepped at 12 fps)
for f_ in range(0, N):
    tq = math.floor(f_ / FPS * 12) / 12
    for ob, kind, ph, amp in CG['MOVERS']:
        ob.rotation_euler[1] = amp * math.sin(tq * (1.7 if kind == 'frond' else 1.1) + ph)
        ob.keyframe_insert('rotation_euler', frame=f_)
for ob in [o for o, *_ in CG['MOVERS']] + [us, FLAGS['us'][0], FLAGS['haw'][0]]:
    if ob.animation_data and ob.animation_data.action:
        for fc in ob.animation_data.action.fcurves:
            if fc.data_path.startswith('modifiers') or fc.data_path in ('location', 'rotation_euler'):
                for kp in fc.keyframe_points:
                    kp.interpolation = 'CONSTANT'

# ---- the arcade shadows: the sun lower and raking from the left, so each pier throws its shadow across the veranda
# floor and the arches print on the back wall; the veranda's back wall a shade deeper than the front, the glass darker
so_ = bpy.data.objects['sun']
so_.rotation_euler = Vector((0.62, 0.6, -0.5)).normalized().to_track_quat('-Z', 'Y').to_euler()
so_.data.angle = math.radians(0.4)
so_.data.shadow_cascade_max_distance = 90
sc.eevee.shadow_cascade_size = '4096'
sc.eevee.use_soft_shadows = True
for ob in bpy.data.objects:
    if ob.type == 'MESH' and (ob.name.startswith('vback') or ob.name.startswith('vwin')):
        ob.data.materials.clear()
        ob.data.materials.append(mat('#c2b393'))
    if ob.type == 'MESH' and ob.name.startswith('vgl'):
        ob.data.materials.clear()
        ob.data.materials.append(mat('#2f3538'))

# ---- the finishing pass: facets, coursing, bevels, cool shadow fill, grade, haze (look.py)
LK = {'__name__': 'look'}
exec(compile(open(os.path.join(HERE, 'look.py')).read(), os.path.join(HERE, 'look.py'), 'exec'), LK)
LK['finish'](sc, fill_strength=0.75, rules={
    STONE: (0.08, 0.3, 0.62, 0.9), STONE_LT: (0.08, 0.3, 0.62, 0.91), STONE_DK: (0.05, 0.3, None, 1.0), BASE: (0.07, 0.3, 0.45, 0.84),
    SLATE: (0.08, 0.6, 0.28, 0.85), LAWN: (0.12, 0.08, None, 1.0), '#7d8b69': (0.14, 0.02, None, 1.0), PATH: (0.08, 0.2, None, 1.0),
    '#c2b393': (0.06, 0.3, 0.62, 0.9), ROAD: (0.08, 0.2, None, 1.0), '#ead9ae': (0.04, 0.03, None, 1.0), '#3c4a30': (0.12, 0.4, None, 1.0), '#3f4b33': (0.12, 0.15, None, 1.0),
    RED: (0.04, 1.0, None, 1.0), WHITE: (0.03, 1.0, None, 1.0), BLUE: (0.04, 1.0, None, 1.0)})

# ================================================================ cameras
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
a1, b1 = FS['G1']
a2, b2 = FS['G2']
FT0 = Vector((1.6, TCY, ZBOT + 1.0))
FT1 = Vector((1.6, TCY, ZTOP - 0.6))
# join 18: G1 tilts up with the flag, then cranes up and in, arriving square on the flag's stripes on "flag" (F_FLAG)
F_FLAG = FS['G1'][0] + int(round((_wt(CH, 'flag and put') - T_G1) * FPS))
F_CR0 = F_UP0 + int(0.25 * (F_FLAG - F_UP0))                 # the crane starts once the flag is well on its way
FX_ = 0.1 + UW * 0.66                                        # aim right of the canton: stripes across the whole frame
D_TIGHT, LENS_T = 5.0, 82.0                                  # 2.2 m of flag across the frame
def flag_z(f_):
    step = math.floor(f_ / FPS * 12) / 12 * FPS
    u = min(1.0, max(0.0, (step - F_UP0) / max(1, F_UP1 - F_UP0)))
    return ZBOT + (ZTOP - ZBOT) * (1 - (1 - u) ** 1.3)
C_END = Vector((FX_, TCY - D_TIGHT, ZTOP))
KEYS = [(a1, (3.5, -44.0, 3.5), (0.8, TCY, 22.2), 45)]
C0, L0 = Vector((3.4, -43.6, 3.5)), Vector((0.8, TCY, 22.6))
for fr in range(F_CR0, b1):
    u = min(1.0, (fr - F_CR0) / (F_FLAG - 2 - F_CR0))
    e = u * u * (3 - 2 * u)
    ez = 1 - (1 - e) ** 1.6                                  # it rises a little ahead of moving in, clearing the facade
    pos = Vector((C0.x + (C_END.x - C0.x) * e, C0.y + (C_END.y - C0.y) * e, C0.z + (C_END.z - C0.z) * ez))
    zf = (flag_z(fr) + ZTOP) / 2 if u < 1 else ZTOP          # (the look-at rides with the climbing flag, smoothed)
    look = L0.lerp(Vector((FX_, TCY, ZTOP)), e)
    look.z = L0.z + (zf - L0.z) * min(1.0, e * 1.4) if u < 1 else ZTOP
    KEYS.append((fr, tuple(pos), tuple(look), 45 + (LENS_T - 45) * e ** 1.5))
KEYS += [(a2, (8.0, -52.0, 4.6), (0.0, 0.0, 13.0), 25), (b2 - 1, (7.4, -49.0, 4.5), (0.0, 0.0, 13.0), 25)]
CUTS = {b1 - 1}
for fr, pos, look, lens in KEYS:
    cam.location = pos; cam.keyframe_insert('location', frame=fr)
    tgt.location = look; tgt.keyframe_insert('location', frame=fr)
    cam.data.lens = lens; cam.data.keyframe_insert('lens', frame=fr)
for ad in (cam.animation_data, tgt.animation_data, cam.data.animation_data):
    for fc in ad.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT' if int(kp.co[0]) in CUTS else ('LINEAR' if F_CR0 <= int(kp.co[0]) < b1 else 'BEZIER')
            kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
cam.data.dof.use_dof = True
DOFK = [(a1, 50.0, 8.0)]
for k_ in KEYS:                                             # during the crane, focus on the flag
    if F_CR0 <= k_[0] < b1 and k_[0] % 3 == 0:
        DOFK.append((k_[0], max(D_TIGHT, (Vector((FX_, TCY, flag_z(k_[0]))) - Vector(k_[1])).length), 8.0))
for fr, dist, fs in DOFK + [(a2, 52.0, 11.0)]:
    cam.data.dof.focus_distance, cam.data.dof.aperture_fstop = dist, fs
    cam.data.dof.keyframe_insert('focus_distance', frame=fr)
    cam.data.dof.keyframe_insert('aperture_fstop', frame=fr)
for fc in cam.data.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = 'CONSTANT'
sc.render.resolution_percentage = SCALE
os.makedirs(OUT, exist_ok=True)
STILL = {'flag_low': F_UP0 + 8, 'flag': F_UP1 + 10, 'republic': a2 + 40, 'flag_end': F_FLAG}
print('FLAG UP', F_UP0, F_UP1)
for mode in MODES:
    if mode == 'anim':
        fr_ = os.environ.get('FRAMES', '')
        paths = [(fr, os.path.join(OUT, f'{fr:04d}.png')) for fr in (range(N) if fr_ == 'all' else [int(v) for v in fr_.split(',') if v])]
    elif mode == 'flagrun':
        paths = [(fr, os.path.join(OUT, 'flagrun', f'{fr:04d}.png')) for fr in range(a1, min(b1, F_FLAG + 30), int(os.environ.get('STEP', '1')))]
    else:
        paths = [(STILL[mode], os.path.join(OUT, f'govbuilding_{mode}.png'))]
    for fr, p in paths:
        sc.frame_set(fr)
        sc.render.filepath = p
        t = time.time()
        bpy.ops.render.render(write_still=True)
        print('FRAME', mode, fr, round(time.time() - t, 2), 's', flush=True)
