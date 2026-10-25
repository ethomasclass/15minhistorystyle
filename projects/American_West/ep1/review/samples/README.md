# West series: style samples (stills only)

Fifteen 1920×1080 stills, one per option, plus one contact sheet per scene (`sheet_S1_spike.jpg` … `sheet_S5_system.jpg`;
the file name under each tile is the option). Option **A** is closest to the current channel look; **B/C** lean further into
the collage ideas in `GRAPHICS_BRAINSTORM.md`. Everything sits on the black desk (`DarkPaper`): no cream or white cards, mounts
or sticker edges. The only light tones are the archival scans themselves.

- Code: `src/samples/` (`kit.tsx` = the new pieces, one file per scene, compositions registered in `src/Root.tsx` as
  `S1-Spike-A` … `S5-Resist-B`, 90 frames each). Re-render all stills with `node src/samples/stills.mjs review/samples`
  (frame 84, after every mark has landed).
- Images and sources: `public/img/samples/` + `CREDITS.md`. All real archival files (LOC, Wikimedia Commons). No AI images.
- Checks: `npx tsc --noEmit` passes; `tools/probe_text.mjs` over all 15 compositions: no text crosses the frame edge.

## 1 · Cold open: the golden-spike photo (`sheet_S1_spike.jpg`)

| Option | What it is | Brainstorm idea |
|---|---|---|
| **A** `S1-Spike-A` | Current look. Russell's photo full-bleed with a slow push. One coral figure with a teal trace (S. S. Montague, the CP's chief engineer, shaking hands). Teal loops round the men on both engines, "look at the faces.", and MAY 10, 1869 on orange tape. | the baseline |
| **B** `S1-Spike-B` | The photo as a **torn print**: deckled edges with no border, a hard ink offset shadow, and two strips of orange tape. The bottom-right corner is torn away to bare desk ("who's missing?" with an arrow into the gap). A small **dark map card** (1868 War Dept. map) pins Promontory. NOT IN THE PICTURE on tape. | #4 torn print, #8 map card |
| **C** `S1-Spike-C` | B plus a **cut-out of a Central Pacific Chinese worker** (Hart, Tunnel No. 8, with his carrying pole and buckets) standing in the torn gap. He becomes the frame's one coral subject (tint + teal trace + ink shadow), and the print goes plain B&W. | #11 cut-outs; thumbnail direction 1 |

**What works:** C is the strongest frame of the set: the torn gap plus the worker says the episode's thesis without a word, and it
doubles as the "Who's missing?" thumbnail. B is a cheap, safe upgrade over A and still reads as the channel. The map card is legible as
"a place" even at this size.
**What doesn't:** In B/C the print shrinks the crowd, so Montague's tint in B is small (this is fine for a cold open but not for a
"look at the faces" beat; use A's full-bleed push for that line and cut to B/C on "aren't in it"). The worker in C is only about 490 px tall in
the stereo half (shown at 0.88×); edges are hand-traced and clean, but the figure is soft next to Russell's sharp print. The
map card's crop is dark and generic; with the real series map it will read better.

## 2 · Land-grant checkerboard (`sheet_S2_checkerboard.jpg`)

| Option | What it is | Brainstorm idea |
|---|---|---|
| **A** `S2-Checker-A` | Flat diagram: two townships (6×6 sections, real section numbering) in teal on the desk. The coral rail line draws across the middle, and odd sections fill orange behind it at 12 fps (railroad); even sections stay open (government). Legend in mono. The first page of the 1862 Act sits beside it as a taped torn print. | #1 survey grid |
| **B** `S2-Checker-B` | The same plat **tilted onto the desk** in perspective (three townships wide), the line running into the distance, the Act pinned top-right. | #1, more "object on the desk" |
| **C** `S2-Checker-C` | **Focus pull on the Act's own text** (p. 4, Sec. 3): the page lifts, everything but three lines blurs and dims, and a coral highlighter runs along "every alternate section of public land, designated by odd numbers, to the amount of five alternate sections per mile on each side of said railroad". One township fills beside it. | #3 focus pull (+ the planned `swipe`) |

**What works:** C is the best teaching frame: the law's words and the picture they make, side by side. A is the clearest diagram
and fully brand-safe. **What doesn't:** B looks great as a texture, but the tilt makes the numbers unreadable and the near rows
crowd the bottom edge. Use it as a 2-second establishing move before cutting to A or C, not as the explainer. In A, the section
numbers are a little busy; for the video, consider numbers only in the first township.

## 3 · The race (`sheet_S3_race.jpg`)

| Option | What it is | Brainstorm idea |
|---|---|---|
| **A** `S3-Race-A` | Two **locomotive cut-outs** with a hard ink shadow, nose to nose across the frame, the UP's own 1869 survey map (Dodge) as a torn strip between them. The CP engine is the coral subject (tint + teal trace). Orange name tags, "east from Sacramento" / "west from Omaha", "paid by the mile". | #11 cut-outs |
| **B** `S3-Race-B` | The same, but the CP engine is lifted by a **coral offset shadow** instead of tint and trace (still one coral subject). | #6 offset coral shadow |
| **C** `S3-Race-C` | Each engine stays **inside its own torn photo print**, taped, the map strip laid across both. | #4 torn prints |

**What works:** A has the most energy, and the coral offset in B is graphic and readable at thumbnail size. C is the most
"archival" and the least work per shot. **What doesn't / caveats (please read):**
- **The CP engine is mirrored.** On a west-left map the CP engine sits on the left and must face east (right). The only sharp
  period CP side view I found, Hart's *Goliah*, faces west (left). Carbutt's 1866 UP engine already faces west, so it sits on the
  right unchanged. I mirrored the *Goliah* and flipped its "27" number plate and cab nameplate back so they read correctly. The
  tag says "mirrored". If you'd rather not mirror an archival photo, the honest alternatives are (a) find side views of *Jupiter* and
  *No. 119* that face the right way (CSRM or the UP Museum may have them), or (b) let both engines face west and drop the
  "facing each other" idea.
- The UP cut-out (Carbutt, 1866, from a stereo half) is much softer and grainier than the Hart print, and its mask is a hand-traced
  polygon (rembg couldn't separate the engine from the train and the grass). It holds up at this size but not in a close push.
- These are not *Jupiter* and *No. 119*. Those two engines appear only in the Promontory photos, covered in people.

## 4 · Promise Ledger (`sheet_S4_ledger.jpg`)

| Option | What it is |
|---|---|
| **A** `S4-Ledger-A` | A wide dark ledger across the desk: torn top edge with orange tape, teal rules and margin, mono column heads THE PROMISE · WHO GOT IT · WHO DIDN'T, rows EP 1–4, row 1 written in teal hand. The title is on orange tape above it. |
| **B** `S4-Ledger-B` | A narrower ledger card with its title set in orange Abril on the card, beside the torn golden-spike print (callback). Two-line entries; "the Chinese crews" in coral as the punchline, and "banned by nationality, 1882" below. |

**What works:** A reads instantly as a recurring object (empty rows promise the series), and it is the one I'd ship. B is the
better *ending* frame for Ep 1 (the callback to the photo), but coral text is an exception to the palette; use it once.
**What doesn't:** the dark ledger is close in tone to the desk. I lightened the card a touch, and it still needs the shadow and
tape to separate. If it gets lost on a small screen, a 2 px teal outer rule would fix it without adding a light surface.

## 5 · System pieces for later episodes (`sheet_S5_system.jpg`)

| Option | What it is |
|---|---|
| **Hinge A** `S5-Hinge-A` | "1862" in Abril on a torn orange box that stamps in, then a dark mono strip under it in teal: 1862 · PACIFIC RAILWAY ACT · HOMESTEAD ACT · MORRILL ACT. Big, on the bare desk, with a "remember this year" note. |
| **Hinge B** `S5-Hinge-B` | The same stamp smaller in a **fixed top-left slot** over whatever scene it interrupts (here the 1868 map, dimmed), so it reads as a recurring stamp. |
| **Resist A** `S5-Resist-A` | Resistance card on the desk: Red Cloud's photograph in a dark circle mount with a teal ring and a teal trace only (no tint), five orange mono field tags (WHO / WHERE / WHEN / WHY / HOW IT ENDED) with teal handwritten answers, and a map-card corner looping the Powder River country. Title RED CLOUD'S WAR on tape. |
| **Resist B** `S5-Resist-B` | Everything on **one dark card** (thin teal rule): portrait, name tag and map stacked left, the five fields right. |

**What works:** Hinge B is the one to standardise (same slot every time, so it becomes recognisable); A is for the first time a
year is introduced. Resist B looks most like a "card" students can learn to read; A is airier. **What doesn't:** in the tight
circle crop, the teal trace only shows along Red Cloud's face and hair edge and reads a little like a crack. For portraits that fill
the circle, I'd drop the trace and let the teal ring be the mark. The portrait is c. 1891, decades after the 1866–68 war; for
the real card, look for an earlier portrait (e.g. the 1870s Washington delegation photos) or say "photographed c. 1891" on screen.
The Powder River loop on the 1868 map is placed by eye (approximate). Field tags are orange (labels) rather than the mono-on-ink
of the brainstorm: ink tags vanished on the dark card.

## Masks (check before reuse)

`public/img/masks/s_*`, registered in `src/samples/masks.ts` (separate from the chapter `src/masks.ts`). rembg alone failed on
most of these busy period photos, so they are hand-traced polygons. **Do not re-run rembg over them.** Scripts and traces:
`src/samples/tools/` (`smask.py` jobs → `srefine.py` with `--only/--add tools/traces/<name>.json` → `closeup.py` to check).

| Mask | How |
|---|---|
| `s_montague` | polygon only (`traces/s_montague.json`); rembg returned the coat without the head |
| `s_worker` | polygon only (`traces/s_worker.json`) incl. carrying pole and left bucket |
| `s_goliah` | rembg (isnet) + `traces/s_goliah_add.json` (pilot/front beam it missed), holes filled |
| `s_up` | polygon only (`traces/s_up.json`); rembg gave fragments |
| `s_redcloud` | rembg (u2net_human_seg), clean |

## Not done / open

- No sound and no video render (stills only, as asked). The sample compositions have placeholder timings (marks land between
  frames 2 and 60), not narration anchors.
- The engines in S3 are stand-ins (see the caveats above); the CP one is mirrored.
- The map card uses the 1868 War Department map, not the series 3D map (which doesn't exist yet), so a future card's crop should
  match the 3D map's look.
