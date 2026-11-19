"""Scratch narration with real word timings, for test clips and animatics when the ElevenLabs voice isn't available:
a local Piper voice (not the channel voice) reads the chapter, and its phoneme alignments become word timestamps in
the same words.json format as tools/voice.py, so every t.at('phrase') anchor works and re-times itself when the
real voice replaces it. Never ship a render made from this.

  python3 -I tools/scratch_voice.py script.txt NAME --model en_US-ryan-high.onnx [--speed 1.0]

Needs: pip install piper-tts onnx; a Piper voice (.onnx + .onnx.json) from huggingface.co/rhasspy/piper-voices.
"""
import argparse, json, os, re, sys, wave
import numpy as np
from piper import PiperVoice, SynthesisConfig

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from voice import parse_marks, spoken  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('name')
ap.add_argument('--model', required=True)
ap.add_argument('--speed', type=float, default=1.0, help='>1 is faster')
a = ap.parse_args()
OUT = os.path.join(HERE, '..', 'public', 'audio')
LEAD_IN, PARA_GAP, SENT_GAP = 0.4, 0.45, 0.12

v = PiperVoice.load(a.model, include_alignments=True)
cfg = SynthesisConfig(length_scale=1 / a.speed)
SR = v.config.sample_rate
STRESS = set('ˈˌː')

audio, words, t = [np.zeros(int(LEAD_IN * SR), np.int16)], [], LEAD_IN
paras = [parse_marks(p.strip()) for p in open(a.src).read().split('\n\n') if p.strip()]
for text, kinds in paras:
    toks = text.split()
    # sentences, keeping each token's index
    sents, cur = [], []
    for i, w in enumerate(toks):
        cur.append(i)
        if re.search(r'[.?!]["”’)]*$', w):
            sents.append(cur); cur = []
    if cur:
        sents.append(cur)
    for idxs in sents:
        line = ' '.join(spoken(toks[i]) for i in idxs)
        chunks = list(v.synthesize(line, syn_config=cfg, include_alignments=True))
        # phoneme words with their sample spans
        pw, start, n = [], 0, 0
        segs = []
        for c in chunks:
            for al in c.phoneme_alignments or []:
                ph = al.phoneme
                if ph == ' ' or ph in ',.;:!?—':
                    if pw:
                        segs.append((start, n, ''.join(pw))); pw = []
                    n += int(al.num_samples); start = n
                    continue
                if ph in '^$_':
                    n += int(al.num_samples); start = n if not pw else start
                    continue
                if not pw:
                    start = n
                pw.append(ph); n += int(al.num_samples)
            if pw:
                segs.append((start, n, ''.join(pw))); pw = []
        clip = np.concatenate([c.audio_int16_array for c in chunks]) if chunks else np.zeros(1, np.int16)
        # each text token covers as many spoken words as its expansion ("1865" -> four)
        sizes = [max(1, len(spoken(toks[i]).split())) for i in idxs]
        if len(segs) == sum(sizes):
            k = 0
            for i, s in zip(idxs, sizes):
                b, e = segs[k][0], segs[k + s - 1][1]; k += s
                words.append((i, t + b / SR, t + e / SR))
        else:   # espeak merged or split words: spread by letters across the voiced span
            voiced = [p for p in segs] or [(0, len(clip), '')]
            b0, e0 = voiced[0][0], voiced[-1][1]
            lens = [len(re.sub(r'\W', '', spoken(toks[i]))) or 1 for i in idxs]
            tot, acc = sum(lens), 0
            for i, L in zip(idxs, lens):
                b = b0 + (e0 - b0) * acc / tot; acc += L
                e = b0 + (e0 - b0) * acc / tot
                words.append((i, t + b / SR, t + e / SR))
        audio.append(clip); t += len(clip) / SR
        gap = np.zeros(int(SENT_GAP * SR), np.int16); audio.append(gap); t += SENT_GAP
    # paragraph's words, in order
    base = len(words) - len(toks)
    out = []
    for (i, s, e), k in zip(words[base:], kinds):
        item = {'w': toks[i], 's': round(s, 3), 'e': round(e, 3)}
        if k:
            item['k'] = k
        out.append(item)
    out[-1]['para_end'] = True
    words[base:] = out
    audio.append(np.zeros(int(PARA_GAP * SR), np.int16)); t += PARA_GAP

os.makedirs(OUT, exist_ok=True)
with wave.open(os.path.join(OUT, a.name + '.wav'), 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes(np.concatenate(audio).tobytes())
json.dump({'voice': 'scratch-piper', 'duration': round(t, 3), 'words': words}, open(os.path.join(OUT, a.name + '.words.json'), 'w'), indent=0)
print(f'scratch {a.name}: {t:.1f}s, {len(words)} words')
