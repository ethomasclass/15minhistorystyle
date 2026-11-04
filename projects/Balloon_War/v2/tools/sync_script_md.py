"""Refresh script/SCRIPT.md from the chapter files: each chapter's text and word count, the start times in the headings
and the chapter table, and the total words and runtime in the header. Everything else in SCRIPT.md is left alone.

  python3 tools/sync_script_md.py

Timing estimate: 165 words a minute with pauses (eleven_v4), plus the Chunk intro and the 1-second beat after the cold
open (9.7 s), a 2-second mark-snap break between chapters and a 20-second end screen.
"""
import glob, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, '..', 'script')
md_path = os.path.join(SCRIPT, 'SCRIPT.md')
md = open(md_path).read()

def words(txt):
    return len(re.sub(r'\[[a-z ]+\]', '', txt).split())

t, total, starts = 0.0, 0, {}
files = sorted(f for f in glob.glob(os.path.join(SCRIPT, 'ch[0-9][0-9]_*.txt')))
for i, f in enumerate(files):
    name = os.path.basename(f)
    txt = open(f).read().strip()
    w = words(txt)
    total += w
    ts = f"{int(t // 60)}:{int(t % 60):02d}"
    starts[name] = (ts, w)
    # the chapter's section: heading, file line, text, up to the next ---
    pat = re.compile(r"## [0-9:]+ \| ([^\n]*)\n\*`" + re.escape(name) + r"`\* · \d+ words( · [^\n]*)?\n\n.*?\n\n---\n", re.S)
    m = pat.search(md)
    if not m:
        raise SystemExit(f'no section for {name} in SCRIPT.md')
    md = md[:m.start()] + f"## {ts} | {m.group(1)}\n*`{name}`* · {w} words{m.group(2) or ''}\n\n{txt}\n\n---\n" + md[m.end():]
    t += w / 165 * 60 + (9.7 if i == 0 else 2)
fin = t + 20

# the chapter table rows: | 0:00 | Name | 156 | Arc |
names = re.findall(r"## ([0-9:]+) \| ([^\n]*)\n\*`(ch[^`]*)`\*", md)
for ts, title, name in names:
    md = re.sub(r"\| [0-9:]+ \| " + re.escape(title) + r" \| \d+ \|", f"| {ts} | {title} | {starts[name][1]} |", md, count=1)
md = re.sub(r"\*\*[\d,]+ words\*\* · about \*\*[0-9:]+ finished\*\*",
            f"**{total:,} words** · about **{int(fin // 60)}:{int(fin % 60):02d} finished**", md, count=1)
open(md_path, 'w').write(md)
print(f'{total} words, about {int(fin // 60)}:{int(fin % 60):02d} finished')
