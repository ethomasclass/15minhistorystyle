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
