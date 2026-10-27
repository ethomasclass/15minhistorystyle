# Build notes: ch05 · Who the Cowboys Were (126.4 s)

File `src/ch/Ch05.tsx`; masks `src/masks_ch05.ts` (job `tools/mask_jobs/ch05.py`: `c5_ikard`, `c5_reeves`, `c5_vaquero`); helpers in
`src/kit/ch456_extra.tsx`. Contact sheet `review/stills/ch05_sheet.jpg` (31 frames). Checks: tsc clean, `anchors.py` passes (repeats checked:
"On the trail" ×2, "Before the war" ×2, "Rodeo"/"bronco" ×2 via the WORDS table, "And here's"), `probe_text` (SAFE=96) clean.

| # | Anchor | Shot |
|---|---|---|
| 1 | 0 | myth: Beadle's Half Dime Library cover + Buffalo Bill's Wild West poster (Cody on horseback) slap down; "the cowboy from the movies" |
| 2 | Tall | cut-in on Cody; four quick ticks: tall ✓ white ✓ older ✓ doing well ✓ |
| 3 | The real | the ticks strike through in coral on "none"; "usually none of those." (**aw_legend_sours turns here**: LEGEND_TURN = 25 s lands on "none") |
| 4 | Most | teenagers / young men; $25–40 a month; coin slaps: ≈ $1 a day |
| 5 | And a lot | Black cowboys, Texas, c. 1913 (photo, plain); "and a lot of them / weren't white." |
| 6 | Historians | four drawn riders, the fourth turns coral: ≈ 1 in 4 "was Black" (historians' estimate) |
| 7 | Many | before the war: enslaved on Texas ranches → after: the same work, for wages (branding iron, lariat props) |
| 8 | Remember | Goodnight's bust (plain B&W) → **Bose Ikard** bust lands beside it (coral tint + trace); BOSE IKARD; born enslaved |
| 9 | On the trail | cut-in on Ikard: fought off Comanche raids, rode out stampedes |
| 10–11 | Goodnight said / He was | Goodnight's words as quote lines: "farther than any living man." / "my detective, banker, and everything else." (last line coral) |
| 12–14 | On the trail (2) / In town / Both | two-views card (dark, teal rule): ON THE TRAIL ate/slept/worked the same · IN TOWN the same color line he had left; "Both things were true." |
| 15–17 | And here's / Not north / Somewhere | map: Texas hatched; "Not north. South." the escape route (coral) to the Rio Grande / Mexico, "slavery was illegal in Mexico"; 3,000 – 10,000 made it |
| 18 | One man | map: coral route north into Indian Territory (today's Oklahoma, hatched, labelled "roughly"), Fort Smith |
| 19–20 | His name / In 1875 | **Bass Reeves** bust (c. 1907, coral tint + trace); 1875 tape: one of the first Black deputy U.S. marshals in the West |
| 21 | riding | map: Indian Territory with the Chisholm, Western and Shawnee trails crossing it |
| 22 | And then | Remington, A Mexican Vaquero (1890), coral vaquero; VAQUEROS / Mexican cowboys |
| 23 | working cattle | Vaqueros (1877) painting; "long before it was part of the U.S." |
| 24 | They taught | Buffalo Bill's 1899 vaquero poster (grey); they taught the trade / you can still hear it / in the words |
| 25–29 | Lariat … bronco | each English word on orange tape, its Spanish source on a dark torn tag ("from the Spanish"), the prop on the desk: lariat ← la reata (p3_lariat), chaps ← chaparreras (p5_chaps), ranch ← rancho (p5_sombrero), rodeo ← rodeo (p5_corral), bronco ← bronco (p5_bronco) "= rough" |
| 30 | In 1874 | HingeYear 1874 tease (the Black Hills · …and one more) |

**Music:** `aw_legend_sours` from frame 0, started so its turn (25 s) lands on "none of those", to "Remember Goodnight" →
`aw_long_drive` from 85 s (`startFrom: 30 * 85`; ch03 uses its first 85 s) to "In 1874" → `j_intrigue` under the tease (ch06 picks it up).

**Still rough**
- Bose Ikard's only PD photo is a 200 px Commons scan; `b_ikard_up.jpg` is a 4× Lanczos enlargement. It reads as an old print, but it is soft
  at the cut-in. A better scan would help.
- Bass Reeves photo: the badge is a small pin on the lapel, not prominent; the coral tint runs warm on this dark print (kept at 0.25).
- "Ranch ← rancho" uses the sombrero prop (a ranch has no single object); the spurs are unused.
- Images I sourced (`b_`, `public/img/credits_ch05_b.json`): the Buffalo Bill pennant poster (LOC, downsized from a 450 MB master) and its
  top-panel crop, the Ikard enlargement. Unused from the image agent: `grabill_the_cow_boy_1888.jpg`, `texas_map_rio_grande_…_1856.jpg`.

**Portraits (Oct 27 rule):** Bose Ikard (`c5_ikard_bust`, the full-figure mask cut at the chest) and Bass Reeves (`c5_reeves_bust`, the
photo-edge crop rounded into a bust; parameters in `tools/mask_jobs/ch05.py`) are bust cut-outs with coral tint + trace; Goodnight beside
Ikard is a plain B&W bust (`c4_goodnight`). The Remington vaquero is a painting of a rider, the Cody figure is on a poster, and the Black
cowboys are a group photo, so those stay prints.
