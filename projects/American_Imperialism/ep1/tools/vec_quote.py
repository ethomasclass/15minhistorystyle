# Style test: a vector quote card in the channel palette, timed to the narration (ch 3: Jefferson, "entangling alliances
# with none"). The portrait is traced from the real 1887 engraving (Library of Congress) into flat tones inside a cut-corner
# block like the logo's slabs; the name goes on the orange strip; the quote's words rise in as they are spoken; teal
# underlines the key words; the traced signature writes on; source tags in mono.
#   python3 tools/vec_quote.py && node ../../Hawaii_Samples/tools/anim_render.mjs build/vec_quote && \
#   python3 ../../Hawaii_Samples/tools/encode.py build/vec_quote build/vec_quote/silent.mp4
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.abspath(os.path.join(HERE, '..'))
sys.path.insert(0, os.path.join(EP, '..', '..', 'Hawaii_Samples', 'tools'))
sys.path.insert(0, HERE)
from kit import Stage, clamp, back_out, ease_out, step12, text, highlight, tag, COMMON_DEFS   # noqa: E402
from vtrace import trace, trace_ink                                                          # noqa: E402

CREAM, BONE, INK = '#F4EFE6', '#EDE7DC', '#111111'
OR, TE, TE_D, CO = '#FF9F1C', '#2FE0C4', '#1fae98', '#FF6F61'
T0 = 11.0                                     # where the clip starts in ch 3
W_ = json.load(open(os.path.join(EP, 'public', 'audio', 'ch03_the_old_guard.words.json')))['words']


def at(word, k=1):
    n = 0
    for w in W_:
        if w['w'].strip('".,:').lower().startswith(word.lower()):
            n += 1
            if n == k:
                return w['s'] - T0, w['e'] - T0
    raise KeyError(word)


DUR = at('none')[1] + 2.0
S = Stage('vec_quote', DUR, bg='#16140f', press=False, grain=0.35)
S.dir = os.path.join(EP, 'build', 'vec_quote')
os.makedirs(S.dir, exist_ok=True)
S.defs.append(COMMON_DEFS.replace('stdDeviation="14"', 'stdDeviation="10"'))
S.defs.append('<radialGradient id="desk" cx="45%" cy="40%" r="75%"><stop offset="0" stop-color="#2a2620"/>'
              '<stop offset="0.7" stop-color="#16140f"/><stop offset="1" stop-color="#0d0c09"/></radialGradient>')
S.world.append('<rect width="1920" height="1080" fill="url(#desk)"/><g opacity="0.12">'
               + ''.join(f'<rect x="0" y="{y}" width="1920" height="1" fill="#fff" opacity="0.35"/>' for y in range(32, 1080, 64)) + '</g>')

# ---- the traced portrait and signature (made once)
JEFF = os.path.join(EP, 'img', 'raw', 'loc_jefferson_1887.jpg')
PW = 520
portrait, (_, PH) = trace(JEFF, crop=(190, 235, 860, 1060), colors=[INK, '#16675b', TE_D, CREAM], width=PW, work=520, blur=5,
                          cuts=[45, 70, 88], eps=0.8, min_area=160)
sig, (SW, SH) = trace_ink(JEFF, crop=(240, 1360, 720, 1515), width=430, color=CREAM, thresh=175)
C = 34                                        # the cut corners


def slab(w, h, c):
    return f'M{c},0 L{w - c},0 L{w},{c} L{w},{h - c} L{w - c},{h} L{c},{h} L0,{h - c} L0,{c} z'


S.defs.append(f'<clipPath id="pclip"><path d="{slab(PW, PH, C)}"/></clipPath>')
S.defs.append(f'<g id="portrait">{portrait}</g><g id="sig">{sig}</g>')
S.over.append('<g id="ov"></g>')

PX, PY = 220, 150                             # portrait block, top-left
QX = 900                                      # quote column
LINES = [('"entangling', 360), ('alliances', 500), ('with none.', 640)]
WORD_T = {'"entangling': at('entangling')[0], 'alliances': at('alliances')[0], 'with': at('with')[0], 'none.': at('none')[0]}


def pop(t, t0, d=0.34):
    return back_out((step12(t) - t0) / d) if t >= t0 else 0.0


def frame(t):
    tq = step12(t)
    o = ''
    tj = at('Thomas')[0]
    s = pop(t, tj, 0.4)
    if s > 0:
        cx, cy = PX + PW / 2, PY + PH / 2
        o += (f'<g transform="translate({cx},{cy}) scale({s:.4f}) translate({-PW / 2},{-PH / 2})">'
              f'<path d="{slab(PW, PH, C)}" fill="#0d0c09" transform="translate(10,12)"/>'
              f'<g clip-path="url(#pclip)"><use href="#portrait"/></g>'
              f'<path d="{slab(PW, PH, C)}" fill="none" stroke="{TE}" stroke-width="6"/></g>')
    tn = at('Jefferson')[0]
    if t >= tn:
        o += highlight(PX - 10, PY + PH + 86, 'THOMAS JEFFERSON', 52, prog=(tq - tn) / 0.27)
    if t >= at('first')[0]:
        o += tag(PX, PY + PH + 140, 'FIRST INAUGURAL ADDRESS, MARCH 4, 1801', 20, '#b9b1a3')
    tq0 = WORD_T['"entangling'] - 0.25
    qs = pop(t, tq0, 0.3)
    if qs > 0:
        o += f'<g transform="translate({QX - 20},300) scale({qs:.3f})"><text x="0" y="0" font-family="\'Abril\'" font-size="300" fill="{OR}">“</text></g>'
    # the words rise in as they're spoken (the opening quotation mark is the big orange one)
    for line, y in LINES:
        x = QX + 130
        for wd in line.split():
            key = wd if wd in WORD_T else wd
            tw = WORD_T.get(key, WORD_T.get(wd.strip('"'), 0))
            shown = wd.lstrip('"')
            wpx = len(shown) * 66 + 34
            if t >= tw:
                u = ease_out((tq - tw) / 0.25)
                o += (f'<g opacity="{u:.3f}" transform="translate(0,{24 * (1 - u):.1f})">'
                      + text(x, y, shown, 120, 'Inter8', CREAM) + '</g>')
            x += wpx
    tc = at('none')[1]
    cs = pop(t, tc - 0.1, 0.3)
    if cs > 0:                                # the closing mark, orange like the opening one
        o += f'<g transform="translate({QX + 772},668) scale({cs:.3f})"><text x="0" y="0" font-family="\'Abril\'" font-size="150" fill="{OR}">”</text></g>'
    # teal underline under the key words, drawn while they're spoken
    tw0, tw1 = at('with')[0], at('none')[1]
    if t >= tw0:
        p = clamp((tq - tw0) / max(0.3, tw1 - tw0))
        o += (f'<path d="M{QX + 130},672 Q{QX + 420},686 {QX + 760},668" fill="none" stroke="{TE}" stroke-width="12" '
              f'stroke-linecap="round" stroke-dasharray="{700 * p:.0f} 900"/>')
    # the signature writes on after the quote
    ts = at('none')[1] + 0.2
    if t >= ts:
        p = clamp((tq - ts) / 0.8)
        o += (f'<clipPath id="sw"><rect x="{QX + 120}" y="730" width="{(SW + 20) * p:.0f}" height="{SH + 40}"/></clipPath>'
              f'<g clip-path="url(#sw)"><use href="#sig" transform="translate({QX + 130},740)"/></g>')
    o += tag(40, 1050, 'PORTRAIT: T. JOHNSON, AFTER GILBERT STUART, 1887 · LIBRARY OF CONGRESS (TRACED)', 16, '#8d857a')
    return {'h': {'ov': o}}


if __name__ == '__main__':
    S.write(frame)
