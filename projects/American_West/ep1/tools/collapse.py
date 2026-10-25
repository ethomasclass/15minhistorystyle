"""Make a "legend sours" cue from two takes: a heroic fanfare that collapses (a tape-stop with a sour wobble) into a deflated cue.

  python3 tools/collapse.py FANFARE.mp3 CUT_SECONDS DEFLATED.mp3 OUT.mp3 [--stop 1.4] [--gap 0.25] [--into 0]

Suno won't turn a fanfare sour inside one song (it stays a fanfare), so the turn is made here:
  fanfare[0 : CUT]  ->  over --stop seconds the playback slows to a halt with a slight detuned wobble (a tape stop, the
  "horns go out of tune, the tempo drags" beat)  ->  --gap of silence  ->  the deflated take from --into seconds.
In the scene, start the cue CUT seconds before the word the collapse should land on ("Sort of." in Ep 1 ch 5).
"""
import argparse, shutil, subprocess
import numpy as np

FF = shutil.which("ffmpeg") or "ffmpeg"
RATE = 44100


def load(path, start=0.0):
    raw = subprocess.run([FF, "-v", "error", "-ss", str(start), "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(RATE), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def tape_stop(x, stop):
    """Read through x at a speed falling 1 -> 0 (ease-in) over `stop` seconds, with a small wobble; returns the slowed audio."""
    n = int(stop * RATE)
    t = np.arange(n) / n
    speed = (1 - t) ** 1.6 * (1 + 0.035 * np.sin(2 * np.pi * 5.5 * t * stop))
    pos = np.cumsum(speed)
    pos = pos[pos < len(x) - 1]
    i = pos.astype(int)
    f = (pos - i)[:, None]
    y = x[i] * (1 - f) + x[i + 1] * f
    return y * np.linspace(1, 0, len(y))[:, None] ** 0.7  # fade with it, so it ends in nothing


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("fanfare"); ap.add_argument("cut", type=float); ap.add_argument("deflated"); ap.add_argument("out")
    ap.add_argument("--stop", type=float, default=1.4); ap.add_argument("--gap", type=float, default=0.25)
    ap.add_argument("--into", type=float, default=0.0)
    a = ap.parse_args()
    fan = load(a.fanfare)
    c = int(a.cut * RATE)
    head, rest = fan[:c], fan[c:]
    stop = tape_stop(rest, a.stop)
    de = load(a.deflated, a.into)
    fade = int(0.05 * RATE)
    de[:fade] *= np.linspace(0, 1, fade)[:, None]
    out = np.concatenate([head, stop, np.zeros((int(a.gap * RATE), 2), np.float32), de])
    subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(RATE), "-i", "-", "-c:a", "libmp3lame", "-q:a", "2", a.out],
                   input=out.astype(np.float32).tobytes(), check=True)
    print(f"wrote {a.out}: fanfare to {a.cut:.2f}s, tape stop {len(stop) / RATE:.2f}s, gap {a.gap}s, then the deflated take "
          f"({len(out) / RATE:.1f}s total). Start it {a.cut:.2f}s before the collapse word.")


if __name__ == "__main__":
    main()
