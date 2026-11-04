"""Real period music: search the Library of Congress National Jukebox (78 rpm records, 1900-1925) and download a
recording with its credit. How the Reconstruction series got Fisk Jubilee Singers spirituals, Civil War band medleys
and Stephen Foster (projects/Reconstruction/MUSIC.md).

  python3 -I tools/jukebox.py search "roll jordan roll"                 # id | date | title | performers
  python3 -I tools/jukebox.py search "marching through georgia" 20      # more results
  python3 -I tools/jukebox.py get jukebox-128182 public/music/period/roll_jordan_fisk_1909.mp3

Rights: US sound recordings published before 1926 are in the public domain (Music Modernization Act, 2018; a year
moves in each January), and so are the songs. The LOC's "courtesy of Sony Music Entertainment or EMI Music" note is
about the Jukebox's original licence, not a copyright. `get` refuses anything recorded in 1926 or later. A reissue label
can still file a YouTube Content ID claim: dispute it with the LOC link and recording date (kept in the credits).

Use: sung records never go under narration (cold-open air, chapter tails, the ending); instrumentals (bands,
fife-and-drum, banjo) can sit low under it. The old records master very quietly (-15 to -31 LUFS): normalise each to
about -16 LUFS before use. Listen before using any "Southern melodies" or minstrel-era record: many are sung in mock
dialect; leave those out.

loc.gov is behind Cloudflare and rate-limits: this keeps 6 s between requests and retries "Just a moment" pages.
Every download is recorded in public/music/credits.json.
"""
import json, os, re, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
CREDITS = os.environ.get("MUSIC_CREDITS") or os.path.join(HERE, "..", "public", "music", "credits.json")
CUTOFF = 1926   # first year NOT yet in the US public domain as of 2026; bump each January


def fetch(url, tries=5):
    for i in range(tries):
        r = subprocess.run(["curl", "-sS", "-L", "--http1.1", "--retry", "2", url], capture_output=True, text=True)
        try:
            return json.loads(r.stdout)
        except ValueError:
            time.sleep(8 + 6 * i)   # Cloudflare challenge page or a dropped transfer
    sys.exit(f"loc.gov kept refusing: {url}")


def search(q, n=12):
    d = fetch("https://www.loc.gov/audio/?" + f"q={q.replace(' ', '+')}&fa=partof:national+jukebox&c={n}&fo=json")
    for r in d.get("results", [])[:n]:
        rid = r.get("id", "").rstrip("/").split("/")[-1]
        who = ", ".join((r.get("contributor") or [])[:4]) if isinstance(r.get("contributor"), list) else ""
        print(f"{rid:22} {r.get('date', ''):10} {str(r.get('title'))[:55]:55} {who[:70]}")


def get(rid, out):
    d = fetch(f"https://www.loc.gov/item/{rid}/?fo=json")
    it = d.get("item", {})
    year = int(str(it.get("date", "9999"))[:4] or 9999)
    if year >= CUTOFF:
        sys.exit(f"SKIP {rid}: recorded {year}, not yet public domain in the US")
    mp3 = None
    for r in d.get("resources", []):
        if str(r.get("audio", "")).endswith(".mp3"):   # the streaming MP3 (what the LOC player plays)
            mp3 = mp3 or r["audio"]
        for fs in r.get("files", []):
            for f in fs if isinstance(fs, list) else [fs]:
                for k in ("download", "url"):
                    if isinstance(f, dict) and str(f.get(k, "")).endswith(".mp3"):
                        mp3 = mp3 or f[k]
    if not mp3:
        sys.exit(f"no mp3 on {rid}")
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    for i in range(5):   # big files sometimes stop early: resume
        if subprocess.run(["curl", "-sS", "-L", "--http1.1", "-C", "-", "-o", out, mp3]).returncode == 0:
            break
        time.sleep(6)
    credits = json.load(open(CREDITS)) if os.path.exists(CREDITS) else {}
    credits[os.path.basename(out)] = {
        "title": it.get("title"), "date": it.get("date"), "performers": it.get("contributor_names") or it.get("contributors"),
        "source": f"https://www.loc.gov/item/{rid}/", "rights": f"US public domain (sound recording published {year}, before {CUTOFF})",
        "credit": f"{it.get('title')} ({year}), Library of Congress National Jukebox"}
    json.dump(credits, open(CREDITS, "w"), indent=1, ensure_ascii=False)
    print("got", out, "·", it.get("title"), year)
    time.sleep(6)


if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "search":
        search(sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 12)
    elif len(sys.argv) == 4 and sys.argv[1] == "get":
        get(sys.argv[2], sys.argv[3])
    else:
        sys.exit(__doc__)
