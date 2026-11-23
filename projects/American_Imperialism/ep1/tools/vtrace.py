# Trace a period image (photo or engraving) into flat vector shapes, so real people in the vector style still come from
# period images (the channel's rule). The picture is blurred, split into a few tone bands, and each band becomes one
# smoothed SVG path (even-odd fill, so holes stay holes). Darkest colour first, lightest last.
#   from vtrace import trace
#   svg, (w, h) = trace('img/raw/loc_jefferson_1887.jpg', crop=(150, 230, 900, 1290), colors=[INK, TEAL_D, CREAM], width=520)
import cv2
import numpy as np


def _path(mask, k, eps, min_area=6):
    cs, hier = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    d = []
    for c in cs:
        if cv2.contourArea(c) < min_area:
            continue
        c = cv2.approxPolyDP(c, eps, True)[:, 0, :].astype(float) * k
        if len(c) < 3:
            continue
        # quadratic curves through the midpoints: smooth, still flat-shaded
        mids = (c + np.roll(c, -1, axis=0)) / 2
        s = f'M{mids[-1][0]:.1f},{mids[-1][1]:.1f}'
        for p, m in zip(c, mids):
            s += f'Q{p[0]:.1f},{p[1]:.1f} {m[0]:.1f},{m[1]:.1f}'
        d.append(s + 'z')
    return ''.join(d)


def trace(path, crop=None, colors=('#111111', '#1fae98', '#F4EFE6'), width=520, work=360, blur=5, cuts=None, eps=1.1, invert=False, min_area=6, clahe=0.0):
    """returns (svg group string, (width, height)); cuts are the tone thresholds as percentiles of the crop"""
    im = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if crop:
        x0, y0, x1, y1 = crop
        im = im[y0:y1, x0:x1]
    if invert:
        im = 255 - im
    h0, w0 = im.shape
    s = work / w0
    im = cv2.resize(im, (work, int(h0 * s)), interpolation=cv2.INTER_AREA)
    if clahe:                                  # local contrast, for soft, low-contrast photos (a vignette, a faded print)
        im = cv2.createCLAHE(clipLimit=clahe, tileGridSize=(6, 6)).apply(im)
    im = cv2.bilateralFilter(im, 9, 40, 9)
    im = cv2.GaussianBlur(im, (blur, blur), 0)
    n = len(colors)
    cuts = cuts or [100 * (i + 1) / n for i in range(n - 1)]
    th = np.percentile(im, cuts)
    k = width / work
    H = int(im.shape[0] * k)
    out = f'<rect width="{width}" height="{H}" fill="{colors[0]}"/>'
    for col, t in zip(colors[1:], th):
        m = (im >= t).astype(np.uint8) * 255
        m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((2, 2), np.uint8))
        out += f'<path d="{_path(m, k, eps, min_area)}" fill="{col}" fill-rule="evenodd"/>'
    return out, (width, H)


def trace_ink(path, crop, width, color, thresh=110, work=900, eps=0.8):
    """a dark-on-light drawing (a signature, a seal) as one filled path in `color`"""
    im = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    x0, y0, x1, y1 = crop
    im = im[y0:y1, x0:x1]
    s = work / im.shape[1]
    im = cv2.resize(im, (work, int(im.shape[0] * s)), interpolation=cv2.INTER_CUBIC)
    m = (cv2.GaussianBlur(im, (3, 3), 0) < thresh).astype(np.uint8) * 255
    k = width / work
    return f'<path d="{_path(m, k, eps)}" fill="{color}" fill-rule="evenodd"/>', (width, int(im.shape[0] * k))
