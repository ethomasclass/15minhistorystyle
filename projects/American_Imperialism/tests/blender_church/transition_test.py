# Transition test (the MagnatesMedia move, in Blender): one continuous camera move from outside the mission church, through
# the open front door, up the aisle past sunlit pews, into a framed painting on the back wall. The painting holds the
# first frame of the code-drawn palace scene (tests/living_scene); when the painting fills the frame exactly, the film
# hands off to that scene playing on. Blender worlds and 2D scenes, joined by one move.
#   xvfb-run -a blender -b --python transition_test.py -- <out_dir> <first> <last>
import bpy, bmesh, math, os, sys
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/tr'
F0, F1 = (int(argv[1]), int(argv[2])) if len(argv) > 2 else (0, 0)

os.environ['CHURCH_PEOPLE'] = '0'
os.environ['CHURCH_NORENDER'] = '1'
saved = sys.argv
sys.argv = [sys.argv[0], '--', '/tmp/unused']
G = {'__file__': os.path.join(HERE, 'church_scene.py'), '__name__': 'church'}
exec(compile(open(G['__file__']).read(), G['__file__'], 'exec'), G)
sys.argv = saved
sc = bpy.context.scene
box, mat, empty = G['box'], G['mat'], G['empty']
W, D, WH, PD = G['W'], G['D'], G['WH'], G['PD']
FPS = 30
N = int(9.5 * FPS)
sc.frame_start, sc.frame_end = 0, N - 1


def cut(target_names, cutter):
    for n in target_names:
        ob = bpy.data.objects[n]
        m = ob.modifiers.new('cut', 'BOOLEAN')
        m.operation, m.object, m.solver = 'DIFFERENCE', cutter, 'EXACT'
    cutter.hide_render = True
    cutter.display_type = 'WIRE'


# ---- hollow the nave into a shell with 20 cm walls (it is a solid block in the exterior model)
cut(['nave'], box('hollow', -W / 2 + 0.2, 0.2, 0.62, W / 2 - 0.2, D - 0.2, WH - 0.15, '#ff00ff'))
# ---- open the doorway (porch front, porch back, nave front) and take the door leaves away
cut(['porch', 'nave'] + [o.name for o in bpy.data.objects if o.name.startswith('cbF')], box('door_cutter', -0.86, -PD - 1.0, 0.56, 0.86, 0.7, 3.2, '#ff00ff'))
for ob in list(bpy.data.objects):
    if ob.name in ('door', 'door_frame') or ob.name.startswith('panel'):
        bpy.data.objects.remove(ob, do_unlink=True)
TRIM = '#f6f2e8'
box('jambL', -1.05, -PD - 0.12, 0.55, -0.86, 0.05, 3.25, TRIM)          # the door frame as real jambs and a head
box('jambR', 0.86, -PD - 0.12, 0.55, 1.05, 0.05, 3.25, TRIM)
box('jambH', -1.05, -PD - 0.12, 3.2, 1.05, 0.05, 3.7, TRIM)
# ---- windows on the sunny (left) side, so light falls across the pews
for i, y in enumerate((3.5, 7.5, 11.5, 15.5)):
    cut(['nave'], box(f'win_cutter{i}', -W / 2 - 0.6, y - 0.45, 1.9, -W / 2 + 0.6, y + 0.45, 4.7, '#ff00ff'))
    for k in (1, 2):                                       # muntins, so the light pools are window-shaped
        box(f'wmun{i}{k}', -W / 2 - 0.05, y - 0.45, 1.9 + 2.8 * k / 3 - 0.03, -W / 2 + 0.05, y + 0.45, 1.9 + 2.8 * k / 3 + 0.03, '#efeadc')
    box(f'wmv{i}', -W / 2 - 0.05, y - 0.03, 1.9, -W / 2 + 0.05, y + 0.03, 4.7, '#efeadc')

# ---- the interior: plank floor, two blocks of pews, an aisle, a pulpit, the painting on the back wall
FLOOR, PEW, PEW_DK = '#8a6a45', '#6e5038', '#5a4130'
box('floor', -W / 2 + 0.21, 0.21, 0.62, W / 2 - 0.21, D - 0.21, 0.67, FLOOR)
for k in range(24):
    x = -W / 2 + 0.25 + k * 0.48
    box(f'plank{k}', x, 0.21, 0.67, x + 0.015, D - 0.21, 0.675, '#6e5038')
box('runner', -0.7, 0.4, 0.67, 0.7, D - 2.8, 0.682, '#8f3b2e')
for r in range(9):
    y = 3.0 + r * 1.3
    for (x0, x1) in ((-4.9, -1.1), (1.1, 4.9)):
        box(f'pewseat{r}{x0}', x0, y, 0.95, x1, y + 0.45, 1.02, PEW)
        box(f'pewback{r}{x0}', x0, y + 0.42, 1.0, x1, y + 0.5, 1.75, PEW_DK)
        for xe in (x0, x1 - 0.06):
            box(f'pewend{r}{x0}{xe}', xe, y, 0.6, xe + 0.06, y + 0.5, 1.8, PEW_DK)
box('pulpit', -0.75, D - 2.4, 0.6, 0.75, D - 1.6, 1.85, PEW_DK)
box('pulpit_top', -0.85, D - 2.5, 1.85, 0.85, D - 1.5, 1.95, PEW)
box('platform', -3.0, D - 2.8, 0.6, 3.0, D - 0.2, 0.85, PEW)

PW_, PH_, PZ = 1.6, 0.9, 3.05                              # the painting: exactly 16:9
box('frame', -PW_ / 2 - 0.14, D - 0.3, PZ - PH_ / 2 - 0.14, PW_ / 2 + 0.14, D - 0.19, PZ + PH_ / 2 + 0.14, '#b08e5e')
box('frame_in', -PW_ / 2 - 0.05, D - 0.32, PZ - PH_ / 2 - 0.05, PW_ / 2 + 0.05, D - 0.29, PZ + PH_ / 2 + 0.05, '#7a5c35')
bm = bmesh.new()
vs = [bm.verts.new(v) for v in ((-PW_ / 2, D - 0.33, PZ - PH_ / 2), (PW_ / 2, D - 0.33, PZ - PH_ / 2), (PW_ / 2, D - 0.33, PZ + PH_ / 2), (-PW_ / 2, D - 0.33, PZ + PH_ / 2))]
f = bm.faces.new(vs)
uv = bm.loops.layers.uv.new()
for loop, c in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))):
    loop[uv].uv = c
me = bpy.data.meshes.new('painting')
bm.to_mesh(me); bm.free()
pa = bpy.data.objects.new('painting', me)
sc.collection.objects.link(pa)
pm = bpy.data.materials.new('painting')
pm.use_nodes = True
nt = pm.node_tree
for n in list(nt.nodes):
    nt.nodes.remove(n)
img = nt.nodes.new('ShaderNodeTexImage')
img.image = bpy.data.images.load(os.path.join(HERE, '..', 'living_scene', 'build', 'f', '0000.png'))
img.interpolation = 'Closest'
em = nt.nodes.new('ShaderNodeEmission')
outn = nt.nodes.new('ShaderNodeOutputMaterial')
nt.links.new(img.outputs['Color'], em.inputs['Color'])
nt.links.new(em.outputs[0], outn.inputs['Surface'])
me.materials.append(pm)

# ---- light inside: a warm fill under the ceiling, and sunbeams through the left windows
fill = bpy.data.lights.new('fill', 'AREA')
fill.energy, fill.size, fill.color = 650, 14, (1.0, 0.9, 0.75)
fo = bpy.data.objects.new('fill', fill)
sc.collection.objects.link(fo)
fo.location = (0, D / 2, WH - 0.3)
sun = bpy.data.objects['sun']
bpy.context.view_layer.update()
sd = sun.matrix_world.to_3x3() @ Vector((0, 0, -1))
beam = bpy.data.materials.new('beam')
beam.use_nodes = True
bnt = beam.node_tree
for n in list(bnt.nodes):
    bnt.nodes.remove(n)
emi, tra, mix, bout = (bnt.nodes.new(t) for t in ('ShaderNodeEmission', 'ShaderNodeBsdfTransparent', 'ShaderNodeMixShader', 'ShaderNodeOutputMaterial'))
emi.inputs['Color'].default_value = (1.0, 0.86, 0.6, 1)
emi.inputs['Strength'].default_value = 1.0
mix.inputs['Fac'].default_value = 0.045
bnt.links.new(tra.outputs[0], mix.inputs[1]); bnt.links.new(emi.outputs[0], mix.inputs[2]); bnt.links.new(mix.outputs[0], bout.inputs['Surface'])
beam.blend_method = 'BLEND'
beam.shadow_method = 'NONE'
print('SUN DIR', tuple(round(v, 2) for v in sd))
for i, y in enumerate((3.5, 7.5, 11.5, 15.5)):
    q = [Vector((-W / 2, y - 0.45, 1.9)), Vector((-W / 2, y + 0.45, 1.9)), Vector((-W / 2, y + 0.45, 4.7)), Vector((-W / 2, y - 0.45, 4.7))]
    fl = [v + sd * ((0.6 - v.z) / sd.z) for v in q]
    bmb = bmesh.new()
    a_ = [bmb.verts.new(v) for v in q]
    b_ = [bmb.verts.new(v) for v in fl]
    for k in range(4):
        bmb.faces.new((a_[k], a_[(k + 1) % 4], b_[(k + 1) % 4], b_[k]))
    mb = bpy.data.meshes.new(f'beam{i}')
    bmb.to_mesh(mb); bmb.free()
    ob = bpy.data.objects.new(f'beam{i}', mb)
    sc.collection.objects.link(ob)
    mb.materials.append(beam)

# ---- the camera: one move, ending square-on to the painting with the painting exactly filling the frame
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
cam.data.lens = 35
Y_END = D - 0.33 - PW_ * cam.data.lens / 36.0
KEYS = [(0, (8.0, -50, 3.2), (0.4, 0, 8.5)), (95, (1.6, -15.5, 2.3), (0.0, 0, 2.8)), (140, (0.0, -3.4, 1.95), (0.0, 10, 2.2)),
        (170, (0.0, 1.8, 2.05), (0.0, 18, 2.5)), (250, (0.0, 12.4, 2.75), (0.0, D, PZ)), (N - 1, (0.0, Y_END, PZ), (0.0, D, PZ))]
for f, pos, look in KEYS:
    cam.location = pos; cam.keyframe_insert('location', frame=f)
    tgt.location = look; tgt.keyframe_insert('location', frame=f)
for ob in (cam, tgt):
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'BEZIER'
            kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
print('Y_END', Y_END)

os.makedirs(OUT, exist_ok=True)
import time
for f in range(F0, min(F1, N - 1) + 1):
    sc.frame_set(f)
    sc.render.filepath = os.path.join(OUT, f'{f:04d}.png')
    t = time.time()
    bpy.ops.render.render(write_still=True)
    print('FRAME', f, round(time.time() - t, 2), flush=True)
