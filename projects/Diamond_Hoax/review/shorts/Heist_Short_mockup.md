# Custom Short mockup: "How to Sell Dirt for $18 Million"

A Short written for the vertical feed, with its own voiceover, instead of lines spliced from the chapters.
Storyboard: `heist_board.jpg` (ten panels, rendered in the real kit from `src/vshort_heist.tsx`, composition `Mock-HeistBoard`).
Nothing is voiced yet.

## Why this one

- **Archetype: the heist recipe.** "How to ___" in numbered steps, then the step they couldn't control. Each step is a small
  payoff of its own, which keeps the retention curve flat, and the numbered steps are the running device.
- **The hook is a claim with a number:** sell *dirt* for *$18 million*. It's absurd enough to stop a thumb, and true.
- **It teaches the whole hoax in under a minute:** the bait, Tiffany, salting, the exit, and how a geologist caught it.
- **It pays off its own question.** The answer to "how?" is the five steps. The twist (it was *too perfect*) and the line
  "Nature is not that tidy" land the ending, and the last line, "They'd sold dirt," loops back into the cover.
- **It doesn't repeat Shorts 1–4.** Those are the anthill evidence, the six moves, the cousins' fates and Tiffany. This one is
  the story told as instructions.

## Script (157 story words + 15-word outro, about 55 s at the Shorts pace)

| # | Panel | Line |
|---|---|---|
| 0 | Cover: HOW TO SELL **DIRT** FOR $18 MILLION, the whole H1 picture | *(drawn on frame 0, voice starts immediately)* |
| 1 | Cover, push in | Here's how two cousins sold America's richest men a field of dirt, for about eighteen million dollars in today's money. |
| 2 | STEP 1 · rubies + diamond (coral) | Step one: buy the bait. Cheap, flawed diamonds and rubies. Rejects nobody wanted. |
| 3 | STEP 2 · San Francisco at night, the pouch | Step two: play hard to get. Show up late at night with the bag, and refuse to say where it came from. |
| 4 | STEP 3 · Tiffany (coral) + his words | Step three: borrow someone's trust. Charles Tiffany himself held the stones up to the light and called them a fortune. |
| 5 | STEP 4 · salting at night | Step four: make a mine. On an empty mesa in Colorado, push the stones into the dirt. Even into anthills. |
| 6 | STEP 5 · banknotes, hat, $18 MILLION | Step five: get out in time. Let the experts dig them up, take the money, and leave. |
| 7 | STEP 6? · Clarence King (coral) | It worked. Until a government geologist found the field, and noticed it was too perfect. |
| 8 | Anthill cut-away + boot prints; NATURE IS NOT THAT TIDY. | A dozen rubies by every diamond. And rubies only in anthills with boot prints around them. Nature is not that tidy. |
| 9 | THEY SOLD **DIRT.**, the H1 picture again (loop) | They hadn't sold a diamond mine. They'd sold dirt. |
| 10 | End card | *(0.7 s beat)* Want more history like this? Tap like and subscribe. The full con's linked right there. |

Every fact is from the locked script (ch 1–7): the $18 million is the cousins' take in today's money (×27); "Tiffany… called them
a fortune" stands for his "precious stones of enormous value"; the rubies-by-boot-prints detail is ch 7's.

## The format, generalized: 1–2 custom Shorts per video

**The arc (about 55 s):**
1. **0 s, the cover:** fully drawn on frame 0; one claim or question in big tape (110–250 px); makes sense with the sound off.
2. **0–3 s, the hook line:** who, what and a number, said as a story ("Here's how two cousins sold…"), never a date or background.
3. **3–5 s, the promise:** the running device appears (STEP 1 of 5, CLUE 1 of 3, a counter, a checklist).
4. **5–40 s, the beats:** a new picture every 3–5 s, one idea per beat, each beat a small payoff.
5. **About 70%, the twist:** the thing that breaks the pattern (STEP 6?).
6. **About 85%, the payoff:** one quotable line that answers the cover ("Nature is not that tidy.").
7. **The loop line:** the last story frame matches the cover, so a replay feels seamless.
8. **After the payoff, never on top of it:** like/subscribe plus "the full story is linked right there" (the Related video link).

**Archetypes that fit the channel** (pick the one the video's best moment suits):
- **The heist recipe:** "How to ___ ", steps, then the step they couldn't control. *(this mockup)*
- **Would you have caught it?:** three clues, a beat to guess, the reveal. Drives comments.
- **The one number:** a single startling figure, unpacked ("12 rubies for every diamond").
- **What you were told vs. what happened:** the myth on the cover, the evidence, the real story.
- **One person, one decision:** the moment someone chose ("not enough money in the Bank of California…").

**The visual style, adapted for the phone (what's new in the mockup):**
- **Fill the whole 1080×1920 frame, top to bottom.** YouTube's UI zones (top ~150 px, bottom ~400 px, right ~150 px below
  y 900) are only a no-*text* rule: the picture keeps going underneath them to the edge. Paintings and portraits run the full
  height (Tiffany's engraving down to his signature, King's seated portrait to the chair), props spill off the bottom (the reject
  pile, the hat leaving frame), and the cover restacks the H1 picture for a tall frame: the tycoon in the middle, the cousins
  large in the foreground, cut by the bottom edge. Captions sit in the lower middle (y ~1290), over the picture.
- **Source tags on a small dark pill,** so they stay readable over a white print.
- **The step rail** at the top (STEP n on tape, five progress dots, the step's name in teal handwriting) is the running device,
  in the channel's own tape and handwriting.
- **Tape captions:** two to four words, 96 px, cream, with the key word on a strip of orange tape. They're bigger and more on-brand
  than the plain Inter captions, and they read at a glance.
- **Coral means "look here".** One coral subject per beat, so the eye lands on it instantly on a small screen.
- **Faces and objects, not diagrams, in the first 15 s.** Diagrams (the anthill cut-away) come later, as proof.
- **The loop:** the last story panel repeats the cover's picture with the answer on it (HOW TO SELL DIRT → THEY SOLD DIRT.).

**Funnel to the channel:** set the Short's "Related video" to the full video; the outro says the full story is "linked right
there"; the title is the cover's claim (under 60 characters); the pinned comment asks a question anyone can answer ("Would you
have bought in?").

## Next steps if you like it

1. Your notes on the script and the panels.
2. Voice it in Ellis (one ElevenLabs request, about 1,000 characters).
3. Build it as a real Short (motion, timing to the words, the `dh_` music cue's accent on "Nature is not that tidy"), render,
   master to -14 LUFS, and post with the text.
4. If it works, write the format into the skill's `references/shorts.md` so every video gets one or two of these.

## Research notes

What the research agrees on (mostly creator and vendor guides, not YouTube's own documentation, so treat the numbers as
rough): the hook window is about 2 seconds; the first frame should *be* the hook; a curiosity gap with one question per video;
a payoff that matches the promise (an oversold tease costs more on Shorts); a visual beat every 2–3 seconds; loop endings;
25–40 s for list content, and the shortest version that still pays off; Shorts convert to subscribers at a lower rate than long
videos, but reach makes up for it, and the "Related video" link is the main bridge to the full video. Your own numbers point
the same way: *The Last Public Execution* (cover frame, people first, no early text) kept 55% past the swipe; the Black Sox
Short (small cards, an early quote) kept 12%.

Sources: teleprompter.com/blog/how-to-go-viral-on-youtube-shorts · prepublish.ai/guides/youtube-shorts-retention ·
aibrify.com/blog/youtube-shorts-retention-curve-playbook · virvid.ai/blog/looping-structure-shorts-retention-2026 ·
subscribr.ai/p/scripting-youtube-shorts-engagement · easyviral.ai/blog/we-analyzed-500-viral-faceless-shorts ·
subscribr.ai/youtube-strategy/drive-traffic-shorts-to-long-videos · socialmediatoday.com (3-minute Shorts, Oct 2024)
