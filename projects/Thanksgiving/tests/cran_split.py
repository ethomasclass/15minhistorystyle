import cv2,numpy as np
im=cv2.imread('img/flow/tg_cran_sheet.jpg'); g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
m=(g<245).astype(np.uint8)
cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
R=sorted([cv2.boundingRect(c) for c in cs if cv2.contourArea(c)>200000],key=lambda r:(r[1]//300,r[0]))
print(R)
for i,(x,y,w,h) in enumerate(R):
    p=im[y+12:y+h-12,x+12:x+w-12]; cv2.imwrite(f'tests/cran_p{i+1}.png',p)
