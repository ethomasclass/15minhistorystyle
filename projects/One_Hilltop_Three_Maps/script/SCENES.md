# Video 2 scene brief: "One Hilltop, Three Maps" (Judaism, Christianity and Islam)

Project: `/home/claude/religion_v2/video` (Remotion; same kit and look as Video 1, "15 Minute Human Geography").
Audience: 9th-grade AP Human Geography students watching at home. Vox-style explainer: maps and data carry the story, photos
show real life today, public-domain art and AI paintings show the past. Video 1 (`/home/claude/religion_demo/video`) is the
finished sister video: match its look exactly.

## Read first
- `script/chNN_*.txt` (your narration; scenes are timed to these words) and `public/audio/chNN_*.words.json`
- Finished Video 1 chapters as models (read-only, do not edit): `/home/claude/religion_demo/video/src/ch/Ch01.tsx` (cold open +
  channel intro + title card shape, ThreeMaps), `Ch03.tsx` (photo/painting/map/chart patterns), `Ch06.tsx` (ending + end card with
  ChapterShell `extra`). Copies also sit in `script/REFERENCE_v1_*.tsx.txt`.
- `src/kit/asia.tsx` (WorldMap with lon/lat camera, Fill, Dot, MapLabel, centroid(); despite the name it is a world map)
- `src/kit/shell.tsx` (ChapterShell, Photo, CropCard, Definition, Quote, Stamp, makeTimeline, useScene, hasFile),
  `src/kit/Kit.tsx` (Highlight, Note, Arrow, Loop, Tag), `src/kit/charts.tsx` (Pie, Bars, HBars), `src/kit/common.tsx` (DarkPaper, Sfx, WRITE)
- The skill's guides: `/home/claude/15minhistorystyle/.claude/skills/15-minute-history/references/building-scenes.md` and `visual-style.md`

## Rules for every chapter
1. **Edit only your own `src/ch/ChNN.tsx`.** Never edit shared files (asia.tsx, Kit.tsx, shell.tsx, masks.ts, chapters.ts, project.ts,
   Intro.tsx). Helpers go in your chapter file. Country ids not in `C` are ISO numeric strings (Israel '376', Spain '724', Italy '380',
   Greece '300', Turkey '792', Egypt '818', Saudi Arabia '682', Iran '364', Iraq '368', Indonesia '360', Malaysia '458', Mali '466',
   Nigeria '566', Ethiopia '231', Philippines '608', Mexico '484', Brazil '076', Russia '643', Poland '616', Ukraine '804', USA '840',
   Morocco '504', Yemen '887', Jordan '400', Syria '760', Lebanon '422', Bangladesh '050', Pakistan '586', Kazakhstan '398',
   Uzbekistan '860', Afghanistan '004', Tunisia '788', Algeria '012', Libya '434', Sudan '729', Senegal '686', Niger '562').
2. Chapters 2 to 5: `ChapterShell` with `lead={LEAD}`. Chapter 1: copy Video 1's Ch01 shape exactly (no lead; cold open, then
   `ChannelIntro`, then the title card using TITLE/SUBTITLE/DATES from project.ts; the intro already says 15 MINUTE HUMAN GEOGRAPHY).
3. Scenes 4 to 12 seconds, cut on the word that starts a new idea. Every anchor must exist; use `nth` for repeats; run
   `python3 tools/anchors.py chNN_slug --src src/ch/ChNN.tsx`.
4. **Modern photos:** muted colour, `bw="saturate(0.55) contrast(1.08) brightness(0.82)"`. **Paintings, archival photos and AI
   paintings:** channel cutout look: black and white with coral tint + teal trace on a masked subject where a mask exists
   (`MASKS.roman_traveler`, `MASKS.port_merchant`, `MASKS.caravan_guide`), or a Loop/Arrow on the subject otherwise.
   AI paintings are tagged `Illustration · <what it shows> (AI-generated)`.
5. **A `Tag` on every image** with its credit from `public/img/credits.json` (title · artist, licence, via Wikimedia Commons).
6. Vocabulary terms get a `Highlight` on the word plus a `Definition` bar 8 to 10 frames later. Terms that MUST be on screen when
   spoken: Abrahamic religions, monotheistic, ethnic religion, universalizing religion, hearth (in ch1/ch5 maps), diaspora,
   relocation / contagious / hierarchical diffusion, Torah, Shabbat, kosher, bar/bat mitzvah, Ashkenazi / Sephardic / Mizrahi /
   Beta Israel, Bible, Catholic / Protestant / Orthodox, Quran, Sunni / Shia, Five Pillars, Ramadan, iftar, Eid al-Fitr, halal, hajj,
   sacred space, pilgrimage.
7. **Respect (non-negotiable):** no image, drawing, silhouette or figure of the Prophet Muhammad of any kind; show Islam's founding
   through maps, the Arabian Peninsula, Mecca as a place, and text. No AI or drawn faces for Jesus or Abraham (public-domain fine
   art such as Raphael is fine). Worship shown respectfully; say "many", not "all".
8. Text never crosses the frame edge, nothing over faces, one coral subject per image.
9. Sound as in Video 1: whoosh on cuts after the first (0.3), stamp on Highlights (0.27), `WRITE` 3 frames before Notes, tick on pins (0.4).
10. Some images are still downloading. Use `hasFile('img/...') ? <real/> : <fallback/>` for anything not on disk yet, with a fallback
    that still teaches (map, drawn card). Planned file names that may arrive later: `ch02/tissot_exile.jpg` (Tissot, exiles led to
    Babylon), `ch02/arch_titus.jpg` (Arch of Titus relief: Romans carrying the Temple menorah), `ch02/shabbat.jpg`,
    `ch02/bar_mitzvah.jpg`, `ch02/operation_solomon.jpg`, `ch03/dia_muertos.jpg`, `ch04/catalan_mansa_musa.jpg` (Catalan Atlas
    detail of Mansa Musa), `ch04/eid_prayer.jpg`, `ch04/hajj_kaaba.jpg`. Read sizes with PIL for files that exist; for planned ones
    read the size at runtime is not possible, so give the fallback and leave a `// TODO size` constant the lead will fill.
11. Checks before you finish: `npx tsc --noEmit -p .`; anchors; stills `node tools/stills.mjs ChNN out/stills_NN <seconds...>`
    (chapter seconds incl. the ~1.5 s lead for ch2-5) + `python3 tools/sheet.py out/sheet_NN.jpg out/stills_NN/*.jpg` and LOOK at the
    sheet (Read tool); fix overlaps/empty scenes; then `node tools/probe_text.mjs ChNN 10 2>&1 | grep -v "PROBECOUNT\|emory"` and fix
    every hit. Render stills one chapter at a time (parallel bundles can collide). Do not render the full video. Use your own `out/`
    subfolder names.

## Images on disk (check `ls public/img/*/` for what has arrived)
- `ch01/`: jerusalem_temple_mount_aerial, jerusalem_panorama, western_wall_crowd, holy_sepulchre, dome_of_the_rock
- `ch02/`: western_wall_notes, expulsion_1492 (Emilio Sala, 1889, PD), immigrant_boy (Russian Jewish boy at Ellis Island, PD),
  ellis_island_inspection (PD), bagel, beta_israel_portrait (CC0)
- `ch03/`: holy_sepulchre_interior, paul_athens_raphael (Raphael cartoon, PD), constantine_york (statue), vision_of_the_cross
  (School of Raphael, PD), lagos_cathedral, iconostasis, orthodox_icon, black_nazarene, manila_crowd
- `ch04/`: dome_arches, djinguereber (Timbuktu), timbuktu_postcard (PD), prayer_prostration, prayer_aerial, iftar_dates, iftar_plate,
  istiqlal_interior, istiqlal_dome, kaaba_crowd
- `gen/` (1376 x 768, with masks): v2_ch2_roman_road.jpg (roman_traveler), v2_ch3_indian_ocean_port.jpg (port_merchant),
  v2_ch3_sahara_caravan.jpg (caravan_guide)
- `v1/` (from Video 1, for the ending montage): varanasi_sunrise_crowd, tree_gate (Bodh Gaya), golden_temple_night

## Shot plans (improve them, but cover every term and idea)

### Ch01 · Cold open (`ch01_cold_open`, 52 s) · music `music/r_cold_open.mp3` at 0.15
Aerial Temple Mount photo with "THE OLD CITY OF JERUSALEM" and "about 15 min to walk across" (a small drawn scale bar). Three
labelled landmarks: Western Wall photo, Holy Sepulchre photo, Dome of the Rock photo, each tagged with its faith (cards on the
desk or quick cuts). ABRAHAMIC RELIGIONS + MONOTHEISTIC definitions; a "more than half of humanity" Pie or stamp (about 4.3 of
8.2 billion). The puzzle: one hearth dot near Jerusalem/Mecca, "within about 800 miles"; then three small world maps (Judaism:
dots, Israel/US large dots; Christianity: shaded Americas, Europe, sub-Saharan Africa, Philippines; Islam: shaded North Africa,
Middle East, Central Asia, Pakistan, Bangladesh, Indonesia, Malaysia) with "scattered", "Africa + Latin America", and a coral
arrow "nearly 5,000 miles" to Indonesia. "Why?" then ChannelIntro and the title card.

### Ch02 · The religion that was scattered (`ch02_judaism`, 153 s) · music `music/g_world_outside.mp3` at 0.18
Hearth map (eastern Mediterranean), "about 4,000 years", TORAH definition. ETHNIC RELIGION; "15 million" with Israel and US as
the two big circles. Diaspora timeline map: arrows out of Jerusalem at each date (586 BCE Babylon; 70 CE Rome: Arch of Titus if
present; 1492 Spain: Sala painting; 1880s-1920s to the US: Ellis Island photos; 1948 Israel). DIASPORA + RELOCATION DIFFUSION;
"scattered dots, not one block". Shabbat (photo if present, else a drawn table: two candles, challah), "25-hour break from your
screen". KOSHER drawn card (no pork, no shellfish, meat and dairy apart; cheeseburger with coral X). BAR / BAT MITZVAH (photo if
present, else Western Wall notes photo plus a drawn Torah scroll). Four communities map: Ashkenazi (Central/Eastern Europe,
Yiddish, bagel photo), Sephardic (Spain, Ladino), Mizrahi (Middle East + North Africa), Beta Israel (Ethiopia; portrait photo).
Operation Solomon: map arrow Addis Ababa to Israel, "14,000+ in about 36 hours", "1,000+ on one plane: world record".

### Ch03 · The religion that moved south (`ch03_christianity`, 122 s) · music `music/r_revival.mp3` at 0.13
Map: Bethlehem, Nazareth, Jerusalem pins; BIBLE. UNIVERSALIZING RELIGION, "2.4 billion". Paul: Raphael's St Paul preaching in
Athens (PD) and/or the Roman-road painting (traveler cutout), Paul's routes on a Mediterranean map, CONTAGIOUS DIFFUSION.
Constantine: York statue / Vision of the Cross, "313 legal · 380 official", Roman Empire filling, HIERARCHICAL DIFFUSION.
Colonial routes from Spain, Portugal, Britain, France; RELOCATION DIFFUSION; Philippines "8 in 10 Catholic". Branches map:
CATHOLIC / PROTESTANT / ORTHODOX three colours with a key. Worship montage: Lagos cathedral, iconostasis/icon, Black Nazarene
crowds; Día de los Muertos (photo if present, else a drawn ofrenda card) with "blending: more on this soon". Center-of-gravity
animation: a dot sliding from Europe (1900) toward Africa (today); "more Christians in sub-Saharan Africa than any other region".

### Ch04 · The religion that rode the trade winds (`ch04_islam`, 166 s) · music `music/j_intrigue.mp3` at 0.18
Map: Arabian Peninsula, Mecca and Medina pins, "early 600s CE". QURAN as text/definition; a calm drawn card for "the final
prophet in a line: Abraham · Moses · Jesus · Muhammad" (names only). "Allah = the Arabic word for God". UNIVERSALIZING, "2 billion".
Expansion map within about 100 years (Spain to Central Asia), HIERARCHICAL DIFFUSION. Trade routes: Saharan caravans (caravan
guide cutout) and Indian Ocean dhows (port merchant cutout), CONTAGIOUS DIFFUSION. Mansa Musa: Catalan Atlas if present, else a
drawn gold stamp; Timbuktu mosque photos; "1324". SUNNI / SHIA pie (85-90 / 10-15) with Iran and Iraq highlighted. FIVE PILLARS as
five drawn columns with one-word labels. Prayer photos; a drawn phone compass pointing to Mecca. RAMADAN, IFTAR (dates photo),
EID AL-FITR, HALAL. Puzzle answer: Indonesia lights up, "about 240 million", Istiqlal photos, "1 in 5 Muslims live in the Middle
East + North Africa" as a 5-figure row. HAJJ: Kaaba crowd photo, "nearly 2 million", "same plain white cloth: everyone equal".

### Ch05 · Back to the hilltop (`ch05_ending`, 52 s) · music `music/r_ending.mp3` at 0.15
Aerial Jerusalem again; three framed maps side by side (copy the ThreeMaps idea) labelled ETHNIC · diaspora / UNIVERSALIZING ·
contagious → hierarchical → relocation / UNIVERSALIZING · hierarchical + contagious. SACRED SPACES + PILGRIMAGE definitions over
a montage of cards: Varanasi, Bodh Gaya, Golden Temple (from `v1/`), Western Wall, Holy Sepulchre, Kaaba crowd. Back to Jerusalem
for the last line. Then an end card (~6 s via ChapterShell `extra`, added to CH05_FRAMES): "Before class: Islam reached
Indonesia through merchants, and Christianity spread after a Roman emperor converted. Which type of diffusion is each?"
