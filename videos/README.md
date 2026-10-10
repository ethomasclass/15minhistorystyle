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
| 6 | ***Say It Ain't So:** Baseball's Gambling Problem Before the Black Sox*, 1865–1921 (+ today) | 10:23 | 8 | 1,709 | this repo · `black-sox-video` (`projects/Black_Sox/`) | "…It's who's watching when they do." + subscribe line and a 12 s end screen. Plus 4 vertical Shorts |

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

- **Say It Ain't So (Black Sox)** was the first video built inside this repo (`projects/Black_Sox/`) and the first with **YouTube
  Shorts**. Made for the World Series window, weighted two-thirds to the little-known pre-1919 story. It added: **2.5D parallax for
  archival photos** (`Parallax`: rembg mask → subject/background layers, a crop that keeps the camera inside a glass negative's black
  border, any frame size); a recurring **BANNED ledger** that fills in across chapters and gets stamped in the finale; a drawn **wall**
  that goes up, gets knocked down and becomes a dashed line; a **hand-drawn phone** (teal sketch, logo on a coral screen) for a
  modern company; a catcher **masked out of an engraving** to stand in for a person with no surviving photo; **two narrated subscribe
  reminders** (now a standing rule); a readable **script PDF** for review; and **native vertical Shorts** that splice hook-first lines
  out of the chapter narration (no new voice) with word-by-word captions. No AI images (your call); 9 reused music cues, none new.
  Thumbnail: BANNED 1921 / PARTNER 2026 with Shoeless Joe (C).

## Your standing preferences (from your notes across the videos)

**Script**
- No historian names in the narration ("historians still argue" is fine). No modern politicians. No implied link to today's parties.
- Present what supporters and critics each saw, and let the ending explain both readings rather than deliver a verdict.
- Required concepts get named and defined, and the cause gets said plainly (e.g. "expanded suffrage is why he won").
- Open on a real document or artifact. Trim to time with a cut list.
- **Every video has two narrated subscribe reminders** (from *Say It Ain't So* on): one short plug a third of the way in, tied to the topic
  with a wry twist (Ouija: the board spells it; Black Sox: "unlike William Wansley, nobody's paying me to say it"), and a one-line
  thank-you and subscribe over the end screen, after the closing line has landed. The like/subscribe line stays in the description too.

**Picture**
- **Text never runs off the frame.** You caught this in Fix Everything, King Andrew, Grip Tighter and Ouija. Run the probe every time.
- Big titles stay on screen for at least 2 seconds.
- No black edges, and the camera never shows past the edge of a map or stage.
- Drawn diagrams and cards beat fussy illustrated props.
- No caricatured engravings in a serious chapter.
- No "drawn for this video" tags, no end credits, no mention of ElevenLabs on screen, and no "presents" line on the title.

**Neutral on today's companies and people**
- When a modern company or a living person comes up (Polymarket, players under indictment), describe the company in its own and
  official terms, don't name people who haven't been convicted, say "charged" and "pleaded not guilty", keep a scandal and a company in
  separate sentences unless they're connected, and give critics' views as critics' views. Date anything that can change ("when this
  video was made").

**Images**
- **AI images are a per-video call.** Black Sox used none ("roll with what is available"); Grip Tighter used none; Ouija used many.
  Ask before writing prompts. When a gap has no photo, prefer an engraving detail, a period document or a drawn diagram.

**Shorts**
- **Native vertical, not letterboxed.** Rebuild each scene for 9:16 (full-screen subject, big captions), open on the strongest
  line (splice it from the narration), 30–45 s, an end card pointing to the full video. Keep text out of YouTube's UI zones (top
  ~150 px, bottom ~400 px, right ~150 px below y 900).

**Thumbnail**
- The whole head is in frame, and any symbol sits on the head at the right size.
- Text stays clear of the face.
- The headline is big and the kicker smaller.

**Sound**
- The same voice clone every time, with a pronunciation test MP3 before voicing.
- A/B the pace when the subject is heavy.
- Give music options and let you pick.

**Packaging**
- Short YouTube titles. Tags within the 500-character limit.
- Master READMEs include Windows PowerShell join commands.

**Classroom handouts**
- "Way more simple": 10–12 questions using Explain, Describe and Identify. (Grip Tighter's 26-question guide with an answer key was an exception.)
