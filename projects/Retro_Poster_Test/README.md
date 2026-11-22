# Retro faceted-poster style test

A style test based on a retro travel-poster illustration (flat, faceted planes, muted olive, slate and cream, paper grain, a
typewriter title, thin construction lines, tiny figures picked out in one spot colour).

## Procedural stills (no API needed)
```
for s in cast balloon mesa; do
  python3 tools/scene_$s.py build/$s.svg && node tools/render.mjs build/$s.svg build/${s}_raw.png
done
python3 tools/press.py build/cast_raw.png    stills/00_cast_sheet.png
python3 tools/press.py build/balloon_raw.png stills/01_balloon_fair_oaks.png
python3 tools/press.py build/mesa_raw.png    stills/02_salted_field_1872.png
```
Needs `numpy`, `scipy` and `Pillow`. Trees are cached in `build/` by their settings, so re-renders take seconds.

| File | What it does |
|---|---|
| `tools/facet.py` | The kit: Delaunay facets shaded from a height field and posterised to a ramp, cliffs with vertical ridges, sky gradient, two-tone clouds (`cloud2`), haze bands (`mist`), faceted ridges, moss, tufts, rocks, ropes, construction arcs, titles, seam shadows, the paper finish. |
| `tools/figures.py` | **People and animals.** `person()` is a jointed rig 8 units tall (side, front or back view) with 14 poses (`stand`, `walk`, `haul`, `pull`, `kneel`, `bend`, `sit`, `glass`, `write`, `hips`...), coats of any length, dresses, vests, belts, straps, beards, 7 hats, a shade side and a cast shadow. It returns the joints, so ropes and tools attach to hands. `mule()` draws mules and horses; `rifle()` and `tool()` add props. |
| `tools/trees.py` | Poster trees from the drawing-skill canopy painter (see below). |
| `tools/press.py` | The print pass on the finished render: ink dropout specks, uneven ink density, 1 px plate misregistration, paper fibres, worn edges. |
| `tools/scene_*.py` | The scenes. Each is plain Python that places the pieces. |

## Animated test (`video/balloon_test_12s.mp4`)
```
python3 tools/anim_balloon.py                       # layers, stage and per-frame data -> build/anim/
node tools/anim_render.mjs build/anim               # layer PNGs once, then 360 frames
python3 tools/anim_encode.py build/anim video/balloon_test_12s.mp4   # print pass, sound, ffmpeg
```
About two and a half minutes end to end. Seven depth planes (sky, clouds, ridges, camp, launch ground, crag, trees) sit
under a slow push-in camera, each moving by its depth. The static part of every plane is rendered once to a cut-out
PNG with overscan; whatever moves (figures, ropes, flag, smoke, birds, title) is regenerated for each frame from the
same rig. Figures and marks step at 12 drawings a second and the camera and balloon glide, as in the channel's rule 3.
The paper texture is applied after the frame is drawn and never moves. Sound is mixed from the repo's `sfx/`
(birds, rope creak, morse code, a tick per typed letter).

## Scene type 2: the portrait (`stills/03_portrait_lowe.png`, `video/portrait_reveal_14s.mp4`)
A medium shot of a named person, for the moments a wide scene can't carry. It uses the same palette, paper and print
pass, and it does not touch the wide-scene kit (`figures.py` still draws the small faceless figures).
```
python3 tools/scene_portrait.py build/portrait.svg && node tools/render.mjs build/portrait.svg build/portrait_raw.png
python3 tools/press.py build/portrait_raw.png stills/03_portrait_lowe.png
python3 tools/reveal_portrait.py && node tools/anim_render.mjs build/reveal
python3 tools/anim_encode.py build/reveal video/portrait_reveal_14s.mp4
```
- `tools/portrait.py`: `bust()` draws a head and shoulders with no outlines. The face is read from shade planes (eye
  socket, nose, lip, cheek, jaw), a simple eye and brow, hair and whiskers. Options: skin, hair colour and style
  (`parted`, `short`, `long`, none), moustache (`walrus`, `trim`), beard (`full`, `chin`), hat (`slouch`, `kepi`),
  coat, cravat, `age`. It returns ordered `(stage, svg)` pieces: `flat`, `shade`, `detail`.
- `tools/scene_portrait.py`: Lowe in the basket of the Intrepid, the camp far below.
- `tools/reveal_portrait.py`: the picture assembles itself. Guide lines draw on, the sky washes in, then each shape is
  laid down in order (stepped at 12 drawings a second) with a soft paper sound, and the caption types on.

## Paper and movement (`video/portrait_paper_16s.mp4`, `stills/04_portrait_paper.png`)
The same portrait as real cut paper, placed by hand and then moved like a puppet. A separate treatment: the poster
scenes and the first reveal are unchanged.
```
python3 tools/reveal_paper.py            # builds the pieces and rasterises each once with its paper filter
node tools/anim_render.mjs build/paper
python3 tools/anim_encode.py build/paper video/portrait_paper_16s.mp4
```
- `tools/paper.py`: SVG filters that turn a flat shape into paper. `cut` (scissors: a slightly wandering outline,
  fibres and tooth, and the sheet's thickness as a pale lit edge and a dark edge), `torn` (a ragged outline with the
  pale core of the paper showing as an uneven rim), `kraft` (the board), and eight shadow levels from lying flat
  (`sh0`, a thin contact line) to held above the page (`sh7`, wide, soft and far away).
- `tools/paper_pieces.mjs`: rasterises every piece once, cropped to its own box, so frames only move images.
- `tools/reveal_paper.py`: a torn sky sheet is laid on a kraft board and taped; guide lines are pencilled; each piece
  arrives lifted (a little larger, turned, wide shadow) and is lowered in five stop-motion drawings; shade is rubbed
  on; then a jointed arm on a brass pin swings a spyglass up and the head tips to meet it.

## What comes from claude-drawing-skill
[cloveric/claude-drawing-skill](https://github.com/cloveric/claude-drawing-skill) (MIT) paints 83 styles with numpy +
Pillow. Two ideas from it are used here:
- **Trees** (`tools/trees.py`): the `SunlitGreen.canopy()` painter (vendored unmodified in `tools/vendor/`), set to
  angular `chip` leaves and five flat olive tones, with a lit stripe on each limb. `scene_tree(x, base, h, ...)` grows a
  tree from a height and lean and returns an SVG `<image>`. The canopy paints on an opaque canvas, so each tree is painted
  on black and on white and the alpha is recovered from the difference.
- **Seam shadows** (`seam()` in `tools/facet.py`): FlatVector's depth cue, where every lifted layer drops a short soft
  night-blue shadow on what is below, so overlaps read as stacked paper.

- **Paper** (`paper.py`): the torn rim and paper depth of its paper collage, the print-then-tear-or-cut model of its
  newspaper collage, and the lifted-sheet shadows of its overlay sheets, rebuilt as SVG filters.
- **Movement** (`reveal_paper.py`): pieces joined at a pivot and posed by angle, as in its shadow puppets, and
  stop-motion placement on twos.
- **Staged pictures** (`reveal_portrait.py`): every style in the skill can save its picture stage by stage; here the
  same idea runs shape by shape.
- **A face for medium shots** (`portrait.py`): prompted by the head with a simple eye in the skill's flat-illustration
  style, redrawn in this poster's faceted planes.

The skill's working method (render, look, fix against a checklist, 2–4 rounds) is how these stills were tuned.

## Gemini route (for archival photos)
The same look as an image-edit prompt, for `tools/gemini_edit.py` (copy it from `projects/Diamond_Hoax/tools/`):

> Redraw this photograph as a mid-century retro travel-poster illustration. Flat, faceted, low-poly shapes with crisp
> angular edges, each plane a single flat colour lit from the upper left. Muted palette: olive and moss greens, slate and
> warm greys, sandstone tan, dusty blue sky, cream clouds with flat scalloped shapes. Aged paper texture with fine grain
> and slight blotching. Trees as angular clusters of leaf shards on thin dark trunks. People small and simple, one or two
> picked out in a single spot colour (burnt orange, dusty pink or mustard). A thin cream construction circle and crosshair
> faintly over the sky. Keep the composition, buildings and people of the original. No text, no signature, no border.
