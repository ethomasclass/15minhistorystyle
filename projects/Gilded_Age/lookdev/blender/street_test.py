import bpy, random, math, time, sys
from mathutils import Vector
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; R = random.Random(7)
OUT = sys.argv[-1]
def mat(name, col, rough=.85, em=0, emc=None, metal=0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if em: b.inputs['Emission Color'].default_value = (*(emc or col), 1); b.inputs['Emission Strength'].default_value = em
    return m
def noisy(name, c1, c2, scale=40, rough=.9):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = scale; n.inputs['Detail'].default_value = 8
    r = nt.nodes.new('ShaderNodeValToRGB'); r.color_ramp.elements[0].color = (*c1, 1); r.color_ramp.elements[1].color = (*c2, 1)
    nt.links.new(n.outputs['Fac'], r.inputs['Fac']); nt.links.new(r.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = rough
    return m
BR = [noisy(f'brick{i}', c, tuple(v*.55 for v in c), 30) for i, c in enumerate([(.16,.07,.05),(.12,.08,.06),(.18,.1,.07),(.1,.07,.06)])]
INK = mat('ink', (.012,.016,.018), .7); IRON = mat('iron', (.01,.01,.01), .5, metal=.6)
WIN_D = mat('wd', (.005,.006,.008), .3); WIN_L = mat('wl', (1,.55,.2), .5, em=6)
MUD = noisy('mud', (.05,.04,.03), (.015,.012,.01), 6, .95); COB = noisy('cob', (.06,.06,.06), (.02,.02,.02), 120, .8)
PUD = mat('pud', (.01,.012,.015), .05); DUNG = mat('dung', (.04,.028,.015), .95); PAPER = mat('paper', (.55,.52,.45), .9)
CLOTH = [mat(f'c{i}', c, .9) for i, c in enumerate([(.5,.48,.42),(.35,.3,.25),(.2,.25,.3),(.45,.4,.3),(.3,.12,.1)])]
LAMP = mat('lamp', (1,.6,.25), .5, em=25); WOOD = noisy('wood', (.12,.08,.05), (.05,.03,.02), 15)
def box(loc, s, m, rot=(0,0,0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot); o = bpy.context.object; o.scale = s; o.data.materials.append(m); return o
def cyl(loc, r, d, m, rot=(0,0,0), v=10):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, location=loc, rotation=rot, vertices=v); o = bpy.context.object; o.data.materials.append(m); return o
# street: cobbles + muddy gutters
box((0, 40, -.05), (9, 100, .1), COB)
for sx in (-1, 1):
    box((sx*4.3, 40, -.02), (1.2, 100, .06), MUD); box((sx*6.2, 40, .08), (2.6, 100, .16), mat('walk', (.07,.07,.07), .9))
# tenements both sides
for sx in (-1, 1):
    y = -4
    while y < 90:
        w = R.uniform(7, 8.5); fl = R.choice([5, 5, 6, 6, 7]); h = fl*3.1; bm = R.choice(BR)
        box((sx*(7.5+7), y + w/2, h/2), (14, w-.15, h), bm)
        box((sx*7.55, y + w/2, h + .3), (.3, w, .6), INK)  # cornice
        for f in range(fl):
            for k in range(4):
                wy = y + .9 + k*(w-1.8)/3
                lit = R.random() < .28
                box((sx*7.48, wy, 1.6 + f*3.1), (.06, .9, 1.6), WIN_L if lit else WIN_D)
            if f > 0:  # fire escape
                box((sx*6.9, y + w/2, f*3.1 + .5), (1.1, w*.6, .05), IRON)
                for p in range(9): cyl((sx*6.38, y + w/2 - w*.3 + p*w*.6/8, f*3.1 + .95), .015, .9, IRON)
                box((sx*6.9, y + w/2 + w*.15, f*3.1 - 1.0), (.5, .05, 3.2), IRON, rot=(0.55, 0, 0))
                if R.random() < .5:  # stuff on fire escapes
                    box((sx*6.8, y + R.uniform(1.5, w-1.5), f*3.1 + .8), (.4, .5, .6), R.choice(CLOTH))
        # shop awning at street level
        box((sx*6.6, y + w/2, 3.2), (1.8, w*.85, .08), R.choice(CLOTH), rot=(0, sx*-.25, 0))
        y += w
# laundry lines across the street
for k in range(9):
    yy = 6 + k*8 + R.uniform(-2, 2); z = R.uniform(7, 15)
    pts = [Vector((-7.4 + i*14.8/20, yy, z - .9*math.sin(math.pi*i/20))) for i in range(21)]
    cu = bpy.data.curves.new('line', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = .01
    sp = cu.splines.new('POLY'); sp.points.add(len(pts)-1)
    for i, p in enumerate(pts): sp.points[i].co = (*p, 1)
    o = bpy.data.objects.new('line', cu); bpy.context.collection.objects.link(o); o.data.materials.append(INK)
    for i in range(2, 19, 2):
        if R.random() < .75:
            p = pts[i]; hh = R.uniform(.5, 1.1); box((p.x, p.y, p.z - hh/2), (R.uniform(.4, .8), .02, hh), R.choice(CLOTH))
# telegraph poles + wires
for yy in range(0, 90, 18):
    cyl((5.3, yy, 6), .12, 12, WOOD); box((5.3, yy, 11.4), (1.8, .1, .1), WOOD)
# pushcarts, barrels, ash cans along the curb
for i in range(28):
    sx = R.choice((-1, 1)); yy = R.uniform(2, 80)
    t = R.random()
    if t < .5:
        box((sx*4.6, yy, .8), (1.0, 2.0, .3), WOOD)
        for dy in (-.6, .6): cyl((sx*4.6 - .55, yy + dy, .45), .42, .06, WOOD, rot=(0, math.pi/2, 0), v=16)
        for j in range(6): box((sx*4.6 + R.uniform(-.3,.3), yy + R.uniform(-.8,.8), 1.05), (.25,.25,.2), R.choice(CLOTH + [PAPER]))
    elif t < .8: cyl((sx*5.2, yy, .45), .3, .9, WOOD, v=14)
    else: cyl((sx*5.0, yy, .4), .28, .8, IRON, v=14)
# filth: dung, puddles, paper, trash heaps in gutters
for i in range(160):
    sx = R.choice((-1, 1)); yy = R.uniform(0, 70)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=R.uniform(.08, .3), location=(sx*R.uniform(3.6, 4.9), yy, .02))
    o = bpy.context.object; o.scale = (1, R.uniform(.8, 1.6), .35); o.data.materials.append(DUNG if R.random() < .6 else MUD)
for i in range(40):
    box((R.uniform(-4.5, 4.5), R.uniform(0, 70), .025), (R.uniform(.8, 2.5), R.uniform(.8, 3), .005), PUD)
for i in range(120):
    box((R.uniform(-5.5, 5.5), R.uniform(0, 60), .02), (.2, .28, .003), PAPER, rot=(0, 0, R.uniform(0, 3)))
# gas lamps
for yy in range(4, 90, 14):
    for sx in (-1, 1):
        cyl((sx*5.0, yy + (7 if sx > 0 else 0), 1.8), .05, 3.6, IRON); box((sx*5.0, yy + (7 if sx > 0 else 0), 3.75), (.3, .3, .4), LAMP)
        bpy.ops.object.light_add(type='POINT', location=(sx*5.0, yy + (7 if sx > 0 else 0), 3.7)); L = bpy.context.object.data; L.energy = 180; L.color = (1, .6, .3); L.shadow_soft_size = .3
# crowd: silhouettes (no faces), hats, shawls, kids
def person(x, y, s=1, kid=False):
    h = (1.15 if kid else R.uniform(1.6, 1.8))*s
    bpy.ops.mesh.primitive_cone_add(radius1=.28*s, radius2=.17*s, depth=h*.62, location=(x, y, h*.31), vertices=10)
    o = bpy.context.object; o.data.materials.append(INK)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.11*s*(1.1 if kid else 1), location=(x, y, h*.62 + .12*s), segments=10, ring_count=6); bpy.context.object.data.materials.append(INK)
    bpy.ops.mesh.primitive_cylinder_add(radius=.21*s, depth=.12*s, location=(x, y, h*.58), vertices=10); bpy.context.object.scale = (1, .7, 1); bpy.context.object.data.materials.append(INK)
    if not kid and R.random() < .55:
        cyl((x, y, h*.62 + .25*s), .1*s, .1*s, INK); cyl((x, y, h*.62 + .2*s), .17*s, .015, INK)
for i in range(260):
    side = R.random()
    x = R.uniform(-6.9, -3.7) if side < .4 else (R.uniform(3.7, 6.9) if side < .8 else R.uniform(-3.4, 3.4))
    person(x, R.uniform(3, 75), 1, R.random() < .18)
# horse and wagon in the street
box((.8, 22, 1.3), (1.6, 3.4, .9), WOOD)
for dy in (-1.2, 1.2):
    for dx in (-.85, .85): cyl((.8 + dx, 22 + dy, .6), .6, .08, WOOD, rot=(0, math.pi/2, 0), v=18)
box((.8, 25.3, 1.45), (.6, 1.9, .7), INK)  # horse body
box((.8, 26.5, 1.9), (.3, .8, .35), INK, rot=(-.6, 0, 0))  # neck/head
for dy in (-.7, .7):
    for dx in (-.2, .2): cyl((.8 + dx, 25.3 + dy, .55), .06, 1.1, INK)
# world: dusk sky, haze (volume)
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (.05, .12, .14, 1); bg.inputs[1].default_value = 1.2
vol = w.node_tree.nodes.new('ShaderNodeVolumePrincipled'); vol.inputs['Density'].default_value = .012; vol.inputs['Color'].default_value = (.5, .7, .72, 1)
w.node_tree.links.new(vol.outputs[0], w.node_tree.nodes['World Output'].inputs['Volume'])
bpy.ops.object.light_add(type='SUN', rotation=(1.2, 0, .4)); S = bpy.context.object.data; S.energy = 1.2; S.color = (.55, .8, .85); S.angle = .1
# camera: above the crowd, looking down the street
bpy.ops.object.camera_add(location=(-1.2, -6, 4.2)); cam = bpy.context.object; sc.camera = cam
cam.rotation_euler = (math.radians(84), 0, math.radians(-4)); cam.data.lens = 28
cam.data.dof.use_dof = True; cam.data.dof.focus_distance = 18; cam.data.dof.aperture_fstop = 5.6
sc.render.resolution_x, sc.render.resolution_y = 1920, 1080; sc.render.resolution_percentage = 67
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 40; sc.cycles.use_denoising = True
sc.cycles.volume_step_rate = 4; sc.cycles.max_bounces = 4
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
sc.render.filepath = OUT
t = time.time(); bpy.ops.render.render(write_still=True); print('sec', round(time.time() - t, 1))
