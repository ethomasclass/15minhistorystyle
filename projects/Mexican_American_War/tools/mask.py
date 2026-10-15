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
    # name: (source in public/, crop box (x0, y0, x1, y1) in source pixels or None for the whole image, rembg model[, min area px])
    # Crop to one figure when the picture has several people; the largest piece of the cut-out is kept.
    "sully": ("img/demo/sully_jackson_1845.jpg", None, "isnet-general-use"),
    # The Exact Spot (Flow engravings, 1376x768 unless noted)
    "settlers_enslaved": ("img/gen/ch02_settlers_arrive.jpg", (870, 350, 1265, 690), "isnet-general-use"),
    "corkleg_soldier": ("img/gen/ch06_cork_leg.jpg", (585, 85, 1000, 650), "isnet-general-use"),
    "corkleg_leg": ("img/gen/ch06_cork_leg.jpg", (640, 370, 1005, 610), "isnet-general-use", 3000),  # hand-traced: tools/traces/ (see README there), do not re-run
    "rider": ("img/gen/ch05_rider.jpg", (175, 30, 1010, 768), "isnet-general-use"),
    "tejano_rancher": ("img/gen/ch02_tejano_ranch.jpg", (480, 290, 860, 680), "isnet-general-use", 5000),
    "jail_austin": ("img/gen/ch03_austin_jail.jpg", (660, 195, 990, 690), "isnet-general-use"),  # hand-traced: tools/traces/ (see README there), do not re-run
    "gonzales_cannon": ("img/gen/ch03_come_and_take_it.jpg", (430, 440, 790, 700), "isnet-general-use"),  # hand-traced: tools/traces/ (see README there), do not re-run
    "gonzales_flag": ("img/gen/ch03_come_and_take_it.jpg", (345, 10, 575, 215), "isnet-general-use", 3000),  # hand-traced: tools/traces/ (see README there), do not re-run
    "signer": ("img/gen/ch03_washington_on_the_brazos.jpg", (525, 315, 775, 480), "isnet-general-use", 3000),
    "santa_anna": ("img/ch03/santa_anna.jpg", (230, 430, 1340, 1880), "u2net_human_seg"),
    "alamo_chapel": ("img/gen/ch04_alamo_dawn.jpg", (588, 185, 815, 290), "isnet-general-use"),  # hand-traced: tools/traces/ (see README there), do not re-run
    "huddle_santa_anna": ("img/ch04/huddle_surrender.jpg", (595, 400, 712, 712), "isnet-general-use", 3000),  # hand-traced: tools/traces/ (see README there), do not re-run
    "cartoon_santa_anna": ("img/ch04/cartoon_capture_1836.jpg", (1150, 740, 2200, 2100), "isnet-general-use"),
    "houston": ("img/ch04/houston_1855.jpg", (150, 100, 1620, 2000), "isnet-general-use"),  # hand-traced: tools/traces/ (see README there), do not re-run
    "gast_columbia": ("img/ch05/gast_american_progress.jpg", (940, 170, 1830, 1290), "isnet-general-use"),
    "camp_matamoros": ("img/gen/ch05_rio_grande_camp.jpg", (0, 90, 1184, 205), "isnet-general-use"),  # hand-traced: tools/traces/ (see README there), do not re-run
    "ambush_dragoons": ("img/gen/ch05_ambush.jpg", (400, 180, 1045, 520), "isnet-general-use"),  # hand-traced: tools/traces/ (see README there), do not re-run
    "chapultepec_castle": ("img/ch06/chapultepec_1849.jpg", (550, 245, 1245, 455), "isnet-general-use"),  # hand-traced: tools/traces/ (see README there), do not re-run
    "blockade_steamer": ("img/gen/ch06_blockade.jpg", (405, 220, 1215, 690), "isnet-general-use"),  # hand-traced: tools/traces/ (see README there), do not re-run
    # archival portraits
    "grant": ("img/ch06/grant.jpg", None, "u2net_human_seg"),
    "lee": ("img/ch06/lee.jpg", None, "u2net_human_seg"),
    "jackson": ("img/ch06/jackson.jpg", None, "u2net_human_seg"),
    "lincoln": ("img/ch01/lincoln_shepherd_1846.jpg", None, "u2net_human_seg"),
    "polk": ("img/ch01/polk_brady_1849.jpg", None, "u2net_human_seg"),
    "austin": ("img/ch02/austin_1836.jpg", None, "u2net_human_seg"),
    # "clay": ("img/clay_jouett.jpg", None, "isnet-general-use"),
    # "voters_a": ("img/gen/ch05_new_voters.png", (80, 120, 420, 850), "isnet-general-use"),
}


def run(name, src, box, model, min_area=20000, sessions={}):
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
