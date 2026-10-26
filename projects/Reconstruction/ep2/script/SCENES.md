# Episode 2 scenes: the brief

Every chapter is `src/ch/ChNN.tsx`, timed to the voiced narration in `public/audio/chNN_*.words.json` (Ellis, natural
speed, final). The model for how a chapter is built is Episode 1 (`../ep1/src/ch/`): read `Ch06.tsx` (the approved Vox
test) and one of `Ch02.tsx`/`Ch07.tsx` first. Its render is `../ep1/renders/Landless_Homeless_Voteless_720p.mp4`.

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
`credits_ep2.json`. Engravings and later images say their date ("1867", "c.1862") so nothing passes for an eyewitness
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

**The board** (`src/kit/ep2board.tsx`, the series board: Episode 1's pieces are all on it already). Every chapter ends on
it: cut to `<SeriesBoard ch={N} from={cutFrame} at={landFrame} />`. This chapter's pieces land from `at` (about 2 seconds
of arrivals); the camera starts close on them and settles on them with some of the board around. Rules:
- On screen **4–6 seconds**. Cut to it on the chapter's last sentence or the one before; land the pieces on the last
  line's key words. If the narration ends too soon after the landing, add `extra` frames to `ChapterShell` (up to 60)
  and the same to `CHNN_FRAMES` (Episode 1's `Ch06.tsx` does this).
- **Never name it** in text either: no "board", "wall", "case", "evidence".
- Don't move pieces in `ep2board.tsx` (or `ep1board.tsx`); if a position looks wrong in your chapter, say so in your report.

**Heavy chapter.** ch09 (debt and convict leasing) is plain: no jokes, no punch-ins, no coral punchline slips, fewer
marks, longer holds. Convict leasing: show the system (the photo, the official report), not suffering close-ups.

**Propaganda and caricature.** Files named `PROPAGANDA_` are racist or Lost Cause images: show one only as evidence, briefly,
dimmed or windowed, with a slip that says what it is ("a racist broadside, c. 1867"), never full screen without a label.
Engravings with caricatured figures (the Asheville registration's right edge, some faces in "Electioneering"): frame
them out.

**No speed-up.** The narration plays at its natural speed (the user's rule): never stretch audio.

**Episode 1 callbacks** are in `public/img/ep1/` (the three words, the petition pages, the 13th Amendment, the
Mississippi vagrant act, the Savannah minutes, Field Order 15, Moore's Edisto photo) and `img/wall/cr_*.png`.
`rc.tsx`'s `EDISTO`, `THREE_WORDS`, `Motif` point there.

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
files (`kit/*`, `masks.ts`, `ep1board.tsx`, `ep2board.tsx`, `chapters.ts`) are read-only for you: if you need a change there, describe it
in your report. Delete your `out/` scratch folders when done (the disk is small).

## Masks (shared, in `src/masks.ts`)

New for Episode 2: `revels` (Brady-Handy, 1870), `davis1859` (Jefferson Davis as a senator), `grant`, `ames` (senator, Brady-Handy),
`stanton_cdv`, `lynch`, `smalls`. From Episode 1: `stanton` (Brady-Handy), `johnson`, `stevens`, `jdavis`, `lincoln`, `howard`,
`dred_scott`. Use with `Photo`/`CropCard` `mask={MASKS.x}`.

## Chapter plans

### ch01 · The First Black Senator (cold open; built by the main session)

### ch02 · The Army Goes Back In · terms: Reconstruction Act, military districts, Congressional Reconstruction
- Recap (about 20 s): quick cuts over Episode 1's pictures: Johnson (`img/wall/cr_johnson.png`), the pardons
  (`cr_pardons.png`), the Mississippi vagrant act (`img/ep1/ms_vagrant_act.jpg`), the 14th (`img/wall/` none: use a Slip
  "the 14th Amendment, 1866" over a dark desk or Episode 1's Scrap look), then the Edisto three words (`Motif`, each word
  swiped as it's said: `EDISTO.landless/homeless/voteless` on `THREE_WORDS`).
- "done asking nicely": a slip. The Act: `reconstruction_act_votes_and_veto_mcpherson_1871_p166.jpg` ("passed it over the
  veto"), then `reconstruction_act_text_mcpherson_1871_p191.jpg` with `Counter` 1/3, 2/3, 3/3: part one swipes the district
  list; part two (`..._sec5_..._p192.jpg`) "of whatever race, color, or previous condition"; part three "article fourteen".
- Five districts: a drawn 3D map like Episode 1 ch02's (`public/maps/us1861.json` + `../ep1/src/ch/ch02_maps.tsx`): the
  ten states rise as five coloured slab groups with district numbers; Tennessee stays flat with a slip "ratified the 14th".
  `military_map_1869_south_detail.jpg` as texture first (tag 1869).
- "each run by a Union general": Ord (`gen_ord_with_family_1865.jpg`, crop to him).
- Congressional Reconstruction: Highlight + Definition; "Some people call it Radical Reconstruction" slip.
- Two views ("rule by bayonet" / "soldiers, standing on their side"): divider; left the Puck cartoon only if labelled
  (or a slip "white Southerners: an occupation"), right Waud's *Freedmen's Bureau* (`waud_the_freedmens_bureau_harpers_1868-07-25.jpg`).
- Board: cut on "To freedpeople, it was", land on "standing on their side".
- Music: `g_grip` (0.15), or `rc_jubilo` under the recap then `g_grip`.

### ch03 · The Blacksmith · terms: none new (Charles Caldwell introduced)
- Registration: Asheville (`registration_at_the_south_asheville_harpers_1867_crop.jpg`, frame left of centre); "hundreds of
  thousands" count; "Many had never held a ballot": `img/wall/firstvote.jpg` ("The First Vote", 1867).
- Organizing: "Electioneering at the South" (wide), slips "churches", "rallies", "clubs at night".
- Caldwell: **no portrait exists** (say so on a slip: "no photograph of him is known"). His name on the convention roll
  (`ms_convention_journal_1868_roll_caldwell_p5.jpg`: DocShot, the page, then the camera finds line "Charles Caldwell" and
  swipes it; measure the box: the line is near y 2190–2232, x 140–440). Blacksmith stand-in only as a small labelled card
  (`LATER_blacksmithing_am_college_greensboro_1899.jpg`, "Black blacksmiths, N.C., 1899").
- Clinton / Jackson: a drawn Mississippi locator (map3d with `us1861.json`, pins Jackson and Clinton, "12 miles").
- "treated him as property": a plain slip.
- Constitutions and schools: the Vicksburg school engraving (`freedmen_primary_school_vicksburg_1866.jpg`, tag 1866), slips
  "public schools", "for the first time"; "Usually in separate buildings" slip.
- "In 1870, his county sent him to the Mississippi state senate": the 15th-ratification page with his name (ch05 file
  `ms_senate_ratifies_15th_caldwell_yea_1870-01-15_mcpherson_p558.jpg`) as a quick preview, or a slip "state senator, 1870".
- "Remember Edisto's three words? One of them was about to be crossed out": the `Motif` with a teal loop round VOTELESS.
- Board: cut on "Remember Edisto's", land on "get past the President".
- Music: `rc_jubilo` (0.22).

### ch04 · One Vote Short · terms: Tenure of Office Act, impeach
- Tenure of Office Act page + Highlight + Definition. Stanton (`stanton_secretary_of_war.jpg`, mask `stanton_cdv`).
- "fired him anyway": a FIRED stamp. Impeach: Articles of Impeachment page; Highlight + Definition; a drawn
  two-step diagram (HOUSE accuses → SENATE tries, ⅔ to remove).
- Stevens: the Harper's cover (Stevens and Bingham before the Senate) and the *Evening Star* line "Mr. Stevens was carried
  out in his arm-chair" (swipe it; measure).
- The vote: the Leslie's engraving (Ross voting), then a drawn tally building to 35–19 against a ⅔ line at 36 (one short),
  with the McPherson judgment page. "Why?" two slips. "he had almost no power left": Johnson's acquittal engraving.
- Stevens's death: lying in state (Harper's cover, guarded by Black soldiers); the epitaph: the grave photo (modern,
  CC BY: tag "photo by JamesPFisherIII, 2014, CC BY 4.0"), a typeset quote "equality of man before his Creator".
- "His plan to give freedpeople land died with him": hold, quiet.
- Board: cut on "His plan to give", land on "died with him" (the thread from Stevens to LAND is cut).
- Music: `j_intrigue` (0.15).

### ch05 · The 15th Amendment · terms: 15th Amendment
- Grant (mask `grant`), the 1868 convention cover, a slip "Black voters helped elect him".
- The amendment: the enrolled resolution (`fifteenth_amendment_joint_resolution_1869_nara.jpg`) or McPherson's printed text
  (easier to read) with the swipe on "on account of race, color, or previous condition of servitude" as it's spoken.
  Translation: slips.
- "ratified in 1870": the Mississippi Senate ratification page: swipe "Charles Caldwell" among the yeas (callback).
- "one word gets crossed out. Voteless.": the `Motif`, a teal strike through VOTELESS on the word.
- "read it closely": back to the text, `Spot` on the three things it bans; three slips for what it doesn't ban (a tax to
  vote, a reading test, the grandfather rule), each with a small "?" — they're named in Episode 3.
- Women: the 1871 suffrage deputation engraving; Stanton & Anthony (tag 1880s) | Lucy Stone, a divider: "split in two".
- "Still… most of the voters": the Kelly *Fifteenth Amendment* print (full size `fifteenth_amendment_1870_print.jpg`).
- Board: cut on "Still. Five years", land on "most of the voters" (VOTELESS gets struck on the board too).
- Music: `r_abolition_b` (0.14).

### ch06 · Bottom Rail on Top · terms: bottom rail
- "the moment from the start of this video": the senators print again (callback), the Revels portrait (mask `revels`),
  slips "born free, N.C.", "minister · teacher", "chaplain, Black Union soldiers".
- "about 2,000 Black men held public office": a count, then quick portraits: Lynch (mask `lynch`), Smalls (mask `smalls`),
  Revels; slips "sheriffs", "mayors", "judges"; "Sixteen served in Congress": 16 drawn seats with two marked "senate".
- Bottom rail: a drawn rail fence (teal lines), the bottom rail in coral lifting to the top; Highlight + Definition. "in
  the cartoons of people who hated the idea": the `PROPAGANDA_black_vomit_bottom_rail_c1867.jpg` broadside, small,
  dimmed, labelled "a racist broadside, c. 1867".
- What the governments did: four slips/cards (schools · hospitals and roads · railroads rebuilt · Black Codes gone).
- Taxes and corruption: slips; "Critics… made that the whole story": optionally Nast's "Colored Rule" windowed and
  labelled as propaganda.
- Tweed: Nast's "Who stole the people's money?" (the dry aside "Nobody said New Yorkers weren't fit to govern themselves"
  as a coral slip).
- Board: cut on "But corruption", land on "fit to govern themselves".
- Music: `g_world_outside` (0.15).

### ch07 · Carpetbaggers and Scalawags · terms: carpetbaggers, scalawags
- The carpet bag (`carpet_bag_usa_1860s_cooper_hewitt.jpg`: it's in colour; show it B&W) + Highlight + Definition; Nast's
  "The Man with the (Carpet) Bags" (1872) for the word in use.
- "Some did come to get rich. But many were…": four slips (veterans, teachers, ministers, businessmen).
- Scalawags: Highlight + Definition; Alcorn as one real scalawag (optional, unnamed in the script: a slip "e.g. James
  Alcorn, governor of Mississippi"); three slips for who they were.
- Ames: the general portrait (`ames_maj_gen_civil_war.jpg`), then the senator (mask `ames`); slips "Union general, Maine",
  "ran a military district".
- The twist: Nast's "Time Works Wonders" (1870, the myth's source; label it) → the Senate roster page
  ("Mississippi—Hiram R. Revels, Adelbert Ames": swipe both names) → two seat cards: "Revels: Albert Brown's old seat",
  "Ames: Davis's old seat".
- "He's going to be the one asking for help": a slip.
- Subscribe line plays over the board with a small slip "subscribe ↓".
- Board: cut on "We'll see Ames again", land on "asking for help".
- Music: `rc_parlor` (0.14) or `a_price` (sardonic, 0.15).

### ch08 · No Land · terms: sharecropping, tenant farming
- "The land.": the Episode 1 forty acres (`img/wall/cr_acres.png` or the ep1 map) with a coral ✕.
- Callbacks: the Savannah minutes (`img/ep1/savannah_meeting_minutes_ny_tribune_13feb1865.jpg` + `.json`: swipe "to have
  land"), Edisto (`img/ep1/edisto_freedpeople_hopkinson_plantation_1862_moore.jpg`), Stevens (died with him).
- "everybody had a problem": a drawn two-column diagram (PLANTERS: land, no money / FREEDPEOPLE: labor, no land, no money).
- The Bureau contract (`freedmens_bureau_labor_agreement_truss_hall_1865_nara.jpg`: swipe "$4.00 per month"; his mark).
- Sharecropping: the 1867 De Soto County contract (swipe "one half of the crop" if legible; measure), then **one family,
  step by step**, as a drawn diagram: a plot divided into small farms (teal lines), a cabin, a mule, a plough, then the
  crop splitting ½ | ½. Highlight + Definition.
- Tenant farming: the same diagram, the family's side gets the mule and tools; "rent: cash or a share"; Highlight +
  Definition; slips "more freedom", "more risk".
- "looked like progress": the cotton-picking stereograph (crop one half; date uncertain, tag "1860s?").
- "But that word, partly": a coral Loop round "partly" on a slip.
- Board: cut on "But that word", land on "where the trouble started".
- Music: `m_lament` (0.13).

### ch09 · The Debt (heavy) · terms: crop lien, convict leasing
- "a family has to eat": the commissary photo (1937, tag it) as "the store", the promissory note (1867; swipe "On or
  before the 25 day of December next").
- Crop lien: Highlight + Definition.
- **Settling up**: a drawn ledger on the desk, line by line as narrated: CROP SOLD · THE FAMILY'S HALF · MINUS THE STORE ·
  PLUS INTEREST · = OWES. No invented dollar figures: use bars, not numbers. A music drop on "owes more than it made".
- "can't leave": a slip "leaving with a debt could get you arrested"; "another year, already behind" repeated year cards.
- "slavery by another name. It wasn't slavery.": two plain slips (no joke).
- The 13th Amendment callback: `img/ep1/thirteenth_src.jpg` with the swipe on "except as a punishment for crime" (Episode
  1's box: [2035, 928, 860, 62]).
- Convict leasing: the Florida photo (c. 1915, tag it), the Alabama inspector's 1892 report cover; Highlight + Definition
  "convict leasing"; "And it was legal." plain.
- Board: cut on "It's called", land on "And it was legal".
- Music: `rc_codes` (0.17).

### ch10 · The Ground They Stood On · the ending
- Recap over the series board (`SeriesBoard ch={10}` with your own `cam` keys, touring Episode 2's pieces as they're
  named), then pieces from the episode as the narration lists them (IMAGES.md ch10 order).
- Two views (Republicans / most white Southerners): divider; "Bottom rail on top. They meant it as a warning." on a slip.
- "Not land." hold. The `Motif` with VOTELESS struck and LANDLESS circled (coral loop).
- "people who don't own the ground can be pushed off it": the cotton field or the cabin.
- "only there as long as the North wanted them there": Waud's *Freedmen's Bureau* again.
- Caldwell: his two documents (the roll and the ratification yea), slip "militia colonel, 1873"; "that's what would get
  him killed": a plain hold.
- "Next time": slips "the Klan · a crash · a bank · a deal".
- End screen as in Episode 1's `Ch10.tsx` (about 18 s, two slots), with `BoardSignoff`. Music: `r_ending`, then a period
  recording after the last word only (`period/swing_low_fisk_1909.mp3` or `hard_times_brunswick_1910.mp3`: copy and
  normalise from `../music/period/` to −16 LUFS).
