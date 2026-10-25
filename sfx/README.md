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
