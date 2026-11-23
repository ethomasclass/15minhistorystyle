# The 3D maps: real terrain as layered paper (the explainer palette in three dimensions). One card sheet per contour level
# from tools/relief_bake.py (AWS Terrarium elevation: SRTM on land, GEBCO under the sea): the sea floor in slate-teal
# shelves, the island in coral sheets (Hawaiʻi is the subject), on the dark desk. Pins are cut-corner teal tablets on posts.
#   first: python3 tools/geo_bake.py heightmap assets/geo/oahu_hm.json --name=oahu --bbox=21.22,21.73,-158.30,-157.62 --w=440 --h=355 --zoom=11
#          python3 tools/relief_bake.py assets/geo/oahu_hm.json assets/geo/oahu_relief.json 200 400 assets/geo/oahu_water.json   (SOFT=7 blur for the inland sheets)
#   xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python map3d.py -- <out_dir> [scale%] [mode]
#   mode: top (straight down, like the flat island card), tilt (three-quarter from the south), rise (frames in $FRAMES:
#         the sheets rise from flat, stepped at 12 fps, while the camera tilts down toward Honolulu harbor)
import bpy, bmesh, json, math, os, sys
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/map3d'
SCALE = int(argv[1]) if len(argv) > 1 else 50
MODES = (argv[2] if len(argv) > 2 else 'tilt').split(',')
REL = json.load(open(os.environ.get('RELIEF', os.path.join(EP, 'assets', 'geo', 'oahu_relief.json'))))
B = REL['bounds']
T = 0.032                                    # one sheet of card (map units: 1 = 10 km); the vertical is a stack, not to scale
FPS = 30

for ob in list(bpy.data.objects):
    bpy.data.objects.remove(ob, do_unlink=True)
sc = bpy.context.scene


def hexrgb(hx, a=1.0):
    hx = hx.lstrip('#')
    c = [int(hx[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c) + (a,)


MATS = {}


def mat(hx, rough=0.92, emit=0.0):
    if (hx, emit) in MATS:
        return MATS[(hx, emit)]
    m = bpy.data.materials.new(f'm{hx}{emit}')
    m.use_nodes = True
    bs = m.node_tree.nodes['Principled BSDF']
    bs.inputs['Base Color'].default_value = hexrgb(hx)
    bs.inputs['Roughness'].default_value = rough
    if emit:
        bs.inputs['Emission Color' if 'Emission Color' in bs.inputs else 'Emission'].default_value = hexrgb(hx)
        bs.inputs['Emission Strength'].default_value = emit
    MATS[(hx, emit)] = m
    return m


def lerp_hex(a, b, u):
    pa = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    pb = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return '#' + ''.join(f'{round(x + (y - x) * u):02x}' for x, y in zip(pa, pb))


def lonlat(lon, lat):
    """map units, centred, matching relief_bake"""
    return ((lon - (B['lon0'] + B['lon1']) / 2) / (B['lon1'] - B['lon0']) * REL['w_units'],
            (lat - (B['lat0'] + B['lat1']) / 2) / (B['lat1'] - B['lat0']) * REL['h_units'])


def sheet(name, shapes, z, col):
    """one sheet of card: the triangulated top and bottom (tools/relief_bake.py) and a wall round every ring"""
    bm = bmesh.new()
    for shp in shapes:
        pts = [q for r in shp['rings'] for q in r]
        top = [bm.verts.new((x, y, T / 2)) for x, y in pts]
        bot = [bm.verts.new((x, y, -T / 2)) for x, y in pts]
        for a, b, c in shp['tris']:
            for f in ((top[a], top[b], top[c]), (bot[c], bot[b], bot[a])):
                try:
                    bm.faces.new(f)
                except ValueError:
                    pass
        k = 0
        for r in shp['rings']:
            n = len(r)
            for m in range(n):
                i0, i1 = k + m, k + (m + 1) % n
                try:
                    bm.faces.new((top[i0], bot[i0], bot[i1], top[i1]))
                except ValueError:
                    pass
            k += n
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    ob = bpy.data.objects.new(name, me)
    sc.collection.objects.link(ob)
    ob.location = (0, 0, z)
    me.materials.append(mat(col))
    return ob


# ---- the desk, the base board, the sheets
bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, -0.002))
desk = bpy.context.object
desk.data.materials.append(mat('#16140f', 0.95))
W2, H2 = REL['w_units'] / 2, REL['h_units'] / 2
bpy.ops.mesh.primitive_cube_add(location=(0, 0, T / 2))
base = bpy.context.object
base.scale = (W2, H2, T / 2)
base.data.materials.append(mat('#1b2b2c'))
SHEETS = []
sea = [l for l in REL['levels'] if l['kind'] == 'sea']
land = [l for l in REL['levels'] if l['kind'] == 'land']
for i, l in enumerate(sea):                   # deep slate to the shallow teal-grey of the wall map
    col = lerp_hex('#22393a', '#7fa6a2', (i + 1) / len(sea))
    SHEETS.append(sheet(f'sea{i}', l['shapes'], T * (i + 1.5), col))
n0 = len(sea)
for j, l in enumerate(land):                  # coral, warming to a pale top
    u = j / max(1, len(land) - 1)
    col = lerp_hex('#d4514a', '#ffd0c4', u ** 0.8)
    if j % 2:
        col = lerp_hex(col, '#000000', 0.05)   # alternate sheets a shade apart, so the layers read as card
    SHEETS.append(sheet(f'land{j}', l['shapes'], T * (n0 + j + 1.5), col))
TOP = T * (len(SHEETS) + 1)
SEA_Z = T * (n0 + 1)                          # the shoreline sheet's base

# ---- pins: a teal cut-corner tablet on a post, standing on the place
def pin(name, lon, lat, col='#2FE0C4', hgt=0.55):
    x, y = lonlat(lon, lat)
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.012, depth=hgt, location=(x, y, SEA_Z + hgt / 2))
    post = bpy.context.object
    post.data.materials.append(mat('#111111'))
    bm = bmesh.new()
    w, h, c, d = 0.11, 0.08, 0.03, 0.02
    pts = [(-w + c, -h), (w - c, -h), (w, -h + c), (w, h - c), (w - c, h), (-w + c, h), (-w, h - c), (-w, -h + c)]
    f = bm.faces.new([bm.verts.new((px, 0, py)) for px, py in pts])
    bmesh.ops.extrude_face_region(bm, geom=[f])
    for v in bm.verts[len(pts):]:
        v.co.y -= d
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    ob = bpy.data.objects.new(name, me)
    sc.collection.objects.link(ob)
    ob.location = (x, y + d / 2, SEA_Z + hgt + h)
    me.materials.append(mat(col, 0.6, 0.35))
    return ob, post


PINS = {'honolulu': pin('pin_honolulu', -157.862, 21.302), 'pearl': pin('pin_pearl', -157.972, 21.355, col='#FF9F1C', hgt=0.42)}

# ---- light: a low warm sun from the west-southwest for the relief, a cool fill, dark warm world
sun = bpy.data.lights.new('sun', 'SUN')
sun.energy, sun.color, sun.angle = 3.2, (1.0, 0.93, 0.82), math.radians(2.5)
so = bpy.data.objects.new('sun', sun)
sc.collection.objects.link(so)
so.rotation_euler = (math.radians(58), 0, math.radians(-115))
fill = bpy.data.lights.new('fill', 'SUN')
fill.energy, fill.color = 0.5, (0.75, 0.88, 0.9)
fo = bpy.data.objects.new('fill', fill)
sc.collection.objects.link(fo)
fo.rotation_euler = (math.radians(40), 0, math.radians(70))
fill.use_shadow = False
sc.world = sc.world or bpy.data.worlds.new('w')
sc.world.use_nodes = True
sc.world.node_tree.nodes['Background'].inputs['Color'].default_value = hexrgb('#16140f')
sc.world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.6

sc.render.engine = 'BLENDER_EEVEE'
ee = sc.eevee
ee.use_soft_shadows, ee.shadow_cube_size, ee.shadow_cascade_size = True, '2048', '4096'
ee.use_gtao, ee.gtao_distance = True, 0.25
sc.view_settings.view_transform = 'Standard'
sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
sc.render.resolution_percentage = SCALE
sc.render.fps = FPS

# ---- camera
cam_d = bpy.data.cameras.new('cam')
cam = bpy.data.objects.new('cam', cam_d)
sc.collection.objects.link(cam)
sc.camera = cam
tgt = bpy.data.objects.new('target', None)
sc.collection.objects.link(tgt)
tc = cam.constraints.new('TRACK_TO')
tc.target, tc.track_axis, tc.up_axis = tgt, 'TRACK_NEGATIVE_Z', 'UP_Y'
hx, hy = lonlat(-157.862, 21.302)
VIEWS = {
    'top': ((0, -0.001, 14.0), (0, 0, 0), 42),
    'tilt': ((0.6, -7.4, 4.6), (0.2, 0.1, 0.2), 40),
    'near': ((hx + 0.5, hy - 2.0, 1.15), (hx - 0.1, hy + 0.35, SEA_Z), 35),
}


def set_view(v):
    p, l, lens = VIEWS[v]
    cam.location, tgt.location, cam_d.lens = p, l, lens


os.makedirs(OUT, exist_ok=True)
for mode in MODES:
    if mode in VIEWS:
        set_view(mode)
        sc.render.filepath = os.path.join(OUT, f'map3d_{mode}.png')
        bpy.ops.render.render(write_still=True)
        print('STILL', mode, flush=True)
