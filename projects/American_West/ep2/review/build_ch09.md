# Build notes · ch09 · The Big Die-Up (88.5 s + tail; all quiet)

File `src/ch/Ch09.tsx` (ChapterShell `quiet` + the `Quiet` palette: teal and grey/bone only, no coral, no jokes, softer sounds),
masks `src/masks_ch09.ts`. Contact sheet `review/stills/ch09_sheet.jpg` (28 frames). Checks: tsc clean, anchors clean, probe clean.
**Music:** `aw_white_cold` (Suno) from 80 s in, bed gap 14 (as the coordinator set it).

## Scenes
1. THE 1880s: series map, Montana / Wyoming / Dakota outlined, longhorns crowd them. 2. "Count the reasons": stacked teal diagram, 1 too many cattle.
3. Investors: drawn flow THE EAST / BRITAIN / SCOTLAND → RANCHES ON THE OPEN RANGE. 4. A fixed box of grass, cattle multiplying past it ("not to scale").
5. 2 a hot, dry summer (1886). 6. "the grass came in thin / the cattle: already weak" over the desaturated plate. 7. 3 the winter; snow starts over the stack.
8. JANUARY 1887 over the blizzard plate with falling snow.
9. **3D slice of the ground** (drawn teal Stage style, slow orbit): grass at the bottom, deep snow, a hard crust on top (with a top surface);
   it appears on "The snow froze into a hard crust"; on "couldn't dig through it" a cow's foreleg presses down twice and stops on the crust
   (crack ticks); a dashed line to the grass ends in an ✕, "grass" in bare teal handwriting under the crust. Labels HARD CRUST / DEEP SNOW.
10. "They drifted with the wind" Remington, *Drifting before the storm* (c. 1904, LOC). 11. "until they hit a fence, or a ravine. And they stopped." the drifted fence-post prop, wind lines; held.
12. "The creeks were full of dead cattle." Harper's 1886 *Cattle in a blizzard on the plains*: held, no marks.
13. THE BIG DIE-UP + definition over the same engraving, dimmed. 14. "nobody knows exactly how many died."
15. 20 longhorn figures, 11 fade ("some estimates: more than half", illustrative). 16. Map: Dakota, Roosevelt's ranches near Medora.
17. Roosevelt 1885 (buckskin, Bain/LOC): plain print, no coral. 18. Quote "The losses are crippling." (to Henry Cabot Lodge, April 1887).
19. Russell's painting (ch01's crop), held. 20. "a different kind of ranching · smaller herds · fenced pastures". 21. Hay: Watkins, *Derrick fork stacking hay*, Kerr Ranch.
22. Haystack + hay rake, "survived, as a business". 23. "the open range was over." 24. The painting print on the desk, "back to the question".

## Sources
All archival from the image agent (`credits_ch09.json`); the painting is ch01's `img/ch01/b_chinook_painting.jpg` (+ its steer mask in ch10).
AI: L9_blizzard, L8_fenced_range, p9_post_drift, p9_haystack, p9_hay_rake, p2_longhorn (no tags).

## Still rough
- The Harper's engraving is from 1886 (a storm before the Big Die-Up); its tag says so. A spring 1887 photograph of dead cattle would be a better fit for "the creeks" if one turns up.
- The foreleg in the 3D slice is drawn simply (a teal outline, cloven hoof); read it in motion before deciding on a muzzle instead.
- "more than half" is the script's "some estimates" (labelled illustrative).

## Update, Oct 27
- Roosevelt is a plain B&W bust cut-out (new mask `b9_roosevelt`, job in `tools/mask_jobs/ch09.py`, u2net_human_seg on the upper body,
  cut at y 1150), no coral, no trace (quiet chapter); dimmed behind the quote.
- The remade p9_post_drift prop is taller: placed at 430 px wide so the post and its mound sit in frame beside the wind lines (re-taken).
