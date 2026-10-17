# The Exact Spot (Mexican-American War)

A 15 Minute History video, **14:45**, 10 chapters, for general viewers and for students (Lesson 2 · Day 2: *Texas, the War with
Mexico, and the Wilmot Proviso*).

| | |
|---|---|
| **Status** | **Finished.** Master and 720p copy rendered, thumbnails, YouTube text and the student viewing guide with its teacher key done. |
| **Video** | `renders/Exact_Spot_1080p.mp4` (upload this) and `renders/Exact_Spot_720p.mp4` (Git LFS) · chapter previews in `review/` |
| **Thumbnails** | `renders/thumbnails/Exact_Spot_A.png` … `_D.png` (D: "MEXICAN-AMERICAN WAR: WHO STARTED IT?") |
| **YouTube text** | [`review/YouTube_description.md`](review/YouTube_description.md) (title, description, chapters, tags, upload settings) |
| **Viewing guide** | Claude Doc with a Teacher Key tab: https://claude.ai/code/artifact/14da76ee-0ff6-4447-994b-8ca75586c15f (markdown copies in `examples/08_Exact_Spot/`) |
| **Script** | [`script/SCRIPT.md`](script/SCRIPT.md) · chapter files `script/ch01_cold_open.txt` … `script/ch10_poison.txt` |
| **Images** | Archival (credited in `public/img/credits.json`) + Flow wood engravings ([`script/FLOW_PROMPT.md`](script/FLOW_PROMPT.md)) |
| **Music** | [`script/MUSIC.md`](script/MUSIC.md) |
| **Masks** | `tools/mask.py` JOBS, then `tools/refine_mask.py` with the hand traces in [`tools/traces/`](tools/traces/README.md) |
| **Required content** | [`reference/lesson2_day2_card.png`](reference/lesson2_day2_card.png) |

Render everything with `tools/render.sh` (or `tools/render.sh 05` for one chapter; it re-joins and re-masters).

## Voicing

Needs `ELEVENLABS_API_KEY` and `VOICE_ID=mI4rIAStSQeKeqsz4FwM` (the channel's "Ellis" clone), either as environment variables in
the cloud environment's settings or in `.env` here (git ignores it). Then:

```sh
VOICE_MAX_PAUSE=0.25 VOICE_SENT_GAP=0 VOICE_PARA_GAP=0.35 VOICE_STRETCH=1.15 \
  python3 tools/voice.py script/tests/pronunciation.txt pronunciation_test
```

The chapters were voiced with these settings; the WAVs and word timings are in `public/audio/`.
