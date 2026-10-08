"""Generate the Gemini images listed in PROMPTS.md (the single source of truth) into public/img/gen/.

Reads each "### ... `name.png`" entry in PROMPTS.md Part 1, swaps in the shared Style and Composition
paragraphs, attaches the reference images (board_tex.png for anything with a board; hands_00_board.png
for the rest of the hands series once it exists), and saves <name>.png. With --masks it also runs each
entry's mask pass on the saved image and writes <name>_mask.png.

  python3 tools/gemini_image.py --list
  python3 tools/gemini_image.py hands_00_board               # one image
  python3 tools/gemini_image.py hands_00_board --masks       # image + its magenta mask
  python3 tools/gemini_image.py --all --masks                # everything not made yet

Needs GEMINI_API_KEY in the environment (or in video/.env).
"""
import base64, json, os, re, sys, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
PROMPTS = os.path.join(ROOT, "..", "PROMPTS.md")
OUT = os.path.join(ROOT, "public", "img", "gen")
BOARD = os.path.join(ROOT, "public", "img", "test", "board_tex.png")
MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3-pro-image")


def env():
    p = os.path.join(ROOT, ".env")
    if os.path.exists(p):
        for line in open(p):
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.split("#")[0].strip())


def quoted(block: str) -> str:
    return " ".join(l[1:].strip() for l in block.splitlines() if l.startswith(">"))


def parse():
    md = open(PROMPTS).read()
    part1 = md[md.index("# Part 1"):md.index("# Part 2")]
    style = quoted(part1.split("**Style**", 1)[1].split("\n\n", 2)[1])
    comp = quoted(part1.split("**Composition**", 1)[1].split("\n\n", 2)[1])
    hands_mask = quoted(part1.split("**Mask pass** (the same for every hands image)", 1)[1].split("\n\n", 2)[1])
    items = {}
    for sec in re.split(r"\n### ", part1)[1:]:
        m = re.search(r"`([a-z0-9_]+)\.png`", sec.splitlines()[0])
        if not m:
            continue
        name = m.group(1)
        body = "\n".join(l for l in sec.splitlines()[1:] if l.startswith(">") and "*(" not in l.split(">", 1)[1][:3])
        text = quoted(body).replace("*[Composition]*", comp).replace("*[Style]*", "").strip()
        text = f"{text}\n\n{style}"
        mask = None
        mm = re.search(r"\*\*Mask pass:\*\* fill (.+?)\.?\n", sec + "\n")
        if mm:
            mask = ("Return this exact same image, pixel-aligned, with no other change at all, except: fill "
                    f"{mm.group(1).rstrip('.')} completely with flat pure magenta (#FF00FF). Keep the fill tight to its outline. "
                    "Do not move, crop, recompose or redraw anything else.")
        elif "(Mask pass: yes.)" in sec:
            mask = hands_mask
        refs = []
        if "talking board" in sec.lower() or name.startswith(("hands_", "thumb")):
            refs.append(BOARD)
        if name.startswith("hands_") and name != "hands_00_board":
            refs.append(os.path.join(OUT, "hands_00_board.png"))
        items[name] = {"prompt": text, "mask": mask, "refs": refs}
    return items


def call(parts):
    body = {"contents": [{"parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
                                 data=json.dumps(body).encode(), method="POST",
                                 headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
    try:
        r = json.loads(urllib.request.urlopen(req, timeout=300).read())
    except urllib.error.HTTPError as e:
        sys.exit(f"Gemini {e.code}: {e.read().decode()[:500]}")
    for part in r["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            return base64.b64decode(part["inlineData"]["data"])
    sys.exit(f"no image returned: {json.dumps(r)[:400]}")


def img_part(path):
    return {"inlineData": {"mimeType": "image/png", "data": base64.b64encode(open(path, "rb").read()).decode()}}


def generate(name, item, masks):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name + ".png")
    if not os.path.exists(path):
        refs = [r for r in item["refs"] if os.path.exists(r)]
        parts = [img_part(r) for r in refs] + [{"text": ("Reference images are attached: use the talking board artwork exactly as shown. "
                                                         if refs else "") + item["prompt"]}]
        open(path, "wb").write(call(parts))
        print("wrote", path)
    mpath = os.path.join(OUT, name + "_mask.png")
    if masks and item["mask"] and not os.path.exists(mpath):
        open(mpath, "wb").write(call([img_part(path), {"text": item["mask"]}]))
        print("wrote", mpath)


if __name__ == "__main__":
    env()
    items = parse()
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if "--list" in sys.argv:
        for n, it in items.items():
            print(f"{n:28s} mask={'yes' if it['mask'] else 'no ':3s} refs={len(it['refs'])}")
        sys.exit()
    names = list(items) if "--all" in sys.argv else args
    for n in names:   # hands_00_board comes first in PROMPTS.md, so it exists before the rest need it
        generate(n, items[n], "--masks" in sys.argv)
