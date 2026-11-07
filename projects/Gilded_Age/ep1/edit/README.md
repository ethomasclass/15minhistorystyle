# Episode 1 edit: chapters cut to the narration

Each chapter is a list of shots drawn with the look-dev kit (`../../lookdev/`), cut on the voiced narration's word timings
(`../public/audio/<chapter>.words.json`). Re-voice a chapter and the cuts follow the words; the shots don't change.

| File | What it does |
|---|---|
| `edit.html` | The page: loads the look-dev scripts, `edit.js`, the chapter files and `title.js`; two layers for crossfades |
| `edit.js` | `wordAt(ch, word, n)` (time of the nth occurrence of a word), the shot timeline with 0.3 s crossfades, and shared pieces: date stamp, composite-family bar, the desk, `deskCut` / `deskProp` (cut-outs with contact + lifted shadow), `vocabCard`, `stationClock`, `cableXray` (with the +150 ring), `drawLine`, `remap` (re-time a look-dev clip to the words) |
| `ch01.js` ... `ch09.js` | The nine chapters (shot lists in each file's comments) |
| `title.js` | The title card after the cold open (4 s, the channel sting) |
| `render_edit.mjs` | `node render_edit.mjs ch01 <dir> [from] [to]` renders frames; `--stills 3,9.5 <prefix>` renders check stills |
| `build_ch.sh` | `./build_ch.sh ch01 ga_gilded_theme 0.105`, or several cues `cue@volume@start@offset[@end]`: renders in 4 parallel chunks, mixes narration + music, writes `review/chNN_720p.mp4`, deletes the frames (about 3 GB a chapter) |
| `assemble.sh` | Chapter 1, the title card, chapters 2 to 9, mastered to -14 LUFS: `review/ep1_full_720p.mp4` |
| `../tools/bust_cut.py` | Portrait to aged bust cut-out (rembg; no border, mount or oval; warm tone, lifted blacks, grain, dust, faint scratches; `--close` fills notches) |
| `../tools/crease.py` | Archival print to an aged, creased, frameless print (black and white) |

Music per chapter (bed 17 LU under the voice, `../script/MUSIC.md`): ch01 `ga_gilded_theme` 0.105 · ch02 `ga_noon_twice` 0.107 ·
ch03 `ga_age_of_steel` 0.099 · ch04 `ga_sugar_house` 0.084 · ch05 `ga_weavers_son` 0.102 · ch06 `ga_the_squeeze` 0.083 ·
ch07 the squeeze's tail, then `ga_kellys` 0.097 from "That night" · ch08 `ga_heroes_or_villains` 0.111 ·
ch09 `ga_bad_wire` 0.115 to "So how did America", then `ga_gilded_theme` 0.105 from 62.7 s in (its solo-piano close on the end).

Rules kept here:
- **No white borders on any image.** Portraits are bust cut-outs on the desk with a shadow; prints are frameless and creased; never a mount, card edge, oval or page margin. Everything is black and white (the land-grant map's grants come back as a teal overlay).
- **Word anchors count every occurrence**: "and", "the", "at", "then", "to", "so" and "he" repeat in every chapter. List the occurrences before choosing n.
- Teal explains, orange handwriting, coral only for the Kellys. Real people appear only as their photographs.
- Disk: frames are deleted after each chapter encodes; check `df -h /` before rendering several chapters.
