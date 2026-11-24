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
from pacmap import Pac, PLACES

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
    out = to720(clip, os.path.join(TR, out_name))
    clean_frames(S)
    return out


def clean_frames(S):
    """the disk rule: once the mp4 is made, keep three key stills (build/deskA/keys) and drop the frame folder"""
    fd = os.path.join(S.dir, 'f')
    fs = sorted(os.listdir(fd)) if os.path.isdir(fd) else []
    os.makedirs(os.path.join(B, 'keys'), exist_ok=True)
    base = S.name.split('/')[-1]
    for k, f in enumerate(fs[i] for i in sorted({0, len(fs) // 2, len(fs) - 1}) if fs):
        Image.open(os.path.join(fd, f)).convert('RGB').save(os.path.join(B, 'keys', f'{base}_{f[:-4]}.jpg'), quality=90)
    shutil.rmtree(fd, ignore_errors=True)
    for f in ('silent.mp4', 'audio.wav'):
        if os.path.exists(os.path.join(S.dir, f)):
            os.remove(os.path.join(S.dir, f))


def render_frames(S, idx, dest_names):
    """render only the frames idx of a written stage (one browser), to the given paths"""
    d = S.dir + '_st'
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d)
    for f in os.listdir(S.dir):
        if f not in ('f', 'frames.ndjson', 'clip.mp4', 'silent.mp4', 'audio.wav'):
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
    mov = os.path.join(B, 'stevens_lower_third_alpha.mov')                # ProRes 4444 with alpha (the overlay to use)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', os.path.join(S.dir, 'fa', '%04d.png'), '-c:v', 'prores_ks',
                    '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-vendor', 'apl0', mov], check=True)
    bg = os.path.join(EP, 'renders', 'tests', 'sets', 'harbor_wide.png')
    wav = os.path.join(EP, 'public', 'audio', stem + '.wav')
    pv = os.path.join(TR, 'stevens_lower_third.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-framerate', str(FPS), '-i', bg, '-framerate', str(FPS), '-i', os.path.join(S.dir, 'fa', '%04d.png'),
                    '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', wav,
                    '-filter_complex', f'[0:v]scale=1920:1080:flags=lanczos,format=rgb24[bg];[bg][1:v]overlay=0:0:shortest=1,scale=1280:720:flags=lanczos,format=yuv420p[v]',
                    '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-crf', '24', '-c:a', 'aac', '-b:a', '128k', '-shortest', pv], check=True)
    shutil.rmtree(os.path.join(S.dir, 'fa'), ignore_errors=True)
    return pv


# ================================================================ 9 · the 1887 constitution, drawn (no scan shown)
def rifleman(h, pose=0):
    """a flat ink silhouette of a militiaman, feet at 0,0, h tall: slouch hat, coat, rifle with bayonet (no face)
    pose 0: rifle on the shoulder; 1: rifle at the order, butt on the ground; 2: at the port, across the chest"""
    k = h / 100.0
    o = (f'<path d="M{-9 * k:.1f},{-46 * k:.1f} L{-7.5 * k:.1f},0 L{-1.2 * k:.1f},0 L{0},{-38 * k:.1f} L{1.2 * k:.1f},0 L{7.5 * k:.1f},0 L{9 * k:.1f},{-46 * k:.1f} z"/>'
         f'<path d="M{-12 * k:.1f},{-81 * k:.1f} Q0,{-84 * k:.1f} {12 * k:.1f},{-81 * k:.1f} L{11 * k:.1f},{-58 * k:.1f} L{14 * k:.1f},{-42 * k:.1f} '
         f'L{-14 * k:.1f},{-42 * k:.1f} L{-11 * k:.1f},{-58 * k:.1f} z"/>'
         f'<path d="M{-12 * k:.1f},{-80 * k:.1f} L{-16.5 * k:.1f},{-77 * k:.1f} L{-18 * k:.1f},{-50 * k:.1f} L{-13.5 * k:.1f},{-50 * k:.1f} L{-12.5 * k:.1f},{-68 * k:.1f} z"/>'
         f'<rect x="{-3.2 * k:.1f}" y="{-87 * k:.1f}" width="{6.4 * k:.1f}" height="{7 * k:.1f}"/>'
         f'<ellipse cy="{-91.5 * k:.1f}" rx="{5.6 * k:.1f}" ry="{6.4 * k:.1f}"/>'
         f'<ellipse cy="{-96 * k:.1f}" rx="{10 * k:.1f}" ry="{1.9 * k:.1f}"/>'
         f'<path d="M{-5.8 * k:.1f},{-96 * k:.1f} Q{-5 * k:.1f},{-104 * k:.1f} 0,{-103.5 * k:.1f} Q{5 * k:.1f},{-104 * k:.1f} {5.8 * k:.1f},{-96 * k:.1f} z"/>')
    rw = 1.9 * k
    if pose == 0:                                          # shouldered: up from the right hand past the shoulder
        x0, y0, x1, y1 = 15 * k, -52 * k, 9 * k, -112 * k
        o += f'<path d="M{12 * k:.1f},{-80 * k:.1f} L{17 * k:.1f},{-56 * k:.1f} L{13 * k:.1f},{-52 * k:.1f} L{9 * k:.1f},{-74 * k:.1f} z"/>'
    elif pose == 1:                                        # at the order: upright at the right side
        x0, y0, x1, y1 = 20 * k, 0, 20 * k, -86 * k
        o += f'<path d="M{12 * k:.1f},{-80 * k:.1f} L{21 * k:.1f},{-58 * k:.1f} L{18 * k:.1f},{-54 * k:.1f} L{10 * k:.1f},{-72 * k:.1f} z"/>'
    else:                                                  # at the port: across the chest
        x0, y0, x1, y1 = 14 * k, -50 * k, -8 * k, -108 * k
        o += f'<path d="M{12 * k:.1f},{-80 * k:.1f} L{16 * k:.1f},{-56 * k:.1f} L{2 * k:.1f},{-62 * k:.1f} L{9 * k:.1f},{-72 * k:.1f} z"/>'
    dx, dy = x1 - x0, y1 - y0
    L = math.hypot(dx, dy)
    ux, uy = dx / L, dy / L
    o += f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{INK}" stroke-width="{rw:.1f}" stroke-linecap="round"/>'
    o += (f'<path d="M{x0 - uy * rw * 1.2:.1f},{y0 + ux * rw * 1.2:.1f} L{x0 + uy * rw * 1.2:.1f},{y0 - ux * rw * 1.2:.1f} '
          f'L{x0 + ux * 14 * k + uy * rw * 0.8:.1f},{y0 + uy * 14 * k - ux * rw * 0.8:.1f} L{x0 + ux * 14 * k - uy * rw * 0.8:.1f},{y0 + uy * 14 * k + ux * rw * 0.8:.1f} z"/>')
    bx, by = x1 + ux * 13 * k, y1 + uy * 13 * k                    # the bayonet
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
    MEN = [(330, 430, 1), (452, 470, 0), (572, 492, 2), (700, 505, 0), (1222, 505, 0), (1352, 488, 0), (1474, 466, 2), (1598, 432, 1)]
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
            m += f'<g transform="translate({x},{982 + dy:.1f})">{body}'
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
        o += f'<g opacity="{clamp((t - 0.6) / 0.3):.3f}">' + label_tag(PCX, 1012, 'DRAWN: NO SCAN SHOWN') + '</g>'
        o += f'<g opacity="{clamp((t - 1.0) / 0.3):.3f}">' + label_tag(1460, 1012, 'THE HONOLULU RIFLES') + '</g>'
        return {'t': {'CAM': cam}, 'h': {'men': m, 'page': pg, 'ov': o}}
    return S, frame, stem, a, b


PAPER = '#5b5040'


def label_tag(x, y, s_, size=17):
    """a mono tag on a small cream label, centred on x (readable over anything)"""
    w = len(s_) * size * 0.62 + 26
    return (f'<rect x="{x - w / 2:.1f}" y="{y - size - 6:.1f}" width="{w:.1f}" height="{size + 15}" rx="3" fill="{CREAM}" opacity="0.92"/>'
            + tag(x, y, s_, size, PAPER, 'middle'))



# ================================================================ 4 · join 7: the coal map's ship sails onto the 1886 map
FED_SRC = ARC('ch04_imperial_federation_map_1886.jpg')            # 10496 x 7848, Mercator, Greenwich centre
FED_W, FED_H = 10496, 7848
FED_K, FED_X0, FED_R, FED_Y0 = 20.25, 5169.0, 1165.0, 3948.0      # lon/lat -> scan px (fitted to coast points)
FED_WW = 2400.0                                                     # the scan's width on the desk (world px)
FED_CROP = (60, 750, 10436, 6586)                                   # the final frame (scan px, 16:9, inside the scanner's dark edge)


def fed_px(lon, lat):
    lat = max(-80.0, min(80.0, lat))
    return FED_X0 + FED_K * lon, FED_Y0 - FED_R * math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


def clip_ring(ring, keep):
    """Sutherland-Hodgman against one half-plane: keep(p) -> signed value, >= 0 inside (linear in lon or lat)"""
    out = []
    n = len(ring)
    for i in range(n):
        p, q = ring[i], ring[(i + 1) % n]
        a_, b_ = keep(p), keep(q)
        if a_ >= 0:
            out.append(p)
        if (a_ >= 0) != (b_ >= 0):
            u = a_ / (a_ - b_)
            out.append((p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u))
    return out


def colonies_1886():
    """approximate French and German holdings in 1886 (lon/lat rings), from Natural Earth admin-0 (public domain) cut to
    what each power held or claimed that year; a map-maker's approximation, labelled as such on screen"""
    feats = {f['properties']['ADM0_A3']: f for f in json.load(open(os.path.join(EP, 'build', 'geo', 'ne_50m_admin_0_countries.geojson')))['features']}

    def rings_of(code, test=None, cut=None, min_pts=6):
        gm = feats[code]['geometry']
        polys = gm['coordinates'] if gm['type'] == 'MultiPolygon' else [gm['coordinates']]
        out = []
        for poly in polys:
            r = [tuple(p) for p in poly[0]]
            if test and not test(r):
                continue
            for c in (cut or []):
                r = clip_ring(r, c)
            if len(r) >= min_pts:
                out.append(r)
        return out
    cx = lambda r: sum(p[0] for p in r) / len(r)
    cy = lambda r: sum(p[1] for p in r) / len(r)
    fr = {'France': rings_of('FRA', lambda r: cx(r) > -6), 'Algeria': rings_of('DZA', cut=[lambda p: p[1] - 30.0]),
          'Tunisia': rings_of('TUN'), 'Senegal': rings_of('SEN'), 'French Congo': rings_of('GAB') + rings_of('COG'),
          'Obock': rings_of('DJI'), 'Indochina': rings_of('VNM') + rings_of('KHM'), 'New Caledonia': rings_of('NCL'),
          'Guiana': rings_of('FRA', lambda r: cx(r) < -40)}
    de = {'Germany': rings_of('DEU'), 'Togo': rings_of('TGO'), 'Kamerun': rings_of('CMR', cut=[lambda p: 6.0 - p[1]]),
          'South West Africa': rings_of('NAM'), 'East Africa': rings_of('TZA', lambda r: len(r) > 40),
          'New Guinea': rings_of('PNG', lambda r: cy(r) > -7.2 and cx(r) < 156.5, cut=[lambda p: p[1] + 7.6])}
    return fr, de


def fed_path(rings, sx0, sy0, k):
    d = ''
    for r in rings:
        pts = [fed_px(lo, la) for lo, la in r]
        d += 'M' + ' L'.join(f'{sx0 + x * k:.1f},{sy0 + y * k:.1f}' for x, y in pts) + 'z'
    return d


def left_tag(x, y, s_, size=16):
    w = len(s_) * size * 0.62 + 24
    return (f'<rect x="{x - 12:.1f}" y="{y - size - 6:.1f}" width="{w:.1f}" height="{size + 14}" rx="3" fill="{CREAM}" opacity="0.9"/>'
            + tag(x, y, s_, size, PAPER))


FED_CLEAN = [False]                                                 # the handoff still: the picture only, no screen tags


def federation():
    import explainers as EX
    from vocab import strip
    import ch03_explainers as C3
    stem = 'ch04_the_pitch_meeting'
    W0 = Words(stem)
    a = W0.at('At the same time') - 0.25
    b = W0.at('Now look at the Pacific') - 0.05
    Wd = Words(stem, t0=a)
    S = dstage('federation', b - a, bg=False)
    T_BRIT, T_FR, T_DE = Wd.at('Britain'), Wd.at('France'), Wd.at('Germany')
    T_GRAB, T_WORLD, T_AMER, T_LEFT = Wd.at('grabbing colonies'), Wd.end('all over the world'), Wd.at('a lot of Americans'), Wd.end('left out')
    # the coal map as the coal piece leaves it (its last frame), without its ship: this one carries on
    Sc, fc, *_ = EX.coal()
    coal_world = Sc.world[1]
    coal_ov = fc(Sc.dur - 1 / FPS)['h']['ov']
    coal_ov = re.sub(r'<g transform="[^"]*" opacity="[^"]*">' + re.escape(EX.steamship()) + '</g>', '', coal_ov)
    m = Pac(111.5, 72.5, 1697, 935, bbox=(112, -18, 250, 58))
    # the scan lies under the coal map's left side, its own longitudes lined up with the coal map's left edge (lon 112)
    k = FED_WW / FED_W
    ex, ey = m.xy(112, 18)
    px, py = fed_px(112, 18)
    SX0, SY0 = ex - 12 - px * k, ey - py * k
    small = os.path.join(B, 'fed_4800.jpg')
    if not os.path.exists(small):
        Image.open(FED_SRC).convert('RGB').resize((4800, round(4800 * FED_H / FED_W)), Image.LANCZOS).save(small, quality=90)
    href = S.img(small)
    C3.wide_desk(S, x0=-4000, y0=-2500, w=9000, h=6000, cx=0, cy=600, r=2600)
    S.world.append(f'<rect x="{SX0 + 14:.1f}" y="{SY0 + 22:.1f}" width="{FED_WW}" height="{FED_H * k:.1f}" fill="#000" opacity="0.5" filter="url(#soft)"/>'
                   f'<image href="{href}" x="{SX0:.1f}" y="{SY0:.1f}" width="{FED_WW}" height="{FED_H * k:.1f}"/>')
    # the colonies: flat fills printed on the scan, inked in from each colony's middle (masks of growing blots)
    fr, de = colonies_1886()
    U = C3.usa()
    us_rings = [U['lower48']] + [[(x - 360 if x > 180 else x, y) for x, y in r] for r in U['alaska']]
    S.defs.append('<filter id="blot" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>'
                  '<mask id="mfr" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="12000" height="12000"><g id="mfrg"></g></mask>'
                  '<mask id="mde" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="12000" height="12000"><g id="mdeg"></g></mask>')
    FR_C, DE_C, US_C = '#6c86d4', '#857455', TE
    S.world.append(f'<g mask="url(#mfr)" style="mix-blend-mode:multiply"><path d="{fed_path([r for v in fr.values() for r in v], SX0, SY0, k)}" fill="{FR_C}" opacity="0.92"/></g>'
                   f'<g mask="url(#mde)" style="mix-blend-mode:multiply"><path d="{fed_path([r for v in de.values() for r in v], SX0, SY0, k)}" fill="{DE_C}" opacity="0.95"/></g>'
                   f'<g id="usg" opacity="0" style="mix-blend-mode:multiply"><path d="{fed_path(us_rings, SX0, SY0, k)}" fill="{US_C}" opacity="0.6"/></g>'
                   '<g id="fedlab"></g>')

    def blots(group, t0, step):
        """(time, x, y, radius) per colony, in the order they ink in"""
        out = []
        for j, (name, rs) in enumerate(group.items()):
            pts = [fed_px(lo, la) for r in rs for lo, la in r]
            xs, ys = [SX0 + p[0] * k for p in pts], [SY0 + p[1] * k for p in pts]
            cx_, cy_ = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
            out.append((t0 + j * step, cx_, cy_, 0.75 * math.hypot(max(xs) - min(xs), max(ys) - min(ys)) + 12))
        return out
    BL_FR, BL_DE = blots(fr, T_FR - 0.05, 0.1), blots(de, T_DE - 0.05, 0.11)
    S.world.append(f'<g id="coalg">{coal_world}{coal_ov}</g><g id="ship"></g>')
    S.over.append('<g id="ov"></g>')
    # the ship: Yokohama on the coal map, south-west off its edge (lon 112), on across the scan to Singapore
    pts_c = [m.xy(*PLACES['Yokohama']), m.xy(128, 24), m.xy(112, 18)]
    pts_s = [(SX0 + x * k, SY0 + y * k) for x, y in (fed_px(*q) for q in ((112, 18), (111, 9), (104.6, 1.6)))]
    path = pts_c + pts_s[1:]
    seg = [math.dist(p, q) for p, q in zip(path, path[1:])]
    T_SH0, T_SH1, T_SHOFF = 0.1, T_FR - 0.3, T_WORLD + 0.1
    T_SL0, T_SL1 = 0.95, 1.75                                     # the coal map slides away, off the desk
    cxf, cyf = SX0 + (FED_CROP[0] + FED_CROP[2]) / 2 * k, SY0 + (FED_CROP[1] + FED_CROP[3]) / 2 * k   # the final frame: centre, zoom
    zf = 1920 / ((FED_CROP[2] - FED_CROP[0]) * k)
    afx, afy = SX0 + fed_px(12, 8)[0] * k, SY0 + fed_px(12, 8)[1] * k            # Africa, for the push while they ink in
    cam = Camera([(0, 960, 540, 1.0), (0.9, 520, 560, 0.92), (T_SL1, cxf + 40, cyf + 10, zf * 1.02), (T_FR + 0.2, (cxf + afx) / 2, (cyf + afy) / 2, zf * 1.12),
                  (T_GRAB + 0.3, (cxf * 0.3 + afx * 0.7), (cyf * 0.3 + afy * 0.7), zf * 1.2), (T_AMER - 0.3, cxf, cyf, zf * 1.02),
                  (S.dur - 0.45, cxf, cyf, zf), (S.dur, cxf, cyf, zf)], wobble=0.0)

    def ship_at(t):
        u = ease_io(clamp((t - T_SH0) / (T_SH1 - T_SH0)))
        d = u * sum(seg)
        for p, q, L in zip(path, path[1:], seg):
            if d <= L:
                f = d / L
                return (p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f), math.degrees(math.atan2(q[1] - p[1], q[0] - p[0])) - 180, 0 < u < 1
            d -= L
        p, q = path[-2], path[-1]
        return q, math.degrees(math.atan2(q[1] - p[1], q[0] - p[0])) - 180, False

    def frame(t):
        tq = step12(t)
        # the camera: smooth, its handheld drift fading out so the last frames are dead still and square
        x, y, z, r = cam.at(t)
        w = 1.4 * (1 - clamp((t - (S.dur - 1.2)) / 0.75))
        x += w * (math.sin(t * 0.83 + 1.1) * 0.6 + math.sin(t * 1.71 + 2.3) * 0.3) / z
        y += w * (math.sin(t * 0.67 + 0.4) * 0.6 + math.sin(t * 1.39 + 4.1) * 0.3) / z
        T = {'CAM': f'translate(960 540) scale({z:.5f}) translate({-x:.2f} {-y:.2f})'}
        sl = ease_io(clamp((t - T_SL0) / (T_SL1 - T_SL0)))
        T['coalg'] = f'translate({1900 * sl:.1f},{-160 * sl:.1f}) rotate({4 * sl:.2f} 960 540)'
        h = {}
        # the ship (on twos while it bobs), gone once the colonies are in
        (sx, sy), ang, moving = ship_at(t)
        sp = 1.0 if t < T_SHOFF else max(0.0, 1 - back_out((tq - T_SHOFF) / 0.25, 1.6))
        ang = (ang + 180) % 360 - 180
        h['ship'] = g(sx, sy - 6 + 2.5 * math.sin(tq * 5), sp * 0.95, EX.smoke(tq, moving) + EX.steamship(), rot=max(-14, min(14, ang * 0.5))) if sp > 0 else ''
        # the inks
        for gid, bl in (('mfrg', BL_FR), ('mdeg', BL_DE)):
            h[gid] = ''.join(f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="{rr * ease_out(clamp((tq - t0) / 0.42), 2):.1f}" fill="#fff" filter="url(#blot)"/>'
                             for t0, bx, by, rr in bl if tq >= t0)
        o = {'usg': f'{0.0 if t < T_AMER else min(1.0, step12(t - T_AMER) / 0.25):.3f}'}
        # the labels, printed on the scan (they stay in the handoff picture)
        lab = ''
        def at(lon, lat):
            px_, py_ = fed_px(lon, lat)
            return SX0 + px_ * k, SY0 + py_ * k
        if t >= T_BRIT:
            lx, ly = at(-42, 47)
            lab += strip(lx, ly, 'BRITAIN', 38, prog=(tq - T_BRIT) / 0.27)
        if t >= T_FR + 0.15:
            lx, ly = at(-4, 27)
            lab += strip(lx, ly, 'FRANCE', 38, prog=(tq - T_FR - 0.15) / 0.27)
        if t >= T_DE + 0.15:
            lx, ly = at(3, -26)
            lab += strip(lx, ly, 'GERMANY', 38, prog=(tq - T_DE - 0.15) / 0.27)
        if t >= T_AMER + 0.1:
            lx, ly = at(-108, 40)
            lab += highlight(lx, ly, 'U.S.', 38, prog=(tq - T_AMER - 0.1) / 0.27, fill=TE)
        h['fedlab'] = lab
        ov = ''
        if not FED_CLEAN[0] and t >= T_SL1 - 0.2:
            op = clamp((t - T_SL1 + 0.2) / 0.3)
            ov += (f'<g opacity="{op:.3f}">' + left_tag(112, 976, 'IMPERIAL FEDERATION: MAP OF THE WORLD, 1886 · THE GRAPHIC · BOSTON PUBLIC LIBRARY')
                   + (left_tag(112, 1010, 'FRENCH AND GERMAN HOLDINGS DRAWN IN, APPROXIMATE') if t >= T_FR + 0.4 else '') + '</g>')
        h['ov'] = ov
        return {'t': T, 'h': h, 'o': o}
    return S, frame, stem, a, b


def federation_handoff():
    """H8: the last frame without the screen tags (the scan with its inks and labels, square-on, filling the frame)"""
    FED_CLEAN[0] = True
    S, frame, *_ = federation()
    S.write(frame)
    n = int(round(S.dur * FPS)) - 1
    out = os.path.join(TR, '07_federation_end.png')
    render_frames(S, [n], [out])
    FED_CLEAN[0] = False
    return out



# ================================================================ 3 · join 4: the census ends on the pitch-room wall map (H4)
def census_end():
    import ch03_explainers as C3
    S, frame, stem, a, b = C3.census()
    old = S.dir
    S.name, S.dir = 'deskA/census', os.path.join(B, 'census')
    os.makedirs(S.dir, exist_ok=True)
    for f in os.listdir(old):
        if re.match(r'i\d+\.', f):
            shutil.copy(os.path.join(old, f), S.dir)
    return S, frame, stem, a, b



# ================================================================ 2 · chapter 3 on one long desk
# Each piece keeps its own drawing code and its own clock; here its world (and its screen overlay, carried into the world
# through the inverse of its own camera) is laid on one desk at an offset and angle, every id prefixed so the pieces can
# share one page. The camera follows each piece's own camera during its shot and glides from one to the next between
# them; the cut to the gold nugget stays a hard cut (the joke), and the nugget's second of nothing is a real pause in the
# narration. The census sheet lies on the wall map, which is square on the desk; the census sheet is the one at an angle.
CAM_RE = re.compile(r'translate\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)\) scale\(([-\d.]+)\) translate\(([-\d.]+) ([-\d.]+)\)')
DESK_RE = re.compile(r'url\(#desk[w]?\)')


def parse_cam(tf):
    m = CAM_RE.match(tf)
    _, _, r, z, nx, ny = map(float, m.groups())
    return -nx, -ny, z, r


def prefixer(pfx):
    rx = re.compile(r'(id="|url\(#|href="#)([^")]+)')
    ri = re.compile(r'href="(i\d+\.\w+)"')

    def f(sv):
        return ri.sub(lambda m: f'href="{pfx}{m.group(1)}"', rx.sub(lambda m: m.group(1) + pfx + m.group(2), sv))
    return f


class Panel:
    """one piece on the long desk: piece world -> desk = rotate(rot) then translate(ox, oy)"""

    def __init__(self, k, piece, ox, oy, rot=0.0, tmap=None, camera=True):
        self.S, self.frame, self.stem, self.a, self.b = piece
        self.k, self.ox, self.oy, self.rot, self.camera = k, ox, oy, rot, camera
        self.pfx = f'p{k}_'
        self.fix = prefixer(self.pfx)
        self.tmap = tmap or (lambda tn: tn - self.a)
        self.dur = self.S.dur
        self._c = {}

    def local(self, tv, tn):
        return min(max(self.tmap(tn), 0.0), self.dur - 1 / FPS)

    def fr(self, tp):
        key = round(tp * FPS)
        if key not in self._c:
            self._c = {key: self.frame(key / FPS)}
        return self._c[key]

    def to_desk(self, x, y):
        c, s_ = math.cos(math.radians(self.rot)), math.sin(math.radians(self.rot))
        return self.ox + c * x - s_ * y, self.oy + s_ * x + c * y

    def cam(self, tp):
        """this piece's camera, in desk terms (x, y, zoom, rot)"""
        if self.camera:
            x, y, z, r = parse_cam(self.fr(tp)['t']['CAM'])
        else:
            x, y, z, r = 960, 540, 1.0, 0.0
        X, Y = self.to_desk(x, y)
        return X, Y, z, r - self.rot

    def svg(self):
        """its defs, its world (no desk of its own), and its overlay under an id that carries the inverse camera"""
        S = self.S
        world = ''.join(w for w in S.world if not DESK_RE.search(w))
        ov = ''.join(S.over)
        body = world + (f'<g id="ovT">{ov}</g>' if self.camera else ov)
        return (self.fix(''.join(S.defs)),
                self.fix(f'<g transform="translate({self.ox:.1f} {self.oy:.1f}) rotate({self.rot:.4f})">{body}</g>'))

    def update(self, tp):
        f = self.fr(tp)
        out = {}
        for kind in ('t', 'h', 'o', 'a'):
            for key, v in (f.get(kind) or {}).items():
                if key == 'CAM':
                    continue
                out.setdefault(kind, {})[self.pfx + key] = self.fix(v) if kind == 'h' else v
        if self.camera:
            x, y, z, r = parse_cam(f['t']['CAM'])
            out.setdefault('t', {})[self.pfx + 'ovT'] = f'translate({x:.2f} {y:.2f}) scale({1 / z:.5f}) rotate({-r:.4f}) translate(-960 -540)'
        return out


def long_desk():
    import ch03_explainers as C3
    import vocab, qcard
    stem = C3.STEM
    W0 = Words(stem)
    g_piece = C3.gold()
    T_GOLD = g_piece[3]                                           # the hard cut (narration time = video time up to here)
    T_GN = g_piece[4]                                             # the narration stops here ...
    SIL = g_piece[0].dur - (g_piece[4] - g_piece[3])              # ... for the nugget's second of nothing
    c_piece = C3.census(bounded=True)
    END_N = c_piece[4]
    DUR = END_N + SIL

    def tn_of(tv):
        return tv if tv < T_GN else max(T_GN, tv - SIL)

    def tv_of(tn):
        return tn if tn < T_GN else tn + SIL
    # the census and its wall map: square on the desk (the wall map's own angle taken back out), its top-left corner at
    # desk (OXC, 0); the row of the other pieces runs above it, left to right
    PHI = -C3.WALL_ROT
    cx0, cy0 = C3.wall_xy(95 + C3.WALL_SHEET[0] / 3000 * 205, 68 - C3.WALL_SHEET[1] / 1500 * 118)
    OXC = 0.0
    cph, sph = math.cos(math.radians(PHI)), math.sin(math.radians(PHI))
    ocx, ocy = OXC - (cph * cx0 - sph * cy0), 0.0 - (sph * cx0 + cph * cy0)
    census_p = Panel(6, c_piece, ocx, ocy, PHI)
    sx, sy, _, _ = census_p.cam(0.0)                             # where the census shot starts, on the desk
    gold_p = Panel(5, g_piece, 0, 0, PHI, tmap=None)
    gx, gy = sx - 300, -1250                                      # the nugget lies on the desk just above the wall map
    gold_p.ox, gold_p.oy = gx - (cph * 960 - sph * 640), gy - (sph * 960 + cph * 640)
    gold_p.tmap = lambda tn, a=T_GOLD: tn - a                     # (replaced below by video time)
    ROW = -1900                                                   # the row's top edge
    seward_p = Panel(4, qcard.build('seward'), gx - 960 - 2200, ROW, camera=False)
    alaska_piece = C3.alaska()
    A_A = alaska_piece[3]
    LEAD = 1.3                                                    # the warrant slides in slower, starting 1.3 s early

    def alaska_t(tn):
        if tn < A_A + 0.75:
            return (tn - (A_A - LEAD)) * 0.75 / (0.75 + LEAD)
        return tn - A_A
    alaska_p = Panel(3, alaska_piece, seward_p.ox - 3450, ROW + 60, tmap=alaska_t)
    jeff_p = Panel(2, qcard.build('jefferson'), alaska_p.ox - 2150, ROW, camera=False)
    vocab_p = Panel(1, vocab.build('isolationism'), jeff_p.ox - 2100, ROW, camera=False)
    globe_p = Panel(0, C3.globe_fence(), vocab_p.ox - 2150, ROW)
    panels = [globe_p, vocab_p, jeff_p, alaska_p, seward_p, gold_p, census_p]
    S = dstage('long_desk', DUR, bg=False)
    S.sounds.append(['dry-thud', T_GOLD + 0.23, 0.7])
    # copy each piece's pictures in under its prefix
    for P in panels:
        for f in os.listdir(P.S.dir):
            if re.match(r'i\d+\.\w+$', f):
                shutil.copy(os.path.join(P.S.dir, f), os.path.join(S.dir, P.pfx + f))
    # the desk: one long top, a pool of lamp light under each piece, the grain lines across all of it
    X0, X1 = globe_p.ox - 2600, OXC + 8790 + 2600
    Y0, Y1 = ROW - 2200, 5065 + 2400
    S.defs.append('<radialGradient id="pool"><stop offset="0" stop-color="#2c2721"/><stop offset="0.55" stop-color="#211d18" stop-opacity="0.85"/>'
                  '<stop offset="1" stop-color="#16140f" stop-opacity="0"/></radialGradient>')
    desk = f'<rect x="{X0}" y="{Y0}" width="{X1 - X0}" height="{Y1 - Y0}" fill="#121009"/>'
    for P in panels[:-1]:
        cxp, cyp = P.to_desk(960 if P is not alaska_p else 1700, 540)
        desk += f'<ellipse cx="{cxp:.0f}" cy="{cyp:.0f}" rx="{2300 if P is alaska_p else 1700}" ry="1300" fill="url(#pool)"/>'
    desk += f'<ellipse cx="{OXC + 4400:.0f}" cy="2500" rx="7000" ry="4600" fill="url(#pool)"/>'
    desk += '<g opacity="0.12">' + ''.join(f'<rect x="{X0}" y="{y}" width="{X1 - X0}" height="1" fill="#fff" opacity="0.35"/>' for y in range(Y0 + 32, Y1, 64)) + '</g>'
    S.world.append(desk)
    for P in panels:
        d, w = P.svg()
        S.defs.append(d)
        S.world.append(w)
    # the shots: (from, to, panel) in video time; glides fill the gaps between them; the gold is cut to, not glided to
    W = lambda p, k=1: W0.at(p, k)
    SHOTS = [(0.0, 5.95, globe_p), (6.6, 10.95, vocab_p), (11.45, W('it grew across') + 0.3, jeff_p),
             (A_A - LEAD + 0.05, 29.95, alaska_p), (W('one nickname') - 0.1, T_GOLD, seward_p),
             (T_GOLD, tv_of(T_GN) + 0.12, gold_p), (tv_of(c_piece[3]) - 0.15, DUR, census_p)]
    CUTS = {5}                                                    # shot 5 (the gold) starts on a hard cut

    def local(P, tv):
        if P is gold_p:
            return min(max(tv - T_GOLD, 0.0), P.dur - 1 / FPS)
        return P.local(tv, tn_of(tv))

    def cam_at(tv):
        for i, (t0, t1, P) in enumerate(SHOTS):
            if t0 <= tv < t1 or (i == len(SHOTS) - 1 and tv >= t0):
                return P.cam(local(P, tv)), i, None
            nxt = SHOTS[i + 1] if i + 1 < len(SHOTS) else None
            if nxt and t1 <= tv < nxt[0]:
                if i + 1 in CUTS:
                    return P.cam(local(P, tv)), i, None
                A = P.cam(local(P, t1))
                Bc = nxt[2].cam(local(nxt[2], nxt[0]))
                u = ease_io((tv - t1) / (nxt[0] - t1))
                dist = math.hypot(Bc[0] - A[0], Bc[1] - A[1])
                lz = math.log(A[2]) + (math.log(Bc[2]) - math.log(A[2])) * u - min(0.45, dist / 9000) * math.sin(math.pi * u)
                return (A[0] + (Bc[0] - A[0]) * u, A[1] + (Bc[1] - A[1]) * u, math.exp(lz), A[3] + (Bc[3] - A[3]) * u), i, (P, nxt[2])
        return SHOTS[0][2].cam(0.0), 0, None

    def frame(tv):
        (x, y, z, r), i, gl = cam_at(tv)
        if not SHOTS[i][2].camera or gl:                          # card shots and glides get the handheld drift
            w = 1.2
            x += w * (math.sin(tv * 0.83 + 1.1) * 0.6 + math.sin(tv * 1.71 + 2.3) * 0.3) / z
            y += w * (math.sin(tv * 0.67 + 0.4) * 0.6 + math.sin(tv * 1.39 + 4.1) * 0.3) / z
        out = {'t': {'CAM': f'translate(960 540) rotate({r:.4f}) scale({z:.5f}) translate({-x:.2f} {-y:.2f})'}}
        live = {SHOTS[i][2]} | (set(gl) if gl else set())
        if i + 1 < len(SHOTS) and tv > SHOTS[i][1] - 0.6:
            live.add(SHOTS[i + 1][2])
        for P in panels:
            if P in live or tv < 0.04:
                for kind, d in P.update(local(P, tv)).items():
                    out.setdefault(kind, {}).update(d)
        return out
    return S, frame, stem, 0.0, DUR, (T_GN, SIL)


def long_desk_render():
    S, frame, stem, a, DUR, (T_GN, SIL) = long_desk()
    S.write(frame)
    d = S.dir
    subprocess.run(['nice', '-n', '10', 'node', os.path.join(KIT, 'anim_render.mjs'), d], check=True, capture_output=True)
    subprocess.run(['nice', '-n', '10', sys.executable, os.path.join(KIT, 'encode.py'), d, os.path.join(d, 'silent.mp4')], check=True, capture_output=True)
    wav = os.path.join(EP, 'public', 'audio', stem + '.wav')
    clip = os.path.join(d, 'clip.mp4')
    END_N = DUR - SIL
    flt = (f'[1:a]atrim=0:{T_GN:.3f},asetpts=PTS-STARTPTS,apad=pad_dur={SIL:.3f}[n1];'
           f'[1:a]atrim={T_GN:.3f}:{END_N:.3f},asetpts=PTS-STARTPTS,afade=t=out:st={END_N - T_GN - 0.1:.3f}:d=0.1[n2];'
           '[n1][n2]concat=n=2:v=0:a=1,apad[n];[0:a]volume=0.35[s];[n][s]amix=inputs=2:duration=shortest:normalize=0[a]')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(d, 'silent.mp4'), '-i', wav, '-filter_complex', flt,
                    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', clip], check=True)
    out = to720(clip, os.path.join(TR, 'ch03_long_desk.mp4'), crf=26)
    clean_frames(S)
    return out



# ================================================================ the contact sheet
SHEET = [('03_palace_print.mp4', [0.05, 0.9, 2.6, 4.2, 8.5]), ('ch03_long_desk.mp4', [3, 6.3, 11.2, 21, 24.5, 30.6, 37.9, 40.4, 45, 56.0, 57.0]),
         ('04_census_end.mp4', [13.0, 13.9, 14.3, 14.7, 15.3]), ('07_federation.mp4', [0.05, 0.9, 1.6, 2.6, 4.0, 7.7]),
         ('12_13_tariff_ends.mp4', [0.0, 0.25, 0.45, 0.7, 13.6, 14.5, 14.75, 15.3]), ('15_kalakaua_head.mp4', [0.03, 0.25, 0.45, 0.6, 1.5]),
         ('stevens_lower_third.mp4', [0.3, 1.0, 3.5, 5.6]), ('constitution_1887.mp4', [0.3, 1.0, 3.0, 5.8, 7.3])]


def contact_sheet():
    tw, th, cols = 384, 216, 6
    rows = []
    font = ImageFont.truetype(os.path.join(KIT, '..', 'fonts', 'IBMPlexMono-full.ttf'), 13)
    for name, ts in SHEET:
        src = os.path.join(TR, name)
        if not os.path.exists(src):
            continue
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout)
        tiles = []
        for t in ts:
            t = min(t, dur - 0.05)
            tmp = os.path.join(B, '_sheet.png')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', src, '-frames:v', '1', '-vf', f'scale={tw}:{th}', tmp], check=True)
            im = Image.open(tmp).convert('RGB')
            d = ImageDraw.Draw(im)
            d.rectangle([0, 0, tw, 17], fill=(0, 0, 0))
            d.text((4, 1), f'{name[:-4]}  {t:.2f}s', fill=(255, 210, 120), font=font)
            tiles.append(im)
        for i in range(0, len(tiles), cols):
            rows.append(tiles[i:i + cols])
    sheet = Image.new('RGB', (cols * tw + (cols + 1) * 4, len(rows) * (th + 4) + 4), (20, 20, 20))
    for r, row in enumerate(rows):
        for c, im in enumerate(row):
            sheet.paste(im, (4 + c * (tw + 4), 4 + r * (th + 4)))
    out = os.path.join(TR, 'deskA_sheet.jpg')
    sheet.save(out, quality=86)
    return out


# ================================================================ the list
PIECES = {'palace_print': (palace_print, '03_palace_print.mp4'), 'tariff_ends': (tariff_ends, '12_13_tariff_ends.mp4'),
          'kalakaua_head': (kalakaua_head, '15_kalakaua_head.mp4'), 'stevens_l3': (stevens_l3, None),
          'constitution': (constitution, 'constitution_1887.mp4'), 'federation': (federation, '07_federation.mp4'),
          'census_end': (census_end, '04_census_end.mp4'), 'long_desk': (lambda: long_desk()[:5], None)}


if __name__ == '__main__':
    args = sys.argv[1:]
    if args[:1] == ['--still']:
        print('\n'.join(stills(PIECES[args[1]][0](), args[2:])))
        sys.exit()
    if args[:1] == ['--sheet']:
        print(contact_sheet())
        sys.exit()
    if args[:1] == ['--check']:
        for k in args[1:]:
            S, frame, *_ = PIECES[k][0]()
            S.write(frame)
            edge_check(S)
        sys.exit()
    for k in args or list(PIECES):
        fn, name = PIECES[k]
        res = stevens_render() if k == 'stevens_l3' else long_desk_render() if k == 'long_desk' else finish(fn(), name)
        if k == 'federation':
            print('handoff', federation_handoff())
        print('piece', k, res, flush=True)
