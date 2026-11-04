"""Fill thin light lines inside black silhouette figures (rim light, fold lines, face hints), so every figure is solid black.

  python3 tools/sil_solidify.py in.jpg out.jpg [--width=7] [--dark=0.16] [--show=diff.jpg]

A pixel is filled with ink when it is lighter than `dark` but a closing of the dark mask (a disc `width` px wide) covers it, i.e.
it is a thin light line or gap with black on both sides. Wide light areas (sky, lamp pools, paper) are untouched.
"""
import sys
import cv2
import numpy as np

def main():
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    o = dict(x[2:].split('=') for x in sys.argv[1:] if x.startswith('--'))
    width = int(o.get('width', 7)); dark = float(o.get('dark', 0.16))
    im = cv2.imread(a[0])
    L = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(float) / 255
    m = (L < dark).astype(np.uint8)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (width, width))
    closed = cv2.morphologyEx(m, cv2.MORPH_CLOSE, k)
    fill = (closed > 0) & (m == 0)
    # soften: feather the fill edge by 1 px
    out = im.copy()
    ink = np.array([9, 12, 13], np.uint8)  # BGR of #0d0c09
    out[fill] = ink
    cv2.imwrite(a[1], out, [cv2.IMWRITE_JPEG_QUALITY, 95])
    if 'show' in o:
        vis = im.copy(); vis[fill] = (60, 60, 255)
        cv2.imwrite(o['show'], vis)
    print(a[0], 'filled px:', int(fill.sum()))

if __name__ == '__main__':
    main()
