#!/bin/sh
# Render chapters as they're finished (the final master then only joins them):   tools/render_ch.sh 01 [02 …]
# Writes out/ch/chNN.mp4 (1080p, crf 18, what tools/render.sh joins with JOIN_ONLY=1) and a small chat preview
# review/previews/chNN_720p.mp4 (< 30 MB). CONC sets render concurrency (default 2, so other work keeps running).
# No /tmp cleanup here: other renders may be using their bundles at the same time.
cd "$(dirname "$0")/.."
export REMOTION_CHROME=${REMOTION_CHROME:-$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1)}
BROWSER=${REMOTION_CHROME:+--browser-executable=$REMOTION_CHROME}
mkdir -p out/ch review/previews
for n in "$@"; do
  npx remotion render src/index.ts Ch$n out/ch/ch$n.mp4 --crf=18 --concurrency=${CONC:-2} $BROWSER --log=error || exit 1
  ffmpeg -v error -y -i out/ch/ch$n.mp4 -vf scale=1280:720 -c:v libx264 -crf 27 -preset medium -c:a aac -b:a 128k -movflags +faststart review/previews/ch${n}_720p.mp4 || exit 1
  echo "rendered ch$n: $(du -h review/previews/ch${n}_720p.mp4 | cut -f1) preview"
done
