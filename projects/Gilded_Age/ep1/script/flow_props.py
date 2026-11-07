"""Builds FLOW_PROMPT.md: one copy-paste Google Flow prompt per cut-out prop for Gilded Age Ep 1.
   python3 flow_props.py   (edit PROPS below, re-run)"""
STYLE = ("STYLE: a high-resolution studio photograph of a real antique object, like a museum collection catalogue photo. "
         "Soft, even, shadowless light from above. Sharp focus from front to back, true-to-life materials and wear (scratches, patina, "
         "dents, faded paint, grain in wood, fibres in paper). Natural, slightly muted colours. Shot straight on or at a gentle three-quarter "
         "angle, the whole object in frame with a wide empty margin all around.")
BG = {'white': "BACKGROUND: isolated on a plain, flat, pure white background. No floor, no table, no cast shadow, no reflection, no other objects.",
      'black': "BACKGROUND: isolated on a plain, flat, pure black background. No floor, no table, no cast shadow, no reflection, no other objects."}
RULES = ("RULES: historically accurate for the stated year and place; nothing modern, no plastic, no modern screws, labels or barcodes. "
         "No text of any kind: no letters, words, numbers, dates, prices, brand names, signatures or monograms anywhere; any printing or "
         "engraving on paper or metal is shown as illegible decorative flourishes or left blank. No people, no hands. One object only "
         "(or the exact group described). Not a drawing, not a painting, not a 3D render.")
# id, chapter + beat, background, subject
PROPS = [
 # ch01 the bridge
 ('p01_wire_coil', 'ch01, ch09: "some of the steel wire holding them up"', 'white',
  'A tightly wound coil of thin galvanized steel wire from the 1870s, about the thickness of a pencil lead, grey and slightly dull with a few rust freckles, the coil bound in three places with twists of the same wire, one loose end sticking out.'),
 ('p01_penny', 'ch01: "a penny to walk across"', 'black',
  'A single worn copper one-cent coin of the 1880s, a small reddish-brown coin with a raised rim and a worn, indistinct profile head in a feathered headdress, all lettering and the date worn completely smooth. Seen from straight above, filling the middle of the frame.'),
 # ch02 the name
 ('p02_gilt_frame_corner', 'ch02: "a thin layer of gold... cheap metal underneath"', 'white',
  'The corner of an ornate 19th-century gilded picture frame, carved leaves and beads covered in thin gold leaf, the gold rubbed and flaking away in several places to show the dull grey plaster and brown wood underneath. Seen from the front at a slight angle.'),
 ('p02_green_necklace', 'ch02: "a gold necklace... turned your neck green"', 'white',
  'A cheap gold-plated chain necklace with a small plain locket, the gold coating worn through on the links and the locket edges so dull coppery-brown metal shows, with faint green tarnish in the worn spots. Laid in a loose curve, seen from straight above.'),
 ('p02_gold_bar_peeled', 'ch02, ch09: the series question card (gold or gilt)', 'white',
  'A small rectangular bar of dull grey base metal, like lead or tin, with a thin shiny gold coating that is peeling back in one corner like foil, curling up to show the grey metal beneath. Plain, no stamp, no markings. Three-quarter view.'),
 ('p02_gold_bar_solid', 'ch02, ch09: the series question card (the real gold)', 'white',
  'A small rectangular bar of solid gold, warm, deep yellow with soft rounded edges and a slightly hammered surface, plain with no stamp or markings. Three-quarter view, same size and angle as a matching bar.'),
 ('p02_railroad_watch', 'ch02: "the railroads switched the country to a handful of time zones"', 'white',
  'An 1880s American railroad pocket watch, open face, nickel-silver case worn smooth, a plain white enamel dial with black hands and simple tick marks (no numerals, no words), a stem winder crown and a short bow ring, lying flat with its short chain coiled beside it. Seen from straight above.'),
 ('p02_station_clock', 'ch02: "noon twice": the railroad clock', 'white',
  'An 1880s American railroad station wall clock, the "regulator" type: a tall carved oak case with a round glass-covered dial at the top and a long glass door below showing a brass pendulum. Plain white dial with black hands and simple tick marks only (no numerals, no words, no maker\'s name). Seen straight on.'),
 # ch03 the machines
 ('p03_iron_snapped', 'ch03: "Iron snaps."', 'white',
  'A short bar of 19th-century grey cast iron broken cleanly in two, the two pieces lying side by side with a small gap, the broken faces rough, sparkly and granular. Dark grey, slightly rusty. Seen from a gentle three-quarter angle.'),
 ('p03_steel_bent', 'ch03: "Steel bends."', 'white',
  'A short bar of 19th-century steel bent into a smooth U-shaped curve without cracking, blue-grey metal with a faint sheen and a little surface rust, the outside of the bend slightly stretched. Same size and angle as a broken iron bar beside it.'),
 ('p03_steel_rail', 'ch03, ch05: "Steel rails fell from more than 170 dollars a ton to about 17"', 'white',
  'A short cut length of an 1870s steel railroad rail, about two feet long, the classic T-rail profile (rounded head, thin web, wide flat foot) clearly visible at the cut end, dark grey steel with a bright worn strip along the top of the head and light rust on the sides. Three-quarter view showing the cut end.'),
 ('p03_edison_bulb', 'ch03: "a bulb that lasted"', 'black',
  'An early 1880s carbon-filament electric light bulb: a hand-blown clear glass bulb shaped like a pear with a pointed glass tip at the top, a thin dark horseshoe-loop carbon filament inside, and a plain brass screw base with a band of white plaster. Unlit. Upright, side view.'),
 ('p03_edison_bulb_lit', 'ch03: the bulb glowing (to cut between)', 'black',
  'The same early 1880s carbon-filament light bulb, pear-shaped hand-blown clear glass with a pointed tip, a brass screw base, its horseshoe filament glowing a soft warm orange-white and lighting the glass from inside. Upright, side view, on pure black.'),
 ('p03_electric_meter', 'ch03: "a meter to measure what you used"', 'white',
  'An 1880s electric meter of the early chemical type: a small dark wooden box with its hinged lid open, inside two small glass jars each holding a pair of thin zinc plates on wires, with a few brass terminals and copper connecting wires. Three-quarter view from slightly above.'),
 ('p03_telephone_1876', 'ch03: "the telephone"', 'white',
  'A replica-style 1876 experimental telephone: a small wooden base with an upright wooden frame holding a horizontal brass tube and a round iron diaphragm with a short brass mouthpiece, a small coil and wires, everything handmade, like an inventor\'s workbench device. Three-quarter view.'),
 ('p03_typewriter', 'ch03: "the typewriter"', 'white',
  'An 1870s American typewriter of the earliest kind: a tall black-painted cast-iron machine on a small table-like stand with four legs, decorated with painted gold-and-colour floral stencils, round white keys in four rows (blank key tops, no letters), a wide platen roller on top and typebars in a circle underneath. Three-quarter view.'),
 # ch04 the refinery
 ('p04_sugar_barrel', 'ch04: "about 5,000 barrels a day"', 'white',
  'An 1880s wooden sugar barrel: pale oak staves held by wooden hoops (not metal), the lid on, slightly stained and rough, no branding or stencilled letters. Three-quarter view, standing upright.'),
 ('p04_raw_sugar_sack', 'ch04: "raw brown sugar"', 'white',
  'A full, slumped burlap sack of raw cane sugar from the 1880s, rough woven jute, tied at the top with twine, a little sticky brown raw sugar spilled at its base. No stencilled letters. Three-quarter view.'),
 ('p04_sugar_two_bowls', 'ch04: "raw brown sugar into the white stuff in your kitchen"', 'black',
  'Two plain 19th-century white ironstone bowls side by side, the left one heaped with coarse, dark, damp-looking raw brown cane sugar, the right one heaped with fine sparkling white refined granulated sugar. Seen from a gentle three-quarter angle.'),
 ('p04_bone_char', 'ch04: "filtered through charcoal made from animal bones"', 'white',
  'An old iron scoop holding a heap of bone char: small irregular black granules and chips, matte and slightly glossy in places, with one or two recognisable pale fragments of charred bone. Three-quarter view from slightly above.'),
 ('p04_dinner_pail', 'ch04: Michael\'s ten-hour shift', 'white',
  'An 1880s American workman\'s tin dinner pail: a round dented tinplate pail with a wire bail handle and a wooden grip, a tight lid with a small cup on top, dull and scratched from use. Three-quarter view.'),
 # ch05 the weaver's son
 ('p05_shuttle', 'ch05: "wove fine linen by hand, one thread at a time"', 'white',
  'A 19th-century wooden hand-loom shuttle: a smooth, boat-shaped piece of dark polished boxwood with pointed metal-tipped ends, a long slot in the middle holding a wooden bobbin wound with fine pale linen thread, a loose thread trailing out. Seen from slightly above.'),
 ('p05_bobbin', 'ch05: "changing spools of thread in a cotton mill"', 'white',
  'A mid-19th-century wooden cotton-mill bobbin, a long turned wooden spool with wider ends, wound thickly with soft white cotton yarn, worn and slightly grubby from handling. Lying at a slight angle.'),
 ('p05_telegraph_key', 'ch05: "taught himself to read the telegraph\'s clicks by ear"', 'white',
  'An 1850s–1860s American telegraph key and sounder on one wooden base: a brass straight key with a black knob on a brass lever, and beside it a brass sounder with two upright electromagnet coils wrapped in green-brown silk thread and a pivoting brass bar above them, wires attached to brass binding posts. Three-quarter view.'),
 ('p05_stock_certificate', 'ch05: "a few shares of a company"', 'black',
  'An 1850s American stock certificate: a rectangular sheet of aged cream paper with an ornate engraved border of scrolls, an engraved vignette of a steam train at the top, and a round embossed seal in the lower left; all writing replaced by illegible engraved flourishes and blank lines. Flat, seen from straight above, slightly creased.'),
 ('p05_mortgage_deed', 'ch05: "his mother mortgaged the family\'s house"', 'black',
  'A folded 1850s legal document: a long sheet of aged cream paper folded in thirds and partly opened, covered in faded brown handwriting that is completely illegible, a small red wax seal and a short faded ribbon at the bottom. Seen from slightly above.'),
 ('p05_dividend_check', 'ch05: "a check came in the mail. Ten dollars."', 'black',
  'An 1850s American bank check: a small rectangular slip of cream paper with a delicate engraved border and a small engraved vignette of a ship, blank lines where the amount, date and name would be, and no readable writing anywhere. Flat, seen from straight above.'),
 ('p05_golden_egg', 'ch05: "the goose that lays the golden eggs"', 'white',
  'A single shining golden egg resting in a small nest of straw, the gold smooth and polished with a warm reflection. Simple and slightly storybook, but photographed like a real object.'),
 ('p05_iron_ore', 'ch05: "he bought the iron mines"', 'white',
  'A fist-sized lump of rich red-brown hematite iron ore, earthy and heavy-looking, with darker metallic grey patches and red dust on it. Three-quarter view.'),
 ('p05_coke', 'ch05: "the coal" (coke for the furnaces)', 'white',
  'A few lumps of metallurgical coke: grey-black, porous and spongy-looking with a dull silvery sheen, like the coke baked in 19th-century beehive ovens. Small heap, three-quarter view.'),
 ('p05_note_1868', 'ch05: "Carnegie wrote himself a private note" (an illustration, not the real note)', 'black',
  'A single sheet of 1860s hotel writing paper, aged cream, folded once and opened flat, covered in faded brown handwriting in ink that is completely illegible, a small blot of ink in one corner. Seen from straight above.'),
 # ch06 the con man's son
 ('p06_medicine_bottle', 'ch06: "bottles of homemade medicine that he said could cure almost anything"', 'white',
  'An 1850s American patent-medicine bottle: a small rectangular aqua-green glass bottle with bubbles in the glass, a cork stopper, half full of dark brown liquid, and a faded, torn paper label with decorative borders but no readable words. Three-quarter view.'),
 ('p06_turkey', 'ch06: "his turkey money"', 'white',
  'A live 19th-century American bronze turkey standing in side view, glossy dark bronze-brown feathers, red wattle, tail lowered (not fanned). Natural, farmyard bird.'),
 ('p06_coins_stack', 'ch06: "lent 50 dollars... got it back with interest"', 'white',
  'A small stack of worn 1850s American silver and gold coins with a few loose coins beside it, all lettering and dates worn to illegible marks. Low three-quarter view.'),
 ('p06_red_notebook', 'ch06: "a little red notebook" (an illustration, not the real Ledger A)', 'white',
  'A small, worn, red cloth-covered pocket account book from the 1850s, the cover rubbed pale at the corners and spine, lying slightly open to show lined pages filled with neat columns of faded brown ink figures that are completely illegible. Three-quarter view from slightly above.'),
 ('p06_dip_pen', 'ch06: bookkeeping', 'white',
  'A 19th-century wooden dip pen with a steel nib resting across a small square glass inkwell with a brass hinged lid, a drop of ink on the nib. Three-quarter view.'),
 ('p06_oil_barrel', 'ch06: "Then came oil."', 'white',
  'An 1860s wooden oil barrel of the 42-gallon kind, oak staves with iron hoops, dark oily stains running down from the bung hole on its side, no letters or brand. Three-quarter view, standing upright.'),
 ('p06_kerosene_can', 'ch06: "kerosene: lamp oil"', 'white',
  'An 1870s–1880s five-gallon square tinplate kerosene can with a small screw-cap spout in one top corner and a wire handle, dull silver tin with small dents and rust spots, no label, no letters. Three-quarter view.'),
 ('p06_solder_lid', 'ch06: "39 drops of solder... instead of 40"', 'white',
  'Close-up of the top of a square tin can from the 1870s, where the lid seam is sealed with a neat row of small round silvery drops of solder along the edge, each drop distinct and shiny. Seen from slightly above.'),
 ('p06_rebate_envelope', 'ch06: "the railroads secretly paid him money back"', 'black',
  'An 1870s plain cream paper envelope, slightly open, with a few banknotes and coins sliding out of it; the banknotes have ornate engraved borders but no readable words or numbers. Seen from slightly above.'),
 ('p06_trust_certificate', 'ch06: "he set up a trust"', 'black',
  'An 1880s American trust certificate: a large rectangular sheet of aged paper with an elaborate engraved border, an engraved vignette of oil refinery buildings and storage tanks at the top centre, and a red embossed seal; all writing replaced by illegible engraved flourishes and blank lines. Flat, seen from straight above.'),
 ('p06_gavel', 'ch06: buying out his rivals (optional)', 'white',
  'A 19th-century wooden auctioneer\'s gavel lying on its round wooden sound block, dark walnut, worn smooth. Three-quarter view.'),
 # ch07 the trust comes to Brooklyn
 ('p07_kerosene_lamp', 'ch07: "the family eats by the light of a kerosene lamp" (unlit)', 'white',
  'An 1880s American kerosene table lamp: a plain clear pressed-glass font on a simple glass foot, a brass burner with a small thumb-wheel, a flat cotton wick and a tall clear glass chimney, a little oil visible in the font. Unlit. Upright, side view.'),
 ('p07_kerosene_lamp_lit', 'ch07: the same lamp, lit', 'black',
  'The same 1880s kerosene table lamp, clear glass font, brass burner and tall clear glass chimney, lit, with a small steady warm flame inside the chimney glowing softly. Upright, side view, on pure black.'),
 ('p07_tin_plate', 'ch07: dinner at the Kellys\'', 'white',
  'A dented 1880s enamelware plate, chipped white enamel with a dark blue rim, holding a plain meal of boiled potatoes and a little cabbage, a worn steel fork beside it. Seen from slightly above.'),
 # ch08 leave it alone
 ('p08_land_deed', 'ch08: "The government gave railroads more land than all of California"', 'black',
  'A large 1870s American land grant document: a sheet of aged cream parchment with an engraved eagle at the top, an ornate border and a round embossed seal with a ribbon, partly rolled at one end; all writing replaced by illegible engraved flourishes. Seen from slightly above.'),
 ('p08_top_hat', 'ch08: the government figure (reference for the animation)', 'white',
  'A tall black silk top hat from the 1880s, slightly glossy, with a narrow curled brim and a plain black band. Three-quarter view.'),
 # ch09 gold or gilt
 ('p09_cable_section', 'ch09: "more than five thousand steel wires, bundled tight"', 'white',
  'A short cut section of a thick 19th-century suspension-bridge cable, seen at an angle so the cut end shows: hundreds of thin round steel wires packed tightly together in a perfect circle, wrapped on the outside with a layer of tightly wound wire, grey steel with a little rust. Industrial museum specimen.'),
 ('p09_inspection_certificate', 'ch09: "get a certificate"', 'black',
  'An 1870s inspection certificate: a small rectangular sheet of aged cream paper with a simple engraved border, a round embossed seal and a red wax stamp, blank lines and illegible faded handwriting, no readable words or numbers. Flat, seen from straight above.'),
 ('p09_rejected_wire_pile', 'ch09: "the pile of rejected wire... never got any bigger"', 'white',
  'A small heap of tangled, cut lengths and loose coils of 1870s steel wire, dull grey with rust spots, some bent and kinked, piled loosely. Three-quarter view.'),
]
def prompt(subject, bg):
    return f"Create one image, square format.\n\n{subject}\n\n{STYLE}\n\n{BG[bg]}\n\n{RULES}"
out = ["# Google Flow prompts: Episode 1 cut-out props", "",
 "Cut-out objects for the desk and for the animated scenes: photographed-looking period objects, cut out and shown in black and white",
 "(the subject of a beat can take the coral tint and teal trace). They fill moments with no archival photo; none is ever presented as",
 "a specific real artifact (the red notebook is \"a notebook like his\", not Ledger A).", "",
 "**How to run them**", "- One prompt per image. Each prompt below is complete: copy the whole block into Flow. If Flow offers a square (1:1) format, use it;",
 "  otherwise landscape is fine (I'll crop).",
 "- Make 4 takes of each and keep the best one (or two, if they're different and both good).",
 "- **Background:** most props are on white. Paper, glass and white things (certificates, the check, the bulb, the sugar bowls, the lit lamp)",
 "  are on **black**, because white-on-white cuts out ragged (the channel's rule since West Ep 2).",
 "- **Check for text.** Flow likes to write words on paper and labels. Reject any take with readable letters or numbers; I add all",
 "  numbers and words in the edit (the $10, the 39 drops, the prices).",
 "- **Naming:** save each as its id + `.png` (e.g. `p05_dividend_check.png`) and drop them in the chat or in `ep1/public/img/props_raw/`.",
 "  I cut them out (`prop_cut.py` / `mask_white.py --bg=black`) and check every edge at full size.", "",
 f"**{len(PROPS)} props.** Must-haves are marked ★.", "",
 "**The shared blocks** (already inside every prompt; here for reference):", "", "```", STYLE, "", BG['white'], "", RULES, "```", "",
 "| id | chapter and beat | background |", "|---|---|---|"]
MUST = {'p01_wire_coil','p02_gold_bar_peeled','p02_gold_bar_solid','p02_green_necklace','p03_iron_snapped','p03_steel_bent','p03_edison_bulb','p03_edison_bulb_lit','p04_sugar_two_bowls','p04_bone_char','p05_bobbin','p05_telegraph_key','p05_dividend_check','p05_mortgage_deed','p06_medicine_bottle','p06_red_notebook','p06_kerosene_can','p06_solder_lid','p07_kerosene_lamp','p07_kerosene_lamp_lit','p09_cable_section','p09_inspection_certificate'}
for pid, beat, bg, subj in PROPS: out.append(f"| {'★ ' if pid in MUST else ''}`{pid}` | {beat} | {bg} |")
out.append("")
cur = None
for pid, beat, bg, subj in PROPS:
    ch = pid[1:3]
    if ch != cur:
        cur = ch; out += ["", f"## Chapter {int(ch)}", ""]
    out += [f"### {'★ ' if pid in MUST else ''}{pid}", f"*{beat}*", "", "```", prompt(subj, bg), "```", ""]
open('FLOW_PROMPT.md', 'w').write('\n'.join(out) + '\n')
print(len(PROPS), 'props')
