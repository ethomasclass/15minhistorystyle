# Thanksgiving Shorts

Native 1080×1920 Shorts for *From Eels to This: How the Thanksgiving Menu Was Invented*. Code: `video/src/shorts/` (shared
`vkit.tsx`). Frame sheets (frame 0, then a frame every 2 s, at phone size): `review/shorts/short2_sheet.jpg`, `short3_sheet.jpg`.
**Stills only so far: not rendered.**

**The set:** Short 3 (turtle soup, its own voiced narration) and Short 2 (turkey). **Short 1 (cranberry) is dropped:** it is
replaced by Short 3. The composition `VShort1` stays registered in `Root.tsx` but is unused; don't render or post it.

Post the turtle Short first (the strongest picture hook), the turkey Short the next day.

---

## Short 3: Hang up your turtle (replaces Short 1)

**Title:** 1796 Recipe, Step One: Hang Up Your Turtle (42 characters)

**Description:**
In 1796, an American cookbook's turtle soup started with "hang up your Turtle by the hind fins." Turtle was the fanciest dish in
America, so people who couldn't afford it faked it with a calf's head. Full story on the channel: From Eels to This

#thanksgiving #turtlesoup #history

**Pinned comment:** Would you have eaten the real turtle soup or the mock one?

**Narration:** its own, voiced for the Short: `video/public/audio/short3_turtle.wav` and `.words.json` (45.1 s, 116 words; script
`video/script/shorts/short3_turtle.txt`), used whole with no splicing. Composition `VShort3` (`video/src/shorts/VShort3.tsx`).
Length: 45.1 s of story plus a 3.0 s end card, **48.1 s**. Music: `tg_parlor_waltz` at `bed()`. No sound effects.

**Scenes** (Short time):
- 0–2.7 s, cover, teal: the green turtle cut-out, big, with the Simmons recipe scrap (the quoted lines swiped coral), under
  "1796, step one: / HANG UP / YOUR TURTLE".
- 2.7 s "cookbook": the 1796 title page of *American Cookery* lands; a loop on its date.
- 5.0 s: Simmons p. 20, full frame; "To Dress a Turtle" and the two quoted lines lit and swiped coral as they are spoken (5.8 s, slow push).
- 10.8 s "That's step one.": the swiped lines alone on the coral desk, held.
- 12.2 s: the drawn dining hall, cropped to portrait on the waiter and the turtle tureen: THE FANCIEST / DISH IN AMERICA.
- 15.6 s: the drawn turtle dock, the crate with the turtle coming down: "shipped up alive" / "from the Caribbean".
- 19.7 s: the tureen drops in; "turtle on your table" = MONEY; on "people who didn't" it fades to grey.
- 23.9 s: FAKED IT, "the same 1796 cookbook:", and the calf's head drops in on "calf's head".
- 27.5 s: Simmons p. 22 ("To dress a Calve's Head. Turtle fashion."); "the head" swiped on "Open it up", "taking the brains" on "Take out the brains".
- 29.9 s: the M1 dissolve, calf's head into the tureen, "more or less"; the orange MOCK tape slaps on "Mock turtle".
- 34.5 s: 100 drawn turtles; the stepped counter runs to −97% as 97 go grey, and the last 3 turn coral.
- 40.0 s "Turtle soup disappeared.": the cover's turtle fades away.
- 41.8 s: the tureen with its MOCK tape: THE FAKE / OUTLASTED / THE REAL THING.
- 45.1 s: end card ("the full story: FROM EELS TO THIS · on the channel") over the cover picture, so the replay loops.

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

## Short 2: The Thanksgiving turkey was redesigned

**Title:** The Thanksgiving Turkey Was Redesigned (38 characters)

**Description:**
This turkey can't mate on its own. It isn't a GMO: farmers bred it the old-fashioned way, from about 13 pounds in the 1930s to
over 30 today. Full story on the channel: From Eels to This: How the Thanksgiving Menu Was Invented

#thanksgiving #turkey #history

**Pinned comment:** Have you ever had a heritage turkey, or only the supermarket kind?

**Spliced lines:**

| Short | Source | Line |
|---|---|---|---|
| 0.25–6.13 s | ch08_turkey.wav 5.16–11.04 s | You may have heard it's a GMO turkey. It isn't. Nobody edited its genes in a lab. |
| 6.43–11.29 s | ch08_turkey.wav 11.10–15.96 s | They did it the old-fashioned way: pick the biggest birds, breed them, and repeat. |
| 11.59–16.23 s | ch08_turkey.wav 25.64–30.28 s | Then in the 1950s, they swapped the turkey's dark feathers for white ones. |
| 16.53–23.41 s | ch08_turkey.wav 39.62–46.50 s | In the 1930s, an average turkey weighed about thirteen pounds, live. Today, it's over thirty. |
| 23.71–34.37 s | ch08_turkey.wav 46.70–57.36 s | It worked so well that the birds got too top-heavy to mate on their own. The males are too heavy. The shape is wrong. So nearly every one of them now comes from artificial insemination. |
| 34.67–35.79 s | ch08_turkey.wav 65.12–66.24 s | Happy Thanksgiving. |

Length: 36.09 s of story plus a 3.0 s end card, **39.1 s**. Music: `tg_turkey` at `bed()`.

**Scenes:**
- Cover, 0–3 s, teal: the heavy white bird on its scale, with "THIS TURKEY / CAN'T MATE / ON ITS OWN".
- The USDA Large White photo, with "a GMO turkey?" struck through on "It isn't".
- Pick / breed / repeat: three rows of bronze birds, each row bigger than the last; the two biggest are ringed and an arrow runs down to the next row.
- 1950s: the bronze bird is wiped to white.
- 1930s: the dial and the counter, stacked top-left, land on 13.
- TODAY: the counter runs to 30+ while the body inflates over "same thin legs".
- TOO TOP-HEAVY: the bird tips; on "The shape is wrong" a loupe goes on the legs.
- A flock of 20 identical heavy birds, with an "artificial insemination" slip.
- Coral flash on "Happy Thanksgiving.", the bird alone.
- End card over the cover picture, so the replay loops.

The rig (`kit/tg_turkey.tsx`) is mirrored to face right in this Short, so the head clears the cover type.

---

## Checklist

| | Short 1 (dropped) | Short 2 | Short 3 |
|---|---|---|---|
| Cover fully drawn on frame 0 (type 112–118 px, wordmark) | yes | yes | yes (type 132 px, the turtle and the recipe scrap, wordmark) |
| First line | a question; a startling number at 3.5 s | the myth ("a GMO turkey") | a date and a scene: "In 1796, an American cookbook told you how to start dinner." |
| Nothing to read in the first 15 s | the cover type, a counter, a year and a name only | the cover type, "a GMO turkey?", one note, "1950s" | exception, by design: the 1796 quote is the hook (5–10.8 s), swiped as it is spoken and captioned |
| Picture changes every 3–5 s | longest hold 5.8 s (1941 scan, with OCEAN SPRAY landing mid-shot) | longest 4.9 s | longest holds 5.8 s (the quote page, with a push and the swipe) and 5.5 s (the turtle grid, animating) |
| Running device | the counter → the 52-week grid filling | the rows of generations → the dial and counter | the recipe's steps (step one → the calf's head steps) → the counter |
| Answer said out loud | "Because it IS the can." | "Today, it's over thirty." / "artificial insemination" | "The fake outlasted the real thing." |
| Last frame matches the cover (loop) | yes (the end card sits over the cover picture) | yes | yes (the end card sits over the cover picture) |
| Safe zones | all text in x 60–930, y 150–1150; captions at 1185; tags at 1490 | same | same |
| Captions | Inter 800, three words, the spoken word in orange | same | same |
| Text holds ≥ 2.5 s | yes (OCEAN SPRAY lands on "brand national", 2.97 s) | yes ("artificial insemination" lands on "now comes", 2.7 s) | yes (shortest: "the same 1796 cookbook", 2.7 s; "shipped up alive", 2.8 s) |
| Sound | voice and one tg_ cue; no sound effects | same | its own narration and tg_parlor_waltz; no sound effects |

**On upload:**
- Set "Altered or synthetic content" to Yes (the voice clone).
- Set "Not made for kids".
- Set "Related video" to the full video.
- Pick the cover from frame 0.
