# The collage board: the channel's recurring device

*Chunk History* explains history in chunks that add up to the bigger picture. The collage board makes that visible:
each chapter pins one piece to a board on the desk, teal yarn ties causes to effects, and the end of the video pulls back
to show the whole board.

Look in progress: the cut-paper collage in the channel's colours (mockups `F2`–`F4` in
`projects/Reconstruction/review/wall_mockups/`), with mockup **D**'s tilted desk (`D_map_table.jpg`) for moving between
the board and the 3D maps. Prototype code: `projects/Reconstruction/tests/src/tests/CollageMocks.tsx` (to move into the
template kit once the animated version is approved). The block-in-the-wall "chunk wall" was tried and set aside.

**No case-file or crime language** (Oct 2026). It's a desk of history, not a detective's board: labels name the thing
and its date ("Field Order 15 · Jan 1865", "APRIL 14, 1865"), never "case", "case file", "evidence #", "suspect",
"target" or "investigation". Stamps say what happened (PARDONED, OVERRIDDEN), not verdicts on a person.

## Scales

1. **The video board.** One board per video, built chapter by chapter.
2. **The series board.** A multi-part series keeps one board: Part 2 opens on Part 1's board (Reconstruction).

## The look

- **Colours: the channel's** (your pick over the reference's single hot orange): coral sticky notes, stamps and pins;
  teal thread and handwriting; orange only for titles. The **Chunk History logo** sits on the board as a faded, worn sticker
  (the horizontal lockup under a wear mask from `tools/distress.py`), small, in a corner.

- **The board** is the channel's dark desk paper, with the brand's *cracks* pattern very faint. It lives on the desk,
  so the camera can tilt from the board down onto the desk and the 3D maps (mockup D).
- **A piece** is a photo with **no frame**: cropped out of its mount and run through `tools/crease.py` so it looks like a
  creased, worn old print (folds, fine cracks, chipped and torn edges). Documents are torn paper scraps. Labels are torn,
  typewritten strips; questions go on sticky notes in the handwriting; outcomes are rubber stamps (the collage look,
  mockups `F*`). The chapter's subject piece gets the coral tint (coral pin, coral
  label); everything else stays black and white.
- **Pins** are teal (coral for the subject piece).
- **The open question** gets a cut-paper silhouette: a real portrait traced into a solid profile (`tools/silhouette.py`,
  from a public-domain engraving or photo of an unidentified sitter, never a named person), mounted on a torn cream card
  like a parlour silhouette, with a coral question mark.
- **Yarn** is teal and runs pin to pin with a little sag. Where it says something, a small cream paper tag reads *but*
  or *therefore* in the teal handwriting. Dashed yarn = claimed, not proven.
- **Column names** (two to four, the parts of the video's driving question) are chalked on the board in the
  handwriting. They appear only when the story earns them.

## States a piece can be in

| State | Looks like | Means |
|---|---|---|
| Pinned | upright, teal pin | it happened, it stands |
| Subject | coral tint and pin | the chapter's (or the video's) main piece |
| Faded | half-transparent | set up, pays off later |
| Struck | a teal (or orange, for a disputed claim) line through the label | it failed or was undone |
| Torn down | the card hangs from one pin, or lies on the desk under the board | it was taken away |

## Motion

- **A piece lands** on its chapter's last line: it drops onto the board (the `DropCard` spring) and the pin goes in
  with a soft knock.
- **Yarn draws** pin to pin as the narration says the link, stepped at 12 fps like every other mark; its tag pops on
  at the end.
- **Close-ups**: the camera pushes in on two or three pieces and draws yarn between them while the rest of the board
  goes dark (one night, three men: Lincoln, Seward, Johnson; the 1877 deal).
- **The ending** pulls back to the whole board over the closing lines.

## Writing for the board

- Every chapter ends on a line that can be its piece: short, concrete, a takeaway. Most scripts already do this.
- Pick the **columns** from the driving question. Examples (not used yet):
  - *Dressed to Kill*: BEAUTIFUL · DEADLY · WHO HAS TO PROVE IT
  - *The Exact Spot*: THE LAND · THE WAR · THE QUESTION IT REOPENED
  - *Say It Ain't So*: THE BETS · THE GAME · THE RULES
- **Never name it.** No "board" or "wall" in the narration: recaps and endings simply play over it.

## What it costs

All 2D (no WebGL), so it renders quickly.
