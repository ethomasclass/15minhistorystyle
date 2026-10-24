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
    # Episode 3 portraits
    "grant1869": ("img/ch03/grant_president_portrait_1869.jpg", None, "isnet-general-use"),
    "grant1873": ("img/ch03/grant_president_1873.jpg", None, "isnet-general-use"),
    "ames_miss": ("img/ch07/ames_hon_adelbert_ames_of_miss_brady_handy.jpg", None, "isnet-general-use", [(1600, 900, 2343, 2050)]),
    "ames_gen": ("img/ch07/ames_maj_gen_brady_1860s.jpg", None, "isnet-general-use"),
    "pierrepont": ("img/ch07/pierrepont_attorney_general_brady_handy.jpg", None, "isnet-general-use"),
    "douglass": ("img/ch06/douglass_brady_1877.jpg", None, "u2net_human_seg"),
    "babcock": ("img/ch05/babcock_orville_portrait.jpg", None, "isnet-general-use"),
    "hayes": ("img/ch08/hayes_president_brady.jpg", None, "isnet-general-use"),
    # Episode 2 portraits
    "revels": ("img/ch01/revels_brady_handy_1870.jpg", (600, 700, 2545, 2950), "isnet-general-use"),
    "davis1859": ("img/ch01/jefferson_davis_1859_brady.jpg", None, "isnet-general-use"),
    "grant": ("img/ch05/grant_brady_nara_526674.jpg", None, "isnet-general-use"),
    "ames": ("img/ch07/ames_senator_brady_handy.jpg", (250, 300, 1560, 3000), "isnet-general-use"),
    "stanton_cdv": ("img/ch04/stanton_secretary_of_war.jpg", None, "isnet-general-use"),
    "lynch": ("img/ch06/john_r_lynch_mississippi_eminent_colored_men_1884.jpg", None, "isnet-general-use"),
    "smalls": ("img/ch06/robert_smalls_brady_handy.jpg", None, "isnet-general-use"),
    # Episode 1 portraits (one subject each)
    "sherman": ("img/ch02/sherman_brady_1865.jpg", None, "isnet-general-use"),
    "stanton": ("img/ch02/stanton_brady_handy.jpg", (300, 600, 2248, 3000), "isnet-general-use", [(900, 600, 1000, 900), (1340, 600, 1440, 900)]),
    "lincoln": ("img/ch04/lincoln_gardner_feb1865.jpg", None, "isnet-general-use"),
    "booth": ("img/ch04/booth_carte_de_visite_1865.jpg", None, "isnet-general-use"),
    "seward": ("img/ch04/seward_brady.jpg", None, "isnet-general-use"),
    "johnson": ("img/ch05/andrew_johnson_portrait_1865.jpg", (40, 40, 900, 1322), "isnet-general-use"),
    "howard": ("img/ch05/oliver_otis_howard_portrait.jpg", None, "isnet-general-use"),
    "stevens": ("img/ch05/thaddeus_stevens_brady_handy.jpg", None, "isnet-general-use"),
    "dred_scott": ("img/ch08/dred_scott_photograph_c1857.jpg", None, "isnet-general-use"),
    "jdavis": ("img/ch09/jefferson_davis_brady_c1860.jpg", None, "isnet-general-use"),
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
    # fill holes inside the figure (a white shirt front, a gap at the elbow), or the trace draws little inner loops
    inv = cv2.bitwise_not(m)
    nh, labh, statsh, _ = cv2.connectedComponentsWithStats(inv)
    for k in range(1, nh):
        x, y, w, h = statsh[k, :4]
        if x > 0 and y > 0 and x + w < m.shape[1] and y + h < m.shape[0]:   # touches no edge: a hole, not background
            m[labh == k] = 255
    save(name, im.size, {"subject": m})


if __name__ == "__main__":
    names = sys.argv[1:] or list(JOBS)
    for n in names:
        print(n)
        run(n, *JOBS[n])
