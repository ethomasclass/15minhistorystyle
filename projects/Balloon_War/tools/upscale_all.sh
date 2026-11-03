#!/bin/sh
# Upscale every silhouette scene 2x (Real-ESRGAN), one at a time. BW02 uses its balloon-free plate (the balloon is its own layer).
cd "$(dirname "$0")/.."
for f in public/img/gen/scenes/BW*.jpg; do
  n=$(basename "$f" .jpg); src="$f"
  [ "$n" = "BW02_release" ] && src=public/img/gen/scenes/plates/BW02_release_plate.jpg
  out=public/img/gen/scenes/2x/$n.png
  [ -f "$out" ] && continue
  python3 tools/upscale.py "$src" "$out"
done
for p in public/img/gen/scenes/2x/*.png; do python3 -c "from PIL import Image; import sys; Image.open(sys.argv[1]).convert('RGB').save(sys.argv[1][:-4]+'.jpg', quality=95)" "$p" && rm "$p"; done
echo ALLDONE
