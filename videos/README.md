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
| 7 | ***The Exact Spot:** Texas, the Mexican-American War, and the Question It Reopened*, 1821–1848 | 14:45 | 10 | 2,485 | this repo · `claude/relaxed-lamport-62biq7` (`projects/Mexican_American_War/`) | "It took about 13 years to work." + thank-you/subscribe line and a 15 s end screen |
| 8 | ***Dressed to Kill:** How Arsenic Green Took Over the 1800s*, 1775–1900 | 9:40 | 8 | 1,654 | this repo · `claude/laughing-gates-j5en30` (`projects/Dressed_To_Kill/`) | "…The green never changed. What changed was who had to prove it was safe. William Morris called it witch fever. But this time, the witch was real." + subscribe line and a 13 s end screen |

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
- **The Exact Spot (Mexican-American War)** was built from a lesson card (Lesson 2 Day 2) and paired with a **student viewing guide and
  teacher key** (a Claude Doc). It added: the **3D tilted map** (our own Natural Earth map in perspective: slabs, claim lines dashed vs.
  agreed borders solid, standing labels, a border sliding over towns, free/slave state tiles turning into the 1861 split); **Flow wood
  engravings** for every gap (17 scenes, one master prompt, shown full frame with a soft fade) instead of oil paintings; parallax on
  engravings with a plain-paper fill; a **mask clean-up toolkit** (`refine_mask.py`, hand traces, full-resolution close-ups) after you
  flagged a rough portrait; loops placed on facsimile text lines found by line detection; a **drawn ambush diagram** in place of a
  confusing engraving; a broken-axis timeline; gentle chapter endings (the music lifts after the last word); cue hand-overs on a phrase;
  and an end screen with drawn slots. Three new Suno cues (`m_frontier`, `m_war_drums`, `m_lament`) and 10 reused. Four thumbnails, the
  last one topic-led ("MEXICAN-AMERICAN WAR: WHO STARTED IT?" over a period print, no single person).
- **Dressed to Kill (arsenic green)** was the Halloween video and the first built after a look at the channel's own **retention
  graphs**, so it opens **hook-first** (the thumbnail's skeletons at frame 0, the hook line before any date). It added:
  - **A one-time colour exception.** Arsenic green is the only true green on screen and only on the pigment itself (real wallpaper
    samples, the Kedzie cover, surviving gowns, the silhouettes); never on text, titles, notes, arrows or charts; teal kept away from it.
  - **Victorian cut-paper silhouettes** as the AI illustration style (cream paper, black figures, one spot colour), chosen over oil
    paintings and a graphic-novel test: period-true, plainly illustration, and they never pass for a real archival image.
  - **A recurring motif card** (`Swatch`): fills a green square as the pigment turns up somewhere new, drains to grey on
    "arsenic-free", is stamped SEALED at the end.
  - **The document highlighter swipe**: a coral wash running along a quote's lines in step with the narration, drawn in the scan's own pixels.
  - **A hand-traced colour region** for a subject the mask can't catch (the Waltz lady's gown), shared by every shot of that picture.
  - **Cleaner silhouette layers**: tight, sharp background fill (no smeared halo) and cut rects for figures fused to props; figures
    that still separate badly get a flat camera move instead of parallax.
  - **A music drop** (a cue cut 4–6 frames before the reveal word, then silence) in the heavy chapter.
  - Built by **four scene agents in parallel** from one `script/SCENES.md` brief, with shared pieces made first (`src/kit/dk.tsx`).
  - The script borrowed what Vox explainers do well (pointing words, numbers in pairs, "translation:" after a quote, a confusion
    pass) without their look. 190 archival images, 9 AI silhouettes, 12 reused music cues, none new.
  Thumbnails for Test & Compare: DRESSED TO KILL (Waltz), DEADLY GREEN (ballroom), DO NOT TOUCH (Kedzie's book).

## Your standing preferences (from your notes across the videos)

**Script**
- **Written for a general audience, easy to follow** (from *Dressed to Kill*). Learn from what Vox explainers do well, don't copy
  their look: see the skill's `references/explainer-craft.md`. One name per thing, terms defined where they appear, a confusion pass
  before voicing.
- **Hook-first cold opens** (from *Dressed to Kill*, after the retention graphs): the first sentence is the hook, never a date; the
  thumbnail's image is on screen at frame 0; the question by about 0:40; one or two promises that pay off later. The channel intro
  at about 1:00 is fine (no cliff there in *King Andrew*'s graph). Promoted views skip fast, so judge retention on organic traffic.
- No historian names in the narration ("historians still argue" is fine). No modern politicians. No implied link to today's parties.
- Present what supporters and critics each saw, and let the ending explain both readings rather than deliver a verdict.
- Required concepts get named and defined, and the cause gets said plainly (e.g. "expanded suffrage is why he won").
- Open on a real document or artifact. Trim to time with a cut list.
- **Every video has two narrated subscribe reminders** (from *Say It Ain't So* on): one short plug (from *The Exact Spot* on: about **two-thirds** of the way in, after the story's big build, not a third in where it kills momentum), tied to the topic
  with a wry twist (Ouija: the board spells it; Black Sox: "unlike William Wansley, nobody's paying me to say it"), and a one-line
  thank-you and subscribe over the end screen, after the closing line has landed. The like/subscribe line stays in the description too.

**Picture**
- **The evidence board in every video** (from the Reconstruction series, Oct 2026): each chapter pins one piece to a board on the desk, teal yarn with *but* / *therefore* tags ties causes to effects, and the ending pulls back to the whole board. You chose the evidence board (with the tilted desk for moving to the maps) over the block-in-the-wall "chunk wall". Spec: [`../techniques/evidence_board.md`](../techniques/evidence_board.md).
- **Text never runs off the frame.** You caught this in Fix Everything, King Andrew, Grip Tighter and Ouija. Run the probe every time.
- Big titles stay on screen for at least 2 seconds.
- **Gentle chapter endings** (from *The Exact Spot*): about 2 seconds of hold after the last word, the music lifting into it, then a slower dip to black before the logo break. No cutting off right after the voice.
- **A built-in end screen** (about 20 s) with clean slots for YouTube's end-screen elements.
- **Maps:** our own drawn map in 3D perspective (tilted, regions rising as slabs, standing labels), not terrain.
- No black edges, and the camera never shows past the edge of a map or stage.
- Drawn diagrams and cards beat fussy illustrated props. **If an image can be misread, replace it with a drawn diagram** (The Exact Spot: soldiers "inside a fence" became a drawn trap beside the map).
- **Masks are checked at full resolution** (`tools/mask_closeup.py`), not just on the contact sheet. A rough edge gets cleaned or hand-traced before the scene ships.
- **Heads stay in frame** through every push and drift. Check the first and last frame of each push into a group.
- **Make an allusion explicit.** When a map points to a later event (the 1861 split), label it on screen: sides, a key, a dated pin, the event's name.
- No caricatured engravings in a serious chapter.
- No "drawn for this video" tags, no end credits, no mention of ElevenLabs on screen, and no "presents" line on the title.

**Neutral on today's companies and people**
- When a modern company or a living person comes up (Polymarket, players under indictment), describe the company in its own and
  official terms, don't name people who haven't been convicted, say "charged" and "pleaded not guilty", keep a scandal and a company in
  separate sentences unless they're connected, and give critics' views as critics' views. Date anything that can change ("when this
  video was made").

**Images**
- **AI images are a per-video call.** Black Sox used none ("roll with what is available"); Grip Tighter used none; Ouija used many.
- **Try a style before committing** (from *Dressed to Kill*): you A/B'd oil painting vs. graphic novel vs. Victorian silhouette on one
  scene and picked the silhouettes. Spell out the period in every prompt ("no modern buildings, clothing or objects"); image models
  drift to the present (the graphic-novel test came back with tower blocks and a parka). Paint out any AI text that slips in.
- **Masks must look clean on AI images too.** Check the subject and background layers on a contact sheet before building scenes;
  a smudge halo or a straight cut edge shows when the figure slides.
  Ask before writing prompts. When a gap has no photo, prefer an engraving detail, a period document or a drawn diagram.
- When AI images are used for a pre-photography era, **period wood engravings** (Flow, one master prompt) fit best beside real prints.
- **Search anywhere for images** (from *The Exact Spot*): Library of Congress, Internet Archive books, state collections, museums, not just Wikimedia. Credit every one in `credits.json`.

**Shorts**
- **Native vertical, not letterboxed.** Rebuild each scene for 9:16 (full-screen subject, big captions), open on the strongest
  line (splice it from the narration), 30–45 s, an end card pointing to the full video. Keep text out of YouTube's UI zones (top
  ~150 px, bottom ~400 px, right ~150 px below y 900).

**Thumbnail**
- The whole head is in frame, and any symbol sits on the head at the right size.
- Text stays clear of the face.
- The headline is big and the kicker smaller.
- A **topic-led** option is welcome: the topic people search for plus a question ("MEXICAN-AMERICAN WAR: WHO STARTED IT?") over images of the event, not one person.

**Sound**
- The same voice clone every time, with a pronunciation test MP3 before voicing.
- A/B the pace when the subject is heavy.
- Give music options and let you pick.

**Packaging**
- Short YouTube titles. Tags within the 500-character limit.
- **Descriptions never mention AI images, AI music or the AI voiceover.** Credit only the archival sources. (YouTube's altered-content checkbox in Studio is still ticked.)
- Master READMEs include Windows PowerShell join commands.

**Classroom handouts**
- "Way more simple": 10–12 questions using Explain, Describe and Identify. (Grip Tighter's 26-question guide with an answer key was an exception.)
- **Viewing guide to fill in while watching** (from *The Exact Spot*): **true/false and short answer**, **20 questions at most**, in the **video's exact
  wording** so students can catch the answer as it's said, each with a timestamp, in the order of the video, grouped to match the lesson
  card's parts so the card's content is covered. **No date questions** (dates aren't important to you). Short answers only, no essays.
- **Teacher key** in a separate tab of the same doc, with the answer and the timestamp for each question.
