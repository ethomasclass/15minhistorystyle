# Prepare the Google Flow images (flow/in/*.jpg) for the portal journey:
#   plates     crop the poster border (and the palette strip Flow copied onto p3), scale to 1920x1080, find the
#              magenta doorway, record its geometry and repaint stray magenta -> img/flow/<name>.jpg + flow.json
#   cut-outs   key out the green, despill, split into separate figures/objects -> img/flow/<sheet>_<n>.png
# Run from the project folder: python3 tools/flow_prep.py
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage

SRC, OUT = 'flow/in', 'img/flow'
os.makedirs(OUT, exist_ok=True)
W, H = 1920, 1080
info = {}


def load_plate(name, crop=(14, 14, 14, 14)):
    im = Image.open(f'{SRC}/{name}.jpg').convert('RGB')
    l, t, r, b = crop
    im = im.crop((l, t, im.width - r, im.height - b))
    s = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x0, y0 = (im.width - W) // 2, (im.height - H) // 2
    return np.asarray(im.crop((x0, y0, x0 + W, y0 + H)), np.float32)


def magenta(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return (r > 170) & (b > 170) & (g < 120)


def biggest(mask):
    lab, n = ndimage.label(mask)
    if n == 0:
        return None, lab
    sizes = ndimage.sum(mask, lab, range(1, n + 1))
    k = int(np.argmax(sizes)) + 1
    return lab == k, lab


def edges(a):
    """mean colours of the four edges, for the bleed round a plate"""
    f = lambda v: '#%02x%02x%02x' % tuple(int(c) for c in v.reshape(-1, 3).mean(0))
    return dict(top=f(a[:6]), bottom=f(a[-6:]), left=f(a[:, :6]), right=f(a[:, -6:]))


def defringe(a, hole, px=5):
    """JPEG leaves a pink fringe round the doorway: pull those pixels toward the colour just outside it"""
    ring = ndimage.binary_dilation(hole, iterations=px) & ~hole
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    pink = ring & ((r + b) / 2 - g > 40)
    if pink.any():
        far = ndimage.binary_dilation(hole, iterations=px + 6) & ~ndimage.binary_dilation(hole, iterations=px)
        idx = ndimage.distance_transform_edt(~far, return_distances=False, return_indices=True)
        a[pink] = a[idx[0][pink], idx[1][pink]]
    return a


def save(name, a, d):
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(f'{OUT}/{name}.jpg', quality=93)
    d['edges'] = edges(a)
    info[name] = d


# ---- p1, p4: no doorway
for n in ('p1_harbour', 'p4_palace'):
    save(n, load_plate(n), {})

# ---- p2: the porthole glass (a circle)
a = load_plate('p2_hull_porthole')
m, _ = biggest(magenta(a))
ys, xs = np.nonzero(m)
cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
rad = ((xs.max() - xs.min()) + (ys.max() - ys.min())) / 4 + 3
save('p2_hull_porthole', defringe(a, m), dict(kind='circle', cx=float(cx), cy=float(cy), r=float(rad)))

# ---- p3: the picture in the gilt frame (a rectangle); Flow also copied the palette strip along the bottom
a = load_plate('p3_wardroom', crop=(14, 14, 14, 64))
m, _ = biggest(magenta(a))
ys, xs = np.nonzero(m)
save('p3_wardroom', defringe(a, m), dict(kind='rect', x0=float(xs.min() - 3), y0=float(ys.min() - 3), x1=float(xs.max() + 3), y1=float(ys.max() + 3)))

# ---- p5: the middle window (an arch). Magenta spilled onto the balusters below: repaint those in stone
a = load_plate('p5_tower_window')
mm = magenta(a)
m, lab = biggest(mm)
ys, xs = np.nonzero(m)
x0, x1, y0, y1 = xs.min() - 3, xs.max() + 3, ys.min() - 3, ys.max() + 2
stray = ndimage.binary_dilation(mm & ~m, iterations=3)
if stray.any():
    sy, sx = np.nonzero(stray)
    ref = a[sy.min():sy.max() + 1, max(0, sx.min() - 260):sx.min() - 30].reshape(-1, 3)      # the balusters to the left
    ref = ref[ref.sum(1) > 420]                                                               # their lit stone, not the gaps
    a[stray] = np.median(ref, 0)
save('p5_tower_window', defringe(a, m), dict(kind='arch', x0=float(x0), x1=float(x1), y0=float(y0), y1=float(y1)))

# ---- p6: the sheet of paper (a quadrilateral, drawn in perspective)
a = load_plate('p6_queens_room')
m, _ = biggest(magenta(a))
ys, xs = np.nonzero(m)
P = np.stack([xs, ys], 1).astype(np.float32)
tl = P[np.argmin(P[:, 0] + P[:, 1])]; br = P[np.argmax(P[:, 0] + P[:, 1])]
tr = P[np.argmax(P[:, 0] - P[:, 1])]; bl = P[np.argmin(P[:, 0] - P[:, 1])]
c = (tl + tr + br + bl) / 4
quad = [(c + (q - c) * 1.035).tolist() for q in (tl, tr, br, bl)]
save('p6_queens_room', defringe(a, m), dict(kind='quad', quad=quad, cx=float(c[0]), cy=float(c[1])))


# ---- cut-out sheets: key the green, despill, split
def cutouts(name, min_area=2500):
    im = Image.open(f'{SRC}/{name}.jpg').convert('RGB')
    s = 1080 / im.height
    a = np.asarray(im.resize((round(im.width * s), 1080), Image.LANCZOS), np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    key = g - np.maximum(r, b)                          # how green
    alpha = np.clip(1 - (key - 30) / 60, 0, 1)
    spill = np.minimum(g, np.maximum(r, b) + 6)
    rgb = np.stack([r, spill, b], -1)
    solid = ndimage.binary_opening(alpha > 0.5, iterations=2)
    lab, n = ndimage.label(ndimage.binary_dilation(solid, iterations=6))
    out = []
    for k in range(1, n + 1):
        ys, xs = np.nonzero(lab == k)
        if len(ys) < min_area:
            continue
        x0, x1, y0, y1 = max(0, xs.min() - 4), xs.max() + 5, max(0, ys.min() - 4), ys.max() + 5
        al = alpha[y0:y1, x0:x1] * (lab[y0:y1, x0:x1] == k)
        al = ndimage.gaussian_filter(al, 0.7)
        px = np.dstack([rgb[y0:y1, x0:x1], al * 255]).clip(0, 255).astype(np.uint8)
        out.append((x0, px))
    out.sort(key=lambda t: t[0])
    files = []
    for i, (x0, px) in enumerate(out):
        f = f'{name}_{i + 1}.png'
        Image.fromarray(px, 'RGBA').save(f'{OUT}/{f}')
        files.append(dict(file=f, w=int(px.shape[1]), h=int(px.shape[0])))
    info[name] = dict(cutouts=files)
    return files


for n in ('c1_queen', 'c2_navy', 'c3_props'):
    print(n, [(f['file'], f['w'], f['h']) for f in cutouts(n)])
json.dump(info, open(f'{OUT}/flow.json', 'w'), indent=1)
print({k: {q: v[q] for q in v if q not in ('edges', 'cutouts')} for k, v in info.items() if k.startswith('p')})
