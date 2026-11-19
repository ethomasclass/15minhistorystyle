#!/bin/sh
# Upscale every silhouette painting 2x (Real-ESRGAN, tools/upscale.py), one at a time, skipping ones already done:
#   public/img/gen/scenes/<name>.jpg|png  ->  public/img/gen/scenes/2x/<name>.jpg      (then lock, split and stress-test them)
# A scene whose painting was fixed first (a redrawn balloon, a plate without a figure) keeps the fixed copy in
# public/img/gen/scenes/plates/<name>.jpg|png; that copy is used instead.
# Model: ~/models/esrgan_x4plus_128.onnx (huggingface bukuroo/RealESRGAN-ONNX, real-esrgan-x4plus-128.onnx); about a minute an image on CPU.
cd "$(dirname "$0")/.."
mkdir -p public/img/gen/scenes/2x
for f in public/img/gen/scenes/*.jpg public/img/gen/scenes/*.png; do
  [ -f "$f" ] || continue
  n=$(basename "$f"); n=${n%.*}; src="$f"
  for p in public/img/gen/scenes/plates/$n.jpg public/img/gen/scenes/plates/$n.png; do [ -f "$p" ] && src=$p; done
  out=public/img/gen/scenes/2x/$n.jpg
  [ -f "$out" ] && continue
  python3 tools/upscale.py "$src" "$out.png" || exit 1
  python3 -c "from PIL import Image; import sys; Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2], quality=95)" "$out.png" "$out" && rm "$out.png"
done
echo ALLDONE
