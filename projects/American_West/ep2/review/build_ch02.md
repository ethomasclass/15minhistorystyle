# Build notes: Ch02 · Four-Dollar Cows

`src/ch/Ch02.tsx` (`Ch02`, `CH02_FRAMES`), masks `src/masks_ch02.ts`, helpers in `src/kit/ch02_extra.tsx`. 21 shots on word anchors,
none longer than ~7 s. Contact sheet: `review/stills/ch02_sheet.jpg` (26 frames).

## Scenes
1. Callback: "LAST TIME · EPISODE 1", "a man with an idea / + about 5 million cows", the longhorn prop drops in (coral, traced).
2. "Here are the cows": Leslie's 1878 herd of Texas longhorns, pushing in (caption kept out of frame).
3. Series map, Texas lit coral, **TEXAS, 1865**, "the war is over" · 4. one coin alone on the desk: "soldiers home from the war",
   "almost no money" (looped).
5. Harper's 1874 "cutting out" (left panel, torn print): "run wild for four years", "and multiplied".
6. The herd again, darkened, a pan: "BY MOST ESTIMATES", counter to **≈ 5,000,000**, "LONGHORNS IN TEXAS".
7. **THE PROBLEM**: p2_coin_one + stamped tag "TEXAS · A STEER ≈ $4", "if you could find anyone with $4".
8. Pull out: p2_coin_stack (coral) + "CHICAGO · SAME STEER ≈ $40", arrow, "× 10".
9. Map: Chicago pin, "northern cities: hungry for beef", a dashed white line north: "why not walk them north?"
10. **THE RAILROAD**: Ep 1's two lines draw on, Promontory pin, "from Episode 1" ·
11. push to Kansas: the Kansas Pacific draws west in coral ("THE KANSAS PACIFIC · PUSHING WEST").
12. McCoy's frontispiece (1874) on the desk, McCoy coral + traced, **1867**, "JOSEPH McCOY", "a cattle dealer from Illinois".
13. McCoy's own plate "Abilene in 1867": **ABILENE, KANSAS**, "a tiny stop on the line", loop on the log huts.
14. His page 44 (Newberry scan) as a torn clip: focus pull to the two lines, coral swipe on "Abilene in 1867 was a very small, dead
    place, consisting of about one dozen log huts", handwriting "about one dozen **log huts**".
15. Gardner's 1867 stereo halves (McCoy's stock yard, Drover's Cottage) slap down on "pens" / "a hotel"; "+ a shipping yard".
16. Leslie's 1871 cattle shoot at Abilene: "word sent to Texas:" / "Bring your cattle **here**."
17. Stack (bare handwriting): cheap cows in Texas / hungry cities in the North / a railroad in between ·
18. "that means: a cow became a **ticket**" (coral) as the stock-car prop rolls in.
19. Harper's 1874 "guarding the herd": "no need to own the land".
20. **OPEN RANGE**: the Plains states lit teal on the map, small longhorns grazing, Definition (open range).
21. The walk: San Antonio → Abilene drawn as a white dusty trail (not named yet; ch03 names it) with the longhorn walking it, the
    Kansas Pacific in coral, "walk them to the railroad", "≈ 1,000 miles"; held into the tail.

## Music
`m_frontier` (bed) until "That's where the railroad comes in", then `aw_iron_horse` (bed) to the end, crossfaded over ~1 s.

## Images
Image agent (`credits_ch02.json`): Leslie's 1878 herd, Harper's 1874 cutting out, McCoy frontispiece and Abilene plate (Newberry/IA),
Gardner stereos (LOC), Leslie's 1871 cattle shoot. Mine (`credits_ch02_b.json`): `ch02/b_mccoy_p61.jpg` (McCoy p. 44, the log-huts
line; line positions measured on the scan: line 1 y 1630 x 695–1645, line 2 y 1693 x 215–1240). `ch03/texas_cattle_trade_guarding_herd_1874.jpg`
is reused here (scene 19).
AI props (no tags): p2_longhorn, p2_coin_one, p2_coin_stack, p2_stock_car. Mask `ch02_mccoy` is a hand polygon (rembg took the engraved
background hatching): `review/ch02_mask_mccoy_poly.py`; job stub in `tools/mask_jobs/ch02.py`.

## Still rough
- Scene 4 (no money) is only a coin and handwriting; a period photo of returning Confederate soldiers would be stronger.
- The Leslie's herd (1536 px) and cattle-shoot (1536 px) scans are soft at full frame; usable, not crisp.
- The callback (scene 1) is an empty desk until the longhorn lands at 4.7 s.

## Checks (after the container restart)
`npx tsc --noEmit -p .` clean for these files; `tools/anchors.py --src` exit 0 (and every phrase in the sound lists checked too);
`tools/probe_text.mjs` every 10th frame (shots use `WShots`, so the probe sees hard cuts): fixed the three hits it found (Ch01
"come through?" and the LAST OF THE FIVE THOUSAND tape's overshoot, Ch03 the San Antonio label in the Indian Territory shot); stills
re-rendered after the kit's handwriting/MPin-label fixes and the sheet rebuilt.
