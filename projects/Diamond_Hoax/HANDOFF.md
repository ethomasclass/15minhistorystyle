# Diamond Hoax: handoff (for a new conversation)

**Video:** *They Fooled America's Richest Men* (YouTube title) · on-screen title **PAID FOR DIRT** · *The Great Diamond Hoax of 1872* ·
Chunk History, stand-alone, entertainment (no series, no classroom unit). About **15:51 finished**, 9 chapters, 2,492 words.

**Repo:** `ethomasclass/15minhistorystyle`, project `projects/Diamond_Hoax/`. Everything is on branch
**`ccr-f5ce4d0d-w9hjm5`** (the default branch `ccr-fd9304cf-1jaldg` plus the Oct 31 Janin re-voice and end-screen commits). Use the
`15-minute-history` skill.

## Where it stands (Oct 31, 2026)

| Phase | Status |
|---|---|
| Packaging | **Done.** Thumbnail **H1** (`renders/thumbnails/Diamond_Hoax_H1.png`: the cousins from behind, fingers crossed and a pouch of stones, the tycoon in coral between them, tape PAID FOR / **DIRT**). Title "They Fooled America's Richest Men". Final full-res thumbnail render and YouTube text still to do. |
| Script | **Locked** (draft 10). `script/SCRIPT.md` has the arc, loop map, Con Card, money table, fact-check flags, sources. |
| Voice | **Done.** Ellis voice clone (`VOICE_ID` in `.env`), `eleven_v4`, one take per chapter, -18 LUFS; checked by speech-to-text (no cues spoken). "Janin" = JAN-in, now forced by `PRONOUNCE` in `tools/voice.py` ("Jannin"): the earlier ch 8/9 takes said "Janine", so **ch 8 and 9 were re-voiced on Oct 31** (Whisper and ElevenLabs STT both hear JAN-in; anchors pass). ch 9's closing line now points at the end screen: "…hit subscribe. And if you want more stories right now, there are two right here on the screen." Listening files: `review/janin_and_closing_check.mp3`, `review/ch08_ch09_revoiced.mp3`. `review/Diamond_Hoax_narration_preview.mp3` is rebuilt with the new ch 8/9. |
| Images | **Done.** 47 archival (`script/IMAGES.md`, `public/img/chNN/`, `credits.json`), 18 props + 3 silhouette figures + 11 silhouette scenes + the cold-open office (`script/AI_IMAGES.md`). Silhouette scenes split into 4 depth planes (`public/img/layers/sil/`). |
| 3D pieces | **Done.** `src/fx/` (Mesa on real terrain, LoopingRide, AnthillCutaway, GemOrigins, Dominoes, BankVault, ShareSlices, ShortSale, MoneyMap, ColdOpenDepth/ColdOpenReveal, MoneyTag). Test comps `FX-<id>`. |
| Chapters | **All 9 built** (`src/ch/Ch01.tsx`–`Ch09.tsx`, helpers in `src/ch/chNN/`). Anchors and the SAFE=96 text probe pass; reviewed on contact sheets `review/contact/chNN_v1.jpg`. |
| Render | **Done (Oct 31), 15:48.** `renders/Diamond_Hoax_1080p.mp4` (Git LFS, -14.2 LUFS, peak -1.1 dB) and `_720p.mp4`, chat preview `review/Diamond_Hoax_480p_preview.mp4`. Chapter starts: 0:00, 1:13, 2:40, 4:10, 5:20, 7:18, 8:34, 10:41, 13:19. Waiting on the user's watch-through. |
| Music | **Placed (Oct 31).** All 8 Suno cues are in `public/music/`, measured in `CUE_LUFS`, and set in every chapter; the ch 8 drop and ch 9 reprise are in. Exact placement: "As placed" in `script/SUNO_PROMPTS.md`. The user heard the mix and moved the waltz out of ch 3. `review/Diamond_Hoax_music_mix.mp3` is the finished video's audio. |
| Shorts | **Done (Oct 31), not yet posted.** Four native vertical Shorts cut from the video's own narration, art and music (`src/vshorts.tsx`, `VShort1`-`VShort4`), 54-59 s: `renders/shorts/Diamond_Hoax_Short1-4.mp4` (LFS) with cover PNGs, 720p previews in `review/shorts/`, titles and text in `review/Shorts.md`. Frame 0 is the cover. 3D pieces draw on a clear canvas through `BareStageCtx` in `fx/terrain/drawn3d.tsx`. |
| Sound effects | **Turned down (Oct 31, the user's note on the first mix).** All desk levels live in `SFX_TRIM` in `src/kit/common.tsx`: page turns and the paper sound on cuts (`whoosh`) are off (the user compared off and faint on ch 2 and chose off), the logo sounds stop before their page turns (`ChunkIntro.tsx`), and pencil, highlight, tick and rustle sounds are 8-16 dB down. Knocks and the title's tape pull are unchanged. |

## Next steps, in order

1. **Done (Oct 31): the Suno cues.** See the Music row. A cue change only needs its chapter's `music` prop and the mix check; ch 1's
   bed is set in `Ch01.tsx`'s `<Audio>`, not ChapterShell.
2. **Done (Oct 31): the full render.** A fix to one chapter needs only `tools/render.sh NN`, which rejoins and remasters.
3. **Packaging:** final thumbnail render (H1 at 1080p), `review/YouTube_description.md` (title, description with chapters from the real
   render, 5–8 tags, `tools/youtube_check.py`: title ≤ 60). Never mention AI in the description; tick the altered-content box.
4. **Offer Shorts** (`references/shorts.md`) and add the video to the style repo catalog (`videos/README.md`, `brand/thumbnails/`,
   `examples/`, look book).

## Known rough spots (fix during the render pass if they show)

- ch 2/3: Ralston's mask clips his right shoulder; the claim notice is on screen ~4 s.
- ch 4/5: the sheets predate the coral-prop fix (props are now a see-through coral, not flat red); the Mesa appears five times in ch 5.
- ch 7: King's mask catches a bit of his chair arm; the stick prop half-covers the "STICK HOLE" label; Arnold's figure on the map is small.
- ch 5: at about 1:27 into the chapter, teal "worth more" runs over the coral share card and "Janin's report" touches its corner.
- ch 8/9: the "empty" pouch still looks full (an empty-pouch prop would fix it); the dominoes' fall finishes in ~1.5 s; the bay holds
  only ~1 s after "nobody knows if it was an accident"; the 1873 tape slightly overlaps a print corner.
- Gaps with no archival picture: the 1875 run itself (silhouette `sil_bank_line` stands in), a younger Tiffany (the 1893 engraving is
  used), Arnold/Slack/Janin (silhouette figures, labelled "no reliable photo").

## Rules this video added (already in the skill and `videos/README.md`)

Packaging first (step 1b) · the thumbnail opens the video as a **reveal** (`ColdOpenReveal`) · subscribe plug right after the climax
(~80%), short and cheeky · money in today's dollars (×27 for 1872) with the period figure under it · titles ≤ 60 characters, 5–8 tags ·
silhouette scenes with a palette per mood; check every Gemini landscape for the wrong country and painted lettering · coral props are a
see-through tint, never a flat block · no cream or white mounts on the desk. The new techniques are written up in
`techniques/README.md` ("From the Diamond Hoax") and the code is in `techniques/components/diamond_hoax/`.

## Keys and machine notes

- `.env` (gitignored, never commit or print): `GEMINI_API_KEY`, `ELEVENLABS_API_KEY`, `VOICE_ID`. Both keys were pasted in chat:
  **suggest the user rotates them.**
- Python: `pip install pillow numpy imageio-ffmpeg rembg onnxruntime opencv-python-headless piper-tts`; depth model at
  `~/models/da2_small.onnx` (huggingface `onnx-community/depth-anything-v2-small`, `onnx/model.onnx`) for `tools/sil_layers.py`.
- The session's git connection can push commits but **cannot delete branches or push tags**. 14 old branches are fully merged and
  can be deleted by the user on GitHub (list in the conversation; `claude/shorts-skill` and `claude/vibrant-hamilton-7x33e4` hold only
  old history).
- Cloud sessions: background shell jobs stop after 30 minutes; a full chapter render with the 3D pieces takes ~20 min there (ch 1
  rendered in time). On a local PC this limit doesn't apply.

## Running on a local PC (Oct 31: the user is moving production to their own machine for faster renders)

1. Install Node 20+, Python 3.10+, ffmpeg and Git LFS (`git lfs install`). On Windows, run the `tools/*.sh` scripts in WSL (best) or Git Bash.
2. `git clone https://github.com/ethomasclass/15minhistorystyle && cd 15minhistorystyle && git checkout ccr-f5ce4d0d-w9hjm5`
3. `cd projects/Diamond_Hoax && npm install` and `pip install pillow numpy imageio-ffmpeg` (add `faster-whisper` for the
   speech-to-text checks; the image tools above only if images change).
4. Create `projects/Diamond_Hoax/.env` with `ELEVENLABS_API_KEY=` and `VOICE_ID=mI4rIAStSQeKeqsz4FwM` (Ellis), plus `GEMINI_API_KEY=` if needed.
5. Start Claude Code in the repo folder and say: "Read projects/Diamond_Hoax/HANDOFF.md and continue."
6. Renders: `tools/render.sh` finds Remotion's own browser when `/opt/pw-browsers` is absent. Concurrency is already automatic
   (`remotion.config.ts`); `npx remotion benchmark` shows whether a fixed value is faster on that machine.

### The Windows PC (set up Oct 31)

i5-12400F, 32 GB, RX 580; Node 24, Python 3.14, ffmpeg 9, Git LFS; no WSL and no `gh`, so `tools/*.sh` run in Git Bash. The repo is cloned
straight into `Videos/Chunk Production/Diamond Hoax/`.

- **Speed:** 600 frames of ch 5 take 22 s with the GPU (`--gl=angle`, now the Windows default in `remotion.config.ts`) against 85 s in
  software, about 27 fps. Concurrency makes almost no difference at 3-8, so it stays automatic. `tools/stills.mjs` uses the API, which
  doesn't read that config, so its stills still draw in software; the frames compared the same.
- **Audio-only check:** `npx remotion render src/index.ts ChNN out/mix/chNN.wav --codec=wav` mixes a chapter without any video: 5 min
  for all 9 with the GPU default, 27 min without it.
- **Full render:** about 20 min for all 9 chapters, then about 7 min to master.
- **Rendering alongside `render.sh`:** it deletes every Remotion bundle in temp between chapters, which kills a second render (404s on
  images). Give the second one its own bundle: `npx remotion bundle src/index.ts --out-dir=out/bundle3`, then render `out/bundle3`.
- **Windows fixes:** `kit/con.tsx` became `conCard.tsx` (CON is a reserved name, so the repo could not check out); `*.sh` are pinned to LF
  in `.gitattributes`; `render.sh` and `voice_all.sh` fall back to `python` because `python3` is only a Store stub here, and
  `render.sh` writes a Windows path to the join list. The join step was tested; a full `render.sh` has not been run here yet.
