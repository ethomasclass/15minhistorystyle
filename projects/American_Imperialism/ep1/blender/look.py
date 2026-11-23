# The finishing pass for every Blender world scene: what makes the flat-shaded models read like the Flow plates.
#   facets   big polygonal patches of tone on every surface (a Voronoi field in world space), like the plates' painted walls
#   courses  thin dark lines at a fixed height spacing: stone coursing, slate rows, clapboards
#   bevels   a narrow chamfer on every block, so each edge catches the light or falls into shade
#   light    cool sky fill in the shadows against the warm sun; deeper ambient occlusion; contact shadows
#   grade    a gentle split tone in the compositor (teal lift, warm gain) and a little contrast; distance haze
# Use: exec this file, then call finish(sc, rules) after the scene is built. Characters are left alone (their textures would
# swim as they move), and so is anything with an image or emission shader.
import bpy, math


def _mul(nt, a, b, loc):
    m = nt.nodes.new('ShaderNodeMixRGB')
    m.blend_type, m.inputs['Fac'].default_value = 'MULTIPLY', 1.0
    m.location = loc
    nt.links.new(a, m.inputs['Color1'])
    nt.links.new(b, m.inputs['Color2'])
    return m.outputs['Color']


def texture(m, amp=0.06, scale=0.32, course=None, line=0.92):
    """facets of tone, and optionally course lines every `course` metres (world z)"""
    nt = m.node_tree
    b = nt.nodes.get('Principled BSDF')
    if b is None or b.inputs['Base Color'].is_linked:
        return
    rgb = nt.nodes.new('ShaderNodeRGB')
    rgb.outputs[0].default_value = tuple(b.inputs['Base Color'].default_value)
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    out = rgb.outputs[0]
    for k, (sc_, w) in enumerate(((scale, 0.7), (scale * 3.1, 0.3))):
        v = nt.nodes.new('ShaderNodeTexVoronoi')
        v.inputs['Scale'].default_value = sc_
        v.inputs['Randomness'].default_value = 0.9
        nt.links.new(geo.outputs['Position'], v.inputs['Vector'])
        bw = nt.nodes.new('ShaderNodeRGBToBW')
        nt.links.new(v.outputs['Color'], bw.inputs[0])
        mr = nt.nodes.new('ShaderNodeMapRange')
        mr.inputs['To Min'].default_value = 1 - amp * w
        mr.inputs['To Max'].default_value = 1 + amp * w
        nt.links.new(bw.outputs[0], mr.inputs['Value'])
        out = _mul(nt, out, mr.outputs['Result'], (200 * k, 0))
    if course:
        wv = nt.nodes.new('ShaderNodeTexWave')
        wv.wave_type, wv.bands_direction, wv.wave_profile = 'BANDS', 'Z', 'SAW'
        wv.inputs['Scale'].default_value = 2 * math.pi / (20 * course)
        wv.inputs['Distortion'].default_value = 0.0
        wv.inputs['Detail'].default_value = 0.0
        nt.links.new(geo.outputs['Position'], wv.inputs['Vector'])
        cr = nt.nodes.new('ShaderNodeValToRGB')
        cr.color_ramp.interpolation = 'CONSTANT'
        cr.color_ramp.elements[0].position, cr.color_ramp.elements[0].color = 0.0, (line, line, line, 1)
        cr.color_ramp.elements[1].position, cr.color_ramp.elements[1].color = 0.07, (1, 1, 1, 1)
        nt.links.new(wv.outputs['Fac'], cr.inputs['Fac'])
        out = _mul(nt, out, cr.outputs['Color'], (600, 0))
    nt.links.new(out, b.inputs['Base Color'])


def _is_person(ob):
    p = ob
    while p is not None:
        if p.type == 'ARMATURE':
            return True
        p = p.parent
    return False


def bevels(max_w=0.035, frac=0.18):
    """a one-segment chamfer on every plain block (8 vertices, no modifiers)"""
    n = 0
    for ob in bpy.data.objects:
        if ob.type != 'MESH' or ob.hide_render or ob.modifiers or len(ob.data.vertices) != 8 or _is_person(ob):
            continue
        w = min(max_w, frac * min(ob.dimensions))
        if w < 0.004:
            continue
        md = ob.modifiers.new('bevel', 'BEVEL')
        md.width, md.segments, md.limit_method = w, 1, 'NONE'
        n += 1
    return n


def finish(sc, rules=None, default=(0.06, 0.32, None, 0.92), haze=(40.0, 450.0, 0.4), shadow_fill='#a9bcbc', fill_strength=0.5):
    """rules: {hex colour: (amp, scale, course or None, line darkness)}; every other scenery material gets `default`"""
    rules = {k.lower(): v for k, v in (rules or {}).items()}
    people = {s.material for ob in bpy.data.objects if _is_person(ob) for s in ob.material_slots if s.material}
    for m in bpy.data.materials:
        if m in people or not m.use_nodes:
            continue
        if any(n.type in ('TEX_IMAGE', 'EMISSION') for n in m.node_tree.nodes):
            continue
        texture(m, *rules.get(m.name.lower(), default))
    nb = bevels()
    # light: the sky lights the shadows a cool grey-green; contact shadows ground small things; deeper occlusion
    w = sc.world.node_tree
    for n in w.nodes:
        if n.type == 'BACKGROUND' and not n.inputs['Color'].is_linked:
            pass
    amb = [n for n in w.nodes if n.type == 'BACKGROUND']
    lp_mix = [n for n in w.nodes if n.type == 'MIX_SHADER'][0]
    amb_node = lp_mix.inputs[1].links[0].from_node                    # the background the scene is lit by (not the one the camera sees)
    for l in list(amb_node.inputs['Color'].links):
        w.links.remove(l)
    h = shadow_fill.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    amb_node.inputs['Color'].default_value = tuple((v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4) for v in c) + (1,)
    amb_node.inputs['Strength'].default_value = fill_strength
    for lt in bpy.data.lights:
        lt.use_contact_shadow = True
        lt.contact_shadow_distance = 0.25
        lt.contact_shadow_thickness = 0.15
    ee = sc.eevee
    ee.gtao_distance, ee.gtao_factor = 1.6, 1.5
    ee.use_gtao_bent_normals = True
    # haze: distance fades toward the horizon colour
    sc.world.mist_settings.start, sc.world.mist_settings.depth = haze[0], haze[1]
    ct = sc.node_tree
    comp = [n for n in ct.nodes if n.type == 'COMPOSITE'][0]
    mul = [n for n in ct.nodes if n.type == 'MATH'][0]
    mul.inputs[1].default_value = haze[2]
    src = comp.inputs['Image'].links[0].from_socket
    cb = ct.nodes.new('CompositorNodeColorBalance')
    cb.correction_method = 'LIFT_GAMMA_GAIN'
    cb.lift = (0.993, 1.0, 1.008)
    cb.gain = (1.03, 1.0, 0.96)
    ct.links.new(src, cb.inputs['Image'])                            # (no contrast node: on linear values it crushes the darks to black)
    ct.links.new(cb.outputs['Image'], comp.inputs['Image'])
    print('LOOK: textured materials, bevels on', nb, 'blocks')
