# Thumbnail and YouTube upload text

## Contents
1. Thumbnail
2. YouTube title, description, chapters, tags
3. Upload settings

## 1. Thumbnail

**Do this first: packaging before the script** (the user's rule, Oct 2026, from their "Overcoming a Slow YouTube Start" notes).
Right after the topic is fact-checked, and before the full script:

1. **The core concept in one line.** What kind of hook is it: an underdog, a disaster averted, a con, an experiment gone wrong? If
   the video can't be summed up in one image and a five-word title, the premise isn't sharp enough yet. Sharpen it before writing.
2. **The packaging mockup.** Brainstorm 4–6 thumbnail concepts and **3–5 titles**, checked against the archival images that actually
   exist. Test each pair with: *"Would I click on this if I saw it on my feed at 11 PM?"* The user picks 2–3 to mock up.
3. **Build the video to the package.** The winning thumbnail decides the cold open's first image and line (it is on screen at frame 0),
   and the script pays off its promise quickly. The final render happens at packaging (phase 10).
4. **The post-launch check** (below, §3).

What makes a thumbnail work:
- **The rule of one.** One idea, readable on a phone in under half a second. Too many objects, text blocks or focal points and the
  thumb scrolls past.
- **A question, not a label.** The thumbnail is not a poster or title card for the topic. If it tells the whole story there's no
  reason to click. It should make the viewer think *"wait, how did that happen?"* and leave the video to answer it.
- **Title and thumbnail form one curiosity gap.** They work together and never repeat each other. Weak: a report ("How We
  Broadcast Our Event"). Strong: a story with stakes ("We Broke Our Setup 10 Minutes Before Green Flag").
- **Contrast.** A bright, clean focal point that stands out against YouTube's dark and light themes. A face with real emotion, or
  one striking contrast, draws the eye.

`src/Thumbnail.tsx` holds two concepts drawn with the video's own kit; `node tools/thumbs.mjs [A B C …]` renders them to
`renders/thumbnails/<SLUG>_<key>.png` at 1280×720. Offer the user two or three concepts, then refine the one they
pick. For *King Andrew* they chose **A, the split**:

- **A · Split portrait.** One cut-out portrait on the dark desk, centred on the frame's middle line. The left half
  is tinted teal, the right half coral, with a cream line down the middle. A hand-drawn crown or other symbol sits
  on the head. Two words in orange tape sit under the chin, one each side ("HERO" / "OR KING?").
- **B · Title-led.** A tinted, traced portrait card on the right; a handwritten setup line plus a two-line
  highlighter title on the left over a dark gradient.
- **Topic-led, no single person** (*The Exact Spot* D, asked for by the user): the search term on the first strip and
  the question on the second ("MEXICAN-AMERICAN WAR:" / "WHO STARTED IT?") over a period print of the event itself. With
  two sides, wash the print in a horizontal gradient, coral on one side and teal on the other (`mix-blend-mode: color`
  at 0.75 plus `multiply` at 0.18, inside `isolation: isolate`), so the split reads without cutting anyone out. Code:
  `techniques/components/exact_spot/Thumbnail.tsx` `ThumbD`; its `Cutout` helper does a masked, tinted, traced portrait.

Rules the user enforced:

- **The whole head is in frame, with room above it.** Zoom out (`THUMB_PORTRAIT.scale`, `top` in
  `src/project.ts`) rather than cropping the top of the head.
- **A symbol on the head must sit on the head and match its width.** Measure the hair line from the mask instead
  of guessing: for each source x, the first opaque row of `public/img/masks/<name>_subject_a.png` is the top of
  the hair. Put the crown's base a little below that line, spanning the head's width there (*King Andrew*: hair
  top about y 145–250 across x 650–1150, base at y 275 from x 660 to 1200). Draw it across the whole head (both
  halves), in gold `#FF9F1C` with a dark drop shadow. Coral on the coral half disappears.
- **Text never covers the face, and above all not the mouth.** Keep the titles below the chin (y ≥ 840 at
  1920×1080) or beside the head.
- Keep the bottom-right corner clear (YouTube's duration badge covers it). The channel logo goes top-left.
- No source tag at thumbnail size. Big, few words: 2–4 words, cap height ≥ 12% of the frame.

Render frame 140 (every write-on finished), look at the result at 1280×720 and at phone size before sending.

## 2. YouTube title, description, chapters, tags

Write them into `review/YouTube_description.md` as four sections: Title (in a code block, with 2 alternates
listed below), Description (one code block, ready to paste), Tags (one code block), Upload settings. Then run
`python3 tools/youtube_check.py`.

**Title: the most important line of metadata.** The thumbnail stops the scroll; the title wins the click. YouTube reads it to know
who to test the video on, and the viewer reads it with the thumbnail to decide whether it's worth 15 minutes.
- **Under 50–60 characters**, so it isn't cut off on phones.
- **The hook or curiosity gap first**: the most compelling words at the front.
- **Read like a movie headline, not a textbook index**, for story and entertainment videos. Weak: "The History of the Great
  Diamond Hoax of 1872". Strong: "The Scam That Fooled Wall Street" (but only claims that are true; see the objectivity rules).
- **Classroom and APUSH videos** may still lead with the term students search for, then the hook:
  `Andrew Jackson: How the People's President Became "King Andrew"`. Even then, keep it near 60 characters.

**Description template:**

```
<Hook question with the main keywords, 1–2 sentences: who, what, the paradox.> <The cold open's artifact in one or two vivid sentences.>

This is <topic> explained in 15 minutes: <the big topics, in video order, named the way students search for them>. Along the way we look at both sides: <supporters' view> and <critics' view>.

⏱️ CHAPTERS
0:00 <chapter 1 name, with its keyword>
0:55 ...                    (from tools/render.sh's chapter start times; round down)

📚 IN THIS VIDEO
• <one bullet per chapter, packed with the specific names, laws, cases and terms covered>

Great for APUSH Period <N> (<years>) review, U.S. History class, or anyone who wants to understand <topic>.

👍 If this helped, like and subscribe for more 15 Minute History.   (add "Next time: ..." only if the next video is decided)
🛍️ Stickers from 15 Minute History: https://www.teepublic.com/user/minutehistory   (the user's shop: in every description)

🖼️ SOURCES & CREDITS
Historical images: <institutions actually used, from public/img/credits.json: Library of Congress, Wikimedia Commons, ...>.

#<MainTopic> #APUSH #USHistory
```

SEO notes:
- **The first 2–3 lines are the important ones**: they show under the video in search and on phones. Make them a compelling
  two-sentence summary that backs up the title's hook, with the main keywords in it.
- **Write naturally.** Use the words viewers would actually type. Never a block of names or keywords at the bottom: it looks like
  spam and can be flagged.
- Timestamps help retention: they show the video's scope and let people jump around.
- Chapter titles use the same searchable terms (they become Google "key moments").
- Only the first three hashtags show above the title.
- Pull terms from the script's vocab list and key concepts; don't promise topics the video doesn't cover.

**Tags: low weight, don't overthink them.** YouTube says tags play a very small role, mostly catching misspellings of the topic or
channel name ("Diamond Hoax" vs. "Diamon Hoax"); it learns what the video is about from the transcript, title, description and what
viewers do. Spend two minutes: **5–8 accurate tags** (e.g. `great diamond hoax`, `1872`, `gilded age scams`, `american history`),
plus `apush` and `us history` for classroom videos. Put the time into the title, thumbnail and pacing instead.

| Element | Weight | Goal |
|---|---|---|
| Thumbnail | Critical (stops the scroll) | A bold visual promise or a question |
| Title | Critical (wins the click) | The story with emotional or narrative stakes |
| Description | Moderate (context) | A hook in the first two lines, plus timestamps |
| Tags | Low (minor correction) | A few accurate keywords, then move on |

## 3. Upload settings

- **Never mention AI images, AI music or the AI voiceover in the description** (the user's rule). The disclosure belongs
  only in YouTube Studio's checkbox:
- **Altered or synthetic content: Yes.** The AI-illustrated scenes could pass for real historical images, and the
  narrator is an AI voice clone. Say how many AI scenes there are.
- **Category:** Education.
- **Thumbnail:** `renders/thumbnails/<SLUG>_A.png` (or the chosen concept).
- **Video file:** `renders/<SLUG>_1080p.mp4` (the LFS master).

## 4. After launch: the CTR check

A couple of days after upload, open YouTube Studio → the video → Reach. If impressions are decent but **click-through rate is under
3–4%**, the packaging isn't grabbing people yet. Swap the thumbnail or the title to test a new angle (Test & Compare, or a straight
swap). Change one at a time so you know which one helped. For retention, look at where people drop off (judge organic traffic, not
promoted views).
