# Handoff: Good Luck (Ouija)

A 9:48 YouTube history video: how the Ouija board went from a date-night game to a horror villain. This page says where everything is and how to change or rebuild it.

**Branch:** `ccr-6addf590-j2w0xz` on `ethomasclass/Ouija`

## Keys

Narration uses ElevenLabs. Its key belongs in `video/.env`, which git ignores:

```
ELEVENLABS_API_KEY=...
VOICE_ID=mI4rIAStSQeKeqsz4FwM   # the channel's narrator (same as Fix Everything, Grip Tighter, Ambrose)
```

Rendering needs no keys: the voice, images and music are all committed. The ElevenLabs key was pasted into a chat once, so rotate it in the ElevenLabs dashboard.

## Where things are

| What | Where |
|---|---|
| YouTube master, 1080p, −14 LUFS | `review/master/` (three parts; join them as its README explains) |
| 720p copy and 480p preview | `review/full/` |
| Thumbnail | `review/Thumbnail_Good_Luck.png` |
| Earlier production test | `review/Production_Test*.mp4`, `TEST_SCENE.md` |
| Title, description, chapters, tags | `review/YouTube_description.md` |
| Script with timings, fact-check flags, sources | `SCRIPT.md` |
| Production plan / prompts / music plan | `PRODUCTION.md`, `PROMPTS.md`, `MUSIC.md` |
| Narration text (one file per chapter) | `video/script/ch01_cold_open.txt` … `ch09_who_moves_it.txt` |
| Voice + word timings | `video/public/audio/chNN_*.wav` + `.words.json` |
| Gemini paintings, layers, masks | `video/public/img/gen/`, `gen/layers/`, `video/public/img/masks/` |
| Archival images + credits | `video/public/img/arch/` (`credits.json`, `MISSING.md`) |
| Music (all reused from earlier videos) | `video/public/music/` (prefix = source video; see `MUSIC.md`) |

## How it's built

1. **Narration:** `tools/voice_all.sh` (ElevenLabs v3, Ambrose pace; chapters 6 and 9 slower). Every scene is keyed to a spoken phrase (`t.at('phrase')`), so re-voicing re-times the video.
2. **Look:** the channel kit (`src/kit/Kit.tsx`, `shell.tsx`, `Intro.tsx`, `LogoBreak.tsx`) at **24 fps with drawn marks stepping every 2 frames**, plus the Ouija additions in `src/kit/oj.tsx`:
   - `Layered`: a Gemini painting as a 2.5D scene, with one living detail (flicker, dust, snow, steam, beam).
   - `Desk`, `DropCard`: the black-desk style, with cards that land with weight.
   - `SyncQuote`: quotes word by word with the voice.
   - `SrcView`: a camera over a document.
   - `Bands`, `HBars`, `CountUp`.
3. **3D board:** `src/kit/board3d.tsx` (`@remotion/three`). Its texture is the `BoardTexture` composition, matched to the painted board. `spell('WORD', frame)` sends the planchette to letters; `ChapterTitle` opens chapters 2–5, 7 and 8.
4. **Layers and masks:** `tools/trace.py fromfile` turns a Gemini magenta mask pass into masks and outlines; `tools/gen_layers.py` cuts subject and background layers.
5. **Render:** `tools/render.sh` renders every chapter, joins them, and masters to −14 LUFS (`tools/master.py`). It uses `--gl=angle`, which is about 7× faster than swangle on cloud machines, with identical frames. A full render takes roughly 1.5 hours on 4 cores. `tools/render.sh 03 05` re-renders only those chapters and re-joins.

## Setup

```sh
cd video
npm install
pip install pillow numpy scipy opencv-python-headless
export REMOTION_CHROME=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)
npx remotion studio            # preview any chapter
tools/render.sh                # full render + master → out/Good_Luck_Ouija_1080p.mp4
```

## Things to know

- **AI disclosure:** answer **Yes** when uploading. Paintings are labeled "Illustration" on screen.
- **Fair-use items deliberately not used:** *The Exorcist* stills and posters, and the 1949 *Washington Post* page. The film is represented by illustrations only.
- **Script change from the plan:** the on-screen 1891 ad says $1.49, so the narration says "a dollar forty-nine."
- **Archival notes:** `video/public/img/arch/MISSING.md` lists what couldn't be found. No public-domain portrait of William Fuld exists, so chapter 3 uses the 1920 *Evening Star* article with his "I'm a Presbyterian" quote.
