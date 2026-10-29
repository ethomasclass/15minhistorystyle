# Adds the hat (rembg dropped it: dark felt on a dark backdrop) to the ch01_russell mask with a hand polygon, fills holes.
import sys, cv2, numpy as np
sys.path.insert(0, '/home/user/15minhistorystyle/projects/American_West/ep2/tools')
from PIL import Image
from trace import clean, save
P = '/home/user/15minhistorystyle/projects/American_West/ep2/public/img/masks/'
m = np.asarray(Image.open(P + 'ch01_russell_subject.png').convert('L')).copy()
k = 1
# hat outline in source px (traced on a brightened grid of the scan)
hat = np.array([(607, 897), (487, 897), (433, 777), (440, 657), (473, 550), (527, 417), (633, 323), (767, 270), (900, 250), (1047, 250), (1233, 277), (1367, 337), (1500, 417), (1607, 550), (1673, 710), (1700, 897), (1687, 1083), (1647, 1257), (1580, 1377), (1500, 1463), (1420, 1483), (1313, 1323), (1233, 1083), (1100, 817), (833, 710)]) * k
cv2.fillPoly(m, [hat.astype(np.int32)], 255)
# fill holes
ff = m.copy(); h, w = m.shape; mask = np.zeros((h + 2, w + 2), np.uint8); cv2.floodFill(ff, mask, (5, 5), 255); m = m | cv2.bitwise_not(ff)
m = clean(m, close=15, min_area=20000)
save('ch01_russell', (w, h), {'subject': m})
