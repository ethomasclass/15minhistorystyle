# Test reel for the shared Ep 1 pieces, each timed to the real narration:
#   A  the Declaration line (ch 2: "In 1776 ... the consent of the governed ... The people have to say yes.")
#   B  the two-word question card (ch 2: "betraying its own ideals ... or living them out?")
#   C  a vocabulary card (ch 6: "A small group taking a government by force is called a coup.")
#   python3 tools/kit_reel.py      (renders, encodes and joins to renders/tests/kit_reel.mp4)
import math, os, subprocess, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vkit import *   # noqa: F401,F403
from vkit import EP

OUT = os.path.join(EP, 'renders', 'tests')
SCR = os.path.join(EP, 'build', 'kit_parts')
os.makedirs(SCR, exist_ok=True)


# ================================================================ A · the Declaration line
def parchment():
    """the 1823 Stone facsimile, top part, inked warm on parchment (made once)"""
    p = os.path.join(SCR, 'decl_top.jpg')
    if not os.path.exists(p):
        im = np.asarray(Image.open(os.path.join(EP, 'img', 'raw', 'declaration_5000.jpg')).crop((0, 0, 5000, 1700)).convert('L'), np.float32) / 255
        ink, paper = np.array([43, 34, 25], np.float32), np.array([237, 225, 196], np.float32)
        u = np.clip((im - 0.18) / 0.72, 0, 1)
        u[:80, :] = 1.0; u[:, :40] = 1.0; u[:, -40:] = 1.0             # paint out the scan's own page edge
        u = u[..., None]
        Image.fromarray((ink + (paper - ink) * u).astype(np.uint8)).save(p, quality=90)
    return p


LINE = (575, 1272, 1205, 1372)              # "the consent of the governed" on the scan
HEAD = (3640, 245)                           # "JULY 4, 1776" in the title


def seg_a():
    Wd = Words('ch02_the_question')
    t_end = Wd.end('say yes') + 0.8
    S = stage('kit_a_decl', t_end, bg=True)
    href = S.img(parchment())
    x0, y0, x1, y1 = LINE
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    S.defs.append(f'<mask id="dimm"><rect x="-500" y="-500" width="6000" height="2800" fill="#fff"/>'
                  f'<rect x="{x0 - 30}" y="{y0 - 22}" width="{x1 - x0 + 60}" height="{y1 - y0 + 34}" rx="30" fill="#000" filter="url(#soft4)"/></mask>')
    S.world.append('<rect x="-2500" y="-2500" width="10000" height="6700" fill="#ede1c4"/>')         # parchment beyond the scan
    S.world.append(f'<image href="{href}" x="0" y="0" width="5000" height="1700"/>')
    S.world.append('<rect id="dim" x="-500" y="-500" width="6000" height="2800" fill="#0d0c09" mask="url(#dimm)" opacity="0"/>')
    S.over.append('<g id="ov"></g>')
    tc = Wd.at('the consent of the governed')
    cam = Camera([(0.0, HEAD[0], HEAD[1] + 10, 0.78), (Wd.at('1776') + 0.25, HEAD[0], HEAD[1], 0.95),
                  (Wd.at('told') + 0.1, HEAD[0] - 60, HEAD[1] + 30, 0.97),
                  (tc - 0.15, cx, cy, 1.32), (Wd.end('governed') + 0.3, cx, cy, 1.42), (t_end, cx, cy + 2, 1.52)], wobble=1.2)

    def frame(t):
        dim = 0.62 * ease_out(clamp((t - tc + 0.1) / 0.6))
        o = tag(40, 1050, 'THE DECLARATION OF INDEPENDENCE · W. J. STONE FACSIMILE, 1823', 16, '#8d857a')
        return {'t': {'CAM': cam.transform(t)}, 'o': {'dim': f'{dim:.3f}'}, 'h': {'ov': o}}
    return S, frame, 'ch02_the_question', 0.0, t_end


# ================================================================ B · the two-word question card
def seg_b():
    W0 = Words('ch02_the_question')
    a = W0.at('So when America') - 0.3
    b = W0.end('living them out') + 1.2
    Wd = Words('ch02_the_question', t0=a)
    S = stage('kit_b_question', b - a)
    S.over.append('<g id="ov"></g>')
    t_in, t_b, t_l = Wd.at('So when America'), Wd.at('betraying'), Wd.at('living')
    PX, PY, L = 960, 455, 470

    def tilt(t):                             # degrees, left side down; it never settles
        if t < t_b:
            return 0.0
        if t < t_l:
            return 7 * back_out((t - t_b) / 0.55, 1.3)
        return 7 * math.cos(2 * math.pi * (t - t_l) / 2.6) * (0.75 + 0.25 * math.exp(-(t - t_l)))

    def card(word, s):
        return g(0, 0, s, f'<path d="{tablet(270, 80, 22)}" fill="#0d0c09" transform="translate(8,10)"/>'
                          f'<path d="{tablet(270, 80, 22)}" fill="{CREAM}"/>'
                          + text(0, 24, word, 66, 'Abril', INK, 'middle'))

    def frame(t):
        s = pop_s(t, t_in, 0.45)
        tau = tilt(t)
        th = math.radians(-tau)
        lx, ly = PX - L * math.cos(th), PY - L * math.sin(th)
        rx, ry = PX + L * math.cos(th), PY + L * math.sin(th)
        o = ''
        # stand, beam, chains, the two tablets
        body = (f'<path d="M{PX - 90},{PY + 300} L{PX + 90},{PY + 300} L{PX},{PY + 6} z" fill="{BONE_D}"/>'
                f'<path d="M{PX},{PY + 6} L{PX + 90},{PY + 300} L{PX + 30},{PY + 300} z" fill="#a89f8e"/>'
                f'<rect x="{PX - 170}" y="{PY + 300}" width="340" height="26" fill="{BONE_D}"/>'
                f'<g transform="rotate({-tau:.2f} {PX} {PY})"><rect x="{PX - L - 10}" y="{PY - 9}" width="{2 * L + 20}" height="18" rx="9" fill="{TE}"/></g>'
                f'<circle cx="{PX}" cy="{PY}" r="20" fill="{CREAM}"/><circle cx="{PX}" cy="{PY}" r="8" fill="{INK}"/>')
        for (ex, ey), word, tw in (((lx, ly), 'BETRAYAL', t_b), ((rx, ry), 'EXPRESSION', t_l)):
            cs = pop(t, tw, 0.32)
            if cs > 0:
                ty = ey + 190
                body += (f'<path d="M{ex - 180:.1f},{ty - 80:.1f} L{ex:.1f},{ey:.1f} L{ex + 180:.1f},{ty - 80:.1f}" fill="none" '
                         f'stroke="{BONE_D}" stroke-width="4" opacity="{min(1, cs):.3f}"/>')
                body += g(ex, ty, 1.0, card(word, cs))
        o += f'<g transform="translate({PX},{PY + 120}) scale({s:.4f}) translate({-PX},{-PY - 120})">{body}</g>'
        if t >= t_in + 0.2:
            o += f'<g opacity="{clamp((t - t_in - 0.2) / 0.4):.3f}">' + text(960, 170, 'THE QUESTION THIS SERIES ASKS', 24, 'Plex', TAG, 'middle', extra='letter-spacing="3"') + '</g>'
        return {'h': {'ov': o}}
    return S, frame, 'ch02_the_question', a, b


# ================================================================ C · a vocabulary card
def building(flag_up, flag2_up):
    o = (shadow(230, 20)
         + f'<rect x="-210" y="-210" width="420" height="210" fill="{BONE}"/><rect x="60" y="-210" width="150" height="210" fill="{BONE_D}"/>'
         + f'<path d="M-235,-206 L0,-300 L235,-206 z" fill="{CREAM}"/><path d="M0,-300 L235,-206 L120,-206 z" fill="{BONE_D}"/>'
         + ''.join(f'<rect x="{x}" y="-190" width="22" height="190" fill="#d9d0bd"/>' for x in (-180, -110, -40, 30, 100, 170))
         + f'<rect x="-30" y="-90" width="60" height="90" fill="{INK}"/>'
         + f'<rect x="-4" y="-470" width="8" height="175" fill="{INK}"/>')
    if flag_up > 0:
        o += f'<rect x="4" y="{-470 + (1 - flag_up) * 120:.1f}" width="90" height="56" fill="{CO}"/>'
    if flag2_up > 0:
        o += f'<rect x="4" y="{-470 + (1 - flag2_up) * 120:.1f}" width="90" height="56" fill="{BONE_D}"/>'
    return o


def rifle():
    return f'<line x1="-6" y1="-30" x2="34" y2="-150" stroke="{BONE}" stroke-width="7" stroke-linecap="round"/>'


def seg_c():
    W0 = Words('ch06_the_heist')
    a = W0.at('A small group taking') - 0.3
    b = W0.end('called a coup') + 1.3
    Wd = Words('ch06_the_heist', t0=a)
    S = stage('kit_c_vocab', b - a)
    S.over.append('<g id="ov"></g>')
    DEF = 'a small group taking a government by force'.split()
    TW = [Wd.at(' '.join(DEF[:i + 1][-1:]), 1) if i == 0 else None for i in range(len(DEF))]
    tw, k = [], 0
    for i, w in enumerate(DEF):                        # the spoken time of each word of the definition, in order
        phrase = ' '.join(DEF[: i + 1])
        tw.append(Wd.w[Wd._find('A small group taking a government by force')[0] + i]['s'] - a)
    t_grp, t_take, t_force, t_coup = tw[1], tw[3], tw[6], Wd.at('coup')

    def frame(t):
        tq = step12(t)
        o = ''
        # the vignette: the building, the group arriving, rifles, the flag changing
        down = 1 - ease((tq - t_force) / 0.35)
        up2 = ease((tq - t_force - 0.4) / 0.45)
        o += g(1130, 600, pop(t, tw[5] - 0.1), building(down if t >= t_force else 1.0, up2 if t >= t_force + 0.4 else 0))
        walk = ease_io((t - t_take) / 1.0)
        for j, (h, coat, hat) in enumerate(((200, BONE_D, INK), (186, TE_D, INK), (194, '#8a8378', INK), (178, BONE, INK))):
            fx = 560 + j * 70 + 110 * walk
            fig = figure(h, coat, hat=hat) + (g(h * 0.16, -h * 0.35, 1.0, rifle()) if t >= t_force else '')
            o += g(fx, 600 + (j % 2) * 18, pop(t, t_grp + j * 0.08), fig)
        # the definition, word by word, plain meaning first
        spans = ''.join(f'<tspan fill-opacity="{clamp((t - t0 + 0.03) / 0.2):.3f}">{w} </tspan>' for w, t0 in zip(DEF, tw))
        o += f'<text x="960" y="790" font-family="\'Inter8\'" font-size="58" fill="{CREAM}" text-anchor="middle" xml:space="preserve">{spans}</text>'
        # the term on the orange strip, with how to say it
        if t >= t_coup:
            sw = 120 * 0.62 * 4 + 60
            o += highlight(960 - sw / 2 - 70, 960, 'COUP', 120, prog=(tq - t_coup) / 0.27)
            if t >= t_coup + 0.3:
                o += f'<g opacity="{clamp((t - t_coup - 0.3) / 0.25):.3f}">' + text(960 + sw / 2 - 30, 935, '/ koo /', 52, 'Plex', TE) + '</g>'
        return {'h': {'ov': o}}
    return S, frame, 'ch06_the_heist', a, b


if __name__ == '__main__':
    clips = []
    for fn in (seg_a, seg_b, seg_c):
        S, frame, stem, a, b = fn()
        S.write(frame)
        clips.append(encode_clip(S.name, stem, a, b, os.path.join(S.dir, 'clip.mp4')))
        print('clip', S.name, round(b - a, 2), 's', flush=True)
    os.makedirs(OUT, exist_ok=True)
    inp = []
    for c in clips:
        inp += ['-i', c]
    n = len(clips)
    flt = ''.join(f'[{i}:v][{i}:a]' for i in range(n)) + f'concat=n={n}:v=1:a=1[v][a]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inp + ['-filter_complex', flt, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264',
                    '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', os.path.join(OUT, 'kit_reel.mp4')], check=True)
    print('reel', os.path.join(OUT, 'kit_reel.mp4'))
