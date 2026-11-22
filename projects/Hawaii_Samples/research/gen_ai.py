# Free AI images from Pollinations, one every ~50 s (its free limit), retrying on 402/429.
import json, subprocess, sys, time, urllib.parse, os
jobs = json.load(open(sys.argv[1])); out = sys.argv[2]
for name, (prompt, seed) in jobs.items():
    dst = os.path.join(out, name)
    if os.path.exists(dst) and os.path.getsize(dst) > 20000:
        continue
    url = f'https://image.pollinations.ai/prompt/{urllib.parse.quote(prompt)}?width=1024&height=576&nologo=true&seed={seed}'
    for attempt in range(6):
        code = subprocess.run(['curl', '-s', '-L', '--max-time', '240', '-o', dst, '-w', '%{http_code}', url], capture_output=True, text=True).stdout
        if code == '200' and os.path.getsize(dst) > 20000:
            print('ok', name, flush=True); break
        print('retry', name, code, flush=True); time.sleep(55)
    time.sleep(52)
print('done', flush=True)
