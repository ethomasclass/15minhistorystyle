# Gemini prompts: Halloween (layered silhouette style)

Style chosen from the user's reference (layered silhouette, ochre haze, big moon, orange firelight). Tested on the
turnip-lantern scene: `public/img/gen/tests/lay_pro2.png` is the keeper.

- Model: `gemini-3-pro-image` (it layers depth better than 2.5 Flash for this style; about 13 cents an image). 16:9.
- Paste the scene, then the style paragraph below word for word.
- Lesson from the test: name anything orange that must NOT be orange (turnips came back as pumpkins until the prompt
  said "pale, off-white, NOT a pumpkin, NOT orange", with light only through the carved holes).
- Regenerate on any text, modern objects or recognizable faces.
- Silhouettes stay in their own colours on screen (no grayscale, no coral), like `Sil` in *Dressed to Kill*.

## Style paragraph (identical in every prompt)

> Style:a layered silhouette illustration, like a side-scrolling shadow-puppet scene. Everything in the foreground (the hill, the grass, the children, the cottage, the trees, the walls) is a solid flat black shape with crisp edges and fine detail in the outlines: individual grass blades, twigs, frayed shawl edges, thatch. Behind it, two or three layers of distant hills and trees in progressively lighter, hazier flat tones of warm ochre, amber and dusty tan, as if seen through golden mist. A large pale full moon with a soft glow sits high in a smoky ochre-brown sky. The only saturated colour is the orange-yellow candlelight shining out of the turnip lanterns' carved eyes and mouths and the bonfire flames, with a few drifting sparks. Wide cinematic composition, figures small against the landscape, lots of atmosphere. Period details must be accurate for the stated year and place: no modern buildings, clothing or objects. No text of any kind: no letters, words, captions, signs, labels, signatures or watermarks. No frame or border. No recognizable real historical person; every figure is an anonymous silhouette.

## Scenes

### ch02_turnip_lanterns.png  (tested, keeper)
Narration: carved turnip lanterns, bonfires, Ireland and Scotland.

> Rural Ireland, Halloween night, about 1840. Seen from the side, in profile: three barefoot country children in rough wool clothes and shawls walk along the crest of a grassy hill, each holding up a small turnip lantern by a string: a lumpy, pale, off-white root vegetable the size of a fist, NOT a pumpkin and NOT orange, with a crude face cut into it so the candlelight shines out only through the eye and mouth holes. To the left, a thatched stone cottage with smoke curling from the chimney. To the right on the next rise, a bonfire with a few adult figures around it. Bare twisted trees, low dry-stone walls, tall grass along the hilltop.

(Other scenes to follow once the archival search shows the gaps.)

## Scene paintings, draft 2 (generated Oct 27, `gemini-3-pro-image`, 2K, 16:9)

Files: `public/img/gen/scenes/<name>.jpg`, each prompt in `<name>.txt` (the scene, then the style paragraph, now generalized to
"the warm light named in the scene" and identical in all ten). Rejected takes in `rejects/` (pumpkin-orange lantern; AI-lettered signs).
On screen: full-frame `Engraving`-style or `Parallax` layers, kept in their own colours (no grayscale, no coral), no source tag.

| File | Covers |
|---|---|
| `ch02_hearth` | "families kept the fire going and left food out… seats saved for the family's dead" |
| `ch02_guisers` | "people went out in disguise… gates lifted off their hinges, cabbages thrown at doors" |
| `ch03_coffin_ship` | "ships so crowded and sick that people called them coffin ships" |
| `ch03_landing` | "They landed in cities like Boston and New York, poor, and often not welcome" |
| `ch03_wagon_roof` | Newton, Kansas: "a wagon on the roof of the lumberyard" (no signs; the place is in the narration) |
| `ch04_mob_school` | Bismarck 1933: junk cars and garbage at the high school; police and tear gas |
| `ch05_party` | towns throw Halloween parties (school gym, apple bobbing, pumpkins) |
| `ch06_suburbs` | the baby-boom suburbs, kids door to door |
| `ch07_dark_house` | the quiet chapter: one dark house, a bag left on the steps (no figures) |
| `ch08_door` | "a kid knocks on your door this Saturday" (the closing beat) |

Also usable: `public/img/gen/tests/lay_pro2.jpg`-style turnip kids (ch02), `public/img/gen/thumb/th1_a`, `th2_a` (door / prank night).
