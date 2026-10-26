---
name: 15-minute-history-shorts
description: Make vertical YouTube Shorts (1080x1920, 9:16) from a finished 15 Minute History video, in the channel's look. It covers picking self-contained segments of the existing narration, re-laying the video's own pictures, titles and notes out vertically, a persistent hook headline and a cover frame that works as YouTube's automatic thumbnail, word captions, fun music from the library, a short voiced "watch the full video / subscribe" outro, render and master, and the Shorts caption, description and upload settings. Use this whenever the user asks for Shorts, vertical clips, Reels, TikToks, short-form cuts, teasers or "45-second versions" of one of their videos, even if they just name a topic from a video ("make a short on the Fox sisters").
---

# 15 Minute History Shorts

Shorts are cut from a finished long video, not written from scratch. The user's rules, from making the first three
(King Andrew: "He wouldn't bow to a king"; Fix Everything: the Fox sisters and the Temperance Movement):

- **Keep the voiceover and content.** Reuse the chapter's narration word for word, plus its titles, notes, pictures and
  facts. The job is re-laying them out for a phone, not re-scripting.
- **No new assets, except one outro line.** Every short ends on a voiced reminder to watch the full video and subscribe,
  recorded once per long video in the same voice clone and pace, and reused by all of that video's shorts.
- **Fun music** from the channel's library under the story, dipped under any sad beat.
- **A good automatic thumbnail.** YouTube doesn't document which frame it uses as a Short's cover, so every likely
  frame has to work (see Covers below).
- **Word captions on.** About **45 s** is the target; 35–70 s is fine (Shorts can run up to 3 minutes).
- **Make one as a test first**, get the user's notes, then make the rest the same way.

This skill builds on the main `15-minute-history` skill (same kit, same look). Read its `references/visual-style.md`
if the look is unfamiliar. The detailed layout rules and every lesson so far are in `references/layout-and-covers.md`;
read it before building scenes.

## Workflow

| # | Step | Checkpoint with the user |
|---|---|---|
| 1 | Find the video project and add the shorts kit | |
| 2 | Pick segments | **yes:** a table of shorts (hook, narration range, length) |
| 3 | Record the outro line (once per long video) | |
| 4 | Build one short; check stills, cue words and covers | |
| 5 | Render, master, check, send | **yes:** the test short, before making the rest |
| 6 | Write the caption, description and upload settings; commit | |

### 1. Find the project and add the kit

The long video's project holds its narration, pictures and masks. `videos/README.md` in the style repo lists each
video's repo and branch. Attach that repo, then:

```sh
sh <this-skill>/scripts/add_to_project.sh <project>/video "<Full Video Title>"      # --example adds ShortExample.tsx (template projects)
```

It copies `src/shorts/Short.tsx` (the shell), and writes `script/shorts/outro_subscribe.txt` with the title filled in.
Projects made with `new_project.sh` (they have `src/kit/`) work as-is. Older projects keep the kit
elsewhere, so change the five imports marked `PATHS` and `MAP_SRC` at the top of `Short.tsx`:

| Project | Kit imports (from `src/<dir>/shorts/`) | lib | Map image |
|---|---|---|---|
| Template (`src/shorts/`) | `../kit/Kit`, `../kit/common`, `../kit/Intro` | `../lib/…` | `img/maps/mitchell_1836.jpg` |
| Fix Everything, `reform-era` (`src/shorts/`) | `../jh/Kit`, `../ch/common`, `../ch/Intro` | `../lib/…` | `img/jh/mitchell_1836.jpg` |
| King Andrew, `Jackson` (`src/v3/shorts/`) | `../Kit`, `../common`, `../Intro` | `../../lib/…` | `img/v3/maps/mitchell_1836.jpg` |

Register each short in `src/Root.tsx` as its own composition, `width={SW} height={SH}` (1080×1920), 30 fps:
`<Composition id="Short-Fox" width={SW} height={SH} fps={FPS} durationInFrames={SHORT_FOX_FRAMES} component={() => <JFonts><ShortFox /></JFonts>} />`.
Run `npm ci` if the project has no `node_modules/`.

### 2. Pick segments

```sh
python3 <this-skill>/scripts/segments.py public/audio/ch03_knock_once.words.json                    # every sentence, timed
python3 <this-skill>/scripts/segments.py public/audio/ch03_knock_once.words.json "Take 1848" "toe joints."   # cut points
```

- **A good short is one continuous run of whole paragraphs** that opens on something concrete and ends on its own
  punchline: "She'd been cracking her toe joints." / "…it started with people signing a piece of paper."
- Two runs can be joined when the second pays off the first (the boots in chapter 2, then chapter 11's "Remember that
  kid… the nickname King Andrew"). Cut in the pauses; the shell puts a 0.2 s breath between clips.
- The story part should run **at least ~30 s**, or the outro (~9 s) reaches the 75% point and becomes a likely cover.
- Leave out tragedies played for a hook (e.g. the Trail of Tears); the channel treats them quietly.
- **Propose a table** (hook headline, narration from → to, length, pictures, music) and let the user choose. They may
  just name topics ("one on the Fox sisters and one on temperance"); find those in the chapters.

### 3. The outro line

One per long video, reused by all its shorts. Text (from `assets/outro_subscribe.txt`):
*"Want the rest of the story? Watch the full video, TITLE, right here on the channel. And subscribe for more 15 Minute
History."* Voice it with the main skill's tools, same clone and the locked pace (needs the ElevenLabs key in `.env`):

```sh
VOICE_MAX_PAUSE=0.25 VOICE_SENT_GAP=0 VOICE_PARA_GAP=0.35 VOICE_STRETCH=1.15 python3 tools/voice.py script/shorts/outro_subscribe.txt short_outro_subscribe
```

If the project has no `tools/voice.py`, voice it in any project that has one and copy the `.wav` and `.words.json` into
this project's `public/audio/`. Copy the long video's chosen thumbnail into `public/img/shorts/`; the outro shows it on a
card (in colour), then the wordmark and SUBSCRIBE with an arrow toward YouTube's subscribe button. Without an
ElevenLabs key, `tools/fake_voice.py` makes a placeholder to build against; never ship it.

### 4. Build the short

Copy `assets/shorts/ShortExample.tsx` (or a finished short in the project) to `src/shorts/Short<Name>.tsx`:

- `CLIPS`: the narration clip(s) from step 2, then `{stem: 'short_outro_subscribe', …, to: (outro as Narration).duration}`.
- `headline`: two lines of orange tape, the hook, on screen the whole time. The chapter's own title often works
  ("KNOCK ONCE / FOR YES…"), or the most surprising fact ("AMERICANS DRANK / 7 GALLONS A YEAR"). At size 92 a line holds
  about 15 characters; use `headlineSize={86}` for 16.
- Scenes: one per chapter scene, same titles and notes, re-laid out with `CropV`, `fillV`, `Card`, `MapViewV`, `PinV`
  (rules and recipes in `references/layout-and-covers.md`). The outro scenes are `OutroWatch` (pass `thumb`) and
  `OutroSubscribe`, cut on `'Want'` and `'And subscribe'`.
- `music`: a fun cue from the style repo's `music/` (copy it into `public/music/`), level from its LUFS (−14.5 → 0.12,
  −10.7 → 0.09), `duck` over sad beats. Used so far: `j_campaign` (rowdy march), `r_spirits` (playful-eerie music box),
  `r_temperance` (honky-tonk).
- Check cue words across the joined clips: `python3 <this-skill>/scripts/check_anchors.py src/shorts/Short<Name>.tsx`.
- `npx tsc --noEmit -p .`, then stills of every scene plus frame 0 and the 25 / 50 / 75 % points
  (`node tools/stills.mjs Short-<Name> out/shorts/<name> 0 3 9 …`), laid out 9:16 and looked at.

### 5. Render, master, check, send

```sh
npx remotion render src/index.ts Short-<Name> out/shorts/raw.mp4 --crf=18
python3 tools/master.py out/shorts/raw.mp4 renders/shorts/<Video>_Short_<N>_<Name>.mp4      # −14 LUFS
node tools/probe_text.mjs Short-<Name> 10 2>&1 | grep -v "PROBECOUNT\|emory"               # nothing off the edge
python3 <this-skill>/scripts/cover_frames.py renders/shorts/<Video>_Short_<N>_<Name>.mp4 out/cover   # frame 0 + 25/50/75 %
```

Finished shorts go in `renders/shorts/` (Fix Everything used `review/shorts/` at the repo root; follow the project).
Copy `out/cover/cover_frame0.jpg` next to each one as `<Video>_Short_<N>_cover_frame0.jpg`.

Older projects' `probe_text.mjs` judged "partly on screen" against 1920×1080 and skipped the bottom half of a vertical
frame; make sure the project's copy reads the composition's size (`sizes[id]`), as the template's does now.
Shorts are usually 9–35 MB; anything over 30 MB needs a slightly smaller copy to send in chat
(`ffmpeg -i in.mp4 -c:v libx264 -preset slow -b:v 3600k -maxrate 4500k -bufsize 9000k -c:a copy out.mp4`).
Send it with a short note: what's in it, the music, the cover, the checks run.

### 6. Caption, description, upload settings

Write `review/SHORTS.md` (the finished ones in `examples/01_Fix_Everything/SHORTS.md` and
`examples/04_King_Andrew/SHORTS.md` are the model):

```
Caption (title): <the hook as a curious claim, ≤ ~60 characters> <one emoji>      e.g. Two Sisters Fooled America for 40 Years… With Their Toes 👻
Alternate: <a shorter one that fits the feed without truncating>

Description:
<2–3 sentences: the concrete hook, the twist, a question or payoff>

▶ Watch the full 15-minute story: <link to the full video>
🔔 Subscribe for more 15 Minute History.

#<Topic> #APUSH #history
```

Upload settings to list: **Related video** = the full video (it's what "the full video is linked below" points to);
**cover** = 0:00 if they want to choose it in the YouTube app (save `cover_frame0.jpg` next to the short); **altered
or synthetic content** = Yes if the short includes any AI-illustrated scene, otherwise as for the full video (the
narration is a voice clone); **category** Education.

Commit the shorts code, outro audio, masks, the renders, cover frames and `SHORTS.md` on a new branch of the video's repo
(don't push to someone's main branch unasked), and push. After the batch, offer to copy `SHORTS.md` into the style
repo's `examples/<video>/` and note anything new in `references/layout-and-covers.md`.

## Covers

YouTube doesn't publish how it picks a Short's cover, and creators report it looks random; the creator can pick a frame
in the app. So the cover has to land wherever it's taken:

1. **Frame 0 is a finished cover:** the headline plus the strongest picture, fully drawn (`at={-100}`), ideally a
   coral-tinted, teal-traced face (make a mask from the existing picture with rembg if it has none).
2. **The headline stays on every frame** (the shell does this).
3. **Frame 0 and the 25 / 50 / 75 % points each show a real picture with the headline:** no near-empty desk waiting for a
   card, no overlay so dark it hides the picture, no half-wiped title, never the outro. `cover_frames.py` lays them out.
4. Tell the user the exact time of the best frame (usually 0:00) in case they'd rather pick it.
