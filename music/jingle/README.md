# Channel jingle (work in progress)

A short sonic logo for the channel intro (`src/kit/Intro.tsx`, 6.2 s): the pull-back to the notebook page, the logo,
the title on orange tape. These are **rough mockups made in code** (`mock_jingle.py`, plain synthesis), meant to pin
down the melody, rhythm and timing, to be remade properly in Suno.

## The timing every version keeps

| Time | Picture | Music |
|---|---|---|
| 0–2.4 s | pull back from one photo to the whole page | soft string pad rising, two low felt-piano notes like a heartbeat |
| **2.4 s** | **the logo is fully in view** | **the 4-note motif** (felt piano, doubled an octave down by pizzicato) |
| 3.3–3.6 s | the title tape is pulled across | a brushed-snare swish into the final chord |
| **3.6 s** | **title lands** | **open final chord** + two celesta notes on top |
| 3.6–6.2 s | subtitle, dates, fade | the chord rings out and fades |

## The three mockups

| | Motif (notes, in order) | Key / final chord | Feel |
|---|---|---|---|
| **A · The question** | G – C – E … D (the last note held, leaning forward) | C major with an added D (C add 9) | curious, rising, a question asked |
| **B · Fif-teen Min-ute** | C – A … F – E (two long-short pairs, the rhythm of the name) | F major with an added G | friendly, says the name; the most "jingle" |
| **C · Turning the page** | E – A – C … B – A (a climb and a step back down) | A minor into F major | wistful, storybook |

Files: `mockups/jingle_{A,B,C}.mp3` (audio alone) and `mockups/intro_with_jingle_{A,B,C}.mp4` (with the intro picture).
To audition one in a project: `npx remotion render src/index.ts Intro out/intro.mp4 --props='{"jingle":"music/jingle_A.mp3"}'`.

## Making it in Suno

1. **Keep the melody**: upload the mockup MP3 you like (Create → Upload audio) and use **Cover** with the style below, so
   Suno keeps the notes and timing but plays them with real instruments. If the cover drifts, try **Extend** from 0:00 instead.
2. **Or from scratch** (Custom, Instrumental on), with this style:
   ```
   Short documentary channel ident, instrumental, warm felt piano melody doubled by pizzicato strings, soft string pad
   swelling underneath, a brushed snare swish into a warm open final chord, celesta sparkle on top, curious and friendly,
   intimate, not epic, no brass, no drums beyond the brush, 6 seconds, ends on a sustained chord
   ```
   Exclude: `vocals, choir, brass fanfare, trap, EDM, rock drums, synth lead, epic trailer`
3. Suno makes longer pieces: generate, then send me the take; I'll cut the best 6.2 seconds and line its motif up with
   the logo (2.4 s) and its chord with the title tape (3.6 s).
4. Ask for a **short tail version** too (the motif and chord only, about 2.5 s) for the end screen and Shorts end cards:
   the same four notes are what make it memorable.

## Rules for the final jingle

- Same palette as the channel's music: felt piano, pizzicato, warm strings, celesta. **No military snare, no brass, no ticks.**
- Mixed under the paper and tape sounds, peaking around −12 dBFS in the intro (the master brings everything to −14 LUFS).
- Once chosen, it replaces `title_sting.mp3` in the template's intro, and the motif's tail closes the end screen.
