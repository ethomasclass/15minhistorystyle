# Patient downloader for Wikimedia Commons files (the shared egress gets 429s): exponential backoff, one at a time.
import hashlib, json, os, subprocess, sys, time, urllib.parse
jobs = json.load(open(sys.argv[1]))
out_dir = sys.argv[2]
for out, name in jobs.items():
    dst = os.path.join(out_dir, out)
    if os.path.exists(dst) and os.path.getsize(dst) > 20000:
        continue
    h = hashlib.md5(name.encode()).hexdigest()
    base = f'https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{urllib.parse.quote(name)}'
    url = base if name.lower().endswith(('.png', '.svg')) else f'https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{urllib.parse.quote(name)}/2400px-{urllib.parse.quote(name)}'
    wait = 20
    for attempt in range(9):
        code = subprocess.run(['curl', '-s', '-L', '-A', 'HistoryResearch/1.0 (educational, low volume)', '-o', dst, '-w', '%{http_code}', url],
                              capture_output=True, text=True).stdout
        if code == '200' and os.path.getsize(dst) > 20000:
            print('ok', out, flush=True); break
        if code in ('400', '404') and 'thumb' in url:
            url = base; continue
        print('retry', out, code, 'wait', wait, flush=True)
        time.sleep(wait); wait = min(240, wait * 2)
    time.sleep(8)
print('done', flush=True)
