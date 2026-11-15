# Gilded Age Shorts (from Episodes 1 and 2)

Vertical YouTube Shorts cut from the episodes' material, each voiced on its own (Ellis, `script/voice_shorts.py`; s3 adds Nora):

| Short | Script | Audio | Output | From |
|---|---|---|---|---|
| s1 "The Bad Wire" (54.7 s) | `script/s1_bad_wire.txt` | `public/audio/s1_bad_wire.wav` + `.words.json` | `review/s1_bad_wire.mp4` | ep1 ch09 (the swap, cableXray +150) and ch01 (the bridge) |
| s2 "Rockefeller's Father" (51.2 s) | `script/s2_rockefeller.txt` | `public/audio/s2_rockefeller.wav` + `.words.json` | `review/s2_rockefeller.mp4` | ep1 ch06 (con-man father, turkey money, red notebook, $1,000 at interest, ~90%) |
| s3 "They Spent $9 Million on One Party" (71.4 s) | `script/s3_vanderbilt_ball.txt` | `public/audio/s3_vanderbilt_ball.wav` + `.words.json` | `review/s3_vanderbilt_ball.mp4` | ep2 ch01/ch02/ch03 (the ball, Alva vs Mrs. Astor, the costumes, Nora's ices) + the drawn costume plates (`edit/costumes.js`); plan in `S3_PLAN.md` |

## How it's built (`edit/`)

Same machinery as `../ep1/edit`, rendered directly at **1080x1920**:

- `edit.html` loads the look-dev kit, Ep1's `edit.js` (wordAt, editFrame with 0.3 s crossfades and 12 fps stepping for desk
  shots, cableXray, drawLine) and `brand.js` (the mark), then `vedit.js` and the two shot lists. A third layer carries captions.
- `vedit.js`: `wide(html, {s, fx, fy})` draws a 1920x1080 look-dev scene into the tall frame, scaled at least 1.78x and
  clamped so it always covers the frame (a crop/pan on the important part, never bars); `vdesk`/`vback`/`vcut`/`vprop` are
  the desk and the Ep1 cut-outs and props (read from `../ep1/public/img/`) laid out natively for vertical; `captions` groups
  the words into 2 to 4 word chunks (breaking at punctuation and pauses) and burns them in, Inter 800 with an ink outline,
  the spoken word in orange; `endCard` is the last 2 s (mark snap, "Chunk History", "full episode on the channel").
- `s1.js`, `s2.js`: shots anchored with `wordAt` (occurrences counted; the counts are listed in each file's header).
  Scenes (`renderScene`, the medicine show) run smooth at 30 fps; desk shots step at 12.
- `render_edit.mjs s1 <dir> [from] [to]` renders frames, `--stills 0,5,9 <prefix>` renders check stills.
- s3 (`s3.js`, `costumes.js`): the pace rule, nothing on screen longer than 3 s (34 shots, 1.5 to 2.95 s each). Ep 2's sets
  (`lookdev/mansion.js`: Fifth Avenue at night and dawn, the house cut open, Nora in the kitchen) are loaded in `edit.html`.
  `costumes.js` draws the seven costume plates (cat, hornet, devil, duchess, Electric Light, Dresden porcelain, kings) plus the
  lone guest at the door: SVG, vivid costume colour in a dark room with a spotlight and grain, a quick push-in and one small
  animated detail each. Real guests, so no faces: every head is seen from behind, lit only on its edge. Nora's words are coral
  in the captions (hers alone); the narrator's spoken word is orange. Voice: Ellis at 1.08x local tempo (eleven_v4 mostly
  ignores `speed`) with pauses capped at 0.3 s (`voice_shorts.py` SPEED/STRETCH/MAX_PAUSE/GAPS); Nora's `[whisper]` is sent
  as `[nervous]`, since the channel's voice.py never sends whisper tags.
- `MUSDIR=../../ep2/public/music FRAMEJPG=1 CHUNKS=3 LOCK=<lockfile> ./build_short.sh s3 ga_the_ball ga_below_stairs 55.6`:
  the Ep 2 waltz under the party, crossfading at 55.6 s ("Downstairs") to the kitchen bed 20 LU under the voice; JPEG frames
  rendered and encoded in 3 pieces (frames deleted after each), the render held under `flock` on a shared machine.
- `build_short.sh s1 ga_bad_wire` / `build_short.sh s2 ga_the_squeeze`: 4 parallel render chunks, music bed measured and
  set 17 LU under the voice, faded over the last 2 s, mastered to -14 LUFS (loudnorm, -1.5 dBTP), H.264 1080x1920 30 fps,
  then the frames (about 6 GB) are deleted. Check `df -h /` first.

Safe area: text stays out of the top 200 px, the bottom 350 px and the right 180 px. Captions sit at y 1230 (lower-middle
third). Teal explains, orange notes; coral only for a Kelly (Nora in s3) and the brand mark. No em dashes in any text.
