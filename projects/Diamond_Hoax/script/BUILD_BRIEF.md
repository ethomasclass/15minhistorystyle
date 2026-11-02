# Chapter build brief (chapters 2–9)

Project: `projects/Diamond_Hoax` (Remotion 4, 1920×1080, 30 fps). Video: *They Fooled America's Richest Men* (the Great Diamond
Hoax, 1872). One builder per pair of chapters, working at the same time as three others.

## Your files, and only your files
- Edit **only your chapters' `src/ch/ChNN.tsx`** (skeletons are there, wired to the real narration and registered in
  `src/chapters.ts`). Helpers may go in `src/ch/chNN/`. **Do not edit** `src/kit/*`, `src/fx/*`, `src/Root.tsx`, `src/chapters.ts`,
  `src/masks.ts`, `src/project.ts`, `tools/*`, or another builder's chapters. If you need a change to a shared piece, copy it into
  your chapter folder and change the copy, and say so in your report.
- **Do not commit or push.** **No video renders** (the user's instruction; the machine has 4 cores shared by four builders). Check
  your work with **stills only** (`node tools/stills.mjs ChNN out/stills_chNN <seconds…>`, a handful per run, one run at a time) and
  the text probe.

## Read first
1. `src/ch/Ch01.tsx`: **the finished, approved cold open. Follow its patterns exactly**: `makeTimeline(N, 30)`, `t.at('phrase')`,
   cuts 1 frame before the word that starts a new idea, each scene in `<Sequence from={cut} layout="none">` with its beats passed as
   `t.at(..) - a`, `useScene(cuts)`, `Sfx` (whoosh per cut, stamp per tape, `WRITE` 2 frames before each note), its `Print`
   component for archival prints on the black desk (copy it: **no cream or white mounts**, the user's rule).
2. `script/SCENES.md` (your chapters' beats, the recurring pieces, the money tags, the Con Card schedule), `script/SCRIPT.md`
   (narration, vocab, quote cards, fact-check flags), `script/IMAGES.md` (archival files per chapter, their on-screen source tags and
   the beat each serves), `script/AI_IMAGES.md` (props and silhouette scenes).
3. Skill references in the style repo: `.claude/skills/15-minute-history/references/building-scenes.md`, `visual-style.md`,
   `explainer-craft.md` §1, §3–6.
4. Narration: `script/chNN_*.txt`; word timings `public/audio/chNN_*.words.json` (`words[i].w/.s/.e`, seconds).

## Pieces you can use
- **Kit:** `src/kit/Kit.tsx` (`Highlight` orange tape, `Note` teal handwriting, `Loop`, `Arrow`, `Tag`, `Traced`, `Tint`),
  `src/kit/shell.tsx` (`ChapterShell`, `Definition` vocab card, `Quote`, `Stamp`, `Photo`), `src/kit/vox.tsx` (`Swipe`/`Spot` for
  document highlights, `Slip`), `src/kit/prop.tsx` (`Prop`: B&W cut-out props, optional `coral` + `trace`),
  `src/kit/silparallax.tsx` (`SilScene`, sizes and `glowLayer` from `public/img/layers/sil/<name>/layers.json`),
  `src/kit/conCard.tsx` (**`ConCard`**), `src/kit/levels.ts` (`bed()` for music volume).
- **3D pieces** (`src/fx/*.tsx`; each header lists its beat props): `Mesa` + `MESA_CAM`, `LoopingRide`, `AnthillCutaway`,
  `GemOrigins`, `Dominoes`, `BankVault`, `ShareSlices`, `ShortSale`, `MoneyMap`, `ColdOpenDepth` (the H1 picture, for callbacks),
  `MoneyTag` (in `ColdOpenDepth.tsx`).
- **Props** (`public/img/props/<name>.webp`): leather_pouch, rough_diamond, rough_rubies, stone_pile, diamond_drill_bit,
  claim_stake, jeweler_loupe, lantern, pointed_stick, bandana_blindfold, slouch_hat, top_hat, share_certificate (blank centre: put
  a money tag on it), banknotes_stack, cup_of_sugar, pocket_watch, undertaker_coffin, henry_rifle.
- **Silhouette scenes** (`SilScene name=…`): sil_sf_night, sil_salting, sil_ride, sil_fever, sil_train, sil_cold_mesa,
  sil_stranger, sil_dawn_ride, sil_bank_line, sil_bay_dusk, sil_undertaker. They keep their own colours (no grayscale, no coral, no tag).

## Rules for this video
- **The look:** black notebook desk; archival prints B&W, **one coral subject per frame** (see-through tint + teal trace, never a
  flat red block); teal marks; orange torn-tape titles (2–4 words, on screen ≥ 2 s); notes as bare teal handwriting; marks step at
  12 fps, camera moves smooth; a new visual beat every 4–8 s; wide shot then a detail; one camera move per shot.
- **Arnold, Slack and Janin have no reliable photos.** Show them as **silhouette figures**: a black cut-out figure in period dress
  with a mono label ("JOHN SLACK · no reliable photo"). Make these once with Gemini (`tools/gemini_image.py`, plain white background,
  solid black silhouette, slouch hat / city clothes, no face detail, no text), cut out with `tools/prop_cut.py`-style masking into
  `public/img/props/sil_arnold.webp` etc. **Builder A makes all three** and the others wait for or reuse them (check the folder).
  Record them in `script/AI_IMAGES.md` (append only).
- **Money:** every converted figure as a `MoneyTag` (big today's figure, small 1872 figure: values in SCRIPT.md's money table).
- **The Con Card** pops in small at a lower corner for 3–4 s when a move is named (ch 2 rows 1–2, ch 4 row 3, ch 5 row 4, ch 6
  rows 5 and 6; earlier rows shown faint), full and checked off in ch 9's recap. Never over a document being read.
- **Source tag on every archival image** (from IMAGES.md); none on props, silhouette scenes or 3D pieces; never the word "AI".
- **Vocab** (`{braces}` in the script) gets a `Definition` card or a tape + note when defined: rough diamonds, the mark, claim /
  staking a claim, salting, shares, sell short, bank run.
- **Text never within 96 px of the frame edge:** `SAFE=96 node tools/probe_text.mjs ChNN` must report no overflow.
- **Anchors:** `python3 tools/anchors.py <stem> --src src/ch/ChNN.tsx` must show every phrase found, each repeat on the intended
  occurrence (use `nth`).
- Music stays as the skeleton sets it (a placeholder library bed); the user is making new cues.

## Test before you report
`npx tsc --noEmit -p .` (ignore errors in other builders' files), the anchor check, stills at every scene (look at each one; fix
overlaps, empty frames, unreadable text, a scene with nothing new for >8 s), the text probe. Make a labelled contact sheet of your
stills: `review/contact/chNN_v1.jpg` per chapter. Report in under 250 words: scenes and what's on screen, anything imperfect, any
asset you wished you had.
