# The Ep 1 quote card, for any quote in the script. One spec per card (CARDS below):
#   a portrait traced from the period image pops in at centre, the name lands on the strip (bone strip in the quiet
#   palette), then the group glides left and the quote builds word by word on the narrator's own timing, laid out with
#   real font measurements; teal underlines draw under the key words as they are spoken; an optional teal handwritten
#   note (a translation, a gloss) writes on as it is said; optional traced signature; a slow push over the whole card.
#   python3 tools/qcard.py [key ...]      (renders each card, then renders/tests/quote_cards.mp4)
import math, os, subprocess, sys
from PIL import Image, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vkit import *   # noqa: F401,F403
from vkit import EP, KIT
from kit import note
from vtrace import trace, trace_ink

ARC = lambda f: os.path.join(EP, 'img', 'archival', f)
RAW = lambda f: os.path.join(EP, 'img', 'raw', f)
FONT = os.path.join(KIT, '..', 'fonts', 'Inter-800-full.ttf')
PARTS = os.path.join(EP, 'build', 'qcard_parts')
os.makedirs(PARTS, exist_ok=True)

CARDS = {
    'jefferson': dict(stem='ch03_the_old_guard', start='Thomas Jefferson put it', name_at='Jefferson', end='with none', hold=1.6,
                      quote='entangling alliances with none.', underline=['with none'],
                      portrait=dict(path=RAW('loc_jefferson_1887.jpg'), box=(190, 235, 860, 1060)), name='THOMAS JEFFERSON',
                      source='FIRST INAUGURAL ADDRESS, MARCH 4, 1801', source_at='first speech',
                      credit='PORTRAIT: T. JOHNSON AFTER GILBERT STUART, 1887 · LIBRARY OF CONGRESS (TRACED)',
                      signature=dict(path=RAW('loc_jefferson_1887.jpg'), box=(240, 1360, 720, 1515), thresh=175)),
    'mahan': dict(stem='ch04_the_pitch_meeting', start='Mahan wrote that', name_at='Mahan wrote', end='You need both', hold=1.0,
                  quote='it is equally vain to acquire distant coaling stations without maintaining a powerful navy.',
                  underline=['without maintaining a powerful navy'], bg='teal',
                  note=dict(at='Translation', to='without the navy', text='translation: the stations are no use without the navy'),
                  portrait=dict(path=ARC('ch04_mahan_portrait_nh126.jpg'), frac=(0.15, 0.08, 0.88, 0.70)), name='CAPTAIN A. T. MAHAN',
                  source='THE INFLUENCE OF SEA POWER UPON HISTORY, 1890', source_at='Mahan wrote',
                  credit='PORTRAIT: NAVAL HISTORY AND HERITAGE COMMAND NH 126 (TRACED)'),
    'spencer': dict(stem='ch04_the_pitch_meeting', start='Herbert Spencer took', name_at='Herbert Spencer', end='survival of the fittest', hold=1.4,
                    quote='survival of the fittest.', underline=['the fittest'],
                    portrait=dict(path=ARC('ch04_herbert_spencer.jpg'), frac=(0.12, 0.04, 0.92, 0.70), cuts=[30, 55, 80]), name='HERBERT SPENCER',
                    source='PRINCIPLES OF BIOLOGY, 1864', source_at='coined a phrase',
                    credit='PORTRAIT: HERBERT SPENCER, BEFORE 1903 · WIKIMEDIA COMMONS (TRACED)'),
    'strong': dict(stem='ch04_the_pitch_meeting', start="Josiah Strong's own book", name_at="Josiah Strong's", end='called them a race', hold=1.2,
                   quote='the final competition of races, for which the Anglo-Saxon is being schooled.', underline=['final competition of races'],
                   note=dict(at='By Anglo-Saxon', to='peoples', text='his words: "all English-speaking peoples"'),
                   portrait=dict(path=ARC('ch04_josiah_strong.jpg'), frac=(0.14, 0.04, 0.92, 0.72)), name='REV. JOSIAH STRONG',
                   source='OUR COUNTRY, 1885', source_at='own book',
                   credit='PORTRAIT: JOSIAH STRONG, PUBLISHED 1907 · WIKIMEDIA COMMONS (TRACED)'),
    'yield': dict(stem='ch06_the_heist', start='The Queen would not start', name_at='The Queen would', end='United States of America', hold=1.8,
                  quote='I yield to the superior force of the United States of America.', underline=['superior force'], bg='coral',
                  portrait=dict(path=ARC('ch01_liliuokalani_c1898_prince.jpg'), frac=(0.12, 0.07, 0.88, 0.80), cuts=[22, 48, 78]), name='LILIʻUOKALANI',
                  source='STATEMENT UNDER PROTEST, JANUARY 17, 1893', source_at='under protest',
                  credit='PORTRAIT: LILIʻUOKALANI, ABOUT 1898 · LIBRARY OF CONGRESS (TRACED)'),
    'cleveland': dict(stem='ch06_the_heist', start='then he told Congress', name_at='told Congress', end='substantial wrong', hold=1.2,
                      quote='act of war, committed with the participation of a diplomatic representative of the United States and without authority of Congress.',
                      underline=['act of war', 'without authority of Congress'], bg='teal',
                      note=dict(at='He called it', to='substantial wrong', text='and: "a substantial wrong"'),
                      portrait=dict(path=ARC('ch06_grover_cleveland_1893.jpg'), frac=(0.38, 0.16, 0.78, 0.52), cuts=[30, 55, 78], clahe=3.5), name='GROVER CLEVELAND',
                      source='MESSAGE TO CONGRESS, DECEMBER 18, 1893', source_at='told Congress',
                      credit='PORTRAIT: GROVER CLEVELAND, 1893 · LIBRARY OF CONGRESS (TRACED)'),
    'prison': dict(stem='ch08_under_protest', start='She later put it simply', name_at='She later', end='was my prison', hold=2.0,
                   quote='My palace was my prison.', underline=[], quiet=True,
                   portrait=dict(path=ARC('ch01_liliuokalani_c1898_prince.jpg'), frac=(0.12, 0.07, 0.88, 0.80), cuts=[22, 48, 78]), name='LILIʻUOKALANI',
                   source="HAWAII'S STORY BY HAWAII'S QUEEN, 1898", source_at='put it simply',
                   credit='PORTRAIT: LILIʻUOKALANI, ABOUT 1898 · LIBRARY OF CONGRESS (TRACED)'),
    'honest': dict(stem='ch08_under_protest', start='she wrote to Americans directly', name_at='she wrote to', end='they love theirs', hold=2.2,
                   quote=('Oh, honest Americans, as Christians hear me for my down-trodden people! Their form of government is as dear to them '
                          'as yours is precious to you. Quite as warmly as you love your country, so they love theirs.'), underline=[], quiet=True,
                   portrait=dict(path=ARC('ch01_liliuokalani_c1898_prince.jpg'), frac=(0.12, 0.07, 0.88, 0.80), cuts=[22, 48, 78]), name='LILIʻUOKALANI',
                   source="HAWAII'S STORY BY HAWAII'S QUEEN, 1898", source_at='she wrote to',
                   credit='PORTRAIT: LILIʻUOKALANI, ABOUT 1898 · LIBRARY OF CONGRESS (TRACED)'),
}

# coloured backgrounds for variety: coral for the story's subject (Hawaiʻi's own voices, never in the quiet chapter),
# teal for explaining voices; type on colour is ink, marks and underlines cream, the portrait traced in the colour's tones
BGS = {'teal': ('#2bd3b8', '#179b86'), 'coral': ('#ff6f61', '#d94c40')}
BG_PORTRAIT = {'teal': [INK, '#0e5d51', '#7fe3d2', CREAM], 'coral': [INK, '#8a2c25', '#ffaaa1', CREAM]}
QX, QW = 900, 860                       # the quote column (text from QX + 60 to 1820)
PW = 520                                # portrait block width


def portrait_svg(key, p, quiet, bg=None):
    im = Image.open(p['path'])
    if p.get('rotate'):
        im = im.rotate(p['rotate'], expand=True)
    box = p.get('box') or tuple(int(v * s) for v, s in zip(p['frac'], (im.width, im.height, im.width, im.height)))
    src = os.path.join(PARTS, f'{key}_src.png')
    im.convert('L').crop(box).save(src)
    cols = ([INK, '#3a4542', '#8fa09a', BONE] if quiet else BG_PORTRAIT[bg] if bg else [INK, '#16675b', TE_D, CREAM])
    svg, (w, h) = trace(src, colors=cols, width=PW, work=520, blur=5, cuts=p.get('cuts', [42, 68, 87]), eps=0.8, min_area=160,
                        clahe=p.get('clahe', 0.0))
    return svg, min(h, 690)


def layout(words):
    """font size and line breaks for the quote column (real Inter 800 metrics); long quotes get a wider column"""
    def wrap(f, sp, width):
        lines, cur, wcur = [], [], 0.0
        for i, w in enumerate(words):
            ww = f.getlength(w)
            if cur and wcur + sp + ww > width:
                lines.append(cur); cur, wcur = [], 0.0
            cur.append((i, w, ww)); wcur += (sp if len(cur) > 1 else 0) + ww
        lines.append(cur)
        return lines
    for size in (120, 104, 92, 80, 70, 62, 56, 52, 48, 44, 42):
        f = ImageFont.truetype(FONT, size)
        sp = f.getlength(' ')
        lines = wrap(f, sp, QW)
        # balance: narrow the measure as long as the line count holds, so no line ends on a lone word
        n0, width = len(lines), QW
        while width > 200:
            trial = wrap(f, sp, width - 10)
            if len(trial) > n0:
                break
            lines, width = trial, width - 10
        lh = size * 1.2
        if len(lines) * lh <= 700 and len(lines) <= 8:
            pos = []
            top = 470 - len(lines) * lh / 2 + size * 0.8
            for li, line in enumerate(lines):
                x = QX + 60
                for i, w, ww in line:
                    pos.append((i, w, x, top + li * lh, ww))
                    x += ww + sp
            return size, sorted(pos), len(lines), top
    raise ValueError('quote too long')


def build(key):
    c = CARDS[key]
    quiet = c.get('quiet', False)
    W0 = Words(c['stem'])
    a = W0.at(c['start']) - 0.35
    b = W0.end(c['end']) + c.get('hold', 1.2)
    Wd = Words(c['stem'], t0=a)
    S = stage('qc_' + key, b - a)
    bg = c.get('bg')
    if bg:                                   # a flat field of colour with a soft darker edge, instead of the desk
        S.world.clear()
        hi, lo = BGS[bg]
        S.defs.append(f'<radialGradient id="cbg" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="{hi}"/><stop offset="0.75" stop-color="{hi}"/>'
                      f'<stop offset="1" stop-color="{lo}"/></radialGradient>')
        S.world.append('<rect width="1920" height="1080" fill="url(#cbg)"/>')
    psvg, PH = portrait_svg(key, c['portrait'], quiet, bg)
    S.defs.append(f'<clipPath id="pclip"><path d="{slab(PW, PH, 34)}"/></clipPath><g id="portrait">{psvg}</g>')
    if c.get('signature'):
        sg = c['signature']
        sig, (SW, SH) = trace_ink(sg['path'], sg['box'], 430, BONE if quiet else CREAM, thresh=sg.get('thresh', 150))
        S.defs.append(f'<g id="sig">{sig}</g>')
    S.over.append('<g id="ov"></g>')

    words = [w.strip('"') for w in c['quote'].split()]
    i0 = Wd._find(' '.join(words[:3]))[0]
    wt = [Wd.w[i0 + k]['s'] - a for k in range(len(words))]
    we = [Wd.w[i0 + k]['e'] - a for k in range(len(words))]
    size, pos, nlines, top = layout(words)
    PX, PY = 200, max(110, 470 - PH / 2 - 60)
    CX1, CY1 = PX + PW / 2, PY + PH / 2
    t_in = Wd.at(c['start'])
    t_q = wt[0]
    t_slide = max(t_in + 0.55, t_q - 0.8)
    strip_fill = BONE if quiet else CREAM if bg else OR
    mark = TE if quiet else CREAM if bg else OR
    txt = BONE if quiet else INK if bg else CREAM
    line = CREAM if bg else TE                # underlines
    frame_col = INK if bg else TE             # the portrait block's border
    shade = BGS[bg][1] if bg else '#0d0c09'
    tagc = '#2a2522' if bg else TAG
    unders = []
    for ph in c.get('underline', []):
        pw = [_ for _ in ph.split()]
        for k in range(len(words) - len(pw) + 1):
            if [w.strip('.,!').lower() for w in words[k:k + len(pw)]] == [x.lower() for x in pw]:
                unders.append((k, k + len(pw) - 1))
                break

    def frame(t):
        tq = step12(t)
        o = ''
        s = pop_s(t, t_in, 0.45)
        if s > 0:
            u = ease_io((t - t_slide) / 0.7)
            cx, cy = 960 + (CX1 - 960) * u, 450 + (CY1 - 450) * u
            sc = (1.1 - 0.1 * u) * s
            rot = -4 * (1 - clamp((t - t_in) / 0.45)) + 2.0 * math.sin(u * math.pi)
            grp = (f'<path d="{slab(PW, PH, 34)}" fill="{shade}" transform="translate({PX + 10},{PY + 12})"/>'
                   f'<g transform="translate({PX},{PY})"><g clip-path="url(#pclip)"><use href="#portrait"/></g>'
                   f'<path d="{slab(PW, PH, 34)}" fill="none" stroke="{frame_col}" stroke-width="6"/></g>')
            tn = Wd.at(c['name_at'])
            if t >= tn:
                grp += highlight(PX - 10, PY + PH + 80, c['name'], 44 if len(c['name']) > 16 else 50, prog=(tq - tn) / 0.27, fill=strip_fill)
            ts = Wd.at(c['source_at'])
            if t >= ts:
                grp += f'<g opacity="{clamp((t - ts) / 0.3):.3f}">' + tag(PX, PY + PH + 132, c['source'], 19, tagc) + '</g>'
            o += f'<g transform="translate({cx:.1f},{cy:.1f}) rotate({rot:.2f}) scale({sc:.4f}) translate({-CX1:.1f},{-CY1:.1f})">{grp}</g>'
        # the opening mark swings in just before the first word
        tm = t_q - 0.3
        if t >= tm:
            uu = clamp((t - tm) / 0.4)
            ms = pop_s(t, tm, 0.4, 2.2 if not quiet else 1.2)
            o += (f'<g transform="translate({QX - 10},{top - size * 0.95 - 60 * (1 - ease_out(uu)):.1f}) rotate({-24 * (1 - back_out(uu, 2.4)):.2f}) scale({ms:.3f})">'
                  f'<text x="-40" y="{size * 1.3:.0f}" font-family="\'Abril\'" font-size="{size * 2.3:.0f}" fill="{mark}">“</text></g>')
        # the words, on the narrator's timing
        for (i, w, x, y, ww) in pos:
            tw = wt[i]
            if t >= tw - 0.04:
                u = clamp((t - tw + 0.04) / (0.32 if not quiet else 0.45))
                scw = 0.78 + 0.22 * (back_out(u, 1.8) if not quiet else ease_out(u))
                dx = (50 if not quiet else 0) * (1 - ease_out(u))
                dy = (0 if not quiet else 14) * (1 - ease_out(u))
                o += (f'<g opacity="{clamp(u * 2.5):.3f}" transform="translate({x + dx:.1f},{y + dy:.1f}) scale({scw:.4f})">'
                      + text(0, 0, w, size, 'Inter8', txt) + '</g>')
        # the closing mark
        i_last, w_last, xl, yl, wl = pos[-1]
        cs = pop_s(t, we[-1] - 0.1, 0.35, 2.2 if not quiet else 1.2)
        if cs > 0:
            o += (f'<g transform="translate({xl + wl + 8:.1f},{yl:.1f}) scale({cs:.3f})"><text x="0" y="{size * 0.1:.0f}" '
                  f'font-family="\'Abril\'" font-size="{size * 1.25:.0f}" fill="{mark}">”</text></g>')
        # teal underlines, drawn while the words are spoken (one stroke per line they cross)
        for k0, k1 in unders:
            if t < wt[k0]:
                continue
            p = ease_out(clamp((t - wt[k0]) / max(0.3, we[k1] - wt[k0])), 2)
            segs = {}
            for (i, w, x, y, ww) in pos:
                if k0 <= i <= k1:
                    s0, s1 = segs.get(y, (x, x + ww))
                    segs[y] = (min(s0, x), max(s1, x + ww))
            total = sum(s1 - s0 for s0, s1 in segs.values())
            done = p * total
            for y, (s0, s1) in sorted(segs.items()):
                L = min(s1 - s0, done)
                done -= L
                if L > 1:
                    uy = y + size * 0.2
                    o += (f'<path d="M{s0:.1f},{uy:.1f} Q{s0 + (s1 - s0) / 2:.1f},{uy + 9:.1f} {s1:.1f},{uy - 3:.1f}" fill="none" stroke="{line}" '
                          f'stroke-width="{max(7, size * 0.09):.1f}" stroke-linecap="round" stroke-dasharray="{L:.1f} 4000"/>')
        # a teal handwritten note under the quote (a translation, a gloss), written as it is said
        if c.get('note'):
            n = c['note']
            t0, t1 = Wd.at(n['at']), Wd.end(n['to'])
            if t >= t0:
                yb = top + (nlines - 1) * size * 1.2 + 120
                parts, cur = [], ''
                for w in n['text'].split():
                    if cur and len(cur) + 1 + len(w) > 34:
                        parts.append(cur); cur = w
                    else:
                        cur = (cur + ' ' + w).strip()
                parts.append(cur)
                prog = (tq - t0) / max(0.4, t1 - t0)
                total = sum(len(x) for x in parts)
                done = prog * total
                for li, part in enumerate(parts):
                    pp = clamp(done / len(part))
                    done -= len(part)
                    if pp > 0:
                        o += note(QX + 60, yb + li * 62, part, 36, CREAM if bg else TE, prog=pp)
        # the signature writes on after the quote
        if c.get('signature') and t >= we[-1] + 0.25:
            p = ease_io(clamp((t - we[-1] - 0.25) / 0.9))
            ys = top + (nlines - 1) * size * 1.2 + 70
            o += (f'<clipPath id="sw"><rect x="{QX + 50}" y="{ys - 10:.0f}" width="{(SW + 20) * p:.0f}" height="{SH + 40}"/></clipPath>'
                  f'<g clip-path="url(#sw)"><use href="#sig" transform="translate({QX + 60},{ys:.0f})"/></g>')
        z = 1 + 0.03 * clamp(t / (b - a))
        o = f'<g transform="translate(960,540) scale({z:.4f}) translate(-960,-540)">{o}</g>'
        o += tag(40, 1050, c['credit'], 16, '#3a302c' if bg else '#8d857a')
        return {'h': {'ov': o}}
    return S, frame, c['stem'], a, b


if __name__ == '__main__':
    keys = sys.argv[1:] or list(CARDS)
    clips = []
    for k in keys:
        S, frame, stem, a, b = build(k)
        S.write(frame)
        clips.append(encode_clip(S.name, stem, a, b, os.path.join(S.dir, 'clip.mp4')))
        print('card', k, round(b - a, 2), 's', flush=True)
    out = os.path.join(EP, 'renders', 'tests', 'quote_cards.mp4')
    inp = []
    for cl in clips:
        inp += ['-i', cl]
    n = len(clips)
    flt = ''.join(f'[{i}:v][{i}:a]' for i in range(n)) + f'concat=n={n}:v=1:a=1[v][a]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inp + ['-filter_complex', flt, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264',
                    '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', out], check=True)
    print('reel', out)
