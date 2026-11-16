# Gilded Age thumbnail style ("the neon silhouette")

Set with Ep 3 (immigrant woman) and Ep 4 (Boss Tweed). Reusable for the finale. Template: `src/ep4_thumb.mjs` (Playwright, 1280x720).
Picks: Ep 3 `options/ep3_A_hand.jpg`; Ep 4 `options/ep4_C_teal.jpg`.

## Recipe
1. **Base image from Google Flow** (16:9). One subject on the right third, the left 40% left dark and empty for the headline.
   Real people stay **faceless** (silhouette from behind, or in shadow): never a generated likeness. A real face, if wanted,
   comes from a public-domain cartoon composited in.
2. **Cutout** of the subject with rembg (`isnet-general-use`), keep the largest blob, dilate 2 px. Save as PNG.
   If the subject is cropped by the bottom edge, pad the PNG 80 px downward (repeat the last row) and size the `<img>` to match,
   so the **neon outline never runs along the cut-off edge** (legs, shoulders).
3. **Neon teal outline** (#2FE0C4) on the cutout only: four 3 px `drop-shadow` offsets plus 10 px and 26 px glows.
4. **Darken the background** (`brightness .42` to `.62`), a left-to-right black shade for the text, and a soft teal radial rim light behind the subject.
5. **Headline** on **jagged torn orange strips** (#FF9F1C), **Abril Fatface**, ink text, tilted -2 to -3 degrees, stacked (two words, one strip each),
   made with the same `tornClip` as `lookdev/text.js` (seeded jagged top and bottom edges) plus a drop shadow. Not a plain rectangle, not a sans font.
6. **Setup line** under the strips, either: handwritten teal (Nanum Pen Script, ~90 px, tilted), or a small torn strip (orange or **teal** with ink text).
7. **Series label** top-left: "The Gilded Age" in gold Abril with a gold "PART N" mono tag.
8. Keep the bottom-right corner clear (YouTube's duration badge). 2 to 4 words in the headline; the second line is the hook.

## Text hooks that fit the style
A question, a paradox or a number: LIFE WAS TOUGH / for new immigrants; BOSS TWEED / stole millions; $179,729 FOR CHAIRS?; CAUGHT BY A CARTOON.

## Files
`src/ep3_thumb.mjs`, `src/ep4_thumb.mjs` (template), `src/img/` (Flow bases and cutouts), `options/` (outputs), `FLOW_PROMPT_EP1.md` (earlier prompt notes).
