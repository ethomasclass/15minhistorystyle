#!/bin/bash
# Render a short and mix it: ./build_short.sh s1 ga_bad_wire     -> ../review/<name>.mp4 (1080x1920, 30 fps, H.264, -14 LUFS)
# Narration + one music bed set 17 LU under the voice (measured, not guessed), faded over the last 2 s; frames deleted after.
set -e
cd "$(dirname "$0")"
KEY=$1; CUE=$2
CH=$(basename $(ls ../public/audio/${KEY}_*.words.json) .words.json)
WAV=../public/audio/$CH.wav; MUS=../../ep1/public/music/$CUE.mp3
N=$(python3 -c "import json,math;print(math.ceil(json.load(open('../public/audio/$CH.words.json'))['duration']*30))")
DUR=$(python3 -c "print($N/30)")
mkdir -p out/$KEY ../review
if [ ! -f out/$KEY/f$(printf %04d $((N - 1))).png ]; then
  P=4; STEP=$(( (N + P - 1) / P ))
  for i in $(seq 0 $((P - 1))); do node render_edit.mjs $KEY out/$KEY $((i * STEP)) $(( (i + 1) * STEP )) & done; wait
fi
lufs() { ffmpeg -nostats -i "$1" -t $DUR -af ebur128 -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}'; }
LV=$(lufs $WAV); LM=$(lufs $MUS)
GAIN=$(python3 -c "print(round($LV - 17 - $LM, 2))")
FO=$(python3 -c "print($DUR - 2.0)")
ffmpeg -v error -y -framerate 30 -i out/$KEY/f%04d.png -i $WAV -i $MUS -filter_complex \
  "[2]atrim=0:$DUR,asetpts=PTS-STARTPTS,volume=${GAIN}dB,afade=t=in:d=0.5,afade=t=out:st=$FO:d=2[m];[1][m]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -t $DUR -movflags +faststart ../review/$CH.mp4
rm -rf "out/${KEY:?}"
echo "voice $LV LUFS, music $LM LUFS, bed gain ${GAIN} dB -> ../review/$CH.mp4"
