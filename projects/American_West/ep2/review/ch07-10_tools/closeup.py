# Mask close-up for mask_jobs entries: python3 closeup.py out.jpg src1:name1 src2:name2 (src relative to public/)
import sys, os
from PIL import Image, ImageFilter
import numpy as np
PUB='/home/user/15minhistorystyle/projects/American_West/ep2/public'
out=sys.argv[1]; tiles=[]
for arg in sys.argv[2:]:
    src,n=arg.split(':')
    im=Image.open(os.path.join(PUB,src)).convert('RGB')
    m=Image.open(os.path.join(PUB,'img/masks',n+'_subject.png')).convert('L').resize(im.size)
    a=np.asarray(m)>127; ys,xs=np.nonzero(a)
    box=(max(0,xs.min()-40),max(0,ys.min()-40),min(im.width,xs.max()+40),min(im.height,ys.max()+40))
    c=im.crop(box); mm=m.crop(box)
    grey=Image.new('RGB',c.size,(120,120,120)); grey.paste(c,(0,0),mm)
    edge=mm.filter(ImageFilter.FIND_EDGES).point(lambda v:255 if v>60 else 0)
    ov=c.copy(); ov.paste(Image.new('RGB',c.size,(47,224,196)),(0,0),edge)
    t=Image.new('RGB',(c.width*2,c.height)); t.paste(ov,(0,0)); t.paste(grey,(c.width,0))
    t.thumbnail((1800,1200)); tiles.append(t)
H=sum(t.height for t in tiles); W=max(t.width for t in tiles)
s=Image.new('RGB',(W,H),'white'); y=0
for t in tiles: s.paste(t,(0,y)); y+=t.height
s.save(out,quality=88)
