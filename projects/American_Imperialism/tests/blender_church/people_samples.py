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
# ---- garments fitted to the body: at each height, sample the body mesh all the way round and wrap it
VPTS = []                                                  # (raw position, dominant bone) for every body vertex
for v in me.vertices:
    if v.groups:
        g = max(v.groups, key=lambda g: g.weight)
        VPTS.append((BM @ v.co, gname[g.group]))
TORSO = {'Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'LeftShoulder', 'RightShoulder'}
HIPLEG = TORSO | {'LeftUpLeg', 'RightUpLeg'}
NB = 20


def ring(z, groups, off, cx=None, cy=None, band=0.09, floor_r=0.2):
    """NB points round the body at height z: the outermost body surface in each direction, pushed out by off"""
    pts = [p for p, g in VPTS if g in groups and abs(p.z - z) < band]
    if cx is None:
        cx = sum(p.x for p in pts) / len(pts) if pts else 0.0
        cy = sum(p.y for p in pts) / len(pts) if pts else 0.0
    r = [0.0] * NB
    for p in pts:
        k = int(((math.atan2(p.y - cy, p.x - cx) + math.pi) / (2 * math.pi)) * NB) % NB
        r[k] = max(r[k], math.hypot(p.x - cx, p.y - cy))
    for _ in range(NB):                                    # fill directions with no vertices from their neighbours
        r = [r[k] if r[k] > 0 else max(r[(k - 1) % NB], r[(k + 1) % NB]) for k in range(NB)]
    r = [max(v, floor_r) for v in r]
    r = [(r[(k - 1) % NB] + 2 * r[k] + r[(k + 1) % NB]) / 4 for k in range(NB)]     # smooth a little
    return [(cx + (rr + off) * math.cos(-math.pi + 2 * math.pi * (k + 0.5) / NB), cy + (rr + off) * math.sin(-math.pi + 2 * math.pi * (k + 0.5) / NB), z)
            for k, rr in enumerate(r)], (cx, cy)


def circle(z, r, cx, cy, sx=1.0, sy=1.0):
    return [(cx + r * sx * math.cos(-math.pi + 2 * math.pi * (k + 0.5) / NB), cy + r * sy * math.sin(-math.pi + 2 * math.pi * (k + 0.5) / NB), z) for k in range(NB)]


def blend(ra, rb, u):
    return [(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u) for a, b in zip(ra, rb)]


def loft(rings, open_front=0.0, back_only=0.0, front_only=0.0):
    """faces between consecutive rings; open_front leaves a gap of that half-angle (deg) at the front (+x)"""
    verts = [v for rg in rings for v in rg]
    faces = []
    for j in range(len(rings) - 1):
        for k in range(NB):
            a = math.degrees(-math.pi + 2 * math.pi * (k + 0.5) / NB)
            if open_front and abs(a) < open_front:
                continue
            if back_only and abs(a) < 180 - back_only:
                continue
            if front_only and abs(a) > front_only:
                continue
            k2 = (k + 1) % NB
            faces.append((j * NB + k, j * NB + k2, (j + 1) * NB + k2, (j + 1) * NB + k))
    return verts, faces


ZW = (HIPS.z * 0.45 + SP2.z * 0.55)                          # the natural waist
ZH = HIPS.z - 0.12                                         # the widest part of the hips
ZN = bone_head('Neck').z
ZC = SP2.z + 0.25                                          # the chest


def skirt(hem_z, hem_r, top='waist', top_off=0.035, train=0.0):
    if top == 'chest':
        r0, c = ring(ZC, TORSO, top_off)
        r1, _ = ring(ZW, TORSO, top_off + 0.1, *c)
        rings = [r0, r1]
    else:
        r1, c = ring(ZW, TORSO, top_off)
        rings = [r1]
    rh, _ = ring(ZH, HIPLEG, top_off + 0.07, *c)
    hem = circle(hem_z, hem_r, c[0] - 0.05, c[1], sx=0.92, sy=1.0)
    if train:                                              # the back of the hem sweeps out behind (-x is the back)
        hem = [(x - train * max(0.0, -math.cos(-math.pi + 2 * math.pi * (k + 0.5) / NB)) ** 2, y, z) for k, (x, y, z) in enumerate(hem)]
    mid = blend(rh, hem, 0.45)
    return loft(rings + [rh, mid, hem])


def tails(knee_z=1.3, flare=0.82):
    r1, c = ring(ZW, TORSO, 0.04)
    rh, _ = ring(ZH, HIPLEG, 0.08, *c)
    kn = circle(knee_z, flare, c[0] - 0.06, c[1], sx=0.9, sy=1.0)
    return loft([r1, rh, blend(rh, kn, 0.5), kn], open_front=38)


def band(z, h, groups=TORSO, off=0.045):
    r0, c = ring(z - h / 2, groups, off)
    r1, _ = ring(z + h / 2, groups, off, *c)
    return loft([r0, r1])


def collar(h=0.2, off=0.03):
    r0, c = ring(ZN - 0.02, {'Neck'}, off, band=0.06, floor_r=0.1)
    r1, _ = ring(ZN + h, {'Neck'}, off - 0.01, *c, band=0.06, floor_r=0.09)
    return loft([r0, r1])


def sailor_collar():
    r0, c = ring(SP2.z + 0.62, TORSO, 0.04)
    r1, _ = ring(SP2.z + 0.05, TORSO, 0.05, *c)
    return loft([r0, r1], back_only=70)


def legging(side):
    grp = {side + 'Leg'}
    rings, c = [], None
    for z in (0.38, 0.8, 1.22):
        rg, c2 = ring(z, grp, 0.045, band=0.12, floor_r=0.12)
        rings.append(rg)
    return loft(rings)


HEADG = {'Head'}
HZTOP = max(p.z for p, g in VPTS if g == 'Head')          # the real top of the head (hair included)
ZB = HZTOP - 0.37                                          # the brow line, where a hat sits


def hring(z, off, c=None):
    return ring(z, HEADG, off, *(c or (None, None)), band=0.06, floor_r=0.15)


def scaled(rg, k, c, dz=0.0, kx=None):
    kx = k if kx is None else kx
    return [(c[0] + (x - c[0]) * kx, c[1] + (y - c[1]) * k, z + dz) for x, y, z in rg]


def capped(rings, **kw):
    """loft the rings and close the last one with a flat top"""
    v, f = loft(rings, **kw)
    last = rings[-1]
    cx = sum(p[0] for p in last) / NB; cy = sum(p[1] for p in last) / NB; cz = last[0][2]
    v = v + [(cx, cy, cz)]
    base = (len(rings) - 1) * NB
    f = f + [(base + k, base + (k + 1) % NB, len(v) - 1) for k in range(NB)]
    return v, f


def disc(inner, outer, curl=0.0):
    """a flat brim between two rings; curl lifts the sides"""
    o2 = [(x, y, z + curl * abs(math.sin(-math.pi + 2 * math.pi * (k + 0.5) / NB))) for k, (x, y, z) in enumerate(outer)]
    return loft([inner, o2])


R0, C0 = hring(ZB, 0.06)                                   # the head's outline at the brow, plus a little room


def top_hat():
    return capped([R0, scaled(R0, 1.06, C0, 0.78)])


def top_brim():
    return disc(scaled(R0, 0.98, C0), scaled(R0, 1.32, C0, 0.0, 1.22), curl=0.07)


def boater():
    return capped([R0, scaled(R0, 1.0, C0, 0.42)])


def boater_brim(k=1.55):
    return disc(scaled(R0, 0.98, C0), scaled(R0, k, C0, 0.0, k * 0.94))


def hat_band(z0, h, col_off=0.012):
    return loft([scaled(R0, 1.0 + col_off * 3, C0, z0), scaled(R0, 1.0 + col_off * 3, C0, z0 + h)])


def flat_cap():
    rb, c = hring(ZB + 0.02, 0.05)
    return capped([rb, scaled(rb, 1.0, c, 0.16), scaled(rb, 1.22, c, 0.24), scaled(rb, 1.2, c, 0.27)])


def peaked_cap():
    rb, c = hring(ZB, 0.05)
    return capped([rb, scaled(rb, 1.0, c, 0.17), scaled(rb, 1.16, c, 0.3), scaled(rb, 1.12, c, 0.33)])


def visor():
    rb, c = hring(ZB, 0.055)
    inner, outer = [], []
    for k, (x, y, z) in enumerate(rb):
        a = math.degrees(-math.pi + 2 * math.pi * (k + 0.5) / NB)
        if abs(a) <= 60:
            inner.append((x, y, z))
            outer.append((c[0] + (x - c[0]) * 1.45, c[1] + (y - c[1]) * 1.12, z - 0.07))
    v = inner + outer
    n = len(inner)
    return v, [(i, i + 1, n + i + 1, n + i) for i in range(n - 1)]


def bonnet():
    """a hood over the back and top of the head, open round the face, with its front edge standing a little forward"""
    rings, c = [], None
    for z in (HZTOP - 0.95, HZTOP - 0.7, HZTOP - 0.42, HZTOP - 0.15):
        rg, c2 = hring(z, 0.07, c)
        c = c or c2
        rings.append(rg)
    rings.append(scaled(rings[-1], 0.7, c, 0.14))
    return capped(rings, open_front=72)

COSTUMES = {
    'gentleman': dict(coat='#2b2824', skin='#d9b38f', hair='#5b4330', legs='#3a3631', shoes='#1d1b18',
                      parts=[('tails', 'Hips', lambda: tails(1.32, 0.8), '#2b2824'),
                             ('waist', 'Hips', lambda: band(ZW, 0.1), '#2b2824'),
                             ('collar', 'Spine2', lambda: collar(0.18), '#efe9dc'),
                             ('hat', 'Head', top_hat, '#1f1d1a'), ('brim', 'Head', top_brim, '#1f1d1a'), ('hband', 'Head', lambda: hat_band(0.02, 0.1), '#3a3631')]),
    'holoku': dict(coat='#d98b8c', skin='#8f6a4c', hair='#2a2622', legs='#d98b8c', shoes='#3a2c22',
                   parts=[('dress', 'Hips', lambda: skirt(0.42, 1.08, top='chest'), '#d98b8c'),
                          ('collar', 'Spine2', lambda: collar(0.16, 0.035), '#e9a7a4'),
                          ('crown', 'Head', boater, '#d9c79a'), ('brim', 'Head', boater_brim, '#d9c79a'),
                          ('band', 'Head', lambda: hat_band(0.03, 0.12), '#8f3b2e')]),
    'missionary': dict(coat='#3a2f3a', skin='#e3c4a2', hair='#5b4330', legs='#3a2f3a', shoes='#1d1b18',
                       parts=[('dress', 'Hips', lambda: skirt(0.42, 1.04), '#3a2f3a'),
                              ('waist', 'Hips', lambda: band(ZW, 0.1), '#2e252e'),
                              ('collar', 'Spine2', lambda: collar(0.17), '#efe9dc'),
                              ('bonnet', 'Head', bonnet, '#ece4d0')]),
    'sailor': dict(coat='#27324a', skin='#c79b78', hair='#2a2622', legs='#27324a', shoes='#1d1b18',
                   parts=[('collar', 'Spine2', sailor_collar, '#3f5a86'),
                          ('cap', 'Head', flat_cap, '#1f2a3c'),
                          ('belt', 'Hips', lambda: band(ZW - 0.05, 0.2), '#b79a68'),
                          ('legL', 'LeftLeg', lambda: legging('Left'), '#b79a68'),
                          ('legR', 'RightLeg', lambda: legging('Right'), '#b79a68')]),
    'officer': dict(coat='#1f2a44', skin='#d9b38f', hair='#6e5a45', legs='#ece6d6', shoes='#1d1b18',
                    parts=[('tails', 'Hips', lambda: tails(1.2, 0.78), '#1f2a44'),
                           ('belt', 'Hips', lambda: band(ZW, 0.13), '#c9a648'),
                           ('collar', 'Spine2', lambda: collar(0.17), '#efe9dc'),
                           ('cap', 'Head', peaked_cap, '#1b2333'), ('peak', 'Head', visor, '#111111'), ('cband', 'Head', lambda: hat_band(0.03, 0.08), '#c9a648')]),
    'worker': dict(coat='#e3dccb', skin='#8f6a4c', hair='#2a2622', legs='#4a4439', shoes='#2a2622',
                   parts=[('sash', 'Hips', lambda: band(ZW, 0.16), '#8f3b2e'),
                          ('crown', 'Head', boater, '#cdb98a'), ('brim', 'Head', lambda: boater_brim(1.5), '#cdb98a'), ('band', 'Head', lambda: hat_band(0.03, 0.1), '#5a4130')]),
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
    if C.get('nape'):                                      # hair worn up: the lower back of the head shows skin
        for p in m.data.polygons:
            if p.material_index == SLOTS.index('hair'):
                cz = (BM @ (sum((m.data.vertices[i].co for i in p.vertices), Vector()) / len(p.vertices))).z
                if cz < C['nape']:
                    p.material_index = SLOTS.index('skin')
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


STAND = {'LeftArm': (78, 0, 9), 'RightArm': (78, 0, -9), 'LeftForeArm': (0, 0, 8), 'RightForeArm': (0, 0, -8)}


def stand(arm, n, pose=None, breathe=True, k=0.0):
    """a calm standing pose (arms down, a little forward), breathing on twos, for n scene frames"""
    pose = dict(STAND, **(pose or {}))
    # the template carries a frame of its Idle animation: bent knees, one leg cocked, the hips tilted. Stand up straight:
    # keep only the hips' facing (their twist about the spine) and clear every other bone
    # (the Idle frame's twist is 43 degrees off square; the Walk's first frame faces straight ahead, so take the twist from that)
    hq = [WALK.fcurves.find('pose.bones["Hips"].rotation_quaternion', index=i).evaluate(WALK.frame_range[0]) for i in range(4)]
    tw = math.hypot(hq[0], hq[2])
    for pb in arm.pose.bones:
        pb.location = (0, 0, 0)
        pb.rotation_quaternion = (hq[0] / tw, 0, hq[2] / tw, 0) if pb.name == 'Hips' else (1, 0, 0, 0)
        pb.rotation_euler = (0, 0, 0)
    act = bpy.data.actions.new(arm.name + '_stand')
    for bn, (x, y, z) in pose.items():
        arm.pose.bones[bn].rotation_mode = 'XYZ'
        for i, v in enumerate((x, y, z)):
            fc = act.fcurves.new(f'pose.bones["{bn}"].rotation_euler', index=i)
            fc.keyframe_points.insert(0, math.radians(v)).interpolation = 'CONSTANT'
    if breathe:
        arm.pose.bones['Spine1'].rotation_mode = 'XYZ'
        fc = act.fcurves.new('pose.bones["Spine1"].rotation_euler', index=2)
        for f in range(0, n, 2):
            tq = math.floor(f / 30 * 12) / 12
            fc.keyframe_points.insert(f, math.radians(1.6 * math.sin(tq * 1.5 + k))).interpolation = 'CONSTANT'
    for b, k_ in SCALE_BONES.items():
        for i in range(3):
            act.fcurves.new(f'pose.bones["{b}"].scale', index=i).keyframe_points.insert(0, k_).interpolation = 'CONSTANT'
    arm.animation_data.action = act
    return act


def sash():
    """a sash from the right shoulder to the left hip"""
    r0, c = ring(ZC - 0.35, TORSO, 0.06)
    rows = []
    for dz in (0.0, 0.17):
        rows.append([(x, y, z + dz + 0.5 * (-math.sin(-math.pi + 2 * math.pi * (k + 0.5) / NB))) for k, (x, y, z) in enumerate(r0)])
    return loft(rows)


def bun():
    v, f = dome(HZTOP - 0.25, 0.2, 1.0, 8, 3, C0[0] - 0.34, C0[1])
    v2, f2 = dome(HZTOP - 0.25, 0.2, -1.0, 8, 3, C0[0] - 0.34, C0[1])
    n = len(v)
    return v + v2, f + [tuple(i + n for i in q) for q in f2]


def tube(p0, p1, prof, n=10, caps=False):
    """rings round the segment p0 -> p1 (raw units); prof = [(fraction along, radius), ...]"""
    p0, p1 = Vector(p0), Vector(p1)
    ax = p1 - p0
    L = ax.length
    ax.normalize()
    u = ax.orthogonal().normalized()
    w = ax.cross(u)
    verts, faces = [], []
    for t, r in prof:
        c = p0 + ax * (L * t)
        for i in range(n):
            a = 2 * math.pi * i / n
            verts.append(tuple(c + (u * math.cos(a) + w * math.sin(a)) * r))
    for j in range(len(prof) - 1):
        for i in range(n):
            faces.append((j * n + i, j * n + (i + 1) % n, (j + 1) * n + (i + 1) % n, (j + 1) * n + i))
    if caps:
        for j, t in ((0, prof[0][0]), (len(prof) - 1, prof[-1][0])):
            verts.append(tuple(p0 + ax * (L * t)))
            faces += [(j * n + i, j * n + (i + 1) % n, len(verts) - 1) for i in range(n)]
    return verts, faces


def bone_tail(n):
    return BM @ T_ARM.data.bones[n].tail_local


def limb_r(bone):
    """the radius of a limb: how far its vertices sit from the bone's axis"""
    a, b = bone_head(bone), bone_tail(bone)
    ax = (b - a).normalized()
    ds = [((p - a) - ax * (p - a).dot(ax)).length for p, g in VPTS if g == bone]
    ds.sort()
    return ds[int(len(ds) * 0.9)] if ds else 0.15


def puff(side):
    """a leg-of-mutton sleeve head: full at the shoulder, gathered in above the elbow"""
    b = side + 'Arm'
    r = limb_r(b)
    return tube(bone_head(b), bone_tail(b), [(-0.06, r * 1.0), (0.08, r * 1.42), (0.28, r * 1.58), (0.5, r * 1.36), (0.66, r * 1.06)], n=12, caps=True)


def cuff(side):
    b = side + 'ForeArm'
    r = limb_r(b)
    return tube(bone_head(b), bone_tail(b), [(0.84, r * 1.06), (0.92, r * 1.28), (1.0, r * 1.32)], n=10)


def hairdo():
    """hair drawn smoothly back from the face over the head to the nape"""
    rings, c = [], None
    for z, off in ((HZTOP - 0.86, 0.0), (HZTOP - 0.7, 0.004), (HZTOP - 0.55, 0.03), (HZTOP - 0.36, 0.045), (HZTOP - 0.14, 0.035)):
        rg, c2 = hring(z, off, c)
        c = c or c2
        rings.append(rg)
    rings.append(scaled(rings[-1], 0.62, c, 0.12))
    return capped(rings[1:], open_front=78)                # crown and sides, clear of the face; stops at the hairline (the nape is bare)


def topknot():
    """the knot of hair high on the back of the crown"""
    cx, cy = C0[0] - 0.2, C0[1]
    v, f = dome(HZTOP - 0.02, 0.21, 0.9, 10, 3, cx, cy)
    v2, f2 = dome(HZTOP - 0.02, 0.21, -0.55, 10, 2, cx, cy)
    n = len(v)
    return v + v2, f + [tuple(i + n for i in q) for q in f2]


def fringe():
    """a short curled fringe along the front hairline"""
    rg, c = hring(HZTOP - 0.3, 0.06)
    V_, F_ = [], []
    for k in range(NB):
        a = math.degrees(-math.pi + 2 * math.pi * (k + 0.5) / NB)
        if abs(a) > 55:
            continue
        x, y, z = rg[k]
        v, f = dome(z + 0.02, 0.065, 0.9, 6, 2, x, y)
        n = len(V_)
        V_ += v
        F_ += [tuple(i + n for i in q) for q in f]
    return V_, F_


def lace_collar():
    """a low lace collar round the base of the neck, so skin shows between it and the hair"""
    r0, c = ring(ZN + 0.04, {'Neck'}, 0.1, band=0.08, floor_r=0.12)
    r1, _ = ring(ZN + 0.13, {'Neck'}, 0.075, *c, band=0.08, floor_r=0.1)
    return loft([r0, r1])


NAPE = HZTOP - 0.7                                          # with hair swept up, the head below this line at the back is skin


def jabot():
    """lace falling from the throat down the front of the bodice"""
    r0, c = ring(ZN - 0.1, TORSO | {'Neck'}, 0.06, band=0.08)
    r1, _ = ring(ZC - 0.1, TORSO, 0.07, *c)
    return loft([r0, r1], front_only=12)


def buttons(col_z0=None, n=6):
    """a column of small buttons down the front of a tunic"""
    V_, F_ = [], []
    for k in range(n):
        z = ZW + 0.12 + k * (ZN - 0.2 - ZW - 0.12) / (n - 1)
        fx = max((q.x for q, g in VPTS if g in TORSO and abs(q.z - z) < 0.09 and abs(q.y - HIPS.y) < 0.12), default=0.4)
        p = Vector((fx + 0.035, HIPS.y, z))                # on the body's midline, just proud of the front
        v, f = tube(p - Vector((0.02, 0, 0)), p + Vector((0.03, 0, 0)), [(0, 0.045), (1, 0.045)], n=6, caps=True)
        m = len(V_)
        V_ += v
        F_ += [tuple(i + m for i in q) for q in f]
    return V_, F_


def sling_rifle():
    """a rifle slung muzzle-up across the back: butt at the left hip, muzzle over the right shoulder"""
    rg, c = ring(ZC, TORSO, 0.0)
    bx = min(p[0] for p in rg) - 0.16                       # behind the shoulder blades (-x is the back)
    L = 1.25 / K
    top = Vector((bx, c[1] - 0.55, ZN + 1.0))
    dy = 1.25
    bot = Vector((bx + 0.05, c[1] + 0.7, top.z - math.sqrt(L * L - dy * dy)))
    v1, f1 = tube(bot, top, [(0.0, 0.13), (0.42, 0.1), (0.5, 0.075)], n=6, caps=True)
    v2, f2 = tube(bot, top, [(0.45, 0.05), (1.0, 0.04)], n=6, caps=True)
    return v1, f1, v2, f2


def rifle_stock():
    v1, f1, _, _ = sling_rifle()
    return v1, f1


def rifle_barrel():
    _, _, v2, f2 = sling_rifle()
    return v2, f2


QUEEN_SKIN = '#8a6143'                                       # a warm medium brown, after her photographs
DRESS, LACE = '#29242b', '#ebe4d3'
QHAIR = '#36302c'                                          # dark, going grey by 1895
COSTUMES['queen'] = dict(nape=NAPE, coat=DRESS, skin=QUEEN_SKIN, hair=QHAIR, legs=DRESS, shoes='#1d1b18',
                         parts=[('dress', 'Hips', lambda: skirt(0.03, 1.2, train=0.55), DRESS),
                                ('waist', 'Hips', lambda: band(ZW, 0.09, off=0.05), '#1d1a1f'),
                                ('lace', 'Spine2', lace_collar, LACE), ('jabot', 'Spine2', jabot, LACE),
                                ('puffL', 'LeftArm', lambda: puff('Left'), DRESS), ('puffR', 'RightArm', lambda: puff('Right'), DRESS),
                                ('cuffL', 'LeftForeArm', lambda: cuff('Left'), LACE), ('cuffR', 'RightForeArm', lambda: cuff('Right'), LACE),
                                ('hairdo', 'Head', hairdo, QHAIR), ('knot', 'Head', topknot, QHAIR), ('fringe', 'Head', fringe, QHAIR)])
GUARD_PARTS = [('belt', 'Hips', lambda: band(ZW, 0.16), '#e8e2d4'),
               ('collar', 'Spine2', lambda: collar(0.16), '#232c40'),
               ('buttons', 'Spine2', buttons, '#c9a648'),
               ('cap', 'Head', peaked_cap, '#1b2333'), ('peak', 'Head', visor, '#111111')]
COSTUMES['guard'] = dict(coat='#232c40', skin='#d9b38f', hair='#3a2e25', legs='#2b3346', shoes='#15171c', parts=GUARD_PARTS)
COSTUMES['patrol'] = dict(COSTUMES['guard'], parts=GUARD_PARTS + [('stock', 'Spine2', rifle_stock, '#5a4532'), ('barrel', 'Spine2', rifle_barrel, '#2b2622')])

def spectacles():
    """two small round rims at eye level, standing just off the face"""
    fx = max((q.x for q, gname_ in VPTS if gname_ == 'Head' and abs(q.z - (ZB - 0.16)) < 0.06), default=0.5)
    V_, F_ = [], []
    for side in (-1, 1):
        c = Vector((fx + 0.02, C0[1] + side * 0.1, ZB - 0.16))
        v, f = tube(c, c + Vector((0.02, 0, 0)), [(0, 0.075), (1, 0.075)], n=12)
        v2, f2 = tube(c, c + Vector((0.02, 0, 0)), [(0, 0.055), (1, 0.055)], n=12)
        m = len(V_)
        V_ += v + v2
        F_ += [tuple(i + m for i in q) for q in f] + [tuple(i + m + len(v) for i in q) for q in f2]
    return V_, F_


COSTUMES['businessman'] = dict(coat='#2b2824', skin='#d9b38f', hair='#8a8378', legs='#4a4540', shoes='#1d1b18',
                               parts=[('tails', 'Hips', lambda: tails(1.32, 0.8), '#2b2824'),
                                      ('vest', 'Spine1', lambda: band(ZC - 0.3, 0.5, off=0.05), '#77736b'),
                                      ('collar', 'Spine2', lambda: collar(0.18), '#efe9dc')])
COSTUMES['minister'] = dict(coat='#1c1a1d', skin='#e3c4a2', hair='#5b4330', legs='#1c1a1d', shoes='#111111',
                            parts=[('tails', 'Hips', lambda: tails(1.05, 0.84), '#1c1a1d'),
                                   ('collar', 'Spine2', lambda: collar(0.12, 0.03), '#f4efe6')])
COSTUMES['lecturer'] = dict(coat='#6b5034', skin='#d9b38f', hair='#6e5a45', legs='#5a4535', shoes='#2a2622',
                            parts=[('tails', 'Hips', lambda: tails(1.85, 0.72), '#6b5034'),
                                   ('collar', 'Spine2', lambda: collar(0.16), '#efe9dc'),
                                   ('specs', 'Head', spectacles, '#2a2622')])
COSTUMES['captain'] = COSTUMES['officer']


ORDER_ARMS = {'LeftArm': (84, 0, 5), 'LeftForeArm': (0, 0, 4), 'RightArm': (82, 0, -4), 'RightForeArm': (0, 0, -24),
              'RightHandIndex1': (70, 0, 0), 'RightHandIndex2': (75, 0, 0), 'RightHandIndex3': (60, 0, 0),   # the fingers closed in a fist
              'RightHandThumb2': (30, 0, 0)}


def order_arms(name, arm, frame=0):
    """a rifle standing on its butt beside the right foot, the barrel in the right hand (placed in the world, at frame)"""
    sc.frame_set(frame)
    bpy.context.view_layer.update()
    # the middle of the closed fist: the centre of the posed hand's own vertices
    body = [o for o in arm.children if o.type == 'MESH' and o.data.vertices and len(o.vertex_groups) > 10][0]
    ev = body.evaluated_get(bpy.context.evaluated_depsgraph_get()).data
    gn = {g.index: g.name for g in body.vertex_groups}
    ids = [v.index for v in body.data.vertices if v.groups and gn[max(v.groups, key=lambda g: g.weight).group].startswith('RightHand')]
    h = body.matrix_world @ (sum((ev.vertices[i].co for i in ids), Vector()) / len(ids))
    gz = arm.parent.matrix_world.translation.z
    x, y = h.x, h.y
    G['cyl'](name + '_stock', (x, y, gz + 0.01), (x, y, gz + 0.62), 0.042, 0.032, '#5a4532', n=6)
    G['cyl'](name + '_butt', (x, y, gz + 0.01), (x, y, gz + 0.2), 0.05, 0.046, '#5a4532', n=6)
    G['cyl'](name + '_fore', (x, y, gz + 0.6), (x, y, max(gz + 1.0, h.z + 0.12)), 0.026, 0.022, '#5a4532', n=6)    # the wooden fore-end he grips
    G['cyl'](name + '_barrel', (x, y, gz + 0.9), (x, y, gz + 1.32), 0.015, 0.013, '#2b2622', n=6)
    return h


FOOT = 0.212                                               # raw units per action frame while a foot is planted (measured)
RATE = 17.0                                                # action frames per second: a calm walk
V = FOOT * RATE * K                                        # metres per second

class LibDone(Exception):
    pass


if MODE == 'lib':
    raise LibDone()
ORDER = ['gentleman', 'holoku', 'missionary', 'sailor', 'officer', 'worker']
cam = sc.camera
tgt = bpy.data.objects['target']
for ob in (cam, tgt):
    ob.animation_data_clear()

if MODE in ('lineup', 'back', 'close'):
    HD = 0 if MODE == 'back' else 180
    PEOPLE = [person(f'p{i}', c, (-5.0 + i * 2.0, -10.0, 0.0), HD) for i, c in enumerate(ORDER)]   # caught mid-stride
    for i, (root, arm) in enumerate(PEOPLE):
        bake(arm, WALK, [0.0], RATE, phase=3.0 + i * 4.0)
    cam.location, tgt.location = (1.2, -24.5, 1.7), (0.0, -10.0, 1.05)
    cam.data.lens = 45
    if MODE == 'close':                                     # heads and shoulders, for checking hats and collars
        CX = float(os.environ.get('CLOSE_X', '0'))
        cam.location, tgt.location = (CX, -15.5, 1.75), (CX, -10.0, 1.6)
        cam.data.lens = 46
        sc.render.resolution_y = 540
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
