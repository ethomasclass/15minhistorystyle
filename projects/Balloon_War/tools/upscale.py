"""Upscale an image 2x for the parallax scenes: Real-ESRGAN x4plus (ONNX, 128 px tiles with feathered overlap), then down to 2x.

  python3 tools/upscale.py in.jpg out.png [--model=~/models/esrgan_x4plus_128.onnx] [--scale=2]

Model: huggingface bukuroo/RealESRGAN-ONNX (real-esrgan-x4plus-128.onnx, BSD-3-Clause). CPU is fine: about a minute an image.
"""
import os, sys
import numpy as np
import onnxruntime as ort
from PIL import Image

T, OV = 128, 16


def main():
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    o = dict(x[2:].split('=') for x in sys.argv[1:] if x.startswith('--'))
    model = os.path.expanduser(o.get('model', '~/models/esrgan_x4plus_128.onnx'))
    scale = float(o.get('scale', 2))
    sess = ort.InferenceSession(model, providers=['CPUExecutionProvider'])
    name = sess.get_inputs()[0].name
    im = np.asarray(Image.open(a[0]).convert('RGB')).astype(np.float32) / 255
    H, W = im.shape[:2]
    pad = np.pad(im, ((0, T), (0, T), (0, 0)), mode='reflect')
    out = np.zeros(((H + T) * 4, (W + T) * 4, 3), np.float32)
    wsum = np.zeros(((H + T) * 4, (W + T) * 4, 1), np.float32)
    ramp = np.minimum(np.arange(T * 4) + 1, np.arange(T * 4)[::-1] + 1).astype(np.float32)
    wt = np.minimum(np.minimum.outer(ramp, ramp), OV * 4)[..., None]
    stride = T - OV
    for y in range(0, H, stride):
        for x in range(0, W, stride):
            tile = pad[y:y + T, x:x + T].transpose(2, 0, 1)[None]
            up = sess.run(None, {name: np.ascontiguousarray(tile)})[0][0].transpose(1, 2, 0)
            out[y * 4:(y + T) * 4, x * 4:(x + T) * 4] += up * wt
            wsum[y * 4:(y + T) * 4, x * 4:(x + T) * 4] += wt
    out = (out / np.maximum(wsum, 1e-6))[:H * 4, :W * 4]
    res = Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))
    res = res.resize((round(W * scale), round(H * scale)), Image.LANCZOS)
    res.save(a[1])
    print(a[0], '->', a[1], res.size)


if __name__ == '__main__':
    main()
