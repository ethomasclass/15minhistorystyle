"""Build the Chunk History jingle (the "Aha" motif on marimba) and the chapter-break sting.

  python3 tools/make_jingle.py            # writes public/music/chunk_jingle.mp3 and public/sfx/chunk_snap.wav

The motif is four notes, G4 - E5 - D5 - C5 (a leap up, then a step down home: a question and its answer). In the intro the
last note lands on the coral quarter's lock (2.80 s); two low marimba hits ride under CHUNK (3.60 s) and HISTORY (3.95 s);
soft wood knocks sit under the blocks as they land. The chapter-break sting is the last two notes (D5 - C5) with the low C.
This is a synthesised marimba (sine fundamental + the marimba's 4x overtone, fast decay, mallet click), good enough to fix the
tune and timing; swap in a real marimba recording or a Suno take later, keeping the lock note on 2.80 s.
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
    main()
