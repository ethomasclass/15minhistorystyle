# Ep 1, chapter 6: the landing party from USS Boston marching up a Honolulu street, 16 January 1893, built in the
# diorama style after the Flow plate h2_honolulu_street_1893 and checked against the period photographs
# (img/archival ch06_king_street_arion_hall_1898book, ch06_government_building_aliiolani_hale_1898book,
# ch06_uss_boston_land_drill_1890s): a wide dirt street with the horse-tram rails, wooden and lava-stone business
# blocks with two-storey verandas, false-fronted stores, palms, a banyan over the street, and the Government Building
# (Aliʻiōlani Hale) with its clock tower at the end, the Hawaiian flag still flying. The column marches up the street toward
# it (they were bound for Arion Hall, across from the palace), in step: an officer leading, the Marine guard (dark blue,
# sky-blue trousers, white belts), the colour bearer with the 44-star ensign, a second officer and a company of seamen
# (blue, canvas leggings), rifles at right shoulder arms.
# Shot, keyed to the chapter 6 narration (public/audio/ch06_the_heist.words.json):
#   L1  "Minister, here, means diplomat ... is called"   low behind the column, a little to its left: the column marches away
#        up King Street toward the Hawaiian flag, the camera dollying slowly after it so it recedes (until "interventionism")
#   xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python landing.py -- <out_dir> [scale%] [mode: march|anim]
#   mode march renders one still (FRAME, default the middle); anim renders FRAMES (comma list) or the whole shot
import bpy, bmesh, math, os, sys, random
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/landing'
SCALE = int(argv[1]) if len(argv) > 1 else 100
MODE = argv[2] if len(argv) > 2 else 'march'
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
person, stand, bake, WALK = PG['person'], PG['stand'], PG['bake'], PG['WALK']
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
T0 = _wt(STEM, 'Minister here') - 0.05                       # follows harbor.py's H2
T_END = _wt(STEM, 'interventionism') - 0.05                  # the vocab card takes over
N = int(round((T_END - T0) * FPS))
sc.frame_start, sc.frame_end = 0, N - 1
TQ = [math.floor(f / FPS * 12) / 12 for f in range(N)]       # animation time, stepped at 12 fps
print('LANDING TIMES', round(T0, 2), round(T_END, 2), 'frames', N)
rnd = random.Random(1893)

# ---- palette (from the Flow plate h2)
ROAD, ROAD_LT, ROAD_DK, RUT = '#c9a671', '#d6b885', '#b8966a', '#ad8c60'
VERGE, LAWN = '#7c8a46', '#86914c'
SALMON, SALMON_DK = '#c98b68', '#b3765a'
CLAP_BLUE, CLAP_TAN, CLAP_CREAM, CLAP_BRN = '#7f8f94', '#b08e68', '#d8cbab', '#8a6a4c'
STONE, STONE_DK = '#8a8273', '#6f685d'
BRICK = '#9a4c3b'
TRIM, TRIM_DK, GLASS, DOOR = '#ece4cf', '#5a4636', '#2f3432', '#4a3628'
ROOF_TIN, ROOF_TIN2, ROOF_DK = '#7b8a90', '#6c7478', '#5c574f'
POST = '#e6ddc6'
GOV, GOV_LT, GOV_DK, OPEN = '#d6c9ab', '#e5dcc5', '#bfb08f', '#3a3933'
TREE = ['#3f5233', '#4a5f38', '#58703c']
TRUNK, BTRUNK = '#6b5442', '#5e5247'
IRON = '#2f2e2b'


def adopt(parent, before):
    for ob in bpy.data.objects:
        if ob not in before and ob.parent is None and ob is not parent:
            ob.parent = parent


def line(name, p0, p1, r=0.03, col=IRON):
    return cyl(name, p0, p1, r, r, col, n=4)


def flag(name, png, L, H, loc, rot_z=0.0, wave=0.045):
    """a flag on a subdivided plane in metres (hoist at local x = 0, flying toward +x), waving at 12 fps"""
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=24, y_subdivisions=12, size=1)
    fl = bpy.context.active_object
    fl.name = name
    for v in fl.data.vertices:
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
    wv = fl.modifiers.new('wave', 'WAVE')
    wv.use_x, wv.use_y = True, False
    wv.height, wv.width, wv.speed, wv.narrowness = wave * L, L * 0.33, 0.05 * L, 1.0
    wv.start_position_x = -0.3 * L
    fl.location = loc
    fl.rotation_euler = (math.pi / 2, 0, rot_z)
    ph = rnd.uniform(0, 30)
    for f in range(N):
        wv.time_offset = ph + f - math.floor(f / FPS * 12) / 12 * FPS
        wv.keyframe_insert('time_offset', frame=f)
    for fc in fl.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'
    return fl


def blobs(name, items, col):
    """many low-poly lumps in one mesh (canopies): items are (centre, radius, squash, seed)"""
    bm = bmesh.new()
    for loc, r, sq, seed in items:
        rr = random.Random(seed)
        ret = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=r)
        for v in ret['verts']:
            v.co = Vector((v.co.x * sq[0] * (1 + rr.uniform(-0.15, 0.15)), v.co.y * sq[1] * (1 + rr.uniform(-0.15, 0.15)),
                           v.co.z * sq[2] * (1 + rr.uniform(-0.15, 0.15)))) + Vector(loc)
    return CG['obj_from_bm'](name, bm, col)


def ground(name, x0, x1, y0, y1, nx, ny, hfun, col, seed=5, jit=0.3):
    rr = random.Random(seed)
    verts, faces = [], []
    for j in range(ny + 1):
        for i in range(nx + 1):
            x = x0 + (x1 - x0) * i / nx + (rr.uniform(-jit, jit) * (x1 - x0) / nx if 0 < i < nx else 0.0)
            y = y0 + (y1 - y0) * j / ny + (rr.uniform(-jit, jit) * (y1 - y0) / ny if 0 < j < ny else 0.0)
            verts.append((x, y, hfun(x, y)))
    for j in range(ny):
        for i in range(nx):
            a = j * (nx + 1) + i
            if (i + j) % 2:
                faces += [(a, a + 1, a + nx + 2), (a, a + nx + 2, a + nx + 1)]
            else:
                faces += [(a, a + 1, a + nx + 1), (a + 1, a + nx + 2, a + nx + 1)]
    return mesh_from(name, verts, faces, col)


def arch_panel(name, x0, x1, y0, y1, z0, zs, z1, col, inset=0.22):
    """a wall panel between z0 and z1 with a round-arched opening from z0 up to the spring line zs (after coldopen.py)"""
    r = (x1 - x0) / 2 - inset
    cx = (x0 + x1) / 2
    pts = [(x0, z1), (x0, z0), (cx - r, z0), (cx - r, zs)]
    pts += [(cx - r * math.cos(math.pi * k / 10), zs + r * math.sin(math.pi * k / 10)) for k in range(1, 10)]
    pts += [(cx + r, zs), (cx + r, z0), (x1, z0), (x1, z1)]
    return prism(name, pts[::-1], y0, y1, col)


# ================================================================ the street: faceted dirt, ruts, verges, tram rails
SW = 10.6                                                     # building fronts at x = +-SW; verandas reach to +-8.2
Y0, Y1 = -70.0, 82.0                                          # the street's length; the square opens beyond Y1
ground('street', -SW, SW, Y0, Y1, 9, 60, lambda x, y: 0.02 * math.sin(x * 1.7 + y * 0.9), ROAD, jit=0.35)
rr = random.Random(3)
CAMY_R = -24.0
RV, RF = [], []
for k in range(260):                                          # ruts and wheel tracks: long thin darker and lighter streaks
    x = rr.choice([-5.6, -4.1, -1.2, 0.3, 2.6, 4.0]) + rr.uniform(-0.6, 0.6)
    y = rr.uniform(Y0, Y1)
    sz = 0.3 + 0.7 * min(1.0, max(0.0, (y - CAMY_R) / 40.0))   # finer near the camera
    Ls, w = rr.uniform(2.5, 9.0) * sz, rr.uniform(0.06, 0.22) * sz
    a = len(RV)
    RV += [(x, y, 0.035), (x + w * 0.4, y + Ls, 0.035), (x + w, y + Ls * 0.3, 0.035)]
    RF.append((a, a + 1, a + 2))
mesh_from('ruts', RV[:len(RV) // 2], RF[:len(RF) // 2], RUT)
mesh_from('tracks', [(x, y, z + 0.002) for x, y, z in RV[len(RV) // 2:]], [tuple(i - len(RV) // 2 for i in f) for f in RF[len(RF) // 2:]], ROAD_LT)
TRAM = (-4.6, -3.2)                                           # the horse-tram track (King Street, 1888)
for x in TRAM:                                                # the rails lie flush in the dirt
    box(f'rail{x}', x - 0.035, Y0, 0.0, x + 0.035, Y1 + 20, 0.045, '#7d7466')
    box(f'railb{x}', x - 0.25, Y0, 0.0, x + 0.25, Y1 + 20, 0.04, ROAD_DK)
for side in (-1, 1):                                          # grass verges and plank sidewalks under the verandas
    box(f'verge{side}', side * 7.6 - 0.75, Y0, 0.0, side * 7.6 + 0.75, Y1, 0.04, VERGE)
    box(f'walk{side}', min(side * 8.35, side * SW), Y0, 0.0, max(side * 8.35, side * SW), Y1, 0.14, '#9c8667')
    box(f'curb{side}', side * 8.35 - 0.08, Y0, 0.0, side * 8.35 + 0.08, Y1, 0.18, '#8b7558')
# beyond the street: the square, lawns and the drive before the Government Building
GY = 106.0                                                    # its front (the arcade line)
box('square', -70, Y1, -0.02, 70, GY, 0.02, ROAD)
box('lawnL', -62, Y1 + 8, 0.0, -6, GY - 6, 0.06, LAWN)
box('lawnR', 6, Y1 + 8, 0.0, 62, GY - 6, 0.06, LAWN)
box('backland', -400, GY + 1, -0.02, 400, 900, 0.03, LAWN)
box('sideland', -400, Y0 - 40, -0.1, 400, Y1, -0.05, LAWN)
for side in (-1, 1):                                          # the iron fence with stone posts round the grounds
    xs = [side * 6 + side * k * 2.8 for k in range(20)]
    for k, x in enumerate(xs):
        box(f'fpost{side}{k}', x - 0.25, Y1 + 7.7, 0.0, x + 0.25, Y1 + 8.2, 1.3 + (0.35 if k == 0 else 0.0), '#d9cfb6')
        if k:
            for j in range(7):
                xx = xs[k - 1] + (x - xs[k - 1]) * (j + 0.5) / 7
                box(f'fbar{side}{k}{j}', xx - 0.025, Y1 + 7.9, 0.0, xx + 0.025, Y1 + 8.0, 1.1, IRON)
            box(f'frail{side}{k}', min(x, xs[k - 1]), Y1 + 7.88, 1.0, max(x, xs[k - 1]), Y1 + 8.02, 1.08, IRON)
    ico(f'gball{side}', (side * 6, Y1 + 7.95, 1.85), 0.3, '#d9cfb6', 1)

# ================================================================ Aliʻiōlani Hale, the Government Building (1874)
GX0, GX1, GD = -40.0, 40.0, 20.0
GH1, GH2 = 7.4, 14.2                                          # upper floor level, cornice
box('g_core', GX0 + 3, GY + 3.0, 0.0, GX1 - 3, GY + GD, GH2, GOV)
box('g_base', GX0, GY - 0.6, 0.0, GX1, GY + 0.4, 0.9, GOV_DK)
for side in (-1, 1):                                          # the wings: an arcade below, a colonnade above
    x0, x1 = (6.0, GX1 - 5.0) if side > 0 else (GX0 + 5.0, -6.0)
    nb = 6
    bw = (x1 - x0) / nb
    for k in range(nb):
        bx0 = x0 + k * bw
        arch_panel(f'g_arc{side}{k}', bx0, bx0 + bw, GY - 0.2, GY + 0.4, 0.9, 4.2, GH1, GOV, inset=0.45)
        xc = bx0 + bw / 2
        box(f'g_dk{side}{k}', xc - 1.0, GY + 2.9, 0.9, xc + 1.0, GY + 3.0, 4.8, OPEN)            # doors at the back of the arcade
        box(f'g_dk2{side}{k}', xc - 0.7, GY + 2.9, GH1 + 0.6, xc + 0.7, GY + 3.0, GH1 + 3.8, OPEN)
    box(f'g_floor{side}', x0, GY - 0.3, GH1 - 0.35, x1, GY + 3.0, GH1, GOV_LT)
    box(f'g_ent{side}', x0, GY - 0.35, GH2 - 1.4, x1, GY + 3.0, GH2, GOV)
    box(f'g_cor{side}', x0 - 0.3, GY - 0.7, GH2 - 0.3, x1 + 0.3, GY + 3.0, GH2 + 0.1, GOV_LT)
    for k in range(nb + 1):                                    # paired columns over the piers
        x = x0 + k * bw
        for dx in (-0.35, 0.35):
            cyl(f'g_col{side}{k}{dx}', (x + dx, GY + 0.1, GH1), (x + dx, GY + 0.1, GH2 - 1.4), 0.2, 0.17, GOV_LT, n=10)
    for k in range(nb):                                        # the upper balustrade between the columns
        bx0 = x0 + k * bw + 0.6
        box(f'g_brl{side}{k}', bx0, GY - 0.05, GH1 + 0.95, bx0 + bw - 1.2, GY + 0.25, GH1 + 1.1, GOV_LT)
        for j in range(8):
            xb = bx0 + 0.15 + j * (bw - 1.5) / 7
            box(f'g_bal{side}{k}{j}', xb - 0.05, GY + 0.02, GH1, xb + 0.05, GY + 0.18, GH1 + 0.95, GOV_LT)
    box(f'g_par{side}', x0, GY - 0.2, GH2 + 0.1, x1, GY + 0.2, GH2 + 1.2, GOV_LT)              # the roof parapet
    for k in range(int((x1 - x0) / 0.5)):
        xb = x0 + 0.25 + k * 0.5
        box(f'g_pg{side}{k}', xb - 0.08, GY - 0.25, GH2 + 0.35, xb + 0.08, GY - 0.15, GH2 + 0.95, GOV_DK)
    # end pavilions, solid, with tall windows
    px0, px1 = (GX1 - 5.0, GX1) if side > 0 else (GX0, GX0 + 5.0)
    box(f'g_pav{side}', px0, GY - 1.0, 0.0, px1, GY + GD, GH2 + 0.8, GOV)
    for zw in (1.6, GH1 + 1.0):
        box(f'g_pw{side}{zw}', (px0 + px1) / 2 - 0.75, GY - 1.06, zw, (px0 + px1) / 2 + 0.75, GY - 0.98, zw + 3.0, OPEN)
        box(f'g_pwc{side}{zw}', (px0 + px1) / 2 - 1.0, GY - 1.2, zw + 3.0, (px0 + px1) / 2 + 1.0, GY - 0.98, zw + 3.35, GOV_LT)
    box(f'g_pcor{side}', px0 - 0.3, GY - 1.3, GH2 + 0.8, px1 + 0.3, GY + GD, GH2 + 1.3, GOV_LT)
    for z in range(1, int(GH2), 1):                            # quoins on the pavilion corners
        for xq in (px0 - 0.05, px1 - 0.45):
            box(f'g_q{side}{z}{xq:.0f}', xq, GY - 1.08, z - 0.4, xq + 0.5, GY - 0.9, z, GOV_LT)
# the roof (a low hip behind the parapet)
mesh_from('g_roof', [(GX0 + 2, GY + 0.5, GH2), (GX1 - 2, GY + 0.5, GH2), (GX1 - 2, GY + GD, GH2), (GX0 + 2, GY + GD, GH2),
                     (GX0 + 10, GY + 9, GH2 + 3.2), (GX1 - 10, GY + 9, GH2 + 3.2)], [(0, 1, 5, 4), (2, 3, 4, 5), (3, 0, 4), (1, 2, 5)], '#6f7375')
# the clock tower: shaft with the entrance arch, an arched stage, the clock stage, a balustraded top with finials
TX0, TX1, TY0 = -5.2, 5.2, GY - 2.6
box('t_shaft', TX0, TY0, 0.0, TX1, TY0 + 9.0, GH2 + 1.2, GOV)
arch_panel('t_door', -2.2, 2.2, TY0 - 0.25, TY0 + 0.05, 0.9, 4.6, 6.4, GOV_LT, inset=0.35)
box('t_doorin', -1.85, TY0 + 0.6, 0.9, 1.85, TY0 + 0.7, 6.2, OPEN)
box('t_dsides', -1.86, TY0 - 0.2, 0.9, 1.86, TY0 + 0.62, 0.95, GOV_DK)
for k in range(6):                                            # steps up to the entrance
    box(f't_step{k}', -4.0 - k * 0.3, TY0 - 0.3 - (k + 1) * 0.42, 0.0, 4.0 + k * 0.3, TY0 - 0.3 - k * 0.42, 0.9 - k * 0.15, GOV_DK if k % 2 else GOV_LT)
box('t_win1', -1.0, TY0 - 0.06, GH1 + 0.8, 1.0, TY0 + 0.02, GH1 + 4.2, OPEN)
box('t_win1c', -1.4, TY0 - 0.25, GH1 + 4.2, 1.4, TY0 + 0.02, GH1 + 4.6, GOV_LT)
for xq in (TX0 - 0.05, TX1 - 0.45):
    for z in range(1, int(GH2 + 1)):
        box(f't_q{xq:.0f}{z}', xq, TY0 - 0.08, z - 0.45, xq + 0.5, TY0 + 0.1, z, GOV_LT)
Z1, Z2, Z3 = GH2 + 1.2, GH2 + 7.2, GH2 + 13.0                # the arched stage, the clock stage, the top
box('t_band1', TX0 - 0.35, TY0 - 0.35, Z1 - 0.1, TX1 + 0.35, TY0 + 9.35, Z1 + 0.4, GOV_LT)
box('t_stage', TX0 + 0.2, TY0 + 0.2, Z1, TX1 - 0.2, TY0 + 8.8, Z2, GOV)
for k, x in enumerate((-2.9, 0.0, 2.9)):                      # three tall arched openings with columns
    arch_panel(f't_arch{k}', x - 1.45, x + 1.45, TY0 + 0.05, TY0 + 0.25, Z1 + 0.4, Z2 - 2.2, Z2 - 0.2, GOV, inset=0.35)
    box(f't_ain{k}', x - 1.1, TY0 + 1.2, Z1 + 0.4, x + 1.1, TY0 + 1.3, Z2 - 0.6, OPEN)
    for sx in (-1, 1):
        cyl(f't_acol{k}{sx}', (x + sx * 1.25, TY0 + 0.0, Z1 + 0.4), (x + sx * 1.25, TY0 + 0.0, Z2 - 2.2), 0.16, 0.14, GOV_LT, n=8)
box('t_band2', TX0 - 0.3, TY0 - 0.3, Z2 - 0.2, TX1 + 0.3, TY0 + 9.3, Z2 + 0.5, GOV_LT)
box('t_clockst', TX0 + 0.1, TY0 + 0.1, Z2 + 0.5, TX1 - 0.1, TY0 + 8.9, Z3, GOV)
cyl('t_clockrim', (0, TY0 - 0.06, Z2 + 3.0), (0, TY0 + 0.1, Z2 + 3.0), 1.55, 1.55, GOV_LT, n=24)
cyl('t_clock', (0, TY0 - 0.1, Z2 + 3.0), (0, TY0, Z2 + 3.0), 1.3, 1.3, '#efe9da', n=24)
box('t_hand1', -0.06, TY0 - 0.14, Z2 + 3.0, 0.06, TY0 - 0.1, Z2 + 3.95, '#222222')
hm = box('t_hand2', -0.05, TY0 - 0.15, Z2 + 2.98, 0.05, TY0 - 0.11, Z2 + 3.65, '#222222')
for sx in (-1, 1):                                            # arched windows flanking the clock
    arch_panel(f't_cw{sx}', sx * 3.6 - 0.75, sx * 3.6 + 0.75, TY0 - 0.06, TY0 + 0.04, Z2 + 1.3, Z2 + 3.9, Z2 + 4.8, GOV, inset=0.15)
    box(f't_cwin{sx}', sx * 3.6 - 0.55, TY0 + 0.3, Z2 + 1.3, sx * 3.6 + 0.55, TY0 + 0.4, Z2 + 4.5, OPEN)
box('t_cor', TX0 - 0.55, TY0 - 0.55, Z3, TX1 + 0.55, TY0 + 9.55, Z3 + 0.6, GOV_LT)
box('t_bal_base', TX0 - 0.35, TY0 - 0.35, Z3 + 0.6, TX1 + 0.35, TY0 + 9.35, Z3 + 0.8, GOV_LT)
for k in range(17):                                           # the balustrade round the top, front and sides
    x = TX0 - 0.1 + k * (TX1 - TX0 + 0.2) / 16
    box(f't_tb{k}', x - 0.07, TY0 - 0.32, Z3 + 0.8, x + 0.07, TY0 - 0.18, Z3 + 1.55, GOV_LT)
    for sx in (TX0 - 0.25, TX1 + 0.25):
        y = TY0 - 0.2 + k * 9.4 / 16
        box(f't_ts{k}{sx:.0f}', sx - 0.07, y - 0.07, Z3 + 0.8, sx + 0.07, y + 0.07, Z3 + 1.55, GOV_LT)
box('t_brail', TX0 - 0.4, TY0 - 0.4, Z3 + 1.55, TX1 + 0.4, TY0 + 9.4, Z3 + 1.75, GOV_LT)
box('t_roof', TX0, TY0, Z3 + 0.6, TX1, TY0 + 9.0, Z3 + 0.9, GOV_DK)
for x in (TX0 - 0.2, TX1 + 0.2):                              # corner pedestals and urn finials
    for y in (TY0 - 0.2, TY0 + 9.2):
        box(f't_ped{x:.0f}{y:.0f}', x - 0.35, y - 0.35, Z3 + 0.8, x + 0.35, y + 0.35, Z3 + 2.0, GOV_LT)
        ico(f't_urn{x:.0f}{y:.0f}', (x, y, Z3 + 2.45), 0.38, GOV_LT, 1, (1.0, 1.0, 1.25))
cyl('t_pole', (0, TY0 + 4.5, Z3 + 0.9), (0, TY0 + 4.5, Z3 + 11.0), 0.12, 0.08, IRON, n=6)
ico('t_poleball', (0, TY0 + 4.5, Z3 + 11.1), 0.18, '#b8923e', 1)
flag('t_flag', 'hawaii_flag.png', 4.6, 2.3, (0.05, TY0 + 4.5, Z3 + 10.9), math.radians(15))
# Kamehameha's statue (1883) on its pedestal before the building, in bronze and gold
box('st_base', -1.6, GY - 14.6, 0.0, 1.6, GY - 11.4, 0.6, GOV_DK)
box('st_ped', -1.0, GY - 14.0, 0.6, 1.0, GY - 12.0, 4.2, '#9a907c')
box('st_cap', -1.2, GY - 14.2, 4.2, 1.2, GY - 11.8, 4.5, '#9a907c')
PG['COSTUMES']['statue'] = dict(coat='#3d3428', skin='#3d3428', hair='#3d3428', legs='#3d3428', shoes='#3d3428',
                                parts=[('cloak', 'Hips', lambda: PG['skirt'](1.7, 0.95, top='chest'), '#b8923e')])
s_root, s_arm = person('statue', 'statue', (0, GY - 13.0, 4.5), 180)
s_root.scale = tuple(v * 1.25 for v in s_root.scale)
stand(s_arm, 2, pose={'RightArm': (40, 0, -55), 'RightForeArm': (0, 0, -10), 'LeftArm': (72, 0, 25), 'LeftForeArm': (0, 0, 60)}, breathe=False)
cyl('st_spear', (-0.75, GY - 13.3, 4.6), (-0.75, GY - 13.3, 7.6), 0.03, 0.03, '#3d3428', n=5)

# ================================================================ the business blocks along the street
# Each building is made in its own frame (front at y' = 0 facing -y', x' along the street), then turned to face the street.
WALL_COURSE = {}


def windows(name, x0, x1, z0, h, n, ww=0.95, trim=TRIM, shutters=None):
    for k in range(n):
        x = x0 + (k + 0.5) * (x1 - x0) / n
        box(f'{name}f{k}', x - ww / 2 - 0.13, -0.08, z0 - 0.15, x + ww / 2 + 0.13, 0.02, z0 + h + 0.12, trim)
        box(f'{name}g{k}', x - ww / 2, -0.11, z0, x + ww / 2, 0.0, z0 + h, GLASS)
        box(f'{name}m{k}', x - ww / 2, -0.14, z0 + h / 2 - 0.03, x + ww / 2, -0.1, z0 + h / 2 + 0.03, trim)
        box(f'{name}s{k}', x - ww / 2 - 0.2, -0.22, z0 - 0.2, x + ww / 2 + 0.2, 0.02, z0 - 0.08, trim)
        if shutters:
            for sx in (-1, 1):
                box(f'{name}sh{k}{sx}', x + sx * (ww / 2 + 0.16) - 0.25, -0.1, z0, x + sx * (ww / 2 + 0.16) + 0.25, -0.02, z0 + h, shutters)


def storefront(name, x0, x1, h=3.2):
    """a shop front at street level: a door between two display windows"""
    xm = (x0 + x1) / 2
    box(name + 'door', xm - 0.6, -0.1, 0.14, xm + 0.6, 0.0, 2.6, DOOR)
    box(name + 'tran', xm - 0.6, -0.1, 2.7, xm + 0.6, 0.0, 3.1, GLASS)
    for sx in (-1, 1):
        xa, xb = (xm + 0.9, x1 - 0.5) if sx > 0 else (x0 + 0.5, xm - 0.9)
        if xb - xa > 0.8:
            box(f'{name}dw{sx}', xa, -0.1, 0.9, xb, 0.0, 2.9, GLASS)
            box(f'{name}dwf{sx}', xa - 0.12, -0.08, 0.7, xb + 0.12, 0.02, 3.05, TRIM)


def veranda(name, x0, x1, floors, fh, depth, col=POST, rail=POST, roof=ROOF_TIN):
    """the street veranda: posts on the sidewalk edge, an upper floor with a balustrade, a shed roof"""
    yf = -depth
    n = max(2, int(round((x1 - x0) / 2.7)))
    for k in range(n + 1):
        x = x0 + k * (x1 - x0) / n
        box(f'{name}p{k}', x - 0.09, yf, 0.14, x + 0.09, yf + 0.18, floors * fh + 0.2, col)
        if floors == 1:
            continue
        for fl in range(1, floors):                           # brackets under the beam
            z = fl * fh
            box(f'{name}br{k}{fl}', x - 0.3, yf + 0.02, z - 0.55, x + 0.3, yf + 0.16, z - 0.4, col)
    for fl in range(1, floors):
        z = fl * fh
        box(f'{name}fl{fl}', x0 - 0.1, yf - 0.06, z - 0.25, x1 + 0.1, 0.0, z, col)
        box(f'{name}rl{fl}', x0, yf - 0.04, z + 0.92, x1, yf + 0.12, z + 1.02, rail)
        box(f'{name}rb{fl}', x0, yf - 0.02, z + 0.1, x1, yf + 0.1, z + 0.18, rail)
        nb = int((x1 - x0) / 0.2)
        for j in range(nb):
            xb = x0 + (j + 0.5) * (x1 - x0) / nb
            box(f'{name}bl{fl}{j}', xb - 0.035, yf + 0.0, z + 0.18, xb + 0.035, yf + 0.08, z + 0.92, rail)
    zt = floors * fh + 0.2
    mesh_from(name + 'roof', [(x0 - 0.3, 0.2, zt + 0.7), (x1 + 0.3, 0.2, zt + 0.7), (x1 + 0.3, yf - 0.45, zt), (x0 - 0.3, yf - 0.45, zt),
                              (x0 - 0.3, 0.2, zt + 0.82), (x1 + 0.3, 0.2, zt + 0.82), (x1 + 0.3, yf - 0.45, zt + 0.12), (x0 - 0.3, yf - 0.45, zt + 0.12)],
              [(0, 1, 2, 3), (7, 6, 5, 4), (3, 2, 6, 7), (0, 3, 7, 4), (1, 5, 6, 2)], roof)
    box(name + 'fascia', x0 - 0.3, yf - 0.5, zt - 0.2, x1 + 0.3, yf - 0.4, zt + 0.12, col)


def block(kind, x0, w, d, floors, wall, roof=ROOF_TIN, ver=True, sign=None, shutters=None, low=None):
    """one business block in its own frame; returns nothing"""
    fh = 3.9
    H = floors * fh
    if low:                                                   # a lava-stone ground floor under a wooden upper floor
        box('lo', x0, 0.0, 0.0, x0 + w, d, fh, low)
        box('up', x0, 0.0, fh, x0 + w, d, H, wall)
    else:
        box('body', x0, 0.0, 0.0, x0 + w, d, H, wall)
    box('base', x0 - 0.05, -0.05, 0.0, x0 + w + 0.05, d, 0.3, STONE_DK if wall != STONE else '#625c52')
    storefront('sf', x0 + 0.5, x0 + w - 0.5)
    for fl in range(1, floors):
        windows(f'w{fl}', x0 + 0.5, x0 + w - 0.5, fl * fh + 0.75, 2.0, max(1, int(w / 2.6)), shutters=shutters)
    for sx in (x0 - 0.05, x0 + w - 0.12):                     # corner boards
        box(f'cb{sx:.0f}', sx, -0.12, 0.0, sx + 0.17, 0.05, H, TRIM if wall not in (STONE, BRICK) else wall)
    if kind == 'false':                                       # a false front: a tall square parapet with a cornice and sign
        box('ff', x0, -0.05, H, x0 + w, 0.25, H + 2.2, wall)
        box('ffc', x0 - 0.2, -0.35, H + 2.2, x0 + w + 0.2, 0.3, H + 2.5, TRIM)
        if sign:
            box('sign', x0 + 0.8, -0.12, H + 0.5, x0 + w - 0.8, -0.04, H + 1.8, sign)
        mesh_from('roofb', [(x0, 0.25, H), (x0 + w, 0.25, H), (x0 + w, d, H + 0.8), (x0, d, H + 0.8)], [(0, 1, 2, 3)], roof)
    elif kind == 'hip':
        rise = min(w, d) * 0.3
        a, b = (x0 + w / 2, d / 2), (x0 + w / 2, d / 2)
        v = [(x0 - 0.4, -0.4, H), (x0 + w + 0.4, -0.4, H), (x0 + w + 0.4, d + 0.4, H), (x0 - 0.4, d + 0.4, H),
             (x0 + w / 2, min(d / 2, w / 2), H + rise), (x0 + w / 2, max(d / 2, d - w / 2), H + rise)]
        mesh_from('roofh', v, [(0, 1, 4), (1, 2, 5, 4), (2, 3, 5), (3, 0, 4, 5)], roof)
    else:                                                     # a flat roof behind a corniced parapet (stone and brick)
        box('cor', x0 - 0.25, -0.3, H, x0 + w + 0.25, 0.1, H + 0.35, TRIM if wall == BRICK else STONE_DK)
        box('par', x0, -0.05, H + 0.35, x0 + w, 0.25, H + 1.2, wall)
        box('flat', x0, 0.25, H, x0 + w, d, H + 0.3, roof)
        if sign:
            box('sign', x0 + 1.0, -0.12, fh - 0.75, x0 + w - 1.0, -0.04, fh - 0.15, sign)
    if ver:
        veranda('v', x0, x0 + w, floors, fh, SW - 8.35 + 0.1)
    elif kind != 'false' and sign is None:
        box('awn', x0, -1.6, fh - 0.5, x0 + w, 0.0, fh - 0.35, roof)


def place(side, ya, yb, fn):
    """build fn() in a building frame and stand it on one side of the street between ya and yb"""
    b4 = set(bpy.data.objects)
    fn(yb - ya)
    e = empty(f'bld{side}{ya:.0f}', (0, 0, 0))
    adopt(e, b4)
    if side < 0:
        e.location, e.rotation_euler = (-SW, ya, 0), (0, 0, math.radians(90))
    else:
        e.location, e.rotation_euler = (SW, yb, 0), (0, 0, math.radians(-90))
    for ob in bpy.data.objects:                                # unique names, so later lookups do not collide
        if ob not in b4 and ob is not e:
            ob.name = f'{e.name}_{ob.name}'
    return e


# the west (left) side, in afternoon shade, and the east (right) side, sunlit: near to far
LEFT = [(-70, -52, lambda w: block('hip', 0, w, 14, 2, CLAP_CREAM, shutters='#56694c')),
        (-50, -34, lambda w: block('false', 0, w, 16, 1, SALMON, ver=True, sign='#e7dcc0')),
        (-32, -10, lambda w: block('flat', 0, w, 18, 2, STONE, roof=ROOF_DK, sign='#2f3a33')),
        (-8, 8, lambda w: block('hip', 0, w, 14, 2, CLAP_TAN)),
        (10, 24, lambda w: block('false', 0, w, 14, 1, CLAP_BLUE, sign='#efe6cf')),
        (26, 46, lambda w: block('flat', 0, w, 16, 2, BRICK, roof=ROOF_DK, ver=False, sign='#e7dcc0')),
        (48, 66, lambda w: block('hip', 0, w, 14, 2, CLAP_CREAM, low=STONE)),
        (68, 82, lambda w: block('false', 0, w, 14, 1, SALMON_DK, sign='#e7dcc0')),
]
RIGHT = [(-70, -50, lambda w: block('hip', 0, w, 14, 2, CLAP_BLUE, shutters='#4e6070')),
         (-48, -30, lambda w: block('flat', 0, w, 16, 2, STONE, roof=ROOF_DK)),
         (-28, -14, lambda w: block('false', 0, w, 14, 1, CLAP_CREAM, sign='#3f4a42')),
         (2, 22, lambda w: block('hip', 0, w, 16, 2, CLAP_BRN, low=STONE)),
         (24, 40, lambda w: block('false', 0, w, 14, 1, SALMON, sign='#efe6cf')),
         (42, 62, lambda w: block('flat', 0, w, 18, 2, BRICK, roof=ROOF_DK, sign='#e7dcc0')),
         (64, 80, lambda w: block('hip', 0, w, 14, 2, CLAP_CREAM)),
]
for ya, yb, fn in LEFT:
    place(-1, ya, yb, fn)
for ya, yb, fn in RIGHT:
    place(1, ya, yb, fn)

# ================================================================ trees: the banyan over the street, a monkeypod, palms
def banyan(name, x, y, h, spread, seed):
    rr = random.Random(seed)
    for k in range(11):                                       # a clump of fused trunks, leaning out
        a = 2 * math.pi * k / 11 + rr.uniform(-0.3, 0.3)
        r0 = rr.uniform(0.1, 1.0)
        r1 = r0 + rr.uniform(0.8, 2.6)
        cyl(f'{name}tr{k}', (x + r0 * math.cos(a), y + r0 * math.sin(a), 0.0), (x + r1 * math.cos(a), y + r1 * math.sin(a), h * rr.uniform(0.55, 0.72)),
            rr.uniform(0.28, 0.42), rr.uniform(0.18, 0.26), BTRUNK if k % 2 else TRUNK, n=6)
    for k in range(9):                                        # big limbs out under the canopy
        a = 2 * math.pi * k / 9 + rr.uniform(-0.3, 0.3)
        L = spread * rr.uniform(0.55, 0.9)
        cyl(f'{name}lb{k}', (x, y, h * 0.55), (x + L * math.cos(a), y + L * math.sin(a), h * rr.uniform(0.62, 0.8)), 0.3, 0.12, BTRUNK, n=6)
    items = []
    for k in range(34):
        a = rr.uniform(0, 2 * math.pi)
        d = spread * math.sqrt(rr.random())
        items.append(((x + d * math.cos(a), y + d * math.sin(a), h * rr.uniform(0.78, 1.0) + 1.2 * (1 - d / spread)), rr.uniform(2.6, 4.2), (1.5, 1.4, 0.75), seed * 50 + k))
    for c in range(3):
        blobs(f'{name}can{c}', items[c::3], TREE[c])
    for k in range(26):                                       # aerial roots hanging from the limbs
        a = rr.uniform(0, 2 * math.pi)
        d = spread * rr.uniform(0.3, 0.85)
        px, py = x + d * math.cos(a), y + d * math.sin(a)
        top = h * rr.uniform(0.6, 0.72)
        bot = 0.0 if rr.random() < 0.45 else top * rr.uniform(0.2, 0.6)
        cyl(f'{name}rt{k}', (px, py, bot), (px + rr.uniform(-0.2, 0.2), py, top), 0.05 if bot else 0.1, 0.035, BTRUNK, n=4)


def umbrella(name, x, y, h, spread, seed):
    rr = random.Random(seed)
    cyl(name + 't', (x, y, 0), (x + 0.3, y, h * 0.5), 0.45, 0.3, TRUNK, n=7)
    for k in range(5):
        a = 2 * math.pi * k / 5 + rr.uniform(-0.3, 0.3)
        cyl(f'{name}l{k}', (x + 0.3, y, h * 0.48), (x + spread * 0.7 * math.cos(a), y + spread * 0.7 * math.sin(a), h * 0.8), 0.25, 0.1, TRUNK, n=6)
    items = [((x + spread * math.sqrt(rr.random()) * math.cos(a), y + spread * math.sqrt(rr.random()) * math.sin(a), h * rr.uniform(0.82, 1.0)),
              rr.uniform(2.4, 3.6), (1.5, 1.4, 0.6), seed * 50 + k) for k, a in enumerate(rr.uniform(0, 6.28) for _ in range(20))]
    for c in range(3):
        blobs(f'{name}c{c}', items[c::3], TREE[c])


def palm(x, y, h, lean, L, seed):
    CG['palm'](x, y, h, lean, 12, L, seed)


banyan('banyan', 17.5, -4.0, 13.0, 9.5, 1)                   # on the east side in the gap between blocks, its canopy over the street
umbrella('monkeypod', -15.0, 58.0, 13.0, 9.0, 2)
for i, (x, y, h, lean, L) in enumerate(((-12.6, -36.0, 17, 0.08, 4.8), (-13.0, 26.0, 15, -0.06, 4.4), (12.8, -12.5, 14, 0.1, 4.2),
                                         (13.0, 64.0, 16, -0.05, 4.4), (-20.0, 86.0, 18, 0.05, 4.6), (22.0, 88.0, 17, -0.08, 4.6),
                                         (-48.0, 96.0, 16, 0.06, 4.4), (50.0, 97.0, 19, -0.05, 4.8), (-58.0, 104.0, 15, 0.04, 4.2),
                                         (60.0, 104.0, 16, 0.05, 4.2), (-11.0, 93.0, 13, 0.04, 4.0), (11.5, 93.0, 14, -0.04, 4.0))):
    palm(x, y, h, lean, L, 40 + i)
LV, LF = [], []                                               # banana plants against the verandas: stems and arching leaves
for k, (x, y) in enumerate(((-9.4, -25.0), (-9.6, 4.0), (9.5, 27.0), (9.6, -40.0), (-9.5, 47.0), (9.4, 70.0), (-9.6, 76.0), (13.0, -13.0))):
    rr = random.Random(400 + k)
    for st in range(3):
        sx, sy = x + rr.uniform(-0.5, 0.5), y + rr.uniform(-0.5, 0.5)
        h = rr.uniform(1.8, 2.8)
        cyl(f'bstem{k}{st}', (sx, sy, 0.1), (sx, sy, h), 0.12, 0.08, '#7d8a52', n=5)
        for j in range(5):
            a = rr.uniform(0, 2 * math.pi)
            L, wd = rr.uniform(1.3, 2.0), rr.uniform(0.28, 0.4)
            ca, sa = math.cos(a), math.sin(a)
            base = len(LV)
            for i, t in enumerate((0.0, 0.35, 0.7, 1.0)):
                px, py = sx + ca * L * t, sy + sa * L * t
                pz = h + 0.9 * t - 1.3 * t * t
                w_ = wd * math.sin(math.pi * min(1.0, 0.15 + t * 0.85))
                LV += [(px - sa * w_, py + ca * w_, pz - 0.05), (px, py, pz + 0.06), (px + sa * w_, py - ca * w_, pz - 0.05)]
            for i in range(3):
                b0 = base + i * 3
                LF += [(b0, b0 + 3, b0 + 4, b0 + 1), (b0 + 1, b0 + 4, b0 + 5, b0 + 2)]
mesh_from('banana_leaves', LV, LF, '#5d7a3e')
BG = []                                                       # the trees behind the town and round the Government Building
rr = random.Random(8)
for k in range(260):
    x = rr.choice([rr.uniform(-160, -20), rr.uniform(20, 160)]) if rr.random() < 0.6 else rr.uniform(-160, 160)
    y = rr.uniform(-60, 320)
    if abs(x) < 44 and y < GY + 25:
        continue
    if abs(x) < 26 and y < 220:
        continue
    r = rr.uniform(4, 8)
    BG.append(((x, y, r * 0.8 + rr.uniform(4, 9)), r, (1.4, 1.3, 0.8), 3000 + k))
for c in range(3):
    blobs(f'bgtrees{c}', BG[c::3], TREE[c])


def hills(x, y):
    return 380 * math.exp(-((x + 600) / 900) ** 2 - ((y - 2600) / 900) ** 2) + 260 * math.exp(-((x - 900) / 1100) ** 2 - ((y - 3000) / 900) ** 2) \
        + 120 * math.exp(-((x + 1600) / 700) ** 2 - ((y - 2100) / 600) ** 2)


ground('hills', -4000, 4000, 900, 5000, 60, 30, hills, '#738a58')

# ---- street furniture: telegraph poles and wires, hitching rails, a dray at the curb
POLES = [(9.0, y) for y in (-46, -16, 14, 44, 74)]
for k, (x, y) in enumerate(POLES):
    cyl(f'tp{k}', (x, y, 0), (x, y, 9.5), 0.14, 0.11, '#6b5a48', n=6)
    box(f'tpx{k}', x - 1.1, y - 0.06, 8.6, x + 1.1, y + 0.06, 8.75, '#6b5a48')
    if k:
        for dx in (-0.9, -0.3, 0.3, 0.9):
            px, py = POLES[k - 1]
            line(f'wire{k}{dx}', (px + dx, py, 8.8), (x + dx, y, 8.8), 0.012, '#2b2a28')
for k, (x, y0, y1) in enumerate(((-8.0, -22, -18), (8.0, 30, 34), (-8.0, 40, 44), (8.0, -36, -32))):
    for y in (y0, y1):
        box(f'hp{k}{y}', x - 0.08, y - 0.08, 0, x + 0.08, y + 0.08, 1.0, '#6b5442')
    box(f'hr{k}', x - 0.06, y0, 0.92, x + 0.06, y1, 1.04, '#6b5442')


def dray(x, y, rz):
    b4 = set(bpy.data.objects)
    box('bed', -1.0, -1.8, 0.85, 1.0, 1.8, 1.0, '#7a5a3c')
    for sx in (-1, 1):
        box(f'side{sx}', sx * 1.0 - 0.05, -1.8, 1.0, sx * 1.0 + 0.05, 1.8, 1.45, '#7a5a3c')
        cyl(f'wheel{sx}', (sx * 1.15, 0.3, 0.6), (sx * 1.27, 0.3, 0.6), 0.6, 0.6, '#5a4130', n=12)
        cyl(f'hub{sx}', (sx * 1.27, 0.3, 0.6), (sx * 1.35, 0.3, 0.6), 0.12, 0.12, IRON, n=6)
        cyl(f'shaft{sx}', (sx * 0.7, 1.8, 0.9), (sx * 0.6, 4.6, 0.12), 0.06, 0.05, '#7a5a3c', n=5)
    for k in range(3):
        box(f'sack{k}', -0.8 + k * 0.55, -1.5, 1.0, -0.35 + k * 0.55, -0.6, 1.4, '#c8b98f')
    e = empty('dray', (0, 0, 0))
    adopt(e, b4)
    e.location, e.rotation_euler = (x, y, 0), (0, 0, math.radians(rz))


dray(-6.5, 16.0, 8)

# ================================================================ the landing party, marching toward the camera in step
P = PG
MARINE_COAT, MARINE_LEGS, WHITE_BELT = '#1d2438', '#6f85a2', '#ece6d6'
P['COSTUMES']['marine'] = dict(coat=MARINE_COAT, skin='#d9b38f', hair='#4a3a2c', legs=MARINE_LEGS, shoes='#15171c',
                               parts=[('belt', 'Hips', lambda: P['band'](P['ZW'], 0.16), WHITE_BELT),
                                      ('cross', 'Spine2', P['sash'], WHITE_BELT),
                                      ('collar', 'Spine2', lambda: P['collar'](0.14), MARINE_COAT),
                                      ('buttons', 'Spine2', P['buttons'], '#c9a648'),
                                      ('cap', 'Head', P['peaked_cap'], '#1a2030'), ('peak', 'Head', P['visor'], '#111111')])
P['COSTUMES']['seaman'] = dict(P['COSTUMES']['sailor'], legs='#27324a',
                               parts=[pt if pt[0] not in ('legL', 'legR', 'belt') else (pt[0], pt[1], pt[2], '#d8cfb6') for pt in P['COSTUMES']['sailor']['parts']])


def scabbard():
    """a sword in its scabbard at the left hip (raw units: front is +x, left is +y)"""
    hx, hy = P['HIPS'].x, P['HIPS'].y
    return P['tube']((hx - 0.15, hy + 0.72, P['ZW'] - 0.2), (hx - 1.05, hy + 0.82, P['ZW'] - 3.1), [(0, 0.07), (0.15, 0.06), (1.0, 0.045)], n=6, caps=True)


def sword_hilt():
    hx, hy = P['HIPS'].x, P['HIPS'].y
    return P['tube']((hx - 0.12, hy + 0.72, P['ZW'] - 0.15), (hx + 0.15, hy + 0.7, P['ZW'] + 0.45), [(0, 0.06), (1.0, 0.05)], n=6, caps=True)


P['COSTUMES']['lieutenant'] = dict(P['COSTUMES']['officer'], legs='#1f2a44',
                                   parts=P['COSTUMES']['officer']['parts'] + [('scab', 'Hips', scabbard, '#2b2a28'), ('hilt', 'Hips', sword_hilt, '#c9a648')])
RATE_M = 22.0                                                 # action frames a second: quick time, about 110 paces a minute
VM = PG['FOOT'] * RATE_M * PG['K']                            # metres a second, at the speed of the planted foot
SHOULDER = {'RightArm': (82, 0, -8), 'RightForeArm': (0, 0, -96), 'RightHandIndex1': (70, 0, 0), 'RightHandIndex2': (75, 0, 0),
            'RightHandIndex3': (60, 0, 0), 'RightHandThumb2': (30, 0, 0)}
CARRY = {'RightArm': (80, 0, -12), 'RightForeArm': (0, 0, -80), 'RightHandIndex1': (70, 0, 0), 'RightHandIndex2': (75, 0, 0),
         'RightHandIndex3': (60, 0, 0), 'RightHandThumb2': (30, 0, 0)}
LEFT_ON_HILT = {'LeftArm': (78, 0, 4), 'LeftForeArm': (0, 0, 30)}
REAR_Y0 = 8.0                                                 # the rear rank's place at frame 0 (past the banyan)
CAMY = REAR_Y0 - 6.5                                          # the camera starts this far behind the column
CX = 0.6                                                      # the column's centre line (the camera follows a little to its left)
FILES = (CX - 0.6, CX + 0.6)
FWD = Vector((0.0, 1.0, 0.0))                                 # the column marches north, toward the Government Building
TT = TQ[:]                                                    # everyone steps off together, in step


def march_action(tag, pose):
    """one baked walk shared by every man with the same carry: the stepped walk, with some bones held in a fixed pose"""
    tmp_root, tmp_arm = person('tmp_' + tag, 'seaman', (0, 0, -100), 0)
    act = bake(tmp_arm, WALK, TT, RATE_M, phase=0.0)
    for bn, rot in pose.items():
        for i in range(3):
            fc = act.fcurves.find(f'pose.bones["{bn}"].rotation_euler', index=i) or act.fcurves.new(f'pose.bones["{bn}"].rotation_euler', index=i)
            fc.keyframe_points.insert(0, math.radians(rot[i])).interpolation = 'CONSTANT'
    for ob in [tmp_root] + list(tmp_root.children_recursive):
        bpy.data.objects.remove(ob, do_unlink=True)
    act.use_fake_user = True
    return act


ACTS = {'rifle': (march_action('rifle', SHOULDER), SHOULDER), 'colour': (march_action('colour', CARRY), CARRY),
        'officer': (march_action('officer', LEFT_ON_HILT), LEFT_ON_HILT)}


def bone_attach(ob, arm, bone):
    """parent ob to a bone and keep it exactly where it is now"""
    M = ob.matrix_world.copy()
    ob.parent = arm
    ob.parent_type = 'BONE'
    ob.parent_bone = bone
    ob.matrix_basis = Matrix.Identity(4)
    bpy.context.view_layer.update()
    ob.matrix_basis = ob.matrix_world.inverted() @ M


def hand_pos(arm, side='Right'):
    bpy.context.view_layer.update()
    body = [o for o in arm.children if o.type == 'MESH' and o.data.vertices and len(o.vertex_groups) > 10][0]
    ev = body.evaluated_get(bpy.context.evaluated_depsgraph_get()).data
    gn = {g.index: g.name for g in body.vertex_groups}
    ids = [v.index for v in body.data.vertices if v.groups and gn[max(v.groups, key=lambda g: g.weight).group].startswith(side + 'Hand')]
    return body.matrix_world @ (sum((ev.vertices[i].co for i in ids), Vector()) / len(ids))


MEN = []


def marcher(name, costume, x, y, kind):
    root, arm = person(name, costume, (x, y, 0.0), 0)
    act, pose = ACTS[kind]
    for bn in pose:
        arm.pose.bones[bn].rotation_mode = 'XYZ'
    arm.animation_data.action = act
    for f, tt in enumerate(TT):                               # the body moves at the speed of the planted foot
        root.location = (x, y + VM * tt, 0.0)
        root.keyframe_insert('location', frame=f)
    for fc in root.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'
    MEN.append((name, root, arm, kind))
    return root, arm


HEAD_Y0 = REAR_Y0 + 2.4 + 7 * 1.45 + 2.35 + 2.4 + 2.4 + 6 * 1.45   # the officer at the head, front to rear below
y = HEAD_Y0
marcher('lt', 'lieutenant', CX, y, 'officer')
y -= 2.4
for r in range(8):                                            # the Marine guard, two files
    for i, x in enumerate(FILES):
        marcher(f'mar{r}{i}', 'marine', x, y, 'rifle')
    y -= 1.45
y -= 0.9
marcher('colour', 'seaman', CX, y, 'colour')                 # the colour, between the Marines and the seamen
y -= 2.4
marcher('lt2', 'lieutenant', CX, y, 'officer')
y -= 2.4
for r in range(7):                                            # a company of seamen, the rear nearest the camera
    for i, x in enumerate(FILES):
        marcher(f'sea{r}{i}', 'seaman', x, y, 'rifle')
    y -= 1.45
print('COLUMN head', round(HEAD_Y0, 2), 'rear', round(y + 1.45, 2))
# rifles on the right shoulder, the colour on its staff: built where the hand is at frame 0, then carried by the hand
sc.frame_set(0)
for name, root, arm, kind in MEN:
    if kind == 'officer':
        continue
    bpy.context.view_layer.update()
    H = hand_pos(arm)
    if kind == 'rifle':
        S = arm.matrix_world @ arm.pose.bones['RightArm'].head
        tip = S + Vector((-0.06, 0.0, 0.14)) - FWD * 0.12               # just over the shoulder, sloping back
        ax = (tip - H).normalized()
        b0 = H - ax * 0.12
        parts = [cyl(f'{name}_stock', b0, b0 + ax * 0.78, 0.05, 0.036, '#5a4532', n=6),
                 cyl(f'{name}_butt', b0 - ax * 0.05, b0 + ax * 0.22, 0.06, 0.052, '#5a4532', n=6),
                 cyl(f'{name}_barrel', b0 + ax * 0.74, b0 + ax * 1.28, 0.017, 0.014, '#2b2622', n=6)]
    else:
        base = H + Vector((0, 0, -0.75))
        top = H + FWD * 0.12 + Vector((0, 0, 2.35))
        parts = [cyl(f'{name}_staff', base, top, 0.028, 0.022, '#6b5442', n=6),
                 ico(f'{name}_finial', tuple(top + Vector((0, 0, 0.1))), 0.07, '#b8923e', 1),
                 flag('colour_flag', 'us_flag_44.png', 1.8, 0.95, tuple(top + Vector((-0.03, -0.03, -0.05))), math.radians(222), wave=0.06)]
        # (the trade wind from the north-east blows the colour out to the south-west, so it shows its face to the camera)
    for ob in parts:
        bone_attach(ob, arm, 'RightHand')
# onlookers on the sidewalks and verandas: townspeople watching, standing still
WATCH = [('gentleman', -9.2, -14.0, 80), ('holoku', -9.4, -12.5, 95), ('worker', -9.0, -6.0, 70), ('gentleman', 9.3, -4.0, 270),
         ('worker', 9.4, 3.0, 285), ('holoku', 9.2, 6.0, 260), ('gentleman', -9.1, 20.0, 95), ('worker', 9.0, 38.0, 265),
         ('gentleman', 9.3, 15.0, 250), ('holoku', -9.3, 33.0, 80), ('worker', -9.4, 52.0, 100), ('gentleman', 9.1, 55.0, 255),
         ('worker', -8.9, -2.5, 75), ('missionary', -9.5, 0.5, 90), ('gentleman', -9.0, 9.0, 85), ('worker', 9.2, 22.0, 275),
         ('gentleman', -9.2, 62.0, 100), ('holoku', 9.3, 66.0, 260), ('worker', -9.3, 71.0, 80), ('gentleman', 9.2, 74.0, 275),
         ('holoku', -9.4, 44.0, 95), ('worker', 9.4, 47.0, 255)]
for k, (c, x, yy, hd) in enumerate(WATCH):
    r_, a_ = person(f'w{k}', c, (x, yy, 0.14), hd)
    stand(a_, N, k=k * 0.8)

# ---- palms sway (stepped at 12 fps)
for f, tq in enumerate(TQ):
    for ob, kind, ph, amp in CG['MOVERS']:
        ob.rotation_euler[1] = amp * math.sin(tq * (1.7 if kind == 'frond' else 1.1) + ph)
        ob.keyframe_insert('rotation_euler', frame=f)
for ob, *_ in CG['MOVERS']:
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'

# ---- light: the sun from the south-west behind the camera, lighting the column's backs, the east side and the building
sun = bpy.data.objects['sun']
sun.rotation_euler = (math.radians(55), 0, math.radians(-31))   # from the south-south-west: the west side's shadows stay off the camera's half
sun.data.energy = 4.6
sun.data.color = (1.0, 0.93, 0.82)
sun.data.shadow_cascade_max_distance = 220
sun.data.shadow_cascade_count = 4
sun.data.shadow_cascade_exponent = 0.75
ramp = [n for n in sc.world.node_tree.nodes if n.type == 'VALTORGB'][0]
ramp.color_ramp.elements[0].color = lin('#86a9b3')
ramp.color_ramp.elements[1].color = lin('#e6e2cf')
ramp.color_ramp.elements[1].position = 0.7

# ---- the finishing pass
LK = {'__name__': 'look'}
exec(compile(open(os.path.join(HERE, 'look.py')).read(), os.path.join(HERE, 'look.py'), 'exec'), LK)
LK['finish'](sc, fill_strength=0.75, haze=(90.0, 2000.0, 0.38), rules={
    ROAD: (0.13, 0.09, None, 1.0), ROAD_LT: (0.06, 0.2, None, 1.0), RUT: (0.06, 0.2, None, 1.0), VERGE: (0.12, 0.3, None, 1.0),
    LAWN: (0.12, 0.05, None, 1.0), CLAP_BLUE: (0.06, 0.4, 0.26, 0.86), CLAP_TAN: (0.06, 0.4, 0.26, 0.86), CLAP_CREAM: (0.06, 0.4, 0.26, 0.88),
    CLAP_BRN: (0.06, 0.4, 0.26, 0.86), SALMON: (0.08, 0.4, 0.26, 0.88), SALMON_DK: (0.08, 0.4, 0.26, 0.88),
    STONE: (0.16, 1.4, 0.42, 0.8), STONE_DK: (0.12, 1.2, None, 1.0), BRICK: (0.06, 0.8, 0.09, 0.9),
    GOV: (0.07, 0.25, 0.55, 0.9), GOV_LT: (0.05, 0.3, None, 1.0), GOV_DK: (0.06, 0.3, 0.45, 0.88), '#738a58': (0.14, 0.004, None, 1.0)})
sc.view_layers[0].use_pass_z = True                           # the sky keeps its colour: the haze is held off infinite depth
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

# ================================================================ camera: low behind the column, dollying slowly after it
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
cam.data.clip_start, cam.data.clip_end = 0.1, 40000
cam.data.lens = 30
KEYS = [(0, (-1.9, CAMY, 1.35), (1.6, 100.0, 7.0)), (N - 1, (-1.6, CAMY + 6.0, 1.4), (1.2, 100.0, 7.4))]
for f, pos, look in KEYS:
    cam.location = pos; cam.keyframe_insert('location', frame=f)
    tgt.location = look; tgt.keyframe_insert('location', frame=f)
for ob in (cam, tgt):
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'BEZIER'
            kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
cam.data.dof.use_dof = True                                   # focus rides on the colour
lt_root = [m[1] for m in MEN if m[0] == 'colour'][0]
for f in list(range(0, N, 3)) + [N - 1]:
    sc.frame_set(f)
    c = cam.matrix_world.translation
    cam.data.dof.focus_distance = max(2.0, (Vector((CX, lt_root.location.y, 1.8)) - c).length)
    cam.data.dof.aperture_fstop = 4.0
    cam.data.dof.keyframe_insert('focus_distance', frame=f)
for fc in cam.data.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = 'LINEAR'

sc.render.resolution_percentage = SCALE
os.makedirs(OUT, exist_ok=True)
if MODE == 'march':
    FR = [int(os.environ.get('FRAME', N // 2))]
else:
    FR = [int(v) for v in os.environ['FRAMES'].split(',')] if os.environ.get('FRAMES') else range(N)
import time
for f in FR:
    path = os.path.join(OUT, 'landing_march.png' if MODE == 'march' else f'{f:04d}.png')
    if os.path.exists(path) and os.path.getsize(path) > 0 and not os.environ.get('FORCE'):   # resumable: keep frames already written
        continue
    sc.frame_set(f)
    sc.render.filepath = path
    t = time.time()
    bpy.ops.render.render(write_still=True)
    print('FRAME', f, round(time.time() - t, 2), flush=True)
