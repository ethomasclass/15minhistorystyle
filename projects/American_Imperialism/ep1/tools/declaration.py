# The Declaration evidence pieces and the Ledger, every one timed to the narration's words:
#   decl_plain   ch 2   "In 1776 ... the consent of the governed ... The people have to say yes." (the line, no marks)
#   decl_under1  ch 6   "the Bayonet Constitution": the same frame, one teal underline under "consent of the governed"
#   decl_under2  ch 6   "the American flag": the first underline there, a second draws
#   decl_circle  ch 9   "were never asked": both underlines, then a hand-drawn loop round the line; 2 s of silence
#   george3      ch 7   the George III callback: the real grievance lights on the engraving as it is read, then the
#                       king's "He has" (the clause it hangs on: "He has combined with others ...") is struck and
#                       "We have" is written over it
#   ledger       ch 9   the series Ledger: one row per episode (LEDGER below), this episode's row written on as said
# The four Declaration line shots share one hold camera (HOLD, hold_cam): the frame at hold time 0 is identical in all
# of them, and the push continues the same way, so every return to the line is the same camera, the same frame.
#   python3 tools/declaration.py [piece ...]            render, encode, join -> renders/tests/declaration_pieces.mp4
#   python3 tools/declaration.py still piece t [t ...]   PNG stills at clip times (s) -> build/declaration_stills/
import math, os, shutil, subprocess, sys
import numpy as np
from PIL import Image, ImageFont
from scipy.io import wavfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vkit import *   # noqa: F401,F403
from vkit import EP, KIT, _norm as vkit_norm
from kit import note, drawn_path, FPS

PARTS = os.path.join(EP, 'build', 'declaration_parts')
STILLS = os.path.join(EP, 'build', 'declaration_stills')
OUT = os.path.join(EP, 'renders', 'tests')
for _d in (PARTS, STILLS, OUT):
    os.makedirs(_d, exist_ok=True)
SCAN = os.path.join(EP, 'img', 'raw', 'declaration_5000.jpg')            # W. J. Stone engraving, 1823 (5000 x 5917)
SOURCE = 'DECLARATION OF INDEPENDENCE, 1776 · W. J. STONE ENGRAVING, 1823 · NATIONAL ARCHIVES'
PAPER = '#ede1c4'                                                         # the toned paper, also beyond the scan's edge
NANUM = os.path.join(KIT, '..', 'fonts', 'NanumPenScript-full.ttf')


def toned(y0, y1):
    """a band of the engraving, inked warm on parchment (kit_reel's toning), cached"""
    p = os.path.join(PARTS, f'decl_{y0}_{y1}.jpg')
    if not os.path.exists(p):
        im = np.asarray(Image.open(SCAN).crop((0, y0, 5000, y1)).convert('L'), np.float32) / 255
        ink, paper = np.array([43, 34, 25], np.float32), np.array([237, 225, 196], np.float32)
        u = np.clip((im - 0.18) / 0.72, 0, 1)
        u[:, :70] = 1.0; u[:, 4790:] = 1.0                  # the scan's own page edges (no ink there)
        if y0 < 80:
            u[:80 - y0, :] = 1.0
        u = u[..., None]
        Image.fromarray((ink + (paper - ink) * u).astype(np.uint8)).save(p, quality=90)
    return p


def source_tag(dark=True):
    """the mono credit, bottom left inside the safe area, on a dark plate so it reads over the engraving"""
    w = len(SOURCE) * 10.1 + 24
    return (f'<rect x="92" y="993" width="{w:.0f}" height="30" rx="3" fill="#0d0c09" opacity="{0.72 if dark else 0:.2f}"/>'
            + tag(104, 1014, SOURCE, 16, '#cfc6b4'))


def narration(name, segs):
    """the voice for a piece: segs are (stem, a, b) cuts of a chapter WAV or ('', seconds) of silence; 10 ms fades at
    every join. Returns the WAV path (mono 44.1 kHz)."""
    parts, sr0 = [], 44100
    for sg in segs:
        if sg[0] == '':
            parts.append(np.zeros(int(sg[1] * sr0), np.float32))
            continue
        stem, a, b = sg
        sr, x = wavfile.read(os.path.join(EP, 'public', 'audio', stem + '.wav'))
        x = x.astype(np.float32) / 32768.0
        if x.ndim > 1:
            x = x.mean(1)
        sr0 = sr
        c = x[int(max(0, a) * sr):int(b * sr)].copy()
        f = min(len(c) // 2, int(0.01 * sr))
        if f:
            c[:f] *= np.linspace(0, 1, f)
            c[-f:] *= np.linspace(1, 0, f)
        parts.append(c)
    out = os.path.join(EP, 'build', name, 'narr.wav')
    wavfile.write(out, sr0, (np.clip(np.concatenate(parts), -1, 1) * 32767).astype(np.int16))
    return out


def render(S, frame, segs):
    """frames -> the kit's finish (grain, vignette) -> the narration laid under it; returns the clip path"""
    S.write(frame)
    fd = os.path.join(S.dir, 'f')
    shutil.rmtree(fd, ignore_errors=True)                # no stale frames from an earlier, longer render
    subprocess.run(['node', os.path.join(KIT, 'anim_render.mjs'), S.dir], check=True, capture_output=True)
    subprocess.run([sys.executable, os.path.join(KIT, 'encode.py'), S.dir, os.path.join(S.dir, 'silent.mp4')], check=True, capture_output=True)
    wav = narration(S.name, segs)
    out = os.path.join(S.dir, 'clip.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(S.dir, 'silent.mp4'), '-i', wav, '-map', '0:v', '-map', '1:a',
                    '-c:v', 'copy', '-af', 'apad', '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
    return out


def stills(S, frame, times):
    """render only the frames at the given clip times to PNG (a small test before any full render)"""
    S.write(frame)
    d = os.path.join(S.dir, 'stills')
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d)
    for f in os.listdir(S.dir):
        if f.startswith('i') and os.path.splitext(f)[1] in ('.jpg', '.png'):
            shutil.copy(os.path.join(S.dir, f), d)
    shutil.copy(os.path.join(S.dir, 'base.html'), d)
    lines = open(os.path.join(S.dir, 'frames.ndjson')).read().splitlines()
    idx = [min(len(lines) - 1, int(round(t * FPS))) for t in times]
    open(os.path.join(d, 'frames.ndjson'), 'w').write('\n'.join(lines[i] for i in idx) + '\n')
    subprocess.run(['node', os.path.join(KIT, 'anim_render.mjs'), d], check=True, capture_output=True)
    outs = []
    for k, t in enumerate(times):
        p = os.path.join(STILLS, f'{S.name}_{t:06.2f}.png')
        shutil.copy(os.path.join(d, 'f', f'{k:04d}.png'), p)
        outs.append(p)
    return outs


# ================================================================ the Declaration line (one frame for all four shots)
LINE = (597, 1272, 1206, 1376)            # "the consent of the governed" on the engraving (ascenders to descenders)
SPOT = (566, 1258, 1224, 1398)            # the lit hole round it (stops short of the dash after "governed,")
HOLD = (902, 1334, 1.45)                  # the hold frame: world centre and zoom
HOLD_PUSH = 0.010                         # the hold's slow push, log-zoom per second
HEAD = (3640, 245)                        # "JULY 4, 1776" in the title
DIM = 0.6
# the marks, in world px: two underlines under "consent of the governed" (a hand never draws the same line twice),
# and the loop round the whole line
UNDER = [(670, 1355, 1196, 1349, 6), (690, 1381, 1184, 1380, 4)]
LOOP = dict(cx=905, cy=1334, rx=384, ry=90, rot=-1.0, turns=1.16, seed=1.3)


def hold_cam():
    cx, cy, z = HOLD
    return Camera([(0.0, cx, cy, z), (20.0, cx, cy + 6, z * math.exp(20 * HOLD_PUSH))], wobble=1.0)


def underline(k, p):
    x0, y0, x1, y1, bow = UNDER[k]
    w = x1 - x0
    d = f'M{x0},{y0} C{x0 + 0.3 * w:.0f},{y0 + bow} {x0 + 0.7 * w:.0f},{y1 + bow * 0.7:.0f} {x1},{y1}'
    return drawn_path(d, p, TE, 8)


def hand_loop(cx, cy, rx, ry, rot=0.0, turns=1.16, seed=1.0):
    """a hand-drawn loop: starts upper left, goes round clockwise, overshoots its start; smooth, low wobble"""
    pts, n = [], 180
    c, s_ = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    for i in range(int(n * turns) + 1):
        u = i / n
        a = -math.pi * 0.72 + 2 * math.pi * u
        k = 1 + 0.035 * math.sin(2 * a + seed) + 0.018 * math.sin(3 * a + 2 * seed) + 0.05 * (u - 0.5)
        x, y = rx * k * math.cos(a), ry * k * math.sin(a)
        pts.append((cx + x * c - y * s_, cy + x * s_ + y * c))
    return 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts)


def line_stage(name, dur):
    S = stage(name, dur, bg=False)
    S.world.append(f'<rect x="-3000" y="-3000" width="11000" height="9000" fill="{PAPER}"/>')
    S.world.append(f'<image href="{S.img(toned(0, 2000))}" x="0" y="0" width="5000" height="2000"/>')
    x0, y0, x1, y1 = SPOT
    S.defs.append(f'<mask id="spotm"><rect x="-3000" y="-3000" width="11000" height="9000" fill="#fff"/>'
                  f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" rx="34" fill="#000" filter="url(#soft4)"/></mask>')
    S.world.append('<rect id="dim" x="-3000" y="-3000" width="11000" height="9000" fill="#0d0c09" mask="url(#spotm)" opacity="0"/>')
    S.world.append('<g id="marks"></g>')
    S.over.append('<g id="ov"></g>')
    return S


def line_piece(name, stem, a, dur, t_hold, marks, intro=None, dim=None):
    """a Declaration line shot: clip times 0..dur; the hold camera from clip time t_hold on (earlier: the intro
    camera, in hold time); marks(t) -> svg in world px; dim(t) -> 0..DIM (full from the start by default)"""
    S = line_stage(name, dur)
    H = hold_cam()

    def frame(t):
        th = t - t_hold
        cam = H if th >= 0 or intro is None else intro
        return {'t': {'CAM': cam.transform(th)}, 'o': {'dim': f'{(dim(t) if dim else DIM):.3f}'},
                'h': {'marks': marks(t), 'ov': source_tag()}}
    return S, frame


def mark_p(t, t0, d):
    """a mark drawing on, on twos (12 fps)"""
    return ease_out(clamp((step12(t) - t0) / d), 2) if t >= t0 else 0.0


def decl_plain():
    Wd = Words('ch02_the_question')
    tc = Wd.at('the consent of the governed')
    t_hold = Wd.end('governed') + 0.3
    a_end = Wd.end('say yes') + 0.2
    dur = Wd.end('say yes') + 0.8
    cx, cy, z = HOLD
    k = lambda t: t - t_hold                     # intro keys are in hold time, so the join is seamless
    intro = Camera([(k(0.0), HEAD[0], HEAD[1] + 10, 0.78), (k(Wd.at('1776') + 0.25), HEAD[0], HEAD[1], 0.95),
                    (k(Wd.at('told') + 0.1), HEAD[0] - 60, HEAD[1] + 30, 0.97), (k(tc - 0.15), cx, cy, 1.32),
                    (-0.35, cx, cy, z * math.exp(-0.35 * HOLD_PUSH)), (0.0, cx, cy, z)], wobble=1.0)
    S, frame = line_piece('decl_plain', 'ch02_the_question', 0.0, dur, t_hold, lambda t: '', intro,
                          dim=lambda t: DIM * ease_out(clamp((t - tc + 0.1) / 0.6)))
    return S, frame, [('ch02_the_question', 0.0, a_end)], dur


def decl_under1():
    W0 = Words('ch06_the_heist')
    a = W0.at('the Bayonet Constitution') - 2 / FPS              # the cut lands two frames before the word
    Wd = Words('ch06_the_heist', t0=a)
    t0, t1 = Wd.at('Bayonet'), Wd.end('Constitution')
    a_end = W0.end('Bayonet Constitution') + 0.12
    dur = a_end - a + 1.5
    S, frame = line_piece('decl_under1', 'ch06_the_heist', a, dur, 0.0, lambda t: underline(0, mark_p(t, t0, t1 - t0)))
    return S, frame, [('ch06_the_heist', a, a_end), ('', 1.5)], dur


def decl_under2():
    W0 = Words('ch06_the_heist')
    a = W0.at('the American flag') - 2 / FPS
    Wd = Words('ch06_the_heist', t0=a)
    t0, t1 = Wd.at('flag') - 0.1, Wd.end('flag') + 0.25
    a_end = W0.end('American flag') + 0.03                       # "and put Hawaiʻi" follows in 60 ms
    dur = a_end - a + 1.5
    S, frame = line_piece('decl_under2', 'ch06_the_heist', a, dur, 0.0,
                          lambda t: underline(0, 1.0) + underline(1, mark_p(t, t0, t1 - t0)))
    return S, frame, [('ch06_the_heist', a, a_end), ('', 1.5)], dur


def decl_circle():
    W0 = Words('ch09_back_to_the_question')
    a = W0.at('were never asked') - 2 / FPS
    Wd = Words('ch09_back_to_the_question', t0=a)
    t0, t1 = Wd.at('never'), Wd.end('asked') + 0.15
    a_end = W0.end('never asked') + 0.15
    SIL = 2.0
    b0, b1 = W0.at('No vote on annexation') - 0.08, W0.end('held there') + 0.2
    dur = (a_end - a) + SIL + (b1 - b0) + 0.4
    loop = hand_loop(**LOOP)
    S, frame = line_piece('decl_circle', 'ch09_back_to_the_question', a, dur, 0.0,
                          lambda t: underline(0, 1.0) + underline(1, 1.0) + drawn_path(loop, mark_p(t, t0, t1 - t0), TE, 8))
    return S, frame, [('ch09_back_to_the_question', a, a_end), ('', SIL), ('ch09_back_to_the_question', b0, b1)], dur


# ================================================================ the George III callback
# where the grievance really is on the engraving (world px = scan px): each spoken word's span on its line
G_LINES = {1: dict(band=(3036, 3142), xh=(3068, 3110)), 2: dict(band=(3120, 3226), xh=(3162, 3204))}
G_WORDS = [('For', 1, 3118, 3222), ('taking', 1, 3228, 3394), ('away', 1, 3405, 3528), ('our', 1, 3540, 3606),
           ('Charters,', 1, 3608, 3828), ('abolishing', 1, 3842, 4080), ('our', 1, 4096, 4164), ('most', 1, 4186, 4300),
           ('valuable', 1, 4312, 4494), ('Laws,', 1, 4508, 4626), ('and', 1, 4650, 4754),
           ('altering', 2, 280, 452), ('fundamentally', 2, 466, 822), ('the', 2, 838, 914), ('Forms', 2, 930, 1082),
           ('of', 2, 1092, 1134), ('our', 2, 1140, 1212), ('Governments', 2, 1240, 1562)]
HEHAS = (4318, 2632, 4530, 2716)          # "He has" of "He has combined with others ...", the clause the grievance hangs on
G_Y0, G_Y1 = 1300, 4500                   # the band of the engraving loaded for this shot


def george3():
    stem = 'ch07_he_has_we_have'
    Wd = Words(stem)
    dur = Wd.w[-1]['e'] + 1.5
    S = stage('george3', dur, bg=False)
    S.world.append(f'<rect x="-6000" y="-3000" width="17000" height="11000" fill="{PAPER}"/>')
    S.world.append(f'<image href="{S.img(toned(G_Y0, G_Y1))}" x="0" y="{G_Y0}" width="5000" height="{G_Y1 - G_Y0}"/>')
    S.world.append('<g id="wash"></g>')
    S.defs.append('<mask id="gm"><rect x="-6000" y="-3000" width="17000" height="11000" fill="#fff"/><g id="holes"></g></mask>')
    S.world.append('<rect id="dim" x="-6000" y="-3000" width="17000" height="11000" fill="#0d0c09" mask="url(#gm)" opacity="0"/>')
    S.world.append('<g id="marks"></g>')
    S.over.append('<g id="ov"></g>')

    # the spoken time of each word of the grievance, in order
    i0 = Wd._find('For taking away our Charters')[0]
    ws = [(Wd.w[i0 + k]['s'], Wd.w[i0 + k]['e']) for k in range(len(G_WORDS))]
    for k, (w, *_r) in enumerate(G_WORDS):                  # the scan's words and the narration's must agree
        assert vkit_norm(Wd.w[i0 + k]['w']) == vkit_norm(w), (Wd.w[i0 + k]['w'], w)

    def lit(t):
        """the right edge of the lit band on each line at time t (None: not started)"""
        edge = {1: None, 2: None}
        for (w, ln, x0, x1), (s, e) in zip(G_WORDS, ws):
            if t < s - 0.04:
                break
            u = clamp((t - s + 0.04) / max(0.12, e - s))
            start = edge[ln] if edge[ln] is not None else x0 - 14
            edge[ln] = max(start, x0 + (x1 - x0) * u + (14 if u >= 1 else 0))
        return edge
    L0 = {1: G_WORDS[0][2] - 18, 2: G_WORDS[11][2] - 18}

    t_one = Wd.at('One of them')
    t_l1, t_l2 = Wd.at('For taking'), Wd.at('altering')
    t_king = Wd.at('a king')
    t_amer = Wd.at('Americans')
    t_we0, t_we1 = Wd.end('Americans'), Wd.end('a queen') - 0.1
    x_l1 = (G_WORDS[0][2] + G_WORDS[10][3]) / 2
    x_l2 = (G_WORDS[11][2] + G_WORDS[17][3]) / 2
    ts0, ts1 = Wd.end('Laws'), t_l2 + 0.35
    tw0, tw1 = Wd.at('That was') - 0.15, t_king + 0.25
    tp0, tp1 = Wd.end('to America') + 0.3, t_amer - 0.3
    cam = Camera([(0.0, 3880, 2850, 0.70), (t_one, 3920, 2920, 0.90), (t_l1, x_l1, 2935, 0.95), (ts0, x_l1 + 25, 2945, 0.985),
                  ((ts0 + ts1) / 2, 2450, 3060, 0.56), (ts1, x_l2 - 10, 3165, 0.98), (Wd.end('Governments'), x_l2 + 20, 3166, 1.02),
                  (tw0, x_l2 + 26, 3166, 1.025), (tw1, 2460, 2930, 0.375), (tp0, 2480, 2925, 0.383),
                  (tp1, 4060, 2840, 1.10), (dur, 4066, 2842, 1.15)], wobble=1.0)

    def frame(t):
        tq = step12(t)
        edge = lit(tq)
        holes, wash = '', ''
        for ln in (1, 2):
            if edge[ln] is None:
                continue
            y0, y1 = G_LINES[ln]['band']
            h0, h1 = G_LINES[ln]['xh']
            x0, x1 = L0[ln], edge[ln]
            holes += f'<rect x="{x0}" y="{y0}" width="{x1 - x0:.0f}" height="{y1 - y0}" rx="30" fill="#000" filter="url(#soft4)"/>'
            wash += (f'<rect x="{x0 + 8}" y="{h0}" width="{max(0, x1 - x0 - 16):.0f}" height="{h1 - h0}" rx="10" fill="{OR}" '
                     f'opacity="0.32" style="mix-blend-mode:multiply"/>')
        hh = clamp((t - t_king) / 0.5)
        if hh > 0:
            x0, y0, x1, y1 = HEHAS
            holes += (f'<rect x="{x0 - 22}" y="{y0 - 8}" width="{x1 - x0 + 44}" height="{y1 - y0 + 16}" rx="30" fill="#000" '
                      f'opacity="{ease(hh):.3f}" filter="url(#soft4)"/>')
        marks = ''
        if t >= t_amer:                                    # "He has" struck through
            x0, y0, x1, y1 = HEHAS
            marks += drawn_path(f'M{x0 - 6},2697 Q{(x0 + x1) / 2:.0f},2690 {x1 + 8},2681', mark_p(t, t_amer, 0.3), TE, 10)
        if t >= t_we0:                                     # "We have" written over it
            p = (tq - t_we0) / (t_we1 - t_we0)
            marks += f'<g transform="rotate(-4 {HEHAS[0]} 2646)">' + note(HEHAS[0] - 12, 2646, 'We have', 50, TE, prog=p) + '</g>'
        dim = 0.45 * ease_out(clamp((t - t_one) / 0.6))
        return {'t': {'CAM': cam.transform(t)}, 'o': {'dim': f'{dim:.3f}'},
                'h': {'holes': holes, 'wash': wash, 'marks': marks, 'ov': source_tag()}}
    return S, frame, [(stem, 0.0, Wd.w[-1]['e'] + 0.4)], dur


# ================================================================ the Ledger (series asset: one row per episode)
# `cue`: the phrases that time this episode's row (the header pops on `head`, the words write on as they are spoken
# from `at`); earlier episodes' rows are drawn already written.
LEDGER = [
    dict(ep='EP 1', years='1867–1898', stem='ch09_back_to_the_question',
         said='“entangling alliances with none”', did="took a kingdom's harbor, then the kingdom",
         back='Liliʻuokalani, and 21,269 of her people',
         cue=dict(start='This series keeps a ledger', row='one line per episode', end='of her people',
                  said=('What America said', 'entangling alliances with none'), did=('What it did', "took a kingdom's harbor"),
                  back=('Who answered back', 'Liliʻuokalani, and 21,269'))),
]
COLS = [('said', 'WHAT AMERICA SAID', 430, 840), ('did', 'WHAT IT DID', 892, 1290), ('back', 'WHO ANSWERED BACK', 1342, 1730)]
PG = (150, 150, 1620, 830)                # the page: x, y, w, h (bottom at 980, inside the safe area)
HEAD_Y, ROW_Y, ROW_H, ROWS = 330, 362, 118, 5
HAND = 28                                 # note() size (font px = 1.55 x)


def _wrap(s, width):
    """greedy wrap at the column width, then balanced: the measure narrows while the line count holds (no orphans)"""
    f = ImageFont.truetype(NANUM, int(HAND * 1.55))

    def greedy(wd):
        lines, cur = [], ''
        for w in s.split():
            trial = (cur + ' ' + w).strip()
            if cur and f.getlength(trial) > wd:
                lines.append(cur); cur = w
            else:
                cur = trial
        return lines + [cur]
    best = greedy(width)
    wd = width
    while wd > 120:
        trial = greedy(wd - 8)
        if len(trial) > len(best):
            break
        best, wd = trial, wd - 8
    return best


def ledger_page(op_rows):
    """the ruled page: title, column heads, ruled rows (no handwriting)"""
    x, y, w, h = PG
    o = (f'<rect x="{x + 14}" y="{y + 18}" width="{w}" height="{h}" fill="#000" opacity="0.45" filter="url(#soft)"/>'
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{CREAM}"/>'
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" stroke="{BONE_D}" stroke-width="2"/>')
    o += text(x + w - 40, y + 70, 'AMERICAN IMPERIALISM · ONE LINE PER EPISODE', 18, 'Plex', '#7d766b', 'end', extra='letter-spacing="2"')
    # ruled rows, the double rule under the heads, the column rules
    for r in range(ROWS + 1):
        yy = ROW_Y + r * ROW_H
        o += f'<rect x="{x + 24}" y="{yy}" width="{w - 48}" height="2" fill="{BONE_D}"/>'
    o += f'<rect x="{x + 24}" y="{ROW_Y - 9}" width="{w - 48}" height="2" fill="{INK}" opacity="0.55"/>'
    o += f'<rect x="{x + 24}" y="{ROW_Y - 2}" width="{w - 48}" height="2" fill="{INK}" opacity="0.55"/>'
    yb = ROW_Y + ROWS * ROW_H
    for cx in (400, 406):
        o += f'<rect x="{cx}" y="{HEAD_Y - 40}" width="2" height="{yb - HEAD_Y + 40}" fill="{OR_D}" opacity="0.8"/>'
    for cx in (866, 1316):
        o += f'<rect x="{cx}" y="{HEAD_Y - 40}" width="2" height="{yb - HEAD_Y + 40}" fill="{BONE_D}"/>'
    o += text(186, HEAD_Y, 'EPISODE', 19, 'Plex', '#7d766b', extra='letter-spacing="2"')
    return o


def ledger():
    row = LEDGER[-1]
    cue = row['cue']
    W0 = Words(row['stem'])
    a = W0.at(cue['start']) - 0.35
    a_end = W0.end(cue['end']) + 0.12
    dur = a_end - a + 1.6
    Wd = Words(row['stem'], t0=a)
    S = stage('ledger', dur)
    S.over.append('<g id="ov"></g>')
    t_in = Wd.at(cue['start'])
    t_row = Wd.at(cue['row'])
    ri = len(LEDGER) - 1
    shift = max(0, ri - (ROWS - 1)) * ROW_H     # later episodes: the page scrolls so this episode's row shows

    # each column's text, wrapped, with the spoken times of its words (char reveal follows the voice)
    plan = {}
    for key, head, x0, x1 in COLS:
        lines = _wrap(row[key], x1 - x0)
        hd, first = cue[key]
        toks = row[key].split()
        i0 = Wd._find(first)[0]
        times = [(Wd.w[i0 + k]['s'] - a, Wd.w[i0 + k]['e'] - a) for k in range(len(toks))]
        assert all(vkit_norm(Wd.w[i0 + k]['w']) == vkit_norm(tk) for k, tk in enumerate(toks)), (key, toks)
        plan[key] = dict(lines=lines, times=times, head=Wd.at(hd), x=x0)

    def shown(key, t):
        """how many characters of each wrapped line are written by time t"""
        P = plan[key]
        n, toks = 0.0, row[key].split()
        for tk, (s, e) in zip(toks, P['times']):
            if t < s:
                break
            n += (len(tk) + 1) * clamp((t - s) / max(0.15, e - s))
        out = []
        for ln in P['lines']:
            k = clamp(n / max(1, len(ln) + 1))
            out.append(k)
            n -= len(ln) + 1
        return out

    def row_svg(r, i, t, live):
        y = ROW_Y + i * ROW_H - shift
        o = ''
        rp = pop(t, t_row, 0.3) if live else 1.0
        if rp > 0:
            o += g(190, y + 58, rp, text(0, 0, r['ep'], 44, 'Abril', INK))
            o += g(190, y + 92, rp, text(0, 0, r['years'], 19, 'Plex', '#5d574e', extra='letter-spacing="1"'))
        for key, head, x0, x1 in COLS:
            lines = _wrap(r[key], x1 - x0)
            prog = shown(key, step12(t)) if live else [1.0] * len(lines)
            y0 = y + 68 - (len(lines) - 1) * 23
            for li, (ln, pp) in enumerate(zip(lines, prog)):
                if pp > 0:
                    o += note(x0, y0 + li * 46, ln, HAND, TE, prog=pp)
        return o

    def frame(t):
        tq = step12(t)
        o = ledger_page(1)
        # the column heads: printed, then an orange strip wipes under each as it is named
        for key, head, x0, x1 in COLS:
            th = plan[key]['head']
            if t >= th:
                p = clamp((tq - th) / 0.25)
                wd = len(head) * 13.6 + 30
                o += (f'<rect x="{x0 - 14}" y="{HEAD_Y - 27}" width="{wd * p:.0f}" height="38" fill="{OR}" filter="url(#tear)"/>')
            o += text(x0, HEAD_Y, head, 19, 'Plex', INK, extra='letter-spacing="2"')
        for i, r in enumerate(LEDGER):
            o += row_svg(r, i, t, live=(i == ri))
        # the title on the orange strip, at the page's top left
        if t >= t_in + 0.15:
            o += highlight(176, 232, 'THE LEDGER', 54, prog=(tq - t_in - 0.15) / 0.27)
        s = pop_s(t, t_in, 0.45, 1.3)
        z = 1 + 0.08 * ease_io(clamp((t - t_row) / (dur - t_row)))     # a slow push toward the row being written
        o = (f'<g transform="translate(960,{430 + 40 * (1 - ease_out(clamp((t - t_in) / 0.45))):.1f}) scale({s * z:.4f}) '
             f'rotate({-0.6 - 1.4 * (1 - clamp((t - t_in) / 0.45)):.2f}) translate(-960,-430)">{o}</g>')
        return {'h': {'ov': o}}
    return S, frame, [(row['stem'], a, a_end)], dur


PIECES = dict(decl_plain=decl_plain, decl_under1=decl_under1, decl_under2=decl_under2, george3=george3,
              decl_circle=decl_circle, ledger=ledger)


def build(name):
    S, frame, segs, dur = PIECES[name]()
    return S, frame, segs, dur


if __name__ == '__main__':
    args = sys.argv[1:]
    if args and args[0] == 'still':
        S, frame, segs, dur = build(args[1])
        for p in stills(S, frame, [float(x) for x in args[2:]]):
            print(p)
        sys.exit()
    names = args or list(PIECES)
    clips = []
    for n in names:
        S, frame, segs, dur = build(n)
        clips.append(render(S, frame, segs))
        print('clip', n, round(dur, 2), 's', flush=True)
    inp = []
    for c in clips:
        inp += ['-i', c]
    k = len(clips)
    flt = ''.join(f'[{i}:v][{i}:a]' for i in range(k)) + f'concat=n={k}:v=1:a=1[v][a]'
    out = os.path.join(OUT, 'declaration_pieces.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inp + ['-filter_complex', flt, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264',
                    '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', out], check=True)
    print('reel', out)
