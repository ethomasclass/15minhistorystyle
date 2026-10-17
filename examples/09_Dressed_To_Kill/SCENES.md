# Dressed to Kill: scene plan (brief for building `src/ch/ChNN.tsx`)

Narration is voiced (`public/audio/chNN_*.wav` + `.words.json`, 8:59 total). Build every scene on the real word timings.

## Rules for every chapter (read first)

- Read `.claude/skills/15-minute-history/references/building-scenes.md` and `visual-style.md` (in the style repo,
  `/home/user/15minhistorystyle/.claude/skills/15-minute-history/`), and `explainer-craft.md` §3. Model chapters with the same
  kit: `/home/user/15minhistorystyle/projects/Black_Sox/src/ch/Ch0*.tsx` (Ch08 has the end screen).
- **Kit** (`src/kit/`): `Kit.tsx` (Highlight, Note, Arrow, Loop, Tag, Tint, Traced), `shell.tsx` (ChapterShell, makeTimeline,
  useScene, Photo, CropCard, Definition, Quote, Stamp, PhotoCard), `parallax.tsx` (Parallax), `bs.tsx` (Desk, DropCard, Arch,
  SyncQuote, Line, Sounds), `charts.tsx`, and **`dk.tsx` (this video)**: `GREEN`, `Sil` (silhouette parallax), `Doc` +
  `DocMark` with `swipe` (coral highlighter along quoted lines, `at`→`to`), `Swatch` (the green motif card), `GreenParallax`,
  `Plain`, `sizeOf` (sizes from `src/imgs.ts`). Masks: `src/masks.ts` (`MASKS.g_library` … `MASKS.waltz_lady`, `morris`,
  `draper`, `kedzie`, `dress`, `scheele`); parallax layers exist for all of them.
- **Do not edit shared files** (`src/kit/*`, `src/masks.ts`, `src/chapters.ts`, `src/project.ts`, `src/imgs.ts`, `tools/*`). Put
  helpers inside your chapter file. If you truly need a new shared helper, create `src/kit/chNN_extra.tsx`.
- **Colour rules.** B&W archive with one coral subject + teal trace, as usual. **The one exception: arsenic green.** The real
  pigment may show green: the silhouette paintings (`Sil`, kept in their own colours), the Kedzie and Draper sample leaves and
  the Kedzie cover (`Doc colour` / unfiltered images), the Met green dress and the Met wreath (real objects), the Trellis wallpaper,
  the Cooper Hewitt green wallpapers. `GreenParallax`/`Tint color={GREEN}` can colour a pigment subject (e.g. the Waltz lady's gown).
  **Never green on text, titles, notes, arrows or charts.** Teal stays well away from green areas (don't trace a teal line
  straight around a green patch).
- **The Swatch motif** (top right, x 1560 y 56, same place every time): ch02 fills it (WALLS, GOWNS, WREATHS, CANDY, TOYS,
  BOOKS as each is named in "So arsenic green went everywhere…"); it returns briefly in ch03 (full); ch07 drains it on
  "arsenic-free"; ch08 shows it SEALED next to the sealed book. Don't show it over a document you're reading or in ch04.
- Every image gets a `Tag` (paintings: `Illustration · …`; Scheele: "later engraving"; NLM: "Courtesy of the National Library
  of Medicine"; credits are in `public/img/credits.json`, catalogue in `public/img/IMAGES.md`).
- Cuts 1 frame before the word; whoosh per cut; stamp per Highlight; marker 2 frames before each Note (see Black Sox `Sounds`).
  Scenes 4–12 s. Titles ≥ 2 s on screen. No text off the frame (x 60…1860).
- **Music** (`public/music/`, already copied; `ChapterShell music={[{src, volume, from?, to?, fadeOut?, startFrom?}]}` — `to` ends a
  cue early, `fadeOut` 4–6 frames = a music drop). Levels: Lyria/Suno cues 0.13–0.17; quiet ElevenLabs cues higher (see per chapter).
- **Checks before you finish** (only your chapters): `npx tsc --noEmit -p .` (ignore errors in other agents' files),
  `python3 tools/anchors.py <stem> --src src/ch/ChNN.tsx`, stills (`node tools/stills.mjs ChNN out/<you>/ 3 9 …` then
  `python3 tools/sheet.py`), look at them, and `node tools/probe_text.mjs ChNN 10`. Render stills sparingly (other agents share
  the machine): one stills run per chapter per round, a few seconds apart. Fix what you see. Don't render full videos.

## ch01 · Dressed in Poison (cold open, 49 s) → channel intro → title card
Hook-first: **the first frame is the Arsenic Waltz** (thumbnail promise), no fade from black, camera moving from frame 0.
1. 0 → "Twelve": `img/ch03/arsenic_waltz_punch_1862.jpg` as Parallax (`waltz_lady` layers) pushing in; Highlight "1860s" or a
   Note "the most fashionable colour…"; "Now look closer" → punch in on the skulls (Loop/Loupe on the man's skull); "They're
   both skeletons." Stamp; "her green dress" → the lady's gown turns **GREEN** (Tint color GREEN, on "green").
2. "Twelve years later" → desk: Kedzie cover `kedzie_cover_green_label_crop_1874.jpg` (real colour) DropCard; Note
   "Michigan, 1874"; "100 public libraries" Stamp 100; "Every page is real wallpaper" → green specimen leaves fan out
   (n110, n048, n126, n136; colour).
3. "The letter in the front" → `Doc` of `kedzie_baker_letter_1874.jpg` (5569×7483), swipe the sentence box
   (240,2380)–(1850,2625) on "asks librarians not to let children handle it" (3 lines); tag "Henry B. Baker, Michigan State Board
   of Health, 1874 · Courtesy of the National Library of Medicine". "very first sample" → `kedzie_specimen_n018_first_leaf_spring_port.jpg`
   (colour) + Note "page one".
4. "So here's the question" → the question on the desk (Notes): walls / dresses / candy; "take so long" in coral.
5. "We'll come back to that girl" → `Sil` g_library (librarian opening the book); "most famous designer… witch fever" →
   orange Note "witch fever?".
Then `ChannelIntro` and the title card (TITLE/SUBTITLE/DATES from project.ts): background a green Kedzie leaf (colour, dimmed),
title on orange tape. Music: `r_spirits_dark` 0.14 from frame 0, dipping to 0 by the end of narration (copy the template's Ch01
shape; replace its demo scenes).

## ch02 · The Perfect Green (71 s)
"By the 1860s… you wanted green. On your walls. On your dress. In your hair." → quick triptych punch-ins (Cooper Hewitt green
wallpaper, Met dress, Met wreath; colour) · "a chemist in Sweden. In 1775" → Scheele engraving card (`scheele`, tag "later
engraving") + medal; Highlight "1775"; `Definition` {Scheele's Green} · "In a letter to a friend" → `Doc` of
`scheele_letter_gahn_9feb1777_p195_arsenic.jpg` underline the arsenic sentence; Note "translation: careful, it's arsenic" ·
"Not a great sign." coral Note · "In 1814… Paris green" `Definition` {Paris green}; "one Victorian poet" → Bab Ballads page Doc
with "arsenic green" boxed · "So why did everyone want it? Timing." → Doré `dore_over_london_by_rail_1872.jpg` (smoke) vs
`wyld_manchester_from_kersal_moor_1852.jpg` (country) as two views · "new printing machines" → `figuier_wallpaper_machine_twenty_colours_1873.jpg`
· "In 1834… 1.2 million rolls… About 32 million" → a two-bar chart (charts.tsx or drawn), each bar on its spoken number, the
second overshooting (scale shock); orange-free bone/coral bars, NOT green · "So arsenic green went everywhere…" → a montage on
the desk, each item appearing on its word, and the **Swatch** filling: WALLS (parlor walls), GOWNS (ball gowns), WREATHS (fake
leaves), CANDY (candy wrappers: `great_lozenge_maker_punch_1858.jpg`), TOYS, BOOKS (book cloth) · "All of it, arsenic." Stamp.
Music `g_pyramid` ~0.22.

## ch03 · Dressed to Kill (60 s)
"Possibly a dance." → `Sil` g_ballroom (the green gown) · "enormous skirts…" → fashion plate `fashion_plate_moniteur_green_gown_c1863_rijks.jpg`
(Rijks colour plate: keep B&W except the gown may stay its own colour) and Met dress (Tag "probably arsenic green") · "a chemist
tested one of those hair wreaths… 'to poison twenty persons'" → Met wreath (colour) + `Doc` Hofmann page swipe · "British Medical
Journal… 'poison enough to slay…'" → `Doc` `bmj_15feb1862_p177_poison_enough.jpg` swipe the quote, or SyncQuote over the dimmed page
· "keep admirers at a distance." coral Note · "Punch drew those two skeletons" → callback: the Waltz again (same framing as ch01),
Highlight "THE ARSENIC WALTZ" · "Most of the women… were fine" → `Sil` g_workshop · "Hold onto that." → `Sil` g_matilda (brief) ·
subscribe plug: small teal Note "subscribe ↓" near the bottom, over the Waltz or a quiet desk. Swatch visible (full) in the
montage-y scenes. Music `j_good_feelings` 0.27.

## ch04 · The Walls (heavy, `quiet` palette, 77 s)
No jokes, few marks, longer holds, no coral (quiet palette). `Plain` lines for facts.
"London, 1861. Matilda Scheurer…" → `Sil` g_matilda (slow) + Note "no picture of her survives" (white, small) · "They tie thin
cloth…" → `builder_1862_flower_makers_blighting_the_buds.jpg` · "sick on and off… green" → `vernois_1859_plate_flower_makers_hands.jpg`
(CropCard, slow) · "The inquest…" `Definition` {inquest}; `Doc` `medical_times_gazette_1861-11-30_p560_scheurer_inquest.jpg` swipe
"used in her employment" (find the line's pixel box by looking at the scan) · "A few months later… Turner" → `Sil` g_street ·
"diphtheria" Definition-lite (Note) · "Thomas Orton, notices the walls" → `Sil` g_doctor (he points at the wall) · "like paint" →
`Doc` `medical_times_gazette_1862-05-03_p471_turner_inquest.jpg` swipe "like paint" · "Four children in about two months." → `Plain`
+ four small marks; hold · **music drop**: the bed cuts out 4–6 frames before "natural death", hold silence; swipe "Natural Death"
on the page · "And that was the pattern." → `builder_1862_a_damp_room_and_its_dangers.jpg` slow push; last line "nobody thought to
look at the walls" pushes into the wallpaper. Music `r_dix` 0.12 (`to` = just before "natural death", fadeOut 5), then `j_grief`
0.14 from "And that was the pattern".

## ch05 · Witch Fever (94 s)
"Three reasons." counter 1/3, 2/3, 3/3 top-left in mono (or bs `Line`) · One: messy evidence — two cards (a healthy family / a sick
one) or a Note list; Two: the gas theory → `cooke_1872_plate12_paper_moulds.jpg` + a drawn **dust vs gas** diagram (teal line
drawing: wall → dust falling → child's hand → mouth; the gas column struck through on "pretty weak"); "That means… coming off
them" Highlight · Napoleon → `death_of_napoleon_steuben_lithograph.jpg` + orange Note "myth" / Stamp; "Stomach cancer did." ·
Three: money → Stamp "2 TONS / WEEK" (Abril, bone) · "William Morris" → Parallax `morris` (coral tint, trace), Highlight "WILLIAM
MORRIS"; "copper mine… arsenic producers" → `mining_journal_1876-12-09_devon_great_consols_arsenic_letters.jpg` Doc swipe
"largest arsenic producers"; `arsenic_furnace_encyclopedie_goussier.jpg` · "His early wallpapers" → `morris_trellis_wallpaper_1864_met.jpg`
(real colour: the green is arsenic, per testing) · the 1885 letter → **SyncQuote** of the exact sentence on the desk ("As to the
arsenic scare a greater folly it is hardly possible to imagine: the doctors were bitten as people were bitten by the
witch-fever."), attribution "William Morris to Thomas Wardle, 3 Oct 1885" · `Definition` {witch fever} = a panic · "the toilets"
→ `doulton_lambeth_combination_closet_ad_1884.jpg` with a coral Note · "To be fair… To his critics" → two views split (teal
"his side" / coral "his critics"). Music `r_cold_open` 0.14 until "Which brings us to William Morris", then `j_intrigue` 0.17.

## ch06 · Shall We Poison Our Homes? (86 s)
"Meanwhile, in America" → the 1873 Atlantic map in `public/img/maps/` (check the catalogue for pixel positions of London, Boston,
Michigan): an orange dashed route London → Boston (camera clamped inside the map) · "Massachusetts, 1872… Frank Draper" →
`boston_washington_franklin_sts_1870s.jpg` then Parallax `draper` (coral) · {board of health} Definition · "His first line" → Doc
`draper_report_p17_everybody_knows_1872.jpg` swipe the sentence · "Bedroom walls. Children's paint boxes. Candy wrappers…" → Notes
+ `draper_report_p31_boston_confectioner_1872.jpg`; "real samples… into his report" → `draper_sample_leaf_n054_1872.jpg` (colour,
small: it's mint, keep teal away) · "So, ban it?…'too sacred'" → Doc `draper_report_p57_too_sacred_1872.jpg` swipe (box
(150,1228)–(1215,1292) per the catalogue) · "Translation:" Note · {laissez-faire} Definition · "Two years later, in Michigan,
Robert Kedzie" → `mac_view_durant_1880_spread.jpg` → Parallax `kedzie` (coral) · "He collected cases. Emma…" → `Sil` g_emma ·
"Spring Port, the girl from the first page" → `springport_township_map_1874.jpg` + `kedzie_specimen_n018…` callback (colour) ·
"So Kedzie went shopping… tested every sheet" → `Sil` g_chemist; "All 86" Stamp 86 · "This book." → the Kedzie cover (same shot as
ch01) · "Shall we poison our homes?" → `kedzie_essay_p1_shall_we_poison_crop_1874.jpg` swipe the heading. Music `g_grip` 0.2 until
"Two years later", then `j_cold_open` 0.26.

## ch07 · Arsenic-Free (53 s)
"In Britain, not with a law." · "shoppers got scared… 'arsenic-free'" → `advert_wallpaper_free_from_arsenic_c1890_crop.jpg` and
`jeffrey_co_ad_patent_hygienic_free_from_arsenic_1884.jpg` Docs, swipe "FREE FROM ARSENIC"; **Swatch drains to grey** on
"arsenic-free" · "Sweden in 1876. Germany in the 1880s." → simple desk ledger/stamps · "Britain never banned" Stamp "NO BAN" ·
"Massachusetts… 1900. That's 28 years" → `massachusetts_acts_1900_ch325_arsenic_p259.jpg` Doc + Stamp "28 YEARS" · "But the green
didn't disappear. It moved." → `riley_potato_pests_1876_cover.jpg` → `Sil` g_farmer (green dust, the strongest closing image) +
`riley_1876_grays_sprinkler_paris_green_crop.jpg` · "one of the first big insecticides" Note. Music `a_newsroom` 0.17.

## ch08 · Back to the Book (47 s) + end screen
`quiet`-ish restraint for the answer; then the closer. "So let's go back to the question" → the question card from ch01 · "beautiful,
and cheap" → green wallpaper (colour) · "proof was messy, the money was big" → quick callbacks (Morris, the mine page) · "A jury
looked at green walls and a dead three-year-old" → `Sil` g_doctor (still) · "In Britain, it was shoppers" → the arsenic-free ad ·
"Kedzie's book is still out there, sealed in plastic. Still green." → `kedzie_closed_book_front_cover.jpg` in a drawn plastic sleeve
+ the Swatch SEALED · "The green never changed. What changed was who had to prove it was safe." → `Plain`/Highlight · "William
Morris called it witch fever. But this time, the witch was real." → the Arsenic Waltz skeleton (callback), slow push to the
skull, green gown · "Thanks for watching…" → end screen: music-only extra ~14 s (`extra` on ChapterShell, add to CH08_FRAMES),
layout with two empty slots for YouTube end-screen elements (a video slot left ~ x 150–950 / y 300–750, a subscribe circle right),
dark desk + a faint green leaf, small "next: Good Luck · the Ouija board" note. Model: Black Sox `Ch08.tsx`. Music `r_ending` from
about 30 s before the end of narration (so its dark unresolved chord lands near "the witch was real") at 0.16, carrying through
the end screen.
