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
EDGE = int(os.environ.get("EDGE", "6"))  # px painted out beyond each nearer shape (its soft rim), so no ghost outlines (14 for the 2x upscales)
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
    if os.environ.get("SOLID"):
        # Keep solid shapes whole (Balloon War, Nov 2026: BW03's trunks were cut in half, the depth model fading each trunk from
        # near at the foot to far at the top). Every connected ink-black shape (plus the coral balloon touching it) beyond the
        # nearest band goes on ONE plane: the majority plane of its pixels. The nearest band (ground, ferns) keeps its own.
        L = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
        hsv2 = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
        coral = (hsv2[..., 1] > 90) & ((hsv2[..., 0] <= 12) | (hsv2[..., 0] >= 170)) & (hsv2[..., 2] > 120)
        # SOLID0=1 also takes in the nearest band, for scenes where people stand on the near ground (BW01/BW02): otherwise a boy's
        # back or arm that the depth model put one plane back is split from his body and slides out as an echo
        floor = 0 if os.environ.get("SOLID0") else 1
        solid = (((L < float(os.environ.get("SOLID_DARK", "0.13"))) | coral) & (label >= floor)).astype(np.uint8)
        n, comp = cv2.connectedComponents(solid, connectivity=8)
        flat_c, flat_l = comp.ravel(), label.ravel()
        counts = np.zeros((n, bands), np.int64)
        np.add.at(counts, (flat_c, flat_l), 1)
        mode = counts.argmax(1).astype(np.uint8)
        # prefer a plane in front of the back plate when at least 10% of the shape is there, so trees stand clear of the hills
        front = counts[:, :bands - 1]
        use_front = front.sum(1) >= 0.10 * counts.sum(1)
        mode = np.where(use_front, front.argmax(1), mode).astype(np.uint8)
        # small coral pieces (each paper crane) count too, so none is left smeared on the plane behind
        has_coral = np.zeros(n, bool)
        has_coral[np.unique(comp[coral & (comp > 0)])] = True
        big = (counts.sum(1) > 400) | (has_coral & (counts.sum(1) > 20))
        # all the coral pieces of one object (every string of cranes, the balloon and its parts) go on ONE plane: the front
        # plane most of the coral sits on (BW05: one string of cranes was left alone on the back plate and smeared)
        cc = np.unique(comp[coral & (comp > 0)])
        if len(cc):
            cnt = counts[cc].sum(0)
            target = int(cnt[:bands - 1].argmax()) if cnt[:bands - 1].sum() else int(cnt.argmax())
            mode[cc] = target
        fix = (comp > 0) & big[comp]
        label = np.where(fix, mode[comp], label).astype(np.uint8)
        # ...and its soft rim: pixels within RIM px of a solid shape that the depth model put FARTHER back are pulled onto the
        # shape's plane, so no edge or halo of a figure is left on the plane behind (BW01's ghost boys and balloon ring).
        rim = int(os.environ.get("RIM", "5"))
        rk = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * rim + 1, 2 * rim + 1))
        ink = L < float(os.environ.get("SOLID_DARK", "0.13"))
        for bb in range(0, bands - 1):
            # plane 0 (nearest) isn't in the solid shapes, so use its ink pixels directly (BW02's boys stand on it)
            near_shape = ((ink & (label == 0)) if bb == 0 else (fix & (label == bb))).astype(np.uint8)
            if not near_shape.any():
                continue
            ring = (cv2.dilate(near_shape, rk) > 0) & (~fix | (bb == 0)) & (label > bb)
            label[ring] = bb
        print(name, "solid shapes:", int(big[1:].sum()))

    k = np.ones((3, 3), np.uint8)
    small = 0.5
    # The soft, anti-aliased rim of every nearer shape sits on the far side of the band boundary, so painting out only the
    # nearer pixels left a faint ghost outline of each shape baked into the planes behind it, visible once they slide
    # (Halloween, Oct 2026). Paint out an EDGE-px wider area, and let the rim take the fill colour, not its own pixels.
    edge_k = np.ones((2 * EDGE + 1, 2 * EDGE + 1), np.uint8)
    for b in range(bands):
        nearer = (label < b).astype(np.uint8)
        wide = cv2.dilate(nearer, edge_k) if nearer.any() else nearer
        if b == bands - 1:
            # back plate: everything nearer (plus its rim) painted out, fully opaque
            fill = inpaint(im, wide, small)
            cv2.imwrite(os.path.join(d, f"L{b}.jpg"), fill, [cv2.IMWRITE_JPEG_QUALITY, 92])
            continue
        own = (label == b).astype(np.uint8)
        reach = cv2.dilate(own, np.ones((2 * EXTEND + 1, 2 * EXTEND + 1), np.uint8)) & nearer
        fill = inpaint(im, wide, small) if reach.any() else im
        alpha = np.clip(own + reach, 0, 1) * 255
        alpha = cv2.GaussianBlur(alpha.astype(np.uint8), (0, 0), 0.8)
        keep = (own > 0) & (wide == 0)               # own pixels away from the rim keep the painting; the rim takes the fill
        rgba = np.dstack([np.where(keep[..., None], im, fill), alpha])
        if os.environ.get("SOLID") and not os.environ.get("NOMATTE"):
            # Un-mix the soft edges of ink shapes (Balloon War, Nov 2026: a band of sand travelled with BW02's boys). An edge
            # pixel is a blend of ink and whatever is behind: im = a*INK + (1-a)*behind. `behind` is this plane and everything
            # nearer painted out, so a = (behind - im) / (behind - ink) in brightness; the edge becomes pure ink with that alpha.
            behind = inpaint(im, cv2.dilate((label <= b).astype(np.uint8), edge_k), small)
            Li = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
            Lb = cv2.cvtColor(behind, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
            ek = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
            ik = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
            # only around this plane's own ink shapes (a sand or sea plane's own pixels ARE background and must stay)
            own_ink = (own > 0) & (Li < 0.2)
            zone = (cv2.dilate(own, ek) > 0) & (cv2.erode(own, ik) == 0) & (cv2.dilate(own_ink.astype(np.uint8), ek) > 0)
            hsv_e = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
            coral_e = (hsv_e[..., 1] > 70) & ((hsv_e[..., 0] <= 14) | (hsv_e[..., 0] >= 168)) & (hsv_e[..., 2] > 90)
            coral_e = cv2.dilate(coral_e.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0   # the balloon is never "ink"
            inkish = zone & (Li < Lb - 0.03) & (Li < 0.35) & ~coral_e
            a = np.clip((Lb - Li) / np.maximum(Lb - 0.045, 0.03), 0, 1)
            rgba[inkish, :3] = (9, 12, 13)
            rgba[inkish, 3] = (a[inkish] * 255).astype(np.uint8)
            rgba[zone & ~inkish & (own == 0) & (reach == 0), 3] = 0
            # edge pixels that are really background (same brightness as what's behind) never travel with the shape
            rgba[zone & ~inkish & ~own_ink & (np.abs(Li - Lb) < 0.06) & ~coral_e & (reach == 0) & (cv2.dilate(own_ink.astype(np.uint8), ik) > 0), 3] = 0
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


def rowfill(im, mask):
    """Fill `mask` row by row, interpolating between the nearest clear pixels left and right of each gap, then smooth it a
    little vertically. Seamless for paintings built in horizontal bands (sand, sea, hills, sky): FILL=rows."""
    out = im.astype(np.float32).copy()
    H, W = mask.shape
    xs = np.arange(W)
    for y in range(H):
        m = mask[y] > 0
        if not m.any() or m.all():
            continue
        clear = ~m
        for c in range(3):
            out[y, m, c] = np.interp(xs[m], xs[clear], out[y, clear, c])
    # rows hidden end to end take the nearest row that had clear pixels (above first, then below)
    full = [y for y in range(H) if (mask[y] > 0).all()]
    ok = np.array([not (mask[y] > 0).all() for y in range(H)])
    if full and ok.any():
        idx = np.where(ok)[0]
        for y in full:
            above = idx[idx < y]
            src = above[-1] if len(above) else idx[idx > y][0]
            out[y] = out[src]
    sm = cv2.GaussianBlur(out, (0, 0), sigmaX=3.0, sigmaY=14)
    m3 = (mask > 0)[..., None]
    return np.where(m3, sm, im.astype(np.float32)).clip(0, 255).astype(np.uint8)


def inpaint(im, mask, s):
    """Paint out `mask` (inpainting at half size for speed, then pasted back only inside the mask)."""
    if os.environ.get("FILL") == "rows":
        return rowfill(im, mask)
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
