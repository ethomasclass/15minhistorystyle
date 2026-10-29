# Build notes · ch08 · Cheap as Dirt (86.0 s + tail)

File `src/ch/Ch08.tsx`, masks `src/masks_ch08.ts`, mask job `tools/mask_jobs/ch08.py`. Contact sheet `review/stills/ch08_sheet.jpg`
(32 frames). Checks: tsc clean, anchors clean, probe: no text off the frame. **Music:** `g_grip` (library) for the whole chapter.

## Scenes
1. 1874 tape, the nugget (callback) blurred, "the same year as the gold". 2. Series map from the Black Hills east to DeKalb, Illinois (pin).
3. Glidden: his portrait oval from the c.1877 Washburn & Moen / Ellwood barb-wire poster (LOC) on the desk, coral tint + trace, PATENT · NOV. 24, 1874.
4. "Look at the drawing. Two wires twisted together." **3D barbed wire (ThreeCanvas)**: two iron-grey strands with teal outlines twist
   together as the camera turns; Glidden's patent drawing (US 157,124, NARA) lands beside it.
5. "every few inches, a short, sharp barb" 3D close: a barb coils around both strands (coral outline = the subject), its two points out;
   the drawing's Fig. III looped beside it.
6. "wrapped on tight… {barbed wire}" pull back along the wire, barbs every few inches; BARBED WIRE tape + definition.
7. "almost no trees" the fenced-range lithograph. 8. "cheap, light and fast" the wire spool.
9. Gates (Appletons' engraving) coral. 10–11. Drawn corral on the desk (teal wire, posts, barbs), three longhorns land, push, they lean on the wire, "they couldn't." (SAN ANTONIO; "as the story is told").
12. Gates again, "his pitch (the way the story's told)". 13. **The flat p8_barb hero** huge over the blurred fenced-range plate with the three tapes LIGHT AS AIR · STRONGER THAN WHISKEY · CHEAP AS DIRT.
14–16. Two-views card (Ep 1 style): farmers fenced (crops; "and they had a point") ↔ big ranchers fenced too (public land; "the water" coral); the inactive column dims; bottom line "small ranchers + cowboys: the open range, closed".
17. Fenced-range plate, the fence looped coral, "found it closed." 18. Wire cutters (coral). 19. 1883 · Texas at night: coral cut marks spread (illustrative).
20. THE RANGE WARS + definition. 21. 1884, "a prison crime", TEXAS, 1884 · FENCE CUTTING A FELONY: 1 TO 5 YEARS.
22–23. Stack: "the open range didn't end with one battle" → "it ended one fence post at a time" while drawn posts step in one by one.
24–25. The plate, "slowly"; then it darkens and the first snow drifts in ("one winter").

## Sources
Archival: poster (LOC, image agent), patent drawing (NARA via Commons, mine `b_glidden_patent_1874.jpg`), Gates engraving (Commons, mine
`b_gates_engraving.jpg`); my credits `public/img/credits_ch08_b.json`. AI: p8_barb, p8_wire_spool, p8_nippers, p2_longhorn, p6_nugget,
L8_fenced_range (no tags).

## Masks
`b_glidden_poster` (rembg on the oval, crop (300, 400, 890, 1000)) minus a hand polygon for a scrap of the oval frame:
`review/ch07-10_tools/fixmask.py b_glidden_poster "-290,880 335,880 362,1000 290,1000"`. `b_gates` (rembg, clean).

## Still rough
- The 3D wire is ThreeCanvas: it renders fine in stills; the probe logs harmless "WebGL context lost" lines.
- Gates's only good portrait is from his later years; the beat says "a young salesman" (a Note, not a claim about the picture).
- The corral is a drawn diagram; the San Antonio demonstration (c. 1876) is flagged "as the story is told" on screen, as the script says.
- Texas cut marks are illustrative, labelled so. The 1884 law line (felony, 1–5 years) is worth a fact check against your preferred source.

## Update, Oct 27 (portrait rule)
Glidden is cut out of the poster's oval completely (bust only, cut at y 975, coral + trace); Gates is a bust cut-out (coral + trace on his
beat, plain B&W when he returns for "his pitch"). The patent drawing and the poster's other parts are no longer shown as prints of him.
