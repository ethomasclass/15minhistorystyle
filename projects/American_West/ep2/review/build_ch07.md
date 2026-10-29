# Build notes · ch07 · Who Got the Gold (69.5 s + tail)

File `src/ch/Ch07.tsx` (helpers shared with ch08–10 in `src/kit/ch07_10_extra.tsx`), masks `src/masks_ch07.ts`, mask job
`tools/mask_jobs/ch07.py`. Contact sheet `review/stills/ch07_sheet.jpg` (28 frames). Checks: tsc clean, anchors clean,
`probe_text.mjs` no text off the frame.

**Music:** `aw_boomtown` (Suno) from frame 1280 (42.67 s) for the whole chapter, as the coordinator set it: the rush stops
just before "Just"; the hollow carries the plug. On "Just underground." the picture holds (both lines are written by then,
the camera push ends at "Just", no new marks).

## Scenes
1. "Every gold rush… three steps" **3D cut-away of a Black Hills hill** (Ep 1 ch04 Stage/Upright style, teal, "not to scale"),
   wide, slow orbit, THREE STEPS tape.
2. "Step one: a man with a pan in a creek" Remington's *Miners prospecting* (LOC) as a print on the desk, the pan looped, STEP 1 OF 3.
3. "loose in the gravel… placer mining" cut-away: creek gravel lights, coral gold flecks, the sluice stands; {placer mining} definition.
4. "the easy gold runs out" the flecks wash out (camera slides right), STEP 2.
5. "locked inside solid rock, deep underground" the veins light (coral), the shaft drops, the headframe stands.
6. "shafts, machines, and a mill" pull wide: drift, the stamp mill stands, the ore line runs to it, STEP 3.
7. "crushes rock day and night" stamp-mill prop thumping (small shakes). 8. "money. A lot of it." coin stack, "money." coral.
9. 1877, Hearst (Edouart & Cobb, 1891) print, coral tint + trace. 10. Series map: Black Hills hatched, Lead pinned "the Homestake", $70,000.
11. THE HOMESTAKE over Grabill's *Lead City mines and mills*, 1889 (pan). 12. ≈ 40,000,000 oz counter + 1877 → 2002 bar over the dimmed open cut (Grabill 1888).
13. "So, stack it up" cut-away, all lit: *a free-for-all / hard rock / a company* (coral).
14. "That means…" handwriting over the dimmed cut-away. 15. "Working for wages. Just underground." push into the drift (ore cart), hold.
16–17. The plug: props on the desk, one small teal note "subscribe ↓"; the wire spool edges in on "Cheap as dirt", "(hold onto that)".

## Sources
Archival: Hearst (Commons, PD, mine `b_hearst_1891.jpg`), Homestake open cut (Grabill 1888, Commons copy `b_homestake_open_cut_1888.jpg`;
the image agent also has the LOC copy), Grabill Lead City 1889, Remington *Miners prospecting* (both image agent, `credits_ch07.json`).
Credits for my downloads: `public/img/credits_ch07_b.json`. AI props: p6_gold_pan, p6_nugget, p7_sluice/headframe/stamp_mill/ore_cart,
p2_coin_stack, p8_wire_spool (no tags).

## Masks
`b_hearst` (rembg) + a hand polygon added for his right shoulder (the dark coat merged with the backdrop). If `tools/mask.py b_hearst` is
re-run, redo: `fixmask.py b_hearst "+640,1390 450,1485 250,1550 90,1600 0,1640 0,2593 700,2593 700,1400"` (union polygon, source px;
script `review/ch07-10_tools/fixmask.py`, it calls `tools/trace.save`; mask close-ups: `review/ch07-10_tools/closeup.py`).

## Still rough
- The cut-away's veins and the creek are schematic (labelled "not to scale"); the props stand flat on the section line, so they read as cut-outs, which is the look we wanted.
- The open cut photo appears in ch07 twice (ounces backdrop, dimmed) and again in ch10; fine as a callback, swap one if it feels repetitive.
- Remington's drawing is 1880s art, not a photo; W. H. Jackson's c.1872 placer photo (image agent) is the alternative if you prefer a photograph.
- "≈ 40–41 million oz" labelled "commonly cited".

## Update, Oct 27 (portrait rule)
Hearst is now a bust cut-out on the desk (`Bust` in `src/kit/ch07_10_extra.tsx`: mask cut-out, straight cut below the shoulders at
source y 2050, soft contact shadow, coral see-through tint + teal trace as the beat's subject). No print, no photo background.
