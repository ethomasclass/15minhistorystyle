# Ep 1, chapter 4: the Preacher's world, inside the Hawaiian mission church (the church diorama of tests/blender_church,
# hollowed and furnished as in its transition test): sunlit pews, the congregation standing (backs to us), the minister in
# the pulpit with his right hand raised. One shot, a slow push up the aisle. Frame 0 is the picture on the pitch-room easel
# board (pitchroom.py j09): the camera flies into the board and hands off here on "Strong was a" (ch04).
#   xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python church_interior.py -- <out_dir> [scale%]
#   renders the frames in $FRAMES ("all", a comma list, or a:b:step) into <out_dir>/NNNN.png
import bpy, bmesh, math, os, sys, time, random
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/church_in'
SCALE = int(argv[1]) if len(argv) > 1 else 100
KIT = os.path.join(HERE, '..', '..', 'tests', 'blender_church')
FPS, DUR = 30, 4.0
N = int(DUR * FPS)

# ---- the church exterior and the people library (people_samples builds the church scene in lib mode)
saved = sys.argv
sys.argv = [sys.argv[0], '--', '/tmp/unused', 'lib']
PG = {'__file__': os.path.join(KIT, 'people_samples.py'), '__name__': 'people'}
try:
    exec(compile(open(PG['__file__']).read(), PG['__file__'], 'exec'), PG)
except Exception as e:
    if type(e).__name__ != 'LibDone':
        raise
sys.argv = saved
G = PG['G']
sc = bpy.context.scene
box, mat, cyl = G['box'], G['mat'], G['cyl']
W, D, WH, PD = G['W'], G['D'], G['WH'], G['PD']
person, stand = PG['person'], PG['stand']


def cut(target_names, cutter):
    for n in target_names:
        ob = bpy.data.objects[n]
        m = ob.modifiers.new('cut', 'BOOLEAN')
        m.operation, m.object, m.solver = 'DIFFERENCE', cutter, 'EXACT'
    cutter.hide_render = True
    cutter.display_type = 'WIRE'


# ---- the interior, as in transition_test.py: a hollow nave, windows on the sunny side, floor, pews, pulpit
cut(['nave'], box('hollow', -W / 2 + 0.2, 0.2, 0.62, W / 2 - 0.2, D - 0.2, WH - 0.15, '#ff00ff'))
for i, y in enumerate((3.5, 7.5, 11.5, 15.5)):
    cut(['nave'], box(f'win_cutter{i}', -W / 2 - 0.6, y - 0.45, 1.9, -W / 2 + 0.6, y + 0.45, 4.7, '#ff00ff'))
    for k in (1, 2):
        box(f'wmun{i}{k}', -W / 2 - 0.05, y - 0.45, 1.9 + 2.8 * k / 3 - 0.03, -W / 2 + 0.05, y + 0.45, 1.9 + 2.8 * k / 3 + 0.03, '#efeadc')
    box(f'wmv{i}', -W / 2 - 0.05, y - 0.03, 1.9, -W / 2 + 0.05, y + 0.03, 4.7, '#efeadc')
FLOOR, PEW, PEW_DK = '#8a6a45', '#6e5038', '#5a4130'
box('floor', -W / 2 + 0.21, 0.21, 0.62, W / 2 - 0.21, D - 0.21, 0.67, FLOOR)
for k in range(24):
    x = -W / 2 + 0.25 + k * 0.48
    box(f'plank{k}', x, 0.21, 0.67, x + 0.015, D - 0.21, 0.675, '#6e5038')
box('runner', -0.7, 0.4, 0.67, 0.7, D - 2.8, 0.682, '#8f3b2e')
ROWS = [3.0 + r * 1.3 for r in range(9)]
for r, y in enumerate(ROWS):                                 # backrests on the door side: the pews face the pulpit
    for (x0, x1) in ((-4.9, -1.1), (1.1, 4.9)):
        box(f'pewseat{r}{x0}', x0, y + 0.05, 0.95, x1, y + 0.5, 1.02, PEW)
        box(f'pewback{r}{x0}', x0, y, 1.0, x1, y + 0.08, 1.75, PEW_DK)
        for xe in (x0, x1 - 0.06):
            box(f'pewend{r}{x0}{xe}', xe, y, 0.6, xe + 0.06, y + 0.5, 1.8, PEW_DK)
box('platform', -3.0, D - 2.8, 0.6, 3.0, D - 0.2, 0.85, PEW)
box('pulpit', -0.75, D - 2.4, 0.85, 0.75, D - 1.75, 1.95, PEW_DK)
box('pulpit_top', -0.85, D - 2.5, 1.95, 0.85, D - 1.65, 2.05, PEW)
box('bible', -0.3, D - 2.3, 2.05, 0.3, D - 1.95, 2.1, '#3a2a22')
box('cross_v', -0.09, D - 0.3, 2.6, 0.09, D - 0.2, 4.6, '#7a5c35')                 # a plain wooden cross on the back wall
box('cross_h', -0.6, D - 0.3, 3.75, 0.6, D - 0.2, 3.93, '#7a5c35')

# ---- the congregation, standing in the pews; the minister in the pulpit
rr = random.Random(11)
CONG = ['holoku', 'missionary', 'gentleman', 'worker', 'holoku', 'businessman', 'missionary', 'holoku', 'worker', 'gentleman']
k = 0
for r in range(1, 8):
    y = ROWS[r] + 0.85
    for side, (x0, x1) in enumerate(((-4.6, -1.5), (1.5, 4.6))):
        n = rr.choice((2, 3, 3))
        xs = sorted(rr.uniform(x0, x1) for _ in range(n))
        for i in range(1, len(xs)):
            xs[i] = max(xs[i], xs[i - 1] + 0.62)
        for x in xs:
            if x > x1 + 0.1:
                continue
            root, arm = person(f'c{k}', CONG[k % len(CONG)], (x, y, 0.67), rr.uniform(-8, 8))
            stand(arm, N, k=rr.uniform(0, 6))
            k += 1
print('CONGREGATION', k)
mroot, marm = person('preacher', 'minister', (0.0, D - 1.25, 0.85), 180)
stand(marm, N, pose={'RightArm': (25, 0, -60), 'RightForeArm': (0, 0, -70), 'LeftArm': (60, 0, 20), 'LeftForeArm': (0, 0, 40)}, k=0.5)

# ---- light inside: a warm fill under the ceiling, sunbeams through the left windows
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
for n_ in list(bnt.nodes):
    bnt.nodes.remove(n_)
emi, tra, mix, bout = (bnt.nodes.new(t) for t in ('ShaderNodeEmission', 'ShaderNodeBsdfTransparent', 'ShaderNodeMixShader', 'ShaderNodeOutputMaterial'))
emi.inputs['Color'].default_value = (1.0, 0.86, 0.6, 1)
mix.inputs['Fac'].default_value = 0.04
bnt.links.new(tra.outputs[0], mix.inputs[1]); bnt.links.new(emi.outputs[0], mix.inputs[2]); bnt.links.new(mix.outputs[0], bout.inputs['Surface'])
beam.blend_method = 'BLEND'
beam.shadow_method = 'NONE'
for i, y in enumerate((3.5, 7.5, 11.5, 15.5)):
    q = [Vector((-W / 2, y - 0.45, 1.9)), Vector((-W / 2, y + 0.45, 1.9)), Vector((-W / 2, y + 0.45, 4.7)), Vector((-W / 2, y - 0.45, 4.7))]
    fl = [v + sd * ((0.6 - v.z) / sd.z) for v in q]
    bmb = bmesh.new()
    a_ = [bmb.verts.new(v) for v in q]
    b_ = [bmb.verts.new(v) for v in fl]
    for j in range(4):
        bmb.faces.new((a_[j], a_[(j + 1) % 4], b_[(j + 1) % 4], b_[j]))
    mb = bpy.data.meshes.new(f'beam{i}')
    bmb.to_mesh(mb); bmb.free()
    ob = bpy.data.objects.new(f'beam{i}', mb)
    sc.collection.objects.link(ob)
    mb.materials.append(beam)

# ---- the camera: in the aisle behind the back rows, a slow push toward the pulpit
cam, tgt = sc.camera, bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()
cam.data.lens = 28
for f, pos, look in ((0, (0.35, 1.0, 2.45), (0.0, D, 2.35)), (N - 1, (0.3, 3.2, 2.35), (0.0, D, 2.4))):
    cam.location = pos; cam.keyframe_insert('location', frame=f)
    tgt.location = look; tgt.keyframe_insert('location', frame=f)
for ob in (cam, tgt):
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'LINEAR'
cam.data.dof.use_dof = False
sc.frame_start, sc.frame_end = 0, N - 1
sc.render.resolution_percentage = SCALE
os.makedirs(OUT, exist_ok=True)
fr = os.environ.get('FRAMES', '0')
if fr == 'all':
    frames = list(range(N))
elif ':' in fr:
    a, b, st = (fr.split(':') + ['1'])[:3]
    frames = list(range(int(a), min(int(b), N), int(st)))
else:
    frames = [int(v) for v in fr.split(',') if v]
for f in frames:
    sc.frame_set(f)
    sc.render.filepath = os.path.join(OUT, f'{f:04d}.png')
    t = time.time()
    bpy.ops.render.render(write_still=True)
    print('FRAME', f, round(time.time() - t, 2), flush=True)
