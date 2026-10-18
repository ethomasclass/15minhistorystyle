"""Find and fetch openly licensed sound effects through Openverse (https://openverse.org, mostly Freesound), free.
Writes <out>/<name>.wav (silence trimmed, peak -2 dBFS, cut to `max` seconds with a fade), keeps the download in
<out>/raw/, and records title, creator, licence and source page in <out>/credits.json. Check the style repo's sfx/
folder first; reach for sfx_eleven.py (credits) only for a sound nobody has recorded.

  python3 tools/sfx_openverse.py --list "air raid siren"      # show candidates (licence, length, source)
  python3 tools/sfx_openverse.py siren wind                   # fetch these entries of SFX
  python3 tools/sfx_openverse.py --all                        # every entry of SFX
  python3 tools/sfx_openverse.py --out ../sfx siren           # into another folder (e.g. the style repo library)

Licences: only CC0, Public Domain Mark and CC BY are accepted (no NC: a monetised channel is commercial use; no ND:
cutting and mixing is a derivative; no SA). CC BY needs the credit line from credits.json in the description.
Openverse indexes other sites and does not verify licences, so the source page is saved with every file.
Anonymous API use is rate-limited (a few dozen searches an hour is fine).
"""
import json, os, re, subprocess, sys, time, urllib.error, urllib.parse, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from voice import FFMPEG  # noqa: E402

API = "https://api.openverse.org/v1/audio/"
LICENSES = "cc0,pdm,by"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "sfx")
UA = {"User-Agent": "15MinuteHistory-sfx/1.0 (educational YouTube channel)"}

# name: (search, min s, max s of the source, seconds to keep (None = all), pick = n-th acceptable result)
SFX = {
    # The Balloon War starter pack
    "balloon_inflate": ("balloon inflate", 1, 8, None, 0),
    "gas_hiss": ("gas hiss", 1, 10, 4, 0),
    "wind_high": ("strong wind", 10, 120, 20, 0),
    "waves_beach": ("ocean waves beach", 10, 180, 20, 0),
    "plane_flyby": ("propeller plane flyby", 3, 40, 10, 0),
    "plane_drone": ("propeller plane", 10, 120, 15, 0),
    "air_raid_siren": ("air raid siren", 10, 120, 15, 0),
    "tank_engine": ("tank engine", 4, 120, 10, 0),
    "radio_static": ("radio static", 3, 60, 8, 0),
    "morse_code": ("morse code", 2, 60, 6, 0),
    "paper_rustle": ("paper rustle", 1, 10, None, 0),
    "typewriter": ("typewriter", 2, 30, 6, 0),
    "explosion_distant": ("distant explosion", 1, 15, 6, 0),
    "artillery_distant": ("artillery guns firing", 20, 60, 12, 0),
    "rope_creak": ("rope creak", 150, 200, 6, 0),
    "forest_birds": ("forest birds ambience", 15, 300, 20, 0),
    "camera_shutter": ("old camera shutter", 0.3, 5, None, 0),
}


def search(q, page_size=20):
    """One search. Anonymous limits are 20 a minute and 200 a day, so space them out and wait out a 429."""
    url = API + "?" + urllib.parse.urlencode({"q": q, "license": LICENSES, "page_size": page_size, "filter_dead": "true"})
    for attempt in range(4):
        try:
            res = json.loads(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read())["results"]
            time.sleep(3.5)
            return res
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 3:
                raise
            print("  rate limited, waiting a minute")
            time.sleep(65)


def acceptable(r, lo, hi):
    d = (r.get("duration") or 0) / 1000
    return lo <= d <= hi and r.get("license") in LICENSES.split(",") and r.get("url")


def fetch(name, out):
    q, lo, hi, keep, pick = SFX[name]
    ok = [r for r in search(q) if acceptable(r, lo, hi)]
    # prefer CC0 / public domain over CC BY, keep Openverse's relevance order otherwise
    ok.sort(key=lambda r: r["license"] == "by")
    if len(ok) <= pick:
        sys.exit(f"{name}: no acceptable result for '{q}' ({lo}-{hi} s); try --list and change the search")
    raw = os.path.join(out, "raw")
    os.makedirs(raw, exist_ok=True)
    for r in ok[pick:]:  # some hosts refuse downloads; fall through to the next acceptable result
        ext = os.path.splitext(urllib.parse.urlparse(r["url"]).path)[1] or ".mp3"
        src = os.path.join(raw, name + ext)
        # curl, not urllib: the Freesound CDN refuses Python's client even with a User-Agent
        got = subprocess.run(["curl", "-fsSL", "--retry", "2", "-A", UA["User-Agent"], "-o", src, r["url"]], capture_output=True, text=True)
        if got.returncode == 0:
            break
        print(f"  {name}: download refused by {r.get('source')} ({got.stderr.strip()[:60]}), trying the next result")
    else:
        sys.exit(f"{name}: every acceptable result refused the download")
    finish(src, os.path.join(out, name + ".wav"), keep)
    cpath = os.path.join(out, "credits.json")
    credits = json.load(open(cpath)) if os.path.exists(cpath) else {}
    credits[name + ".wav"] = {
        "title": r.get("title"), "creator": r.get("creator"), "license": r["license"],
        "license_version": r.get("license_version"), "license_url": r.get("license_url"),
        "source": r.get("source"), "page": r.get("foreign_landing_url"), "openverse_id": r.get("id"),
        "attribution": r.get("attribution"), "search": q, "kept_seconds": keep,
    }
    json.dump(credits, open(cpath, "w"), indent=2, ensure_ascii=False)
    print(f"sfx/ {name}.wav  <- '{r.get('title')}' by {r.get('creator')} [{r['license'].upper()}] {r.get('foreign_landing_url')}")


def finish(src, dst, keep):
    """Trim leading silence, keep at most `keep` seconds (with a 0.4 s fade-out), normalise the peak to -2 dBFS."""
    trim = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.01"
    cut = f",atrim=0:{keep},afade=t=out:st={max(0, keep - 0.4)}:d=0.4" if keep else ""
    probe = subprocess.run([FFMPEG, "-hide_banner", "-i", src, "-af", trim + cut + ",volumedetect", "-f", "null", "-"],
                           capture_output=True, text=True).stderr
    m = re.search(r"max_volume: ([-0-9.]+) dB", probe)
    if not m:
        sys.exit(f"{dst}: nothing above -50 dB")
    peak = float(m.group(1))
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", src, "-af", f"{trim}{cut},volume={-2 - peak}dB",
                    "-ac", "2", "-ar", "44100", dst], check=True)


if __name__ == "__main__":
    args = sys.argv[1:]
    out = OUT
    if "--out" in args:
        i = args.index("--out")
        out = args[i + 1]
        del args[i:i + 2]
    if not args:
        sys.exit(__doc__)
    if args[0] == "--list":
        for r in search(" ".join(args[1:])):
            print(f"{r['license']:>4}  {(r.get('duration') or 0) / 1000:6.1f}s  {r.get('title', '')[:50]:50}  {r.get('foreign_landing_url')}")
        sys.exit()
    os.makedirs(out, exist_ok=True)
    for n in (list(SFX) if args == ["--all"] else args):
        fetch(n, out)
