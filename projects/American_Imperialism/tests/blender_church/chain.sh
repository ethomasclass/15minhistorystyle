#!/bin/bash
# wait for the transition render, join it to the palace scene, encode; then re-render the walk with the fitted clothes and encode
cd "$(dirname "$0")"
while pgrep -f "transition_test.py" >/dev/null; do sleep 20; done
python3 - <<'PY'
import os, shutil, json
d = 'build_tr/f'
n = len([f for f in os.listdir(d) if f.endswith('.png')])
src = '../living_scene/build/f'
for k in range(150):                                   # the palace scene plays on after the hand-off (5 s)
    shutil.copy(f'{src}/{k:04d}.png', f'{d}/{n + k:04d}.png')
json.dump({'dur': (n + 150) / 30, 'sounds': [['forest_birds', 0.0, 0.35, 0.8, 0.8, 5.0], ['ambience-room-tone-30s', 4.5, 0.35, 0.8, 0.8, 5.0],
           ['forest_birds', n / 30, 0.35, 0.3, 0.8, 5.0]], 'press': True, 'grain': 0.5}, open('build_tr/events.json', 'w'))
print('joined', n, '+150')
PY
python3 ../../../Hawaii_Samples/tools/encode.py build_tr transition_test.mp4 && ffmpeg -y -loglevel error -i transition_test.mp4 -vf scale=1280:720 -c:v libx264 -crf 22 -c:a aac transition_test_720p.mp4 && rm -f transition_test.mp4
rm -rf build_walk/f && mkdir -p build_walk/f
xvfb-run -a -s "-screen 0 1920x1080x24" blender -b --python people_samples.py -- "$(pwd)/build_walk/f" walk > build_walk/render.log 2>&1
python3 - <<'PY'
import os, shutil
d = 'build_walk/f'
have = sorted(int(f[:4]) for f in os.listdir(d) if f.endswith('.png'))
last = None
for f in range(120):
    p = f'{d}/{f:04d}.png'
    if f in have: last = p
    elif last: shutil.copy(last, p)
PY
python3 ../../../Hawaii_Samples/tools/encode.py build_walk people_walk_test.mp4 && ffmpeg -y -loglevel error -i people_walk_test.mp4 -vf scale=1280:720 -c:v libx264 -crf 22 -c:a aac people_walk_test_720p.mp4 && rm -f people_walk_test.mp4
echo CHAIN_DONE
