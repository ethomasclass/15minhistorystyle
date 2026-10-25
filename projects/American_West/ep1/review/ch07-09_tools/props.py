import os, sys, json, base64, urllib.request
sys.path.insert(0, os.path.dirname(__file__))
from gem import call
OUT = '/home/user/15minhistorystyle/projects/American_West/ep1/review/ai_ch07-09'
STYLE = ("STYLE: a tinted lithograph printed in the 1860s, like the plates in the Pacific Railroad Survey reports or a Harper's "
 "Weekly supplement. Soft crayon-grain shading drawn on stone in black, plus a limited palette of two or three muted tint "
 "stones only: pale buff ochre, slate blue-grey and a faded brick red, laid in flat areas and slightly out of register "
 "with the black. The paper shows through as the highlights. Muted, faded, low saturation; never bright; no modern colour grading.")
PROP = ("PROP SHEET: the object alone, whole, centred with a wide margin, isolated on a plain flat pure white background, no ground, "
 "no cast shadow, no other objects.")
RULES = ("RULES: historically accurate for the 1870s United States; nothing modern. No text, letters, numbers, signatures or monograms "
 "anywhere (any lettering is replaced by illegible engraved flourishes). No frame, border or vignette. No people.")
JOBS = {
 'p7_stock_certificate': "A single 1860s American railroad company stock certificate lying flat, seen from straight above: an ornate engraved border, a small vignette of a steam locomotive at the top, a round seal, blank decorative panels.",
 'p7_coins_notes': "A small loose pile of 1870s American gold coins and a few folded generic banknotes with ornate engraved patterns, seen from slightly above.",
 'p7_whiskey_barrels': "Three oak whiskey barrels with iron hoops, two standing upright and one lying on its side in front, seen from a three-quarter view.",
 'p8_bank_doors': "The tall closed double front doors of an 1870s American bank, heavy dark panelled wood with brass handles and a carved stone doorframe, shut tight, seen straight on.",
 'p8_ballot_box': "An 1870s American ballot box: a wooden box with a glass globe top and a slot, a small brass lock, seen from a three-quarter view.",
}
for name in sys.argv[1:]:
    prompt = f"{JOBS[name]}\n\n{STYLE}\n\n{PROP}\n\n{RULES}"
    d = call("gemini-2.5-flash-image", [{"text": prompt}], {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "1:1"}})
    x = [p for p in d["candidates"][0]["content"]["parts"] if "inlineData" in p][0]["inlineData"]
    open(f"{OUT}/{name}.png", "wb").write(base64.b64decode(x["data"]))
    open(f"{OUT}/{name}.prompt.txt", "w").write(prompt)
    print(name, flush=True)
