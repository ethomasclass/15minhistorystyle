import re, sys
from PIL import Image, ImageDraw, ImageFont
rows=[l for l in open('research/THUMBNAIL_RESEARCH.md') if re.match(r'\| \d+ \|',l)]
comp=[]
for l in rows:
    c=[x.strip() for x in l.replace('\\|','/').split('|')]
    comp.append((f'research/competitors/{c[6]}.jpg', c[2].replace('\\',''), f'{c[3]} · {c[4]} views'))
# Our concepts and their paired titles; pass keys on the command line to choose (default: H1 H2 H3 G)
TITLES={'C':'Trick-or-Treating Was a Bribe','D':'Why Halloween Used to Be a Crime Spree','E':'Trick-or-Treating Was a Bribe','F':'The Real History of Trick-or-Treating','G':'Why Halloween Used to Be a Crime Spree','H1':'Trick-or-Treating Was a Bribe','H2':'Why Halloween Used to Be a Crime Spree','H3':'The Real History of Trick-or-Treating','H4':'The Real History of Trick-or-Treating'}
keys=sys.argv[1:] or ['H1','H2','H3','G']
ours={k:TITLES.get(k,'Trick-or-Treating Was a Bribe') for k in keys}
items=list(comp)
for i,k in zip([1,6,9,14],keys):
    items.insert(i,(f'renders/thumbnails/Halloween_Bribe_{k}.png',f'[{k}] '+ours[k],'Chunk History · new'))
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
fb=ImageFont.truetype(F.replace('Sans','Sans-Bold'),15); fs=ImageFont.truetype(F,13)
def feed(dark,out):
    W,H,cols=320,180,4
    bg,fg,sub=((15,15,15),(241,241,241),(170,170,170)) if dark else ((255,255,255),(15,15,15),(96,96,96))
    img=Image.new('RGB',(cols*(W+16)+16,5*(H+64)+16),bg); d=ImageDraw.Draw(img)
    for n,(p,t,s) in enumerate(items):
        x=16+(n%cols)*(W+16); y=16+(n//cols)*(H+64)
        im=Image.open(p).convert('RGB'); r=im.width/im.height
        if r<1.7: h=int(im.width/1.7778); im=im.crop((0,(im.height-h)//2,im.width,(im.height-h)//2+h))
        img.paste(im.resize((W,H)),(x,y))
        d.text((x,y+H+6),t[:40],font=fb,fill=fg); d.text((x,y+H+26),s,font=fs,fill=sub)
    img.save(out,quality=88)
feed(True,'review/feed_dark.jpg'); feed(False,'review/feed_light.jpg')
