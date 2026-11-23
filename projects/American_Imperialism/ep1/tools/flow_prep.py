# Prepare the Ep 1 Google Flow images (flow/in/*.jpg): plates cropped of their poster border and scaled to 1920x1080, magenta
# doorways found and recorded (rect or circle), cut-out sheets keyed off green and split. -> img/flow/ + img/flow/flow.json
# Run from ep1/: python3 tools/flow_prep.py
import json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

SRC, OUT = 'flow/in', 'img/flow'
os.makedirs(OUT, exist_ok=True)
W, H = 1920, 1080
info = {}


def load_plate(name, crop=(12, 12, 12, 12)):
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


def edges(a):
    f = lambda v: '#%02x%02x%02x' % tuple(int(c) for c in v.reshape(-1, 3).mean(0))
    return dict(top=f(a[:6]), bottom=f(a[-6:]), left=f(a[:, :6]), right=f(a[:, -6:]))


def save(name, a, d):
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(f'{OUT}/{name}.jpg', quality=93)
    d['edges'] = edges(a)
    info[name] = d


PLATES = ['a1_prison_room', 'a3_palace_hall', 'b1_frontier_cliff', 'c1_pitch_room', 'c5_docks', 'c6_coaling_station', 'c7_mission_church',
          'd1_cane_fields', 'd2_committee_room', 'd3_government_building', 'd4_pineapple_fields', 'e1_pearl_harbor_base']
for n in PLATES:
    save(n, load_plate(n), {})

# rectangular doorways (a2's window has a glazing bar across it: the hole is the whole bounding box)
for n in ('a2_palace_window', 'c2_pitch_easel'):
    a = load_plate(n)
    m = ndimage.binary_opening(magenta(a), iterations=2)
    lab, k = ndimage.label(m)
    sizes = ndimage.sum(m, lab, range(1, k + 1))
    keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 0.15 * sizes.max()])
    ys, xs = np.nonzero(keep)
    x0, x1, y0, y1 = xs.min() - 3, xs.max() + 3, ys.min() - 3, ys.max() + 3
    a[y0:y1 + 1, x0:x1 + 1] = (a[y0:y1 + 1, x0:x1 + 1] * 0 + np.array([30, 30, 30]))   # never seen: covered by the next scene
    save(n, a, dict(kind='rect', x0=float(x0), y0=float(y0), x1=float(x1), y1=float(y1)))

# circular doorway on the map
a = load_plate('c3_pitch_map')
m = ndimage.binary_opening(magenta(a), iterations=2)
lab, k = ndimage.label(m)
sizes = ndimage.sum(m, lab, range(1, k + 1))
mm = lab == (int(np.argmax(sizes)) + 1)
mm = ndimage.binary_fill_holes(mm)
ys, xs = np.nonzero(mm)
cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
rad = ((xs.max() - xs.min()) + (ys.max() - ys.min())) / 4 + 3
save('c3_pitch_map', a, dict(kind='circle', cx=float(cx), cy=float(cy), r=float(rad)))


def cutouts(name, min_area=1500, dil=6):
    im = Image.open(f'{SRC}/{name}.jpg').convert('RGB')
    s = 1080 / im.height
    a = np.asarray(im.resize((round(im.width * s), 1080), Image.LANCZOS), np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    key = g - np.maximum(r, b)
    alpha = np.clip(1 - (key - 30) / 60, 0, 1)
    spill = np.minimum(g, np.maximum(r, b) + 6)
    rgb = np.stack([r, spill, b], -1)
    solid = ndimage.binary_opening(alpha > 0.5, iterations=2)
    lab, n = ndimage.label(ndimage.binary_dilation(solid, iterations=dil))
    out = []
    for k in range(1, n + 1):
        ys, xs = np.nonzero(lab == k)
        if len(ys) < min_area:
            continue
        x0, x1, y0, y1 = max(0, xs.min() - 4), xs.max() + 5, max(0, ys.min() - 4), ys.max() + 5
        al = alpha[y0:y1, x0:x1] * (lab[y0:y1, x0:x1] == k)
        al = ndimage.gaussian_filter(al, 0.7)
        px = np.dstack([rgb[y0:y1, x0:x1], al * 255]).clip(0, 255).astype(np.uint8)
        out.append((y0 // 200, x0, px, (int(x0), int(y0))))
    out.sort(key=lambda t: (t[0], t[1]))                 # rows, then left to right
    files = []
    for i, (_, x0, px, pos) in enumerate(out):
        f = f'{name}_{i + 1}.png'
        Image.fromarray(px, 'RGBA').save(f'{OUT}/{f}')
        files.append(dict(file=f, w=int(px.shape[1]), h=int(px.shape[0]), at=pos))
    info[name] = dict(cutouts=files)
    print(name, len(files), [(f['file'], f['w'], f['h'], f['at']) for f in files])


cutouts('s1_pitchers', dil=1)
cutouts('s2_honolulu_men')
cutouts('s3_props', min_area=800, dil=4)
json.dump(info, open(f'{OUT}/flow.json', 'w'), indent=1)
print({k: {q: v[q] for q in v if q not in ('edges', 'cutouts')} for k, v in info.items() if 'cutouts' not in v and len(v) > 1})
