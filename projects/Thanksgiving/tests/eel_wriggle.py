"""Make the flat eel cut-out wriggle: a skeletal warp along its own spine.
Out: tests/eel_frames/eel_####.png (RGBA, 12 drawings/s) + tests/eel_wriggle_preview.mp4 on the dark desk."""
import cv2, numpy as np, os, subprocess, collections
from skimage.morphology import skeletonize
from scipy import ndimage as ndi
im=cv2.imread('img/flow/tg_eel.jpg'); H,W=im.shape[:2]
m=cv2.imread('tests/eel_mask.png',0)>127
# --- spine: longest path through the skeleton
sk=skeletonize(cv2.erode(m.astype(np.uint8),np.ones((9,9)))>0)
pts=set(zip(*np.nonzero(sk)))
nb=lambda p:[(p[0]+a,p[1]+b) for a in(-1,0,1) for b in(-1,0,1) if (a or b) and (p[0]+a,p[1]+b) in pts]
def bfs(s):
    D={s:0};P={s:None};q=collections.deque([s])
    while q:
        u=q.popleft()
        for v in nb(u):
            if v not in D: D[v]=D[u]+1;P[v]=u;q.append(v)
    f=max(D,key=D.get);return f,P
a,_=bfs(next(iter(pts))); b,P=bfs(a)
path=[];u=b
while u: path.append(u);u=P[u]
path=np.array(path,float)[:,::-1]           # (x,y)
if path[0,0]>path[-1,0] and path[0,1]<path[-1,1]: pass
if np.hypot(*(path[0]-[300,235]))>np.hypot(*(path[-1]-[300,235])): path=path[::-1]  # head first
# smooth + resample every 2 px
k=15; pad=np.pad(path,((k,k),(0,0)),mode='edge'); path=np.array([np.convolve(pad[:,i],np.ones(2*k+1)/(2*k+1),'valid') for i in(0,1)]).T
seg=np.hypot(*np.diff(path,axis=0).T); s=np.r_[0,np.cumsum(seg)]
S=np.arange(0,s[-1],2.0); sp=np.c_[np.interp(S,s,path[:,0]),np.interp(S,s,path[:,1])]
# extend both ends along the tangent to reach the tips
def ext(p,dirv,n=40): return np.array([p+dirv*2*i for i in range(1,n)])
t0=sp[0]-sp[5];t0/=np.linalg.norm(t0); t1=sp[-1]-sp[-6];t1/=np.linalg.norm(t1)
sp=np.vstack([ext(sp[0],t0)[::-1],sp,ext(sp[-1],t1,6)])
N=len(sp); L=2.0*(N-1); sv=np.arange(N)*2.0
tan=np.gradient(sp,axis=0); ang0=np.unwrap(np.arctan2(tan[:,1],tan[:,0]))
nrm0=np.c_[-np.sin(ang0),np.cos(ang0)]
R=78
src=im.astype(np.float32); alpha=m.astype(np.float32)
os.makedirs('tests/eel_frames',exist_ok=True)
lab0=np.zeros((H,W),np.int32)
for i in range(N):
    x,y=int(round(sp[i,0])),int(round(sp[i,1]))
    if 0<=x<W and 0<=y<H: lab0[y,x]=i+1
_,(jy,jx)=ndi.distance_transform_edt(lab0==0,return_indices=True); own0=lab0[jy,jx]-1  # which spine sample owns each source pixel
FR=48  # 4 s loop at 12 drawings/s
gx,gy=np.meshgrid(np.arange(W),np.arange(H))
for f in range(FR):
    t=f/FR
    u=sv/L
    env=np.clip((u-0.12)/0.88,0,1)**1.3          # head nearly still, tail swings most
    phi=0.24*env*np.sin(2*np.pi*(u*1.25 - t)) + 0.06*np.sin(2*np.pi*t)*env
    ang=ang0+phi
    d=np.c_[np.cos(ang),np.sin(ang)]*2.0
    head=int(0.12*N)
    sp1=np.empty_like(sp); sp1[head]=sp[head]
    for i in range(head+1,N): sp1[i]=sp1[i-1]+d[i]
    for i in range(head-1,-1,-1): sp1[i]=sp1[i+1]-d[i+1]
    nrm1=np.c_[-np.sin(ang),np.cos(ang)]
    # nearest deformed spine sample per pixel
    lab=np.zeros((H,W),np.int32)
    for i in range(N):
        x,y=int(round(sp1[i,0])),int(round(sp1[i,1]))
        if 0<=x<W and 0<=y<H: lab[y,x]=i+1
    dist,(iy,ix)=ndi.distance_transform_edt(lab==0,return_indices=True)
    idx=lab[iy,ix]-1
    ok=(dist<R)&(idx>=0)
    q=np.stack([gx,gy],-1).astype(np.float32)
    off=q-sp1[idx]; dd=(off*nrm1[idx]).sum(-1); along=(off*np.c_[np.cos(ang),np.sin(ang)][idx]).sum(-1)
    srcp=sp[idx]+dd[...,None]*nrm0[idx]+along[...,None]*np.c_[np.cos(ang0),np.sin(ang0)][idx]
    sx=np.clip(srcp[...,0].round().astype(int),0,W-1); sy=np.clip(srcp[...,1].round().astype(int),0,H-1)
    ok&=np.abs(own0[sy,sx]-idx)<20
    ok&=~((idx>=N-2)&(along>0))
    mx=np.where(ok,srcp[...,0],-10).astype(np.float32); my=np.where(ok,srcp[...,1],-10).astype(np.float32)
    rgb=cv2.remap(src,mx,my,cv2.INTER_LINEAR,borderValue=0)
    a=cv2.remap(alpha,mx,my,cv2.INTER_LINEAR,borderValue=0)
    a=cv2.morphologyEx(a,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
    out=np.dstack([rgb,a*255]).clip(0,255).astype(np.uint8)
    cv2.imwrite(f'tests/eel_frames/eel_{f:04d}.png',out)
# preview on the dark desk: each drawing held for 30/12 frames
desk=np.full((H,W,3),(18,16,14),np.float32)
os.makedirs('tests/eel_prev',exist_ok=True)
for f in range(FR):
    o=cv2.imread(f'tests/eel_frames/eel_{f:04d}.png',cv2.IMREAD_UNCHANGED).astype(np.float32)
    a=o[...,3:]/255
    sh=cv2.GaussianBlur(a,(0,0),9); sh=np.roll(sh,(10,8),(0,1))[...,None] if sh.ndim==2 else sh
    sh=cv2.GaussianBlur(o[...,3],(0,0),9)/255; sh=np.roll(sh,(10,8),(0,1))[...,None]
    bg=desk*(1-0.6*sh)
    cv2.imwrite(f'tests/eel_prev/p_{f:04d}.png',(bg*(1-a)+o[...,:3]*a).astype(np.uint8))
subprocess.run('ffmpeg -y -loglevel error -stream_loop 2 -framerate 12 -i tests/eel_prev/p_%04d.png -vf "fps=30,scale=1376:-2" -c:v libx264 -pix_fmt yuv420p -crf 18 tests/eel_wriggle_preview.mp4',shell=True,check=True)
print('spine samples',N)
