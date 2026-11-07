"""Contact sheets for the look-dev frames: python3 sheet.py (reads out/*.png, writes out/*.jpg and sheets/)."""
import glob, os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('sheets', exist_ok=True)
for p in glob.glob('out/*.png'):  # frames as JPG, light enough for the repo
    Image.open(p).convert('RGB').save(p[:-4] + '.jpg', quality=90)

font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 22) if os.path.exists('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf') else ImageFont.load_default()

def sheet(name, items, title):
    tw, th, lab, cols = 940, 529, 44, 2
    rows = (len(items) + cols - 1) // cols
    W, H = cols * tw + (cols + 1) * 20, rows * (th + lab + 20) + 90
    s = Image.new('RGB', (W, H), (13, 12, 9)); d = ImageDraw.Draw(s)
    d.text((20, 28), title, fill=(244, 239, 230), font=font)
    for i, (f, label) in enumerate(items):
        x, y = 20 + (i % cols) * (tw + 20), 80 + (i // cols) * (th + lab + 20)
        s.paste(Image.open(f'out/{f}.jpg').resize((tw, th)), (x, y))
        d.text((x, y + th + 10), label, fill=(47, 224, 196), font=font)
    s.save(f'sheets/{name}.jpg', quality=88)

sheet('1_looks', [('look1_channel_dusk', '1  CHANNEL SILHOUETTE · locked palette, dusk'), ('look2_opening_night', '2  OPENING NIGHT · same palette, fireworks'),
                  ('look3_flat_poster', '3  FLAT POSTER · hard bands, no haze or grain'), ('look4_gaslight_warm', '4  GASLIGHT · warm variant, teal accent (off-brand)'),
                  ('look5_cut_paper', '5  CUT PAPER · torn edges, shadows between planes')], 'BROOKLYN BRIDGE, MAY 24, 1883 · FIVE LOOKS, ONE SCENE (all drawn in code)')
sheet('2_scroll', [('scroll_1', 'camera 1 · Manhattan tower'), ('scroll_2', 'camera 2'), ('scroll_3', 'camera 3'), ('scroll_4', 'camera 4 · Brooklyn tower, Michael')],
      'ONE SIDE-SCROLL, FOUR STOPS · planes move at 0.25 / 0.5 / 0.75 / 1.0 / 1.35 of the camera')
sheet('3_titles_and_callouts', [('text_sec_A_tape', 'SECTION A · channel tape + mono stamp'), ('text_sec_B_band', 'SECTION B · full-width band'),
                                ('text_sec_C_handbill', 'SECTION C · period handbill'), ('text_callouts_composite', 'CALLOUTS · measure, name, composite label'),
                                ('text_gold_or_gilt', 'SERIES QUESTION · every episode ends here')], 'SECTION TITLES, CALLOUTS, THE SERIES QUESTION')
sheet('4_vocab', [('vocab_1_current_bar', '1  TODAY\'S TEMPLATE BAR'), ('vocab_2_index_card', '2  INDEX CARD'), ('vocab_3_lower_tab', '3  LOWER-THIRD TAB'),
                  ('vocab_4_in_scene', '4  IN THE SCENE · x-ray + handwriting'), ('vocab_5_dictionary', '5  DICTIONARY ENTRY')], 'VOCABULARY CARDS · same term, five treatments')

# Round 2 (looks 1 and 2 chosen): detail levels, the living scene, orange handwriting on the two chosen vocab styles.
if os.path.exists('out/r2_detail_ladder.jpg'):
    sheet('5_round2', [('r2_detail_ladder', 'DETAIL FOLLOWS THE CAMERA · dusk'), ('r2_detail_ladder_night', 'DETAIL FOLLOWS THE CAMERA · night'),
                       ('r2_closeup_t7', 'CLOSE-UP · Michael looks up, rim lit by the fireworks'), ('r2_fireworks_t2', 'OPENING NIGHT · wide, heads tipped up'),
                       ('vocab_2_index_card', 'VOCAB · index card, orange handwriting'), ('vocab_4_in_scene', 'VOCAB · x-ray, orange handwriting')],
          'ROUND 2 · LOOKS 1 + 2, CHARACTERS WITH DETAIL, ORANGE HANDWRITING')

if os.path.exists('out/r3_walk_wide_t1.jpg'):
    sheet('6_round3_walk', [('r3_walk_wide_t1', 'WALK · wide tracking shot, Lower East Side, dusk'), ('r3_walk_wide_t6', 'WALK · the wagon passes the other way'),
                            ('r3_walk_medium_t2', 'WALK · medium tracking shot, detail on')], 'ROUND 3 · MICHAEL WALKS HOME FROM THE REFINERY')
