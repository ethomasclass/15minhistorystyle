# Silhouette scenes: one palette for the whole video (v2)

The user's direction (Nov 2026): the silhouette scenes should share **one, fairly uniform palette that matches the channel**.
Diamond Hoax used a palette per mood (purple, blood red, peach, white snow; see `projects/Diamond_Hoax/review/contact/scenes_v2.jpg`),
and next to the black desk, teal marks and coral subjects they read as eleven different films. This video locks one palette instead.

Demo (no credits spent): `review/palette/palette_lock_demo.jpg`. It takes seven existing Diamond Hoax / Halloween paintings in seven
different palettes and runs them through `tools/sil_palette.py`. They come out as one set.

## The palette

Built from the channel's own colours (`visual-style.md`): the desk's warm ink black, a **teal-slate haze** (a dark, quiet cousin of
the channel teal `#2FE0C4`, so the scenes sit beside the teal notes without fighting them), cream light, and **one coral**.

| Role | Hex | Notes |
|---|---|---|
| Foreground silhouettes | `#0d0c09` | The desk's ink, not pure black, so scenes join the desk |
| Near haze | `#111b1b` → `#1c3332` | The first distance layer |
| Middle haze | `#335652` → `#5f857f` | Hills, trees, the town |
| Far haze | `#a3bab2` | The last ridge, the far shore |
| Sky glow | `#dfe0d6` | Around the light source |
| Light (moon, dawn line, window, lamp) | `#F4EFE6` | The channel cream. Always cream, never yellow or orange |
| **Accent** | `#FF6F61` | **The coral is only ever the paper balloon, or its paper** (the panel in a girl's hands, the photo in the bookstore window, the cranes). It's the same rule as the coral tint on photos: coral = the subject. One coral thing per scene |
| Never | orange `#FF9F1C` | That's the tape colour, for titles only |

**The QUIET ramp** (ch 8, the heavy chapter, and anywhere near Bly): flatter grey-green fog (`#141615` → `#e6e4dc`), no glow and **no
coral**. The balloon is never shown in Bly.

**Time of day is the only variation allowed.** Japan scenes are at dawn or under lamps, and America scenes are at dusk or night,
but the hues stay the same. Only where the cream light sits and how bright it is changes.

## How it's enforced (belt and braces)

1. **Prompt in palette.** The style paragraph below names the palette, so Gemini paints close to it.
2. **Lock after generation:** `python3 tools/sil_palette.py raw.jpg locked.jpg` (`--quiet` for the Bly chapter, `--accent=none` for a
   scene with no balloon). It's a gradient map: each pixel's brightness picks its colour on the palette ramp, so whatever Gemini
   drifted to, the planes come back in our tones. Strong, warm, saturated pixels (the one light named in the prompt) become coral.
3. **Then split into depth planes** (`tools/sil_layers.py`, with the 6 px rim fix) and play them in `SilScene`. Locking before the
   split keeps every plane in palette and avoids colour seams.
4. Check each locked image at full size: anything coral that isn't the balloon or its paper gets repainted or masked out (in the
   demo, the coffin ship's warm sky band and the red sun turned coral; our prompts won't ask for either).

## Style paragraph (identical in every prompt, pasted after the scene)

> Style: a layered silhouette illustration, like a side-scrolling shadow-puppet scene. Everything in the foreground (the ground,
> rocks, grass, trees, buildings, people, objects) is a solid flat warm-black shape with crisp edges and fine detail in the outlines:
> pine needles, grass blades, twigs, frayed cloth, hair, cap brims, ropes. Behind it, two or three layers of distant hills, trees,
> shore or buildings in progressively lighter, hazier flat tones, as if seen through mist. PALETTE (strict): deep teal-slate and
> grey-green distance layers fading to a pale sage haze, a dark teal-black sky, and soft cream light. The only saturated colour in
> the whole image is the coral-red thing named in the scene; everything else stays in the muted teal-slate tones, cream and black.
> No yellow, no orange, no purple, no warm sky. Wide cinematic composition, figures small against the landscape, lots of
> atmosphere, figures in clear readable profile. Period details must be accurate for the stated year and place: no modern
> buildings, clothing or objects. No text of any kind: no letters, words, captions, signs, labels, signatures or watermarks, not even
> on newspapers, books or shop windows. No frame or border. No recognizable real historical person; every figure is an anonymous
> silhouette.

## The scenes (draft list for v2; nothing generated yet)

Model: `gemini-3-pro-image` at 2K, 16:9, about 13 cents an image (about $2.50 for this list with a few retakes). Prompts get written
out in full in `public/img/gen/scenes/<name>.txt` when we generate. The **coral** column is the one accent.

| # | Name | Script line | Scene | Coral | Parallax planes |
|---|---|---|---|---|---|
| 1 | `sil_woods_open` | "Five kids on a church picnic found something strange in the woods." (cold open, frame 0) | Tall ponderosa pines on a mountainside, morning mist; a large deflated paper balloon draped in the low branches, its ropes and a metal ring hanging. **No figures** (see "Respect" below) | the balloon | pines fg / balloon / mid pines / far ridge |
| 2 | `sil_raid_tokyo` | "a handful of American bombers… bombed Tokyo" | 1942 Tokyo rooftops (tile roofs, a pagoda far off), two twin-engine bombers low overhead, searchlight beams in cream | none (`--accent=none`) | roofs / planes / far city |
| 3 | `sil_weatherman` | "A Japanese weatherman had mapped it twenty years earlier." | 1920s, a man on an observatory roof releases a small pilot balloon and sights it through a theodolite on a tripod, dawn | a tiny pilot balloon | roof and man / town / far mountain (Mt. Tsukuba) |
| 4 | `sil_theater_girls` | "Girls like Rei were sent into some of the biggest theaters in Tokyo." | Inside a grand 1940s theater, stage and balconies in haze, rows of schoolgirls in middy blouses and work trousers kneeling on cushions at low tables, gluing big paper panels; work lamps in cream | the panel under the nearest lamp | girls fg / rows / balconies |
| 5 | `sil_rei` | "Rei just glued. Panel after panel." | One schoolgirl in profile at a low table, close, smoothing a paper panel with a brush, short hair, no hairpins; a lamp | her panel | girl / lamp / dim hall |
| 6 | `sil_beach_dawn` | "He and five other boys carried the paper balloons down to the sand…" | 1944 Chiba beach at dawn, six teenage boys in caps hold the ropes of a huge half-filled paper balloon; gas cylinders lined up; surf | the balloon | boys and cylinders / balloon / sea / dawn line |
| 7 | `sil_release` | "…watch it drift out over the ocean until it disappeared." | The same beach from behind the boys, a balloon small and rising over the sea, the sandbag ring hanging below | the balloon | boys / sea / sky |
| 8 | `sil_wyoming_flash` | "people heard an explosion… something like a parachute, drifting down out of the dark" | Wyoming ranch at dusk, a windmill and fence, two ranch hands look up at a burst of light high in the sky and a small parachute-like shape | the burst and the shape | fence and men / windmill / far bluffs |
| 9 | `sil_smokejumpers` | "jump out of planes into burning forests" | 1945 Pacific Northwest, paratroopers' parachutes over a forested ridge, smoke columns in cream-grey | none (fire as cream smoke, not coral) | ridge fg / chutes / smoke / sky |
| 10 | `sil_price_desk` | "That question landed on the desk of a man named Byron Price." | A 1940s Washington office at night, a man in shirtsleeves at a desk piled with newspapers, a window with the Capitol dome far off | none | desk and man / window frame / dome |
| 11 | `sil_presses` | "from coast to coast, they did" | A newspaper pressroom, huge presses, men at work, paper streaming (no lettering) | none | presses fg / workers / back wall |
| 12 | `sil_bly_road` | "While Archie parked the car…" | A 1940s sedan stopped on a dirt road under tall pines, doors closed, morning mist. **No figures** | none (**QUIET**) | pines / car / forest |
| 13 | `sil_aug15_japan` | "Tatsuo Ogawa helped burn the documents… heard the Emperor… in a vegetable patch" | A teenage boy standing in a small vegetable patch in front of a wooden house; smoke rising far off behind the town; a radio on the windowsill | none | boy and plants / house / smoke |
| 14 | `sil_aug15_dc` | "hung a sign on his office door: 'Out of Business.'" | An office corridor at dusk, a closed door with a blank card on it (we add the words in post), long window light | none | door frame / corridor / window |
| 15 | `sil_bookstore` | "she walked past a bookstore and saw a photograph in the window" | A Japanese street, 1970s–80s, a middle-aged woman with a shopping bag stops in front of a bookstore window; inside, one photograph of a paper balloon glows | the photo | woman / window / street |
| 16 | `sil_cranes` | "A thousand paper cranes, folded by women who'd glued balloons as schoolgirls." | The memorial in the pines, strings of paper cranes hanging from a low branch beside a stone, soft morning light | the cranes (the last coral in the video) | pines / cranes and stone / forest |

**Respect (Bly):** no silhouettes of the five children or Elsie, before or after. The cold open shows the balloon in the trees with no
one near it; ch 8 shows the car and the road and then the archival forest, the monument and the names written by hand (as planned).
This keeps the v1 rule (no victim imagery) and avoids inventing the moment.

**People with no photos:** Rei and Tatsuo are always anonymous silhouettes and always labelled in mono ("REI MINAMIMURA · no photo
used") on their first appearance, never presented as likenesses. Price gets real photos if the image search finds a clear licence.

## Next steps

1. Pick: approve the palette (or ask for a warmer / cooler haze; it's one line in `sil_palette.py`).
2. Add a Gemini key to `projects/Balloon_War/.env` (only `.env.example` is there) and say go. I'll generate scene 1 and scene 6
   first as a test pair (Japan dawn and Oregon woods), lock them, split them into planes and show you a short parallax clip before
   doing the rest.
