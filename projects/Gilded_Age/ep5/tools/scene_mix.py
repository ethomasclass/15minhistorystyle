"""Episode 5 scenes (adapted from ../../ep4/tools/scene_mix.py): put the character lines inside the scene, keep the narrator dry.
  python3 scene_mix.py                 # every chapter with a scene
  python3 scene_mix.py ch01 ch09       # some
For each chapter with a scene (SCENES) it writes, next to the narration in ../public/audio/:
  <ch>.scene.wav   the narration with each CHARACTER line placed in its room (EQ, distance, reverb); narrator untouched
  <ch>.fx.wav      the scene's ambience beds and spot effects, on the same timeline
  <ch>.preview.mp3 scene + fx together, for listening (no music)
and ../public/audio/ep5_dialog_preview.mp3: every dialog scene back to back with a little lead-in.
Times come from the chapter's words.json (find a phrase), so a re-voiced chapter re-times itself.

How it sounds "inside": the bed sits low under the narrator and swells into each character line (+9 dB), then settles;
character lines get a short room (or an open-air slap, or distance), so they sound recorded in the place, while the
narrator stays the dry storyteller on top. Spots are only for things on screen (channel rule). Outdoor lines get no reverb at all."""
import json, os, re, subprocess, sys, tempfile, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__))
AUD = os.path.join(HERE, '..', 'public', 'audio')
SFX = os.path.join(HERE, '..', 'public', 'sfx')
# beds and spots: Ep 5's own (sfx_ep5.py), else Ep 4's (bed_winter_kitchen, bed_clubhouse ...) and Ep 3's
SFX_DIRS = [SFX] + [os.path.join(HERE, '..', '..', e, 'public', 'sfx') for e in ('ep4', 'ep3')]
sfx_path = lambda n: next((p for p in (os.path.join(d, n + '.wav') for d in SFX_DIRS) if os.path.exists(p)), os.path.join(SFX, n + '.wav'))
R = 44100
TMP = tempfile.mkdtemp()
db = lambda x: 10 ** (x / 20)

# bed levels are RMS dBFS after each bed is normalised; the narration sits at about -18 LUFS (about -21 dBFS RMS)
NARR_DB, DLG_DB = -40, -31
# rooms: rt = decay (s), wet = reverb level (dB), pre = pre-delay (s), lp = wet lowpass (Hz), slap = (delay s, dB) or None,
#        dry = dry gain (dB), dlp/dhp = dry low/high pass (Hz) for distance
ROOMS = {
    # outdoors there are no walls: no reverb and no slap, just a voice in open air (a little less low end than the
    # close studio sound) with the ambience around it doing the work (user, Nov 13: the first version sounded indoors)
    'outdoor': dict(rt=None, dhp=150),
    'ship':    dict(rt=0.55, wet=-14, pre=0.006, lp=2600, slap=None),
    'room':    dict(rt=0.38, wet=-15, pre=0.004, lp=3800, slap=None),
    'far':     dict(rt=None, dry=-10, dlp=2600, dhp=350),        # shouted across an open crowd: quieter, thinner, no room
    'window':  dict(rt=None, dry=-4, dlp=5000, dhp=200),         # at an upstairs window, heard from the street
    'hall':    dict(rt=0.55, wet=-14, pre=0.005, lp=3400, slap=None), # the building's hallway: plaster, a stairwell
    'sod':     dict(rt=0.26, wet=-17, pre=0.003, lp=2800, slap=None, dlp=9000), # a sod house: thick earth walls, a low muslin ceiling: short and dark
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
    b = load(sfx_path(name))
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
        wet = fftconvolve(seg, ir(p['rt'], p['pre'], p['lp'], p['slap'])) * db(p['wet']) if p.get('rt') else np.zeros(len(seg))
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
        s = load(sfx_path(nm)); s = s / max(1e-6, np.abs(s).max()) * db(g)
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
# Episode 5: the river at Homestead, the yard and the stare-down are outdoors (dry: no reverb); the Kelly kitchen is a 'room', Uncle Owen's
# sod house is 'sod'. Spots are only for things on screen; their times are the edit's (the chapter's chNN.js), found from the words here.
# Chapters 1 to 5 belong to the first builder, 6 to 10 to the second (FULL_BUILD.md): edit only your own entries.
SCENES = {
    # ch 1 cold open (ch01.js): the river at night under ep5_homestead_dawn, the steam whistle on "whistle" (the clip's blast), the gate going
    # over (clip 12.2, mapped in ch01.js), the bed fading out into the silence of the stare-down before the freeze.
    'ch01': lambda f: dict(
        rooms={}, room_at=lambda t: None,
        beds=[dict(name='bed_river_night', t0=0.0, t1=f('who will fire first', end=True) + 0.3, fin=1.2, fout=2.6, narr=-37)],
        spots=[('steam_whistle', f('whistle') - 0.05, -13), ('gate_clank', 17.7, -19)],
        listen=[]),
    # ch 2 (ch02.js): the refinery floor under ep5_refinery shot A (Michael with the sack)
    'ch02': lambda f: dict(
        rooms={}, room_at=lambda t: None,
        beds=[dict(name='bed_refinery_floor', t0=f('He hauls heavy sacks') - 0.3, t1=f('And here\'s the wild part') - 0.1, fin=0.5, fout=0.6, narr=-38)],
        spots=[], listen=[]),
    # ch 4 (ch04.js): the assembly room (Ep 4's bed_clubhouse: a saloon's back room) under ep5_union_meeting, then the Kelly kitchen
    # (Ep 4's bed_winter_kitchen) under ep5_kitchen_1887, Tommy and Michael in the kitchen 'room'
    'ch04': lambda f: dict(
        rooms={'MICHAEL': 'room', 'TOMMY': 'room'}, room_at=lambda t: None,
        beds=[dict(name='bed_clubhouse', t0=f('Michael joined the Knights') - 0.3, t1=f('His little brother') + 0.2, fin=0.4, fout=0.4, narr=-41),
              dict(name='bed_winter_kitchen', t0=f('His little brother') + 0.1, t1=f('But the biggest fight') + 0.3, fin=0.4, fout=0.6, narr=-41, dlg=-33)],
        spots=[], listen=[(f('A union'), f("Mr. Duffy doesn't work at the refinery", end=True) + 1.0)]),
    # ch 5 (ch05.js): the river again under the Homestead callback, the door slam and the FELL SHORT stamp (ep5_door1_close: slam on "closed")
    'ch05': lambda f: dict(
        rooms={}, room_at=lambda t: None,
        beds=[dict(name='bed_river_night', t0=f('Remember those barges') - 0.2, t1=f('This is where they') + 0.6, fin=0.3, fout=0.8, narr=-39)],
        spots=[('door_slam_dust', f('closed.', nth=0), -12), ('stamp_thud', f('closed.', nth=0) + 0.52, -15)],
        listen=[]),
    # ---- chapters 6 to 10 (second builder): starting points, retime to your chNN.js ----
    # ch 6: Owen's lines in the sod house (ep5_farm_kitchen, ep5_corn_stove) under the winter bed; corn flares in the stove; door 2 slams
    'ch06': lambda f: dict(
        rooms={'OWEN': 'sod'}, room_at=lambda t: None,
        # ch06.js: the sod house under Owen's letter (ep5_farm_kitchen, from "Wheat's selling") and under the corn (ep5_corn_stove, from "Corn got")
        beds=[dict(name='bed_sod_winter', t0=f("Wheat's selling") - 0.6, t1=f('Farmers had three') - 0.1, fin=0.5, fout=0.5, narr=-41, dlg=-33),
              dict(name='bed_sod_winter', t0=f('Corn got so cheap') - 0.4, t1=f('So farmers teamed') + 0.2, fin=0.5, fout=0.6, narr=-41, dlg=-33)],
        # the three ears flare in the firebox (ch06.js mCS: clip 4.4, 7.0, 9.6); door 2 slams on "closed", the FELL SHORT stamp 0.52 s later
        spots=[('corn_flare', 51.46, -21), ('corn_flare', 54.38, -22), ('corn_flare', 56.42, -22),
               ('door_slam_dust', f('closed.', nth=0), -12), ('stamp_thud', f('closed.', nth=0) + 0.52, -15)],
        listen=[(f("Wheat's selling"), f('wants its payment', end=True) + 1.0)]),
    # ch 8 (ch08.js): Owen's line by his lamp (ep5_farm_kitchen) under the sod bed; the street crowd at the Capitol (ep5_coxey, from "When they reached")
    'ch08': lambda f: dict(
        rooms={'OWEN': 'sod'}, room_at=lambda t: None,
        beds=[dict(name='bed_sod_winter', t0=f("We've got our own") - 0.4, t1=f('That November') - 0.2, fin=0.3, fout=0.4, narr=-41, dlg=-33),
              dict(name='bed_street_crowd', t0=f('When they reached') - 0.25, t1=f('By 1896') - 0.2, fin=0.4, fout=0.6, narr=-38)],
        spots=[], listen=[(f("We've got our own"), f('party now', end=True) + 1.0)]),
    # ch 9 (ch09.js): the convention hall (ep5_bryan) under the opening and from "He finished" to Owen, the roar when the hall erupts on
    # "went wild"; Owen (sod); the train pulling in at Canton (ep5_porch, it stops on "trainload"); the kitchen; door 3 slams on "closed"
    'ch09': lambda f: dict(
        rooms={'OWEN': 'sod', 'TOMMY': 'room', 'MICHAEL': 'room', 'MA': 'room'}, room_at=lambda t: None,
        beds=[dict(name='bed_convention_crowd', t0=0.0, t1=f('A 36-year-old') - 0.2, fin=0.6, fout=0.4, narr=-38),
              dict(name='bed_convention_crowd', t0=f('He finished') - 0.2, t1=f("Bryan's a Nebraska", nth=0) - 0.4, fin=0.4, fout=0.5, narr=-40,
                   lift=[(f('The crowd went wild'), f('backed him too', end=True), -33)]),
              dict(name='bed_sod_winter', t0=f("Bryan's a Nebraska", nth=0) - 0.4, t1=f('Bryan crisscrossed') - 0.3, fin=0.3, fout=0.4, narr=-41, dlg=-33),
              dict(name='bed_winter_kitchen', t0=f('kitchen table') - 0.85, t1=f('McKinley won') - 0.3, fin=0.4, fout=0.6, narr=-41, dlg=-33)],
        spots=[('crowd_roar', f('went wild'), -16), ('train_arrive', f('trainload') - 1.7, -21),
               ('door_slam_dust', f('closed.', nth=0), -12), ('stamp_thud', f('closed.', nth=0) + 0.52, -15)],
        listen=[(f("Bryan's for the working man"), f('arguing about metal', end=True) + 1.0)]),
    # ch 10 (ch10.js): a FELL SHORT stamp on each "fell short" (ep5_doors_finale); distant fireworks over Manhattan as they burst on screen
    # (ep5_bridge_1898 bursts at clip 4.6, 8.2, 11.6, mapped in ch10.js)
    'ch10': lambda f: dict(
        rooms={}, room_at=lambda t: None, beds=[],
        spots=[('stamp_thud', f('fell', nth=0) + 0.02, -15), ('stamp_thud', f('fell', nth=1) + 0.02, -15), ('stamp_thud', f('fell', nth=2) + 0.02, -15),
               ('fireworks_distant', 32.1, -25), ('fireworks_distant', 37.2, -25), ('fireworks_distant', 41.0, -26)],
        listen=[]),
}

if __name__ == '__main__':
    only = sys.argv[1:] or list(SCENES)
    clips = []
    for ch in only:
        mix, listen = chapter(ch, SCENES[ch])
        for t0, t1 in listen:
            a, b = int(max(0, t0 - 1.0) * R), int(t1 * R)
            c = mix[a:b].copy(); f = int(0.4 * R); c[:f] *= np.linspace(0, 1, f); c[-f:] *= np.linspace(1, 0, f)
            clips += [c, np.zeros(int(1.2 * R))]
    if not sys.argv[1:] and clips:
        save(TMP + '/_all.wav', np.concatenate(clips))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', TMP + '/_all.wav', '-c:a', 'libmp3lame', '-b:a', '160k',
                        os.path.join(AUD, 'ep5_dialog_preview.mp3')], check=True)
        print('ep5_dialog_preview.mp3', round(sum(len(c) for c in clips) / R, 1), 's')
