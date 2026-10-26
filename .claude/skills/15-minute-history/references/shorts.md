# YouTube Shorts from a finished video

Make 3–4 Shorts per video once the main cut is approved. They use only the video's own assets: the voiced chapter WAVs,
the archival images, masks and layers, and the music library. No new voice credits. *Say It Ain't So* (Black Sox) is the
worked example: `techniques/components/black_sox/vshorts.tsx` in the style repo.

**Or write one for the Short.** When the spliced lines carry too much context from the long video, write a fresh
~110-word narration for the Short (about 40 s at the heavy pace), following "Write for someone who knows nothing" in
script-writing.md, and voice it (~620 credits). *When Europe Ate Mummies* Short 6 (`src/short6.tsx`) is the model:
its own words.json, a 3D gallery-corridor open and close (CSS 3D planes), and a loop back to frame 0.

## The rules (from the user)

- **Native vertical, never letterboxed.** A 16:9 scene in a band across a 9:16 frame wastes two-thirds of the screen and
  shrinks every note. Rebuild each scene for 1080×1920: the subject fills the frame, notes are laid out for portrait.
- **Open on the strongest line.** Splice it out of the narration (a hook from the middle or end of the chapter goes first),
  then tell the story in order. Viewers decide in the first second.
- **30–45 seconds**, one idea each, ending on a 3 s card that points to the full video ("the full story: TITLE · on the
  channel").

## How

1. **Pick the lines.** For each Short, list segments as `{ch, first: 'phrase', last: 'phrase'}` (phrases as in the chapter
   script; `firstNth`/`lastNth` for repeats). `build()` resolves them against the chapter's `words.json`, cuts each from
   0.12 s before the first word to 0.2 s after the last, leaves 0.3 s of air between lines, and returns a narration with
   local word times, so `makeTimeline` and `t.at('phrase')` work exactly as in a chapter.
2. **Scenes.** `Parallax` with `frame={[1080, 1920]}` and a 9:16 `crop` around the subject (measure the head from the mask:
   the first opaque row and its span); `Arch` with `tagY`; `Desk` with cards laid out for portrait (2×4 grids, one big card).
   Use `LAYERS_MAX=4000 tools/layers.py` for a small detail of a big print so it doesn't go soft.
3. **Safe zones.** YouTube's UI covers the top ~150 px, the bottom ~400 px and the right ~150 px from y 900 down. Scene
   text in x 60–930, y 150–1150. Captions at y ~1190 on a soft dark band. Wordmark small, top-left. Source tags at y ~1490.
4. **Captions.** Inter 800, uppercase, 88 px, cream with the spoken word in orange; three words at a time, never across
   the end of a sentence.
5. **Sound.** Each segment is an `<Audio startFrom endAt>` inside a `Sequence` at its local start; one music bed from the
   chapter's cue (0.13–0.22, by the cue's LUFS); a whoosh per cut; a stamp on the end card.
6. **Render and master.** `npx remotion render src/index.ts VShortN out/shorts/vshortN.mp4 --crf=18`, then
   `python3 tools/master.py out/shorts/vshortN.mp4 renders/shorts/<SLUG>_ShortN.mp4` (−14 LUFS). Check stills of every scene
   at phone size before rendering.
7. **Text.** `review/Shorts.md`: per Short a title (under 60 characters, a claim or a question), a 2–3 sentence description
   that ends "Full story on the channel: <title>", three hashtags. Posting tips: link each Short to the full video
   ("Related video"), one a day, the strongest first; "Altered or synthetic content" Yes for the voice clone.

## Good Short shapes so far

- **Then vs. now** ("1921: banned / 2026: partner"): the cold open's two documents.
- **One person, one twist** ("Accused twice. Still hired."): open on the punchline, then the evidence.
- **One moment** ("The signal"): the event, then who and how much, then the open question.
- **The first time** ("The first fixed game"): the scene, the number, the consequence.

## Standalone Shorts (not cut from a long video)

Worked examples: *The Last Public Execution* (`projects/Last_Public_Hanging/`), *This Movie Never Existed* (`projects/Rumpelstiltskin_Short/`), *Why "World" Series?* (`projects/World_Series_Short/`). They share `src/kit/vshort.tsx` (captions, topic strip, counter, folder, index card, sideways phone, end card) and a `src/cover.tsx` hook cover.

- **Script:** 150–160 story words plus a 14-word like/subscribe line, about 55–59 s at the normal pace (`VOICE_STRETCH=1.15`). Voice it as one file, then open a 0.6–0.9 s beat before the subscribe line with `withBeat()`.
- **End card:** "If you want more history like this, tap like, and subscribe. They're right there." Arrows point at YouTube's like button (about x 995, y 975) and Subscribe button (about x 560–760, y 1515), never under them.
- **Music:** time the cue's ending accent to the payoff line. Find it with an RMS envelope of the last 15 s, then `startFrom` = accent time minus the payoff word's time.

## Shorts checklist (run it on every Short before voicing, and again on the frame sheet before posting)

From the channel's own analytics: the Black Sox Short kept **12%** of viewers past the swipe, and the execution Short kept **55%** (1.1k views). The difference was the opening.

**The first second**
- [ ] **A cover frame, fully drawn on frame 0:** big type (110–150 px), one clear claim or question, over the strongest image. It must make sense with the sound off. The corner wordmark is complete on frame 0 too.
- [ ] **The first line is a scene with people, or a startling number, not background.** ("Sunrise. 20,000 people…", "Thousands storm a flour warehouse…", "Teams from outside the U.S. have won it exactly twice.")
- [ ] **Hook in three quick beats:** something that grabs attention (image or line), why it's worth watching, and an open question. All within about 3 seconds.

**The middle**
- [ ] **Nothing to read in the first 15 seconds.** No quote cards or document paragraphs until the hook has landed. (The Black Sox Short lost two-thirds of its viewers during an early quote.)
- [ ] **The picture changes every 3–5 seconds.**
- [ ] **One idea per beat, said in plain words.** No jargon a 12-year-old would need explained (the yield curve got cut for this reason).
- [ ] **A running device that makes people stay for the next item:** a checklist, counter, case file, or "first… then… and finally".

**The end**
- [ ] **The question asked at the start is answered out loud,** in one quotable line ("Named after a brag." "Once, maybe. But one lucky guess isn't a forecast.").
- [ ] **The last story frame matches the cover or first frame,** so a replay loops.
- [ ] **Under 60 s,** with the subscribe line after the payoff, never on top of it.

**The text and the post**
- [ ] **Title:** under 60 characters; the question or claim people would search for. **Description:** the first line repeats the hook, then 3 hashtags. **Pinned comment:** a question anyone can answer.
- [ ] **No text in YouTube's UI zones** (top ~150 px, bottom ~400 px, right ~150 px below y 900). Check the frame sheet from the finished render.
- [ ] **Check facts that can change on posting day** (debt totals, "exactly twice", "still waiting").
- [ ] **Neutral:** no modern politicians, no partisan framing; today's numbers stated once as plain facts.
- [ ] **On upload:** set "Altered or synthetic content" to Yes; choose "Not made for kids"; set "Related video" to the matching long video; pick the cover from the first second.

**After posting** (check after 48 hours and log it in `videos/README.md`)
- [ ] **"Stayed to watch":** 50% or more is good. Below 50%, change the cover and the first line.
- [ ] **Average % viewed:** 60% or more is good, and 80% or more is excellent. Below 60%, find the step-down in the retention graph and cut or speed up that stretch.
- [ ] **Cross-posting** to TikTok, Reels or Facebook: export without the YouTube end card. Those platforms favor shorter clips, so consider a 30–45 s cut.
