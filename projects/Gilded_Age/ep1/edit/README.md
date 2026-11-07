# Episode 1 edit: chapters cut to the narration

Each chapter is a list of shots drawn with the look-dev kit (`../../lookdev/`), cut on the voiced narration's word timings
(`../public/audio/<chapter>.words.json`). Re-voice a chapter and the cuts follow the words; the shots don't change.

| File | What it does |
|---|---|
| `edit.html` | The page: loads the look-dev scripts, `edit.js` and the chapter files; two layers for crossfades |
| `edit.js` | `wordAt(ch, word, n)` (time of the nth occurrence of a word), shot timeline + 0.3 s crossfades, shared pieces: date stamp, composite-family bar, the desk, `deskCut` (a cut-out with contact + lifted shadow), `cableXray` (cable cross-section) |
| `ch01.js` | Chapter 1, "The Bridge": 9 shots (dusk wide, cable x-ray, into the crowd, Michael close, name + composite label, fireworks, the question, the two boys on the desk, back to the bad wire) |
| `render_edit.mjs` | `node render_edit.mjs ch01 <dir> [from] [to]` renders frames; `--stills 3,9.5 <prefix>` renders check stills |
| `build_ch.sh` | `./build_ch.sh ch01 ga_gilded_theme 0.105` renders in 4 parallel chunks, mixes narration + music bed, writes `review/ch01_720p.mp4` |
| `../tools/bust_cut.py` | Portrait to aged bust cut-out (rembg; no border, mount or oval; warm tone, lifted blacks, grain, dust, faint scratches) |

Rules kept here:
- **No white borders on any image.** Portraits are bust cut-outs on the desk with a shadow; never a mount, card edge, oval or page margin.
- **Word anchors count every occurrence** ("and" appears six times in chapter 1): check `wordAt`'s n against the words file.
- Music bed 17 LU under the voice (`MUSIC.md`); teal explains, orange handwriting, coral only for the Kellys.
