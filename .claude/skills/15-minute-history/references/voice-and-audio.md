# Voice, music and sound

## Contents
1. Keys and safety
2. Voicing the narration
3. Pace settings (locked)
4. Pronunciation
5. Re-voicing one chapter (and dramatic pauses)
6. Music
7. Sound effects
8. Do the payoffs land? (beat check, J- and L-cuts)

## 1. Keys and safety

New narration, music and sound effects need an ElevenLabs key; AI images need Gemini (the user runs those
prompts themselves). Keys live only in the project's `.env`, which git ignores:

```
ELEVENLABS_API_KEY=...
VOICE_ID=...          # the user's own ElevenLabs voice clone
GEMINI_API_KEY=...    # only if tools/trace.py paint is used
```

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
forced alignment). Voice model: `eleven_v3` (the default in `tools/voice.py`).

After voicing:
1. Make a narration preview the user can listen to straight through (join the WAVs with ffmpeg into one MP3,
   e.g. `script/<Slug>_narration_preview.mp3`) and send it.
2. Run `python3 tools/anchors.py <stem> --src src/ch/ChNN.tsx` for any chapter whose scenes already exist.
3. Commit the WAVs and words.json files (they are what the render uses).

## 3. Pace settings (locked)

Matched to the channel's earlier videos; don't change them without the user asking.

| Chapters | VOICE_STRETCH | VOICE_MAX_PAUSE | VOICE_SENT_GAP | VOICE_PARA_GAP |
|---|---|---|---|---|
| Normal | 1.15 | 0.25 | 0 | 0.35 |
| Heavy chapter and the ending (`HEAVY=`) | 1.08 | 0.35 | 0.05 | 0.55 |

`STRETCH` is a local, pitch-preserving tempo change (>1 is faster). `MAX_PAUSE` shortens the voice's own pauses.
The result is about 185 words a minute for normal chapters.

## 4. Pronunciation

Before voicing a whole video, run the pronunciation check in `script-writing.md` §8: put respellings in
`PRONOUNCE` in `tools/voice.py`, voice a short test file, and send the user the MP3. Rules:

- A respelling replaces whole words and must keep the word count ("Worcester": "Wooster", not "Woo ster").
- Years and numbers are spelled out automatically by `number_words()` ("1806" → "eighteen oh-six", "15,000" →
  "fifteen thousand", "1830s" → "eighteen thirties"). Dollar amounts and "January 1" have special cases.
- If the voice still misreads a word in a chapter, fix `PRONOUNCE` and re-voice only that chapter.

## 5. Re-voicing one chapter

```sh
VOICE_MAX_PAUSE=0.25 VOICE_SENT_GAP=0 VOICE_PARA_GAP=0.35 VOICE_STRETCH=1.15 python3 tools/voice.py script/ch04_corrupt_bargain.txt ch04_corrupt_bargain
python3 tools/anchors.py ch04_corrupt_bargain --src src/ch/Ch04.tsx
```

Changed words can break anchors (a phrase that no longer exists throws at render time), and every later anchor
shifts. Re-check stills for that chapter after re-voicing.

### Dramatic pauses

ElevenLabs leaves 0.25–0.35 s between sentences, which is too little before a payoff line. Don't fight it with
punctuation; add the silence afterwards:

```sh
python3 tools/pause.py ch09_who "It played." 1.5      # 1.5 s of silence before the phrase
```

It cuts silence into the WAV halfway through the gap before the phrase, shifts every later word timing, grows the
duration and records the pause in the `.words.json`, so scenes keyed with `t.at()` follow automatically. It refuses to
add a second pause before the same phrase. **Re-voicing a chapter wipes its pauses**: run `pause.py` again after (the
list is in `"pauses"` in the old words file and in `script/_notes.md`). Guide: 0.2–0.3 s for a beat ("Now the papers have
a name for him. *The Axeman.*"), 1–2 s for the line the video was built to land, with the music pulled out under it.

## 6. Music

- **Reuse first.** Every cue the channel has made (38, deduplicated, with prompts, lengths, loudness and where each
  was used) is in the style repo's music library: `music/README.md` and `music/cues/` at the root of the
  `15minhistorystyle` repo (this skill's `../../../music/`). Copy cues into `public/music/` keeping their prefix
  (`r_dix.mp3`). Write a `script/MUSIC.md` table for the new video: chapter, cue, why it fits, and a "gaps" list.
  Offer the user two to four options for the important chapters (Ouija's `review/music_options/` did this: the
  narration mixed over each option) and let them pick. Only generate cues for real gaps, then add them to the
  library with a new prefix.
- **Suno** gives the best new cues (the user runs it by hand): Custom mode, Instrumental on, and the Styles and
  Exclude lines in the library's README.
- **Generate** with `tools/music_eleven.py <name>` after adding a prompt to `CUES` (see the examples there:
  instrumental, no vocals, room for a narrator, period instruments, length in ms). Music costs roughly 850 credits
  a minute, so keep cues short and reuse them.
- **Levels:** music beds 0.13–0.17 under narration, with 15–20-frame fades (`ChapterShell` does this). Cold open
  0.17, dipping at the end. Title sting 0.45 (already wired into the intro). The heavy chapter gets a grave cue or
  near-silence. Generators master differently (Lyria about −12 LUFS, Suno about −15, ElevenLabs down to −19.6), so
  check the library's LUFS column: a cue 6 dB quieter needs roughly double the bed.
- Credit music as AI-generated in the description.

## 7. Sound effects

The template ships the channel's set in `public/sfx/`: `stamp` (titles), `marker_tick` (notes, via `WRITE`),
`tick` (pins, card flips), `tick_soft` (logo break), `whoosh` (cuts), `boom` (big hits), `page_turn`, `quill`,
`gavel`, `crowd_cheer`, `smash`, `knock`. More (`shot`, `crickets`, `rowdy_crowd`, `sea_ambience`, `scrape`,
`pencil_soft`) are in the style repo's `sfx/` folder with their volumes. Make a new one with
`python3 tools/sfx_eleven.py <name>` after adding a prompt to `SFX`. Volumes are in `building-scenes.md` §6. Keep
effects quiet; they should be felt more than heard. Levels are in `visual-style.md` §6.

## 8. Do the payoffs land? (`tools/beatcheck.py`)

Mark each payoff line in the script with `*asterisks*` (the channel already does, for emphasis). After rendering:

```sh
python3 tools/beatcheck.py            # every chapter in out/ch/;  or: python3 tools/beatcheck.py 07 09
```

For each italic line it prints the **gap** (silence in the narration before it), the **room** (how much quieter the mix
is in that gap than the chapter's typical level) and the **hit** (where the loudest 100 ms in the next 1.5 s falls), and
writes `out/beats.png`, a waveform strip per beat with the word marked. Act on:

- `tight` (gap under 0.3 s) on a line that ends a chapter or turns the story → `tools/pause.py`.
- `no room` (under 3 dB) → the music or an effect is running straight into the line. Dip the bed, end the cue, or move
  the effect.
- a negative **hit** → a sting or boom is peaking before the word and stepping on it. Move it to the word or after.

Mid-sentence emphasis (an italic phrase inside a sentence) needs neither gap nor room; ignore its flags.

### J-cuts and L-cuts
A hard picture cut doesn't need a hard sound cut. **J-cut:** the next scene's sound (crackle, a room tone, the first
note of its cue) starts 6–15 frames *before* the picture cuts, pulling the viewer across. **L-cut:** the last scene's
sound runs 6–20 frames *past* the cut and fades, so a heavy moment isn't chopped. In Remotion that's just a `Bed` or
`Sfx` whose `from` sits before (J) or whose `to` sits after (L) the cut frame. *Axeman* used J-cuts for the record
crackle into the party night and the needle drop 3 frames before "It played."
