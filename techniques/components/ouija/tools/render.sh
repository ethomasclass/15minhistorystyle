#!/bin/sh
# Render chapters, join them, master once:   tools/render.sh            (every chapter)
#                                             tools/render.sh 03 07      (re-render only these, then rejoin)
# Options via env: SCALE=0.5 for a fast half-size preview (writes out/<SLUG>_preview.mp4 instead of the master).
# Writes out/<SLUG>_1080p.mp4 (YouTube master, -14 LUFS). 3D shots need WebGL: --gl=${GL:-angle} works headless.
cd "$(dirname "$0")/.."
export REMOTION_CHROME=${REMOTION_CHROME:-$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1)}
BROWSER=${REMOTION_CHROME:+--browser-executable=$REMOTION_CHROME}
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())" 2>/dev/null || echo ffmpeg)
SLUG=$(sed -n "s/^export const SLUG = '\(.*\)';/\1/p" src/project.ts)
SCALE=${SCALE:-1}
TAG=$([ "$SCALE" = 1 ] && echo full || echo preview)
ALL=$(grep -o "id: 'Ch[0-9]*'" src/chapters.ts | grep -o '[0-9][0-9]*')
mkdir -p out/ch_$TAG
npx remotion bundle src/index.ts --out-dir=out/bundle --log=error || exit 1
for n in ${*:-$ALL}; do
  npx remotion render out/bundle Ch$n out/ch_$TAG/ch$n.mp4 --crf=18 --scale=$SCALE --concurrency=${CONC:-4} --gl=${GL:-angle} $BROWSER --log=error || exit 1
  echo "rendered ch$n"
done
LIST=out/ch_$TAG/list.txt; : > $LIST
for n in $ALL; do echo "file '$(pwd)/out/ch_$TAG/ch$n.mp4'" >> $LIST; done
$FF -v error -y -f concat -safe 0 -i $LIST -c:v copy -c:a pcm_s16le out/${SLUG}_${TAG}_raw.mkv || exit 1
if [ "$TAG" = full ]; then
  python3 tools/master.py out/${SLUG}_full_raw.mkv out/${SLUG}_1080p.mp4 || exit 1
else
  $FF -v error -y -i out/${SLUG}_preview_raw.mkv -c:v libx264 -crf 26 -preset veryfast -c:a aac -b:a 128k -af loudnorm=I=-14:TP=-1.5 -movflags +faststart out/${SLUG}_preview.mp4 || exit 1
fi
python3 - "$LIST" "$FF" <<'PY'
import re, subprocess, sys
t = 0.0
for line in open(sys.argv[1]):
    f = line.split("'")[1]
    d = re.search(r"Duration: (\d+):(\d+):([\d.]+)", subprocess.run([sys.argv[2], "-i", f], capture_output=True, text=True).stderr)
    print(f"{int(t // 60)}:{int(t % 60):02d}  {f.rsplit('/', 1)[-1]}")
    t += int(d[1]) * 3600 + int(d[2]) * 60 + float(d[3])
print(f"total {int(t // 60)}:{int(t % 60):02d}")
PY
