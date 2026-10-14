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
    # When Europe Ate Mummies: AI paintings (1376 x 768) and portraits
    "seep_man": ("img/ai/ch02_bitumen_seep.jpg", (650, 220, 970, 670), "isnet-general-use"),
    "translator": ("img/ai/ch02_translator.jpg", (320, 140, 830, 768), "isnet-general-use"),
    "tomb_bundle": ("img/ai/ch03_tomb_night.jpg", (390, 480, 820, 650), "isnet-general-use"),
    "dealer": ("img/ai/ch04_dealer_storeroom.jpg", (670, 230, 890, 750), "isnet-general-use"),
    "apothecary": ("img/ai/ch03_apothecary_grinding.jpg", (410, 230, 750, 530), "isnet-general-use"),
    "oven_bundles": ("img/ai/ch04_oven_fakes.jpg", (150, 380, 520, 560), "u2net"),
    "party_bundle": ("img/ai/ch07_unwrapping_party.jpg", (300, 395, 620, 520), "isnet-general-use"),
    "francis": ("img/ch04_trade/francis_i_of_france_oil_painting_wellcome.jpg", None, "isnet-general-use"),
    "paracelsus": ("img/ch04_trade/paracelsus_hirschvogel_woodcut_1538.jpg", None, "isnet-general-use"),
    "boyle": ("img/ch04_trade/robert_boyle_line_engraving_1696.jpg", None, "isnet-general-use"),
    "pare": ("img/ch05_fakes/ambroise_pare_woodcut_1582.jpg", None, "isnet-general-use"),
    "pomet": ("img/ch04_trade/pierre_pomet_portrait_1694.jpg", None, "isnet-general-use"),
    "charles": ("img/ch06_corpse_medicine/charles_ii_standing_engraving_sherwin.jpg", None, "isnet-general-use"),
    "montaigne": ("img/ch06_corpse_medicine/montaigne_engraving_saint_aubin_1774_met.jpg", None, "isnet-general-use"),
    "twain": ("img/ch08_america/mark_twain_abdullah_freres_1867_loc.jpg", None, "isnet-general-use"),
    # "clay": ("img/clay_jouett.jpg", None, "isnet-general-use"),
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
    m = clean(full, close=9, min_area=min(20000, int(crop.width * crop.height * 0.03)))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    if n > 2:                        # keep only the biggest piece (the subject)
        big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        m = ((lab == big) * 255).astype(np.uint8)
    save(name, im.size, {"subject": m})


if __name__ == "__main__":
    names = sys.argv[1:] or list(JOBS)
    for n in names:
        print(n)
        try:
            run(n, *JOBS[n])
        except Exception as e:  # keep going; report the failures at the end
            print("  FAILED", n, e)
