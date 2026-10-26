# Build notes: Ch01–Ch03 (Not in the Picture)

Built on the re-voiced narration (ch01 58.0 s, ch02 112.1 s, ch03 104.3 s); every cut and mark is anchored to words (`t.at`).
Checks passed: `tsc` (no errors in these files), `tools/anchors.py` (exit 0 for all three), stills + contact sheets
(`review/stills/ch01_sheet.jpg`, `ch02_sheet.jpg`, `ch03_sheet.jpg`), `tools/probe_text.mjs` (see "Probe" below).

## Shared pieces (`src/kit/ch01_extra.tsx`)
- **WestMap**: the series map, our own drawn West (Natural Earth 1:50m, Albers), dark land, teal coast, faint state lines, tilted in
  3D with a lamp pool and horizon fog. Data `public/img/ch01/west_map.json`, built by `review/build_ch01-03_westmap.py` (places,
  UP and CP lines from town control points, two simplified 1850s survey routes, the 1851 Fort Laramie hunting grounds merged, approx.).
  Pieces: `MRoute` (rail with ties / dashed proposal), `MRegion` (hatched), `MPin`/`MStand` (labels standing up, constant size),
  `MCross`, `WestCard` (flat map card for the desk). **Ch05 (Promontory) could reuse it so the series map matches.**
- **Ribbon** (P2's elevation ribbon, parametrised, `hide` for labels that would leave the frame), **BondKey**.
- **Township** + **ActPage** (P3, timed by the caller), **TownLegend**.
- **House**: the House of empty chairs (237 seats, the 66 of the seceded states as dashed coral chairs; diagram, 1850 apportionment).
- **Hand** (bare handwriting with coloured words), **Tally**, **DarkCard** (dark torn-top index card, no cream).

## Ch01 · cold open → channel intro → title
1. Wide parallax push on Russell, NOT IN THE PICTURE tape at 0.4 s (P1)
2. Desk slap of the torn print; worker slaps into the gap on "aren't in it" (P1; the map card is now the series map)
3. Whip, pan across the engines, loops (P1) · 4. push to the bottles · 5. tilt to the handshake, Montague coral (P1)
6. Desk pull-out, MAY 10, 1869, held through "…is finished" ("coast to coast: done")
7. "Now look at the faces": pan along the crowd with a teal loupe (2.3× inset)
8. "The Central Pacific … western half": series map, CP line in coral, Sacramento/Promontory/Omaha
9. "around four out of five, were Chinese": Hart, Chinese Camp at Brown's Station (push), "≈ 4 IN 5" tape, "were Chinese"
10. "Look again. You can't find them.": back to the print, empty gap held ~2 s, worker slaps in on "them"
11. THE QUESTION tape over the print, far and soft
12. "tie a country … back together": the handshake pulling out, Montague coral
13. "open the West to anyone": series map, both lines
14. Bare handwriting: "who did it actually / open it for?" ("open" coral, looped)
15. "not about trains": the UP engine, pulling out · 16. "who counted as part of the country" (handwriting)
17. "We'll come back…": push into the print's empty gap · 18. "a room full of empty chairs": the House drawing (hand-off)
Then `ChannelIntro`, then the title over the dimmed Russell photo. Music `r_cold_open` 0.17, dipping under the hand-off.

## Ch02 · 1862
1. Washington, 1862 (Wood's Capitol dome, May 1861) · 2. House wide, chairs draw in, the seceded share empties
3. Cut-in on the empty wedge (≈ 66 of 237) · 4. DEADLOCK: series map, a northern and a southern route, both crossed out
5. "where would the railroad run? / who gets the new land? / slave or free?" over the map
6. "With the South gone": the empty chairs fall away; "stops arguing / starts passing laws"
7. HingeYear 1862 ("three laws, one year") · 8. the three laws slap onto the desk (Homestead, Morrill: NARA; the Act: LOC)
9. "Remember that year, 1862" held · 10. THE BIGGER IDEA (whole West) · 11. RECONSTRUCTION over Richmond's ruins, 1865
12. "what does freedom mean now, and who gets it?" over the map · 13–14. more people in the room: four circle mounts
    (Soule's Arapaho camp, Hart's worker, the Boronda family, Leslie's 1879 Exodus engraving), mono labels, people kept in their photos
15. GREATER RECONSTRUCTION + Definition · 16. THE DEAL (the Act's title page) · 17. UNION PACIFIC from Omaha (1/2)
18. whip west, CENTRAL PACIFIC from Sacramento (2/2) · 19. LAND GRANT: P3 township + Definition
20. EVERY ALTERNATE SECTION: the Act page, focus pull, coral swipe from act_lines.json · 21. "+ loans: government bonds": ribbon wide,
    bond key, a stack of bonds slaps in · 22. push into the Sierra, treble zones coral, "mountain miles paid 3×"
23. Stack in bare handwriting · 24. "that means: not paid for a good railroad" (struck) / "paid for a **long** one, fast"
25. THE RACE: ribbon, engines moving. Music `g_founding` → `g_grip` at "Here's the deal".

## Ch03 · The Race
1. CENTRAL PACIFIC, map at Sacramento with the Sierra ahead · 2. "a wall": Hart, Cape Horn; THE SIERRA NEVADA
3. Russell, summit of the Sierra (pan): "couldn't keep workers" · 4. "walked off → gold & silver": gold-rush daguerreotype on the desk
5. 1865 / CHARLES CROCKER: Selleck portrait, coral + trace · 6. "about 50": Hart, laborers near Summit Tunnel, 50 coral tally marks
7. Cut-in: the foreman, "too small" · 8. Crocker close, "reportedly" (orange), "their ancestors built the Great Wall"
9. "The 50 worked out" → workforce bar, Chinese crews most ("most estimates: around 4 in 5") · 10. THOUSANDS: Hart's worker, coral
11. NOT THE SAME PAY: two dark cards, then cut-in (less pay · buy own food | more pay · meals came with the job)
12. Tea: the tea barrel prop (coral), "tea: boiled water", "carried up in barrels" · 13. the Sierra stream plate, "straight from the streams"
14. "who got sick less often?" held, the barrel looped · 15. UNION PACIFIC racing west across the map
16. Russell, Casement's outfit: Irish immigrants / Civil War veterans (both armies) / formerly enslaved men
17. Hell on Wheels tent town (litho L2) wide · 18. cut-in, "HELL ON WHEELS" tape, "(says it all)"
19. Hunting grounds hatched on the map, Lakota / Cheyenne / Arapaho, the UP line through it · 20. "hold that thought → Episode 4"
21. Ribbon: "the Union Pacific: the Plains" · 22. push into the Sierra: "the Central Pacific: **a mountain**", held into the tail.
Music `g_cotton_engine` 0.15 (`// SUNO: aw_iron_horse replaces this`).

## Images
Archival (credits in `public/img/credits_ch01.json` … `_ch03.json`): LOC TIFF masters for the Hart stereos (left halves) and Russell's
Sierra summit; Commons/NARA for Crocker, Soule, the Homestead and Morrill Acts, Richmond, the miners, Casement, Boronda, Leslie's.
AI (Gemini 2.5 Flash, litho prompt): 3 new (bonds prop, tea-barrel prop, Sierra-stream plate; prompts in `review/ai_images_ch02.md`,
`review/ai_images_ch03.md`); reused L2 Hell on Wheels and the ribbon ridges/engines. No on-screen tags on AI images (user's rule).
Masks: `ch03_crocker` (u2net_human_seg), `ch02_bonds` (holes filled), `ch03_tea_barrel`; jobs in `tools/mask_jobs/ch02.py`, `ch03.py`.

## Probe
Remaining hits are single frames inside whip transitions (the outgoing/incoming shot slides 900 px sideways while blurred) and
invisible (faded) ribbon labels; no static text crosses the frame.

## Still rough
- Ch02's map shots (deadlock, questions, the bigger idea, out West) now carry the West as one see-through coral hatch (`MWest`:
  California to Kansas by today's state shapes, Texas left out) with a THE WEST label from the first frame; the proposed routes are
  simplified corridors (labelled approx.). The four "more people in the room" mounts sit on the desk as empty dashed sockets from
  the cut, and each photo drops into its socket on its word.
- The Boronda family photo is undated and small (500 px); fine in a 160 px circle, not for a push. The Leslie's 1879 engraving is a
  St. Louis scene of Exodusters (families heading for Kansas), cropped tight to a family on a wagon.
- The Crocker print shows the cream of the original carte de visite (scan tone), and its coral is on from the slap, not on the name.
- The House is a diagram: the empty wedge is contiguous for clarity, not a seating chart.
- Hunting-ground boundary is the merged 1851 treaty territories, simplified; labelled approx. on screen.
- Ch01's title/intro hold after "chairs" is ~1.3 s before the channel intro (music dips under it).
