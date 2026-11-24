# The cold-open transition joins, composited from the Blender tails (blender/coldopen.py TAIL=...) and the 2D pieces
# around them, into test clips with the narration under them (the cold open's own audio track, which is in film time).
#   join 1   decl_in    palace wide -> the flag's stripes -> the red and blue bands bleach to parchment -> the Declaration
#   join 2   decl_out   the Declaration -> the parchment takes colour as the stripes -> back out to the palace wide
#   join 24  window     the palace -> in through the veranda arch to her window -> inside, behind her -> the opening image
#   join 21  later      the room in late light -> down to the paper on her table (the abdication scan follows: deskB)
#   join 22  swap       the flag swap on the palace wide
#   python3 tools/tails_comp.py <join> [scale]     -> renders/tests/transitions/NN_<name>.mp4
# Frames come from blender/build/tails/<tail>/NNNN.png (named by scene frame; test renders may skip frames: the nearest
# earlier frame holds) and blender/build/f (the finished cold open).
import os, subprocess, sys, json, math
from PIL import Image, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.abspath(os.path.join(HERE, '..'))
BL = os.path.join(EP, 'blender', 'build')
OUTD = os.path.join(EP, 'renders', 'tests', 'transitions')
FPS = 30
G = 20.2
W, H = 960, 540


def words(stem):
    return json.load(open(os.path.join(EP, 'public', 'audio', stem + '.words.json')))['words']


def wt(stem, phrase, end=False):
    ws = words(stem)
    nm = lambda w: ''.join(ch for ch in w.lower() if ch.isalnum() or ch in "'ʻ")
    p = [nm(x) for x in phrase.split()]
    for i in range(len(ws) - len(p) + 1):
        if [nm(w['w']) for w in ws[i:i + len(p)]] == p:
            return ws[i + len(p) - 1]['e'] if end else ws[i]['s']
    raise KeyError(phrase)


class Seq:
    """a folder of frames named NNNN.png; frame(f) gives the nearest frame at or before f"""

    def __init__(self, d):
        self.d = d
        self.fs = sorted(int(x[:4]) for x in os.listdir(d) if x.endswith('.png') and x[:4].isdigit())
        self.cache = {}

    def frame(self, f):
        k = max([x for x in self.fs if x <= f] or [self.fs[0]])
        if k not in self.cache:
            self.cache = {k: Image.open(os.path.join(self.d, f'{k:04d}.png')).convert('RGB').resize((W, H), Image.LANCZOS)}
        return self.cache[k]

    @property
    def first(self):
        return self.fs[0]

    @property
    def last(self):
        return self.fs[-1]


def still(name, t):
    """a 2D piece's still at clip time t (rendered beforehand into build/declaration_stills, nearest available)"""
    d = os.path.join(EP, 'build', 'declaration_stills')
    have = [(abs(float(x[len(name) + 1:-4]) - t), x) for x in os.listdir(d) if x.startswith(name + '_')]
    return Image.open(os.path.join(d, min(have)[1])).convert('RGB').resize((W, H), Image.LANCZOS)


def smooth(u):
    u = min(1.0, max(0.0, u))
    return u * u * (3 - 2 * u)


PARCH = (236, 228, 208)                         # the white stripe and the parchment are the same cream


def bleach(im, u):
    """the flag's red and blue bands fade to the parchment; the white band is already parchment"""
    flat = Image.new('RGB', im.size, PARCH)
    return Image.blend(im, flat, smooth(u))


def encode(frames, out, a0, a1, audio=os.path.join(BL, 'audio.wav')):
    """frames: list of PIL images at 30 fps; the cold open's audio from a0 to a1 (film seconds) under it"""
    tmp = os.path.join(EP, 'build', 'tails_comp')
    os.makedirs(tmp, exist_ok=True)
    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))
    for i, im in enumerate(frames):
        im.save(os.path.join(tmp, f'{i:04d}.png'))
    os.makedirs(OUTD, exist_ok=True)
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(tmp, '%04d.png')]
    if audio:
        cmd += ['-ss', f'{a0:.3f}', '-t', f'{a1 - a0:.3f}', '-i', audio, '-c:a', 'aac', '-b:a', '128k', '-shortest']
    cmd += ['-c:v', 'libx264', '-crf', '23', '-pix_fmt', 'yuv420p', os.path.join(OUTD, out)]
    subprocess.run(cmd, check=True)
    print(os.path.join(OUTD, out), len(frames), 'frames')


def join_decl_in():
    main, tail = Seq(os.path.join(BL, 'f')), Seq(os.path.join(BL, 'tails', 'decl_in'))
    f0, f1 = tail.first, tail.last
    lead = 30                                   # one second of the cold open before the move
    fb0, fb1 = f1 - 8, f1                       # the bleach: the last 9 frames, once the stripes fill the frame
    fx = 8                                      # then the heading inks in over 8 frames as the push carries on
    out = []
    for f in range(f0 - lead, f1 + 1 + fx + 45):
        if f < f0:
            im = main.frame(f)
        elif f <= f1:
            im = tail.frame(f)
            if f >= fb0:
                im = bleach(im, (f - fb0 + 1) / (fb1 - fb0 + 1))
        else:
            t = f / FPS - G                     # Declaration clip time (chapter 2 time)
            d = still('decl_plain', t)
            u = (f - f1) / fx
            im = Image.blend(Image.new('RGB', (W, H), PARCH), d, smooth(u)) if u < 1 else d
        out.append(im)
    encode(out, '01_window_to_declaration.mp4', (f0 - lead) / FPS, (f1 + fx + 46) / FPS)


def join_decl_out():
    main, tail = Seq(os.path.join(BL, 'f')), Seq(os.path.join(BL, 'tails', 'decl_out'))
    f0, f1 = tail.first, tail.last
    lead, fx, fc = 36, 8, 9                     # 1.2 s of the Declaration; its ink fades over 8 frames; colour over 9
    out = []
    for f in range(f0 - lead, f1 + 46):
        if f < f0:
            t = f / FPS - G
            d = still('decl_plain', t)
            u = (f - (f0 - fx)) / fx
            im = Image.blend(d, Image.new('RGB', (W, H), PARCH), smooth(u)) if u > 0 else d
        elif f <= f1:
            im = tail.frame(f)
            if f < f0 + fc:
                im = bleach(im, 1 - (f - f0 + 1) / fc)
        else:
            im = main.frame(f)
        out.append(im)
    encode(out, '02_declaration_to_palace.mp4', (f0 - lead) / FPS, (f1 + 46) / FPS)


def join_window():
    push, room = Seq(os.path.join(BL, 'tails', 'window_push')), Seq(os.path.join(BL, 'tails', 'window_room'))
    ov0, ov1 = room.first, push.last            # the overlap: the outside window dissolves into the inside one
    out = []
    for f in range(push.first, room.last + 1):
        if f < ov0:
            im = push.frame(f)
        elif f <= ov1:
            im = Image.blend(push.frame(f), room.frame(f), smooth((f - ov0 + 1) / (ov1 - ov0 + 2)))
        else:
            im = room.frame(f)
        out.append(im)
    a0 = wt('ch09_back_to_the_question', 'Except the asking') - 1.6     # the match lands on "asking"
    encode(out, '24_window_return.mp4', a0, a0 + len(out) / FPS,
           audio=os.path.join(EP, 'public', 'audio', 'ch09_back_to_the_question.wav'))


def join_later():
    tail = Seq(os.path.join(BL, 'tails', 'later_light'))
    out = [tail.frame(f) for f in range(tail.first, tail.last + 1)]
    a0 = wt('ch08_under_protest', 'brought here') - 1.0
    encode(out, '21_room_later_light.mp4', a0, a0 + len(out) / FPS,
           audio=os.path.join(EP, 'public', 'audio', 'ch08_under_protest.wav'))


def join_swap():
    tail = Seq(os.path.join(BL, 'tails', 'flag_swap'))
    out = [tail.frame(f) for f in range(tail.first, tail.last + 1)]
    a0 = wt('ch08_under_protest', 'July 7th') - 0.1
    encode(out, '22_flag_swap.mp4', a0, a0 + len(out) / FPS,
           audio=os.path.join(EP, 'public', 'audio', 'ch08_under_protest.wav'))


if __name__ == '__main__':
    {'decl_in': join_decl_in, 'decl_out': join_decl_out, 'window': join_window, 'later': join_later,
     'swap': join_swap}[sys.argv[1]]()
