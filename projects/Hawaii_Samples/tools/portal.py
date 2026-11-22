# Portal journeys: a chain of scenes, each seen through a frame (a porthole, a picture, a window, a page) in the
# scene before it, flown through without a cut. The MagnatesMedia move, built from what made the palace-window
# sample work:
#   - every scene has a hole (any SVG path) that shows the next scene through it, and a 16:9 frame F inside the hole;
#   - the camera pushes at F, zoom splined in log space, and turns to F's angle if the frame is tilted;
#   - the next scene sits deeper: while the frame grows, the view inside it widens (crop m0 -> 1), which reads as
#     depth, not as a zoom into a flat picture;
#   - when F covers the screen the outer scene is simply gone (no dissolve) and the inner scene's own camera takes
#     over, seeded with the approach's last positions so the speed carries through the hand-off.
# Only the scene we are in, the next one and the one after are drawn; each scene's transform is computed here in
# double precision, so the chain can be as long as needed.
import math
from kit import Camera, Spline, W, H, clamp, ease

CX, CY = W / 2, H / 2


def M_mul(A, B):
    a, b, c, d, e, f = A; a2, b2, c2, d2, e2, f2 = B
    return (a * a2 + c * b2, b * a2 + d * b2, a * c2 + c * d2, b * c2 + d * d2, a * e2 + c * f2 + e, b * e2 + d * f2 + f)


def M_tr(x, y): return (1, 0, 0, 1, x, y)
def M_sc(s): return (s, 0, 0, s, 0, 0)


def M_rot(deg):
    r = math.radians(deg); return (math.cos(r), math.sin(r), -math.sin(r), math.cos(r), 0, 0)


def M_chain(*Ms):
    out = Ms[0]
    for m in Ms[1:]:
        out = M_mul(out, m)
    return out


def M_inv_apply(M, x, y):
    a, b, c, d, e, f = M
    det = a * d - b * c
    x -= e; y -= f
    return ((d * x - c * y) / det, (-b * x + a * y) / det)


def M_svg(M):
    return 'matrix(' + ' '.join(f'{v:.6f}' for v in M) + ')'


class Scene:
    def __init__(self, name, svg, hole=None, F=None, keys=()):
        """svg: content in a 1920x1080 design space (with bleed beyond it). hole: SVG path data of the opening onto
        the next scene. F: (cx, cy, w[, rot_deg]) the 16:9 frame inside the hole. keys: extra camera keys while we
        are in this scene, (t, x, y, zoom[, rot]) in global time, zoom rising."""
        self.name, self.svg, self.hole, self.F, self.keys = name, svg, hole, F, list(keys)


class Journey:
    def __init__(self, scenes, T, m0=1.5, over=1.06, m_end=1.03, wobble=0.6):
        """T[k]: the time we pass into scene k (T[0] = 0). T has one more entry: the end of the last scene."""
        self.S, self.T, self.m0, self.m_end, self.over = scenes, T, m0, m_end, over
        self.cams, self.push = [], []
        for k, sc in enumerate(scenes):
            keys = []
            if k == 0:
                keys += sc.keys
            else:
                for dt in (0.5, 0.25, 0.0):                       # seed with the approach, so the speed carries through
                    keys.append((T[k] - dt,) + self._eff(k, T[k] - dt))
                keys += sc.keys
            if sc.F:
                fx, fy, fw = sc.F[:3]; rot = sc.F[3] if len(sc.F) > 3 else 0.0
                keys.append((T[k + 1], fx, fy, W * over / fw, -rot))
                last = max([q[0] for q in sc.keys] + [T[k]])
                self.push.append((last, T[k + 1]))
            else:
                self.push.append(None)
            self.cams.append(Camera(sorted(keys), wobble=wobble))

    # ---- placement of scene k inside scene k-1 at time t
    def _m(self, k, t):
        p = self.push[k - 1]
        u = ease((t - p[0]) / (p[1] - p[0])) if p else 0.0
        return self.m0 + (self.m_end - self.m0) * u

    def _place(self, k, t):
        fx, fy, fw = self.S[k - 1].F[:3]; rot = self.S[k - 1].F[3] if len(self.S[k - 1].F) > 3 else 0.0
        r = fw / W * self._m(k, t)
        return M_chain(M_tr(fx, fy), M_rot(rot), M_sc(r), M_tr(-CX, -CY))

    def _cam_M(self, k, t, wob=True):
        c = self.cams[k]
        if wob:
            x, y, z, r = c.at(t)
        else:
            x, y, z, r = c.x(t), c.y(t), math.exp(c.z(t)), c.r(t)
        p = self.push[k]
        if p and t > p[0]:
            # During the push the zoom grows exponentially, so the centre must close on the frame in step with it:
            # the frame's distance from screen centre, in screen pixels, shrinks smoothly to zero.
            fx, fy = self.S[k].F[:2]
            x0, y0, z0 = c.x(p[0]), c.y(p[0]), math.exp(c.z(p[0]))
            u = clamp((t - p[0]) / (p[1] - p[0]))
            g = (z0 / z) * (1 - ease(u))
            x, y = fx + (x0 - fx) * g, fy + (y0 - fy) * g
        return M_chain(M_tr(CX, CY), M_rot(r), M_sc(z), M_tr(-x, -y)), (x, y, z, r)

    def _eff(self, k, t):
        """scene k's camera as implied by its parent's camera at time t (before the hand-off)"""
        Mp, (x, y, z, r) = self._cam_M(k - 1, t, wob=False)
        Mc = M_mul(Mp, self._place(k, t))
        px, py = M_inv_apply(Mc, CX, CY)
        fw = self.S[k - 1].F[2]; rot = self.S[k - 1].F[3] if len(self.S[k - 1].F) > 3 else 0.0
        return (px, py, z * fw / W * self._m(k, t), r + rot)

    def active(self, t):
        a = 0
        for k in range(len(self.S)):
            if t >= self.T[k]:
                a = k
        return a

    def transforms(self, t):
        """{scene index: SVG matrix} for the scenes on screen now (the active one and the next two)"""
        a = self.active(t)
        M, _ = self._cam_M(a, t)
        out = {a: M}
        for k in (a + 1, a + 2):
            if k < len(self.S) and self.S[k - 1].F:
                M = M_mul(M, self._place(k, t))
                out[k] = M
        return a, out

    # ---- the stage markup: deepest scene first, each cut open at its hole
    def markup(self):
        defs, body = '', ''
        for k in reversed(range(len(self.S))):
            sc = self.S[k]
            if sc.hole:
                defs += (f'<clipPath id="hole{k}"><path clip-rule="evenodd" d="M-6000,-6000 H8000 V8000 H-6000 Z {sc.hole}"/></clipPath>')
                body += f'<g id="S{k}" opacity="0"><g clip-path="url(#hole{k})">{sc.svg}</g></g>'
            else:
                body += f'<g id="S{k}" opacity="0">{sc.svg}</g>'
        return defs, body

    def frame(self, t):
        a, tr = self.transforms(t)
        T = {f'S{k}': M_svg(m) for k, m in tr.items()}
        O = {f'S{k}': (1 if k in tr else 0) for k in range(len(self.S))}
        return a, T, O
