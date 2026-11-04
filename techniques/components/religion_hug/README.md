# Religion videos (15 Minute Human Geography)

From the two AP Human Geography 3.7 explainers, October 2026: *Why Buddhism Vanished* (South Asian religions) and
*One Hilltop, Three Maps* (Judaism, Christianity, Islam). About 9:40 each, Vox-style, voiced with the usual clone.

## Files

- **`worldmap.tsx`**: a real world map in d3, which the template doesn't have. It was `src/kit/asia.tsx` in the videos.
  - `WorldMap` takes a camera of lon/lat/zoom keyframes (`Cam`) and a list of country `Fill`s that fade in at given frames.
  - `Dot` and `MapLabel` place pins and labels by screen position. Get the position with the `toScreen` render prop or with `project()`.
  - `C` holds ISO numeric country ids, `P` holds place lon/lats, and `centroid(id)` gives any country's centre.
  - Needs `npm i d3-geo topojson-client world-atlas @types/d3-geo @types/topojson-client`.
  - Imports `PAL`, `FONT`, `clamp` from `./look` and `useGFrame` from `./Kit` (template kit names).
  - Used for hearth maps, diffusion arrows, branch-of-Buddhism fills and the "three maps" recap.
- **`Intro_HumanGeography.tsx`, `LogoBreak_HumanGeography.tsx`**: the channel intro and chapter break with the wordmark set
  as **HUMAN / GEOGRAPHY** on two lines (Abril 150, top 500, nowrap). The orange underline moves to top 820 and is
  860 wide. Everything else matches visual-style.md §9.1. Drop them over the template's `Intro.tsx` / `LogoBreak.tsx`.

## What the user decided

- **Voice: no added expression.** Two takes with v3 audio tags ([warmly], [curious], ...) were rejected, one at
  stability 0.0 and one at 0.5. The user picked "take one": no tags, stability 0.5, the locked pace. See
  voice-and-audio.md §3.
- **Viewing guides: main ideas only.** The first worksheet had too many detail blanks. The user wanted students to "get
  the main points but not [be] concerned about nitpicky details". About 12 short questions per video, plus a blank
  world map for hearths and diffusion arrows. See classroom-handout.md.

## What worked

- Modern photos muted (`saturate(0.55)`) with teal/coral marks, and AI paintings for the past in the cutout look.
- Respect rules: no face for Muhammad, the Buddha or Guru Nanak. Worship shown respectfully. Say "many", not "all".
- Parallel chapter agents worked from one `script/SCENES.md` brief, and each agent edited only its own `ChNN.tsx`.
  The agents added a few figures that weren't in the script, so check every number on screen against a source.
- Wikimedia rate-limits (HTTP 429) on bulk downloads, so request standard thumbnail widths, sleep between requests and
  retry. Wrap any image that may not arrive in `hasFile(...) ? <Photo/> : <fallback/>`.
