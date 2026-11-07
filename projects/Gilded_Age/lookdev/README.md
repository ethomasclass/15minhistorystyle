# Gilded Age series: look development (Nov 7, 2026)

A test of a **2D side-scrolling silhouette style** for Chunk History's Gilded Age series, on one scene: the Brooklyn Bridge
opening, May 24, 1883, with Michael Kelly (the composite family's eldest son) in the crowd. **Everything is drawn in code**
(no AI images, no Veo): sky, skyline, bridge, boats, pier, crowd and Michael are SVG shapes, so they stay consistent from shot
to shot, can be edited, and can be animated. The figures are rigs: limbs are separate strokes, so a walk or a wave just turns joints.

| File | What it is |
|---|---|
| `scene.js` | The scene builder: five looks, five parallax planes (0.25 / 0.5 / 0.75 / 1.0 / 1.35), the figure rig |
| `text.js` | On-screen text options: three section titles, five vocab cards, callouts + the composite label, the series question |
| `bridge.html` | The page both load into; fonts come from `brand/fonts/` |
| `render.mjs` | `node render.mjs [filter]` renders the frames to `out/` (1920x1080) |
| `scroll.mjs` | `node scroll.mjs <dir>` renders the 9-second scroll test's frames; then `ffmpeg -framerate 30 -i <dir>/f%04d.png -vf scale=1280:720 -c:v libx264 -pix_fmt yuv420p -crf 20 out/scroll_test_720p.mp4` |
| `sheet.py` | Converts frames to JPG and builds the four labelled sheets in `sheets/` |
| `frames/`, `review/` | Copies of the 19 frames and the scroll test (`out/` is git-ignored, as in every project) |

Checked against the bridge's real proportions (towers about 276 ft above the water, main span 1,595 ft, side spans 930 ft,
deck about 119 ft up). One known cheat: a true side view hides the towers' Gothic arches; like most illustrations, we show them.
Not yet decided: the look, coral meaning "a Kelly", which text styles, and whether "GOLD" gets its one off-palette gold leaf.

## Round 2 (same day): looks 1 and 2, a living scene, detail that follows the camera

- **Movement.** Everyone idles (breathing, weight shifts, glances); some cheer with a hat, point, wave or hop; the child on his
  father's shoulders waves. Flags ripple, bunting sways, ships rock, the ferry's walking beam rocks and its smoke drifts, rowers pull,
  gulls cross, mist drifts, the river shimmers, and at night the fireworks launch, burst and fall. Drawn motion steps at 12 drawings
  a second; the camera and mist glide.
- **Detail follows the camera.** A figure under about 400 px tall on screen is one solid shape; bigger, it gains a rim of light on the
  lit side (at night it flickers with the fireworks); in a close-up (over about 600 px) it gains collar, lapel, buttons, cuffs, a
  trouser crease, a hat band, hair, an ear, an eye that blinks, and on women a lace collar, buttons and skirt folds. Wides keep the
  channel's solid-silhouette rule; close-ups loosen it on purpose.
- **Vocab:** index card and x-ray chosen; the handwritten words are now orange, the drawn lines stay teal.
- `anim.mjs <clip> <dir> [start] [end]` renders a clip's frames (clips: `alive_dusk`, `fireworks_night`, `closeup_night` in
  `scene.js`). The three clips are in `review/`.

## Round 3: Michael walks home

`street.js`: a Lower East Side tenement street at dusk, about 1883, in look 1. The camera tracks Michael as he walks home from the
refinery with a tin dinner pail. The rig now has a walk cycle (`walkAn`: thighs swing, the knee bends on the swing, arms
counter-swing, the body bobs twice a stride), stepped at 12 drawings a second while the camera glides.

Around him: five-storey tenements with cornices, fire escapes (required on tenements after 1867) hung with laundry, gaslit windows
with figures in some, shop awnings and stoops; a pushcart peddler; a delivery wagon and a walking horse going the other way, its
spoked wheels turning; telegraph poles strung with the overhead wires New York buried only after 1889; gas street lamps; factory
smoke and a steeple beyond; people passing on both sidewalks and a boy chasing a hoop. Signs are blank on purpose.

Clips: `walk_wide` (10 s, the whole street) and `walk_medium` (7 s, zoom 4.2, where his close-up detail shows). In `review/`.

## Round 4: better reads

- **Heads are profiles now** (skull, forehead, brow, nose, lips, chin, jaw) for every figure, so even a solid silhouette reads as a
  face in profile; women get a softer brow and smaller nose, children a rounder, larger head.
- **Expressions for close-ups**: neutral, smile, worried, awe, set (determined), plus blinks. Each is a brow, an eye and a mouth
  (and a cheek crease for a smile); awe also drops the jaw in the silhouette. `out/` sheet: `7_round4`.
- **The walk is locked to the ground** (`walkPhase` + `walkAn` in `street.js`): each foot stays planted while it is down, and
  positions step with the drawings, so feet no longer skate.
- **The wagon driver sits** (thighs forward, shins down, hidden by the box), and **the horse walks a four-beat gait** with the hind
  legs folding the other way at the hock, tapering legs and a mane.
- In the clips: Michael walks home tired and set, smiles and nods at the neighbour with the basket as she passes (she smiles back),
  and blinks; at the bridge he smiles while he waves, then looks up in awe. The night crowd watches in awe or smiles.

## Round 5: a reusable model, smooth motion, the tenement cutaway

- **`rig.js`** now holds the whole character model (see `RIG.md`): tapered limbs, mitten hands with a thumb, boots, working skirts,
  shawls, aprons, a maid's cap and apron, knee breeches, a skullcap, shirtsleeves and vest, props, lying down, twelve poses, the
  cast, and one level-of-detail rule. Detail now arrives sooner (face from about 520 px tall instead of 680).
- **Smooth motion.** Characters animate at the full frame rate (you found the 12-a-second steps blurred the faces); clips are now
  encoded at 1080p.
- **`cutaway.js`**: a six-storey tenement cut from the street to the back yard, about 1883. Roof (laundry, children, chimney smoke);
  five floors of railroad flats with dark middle rooms; the Jewish neighbours' garment shop on the fourth floor; the Kellys on the
  third; boarders, a cradle, lodgers asleep; a saloon at street level; a cobbler and a lodger in the cellar; the dark stair hall;
  privies, a hydrant and laundry on pulleys in the yard; the rear tenement. Clip `cutaway_push` (14 s): the building alive,
  Michael climbs the stairs, the camera pushes into the Kellys' flat, he comes in, his mother turns from the stove, his brother and
  sister look up. A labelled still shows the teaching version (teal leader lines, orange handwriting).
