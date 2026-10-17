"""Split a layered silhouette illustration (flat planes of one color, darker = nearer) into depth layers for parallax,
and cut out a moving subject from its magenta mask pass.

  python3 tools/silhouette_layers.py public/img/gen/ch04_pacific_night.png --planes 4
  python3 tools/silhouette_layers.py public/img/gen/ch02_beach_balloon_walk.png --planes 5 \
      --mask public/img/gen/ch02_beach_balloon_walk_mask.png

Writes public/img/layers/<name>/
  L0.jpg            the sky: opaque, with everything nearer painted out (row by row, so gradients continue)
  L1.png … Ln.png   each nearer plane on transparency, extended a little under the planes in front of it so a
                    parallax shift never opens a hole
  subject.png       the masked subject (balloon), cut out at full resolution, and removed from every layer
  layers.json       size, plane count, each plane's tone, the subject's bounding box
The flat tones come from k-means in Lab color; planes are ordered by lightness (lightest = farthest). A soft sky
gradient lands in the sky plane; if it splits across two clusters, raise --planes and pass --merge-sky 2.
"""
import argparse, json, os
import cv2
import numpy as np
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public", "img", "layers")


def magenta(mask_img):
    """Pixels the mask pass filled with #FF00FF (tolerant of compression)."""
    b, g, r = [mask_img[..., i].astype(int) for i in range(3)]
    m = (r > 180) & (b > 180) & (g < 110)
    m = ndimage.binary_closing(m, iterations=2)
    return ndimage.binary_dilation(m, iterations=2)


def smooth_fill(img, have, sigma):
    """Colors for every pixel from the nearby pixels in `have` (normalized convolution): a soft continuation of a
    plane's own tones, with no streaks."""
    m = have.astype(np.float32)
    num = cv2.GaussianBlur(img.astype(np.float32) * m[..., None], (0, 0), sigma)
    den = cv2.GaussianBlur(m, (0, 0), sigma)[..., None]
    out = num / np.maximum(den, 1e-4)
    flat = img[have].mean(0) if have.any() else np.zeros(3)
    out[den[..., 0] < 1e-3] = flat
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("image")
    ap.add_argument("--planes", type=int, default=4)
    ap.add_argument("--merge-sky", type=int, default=1, help="how many of the lightest clusters form the sky")
    ap.add_argument("--mask", help="the magenta mask pass of the same image")
    ap.add_argument("--extend", type=int, default=60, help="px each plane extends under the planes in front of it")
    ap.add_argument("--name")
    a = ap.parse_args()
    name = a.name or os.path.splitext(os.path.basename(a.image))[0]
    img = cv2.imread(a.image, cv2.IMREAD_COLOR)
    h, w = img.shape[:2]
    out = os.path.join(OUT, name)
    os.makedirs(out, exist_ok=True)

    subject = None
    if a.mask:
        mk = cv2.resize(cv2.imread(a.mask, cv2.IMREAD_COLOR), (w, h), interpolation=cv2.INTER_NEAREST)
        subject = magenta(mk)

    # k-means on Lab, ignoring the subject
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)
    use = lab if subject is None else lab[~subject.reshape(-1)]
    k = a.planes + a.merge_sky - 1
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.5)
    _, _, centers = cv2.kmeans(use[:: max(1, len(use) // 200000)], k, None, crit, 4, cv2.KMEANS_PP_CENTERS)
    d = ((lab[:, None, :] - centers[None, :, :]) ** 2).sum(-1)
    lab_idx = d.argmin(1)
    order = np.argsort(-centers[:, 0])            # lightest first = farthest
    rank = np.empty(k, int); rank[order] = np.arange(k)
    depth = rank[lab_idx].reshape(h, w)
    depth = np.maximum(depth - (a.merge_sky - 1), 0)  # the lightest merge_sky clusters are plane 0
    # tidy speckle: a 5px median keeps the cut edges but removes stray single pixels
    depth = cv2.medianBlur(depth.astype(np.uint8), 5).astype(int)
    if subject is not None:
        # the subject's pixels belong to whatever plane surrounds them (fill by nearest non-subject pixel)
        idx = ndimage.distance_transform_edt(subject, return_distances=False, return_indices=True)
        depth = depth[idx[0], idx[1]]

    P = a.planes
    # L0: the sky, opaque. Nearer pixels (and the subject) are filled row by row from that row's sky pixels.
    sky = depth == 0
    if subject is not None:
        sky &= ~subject
    L0 = img.astype(np.float32).copy()
    mean_rows = np.array([img[y][sky[y]].mean(0) if sky[y].any() else [np.nan] * 3 for y in range(h)])
    for c in range(3):
        col = mean_rows[:, c]
        good = ~np.isnan(col)
        mean_rows[:, c] = np.interp(np.arange(h), np.arange(h)[good], col[good])
    rowfill = np.repeat(mean_rows[:, None, :], w, 1)
    near = smooth_fill(img, sky, 40)
    den = cv2.GaussianBlur(sky.astype(np.float32), (0, 0), 40)
    blend = np.clip(den * 4, 0, 1)[..., None]           # near the sky's edge use its local colors, far away the row mean
    fill = near * blend + rowfill * (1 - blend)
    L0[~sky] = fill[~sky]
    cv2.imwrite(os.path.join(out, "L0.jpg"), np.clip(L0, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 93])

    tones = []
    for p in range(1, P):
        own = depth == p
        nearer = depth > p
        if subject is not None:
            own &= ~subject
        # extend this plane under nearer planes: for each nearer pixel, the nearest pixel that is not nearer
        dist, idx = ndimage.distance_transform_edt(nearer, return_indices=True)
        src_is_own = own[idx[0], idx[1]]
        ext = nearer & (dist <= a.extend) & src_is_own
        alpha = (own | ext).astype(np.float32)
        color = img.astype(np.float32).copy()
        soft = smooth_fill(img, own, 12)
        color[ext] = soft[ext]
        if subject is not None:
            # where the subject sat, continue this plane from its own neighbours
            sidx = ndimage.distance_transform_edt(subject, return_distances=False, return_indices=True)
            sub_own = subject & own[sidx[0], sidx[1]]
            alpha[sub_own] = 1
            color[sub_own] = soft[sub_own]
        color = np.clip(color, 0, 255).astype(np.uint8)
        alpha = cv2.GaussianBlur(alpha, (0, 0), 0.8)
        rgba = np.dstack([color, (alpha * 255).astype(np.uint8)])
        cv2.imwrite(os.path.join(out, f"L{p}.png"), rgba)
        tones.append([int(v) for v in img[own].mean(0)[::-1]] if own.any() else None)

    meta = {"size": [w, h], "planes": P, "tones_rgb": tones}
    if subject is not None:
        ys, xs = np.where(subject)
        x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
        soft = cv2.GaussianBlur(subject.astype(np.float32), (0, 0), 0.8)
        rgba = np.dstack([img, (soft * 255).astype(np.uint8)])[y0:y1 + 1, x0:x1 + 1]
        cv2.imwrite(os.path.join(out, "subject.png"), rgba)
        meta["subject_box"] = [int(x0), int(y0), int(x1 - x0 + 1), int(y1 - y0 + 1)]
    json.dump(meta, open(os.path.join(out, "layers.json"), "w"), indent=1)
    print(f"layers/{name}/: L0 + {P - 1} planes" + (" + subject" if subject is not None else ""))


if __name__ == "__main__":
    main()
