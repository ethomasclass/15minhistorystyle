# AI images, chapter 3 (2 of the ch01-03 builder's 3 new images)

Model: gemini-2.5-flash-image, aspectRatio 16:9 (returned 1344x768). Prompt = scene/prop text + the LITHO_PROMPT.md STYLE paragraph + (PROP paragraph for props, COMPOSITION paragraph for scenes) + RULES paragraph. Script: the call in review/ai_tests/litho_test.py, with the PROP paragraph below. Originals kept in review/ai_images/. On screen: no tag (user's rule); recorded in public/img/credits_chNN.json.

PROP paragraph: "PROP: a single object drawn as a lithograph study, isolated and centred on a plain flat pure white background with nothing else, no table, no shadow, no scenery, the whole object in view with a margin around it."

## ch03_tea_barrel -> public/img/ch03/ai_tea_barrel_w.jpg (mask ch03_tea_barrel)
Prop. "An 1860s wooden water barrel with iron hoops, its lid off, a long-handled tin dipper resting on the rim, two dented tin cups
beside it and a soot-blackened iron tea kettle; a camp tea barrel of the kind carried up to railroad work crews in the mountains."
Post: weather light (no crease), resized to 1344x768, mask via `tools/mask.py ch03_tea_barrel`. The coral subject of the tea beat.

## ch03_sierra_stream -> public/img/ch03/ai_sierra_stream.jpg
Scene. "Summer 1866, a cold mountain stream tumbling over granite boulders among pines in the high Sierra Nevada of California, beside
a railroad construction grade. Two workmen, seen from behind and small in the middle distance, kneel to drink from the stream with
their hands and a tin cup; tools and a wheelbarrow left on the bank."
Post: Flash added a rounded vignette and a signature bottom right: cropped to (130, 62, 1250, 690), then weather medium. Note: the
two men face three-quarters toward us, small; not recognisable people.

Reused (not counted): `review/ai_tests/litho/L2_hell_on_wheels__medium.jpg` -> public/img/ch03/litho_hell_on_wheels.jpg; ribbon ridges
and engines.
