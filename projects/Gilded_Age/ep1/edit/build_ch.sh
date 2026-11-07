#!/bin/bash
# Render a chapter edit and mix it with its narration and music.
#   ./build_ch.sh ch01 ga_gilded_theme 0.105                    one cue for the whole chapter (from its start)
#   ./build_ch.sh ch09 ga_bad_wire@0.115@0@0@55.5 ga_gilded_theme@0.105@55.5@62.7   several cues: cue@volume@start@offset[@end]
#     start = where the cue enters in the chapter (s); offset = where in the cue file it starts (s); end = where it stops (default: chapter end)
#   -> review/<ch>_720p.mp4 (frames in out/<ch>/ are deleted after encoding)
set -e
cd "$(dirname "$0")"
KEY=$1; shift
if [ $# -eq 2 ] && [[ "$1" != *@* ]]; then set -- "$1@$2@0@0"; fi
CH=$(basename $(ls ../public/audio/${KEY}_*.words.json) .words.json)
WAV=../public/audio/$CH.wav
N=$(python3 -c "import json,math;print(math.ceil(json.load(open('../public/audio/$CH.words.json'))['duration']*30))")
DUR=$(python3 -c "print($N/30)")
mkdir -p out/$KEY review
if [ ! -f out/$KEY/f$(printf %04d $((N - 1))).png ]; then
  P=4; STEP=$(( (N + P - 1) / P ))
  for i in $(seq 0 $((P - 1))); do node render_edit.mjs $KEY out/$KEY $((i * STEP)) $(( (i + 1) * STEP )) & done; wait
fi
ARGS=(-framerate 30 -i out/$KEY/f%04d.png -i $WAV); FL=""; MIX="[1]"; k=2
for spec in "$@"; do
  IFS=@ read -r CUE VOL START OFF END <<< "$spec"; END=${END:-$DUR}
  LEN=$(python3 -c "print(max(0.1, $END - $START))"); FO=$(python3 -c "print(max(0, $END - $START - 1.4))")
  ARGS+=(-ss $OFF -i ../public/music/$CUE.mp3)
  FL+="[$k]atrim=0:$LEN,asetpts=PTS-STARTPTS,volume=$VOL,afade=t=in:d=0.6,afade=t=out:st=$FO:d=1.4,adelay=$(python3 -c "print(int($START*1000))")|$(python3 -c "print(int($START*1000))")[m$k];"
  MIX+="[m$k]"; k=$((k + 1))
done
FL+="${MIX}amix=inputs=$((k - 1)):normalize=0[a]"
ffmpeg -v error -y "${ARGS[@]}" -filter_complex "$FL" -map 0:v -map "[a]" -vf scale=1280:720 -c:v libx264 -pix_fmt yuv420p -crf 20 -c:a aac -b:a 160k -t $DUR review/${KEY}_720p.mp4
rm -rf "out/${KEY:?}"   # frames are ~3 GB a chapter: keep only the video
echo "review/${KEY}_720p.mp4"
