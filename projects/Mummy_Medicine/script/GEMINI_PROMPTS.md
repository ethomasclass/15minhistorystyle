# When Europe Ate Mummies: AI painting prompts (v2, matched to the script)

These are only for moments with no surviving image. The 87 archival images in `public/img/` (see `IMAGES.md`) come first.
Hand-drawn set pieces now cover several former gaps: the locomotive, the garden burial, the last jar and the 1850 invitation (see
"Hand-drawn set pieces" in `SCRIPT.md`). That leaves **8 prompts: 4 must-have, 4 optional**. Chapter numbers follow the script.

**How to run them**
- Use Gemini image generation at its largest size, aspect **16:9**.
- Paste the **whole** prompt, including the style paragraph at the end.
- Regenerate rather than fixing text, extra fingers, modern objects or wrong details.
- Every scene still works if you skip an image. **Must-have** means the scene is noticeably worse without it.
- Upload the PNGs to `public/img/ai/` using the file names below.

**Rules for this episode**
- No exposed human remains, ever. Mummies appear only as linen-wrapped bundles or painted coffins.
- No recognizable real people. Gerard of Cremona and de la Fontaine appear from behind, in shadow or at a distance.
- Chapter 6, the heavy chapter, uses no AI images.

**Shared style paragraph** (keep it word for word on every prompt):

> Style: a European oil painting from the 1630s–1660s in the manner of the period's Dutch and Flemish genre painters, such as David Teniers the Younger and Adriaen van Ostade. Muted earth palette (umber, ochre, slate blue, dull red), warm directional light from a single window or lamp, deep shadows, visible brushwork, faint craquelure, slightly aged varnish. Every detail must be historically accurate for the stated year and place: clothing, hairstyles, buildings, furniture, lamps, glassware and tools. No text of any kind: no letters, words, signs, labels, captions, signatures, dates or watermarks. No frame or border. No recognizable real historical person. Faces, where visible, belong to ordinary anonymous people. No exposed human remains.

---

## Must-have

### 1. `ch02_bitumen_seep.png`
*Line:* "A black, sticky pitch that oozed out of the mountains of Persia." No image of natural mūmiyā exists.

The Zagros mountains of Persia, around the year 1000. A dry, rocky slope at late afternoon. Thick black bitumen seeps from a crack in pale limestone and pools glossy in the sun. A local man in a plain wool robe and turban kneels with his back half-turned, scraping the tar into a small clay jar with a wooden paddle. A donkey with two baskets waits below. Hazy ridges stretch into the distance.

[style paragraph]

### 2. `ch02_translator.png`
*Line:* "In the 1100s, a scholar named Gerard of Cremona translated Arabic medical books into Latin…" No portrait of Gerard exists.

Toledo, Spain, around 1170. A stone scholar's room lit by one candle and a narrow arched window at dusk. A cleric in a dark wool robe sits at a slanted wooden writing desk, **seen from behind over his shoulder**, face not visible. He copies from an open Arabic manuscript onto a sheet of parchment. A quill, an ink horn and stacks of bound codices are on the desk. Through the window there are Moorish rooftops and a bell tower.

[style paragraph]

### 3. `ch03_tomb_night.png`
*Line:* "Men climbed down into old burial shafts near Cairo…"

Saqqara, Egypt, around 1550, at night. Three local men in simple cotton robes and head cloths carry lanterns out of a dark rock-cut shaft in the sand. Between them they carry a long linen-wrapped bundle on a rope sling. The bundle is fully wrapped and nothing inside is visible. A camel kneels nearby. A step pyramid is a faint silhouette against a starry sky. Warm lantern light falls on the sand, and there is cold blue moonlight everywhere else.

[style paragraph]

### 4. `ch04_dealer_storeroom.png`
*Line:* "The dealer showed him thirty or forty bodies, stacked in a storeroom."

A dim storeroom in Alexandria, around 1564. Rows of linen-wrapped bundles lie on wooden racks. The bundles are fully wrapped and nothing inside is visible. Clay pots of black pitch sit beside them, and smoke drifts. A dealer in a striped robe holds an oil lamp up toward the racks. He is **seen from behind**, and a European visitor in a dark cloak is a silhouette in the doorway. The mood is uneasy and quiet, not gruesome.

[style paragraph]

## Optional

### 5. `ch03_ship_loading.png`
*Line:* "The pieces went through Alexandria, onto ships…" The hand-drawn trade map carries this if you skip it.

The harbour of Alexandria, around 1580, at dusk. Porters carry plain wooden crates and bales up a gangplank onto a Venetian merchant galleon with furled sails. The quay is crowded with sacks and barrels. Merchants in European doublets and Ottoman robes bargain at a distance. The Qaitbay fortress is on the far point. There is gold light on the water.

[style paragraph]

### 6. `ch03_apothecary_grinding.png`
*Line:* "Back home, apothecaries… ground it into powder." Rembrandt's apothecary etching is the fallback.

An apothecary shop in London, around 1650. Tall wooden shelves hold rows of blue-and-white tin-glazed drug jars with **blank, unlabeled** fronts. At a heavy counter, an apothecary in a dark doublet and white collar grinds dark, resinous brown fragments in a large bronze mortar. A brass hanging scale, a stuffed crocodile hanging from the ceiling, and dried herbs are around him. Light comes from a leaded window on the left.

[style paragraph]

### 7. `ch04_oven_fakes.png`
*Line:* "Recent bodies, stuffed with pitch and dried in an oven. Genuine Egyptian mummy. Made in France."

A back workshop in Lyon, France, around 1690, at night. A large brick bread-style oven glows orange. In front of it, long linen-wrapped bundles lie on a wooden trestle; they are fully wrapped and nothing inside is visible. There are buckets of black pitch and a ladle. A workman in a leather apron and linen shirt feeds the fire with his back turned. Smoke curls along the ceiling beams. The mood is furtive and slightly absurd.

[style paragraph]

### 8. `ch07_unwrapping_party.png`
*Line:* "In 1850, a London lord sent out invitations… 144 Piccadilly." The Denon lithograph and the drawn invitation are the fallback.

A grand London drawing room in 1850, afternoon. Tall windows with heavy curtains, gilt mirrors and a crystal chandelier. A crowd of well-dressed Victorian ladies in wide silk dresses and bonnets and gentlemen in frock coats stand in a semicircle **seen from behind**, craning to look at a long table. On the table is a painted Egyptian coffin lid and a fully linen-wrapped bundle; a surgeon in a dark coat lifts the first loose strip of linen. Teacups and a silver tray are on a side table. The mood is genteel curiosity, slightly ridiculous.

[style paragraph]

---

**Dropped from v1:** the scaffold, the locomotive, the garden burial, the last-jar still life, the chocolate still life and the distillery. They're either drawn by hand now, or the heavy chapter stays image-light.

---

# Motion prompts (image to video)

These are optional: only for paintings you've already generated and liked. Run each one in an image-to-video model (Veo in Gemini, or
Kling or Runway) with the painting as the **starting frame**. Upload the clips to `public/video/ai/` with the same name and `.mp4`.

**Settings for every clip:** 16:9, 1080p, **5–6 seconds**, one continuous shot, no cuts.

**Why the motion stays small:** the channel's look gives each painting *one living detail* (fire, smoke, water, light) while the people stay
still. The coral tint and teal outline come from a still mask, so if the subject moves, the color slides off. I'll also slow the clip a
little and turn it black and white, so subtle motion reads well.

**Paste this rule line at the end of every motion prompt:**

> Keep the oil-painting look: visible brushstrokes, craquelure and muted colors, not photorealistic. People stay almost completely still;
> no one turns toward the camera and no faces change. Wrapped bundles stay fully wrapped. No new objects, no text, no morphing, no
> camera cut. Slow, subtle, calm motion only.

---

### 1. `ch02_bitumen_seep.mp4`
The black tar slowly oozes down the rock face and glistens. A small bubble swells in the tar pool and gently pops. Faint heat shimmer
rises over the distant ridges. The donkey flicks its ear once. Camera: a very slow push-in toward the tar.

### 2. `ch02_translator.mp4`
The candle flame flickers softly, and its light dances across the parchment and the stone wall. Dust motes drift in the window light. The
quill tip moves a few small strokes. Camera: almost still, with a barely noticeable drift to the right.

### 3. `ch03_tomb_night.mp4`
The lantern flames flicker and the lanterns sway gently. Wisps of sand blow low across the ground. A few stars twinkle. The men and the
wrapped bundle stay still. Camera: a slow push-in toward the shaft opening.

### 4. `ch04_dealer_storeroom.mp4`
Thin smoke drifts slowly across the racks of wrapped bundles. The oil lamp flame flickers, and shadows shift softly across the room. Dust
floats in the lamplight. The dealer and the visitor stay still. Camera: a slow sideways slide along the racks, left to right.

### 5. `ch03_ship_loading.mp4` (optional painting)
Small waves ripple across the harbor, with gold glints on the water. The ship's pennants and loose rigging flutter in the breeze. Distant
gulls wheel in the sky. The porters stay still. Camera: a slow pan from the quay to the ship.

### 6. `ch03_apothecary_grinding.mp4` (optional painting)
The pestle turns slowly in the mortar, and a little fine brown powder rises into the window light. The hanging crocodile sways very
slightly. The apothecary's body stays still apart from the grinding hand. Camera: still.

### 7. `ch04_oven_fakes.mp4` (optional painting)
The oven fire flickers and glows, with a few embers drifting up. Smoke curls slowly along the ceiling beams. The workman stays still.
Camera: a slow push-in toward the oven.

### 8. `ch07_unwrapping_party.mp4` (optional painting)
The surgeon lifts the loose strip of linen slowly upward, only a few inches, and the bundle stays fully wrapped. The chandelier crystals
glint. The curtains stir slightly. Steam rises from a teacup on the side table. The guests stay still. Camera: a slow push-in toward the table.

**If a clip goes wrong** (faces melting, people walking, the bundle opening), don't fix it. Regenerate, or skip it, and I'll use the still
painting with a slow push and a drawn living detail instead.
