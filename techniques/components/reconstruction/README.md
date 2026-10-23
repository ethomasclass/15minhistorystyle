# Reconstruction (Oct 2026): worked examples

Copied from `projects/Reconstruction/tests/` (the test project for the three-part *Reconstruction* series). The reusable
parts are already in the template kit: `src/kit/vox.tsx` (Vox-study techniques), `src/kit/board.tsx` (the collage
board), and the tools listed below. These files show them used in full scenes; their imports point at the test
project's layout (`../kit/...`, `./common` = a `TestFrame` wrapper), so fix the paths when copying.

| File | What it is |
|---|---|
| `Ch06Test.tsx` | A whole chapter (Ep 1 ch06, "except as a punishment for crime") from primary sources: the tilted page with depth of field, the word-synced swipe, the spotlight cut, focus-in, motion carried through the cuts, the torn-paper reveal, the "vagrant" word match cut, numbered words, paper-slip notes, two music beds handing over, and the piece landing on the board. Render: `projects/Reconstruction/tests/renders/Ch06_vox_test_720p.mp4` |
| `voxkit.tsx` | The test copy of `src/kit/vox.tsx` |
| `CollageMocks.tsx` | The collage board stills: Episode 1's board, the one-night close-up, the title card |
| `CollageAnim.tsx` | The board in motion: Episode 1's board built piece by piece, and the close-up |
| `NoteOptions.tsx` | Handwriting legibility over pictures: as now / shadow pool / paper slip (chosen) / on the desk |
| `StereoTest.tsx` | The stereograph camera move: a camera pushes into a 3D photo built from a depth map (`tools/mono_depth.py`, `stereo_depth.py`, `prep_stereo.py`) |
| `AcresTest.tsx` | The forty-acres powers-of-ten zoom on a 3D map (`src/kit/map3d.tsx`; the map data from `tools/build_sea_islands.py`) |
| `tools/build_sea_islands.py` | Builds the Sea Islands map with the Field Order 15 strip and 1,085 forty-acre plots (Census coastline) |

Tools now in the template (`tools/`): `crease.py` (frameless creased old prints), `halftone.py`, `distress.py` (wear
masks), `silhouette.py` (a cut-paper silhouette traced from a real portrait), `word_hunt.py` (a word in LOC newspapers,
cropped dead centre, for the word match cut), `phrase_find.py` (phrases on a newspaper page with their line boxes, for
swipes), `scratch_voice.py` (a local scratch narration with real word timings, for building before the real voice),
`stereo_depth.py` / `mono_depth.py` / `prep_stereo.py` (the stereograph move), and `probe_text.mjs` with `SAFE=96`.
