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
        if w['s'] < T0 - 0.1:                 # only words inside this clip (ch 3 says "alliances" earlier too)
            continue
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


def ease_io(u):
    u = clamp(u)
    return 4 * u ** 3 if u < 0.5 else 1 - (-2 * u + 2) ** 3 / 2


def pop_s(t, t0, d=0.34, s_=1.6):
    """a smooth pop (not stepped): 0 before t0, overshoots a little, settles at 1"""
    return back_out((t - t0) / d, s_) if t >= t0 else 0.0


T_WORDS = WORD_T['"entangling']
T_SLIDE = T_WORDS - 0.85                      # the portrait glides left just before the quote starts
CX1, CY1 = PX + PW / 2, PY + PH / 2           # where the portrait block ends up (its centre)
CX0, CY0, SC0 = 960, 430, 1.12                # where it starts: centre stage, a little larger


def frame(t):
    tq = step12(t)
    o = ''
    # ---- the portrait group: pops in at centre, the name and source land under it, then it glides left
    tj, tn = at('Thomas')[0], at('Jefferson')[0]
    s = pop_s(t, tj, 0.45)
    if s > 0:
        u = ease_io((t - T_SLIDE) / 0.65)
        cx, cy = CX0 + (CX1 - CX0) * u, CY0 + (CY1 - CY0) * u
        sc = (SC0 + (1.0 - SC0) * u) * s
        rot = -5 * (1 - clamp((t - tj) / 0.45)) + 2.2 * __import__('math').sin(u * 3.14159)   # settles, then tips as it moves
        grp = (f'<path d="{slab(PW, PH, C)}" fill="#0d0c09" transform="translate({PX + 10},{PY + 12})"/>'
               f'<g transform="translate({PX},{PY})"><g clip-path="url(#pclip)"><use href="#portrait"/></g>'
               f'<path d="{slab(PW, PH, C)}" fill="none" stroke="{TE}" stroke-width="6"/></g>')
        if t >= tn:
            grp += highlight(PX - 10, PY + PH + 86, 'THOMAS JEFFERSON', 52, prog=(tq - tn) / 0.27)
        tf = at('first')[0]
        if t >= tf:
            grp += f'<g opacity="{clamp((t - tf) / 0.3):.3f}">' + tag(PX, PY + PH + 140, 'FIRST INAUGURAL ADDRESS, MARCH 4, 1801', 20, '#b9b1a3') + '</g>'
        o += f'<g transform="translate({cx:.1f},{cy:.1f}) rotate({rot:.2f}) scale({sc:.4f}) translate({-CX1:.1f},{-CY1:.1f})">{grp}</g>'
    # ---- the opening mark drops in with a swing
    tq0 = T_WORDS - 0.3
    if t >= tq0:
        u = clamp((t - tq0) / 0.4)
        qs, qr, qy = pop_s(t, tq0, 0.4, 2.2), -28 * (1 - back_out(u, 2.4)), -60 * (1 - ease_out(u))
        o += (f'<g transform="translate({QX + 40},{240 + qy:.1f}) rotate({qr:.2f}) scale({qs:.3f})">'
              f'<text x="-60" y="60" font-family="\'Abril\'" font-size="300" fill="{OR}">“</text></g>')
    # ---- the words: each slides in from the right, scales up past full size and settles, as it is spoken
    tnone = at('none')[0]
    for line, y in LINES:
        x = QX + 130
        for wd in line.split():
            tw = WORD_T.get(wd, WORD_T.get(wd.strip('"'), 0))
            shown = wd.lstrip('"')
            wpx = len(shown) * 66 + 34
            if t >= tw - 0.04:
                u = clamp((t - tw + 0.04) / 0.32)
                sc = 0.72 + 0.28 * back_out(u, 2.0)
                if shown == 'none.':                 # a small punch on the last word
                    sc *= 1 + 0.07 * __import__('math').sin(clamp((t - tnone - 0.2) / 0.3) * 3.14159)
                dx = 70 * (1 - ease_out(u))
                o += (f'<g opacity="{clamp(u * 2.5):.3f}" transform="translate({x + dx:.1f},{y}) scale({sc:.4f})">'
                      + text(0, 0, shown, 120, 'Inter8', CREAM) + '</g>')
            x += wpx
    tc = at('none')[1]
    cs = pop_s(t, tc - 0.1, 0.35, 2.2)
    if cs > 0:                                # the closing mark, orange like the opening one
        o += f'<g transform="translate({QX + 772},668) scale({cs:.3f})"><text x="0" y="0" font-family="\'Abril\'" font-size="150" fill="{OR}">”</text></g>'
    # teal underline under the key words, drawn while they're spoken
    tw0, tw1 = at('with')[0], at('none')[1]
    if t >= tw0:
        p = ease_out(clamp((t - tw0) / max(0.3, tw1 - tw0)), 2)
        o += (f'<path d="M{QX + 130},672 Q{QX + 420},686 {QX + 760},668" fill="none" stroke="{TE}" stroke-width="12" '
              f'stroke-linecap="round" stroke-dasharray="{700 * p:.0f} 900"/>')
    # the signature writes on after the quote
    ts = at('none')[1] + 0.25
    if t >= ts:
        p = ease_io(clamp((t - ts) / 0.9))
        o += (f'<clipPath id="sw"><rect x="{QX + 120}" y="730" width="{(SW + 20) * p:.0f}" height="{SH + 40}"/></clipPath>'
              f'<g clip-path="url(#sw)"><use href="#sig" transform="translate({QX + 130},740)"/></g>')
    # a slow push-in over the whole card, so it never sits dead still
    z = 1 + 0.03 * clamp(t / DUR)
    o = f'<g transform="translate(960,540) scale({z:.4f}) translate(-960,-540)">{o}</g>'
    o += tag(100, 1014, 'PORTRAIT: T. JOHNSON, AFTER GILBERT STUART, 1887 · LIBRARY OF CONGRESS (TRACED)', 16, '#8d857a')
    return {'h': {'ov': o}}


if __name__ == '__main__':
    S.write(frame)
