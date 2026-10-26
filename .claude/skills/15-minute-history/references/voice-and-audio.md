# Voice, music and sound

## Contents
1. Keys and safety
2. Voicing the narration
3. Pace settings (locked)
4. Pronunciation
5. Re-voicing one chapter
6. Music
7. Sound effects

## 1. Keys and safety

New narration, music and sound effects need an ElevenLabs key; AI images need Gemini (the user runs those
prompts themselves). Keys live only in the project's `.env`, which git ignores:

```
ELEVENLABS_API_KEY=...
VOICE_ID=...          # the user's own ElevenLabs voice clone
GEMINI_API_KEY=...    # only if tools/trace.py paint is used
```

- **The channel's narrator is the user's own clone: `VOICE_ID=mI4rIAStSQeKeqsz4FwM` ("Ellis", an ElevenLabs cloned
  voice).** Use it for every video. The voice ID is not secret; the API key is. Check that the key reaches that voice
  before voicing (`GET /v1/voices/<id>` should return name "Ellis").
- **Quality:** model **`eleven_v4`**, the whole chapter in **one take**, speed 1.0, `similarity_boost` 0.85, 44.1 kHz
  (the user's pick in the West series, Oct 2026, over v3 and over v4 voiced paragraph by paragraph). The account is on the
  **Starter** plan, so the API's best output is `mp3_44100_128` (192 kbps needs Creator, PCM needs Pro). That is fine:
  the WAVs are mixed and mastered to −14 LUFS, and the preview MP3s are exported at 192 kbps.
- **Check the credit budget first** (`GET /v1/user/subscription`: `character_count` of `character_limit`). Starter is
  90,000 characters a month. A 10-minute script is about 10,000 characters, 15 minutes about 16,000. Only re-voice the
  chapters that changed. The cache makes re-runs with new pause settings free.
- **Years and numbers:** `spoken()` reads 1700s–1900s years as people say them ("nineteen nineteen", "nineteen oh-eight"),
  2010+ as "twenty twenty-six", 2000–2009 as "two thousand five", and batting averages (".375") as "three seventy-five".
  Before *Say It Ain't So* it read 1919 as "one thousand nine hundred nineteen", so check `spoken()` on any new number format.
- Never print, paste or commit a key, and don't put one in a chat reply. If `.env` is missing, ask the user to add
  it (or set the values in their environment settings); say which variable is missing.
- Rendering from committed audio needs no keys.
- Responses are cached in `public/audio/cache/` by request, so re-running with different pause settings costs
  nothing. Keep the cache out of git.

## 2. Voicing the narration

```sh
tools/voice_all.sh                     # every chapter at the locked pace
HEAVY="10 11" tools/voice_all.sh       # same, with chapters 10 and 11 slower (heavy chapter, ending)
tools/voice_all.sh 04 07               # only these chapters
```

Each chapter becomes `public/audio/chNN_slug.wav` + `chNN_slug.words.json` (word-level timings from ElevenLabs
forced alignment). Voice model: `eleven_v4`, one take per chapter (the defaults in `tools/voice.py`).

Before the real voice exists, `tools/scratch_voice.py script.txt NAME --model <piper .onnx>` makes a scratch narration
with real word timings (a local Piper voice), so scenes can be built and timed; every anchor re-times itself when the
ElevenLabs voice replaces it. Never ship it.

After voicing:
1. Make a narration preview the user can listen to straight through (join the WAVs with ffmpeg into one MP3,
   e.g. `script/<Slug>_narration_preview.mp3`) and send it.
2. Run `python3 tools/anchors.py <stem> --src src/ch/ChNN.tsx` for any chapter whose scenes already exist.
3. Commit the WAVs and words.json files (they are what the render uses).

**Delivery cues:** `[tags]` in the script (see `script-writing.md` §5) steer v4's delivery; they are never spoken or shown.

## 3. Pace settings

**Default since the West series: one take.** The whole chapter goes to ElevenLabs in a single request
(`VOICE_ONE_TAKE=1`, the default), so `eleven_v4` paces the paragraphs itself and nothing is cut or spliced. Normal
chapters run at `VOICE_SPEED=1.0` (about 165–170 words a minute including pauses); heavy chapters (`HEAVY=`) at 0.92.
The user heard clicks and odd breaks in the older spliced method; one take fixed them. If a pause needs to be longer,
mark it in the script rather than splicing.

**Older method (videos before the West series), `VOICE_ONE_TAKE=0`:** paragraph by paragraph on `eleven_v3`, with
these settings. `tools/voice.py` now cuts at the quietest point with short fades and room tone, so it no longer clicks.
**No speed-up** (the user, Oct 2026, Reconstruction): the voice plays at its own speed. The earlier `VOICE_STRETCH`
1.15 (and 1.08 for heavy chapters) changed the tempo and the user heard the pitch change too, so every chapter now runs at
`VOICE_STRETCH=1.0`, even if the video runs longer. Only the pauses are trimmed.

| Chapters | VOICE_STRETCH | VOICE_MAX_PAUSE | VOICE_SENT_GAP | VOICE_PARA_GAP |
|---|---|---|---|---|
| Normal | 1.0 | 0.25 | 0 | 0.35 |
| Heavy chapter and the ending (`HEAVY=`) | 1.0 | 0.35 | 0.05 | 0.55 |

`STRETCH` is a local tempo change (>1 is faster): leave it at 1.0. `MAX_PAUSE` shortens the voice's own pauses.
Re-voicing at a new stretch costs nothing: the ElevenLabs responses are cached by text and voice settings, and the
stretch is applied afterwards.

## 4. Pronunciation

Before voicing a whole video, run the pronunciation check in `script-writing.md` §8: put respellings in
`PRONOUNCE` in `tools/voice.py`, voice a short test file, and send the user the MP3. Rules:

- A respelling replaces whole words and must keep the word count ("Worcester": "Wooster", not "Woo ster").
- Years and numbers are spelled out automatically by `number_words()` ("1806" → "eighteen oh-six", "15,000" →
  "fifteen thousand", "1830s" → "eighteen thirties"). Dollar amounts and "January 1" have special cases.
- If the voice still misreads a word in a chapter, fix `PRONOUNCE` and re-voice only that chapter.

## 5. Re-voicing one chapter

```sh
python3 tools/voice.py script/ch04_corrupt_bargain.txt ch04_corrupt_bargain      # one take, eleven_v4 (default)
# older paragraph-by-paragraph method:
# VOICE_ONE_TAKE=0 VOICE_MAX_PAUSE=0.25 VOICE_SENT_GAP=0 VOICE_PARA_GAP=0.35 VOICE_STRETCH=1.0 python3 tools/voice.py script/ch04_corrupt_bargain.txt ch04_corrupt_bargain
python3 tools/anchors.py ch04_corrupt_bargain --src src/ch/Ch04.tsx
```

Changed words can break anchors (a phrase that no longer exists throws at render time), and every later anchor
shifts. Re-check stills for that chapter after re-voicing.

## 6. Music

- **Reuse first.** Every cue the channel has made (46, deduplicated, with prompts, lengths, loudness and where each
  was used) is in the style repo's music library: `music/README.md` and `music/cues/` at the root of the
  `15minhistorystyle` repo (this skill's `../../../music/`). Copy cues into `public/music/` keeping their prefix
  (`r_dix.mp3`). Write a `script/MUSIC.md` table for the new video: chapter, cue, why it fits, and a "gaps" list.
  Offer the user two to four options for the important chapters (Ouija's `review/music_options/` did this: the
  narration mixed over each option) and let them pick. Only generate cues for real gaps, then add them to the
  library with a new prefix.
- **Suno** gives the best new cues (the user runs it by hand): Custom mode, Instrumental on, and the Styles and
  Exclude lines in the library's README.
- **Generate with ElevenLabs** (`tools/music_eleven.py <name>`; how Reconstruction's `rc_` cues were made):
  1. The key is the narration key, in `.env`. Check the budget first (`GET /v1/user/subscription`); music costs
     roughly 850 credits a minute, so make 60–80 s cues and reuse them across chapters.
  2. Add a prompt to `CUES`: the moment and its period in plain words; period instruments by name (fretless banjo,
     fiddle, saxhorn brass band, reed harmonium, parlor piano, field drum), never a named song or artist; how it moves
     over its length; how it ends (the tail gets lifted, so ask for an ending worth hearing); then the `TAIL` suffix
     (instrumental, no choir, restrained, room for a narrator); and the length in ms. The docstring has the recipe and
     the `rc_` prompts are worked examples.
  3. Run it, measure the loudness (`ffmpeg -i public/music/x.mp3 -af loudnorm=print_format=summary -f null -`) and set
     the bed from it: ElevenLabs cues come out at −16 to −19.5 LUFS, so they run at about 0.17–0.24 where a −12 LUFS
     cue runs at 0.13. Listen to the first 30–40 s, which is what most chapters use.
  4. Add the cue to the music library (`music/cues/`, a row in `music/README.md`, an entry in `music/catalog.json` with
     its prompt) under the video's prefix. Commit the `.mp3`; the `.wav` copy is git-ignored.
- **Generate locally with ACE-Step 1.5** (`tools/music_acestep.py`; free and unlimited, the user's pick for
  text-to-music after the Reconstruction test): an open-source model run on your own machine (MIT; outputs allowed
  commercially). Setup, the CPU fix and the prompt style are in the tool's docstring. Captions are comma-separated:
  period and instruments first, then mood and how it moves, then "documentary underscore, restrained, instrumental";
  give `bpm`, key and time signature explicitly. On a GPU or Apple silicon a cue takes seconds; on a CPU-only cloud
  session about 4 minutes per 60 s cue. Its "cover" mode did not keep a melody in the CPU test, so use it for
  text-to-music, not for turning a recording into a new arrangement (yet).
- **Real period recordings** (`tools/jukebox.py`; how Reconstruction got its spirituals, band medleys and Foster):
  `search "roll jordan roll"` lists Library of Congress National Jukebox records (1900–1925) with dates and performers;
  `get <jukebox-id> public/music/period/<name>.mp3` downloads one and writes its credit to `public/music/credits.json`.
  Records published before 1926 are US public domain (the tool refuses later ones). Sung records never go under the
  narration: use them in a chapter's open, its tail and the ending; instrumentals can sit low under it. Normalise each
  to about −16 LUFS first (they range −15 to −31). Leave out "Dixie" and minstrel-era records (mock dialect), and listen
  to any "Southern melodies" medley before using it. Credit the performers in the description ("Swing Low, Sweet
  Chariot: Fisk University Jubilee Singers, 1909, Library of Congress"); a reissue label's Content ID claim is disputed
  with the LOC link and the recording date. Worked example: `projects/Reconstruction/MUSIC.md` in the style repo.
- **Levels:** music beds 0.13–0.17 under narration, with 15–20-frame fades (`ChapterShell` does this). Cold open
  0.17, dipping at the end. Title sting 0.45 (already wired into the intro). The heavy chapter gets a grave cue or
  near-silence. Generators master differently (Lyria about −12 LUFS, Suno about −15, ElevenLabs down to −19.6), so
  check the library's LUFS column: a cue 6 dB quieter needs roughly double the bed.
- **Tail lift and hand-overs** (from *The Exact Spot*): `ChapterShell` lifts the bed ×1.6 (`TAIL_LIFT`) for the ~2 s
  after the last word, then fades with the picture, so pick cues whose tail still sounds good louder. To change cue on a
  phrase, give the first `to: TM.at('word') + 6` and the next `from: TM.at('word') - 6` (`TM = makeTimeline(N, 30)`); the
  first fades over 30 frames.
- Don't mention AI music (or the AI voice or AI images) in the description; the user's rule. YouTube's altered-content
  checkbox in Studio covers the disclosure.

## 7. Sound effects

The template ships the channel's set in `public/sfx/`: `stamp` (titles), `marker_tick` (notes, via `WRITE`),
`tick` (pins, card flips), `tick_soft` (logo break), `whoosh` (cuts), `boom` (big hits), `page_turn`, `quill`,
`gavel`, `crowd_cheer`, `smash`, `knock`. More (`shot`, `crickets`, `rowdy_crowd`, `sea_ambience`, `scrape`,
`pencil_soft`) are in the style repo's `sfx/` folder with their volumes. Make a new one with
`python3 tools/sfx_eleven.py <name>` after adding a prompt to `SFX`. Volumes are in `building-scenes.md` §6. Keep
effects quiet; they should be felt more than heard.
