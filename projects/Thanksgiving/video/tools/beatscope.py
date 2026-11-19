"""Flag t.at() beats that fall outside their scene's [cut, next cut) window (The Balloon War v2, Nov 2026). The usual cause is a
repeated word: t.at('word') takes the FIRST occurrence, so a beat meant for the third "paper" lands in an earlier scene and never
shows (anchors.py passes it, since the word exists). It caught two real bugs in that video. Run it on every chapter after wiring.

   python3 tools/beatscope.py src/ch/Ch03.tsx public/audio/ch03_slug.words.json

It reads the chapter's cuts (`key: at('phrase'[, n]) - 1`), maps each scene component to its cut through `a={c.key}`, and checks
every t.at() inside that component against [cut - 2, next cut + 15) frames. Fix a flag with nth (t.at('paper', 3)) or a longer phrase.
"""
import json, re, sys
src_path, words_path = sys.argv[1], sys.argv[2]
src = open(src_path).read()
W = json.load(open(words_path)); W = W['words'] if isinstance(W, dict) else W
norm = lambda s: re.sub(r"[^a-z0-9']", '', s.lower().replace('’', "'"))
toks = [norm(w['w']) for w in W]
def at(phrase, nth=1):
    p = [norm(x) for x in phrase.split()]
    c = 0
    for i in range(len(toks) - len(p) + 1):
        if toks[i:i + len(p)] == p:
            c += 1
            if c == nth: return round(W[i]['s'] * 30)
    return None
# cut keys: key: at('phrase'[, n]) - 1
cuts = {}
for m in re.finditer(r"(\w+):\s*at\(\s*(['\"])(.+?)\2\s*(?:,\s*(\d+))?\)\s*-\s*1", src):
    cuts[m.group(1)] = at(m.group(3), int(m.group(4) or 1))
order = sorted((v, k) for k, v in cuts.items() if v is not None)
nxt = {k: (order[i + 1][0] if i + 1 < len(order) else 10**9) for i, (v, k) in enumerate(order)}
# component -> cut key via usage  <Name ... a={c.key}
use = {}
for m in re.finditer(r"<(\w+)[^>]*?\ba=\{c\.(\w+)\}", src):
    use.setdefault(m.group(1), m.group(2))
# component bodies
comps = [(m.group(1), m.start()) for m in re.finditer(r"\nconst (\w+): React\.FC", src)]
comps.append(('__end', len(src)))
bad = 0
for (name, s0), (_, s1) in zip(comps, comps[1:]):
    key = use.get(name)
    if not key or key not in cuts: continue
    a, b = cuts[key], nxt[key]
    for m in re.finditer(r"t\.at\(\s*(['\"])(.+?)\1\s*(?:,\s*(\d+))?\)", src[s0:s1]):
        f = at(m.group(2), int(m.group(3) or 1))
        if f is None: print(f'  MISSING {name}: {m.group(0)}'); bad += 1; continue
        if f < a - 2 or f >= b + 15:
            print(f'  {name} (cut {a/30:.1f}s-{b/30 if b<10**8 else 0:.1f}s): {m.group(0)} -> {f/30:.1f}s'); bad += 1
print(src_path.split('/')[-1], 'flags:', bad, '| scenes mapped:', len(use))
