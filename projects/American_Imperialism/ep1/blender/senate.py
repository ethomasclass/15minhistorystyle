# Ep 1, chapter 6: the U.S. Senate chamber in the 1890s, in low light, built in Blender after the Flow plate
# f1_senate_chamber_1890s: the floor with its desks in curved rows facing the dais, the red carpet, buff walls with blue-grey
# panels and doors, the gallery all round above, and the glass ceiling (in the 1890s it was lit from above by gas jets, so
# at night the skylight glows a dim amber). One desk carries a tall stack of paper, never explained here (in chapter 8 it is
# revealed as the anti-annexation petition).
# Shots, keyed to the chapter 6 narration (public/audio/ch06_the_heist.words.json), back to back on the timeline:
#   S2  "kept stalling in the Senate"  (to "a stack")   the chamber from the gallery, dusk, a slow drift; the stack is a small
#                                                       pale block on one desk among the rows
#   S1  "a stack of paper"  (to the chapter's end + 2 s) close on one desk at desk-top height: only the edge of the stack, its
#                                                       top out of frame, the chamber dark and soft behind; a slow slide along it
#   xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python senate.py -- <out_dir> [scale%] [mode]
#   mode: a still, or several comma-separated: wide (S2), stack (S1), anim (the frames in $FRAMES)
import bpy, bmesh, math, os, sys, random, time
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/senate'
SCALE = int(argv[1]) if len(argv) > 1 else 100
MODES = (argv[2] if len(argv) > 2 else 'stack').split(',')
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


CH = 'ch06_the_heist'
SHOTS = [('S2', _wt(CH, 'kept stalling') - 0.05, _wt(CH, 'a stack of paper') - 0.05),
         ('S1', _wt(CH, 'a stack of paper') - 0.05, _wt(CH, 'a stack of paper', end=True) + 2.0)]
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
WALL, WALL_LT, PANEL, PANEL_DK = '#cdbb92', '#ddd0ae', '#6c7f96', '#56677c'
PILA, DOOR, DOOR_DK = '#bfa97c', '#5a3a24', '#432a1a'
DESK, DESK_DK, CHAIR, LEATHER = '#5a3320', '#45261a', '#4a2a1a', '#3e2a22'
PARA, PARA_DK, GBENCH = '#e3d7b8', '#c9bb98', '#6a4a30'
CEIL, CEIL_DK, COFF = '#c8b48a', '#9c8a66', '#6e7c8a'
IRON, DRAPE, GOLD = '#2e2a26', '#344a72', '#b8954e'
PAPER, PAPER2 = '#e6decb', '#d9cfb8'


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
    """an annular sector (degrees; 0 = toward -y from the centre c, positive toward +x), from z0 to z1"""
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


# the carpet: an image tile every 2 m, in world coordinates
carpet = bpy.data.materials.new('carpet')
carpet.use_nodes = True
cn = carpet.node_tree
ctc = cn.nodes.new('ShaderNodeTexCoord')
cmp_ = cn.nodes.new('ShaderNodeMapping')
cmp_.inputs['Scale'].default_value = (0.5, 0.5, 0.5)
cti = cn.nodes.new('ShaderNodeTexImage')
cti.image = bpy.data.images.load(os.path.join(HERE, 'assets', 'senate_carpet.png'))
cn.links.new(ctc.outputs['Object'], cmp_.inputs['Vector'])
cn.links.new(cmp_.outputs['Vector'], cti.inputs['Vector'])
cn.links.new(cti.outputs['Color'], cn.nodes['Principled BSDF'].inputs['Base Color'])
cn.nodes['Principled BSDF'].inputs['Roughness'].default_value = 1.0
cn.nodes['Principled BSDF'].inputs['Specular IOR Level'].default_value = 0.05

# ---- the room. The floor between the walls x = +-XF, y = YS (south) to YN (the dais wall, north); the floor walls rise to
# the gallery's parapet at ZG; the galleries step up behind to the outer walls; the ceiling at ZC with the skylight
XF, YS, YN, ZG = 10.0, -8.0, 8.0, 5.2
XO, YSO, YNO, ZGT, ZC = 14.5, -12.5, 12.5, 8.2, 12.0
fl = box('floor', -XF, YS, -0.05, XF, YN, 0.0, '#7a2c27')
recolor(fl, carpet)
# the floor walls: pilasters, blue-grey panels, doors; a cornice under the parapet
for side, (x0, y0, x1, y1, axis) in {'N': (-XF, YN, XF, YN + 0.4, 'x'), 'S': (-XF, YS - 0.4, XF, YS, 'x'),
                                     'W': (-XF - 0.4, YS, -XF, YN, 'y'), 'E': (XF, YS, XF + 0.4, YN, 'y')}.items():
    box('fw' + side, x0, y0, 0, x1, y1, ZG, WALL)
    L0, L1 = (x0, x1) if axis == 'x' else (y0, y1)
    nb = int((L1 - L0) / 2.6)
    step = (L1 - L0) / nb
    inward = {'N': (0, -1), 'S': (0, 1), 'W': (1, 0), 'E': (-1, 0)}[side]
    face = {'N': YN, 'S': YS, 'W': -XF, 'E': XF}[side]
    for k in range(nb + 1):                                  # pilasters
        u = L0 + k * step
        if axis == 'x':
            box(f'pil{side}{k}', u - 0.18, face + inward[1] * 0.12 if inward[1] < 0 else face, 0, u + 0.18, face if inward[1] < 0 else face + 0.12, ZG - 0.4, PILA)
        else:
            box(f'pil{side}{k}', face if inward[0] > 0 else face - 0.12, u - 0.18, 0, face + 0.12 if inward[0] > 0 else face, u + 0.18, ZG - 0.4, PILA)
    for k in range(nb):                                      # in each bay: a door at floor level, or a panel; a panel above
        u0, u1 = L0 + k * step + 0.4, L0 + (k + 1) * step - 0.4
        is_door = (k % 2 == 1) and not (side == 'N' and abs((u0 + u1) / 2) < 4)
        items = []
        if is_door:
            items.append(((u0 + 0.25, u1 - 0.25, 0.0, 2.7), DOOR, 0.05))
            items.append(((u0 + 0.4, u1 - 0.4, 0.2, 1.2), DOOR_DK, 0.06))
            items.append(((u0 + 0.4, u1 - 0.4, 1.4, 2.5), DOOR_DK, 0.06))
        else:
            items.append(((u0, u1, 0.9, 2.9), PANEL, 0.03))
            items.append(((u0 + 0.12, u1 - 0.12, 1.02, 2.78), PANEL_DK, 0.04))
        items.append(((u0, u1, 3.2, 4.6), PANEL, 0.03))
        for (a, b, z0, z1), col, dep in items:
            if axis == 'x':
                ya, yb = (face - dep, face) if inward[1] < 0 else (face, face + dep)
                box(f'pn{side}{k}{z0}', a, ya, z0, b, yb, z1, col)
            else:
                xa, xb = (face, face + dep) if inward[0] > 0 else (face - dep, face)
                box(f'pn{side}{k}{z0}', xa, a, z0, xb, b, z1, col)
    if axis == 'x':
        ya, yb = (face - 0.25, face) if inward[1] < 0 else (face, face + 0.25)
        box('corn' + side, x0, ya, ZG - 0.4, x1, yb, ZG - 0.1, WALL_LT)
    else:
        xa, xb = (face, face + 0.25) if inward[0] > 0 else (face - 0.25, face)
        box('corn' + side, xa, y0, ZG - 0.4, xb, y1, ZG - 0.1, WALL_LT)
# the gallery: a parapet round the floor, then five rows of benches stepping up to the outer walls
box('paraN', -XF - 0.4, YN, ZG, XF + 0.4, YN + 0.35, ZG + 0.95, PARA)
box('paraS', -XF - 0.4, YS - 0.35, ZG, XF + 0.4, YS, ZG + 0.95, PARA)
box('paraW', -XF - 0.35, YS, ZG, -XF, YN, ZG + 0.95, PARA)
box('paraE', XF, YS, ZG, XF + 0.35, YN, ZG + 0.95, PARA)
for nm_, (x0, y0, x1, y1) in {'N': (-XF - 0.45, YN - 0.05, XF + 0.45, YN + 0.4), 'S': (-XF - 0.45, YS - 0.4, XF + 0.45, YS + 0.05),
                              'W': (-XF - 0.4, YS, -XF + 0.05, YN), 'E': (XF - 0.05, YS, XF + 0.4, YN)}.items():
    box('pcap' + nm_, x0, y0, ZG + 0.95, x1, y1, ZG + 1.05, PARA_DK)
GROWS = 5
for k in range(GROWS):
    z = ZG + k * (ZGT - ZG) / GROWS
    d0 = 0.4 + k * 0.8
    for nm_, (x0, y0, x1, y1) in {'N': (-XO, YN + d0, XO, YN + d0 + 0.8), 'S': (-XO, YS - d0 - 0.8, XO, YS - d0),
                                  'W': (-XF - d0 - 0.8, YS - d0, -XF - d0, YN + d0), 'E': (XF + d0, YS - d0, XF + d0 + 0.8, YN + d0)}.items():
        box(f'gstep{nm_}{k}', x0, y0, ZG - 0.2, x1, y1, z + 0.02, PARA_DK)
        # the bench on this step
        if nm_ in 'NS':
            yy0, yy1 = (y0 + 0.3, y0 + 0.65) if nm_ == 'N' else (y1 - 0.65, y1 - 0.3)
            box(f'gb{nm_}{k}', x0 + 0.3, yy0, z, x1 - 0.3, yy1, z + 0.45, GBENCH)
            box(f'gbb{nm_}{k}', x0 + 0.3, yy1 - 0.08 if nm_ == 'N' else yy0, z + 0.45, x1 - 0.3, yy1 if nm_ == 'N' else yy0 + 0.08, z + 0.95, GBENCH)
        else:
            xx0, xx1 = (x1 - 0.65, x1 - 0.3) if nm_ == 'W' else (x0 + 0.3, x0 + 0.65)
            box(f'gb{nm_}{k}', xx0, y0 + 0.3, z, xx1, y1 - 0.3, z + 0.45, GBENCH)
            box(f'gbb{nm_}{k}', xx0 if nm_ == 'W' else xx1 - 0.08, y0 + 0.3, z + 0.45, xx0 + 0.08 if nm_ == 'W' else xx1, y1 - 0.3, z + 0.95, GBENCH)
for nm_, (x0, y0, x1, y1) in {'N': (-XO, YNO, XO, YNO + 0.4), 'S': (-XO, YSO - 0.4, XO, YSO), 'W': (-XO - 0.4, YSO, -XO, YNO), 'E': (XO, YSO, XO + 0.4, YNO)}.items():
    box('ow' + nm_, x0, y0, ZG - 0.2, x1, y1, ZC, WALL)
    n_ = 7 if nm_ in 'NS' else 9
    for k in range(n_):                                       # the gallery's doors and panels on the outer walls
        if nm_ in 'NS':
            u = -XO + (k + 0.5) * 2 * XO / n_
            yy = (y0 - 0.04, y0) if nm_ == 'N' else (y1, y1 + 0.04)
            box(f'og{nm_}{k}', u - 0.7, yy[0], ZGT + 0.6, u + 0.7, yy[1], ZGT + 3.0, PANEL if k % 2 else DOOR)
        else:
            u = YSO + (k + 0.5) * (YNO - YSO) / n_
            xx = (x1, x1 + 0.04) if nm_ == 'W' else (x0 - 0.04, x0)
            box(f'og{nm_}{k}', xx[0], u - 0.7, ZGT + 0.6, xx[1], u + 0.7, ZGT + 3.0, PANEL if k % 2 else DOOR)
# the ceiling: a flat coffered border round the skylight; the skylight a grid of glass panes on iron bars, glowing
SKX, SKY = 7.5, 5.5
for (x0, y0, x1, y1) in ((-XO - 0.4, -YNO - 0.4, XO + 0.4, -SKY), (-XO - 0.4, SKY, XO + 0.4, YNO + 0.4), (-XO - 0.4, -SKY, -SKX, SKY), (SKX, -SKY, XO + 0.4, SKY)):
    box(f'ceil{x0:.0f}{y0:.0f}', x0, y0, ZC, x1, y1, ZC + 0.3, CEIL)
cof = []
for i in range(-7, 7):
    for j in range(-6, 6):
        x, y = i * 2.0 + 1.0, j * 2.0 + 1.0
        if abs(x) < SKX + 0.6 and abs(y) < SKY + 0.6:
            continue
        cof.append((x - 0.7, y - 0.7, ZC - 0.02, x + 0.7, y + 0.7, ZC))
bm = bmesh.new()
for (x0, y0, z0, x1, y1, z1) in cof:
    bmesh.ops.create_cube(bm, size=1.0, matrix=__import__('mathutils').Matrix.LocRotScale(Vector(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)), None, Vector((x1 - x0, y1 - y0, z1 - z0))))
CG['obj_from_bm']('coffers', bm, COFF)
for (x0, y0, x1, y1) in ((-SKX - 0.6, -SKY - 0.6, SKX + 0.6, -SKY), (-SKX - 0.6, SKY, SKX + 0.6, SKY + 0.6), (-SKX - 0.6, -SKY, -SKX, SKY), (SKX, -SKY, SKX + 0.6, SKY)):
    box(f'skframe{x0:.0f}{y0:.0f}', x0, y0, ZC - 0.35, x1, y1, ZC, CEIL_DK)
SKM = emit('skylight', '#d9b878', 0.32)
gl = box('skyglass', -SKX, -SKY, ZC + 0.25, SKX, SKY, ZC + 0.3, '#ffffff')
recolor(gl, SKM)
bars = []
for k in range(-7, 8):
    bars.append((k * SKX / 7.5 - 0.04, -SKY, ZC + 0.1, k * SKX / 7.5 + 0.04, SKY, ZC + 0.24))
for k in range(-5, 6):
    bars.append((-SKX, k * SKY / 5.5 - 0.04, ZC + 0.1, SKX, k * SKY / 5.5 + 0.04, ZC + 0.24))
bm = bmesh.new()
for (x0, y0, z0, x1, y1, z1) in bars:
    bmesh.ops.create_cube(bm, size=1.0, matrix=__import__('mathutils').Matrix.LocRotScale(Vector(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)), None, Vector((x1 - x0, y1 - y0, z1 - z0))))
CG['obj_from_bm']('skybars', bm, IRON)
EMB = emit('skyemblem', '#b88a4a', 0.5)
for i in range(-3, 4):                                       # painted emblems in the glass, one per pane row (as in the plate)
    for j in (-2, 2):
        e_ = ico(f'emb{i}{j}', (i * 2.0, j * 2.2, ZC + 0.22), 0.28, '#ffffff', 1, (1, 1, 0.1))
        recolor(e_, EMB)

# ---- the dais on the north side: two raised platforms, the clerks' long desk, the presiding officer's desk and chair, the
# blue drapery behind with a gold fringe, flags on poles either side
box('dais1', -5.0, 3.6, 0, 5.0, YN, 0.3, DESK_DK)
box('dais2', -2.6, 5.4, 0.3, 2.6, YN, 0.85, DESK_DK)
box('dais1c', -5.05, 3.55, 0.3, 5.05, YN, 0.34, DESK)
box('clerk', -3.8, 3.75, 0.3, 3.8, 4.45, 1.35, DESK)
box('clerkt', -3.9, 3.7, 1.35, 3.9, 4.5, 1.42, DESK_DK)
for k in range(7):
    x = -3.3 + k * 1.1
    box(f'clp{k}', x - 0.4, 3.72, 0.5, x + 0.4, 3.75, 1.2, DESK_DK)
box('pres', -1.6, 5.6, 0.85, 1.6, 6.3, 2.05, DESK)
box('prest', -1.7, 5.55, 2.05, 1.7, 6.35, 2.13, DESK_DK)
for k in range(3):
    x = -1.05 + k * 1.05
    box(f'prp{k}', x - 0.38, 5.57, 1.05, x + 0.38, 5.6, 1.9, DESK_DK)
box('pchair', -0.4, 6.6, 0.85, 0.4, 7.1, 1.35, '#3a2418')
box('pchairb', -0.42, 7.0, 1.35, 0.42, 7.15, 2.6, '#3a2418')
box('drape', -2.4, YN - 0.12, 1.0, 2.4, YN - 0.02, 4.7, DRAPE)
for k in range(9):                                           # folds
    x = -2.3 + k * 0.575
    box(f'fold{k}', x - 0.1, YN - 0.2, 1.0, x + 0.1, YN - 0.1, 4.7, '#2b3d60' if k % 2 else '#3e5684')
box('valance', -2.7, YN - 0.3, 4.4, 2.7, YN - 0.02, 4.9, DRAPE)
box('fringe', -2.7, YN - 0.32, 4.3, 2.7, YN - 0.28, 4.42, GOLD)
mesh_from('pediment', [(-1.2, YN - 0.1, 4.9), (1.2, YN - 0.1, 4.9), (0, YN - 0.1, 5.15), (-1.2, YN - 0.25, 4.9), (1.2, YN - 0.25, 4.9), (0, YN - 0.25, 5.15)],
          [(0, 1, 2), (5, 4, 3), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)], GOLD)
FLAG = os.path.join(HERE, 'assets', 'us_flag_44.png')
for sx in (-1, 1):
    px = sx * 3.0
    cyl(f'fpole{sx}', (px, 7.4, 0.85), (px, 7.4, 4.4), 0.03, 0.025, GOLD, n=6)
    ico(f'ffin{sx}', (px, 7.4, 4.45), 0.07, GOLD, 1)
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=8, y_subdivisions=8, size=1)
    fo = bpy.context.active_object
    fo.name = f'dflag{sx}'
    fo.scale = (0.9, 1.6, 1)                                 # hanging from the pole top, the stripes vertical
    fo.rotation_euler = (math.radians(90), 0, math.radians(90 + sx * 25))
    fo.location = (px + sx * 0.03, 7.4 - 0.4, 3.55)
    fm = bpy.data.materials.new(f'dflag{sx}')
    fm.use_nodes = True
    ft = fm.node_tree.nodes.new('ShaderNodeTexImage')
    ft.image = bpy.data.images.load(FLAG)
    fm.node_tree.links.new(ft.outputs['Color'], fm.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
    fm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 1.0
    fo.data.materials.append(fm)
    for p in fo.data.polygons:
        p.use_smooth = False
    for v in fo.data.vertices:                               # soft folds
        v.co.z += 0.05 * math.sin(v.co.x * 14.0)

# ---- the desks: five curved rows round the dais, each row a little higher, with aisles; each desk the 1819 pattern
# (a mahogany box desk with a sloped lid) and a leather armchair behind it, facing the dais
C = (0.0, 4.2)
ROWS = [5.4, 6.9, 8.4, 9.9, 11.4]
bm_step = bmesh.new()
for k, r in enumerate(ROWS):
    arc_block(bm_step, C, r - 0.75, r + 0.75 if k < len(ROWS) - 1 else r + 6.0, -80, 80, 0.0, 0.1 * (k + 1), 28)
bmesh.ops.recalc_face_normals(bm_step, faces=bm_step.faces)
steps = CG['obj_from_bm']('rowsteps', bm_step, '#7a2c27')
recolor(steps, carpet)
clip = box('clip', -XF + 0.01, YS + 0.01, -1, XF - 0.01, 3.5, 2, '#ff00ff')
clip.hide_render = True
clip.display_type = 'WIRE'
md = steps.modifiers.new('clip', 'BOOLEAN')
md.operation, md.object, md.solver = 'INTERSECT', clip, 'EXACT'
DESKS = []


def desk(name, x, y, z, yaw):
    root = empty(name, (0, 0, 0))
    box(name + 'body', -0.36, -0.24, 0, 0.36, 0.24, 0.68, DESK, root)
    box(name + 'kick', -0.33, -0.21, 0, 0.33, 0.21, 0.08, DESK_DK, root)
    mesh_from(name + 'lid', [(-0.38, -0.27, 0.68), (0.38, -0.27, 0.68), (0.38, 0.27, 0.68), (-0.38, 0.27, 0.68),
                             (-0.38, -0.27, 0.76), (0.38, -0.27, 0.76), (0.38, 0.27, 0.72), (-0.38, 0.27, 0.72)],
              [(3, 2, 1, 0), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)], DESK_DK, root)
    box(name + 'pan', -0.28, 0.24, 0.12, 0.28, 0.255, 0.58, DESK_DK, root)
    # the chair behind (on the -y side, away from the dais)
    box(name + 'seat', -0.26, -0.82, 0.42, 0.26, -0.36, 0.52, LEATHER, root)
    box(name + 'cbase', -0.2, -0.76, 0, 0.2, -0.42, 0.42, CHAIR, root)
    box(name + 'cback', -0.27, -0.9, 0.52, 0.27, -0.8, 1.08, LEATHER, root)
    for sx in (-1, 1):
        box(f'{name}carm{sx}', sx * 0.27 - 0.03, -0.84, 0.52, sx * 0.27 + 0.03, -0.42, 0.72, CHAIR, root)
    root.location = (x, y, z)
    root.rotation_euler[2] = yaw
    return root


STACK_AT = None
for k, r in enumerate(ROWS):
    z = 0.1 * (k + 1)
    span = min(70.0, math.degrees(math.asin(min(1.0, (XF - 1.2) / r))))
    nd = int(r * math.radians(span) / 1.02)
    for side in (-1, 1):
        for j in range(nd):
            a = side * (math.degrees(0.75 / r) + j * math.degrees(1.02 / r))
            if a * side > span:
                break
            if 34 < abs(a) < 34 + math.degrees(1.0 / r):       # the side aisles
                continue
            ar = math.radians(a)
            x, y = C[0] + r * math.sin(ar), C[1] - r * math.cos(ar)
            if y < YS + 1.2:
                continue
            d_ = desk(f'desk{k}_{side}_{j}', x, y, z, ar)
            DESKS.append(d_)
            if k == 2 and side < 0 and j == 2:
                STACK_AT = (x, y, z, ar)
# the stack: some three hundred loose folio sheets in uneven bundles on one desk's lid (it slopes; the stack sits on a
# flat board laid across it), the edges catching the light
sx_, sy_, sz_, sa_ = STACK_AT
ST = empty('stack', (0, 0, 0))
box('stackboard', -0.36, -0.24, 0.76, 0.36, 0.26, 0.78, DESK_DK, ST)
rr = random.Random(21)
layers = {PAPER: [], PAPER2: []}
z = 0.78
for k in range(80):
    h = rr.uniform(0.0028, 0.0048) if rr.random() < 0.85 else rr.uniform(0.006, 0.009)
    a = math.radians(rr.uniform(-1.0, 1.0))
    dx, dy = rr.uniform(-0.005, 0.005), rr.uniform(-0.005, 0.005)
    W2, D2 = 0.2, 0.15
    pts = [(-W2, -D2), (W2, -D2), (W2, D2), (-W2, D2)]
    pts = [(dx + px * math.cos(a) - py * math.sin(a), dy + px * math.sin(a) + py * math.cos(a)) for px, py in pts]
    layers[PAPER if k % 3 else PAPER2].append((pts, z, z + h))
    z += h
STACK_TOP = z
for col, ls in layers.items():
    bm = bmesh.new()
    for pts, z0, z1 in ls:
        lo = [bm.verts.new((px, py, z0)) for px, py in pts]
        hi = [bm.verts.new((px, py, z1)) for px, py in pts]
        bm.faces.new(lo[::-1]); bm.faces.new(hi)
        for i in range(4):
            bm.faces.new((lo[i], lo[(i + 1) % 4], hi[(i + 1) % 4], hi[i]))
    ob = CG['obj_from_bm'](f'stack{col}', bm, col)
    ob.parent = ST
cyl('stackstring', (0, -0.16, 0.78), (0, -0.16, z + 0.002), 0.003, 0.003, '#8a7350', n=4, parent=ST)
ST.location = (sx_, sy_, sz_)
ST.rotation_euler[2] = sa_
print('STACK', tuple(round(v, 2) for v in (sx_, sy_, sz_)), 'height', round(STACK_TOP - 0.78, 3))

# ---- the light: the glow from the skylight (the gas above the glass), dim gas brackets round the gallery, a little warm
# fill; dusk outside is nowhere (no windows on the floor)
bpy.data.objects['sun'].data.energy = 0.0
sk = bpy.data.lights.new('skylight', 'AREA')
sk.shape, sk.size, sk.size_y = 'RECTANGLE', SKX * 2, SKY * 2
sk.energy, sk.color = 1300, (1.0, 0.82, 0.58)
sko = bpy.data.objects.new('skylight', sk)
sc.collection.objects.link(sko)
sko.location = (0, 0, ZC + 0.05)
GAS = []
for i, (x, y) in enumerate([(-XF - 0.1, yy) for yy in (-5, 0, 5)] + [(XF + 0.1, yy) for yy in (-5, 0, 5)] + [(xx, YS - 0.1) for xx in (-6, 0, 6)] + [(xx, YN + 0.1) for xx in (-7, 7)]):
    lt = bpy.data.lights.new(f'gas{i}', 'POINT')
    lt.energy, lt.color, lt.shadow_soft_size = 22, (1.0, 0.72, 0.42), 0.1
    lo = bpy.data.objects.new(f'gas{i}', lt)
    sc.collection.objects.link(lo)
    inward = Vector((-x, -y, 0)).normalized() * 0.4 if abs(x) > XF - 0.5 or abs(y) > 7.5 else Vector()
    lo.location = Vector((x, y, ZG - 0.9)) + Vector((1 if x < -XF + 1 else (-1 if x > XF - 1 else 0), 1 if y < YS + 1 else (-1 if y > YN - 1 else 0), 0)) * 0.45
    GAS.append(lt)
    gb = ico(f'gasglobe{i}', tuple(lo.location), 0.13, '#ffffff', 1)
    recolor(gb, emit(f'gasg{i}', '#ffd9a0', 2.5, shadow=False))
    cyl(f'gasarm{i}', tuple(lo.location - Vector((1 if x < -XF + 1 else (-1 if x > XF - 1 else 0), 1 if y < YS + 1 else (-1 if y > YN - 1 else 0), 0)) * 0.45), tuple(lo.location - Vector((0, 0, 0.12))), 0.02, 0.02, GOLD, n=5)
dl = bpy.data.lights.new('desklight', 'SPOT')               # the stack's desk sits in a pool from the skylight
dl.energy, dl.color, dl.spot_size, dl.spot_blend, dl.shadow_soft_size = 220, (1.0, 0.84, 0.62), math.radians(16), 0.8, 0.3
dlo = bpy.data.objects.new('desklight', dl)
sc.collection.objects.link(dlo)
dlo.location = (sx_ + 1.0, sy_ + 1.5, ZC - 0.5)
dlo.rotation_euler = (Vector((sx_, sy_, sz_ + 0.9)) - dlo.location).to_track_quat('-Z', 'Y').to_euler()
kl = bpy.data.lights.new('stackkey', 'AREA')                 # a soft warm light across the stack's edges from the dais side
kl.energy, kl.size, kl.color = 14, 0.6, (1.0, 0.8, 0.55)
klo = bpy.data.objects.new('stackkey', kl)
sc.collection.objects.link(klo)
fwd_ = Vector((math.sin(sa_), -math.cos(sa_), 0))
rgt_ = Vector((math.cos(sa_), math.sin(sa_), 0))
klo.location = Vector((sx_, sy_, sz_ + 1.0)) - rgt_ * 0.7 - fwd_ * 0.9 + Vector((0, 0, 0.5))
klo.rotation_euler = (Vector((sx_, sy_, sz_ + 0.95)) - klo.location).to_track_quat('-Z', 'Y').to_euler()
for lt in GAS:
    rg = random.Random(hash(lt.name) % 977)
    for fr in range(0, N, 3):
        lt.energy = 22 * (1 + rg.uniform(-0.05, 0.05))
        lt.keyframe_insert('energy', frame=fr)
    for kp in lt.animation_data.action.fcurves[0].keyframe_points:
        kp.interpolation = 'CONSTANT'

# ---- the finishing pass, then the cameras
LK = {'__name__': 'look'}
exec(compile(open(os.path.join(HERE, 'look.py')).read(), os.path.join(HERE, 'look.py'), 'exec'), LK)
LK['finish'](sc, fill_strength=0.12, shadow_fill='#8a8f9c', haze=(60.0, 400.0, 0.0), rules={
    WALL: (0.10, 0.4, None, 1.0), PARA: (0.08, 0.4, None, 1.0), CEIL: (0.08, 0.3, None, 1.0), PANEL: (0.08, 0.6, None, 1.0),
    DESK: (0.07, 1.5, None, 1.0), DESK_DK: (0.07, 1.5, None, 1.0), LEATHER: (0.08, 1.5, None, 1.0), PAPER: (0.02, 4.0, None, 1.0),
    PAPER2: (0.02, 4.0, None, 1.0), DRAPE: (0.12, 1.0, None, 1.0)})
ee = sc.eevee
ee.use_bloom, ee.bloom_threshold, ee.bloom_intensity, ee.bloom_radius = True, 1.4, 0.04, 5.0
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
SP = Vector((sx_, sy_, sz_ + 0.85))
fwd = Vector((math.sin(sa_), -math.cos(sa_), 0))            # from the dais toward this desk's chair
rgt = Vector((math.cos(sa_), math.sin(sa_), 0))
# S1: low across the desk lid from beside the stack, the stack's edge at frame right, its top out of frame
c1a = SP + rgt * -1.05 + fwd * 0.05 + Vector((0, 0, -0.03))
c1b = SP + rgt * -0.98 + fwd * -0.06 + Vector((0, 0, -0.03))
l1a = SP + rgt * 1.0 + fwd * -0.62 + Vector((0, 0, 0.06))
KEYS = [(FS['S2'][0], (1.2, YS - 2.6, ZG + 3.3), (0.0, 3.0, 3.6), 15), (FS['S2'][1] - 1, (0.5, YS - 2.4, ZG + 3.2), (0.0, 3.0, 3.6), 15),
        (FS['S1'][0], tuple(c1a), tuple(l1a), 50), (N - 1, tuple(c1b), tuple(l1a + rgt * 0.05), 50)]
CUTS = {FS['S2'][1] - 1}
for fr, pos, look, lens in KEYS:
    cam.location = pos; cam.keyframe_insert('location', frame=fr)
    tgt.location = look; tgt.keyframe_insert('location', frame=fr)
    cam.data.lens = lens; cam.data.keyframe_insert('lens', frame=fr)
for ad in (cam.animation_data, tgt.animation_data, cam.data.animation_data):
    for fc in ad.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT' if int(kp.co[0]) in CUTS else 'LINEAR'
cam.data.dof.use_dof = True
for fr, dist, fs in ((FS['S2'][0], 16.0, 5.6), (FS['S1'][0], (SP - c1a).length - 0.16, 2.4)):
    cam.data.dof.focus_distance, cam.data.dof.aperture_fstop = dist, fs
    cam.data.dof.keyframe_insert('focus_distance', frame=fr)
    cam.data.dof.keyframe_insert('aperture_fstop', frame=fr)
for fc in cam.data.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = 'CONSTANT'
sc.render.resolution_percentage = SCALE
os.makedirs(OUT, exist_ok=True)
STILL = {'wide': FS['S2'][0] + 30, 'stack': FS['S1'][0] + 30}
for mode in MODES:
    if mode == 'anim':
        fr_ = os.environ.get('FRAMES', '')
        paths = [(fr, os.path.join(OUT, f'{fr:04d}.png')) for fr in (range(N) if fr_ == 'all' else [int(v) for v in fr_.split(',') if v])]
    else:
        paths = [(STILL[mode], os.path.join(OUT, f'senate_{mode}.png'))]
    for fr, p in paths:
        sc.frame_set(fr)
        sc.render.filepath = p
        t = time.time()
        bpy.ops.render.render(write_still=True)
        print('FRAME', mode, fr, round(time.time() - t, 2), 's', flush=True)
