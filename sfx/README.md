# Sound effects

Every sound effect the channel has made, one copy each. The same file name has the same audio in every video repo. Keep effects quiet:
they should be felt more than heard. Volumes are the ones used in the branded videos; a dash means no level was ever set in one
(start quiet, around 0.3, and adjust).

The template ships the **core set** (marked ✓) in `public/sfx/`. Copy any others into a project's `public/sfx/` when a scene
needs them. To make a new one, add a prompt to `SFX` in the template's `tools/sfx_eleven.py` and run
`python3 tools/sfx_eleven.py <name>` (ElevenLabs sound generation, which costs credits). Then add the result here.

| File | Length | In template | What it's for | Volume | Timing |
|---|---|---|---|---|---|
| `stamp.wav` | 0.8 s | ✓ | Every Highlight title | 0.26–0.28 in chapters, 0.45 in the intro | on the word |
| `marker_tick.wav` | 0.5 s | ✓ | Every handwritten note (the `WRITE` constant) | 0.2 | 2 frames before the note's word |
| `whoosh.wav` | 1.0 s | ✓ | Every hard cut (old paper sliding across a desk) | 0.28–0.3 (up to 0.5 in a cold open) | on the cut frame |
| `tick.wav` | 0.4 s | ✓ | Pins, card flips, montage beats, the intro clock | 0.45–0.5 | on the pop |
| `tick_soft.wav` | 0.7 s | ✓ | The logo break's three clock ticks | 0.18 | wired into `LogoBreak.tsx` |
| `boom.wav` | 4.0 s | ✓ | Big hits: HISTORY in the intro, a climax word | 0.45–0.5 | on the word |
| `page_turn.wav` | 0.7 s | ✓ | Documents, letters, diagram flips | 0.45–0.5 | on the action |
| `knock.wav` | 0.7 s | ✓ | Two hollow knocks on wood (Fox sisters, Ouija) | 0.2–0.5 | on each "knock" |
| `gavel.wav` | 1.2 s | ✓ | Courts, votes, verdicts | not yet used in a branded video | |
| `crowd_cheer.wav` | 3.0 s | ✓ | A small 19th-century crowd applauding | not yet used in a branded video | |
| `smash.wav` | 2.0 s | ✓ | China and glass breaking (made for the Jackson videos' inauguration party) | not yet used in a branded video | |
| `quill.wav` | 1.5 s | ✓ | A dip pen scratching (the old note sound; `marker_tick` replaced it) | — | |
| `pencil_soft.wav` | 0.6 s | | A softer writing sound (one use in Ouija) | 0.3 | |
| `shot.wav` | 4.0 s | | A black-powder pistol shot with a long valley echo (made for the Jackson videos' 1806 duel) | — | on the word |
| `crickets.wav` | 2.9 s | | The comic "awkward silence" crickets (made for the Jackson videos) | — | after the joke |
| `rowdy_crowd.wav` | 5.0 s | | A big rowdy crowd indoors, boots on wooden floors (made for the Jackson videos) | — | bed |
| `sea_ambience.wav` | 12.0 s | | Sea-voyage bed (Fix Everything's map) | 0.12 | fades in and out over 10–30 frames |
| `scrape.wav` | 0.6 s | | Planchette felt on wood (Ouija). **Synthesized**: a real recording would be better. | 0.12–0.22 | on each move |
| `paper_slap_soft.wav` | 0.6 s | | A print dropped flat on the desk: the gentle "slap" landing (West series) | start ~0.25 | on the landing frame |
| `tape_press.wav` | 0.6 s | | Masking tape pressed down: tape strips, torn-print corners (West series) | start ~0.2 | on the press |
| `card_slide_soft.wav` | 0.6 s | | A card sliding briefly on felt: small cards, map cards (West series) | start ~0.2 | as it moves |
| `whip_soft.wav` | 0.5 s | | A soft airy swish for whip transitions, no impact (West series) | start ~0.25 | centred on the whip |
| `block_tap_soft.wav` | 0.5 s | | One soft hollow wooden tap: slabs rising on a 3D grid, counters (West series) | start ~0.15, stagger | on each slab |
| `spike_tap_distant.wav` | 1.2 s | | A far-off hammer on a railroad spike (West series). Made very quiet and normalized up, so check it for hiss. | start ~0.15 | on a cut |
| `train_distant.wav` | 6.0 s | | A distant 1860s locomotive chugging, faint: a bed under rail maps and the race (West series) | 0.08–0.12 | bed, fade in/out |

The prompts for the ElevenLabs-made sounds are in the template's
[`tools/sfx_eleven.py`](../.claude/skills/15-minute-history/assets/template/tools/sfx_eleven.py). That script trims leading silence so a hit
lands exactly on its frame, and normalizes the peak to −2 dBFS. Writing-sound candidates that lost the test (chalk tap, pen flick, short
quill) aren't kept here; they're in `Reform-Era/video/public/sfx/` if you ever want them.
| `balloon_inflate.wav` | 3.3 s | | A balloon filling (rubber balloon, close). Openverse/Freesound, "Balloon-Inflate-28.wav" by Gniffelbaf, CC0 | — | |
| `lamp_click.wav` | 0.3 s | | A desk-lamp switch (the "lamp on" intro option). Openverse/Freesound, "StandardLamp-Switch.flac" by Mindloop, CC0 | 0.5 | |
| `tape_pull.wav` | 1–2 s | | Masking tape pulled off the roll (the "tape pull" intro option). Openverse/Freesound, "masking_tape_2.wav" by jaguarrrr, CC0 | 0.4 | |
| `gas_hiss.wav` | 3.5 s | | Gas escaping / hydrogen filling (steam hiss). Openverse/Freesound, "Steam.wav" by SukritSen, CC0 | — | |
| `wind_high.wav` | 11.0 s | | Strong wind bed (high altitude, the jet stream). Openverse/Freesound, "Strong Wind Sound Scape" by rentless, CC0 | — | |
| `waves_beach.wav` | 20.0 s | | Surf on a beach (D-Day landing bed). Openverse/Freesound, "Waves of Hawaii" by florianreichelt, CC0 | — | |
| `plane_flyby.wav` | 10.0 s | | A propeller plane passing overhead. Openverse/Freesound, "Bi-plane flyby.wav" by itinerantmonk108, CC0 | — | |
| `plane_drone.wav` | 15.0 s | | Steady propeller drone (bomber bed). Openverse/Freesound, "Propeller Plane" by cliftonmcarlson, CC0 | — | |
| `air_raid_siren.wav` | 15.0 s | | Air raid sirens. Openverse/Freesound, "air raid sirens" by nsstudios, CC0 | — | |
| `tank_engine.wav` | 10.0 s | | Big diesel engine idling (tank, sound trucks). Openverse/Freesound, "truck large diesel or military tank APC armored personnel carrier accelerate big rev and pull away then other distant engine rev and another one close pass by Saravena, Colombia 2016.flac" by kyles, CC0 | — | |
| `radio_static.wav` | 6.7 s | | FM radio static (spoof radio, broadcasts). Openverse/Freesound, "FM Radio Static" by caculo, CC0 | — | |
| `morse_code.wav` | 6.0 s | | Morse code beeps. Openverse/Freesound, "Morse code" by SamsterBirdies, CC0 | — | |
| `paper_rustle.wav` | 4.0 s | | Papers rustling (paper balloons, documents). Openverse/Freesound, "Papers Rustling" by f4ngy, CC BY 4.0 (**credit required**) | — | |
| `typewriter.wav` | 6.0 s | | A typewriter (censorship, telegrams). Openverse/Freesound, "Long Sound Typewriter" by fellwell5, CC0 | — | |
| `explosion_distant.wav` | 6.0 s | | A distant explosion. Openverse/Freesound, "distant explosion" by Kostrava, CC0 | — | |
| `artillery_distant.wav` | 12.0 s | | Distant explosions and gunfire (battle bed). Openverse/Freesound, "Real explosions Real gunshots.wav" by The_Sound_Side, CC0 | — | |
| `rope_creak.wav` | 6.0 s | | Rope creaking (balloon cables, rigging). Openverse/Freesound, "hamp rope creaks" by 6polnic, CC0 | — | |
| `forest_birds.wav` | 20.0 s | | Forest birdsong bed (Bly picnic). Openverse/Freesound, "South Africa - St. Lucia Forest & Bird Ambience" by EpicWizard, CC0 | — | |
| `camera_shutter.wav` | 2.3 s | | Vintage flash powder and shutter (press photos). Openverse/Freesound, "Vintage Camera Flash Powder and Shutter" by Werra, CC0 | — | |

### Openverse sounds (free, openly licensed)
The rows above from `balloon_inflate` down were fetched with `tools/sfx_openverse.py` (in the template) from
[Openverse](https://openverse.org), mostly Freesound recordings. `credits.json` here keeps title, creator, licence and
source page for each. CC0 needs no credit; **CC BY needs the line from `credits.json` in the video description**.
Downloads are kept in `raw/` locally only (gitignored; re-fetch with the tool). Check the source page before using a
featured sound: Openverse does not verify licences. The Freesound files are the site's high-quality MP3 previews.
