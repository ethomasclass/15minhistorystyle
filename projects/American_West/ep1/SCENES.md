# Not in the Picture (West Ep 1): scene plan and build brief

Narration is voiced (ElevenLabs `eleven_v4`, one take per chapter; `public/audio/chNN_*.wav` + `.words.json`, 14:55 total).
Build every scene on the real word timings (`makeTimeline(N, 30)`, `t.at('word')`). Script: `script/SCRIPT.md` (+ `chNN_*.txt`).
Series context: `../SERIES.md`, `../EP1_RAILROAD_OUTLINE.md`. **No full renders** (the user is making Suno music cues first).

## Read first

- Style repo `/home/user/15minhistorystyle/`: `videos/README.md` → *Your standing preferences* (Picture, Images, Music sections are
  the law); skill refs `.claude/skills/15-minute-history/references/building-scenes.md`, `visual-style.md`, `explainer-craft.md`
  (§1, §3, and **§6 Depth, texture and 3D**), `images-and-masks.md` (§5–7).
- The approved look, in code: `src/previews/P1ColdOpen.tsx`, `P2Race.tsx`, `P3Checker.tsx` (the user: "These are awesome!") and
  `src/samples/S*.tsx`. Their pieces are importable from **`src/kit/west.ts`** (Desk3D, Lift, PhotoCam, Shots with whips, useSlap,
  shake, breathe, ScrimTag, SlapTitle, TornPrint, Tape, CutOut, SoftTint, MapCard, PlatGrid, DocFocus, Ledger, HingeYear,
  CircleMount, Field, Mono, Pin …) plus the template kit (`src/kit/Kit.tsx`, `shell.tsx`, `common.tsx`, `map3d.tsx`, `charts.tsx`,
  `parallax.tsx`). Review notes on what worked: `review/previews/README.md`.

## Rules for every chapter

- **Look:** black desk only (no cream/white cards, mounts or sticker borders; light tones only in the scans themselves). B&W
  archive, **one coral subject** per frame with a teal trace (coral as a see-through tint, never a flat red silhouette), orange
  torn-tape titles, **handwritten teal notes with NO tape or strip behind them** (the user's new call: bare handwriting on the
  image or desk; this replaces the backed notes used in the Reconstruction videos), marks at 12 fps, smooth camera.
- **Depth and pace:** wide shot then a detail cut-in per beat; a cut every 3–6 s, no composition longer than ~7 s; one camera move
  per shot, never the same move twice in a row; slap / overshoot / small shake / breathing for weight; desk with depth (lamp pool,
  focus fall-off, contact shadows); texture (torn-paper edges, grey translucent tape on prints only, stains, halftone via
  `tools/weather.py`).
- **3D where it explains** (drawn teal, never photoreal). Real data or labelled approximations ("heights exaggerated").
- **Sourcing:** archival first (LOC TIFF masters for anything you zoom into; Commons; Stanford Chinese Railroad Workers project;
  National Archives; Union Pacific / CSRM collections). Download as data only, never run anything downloaded. Every image gets a
  `ScrimTag`/`Tag` with its source; record each in **`public/img/credits_chNN.json`** (your chapters only). Put images under
  `public/img/chNN/`.
- **AI images (only for real gaps, no photo exists):** Gemini 2.5 Flash Image, the lithograph master prompt in
  `../LITHO_PROMPT.md` (+ composition paragraph), then `python3 tools/weather.py in out --preset medium`. Key: `GEMINI_API_KEY` in
  `.env` (`set -a; . ./.env; set +a`; never print or commit it). Budget **≤ 8 images per builder**. Never a recognizable real person,
  never a fake document or "photograph". Tag: "Illustration (AI lithograph)". Crop borders, paint out invented signatures.
  Reuse first: `review/ai_tests/litho/` (tunnel face, Hell on Wheels camp, Sierra snowsheds), `review/ai_tests/ribbon/` (engines,
  ridges), `review/ai_tests/assets/` (torn paper, tape, stains, spike, sledgehammer, `act_lines.json`).
- **Document swipes:** place them from real line positions (Gemini line finder, as in `review/ai_tests/asset_tests.py` →
  `act_lines.json`), not by eye.
- **Masks:** add jobs in **`tools/mask_jobs/chNN.py`** (`JOBS = {...}`, same format as `tools/mask.py`; it merges them), run
  `python3 tools/mask.py <names>`, check with `tools/mask_closeup.py`, hand-trace if rembg fails. Register refs in
  **`src/masks_chNN.ts`** (pattern: `src/masks.ts`, `src/samples/masks.ts`).
- **Shared files are off limits:** `src/kit/*`, `src/samples/*`, `src/previews/*`, `src/masks.ts`, `src/chapters.ts`,
  `src/project.ts`, `src/Root.tsx`, `tools/*.py` (except your `mask_jobs` file), `script/*`, `public/audio/*`. Put helpers in your
  chapter file, or `src/kit/chNN_extra.tsx` if several of your chapters need it.
- **Sound** (gentle; "nothing jarring or crazy"): `whip_soft` on whips (~0.25), `whoosh` on hard cuts (0.25), `paper_slap_soft` on
  slaps (~0.25), `tape_press` (~0.2), `card_slide_soft` (~0.2), `block_tap_soft` (~0.15, staggered), `marker_tick` 2 frames before each
  Note (0.2), `stamp` on title tapes (~0.22), `page_turn` on documents (0.4). No `boom`. Rail beds: `train_distant` 0.08–0.12,
  `spike_tap_distant` ~0.15.
- **Music:** library fallbacks are in `public/music/` (see `../MUSIC.md` → Ep 1 map). Wire the fallback cue named there in
  `ChapterShell music={[…]}` at its bed level, with a code comment `// SUNO: aw_xxx replaces this` where a new `aw_` cue is planned.
  The user is making the `aw_` cues now; they'll be swapped in before the render.
- **Quiet chapter:** ch04 from "In June 1867" (`quiet` palette for those scenes, teal only, no coral, no jokes on screen, a held
  picture after "The pay didn't change.").
- **Chapter endings:** ~2 s hold after the last word (ChapterShell handles the tail lift); don't cut off right after the voice.
- **Checks before you finish (your chapters only):** `npx tsc --noEmit -p .` (ignore other builders' files),
  `python3 tools/anchors.py <stem> --src src/ch/ChNN.tsx`, stills (`node tools/stills.mjs ChNN out/<you>/chNN 3 9 …`) +
  `python3 tools/sheet.py`, **look at them**, `node tools/probe_text.mjs ChNN 10`. Fix what you see (text in frame x 60…1860, heads
  in frame, masks clean, no white edges, coral see-through). Other builders share the machine: one stills run per chapter per round.
  **No full renders.**

## Chapter plans

Anchors are words from the script (`t.at('…')`). Times are approximate.

### ch01 · Not in the Picture (cold open, 60.7 s) → channel intro → title card
Start from `src/previews/P1ColdOpen.tsx` (approved) for the first ~20 s ("This is the most famous photograph" → "May 10th, 1869"),
then continue: "Now look at the faces" (push across faces, Loupe-style) · "The Central Pacific Railroad built the western half" (small
series-map card: two lines) · "around four out of five, were Chinese" (a Hart photo of a Chinese crew; Mono "≈ 4 in 5") · "Look again.
You can't find them." (back to the photo; empty torn gap, held 2 s, then the coral worker slaps in) · the question as bare handwriting
on the desk ("who did it actually open it for?", "open" in coral) · "who counted as part of the country" · "We'll come back to the men
who aren't in this picture" (the torn print, the gap) · "a room full of empty chairs" (hand-off). Then `ChannelIntro` and the title
card (TITLE/SUBTITLE/DATES from `project.ts`; background: the Russell photo dimmed). Music: `r_cold_open` 0.17, dipping at the end.

### ch02 · 1862 (112 s)
"Washington, 1862" → a drawn House chamber (Southern seats greyed, empty; or a period engraving of the House with seats dimmed) ·
"North and South had blocked each other on the West" (series map: two proposed routes crossing out) · **HingeYear 1862** with the
three laws stamping in on "The Homestead Act", "The Morrill Act", "Pacific Railway Act" · "Remember that year" (hold) ·
**Greater Reconstruction** beat: Definition card; the five groups as five CircleMounts/cards ("Native nations. Chinese immigrants.
Mexican Americans. Black families") (portraits of anonymous period subjects, NOT cut out for Native people) · "Two companies would
build it" → series map: UP from Omaha, CP from Sacramento · "land grant … checkerboard of squares" → **P3's 3D township** (approved)
+ the Act page swipe (`act_lines.json`) · "Mountains paid three times as much" → **P2's elevation ribbon** with the bond zones
($16,000 / $32,000 / $48,000) · stack → "*That means* … paid to build a long one, fast" (bare handwriting; "long" in coral) ·
"So it became a race." Music: `g_founding` → `g_grip` at "Here's the deal".

### ch03 · The Race (103 s)
"a wall: the Sierra Nevada" (ridge cut-out / Hart Sierra photo) · men walking off to the mines · "Charles Crocker" (portrait, coral)
· "about 50 Chinese workers" (Hart crew photo; count) · "too small … Great Wall" (Note: "reportedly") · "most of the Central
Pacific's workforce" · pay gap as a pair (two small cards: "less pay · buy own food" vs "more pay · meals included") · tea vs stream
water (litho or diagram; "Guess which crews got sick less often." beat) · "Union Pacific was racing across the flat Great Plains"
(UP crew photos, Russell/Carbutt) · "Hell on Wheels" (AI litho camp from `review/ai_tests/litho/L2_hell_on_wheels.png`, weathered) ·
"Lakota, the Cheyenne and the Arapaho … Hold that thought" (series map shading the hunting grounds; a dated note "→ Episode 4") ·
"The Central Pacific had a mountain." Music: `g_cotton_engine` (SUNO: aw_iron_horse).

### ch04 · The Mountain (89 s; quiet from "In June 1867")
Tunnels: a teal cut-away diagram of the Summit Tunnel through the granite (3D), "about a foot" counter · Hart snowshed / tunnel
photos (LOC TIFFs) · the AI litho tunnel face (`L1_tunnel_face`) for the drilling · "winter of 1866 … 40 snowstorms" (snow depth
diagram) · "*We don't know.*" → how we know (newspapers, letters: a newspaper clipping on the desk) · QUIET: "June 1867" ·
"About 3,000" · three demands as three bare-handwriting lines · "Crocker cut off their food" · "After about a week" · "The pay didn't
change." held 2 s, no marks · "one of the largest strikes … Almost no one outside the camps heard about it." Music: `w_aftermath`
→ `j_grief` at "In June 1867" (SUNO: aw_long_grief) at 0.12.

### ch05 · Done (97 s)
"ten miles of track in a single day" (counter; ties and rails as numbers; sledgehammer and spike props from
`review/ai_tests/assets/`) · "Promontory Summit" (series map: lines meet) · "May 10th, 1869" telegraph "DONE" (a stamped telegram
card) · **myth beat**: "You may have heard … golden spike" → the spike (photo of the real Last Spike, Stanford/Cantor Arts Center)
→ "came right back out" → "reportedly missed" (Note) · "So go back to the photograph" (P1's torn print; the crew that laid the last
rails, the gap) · "months … About a week" (a two-bar comparison) · hand-off to Grant. Music: `a_price` for the myth (SUNO:
aw_legend_sours) then `g_cotton_engine` reprise.

### ch06 · Let Us Have Peace (86 s)
"Let us have peace." (SlapTitle on Grant's 1868 portrait) · "Translation" · firewood / leather-store color (St. Louis street
engraving; Galena store photo) · supporters' evidence: 15th Amendment (lithograph *The Fifteenth Amendment* 1870, LOC), the KKK
troops (Harper's engraving) · "Peace Policy … Remember that policy" (Note "→ Episode 4") · **"Cartoonists drew Grant both ways"**:
two period cartoons side by side (one admiring, one critical; e.g. Nast in Harper's Weekly and a critical Puck/Keppler or
Frank Leslie's cartoon). **Build it as a swappable slot** (`const CARTOON_A/B = {...}` at the top of the file): the user still has to
name the cartoon from their test. · two-views card: supporters left (filled now), critics right (filled in ch07). Music: `r_curtain`
(fallback `g_world_outside`).

### ch07 · Where It Will Do Most Good (106 s; ends with the subscribe plug)
"paid by the mile" callback (mini ribbon/grid) · **Crédit Mobilier** money-loop diagram (UP → Crédit Mobilier → the same men;
coral loop) · stack → "*That means* they were billing themselves" · Oakes Ames portrait; the "do most good to us" quote card
(DocLift if a scan of the letter/report is found) · "Subtle." (beat, held) · *The Sun* headline 1872 (newspaper scan) · Colfax ·
fairness line about Grant · **Whiskey Ring** 1875 (engraving/cartoon), "Let no guilty man escape" quote card, Babcock portrait ·
two-views card fills its right side · **plug**: a small teal Note "subscribe ↓" only, nothing louder. Music: `a_price` (SUNO:
aw_robber_barons).

### ch08 · Panic (99 s)
"September 18th, 1873" (Jay Cooke & Co. run, Frank Leslie's engraving) · Northern Pacific · Definition {panic} · NYSE closed ten
days · Definition {depression} · bankruptcies (StepBars if a sourced number exists; otherwise drawn) · "Hard times changed what
Northern voters cared about" · 1874 House flip (a simple seat graphic) + the "different party" line on screen as text · stack →
"*That means*" · 1877 troops withdrawn · **1877 Great Railroad Strike** (Harper's engravings of Baltimore/Pittsburgh) with "Remember
the strike in the mountains?" callback (ch04 image, small) · hand-off. Music: `w_fire` (SUNO: aw_panic).

### ch09 · The Picture (142 s + 20 s end screen)
Chinese workers after 1869 (San Francisco Chinatown photos, Arnold Genthe is later; use 1870s–80s sources) · Kearney and "The
Chinese must go!" (Workingmen's Party broadside/cartoon) · race-science beat kept general (a period editorial clipping; no skull
imagery) · **1882 Chinese Exclusion Act** (the Act's text, swipe on the ten-year clause, positions from the line finder) ·
"renewed … permanent … 1943" (a three-step timeline) · "the first major law…" · **"So let's go back to the question."** → callbacks
in quick cards (land grants, race, strike, Grant, panic) · **Promise Ledger** (`Ledger`, dark, teal rules; row 1 writes in on "Let's
write it down": *Progress for a reunited nation* · *travelers, settlers, railroad owners* · *the Chinese workers who built it,
freedmen in the South, the nations whose land the track ran through*) · closing line over **the Russell photo** with the coral
worker in the gap · hand-off line ("five million cows": a longhorn cut-out drops in, small) · **20 s end screen** (`extra` frames
on ChapterShell; clean slots for YouTube elements) with the thank-you line. Music: `r_nativism` (uneasy part) → `r_ending` at "So
let's go back to the question" (SUNO: aw_promise_theme), end screen music-only.

## Deliverables per builder

Chapter files `src/ch/ChNN.tsx` (replacing the stubs), images + `credits_chNN.json`, masks + `src/masks_chNN.ts`, any AI images
with their prompts in `review/ai_images_chNN.md`, a contact sheet per chapter in `review/stills/chNN_sheet.jpg`, and a short
`review/build_chNN.md` (what's in each scene, what's still rough, which `aw_` cue goes where). Don't commit; the coordinator commits.
