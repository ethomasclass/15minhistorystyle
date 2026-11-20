#!/usr/bin/env bash
# Master a rendered Short and embed its cover as the mp4's attached picture (the thumbnail players and uploaders show).
#
#   tools/shorts_master.sh <N> [render.mp4]
#   tools/shorts_master.sh 3                      # out/shorts/vshort3.mp4 -> ../renders/shorts/From_Eels_To_This_Short3.mp4
#
# Run from video/. Needs the render (npx remotion render src/index.ts VShortN out/shorts/vshortN.mp4 --crf=18) and the cover
# (npx remotion still src/index.ts VShortNCover ../renders/shorts/From_Eels_To_This_ShortN_cover.png, then the .jpg beside it).
# The cover IS frame 0 of the Short (VShortNCover renders VShortN at frame 0), so YouTube's frame picker and the attached
# picture match. Steps: tools/master.py (-14 LUFS, -1.5 dBTP, H.264 yuv420p, faststart), then a stream-copy mux that adds the
# cover JPEG as a second video stream flagged attached_pic.
set -euo pipefail
cd "$(dirname "$0")/.."

N="${1:?usage: tools/shorts_master.sh <N> [render.mp4]}"
SRC="${2:-out/shorts/vshort${N}.mp4}"
SLUG="From_Eels_To_This_Short${N}"
DIR="../renders/shorts"
COVER="${DIR}/${SLUG}_cover.jpg"
TMP="out/shorts/${SLUG}_master_nocover.mp4"
DST="${DIR}/${SLUG}.mp4"

[ -f "$SRC" ] || { echo "no render: $SRC" >&2; exit 1; }
[ -f "$COVER" ] || { echo "no cover: $COVER" >&2; exit 1; }
mkdir -p "$DIR" out/shorts

python3 tools/master.py "$SRC" "$TMP"
ffmpeg -hide_banner -loglevel error -y -i "$TMP" -i "$COVER" -map 0 -map 1 -c copy -disposition:v:1 attached_pic "$DST"
rm -f "$TMP"

# check: one H.264 stream, one AAC stream, one attached_pic
ffprobe -v error -show_entries stream=index,codec_name,width,height:stream_disposition=attached_pic -of compact "$DST"
echo "wrote $DST"
