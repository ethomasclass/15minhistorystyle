# YouTube Shorts from a finished video

Make 3–4 Shorts per video once the main cut is approved. They use only the video's own assets: the voiced chapter WAVs,
the archival images, masks and layers, and the music library. No new voice credits. *Say It Ain't So* (Black Sox) is the
worked example: `techniques/components/black_sox/vshorts.tsx` in the style repo.

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
