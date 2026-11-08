#!/bin/bash
# The full episode: chapter 1 (cold open), the Chunk intro + title card, chapter 2, then a 2 s mark snap before each of chapters 3-8,
# and the 20 s end screen. Two-pass loudness master to -14 LUFS. -> review/ep2_full_720p.mp4 (git-ignored) + review/ep2_preview.mp4 (540p)
# The end screen carries on ga_gilded_theme from where chapter 8 leaves it (99.8 s in), so its final chord lands on the end screen.
set -e
cd "$(dirname "$0")"
card() { # card <key> <secs> <audio filter input...>
  local K=$1 D=$2; shift 2
  mkdir -p out/$K && node render_edit.mjs $K out/$K
  ffmpeg -v error -y -framerate 30 -i out/$K/f%04d.png "$@" -map 0:v -map "[a]" -vf scale=1280:720 -c:v libx264 -pix_fmt yuv420p -crf 20 -c:a aac -b:a 160k -t $D review/${K}_720p.mp4
  rm -rf "out/${K:?}"
}
M1=../../ep1/public/music
MONO="aformat=sample_rates=44100:channel_layouts=mono"
[ -f review/title_720p.mp4 ] || card title 4.2 -i $M1/chunk_jingle.mp3 -filter_complex "[1]atempo=1.4,atrim=0:3.1,asetpts=PTS-STARTPTS,afade=t=out:st=2.8:d=0.3,apad=whole_dur=4.2,$MONO[a]"
[ -f review/brk_720p.mp4 ] || card brk 2.0 -i $M1/chunk_snap.wav -filter_complex "[1]atrim=0:1.2,asetpts=PTS-STARTPTS,volume=0.3,afade=t=out:st=1.1:d=0.1,apad=whole_dur=2.0,$MONO[a]"
[ -f review/endscreen_720p.mp4 ] || card endscreen 20 -ss 99.8 -i $M1/ga_gilded_theme.mp3 -filter_complex "[1]atrim=0:20,asetpts=PTS-STARTPTS,volume=0.105,afade=t=in:d=0.08,afade=t=out:st=18.5:d=1.5,apad=whole_dur=20,$MONO[a]"
PARTS=(ch01 title ch02 brk ch03 brk ch04 brk ch05 brk ch06 brk ch07 brk ch08 endscreen)
IN=(); FL=""; i=0
for p in "${PARTS[@]}"; do IN+=(-i review/${p}_720p.mp4); FL+="[$i:v][$i:a]"; i=$((i + 1)); done
ffmpeg -v error -y "${IN[@]}" -filter_complex "${FL}concat=n=$i:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -crf 20 -c:a pcm_s16le out/ep2_joined.mkv
J=$(ffmpeg -hide_banner -i out/ep2_joined.mkv -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
M=$(echo "$J" | python3 -c "import json,sys;j=json.load(sys.stdin);print(f\"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}\")")
ffmpeg -v error -y -i out/ep2_joined.mkv -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11:$M -c:a aac -b:a 192k -ar 48000 review/ep2_full_720p.mp4
rm -f out/ep2_joined.mkv
# loudnorm stops short of -14 here (it holds the -1.5 dBTP ceiling): a gentle lift into a limiter lands -13.9 LUFS, peak -0.9 dBFS
ffmpeg -v error -y -i review/ep2_full_720p.mp4 -c:v copy -af "volume=2.4dB,alimiter=limit=0.79:level=false:attack=2:release=40" -c:a aac -b:a 192k -ar 48000 out/ep2_lift.mp4 && mv out/ep2_lift.mp4 review/ep2_full_720p.mp4
ffmpeg -v error -y -i review/ep2_full_720p.mp4 -vf scale=960:540 -c:v libx264 -preset slow -crf 29 -c:a aac -b:a 128k review/ep2_preview.mp4
echo review/ep2_full_720p.mp4
