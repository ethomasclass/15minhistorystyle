# Clouds and smoke for the world sets, in the painted look of the Flow plates: soft, rounded heaps lit warm on top and
# cool underneath, with feathered edges, instead of hard low-poly lumps.
#   soft_mat(name, light, shadow, ...)   a painted material: the scene's light on a white diffuse surface is read back
#                                        (Shader to RGB) and mapped onto a two-colour ramp, the silhouette feathered to
#                                        transparent; an object's colour alpha fades it (for smoke puffs)
#   cloud(name, centre, width, height, mat, seed)        a cumulus heap with a flat base, one smooth mesh
#   bank(name, centre, width, mat, seed, n)              a row of heaps strung along x (a cloud bank on the ridges)
#   Plume(name, base, mat, ...) .key(frames, times)      a chimney plume: puffs born small and dense at the mouth, swelling,
#                                        rising, bending downwind, thinning out; keyed per frame (stepped times give the
#                                        12 fps look)
# Use: exec this file with `sc` (the scene) and `lin` (hex to linear) in its globals.
import bpy, bmesh, math, random
from mathutils import Vector


def soft_mat(name, light, shadow, lo=0.12, hi=1.1, feather=0.55, rim=0.12, alpha=1.0, shadows=True):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    N = nt.nodes.new
    dif = N('ShaderNodeBsdfDiffuse')
    dif.inputs['Color'].default_value = (0.8, 0.8, 0.8, 1)
    s2r = N('ShaderNodeShaderToRGB')
    nt.links.new(dif.outputs[0], s2r.inputs[0])
    bw = N('ShaderNodeRGBToBW')
    nt.links.new(s2r.outputs['Color'], bw.inputs[0])
    mr = N('ShaderNodeMapRange')
    mr.inputs['From Min'].default_value, mr.inputs['From Max'].default_value = lo, hi
    nt.links.new(bw.outputs[0], mr.inputs['Value'])
    ramp = N('ShaderNodeValToRGB')
    ramp.color_ramp.interpolation = 'EASE'
    ramp.color_ramp.elements[0].color = lin(shadow)
    ramp.color_ramp.elements[1].color = lin(light)
    nt.links.new(mr.outputs['Result'], ramp.inputs['Fac'])
    lw = N('ShaderNodeLayerWeight')
    lw.inputs['Blend'].default_value = 0.5
    rimm = N('ShaderNodeMixRGB')                               # a little light round the edge, as the plates paint it
    rimm.blend_type = 'SCREEN'
    nt.links.new(lw.outputs['Facing'], rimm.inputs['Fac'])
    rimm.inputs['Fac'].default_value = 0
    rimf = N('ShaderNodeMath'); rimf.operation = 'MULTIPLY'; rimf.inputs[1].default_value = rim
    nt.links.new(lw.outputs['Facing'], rimf.inputs[0])
    nt.links.new(rimf.outputs[0], rimm.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], rimm.inputs['Color1'])
    rimm.inputs['Color2'].default_value = lin(light)
    em = N('ShaderNodeEmission')
    nt.links.new(rimm.outputs['Color'], em.inputs['Color'])
    # alpha: feathered at the silhouette, times the object's colour alpha (smoke puffs fade with it)
    fe = N('ShaderNodeMapRange')
    fe.inputs['From Min'].default_value, fe.inputs['From Max'].default_value = feather, 1.0
    fe.inputs['To Min'].default_value, fe.inputs['To Max'].default_value = 1.0, 0.0
    fe.interpolation_type = 'SMOOTHSTEP'
    nt.links.new(lw.outputs['Facing'], fe.inputs['Value'])
    oi = N('ShaderNodeObjectInfo')
    a1 = N('ShaderNodeMath'); a1.operation = 'MULTIPLY'
    nt.links.new(fe.outputs['Result'], a1.inputs[0])
    nt.links.new(oi.outputs['Alpha'], a1.inputs[1])
    a2 = N('ShaderNodeMath'); a2.operation = 'MULTIPLY'; a2.inputs[1].default_value = alpha
    nt.links.new(a1.outputs[0], a2.inputs[0])
    tr = N('ShaderNodeBsdfTransparent')
    mx = N('ShaderNodeMixShader')
    nt.links.new(a2.outputs[0], mx.inputs['Fac'])
    nt.links.new(tr.outputs[0], mx.inputs[1])
    nt.links.new(em.outputs[0], mx.inputs[2])
    out = N('ShaderNodeOutputMaterial')
    nt.links.new(mx.outputs[0], out.inputs['Surface'])
    m.blend_method = 'BLEND'
    m.shadow_method = 'HASHED' if shadows else 'NONE'
    m.show_transparent_back = False
    m.use_backface_culling = False
    return m


def _ball(bm, c, r, sq, rr, sub=2):
    ret = bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=r)
    for v in ret['verts']:
        v.co = Vector((v.co.x * sq[0] * (1 + rr.uniform(-0.05, 0.05)), v.co.y * sq[1] * (1 + rr.uniform(-0.05, 0.05)),
                       v.co.z * sq[2] * (1 + rr.uniform(-0.05, 0.05)))) + Vector(c)
    return ret['verts']


def _obj(name, bm, m, smooth=True):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = smooth
    ob = bpy.data.objects.new(name, me)
    sc.collection.objects.link(ob)
    ob.data.materials.append(m)
    return ob


def cloud(name, centre, width, height, m, seed=0, depth=None, sub=2):
    """a cumulus heap: a broad flat base, rounded towers rising in the middle; centre is the middle of its base"""
    rr = random.Random(seed)
    cx, cy, cz = centre
    depth = depth or width * 0.45
    bm = bmesh.new()
    zb = cz
    n = max(5, int(width / (height * 0.5)))
    for k in range(n):                                      # the base row: wide flattened balls along the width
        u = (k + 0.5) / n - 0.5
        r = height * rr.uniform(0.38, 0.5) * (1 - 0.5 * abs(u) * 2) ** 0.5
        vs = _ball(bm, (cx + u * width * 0.9, cy + rr.uniform(-0.2, 0.2) * depth, zb + r * 0.35), r, (1.5, depth / height * 0.9, 0.8), rr, sub)
    for k in range(max(3, n // 2 + 1)):                     # the towers, bigger toward the middle
        u = rr.uniform(-0.32, 0.32)
        r = height * rr.uniform(0.4, 0.58) * (1 - abs(u) * 1.6)
        _ball(bm, (cx + u * width, cy + rr.uniform(-0.15, 0.15) * depth, zb + height * (0.35 + 0.5 * (1 - abs(u) * 2.5)) - r * 0.3), r,
              (1.15, depth / height * 0.8, 0.95), rr, sub)
    for v in bm.verts:                                      # the flat base
        if v.co.z < zb:
            v.co.z = zb + (v.co.z - zb) * 0.05
    return _obj(name, bm, m)


def bank(name, centre, width, m, seed=0, n=3, height=None):
    """several heaps strung along x into one bank"""
    rr = random.Random(seed)
    cx, cy, cz = centre
    obs = []
    for k in range(n):
        u = (k + 0.5) / n - 0.5 + rr.uniform(-0.08, 0.08)
        w = width / n * rr.uniform(1.2, 1.6)
        h = (height or width * 0.16) * rr.uniform(0.7, 1.1) * (1 - abs(u) * 0.6)
        obs.append(cloud(f'{name}{k}', (cx + u * width, cy + rr.uniform(-0.05, 0.05) * width, cz + rr.uniform(0, 0.04) * h), w, h, m, seed * 31 + k))
    return obs


class Plume:
    """a chimney's smoke: n puffs on a loop of `life` seconds, born at `base` with radius r0, rising `rise` metres and
    drifting by `drift` (a vector, downwind) over a life, swelling to r1 and fading out"""

    def __init__(s, name, base, m, n=26, r0=0.9, r1=7.0, rise=30.0, drift=(30.0, 10.0, 0.0), life=8.0, seed=0, sub=2):
        rr = random.Random(seed)
        s.base, s.n, s.r0, s.r1, s.rise, s.drift, s.life = Vector(base), n, r0, r1, rise, Vector(drift), life
        s.puffs = []
        for k in range(n):
            bm = bmesh.new()
            _ball(bm, (0, 0, 0), 1.0, (1.0, 1.0, 0.9), rr, sub)
            for j in range(2):                              # each puff a small knot of balls, so it reads as billows
                a = rr.uniform(0, 2 * math.pi)
                _ball(bm, (0.55 * math.cos(a), 0.55 * math.sin(a), rr.uniform(-0.2, 0.35)), rr.uniform(0.55, 0.75), (1, 1, 0.9), rr, sub)
            ob = _obj(f'{name}{k}', bm, m)
            s.puffs.append((ob, k / n + rr.uniform(-0.3, 0.3) / n, rr.uniform(0, 6.28), rr.uniform(0.7, 1.3),
                            Vector((rr.uniform(-1, 1), rr.uniform(-1, 1), rr.uniform(-0.3, 0.3)))))

    def state(s, t, ph, wob, sz, side):
        a = (t / s.life + ph) % 1.0
        up = s.rise * (1 - (1 - a) ** 1.6)                  # fast out of the stack, slowing as it cools
        pos = s.base + Vector((0, 0, up)) + s.drift * a ** 1.3 + side * (s.r1 * 0.35 * a) + \
            Vector((math.sin(t * 0.7 + wob), math.cos(t * 0.5 + wob), 0)) * 0.25 * s.r1 * a
        r = (s.r0 + (s.r1 - s.r0) * a ** 0.8) * sz
        fade = min(1.0, a / 0.04) * (1 - max(0.0, (a - 0.55) / 0.45)) ** 1.5
        return pos, r, fade

    def key(s, frames, times):
        for f, t in zip(frames, times):
            for ob, ph, wob, sz, side in s.puffs:
                pos, r, fade = s.state(t, ph, wob, sz, side)
                ob.location = pos
                ob.scale = (r, r, r * 0.9)
                ob.rotation_euler[2] = wob + t * 0.1
                ob.color = (1, 1, 1, fade)
                ob.keyframe_insert('location', frame=f)
                ob.keyframe_insert('scale', frame=f)
                ob.keyframe_insert('rotation_euler', frame=f)
                ob.keyframe_insert('color', frame=f)
        for ob, *_ in s.puffs:
            for fc in ob.animation_data.action.fcurves:
                for kp in fc.keyframe_points:
                    kp.interpolation = 'CONSTANT'
