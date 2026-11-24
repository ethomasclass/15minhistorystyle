# Ep 1, chapter 4: the pitch room, a Washington office in the 1890s, built in Blender after the Flow plate c1_pitch_room.
# Dark vertical panelling, two tall windows with heavy green curtains and a low late-afternoon sun coming through them,
# a hanging brass lamp pooling warm light on the long polished table, the Pacific map on the back wall, the easel with its
# board at the end of the table (the board is the portal into each pitcher's world). The four pitchers: the businessman
# (vest, thumb in the waistcoat), the naval captain (hands behind his back), the minister (a book) and the lecturer (a
# pointer). People are posed by a small pose engine: a standing pose, gestures blended in and out, and short walks on the
# kit's walk cycle with the cycle driven by the distance walked (feet planted), all stepped at 12 fps.
#
# Shots (segments), keyed to the chapter 4 narration (public/audio/ch04_the_pitch_meeting.words.json). Each segment is
# one continuous camera move; frame 0 of a segment is its first word (see SEG below):
#   j04    "So where next?" (ch 3 end) to "So let's do it": opens on the handoff framing H4 (the flat wall-map texture
#          filling the frame: square-on, centred lon 228 E lat 33 N, 40 degrees of longitude across), pulls back over the
#          easel into the empty room on "a lot of powerful Americans", drifts, and settles on the locked wide on "nobody"
#   pitch  "So let's do it for them" (hard cut, the same locked frame: the four pitchers are standing there), nods on
#          "four pitchers", then the push into the easel board (the IMPERIALISM card) that fills the frame on "A strong"
#   j05    "Every one of these pitches" to "farms and factories": the businessman steps to the easel and presents it;
#          the camera pushes into the board (showing the docks frame) until it fills the frame: the docks take over
#   j06    "new customers overseas" to "Technically": the docks frame frozen on the board, the camera pulls back into
#          the room; "Anywhere": the businessman opens his hands; "The Admiral": the captain steps up and touches his cap
#   j08    "Americans didn't want to be left out" to "Now look at the Pacific": the 1886 Imperial Federation map fills
#          the frame on the board, the camera pulls back, rises over the easel to the wall map and pushes square-on into
#          the Pacific, ending on the handoff framing H8 (centred lon 202.0 lat 21.3, 90 degrees across)
#   j09    "It belonged to a queen" to "Strong was a": opens on H8, creeps in on Hawaii, then on "The Preacher" pulls
#          back over the easel as the minister steps up, raising his hand, and pushes into the board (the church frame)
#   j10    "The 'Scientist'" to "A British": the lecturer steps up and points; the push into the board (lecture L1)
#   same   "The Preacher and the Scientist were often the same man": the two flank the easel and step together
# The wall map and the board faces are unlit pictures (emission) at the handoff frames and skip the colour grade, so a
# handoff frame is the picture itself.
#   xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python pitchroom.py -- <out_dir> [scale%] [mode]
#   mode: empty | full (stills) | h4 | h8 (the handoff stills) | a segment above (renders the frames in $FRAMES:
#         "all", a comma list, or a:b:step, into <out_dir>/NNNN.png); 'push' is the old name of 'pitch'.
#   env: BOARD_IMG overrides the board picture of the segment; SAMPLES sets the EEVEE samples (default 16).
import bpy, math, os, sys, time, random
from mathutils import Vector, Euler, Quaternion, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/pitchroom'
SCALE = int(argv[1]) if len(argv) > 1 else 100
MODE = argv[2] if len(argv) > 2 else 'full'
MODE = {'push': 'pitch'}.get(MODE, MODE)
KIT = os.path.join(HERE, '..', '..', 'tests', 'blender_church')
BUILD = os.path.join(HERE, '..', 'build', 'pitchroom')

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
person, WALK = PG['person'], PG['WALK']
sc = bpy.context.scene
KEEP = {'sun', 'cam', 'target', 'Human Armature', 'Human_Mesh'}
for ob in list(bpy.data.objects):
    if ob.name not in KEEP:
        bpy.data.objects.remove(ob, do_unlink=True)
CG['MOVERS'].clear()
FPS = 30
import json as _json


def _wt(phrase, end=False, after=0.0):
    """start (or end) time of a phrase in the chapter 4 narration"""
    ws = _json.load(open(os.path.join(HERE, '..', 'public', 'audio', 'ch04_the_pitch_meeting.words.json')))['words']
    nm = lambda w: ''.join(ch for ch in w.lower() if ch.isalnum() or ch in "'ʻ")
    p = [nm(x) for x in phrase.split()]
    for i in range(len(ws) - len(p) + 1):
        if ws[i]['s'] >= after and [nm(w['w']) for w in ws[i:i + len(p)]] == p:
            return ws[i + len(p) - 1]['e'] if end else ws[i]['s']
    raise KeyError(phrase)


# ---- palette (from the plate), the panelling a little darker for the late light
PANEL, PANEL_DK, GROOVE = '#4e3828', '#3e2c20', '#2a1e15'
FLOOR, FLOOR_DK = '#3a2c22', '#2a2019'
TABLE, TABLE_DK = '#8a5634', '#6a4128'
CHAIR, CHAIR_DK = '#4a3020', '#3a2518'
CURT, CURT_DK, CURT_LT = '#3f5a2c', '#2b4020', '#58703a'
SILL = '#5a4130'
PAPER, GLASS = '#e9dfc4', '#b9cfcf'
BRASS = '#b08a4a'
mat(BRASS, 0.35), mat(TABLE, 0.45), mat(GLASS, 0.15)

# ---- the room: back wall at y = 8, side walls at x = +-7, floor and ceiling
X0, X1, Y1, ZC = -7.0, 7.0, 8.0, 4.4
box('floor', X0, -6, -0.05, X1, Y1, 0.0, FLOOR)
for k in range(20):
    x = X0 + k * 0.7
    box(f'fb{k}', x, -6, 0.0, x + 0.012, Y1, 0.004, FLOOR_DK)
box('ceiling', X0, -6, ZC - 0.02, X1, Y1 + 0.4, ZC + 0.1, '#3a2c20')
WIN = [(-5.3, 1.25), (-1.4, 1.25)]                         # (centre x, width) of the two windows
Z_W0, Z_W1 = 0.95, 3.55
xs = [X0] + [v for c, w in WIN for v in (c - w / 2, c + w / 2)] + [X1]
for i in range(0, len(xs), 2):
    box(f'bw{i}', xs[i], Y1, 0, xs[i + 1], Y1 + 0.15, ZC, PANEL)
for c, w in WIN:
    box(f'bwlo{c}', c - w / 2, Y1, 0, c + w / 2, Y1 + 0.15, Z_W0, PANEL)
    box(f'bwhi{c}', c - w / 2, Y1, Z_W1, c + w / 2, Y1 + 0.15, ZC, PANEL)
for k in range(int((X1 - X0) / 0.62)):
    x = X0 + 0.31 + k * 0.62
    if any(abs(x - c) < w / 2 + 0.05 for c, w in WIN):
        box(f'gr{k}lo', x - 0.012, Y1 - 0.01, 0, x + 0.012, Y1, Z_W0, GROOVE)
        box(f'gr{k}hi', x - 0.012, Y1 - 0.01, Z_W1, x + 0.012, Y1, ZC, GROOVE)
    else:
        box(f'gr{k}', x - 0.012, Y1 - 0.01, 0, x + 0.012, Y1, ZC, GROOVE)
box('baseboard', X0, Y1 - 0.05, 0, X1, Y1, 0.22, PANEL_DK)
box('rail', X0, Y1 - 0.06, ZC - 0.32, X1, Y1, ZC - 0.24, PANEL_DK)
box('chairrail', X0, Y1 - 0.05, 0.98, X1, Y1, 1.03, PANEL_DK)
for sx in (-1, 1):
    box(f'side{sx}', sx * X1 - (0.15 if sx > 0 else 0), -6, 0, sx * X1 + (0.0 if sx > 0 else 0.15), Y1, ZC, PANEL_DK)
    for k in range(22):                                      # grooves on the side walls too
        y = -5.7 + k * 0.62
        box(f'sgr{sx}{k}', sx * (X1 - 0.16) - 0.01, y - 0.012, 0, sx * (X1 - 0.16) + 0.01, y + 0.012, ZC, GROOVE)


def emit_mat(name, top, bottom=None, strength=1.0):
    """an unlit material (a flat colour, or a vertical gradient from bottom to top in object z), casting no shadow"""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    em, ou = nt.nodes.new('ShaderNodeEmission'), nt.nodes.new('ShaderNodeOutputMaterial')
    em.inputs['Strength'].default_value = strength
    if bottom:
        tc, sp, rp = nt.nodes.new('ShaderNodeTexCoord'), nt.nodes.new('ShaderNodeSeparateXYZ'), nt.nodes.new('ShaderNodeValToRGB')
        nt.links.new(tc.outputs['Generated'], sp.inputs[0])
        nt.links.new(sp.outputs['Z'], rp.inputs['Fac'])
        rp.color_ramp.elements[0].color, rp.color_ramp.elements[1].color = lin(bottom), lin(top)
        nt.links.new(rp.outputs['Color'], em.inputs['Color'])
    else:
        em.inputs['Color'].default_value = lin(top)
    nt.links.new(em.outputs[0], ou.inputs['Surface'])
    m.shadow_method = 'NONE'
    return m


# the windows: frames, sashes, the late-afternoon sky beyond (warm low glow, rooftops and trees in haze), curtains
SKYM = emit_mat('winsky', '#e9e2c8', '#f6cf8e', 1.6)
TREEM = emit_mat('wintrees', '#b49a72', None, 1.0)
for c, w in WIN:
    s = box(f'sky{c}', c - w / 2 - 0.6, Y1 + 1.2, Z_W0 - 0.5, c + w / 2 + 0.6, Y1 + 1.25, Z_W1 + 0.5, '#ffffff')
    s.data.materials[0] = SKYM
    for k, (dx, h) in enumerate(((-0.5, 0.55), (-0.05, 0.85), (0.35, 0.45), (0.62, 0.7))):   # far rooftops and trees, in haze
        t_ = box(f'tree{c}{k}', c + dx - 0.28, Y1 + 1.1, Z_W0 - 0.5, c + dx + 0.28, Y1 + 1.15, Z_W0 + h, '#ffffff')
        t_.data.materials[0] = TREEM
    box(f'sill{c}', c - w / 2 - 0.12, Y1 - 0.12, Z_W0 - 0.08, c + w / 2 + 0.12, Y1 + 0.15, Z_W0, SILL)
    for xx in (c - w / 2, c - 0.025, c + w / 2 - 0.05):
        box(f'mull{c}{xx:.2f}', xx, Y1 + 0.05, Z_W0, xx + 0.05, Y1 + 0.1, Z_W1, SILL)
    for zz in (Z_W0 + (Z_W1 - Z_W0) * 0.5, Z_W1 - 0.05):
        box(f'tran{c}{zz:.2f}', c - w / 2, Y1 + 0.05, zz, c + w / 2, Y1 + 0.1, zz + 0.05, SILL)
    box(f'pelmet{c}', c - w / 2 - 0.55, Y1 - 0.2, Z_W1 + 0.15, c + w / 2 + 0.55, Y1, Z_W1 + 0.4, PANEL_DK)
    for sx in (-1, 1):
        for k in range(4):                                   # four folds a side, alternating light and dark
            x = c + sx * (w / 2 + 0.06 + k * 0.13)
            col = (CURT, CURT_DK, CURT_LT, CURT_DK)[k]
            box(f'curt{c}{sx}{k}', x - 0.08, Y1 - 0.16 + 0.04 * (k % 2), 0.05, x + 0.08, Y1 - 0.04, Z_W1 + 0.15, col)

# the map on the back wall (the Pacific), in a wooden frame with a cream mat. Its face mixes an unlit copy of the picture
# (1 at the handoff frames) with the lit one (in the room).
MX0, MX1, MZ0, MZ1 = 1.0, 5.9, 1.55, 4.0
MAP_BBOX = (95.0, -50.0, 300.0, 68.0)                        # lon0, lat0, lon1, lat1 of pitch_map.png (tools/pacmap.py)
MAP_Y = Y1 - 0.08                                            # the map face plane
box('mapframe', MX0 - 0.12, Y1 - 0.06, MZ0 - 0.12, MX1 + 0.12, Y1, MZ1 + 0.12, '#7a5434')
box('mapmat', MX0 - 0.05, Y1 - 0.075, MZ0 - 0.05, MX1 + 0.05, Y1 - 0.06, MZ1 + 0.05, '#e9dcbc')
bpy.ops.mesh.primitive_plane_add(size=1)
mp = bpy.context.active_object
mp.name = 'map'
mp.scale = ((MX1 - MX0), (MZ1 - MZ0), 1)
mp.rotation_euler = (math.radians(90), 0, 0)
mp.location = ((MX0 + MX1) / 2, MAP_Y, (MZ0 + MZ1) / 2)
mp.pass_index = 2


def picture_mat(name, path, unlit=1.0):
    """an image with a lit and an unlit (emission) path, mixed by the Mix Shader's factor (1 = unlit picture)"""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    tx = nt.nodes.new('ShaderNodeTexImage')
    tx.image = bpy.data.images.load(path)
    tx.extension = 'EXTEND'
    bs = nt.nodes.new('ShaderNodeBsdfPrincipled')
    bs.inputs['Roughness'].default_value = 1.0
    bs.inputs['Specular IOR Level'].default_value = 0.1
    em, mx, ou = nt.nodes.new('ShaderNodeEmission'), nt.nodes.new('ShaderNodeMixShader'), nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(tx.outputs['Color'], bs.inputs['Base Color'])
    nt.links.new(tx.outputs['Color'], em.inputs['Color'])
    nt.links.new(bs.outputs[0], mx.inputs[1])
    nt.links.new(em.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], ou.inputs['Surface'])
    mx.inputs['Fac'].default_value = unlit
    av = nt.nodes.new('ShaderNodeOutputAOV')                 # marks the picture for the grade bypass
    av.name = 'pic'
    av.inputs['Value'].default_value = 1.0
    return m, mx, tx


MAPM, MAPMIX, _ = picture_mat('pitchmap', os.path.join(HERE, 'assets', 'pitch_map.png'), 0.3)
mp.data.materials.append(MAPM)


def map_xz(lon, lat):
    lon0, lat0, lon1, lat1 = MAP_BBOX
    return MX0 + (lon - lon0) / (lon1 - lon0) * (MX1 - MX0), MZ0 + (lat - lat0) / (lat1 - lat0) * (MZ1 - MZ0)


# ---- the table, six chairs, papers, glasses, carafe
TX0, TX1, TY0, TY1, TZ = -5.6, 2.6, 2.9, 4.7, 0.78
box('tabletop', TX0, TY0, TZ - 0.07, TX1, TY1, TZ, TABLE)
box('apron', TX0 + 0.1, TY0 + 0.1, TZ - 0.2, TX1 - 0.1, TY1 - 0.1, TZ - 0.07, TABLE_DK)
for x in (TX0 + 0.15, TX1 - 0.25, (TX0 + TX1) / 2 - 0.05):
    for y in (TY0 + 0.15, TY1 - 0.25):
        box(f'tleg{x:.1f}{y:.1f}', x, y, 0, x + 0.1, y + 0.1, TZ - 0.2, TABLE_DK)


def chair(name, cx, cy, face):
    """face: +1 faces +y (back toward the camera), -1 faces -y"""
    box(name + 'seat', cx - 0.24, cy - 0.24, 0.46, cx + 0.24, cy + 0.24, 0.52, CHAIR)
    for dx in (-0.21, 0.17):
        for dy in (-0.21, 0.17):
            box(f'{name}l{dx}{dy}', cx + dx, cy + dy, 0, cx + dx + 0.04, cy + dy + 0.04, 0.46, CHAIR_DK)
    by = cy - face * 0.24
    box(name + 'top', cx - 0.25, by - 0.03, 1.02, cx + 0.25, by + 0.03, 1.12, CHAIR)
    for k in range(5):
        x = cx - 0.2 + k * 0.1
        box(f'{name}s{k}', x - 0.018, by - 0.02, 0.52, x + 0.018, by + 0.02, 1.02, CHAIR_DK)
    for sx in (-1, 1):
        box(f'{name}p{sx}', cx + sx * 0.23 - 0.025, by - 0.03, 0.46, cx + sx * 0.23 + 0.025, by + 0.03, 1.14, CHAIR)


for i, x in enumerate((-4.2, -1.9, 0.35)):
    chair(f'ch_b{i}', x, TY1 + 0.45, -1)                    # behind the table, facing the camera (the pitchers stand between)
for i, x in enumerate((-4.1, -1.3, 1.5)):
    chair(f'ch_f{i}', x, TY0 - 0.45, 1)                     # this side, backs to the camera: the investor's side
for i, (x, y, r) in enumerate(((-4.6, 3.4, 8), (-3.6, 4.1, -5), (-1.9, 3.5, 12), (-0.8, 4.2, -9), (0.6, 3.4, 4), (1.6, 4.0, -12))):
    p = box(f'paper{i}', x - 0.22, y - 0.15, TZ, x + 0.22, y + 0.15, TZ + 0.005, PAPER)
    p.rotation_euler[2] = math.radians(r)
for i, (x, y) in enumerate(((-5.0, 3.9), (-2.7, 3.3), (-1.2, 3.9), (0.1, 3.3), (2.0, 3.7))):
    cyl(f'glass{i}', (x, y, TZ), (x, y, TZ + 0.13), 0.04, 0.047, GLASS, n=10)
cyl('carafe', (-2.0, 3.85, TZ), (-2.0, 3.85, TZ + 0.2), 0.09, 0.07, GLASS, n=12)
cyl('carafe_neck', (-2.0, 3.85, TZ + 0.2), (-2.0, 3.85, TZ + 0.32), 0.04, 0.03, GLASS, n=12)

# ---- the easel and its board (the portal): landscape 16:9, so when it fills the frame it is the frame. Its face shows
# its picture unlit (emission) and skips the grade, so the hand-off to the full-screen shot is exact.
EX, EY = 4.3, 4.2
BW, BH, BZ = 1.6, 0.9, 1.15                                  # the board: width, height, bottom edge
BOARD_Y = EY - 0.025                                         # the board face plane
BOARD_C = Vector((EX, BOARD_Y, BZ + BH / 2))
box('boardback', EX - BW / 2, EY - 0.02, BZ, EX + BW / 2, EY + 0.01, BZ + BH, '#efe6d0')
box('boardframe', EX - BW / 2 - 0.05, EY - 0.015, BZ - 0.05, EX + BW / 2 + 0.05, EY + 0.04, BZ + BH + 0.05, '#8a6a45')
bpy.ops.mesh.primitive_plane_add(size=1)
bf = bpy.context.active_object
bf.name = 'boardface'
bf.scale = (BW, BH, 1)
bf.rotation_euler = (math.radians(90), 0, 0)
bf.location = (EX, BOARD_Y, BZ + BH / 2)
bf.pass_index = 1
for sx in (-1, 1):                                          # the front legs stand just behind the board, splayed
    cyl(f'eleg{sx}', (EX + sx * 0.62, EY + 0.07, 0), (EX + sx * 0.2, EY + 0.07, BZ + BH + 0.3), 0.025, 0.02, '#8a6a45', n=6)
cyl('eleg_back', (EX, EY + 0.75, 0), (EX, EY + 0.1, BZ + BH + 0.15), 0.025, 0.02, '#8a6a45', n=6)
box('eledge', EX - 0.85, EY - 0.12, BZ - 0.08, EX + 0.85, EY + 0.04, BZ - 0.03, '#8a6a45')   # the ledge the board sits on

# ---- the hanging lamp over the table, on a pivot so it can sway a little; its glass glows, its light pools on the table
LX, LY = -3.2, 3.8
lamp_piv = empty('lamp_pivot', (LX, LY, ZC))
bpy.context.view_layer.update()
for ob in (cyl('lampcord', (LX, LY, ZC), (LX, LY, 2.55), 0.008, 0.008, '#222222', n=4),
           cyl('lampshade', (LX, LY, 2.55), (LX, LY, 2.25), 0.07, 0.38, BRASS, n=12),
           cyl('lampshade_in', (LX, LY, 2.548), (LX, LY, 2.27), 0.06, 0.36, '#ffffff', n=12),
           ico('lampbulb', (LX, LY, 2.22), 0.075, '#ffffff', 1),
           cyl('lampcrown', (LX, LY, 2.6), (LX, LY, 2.55), 0.03, 0.07, BRASS, n=8)):
    ob.parent = lamp_piv
    ob.matrix_parent_inverse = lamp_piv.matrix_world.inverted()
bpy.data.objects['lampbulb'].data.materials[0] = emit_mat('bulb', '#fff1cc', None, 9.0)
bpy.data.objects['lampshade_in'].data.materials[0] = emit_mat('shade_in', '#ffd79a', None, 2.2)
bpy.data.objects['lampshade_in'].scale = (1, 1, 1)
lp = bpy.data.lights.new('lamp', 'SPOT')
lp.energy, lp.color, lp.spot_size, lp.spot_blend, lp.shadow_soft_size = 1500, (1.0, 0.78, 0.5), math.radians(110), 0.45, 0.12
lpo = bpy.data.objects.new('lamp', lp)
sc.collection.objects.link(lpo)
lpo.location = (LX, LY, 2.2)
lpo.parent = lamp_piv
lpo.matrix_parent_inverse = lamp_piv.matrix_world.inverted()
lg = bpy.data.lights.new('lampglow', 'POINT')                  # the glow around the shade: lights the ceiling and the faces
lg.energy, lg.color, lg.shadow_soft_size = 90, (1.0, 0.75, 0.48), 0.3
lgo = bpy.data.objects.new('lampglow', lg)
sc.collection.objects.link(lgo)
lgo.location = (LX, LY, 2.45)
lgo.parent = lamp_piv
lgo.matrix_parent_inverse = lamp_piv.matrix_world.inverted()

# ---- the light: a low late-afternoon sun through the two windows (warm shafts across the floor and the table, rim light
# on the pitchers), the windows' own sky glow, a little warm fill so the panelling keeps its grain, the lamp's pool
so = bpy.data.objects['sun']
SDIR = Vector((0.36, -0.86, -0.36)).normalized()            # the direction the light travels: in through the back windows
so.rotation_euler = SDIR.to_track_quat('-Z', 'Y').to_euler()
so.data.energy, so.data.color, so.data.angle = 13.0, (1.0, 0.70, 0.42), math.radians(1.2)
so.data.shadow_cascade_max_distance, so.data.shadow_cascade_count = 24, 4
for i, (c, w) in enumerate(WIN):
    wl = bpy.data.lights.new(f'win{i}', 'AREA')                # the sky's glow from each window, soft and warm-white
    wl.energy, wl.size, wl.color = 160, 1.3, (1.0, 0.86, 0.68)
    wo = bpy.data.objects.new(f'win{i}', wl)
    sc.collection.objects.link(wo)
    wo.location = (c, Y1 - 0.25, (Z_W0 + Z_W1) / 2)
    wo.rotation_euler = (math.radians(-80), 0, 0)
fill = bpy.data.lights.new('roomfill', 'AREA')
fill.energy, fill.size, fill.color = 320, 7.0, (1.0, 0.84, 0.66)
fo = bpy.data.objects.new('roomfill', fill)
sc.collection.objects.link(fo)
fo.location = (0, 0.5, ZC - 0.2)
front = bpy.data.lights.new('frontfill', 'AREA')              # from behind the camera, low: keeps the faces readable
front.energy, front.size, front.color = 260, 5.0, (1.0, 0.88, 0.74)
fro = bpy.data.objects.new('frontfill', front)
sc.collection.objects.link(fro)
fro.location = (0.5, -5.5, 2.4)
fro.rotation_euler = (math.radians(80), 0, 0)
front.use_shadow = False
# shafts of light: faint warm volumes from each window opening along the sun, ending on the floor
import bmesh
BEAM = bpy.data.materials.new('beam')
BEAM.use_nodes = True
bnt = BEAM.node_tree
for n in list(bnt.nodes):
    bnt.nodes.remove(n)
emi, tra, mix, bout = (bnt.nodes.new(t) for t in ('ShaderNodeEmission', 'ShaderNodeBsdfTransparent', 'ShaderNodeMixShader', 'ShaderNodeOutputMaterial'))
emi.inputs['Color'].default_value = (1.0, 0.72, 0.42, 1)
emi.inputs['Strength'].default_value = 1.0
geo_, sep_, mr_ = bnt.nodes.new('ShaderNodeNewGeometry'), bnt.nodes.new('ShaderNodeSeparateXYZ'), bnt.nodes.new('ShaderNodeMapRange')
bnt.links.new(geo_.outputs['Position'], sep_.inputs[0])
bnt.links.new(sep_.outputs['Y'], mr_.inputs['Value'])
mr_.inputs['From Min'].default_value, mr_.inputs['From Max'].default_value = Y1 - 6.0, Y1        # the shaft fades away from the window
mr_.inputs['To Min'].default_value, mr_.inputs['To Max'].default_value = 0.0, 0.016
bnt.links.new(mr_.outputs['Result'], mix.inputs['Fac'])
bnt.links.new(tra.outputs[0], mix.inputs[1]); bnt.links.new(emi.outputs[0], mix.inputs[2]); bnt.links.new(mix.outputs[0], bout.inputs['Surface'])
BEAM.blend_method = 'BLEND'
BEAM.shadow_method = 'NONE'
for i, (c, w) in enumerate(WIN):
    for k, (za, zb) in enumerate(((Z_W0 + 0.05, (Z_W0 + Z_W1) / 2 - 0.03), ((Z_W0 + Z_W1) / 2 + 0.05, Z_W1 - 0.06))):
        q = [Vector((c - w / 2 + 0.06, Y1 + 0.05, za)), Vector((c + w / 2 - 0.06, Y1 + 0.05, za)),
             Vector((c + w / 2 - 0.06, Y1 + 0.05, zb)), Vector((c - w / 2 + 0.06, Y1 + 0.05, zb))]
        fl = [v + SDIR * ((0.005 - v.z) / SDIR.z) for v in q]
        bmb = bmesh.new()
        a_ = [bmb.verts.new(v) for v in q]
        b_ = [bmb.verts.new(v) for v in fl]
        for j in range(4):
            bmb.faces.new((a_[j], a_[(j + 1) % 4], b_[(j + 1) % 4], b_[j]))
        mb = bpy.data.meshes.new(f'beam{i}{k}')
        bmb.to_mesh(mb); bmb.free()
        ob = bpy.data.objects.new(f'beam{i}{k}', mb)
        sc.collection.objects.link(ob)
        mb.materials.append(BEAM)
# dust in the light: specks drifting slowly through the two shafts (moved on twos, below)
DUST = []
DM = emit_mat('dust', '#ffe2b0', None, 2.5)
rd = random.Random(5)
for i, (c, w) in enumerate(WIN):
    for k in range(26):
        s_ = rd.uniform(0.6, 5.5)                            # distance along the shaft from the window
        p0 = Vector((c + rd.uniform(-w / 2, w / 2), Y1, rd.uniform(Z_W0, Z_W1))) + SDIR * s_
        if p0.z < 0.3:
            continue
        d_ = ico(f'dust{i}{k}', tuple(p0), rd.uniform(0.004, 0.008), '#ffffff', 0)
        d_.data.materials[0] = DM
        DUST.append((d_, p0.copy(), rd.uniform(0, 6.28), rd.uniform(0.05, 0.12)))

# ============================================================== the narration's times, and the segments
T = dict(alot=_wt('a lot of powerful'), nobody=_wt('nobody ever'), so=_wt("So let's do it"), four=_wt('four pitchers'),
         one=_wt('one investor'), has=_wt('has a name'), strong=_wt('A strong country'), every=_wt('Every one of these'),
         bus=_wt('The Businessman'), farms=_wt("America's farms"), factories=_wt('factories'), new=_wt('new customers overseas'),
         anywhere=_wt('Anywhere with people'), adm=_wt('The Admiral'), tech=_wt('Technically'), amer=_wt("Americans didn't want"),
         pac=_wt('Now look at the Pacific', end=True), queen=_wt('It belonged to a queen'), pre=_wt('The Preacher'),
         minister=_wt('minister'), sci=_wt('The Scientist'), british=_wt('A British writer'),
         same0=_wt('The Preacher and the Scientist'), same=_wt('the same man'), js=_wt("Josiah Strong's own"))
DOCKS_T0 = T['farms'] - 0.6                                  # docks.py frame 0 (its own timeline)
LECTURE_T0 = T['sci'] - 0.05                                 # lecture.py frame 0 (L1)
TH_B = DOCKS_T0 + 52 / FPS                                   # j05: the board fills the frame (docks.py frame 52)
TH_N = DOCKS_T0 + 335 / FPS                                  # j06: starts on docks.py frame 335 ("new customers overseas")
TH_S = LECTURE_T0 + 35 / FPS                                 # j10: the board fills the frame (lecture.py frame 35, "A British")
TH_P = T['minister'] - 0.05                                  # j09: the board fills the frame (the church takes over)
B = lambda n: os.path.join(BUILD, n)
SEG = {  # name: (first frame's time, last frame's time, board picture)
    'j04': (0.0, T['so'] - 0.05 - 1 / FPS, os.path.join(HERE, 'assets', 'board_imperialism.png')),
    'pitch': (T['so'] - 0.05, T['strong'] - 0.05, os.path.join(HERE, 'assets', 'board_imperialism.png')),
    'j05': (T['every'] - 0.05, TH_B, B('board_docks_in.png')),
    'j06': (TH_N, T['tech'] - 0.05, B('board_docks_out.png')),
    'j08': (T['amer'] - 0.05, T['pac'] + 0.15, B('board_federation.png')),
    'j09': (T['queen'] - 0.05, TH_P, B('board_church.png')),
    'j10': (T['sci'] - 0.45, TH_S, B('board_lecture.png')),
    'same': (T['same0'] - 0.05, T['js'] - 0.05, os.path.join(HERE, 'assets', 'board_imperialism.png')),
}
STILLS = {'empty': 'j04', 'full': 'pitch', 'h4': 'j04', 'h8': 'j08'}
SEGN = STILLS.get(MODE, MODE)
S_T0, S_T1, BOARD_IMG = SEG[SEGN]
BOARD_IMG = os.environ.get('BOARD_IMG', BOARD_IMG)
if not os.path.exists(BOARD_IMG):
    print('BOARD picture missing, using the blank card:', BOARD_IMG)
    BOARD_IMG = os.path.join(HERE, 'assets', 'board_imperialism.png')
NF = int(round((S_T1 - S_T0) * FPS)) + 1
S_T0 = S_T1 - (NF - 1) / FPS                                 # the last frame lands exactly on its key
tf = lambda f: S_T0 + f / FPS                                # narration time of a segment frame
print('SEGMENT', SEGN, round(S_T0, 3), round(S_T1, 3), NF, 'frames; board', os.path.basename(BOARD_IMG))
BOARDM, BOARDMIX, BOARDTX = picture_mat('boardface', BOARD_IMG, 1.0)
bf.data.materials.append(BOARDM)

# ============================================================== people: a small pose engine
BODY = None


def body_axes(arm):
    bpy.context.view_layer.update()
    H = arm.pose.bones['Hips'].matrix
    F, U = Vector(H.col[2][:3]).normalized(), Vector(H.col[1][:3]).normalized()
    return F, U, F.cross(U)


HQ = [WALK.fcurves.find('pose.bones["Hips"].rotation_quaternion', index=i).evaluate(WALK.frame_range[0]) for i in range(4)]
_tw = math.hypot(HQ[0], HQ[2])
HIPS_Q = Quaternion((HQ[0] / _tw, 0, HQ[2] / _tw, 0))       # stand(): the hips keep only their facing


def reset_pose(arm):
    for pb in arm.pose.bones:
        pb.rotation_mode = 'QUATERNION'
        pb.location = (0, 0, 0)
        pb.rotation_quaternion = HIPS_Q if pb.name == 'Hips' else Quaternion()


def solve(arm, aims, base=None):
    """(after docks.py) a pose: `base` bones as given (degrees), then each bone in `aims` turned so it points along a
    direction in body terms (front, up, right). Returns {bone: Quaternion}."""
    act = arm.animation_data.action
    arm.animation_data.action = None
    reset_pose(arm)
    out = {}
    for bn, e in (base or {}).items():
        q = Euler([math.radians(v) for v in e], 'XYZ').to_quaternion()
        arm.pose.bones[bn].rotation_quaternion = q
        out[bn] = q
    F, U, R = body_axes(arm)
    for bn, d in aims:
        pb = arm.pose.bones[bn]
        bpy.context.view_layer.update()
        M = pb.matrix.copy()
        y_ = Vector(M.col[1][:3]).normalized()
        want = (F * d[0] + U * d[1] + R * d[2]).normalized()
        R3 = y_.rotation_difference(want).to_matrix() @ M.to_3x3()
        M2 = R3.to_4x4()
        M2.translation = M.translation
        pb.matrix = M2
        bpy.context.view_layer.update()
        out[bn] = pb.rotation_quaternion.copy()
    arm.animation_data.action = act
    reset_pose(arm)
    return out


STAND = {'LeftArm': (78, 0, 9), 'RightArm': (78, 0, -9), 'LeftForeArm': (0, 0, 8), 'RightForeArm': (0, 0, -8)}
FIST = lambda s: {f'{s}HandIndex1': (70, 0, 0), f'{s}HandIndex2': (75, 0, 0), f'{s}HandIndex3': (60, 0, 0), f'{s}HandThumb2': (30, 0, 0)}
WFC = {(fc.data_path, fc.array_index): fc for fc in WALK.fcurves}
WBONES = sorted({fc.data_path.split('"')[1] for fc in WALK.fcurves})
CYCLE, PASS = 24.0, (1.0, 13.0)                              # walk cycle length (action frames); passing poses (feet together)
STEP_M = PG['FOOT'] * PG['K']                                # metres walked per action frame of the cycle (planted foot)
VWALK = 0.95                                                 # a calm walking speed, m/s


def walk_pose(ct):
    ct = (ct % CYCLE) + WALK.frame_range[0]
    q, l = {}, {}
    for b in WBONES:
        fq = [WFC.get((f'pose.bones["{b}"].rotation_quaternion', i)) for i in range(4)]
        if fq[0]:
            q[b] = Quaternion([f.evaluate(ct) for f in fq]).normalized()
        fl = [WFC.get((f'pose.bones["{b}"].location', i)) for i in range(3)]
        if fl[0] and b == 'Hips':
            l[b] = Vector([f.evaluate(ct) for f in fl])
    return q, l


def ease(u):
    u = min(1.0, max(0.0, u))
    return u * u * (3 - 2 * u)


def ang_lerp(a, b, u):
    d = (b - a + 180) % 360 - 180
    return a + d * u


class Pitcher:
    """one pitcher over a segment: a standing base pose, gestures (bone poses blended in and out over time), nods, and
    walks (straight legs on the floor at a calm speed, the cycle driven by distance so the feet stay planted)"""

    def __init__(s, name, costume, x, y, heading, base_aims, base=None, held=(), k=0.0):
        s.name, s.k = name, k
        s.root, s.arm = person(f'p_{name}', costume, (x, y, 0.0), heading)
        s.x, s.y, s.h = x, y, heading
        s.base = dict(solve(s.arm, base_aims, dict(STAND, **(base or {}))))
        for b, e in STAND.items():
            s.base.setdefault(b, Euler([math.radians(v) for v in e], 'XYZ').to_quaternion())
        s.held = set(held)
        s.gest, s.walks, s.nods, s.turns = [], [], [], []

    def pose(s, aims, base=None):
        return solve(s.arm, aims, base)

    def gesture(s, t0, t1, pose, ramp=0.25, ramp_out=None):
        s.gest.append((t0, t1, pose, ramp, ramp if ramp_out is None else ramp_out))

    def nod(s, t, amt=14.0, dur=0.45):
        s.nods.append((t, amt, dur))

    def turn(s, t, heading, dur=0.35):
        s.turns.append((t, heading, dur))

    def walk(s, t0, x1, y1, h1):
        """walk from where he stands at t0 to (x1, y1), then face h1"""
        x0, y0, h0 = s.where_at(t0)
        d = math.hypot(x1 - x0, y1 - y0)
        acc = 0.3
        dur = d / VWALK + acc                                # trapezoid speed: accelerate and slow over `acc` s each
        ht = math.degrees(math.atan2(-(x1 - x0), (y1 - y0)))
        n_ = d / STEP_M                                      # action frames walked: end on a passing pose
        end = min(PASS, key=lambda p: abs(((p - n_) % CYCLE)))
        s.walks.append(dict(t0=t0, t1=t0 + dur, p0=(x0, y0), p1=(x1, y1), h0=h0, ht=ht, h1=h1, d=d, acc=acc,
                            phase=(end - n_) % CYCLE))
        return t0 + dur

    def where_at(s, t):
        x, y, h = s.x, s.y, s.h
        for w in s.walks:
            if t >= w['t1']:
                x, y = w['p1']
                h = w['h1']
        return x, y, h

    def _dist(s, w, t):
        """distance along a walk at time t (trapezoid speed profile)"""
        T_, a, d = w['t1'] - w['t0'], w['acc'], w['d']
        v = d / (T_ - a)
        u = min(max(t - w['t0'], 0.0), T_)
        if u < a:
            return 0.5 * v / a * u * u
        if u > T_ - a:
            r = T_ - u
            return d - 0.5 * v / a * r * r
        return 0.5 * v * a + v * (u - a)

    def state(s, t):
        """(x, y, heading, walk weight, cycle time)"""
        x, y, h = s.x, s.y, s.h
        ww, ct = 0.0, None
        for w in s.walks:
            if t < w['t0']:
                break
            if t >= w['t1'] + 0.3:
                x, y = w['p1']
                h = w['h1']
                continue
            dd = s._dist(w, t)
            u = dd / w['d'] if w['d'] > 0 else 1
            x = w['p0'][0] + (w['p1'][0] - w['p0'][0]) * u
            y = w['p0'][1] + (w['p1'][1] - w['p0'][1]) * u
            ct = w['phase'] + dd / STEP_M
            el, rem = t - w['t0'], w['t1'] - t
            ww = ease(min(el, rem) / 0.18) if rem > 0 else 0.0
            hmid = ang_lerp(w['ht'], w['h1'], 0.5)
            if t >= w['t1']:
                h = ang_lerp(hmid, w['h1'], ease((t - w['t1']) / 0.3))
            elif rem < 0.3:
                h = ang_lerp(ang_lerp(w['h0'], w['ht'], ease(el / 0.3)), hmid, ease(1 - rem / 0.3))
            else:
                h = ang_lerp(w['h0'], w['ht'], ease(el / 0.3))
            break
        for t0, hh, dur in s.turns:
            if t >= t0:
                h = ang_lerp(h, hh, ease((t - t0) / dur))
        return x, y, h, ww, ct

    def bones_at(s, t):
        q = dict(s.base)
        for t0, t1, pose, r_in, r_out in s.gest:
            if t0 - 0.001 <= t <= t1 + r_out:
                w = ease((t - t0) / r_in) if t < t0 + r_in else (1 - ease((t - t1) / r_out) if t > t1 else 1.0)
                for b, gq in pose.items():
                    q[b] = q.get(b, Quaternion()).slerp(gq, w)
        q['Spine1'] = q.get('Spine1', Quaternion()) @ Euler((0, 0, math.radians(1.4 * math.sin(t * 1.5 + s.k))), 'XYZ').to_quaternion()
        for t0, amt, dur in s.nods:
            if t0 <= t <= t0 + dur:
                a = math.sin(math.pi * (t - t0) / dur) * math.radians(amt)
                q['Neck'] = q.get('Neck', Quaternion()) @ Euler((a, 0, 0), 'XYZ').to_quaternion()
        return q

    def bake(s, frames):
        """write the root and the bones for each frame where the 12 fps step changes"""
        arm, root = s.arm, s.root
        act = bpy.data.actions.new(arm.name + '_act')
        arm.animation_data.action = act
        for pb in arm.pose.bones:
            pb.rotation_mode = 'QUATERNION'
        names = [pb.name for pb in arm.pose.bones]
        fcq = {b: [act.fcurves.new(f'pose.bones["{b}"].rotation_quaternion', index=i) for i in range(4)] for b in names}
        fcl = [act.fcurves.new('pose.bones["Hips"].location', index=i) for i in range(3)]
        for b, k_ in PG['SCALE_BONES'].items():
            for i in range(3):
                act.fcurves.new(f'pose.bones["{b}"].scale', index=i).keyframe_points.insert(0, k_).interpolation = 'CONSTANT'
        root.animation_data_clear()
        last = None
        for f in frames:
            tq = math.floor(tf(f) * 12) / 12
            if tq == last:
                continue
            last = tq
            x, y, h, ww, ct = s.state(tq)
            q = s.bones_at(tq)
            if ww > 0 and ct is not None:
                wq, wl = walk_pose(ct)
                for b, qq in wq.items():
                    if b not in s.held:
                        q[b] = q.get(b, Quaternion()).slerp(qq, ww)
                loc = wl.get('Hips', Vector()) * ww
            else:
                loc = Vector()
            for b in names:
                qq = q.get(b, HIPS_Q if b == 'Hips' else Quaternion())
                for i in range(4):
                    fcq[b][i].keyframe_points.insert(f, qq[i]).interpolation = 'CONSTANT'
            for i in range(3):
                fcl[i].keyframe_points.insert(f, loc[i]).interpolation = 'CONSTANT'
            root.location = (x, y, 0.0)
            root.rotation_euler = (0, 0, math.radians(h) + math.pi)
            root.keyframe_insert('location', frame=f)
            root.keyframe_insert('rotation_euler', frame=f)
        for fc in root.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = 'CONSTANT'

    def attach(s, bone, verts, faces, col, frame=0):
        """a prop in the bone's pose space (raw body units, origin at the bone head, y along the bone), riding the bone"""
        sc.frame_set(frame)
        bpy.context.view_layer.update()
        ob = mesh_from(f'{s.name}_{bone}_prop', verts, faces, col)
        pb = s.arm.pose.bones[bone]
        ob.parent = s.arm
        ob.parent_type = 'BONE'
        ob.parent_bone = bone
        bpy.context.view_layer.update()
        ob.matrix_world = s.arm.matrix_world @ pb.matrix
        return ob


def boxv(cx, cy, cz, sx, sy, sz):
    v = [(cx + a * sx / 2, cy + b * sy / 2, cz + c * sz / 2) for c in (-1, 1) for b in (-1, 1) for a in (-1, 1)]
    return v, [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4), (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)]


def rodv(y0, y1, r, n=6, ox=0.0, oz=0.0):
    v, f = [], []
    for y in (y0, y1):
        for i in range(n):
            a = 2 * math.pi * i / n
            v.append((ox + r * math.cos(a), y, oz + r * math.sin(a)))
    f = [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)] + [tuple(range(n))[::-1], tuple(range(n, 2 * n))]
    return v, f


# places on the floor: the four homes behind the table (between the chairs), the two presenter spots by the board
HOME = {'lecturer': (-3.05, 5.6, 182), 'minister': (-0.75, 5.65, 178), 'captain': (1.45, 5.6, 181), 'businessman': (3.0, 5.25, 192)}
LEFT_SPOT, RIGHT_SPOT = (3.05, 3.85, 207), (5.6, 3.85, 152)
WAIT_L, WAIT_R = (2.35, 4.95, 200), (5.85, 4.45, 160)
PEOPLE = []
if MODE != 'empty' and SEGN != 'j04':
    pos = dict(HOME)
    if SEGN == 'j06':
        pos['businessman'] = LEFT_SPOT
    if SEGN == 'j08':
        pos['captain'] = LEFT_SPOT
    if SEGN == 'j09':
        pos['minister'] = WAIT_L
    if SEGN == 'j10':
        pos['lecturer'] = WAIT_R
    if SEGN == 'same':
        pos['minister'], pos['lecturer'] = LEFT_SPOT, RIGHT_SPOT
    P = {}
    # the businessman: right thumb hooked in the waistcoat
    P['businessman'] = Pitcher('businessman', 'businessman', *pos['businessman'],
                               [('RightArm', (0.2, -0.9, 0.38)), ('RightForeArm', (0.75, 0.05, -0.66))], held=('RightArm', 'RightForeArm', 'RightHand'), k=0.0)
    # the captain: hands behind his back
    P['captain'] = Pitcher('captain', 'captain', *pos['captain'],
                           [('LeftArm', (-0.45, -0.88, -0.12)), ('RightArm', (-0.45, -0.88, 0.12)),
                            ('LeftForeArm', (-0.55, 0.1, 0.83)), ('RightForeArm', (-0.55, 0.1, -0.83))],
                           held=('LeftArm', 'RightArm', 'LeftForeArm', 'RightForeArm'), k=0.7)
    # the minister: a book held to his chest in the left hand
    P['minister'] = Pitcher('minister', 'minister', *pos['minister'],
                            [('LeftArm', (0.2, -0.95, -0.22)), ('LeftForeArm', (0.82, 0.38, 0.42))], held=('LeftArm', 'LeftForeArm', 'LeftHand'), k=1.4)
    # the lecturer: a pointer in the right hand, its tip down by his foot
    P['lecturer'] = Pitcher('lecturer', 'lecturer', *pos['lecturer'],
                            [('RightArm', (0.12, -0.97, 0.2)), ('RightForeArm', (0.55, -0.82, 0.12))], base=FIST('Right'),
                            held=('RightArm', 'RightForeArm', 'RightHand'), k=2.1)
    PEOPLE = list(P.values())
    bu, ca, mi, le = P['businessman'], P['captain'], P['minister'], P['lecturer']
    PRESENT = bu.pose([('LeftArm', (0.5, -0.05, -0.86)), ('LeftForeArm', (0.62, 0.22, -0.75))], {'Head': (0, -22, 0)})
    OPEN = bu.pose([('LeftArm', (0.55, -0.45, -0.7)), ('LeftForeArm', (0.75, 0.05, -0.66)),
                    ('RightArm', (0.55, -0.45, 0.7)), ('RightForeArm', (0.75, 0.05, 0.66))])
    SALUTE = ca.pose([('RightArm', (0.42, 0.12, 0.9)), ('RightForeArm', (0.3, 0.78, -0.55))])
    PREACH = mi.pose([('RightArm', (0.45, 0.55, 0.7)), ('RightForeArm', (0.3, 0.95, 0.08))], {'Head': (-10, 0, 0)})
    POINT = le.pose([('RightArm', (0.45, 0.05, 0.89)), ('RightForeArm', (0.45, 0.3, 0.84))], dict(FIST('Right'), Head=(0, 22, 0)))
    if SEGN == 'pitch':                                      # "four pitchers": a nod each, left to right
        for i, p in enumerate((le, mi, ca, bu)):
            p.nod(T['four'] + 0.05 + i * 0.22)
    if SEGN == 'j05':                                        # "The Businessman": steps up to the board and presents it
        arr = bu.walk(T['bus'] - 0.85, *LEFT_SPOT)
        bu.gesture(arr - 0.1, 99, PRESENT, ramp=0.35)
    if SEGN == 'j06':
        bu.gesture(-1, T['anywhere'] - 0.15, PRESENT, ramp=0.1, ramp_out=0.3)
        bu.gesture(T['anywhere'] - 0.1, T['anywhere'] + 1.2, OPEN, ramp=0.3, ramp_out=0.5)   # "Anywhere": he opens his hands
        arr = ca.walk(T['adm'] - 0.2, HOME['captain'][0] + 0.05, 4.98, 180)                   # "The Admiral": a step up
        ca.gesture(arr + 0.05, arr + 1.25, SALUTE, ramp=0.25, ramp_out=0.35)
    if SEGN == 'j08':
        ca.gesture(-1, 99, ca.pose([('LeftArm', (0.5, -0.1, -0.86)), ('LeftForeArm', (0.62, 0.2, -0.76))], {'Head': (0, -22, 0)}), ramp=0.1)
    if SEGN == 'j09':                                        # "The Preacher": steps up to the board, his right hand raised
        arr = mi.walk(T['pre'] - 0.6, *LEFT_SPOT)
        mi.gesture(arr - 0.05, 99, PREACH, ramp=0.35)
    if SEGN == 'j10':                                        # "The 'Scientist'": steps up and points at the board
        arr = le.walk(T['sci'] - 0.7, *RIGHT_SPOT)
        le.gesture(arr - 0.1, 99, POINT, ramp=0.3)
    if SEGN == 'same':                                       # "the same man": the two step together in front of the board
        mi.walk(T['same'] - 0.35, EX - 0.24, 3.72, 186)
        le.walk(T['same'] - 0.3, EX + 0.24, 3.72, 174)
        mi.turn(T['same'] + 1.05, 160, 0.3)
        le.turn(T['same'] + 1.1, 200, 0.3)
    for p in PEOPLE:
        p.bake(range(NF))
    # props: the minister's book (left hand), the lecturer's pointer (right hand), the businessman's watch chain
    v, f_ = boxv(0.0, 0.42, -0.2, 0.62, 0.8, 0.16)
    mi.attach('LeftHand', v, f_, '#2a2220')
    v, f_ = boxv(0.0, 0.42, -0.2, 0.56, 0.74, 0.17)
    mi.attach('LeftHand', [(a, b, c + 0.005) for a, b, c in v], f_, '#d8cfb8')                  # the page edges
    v, f_ = rodv(-0.3, 3.4, 0.035, 6, 0.0, -0.12)
    le.attach('RightHand', v, f_, '#3a2a1c')

# ============================================================== the finishing pass, the grade bypass for the pictures
LK = {'__name__': 'look'}
exec(compile(open(os.path.join(HERE, 'look.py')).read(), os.path.join(HERE, 'look.py'), 'exec'), LK)
LK['finish'](sc, fill_strength=0.5, shadow_fill='#7a6450', haze=(60.0, 400.0, 0.0), rules={
    PANEL: (0.12, 0.9, None, 1.0), PANEL_DK: (0.10, 0.9, None, 1.0), FLOOR: (0.12, 0.6, None, 1.0), TABLE: (0.07, 1.2, None, 1.0),
    CURT: (0.10, 1.4, None, 1.0), CURT_DK: (0.10, 1.4, None, 1.0), CURT_LT: (0.10, 1.4, None, 1.0), PAPER: (0.03, 2.0, None, 1.0)})
ee = sc.eevee
ee.taa_render_samples = int(os.environ.get('SAMPLES', '16'))
ee.use_soft_shadows = True
ee.use_bloom, ee.bloom_threshold, ee.bloom_intensity, ee.bloom_radius = True, 1.1, 0.05, 5.0
ee.shadow_cascade_size, ee.shadow_cube_size = '4096', '1024'
sc.view_settings.view_transform, sc.view_settings.look, sc.view_settings.exposure, sc.view_settings.gamma = 'Standard', 'None', 0.0, 1.0
vl = sc.view_layers[0]
aov = vl.aovs.add()                                          # EEVEE has no object index pass: the pictures write an AOV
aov.name, aov.type = 'pic', 'VALUE'
ct = sc.node_tree
comp = [n for n in ct.nodes if n.type == 'COMPOSITE'][0]
graded = comp.inputs['Image'].links[0].from_socket
cbn = [n for n in ct.nodes if n.type == 'COLORBALANCE'][0]
ungraded = cbn.inputs['Image'].links[0].from_socket
rl = ct.nodes.new('CompositorNodeRLayers')
rl.scene, rl.layer = sc, vl.name
byp = ct.nodes.new('CompositorNodeMixRGB')
ct.links.new(rl.outputs['pic'], byp.inputs['Fac'])
ct.links.new(graded, byp.inputs[1])
ct.links.new(ungraded, byp.inputs[2])
ct.links.new(byp.outputs['Image'], comp.inputs['Image'])

# ============================================================== cameras: one continuous move per segment
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
cam.data.sensor_fit = 'HORIZONTAL'
cam.data.sensor_width = 36.0
cam.data.clip_start = 0.05


def square_on(x, z, y_plane, width, lens=35.0):
    """the camera square-on to a vertical picture plane at y_plane, the frame `width` metres wide, centred at x, z"""
    d = width * lens / cam.data.sensor_width
    return (x, y_plane - d, z), (x, y_plane, z), lens


def map_frame(lon, lat, span, lens=35.0):
    x, z = map_xz(lon, lat)
    return square_on(x, z, MAP_Y, span / (MAP_BBOX[2] - MAP_BBOX[0]) * (MX1 - MX0), lens)


H4 = map_frame(228.0, 33.0, 40.0)
H8 = map_frame(202.0, 21.3, 90.0)
FILL = square_on(EX, BOARD_C.z, BOARD_Y, BW)                 # the board exactly fills the frame
WIDE = ((-0.6, -4.6, 1.65), (-0.2, 8.0, 1.75), 30.0)          # the locked wide (the plate's framing)


def K(t, shot, stop=True, fstop=None):
    return (t, shot, stop, fstop)


CAM = {
    'j04': [K(0.0, H4), K(T['alot'] - 0.1, H4),
            K(T['alot'] + 1.9, ((3.95, 3.7, 2.92), (3.6, 8.0, 2.75), 33.0), False),
            K(T['alot'] + 4.4, ((1.7, -1.6, 2.15), (1.0, 8.0, 2.05), 30.0), False),
            K(T['nobody'] - 2.6, ((0.3, -3.6, 1.8), (0.15, 8.0, 1.85), 30.0), False),
            K(T['nobody'], WIDE)],
    'pitch': [K(T['so'] - 0.05, WIDE), K(T['four'] + 1.1, WIDE),
              K(T['has'] - 0.05, ((0.35, -2.4, 1.72), (2.0, 5.6, 1.5), 32.0), False), K(T['strong'] - 0.05, FILL)],
    'j05': [K(T['every'] - 0.05, ((1.3, -2.5, 1.72), (2.2, 6.0, 1.5), 30.0), False),
            K(T['bus'] + 0.55, ((2.1, -1.0, 1.7), (3.25, 5.5, 1.5), 31.0), False), K(TH_B, FILL)],
    'j06': [K(TH_N, FILL), K(TH_N + 2.3, ((3.1, -0.6, 1.72), (3.1, 5.6, 1.5), 30.0), False),
            K(T['tech'] - 0.05, ((2.2, -0.9, 1.72), (2.2, 5.6, 1.55), 31.0))],
    'j08': [K(T['amer'] - 0.05, FILL), K(T['amer'] + 1.15, ((4.05, 1.15, 1.95), (3.9, 6.0, 1.85), 33.0), False),
            K(T['amer'] + 2.2, ((3.75, 3.35, 2.85), (3.6, 8.0, 2.95), 34.0), False), K(T['pac'] + 0.15, H8)],
    'j09': [K(T['queen'] - 0.05, H8), K(T['pre'] - 0.1, map_frame(202.0, 21.0, 72.0)),
            K(T['pre'] + 1.35, ((4.1, 1.3, 1.82), (4.15, 5.6, 1.62), 32.0)), K(TH_P, FILL)],
    'j10': [K(T['sci'] - 0.45, ((4.55, 0.4, 1.68), (4.45, 5.6, 1.55), 30.0), False),
            K(T['sci'] + 0.35, ((4.45, 1.0, 1.66), (4.35, 5.6, 1.58), 32.0), False), K(TH_S, FILL)],
    'same': [K(T['same0'] - 0.05, ((4.3, -0.2, 1.62), (4.3, 5.6, 1.42), 30.0), False),
             K(T['js'] - 0.05, ((4.3, 0.6, 1.6), (4.3, 5.6, 1.42), 32.0))],
}


def cam_at(keys, t):
    """Hermite through the keys: stop keys have zero velocity, the others Catmull-Rom tangents (time-scaled)"""
    vec = lambda k: list(k[1][0]) + list(k[1][1]) + [k[1][2]]
    if t <= keys[0][0]:
        return vec(keys[0])
    if t >= keys[-1][0]:
        return vec(keys[-1])
    i = max(j for j in range(len(keys) - 1) if keys[j][0] <= t)
    def tan(j):
        if keys[j][2] or j == 0 or j == len(keys) - 1:
            return [0.0] * 7
        a, b = vec(keys[j - 1]), vec(keys[j + 1])
        return [(bb - aa) / (keys[j + 1][0] - keys[j - 1][0]) for aa, bb in zip(a, b)]
    p0, p1, m0, m1 = vec(keys[i]), vec(keys[i + 1]), tan(i), tan(i + 1)
    h = keys[i + 1][0] - keys[i][0]
    u = (t - keys[i][0]) / h
    h00, h10, h01, h11 = 2 * u ** 3 - 3 * u ** 2 + 1, u ** 3 - 2 * u ** 2 + u, -2 * u ** 3 + 3 * u ** 2, u ** 3 - u ** 2
    return [h00 * a + h10 * h * ma + h01 * b + h11 * h * mb for a, b, ma, mb in zip(p0, p1, m0, m1)]


# the map's unlit mix over a segment: 1 at the map handoffs, the room's 0.3 elsewhere; the board's by distance
LITMAP, LITBOARD = 0.3, 0.25
FILL_D = BOARD_Y - FILL[0][1]


def map_unlit(t):
    if SEGN == 'j04':
        return 1.0 - (1.0 - LITMAP) * ease((t - T['alot'] + 0.1) / 2.6)
    if SEGN == 'j08':
        return LITMAP + (1.0 - LITMAP) * ease((t - (T['pac'] - 1.25)) / 1.3)
    if SEGN == 'j09':
        return 1.0 - (1.0 - LITMAP) * ease((t - T['pre']) / 1.1)
    return LITMAP


keys = CAM[SEGN]
cam.data.dof.use_dof = True
FR_ENV = os.environ.get('FRAMES', '')
for f in range(NF):
    t = tf(f)
    v = cam_at(keys, t)
    cam.location, tgt.location, cam.data.lens = v[0:3], v[3:6], v[6]
    cam.keyframe_insert('location', frame=f)
    tgt.keyframe_insert('location', frame=f)
    cam.data.keyframe_insert('lens', frame=f)
    cam.data.dof.focus_distance = (Vector(v[3:6]) - Vector(v[0:3])).length
    cam.data.dof.aperture_fstop = 4.0
    cam.data.dof.keyframe_insert('focus_distance', frame=f)
    MAPMIX.inputs['Fac'].default_value = map_unlit(t)
    MAPMIX.inputs['Fac'].keyframe_insert('default_value', frame=f)
    dist = BOARD_Y - v[1]                                    # the board's picture takes over as the camera comes close
    BOARDMIX.inputs['Fac'].default_value = LITBOARD + (1 - LITBOARD) * ease((3.2 * FILL_D - dist) / (2.0 * FILL_D))
    BOARDMIX.inputs['Fac'].keyframe_insert('default_value', frame=f)
for ad in (cam.animation_data, tgt.animation_data, cam.data.animation_data, MAPM.node_tree.animation_data, BOARDM.node_tree.animation_data):
    for fc in ad.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'LINEAR'
# the lamp's sway and the dust's drift, on twos (12 fps)
last = None
for f in range(NF):
    tq = math.floor(tf(f) * 12) / 12
    if tq == last:
        continue
    last = tq
    lamp_piv.rotation_euler = (math.radians(0.7 * math.sin(tq * 2.1)), math.radians(0.5 * math.sin(tq * 1.7 + 1.0)), 0)
    lamp_piv.keyframe_insert('rotation_euler', frame=f)
    for d_, p0, ph, sp in DUST:
        d_.location = p0 + Vector((0.05 * math.sin(tq * 0.4 + ph), 0.04 * math.cos(tq * 0.33 + ph), sp * math.sin(tq * 0.25 + ph * 2)))
        d_.keyframe_insert('location', frame=f)
for ob in [lamp_piv] + [d for d, *_ in DUST]:
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'CONSTANT'

# ============================================================== render
sc.frame_start, sc.frame_end = 0, NF - 1
sc.render.resolution_percentage = SCALE
os.makedirs(OUT, exist_ok=True)
if MODE in STILLS:
    f = {'empty': int(round((T['nobody'] + 1.0 - S_T0) * FPS)), 'full': int(round((T['four'] - 0.6 - S_T0) * FPS)), 'h4': 0, 'h8': NF - 1}[MODE]
    paths = [(f, os.path.join(OUT, f'pitchroom_{MODE}.png'))]
else:
    if FR_ENV in ('', 'all'):
        frames = list(range(NF))
    elif ':' in FR_ENV:
        a, b, st = (FR_ENV.split(':') + ['1'])[:3]
        frames = list(range(int(a), min(int(b) if b else NF, NF), int(st)))
        if os.environ.get('WITH_LAST', '1') == '1' and NF - 1 not in frames:
            frames.append(NF - 1)
    else:
        frames = [min(int(v), NF - 1) for v in FR_ENV.split(',') if v]
    paths = [(f, os.path.join(OUT, f'{f:04d}.png')) for f in frames]
if os.environ.get('DBG_CAM'):                                # a fixed camera for checking poses: x,y,z,lx,ly,lz,lens
    dv = [float(v) for v in os.environ['DBG_CAM'].split(',')]
    for ob in (cam, tgt, cam.data):
        ob.animation_data_clear()
    cam.location, tgt.location, cam.data.lens = dv[0:3], dv[3:6], dv[6]
    cam.data.dof.use_dof = False
print('PITCHROOM', SEGN, 'frames', NF, 'rendering', len(paths), flush=True)
for f, p in paths:
    if os.path.exists(p) and os.path.getsize(p) > 0 and not os.environ.get('FORCE'):     # resumable: skip finished frames
        continue
    # where the board exactly fills the frame, sample its picture texel for texel with no reconstruction blur, so the
    # frame is the picture itself (the hand-off); elsewhere the usual filtering
    at_fill = (Vector(cam_at(keys, tf(f))[0:3]) - Vector(FILL[0])).length < 1e-4 and not os.environ.get('DBG_CAM')
    BOARDTX.interpolation = 'Closest' if at_fill else 'Linear'
    sc.render.filter_size = 0.0 if at_fill else 1.5
    sc.frame_set(f)
    sc.render.filepath = p
    t0_ = time.time()
    bpy.ops.render.render(write_still=True)
    print('FRAME', SEGN, f, round(time.time() - t0_, 2), 's', flush=True)
