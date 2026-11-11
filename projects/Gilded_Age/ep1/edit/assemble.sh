#!/bin/bash
# The full episode: chapter 1 (cold open), the Chunk intro + title card, chapter 2, then a 2 s mark snap before each of chapters 3-9,
# and the 20 s end screen. Two-pass loudness master to -14 LUFS. -> review/ep1_full_720p.mp4 (git-ignored) + review/ep1_preview.mp4 (540p)
# RES=1080 ./assemble.sh: the full-size master from review/*_1080p.mp4 (no scale, CRF 18) -> ../renders/ep1_full_1080p.mp4 (Git LFS), no preview; default RES=720
set -e
cd "$(dirname "$0")"
RES=${RES:-720}
case $RES in 720) VF=(-vf scale=1280:720); CRF=20 ;; 1080) VF=(); CRF=18 ;; *) echo "RES must be 720 or 1080" >&2; exit 1 ;; esac
card() { # card <key> <secs> <audio filter input...>
  local K=$1 D=$2; shift 2
  mkdir -p out/$K && node render_edit.mjs $K out/$K
  ffmpeg -v error -y -framerate 30 -i out/$K/f%04d.png "$@" -map 0:v -map "[a]" "${VF[@]}" -c:v libx264 -pix_fmt yuv420p -crf $CRF -c:a aac -b:a 160k -t $D review/${K}_${RES}p.mp4
  rm -rf "out/${K:?}"
}
MONO="aformat=sample_rates=44100:channel_layouts=mono"
[ -f review/title_${RES}p.mp4 ] || card title 4.2 -i ../public/music/chunk_jingle.mp3 -filter_complex "[1]atempo=1.4,atrim=0:3.1,asetpts=PTS-STARTPTS,afade=t=out:st=2.8:d=0.3,apad=whole_dur=4.2,$MONO[a]"
[ -f review/brk_${RES}p.mp4 ] || card brk 2.0 -i ../public/music/chunk_snap.wav -filter_complex "[1]atrim=0:1.2,asetpts=PTS-STARTPTS,volume=0.3,afade=t=out:st=1.1:d=0.1,apad=whole_dur=2.0,$MONO[a]"
[ -f review/endscreen_${RES}p.mp4 ] || card endscreen 20 -i ../public/music/ga_gilded_theme.mp3 -filter_complex "[1]atrim=0:20,asetpts=PTS-STARTPTS,volume=0.105,afade=t=in:d=1.0,afade=t=out:st=17.5:d=2.5,$MONO[a]"
PARTS=(ch01 title ch02 brk ch03 brk ch04 brk ch05 brk ch06 brk ch07 brk ch08 brk ch09 endscreen)
IN=(); FL=""; i=0
for p in "${PARTS[@]}"; do IN+=(-i review/${p}_${RES}p.mp4); FL+="[$i:v][$i:a]"; i=$((i + 1)); done
ffmpeg -v error -y "${IN[@]}" -filter_complex "${FL}concat=n=$i:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -crf $CRF -c:a pcm_s16le out/ep1_joined.mkv
J=$(ffmpeg -hide_banner -i out/ep1_joined.mkv -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
M=$(echo "$J" | python3 -c "import json,sys;j=json.load(sys.stdin);print(f\"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}\")")
ffmpeg -v error -y -i out/ep1_joined.mkv -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11:$M -c:a aac -b:a 192k -ar 48000 review/ep1_full_${RES}p.mp4
rm -f out/ep1_joined.mkv
[ $RES = 720 ] && ffmpeg -v error -y -i review/ep1_full_${RES}p.mp4 -vf scale=960:540 -c:v libx264 -preset slow -crf 29 -c:a aac -b:a 128k review/ep1_preview.mp4
if [ $RES = 1080 ]; then mkdir -p ../renders && mv review/ep1_full_1080p.mp4 ../renders/ && echo ../renders/ep1_full_1080p.mp4; else echo review/ep1_full_720p.mp4; fi
