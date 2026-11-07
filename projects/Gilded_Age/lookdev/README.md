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
