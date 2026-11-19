# Build brief: Thanksgiving food video ("From Eels to This")

You are building Remotion scenes for one or two chapters of a Chunk History video. Project: `projects/Thanksgiving/video/` (made from the skill template). Narration timings are **placeholders** (`tools/fake_voice.py`) until the user picks a voice; build to the words, never to seconds, so a re-voice re-times everything.

## Read first
- The skill: `.claude/skills/15-minute-history/SKILL.md`, `references/building-scenes.md` (all of it), `references/visual-style.md`, `references/explainer-craft.md` §3–4.
- The style repo's standing preferences: `videos/README.md` → "Your standing preferences" (Picture section).
- This video: `projects/Thanksgiving/script/SCRIPT.md` (the script), `projects/Thanksgiving/IMAGE_PRESENTATION.md` (presentation modes, the per-chapter plan, the decisions on full-screen pans and colour, the inflating turkey), `projects/Thanksgiving/FLOW_CUTOUT_PROMPTS.md` (what each Flow asset is for), `projects/Thanksgiving/script/MUSIC.md`, `projects/Thanksgiving/script/VOICE_NOTES.md` (the deadpan beats; give each punchline a held picture).
- The template's `src/ch/Ch01.tsx` and `Ch02.tsx` show the patterns.

## Video-specific decisions (these override the template where they differ)
- **Tone: light and deadpan.** The picture plays it straight; the joke is the held frame after the punchline (no comic zooms, no wobble on punchlines).
- **Full-screen pans are allowed in this video** (the user, Nov 2026), on documents and ads only: a slow guided pan that lands on the quoted line as it is spoken, or a pan-to-reveal; each ends on a held frame or a hard cut. Never two pans in a row; at most 1–2 per chapter. Otherwise the cut-out and print rules hold.
- **Colour is OK in the right places:** the 1950s ads and dishes, the Flow food props, and the cranberry. Archival photos and engravings stay black and white with one coral subject.
- **Running joke "MOCK":** an orange torn-tape "MOCK" slapped on the fake each time the narration says "Mock turtle" (ch4), "Mock aspic" (ch6), "Mock homemade" (ch7).
- **The collage board:** one pin per chapter (the eel, the turtle, the calf's head, Hale, the Jell-O mould, the can, the turkey), teal yarn with *but* / *therefore* tags; the ending pulls back to the whole board (`src/kit/board.tsx`, `techniques/collage_board.md` in the style repo).
- **Silent cuts**, no whoosh or paper sounds; sound only for things on screen.

## Assets available now (in `public/`)
- `img/flow/eel/eel_0000…0047.png`: the wriggling eel cut-out, 48 RGBA drawings at 12 per second (loop them). The cold open's frame 0.
- `img/flow/cran/cran_cut1…6.png`: the cranberry stop-motion cut-outs (RGBA). See `projects/Thanksgiving/tests/cran_cut.py` for the alignment (plate bottom-centre, the can cropped at the frame's right edge).
- `img/flow/*.jpg`: Flow tests (`tg_eel`, `tg_hand_card_R`, `tg_hand_place_R` are usable; `tg_calf_head`, `d1_sky`, `tg_cran_1` are rejected drafts, so don't use them).
- `img/arch/`: archival scans so far: the Simmons 1796 turtle pages and minced pies, the 1884 *Boston Cook Book* mock turtle soup, the 1920 Jell-O booklet cover and page, a USDA ARS turkey photo. Credits: `projects/Thanksgiving/img/CREDITS.md` if present; otherwise note the source in the tag from the file name.
- More archival images are being sourced in parallel and will land in `projects/Thanksgiving/img/<chapter>/` with `CREDITS.md`.

## Missing assets: use labelled placeholders
For anything not here yet (Winslow's portrait and letter, Massasoit-era imagery, Hale's portrait, *Northwood*, her letter to Lincoln, the proclamation, Godey's, aspic moulds, Knox, Perfection Salad, the 1955 ad, the Angelus booklet, Ocean Spray, the Campbell's kitchen, Butterball, the morphs, the dioramas, the turkey cut-outs and scale), build the scene with a **placeholder card**: a plain dark rectangle the right size and position, with the intended file name in mono type (e.g. `PLACEHOLDER: img/arch/hale_portrait.jpg`). Put every placeholder in a `PLACEHOLDERS` list exported from the chapter file so they can be swapped later. The scene's motion, timing and marks should be fully built around it.

## The deliverable per chapter
1. `src/ch/ChNN.tsx` exporting `ChNN` and `CHNN_FRAMES`, using `script/chNN_<slug>.txt` / `public/audio/chNN_<slug>.words.json`. Ch01 keeps the template's cold open, then the one-second beat, then `ChannelIntro` shape.
2. Music from `public/music/` (copy the cues from `projects/Thanksgiving/music/` and levels with `bed()`; MUSIC.md lists which; the two gaps use library stand-ins from the style repo's `music/cues/`: `g_world_outside` for ch2, `rc_parlor` for ch4).
3. Checks (building-scenes §7): `python3 tools/anchors.py chNN_<slug> --src src/ch/ChNN.tsx` passes; stills with `node tools/stills.mjs ChNN out/stills_chNN 3 9` and a contact sheet (`tools/sheet.py`); the 96 px text probe (`tools/probe_text.mjs`); `beatscope.py`. Look at your stills yourself and fix what's wrong.
4. **Don't edit `src/chapters.ts`, `src/masks.ts` or shared kit files**: write your mask entries to `src/masks_chNN.ts` and any new kit piece to `src/kit/tg_<name>.tsx`. The lead registers chapters.
5. Don't render full videos. Don't commit. Report: the scene list (each with its anchor phrase), the placeholders, anything you couldn't do, and the contact sheet path.
