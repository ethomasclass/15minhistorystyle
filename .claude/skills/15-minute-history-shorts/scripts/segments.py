"""Find shorts in a chapter's narration, and the exact seconds to cut them.

  python3 segments.py public/audio/ch03_knock_once.words.json
      every sentence with its start and end time, paragraph breaks marked with ¶

  python3 segments.py public/audio/ch03_knock_once.words.json "Take 1848" "toe joints."
      the clip from the first word of the first phrase to the last word of the second: the cut points to put in
      CLIPS (`from` / `to`, halfway into the pauses on either side), its length and word count

Pick runs of whole paragraphs that open on something concrete and end on a punchline. Aim for 35-70 s of
narration; the outro adds about 8 s. Matching ignores case and punctuation, like the scenes' t.at().
"""
import json, re, sys

norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())


def find(words, phrase, after=0):
    q = [norm(x) for x in phrase.split()]
    toks = [norm(w["w"]) for w in words]
    for i in range(after, len(toks) - len(q) + 1):
        if toks[i:i + len(q)] == q:
            return i, i + len(q) - 1
    sys.exit(f"no {phrase!r} in the narration")


def main():
    path, args = sys.argv[1], sys.argv[2:]
    d = json.load(open(path))
    w = d["words"]
    if not args:
        line, st = [], None
        for x in w:
            st = x["s"] if st is None else st
            line.append(x["w"])
            if x["w"][-1] in '.?!"”' or x.get("para_end"):
                print(f"{st:7.2f}-{x['e']:7.2f}  {' '.join(line)}{'  ¶' if x.get('para_end') else ''}")
                line, st = [], None
        print(f"duration {d['duration']:.2f}s, {len(w)} words")
        return
    a, _ = find(w, args[0])
    _, b = find(w, args[1], a)
    start = (w[a - 1]["e"] + w[a]["s"]) / 2 if a > 0 else max(0.0, w[a]["s"] - 0.3)
    end = (w[b]["e"] + w[b + 1]["s"]) / 2 if b + 1 < len(w) else min(d["duration"], w[b]["e"] + 0.3)
    print(f"from: {start:.2f}, to: {end:.2f}   ({end - start:.1f} s, {b - a + 1} words)")
    print("starts: " + " ".join(x["w"] for x in w[a:a + 10]) + " ...")
    print("ends:   ... " + " ".join(x["w"] for x in w[max(a, b - 9):b + 1]))
    if not w[b].get("para_end"):
        print("note: the clip doesn't end on a paragraph break; check it doesn't stop mid-thought")


if __name__ == "__main__":
    main()
