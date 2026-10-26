# Cheap as Dirt (West Ep 2): scene plan and build brief

Narration is voiced (ElevenLabs `eleven_v4`, Ellis, one take per chapter; `public/audio/chNN_*.wav` + `.words.json`, 14:37 total).
Build every scene on the real word timings (`makeTimeline(N, 30)`, `T.at('word')`). Script: `script/SCRIPT.md` (+ `chNN_*.txt`).
Series: `../SERIES.md`, `../EP2_RANCHING_MINING_OUTLINE.md`. **No renders** (the user wants contact sheets only; the Suno cues
`aw_long_drive`, `aw_boomtown`, `aw_white_cold` are not made yet).

## Read first

- Style repo `/home/user/15minhistorystyle/`: `videos/README.md` → *Your standing preferences* (the law); skill refs
  `.claude/skills/15-minute-history/references/building-scenes.md`, `visual-style.md`, `explainer-craft.md` (§1, §3, §6),
  `images-and-masks.md` (§5–7).
- **Ep 1 is the model, in code:** `../ep1/src/ch/Ch01.tsx`–`Ch09.tsx` (finished and approved by the user, rendered as
  `../ep1/renders/Not_In_The_Picture_720p.mp4`), `../ep1/SCENES.md` (its brief), `../ep1/review/build_ch*.md` (what worked). Copy
  patterns freely: Ch01 (cold open → `ChannelIntro` → title card), Ch02/Ch03 (series map), Ch04 (3D cut-away, quiet section,
  props via `Prop`), Ch05 (myth beat), Ch06/Ch07 (cartoon, two-views, node diagrams), Ch09 (Promise Ledger, closing line, end screen).
- Kit in this project: `src/kit/west.ts` (re-exports `src/samples/kit.tsx` + `src/previews/fx.tsx`: Desk3D, Lift, PhotoCam, Shots,
  useSlap, shake, breathe, ScrimTag, SlapTitle, TornPrint, Tape, CutOut, SoftTint, MapCard, PlatGrid, DocFocus, Ledger, HingeYear,
  CircleMount, Field, Mono, Pin …), `src/kit/ch01_extra.tsx` (WestMap, MRoute, MRegion, MPin, MStand, Hand, Tally, DarkCard),
  `src/kit/ch04_extra.tsx` (Pic, DeskCam, Prop, Print, Big, Counter, Label, HBar, Line, Stage, Sounds, Lines),
  `src/kit/ch07_extra.tsx` (Node, Wire, Strike, Marks, WShots), `src/kit/shell.tsx`, `Kit.tsx`, `common.tsx`, `map3d.tsx`.
- **New for Ep 2:** `src/kit/trails.tsx`: the series map's Ep 2 layer (`TLINES.chisholm/western/shawnee/goodnightLoving`,
  `kansasPacific/santaFe/kcToChicago`, `longWalk`, `southToMexico`, `toTheHills`, `custer1874`; `TREGIONS.greatSioux1868/blackHills`;
  places in `TPL`), `MTrail` (dashed dusty trail, distinct from MRoute's railroad), `MHerd` (the longhorn walking a trail),
  `MProp` (a pre-cut prop standing on the map). Check render: `src/previews/PTrails.tsx` (the P-Trails composition).

## Assets ready

- **Archival images:** `public/img/chNN/` with credits in `public/img/credits_chNN.json`; the list and notes in `review/IMAGES.md`;
  contact sheets `review/images_chNN_sheet.jpg`. Look at them before planning a shot. More may be found (any public-domain source
  via `tools/find_images.py` / `tools/commons.py`, `CREDITS_FILE=public/img/credits_chNN.json`).
- **AI lithograph props (cut out):** `public/img/props/<name>.jpg` + masks `public/img/masks/<name>.json` / `_subject.png`
  (use `maskRef` in your `src/masks_chNN.ts`, then `CutOut` or ch04_extra's `Prop`); pre-cut transparent copies in
  `public/img/props/cut/<name>.webp` (for small things, `MProp`, `<Img>`). Contact sheet: `review/ai_props/sheet_cutouts.jpg`.
  p1_letter (blank envelope), p2_longhorn, p2_coin_one, p2_coin_stack, p2_stock_car, p3_saddle, p3_lariat, p3_branding_iron,
  p4_chuck_wagon, p5_chaps, p5_spurs, p5_sombrero, p5_corral, p5_bronco, p6_gold_pan, p6_pick_shovel, p6_nugget, p7_sluice,
  p7_headframe, p7_stamp_mill, p7_ore_cart, p8_wire_spool, p8_barb, p8_nippers, p9_post_drift, p9_hay_rake, p9_haystack.
- **AI lithograph plates (16:9, weathered):** `public/img/props/L2_cowtown.jpg`, `L3_river_crossing.jpg`, `L8_fenced_range.jpg`,
  `L9_blizzard.jpg`. Prompts for all of them: `review/ai_props/PROMPTS.md`.
- More AI images if a shot needs one: `tools/props.py` (add a job; ≤ 10 per builder; same lithograph master prompt).

## Rules for every chapter (Ep 1's, unchanged unless noted)

- **Look:** black desk only (no cream/white cards, mounts or sticker borders; light tones only in the scans). B&W archive, **one
  coral subject** per frame with a teal trace (see-through tint, never a flat red silhouette), orange torn-tape titles, **bare teal
  handwriting with no tape behind it**, marks at 12 fps, smooth camera. AI litho images keep their muted tints (buff, slate,
  faded red), desaturated if they compete with the coral subject.
- **Depth and pace:** wide shot then a detail cut-in per beat; a cut every 3–6 s, no composition longer than ~7 s; one camera move
  per shot, never the same move twice in a row; slap / overshoot / small shake / breathing for weight; desk with depth (lamp pool,
  focus fall-off, contact shadows); texture.
- **Transitions are gentle** (the user's call, Oct 2026): use `Shots` from `src/previews/fx.tsx` as is ('whip' is a drifting
  crossfade, 'cut' a 6-frame dissolve). Don't build hard cuts or fast whips of your own.
- **3D where it explains** (drawn teal, never photoreal).
- **Sourcing:** archival first for real people, events and documents; every archival image gets a `ScrimTag`/`Tag` with its source.
  **AI images get no tag at all and never the word "AI" on screen.** Never a recognizable real person in AI; never a fake document.
- **Masks:** jobs in `tools/mask_jobs/chNN.py`, run `python3 tools/mask.py <names>`; pale objects on white:
  `tools/mask_white.py`; check with `tools/mask_closeup.py`; register in `src/masks_chNN.ts`.
- **Shared files are off limits:** `src/kit/*`, `src/samples/*`, `src/previews/*`, `src/masks.ts`, `src/chapters.ts`,
  `src/project.ts`, `src/Root.tsx`, `tools/*.py` (except your `mask_jobs` and `props.py` jobs), `script/*`, `public/audio/*`.
  Put helpers in your chapter file, or `src/kit/chNN_extra.tsx` for several of your chapters.
- **Sound** (gentle): `whip_soft` on whips (~0.25), `whoosh` (0.2), `paper_slap_soft` (~0.25), `tape_press` (~0.2),
  `card_slide_soft` (~0.2), `block_tap_soft` (~0.15), `marker_tick` 2 frames before each Note (0.2), `stamp` on title tapes
  (~0.22), `page_turn` on documents (0.4). No `boom`. Beds where they fit: cattle lowing / hooves only if `public/sfx/` has a soft one.
- **Music:** set every cue with `bed(cue, gap)` from `src/kit/levels.ts` (13 LU under the voice). Library cues are in
  `public/music/` (copy any missing one from `/home/user/15minhistorystyle/music/cues/`). Where a new Suno cue is planned, wire the
  fallback and comment `// SUNO: aw_xxx replaces this`. Map (from `../MUSIC.md`):
  ch01 `r_cold_open` (SUNO: aw_white_cold) · ch02 `m_frontier`, then `aw_iron_horse` from "That's where the railroad comes in" ·
  ch03 `m_frontier` (SUNO: aw_long_drive) · ch04 `m_lament` (from "How did they get there?" at a lower bed) · ch05 `aw_legend_sours`
  (turn at "none of those": `LEGEND_TURN = 25` s, see Ep 1 Ch05) → `a_mexico` (SUNO: aw_long_drive) · ch06 `j_intrigue` →
  `r_temperance` from "Newspapers did the rest" (SUNO: aw_boomtown) · ch07 `g_cotton_engine` (SUNO: aw_boomtown, hollow turn on
  "Just underground.") · ch08 `g_grip` · ch09 `j_grief` (SUNO: aw_white_cold) at bed gap 14 · ch10 `aw_promise_theme` to the end screen.
- **Spanish words** have v4 accent tags in the script files; the tags never reach the timings. Anchor on the plain words.
- **Quiet sections** (teal only, no coral, no jokes on screen, `quiet` palette like Ep 1 ch04): ch04 from "How did they get there?"
  to "the Army needed beef."; all of ch09.
- **Chapter endings:** ~2 s hold after the last word (ChapterShell handles the tail lift).
- **Checks (your chapters only):** `npx tsc --noEmit -p .`, `python3 tools/anchors.py <stem> --src src/ch/ChNN.tsx`,
  stills (`node tools/stills.mjs ChNN out/<you>/chNN 3 9 …` or more) + `python3 tools/sheet.py`, **look at them**,
  `node tools/probe_text.mjs ChNN 10`. Fix what you see (text in frame x 60…1860, heads in frame, masks clean, no white edges,
  coral see-through). One stills run per chapter per round (the machine is shared). **No full renders.**

## Chapter plans

Anchors are words from the script. Durations from the voice.

### ch01 · The Last of the Five Thousand (cold open, 71.5 s) → ChannelIntro → title card
Copy Ep 1 Ch01's structure (cold open, then `ChannelIntro` from `kit/ChunkIntro`, then the title card from `project.ts`:
CHEAP AS DIRT / Cattle, Gold, and the End of the Open Range / 1866 – 1887). **Russell's watercolor at frame 0**, camera already
drifting in (it is the thumbnail image too) · "a message to a boss … cattle were dead" · Montana, Helena (small series-map card or
a pin) · "He wrote to his foreman" (the envelope prop slides in on the desk) · "a young cowhand named Charlie Russell" (Russell photo,
coral) · "Look at it … hip bones" (push to the hips; teal loops) · "Now look behind him. Those are wolves." (teal loops on the
wolves; the beat lands on "wolves") · titles "WAITING FOR A CHINOOK" and "THE LAST OF THE FIVE THOUSAND" on orange tape · "a warm
wind that melts the snow. It never came." · "Twenty years earlier" → a quick glimpse of plenty (L2_cowtown plate, the longhorn
prop) · the question as bare handwriting ("who actually got rich?", "rich" in coral) · "who owned the grass" · "we'll come back to
this steer" (back to the painting, held) · "It starts in Texas" (hand-off). **The title card must not be silent:** keep Ep 1's stamp
and let the cold-open music carry under it (or start ch02's bed early); the intro jingle is clicks only.

### ch02 · Four-Dollar Cows (86.8 s)
"Last time, I promised you a man with an idea and about five million cows" (callback: Ep 1's end, a longhorn drops in) ·
"Texas, 1865" (map: Texas lit) · Confederate soldiers home, "almost no money" · cattle ran wild "five million longhorns"
(a herd photo; Tally or a counter) · **the price gap as a pair: $4 vs $40** (p2_coin_one vs p2_coin_stack on the desk, each with a
stamped tag "TEXAS · ≈ $4" / "CHICAGO · ≈ $40"; "if you could find anyone with four dollars" beat) · "Northern cities were hungry for
beef" · "That's where the railroad comes in" → **series map**: Ep 1's rail lines, then the Kansas Pacific to Abilene (MRoute,
coral) · **Joseph McCoy** (portrait, coral) · "about a dozen log huts" (his book page with DocFocus on the line, if the scan has
it; else his words as a quote card) · "pens, a hotel and a shipping yard" (Abilene engraving; L2_cowtown) · **stack → "That means a
cow became a ticket."** (bare handwriting; the stock car prop rolls) · {open range} Definition · "About a thousand miles." (map:
the line from Texas to Abilene with a "≈ 1,000 mi" note).

### ch03 · The Long Drive (83.1 s)
**The cattle-drives map is the chapter's spine** (test item): each trail draws on with `MTrail` on its own word: {Chisholm Trail}
(coral, with `MHerd`) to Abilene; "Indian Territory, today's Oklahoma" (MRegion); the Western Trail to Dodge City; the
Goodnight-Loving Trail west then north up the Pecos ("Hold onto that one": it stays lit). Show the Shawnee trail faintly unnamed.
· "Picture one drive" → the numbers as a card or Counters: ≈ 2,500 cattle · 10–12 men · 10–15 mi/day · 2–3 months · the crew:
trail boss, cook with his wagon (p4_chuck_wagon small, or a photo), newest riders "eating dust" (props: saddle, lariat) ·
**"Three things could end a drive"** with a 1/3 · 2/3 · 3/3 counter: stampede (engraving), rivers (L3_river_crossing plate),
the nations' toll (Cherokee; map) · "five and ten million cattle" · "one pair of ranchers went the other way … the United States
Army" (map: the Goodnight-Loving trail glows; hand-off).

### ch04 · Beef for Bosque Redondo (104.2 s; quiet from "How did they get there?" to "the Army needed beef.")
Goodnight and Loving portraits (Goodnight coral) · "about two thousand cattle … along the Pecos River, to … Fort Sumner" (map:
Goodnight-Loving trail to Fort Sumner) · "Why there?" · "about eight thousand Diné, or Navajo, people … Mescalero Apache" (Fort
Sumner / Bosque Redondo photos; **no cut-outs of Diné or Apache people**, no coral on them; cards only) · QUIET: "For generations …
raided each other" · "the Army's commander … believed held gold … farmers on a reservation" · "Troops led by Kit Carson burned
their fields, cut down their orchards and killed their sheep" (Kit Carson portrait as a plain card; Canyon de Chelly photo) ·
"starving families surrendered" · **the Long Walk on the map** (`TLINES.longWalk`, teal, slow) "about three hundred miles" ·
"Hundreds died on the way." (held, no marks) · {Bosque Redondo} Definition · "The water was bad, and the crops failed" · end of
quiet · "So let's say it plainly … a prison camp." (bare handwriting, plain) · "$12,000 in gold" · {chuck wagon}: **p4_chuck_wagon
with labelled parts** (box of shelves and drawers, the lid that folds into a table; a 3D or drawn cut-away is welcome) · "Hold onto
Bosque Redondo … the last episode" (Note "→ Episode 4") · hand-off.

### ch05 · Who the Cowboys Were (126.4 s)
**Myth beat:** "the cowboy from the movies" (a dime-novel cover or Wild West poster, slapped down) · "Tall, white, older, and doing
pretty well" (four quick marks) · "The real thing was usually none of those." (the marks strike through; `aw_legend_sours` turns here)
· "teenagers or young men … $25 to $40 a month … About a dollar a day" · "one in four … Black" (Tally: 4 figures, 1 coral; or a
photo of a Black trail crew) · "enslaved on Texas ranches … for wages" · **Bose Ikard** (photo, coral; "Remember Goodnight and
Loving?"): Goodnight's words as a quote card "farther than any living man" / "my detective, banker, and everything else" · trail
vs. town: two small cards (same food, same ground / the color line) "Both things were true." · **the escape south**: map
`southToMexico` to the Rio Grande ("Not north. South.") · "three and ten thousand" · **Bass Reeves** (photo with badge, coral):
"ran north instead, into Indian Territory" (map), "In 1875 … deputy U.S. marshal" (a dated card) · **vaqueros** (photos or
Remington drawings): **each English word pairs with its Spanish source as two torn tags, with a prop**: Lariat ← *la reata*
(p3_lariat), Chaps ← *chaparreras* (p5_chaps), Ranch ← *rancho* (p5_sombrero or p5_spurs), Rodeo ← *rodeo* (p5_corral),
Bronco ← *bronco* "It means rough." (p5_bronco) · "In 1874 … the Black Hills" (hand-off; HingeYear tease).

### ch06 · 1874 (83.8 s)
**HingeYear 1874** ("1874." alone) · "First, a promise." **1868 Fort Laramie Treaty** (the real page; DocFocus/DocLift on
"absolute and undisturbed use and occupation", coral swipe) · {Black Hills} Definition; map: `greatSioux1868` + `blackHills` ·
"Hold onto that treaty. It's where the last episode begins." (Note "→ Episode 4") · Custer expedition: the Illingworth wagon-train
photo, Custer portrait (coral), map `custer1874` · "two miners" · "The miners found gold … at the grass roots" (p6_gold_pan,
p6_nugget hero shot) · "Newspapers did the rest" (the 1874 headline) · "Prospectors started pouring in" (map: `toTheHills`
arrows crossing the treaty line; p6_pick_shovel) · "1875 … about six million dollars, or rent them" · "The Lakota said no."
(a held card; **the resistance card preview**: WHO The Lakota · WHERE The Black Hills · WHEN 1875 · WHY treaty land · HOW IT ENDED →
Episode 4; same layout Ep 4 will use, see `../SERIES.md`) · "Deadwood … thousands of people" (Deadwood photo) · **stack → "That means
a promise on paper lasted about six years"** · hand-off "So who actually got the gold?".

### ch07 · Who Got the Gold (69.5 s; ends with the plug)
**The three steps, counted, as cut-outs on the desk** (or a drawn 3D cross-section of a hill): one p7_sluice / p6_gold_pan
{placer mining} · two "locked inside solid rock, deep underground" (p7_headframe, a shaft drawn down into the rock) · three
"shafts, machines, and a mill" (p7_stamp_mill; "That takes money. A lot of it." with p2_coin_stack) · **Homestake**: 1877,
George Hearst (portrait, coral), "$70,000", "one of the richest gold mines in the world", "forty million ounces", "until 2002"
(Homestake photos) · stack → "That means most miners ended up where they'd started. Working for wages. Just underground."
(p7_ore_cart) · **plug**: a small teal Note "subscribe ↓" and "cheap as dirt" in handwriting, nothing louder.

### ch08 · Cheap as Dirt (86.0 s)
"In 1874, the same year as the gold" · Joseph Glidden (portrait, coral), DeKalb, Illinois (map pin, far east) · **the patent
drawing** (US 157,124): "Look at the drawing. Two wires twisted together. And every few inches, a short, sharp barb" (DocFocus
and teal loops on the barb; then **the p8_barb hero shot**, huge in the foreground over L8_fenced_range blurred, like Ep 1's spike) ·
{barbed wire} Definition · "almost no trees … cheap, light and fast" (p8_wire_spool) · **John Gates**: San Antonio corral of wire
with longhorns (portrait; L8 plate or a drawn corral), the slogan on three orange tapes: "LIGHT AS AIR" · "STRONGER THAN WHISKEY" ·
"CHEAP AS DIRT" (with "the way the story's told" as a small Note) · **two ways to see it** (Ep 1's two-views card): farmers fenced
crops ↔ big ranchers fenced public land and water; small ranchers and cowboys found the range closed · "wire cutters"
(p8_nippers) · 1883 drought, fence cutting at night, {range wars} Definition, 1884 "a prison crime" · **stack → "That means the open
range didn't end with one battle. It ended one fence post at a time."** · "The weather did it in one winter." (hand-off; first
snow in the frame).

### ch09 · The Big Die-Up (88.5 s; all quiet, voiced slower)
Teal only, no coral, no jokes; longer holds. "By the 1880s, the northern plains were crowded" (map: Montana, Wyoming, Dakota) ·
**three causes, counted** as a teal stacked diagram: one too many cattle (investors "from the East, and even from Britain and
Scotland": a herd photo; a stock certificate is fine as a prop), two "the summer of 1886 was hot and dry", three "the winter …
January 1887, a blizzard" (L9_blizzard plate) · "the snow froze into a hard crust" (a drawn cross-section: crust over grass) ·
"They drifted with the wind, until they hit a fence, or a ravine. And they stopped." (p9_post_drift; hold) · "The creeks were full
of dead cattle." (period photo if found; hold ~2 s, no marks) · {Big Die-Up} Definition · "more than half" · **Theodore Roosevelt**
(the 1885 rancher photo, plain card, no coral), the quote "The losses are crippling." · "That's the winter Charlie Russell
painted." (the watercolor returns) · "Smaller herds. Fenced pastures. Hay" (p9_haystack, p9_hay_rake) · "The open range was over."
· "So, let's go back to the question." (hand-off).

### ch10 · The Last of the Five Thousand (77.1 s + 20 s end screen)
"So who actually got rich?" · quick callback cards: McCoy (ch02), Goodnight + "a British investor" (ch04), the Homestake (ch07),
cowboys' wages and freedom (ch05: Ikard), the Lakota treaty (ch06) · **the Promise Ledger** (copy Ep 1 Ch09's `LedgerCard`):
**row 1 from Ep 1 already written** (Progress for a reunited nation · Travelers, settlers and railroad owners · The Chinese
workers who built it, freedmen in the South, and the nations whose land the track ran through), **row 2 writes in** on "Let's write
it down. Row two.": *Anyone with nerve can get rich* · *Herd owners, investors and the Homestake's owners; some cowboys, for a
while* · *Most cowboys and miners, small ranchers fenced out, and the Lakota, whose land was mined* · "So look at the steer again."
→ **the closing line over Russell's painting**: "It took about twenty years to turn four-dollar cows into a fortune. It took one
winter to turn it into a painting." · hand-off: "The cowboys moved on. The farmers stayed … The land itself." (a homestead teaser:
a plowed-field image, small) · **20 s end screen** (Ep 1 Ch09's `extra` frames; clean slots for YouTube elements) with the thank-you
line, **plus the Chunk History mark** if it fits cleanly (the static mark from `kit/ChunkIntro.tsx`; Ep 1 has no logo there).

## Deliverables per builder

Chapter files `src/ch/ChNN.tsx` (replacing the stubs; keep the exported `ChNN` and `CHNN_FRAMES` names), images +
`credits_chNN.json`, masks + `src/masks_chNN.ts`, any extra AI images (jobs in `tools/props.py`, prompts recorded), a contact sheet
per chapter in `review/stills/chNN_sheet.jpg` (about 24–36 frames across the chapter, every scene represented), and a short
`review/build_chNN.md` (what's in each scene, what's still rough, which `aw_` cue goes where). Don't commit; the coordinator commits.
