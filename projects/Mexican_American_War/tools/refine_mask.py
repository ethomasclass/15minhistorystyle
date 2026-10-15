"""Clean up a subject mask after tools/mask.py (or replace it with a hand trace), then re-save outlines and alpha.

  python3 tools/refine_mask.py polk                         # fill holes, close gaps, drop specks, smooth the edge
  python3 tools/refine_mask.py polk --close 25 --smooth 6   # stronger
  python3 tools/refine_mask.py houston --add tools/traces/houston_cloak.json   # union with hand-traced polygons
  python3 tools/refine_mask.py santa_anna --keep tools/traces/santa_anna_oval.json   # clip to the portrait's oval
  python3 tools/refine_mask.py huddle_santa_anna --only tools/traces/huddle_santa_anna.json  # the trace alone

A trace file is JSON: a list of polygons, each a list of [x, y] points in source pixels.
Check the result with a close-up, not just the contact sheet:  python3 tools/mask_closeup.py out/x.jpg polk
"""
import argparse, json, os, sys
import cv2
import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import trace as T  # noqa: E402
from layers import jobs  # noqa: E402

PUB = os.path.join(HERE, "..", "public")


def polys(path, size):
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    for p in json.load(open(path)):
        d.polygon([tuple(q) for q in p], fill=255)
    return np.asarray(m)


def fill_holes(m):
    # pad first, so background cut off from the corner by a subject touching two edges still counts as outside
    h, w = m.shape
    flood = cv2.copyMakeBorder(m, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=0)
    cv2.floodFill(flood, np.zeros((h + 4, w + 4), np.uint8), (0, 0), 255)
    return m | cv2.bitwise_not(flood[1:-1, 1:-1])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("name")
    ap.add_argument("--close", type=int, default=15, help="closing kernel (px): bridges ragged gaps along the edge")
    ap.add_argument("--smooth", type=float, default=4, help="edge blur sigma (px) before re-thresholding")
    ap.add_argument("--add", action="append", default=[], help="trace file to add")
    ap.add_argument("--sub", action="append", default=[], help="trace file to cut away")
    ap.add_argument("--keep", help="trace file: keep only what lies inside it (e.g. a portrait's oval)")
    ap.add_argument("--only", help="use this trace file instead of the current mask")
    a = ap.parse_args()
    src = jobs()[a.name][0]
    size = Image.open(os.path.join(PUB, src)).size
    if a.only:
        m = polys(a.only, size)
    else:
        m = np.asarray(Image.open(os.path.join(PUB, "img", "masks", f"{a.name}_subject.png")).convert("L"))
        m = ((m > 127) * 255).astype(np.uint8)
    for f in a.add:
        m = np.maximum(m, polys(f, size))
    if a.close:
        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (a.close, a.close))
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, k)
    m = fill_holes(m)
    for f in a.sub:
        m = np.minimum(m, 255 - polys(f, size))
    if a.keep:
        m = np.minimum(m, polys(a.keep, size))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    if n > 2:  # keep the subject, drop specks
        big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        m = ((lab == big) * 255).astype(np.uint8)
    if a.smooth:
        m = ((cv2.GaussianBlur(m.astype(np.float32), (0, 0), a.smooth) > 127) * 255).astype(np.uint8)
    T.save(a.name, size, {"subject": m})


if __name__ == "__main__":
    main()
