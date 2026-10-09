# The videos so far

Oldest first. The channel look (black-and-white archive, coral subject, teal marks, orange titles) began with *Fix Everything*.
The two Jackson videos before it used other looks. Each video's key documents are copied into [`../examples/`](../examples/), and its
20-frame look book is in [`../techniques/lookbook/`](../techniques/lookbook/).

| # | Video | Runtime | Chapters | Words | Repo · branch | Ending |
|---|---|---|---|---|---|---|
| — | *The Age of Jackson, Part One* (broadside look) | 10:40 | cold open + 5 | — | `Jackson` · `claude/jackson-explainer-videos-oseyfs` (`src/v1/`) | "To be continued in Part Two" |
| 0 | ***The War Nobody Won*** (War of 1812; paper toy theater) | 14:23 | cold open + 9 scenes | 2,051 | `Jackson` · `claude/youthful-allen-f14v7e`; master in `Jackson-Videos` | "It changed how Americans saw themselves." |
| 1 | ***Fix Everything:** America's Reform Era*, 1820s–1850s | 17:02 | 11 | 3,058 | `Reform-Era` · `claude/charming-tesla-rtj8kl` | "But that's a story for next time." (teases slavery splitting the country) |
| 2 | ***The Man Who Couldn't Sit Still:** Ambrose Bierce*, 1842–1914? | 10:44 | 9 | 1,896 | `Ambrose` · `claude/15min-history-video-j4wn30` | "…as far as anyone can tell, he got there." |
| 3 | ***King Andrew:** How the People's President Got a Crown*, 1767–1845 | 15:30 | 11 | 2,757 | `Jackson` · `claude/jackson-explainer-videos-oseyfs` (`src/v3/`) | "…a word ready for that. / King." |
| 4 | ***Grip Tighter:** Slavery and the Cotton South*, 1790–1860 | 17:24 | 10 | 2,760 | `Slaveryvideo` · `ccr-ec669e6a-l5w6ai` | "…the closer the whole country came to tearing apart." |
| 5 | ***Good Luck:** How the Ouija board went from romantic to scary*, 1886–1973 | 9:48 | 9 | 1,600 | `Ouija` · `ccr-6addf590-j2w0xz` | "…that was up to whoever was holding it." + a 15 s end screen |
| 6 | ***Jazz It Out:** The Axeman of New Orleans*, 1918–1919 | RUNTIME | 9 | 1,644 | `Axeman` · `main` (its own private repo; master in Git LFS) | "It played." + a thank-you plug and a 10 s end screen |

## What each one added

- **The War Nobody Won:** a complete one-off style (a paper toy theater with a proscenium, painted backcloths and cut-out actors). Your notes:
  keep the camera inside the proscenium, and no black edges.
- **Fix Everything** is where the brand was born. The palette was picked from 10 candidates (panel A: teal outlines, orange titles, coral subject),
  and Nanum Pen won the handwriting test. It set the locked voice pace (A/B tested at 131–188 wpm; 188 chosen), the channel intro, the
  1836 map, the Lyria music library, and the [design style guide](../examples/01_Fix_Everything/DESIGN_STYLE_GUIDE.md).
- **Bierce:** a second base map (USGS 1880) with journey legs and a death ✕, the word-synced quote, the episode counter ("LIFE 3/7"), and
  the 2-second minimum for titles. Its paintings came back from Google Flow as etchings and were kept.
- **King Andrew:** the logo break between chapters (no chapter cards), `ChapterShell` with `quiet` mode for heavy chapters, state tiles,
  drawn Person figures, and the split-portrait thumbnail. It became the **starter template and the skill** in this repo.
- **Grip Tighter** was the first video built from the template. It used **no AI images** (every painting slot became a real document),
  data charts with one coral subject and sourced numbers, documents marked up in their own pixels, a separate fact-check file with verdicts,
  no humour anywhere, a slower pace (~168 wpm, A/B tested), all-teal chapters 6–10, and six Suno cues.
- **Good Luck (Ouija):** 2.5D layered paintings with one living detail, a real 3D board whose planchette spells the chapter titles,
  falling cards, a drifting desk, word-by-word quotes, a narrated subscribe plug tied to the topic, and a music-only end screen. It made no new
  music (19 reused cues, with A/B/C/D options for you to pick from) and ran at 24 fps.
- **Jazz It Out (Axeman)** was the first true-crime mystery and the first video for a general audience rather than a
  classroom (no vocab cards). It also made no new music, and it was the first video kept in its own repo.
  - **No AI images.** Photographs got Ouija's parallax (a rembg mask plus an inpainted background), and halftone
    clippings and cartoons got hand-traced polygon masks.
  - **Drawn motifs that come back with counters:** the chiseled back door, the "blamed" card, a 12:15 clock and a
    faceless police sketch.
  - **Public-domain 1917–18 jazz records as score:** muffled under the cold open, stopped dead with a needle drag, and
    answering the last line after 1.5 s of silence.
  - **Friendly, generic like-and-subscribe plugs** in the middle and over the end screen.
  - **From the review of 20 motion-graphics repos:** line boil on every drawn line, text that fits itself, a hard
    shadow under the tape, effects that fade instead of cutting off, halved effect levels, dramatic pauses
    (`pause.py`) and a payoff check (`beatcheck.py`), all now in the template.

## Your standing preferences (from your notes across the videos)

**Script**
- No historian names in the narration ("historians still argue" is fine). No modern politicians. No implied link to today's parties.
- Present what supporters and critics each saw, and let the ending explain both readings rather than deliver a verdict.
- Required concepts get named and defined, and the cause gets said plainly (e.g. "expanded suffrage is why he won").
- Open on a real document or artifact. Trim to time with a cut list.
- Keep likes and subscribes in the description, unless a plug can be part of the story (as in Ouija) or you ask for
  one. For Axeman you asked for a friendly, generic plug in the middle and at the end.

**Picture**
- **Text never runs off the frame.** You caught this in Fix Everything, King Andrew, Grip Tighter and Ouija. Run the probe every time.
- Big titles stay on screen for at least 2 seconds.
- No black edges, and the camera never shows past the edge of a map or stage.
- Drawn diagrams and cards beat fussy illustrated props.
- No caricatured engravings in a serious chapter.
- No AI images when you say so (Grip Tighter, Axeman). Archival photos, clippings and drawn motifs carry the video.
- No "drawn for this video" tags, no end credits, no mention of ElevenLabs on screen, and no "presents" line on the title.

**Thumbnail**
- The whole head is in frame, and any symbol sits on the head at the right size.
- Text stays clear of the face.
- The headline is big and the kicker smaller.

**Sound**
- The same voice clone every time, with a pronunciation test MP3 before voicing.
- **One voice speed for the whole video.** "The speed swaps change pitch and make some VOs sound funny" (after Axeman).
  Heavy chapters get longer pauses, not a slower voice. A/B the pace for the whole video when the subject is heavy, then
  use that one pace in every chapter.
- Give music options and let you pick.
- Transition sounds stay low. You found the whooshes and ticks "a bit jarring" (Axeman), so their levels were halved.
- In a dark story the cues stay dark. You flagged two cues as "too upbeat and positive" for a murder story (Axeman).
- A payoff line gets a real pause. "It played." felt "like an afterthought" until it got 1.5 s of silence, the music
  pulled out and a needle drop (Axeman).

**Packaging**
- Short YouTube titles. Tags within the 500-character limit.
- Master READMEs include Windows PowerShell join commands.

**Classroom handouts**
- "Way more simple": 10–12 questions using Explain, Describe and Identify. (Grip Tighter's 26-question guide with an answer key was an exception.)
