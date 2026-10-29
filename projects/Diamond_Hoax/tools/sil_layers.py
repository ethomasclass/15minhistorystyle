"""Split a layered-silhouette painting into depth layers by tone, for a multi-plane parallax move.

The paintings are built in flat bands: a black foreground, two or three hazier ochre bands behind it, the sky at the back.
Luminance alone splits the sky into patches, so the bands come from a depth estimate (Depth Anything V2, tools/mono_depth.py),
quantised into `bands` planes by k-means. The model keeps lanterns and fires with the things that hold them.

  python3 tools/sil_layers.py public/img/gen/scenes/ch03_wagon_roof.jpg            # -> public/img/layers/sil/ch03_wagon_roof/
  python3 tools/sil_layers.py public/img/gen/scenes/*.jpg --bands 4

Writes L0.webp (nearest) .. L{n-1}.jpg (the opaque back plate), glow.webp (the orange lights alone, for a flicker pass)
and layers.json ({size, bands, thresholds}). Layer k is extended EXTEND px underneath the nearer layers (filled by inpainting),
so a parallax shift up to that size never shows a hole.
"""
import json, os, subprocess, sys
import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public", "img", "layers", "sil")
EXTEND = 60          # px at full size
MAXW = 2752
MODEL = os.environ.get("DEPTH_MODEL", os.path.expanduser("~/models/da2_small.onnx"))  # Depth Anything V2 small ONNX (huggingface onnx-community/depth-anything-v2-small)


def split(path, bands=4):
    name = os.path.splitext(os.path.basename(path))[0]
    im = cv2.imread(path, cv2.IMREAD_COLOR)
    if im.shape[1] > MAXW:
        im = cv2.resize(im, (MAXW, round(im.shape[0] * MAXW / im.shape[1])), interpolation=cv2.INTER_AREA)
    H, W = im.shape[:2]
    hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    # the orange lights (only used for the glow/flicker pass)
    glow = (hsv[..., 1] > 170) & (hsv[..., 0] >= 5) & (hsv[..., 0] <= 28) & (hsv[..., 2] > 200)  # lamps and fire, not the ochre sky
    glow = cv2.dilate(glow.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    # depth (Depth Anything V2 small via tools/mono_depth.py; near = bright), cached next to the layers
    d = os.path.join(OUT, name)
    os.makedirs(d, exist_ok=True)
    dp = os.path.join(d, "depth.png")
    if not os.path.exists(dp):
        tmp = os.path.join(d, "_src.jpg")
        cv2.imwrite(tmp, im)
        subprocess.run([sys.executable, os.path.join(HERE, "mono_depth.py"), MODEL, tmp, dp], check=True)
        os.remove(tmp)
        os.remove(dp.replace(".png", "_preview.jpg"))
    depth = cv2.imread(dp, cv2.IMREAD_UNCHANGED).astype(np.float32) / 65535
    depth = cv2.resize(depth, (W, H))
    # the model sometimes marks the top edge as near: the top 16% can be no nearer than the row below it
    r = int(H * 0.16)
    depth[:r] = np.minimum(depth[:r], np.median(depth[r:r + 4], axis=0, keepdims=True))  # (a tall near object keeps its depth)
    vals = depth.reshape(-1, 1)[:: max(1, (H * W) // 200000)]
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 50, 0.002)
    _, _, cen = cv2.kmeans(vals, bands, None, crit, 5, cv2.KMEANS_PP_CENTERS)
    cen = np.sort(cen.ravel())[::-1]                                  # near first
    th = [(cen[i] + cen[i + 1]) / 2 for i in range(bands - 1)]
    label = np.zeros((H, W), np.uint8)
    for t in th:
        label += (depth < t).astype(np.uint8)                         # 0 = nearest
    label = cv2.medianBlur(label, 5)

    k = np.ones((3, 3), np.uint8)
    small = 0.5
    for b in range(bands):
        nearer = (label < b).astype(np.uint8)
        if b == bands - 1:
            # back plate: everything nearer painted out, fully opaque
            fill = inpaint(im, nearer, small)
            cv2.imwrite(os.path.join(d, f"L{b}.jpg"), fill, [cv2.IMWRITE_JPEG_QUALITY, 92])
            continue
        own = (label == b).astype(np.uint8)
        reach = cv2.dilate(own, np.ones((2 * EXTEND + 1, 2 * EXTEND + 1), np.uint8)) & nearer
        fill = inpaint(im, nearer, small) if reach.any() else im
        alpha = np.clip(own + reach, 0, 1) * 255
        alpha = cv2.GaussianBlur(alpha.astype(np.uint8), (0, 0), 0.8)
        rgba = np.dstack([np.where(own[..., None] > 0, im, fill), alpha])
        cv2.imwrite(os.path.join(d, f"L{b}.webp"), rgba, [cv2.IMWRITE_WEBP_QUALITY, 90])
    g = np.dstack([im, (cv2.GaussianBlur(glow.astype(np.float32), (0, 0), 2) * 255).astype(np.uint8)])
    cv2.imwrite(os.path.join(d, "glow.webp"), g, [cv2.IMWRITE_WEBP_QUALITY, 90])
    # a preview: each band in its own colour
    pal = np.array([[30, 30, 200], [40, 160, 40], [200, 120, 30], [160, 60, 160], [60, 200, 200]], np.uint8)
    prev = cv2.addWeighted(im, 0.4, pal[label % len(pal)], 0.6, 0)
    cv2.imwrite(os.path.join(d, "preview.jpg"), cv2.resize(prev, (W // 3, H // 3)))
    gl = int(np.bincount(label[glow], minlength=bands).argmax()) if glow.any() else 0   # the plane most lights sit on
    json.dump({"size": [W, H], "bands": bands, "thresholds": [float(t) for t in th], "glowLayer": gl,
               "share": [float((label == b).mean()) for b in range(bands)]}, open(os.path.join(d, "layers.json"), "w"))
    print(name, W, H, "thresholds", [round(float(t)) for t in th], "share", [round(float((label == b).mean()), 2) for b in range(bands)])


def inpaint(im, mask, s):
    """Paint out `mask` (inpainting at half size for speed, then pasted back only inside the mask)."""
    sm = cv2.resize(im, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    mm = cv2.resize(mask * 255, (sm.shape[1], sm.shape[0]), interpolation=cv2.INTER_NEAREST)
    mm = cv2.dilate(mm, np.ones((3, 3), np.uint8))
    fill = cv2.inpaint(sm, mm, 9, cv2.INPAINT_TELEA)
    fill = cv2.resize(fill, (im.shape[1], im.shape[0]), interpolation=cv2.INTER_CUBIC)
    return np.where(mask[..., None] > 0, fill, im)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    bands = int(sys.argv[sys.argv.index("--bands") + 1]) if "--bands" in sys.argv else 4
    args = [a for a in args if not a.isdigit()]
    for p in args:
        split(p, bands)
