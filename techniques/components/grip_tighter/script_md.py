"""Rebuild script/SCRIPT.md from the chapter files, keeping everything from "## Production notes" on.

  python3 tools/script_md.py                 # keep the existing notes
  python3 tools/script_md.py notes.md        # replace the notes with this file

Timings: ~185 wpm at the locked pace, ~165 wpm for HEAVY chapters, +25 s intro/title after ch01, +10 s logo breaks.
Re-time from tools/render.sh once the narration is voiced.
"""
import glob, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, "..", "script")
OUT = os.path.join(SCRIPT, "SCRIPT.md")
TITLES = {1: "The Proclamation", 2: "Supposed to Die", 3: "Fifty Pounds a Day", 4: "Sold South", 5: "The Pyramid",
          6: "Sunup to Sundown", 7: "No Law Above Him", 8: "A World Outside Work", 9: "Southampton", 10: "Grip Tighter"}
HEAVY = {7, 9, 10}

HEAD = """# Grip Tighter: Slavery and the Cotton South

**15 Minute History** · narration script · {words:,} words · about {length}

**Driving question (asked in the cold open, answered in the last chapter):** Why did the South, at the very moment it could have started letting slavery go, hold on tighter than ever?
**Answer:** cotton. The gin turned a system many expected to fade into the engine of America's most valuable export, so enslaved people became the South's biggest store of wealth. Slavery also propped up the status of white Southerners who owned no one. When Nat Turner showed the system could be fought, the South chose to tighten its grip instead of loosening it.

Chapter files are `script/chNN_slug.txt`; this page is rebuilt from them (`python3 tools/script_md.py`). `{{braces}}` mark a defined vocab term and `*stars*` a key idea; the voice tool strips both.
Timestamps come from the voiced narration (ElevenLabs v3 at this video's A/B-tested pace, ~168 wpm; chapters 7, 9 and 10 slower, `HEAVY="07 09 10"`), plus ~35 seconds for the channel intro, title card and logo breaks. Final times come from `tools/render.sh`.

---

"""

def words(s):
    return len(re.sub(r"[{}*]", "", s).split())

files = sorted(glob.glob(os.path.join(SCRIPT, "ch*.txt")))
t, body = 0.0, []
for f in files:
    n = int(os.path.basename(f)[2:4])
    text = open(f).read().strip()
    body.append(f"## {int(t // 60)}:{int(t % 60):02d} | {TITLES.get(n, f'Chapter {n}')}\n\n{text}\n")
    wav = os.path.join(HERE, "..", "public", "audio", os.path.basename(f)[:-4] + ".wav")
    if os.path.exists(wav):                       # voiced: use the real length
        import wave
        with wave.open(wav) as w:
            t += w.getnframes() / w.getframerate()
    else:
        t += words(text) / (165 if n in HEAVY else 185) * 60
    if n == 1:
        t += 25
t += 10
total = sum(words(open(f).read()) for f in files)
if len(sys.argv) > 1:
    notes = open(sys.argv[1]).read()
else:
    old = open(OUT).read()
    notes = old[old.index("## Production notes"):]
open(OUT, "w").write(HEAD.format(words=total, length=f"{int(t // 60)}:{int(t % 60):02d}") + "\n---\n\n".join(body) + "\n---\n\n" + notes.strip() + "\n")
print(f"{total} words, about {int(t // 60)}:{int(t % 60):02d}")
