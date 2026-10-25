# AI images, ch04

Model: Gemini 2.5 Flash Image (`gemini-2.5-flash-image`; 16:9 for scenes and plates, 1:1 for props). Scenes and plates use the
lithograph master prompt (`../LITHO_PROMPT.md`: the scene line, then the STYLE, COMPOSITION and RULES paragraphs verbatim); props use
the object-plate variant below. Post: `tools/weather.py --preset medium` (scenes, plates) or `--preset light --no-crease` (props, which
are then cut out with `tools/mask.py`, jobs in `tools/mask_jobs/ch04.py`). Per the series rule, AI images carry **no on-screen tag**;
each is recorded in `public/img/credits_ch04.json`.

Prop prompt = object line + the two paragraphs:

> STYLE: a tinted lithograph printed in the 1860s, like an object plate in a Pacific Railroad Survey report: soft crayon-grain shading drawn on stone in black, with one or two muted tint stones only (pale buff ochre, slate blue-grey, faded brick red), slightly out of register. Muted, faded, low saturation.
>
> RULES: the single object only, whole and in frame with a wide margin, isolated on plain flat pure white paper; no ground, no cast shadow, no table, no other objects. Historically accurate for the 1860s; nothing modern. No text, letters, numbers, labels, signatures or monograms anywhere. No frame or border.

## c4_snow_tunnel → public/img/ch04/ai_snow_tunnel.jpg

Used: "Crews dug tunnels through the snow" (push into the snow tunnel)

Post: border cropped, weather medium; shown partly desaturated (the red jackets toned down)

> Winter 1866-67, high in the Sierra Nevada of California: snow drifts taller than the plank work-camp buildings, only their roofs and stovepipes showing. Railroad workers in padded cotton jackets and wide conical hats have dug a narrow tunnel through the deep snow, its arched entrance in the foreground, lit faintly by a lantern inside; one worker with a shovel is seen from behind entering it, two more much smaller further up the drift carry tools. Grey falling snow, granite ridge half hidden above.

## c4_stacked_tools → public/img/ch04/ai_stacked_tools.jpg

Used: "About 3,000 of them put down their tools" (quiet section, desaturated). The Placer Herald of July 6, 1867 says the strikers "stacked their shovels and picks and quit labor".

Post: invented signature cropped (bottom left), weather medium

> Summer 1867, the mouth of an unfinished railroad tunnel cut into bare granite high in the Sierra Nevada. In the foreground, long-handled shovels, picks and steel drills have been stacked neatly upright against a rock and a wooden handcart, left behind. No one is working. Far off down the rocky slope, small figures of Chinese workers in wide conical hats sit or stand quietly in little groups near canvas tents, seen from behind and very small. Still, quiet, empty work site, pale sky.

## plate_sierra_snow → public/img/ch04/ai_plate_sierra_snow.jpg

Used: "Then came the winter of 1866" (wide) and the 40-storm tally (dimmed behind)

Post: invented inscription painted out (OpenCV inpaint), border cropped, weather medium

> Winter 1866-67, the high Sierra Nevada of California near Donner Pass: deep snow burying a steep granite mountainside, scattered pines half buried, a long ridge under heavy grey snow clouds, a small cluster of plank work-camp roofs barely showing above the drifts in the middle distance, no people visible. Wide panoramic landscape. STYLE: a tinted lithograph printed in the 1860s, like the plates in the Pacific Railroad Survey reports or a Harper's Weekly supplement. Soft crayon-grain shading drawn on stone in black, plus a limited palette of two or three muted tint stones only: pale buff ochre, slate blue-grey and a faded brick red, laid in flat areas and slightly out of register with the black. The paper shows through as the highlights. Muted, faded, low saturation; never bright; no modern colour grading. RULES: historically accurate for the year and place; nothing modern. No text, letters, numbers, signatures or monograms anywhere. No frame, border, margin, vignette or rounded corners: the picture runs edge to edge across the whole 16:9 image. No recognizable real person; faces turned away, small or in shadow.

## prop_drill_sledge → public/img/ch04/ai_prop_drill_sledge.jpg (mask c4_drill_sledge)

Used: "Hammers, drills" (desk)

Post: weather light, no crease; rembg mask (the drill mask had its holes filled)

> Object study: a long hand-forged steel rock drill (a straight octagonal steel bar with a chisel tip) lying crossed with a short-handled double-faced iron sledgehammer with a worn hickory handle, as used by 1860s railroad tunnel crews.

## prop_powder_keg → public/img/ch04/ai_prop_powder_keg.jpg (mask c4_powder_keg)

Used: "black powder" (desk)

Post: weather light, no crease; rembg mask (the drill mask had its holes filled)

> Object study: a small wooden black-powder keg of the 1860s, staved oak with iron hoops, the bung closed, slightly worn and dusty.

## prop_nitro_can → public/img/ch04/ai_prop_nitro_can.jpg (mask c4_nitro_can)

Used: "nitroglycerin" (over the Summit Tunnel photo)

Post: weather light, no crease; rembg mask (the drill mask had its holes filled)

> Object study: a dented tin can of the 1860s with a tight lid and a wire bail handle, of the kind used to carry liquid explosive at a mountain work site, plain unpainted metal.

## reused: L1_tunnel_face → public/img/ch04/ai_tunnel_face.jpg

From `review/ai_tests/litho/L1_tunnel_face__medium.jpg` (prompt in `review/ai_tests/litho_test.py`); border and invented signature cropped. Used for "about a foot" (coral driller, mask c4_driller, shown in greyscale so the tint stays see-through).

## generated, not used

`prop_lantern` (came out looking like a later kerosene lantern):

> Object study: an 1860s railroad worker's hand lantern, tin frame with a wire guard and a glass globe, a carrying ring on top, unlit.
