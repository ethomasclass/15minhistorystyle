# Thanksgiving vs the Gilded Age look: the gap, and how to close it

Nov 19, 2026. Reference: Gilded Age Ep 4 and Ep 5 on `origin/gilded` (`projects/Gilded_Age/ep5/edit/`, `lookdev/`), read from the
code, the READMEs (which record the user's review notes) and frames pulled from `ep5/edit/review/ep5_preview.mp4`, `title_720p.mp4`,
`brk_720p.mp4`, `endscreen_720p.mp4` and the look-dev stills. Compared with `review/draft_preview_v2.mp4`, a frame every 8 s of each.

## The honest comparison

The Gilded Age holds a picture on screen almost all the time: a drawn set with rigged people doing something, a dark explainer
board that builds in steps, a 3D street model, or an archival print with its source under it. Our draft v2 is mostly a flat coloured
desk with two or three handwritten notes, and a third of its picture slots were dark placeholder cards. In a 30-frame sample of each,
the Gilded Age had a drawn or archival picture in 28; ours had one in about 12. That, more than any single brand piece, is why the
draft "doesn't look that good". The brand pieces (intro, snap, batons, end screen, safe area, music level) are now matched; the
picture density is the work that remains, and it is listed under "Scene upgrades".

## What "the 3D animation style" is

Nothing in the Gilded Age is three.js, WebGL or Blender (one Blender street test exists in `lookdev/blender/` and was not used).
There are three things the user could mean, in order of likelihood:

1. **The 3D model drawn as SVG** (`lookdev/ep3_map.js`, extended in `ep4_map.js`, `ep4_map_b.js`; the Ep 4 README calls it "the
   user's favourite"). A real 3D scene in world units of feet. A camera with target, yaw, pitch and distance, keyframed with a
   monotone cubic so it never overshoots, projects every point in perspective (focal 2400 px, near-plane clipping). Buildings are
   boxes: faces back-face culled, shaded by one cream light, sorted far to near (painter's algorithm), with window grids, cornices,
   awnings and fire escapes drawn on the faces. Far things mix into a teal haze; paper mottle and grain go over the lot. As the voice
   names a place, its building lifts 82 ft out of the map with a soft shadow and a mono tag, and a teal arc ties it to the family's
   building. A roof lifts off to show a floor plan from above. Night version, fire, snow, a city growing year by year, a network of
   teal lines and gold glints: all the same model. Every cue is a word time in a table.
2. **The drawn silhouette sets with depth** (`scene.js`, `street.js`, `cutaway.js`, `mansion.js`, `ep2_more.js`, `ep3.js`,
   `ep4*.js`, `ep5*.js`). Side-on 2D worlds in SVG with five parallax planes (0.25 / 0.5 / 0.75 / 1.0 / 1.35), cut-away buildings,
   materials (`MAT` in `rig.js`: brick, stone, planks, iron, water, smoke), period light that stays in its room, and rigged people
   (`rig.js`: `figure()`, `cast()`, `POSES`, `walkAn`). Detail follows size on screen: a solid shape when small, a rim of light from
   about 140 px, a face and clothes from about 520 px. Feet stay planted (`walkPhase`, `e4Walk`); contacts are audited. The Ep 5
   doors add drawn perspective: floorboards converging on a vanishing point that follows the camera, a door leaf that swings toward
   the lens.
3. **The x-ray and cutaway explainers** (`bessemer.js`, `refinery.js`, `explainers.js`, `ep4_explain.js`, `ep5_explain.js`): a
   camera that pushes into a machine, the shell turning to an x-ray with a teal cut edge, bubbles and bars that fill.

All of it is a pure function of time that returns an SVG or HTML string. There is no DOM access in the look-dev files (checked:
`rig.js`, `scene.js`, `street.js`, `explainers.js`, `mansion.js`, `ep2_more.js`, `ep3_map.js` use neither `document` nor, bar one
line in `cutaway.js`, `window`). `RIG.md` says it in so many words: "in Remotion, put the returned SVG string in an `<svg>` or
`dangerouslySetInnerHTML`".

## The differences

"Done" = implemented in the Remotion project today (see "Implemented"). Everything else is open.

| # | Piece | Gilded Age (Ep 4 / Ep 5) | Thanksgiving draft v2 | How to close it | State |
|---|---|---|---|---|---|
| 1 | Intro | One 4.2 s card (`title.js`): the logo assembles centred at 1.4x, locks by 2.8 s, lifts 250 px and shrinks to 72%; the title lands under it | A 5.5 s intro, then a separate 5 s title card: 10.5 s | `TitleIntro` in `kit/ga_brand.tsx`, on the live three.js logo at 1.4x. Runs 5.0 s, not 4.2: see note A | Done |
| 2 | Title card | Series name on a torn orange strip (Abril 150, -2 degrees, y 470), the episode title in cream Abril 84 centred at y 720, a teal mono line at y 860 (28 px, 6 px tracking) | A highlighter title top-left, a teal subtitle, a handwritten date | Same card: title on the strip, subtitle in cream Abril, the dates as the teal mono line | Done |
| 3 | Mark snap | 2.0 s, flat (`brand.js` `brk`): black, the teal mark already there at 230 px, the coral quarter swings in from -110 degrees with an ease-out-back overshoot and locks at 1.0 s; fades 1.65 to 1.95 s. Played whole between chapters | A 3D three.js snap, 170 px, slow drift, entering 16 frames in and cut to 1.5 s | `MarkSnap`; the chapter lead is now the whole 60 frames | Done |
| 4 | Baton card | The next chapter's title on a torn orange strip (Abril 132, -2 degrees, centred, y 460) slams in over the picture dimmed 62%, from 1.12x in 0.16 s, on its own spoken words; held 2.6 s to the cut (`cards.js`) | None: a 2.4 s tail with the music lifting, then a fade | `BatonCard` + `baton` / `batonWords` on `ChapterShell`; chapters 2 to 7 end on one | Done (note B) |
| 5 | End screen | 20 s (`brand.js`): desk, the mark at top centre, two 614x345 video slots 80 px apart at y 250, a 298 px subscribe circle at (960, 780), three mono labels; nothing else. The theme carries on under it | A busier screen: logo lock-up, THANKS FOR WATCHING strip, notes, two arrows, a wriggling eel, slots 604x340 stacked on the right, the circle at the left | `EndSlots`, YouTube's exact sizes; the table theme carries it | Done |
| 6 | Title-safe area | 8% (x 154 to 1766, y 86 to 994). `edit.html` nudges every `.tx` text back inside each frame; `audit_text.mjs ch 0.25 0.08` reports OUT / SHORT (< 2.5 s) / OVERLAP | A 5% probe only for big text; source tags at x 44, y 1030 (2% in) | `SAFE` + `SafeText` (the same nudge, on elements marked `data-tx`); source tags moved in and boxed. Still to do: note C | Done, part |
| 7 | Music level | About 17 LU under the voice: volume = 10^((-35.2 - cue LUFS) / 20), voice at -18 LUFS; existing series cues only; master -14 LUFS | 13 LU under (the Black Sox mix), three chapters with their own copy of the formula; a 1.6x lift after the last word | `bed()` default gap 17.2 in `kit/levels.ts`; every chapter uses it; tg_ cues only. The tail lift is kept (note D) | Done |
| 8 | Sound | Sound effects only for things on screen (a whistle, a gate, a slammed door); no whooshes, no page turns; the brand's clicks on the intro, `chunk_snap` on the snap and on each baton; scene beds per room | None at all (the user, Nov 19): `Sfx` returns null | Nothing to add. The intro and snap still played their click tracks through raw `<Audio>`; those are now removed | Done |
| 9 | Desk | Near-black wood with a soft lamp pool and a fine horizontal grain (`edit.js` `desk()`); the explainer board is near-black teal with faint graph squares (`xpBoard`) | The user's new teal and coral desks with texture (`kit/tg_desk*.tsx`), black for some beats | Keep ours: approved this week. Borrow only the lamp pool falloff if the flat fields still read as empty once pictures fill them | Keep |
| 10 | Prints | `printCard`: the picture in a 10 px cream border, sepia 0.18, a contact shadow plus a lifted shadow, a 2 to 3 px slow drift, the source and date in mono under it | `Print` / `TgPrint`: B&W, one heavy box shadow, no border, static | Give `TgPrint` the cream border, the two shadows and the drift; keep our B&W rule | Open, 1 h |
| 11 | Cut-outs | `deskCut`: no border, aged, `drop-shadow(0 3px 2px) drop-shadow(0 16px 22px)`, rises 70 px into place, drifts 3 px | One long soft shadow (looked like floating), placeholders for a third of them | `kit/tg_cut.tsx` `Cut`: the Gilded Age's two shadows, natural aspect, stepped landing; all 24 Flow stills placed | Done |
| 12 | Vocab cards | A cream index card with ruled lines, the term in Abril 52 to 72, how to say it and the part of speech in mono, the definition in Inter 600 at 36, a strip of orange tape, tilted 2 degrees (`vocabCard`, `card`) | `Definition`: a dark bar with the term in teal | Port `vocabCard` to React (30 lines) and use it for aspic, mock, heritage breed, test kitchen | Open, 1 h |
| 13 | Text styles | Strip titles Abril on orange; tags mono 22 to 28 on a dark box; handwriting Nanum Pen with a 2 px ink stroke, teal for notes and orange for labels on drawn sets; figures in Abril 190 with a teal mono "today's money" line; quotes Playfair 900 at 74 | Same faces. Notes lean on white handwriting for half the lines; tags were unboxed 18 px; big figures 124 to 140 | Mostly there. Use white handwriting less (teal explains, orange labels), box every tag (done), use the `bigFig` + mono pair for 46 million / 70 million / 194 million | Open, 1 h |
| 14 | Reading time | Every text at least 2.5 s; `HOLD` delays a cut and `CARRY` keeps a shot's text over the next shots so each label gets 0.3 s a word + 1.5 s | Not checked; some notes land in the last second of a shot | Add a SHORT check to `tools/probe_text.mjs` (it already walks every text box per frame) | Open, 2 h |
| 15 | 12 vs 30 | Desk, print, prop, text and drawn-explainer shots step at 12 drawings a second (`STEP = 12`); drawn sets, the model, doors and anything in `LIVE` run at 30 (the user found stepped faces blurred); crossfades and fades always real time | `StepCtx` 2.5 does the same for graphics; cameras run at 30 | Same rule. When the drawn sets arrive, render them at 30 (do not wrap them in the stepped frame) | Matches |
| 16 | Cuts | 0.3 s crossfade centred on every cut unless a shot is marked `cut` | Hard cuts everywhere (this video's deadpan brief) | Keep hard cuts for punchlines; allow the 0.3 s mix into and out of drawn sets | Open, choice |
| 17 | Drawn sets | 6 to 11 per episode, 9 to 62 s each | None. Four dioramas planned as Flow planes; all four still missing | Draw them in code (the user: no AI video). See "Scene upgrades" | Open, the big one |
| 18 | Explainers | 11 in Ep 5 alone: dark board, teal linework with an ink under-stroke, each beat a named time fed from the words | Two small line drawings (the leg, the table) and one flow chart | Build four on the board look. See "Scene upgrades" | Open |
| 19 | The model | Used in Ep 3 and Ep 4 as the signature shot | `kit/map3d.tsx` exists in the template and is unused | Optional here: a food video has no city. One use: the collage board as the model's "lift" (each pin lifts as it is named) | Optional |
| 20 | Source tags | Every archival image carries its source and date; late images get a date label on screen | Tags present on most prints | Keep; check the three placeholder portraits when they land | Fine |
| 21 | Motion source | All motion is code | A plan that leaned on Flow video morphs | No AI video (the user, Nov 19). Done for every morph in the cut; see "Motion we make" | Done |
| 22 | QA | `audit_text.mjs`, `audit_contacts.mjs`, a contact sheet every 3 s read by eye, loudness per chapter | `probe_text.mjs`, stills | `tools/contact.mjs` + `tools/contact_sheet.py` added (a frame every N s of every chapter, one bundle) | Done |

Notes.

- **A. Title length.** At 4.2 s the Gilded Age title is on screen for 1.25 s, which works for "Fighting Back" under a series name
  the viewer knows. Ours is a phrase and a nine-word subtitle, so the card holds to 5.0 s (about 2 s of reading). `TITLE_SECONDS` in
  `kit/ga_brand.tsx`; set it to 4.2 for the exact Gilded Age length.
- **B. Batons.** The Gilded Age scripts end each chapter on the next chapter's title, so the card lands on spoken words. Ours does
  that twice by luck ("Showing off." ends chapter 2, "the turkey." ends chapter 7); the other four cards land 5 frames after the last
  word. Chapter 1 has no baton: it ends on the question, a one-second beat, then the title card. If the script is revised before
  voicing, end chapters 3 to 6 on the titles ("...Mock turtle.", "...wrote the menu.", "...Jell-O.", "...the test kitchens.").
- **C. Safe area, what is left.** `SafeText` moves `Highlight`, `Note`, `Tag`, `TagOn`, `Slip`, `Stamp`, `Quote`, `Definition` and
  print tags. Hand-placed mono labels inside scenes (a dozen `div`s) are not marked yet, and text that is part of a prop (a recipe
  card's lines, the bill of fare) is left alone on purpose. `tools/probe_text.mjs` needs a second margin for y (it takes one number).
- **D. Tail lift.** After the last word our bed lifts 1.6x (about 4 dB) under the baton card. The Gilded Age keeps the bed flat and
  plays a click. With no click allowed, the lift is the only thing marking the card, so it stays. Set `TAIL_LIFT = 1` to match.
- **The narration is still a placeholder.** `public/audio/ch0*.wav` measure -70 LUFS (silence; `words.json` says `"voice":
  "placeholder"`), so the draft preview is music only and the 17 LU gap cannot be heard yet. The level is set against the -18 LUFS
  target that `tools/level_voice.py` enforces on real takes.

## The engine: recommendation

**Keep Remotion, and load the Gilded Age look-dev kit into it as a string renderer. Do not rebuild the chapters on `edit.js`.**

| | (a) Port the Gilded Age pieces into Remotion | (b) Rebuild Thanksgiving on the Gilded Age engine |
|---|---|---|
| What moves | The look-dev files as they are (`rig.js`, `scene.js`, `street.js`, `cutaway.js`, `explainers.js`, `mansion.js`, `ep2_more.js`, `ep3.js`, `ep4.js`; about 400 KB of plain JS), wrapped by one component | Eight chapters (3,100 lines of TSX scenes), the desk colour system, the board, the turkey rig, the document reads, the Flow cut-outs, the loops |
| Why it is cheap or dear | Every renderer is a pure function of `t` returning an SVG / HTML string, with no DOM access. In Remotion: `<div dangerouslySetInnerHTML={{__html: renderFlat({t: frame / 30})}} />`. Fonts need five aliases (`Abril`, `Mono`, `Pen`, `Inter`, `Playfair`); image paths need one prefix | `edit.js` shots are strings too, so every React scene has to be rewritten by hand; the approved teal and coral desks, `DeskScene`'s per-cut colour map and the 3D logo have no equivalent there (the Gilded Age intro is 185 pre-rendered JPEGs) |
| First Gilded Age picture on our timeline | Half a day: a `GAKit` loader (inject the scripts from `public/ga/` in order, `delayRender` until they are in), a `<GAScene draw={(t) => ...} live />` wrapper, and one clip retimed with `remap()` to our words | Three to five days before chapter 1 looks the way it does now, then the new scenes on top |
| Word timing | Already ours (`makeTimeline`, `t.at('phrase')`), and stricter than `wordAt` (phrases, not single words) | `wordAt` / `lWord`; workable |
| QA tools | Ours stay; `audit_contacts` can be ported later (it reads `E3LOG`, which the kit fills) | Theirs come for free |
| Render speed | Remotion: about 4 frames a second here with concurrency 4 | Playwright screenshots under a machine-wide lock, one render at a time |
| Risks | Global-scope scripts (they share names like `C`, `ease`, `clamp01`): load them in one page scope exactly as `edit.html` does, do not convert to modules. SVG `id`s repeat if two clips are on screen at once: one `GAScene` per frame, or prefix ids. Heavy sets (the model, the mansion) take 50 to 150 ms a frame | Throwing away a week of approved work, and re-approving the desk colours |
| Brand pieces | Already ported and matched (this session) | Free |

(a) gets closest to the look fastest because the look is the kit, and the kit runs anywhere a string can be put on a page. The
engine around it (`edit.js`: shot lists, crossfade, carry, 12 fps stepping) is 80 lines we already have equivalents for. The one
thing (b) would give us for free, the brand pieces, is done.

Order of work for (a): 1. vendor the kit into `video/public/ga/` and write `kit/ga_kit.tsx` (loader + `GAScene`); 2. prove it with
`renderFlat` on a chapter 5 beat; 3. write `lookdev/tg.js` (this video's sets, below) in the kit's own style so it can go back to
the Gilded Age branch; 4. port `vocabCard`, `printCard`, `bigFig`.

## Motion we make (no AI video)

The user's rule, Nov 19: all motion is ours, in code, from stills. What is in the cut now, and what each planned move is made of:

| Move | Made of | Where |
|---|---|---|
| The eel wriggling | our warp of one still, 48 drawings at 12 a second (`tests/eel_wriggle.py`) | Ch 1, 2, 8, the board |
| The Jell-O ring trembling | our warp of one still, 24 drawings (`img/flow/jello_ring/`), `CutLoop` | Ch 6 |
| Calf's head to tureen | our own dissolve, 36 drawings at 900x520 (`img/flow/m1/`) | Ch 4 |
| Aspic to gelatin box | two stills: a three-drawing squash and stretch, a stepped cross-dissolve, a settle (`Swap` in `kit/tg_cut.tsx`) | Ch 6 |
| Homemade pie to a can | puppet move: the silhouette hand reaches in with a can and the pie is swapped out on the drawing it lands | Ch 7 |
| The cranberry log sliding out | six stills, stop-motion replacement | Ch 1, 7 |
| The turkey inflating | one cut-out warped in code: chest swell under a radial mask, the body scaled about the hip while the legs stay, a tip forward | Ch 8 |
| Hands | four silhouette stills moved as puppets from the right edge with a soft shadow (`Hand`) | Ch 7, 8 |
| Mince pie, casserole | one still each; the change is slips landing on it (no state B or C needed) | Ch 3, 7 |

Removed: every reference to `morph_aspic_jello.mp4` and the `m3_mock_homemade` frame folder.

## Scene upgrades with the Gilded Age kit

The four silhouette scenes that Flow has not delivered are now **code-drawn, rigged scenes**, not Flow planes and not video. Each is
a `renderTg...(t, cues)` function in the kit's style, cued from our words, run at 30 fps inside `GAScene`.

| # | Ch | Scene | Built from | Beats |
|---|---|---|---|---|
| 1 | 1, 2 | **The eel river at dawn** (replaces D1 and the line drawing of a leg) | `scene.js` planes and water (`MAT.water`, mist, reeds from `MAT.ground`), a new figure in `rig.js` terms: bare legs, breeches rolled, `walkAn` slowed to a wade with a high knee and a pressed stance (`e4Walk` keeps the planted foot at 0 px). Coral = the subject: Squanto's figure solid with no face (a real person: the channel's rule), a second figure following | Side-scroll left to right at 0.6 of walking pace; on "tread" the foot presses, a ring spreads, an eel (our own loop, reused) slides up out of the mud; a rush basket fills; a teal x-ray circle (`cableXray`'s frame) shows the eel in the mud under the foot. 12 to 14 s |
| 2 | 3 | **The turtle dock** (replaces D2) | `ep3.js` Castle Garden wharf pieces (piles, planks, a hoist), `refinery.js`'s ship-and-hoist unloading, `mansion.js` `msHorse` and a cart; the Flow turtle cut-out as the one photographic thing, on the hoist's sling | A schooner at a wharf, harbour haze; the hoist swings a turtle from the deck to a cart (the rope and sling drawn, the turtle a puppet with a small sway); a tag "PHILADELPHIA · ABOUT 1800"; a dotted teal line back to the Caribbean on an inset `e5m`-style map. 9 s |
| 3 | 3 | **A Gilded Age dining room** (new) | `mansion.js` first floor: the dining hall with tapestries and the stone mantel, `ep2_more.js` `spencer_banquet` table dressing (white cloth, platters, glasses, gasoliers, waiters carrying trays) | The camera holds on the long table as courses arrive: a waiter (rigged, `e4Track`) sets down the tureen (our cut-out), then the platter, then the pie, each tagged MEAT on its word. Replaces the three count-it-out cards. 10 s |
| 4 | 6 | **The Victorian kitchen** (replaces D3) | `mansion.js` basement kitchen exactly as built for the Vanderbilt ball: the range under a hood, copper pans on the wall, the long work table, the high areaway window, cooks in toques; `kelly_flat`'s kettle steam | The cook boils calves' feet (steam, `MAT.smoke`), skims, strains through a jelly bag (a drip, a bowl filling in teal x-ray), clears it; a clock (`stationClock`) sweeps six hours; the copper mould in coral. Notes "1 boil calves' feet / 2 skim / 3 strain / 4 clear" land on the words. 12 s |
| 5 | 6 | **Upstairs, downstairs** (new) | `ball_cutaway`: the house cut open | Push from the supper room, where the aspic stands on the table, down into the kitchen that made it: "only a house with a cook". 6 s |
| 6 | 7 | **The 1950s kitchen and its hostess** (replaces D4) | A new set in `cutaway.js` room style (one room, front wall off): steel cabinets, a round-shouldered refrigerator, a wall clock, a window with a lawn; a rigged 1950s hostess: `figure({kind: 'woman', hat: 'none', wear: ['apron']})` with a new full-skirt outline and a short set hairstyle added to `rig.js`; `POSES.stir`, `read`, a new `openCan` | She reads the magazine (`read`), looks at the clock (it runs toward four), opens three cans (`openCan`, each can a small ink shape with a teal label as it is named), pours, slides the dish into the oven; the in-laws' car pulls up outside the window (`brougham`'s wheel maths on a 1955 sedan outline). Coral = her (the "you" of the script). 14 s |
| 7 | 5 | **Hale at her desk** (new) | `ep4_leak`'s lamplit clerk at a desk, re-dressed (kerchief off, lace cap); faceless (a real person) | She writes letter after letter; a stack grows; a calendar's years flip 1846 to 1863 in the corner; the last sheet lifts off and becomes our scan of the letter to Lincoln. 8 s |
| 8 | 8 | **Turkey breeding explainer** | `ep5_explain.js` board (`xpBoard`), icons, `drawLine` | PICK, BREED, REPEAT as a loop on the dark board: a row of ten bird outlines, the two biggest ring in teal, the row is replaced by their bigger offspring; a generation counter; a breast-width bar that grows; then our inflating cut-out. Replaces the three boxes. 10 s |
| 9 | 7 | **The cranberry can explainer** | `bessemer.js` x-ray: push in, the shell turns see-through | The can in x-ray: berries cooked down, poured in hot, the jelly sets against the ridged wall, the can is opened at both ends, the log slides out holding the ridges; "it is the can". Ends on our six stills. 9 s |
| 10 | 2 | **Who was there** | `ep3_explain.js` `ep3_stat_cg` and the pedestal grid | 102 figures; half turn dark ("about half: dead"); about 90 Wampanoag figures walk in beside the 50 (coral = the subject of the line). Replaces the dot grids. 8 s |
| 11 | 4 | **Turtle numbers** | `ep3_decades` bars | The 97% fall as a bar that drains with a year axis, the icons thinning above it. Tightens the existing grid. 6 s |
| 12 | 8 | **The board as the model** (optional) | `ep3_map.js` lifts and arcs | The collage board's pieces lift and tie together with the model's teal arcs on the pull-back |

Cost, roughly: the loader and wrapper half a day; scenes 4 and 5 are re-dressings of sets that exist (half a day together); scenes
1, 2, 3 and 7 a day each; scene 6 a day and a half (new set, new figure outline, new pose); explainers 8 to 11 two to three hours
each. About seven working days for all of it; scenes 4, 6, 8 and 9 first would change the video most.

## Implemented today (Remotion project)

- `src/kit/ga_brand.tsx` (new): `TitleIntro`, `MarkSnap`, `BatonCard`, `EndSlots`, `Tape`, `ChunkMark`, `SAFE`, `SafeText`.
- `src/kit/ChunkIntro.tsx`: `IntroScene` takes a speed; the click tracks under the intro and the snap are no longer played.
- `src/kit/shell.tsx`: `LEAD` 60 (the whole snap), `TAIL` 60 (2.6 s with the fade), `baton` / `batonWords`, `SafeText` round every
  chapter, `data-tx` on `Definition`, `Quote`, `Stamp`.
- `src/kit/Kit.tsx`, `vox.tsx`, `tg_placeholder.tsx`: `data-tx` on `Highlight`, `Note`, `Tag`, `Slip`, `TagOn`, print tags; source
  tags inside the safe area on a dark box.
- `src/kit/levels.ts`: `bed()` at 17.2 LU under the voice; chapters 1, 3, 5 and 6 use it instead of their own copies.
- `src/ch/Ch01.tsx`: the cold open ends on `TitleIntro` (10.5 s of intro and title became 5 s); the theme carries under it.
- `src/ch/Ch02.tsx` to `Ch07.tsx`: baton cards (Showing Off, Mock Turtle, Hale Writes the Menu, Jell-O, The Test Kitchens, The
  Turkey). `src/ch/Ch08.tsx`: the 20 s end screen is `EndSlots`.
- `src/Root.tsx`: `Intro`, `LogoBreak` and `EndScreen` compositions show the new pieces on their own.
- `src/kit/tg_cut.tsx` (new): `Cut`, `CutLoop`, `Swap`, `Hand` for the 24 Flow stills; used in every chapter (list in the report).
- `tools/contact.mjs`, `tools/contact_sheet.py` (new): contact sheets of every chapter from one bundle.

Not done, on purpose: no sound effects were added anywhere; the desk colours are untouched; nothing is committed; the full video
was not rendered.
