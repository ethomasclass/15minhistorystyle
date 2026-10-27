"""Ep 2 AI lithograph props and plates (Gemini 2.5 Flash Image), the Ep 1 recipe: LITHO_PROMPT.md STYLE + RULES, with a prop-sheet
paragraph for cut-outs (on plain white, masked later) or the composition paragraph for 16:9 plates.

  python3 tools/props.py [name ...]      # all missing ones, or just the named ones (re-makes them)

Writes review/ai_props/<name>.png and review/ai_props/PROMPTS.md (the exact prompt per image). About 4 cents an image.
"""
import base64, json, os, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "review", "ai_props")
for line in open(os.path.join(HERE, "..", ".env")):
    if "=" in line and not line.startswith("#"):
        k, v = line.strip().split("=", 1)
        os.environ.setdefault(k, v)
KEY = os.environ["GEMINI_API_KEY"]

STYLE = ("STYLE: a tinted lithograph printed in the 1870s, like the plates in the Pacific Railroad Survey reports or a Harper's Weekly supplement. "
         "Soft crayon-grain shading drawn on stone in black, plus a limited palette of two or three muted tint stones only: pale buff ochre, slate blue-grey and a faded brick red, "
         "laid in flat areas and slightly out of register with the black. The paper shows through as the highlights. Muted, faded, low saturation; never bright; no modern colour grading.")
SHEET = "PROP SHEET: the object alone, whole, centred with a wide margin, isolated on a plain flat pure white background, no ground, no cast shadow, no other objects."
COMP = ("COMPOSITION: casual and asymmetric, as if drawn from life. Things at different distances and sizes, overlapping, some partly cut off by the edge of the picture; "
        "never a neat row of identical things.")
RULES_PROP = ("RULES: historically accurate for the 1870s American West; nothing modern. No text, letters, numbers, signatures or monograms anywhere "
              "(any lettering is replaced by illegible engraved flourishes). No frame, border or vignette. No people.")
RULES_PLATE = ("RULES: historically accurate for the year and place; nothing modern. No text, letters, numbers, signatures or monograms anywhere. "
               "No frame, border, margin, vignette or rounded corners: the picture runs edge to edge across the whole 16:9 image. "
               "No recognizable real person; any figures small, far away or with faces turned away.")

# name: (chapter use, subject sentence, 'prop' | 'plate')
JOBS = {
    "p1_letter": ("ch01 the owner's letter", "A folded sheet of plain blank writing paper lying half out of a plain paper envelope, both completely blank with no writing, no marks and no seal, seen from slightly above.", "prop"),
    "p2_longhorn": ("ch02 the coral subject; ch03 walks the trails", "A single lean Texas longhorn steer standing in side view, very long wide horns, mottled hide, head slightly turned toward us.", "prop"),
    "p2_coin_one": ("ch02 $4 in Texas", "A single gold coin worn completely smooth, lying flat, seen from straight above: a plain golden disc with a raised rim and only a faint worn eagle shape in the middle, no letters, no numbers, no date.", "prop"),
    "p2_coin_stack": ("ch02 $40 up north; ch07 wages", "A neat stack of ten worn 1860s American gold coins, seen from a low three-quarter view; any lettering worn away to illegible marks.", "prop"),
    "p2_stock_car": ("ch02 the railhead", "An 1860s wooden slatted railroad stock car for cattle, in side view, on a short piece of track, small iron wheels, no lettering.", "prop"),
    "p3_saddle": ("ch03 the crew", "A well-worn western stock saddle with a high horn, wooden stirrups and a folded saddle blanket beneath it, three-quarter view.", "prop"),
    "p3_lariat": ("ch03 the crew; ch05 la reata", "A coiled braided rawhide lariat rope with its loop, lying loosely, seen from slightly above.", "prop"),
    "p3_branding_iron": ("ch03 the crew", "A cattle branding iron lying diagonally: a long straight iron rod with a small loop handle at one end, and at the other end the brand itself, a flat iron shape of a single straight bar under a half circle, like a rocker, standing at a right angle to the rod. Plain dark forged iron.", "prop"),
    "p4_chuck_wagon": ("ch04 Goodnight's chuck wagon", "An 1860s chuck wagon in three-quarter rear view: a canvas-covered freight wagon with a wooden chuck box built onto the back, its hinged lid folded down on a leg into a work table, small drawers and cubbyholes inside, a coffee pot and a water barrel strapped to the side.", "prop"),
    "p5_chaps": ("ch05 chaparreras", "A pair of worn leather cowboy chaps hanging from a peg, with a belt and fringe.", "prop"),
    "p5_spurs": ("ch05 the vaquero's gear", "A pair of iron spurs with large star-shaped rowels and leather straps, lying side by side.", "prop"),
    "p5_sombrero": ("ch05 vaqueros", "A wide-brimmed felt sombrero of a Mexican vaquero of the 1870s, with a tall crown and a simple braided band, three-quarter view.", "prop"),
    "p5_corral": ("ch05 rodeo", "A short section of a rough corral fence made of weathered grey unpainted split wooden rails stacked between crooked grey posts, with a plain wooden gate, three-quarter view. Natural weathered wood only, no paint, no stripes.", "prop"),
    "p5_bronco": ("ch05 bronco", "A wild bronco bucking hard: its head down between its front legs, back arched high, both hind legs kicked up and out behind it, front hooves planted, mane and tail flying. No rider, no saddle, no bridle. Side view.", "prop"),
    "p6_gold_pan": ("ch06 1874 gold", "A shallow iron miner's gold pan holding wet gravel with a few bright flakes of gold, tilted toward us.", "prop"),
    "p6_pick_shovel": ("ch06 the rush", "A miner's pickaxe and a long-handled shovel crossed against each other, worn wooden handles.", "prop"),
    "p6_nugget": ("ch06 hero shot", "A single rough gold nugget with quartz attached, close-up, three-quarter view.", "prop"),
    "p7_sluice": ("ch07 step one (placer)", "A short wooden sluice box on trestle legs with water running through it and riffles across the bottom, three-quarter view.", "prop"),
    "p7_headframe": ("ch07 step two (hard rock)", "A tall timber headframe over a mine shaft, with a pulley wheel at the top, a rope and an iron ore bucket hanging below, three-quarter view.", "prop"),
    "p7_stamp_mill": ("ch07 step three (the company)", "A five-stamp mill battery: a heavy timber frame holding five tall iron stamps above a mortar box, a camshaft and a drive belt wheel, three-quarter view.", "prop"),
    "p7_ore_cart": ("ch07 wages underground", "A small iron ore cart on a short piece of narrow mine track, heaped with broken rock.", "prop"),
    "p8_wire_spool": ("ch08 the wire", "A wooden spool wound thick with barbed wire, the loose end trailing off, three-quarter view.", "prop"),
    "p8_barb": ("ch08 hero shot (cheap as dirt)", "An extreme close-up of a single barb of 1870s barbed wire: two twisted iron strands with one short sharp two-pointed barb coiled around them, the strands running off left and right.", "prop"),
    "p8_fence": ("ch08 the fence", "Three short cedar fence posts in a row with four strands of barbed wire stretched between them, three-quarter view.", "prop"),
    "p8_nippers": ("ch08 fence cutters", "A pair of heavy iron fence-cutting nippers with long handles, slightly open.", "prop"),
    "p9_post_drift": ("ch09 quiet", "A single weathered wooden fence post standing in a compact, smooth, rounded drift of white snow piled against one side of it by the wind, a short strand of wire running from the post into the snow; the drift is one simple solid mound with a clean outline.", "prop"),
    "p9_hay_rake": ("ch09 hay for winter", "An 1880s horse-drawn hay rake with two tall iron wheels and a row of curved steel tines, no horse, three-quarter view.", "prop"),
    "p9_haystack": ("ch09 hay for winter", "A large rounded haystack with a crude pole fence around it, three-quarter view.", "prop"),
    # 16:9 plates (scenery, a cut-out's background)
    "L2_cowtown": ("ch02/03 the cow town", "1870s Kansas cow town at the railhead, seen from a slight rise: a wide dusty street of false-front wooden buildings, long plank cattle pens and a loading chute beside the railroad track, a stock train waiting, a herd of longhorns milling in the pens, tiny riders, a huge pale sky.", "plate"),
    "L3_river_crossing": ("ch03 three dangers", "1870s, a herd of longhorn cattle swimming across a wide muddy river on a cattle drive, only heads and horns above the brown water, two riders on horseback far off, low riverbanks, a big sky.", "plate"),
    "L8_fenced_range": ("ch08 the barb's background", "1880s, open rolling grassland of the Texas Panhandle cut by a long straight barbed-wire fence running off to the horizon, a windmill far away, a few cattle on one side, nothing on the other.", "plate"),
    "L9_blizzard": ("ch09 the winter", "January 1887, the northern plains of Montana in a blizzard: blowing snow, drifts against a fence line, a few dark shapes of cattle huddled far away with their backs to the wind, a low grey sky. Bleak, still, almost monochrome.", "plate"),
}


# white things (snow) are drawn on black instead, so the mask can find their edge (tools/mask_white.py --bg black)
ON_BLACK = {"p9_post_drift"}


def prompt(name):
    _, subject, kind = JOBS[name]
    sheet = SHEET.replace("plain flat pure white background", "plain flat pure black background") if name in ON_BLACK else SHEET
    return " ".join([subject, STYLE, sheet, RULES_PROP] if kind == "prop" else [subject, STYLE, COMP, RULES_PLATE])


def make(name):
    kind = JOBS[name][2]
    body = {"contents": [{"parts": [{"text": prompt(name)}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "1:1" if kind == "prop" else "16:9"}}}
    req = urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
                                 data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "X-goog-api-key": KEY})
    for attempt in range(3):
        try:
            d = json.load(urllib.request.urlopen(req, timeout=300))
            img = [x for x in d["candidates"][0]["content"]["parts"] if "inlineData" in x][0]["inlineData"]
            open(os.path.join(OUT, name + ".png"), "wb").write(base64.b64decode(img["data"]))
            print(name, "ok", flush=True)
            return
        except Exception as e:
            print(name, "try", attempt + 1, "ERR", repr(e)[:200], flush=True)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    names = sys.argv[1:] or [n for n in JOBS if not os.path.exists(os.path.join(OUT, n + ".png"))]
    for n in names:
        make(n)
    with open(os.path.join(OUT, "PROMPTS.md"), "w") as f:
        f.write("# Ep 2 AI lithograph props and plates\n\nGemini 2.5 Flash Image; `tools/props.py`. Never tagged on screen; recorded in the credits file.\n\n")
        for n, (use, _, kind) in JOBS.items():
            f.write(f"### `{n}` ({kind}) · {use}\n\n```\n{prompt(n)}\n```\n\n")
