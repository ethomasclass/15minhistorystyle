# 3D pieces: build brief (two builders in parallel)

Project: `projects/Diamond_Hoax` (Remotion 4, 1920×1080, 30 fps; `three` 0.170, `@react-three/fiber` 8, `@remotion/three`).
Video: *They Fooled America's Richest Men* (the Great Diamond Hoax, 1872). Read `script/SCENES.md` ("Drawn 3D builds" table and the
chapter beats) and skim `script/SCRIPT.md` (the narration lines each piece serves).

## Your files, and only your files
- Put each piece in its own file `src/fx/<Name>.tsx` (helpers in `src/fx/<name>/` if needed). Register a **test composition** for each
  piece in **your** registry only: `src/fx/registry_terrain.tsx` (terrain builder) or `src/fx/registry_desk.tsx` (desk builder),
  as `{id: 'Mesa', C: MesaTest, frames: 300}`. Root.tsx already registers them as `FX-<id>`.
- **Do not edit** `src/kit/*`, `src/Root.tsx`, `src/chapters.ts`, `src/masks.ts`, `tools/*`, the other builder's files, or anything
  under `public/img/ch0*` (another agent is downloading archival images there). New assets for your pieces go in
  `public/img/fx/<name>/`; new masks you make go in `public/img/masks/` with names prefixed `fx_`, imported directly in your file.
- **Do not commit or push.** Another process handles git.
- Machine: 4 cores shared with other work. **No full chapter renders.** Stills (`npx remotion still`) and short test clips only,
  rendered at `--scale=0.5` (or 0.667), one at a time.

## Make every piece a reusable component
Each piece takes its beats as **frame props** (`at`, plus named beats like `tipAt`, `resetAt`) so a chapter can anchor it to spoken
words later (`t.at('Domino one')`). Default props drive the test composition. Export the component, the test, and a frame count.
Document the props in a header comment, like `projects/Halloween_Bribe/src/fx/CandyPile.tsx`.

## The look (non-negotiable; full rules in `.claude/skills/15-minute-history/references/visual-style.md` and
`explainer-craft.md` §6)
- Dark notebook desk background: `DarkPaper` (`src/kit/common.tsx`) or the radial `#2a2620 → #0d0c09`; finish with `Finish`
  (`src/kit/Kit.tsx`) for grain and vignette.
- **Drawn 3D, never photoreal**: teal `#2FE0C4` lines and contours on black/dark surfaces, cream `#F4EFE6` sparingly, **one coral
  `#FF6F61` element** (the subject), orange `#FF9F1C` only for torn-tape titles (`Highlight`) and route/arc lines. No white or cream
  slabs or cards.
- **Marks step at 12 fps** (`useGFrame()` from `src/kit/Kit.tsx`, which `ChapterShell` sets up; in a bare test wrap in
  `StepCtx`/`PaletteCtx` as the kit does, or step manually: `Math.floor(f / 2.5) * 2.5`). **Camera moves are smooth** (use the raw
  frame). One camera move per shot; design the end frame first.
- Weight: slap/overshoot settles, contact shadows, a small camera shake on hard landings (see `src/kit/west.ts`-style helpers in
  `projects/American_West/ep1/src/kit/west.ts` and `src/previews/`).
- Text: `Highlight` (orange tape), `Note` (teal handwriting), mono labels. **Text never within 96 px of the frame edge.** Run
  `SAFE=96 node tools/probe_text.mjs FX-<id>` on each test.
- "Not to scale" / "heights exaggerated" in small mono where it applies. Real data where you can get it.
- Reference code to copy from (read, don't import across projects): `projects/American_West/ep2/src/ch/Ch08.tsx` (ThreeCanvas,
  drawn style, teal outlines), `projects/American_West/ep2/src/kit/` (cut-aways), `projects/Halloween_Bribe/src/fx/` (Corridor 3D,
  CandyPile physics baked at module load for deterministic rendering, AtlanticMap), this project's `src/kit/map3d.tsx` (tilted map,
  `Slab`, `Route`, `Stake`, `Pin3`).
- Remotion rules: everything is a pure function of the frame (no `Math.random`, no state across frames; seed noise with
  `@remotion/noise` or a seeded RNG at module load). Three.js scenes inside `<ThreeCanvas>` from `@remotion/three` with
  `useCurrentFrame` driving them.

## Assets you can use
- Props (cut-outs, transparent WebP): `public/img/props/<name>.webp`: leather_pouch, rough_diamond, rough_rubies, stone_pile,
  diamond_drill_bit, claim_stake, jeweler_loupe, lantern, pointed_stick, bandana_blindfold, slouch_hat, top_hat, share_certificate
  (blank centre), banknotes_stack, cup_of_sugar, pocket_watch, undertaker_coffin, henry_rifle. Show props B&W on the desk
  (`src/kit/prop.tsx` `Prop`: optional coral tint + teal trace).
- Thumbnail H1 assets: `public/img/gen/thumb/cousins_a_pro.png` (+ masks `cousin_l`, `cousin_r`), `tycoon_b_clean.png` (+ mask
  `tycoon_b`); the H1 layout is in `src/ThumbsDiamond.tsx` (`Scene`, `COUSIN_L/R`, `TYC_LOW`).
- Gemini for anything missing (`tools/gemini_image.py`, key in `.env`; never print it). Keep it to a few images, plain
  backgrounds, no text, no real people; record each in `script/AI_IMAGES.md` under a new "3D builds" heading (append only).

## Checks before you report
`npx tsc --noEmit -p .` (ignore errors in the other builder's files), stills at 3–4 points of each piece, look at every still
yourself and fix what's wrong, the text probe, then one short test clip per piece (`npx remotion render src/index.ts FX-<id>
out/fx/<id>.mp4 --scale=0.5`). Make a labelled contact sheet of your stills: `review/contact/fx_<terrain|desk>.jpg`.
Report in under 300 words: each piece, its props, what's on screen, anything imperfect, and any asset you wished you had.
