# Handoff: Dressed to Kill

A 9:40 YouTube history video, *Dressed to Kill: How Arsenic Green Took Over the 1800s* (1775–1900), made for Halloween.
The project lives in `projects/Dressed_To_Kill/` on branch `claude/laughing-gates-j5en30` of `ethomasclass/15minhistorystyle`.

## Keys

Narration uses ElevenLabs (`ELEVENLABS_API_KEY`, `VOICE_ID=mI4rIAStSQeKeqsz4FwM`, "Ellis") in `projects/Dressed_To_Kill/.env`,
which git ignores. Rendering needs no keys. The key was pasted into a chat once: rotate it in the ElevenLabs dashboard.

## Where things are (in `projects/Dressed_To_Kill/`)

| What | Where |
|---|---|
| YouTube master, 1080p, −14 LUFS (Git LFS) | `renders/Dressed_To_Kill_1080p.mp4` |
| 720p copy and 480p preview | `renders/Dressed_To_Kill_720p.mp4`, `review/Dressed_To_Kill_preview_480p.mp4` |
| Thumbnails A/B/C (Test & Compare) | `renders/thumbnails/` |
| Title options, description, chapters, tags, upload settings | `review/YouTube_description.md` |
| Script with fact-check flags and changes per draft | `script/SCRIPT.md` (PDF in `review/`) |
| Scene brief for the four build agents | `script/SCENES.md` |
| Music plan, silhouette prompts (single and one-upload) | `script/MUSIC.md`, `script/GEMINI_PROMPTS.md`, `script/flow_all_prompts.txt` |
| Research (history, U.S. angle, images, YouTube strategy, fact-check round 2, retention) | `research/` |
| Narration text, voice, word timings | `script/chNN_*.txt`, `public/audio/chNN_*.wav` + `.words.json` |
| Archival images (190) + credits; silhouettes | `public/img/chNN/`, `public/img/credits.json`, `public/img/IMAGES.md`; `public/img/gen/` |
| Masks, parallax layers | `public/img/masks/`, `public/img/layers/` (library, Matilda and workshop deliberately have none) |
| Video-specific kit | `src/kit/dk.tsx` (GREEN, Sil, Doc + swipe, Swatch), `src/kit/waltz.tsx` (the shared Waltz shot) |

## Rebuild or change

- Re-voice one chapter: see the skill's `voice-and-audio.md` §5 (respellings are in `tools/voice.py` `PRONOUNCE`).
- Re-render: `tools/render.sh 03 07` (only those chapters), or `JOIN_ONLY=1 tools/render.sh` to rejoin and master.
- Python needs `pillow numpy imageio-ffmpeg` (and `rembg onnxruntime opencv-python-headless` for masks/layers).
