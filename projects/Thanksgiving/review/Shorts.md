# Thanksgiving Shorts

Native 1080×1920 Shorts for *From Eels to This: How the Thanksgiving Menu Was Invented*. Code: `video/src/shorts/` (shared
`vkit.tsx`). Frame sheets (frame 0, every 1 s to 6 s, then every 2 s, and the end card, at phone size):
`review/shorts/short2_sheet.jpg`, `short3_sheet.jpg`. **Stills only so far: not rendered.**

**Covers.** Each Short has a cover composition, `VShort2Cover` / `VShort3Cover` (1080×1920, one frame): it renders the Short itself
at frame 0, so the cover and the first frame are the same picture, pixel for pixel (checked), fully drawn with no fade-in.
Stills: `renders/shorts/From_Eels_To_This_Short2_cover.png/.jpg`, `From_Eels_To_This_Short3_cover.png/.jpg`.

**Render and master (not run yet):** from `video/`,
`npx remotion render src/index.ts VShortN out/shorts/vshortN.mp4 --crf=18`, then `tools/shorts_master.sh N`: it runs
`tools/master.py` (−14 LUFS) and muxes the cover JPEG in as `attached_pic` (`-map 0 -map 1 -c copy -disposition:v:1 attached_pic`),
writing `renders/shorts/From_Eels_To_This_ShortN.mp4`.

**The set:** Short 3 (turtle soup, its own voiced narration) and Short 2 (turkey). **Short 1 (cranberry) is dropped:** it is
replaced by Short 3. The composition `VShort1` stays registered in `Root.tsx` but is unused; don't render or post it.

Post the turtle Short first (the strongest picture hook), the turkey Short the next day.

---

## Short 3: Step one, cut off its head (replaces Short 1)

**Title:** 1796 Recipe, Step One: Cut Off Its Head (39 characters)

**Description:**
"About nine o'clock, hang up your Turtle by the hind fins, cut off the head and save the blood." That's step one of an American
recipe from 1796. Turtle soup was the fanciest dish in America, so people who couldn't afford it faked it with a calf's head. Full
story on the channel: From Eels to This

#thanksgiving #turtlesoup #history

**Pinned comment:** Would you have eaten the real turtle soup or the mock one?

**Narration:** its own, voiced for the Short (`video/public/audio/short3_turtle.wav` and `.words.json`; script
`video/script/shorts/short3_turtle.txt`), **re-ordered** with the splice builder so the quote comes first. Every cut falls in
digital silence (checked), so no clicks. Composition `VShort3`.

| Short | Source | Line |
|---|---|---|
| 0.25–7.11 s | short3_turtle.wav 5.04–11.90 s | "About nine o'clock, hang up your Turtle by the hind fins, cut off the head and save the blood." That's step one. |
| 7.41–11.89 s | short3_turtle.wav 0.36–4.84 s | In 1796, an American cookbook told you how to start dinner. |
| 12.19–44.33 s | short3_turtle.wav 12.12–44.26 s | Turtle soup was one of the fanciest dishes in America. … The fake outlasted the real thing. |

Length: 44.63 s of story plus a 3.0 s end card, **47.6 s**. Music: `tg_parlor_waltz` at `bed()`. No sound effects.
"cut off the head" is spoken at 3.75–4.2 s.

**Scenes** (Short time):
- 0–3.7 s, cover, teal: the green turtle cut-out hanging upside down by its hind flippers from an iron hook under a beam (two
  cords knotted in the hook's bowl, each wrapped three turns across a flipper), swaying slowly like a pendulum (already at full
  swing on frame 0); the 1796 recipe scrap (the quote swiped coral) beside it; "1796 recipe, step one: / CUT OFF / ITS HEAD".
  Stark, not gory: no blood, the head intact.
- 3.7 s "cut off": closer, still swaying; the two quoted lines of p. 20, big, swiped as they are spoken.
- 6.0 s "That's step one.": the same picture on the coral desk (nothing new to read).
- 7.3 s "In 1796": the title page of *American Cookery*, a slow push; a loop on its date on "cookbook".
- 12.2 s on: as before (the dining hall, the dock, = MONEY, FAKED IT and the calf's head, p. 22, the M1 dissolve and MOCK, the
  100-turtle grid and −97%, the hanging turtle fading on "Turtle soup disappeared.", THE FAKE OUTLASTED THE REAL THING).
- 44.6 s: end card ("the full story: FROM EELS TO THIS · on the channel") over the cover picture, so the replay loops.

**Facts to keep:** the quotation is Simmons's own text (p. 20, 1796, "about 9 o'clock hang up your Turtle by the hind fins, cut of the
head and save the blood"); the calf's head recipe is the same book, p. 22. "About ninety-seven percent" is the estimated decline of
Caribbean green turtles (phys.org 2018, Oceanic Society), as in Ch04.


## Short 1: Why is cranberry sauce shaped like a can? (DROPPED: replaced by Short 3)

*Kept for the record. `VShort1` is still registered but unused: don't render or post it.*

**Title:** Why Is Cranberry Sauce Shaped Like a Can? (42 characters)

**Description:**
It's shaped like a can because… it IS the can. In 1912 a cranberry grower had a problem: fresh berries only sell for a few weeks a
year. Full story on the channel: From Eels to This: How the Thanksgiving Menu Was Invented

#thanksgiving #cranberrysauce #history

**Pinned comment:** Jellied log with the ridges, or homemade sauce: which one is on your table?

**Spliced lines** (Short time · source · words). There is a 0.4 s beat before the answer.

| Short | Source | Line |
|---|---|---|---|
| 0.25–3.21 s | ch01_cold_open.wav 49.84–52.80 s | And why is the cranberry sauce shaped like a can? |
| 3.51–9.39 s | ch01_cold_open.wav 34.14–40.02 s | And we open about seventy million cans of cranberry sauce a year, most of them in about two months. |
| 9.69–25.99 s | ch07_test_kitchens.wav 36.16–52.46 s | But in 1912, a cranberry grower named Marcus Urann had a problem. Fresh berries only sell for a few weeks a year. His fix: cook them down and put them in a can. In 1941, his growers' cooperative took its brand national. Ocean Spray. |
| 26.69–30.95 s | ch07_test_kitchens.wav 57.22–61.48 s | Because it IS the can. Those ridges are the can's ridges. |

Length: 31.25 s of story plus a 3.0 s end card, **34.2 s**. Music: `tg_test_kitchen` at `bed()`.

**Scenes:**
- Cover, 0–2.5 s, teal: the log standing on the plate beside the can (cran2 frame 6), with "IT'S SHAPED / LIKE A CAN / BECAUSE…".
- The close-up stop-motion slides the log out (cran 1→5).
- Seventy million: the counter climbs as seven cans drop in, then a drawn year lights up its last two months.
- 1912, Marcus Urann (his name in type): the scoop; then the barrel and the 52-week grid (a few coral weeks); then the pot, the can drops in and all 52 weeks fill.
- 1941 / OCEAN SPRAY over the Empress label, tagged "Not Ocean Spray".
- Coral flash on "Because it IS the can".
- The cover framing again, with a loupe on the log's ridges and a loop on the can's.
- End card over the cover picture, so the replay loops.

## Short 2: This turkey can't mate on its own

**Title:** This Turkey Can't Mate on Its Own (33 characters)

**Description:**
This turkey can't mate on its own: nearly every one now comes from artificial insemination. It isn't a GMO: farmers bred it the
old-fashioned way, from about 13 pounds in the 1930s to over 30 today. Full story on the channel: From Eels to This: How the
Thanksgiving Menu Was Invented

#thanksgiving #turkey #history

**Pinned comment:** Have you ever had a heritage turkey, or only the supermarket kind?

**Spliced lines** (the hook first; the mating lines are not repeated later; every cut in digital silence, checked):

| Short | Source | Line |
|---|---|---|
| 0.25–4.35 s | ch08_turkey.wav 46.70–50.80 s | It worked so well that the birds got too top-heavy to mate on their own. |
| 4.65–8.47 s | ch08_turkey.wav 53.54–57.36 s | So nearly every one of them now comes from artificial insemination. |
| 8.77–14.65 s | ch08_turkey.wav 5.16–11.04 s | You may have heard it's a GMO turkey. It isn't. Nobody edited its genes in a lab. |
| 14.95–19.81 s | ch08_turkey.wav 11.10–15.96 s | They did it the old-fashioned way: pick the biggest birds, breed them, and repeat. |
| 20.11–24.75 s | ch08_turkey.wav 25.64–30.28 s | Then in the 1950s, they swapped the turkey's dark feathers for white ones. |
| 25.05–31.93 s | ch08_turkey.wav 39.62–46.50 s | In the 1930s, an average turkey weighed about thirteen pounds, live. Today, it's over thirty. |
| 32.23–34.81 s | ch08_turkey.wav 50.84–53.42 s | The males are too heavy. The shape is wrong. |
| 35.11–36.23 s | ch08_turkey.wav 65.12–66.24 s | Happy Thanksgiving. |

Length: 36.53 s of story plus a 3.0 s end card, **39.5 s**. Music: `tg_turkey` at `bed()`. "mate on their own" is spoken at 3.35–4.15 s.

**Scenes:**
- Cover, 0–4.6 s, teal: the heavy white bird on its scale, tipped forward 17° on its thin legs and rocking on its toes, the
  counter already at 30+ LB, under "THIS TURKEY / CAN'T MATE / ON ITS OWN" (128 px).
- 4.6 s "So nearly every one": a flock of 20 identical heavy birds; the "artificial insemination" slip.
- 8.7 s: the USDA Large White photo, "a GMO turkey?" struck through on "It isn't"; 12.4 s "Nobody edited its genes": in close on the head.
- 14.9 s: pick / breed / repeat: three rows of bronze birds, each bigger; the two biggest ringed, arrows down.
- 20.1 s: 1950s, the bronze bird wiped to white. 25.0 s: 1930s, the dial and counter land on 13.
- 30.0 s: TODAY, the counter runs to 30+ while the body inflates over "same thin legs".
- 33.3 s "too heavy": the bird tips; on "The shape is wrong" a loupe on the legs.
- 35.1 s: coral flash on "Happy Thanksgiving.", the bird alone.
- End card over the cover picture, so the replay loops.

The rig (`kit/tg_turkey.tsx`, new optional `tipDeg` and `teeter`) is mirrored to face right in this Short.

---

## Checklist

| | Short 1 (dropped) | Short 2 | Short 3 |
|---|---|---|---|
| Cover fully drawn on frame 0 (wordmark too); cover composition = frame 0 | yes | yes (`VShort2Cover`, type 128 px) | yes (`VShort3Cover`, type 132 px, the hanging turtle and the recipe scrap) |
| First line (hook by 5 s) | a question; a startling number at 3.5 s | "…too top-heavy to mate on their own" (by 4.2 s) | the quote: "…cut off the head and save the blood" (by 4.2 s) |
| Nothing to read in the first 15 s | the cover type, a counter, a year and a name only | the cover type, the counter, one slip, "a GMO turkey?" | exception, by design: the 1796 quote is the hook (0–7 s), swiped as it is spoken and captioned |
| Picture changes every 3–5 s | longest hold 5.8 s (1941 scan, with OCEAN SPRAY landing mid-shot) | longest 5.2 s (the generation rows, animating) | longest 5.5 s (the turtle grid, animating); title page 4.9 s with a push |
| Running device | the counter → the 52-week grid filling | the rows of generations → the dial and counter | the recipe's steps (step one → the calf's head steps) → the counter |
| Answer said out loud | "Because it IS the can." | "Today, it's over thirty. The males are too heavy. The shape is wrong." | "The fake outlasted the real thing." |
| Last frame matches the cover (loop) | yes (the end card sits over the cover picture) | yes | yes (the end card sits over the cover picture) |
| Safe zones | all text in x 60–930, y 150–1150; captions at 1185; tags at 1490 | same | same |
| Captions | Inter 800, three words, the spoken word in orange | same | same |
| Text holds ≥ 2.5 s (`tools/audit_text.mjs`: only captions flagged) | yes (OCEAN SPRAY lands on "brand national", 2.97 s) | yes | yes; p. 22 in full view 3.1 s |
| Sound | voice and one tg_ cue; no sound effects | same | its own narration and tg_parlor_waltz; no sound effects |

**On upload:**
- Set "Altered or synthetic content" to Yes (the voice clone).
- Set "Not made for kids".
- Set "Related video" to the full video.
- Pick the cover from frame 0 (or upload the cover JPEG; the mastered mp4 also carries it as attached_pic).
