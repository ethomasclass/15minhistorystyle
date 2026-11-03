# Custom Short mockup: "How to Sell Dirt for $18 Million"

A Short written for the vertical feed, with its own voiceover, instead of lines spliced from the chapters.
Storyboard: `heist_board.jpg` (ten panels, rendered in the real kit from `src/vshort_heist.tsx`, composition `Mock-HeistBoard`).
Cover candidates: `heist_cover_A/B/C.jpg` and `heist_cover_feed_test.jpg` (composition `Mock-HeistCovers`).
Tiffany voice previews: `tiffany_voice_previews.mp3` (three designed voices, in order). Ellis's narration isn't voiced yet.

## Why this one

- **Archetype: the heist recipe.** "How to ___" in numbered steps, then the step they couldn't control. Each step is a small
  payoff of its own, which keeps the retention curve flat, and the numbered steps are the running device.
- **The hook is a claim with a number:** sell *dirt* for *$18 million*. It's absurd enough to stop a thumb, and true.
- **It teaches the whole hoax in under a minute:** the bait, Tiffany, salting, the exit, and how a geologist caught it.
- **It pays off its own question.** The answer to "how?" is the five steps. The twist (it was *too perfect*) and the line
  "Nature is not that tidy" land the ending, and the last line, "They'd sold dirt," loops back into the cover.
- **It doesn't repeat Shorts 1–4.** Those are the anthill evidence, the six moves, the cousins' fates and Tiffany. This one is
  the story told as instructions.

## Script (voiced Nov 3: 63.2 s; the payoff "They'd sold dirt" lands at 0:57.6, then only the subscribe line)

Voice: `public/audio/vshort_heist.wav` + `.words.json`, spliced by hand from one Ellis take (`vshort_heist_ellis`, eleven_v4, speed
1.1, its own pauses capped at 0.3 s, no stretch) and Tiffany's line (`vshort_heist_tiffany`, voice "Tiffany (1871)"), with 0.35 s of
air either side of Tiffany and a 0.7 s beat before the outro. Tiffany's words carry `"voice": "tiffany"` in the words file. Both
speech-to-text checks (Whisper, ElevenLabs) match the script word for word, no cues spoken. Scripts: `script/shorts/heist_ellis.txt`,
`script/shorts/heist_tiffany.txt`. Rough mix with the music: `heist_voice_music_mix.mp3`.

| # | Panel | Line |
|---|---|---|
| 0 | **Cover C:** $18 MILLION / FOR DIRT? over the tycoon's shocked face, coral | *(drawn on frame 0; the voice starts at once; the bottom tape is the caption until it lifts at ~1.2 s)* |
| 1 | Cover, slow push in. On "Theranos" a paper slip flicks in, teal handwriting: "Theranos, 2018: a blood test that didn't work" (no logo); on "two cousins" it's swept off. A small note under the price: "in today's money" | Before Theranos sold billionaires on a blood test that didn't work, two cousins sold America's richest men a field of dirt. For about eighteen million dollars. Here's how. |
| 2 | STEP 1 · rubies + diamond (coral), the reject pile | Step one: buy the bait. Cheap rejects nobody wanted. |
| 3 | STEP 2 · San Francisco at night, the pouch | Step two: play hard to get. Show up with the bag. Refuse to say where it's from. |
| 4 | STEP 3 · the Theranos slip again, beside Tiffany (coral); his words write on as he says them; tag "his words, 1871 · voice dramatized" | Step three: borrow trust. Theranos had famous names on its board. The cousins had Charles Tiffany. **TIFFANY:** "Gentlemen, these are beyond question precious stones of enormous value." |
| 5 | STEP 4 · salting at night | Step four: make a mine. Push the stones into an empty Colorado mesa. Even into anthills. |
| 6 | STEP 5 · banknotes, the hat leaving frame, $18 MILLION | Step five: let experts dig them up, then take the money and run. |
| 7 | STEP 6? · Clarence King (coral). **Music out** on "It worked." (0:43.9) | It worked. Until a government geologist found the field. It was too perfect. |
| 8 | Anthill cut-away + boot prints; NATURE IS NOT THAT TIDY. **Music back** at 0:48.5 | A dozen rubies by every diamond. Rubies only in anthills with boot prints. Nature is not that tidy. |
| 9 | **The loop frame:** the close-up drains to grey on "dirt"; FOR DIRT**.** The cue's closing chord hits at 0:57.7 | They hadn't sold a diamond mine. They'd sold dirt. |
| 10 | End card *(after the 0.7 s beat)* | Tap like and subscribe. The full story's linked right there. |

Facts: the $18 million is the cousins' take in today's money (×27, as in the long video); Tiffany's line is his documented quote;
the boot prints are ch 7's. Theranos is a matter of public record (its founder was convicted of defrauding investors in 2022, and
its board was full of famous names); it's named, not shown (no logo), and no politician is named.

## Music: `dh_salted_theme` all the way through

"A sly, smug main theme… like a con man smiling at his mark": a muted-cornet motif over parlor piano, pizzicato and tuba.
- **From 0:00** under the hook and the steps: the sly intro, with its brass hits at 2.5 s and 5 s near the top.
- **The twist:** the bed cuts out on "It worked." (0:43.9) and stays out through "too perfect." (back at 0:48.5).
- **The payoff:** the bed comes back from later in the cue, timed so its closing unresolved chord (at 1:55.0 in the file, fading
  out by 1:57) hits on "dirt" in "They'd sold dirt." Segment 2 starts at Short time 48.5 s from cue 105.9 s (offset 57.41 s);
  measured: the chord lands at 0:57.7, on the word. Timings in `heist_music_timing.json`.
- Level with `bed('dh_salted_theme')` (−16.0 LUFS file), a little louder in the gap and on the chord.

## The cover frame (frame 0, and the frame picked as the thumbnail)

The cover has to win the scroll at three sizes: full screen under YouTube's buttons and title, the grid tile on the channel and
home page, and the tiny tile in search and the Shorts shelf. `heist_cover_feed_test.jpg` shows all three for each candidate, with
YouTube's overlay mocked on top.

- **C · The reaction (chosen):** the tycoon's shocked face fills the frame; "$18 MILLION" above, "FOR DIRT?" below. A face
  with a strong emotion, two short phrases and one question: the only one that still reads at the tiny size.
- **A · How to Sell Dirt:** the Short's title as the cover; reads well big, gets busy small (two cousins, three strips of tape).
- **B · Real Diamonds. Fake Mine.:** the video's paradox in four words; striking, but a pale stone on a dark night is lower
  contrast than a face.

Rules from the test: nothing to read under the button column (x > 930 from y 900 down) or under the title (bottom ~400 px);
four to five words at most, in two strips; one face or one object, big; it makes sense with the sound off. The cover is
**baked into frame 0** of the video, so it's what plays first in the feed and what you pick in the app's thumbnail picker.
Custom thumbnail uploads for Shorts are rolling out unevenly (reports conflict), so if Studio offers one, upload the same frame.
The loop ending answers the cover: the same close-up drained to grey, "$18 MILLION / FOR DIRT." When the Short replays, the coral
face and the "?" snap back (`heist_loop_pair.jpg`).

## Tiffany's voice

No recording of Charles Tiffany exists, so this is a designed voice from ElevenLabs Voice Design, not an imitation of a real
voice: "an American man about sixty, a famous New York jeweler in 1871… refined, unhurried, a warm, slightly gravelly baritone,
precise old-fashioned East Coast diction". Three previews in `tiffany_voice_previews.mp3` (1, 2, 3), each reading his real quote
twice; the IDs are in `tiffany_voice_previews.json`. **You picked 1**; it's saved in your ElevenLabs voices as "Tiffany (1871)"
(voice ID `wX4dd0ceYzYhDrlIJgBx`).

- Only his documented words go in his mouth: the one quote, nothing invented.
- A voice change is a pattern interrupt, a natural retention beat at about 0:15.
- On screen, his words write on in his handwriting-style quote as he speaks, with a small tag "his words, 1871 · voice
  dramatized", so nobody takes it for a recording. The upload's "Altered or synthetic content" box covers it too.
- The same idea could work in long videos for a period quote that matters (one or two per video, not every quote).

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

## Next steps

1. ~~Voice it~~ Done Nov 3 (see the script section).
2. Build it as a real Short from the storyboard (motion, timing to the words, the slips, the music plan above), render, master to
   -14 LUFS, check frames at phone size.
3. Post it with the text (title "How to Sell Dirt for $18 Million", Related video = the full video, "Altered or synthetic
   content" Yes).
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
