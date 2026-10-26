# Adds the hat (rembg dropped it: dark felt on a dark backdrop) to the ch01_russell mask with a hand polygon, fills holes.
import sys, cv2, numpy as np
sys.path.insert(0, '/home/user/15minhistorystyle/projects/American_West/ep2/tools')
from PIL import Image
from trace import clean, save
P = '/home/user/15minhistorystyle/projects/American_West/ep2/public/img/masks/'
m = np.asarray(Image.open(P + 'ch01_russell_subject.png').convert('L')).copy()
k = 1920 / 1293
hat = np.array([(425,470),(345,355),(395,265),(510,205),(650,182),(815,190),(970,255),(1085,360),(1160,500),(1172,660),(1132,815),(1050,915),(905,975),(875,975),(870,700)]) * k
cv2.fillPoly(m, [hat.astype(np.int32)], 255)
# fill holes
ff = m.copy(); h, w = m.shape; mask = np.zeros((h + 2, w + 2), np.uint8); cv2.floodFill(ff, mask, (5, 5), 255); m = m | cv2.bitwise_not(ff)
m = clean(m, close=15, min_area=20000)
save('ch01_russell', (w, h), {'subject': m})
