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
    "landis_street": ("img/ch01/landis_street_1924_crop.jpg", (850, 400, 2600, 2430), "isnet-general-use"),
    "hulbert": ("img/ch03/william_hulbert_1870s.jpg", None, "u2net_human_seg"),
    "klem": ("img/ch04/bill_klem_umpire_1914_b.jpg", None, "isnet-general-use"),
    "klem_full": ("img/ch04/bill_klem_umpire_1914.jpg", None, "isnet-general-use"),
    "chase": ("img/ch05/hal_chase_1917.jpg", None, "isnet-general-use"),
    "chase_full": ("img/ch05/hal_chase_1914.jpg", None, "isnet-general-use"),
    "mathewson": ("img/ch05/christy_mathewson_reds_bain_1916.jpg", None, "isnet-general-use"),
    "heydler": ("img/ch05/john_heydler_bain_c1918.jpg", None, "isnet-general-use"),
    "jackson": ("img/ch06/joe_jackson_cleveland_1911.jpg", None, "u2net_human_seg"),
    "jackson_bat": ("img/ch06/joe_jackson_white_sox_1920.jpg", None, "isnet-general-use"),
    "cicotte": ("img/ch06/eddie_cicotte_1917.jpg", None, "isnet-general-use"),
    "cicotte_pitch": ("img/ch06/eddie_cicotte_1914.jpg", None, "isnet-general-use"),
    "gandil": ("img/ch06/chick_gandil_harris_ewing_c1913.jpg", None, "isnet-general-use"),
    "comiskey": ("img/ch06/charles_comiskey_1914.jpg", None, "isnet-general-use"),
    "rothstein": ("img/ch06/arnold_rothstein_desk_c1915.jpg", None, "isnet-general-use"),
    "rath": ("img/ch06/morrie_rath_reds_1919.jpg", None, "isnet-general-use"),
    "weaver": ("img/ch07/buck_weaver_1917.jpg", None, "u2net_human_seg"),
    "landis_1907": ("img/ch07/landis_judge_seated_1907.jpg", None, "isnet-general-use"),
    "catcher_ci": ("img/ch02/currier_ives_american_national_game_1866.jpg", (1040, 1800, 1290, 2260), "isnet-general-use"),
    "jackson_1919": ("img/ch06/joe_jackson_1919.jpg", None, "u2net_human_seg"),
    "jackson_c1920": ("img/ch06/joe_jackson_c1920.jpg", None, "u2net_human_seg"),
    "landis_desk": ("img/ch01/landis_commissioner_bain_1920s.jpg", (400, 1900, 3300, 4500), "isnet-general-use"),
    # "voters_a": ("img/gen/ch05_new_voters.png", (80, 120, 420, 850), "isnet-general-use"),
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
