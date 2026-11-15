#!/bin/bash
# Render a chapter edit and mix it with its narration, its scene sound and music (Ep 4; copied from ../../ep3/edit/build_ch.sh).
#   ./build_ch.sh ch01                       music and one-shots from mix/ch01.sh (one table per chapter: MUSIC=(...), SFX="...")
#   ./build_ch.sh ch01 cue@volume@start@offset[@end[@fadeout]] ...      or give the cues on the command line (as Ep 3)
#     start = where the cue enters in the chapter (s); offset = where in the cue file it starts (s); end = where it stops (default:
#     chapter end); fadeout = its fade-out length in seconds (default 1.4; 0.25 for a cut-out)
#     A cue is named by its Ep 4 name (SUNO_PROMPTS.md, e.g. ga_the_fire). Until that file exists in ../public/music/, the stand-in
#     listed in mix/cues.tsv is used (from Ep 1 to 3's music folders). Drop the real cue in ../public/music/ and rebuild: nothing else
#     changes (re-check the offsets and levels by ear).
#   SFX="boom@0.25@66.8 ..."  extra one-shots: name@volume@at, from ../public/sfx/, else ../../ep3/public/sfx/, else the channel's ../../../../sfx/
#   Narration: ../public/audio/<ch>.scene.wav when it exists (character lines placed in their room, ../tools/scene_mix.py), else <ch>.wav;
#   <ch>.fx.wav (beds and spots, already timed) is mixed in at full volume when it exists.
#   -> review/<ch>_720p.mp4 (frames are deleted after encoding; KEEP=1 keeps them)
#   FRAMES=<dir>  render the frames into <dir> instead of out/<ch>/      SCALE=0.6667  render straight to 1280 x 720 (render_edit.mjs)
#   FRAMEJPG=1    JPEG frames (a fraction of the disk)                     RES=1080      full-size master chapter, CRF 18 -> review/<ch>_1080p.mp4
#   EDIT_DIR=<ep4/edit>  run from a copy of this script (cp build_ch.sh /tmp/x.sh; EDIT_DIR=$PWD /tmp/x.sh ch01): another builder's edits
#                        to this file can then never break a run half way.
# Machine rule: only one frame render at a time across all builders: run the whole build under
#   flock <scratchpad>/render.lock ./build_ch.sh ...      (this script takes no lock itself, so it can never deadlock inside one)
set -e
cd "${EDIT_DIR:-$(dirname "$0")}"
RES=${RES:-720}
case $RES in 720) VF=(-vf scale=1280:720); CRF=20 ;; 1080) VF=(); CRF=18 ;; *) echo "RES must be 720 or 1080" >&2; exit 1 ;; esac
KEY=$1; shift
CUES=("$@")
if [ ${#CUES[@]} -eq 0 ] && [ -f mix/$KEY.sh ]; then source mix/$KEY.sh; CUES=("${MUSIC[@]}"); SFX=${SFX_OVERRIDE:-$SFX}; fi
CH=$(basename $(ls ../public/audio/${KEY}_*.words.json) .words.json)
WAV=../public/audio/$CH.wav; [ -f ../public/audio/$CH.scene.wav ] && WAV=../public/audio/$CH.scene.wav
music() { # an Ep 4 cue name -> its file (the real cue if it exists, else its stand-in from mix/cues.tsv)
  local n=$1 d
  for d in ../public/music ../../ep3/public/music ../../ep2/public/music ../../ep1/public/music; do [ -f $d/$n.mp3 ] && { echo $d/$n.mp3; return; }; done
  local s=$(awk -v k="$n" '$1==k {print $2}' mix/cues.tsv 2>/dev/null)
  [ -n "$s" ] && [ "$s" != "$n" ] && { music $s; return; }
  echo "no music file for $n" >&2; exit 1
}
sfx() { local d; for d in ../public/sfx ../../ep3/public/sfx ../../../../sfx; do [ -f $d/$1.wav ] && { echo $d/$1.wav; return; }; done; echo "no sfx $1" >&2; exit 1; }
N=$(python3 -c "import math;print(math.ceil($(node render_edit.mjs $KEY --dur)*30))")   # the edit's length
DUR=$(python3 -c "print($N/30)")
FR=${FRAMES:-out/$KEY}
FX=png; [ -n "$FRAMEJPG" ] && FX=jpg
mkdir -p "$FR" review
if [ ! -f "$FR"/f$(printf %04d $((N - 1))).$FX ]; then
  P=${PAR:-4}; STEP=$(( (N + P - 1) / P ))
  for i in $(seq 0 $((P - 1))); do node render_edit.mjs $KEY "$FR" $((i * STEP)) $(( (i + 1) * STEP )) & done; wait
fi
for i in $(seq 0 $((N - 1))); do [ -f "$FR"/f$(printf %04d $i).$FX ] || { echo "missing frame $i" >&2; exit 1; }; done
ARGS=(-framerate 30 -i "$FR"/f%04d.$FX -i $WAV); FL=""; MIX="[1]"; k=2
if [ -f ../public/audio/$CH.fx.wav ]; then ARGS+=(-i ../public/audio/$CH.fx.wav); MIX+="[$k]"; k=$((k + 1)); fi
for spec in "${CUES[@]}"; do
  IFS=@ read -r CUE VOL START OFF END FOD <<< "$spec"; END=${END:-$DUR}; FOD=${FOD:-1.4}
  LEN=$(python3 -c "print(max(0.1, $END - $START))"); FO=$(python3 -c "print(max(0, $END - $START - $FOD))")
  MF=$(music $CUE)
  ARGS+=(-ss $OFF -i $MF)
  D=$(python3 -c "print(int($START*1000))")
  FL+="[$k]atrim=0:$LEN,asetpts=PTS-STARTPTS,volume=$VOL,afade=t=in:d=0.6,afade=t=out:st=$FO:d=$FOD,adelay=$D|$D[m$k];"
  MIX+="[m$k]"; k=$((k + 1))
done
for spec in $SFX; do
  IFS=@ read -r NAME VOL AT <<< "$spec"; ARGS+=(-i $(sfx $NAME)); D=$(python3 -c "print(int($AT*1000))")
  FL+="[$k]volume=$VOL,adelay=$D|$D[s$k];"; MIX+="[s$k]"; k=$((k + 1))
done
FL+="${MIX}amix=inputs=$((k - 1)):normalize=0,aformat=channel_layouts=stereo[a]"
OUTF=review/${KEY}_${RES}p.mp4
ffmpeg -v error -y "${ARGS[@]}" -filter_complex "$FL" -map 0:v -map "[a]" "${VF[@]}" -c:v libx264 -pix_fmt yuv420p -crf $CRF -c:a aac -b:a 160k -t $DUR review/.${KEY}_${RES}p.part.mp4
mv review/.${KEY}_${RES}p.part.mp4 $OUTF   # never leave a partial file under the review name
[ -n "$KEEP" ] || rm -rf "${FR:?}"
echo "$OUTF"
