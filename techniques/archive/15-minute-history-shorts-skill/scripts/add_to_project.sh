#!/bin/sh
# Add the shorts kit to a 15 Minute History video project.
#   sh <skill>/scripts/add_to_project.sh <video-dir> "<Full Video Title>" [--example]
# Copies src/shorts/Short.tsx (and ShortExample.tsx with --example, template projects only), writes the outro line
# to script/shorts/outro_subscribe.txt with the video's title filled in, and makes public/img/shorts/ for the
# long video's thumbnail. It does not voice the outro or touch src/Root.tsx; SKILL.md says how.
set -e
SKILL=$(cd "$(dirname "$0")/.." && pwd)
DEST=${1:?usage: add_to_project.sh <video-dir> "<Full Video Title>" [--example]}
TITLE=${2:?give the title of the full video, e.g. Fix Everything}
mkdir -p "$DEST/src/shorts" "$DEST/script/shorts" "$DEST/public/img/shorts"
if [ -e "$DEST/src/shorts/Short.tsx" ]; then echo "src/shorts/Short.tsx already exists; leaving it"; else cp "$SKILL/assets/shorts/Short.tsx" "$DEST/src/shorts/"; fi
[ "$3" = "--example" ] && cp "$SKILL/assets/shorts/ShortExample.tsx" "$DEST/src/shorts/"
sed "s/TITLE/$TITLE/" "$SKILL/assets/outro_subscribe.txt" > "$DEST/script/shorts/outro_subscribe.txt"
echo "added. Outro line: $(cat "$DEST/script/shorts/outro_subscribe.txt")"
if [ ! -d "$DEST/src/kit" ]; then
  echo "note: no src/kit/ here, so this is an older project; fix the five imports marked PATHS and MAP_SRC at the top of src/shorts/Short.tsx (SKILL.md lists each project's paths)"
fi
