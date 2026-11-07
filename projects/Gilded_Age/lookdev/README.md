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
