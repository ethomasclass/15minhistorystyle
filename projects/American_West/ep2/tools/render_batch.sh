#!/bin/sh
# Render chapters one at a time, skipping any already done (out/ch/chNN.done), so a render cut off by a time limit resumes:
#   sh tools/render_batch.sh 01 02 03
# Then join and master with:  JOIN_ONLY=1 sh tools/render.sh
# Remotion's bundle copies (~500 MB each) go to out/tmp (our own folder) and are cleared after each chapter.
cd "$(dirname "$0")/.."
export REMOTION_CHROME=${REMOTION_CHROME:-$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-*/headless_shell /opt/pw-browsers/chromium_headless_shell-*/chrome-*/chrome-headless-shell 2>/dev/null | head -1)}
mkdir -p out/ch out/tmp
export TMPDIR="$(pwd)/out/tmp"
for n in "$@"; do
  [ -f out/ch/ch$n.done ] && { echo "ch$n already done"; continue; }
  s=$(date +%s)
  npx remotion render src/index.ts Ch$n out/ch/ch$n.mp4 --crf=18 ${REMOTION_CHROME:+--browser-executable=$REMOTION_CHROME} --log=error \
    && touch out/ch/ch$n.done && echo "ch$n done in $(( $(date +%s) - s )) s" || { echo "ch$n FAILED"; exit 1; }
  find out/tmp -mindepth 1 -maxdepth 1 -exec rm -rf {} +
done
