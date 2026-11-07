#!/bin/bash
# Render a chapter edit and mix it with its narration and music: ./build_ch.sh ch01 <music_cue> <bed_volume> [music_offset_s]
#   -> review/<ch>_720p.mp4 (frames in out/<ch>/, git-ignored)
set -e
cd "$(dirname "$0")"
KEY=$1; CUE=$2; VOL=$3; OFF=${4:-0}
CH=$(basename $(ls ../public/audio/${KEY}_*.words.json) .words.json)
WAV=../public/audio/$CH.wav
N=$(python3 -c "import json,math;print(math.ceil(json.load(open('../public/audio/$CH.words.json'))['duration']*30))")
mkdir -p out/$KEY review
P=4; STEP=$(( (N + P - 1) / P ))
for i in $(seq 0 $((P - 1))); do node render_edit.mjs $KEY out/$KEY $((i * STEP)) $(( (i + 1) * STEP )) & done; wait
DUR=$(python3 -c "print($N/30)")
ffmpeg -v error -y -framerate 30 -i out/$KEY/f%04d.png -ss $OFF -i ../public/music/$CUE.mp3 -i $WAV \
  -filter_complex "[1]atrim=0:$DUR,asetpts=PTS-STARTPTS,volume=$VOL,afade=t=in:d=0.6,afade=t=out:st=$(python3 -c "print($DUR-1.5)"):d=1.5[m];[2][m]amix=inputs=2:normalize=0[a]" \
  -map 0:v -map "[a]" -vf scale=1280:720 -c:v libx264 -pix_fmt yuv420p -crf 20 -c:a aac -b:a 160k -t $DUR review/${KEY}_720p.mp4
echo "review/${KEY}_720p.mp4"
