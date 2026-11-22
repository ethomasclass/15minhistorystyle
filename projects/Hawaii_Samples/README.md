# Hawaiʻi technique samples

Five short test films (no narration yet) about the overthrow and annexation of Hawaiʻi. Each one tries a technique
picked up from the open-source video-skill repos, in the channel's look: one camera that glides, marks on twos, hard
cuts with no dissolves, every picture credited, titles in the orange tape box. Facts and picture sources: [FACTS.md](FACTS.md).

| Film | Technique | Borrowed from |
|---|---|---|
| `video/s1_pear_ripe.mp4` (17 s) | **Pull back to the desk.** Tight on the 1893 landing-force photo, pull back without a cut until it is a print on Minister Stevens' desk, then glide to his despatch; "fully ripe" is underlined and looped. | MagnatesMedia's reveal; cinematic-skill's camera |
| `video/s2_three_days.mp4` (18 s) | **Everything on one clock.** 14–17 January 1893 on one running timeline; cards slap down above their pins; the Queen's words land last; the board pulls back to show all four days. | lemo-opuscar *Visual Investigation* |
| `video/s3_kue_petition.mp4` (17 s) | **The light table.** A glide across the archive table, a loupe landing on the 1897 Kūʻē petition, the line "earnestly protest against the annexation" lighting up, then the count of 21,269 names. | lemo-opuscar *Archive Light Table* |
| `video/s4_palace_window.mp4` (16 s) | **Through the window.** From the faceted poster palace, push through an upper window into the room where her 1891 portrait hangs. The room sits deeper, so it grows more slowly (parallax, no dissolve). | onetake's zoom-through; Retro_Poster_Test style |
| `video/s5_flag_match_cuts.mp4` (14 s) | **Match cuts.** The illustration and the 1898 ceremony photo registered on the palace tower; quickening hard cuts under one continuous push; the Hawaiian flag lower each time, then the U.S. flag up. | horizon-montage (registration, one camera across cuts) |

## Build
```
cd tools
python3 textures.py                      # desk and light table (once; run from the project folder)
python3 s1_pear.py                       # -> build/s1_pear/{base.html, frames.ndjson, events.json}
node anim_render.mjs ../build/s1_pear    # frames
python3 encode.py ../build/s1_pear ../video/s1_pear_ripe.mp4
```
The same for `s2_clock`, `s3_petition`, `s4_window` and `s5_flags`. Each takes about one to two minutes to render.

- `tools/kit.py`: the monotone camera spline (Fritsch–Carlson, zoom in log space, holds that drift, faint handheld
  wobble), automatic whooshes from camera speed, the stage writer, and the channel's pieces (photo card, mono source
  tag, Highlight, Nanum note, Slip, drawn teal marks, hand-drawn loop).
- `tools/encode.py`: moving film grain on twos, a soft vignette, and a sound mix from `sfx/` (CC0 sounds from
  agent-video-editor, see `sfx/LICENSES_excerpt.txt`, plus a synthesised light-table hum) and the channel's `sfx/`.
- s4 and s5 import the faceted poster kit from `../Retro_Poster_Test/tools`.

## Notes for the real video
- **Fonts:** the channel's woff2 fonts are subsets that lack the kahakō (ā ē ī ō ū), and most also lack the ʻokina.
  These samples use full Google Fonts files (`fonts/*-full.ttf`); Abril and Nanum fall back to Playfair and Inter for
  the ʻokina. The template's fonts need replacing before a Hawaiian-language video.
- **Pictures:** Wikimedia Commons rate-limited this machine all session, so everything came from the Library of
  Congress (full-size master TIFFs) and the National Archives. The Commons photos of the 1898 flag lowering and
  raising, and a portrait of Stevens, are still worth getting.
- **The "pear" quotation** is from the published diplomatic correspondence (FRUS 1894); check it against a scan.
