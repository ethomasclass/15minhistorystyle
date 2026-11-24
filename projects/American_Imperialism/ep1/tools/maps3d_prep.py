# Textures for the 3D map shots (blender/mapshots.py), from frames the other pieces already make:
#   card   the island card at the end of the ch 5 test (tools/vec_test.py, build/vec_ch05/silent.mp4, last frame):
#          card_A.png is that frame with its outer edge eased into one flat desk colour (the 3D desk around it);
#          card_B.png is the same with the card's drawn Oʻahu replaced by the true coastline (the relief's own land mask,
#          assets/geo/oahu_terrain.npz) at the same place, size and colour, so the relief can rise out of it exactly
#   python3 tools/maps3d_prep.py card
import json, math, os, subprocess, sys
import numpy as np
import cv2
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.abspath(os.path.join(HERE, '..'))
OUT = os.path.join(EP, 'build', 'maps3d')
os.makedirs(OUT, exist_ok=True)

KLAT = math.cos(math.radians(20.8))
K = 138                                                    # vec_test.py islands(): px per degree, card centre 960, 600
OAHU_C = [(-158.28, 21.58), (-158.10, 21.70), (-157.98, 21.71), (-157.82, 21.55), (-157.70, 21.44), (-157.65, 21.31),
          (-157.81, 21.25), (-157.95, 21.33), (-158.11, 21.30), (-158.23, 21.42)]          # the card's drawn Oʻahu


def card_px(lon, lat):
    return 960 + (lon + 157.53) * KLAT * K, 600 - (lat - 20.57) * K


def quad_path(pts, steps=12):
    """the card's smoothing: quadratic curves through the edge midpoints, the points as controls"""
    out = []
    n = len(pts)
    for i in range(n):
        a = ((pts[i - 1][0] + pts[i][0]) / 2, (pts[i - 1][1] + pts[i][1]) / 2)
        c = pts[i]
        b = ((pts[i][0] + pts[(i + 1) % n][0]) / 2, (pts[i][1] + pts[(i + 1) % n][1]) / 2)
        for s in range(steps):
            u = s / steps
            out.append(((1 - u) ** 2 * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]))
    return out


def card():
    src = os.path.join(EP, 'build', 'vec_ch05', 'silent.mp4')
    last = os.path.join(OUT, 'ch05_last.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.05', '-i', src, '-frames:v', '1', last], check=True)
    a = np.asarray(Image.open(last).convert('RGB')).astype(np.float32)
    H, W = a.shape[:2]
    rng = np.random.default_rng(3)
    # the desk colour at the frame's edge, and the edge eased into it
    edge = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)]).mean(0)
    yy, xx = np.mgrid[0:H, 0:W]
    dist = np.minimum.reduce([xx, W - 1 - xx, yy, H - 1 - yy]).astype(np.float32)
    k = np.clip(dist / 90.0, 0, 1)[..., None]
    k = k * k * (3 - 2 * k)
    A = a * k + edge * (1 - k)
    # B: paint out the drawn Oʻahu (and its shadow) with the card's sea, draw the true coast, redraw the dashed lines
    SEA = np.array([27.0, 25.0, 21.0])
    LAND, LAND_D = np.array([254.0, 109.0, 95.0]), np.array([211.0, 80.0, 72.0])
    TEAL = np.array([47.0, 224.0, 196.0])
    S = 4                                                       # supersampled masks over a box around the island
    bx0, by0, bx1, by1 = 820, 400, 1000, 540
    bw, bh = (bx1 - bx0) * S, (by1 - by0) * S

    def mask(draw_fn):
        im = Image.new('L', (bw, bh), 0)
        draw_fn(ImageDraw.Draw(im))
        return np.asarray(im.resize((bx1 - bx0, by1 - by0), Image.BOX), dtype=np.float32)[..., None] / 255.0

    crude = [card_px(*p) for p in OAHU_C]
    cp = quad_path(crude)
    old = mask(lambda d: (d.polygon([((x - bx0) * S, (y - by0) * S) for x, y in cp], fill=255),
                          d.polygon([((x - bx0 + 4) * S, (y - by0 + 6) * S) for x, y in cp], fill=255)))
    old = np.clip(cv2.dilate(old[..., 0], np.ones((5, 5), np.uint8)), 0, 1)[..., None]
    # the true coast: the relief's land mask sampled at each (supersampled) card pixel
    z = np.load(os.path.join(EP, 'assets', 'geo', 'oahu_terrain.npz'))
    land = z['land'].astype(np.float32)
    bb = json.loads(str(z['bounds']))
    gh, gw = land.shape
    sx = (np.arange(bw) + 0.5) / S + bx0
    sy = (np.arange(bh) + 0.5) / S + by0
    lon = (sx - 960) / (KLAT * K) - 157.53
    lat = 20.57 - (sy - 600) / K
    mx = ((lon - bb['lon0']) / (bb['lon1'] - bb['lon0']) * gw - 0.5).astype(np.float32)
    my = ((bb['lat1'] - lat) / (bb['lat1'] - bb['lat0']) * gh - 0.5).astype(np.float32)
    MX, MY = np.meshgrid(mx, my)
    lm = cv2.remap(land, MX, MY, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    lm = (lm > 0.5).astype(np.float32)
    true = cv2.resize(lm, (bx1 - bx0, by1 - by0), interpolation=cv2.INTER_AREA)[..., None]
    sh = np.zeros_like(true)
    sh[6:, 4:] = true[:-6, :-4]
    # the dashed lines from the four badges to Pearl Harbor (16 on, 12 off, 7 wide, round caps), redrawn over the patch
    tx, ty = 960 + (-157.97 + 157.53) * KLAT * K, 600 - (21.40 - 20.57) * K

    def dashes(d):
        for ex, ey in ((560, 300), (1360, 300), (560, 900), (1360, 900)):
            L = math.hypot(tx - ex, ty - ey)
            ux, uy = (tx - ex) / L, (ty - ey) / L
            s = 0.0
            while s < L:
                e = min(L, s + 16)
                p0 = ((ex + ux * s - bx0) * S, (ey + uy * s - by0) * S)
                p1 = ((ex + ux * e - bx0) * S, (ey + uy * e - by0) * S)
                d.line([p0, p1], fill=255, width=7 * S)
                for px_, py_ in (p0, p1):
                    d.ellipse([px_ - 3.5 * S, py_ - 3.5 * S, px_ + 3.5 * S, py_ + 3.5 * S], fill=255)
                s += 28
    dm = mask(dashes)
    patch = A[by0:by1, bx0:bx1].copy()
    noise = rng.normal(0, 1.2, patch.shape[:2])[..., None]
    patch = patch * (1 - old) + (SEA + noise) * old
    patch = patch * (1 - sh) + LAND_D * sh
    patch = patch * (1 - true) + (LAND + noise * 0.5) * true
    patch = patch * (1 - dm * old) + TEAL * dm * old
    Bimg = A.copy()
    Bimg[by0:by1, bx0:bx1] = patch
    Image.fromarray(np.clip(A, 0, 255).astype(np.uint8)).save(os.path.join(OUT, 'card_A.png'))
    Image.fromarray(np.clip(Bimg, 0, 255).astype(np.uint8)).save(os.path.join(OUT, 'card_B.png'))
    hx = '#%02x%02x%02x' % tuple(int(round(v)) for v in edge)
    json.dump({'edge': hx, 'source': src}, open(os.path.join(OUT, 'card_info.json'), 'w'))
    print('card_A/B', hx)


if __name__ == '__main__':
    {'card': card}[sys.argv[1]]()
