"""Check every cue phrase in a short against the short's combined narration (all its clips, in order).

  python3 check_anchors.py src/shorts/ShortFox.tsx            (run from the video project; reads public/audio/)

A short joins clips from different chapters plus the outro, so a phrase that was unique in its chapter can repeat
in the short (e.g. "King Andrew" in a chapter and again in the outro). t.at(phrase) takes the FIRST occurrence;
this lists every repeated phrase with all its occurrences and which one the code uses, and fails on missing ones.
It reads CLIPS (`{stem: '...', ..., from: 6.15, to: 55.75}`; `to: (x as Narration).duration` means the whole file)
and every at('...') / t.at('...', n) call plus the phrase lists fed to at(c) in .map((c) => ...).
"""
import json, os, re, sys

norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
src = sys.argv[1]
audio = sys.argv[2] if len(sys.argv) > 2 else "public/audio"
code = open(src).read()

clips = re.findall(r"\{stem:\s*'([^']+)'[^}]*?from:\s*([\d.]+),\s*to:\s*([^}]+?)\s*\}", code)
if not clips:
    sys.exit("no CLIPS found")
words, at = [], 0
for stem, a, b in clips:
    d = json.load(open(os.path.join(audio, stem + ".words.json")))
    a = float(a)
    b = d["duration"] if "duration" in b else float(b)
    ln = round((b - a) * 30)
    words += [(w["w"], w["s"] - a + at / 30) for w in d["words"] if w["s"] >= a and w["e"] <= b]
    at += ln + 6
toks = [norm(w) for w, _ in words]

found = {(p, int(n) if n else 1) for _, p, n in re.findall(r"\bat\(\s*(['\"])(.+?)\1\s*(?:,\s*(\d+))?\s*\)", code)}
for lst in re.findall(r"\[((?:\s*(?:'[^']*'|\"[^\"]*\")\s*,?)+)\]\.map\(\((?:c|p)\)", code):
    for q in re.findall(r"'([^']*)'|\"([^\"]*)\"", lst):
        found.add((q[0] or q[1], 1))

print(f"{src}: {len(clips)} clips, {len(words)} words, {at / 30:.1f} s of narration")
bad = 0
for p, want in sorted(found):
    q = [norm(x) for x in p.split()]
    hits = [i for i in range(len(toks) - len(q) + 1) if toks[i:i + len(q)] == q]
    if len(hits) < want:
        bad += 1
        print(f"  MISSING  {p!r} (occurrence {want})")
    elif len(hits) > 1:
        print(f"  repeats  {p!r} -> code uses #{want} at {words[hits[want - 1]][1]:.2f}s")
        for k, i in enumerate(hits, 1):
            print(f"      #{k} {words[i][1]:6.2f}s  ...{' '.join(w for w, _ in words[max(0, i - 4):i + len(q) + 4])}...")
print("all cue phrases found" if not bad else f"{bad} missing")
sys.exit(1 if bad else 0)
