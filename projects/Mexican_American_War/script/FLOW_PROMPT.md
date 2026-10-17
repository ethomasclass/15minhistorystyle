# Google Flow prompt: The Exact Spot (all images, wood-engraving style)

Replaces the oil-painting style in `GEMINI_PROMPTS.md` with a period wood engraving (less "AI-looking", matches the real
engravings and lithographs of the war, masks cleanly). File names are the same as in `GEMINI_PROMPTS.md`.

## Master prompt (paste whole)

```
You are illustrating a history documentary about Texas and the Mexican-American War (1821–1848). Create 19 separate images, one per numbered scene below. Make each one its own image in 16:9 landscape format. Do not combine scenes, do not make a grid or collage, and do not number or caption the images.

STYLE FOR EVERY IMAGE (identical across all 19 so they look like one series):
A black-and-white wood engraving from an illustrated newspaper of the 1840s–1850s, such as the Illustrated London News. All shading made with fine parallel lines and cross-hatching. Crisp black ink on slightly yellowed paper, white highlights cut out of the block, slight ink spread and uneven printing. Bold, clean line work and high contrast. No color, no grey gradients, no airbrushing, no painterly texture, no photographic look. Figures drawn the way period engravers drew them: slightly stiff, clear silhouettes, simple uncluttered backgrounds. Light and mood are shown only through the density of lines (dense hatching for night and shadow, open paper for daylight).

RULES FOR EVERY IMAGE:
- Every detail historically accurate for the stated year and place: clothing, hairstyles, uniforms, weapons, ships, buildings, furniture, lamps and tools. Nothing modern.
- No text of any kind: no letters, words, captions, signatures, dates, numbers, labels or watermarks anywhere, including on flags, papers and maps.
- No frame, border or margin. Fill the whole 16:9 image.
- No recognizable real historical person. Where a scene involves a real person, show them from behind, at a distance or in shadow, face not visible. Faces that are visible belong to ordinary anonymous people.
- One clear main subject per image, easy to separate from the background.
- No gore, no blood, no dead bodies.

THE 19 SCENES:

1. ch02_settlers_arrive — Spring 1825, Mexican Texas near the Brazos River. A wagon road through open grassland and scattered live oaks. Two canvas-covered ox wagons of American settlers move west: a man in a broad-brimmed hat and hunting shirt walks beside the oxen; a woman in a sunbonnet sits on the wagon seat with a small child. Walking behind the second wagon, carrying bundles and tools, are four enslaved Black men and women in plain homespun clothing, drawn with dignity as individuals, tired and watchful, never caricatured. Bright open daylight. Quiet and matter-of-fact, not heroic.

2. ch02_tejano_ranch — 1825, a Tejano ranch outside San Antonio de Béxar. A low whitewashed adobe and stone house with a flat roof and projecting wooden roof beams, a brush-covered shade of mesquite poles, a corral of upright mesquite posts. A Tejano rancher in a short dark jacket, wide flat-crowned hat and leather leggings sits on a horse with a Mexican saddle; his wife in a long skirt and rebozo stands in the doorway; two children play beside a carreta (two-wheeled oxcart with solid wooden wheels). Late afternoon, long shadows, dry brush country, cottonwoods along a creek.

3. ch03_austin_jail — Winter 1834, a stone prison cell in Mexico City. Thick walls, one small barred window high up throwing a single shaft of light, a narrow cot with a wool blanket, a small table with a candle stub, inkwell and blank papers. A thin man in a worn frock coat sits on the cot with his back to the viewer, head bowed, face hidden. Lonely and still; mostly dark hatching with one bright shaft.

4. ch03_come_and_take_it — Early morning, October 2, 1835, the bank of the Guadalupe River at Gonzales, Texas. In the foreground about twenty Texian settlers in hunting shirts, frock coats and slouch hats, holding long rifles, stand around a small bronze cannon on crude wheels sawn from a tree trunk. Above them on a pole flies a plain white flag with a single black cannon and a single black five-pointed star, and absolutely no lettering. Across the river, through morning mist, a small line of Mexican dragoons in coatees and tall shakos sits on horseback. A tense, quiet standoff.

5. ch03_washington_on_the_brazos — A cold morning in early March 1836, inside an unfinished, unheated frame building at Washington-on-the-Brazos, Texas. Rough plank walls with gaps, cloth stretched across empty window frames. About forty men in frock coats, waistcoats and heavy cloaks crowd around a long plank table covered with papers, inkwells and quill pens, all seen from behind or in shadow; one man leans over to sign a long sheet of paper. Serious and crowded.

6. ch04_alamo_dawn — Before dawn, March 6, 1836, the old Spanish mission of the Alamo in San Antonio. The roofless limestone chapel with its scarred flat-topped façade (no curved top; that was added later) behind earth-and-timber walls and a long low barrack. Seen from a distance across open ground: columns of Mexican infantry with ladders and muskets advancing through the half-light toward the walls; smoke and flashes of musket fire along the walls. No close-up violence, no bodies. Dark, dense hatching; the moment before the end.

7. ch04_marsh_grass — The morning of April 22, 1836, marsh grass and a muddy bayou near the San Jacinto River, Texas. Three Texian soldiers in hunting shirts and slouch hats, rifles in hand, have just parted the tall reeds. Crouched in the grass in front of them, seen entirely from behind with his face turned away and hidden, is a man in a plain, ill-fitting Mexican private's jacket and white trousers. The Texians look surprised and suspicious. Misty morning.

8. ch05_rio_grande_camp — April 1846, the north bank of the Rio Grande. A U.S. Army camp: rows of canvas wall tents, stacked muskets, supply wagons; soldiers in fatigue jackets and forage caps digging a large earthen star-shaped fort. Across the river, on the far bank, the low flat-roofed houses and church tower of the Mexican town of Matamoros, with Mexican soldiers watching from an earthwork. Flat brush country, hot glaring daylight. Two armies a river apart.

9. ch05_ambush — April 25, 1846, Rancho de Carricitos, thick chaparral north of the Rio Grande. About sixty U.S. dragoons on horseback, crowded inside a ranch enclosure of tall mesquite-post fences, realize they are surrounded: Mexican lancers with tall lances and small pennants close in from the brush on all sides. Horses rearing, dust, confusion. No blood or bodies. Midday glare.

10. ch05_rider — Dusk, spring 1846, the American South. A lone express rider gallops along a dirt road across rolling country, coat and broad-brimmed hat pulled low so his face is in shadow, a leather dispatch bag strapped across his chest; the horse straining. Behind him a long empty road and a split-rail fence vanishing into the distance; the last light low on the horizon ahead. Distance and urgency.

11. ch06_blockade — A hot morning in August 1846, the Gulf of Mexico off Veracruz. In the foreground a British paddle-wheel mail steamer with a tall black funnel and two masts steams toward the low white city of Veracruz and the stone fortress of San Juan de Ulúa on the horizon. Close by, a U.S. Navy sailing frigate of the blockade squadron lies at anchor with gun ports open, sailors lining the rail, simply watching it pass. On the steamer's deck one gentleman in a frock coat and top hat stands at the rail with his back to the viewer, face hidden, looking toward shore. Calm sea, gulls, heat haze.

12. ch06_cork_leg — Afternoon, April 18, 1847, a rocky mountain road near Cerro Gordo, Mexico, just after a battle. An abandoned, elegant carriage with a broken wheel tilts at the roadside, door open. Three young American volunteer soldiers in wool jackets, white cross-belts and forage caps gather at the door; one holds up a 19th-century artificial leg of cork and wood with a laced leather socket and brass fittings, and the others laugh in disbelief. A roast chicken and a toppled bottle lie on the carriage seat. Scrubby hills, distant smoke. Comic, but not cartoonish.

13. ch06_flag_and_gallows — Early morning, September 13, 1847, a wide, distant view across a flat valley outside Mexico City. In the middle distance a row of army mule wagons stands beneath a long rough timber beam on posts; on the wagons stand a line of small, indistinct figures, too far away to see any faces, guarded by ranks of soldiers. Far off on the horizon, on a steep wooded hill, the stone castle of Chapultepec is wreathed in battle smoke. No hanging bodies, no violence shown, nothing close up. Cold, still, a sense of waiting and dread.

14. ch08_trist_letter — Late at night, December 1847, a room in a house in Mexico City. A man in a dark frock coat sits at a heavy wooden desk with his back to the viewer, writing with a quill by the light of two candles. Beside him a tall, untidy stack of handwritten pages, more pages fallen on the floor (no readable writing). Thick adobe walls, a tall shuttered window, a patterned tile floor. Dense hatching for the dark room, the candlelit desk left bright. Determined, a little absurd.

15. ch08_gold — A cold winter morning, January 1848, a millrace (a dug channel of running water) at a half-built sawmill in the Sierra foothills of California. Close view: a workman's rough, weathered hands rise out of the clear water, cupped, holding a few small flakes and pea-sized nuggets of gold that catch the light. Only hands and the cuffs of a wet wool shirt are visible. Behind, simplified, the timber frame of the mill and pine trees. The gold is the brightest thing in the picture.

16. ch09_sick_tents — Summer 1847, a U.S. Army field hospital in Mexico. A long row of canvas tents with sides rolled up; inside, young soldiers lie on cots and blankets, exhausted, some with damp cloths on their foreheads. An orderly carries a tin bucket of water down the row. No wounds, no blood: this is sickness, not battle. Heavy heat, stillness. Quiet and sad, not dramatic.

17. ch09_land_hearing — 1852, a plain hearing room in San Francisco. On one side of a long table a Californio ranchero in a short jacket with silver buttons and a sash, his flat-crowned hat held in his hands, sits with an old folded Spanish land-grant document and a hand-drawn rancho map spread in front of him (no readable writing). Across the table three American commissioners in black frock coats and a lawyer with a stack of ledgers examine the papers; a clerk writes. Bare walls, window light. The ranchero patient and worried.

18. ch10_house_chamber — A hot August evening in 1846, the old semicircular Hall of the House of Representatives in the U.S. Capitol. Tall columns, heavy drapes, a domed ceiling, oil lamps being lit. Rows of wooden desks; congressmen in dark frock coats, some fanning themselves, stand and argue. One man stands in the middle distance with his back to the viewer, holding up a single sheet of paper. Busy, hot, about to change.

19. ch10_arsenic — Night, 1846, a still life on a dark wooden writing desk in a New England study. A small glass apothecary bottle of white powder with a cork stopper (no label) beside an open leather-bound journal with unreadable handwriting, a quill pen, and a folded map showing a coastline and rivers but no lettering. A single candle burned low lights the scene from the left. Deep, dense shadow all around. Quiet and ominous.
```

## Fallback: one prompt per image

If Flow makes only one image per prompt (or blends scenes), paste the **style line** below after each scene paragraph above
(scene text from "Spring 1825…" onward), one at a time:

```
Black-and-white 1840s illustrated-newspaper wood engraving: fine parallel lines and cross-hatching only, crisp black ink on slightly yellowed paper, bold clean high-contrast line work, no color, no gradients, no painterly or photographic look, slightly stiff period figures, simple backgrounds. Historically accurate details, nothing modern. No text, letters, numbers or captions anywhere. No frame or border, 16:9. No recognizable real person; real people only from behind or in shadow. No gore.
```

## Tips

- **Test first:** run #4 (Gonzales), #12 (cork leg) and #14 (Trist's candlelit desk) before the rest. If the engraving
  turns to grey mush, add "bold, clean line work, high contrast, like a woodcut" to the scene.
- **Must-have:** 1, 4, 6, 8, 10, 11, 12, 15, 17, 19. Every other scene has a fallback (map, document or drawn graphic).
- **Masks:** no magenta mask pass needed with Flow; engravings cut out cleanly, so I'll mask them locally.
- **Naming:** save each as its scene name + `.png` (e.g. `ch06_cork_leg.png`) and drop them in the chat or
  `projects/Mexican_American_War/public/img/gen/`.

## Status (Oct 15, after batch 2)

**In `public/img/gen/` (18 of 19), best of the two batches** (batch 2 = the lighter "newsprint" set):

| Scene | Batch | Why |
|---|---|---|
| ch02_settlers_arrive | 1 | batch 2 dropped the enslaved people, the point of the shot |
| ch02_tejano_ranch | 1 | batch 2 printed a caption |
| ch03_austin_jail | 1 | |
| ch03_come_and_take_it | **2** | the right tree-trunk wheels; flag correct |
| ch03_washington_on_the_brazos | 1 | |
| ch04_alamo_dawn | 1 | both have the 1850 curved top; batch 1's is small and dark (regenerate if you can) |
| ch05_rio_grande_camp | **2** | caption cropped off |
| ch05_ambush | **2** | not used: replaced in ch 5 by a drawn diagram of the trap (the field, the chaparral, one gate) |
| ch05_rider | **2** | |
| ch06_blockade | **2** | |
| ch06_cork_leg | **2** | caption cropped off; caps look a little Civil War, fine at this size |
| ch06_flag_and_gallows | 1 | batch 2 printed a caption and showed the gallows closer |
| ch08_trist_letter | **2** | "DEC. 1847" tag and border cropped off |
| ch08_gold | 1 | more gold, stronger light |
| ch09_sick_tents | 1 | |
| ch09_land_hearing | **2** | |
| ch10_house_chamber | **2** | clearer man holding up the paper (the subject) |
| ch10_arsenic | 1 | darker, more ominous |

**Rejected: ch04_marsh_grass (batch 2).** The man hiding in the grass came out as a Black man, so the scene reads as armed men
hunting a freedom seeker, not soldiers finding Santa Anna. Not usable. Regenerate with the fix below.

**Two re-dos (both optional; scenes work without them):**
- ch04_marsh_grass: add "The crouching man is a Mexican army soldier: a Mexican man with dark straight hair, in a short
  Mexican infantry jacket with a high collar and white trousers, seen from behind."
- ch04_alamo_dawn: add "The chapel's façade is flat across the top and roofless, with no curved parapet or hump."
