# West series: low-res motion previews (960×540, 30 fps)

These answer the feedback on the stills ("flat, not much depth or texture; zooming in might help; loved the 3D tilted grid;
3D where it makes sense, even the race"). Three short clips, each with a frame contact sheet:

| Clip | Length | Sheet |
|---|---|---|
| `P1-ColdOpen.mp4`: cold open, timed to `audio/ch01_v4_onetake.mp3` (first 20 s, cut after "May 10th, 1869.") | ~20 s, with narration | `sheet_P1.jpg` |
| `P2-Race.mp4`: the race as a 3D elevation ribbon | 15 s, silent | `sheet_P2.jpg` |
| `P3-Checker.mp4`: 3D land-grant township, then the Act with a focus pull and swipe | 12 s, silent | `sheet_P3.jpg` |

Code: `src/previews/` (`fx.tsx` = the motion/depth kit, one file per clip), registered in `src/Root.tsx` as `P1-ColdOpen`,
`P2-Race`, `P3-Checker`. Re-render: `node src/previews/render.mjs video review/previews P1-ColdOpen P2-Race P3-Checker`
(SCALE=1 for 1080p). Built with CSS 3D (perspective + preserve-3d) rather than three.js: it keeps the drawn teal look,
needs no new packages, and renders fast.

## Techniques: what each is and where it shows

**1 · Shot grammar (wide → detail, 3–6 s, one move per shot, never the same twice in a row)**
- P1: wide **push** with parallax (0–5 s) → desk **slap and tilt** (5–8 s) → **whip** to a **pan** across the engines → hard cut to a
  deep **push** into the bottles → **tilt** down to the handshake → **whip** out to a **pull-out** on the desk. Cuts land on the words
  ("And most…", "Look at it", "Men climbing", "Two engineers", "May 10th").
- P2: **orbit** (wide) → **whip** → **push** into the Sierra while the bond zones light → cut → **pull-out/pan** to Promontory.
- P3: **orbit** over the township → **whip** → **push** in on the Act.

**2 · Depth**
- Real 3D desk (`Desk3D`): a perspective-tilted plane with ruling and stains, a warm **lamp pool** (soft-light) and a vignette falloff.
  Pieces sit at different heights (`Lift`): the torn print 10 px up, the worker cut-out 46 px up, the map card low and **slightly blurred
  (depth of field)**. **Contact shadows** soften and drift as a piece's height grows (most visible during slap-downs).
- **Parallax inside the photo** (P1 shot 1): the Russell photo split into sky (inpainted) and crowd + engines (sky-threshold mask,
  clean); the crowd scales ~6% faster than the sky during the push.
- **Deep zoom**: P1's bottle shot pushes about 6× from the wide (0.5 → 3.0 screen px per source px).
- 3D models: P2's ribbon (stacked contour copies of the profile standing on a survey-grid ground) and P3's township slabs (top +
  front + side faces, true 3D).

**3 · Motion with weight**
- **Slap** (`useSlap`): every title, print, cut-out and slab starts ~130% and snaps down with a squash overshoot (spring), stepped at 12 fps.
- **Camera shake** with exponential decay on hard landings (print and worker in P1, the date, the Act page in P3, the meeting in P2).
- **Breathe**: settled desk pieces sway by a fraction of a degree.
- **Whip** transitions: 8 frames of sideways motion blur between the two shots.
- Marks (loops, notes, traces, tape) still step at 12 fps; cameras are smooth.

**4 · Texture**
- Cut-outs (worker, both engines) run through `tools/weather.py --preset light --no-crease` first: halftone dots and slight
  misregistration show inside the cut-outs (light rather than medium, because medium's crease and edge wear look wrong on a cut-out).
- Torn edges use the **real bite profiles** of the AI torn-paper pack (extracted from its alpha into `src/samples/torn_profiles.json`)
  instead of random jitter. Only the edge *shape* is used: the pack's white fibre would be a white border.
- **Grey translucent tape** from the AI tape pack (the orange cloth tapes looked like stickers).
- AI **stains** multiplied into the desk; grain + vignette (`Finish`) over everything.
- The two AI litho plates (Sierra snow sheds, Wyoming "Hell on Wheels", `weather.py` medium) are the backdrops of P2's mountain sections.
- Rules kept: no cream/white cards or sticker borders, coral = one subject per frame, teal marks, orange torn-tape titles.

**5 · Hook alignment (P1)**: the photo is up at frame 0, "This is the most famous photograph…" starts at 0.5 s and NOT IN THE PICTURE
slaps on at 0.4 s, so all three land inside the first second. The thumbnail idea (S1-C: the Chinese worker in the torn gap) is the
payoff on "aren't in it" (7.2 s) and the final frame.

**6 · 3D where it explains**
- **P2, the race:** elevation ribbon Sacramento → Omaha (1,776 mi), vertical exaggeration about 230×. The bond rates light up under it,
  per the Pacific Railway Act, Sec. 11: **$48,000 a mile** for 150 miles from the base of each range (Sierra and Rockies, coral: the subject),
  **$32,000** between the ranges and **$16,000** on flat ground. The engines crawl in from each end and meet at Promontory, so the CP
  visibly spends its first months in the expensive mountains. Elevations are **approximate control points**, not DEM data: Sacramento 30 ft,
  Colfax 2,420, Donner Summit 7,017, Truckee 5,850, Reno 4,500, Winnemucca 4,300, Elko 5,060, Promontory 4,900, Ogden 4,300,
  Evanston 6,750, Green River 6,100, Rawlins 6,800, Laramie 7,160, Sherman Summit 8,250, Cheyenne 6,060, North Platte 2,800, Omaha 1,000,
  placed at approximate route miles and eased between. The bond zone boundaries are also approximate (the base of each range was fixed
  by later surveys).
- **P3, the checkerboard:** the tilted township you liked, now with the odd sections rising as slabs as the coral line passes; then the
  Act's page on the desk, where the focus pull and the coral swipe use **Gemini's exact line boxes** (`act_lines.json`, lines 1–2:
  "…every alternate section of public land, designated by odd numbers…"). The swipe starts at "every", at a position I measured on the scan.

## What works
- P1 feels like a documentary now: the parallax push and the 6× push to the bottles carry the depth the stills lacked, and the slap
  of the worker into the torn gap on "aren't in it" is the moment.
- P3's rising slabs read instantly as "the railroad got these squares", and the Act focus pull ties the picture to the law's words.
- P2 makes the bond-rate argument visible (coral mountains = treble pay) with no chart.

## Still rough
- **The mirrored CP engine** (*Goliah*) is still used in P2, as in the stills (number plate un-flipped, tagged). The CP's first miles are in
  the mountains on the left, so the direction matters even more in 3D.
- **The Russell photo is the 3840 px Commons restoration.** The LOC only holds a small copy (no TIFF), Commons' full-size original was
  rate-limited (HTTP 429), and Yale's master wasn't tried. At this preview size the 6× push holds; at 1080p the bottle shot is about 1.5× upscaled
  and soft. Ask Yale/Beinecke or retry Commons before the real render.
- P2's labels are small at 960×540 and some overlap when the camera is wide (Donner Summit/Reno); the engines are tiny in the wide shot.
  The ribbon's 230× exaggeration should be stated on screen ("heights exaggerated") in the real video.
- P3: the coral line runs along a row boundary, so it's drawn floating just above the slabs to stay visible. The section numbers on the
  far slabs are unreadable at 540p.
- The desk shots in P1 are darker than the photo shots; the lamp pool could be warmer or wider.
- Silent P2/P3 (no sfx yet: slap/stamp/whoosh cues are where the shakes are).
- No new Gemini images were generated (the existing litho plates covered P2), so the AI spend for this round was zero.
