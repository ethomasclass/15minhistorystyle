# Chapter 3, "The Old Guard": Jefferson and isolationism on the desk, Alaska (and the gold-nugget cut), the 1890 census,
# then the world: a wagon rolls to the edge of the continent. Placeholder timings at 185 wpm, with a 1.2 s silent hold
# for the nugget.
import os
from ep import *

TL = Timeline('ch03_the_old_guard', 185, gaps={'Then people found gold': 1.2})
S = EpStage('ch03', TL.dur, bg='#111111', grain=0.5)
S.defs.append(COMMON_DEFS)
DESK = S.img(HSI('desk_grid_black.jpg'))

t_iso, t_quote = TL.at('That\'s called'), TL.at('entangling alliances')
t_grow, t_ak, t_acre = TL.at('America did grow'), TL.at('In 1867'), TL.at('less than two cents')
t_folly = TL.at("Seward's Folly")
t_nug = t_folly + 0.25                         # the hard cut lands on "Folly"
t_census, t_full, t_where = TL.at('Then the 1890 census'), TL.at('The continent was full'), TL.at('So where next')

# ---- J: Jefferson
jef = S.img(RAW('loc_jefferson_1887.jpg'))
J = desk_bg(DESK) + card(jef, 300, 160, 500, 794, rot=-1.5)
J += '<g transform="rotate(-1.5 550 557)">' + tag(290, 1005, 'THOMAS JEFFERSON · ENGRAVING, 1887 · LIBRARY OF CONGRESS', 17, '#d6f3ee') + '</g>'
J += '<g id="jq"></g>'
# ---- A: Alaska, the check
chk = S.img(RAW('nara_alaska_check.jpg'))
A = desk_bg(DESK) + card(chk, 360, 300, 1200, 594, rot=1.0)
A += '<g transform="rotate(1 960 597)">' + tag(350, 950, 'TREASURY WARRANT FOR THE PURCHASE OF ALASKA, 1868 · U.S. NATIONAL ARCHIVES', 17, '#d6f3ee') + '</g>'
# ---- N: the nugget, alone on the desk
N = desk_bg(DESK) + cut(S, 's3_props', 10, 960, 640, 230, shadow=True)
# ---- C: the census
C = desk_bg(DESK) + paper(380, 330, 1160, 360, rot=-0.6) + '<g id="cq"></g>'
# ---- W: the world, the wagon at the edge of the continent
W = plate(S, 'b1_frontier_cliff') + '<g id="wagon"></g>'
for gid, body in zip('JANCW', (J, A, N, C, W)):
    S.world.append(f'<g id="{gid}" opacity="0">{body}</g>')
S.over.append('<g id="ov"></g>')
_, sp = finfo('s3_props')
HREF = {k: S.img(os.path.join(EPI('flow'), sp['cutouts'][k - 1]['file'])) for k in (4, 6, 8)}
DIM = {k: (sp['cutouts'][k - 1]['w'], sp['cutouts'][k - 1]['h']) for k in (4, 6, 8)}

SH = Shots([
    (0.0, 'J', Camera([(0, 900, 560, 1.0), (t_grow, 860, 540, 1.08)], wobble=0.8)),
    (t_grow, 'A', Camera([(t_grow, 960, 600, 0.98), (t_nug, 960, 590, 1.08)], wobble=0.8)),
    (t_nug, 'N', Camera([(t_nug, 960, 560, 1.0), (t_census, 960, 560, 1.03)], wobble=0.4)),
    (t_census, 'C', Camera([(t_census, 960, 520, 1.0), (t_full, 960, 520, 1.06)], wobble=0.8)),
    (t_full, 'W', Camera([(t_full, 820, 640, 1.35), (t_where, 900, 600, 1.2), (TL.dur, 1060, 440, 1.12)], wobble=0.8)),
])

# the wagon: enters during the census line, rolls right across the grass and stops short of the cliff edge
T0, T1 = t_full - 0.6, t_where - 0.1
X0, X1, Y0, Y1 = -350, 1080, 712, 668
WH = 125                                        # wagon height (px) at that depth


def wagon(t):
    tq = step12(t)
    u = clamp((tq - T0) / (T1 - T0))
    p = 1 - (1 - u) ** 2.2                       # slows to a stop
    x, y = X0 + (X1 - X0) * p, Y0 + (Y1 - Y0) * p
    k = WH / DIM[4][1] * (1 - 0.08 * p)
    ww, wh = DIM[4][0] * k, DIM[4][1] * k
    hw, hh = DIM[8][0] * k * 0.95, DIM[8][1] * k * 0.95
    r = wh * 0.24                                # wheel radius
    dist = (X1 - X0) * p
    ang = math.degrees(dist / r) % 360
    moving = u < 1
    bob = 2.0 * abs(math.sin(tq * 6)) if moving else 0
    o = f'<ellipse cx="{x + ww * 0.1:.0f}" cy="{y + 2:.0f}" rx="{(ww + hw) * 0.5:.0f}" ry="7" fill="#000" opacity="0.22"/>'
    o += f'<image href="{HREF[8]}" x="{x + ww * 0.42:.1f}" y="{y - hh - bob:.1f}" width="{hw:.1f}" height="{hh:.1f}"/>'
    o += f'<image href="{HREF[4]}" x="{x - ww / 2:.1f}" y="{y - wh - r * 0.6:.1f}" width="{ww:.1f}" height="{wh:.1f}"/>'
    for cxw in (x - ww * 0.3, x + ww * 0.28):
        o += f'<image href="{HREF[6]}" x="{cxw - r:.1f}" y="{y - 2 * r:.1f}" width="{2 * r:.1f}" height="{2 * r:.1f}" transform="rotate({ang:.1f} {cxw:.1f} {y - r:.1f})"/>'
    return o


S.sounds.append(['ambience-room-tone-30s', 0.0, 0.35, 0.5, 0.5, t_full])
S.sounds.append(['dry-thud', t_nug, 0.5])
S.sounds.append(['waves_beach', t_full - 0.3, 0.4, 0.6, 0.6, TL.dur - t_full + 0.3])


def frame(t):
    tq = step12(t)
    gid, T, O = SH.frame(t)
    h, o = {}, ''
    if gid == 'J':
        if t > t_iso:
            o += highlight(960, 300, 'Isolationism', 80, prog=clamp((t - t_iso) / (8 / 30)))
            o += note(980, 400, "stay out of other countries'", 34, prog=clamp((tq - t_iso - 0.4) / 1.0))
            o += note(980, 470, 'wars and alliances', 34, prog=clamp((tq - t_iso - 1.2) / 0.8))
        q = ''
        if t > t_quote:
            q += paper(930, 600, 840, 230, rot=1.2)
            p = clamp((tq - t_quote) / (TL.end('with none') - t_quote))
            q += typed(980, 700, ['"entangling alliances', 'with none."'], 52, p)
            if p >= 1:
                q += tag(980, 805, 'JEFFERSON, FIRST INAUGURAL ADDRESS, 1801', 17, '#5b5040')
        h['jq'] = q
    if gid == 'A':
        if t > t_ak:
            o += slip(1720, 210, 'Alaska, 1867   ', 34, clamp((tq - t_ak) / 0.9), anchor='end', rot=1.5)
        if t > TL.at('$7.2 million'):
            o += note(380, 250, '$7.2 million', 44, prog=clamp((tq - TL.at('$7.2 million')) / 0.8))
        if t > t_acre:
            o += note(1560, 1000, 'under 2¢ an acre', 40, prog=clamp((tq - t_acre) / 0.9), anchor='end')
        if t > TL.at('one nickname stuck'):
            o += slip(200, 1000, '"Seward\'s Folly"   ', 34, clamp((tq - TL.at('one nickname stuck')) / 0.9), rot=-1.5)
    if gid == 'C':
        p = clamp((tq - TL.at('there can hardly')) / (TL.end('frontier line') - TL.at('there can hardly')))
        h['cq'] = typed(440, 460, ['"there can hardly be said', 'to be a frontier line"'], 56, p)
        if p >= 1:
            h['cq'] += tag(440, 650, 'SUPERINTENDENT OF THE CENSUS, 1890, AS QUOTED BY F. J. TURNER, 1893', 17, '#5b5040')
    if gid == 'W':
        o += ''
    h['wagon'] = wagon(t) if gid == 'W' else ''
    h['ov'] = o
    return {'t': T, 'o': O, 'h': h}


if __name__ == '__main__':
    S.write(frame)
