"""Depth maps and a clean background plate for DepthParallax (src/kit/depthparallax.tsx): real per-pixel depth
instead of two flat cards.

Needs only the subject mask from tools/mask.py (public/img/masks/<name>_subject.png). Runs two models locally as ONNX,
both Apache-2.0 (Depth Anything V2's Base/Large checkpoints are non-commercial: don't swap them in):
  LaMa                     paints the subject out of the picture, so the background can show where the subject was
  Depth Anything V2 Small  depth of the picture and of that plate
and writes
  public/img/depth/<name>_plate.jpg   the picture with the subject painted out
  public/img/depth/<name>_depth.png   R = depth of the subject (near-flat, so a figure moves as one piece)
                                      G = depth of the plate (the background)
                                      B = the subject mask (the subject layer's alpha)
                                      255 = near, 0 = far (relative inverse depth, which is what parallax displacement
                                      is proportional to)
  public/img/depth/<name>_depth.json  {"subject": the subject's depth 0..1, "size": [w, h] of the source}

  python3 tools/depth.py landis_street
  python3 tools/depth.py landis_street --res 770   # depth model input (multiple of 14); higher = finer edges, slower
"""
import argparse, json, os, sys
import cv2
import numpy as np
import onnxruntime as ort
from huggingface_hub import hf_hub_download
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from layers import jobs  # noqa: E402

PUB = os.path.join(HERE, "..", "public")
OUT = os.path.join(PUB, "img", "depth")
MEAN, STD = np.array([0.485, 0.456, 0.406]), np.array([0.229, 0.224, 0.225])
_sess = {}


def session(repo, file):
    if repo not in _sess:
        _sess[repo] = ort.InferenceSession(hf_hub_download(repo, file), providers=["CPUExecutionProvider"])
    return _sess[repo]


def depth(rgb, res):
    """Relative inverse depth at the picture's size (bigger = nearer), unnormalised."""
    h, w = rgb.shape[:2]
    s = res / min(h, w)
    ih, iw = max(14, round(h * s / 14) * 14), max(14, round(w * s / 14) * 14)
    x = cv2.resize(rgb, (iw, ih), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255
    x = ((x - MEAN) / STD).transpose(2, 0, 1)[None].astype(np.float32)
    d = session("onnx-community/depth-anything-v2-small", "onnx/model.onnx").run(None, {"pixel_values": x})[0][0]
    return cv2.resize(d, (w, h), interpolation=cv2.INTER_CUBIC)


def inpaint(rgb, hole):
    """LaMa at its fixed 512x512 over the whole picture, pasted back into the hole only. Only a strip of the fill beside
    the subject ever shows (as far as the camera slides), and archival backgrounds are usually soft, so 512 holds up;
    grain is added back so the fill matches the film."""
    h, w = rgb.shape[:2]
    x = cv2.resize(rgb, (512, 512), interpolation=cv2.INTER_AREA).astype(np.float32)[None].transpose(0, 3, 1, 2) / 255
    mk = (cv2.resize(hole, (512, 512), interpolation=cv2.INTER_AREA) > 0.01).astype(np.float32)[None, None]
    y = session("Carve/LaMa-ONNX", "lama_fp32.onnx").run(None, {"image": x, "mask": mk})[0][0].transpose(1, 2, 0)
    if y.max() <= 2:                                        # some exports return 0..1
        y = y * 255
    fill = cv2.resize(np.clip(y, 0, 255), (w, h), interpolation=cv2.INTER_CUBIC)
    grain = rgb.astype(np.float32) - cv2.GaussianBlur(rgb.astype(np.float32), (0, 0), 2)
    sd = float(np.std(grain[hole < 0.5])) if (hole < 0.5).any() else 4
    fill = fill + np.random.default_rng(1).normal(0, sd, (h, w, 1))
    a = cv2.GaussianBlur(hole, (0, 0), 3)[..., None]
    return np.clip(rgb * (1 - a) + fill * a, 0, 255).astype(np.uint8)


def run(name, src, res=518, work=1600, plate_max=2400):
    pic = Image.open(os.path.join(PUB, src)).convert("RGB")
    W, H = pic.size
    mask = Image.open(os.path.join(PUB, "img", "masks", name + "_subject.png")).convert("L")

    # the plate, at up to 2400 px (enough for a 1080p frame with a push)
    big = pic.copy()
    big.thumbnail((plate_max, plate_max), Image.LANCZOS)
    bm = np.asarray(mask.resize(big.size, Image.BILINEAR)) > 128
    g = max(9, big.width // 120) | 1                         # cover the mask's soft edge and any halo
    hole = cv2.dilate(bm.astype(np.uint8), np.ones((g, g), np.uint8)).astype(np.float32)
    plate = inpaint(np.asarray(big), hole)
    os.makedirs(OUT, exist_ok=True)
    Image.fromarray(plate).save(os.path.join(OUT, name + "_plate.jpg"), quality=92)

    # depth, at 1600 px (depth is smooth)
    small = big.copy()
    small.thumbnail((work, work), Image.LANCZOS)
    w, h = small.size
    im = np.asarray(small)
    pl = cv2.resize(plate, (w, h), interpolation=cv2.INTER_AREA)
    m = np.asarray(mask.resize((w, h), Image.BILINEAR)) > 128
    d_pic, d_plate = depth(im, res), depth(pl, res)
    # one scale for both: a robust range from the picture, and the plate fitted to it outside the subject (the model's
    # output is relative, so two runs can differ by a scale and shift)
    lo, hi = np.percentile(d_pic, 1), np.percentile(d_pic, 99.5)
    n_pic = np.clip((d_pic - lo) / (hi - lo), 0, 1)
    out = ~cv2.dilate(m.astype(np.uint8), np.ones((31, 31), np.uint8)).astype(bool)
    k, c = np.linalg.lstsq(np.stack([d_plate[out], np.ones(out.sum())], 1), n_pic[out], rcond=None)[0]
    n_plate = np.clip(d_plate * k + c, 0, 1)

    # the subject moves as one piece: its median depth with a trace of relief (wispy hair and edges read as far
    # because the model blends them with what's behind, and would slide off the figure)
    subj = float(np.median(n_pic[m])) if m.any() else 0.5
    n_fg = np.where(m, subj + np.clip((n_pic - subj) * 0.2, -0.015, 0.03), subj)   # outside: B says it's empty
    # the hole can still read as a faint ghost of the subject, and the ray march stretches pixels across any false
    # edge: replace the hole's depth with a smooth fill from around it, then grow near edges a few px so near pixels
    # occlude rather than smear
    hd = cv2.dilate(m.astype(np.uint8), np.ones((61, 61), np.uint8)).astype(np.float32)
    sig = w / 25
    fill = cv2.GaussianBlur(n_plate * (1 - hd), (0, 0), sig) / np.maximum(cv2.GaussianBlur(1 - hd, (0, 0), sig), 1e-4)
    a = cv2.GaussianBlur(hd, (0, 0), 12)
    n_plate = n_plate * (1 - a) + fill * a
    gd = max(3, w // 400) | 1
    n_plate = cv2.GaussianBlur(cv2.dilate(n_plate, np.ones((gd, gd), np.uint8)), (0, 0), gd / 2)

    edge = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.0)   # the exact mask, barely feathered
    rgb = np.dstack([n_fg * 255, n_plate * 255, edge * 255]).round().astype(np.uint8)
    Image.fromarray(rgb).save(os.path.join(OUT, name + "_depth.png"), optimize=True)
    json.dump({"subject": round(subj, 4), "size": [W, H]}, open(os.path.join(OUT, name + "_depth.json"), "w"))
    print("depth", name, f"plate {big.width}x{big.height}", f"depth {w}x{h}", f"subject={subj:.3f}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("names", nargs="+")
    ap.add_argument("--res", type=int, default=518)
    a = ap.parse_args()
    J = jobs()
    for n in a.names:
        run(n, J[n][0], a.res)
