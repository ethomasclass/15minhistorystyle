# The four pitches as badges (drawn in the chapter 5 test, tools/vec_test.py), as a recurring piece:
#   four  (ch 2 "It starts with four arguments" ... "still sound convincing")  four unlit badges, dark on the desk; on
#         "convincing" they warm a little, not all the way (the argument has not been made yet)
#   light (ch 9 "All four pitches spoke the language of American ideals: markets, a strong navy, Christianity, progress")
#         the same row, unlit, each lighting on its word with the ideal it claimed on the strip; then "the Fourth of July"
#         lands as a small stamp under the row
#   python3 tools/badges.py [four light]      (renders, encodes, joins to renders/tests/badges.mp4)
import os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vkit import *   # noqa: F401,F403
from vkit import EP
from kit import note
import vec_test as VT

ROW_X = [420, 780, 1140, 1500]
DARK, DARK_D, DARK_I = '#2b2721', '#1f1c17', '#3b362e'
OUT = os.path.join(EP, 'renders', 'tests')


def unlit_icon(i):
    """the badge's icon drawn flat in a dark tone, a silhouette of itself"""
    icon = VT.ICONS[i][2]
    return f'<g opacity="0.9" style="filter:url(#sil)">{icon}</g>'


SIL = ('<filter id="sil"><feColorMatrix type="matrix" values="0 0 0 0 0.23  0 0 0 0 0.21  0 0 0 0 0.18  0 0 0 1 0"/></filter>')


def badge_at(t, i, lit, s):
    """lit 0..1: the dark slab crossfades to the badge's colour"""
    fill, shade, icon, _ = VT.ICONS[i]
    dark = VT.badge(DARK, DARK_D, unlit_icon(i))
    if lit <= 0:
        return dark
    if lit >= 1:
        return VT.badge(fill, shade, icon)
    return dark + f'<g opacity="{lit:.3f}">{VT.badge(fill, shade, icon)}</g>'


def seg_four():
    W0 = Words('ch02_the_question')
    a = W0.at('It starts with four') - 0.3
    b = W0.end('still sound convincing') + 0.7
    Wd = Words('ch02_the_question', t0=a)
    S = stage('badges_four', b - a)
    S.defs.append(SIL)
    S.over.append('<g id="ov"></g>')
    t4, tc = Wd.at('four arguments'), Wd.at('convincing')

    def frame(t):
        tq = step12(t)
        o = ''
        for i in range(4):
            s = pop(t, t4 + i * 0.14)
            warm = 0.35 * clamp((tq - tc - i * 0.12) / 0.4) if t >= tc else 0.0      # a little warmth, not lit
            if s > 0:
                o += g(ROW_X[i], 500, s * 1.3, badge_at(t, i, warm, s))
        z = 1 + 0.025 * clamp(t / (b - a))
        return {'h': {'ov': f'<g transform="translate(960,540) scale({z:.4f}) translate(-960,-540)">{o}</g>'}}
    return S, frame, 'ch02_the_question', a, b


def seg_light():
    W0 = Words('ch09_back_to_the_question')
    a = W0.at('All four pitches') - 0.3
    b = W0.end('Fourth of July') + 0.9
    Wd = Words('ch09_back_to_the_question', t0=a)
    S = stage('badges_light', b - a)
    S.defs.append(SIL)
    S.over.append('<g id="ov"></g>')
    t_in = Wd.at('All four pitches')
    LIT = [(Wd.at('markets'), 'MARKETS'), (Wd.at('a strong navy'), 'A STRONG NAVY'), (Wd.at('Christianity'), 'CHRISTIANITY'),
           (Wd.at('progress'), 'PROGRESS')]
    t_ideals = Wd.at('American ideals')
    t_july = Wd.at('Fourth of July')

    def frame(t):
        tq = step12(t)
        o = ''
        for i in range(4):
            s = pop(t, t_in + i * 0.1)
            tl, label = LIT[i]
            lit = clamp((tq - tl) / 0.17) if t >= tl else 0.0
            if s > 0:
                bump = 1 + 0.08 * (1 - clamp((tq - tl) / 0.3)) if t >= tl else 1.0
                o += g(ROW_X[i], 470, s * bump * 1.3, badge_at(t, i, lit, s))
            if t >= tl:
                sz = 38
                wch = sz * 0.62 * len(label) + sz * 0.5
                o += highlight(ROW_X[i] - wch / 2, 715, label, sz, prog=(tq - tl) / 0.27, rot=-2)
        if t >= t_ideals:                                           # what they all claimed, in teal hand above the row
            o += note(960, 215, 'the language of American ideals', 46, TE, prog=(tq - t_ideals) / 1.1, anchor='middle')
        if t >= t_july:                                             # the date, stamped under the row
            ps = pop(t, t_july, 0.3, 2.0)
            o += g(960, 870, ps, f'<path d="{tablet(250, 46, 14)}" fill="none" stroke="{OR}" stroke-width="6"/>'
                   + text(0, 16, 'JULY 4, 1894', 46, 'Inter8', OR, anchor='middle'), rot=-3)
        z = 1 + 0.025 * clamp(t / (b - a))
        return {'h': {'ov': f'<g transform="translate(960,540) scale({z:.4f}) translate(-960,-540)">{o}</g>'}}
    return S, frame, 'ch09_back_to_the_question', a, b


SEGS = {'four': seg_four, 'light': seg_light}

if __name__ == '__main__':
    keys = sys.argv[1:] or list(SEGS)
    clips = []
    for k in keys:
        S, frame, stem, a, b = SEGS[k]()
        S.write(frame)
        clips.append(encode_clip(S.name, stem, a, b, os.path.join(S.dir, 'clip.mp4')))
        print('clip', k, round(b - a, 2), 's', flush=True)
    inp = []
    for c in clips:
        inp += ['-i', c]
    n = len(clips)
    flt = ''.join(f'[{i}:v][{i}:a]' for i in range(n)) + f'concat=n={n}:v=1:a=1[v][a]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inp + ['-filter_complex', flt, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264',
                    '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', os.path.join(OUT, 'badges.mp4')], check=True)
    print('reel', os.path.join(OUT, 'badges.mp4'))
