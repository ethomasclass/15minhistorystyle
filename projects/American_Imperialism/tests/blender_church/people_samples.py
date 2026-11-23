# People pass: Quaternius' CC0 low-poly human as the base body, re-coloured in flat palette colours (faceless), with
# period clothing built in code and attached to the bones, in the church diorama. Walks are stepped at 12 fps and the
# body moves at the speed of its own planted foot, so nothing slides.
#   xvfb-run -a blender -b --python people_samples.py -- <out_dir> <mode: lineup|walk> [first] [last]
import bpy, bmesh, math, os, sys
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/people'
MODE = argv[1] if len(argv) > 1 else 'lineup'
F0, F1 = (int(argv[2]), int(argv[3])) if len(argv) > 3 else (0, 0)

# ---- the church setting without its old blocky people, and without rendering
os.environ['CHURCH_PEOPLE'] = '0'
os.environ['CHURCH_NORENDER'] = '1'
G = {'__file__': os.path.join(HERE, 'church_scene.py'), '__name__': 'church'}
exec(compile(open(G['__file__']).read(), G['__file__'], 'exec'), G)
sc = bpy.context.scene
mat, lin, empty = G['mat'], G['lin'], G['empty']
FPS = 30

# ---- the base body
SRC = os.path.join(HERE, 'assets', 'quaternius_animated_human', 'animated_human.blend')
with bpy.data.libraries.load(SRC, link=False) as (src, dst):
    dst.objects = ['Human Armature', 'Human_Mesh']
    dst.actions = [a for a in src.actions if a in ('Walk', 'Idle')]
T_ARM = bpy.data.objects['Human Armature']
T_MESH = bpy.data.objects['Human_Mesh']
WALK, IDLE = bpy.data.actions['Walk'], bpy.data.actions['Idle']
K = 1.7 / 5.55                                               # raw units -> metres (the model is 5.55 units tall)

# which part of the body each face belongs to, from the bone that moves it most
CAT = {'Head': 'skin', 'Neck': 'skin', 'LeftHand': 'skin', 'RightHand': 'skin', 'LeftFoot': 'shoes', 'RightFoot': 'shoes',
       'LeftToeBase': 'shoes', 'RightToeBase': 'shoes', 'LeftUpLeg': 'legs', 'RightUpLeg': 'legs', 'LeftLeg': 'legs', 'RightLeg': 'legs'}
SLOTS = ['coat', 'skin', 'hair', 'legs', 'shoes']
me = T_MESH.data
me.materials.clear()
for s in SLOTS:
    me.materials.append(mat('#888888'))
gname = {g.index: g.name for g in T_MESH.vertex_groups}
hy = max(v.co.y for v in me.vertices)
for p in me.polygons:
    tot = {}
    for vi in p.vertices:
        for g in me.vertices[vi].groups:
            n = gname[g.group]
            n = 'LeftHand' if n.startswith('LeftHand') else ('RightHand' if n.startswith('RightHand') else n)
            tot[n] = tot.get(n, 0) + g.weight
    best = max(tot, key=tot.get) if tot else 'Spine'
    c = CAT.get(best, 'coat')
    cen = sum((me.vertices[i].co for i in p.vertices), Vector()) / len(p.vertices)
    if c == 'skin' and best == 'Head' and (p.normal.x < -0.1 or cen.y > hy - 0.5):
        c = 'hair'                                           # back and top of the head: hair, so the face stays plain
    p.material_index = SLOTS.index(c)
    p.use_smooth = False
for ob in (T_ARM, T_MESH):
    if ob.name not in sc.collection.objects:
        sc.collection.objects.link(ob)
T_ARM.hide_render = T_MESH.hide_render = True

# bone rest positions in the root's frame (raw units), for building clothes
BM = T_ARM.matrix_basis.copy()
def bone_head(n):
    return BM @ T_ARM.data.bones[n].head_local


def bone_parent_inverse(n):
    b = T_ARM.data.bones[n]
    return (BM @ b.matrix_local @ Matrix.Translation((0, b.length, 0))).inverted()


HIPS, SP2, HEAD = bone_head('Hips'), bone_head('Spine2'), bone_head('Head')
TOP = bone_head('HeadTop_End')
T_ARM.location = (0, 0, -50)
print('BONES raw', tuple(round(v, 2) for v in HIPS), tuple(round(v, 2) for v in SP2), tuple(round(v, 2) for v in HEAD), tuple(round(v, 2) for v in TOP))


# ---- clothing shells, in raw units, facing -y
def frustum(z0, z1, r0, r1, n=12, a0=0, a1=360, cx=0.0, cy=0.0, sx=1.0, sy=0.85, cap=False):
    verts, faces = [], []
    m = n + 1 if a1 - a0 < 360 else n
    for i in range(m):
        a = math.radians(a0 + (a1 - a0) * i / n)
        verts += [(cx + r0 * sy * math.cos(a), cy + r0 * sx * math.sin(a), z0), (cx + r1 * sy * math.cos(a), cy + r1 * sx * math.sin(a), z1)]   # front = +x (the rest pose faces +x)
    for i in range(n):
        j = (i + 1) % m
        faces.append((2 * i, 2 * j, 2 * j + 1, 2 * i + 1))
    if cap:
        verts.append((cx, cy, z1))
        faces += [(2 * i + 1, 2 * ((i + 1) % m) + 1, len(verts) - 1) for i in range(n)]
    return verts, faces


def dome(cz, r, sz=0.8, n=10, rings=3, cx=0.0, cy=0.0, front_cut=None):
    verts, faces = [], []
    for k in range(rings + 1):
        e = math.pi / 2 * k / rings
        for i in range(n):
            a = 2 * math.pi * i / n
            verts.append((cx + r * math.cos(e) * math.cos(a), cy + r * math.cos(e) * math.sin(a), cz + r * sz * math.sin(e)))
    for k in range(rings):
        for i in range(n):
            if front_cut and k < front_cut[0] and (i <= front_cut[1] or i >= n - front_cut[1]):
                continue
            a, b = k * n + i, k * n + (i + 1) % n
            faces.append((a, b, b + n, a + n))
    return verts, faces


def shell(name, vf, col, arm, bone):
    verts, faces = vf
    bm = bmesh.new()
    vs = [bm.verts.new(v) for v in verts]
    for f in faces:
        try:
            bm.faces.new([vs[i] for i in f])
        except ValueError:
            pass
    m = bpy.data.meshes.new(name)
    bm.to_mesh(m); bm.free()
    for p in m.polygons:
        p.use_smooth = False
    ob = bpy.data.objects.new(name, m)
    sc.collection.objects.link(ob)
    m.materials.append(mat(col))
    ob.modifiers.new('solid', 'SOLIDIFY').thickness = 0.03
    ob.parent = arm
    ob.parent_type = 'BONE'
    ob.parent_bone = bone
    ob.matrix_parent_inverse = bone_parent_inverse(bone)
    return ob


hz, sz_, headz, topz = HIPS.z, SP2.z, HEAD.z, TOP.z
hx, hyy = HIPS.x, HIPS.y
COSTUMES = {
    'gentleman': dict(coat='#2b2824', skin='#d9b38f', hair='#5b4330', legs='#3a3631', shoes='#1d1b18',
                      parts=[('tails', 'Hips', lambda: frustum(hz + 0.15, 1.35, 0.62, 0.84, 12, 50, 310, hx, hyy), '#2b2824'),
                             ('hat', 'Head', lambda: frustum(topz - 0.12, topz + 0.72, 0.36, 0.38, 10, cap=True, cx=HEAD.x, cy=HEAD.y + 0.03), '#1f1d1a'),
                             ('brim', 'Head', lambda: frustum(topz - 0.12, topz - 0.08, 0.62, 0.62, 12, cap=True, cx=HEAD.x, cy=HEAD.y + 0.03), '#1f1d1a'),
                             ('collar', 'Spine2', lambda: frustum(sz_ + 0.62, sz_ + 0.82, 0.34, 0.3, 10, -60, 60, SP2.x, SP2.y - 0.02), '#efe9dc')]),
    'holoku': dict(coat='#d98b8c', skin='#8f6a4c', hair='#2a2622', legs='#d98b8c', shoes='#3a2c22',
                   parts=[('dress', 'Hips', lambda: frustum(hz + 1.05, 0.42, 0.62, 1.15, 14, cx=hx, cy=hyy), '#d98b8c'),
                          ('yoke', 'Spine2', lambda: frustum(sz_ + 0.3, sz_ + 0.75, 0.62, 0.38, 12, cx=SP2.x, cy=SP2.y), '#e6a6a3'),
                          ('straw', 'Head', lambda: frustum(topz - 0.2, topz - 0.16, 0.85, 0.85, 14, cap=True, cx=HEAD.x, cy=HEAD.y), '#d9c79a'),
                          ('crown', 'Head', lambda: frustum(topz - 0.2, topz + 0.18, 0.4, 0.36, 10, cap=True, cx=HEAD.x, cy=HEAD.y), '#cdb98a'),
                          ('band', 'Head', lambda: frustum(topz - 0.16, topz - 0.04, 0.41, 0.4, 10, cx=HEAD.x, cy=HEAD.y), '#8f3b2e')]),
    'missionary': dict(coat='#3a2f3a', skin='#e3c4a2', hair='#5b4330', legs='#3a2f3a', shoes='#1d1b18',
                       parts=[('dress', 'Hips', lambda: frustum(hz + 0.95, 0.42, 0.6, 1.1, 14, cx=hx, cy=hyy), '#3a2f3a'),
                              ('collar', 'Spine2', lambda: frustum(sz_ + 0.62, sz_ + 0.8, 0.33, 0.29, 10, -70, 70, SP2.x, SP2.y - 0.02), '#efe9dc'),
                              ('bonnet', 'Head', lambda: dome(headz + 0.1, 0.55, 1.05, 10, 3, HEAD.x, HEAD.y + 0.08, front_cut=(3, 2)), '#ece4d0')]),
    'sailor': dict(coat='#27324a', skin='#c79b78', hair='#2a2622', legs='#27324a', shoes='#1d1b18',
                   parts=[('collar', 'Spine2', lambda: frustum(sz_ + 0.35, sz_ + 0.78, 0.66, 0.38, 10, 120, 240, SP2.x, SP2.y), '#3f5a86'),
                          ('stripe', 'Spine2', lambda: frustum(sz_ + 0.36, sz_ + 0.42, 0.68, 0.64, 10, 120, 240, SP2.x, SP2.y), '#efe9dc'),
                          ('cap', 'Head', lambda: frustum(topz - 0.25, topz - 0.05, 0.42, 0.5, 12, cap=True, cx=HEAD.x, cy=HEAD.y), '#1f2a3c'),
                          ('belt', 'Hips', lambda: frustum(hz + 0.2, hz + 0.45, 0.6, 0.6, 12, cx=hx, cy=hyy), '#b79a68'),
                          ('legL', 'LeftLeg', lambda: frustum(0.35, 1.25, 0.26, 0.24, 8, cx=bone_head('LeftLeg').x, cy=bone_head('LeftLeg').y), '#b79a68'),
                          ('legR', 'RightLeg', lambda: frustum(0.35, 1.25, 0.26, 0.24, 8, cx=bone_head('RightLeg').x, cy=bone_head('RightLeg').y), '#b79a68')]),
    'officer': dict(coat='#1f2a44', skin='#d9b38f', hair='#6e5a45', legs='#ece6d6', shoes='#1d1b18',
                    parts=[('tails', 'Hips', lambda: frustum(hz + 0.15, 1.05, 0.62, 0.84, 12, 45, 315, hx, hyy), '#1f2a44'),
                           ('cap', 'Head', lambda: frustum(topz - 0.22, topz + 0.05, 0.42, 0.52, 12, cap=True, cx=HEAD.x, cy=HEAD.y), '#1b2333'),
                           ('peak', 'Head', lambda: frustum(topz - 0.24, topz - 0.2, 0.47, 0.5, 8, -55, 55, HEAD.x, HEAD.y), '#111111'),
                           ('belt', 'Hips', lambda: frustum(hz + 0.3, hz + 0.45, 0.62, 0.62, 12, cx=hx, cy=hyy), '#c9a648'),
                           ('collar', 'Spine2', lambda: frustum(sz_ + 0.62, sz_ + 0.82, 0.34, 0.3, 10, -60, 60, SP2.x, SP2.y - 0.02), '#efe9dc')]),
    'worker': dict(coat='#e3dccb', skin='#8f6a4c', hair='#2a2622', legs='#4a4439', shoes='#2a2622',
                   parts=[('straw', 'Head', lambda: frustum(topz - 0.2, topz - 0.16, 0.8, 0.8, 14, cap=True, cx=HEAD.x, cy=HEAD.y), '#d9c79a'),
                          ('crown', 'Head', lambda: frustum(topz - 0.2, topz + 0.15, 0.4, 0.34, 10, cap=True, cx=HEAD.x, cy=HEAD.y), '#cdb98a'),
                          ('sash', 'Hips', lambda: frustum(hz + 0.25, hz + 0.45, 0.6, 0.6, 12, cx=hx, cy=hyy), '#8f3b2e')]),
}


def person(name, costume, loc, heading_deg, yaw_fix=0.0):
    C = COSTUMES[costume]
    root = empty(name, loc)
    root.scale = (K, K, K)
    root.rotation_euler = (0, 0, math.radians(heading_deg + yaw_fix) + math.pi)
    arm = T_ARM.copy()
    arm.animation_data_clear()
    sc.collection.objects.link(arm)
    arm.parent = root
    arm.location = (0, 0, 0)
    arm.hide_render = False
    m = T_MESH.copy()
    m.data = T_MESH.data.copy()
    sc.collection.objects.link(m)
    m.parent = arm
    m.hide_render = False
    for md in m.modifiers:
        if md.type == 'ARMATURE':
            md.object = arm
    for i, s in enumerate(SLOTS):
        m.data.materials[i] = mat(C[s])
    for pn, bone, fn, col in C['parts']:
        shell(f'{name}_{pn}', fn(), col, arm, bone)
    arm.animation_data_create()
    return root, arm


def drive(arm, action, f, tq, rate, phase=0.0, length=24):
    tr = arm.animation_data.nla_tracks[0] if arm.animation_data.nla_tracks else arm.animation_data.nla_tracks.new()
    if not tr.strips:
        st = tr.strips.new(action.name, 0, action)
        st.use_animated_time = True
        st.use_sync_length = False
    st = tr.strips[0]
    st.strip_time = (tq * rate + phase) % length + st.action_frame_start
    st.keyframe_insert('strip_time', frame=f)


SCALE_BONES = {'Head': 0.8, 'LeftHand': 0.75, 'RightHand': 0.75}     # smaller heads and hands than the stock model


def bake(arm, action, times, rate, phase=0.0, length=24):
    """write this person's own action: the source action sampled at stepped times (one entry per scene frame)"""
    act = bpy.data.actions.new(arm.name + '_baked')
    n = len(times)
    keys = [(f, ((t * rate + phase) % length) + action.frame_range[0]) for f, t in enumerate(times)]
    for fc in action.fcurves:
        nfc = act.fcurves.new(fc.data_path, index=fc.array_index)
        nfc.keyframe_points.add(n)
        for k, (f, ta) in enumerate(keys):
            nfc.keyframe_points[k].co = (f, fc.evaluate(ta))
            nfc.keyframe_points[k].interpolation = 'CONSTANT'
    for b, k_ in SCALE_BONES.items():
        for i in range(3):
            path = f'pose.bones["{b}"].scale'
            nfc = act.fcurves.find(path, index=i) or act.fcurves.new(path, index=i)
            nfc.keyframe_points.clear()
            nfc.keyframe_points.insert(0, k_).interpolation = 'CONSTANT'
    arm.animation_data.action = act
    return act


FOOT = 0.212                                               # raw units per action frame while a foot is planted (measured)
RATE = 17.0                                                # action frames per second: a calm walk
V = FOOT * RATE * K                                        # metres per second

ORDER = ['gentleman', 'holoku', 'missionary', 'sailor', 'officer', 'worker']
cam = sc.camera
tgt = bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()

if MODE == 'lineup':
    PEOPLE = [person(f'p{i}', c, (-5.0 + i * 2.0, -10.0, 0.0), 180) for i, c in enumerate(ORDER)]   # caught mid-stride, walking toward us
    for i, (root, arm) in enumerate(PEOPLE):
        bake(arm, WALK, [0.0], RATE, phase=3.0 + i * 4.0)
    cam.location, tgt.location = (1.2, -24.5, 1.7), (0.0, -10.0, 1.05)
    cam.data.lens = 45
    sc.frame_start = sc.frame_end = 0
    frames = [0]
else:
    WALKS = [('gentleman', (-0.9, -21), 0, 0.0), ('holoku', (0.9, -22.5), 0, 0.3), ('sailor', (-8.5, -9.5), -90, 0.0),
             ('officer', (-10.3, -8.2), -90, 0.4), ('missionary', (8.0, -8.8), 90, 0.2), ('worker', (10.0, -7.4), 90, 0.6)]
    PEOPLE = []
    for i, (c, (x, y), hd, t0) in enumerate(WALKS):
        root, arm = person(f'w{i}', c, (x, y, 0), hd)
        PEOPLE.append((root, arm, (x, y), hd, t0))
    n = int(4.0 * FPS)
    sc.frame_start, sc.frame_end = 0, n - 1
    TQ = [math.floor(f / FPS * 12) / 12 for f in range(n)]
    for i, (root, arm, (x, y), hd, t0) in enumerate(PEOPLE):
        TT = [max(0.0, tq - t0) for tq in TQ]
        a = math.radians(hd)
        for f, tt in enumerate(TT):
            root.location = (x - math.sin(a) * V * tt, y + math.cos(a) * V * tt, 0)
            root.keyframe_insert('location', frame=f)
        for fc in root.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = 'CONSTANT'
        bake(arm, WALK, TT, RATE, phase=i * 3.0)
    cam.data.lens = 32
    cam.location, tgt.location = (2.5, -34, 2.6), (0.0, -11.0, 4.0)      # still camera: people move on twos, so only 12 renders a second
    frames = [f for f in range(n) if f == 0 or math.floor(f / FPS * 12) != math.floor((f - 1) / FPS * 12)]

os.makedirs(OUT, exist_ok=True)
import time
for f in frames:
    sc.frame_set(f)
    sc.render.filepath = os.path.join(OUT, f'{f:04d}.png')
    t = time.time()
    bpy.ops.render.render(write_still=True)
    print('FRAME', f, round(time.time() - t, 2), flush=True)
