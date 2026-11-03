# Diamond Hoax components (*They Fooled America's Richest Men*, Oct 2026)

Copied from `projects/Diamond_Hoax/src/fx/` and `src/kit/conCard.tsx`. Not wired into the template: copy what you need into a
project's `src/fx/` (keep the `terrain/`, `desk/` and `moneymap/` helper folders beside the pieces that import them) and fix the
imports of `../kit/*` and `../masks`. Every piece takes its beats as frame props and exports a `...Test` composition with defaults;
the header comment of each file lists its props.

| File | What it is | Used for |
|---|---|---|
| `fx/ColdOpenDepth.tsx` → `ColdOpenReveal` | **The thumbnail as the cold open's punchline.** The thumbnail picture rebuilt as CSS depth planes; opens tight on the coral subject, a background painting fades in behind on the line that names the place, then the camera pulls back and the foreground figures slide in from the sides into the exact thumbnail frame; loops and notes land once it settles; a money tag lands where the thumbnail's tape words sat. The background is itself split into depth planes (real parallax) with coloured light (blue window light, warm lamp glow). `ColdOpenDepth` is the plain version (a slow dolly on the thumbnail planes) for callbacks and the title card. | Frame 0 = the thumbnail, but acted out |
| `kit/conCard.tsx` → `ConCard` | A recurring checklist card (six numbered rows, a counter, rows fill in orange with a teal example, ticks for the recap). Shown empty once as a tease, popped in small for 3-4 s whenever a row is named, full for the recap. | Any "the N parts of X" spine |
| `fx/Mesa.tsx` + `fx/terrain/` | A tilted teal-contour terrain slab from **real elevation** (AWS Terrarium tiles, baked by `tools/bake_heightmap.py`), state line, labelled places, coral points dropping in, stakes, a drain to grey, a counted ring | Any real place where something happened on the ground |
| `fx/LoopingRide.tsx` | The same terrain zoomed out: a pin, a dashed straight line, then a route drawing itself in loops over DAY ticks ("route illustrative") | A journey made confusing on purpose |
| `fx/AnthillCutaway.tsx` | A drawn 3D block sliced open to show what's inside (stick hole, planted stone, boot prints, an untouched neighbour) | Physical evidence |
| `fx/GemOrigins.tsx` | A 3D earth cut-away with three columns, things lifted onto one surface, an X slam | "These never occur together" |
| `fx/Dominoes.tsx` + `fx/desk/kit3d.tsx` | Four labelled 3D tiles that tip and stop short, grow, reset, then fall for real (physics baked at module load, deterministic) | A chain reaction explained, then paid off later |
| `fx/BankVault.tsx` | A cut-away bank: deposits in, loans out, a thin reserve, the line at the door, the vault empties | Bank runs, fractional reserves |
| `fx/ShareSlices.tsx`, `fx/ShortSale.tsx` | A company sliced into shares; a short sale as four lanes (borrow, sell, crash, return) with a prop joke | Money terms for a general audience |
| `fx/MoneyMap.tsx` + `fx/moneymap/` | A drawn Mercator slab (Natural Earth coastlines) with an object travelling orange dashed arcs | Money or goods moving between cities |
| `tools/gemini_edit.py` | Gemini image *edit* (send an image plus an instruction): used to strip background hatching out of an engraving so its cut-out has no ragged patches | Cleaning AI art before masking |
