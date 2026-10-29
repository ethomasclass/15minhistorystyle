# Handoff: Halloween video (Chunk History) · FINISHED

**Trick-or-Treating Was a Bribe: The Real History of Halloween** · 11:57 · 8 chapters · 1,822 words · Ellis (ElevenLabs voice clone)
**Branch:** `ccr-5f9195b0-0cknf0` in `ethomasclass/15minhistorystyle` · **Project folder:** `projects/Halloween_Bribe/`
**Status (Oct 28, 2026):** done and delivered. The user called it the best-quality video so far.

## Deliverables (all on the branch)
| What | File |
|---|---|
| 1080p master, −14 LUFS (Git LFS; verified byte-identical from GitHub) | `renders/Halloween_Bribe_1080p.mp4` |
| 720p | `renders/Halloween_Bribe_720p.mp4` |
| Two vertical Shorts, −14 LUFS (LFS) | `renders/shorts/Halloween_Bribe_Short1.mp4`, `…_Short2.mp4` |
| Thumbnails: main X2 (lead, gas-mask pumpkin), X3, H3; Short covers | `renders/thumbnails/final/*.jpg` (+ PNG) |
| YouTube text (title, description with show notes + sources + credits, tags, upload settings) | `review/YouTube_description.md` |
| Shorts text (titles, descriptions, hashtags, pinned comments) | `review/Shorts.md` |
| Script and research | `script/SCRIPT.md`, `research/FACT_CHECK.md`, `research/THUMBNAIL_*.md` |

## How it was built (for the next video)
- Scenes: `src/ch/Ch01–Ch08.tsx` on the template's `ChapterShell`; 3D set pieces in `src/fx/` (Headline, AtlanticMap, XRayScan, CandyPile,
  Corridor, EndScreen); props via `src/kit/prop.tsx`; silhouette parallax via `src/kit/silparallax.tsx`.
- Assets: archival in `public/img/chNN/` (`script/IMAGES.md`), AI props `public/img/props/` (`script/PROPS.md`), scene paintings
  `public/img/gen/scenes/` + depth layers `public/img/layers/sil/` (`script/GEMINI_PROMPTS.md`), music `public/music/` (`script/SUNO_PROMPTS.md`).
- Process: `script/BUILD_BRIEF.md` (one builder per chapter), `tools/render_ch.sh` + `tools/render_queue.sh` (render as chapters finish),
  `JOIN_ONLY=1 tools/render.sh` (join + master), `tools/feed_mock.py` (thumbnails in a mock feed).
- Shared library updated: `music/` (+5 `hb_` cues, 76 total), `brand/thumbnails/19_*`, `examples/19_Halloween_Bribe/`, `videos/README.md`.

## Notes for next time
- **Parallax rim fix:** faint outlines of foreground shapes showed on the planes behind them (user's note). Fixed in `tools/sil_layers.py`
  (`EDGE = 6`); the layers in this video predate the fix. See the skill's `references/images-and-masks.md` §9.
- **Gemini billing:** the AI Studio key returned HTTP 402 (Payment Required) on Oct 28; fix billing before generating new images.
- **Re-rendering a chapter:** `tools/render_ch.sh NN`, then `JOIN_ONLY=1 tools/render.sh`. The parallax layers need
  `DEPTH_MODEL=<Depth Anything V2 small onnx>` only when re-splitting a painting.
- Keys live in `.env` (git-ignored): `GEMINI_API_KEY`, `ELEVENLABS_API_KEY`, `VOICE_ID` (Ellis).
- If posted after 31 Oct 2026: the narration says "this Saturday" in ch01 and ch08 (it's evergreen enough; re-voice only if wanted).
