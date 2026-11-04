---
name: 15-minute-history
description: Produce a "15 Minute History" YouTube explainer video in the channel's established style (field-notebook look, ElevenLabs voice clone, Remotion), end to end, from topic to upload. It covers the narration script, pronunciation check, voicing, archival images and Gemini painting prompts, coral-tint/teal-trace masks, scenes timed to the narration's words, render and master, previews, thumbnail, SEO'd YouTube title/description/tags, and a student note-taking handout. Use this whenever the user wants a new history video or explainer for their channel, mentions 15 Minute History, or asks for any one piece of it (a script in their style, scenes, a re-render, a thumbnail, YouTube text, a viewing guide for a video), even if they don't name the channel.
---

# 15 Minute History videos

The channel is now called **Chunk History** (Oct 2026; brand files in the style repo's `brand/chunk-history/`, the intro and
chapter breaks in the template's `src/kit/ChunkIntro.tsx`). The user makes ~15-minute U.S. history explainers for a general audience and for their own students (APUSH and
U.S. History). Earlier videos, oldest first: *Fix Everything: America's Reform Era*, the Ambrose Bierce video, *King
Andrew: How the People's President Got a Crown* (the source of this skill's template), *Grip Tighter: Slavery and
the Cotton South*, and *Good Luck* (the Ouija board); the full list is in the style repo's `videos/README.md`, and the newest
pattern to follow is *The Balloon War* v2 (Nov 2026: the story-arc script, silhouette scenes, drawn 3D pieces). The look:
black-and-white archival images on a dark desk, one figure tinted coral and traced in teal, orange torn-tape
titles, teal handwritten notes, graphics stepping at 12 fps, hard cuts, film grain. The voice: the user's own
ElevenLabs voice clone, plain and a little wry.

This skill carries a working starter project (`assets/template/`): the visual kit, the tools, fonts, sound
effects, the channel intro and logo break, the title sting, an 1836 map, charts, and two example chapters. Start
every new video from it so the style matches exactly.

## The style repo around this skill

This skill lives in the user's style repo, `ethomasclass/15minhistorystyle`, at `.claude/skills/15-minute-history/`.
The repo root (`<this-skill>/../../..`) holds the channel's shared materials. Use them before making anything new:

| Folder | What's there | Use it when |
|---|---|---|
| `music/` | Every music cue made so far (81), with prompts, length, loudness and where each was used | Planning `MUSIC.md`: reuse first |
| `sfx/` | Every sound effect, with volumes | A scene needs a sound the template doesn't ship |
| `brand/` | Logo files, palette, fonts, every past thumbnail (the chosen ones marked) | Thumbnails, channel art, anything outside a video |
| `techniques/` | Every on-screen technique by purpose, look books of each video, and `components/` code not yet in the template | Planning scenes; reaching for something new |
| `videos/` | The catalog of past videos and **the user's standing preferences** | Before writing a script or building scenes |
| `examples/` | Each video's SCRIPT.md, prompts, MUSIC.md, YouTube text, handoff | A model to follow for any document |

If the skill is running from somewhere else (copied into another repo), those folders are not next to it. Ask the
user to attach `ethomasclass/15minhistorystyle` to the session. When a video finishes, offer to add its new cues,
sounds, thumbnail, look book and documents to the style repo, so the next video can start from them.

## The workflow

Each phase ends at a **checkpoint**: show the user the result and wait for their go-ahead before spending money
(voice credits) or hours (renders). The user steers in short messages; take each note literally and apply it
everywhere it applies.

| # | Phase | You produce | Read |
|---|---|---|---|
| 1 | **Set up** | new project from the template | below |
| 1b | **Packaging first** (before the script) | the core concept in one line; 4–6 thumbnail concepts and 3–5 titles ("would I click at 11 PM?"), checked against the archival images that exist; the user picks 2–3 to mock up. The winner sets the cold open: what the thumbnail shows is on screen at frame 0 | `references/thumbnail-and-youtube.md` |
| 2 | **Script** | one story on the hook / four-act arc, braided through 3–5 real main characters on both sides (draft 1 the arc → 2 the characters → 3 cut to time); a header stating core concept, driving question + answer, long loops, midpoint and climax twists, ending device; the danger named in the cold open → `script/SCRIPT.md` + one `chNN_slug.txt` per chapter | `references/script-writing.md` §1, `references/explainer-craft.md` |
| 3 | **Content review** | answers to "are we missing anything?", cuts to ~15 min, fact-check flags | `references/script-writing.md` |
| 4 | **Pronunciation check** | respellings + a test MP3 for the user | `references/voice-and-audio.md` |
| 5 | **Voice** | chapter WAVs + word timings (no whisper tags; `tools/quiet_check.py` on every take), a narration preview MP3 | `references/voice-and-audio.md` |
| 6 | **Images** | archival images with credits; for the gaps, silhouette scenes from one ordered Flow prompt (`FLOW_PROMPT.md`) → fixes → `upscale_all.sh` → `sil_palette.py` → `sil_regions.py` → `sil_stress.py`; props (`prop_cut.py` / `prop_cut_black.py`); masks | `references/images-and-masks.md` §11 |
| 7 | **Scenes** | `src/ch/ChNN.tsx` per chapter (parallel builders from one `BUILD_BRIEF.md`; 3D pieces in `src/fx/`), checked with stills (`glstills.mjs` for WebGL), a contact sheet per chapter, `anchors.py` + `beatscope.py`, the 96 px text probe | `references/building-scenes.md`, `references/visual-style.md`, `references/explainer-craft.md` §3–6 |
| 8 | **Render** | chapters as they finish (`render_ch.sh` / `render_queue.sh` in batches under 2 h), then `JOIN_ONLY=1 tools/render.sh`: 1080p master, 720p, a <30 MB preview for the user | `references/render-and-deliver.md` |
| 9 | **Feedback rounds** | batched fixes, partial re-renders, new previews | `references/render-and-deliver.md` |
| 10 | **Package** | final thumbnail render (from the 1b concept; faces work, thumbnail-only ink art, `Big` type), YouTube title/description/tags, 1080p via Git LFS | `references/thumbnail-and-youtube.md` |
| 11 | **Classroom** (if asked) | a simple note-taking handout | `references/classroom-handout.md` |
| 12 | **Shorts** | 3–4 native vertical Shorts from the video's own narration and assets, plus their text | `references/shorts.md` |

Phases 6 and 7 overlap with 5: scenes can be built on placeholder timings (`tools/fake_voice.py`) while the user
reviews the script or makes Gemini images, and the real voice re-times them automatically.

## 1. Set up

```sh
sh <this-skill>/scripts/new_project.sh video "<Slug_For_Files>"   # e.g. video King_Andrew
cd video
```

This copies the template, writes placeholder narration for the example chapters, and runs `npm install`. Then
edit `src/project.ts` (title, subtitle, dates, intro cards, thumbnail portrait), and preview with
`npx remotion studio` or `node tools/stills.mjs Ch01 out/stills 3 9`. The two example chapters show the
patterns (cold open + the channel intro, which carries the title; map, vocab, quote and two-views scenes); replace their scripts and
scenes with the real ones, and delete `public/img/demo/` once the video has its own images.

Python tools need `pip install pillow numpy imageio-ffmpeg` (and `rembg onnxruntime opencv-python-headless` for
masks; `scipy` for `sil_regions.py`; the Real-ESRGAN ONNX model in `~/models/` for `upscale.py`, see its docstring). Keys go in `.env` (see `.env.example`), never in chat or git.

Project layout:

```
script/      chNN_slug.txt per chapter, SCRIPT.md, GEMINI_PROMPTS.md or FLOW_PROMPT.md (silhouette scenes), MUSIC.md, BUILD_BRIEF.md
src/         project.ts (per-video settings), chapters.ts, masks.ts, Thumbnail.tsx, Brand.tsx (logo stills), ch/ChNN.tsx,
             kit/ (shared look, maps incl. the 3D map map3d.tsx, engraving.tsx, parallax.tsx, silparallax.tsx (SilScene: silhouette
             scenes in multi-plane parallax), print.tsx (Print, NoPhoto), prop.tsx (Prop), charts, vox.tsx (tilted page,
             swipe, spotlight, tear, word match cut, paper-slip notes), board.tsx (the collage board), ChunkIntro.tsx (the Chunk
             History intro + the mark-snap chapter break), shots.tsx (gentle shot transitions), levels.ts (bed(): music 13 LU
             under the voice)), fx/ (drawn three.js pieces: kit3d.tsx, mapgeo.tsx, terrain.tsx, registry.tsx of FX-<id> tests), lib/
public/      audio/ (narration + timings), img/ (archival by chapter, gen/ for AI, masks/, maps/), music/, sfx/, fonts/
tools/       voice.py (runs level_voice.py: narration to -18 LUFS), voice_all.sh, level_voice.py, fake_voice.py, beatcheck.py (do the
             payoff lines get a breath?), pause.py (a dramatic pause before a phrase), anchors.py, mask.py, mask_preview.py, layers.py, trace.py, find_images.py, stills.mjs,
             sheet.py, probe_text.mjs, render.sh, master.py, frames_sheet.py, thumbs.mjs, youtube_check.py, script_pdf.py, music_eleven.py,
             sfx_eleven.py, brand.mjs, refine_mask.py + traces/ (hand-traced masks), mask_closeup.py, trace_grid.py, text_lines.py,
             weather.py (halftone + paper ageing), phrase_find.py + word_hunt.py (LOC newspapers), jukebox.py (LOC period recordings),
             music_acestep.py (local text-to-music), crease.py, halftone.py, silhouette.py, distress.py, scratch_voice.py,
             mono_depth.py + stereo_depth.py + prep_stereo.py (stereograph move), quiet_check.py (no whispers), beatscope.py (beats
             outside their scene), render_ch.sh + render_queue.sh (chapter renders), glstills.mjs (WebGL stills), sync_script_md.py,
             silhouette scenes: upscale.py + upscale_all.sh, sil_palette.py, sil_solidify.py, sil_regions.py, sil_stress.py
             (sil_layers.py: the older depth split), props: gemini_image.py, prop_cut.py, prop_cut_black.py; geo_bake.py (coastlines
             and heightmaps for 3D)
review/      YouTube_description.md and anything else for the user
renders/     720p video, thumbnails, (LFS) 1080p master
```

## Principles that hold across phases

- **Easy to follow comes first.** Write for a general audience: one name per thing, every term defined where it
  appears, numbers in pairs, callbacks said out loud. Run `references/explainer-craft.md`'s script checklist and its
  confusion pass on every draft. (It borrows what Vox explainers do well; it does not restyle the channel.)

- **The script drives everything.** Scenes are timed to spoken words, not seconds, so a re-voice re-times the
  video. Lock the script before voicing; a later wording change means re-voicing that chapter and re-checking its
  anchors.
- **Objective, evidence-first, both sides.** No historian names, no modern politicians, no false continuity with
  today's parties or institutions. Say who was left out of "the people."
- **Archival first.** Real people only from period images. AI paintings only for gaps, never showing a
  recognizable real person, all sharing one style paragraph. The current gap style is **silhouette scenes in one locked channel
  palette** (ink, teal-slate haze, cream light, coral only on the subject; figures one solid black shape; full-frame parallax),
  split by colour and region, never by depth (`references/images-and-masks.md` §11). **Ask before writing AI prompts**: some videos use none
  (*Grip Tighter*, *Say It Ain't So*); an engraving detail, a period document or a drawn diagram can fill a gap.
  Before photography, AI gaps are period **wood engravings** from one master prompt (*The Exact Spot*). Search anywhere
  for archival images (LOC, Internet Archive books, museums), not just Wikimedia.
- **Check every mask at full resolution** (`tools/mask_closeup.py`) and fix rough ones with `tools/refine_mask.py` and
  hand traces (images-and-masks.md §6). If a picture can be misread, draw the event instead.
- **Cut-outs on the notebook.** Every photo sits on the dark ruled paper, its subject cut out (`Cut`) or, with no
  single subject, as a print on the black desk (`Print`). Never full-screen slow pushes, 3D photo fly-throughs or color photos.
- **One subject in color per image, a source tag on every image, text never off the frame edge.** Run the text
  probe on every chapter before each render the user will see.
- **Check your own work visually before the user does**: contact sheets of stills, the text-edge probe, the
  anchor check, frames pulled from the finished render. Report what you checked and anything still imperfect.
- **Respect real victims.** No silhouettes or illustrations of them, no coral and the QUIET palette in the heavy chapter, and no
  screaming or victim faces on the thumbnail (`references/visual-style.md` §2.5).
- **Silent cuts.** No whoosh, page-turn or paper sounds (`Sfx` mutes them); the writing sound nearly silent; sound effects only for
  things on screen.
- **Spend carefully.** Voice and music cost credits (responses are cached); renders cost time. Re-voice and
  re-render only what changed.
- **Deliver where the user can open it.** Chat attachments max out at 30 MB (send a 480p preview); the 1080p
  master goes on the branch through Git LFS, verified by a fresh clone.
- **Commit as you go** on the working branch: scripts, audio, images, masks, code, the 720p. Never commit `.env`,
  `node_modules/` or `out/`.

## When the user asks for only one piece

- "Write a script about X": phases 2–3 only; SCRIPT.md plus chapter files, ending with the fact-check flags and an
  offer to run the pronunciation check.
- "Make a thumbnail": `src/Thumbnail.tsx` + `tools/thumbs.mjs`; show two or three concepts.
- "Logo / channel art / banner / watermark": the style repo's `brand/logo/` has them. For a new size, add an entry to
  `BRAND` in `src/Brand.tsx` and run `node tools/brand.mjs out/brand`.
- "YouTube description / tags": `references/thumbnail-and-youtube.md`, timestamps from the real render, then
  `python3 tools/youtube_check.py`.
- "Handout / viewing guide / questions for the video": `references/classroom-handout.md`. Keep it simple.
- "Make Shorts": `references/shorts.md`. Native vertical, hook first, only the video's own assets.
- "Plan a series" / "a multi-part video": `references/script-writing.md` §10 (one arc every episode follows, a unit question,
  a recurring card, hinge years, a callback table). Worked example: `projects/American_West/SERIES.md` and its episode outlines
  in the style repo; `projects/Reconstruction/` for a series built around the collage board.
- "Music for a new video": reuse the library first; for new cues give the user a copy-paste Suno doc like
  `projects/American_West/SUNO_PROMPTS.md` (style + tempo, structure tags, minimum lengths); levels with `bed()`.
- "Send me the script" / "a readable file": `python3 tools/script_pdf.py "<Title>" "<Subtitle>" review/<Slug>_script.pdf`.
- Working inside an existing video project (not the template): the same kit lives under `src/v3/` or `src/jh/`
  there; read that project's `HANDOFF.md` or `README.md` first and follow its paths.
