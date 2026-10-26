"""Find one word in historic newspapers (Library of Congress, Chronicling America) and cut a crop centred on it,
for a word match cut: page after page flashes past with the same word dead centre.

  python3 -I tools/word_hunt.py --word vagrant --states "mississippi,south carolina" --dates 1865/1866 --out DIR
      [--q "vagrant freedmen"] [--per-state 6] [--context freedmen,freedman,negro,colored] [--span 9]

For each state it searches the LOC newspaper collection, reads each page's ALTO OCR (word boxes), keeps the matches
whose text block also mentions a context word (so it's the law, not a police column), and saves:
  DIR/<state>_<n>.jpg   a 16:9 crop, `--span` word-widths wide, the word at the exact centre
  DIR/<state>_<n>.json  {word, box (in the crop's pixels), paper, date, state, page url, block text}
Pick the legible ones by eye (DIR/sheet.jpg), then list them in the scene.
"""
import argparse, json, os, re, subprocess, time
import xml.etree.ElementTree as ET
import cv2
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('--word', required=True)
ap.add_argument('--q', default='')
ap.add_argument('--states', required=True)
ap.add_argument('--dates', default='1865/1866')
ap.add_argument('--per-state', type=int, default=6)
ap.add_argument('--context', default='freedmen,freedman,negro,negroes,colored,color')
ap.add_argument('--law', default='enacted,sec.,section,shall be deemed,misdemeanor,be it', help='the block must also read like a statute')
ap.add_argument('--workers', type=int, default=6)
ap.add_argument('--span', type=float, default=9.0)
ap.add_argument('--out', required=True)
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)
CTX = [c.strip().lower() for c in a.context.split(',') if c.strip()]
LAW = [c.strip().lower() for c in a.law.split(',') if c.strip()]
WORD = re.compile(rf'^[^a-z]*{re.escape(a.word.lower())}(s|cy)?[^a-z]*$')


def get(url, params=None, binary=False):
    cmd = ['curl', '-sS', '-L', '--retry', '3', '--max-time', '120', '-G', url]
    for k, v in (params or {}).items():
        cmd += ['--data-urlencode', f'{k}={v}']
    for attempt in range(3):
        r = subprocess.run(cmd, capture_output=True)
        if r.returncode == 0 and r.stdout:
            return r.stdout if binary else r.stdout.decode('utf8', 'replace')
        time.sleep(2 + attempt * 3)
    raise RuntimeError(f'fetch failed: {url}')


def strings(xml):
    """(content, hpos, vpos, w, h, block_text) for every word, in ALTO units; page width/height."""
    xml = re.sub(r'(</?)\w+:', r'\1', re.sub(r'\s(xmlns(:\w+)?|\w+:\w+)="[^"]*"', '', xml))
    root = ET.fromstring(xml)
    page = root.find('.//Page')
    out = []
    for blk in root.iter('TextBlock'):
        words = [s for s in blk.iter('String')]
        text = ' '.join(s.get('CONTENT', '') for s in words)
        for s in words:
            out.append((s.get('CONTENT', ''), int(float(s.get('HPOS'))), int(float(s.get('VPOS'))),
                        int(float(s.get('WIDTH'))), int(float(s.get('HEIGHT'))), text))
    return out, int(float(page.get('WIDTH'))), int(float(page.get('HEIGHT')))


sheet = []
from concurrent.futures import ThreadPoolExecutor


def page_hits(r):
    rid = r.get('id', '')
    if '/resource/' not in rid:
        return None
    try:
        base, _, query = rid.partition('?')
        sp = re.search(r'sp=(\d+)', query)
        info = json.loads(get(base.replace('http://', 'https://'), {'sp': sp.group(1) if sp else '1', 'fo': 'json'}))
        xml_url = next(p['url'] for p in info['page'] if p.get('url', '').endswith('.xml'))
        iiif = 'https://tile.loc.gov/image-services/iiif/' + xml_url.split('storage-services/')[1].rsplit('.', 1)[0].replace('/', ':')  # this page's image, not page 1's
        words, pw, ph = strings(get(xml_url))
    except Exception as e:  # noqa: BLE001
        print('skip', rid, e, flush=True)
        return None
    hits = [w for w in words if WORD.match(w[0].lower()) and any(c in w[5].lower() for c in CTX) and any(c in w[5].lower() for c in LAW)]
    if not hits:
        return None
    try:
        meta = json.loads(get(iiif + '/info.json'))
    except Exception:  # noqa: BLE001
        return None
    return r, base, sp, iiif, meta, meta['width'] / pw, max(hits, key=lambda t: t[4])


for state in [s.strip() for s in a.states.split(',')]:
    res = json.loads(get('https://www.loc.gov/collections/chronicling-america/',
                         {'q': a.q or a.word, 'dates': a.dates, 'fa': f'location_state:{state}', 'fo': 'json', 'c': '30'}))
    with ThreadPoolExecutor(a.workers) as ex:
        found = [x for x in ex.map(page_hits, res.get('results', [])) if x]
    kept = 0
    for r, base, sp, iiif, meta, sx, (c, x, y, w, h, block) in found:
        if kept >= a.per_state:
            break
        X, Y, Wd, Ht = x * sx, y * sx, w * sx, h * sx
        cw = Wd * a.span
        chh = cw * 9 / 16
        cx, cy = X + Wd / 2, Y + Ht / 2
        rx, ry = int(max(0, cx - cw / 2)), int(max(0, cy - chh / 2))
        rw, rh = int(min(meta['width'] - rx, cw)), int(min(meta['height'] - ry, chh))
        try:
            img = get(f'{iiif}/{rx},{ry},{rw},{rh}/full/0/default.jpg', binary=True)
        except Exception:  # noqa: BLE001
            continue
        im = cv2.imdecode(np.frombuffer(img, np.uint8), cv2.IMREAD_GRAYSCALE)
        if im is None:
            continue
        # pad back to 16:9 with the word centred, if the page edge cut the crop
        canvas = np.full((int(chh), int(cw)), int(np.median(im)), np.uint8)
        ox, oy = int(rx - (cx - cw / 2)), int(ry - (cy - chh / 2))
        hh, ww = min(im.shape[0], canvas.shape[0] - oy), min(im.shape[1], canvas.shape[1] - ox)
        canvas[oy:oy + hh, ox:ox + ww] = im[:hh, :ww]
        out = cv2.resize(canvas, (1920, 1080), interpolation=cv2.INTER_CUBIC if cw < 1920 else cv2.INTER_AREA)
        k = 1920 / cw
        name = f"{state.replace(' ', '_')}_{kept}"
        cv2.imwrite(os.path.join(a.out, name + '.jpg'), out, [cv2.IMWRITE_JPEG_QUALITY, 92])
        rec = {'word': c, 'box': [960 - Wd * k / 2, 540 - Ht * k / 2, Wd * k, Ht * k], 'paper': r.get('title', ''),
               'date': r.get('date', ''), 'state': state, 'page': base, 'sp': sp.group(1) if sp else '1', 'block': block[:600],
               'word_px': Wd, 'iiif': iiif, 'region': [rx, ry, rw, rh]}
        json.dump(rec, open(os.path.join(a.out, name + '.json'), 'w'), indent=1)
        print(name, c, rec['date'], rec['paper'][:70], f'word {Wd:.0f}px', flush=True)
        sheet.append((name, out))
        kept += 1

if sheet:
    th = [cv2.putText(cv2.resize(im, (480, 270)), n, (8, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.6, 0, 2) for n, im in sheet]
    while len(th) % 4:
        th.append(np.full((270, 480), 255, np.uint8))
    rows = [np.hstack(th[i:i + 4]) for i in range(0, len(th), 4)]
    cv2.imwrite(os.path.join(a.out, 'sheet.jpg'), np.vstack(rows))
