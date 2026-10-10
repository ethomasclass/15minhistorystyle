# Handoff: Say It Ain't So (Black Sox)

A 10:23 YouTube history video, *Say It Ain't So: Baseball's Gambling Problem Before the Black Sox* (1865–1921, with a
short coda on sports betting today), plus four vertical Shorts. This page says where everything is and how to change
or rebuild it.

**Branch:** `black-sox-video` on `ethomasclass/15minhistorystyle`. The project lives in `projects/Black_Sox/` (the
first video built inside the style repo instead of its own repo).

## Keys

Narration uses ElevenLabs. Its key belongs in `projects/Black_Sox/.env`, which git ignores:

```
ELEVENLABS_API_KEY=...
VOICE_ID=mI4rIAStSQeKeqsz4FwM   # the channel's narrator ("Ellis", the user's clone)
```

Rendering needs no keys: the voice, images and music are all committed. The ElevenLabs key was pasted into a chat
once, so rotate it in the ElevenLabs dashboard. The account is on the Starter plan (90,000 characters a month; 128 kbps
is its best API output).

## Where things are

| What | Where (in `projects/Black_Sox/`) |
|---|---|
| YouTube master, 1080p, −14 LUFS (Git LFS) | `renders/Say_It_Aint_So_1080p.mp4` |
| 720p copy (LFS) and 480p preview | `renders/Say_It_Aint_So_720p.mp4`, `review/Say_It_Aint_So_preview_480p.mp4` |
| Shorts 1–4, 1080×1920, −14 LUFS (LFS) | `renders/shorts/` |
| Thumbnails A/B/C (C chosen) | `renders/thumbnails/` |
| Title, description, chapters, tags | `review/YouTube_description.md` |
| Shorts titles and descriptions | `review/Shorts.md` |
| Script with timings, fact-check flags, sources | `script/SCRIPT.md` (and a readable PDF in `review/`) |
| Music plan, unused Flow prompts | `script/MUSIC.md`, `script/PROMPTS.md` |
| Narration text (one file per chapter) | `script/ch01_cold_open.txt` … `ch08_full_circle.txt` |
| Voice + word timings | `public/audio/chNN_*.wav` + `.words.json` |
| Archival images + credits (141) | `public/img/chNN/`, `public/img/credits.json`, `public/img/IMAGES.md` |
| Masks, parallax layers | `public/img/masks/`, `public/img/layers/` |
| Polymarket logo (white, split into mark and wordmark) | `public/img/ch01/polymarket_*_white.png` |

## How it's built

1. **Narration:** `tools/voice_all.sh` with `HEAVY="08"` (the ending chapter a little slower). `tools/voice.py` now reads
   1900s/2000s years and batting averages correctly.
2. **Look:** the channel kit, 30 fps, plus `src/kit/bs.tsx` (desk, drop cards, word-synced quotes, the BANNED ledger,
   the wall, the hand-drawn phone) and `src/kit/parallax.tsx` (2.5D for archival photos, with a crop that keeps the
   camera inside a glass negative's border, and any frame size).
3. **Masks and layers:** `tools/mask.py` (rembg; `u2net_human_seg` for white uniforms on light skies), then
   `tools/layers.py` (subject/background split from any mask; `LAYERS_MAX=4000` for a small crop of a big print) and
   `tools/mask_preview.py` to check outlines on a contact sheet.
4. **No AI images.** The gaps were filled with archival material, including a catcher masked out of the 1866 Currier &
   Ives Hoboken print (no photo of William Wansley survives).
5. **Render:** `tools/render.sh` (all) or `tools/render.sh 01 08` (re-render some, re-join, master). About 50 minutes
   for all eight chapters on this container.
6. **Shorts:** `src/vshorts.tsx`. Each Short splices hook-first lines out of the chapter WAVs (no new voice), relays the
   scenes in 9:16 and adds word-by-word captions and an end card. Render each with
   `npx remotion render src/index.ts VShortN out/shorts/vshortN.mp4` and master with `tools/master.py`.
   (`src/shorts.tsx` is the first, letterboxed attempt, kept for reference only.)
7. **Thumbnails:** `node tools/thumbs.mjs` renders A, B and C.

## Things to know

- **Re-check before publishing:** the Cleveland pitchers' case (jury selection was set for Nov. 2, 2026). The narration
  says "when this video was made", so it holds either way, but pin a comment if a verdict lands.
- The narration names no modern player and describes Polymarket only in its own and the league's terms; keep it that way
  in any edit (the user asked for this).
- `a_newsroom` plays in chapters 4 and 8; swap chapter 8's first half for `j_gossip` if that ever bothers anyone.
- The 720p was first committed before LFS tracking was added, so one older 82 MB copy sits in plain git history.
