# Reconstruction: visual test clips

Three 15-second tests of new techniques for the Reconstruction series, built from the channel template. None of them
is a finished scene; each one answers "does this look good enough to use, and what does it cost?"

| Clip | Composition | What it tests | Render (this container, no GPU) |
|---|---|---|---|
| 1 | `Test-Stereo` | An 1865 stereograph: the card on the desk, a flick between its two photos (real parallax), then a camera move *into* the photo | about 14 min |
| 2 | `Test-Fords` | Ford's Theatre as a cream-card architect's model: the box, Lincoln's chair, the 12-foot drop, the landing. No people | about 12 min |
| 3 | `Test-Acres` | Special Field Order No. 15 on the 3D map, the flight to Edisto Island, 1,085 forty-acre plots popping up, then sinking back and the island going grey | about 15 min (no WebGL, but a thousand SVG plots) |

Renders: `renders/` (720p review reel). The 1080p files are in `out/` and not committed.

```sh
npm install
npx remotion studio                                   # preview
npx remotion render src/index.ts Test-Stereo out/test1_stereograph.mp4 --gl=swangle   # 3D clips need --gl=swangle here
npx remotion render src/index.ts Test-Acres out/test3_forty_acres.mp4
```

`--gl=angle` fails in this container ("Error creating WebGL context"); `--gl=swangle` (SwiftShader) works.

## 1. The stereograph (`src/tests/StereoTest.tsx`)

**Source:** *View from the Petersburgh railroad Depot, Richmond, Va., looking south-west, showing a portion of the burnt
district, and Gamble Hill in the distance.* E. & H.T. Anthony & Co., 1865. Library of Congress, LC-DIG-ppmsca-18951 (no known
restrictions). Full-resolution TIFF from loc.gov.

**How the depth was made:**

1. `tools/stereo_depth.py` splits the card into its two photos, matches about 3,000 SIFT points between them, and lines up
   the right photo vertically. Dense stereo matching (OpenCV SGBM) failed on the 1865 prints (grain, fading), so the
   pair is used for two things only: the flick, and a check.
2. `tools/mono_depth.py` runs Depth Anything V2 (small, ONNX, on the CPU in about 8 s) on the left photo.
3. **The check:** after taking out a slight shear between the two prints, the stereo pair's own matches agree with the
   depth map (rank correlation 0.44). The two chimneys sit about 7 pixels proud of the far city in the pair itself (6.0 and
   7.2 vs −3.3). So "the depth is real" is a fair line: the photographer's two lenses confirm it.
4. `tools/prep_stereo.py` cuts the near chimneys out with alpha (edges snapped to the dark brick against the lighter
   ground), paints them out of a back layer, and writes a depth map for each layer.
5. In the scene, both layers are meshes displaced by their depth maps (three.js through `@remotion/three`). The near layer
   has clean cut edges; the back layer uses a flattened depth so nothing stretches like a rubber sheet.

**What's still imperfect:** where the camera reveals what was behind a chimney, the painted-in background is smeary (a
short soft streak at the chimney edges late in the move). A better fill (or filling from the *right* photo, which saw
a little behind each chimney) would fix it. The flick shows only the real parallax, which is small (a few pixels), so it
reads as a shimmer rather than a big jump.

## 2. Ford's Theatre (`src/tests/FordsTest.tsx`)

A low, cream-card model with inked edges, built in feet: stage and apron, a proscenium, benches on the house floor, a
horseshoe dress circle, and the President's box 12 feet above the right edge of the apron, with its rail and drapes in
coral (the one subject colour). The right wall fades out when the camera goes behind the box, as an architect's model
would leave a wall off. A teal dashed rule measures the drop. The camera: the house, up to the box, behind it (the
rocking chair), a side view of the drop, the rail, the fall, and a turn on the stage to look back up.

**Proportions are approximate** (said on screen). Before using this in Episode 1, fit it to the National Park
Service's plans and the 1865 photographs of the box.

**What's still imperfect:** no detail (no flag, no wallpaper, no gas fixtures), simple lighting, and the box interior
is boxy. It's a test of the *idea*: an empty, measured room, with the event told and not shown.

## 3. The forty acres (`src/tests/AcresTest.tsx`)

The template's tilted 3D map (`src/kit/map3d.tsx`) with a new base map, `tools/build_sea_islands.py`:

- **Coast:** U.S. Census cartographic boundaries (1:500,000), with the Census water areas for Charleston and Colleton
  counties cut out so Edisto Island is an island. The land runs well past the camera so no map edge ever shows.
- **The Field Order 15 strip** (approximate, said on screen): land within 30 miles of the open sea, from Charleston
  south to the St. Johns River.
- **The plots:** squares of 402 m (40 acres), clipped to the island: 1,085 of them, about 43,000 acres, which is about the
  size of Edisto Island. That's land area, not a count of families (the script never says how many families got plots).
  They're drawn in three SVG layers (shadow, side, top), so a thousand slabs stay cheap.

**What's still imperfect:** the order's real boundary was "the islands from Charleston south, the abandoned rice fields
along the rivers for thirty miles back from the sea, and the country bordering the St. Johns River," which is
lumpier than a 30-mile band. Fine for a test; for the episode, draw it from the order's text.

## Tools added here

| Tool | Does |
|---|---|
| `tools/stereo_depth.py` | Split a stereo card, align the pair vertically, save the sparse matches |
| `tools/mono_depth.py` | Depth Anything V2 (ONNX) depth map, plus the check against the stereo matches |
| `tools/prep_stereo.py` | The layers for the stereograph scene |
| `tools/build_sea_islands.py` | The Sea Islands base map, the Field Order 15 strip, Edisto and the 40-acre plots |

Python needs `opencv-python-headless numpy scipy onnxruntime pyshp shapely`. The depth model (99 MB, Apache-2.0) is
`onnx-community/depth-anything-v2-small` on Hugging Face; it isn't committed.
