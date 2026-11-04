# Build brief: The Balloon War v2 (chapters 2–9 and the 3D pieces)

Project: `projects/Balloon_War/v2/` (Remotion 4, 1920×1080, 30 fps; `public/` and `node_modules/` are symlinks to `../public`,
`../node_modules`). Four builders work at the same time: **A** ch 2–4, **B** ch 5–7, **C** ch 8–9, **D** the 3D pieces.

## Your files, and only your files
- Chapter builders edit only their `v2/src/ch/ChNN.tsx` (skeletons are wired to the narration and music). Helpers may go in
  `v2/src/ch/chNN/`. The 3D builder edits only `v2/src/fx/*` (and adds entries to `v2/src/fx/registry.tsx`).
- **Do not edit** `v2/src/kit/*`, `v2/src/Root.tsx`, `v2/src/chapters.ts`, `v2/src/project.ts`, `v2/tools/*`, Ch01, or another builder's
  files. Need a change to a shared piece? Copy it into your folder and say so in your report.
- **Do not commit or push. No video renders.** The machine has 4 cores shared by four builders: check with **stills only**
  (`node tools/stills.mjs ChNN ../out/stills_chNN <seconds…>` from `v2/`, a handful per run), one run at a time, with
  `REMOTION_CHROME=$(ls -d /opt/pw-browsers/chromium_headless_shell-1243/*/)chrome-headless-shell.real`. 3D (three.js) stills
  need `--gl=swangle` (renderStill `chromiumOptions: {gl: 'swangle'}`); a three.js canvas must only mount after its textures load.
- Never use `rm -rf` with globs; write new outputs to a fresh folder instead.

## Read first
1. `v2/src/ch/Ch01.tsx`: **the finished cold open. Follow its patterns exactly**: `makeTimeline(N, 30)`, `t.at('phrase')` (and
   `t.at('phrase', n)` for the n-th occurrence), a cut 1 frame before the word that starts a new idea, each scene in
   `<Sequence from={cut} layout="none">` with beats passed as `t.at(..) - a`, `useScene(cuts)`, `Sfx` (whoosh per cut, stamp per tape,
   `WRITE` 2 frames before each note), `Print` (`v2/src/kit/print.tsx`) for archival prints on the black desk, `NoPhoto` labels.
2. `script/SCENES_v2.md` (your chapters' beats and assets), `script/SCRIPT_v2_story_arc.md` (narration, quote cards, fact-check flags),
   `public/img/IMAGES.md` (files and their on-screen source tags; v2 additions at the end), `script/SILHOUETTES.md` (palette, props).
3. Skill references: `.claude/skills/15-minute-history/references/building-scenes.md`, `visual-style.md`, `explainer-craft.md`.
4. Standing preferences: `videos/README.md` ("Your standing preferences").

## Kit
`Kit.tsx` (`Highlight` orange tape, `Note` teal handwriting, `Loop`, `Arrow`, `Tag`, `Traced`, `Tint`), `shell.tsx` (`ChapterShell`,
`Definition` vocab card, `Quote`, `Stamp`, `Photo`), `vox.tsx` (`Swipe`/`Spot`, `Slip`), `prop.tsx` (`Prop`, optional `coral` +
`trace`), `print.tsx` (`Print`), `silparallax.tsx` (`SilScene`: `a`, `b`, `cam`, `fog`, `fade`, `dust`, `insert` + `PlaneImg` to
put a cut-out on a plane), `levels.ts` (`bed()`), `common.tsx` (`DarkPaper`, `Sfx`, `WRITE`).

## Rules for this video
- **The look:** black notebook desk; archival prints B&W; **one coral subject per frame** (the balloon is always coral); teal marks;
  orange torn-tape titles (2–4 words, on screen ≥ 2 s); a new visual beat every 4–8 s; wide then detail; one camera move per shot;
  marks step at 12 fps, camera moves smooth.
- **Silhouette scenes** keep their own colours (no grayscale, no coral added, no source tag). Their figures are anonymous.
- **Source tag on every archival image** (from IMAGES.md); none on props, silhouettes or 3D pieces; never the word "AI".
- **Vocab:** {jet stream} (ch02), {geologists} (ch06) get a `Definition` card.
- **Quote cards** for: Tatsuo's three lines (ch04), "baffled the Japanese, annoyed and hindered them" (ch07), Archie's words and
  Dottie's question in plain type (ch08), the May 22 warning and Rei's "an act of resistance against being erased" (ch09).
- **Heavy chapter (ch08):** QUIET palette (`ChapterShell quiet`), no jokes, no shouting tapes, no coral, no victims' faces, no
  explosion imagery; slow camera; black for a beat after "too late"; the six names written by hand.
- **Text never within 96 px of the frame edge:** `SAFE=96 node tools/probe_text.mjs ChNN` must report nothing.
- **Anchors:** every `t.at` phrase must exist in the chapter's words.json (`python3 tools/anchors.py v2_chNN_<slug> --src src/ch/ChNN.tsx`
  if it runs here; otherwise check by hand).

## The 3D builder (D)
Drawn 3D, never photoreal: teal `#2FE0C4` lines on dark, cream sparingly, **one coral element** (the balloon), heights exaggerated
labelled. Reuse patterns from `projects/Diamond_Hoax/src/fx/` (terrain/drawn3d.tsx, TerrainSlab, LoopingRide, MoneyMap) and
`projects/Halloween_Bribe/src/fx/AtlanticMap.tsx`; every piece a pure function of the frame; beats as props (`at`, named beats) so a
chapter can anchor them to words; a test composition in `v2/src/fx/registry.tsx`; a header comment listing the props.
1. **PacificWinds**: North Pacific slab (Japan left, North America right, real coastlines: Natural Earth via the map tools or a
   simplified coastline you build), the jet stream as thousands of flowing teal particles from **real wind data** (NOAA 20th Century
   Reanalysis or NCEP/NCAR reanalysis, 250–300 hPa, a winter month of 1944–45 if reachable; otherwise a winter long-term mean, and
   say so on screen), a coral balloon riding it. Props: `windsAt`, `balloonAt`, `routeAt`, an option for the no-winds "too far" view.
2. **LandingMap**: tilted North America with the 285 incidents from `public/data/fugo_incidents.json` standing up as pins in date
   order with a month counter; a small launches-per-month bar (Mikesh: Nov 700, Dec 1,200, Jan 2,000, Feb 2,500, Mar 2,500, early Apr 400)
   dropping to zero in April; one pin at Bly on 5 May (colour as a prop: cream for ch08). Props for the date window to play.
3. **SandToBeach**: from drawn sand grains and tiny shells (an empty "coral" slot) pulling out to Japan's Pacific coast as a
   real-elevation slab, the Ichinomiya stretch (Chiba) lighting coral.
4. **AltitudeRibbon**: the three-day flight as a ribbon (distance × altitude 30,000–38,000 ft sawtooth, day/night bands), two
   sandbags dropping at each low point, a 32 → 0 counter, then the bombs.
Report each piece's props and what's on screen; chapters use placeholders until you finish.

## Test before you report
`npx tsc --noEmit -p .` from `v2/` (ignore other builders' files), anchors, stills at every scene (look at each; fix overlaps, empty
frames, unreadable text, a scene with nothing new for > 8 s), the text probe. A labelled contact sheet per chapter:
`review/contact/v2_chNN.jpg`. Report in under 250 words: scenes, anything imperfect, any asset you wished you had.
