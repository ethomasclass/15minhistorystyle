# Retro faceted-poster style test

A style test based on a retro travel-poster illustration (flat, faceted planes, muted olive, slate and cream, paper grain, a
typewriter title, thin construction lines, tiny figures picked out in one spot colour).

## Procedural stills (no API needed)
```
python3 tools/scene_balloon.py build/balloon.svg && node tools/render.mjs build/balloon.svg stills/01_balloon_fair_oaks.png
python3 tools/scene_mesa.py    build/mesa.svg    && node tools/render.mjs build/mesa.svg    stills/02_salted_field_1872.png
```
`tools/facet.py` is the kit: Delaunay facets shaded from a height field and posterised to a colour ramp, cliffs with
vertical ridges, flat scalloped clouds, angular trees and pines, figures, construction arcs, titles, and the paper finish
(blotchy tone, grain, warm vignette). Needs `numpy` and `scipy`. Everything is vector, so each element can become its own
parallax layer later.

## Gemini route (for archival photos)
The same look as an image-edit prompt, for `tools/gemini_edit.py` (copy it from `projects/Diamond_Hoax/tools/`):

> Redraw this photograph as a mid-century retro travel-poster illustration. Flat, faceted, low-poly shapes with crisp
> angular edges, each plane a single flat colour lit from the upper left. Muted palette: olive and moss greens, slate and
> warm greys, sandstone tan, dusty blue sky, cream clouds with flat scalloped shapes. Aged paper texture with fine grain
> and slight blotching. Trees as angular clusters of leaf shards on thin dark trunks. People small and simple, one or two
> picked out in a single spot colour (burnt orange, dusty pink or mustard). A thin cream construction circle and crosshair
> faintly over the sky. Keep the composition, buildings and people of the original. No text, no signature, no border.
