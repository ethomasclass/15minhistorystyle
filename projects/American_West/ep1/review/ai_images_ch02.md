# AI images, chapter 2 (1 of the 20-image budget used by ch01-03 builder: 3 in total)

Model: gemini-2.5-flash-image, aspectRatio 16:9 (returned 1344x768). Prompt = scene/prop text + the LITHO_PROMPT.md STYLE paragraph + (PROP paragraph for props, COMPOSITION paragraph for scenes) + RULES paragraph. Script: the call in review/ai_tests/litho_test.py, with the PROP paragraph below. Originals kept in review/ai_images/. On screen: no tag (user's rule); recorded in public/img/credits_chNN.json.

PROP paragraph: "PROP: a single object drawn as a lithograph study, isolated and centred on a plain flat pure white background with nothing else, no table, no shadow, no scenery, the whole object in view with a margin around it."

## ch02_bonds -> public/img/ch02/ai_bonds_w.jpg (mask ch02_bonds, holes filled)
Prop. "A loose stack of 1860s United States government bond certificates, large engraved paper sheets with ornate borders and blank
cartouches, slightly fanned out and tied across the middle with a faded red cloth tape, seen from a three-quarter view above."
Post: `tools/weather.py --preset light --no-crease`, resized back to 1344x768 to match the mask; mask via `tools/mask.py ch02_bonds`
(isnet), interior holes filled (rembg had cut out the white cartouches). Used in ch02 "Plus loans, in government bonds" (slaps onto
the ribbon wide shot). No legible text on the sheets.

Reused (not counted): ridge and engine cut-outs from review/ai_tests/ribbon (the P2 ribbon).
