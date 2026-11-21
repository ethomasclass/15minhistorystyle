"""Split-colour thumbnail: the Flow eel->plate image cut out (mask.png) over teal (left) and coral (right) desks."""
import cv2,numpy as np
im=cv2.imread('flow_eel_plate.jpg').astype(np.float32); m=cv2.imread('mask.png',0).astype(np.float32)/255
h,w=m.shape; a=cv2.GaussianBlur(m,(3,3),0)
yy,xx=np.mgrid[0:h,0:w].astype(np.float32)
def hexbgr(x): x=x.lstrip('#'); return np.array([int(x[4:6],16),int(x[2:4],16),int(x[0:2],16)],np.float32)
def grad(c,e):
    r=np.clip(np.sqrt(((xx-w/2)/(w*0.7))**2+((yy-h/2)/(h*0.7))**2),0,1)[...,None]; return c*(1-r)+e*r
teal=grad(hexbgr('#2A7A72'),hexbgr('#113532'))
grid=((xx%40<1.5)|(yy%40<1.5)).astype(np.float32)[...,None]*0.10+((xx%200<2.5)|(yy%200<2.5)).astype(np.float32)[...,None]*0.08
teal=teal*(1-grid)+hexbgr('#BDF5EC')*grid
coral=grad(hexbgr('#C4554A'),hexbgr('#5A1F1A'))+((np.sin(xx*1.7)+np.sin(yy*1.9))*3)[...,None]+np.random.default_rng(3).normal(0,4,(h,w,1))
arrow=((m>0.5)&(xx>470)&(xx<870)).astype(np.uint8)
ring=cv2.GaussianBlur((cv2.dilate(arrow,np.ones((7,7),np.uint8))-arrow).astype(np.float32),(0,0),1.2)
def make(split,name):
    s=cv2.GaussianBlur(split.astype(np.float32),(0,0),1.2)[...,None]
    bg=teal*(1-s)+coral*s
    sh=np.roll(cv2.GaussianBlur(m,(0,0),14),(16,12),(0,1)); sh2=np.roll(cv2.GaussianBlur(m,(0,0),3),(4,3),(0,1))
    bg=bg*(1-0.45*sh[...,None])*(1-0.3*sh2[...,None])
    bg=bg*(1-0.6*ring[...,None])+hexbgr('#0D0C09')*0.6*ring[...,None]
    out=np.clip(bg*(1-a[...,None])+im*a[...,None],0,255).astype(np.uint8)
    big=cv2.resize(out,(1920,1080),interpolation=cv2.INTER_CUBIC); cv2.imwrite(name.replace('.jpg','_1920.png'),big); out=cv2.resize(out,(1280,720),interpolation=cv2.INTER_AREA); cv2.imwrite(name,out,[cv2.IMWRITE_JPEG_QUALITY,95]); return out
A=make(xx>w*0.5,'thumb_A_vertical.jpg')
B=make(xx>w*0.5+(yy-h/2)*0.35,'thumb_B_diagonal.jpg')
small=lambda x: cv2.resize(x,(320,180),interpolation=cv2.INTER_AREA)
row2=np.zeros((180,2560,3),np.uint8); row2[:,0:320]=small(A); row2[:,1280:1600]=small(B)
cv2.imwrite('thumb_compare.jpg',np.vstack([np.hstack([A,B]),row2]))
