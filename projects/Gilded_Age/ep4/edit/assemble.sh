#!/bin/bash
# The episode so far, as Ep 3's assemble.sh: chapter 1 (cold open, ending on its baton card "Bursting at the Seams"), the Chunk
# intro + title card (Ep 2 and 3's exact intro: the logo assembles centred, then lifts to make way for the title), chapters 2 to 8
# each ending on its baton card, with the 2 s Chunk mark snap before chapters 3 to 8 (as Ep 1 and 2), and the 20 s end screen after chapter 8.
# Chapters not built yet are skipped. Two-pass loudness master to -14 LUFS.
#   -> review/ep4_full_720p.mp4 + review/ep4_preview.mp4 (540p)
#   PREVIEW=coldopen ./assemble.sh   only chapter 1 + the title card -> review/ep4_coldopen_preview.mp4 (720p, for review)
#   END_THEME_AT=<s>  where in ga_gilded_theme the end screen picks the theme up (where chapter 8 leaves it; default 0)
# RES=1080 ./assemble.sh: the full-size master from review/*_1080p.mp4 -> ../renders/ep4_full_1080p.mp4 (Git LFS), no preview
set -e
cd "${EDIT_DIR:-$(dirname "$0")}"
RES=${RES:-720}
case $RES in 720) VF=(-vf scale=1280:720); CRF=20 ;; 1080) VF=(); CRF=18 ;; *) echo "RES must be 720 or 1080" >&2; exit 1 ;; esac
card() { # card <key> <secs> <audio filter input...>
  local K=$1 D=$2; shift 2
  mkdir -p out/$K && node render_edit.mjs $K out/$K   # (wrap the whole assemble in the render lock when a card has to be rendered)
  ffmpeg -v error -y -framerate 30 -i out/$K/f%04d.png "$@" -map 0:v -map "[a]" "${VF[@]}" -c:v libx264 -pix_fmt yuv420p -crf $CRF -c:a aac -b:a 160k -ac 2 -t $D review/${K}_${RES}p.mp4
  rm -rf "out/${K:?}"
}
M1=../../ep1/public/music
ST="aformat=sample_rates=44100:channel_layouts=stereo"
[ -f review/title_${RES}p.mp4 ] || card title 4.2 -i $M1/chunk_jingle.mp3 -filter_complex "[1]atempo=1.4,atrim=0:3.1,asetpts=PTS-STARTPTS,afade=t=out:st=2.8:d=0.3,apad=whole_dur=4.2,$ST[a]"
if [ "$PREVIEW" = coldopen ]; then PARTS=(ch01 title); OUT=ep4_coldopen; else
  PARTS=(ch01 title)
  # the 2 s Chunk mark snap (as Ep 1 and 2) between chapters: after each baton card, before chapters 3 to 8
  [ -f review/brk_${RES}p.mp4 ] || card brk 2.0 -i ../public/sfx/chunk_snap.wav -filter_complex "[1]atrim=0:1.2,asetpts=PTS-STARTPTS,volume=0.3,afade=t=out:st=1.1:d=0.1,apad=whole_dur=2.0,$ST[a]"
  for c in ch02 ch03 ch04 ch05 ch06 ch07 ch08; do [ -f review/${c}_${RES}p.mp4 ] && { [ $c != ch02 ] && PARTS+=(brk); PARTS+=($c); }; done
  # the 20 s end screen after chapter 8: ga_gilded_theme (the series end theme, Ep 1) carries on from END_THEME_AT
  if [ -f review/ch08_${RES}p.mp4 ]; then
    [ -f review/endscreen_${RES}p.mp4 ] || card endscreen 20 -ss ${END_THEME_AT:-0} -i $M1/ga_gilded_theme.mp3 -filter_complex "[1]atrim=0:20,asetpts=PTS-STARTPTS,volume=0.105,afade=t=in:d=0.08,afade=t=out:st=18.5:d=1.5,apad=whole_dur=20,$ST[a]"
    PARTS+=(endscreen)
  fi
  OUT=ep4_full
fi
IN=(); FL=""; i=0
for p in "${PARTS[@]}"; do IN+=(-i review/${p}_${RES}p.mp4); FL+="[$i:v][$i:a]"; i=$((i + 1)); done
mkdir -p out
ffmpeg -v error -y "${IN[@]}" -filter_complex "${FL}concat=n=$i:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -crf $CRF -c:a pcm_s16le out/ep4_joined.mkv
J=$(ffmpeg -hide_banner -i out/ep4_joined.mkv -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
M=$(echo "$J" | python3 -c "import json,sys;j=json.load(sys.stdin);print(f\"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}\")")
ffmpeg -v error -y -i out/ep4_joined.mkv -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11:$M -c:a aac -b:a 192k -ar 48000 review/${OUT}_${RES}p.mp4
rm -f out/ep4_joined.mkv
if [ "$PREVIEW" = coldopen ]; then mv review/${OUT}_${RES}p.mp4 review/ep4_coldopen_preview.mp4; echo review/ep4_coldopen_preview.mp4; exit 0; fi
[ $RES = 720 ] && ffmpeg -v error -y -i review/${OUT}_${RES}p.mp4 -vf scale=960:540 -c:v libx264 -preset slow -crf 32 -c:a aac -b:a 96k review/ep4_preview.mp4   # under 30 MB for chat
if [ $RES = 1080 ]; then mkdir -p ../renders && mv review/ep4_full_1080p.mp4 ../renders/ && echo ../renders/ep4_full_1080p.mp4; else echo review/ep4_full_720p.mp4; fi
