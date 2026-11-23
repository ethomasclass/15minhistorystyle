# The 3D maps as continuous terrain: one smooth-shaded surface from real elevation and sea-floor data (tools/terrain_bake.py),
# land coloured in the explainer palette (coral, Hawaiʻi is the subject), the sea floor in slate teal under a clear teal
# water block, cut away at the edges like a museum relief model on the dark desk. Pins are teal tablets on posts.
#   python3 tools/terrain_bake.py assets/geo/oahu_hm.json assets/geo/oahu_water.json assets/geo/oahu_terrain.npz 2 1.2
#   xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python terrain3d.py -- <out_dir> [scale%] [mode]
#   mode: top, tilt, near (stills), several comma-separated
import bpy, bmesh, json, math, os, sys
from array import array

HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/terrain3d'
SCALE = int(argv[1]) if len(argv) > 1 else 50
MODES = (argv[2] if len(argv) > 2 else 'tilt').split(',')
STEM = os.environ.get('TERRAIN', os.path.join(EP, 'assets', 'geo', 'oahu_terrain'))
M = json.load(open(STEM + '_mesh.json'))
B, WU, HU, BASE = M['bounds'], M['wu'], M['hu'], M['base']


def load(path, code):
    a_ = array(code)
    with open(path, 'rb') as fh:
        a_.frombytes(fh.read())
    return a_


for ob in list(bpy.data.objects):
    bpy.data.objects.remove(ob, do_unlink=True)
sc = bpy.context.scene


def lin(hx):
    hx = hx.lstrip('#')
    c = [int(hx[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c]


def mat(name, hx, rough=0.9, alpha=1.0, emit=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bs = m.node_tree.nodes['Principled BSDF']
    bs.inputs['Base Color'].default_value = tuple(lin(hx)) + (1,)
    bs.inputs['Roughness'].default_value = rough
    if alpha < 1:
        bs.inputs['Alpha'].default_value = alpha
        m.blend_method, m.shadow_method, m.show_transparent_back = 'BLEND', 'NONE', False
    if emit:
        bs.inputs['Emission Color' if 'Emission Color' in bs.inputs else 'Emission'].default_value = tuple(lin(hx)) + (1,)
        bs.inputs['Emission Strength'].default_value = emit
    return m


# ---- the terrain surface (built by tools/terrain_bake.py)
verts, quads, cols = load(STEM + '_verts.f32', 'f'), load(STEM + '_quads.i32', 'i'), load(STEM + '_cols.f32', 'f')
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
tm = bpy.data.materials.new('terrain')
tm.use_nodes = True
nt = tm.node_tree
bs = nt.nodes['Principled BSDF']
at = nt.nodes.new('ShaderNodeVertexColor')
at.layer_name = 'col'
nt.links.new(at.outputs['Color'], bs.inputs['Base Color'])
bs.inputs['Roughness'].default_value = 0.88
me.materials.append(tm)
terrain = bpy.data.objects.new('terrain', me)
sc.collection.objects.link(terrain)

# ---- the base under it, the water block over the sea floor, the desk
def block(name, z0, z1, m, grow=0.0):
    bpy.ops.mesh.primitive_cube_add(location=(0, 0, (z0 + z1) / 2))
    ob = bpy.context.object
    ob.name = name
    ob.scale = (WU / 2 + grow, HU / 2 + grow, (z1 - z0) / 2)
    ob.data.materials.append(m)
    return ob


block('base', BASE - 0.05, BASE + 0.002, mat('base', '#1a2526'))
block('water', BASE + 0.001, 0.0, mat('water', '#4f8f8a', rough=0.12, alpha=0.42), grow=-0.0005)
bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 0, BASE - 0.05))
bpy.context.object.data.materials.append(mat('desk', '#16140f', 0.95))


# ---- pins
def lonlat(lon, lat):
    return ((lon - (B['lon0'] + B['lon1']) / 2) / (B['lon1'] - B['lon0']) * WU,
            (lat - (B['lat0'] + B['lat1']) / 2) / (B['lat1'] - B['lat0']) * HU)


def pin(name, lon, lat, hx, hgt):
    x, y = lonlat(lon, lat)
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.012, depth=hgt, location=(x, y, hgt / 2))
    bpy.context.object.data.materials.append(mat(name + 'post', '#111111'))
    bm = bmesh.new()
    w, h, c, d = 0.11, 0.08, 0.03, 0.02
    pts = [(-w + c, -h), (w - c, -h), (w, -h + c), (w, h - c), (w - c, h), (-w + c, h), (-w, h - c), (-w, -h + c)]
    f = bm.faces.new([bm.verts.new((px, 0, py)) for px, py in pts])
    bmesh.ops.extrude_face_region(bm, geom=[f])
    for v in bm.verts[len(pts):]:
        v.co.y -= d
    m_ = bpy.data.meshes.new(name)
    bm.to_mesh(m_)
    ob = bpy.data.objects.new(name, m_)
    sc.collection.objects.link(ob)
    ob.location = (x, y + d / 2, hgt + h)
    m_.materials.append(mat(name, hx, 0.6, emit=0.35))


pin('pin_honolulu', -157.862, 21.302, '#2FE0C4', 0.55)
pin('pin_pearl', -157.972, 21.355, '#FF9F1C', 0.42)

# ---- light, render, camera
sun = bpy.data.lights.new('sun', 'SUN')
sun.energy, sun.color, sun.angle = 3.4, (1.0, 0.93, 0.82), math.radians(2.0)
so = bpy.data.objects.new('sun', sun)
sc.collection.objects.link(so)
so.rotation_euler = (math.radians(60), 0, math.radians(-115))
fl = bpy.data.lights.new('fill', 'SUN')
fl.energy, fl.color, fl.use_shadow = 0.45, (0.75, 0.88, 0.9), False
fo = bpy.data.objects.new('fill', fl)
sc.collection.objects.link(fo)
fo.rotation_euler = (math.radians(40), 0, math.radians(70))
sc.world = sc.world or bpy.data.worlds.new('w')
sc.world.use_nodes = True
sc.world.node_tree.nodes['Background'].inputs['Color'].default_value = tuple(lin('#16140f')) + (1,)
sc.world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.7
sc.render.engine = 'BLENDER_EEVEE'
ee = sc.eevee
ee.use_soft_shadows, ee.shadow_cube_size, ee.shadow_cascade_size = True, '2048', '4096'
ee.use_gtao, ee.gtao_distance = True, 0.3
sc.view_settings.view_transform = 'Standard'
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1920, 1080, SCALE
cam_d = bpy.data.cameras.new('cam')
cam = bpy.data.objects.new('cam', cam_d)
sc.collection.objects.link(cam)
sc.camera = cam
tgt = bpy.data.objects.new('target', None)
sc.collection.objects.link(tgt)
tc = cam.constraints.new('TRACK_TO')
tc.target, tc.track_axis, tc.up_axis = tgt, 'TRACK_NEGATIVE_Z', 'UP_Y'
hx, hy = lonlat(-157.862, 21.302)
VIEWS = {'top': ((0, -0.001, 14.0), (0, 0, 0), 42), 'tilt': ((0.6, -7.4, 4.6), (0.2, 0.1, 0.0), 40),
         'near': ((hx + 0.5, hy - 2.0, 1.0), (hx - 0.1, hy + 0.35, 0.0), 35)}
os.makedirs(OUT, exist_ok=True)
for mode in MODES:
    p, l, lens = VIEWS[mode]
    cam.location, tgt.location, cam_d.lens = p, l, lens
    sc.render.filepath = os.path.join(OUT, f'terrain3d_{mode}.png')
    bpy.ops.render.render(write_still=True)
    print('STILL', mode, flush=True)
