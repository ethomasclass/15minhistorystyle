# Union (+) or subtract (-) hand polygons on a mask, then re-save via tools/trace.save.
# python3 -I fixmask.py name '+x,y x,y ...' '-x,y ...'   (source px)
import sys, os
sys.path.insert(0, '/home/user/15minhistorystyle/projects/American_West/ep2/tools')
import numpy as np, cv2
from PIL import Image
from trace import save, clean
OUT='/home/user/15minhistorystyle/projects/American_West/ep2/public/img/masks'
name=sys.argv[1]
m=np.asarray(Image.open(os.path.join(OUT,name+'_subject.png')).convert('L')).copy()
m=(m>127).astype(np.uint8)*255
for poly in sys.argv[2:]:
    sign=poly[0]; pts=np.array([[float(v) for v in p.split(',')] for p in poly[1:].split()],np.int32)
    cv2.fillPoly(m,[pts],255 if sign=='+' else 0)
m=clean(m,close=9,min_area=20000)
save(name,(m.shape[1],m.shape[0]),{'subject':m})
