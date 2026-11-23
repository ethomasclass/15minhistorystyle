"""Bring a narration WAV to the channel's voice level: -18 LUFS integrated, true peak held at -1 dBTP.

  python3 tools/level_voice.py public/audio/ch02_1862.wav [more.wav ...]

Why: the music beds and sound effects are set against a -18 LUFS voice (the level of the Black Sox narration, whose mix
the channel keeps: voice about 13 LU over the music bed). ElevenLabs eleven_v4 renders about 6 dB quieter (~-24 LUFS), so
every new take is levelled here (voice.py calls this after writing the WAV). A linear gain does the work; a fast look-ahead
limiter (delay compensated, so word timings don't move) only touches the few syllables that would go over -1 dBTP.
The file keeps its sample rate, channel count and length; the .words.json timings stay valid.
"""
import json, os, re, shutil, subprocess, sys, tempfile

TARGET = -18.0
FF = shutil.which("ffmpeg") or "ffmpeg"


def loudness(path):
    r = subprocess.run([FF, "-nostats", "-hide_banner", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    i = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1])
    tp = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r)[-1])
    return i, tp


def probe(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=sample_rate,channels,duration_ts",
                        "-of", "json", path], capture_output=True, text=True).stdout
    s = json.loads(r)["streams"][0]
    return int(s["sample_rate"]), int(s["channels"]), int(s["duration_ts"])


def level(path):
    rate, ch, n = probe(path)
    i0, tp0 = loudness(path)
    gain = TARGET - i0
    for _ in range(3):  # the limiter shaves a little loudness off; nudge the gain until it lands within 0.2 LU
        tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False).name
        subprocess.run([FF, "-v", "error", "-y", "-i", path, "-af",
                        f"volume={gain:.2f}dB,alimiter=limit=0.891:attack=3:release=60:level=false:latency=true",
                        "-ar", str(rate), "-ac", str(ch), "-c:a", "pcm_s16le", tmp], check=True)
        i, tp = loudness(tmp)
        if abs(i - TARGET) <= 0.2:
            break
        gain += TARGET - i
    assert probe(tmp)[2] == n, "length changed"
    shutil.move(tmp, path)
    print(f"{os.path.basename(path)}: {i0:.1f} LUFS / {tp0:.1f} dBTP  ->  {i:.1f} LUFS / {tp:.1f} dBTP  (gain {gain:+.1f} dB)")


if __name__ == "__main__":
    for p in sys.argv[1:]:
        level(p)
