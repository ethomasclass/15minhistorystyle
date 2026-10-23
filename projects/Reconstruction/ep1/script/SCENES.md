# Episode 1 scenes: the brief

Every chapter is `src/ch/ChNN.tsx`, timed to the voiced narration in `public/audio/chNN_*.words.json` (Ellis, final).
Chapter 6 is finished (`Ch06.tsx`, the Vox motion test, approved by the user): it is the quality bar and the model for
how a chapter is built. Read it first.

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
`credits_ep1.json`. Engravings and later images say their date ("1867", "c.1862") so nothing passes for an eyewitness
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

**The board** (`src/kit/ep1board.tsx`). Every chapter ends on it: cut to `<EpBoard ch={N} from={cutFrame} at={landFrame} />`.
It already holds the earlier chapters' pieces; this chapter's pieces land from `at` (about 2 seconds of arrivals). Rules:
- On screen **4–6 seconds**. Cut to it on the chapter's last sentence or the one before; land the pieces on the last
  line's key words. If the narration ends too soon after the landing, add `extra` frames to `ChapterShell` (up to 60)
  and the same to `CHNN_FRAMES` (as `Ch06.tsx` does).
- **Never name it** in text either: no "board", "wall", "case", "evidence".
- Don't move pieces in `ep1board.tsx`; if a position looks wrong in your chapter, say so in your report.

**Heavy chapters.** ch04 (the assassination) is plain: no jokes, no punch-ins, no coral punchline slips, fewer marks,
longer holds. The Memphis/New Orleans paragraph in ch09 too (no tint on victims; images of buildings and crowds, not
close-ups of the killing).

**Sound.** A whoosh on every cut after the first (0.18–0.3), `sfx/stamp.wav` on each `Highlight` and `Stamp` (0.27–0.4),
`tick.wav` on cards and pins (0.35–0.45). `Slip` makes its own sound. The board makes its own sounds.

**Music** (`ChapterShell` `music`), from `MUSIC.md` (levels in parentheses: the ElevenLabs `rc_` cues are quiet, so
they sit higher). Cues are in `public/music/`; period recordings, normalised to −16 LUFS, in `public/music/period/`. A
sung period record never plays under narration: only before the first word (`from` negative is not allowed; start
the narration later instead, see ch04) or after the last.

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
files (`kit/*`, `masks.ts`, `ep1board.tsx`, `chapters.ts`) are read-only for you: if you need a change there, describe it
in your report. Delete your `out/` scratch folders when done (the disk is small).

## Masks (shared, in `src/masks.ts`)

`sherman`, `stanton` (Brady-Handy), `lincoln` (Gardner, Feb 1865), `booth`, `seward`, `johnson` (Bogardus carte de
visite, 1865), `howard`, `stevens`, `dred_scott`, `jdavis`. Use with `Photo`/`CropCard` `mask={MASKS.x}`.

## Chapter plans

Times are from the voiced audio (narration time, without the 44-frame lead).

### ch01 · A Few Acres (cold open; built by the main session)
Hook on the petition at frame 0 (the thumbnail image), swipe "We wish to have A home if It be but A few acres", the
docket ("Respectfully referred to Maj Gen O O Howard") for "The President had already said no", the handwriting and the
three signatures, Moore's 1862 Edisto photographs, the three words on the letter, the question, the board (the petition
lands on "this island"), then the channel intro and the title card. Music: `r_cold_open` (0.17).

### ch02 · Forty Acres (76 s) · terms: Union, Confederacy, Special Field Order No. 15, forty acres and a mule
- "go back to January 1865": a date slip over the Field Order map (`map_military_dept_south_ga_sc_fl_1865.jpg`) or the
  3D map.
- Union / Confederacy: the template's 3D map (`Map3D` with `UNION_FREE_1861`, `BORDER_1861`, `CONFEDERACY_1861`; the
  base data used by the map3d kit) or a simple state split; label "11 states".
- Sherman's march: `sherman_brady_1865.jpg` (mask `sherman`); "Thousands of freedpeople followed it":
  `contrabands_following_sherman_leslies_18mar1865.jpg` (Leslie's, Mar 1865).
- The Savannah meeting: `meldrim_house_sherman_hq_savannah_1865.jpg`, Stanton (`stanton_brady_handy.jpg`, mask
  `stanton`), then the minutes in the New-York Tribune (`savannah_meeting_minutes_ny_tribune_13feb1865.jpg` + `.json`:
  swipe Frazier's words "to have land, and turn it and till it by our own labor" as they're spoken; the Tribune's
  "Garrison Frazier, aged 67 years" line for his introduction). No picture of Frazier exists: say so with the document.
- "Translation: don't give us charity. Give us land." A `Highlight` on GIVE US LAND.
- Field Order 15: `field_order_15_printed_jan1865_p1.jpg` (DocShot; swipe "not more than (40) forty acres" at the foot:
  measure the box). Then **the forty-acres map**: port `../tests/src/tests/AcresTest.tsx` (the user's favourite test:
  the strip, Edisto, the 1,085 plots popping up; data `public/maps/sea_islands.json`) for "A strip of coast … islands
  included … Up to 40 acres each". "about 30 football fields": a slip, or 30 small field outlines. "forty acres and a
  mule": the Moore mule cart (`ch01/edisto_freedpeople_hopkinson_plantation_1862_moore.jpg`, tag 1862).
- "about 40,000 people": `freedpeople_to_cotton_field_st_helena_island_1863.jpg` (Sea Islands, tag it) with a count.
- "But here's the catch … military order … didn't make them the owners": back to the order, `Spot` on "possessory
  title" if it's on the page, else a coral slip "use ≠ own".
- Board: cut on "And nobody in Washington", land on "whether it would last".
- Music: `rc_jubilo` (0.22) from "Four days later" or the whole chapter; open on 4–6 s of "Marching Through Georgia"
  (`period/marching_through_georgia_princes_band_1916.mp3`) only if you can place it before the first word (it can't
  go under narration: skip it otherwise).

### ch03 · Ten Percent (85 s) · terms: Reconstruction, veto, pardon, Ten Percent Plan, Republican, Radical Republicans, freedpeople, Wade-Davis Bill
- Reconstruction defined: a Highlight + Definition over the 1865 map or a desk of the South's states; "about 4 million
  people" as a `Stamp`.
- "who was in charge of it": two cards, PRESIDENT vs CONGRESS (drawn, teal), used again at the end ("one plan … another").
- The refresher: Congress writes / President signs or vetoes: a simple drawn diagram (teal boxes, an arrow, a VETO
  stamp). "says nothing about how a state that tried to leave comes back in": a slip.
- Lincoln: `lincoln_amnesty_proclamation_8dec1863_p1_title.jpg` then p3's one-tenth clause (swipe "one tenth"; measure
  the box), Lincoln portrait (`ch04/lincoln_gardner_feb1865.jpg`, mask `lincoln`). Pardon defined.
- "nine out of ten voters didn't have to promise anything": 10 drawn figures (`Person`), one teal, nine grey.
- Republican: "Same name as today's party, but a very different one": a slip under the Highlight.
- Radicals: Stevens, Wade, Davis as a row of three cards (no group picture exists).
- Wade-Davis: `wade_davis_bill_text_printed_1864_p2_majority_clause.jpg` (swipe "a majority"); the pocket veto:
  `lincoln_proclamation_wade_davis_pocket_veto_8jul1864.jpg`; "A very polite way of saying no." (the dry aside: a slip).
- Board: cut on "So the President had one plan", Lincoln lands on "one plan", the question on "neither had won".
- Music: `j_intrigue` (0.15).

### ch04 · Ford's Theatre (110 s, heavy, voiced slower) · terms: none; told as events
- Open: the stereograph move (`../tests/src/tests/StereoTest.tsx`, the part the user liked: the camera move *into* the
  photo; assets `public/img/stereo/`; needs `--gl=swangle` to render) on Richmond's burnt district for "April 1865",
  then the McLean house for the surrender. If the 3D costs too much, use the McLean house alone.
- The window speech: `lincoln_last_speech_evening_star_12apr1865.jpg` + `.json`: swipe "very intelligent, and on those
  who serve our cause as soldiers". "It was a small step. But it was the first one."
- Booth: `booth_carte_de_visite_1865.jpg` (mask `booth`, no tint: he is not the subject; trace only or nothing).
  "according to later accounts" on a slip.
- The plot: the board close-up (port `CollageNight` from `../tests/src/tests/CollageAnim.tsx`: one night, three men, Booth
  strung to Lincoln, Seward and Johnson). Labels name places and outcomes, never "targets".
- April 14: the playbill (`our_american_cousin_playbill_fords_theatre_14apr1865.jpg`), the theatre, the box
  (`fords_theatre_presidents_box_april1865.jpg`). The shot: the Currier & Ives print, tag "1865 print, not an eyewitness
  view"; hold, no marks. The jump: Leslie's page. "Lincoln dies early the next morning": the deathbed print, then
  **silence** (music cut on the shot, MUSIC.md).
- Seward: portrait (mask `seward`), the "National Calamity" extra cropped to the top (it wrongly reports him dead later).
- Johnson sworn in: `johnson_oath_kirkwood_house_15apr1865.jpg`. The drunk swearing-in: the Cleveland Leader's "The
  Inaugural Disgrace" (swipe "drunk, before the Senate"), "Andy ain't a drunkard" as a quote card ("reportedly").
- "a Democrat … a very different party": slip.
- Board: cut on "Now Andy was in charge", Johnson lands on "a very different party".
- Music: `period/memories_of_the_war_conway_1915.mp3` can't sit under narration; use `rc_brass_dirge` (0.12) from
  "Lincoln dies" to the end, silence before it from the shot.

### ch05 · Treason Must Be Made Odious (99 s) · terms: planters, Presidential Reconstruction, homestead
- Johnson: `andrew_johnson_portrait_1865.jpg` (mask `johnson`); "grew up poor … tailor": the Harper's cover
  (`johnson_pardoning_rebels_white_house_1865.jpg`), top half (tailor shop), later the bottom half ("pardoning Rebels").
- "treason must be made odious": `treason_must_be_made_odious_ny_tribune_17apr1865.jpg` + `.json` swipe.
- "had owned enslaved people himself": a plain slip; no joke.
- Presidential Reconstruction: Highlight + Definition.
- "lining up outside his office to say please": the Harper's bottom panel, with the Mikell pardon application (an
  Edisto planter, `pardon_application_mikell_edisto_planter_aug1865_p1.jpg`; swipe "Edisto Island (1765 acres)").
- "A pardon gave you your property back. Including land like Edisto": `edisto_seabrook_mansion_1862_moore.jpg`.
- Howard to Edisto: `oliver_otis_howard_portrait.jpg` (mask `howard`). The committee's letter to Howard
  (`ch01/edisto_letter_to_howard_oct1865_p1.jpg`: swipe "we were promised Homestead's by the government"; measure the
  box). Homestead defined. Howard's reply: no scan survives here; a typeset quote card ("right in wanting homesteads" …
  "Congress must meet"), source FSSP transcription.
- Stevens: portrait (mask `stevens`), the Lancaster speech title page. "Hold onto Stevens": a slip "remember him".
- Board: cut on "But first, the South", land on "What was it going to do".
- Music: `g_grip` (0.15).

### ch07 · The Bureau (81 s) · terms: Freedmen's Bureau, Civil Rights Act of 1866, override
- The Bureau: Waud's "The Freedmen's Bureau" (1868, tag the date). "Yes, the general from Edisto": Howard again.
- Food and medicine: the rations engraving; marriages: the Vicksburg wedding; schools: the Vicksburg primary school
  ("Grandparents sat beside their grandchildren": push into an old man and a child).
- Families: **the Hannah Barnett ad** (`information_wanted_ad_colored_tennessean_24mar1866.jpg` + `.json`): DocShot,
  swipe "Information Wanted", then "was sold to Mr. John James, Nashville, Tenn., about nine years ago" as it's said
  (measure the box). "Very few ended with a family together again": hold, no marks.
- Vetoes: the two veto messages, a VETOED stamp on each. Civil Rights Act: Highlight + Definition; the three rights
  as three slips (contracts, property, court).
- Override: Highlight + Definition; a drawn two-thirds bar for House and Senate; the House galleries engraving.
- Board: cut on "The Civil Rights Act became law", land on "so did a new Freedmen's Bureau bill".
- Music: `g_world_outside` (0.15).

### ch08 · Equal Protection (74 s) · terms: 14th Amendment, Dred Scott decision, due process, equal protection
- "a law can be repealed … or struck down": a law card that tears (`Tear`); "The Constitution": the 14th's page.
- 14th Amendment: `fourteenth_amendment_joint_resolution_1866_p1.jpg`, the three things with `Counter` 1/3, 2/3, 3/3,
  each swiped on the page as it's said (measure the boxes on Section 1). Dred Scott: the photograph (mask
  `dred_scott`). Due process, equal protection: Highlights + Definitions. "Translation:" a slip.
- "The Black Codes are why this amendment exists": callback to ch06's Mississippi act (`img/ch06/vox/ms_vagrant_act.jpg`)
  with a thread or arrow to the 14th.
- Johnson tells the South to vote it down: the "Extract Const. Amend." cartoon (light touch); the Southern states
  rejecting it: state tiles (`Tiles`) with Tennessee the one teal tile; the Nashville capitol.
- "Which must have made for an awkward trip home." (dry aside): a coral slip.
- Board: cut on "Which must have made", land on "awkward trip home"; the subscribe line plays over the board with a
  small slip "subscribe ↓" near the bottom right (inside the safe margin).
- Music: `r_abolition_b` (0.14).

### ch09 · Swing Around the Circle (68 s) · terms: Swing Around the Circle
- "that fall's election": a date slip. Memphis: the Harper's cover (plain, no tint, hold); New Orleans: the procession
  page. "46 Black people were killed": a quiet `Stamp` in bone, not coral. "Northern voters read them": a newspaper page.
- Music shifts before "Johnson's answer was to hit the road": `w_aftermath` (0.12) for Memphis/New Orleans, then
  `j_campaign` (0.15) for the tour.
- The tour: Nast's "Andy's Trip"; Swing Around the Circle Highlight + Definition. "Once again … lose control in
  public": the Cleveland Leader editorial from ch04 for a beat (callback).
- Cleveland: the three clippings: the Tribune transcript, then the Evening Telegraph's "Why not hang Thad. Stevens"
  (swipe it on "in several of them"). "different versions": put two clippings side by side. Stevens: portrait (mask
  `stevens`).
- The election: a drawn bar of House and Senate seats crossing the two-thirds line (data: the 40th Congress; sourced
  numbers in a comment).
- Board: cut on "So, back to the question", land on "Congress does".

### ch10 · Landless, Homeless, Voteless (72 s) · the ending
- Recap over the board (`EpBoard ch={10}` with your own `cam` keys: travel piece to piece as the recap names them:
  Lincoln, Johnson, the Black Codes, the 14th, the election), then the whole board.
- "Johnson's supporters saw it differently …": two views, a cream divider at x 960, Johnson left (mask `johnson`),
  freedpeople / Radicals right.
- "And Edisto Island? Most of the freed families there lost the land.": `edisto_seabrook_quarters_1862_moore.jpg`.
- "Remember their three words?": `Motif` (the creased strip of their letter) and, under it, "LAW ✔ · LAND ✘" on a slip
  as it's said ("they had something new. The law." / "still didn't have was the land").
- "one of those three words was about to change": a teal loop round VOTELESS on the letter (`EDISTO.voteless`).
- "Next time": `wall/senators.jpg` (the Currier & Ives print) as a teaser card.
- The end screen: the last line "Thanks for watching…" over the whole board with `BoardSignoff`; add `extra` ≈ 450 frames
  (15 s) for a music-only end screen with two clean slots (see the template's end-screen notes in the skill).
- Music: `r_ending` (0.15), then **"Roll, Jordan, Roll"** (`period/roll_jordan_fisk_1909.mp3`) over the end screen only,
  after the last word.
