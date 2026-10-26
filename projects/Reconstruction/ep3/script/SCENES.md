# Episode 3 scenes: the brief

Every chapter is `src/ch/ChNN.tsx`, timed to the voiced narration in `public/audio/chNN_*.words.json` (Ellis, natural
speed, final; ch01, ch04 and ch07 voiced with longer pauses). The model for how a chapter is built is Episode 2
(`../ep2/src/ch/`): read `Ch05.tsx` and `Ch09.tsx` (and its helper `ch09_cycle.tsx`) first, and Episode 1's `Ch06.tsx`
(the approved Vox test). Each `src/ch/ChNN.tsx` is now a placeholder (the narration over the board): replace it.
Script: `SCRIPT.md` (the narration, fact-check flags, production notes). Pictures: `public/img/IMAGES.md` (best picks,
what each file shows, content flags, gaps). The board plan: `../../WALL.md`.

## Rules for every chapter

**The look.** Black-and-white archival pictures and documents on the dark desk (`DarkPaper`), film grain and vignette
(the shell adds them), marks stepping at 12 fps (`useGFrame`), smooth camera moves. One subject per picture in coral
with a teal trace (masks below); everything else B&W. Orange torn-tape titles (`Highlight`) for terms and big moments,
at least 2 seconds on screen. Hard cuts only (`useScene`, each with a whoosh); no dissolves.

**Notes go on paper slips** (`Slip` from `kit/rc`), never bare handwriting over a picture: cream with dark-teal ink, or
`coral` for the subject or the punchline. Bare `Note` only on empty dark desk, sparingly.

**Safe margin.** No title, slip or note inside the outer 5% of the frame (96 px left/right, 54 px top/bottom). The
source tag (`Tag`) is the one exception. Check with the text probe (below).

**Every picture gets a source tag** (`Tag`): `Title, date · Institution`, from `public/img/IMAGES.md` /
`credits_ep3.json`. Engravings and later images say their date ("1867", "c.1862") so nothing passes for an eyewitness
view it isn't.

**The Vox toolkit** (`src/kit/rc.tsx`, re-exporting `src/kit/vox.tsx`), as used in `Ch06.tsx`:
- `DocShot` / `Sheet` + `camAt`: a page on the desk, the camera reading along it, optionally laid back in 3D with a
  depth-of-field band (`tilt`, `dof`, `band`, `dofY`).
- `Swipe`: the coral highlighter along printed or handwritten lines, at reading speed (`from`/`to` = the spoken words).
  Line boxes are source pixels: from the `.json` beside each newspaper crop (`phrases`), or measured by eye
  (`EDISTO` in rc.tsx for the Edisto documents). Check a box by drawing it on the image before using it.
- `Spot`: everything dark except the boxes. `FocusIn`: rise into focus on arrival. `carry`: motion carried through a
  cut. `Tear`: one page tears away to reveal the next. `WordRun`: the word match cut.
- `PhotoShot`: a creased print (`img/wall/cr_*.png`) on the desk, focusing in. `Win`: a torn window onto part of a page.
- `Counter`: "STEP 1/3" top right.
- Template kit too: `Photo` (full-bleed with tint and trace), `CropCard`, `Definition` (vocab bar), `Quote`, `Stamp`,
  `Highlight`, `Arrow`, `Loop`, `Map3D` (see the skill's `references/building-scenes.md` cheat sheet).

**Tint strength.** On photographs the coral tint runs at 0.6 (`Photo` defaults to it; pass `strength={0.6}` to a bare `Tint`, or `tintStrength` to `CropCard`): full strength turns a portrait solid coral. Engravings can take 1.

**Vocab.** Every `{term}` in the script gets a `Highlight` on the word and a `Definition` bar 8–10 frames later (or, when
the picture is busy, a `Slip`). Terms per chapter are listed below.

**The board** (`src/kit/ep3board.tsx`, the series board: Episodes 1 and 2 are all on it already). Every chapter ends on
it: cut to `<SeriesBoard ch={N} from={cutFrame} at={landFrame} />`. This chapter's pieces land from `at` (about 2 seconds
of arrivals); the camera starts close on them and settles on them with some of the board around. Rules:
- On screen **4–6 seconds**. Cut to it on the chapter's last sentence or the one before; land the pieces on the last
  line's key words. If the narration ends too soon after the landing, add `extra` frames to `ChapterShell` (up to 60)
  and the same to `CHNN_FRAMES` (Episode 1's `Ch06.tsx` does this).
- **Never name it** in text either: no "board", "wall", "case", "evidence".
- Don't move pieces in `ep3board.tsx` (or `ep1board.tsx`/`ep2board.tsx`); if a position looks wrong in your chapter, say so in your report.
- You may pass `cam` (keys `[frame, centreX, centreY, zoom]` in board px) when the default end shot doesn't suit your chapter;
  check that nothing is sliced at the frame edge with `node tools/boardfit.mjs <ch> <cx> <cy> <zoom>` (prints the pieces a framing cuts).

**Heavy chapters: ch01, ch04, ch07** (Caldwell's death, Colfax, Clinton). Plain: no jokes, no punch-ins, no coral
punchline slips, fewer marks, longer holds, sparse music. **No picture of the killings**: the cellar and the street are told,
not shown (no AI image, no reconstruction of the shooting). Engravings of the dead (Colfax) only at a distance, never a
close-up on a body. Hold a beat of silence after the lines the script marks (ch01 "Never say you killed a coward.", ch04
"Nobody was ever punished for Colfax.", ch07 "From people like Charles Caldwell."): the narration already has the pause;
don't fill it with motion or sound.

**Propaganda and caricature.** Files named `PROPAGANDA_` are racist or Lost Cause images: show one only as evidence, briefly,
dimmed or windowed, with a slip that says what it is ("a racist broadside, c. 1867"), never full screen without a label.
Engravings with caricatured figures (the Asheville registration's right edge, some faces in "Electioneering"): frame
them out.

**No speed-up.** The narration plays at its natural speed (the user's rule): never stretch audio.

**Episode 2 callbacks** are in `public/img/ep2/` (the blacksmith stand-in and `cr_blacksmiths.png`, Caldwell's line on the 1868
convention roll, his "yea" on the 15th, the 15th's joint resolution, Revels, Ames as senator and as general (`cr_ames_general.png`),
the 1870 Senate roster, "Electioneering at the South"). The wall prints (`img/wall/`) have `firstvote.jpg`, `senators.jpg`,
`fifteenth.jpg`, `stevens.jpg`, `acres.jpg` and the creased board prints.

**Episode 1 callbacks** are in `public/img/ep1/` (the three words, the petition pages, the 13th Amendment, the
Mississippi vagrant act, the Savannah minutes, Field Order 15, Moore's Edisto photo) and `img/wall/cr_*.png`.
`rc.tsx`'s `EDISTO`, `THREE_WORDS`, `Motif` point there.

**Sound.** A whoosh on every cut after the first (0.18–0.3), `sfx/stamp.wav` on each `Highlight` and `Stamp` (0.27–0.4),
`tick.wav` on cards and pins (0.35–0.45). `Slip` makes its own sound. The board makes its own sounds.

**Music** (`ChapterShell` `music`), from `MUSIC.md` (levels in parentheses: the ElevenLabs `rc_` cues are quiet, so
they sit higher). Cues are in `public/music/`; period recordings, normalised to −16 LUFS, in `public/music/period/`. A
sung period record never plays under narration: only before the first word (`from` negative is not allowed; start
the narration later instead, as `../ep2/src/ch/Ch04.tsx` does) or after the last.

**Anchors.** `t.at('phrase', nth)` matches the voiced words; it takes the first occurrence. Run
`python3 tools/anchors.py chNN_slug --src src/ch/ChNN.tsx` after wiring a chapter.

## Checking (before you report)

1. `npx tsc --noEmit -p .`
2. `python3 tools/anchors.py chNN_slug --src src/ch/ChNN.tsx`
3. Stills: `node tools/stills_many.mjs out/chNN ChNN:3.5,9,15,...` (seconds of the composition, which starts with a
   44-frame logo lead: add 1.47 s to narration times; half-size JPEGs), then
   `python3 tools/sheet.py out/chNN_sheet.jpg out/chNN/*.jpg` and **look at the sheet**. Pick seconds just after each
   anchor so the write-ons have finished. Look for: text over faces or over other text, slips over the subject, tints
   gone flat, empty frames, anything cut off at the edge, tags missing.
4. Text probe: `SAFE=96 node tools/probe_text.mjs ChNN 10 2>&1 | grep -v "PROBECOUNT\|emory"`. Fix every hit.
5. Masks: `python3 tools/mask_closeup.py <name>` for any mask you show large.

Only edit your own `src/ch/ChNN.tsx` files (and new files named `src/ch/chNN_*.tsx` if a chapter needs helpers). Shared
files (`kit/*`, `masks.ts`, `ep1board.tsx`, `ep2board.tsx`, `ep3board.tsx`, `chapters.ts`) are read-only for you: if you need a change there, describe it
in your report. Delete your `out/` scratch folders when done (the disk is small).

## Masks (shared, in `src/masks.ts`)

New for Episode 3: `grant1869` (ch03 `grant_president_portrait_1869.jpg`), `grant1873` (ch03 `grant_president_1873.jpg`: a
crack runs across the plate; crop to half-length or keep it small), `ames_miss` (ch07 `ames_hon_adelbert_ames_of_miss_brady_handy.jpg`,
head and upper body), `ames_gen` (ch07 `ames_maj_gen_brady_1860s.jpg`), `pierrepont`, `douglass` (ch06 `douglass_brady_1877.jpg`),
`babcock`, `hayes`. **Tilden has no mask** (an engraving that doesn't separate): show him as a plain print, or as a coral-tinted
`CropCard` without a trace. From Episode 2: `ames` (`img/ep2/ames_senator_brady_handy.jpg`), `revels` (`img/ep2/revels_brady_handy_1870.jpg`).
Use with `Photo`/`CropCard` `mask={MASKS.x}`.

## The board in Episode 3 (`src/kit/ep3board.tsx`)

`<SeriesBoard ch={N} from={cut} at={land} />` as before. Episode 3's pieces fill a third row and the lower half of the
PROTECTION column; the column names change as the story ends: a teal ✔ by PROTECTION (ch03), the header tears in two in
ch07 (the ✔ falls), VOTELESS is written back in coral on the three words (ch09), and in ch10 LAW is stamped ON PAPER, LAND
is struck through and PROTECTION's torn half falls. Those marks (kind `fade`) are far from the chapter's pieces, so the
default end shot frames the pieces only: ch03 and ch09 pass their own `cam` to show the mark first (below). Each piece's
`dt` is in the table at the top of `ep3board.tsx`.

## Chapter plans

Anchor times below are narration seconds (add 1.47 for the composition). The heavy chapters are ch01, ch04, ch07.

### ch01 · A Christmas Drink (cold open; built by the main session)

### ch02 · The Night · terms: Ku Klux Klan, terrorism (as a Highlight, no Definition bar needed: the narration defines it)
- Recap (about 20 s, "Last time…"): quick cuts, each on its phrase: "the army back into the South" (`img/ep2/cr_ames_general.png`
  or the wall's `cr_districts.png` as a `PhotoShot`), "Black men voted" (`img/wall/firstvote.jpg`), "about 2,000 of them held
  office" (`img/wall/senators.jpg`, a `Counter`-style "≈ 2,000" slip), "The 15th Amendment" (`img/ep2/fifteenth_amendment_joint_resolution_1869_nara.jpg`,
  swipe nothing, just the page), "most freedpeople still didn't own land" (the `Motif` with LANDLESS circled in teal), "two
  things: votes, and the soldiers who protected them" (two slips side by side: "votes" / "soldiers").
- "Somebody had already figured out how to attack both": dark desk, the two slips get a coral ✕ each, or a hard cut.
- 1866, Pulaski, six veterans: no picture exists (IMAGES.md gaps). A drawn Tennessee locator (map like Ep 1/2 `ch02_maps.tsx`, a pin
  "Pulaski, Tennessee") with slips "1866", "six Confederate veterans", "a club".
- "Ku Klux Klan": Highlight + Definition ("a secret society started in 1866 to keep Black Southerners from using their freedom by terror").
  `two_members_ku_klux_klan_disguises_harpers_1868.jpg` cropped to the top engraving only (the lower one is an English riot):
  "in masks and robes".
- "whipped, burned and killed. Their targets were…": `memphis_riot_burning_freedmens_school_house_harpers_1866_crop.jpg` with a
  tag that says what it is (**Memphis riot, May 1866: a white mob, not the Klan**) and the list as slips stacking: "Black
  voters", "officeholders", "teachers", "churches", "white Republicans".
- "Night mattered": `visit_of_the_ku_klux_harpers_1872.jpg` (the board's card): slow push on the lamp and the doorway; slips
  "under slavery: patrols on the roads after dark", then "since freedom: church, political clubs, family" (callback: Ep 2's
  `img/ep2/electioneering_at_the_south_harpers_1868.jpg`, briefly, for the political clubs). "The Klan wanted the night back":
  coral slip.
- "Keep Black men from voting, and the Republican governments would fall": a simple drawn chain of slips (no votes → no
  Republican governments), teal arrow.
- "This was terrorism": Highlight TERRORISM; the definition as a Definition bar (the narration's words). "Congress's own
  record of it": `ku_klux_report_joint_select_committee_title_1872.jpg` (13 volumes) behind it.
- Board: cut on "And it worked", land on "at first".
- Music: `rc_night_riders` (0.2).

### ch03 · Protection · terms: Enforcement Acts, habeas corpus
- "Then the federal government hit back": hard cut, Grant (`grant1869` mask, `Photo`).
- Enforcement Acts: `yorkville_enquirer_1871-10-26_the_enforcement_act_text.jpg` (slow pan down the column; swipe the
  "without distinction of race, color, or previous condition of servitude" lines if you can measure them) + Highlight +
  Definition. "Ku Klux Klan Act": `ku_klux_klan_act_statutes_at_large_p13_1871.jpg`, swipe the "by force, intimidation, or threat"
  lines. Slips: "a federal crime", "the army can be used".
- "In October 1871 … nine counties": `asher_adams_1874_south_carolina_counties_crop.jpg`, the nine counties lighting up one by
  one as the proclamation names them (Spartanburg, York, Marion, Chester, Laurens, Newberry, Fairfield, Lancaster,
  Chesterfield): find them on the map by eye and mark with teal outlines or pins + labels (Marion and Chesterfield are on the
  coast side; if one isn't on this crop, a slip "Marion (off the map)"). Then the proclamation's own words:
  `yorkville_enquirer_1871-10-26_proclamation_now_therefore_nine_counties_us_grant.jpg`, swipe "suspend the privileges of
  the writ of habeas corpus" and "U. S. GRANT". (The headline crop `…_proclamation_habeas_corpus_suspended.jpg` can lead in.)
- habeas corpus: Highlight + Definition ("the right not to be held in jail without being charged with a crime"); slip "suspended:
  the army can arrest and hold".
- Arrests: `…_arrests_of_citizens_york_county_part1.jpg` then the names column (`…part2_names.jpg`) as a long scroll; slips
  "hundreds arrested", "hundreds more confessed". "Federal courts held trials": `ku_klux_trials_columbia_sc_proceedings_title_1872.jpg`.
- "largely broken": `mississippi_ku_klux_captured_disguises_harpers_1872.jpg`, tag "Captured Klansmen, Mississippi, 1872"
  (it's Mississippi, not South Carolina: the tag must say so).
- "Hold onto that … it worked": a held beat; coral slip "with real force, it worked".
- **Board: cut on "On the card" (54.8 s), `at` = `t.at('check')` (the ✔ lands on "check mark"; the proclamation lands 30
  frames later, on "The question").** Pass `cam`: start on the PROTECTION header and the ✔ (about [2250, 120, 1.4]), then
  move down to the proclamation and "Klan broken" (about [2900, 1120, 1.25]) by `at + 40`, hold. Check with `tools/boardfit.mjs 3 …`.
- Music: `w_dawn` (0.14), the swell under "largely broken".

### ch04 · Colfax (heavy) · terms: Colfax Massacre
- 1872 Louisiana: "both sides claimed to have won the state": two slips ("Republicans: we won", "Democrats: we won") on the
  map `asher_adams_1874_grant_parish_colfax_crop.jpg` (a pin on Colfax, "Grant Parish, Louisiana").
- Easter Sunday 1873: plain slips ("Easter Sunday, 1873"; "Black men, some Union veterans, guarding the courthouse"; "a white
  militia, with a cannon"). There's no picture of the courthouse (it burned): use a drawn plan (a simple courthouse outline in
  teal line on the dark desk, the guards as small marks, the militia's line closing in) or just slips on the map. No picture of
  the killing.
- "How many died? We don't know exactly. At least 60. Possibly more than 150": a drawn range bar (60 ……… 150+) in teal, the
  numbers set plainly. Then `louisiana_murders_gathering_the_dead_colfax_harpers_1873_crop.jpg` (*Harper's*, May 10, 1873,
  women and children bringing in the dead), wide, slow, tagged; **no close-up on bodies**.
- "Colfax Massacre": Highlight + Definition.
- Prosecution: slip "federal charges, under the Enforcement Acts". The Supreme Court: `us_v_cruikshank_92us542_first_page_1876.jpg`
  then `us_v_cruikshank_92us554_equal_protection_states_only_1876.jpg`: swipe "prohibits a State from denying" (on "stops
  *states*") and the "against another" line (it runs onto p.555, `…555_1876.jpg`: a `Tear` from 554 to 555 works).
- "That means it was up to the state of Louisiana to punish the mob. The same state where the mob had won": a slip pair, the
  second coral-free (heavy chapter: no punchline coral).
- "Nobody was ever punished for Colfax": hold on the dark desk or the engraving; silence after it.
- Optional (only if it fits the time): Nast's "The Union as it was" (`nast_union_as_it_was_white_league_kkk_1874.jpg`) is
  **caricature**: skip it in this chapter.
- Board: cut on "Nobody was ever", land on "punished for Colfax". The string from *Cruikshank* to the 14th Amendment is cut
  (its ✕ tag sits by the Cruikshank piece).
- Music: near-silence, then `j_grief` (0.12) from the Supreme Court beat.

### ch05 · Tired · terms: Panic of 1873, Whiskey Ring, Civil Rights Act of 1875
- "Meanwhile, up North": hard cut. The Panic: `panic_1873_jay_cooke_office_wall_street.jpg` ("one of the country's biggest
  banks collapsed": slip "Jay Cooke & Co., Sept. 1873"), `panic_1873_closing_stock_exchange_leslies.jpg`, `panic_1873_run_on_fourth_national_bank.jpg`.
  Highlight + Definition. "Businesses failed. Workers lost their jobs": a drawn line falling (one simple graph shape, no data
  claim: label it "the economy, 1873–79 (shape only)") or slips.
- The aside ("a fight in Louisiana feels very far away"): a quick zoom out from the Colfax engraving to a tiny card on a big
  desk next to a "your paycheck" slip. Light touch; this is the one place a dry joke is allowed.
- Scandals: Grant "honest himself" slip; Whiskey Ring: `nast_probe_away_whiskey_ring_harpers_1876.jpg` + Highlight + Definition;
  "the President's own private secretary": Babcock (`babcock` mask), tag "Orville Babcock, c.1865 (charged 1875, acquitted)".
- "Reformers … cleaning up the government. Black rights slid down their list": a drawn list on a slip where "Black rights"
  slides down under "clean government", "the economy".
- 1874: `nast_third_term_panic_harpers_1874.jpg` as "the 1874 campaign" (tag it so), and a slip "Democrats win the House: first
  time since before the war".
- Civil Rights Act of 1875: `civil_rights_act_1875_statutes_at_large_p336_inns_theaters.jpg`, swipe "inns, public
  conveyances on land or water, theaters" + Highlight + Definition. "Almost nobody enforced it": slip. "struck it down eight
  years later": `civil_rights_cases_109us3_first_page_1883.jpg`, swipe "are unconstitutional". (`shackle_broken_…_1874.jpg`
  can stand behind "one last law".)
- Board: cut on "More and more Northerners", land on "tired of solving". The subscribe line plays over the board (as
  `../ep2/src/ch/Ch07.tsx` does): a "subscribe ↓" slip on "hit subscribe".
- Music: `rc_parlor` (0.2). Tail: "Tenting on the Old Camp Ground" (`music/period/tenting_on_the_old_camp_ground_1904.mp3`,
  normalise first) after the last word, 4–6 s.

### ch06 · The Bank · terms: Freedman's Savings Bank
- "And then there was the bank": hard cut to `freedmans_savings_bank_exterior_1880s_sia.jpg` (tag: photographed in the 1880s,
  after the bank failed). Highlight + Definition.
- "believed the government stood behind it. It didn't": `colored_tennessean_1866-03-24_freedmans_saving_bank_ad.jpg`, swipe
  "THE ATTENTION OF SOLDIERS" on "Soldiers saved their pay" and "one among the best institutions in the United States" on
  "stood behind it"; coral slip "It didn't." is fine here (not a heavy chapter, but keep it plain).
- "Tens of thousands opened accounts": the Beaufort branch stereograph `freedmans_bank_beaufort_sc_1863.jpg` (tag "c.1865–74":
  LOC's 1863 is wrong). Slips: "soldiers", "churches", "families", "a few dollars at a time", then "Forty acres, maybe" with a
  quick callback to Field Order 15 (`img/wall/cr_acres.png` as a `PhotoShot`).
- "risky loans, some to their friends": slip.
- Douglass: `douglass` mask on `douglass_brady_1877.jpg` (tag c.1877); slips "president, 1874", "$10,000 of his own".
  `douglass_letter_freedmans_savings_bank_letterhead_3jul1874_nmaahc.jpg` for "Within months, the bank closed" (swipe his
  signature "Fredk. Douglass, Prest." if you can find it).
- "More than 60,000 depositors were owed almost 3 million dollars": two big numbers counting up (`Counter`-like), plainly.
- "only about half … ever paid back": the dividend check `freedmans_bank_commissioners_dividend_check_1878.jpg`, swipe "Sixteen
  Cents"; slip "a dividend check, 1878: sixteen cents". A half-filled bar ("about half repaid, over years") is fine.
- Board: cut on "For a lot of families", land on "gone at once".
- Music: `rc_parlor`, second half (start it at about 0:45 into the cue with `startFrom` if the shell supports it; otherwise
  `rc_parlor` at 0.18).

### ch07 · Mississippi, 1875 (heavy, ★) · terms: Mississippi Plan, Redeemers, Redemption
- "Which brings us back to Mississippi": the Mississippi half of `asher_adams_louisiana_mississippi_map_1874.jpg`, then
  `asher_adams_1874_hinds_county_clinton_jackson_crop.jpg` (pins: Clinton, Jackson, Edwards, Vicksburg).
- "by any means necessary … Armed clubs": the Frost cartoon `frost_of_course_he_wants_to_vote_democratic_harpers_1876.jpg` is
  **caricature + a threat, dated 1876**: show it windowed (`Win`) with a slip "a Republican cartoon of 1876 against the
  shotgun policy". Mississippi Plan: Highlight + Definition.
- The Clinton rally: `national_republican_1875-09-09_mississippi_massacre_headline.jpg`, then **Caldwell's own words**:
  `national_republican_1875-09-09_statement_of_senator_caldwell.jpg` (swipe "an audience of over two thousand"); slip
  "Charles Caldwell's town". "At least eight people died, including three white men"; "between 30 and 50 were killed": plain
  numbers, no imagery of the killing.
- Ames: `ames_miss` mask on `ames_hon_adelbert_ames_of_miss_brady_handy.jpg`; callback slip "the carpetbagger from Maine"
  with a quick flash of Ep 2's senator portrait (`img/ep2/ames_senator_brady_handy.jpg`, mask `ames`) for "Jefferson Davis's
  old Senate seat".
- **Telegrams as texts** (the series' new technique): a dark phone-sized column on the desk, or simply the desk, with the
  messages stacking like a thread, each a cream telegraph slip in a typewriter face: (1) Ames → Grant, Sept 7: "Domestic
  violence in its most aggravated form exists in certain parts of this State…" (2) Ames, Sept 8: "OFFICIAL CALL FOR FEDERAL
  ASSISTANCE" (3) the reply, from the right side: "The whole public are tired out with these annual autumnal outbreaks in the
  South…" (Grant, quoted by the attorney general, Sept 14). Tag each: "text as printed in the *National Republican*, Sept 9,
  1875" / "*New York Herald*, Sept 17, 1875". Then the real Herald column `ny_herald_1875-09-17_tired_out_column.jpg` with the
  coral swipe on "tired out" and "annual autumnal outbreaks" (boxes in its `.json`). Pierrepont (`pierrepont` mask) small, as
  "Grant's attorney general". "Translation: the North was done": a plain slip.
- The militia: slips on the Hinds County map ("Ames raises a militia", "Caldwell leads a company", a teal path to Edwards,
  "delivering guns"); "To many white Democrats, that marked him": a hold.
- "peace deal … disbanded": slip; "Democrats swept Mississippi … fell to almost nothing": words only: **no numbers on screen**
  (fact-check flag 20 is unsourced).
- "talked into a Christmas drink": a callback to ch01's testimony page (`img/ch01/caldwell_testimony_p437_christmas_treat_1876.jpg`),
  brief.
- "His wife told the Senate why": `caldwell_testimony_p439_obeying_governor_ames_1876.jpg`, the coral swipe on "for obeying
  Governor Ames; and that was all they had against him" (boxes in its `.json`).
- Redeemers / Redemption: Highlight + Definition each ("To redeem means to save"). "From people like Charles Caldwell": hold
  on his name (the convention-roll line `img/ep2/ms_convention_journal_1868_roll_caldwell_p5.jpg`, or the wall's `cr_roll.png`),
  then silence.
- Board: cut on "From people like", land on "Charles Caldwell". The PROTECTION header tears 44 frames after `at` (a paper
  sound is built in); the string from Ames to the army is cut.
- Music: `rc_night_riders` (0.18), then `rc_brass_dirge` (0.18) from the attorney general's reply.

### ch08 · Two Sets of Results · terms: Compromise of 1877
- "only three Southern states left with Republican governments": a drawn Southern map (the Ep 1/2 `us1861.json` map) with every
  state but South Carolina, Louisiana and Florida greyed.
- Hayes vs Tilden: the two banners `grand_national_republican_banner_hayes_1876.jpg` / `…democratic_banner_tilden_1876.jpg`,
  side by side; portraits `hayes` mask and Tilden (no mask: plain print or tinted card).
- "Tilden won more votes. But not … clearly enough": slip "more votes: Tilden". "both parties claimed": `south_carolina_deadlock_state_legislature_columbia_leslies_1876.jpg`
  (some caricature in the faces: frame wide or crop, check before close-ups) with a slip "two sets of results".
- **The electoral count as a drawn tally** (diagram): "needed 185" a line; Tilden's pile 184, Hayes's 165, and **20 disputed
  votes as a separate pile** (label "disputed: S.C., La., Fla. (and one in Oregon)"); then on "gave every disputed vote to Hayes"
  the 20 slide to Hayes: 185 – 184. Use the `StepBars`/`Counter` style from Ep 2 or draw blocks.
- The commission: `electoral_commission_secret_session_candlelight_leslies_1877.jpg`, slips "15 men", "8 – 7, along party lines".
  "For months, nobody knew": `nast_a_truce_not_a_compromise_1877.jpg` ("Tilden or Blood").
- "There's no proof of a written deal": a dashed teal line between two slips ("Hayes becomes president" ↔ "the troops stop
  propping up the last Republican governments"), tag "no proof of a written deal". Compromise of 1877: Highlight + Definition.
- April 1877: `louisiana_withdrawal_federal_troops_state_house_april_1877.jpg` (key image), slow; slips "S.C., April 10",
  "Louisiana, April 24". `hayes_oath_of_office_1877.jpg` (one half of the stereo pair) can sit before it.
- "Every Southern state … Redeemers": the map, all states now one colour.
- Board: cut on "And that's usually where", land on "Reconstruction was over". The dashed "no proof of a written deal" string is
  on the board too.
- Music: `j_intrigue` (0.15).

### ch09 · Voteless · terms: poll tax, literacy test, grandfather clause, Jim Crow
- "didn't lose everything in 1877": slips "kept voting", "some kept winning office"; "Now, nobody was": a plain slip.
- "Over the next 25 years": a timeline 1877 → 1902. "Not with a law that said 'no Black voters'. The 15th didn't allow that":
  `img/ep2/fifteenth_amendment_joint_resolution_1869_nara.jpg` briefly, then "the gaps we talked about in the last episode"
  (Ep 2 ch05's three gaps as three slips).
- Poll tax: `mississippi_constitution_1890_sec243_poll_tax_sec244_reading_test.jpg` swipe "A uniform poll tax of two dollars",
  + `poll_tax_receipt_jefferson_county_alabama_1920.jpg` (tag 1920, later). Literacy test: same page §244 swipe "be able to read
  any section of the constitution … or give a reasonable interpretation thereof"; slip "graded by white officials".
  Grandfather clause: `louisiana_constitution_1898_p79_sec5_grandfather_clause.jpg` swipe "son or grandson"; then
  `louisiana_grandfather_clause_registrations_by_race_1902.jpg`: **White 37,877, Colored 111** ("Which, in the South, meant
  white men."). Each term: Highlight + Definition. `Counter` "1/3, 2/3, 3/3".
- "In 1896 … about 130,000 … Eight years later … about 1,300": two bars with a scale shock (as SCRIPT's production note
  says): 130,344 (1896) → 1,342 (1904), a third step 12,902 (Jan 1898) optional between. Behind it `louisiana_registered_voters_by_race_1896_1902report.jpg`
  (the page has no totals row: don't show the total as if printed on it). Tag the figures "Louisiana Secretary of State reports".
- Jim Crow: `russell_lee_colored_water_cooler_oklahoma_city_1939.jpg` and `bubley_colored_waiting_room_sign_1943.jpg`, **tagged as
  later photos (1939, 1943)**; slips "schools", "trains", "waiting rooms", "water fountains". Highlight + Definition.
- "So go back to the three words": the `Motif` card: LANDLESS swiped ("Still."), HOMELESS swiped ("For many, still."), VOTELESS
  under its Ep 2 strike.
- **Board: cut on "And Voteless" (74.1 s), `at` = `t.at('Written')`.** The coral "Voteless" writes itself over the strike on the
  board's three words; the poll-tax scrap and the Louisiana stamp land 20–44 frames later at the bottom left. Pass `cam`:
  start close on the three words (about [1000, 230, 1.7]), hold through the write (to `at + 30`), then pull back to show the
  15th's "but" string down to the scrap (about [700, 1250, 0.5]). Extend the shell (`extra`) for the pull.
- Music: `rc_codes` (0.2).

### ch10 · A Few Acres (the series ending) · terms: none new
- "What does it take to make freedom real?": the question on the dark desk (the series question, as Ep 1 ch01 set it).
- "Three things. The law. The land. And someone willing to protect both": cut to the board, the three column names in turn
  (LAW, LAND, PROTECTION), camera on each.
- "Reconstruction delivered the law. The 13th … 14th … 15th": the three amendments as quick `DocShot`s (Ep 1's 13th
  `img/ep1/…`, the 14th scrap look, Ep 2's 15th `img/ep2/fifteenth_amendment_joint_resolution_1869_nara.jpg`), or travel the
  board's LAW column. On the board, ON PAPER stamps by LAW later (see below).
- "It never delivered the land. Most of Edisto Island went back… Stevens's plan died with him. … sharecropping": the wall
  prints `acres.jpg`, `stevens.jpg`, then `img/wall/cr_contract.png`.
- "protection only while the North was willing. When the army enforced the law, the Klan broke. When the army left, the law
  stayed on paper": the board: the proclamation and "Klan broken", then the troops-out stamp.
- "Was Reconstruction a failure?": two columns on the desk ("Yes" / "It built things that lasted"). "By 1900 … landless again,
  and voteless again": the `Motif`. "Schools" `primary_school_freedmen_vicksburg_harpers_1866.jpg`; "Churches": a slip (no
  picture: IMAGES.md gap); "Families that found each other" `colored_tennessean_1866-03-24_information_wanted_column.jpg` (slow
  scroll, swipe "Hannah Barnett"); "A generation of Black leaders" `heroes_of_the_colored_race_1881.jpg` (Revels and Bruce);
  "three amendments that never went away … a second founding": slip (no historian named).
- 1954: `brown_v_board_347us495_inherently_unequal_1954.jpg` swipe "inherently unequal" and "equal protection of the laws".
  1965: `voting_rights_act_1965_79stat437_enforce_fifteenth.jpg` swipe "To enforce the fifteenth amendment". (Skip the
  Johnson/King photo.) "still there, waiting": hold.
- "Remember those three men on Edisto Island? … 'A home if It be but A few acres'": the petition page 3 (`EDISTO.fewAcres` on
  `img/ep1/edisto_petition_to_president_28oct1865_p3_page.jpg`), swipe the line; the committee's names (`EDISTO.signatures`).
  "They didn't get it": hold.
- "But their country did write something down that decade … almost a hundred years": the full board pull-back: `SeriesBoard
  ch={10}` with your own `cam`: travel LAW (ON PAPER stamps), LAND (struck through), PROTECTION (its torn half falls), then
  pull all the way out to the whole board (about [1660, 1170, 0.45]; check `tools/boardfit.mjs 10 …`), and **end on the
  petition** (push in on it at the very end, top centre: about [960, 210, 1.3]). The ch10 pieces land from `at`: ON PAPER at
  dt 0, the LAND strike at dt 24, PROTECTION falls at dt 40: set `at` on "on paper" or on the pull-back, your call.
- "Thanks for watching this series … subscribe": over the board, a "subscribe ↓" slip; `BoardSignoff` (series strip and logo).
- Music: `r_ending` (0.16) under the chapter; **"Roll, Jordan, Roll" in full under the last pull-back**
  (`music/period/roll_jordan_fisk_1909.mp3`): sung records never under narration, so start it on the last word and extend
  the shell with `extra` so the pull-back and the petition hold play over it (Ep 2's `Ch10.tsx` does this at 0.42; here run
  as much of the song as the ending carries, at least 40 s, fading at the end).
