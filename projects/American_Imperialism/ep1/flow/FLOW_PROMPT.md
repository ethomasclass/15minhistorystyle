# Google Flow prompt: Ep 1, The Pitch Meeting

**18 new images** in two batches: 15 scene plates and 3 cut-out sheets. Six plates and three sheets from the Hawaiʻi tests are
reused (harbor, hull, wardroom, palace, tower window, Queen's room; the Queen, the navy, the props), so they are not in here.

**Attach these three reference images to every batch** (they are in `refs/`):
1. `1_style_reference.jpg`: the style.
2. `2_palace_plate.jpg`: a plate Flow already made for us, so the new ones match it.
3. `3_cutout_sheet_example.jpg`: what a good cut-out sheet looks like.

**Send the results back** named as below (or just say which is which). Put them in `flow/in/`.

Two special colours do real work, so they matter more than anything else in the prompt:
- **Magenta `#FF00FF`** marks a doorway (a window, a board, a spot on a map). The camera flies through it and the next scene
  is put behind it.
- **Green `#00FF00`** is the background of the cut-out sheets, so figures and props can be lifted off.

---

## Batch 1 (paste whole, with the three references attached)

```
You are illustrating a history documentary about how the United States came to take Hawaiʻi, 1867 to 1898. Create 9 separate images, one per numbered item below. Make each one its own image in 16:9 landscape format at the highest resolution available. Do not combine items, do not make a grid or collage, and do not number or caption the images. Use the first attached image as the style reference for all nine, and match the second attached image (a plate already made for this series) in style, palette and level of detail. The third attached image shows how a cut-out sheet should look.

STYLE FOR EVERY IMAGE (identical across all images so they look like one series):
A mid-century retro travel-poster illustration made of flat, faceted shapes. Every shape is one flat colour with crisp, slightly angular edges; forms are built from a few flat planes, lit from the upper left, with a lighter plane on the lit side and a darker plane on the shade side. No outlines, no line work, no gradients, no airbrushing, no painterly brushstrokes, no photographic detail, no 3D render look. Skies are flat dusty blue with large flat cream clouds that have one darker cream band along the bottom. Mountains and rocks are faceted like folded paper. Trees and palms are angular shards of two or three greens on thin dark trunks. A faint aged-paper grain over everything.

PALETTE (use these and close neighbours only):
paper cream #E9DBB8 and #F2E6C6; dusty sky blue #A7B9B6; sea teal-grey #6F9997 and #4F7B7D; olive and moss greens #A3A45A, #6C733C, #3F4527; warm stone #CFC4AB and #A79C86; slate grey #666D74 and #3F454C; koa and walnut wood #8A5A35 and #5A4130; deep room green #2A3A33; near-black plum #2B2630; ship white #ECE4D0; brick red #8F3B2E; ink #3A3934. One small spot colour per image, chosen from burnt orange #D4732C, dusty pink #D98B8C or mustard #DFB43A.
Do NOT use bright turquoise or bright pure orange anywhere: those are reserved for graphics added later.

PEOPLE (only on the cut-out sheet):
Flat simple figures in the same faceted style, correct period clothing, in the proportions of real adults. Faces are a plain flat skin-tone shape with NO eyes, nose, mouth or other features. No recognizable real person.

RULES FOR EVERY IMAGE:
- Historically accurate for the year given in each item. Nothing modern.
- No text of any kind: no letters, words, numbers, captions, signatures, labels or watermarks anywhere, including on maps, boards, papers, signs, flags, crates and ships.
- No frame, border or margin. Fill the whole 16:9 image.
- No people in the scene plates (items 1 to 8). They are added later.
- No gore, no violence.

DOORWAYS (items 2, 5 and 6): each of these images contains exactly one "doorway" shape. Fill that shape with completely flat pure magenta, hex #FF00FF: no shading, no reflections, no texture, no objects, bars or frames crossing it. Draw it facing the viewer straight on, with no perspective distortion. Keep it away from the edges of the image. Do not use magenta anywhere else.

CUT-OUT SHEET (item 9): place everything on a completely flat pure green background, hex #00FF00, with no floor, no cast shadows and no gradients. Keep clear green space between the separate figures; nothing overlaps or touches, and nothing is cut off by the edge. Do not use that green anywhere inside the figures.

THE 9 IMAGES:

1. a1_prison_room: An upstairs bedroom inside ʻIolani Palace, Honolulu, early 1895, used as a place of confinement. Seen straight on like a stage set. Pale plastered walls with a dark wood picture rail and tall dark wood skirting; a high ceiling. On the left, a tall window with heavy dark curtains drawn back, bright daylight and a glimpse of palm tops and blue sky through the glass. On the right, a tall closed panelled wooden door with a brass handle. Against the back wall, a narrow iron bed with a plain white cover, a small wooden table with a water jug and a single chair, a worn rug on a dark wood floor. Sparse, quiet, a little bare. No people. No doorway.

2. a2_palace_window: A close view of the upper storey of ʻIolani Palace from outside, seen straight on: the upper veranda with two slender stone columns and an arch between them, a stone balustrade along the bottom edge of the image and the cornice at the top edge. In the shaded wall behind the veranda, a tall window with a plain stone surround. DOORWAY: the glass of that window, a tall rectangle about 45 percent of the image height, flat magenta.

3. a3_palace_hall: An upstairs hallway inside ʻIolani Palace, 1895, seen straight on: a long hall with polished dark wood floor, dark wood wainscot, pale walls, a tall closed panelled door in the centre of the back wall, a small side table with an oil lamp beside it, and a framed mirror with no reflection of people. Soft light from the left. No people. No doorway.

4. b1_frontier_cliff: The American West around 1890, a wide view. A dusty wagon road runs from the lower left across dry golden grassland and stops at the edge of a high, faceted sea cliff. Beyond the cliff, the Pacific Ocean stretches flat to the horizon, sea teal-grey under a dusty blue sky with large flat cream clouds. A few gnarled cypress trees lean in the wind near the cliff edge. Empty and quiet. No wagon, no people. No doorway.

5. c2_pitch_easel: A close view, straight on, of a wooden presentation easel standing in a dim 1890s Washington office: dark wood panelling behind it. On the easel, a large board in a thin dark wooden frame. DOORWAY: the board's whole face, a 16:9 rectangle about 55 percent of the image width, flat magenta.

6. c3_pitch_map: A close view, straight on, of a large old wall map of the Pacific Ocean, 1890s, hanging on dark wood panelling: aged cream paper, the sea in pale teal-grey, the edges of Asia and Australia on the left and the Americas on the right in muted greens and stone, small island chains scattered across the middle, a faint grid of latitude and longitude lines, no writing, no labels. The Hawaiian Islands are in the exact centre as a small chain of islands. DOORWAY: a small circle centred on the third island from the right of the Hawaiian chain (Oʻahu), its diameter about 12 percent of the image height, flat magenta.

7. c1_pitch_room: An office in Washington, D.C., in the 1890s, seen straight on like a stage set, wide: dark wood panelling, tall windows with heavy green curtains on the left, a long polished table with six empty chairs, papers and a water carafe on it, a large old wall map of the Pacific Ocean (cream paper, pale teal sea, no writing) on the right wall, and a wooden presentation easel with a blank board standing at the far end of the table. Warm lamp light. No people. No doorway.

8. d2_committee_room: A Honolulu law office at night, January 1893, seen straight on: wooden bookcases with leather books, a tall window showing night sky and a palm silhouette, a brass oil lamp on a long wooden table in the lower centre casting a warm pool of light, the table bare and clear. No people. No doorway.

9. s1_pitchers: CUT-OUT SHEET on flat green. Eight full-body figures in a row, all to the same scale, four men twice each, featureless faces, 1890s American clothing. Man A, a businessman: grey beard, black frock coat, grey waistcoat with a gold watch chain, striped trousers; pose 1 standing and gesturing with one open hand toward the viewer's right as if presenting, pose 2 standing with his hands behind his back. Man B, a naval officer: U.S. Navy captain of 1890, dark blue double-breasted frock coat with brass buttons, peaked cap, sword at his side; pose 1 pointing with one arm straight out toward the viewer's right, pose 2 standing at ease. Man C, a Protestant minister: black frock coat, white clerical collar, holding a small black book; pose 1 one hand raised as if preaching, pose 2 standing with the book held to his chest. Man D, a lecturer: brown tweed suit, small round spectacles, holding a long wooden pointer; pose 1 pointing the stick up and toward the viewer's right, pose 2 standing with the pointer held across his body. In pose 1 all four men face the viewer's right, toward the board they are presenting.
```

## Batch 2 (paste whole, with the three references attached)

```
Continue the same series. Create 9 more separate images, one per numbered item below, each its own 16:9 landscape image at the highest resolution available. Same STYLE, PALETTE, PEOPLE, RULES, DOORWAYS and CUT-OUT SHEET instructions as before (repeated here so nothing drifts):

STYLE: a mid-century retro travel-poster illustration made of flat, faceted shapes; every shape one flat colour with crisp angular edges, lit from the upper left; no outlines, no gradients, no brushstrokes, no photographic or 3D look; flat dusty blue skies with flat cream clouds; faceted mountains; angular palms; faint aged-paper grain. Match the attached style reference and the attached palace plate.
PALETTE: paper cream, dusty sky blue, sea teal-grey, olive greens, warm stone, slate grey, koa wood browns, deep room green, plum black, ship white, brick red, ink; one small spot of burnt orange, dusty pink or mustard. No bright turquoise and no bright pure orange.
RULES: historically accurate for the year in each item; nothing modern; no text, letters or numbers anywhere (including signs, crates, sacks, ships, labels, flags and banners); no frame or border; no people in the scene plates (items 1 to 7); no gore, no violence.
CUT-OUT SHEETS (items 8 and 9): flat pure green background #00FF00, no floor, no shadows, clear green space between items, nothing touching or cut off, no green inside the items. People have featureless faces and no recognizable real person.

THE 9 IMAGES:

1. c5_docks: An American seaport wharf around 1890, wide, seen straight on: a long brick warehouse with tall doors on the left, the wharf in front piled high with wooden crates, barrels, sacks and bales of cotton stacked far higher than a person, more than the wharf can hold; a steamship with one funnel and two masts moored on the right; gulls; a hazy harbor behind. A sense of too much stuff. No people. No doorway.

2. c6_coaling_station: The open Pacific around 1890: a small faceted rocky island with a wooden coal pier, black heaps of coal, a coal shed and a small white lighthouse; beside the pier, seen side-on, a U.S. Navy steel cruiser of the early 1890s with a white hull, buff upperworks, two buff funnels and two masts, smoke from the funnels. Flat sea to the horizon. No people. No doorway.

3. c7_mission_church: A white wooden mission church in Hawaiʻi in the 1880s, seen straight on: a simple New England style meeting house with a pointed steeple, tall clear windows and wide front steps, a green lawn, coconut palms and a breadfruit tree beside it, faceted green mountains and flat cream clouds behind. Peaceful Sunday morning. No people. No doorway.

4. d1_cane_fields: A Hawaiian sugar plantation in the 1880s, wide: tall green sugar cane fields in rows across the foreground and middle, a sugar mill with a tall brick chimney giving off a thin plume of smoke, plantation sheds with corrugated roofs, a wooden flume running down from the hills, an empty ox cart on a dirt track, faceted green mountains behind. No people. No doorway.

5. d3_government_building: Aliʻiōlani Hale, the government building in Honolulu, 1893, seen straight on and symmetrical: a two-storey building of pale stone-coloured plaster with arched windows and a veranda, and a tall central clock tower with a small dome; a tall empty flagpole on top of the tower with NO flag on it; a lawn and a straight path in front, a few palms, flat cream clouds. No people. No doorway.

6. d4_pineapple_fields: The central plain of Oʻahu around 1901, wide: long straight rows of spiky grey-green pineapple plants on red earth, a few golden pineapples showing, a wooden farm wagon loaded with harvested pineapples at the end of a row, faceted green mountains behind and flat cream clouds. No people. No doorway.

7. e1_pearl_harbor_base: Pearl Harbor naval base around 1940, peacetime, seen from a green hillside above: the wide calm lochs of the harbor, a low flat island in the middle with hangars and a row of grey steel battleships moored along it, piers and cranes on the far shore, faceted mountains behind, a clear sky with flat cream clouds. Calm and orderly. No aircraft, no smoke, no fire, no damage. No people. No doorway.

8. s2_honolulu_men: CUT-OUT SHEET on flat green. Seven full-body figures in a row, all to the same scale, featureless faces. Figures 1 to 5: Honolulu businessmen and lawyers of 1893, of European and American descent, each different: one in a cream linen suit with a straw boater hat, one in a dark frock coat with a beard, one in a grey suit with a moustache, one tall and thin in a black suit, one stout in a brown suit. Each stands in profile facing the viewer's right, leaning slightly forward with both hands low in front of him as if laying something on a table (the table is not drawn). Figures 6 and 7: a guard of the 1895 Republic of Hawaii, a young man in a dark blue military uniform with a dark peaked cap, white belt, holding a rifle upright at his side; figure 6 standing at attention facing front, figure 7 the same guard with his head turned to his left.

9. s3_props: CUT-OUT SHEET on flat green. Ten separate objects, evenly spaced, each seen straight on: (a) one whole ripe pineapple, upright; (b) three rifles of the 1890s lying flat side by side, seen from directly above; (c) a covered wagon of the 1880s seen exactly side-on, with its canvas top, WITHOUT its wheels; (d) one wooden wagon wheel seen flat-on, a perfect circle; (e) a second identical wagon wheel; (f) a pair of draft horses in harness seen exactly side-on, walking; (g) a rectangular paper label for a tin can, about 1910, laid flat with no perspective: an illustration of a pineapple and green leaves on a pale yellow background with an EMPTY plain banner across the top and an empty band across the bottom, no letters anywhere; (h) a large lump of raw gold, a gold nugget; (i) a burlap sack of sugar, tied at the top, no lettering; (j) a wooden packing crate, no lettering.
```

## Fallback: one prompt per image

If Flow makes only one image per prompt, or blends items, paste this **style line** after each numbered paragraph, one at a
time, and keep the three references attached:

```
Mid-century retro travel-poster illustration built from flat, faceted shapes: every shape one flat colour with crisp angular edges, lit from the upper left, no outlines, no gradients, no brushstrokes, no photographic or 3D look, faint aged-paper grain. Match the attached style reference and palace plate exactly. Muted palette of paper cream, dusty sky blue, sea teal-grey, olive greens, warm stone, slate grey, koa wood browns, deep room green, plum black, ship white and brick red, with one small spot of burnt orange, dusty pink or mustard; no bright turquoise and no bright pure orange. Historically accurate for the year given; nothing modern. No text, letters or numbers anywhere. No frame or border, 16:9. Scene plates have no people. People on cut-out sheets have featureless faces; no recognizable real person. Doorways are flat pure magenta #FF00FF, facing the viewer, unshaded and unobstructed. Cut-out sheets sit on flat pure green #00FF00 with no shadows.
```

## What to check before sending them back

- **Magenta:** one flat colour with a clean edge, nothing crossing it, not squashed by perspective. Only in a2, c2 and c3.
- **No lettering** crept in: the map, the easel board, the can label (the banner must be empty: the title is added later),
  crates, sacks, ships, flags.
- **No people** in the plates.
- **Cut-out sheets:** figures and objects don't touch each other or the edge; the wagon has no wheels on it; the pitchers in
  pose 1 all face the viewer's right.
- **Pearl Harbor (e1)** is calm and peaceful: no aircraft, smoke or damage.
- All 18 look like one series with the palace plate. If one drifts, regenerate just that one with the fallback style line.

## What each image is for

| Image | Chapter | Used for |
|---|---|---|
| a1_prison_room | 1, 8 | The cold open: the Queen at the window (reused cut-out, from behind) |
| a2_palace_window | 2 | Pull back out of her window to the palace, then cut to the desk |
| a3_palace_hall | 1 | The guard outside her door |
| b1_frontier_cliff | 3 | The wagon reaches the end of the road (wagon, wheels and horses animated from s3) |
| c1_pitch_room | 4, 9 | The pitch room, full in ch 4 and empty in ch 9 |
| c2_pitch_easel | 4 | Each pitch: the camera flies through the board into that pitcher's world |
| c3_pitch_map | 5 | The twist: pins land on Hawaiʻi, then through the map to Honolulu Harbor |
| s1_pitchers | 4, 5 | The four pitchers, two poses each (swapped on twos to gesture) |
| c5_docks | 4 | The Businessman's world (dockworkers drawn in code, carrying) |
| c6_coaling_station | 4 | The Admiral's world |
| c7_mission_church | 4 | The Preacher's world (congregation drawn in code) |
| d1_cane_fields | 6 | Sugar, 1875 (workers drawn in code, at a distance) |
| d2_committee_room | 6 | The Committee of Safety: rifles laid on the table (gag) |
| d3_government_building | 6 | February 1, 1893: the U.S. flag goes up (flag from the reused Hawaiʻi props sheet) |
| d4_pineapple_fields | 6 | James Dole's pineapples |
| e1_pearl_harbor_base | 9 | "Forty-three years later..." |
| s2_honolulu_men | 6, 1 | The Committee men; the 1895 guard |
| s3_props | 3, 6 | Pineapple, rifles, wagon, wheels, horses, can label, gold nugget, sugar sack, crate |
