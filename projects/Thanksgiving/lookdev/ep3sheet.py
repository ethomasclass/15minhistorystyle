"""Episode 3 reference sheets: our stills (left) next to the reference images (right). python3 ep3sheet.py [name ...]
Reads review/ep3/*.jpg and ../ep3/public/img/ref/; writes review/ep3/sheet_<name>.jpg."""
import os, sys
from PIL import Image, ImageDraw, ImageFont
R = '../ep3/public/img/ref/'
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 20)
SHEETS = {
  'steerage': (['st_wide', 'st_push', 'st_family'], ['a_steerage/ss_elbe_ndl_1881_iln_1895.jpg', 'a_steerage/leslies_welcome_steerage_deck_1887_loc97502086.jpg', 'a_steerage/castaigne_on_the_steerage_deck_1898_loc2010715345.jpg']),
  'castle_garden': (['cg_barge', 'cg_landing', 'cg_rotunda'], ['b_castle_garden/castle_garden_stereo_anthony_1880s_loc2017649604.jpg', 'b_castle_garden/rotunda_interior_emigrant_depot_c1870s_nypl423062.jpg', 'b_castle_garden/registering_emigrants_1866_loc2001697361.jpg']),
  'moving_in': (['mi_wide', 'mi_stoop', 'mi_window'], ['d_street/hester_street_1897_loc2017659396.jpg', 'd_street/peddlers_carts_elizabeth_st_c1902_loc2007678128.jpg', 'f_clothing/puck_columbia_welcomes_victims_1881_loc2001696516.jpg']),
  'sweatshop': (['sw_room', 'sw_contractor', 'sw_daughter'], ['e_sweatshop/riis_sweatshop_ludlow_st_c1889_loc2002710271.jpg', 'e_sweatshop/riis_necktie_workshop_division_st_c1889_loc2002710291.jpg', 'e_sweatshop/riis_boy_pulling_threads_c1889_loc2002710250.jpg']),
  'letter': (['lt_table', 'lt_ticket', 'lt_map'], ['e_sweatshop/riis_women_sewing_elizabeth_st_c1889_loc2002711500.jpg', 'f_clothing/puck_columbia_welcomes_victims_1881_loc2001696516.jpg']),
  'names': (['nm_desk', 'nm_school', 'nm_sign'], ['b_castle_garden/registering_emigrants_1866_loc2001697361.jpg', 'b_castle_garden/rotunda_interior_emigrant_depot_c1870s_nypl423062.jpg', 'd_street/hester_street_1897_loc2017659396.jpg']),
  'looking_backward': (['lb_men', 'lb_shadows', 'lb_caption'], ['h_nativism/keppler_looking_backward_1893.jpg']),
  'nativism': (['nv_desk', 'nv_quote', 'nv_ma'], ['h_nativism/keppler_looking_backward_1893.jpg', 'h_nativism/chinese_exclusion_act_1882_text.jpg', 'h_nativism/opper_irish_declaration_of_independence_1883_loc2012645471.jpg']),
}
only = sys.argv[1:]
for name, (ours, refs) in SHEETS.items():
    if only and name not in only: continue
    refs = [r for r in refs if os.path.exists(R + r)]
    tw, th, W, rh = 760, 428, 20, 428
    H = 80 + max(len(ours) * (th + 50), len(refs) * (rh + 50))
    s = Image.new('RGB', (W * 3 + tw + 640, H), (13, 12, 9)); d = ImageDraw.Draw(s)
    d.text((W, 26), f'EPISODE 3 DRAFT · {name.upper()} · our frames (left) vs references (right)', fill=(244, 239, 230), font=font)
    for i, o in enumerate(ours):
        y = 80 + i * (th + 50); s.paste(Image.open(f'review/ep3/{o}.jpg').resize((tw, th)), (W, y)); d.text((W, y + th + 8), o, fill=(47, 224, 196), font=font)
    y = 80
    for r in refs:
        im = Image.open(R + r).convert('RGB'); im.thumbnail((620, rh)); s.paste(im, (W * 2 + tw, y)); d.text((W * 2 + tw, y + im.height + 8), os.path.basename(r)[:56], fill=(255, 159, 28), font=font); y += im.height + 50
    s.save(f'review/ep3/sheet_{name}.jpg', quality=86)
    print('sheet', name)
