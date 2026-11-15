# Episode 4: the full build, in two halves

Two builders work in parallel on the same checkout: **chapters 1 to 4 + the shared setup** (this setup), and **chapters 5 to 8**.
Episode 3 (`../../ep3/edit/`) is the approved template for everything: read its README and FULL_BUILD first.

## What the chapters 5 to 8 builder should use

- **Your files:** `ch05.js` to `ch08.js` (already listed in `edit.html`), `mix/ch05.sh` to `mix/ch08.sh` (your music table:
  `MUSIC=(cue@vol@start@offset[@end[@fade]] ...)` and `SFX="name@vol@at ..."`), your HOLD/CARRY entries inside your own chapter
  files (`window.HOLD.ch05 = {...}`), new model shots in `../../lookdev/ep4_map_b.js` and diagrams in `../../lookdev/ep4_explain_b.js`
  (both already loaded by `edit.html`). Please don't edit `edit.html`, `edit.js`, `cards.js`, `late.js`, `carry.js`, `build_ch.sh`,
  `ep4_map.js` or `ep4_explain.js` without telling the coordinator; if you need a shared helper changed, add your own in your files.
- **Shared helpers:** `batonCard(T, cardAt, 'Boss Tweed')` + `CARD_HOLD` (dur = cardAt + 2.6; chunk_snap@0.3@cardAt in `SFX`),
  `printCard(src, {x, y, w, ar, rot, o, T, caption})` (every archival image gets its source tag; IMAGES.md flags: CARICATURE brief and
  framed by narration, SENSITIVE, LATE needs a date label), `lSrc`, `lNote`, `lTag`, `lSpeak`, `lWord`, `remap([[T, t], ...])` to
  retime a look-dev clip (each `ep4_b.js` renderer has its beat block at the top: `CB`, `CO`, `KF`, `PA`, `PO`, `VG`, `BB`).
  The model (`ep3_map.js` + `ep4_map.js`): `renderModelShot(n, {keys, S, labels, fixed, extra})` and the night look `EM_NIGHT` /
  `emWithEnv` in `ep4_map.js`; the network shot in ch 5 can build on it.
- **Sound:** `../tools/scene_mix.py` already places ch05 (captain in the `hall`, brothers in the kitchen `room`) and ch08 (kitchen) and
  writes `<ch>.scene.wav` / `<ch>.fx.wav`; retime its ch05/ch08 entries to your shots (beds `bed_clubhouse`, `bed_winter_kitchen`,
  `bed_election_street`; spots `coal_chute`, `ledger_stamp` in `../public/sfx/`), and rerun `python3 scene_mix.py ch05 ch08`.
- **Music:** Ep 4 cue names (`ga_the_machine`, `ga_boss_tweed`, `ga_honest_graft`, and `ga_gilded_theme` for the ending) resolve to
  the stand-ins in `mix/cues.tsv`. Levels as Ep 3 (about 17 LU under the voice; chapter mix -18.2 LUFS). `assemble.sh` takes
  `END_THEME_AT` (where in ga_gilded_theme the end screen picks up after chapter 8).
- **Machine rules:** one frame render at a time (`flock <scratchpad>/render.lock`), 720p review renders with `SCALE=0.6667
  FRAMEJPG=1 FRAMES=<your scratch>/chNN`, run from a temporary copy of `build_ch.sh` with `EDIT_DIR` set, never commit a partial mp4
  (build_ch.sh writes `.part` and renames when done), stage only your own paths.
- **Rules (the user's):** Kellys coral only, Rabinowitzes wheat gold, everyone else ink, teal explains, orange torn strips and
  handwriting, money only a small gold glint; real people never get faces; text on screen >= 2.5 s and never cut off; contacts
  precise; no long static holds; sound effects only for things on screen (no whooshes or page turns); no violence or fire on people;
  no figure kneels or crouches near another's lap; no em dashes; never name the series compelling question.
- **Baton titles:** 5 The Machine, 6 Boss Tweed, 7 Honest Graft, 8 Helper or Thief? (ch 4 ends on "The Machine"; ch 5 must end on
  "Boss Tweed", ch 6 on "Honest graft", ch 7 on "Helper or Thief?"). Chapter 1 ends on "Bursting at the Seams", then the title card.
