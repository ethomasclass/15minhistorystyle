# Graphics brainstorm: collage references → the West series

**Status:** brainstorm only. Nothing here is a standing rule yet. The look stays as it is: dark desk, B&W archive, one coral subject
with a teal trace, orange torn-tape titles, teal handwriting, 12 fps marks, hard cuts. Each idea below is a *variant* of an existing
component wherever possible.

**References** (from the user's uploads): **R1** cut-out man with a collage halo of money and objects · **R2** 4-up (bio cut-out with
glow, blueprint grid with factory, photo in a TV set, typewriter text with highlight and defocus) · **R3** "Vox style" (period map with
red circle, letter background, censor bar, factory cut-out) · **R4** torn prints on a dark desk (hand circle on a crane, map card with
route, redaction bars, projector) · **R5** Booth cut-out with offset shadow on grid paper, Lincoln in a circle, label tags · **R6**
"ONE STEEL BOX" thumbnail (torn-paper split, ship cut-out, red halftone field, navy block).

**Conflicts, said once:** every reference uses **yellow** as its highlighter; yellow was rejected (`harris` palette), so read yellow
as **coral** (for a marked subject or a highlighted line) or **orange** (for a label). Light paper backgrounds (R1, R2, R5) become the
dark desk. Blueprint blue, navy and red fields (R2, R6) become dark desk, teal lines and coral. The TV set and projector (R2, R4) are
anachronistic and a bit stock-template; use the period's own viewing devices instead. **Censor bars over eyes (R3) are out** for real
people, and especially for Native people in Ep 4. Smooth 3D parallax collages and glow halos read as After Effects template packs; keep
everything stepped at 12 fps, with hard cuts and grain.

---

## Ideas

### 1. Survey grid (township plat): the grid paper, made historical
- **From:** R2 (blueprint grid), R5 (grid paper behind the cut-out).
- **Channel version:** the existing `Grid` (§4.9, 88px teal-white cells, never used in a chapter yet), redrawn in **teal** on
  `DarkPaper` as a Public Land Survey plat: a 6 × 6 township, sections numbered in mono, one quarter-section filled **coral** for
  "160 acres". Cells fill in at 12 fps. The grid is the evidence here, not decoration: the West really was sold off as a grid.
- **West series:** Ep 1 ch 2, the railroad land-grant **checkerboard** (alternate sections fill orange for the railroad and stay
  empty for the government). Ep 3 ch 2, the Homestead Act's 160 acres. Ep 4 ch 9, the same coral square comes back as the Dawes
  allotment (the planned "160 acres" callback, now visual). It can also be the floor of the 3D map's homestead region in Ep 3.
- **Effort:** M (new `PlatGrid`, built from `Grid` and the diagram boxes).

### 2. Redacted treaty: bars fall, one line stays
- **From:** R4 (redaction bars with one highlighted bar), R2 (typewriter text with a highlight).
- **Channel version:** the real treaty scan in `Doc` (gt.tsx). Ink `#111` bars with torn ends (Highlight's jitter) drop in line by
  line on stamp ticks, leaving one line with the planned coral `swipe` (explainer-craft §4). The highlight is coral, not yellow.
- **West series:** Ep 4, the 1868 Fort Laramie Treaty: "absolute and undisturbed use" stays lit while the 1877 act's bars cover
  the Black Hills articles. Ep 1 ch 9: the 1882 Exclusion Act. In quiet chapters the swipe goes teal, per the rule.
- **Effort:** S once `swipe` exists (it's already rank 1 on the explainer-craft menu).

### 3. Focus pull on a document
- **From:** R2 (typewriter text, defocused except the highlighted phrase).
- **Channel version:** an extension of `DocLift`. The page stays put; every line except the quoted one blurs (4–6px) and dims, the
  quoted line stays sharp with a coral swipe. No typewriter font: the typewriter was patented in 1868 and sold from 1874, so use the
  document's own pixels (or a period-correct printed Act).
- **West series:** Pacific Railway Act (Ep 1 ch 2), Greeley's excerpt (Ep 3 ch 3), Dawes Act (Ep 4 ch 9).
- **Effort:** S.

### 4. Torn print with tape (card variant)
- **From:** R4 (torn photo prints on a dark desk), R6 (torn-paper edges).
- **Channel version:** a `Card` variant, `torn`: one or two deckled edges (Highlight's seeded jitter, applied to the cream border) and
  a short strip of **orange** tape across a corner (the same orange as the titles, so the desk feels like one notebook). Drops with
  `DropCard` weight. It is closer to the brand than R4's purple vignette, which we drop.
- **West series:** Ep 1 ch 1, the golden-spike photo as a torn print, with a corner torn away where the missing crews would be
  (pays off in ch 9). Ep 3, Exoduster and Butcher sod-house photos pinned to the desk.
- **Effort:** S.

### 5. Stereoview frame (instead of the TV set)
- **From:** R2 (photo inside a vintage TV), R4 (film projector).
- **Channel version (new):** a period viewing device. Alfred A. Hart's Central Pacific photos were sold as **stereoviews**, so show
  them that way: a cream card mount with curved top corners, the two near-identical halves side by side, the publisher's line in mono.
  A push-in drops one half and lands on the other, full-bleed. Optional subtle stereo "wobble" (alternate halves on 2 steps) as the
  only effect.
- **West series:** Ep 1 ch 3–4 (Hart's views of Chinese crews at the Summit Tunnel and the snowsheds). Ep 2 (mining-camp
  stereoviews). It doubles as a "how do we know?" beat: the photo was a product, sold to Eastern buyers.
- **Effort:** M.

### 6. Offset coral shadow on a cut-out
- **From:** R5 (Booth with an orange offset silhouette).
- **Channel version (new, variant of the subject tint):** a hard, unblurred **coral** copy of the subject's mask, offset about
  (10, 8) px, behind a B&W cut-out on the desk. It *replaces* tint plus trace for that shot, so there is still one coral subject;
  never both on one figure. Not in quiet chapters (no coral); there, use a bone offset or none.
- **West series:** cut-out portraits of the decision-makers: Grant, Crocker, Oakes Ames (Ep 1), Glidden and his wire (Ep 2). Not for
  Native leaders in Ep 4 (it reads as a "villain" pose in R5's source).
- **Effort:** S (it reuses the mask we already make).

### 7. Collage halo
- **From:** R1 (man surrounded by money, buildings and coins).
- **Channel version (new):** one cut-out figure with 8–14 B&W cut-out **period objects** stacked behind the shoulders, popping on
  3 frames apart (`Card`'s stagger) with ticks; one object, not the man, takes the coral. Real scans only (bank notes,
  stock certificates, gold nuggets, cattle brands, a barbed-wire knot from the Smithsonian or LOC), so it doesn't read as AI-made.
- **West series:** Ep 1 ch 7, Crédit Mobilier: a congressman with railroad stock certificates around him (the coral one is the stock).
  Ep 2 ch 1 or 6, "anyone with nerve can get rich": a prospector with gold, beef, hides and wire, which then falls away in ch 9.
- **Effort:** M (cut-out masks for the objects).

### 8. Map card on the desk (locator)
- **From:** R4 (map card with a route), R3 (period map with a red circle).
- **Channel version:** a small cream `Card` showing a **flat crop of the series map**, with a teal `MapLoop` (not R3's red filled
  circle) and a teal route, sitting beside an archive photo. It keeps the place in view without cutting to the full 3D map.
- **West series:** every "where are we?" line, so viewers can place the scene without a full map cut: Promontory, Abilene, Deadwood,
  Nicodemus, Little Bighorn. Its crop matches the 3D map's state for that episode, so the two always agree.
- **Effort:** S.

### 9. Letter background
- **From:** R3 (handwritten letter behind the collage).
- **Channel version:** a real letter at `brightness(0.45)`, as the "paper" layer on `DarkPaper` behind a cut-out or note. It's
  already allowed (dimmed background photo, §2.3); this just makes it a habit.
- **West series:** Exoduster letters to Kansas Governor St. John (Ep 3 ch 7); Silas Soule's letter on Sand Creek (Ep 4 ch 4,
  quiet: letter plus teal note, nothing else).
- **Effort:** S.

### 10. Label tags on a portrait circle
- **From:** R5 ("John Wilkes Booth" tag, "ASSASSINATED / 1865" stacked tags, Lincoln in a circle).
- **Channel version:** an engraving inside a cream **circle** mount (new, a round `Card`), with a stacked pair of tags: an orange
  `Highlight` for the event word, and under it a small ink-on-cream mono tag for the year. That pair becomes the **hinge-year stamp**
  (below).
- **Effort:** S.

---

## Serving the recurring devices

- **Promise Ledger:** a cream card on the desk, **torn top edge with orange tape** (#4), mono column heads. Each episode writes a row in
  teal handwriting. Ep 4: the "Who didn't" column takes a coral `swipe` down its length, then the stamp lands. In quiet endings, teal only.
- **The 3D map:** pair it with the **map card** (#8), so the big map appears once or twice an episode and the small card handles every
  other "where." In Ep 3, the homestead region's slab surface becomes the **plat grid** (#1). In Ep 4, treaty land shrinking can use the
  redaction idea: the slab is "struck" by ink-bar strips as each cession lands.
- **Resistance cards:** R5's layout on our desk. Left: the leader's real photograph in a **circle mount** (#10), B&W, teal trace only (no
  offset shadow, no tint gimmick). Right: five stacked mono field tags, *WHO · WHERE · WHEN · WHY · HOW IT ENDED*, answers in teal
  handwriting, plus a **map card** (#8) corner with the place pinned. The layout is identical on every card, so students learn to read it.
- **Hinge-year stamps:** the year in Abril on an orange torn box, with a cream mono strip under it listing that year's events
  (e.g. "1874 · BLACK HILLS GOLD · BARBED WIRE · RED RIVER WAR"), same screen position every time, stamp sound. Repeats across episodes
  so "1862" and "1874" become recognisable objects.

---

## Thumbnail directions (series)

1. **"Who's missing?"** (Ep 1). The golden-spike photo as a **torn print** (#4) filling the frame, with the torn-away corner showing dark
   desk and one teal-traced, coral-tinted Chinese worker cut-out (from a Hart stereoview) stepping into the gap. Tape: **NOT IN THE PICTURE**.
2. **Torn split (R6 adapted).** One layout for all four parts: left two-thirds dark desk with a big B&W cut-out (locomotive, longhorn,
   sod house, a treaty page), right third a **coral halftone dot field** behind a torn edge (in place of R6's red), with the series map's
   region in teal line on it. Abril on orange tape: **FREE LAND?** A small mono "THE WEST · PART 3/4" tag top-left. Strong series family look.
3. **Topic-led map (standing preference).** The tilted 3D map, one region coral, with a **map card** and a resistance-style tag stack over
   it: **THE AMERICAN WEST: WHO GOT THE PROMISE?** Good for search.

---

## Ranked top 5

1. **Survey grid (#1).** The grid paper made into evidence: the checkerboard and the 160 acres, Eps 1, 3 and 4. Brand-safe.
2. **Redacted treaty + focus pull (#2, #3).** The strongest Ep 4 image, and they finish the `swipe` work already planned.
3. **Torn print with orange tape (#4).** Small change, big collage feel; it also dresses the Promise Ledger.
4. **Stereoview frame (#5).** R2's "photo in a device," made period-true and turned into a "how do we know" beat.
5. **Map card + circle-mount tags (#8, #10).** Together they *are* the resistance card and the hinge stamp, so they get built anyway.

Held back: the offset coral shadow (#6) and the collage halo (#7). Both are good, but they push furthest from the look, so try them before
committing.

## A/B test first

Build **Ep 1 ch 1's golden-spike shot** two ways and compare stills and a 10 s clip: **A**, the current look (full-bleed photo, coral
subject, teal trace); **B**, the collage version (torn print with tape, map card corner, one offset-coral cut-out). Also render thumbnail
directions 1 and 2 side by side. If B wins, adopt #4 and #8 as standard and keep #6 for one shot per episode.
