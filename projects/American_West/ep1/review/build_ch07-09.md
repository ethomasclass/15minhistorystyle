# Build notes · chapters 7–9 (Where It Will Do Most Good · Panic · The Picture)

Files: `src/ch/Ch07.tsx`, `Ch08.tsx`, `Ch09.tsx`; shared helpers `src/kit/ch07_extra.tsx` (DeskShot, Print, Node, Wire, Hand, Strike,
Marks, Sounds, `WShots`); masks `src/masks_ch07.ts`, `masks_ch08.ts`, `masks_ch09.ts` (jobs in `tools/mask_jobs/ch07–09.py`, traces in
`tools/traces/c7_*.json`, `c9_longhorn.json`); images `public/img/ch07–09/`, credits `public/img/credits_ch07–09.json`.
Contact sheets: `review/stills/ch07_sheet.jpg`, `ch08_sheet.jpg`, `ch09_sheet.jpg`. Mask close-ups: `review/ch07_mask_closeup.jpg`,
`review/ch09_mask_closeup.jpg`, `review/ch07-08_prop_masks_closeup.jpg`. AI image log: `review/ai_images_ch07.md`, `ai_images_ch08.md`.
Helper scripts used (Gemini line finder, prop generator, mask close-up/refine for mask_jobs entries, which the shared tools don't read):
`review/ch07-09_tools/`.

Checks (all on the re-voiced audio): `tsc` clean for these files; `anchors.py` no missing anchors (repeats checked, `nth` where needed);
`probe_text.mjs Ch07,Ch08,Ch09 10` → **no text crosses the frame edge**. Note: `WShots` (my copy of the kit's `Shots`) renders whips as
plain cuts only when `inputProps.probe` is set, so the probe measures each shot's layout instead of the deliberate 900 px whip offset
(before that change the only hits were 1–2-frame blurred whip frames).

## Ch07 · Where It Will Do Most Good (105.7 s + tail) · music `a_price` 0.15 → **SUNO: `aw_robber_barons`**
1. "paid by the mile?" desk push: Carbutt's 100th-meridian print, PAID BY THE MILE tape, bond rates $16k/$32k/$48k (mountains coral).
2. "men running the UP… paid twice" detail pan across the UP officials, "paid **twice**".
3–7. Crédit Mobilier money loop (drawn nodes): title + "fancy French name" (wide) → "hired to build it" → push: "$$$ far more than it cost" (AI coins) + gov't loans → THE SAME MEN coral wires + coral loop (pull) → stack "they were billing **themselves** / and the public was paying" over the dimmed loop.
8. "To keep Congress friendly… Oakes Ames" Ames print lands (pull), "Rep. Oakes Ames (Mass.)".
9. "handed out shares… cheap" push into Ames (coral), three AI stock certificates fan in, "**cheap.**".
10. "where they will do most good to us" Poland Committee report p. iv: focus pull + coral swipe on “where / it will do most good to us.” (Gemini word boxes, `review/ch07_most_good_*.json`); "subtle." held.
11–12. 1872: *The Sun*, Sept 4 1872 page lands (1872 tape) → push into THE KING OF FRAUDS (loop from Gemini headline boxes).
13. Colfax (coral) "Vice President Schuyler Colfax / caught up in it".
14. "To be fair" drawn timeline: Ames's share deals 1867–68 (coral) vs Grant takes office March 1869.
15. Grant (coral) "never accused of taking any shares".
16–17. Whiskey Ring: Leslie's 1876 trial engraving + title → tax diagram (AI barrels; the tax arrow struck, coral arrow to THE RING).
18. "Let no guilty man escape." Playfair quote beside Grant's print.
19. Babcock (coral) "Grant's private secretary".
20. Grant + Babcock prints, "Grant spoke up for him", 1876 · FOUND NOT GUILTY strip.
21–22. Two-views card (my own build): supporters left (won the war · 15th Amendment · troops against the Klan → "an honest man with **bad friends**"), critics right writes in (Crédit Mobilier · Whiskey Ring · Babcock let off → "a president who let it **happen**").
23–24. Plug: one small teal Note "subscribe ↓" (bottom right), over the card pulling out, then Ames + Sun prints on the desk.

## Ch08 · Panic (96.3 s + tail) · music `w_fire` 0.15 → **SUNO: `aw_panic`**
1. SEPT. 18, 1873 tape, Leslie's "Jay Cooke & Company's office" print lands. 2. Tilt down the engraving, "Jay Cooke & Co.". 3. Cut-in: AI bank doors, "**closes its doors**".
4–5. Cooke in a circle mount + drawn Northern Pacific line (planned dashed, built Duluth→Bismarck coral, approx.) → push to the end of track, coral ✕ "the money ran out here".
6. PANIC + definition over Leslie's crush at the Exchange door. 7. Broad Street after the doors closed (pan), CLOSED 10 DAYS.
8. DEPRESSION + definition, prices falling (approx., Warren–Pearson-based, labelled). 9. Counting grid: 89 of 364 railroads coral ("as commonly cited"), laid off by the thousands.
10–11. "why it matters…" handwriting → "jobs and wages, / not ~~the South~~".
12–13. 1874 House: before/after seat dots (approx. 199R–88D → 103R–182D; Democrats coral) + AI ballot box → "same name as today's Democrats, a very different party, 1870s: the party of the **white South**" (text on screen, as asked).
14. "a railroad boom. / a railroad **bust**. / a tired North." 15. Stack: "that means… it helped **end** Reconstruction in the South."
16. 1877: Leslie's, federal troops leave the New Orleans State House (April 1877).
17–18. 1877 tape on the Harper's Aug 11 1877 cover → detail of the Baltimore street fight, THE GREAT STRIKE.
19. Drawn line map Baltimore–Martinsburg–Pittsburgh–Chicago–St. Louis, coral rings, "trains **stopped**" (positions approx.).
20. Pittsburgh Union Depot burning, "about 100 killed". 21. Callback: the ch04 tunnel picture small beside the depot print, "1867: the strike in the mountains (almost no one heard)".
22. Harper's masthead/cover pull, "this time, **everyone** heard". 23. Hand-off: Harper's 1877 "Chinese immigrants at the San Francisco custom-house", dimmed push.

## Ch09 · The Picture (145.3 s + 20 s end screen; `EXTRA = 600` frames added to `CH09_FRAMES` and passed as `extra`)
Music: `r_nativism` 0.15 → `r_ending` 0.16 at "So let's go back to the question" (**SUNO: `aw_promise_theme`**), restarted under the
ledger at "Let's write it down" because `r_ending` is only 61 s; it carries the music-only end screen.
1. Hart Tunnel No. 8, the worker coral, pull out. 2–3. Dupont Street print (Lawrence & Houseworth) + "farms, mines, laundries, factories" → Chinatown pan.
4. "then the depression hit. wages **fell**." 5. Harper's custom-house engraving dimmed, "many white workers **blamed** the Chinese for working for less".
6. Kearney circle mount, 1877 tape, Workingmen's Party of California. 7. “The Chinese **must go!**” set large, word by word.
8–9. 1876 California Senate report lands ("newspapers… and even some doctors") → detail of its title, "“a danger” to white workers… and to white health".
10. "some of it was dressed up as “**science**”" (handwriting only; no skull imagery).
11–12. The enrolled Exclusion Act on the desk (CHINESE EXCLUSION ACT + 1882) → focus pull + swipe on "until the expiration of ten years / the coming of Chinese laborers / suspended" (Gemini line + word boxes, `review/ch09_exclusion_act_*.json`, check image `review/ch09_exclusion_swipe_check.jpg`).
13. Timeline 1882 → 1892 renewed → 1902 made permanent → 1943 repealed, coral bar, "61 years". 14. "the first major law… because of their **nationality**" over the dimmed Act.
15–17. Russell's torn print lands ("back to the question") → parallax push (P1's sky/crowd layers) → "who did it **open** it for?".
18–21. Quick callbacks: "it did tie the country together · coast to coast: months → a week" · Warren map "it built the West of the next three episodes" · drawn checkerboard · Carbutt print "travelers, shippers, settlers, railroad owners".
22–25. Callback cards: Ames ("paid by the mile · billing the **public**"), Grant ("Let us have peace" · shaken), troops leaving New Orleans ("freedmen in the South"), the Hart worker coral ("**shut out** by name").
26–28. The Promise Ledger (my variant of the kit's `Ledger`: same dark card and teal rules, but per-cell write-on frames, a tall first row and grey tape): drops on "This is our first promise" → push as "Progress for a reunited nation" and "travelers, settlers, railroad owners" write → pan as the coral "who didn't" cell writes.
29–30. "The railroad tied the country together" (the torn print, gap empty) → the coral Chinese worker slaps into the torn gap on "who was allowed", NOT IN THE PICTURE tape on "picture".
31–32. Warren map card, Kansas looped ("the end of a new rail line… a man had an idea") → small longhorn cut-out (Harper's 1874, hand-traced) drops in, ABOUT 5,000,000 COWS, "→ Episode 2".
33. End screen from "Thanks for watching" (≈ 28 s incl. the 20 s music-only extra): blurred dim Russell print on the desk, NOT IN THE PICTURE tape, "thanks for watching", two clean 800×450 video slots (y 300–750) and a 220 px subscribe circle (850–1070 × 800–1020), NEXT · EP 2 label.

## Sources
Archival (credits files): Carbutt UP excursion 1866 (sample); Oakes Ames, Colfax (LOC); Grant, Babcock Brady-Handy (Commons/LOC);
*The Sun* 4 Sep 1872 p.1 (LOC Chronicling America IIIF, full res); Poland Committee report 1873 p. iv (Cornell/IA); Leslie's Whisky Ring
trial 1876 (LOC); Leslie's Jay Cooke & Co. office, Closing the Exchange door, Broad Street 1873 (LOC); Jay Cooke c.1865 (Commons);
Leslie's New Orleans troop withdrawal 1877 (LOC); Harper's Baltimore cover Aug 11 1877 (LOC); Harper's Union Depot 1877 (Commons);
Lawrence & Houseworth Dupont Street c.1866 (LOC); Harper's custom-house 1877 (LOC); Kearney engraving 1878 (Commons); California Senate
"Chinese Immigration" 1876 (IA); Chinese Exclusion Act enrolled p.1 (NARA via Commons); Frenzeny & Tavernier Texas cattle 1874 (LOC);
Russell 1869, Hart Tunnel No. 8, Warren 1868 map (samples).
AI (no on-screen tag; logged): 5 new props (stock certificate, coins & notes, whiskey barrels, bank doors, ballot box) + 1 reused litho.

## Still rough
- Coral tint on the big portraits (Ames, Colfax, Grant, Babcock) uses PhotoCam's fixed SoftTint 0.65; it reads see-through but strong on light backgrounds.
- Ames and Babcock masks are clipped at the waist (chairs fused with the figures); the push-ins stay above it, but a wide of either would show the cut.
- Longhorn trace is hand-drawn and slightly loose on the left neck; fine at its small size, not for a zoom.
- Seat counts (1874 House), price fall and 89/364 railroads are labelled approx./"as commonly cited"; worth a fact check against a source the user prefers.
- Kansas is looped on the Warren map, not pinned to Abilene (not readable on the scan).
- Wikimedia rate-limited downloads (HTTP 429), so the Frenzeny "Holiday in Chinatown" and Leslie's sand-lot meeting couldn't be fetched; Dupont Street (1866) and the 1877 custom-house engraving stand in. Swap in the 1880 sand-lot engraving for the Kearney beat if Commons opens up.
- The two-views card's left column is my guess at ch06's supporters' list; align the wording with ch06 when both are built.
- AI coins show an illegible date; keep them small. The bank-door plate has invented script plaques (kept out of frame).
