# Code-drawn series: the Gilded Age pipeline (Nov 2026)

The Gilded Age series (`projects/Gilded_Age/`) is the first Chunk History video built **without Remotion and without AI scene
paintings**: every scene is SVG drawn in code (`lookdev/`), and each chapter is cut on the voiced narration's word timings by a
small HTML/Playwright editor (`ep1/edit/`). Use this file when a video wants a recurring drawn world (a composite family, home
bases, explainers that move) instead of desk-and-photo scenes. The worked example is `projects/Gilded_Age/ep1/`.

## Contents
1. The world: look-dev kit, rig, materials
2. The edit: chapters cut to word timings
3. The desk layer: bust cut-outs, creased prints, props, cards
4. Motion: 12 drawings a second on the desk, smooth scenes
5. Voice: a narrator plus character voices, re-voicing one line
6. Music and the mix
7. Intro + title card
8. Rendering, disk and assembly
9. Mistakes this pipeline already made (so you don't)

## 1. The world: look-dev kit, rig, materials

`projects/Gilded_Age/lookdev/` holds every drawn set; each is a JS file that returns an SVG string for time `t`:
`scene.js` (the Brooklyn Bridge, five parallax planes, dusk/night looks, fireworks), `street.js` (tenement street, walk cycle),
`cutaway.js` (the tenement cut open; the camera pushes into the family's kitchen), `refinery.js` (the factory cut through, the
product's path floor by floor), `loom.js` (cottage, street, steam factory), `bessemer.js` (the x-ray converter), `explainers.js`
(vertical and horizontal integration side-scrolls). `rig.js` is the character model (`figure()`: tapered limbs, poses, expressions,
a level-of-detail rule: solid shape when small, rim light from ~140 px, face from ~520 px) and `MAT` (materials: brick, stone,
planks, iron, water, smoke, ground, trees, floors with perspective, contact shadows). `RIG.md` documents the rig.

Rules that held: coral only for the composite family; teal explains; orange handwriting and tape; real people never drawn
(silhouettes with no face detail and a "NO PHOTO" tag for childhoods); something changes every 4 to 6 s; every new idea gets
a moving picture of how it works, at the word.

## 2. The edit: chapters cut to word timings

`ep1/edit/` (see its README): `edit.html` loads the look-dev scripts plus `edit.js` and one `chNN.js` per chapter. A chapter is
`EDITS.chNN = () => ({dur, shots: [{a, b, draw: (T) => html}]})`; shot boundaries come from `wordAt(ch, word, n)`, the start of the
nth occurrence of a word in `public/audio/<chapter>.words.json`, so a re-voiced chapter re-times itself.
- **Count occurrences before choosing n.** "and", "the", "at", "then", "to", "so", "he", "that", "who" repeat in every chapter; four
  chapters shipped stills with shots starting on the wrong "and". List them first (a 10-line python loop over the words file).
- `remap([[T, clipT], ...])` re-times a look-dev clip (the 18 s Bessemer x-ray, the 22 s vertical-integration scroll) so its beats
  land on the narration's words.
- 0.3 s crossfades between shots; `fadeOut` at the chapter end.
- Check every chapter with `node render_edit.mjs chNN --stills 3,9.5,... <prefix>` and a contact sheet before rendering.
- Helpers in `edit.js`: `deskCut`/`deskProp`, `vocabCard`, `stationClock`, `cableXray`, `drawLine` (self-drawing teal line),
  `stamp`, `compositeBar`, `tape`/`pen`/`mono` from `lookdev/text.js`.

## 3. The desk layer: bust cut-outs, creased prints, props, cards

- **Portraits: `tools/bust_cut.py`** (template `tools/`, from `projects/Gilded_Age/ep1/tools/`): rembg (`u2net_human_seg`) cut,
  crop to head and shoulders (`--bust`), aged (warm tone, lifted blacks, grain, dust, faint scratches). No border, mount or oval.
  `--erode 3-4` pulls the edge in past a light page's halo; `--close 41` fills a notch bitten into a shoulder; enclosed holes the
  colour of the page stay open (the gap under an arm). **Oval engravings on a dark ground** (McClure's, Harper's): crop *inside*
  the oval first, or rembg keeps the whole oval.
- **Prints: `tools/crease.py`**: frameless, creased, chipped, black and white. Crop off every scan margin first (`--crop`); check
  the edges, a 2 % white strip survives easily. Colour maps lose their meaning in B&W: pull the coloured areas out of the original
  (HSV threshold) and lay them back as a teal overlay that lights on the word (the 1878 land-grant map).
- **Props: `tools/prop_cut.py` / `prop_cut_black.py` / `prop_fix.py`** (Flow props). `prop_fix.py fill` restores a white dial or
  enamel rembg took for background; `fillblack` restores a dark wax seal on a black-ground cut; `base` keeps a bulb's glass
  see-through but its brass base solid. A plate whose rim isn't a closed loop: fit an ellipse to the rim colour.
- **On the desk** (`deskCut`): a tight contact shadow plus a soft lifted shadow, a rise into place on the word, a few pixels of
  drift. Captions in mono above; notes in orange handwriting with an ink stroke.
- Drawn devices beat illustrated props: calling cards with a name struck through, a checklist crossed off item by item, a price
  counter, the squeeze chart (cost bars + a price line dropping below a rival's cost), a route with a dotted arc, a swap diagram
  (wagon, certificate, detour), station clocks set from longitude (4 minutes a degree).

## 4. Motion: 12 drawings a second on the desk, smooth scenes

The user's call (Nov 2026): **desk, print, prop, text and drawn-explainer shots step at 12 drawings a second** (each pose held
two or three frames) for the handmade look; **the animated scenes stay smooth at 30** (stepped faces blurred in look-dev).
`editFrame` quantises T for any shot whose draw doesn't call a scene renderer (`LIVE` regex in `edit.js`; set `live: true` to
force); crossfades and fades use real time so cuts never stutter. Output stays 30 fps.

## 5. Voice: a narrator plus character voices, re-voicing one line

`ep1/script/voice_ep1.py`: paragraphs starting `MICHAEL:` / `MA:` are character lines; each run of narrator paragraphs is one
eleven_v4 request (the narrator kept even: stability 0.65, style 0); each character line its own request (0.45 / 0.25); runs
joined with room tone; levelled to -18 LUFS; forced alignment for the word timings, each word tagged with `who`.
- Character voices are made by the user in ElevenLabs from a prompt you write (accent, age, warmth, pace).
- **Re-voice one changed line without touching approved takes**: add it to `CONTEXT_AS` (new text → old text). Neighbours keep
  receiving the old text as context, so their requests hit the cache and stay identical.
- Check every chapter with speech-to-text (ElevenLabs Scribe) diffed against the script before calling it done.

## 6. Music and the mix

Suno cues from a prompt doc (`ep1/script/SUNO_PROMPTS.md`: series sound, Style + tags boxes, minimum lengths measured from the
voiced chapters). This user wanted the beds **lower than the channel's 13 LU: 17 LU under the voice** for this series
(`bed(cue, 17)`). `ep1/script/rough_mix.py` builds a listening mix of the narration with every cue placed. `build_ch.sh` takes
several cues per chapter (`cue@volume@start@offset[@end]`), e.g. a cue's tail into the next chapter, or the theme starting
partway in so its final chord lands on the end screen. **No whooshes or sound effects.**

## 7. Intro + title card

`ep1/edit/title.js`: the Chunk History intro (frames from `brand/chunk-history/final/chunk-intro.mp4`) at **1.4x**, so the lockup
lands by ~2.8 s; it lifts and the episode title lands under it (orange tape, subtitle, "episode N of 6"); about 4.2 s, the brand's
clicks at the same speed, cut before the page turn. Feather the footage's edges into the page background (radial mask) or its
vignette box shows when it scales.

## 8. Rendering, disk and assembly

`build_ch.sh` renders a chapter in 4 parallel Playwright workers (~30 frames/s total at 1080p), mixes, encodes 720p, then
**deletes its PNG frames (about 3 GB a chapter)**: an earlier run filled the disk mid-render and corrupted two chapters. Queue
chapters one after another; never edit `build_ch.sh` while a build is running (bash reads scripts as it goes). `assemble.sh`
joins chapter 1, the title card and chapters 2 to N, mastered to -14 LUFS.

## 9. Mistakes this pipeline already made (so you don't)

- Word anchors on the wrong occurrence (above). A helper named `W` collided with the scene kit's `W` (frame width).
- A character line that contradicted the picture ("you can see the whole river from up here" said on the ground): read every
  character line against its shot.
- White page margins on prints; the orchestral 15 Minute History sting left on a Chunk History video; a stray preview file
  written to `/` by an image agent.
- Images sent mid-turn in chat may not be saved as files: ask for a zip.
