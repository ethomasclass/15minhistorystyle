"""Quick look at masks before building scenes: B&W picture, coral subject, teal outline, side by side.

  python3 tools/mask_preview.py out/masks.jpg landis_street landis_desk     # or no names for every mask job
"""
import os, sys
import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from layers import jobs, PUB  # noqa: E402

CORAL, TEAL = np.array([255, 111, 97]), (196, 224, 47)   # TEAL in BGR for cv2


def tile(name, src, h=520):
    im = Image.open(os.path.join(PUB, src)).convert("L")
    m = Image.open(os.path.join(PUB, "img", "masks", name + "_subject.png")).convert("L").resize(im.size)
    w = int(im.width * h / im.height)
    g = np.asarray(im.resize((w, h))).astype(np.float32)[..., None].repeat(3, 2)
    a = (np.asarray(m.resize((w, h))) > 128)
    out = g.copy()
    out[a] = g[a] * 0.45 + CORAL * 0.55 * (g[a] / 255 * 0.6 + 0.4)
    out = np.ascontiguousarray(out.astype(np.uint8)[..., ::-1])
    cs, _ = cv2.findContours(a.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(out, cs, -1, TEAL, 3)
    cv2.putText(out, name, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
    return out[..., ::-1]


if __name__ == "__main__":
    J = jobs()
    dest, names = sys.argv[1], sys.argv[2:] or [n for n in J if os.path.exists(os.path.join(PUB, "img", "masks", n + "_subject.png"))]
    tiles = [tile(n, J[n][0]) for n in names]
    rows, row, wsum = [], [], 0
    for t in tiles:                      # wrap at ~2400 px wide
        if row and wsum + t.shape[1] > 2400:
            rows.append(row); row, wsum = [], 0
        row.append(t); wsum += t.shape[1]
    rows.append(row)
    W = max(sum(t.shape[1] for t in r) for r in rows)
    sheet = np.zeros((520 * len(rows), W, 3), np.uint8)
    for i, r in enumerate(rows):
        x = 0
        for t in r:
            sheet[i * 520:(i + 1) * 520, x:x + t.shape[1]] = t; x += t.shape[1]
    os.makedirs(os.path.dirname(dest) or ".", exist_ok=True)
    Image.fromarray(sheet).save(dest, quality=88)
    print(dest, sheet.shape[1], "x", sheet.shape[0])
