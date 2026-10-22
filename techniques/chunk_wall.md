# The chunk wall: the channel's recurring device

*Chunk History* explains history in chunks that add up to the bigger picture. The chunk wall makes that visible in every
video: each chapter is a block that slides into a wall, and the end of the video pulls back to show the whole wall, then
the wall becomes one block in the channel's own wall.

First designed for the Reconstruction series (`projects/Reconstruction/WALL.md`); mockups in
`projects/Reconstruction/review/wall_mockups/`; prototype code in
`projects/Reconstruction/tests/src/tests/WallBricks.tsx` (to move into the template kit once the animated version is
approved).

## Three scales

1. **The video wall.** One wall per video, built chapter by chapter. Every chapter adds one chunk.
2. **The series wall.** A multi-part series keeps one wall: Part 2 opens on Part 1's wall (Reconstruction).
3. **The channel wall.** Every video is one block; the courses are eras (1770s–1810s, 1820s–1850s, 1860s–1870s,
   1880s–1920s…). At the end screen, the video's own wall shrinks into its block on the channel wall. **Its neighbours are
   the end-screen suggestions**, so "watch next" is literally the next chunk over, and the empty blocks are videos still
   to come.

## The look

- **The wall** is courses of chamfered blocks in staggered rows: the brand's *chunks* pattern
  (`brand/chunk-history/final/pattern-chunks.svg`). Empty blocks are the pattern's dark teal (`#1b2a28`), a few in dark
  coral (`#2a1d1b`). Mortar is near-black.
- **A chunk is one of those blocks, not a card on top of them.** Same height as a course, same 12 px chamfer, sitting flush
  in the row, with a lit face (`#22302d`), a teal rim, an archival picture or a document crop on the left and, on the
  right, a mono date and a two-to-five-word label in Abril. The chapter's subject chunk gets a **coral** rim.
- **Column headers** are solid blocks in the brand colours with black Abril type: two to four of them, naming the parts of
  the video's driving question. They appear only when the story earns them.
- **Strings** are causes. Teal, glowing slightly, they run **along the mortar lines** and carry a handwritten *but* or
  *therefore* where they turn. Dashed = suspected, not proven.

## States a chunk can be in

| State | Looks like | Means |
|---|---|---|
| Whole | lit face, teal rim | it happened, it stands |
| Subject | coral rim | the chapter's (or the video's) main chunk |
| Dim | half-faded | set up, pays off later (the Freedmen's Bureau before Episode 2) |
| Cracked | ink cracks across the face (the brand's *cracks* pattern) | it happened, but it failed or was undermined (LAND in Reconstruction) |
| Knocked out | a dark hole in the wall; the block lies at the foot of the wall | it was taken away (PROTECTION, 1877) |

## Motion

- **A chunk lands** on its chapter's last line: it slides into its gap (12 frames, ease out, a small lift and shadow),
  with the brand intro's soft knock. Never a stamp.
- **A string draws** along the mortar as the narration says the link, stepped at 12 fps like every other mark.
- **Chapter starts** may open on the wall for a beat (a quick push to the empty gap the chapter will fill) instead of the
  logo break, once per video at most, so it doesn't wear out.
- **The episode ending** pulls back to the whole wall over the closing lines, then the end screen shrinks it into its
  block on the channel wall.

## Writing for the wall

- Every chapter ends on a line that can be its chunk: short, concrete, a takeaway. Most scripts already do this.
- Pick the **columns** from the driving question. Examples (not used yet):
  - *Dressed to Kill*: BEAUTIFUL · DEADLY · WHO HAS TO PROVE IT
  - *The Exact Spot*: THE LAND · THE WAR · THE QUESTION IT REOPENED
  - *Say It Ain't So*: THE BETS · THE GAME · THE RULES
- Say "wall" out loud only at recaps and endings ("Step back and look at the whole wall."); everything else is shown.

## Shorts

A Short is one chunk: the vertical frame holds a single block, which flips to show its picture and line, and the last
card shows it sliding into the channel wall with "the full chunk ↓".

## What it costs

All 2D (no WebGL), so it renders quickly. The layout is generated: give it the chunks' course, position and width, and
the empty blocks fill in around them, staggered.
