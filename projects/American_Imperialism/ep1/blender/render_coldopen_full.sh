#!/bin/bash
# second pass of the cold open: render every frame not yet on disk, then encode 1080p, 720p and a 480p preview
cd "$(dirname "$0")"
sed -n '/^R()/p;/^enc()/,/^}/p' render_coldopen.sh > build/fns.sh && . build/fns.sh
R every:1:0
enc ../renders/coldopen_blender
ffmpeg -y -loglevel error -i ../renders/coldopen_blender_720p.mp4 -vf scale=854:480 -c:v libx264 -crf 26 -c:a aac ../renders/preview/coldopen_blender_480p.mp4
echo COLDOPEN_DONE >> build/render.log
