# Episode 5 edit: "Fighting Back" (the Gilded Age finale), cut to the narration

Built exactly as Episode 4 (`../../ep4/edit/README.md`, approved): each chapter is a list of shots drawn with the look-dev kit
(`../../lookdev/`, now with `ep5.js`, `ep5_b.js`, `ep5_doors.js`, `ep5_explain.js`), cut on the voiced narration's word timings
(`../public/audio/<chapter>.words.json`, each word with `s`, `e` and `who`: NARR, MICHAEL, TOMMY, OWEN, MA). Re-voice a chapter and
the cuts follow the words. Sources: `../script/SCRIPT.md` (draft 9, as voiced), `../script/VISUALS.md`, `../research/IMAGES.md`,
`../public/img/credits.json`. Ten chapters, built in two halves (`FULL_BUILD.md`).

| File | What it does |
|---|---|
| `edit.html` | Loads the look-dev scripts (Ep 1 to 5: `ep5.js`, `ep5_doors.js`, `ep5_explain.js`, `ep5_b.js`), `edit.js`, `carry.js`, `cards.js`, `late.js`, `ch01.js` to `ch10.js` (a missing one is skipped), `title.js`, `brand.js`. Its title-safe pass nudges `.tx` text into the **8% safe area** (x 154 to 1766, y 86 to 994) |
| `edit.js` | As Ep 4; `LIVE` (30 fps shots) also covers `renderE5...` (drawn sets), `renderDoors...` / `renderDoorClose` and anything wrapped in `e5Live(...)`; the `renderX5...` explainers, desk, prints and text move on 12 drawings a second |
| `carry.js` | Only initialises `window.HOLD` / `window.CARRY`: each chapter file sets its own entry |
| `cards.js` | `batonCard` (the next chapter's title on a torn orange strip, slammed in on its spoken words, held `CARD_HOLD` = 2.6 s; chunk_snap at the same time), `printCard` (an archival print with its source and date), `vocab` |
| `late.js` | `lQuiet`, `lPrint`, `lSrc` (source tag, default now inside the 8% area: x 172, y 934), `lNote`/`lTag`, `lVis`, `lRing`, `lSpeak`, `lWord` |
| `title.js` | The Chunk intro (the logo assembles centred, then lifts) + "THE GILDED AGE / Fighting Back / episode 5 of 5" |
| `brand.js` | The 2 s Chunk mark snap (`brk`) before chapters 3 to 10, and the 20 s end screen (slots sized to YouTube's elements: 614x345 video cards, 298 px subscribe circle) |
| `render_edit.mjs` | `node render_edit.mjs ch01 --stills 3,9.5 <prefix>`; frames otherwise. `SCALE=0.6667` renders 1280 x 720, `FRAMEJPG=1` JPEG frames |
| `build_ch.sh` | Render + mix a chapter. Music and one-shots from `mix/<ch>.sh`; Ep 5 cue names resolve to existing series music through `mix/cues.tsv` (no new music for Ep 5). Narration is `<ch>.scene.wav` when present, plus `<ch>.fx.wav`. One-shots from `../public/sfx/`, then Ep 4's, Ep 3's, the channel's |
| `assemble.sh` | Chapter 1, the title card, chapter 2, a mark snap before each of chapters 3 to 10, the 20 s end screen; -14 LUFS master. `PREVIEW=coldopen` for chapter 1 + title |
| `audit_text.mjs` | `node audit_text.mjs ch01 0.25 0.08`: OUT (outside the 8% margin for over 0.5 s), SHORT (< 2.5 s), OVERLAP (carried text on a shot's text), the shot list. `LIST=1` lists every text with its seconds |
| `audit_contacts.mjs` | Animation contacts per chapter (worst error per kind, from `E3LOG`) |
| `sheet.sh` | Contact sheet of a review render, a frame every N s: `./sheet.sh review/ch01_720p.mp4 3 <out.jpg>` |
| `../tools/scene_mix.py` | Character lines placed in their rooms (outdoor dry; `room` = the Kelly kitchen, `sod` = Owen's sod house), beds and spots -> `<ch>.scene.wav`, `<ch>.fx.wav` |
| `../tools/sfx_ep5.py` | ElevenLabs beds and spots (cached in `../public/sfx/raw/`, git-ignored; the key is read at run time, never printed): beds `bed_river_night`, `bed_refinery_floor`, `bed_sod_winter`, `bed_prairie_wind`, `bed_convention_crowd`, `bed_street_crowd`; spots `steam_whistle`, `gate_clank`, `door_slam_dust`, `stamp_thud`, `corn_flare`, `crowd_roar`, `train_arrive`, `fireworks_distant`. Ep 4's `bed_winter_kitchen` and `bed_clubhouse` are reused |

## Build commands (720p review)

```
S=<scratchpad>; cp build_ch.sh $S/build_ch_run.sh
flock $S/render.lock env EDIT_DIR=$PWD SCALE=0.6667 FRAMEJPG=1 FRAMES=$S/<me>/ch01 $S/build_ch_run.sh ch01
```

Only one frame render at a time on this machine (the flock); frames are deleted as soon as the chapter is encoded (disk is tight).

## Music (mix/cues.tsv: existing series music only)

| Ch | Cue | Plays |
|---|---|---|
| 1 | `ga_barges` | ga_not_welcome (tense) |
| 2 | `ga_the_rules` | ga_sugar_house |
| 3 | `ga_strength` | ga_age_of_steel |
| 4 | `ga_two_unions` | ga_sweatshop |
| 5 | `ga_fort_frick`, `ga_hero_villain` | ga_the_squeeze; ga_heroes_or_villains under "Hero? Villain? Or both?" |
| 6 | `ga_owens_letters` | ga_letters |
| 7 | `ga_money_problem` | ga_kellys |
| 8 | `ga_the_crash`, `ga_coxey` | ga_bad_wire; ga_new_neighbors (lighter) |
| 9 | `ga_cross_of_gold` (or `ga_scorecard`) | ga_heroes_or_villains (or ga_looking_backward) |
| 10 | `ga_gilded_theme` | the series theme, carried into the end screen (`END_THEME_AT`) |

Levels as Ep 4: about 17 LU under the voice (cue volume = 10^((-35.2 - cue LUFS) / 20), noted in `cues.tsv`); chapter mix about -18 LUFS.
