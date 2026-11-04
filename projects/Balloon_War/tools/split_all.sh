#!/bin/sh
# Rebuild the parallax planes for every v2 silhouette scene (Nov 2026).
#
# NOTE (Nov 4 2026): depth estimation is unreliable on flat silhouette art (it cut figures, window bars, walls, lamp cones and
# paper ribbons in two and left ghost outlines and smears on the planes behind), so 15 of the 16 scenes are now split by COLOUR
# and REGION, not depth:
#   tools/sil_regions.py   a reusable colour/region splitter; one recipe per scene (r_BWnn, documented in each docstring):
#                          ink connected to the ground, tone tiers (darker = nearer, each shape's rim kept with it), teal-ness,
#                          coral, cream paper/smoke, a few snapped polygons (tables, the house, the corridor's far end). Every
#                          object whole on ONE plane; unused bands are written empty; the paper-cut drop shadows travel with
#                          their shapes; the back plate is filled from its own pixels (smooth, row by row, or mixed).
#   tools/bw12_layers.py   BW12 (Price at his desk), the first colour split, kept as is.
#   tools/sil_layers.py    the depth split, now only for BW03 (approved as is).
# The file layout is unchanged: L0-L2.webp, L3.jpg, 4 bands, layers.json (its "method"/"note" say how each was made).
cd "$(dirname "$0")/.."
S=public/img/gen/scenes/2x

# BW03: depth split, approved as is
SOLID=1 SOLID_DARK=0.13 NOMATTE=1 python3 tools/sil_layers.py $S/BW03_woods_open.jpg

# BW12: colour split (its own script)
python3 tools/bw12_layers.py

# everything else: colour/region recipes (BW01 replaces tools/bw01_balloon_fix.py: the balloon is built in, on the boys' plane L1)
#   BW01 boys+cylinders+ground+balloon L1 | sand/sea/hills/sky L3 (rows)       BW09 Rei+table+coral sheet L0 | theatre+lamp+cone L3
#   BW02 boys+cylinders+ground L0 | sand/sea/hills/sky L3 (rows)               BW10 all ink L0 | mesas L2 | sky L3
#   BW04 near trees+car+road L0 | 2nd row L1 | forest band L2 | hills/sky L3   BW11 ink L0 | smoke columns+plane L2 | sky/hills L3
#   BW05 near ink+crane strings L0 | forest/hills/sky L3                       BW13 presses+men+paper L0 | lamps+cones+hall L3
#   BW06 houses L0 | dark town+pagoda+bombers L1 | lighter town L2 | sky L3    BW14 the whole corridor L1 (door card plane) | far view L3
#   BW07 man+roof+ground L0 | fields+village L2 | mist/mountains/sky L3        BW15 ground+boy+corn L0 | house+beans+village+smoke L1 | sky L3
#   BW08 front row+tables L0 | second row L1 | lamps+cones+fog+3rd row L3      BW16 the whole shop+woman+ground L0 | street L3
python3 tools/sil_regions.py BW01 BW02 BW04 BW05 BW06 BW07 BW08 BW09 BW10 BW11 BW13 BW14 BW15 BW16

# The depth-split settings these scenes used before (kept for reference; tools/sil_layers.py still takes them):
#   SOLID=1 SOLID0=1 SOLID_DARK=0.07 EDGE=26 [FILL=rows]  BW01, BW02 (+ tools/bw01_balloon_fix.py)
#   SOLID=1 SOLID_DARK=0.22 EDGE=20                        BW08
#   SOLID=1 SOLID_DARK=0.07 EDGE=20                        the rest
