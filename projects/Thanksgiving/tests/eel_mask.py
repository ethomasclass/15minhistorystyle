import cv2, numpy as np
im=cv2.imread('img/flow/tg_eel.jpg'); g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
e=cv2.Canny(cv2.GaussianBlur(g,(3,3),0),18,45)
m=cv2.dilate(e,np.ones((5,5),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(m); k=1+np.argmax(st[1:,4]); m=(lab==k).astype(np.uint8)*255
h,w=m.shape; ff=m.copy(); cv2.floodFill(ff,np.zeros((h+2,w+2),np.uint8),(0,0),255); m=m|cv2.bitwise_not(ff)
m=cv2.erode(m,np.ones((5,5),np.uint8))
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((7,7),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(m); k=1+np.argmax(st[1:,4]); m=(lab==k).astype(np.uint8)*255
cv2.imwrite('tests/eel_mask.png',m)
p=im.copy(); p[m==0]=(40,30,30); cv2.imwrite('tests/eel_mask_prev.jpg',p)
