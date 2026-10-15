# The Exact Spot (Mexican-American War)

A 15 Minute History video, about 13:50, for general viewers of all ages and for students (Lesson 2 · Day 2: *Texas, the War with
Mexico, and the Wilmot Proviso*).

| | |
|---|---|
| **Status** | Phase 4: pronunciation test written (`script/tests/pronunciation.txt`), waiting on an ElevenLabs key to voice it. Remotion project set up from the template (`src/`, `tools/`, `public/`); `npm install` not run yet. |
| **Script** | [`script/SCRIPT.md`](script/SCRIPT.md) (narration, production notes, cut list, pronunciation, fact-check flags, sources) · readable PDF in [`review/`](review/) |
| **Chapter files** | `script/ch01_cold_open.txt` … `script/ch10_poison.txt` (what gets voiced) |
| **Painting prompts** | [`script/GEMINI_PROMPTS.md`](script/GEMINI_PROMPTS.md) (19 images, 10 must-have) + the archival list |
| **Outline** | [`script/OUTLINE.md`](script/OUTLINE.md) (v1, superseded by the script) |
| **Required content** | [`reference/lesson2_day2_card.png`](reference/lesson2_day2_card.png) |

Next steps: pronunciation test MP3 → lock the script → voice → images (your Gemini PNGs into `public/img/gen/`) → scenes.

## Voicing

Needs `ELEVENLABS_API_KEY` and `VOICE_ID=mI4rIAStSQeKeqsz4FwM` (the channel's "Ellis" clone), either as environment variables in
the cloud environment's settings or in `.env` here (git ignores it). Then:

```sh
VOICE_MAX_PAUSE=0.25 VOICE_SENT_GAP=0 VOICE_PARA_GAP=0.35 VOICE_STRETCH=1.15 \
  python3 tools/voice.py script/tests/pronunciation.txt pronunciation_test
```

The placeholder narration in `public/audio/` (from `tools/fake_voice.py`) isn't committed; the real voice replaces it.
