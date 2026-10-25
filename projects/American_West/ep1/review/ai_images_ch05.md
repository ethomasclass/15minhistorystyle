# AI images, ch05

Model: Gemini 2.5 Flash Image (`gemini-2.5-flash-image`; 16:9 for scenes and plates, 1:1 for props). Scenes and plates use the
lithograph master prompt (`../LITHO_PROMPT.md`: the scene line, then the STYLE, COMPOSITION and RULES paragraphs verbatim); props use
the object-plate variant below. Post: `tools/weather.py --preset medium` (scenes, plates) or `--preset light --no-crease` (props, which
are then cut out with `tools/mask.py`, jobs in `tools/mask_jobs/ch05.py`). Per the series rule, AI images carry **no on-screen tag**;
each is recorded in `public/img/credits_ch05.json`.

Prop prompt = object line + the two paragraphs:

> STYLE: a tinted lithograph printed in the 1860s, like an object plate in a Pacific Railroad Survey report: soft crayon-grain shading drawn on stone in black, with one or two muted tint stones only (pale buff ochre, slate blue-grey, faded brick red), slightly out of register. Muted, faded, low saturation.
>
> RULES: the single object only, whole and in frame with a wide margin, isolated on plain flat pure white paper; no ground, no cast shadow, no table, no other objects. Historically accurate for the 1860s; nothing modern. No text, letters, numbers, labels, signatures or monograms anywhere. No frame or border.

## plate_promontory_flats → public/img/ch05/ai_plate_promontory_flats.jpg

Used: the telegraph shot (a drawn wire with clicks running to the horizon) and "What the railroad changed"

Post: rounded border and signature cropped, weather medium

> May 1869, Promontory Summit in Utah Territory: a wide, dry, treeless basin of sagebrush and pale alkali flats ringed by low bare brown hills under a huge pale sky; a single new railroad track with telegraph poles running straight across it into the distance; no train, no crowd, only two or three tiny distant figures. Wide panoramic landscape. STYLE: a tinted lithograph printed in the 1860s, like the plates in the Pacific Railroad Survey reports or a Harper's Weekly supplement. Soft crayon-grain shading drawn on stone in black, plus a limited palette of two or three muted tint stones only: pale buff ochre, slate blue-grey and a faded brick red, laid in flat areas and slightly out of register with the black. The paper shows through as the highlights. Muted, faded, low saturation; never bright; no modern colour grading. COMPOSITION: casual and asymmetric, as if drawn from life. RULES: historically accurate for the year and place; nothing modern. No text, letters, numbers, signatures or monograms anywhere. No frame, border, margin, vignette or rounded corners: the picture runs edge to edge across the whole 16:9 image. No recognizable real person; faces turned away, small or in shadow.

## prop_telegraph_key → public/img/ch05/ai_prop_telegraph_key.jpg (mask c5_telegraph_key)

Used: the telegraph shot and the DONE card

Post: weather light, no crease; rembg mask

> Object study: an 1860s telegraph key (a brass lever key on a small wooden base with two binding posts) with a short length of insulated wire coiled beside it.

## prop_rail_tie → public/img/ch05/ai_prop_rail_tie.jpg (mask c5_rail_tie)

Used: "set by hand"

Post: weather light, no crease; rembg mask

> Object study: one short iron railroad rail of the 1860s (inverted-T 'pear' section) lying across a single rough-hewn wooden railroad tie, seen from a three-quarter angle above.

## reused: prop_spike, prop_sledgehammer → public/img/ch05/ai_prop_iron_spike.jpg, ai_prop_sledgehammer.jpg

From `review/ai_tests/assets/` (prompts in `review/ai_tests/asset_tests.py`), weathered light, masks c5_iron_spike and c5_sledgehammer. Used for April 28, "set by hand", the iron spike going in and Stanford's (reportedly) missed swing.
