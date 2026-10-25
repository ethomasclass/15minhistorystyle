"""Make several short jingle takes with ElevenLabs Music and rank them by how well they follow the target tune.

  python3 tools/jingle_takes.py make  A B C            # generate takes for those prompts (about 70 credits per 5 s take)
  python3 tools/jingle_takes.py rank                   # analyse every take in review/jingle_takes/ (free)

Text prompts can't pin exact notes, so we generate many short takes and keep the ones whose first notes go the right way:
the target is the Aha motif's INTERVALS (up a major sixth, then down two steps: +9 -2 -2 semitones), in any key.
"""
import json, os, subprocess, sys, urllib.error, urllib.request
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from voice import FFMPEG, env  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "review", "jingle_takes")
R = 22050
TARGET = [9, -2, -2]

STYLE = ("instrumental logo sting for a history documentary channel, about four seconds, warm, restrained, clever, "
         "never epic, no drums, no brass, no vocals")
PROMPTS = {
    "A": ("Four notes only on a soft felt piano, close and intimate, played evenly: a high note leaps up, then three "
          "gently falling steps home, like a question and its answer, ending on a held warm chord that rings out. " + STYLE, 5000),
    "B": ("Four notes on a felt piano, a leap up and then stepping down to the home note, with one low plucked cello "
          "pizzicato note landing together with the last piano note, then a short quiet ring-out. " + STYLE, 5000),
    "C": ("A soft wooden knock, another wooden knock, then four felt piano notes: leap up, step down, step down, home, "
          "ending on a soft held chord. Dry, close, like a desk in a quiet room. " + STYLE, 5000),
}


def make(names):
    env()
    os.makedirs(OUT, exist_ok=True)
    for n in names:
        prompt, ms = PROMPTS[n]
        for take in (1, 2):
            body = {"prompt": prompt, "music_length_ms": ms, "force_instrumental": True}
            req = urllib.request.Request("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128", data=json.dumps(body).encode(),
                                         method="POST", headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
            try:
                mp3 = urllib.request.urlopen(req, timeout=600).read()
            except urllib.error.HTTPError as e:
                sys.exit(f"ElevenLabs music {e.code}: {e.read().decode()[:400]}")
            path = os.path.join(OUT, f"{n}{take}.mp3")
            open(path, "wb").write(mp3)
            print("wrote", os.path.relpath(path, HERE + "/.."))


def load(path):
    raw = subprocess.run([FFMPEG, "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(R), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)


def hps_f0(spec, freqs, lo=190, hi=1400):
    """Harmonic product spectrum pitch for one magnitude spectrum."""
    best, bf = 0.0, 0.0
    idx = np.where((freqs >= lo) & (freqs <= hi))[0]
    for i in idx:
        v = spec[i]
        for h in (2, 3, 4):
            j = i * h
            if j >= len(spec):
                v = 0
                break
            v *= spec[j]
        if v > best:
            best, bf = v, freqs[i]
    return bf


def notes(path):
    x = load(path)
    n, hop = 2048, 512
    win = np.hanning(n)
    frames = np.lib.stride_tricks.sliding_window_view(x, n)[::hop] * win
    S = np.abs(np.fft.rfft(frames, axis=1))
    f = np.fft.rfftfreq(n, 1 / R)
    flux = np.r_[0, np.maximum(np.diff(np.log1p(S * 20), axis=0), 0).sum(1)]
    thr = max(np.percentile(flux, 92), 1e-6)
    on = [i for i in range(2, len(flux) - 2) if flux[i] > thr and flux[i] == flux[i - 2:i + 3].max()]
    # merge onsets closer than 120 ms
    merged = []
    for i in on:
        if not merged or (i - merged[-1]) * hop / R > 0.12:
            merged.append(i)
    out = []
    for i in merged[:8]:
        seg = S[i + 2:i + 8]
        if len(seg) == 0:
            continue
        f0 = hps_f0(seg.mean(0), f)
        if f0 > 0:
            out.append((round(i * hop / R, 2), round(12 * np.log2(f0 / 440) + 69)))
    return out


def score(seq):
    """Best match of TARGET intervals against any 4 consecutive detected notes."""
    best = (99, None)
    for k in range(0, max(1, len(seq) - 3)):
        w = seq[k:k + 4]
        if len(w) < 4:
            continue
        iv = [w[j + 1][1] - w[j][1] for j in range(3)]
        d = sum(abs(a - b) for a, b in zip(iv, TARGET))
        if d < best[0]:
            best = (d, w)
    return best


def rank():
    names = "C C# D D# E F F# G G# A A# B".split()
    rows = []
    for fn in sorted(os.listdir(OUT)):
        if not fn.endswith(".mp3"):
            continue
        seq = notes(os.path.join(OUT, fn))
        d, w = score(seq)
        rows.append((d, fn, seq, w))
    for d, fn, seq, w in sorted(rows, key=lambda r: r[0]):
        pretty = " ".join(f"{names[m % 12]}{m // 12 - 1}@{t}s" for t, m in seq)
        tag = "MATCH" if d == 0 else (f"off by {d}" if d < 99 else "no 4-note run")
        print(f"{fn:8s} {tag:14s} {pretty}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "rank"
    if cmd == "make":
        make(sys.argv[2:] or list(PROMPTS))
    else:
        rank()
