import cv2,numpy as np,subprocess,os
out=[];info=[]
for i in range(1,7):
    p=cv2.imread(f'tests/cran_p{i}.png'); h,w=p.shape[:2]
    bg=np.median(np.r_[p[:15].reshape(-1,3),p[:, :15].reshape(-1,3)],0)
    d=np.abs(p.astype(int)-bg).sum(2)
    fg=(d>75).astype(np.uint8)
    fg=cv2.morphologyEx(fg,cv2.MORPH_CLOSE,np.ones((7,7),np.uint8))
    ff=fg.copy();cv2.floodFill(ff,np.zeros((h+2,w+2),np.uint8),(0,0),1)
    fg=fg|(1-ff)   # fill holes
    n,lab,st,_=cv2.connectedComponentsWithStats(fg)
    keep=np.zeros_like(fg)
    for k in range(1,n):
        if st[k,4]>3000: keep|=(lab==k).astype(np.uint8)
    a=cv2.GaussianBlur(keep.astype(np.float32),(3,3),0)
    # plate = big bright component
    br=((p.min(2)>235)&(keep>0)).astype(np.uint8)
    n,lab,st,_=cv2.connectedComponentsWithStats(br); k=1+np.argmax(st[1:,4])
    x,y,ww,hh=st[k,:4]; info.append((x+ww/2,y+hh,ww))
    out.append(np.dstack([p,(a*255).astype(np.uint8)]))
    cv2.imwrite(f'tests/cran_cut{i}.png',out[-1])
# align: plate bottom-centre and width to frame 1's
cx0,by0,w0=np.mean([v[0] for v in info]),np.mean([v[1] for v in info]),np.mean([v[2] for v in info])
W,H=1280,720; desk=np.full((H,W,3),(18,16,14),np.float32)
os.makedirs('tests/cran_prev',exist_ok=True)
seq=[0]*4+[1]*3+[2]*3+[3]*3+[4]*3+[5]*14   # drawings at 12/s, last held
for f,i in enumerate(seq):
    o=out[i].astype(np.float32); cx,by,ww=info[i]; s=w0/ww*0.9
    M=np.float32([[s,0,W/2-cx*s],[0,s,H*0.78-by*s]])
    wp=cv2.warpAffine(o,M,(W,H))
    a=wp[...,3:]/255
    sh=np.roll(cv2.GaussianBlur(wp[...,3],(0,0),10)/255,(12,10),(0,1))[...,None]
    bg=desk*(1-0.55*sh)
    cv2.imwrite(f'tests/cran_prev/p_{f:04d}.png',(bg*(1-a)+wp[...,:3]*a).astype(np.uint8))
subprocess.run('ffmpeg -y -loglevel error -stream_loop 1 -framerate 12 -i tests/cran_prev/p_%04d.png -vf fps=30 -c:v libx264 -pix_fmt yuv420p -crf 18 tests/cran_stopmotion_preview.mp4',shell=True,check=True)
print(info)
