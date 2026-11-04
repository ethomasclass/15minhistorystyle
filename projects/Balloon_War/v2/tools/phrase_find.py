"""Find phrases on a Chronicling America newspaper page (Library of Congress) and cut a crop around them, with the
box of every printed line each phrase covers, for highlighter swipes and focus moves.

  python3 -I tools/phrase_find.py "https://www.loc.gov/resource/sn83016892/1865-11-22/ed-1/" --sp 2 \
      --phrase "lawful home or employment" --phrase "hire out" --out public/img/ch06/clarion_1122 [--pad 1.0]

Writes OUT.jpg (the page region spanning all the phrases found, padded by `--pad` column widths) and OUT.json:
  {size: [w, h], paper, date, url, phrases: {phrase: [[x, y, w, h], ...one per printed line, in OUT.jpg pixels]}}
OCR is fuzzy: words are compared lowercase with punctuation stripped, and up to 2 OCR-garbled words are tolerated.
"""
import argparse, json, re, subprocess, time
import xml.etree.ElementTree as ET

ap = argparse.ArgumentParser()
ap.add_argument('url'); ap.add_argument('--sp', default='1')
ap.add_argument('--phrase', action='append', required=True)
ap.add_argument('--out', required=True)
ap.add_argument('--pad', type=float, default=0.15, help='padding around the found lines, as a fraction of their width')
ap.add_argument('--max-width', type=int, default=2600)
a = ap.parse_args()


def get(url, params=None, binary=False):
    cmd = ['curl', '-sS', '-L', '--retry', '3', '--max-time', '180', '-G', url]
    for k, v in (params or {}).items():
        cmd += ['--data-urlencode', f'{k}={v}']
    for attempt in range(3):
        r = subprocess.run(cmd, capture_output=True)
        if r.returncode == 0 and r.stdout:
            return r.stdout if binary else r.stdout.decode('utf8', 'replace')
        time.sleep(3 + 3 * attempt)
    raise RuntimeError(url)


norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
info = json.loads(get(a.url.replace('http://', 'https://'), {'sp': a.sp, 'fo': 'json'}))
xml_url = next(p['url'] for p in info['page'] if p.get('url', '').endswith('.xml'))
iiif = 'https://tile.loc.gov/image-services/iiif/' + xml_url.split('storage-services/')[1].rsplit('.', 1)[0].replace('/', ':')  # this page's image, not page 1's
meta = json.loads(get(iiif + '/info.json'))
xml = re.sub(r'(</?)\w+:', r'\1', re.sub(r'\s(xmlns(:\w+)?|\w+:\w+)="[^"]*"', '', get(xml_url)))
root = ET.fromstring(xml)
page = root.find('.//Page')
sx = meta['width'] / float(page.get('WIDTH'))

# every word, in reading order, with the line it sits on
words = []   # (norm, line_id)
lines = []   # [x, y, w, h] in image pixels
for ln in root.iter('TextLine'):
    lid = len(lines)
    lines.append([float(ln.get('HPOS')) * sx, float(ln.get('VPOS')) * sx, float(ln.get('WIDTH')) * sx, float(ln.get('HEIGHT')) * sx])
    for s in ln.iter('String'):
        words.append((norm(s.get('CONTENT', '')), lid, s))

found = {}
from difflib import SequenceMatcher
close = lambda x, y: x == y or (len(y) > 3 and SequenceMatcher(None, x, y).ratio() >= 0.75)
toks = [i for i, w in enumerate(words) if w[0]]
for ph in a.phrase:
    p = [norm(x) for x in ph.split() if norm(x)]
    best = None
    for t0 in range(len(toks)):
        k, ti, used, miss = 0, t0, [], 0
        while k < len(p) and ti < len(toks):
            j = toks[ti]
            w = words[j][0]
            if close(w, p[k]):
                used.append(j); k += 1; ti += 1
            elif ti + 1 < len(toks) and close(w + words[toks[ti + 1]][0], p[k]):   # split across a line end
                used += [j, toks[ti + 1]]; k += 1; ti += 2
            else:
                break
        if k == len(p):
            score = sum(1 - SequenceMatcher(None, words[j][0], '').ratio() for j in used)
            best = used
            break
    if not best:
        print('not found:', ph)
        continue
    best = (0, best)
    # one box per line the phrase touches, spanning just its words
    boxes = {}
    for j in best[1]:
        s = words[j][2]
        x, y, w, h = (float(s.get(t)) * sx for t in ('HPOS', 'VPOS', 'WIDTH', 'HEIGHT'))
        b = boxes.setdefault(words[j][1], [x, y, x + w, y + h])
        b[0], b[1], b[2], b[3] = min(b[0], x), min(b[1], y), max(b[2], x + w), max(b[3], y + h)
    found[ph] = [[b[0], b[1], b[2] - b[0], b[3] - b[1]] for _, b in sorted(boxes.items())]
    print('found:', ph, len(found[ph]), 'line(s)')

if not found:
    raise SystemExit('nothing found')
allb = [b for bs in found.values() for b in bs]
x0, y0 = min(b[0] for b in allb), min(b[1] for b in allb)
x1, y1 = max(b[0] + b[2] for b in allb), max(b[1] + b[3] for b in allb)
# widen to the full column(s) the lines sit in
col = [l for l in lines if l[1] + l[3] > y0 - 400 and l[1] < y1 + 400 and l[0] < x1 and l[0] + l[2] > x0]
if col:
    x0, x1 = min(x0, min(l[0] for l in col)), max(x1, max(l[0] + l[2] for l in col))
pw = (x1 - x0) * a.pad
rx, ry = int(max(0, x0 - pw)), int(max(0, y0 - pw * 2))
rw, rh = int(min(meta['width'] - rx, x1 - x0 + 2 * pw)), int(min(meta['height'] - ry, y1 - y0 + 4 * pw))
scale = min(1.0, a.max_width / rw)
size = f'{int(rw * scale)},' if scale < 1 else 'full'
open(a.out + '.jpg', 'wb').write(get(f'{iiif}/{rx},{ry},{rw},{rh}/{size}/0/default.jpg', binary=True))
out = {'size': [round(rw * scale), round(rh * scale)], 'paper': info.get('item', {}).get('title', ''), 'url': a.url, 'sp': a.sp,
       'phrases': {ph: [[round((b[0] - rx) * scale, 1), round((b[1] - ry) * scale, 1), round(b[2] * scale, 1), round(b[3] * scale, 1)] for b in bs]
                   for ph, bs in found.items()}}
json.dump(out, open(a.out + '.json', 'w'), indent=1)
print(a.out, out['size'])
