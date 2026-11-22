# Sample 1, "The pear is ripe": pull back from a photograph to the desk it lies on. 17 s.
# Opens tight on the USS Boston's landing force in Honolulu (January 1893). The camera pulls back without a cut until
# the photograph is a print on Minister John L. Stevens' desk, then glides to his despatch of 1 February 1893 lying
# beside it, and the one line lights up. MagnatesMedia's pull-back reveal, done the channel's way: one camera, marks on
# twos, every picture credited.
import os, math
from PIL import Image
from kit import *

S = Stage('s1_pear', 17.0, bg='#16140f')
S.defs.append(COMMON_DEFS)
I = lambda p: os.path.join(ROOT, p)

# ---- the desk (world coordinates)
DW, DH = 4400, 2700
S.world.append(f'<image href="{S.img(I("img/desk.jpg"))}" x="0" y="0" width="{DW}" height="{DH}"/>')
# blotter under the letter, a pen, an inkwell: simple shapes so the desk reads as a desk
S.world.append(f'<rect x="2380" y="760" width="1220" height="1380" rx="10" fill="#22281f" opacity="0.92"/><rect x="2380" y="760" width="1220" height="60" fill="#3a3122"/><rect x="2380" y="2080" width="1220" height="60" fill="#3a3122"/>')
S.world.append('<g transform="rotate(-24 3700 700)"><rect x="3330" y="690" width="640" height="16" rx="8" fill="#1d1a16"/><rect x="3330" y="690" width="120" height="16" fill="#8a6d3b"/><polygon points="3970,690 4030,698 3970,706" fill="#b8a27a"/></g>')
S.world.append('<circle cx="3880" cy="420" r="120" fill="#0f0e0c"/><circle cx="3880" cy="420" r="96" fill="#2b2a28"/><circle cx="3866" cy="402" r="40" fill="#5c5a55" opacity="0.5"/><circle cx="3880" cy="420" r="34" fill="#070706"/>')

# ---- the photograph, as a print
ph = Image.open(I('img/raw/boston_landing.jpg'))
PW = 1180; PH = PW * ph.height / ph.width
PX, PY, PROT = 900, 900, -3.0
S.world.append(card(S.img(I('img/raw/boston_landing.jpg')), PX, PY, PW, PH, rot=PROT))
S.world.append(f'<g transform="rotate({PROT} {PX + PW / 2} {PY + PH / 2})">' + tag(PX - 20, PY + PH + 58, 'USS BOSTON LANDING FORCE, HONOLULU, 1893 · HAWAIʻI STATE ARCHIVES PP-36-3-002', 19, '#cfc6b6') + '</g>')

# ---- the despatch (set in type for this film from the published text; only the one sentence is quoted)
LX, LY, LW, LH, LROT = 2470, 860, 1040, 1240, 1.6
P = '#efe6d2'
let = f'<g id="letter" transform="rotate({LROT} {LX + LW / 2} {LY + LH / 2})">'
let += f'<rect x="{LX + 14}" y="{LY + 22}" width="{LW}" height="{LH}" fill="#000" opacity="0.45" filter="url(#soft)"/>'
let += f'<rect x="{LX}" y="{LY}" width="{LW}" height="{LH}" fill="{P}"/>'
let += f'<rect x="{LX}" y="{LY}" width="{LW}" height="{LH}" fill="url(#paperfib)" opacity="0.5"/>'
let += text(LX + LW / 2, LY + 120, 'LEGATION OF THE UNITED STATES,', 34, 'Fell', '#2a241c', 'middle')
let += text(LX + LW - 90, LY + 200, 'Honolulu, February 1, 1893.', 32, 'FellI', '#2a241c', 'end')
let += text(LX + 90, LY + 290, 'Hon. John W. Foster,', 32, 'Fell', '#2a241c')
let += text(LX + 130, LY + 336, 'Secretary of State.', 32, 'FellI', '#2a241c')
let += text(LX + 90, LY + 412, 'Sir:', 32, 'Fell', '#2a241c')
# the lines we do not quote are shown as ruled, unreadable lines, not invented words
for k in range(5):
    y = LY + 470 + k * 56
    let += f'<rect x="{LX + (150 if k == 0 else 90)}" y="{y}" width="{LW - (240 if k == 0 else 180) - (k * 37 % 90)}" height="9" rx="4" fill="#2a241c" opacity="0.16"/>'
QY = LY + 800
let += text(LX + 90, QY, 'The Hawaiian pear is now fully ripe, and this', 40, 'Fell', '#1d1812')
let += text(LX + 90, QY + 58, 'is the golden hour for the United States to', 40, 'Fell', '#1d1812')
let += text(LX + 90, QY + 116, 'pluck it.', 40, 'Fell', '#1d1812')
for k in range(2):
    y = QY + 190 + k * 56
    let += f'<rect x="{LX + 90}" y="{y}" width="{LW - 180 - k * 160}" height="9" rx="4" fill="#2a241c" opacity="0.16"/>'
let += text(LX + LW - 110, LY + LH - 120, 'JOHN L. STEVENS.', 34, 'Fell', '#2a241c', 'end')
let += '</g>'
S.defs.append('<filter id="paperfibf"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.25  0 0 0 0.35 0"/></filter>'
              f'<pattern id="paperfib" width="{LW}" height="{LH}" patternUnits="userSpaceOnUse"><rect width="{LW}" height="{LH}" filter="url(#paperfibf)"/></pattern>')
S.world.append(let)
S.world.append(f'<g transform="rotate({LROT} {LX + LW / 2} {LY + LH / 2})">' + tag(LX, LY + LH + 50, 'STEVENS TO SECRETARY OF STATE FOSTER, 1 FEB 1893 · FOREIGN RELATIONS OF THE U.S. 1894, APP. II · SET IN TYPE FOR THIS FILM', 17, '#cfc6b6') + '</g>')
S.world.append('<g id="marks"></g>')
S.over.append('<g id="ov"></g>')

# ---- the camera
pcx, pcy = PX + PW / 2, PY + PH / 2
z_full = 1920 / (PW * 0.96)                         # the photograph fills the frame
qx, qy = LX + 520, QY + 40
cam = Camera([
    (0.0, pcx + 40, pcy + 10, z_full * 1.06, PROT),
    (2.6, pcx, pcy, z_full, PROT),                    # a slow push in on the photo (holding, but drifting)
    (3.2, pcx + 30, pcy + 10, z_full * 0.93, PROT * 0.85),
    (6.3, 2240, 1460, 0.47, 0.0),                     # the pull back: a print on a desk
    (7.4, 2260, 1450, 0.455, 0.0),
    (9.6, qx - 40, qy - 40, 1.02, LROT * 0.6),        # glide to the letter and push in on the line
    (11.2, qx - 10, qy, 1.22, LROT),
    (17.0, qx + 30, qy + 10, 1.30, LROT),
], wobble=1.4)
S.sounds += whooshes(cam, 0, S.dur, thresh=700, vol=0.24)
S.bed = ['ambience-room-tone-30s', 0.5]
T_LINE = 11.4
S.sound('paper-handle-1', 5.4, 0.45)
S.sound('pencil-write', T_LINE, 0.5)
S.sound('stamp-thud', 14.2, 0.32)


def frame(t):
    tq = step12(t)
    h = {}
    # underline the sentence, line by line (teal, stepped)
    m = ''
    for k, (w_, dy) in enumerate([(820, 0), (790, 58), (175, 116)]):
        p = clamp((tq - T_LINE - k * 0.45) / 0.45)
        y = QY + dy + 14
        m += drawn_path(f'M{LX + 86},{y} C{LX + 86 + w_ * 0.3},{y + 4} {LX + 86 + w_ * 0.7},{y - 3} {LX + 92 + w_},{y + 2}', p, TEAL, 7)
    # loop round "fully ripe"
    p = clamp((tq - (T_LINE + 1.5)) / 0.6)
    m += drawn_path(loop_path(LX + 604, QY - 12, 112, 40, seed=3), p, CORAL, 6)
    h['marks'] = f'<g transform="rotate({LROT} {LX + LW / 2} {LY + LH / 2})">{m}</g>'
    # overlay: a date note at the start, then the title
    o = ''
    if 0.6 < t < 5.8:
        o += note(120, 980, 'Honolulu, January 1893', 40, '#ffffff', clamp((tq - 0.8) / 1.2))
    if t > 14.2:
        o += highlight(110, 170, '“Fully ripe”', 84, prog=clamp((t - 14.2) / (8 / 30)))
        o += note(130, 290, 'the U.S. Minister, two weeks after the overthrow', 34, TEAL, clamp((tq - 14.7) / 1.4))
    h['ov'] = o
    return {'t': {'CAM': cam.transform(t)}, 'h': h}


S.write(frame)
