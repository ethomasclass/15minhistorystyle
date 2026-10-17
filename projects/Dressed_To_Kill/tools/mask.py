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
    # name: (source in public/, crop box (x0, y0, x1, y1) in source pixels or None for the whole image, rembg model[, cut rects])
    # Crop to one figure when the picture has several people; the largest piece of the cut-out is kept.
    "sully": ("img/demo/sully_jackson_1845.jpg", None, "isnet-general-use"),
    # Dressed to Kill: silhouette paintings (1376x768) — one figure each, for parallax layers
    "g_library": ("img/gen/ch01_library_1874.jpg", (150, 120, 505, 768), "isnet-general-use", [(425, 388, 505, 768), (486, 230, 505, 388)]),
    "g_ballroom": ("img/gen/ch03_ballroom_1862.jpg", (600, 200, 1000, 768), "isnet-general-use"),
    "g_matilda": ("img/gen/ch04_matilda_workbench.jpg", (180, 40, 720, 768), "isnet-general-use", [(330, 572, 720, 768), (500, 492, 720, 572)]),
    "g_workshop": ("img/gen/ch04_flower_workshop.jpg", (180, 80, 580, 540), "isnet-general-use", [(335, 432, 580, 540)]),
    "g_street": ("img/gen/ch04_turner_street_1862.jpg", (650, 420, 860, 768), "isnet-general-use"),
    "g_doctor": ("img/gen/ch04_limehouse_room.jpg", (1000, 160, 1260, 768), "isnet-general-use"),
    "g_chemist": ("img/gen/ch06_chemist_testing.jpg", (650, 40, 1376, 768), "isnet-general-use", [(650, 548, 990, 768), (820, 462, 960, 548)]),
    "g_emma": ("img/gen/ch06_emma_bedroom.jpg", (620, 170, 1130, 768), "isnet-general-use"),
    "g_farmer": ("img/gen/ch07_potato_field.jpg", (900, 80, 1180, 768), "isnet-general-use"),
    # Dressed to Kill: archival subjects
    "waltz_lady": ("img/ch03/arsenic_waltz_punch_1862.jpg", (40, 400, 1500, 2150), "isnet-general-use"),
    "waltz_man": ("img/ch03/arsenic_waltz_punch_1862.jpg", (1450, 200, 2850, 2050), "isnet-general-use"),
    "morris": ("img/ch05/william_morris_hollyer_c1887.jpg", None, "isnet-general-use"),
    "draper": ("img/ch06/draper_portrait_burrage_1923.jpg", None, "isnet-general-use"),
    "kedzie": ("img/ch06/kedzie_portrait_beal_1915.jpg", (0, 0, 850, 1230), "isnet-general-use"),
    "dress": ("img/ch03/met_green_silk_dress_1868.jpg", None, "isnet-general-use"),
    "scheele": ("img/ch02/scheele_scheffner_engraving.png", None, "isnet-general-use"),
    # "clay": ("img/clay_jouett.jpg", None, "isnet-general-use"),
    # "voters_a": ("img/gen/ch05_new_voters.png", (80, 120, 420, 850), "isnet-general-use"),
}


def run(name, src, box, model, cut=None, sessions={}):
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
    m = clean(full, close=9, min_area=20000)
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
