#!/bin/bash
# Render a short and mix it: ./build_short.sh s1 ga_bad_wire     -> ../review/<name>.mp4 (1080x1920, 30 fps, H.264, -14 LUFS)
# Narration + one music bed set 17 LU under the voice (measured, not guessed), faded over the last 2 s; frames deleted after.
#   MUSDIR=../../ep2/public/music ./build_short.sh s3 ga_the_ball ga_below_stairs 55.6
#     a second cue crossfades in at 55.6 s (1 s), set BED2_LU (default 20) under the voice: the quiet kitchen bed in s3.
# Env: FRAMEJPG=1 renders JPEG frames (quality 94; tight disks); LOCK=<file> holds an flock around the frame render (one render
# at a time on a shared machine); CHUNKS=n renders and encodes n pieces in turn, deleting each piece's frames as soon as it is
# encoded (parallel P=4 inside a piece), so the disk never holds more than one piece.
set -e
cd "$(dirname "$0")"
KEY=$1; CUE=$2; CUE2=$3; AT2=$4
MUSDIR=${MUSDIR:-../../ep1/public/music}
CH=$(basename $(ls ../public/audio/${KEY}_*.words.json) .words.json)
WAV=../public/audio/$CH.wav; MUS=$MUSDIR/$CUE.mp3
N=$(python3 -c "import json,math;print(math.ceil(json.load(open('../public/audio/$CH.words.json'))['duration']*30))")
DUR=$(python3 -c "print($N/30)")
EXT=png; [ -n "$FRAMEJPG" ] && EXT=jpg
CHUNKS=${CHUNKS:-1}
mkdir -p out/$KEY ../review
render() { # render() <from> <to>: P parallel processes, under the lock when one is given
  local A=$1 B=$2 P=4 STEP; STEP=$(( (B - A + P - 1) / P ))
  local CMD="for i in \$(seq 0 $((P - 1))); do node render_edit.mjs $KEY out/$KEY \$(( $A + i * $STEP )) \$(( $A + (i + 1) * $STEP < $B ? $A + (i + 1) * $STEP : $B )) & done; wait"
  if [ -n "$LOCK" ]; then flock "$LOCK" bash -c "$CMD"; else bash -c "$CMD"; fi
}
if [ "$CHUNKS" -gt 1 ]; then
  CS=$(( (N + CHUNKS - 1) / CHUNKS )); : > out/${KEY}_parts.txt
  for k in $(seq 0 $((CHUNKS - 1))); do A=$((k * CS)); B=$(( (k + 1) * CS < N ? (k + 1) * CS : N ))
    PART=out/${KEY}_part$k.mp4
    if [ ! -f $PART ]; then
      render $A $B
      ffmpeg -v error -y -framerate 30 -start_number $A -i out/$KEY/f%04d.$EXT -frames:v $((B - A)) -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -r 30 $PART
      rm -f out/$KEY/f*.$EXT
    fi
    echo "file '$(basename $PART)'" >> out/${KEY}_parts.txt
  done
  VIN=(-f concat -safe 0 -i out/${KEY}_parts.txt); VCODEC=(-c:v copy)
else
  [ -f out/$KEY/f$(printf %04d $((N - 1))).$EXT ] || render 0 $N
  VIN=(-framerate 30 -i out/$KEY/f%04d.$EXT); VCODEC=(-c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -r 30)
fi
lufs() { ffmpeg -nostats -i "$1" -af ebur128 -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}'; }
LV=$(lufs $WAV); LM=$(lufs $MUS)
GAIN=$(python3 -c "print(round($LV - 17 - $LM, 2))")
FO=$(python3 -c "print($DUR - 2.0)")
if [ -n "$CUE2" ]; then
  MUS2=$MUSDIR/$CUE2.mp3; LM2=$(lufs $MUS2); GAIN2=$(python3 -c "print(round($LV - ${BED2_LU:-20} - $LM2, 2))")
  E1=$(python3 -c "print($AT2 + 1.0)"); L2=$(python3 -c "print($DUR - $AT2)"); FO2=$(python3 -c "print($DUR - 2.0 - $AT2)")
  MIX="[2]atrim=0:$E1,asetpts=PTS-STARTPTS,volume=${GAIN}dB,afade=t=in:d=0.5,afade=t=out:st=$AT2:d=1.0[m1];[3]atrim=0:$L2,asetpts=PTS-STARTPTS,volume=${GAIN2}dB,afade=t=in:d=1.0,afade=t=out:st=$FO2:d=2,adelay=$(python3 -c "print(int($AT2*1000))"):all=1[m2];[m1][m2]amix=inputs=2:normalize=0:duration=longest[m]"
  MIN=(-i $MUS -i $MUS2)
else
  MIX="[2]atrim=0:$DUR,asetpts=PTS-STARTPTS,volume=${GAIN}dB,afade=t=in:d=0.5,afade=t=out:st=$FO:d=2[m]"; MIN=(-i $MUS)
fi
ffmpeg -v error -y "${VIN[@]}" -i $WAV "${MIN[@]}" -filter_complex \
  "$MIX;[1][m]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]" \
  -map 0:v -map "[a]" "${VCODEC[@]}" -c:a aac -b:a 192k -t $DUR -movflags +faststart ../review/$CH.mp4
rm -rf "out/${KEY:?}" out/${KEY}_part*.mp4 out/${KEY}_parts.txt
# one-pass loudnorm lands a little low on speech: measure the master and trim the audio to -14 LUFS (video copied)
for pass in 1 2; do I=$(lufs ../review/$CH.mp4); D=$(python3 -c "print(round(-14 - $I, 2))")
ffmpeg -v error -y -i ../review/$CH.mp4 -c:v copy -af "volume=${D}dB,alimiter=limit=0.84:level=false" -c:a aac -b:a 192k -movflags +faststart ../review/$CH.tmp.mp4
mv ../review/$CH.tmp.mp4 ../review/$CH.mp4; done; echo "master $(lufs ../review/$CH.mp4) LUFS"
echo "voice $LV LUFS, music $LM LUFS, bed gain ${GAIN} dB${CUE2:+, bed 2 ${GAIN2} dB from ${AT2} s} -> ../review/$CH.mp4"
