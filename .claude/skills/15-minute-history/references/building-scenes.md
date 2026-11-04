# Building the scenes

Each chapter is a Remotion composition (`src/ch/ChNN.tsx`) timed off its narration's word timings. Read
`visual-style.md` for how things should look; this page is how to build them and check them.

## Contents
1. How a chapter is put together
2. Timing to words (anchors)
3. Component cheat sheet
4. Scene recipes
5. Images in scenes: placement math, masks, Gemini paintings
6. Sound
7. Checking your work (do all of these before showing the user)
8. Lessons from earlier videos
9. Drawn 3D pieces (`src/fx/`)

## 1. How a chapter is put together

```tsx
import words from '../../public/audio/ch06_to_the_victor.words.json';
const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);          // logo lead + narration + tail + fade

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [                 // hard cuts, 1 frame before the word
    [0, <Rotation t={t} />],
    [at('His critics') - 1, <Spoils t={t} />],
  ];
  const scene = useScene(cuts);
  return <>{scene}{/* sfx: silent cuts, a stamp per title, the marker (near-silent) per note */}</>;
};

export const Ch06 = () => (
  <ChapterShell n={N} audio="audio/ch06_to_the_victor.wav" lead={LEAD} music={[{src: 'music/good_feelings.mp3', volume: 0.13}]}>
    <Body />
  </ChapterShell>
);
```

- `ChapterShell` handles the logo-break lead-in, the fade up and down, the narration audio, music beds, the
  palette (`quiet` for heavy chapters), the 12 fps graphics step and the grain and vignette (`Finish`).
  Everything inside it runs in **narration time**: frame 0 is the first sample of the narration.
- Chapter 1 is different (cold open → a one-second beat → `ChannelIntro`, which ends on the title tape); copy the template's `Ch01.tsx` shape.
- Register every chapter in `src/chapters.ts`; the composition id is `ChNN`.
- Each scene is a small component taking `t`. Keep scenes to 4–12 seconds; cut on the word that starts a new idea.

## 2. Timing to words (anchors)

- `t.at('phrase', nth = 1)` = the frame the phrase starts; `t.end(...)` = the frame it ends. Matching ignores case
  and punctuation, token by token: "here's" is `heres`, "15,000" is `15000`, "Translation:" is `translation`.
- **`t.at` takes the first occurrence.** A phrase that appears twice silently anchors to the wrong place. Run
  `python3 tools/anchors.py chNN_slug --src src/ch/ChNN.tsx` after wiring a chapter: it lists every anchor
  with every occurrence and time, and fails on any that are missing. Fix repeats with `nth`
  (`t.at('His supporters', 2)`) or a longer phrase.
- A missing phrase throws at render time ("Narration has no ..."). Edits to the script after voicing are the usual
  cause: re-run the anchor check after every re-voice.
- Before the real voice exists, `python3 tools/fake_voice.py --all` writes placeholder timings at the same pace so
  scenes can be built and previewed. Never send the user a render made from placeholder audio.
- Offsets in use: titles land **on** the word; notes start 2–4 frames before; cards pop 1–2 frames before;
  traces start 1–4 frames after the subject is named; cuts 1 frame before.
- Never use `Infinity` inside an `interpolate` input range; use `1e7` for "never".

## 3. Component cheat sheet

All from `src/kit/`. Positions are screen pixels on the 1920×1080 frame unless noted. `at` is a frame.

| Component | Use | Key props |
|---|---|---|
| `Highlight` (Kit) | Orange torn-tape title, Abril caps | `text x y size(96) at seed rot(-2) after` |
| `Note` (Kit) | Handwritten teal aside, writes on. Only on dark, quiet areas; over a picture use `Slip` | `text x y size(46) rot(-4) color at dur out` |
| `Slip` (vox) | **The default note over pictures**: torn paper slip, dark ink, slaps on then writes on; `coral` for the subject | `text x y at rot(-3) size(62) coral dur` |
| `Arrow` (Kit) | Bowed hand-drawn arrow | `x1 y1 x2 y2 bow(40) at` |
| `Loop` (Kit) | Hand-drawn circle around something | `cx cy rx ry at seed tilt` |
| `Tag` (Kit) | Source credit, mono caps, bottom-left | `text` (put one on every image) |
| `Picture` + `Tint` + `Traced` (Kit) | B&W image, coral subject, teal outline | `place size mask paths` |
| **`Cut` (desk)** | **The default for a photo**: its subject cut out, on the notebook paper | `name mask size box at traceAt tint valign bare` |
| **`Print` (print)** | Archival print on the black desk (no mount, no frame), slaps down, source tag under it (*The Balloon War* v2) | `src x y w h at out rot pos tag fit` |
| `NoPhoto` (print) | Mono label for a real person shown only as an anonymous silhouette ("… · NO PHOTO SURVIVES") | `text at x y out` |
| **`Desk` (desk)** | Photo with no single subject (landscape, crowd, room) as a card on the paper (older: cream; now prefer `Print`) | `src size box at rot pos mask traceAt children(S)` |
| `Photo` (shell) | Full-bleed image (rarely: maps and documents only; the user dislikes slow-push photo scenes) | `src size fx fy z0 z1 a b mask tint traceAt children(place)` |
| `CropCard` (shell) | Image on a cream card, cropped window | `src size x y w h fx fy scale rot at mask tint children(S)` |
| `PhotoCard` / `Card` | Whole image on a card | `src x y w h rot at` |
| `Definition` (shell) | Vocab bar: term · definition | `term def at x y w` |
| `Quote` (shell) | Primary-source quote, Playfair | `text at x y w size who` |
| `Stamp` (shell) | Big number or word stamping in | `text x y at size color` |
| `DrawnCrown` (shell) | Hand-drawn crown | `x0 x1 y h at` |
| `DarkPaper` (common) | The desk background | |
| `MapScene`, `Pin`, `Route`, `Region`, `PLACES` (map) | 1836 map, camera, pins, routes | `keys: Cam[]`, `children(S, cam)` |
| `Map3D` + `Slab`, `Fill`, `Border`, `Glow`, `Route`, `Flow`, `MovingBorder`, `Stand` (`Pin3`, `Stake`, `Flag3`, `PlaceTag`, `RegionName`, `Hand`), `StateTiles`, `Count` (map3d) | The tilted 3D map (from *The Exact Spot*): regions rise as slabs, borders draw on with their names, labels stand up | `data keys: Cam3[] ({f x y z tilt rot})`, `children(api)`; data from `tools/build_map.py` (example map: `techniques/components/exact_spot/maps/`) |
| `Engraving` (engraving) | A wood engraving full frame: 16:9 crop only, slow push, soft fade in/out | `src px fx fy a b z0 z1 fade quiet mask tint traceAt tag children(place)` |
| **`SilScene` + `PlaneImg` (silparallax)** | A silhouette painting full frame in multi-plane parallax, mist between planes, dust in a beam, a cut-out riding a plane | `name size bands a b cam:{z x y} fog fogColor fade dust insert:[{plane, node}] glowLayer` |
| `Prop` (prop) | AI prop cut-out on the desk, B&W, optional see-through coral and teal trace | `name x y w at out rot coral trace from` |
| 3D pieces (`src/fx/`) | Drawn three.js pieces: `Stage`, `camAt`/`makeCam`/`SyncCam`/`project`, `Segs`/`Poly`/`DynSegs`, `MapSlab`, `Label`/`Fine`/`Hand` (kit3d); `MapTop`, `greatCircle` (mapgeo); `buildTerrain` + `TerrainSlab` (terrain) | see §9 |
| `Parallax` (parallax) | 2.5D archival layers (subject over background) | `name src size a b tag fx fy cam depth crop frame mask tint tintStrength traceAt effects filter` |
| `Tiles`, `STATES` (tiles) | State tile grid for elections | `state(code) => {fill,label,at}` |
| `Person` (figures) | Drawn voter or crowd figure | `x y h at dashed hat dress` |
| `Pie`, `Bars`, `SplitBar`, `HBars`, `CountUp` (charts) | Charts: one coral subject, bone greys, labels on the marks | see `charts.tsx`; keep every number and its source in `src/data/charts.ts` |
| `Sfx` (common) | One sound effect at a frame | `at src volume` |
| `ChapterShell` music entries (shell) | Cues per chapter; the bed lifts ×`TAIL_LIFT` (1.6) after the last word | `{src, volume, startFrom, from, to}`: `to: TM.at('word') + 6` on one cue and `from: TM.at('word') - 6` on the next hands over on a phrase |
| `hasFile(path)` (shell) | True once an image exists in public/ | use to fall back gracefully |
| `Sheet` + `camAt` (vox) | A document on the desk, optionally tilted back with a depth-of-field band; children in page px | `src size cam:{x y z tilt dofY dof band} offset`; keys `[frame, cam][]` |
| `Swipe` / `Spot` (vox) | Coral highlighter along printed lines at reading speed / everything darker except the boxes (inside a `Sheet`) | `lines from to` / `size boxes at id` (boxes from `tools/phrase_find.py`) |
| `FocusIn`, `carry`, `Tear`, `WordRun` (vox) | Rise into focus; motion carried through a cut; tear-away reveal; word match cut | `at` · `carry(f, a, b)` → x offset · `at top` · `items durs` (from `tools/word_hunt.py`) |
| Collage board (board) | `Flat`, `Photo`, `Strip`, `Sticky`, `Stamp`, `TapeBit`, `Pin`, `Threads`, `Silhouette`, `Scrap`, `WornLogo`; motion: `Land` (drop/slap/stamp/tape/slide/fade), `APin`, `AThreads`, `BoardStage` | wrap in `<Ctx.Provider value={BRAND}>` + `<Defs />`; spec in the style repo's `techniques/collage_board.md` |

More components that aren't in the template yet (documents marked in their own pixels, word-synced quotes,
2.5D layered paintings, falling cards, a drifting desk, a 3D object, a journey map) are in the style repo's
`techniques/` folder: `techniques/README.md` says what each does and `techniques/components/` has the code.

Colors come from the palette context: `usePal().mark` (teal), `.subject` (coral), `boxOf(pal)` (orange). White
`#ffffff` notes are neutral asides; coral notes are punchlines; orange notes are disputed claims.

## 4. Scene recipes

- **Cut-out on the paper (the default)**: `Cut` with the subject in a box on one side (e.g. x 900–1860), title
  top-left (x 100–140, y 90–120), notes stacked on the empty side, `Tag` bottom-left. Coral on the one key subject;
  `tint={false}` for supporting cut-outs. Several cut-outs side by side: `bare` on each over one `DarkPaper`.
- **Card on the desk**: `Desk` for a landscape, crowd or room (or a failed mask), about 1000–1160 wide, rotated ±1–2°,
  notes in the space beside or below it. With `mask` the subject inside the card is tinted and traced.
- **Not house style**: full-screen photos with slow pushes ("Ken Burns"), 3D depth fly-throughs of photos, and color
  photos (modern ones too). *The Balloon War* tried them and the user rejected them.
- **Subject left, notes right**: `CropCard` at x 140–220 (about 520×700), titles and notes stacked at x 860+.
- **Desk of cards**: `DarkPaper`, 2–3 cards across the top two-thirds, alternating rotation ±2–4°, title and notes
  along the bottom.
- **Map**: `MapScene` with 2–3 camera keys (log-space zoom), `Pin` + `Note` label per place as it is spoken,
  `Route` for journeys, `Region` for territory. Dim 0.15 when the map is the subject, 0.3–0.5 behind text.
- **Vocab beat**: `Highlight` on the term, `Definition` 8–10 frames later directly under it.
- **Quote beat**: `Quote` on the desk or over a dimmed image (`brightness(0.45–0.55)`), attribution in `who`.
- **Two views**: a thin cream divider at x 958–962, mono caps headers (teal left, coral right), a title or note
  per side. Keep each side's text inside its half (a size-110 title is about 75 px per character).
- **Counting graphic**: `Stamp` numbers, rows of small marks or stamps (12 vetoes vs 10), a note with the takeaway.
- **Multi-beat explainer** (e.g. "who gets to vote"): 2–3 scenes reusing the same figures or tiles so change is
  visible; one number per beat.
- **Ending split**: the same portrait, teal half and coral half, a label each. The thumbnail can reuse it.

### The thumbnail reveal (cold open, from *They Fooled America's Richest Men*)

The rule is "what the thumbnail shows is on screen at frame 0", but a still thumbnail with a slow push read as nothing (the user).
Make it act out the first sentence instead: open **tight on the coral subject** (the cut-outs nearest the camera sit outside the
frame on their own depth plane), **fade in a background painting** on the words that name the place, then **pull back** so the
foreground figures slide in from both sides and the camera settles on the exact thumbnail frame; land the loops and notes only
after it settles (notes drawn during the move run off the edge), and put a money tag or the key number where the thumbnail's tape
words sat. Give the background real parallax (split it with `tools/sil_layers.py`) and a little coloured light. Code:
`techniques/components/diamond_hoax/fx/ColdOpenDepth.tsx` (`ColdOpenReveal`), timed with the chapter's word timings.

## 5. Images in scenes

- **Always read an image's real pixel size** before placing it (`python3 -c "from PIL import Image;
  print(Image.open('public/img/x.jpg').size)"`) and pass it as `size`. AI images in particular don't come back
  at the ratio you asked for (*King Andrew*'s "16:9" Gemini paintings were 1200×896). One constant per family:
  `const GEN: [number, number] = [1200, 896];`.
- `fill(size, fx, fy, zoom)` gives a full-bleed placement centred on source pixel (fx, fy). `onScreen(place)` or
  `CropCard`'s `S(sx, sy)` map source pixels to screen for overlays (loops, crowns, arrows onto a face).
- **Masks** come from `tools/mask.py` (see `images-and-masks.md`); add each to `src/masks.ts` and pass
  `mask={MASKS.name}`. `tint={null}` keeps the trace without the coral.
- **The tint must not sit inside a wrapper with `clip-path`**: the clip isolates the `color` blend and the tint
  goes flat. Put the clip on each blended layer itself (see `SideTint` in `src/Thumbnail.tsx`).
- Gemini paintings live in `public/img/gen/`. Build the scene with `hasFile('img/gen/x.png') ? painting :
  fallback` so it renders before the user has made the image.

## 6. Sound

Per chapter, in `Body`: **no sound on cuts** (the user, Nov 2026: the per-cut whoosh read as a page flip and was "too jarring"; `Sfx`
mutes `whoosh`, `whip`, `page_turn`, `paper_rustle`, `paper_slap_soft`), a stamp on every `Highlight` (0.27–0.3),
the marker sound 2 frames before every `Note` (`WRITE`, capped at 0.03: the user wants it nearly silent; no page-turn or paper sounds, `Sfx` mutes them), a tick on pins and card flips (0.45). Music beds go
in `ChapterShell`'s `music` with `volume: bed('<cue>')` from `src/kit/levels.ts` (13 LU under the voice; see
`voice-and-audio.md` §6). A `whip_soft` under a gentle drift plays at half level (the West series' `Sfx` halves any `whip`
sound; since Nov 2026 `Sfx` mutes `whip` and `whip_soft` too, so drifts are silent). Sound effects only for things on screen
(waves, wind, a plane, a radio). Keep the lists of cue words next to the scenes so they stay in sync.

## 7. Checking your work

Do all of these before sending the user anything. Each one caught real problems on *King Andrew*.

1. **Typecheck:** `npx tsc --noEmit -p .`
2. **Anchors:** `python3 tools/anchors.py <stem> --src src/ch/ChNN.tsx` for each chapter you touched. Then **beat scope**:
   `python3 tools/beatscope.py src/ch/ChNN.tsx public/audio/<stem>.words.json` flags any `t.at()` beat that lands outside its
   scene's window (a repeated word matching its first occurrence: the beat never shows, and anchors.py can't see it). It caught
   two real bugs in *The Balloon War* v2.
3. **Stills:** `node tools/stills.mjs ChNN out/stills 3 9.5 17 ...` (seconds), then
   `python3 tools/sheet.py out/sheet.jpg out/stills/ChNN_*.jpg` and look at the sheet. Pick seconds a little
   after each anchor so every write-on has finished. Look for: text over faces or other text, text running into a
   divider, arrows crossing words, titles on busy image areas, empty scenes, a tint gone flat, a scene with nothing new for
   more than ~8 s. Keep **one labelled contact sheet per chapter** (`review/contact/chNN.jpg`) and look at it before reporting.
   Chapters with three.js pieces need WebGL stills: `node tools/glstills.mjs out/stills ChNN:900,1200 FX-<piece>:0,60`.
4. **Text-edge probe:** `SAFE=96 node tools/probe_text.mjs Ch01,Ch02,... 10 2>&1 | grep -v "PROBECOUNT\|emory"`.
   It renders every 10th frame and lists any text whose box crosses the frame edge, and (with `SAFE=96`) any title or
   note inside the outer 5%. Fix every hit (shorter line,
   smaller size, move left, `whiteSpace: 'nowrap'` plus a width check). The user noticed right-edge cut-offs in a
   480p preview, so treat any hit as a bug. (The *96 px text probe*: `SAFE=96` must report nothing on every chapter.)
5. **After rendering:** `python3 tools/frames_sheet.py out/ch/chNN.mp4 out/check.jpg 12 18.5 40` to look at the
   finished frames, especially every spot the probe flagged and every new graphic.

## 8. Lessons from earlier videos

- **Prefer clean drawn diagrams to literal props.** A three-legged stool for Clay's American System looked fussy
  and the user disliked it ("the whole table illustration isn't great"). It was replaced by three teal line-drawn
  index cards, one per policy, each knocked out with a coral X as Jackson kills it. Labels in nowrap at a size
  that fits the card.
- **If a picture can be misread, draw the event instead** (*The Exact Spot*): an engraving of dragoons inside a fence
  read as a pen, not an ambush ("Why are they inside a fence?"). A drawn diagram (a ring of chaparral, one gap, riders
  in, cavalry closing the gap, ✕ killed, rings captured) set beside the map fixed it.
- **Spell out an allusion.** A free/slave map turning into the 1861 split was too quiet until it carried labels: UNION,
  CONFEDERACY, "border states", a key, "← Fort Sumter, April 1861" and a THE CIVIL WAR strip.
- **Every image gets a source tag**, generated ones too ("Illustration · ...").
- **One subject in color per image.** If two people matter, use two scenes or trace the second without tint.
- **Gentle transitions** (American West Ep 1, Oct 2026; replaces the older "cut, don't dissolve" rule): switch shots with
  `Shots` from `src/kit/shots.tsx`. A `'whip'` shot comes in as a soft drift (a ~half-second crossfade with a 70 px slide and
  light blur), a `'cut'` as a 6-frame dissolve; no whip pans, no hard cuts. Chapters end gently: ~2 s hold after the last word
  (`TAIL` 54), the music lifting, an 18-frame dip to black, then the 2 s Chunk mark snap (`LogoBreak` in `ChunkIntro.tsx`).
- **Heavy chapter = quiet chapter.** Fewer marks, longer holds, no jokes, slower voice, respectful images.
- **The bundle copies public/ into /tmp** (~500 MB for a full video) on every render; the tools delete theirs.
  If the disk fills, remove `/tmp/remotion-webpack-bundle-*` and `out/` scratch files.
- **Build chapters in parallel from one brief** (*Dressed to Kill*): once the voice exists, write `script/SCENES.md` (rules for every
  chapter plus a shot plan per chapter: images, anchor words, music), build the shared pieces first (a `src/kit/<video>.tsx`,
  masks, layers, chapter stubs registered in `chapters.ts`), smoke-test them with a few stills, then give 2 chapters each to 4
  agents that may only edit their own `ChNN.tsx`. Review every agent's stills sheet; when two chapters show the same picture,
  move that shot into a shared component so they match (the Waltz went into `src/kit/waltz.tsx`).
- **Parallel builders from a shared brief** (*The Balloon War* v2, the current form; `projects/Balloon_War/script/BUILD_BRIEF_v2.md`):
  finish chapter 1 yourself first as the pattern to follow exactly; then one brief for all builders: each builder's files and only
  those (chapter builders their `ChNN.tsx` and `src/ch/chNN/` helpers; a 3D builder only `src/fx/*` and the registry), what not to
  touch (`src/kit/*`, `Root.tsx`, `chapters.ts`, tools, another builder's files: copy a shared piece into your folder instead), no
  commits, no video renders (stills only, one run at a time on a shared 4-core machine), what to read first, the kit, the video's
  rules (look, silhouettes, tags, vocab and quote cards, the heavy chapter), and the tests before reporting (typecheck, anchors,
  beatscope, stills at every scene, the 96 px probe, a contact sheet per chapter, a report under 250 words). Three chapter builders
  plus one 3D builder worked at once; chapters used placeholders until the 3D pieces landed (`TODO(3D)`).
- **Patterns from *Not in the Picture*** (American West Ep 1, `projects/American_West/ep1/`):
  - **Hatch a region on the drawn map** (`MWest` in `src/kit/ch01_extra.tsx`): the subject area as one see-through coral hatch
    built from state outlines clipped to the land, with a label standing up off the map. It made sparse, dark map shots read.
  - **Empty sockets before portraits**: when people are named one by one, put dashed empty circle mounts on the desk from the
    cut, and drop each photo into its socket on its word, so the frame is never empty while the list builds.
  - **Fill the words, not a loop**: on a cartoon with speech boxes, fill each box with see-through colour (multiply, wiping
    left to right; teal for the one that matters, coral for the others) instead of drawing a loop around it (the user's idea).
  - **Photos must fill the frame**: a full-bleed photo needs a zoom of at least `max(1920 / width, 1080 / height)`, or it
    shows black bars (ch02's Capitol did, below that).
  - **One series recurring card** (the two-views card filled across ch06–07) keeps its wording identical wherever it returns.

  - **Handwriting needs vertical room** (the user caught it on the West map, Oct 2026): the hand font's descenders (g, y, p)
    reach far below the line, so a write-on `clipPath: inset(-20% … -20% …)` cut them off. The kit now uses `-60%` top and
    bottom; keep that in any new write-on. And **anything standing upright on a tilted 3D plane must sit wholly above its foot**
    (`bottom: 2`, not `top: -0.66em`): the part below the anchor sinks under the plane and the map hides it (`MPin` labels and
    dots did this in Ep 1).

## 9. Drawn 3D pieces (`src/fx/`, from *The Balloon War* v2)

Six three.js pieces carried *The Balloon War* v2 (`projects/Balloon_War/v2/src/fx/`: `PacificWinds` the jet stream as thousands
of teal particles from real January 1945 reanalysis winds with a coral balloon riding it; `LandingMap` 285 recorded incidents
standing up as pins in date order with a month counter; `SandToBeach` sand grains pulling out to a real-elevation coast;
`AltitudeRibbon` the three-day flight as a sawtooth ribbon with sandbags dropping; `BalloonAssembly`; `GearhartTerrain` real
terrain with the monument). The reusable parts are in the template: `src/fx/kit3d.tsx`, `mapgeo.tsx`, `terrain.tsx`, a
`registry.tsx` of test compositions and `DemoSlab.tsx` as the smallest example. The patterns:
- **Drawn, never photoreal**: teal `#2FE0C4` lines on the dark desk, cream sparingly, **one coral element** (the subject), labels
  in mono tabs kept 96 px inside the frame, a `Fine` line for the source and any honesty note ("heights exaggerated 3×", "path
  follows that mean wind").
- **Real data, sourced**: coastlines from Natural Earth and heightmaps from AWS Terrarium tiles (`tools/geo_bake.py`), winds
  from NOAA 20CRv3 over OPeNDAP, incidents from the book's list; bake small JSON files into `public/data/` and write each one's
  source, bounds and date into a `public/data/fx_data.md` (the Balloon War's is the model). When the real data can't be had, use a
  long-term mean and say so on screen.
- **Every piece is a pure function of the frame** (no state, no randomness at render time; seeded `rng` at module load), so any
  frame renders the same on any worker.
- **Beats as props** (`at`, named beats like `windsAt`, `routeAt`, a date window), so a chapter anchors them to words:
  `<PacificWinds windsAt={t.at('jet stream') - a} />`. A header comment lists the props.
- **A test composition per piece** in `src/fx/registry.tsx` (registered as `FX-<id>`), checked with WebGL stills before any
  chapter uses it.
- **A three.js canvas must mount only after its textures load** (wait with `delayRender` / `continueRender` and render the canvas
  after), or stills and renders show it blank. Simpler: draw textures synchronously on a canvas, as kit3d's `glowTexture` does (the
  Balloon War pieces load no image textures at all).
- **Rendering**: `tools/render_ch.sh` uses the `.real` headless shell and **no `--gl` flag**; `--gl=swangle` also works but was
  4× slower (60 frames: 67 s vs 15 s). Stills: `tools/glstills.mjs` (`SCALE` sets the size). See `render-and-deliver.md` §2.

