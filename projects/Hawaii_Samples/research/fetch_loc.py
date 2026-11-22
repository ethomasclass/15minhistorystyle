# Download the largest JPEG the Library of Congress serves for each item id; record title, date, call number, rights.
import json, os, subprocess, sys, time
items = json.load(open(sys.argv[1])); out = sys.argv[2]
meta = json.load(open(os.path.join(out, 'loc_meta.json'))) if os.path.exists(os.path.join(out, 'loc_meta.json')) else {}
for name, iid in items.items():
    dst = os.path.join(out, name)
    if os.path.exists(dst) and os.path.getsize(dst) > 20000:
        continue
    j = subprocess.run(['curl', '-s', '-A', 'HistoryResearch/1.0', f'https://www.loc.gov/item/{iid}/?fo=json'], capture_output=True, text=True).stdout
    try:
        d = json.loads(j)
    except Exception:
        print('nojson', name); continue
    it = d.get('item', {})
    urls = []
    for r in d.get('resources', []):
        for fl in r.get('files', []):
            for f in fl:
                if f.get('mimetype') == 'image/jpeg' and f.get('url'):
                    urls.append((f.get('width') or 0, f['url']))
    if not urls:
        urls = [(0, u) for u in d.get('item', {}).get('image_url', [])]
    urls.sort()
    if not urls:
        print('noimg', name); continue
    w, u = urls[-1]
    code = subprocess.run(['curl', '-s', '-L', '-A', 'HistoryResearch/1.0', '-o', dst, '-w', '%{http_code}', u.split('#')[0]], capture_output=True, text=True).stdout
    meta[name] = dict(id=iid, title=it.get('title'), date=it.get('date'), call=it.get('call_number'), rights=(it.get('rights_advisory') or it.get('rights')), url=f'https://www.loc.gov/item/{iid}/', file=u)
    print(code, name, w, (it.get('title') or '')[:70])
    time.sleep(1)
json.dump(meta, open(os.path.join(out, 'loc_meta.json'), 'w'), indent=1)
