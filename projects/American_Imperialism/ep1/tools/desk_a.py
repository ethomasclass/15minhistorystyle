# Ep 1 desk joins and small pieces (the "deskA" set), in the vector style of explainers.py, each keyed to the narration:
#   palace_print     join 3, ch 2 "So when America ... living them out": the cold open's palace wide (its last frame)
#                    shrinks from the full frame into a print lying on the warm desk; the question balance comes up beside
#                    it and BETRAYAL and EXPRESSION drop onto it on their words
#   long_desk        ch 3, the whole chapter on one desk: globe and fence, ISOLATIONISM, the Jefferson card, the Alaska
#                    warrant, the Seward card, then the hard cut to the gold nugget (the joke), and the census map; the
#                    camera glides from piece to piece on the words (each piece's own drawing code, laid out on the desk)
#   census_end       join 4, ch 3 "So where next?": ch03_explainers.census with its new ending (the ink beads at the coast,
#                    the camera slides west into the open sea, which is the pitch-room wall map: the last 0.4 s is H4)
#   federation       join 7, ch 4 "At the same time, Britain, France and Germany ...": the steamship sails off the coal
#                    map onto the 1886 Imperial Federation map; French and German holdings ink in (approximate), the U.S.
#                    alone; ends on the scan filling the frame, flat and square-on (H8 for the pitch room)
#   tariff_ends      joins 12 and 13: explainers.tariff_1875 with its H12 head (the harbor's sack) and its field tail
#   kalakaua_head    join 15: the Kalākaua name card (qcard.py) opening on a full frame of flat orange
#   stevens_l3       ch 6 "John Stevens ... USS Boston": his lower third, rendered with alpha, plus a preview over the
#                    harbor wide
#   constitution     ch 6 "and its new money and property rules ... People called it the": the 1887 constitution, drawn
#                    (no scan shown), the Honolulu Rifles behind it as flat ink silhouettes
#   python3 tools/desk_a.py [key ...]            render each to renders/tests/transitions/
#   python3 tools/desk_a.py --still key t ...    stills at t s into the piece, in build/deskA/stills
#   python3 tools/desk_a.py --check key          the text-edge probe (no text in the outer 5%) on every 3rd frame
#   python3 tools/desk_a.py --sheet              the contact sheet renders/tests/transitions/deskA_sheet.jpg
import json, math, os, re, shutil, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vkit import *   # noqa: F401,F403
from vkit import EP, KIT
from kit import card, Spline, ease_in, note
from vtrace import trace

Image.MAX_IMAGE_PIXELS = None
B = os.path.join(EP, 'build', 'deskA')
TR = os.path.join(EP, 'renders', 'tests', 'transitions')
ARC = lambda f: os.path.join(EP, 'img', 'archival', f)
os.makedirs(B, exist_ok=True)
os.makedirs(TR, exist_ok=True)
SAFE = (96, 54, 1824, 1026)                      # text stays inside the outer 5%
TAGC = '#8d857a'


def dstage(name, dur, **kw):
    """vkit.stage, its frames under build/deskA/<name>"""
    return stage('deskA/' + name, dur, **kw)


# ================================================================ render, encode, check
def run_node(js, *args):
    p = os.path.join(B, '_' + js[0])
    open(p, 'w').write(js[1])
    return subprocess.run(['node', p] + [str(a) for a in args], check=True, capture_output=True, text=True).stdout


REQ = f"import {{createRequire}} from 'module';const {{chromium}} = createRequire('{os.path.join(KIT, 'anim_render.mjs')}')('playwright');"
APPLY = ("const ap=(fr)=>{for(const id in (fr.t||{}))document.getElementById(id).setAttribute('transform',fr.t[id]);"
         "for(const id in (fr.h||{}))document.getElementById(id).innerHTML=fr.h[id];"
         "for(const id in (fr.o||{}))document.getElementById(id).setAttribute('opacity',fr.o[id]);"
         "for(const id in (fr.a||{}))for(const k in fr.a[id])document.getElementById(id).setAttribute(k,fr.a[id][k]);};")

# the text-edge probe: every <text> on screen (with some opacity) must sit inside the safe box
EDGE_JS = ('edge.mjs', REQ + """
import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'url';
const dir = path.resolve(process.argv[2]); const step = +(process.argv[3] ?? 3);
const [X0, Y0, X1, Y1] = process.argv[4].split(',').map(Number);
const b = await chromium.launch(); const page = await b.newPage({viewport: {width: 1920, height: 1080}});
await page.goto(pathToFileURL(path.join(dir, 'base.html')).href);
await page.evaluate(async () => { await Promise.all([...document.fonts].map((f) => f.load().catch(() => 0))); });
const lines = fs.readFileSync(path.join(dir, 'frames.ndjson'), 'utf8').trim().split('\\n');
const out = [];
for (let i = 0; i < lines.length; i += step) {
  const bad = await page.evaluate(([fr, X0, Y0, X1, Y1]) => {
    """ + APPLY + """ ap(fr);
    const res = [];
    for (const t of document.querySelectorAll('text')) {
      if (t.closest('defs')) continue;
      const r = t.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || r.right < 0 || r.left > 1920 || r.bottom < 0 || r.top > 1080) continue;
      let op = 1, e = t;
      while (e && e.getAttribute) { const o = e.getAttribute('opacity'); if (o !== null) op *= +o; e = e.parentNode; }
      if (op < 0.05) continue;
      if (r.left < X0 || r.right > X1 || r.top < Y0 || r.bottom > Y1)
        res.push(t.textContent.slice(0, 32) + ' @' + [r.left, r.top, r.right, r.bottom].map(Math.round).join(','));
    }
    return res;
  }, [JSON.parse(lines[i]), X0, Y0, X1, Y1]);
  for (const s of bad) out.push(i + ' ' + s);
}
console.log(JSON.stringify(out)); await b.close();
""")

# frames with alpha (the lower third): like anim_render.mjs, but transparent
ALPHA_JS = ('alpha.mjs', REQ + """
import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'url';
const dir = path.resolve(process.argv[2]);
const b = await chromium.launch(); const page = await b.newPage({viewport: {width: 1920, height: 1080}});
await page.goto(pathToFileURL(path.join(dir, 'base.html')).href);
await page.evaluate(async () => { await Promise.all([...document.fonts].map((f) => f.load().catch(() => 0)));
  await Promise.all([...document.querySelectorAll('image')].map((im) => im.decode ? im.decode().catch(() => 0) : 0)); });
fs.mkdirSync(path.join(dir, 'fa'), {recursive: true});
const lines = fs.readFileSync(path.join(dir, 'frames.ndjson'), 'utf8').trim().split('\\n');
for (let i = 0; i < lines.length; i++) {
  await page.evaluate((fr) => { """ + APPLY + """ ap(fr); }, JSON.parse(lines[i]));
  await page.screenshot({path: path.join(dir, 'fa', String(i).padStart(4, '0') + '.png'), omitBackground: true});
}
await b.close();
""")


def edge_check(S, step=3):
    bad = json.loads(run_node(EDGE_JS, S.dir, step, ','.join(map(str, SAFE))).strip().splitlines()[-1])
    frames = sorted({int(x.split()[0]) for x in bad})
    print(f'edge check {S.name}: {len(frames)} of {int(round(S.dur * FPS)) // step + 1} sampled frames with text in the outer 5%')
    seen = set()
    for x in bad:
        k = x.split(' ', 1)[1].split(' @')[0]
        if k not in seen:
            seen.add(k)
            print('   ', x)
    return bad


def to720(src, dst, crf=25):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', 'scale=1280:720:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow',
                    '-crf', str(crf), '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', dst], check=True)
    return dst


def finish(piece, out_name):
    """write, render, encode (the kit finish and the narration), then the 720p test copy"""
    S, frame, stem, a, b = piece
    S.write(frame)
    clip = os.path.join(S.dir, 'clip.mp4')
    if S.sounds:
        import ch03_explainers as C3
        C3.encode_mix(S, stem, a, b, clip)
    else:
        encode_clip(S.name, stem, a, b, clip)
    return to720(clip, os.path.join(TR, out_name))


def render_frames(S, idx, dest_names):
    """render only the frames idx of a written stage (one browser), to the given paths"""
    d = S.dir + '_st'
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d)
    for f in os.listdir(S.dir):
        if f == 'base.html' or re.match(r'(i\d+|L_.*)\.', f):
            os.symlink(os.path.join(S.dir, f), os.path.join(d, f))
    lines = open(os.path.join(S.dir, 'frames.ndjson')).read().splitlines()
    open(os.path.join(d, 'frames.ndjson'), 'w').write('\n'.join(lines[min(i, len(lines) - 1)] for i in idx) + '\n')
    subprocess.run(['node', os.path.join(KIT, 'anim_render.mjs'), d], check=True, capture_output=True)
    for k, p in enumerate(dest_names):
        shutil.move(os.path.join(d, 'f', f'{k:04d}.png'), p)
    shutil.rmtree(d, ignore_errors=True)
    return dest_names


def stills(piece, times):
    S, frame, stem, a, b = piece
    S.write(frame)
    ts = [S.dur + float(x) if float(x) < 0 else float(x) for x in times]
    os.makedirs(os.path.join(B, 'stills'), exist_ok=True)
    base = S.name.split('/')[-1]
    return render_frames(S, [int(round(t * FPS)) for t in ts], [os.path.join(B, 'stills', f'{base}_{t:05.2f}.png') for t in ts])


def print_card(href, w, h, border=None):
    """the channel's photo print, centred on 0,0: cream border, soft shadow (the image is w x h)"""
    bd = border if border is not None else max(8, 0.025 * w)
    return (f'<rect x="{-w / 2 - bd + 10:.1f}" y="{-h / 2 - bd + 16:.1f}" width="{w + 2 * bd:.1f}" height="{h + 2 * bd:.1f}" fill="#000" opacity="0.5" filter="url(#soft)"/>'
            f'<rect x="{-w / 2 - bd:.1f}" y="{-h / 2 - bd:.1f}" width="{w + 2 * bd:.1f}" height="{h + 2 * bd:.1f}" fill="{CREAM}"/>'
            f'<image href="{href}" x="{-w / 2:.1f}" y="{-h / 2:.1f}" width="{w:.1f}" height="{h:.1f}" preserveAspectRatio="xMidYMid slice"/>')


# ================================================================ 1 · join 3: the palace becomes a print on the desk
PALACE = os.path.join(EP, 'blender', 'build', 'f', '1052.png')


def palace_print():
    stem = 'ch02_the_question'
    W0 = Words(stem)
    a = W0.at('So when America') - 0.3
    b = W0.end('living them out') + 1.2
    Wd = Words(stem, t0=a)
    S = dstage('palace_print', b - a)
    src = os.path.join(B, 'palace_1052.png')
    if not os.path.exists(src):
        shutil.copy(PALACE, src)
    href = S.img(src)
    S.world.append('<g id="pr"></g>')
    S.over.append('<g id="ov"></g>')
    t_taking, t_places, t_b, t_l = Wd.at('taking control'), Wd.at('other places'), Wd.at('betraying'), Wd.at('living')
    T0, T1 = 0.12, t_places - 0.15                       # the pull: from the full frame to the print on the desk
    PCX, PCY, PW, PROT = 500, 530, 660, -3.2               # the print's rest: centre, width, tilt
    BX, BY, BS, L = 1345, 470, 0.55, 470                    # the balance: pivot, scale, beam half-length (unscaled)
    bd = 0.025 * 1920                                      # the print's border, in image px (off frame at full size)

    def tilt(t):                                           # degrees, left side down; it never settles (kit_reel.seg_b)
        if t < t_b:
            return 0.0
        if t < t_l:
            return 7 * back_out((t - t_b) / 0.55, 1.3)
        return 7 * math.cos(2 * math.pi * (t - t_l) / 2.6) * (0.75 + 0.25 * math.exp(-(t - t_l)))

    def tab(word):
        return (f'<path d="{tablet(270, 80, 22)}" fill="#0d0c09" transform="translate(8,10)"/>'
                f'<path d="{tablet(270, 80, 22)}" fill="{CREAM}"/>' + text(0, 24, word, 66, 'Abril', INK, 'middle'))

    def frame(t):
        tq = step12(t)
        # the print: one smooth move (a camera's, so not on twos), sizes in log space; then it drifts
        u = ease_io(clamp((t - T0) / (T1 - T0)))
        k = PW / 1920
        s = k ** u
        f = (1 - s) / (1 - k)
        cx, cy = 960 + (PCX - 960) * f, 540 + (PCY - 540) * f
        cy -= 26 * math.sin(math.pi * f)                     # a slight lift as it goes down onto the desk
        rot = PROT * f + 0.25 * math.sin(t * 0.7) * f
        if t > T1:
            cx += 4 * math.sin((t - T1) * 0.6)
        shad = (f'<rect x="{-960 - bd + 14:.1f}" y="{-540 - bd + 22:.1f}" width="{1920 + 2 * bd:.1f}" height="{1080 + 2 * bd:.1f}" fill="#000" '
                f'opacity="{0.55 * f:.3f}" filter="url(#soft)"/>')
        pr = (f'<g transform="translate({cx:.1f},{cy:.1f}) rotate({rot:.3f}) scale({s:.5f})">{shad}'
              f'<rect x="{-960 - bd:.1f}" y="{-540 - bd:.1f}" width="{1920 + 2 * bd:.1f}" height="{1080 + 2 * bd:.1f}" fill="{CREAM}"/>'
              f'<image href="{href}" x="-960" y="-540" width="1920" height="1080"/></g>')
        # the balance (kit_reel.seg_b, smaller): the stand comes up as the print lands, the tablets drop on their words
        o = ''
        sb = pop(t, t_places - 0.05, 0.4)
        if sb > 0:
            tau = tilt(t)
            th = math.radians(-tau)
            lx, ly = -L * math.cos(th), -L * math.sin(th)
            rx, ry = L * math.cos(th), L * math.sin(th)
            body = (f'<path d="M-90,300 L90,300 L0,6 z" fill="{BONE_D}"/><path d="M0,6 L90,300 L30,300 z" fill="#a89f8e"/>'
                    f'<rect x="-170" y="300" width="340" height="26" fill="{BONE_D}"/>'
                    f'<g transform="rotate({-tau:.2f})"><rect x="{-L - 10}" y="-9" width="{2 * L + 20}" height="18" rx="9" fill="{TE}"/></g>'
                    f'<circle r="20" fill="{CREAM}"/><circle r="8" fill="{INK}"/>')
            for (ex, ey), word, tw in (((lx, ly), 'BETRAYAL', t_b), ((rx, ry), 'EXPRESSION', t_l)):
                if t >= tw - 0.25:                          # it drops from above the frame, three drawings, then lands
                    du = clamp((tq - tw + 0.25) / 0.25)
                    ty = ey + 190 - (1 - du ** 2) * 900
                    land = (tq - tw) if tq >= tw else -1
                    sq = 1 + 0.14 * math.exp(-land * 7) * math.cos(land * 18) if land >= 0 else 1.0
                    if du >= 1:
                        body += (f'<path d="M{ex - 180:.1f},{ty - 80:.1f} L{ex:.1f},{ey:.1f} L{ex + 180:.1f},{ty - 80:.1f}" fill="none" '
                                 f'stroke="{BONE_D}" stroke-width="4"/>')
                    body += f'<g transform="translate({ex:.1f},{ty + 80:.1f}) scale({1 / sq:.3f},{sq:.3f}) translate(0,-80)">{tab(word)}</g>'
            o += f'<g transform="translate({BX},{BY + 120 * BS}) scale({sb * BS:.4f}) translate(0,-120)">{body}</g>'
            if t >= t_places + 0.2:
                o += (f'<g opacity="{clamp((t - t_places - 0.2) / 0.4):.3f}">'
                      + text(BX, 290, 'THE QUESTION THIS SERIES ASKS', 22, 'Plex', TAG, 'middle', extra='letter-spacing="3"') + '</g>')
        return {'h': {'pr': pr, 'ov': o}}
    return S, frame, stem, a, b


# ================================================================ 5, 6 · joins 12 and 13: the tariff gate's head and tail
def tariff_ends():
    import explainers as EX
    S, frame, stem, a, b = EX.tariff_1875(head=True, tail=True)
    S.name = 'deskA/tariff_1875'
    S.dir = os.path.join(B, 'tariff_1875')
    os.makedirs(S.dir, exist_ok=True)
    return S, frame, stem, a, b


# ================================================================ 7 · join 15: the Kalākaua card opens on flat orange
def kalakaua_head():
    import qcard
    S, frame, stem, a, b = qcard.build_name('kalakaua')
    old = S.dir
    S.name = 'deskA/qc_kalakaua'
    S.dir = os.path.join(B, 'qc_kalakaua')
    os.makedirs(S.dir, exist_ok=True)
    for f in os.listdir(old):                              # its pictures (none for a traced card, but keep the pattern)
        if re.match(r'i\d+\.', f):
            shutil.copy(os.path.join(old, f), S.dir)
    return S, frame, stem, a, b



# ================================================================ 8 · the Stevens lower third (alpha), ch 6
def halo_text(x, y, s, size, family='Plex', fill=CREAM, anchor='start', sw=5, extra=''):
    """type with an ink halo, readable over the 3D harbor"""
    return text(x, y, s, size, family, fill, anchor, extra=f'stroke="{INK}" stroke-width="{sw}" paint-order="stroke" stroke-linejoin="round" {extra}')


def stevens_l3():
    stem = 'ch06_the_heist'
    W0 = Words(stem)
    a = W0.at('John Stevens') - 0.4
    t_out_abs = W0.end('USS Boston') + 0.2
    b = t_out_abs + 0.4
    Wd = Words(stem, t0=a)
    S = dstage('stevens_l3', b - a, bg=False, grain=0.0)
    S.bg = 'transparent'
    t_in, t_st, t_ord, t_ash = Wd.at('John') - 0.1, Wd.end('Stevens'), Wd.at('ordered'), Wd.end('ashore')
    t_out = t_out_abs - a
    src = os.path.join(B, 'stevens_src.png')
    im = Image.open(ARC('ch06_john_l_stevens.jpg')).convert('L')
    w0, h0 = im.size
    im.crop((int(0.03 * w0), int(0.02 * h0), int(0.93 * w0), int(0.74 * h0))).save(src)
    PW = 210
    psvg, (_, PH) = trace(src, colors=[INK, '#16675b', TE_D, CREAM], width=PW, work=520, blur=5, cuts=[30, 55, 80], eps=0.8, min_area=120)
    PH = min(PH, 250)
    PX, PY = 128, 1000 - 52 - PH                           # the slab's bottom sits at y = 948
    S.defs.append(f'<clipPath id="spc"><path d="{slab(PW, PH, 22)}"/></clipPath><g id="sport">{psvg}</g>'
                  '<radialGradient id="l3v" cx="30%" cy="85%" r="60%"><stop offset="0" stop-color="#000" stop-opacity="0.55"/>'
                  '<stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>')
    S.over.append('<g id="ov"></g>')
    TX = PX + PW + 34                                      # the type column

    def frame(t):
        tq = step12(t)
        if t < t_in:
            return {'h': {'ov': ''}}
        out = clamp((tq - t_out) / 0.25) if t >= t_out else 0.0      # it all drops away on twos at the end
        k = 1 - out
        if k <= 0:
            return {'h': {'ov': ''}}
        o = f'<rect x="0" y="560" width="1300" height="520" fill="url(#l3v)" opacity="{clamp((t - t_in) / 0.4) * k:.3f}"/>'
        v = ease_out(clamp((t - t_in) / 0.4), 3)
        sp = pop(t, t_in, 0.34) * k
        slab_ = (f'<path d="{slab(PW, PH, 22)}" fill="#0d0c09" opacity="0.6" transform="translate(8,10)"/>'
                 f'<g clip-path="url(#spc)"><use href="#sport"/></g><path d="{slab(PW, PH, 22)}" fill="none" stroke="{TE}" stroke-width="5"/>')
        o += g(PX + PW / 2 - 140 * (1 - v), PY + PH / 2, sp, f'<g transform="translate({-PW / 2},{-PH / 2})">{slab_}</g>', rot=-3 * (1 - v))
        ty = PY + PH * 0.42
        grp = highlight(TX, ty, 'JOHN L. STEVENS', 50, prog=(tq - t_in - 0.12) / 0.27)
        if t >= t_st:
            grp += f'<g opacity="{clamp((t - t_st) / 0.3):.3f}">' + halo_text(TX + 6, ty + 50, 'U.S. MINISTER TO HAWAIʻI', 21, extra='letter-spacing="2"') + '</g>'
        if t >= t_ord:
            grp += note(TX + 4, ty + 122, 'not authorized by Congress', 30, TE, prog=(tq - t_ord) / max(0.6, t_ash - t_ord))
        grp += (f'<g opacity="{clamp((t - t_in - 0.4) / 0.3):.3f}">'
                + halo_text(PX, 1010, 'PORTRAIT: JOHN L. STEVENS, BEFORE 1895 · WIKIMEDIA COMMONS (TRACED)', 14, fill='#e6dfd2', sw=3.5) + '</g>')
        if out > 0:
            grp = f'<g transform="translate(0,{220 * out * out:.1f})" opacity="{k:.3f}">{grp}</g>'
        return {'h': {'ov': o + grp}}
    return S, frame, stem, a, b


def stevens_render():
    """alpha frames -> ProRes 4444 (the overlay), and a preview over the harbor wide still with the narration"""
    S, frame, stem, a, b = stevens_l3()
    S.write(frame)
    run_node(ALPHA_JS, S.dir)
    mov = os.path.join(B, 'stevens_lower_third_alpha.mov')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', os.path.join(S.dir, 'fa', '%04d.png'), '-c:v', 'prores_ks',
                    '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-vendor', 'apl0', mov], check=True)
    bg = os.path.join(EP, 'renders', 'tests', 'sets', 'harbor_wide.png')
    wav = os.path.join(EP, 'public', 'audio', stem + '.wav')
    pv = os.path.join(TR, 'stevens_lower_third.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-framerate', str(FPS), '-i', bg, '-framerate', str(FPS), '-i', os.path.join(S.dir, 'fa', '%04d.png'),
                    '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', wav,
                    '-filter_complex', f'[0:v]scale=1920:1080:flags=lanczos,format=rgb24[bg];[bg][1:v]overlay=0:0:shortest=1,scale=1280:720:flags=lanczos,format=yuv420p[v]',
                    '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-crf', '24', '-c:a', 'aac', '-b:a', '128k', '-shortest', pv], check=True)
    return pv


# ================================================================ 9 · the 1887 constitution, drawn (no scan shown)
def rifleman(h, pose=0):
    """a flat ink silhouette of a militiaman, feet at 0,0, h tall: slouch hat, coat, rifle with bayonet (no face)
    pose 0: rifle on the shoulder; 1: rifle at the order, butt on the ground; 2: at the port, across the chest"""
    k = h / 100.0
    o = (f'<path d="M{-9 * k:.1f},{-46 * k:.1f} L{-8 * k:.1f},0 L{-1 * k:.1f},0 L{0},{-40 * k:.1f} L{1 * k:.1f},0 L{8 * k:.1f},0 L{9 * k:.1f},{-46 * k:.1f} z"/>'
         f'<path d="M{-15 * k:.1f},{-80 * k:.1f} Q0,{-84 * k:.1f} {15 * k:.1f},{-80 * k:.1f} L{17 * k:.1f},{-42 * k:.1f} L{-17 * k:.1f},{-42 * k:.1f} z"/>'
         f'<rect x="{-4 * k:.1f}" y="{-86 * k:.1f}" width="{8 * k:.1f}" height="{8 * k:.1f}"/>'
         f'<circle cy="{-91 * k:.1f}" r="{6.6 * k:.1f}"/>'
         f'<ellipse cy="{-95.5 * k:.1f}" rx="{11 * k:.1f}" ry="{2.2 * k:.1f}"/>'
         f'<path d="M{-6.5 * k:.1f},{-96 * k:.1f} Q0,{-106 * k:.1f} {6.5 * k:.1f},{-96 * k:.1f} z"/>')
    rw = 2.4 * k
    if pose == 0:                                          # shouldered: up from the right hand past the shoulder
        x0, y0, x1, y1 = 17 * k, -52 * k, 9 * k, -122 * k
        o += f'<path d="M{15 * k:.1f},{-80 * k:.1f} L{20 * k:.1f},{-56 * k:.1f} L{14 * k:.1f},{-52 * k:.1f} L{10 * k:.1f},{-78 * k:.1f} z"/>'
    elif pose == 1:                                        # at the order: upright at the right side
        x0, y0, x1, y1 = 22 * k, 0, 22 * k, -100 * k
        o += f'<path d="M{15 * k:.1f},{-80 * k:.1f} L{24 * k:.1f},{-58 * k:.1f} L{20 * k:.1f},{-54 * k:.1f} L{12 * k:.1f},{-74 * k:.1f} z"/>'
    else:                                                  # at the port: across the chest
        x0, y0, x1, y1 = 14 * k, -50 * k, -10 * k, -116 * k
    dx, dy = x1 - x0, y1 - y0
    L = math.hypot(dx, dy)
    ux, uy = dx / L, dy / L
    o += f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{INK}" stroke-width="{rw:.1f}" stroke-linecap="round"/>'
    o += (f'<path d="M{x0 - uy * rw * 1.2:.1f},{y0 + ux * rw * 1.2:.1f} L{x0 + uy * rw * 1.2:.1f},{y0 - ux * rw * 1.2:.1f} '
          f'L{x0 + ux * 14 * k + uy * rw * 0.8:.1f},{y0 + uy * 14 * k - ux * rw * 0.8:.1f} L{x0 + ux * 14 * k - uy * rw * 0.8:.1f},{y0 + uy * 14 * k + ux * rw * 0.8:.1f} z"/>')
    bx, by = x1 + ux * 16 * k, y1 + uy * 16 * k                    # the bayonet
    o += (f'<path d="M{x1 - uy * rw * 0.6:.1f},{y1 + ux * rw * 0.6:.1f} L{bx:.1f},{by:.1f} L{x1 + uy * rw * 0.6:.1f},{y1 - ux * rw * 0.6:.1f} z"/>')
    return f'<g fill="{INK}">{o}</g>', (bx, by)


def constitution():
    stem = 'ch06_the_heist'
    W0 = Words(stem)
    a = W0.end('most of his power') + 0.3                    # where the Kalākaua card ends
    b = W0.at('the Bayonet Constitution') - 2 / FPS            # the Declaration cut (declaration.decl_under1)
    Wd = Words(stem, t0=a)
    S = dstage('constitution', b - a)
    S.world.clear()
    S.defs.append('<radialGradient id="cbone" cx="50%" cy="42%" r="78%"><stop offset="0" stop-color="#ece5d7"/><stop offset="0.7" stop-color="#ddd4c2"/>'
                  '<stop offset="1" stop-color="#bdb29c"/></radialGradient>')
    S.world.append('<rect x="-200" y="-200" width="2320" height="1480" fill="url(#cbone)"/>')
    S.world.append('<g id="men"></g><g id="page"></g>')
    S.over.append('<g id="ov"></g>')
    t_money, t_rules = Wd.at('money and property'), Wd.end('property rules')
    t_asian, t_shut = Wd.at('Asian residents'), Wd.end('shut out completely')
    t_people = Wd.at('People called')
    PWD, PHT, PCX, PCY = 620, 800, 960, 566                   # the page
    MEN = [(250, 640, 1), (420, 700, 0), (585, 735, 0), (790, 780, 0), (1060, 790, 2), (1290, 760, 0), (1470, 715, 0), (1650, 650, 1)]
    men = [rifleman(h, pose) for _, h, pose in MEN]
    # the page's furniture: title (the only words), then two columns of ruled lines with article breaks
    rng = np.random.default_rng(1887)
    rules = []                                                 # (column, y, length) in page px from its top-left
    for col in (0, 1):
        y = 300
        while y < PHT - 70:
            if rng.random() < 0.13 and y > 320:                # an article break: a short centred bar, a gap
                rules.append((col, y + 6, -1))
                y += 34
                continue
            last = rng.random() < 0.22
            rules.append((col, y, 0.35 + 0.4 * rng.random() if last else 0.92 + 0.08 * rng.random()))
            y += 21 if not last else 33
    CW, CX0 = (PWD - 120) / 2 - 14, (60, 60 + (PWD - 120) / 2 + 14)
    BR1 = [r for r in rules if r[0] == 0 and 420 <= r[1] <= 540]          # the bracketed blocks
    BR2 = [r for r in rules if r[0] == 1 and 560 <= r[1] <= 680]

    def page(t, tq):
        o = (f'<rect x="14" y="20" width="{PWD}" height="{PHT}" fill="#3b3428" opacity="0.45" filter="url(#soft)"/>'
             f'<rect width="{PWD}" height="{PHT}" fill="{CREAM}"/><rect x="18" y="18" width="{PWD - 36}" height="{PHT - 36}" fill="none" stroke="{PAPER}" stroke-width="2"/>'
             f'<rect x="24" y="24" width="{PWD - 48}" height="{PHT - 48}" fill="none" stroke="{PAPER}" stroke-width="1"/>')
        o += (text(PWD / 2, 118, 'Constitution', 70, 'Fell', INK, 'middle')
              + text(PWD / 2, 172, 'of the Hawaiian Kingdom', 38, 'FellI', INK, 'middle')
              + text(PWD / 2, 222, '1887', 32, 'Fell', INK, 'middle', extra='letter-spacing="4"')
              + f'<rect x="{PWD / 2 - 120}" y="252" width="240" height="2.5" fill="{INK}"/><rect x="{PWD / 2 - 70}" y="260" width="140" height="1.2" fill="{INK}"/>')
        n = int(len(rules) * clamp((tq - 0.35) / 0.9))          # the type prints on, top to bottom, on twos
        for col, y, L in sorted(rules, key=lambda r: (r[1], r[0]))[:n]:
            x0 = CX0[col]
            if L < 0:
                o += f'<rect x="{x0 + CW / 2 - 34:.1f}" y="{y:.1f}" width="68" height="5" fill="{PAPER}"/>'
            else:
                o += f'<rect x="{x0:.1f}" y="{y:.1f}" width="{CW * L:.1f}" height="5" rx="2" fill="{PAPER}" opacity="0.62"/>'
        o += f'<rect x="{PWD - 230}" y="{PHT - 58}" width="170" height="2" fill="{PAPER}"/>'
        # teal brackets on two blocks, on their words (marks on twos)
        for blk, t0, t1, side in ((BR1, t_money, t_rules, 0), (BR2, t_asian, t_shut, 1)):
            if not blk or t < t0:
                continue
            y0, y1 = blk[0][1] - 8, blk[-1][1] + 13
            x = CX0[side] - 16 if side == 0 else CX0[side] + CW + 16
            dx = -14 if side == 0 else 14
            d = f'M{x - dx:.1f},{y0:.1f} L{x:.1f},{y0:.1f} L{x:.1f},{y1:.1f} L{x - dx:.1f},{y1:.1f}'
            o += f'<path d="{d}" fill="none" stroke="{TE_D}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="{1 - ease_out(clamp((tq - t0) / max(0.3, t1 - t0)), 2):.3f}"/>'
        return o

    def frame(t):
        tq = step12(t)
        # the men come up behind it, one drawing at a time, staggered; the bayonets glint before the cut
        m = ''
        for j, ((x, h, pose), (body, (bx, by))) in enumerate(zip(MEN, men)):
            u = clamp((tq - 0.15 - 0.07 * ((j * 5) % 8)) / 0.25)
            if u <= 0:
                continue
            dy = (1 - ease_out(u, 2)) * 700
            m += f'<g transform="translate({x},{1040 + dy:.1f})">{body}'
            if t >= t_people - 0.1:
                tg = (tq - t_people + 0.1 - 0.08 * j) * 6
                if 0 <= tg < 2:
                    r = 16 * (1 - abs(tg - 1))
                    m += (f'<path d="M{bx:.1f},{by - r:.1f} L{bx + r * 0.22:.1f},{by - r * 0.22:.1f} L{bx + r:.1f},{by:.1f} L{bx + r * 0.22:.1f},{by + r * 0.22:.1f} '
                          f'L{bx:.1f},{by + r:.1f} L{bx - r * 0.22:.1f},{by + r * 0.22:.1f} L{bx - r:.1f},{by:.1f} L{bx - r * 0.22:.1f},{by - r * 0.22:.1f} z" fill="{CREAM}"/>')
            m += '</g>'
        v = ease_out(clamp(t / 0.5), 3)
        pg = (f'<g transform="translate({PCX},{PCY + 700 * (1 - v):.1f}) rotate({1.2 + 5 * (1 - v):.2f}) translate({-PWD / 2},{-PHT / 2})">'
              + page(t, tq) + '</g>')
        z = 1 + 0.07 * ease_io(t / S.dur)
        cam = f'translate(960,520) scale({z:.4f}) translate(-960,-520)'
        o = ''
        if t >= 0.3:
            o += highlight(140, 196, '1887', 70, prog=(tq - 0.3) / 0.27)
        o += f'<g opacity="{clamp((t - 0.6) / 0.3):.3f}">' + tag(PCX, 1006, 'DRAWN: NO SCAN SHOWN', 17, PAPER, 'middle') + '</g>'
        o += f'<g opacity="{clamp((t - 1.0) / 0.3):.3f}">' + tag(1640, 1006, 'THE HONOLULU RIFLES', 17, PAPER, 'middle') + '</g>'
        return {'t': {'CAM': cam}, 'h': {'men': m, 'page': pg, 'ov': o}}
    return S, frame, stem, a, b


PAPER = '#5b5040'


# ================================================================ the list
PIECES = {'palace_print': (palace_print, '03_palace_print.mp4'), 'tariff_ends': (tariff_ends, '12_13_tariff_ends.mp4'),
          'kalakaua_head': (kalakaua_head, '15_kalakaua_head.mp4'), 'stevens_l3': (stevens_l3, None),
          'constitution': (constitution, 'constitution_1887.mp4')}


if __name__ == '__main__':
    args = sys.argv[1:]
    if args[:1] == ['--still']:
        print('\n'.join(stills(PIECES[args[1]][0](), args[2:])))
        sys.exit()
    if args[:1] == ['--check']:
        for k in args[1:]:
            S, frame, *_ = PIECES[k][0]()
            S.write(frame)
            edge_check(S)
        sys.exit()
    for k in args or list(PIECES):
        fn, name = PIECES[k]
        print('piece', k, stevens_render() if k == 'stevens_l3' else finish(fn(), name), flush=True)
