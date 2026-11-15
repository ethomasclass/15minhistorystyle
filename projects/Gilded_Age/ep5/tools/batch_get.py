"""Download a list of images: python3 tools/batch_get.py list.txt
Each line: <ident> <topic/file.jpg>   (ident as for find_images.py get; '#' starts a comment). Existing files are skipped.
Credits go to public/img/credits.json as with find_images.py."""
import os, subprocess, sys, time
HERE = os.path.dirname(os.path.abspath(__file__)); IMG = os.path.join(HERE, '..', 'public', 'img')
for line in open(sys.argv[1]):
    line = line.split('#')[0].strip()
    if not line:
        continue
    ident, dest = line.rsplit(' ', 1)
    out = os.path.join(IMG, dest)
    if os.path.exists(out):
        continue
    try:
        r = subprocess.run([sys.executable, os.path.join(HERE, 'find_images.py'), 'get', ident, out], capture_output=True, text=True, timeout=600)
    except subprocess.TimeoutExpired:
        print('timed out |', dest, flush=True); continue
    if ident.startswith('commons:'):
        time.sleep(4)   # Wikimedia rate-limits bursts of full-size downloads
    print((r.stdout + r.stderr).strip().splitlines()[-1] if (r.stdout + r.stderr).strip() else 'no output', '|', dest, flush=True)
