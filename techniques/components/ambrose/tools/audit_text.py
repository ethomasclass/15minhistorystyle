"""How long does each big piece of text stay on screen? Flags titles, stamped words, definitions and
quotes that leave (scene cut or `out`) too soon to read.   python3 tools/audit_text.py [min_seconds]

Reads each chapter's source: the `cuts` list gives every scene's start, and each <Highlight>, <Stamp>,
<Def> or <Quote> inside a scene gives its appearance cue. Cues are resolved against the narration's word
timings, the same way the video does it.
"""
import glob, json, re, sys

FPS = 30
MIN = float(sys.argv[1]) if len(sys.argv) > 1 else 2.0
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())


def resolver(words_path):
    d = json.load(open(words_path))
    toks = [norm(w["w"]) for w in d["words"]]

    def idx(phrase, nth=1):
        p = [norm(x) for x in phrase.split()]
        c = 0
        for i in range(len(toks) - len(p) + 1):
            if toks[i:i + len(p)] == p:
                c += 1
                if c == nth:
                    return i
        raise KeyError(phrase)

    def ev(expr, consts):
        e = expr
        e = re.sub(r"t\.wordAt\(t\.idx\((['\"])(.+?)\1\)\s*\+\s*(\d+)\)", lambda m: str(round(d["words"][idx(m[2]) + int(m[3])]["s"] * FPS)), e)
        e = re.sub(r"(?:t\.)?at\((['\"])(.+?)\1(?:,\s*(\d+))?\)", lambda m: str(round(d["words"][idx(m[2], int(m[3] or 1))]["s"] * FPS)), e)
        for k, v in consts.items():
            e = re.sub(rf"\b{k}\b", str(v), e)
        return eval(e.replace("Math.max", "max").replace("Math.min", "min"), {"Infinity": 10 ** 9})
    return ev, round(d["duration"] * FPS)


def main():
    bad = 0
    for f in sorted(glob.glob("src/ch/Ch0*.tsx")):
        src = open(f).read()
        wp = re.search(r"from '\.\./\.\./public/audio/(.+?)'", src)[1]
        ev, frames = resolver("public/" + wp[len("public/"):] if wp.startswith("public/") else "public/audio/" + wp.split("/")[-1])
        consts = {"END": frames + 20, "INTRO_FRAMES": 132, "TITLE_FRAMES": 150, "CH01_FRAMES": 10 ** 9}
        cuts = [(ev(m[1], consts), m[2]) for m in re.finditer(r"\[\s*([^\[\]]+?),\s*<(?:Sequence[^>]*>)?<?(\w+) t=\{t\}", src)]
        cuts.sort()
        tail = re.search(r"_FRAMES = Math\.ceil\(N\.duration \* 30\) \+ (\d+)", src)
        last = frames + (int(tail[1]) if tail else 30)
        ends = {name: (cuts[i + 1][0] if i + 1 < len(cuts) else last) for i, (_, name) in enumerate(cuts)}
        starts = {name: s for s, name in cuts}
        for name, end in ends.items():
            m = re.search(rf"const {name}: React\.FC.*?\n(?=const |export )", src, re.S)
            if not m:
                continue
            body = m[0]
            local = dict(consts)
            for lm in re.finditer(r"const (\w+) = ((?:t\.)?at\([^;]+?\)(?:\s*[-+]\s*\d+)?);", body):
                try:
                    local[lm[1]] = ev(lm[2], local)
                except Exception:
                    pass
            for el in re.finditer(r"(?:\{g >= [^&]+&& (?:g < ([^&]+?) && )?)?<(Highlight|Stamp|Def|Quote)\b([^>]*?)(?:/>|>)", body, re.S):
                attrs = el[3]
                kind = el[2]
                text = (re.search(r"text=\"(.+?)\"", attrs) or re.search(r"term=\"(.+?)\"", attrs) or [None, kind])[1]
                if kind == "Quote":
                    at_expr = "t.at(" + re.search(r"from=(\"[^\"]+\")", attrs)[1] + ")"
                else:
                    am = re.search(r"\bat=\{(.+?)\}(?=\s+\w+=|\s*$)", attrs, re.S)
                    if not am:
                        continue
                    at_expr = am[1]
                try:
                    a = ev(at_expr, local)
                    out = end
                    om = re.search(r"\bout=\{(.+?)\}", attrs)
                    if om:
                        out = min(out, ev(om[1], local))
                    if el[1]:
                        out = min(out, ev(el[1].strip(), local))
                except Exception as e:
                    print(f"  ? {f} {name} {text[:40]}: cue set in a loop, not checked ({e})")
                    continue
                secs = (out - max(a, starts[name])) / FPS
                flag = secs < MIN
                bad += flag
                if flag or "-v" in sys.argv:
                    print(f"{'SHORT' if flag else 'ok   '} {secs:5.1f}s  {f.split('/')[-1]:9} {name:12} {kind:9} {text[:48]}")
    print(f"{bad} item(s) on screen for less than {MIN}s")


if __name__ == "__main__":
    main()
