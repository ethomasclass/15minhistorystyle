# In Their Own Words: scene plan (brief for building `src/ch/ChNN.tsx`)

Narration is voiced (`public/audio/chNN_*.wav` + `.words.json`, 9:05 total). Build every scene on the real word timings. The
narration text is in `script/chNN_*.txt` (and `script/SCRIPT.md`).

## Rules for every chapter (read first)

- Read the style repo's guides: `/home/claude/15minhistorystyle/.claude/skills/15-minute-history/references/building-scenes.md`,
  `visual-style.md`, and `explainer-craft.md` §3. Model chapters built with the same kit:
  `/home/claude/15minhistorystyle/projects/Mexican_American_War/src/ch/Ch0*.tsx` and `Ch10.tsx` (end screen),
  `/home/claude/15minhistorystyle/projects/Dressed_To_Kill/src/ch/Ch0*.tsx`, `/home/claude/15minhistorystyle/projects/Black_Sox/src/ch/`.
- **Kit** (`src/kit/`): `Kit.tsx` (Highlight, Note, Arrow, Loop, Tag, Tint, Traced, usePal), `shell.tsx` (ChapterShell, makeTimeline,
  useScene, Photo, CropCard, Definition, Quote, Stamp, PhotoCard, hasFile), `engraving.tsx` (`Engraving`: Flow wood engravings
  full frame), `parallax.tsx` (`Parallax`, layers exist for every mask), `map3d.tsx` (the 3D map), `charts.tsx`, `bs.tsx` (Desk,
  DropCard, Arch, SyncQuote, Line, Sounds), `dk.tsx` (`Doc` + `DocMark` with `swipe`: coral highlighter along quoted lines,
  `sizeOf(src)` from `src/imgs.ts`, `GEN` = [1376, 768] for Flow images; ignore its GREEN/Swatch/Sil, they belong to another video).
- **Masks** (`src/masks.ts`): `MASKS.stephens` (ch01 Vannerson portrait), `lincoln` (ch02 Grozelier), `davis` (ch02 Brady),
  `anderson` (ch05 engraving), `lee` (ch06 Vannerson full length), `union_soldier`, `confed_soldier` (ch08 tintypes),
  `spectator` (the man with opera glasses in `img/gen/v1_ch07_spectators.jpg`). Every other image is shown without a mask
  (a plain card, Doc or full-frame image). **The older Stephens (`ch01/stephens_portrait_brady_c1870.jpg`) and Scott have no mask on
  purpose:** plain cards.
- **Image sizes:** never guess, use `sizeOf('img/chNN/file.jpg')` (from `src/imgs.ts`).
- **Do not edit shared files** (`src/kit/*`, `src/masks.ts`, `src/chapters.ts`, `src/project.ts`, `src/imgs.ts`, `tools/*`,
  `public/*`). Put helpers inside your chapter file. If you truly need a shared helper, create `src/kit/v1_extra_chNN.tsx`.
- **Colour rules.** B&W archive with one coral subject + teal trace. Teal = marks and notes, orange = titles (Highlight), coral =
  the subject and punchlines. **Quiet chapters (ch03, ch04, ch08): `quiet` palette, no coral tint, no jokes, fewer marks, longer
  holds.** Pass `quiet` to ChapterShell (see Mexican_American_War ch09 for how a quiet chapter is wired).
- **Tags on every image**, from `public/img/credits.json` (title · source, e.g. "Julian Vannerson, Alexander H. Stephens, 1859 ·
  Library of Congress"). Flow engravings: `Illustration · <what it shows>`. Later prints: say "later lithograph, 1889".
- **Engravings from Flow** (`img/gen/*.jpg`, 1376x768 or cropped; use sizeOf): show with `Engraving` (full frame, slow push, soft
  fade in/out), never as a card, so an illustration never passes for a source.
- **Full Harper's pages** (`hw_*`, `iln_*`, about 4100x5700) are whole newspaper pages: always crop to the engraving (CropCard or
  Photo with fx/fy/zoom), never show the whole grey page full frame unless it's a "here's the newspaper" beat.
- Cuts 1 frame before the word; whoosh per cut; stamp per Highlight; marker 2 frames before each Note (`Sounds` in bs.tsx, or the
  pattern in the template Ch01). Scenes 4 to 12 s. Titles at least 2 s on screen. No text off the frame (x 60…1860, y 40…1040).
- **Point with words:** when the narration says "Look at this" / "Look at Georgia's" / "Now look at", a mark lands on that thing.
- **Vocab** (`{braces}` in the script): Highlight on the term + `Definition` bar 8 to 10 frames later.
- **Music** (`public/music/`, already copied): `ChapterShell music={[{src: 'music/x.mp3', volume, from?, to?, startFrom?}]}`.
  Levels from the library: Suno/ElevenLabs cues are quieter (see per chapter).
- **Maps:** the Civil War base map is `public/maps/civwar1861.json`; **`src/MapTest.tsx` has three finished beats to reuse**
  (A `Secession`, B `Anaconda`, C `Forward`): copy the component into your chapter, change the frame numbers to `t.at(...)` anchors.
  Map rules: Union bone tiles low, border states grey, Confederacy coral slabs rising; teal lines lifted above slabs (`z`);
  labels stand up; keep tags out of the top 25% (fog).
- **Checks before you finish** (only your chapters): `npx tsc --noEmit -p .` (ignore errors in other agents' files),
  `python3 tools/anchors.py <stem> --src src/ch/ChNN.tsx`, stills
  (`REMOTION_CHROME=$(ls -d /opt/pw-browsers/chromium_headless_shell-1194/*/headless_shell | head -1) node tools/stills.mjs ChNN out/<you>/ 3 9 …`
  then `python3 tools/sheet.py out/<you>/sheet_chNN.jpg out/<you>/ChNN_*.jpg`), look at the sheet with the Read tool, and
  `REMOTION_CHROME=... node tools/probe_text.mjs ChNN 10`. Other agents share the machine: one stills run per chapter per round,
  10 to 14 stills max per run. Fix what you see. **Don't render videos.**

## ch01 · Cold Open (55 s) → channel intro → title card

Keep the template Ch01's shape (cold open → `ChannelIntro` → title card). Replace its demo scenes. Hook-first: frame 0 is Stephens, camera already moving.
1. 0 → "His name was": `Photo`/`Parallax` of `ch01/stephens_portrait_vannerson_1859.jpg`, mask `stephens`, push in; Note "the Confederacy's vice president" on "vice president"; Highlight "1861" or a white Note "why his new country existed".
2. "His name was Alexander Stephens" → Highlight "ALEXANDER STEPHENS"; "The Confederacy was the new country…" → a quick Note; "{cornerstone}" → Highlight CORNERSTONE + Definition "the stone at the bottom of a building that holds everything else up"; drawn teal cornerstone block (a simple hand-drawn block with "SLAVERY" in it) stamping on "was slavery".
3. "Seven years later" → desk: DropCard of `stephens_constitutional_view_title_page_1868.jpg` beside a plain card of `stephens_portrait_brady_c1870.jpg` (older Stephens, no mask); Note "1868". "slavery was just the spark" → Note; "the rights of the states" → orange Note "states' rights".
4. "Same man. Two different stories." → split: young Stephens (left, 1861 card) vs old Stephens + book (right), labels "1861: slavery" / "1868: states' rights". "Funny how losing a war can change your memory." → coral Note "funny how that works".
5. "So here's the question" → the question on the desk (Notes): "why did 11 states leave?" and "why did everyone expect a short war?".
6. "We'll come back to Stephens. And to a crowd…" → `Engraving` `img/gen/v1_ch07_spectators.jpg` (Flow) briefly, Note "a picnic?".
Then `ChannelIntro` and the title card: background `ch05/bombardment_fort_sumter_engraving_apr1861.jpg` dimmed (instead of the template's map). Music: `r_cold_open` 0.15 from frame 0, dipping to 0 by the end of narration (template comment shows how).

## ch02 · One Election (59 s) · music `j_campaign` 0.13
- "November 1860. Abraham Lincoln wins" → `Parallax`/`Photo` Lincoln (`ch02/lincoln_campaign_portrait_grozelier_1860.jpg`, mask `lincoln`), Highlight "1860".
- "keep slavery out of the western territories" → a white Note "territories = land out west, not yet states" over `ch02/dividing_the_national_map_cartoon_1860.jpg` or the 3D map with the western territories hatched. "Not end slavery… Just stop it from spreading." → two Notes: "✗ end it" struck, "✓ stop it spreading".
- "slavery that couldn't grow would slowly die" → Note.
- "he wasn't even on the ballot in ten Southern states" → **3D map** (MapTest `Secession` camera, wide): the 10 states (SC, GA, FL, AL, MS, LA, TX, AR, TN, NC) grey with a stand-up "no Lincoln ballots"; Count 10.
- "Imagine winning class president…" → light, wry: a drawn teal ballot box / tally Note "0 votes from half the school" (keep it simple, Note + Arrow).
- "December 20th, South Carolina votes to leave" → `ch02/sc_ordinance_of_secession_printed_1860.jpg` as Doc with a Loop on the title, or `secession_hall_circular_church_c1860.jpg`; Highlight {SECESSION} + Definition.
- "By February… seven states are gone" → **3D map** MapTest beat A, first part only (the first seven rise; Montgomery pin); Davis on "Jefferson Davis" (`ch02/davis_portrait_brady_1859.jpg`, mask `davis`, a CropCard over the map or a cut).
- "Lincoln won't take office until March… He hadn't done anything yet." → Lincoln again with a calendar-style Note "Nov → March: still not president" and the coral punchline Note "he hadn't done anything yet".

## ch03 · In Their Own Words (84 s) · QUIET · music `g_pyramid` 0.22
- "Several states wrote out their reasons" → desk with three DropCards: Georgia journal p1, Mississippi cover, SC cover (`ch03/…`). "official breakup letters" → white Note (gentle; quiet chapter allows a plain aside but no joke styling).
- "Georgia's opens with ten years of…" → `Doc` of `ch03/georgia_declaration_of_causes_journal_p1_1861.jpg` with a teal (quiet) swipe on the quoted line (find the line with `python3 tools/text_lines.py <img>`; the line is near the bottom of the page per IMAGES.md). "Translation: the complaint is slavery." → Note.
- "Mississippi's is even more direct" → `Doc` of `mississippi_declaration_p1_slavery_line_1861.jpg`, swipe "Our position is thoroughly identified with the institution of slavery" (paragraph 2). Translation Note.
- "{states' rights}" → Highlight + Definition.
- "South Carolina's declaration complains…" → `Doc` `sc_declaration_immediate_causes_p8_nullify_laws_1860.jpg`, swipe "have enacted laws which either nullify the Acts of Congress". "*their own* states' rights" → Note with the irony stated plainly (no joke).
- "Stephens gives his speech in Savannah" → Stephens portrait (ch01 file, quiet: trace only, no coral) + `Quote` "natural and normal condition"; Highlight {CORNERSTONE SPEECH} + Definition.
- "After the war, the story changed" → `davis_rise_and_fall_title_page_1881.jpg` + the Stephens 1868 title page as two cards; "spread through monuments and schoolbooks" → `confederate_monument_unveiling_arlington_1914.jpg` (Photo, tag with year); `ucv_reunion_veterans_1900.jpg`. Highlight {LOST CAUSE} + Definition.
- "A good rule for history: evidence from the moment usually beats stories told afterward." → a clean two-column drawn card: "1861: what they said" vs "after the war: what they remembered", the 1861 side underlined.

## ch04 · Which Georgians? (25 s) · QUIET · music continues `g_pyramid` or `r_dix` (first 45 s) 0.13
- "Georgia holds a convention" → `milledgeville_state_house_engraving_white_1854.jpg` (crop to the engraving) or `georgia_convention_opens_milledgeville_jan16_1861.jpg`; Definition {convention}: "a special meeting of delegates elected to make the decision" (it's not in braces; use a white Note instead).
- "The vote is 208 to 89" → `georgia_convention_vote_208_89_journal_1861.jpg` Doc, Loop on "yeas 208; nays 89", Stamp "208 to 89".
- "who chose those delegates. White men. No women. And no one who was enslaved… 44 percent… Almost half." → a drawn 100-figure grid (Person figures or simple dots): 56 bone, 44 dimmed with "enslaved: no say", plus a note about women; Stamp "44%". Background: `slave_population_map_coast_survey_1861.jpg` dimmed.
- "*which Georgians?*" → hold on the grid, one white Note "which Georgians?".

## ch05 · Fort Sumter (77 s) · music `m_war_drums` 0.17 (peaks ~50 s in: start it so the peak lands on "They did.")
- "In Charleston Harbor sits Fort Sumter" → **3D map** push to Charleston (Pin3 Fort Sumter), or `hw_charleston_harbor_forts_map_dec29_1860.jpg` cropped to the plan.
- "running out of food" → `Engraving` `img/gen/v1_ch05_last_rations.jpg` (Flow).
- "If he sends warships… If he does nothing…" → two-views split: "send warships → looks like he started it" / "do nothing → lose the fort".
- "Only food." → Note; "handing the Confederacy a match" → light coral Note "your move".
- "They did. On April 12th, 1861" → `bombardment_fort_sumter_currier_ives_1861.jpg` or the Harper's engraving; Highlight "APRIL 12, 1861" (no dash). Anderson (`anderson_portrait_engraving_1861.jpg`, mask `anderson`) on "the fort surrenders"; `fort_sumter_interior_after_surrender_apr1861.jpg`; Note "no one killed in the bombardment".
- "75,000 volunteers" → Stamp 75,000; Highlight {BLOCKADE} + Definition; "Normally, that's Congress's call" → Note; "calls it back for July 4th" → Note.
- "tips four more states… That makes eleven." → **3D map** MapTest beat A second half (upper South rises, count to 11). "{border states}" → the four grey tiles + Highlight + Definition; "Hold onto that." → white Note.
- "So who decided on war?" → two-line summary card: "fired first: the Confederacy" / "answered: the president (Congress later)".

## ch06 · Sizing Up the Sides (75 s) · music `r_schools` 0.15 (light; ends with the subscribe line)
- "On paper, the North" → `StepBars`-style chart from `charts.tsx` (three paired bars: people 22M vs 9M, factory output 90% vs 10%, railroad track 70% vs 30%), bone vs coral, each bar landing on its spoken number.
- "Three reasons" → a 1/3, 2/3, 3/3 counter (Notes). "a tie goes to the South" → white Note with a simple drawn scoreboard "TIE = SOUTH WINS". "on its own ground" → Note. "leaders… Robert E. Lee" → Lee (`lee_full_length_vannerson_c1864.jpg`, mask `lee`); "He turned it down to go with Virginia" → Note.
- "{King Cotton}" → `cotton_shipment_savannah_1865.jpg` (tag "1865"); Highlight + Definition; "textile mills" → Note; "Hold that thought, too." → white Note.
- "squeeze… {Anaconda Plan}" → **3D map** MapTest beat B (blockade dots, the river, the split), then cut to `scotts_great_snake_elliott_1861.jpg` (the real 1861 cartoon map, Photo push) with Highlight ANACONDA PLAN + Definition "after the snake that crushes its prey". Scott as a plain card if time allows (no mask).
- "People wanted something faster." → Note.
- Subscribe: small teal Note "subscribe ↓" near the bottom on "hit subscribe"; coral Note "(unlike the Anaconda Plan)".

## ch07 · A Picnic at Bull Run (48 s) · music `j_campaign` 0.12 for the first half, cut on "Then Confederate reinforcements" to `m_war_drums` (from ~40 s in) 0.15, music drop on "*This is not going to be quick.*"
- "Forward to Richmond!" → **3D map** MapTest beat C (Washington, Richmond, about 100 miles) with the title.
- "they have company… ride out from Washington to watch" → `Engraving` `img/gen/v1_ch07_spectators.jpg` with the `spectator` mask traced (the man with opera glasses). "Some reportedly bring picnic baskets." → Loop on the basket.
- "Look at this. War, as a day out. Basically a tailgate…" → coral Note "basically a tailgate".
- "Then Confederate reinforcements arrive by train" → `waud_burnside_brigade_bull_run_jul21_1861.jpg` → `hw_retreat_of_our_troops_bull_run_aug10_1861.jpg` (crop) → `Engraving` `img/gen/v1_ch07_retreat.jpg` on "Soldiers run right into the spectators".
- "Nearly 5,000 men" → Stamp "nearly 5,000"; "*This is not going to be quick.*" → hold on the `iln_stampede_from_bull_run_aug17_1861.jpg` crop, Note.

## ch08 · What They Walked Into (82 s) · QUIET · music `a_civil_war` (startFrom its somber second half, ~40 s) 0.17
- "young farmers" → `union_soldier_with_rifle_musket_portrait_c1861.jpg` (mask `union_soldier`, trace only) beside `confederate_soldier_with_musket_portrait_c1861.jpg` (mask `confed_soldier`, trace only) as two cards.
- "rifled musket… spiral grooves… like a football thrown in a tight spiral" → `springfield_rifle_musket_m1863_plate_1863.jpg` crop + a **drawn diagram**: a barrel cross-section with spiral grooves and a bullet path that spins (teal), vs a smoothbore ball wobbling (white). Highlight {RIFLED MUSKET}, {MINIÉ BALL} + Definitions. "several times farther" → `heth_target_practice_bullet_trajectory_1858.jpg` crop or a drawn "100 yds vs several times farther" bar.
- "long lines of men, shoulder to shoulder" → `heth_target_practice_soldiers_aiming_plate_1858.jpg` crop; Note "new weapons, old tactics".
- "Disease was. Camps were filthy." → `union_camp_2nd_vermont_camp_griffin_1861.jpg`, `camp_cooking_army_potomac_1865.jpg`; "Doctors didn't know germs existed" → Note.
- "{amputation}" → Highlight + Definition (no surgical imagery); `savage_station_field_hospital_gibson_1862.jpg` only if nothing graphic shows at full size (check), otherwise `union_camp_cameron_georgetown_may1861.jpg`.
- "an estimated 750,000… two out of every three died of disease" → Stamp 750,000; a drawn 3-figure row with 2 marked "disease".
- "Their letters home" → `soldier_letter_washington_sept29_1861.jpg`, `mother_letter_to_confederate_sons_c1861.jpg` as cards.
- "At Andersonville… about 13,000" → `andersonville_southeast_view_riddle_aug1864.jpg` Photo, slow; Stamp 13,000; long hold.

## ch09 · Back to Stephens (41 s) · music `r_ending` 0.15 · end screen
- "why did eleven states leave? The people who left told us: slavery." → the Stephens portrait again (same framing as ch01, coral back on) + the three declaration cards from ch03 small.
- "Seven states left before he took office, four more…" → **3D map** quick: 7 then 11 (reuse ch05's beat).
- "Each side counted its own strengths" → two-column card: North (people, factories) / South (generals, home ground, King Cotton). "Then came Bull Run." → cut to `Engraving` `v1_ch07_retreat.jpg`.
- "After the war, Stephens told a different story. But in 1861, he told us exactly what his new country was for." → the ch01 split (1861 vs 1868), the 1861 side gets the Loop.
- "The war had started. Nobody knew yet what it would end." → `Engraving` `v1_ch05_last_rations.jpg` or the Fort Sumter print, hold.
- "Thanks for watching… Subscribe" → **end screen** (copy `Mexican_American_War/src/ch/Ch10.tsx`'s EndScreen: drawn slots for YouTube's end-screen elements, ~15 s, music only after the voice).
