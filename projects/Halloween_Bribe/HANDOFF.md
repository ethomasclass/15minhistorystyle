# Handoff: Halloween video (Chunk History)

**Working title:** Trick-or-Treating Was a Bribe: The Real History of Halloween
**Branch:** `ccr-5f9195b0-0cknf0` in `ethomasclass/15minhistorystyle` · **Project folder:** `projects/Halloween_Bribe/`
**Skill:** `.claude/skills/15-minute-history/` (read `SKILL.md`; this project was made from its template)
**Status (Oct 27, 2026):** packaging explored, script at draft 2, waiting on the user's call about length. Nothing voiced or rendered yet.

## Where things are

| What | File |
|---|---|
| Original outline (user's, 10-minute cut) | `OUTLINE.md` |
| Fact-check of all 10 outline flags, with sources and safe wording | `research/FACT_CHECK.md` |
| Thumbnail research: competitor scan (16 videos), gaps, feed mock-up results | `research/THUMBNAIL_RESEARCH.md`, `research/THUMBNAIL_GAPS.md` |
| **Script, draft 2** (8 chapters, 1,822 words, about 11:45 finished) | `script/SCRIPT.md` + `script/ch01…ch08_*.txt`; PDF in `review/Halloween_Bribe_script_draft2.pdf` |
| Archival images by chapter, with credits | `public/img/ch01…ch06/`, `script/IMAGES.md`, `public/img/credits.json` |
| Gemini prompts and style (layered silhouette) | `script/GEMINI_PROMPTS.md`, tests in `public/img/gen/tests/` |
| Thumbnail concepts (code) | `src/ThumbsHalloween.tsx` (registered in `src/Root.tsx`); render with `node tools/thumbs.mjs X2 X3 H3` |
| Thumbnail renders and sheets | `renders/thumbnails/`, `review/thumbnail_concepts.jpg`, `review/thumbnail_x_concepts.jpg` |
| Feed mock-up tool (our thumbs among competitors, dark and light) | `python3 tools/feed_mock.py X2 X3 H3 G` → `review/feed_dark.jpg`, `review/feed_light.jpg` |
| Monster-mask cut-out (1964 LOC photo) | `public/img/masks/kids*`, job `kids` in `tools/mask.py` |

## Decisions so far
- **AI image style:** layered silhouette (the user's reference: ochre haze, big moon, black foreground, one orange glow), on `gemini-3-pro-image`.
  Thumbnail-only images use a different look: B&W ink illustration with one coral accent (`public/img/gen/thumb/x1–x5.png`, 2K).
- **Thumbnail direction:** clean bold type, not newspaper scans (the user's note). Current pick for Test & Compare:
  **X2** (gas-mask pumpkin, TEAR GAS / ON HALLOWEEN?) · **X3** (kid counting candy, CANDY was a BRIBE) · **H3** (TRICK OR ~~TREAT~~ BRIBE + coral 1964 mask).
  The orange silhouette thumbnails (C, D) disappear in the feed; the logo is unreadable at feed size.
- **Hook:** the cold open starts "Tear gas. On Halloween." over the real *Bismarck Tribune*, 1 Nov 1933 ("Tear Gas Used to Halt Pranks").
  If a bribe thumbnail wins, re-voice only the cold open as hook B (in SCRIPT.md).
- **Draft 2 added Ireland** (user request): ch02 "The Night the Dead Came Home" and ch03 "Coffin Ships and Pumpkins".

## Open items (next steps, in order)
1. **Length:** the user must choose: keep about 11:45, or apply the cut list (about 165 words, to about 10:45). The cut list is in the last chat message
   and below:
   ch02 dead-coming-home paragraph (~30) · ch03 Newton wagon paragraph + "Wagons again" in ch05 (~45) · ch04 "And North Dakota wasn't special…" (~35) ·
   ch06 "Candy companies noticed…" (~25) · ch07 "Hospitals offered to X-ray…" (~30).
2. **Pull originals before voicing:** the *Lethbridge Herald*, 4 Nov 1927, p. 5 (the "edible plunder" quote); the *Washington Post*, 11 Nov 1948, p. 12
   (the "making gangsters of children" letter); the full *Bismarck Tribune* story (confirm "about 300 boys" and "the high school"); the NYT,
   15 Oct 1942 (Chicago's vote). Add a second source for the Irish pranks list (dúchas.ie Schools' Collection).
3. **Download** Maclise, *Snap-Apple Night* (1833, public domain) from Wikimedia Commons into `public/img/ch02/` and add it to `IMAGES.md`
   (Commons was rate-limiting the cloud container).
4. Pronunciation check (Samhain → "Sow-in", barmbrack), then voice (ElevenLabs), then scenes. The template's demo `src/ch/Ch01.tsx` / `Ch02.tsx`
   are still the King Andrew examples; replace them when building scenes.
5. Regenerate the chosen silhouette or thumbnail painting at 4K and fix the AI flaws (wagon wheels, ladder, ghost emblem); export the thumbnail at 1920×1080 or larger.
6. If the video publishes after 31 Oct 2026, change "This Saturday" (ch01, ch08) to "Every Halloween".

## Setup on a new machine
```sh
git clone https://github.com/ethomasclass/15minhistorystyle.git
cd 15minhistorystyle
git checkout ccr-5f9195b0-0cknf0
cd projects/Halloween_Bribe
npm install
pip install pillow numpy imageio-ffmpeg rembg onnxruntime opencv-python-headless
cp .env.example .env    # then add GEMINI_API_KEY=... (and the ElevenLabs key when voicing). Never commit .env.
```
Gemini images: `SIZE=2K python3 tools/gemini_image.py gemini-3-pro-image out.png prompt.txt`. It makes plain REST calls to
`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent` with
`generationConfig: {responseModalities: ["IMAGE"], imageConfig: {aspectRatio: "16:9", imageSize: "2K"}}`; the prompts are saved next to each image (`*.txt`).
