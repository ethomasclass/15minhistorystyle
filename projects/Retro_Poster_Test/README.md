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

## What comes from claude-drawing-skill
[cloveric/claude-drawing-skill](https://github.com/cloveric/claude-drawing-skill) (MIT) paints 83 styles with numpy +
Pillow. Two ideas from it are used here:
- **Trees** (`tools/trees.py`): the `SunlitGreen.canopy()` painter (vendored unmodified in `tools/vendor/`), set to
  angular `chip` leaves and five flat olive tones, with a lit stripe on each limb. `scene_tree(x, base, h, ...)` grows a
  tree from a height and lean and returns an SVG `<image>`. The canopy paints on an opaque canvas, so each tree is painted
  on black and on white and the alpha is recovered from the difference.
- **Seam shadows** (`seam()` in `tools/facet.py`): FlatVector's depth cue, where every lifted layer drops a short soft
  night-blue shadow on what is below, so overlaps read as stacked paper.

The skill's working method (render, look, fix against a checklist, 2–4 rounds) is how these stills were tuned.

## Gemini route (for archival photos)
The same look as an image-edit prompt, for `tools/gemini_edit.py` (copy it from `projects/Diamond_Hoax/tools/`):

> Redraw this photograph as a mid-century retro travel-poster illustration. Flat, faceted, low-poly shapes with crisp
> angular edges, each plane a single flat colour lit from the upper left. Muted palette: olive and moss greens, slate and
> warm greys, sandstone tan, dusty blue sky, cream clouds with flat scalloped shapes. Aged paper texture with fine grain
> and slight blotching. Trees as angular clusters of leaf shards on thin dark trunks. People small and simple, one or two
> picked out in a single spot colour (burnt orange, dusty pink or mustard). A thin cream construction circle and crosshair
> faintly over the sky. Keep the composition, buildings and people of the original. No text, no signature, no border.
