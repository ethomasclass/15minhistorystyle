"""The brand's click track re-cut for the condensed title card (kit/ga_brand.tsx TitleIntro, the logo at 1.4x).

  python3 tools/intro_clicks.py        -> public/music/chunk_intro_clicks.wav (3.1 s, mono 44.1 kHz) and a timing table

Why not the whole jingle at 1.4x (the Gilded Age's atempo=1.4): chunk_jingle.mp3 puts each click on the brand intro's MARK_LAND /
WM_LAND frames, but those are where the spring SETTLES (launch + FLIGHT = 22 frames). Remotion's spring (damping 15, stiffness 110,
mass 0.9) first reaches its rest 10.02 frames after launch, so every block and letter arrives 11.98 brand frames (8.6 frames at
1.4x) before its stretched click. So each click is cut out of the jingle on its own (no time-stretch, transients intact, the
file's own level: the Gilded Age plays the jingle at full volume) and placed on its piece's arrival:
    arrival (output frame) = (land - FLIGHT + ARRIVE) / SPEED
Clicks only: the page turn (4.45 s in the jingle) is never sliced. The card's last click ends long before the 3.1 s cut.
"""
import os, subprocess, wave
import numpy as np

R = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
JINGLE = os.path.join(HERE, "..", "public", "music", "chunk_jingle.mp3")
OUT = os.path.join(HERE, "..", "public", "music", "chunk_intro_clicks.wav")

SPEED = 1.4          # ga_brand INTRO_SPEED
FLIGHT = 22          # ChunkIntro FLIGHT
ARRIVE = 10.02       # frames from launch to the spring first reaching 1 (remotion spring, ChunkIntro's config; measured)
MARK_LAND = [36, 50, 60, 68, 74, 84]
WM_LAND = [108, 119]
LENGTH = 3.1         # the Gilded Age trims its intro clicks at 3.1 s (assemble.sh atrim=0:3.1)

arr = lambda land: (land - FLIGHT + ARRIVE) / SPEED  # output frame (30 fps)

# (piece, the click's start in chunk_jingle.mp3 (make_jingle.py main_foley), slice length s, output frame it lands on)
CLICKS = [
    ("block 1", 1.20, 0.20, arr(MARK_LAND[0])),
    ("block 2", 1.67, 0.20, arr(MARK_LAND[1])),
    ("block 3", 2.00, 0.20, arr(MARK_LAND[2])),
    ("block 4", 2.27, 0.15, arr(MARK_LAND[3])),
    ("block 5", 2.47, 0.20, arr(MARK_LAND[4])),
    ("coral quarter (click-clack)", 2.79, 0.25, arr(MARK_LAND[5])),
    ("CHUNK", 3.60, 0.25, arr(WM_LAND[0])),
    # HISTORY is one slab: HIS on its arrival, TO and RY after it at the jingle's syllable spacing, condensed 1.4x
    ("HISTORY: HIS", 3.95, 0.085, arr(WM_LAND[1])),
    ("HISTORY: TO", 4.04, 0.085, arr(WM_LAND[1]) + (4.04 - 3.95) * 30 / SPEED),
    ("HISTORY: RY", 4.13, 0.20, arr(WM_LAND[1]) + (4.13 - 3.95) * 30 / SPEED),
]
PRE = 0.004  # start each slice 4 ms early so no transient is clipped


def main():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", JINGLE, "-f", "f32le", "-ac", "1", "-ar", str(R), "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32)
    out = np.zeros(int(LENGTH * R), np.float32)
    for name, src, dur, frame in CLICKS:
        a, b = int((src - PRE) * R), int((src + dur) * R)
        y = x[a:b].copy()
        n = int(0.010 * R)
        y[-n:] *= np.linspace(1, 0, n)  # fade the slice's tail so the cut never clicks
        i = int(round((frame / 30 - PRE) * R))
        out[i:i + len(y)] += y[:len(out) - i]
    assert 4.45 > max(s + d for _, s, d, _ in CLICKS), "a slice reaches the page turn"
    pcm = (np.clip(out, -1, 1) * 32767).astype(np.int16)
    with wave.open(OUT, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(R); w.writeframes(pcm.tobytes())
    print(f"wrote {OUT} (peak {np.abs(out).max():.3f}, jingle peak {np.abs(x).max():.3f})")
    print(f"{'piece':30s} {'jingle s':>8s} {'lands f':>8s} {'click s':>8s}")
    for name, src, _, frame in CLICKS:
        print(f"{name:30s} {src:8.2f} {frame:8.2f} {frame / 30:8.3f}")


if __name__ == "__main__":
    main()
