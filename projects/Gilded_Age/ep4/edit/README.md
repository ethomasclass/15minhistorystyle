# Episode 4 edit: "The Man in the Good Coat", cut to the narration

Built exactly as Episode 3 (`../../ep3/edit/README.md`, approved): each chapter is a list of shots drawn with the look-dev kit
(`../../lookdev/`, now with `ep4.js`, `ep4_b.js`, `ep4_map.js`, `ep4_explain.js`), cut on the voiced narration's word timings
(`../public/audio/<chapter>.words.json`, each word with `who`: NARR, CAPTAIN, MICHAEL, TOMMY). Re-voice a chapter and the cuts follow
the words. Sources: `../script/SCRIPT.md` (draft 2, as voiced), `../script/VISUALS.md`, `../research/IMAGES.md`,
`../public/img/credits.json`, `../script/SUNO_PROMPTS.md`.

| File | What it does |
|---|---|
| `edit.html` | Loads the look-dev scripts (Ep 1 to 4, plus `ep4_map_b.js` / `ep4_explain_b.js` for the chapters 5 to 8 builder if present), `edit.js`, `carry.js`, `cards.js`, `late.js`, `ch01.js` to `ch08.js`, `title.js`, `brand.js` |
| `edit.js` | As Ep 3; `LIVE` (30 fps shots) also covers every `renderE4...`, `renderEp4...`, `renderModel...` call and anything wrapped in `e4Live(...)`; other shots (desk, prints, text) move on 12 drawings a second |
| `carry.js` | Only initialises `window.HOLD` / `window.CARRY`: each chapter file sets its own entry, so the two builders never edit a shared file |
| `cards.js` | `batonCard` (the next chapter's title on a torn orange strip, slammed in on its spoken words, held `CARD_HOLD` = 2.6 s; chunk_snap at the same time), `printCard` (an archival print on the desk with its source and date), `vocab` |
| `late.js` | `lQuiet`, `lPrint`, `lSrc` (source tag), `lNote`/`lTag`, `lVis`, `lRing`, `lSpeak` (words.json speaker spans), `lWord` (a word's occurrence nearest a time) |
| `title.js` | Ep 2 and 3's exact Chunk intro (the logo assembles centred, then lifts to make way) + "THE GILDED AGE / The Man in the Good Coat / episode 4 of 6" |
| `brand.js` | The end screen (and the mark snap, unused: no break snap between chapters, as Ep 3 final) |
| `render_edit.mjs` | `node render_edit.mjs ch01 --stills 3,9.5 <prefix>`; frames otherwise. `SCALE=0.6667` renders 1280 x 720, `FRAMEJPG=1` JPEG frames |
| `build_ch.sh` | Render + mix a chapter. Music and one-shots come from `mix/<ch>.sh` (one table per chapter); Ep 4 cue names resolve to their stand-ins through `mix/cues.tsv` until the real cue is in `../public/music/`. Narration is `<ch>.scene.wav` when present, plus `<ch>.fx.wav` at full volume |
| `assemble.sh` | Chapter 1, the title card, chapters 2 to 8, the 20 s end screen; -14 LUFS master. `PREVIEW=coldopen` for chapter 1 + title |
| `audit_text.mjs` / `audit_contacts.mjs` | Text on screen (seconds, safe area, overlaps) and animation contacts (from `E3LOG`), per chapter |
| `../tools/scene_mix.py` | Character lines placed in their rooms (outdoor = dry, no reverb: the fire, the coal, the polls; rooms: clubhouse, kitchen, hallway), beds and spots -> `<ch>.scene.wav`, `<ch>.fx.wav` |
| `../tools/sfx_ep4.py` | ElevenLabs beds and spots (cached in `../public/sfx/raw/`, git-ignored): `bed_fire_night`, `bed_clubhouse`, `bed_street_horses`, `bed_winter_kitchen`, `bed_election_street`; `fire_bell`, `pumper_gallop`, `coal_chute`, `ledger_stamp` |

## Build commands (720p review)

```
S=<scratchpad>; cp build_ch.sh $S/build_ch_run.sh
flock $S/render.lock env EDIT_DIR=$PWD SCALE=0.6667 FRAMEJPG=1 FRAMES=$S/<me>/ch01 $S/build_ch_run.sh ch01
```

Only one frame render at a time on this machine (the flock); frames are deleted as soon as the chapter is encoded (about 5 GB free).
