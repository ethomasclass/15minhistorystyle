# Build notes · ch10 · The Last of the Five Thousand (77.1 s + 20 s end screen)

File `src/ch/Ch10.tsx` (`EXTRA = 600` frames added to `CH10_FRAMES` and passed as `extra`, like Ep 1 Ch09). Masks `src/masks_ch10.ts`
(+ ch01's steer mask `M1.steer`). Contact sheet `review/stills/ch10_sheet.jpg` (26 frames, incl. the end screen). Checks: tsc, anchors,
probe all clean. **Music:** `aw_promise_theme` for the whole chapter through the music-only end screen.

## Scenes
1. "So who actually got rich?" handwriting over the blurred painting print, "rich" coral.
2. "the men with herds, and the men with money behind them" longhorn + coin stack.
3–8. Callback cards (print on the desk + notes): McCoy (1874 engraving; ABILENE, KANSAS · FROM 1867; "made fortunes") · Goodnight
   (+ a British investor; "one of the biggest ranches in Texas") · the Homestake (open cut; 1877 → 2002) · the cowboys' wages (saddle;
   ≈ $25–40 A MONTH) · Bose Ikard ("more freedom on the trail… until they rode into town") · the 1868 treaty, Article II, with the nugget
   dropping onto it ("someone found gold under it").
9–13. **The Promise Ledger** (Ep 1's LedgerCard, two tall rows): row 1 (Ep 1) already written and dimmed; row 2 writes in on its words:
   *Anyone with nerve can get rich* · *herd owners, investors, the Homestake's owners; some cowboys, for a while* · *most cowboys and miners,
   small ranchers fenced out, the Lakota, whose land was mined* (coral). Wide → push → pans → pull back (kept inside the frame).
14. "So look at the steer again." the painting, push to the steer (teal trace).
15–16. Closing line over the dimmed painting: "about twenty years / four-dollar cows → **a fortune.**" then "one winter / → **a painting.**",
   THE LAST OF THE FIVE THOUSAND tape (callback to ch01's title), "the cowboys moved on".
17–18. Hand-off: Butcher's Rawding sod house, Custer County, Nebraska, 1886 (LOC) on the desk ("the farmers stayed", "promised something
   even bigger than grass") → push in, "the **land** itself.", "→ Episode 3".
19. End screen (≈ 25 s): blurred dim painting on the desk, CHEAP AS DIRT tape, "thanks for watching", two 800×450 video slots (y 300–750),
   a 220 px subscribe circle (850–1070 × 800–1020), NEXT · EP 3, and the **static Chunk History mark** (`brand/chunk-history-horizontal.svg`,
   62 px high, bottom right, clear of the slots).

## Sources
Callback images from the other chapters' folders (ch02 McCoy engraving, ch04 `b_goodnight_1905`, ch05 `b_ikard_up`, ch06 treaty p2, ch07
open cut, ch01 painting); new: the sod house (`b_sod_house_rawding_1886.jpg`, credits `public/img/credits_ch10_b.json`).

## Still rough
- Callback cards use those chapters' current files; if a builder renames an image, update `I` at the top of Ch10.
- Row 1's wording is copied from Ep 1 Ch09's ledger; row 2's from the script.
- The ledger's cells are 29-pt handwriting so five lines fit a row; legible at 1080p, small on a phone.

## Update, Oct 27 (portrait rule)
McCoy, Goodnight and Bose Ikard are now bust cut-outs (coral see-through tint + teal trace on their beats), from my own masks
`b10_mccoy`, `b10_goodnight`, `b10_ikard` (`tools/mask_jobs/ch10.py`). Hand fixes after rembg (re-apply if `tools/mask.py` is re-run):
- `review/ch07-10_tools/fixmask.py b10_ikard "-0,0 800,0 800,976 0,976" "+350,78 400,70 450,78 468,110 472,160 462,210 450,250 448,290 480,300 540,320 580,350 595,400 598,560 138,560 142,400 160,350 220,320 300,300 335,285 332,250 318,200 318,150 326,110"`
  (rembg lost his face against the dark leaves, so the bust is hand-traced; the source is only 800 px, so it is a little soft).
- `fixmask.py b10_mccoy "+700,640 800,540 900,505 1010,540 1100,620 1150,720 1160,840 1120,960 1080,1060 1060,1150 960,1250 800,1300 730,1200 715,1000 700,850 690,720" "-380,1080 720,1080 720,1290 600,1340 470,1420 380,1480"` then `"-950,480 1120,480 1120,640 1090,640 1040,580 1000,545"` (fills holes in the face, drops the hatched cloud and a paper sliver).
- `fixmask.py b10_goodnight "+360,480 450,480 450,575 360,575"` (a hole by the collar).
The Homestake and the treaty stay prints (not portraits).

## Update, Oct 27 (painting swap)
The painting is the restored 1887 original everywhere in ch10 (question, steer push, closing line, end screen) with ch01's mask
`c1_steer_1887` (registered in `src/masks_ch10.ts`). "So look at the steer again" pushes to the steer with the teal trace and a light coral
see-through tint (0.3); the closing-line handwriting moved up onto the sky; the camera stays clear of the small lettering under the title.
