# Handoff: the American West series (start here in a new conversation)

Repo: `ethomasclass/15minhistorystyle` (style repo + this series). Everything below is on the default branch.
Skill: `.claude/skills/15-minute-history/` (read `SKILL.md`). Standing preferences: `videos/README.md` → *Your standing preferences*
(updated heavily in this series; they are the law).

## The series

`projects/American_West/SERIES.md` (4 episodes, the story arc every episode follows, Promise Ledger, hinge years, callbacks, test
items), four outlines `EP1_…`–`EP4_…_OUTLINE.md`, `GRAPHICS_BRAINSTORM.md`, `LITHO_PROMPT.md` (AI image style), `MUSIC.md`
(12 Suno cue prompts `aw_*` + per-episode maps with library fallbacks). Unit question: "To what extent did the United States
fulfill its promises of freedom and opportunity after the Civil War?"

## Ep 1 · Not in the Picture (`projects/American_West/ep1/`) — STATUS: all nine chapters built, NOT rendered

- Script: `script/SCRIPT.md` (+ `chNN_*.txt`), with v4 delivery cues `[wry]`, `[serious]`, `[firmly]` … (never `[quietly]`: v4 whispers).
- Narration: voiced, ElevenLabs `eleven_v4`, one take per chapter, 14:53 (`public/audio/chNN_*.wav` + `.words.json`;
  `script/Not_In_The_Picture_narration_preview.mp3`). Re-voice one chapter: `python3 tools/voice.py script/chNN_x.txt chNN_x`.
- Scenes: `src/ch/Ch01.tsx`–`Ch09.tsx` on real word timings; brief `SCENES.md`; per-chapter notes `review/build_ch01-03.md`,
  `build_ch04-06.md`, `build_ch07-09.md`; contact sheets `review/stills/chNN_sheet.jpg`. Kit: `src/kit/west.ts` (re-exports
  `src/samples/kit.tsx` + `src/previews/fx.tsx`), `src/kit/ch01_extra.tsx` (drawn West map, ribbon, township, Act page),
  `ch04_extra.tsx`, `ch07_extra.tsx`, `house_litho.tsx`.
- House chamber (ch01 end, ch02 start): lithograph chamber with the empty wedge traced by Gemini (`review/ai_house_chamber/`),
  switch `HOUSE_LOOK` ('litho' | 'diagram') at the top of `Ch01.tsx`/`Ch02.tsx`. **User picked litho.**
- ch04 snow scene: lithograph bunkhouse + teal-hatched snow (user's suggestion, done).
- Approved look references: `review/previews/P1-ColdOpen.mp4`, `P2-Race.mp4`, `P3-Checker.mp4` ("These are awesome!").
- Checks pass for all chapters: `npx tsc --noEmit -p .`, `tools/anchors.py`, `tools/probe_text.mjs` (whip frames and faded P2
  labels are known false positives).

### Waiting on the user
1. ~~Suno cues~~ In (Oct 2026): `aw_iron_horse` (ch03, ch05), `aw_long_grief` (ch04, trimmed to 3:04), `aw_legend_sours` (ch05),
   `aw_robber_barons` (ch07), `aw_panic` (ch08, its stop lands on the last line), `aw_promise_theme` (ch09 to the end screen); all in
   `music/cues/`, README and catalog. **Open:** the legend cue's turn isn't audible in the data; set `LEGEND_TURN` (seconds) in
   `Ch05.tsx` once the user names it.
2. ~~The Grant cartoon~~ Done: the user's test cartoon is Currier & Ives, *A Nice Family Party* (1872, LOC pga-09549):
   ch06 "some of his friends did not deserve it" (tight on "Let us have peace." as its box fills teal, pull out, the three "Let us have
   a piece." boxes fill see-through coral, the user's idea). The both-ways pair stays Nast 1872 + Morgan 1872 (they match the narration's words).
3. ~~House chamber~~ litho (user's pick).
4. ~~ch02 "Black families" circle~~ Checked: the crop is now tighter (woman in white, mother in the wagon, children); the one
   stylised face at the right edge is out of the circle.

### Branding and transitions (Oct 2026)
Chunk History replaces 15 Minute History: `src/kit/ChunkIntro.tsx` (from `brand/chunk-history/intro` on the Reconstruction branch)
gives the 5.5 s 3D intro after the cold open (jingle `public/music/chunk_jingle.mp3`) and the 2 s chapter-break mark snap
(`LogoBreak`). In-chapter transitions are gentle (`Shots` in `src/previews/fx.tsx`: drift instead of whip, 6-frame dissolve
instead of a hard cut; whip sound at half level). **Still on the old brand:** the thumbnail and `Brand.tsx` use the old
15 Minute History `Wordmark` (`src/kit/Intro.tsx`); the end screen has no logo.

### The branding sound (Oct 2026): clicks and page turns only
The user's call after trying a marimba tune, a felt-piano tune, a chopped old-record horn and a lo-fi beat: **no tones and no music
in the branding, only clicks and page turns.** `ep1/tools/make_jingle.py` (default mode) builds it from a bank of single clicks cut
out of ElevenLabs pen / keyboard / mouse takes (`public/sfx/raw/jingle_click_*.wav`; they die away in 9-20 ms, unlike the library
`tick`/`tick_soft`, which ring at ~2.6 kHz and are not used) plus `page_turn`. Intro (`public/music/chunk_jingle.mp3`, 5.5 s, peak
-8 dBFS): five clicks that speed up with the five blocks (1.20 to 2.47 s), a click-clack for the coral lock (2.80 s), one firm click
on CHUNK (3.60 s), three tiny clicks on HIS-TO-RY (3.95 / 4.04 / 4.13 s), a page turn at 4.45 s into the title card. Chapter break
(`public/sfx/chunk_snap.wav`): the lock click-clack at 1.0 s, a page turn as the next chapter fades up. Other modes still work
(`piano`, `marimba`, `chop`, `lofi`); the music takes and ingredients are in `review/jingle_takes/` and `public/sfx/raw/jingle_*`.
Preview: `review/previews/P7-ClicksOnly.mp4`. ElevenLabs Music can't write a short tune (it returns one struck chord); its sound
generation makes good one-shots. The original brand jingle is on the Reconstruction branch.
**Keys:** `ep1/.env` (git-ignored) holds an ElevenLabs key the user pasted in chat (Starter plan, ~42,000 credits left on
2026-10-26): **ask them to rotate it.** No VOICE_ID or Gemini key there yet.

### Mix levels (matched to Black Sox, Oct 2026)
Narration levelled from ~-24 to -18 LUFS (`tools/level_voice.py`, now run by `voice.py` on every take; zero timing shift). Music
volumes come from `bed(cue, gap)` in `src/kit/levels.ts` (13 LU under the voice; ch04's grief cue 14). Check: the ch08 mix
measures -18.0 LUFS against the voice's -18.2. New Suno cues: measure (`ffmpeg -af ebur128`) and add to `CUE_LUFS`.

### Polish list (do before the render)
1. ~~ch04 records card: "Chinese deaths" shows a ✓ next to "?" → just "?".~~ Done.
2. ~~ch02: a few dark, sparse map shots (pre-war deadlock) and a near-empty frame before the four portraits.~~ Done (coral-hatched West + label on
   the four map shots; empty sockets wait for the four portraits).
3. ~~ch07's two-views card: match ch06's supporters' wording.~~ Done (same four lines + headers as ch06).
4. ch04 3D cut-away says "worked from 4 faces" (not in the narration): historically right (both portals + the central shaft dug both ways), kept unless the user wants it gone.
5. ~~Fact checks~~ Done (`script/SCRIPT.md` → *Fact-check pass*): House counts, prices and "89 of 364" confirmed and sourced on screen;
   flags 2, 8, 9, 17 checked. The Ames line: narration says "where *they*", the report (on screen) says "*it*"; the user chose
   not to re-voice (the card carries the exact words).
6. ch04 strike camp image is Brown's Station (Nevada, 1868–69), tagged with its real date.

### Then
Swap music → polish → render (`tools/render.sh`, `references/render-and-deliver.md`) → master −14 LUFS → 720p + <30 MB preview →
thumbnail (S1-C torn print with the coral worker) → YouTube text → viewing guide. Then Ep 2 (outline ready).

## Rules learned in this series (all in `videos/README.md` and the skill)
Black desk only (no cream/white cards or sticker borders) · notes are bare teal handwriting, no tape behind · one see-through coral
subject · depth: wide → detail, a cut every 3–6 s, varied camera moves, slap/overshoot/shake/breathing, texture · 3D where it explains
· hook alignment in the first 2 s · trace and source, don't eyeball (Gemini line/region finder) · AI images (Gemini 2.5 Flash Image,
tinted lithograph, `tools/weather.py --preset medium`) used freely for props/scenery/plates, **never tagged on screen, never "AI"
on screen**, never real people or fake documents · no AI imitation of Native music · gentle sounds only (new `*_soft` set) ·
narration on `eleven_v4`, one take, speed 1.0, with sparing `[cues]`.

## Keys
`ep1/.env` (git-ignored, never commit or print): `GEMINI_API_KEY` (paid AI Studio project), `ELEVENLABS_API_KEY`, `VOICE_ID`
(Ellis), `HF_TOKEN` (no credit). All were pasted in chat in this conversation: **ask the user to rotate them**, and a new session
will need them re-supplied (the container's `.env` won't carry over).
