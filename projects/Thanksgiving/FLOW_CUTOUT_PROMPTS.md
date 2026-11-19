# Flow cut-out toolkit: Thanksgiving food video (draft 1)

The eight techniques the user picked (Nov 2026), each mapped to chapters, with copy-paste prompts. Everything is made as **pieces** on a plain
background, cut out (`prop_cut.py` on light, `prop_cut_black.py` on black), and moved on the desk at 12 fps steps.

**Rules for every prompt:** no text, letters or logos; no real people or faces; one object or set per image; even, soft light from the upper left;
the whole object inside the frame with margin; 16:9; highest resolution.
**Base background:** "on a flat seamless pale grey background" (for cut-outs), or "on pure black" (for white things and effect loops).
**Paper look (#8), added to every prop prompt:** *"made of cut paper craft: the printed image clipped from an old magazine, visible paper fibres, slightly torn white edges, a faint drop shadow."*
Colour: the 1621–1890s props in muted, faded engraving tones; the 1900s–1950s props in saturated magazine colour.

## Where each technique goes

| # | Technique | Chapters | What it does |
|---|---|---|---|
| 3 | Replacement frames (stepped stop-motion) | 1, 7, 8 | the cranberry log sliding out of the can; a pie losing slices; the turkey carved |
| 4 | State sheets (before → during → after) | 3, 7 | the mince pie whole → cut → exploded into ingredients; the casserole → three cans |
| 5 | Video-to-cut-out (Flow clip → background removed per frame) | 1, 6 | the eel wriggling on the desk (frame 0); the Jell-O ring trembling |
| 6 | First/last-frame "mock" morph, three times | 4, 6, 7 | calf's head → turtle tureen; aspic mould → Jell-O box; homemade pie → can |
| 7 | Plane-by-plane dioramas (layers made separately) | 1–2, 3, 5–6, 7 | the eel river; the turtle dock; the Victorian kitchen; the 1950s kitchen |
| 8 | Cut-paper collage texture | all props | every prop looks clipped from a magazine |
| 10 | Silhouette hands | 3, 4, 6, 7 | hands "cook" on the desk: dealing recipe cards, dropping ingredients, flipping the can |
| 11 | Unbranded period-ad backgrounds | 6, 7 | 1910s/1950s magazine-style plates behind real ad copy set by us |

## Chapter by chapter
1. **Cold open:** the eel wriggles on the desk (5) → the eel-river diorama (7) → a hard cut to the modern plate → the cranberry log slides out of the can in 6 frames (3).
2. **1621:** the river diorama widens to the gathering (7); a deer and "fowl" props (8).
3. **Showing off:** the turtle-dock diorama (7); a hand places a menu card (10); the mince pie state sheet: whole → cut → beef, suet, raisins, wine fly apart (4).
4. **Mock turtle:** a hand sets down the calf's head; **morph #1**: calf's head → turtle-soup tureen (6). MOCK tape.
5. **Hale:** her real portrait and documents (no AI); the Victorian kitchen diorama begins, with steam (7 + 9).
6. **Jell-O:** a hand lifts the copper aspic mould (10); **morph #2**: aspic mould → Jell-O box (6); the Jell-O ring trembles (5); a 1950s ad plate (11) with the real Star-Kist copy beside it, if cleared.
7. **Test kitchens:** a 1917 ad plate (11) with the booklet's paraphrase; hands deal recipe cards for the 1950s montage (10); the casserole state sheet: casserole → three cans (4); **morph #3**: homemade pie → can (6); the 1950s kitchen diorama (7).
8. **Turkey + ending:** the turkey carved in stepped frames (3); the eel next to the can.

---

## Prompts

### 3. Replacement frames
Generate one image as the master, then use it as a reference for each following frame ("same object, same lighting, same framing, next step").
**R1 · Cranberry log, 6 frames (ch1)**
```
A ridged cylinder of jellied cranberry sauce sliding out of an open tin can onto a white plate, frame 1 of 6: the can tipped, the sauce just starting to show. Side view, centred, on a flat seamless pale grey background. Saturated 1950s magazine colour. [paper look]. No text, no labels.
```
Frames 2–6: "…the sauce one-fifth / two-fifths / … / fully out, standing on the plate with the can's ridges printed on it, the empty can beside it."
**R2 · Pumpkin pie losing slices, 5 frames (ch5 or ch7):** a whole pie, then minus 1, 2, 3, 4 slices.
**R3 · Turkey carved, 5 frames (ch8):** a whole roast turkey on a platter, then the breast sliced away step by step.

### 4. State sheets
**S1 · Mince pie (ch3)**, three images with the same framing:
```
State A: a 19th-century double-crust mince pie on a pewter plate, whole. State B: the same pie with one wedge cut out, showing a dark filling of chopped beef, suet, raisins and apples. State C: the same plate empty, the ingredients laid out separately around it: a piece of boiled beef, a block of white suet, raisins, apples, a small bottle of wine. Overhead three-quarter view, on a flat seamless pale grey background, muted faded engraving colours, [paper look], no text.
```
**S2 · Casserole (ch7):** A: a green bean casserole topped with fried onions in a 1950s glass dish. B: the same dish, half of it spooned out. C: the dish empty, beside three plain unlabelled 1950s tin cans.

### 5. Video-to-cut-out (Flow image-to-video, then background removal frame by frame)
Start frame: the prop image on plain grey, or **black** for pale things. One action. Add every time: *"Locked-off camera, no camera movement. The background stays perfectly flat and even. Nothing enters or leaves the frame."*
**V1 · Eel (ch1):** start: a single dark river eel lying in a loose S-curve on pale grey, [paper look]. Motion: "the eel slowly wriggles in place, its body rippling in an S-curve, then settles."
**V2 · Jell-O ring (ch6):** start: a bright green gelatin ring mould with suspended sliced vegetables on a plate. Motion: "the gelatin trembles and wobbles gently, as if the table was bumped, then settles."
Process: export 1080p → frames → `rembg` per frame → keep every second frame (12 fps) → play as a cut-out on the desk with a soft contact shadow.

### 6. "Mock" morphs (first frame + last frame, one per "mock")
Both frames on the same background, same scale and same position, so it reads as one object changing. Add: *"A single continuous transformation, smooth and slightly magical, no camera movement, no extra objects."*
- **M1 · Mock turtle (ch4):** first: a boiled calf's head on a platter (muted engraving colours, not gory; side view). Last: an ornate Victorian silver soup tureen with a turtle-shaped lid.
- **M2 · Mock aspic (ch6):** first: a tall copper jelly mould with a clear amber calves'-foot jelly turned out beside it. Last: a small plain 1920s-style gelatin dessert box (no text) beside a bright red jiggly gelatin.
- **M3 · Mock homemade (ch7):** first: a homemade pie on a cloth, a rolling pin beside it. Last: a plain unlabelled tin can on the same cloth.
Trim each morph to its middle 2–3 s, then hard-cut to the MOCK tape.

### 7. Plane-by-plane dioramas
Make each plane as its **own image**, on pure black (for cutting out), every plane in the channel palette: ink `#0D0C09` for the front, teal-slate haze `#1C3332` → `#5F857F` for the distance, sage glow `#DFE0D6`, cream `#F4EFE6` light, coral `#FF6F61` on the subject only. Figures: one solid black shape, in profile, no faces, no interior lines. Make the sky plane first and reference it for the rest.
**D1 · Eel river at dawn (ch1–2):** (a) sky: a pale dawn band over a still tidal river, soft mist; (b) far: a low line of hazy trees; (c) mid: the riverbank with reeds and a small dugout canoe; (d) front: dark mud flats and reeds, an anonymous wading figure in profile pressing a foot into the mud, a woven basket (coral).
**D2 · Turtle dock, 1800s (ch3):** sky and harbour haze; masts of a sailing ship; a dock with crates and a horse-drawn wagon; front: a crate of live sea turtles (one coral turtle).
**D3 · Victorian kitchen at night (ch5–6):** back wall with copper pans and a window; a range with a big steaming pot; a cook in profile; front: a table with a copper jelly mould (coral).
**D4 · 1950s suburban kitchen (ch7):** a window with a lawn and a picket fence; cabinets; a hostess in profile at the counter; front: a casserole dish (coral) and a row of plain cans.
Add the steam and simmer loops (made on black, screen-blended) for D3 and D4.

### 8. Paper look
Already in every prop prompt. For hero props, also make one variant "with a hand-drawn teal pencil outline around the cut edge" to test against our teal trace.

### 10. Silhouette hands
One sheet per pose, on pure black, so they can be used at any size:
```
A single adult hand and forearm entering from the right edge of the frame, solid black silhouette with no detail, no rings, no sleeve detail, rolled shirt cuff only as an outline. Pose: [holding a small card between finger and thumb / pinching and dropping something / palm-down placing an object / pointing with the index finger / gripping a can]. On a pure flat pale grey background. No text.
```
Make 5 poses × 2 sides (left and right entry). Hands only, never faces.

### 11. Unbranded period-ad backgrounds
```
A colourful 1950s American magazine food-ad illustration background: a sunny kitchen counter with a checked cloth, a gleaming plate area left empty in the centre, cheerful bright colours, gouache illustration style, with a large blank cream panel on the right side for text. Absolutely no text, letters, logos or brands.
```
1910s variant: "a 1910s magazine illustration, soft lithograph colours, an ornate border" (for the marshmallow booklet beat).
Real ad copy and real ads only from scans; we set the paraphrase in our own type. Never present a generated plate as a real ad.

## Build order (to test first)
1. V1 eel (video-to-cut-out) → the cold open is the whole hook.
2. M1 mock turtle morph.
3. D1 eel river, in four planes.
4. R1 cranberry log frames.
5. A hand sheet (two poses).
