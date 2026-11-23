"""Flag sentences in a narration take that drop well below the chapter's level (whispers, trailing off).
The user's note (Nov 2026): never whisper to the audience or get super quiet.
   python3 tools/quiet_check.py public/audio/v2_ch*.wav        (exit 1 if any sentence is more than LIMIT dB under the median)"""
import glob, json, re, sys, wave
import numpy as np
LIMIT = 4.5
bad = 0
for wav in [p for a in sys.argv[1:] for p in sorted(glob.glob(a))]:
    w = wave.open(wav); sr = w.getframerate(); ch = w.getnchannels()
    a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, ch).mean(1).astype(float) / 32768
    W = json.load(open(wav[:-4] + '.words.json')); W = W['words'] if isinstance(W, dict) else W
    sents, cur = [], []
    for x in W:
        cur.append(x)
        if re.search(r'[.?!]["”]?$', x['w']): sents.append(cur); cur = []
    if cur: sents.append(cur)
    def db(s, e):
        seg = a[int(s * sr):int(e * sr)]; k = sr // 50
        fr = seg[:len(seg) // k * k].reshape(-1, k)
        if not len(fr): return -99.0
        r = np.sort(np.sqrt((fr ** 2).mean(1)))[len(fr) // 2:]   # voiced half of the 20 ms frames
        return 20 * np.log10(r.mean() + 1e-9)
    L = [(db(s[0]['s'], s[-1]['e']), s[0]['s'], ' '.join(x['w'] for x in s)) for s in sents]
    med = float(np.median([d for d, _, _ in L]))
    q = [(d - med, t, txt) for d, t, txt in L if d - med < -LIMIT]
    print(f"{wav.split('/')[-1]}: median {med:.1f} dB, {len(q)} quiet")
    for d, t, txt in q: print(f"   {d:+.1f} dB @{t:6.1f}s  {txt[:90]}")
    bad += len(q)
sys.exit(1 if bad else 0)
