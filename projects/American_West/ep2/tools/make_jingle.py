"""Build the Chunk History branding sound (intro + chapter-break sting).

  python3 tools/make_jingle.py            # DEFAULT (the user's call, Oct 2026): clicks and a page turn only, no tones, no music
  python3 tools/make_jingle.py piano      # felt piano + a low plucked cello, from two ElevenLabs one-note samples
  python3 tools/make_jingle.py marimba    # the synthesised marimba version
  python3 tools/make_jingle.py chop       # chopped old-record horn + hip-hop kick/snare + bass (ElevenLabs one-shots)
  python3 tools/make_jingle.py chop 8 out.mp3   # just the chopped jingle, 8 s, ringing out (Suno wants 6 s+ to upload)
  python3 tools/make_jingle.py lofi       # a lo-fi ElevenLabs Music take (L2), lined up so its hit lands on the lock
  -> writes public/music/chunk_jingle.mp3 and public/sfx/chunk_snap.wav

Piano version: ONE felt-piano note (C5) and ONE plucked-cello note (C3), made with ElevenLabs sound generation (checked in tune:
within 0.05 and 0.21 semitone) and kept in public/sfx/raw/. The tune's other notes are that sample resampled up or down (at most
5 semitones). Text-to-music takes (tools/jingle_takes.py) came back as a single struck chord, so the melody is played here instead.

The motif is four notes, G4 - E5 - D5 - C5 (a leap up, then a step down home: a question and its answer). In the intro the
last note lands on the coral quarter's lock (2.80 s) with the low plucked C under it; soft wood knocks sit under the blocks as they
land; nothing else (no hits for the word slabs: "not too much"). The chapter-break sting is the last two notes (D5 - C5) with the
low C. The marimba version (`marimba` argument) is a synthesised sketch of the same tune that also hits the slabs.
"""
import os, subprocess, wave
import numpy as np

R = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
NAMES = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def hz(n):
    return 440 * 2 ** ((NAMES[n[0]] + 12 * (int(n[1]) + 1) - 69) / 12)


def marimba(freq, dur=1.6, vel=1.0, seed=0):
    t = np.arange(int(R * dur)) / R
    body = np.sin(2 * np.pi * freq * t) * np.exp(-t * (5.0 if freq > 300 else 3.2))
    over = 0.35 * np.sin(2 * np.pi * freq * 3.9 * t) * np.exp(-t * 22)  # the marimba's bright 4x-ish overtone, dies fast
    click = np.random.RandomState(seed).randn(len(t)) * np.exp(-t * 260) * 0.12  # mallet
    s = (body + over + click) * (1 - np.exp(-t * 900))
    return vel * s


def raw_sample(name):
    path = os.path.join(HERE, "..", "public", "sfx", "raw", name)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(R), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def sample(name):
    """A one-note sample from public/sfx/raw as float mono at R."""
    x = raw_sample(name)
    k = int(0.004 * R)
    x[:k] *= np.linspace(0, 1, k)  # no click at the head
    m = int(0.25 * R)
    x[-m:] *= np.linspace(1, 0, m)
    return x


def shifted(x, semitones, vel=1.0, dur=None):
    """Resample by `semitones` (a decaying plucked/struck note, so the changed length doesn't matter)."""
    f = 2 ** (semitones / 12)
    idx = np.arange(0, len(x) - 1, f)
    y = np.interp(idx, np.arange(len(x)), x)
    if dur:
        y = y[:int(dur * R)]
        n = int(0.15 * R)
        y[-n:] *= np.linspace(1, 0, n)
    return vel * y


def knock(freq=420, vel=0.5, seed=0):
    t = np.arange(int(R * 0.14)) / R
    return vel * (np.sin(2 * np.pi * freq * t) * 0.7 + np.random.RandomState(seed).randn(len(t)) * 0.3) * np.exp(-t * 55)


def mix(events, total):
    out = np.zeros(int(R * total))
    for at, sig in events:
        i = int(at * R)
        out[i:i + len(sig)] += sig[:max(0, len(out) - i)]
    room = np.zeros_like(out)
    for d, g in [(0.027, 0.22), (0.051, 0.15), (0.083, 0.1), (0.121, 0.06)]:
        k = int(d * R)
        room[k:] += out[:-k] * g
    out = out + room
    return out / (np.abs(out).max() * 1.15)


def write(path, x):
    pcm = (x * 32767).astype(np.int16)
    tmp = path + ".tmp.wav"
    with wave.open(tmp, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(R); w.writeframes(pcm.tobytes())
    if path.endswith(".mp3"):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-c:a", "libmp3lame", "-q:a", "2", path], check=True)
        os.remove(tmp)
    else:
        os.replace(tmp, path)


def main_piano():
    P, Z = sample("jingle_piano_C5.mp3"), sample("jingle_pizz_C3.mp3")
    # the sample is C5; G4 = -5, E5 = +4, D5 = +2, C5 = 0 semitones
    knocks = [(f / 30 - 0.02, knock(430 + 40 * i, 0.4, i)) for i, f in enumerate([36, 50, 60, 68, 74])]
    motif = [(2.00, -5, 0.8, 0.9), (2.25, 4, 0.85, 0.9), (2.50, 2, 0.85, 0.9), (2.80, 0, 1.1, 2.6)]
    notes = [(a, shifted(P, st, v, d)) for a, st, v, d in motif]
    lock = [(2.80, shifted(Z, 0, 0.9, 1.6))]  # the low plucked cello C3 lands with the last note
    write(os.path.join(HERE, "..", "public", "music", "chunk_jingle.mp3"), mix(knocks + notes + lock, 5.5))
    snap = [(0.62, shifted(P, 2, 0.8, 1.0)), (1.0, shifted(P, 0, 1.0, 1.8)), (1.0, shifted(Z, 0, 0.7, 1.4))]
    write(os.path.join(HERE, "..", "public", "sfx", "chunk_snap.wav"), mix(snap, 2.2))
    print("wrote felt piano + pizzicato jingle and snap")


def loudness(x):
    """Integrated LUFS of a float mono signal at R."""
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    r = subprocess.run(["ffmpeg", "-nostats", "-f", "s16le", "-ar", str(R), "-ac", "1", "-i", "-", "-af", "ebur128", "-f", "null", "-"],
                       input=pcm.tobytes(), capture_output=True).stderr.decode()
    import re
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1])


def to_lufs(x, target=-18.5):
    g = 10 ** ((target - loudness(x)) / 20)
    return x * min(g, 0.89 / np.abs(x).max())


def slice_(x, a, b, semis, vel=1.0, fade=0.006, dur=None):
    """Chop x[a:b] seconds, retune by `semis` semitones (resample), short fades so the chop doesn't click."""
    y = shifted(x[int(a * R):int(b * R)], semis, vel)
    if dur:
        y = y[:int(dur * R)]
    n = min(int(fade * R), len(y) // 2)
    y[:n] *= np.linspace(0, 1, n)
    y[-n * 3:] *= np.linspace(1, 0, n * 3)
    return y


def lowpass(x, hz=5200):
    """One-pole low pass: takes the edge off, a little dusty."""
    a = np.exp(-2 * np.pi * hz / R)
    y = np.zeros_like(x)
    for i in range(1, len(x)):
        y[i] = (1 - a) * x[i] + a * y[i - 1]
    return y


def sfx_sample(name, keep=0.22):
    """A short sound from the channel's sound-effect set (public/sfx/<name>.wav): first `keep` seconds, faded out."""
    path = os.path.join(HERE, "..", "public", "sfx", name + ".wav")
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(R), "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).copy()
    x = x[:int(keep * R)]
    n = min(int(0.03 * R), len(x) // 2)
    x[-n:] *= np.linspace(1, 0, n)
    return x / max(np.abs(x).max(), 1e-6)


def click(name):
    """One single click from the bank cut out of the ElevenLabs pen / key / mouse takes (public/sfx/raw/jingle_click_*.wav)."""
    with wave.open(os.path.join(HERE, "..", "public", "sfx", "raw", f"jingle_click_{name}.wav")) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32767
    x = x[:int(0.05 * R)].copy()  # the first 50 ms: some takes have a faint release bump ~70 ms later
    n = int(0.012 * R)
    x[-n:] *= np.linspace(1, 0, n)
    return x


def main_foley():
    """Clicks and a page turn only, no tones and no music (the user's call). Each click is a single transient cut from a pen, a
    keyboard key or a mouse (they die away in 9-20 ms; the old tick files rang at ~2.6 kHz, so they're not used). Timed to the
    intro: five blocks landing faster and faster, the coral lock as a layered click-clack, CHUNK as one firm click, HIS-TO-RY as
    three tiny clicks (one per syllable), then a page turn into the title card."""
    page = sfx_sample("page_turn", 0.7)
    out = np.zeros(int(R * 5.5))
    def put(buf, at, sig):
        i = int(at * R)
        buf[i:i + len(sig)] += sig[:max(0, len(buf) - i)]
    for at, name, st, v in [(1.20, "mouse1", 0, 0.7), (1.67, "pen0", -2, 0.65), (2.00, "key0", 1, 0.7), (2.27, "pen1", 2, 0.65), (2.47, "mouse2", 3, 0.7)]:
        put(out, at, shifted(click(name), st, v))
    put(out, 2.79, shifted(click("pen2"), -2, 1.0))       # the lock: a click-clack, two clicks 14 ms apart, the second heavier
    put(out, 2.80 + 0.014, shifted(click("key2"), -3, 1.0))
    put(out, 3.60, shifted(click("key0"), -4, 1.0))       # CHUNK: one firm click
    put(out, 3.60, shifted(click("mouse0"), -2, 0.5))
    for at, name, st in [(3.95, "pen0", 1), (4.04, "pen1", 2), (4.13, "pen0", 3)]:   # HIS - TO - RY
        put(out, at, shifted(click(name), st, 0.75))
    put(out, 4.45, shifted(page, 0, 0.5))                  # a page turn into the title card
    out *= 10 ** (-8 / 20) / np.abs(out).max()
    write(os.path.join(HERE, "..", "public", "music", "chunk_jingle.mp3"), out)
    # chapter-break sting (2.2 s): the lock click-clack at 1.0 s (the coral quarter), a page turn as the next chapter fades up
    sn = np.zeros(int(R * 2.2))
    put(sn, 0.99, shifted(click("pen2"), -2, 0.8))
    put(sn, 1.014, shifted(click("key2"), -3, 0.8))
    put(sn, 1.2, shifted(page, 0, 0.55))
    sn *= 10 ** (-3 / 20) / np.abs(sn).max()
    write(os.path.join(HERE, "..", "public", "sfx", "chunk_snap.wav"), sn)
    print("wrote clicks-and-page-turn branding sound and snap")


def main_chop(total=5.5, out_path=None):
    horn, kick, snare, bass = (raw_sample(f"jingle_{n}.mp3") for n in ("horn_old", "kick", "snare2", "bass"))
    # old-record horn phrase, measured: A#4 D#5 C#5 D#5 F#4 D#5 F4 D#5, each 0.17-0.32 semitone flat. Down 2 semitones and
    # retuned = G#4 C#5 B4 C#5 E4 C#5 D#4 C#5: all in E major / C# minor, the bass note C#2.
    dev = {"A#4": -0.32, "D#5": -0.24, "C#5": -0.17, "F#4": -0.18, "F4": 0.03}
    up = lambda n: -2 - dev[n]
    kick = kick * (0.8 / max(np.abs(kick).max(), 1e-6))
    snare = snare * (0.7 / max(np.abs(snare).max(), 1e-6))
    bass_c = shifted(bass, 1.0 - 0.0, 1.0, 1.4)  # the sample is a low C; +1 semitone = C#
    ev = [
        (1.20, kick * 0.9), (1.20, slice_(horn, 1.34, 1.54, up("F#4"), 0.8)),                    # first block lands: kick + E4 chop
        (1.67, slice_(horn, 0.48, 0.82, up("D#5"), 0.8, dur=0.25)),
        (2.00, slice_(horn, 0.82, 1.02, up("C#5"), 0.8)),
        (2.27, snare * 0.8), (2.27, slice_(horn, 1.54, 1.74, up("D#5"), 0.8)),
        (2.47, slice_(horn, 0.04, 0.48, up("A#4"), 0.9, dur=0.3)),
        (2.80, kick), (2.80, bass_c * 0.9), (2.80, slice_(horn, 1.90, 3.44, up("D#5"), 1.0, dur=1.5)),  # the lock: kick, bass, held C#5 chop
        (3.60, snare * 0.55),                                                                    # CHUNK
        (3.95, kick * 0.8), (3.95, slice_(horn, 1.74, 1.90, up("F4"), 0.8)),                     # HISTORY
    ]
    rng = np.random.RandomState(3)
    out = np.zeros(int(R * total))
    for at, sig in ev:
        i = int(at * R)
        out[i:i + len(sig)] += sig[:max(0, len(out) - i)]
    out = lowpass(out)
    if total > 5.5:  # a longer file (for uploading as a reference, e.g. Suno wants 6 s or more): let it ring out in a small room
        wet = np.zeros_like(out)
        for d, g in [(0.19, 0.32), (0.37, 0.2), (0.61, 0.12), (0.93, 0.07)]:
            k = int(d * R)
            wet[k:] += out[:-k] * g
        out = out + wet
    crackle = (rng.rand(len(out)) < 0.0009) * rng.randn(len(out)) * 0.05  # a little vinyl
    out = out + crackle
    fade = int((total - 0.9 if total <= 5.5 else total - 1.5) * R)
    out[fade:] *= np.linspace(1, 0, len(out) - fade)
    out = to_lufs(out)
    if out_path:
        write(out_path, out)
        print(f"wrote {out_path} ({total:.1f} s)")
        return
    write(os.path.join(HERE, "..", "public", "music", "chunk_jingle.mp3"), out)
    # chapter-break sting: kick + the C#5 chop + bass at 1.0 s (quiet)
    snap = [(0.62, slice_(horn, 0.82, 1.02, up("C#5"), 0.7)), (1.0, kick * 0.9), (1.0, slice_(horn, 1.90, 3.44, up("D#5"), 0.9, dur=0.9)), (1.0, bass_c * 0.7)]
    sn = np.zeros(int(R * 2.2))
    for at, sig in snap:
        i = int(at * R); sn[i:i + len(sig)] += sig[:len(sn) - i]
    write(os.path.join(HERE, "..", "public", "sfx", "chunk_snap.wav"), to_lufs(lowpass(sn), -16))
    print("wrote chopped-horn jingle and snap")


def main_lofi():
    x = raw_sample("jingle_lofi_L2.mp3")
    off = 0.2  # L2's strong hit is at 3.0 s; start 0.2 s in so it lands on the lock at 2.80 s
    y = x[int(off * R):int((off + 5.5) * R)].copy()
    y[:int(0.25 * R)] *= np.linspace(0, 1, int(0.25 * R))
    y[int(4.4 * R):] *= np.linspace(1, 0, len(y) - int(4.4 * R))
    write(os.path.join(HERE, "..", "public", "music", "chunk_jingle.mp3"), to_lufs(y))
    print("wrote lo-fi jingle (the snap sting is left as it was)")


def main():
    # block landings in the intro (frames 36, 50, 60, 68, 74 at 30 fps): soft wood knocks
    knocks = [(f / 30 - 0.02, knock(430 + 40 * i, 0.5, i)) for i, f in enumerate([36, 50, 60, 68, 74])]
    motif = [(2.00, "G4", 0.85), (2.25, "E5", 0.9), (2.50, "D5", 0.9), (2.80, "C5", 1.15)]
    notes = [(a, marimba(hz(n), 2.4 if n == "C5" else 1.2, v, i)) for i, (a, n, v) in enumerate(motif)]
    lock = [(2.80, marimba(hz("C3"), 2.2, 0.8, 7)), (2.80, marimba(hz("G3"), 1.8, 0.4, 8))]
    slabs = [(3.60, marimba(hz("C3"), 1.6, 0.75, 9)), (3.95, marimba(hz("G2"), 1.8, 0.85, 10))]
    ring = [(3.95, marimba(hz("C4"), 1.5, 0.45, 11))]
    write(os.path.join(HERE, "..", "public", "music", "chunk_jingle.mp3"), mix(knocks + notes + lock + slabs + ring, 5.5))
    # chapter-break sting: D5 then C5 (+ low C), landing at 1.0 s to match the snap (frame 30)
    snap = [(0.62, marimba(hz("D5"), 1.0, 0.8, 1)), (1.0, marimba(hz("C5"), 1.8, 1.0, 2)), (1.0, marimba(hz("C3"), 1.6, 0.6, 3))]
    write(os.path.join(HERE, "..", "public", "sfx", "chunk_snap.wav"), mix(snap, 2.2))
    print("wrote public/music/chunk_jingle.mp3 and public/sfx/chunk_snap.wav")


if __name__ == "__main__":
    import sys
    if sys.argv[1:2] == ["chop"] and len(sys.argv) > 3:  # chop TOTAL_SECONDS OUT.mp3: just the jingle, longer, to a given file
        main_chop(float(sys.argv[2]), sys.argv[3])
    else:
        {"marimba": main, "chop": main_chop, "lofi": main_lofi, "piano": main_piano}.get(sys.argv[1] if sys.argv[1:] else "", main_foley)()
