"""Voices the Gilded Age Shorts on eleven_v4: Ellis (narrator) and, where a short has a character line, the Kellys
(s3: Nora, "NORA: Don't drop it."). Same multi-voice logic as ../../ep3/script/voice_ep3.py.
   ELEVEN_KEY_FILE=/path/to/key python3 voice_shorts.py            # all shorts
   ELEVEN_KEY_FILE=/path/to/key python3 voice_shorts.py s3         # one short
-> ../public/audio/sN_*.wav + .words.json (word timings from forced alignment; each word carries "who").

Paragraphs that start "MICHAEL:" or "MA:" are character lines. Each run of narrator paragraphs is ONE request
(the model paces them itself); each character line is its own request. Runs are joined with room tone.
Number spelling, room tone, levelling (-18 LUFS) and forced alignment come from the channel's voice.py."""
import glob, json, os, re, subprocess, sys, urllib.error, urllib.request, wave, hashlib

TOOLS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', '.claude', 'skills',
                     '15-minute-history', 'assets', 'template', 'tools')
sys.path.insert(0, os.path.abspath(TOOLS))
import voice as V  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'public', 'audio')
V.CACHE = os.path.join(OUT, 'cache')
os.makedirs(V.CACHE, exist_ok=True)
V.PRONOUNCE = {'Carnegie': 'Car-NAY-ghee', 'Havemeyers': 'HAYV-my-ers', 'laissez-faire': 'lessay-fair', 'solder': 'sodder', 'Delmonico\'s': 'del-MON-ih-kohz', 'quadrilles': 'kwah-DRILLS', 'Alva': 'AL-vuh'}
os.environ['ELEVENLABS_API_KEY'] = open(os.environ['ELEVEN_KEY_FILE']).read().strip()

VOICES = {'NARR': 'mI4rIAStSQeKeqsz4FwM', 'MICHAEL': 'UxeFpulW6hsy9Wt6E0Ai', 'MA': 'ingzPMbrZqU3iFbHVKBR', 'NORA': 'KcWMoaxIjFVVUOiSguJS'}
SETTINGS = {'NARR': {'stability': 0.65, 'similarity_boost': 0.85, 'style': 0.0, 'use_speaker_boost': True, 'speed': 1.0},
            'CHAR': {'stability': 0.45, 'similarity_boost': 0.85, 'style': 0.25, 'use_speaker_boost': True, 'speed': 1.0}}
RUN_GAP = 0.6     # room tone between speakers
END_GAP = 0.9     # after the last paragraph
SPEAKER = re.compile(r'^(MICHAEL|MA|NORA):\s*')
# A line changed after approval is re-voiced alone: its neighbours keep being sent the OLD text as context, so their requests
# (and takes) stay exactly as approved. new tts text -> the tts text it replaced.
# Per-short narrator speed (short-form pacing). s1/s2 were voiced at 1.0 and keep their cached takes.
SPEED = {'s3': 1.2}
# eleven_v4 barely follows `speed`, so a short can also take a local pitch-preserving tempo (V.STRETCH, ffmpeg atempo).
STRETCH = {'s3': 1.08}
# Per-short pause cap (V.tighten: the voice's own silences longer than this are shortened) and gap between speakers.
MAX_PAUSE = {'s3': 0.3}
GAPS = {'s3': (0.3, 0.6)}   # (between speakers, after the last line)
# Character tags the channel's voice.py drops (HUSH: no whispering or going very quiet) are swapped for one it keeps, so
# Nora's line still sounds tense and hushed-in-spirit without the take dropping out of level.
CHAR_TAG = {'[whisper]': '[nervous]'}
CONTEXT_AS = {
    "[dry] And how were the fancy folk, then?": "[dry] And how were the rich?",   # ch04: Ma's voice buzzes on the "ch" of "rich"
}


def request(who, text, prev, nxt, speed=1.0):
    vs = dict(SETTINGS['NARR' if who == 'NARR' else 'CHAR'])
    if who == 'NARR' and speed != 1.0:
        vs['speed'] = speed
    body = {'text': text, 'model_id': 'eleven_v4', 'previous_text': prev, 'next_text': nxt, 'voice_settings': vs}
    key = hashlib.sha1(json.dumps([VOICES[who], body], sort_keys=True).encode()).hexdigest()[:16]
    cached = os.path.join(V.CACHE, key + '.json')
    if not os.path.exists(cached):
        req = urllib.request.Request(
            f'https://api.elevenlabs.io/v1/text-to-speech/{VOICES[who]}/with-timestamps?output_format=mp3_44100_128',
            data=json.dumps(body).encode(), method='POST',
            headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
        try:
            r = json.loads(urllib.request.urlopen(req, timeout=300).read())
        except urllib.error.HTTPError as e:
            sys.exit(f'ElevenLabs {e.code}: {e.read().decode()[:400]}')
        json.dump(r, open(cached, 'w'))
    return V.decode(json.load(open(cached)))


def runs_of(src):
    """[(who, [paragraph, ...])] with consecutive narrator paragraphs merged into one run."""
    runs = []
    for p in (p.strip() for p in open(src).read().split('\n\n')):
        if not p:
            continue
        m = SPEAKER.match(p)
        who, p = (m.group(1), p[m.end():]) if m else ('NARR', p)
        if runs and who == 'NARR' and runs[-1][0] == 'NARR':
            runs[-1][1].append(p)
        else:
            runs.append((who, [p]))
    return runs


def chapter(src):
    name = os.path.basename(src)[:-4]
    runs = runs_of(src)
    for k, v in CHAR_TAG.items():
        runs = [(who, [p.replace(k, v) if who != 'NARR' else p for p in ps]) for who, ps in runs]
    key = name.split('_')[0]
    speed, cap = SPEED.get(key, 1.0), MAX_PAUSE.get(key, 0)
    run_gap, end_gap = GAPS.get(key, (RUN_GAP, END_GAP))
    V.STRETCH = STRETCH.get(key, 1.0)
    raw = ['\n\n'.join(V.tts_text(p) for p in ps) for _, ps in runs]
    tts = [V.spoken(r) for r in raw]
    tts_ctx = [V.spoken(CONTEXT_AS.get(r, r)) for r in raw]
    pcm = b'\0\0' * int(V.RATE * V.LEAD_IN)
    words = []
    bed_src = None
    for i, (who, ps) in enumerate(runs):
        offset = len(pcm) / 2 / V.RATE
        audio, chars = request(who, tts[i], tts_ctx[i - 1] if i else '', tts_ctx[i + 1] if i + 1 < len(runs) else '', speed)
        if cap:
            audio, chars = V.tighten(audio, chars, cap)
        txt = ''.join(c for c, _, _ in chars)
        if V.TAG.search(txt):   # drop the tags' own characters so words map 1:1
            keep = [True] * len(chars)
            for m in V.TAG.finditer(txt):
                for k in range(m.start(), m.end()):
                    keep[k] = False
            chars = [c for c, k in zip(chars, keep) if k]
        marked = [V.parse_marks(p) for p in ps]
        ws = V.words_from_chars(' '.join(m[0] for m in marked), chars, offset)
        kinds = [k for m in marked for k in m[1]]
        n = 0
        for m in marked:
            n += len(m[1]); ws[n - 1]['para_end'] = True
        for w, k in zip(ws, kinds):
            w['who'] = who
            if k: w['k'] = k
        words += ws
        last = i + 1 == len(runs)
        # Room tone comes from the longest take so far: a short character line's quietest 0.2 s can hold the tail of a
        # breath, and looped it flutters faintly between lines (heard between Ma and Nora, ch04).
        if bed_src is None or len(audio) > len(bed_src):
            bed_src = audio
        pcm += V.fade_edges(audio) + V.room_tone(bed_src, end_gap if last else run_gap)
        print(f'  {name} run {i + 1}/{len(runs)} {who}: {len(audio) / 2 / V.RATE:.1f}s', flush=True)
    wav = os.path.join(OUT, name + '.wav')
    with wave.open(wav, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(V.RATE); w.writeframes(pcm)
    subprocess.run([sys.executable, os.path.join(TOOLS, 'level_voice.py'), wav], check=True)
    aligned = V.forced_align(wav, ' '.join(V.spoken(w['w']) for w in words))
    j = 0
    for w in words:
        n = len(V.spoken(w['w']).split())
        grp = aligned[j:j + n]; j += n
        w['s'], w['e'] = round(grp[0][1], 3), round(grp[-1][2], 3)
    assert j == len(aligned), f'alignment word count mismatch: {j} vs {len(aligned)}'
    dur = wave.open(wav).getnframes() / V.RATE
    json.dump({'voices': VOICES, 'model': 'eleven_v4', 'duration': round(dur, 3), 'words': words},
              open(os.path.join(OUT, name + '.words.json'), 'w'), indent=0)
    print(f'wrote {name}.wav ({dur:.1f}s, {len(words)} words)')
    return wav


if __name__ == '__main__':
    only = sys.argv[1:]
    srcs = [s for s in sorted(glob.glob(os.path.join(HERE, 's[0-9]_*.txt'))) if not only or any(os.path.basename(s).startswith(o) for o in only)]
    for s in srcs:
        chapter(s)
    wavs = sorted(glob.glob(os.path.join(OUT, 's[0-9]_*.wav')))
    if False:
        lst = os.path.join(V.CACHE, 'all.txt')
        open(lst, 'w').write(''.join(f"file '{os.path.abspath(w)}'\n" for w in wavs))
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-ac', '1',
                        '-c:a', 'libmp3lame', '-b:a', '128k', os.path.join(OUT, 'ep2_narration.mp3')], check=True)
        total = sum(json.load(open(w[:-4] + '.words.json'))['duration'] for w in wavs)
        print(f'ep2_narration.mp3: {int(total // 60)}:{total % 60:04.1f}')
