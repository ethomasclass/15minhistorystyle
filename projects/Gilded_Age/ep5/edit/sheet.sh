#!/bin/bash
# Contact sheet of a review render: a frame every N seconds (default 3), 6 across, each stamped with its time.
#   ./sheet.sh review/ch01_720p.mp4 [N] [out.jpg]      (default out: <scratch or /tmp>/<name>_sheet.jpg)
set -e
IN=$1; N=${2:-3}; OUT=${3:-${TMPDIR:-/tmp}/$(basename ${IN%.mp4})_sheet.jpg}
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN"); K=$(python3 -c "import math;print(math.ceil($D/$N))"); R=$(( (K + 5) / 6 ))
ffmpeg -v error -y -i "$IN" -vf "fps=1/$N,scale=400:-1,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='%{eif\:t\:d}s':x=6:y=6:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x$R" -frames:v 1 -q:v 4 "$OUT"
echo "$OUT"
