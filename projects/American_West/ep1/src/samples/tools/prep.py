# Crop/re-encode downloaded archival files into ep1/public/img/samples (data only; nothing executed from downloads)
# DL = folder of raw downloads (LOC TIFF masters, IIIF JPGs, Commons files; see public/img/samples/CREDITS.md). It was a
# session scratch folder, so set DL before re-running.
import os
from PIL import Image, ImageOps
Image.MAX_IMAGE_PIXELS = None
SP = os.environ.get("SAMPLES_DL_ROOT", "")
DL = os.path.join(SP, "dl")
OUT = "/home/user/15minhistorystyle/projects/American_West/ep1/public/img/samples"
def save(im, name, maxw=None):
    im = im.convert("RGB")
    if maxw and im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name), quality=90); print(name, im.size)
save(Image.open(f"{DL}/commons/spike.jpg"), "spike_russell_1869.jpg")
save(Image.open(f"{DL}/tif/1s00553.tif").crop((300, 90, 2390, 2090)), "hart_tunnel8_worker.jpg")
g = Image.open(f"{DL}/tif/1s00612.tif").convert("RGB").crop((288, 112, 2392, 2152))
save(g, "hart_goliah.jpg")
# Mirrored copy so the CP engine faces east (right) on the left of a west-left map; the number plate and cab
# nameplate are pasted back un-mirrored so their lettering reads correctly. Disclosed on screen and in CREDITS.md.
f = ImageOps.mirror(g)
from PIL import ImageDraw
def unflip(im, box, ellipse=False):   # flip a region back in place so its lettering reads correctly
    patch = ImageOps.mirror(im.crop(box))
    m = Image.new("L", patch.size, 0); d = ImageDraw.Draw(m)
    (d.ellipse if ellipse else d.rectangle)((0, 0, patch.width - 1, patch.height - 1), fill=255)
    im.paste(patch, box[:2], m)
unflip(f, (1785 - 45, 937 - 45, 1785 + 45, 937 + 45), ellipse=True)   # "27" number plate
unflip(f, (1062, 770, 1158, 800))                                    # cab nameplate
save(f, "hart_goliah_mirrored.jpg")
save(Image.open(f"{DL}/tif/1s00083.tif").crop((343, 179, 2355, 2266)), "carbutt_up_100th_1866.jpg")
save(Image.open(f"{DL}/tif/3c04561.tif").crop((614, 250, 2776, 3390)), "red_cloud_trager_kuhn_1891.jpg")
save(Image.open(f"{DL}/doc/act_0563.jpg"), "pacific_railway_act_1862_p1.jpg")
save(Image.open(f"{DL}/doc/act_0566.jpg"), "pacific_railway_act_1862_p4.jpg")
save(Image.open(f"{DL}/maps/terr1868.jpg"), "map_warren_1868.jpg")
save(Image.open(f"{DL}/maps/up_dodge1869.jpg"), "map_up_dodge_1869.jpg")
