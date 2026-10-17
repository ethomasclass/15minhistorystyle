#!/bin/bash
# The Balloon War: every 3D photo, with its crop (source px). Layers are generated, not committed:
#   bash tools/layers3d_jobs.sh            (about 15 s a photo)
set -e
cd "$(dirname "$0")/.."
j() { python3 tools/photo3d.py "public/img/$1" --crop "$2" --layers "${4:-12}" --name "$3"; }
j ch01_look_up/balloon_from_u2_cockpit_2023.jpg          0,0,3840,2160      ch01_u2
j ch02_protector/320th_walk_balloon_to_winch_1944.jpg      24,450,3190,1795   ch02_320th
j ch02_protector/coast_guard_lcis_cross_channel_1944.jpg   340,1060,4935,2776 ch02_channel
j ch02_protector/camp_tyson_trainees_under_balloons_owi.jpg 120,520,3720,2093 ch02_tyson
j ch03_fake/rubber_tank_beside_real_tank_anzio_1944.jpg    0,400,3720,2092    ch03_two_tanks
j ch03_fake/soldiers_place_rubber_tank_anzio_1944.jpg      0,330,2772,1559    ch03_place_tank
j ch04_paper_balloon/moffett_balloon_inflated_hangar_1945.jpg 0,250,3234,1819 ch04_moffett
j ch06_bly/forest_fog_fremont_winema_usfs.jpg              0,200,3840,2160    ch06_forest
j ch07_answer/origami_cranes_nagasaki_cc0.jpg              0,200,3840,2160    ch07_cranes
python3 tools/gen_registry.py
