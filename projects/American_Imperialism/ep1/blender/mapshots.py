# The 3D map shots and their joins, in the continuous-terrain look of terrain3d.py (smooth-shaded vertex-coloured relief,
# coral land, slate-teal sea floor under a translucent teal water block, cut like a museum model on the dark desk), keyed
# to the narration words. Every camera move is smooth at 30 fps; rises and pin drops step at 12 fps.
#   dive      join 11, ch 5 end into ch 6: the flat island card (the ch 5 test's last frame, tools/maps3d_prep.py) tilts
#             back, Oʻahu rises out of it stepped, the card opens on the sea, the camera dives to Honolulu harbor and
#             ends on the harbor set's H1 heading (harbor.py), the sky turning to H1's
#   pacific   join 8 (first half), ch 4 "Now look at the Pacific": the pitch-room wall map (blender/assets/pitch_map.png)
#             at the H8 framing becomes the Pacific relief (tools/pacific_bake.py), which rises and pushes in on Hawaiʻi
#   oahu8     join 8 (second half): out of the haze above the Oʻahu relief, the push to Pearl Harbor, the lochs catching
#             the light; holds on "It belonged to a queen"
#   pearl     joins 14 + 15, ch 6 "Pearl Harbor" (1887): out of bone haze above Oʻahu, the orange pin drops on Pearl
#             Harbor, then the camera pushes into the tablet until flat orange fills the frame at "King Kalākaua" - 0.2 s
#   quiet     join 23, ch 9 "Pearl Harbor": the same relief and pin in later, quieter light; top-down on the desk, then a
#             slow tip into a low three-quarter view; the pin settles softly on "Pearl Harbor"
# The haze and the cuts are put together by tools/maps3d_cut.py.
#   xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python mapshots.py -- <out_dir> [scale%] <mode>
#   env FRAMES="a:b:step" or "f1,f2,..." (default: every frame of the shot), SAMPLES (default 16), MESH=lo|hi
#   Each frame is written as <out_dir>/NNNN.png (frame 0 = the shot's first frame; times in shot_times.json).
import bpy, bmesh, json, math, os, sys
from array import array

HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.abspath(os.path.join(HERE, '..'))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/mapshots'
SCALE = int(argv[1]) if len(argv) > 1 else 50
MODE = argv[2] if len(argv) > 2 else 'quiet'
SAMPLES = int(os.environ.get('SAMPLES', 16))
FPS = 30
GEO = os.path.join(EP, 'assets', 'geo')
BUILD = os.path.join(EP, 'build', 'maps3d')


# ---------------------------------------------------------------- narration time and easing
_WS = {}


def wt(stem, phrase, end=False):
    """start (or end) time of a phrase in a narration chapter"""
    if stem not in _WS:
        _WS[stem] = json.load(open(os.path.join(EP, 'public', 'audio', stem + '.words.json')))['words']
    ws = _WS[stem]
    nm = lambda w: ''.join(ch for ch in w.lower() if ch.isalnum() or ch in "'ʻ")
    p = [nm(x) for x in phrase.split()]
    for i in range(len(ws) - len(p) + 1):
        if [nm(w['w']) for w in ws[i:i + len(p)]] == p:
            return ws[i + len(p) - 1]['e'] if end else ws[i]['s']
    raise KeyError(phrase)


def clamp(x, a=0.0, b=1.0):
    return a if x < a else b if x > b else x


def ease(x):
    x = clamp(x)
    return x * x * (3 - 2 * x)


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_in(x):
    x = clamp(x)
    return x ** 3


def step12(t):
    return math.floor(t * 12 + 1e-4) / 12


def mix(a, b, u):
    if isinstance(a, (tuple, list)):
        return tuple(x + (y - x) * u for x, y in zip(a, b))
    return a + (b - a) * u


def logmix(a, b, u):
    return a * (b / a) ** u


def keyed(t, keys, f=ease):
    """keys: [(time, value)], eased between neighbours (values: numbers or tuples); 'log' in a tuple key's 3rd slot
    interpolates that segment logarithmically"""
    if t <= keys[0][0]:
        return keys[0][1]
    for (t0, v0, *o0), (t1, v1, *o1) in zip(keys, keys[1:]):
        if t <= t1:
            u = f((t - t0) / (t1 - t0))
            if o1 and o1[0] == 'log':
                return logmix(v0, v1, u)
            return mix(v0, v1, u)
    return keys[-1][1]


def lin(hx):
    hx = hx.lstrip('#')
    c = [int(hx[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c]


def rgba(hx):
    return tuple(lin(hx)) + (1.0,)


# ---------------------------------------------------------------- scene
for ob in list(bpy.data.objects):
    bpy.data.objects.remove(ob, do_unlink=True)
sc = bpy.context.scene


def link(ob):
    sc.collection.objects.link(ob)
    return ob


def load(path, code):
    a_ = array(code)
    with open(path, 'rb') as fh:
        a_.frombytes(fh.read())
    return a_


SPEC = 'Specular IOR Level' if bpy.app.version >= (4, 0, 0) else 'Specular'


def mat(name, hx, rough=0.9, alpha=1.0, spec=0.5):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bs = m.node_tree.nodes['Principled BSDF']
    bs.inputs['Base Color'].default_value = rgba(hx)
    bs.inputs['Roughness'].default_value = rough
    bs.inputs[SPEC].default_value = spec
    if alpha < 1:
        bs.inputs['Alpha'].default_value = alpha
        m.blend_method, m.shadow_method, m.show_transparent_back = 'BLEND', 'NONE', False
    return m


def flat_mat(name, hx=None, image=None, alpha=False):
    """shadeless: an exact colour or image on screen (Standard view transform), optionally fading (alpha socket)"""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.remove(nt.nodes['Principled BSDF'])
    em = nt.nodes.new('ShaderNodeEmission')
    if image:
        tx = nt.nodes.new('ShaderNodeTexImage')
        tx.image = bpy.data.images.load(image)
        tx.interpolation = 'Cubic'
        nt.links.new(tx.outputs['Color'], em.inputs['Color'])
    else:
        em.inputs['Color'].default_value = rgba(hx)
    out = nt.nodes['Material Output']
    if alpha:
        tr = nt.nodes.new('ShaderNodeBsdfTransparent')
        ms = nt.nodes.new('ShaderNodeMixShader')
        ms.inputs['Fac'].default_value = 1.0
        nt.links.new(tr.outputs[0], ms.inputs[1])
        nt.links.new(em.outputs[0], ms.inputs[2])
        nt.links.new(ms.outputs[0], out.inputs['Surface'])
        m.blend_method, m.shadow_method, m.show_transparent_back = 'BLEND', 'NONE', True
        m['fade'] = ms.name
    else:
        nt.links.new(em.outputs[0], out.inputs['Surface'])
        m.shadow_method = 'NONE'
    return m


def fade_socket(m):
    return m.node_tree.nodes[m['fade']].inputs['Fac']


class Terrain:
    """a baked relief (tools/terrain_bake.py or tools/pacific_bake.py) with its water block, base and the desk"""

    def __init__(self, stem, flat=None, water_hx='#4f8f8a', water_alpha=0.42, desk=True):
        M = json.load(open(stem + '_mesh.json'))
        self.M, self.WU, self.HU, self.BASE = M, M['wu'], M['hu'], M['base']
        self.B = M['bounds']
        self.w, self.h = M['w'], M['h']
        verts, quads, cols = load(stem + '_verts.f32', 'f'), load(stem + '_quads.i32', 'i'), load(stem + '_cols.f32', 'f')
        self.verts = verts
        nv, nq = len(verts) // 3, len(quads) // 4
        me = bpy.data.meshes.new('terrain')
        me.vertices.add(nv)
        me.vertices.foreach_set('co', verts)
        me.loops.add(len(quads))
        me.loops.foreach_set('vertex_index', quads)
        me.polygons.add(nq)
        me.polygons.foreach_set('loop_start', array('i', range(0, len(quads), 4)))
        me.polygons.foreach_set('loop_total', array('i', [4]) * nq)
        me.update(calc_edges=True)
        me.polygons.foreach_set('use_smooth', [True] * nq)
        ca = me.color_attributes.new('col', 'FLOAT_COLOR', 'POINT')
        ca.data.foreach_set('color', cols)
        # material: vertex colour, muted toward bone and desaturated for the quiet light, mixed with a flat (shadeless)
        # look for the rise out of a flat map
        tm = bpy.data.materials.new('terrain')
        tm.use_nodes = True
        nt = tm.node_tree
        bs = nt.nodes['Principled BSDF']
        bs.inputs['Roughness'].default_value = 0.88
        bs.inputs[SPEC].default_value = 0.3
        vc = nt.nodes.new('ShaderNodeVertexColor')
        vc.layer_name = 'col'
        bone = nt.nodes.new('ShaderNodeMixRGB')
        bone.inputs['Fac'].default_value = 0.0
        bone.inputs['Color2'].default_value = rgba('#EDE7DC')
        nt.links.new(vc.outputs['Color'], bone.inputs['Color1'])
        hsv = nt.nodes.new('ShaderNodeHueSaturation')
        nt.links.new(bone.outputs['Color'], hsv.inputs['Color'])
        nt.links.new(hsv.outputs['Color'], bs.inputs['Base Color'])
        self.bone, self.sat = bone.inputs['Fac'], hsv.inputs['Saturation']
        self.relief = None
        if flat:
            em = nt.nodes.new('ShaderNodeEmission')
            if flat[0] == 'color':
                em.inputs['Color'].default_value = rgba(flat[1])
            else:                                         # ('image', path, (sx, sy), (ox, oy)): object coords -> image uv
                tc = nt.nodes.new('ShaderNodeTexCoord')
                mp = nt.nodes.new('ShaderNodeMapping')
                mp.inputs['Scale'].default_value = (flat[2][0], flat[2][1], 0.0)
                mp.inputs['Location'].default_value = (flat[3][0], flat[3][1], 0.0)
                nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
                tx = nt.nodes.new('ShaderNodeTexImage')
                tx.image = bpy.data.images.load(flat[1])
                tx.interpolation = 'Cubic'
                tx.extension = 'EXTEND'
                nt.links.new(mp.outputs['Vector'], tx.inputs['Vector'])
                nt.links.new(tx.outputs['Color'], em.inputs['Color'])
            ms = nt.nodes.new('ShaderNodeMixShader')
            out = nt.nodes['Material Output']
            nt.links.new(em.outputs[0], ms.inputs[1])
            nt.links.new(bs.outputs[0], ms.inputs[2])
            nt.links.new(ms.outputs[0], out.inputs['Surface'])
            self.relief = ms.inputs['Fac']
            self.relief.default_value = 1.0
        me.materials.append(tm)
        self.ob = link(bpy.data.objects.new('terrain', me))
        # base, water block, desk
        self.base = self.block('base', self.BASE - 0.05, self.BASE + 0.002, mat('base', '#1a2526'))
        self.wmat = mat('water', water_hx, rough=0.12, alpha=water_alpha, spec=0.6)
        self.water = self.block('water', self.BASE + 0.001, -0.0003, self.wmat, grow=-0.0005)
        self.desk = None
        if desk:
            bpy.ops.mesh.primitive_plane_add(size=max(400.0, 4 * self.WU), location=(0, 0, self.BASE - 0.05))
            self.desk = bpy.context.object
            self.desk.data.materials.append(mat('desk', '#16140f', 0.95))

    def block(self, name, z0, z1, m, grow=0.0):
        bpy.ops.mesh.primitive_cube_add(location=(0, 0, (z0 + z1) / 2))
        ob = bpy.context.object
        ob.name = name
        ob.scale = (self.WU / 2 + grow, self.HU / 2 + grow, (z1 - z0) / 2)
        ob.data.materials.append(m)
        return ob

    def xy(self, lon, lat):
        B = self.B
        return ((lon - (B['lon0'] + B['lon1']) / 2) / (B['lon1'] - B['lon0']) * self.WU,
                (lat - (B['lat0'] + B['lat1']) / 2) / (B['lat1'] - B['lat0']) * self.HU)

    def z_at(self, x, y, r=1):
        """the highest surface point within r grid cells of x, y (sea level where it is water)"""
        i0 = round((x / self.WU + 0.5) * (self.w - 1))
        j0 = round((0.5 - y / self.HU) * (self.h - 1))
        z = -1e9
        for j in range(j0 - r, j0 + r + 1):
            for i in range(i0 - r, i0 + r + 1):
                z = max(z, self.verts[3 * (j * self.w + i) + 2])
        return max(z, 0.0)


# ---------------------------------------------------------------- pins: a post, a tablet that turns to the camera, a soft
# contact shadow; the tablet's face is a flat fill (it reads cleanly at every scale, like the vector badges)
class Pin:
    def __init__(self, name, x, y, z, hx, shade_hx, size=1.0, height=0.42):
        self.x, self.y, self.z, self.size = x, y, z, size
        self.H = height * size
        self.root = link(bpy.data.objects.new(name, None))
        self.root.location = (x, y, z)
        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.017 * size, depth=self.H, location=(0, 0, self.H / 2))
        self.post = bpy.context.object
        self.post.data.materials.append(mat(name + '_post', '#1b1b1b', 0.5))
        self.post.parent = self.root
        for p in self.post.data.polygons:
            p.use_smooth = True
        # the tablet: a chamfered plate, origin at the middle of its bottom edge (where it sits on the post)
        w, h, c, d = 0.11 * size, 0.08 * size, 0.026 * size, 0.024 * size
        pts = [(-w + c, 0), (w - c, 0), (w, c), (w, 2 * h - c), (w - c, 2 * h), (-w + c, 2 * h), (-w, 2 * h - c), (-w, c)]
        bm = bmesh.new()
        front = bm.faces.new([bm.verts.new((px, -d / 2, pz)) for px, pz in pts])
        back = bm.faces.new([bm.verts.new((px, d / 2, pz)) for px, pz in reversed(pts)])
        n = len(pts)
        fv, bv = front.verts[:], back.verts[:]
        bvr = list(reversed(bv))
        for k in range(n):
            bm.faces.new([fv[(k + 1) % n], fv[k], bvr[k], bvr[(k + 1) % n]])
        bm.normal_update()
        for f in bm.faces:
            f.material_index = 0 if f.normal.y < -0.9 else 1
        me = bpy.data.meshes.new(name + '_tab')
        bm.to_mesh(me)
        me.materials.append(flat_mat(name + '_face', hx))
        me.materials.append(flat_mat(name + '_edge', shade_hx))
        self.tab = link(bpy.data.objects.new(name + '_tab', me))
        self.tab.parent = self.root
        self.tab.location = (0, 0, self.H)
        self.tab.rotation_mode = 'XYZ'
        # contact shadow: a soft dark disc on the ground
        sm = bpy.data.materials.new(name + '_shadow')
        sm.use_nodes = True
        nt = sm.node_tree
        nt.nodes.remove(nt.nodes['Principled BSDF'])
        tc = nt.nodes.new('ShaderNodeTexCoord')
        ln = nt.nodes.new('ShaderNodeVectorMath')
        ln.operation = 'LENGTH'
        nt.links.new(tc.outputs['Object'], ln.inputs[0])
        mr = nt.nodes.new('ShaderNodeMapRange')
        mr.inputs['From Min'].default_value, mr.inputs['From Max'].default_value = 0.0, 1.0
        mr.inputs['To Min'].default_value, mr.inputs['To Max'].default_value = 1.0, 0.0
        nt.links.new(ln.outputs['Value'], mr.inputs['Value'])
        pw = nt.nodes.new('ShaderNodeMath')
        pw.operation = 'POWER'
        pw.inputs[1].default_value = 2.2
        nt.links.new(mr.outputs['Result'], pw.inputs[0])
        k = nt.nodes.new('ShaderNodeMath')
        k.operation = 'MULTIPLY'
        k.inputs[1].default_value = 0.6
        nt.links.new(pw.outputs[0], k.inputs[0])
        tr = nt.nodes.new('ShaderNodeBsdfTransparent')
        em = nt.nodes.new('ShaderNodeEmission')
        em.inputs['Color'].default_value = (0, 0, 0, 1)
        ms = nt.nodes.new('ShaderNodeMixShader')
        nt.links.new(k.outputs[0], ms.inputs['Fac'])
        nt.links.new(tr.outputs[0], ms.inputs[1])
        nt.links.new(em.outputs[0], ms.inputs[2])
        nt.links.new(ms.outputs[0], nt.nodes['Material Output'].inputs['Surface'])
        sm.blend_method, sm.shadow_method, sm.show_transparent_back = 'BLEND', 'NONE', True
        self.shadow_k = k.inputs[1]
        bpy.ops.mesh.primitive_circle_add(vertices=32, radius=1.0, fill_type='TRIFAN', location=(x, y, z + 0.0012))
        self.shadow = bpy.context.object
        self.shadow.data.materials.append(sm)
        self.R = 0.075 * size
        self.shadow.scale = (self.R, self.R, 1)

    def top(self):
        return (self.x, self.y, self.z + self.H + 0.08 * self.size)

    def set(self, cam, drop=1.0, squash=1.0, tilt_k=0.55, vis=True):
        """drop: 0 = high above (hidden), 1 = landed; squash: the post's settle; tilt_k: how far the tablet tips up
        toward the camera (0 upright, 1 square to the camera)"""
        for ob in (self.root, self.post, self.tab, self.shadow):
            ob.hide_render = not vis or drop <= 0.0
        lift = (1 - drop) * self.H * 2.2
        self.root.location = (self.x, self.y, self.z + lift)
        self.root.scale = (1, 1, squash)
        land = clamp(1 - lift / (self.H * 1.2))
        self.shadow_k.default_value = 0.6 * land
        self.shadow.scale = (self.R * (1.6 - 0.6 * land), self.R * (1.6 - 0.6 * land), 1)
        tx, ty, tz = self.x, self.y, self.z + lift + self.H * squash
        dx, dy, dz = cam[0] - tx, cam[1] - ty, cam[2] - tz
        hd = math.hypot(dx, dy) + 1e-9
        el = math.atan2(dz, hd)
        self.tab.rotation_euler = (-tilt_k * el, 0.0, math.atan2(dx, -dy))
        self.tab.scale = (1, 1, 1 / max(squash, 1e-3))


# ---------------------------------------------------------------- light, world, render, camera
def lights(sun_rot=(60, -115), sun_e=3.4, sun_col=(1.0, 0.93, 0.82), fill_e=0.45):
    sun = bpy.data.lights.new('sun', 'SUN')
    sun.energy, sun.color, sun.angle = sun_e, sun_col, math.radians(2.0)
    sun.use_contact_shadow = True
    sun.contact_shadow_distance, sun.contact_shadow_thickness = 0.05, 0.02
    so = link(bpy.data.objects.new('sun', sun))
    so.rotation_euler = (math.radians(sun_rot[0]), 0, math.radians(sun_rot[1]))
    fl = bpy.data.lights.new('fill', 'SUN')
    fl.energy, fl.color, fl.use_shadow = fill_e, (0.75, 0.88, 0.9), False
    fo = link(bpy.data.objects.new('fill', fl))
    fo.rotation_euler = (math.radians(40), 0, math.radians(70))
    return so, fo


class Glint:
    """a specular-only area light kept at the mirror point of the camera over the water, so a patch of water
    (the lochs) catches the light"""

    def __init__(self, energy=0.0, size=1.0, col=(1.0, 0.95, 0.85)):
        g = bpy.data.lights.new('glint', 'AREA')
        g.shape, g.size, g.energy, g.color = 'DISK', size, energy, col
        g.diffuse_factor, g.specular_factor, g.volume_factor = 0.0, 1.0, 0.0
        g.use_shadow = False
        self.l = g
        self.ob = link(bpy.data.objects.new('glint', g))

    def set(self, cam, at, dist, energy, size=None):
        from mathutils import Vector
        c, a = Vector(cam), Vector(at)
        mirror = Vector((c.x, c.y, -c.z))
        r = (a - mirror).normalized()
        p = a + r * dist
        self.ob.location = p
        self.ob.rotation_euler = (a - p).to_track_quat('-Z', 'Y').to_euler()
        self.l.energy = energy
        if size:
            self.l.size = size


def world(desk_hx='#16140f', strength=0.7):
    sc.world = sc.world or bpy.data.worlds.new('w')
    sc.world.use_nodes = True
    nt = sc.world.node_tree
    bg = nt.nodes['Background']
    bg.inputs['Color'].default_value = rgba(desk_hx)
    bg.inputs['Strength'].default_value = strength
    cam_bg = nt.nodes.new('ShaderNodeBackground')                 # what the camera sees (the lighting stays the desk's)
    cam_bg.inputs['Color'].default_value = rgba(desk_hx)
    cam_bg.inputs['Strength'].default_value = strength
    lp = nt.nodes.new('ShaderNodeLightPath')
    ms = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Camera Ray'], ms.inputs['Fac'])
    nt.links.new(bg.outputs[0], ms.inputs[1])
    nt.links.new(cam_bg.outputs[0], ms.inputs[2])
    nt.links.new(ms.outputs[0], nt.nodes['World Output'].inputs['Surface'])
    return cam_bg


def render_setup():
    sc.render.engine = 'BLENDER_EEVEE'
    ee = sc.eevee
    ee.taa_render_samples = SAMPLES
    ee.use_soft_shadows = SAMPLES > 8
    ee.shadow_cube_size, ee.shadow_cascade_size = '512', '4096' if SCALE >= 100 else '2048'
    ee.use_gtao, ee.gtao_distance = True, 0.3
    ee.use_bloom = False
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1920, 1080, SCALE
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGB'


cam_d = bpy.data.cameras.new('cam')
cam = link(bpy.data.objects.new('cam', cam_d))
cam.rotation_mode = 'XYZ'
sc.camera = cam
cam_d.sensor_width = 36.0


def pose(L, D, pitch, heading, lens, near=0.004):
    """look at L from distance D, pitch degrees below the horizon (90 = straight down), heading degrees clockwise from
    north; returns the camera position"""
    p, h = math.radians(pitch), math.radians(heading)
    d = (math.sin(h) * math.cos(p), math.cos(h) * math.cos(p), -math.sin(p))
    c = (L[0] - D * d[0], L[1] - D * d[1], L[2] - D * d[2])
    cam.location = c
    cam.rotation_euler = (math.radians(90 - pitch), 0.0, -h)
    cam_d.lens = lens
    cam_d.clip_start = max(near, D * 0.004)
    return c


OAHU = os.path.join(GEO, 'oahu_terrain')
OAHU_LO = os.path.join(BUILD, 'oahu_lo')
PEARL = (-157.972, 21.355)                     # the pin (as in terrain3d.py), on the water of East Loch
LOCHS = (-157.975, 21.372)                     # where the light catches: Pearl Harbor's lochs around Ford Island
HONOLULU = (-157.8664, 21.3069)                # Aloha Tower, the harbor front


def oahu_stem():
    return OAHU if os.environ.get('MESH', 'hi') == 'hi' or not os.path.exists(OAHU_LO + '_mesh.json') else OAHU_LO


SHOT = {}


# ================================================================ join 11: the island card rises into Oʻahu, dive to H1
def build_dive():
    T = Terrain(oahu_stem(), flat=('color', '#FF6F61'), desk=False)
    T.base.hide_render = True
    B = T.B
    KLAT = math.cos(math.radians(20.8))                       # the island card's projection (tools/vec_test.py islands())
    sx = T.WU / (B['lon1'] - B['lon0']) / (138 * KLAT)       # map units per card pixel
    sy = T.HU / (B['lat1'] - B['lat0']) / 138
    lonc, latc = (B['lon0'] + B['lon1']) / 2, (B['lat0'] + B['lat1']) / 2
    pxc, pyc = 960 + (lonc + 157.53) * KLAT * 138, 600 - (latc - 20.57) * 138
    X0, X1 = (0 - pxc) * sx, (1920 - pxc) * sx                # the card frame's edges in map units
    Y1, Y0 = (pyc - 0) * sy, (pyc - 1080) * sy
    CZ = 0.0002
    edge = json.load(open(os.path.join(BUILD, 'card_info.json')))['edge']
    img_a = bpy.data.images.load(os.path.join(BUILD, 'card_A.png'))
    img_b = bpy.data.images.load(os.path.join(BUILD, 'card_B.png'))

    FADES = []

    def card_mat(name, alpha):
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        nt = m.node_tree
        nt.nodes.remove(nt.nodes['Principled BSDF'])
        ta, tb = nt.nodes.new('ShaderNodeTexImage'), nt.nodes.new('ShaderNodeTexImage')
        ta.image, tb.image = img_a, img_b
        for t_ in (ta, tb):
            t_.interpolation = 'Cubic'
            t_.extension = 'EXTEND'
        mx = nt.nodes.new('ShaderNodeMixRGB')
        nt.links.new(ta.outputs['Color'], mx.inputs['Color1'])
        nt.links.new(tb.outputs['Color'], mx.inputs['Color2'])
        fd = nt.nodes.new('ShaderNodeMixRGB')                 # the card's drawings fade into the desk as the camera dives
        fd.inputs['Fac'].default_value = 0.0
        fd.inputs['Color2'].default_value = rgba(edge)
        nt.links.new(mx.outputs['Color'], fd.inputs['Color1'])
        FADES.append(fd.inputs['Fac'])
        em = nt.nodes.new('ShaderNodeEmission')
        nt.links.new(fd.outputs['Color'], em.inputs['Color'])
        out = nt.nodes['Material Output']
        if alpha:
            tr = nt.nodes.new('ShaderNodeBsdfTransparent')
            ms = nt.nodes.new('ShaderNodeMixShader')
            ms.inputs['Fac'].default_value = 1.0
            nt.links.new(tr.outputs[0], ms.inputs[1])
            nt.links.new(em.outputs[0], ms.inputs[2])
            nt.links.new(ms.outputs[0], out.inputs['Surface'])
            m.blend_method, m.shadow_method, m.show_transparent_back = 'BLEND', 'NONE', True
            return m, mx.inputs['Fac'], ms.inputs['Fac']
        nt.links.new(em.outputs[0], out.inputs['Surface'])
        m.shadow_method = 'NONE'
        return m, mx.inputs['Fac'], None

    def quad(name, x0, y0, x1, y1, m, z=CZ):
        me = bpy.data.meshes.new(name)
        bm = bmesh.new()
        vs = [bm.verts.new((x, y, z)) for x, y in ((x0, y0), (x1, y0), (x1, y1), (x0, y1))]
        f = bm.faces.new(vs)
        uv = bm.loops.layers.uv.new('UVMap')
        for lp in f.loops:
            x, y = lp.vert.co.x, lp.vert.co.y
            lp[uv].uv = ((x - X0) / (X1 - X0), (y - Y0) / (Y1 - Y0))
        bm.to_mesh(me)
        me.materials.append(m)
        return link(bpy.data.objects.new(name, me))

    # the card, with a window over the relief's slab: four opaque strips around it and a lid that fades open
    m_card, ab_card, _ = card_mat('card', False)
    m_lid, ab_lid, a_lid = card_mat('lid', True)
    hw, hh = T.WU / 2 - 0.0005, T.HU / 2 - 0.0005
    quad('card_s', X0, Y0, X1, -hh, m_card)
    quad('card_n', X0, hh, X1, Y1, m_card)
    quad('card_w', X0, -hh, -hw, hh, m_card)
    quad('card_e', hw, -hh, X1, hh, m_card)
    quad('lid', -hw, -hh, hw, hh, m_lid)
    sur = flat_mat('surround', edge)                          # the desk beyond the card frame, its edge colour
    bpy.ops.mesh.primitive_plane_add(size=6000, location=(0, 0, T.BASE - 0.06))
    bpy.context.object.data.materials.append(sur)
    so, fo = lights()
    gl = Glint(0.0, 0.25)
    sky = world()
    render_setup()
    cam_d.clip_start, cam_d.clip_end = 0.002, 2000

    # ---- timing: the shot runs DUR seconds from the card's last frame; the rise, the window, the dive
    DUR = 5.4
    N = int(round(DUR * FPS))
    H1_SKY = '#9cb2af'                                        # harbor.py H1's sky at the top of the frame
    hx_, hy_ = T.xy(*HONOLULU)
    D0 = (X1 - X0) * 50 / 36                                  # 50 mm, the card frame exactly across the width
    L0 = ((X0 + X1) / 2, (Y0 + Y1) / 2, 0.0)
    # the end pose: low over the water south of the harbor front, heading a little west of north as H1 does
    CEND = (hx_ - 0.03, hy_ - 0.25, 0.028)                   # 2.5 km off the harbor front, 280 m up (map units)
    _d = (math.sin(math.radians(-4)), math.cos(math.radians(-4)), 0.0)
    ZEND = 1.4                                                # the relief grows toward the set's mountains as it lands
    LEND = tuple(CEND[k] + 0.5 * _d[k] for k in range(3))
    KEYS = [  # time, (look-at x, y, z), distance (log), pitch, heading, lens
        (0.00, L0, D0, 90.0, 0.0, 50.0),
        (0.35, L0, D0, 90.0, 0.0, 50.0),
        (1.60, (hx_ * 0.4 + L0[0] * 0.6, hy_ * 0.4 + L0[1] * 0.6, 0.0), 40.0, 62.0, -2.0, 45.0),
        (3.30, (hx_ - 0.1, hy_ + 0.5, 0.0), 3.2, 30.0, -4.0, 42.0),
        (DUR, LEND, 0.5, 0.0, -4.0, 40.0),
    ]

    def cam_at(t):
        for (t0, l0, d0, p0, h0, n0), (t1, l1, d1, p1, h1, n1) in zip(KEYS, KEYS[1:]):
            if t <= t1:
                u = (t - t0) / (t1 - t0)
                e = ease(u) if t0 > 0.1 else ease_in(u) * 0.5 + ease(u) * 0.5
                if t1 == KEYS[-1][0]:
                    e = ease_out(u) * 0.7 + ease(u) * 0.3
                return pose(mix(l0, l1, e), logmix(d0, d1, e), mix(p0, p1, e), mix(h0, h1, e), mix(n0, n1, e))
        return pose(LEND, 0.5, 0.0, -4.0, 40.0)

    T_AB = (0.05, 0.30)            # the card's Oʻahu becomes the true coastline (a quick dissolve, flat)
    T_RISE = (0.55, 1.75)          # Oʻahu rises out of the card, stepped
    T_WIN = (1.70, 2.20)           # the card opens on the sea around it
    T_SKY = (4.20, DUR)            # the sky turns to H1's

    def state(f):
        t = f / FPS
        ab = ease((t - T_AB[0]) / (T_AB[1] - T_AB[0]))
        ab_card.default_value = ab_lid.default_value = ab
        r = ease(step12(t - T_RISE[0]) / (T_RISE[1] - T_RISE[0])) if t >= T_RISE[0] else 0.0
        T.ob.scale = (1, 1, max(r, 1e-4) * mix(1.0, ZEND, ease((t - 3.4) / (DUR - 3.4))))
        T.ob.hide_render = r <= 0.0
        T.relief.default_value = ease((t - T_RISE[0] - 0.15) / 0.9)
        a_lid.default_value = 1 - ease((t - T_WIN[0]) / (T_WIN[1] - T_WIN[0]))
        for fs in FADES:
            fs.default_value = 0.92 * ease((t - 1.1) / 1.3)
        T.water.hide_render = t < T_WIN[0]
        u = ease((t - T_SKY[0]) / (T_SKY[1] - T_SKY[0]))
        sky.inputs['Color'].default_value = mix(rgba('#16140f'), rgba(H1_SKY), u)
        sky.inputs['Strength'].default_value = mix(0.7, 1.0, u)
        c = cam_at(t)
        gl.set(c, (hx_ - 0.05, hy_ - 0.06, 0.0), 1.2, 0.0)
        return t

    SHOT.update(N=N, state=state, t0=0.0, note='join 11: frame 0 = the ch 5 card test last frame (vec_ch05 t=18.83)')


# ================================================================ join 8: the wall map becomes the Pacific relief
def build_pacific():
    stem = os.path.join(GEO, 'pacific_terrain')
    M = json.load(open(stem + '_mesh.json'))
    KX, KY = M['kx'], M['ky']
    m0, la0, m1, la1 = M['mapbox']
    lonc, latc = M['lonc'], M['latc']
    flat = ('image', os.path.join(HERE, 'assets', 'pitch_map.png'), (1 / (KX * (m1 - m0)), 1 / (KY * (la1 - la0))),
            ((lonc - m0) / (m1 - m0), (latc - la0) / (la1 - la0)))
    T = Terrain(stem, flat=flat, water_alpha=0.42)
    # the wall map's pixels are not square in km: 90 degrees of longitude across a 16:9 frame shows 58.28 degrees of
    # latitude; the relief starts squeezed to that and relaxes to true proportions during the push
    W8 = 90 * KX
    LAT_SPAN = 90 * 9 / 16 * (3000 / (m1 - m0)) / (1500 / (la1 - la0))
    K0 = W8 * 9 / 16 / (LAT_SPAN * KY)
    for ob in (T.ob, T.water, T.base):
        ob.parent = None
    root = link(bpy.data.objects.new('root', None))
    for ob in (T.ob, T.water, T.base):
        ob.parent = root
    so, fo = lights(sun_rot=(58, -120), sun_e=3.6)
    sky = world()
    render_setup()
    cam_d.clip_start, cam_d.clip_end = 0.5, 8000
    ee = sc.eevee
    ee.shadow_cascade_max_distance = 3000
    ee.gtao_distance = 6.0
    T0 = wt('ch04_the_pitch_meeting', 'look at the Pacific', end=True) - 0.1    # H8 is reached: start
    T_ENOR = wt('ch04_the_pitch_meeting', "It's enormous")
    T_MID = wt('ch04_the_pitch_meeting', 'right in the middle')
    T_SAT = wt('ch04_the_pitch_meeting', 'sat one of')
    END = T_SAT + 0.75                                                           # into the haze by now
    N = int(round((END - T0) * FPS))
    D0 = W8 * 50 / 36
    ox, oy = (202.03 - lonc) * KX, (21.45 - latc) * KY                          # Oʻahu
    WATER_A = 0.42

    def state(f):
        t = T0 + f / FPS
        r = ease(step12(t - (T_ENOR - 0.35)) / 1.1) if t >= T_ENOR - 0.35 else 0.0
        T.ob.scale = (1, 1, max(r, 1e-4))
        T.relief.default_value = r
        T.wmat.node_tree.nodes['Principled BSDF'].inputs['Alpha'].default_value = WATER_A * r
        T.water.hide_render = r <= 0.0
        k = keyed(t, [(T_ENOR - 0.2, K0), (T_MID + 0.6, 1.0)])
        root.scale = (1, k, 1)
        L = keyed(t, [(T0, (0.0, 0.0, 0.0)), (T_ENOR + 0.2, (0.0, 0.0, 0.0)), (END, (ox, oy * k, 0.0))])
        D = keyed(t, [(T0, D0), (T_ENOR + 0.2, D0, 'log'), (T_MID, D0 * 0.42, 'log'), (END, 34.0, 'log')])
        p = keyed(t, [(T0, 90.0), (T_ENOR + 0.2, 90.0), (T_MID + 0.3, 58.0), (END, 52.0)])
        hd = keyed(t, [(T0, 0.0), (T_ENOR + 0.2, 0.0), (END, -8.0)])
        pose(L, D, p, hd, 50.0)
        return t

    SHOT.update(N=N, state=state, t0=T0, note='join 8 part 1, ch 4 time')


def build_oahu8():
    T = Terrain(oahu_stem())
    so, fo = lights()
    gl = Glint(0.0, 0.6)
    world()
    render_setup()
    cam_d.clip_start, cam_d.clip_end = 0.005, 400
    T_SAT = wt('ch04_the_pitch_meeting', 'sat one of')
    T_HARB = wt('ch04_the_pitch_meeting', 'best harbors')
    T_Q = wt('ch04_the_pitch_meeting', 'It belonged')
    T0 = T_SAT + 0.25                                  # out of the haze from here (the cut overlaps the two)
    END = wt('ch04_the_pitch_meeting', 'a queen', end=True) + 0.45
    N = int(round((END - T0) * FPS))
    px, py = T.xy(*LOCHS)

    def state(f):
        t = T0 + f / FPS
        L = keyed(t, [(T0, (0.0, 0.1, 0.0)), (T_HARB + 0.4, (px + 0.25, py - 0.05, 0.0)), (END, (px + 0.12, py - 0.02, 0.0))],
                  f=ease_out)
        D = keyed(t, [(T0, 16.0), (T_HARB + 0.4, 3.4, 'log'), (END, 2.7, 'log')], f=ease_out)
        p = keyed(t, [(T0, 58.0), (T_HARB + 0.4, 34.0), (END, 30.0)], f=ease_out)
        hd = keyed(t, [(T0, -8.0), (T_HARB + 0.4, -18.0), (END, -26.0)], f=ease_out)
        c = pose(L, D, p, hd, 40.0)
        gl.set(c, (px, py, 0.0), 3.0, keyed(t, [(T_HARB - 0.5, 0.0), (T_HARB + 0.3, 900.0), (END, 1000.0)]), 0.9)
        return t

    SHOT.update(N=N, state=state, t0=T0, note='join 8 part 2, ch 4 time')


# ================================================================ joins 14 + 15: out of the haze, the pin drops, into the tablet
def build_pearl():
    T = Terrain(oahu_stem())
    so, fo = lights()
    gl = Glint(0.0, 0.6)
    world()
    render_setup()
    cam_d.clip_start, cam_d.clip_end = 0.003, 400
    ST = 'ch06_the_heist'
    T_PEARL = wt(ST, 'Pearl Harbor')
    T_KING = wt(ST, 'King Kalākaua')
    T0 = float(os.environ.get('T14', wt(ST, 'the right to use') - 0.25))
    END = T_KING - 0.2
    N = int(round((END - T0) * FPS)) + 1
    x, y = T.xy(*PEARL)
    pin = Pin('pin_pearl', x, y, T.z_at(x, y), '#FF9F1C', '#c97a10', size=1.5)
    lx, ly = T.xy(*LOCHS)
    T_DROP = T_PEARL - 0.12                            # lands on the word
    T_PUSH = T_KING - 2.15
    tx, ty, tz = pin.top()

    def state(f):
        t = T0 + f / FPS
        # descend out of the haze into the three-quarter view
        L1 = (x + 0.5, y + 0.35, 0.0)
        Lb = keyed(t, [(T0, (0.3, 0.2, 0.0)), (T0 + 1.7, L1), (T_PUSH, (x + 0.35, y + 0.25, 0.0))], f=ease_out)
        Db = keyed(t, [(T0, 13.0), (T0 + 1.7, 6.6, 'log'), (T_PUSH, 6.0, 'log')], f=ease_out)
        pb = keyed(t, [(T0, 64.0), (T0 + 1.7, 44.0), (T_PUSH, 42.0)], f=ease_out)
        hb = keyed(t, [(T0, 10.0), (T0 + 1.7, 18.0), (T_PUSH, 20.0)], f=ease_out)
        if t < T_PUSH:
            c = pose(Lb, Db, pb, hb, 38.0)
            tilt = 0.55
        else:
            # into the tablet: the look-at slides to the tablet's face, the distance shrinks to nothing, the tablet
            # turns square to the lens
            u = clamp((t - T_PUSH) / (END - T_PUSH))
            e = ease_in(u) * 0.55 + ease(u) * 0.45
            ctr = (tx, ty, tz)
            L = mix(Lb, ctr, ease(min(1.0, u * 1.6)))
            D = logmix(Db, 0.035 * pin.size, e)
            pch = mix(pb, 16.0, ease(u))
            c = pose(L, D, pch, mix(hb, 14.0, ease(u)), mix(38.0, 30.0, ease(u)))
            tilt = mix(0.55, 1.0, ease(min(1.0, u * 1.4)))
        # the pin: falls in 12 fps steps, lands on the word, a small settle
        if t < T_DROP - 0.34:
            pin.set(c, drop=0.0)
        else:
            ts = step12(t - (T_DROP - 0.34))
            drop = clamp(ts / 0.34) ** 2
            sq = 1.0
            if ts > 0.34:
                k_ = ts - 0.34
                sq = 1 - 0.12 * math.exp(-k_ * 9) * math.cos(k_ * 28)
            pin.set(c, drop=drop, squash=sq, tilt_k=tilt)
        gl.set(c, (lx, ly, 0.0), 3.0, keyed(t, [(T0 + 1.0, 0.0), (T_PEARL, 900.0), (T_PUSH, 900.0), (END, 0.0)]), 0.9)
        return t

    SHOT.update(N=N, state=state, t0=T0, note='joins 14+15, ch 6 time; the last frame is flat #FF9F1C')


# ================================================================ join 23: the quiet return
def build_quiet():
    T = Terrain(oahu_stem(), water_hx='#6b8784', water_alpha=0.40)
    T.bone.default_value = 0.42
    T.sat.default_value = 0.62
    T.desk.data.materials[0].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = rgba('#15130f')
    so, fo = lights(sun_rot=(71, -78), sun_e=3.1, sun_col=(1.0, 0.80, 0.60), fill_e=0.35)
    gl = Glint(0.0, 0.8, col=(1.0, 0.82, 0.62))
    world('#15130f', 0.6)
    render_setup()
    cam_d.clip_start, cam_d.clip_end = 0.005, 400
    ST = 'ch09_back_to_the_question'
    T0 = wt(ST, 'The harbor the Admiral') - 0.15
    T_PEARL = wt(ST, 'Pearl Harbor')
    END = float(os.environ.get('T23_END', wt(ST, 'In 1993') - 0.1))
    N = int(round((END - T0) * FPS))
    x, y = T.xy(*PEARL)
    pin = Pin('pin_pearl', x, y, T.z_at(x, y), '#FF9F1C', '#c97a10', size=1.25)
    lx, ly = T.xy(*LOCHS)
    T_TIP = (T0 + 1.3, T_PEARL - 0.9)
    T_DROP = T_PEARL - 0.1

    def state(f):
        t = T0 + f / FPS
        u = ease((t - T_TIP[0]) / (T_TIP[1] - T_TIP[0]))
        v = clamp((t - T_TIP[1]) / (END - T_TIP[1]))
        L = mix((0.0, 0.0, 0.0), (x + 0.45, y + 0.3, 0.0), u)
        L = mix(L, (x + 0.3, y + 0.22, 0.0), v)
        D = logmix(14.0, 4.6, u) * (1 - 0.1 * v)
        p = mix(90.0, 24.0, u) - 2.0 * v
        hd = mix(0.0, 28.0, u) + 7.0 * v
        c = pose(L, D, p, hd, mix(42.0, 40.0, u))
        if t < T_DROP - 0.5:
            pin.set(c, drop=0.0)
        else:
            ts = step12(t - (T_DROP - 0.5))
            pin.set(c, drop=ease_out(ts / 0.5), tilt_k=0.5)
        gl.set(c, (lx, ly, 0.0), 3.0, keyed(t, [(T_TIP[0] + 2.0, 0.0), (T_PEARL, 700.0), (END, 800.0)]), 1.0)
        return t

    SHOT.update(N=N, state=state, t0=T0, note='join 23, ch 9 time; frame 0 = 23_pearl_start.png')


{'dive': build_dive, 'pacific': build_pacific, 'oahu8': build_oahu8, 'pearl': build_pearl, 'quiet': build_quiet}[MODE]()

# ---------------------------------------------------------------- render
os.makedirs(OUT, exist_ok=True)
N = SHOT['N']
spec = os.environ.get('FRAMES', '')
if ':' in spec:
    a_, b_, s_ = (spec.split(':') + ['1'])[:3]
    FR = list(range(int(a_), min(int(b_), N), int(s_)))
elif spec:
    FR = [int(v) for v in spec.split(',')]
else:
    FR = list(range(N))
json.dump(dict(mode=MODE, n=N, fps=FPS, t0=SHOT['t0'], note=SHOT['note']), open(os.path.join(OUT, 'shot.json'), 'w'))
import time
for f in FR:
    path = os.path.join(OUT, f'{f:04d}.png')
    if os.path.exists(path) and os.path.getsize(path) > 0:       # resumable: a restart costs only the frame in progress
        continue
    SHOT['state'](f)
    sc.render.filepath = path
    t_ = time.time()
    bpy.ops.render.render(write_still=True)
    print('FRAME', f, round(time.time() - t_, 2), flush=True)
