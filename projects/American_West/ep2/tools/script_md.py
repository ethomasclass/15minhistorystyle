"""Rebuild script/SCRIPT.md's chapter table and chapter texts from script/chNN_*.txt (keeps the header and the fact-check pass).

  python3 tools/script_md.py

Estimates use Ep 1's measured pace (165 wpm; the slow chapters at 150) plus the intro, title card and 2 s breaks.
"""
import glob, os, re

HERE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "script")
TITLES = {
    "ch01": "The Last of the Five Thousand (cold open)", "ch02": "Four-Dollar Cows", "ch03": "The Long Drive",
    "ch04": "Beef for Bosque Redondo", "ch05": "Who the Cowboys Were", "ch06": "1874", "ch07": "Who Got the Gold (+ plug)",
    "ch08": "Cheap as Dirt", "ch09": "The Big Die-Up (slower: speed 0.92)", "ch10": "The Last of the Five Thousand (the answer)"}
SLOW = {"ch09"}
words = lambda s: len(re.sub(r"\[[^]]*\]", "", s).split())

t, rows, body, total = 0.0, [], [], 0
for f in sorted(glob.glob(os.path.join(HERE, "ch*.txt"))):
    k, name = os.path.basename(f)[:4], os.path.basename(f)
    txt = open(f).read().strip()
    w = words(txt); total += w
    secs = w / (150 if k in SLOW else 165) * 60
    m = f"{int(t // 60)}:{int(t % 60):02d}"
    rows.append(f"| {k[2:]} | {m} | {TITLES[k]} | {w} | {secs:.0f} s |")
    body.append(f"## {m} | {TITLES[k]}\n\n`{name}` · {w} words · about {secs:.0f} s\n\n{txt}\n")
    t += secs + (10.5 if k == "ch01" else 2.0)
fin = total / 2450 * 960  # Ep 1: 2,450 words -> 16:00 finished
table = ("| # | Starts | Chapter | Words | Est. |\n|---|---|---|---|---|\n" + "\n".join(rows) +
         f"\n\n**{total:,} words · about {int(fin // 60)}:{int(fin % 60):02d} finished** (scaled from Ep 1: 2,450 words → 16:00)\n")
p = os.path.join(HERE, "SCRIPT.md")
md = open(p).read()
head, rest = md.split("## Chapters at a glance", 1)
facts = rest[rest.index("## Fact-check pass"):]
head = re.sub(r"· [\d,]+ words · about [\d:]+ finished", f"· {total:,} words · about {int(fin // 60)}:{int(fin % 60):02d} finished", head)
open(p, "w").write(head + "## Chapters at a glance\n\n" + table + "\n---\n\n" + "\n---\n\n".join(body) + "\n---\n\n" + facts)
print(f"{total} words, about {int(fin // 60)}:{int(fin % 60):02d} finished")
