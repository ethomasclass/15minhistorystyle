"""Masks for the coral-tint + teal-trace look, made locally with rembg (no Gemini needed).

  python3 tools/mask.py [name ...]     # all, or just the named ones

Setup: pip install rembg onnxruntime opencv-python-headless pillow numpy  (first run downloads the isnet model).

Each job cuts the subject out of a crop of the source image (x0, y0, x1, y1 in source pixels), pastes the
cut-out's alpha back at full size, and writes public/img/masks/<name>_subject(_a).png + <name>.json
(outlines for Traced) via tools/trace.py.
"""
import os, sys
import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from trace import clean, save  # noqa: E402

PUB = os.path.join(HERE, "..", "public")
JOBS = {
    # name: (source in public/, crop box (x0, y0, x1, y1) in source pixels or None for the whole image, rembg model,
    #        then optionally a min area in px (int) and/or cut rects (a list of (x0, y0, x1, y1) to remove), in either order)
    # A figure fused to a prop (hands on a table, a tray in front): add cut rects, and if it still separates badly,
    # delete its layers so Parallax falls back to a flat camera move (Dressed to Kill: library, Matilda, workshop).
    # Crop to one figure when the picture has several people; the largest piece of the cut-out is kept.
    # Forever Free (Civil War series, Video 2)
    "smalls": ("img/ch01/smalls_congressman_portrait_c1870s.jpg", None, "u2net_human_seg"),
    "smalls_1862": ("img/ch01/smalls_harpers_planter_page_1862.jpg", (300, 720, 1240, 1900), "isnet-general-use"),
    "butler": ("img/ch02/butler_portrait_later_c1870s.jpg", None, "u2net_human_seg", [(1300, 2050, 2219, 3000), (0, 2450, 420, 3000), (1550, 1700, 2219, 2100)]),
    "mcclellan": ("img/ch03/mcclellan_portrait_gutekunst_c1863.jpg", None, "u2net_human_seg"),
    "taney": ("img/ch03/taney_portrait_c1855.jpg", None, "u2net_human_seg"),
    "lincoln_tent": ("img/ch03/lincoln_mcclellan_antietam_tent_1862.jpg", (1470, 1040, 1680, 1700), "u2net_human_seg"),
    "greeley": ("img/ch04/greeley_portrait_hat_c1860s.jpg", None, "u2net_human_seg"),
    "lincoln_reading": ("img/ch04/first_reading_emancipation_ritchie_1866.jpg", (860, 740, 1380, 1740), "u2net_human_seg"),
    "barton": ("img/ch04/clara_barton_portrait_c1870.jpg", None, "u2net_human_seg"),
    "dix": ("img/ch04/dorothea_dix_portrait_c1861.jpg", None, "u2net_human_seg"),
    "douglass": ("img/ch07/douglass_portrait_seated_1864.jpg", None, "u2net_human_seg"),
    "sully": ("img/demo/sully_jackson_1845.jpg", None, "isnet-general-use"),
    # "clay": ("img/clay_jouett.jpg", None, "isnet-general-use"),
    # "voters_a": ("img/gen/ch05_new_voters.png", (80, 120, 420, 850), "isnet-general-use"),
}


def run(name, src, box, model, *opts, sessions={}):
    min_area = next((o for o in opts if isinstance(o, int)), 20000)
    cut = next((o for o in opts if isinstance(o, (list, tuple))), None)
    im = Image.open(os.path.join(PUB, src)).convert("RGB")
    crop = im.crop(box) if box else im
    small = crop.copy()
    small.thumbnail((1600, 1600))
    if model not in sessions:
        sessions[model] = new_session(model)
    a = np.asarray(remove(small, session=sessions[model]).split()[-1].resize(crop.size, Image.LANCZOS))
    full = np.zeros((im.height, im.width), np.uint8)
    x0, y0 = (box[0], box[1]) if box else (0, 0)
    full[y0:y0 + crop.height, x0:x0 + crop.width] = (a > 128).astype(np.uint8) * 255
    for x0c, y0c, x1c, y1c in cut or []:   # optional rectangles to remove (a tray, a table, a book merged with the figure)
        full[y0c:y1c, x0c:x1c] = 0
    m = clean(full, close=9, min_area=min_area)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    if n > 2:                        # keep only the biggest piece (the subject)
        big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        m = ((lab == big) * 255).astype(np.uint8)
    save(name, im.size, {"subject": m})


if __name__ == "__main__":
    names = sys.argv[1:] or list(JOBS)
    for n in names:
        print(n)
        run(n, *JOBS[n])
