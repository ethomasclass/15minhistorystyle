# Episode 3 edit: "He Sent Me", cut to the narration

Built the same way as Episodes 1 and 2 (`../../ep2/edit/README.md`): each chapter is a list of shots drawn with the look-dev kit
(`../../lookdev/`, now including `ep3.js`, `ep3_map.js`, `ep3_explain.js`), cut on the voiced narration's word timings
(`../public/audio/<chapter>.words.json`). Re-voice a chapter and the cuts follow the words. Plans approved shot by shot:
`CH01_PLAN.md`.

| File | What it does |
|---|---|
| `edit.html` | Loads the look-dev scripts (with `ep3.js`, `ep3_map.js`, `ep3_explain.js`), `edit.js`, `ch01.js`, `title.js`, `brand.js`; clears the Ep 3 contact log (`E3LOG`) each frame |
| `edit.js` | Copied from Ep 2; `LIVE` also covers `renderE3Runner`, `renderDuskGlide`, `renderDuskRise`, `renderSweepHome` (30 fps) |
| `ch01.js` | Chapter 1, the cold open; each shot is commented with its narration |
| `title.js` | Chunk intro + "THE GILDED AGE / He Sent Me / episode 3 of 6". Changed from Ep 2 for the baton rule: the title lands on the cut (chapter 1's last word, "behind") and the logo assembles above it |
| `brand.js` | The 2 s mark snap and the 20 s end screen (as Ep 2) |
| `render_edit.mjs` | `node render_edit.mjs ch01 --stills 3,9.5 <prefix>` for check stills; frames otherwise |
| `build_ch.sh` | As Ep 2, plus: the narration is `<ch>.scene.wav` when it exists (character lines placed in their room, `../script/SOUND.md`), `<ch>.fx.wav` is mixed in at full volume, a cue can take a 6th field (its fade-out length; 0.25 = a cut-out), and `SFX="name@vol@at ..."` adds one-shots from `../public/sfx/`. `KEEP=1` keeps the frames |
| `assemble.sh` | As Ep 2 (title card after chapter 1, mark snaps, -14 LUFS two-pass); skips chapters not built yet. `PREVIEW=coldopen ./assemble.sh` writes `review/ep3_coldopen_preview.mp4` (chapter 1 + title) |
| `audit_text.mjs` | As Ep 2: every text element's seconds on screen and any time it leaves the title-safe area |
| `audit_contacts.mjs` | `node audit_contacts.mjs ch01`: the worst error of each kind of contact (hands on handles, hand-to-hand, planted feet, held things) over the chapter, from `E3LOG` |

## Chapter 1 build

```
SFX="boom@0.3@66.8" ./build_ch.sh ch01 ga_steerage@0.105@0@0@51.24@0.25 ga_steerage@0.07@67.7@104.3
PREVIEW=coldopen ./assemble.sh
```

- Music: `ga_steerage` (-15.5 LUFS, so 0.105 puts the bed 17 LU under the voice as in Ep 2) from the top; it cuts out (0.25 s) at
  the end of "I'll take the trunk" (51.24 s), with the harbour bed in `fx.wav`. It comes back low (0.07) on "Where does he want to
  take them" (67.7 s) from 1:44.3 into the cue, so the cue's own unresolved last note ends on "behind" and the title card.
- The sting on "It didn't work" ("work", 66.8 s): `boom.wav` from the channel's sound library (`../../../../sfx/`, all low end,
  under 150 Hz), at 0.3. Nothing new was generated.
- Scene sound (`fx.wav`, made by `../tools/scene_mix.py`): the harbour bed, and the trunk lifted at 51.39 s; the edit's lift is
  51.2 to 51.8 s.

## Chapter 1: how the drawn scene is retimed

`ep3_runner` (lookdev/ep3.js) is a 23 s draft; its first 11.5 s are this action. Its poses are pure functions of the clip's time,
so `ch01.js` maps narration time to clip time (`RN_MAP`, piecewise linear): holding a time freezes the figures, stretching it
slows them, and every contact is still solved each frame. `renderE3Runner(t, o)` takes options the clip never passes: `te` (the
water, smoke, flags and grain run on narration time, so a held beat stays alive), `cam` (the edit's camera, a monotone cubic
through its keys), `quiet` (no clip text), `look` (head tilt, expression, blinks; nothing a contact depends on), `manDet`/`manRim`/
`boots` (the close-up inserts), `ring`, `fz`, `fence`, `hardT` (the freeze).

| Beat | Narration (s) | Clip time |
|---|---|---|
| Sore walks out of the gate | "A woman walks out" 6.7 | walk 0 to 3.5 over 6.7 to 10.9 |
| standing, the push on the family | 12.0 to 34.2 | 4.05 to 5.6 (held; heads and blinks only) |
| Sore looks around | "Her husband ... He isn't." 20.6 to 24.2 | head turns (edit) |
| the runner walks over | "He walks over" 34.2 | 5.6 to 8.4 over 34.2 to 37.0 |
| his hand closes on the handle | "trunk" 50.9 to 51.24 | 9.45 at 51.15 |
| the trunk lifted | 51.2 to 51.8 | 9.5 to 10.1 |
| Shmuel lets go / takes his hand | "lets go" 55.7 / "takes his" 57.5 to 58.2 | 10.2 / clasp 11.3 at 57.6 |
| freeze | "New York" 58.7 to 67.5 | 11.5 |

## Look-dev additions for chapter 1

- `ep3_map.js`: a dusk look for the 3D model (`EM_DUSK`, set per frame with `emWithEnv`, so the other map clips keep their
  light): a low sun from the west-north-west, warm lit faces and roofs, cool shade, darker water with warm glints, a warm haze and
  a warm grade, the sun's glow at the top of the frame, long shadows on the ground (`emLongShadows`). Lower Manhattan's flat block
  footprints extruded into 3 to 6 storey rows (`EM_LOWER`) and ships at anchor off the Battery (`EM_SHIPS`), both only when a clip
  asks (`S.lower`). Three new shots: `renderDuskGlide` (0 to 6.5 s), `renderDuskRise` (67.3 s on: the family a gold marker at the
  fort gate among 46 ink arrivals), `renderSweepHome` (81.2 to 86.9 s: the route map's look, New York to HOME in the Pale). Clips
  `ep3_ch1_glide`, `ep3_ch1_rise`, `ep3_ch1_home` in `bridge.html`.
- `ep3.js`: `renderE3Runner(t, o)` options (above); the boots' polish glints; the fence trace drawn in the world, behind the figures.

## Chapter 1 QA (Nov 13)

- Contact sheets of the finished chapter every 3 s, read; the stills that show a beat checked against its word (table above).
- `audit_text.mjs ch01`: 13 text elements, all on screen 2.6 s or more (shortest: HOME 2.8 s at 0.2 s sampling, the question's
  tape line 3.8 s), none outside the title-safe area, no overlaps. The map's NEW YORK tag was dropped: its dot leaves the frame
  within two seconds, too soon to read.
- `audit_contacts.mjs ch01`: hands on handles, hand-to-hand pairs, planted feet, the stoop and held things all 0.00 px over the chapter.
- Loudness: chapter mix -18.2 LUFS integrated (narration alone -18.1, as Ep 2's chapters), peak -2.2 dBFS; the cold-open
  preview (chapter 1 + title, mastered as `assemble.sh` does) -14.1 LUFS, peak -1.2 dBFS.
- Rendering note: the disk filled during the first render and Chromium dropped scripts and screenshots; `render_edit.mjs` now retries a
  failed frame, and frames are best rendered with about 6 GB free (2,608 frames at 1080p are about 4.5 GB).

## Review round 1 polish (coordinator, Nov 13)

- Dialogue two-shot: a slow push-in (z 1.5 to 1.95, 37.4 to 51.8 s); acting driven by the words.json `who` spans: the runner's free
  hand opens on "Welcome, welcome", lifts on "Yankel!", goes to his chest on "He sent me", beckons on "Come", and is back at his side
  before he stoops; Sore looks up at him while she answers and shifts her grip on the trunk after; Rivke looks up at whoever speaks.
  The runner now stops 60 px short, at Sore's side (`manIn`), and steps in on "Come" (`e3Stand`), so he is no longer behind her.
- Holds 12 to 34 s: Shmuel fidgets (head, a small sway), Rivke hitches the feather bed up three times (`e3HugBed` dy), heads drift.
- Shmuel's two steps play at the clip's own speed (55.7 to 56.8 s); the hand-hold then holds to the freeze.
- Dusk model: teal-slate haze, ground and water as the series; warmth only on sunlit faces and the sun's glow (right third).
- "Runners" vocab card (`card()`), 61.4 to 65.9 s, top left, clear of the ring and the tag.
- Fix in `e3Settle` (lookdev): the walk cycle's frozen bob eased out as a walker settles; it had left the runner standing with bent knees.
- Audits after: text all >= 2.8 s, inside the safe area; contacts 0.00 px except Sore and Shmuel's held hands at 0.16 px at
  most while he sways (12 to 34 s; under a quarter of a screen pixel); chapter -18.2 LUFS, preview -14.1 LUFS.

## Chapters 2 to 5 (Nov 13, FULL_BUILD.md)

Each chapter is built from the look-dev clips, retimed to its words with `remap` (clip time from narration time; the clips' own
notes ride along), plus archival prints on the desk (`cards.js` `printCard`, each with its source and date), and ends on the
baton card (`cards.js` `batonCard`: the next chapter's title on a torn orange strip, slammed in on its spoken words, held
`CARD_HOLD` = 2.6 s; the chunk_snap click from `../public/sfx/` at the same time).

```
SFX="chunk_snap@0.3@81.94"  ./build_ch.sh ch02 ga_letters@0.085@0@0
SFX="chunk_snap@0.3@77.76"  ./build_ch.sh ch03 ga_letters@0.09@0@40@49.4 ga_steerage@0.085@49.4@51.5
SFX="chunk_snap@0.3@121.28" ./build_ch.sh ch04 ga_castle_garden@0.1@0@0@76.0@1.0 ga_castle_garden@0.09@97.6@76
SFX="chunk_snap@0.3@77.02"  ./build_ch.sh ch05 ga_letters@0.08@0@0
```

- **ch02 What They Left Behind:** `ep3_shtetl` (house and Friday table; the spring night with roofs burning far off, no people
  shown; dawn 1882, Yankel goes), `ep3_pale_map` twice (the Pale card; then all three cards for the May Laws), Makovsky's 1881
  deathbed painting, the 1883 farewell print, "2 million+" over Harper's 1874 Hamburg print, the Pogrom card on the night.
- **ch03 The Ticket:** `ep3_letter` with `{alone: true}` (Yankel writes alone, as a boarder in New York; the family is still in
  Europe) and the Prepaid ticket card; The Sun, June 11, 1884 ($18, about $650 today); `ep3_chain`; what Sore packed (drawn
  candlesticks, feather bed, samovar, trunk); the route map (`noEast`: no "letter goes east" note); `ep3_steerage` with the
  Steerage card and "SPEAKING YIDDISH"; `ep3_castle_garden` (the barge) under the card.
- **ch04 Castle Garden:** Ulrich 1884, `ep3_stat_cg`, the rotunda, the labor exchange (1868), the rotunda engraving (about 1870)
  with a coral figure for Ma Kelly, the name myth (registering, 1866), `ep3_names` (its Hebrew-style marks are now an abstract
  scribble), the name chain (Рабинович, Rabinowitsch, Rabinowitz), Ellis Island dated (about 1904; the 1893 station), the runner
  payoff, a RUNNERS board, Shults 1880 under the card.
  - **The payoff** is `renderE3Payoff` (lookdev/ep3.js), the clip's action with a clock per actor: the man, Shmuel and Sore walk in
    from the ferry side at walking pace (`pre` 7.5 s), Rivke walks with them, stops on "she was watching" (80.2 s) and looks back,
    runs on "heading away from the ferries" (13.5 of her steps, a run's pace) and takes Shmuel's hand at 86.4 ("Mama. Stop."); the
    man lets go and drops the trunk on "Stop." and hurries off; Yankel pushes through the crowd from 89.8 ("Sore! Sore!" is his
    voice off screen); the camera pushes in on the hands and back out.
- **ch05 Old and New:** `renderOldNew(t, {cells, at})` reveals each cell on its words (the old column, then the new; who decided;
  "SEEN AS similar / different"; the Kellys and "except the Irish: Catholic"); `ep3_decades` bars on their numbers;
  `ep3_map_arrival` (already keyed to this chapter) under the card "The Lower East Side".
- QA per chapter: text audit (all >= 2.5 s, none out of the safe area, no overlaps), contact audit (0.00 px, except
  `ep3_steerage`'s berth sitters at 2 px as in look-dev Round 13c), contact sheets, loudness.

## Chapters 6 to 9 (Nov 13)

`ch06.js` to `ch09.js`, shared pieces in `late.js` (`lQuiet` renders a look-dev clip without its clip text, `lPrint` an archival
print on the desk with a slow push, `lSrc` the source tag, `lNote`/`lTag` pen notes and mono tags, `lWord` the occurrence of a word
nearest a time, `lSpeak` the words.json speaker spans), the baton card from `cards.js`. New drawn shots in `../../lookdev/ep3_late.js`
(new functions only; the clip renderers in `ep3.js`/`ep3_map.js` are unchanged): `renderHesterB` (the market walk on narration time,
the listed things labelled as they are named, Rivke stops at the goat, Yankel stops, turns back and waves her on), `renderRoomB` (the
night room, and Monday's dawn), `renderSweatshopB` (the front room with the edit's camera, Sore sewing by hand at the window and
counting pieces onto a pile), `renderJarB` (the jar for a cousin's ticket), `renderUSMap` (coast to coast, California), `renderKnockB`
(the whole conversation at Ma's door, acting driven by the words.json speakers), `renderMovingInB` (Michael's longer walk home,
Yankel tugging at the trunk, Ma's look and head shake), `renderModelShot` (the 3D model with the edit's camera keys and tags).

```
SCALE=0.6667 FRAMES=<scratch>/ch06 SFX="chunk_snap@0.3@86.02" ./build_ch.sh ch06 ga_new_neighbors@0.093@0@0
SCALE=0.6667 FRAMES=<scratch>/ch07 SFX="chunk_snap@0.3@80.38" ./build_ch.sh ch07 ga_sweatshop@0.093@0@0
SCALE=0.6667 FRAMES=<scratch>/ch08 SFX="chunk_snap@0.3@114.22" ./build_ch.sh ch08 ga_not_welcome@0.098@0@0@60.2@1.2 ga_looking_backward@0.093@59.6@0@83.0@1.2 ga_letters@0.101@82.3@0
SCALE=0.6667 FRAMES=<scratch>/ch09 ./build_ch.sh ch09 ga_new_neighbors@0.093@0@0@29.9@1.0 ga_new_neighbors@0.05@29.3@29.3@63.7@0.9 ga_gilded_theme@0.105@63.2@55.88
```

- `SCALE=0.6667` (render_edit.mjs) renders the stage straight to 1280 x 720 (a third of the pixels and disk); leave it out for
  `RES=1080`. `FRAMES=<dir>` (build_ch.sh) puts the frames outside `out/`. Both default to the old behaviour.
- Music levels as Ep 2 (17 LU under the voice). Ch 9 dips `ga_new_neighbors` to 0.05 under the dialogue and brings in the series
  theme at 63.2 s from 55.88 s into the cue, so the cue is at 99.8 s when the chapter ends and the end screen (assemble.sh, as Ep 2)
  carries it on.
