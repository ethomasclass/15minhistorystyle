# Build notes: ch04 · Beef for Bosque Redondo (104.2 s)

File `src/ch/Ch04.tsx`; masks `src/masks_ch04.ts` (job `tools/mask_jobs/ch04.py`: `c4_goodnight` only); shared helpers for ch04–06 in
`src/kit/ch456_extra.tsx` (Quiet, MStandLabel, MRiver, MState, MLine, TornTag, Four, CheckList). Contact sheet `review/stills/ch04_sheet.jpg`
(29 frames). Checks: tsc clean, `anchors.py` passes (repeats checked: "two" ×2, "Pecos" ×2, "Hundreds died", "People were", "in gold",
"Goodnight and Loving"), `probe_text` (SAFE=96) clean.

**Sensitive material:** the Diné and Mescalero Apache people appear only in their own photographs (the two Signal Corps photographs of
Fort Sumner) as plain torn prints on the desk: no masks, no cut-outs, no coral, no marks on the people. Quiet section ("How did they get
there?" → "the Army needed beef.") runs on `PALETTES.quiet` (teal + bone, no coral), fewer/softer sounds, no jokes.

| # | Anchor | Shot |
|---|---|---|
| 1 | 0 | 1866 tape; Goodnight (torn print, coral see-through tint + trace) and Loving (circle mount, plain) on the desk |
| 2 | gathered | three longhorn props slap down at depths; ≈ 2,000 counter; "Texas cattle → driven west" |
| 3 | along | series map: Goodnight-Loving trail (coral, MHerd walking it) up the drawn Pecos to Fort Sumner; "Why there?" |
| 4–5 | Because / eight | Fort Sumner captives under guard (Signal Corps, c. 1864) as a print: wide, then a cut-in with ≈ 8,000 · Diné (Navajo) · Mescalero Apache |
| 6–7 | How did / for sheep | QUIET · drawn two-node diagram: Diné raiders ⇄ New Mexican settlers, "for generations · both ways"; sheep · horses · captives |
| 8 | In 1863 | 1863 (bone tape); Gen. James H. Carleton in a circle mount (named on a label; the narration says "the Army's commander") |
| 9–10 | He wanted / and turned | map: Diné homeland (four sacred mountains, simplified) hatched teal; "(he believed it held gold)"; dashed line → "a reservation beside Fort Sumner", "far from home" |
| 11 | Troops | Kit Carson circle mount (plain); burned their fields / cut down their orchards / killed their sheep |
| 12 | until | O'Sullivan's Canyon de Chelly (1873) as a print; "that winter, starving families surrendered" |
| 13–15 | Then soldiers / call it / Hundreds died | map: the Long Walk drawn slowly in teal, ≈ 300 miles, "marched, 1864"; THE LONG WALK (bone) "what the Diné call it"; then held, labels fade, no marks |
| 16–17 | The camp / The water | Navajo captives at Fort Sumner (Signal Corps) print; BOSQUE REDONDO + Definition ("round grove"; the reservation camp, 1863–68); water bad, crops failed |
| 18 | People were | the guard photograph again, slow pull; "people went hungry → the Army needed beef" (last quiet beat) |
| 19 | So let's | (quiet ends) map pulled back, trail to "Bosque Redondo"; plain handwriting, teal/white only: "One of the most famous cattle trails in America / began as a way to feed a prison camp." |
| 20 | Goodnight and Loving | coin stack slaps; ≈ $12,000 "in gold" |
| 21 | Goodnight is | Goodnight print small (coral); p4_chuck_wagon cut-out lands; THE CHUCK WAGON |
| 22 | an old Army | **3D cut-away** (drawn teal on a `Stage`, slow orbit): Army wagon box on wheels with bows, the chuck box on the back (shelves + a grid of drawers); "an old Army wagon / + a box on the back", "shelves & drawers"; Definition |
| 23 | so a cook | Erwin E. Smith, J.A. chuck-wagon (Goodnight's J.A. Ranch), 1907, as a print |
| 24 | The lid | 3D again, closer orbit: the hinged lid swings down on "folded" into a table (coral), legs drop; "the lid → a table" |
| 25 | Hold onto | map: Bosque Redondo pin, Long Walk + trail faint; "hold onto Bosque Redondo", "→ Episode 4" |
| 26 | So who | saddle + lariat props; "who were the men / riding these trails?"; held through the tail |

**Music:** `m_lament` (bed 13) to "How did they get there?" (30-frame hand-off) → `aw_long_grief` at bed 14 from there to the end
(the coordinator's Oct 2026 wiring).

**Still rough**
- 3D chuck wagon: in the wide orbit the chuck box's back face is seen at a steep angle, so the drawers read better than the upper
  shelves; the close orbit shows the full grid. Parts are simplified ("Drawn diagram · parts simplified" tag).
- Goodnight portrait: it is a 1905 halftone (enlarged, a little soft at the print size used).
- Carleton's scan (Commons) carries a Palace of the Governors credit line at the bottom; it is cropped out (`b_carleton_crop.jpg`) and the tag credits them.
- Map trails: Chrome dropped trails drawn at translateZ(2px) in some camera set-ups (ch04 "a reservation" line, ch05 South/North);
  those use `MLine` (1px) from `ch456_extra.tsx` instead. Shared `MTrail`/`MRoute` may have the same issue in other chapters.
- Images I sourced (prefix `b_`, credits in `public/img/credits_ch04_b.json`): Goodnight (Prose and Poetry, 1905), Loving, Fort Sumner
  guard photo (Hweeldi), Carleton, Kit Carson (Fredricks/NPG), Canyon de Chelly (O'Sullivan/LOC), J.A. chuck wagon crop. The image agent's
  `navajo_captives_fort_sumner_1860s.jpg` and the J.A. photo are used too; its `kit_carson_c1863.jpg`, `canyon_de_chelly_camp_beauty…`
  and `fort_sumner_counting_navajo_c1864.jpg` arrived later and are unused (the last is the same Signal Corps negative as `b_hweeldi`).
