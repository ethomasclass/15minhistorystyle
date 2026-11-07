"""Builds research/IMAGES.md: every archival image for Ep 1 by chapter, with credits, plus the gap -> fill plan.
   python3 research/build_images_md.py   (re-run after adding or removing images; credits come from public/img/credits.json)"""
import glob, json, os, re
from PIL import Image
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
C = json.load(open('public/img/credits.json'))
CH = {1: 'The bridge (cold open)', 2: 'The name: gilded vs gold, railroad time', 3: 'Inventions: steel, light, phone',
      4: 'Michael at the refinery', 5: 'Carnegie', 6: 'Rockefeller', 7: 'The trust comes to Brooklyn',
      8: 'Captains or barons?', 9: 'Gold or gilt (the wire fraud) + Ep 2 hand-off'}
# beat -> how it gets filled, for every beat the archives could not cover. 🆕 = round 2 Flow prop (FLOW_AGENT_EXTRAS.txt)
GAPS = {
 1: ['Steel wire close-up → `p01_wire_coil`', 'Bridge at night, no fireworks (closing image) → drawn silhouette scene',
     'Working people in the opening-day crowd → rig figures over the Harper\'s engraving'],
 2: ['1880s station clock, "noon twice" → `p02_station_clock` (two copies, two times)'],
 3: ['Clean carbon-filament bulb → `p03_edison_bulb` / `_lit` (the Wellcome plate and patent drawing back it up)',
     'Edison meter → `p03_electric_meter` (check the Latimer Fig. 25 caption before using that drawing as "Edison\'s meter")',
     'Bell telephone close-up → `p03_telephone_1876`', 'Steel rail, $170 → $17 → `p03_steel_rail`',
     'Pre-1900 steel frame → drawn x-ray of the 1885 Home Insurance Building (top floors: Bessemer steel from Carnegie-Phipps)'],
 4: ['Raw sugar arriving by ship → 🆕 `p04_sugar_hogshead` + `p04_raw_sugar_sack`',
     'Refinery interior, bone-char filters → the refinery animation + `p04_bone_char`',
     '1880s exterior → the 1916 Kent Ave photo plate, with "1916" on screen'],
 5: ['Carnegie\'s 1868 note → `p05_note_1868`, labelled "a re-creation"',
     'Telegraph sounder (reading by ear) → 🆕 `p05_telegraph_sounder` beside the key engraving',
     'Bobbin boy, messenger boy → rig animation (the weaver\'s-son scene)', 'Connellsville coke ovens → drawn, plus `p05_coke`',
     'Carnegie in the 1860s → nothing dated; use the c.1851 photo with Tom, then c.1878'],
 6: ['Devil Bill\'s medicine → `p06_medicine_bottle`; the second wife → drawn calling cards',
     'Turkeys and the $50 loan → `p06_turkey`, `p06_coins_stack`',
     'Ledger A → `p06_red_notebook` ("a notebook like his"; the real one has no free image) + 🆕 `p06_clerk_desk`',
     '39 drops → `p06_kerosene_can`, `p06_solder_lid` + 🆕 `p06_kerosene_case`',
     'The rebate → 🆕 `p06_freight_waybill` + `p06_rebate_envelope`, over the Tarbell tank-car photos',
     'The trust → the real 1882 certificate (so `p06_trust_certificate` is now optional)'],
 7: ['Havemeyer portrait → **still a gap.** LOC\'s copy is rights-restricted; Commons has only a 296 px photo and a bookplate (not him). '
     'Use the 1895 *Puck* "Grandma" cartoon (date on screen). Worth a hand check: *Notable New Yorkers of 1896-1899* (IA `notablenewyorker00king`).',
     'The lamp → `p07_kerosene_lamp` / `_lit` (the Dietz catalogue lamps are the reference)', 'The Kellys at dinner → drawn scene'],
 8: ['"No minimum wage, no weekend" → 🆕 `p08_factory_notice` (words added in the edit)',
     '"More land than California" → animated California outline dropped on the 1878 land-grant map'],
 9: ['Cable cross-section → `p09_cable_section` + the x-ray animation (19 strands, 5,434 wires: check against RESEARCH.md first)',
     'Wire test → 🆕 `p09_wire_tester`; the switch → 🆕 `p09_wire_wagon`, `p09_inspection_certificate`, drawn detour map',
     'The pile that never grew → `p09_rejected_wire_pile` + a tally that never changes',
     'J. Lloyd Haigh → no image (fine: the script does not name him); the 1877 contract page is the one real document'],
}
FLAGS = ['**Date labels needed** (images from after the story): Times Building 1904, Hine 1910, sugar stereographs c.1912, Mesabi 1905, '
         'the 1916 refinery plate, the 1895 *Puck* cartoons, the 1909 sugar trademark.',
         '**Credit line needed:** the two Wellcome plates (`ch03/*_wellcome.jpg`) are CC BY 4.0: "Wellcome Collection".',
         '**Mask the year** on the novel\'s title page: it reads 1874, but the book came out in December 1873.',
         '**Check the caption** on the 1883 Harper\'s cover inset before calling it Washington Roebling.',
         '**Small files** (under 1000 px on the long side) are marked ▫ below: fine as insets or desk props, not full frame.']
out = ['# Episode 1 archival images', '',
       f'{len(C)} public-domain images in `public/img/ch01` to `ch09`, all with credits in `public/img/credits.json`. '
       'Contact sheets: `research/sheets/chNN.jpg`. The search notes, beat by beat, are in `images_A.md` (ch1, 2, 9), '
       '`images_B.md` (ch3 to 5) and `images_C.md` (ch6 to 8). Generated props are in `script/FLOW_PROMPT.md`.', '',
       '## Watch for', ''] + [f'- {f}' for f in FLAGS] + ['']
for ch in range(1, 10):
    fs = sorted(glob.glob(f'public/img/ch0{ch}/*'))
    out += [f'## Chapter {ch}: {CH[ch]} ({len(fs)})', '', '| file | size | date | what it is | licence |', '|---|---|---|---|---|']
    for f in fs:
        k = os.path.relpath(f, 'public/img'); m = C.get(k, {}); w, h = Image.open(f).size
        title = m.get('title', '').replace('File:', '').replace('|', '/')
        title = (title[:90] + '…') if len(title) > 90 else title
        page = m.get('page', '')
        out.append(f"| {'▫ ' if max(w, h) < 1000 else ''}`{os.path.basename(f)}` | {w}×{h} | {re.sub(r'date QS.*|-01-01.*', '', m.get('date', ''))[:16]} | "
                   f"{f'[{title}]({page})' if page else title} | {m.get('licence', '?')[:28]} |")
    out += ['', '**Gaps and how they get filled:**', ''] + [f'- {g}' for g in GAPS[ch]] + ['']
open('research/IMAGES.md', 'w').write('\n'.join(out))
print('IMAGES.md:', len(C), 'images')
