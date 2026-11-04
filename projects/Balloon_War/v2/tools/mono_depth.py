"""Depth Anything V2 (small, ONNX) on an image -> 16-bit depth PNG (near = bright), plus a check against sparse
stereo disparities if a matches .npy is given.
usage: mono_depth.py model.onnx image out.png [matches.npy]"""
import sys, numpy as np, cv2, onnxruntime as ort
model, img, out = sys.argv[1:4]
im = cv2.imread(img, cv2.IMREAD_COLOR); H, W = im.shape[:2]
sess = ort.InferenceSession(model, providers=['CPUExecutionProvider'])
inp = sess.get_inputs()[0]
S = 518 * 2  # multiple of 14
sc = S / max(H, W); w = int(round(W * sc / 14)) * 14; h = int(round(H * sc / 14)) * 14
x = cv2.resize(cv2.cvtColor(im, cv2.COLOR_BGR2RGB), (w, h), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255
x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
x = x.transpose(2, 0, 1)[None].astype(np.float32)
d = sess.run(None, {inp.name: x})[0].squeeze()
d = cv2.resize(d, (W, H), interpolation=cv2.INTER_CUBIC)
d = (d - d.min()) / (d.max() - d.min())
cv2.imwrite(out, (d * 65535).astype(np.uint16))
cv2.imwrite(out.replace('.png', '_preview.jpg'), cv2.resize((d * 255).astype(np.uint8), None, fx=0.35, fy=0.35))
if len(sys.argv) > 4:
    m = np.load(sys.argv[4])  # rows: x, y (left image px), disparity
    v = d[m[:, 1].astype(int).clip(0, H - 1), m[:, 0].astype(int).clip(0, W - 1)]
    from scipy.stats import spearmanr
    print('spearman(mono depth, stereo disparity) = %.3f over %d points' % (spearmanr(v, m[:, 2]).correlation, len(m)))
