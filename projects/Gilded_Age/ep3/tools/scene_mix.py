"""Episode 3 dialog scenes: put the character lines inside the scene, keep the narrator dry.
  python3 scene_mix.py                 # every chapter with a scene
  python3 scene_mix.py ch01 ch09       # some
For each chapter with a scene (SCENES) it writes, next to the narration in ../public/audio/:
  <ch>.scene.wav   the narration with each CHARACTER line placed in its room (EQ, distance, reverb); narrator untouched
  <ch>.fx.wav      the scene's ambience beds and spot effects, on the same timeline
  <ch>.preview.mp3 scene + fx together, for listening (no music)
and ../public/audio/ep3_dialog_preview.mp3: every dialog scene back to back with a little lead-in.
Times come from the chapter's words.json (find a phrase), so a re-voiced chapter re-times itself.

How it sounds "inside": the bed sits low under the narrator and swells into each character line (+9 dB), then settles;
character lines get a short room (or an open-air slap, or distance), so they sound recorded in the place, while the
narrator stays the dry storyteller on top. Spots are only for things on screen (channel rule)."""
import json, os, re, subprocess, sys, tempfile, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__))
AUD = os.path.join(HERE, '..', 'public', 'audio')
SFX = os.path.join(HERE, '..', 'public', 'sfx')
R = 44100
TMP = tempfile.mkdtemp()
db = lambda x: 10 ** (x / 20)

# bed levels are RMS dBFS after each bed is normalised; the narration sits at about -18 LUFS (about -21 dBFS RMS)
NARR_DB, DLG_DB = -40, -31
# rooms: rt = decay (s), wet = reverb level (dB), pre = pre-delay (s), lp = wet lowpass (Hz), slap = (delay s, dB) or None,
#        dry = dry gain (dB), dlp/dhp = dry low/high pass (Hz) for distance
ROOMS = {
    'outdoor': dict(rt=0.30, wet=-19, pre=0.020, lp=4500, slap=(0.11, -24)),
    'ship':    dict(rt=0.55, wet=-14, pre=0.006, lp=2600, slap=None),
    'room':    dict(rt=0.38, wet=-15, pre=0.004, lp=3800, slap=None),
    'far':     dict(rt=0.90, wet=-8, pre=0.040, lp=2600, slap=(0.16, -14), dry=-9, dlp=2800, dhp=320),
    'window':  dict(rt=0.35, wet=-14, pre=0.025, lp=4000, slap=(0.09, -20), dry=-3, dlp=5200, dhp=180),
}


def words(ch):
    return json.load(open(next(os.path.join(AUD, f) for f in os.listdir(AUD) if f.startswith(ch) and f.endswith('.words.json'))))


def norm(t):
    return re.sub(r"[^a-z0-9']", '', t.lower())


def finder(ws):
    toks = [norm(w['w']) for w in ws]
    def find(phrase, end=False, nth=0):
        p = [norm(x) for x in phrase.split()]
        hits = [i for i in range(len(toks) - len(p) + 1) if toks[i:i + len(p)] == p]
        if len(hits) <= nth:
            sys.exit(f'phrase not found: {phrase!r}')
        i = hits[nth]
        return ws[i + len(p) - 1]['e'] if end else ws[i]['s']
    return find


def load(path):
    with wave.open(path) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        return a if w.getnchannels() == 1 else a.reshape(-1, w.getnchannels()).mean(1)


def save(path, a):
    a = np.clip(a, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(R); w.writeframes((a * 32767).astype(np.int16).tobytes())


def rms_db(a):
    return 20 * np.log10(np.sqrt(np.mean(a ** 2)) + 1e-9)


def bed(name, n):
    """the bed normalised to 0 dBFS RMS reference and looped with 2 s crossfades to n samples"""
    b = load(os.path.join(SFX, name + '.wav'))
    b = sosfilt(butter(2, 60, 'hp', fs=R, output='sos'), b)
    b = b / db(rms_db(b))
    b = np.tanh(b / db(12)) * db(12)   # soft-limit transients (a door slam, a clock strike) to 12 dB over the bed's RMS
    x = int(2 * R); out = b.copy()
    while len(out) < n:
        f = np.linspace(0, 1, x)
        out = np.concatenate([out[:-x], out[-x:] * (1 - f) + b[:x] * f, b[x:]])
    return out[:n]


def smooth(env, sec):
    k = max(1, int(sec * R)); c = np.concatenate([[0], np.cumsum(np.pad(env, (k // 2, k - k // 2), mode='edge'))])
    return (c[k:] - c[:-k])[:len(env)] / k


def ir(rt, pre, lp, slap, seed=3):
    rng = np.random.default_rng(seed)
    n = int((pre + rt * 1.2) * R); t = np.arange(n) / R
    h = rng.standard_normal(n) * np.exp(-6.9 * np.maximum(t - pre, 0) / rt) * (t >= pre)
    h = sosfilt(butter(2, lp, 'lp', fs=R, output='sos'), h)
    h /= np.sqrt(np.sum(h ** 2))
    if slap:
        h[int(slap[0] * R)] += db(slap[1]) * 4
    return h


def spans(ws, who=None, pad=0.12):
    """[(t0, t1, who)] for each character line"""
    out = []
    for w in ws:
        if w['who'] == 'NARR' or (who and w['who'] != who):
            continue
        if out and out[-1][2] == w['who'] and w['s'] - out[-1][1] < 0.8:
            out[-1][1] = w['e']
        else:
            out.append([w['s'], w['e'], w['who']])
    return [(max(0, a - pad), b + pad, c) for a, b, c in out]


def chapter(ch, spec):
    d = words(ch); ws = d['words']; find = finder(ws)
    name = next(f for f in os.listdir(AUD) if f.startswith(ch) and f.endswith('.words.json'))[:-11]
    voice = load(os.path.join(AUD, name + '.wav')); n = len(voice)
    cfg = spec(find)
    lines = spans(ws)
    # 1. voices: replace each character line with its placed version (dry processed + wet), crossfaded at the edges
    out = voice.copy()
    for t0, t1, who in lines:
        room = cfg['rooms'].get(who) or cfg['room_at'](t0)
        if not room:
            continue
        p = ROOMS[room]
        a, b = int(t0 * R), int(t1 * R)
        seg = voice[a:b].copy()
        dry = seg * db(p.get('dry', 0))
        if p.get('dlp'): dry = sosfilt(butter(2, p['dlp'], 'lp', fs=R, output='sos'), dry)
        if p.get('dhp'): dry = sosfilt(butter(2, p['dhp'], 'hp', fs=R, output='sos'), dry)
        wet = fftconvolve(seg, ir(p['rt'], p['pre'], p['lp'], p['slap'])) * db(p['wet'])
        tail = len(wet) - len(seg)
        placed = np.concatenate([dry, np.zeros(tail)]) + wet
        f = int(0.03 * R); env = np.ones(len(placed)); env[:f] = np.linspace(0, 1, f)
        e = min(len(placed), n - a)
        # the original line is removed with short fades at the edges (the 0.12 s pads are room tone) and the placed one added
        orig = voice[a:b]; xf = np.ones(b - a); xf[:f] = np.linspace(0, 1, f); xf[-f:] = np.linspace(1, 0, f)
        placed[len(seg) - f:len(seg)] = dry[-f:] * np.linspace(1, 0, f) + wet[len(seg) - f:len(seg)]
        out[a:b] -= orig * xf
        out[a:a + e] += placed[:e] * env[:e]
    # 2. beds: low under the narrator, swelling into each character line inside the bed's window
    fx = np.zeros(n)
    for bd in cfg['beds']:
        a, b = int(bd['t0'] * R), min(n, int(bd['t1'] * R))
        lvl = np.full(n, db(bd.get('narr', NARR_DB)))
        for t0, t1, _ in lines:
            if bd['t0'] <= t0 < bd['t1']:
                lvl[int((t0 - 0.5) * R):int((t1 + 0.7) * R)] = db(bd.get('dlg', DLG_DB))
        for t0, t1, lv in bd.get('lift', []):
            lvl[int(t0 * R):int(t1 * R)] = db(lv)
        lvl = smooth(lvl, 0.6)
        win = np.zeros(n); fi, fo = int(bd.get('fin', 1.5) * R), int(bd.get('fout', 1.5) * R)
        win[a:b] = 1; win[a:a + fi] = np.linspace(0, 1, fi); win[b - fo:b] = np.linspace(1, 0, fo)
        fx += bed(bd['name'], n) * lvl * win
    for nm, t, g in cfg.get('spots', []):
        s = load(os.path.join(SFX, nm + '.wav')); s = s / max(1e-6, np.abs(s).max()) * db(g)
        a = int(t * R); e = min(len(s), n - a)
        fx[a:a + e] += s[:e]
    save(os.path.join(AUD, name + '.scene.wav'), out)
    save(os.path.join(AUD, name + '.fx.wav'), fx)
    save(TMP + '/_mix.wav', out + fx)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', TMP + '/_mix.wav', '-c:a', 'libmp3lame', '-b:a', '160k',
                    os.path.join(AUD, name + '.preview.mp3')], check=True)
    print(f'{name}: {len(lines)} character lines placed, {len(cfg["beds"])} beds, {len(cfg.get("spots", []))} spots')
    return out + fx, cfg.get('listen', [])


def rooms_by_time(ranges):
    return lambda t: next((r for a, b, r in ranges if a <= t < b), None)


# Each chapter: rooms per speaker (overrides), a room by time for the rest, beds and spots, and the stretch to put in the listen file.
SCENES = {
    'ch01': lambda f: dict(
        rooms={}, room_at=rooms_by_time([(0, 999, 'outdoor')]),
        beds=[dict(name='bed_harbor_dusk', t0=0.0, t1=f("I'll take the trunk", end=True) + 0.9, fin=2.5, fout=1.0,
                   lift=[(0.0, f('Three weeks ago'), -35)])],   # the opening shot breathes, then settles under the story
        spots=[('trunk_lift', f("I'll take the trunk", end=True) + 0.15, -20)],
        listen=[(f('He walks over'), f('He has never heard', end=True) + 1.5)]),
    'ch03': lambda f: dict(
        rooms={}, room_at=rooms_by_time([(0, 999, 'ship')]),
        beds=[dict(name='bed_steerage', t0=f('There they boarded'), t1=f('Then one morning'), fin=2.0, fout=2.0),
              dict(name='bed_harbor_dusk', t0=f('Then one morning'), t1=f('called Castle Garden', end=True) + 1.0, narr=-42)],
        listen=[(f('There they boarded'), f('Then one morning') + 4)]),
    'ch04': lambda f: dict(
        rooms={'YANKEL': 'far'}, room_at=rooms_by_time([(0, 999, 'outdoor')]),
        beds=[dict(name='bed_rotunda', t0=f('Inside, clerks asked'), t1=f('Now, about names') + 1.0, narr=-42),
              dict(name='bed_harbor_dusk', t0=f('And just outside it'), t1=f('was gone', end=True) + 1.5)],
        listen=[(f('And just outside it'), f('was gone', end=True) + 1.5)]),
    'ch06': lambda f: dict(
        rooms={}, room_at=lambda t: None,
        beds=[dict(name='bed_market', t0=f("Rivke's first morning"), t1=f('That was the point') + 3.0, fin=2.0, fout=3.0,
                   lift=[(f('Pushcarts, end to end'), f('It felt, for a second'), -31)])],
        listen=[(f("Rivke's first morning"), f('That was the point') + 3)]),
    'ch07': lambda f: dict(
        rooms={}, room_at=rooms_by_time([(0, 999, 'room')]),
        beds=[dict(name='bed_sweatshop', t0=f('So Yankel pressed seams'), t1=f('A reporter named'), fin=1.5, fout=2.0,
                   lift=[(f('So Yankel pressed seams'), f('So Yankel pressed seams') + 2.5, -34)])],
        listen=[(f('So Yankel pressed seams'), f('A reporter named') + 1.5)]),
    'ch09': lambda f: dict(
        rooms={'MA': 'window'}, room_at=lambda t: None,  # MA's later lines are re-roomed below by time
        beds=[dict(name='bed_brooklyn_street', t0=f('Michael Kelly was coming home'), t1=f('More of them', end=True) + 1.8, fout=1.8),
              dict(name='bed_kitchen_evening', t0=f('That evening'), t1=f('Nobody', end=True, nth=0) + 2.0, narr=-41, dlg=-32)],
        spots=[('trunk_thump', f('He grabbed the other end', end=True) + 0.25, -21),
               ('door_knock', f('there was a knock', end=True) + 0.15, -16),
               ('door_open', f('there was a knock', end=True) + 1.6, -24)],
        listen=[(f('Michael Kelly was coming home'), f('Nobody', end=True, nth=0) + 2.0)]),
}


def ch09_rooms(f):
    cfg = SCENES['ch09'](f); knock = f('That evening')
    cfg['rooms'] = {}
    cfg['room_at'] = lambda t: 'window' if t < knock else 'room'
    return cfg


SCENES['ch09_'] = ch09_rooms

if __name__ == '__main__':
    only = sys.argv[1:] or ['ch01', 'ch03', 'ch04', 'ch06', 'ch07', 'ch09']
    clips = []
    for ch in only:
        spec = SCENES['ch09_'] if ch == 'ch09' else SCENES[ch]
        mix, listen = chapter(ch, spec)
        for t0, t1 in listen:
            a, b = int(max(0, t0 - 1.0) * R), int(t1 * R)
            c = mix[a:b].copy(); f = int(0.4 * R); c[:f] *= np.linspace(0, 1, f); c[-f:] *= np.linspace(1, 0, f)
            clips += [c, np.zeros(int(1.2 * R))]
    if len(only) == 6:
        save(TMP + '/_all.wav', np.concatenate(clips))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', TMP + '/_all.wav', '-c:a', 'libmp3lame', '-b:a', '160k',
                        os.path.join(AUD, 'ep3_dialog_preview.mp3')], check=True)
        print('ep3_dialog_preview.mp3', round(sum(len(c) for c in clips) / R, 1), 's')
