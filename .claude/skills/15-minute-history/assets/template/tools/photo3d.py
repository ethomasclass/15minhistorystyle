"""Turn a real photo into a stack of depth layers for a true 3D camera move (dolly, orbit), the way phone "3D photos"
work. A depth map is estimated with Depth Anything V2 (small, ONNX, runs on CPU), the photo is sliced into N depth
bands, and each band is extended a little under the bands in front of it so a moving camera never opens a hole.

  python3 tools/photo3d.py public/img/ch02_protector/320th_walk_balloon_to_winch_1944.jpg --crop 0,500,3235,1820 \
      --layers 10 --name ch02_320th

Writes public/img/layers3d/<name>/
  L00.png … L09.png   far → near, RGBA, full frame size
  depth.png           the depth map (white = near), for checking
  layers.json         size and each layer's depth (0 far … 1 near)
The model (about 100 MB) is downloaded once to ~/.cache/15mh/. The layers are the real photo's own pixels; only the
thin hidden strips behind objects are filled (from their surroundings).
"""
import argparse, json, os, urllib.request
import cv2
import numpy as np
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public", "img", "layers3d")
MODEL_URL = "https://huggingface.co/onnx-community/depth-anything-v2-small/resolve/main/onnx/model.onnx"
MODEL = os.path.expanduser("~/.cache/15mh/depth_anything_v2_small.onnx")


def depth_map(img):
    """Relative depth, 0 = far, 1 = near, at the image's size."""
    import onnxruntime as ort
    if not os.path.exists(MODEL):
        os.makedirs(os.path.dirname(MODEL), exist_ok=True)
        urllib.request.urlretrieve(MODEL_URL, MODEL)
    h, w = img.shape[:2]
    s = 518 / min(h, w)
    H, W = int(round(h * s / 14)) * 14, int(round(w * s / 14)) * 14
    x = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    sess = ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
    d = sess.run(None, {"pixel_values": x.transpose(2, 0, 1)[None].astype(np.float32)})[0][0]
    d = cv2.resize(d, (w, h), interpolation=cv2.INTER_CUBIC)
    lo, hi = np.percentile(d, 1), np.percentile(d, 99)
    d = np.clip((d - lo) / (hi - lo + 1e-6), 0, 1).astype(np.float32)
    # keep depth edges on the photo's edges: a joint-bilateral-style smooth
    return cv2.bilateralFilter(d, 9, 0.08, 7)


def smooth_fill(img, have, sigma):
    m = have.astype(np.float32)
    num = cv2.GaussianBlur(img.astype(np.float32) * m[..., None], (0, 0), sigma)
    den = cv2.GaussianBlur(m, (0, 0), sigma)[..., None]
    out = num / np.maximum(den, 1e-4)
    out[den[..., 0] < 1e-3] = img[have].mean(0) if have.any() else 0
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("image")
    ap.add_argument("--crop", help="x,y,w,h in source pixels")
    ap.add_argument("--layers", type=int, default=10)
    ap.add_argument("--max", type=int, default=2400, help="longest side of the output")
    ap.add_argument("--extend", type=int, default=50, help="px each layer extends under the layers in front")
    ap.add_argument("--name")
    a = ap.parse_args()
    name = a.name or os.path.splitext(os.path.basename(a.image))[0]
    img = cv2.imread(a.image, cv2.IMREAD_COLOR)
    if a.crop:
        x, y, w, h = map(int, a.crop.split(","))
        img = img[y:y + h, x:x + w]
    s = a.max / max(img.shape[:2])
    if s < 1:
        img = cv2.resize(img, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    h, w = img.shape[:2]
    out = os.path.join(OUT, name)
    os.makedirs(out, exist_ok=True)

    d = depth_map(img)
    cv2.imwrite(os.path.join(out, "depth.png"), (d * 255).astype(np.uint8))
    # bands with equal pixel counts, so each layer carries a fair share of the picture
    # half equal-count, half equal-spacing: busy depths get more layers, and a big flat sky doesn't eat them all
    edges = 0.5 * np.quantile(d, np.linspace(0, 1, a.layers + 1)) + 0.5 * np.linspace(d.min(), d.max(), a.layers + 1)
    band = np.clip(np.searchsorted(edges, d, side="right") - 1, 0, a.layers - 1)
    band = cv2.medianBlur(band.astype(np.uint8), 5).astype(int)
    depths = []
    for k in range(a.layers):
        own = band == k
        nearer = band > k
        if k == 0:
            alpha = np.ones((h, w), np.float32)               # the farthest layer is opaque
            color = img.astype(np.float32).copy()
            fill = smooth_fill(img, ~nearer, 30)
            color[nearer] = fill[nearer]
        else:
            dist, idx = ndimage.distance_transform_edt(nearer, return_indices=True)
            ext = nearer & (dist <= a.extend) & own[idx[0], idx[1]]
            alpha = (own | ext).astype(np.float32)
            color = img.astype(np.float32).copy()
            soft = smooth_fill(img, own, 8)
            color[ext] = soft[ext]
            alpha = cv2.GaussianBlur(alpha, (0, 0), 1.0)
        rgba = np.dstack([np.clip(color, 0, 255).astype(np.uint8), (alpha * 255).astype(np.uint8)])
        cv2.imwrite(os.path.join(out, f"L{k:02d}.png"), rgba)
        depths.append(float(d[own].mean()) if own.any() else float((edges[k] + edges[k + 1]) / 2))
    json.dump({"size": [w, h], "layers": a.layers, "depth": depths}, open(os.path.join(out, "layers.json"), "w"), indent=1)
    print(f"layers3d/{name}/: {a.layers} layers, {w}x{h}")


if __name__ == "__main__":
    main()
