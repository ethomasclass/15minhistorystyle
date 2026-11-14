#!/bin/bash
# The episode so far, as Ep 2's assemble.sh: chapter 1 (cold open), the Chunk intro + title card (it lands on chapter 1's last word,
# "behind"), chapters 2 to 9 back to back (each ends on its baton card; no mark snap), and the 20 s end screen. Chapters
# not built yet are skipped. Two-pass loudness master to -14 LUFS, as Ep 2.
#   -> review/ep3_full_720p.mp4 (git-ignored if large) + review/ep3_preview.mp4 (540p)
#   PREVIEW=coldopen ./assemble.sh   only chapter 1 + the title card -> review/ep3_coldopen_preview.mp4 (720p, for review)
# RES=1080 ./assemble.sh: the full-size master from review/*_1080p.mp4 -> ../renders/ep3_full_1080p.mp4 (Git LFS), no preview
set -e
cd "$(dirname "$0")"
RES=${RES:-720}
case $RES in 720) VF=(-vf scale=1280:720); CRF=20 ;; 1080) VF=(); CRF=18 ;; *) echo "RES must be 720 or 1080" >&2; exit 1 ;; esac
card() { # card <key> <secs> <audio filter input...>
  local K=$1 D=$2; shift 2
  mkdir -p out/$K && node render_edit.mjs $K out/$K
  ffmpeg -v error -y -framerate 30 -i out/$K/f%04d.png "$@" -map 0:v -map "[a]" "${VF[@]}" -c:v libx264 -pix_fmt yuv420p -crf $CRF -c:a aac -b:a 160k -ac 2 -t $D review/${K}_${RES}p.mp4
  rm -rf "out/${K:?}"
}
M1=../../ep1/public/music
ST="aformat=sample_rates=44100:channel_layouts=stereo"
[ -f review/title_${RES}p.mp4 ] || card title 4.2 -i $M1/chunk_jingle.mp3 -filter_complex "[1]atempo=1.4,atrim=0:3.1,asetpts=PTS-STARTPTS,afade=t=out:st=2.8:d=0.3,apad=whole_dur=4.2,$ST[a]"
if [ "$PREVIEW" = coldopen ]; then PARTS=(ch01 title); OUT=ep3_coldopen; else
  PARTS=(ch01 title); [ -f review/ch02_${RES}p.mp4 ] && PARTS+=(ch02)
  for c in ch03 ch04 ch05 ch06 ch07 ch08 ch09; do [ -f review/${c}_${RES}p.mp4 ] && PARTS+=($c); done   # no mark snap: the baton card (with its chunk_snap) ends each chapter
  # the 20 s end screen after chapter 9 (as Ep 2): ga_gilded_theme carries on from where chapter 9 leaves it (99.8 s into the cue)
  if [ -f review/ch09_${RES}p.mp4 ]; then
    [ -f review/endscreen_${RES}p.mp4 ] || card endscreen 20 -ss 99.8 -i $M1/ga_gilded_theme.mp3 -filter_complex "[1]atrim=0:20,asetpts=PTS-STARTPTS,volume=0.105,afade=t=in:d=0.08,afade=t=out:st=18.5:d=1.5,apad=whole_dur=20,$ST[a]"
    PARTS+=(endscreen)
  fi
  OUT=ep3_full
fi
IN=(); FL=""; i=0
for p in "${PARTS[@]}"; do IN+=(-i review/${p}_${RES}p.mp4); FL+="[$i:v][$i:a]"; i=$((i + 1)); done
mkdir -p out
ffmpeg -v error -y "${IN[@]}" -filter_complex "${FL}concat=n=$i:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -crf $CRF -c:a pcm_s16le out/ep3_joined.mkv
J=$(ffmpeg -hide_banner -i out/ep3_joined.mkv -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
M=$(echo "$J" | python3 -c "import json,sys;j=json.load(sys.stdin);print(f\"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}\")")
ffmpeg -v error -y -i out/ep3_joined.mkv -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11:$M -c:a aac -b:a 192k -ar 48000 review/${OUT}_${RES}p.mp4
rm -f out/ep3_joined.mkv
if [ "$PREVIEW" = coldopen ]; then mv review/${OUT}_${RES}p.mp4 review/ep3_coldopen_preview.mp4; echo review/ep3_coldopen_preview.mp4; exit 0; fi
[ $RES = 720 ] && ffmpeg -v error -y -i review/${OUT}_${RES}p.mp4 -vf scale=960:540 -c:v libx264 -preset slow -crf 32 -c:a aac -b:a 96k review/ep3_preview.mp4   # under 30 MB for chat
if [ $RES = 1080 ]; then mkdir -p ../renders && mv review/ep3_full_1080p.mp4 ../renders/ && echo ../renders/ep3_full_1080p.mp4; else echo review/ep3_full_720p.mp4; fi
