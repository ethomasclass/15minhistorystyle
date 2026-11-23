#!/bin/bash
# full render of the cold open: every third frame first (a quick preview), then the rest; encode 1080p, 720p and a 480p preview
cd "$(dirname "$0")"
while pgrep -f "chain.sh" >/dev/null; do sleep 20; done
mkdir -p build/f
R() { FRAMES=$1 xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python coldopen.py -- "$(pwd)/build/f" 0 0 100 >> build/render.log 2>&1; }
enc() {  # $1 = output name; fills any missing frame with the last one rendered
python3 - <<'PY'
import os, shutil, json
d = 'build/f'; N = int(41.37 * 30)
last = None
for f in range(N):
    p = f'{d}/{f:04d}.png'
    if os.path.exists(p) and not os.path.islink(p) and os.path.getsize(p) > 0: last = p
    elif last: shutil.copy(last, p + '.tmp'); os.replace(p + '.tmp', p)
json.dump({'dur': N / 30, 'sounds': [['ambience-room-tone-30s', 0.0, 0.3, 0.8, 0.5, 30.0], ['forest_birds', 24.5, 0.3, 0.8, 0.8, 17.0]],
           'press': True, 'grain': 0.5}, open('build/events.json', 'w'))
PY
python3 ../../../Hawaii_Samples/tools/encode.py build "$1.mp4" && ffmpeg -y -loglevel error -i "$1.mp4" -vf scale=1280:720 -c:v libx264 -crf 22 -c:a aac "$1_720p.mp4"
}
R every:3:0
enc ../renders/coldopen_blender_preview && rm -f ../renders/coldopen_blender_preview.mp4
rm -rf build/f_fill && python3 - <<'PY'
import os
# remove the gap-filler copies so the second pass renders them for real (rendered frames are multiples of 3)
for f in os.listdir('build/f'):
    if f.endswith('.png') and int(f[:4]) % 3: os.remove('build/f/' + f)
PY
R every:1:0
enc ../renders/coldopen_blender && rm -f ../renders/coldopen_blender_preview_720p.mp4
ffmpeg -y -loglevel error -i ../renders/coldopen_blender_720p.mp4 -vf scale=854:480 -c:v libx264 -crf 26 -c:a aac ../renders/preview/coldopen_blender_480p.mp4
echo COLDOPEN_DONE >> build/render.log
