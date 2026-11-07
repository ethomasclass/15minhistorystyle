"""Rebuild SCRIPT.md's chapter table and chapter texts from the chNN_*.txt files (everything else in SCRIPT.md is kept)."""
import re, glob
NAMES = {'ch01': ('The Bridge (cold open)', 'Hook', 'Michael, all threads in one breath'), 'ch02': ('The Name', 'Act I · setup', 'the era'),
 'ch03': ('The Machines', 'Act I · setup', 'the inventors'), 'ch04': ('The Refinery', 'Act I · setup', 'Michael'),
 'ch05': ("The Weaver's Son", 'Act II · escalation + midpoint twist', 'Carnegie (and his mother)'),
 'ch06': ("The Con Man's Son", 'Act II → III · escalation', 'Rockefeller (and his mother)'),
 'ch07': ('The Trust Comes to Brooklyn', 'Act III · climax twist + plug', 'Michael and Ma'),
 'ch08': ('Leave It Alone', 'Act IV · fallout, both readings', 'the government, fans and critics'),
 'ch09': ('Gold or Gilt', 'Act IV · answer + loop closed', 'Michael, the bridge, all of them')}
count = lambda t: len(re.findall(r"[A-Za-z0-9][A-Za-z0-9'\-,.]*", re.sub(r'^(MICHAEL|MA):', '', re.sub(r'\[[^\]]*\]', '', t), flags=re.M)))
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
rows, t0 = [], 0.0
for f in sorted(glob.glob('ch*.txt')):
    t = open(f).read().strip(); n = count(t); rows.append((f[:4], n, t0, t)); t0 += n / 165 * 60 + (8 if f.startswith('ch01') else 2)
total, fin = sum(r[1] for r in rows), fmt(t0 + 20)
table = "| Starts | Chapter | Words | Arc | Whose chapter |\n|---|---|---|---|---|\n" + ''.join(
    f"| {fmt(st)} | {NAMES[k][0]} | {n} | {NAMES[k][1]} | {NAMES[k][2]} |\n" for k, n, st, _ in rows) + f"| | **Total** | **{total}** | | about {fin} finished |\n"
def show(t):  # character lines in bold so they stand out when reading
    return '\n\n'.join(re.sub(r'^(MICHAEL|MA):\s*', lambda m: f"**{'MICHAEL' if m.group(1) == 'MICHAEL' else 'MA'}:** ", p) for p in t.split('\n\n'))
body = ''.join(f"## {fmt(st)} | {NAMES[k][0]}\n\n{show(t)}\n\n---\n\n" for k, n, st, t in rows)
s = open('SCRIPT.md').read()
i, j = s.index('| Starts | Chapter |'), s.index('## The humor')
s = s[:i] + table + '\n---\n\n' + body + s[j:]
s = re.sub(r'narration script · \*\*[^\n]*?\*\* · about \*\*[^*]*\*\*( finished)?', f'narration script · **draft 3 ({total} words, with the Kellys\' lines; cut menu below)** · about **{fin}** finished', s, count=1)
s = re.sub(r'## Cut menu: from [0-9:]+ to 10:00', f'## Cut menu: from {fin} to 10:00', s)
open('SCRIPT.md', 'w').write(s); print(total, fin)
