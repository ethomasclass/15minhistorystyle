# Scene plan: The Balloon War v2

Narration: `script/v2/chNN_*.txt`, word timings `public/audio/v2_chNN_*.words.json`. Project: `v2/` (its `public/` is `../public`).
Image list with source tags: `public/img/IMAGES.md` (v1 sections + "v2 (story-arc script) additions"). Silhouettes: `script/SILHOUETTES.md`.
Ch 1 (`v2/src/ch/Ch01.tsx`) is built and is the pattern. A new visual beat every 4–8 s; wide shot, then a detail.

## Recurring pieces
- **Silhouette scenes** (`SilScene name="BWnn_…"`, full-frame parallax; keep their own colours, no tag, no grayscale):
  BW01_beach_dawn, BW02_release (balloon as its own layer: see `RisingBalloon` in `../src/test/SilTest.tsx`), BW03_woods_open,
  BW04_bly_road (QUIET), BW05_cranes, BW06_raid_tokyo, BW07_weatherman, BW08_theater_girls, BW09_rei (`dust` in the lamp beam),
  BW10_wyoming_flash, BW11_smokejumpers (unused since the cut), BW12_price_desk, BW13_presses, BW14_aug15_dc, BW15_aug15_japan,
  BW16_bookstore.
- **People with no photo** are anonymous silhouettes with a small mono label (Ch01 `NoPhoto`): "REI MINAMIMURA · no photo used",
  "TATSUO OGAWA · no photo used", "JOHN TAKESHITA · no photo used". **Byron Price:** the LOC portrait's name is unverified: do NOT
  use `byron_price_portrait_harris_ewing.jpg`; use BW12 + his signed 1945 letter + the press code booklet.
- **Props** (`Prop name=…`, B&W cut-outs; coral only on the beat's subject, never on the sweet potato, which reads as watermelon):
  barometer, door_card, konnyaku_root, microscope, paper_crane, paste_brush_pot, radio, sand_jar, sandbag, sweet_potato, washi_stack.
- **The balloon** is coral wherever it appears (it's the subject of the whole video).
- **3D pieces** (being built in `v2/src/fx/` by the 3D builder; use a placeholder print where one isn't ready and say so):
  `PacificWinds` (the jet stream crossing, a coral balloon riding it), `AltitudeRibbon` (rise, sink, drop two bags, three days),
  `SandToBeach` (sand grains under the microscope → the beach on Japan's coast), `LandingMap` (pins for 285 incidents by month;
  launches drop to zero in April; one coral pin at Bly in May).

## ch02 · Revenge on the Wind (72 s) · music bw_revenge_on_the_wind
1. "In the spring of 1942, a handful of American bombers took off from an aircraft carrier" → `v2/raid1942/b25_takeoff_from_hornet_80g41196`
   (wide print), then `b25s_crowded_on_hornet_deck_1942` (detail). Tag "US Navy, 1942".
2. "and bombed Tokyo" → BW06_raid_tokyo. "furious" → tape FURIOUS.
3. "hit back... At America itself" / "no Japanese bomber could fly that far" → PacificWinds (no winds yet, just the ocean, Japan and
   America with a dashed line and "too far" note) or the jet-stream map print.
4. "a secret army lab... What if the wind could do it?" → dark desk, the barometer prop, tape WHAT IF THE WIND…?
5. "Way up high... a fast river of air... west to east" → PacificWinds (the winds flow). "A Japanese weatherman had mapped it twenty
   years earlier." → BW07_weatherman. "Today we call it the {jet stream}." → `Definition` card.
6. "Hang bombs from a balloon. Let the wind carry it for three days. Then let it fall on America." → `fugo_moffett_classic_a37180c`
   print, three short notes timed to the three sentences.
7. "build thousands of them... grown men were at war" → `japanese_crew_filling_balloon_wind` print, note "who would build them?"

## ch03 · The Girl Who Glued (83 s) · music bw_paper_and_paste
1. "So they used kids." → BW08_theater_girls. "girls, as young as 12" note. "a schoolgirl named Rei Minamimura" → BW09_rei + label.
2. "the biggest theaters in Tokyo" → `v2/japan/tokyo_takarazuka_theater_1930s` + `nichigeki_theater_1933` (small: 500 px; desk cards)
   and `ch04_paper_balloon/schoolgirls_pasting_envelope_fig12` (the real photo of girls pasting). "panels about the size of a door" note.
3. "tough Japanese paper made from tree bark" → washi_stack prop; "paste made from a root vegetable, tinted blue" → konnyaku_root,
   then paste_brush_pot (coral on the paste pot).
4. "edible... eating the glue" (aside) → konnyaku coral, note. "No hairpins. Fingernails cut short." → two notes; "top military secret"
   → stamp TOP SECRET.
5. "About 600 pieces made one balloon, 33 feet across. As tall as a three-story house." → `fugo_moffett_classic` or
   `moffett_balloon_inflated_hangar_1945` with a drawn three-storey house outline for scale.
6. "A metal ring of sandbags kept it at the right height for three days. Then it dropped its bombs and blew itself up." →
   AltitudeRibbon (or `ballast_ring_on_ground_nara285260` + the sandbag prop).
7. "Rei didn't know any of that. She wouldn't find out for decades." → BW09_rei again, quieter, note "decades".

## ch04 · The Boy on the Beach (74 s) · music bw_dawn_launch
1. "a 16-year-old named Tatsuo Ogawa" → BW01_beach_dawn + label. "special assignment" tape.
2. "carried the paper balloons down to the sand, filled them with hydrogen gas, and checked them for leaks" →
   `japanese_crew_experimental_launch_1944`, `japanese_crew_filling_balloon_wind` (real launch-crew photos).
3. "We'd get a sweet potato for each hole we found" → `Quote` card + sweet_potato prop (B&W, teal trace). Aside "Nothing motivates
   a teenager like a potato."
4. "watch it drift out over the ocean" → BW02_release with the rising balloon layer.
5. "There's no way we can win with these things." / "Japan's gonna lose." → two `Quote` cards over a dim BW01.
6. "On November 3, 1944, the real attack began, from three beaches" → `launch_sites_map_fig16` print, three beaches circled, the
   Ichinomiya beach in coral (remember it: ch06 returns to it). "about 9,300 balloons" → a counter ticking up.
7. "Remember that beach... with a microscope." → the microscope prop slides in on the dark desk.

## ch05 · "Paper" (60 s) · music bw_paper_and_sand
1. "near a small town in Wyoming... a bright red flame... something like a parachute" → BW10_wyoming_flash.
2. "Montana. Then two in Alaska, one of them on Christmas Eve. Then Oregon." → LandingMap, first pins one by one (or prints:
   `fugo_landed_tremonton_utah_fig4`, `fugo_treed_balloon_pyramid_lake_fig28`, `collapsed_balloon_on_ground_nara285257`).
3. "The Army was baffled... Fire bombs? Or something worse? ... germs" → `fugo_officials_inspect_burns_oregon_fig2`.
4. "The code word was 'paper.'" → a typed report line on the desk (typewriter sfx), the word PAPER stamped.
5. "the only real clue was... a few bags of sand" → `gondola_sandbags_closeup_fig68` + sandbag prop (coral).

## ch06 · The Sand (64 s) · music bw_paper_and_sand (startFrom set)
1. "sent the sand to {geologists}" → `Definition`; `v2/sand/ichinomiya_beach_sand_samples_usgs` + sand_jar prop.
2. "Under a microscope... tiny shells... one thing was missing: coral" → `foraminifera_shell_sem_usgs`, `diatoms_50_species…`,
   microscope prop; a drawn "CORAL?" note crossed out.
3. "narrowed it down to a few stretches of coastline... in Japan" → SandToBeach (or the launch-sites map, the same beach in coral as
   ch04). "The same beach where Tatsuo and his friends had hunted for holes." → BW01 flash.
4. Aside "Basically, CSI." → keep it on the microscope.
5. "They'd crossed the whole Pacific. On their own." → PacificWinds reprise.
6. "*What do you tell people?*" → big tape, held (the midpoint).

## ch07 · The Newspaperman (137 s, plug at the end) · music bw_the_newspaperman
1. "Byron Price" → BW12_price_desk. "almost thirty years... Associated Press" → `nyt_newsroom_1942` (a newsroom, tag it as NYT 1942).
   "Office of Censorship" → `office_of_censorship_pin` + the press-code booklet. Aside "keeping things out of the newspaper."
2. "Mostly, Price didn't order anybody around. He asked. ... voluntarily" → `byron_price_letter_to_president_nov1945` (signature).
3. "Japan was reading American newspapers" → BW13_presses. "January 4, 1945... don't report the balloons" → a typed request, censor bar.
4. "from coast to coast, they did" → `nyt_presses_start_rolling_1942` + a row of blank front pages.
5. "The silence left Japan blind... from a Chinese newspaper" → dark desk notes; `Quote` "baffled the Japanese, annoyed and hindered them".
6. Hanford: "hit a power line in Washington State and shut down Hanford" → `bonneville_transmission_lines_1941`, `hanford_b_reactor_100b_area_1944`.
7. "you can't keep a secret from Japan without keeping it from Americans, too... As the weeks went by... At some point, Price asked to
   warn the public... The Navy said no." → BW12 again, slower; note "the Navy said no".
8. "American bombers had hit the plants making the gas... in April 1945, they gave up." → `otsu_launch_site_sc284816`; LandingMap's
   launch count dropping to zero. "The silence had worked." tape.
9. Plug: small teal Note "subscribe ↓" only. Then "one more balloon in this story. And it had already landed." → BW03 woods, dim.

## ch08 · Gearhart Mountain (111 s) · HEAVY: QUIET palette, no jokes, no tapes that shout, no coral
Music: none (the plan is forest_birds that cut to silence on "too late"; `bw_gearhart` only very low at the start and end, if at all).
1. "May 5, 1945. A Saturday." → `gearhart_mountain_ponderosa_pine_1964`, a quiet date note.
2. Elsie and the cake, the five children, the Patzkes → BW04_bly_road (quiet; the car, no people) and period stand-ins at a distance
   (`klamath_falls_picnickers_in_pines_1942`, tag "Klamath Falls, 1942, strangers"). No faces of the victims.
3. "They found something... 'Wait a minute...'" → `hills_around_gearhart_mountain_usfs`, slow push. Archie's words in plain type.
4. "it was too late." → cut to black for a beat (birdsong stops).
5. "Joan, Dick, Jay, Eddie and Sherman" → the six names written by hand on a cream paper slip (Elsie first), one by one.
6. Dottie's question in plain type on black.
7. "the only people killed by enemy action on the American mainland" → `mitchell_monument_usfs_2007`.
8. "lying in those woods for about a month... since around the time Japan gave up" → the LandingMap: April launches end, one pin at
   Bly in May (the only coral exception is NOT allowed here: use teal or cream for that pin).
9. "unidentified object" → typed line on black. "Three days later, Germany surrendered" → `war_over_in_europe_chalkboard_1945`.

## ch09 · A Thousand Cranes (161 s + 20 s end screen) · music bw_a_thousand_cranes
1. "the government broke its silence... saving even one American life" → `Quote` card (War and Navy Departments, May 22, 1945).
2. "Was the silence the right call?" → two columns on the desk: kept Japan blind / six people never warned. No verdict.
3. "on August 15, 1945, both sides of this story started to disappear" → split frame.
   Tatsuo: BW15_aug15_japan + `v2/japan/japanese_civilians_listen_surrender_broadcast_1945`; "burn the documents" smoke.
   Price: BW14_aug15_dc with "OUT OF BUSINESS" hand-lettered on the blank card (drawn in code, never generated).
4. Rei: BW16_bookstore (the photo in the window glows), "an act of resistance against being erased" as a `Quote`.
5. Takeshita: `tule_lake_war_relocation_center_russell_lee_1942` / `tule_lake_birds_eye_view_wra` + label; "about fifty miles from Bly" note.
6. "A thousand paper cranes" → BW05_cranes + paper_crane prop; `two_paper_cranes_closeup_pd`.
7. The answer, recapped over BW01 → BW09 → BW12 → BW03 (one line each), then the closing line over BW05 ("...paper birds"), the
   coral balloon idea folding into the crane if time allows.
8. End screen (copy the pattern from `projects/Diamond_Hoax/src/ch/Ch09.tsx` end screen; drawn YouTube slots), "Thanks for watching".
