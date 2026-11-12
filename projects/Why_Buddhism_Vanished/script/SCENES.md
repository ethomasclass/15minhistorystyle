# Video 1 scene brief: "Why Buddhism Vanished From Its Birthplace"

Project: `/home/claude/religion_demo/video` (Remotion, the 15 Minute History kit restyled as "15 Minute Human Geography").
Audience: 9th-grade AP Human Geography students watching at home. Vox-style explainer: maps and data carry the story,
photos show real life today, AI paintings show the past.

## Read first
- `script/chNN_*.txt` (your chapter's narration; scenes are timed to these words) and `public/audio/chNN_*.words.json`
- `src/ch/Ch01.tsx` (the finished cold open: the look to match, and working examples of every map/chart pattern)
- `src/kit/asia.tsx` (WorldMap with lon/lat camera, Fill, Dot, MapLabel, C country ids, P places, centroid())
- `src/kit/shell.tsx` (ChapterShell, Photo, CropCard, Definition, Quote, Stamp, makeTimeline, useScene)
- `src/kit/Kit.tsx` (Highlight, Note, Arrow, Loop, Tag), `src/kit/charts.tsx` (Pie, Bars, HBars, CountUp), `src/kit/common.tsx` (DarkPaper, Sfx, WRITE)
- The skill's guides: `/home/claude/15minhistorystyle/.claude/skills/15-minute-history/references/building-scenes.md` and `visual-style.md`
- Template example of a standard chapter: `/home/claude/15minhistorystyle/.claude/skills/15-minute-history/assets/template/src/ch/Ch02.tsx`

## Rules for every chapter
1. **Edit only your own `src/ch/ChNN.tsx`.** Do not edit shared files (asia.tsx, Kit.tsx, shell.tsx, masks.ts, chapters.ts,
   project.ts). Need a helper? Put it in your chapter file. Need a country id or place not in `C`/`P`? Define it locally
   (ISO numeric strings from world-atlas, e.g. Trinidad '780', Guyana '328', Fiji '242', Mauritius '480', South Africa '710',
   Canada '124', UK '826', USA '840', Pakistan '586', Laos '418', Korea '410'); `centroid(id)` works for any id.
2. Wrap the chapter in `ChapterShell` with `lead={LEAD}`, the chapter audio, and its music bed (below). Keep `PALETTES.locked`
   and `StepCtx` 2.5 like Ch01 (ChapterShell already provides them; check).
3. Scenes 4 to 12 seconds, cut on the word that starts a new idea (`t.at('phrase') - 1`). Every anchor phrase must exist in your
   narration; use `nth` for repeats. Run `python3 tools/anchors.py chNN_slug --src src/ch/ChNN.tsx` and fix anything missing.
4. **Photos (modern, real):** muted colour, `bw="saturate(0.55) contrast(1.08) brightness(0.82)"` on `Photo`, teal/coral marks on top.
   **AI paintings (`public/img/gen/`) and archival images:** the channel cutout look: default black and white with the coral
   tint + teal trace on the masked subject (`mask={MASKS.name}`). Tag paintings `Illustration · <what it shows> (AI-generated)`.
5. **A `Tag` on every image** with its credit from `public/img/credits.json` (title · artist, licence, via Wikimedia Commons).
   Maps: `Map: Natural Earth`. Charts: the data source.
6. Vocabulary terms get a `Highlight` on the word plus a `Definition` bar 8 to 10 frames later. Course terms that MUST be on
   screen when spoken: universalizing religion, ethnic religion, hearth, diffusion, relocation / contagious / hierarchical
   diffusion, plus each chapter's own terms (puja, karma, reincarnation, Eightfold Path, nirvana, Theravada/Mahayana/Vajrayana,
   gurdwara, langar, Five Ks).
7. Respect: no AI or drawn faces for the Buddha or Guru Nanak; worship shown respectfully; say "many" not "all".
8. Text never crosses the frame edge; nothing written over faces; one coral subject per image.
9. Sound like Ch01: whoosh on each cut after the first (0.3), stamp on each Highlight (0.27), `WRITE` marker 3 frames before each
   Note, tick on map pins/arrows (0.4).
10. **Images that may not exist yet** (still downloading): wrap them in `hasFile('img/..') ? <Photo .../> : <fallback/>` so the
    chapter renders either way. Use the fallback that still teaches (a map or a drawn card).
11. Check before you finish: `npx tsc --noEmit -p .`; anchors; stills with `node tools/stills.mjs ChNN out/stills_NN <seconds...>`
    (seconds counted from the chapter start, which includes the ~1.5 s logo lead) and `python3 tools/sheet.py out/sheet_NN.jpg out/stills_NN/*.jpg`,
    then LOOK at the sheet and fix overlaps, empty scenes, unreadable text; then `node tools/probe_text.mjs ChNN 10 2>&1 | grep -v "PROBECOUNT\|emory"`
    and fix every edge hit. Do not render the full video (the lead renders it). Use your own `out/` subfolder names so you do
    not clash with other chapters being built at the same time.

## Images available
- Modern photos: `public/img/ch02/` (Hinduism), `ch03/` (Buddhism), `ch04/` (Sikhism), `bg/` (Bodh Gaya). Sizes: read with PIL.
- Still downloading (use hasFile fallbacks): `ch03/lion_capital.jpg`, `ch03/nalanda_ruins.jpg`, `ch03/nalanda_stupa.jpg`,
  `ch03/shinbyu_procession.jpg`, `ch03/young_novices.jpg`, `ch03/four_sights_mural_a.jpg`, `ch03/four_sights_mural_b.jpg`,
  `ch03/ashoka_pillar_archival.jpg`, `ch04/golden_temple_day.jpg`, `ch04/golden_temple_sunset.jpg`, `ch04/gurdwara_canada.jpg`,
  `ch04/gurdwara_archival.jpg` (Sikh men at Vancouver's Second Avenue Gurdwara, early 1900s), `ch02/holi_crowd.jpg`.
- AI paintings, all 1376 x 768, each with a mask in `MASKS`:
  `gen/v1_ch2_vedic_fire.jpg` (vedic_priest), `gen/v1_ch2_home_puja.jpg` (puja_woman), `gen/v1_ch2_indenture_arrival.jpg`
  (indenture_woman), `gen/v1_ch3_four_sights.jpg` (old_man), `gen/v1_ch3_ashoka_kalinga.jpg` (ashoka), `gen/v1_ch3_silk_road.jpg`
  (silk_monk), `gen/v1_ch3_nalanda.jpg` (nalanda_monk), `gen/v1_ch4_early_langar.jpg` (langar_volunteer). Photo mask: `sikh_man`
  on `ch04/sikh_man_turban.jpg`.

## Shot plans (suggestions: improve them, but cover every course term and every idea in the narration)

### Ch02 · Who gets to join? (`ch02_who_joins`, 57 s) · music `music/r_schools.mp3` at 0.12
Title strip "WHO GETS TO JOIN?" on the desk, then a two-column split: UNIVERSALIZING (teal: arrows fanning out across a world map)
vs ETHNIC (coral: a tight cluster), each with its Definition bar. Hearth: a world map with small flame markers on real hearths
(Ganges valley, Bodh Gaya, Punjab, Jerusalem, Mecca) and the word HEARTH. Diffusion: three short animated diagrams on the desk,
one per type, each built from dots: relocation (a dot travels from the hearth to a far place and a new cluster appears there),
contagious (dots light up neighbour to neighbour), hierarchical (one big node, then a city, then towns beneath). End on "each
religion spread in a different way" with the three labels side by side.

### Ch03 · The religion that stays home (`ch03_hinduism`, 148 s) · music `music/g_world_outside.mp3` at 0.2
Map of South Asia with the Indus and Ganges valleys glowing (draw the two rivers as teal polylines from real coordinates), then the
Vedic priest painting (cutout) on "Vedas". 1.2 billion: India + Nepal filled, CountUp or Stamp, a Note "about 95% in India and
Nepal". Highlight ETHNIC RELIGION. Puja painting (cutout) with PUJA definition; gods named as Notes; KARMA / REINCARNATION definitions.
McDonald's beat as a drawn menu card graphic (no logos): "beef burger" struck out with a coral X, "veg + chicken only".
Varanasi photo (sunrise crowd). Kumbh Mela crowd photo, then the sadhu photo; "600 million visits" Stamp beside a two-bar
comparison vs the US population (about 335 million). Question card "why are there Hindu temples in the Caribbean?". Indenture
painting (cutout woman) with Notes "1830s-1917" and "indentured laborers". Map: arrows from India to Trinidad and Tobago, Guyana,
Fiji, Mauritius, South Africa, labelled; RELOCATION DIFFUSION Highlight. Fiji temple photo and Mauritius photo with "Diwali =
national holiday" and "about half Hindu" Notes. UK/Canada/US arrows, Holi photo with "color runs borrowed this". End line on a
simple map: "moves when people move".

### Ch04 · The prince who walked away (`ch04_buddhism`, 170 s) · music `music/w_calm_sea.mp3` at 0.17 (switch to `music/j_intrigue.mp3` at 0.22 from "Which brings us back")
Four Sights painting (old man cutout; the prince seen from behind; mural photo as an alternate shot if downloaded). The Bodh Gaya
tree photo (`bg/tree_gate.jpg`) for enlightenment; THE BUDDHA Highlight, "the awakened one". Definition cards: EIGHTFOLD PATH,
NIRVANA. UNIVERSALIZING stamp. Ashoka painting (cutout) with "c. 260 BCE · Kalinga" and "100,000+ killed"; pillar photo and edict
rubbing; map: Mauryan heartland, arrows to Sri Lanka and beyond, HIERARCHICAL DIFFUSION. Silk Road map (route polyline through
Central Asia to China, Korea, Japan; sea route to Southeast Asia) + Silk Road monk painting (cutout), CONTAGIOUS DIFFUSION.
Branches map: Theravada (Sri Lanka, Myanmar, Thailand, Laos, Cambodia), Mahayana (China, Korea, Japan, Vietnam, Taiwan),
Vajrayana (Tibet point, Bhutan, Mongolia), three colours with a key. Luang Prabang alms photos. Novices / shinbyu photos.
Meditation beat: a drawn phone with a breathing circle. Puzzle map (India dark, Buddhist Asia lit). Nalanda painting (cutout) then
the ruins photo; three numbered reasons on cards: 1 lost royal support, 2 Hinduism absorbed it, 3 Nalanda destroyed c. 1200.
End: "its hearth faded, the religion lived on" over the map.

### Ch05 · A kitchen open to everyone (`ch05_sikhism`, 103 s) · music `music/r_utopia.mp3` at 0.15
Punjab map (India-Pakistan border visible, Amritsar dot), "c. 1500", GURU NANAK as text only (no face); early langar painting
(volunteer cutout). Golden Temple photos (night, pool). GURDWARA and LANGAR definitions; langar hall photos; "100,000+ meals on big
holidays" Stamp; "doors on all four sides" over the temple. Five Ks photo (and kara on the wrist), sikh_man cutout with "Singh =
lion", "Kaur = princess". UNIVERSALIZING stamp, then RELOCATION DIFFUSION with a map of arrows to Canada, UK, US. Bar chart:
Sikhs as share of population, Canada 2.1% (2021 census) vs India 1.7% (2011 census), Canada bar coral. Brampton and Surrey dots
on a Canada map; archival Vancouver gurdwara photo; Calgary gurdwara photo.

### Ch06 · Back to the tree (`ch06_ending`, 27 s) · music `music/r_ending.mp3` at 0.15 (warm first 30 s)
Tree photo again with the question; three side-by-side maps (copy the ThreeMaps idea from Ch01) with labels: ETHNIC / relocation,
UNIVERSALIZING / migration, UNIVERSALIZING / hierarchical + contagious; back to the pilgrims photo for the last line. After the
narration, an end card (use ChapterShell's `extra` frames, ~6 s, and add the same to CH06_FRAMES): "Before class: Mauritius is
about half Hindu, even though it's thousands of miles from India. Is Hinduism ethnic or universalizing? What type of diffusion
brought it there?"
