#!/bin/bash
# Render a chapter edit and mix it with its narration, its scene sound and music (Ep 3; copied from ../../ep2/edit/build_ch.sh).
#   ./build_ch.sh ch01 cue@volume@start@offset[@end[@fadeout]] ...
#     start = where the cue enters in the chapter (s); offset = where in the cue file it starts (s); end = where it stops (default:
#     chapter end); fadeout = its fade-out length in seconds (default 1.4; 0.25 for a cut-out)
#   SFX="boom@0.25@66.8 ..."  extra one-shots from ../public/sfx/<name>.wav: name@volume@at
#   Narration: ../public/audio/<ch>.scene.wav when it exists (character lines placed in their room, SOUND.md), else <ch>.wav;
#   <ch>.fx.wav (beds and spots, already timed) is mixed in at full volume when it exists.
#   -> review/<ch>_720p.mp4 (frames in out/<ch>/ are deleted after encoding; KEEP=1 keeps them)
#   FRAMES=<dir> ./build_ch.sh ...   render the frames into <dir> instead of out/<ch>/ (deleted after encoding, as out/<ch>/)
#   RES=1080 ./build_ch.sh ...   full-size master chapter, no scale, CRF 18 -> review/<ch>_1080p.mp4 (same mix; default RES=720)
set -e
cd "$(dirname "$0")"
RES=${RES:-720}
case $RES in 720) VF=(-vf scale=1280:720); CRF=20 ;; 1080) VF=(); CRF=18 ;; *) echo "RES must be 720 or 1080" >&2; exit 1 ;; esac
KEY=$1; shift
CH=$(basename $(ls ../public/audio/${KEY}_*.words.json) .words.json)
WAV=../public/audio/$CH.wav; [ -f ../public/audio/$CH.scene.wav ] && WAV=../public/audio/$CH.scene.wav
N=$(python3 -c "import math;print(math.ceil($(node render_edit.mjs $KEY --dur)*30))")   # the edit's length
DUR=$(python3 -c "print($N/30)")
FR=${FRAMES:-out/$KEY}
FX=png; [ -n "$FRAMEJPG" ] && FX=jpg   # FRAMEJPG=1: JPEG frames (render_edit.mjs), for 1080p builds on a small disk
mkdir -p "$FR" review
if [ ! -f "$FR"/f$(printf %04d $((N - 1))).$FX ]; then
  P=4; STEP=$(( (N + P - 1) / P ))
  for i in $(seq 0 $((P - 1))); do node render_edit.mjs $KEY "$FR" $((i * STEP)) $(( (i + 1) * STEP )) & done; wait
fi
ARGS=(-framerate 30 -i "$FR"/f%04d.$FX -i $WAV); FL=""; MIX="[1]"; k=2
if [ -f ../public/audio/$CH.fx.wav ]; then ARGS+=(-i ../public/audio/$CH.fx.wav); MIX+="[$k]"; k=$((k + 1)); fi
for spec in "$@"; do
  IFS=@ read -r CUE VOL START OFF END FOD <<< "$spec"; END=${END:-$DUR}; FOD=${FOD:-1.4}
  LEN=$(python3 -c "print(max(0.1, $END - $START))"); FO=$(python3 -c "print(max(0, $END - $START - $FOD))")
  MF=../public/music/$CUE.mp3; [ -f $MF ] || MF=../../ep1/public/music/$CUE.mp3   # the series theme lives in Ep 1
  ARGS+=(-ss $OFF -i $MF)
  D=$(python3 -c "print(int($START*1000))")
  FL+="[$k]atrim=0:$LEN,asetpts=PTS-STARTPTS,volume=$VOL,afade=t=in:d=0.6,afade=t=out:st=$FO:d=$FOD,adelay=$D|$D[m$k];"
  MIX+="[m$k]"; k=$((k + 1))
done
for spec in $SFX; do
  IFS=@ read -r NAME VOL AT <<< "$spec"; ARGS+=(-i ../public/sfx/$NAME.wav); D=$(python3 -c "print(int($AT*1000))")
  FL+="[$k]volume=$VOL,adelay=$D|$D[s$k];"; MIX+="[s$k]"; k=$((k + 1))
done
FL+="${MIX}amix=inputs=$((k - 1)):normalize=0,aformat=channel_layouts=stereo[a]"
ffmpeg -v error -y "${ARGS[@]}" -filter_complex "$FL" -map 0:v -map "[a]" "${VF[@]}" -c:v libx264 -pix_fmt yuv420p -crf $CRF -c:a aac -b:a 160k -t $DUR review/${KEY}_${RES}p.mp4
[ -n "$KEEP" ] || rm -rf "${FR:?}"   # frames are ~3 GB a chapter: keep only the video
echo "review/${KEY}_${RES}p.mp4"
