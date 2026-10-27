# The ch02_mccoy mask as a hand polygon (rembg took the engraved background hatching and lost the coat).
import sys, cv2, numpy as np
sys.path.insert(0, '/home/user/15minhistorystyle/projects/American_West/ep2/tools')
from trace import clean, save
W, H = 1800, 2709
k = 1800 / 1196
pts = [(470,420),(520,360),(580,343),(660,358),(740,398),(790,458),(802,540),(782,590),(762,640),(758,700),(742,760),(790,800),(860,858),(940,918),(1000,975),
       (998,1100),(965,1180),(905,1255),(840,1305),(700,1318),(560,1320),(420,1316),(320,1308),(276,1270),(268,1150),(285,1060),(330,960),(400,872),(468,792),(458,700),(468,640),(450,560),(448,480)]
m = np.zeros((H, W), np.uint8)
cv2.fillPoly(m, [(np.array(pts) * k).astype(np.int32)], 255)
m = cv2.GaussianBlur(m, (9, 9), 0); m = ((m > 127) * 255).astype(np.uint8)
save('ch02_mccoy', (W, H), {'subject': clean(m, close=5, min_area=20000)})
