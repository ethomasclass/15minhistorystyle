# Build notes: Ch01 · The Last of the Five Thousand (cold open → ChannelIntro → title)

`src/ch/Ch01.tsx` (`Ch01`, `CH01_FRAMES` = narration + 40-frame hold + `INTRO_FRAMES` + 150-frame title), masks `src/masks_ch01.ts`,
helpers shared by ch01–03 in `src/kit/ch02_extra.tsx` (`MState`, `MCattle`, `PriceTag`, `CropCam`, `NumbersCard`, `ThreeCount`).
Structure copied from Ep 1 Ch01 (own shot list, then `ChannelIntro`, then the title card). Every cut and mark is on a word.
Contact sheet: `review/stills/ch01_sheet.jpg` (30 frames).

## Scenes
1. Frame 0: Russell's watercolor full-bleed (B&W, warm), already drifting in; hook tape **A MESSAGE TO THE BOSS** at 0.4 s;
   "his cattle were dead".
2. Series map: Montana lit teal, **MONTANA, WINTER 1886** · 3. cut-in: Helena pin ("MONTANA TERR."), small longhorns on the plains,
   "≈ 5,000 cattle on the open plains".
4. The envelope prop slides onto the desk: "to the foreman", "how had the herd come through?" · 5. push on the envelope, "no words for it".
6. "the way the story's usually told": the painting slaps onto the desk beside the envelope.
7. Charlie Russell (photo c. 1900, coral tint + teal trace, tagged "photo taken years later"; mono "CHARLIE RUSSELL · 22 IN 1886"),
   "painted this instead" with an arrow to the painting, "and the foreman sent it".
8. "Look at it": the painting again, the steer turns coral (see-through) and is traced · 9. deep push to the hip bones, teal loop.
10. Pan to the wolves; loops land on "wolves", "waiting" · 11. the print on the desk, **WAITING FOR A CHINOOK** tape.
12. Camera on the sky: three teal wind arrows blow in and fade before they reach the steer; Definition (chinook); "it never came."
13. Pull-out, steer coral, **THE LAST OF THE FIVE THOUSAND** tape.
14. "Twenty years earlier": the L2 cowtown plate (muted litho tint), "cattle: a sure way to get rich".
15. "a horse + some nerve": longhorn prop (coral) + saddle prop slap down.
16. **THE QUESTION**: both pictures on the desk, "that, → to this?" · 17. bare handwriting "who actually got **rich?**" (coral, looped)
18. "the answer: who owned the grass" (looped) · 19. back to the steer, held still, "we'll come back to him".
20. Hand-off: series map, Texas lit coral, a herd of small longhorns, **TEXAS**, "too many cows / no money at all".
Then `ChannelIntro` (clicks only) and the title card (CHEAP AS DIRT / subtitle / 1866 – 1887) over the dimmed painting.

## Sound and music
(superseded: see the Oct 27 section below) `r_cold_open` at `bed('r_cold_open', 12)` (`// SUNO: aw_white_cold replaces this`), dipping out into the channel intro. **The title card
is not silent:** the same cue comes back under it (from 56 s into the cue) at a little above the bed, with Ep 1's stamp; it fades with
the card. Gentle SFX as in Ep 1 (whoosh/whip_soft on shots, marker_tick 4 frames before each note, stamp on tapes, paper slaps).

## Images
- `ch01/waiting_for_a_chinook_postcard.jpg` (image agent; IA, PD mark) → `ch01/b_chinook_painting.jpg`: the painting cropped out of
  the 1907 postcard (no border, no printed caption), 4000 px. Shown in B&W; the postcard's colour is not used.
- `ch01/b_russell_c1900.jpg`: Charles M. Russell, c. 1900, unidentified photographer, Commons (PD); credits in
  `public/img/credits_ch01_b.json`. No 1880s photo of Russell turned up in PD sources, so the tag says the photo is later.
- AI props (no tags): p1_letter, p2_longhorn, p3_saddle, p2_coin_one (tiny, on the map); L2_cowtown plate.
- Masks: `ch01_steer` (rembg, clean), `ch01_russell` (rembg + a hand polygon for the hat, `review/ch01_mask_russell_fix.py`);
  jobs in `tools/mask_jobs/ch01.py`.

## Still rough
- Russell's photo is c. 1900 (he was ~36), not the "young cowhand" of 1886; tagged as later. Swap if a period photo turns up.
- The hat polygon on Russell's mask is a little loose at the brim's top-left (a sliver of backdrop takes the coral tint).
- `INTRO_CARDS` in `src/project.ts` still lists Ep 1's railroad pictures for the channel intro flip (shared file, coordinator's call):
  suggested Ep 2 set: the Chinook painting, McCoy's Abilene 1867 plate, the 1878 longhorn herd, Gardner's 1867 stock yard, the
  midnight-stampede plate.
- The 1886 date: narration says "the winter of 1886" (the Big Die-Up winter is 1886–87); the title tape follows the narration.

## Checks (after the container restart)
`npx tsc --noEmit -p .` clean for these files; `tools/anchors.py --src` exit 0 (and every phrase in the sound lists checked too);
`tools/probe_text.mjs` every 10th frame (shots use `WShots`, so the probe sees hard cuts): fixed the three hits it found (Ch01
"come through?" and the LAST OF THE FIVE THOUSAND tape's overshoot, Ch03 the San Antonio label in the Indian Territory shot); stills
re-rendered after the kit's handwriting/MPin-label fixes and the sheet rebuilt.

## One more rough spot
- The steer's coral tint reads quite red because the steer is nearly black in B&W; its fur and ribs stay visible (see-through),
  but if it reads as a red silhouette on a big screen, lower `tint` in `LookSteer`/`LastOf`/`BackToSteer` (now 0.42) or lift
  the steer's brightness under the mask.

## Coordinator review fixes (Oct 27)
- Steer tint lowered to 0.26 (`STEER_TINT`), and the steer's own levels are lifted under its mask (`SteerLift`, a masked screen layer), so the
  coral sits on visible fur and ribs; the trace carries the subject. The WAITING FOR A CHINOOK desk print is plain B&W.
- Russell's tag now reads "CHARLIE RUSSELL · PHOTOGRAPHED C. 1900"; "(in 1886 he was 22)" is a separate handwritten note off the photo.
- **The painting is one constant `P`** (file, size, tag, mask, and steer / head / hip / wolves / sky as fractions of the picture). Every
  painting shot's camera is computed from it (`pk`, `zw`); the wolves shot ends framing all wolves together and loops each one, so it
  works for the 1907 repainting (one coyote, right) and the 1886–87 original (wolves upper left, right, lower right). `ORIGINAL_1887`
  is defined with its points (from the 406 px Commons copy); to swap, set `P = ORIGINAL_1887` and give it a steer mask. Not swapped yet;
  the tag now says the current image is Russell's 1907 version.
- Music: `aw_white_cold` at `bed('aw_white_cold')` from frame 0, out under the channel intro; on the title card the same cue continues
  (from where it would be) at 1.2× the bed, fading in over 12 frames, so the stamp lands on a rising bed rather than under a loud one.
- Portrait rule (Oct 27): Russell is now a full bust cut-out on the desk (`Bust` in `src/kit/ch02_extra.tsx`: no print, no
  photo background, soft contact shadow, coral see-through tint + teal trace as the beat's subject). Hat outline re-traced on a
  brightened grid of the scan (`review/ch01_mask_russell_fix.py`); check: `review/ch01-03_mask_closeup.jpg`.
