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
    # name: (source in public/, crop box (x0, y0, x1, y1) in source pixels or None for the whole image, rembg model)
    # Crop to one figure when the picture has several people; the largest piece of the cut-out is kept.
    "sully": ("img/demo/sully_jackson_1845.jpg", None, "isnet-general-use"),
    # "clay": ("img/clay_jouett.jpg", None, "isnet-general-use"),
    # "voters_a": ("img/gen/ch05_new_voters.png", (80, 120, 420, 850), "isnet-general-use"),
    "rubber_tank": ("img/ch03_fake/rubber_tank_side_view_anzio_1944.jpg", None, "isnet-general-use"),
    "alturas": ("img/ch04_paper_balloon/fugo_inflated_alturas_sc226135.jpg", None, "isnet-general-use"),
    "collapsed": ("img/ch04_paper_balloon/collapsed_balloon_on_ground_nara285257.jpg", None, "isnet-general-use"),
    "woodson": ("img/ch02_protector/waverly_woodson_portrait_1940s.jpg", None, "u2net_human_seg"),
    "lst388_balloon": ("img/ch02_protector/lst388_beached_under_balloon_80g252794.jpg", (1300, 420, 2100, 1000), "isnet-general-use"),
    "u2_balloon": ("img/ch01_look_up/balloon_from_u2_cockpit_2023.jpg", (1150, 1150, 1850, 1850), "isnet-general-use"),
    "f22": ("img/ch01_look_up/f22_takeoff_2023.jpg", None, "isnet-general-use"),
    "navy_envelope": ("img/ch01_look_up/navy_recovers_balloon_envelope_2023.jpg", None, "isnet-general-use"),
    "walk320": ("img/ch02_protector/320th_walk_balloon_to_winch_1944.jpg", None, "isnet-general-use"),
    "moffett": ("img/ch04_paper_balloon/moffett_balloon_inflated_hangar_1945.jpg", None, "isnet-general-use"),
    "medics": ("img/ch02_protector/medics_first_aid_utah_beach_1944.jpg", None, "isnet-general-use"),
    "dsc_medal": ("img/ch02_protector/woodson_dsc_omaha_2024.jpg", None, "isnet-general-use"),
    "two_tanks": ("img/ch03_fake/rubber_tank_beside_real_tank_anzio_1944.jpg", None, "isnet-general-use"),
    "place_tank": ("img/ch03_fake/soldiers_place_rubber_tank_anzio_1944.jpg", None, "isnet-general-use"),
    "gold_medal": ("img/ch03_fake/ghost_army_congressional_gold_medal.jpg", None, "isnet-general-use"),
    "sherman_lst": ("img/ch03_fake/m4_sherman_rolls_off_lst_utah_beach_1944.jpg", None, "isnet-general-use"),
}


def run(name, src, box, model, sessions={}):
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
