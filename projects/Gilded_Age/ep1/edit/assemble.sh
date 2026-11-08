#!/bin/bash
# The full episode: chapter 1 (cold open), the Chunk History intro + title card, chapters 2 to 9; mastered to -14 LUFS.
#   ./assemble.sh   -> review/ep1_full_720p.mp4  (renders the title card if review/title_720p.mp4 is missing)
set -e
cd "$(dirname "$0")"
if [ ! -f review/title_720p.mp4 ]; then   # the Chunk History intro + the title, with the brand's clicks at 1.4x, cut before the page turn
  mkdir -p out/title && node render_edit.mjs title out/title
  ffmpeg -v error -y -framerate 30 -i out/title/f%04d.png -i ../public/music/chunk_jingle.mp3 \
    -filter_complex "[1]atempo=1.4,atrim=0:3.1,asetpts=PTS-STARTPTS,afade=t=out:st=2.8:d=0.3,apad=whole_dur=4.2,aformat=sample_rates=44100:channel_layouts=mono[a]" \
    -map 0:v -map "[a]" -vf scale=1280:720 -c:v libx264 -pix_fmt yuv420p -crf 20 -c:a aac -b:a 160k -t 4.2 review/title_720p.mp4
  rm -rf out/title
fi
PARTS=(ch01 title ch02 ch03 ch04 ch05 ch06 ch07 ch08 ch09)
IN=(); FL=""; i=0
for p in "${PARTS[@]}"; do IN+=(-i review/${p}_720p.mp4); FL+="[$i:v][$i:a]"; i=$((i + 1)); done
FL+="concat=n=$i:v=1:a=1[v][a0];[a0]loudnorm=I=-14:TP=-1.5:LRA=11[a]"
ffmpeg -v error -y "${IN[@]}" -filter_complex "$FL" -map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -crf 20 -c:a aac -b:a 192k -ar 48000 review/ep1_full_720p.mp4
echo review/ep1_full_720p.mp4
