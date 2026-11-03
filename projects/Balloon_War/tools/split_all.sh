#!/bin/sh
# Rebuild the depth layers for every v2 silhouette scene, with the settings each one needs (Nov 2026).
#   SOLID=1     keeps connected ink-black shapes (trunks, buildings, figures) whole on one plane, rim included, and un-mixes their
#               soft edges (pure ink + alpha) so no band of background travels with them. NOMATTE=1 skips the un-mixing.
#   SOLID0=1    also takes in the nearest band (people standing on the near ground: BW01, BW02).
#   SOLID_DARK  ink cut-off: 0.07 for most (the deep teal-black sky corners are NOT ink); 0.13 for BW03's lighter trunks.
#   EDGE        px painted out behind each nearer shape: 20 for the 2x upscales, 26 for the beach figures.
#   FILL=rows   fills hidden areas row by row (seamless for horizontal bands of sand and sea): BW02.
cd "$(dirname "$0")/.."
S=public/img/gen/scenes/2x
SOLID=1 SOLID0=1 SOLID_DARK=0.07 EDGE=26 python3 tools/sil_layers.py $S/BW01_beach_dawn.jpg
python3 tools/bw01_balloon_fix.py          # the drawn balloon and its lines straight from the painting, on the boys' plane
SOLID=1 SOLID0=1 SOLID_DARK=0.07 EDGE=26 FILL=rows python3 tools/sil_layers.py $S/BW02_release.jpg
SOLID=1 SOLID_DARK=0.13 NOMATTE=1 python3 tools/sil_layers.py $S/BW03_woods_open.jpg     # approved as is
SOLID=1 SOLID_DARK=0.22 EDGE=20 python3 tools/sil_layers.py $S/BW08_theater_girls.jpg   # lamp shades are grey-black, no dark sky here
for n in BW04_bly_road BW05_cranes BW06_raid_tokyo BW07_weatherman BW09_rei BW10_wyoming_flash \
         BW11_smokejumpers BW12_price_desk BW13_presses BW14_aug15_dc BW15_aug15_japan BW16_bookstore; do
  SOLID=1 SOLID_DARK=0.07 EDGE=20 python3 tools/sil_layers.py $S/$n.jpg
done
