# Desk B: evidence-desk pieces and joins for Ep 1, chapters 6, 8 and 9, every one keyed to the narration's words.
#   maine       ch 9  "a ship that blew up in Havana ... Or with a newspaper": the wreck print, then the Evening Journal
#                     extra slams onto it (12 fps), the camera pushes on the headline (ep 2 tease, normal palette)
#   apology     ch 9  "In 1993 ... Congress formally apologized to Native Hawaiians": PL 103-150 on the desk, the camera
#                     reads down from the header to the purpose line, a teal underline under "an apology to Native Hawaiians"
#   question    ch 9  "So, betrayal or expression? ... the answer is both": the two-tablet balance (kit_reel seg B
#                     geometry) rocks as before, then for the first time settles level, and holds
#   holds       ch 6  "For a moment, Washington's answer was no." / "Dole refused.": the Cleveland card and the Dole card
#                     (qcard.py), each held in its final state, deadpan, hard cut between them
#   petition    ch 8  ★ "In 1897 ... 21,269 names, on 556 pages": the Kuʻē pages on the light table (rebuild of the
#                     Hawaiʻi sample s3), quiet palette; the loupe reads the heading, the count runs down the
#                     signatures, the pages stack up, the camera tips down to close on the stack's edge (join 20)
#   abdication  ch 8  "signed away her throne": the paper on her writing table (join 21) becomes the scan on the desk
#   dole        ch 6  "is where the name on those fruit cups comes from": a pineapple (join 19) is cubed into the fruit cup
#                     from the Dole card, then James Dole's name card
#   ledger_off  ch 9  "Pearl Harbor": the Ledger (declaration.ledger) slides off the top of frame onto the 3D map (join 23)
# Handoff frames from other builders (renders/tests/transitions/*.png) are used when they exist; each piece falls back
# to its own framing until then.
#   python3 tools/desk_b.py [piece ...]             render, encode -> renders/tests/transitions/<out>.mp4 (720p)
#   python3 tools/desk_b.py still piece t [t ...]   PNG stills at clip times (s) -> build/deskB/stills/
#   python3 tools/desk_b.py sheet                   contact sheet of all outputs -> renders/tests/transitions/deskB_sheet.jpg
import math, os, shutil, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vkit import *   # noqa: F401,F403
from vkit import EP, KIT
from kit import note, drawn_path, slip, Spline, FPS

B = os.path.join(EP, 'build', 'deskB')
IMG = os.path.join(B, 'img')
STILLS = os.path.join(B, 'stills')
OUT = os.path.join(EP, 'renders', 'tests', 'transitions')
for _d in (B, IMG, STILLS, OUT):
    os.makedirs(_d, exist_ok=True)
ARC = lambda f: os.path.join(EP, 'img', 'archival', f)
HAND = lambda f: os.path.join(OUT, f)                    # handoff frames written by the other builders
TEAL_INK = '#138c79'


# ================================================================ plumbing
def dstage(name, dur, grain=0.35, bg=True):
    S = stage(os.path.join('deskB', name), dur, grain=grain, bg=bg)
    S.name = name
    return S


def credit(s, x=104, y=1014, dark=True, fill='#cfc6b4', anchor='start'):
    """the mono source credit, inside the safe area, on a dark plate so it reads over anything"""
    w = len(s) * 10.1 + 24
    x0 = x - 12 if anchor == 'start' else x - w + 12
    return (f'<rect x="{x0:.0f}" y="{y - 21}" width="{w:.0f}" height="30" rx="3" fill="#0d0c09" opacity="{0.72 if dark else 0:.2f}"/>'
            + tag(x, y, s, 16, fill, anchor))


def page(href, x, y, w, h, rot=0.0, shadow_op=0.45, border=0, extra=''):
    """a document lying on the desk: soft shadow, the scan (optional cream border); rotation about its centre"""
    cx, cy = x + w / 2, y + h / 2
    o = f'<g transform="rotate({rot:.2f} {cx:.1f} {cy:.1f})">'
    o += f'<rect x="{x - border + 10:.1f}" y="{y - border + 16:.1f}" width="{w + 2 * border:.1f}" height="{h + 2 * border:.1f}" fill="#000" opacity="{shadow_op}" filter="url(#soft)"/>'
    if border:
        o += f'<rect x="{x - border:.1f}" y="{y - border:.1f}" width="{w + 2 * border:.1f}" height="{h + 2 * border:.1f}" fill="{CREAM}"/>'
    o += f'<image href="{href}" x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" preserveAspectRatio="none"/>{extra}</g>'
    return o


def rot_pt(px, py, cx, cy, deg):
    r = math.radians(deg)
    dx, dy = px - cx, py - cy
    return cx + dx * math.cos(r) - dy * math.sin(r), cy + dx * math.sin(r) + dy * math.cos(r)


def narration(name, segs):
    """the voice: segs are (stem, a, b) cuts of chapter WAVs or ('', seconds) of silence (declaration.narration)"""
    from declaration import narration as _n
    return _n(os.path.join('deskB', name), segs)


def render(S, frame, segs, out, sfx_vol=0.35):
    """frames -> the kit's finish (grain, vignette, sfx from events.json) -> narration mixed on top -> 720p test mp4"""
    S.write(frame)
    shutil.rmtree(os.path.join(S.dir, 'f'), ignore_errors=True)
    subprocess.run(['node', os.path.join(KIT, 'anim_render.mjs'), S.dir], check=True, capture_output=True)
    subprocess.run([sys.executable, os.path.join(KIT, 'encode.py'), S.dir, os.path.join(S.dir, 'silent.mp4')], check=True, capture_output=True)
    wav = narration(S.name, segs)
    clip = os.path.join(S.dir, 'clip.mp4')
    mix = (f'[1:a]aresample=44100,pan=stereo|c0=c0|c1=c0,apad[n];[0:a]volume={sfx_vol}[s];[n][s]amix=inputs=2:duration=first:normalize=0[a]'
           if S.sounds or S.bed else '[1:a]aresample=44100,pan=stereo|c0=c0|c1=c0,apad[a]')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(S.dir, 'silent.mp4'), '-i', wav, '-filter_complex', mix,
                    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', clip], check=True)
    dst = os.path.join(OUT, out)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', clip, '-vf', 'scale=1280:720:flags=lanczos', '-c:v', 'libx264', '-crf', '24',
                    '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', dst], check=True)
    return dst


def stills(S, frame, times):
    """only the frames at the given clip times, to PNG"""
    S.write(frame)
    d = os.path.join(S.dir, 'stills')
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d)
    for f in os.listdir(S.dir):
        if f.startswith('i') and os.path.splitext(f)[1] in ('.jpg', '.png'):
            os.link(os.path.join(S.dir, f), os.path.join(d, f))
    shutil.copy(os.path.join(S.dir, 'base.html'), d)
    lines = open(os.path.join(S.dir, 'frames.ndjson')).read().splitlines()
    idx = [min(len(lines) - 1, int(round(t * FPS))) for t in times]
    open(os.path.join(d, 'frames.ndjson'), 'w').write('\n'.join(lines[i] for i in idx) + '\n')
    subprocess.run(['node', os.path.join(KIT, 'anim_render.mjs'), d], check=True, capture_output=True)
    outs = []
    for f in os.listdir(STILLS):
        if f.startswith(S.name + '_'):
            os.remove(os.path.join(STILLS, f))
    for k, t in enumerate(times):
        p = os.path.join(STILLS, f'{S.name}_{t:06.2f}.png')
        shutil.copy(os.path.join(d, 'f', f'{k:04d}.png'), p)
        outs.append(p)
    return outs


def cached(name, fn):
    """a prepared working image in build/deskB/img (made once)"""
    p = os.path.join(IMG, name)
    if not os.path.exists(p):
        fn(p)
    return p


def shake(t, t0, amp=14, dur=0.3):
    """a short camera jolt after an impact, on twos"""
    if t < t0 or t > t0 + dur:
        return 0.0, 0.0
    u = (step12(t) - t0) / dur
    k = amp * (1 - u) ** 2
    return k * math.sin(u * 37.0), k * math.cos(u * 29.0) * 0.7


# ================================================================ USS Maine tease (ch 9)
def _journal(p):
    """the Journal extra with its torn edges cut free of the scan's black ground (alpha PNG)"""
    from scipy import ndimage as nd
    im = Image.open(ARC('ch09_new_york_evening_journal_maine_extra_1898-02-17.jpg')).convert('RGB')
    im = im.resize((2200, int(2200 * im.height / im.width)), Image.LANCZOS)
    L = np.asarray(im.convert('L'))
    dark = nd.binary_opening(L < 30, iterations=2)
    lab, _ = nd.label(dark)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bgm = nd.binary_dilation(np.isin(lab, list(edge)), iterations=2)
    im.putalpha(Image.fromarray(((~bgm) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)))
    im.save(p, optimize=True)


def _maine(p):
    """the wreck photograph without the glass plate's black border"""
    m = Image.open(ARC('ch09_wreck_of_maine_havana_1898.jpg')).convert('L')
    w, h = m.size
    c = m.crop((int(w * 0.058), int(h * 0.062), int(w * 0.948), int(h * 0.928)))
    c.resize((2000, int(2000 * c.height / c.width)), Image.LANCZOS).save(p, quality=90)


def maine():
    stem = 'ch09_back_to_the_question'
    W0 = Words(stem)
    a = W0.at('with a ship') - 0.4
    b = W0.end('newspaper') + 1.7
    Wd = Words(stem, t0=a)
    S = dstage('maine', b - a)
    mp, jp = cached('maine.jpg', _maine), cached('journal.png', _journal)
    mh, jh = S.img(mp), S.img(jp)
    MW, MH = 1160, 1160 * 1519 / 2000                      # the print, world px
    MX, MY, MR = 960 - MW / 2, 540 - MH / 2 - 10, -1.6
    JW = 780
    JH = JW * 2754 / 2200
    t_ship, t_cuba, t_or = Wd.at('ship'), Wd.end('Cuba'), Wd.at('Or')
    t_slam = Wd.at('newspaper') - 0.07                       # lands two frames before the word
    WRECK = rot_pt(MX + 0.70 * MW, MY + 0.60 * MH, 960, 530, MR)
    JC = (WRECK[0] - 60, WRECK[1] - 150)                   # where the paper lands (world centre)
    JR = 2.2
    JX, JY = JC[0] - JW / 2, JC[1] - JH / 2
    HEAD = rot_pt(JX + 0.535 * JW, JY + 0.272 * JH, JC[0], JC[1], JR)
    S.world.append('<g id="print"></g><g id="paper"></g>')
    S.over.append('<g id="ov"></g>')
    cam = Camera([(0.0, 960, 540, 0.98), (t_ship, 980, 545, 1.0), (t_cuba, WRECK[0] - 40, WRECK[1] - 30, 1.16),
                  (t_slam, JC[0], JC[1] - 40, 1.12), (t_slam + 0.25, JC[0], JC[1] - 40, 1.12),
                  (t_slam + 1.5, HEAD[0], HEAD[1] + 6, 1.68), (S.dur, HEAD[0] + 4, HEAD[1] + 8, 1.76)], wobble=1.2)
    S.sound('paper-handle-1', 0.05, 0.25)
    S.sound('paper_slap_soft', t_slam - 0.02, 0.9)
    S.sound('dry-thud', t_slam - 0.02, 0.6)

    def frame(t):
        h = {}
        s = 1.06 - 0.06 * ease_out(clamp(t / 0.45))
        op = 1.0
        h['print'] = g(960, 530, s, page(mh, MX - 960, MY - 530, MW, MH, MR, border=16), op=op)
        jp_ = ''
        if t >= t_slam - 0.25:
            k = math.floor((t - (t_slam - 0.25)) * 12 + 1e-6)          # 12 fps: three drawings in, then down
            sc, dy, rr = [(1.55, -260, -7.0), (1.3, -140, -3.0), (1.1, -40, 0.8), (1.0, 0, JR)][min(k, 3)]
            body = page(jh, JX - JC[0], JY - JC[1], JW, JH, 0.0, shadow_op=0.6 if k >= 3 else 0.35)
            jp_ = f'<g transform="translate({JC[0]:.1f},{JC[1] + dy:.1f}) rotate({rr:.2f}) scale({sc:.3f})">{body}</g>'
        h['paper'] = jp_
        sx, sy = shake(t, t_slam, 16, 0.32)
        o = credit('WRECK OF THE MAINE, HAVANA, 1898 · DETROIT PUBLISHING CO. · LIBRARY OF CONGRESS') if t < t_slam else \
            credit('NEW YORK EVENING JOURNAL, MAINE EXTRA NO. 6, FEB. 17, 1898 · LIBRARY OF CONGRESS')
        h['ov'] = o
        return {'t': {'CAM': f'translate({sx:.1f} {sy:.1f}) ' + cam.transform(t)}, 'h': h}
    return S, frame, [(stem, a, b)], 'maine_tease.mp4'


# ================================================================ Apology Resolution (ch 9)
def apology():
    stem = 'ch09_back_to_the_question'
    W0 = Words(stem)
    a = W0.at('In 1993') - 0.4
    b = W0.end('Native Hawaiians') + 0.4
    Wd = Words(stem, t0=a)
    S = dstage('apology', b - a)
    href = S.img(ARC('ch09_apology_resolution_pl103-150_1993.jpg'))
    K = 0.62                                               # world px per scan px
    PX, PY, PR = 960 - 1900 * K / 2, 150, 0.6
    PW, PH = 1900 * K, 2841 * K
    src = lambda x, y: rot_pt(PX + x * K, PY + y * K, PX + PW / 2, PY + PH / 2, PR)
    HEADER = src(1080, 145)
    LINE1 = src(1100, 414)
    U0, U1, UY = 1021, 1539, 467                           # "an apology to Native Hawaiians" (scan px, measured)
    LINE2 = src(1150, 452)
    S.world.append(page(href, PX, PY, PW, PH, PR, shadow_op=0.5))
    S.world.append(f'<g transform="rotate({PR} {PX + PW / 2:.1f} {PY + PH / 2:.1f})"><g id="mark"></g></g>')
    S.over.append('<g id="ov"></g>')
    t_93, t_hun, t_over = Wd.at('1993'), Wd.at('a hundred years'), Wd.at('overthrow')
    t_cong, t_apol, t_end = Wd.at('Congress'), Wd.at('apologized'), Wd.end('Native Hawaiians')
    cam = Camera([(0.0, 960, 600, 0.9), (t_93 + 0.15, HEADER[0], HEADER[1] + 30, 1.55), (t_hun, HEADER[0] - 6, HEADER[1] + 50, 1.58),
                  (t_over + 0.15, LINE1[0], LINE1[1], 1.72), (t_cong + 0.1, LINE1[0] + 20, LINE1[1] + 14, 1.76),
                  (t_apol + 0.25, LINE2[0], LINE2[1], 2.05), (S.dur, LINE2[0] + 4, LINE2[1] + 2, 2.16)], wobble=1.0)
    S.sound('paper-handle-2', 0.0, 0.2)

    def frame(t):
        tq = step12(t)
        m = ''
        u = clamp((tq - t_apol) / max(0.5, t_end - t_apol - 0.1))
        if u > 0:
            x0, x1, y = PX + U0 * K, PX + U1 * K, PY + UY * K
            m = drawn_path(f'M{x0:.1f},{y:.1f} C{x0 + 100:.1f},{y + 2:.1f} {x1 - 120:.1f},{y - 1:.1f} {x1:.1f},{y + 1:.1f}', u, TE, 4.2)
        return {'t': {'CAM': cam.transform(t)},
                'h': {'mark': m, 'ov': credit('PUBLIC LAW 103-150, NOV. 23, 1993 · 107 STAT. 1510 · U.S. GOVERNMENT PUBLISHING OFFICE')}}
    return S, frame, [(stem, a, b)], 'apology.mp4'


# ================================================================ the question card settles level (ch 9)
QPX, QPY, QL = 960, 455, 470                               # kit_reel.seg_b's balance: pivot and half-beam


def balance(tau, t, pops, s=1.0, lock=0.0):
    """kit_reel.seg_b's two-tablet balance, drawn at tilt tau (degrees, left side down); pops: (word, time) per tablet.
    lock 0..1 turns the pivot teal (the first time it settles)"""
    def card(word, sc):
        return g(0, 0, sc, f'<path d="{tablet(270, 80, 22)}" fill="#0d0c09" transform="translate(8,10)"/>'
                           f'<path d="{tablet(270, 80, 22)}" fill="{CREAM}"/>' + text(0, 24, word, 66, 'Abril', INK, 'middle'))
    PX, PY, L = QPX, QPY, QL
    th = math.radians(-tau)
    lx, ly = PX - L * math.cos(th), PY - L * math.sin(th)
    rx, ry = PX + L * math.cos(th), PY + L * math.sin(th)
    body = (f'<path d="M{PX - 90},{PY + 300} L{PX + 90},{PY + 300} L{PX},{PY + 6} z" fill="{BONE_D}"/>'
            f'<path d="M{PX},{PY + 6} L{PX + 90},{PY + 300} L{PX + 30},{PY + 300} z" fill="#a89f8e"/>'
            f'<rect x="{PX - 170}" y="{PY + 300}" width="340" height="26" fill="{BONE_D}"/>'
            f'<g transform="rotate({-tau:.2f} {PX} {PY})"><rect x="{PX - L - 10}" y="{PY - 9}" width="{2 * L + 20}" height="18" rx="9" fill="{TE}"/></g>'
            f'<circle cx="{PX}" cy="{PY}" r="20" fill="{CREAM}"/><circle cx="{PX}" cy="{PY}" r="{8 + 4 * lock:.1f}" fill="{INK if lock < 0.5 else TE_D}"/>')
    for (ex, ey), (word, tw) in zip(((lx, ly), (rx, ry)), pops):
        cs = pop(t, tw, 0.32) if tw is not None else 1.0
        if cs > 0:
            ty = ey + 190
            body += (f'<path d="M{ex - 180:.1f},{ty - 80:.1f} L{ex:.1f},{ey:.1f} L{ex + 180:.1f},{ty - 80:.1f}" fill="none" '
                     f'stroke="{BONE_D}" stroke-width="4" opacity="{min(1, cs):.3f}"/>')
            body += g(ex, ty, 1.0, card(word, cs))
    return f'<g transform="translate({PX},{PY + 120}) scale({s:.4f}) translate({-PX},{-PY - 120})">{body}</g>'


def question():
    stem = 'ch09_back_to_the_question'
    W0 = Words(stem)
    a = W0.at('So, betrayal') - 0.3
    b = W0.at('Except the asking') - 0.04                   # join 24 (the window) takes over on "Except"
    Wd = Words(stem, t0=a)
    S = dstage('question_level', b - a)
    S.over.append('<g id="ov"></g>')
    t_in, t_b, t_e, t_both = 0.04, Wd.at('betrayal'), Wd.at('expression'), Wd.at('both')

    def rock(t):                             # seg B's motion: tips on "betrayal", then rocks and never settles
        if t < t_b:
            return 0.0
        if t < t_e:
            return 7 * back_out((t - t_b) / 0.55, 1.3)
        return 7 * math.cos(2 * math.pi * (t - t_e) / 2.6) * (0.75 + 0.25 * math.exp(-(t - t_e)))
    # ... until "both": from its angle and speed there, a damped swing that comes to rest level
    tb = t_both - 0.08
    x0 = rock(tb)
    v0 = (rock(tb + 0.01) - rock(tb - 0.01)) / 0.02
    zeta, wn = 0.42, 2 * math.pi / 0.95
    wd = wn * math.sqrt(1 - zeta ** 2)
    A_, B_ = x0, (v0 + zeta * wn * x0) / wd

    def tilt(t):
        if t < tb:
            return rock(t)
        d = t - tb
        v = math.exp(-zeta * wn * d) * (A_ * math.cos(wd * d) + B_ * math.sin(wd * d))
        return v if d < 2.2 else 0.0
    t_lock = tb + 1.5
    S.sound('block_tap_soft', t_lock, 0.5)

    def frame(t):
        s = pop_s(t, t_in, 0.4)
        lock = clamp((step12(t) - t_lock) / 0.17)
        o = balance(tilt(t), t, (('BETRAYAL', None), ('EXPRESSION', None)), s, lock)
        o += text(960, 170, 'THE QUESTION THIS SERIES ASKS', 24, 'Plex', TAG, 'middle', extra='letter-spacing="3"')
        z = 1 + 0.045 * ease_io(clamp((t - t_both) / (S.dur - t_both)))       # a slow push while it holds level
        o = f'<g transform="translate(960,560) scale({z:.4f}) translate(-960,-560)">{o}</g>'
        return {'h': {'ov': o}}
    return S, frame, [(stem, a, b)], 'question_level.mp4'


# ================================================================ the Cleveland and Dole holds (ch 6)
def _hold(key, name, a, b, t_card_end, z_rate):
    """a qcard card held in its last frame, the card's slow push carried on at the same rate"""
    import qcard
    S, f0, stem, ca, cb = qcard.build(key)
    S.dur = b - a
    S.name = name
    S.dir = os.path.join(B, name)
    os.makedirs(S.dir, exist_ok=True)
    last = f0(cb - ca - 1 / FPS)['h']['ov']
    z0 = 1.03

    def frame(t):
        z = (z0 + z_rate * t) / z0
        return {'h': {'ov': f'<g transform="translate(960,540) scale({z:.4f}) translate(-960,-540)">{last}</g>'}}
    return S, frame, stem


def holds():
    """two clips joined with a hard cut: the Cleveland card on "Washington's answer was no.", the Dole card on
    "Dole refused." (pure holds; the joke is the stillness)"""
    stem = 'ch06_the_heist'
    W0 = Words(stem)
    a1 = W0.at('For a moment') - 0.3
    cut = W0.at('Dole refused') - 0.06
    b2 = W0.at('On July 4th') - 0.1
    import qcard
    parts = []
    for key, name, a, b in (('cleveland', 'hold_cleveland', a1, cut), ('dole', 'hold_dole', cut, b2)):
        c = qcard.CARDS[key]
        ca = W0.at(c['start']) - 0.35
        cb = W0.end(c['end']) + c.get('hold', 1.2)
        S, frame, _ = _hold(key, name, a, b, cb, 0.03 / (cb - ca))
        parts.append((S, frame, a, b))
    return parts, stem, a1, b2, 'ch06_holds.mp4'


def render_holds():
    parts, stem, a1, b2, out = holds()
    clips = []
    for S, frame, a, b in parts:
        S.write(frame)
        shutil.rmtree(os.path.join(S.dir, 'f'), ignore_errors=True)
        subprocess.run(['node', os.path.join(KIT, 'anim_render.mjs'), S.dir], check=True, capture_output=True)
        subprocess.run([sys.executable, os.path.join(KIT, 'encode.py'), S.dir, os.path.join(S.dir, 'silent.mp4')], check=True, capture_output=True)
        clips.append(os.path.join(S.dir, 'silent.mp4'))
    wav = narration('hold_cleveland', [(stem, a1, b2)])
    lst = os.path.join(B, 'holds_list.txt')
    open(lst, 'w').write(''.join(f"file '{c}'\n" for c in clips))
    dst = os.path.join(OUT, out)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-i', wav, '-map', '0:v', '-map', '1:a',
                    '-vf', 'scale=1280:720:flags=lanczos', '-c:v', 'libx264', '-crf', '24', '-preset', 'slow', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', dst], check=True)
    return dst


# ================================================================ the petition light table (ch 8, the hero; join 20)
# Rebuild of the Hawaiʻi sample s3 with this episode's four Kuʻē pages (NARA RG 46 via Commons), bone and teal only.
# Beats: the table wide ("In 1897"), the loupe lands on the Hawaiian heading (KUE) and reads across to PETITION AGAINST
# ANNEXATION, underlined on "against annexation"; down to the names ("one petition alone gathered"), the count runs as
# it reads them, ticking each row ("21,269"); the camera glides to the tally sheet, where the same total is written in
# their own hand, and a loop goes round it; pull back, and the pages stack up under the signature page ("on 556
# pages"); the camera tips down to the stack's side and closes on its edge, the light falling, and dissolves into the
# Senate desk's first frame (20_senate_edge_start.png) when it exists.
KUE_PAGES = {k: f'kue_{k}.jpg' for k in ('cover_womens_memorial', 'signatures_men', 'signatures_women', 'tally_21269')}
KUE_CROP = {'cover_womens_memorial': (39, 1861, 40, 2904), 'signatures_men': (50, 1850, 42, 3046),
            'signatures_women': (51, 1866, 39, 3023), 'tally_21269': (48, 1867, 42, 2899)}   # the paper inside each scan


def _kue(key):
    """a petition page cropped to its paper and toned part way to bone (the quiet palette)"""
    def mk(p):
        from PIL import ImageOps
        x0, x1, y0, y1 = KUE_CROP[key]
        im = Image.open(ARC(f'ch08_kue_petition_{key}_1897.jpg')).convert('RGB').crop((x0 + 3, y0 + 3, x1 - 3, y1 - 3))
        gr = ImageOps.colorize(ImageOps.autocontrast(im.convert('L'), cutoff=0.5), black='#2b2620', white='#efe8da', mid='#a39a88')
        Image.blend(im, gr, 0.45).save(p, quality=90)
    return cached(KUE_PAGES[key], mk)


def _edge_bands(total, seed=20):
    """the stack's side, sheet by sheet from the bottom: (height, grey, dark gap below) in world px, the greys taken
    from the Senate desk's stack (20_senate_edge_start.png: mean about 184,182,172; bands 10 to 60 px)"""
    import random
    r = random.Random(seed)
    out, y = [], 0.0
    while y < total:
        h = r.uniform(2.6, 9.5) if r.random() < 0.75 else r.uniform(9.5, 14)
        v = r.uniform(150, 212)
        gap = r.random() < 0.16
        out.append((h, v, gap, r.uniform(0, 26), r.random() < 0.3))
        y += h
    return out


def petition():
    stem = 'ch08_under_protest'
    W0 = Words(stem)
    a = W0.at('In 1897') - 0.6
    b = W0.at('The treaty') + 0.6                          # the Senate desk takes over on "The treaty never got the votes"
    Wd = Words(stem, t0=a)
    S = dstage('petition', b - a, grain=0.3)
    S.world.clear()
    S.over.append('<g id="dimov"></g><g id="ov"></g>')
    hrefs = {k: S.img(_kue(k)) for k in KUE_PAGES}
    lt = S.img(os.path.join(KIT, '..', 'img', 'lighttable.jpg'))
    # ---- layout (world px)
    MK, MX, MY = 0.5, 1350.0, 330.0                         # the men's signature page: the hero
    MW, MH = 1794 * MK, 2998 * MK
    Y0 = MY + MH                                           # its front edge: the stack's side hangs here
    m_src = lambda x, y: (MX + (x - 53) * MK, MY + (y - 45) * MK)        # scan px -> world
    TK, TR = 0.47, 1.2
    TW, TH = 1813 * TK, 2851 * TK
    TX, TY = 2002.0, -170.0
    TC = (TX + TW / 2, TY + TH / 2)
    t_src = lambda x, y: rot_pt(TX + (x - 51) * TK, TY + (y - 45) * TK, TC[0], TC[1], TR)
    T_FULL = 250.0                                         # 556 pages at about 0.1 mm a sheet on a 33 cm page
    bands = _edge_bands(T_FULL)
    PHI0, PHI1 = 24.0, 78.0                                 # tilt while the stack grows, and at the end
    KUE = m_src(545, 140)
    ENG0, ENG1 = m_src(1247, 140), m_src(1727, 140)
    UL = (m_src(1247, 181), m_src(1727, 181))               # under "AGAINST ANNEXATION."
    ROW = lambda i: m_src(1240, 1012 + 84 * (i - 1))         # the second names column, rows 25 to 48
    TICK_X = m_src(1040, 0)[0]
    TOTAL = t_src(1537, 2874)                               # "21,269" in the tally's own hand
    # ---- the table: light box (toned toward bone), the four pages
    tbl = (f'<image href="{lt}" x="-200" y="-120" width="3800" height="2407" preserveAspectRatio="none"/>'
           f'<rect x="-200" y="-120" width="3800" height="2407" fill="{BONE}" opacity="0.22"/>'
           + page(hrefs['signatures_women'], 560, 560, 1809 * 0.44, 2978 * 0.44, 2.0, shadow_op=0.22)
           + page(hrefs['cover_womens_memorial'], 170, 260, 1816 * 0.44, 2858 * 0.44, -3.2, shadow_op=0.22)
           + page(hrefs['tally_21269'], TX, TY, TW, TH, TR, shadow_op=0.22)
           + '<g id="tmark"></g>')
    top = (f'<rect id="mshadow" x="{MX + 8}" y="{MY + 12}" width="{MW}" height="{MH}" fill="#000" opacity="0.2" filter="url(#soft4)"/>'
           f'<image href="{hrefs["signatures_men"]}" x="{MX}" y="{MY}" width="{MW}" height="{MH}" preserveAspectRatio="none"/><g id="mmark"></g>')
    S.world.append(f'<g id="tbl">{tbl}</g><g id="top">{top}</g><g id="side"></g><g id="lens"></g>')
    # ---- times (clip s)
    t_97 = Wd.at('In 1897')
    t_sig, t_against, t_annex = Wd.at('signed petitions'), Wd.at('against annexation'), Wd.end('against annexation')
    t_one = Wd.at('and one petition')
    t_cnt, t_cnt1 = Wd.at('21,269'), Wd.end('21,269') - 0.05
    t_names, t_556, t_pages = Wd.at('names'), Wd.at('556'), Wd.end('pages')
    T_LAND, T_LIFT = t_sig - 0.35, t_cnt + 1.05
    t_grow0, t_grow1 = t_556 - 0.15, t_pages + 0.1
    t_tip0, t_tip1 = t_pages - 0.25, S.dur - 0.25
    t_fade = S.dur - 0.5                                     # the handoff dissolve
    SEN = HAND('20_senate_edge_start.png')
    sen = S.img(SEN) if os.path.exists(SEN) else None
    if sen:
        S.over.insert(0, f'<image id="sen" href="{sen}" x="0" y="0" width="1920" height="1080" opacity="0"/>')
        S.over[0], S.over[1] = S.over[1], S.over[0]          # the dim layer under it, the overlay text over it
    # ---- the loupe's path
    LENS = [(T_LAND, *KUE), (t_sig + 0.15, *KUE), (t_against - 0.05, *ENG0), (t_annex + 0.1, *m_src(1560, 140)),
            (t_one + 0.15, *m_src(1500, 600)), (t_cnt - 0.15, *ROW(1)), (T_LIFT, *ROW(10))]
    lx, ly = Spline([(p[0], p[1]) for p in LENS]), Spline([(p[0], p[2]) for p in LENS])
    R_L, MAG = 150, 1.8
    row_t = [t_cnt - 0.15 + (T_LIFT - t_cnt + 0.15) * (i - 1) / 9 for i in range(1, 11)]
    # ---- the camera
    side_c = lambda: (MX + MW * 0.52, Y0 - T_FULL * math.sin(math.radians(PHI1)) * 0.5)
    Z_END = 1080 / (T_FULL * math.sin(math.radians(PHI1))) * 1.06
    cam = Camera([(0.0, 1640, 1080, 0.58), (t_97 + 0.4, 1660, 1000, 0.63),
                  (T_LAND - 0.2, KUE[0] + 160, KUE[1] + 120, 1.12), (t_sig + 0.2, KUE[0] + 200, KUE[1] + 130, 1.15),
                  (t_against + 0.1, ENG0[0] + 120, ENG0[1] + 120, 1.18), (t_annex + 0.4, ENG0[0] + 180, ENG0[1] + 140, 1.2),
                  (t_cnt - 0.2, ROW(2)[0] - 60, ROW(2)[1] + 60, 1.16), (T_LIFT, ROW(9)[0] - 40, ROW(9)[1] + 40, 1.16),
                  (t_cnt1 - 0.15, TOTAL[0] - 120, TOTAL[1] - 40, 1.7), (t_names + 0.3, TOTAL[0] - 126, TOTAL[1] - 44, 1.74),
                  (t_556 + 0.2, MX + MW * 0.6, MY + MH * 0.62, 0.66), (t_tip0, MX + MW * 0.55, MY + MH * 0.72, 0.7),
                  (t_tip1, *side_c(), Z_END), (S.dur, side_c()[0] + 4, side_c()[1], Z_END * 1.01)], wobble=0.9)
    S.bed = ['hum-lighttable', 0.14]
    S.sound('paper-handle-2', 0.3, 0.2)
    S.sound('impact-wood-light', T_LAND + 0.3, 0.3)
    S.sound('pencil-write', t_against, 0.3)
    for k in range(10):
        S.sound('tick', row_t[k], 0.12)
    S.sound('pencil-write', t_cnt1 - 0.1, 0.3)
    for k in range(8):
        S.sound('paper-handle-1', t_grow0 + k * (t_grow1 - t_grow0) / 8, 0.1)

    def stack_t(t):
        """stack height (world px), on twos while it grows"""
        u = clamp((step12(t) - t_grow0) / (t_grow1 - t_grow0))
        return T_FULL * ease_out(u, 2)

    def phi(t):
        if t < t_grow0:
            return 0.0
        p = PHI0 * ease_io(clamp((t - t_grow0) / 0.6))
        return p + (PHI1 - PHI0) * ease_io(clamp((t - t_tip0) / (t_tip1 - t_tip0)))

    def marks_m(t, tq):
        o = ''
        u = clamp((tq - t_against) / max(0.5, t_annex - t_against))
        if u > 0:
            (x0, y0), (x1, y1) = UL
            o += drawn_path(f'M{x0:.1f},{y0:.1f} C{x0 + 80:.1f},{y0 + 3:.1f} {x1 - 90:.1f},{y1 - 1:.1f} {x1:.1f},{y1 + 2:.1f}', u, TE, 4.5)
        for i, tr in enumerate(row_t, 1):
            if tq >= tr:
                x, y = TICK_X, ROW(i)[1] + 6
                k = clamp((tq - tr) / 0.17)
                o += drawn_path(f'M{x - 10:.1f},{y - 4:.1f} L{x - 2:.1f},{y + 6:.1f} L{x + 16:.1f},{y - 14:.1f}', k, TE, 4)
        return o

    def marks_t(t, tq):
        u = clamp((tq - (t_cnt1 - 0.2)) / 0.6)
        if u <= 0:
            return ''
        return drawn_path(loop_path(TOTAL[0], TOTAL[1], 66, 26, seed=2.0), u, TE, 4.5)

    def lens(t, tq):
        lift = 1 - ease_out((t - T_LAND) / 0.4) if t < T_LIFT else ease_out((t - T_LIFT) / 0.4)
        if not (T_LAND - 0.25 < t < T_LIFT + 0.45):
            return ''
        cx, cy = lx(t), ly(t)
        rr = R_L * (1 + 0.25 * lift)
        al = 1 - lift
        sx, sy = cx + 16 + 50 * lift, cy + 22 + 70 * lift
        m = 1 + (MAG - 1) * al
        o = f'<circle cx="{sx:.1f}" cy="{sy:.1f}" r="{rr + 12:.1f}" fill="#000" opacity="{0.2 * al + 0.07:.2f}" filter="url(#soft)"/>'
        o += f'<clipPath id="lc"><circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rr:.1f}"/></clipPath>'
        o += (f'<g clip-path="url(#lc)"><rect x="{cx - rr:.1f}" y="{cy - rr:.1f}" width="{2 * rr:.1f}" height="{2 * rr:.1f}" fill="#f3efe6"/>'
              f'<g transform="translate({cx:.1f} {cy:.1f}) scale({m:.4f}) translate({-cx:.1f} {-cy:.1f})"><use href="#tbl"/><use href="#top"/></g>'
              f'<circle cx="{cx - rr * 0.35:.1f}" cy="{cy - rr * 0.4:.1f}" r="{rr * 0.55:.1f}" fill="#fff" opacity="0.07"/></g>')
        o += f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rr + 8:.1f}" fill="none" stroke="#1d1c1a" stroke-width="18"/>'
        o += (f'<path d="M{cx - (rr + 8) * 0.8:.1f},{cy - (rr + 8) * 0.6:.1f} A{rr + 8},{rr + 8} 0 0 1 {cx + (rr + 8) * 0.3:.1f},'
              f'{cy - (rr + 8) * 0.95:.1f}" fill="none" stroke="#6b6a66" stroke-width="4"/>')
        return o

    def side(T, ph):
        """the stack's side face: sheets from the bottom up, foreshortened by the tilt"""
        sp = math.sin(math.radians(ph))
        if T < 0.5 or sp < 0.01:
            return ''
        hs = T * sp
        o = f'<rect x="{MX + 30:.1f}" y="{Y0 - 4:.1f}" width="{MW}" height="{14 + hs * 0.4:.1f}" fill="#000" opacity="0.35" filter="url(#soft)"/>'
        o += f'<g transform="translate({MX:.1f},{Y0:.1f}) scale(1,{sp:.4f})">'
        o += f'<rect x="0" y="{-T:.2f}" width="{MW:.1f}" height="{T:.2f}" fill="#9c9a90"/>'
        y = 0.0
        for h, v, gap, inset, wedge in bands:
            if y >= T:
                break
            hh = min(h, T - y)
            c = f'rgb({v:.0f},{v - 2:.0f},{v - 11:.0f})'
            o += f'<rect x="{inset * 0.2:.1f}" y="{-(y + hh):.2f}" width="{MW - inset * 0.2:.1f}" height="{hh:.2f}" fill="{c}"/>'
            if wedge:
                o += f'<path d="M{inset:.1f},{-(y + hh):.2f} L{inset + 60:.1f},{-y:.2f} L{MW:.1f},{-y:.2f} L{MW:.1f},{-(y + hh * 0.35):.2f} z" fill="#000" opacity="0.12"/>'
            if gap:
                o += f'<rect x="0" y="{-(y + 0.45):.2f}" width="{MW:.1f}" height="0.9" fill="#151412"/>'
            y += h
        return o + '</g>'

    def frame(t):
        tq = step12(t)
        T = stack_t(t)
        ph = phi(t)
        c = math.cos(math.radians(ph))
        hs = T * math.sin(math.radians(ph))
        tilt = f'translate(0 {Y0:.1f}) scale(1 {c:.4f}) translate(0 {-Y0:.1f})'
        h = {'mmark': marks_m(t, tq), 'tmark': marks_t(t, tq), 'lens': lens(t, tq), 'side': side(T, ph)}
        o = ''
        # the count, over the signatures as the loupe reads them
        if t >= t_cnt - 0.1:
            n = int(round(21269 * ease_out(clamp((t - t_cnt) / (t_cnt1 - t_cnt)), 2.4)))
            op = 1 - clamp((t - t_tip0 - 0.3) / 0.4)
            if op > 0:
                lab = 'NAMES' + (' · 556 PAGES' if t >= t_556 else '')
                o += (f'<g opacity="{op:.3f}"><rect x="110" y="800" width="560" height="176" fill="#111" opacity="0.82"/>'
                      + text(390, 898, f'{n:,}', 100, 'Playfair', BONE, 'middle')
                      + (text(390, 946, lab, 24, 'Plex', '#d9d2c4', 'middle', extra='letter-spacing="3"') if t >= t_names - 0.05 else '') + '</g>')
        if T_LAND < t < t_cnt + 0.3:
            o += slip(1810, 1000, 'kūʻē: to oppose, to resist', 30, clamp((tq - T_LAND - 0.2) / 1.0), anchor='end', rot=1.2)
        cr = 'KŪʻĒ PETITIONS, 1897 · U.S. NATIONAL ARCHIVES, RG 46' + (' · STACK ILLUSTRATIVE' if t >= t_grow0 else '')
        o += f'<g opacity="{1 - clamp((t - t_tip0) / 0.4):.3f}">' + credit(cr) + '</g>'
        # the light falls as the camera tips into the Senate's low light, then the dissolve into its first frame
        dim = 0.42 * ease_io(clamp((t - t_tip0) / (t_tip1 - t_tip0)))
        hd = {'dimov': f'<rect width="1920" height="1080" fill="#0d0c09" opacity="{dim:.3f}"/>', 'ov': o}
        h.update(hd)
        ret = {'t': {'CAM': cam.transform(t), 'tbl': tilt, 'top': f'translate(0 {-hs:.2f}) ' + tilt}, 'h': h}
        if sen:
            ret['o'] = {'sen': f'{ease_io(clamp((t - t_fade) / 0.45)):.3f}'}
        return ret
    return S, frame, [(stem, a, b)], '20_petition_table.mp4'


# ================================================================ the abdication (ch 8, join 21)
# The scan: Hawaiʻi State Archives, "Abdication Document", PNS-131, negative 21690 (ark:70111/4ZpP): page 2 of the
# January 24, 1895 statement ("... forever abdicate, renounce and release ... all claims ... to the late throne of
# Hawaii ..."), her signature "Liliuokalani Dominis" up the margin (sources: build/deskB/abdication_has/SOURCES.txt).
# It opens as the paper on her writing table in the re-lit room (21_room_paper_end.png, the lead's), matched by the
# rectangle PAPER, and becomes the scan on the desk; the camera straightens and reads it: a teal line beside the
# signature on "signed", under "throne" on "throne". Quiet palette.
PAPER = dict(cx=960, cy=540, h=648, rot=-4.0)               # the paper in the handoff frame (fallback until it exists)


def _abdication(p):
    from PIL import ImageOps
    im = Image.open(os.path.join(B, 'abdication_has', 'has_PNS-131-21690.jpeg')).convert('L').crop((1260, 1000, 4640, 6040))
    im = im.resize((1700, int(1700 * im.height / im.width)), Image.LANCZOS)
    ImageOps.colorize(ImageOps.autocontrast(im, cutoff=0.7), black='#2b2620', white=BONE, mid='#9a9384').save(p, quality=90)


def abdication():
    stem = 'ch08_under_protest'
    W0 = Words(stem)
    a = W0.at('as a prisoner') - 0.15
    b = W0.at('Then a military') - 0.04                       # the sentence card takes over
    Wd = Words(stem, t0=a)
    S = dstage('abdication', b - a, grain=0.3)
    S.over.append('<g id="ov"></g>')
    href = S.img(cached('abdication.jpg', _abdication))
    PHh = PAPER['h']
    PWw = PHh * 1700 / 2534
    PXx, PYy, R = PAPER['cx'] - PWw / 2, PAPER['cy'] - PHh / 2, PAPER['rot']
    k = PHh / 2534                                           # world px per crop px
    src = lambda x, y: rot_pt(PXx + x * k, PYy + y * k, PAPER['cx'], PAPER['cy'], R)
    HANDOFF = HAND('21_room_paper_end.png')
    hand = S.img(HANDOFF) if os.path.exists(HANDOFF) else None
    S.world.append(f'<g transform="rotate({R} {PAPER["cx"]} {PAPER["cy"]})">'
                   f'<rect x="{PXx + 8:.1f}" y="{PYy + 12:.1f}" width="{PWw:.1f}" height="{PHh}" fill="#000" opacity="0.5" filter="url(#soft4)"/>'
                   f'<rect x="{PXx:.1f}" y="{PYy:.1f}" width="{PWw:.1f}" height="{PHh}" fill="{BONE}"/>'
                   f'<image id="scan" href="{href}" x="{PXx:.1f}" y="{PYy:.1f}" width="{PWw:.1f}" height="{PHh}" preserveAspectRatio="none" opacity="0"/>'
                   f'<g id="marks"></g></g>')
    if hand:
        S.over.insert(0, f'<image id="hand" href="{hand}" x="0" y="0" width="1920" height="1080"/>')
    t_sig, t_sig1, t_thr, t_thr1 = Wd.at('signed'), Wd.end('signed away'), Wd.at('throne'), Wd.end('throne')
    SIG = src(250, 990)
    THR = src(430, 1600)
    cam = Camera([(0.0, PAPER['cx'], PAPER['cy'], 1.0, 0.0), (0.35, PAPER['cx'], PAPER['cy'], 1.01, 0.0),
                  (t_sig + 0.1, *SIG, 2.2, -R), (t_thr - 0.1, THR[0] - 10, THR[1] - 60, 2.45, -R),
                  (S.dur, THR[0] - 14, THR[1] - 50, 2.55, -R)], wobble=0.8)
    S.sound('paper-handle-1', 0.1, 0.2)
    S.sound('pencil-write', t_sig, 0.25)

    def frame(t):
        tq = step12(t)
        m = ''
        u = clamp((tq - t_sig) / max(0.5, t_sig1 - t_sig))
        if u > 0:                                   # beside the signature (it runs up the margin)
            x0, y0 = PXx + 252 * k, PYy + 560 * k
            m += drawn_path(f'M{x0:.1f},{y0:.1f} C{x0 + 1.5:.1f},{y0 + 60:.1f} {x0 - 1:.1f},{y0 + 160:.1f} {x0 + 1:.1f},{PYy + 1420 * k:.1f}', u, TE, 2.6)
        u = clamp((tq - t_thr) / max(0.4, t_thr1 - t_thr + 0.1))
        if u > 0:
            x0, x1, y = PXx + 318 * k, PXx + 536 * k, PYy + 1752 * k
            m += drawn_path(f'M{x0:.1f},{y:.1f} C{x0 + 20:.1f},{y + 1.5:.1f} {x1 - 30:.1f},{y - 1:.1f} {x1:.1f},{y + 0.5:.1f}', u, TE, 2.6)
        o = credit("LILIʻUOKALANI'S ABDICATION, JANUARY 24, 1895, PAGE 2 · HAWAIʻI STATE ARCHIVES, PNS-131")
        ret = {'t': {'CAM': cam.transform(t)}, 'o': {'scan': f'{ease_io(clamp((t - 0.05) / 0.45)):.3f}'}, 'h': {'marks': m, 'ov': o}}
        if hand:
            ret['o']['hand'] = f'{1 - ease_io(clamp((t - 0.05) / 0.4)):.3f}'
        return ret
    return S, frame, [(stem, a, b)], '21_abdication.mp4'


# ================================================================ James Dole and the fruit-cup payoff (ch 6, join 19)
# Opens on the pineapple from the fields (19_pineapple_end.png, the sets builder's: a pineapple centred, about 60% of
# frame height), matched by a vector pineapple of the same size and place that dissolves across; three chops on twos
# (the crown flies off, the body slices, the slices cube), the cubes drop into the plain fruit cup from the Dole card
# and the lid snaps on as "fruit cups" is said; the cup slides to the spot it held on the Dole card (1260, 760) as
# James Dole's name card pops in where Sanford's portrait sat. No period can label is shown: none before the 1930s.
PINE = dict(cx=960, cy=540, h=648)                          # the pineapple in the handoff frame (crown tip to base)
CUP_BIG = (960, 1010, 1.5)                                  # the cup while the pineapple is cubed: base x, y, scale
CUP_CARD = (1260, 760, 1.0, 3.0)                            # where the Dole card had it (qcard.build_name)
CUBES = ((-98, -88, OR, -8), (-46, -80, '#ffc857', 6), (6, -92, OR, 12), (54, -84, '#ffc857', -5),
         (-80, -136, '#ffc857', 15), (-24, -130, OR, -10), (30, -138, '#ffc857', 4), (70, -128, OR, 18),
         (-60, -180, OR, 3), (0, -176, '#ffc857', -14), (48, -184, OR, 9))          # qcard.fruit_cup's cubes


def pineapple_body(w, h):
    """the fruit without its crown, centred on 0,0: gold, a diamond lattice, eyes, a shaded side"""
    rx, ry = w / 2, h / 2
    lat = ''.join(f'<path d="M{-rx * 2 + i * 44:.0f},{-ry} l{ry * 1.2:.0f},{2 * ry}" stroke="{OR_D}" stroke-width="5" opacity="0.7"/>'
                  f'<path d="M{rx * 2 - i * 44:.0f},{-ry} l{-ry * 1.2:.0f},{2 * ry}" stroke="{OR_D}" stroke-width="5" opacity="0.7"/>'
                  for i in range(0, 12))
    eyes = ''.join(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="5" fill="#8a4d0a" opacity="0.6"/>'
                   for x in range(int(-rx), int(rx), 44) for y in range(int(-ry) + 22, int(ry), 46))
    return (f'<clipPath id="pbc"><ellipse rx="{rx}" ry="{ry}"/></clipPath>'
            f'<ellipse rx="{rx}" ry="{ry}" fill="#ffc857"/><g clip-path="url(#pbc)">{lat}{eyes}'
            f'<ellipse cx="{rx * 0.55:.0f}" rx="{rx * 0.7:.0f}" ry="{ry * 1.1:.0f}" fill="{OR}" opacity="0.45"/>'
            f'<ellipse cx="{-rx * 0.45:.0f}" cy="{-ry * 0.35:.0f}" rx="{rx * 0.22:.0f}" ry="{ry * 0.4:.0f}" fill="#fff" opacity="0.18"/></g>'
            f'<ellipse rx="{rx}" ry="{ry}" fill="none" stroke="{INK}" stroke-width="5" opacity="0.5"/>')


def pineapple_crown(h):
    """spiky leaves in the explainer's teals, base at 0,0"""
    o = ''
    for ang, ln, c in ((-38, 0.62, '#16675b'), (38, 0.62, '#16675b'), (-22, 0.85, TE_D), (22, 0.85, TE_D),
                       (-8, 1.0, TE), (8, 0.95, TE_D), (0, 0.8, '#16675b')):
        L = h * ln
        o += (f'<path d="M-16,8 Q-10,{-L * 0.5:.0f} 0,{-L:.0f} Q10,{-L * 0.5:.0f} 16,8 z" fill="{c}" stroke="{INK}" stroke-width="3" '
              f'stroke-opacity="0.35" transform="rotate({ang})"/>')
    return o


def dole():
    import qcard
    stem = 'ch06_the_heist'
    W0 = Words(stem)
    a = W0.at('is where the name') - 0.05                    # pineapple.py's T_END: the fields hand over here
    b = W0.at('the United States to officially') - 0.3       # the ANNEXATION card's lead-in
    Wd = Words(stem, t0=a)
    S = dstage('dole_payoff', b - a)
    S.over.append('<g id="ov"></g>')
    HANDOFF = HAND('19_pineapple_end.png')
    hand = S.img(HANDOFF) if os.path.exists(HANDOFF) else None
    if hand:
        S.over.insert(0, f'<image id="hand" href="{hand}" x="0" y="0" width="1920" height="1080"/>')
    # the pineapple: crown 38% of its height, body 62%
    Hh = PINE['h']
    BH, CH = Hh * 0.62, Hh * 0.42
    BW = BH * 0.74
    top = PINE['cy'] - Hh / 2
    BCY = top + Hh - BH / 2                                  # body centre
    CBY = BCY - BH / 2 + 18                                  # crown base
    S.defs.append(f'<g id="pbody">{pineapple_body(BW, BH)}</g><g id="pcrown">{pineapple_crown(CH)}</g>')
    # the portrait (qcard's name-card builders)
    psvg, PH = qcard.portrait_svg('james', dict(path=ARC('ch06_james_d_dole_1927.jpg'), frac=(0.14, 0.05, 0.86, 0.62), cuts=[30, 55, 80],
                                               clahe=1.5), False)
    PW_ = qcard.PW
    PH = min(PH, 600)
    S.defs.append(f'<clipPath id="pclip"><path d="{slab(PW_, PH, 34)}"/></clipPath><g id="portrait">{psvg}</g>')
    PX, PY = 960 - PW_ / 2 - 330, 470 - PH / 2 - 70
    CX1, CY1 = PX + PW_ / 2, PY + PH / 2
    t_c = [0.32 + k / 6 for k in range(3)]                   # three chops, two drawings apart
    t_fall = t_c[2] + 0.1
    t_cups = Wd.at('fruit cups')
    t_lid = min(t_cups, t_fall + 0.55)
    t_slide = Wd.at('cups comes from') + 0.15
    t_por = t_slide + 0.1
    S.sound('scrape', t_c[0] - 0.03, 0.4)
    S.sound('scrape', t_c[1] - 0.03, 0.35)
    S.sound('scrape', t_c[2] - 0.03, 0.35)
    S.sound('block_tap_soft', t_fall + 0.38, 0.5)
    S.sound('tape_press', t_lid, 0.5)
    S.sound('card_slide_soft', t_slide, 0.4)
    cbx, cby, cbs = CUP_BIG
    # each cube's start (inside the body) and end (its place in the cup, big)
    starts = [(PINE['cx'] + (i % 4 - 1.5) * BW * 0.24, BCY + (i // 4 - 1) * BH * 0.28) for i in range(len(CUBES))]
    ends = [(cbx + (x + 23) * cbs, cby + (y + 20) * cbs) for x, y, c, r in CUBES]

    def cup_empty():
        return (shadow(150, 4) + f'<path d="M-104,0 L104,0 L134,-226 L-134,-226 Z" fill="{CREAM}" opacity="0.16"/>'
                + f'<path d="M-104,0 L104,0 L134,-226 L-134,-226 Z" fill="none" stroke="{CREAM}" stroke-width="6" stroke-linejoin="round"/>')

    def frame(t):
        tq = step12(t)
        o = ''
        k = sum(1 for c in t_c if tq >= c)                  # chops made
        # the cup rises in under the fruit (smooth), then glides to its place from the Dole card
        cu = ease_out(clamp((t - t_c[1]) / 0.35))
        if cu > 0:
            sl = ease_io(clamp((t - t_slide) / 0.65))
            x = cbx + (CUP_CARD[0] - cbx) * sl
            y = cby + 380 * (1 - cu) + (CUP_CARD[1] - cby) * sl
            s = cbs + (CUP_CARD[2] - cbs) * sl
            rot = CUP_CARD[3] * sl
            body = qcard.fruit_cup() if t >= t_lid else cup_empty()
            if t >= t_lid:                                    # the lid snaps on (a little pop)
                s *= 1 + 0.06 * (1 - clamp((tq - t_lid) / 0.17))
            o += g(x, y, s, body, rot=rot)
        if k == 0:                                           # the whole pineapple
            o += f'<use href="#pcrown" transform="translate({PINE["cx"]},{CBY:.1f})"/><use href="#pbody" transform="translate({PINE["cx"]},{BCY:.1f})"/>'
        else:
            # the crown flies off up and right after the first chop
            u = clamp((t - t_c[0]) / 0.6)
            if u < 1:
                o += (f'<g opacity="{1 - u:.3f}" transform="translate({PINE["cx"] + 420 * u:.1f},{CBY - 260 * u + 380 * u * u:.1f}) '
                      f'rotate({70 * u:.1f})"><use href="#pcrown"/></g>')
            if k < 3:                                         # the body in k+1 slices, drifting apart
                n = k + 1
                for j in range(n):
                    y0 = -BH / 2 + BH * j / n
                    dy = (j - (n - 1) / 2) * 14
                    o += (f'<clipPath id="sl{j}"><rect x="{-BW}" y="{y0:.1f}" width="{2 * BW}" height="{BH / n:.1f}"/></clipPath>'
                          f'<g transform="translate({PINE["cx"]},{BCY + dy:.1f})"><g clip-path="url(#sl{j})"><use href="#pbody"/></g></g>')
            elif t < t_lid:                                    # cubes, falling into the cup on twos
                for i, ((x, y, c, r), (sx, sy), (ex, ey)) in enumerate(zip(CUBES, starts, ends)):
                    u = clamp((tq - t_fall - i * 0.025) / 0.4)
                    px = sx + (ex - sx) * ease_io(u)
                    py = sy + (ey - sy) * u * u
                    o += g(px, py, cbs, f'<rect x="-23" y="-20" width="46" height="40" rx="9" fill="{c}"/>', rot=r * u + 25 * (1 - u) * (i % 2 * 2 - 1))
            # the chop: a cream slash for two drawings
            for j, c in enumerate(t_c):
                if c <= tq < c + 1 / 6:
                    yy = [CBY - 4, BCY - BH * 0.17, BCY + BH * 0.17][j]
                    o += f'<path d="M{PINE["cx"] - BW * 0.9:.0f},{yy + 30:.0f} L{PINE["cx"] + BW * 0.9:.0f},{yy - 30:.0f}" stroke="{CREAM}" stroke-width="9" stroke-linecap="round"/>'
        # James Dole's name card, where Sanford's portrait sat on his card
        s = pop_s(t, t_por, 0.45)
        if s > 0:
            grp = (f'<path d="{slab(PW_, PH, 34)}" fill="#0d0c09" transform="translate({PX + 10},{PY + 12})"/>'
                   f'<g transform="translate({PX},{PY})"><g clip-path="url(#pclip)"><use href="#portrait"/></g>'
                   f'<path d="{slab(PW_, PH, 34)}" fill="none" stroke="{TE}" stroke-width="6"/></g>')
            tn = t_por + 0.25
            if t >= tn:
                grp += highlight(PX - 10, PY + PH + 80, 'JAMES DOLE', 50, prog=(tq - tn) / 0.27)
            ts = t_por + 0.5
            if t >= ts:
                grp += f'<g opacity="{clamp((t - ts) / 0.3):.3f}">' + tag(PX, PY + PH + 132, "SANFORD DOLE'S COUSIN · STARTED GROWING PINEAPPLES", 19, TAG) + '</g>'
            rot = -4 * (1 - clamp((t - t_por) / 0.45))
            o += f'<g transform="translate({CX1:.1f},{CY1:.1f}) rotate({rot:.2f}) scale({s:.4f}) translate({-CX1:.1f},{-CY1:.1f})">{grp}</g>'
            o += f'<g opacity="{clamp((t - t_por) / 0.3):.3f}">' + credit('PORTRAIT: JAMES D. DOLE, 1927 · HARTSOOK · LIBRARY OF CONGRESS, BAIN COLL. (TRACED)', dark=False, fill='#8d857a') + '</g>'
        z = 1 + 0.025 * clamp(t / S.dur)
        o = f'<g transform="translate(960,540) scale({z:.4f}) translate(-960,-540)">{o}</g>'
        ret = {'h': {'ov': o}}
        if hand:
            ret['o'] = {'hand': f'{1 - ease_io(clamp((t - 0.04) / 0.3)):.3f}'}
        return ret
    return S, frame, [(stem, a, b)], '19_dole_payoff.mp4'


# ================================================================ the Ledger slides off (ch 9, join 23)
# The Ledger (declaration.ledger) held in its last frame through "The harbor the Admiral wanted ... forty-three years
# later its name would be ...", the camera easing toward the "did" column ("took a kingdom's harbor"); on "Pearl
# Harbor" the whole sheet, desk and all, slides off the top of frame, a plain smooth move, uncovering the 3D map's first
# frame (23_pearl_start.png, the 3D-map builder's) or the dark desk until it exists.
def ledger_off():
    import declaration
    stem = 'ch09_back_to_the_question'
    W0 = Words(stem)
    SL, f0, segs0, durL = declaration.ledger()
    aL = segs0[0][1]
    a = aL + durL                                            # where the Ledger clip ends
    b = W0.at('Pearl Harbor') + 1.3
    Wd = Words(stem, t0=a)
    S = dstage('ledger_off', b - a, bg=False)
    pearl = HAND('23_pearl_start.png')
    if os.path.exists(pearl):
        S.world.append(f'<image href="{S.img(pearl)}" x="0" y="0" width="1920" height="1080"/>')
    else:
        S.world.append(desk())
    last = f0(durL - 1 / FPS)['h']['ov']
    S.defs.append('<linearGradient id="slsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.55"/>'
                  '<stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>')
    S.over.append('<g id="slide"></g>')
    t_s = Wd.at('Pearl Harbor') - 0.4
    D = 0.85
    S.sound('card_slide_soft', t_s, 0.4)

    def frame(t):
        u = clamp((t - (t_s - 0.0)) / D)
        dy = -1240 * ease_io(u)
        p = ease_io(clamp(t / max(0.5, t_s - 0.1)))           # the hold drifts toward the "did" column
        z = 1 + 0.035 * p
        cx, cy = 960 + 120 * p, 430 + 10 * p
        body = (f'<rect width="1920" height="1080" fill="url(#desk)"/>'
                f'<g transform="translate({cx:.1f},{cy:.1f}) scale({z:.4f}) translate(-960,-430)">{last}</g>')
        body = desk() + body[body.index('<g transform'):] if True else body
        o = ''
        if u > 0:
            o += f'<rect x="0" y="{1080 + dy:.1f}" width="1920" height="90" fill="url(#slsh)"/>'
        o += f'<g transform="translate(0,{dy:.1f})">{body}</g>'
        return {'h': {'slide': o}}
    return S, frame, [(stem, a, b)], '23_ledger_off.mp4'


PIECES = dict(maine=maine, apology=apology, question=question, petition=petition, abdication=abdication, dole=dole, ledger_off=ledger_off)


def sheet():
    """one row of frames per output clip"""
    names = ['19_dole_payoff', 'ch06_holds', '20_petition_table', '21_abdication', 'apology', 'maine_tease', 'question_level', '23_ledger_off']
    rows = []
    for n in names:
        p = os.path.join(OUT, n + '.mp4')
        if not os.path.exists(p):
            continue
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p],
                                   capture_output=True, text=True).stdout)
        fr = []
        for k in range(6):
            t = dur * (k + 0.5) / 6
            q = os.path.join(B, f'_sheet_{k}.jpg')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', p, '-frames:v', '1', '-vf', 'scale=320:180', q], check=True)
            fr.append(Image.open(q).convert('RGB'))
        row = Image.new('RGB', (6 * 324 + 220, 184), (20, 18, 15))
        for k, im in enumerate(fr):
            row.paste(im, (220 + k * 324, 2))
        from PIL import ImageDraw
        ImageDraw.Draw(row).text((10, 80), n, fill=(230, 225, 215))
        rows.append(row)
    out = Image.new('RGB', (rows[0].width, 184 * len(rows)), (20, 18, 15))
    for i, r in enumerate(rows):
        out.paste(r, (0, i * 184))
    out.save(os.path.join(OUT, 'deskB_sheet.jpg'), quality=88)
    return os.path.join(OUT, 'deskB_sheet.jpg')


if __name__ == '__main__':
    args = sys.argv[1:]
    if args and args[0] == 'sheet':
        print(sheet())
        sys.exit()
    if args and args[0] == 'still':
        if args[1] == 'holds':
            parts = holds()[0]
            for S, frame, a, b in parts:
                for p in stills(S, frame, [float(x) for x in args[2:]]):
                    print(p)
            sys.exit()
        S, frame, segs, out = PIECES[args[1]]()
        for p in stills(S, frame, [float(x) for x in args[2:]]):
            print(p)
        sys.exit()
    for n in args or list(PIECES) + ['holds']:
        if n == 'holds':
            print('out', render_holds(), flush=True)
            continue
        S, frame, segs, out = PIECES[n]()
        print('out', render(S, frame, segs, out), round(S.dur, 2), 's', flush=True)
