# closeup.py out.jpg name=src ...  : full-res crop with teal outline + cut-out on grey (same as tools/mask_closeup.py, for mask_jobs entries)
import sys, os
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
PUB='/home/user/15minhistorystyle/projects/American_West/ep1/public'
tiles=[]
for arg in sys.argv[2:]:
    n,src=arg.split('=')
    im=Image.open(os.path.join(PUB,src)).convert('RGB'); m=Image.open(os.path.join(PUB,'img','masks',n+'_subject.png')).convert('L')
    a=np.asarray(m)>127; ys,xs=np.nonzero(a); pad=40
    box=(max(0,xs.min()-pad),max(0,ys.min()-pad),min(im.width,xs.max()+pad),min(im.height,ys.max()+pad))
    c=im.crop(box); mc=m.crop(box)
    edge=mc.filter(ImageFilter.FIND_EDGES).point(lambda v:255 if v>60 else 0).filter(ImageFilter.MaxFilter(5))
    o=c.copy(); o.paste((47,224,196),mask=edge)
    g=Image.new('RGB',c.size,(128,128,128)); g.paste(c,mask=mc)
    t=Image.new('RGB',(c.width*2+10,c.height),'black'); t.paste(o,(0,0)); t.paste(g,(c.width+10,0))
    t.thumbnail((1800,1400)); tiles.append(t)
H=sum(t.height for t in tiles); W=max(t.width for t in tiles)
sh=Image.new('RGB',(W,H),'black'); y=0
for t in tiles: sh.paste(t,(0,y)); y+=t.height
sh.save(sys.argv[1],quality=85)
