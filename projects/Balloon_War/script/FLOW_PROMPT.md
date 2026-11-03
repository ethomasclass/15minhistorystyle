# Google Flow prompt: Balloon War silhouette scenes (v2)

One prompt for the Flow agent, covering all 16 silhouette scenes in `SILHOUETTES.md`, ordered so later images can use earlier
ones as style and location references. The user's rule (Nov 2026): **figures are solid black, with no light or transparent lines
for faces, clothing or any other detail.** After generation: `tools/sil_palette.py` (lock), then `sil_layers.py` (planes), then
`SilScene`.

Paste everything between the lines.

---

You are generating a set of 16 illustrations for a history documentary about Japan's paper balloon bombs in World War II
(1942–1987). They will be split into depth layers and animated with a slow parallax camera move, so they must share ONE
consistent style and palette, and they must separate cleanly into layers. Work through the shots IN ORDER. Image 1 is the master
style reference: use it as a style reference for every later image. Where a shot says "Reference", also use that earlier image for
location or composition.

## Output for every image
- 16:9 landscape, the highest resolution available (at least 2K wide). One image per shot (if you make variations, mark the best).
- File name exactly as given (e.g. `BW01_beach_dawn`). Keep the prompt you used with each file.
- No frame, border, vignette, letterbox bars, logo, watermark or signature.

## The style (identical for all 16)
A layered silhouette illustration, like a side-scrolling shadow-puppet scene or a cut-paper diorama. The image is built in flat
bands from front to back:
1. **Foreground:** everything nearest the viewer (the ground, rocks, grass, trees, buildings, people, animals, vehicles,
   objects) is a solid, flat, warm-black shape with crisp edges and fine detail ONLY in the outer outline: pine needles, grass
   blades, twigs, hair, cap brims, frayed cloth edges, ropes.
2. **Two or three distance layers** behind it (hills, trees, shore, rooftops) in progressively lighter, hazier, flat tones, as if
   seen through mist. Each layer is one flat tone with a soft mist band at its base.
3. **The sky** at the back: smooth, quiet, dark teal-black at the top fading to a pale glow near the light source.

## THE FIGURE RULE (most important; no exceptions)
Every person, animal and object in the foreground is ONE solid, opaque, flat black shape. **No interior detail of any kind:** no
facial features, no eyes, nose or mouth, no light or white lines inside the shape, no rim light, no highlight edges, no glowing
outline, no transparent or see-through lines for collars, buttons, belts, pockets, folds, seams, fingers or hair strands. The
ONLY information is the outer silhouette in clear profile. Natural gaps between separate parts (the space between an arm and the
body, between legs, between fingers held apart) are fine; lines drawn INSIDE a shape are not. No glow or halo around figures,
even when they stand in front of the light: the edge stays crisp black against the background.

## THE PALETTE (strict)
- Foreground shapes: warm ink black **#0D0C09** (not blue-black).
- Distance layers, nearest to farthest: **#1C3332 → #335652 → #5F857F → #A3BAB2** (deep teal-slate to pale sage).
- Sky: dark teal-black **#111B1B** at the top, fading toward a pale glow **#DFE0D6** near the light source.
- Light (moon, dawn line, windows, lamps): soft cream **#F4EFE6**. Never yellow, never orange.
- **ONE accent only, coral #FF6F61, and only on the object named "CORAL" in the shot** (the paper balloon or its paper). If a
  shot says "no coral", there is no saturated colour at all.
- Never: orange, yellow, gold, purple, pink sky, red sun, warm sunset, fire-coloured flames, blue daylight sky.

## Composition rules (so the layers split cleanly)
- Keep 3–4 clearly separated depth bands; don't let mist cover the foreground.
- Figures small against the landscape, in readable side profile, not overlapping each other in a tangle.
- Keep everything important inside the central 80% of the frame (the camera will push in slightly).
- One light source per image. No lens flares, no light rays over the foreground.
- Period accuracy for the stated year and place: no modern buildings, clothing, vehicles or objects.
- **No text of any kind:** no letters, numbers, signs, labels, newspaper headlines, book titles, shop names or writing, even on
  newspapers, books, doors or windows (leave them blank).
- No recognizable real person; every figure is anonymous.

## The shots, in order

**1 · `BW01_beach_dawn`** (MASTER STYLE REFERENCE)
Japan, a sandy beach on the Pacific coast east of Tokyo, winter 1944, just before dawn. Six teenage boys in work clothes and soft
caps hold the ropes of a huge paper balloon, about 10 metres across, half filled and swelling upward, tethered close to the sand.
A row of tall steel gas cylinders stands on the sand beside them. Low surf in the near-distance layer, the flat sea beyond, a thin
cream line of dawn on the horizon at right. CORAL: the paper balloon only (its envelope; its ropes stay black).

**2 · `BW02_release`** (Reference: image 1 for the beach, boys and balloon)
The same beach from behind and slightly above the boys, a little later. A single paper balloon, small now, rises over the sea
toward the brightening horizon. Below it hangs a black ring with small sandbags around it and a short line below. The six boys
stand on the sand in silhouette, watching. CORAL: the rising balloon only.

**3 · `BW03_woods_open`** (Reference: image 1 for style)
A steep mountainside forest of tall ponderosa pines in Oregon, 1945, morning, mist between the trunks. A large deflated paper
balloon is draped over low branches between two trees, partly collapsed, its ropes trailing down to a metal ring with small
sandbags resting on the needle-covered ground. **No people.** Soft cream light from behind the far ridge. CORAL: the draped paper
balloon only.

**4 · `BW04_bly_road`** (Reference: image 3 for the forest; QUIET PALETTE)
The same pine forest, on a narrow dirt logging road, morning. A 1940s sedan is parked on the road under the tall pines, doors
closed. **No people.** QUIET PALETTE for this shot: flat grey-green fog (#2A3432 → #55625F → #8F9A95 → #C3C8C2), no glow, no
light source visible, **no coral, no saturated colour anywhere.**

**5 · `BW05_cranes`** (Reference: image 3 for the forest)
The same pine forest, years later, soft morning light. A simple, rough stone monument stands in a small clearing (blank, no
plaque or writing). From a low pine branch beside it hang several long strings of folded paper cranes. No people. CORAL: the paper
cranes only.

**6 · `BW06_raid_tokyo`** (Reference: image 1 for style)
Tokyo, spring 1942, daytime haze. Seen from rooftop level: a foreground of traditional tiled roofs and wooden buildings, a pagoda
in the middle distance, the city fading back in layers. Two American twin-engine, twin-tail bombers (B-25 type) fly low across
the sky, left to right. **No coral.**

**7 · `BW07_weatherman`** (Reference: image 1 for style)
Japan, the 1920s, dawn. A man in a long coat stands on the flat roof of a small weather observatory, releasing a small round
pilot balloon into the sky with one hand, beside a surveying theodolite on a tripod. Fields and low buildings below, a twin-peaked
mountain on the far horizon. CORAL: the small pilot balloon only.

**8 · `BW08_theater_girls`** (Reference: image 1 for style)
Inside a grand 1940s Tokyo theater, wartime. The stage, proscenium arch and balconies are dim layers in the haze behind. On the
floor in the foreground, rows of teenage schoolgirls with short bobbed hair (no hair ornaments), in blouses and loose work
trousers, kneel on flat cushions at long low tables, gluing large sheets of paper into panels. Hanging work lamps give cream
pools of light. CORAL: only the paper panel under the nearest lamp.

**9 · `BW09_rei`** (Reference: image 8 for the girls, the hall and the lamps)
A closer view in the same theater: one schoolgirl in side profile kneels at a low table, short bobbed hair, smoothing a large
paper panel with a wide flat brush. A work lamp hangs above her. The hall fades into haze behind. Solid black figure, no face
detail. CORAL: her paper panel only.

**10 · `BW10_wyoming_flash`** (Reference: image 1 for style)
Wyoming, December 1944, just after sunset. A ranch: a wooden windmill, a rail fence and a small barn in the foreground; two ranch
hands in hats stand by the fence looking up. High in the darkening sky, a small burst of light and, below it, a small
parachute-like shape drifting down. Low bluffs on the horizon. CORAL: the burst and the falling shape only.

**11 · `BW11_smokejumpers`** (Reference: image 1 for style)
The Pacific Northwest, summer 1945. A forested ridge of pines in the foreground; beyond it, two columns of smoke (pale cream-grey,
NOT orange, no visible flames) rise from the next valley. Several round parachutes with paratroopers hanging below them drift
down over the ridge, and a twin-engine transport plane (C-47 type) flies away in the distance. **No coral.**

**12 · `BW12_price_desk`** (Reference: image 1 for style)
Washington, D.C., winter 1945, night. Inside a government office: a man in shirtsleeves sits at a big wooden desk piled with
newspapers (blank pages, no headlines), a desk lamp beside him, seen in side profile. Behind him, a tall window shows the city at
night with the dome of the U.S. Capitol in the distance. **No coral.**

**13 · `BW13_presses`** (Reference: image 12 for style and light)
A 1940s newspaper pressroom at night. Huge rotary printing presses fill the foreground, paper streaming through the rollers (blank,
no print), two or three pressmen in caps working beside them. Hanging lamps; the far wall in haze. **No coral.**

**14 · `BW14_aug15_dc`** (Reference: image 12 for the building and the light)
The same government building, a long office corridor at dusk. A closed wooden office door in the foreground, with a blank white
card pinned to it (no writing). Long window light falls across the floor from the right. No people. **No coral.**

**15 · `BW15_aug15_japan`** (Reference: image 1 for style)
Japan, a hot summer morning in August 1945. A teenage boy stands in a small vegetable patch (tall plants, bean poles) in front of a
modest wooden house; a small radio sits on the open windowsill. Far behind the town, a thin column of smoke rises into the haze.
**No coral.**

**16 · `BW16_bookstore`** (Reference: image 8 for style)
A quiet Japanese shopping street in the 1970s–80s, early evening. A middle-aged woman with a shopping bag has stopped in front of a
bookstore window, seen in side profile. Inside the window, among blank book shapes, one framed photograph of a round paper balloon
glows softly. Shop fronts and power lines fade back in the haze. No signs or writing anywhere. CORAL: only the balloon in the
photograph.

## Final check before delivering each image
Reject and regenerate any image that has: any light or transparent line inside a figure (faces, collars, folds, buttons); a glow
or rim light around a figure; any text or lettering; orange, yellow, gold or purple anywhere; coral on anything other than the
named object; people in shots 3, 4, 5 or 14; modern objects.

---

## Round 1 results (Nov 3, 2026; 16 images at 1376×768, `public/img/gen/scenes/BW*.jpg`, contact `review/contact/flow_scenes_v1.jpg`)

Keepers: 03, 04, 05, 06, 07, 10, 11, 13, 14, 15. They're on palette already; `sil_palette.py` mutes their coral a little, so
use the lock only on images that drift (it fixed BW12's brown desk). Comparison: `review/contact/flow_scenes_v1_locked.jpg`.

Redo:
- **01, 02:** the balloon is a teardrop hot-air-balloon shape; the real ones were round, a paper sphere.
- **08, 09, 12:** light lines inside the figures (sleeves, folds, cushion edges; Price's lit rim along back and arm); BW12's desk
  and chair are brown. Fallback if a redo still has lines: `tools/sil_solidify.py` (fills thin light lines inside black shapes;
  check for specks in dark skies).
- **16:** the "photo" in the window shows a paper lantern (and a coral disc in a white square can read as a flag); it must be a
  round balloon with its ropes and ring, in a sky.
- Optional **07:** the mountain came out as a single Fuji-like cone; the prompt asked for a twin-peaked mountain (Mt. Tsukuba).
- All: 1376×768 is small for a 1080p push; export at 2K or upscale in Flow if it offers it.
