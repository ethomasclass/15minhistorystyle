"""BW01 after sil_layers: put the drawn balloon and its shroud lines on the boys' plane straight from the painting, and clear
everything else in the balloon's box on that plane (the split smeared the balloon's lower edge onto fill)."""
import numpy as np
from PIL import Image
d = 'public/img/layers/sil/BW01_beach_dawn/'
src = np.asarray(Image.open('public/img/gen/scenes/2x/BW01_beach_dawn.jpg').convert('RGB')).astype(int)
L1 = np.asarray(Image.open(d + 'L1.webp').convert('RGBA')).copy()
cx, cy, R = 730, 524, 272                     # the balloon drawn by tools/round_balloon.py at (365, 262) d=272, x2
x0, x1, y0, y1 = cx - R - 12, cx + R + 12, cy - R - 12, cy + R + 70
r, g, b = src[..., 0], src[..., 1], src[..., 2]
coral = (r > 150) & (r - g > 45) & (r - b > 45)
lum = src.mean(-1)
yy, xx = np.mgrid[0:src.shape[0], 0:src.shape[1]]
inside = (xx - cx) ** 2 + (yy - cy) ** 2 <= (R + 2) ** 2
lines = (lum < 70) & (yy > cy + R * 0.6)        # shroud lines and the rope under the balloon
box = np.zeros(lum.shape, bool); box[y0:y1, x0:x1] = True
take = box & (inside | coral | lines)
L1[take, :3] = src[take]
L1[take, 3] = 255
L1[box & ~take & ~(lum < 70), 3] = 0
Image.fromarray(L1.astype(np.uint8), 'RGBA').save(d + 'L1.webp', quality=92)
print('BW01 balloon rebuilt on the boys plane')
