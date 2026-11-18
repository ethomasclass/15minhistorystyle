# Episode 5: the full build, in two halves

Two builders work in parallel on the same checkout: **the shared setup + chapters 1 to 5**, and **chapters 6 to 10 + the assembly**.
Episode 4 (`../../ep4/edit/`) is the approved template for everything; `README.md` here lists the files.

## What the chapters 6 to 10 builder uses

- **Your files:** `ch06.js` to `ch10.js` (already listed in `edit.html`), `mix/ch06.sh` to `mix/ch10.sh` (your music table:
  `MUSIC=(cue@vol@start@offset[@end[@fade]] ...)` and `SFX="name@vol@at ..."`), your HOLD/CARRY entries inside your own chapter files
  (`window.HOLD.ch06 = {...}`), and the `ch06` to `ch10` entries of `../tools/scene_mix.py` (starting points are there for ch06, ch08,
  ch09: retime them to your shots and run `python3 scene_mix.py ch06 ch09`). Please don't edit `edit.html`, `edit.js`, `cards.js`,
  `late.js`, `carry.js`, `title.js`, `brand.js`, `build_ch.sh` or `audit_*.mjs` without telling the coordinator; if you need a shared
  helper changed, add your own in your chapter file. `assemble.sh` is yours (the order is already ch01, title, ch02, brk + ch03 ...
  brk + ch10, end screen; set `END_THEME_AT`).
- **Shared helpers:** `batonCard(T, cardAt, 'The Money Problem')` + `CARD_HOLD` (dur = cardAt + 2.6; `chunk_snap@0.3@<cardAt>` in `SFX`),
  `printCard(src, {x, y, w, ar, rot, o, T, caption})` + `lSrc(...)` (every archival image gets its source tag; IMAGES.md flags:
  CARICATURE brief and framed by narration, SENSITIVE handled, LATE gets a date label on screen), `lNote`, `lTag`, `lVis`, `lSpeak`,
  `lWord`, `wordAt`, `remap([[T, t], ...])` to retime a look-dev clip to the voice, `vocab(x, y, term, def, o)` / `vocabCard(...)`.
- **Look-dev clips** (`../../lookdev/README.md`, "Episode 5" sections, beat tables): call the renderers directly, e.g.
  `renderE5Farm(t)`, `renderE5CornStove(t)`, `renderE5Coxey(t)`, `renderE5Bryan(t)`, `renderE5Porch(t)`, `renderE5Kitchen1896(t)`
  (synced to ch09 from 65.5 s: clip t = chapter t - 65.5), `renderE5Bridge(t)`, `renderDoorClose(t, 1)` / `(t, 2)` (slam at 1.78, FELL
  SHORT at 2.3: put the slam on "closed"), `renderDoorsFinale(t)`, `drDoorsBug(n, t, {bg})`; the explainers take their cue table as a
  second argument (`renderX5Loan(t, {...X5_LO, ...yourCues})`), so their beats land on the words. Clip tags that sit at x 130 (the Ep 5
  drawn sets in `ep5.js`) are outside the 8% area: pass `{quiet: true}` where the renderer takes it and draw your own `lTag` at x 172.
  `lQuiet(() => ...)` drops a clip's whole screen layer.
- **Sound:** `../tools/sfx_ep5.py` beds and spots are in `../public/sfx/` (see README). Spots only for things on screen (no whooshes,
  no page turns). `door_slam_dust` on the slam and `stamp_thud` 0.52 s later for the FELL SHORT stamp (as ch05 does).
- **Music:** cue names in `mix/cues.tsv` (existing series music only; the user does not want new music). Levels about 17 LU under
  the voice; chapter mix about -18 LUFS (check with `ffmpeg -i review/chNN_720p.mp4 -af ebur128 -f null -`).
- **Machine rules:** one frame render at a time (`flock <scratchpad>/render.lock`), 720p review renders with `SCALE=0.6667 FRAMEJPG=1
  FRAMES=<your scratch>/chNN`, run from a temporary copy of `build_ch.sh` with `EDIT_DIR` set, never commit a partial mp4 (ffprobe
  first; build_ch.sh writes `.part` and renames when done), stage only your own paths, `git pull --rebase` if a push is rejected.
- **QA per chapter:** `node audit_text.mjs chNN 0.25 0.08` (no OUT, SHORT or OVERLAP), `node audit_contacts.mjs chNN`, a contact
  sheet every 3 s (`./sheet.sh review/chNN_720p.mp4 3 <out>`) read by eye, loudness about -18 LUFS.
- **Rules (the user's):** Kellys coral only, everyone else ink, teal explains, orange torn strips, money only small gold glints; real
  people never get faces in drawn sets; text on screen >= 2.5 s, inside the 8% safe area and never cut off; nothing important crowds
  the frame edges; contacts precise; no long static holds; sound effects only for things on screen; no violence or fire on people; no
  figure kneels or crouches near another's lap; no em dashes; never name the series compelling question.
- **Baton titles:** 2 The Rules, 3 Strength in Numbers, 4 Two Kinds of Unions, 5 Fort Frick, 6 Uncle Owen's Letters, 7 The Money
  Problem, 8 A Party of Their Own, 9 The Cross of Gold, 10 The Scorecard. Chapter 5 ends on "Uncle Owen's Letters" (card on "Uncle");
  ch 6 must end on "The Money Problem", ch 7 on "A Party of Their Own", ch 8 on "The Cross of Gold", ch 9 on "The Scorecard"; ch 10
  ends into the end screen. Chapter openings do not repeat the card words (the script already handles this).
- **Doors:** door 1 closes at the end of ch 5 (done); door 2 at the end of ch 6 ("The second door had closed"), door 3 at the end of
  ch 9; ch 10 is `ep5_doors_finale`.
