# Paused renders: how to resume (Nov 24)

Renders were paused at the user's request. Every render loop skips frames already on disk, so re-running a command
continues where it stopped. Run long commands as tracked background jobs. All Blender runs go through `blender-queue`
(a shared two-slot lock: `/usr/local/bin/blender-queue`, recreate it if the machine was replaced:
`while true; do for s in 1 2; do exec 9>/tmp/blender_slot$s.lock; if flock -n 9; then exec nice -n 10 "$@"; fi; done; sleep 3; done`).

Decision pending: run the final (full-frame-rate) renders here, or on the user's computer if it has a GPU (about 1 hour
vs about 12 hours here).

## Cold-open tails (lead): `blender/coldopen.py` TAIL modes, composited by `tools/tails_comp.py`
- Done: joins 1 (step-4 test), 2, 24 (`renders/tests/transitions/01_*, 02_*, 24_*`).
- To do: `cd blender && TAILS="flag_swap decl_in" build/tails/run_tails.sh` (step 3, 50%), then
  `python3 tools/tails_comp.py swap` and `... decl_in`.
- Join 21: the fixed late light (stronger sun, the paper turned about its own centre) needs: the full-size end frame
  `TAIL=later_light TAIL_ONLY=1 blender-queue xvfb-run ... coldopen.py -- build/tails/ll_end 0 0 100` copied to
  `renders/tests/transitions/21_room_paper_end.png`, then `TAIL=later_light TAIL_STEP=3 ... build/tails/later_light 0 0 50`,
  then `python3 tools/tails_comp.py later`. Then deskB: set `PAPER` in `tools/desk_b.py` and `python3 tools/desk_b.py abdication`.
- Join 18 comp (the 44-star flag into the Declaration's second underline) once the sets builder's `18_flag.mp4` exists.

## Pitch room (pitchroom builder): `blender/pitchroom.py`, `blender/church_interior.py`
- Done: H4 still, lighting and gesture pass, board pictures in `build/pitchroom/`, `j05` frames.
- Resume: `bash build/pitchroom/q.sh > build/pitchroom/q.log 2>&1` (from EP): j05, j06 (50 of ~64 done), church frames
  (re-makes `board_church.png`), lecture.py frames 38 to 62, then j09, j10, j08, same, pitch, j04.
- Then `bash build/pitchroom/make_videos.sh` (04, 05_06, 08, 09, 10), `build/pitchroom/assemble.py` (pitchroom_beats),
  `build/pitchroom/sheet.py`, and copy j08's last frame (or render mode h8 at 100%) to `08_h8_end.png`.
- Note: the census piece's last frame carries the kit vignette (~10/255 off H4 at the corners); end it ungraded.
- Rough: docks/church heads are held stills; the lecturer's spectacles read as goggles; sun glare at the table's left end.

## 3D maps (maps3d builder): `blender/mapshots.py` (modes dive, pacific, oahu8, pearl, quiet), `tools/maps3d_cut.py`
- Done: `23_pearl_start.png`, `11_dive.mp4` test.
- Join 8: key-frame tests `SAMPLES=8 FRAMES=0,20,36,50,75,95,115 blender-queue xvfb-run ... mapshots.py -- ../build/maps3d/pacific 50 pacific`
  and `oahu8` with `FRAMES=0,15,30,50,90,140`; then `FRAMES=0:124:2` / `0:143:2`; then `python3 tools/maps3d_cut.py 8`.
  (The pacific mode crashed once; the fix is in but untested.)
- Joins 14+15: `SAMPLES=8 FRAMES=0:181:2 ... mapshots.py -- ../build/maps3d/pearl 50 pearl` plus frame 180; set `T14` to
  where the sugar smoke's bone haze lands; `python3 tools/maps3d_cut.py 14`.
- Join 23: `SAMPLES=8 MESH=hi FRAMES=0:505:3 ... mapshots.py -- ../build/maps3d/quiet 50 quiet`; `python3 tools/maps3d_cut.py 23`.
- Join 11 re-cut: `SAMPLES=8 FRAMES=0:162:2 ... dive 50 dive`; `python3 tools/maps3d_cut.py 11`. Rough: the relief's
  ridges sit lower than H1's mountains at the landing; the shoreline steps up close; the card blurs mid-dive.
- Then `python3 tools/maps3d_cut.py sheet`.

## Chapter 6 sets (sets builder): harbor, committee, sugar, govbuilding, pineapple, senate, docks; `blender/join16.py`, `blender/fx.py`
- Done: `20_senate_edge_start.png`, `18_flag_end.png` (final). `19_pineapple_end.png` is a placeholder (fruit too big,
  a crown crosses it): re-render first. All loops skip existing frames (`FORCE=1` re-renders).
- Mostly written, not yet rendered: expect script errors on first runs.
- Resume, from `build/sets` with `E=<ep1 path>` and `R='blender-queue xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python'`:
  1. `eval $R $E/blender/pineapple.py -- $E/build/sets/pine2 100 end`, copy `pine2/pineapple_end.png` to
     `renders/tests/transitions/19_pineapple_end.png`; then deskB: set `PINE` in `tools/desk_b.py`, `python3 tools/desk_b.py dole`.
  2. `./queue.sh` (remove its first two lines: gov flag_end and pineapple end are done): harbor head/wipe/sack, landing
     0 to 58, sugar rise/fields, pineapple run, senate reveal, docks push and senate wide (polish "after" stills).
  3. `ANIM_SCALE=50 STEP=2 eval $R $E/blender/govbuilding.py -- $E/build/sets/gov 50 flagrun` (join 18).
  4. Composites: `python3 comp16.py committee/window harbor/head 294 48 c16`;
     `python3 comp17.py harbor/wipe harbor/wipemask landing <N_H2> c17` (N_H2 = the `WIPE:` line in the harbor wipe log).
  5. `./enc.sh <dir> 15 ../../renders/tests/transitions/NN_name.mp4` (10 for pineapple), then delete frame folders.
  6. `polish_sheet.py` (before: `renders/tests/sets/`, after: the new stills).
- Open: join 17's wipe sits on "Minister, here" (not "who ordered"), else the cutters shot is ~1.6 s; join 16's night-to-day
  grade through the glass and join 17's hull pass are unseen; the turn from the rifles to the window is quick (~0.4 s).
