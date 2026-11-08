"""Episode 2 contact sheets: our stills next to reference images. python3 ep2sheet.py (reads review/ep2/*.jpg)."""
import os
from PIL import Image, ImageDraw, ImageFont
R = '../ep2/public/img/ref/'
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 20)
SHEETS = {
  's1_exterior_night': (['s1_night_wide', 's1_night_arrival', 's1_night_canopy'], ['s1_660_fifth/660_fifth_stereo_street_c1903_loc2004679664.jpg', 's1_660_fifth/hunt_main_entrance_photo_loc2024635966.jpg', 's1_660_fifth/hunt_52nd_st_facade_detail_loc2024635967.jpg']),
  's2s3_ball_cutaway': (['s2_cut_wide', 's2_cut_labels', 's2_cut_hall', 's3_kitchen'], ['s2_ball/alice_vanderbilt_electric_light_mora_1883.jpg', 's2_ball/alva_venetian_princess_mora_1883.jpg', 's1_660_fifth/hunt_plan_basement_servants_loc2024635962.jpg']),
  's4_dawn': (['s4_dawn_wide', 's4_dawn_leaving', 's4_dawn_sister'], ['s4_fifth_ave_night/fifth_ave_vanderbilt_mansions_1904.jpg', 's4_fifth_ave_night/up_fifth_ave_home_of_rich_c1903.jpg']),
  's5_ballpark': (['s5_park_wide', 's5_park_swing', 's5_park_hit'], ['s5_baseball/polo_grounds_new_york_1887.jpg', 's5_baseball/brooklyn_bridegrooms_1888.jpg']),
}
for name, (ours, refs) in SHEETS.items():
    tw, th, W = 760, 428, 20
    rh = 428
    left = len(ours)
    H = 80 + max(left * (th + 50), len(refs) * (rh + 50))
    refimgs = [Image.open(R + r).convert('RGB') for r in refs]
    s = Image.new('RGB', (W * 3 + tw + 640, H), (13, 12, 9)); d = ImageDraw.Draw(s)
    d.text((W, 26), f'EPISODE 2 · {name.upper()} · our frames (left) vs references (right)', fill=(244, 239, 230), font=font)
    for i, o in enumerate(ours):
        y = 80 + i * (th + 50); s.paste(Image.open(f'review/ep2/{o}.jpg').resize((tw, th)), (W, y)); d.text((W, y + th + 8), o, fill=(47, 224, 196), font=font)
    y = 80
    for r, im in zip(refs, refimgs):
        im.thumbnail((620, rh)); s.paste(im, (W * 2 + tw, y)); d.text((W * 2 + tw, y + im.height + 8), os.path.basename(r)[:56], fill=(255, 159, 28), font=font); y += im.height + 50
    s.save(f'review/ep2/sheet_{name}.jpg', quality=86)
    print('sheet', name)
