#!/bin/bash
# Join the chapter renders in out/draft/ and master them once, as the final step of any full-video assembly.
#   tools/assemble.sh              -> ../review/draft_vN_720p.mp4 + ../review/draft_vN_480p.mp4 (N = one past the newest draft in ../review/)
#   VERSION=7 tools/assemble.sh    -> ../review/draft_v7_720p.mp4 + ../review/draft_v7_480p.mp4
# Mastering is tools/master.py: two-pass EBU R128 loudnorm, linear (measured first, then one fixed gain: it cannot pump the way
# the single-pass dynamic loudnorm on the v4 draft could), -14 LUFS, peaks under -1.5 dBTP, then a gentle limiter.
# The chapters are rendered elsewhere (tools/render_ch.sh / render_queue.sh into out/draft/chNN.mp4); this script renders nothing.
set -euo pipefail
cd "$(dirname "$0")/.."
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())" 2>/dev/null || echo ffmpeg)
REVIEW=../review
DRAFT=out/draft
ALL=$(grep -o "id: 'Ch[0-9]*'" src/chapters.ts | grep -o '[0-9][0-9]*')

# every chapter must be there: a missing one would silently shorten the video
LIST=$DRAFT/assemble_list.txt; : > "$LIST"
for n in $ALL; do
  f=$DRAFT/ch$n.mp4
  [ -f "$f" ] || { echo "missing $f (render it first)" >&2; exit 1; }
  echo "file '$(pwd)/$f'" >> "$LIST"
done

if [ -z "${VERSION:-}" ]; then
  last=$(ls "$REVIEW" | sed -n 's/^draft_v\([0-9]*\)_720p\.mp4$/\1/p' | sort -n | tail -1)
  VERSION=$(( ${last:-0} + 1 ))
fi
OUT720=$REVIEW/draft_v${VERSION}_720p.mp4
OUT480=$REVIEW/draft_v${VERSION}_480p.mp4

# 1. join: video stream copied, audio kept as PCM so the master is the only lossy audio step
"$FF" -v error -y -f concat -safe 0 -i "$LIST" -c:v copy -c:a pcm_s16le $DRAFT/full_raw.mkv
# 2. master (two-pass, linear) at full size
python3 tools/master.py $DRAFT/full_raw.mkv $DRAFT/full_master.mp4
# 3. review copies: the mastered audio is copied, never re-normalised
"$FF" -v error -y -i $DRAFT/full_master.mp4 -vf scale=-2:720 -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -c:a copy -movflags +faststart "$OUT720"
"$FF" -v error -y -i $DRAFT/full_master.mp4 -vf scale=-2:480 -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$OUT480"
rm -f $DRAFT/full_raw.mkv "$LIST"
echo "$OUT720"
echo "$OUT480"
