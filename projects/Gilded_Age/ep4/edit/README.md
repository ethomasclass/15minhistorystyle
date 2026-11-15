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

## Look-dev added for chapters 1 to 4

- `../../lookdev/ep4_map.js` (the Ep 3 model, extended): `EM_NIGHT` and `emNight(fn)` (a night look for one frame: dark fixed colours,
  a cool moon key; the lot two doors west of the Kellys', `B01s3`, burns: dark brick, windows on fire, an orange pool on the street,
  smoke lit from below, embers; snow in screen space), `renderEp4NightDive(n)` (ch 1, 0 to 6.8 s), `renderEp4NightRise(n, a, b)`
  (ch 1, the question to the end), `renderEp4Grow(n, o)` (ch 2: Brooklyn's ghost blocks fill in year by year, 1870 to 1890, and the
  Brooklyn Bridge rises in 1883, `emBridge`). Clips `ep4_ch1_dive`, `ep4_ch1_rise`, `ep4_ch2_grow`.
- `../../lookdev/ep4_explain.js` (diagrams, `e4x...`, drawn on 12 a second): `e4xUSCities` (cities over 100,000: `E4_C1870`, 14;
  `E4_C1900`, 24 more plus Scranton, Brooklyn merged in 1898), `e4xLedger` (only the one real line legible: "Forty chairs and three
  tables ... $179,729.60", typed with the voice; "THE BOOKS SHOWED" stamped; forty chairs and three tables counted in), `e4xUrban`,
  `e4xBars`, `e4xWhy`, `e4xFrame` (elevator and iron/steel frame cutaway), `e4xTrolley` (a drawn 1888 streetcar, dated on screen:
  no photograph of Richmond's cars is used), `e4xRings` (streetcar suburb), `e4xSeven`, `e4xRelief`, `e4xYard` (the toilet shed and
  sewer drawn over Ep 3's `renderTenementPlan`), and the drawn set `renderE4HorseStreet` (the cold open's block by day, cabs both
  ways, dung piling up: no photographs of the horses and manure exist).

## Chapters 1 to 4: beats to words

| Ch | Beat | Word (s) |
|---|---|---|
| 1 | night model dive; place/date tag | 0 to 6.8 |
| 1 | cut to ep4_fire on "A fire bell" (clip 1.4 s); fire_bell spot | 6.80 |
| 1 | the pumper gallops in (clip 16.4) / stops (20.6) | "engines" 18.16 / 22.2 |
| 1 | the captain and his men walk in (clip 22.6 to 27.6) | "comes somebody else" 24.4 to 28.8 |
| 1 | his mouth on his words (FT.talk1 / talk2 from the words.json CAPTAIN words) | 31.64 to 38.38, 55.56 to 61.12 |
| 1 | "a room / new clothes / a hot meal" notes | 45.16 / 45.82 / 46.94 |
| 1 | he turns to the stoop; hat tip; his line to Michael | "Not tonight" 50.3; 53.8; 55.56 |
| 1 | US map (big-city machines); Tammany Hall; the ledger, stamp | 64.66; 68.18; 72.2, 72.65 |
| 1 | amount typed; chairs; tables | 73.6 to 78.2; "forty" 79.14; "three" 80.36 |
| 1 | question; composite note; baton "Bursting at the Seams" | 81.9; 88.2; "bursting" 92.94 |
| 2 | Currier and Ives 1884; 1 in 4 / 4 in 10; "Urbanization" card | 0; 5.78 / 9.70; 11.08 |
| 2 | 14 cities / 38; Chicago bars, "annexed, 1889"; Brooklyn "doubled"; 4th city | 16.34 / 21.02; 22.16, 29.80; 31.98; 34.68 |
| 2 | why: farms / factories / immigrants | 37.64 / 41.00 / 44.70 |
| 2 | kitchen (ep4_kelly_flat 0 to 13 s); tags Ma / Michael / Nora / Tommy | 48.0 to 62.2; 49.70 / 51.40 / 54.82 / 58.50 |
| 2 | Brooklyn grows; arrows up and out; baton "Up and Out" | 62.2; 66.04; "Up," 67.96 |
| 3 | cutaway: car rises, Otis 1861; frame; walls hang | 3.98; 10.82; 14.12 |
| 3 | Home Insurance 1885; "Skyscraper" card; bridge 1883; El; streetcar; map; suburbs; Riis block; baton | 16.06; 21.48; 24.24; 29.74; 34.28; 40.94; 44.70; 59.10; "Too" 62.98 |
| 4 | Mulberry Bend + counts + "Tenement" card; plan, sink, toilet shed, sewer; 1 in 7 | 0; 10.1, 11.7, 13.56; 15.92 |
| 4 | horse street: 175,000 / 3 to 4 million lbs / every day / watch your step / nearly 15,000 | 25.30 / 29.02 / 32.56 / 34.08 / 37.66 |
| 4 | fires (World Building 1882, Riis fire escape); Riis cover + Baxter St; Lodgers + Bandit's Roost | 40.72; 47.66; 54.30 |
| 4 | relief bars 46,350 (1877) / 1878 drops to 0; Hard Coal for the Poor | 65.56 / 73.28; 67.36 |
| 4 | squirrel clipping; the captain walks in (ep4_fire 25.4 s); baton "The Machine" | 75.42; 84.0; "the" 86.16 |
