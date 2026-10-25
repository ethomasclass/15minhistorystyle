# refine sample masks: --only / --add polygons, fill holes, close, smooth; re-save via ep1/tools/trace.py
import sys, json, argparse, cv2, numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, "/home/user/15minhistorystyle/projects/American_West/ep1/tools")
import trace as T
M = "/home/user/15minhistorystyle/projects/American_West/ep1/public/img/masks/"
ap = argparse.ArgumentParser(); ap.add_argument("name"); ap.add_argument("--only"); ap.add_argument("--add"); ap.add_argument("--sub")
ap.add_argument("--close", type=int, default=9); ap.add_argument("--smooth", type=int, default=3); a = ap.parse_args()
m = np.asarray(Image.open(M + a.name + "_subject.png").convert("L")) > 127
size = (m.shape[1], m.shape[0])
def polys(p):
    im = Image.new("L", size, 0); d = ImageDraw.Draw(im)
    for q in json.load(open(p)): d.polygon([tuple(x) for x in q], fill=255)
    return np.asarray(im) > 127
if a.only: m = polys(a.only)
if a.add: m = m | polys(a.add)
if a.sub: m = m & ~polys(a.sub)
m = m.astype(np.uint8) * 255
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (a.close, a.close)))
h, w = m.shape; fl = cv2.copyMakeBorder(m, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=0)
cv2.floodFill(fl, np.zeros((h + 4, w + 4), np.uint8), (0, 0), 255); m = m | cv2.bitwise_not(fl[1:-1, 1:-1])
if a.smooth: m = (cv2.GaussianBlur(m, (0, 0), a.smooth) > 127).astype(np.uint8) * 255
n, lab, st, _ = cv2.connectedComponentsWithStats(m)
if n > 2: m = ((lab == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))) * 255).astype(np.uint8)
T.save(a.name, size, {"subject": m})
