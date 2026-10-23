"""Rough jingle mockups for the channel intro (melody, rhythm and timing to take to Suno; not finished audio).
Synthesised here with numpy: felt piano, pizzicato, a string pad, a celesta shimmer and a brushed swish.
Timed to the intro (src/kit/Intro.tsx, 6.2 s): the pad rises under the pull-back (0-2.4 s), the motif lands as
the logo arrives (2.4 s), the swish and final chord land on the title tape (3.6 s), the chord rings out.

  python3 music/jingle/mock_jingle.py      -> music/jingle/mockups/jingle_{A,B,C}.wav + .mp3
"""
import os, subprocess
import numpy as np

SR = 44100
LEN = 6.2
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "mockups")
NOTE = {n: i for i, n in enumerate(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"])}
hz = lambda n: 440 * 2 ** ((NOTE[n[:-1]] + 12 * (int(n[-1]) + 1) - 69) / 12)
t_all = np.arange(int(SR * LEN)) / SR
rng = np.random.default_rng(15)


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)


def lowpass(x, cut):
    # one-pole low-pass, run twice for a softer slope
    k = np.exp(-2 * np.pi * cut / SR)
    for _ in range(2):
        y = np.empty_like(x); acc = 0.0
        for i, v in enumerate(x):
            acc = (1 - k) * v + k * acc; y[i] = acc
        x = y
    return x


def piano(f, dur=2.2, vel=1.0):
    n = int(SR * dur); t = np.arange(n) / SR
    tone = sum(a * np.sin(2 * np.pi * f * m * (1 + 0.0004 * m * m) * t) for m, a in [(1, 1), (2, 0.42), (3, 0.18), (4, 0.08), (5, 0.04)])
    tone += 0.5 * np.sin(2 * np.pi * f * 1.002 * t)          # a little chorus, felt-piano warmth
    hammer = rng.normal(0, 1, n) * np.exp(-t / 0.008) * 0.15  # soft felt thump
    return vel * (tone * env(n, 0.006, 0.9) + hammer) * 0.22


def pizz(f, dur=0.6, vel=1.0):
    # Karplus-Strong pluck
    n = int(SR * dur); p = int(SR / f); buf = rng.uniform(-1, 1, p); out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.994
    return vel * lowpass(out, 2400) * 0.35


def pad(freqs, start, dur, rise=1.6, level=0.12):
    n = int(SR * dur); t = np.arange(n) / SR; x = np.zeros(n)
    for f in freqs:
        for det in (-0.004, 0, 0.004):
            ph = 2 * np.pi * f * (1 + det) * t
            x += sum(np.sin(ph * k) / k for k in range(1, 7))  # soft saw
    x = lowpass(x, 1400)
    e = np.minimum(1, t / rise) * np.minimum(1, (dur - t) / 0.9)
    return start, level * x * e / len(freqs)


def celesta(f, dur=2.5, vel=1.0):
    n = int(SR * dur); t = np.arange(n) / SR
    tone = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t / (0.9 / m)) for m, a in [(1, 1), (4.0, 0.25), (9.7, 0.08)])
    return vel * tone * np.minimum(1, t / 0.002) * 0.12


def swish(dur=0.32):
    n = int(SR * dur); t = np.arange(n) / SR
    x = rng.normal(0, 1, n); x = x - lowpass(x, 1800)  # high-passed noise, a brush across a snare
    return x * np.sin(np.pi * t / dur) ** 2 * 0.05


def place(mix, sig, at):
    i = int(at * SR); j = min(len(mix), i + len(sig)); mix[i:j] += sig[:j - i]


def cello(f, dur=1.6, vel=1.0):
    n = int(SR * dur); t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 0.4)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    x = sum(np.sin(ph * k) / k ** 1.3 for k in range(1, 9))
    x = lowpass(x, 1600)
    return vel * 0.16 * x * np.minimum(1, t / 0.12) * np.minimum(1, (dur - t) / 0.35)


def drone(f, dur, level=0.09):
    n = int(SR * dur); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.003 * t) + 0.25 * np.sin(2 * np.pi * f * 3 * t)
    x *= 1 + 0.15 * np.sin(2 * np.pi * 0.35 * t)                     # a slow breathing swell
    return level * x * np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.0)


def make(name, motif, chord, pad_chord, bass, voice="piano", drone_note=None, ostinato=None, tremolo=False, pre=None, shimmer=True):
    mix = np.zeros_like(t_all)
    s, p = pad(pad_chord, 0.0, 3.9, rise=2.2, level=0.10); place(mix, p, s)          # the pull-back: strings rise
    if drone_note: place(mix, drone(hz(drone_note), LEN), 0.0)                       # a low drone under everything
    if ostinato:                                                                         # quiet low pizzicato, creeping
        for i, n in enumerate(ostinato * 8):
            at = 0.3 + i * 0.3
            if at < 2.3: place(mix, pizz(hz(n), 0.4, 0.35 + 0.25 * at / 2.3), at)
    else:
        for at, n in [(0.35, bass), (1.35, bass)]: place(mix, piano(hz(n), 1.6, 0.55), at)  # low piano heartbeat
    for at, n, v in motif:                                                               # the hook, on the logo
        if voice == "cello":
            place(mix, piano(hz(n), 2.0, v), at); place(mix, cello(hz(n) / 2, 1.4, 0.8 * v), at)
        elif voice == "musicbox":
            place(mix, celesta(hz(n), 2.2, 2.2 * v), at); place(mix, piano(hz(n) / 2, 1.6, 0.35 * v), at)
        else:
            place(mix, piano(hz(n), 2.0, v), at); place(mix, pizz(hz(n) / 2, 0.5, 0.6 * v), at)
    place(mix, swish(), 3.30)                                                            # into the title tape
    end = 3.60
    if pre:                                                                              # a passing chord first (the shadow)
        for n in pre: place(mix, piano(hz(n), 1.2, 0.5), 3.60)
        place(mix, cello(hz(pre[0]), 0.75, 0.9), 3.60)
        end = 4.20
    for n in chord: place(mix, piano(hz(n), 2.8 if not pre else 2.2, 0.55), end)          # the final chord
    if voice == "cello": place(mix, cello(hz(chord[0]), 6.2 - end, 0.9), end)
    if tremolo:                                                                          # a vibraphone-like shimmer on top
        tr = celesta(hz(chord[-1]), 2.6, 1.0) * (0.6 + 0.4 * np.sin(2 * np.pi * 5.5 * np.arange(int(SR * 2.6)) / SR))
        place(mix, tr, 3.65)
    s, p = pad([hz(n) for n in chord[:3]], 3.55, 2.65, rise=0.25, level=0.09); place(mix, p, s)
    if shimmer:
        for k, n in enumerate(chord[-2:]): place(mix, celesta(hz(n) * 2, 2.4, 0.9), 3.62 + 0.09 * k)
    mix *= np.minimum(1, (LEN - t_all) / 0.5)                                            # fade out with the picture
    mix /= np.max(np.abs(mix)) / 0.7
    # small room: a few quiet early reflections
    wet = np.zeros_like(mix)
    for d, g in [(0.023, 0.25), (0.041, 0.18), (0.067, 0.12), (0.11, 0.08)]:
        i = int(d * SR); wet[i:] += g * mix[:-i]
    out = mix + lowpass(wet, 3500)
    out /= np.max(np.abs(out)) / 0.8
    os.makedirs(OUT, exist_ok=True)
    wav = os.path.join(OUT, f"jingle_{name}.wav")
    import wave
    with wave.open(wav, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
    try:
        import imageio_ffmpeg; ff = imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        ff = "ffmpeg"
    subprocess.run([ff, "-v", "error", "-y", "-i", wav, "-ac", "2", "-b:a", "192k", wav[:-4] + ".mp3"], check=True)
    print("wrote", wav[:-4] + ".mp3")


L = 2.40  # the logo lands
# A · "The question": rises, a small lift on the last note, then resolves on the tape (C major, add 9).
import sys
WHICH = sys.argv[1:] or list('ABCDEF')
_make = make
def make(name, *a, **k):
    if name in WHICH: _make(name, *a, **k)

make("A", [(L, "G4", 0.9), (L + 0.24, "C5", 0.8), (L + 0.48, "E5", 0.95), (L + 0.86, "D5", 0.85)],
     ["C3", "G3", "E4", "D5", "G5"], [hz("C3"), hz("G3"), hz("E4")], "C3")
# B · "Fif-teen min-ute": two long-short pairs in the rhythm of the name, answered by the chord (F major).
make("B", [(L, "C5", 0.95), (L + 0.30, "A4", 0.7), (L + 0.52, "F5", 0.95), (L + 0.82, "E5", 0.8)],
     ["F2", "C3", "A3", "G4", "C5"], [hz("F2"), hz("C3"), hz("A3")], "F2")
# C · "Turning the page": a gentle three-note climb and a step back down, the chord a little wistful (A minor to F).
make("C", [(L, "E4", 0.85), (L + 0.22, "A4", 0.85), (L + 0.44, "C5", 0.9), (L + 0.80, "B4", 0.8), (L + 1.0, "A4", 0.7)],
     ["F2", "C3", "A3", "E4", "C5"], [hz("A2"), hz("E3"), hz("C4")], "A2")

# --- more mysterious ---
# D · "The locked box": a music-box motif in D minor that climbs to C# (the harmonic-minor leading tone) and stops,
#     over a low D drone; the last chord is D minor with that C# still in it, so it never quite resolves.
make("D", [(L, "D5", 0.8), (L + 0.26, "F5", 0.8), (L + 0.52, "A5", 0.85), (L + 0.90, "C#6", 0.9)],
     ["D3", "A3", "F4", "C#5", "E5"], [hz("D3"), hz("A3"), hz("F4")], "D2", voice="musicbox", drone_note="D2")
# E · "The clue": a quiet low pizzicato creeping under the pull-back; the motif in E minor reaches a flattened
#     fifth (B-flat, the "something's off" note) and slides to A; ends on E minor with an added F#, a celesta B on top.
make("E", [(L, "E4", 0.85), (L + 0.24, "G4", 0.8), (L + 0.48, "A#4", 0.95), (L + 0.86, "A4", 0.85)],
     ["E2", "B2", "G3", "F#4", "B4"], [hz("E3"), hz("B3"), hz("G4")], "E2", ostinato=["E2", "B2", "G2", "B2"])
# F · "The dusty archive": A Dorian (minor with a raised sixth, F#, which glows), a five-note phrase, and a final
#     A minor 6/9 chord with a shimmering tremolo, hanging open like a question nobody has answered yet.
make("F", [(L, "A4", 0.8), (L + 0.22, "C5", 0.8), (L + 0.44, "D5", 0.85), (L + 0.70, "F#5", 0.95), (L + 1.0, "E5", 0.8)],
     ["A2", "E3", "C4", "F#4", "B4"], [hz("A2"), hz("E3"), hz("C4")], "A2", drone_note="A1", tremolo=True)

# --- thoughtful: neither mysterious nor upbeat ---
# G · "Open fifths": no third anywhere, so it is neither major nor minor; stately and timeless, like an old hymn
#     tune half-remembered. D-A-E … D, cello under the piano; the last chord is D-A-E (an open fifth with a ninth).
make("G", [(L, "D4", 0.85), (L + 0.30, "A4", 0.85), (L + 0.60, "E5", 0.9), (L + 1.0, "D5", 0.85)],
     ["D2", "A2", "D3", "A3", "E4"], [hz("D3"), hz("A3"), hz("E4")], "D2", voice="cello", drone_note="D2", shimmer=False)
# H · "The reflective chord": C-G-A … E, landing on F major 7 (warm but wistful: the sound of looking back).
make("H", [(L, "C4", 0.85), (L + 0.28, "G4", 0.85), (L + 0.56, "A4", 0.9), (L + 0.94, "E5", 0.85)],
     ["F2", "C3", "A3", "E4", "A4"], [hz("A2"), hz("E3"), hz("C4")], "A2", voice="cello", shimmer=False)
# I · "A shadow before home": G-E-F … D, then the cadence borrows F minor for a moment before settling on C (add 9):
#     honest, a little bittersweet, then steady. The most "earned" ending.
make("I", [(L, "G4", 0.85), (L + 0.28, "E4", 0.8), (L + 0.56, "F4", 0.85), (L + 0.94, "D4", 0.85)],
     ["C2", "G2", "E3", "D4", "G4"], [hz("C3"), hz("G3"), hz("E4")], "C2", voice="cello", pre=["F2", "C3", "G#3", "C4"], shimmer=False)

# --- "CHUNK · HIS-to-ry": one firm low note, then three quick ones (the rhythm of the name; works as a signature either way) ---
# J · "Grounded": a firm low D, then A-B-A; ends on D with A and E (sus2): steady, neither bright nor dark.
make("J", [(L, "D3", 1.0), (L + 0.34, "A4", 0.8), (L + 0.48, "B4", 0.8), (L + 0.62, "A4", 0.9)],
     ["D2", "A2", "D3", "A3", "E4"], [hz("D3"), hz("A3"), hz("E4")], "D2", voice="cello", shimmer=False)
# K · "Looking back": a firm low A, then C-B-G; ends on F major 7: warm, a little wistful.
make("K", [(L, "A2", 1.0), (L + 0.34, "C5", 0.8), (L + 0.48, "B4", 0.8), (L + 0.62, "G4", 0.9)],
     ["F2", "C3", "A3", "E4", "A4"], [hz("A2"), hz("E3"), hz("C4")], "A2", voice="cello", shimmer=False)
# L · "Steady, with a shadow": a firm low G, then D-E-D; a moment of C minor, then home on G (add 9).
make("L", [(L, "G2", 1.0), (L + 0.34, "D4", 0.8), (L + 0.48, "E4", 0.8), (L + 0.62, "D4", 0.9)],
     ["G2", "D3", "B3", "A4", "D5"], [hz("G2"), hz("D3"), hz("B3")], "G2", voice="cello", pre=["C3", "G3", "D#4", "G4"], shimmer=False)
