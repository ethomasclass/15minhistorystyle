# Chapter build brief (chapters 2–8)

Project: `projects/Halloween_Bribe` (Remotion, 1920×1080, 30 fps). Branch `ccr-5f9195b0-0cknf0`. One builder per chapter.

## Your file, and only your file
- Edit **only `src/ch/ChNN.tsx`** (your chapter; a skeleton is there, wired to the real narration and registered in
  `src/chapters.ts`). You may add helper files under `src/ch/chNN/`. **Do not edit** `src/kit/*`, `src/fx/*`, `src/Root.tsx`,
  `src/chapters.ts` or another chapter. If you need a kit change, do it locally in your chapter file or say so in your reply.
- **Do not commit.** Do not render full chapter videos (the machine has 4 cores shared by 7 builders): stills and the text probe only.

## Read first
1. `.claude/skills/15-minute-history/references/building-scenes.md`, `visual-style.md`, `explainer-craft.md` §3–5.
2. **`src/ch/Ch01.tsx`: the finished cold open. Follow its patterns exactly:** `makeTimeline(N, 30)`, `t.at('phrase')`
   (frames from the first word; the phrase must match the narration's words), cuts 1 frame before the word that starts a new
   idea, each scene in a `<Sequence from={cut}>` with times passed as `t.at(..) - a`, `useScene(cuts)`, `Sfx` (whoosh on cuts,
   stamp on tapes, `WRITE` before notes), `bed('cue')` for music volume.
3. The kit: `src/kit/Kit.tsx` (`Highlight` orange tape, `Note` handwriting, `Tag` source line, `Loop`, `Arrow`), `src/kit/shell.tsx`
   (`ChapterShell` with `music` / `quiet` / `extra`, `PhotoCard`, `Definition` vocab card, `Quote`, `Photo`), `src/kit/desk.tsx`
   (`Desk` card / `Cut` cut-out for archival pictures), `src/kit/prop.tsx` (`Prop`: AI prop cut-outs, B&W, `coral`, `trace`),
   `src/kit/silparallax.tsx` (`SilScene`: the silhouette paintings in multi-plane parallax; sizes from
   `public/img/layers/sil/<name>/layers.json`), `src/fx/*` (3D pieces: `AtlanticCrossing`, `XRayScan` + `Tally`, `CandyPile`,
   `HalloweenCorridor`, `EndScreen`, `Smoke` in `fx/Headline.tsx`; each exports a Test showing its usage and keys).
4. Narration: `script/chNN_*.txt`; word timings `public/audio/chNN_*.words.json` (`words[i].w`, `.s`, `.e` seconds).
5. Assets: `script/IMAGES.md` (archival, with on-screen tags and beats), `script/PROPS.md`, `script/GEMINI_PROMPTS.md`
   (scene paintings), `script/SUNO_PROMPTS.md` (chapter music map), `script/SCRIPT.md` (loops, callbacks, vocab, humor map).

## The look (the channel's rules)
- Dark notebook desk; archival pictures **B&W**, cut out or on a card; **one coral subject per scene**; teal marks; orange tape
  titles (2–4 words, on screen ≥ 2 s); handwritten notes (put them on torn paper slips or a dark gradient over busy pictures).
- **A source `Tag` on every archival image**; none on AI paintings or props; never the word "AI" on screen.
- Silhouette paintings stay in their own colours (no grayscale, no coral); props are B&W with optional coral.
- A new visual beat every ~4–8 s. When the line says "look at this" / "this one", mark it (Loop, Arrow, trace).
- Vocab terms in `{braces}` in the script get a `Definition` card or a tape + note when defined.
- Text never crosses the frame edge: **`node tools/probe_text.mjs ChNN` must report no overflow** (it renders sampled frames).
- Graphics step at 12 fps (`useGFrame`, already set up by `ChapterShell`); camera moves and parallax are smooth.
- Callbacks reuse the same image as their first appearance (see SCRIPT.md "Callbacks").

## Music
Use `ChapterShell`'s `music` prop: `[{src: 'music/<cue>.mp3', volume: bed('<cue>'), startFrom?, from?, to?, fadeOut?}]`
(`bed(cue, 14)` for grave stretches). Cues are in `public/music/`; loudness is registered in `src/kit/levels.ts` (`m_1924`,
`b_newsreel`, `r_dix` and the `hb_` cues). Energy notes: `hb_black_halloween` hush at ~60 s, builds ~85 s and ~130 s;
`hb_oiche_shamhna` fullest ~120–135 s; the others are steady.

## Test before you reply
`npx tsc --noEmit -p .` passes. Stills: `node tools/stills.mjs ChNN out/stills_chNN <seconds…>` (composition seconds: the
narration starts after the 44-frame lead, about 1.47 s). Render a still at every scene and look at each one; fix overlaps,
empty frames, unreadable text, wrong images. Then the text probe. Reply in under 200 words: scenes and what's on screen,
music, anything imperfect or any asset you wished you had.
