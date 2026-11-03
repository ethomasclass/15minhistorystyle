#!/bin/sh
# Rebuild the depth layers for every v2 silhouette scene, with the settings each one needs.
#   SOLID=1 keeps connected ink-black shapes (trunks, buildings, figures) whole on one plane (see tools/sil_layers.py).
#   SOLID_DARK is the ink cut-off: 0.07 for most (so the deep teal-black sky corners are NOT treated as ink); 0.13 for BW03,
#   whose trunks are slightly lighter than pure ink and were cut in half otherwise.
cd "$(dirname "$0")/.."
S=public/img/gen/scenes/2x
python3 tools/sil_layers.py $S/BW01_beach_dawn.jpg
# BW01: the balloon came out on the nearest plane, ahead of the boys holding its rope; merge it onto their plane
python3 - <<'PY'
from PIL import Image
d='public/img/layers/sil/BW01_beach_dawn/'
l0=Image.open(d+'L0.webp').convert('RGBA'); l1=Image.open(d+'L1.webp').convert('RGBA')
l1.alpha_composite(l0); l1.save(d+'L1.webp', quality=90)
Image.new('RGBA', l0.size, (0, 0, 0, 0)).save(d+'L0.webp')
PY
SOLID=1 SOLID_DARK=0.13 python3 tools/sil_layers.py $S/BW03_woods_open.jpg
for n in BW02_release BW04_bly_road BW05_cranes BW06_raid_tokyo BW07_weatherman BW08_theater_girls BW09_rei BW10_wyoming_flash \
         BW11_smokejumpers BW12_price_desk BW13_presses BW14_aug15_dc BW15_aug15_japan BW16_bookstore; do
  SOLID=1 SOLID_DARK=0.07 python3 tools/sil_layers.py $S/$n.jpg
done
