"""Narration: script text -> public/audio/<name>.mp3 + <name>.words.json (word-level timing).

  python3 tools/voice.py script/v1_cold_open.txt v1_cold_open            # ElevenLabs (needs ELEVENLABS_API_KEY, VOICE_ID)
  python3 tools/voice.py script/v1_cold_open.txt v1_cold_open --piper    # offline stand-in voice

Paragraphs are voiced one at a time (ElevenLabs gets the neighbouring paragraphs as context so the
delivery stays continuous) and joined with a short pause. The scenes are timed off the words.json,
so swapping the voice re-times the whole video without touching the animation code.

With eleven_v3 the whole chapter is voiced in one take by default (VOICE_WHOLE=0 for paragraph takes). The script may
carry v3 audio tags in square brackets, e.g. "[curious] But could a rubber tank actually fool anyone?" or "[sighs]";
they are performed, never shown or captioned. VOICE_STABILITY: 0.0 Creative (most expressive), 0.5 Natural (default),
1.0 Robust. Every splice lands at the quietest point between words, with short fades; a take that ends while still
loud is flagged so it can be retaken.
"""
import base64, hashlib, json, os, re, subprocess, sys, tempfile, urllib.request, wave

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public", "audio")
try:
    import imageio_ffmpeg                      # pip install imageio-ffmpeg (full static build)
    FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
except ImportError:
    FFMPEG = "ffmpeg"
RATE = 44100
PARA_GAP = float(os.environ.get("VOICE_PARA_GAP", "0.9"))    # seconds of silence between paragraphs
SENT_GAP = float(os.environ.get("VOICE_SENT_GAP", "0.45"))   # extra breath added after each sentence inside a paragraph
LEAD_IN = 0.4     # silence before the first word
SPEED = float(os.environ.get("VOICE_SPEED", "0.9"))  # ElevenLabs speed, 0.7-1.2
STRETCH = float(os.environ.get("VOICE_STRETCH", "1.0"))  # local pitch-preserving tempo; <1 is slower (v2 ignores SPEED; try 0.93)
MAX_PAUSE = float(os.environ.get("VOICE_MAX_PAUSE", "0"))  # >0: shorten the voice's own pauses to at most this (s)
STABILITY = float(os.environ.get("VOICE_STABILITY", "0.5"))  # v3: 0.0 Creative (most expressive, follows [tags]) / 0.5 Natural / 1.0 Robust
# v3 takes no neighbouring-paragraph context, so voicing paragraph by paragraph resets the delivery at every paragraph.
# By default v3 voices the whole chapter in one take (natural flow, fewer joins) and inserts the paragraph gaps itself.
WHOLE = os.environ.get("VOICE_WHOLE", "1") != "0"
FADE = 0.012      # seconds of fade at every splice and at the end of the take, so nothing ends on a click or mid-sound
QUIET = 120       # RMS (int16) below which a 20 ms window counts as silence (about -49 dBFS; soft word endings sit above it)
TAG = re.compile(r"\[[^\]]*\]\s*")   # ElevenLabs v3 audio tags: [curious], [sighs], [whispers], [sarcastic] ...
CACHE = os.path.join(OUT, "cache")

# Spoken forms for words the voice misreads. Keys are matched as whole words; fill this in per video
# after the pronunciation test (references/voice-and-audio.md). Numbers and years are spelled out by number_words().
PRONOUNCE = {
    "320th": "Three-Twentieth", "23rd": "Twenty-Third", "Takeshita": "Tah-keh-shee-tah", "Bly": "Bligh",
    "barrage": "buh-rahzh",
}
DOLLARS = {"1,000": "one thousand", "5,000": "five thousand", "10,000": "ten thousand"}

ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen " \
       "seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def two(n):
    if n < 20:
        return ONES[n]
    return TENS[n // 10] + ("-" + ONES[n % 10] if n % 10 else "")


def cardinal(n):
    """0 - 999,999 in words ("one hundred thirty-one", "fifteen thousand")."""
    if n >= 1000:
        th, r = divmod(n, 1000)
        return cardinal(th) + " thousand" + (" " + cardinal(r) if r else "")
    if n >= 100:
        h, r = divmod(n, 100)
        return ONES[h] + " hundred" + (" " + two(r) if r else "")
    return two(n)


def year(n):
    """1767 -> seventeen sixty-seven, 1806 -> eighteen oh-six, 1800 -> eighteen hundred, 1919 -> nineteen nineteen,
    2005 -> two thousand five, 2026 -> twenty twenty-six."""
    if 2000 <= n < 2010:
        return cardinal(n)
    hi, lo = divmod(n, 100)
    return two(hi) + (" hundred" if lo == 0 else " oh-" + ONES[lo] if lo < 10 else " " + two(lo))


def average(m):
    """A batting average: .375 -> three seventy-five, .305 -> three oh-five, .400 -> four hundred."""
    d, lo = int(m.group(1)), int(m.group(2))
    return ONES[d] + (" hundred" if lo == 0 else " oh-" + ONES[lo] if lo < 10 else " " + two(lo))


def number_words(text):
    text = re.sub(r"(?<![\w.])\.(\d)(\d\d)\b", average, text)
    text = re.sub(r"\b1([789])00s\b", lambda m: two(int("1" + m.group(1))) + " hundreds", text)
    text = re.sub(r"\b(1[789]\d)0s\b", lambda m: re.sub(r"y$", "ie", year(int(m.group(1) + "0"))) + "s", text)
    text = re.sub(r"(?<![\d,])\b(1[789]\d\d|20\d\d)\b(?!,\d)", lambda m: year(int(m.group(1))), text)
    text = re.sub(r"(?<![\d.])\b\d{1,3}(?:,\d{3})+\b|(?<![\d.,])\b\d+\b(?![.,]\d)", lambda m: cardinal(int(m.group().replace(",", ""))), text)
    return text


def spoken(text):
    text = re.sub(r"\$([\d,]+)", lambda m: DOLLARS.get(m.group(1), m.group(1)) + " dollars", text)
    text = re.sub(r"\bJanuary 1\b", "January first", text)
    for k, v in PRONOUNCE.items():
        text = re.sub(rf"\b{re.escape(k)}\b", v, text)
    return number_words(text)


def env():
    for p in (os.path.join(HERE, "..", ".env"), os.environ.get("VOICE_ENV", "")):
        if p and os.path.exists(p):
            for line in open(p):
                if "=" in line and not line.startswith("#"):
                    k, v = line.strip().split("=", 1)
                    os.environ.setdefault(k, v)


def eleven(text, prev, nxt):
    """Returns (pcm16 mono bytes at RATE, [(char, start, end)])."""
    voice = os.environ["VOICE_ID"]
    model = os.environ.get("ELEVEN_MODEL", "eleven_v3")
    if model.startswith("eleven_v3"):
        # v3: most expressive model; stability is one of 0.0 creative / 0.5 natural / 1.0 robust,
        # and it does not accept neighbouring-paragraph context yet.
        body = {"text": text, "model_id": model,
                "voice_settings": {"stability": STABILITY, "similarity_boost": 0.85, "speed": SPEED}}
    else:
        body = {"text": text, "model_id": model, "previous_text": prev, "next_text": nxt,
                "voice_settings": {"stability": 0.45, "similarity_boost": 0.85, "style": 0.15,
                                   "use_speaker_boost": True, "speed": SPEED}}
    # Responses are cached by request body so re-running (e.g. to change pauses) spends no credits.
    key = hashlib.sha1(json.dumps([voice, body], sort_keys=True).encode()).hexdigest()[:16]
    cached = os.path.join(CACHE, key + ".json")
    if os.path.exists(cached):
        return decode(json.load(open(cached)))
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), method="POST",
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
    try:
        r = json.loads(urllib.request.urlopen(req, timeout=300).read())
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs {e.code}: {e.read().decode()[:400]}")
    os.makedirs(CACHE, exist_ok=True)
    json.dump(r, open(cached, "w"))
    return decode(r)


def decode(r):
    a = r["alignment"]
    chars = list(zip(a["characters"], a["character_start_times_seconds"], a["character_end_times_seconds"]))
    # MP3 works on every plan (raw PCM needs Pro); decode it to PCM here
    pcm = subprocess.run([FFMPEG, "-v", "error", "-f", "mp3", "-i", "-", "-af", f"atempo={STRETCH}",
                          "-f", "s16le", "-ac", "1", "-ar", str(RATE), "-"],
                         input=base64.b64decode(r["audio_base64"]), capture_output=True, check=True).stdout
    return pcm, [(c, s / STRETCH, e / STRETCH) for c, s, e in chars]


def piper(text):
    """Stand-in voice. Piper gives no timestamps, so each sentence is voiced separately and its
    duration is spread over its characters."""
    model = os.environ.get("PIPER_MODEL")
    pcm, chars, t = b"", [], 0.0
    for sent in re.findall(r"[^.?!]+[.?!]*\s*", text):
        with tempfile.NamedTemporaryFile(suffix=".wav") as f:
            subprocess.run(["python3", "-m", "piper", "-m", model, "-f", f.name, "--length-scale", "1.08",
                            "--sentence-silence", "0"], input=sent.strip().encode(), check=True,
                           capture_output=True)
            raw = subprocess.run([FFMPEG, "-v", "error", "-i", f.name, "-f", "s16le", "-ac", "1", "-ar",
                                  str(RATE), "-"], capture_output=True, check=True).stdout
        dur = len(raw) / 2 / RATE
        n = len(sent)
        for i, c in enumerate(sent):
            chars.append((c, t + 0.05 + (dur - 0.1) * i / n, t + 0.05 + (dur - 0.1) * (i + 1) / n))
        pcm += raw + b"\0\0" * int(RATE * 0.22)
        t += dur + 0.22
    return pcm, chars


def _np(pcm):
    import numpy as np
    return np, np.frombuffer(pcm, np.int16).astype(np.float32)


def _fade(x, out):
    """Short linear fade on a float array, in place: the end of x (out) or its start (in)."""
    import numpy as np
    n = min(len(x), int(RATE * FADE))
    if n:
        r = np.linspace(1, 0, n, dtype=np.float32) if out else np.linspace(0, 1, n, dtype=np.float32)
        if out: x[-n:] *= r
        else: x[:n] *= r
    return x


def _join(np, pieces, gaps):
    """Concatenate float pieces with a fade at every inner edge and `gaps[i]` seconds of silence after piece i."""
    out = []
    for i, x in enumerate(pieces):
        x = x.copy()
        if i > 0: _fade(x, out=False)
        if i < len(pieces) - 1: _fade(x, out=True)
        out.append(x)
        if i < len(gaps) and gaps[i] > 0: out.append(np.zeros(int(RATE * gaps[i]), np.float32))
    return np.clip(np.concatenate(out), -32768, 32767).astype(np.int16).tobytes()


def quiet_point(np, a, t0, t1):
    """Sample index of the quietest 10 ms between t0 and t1 seconds (the gap between two words), so a splice never
    lands inside a sound. Falls back to the midpoint when the gap is too short to search."""
    i0, i1 = max(0, int(t0 * RATE)), min(len(a), int(t1 * RATE))
    w = int(RATE * 0.01)
    if i1 - i0 < 3 * w:
        return (i0 + i1) // 2
    best, at = None, (i0 + i1) // 2
    for k in range(i0, i1 - w, w // 2):
        r = float((a[k:k + w] ** 2).mean())
        if best is None or r < best:
            best, at = r, k + w // 2
    return at


def tighten(pcm, chars, max_pause):
    """Shorten every silence in the voice's own delivery that is longer than `max_pause` seconds, cutting from its
    middle-to-late part (two thirds of what's kept stays after the last sound, so word endings ring out), with a short
    fade at each splice, and shift the character timings to match."""
    np, a = _np(pcm)
    win = int(RATE * 0.02)
    n = len(a) // win
    quiet = np.sqrt((a[:n * win].reshape(n, win) ** 2).mean(1)) < QUIET
    cuts, i = [], 0                      # (start_sample, n_samples_removed)
    keep = int(max_pause * RATE)
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]: j += 1
            run = (j - i) * win
            if run > keep and i > 0 and j < n:
                cuts.append((i * win + (keep * 2) // 3, run - keep))
            i = j
        else:
            i += 1
    pieces, prev = [], 0
    for st, k in cuts:
        pieces.append(a[prev:st]); prev = st + k
    pieces.append(a[prev:])

    def shift(t):
        smp = t * RATE
        return (smp - sum(min(k, max(0, smp - st)) for st, k in cuts)) / RATE
    return _join(np, pieces, []), [(c, shift(s), shift(e)) for c, s, e in chars]


def add_pauses(pcm, chars, gap, para_after=(), para_gap=0.0):
    """Insert `gap` seconds of silence after every sentence followed by more speech, and `para_gap` after each char
    index in `para_after` (paragraph ends in a whole-chapter take). Each cut goes at the quietest point between the
    sentence's last sound and the next word, with short fades, and the timings after it shift."""
    np, a = _np(pcm)
    para_after = set(para_after)
    cuts = []                                    # (char index, seconds to insert)
    for i, (c, s, e) in enumerate(chars):
        if c.isspace():
            continue
        nxt = next((k for k in range(i + 1, len(chars)) if not chars[k][0].isspace()), None)
        if nxt is None:
            continue
        if i in para_after:
            cuts.append((i, para_gap))
        elif gap > 0 and c in ".?!" and chars[i + 1][0].isspace():
            cuts.append((i, gap))
    if not cuts:
        return pcm, chars
    pieces, gaps, prev, times = [], [], 0, []
    for i, g in cuts:
        nxt = next(k for k in range(i + 1, len(chars)) if not chars[k][0].isspace())
        at = quiet_point(np, a, chars[i][2], chars[nxt][1])
        pieces.append(a[prev:at]); gaps.append(g); times.append((at / RATE, g)); prev = at
    pieces.append(a[prev:])

    def shift(t):
        return t + sum(g for at, g in times if t >= at)
    return _join(np, pieces, gaps), [(c, shift(s), shift(e)) for c, s, e in chars]


def drop_tags(chars):
    """Remove the characters of [audio tags] from a v3 alignment (they are performed, not spoken)."""
    out, inside = [], False
    for c in chars:
        if c[0] == "[": inside = True
        elif c[0] == "]": inside = False
        elif not inside: out.append(c)
    return out


def finish_take(pcm, label):
    """Fade the very end of a take and warn if it was still loud there (a clipped last word: retake that one)."""
    np, a = _np(pcm)
    tail = a[-int(RATE * 0.04):]
    if len(tail) and float(np.sqrt((tail ** 2).mean())) > 900:
        print(f"  WARNING {label}: the take ends while still loud; the last word may be cut off. Retake it "
              f"(add a word or change punctuation at the end to get a new take).", flush=True)
    return np.clip(_fade(a.copy(), out=True), -32768, 32767).astype(np.int16).tobytes()


def words_from_chars(display, chars, offset):
    """Map timings of the spoken text back onto the words of the display text.
    Words are compared by index, so PRONOUNCE substitutions must keep a 1:1 word count or be
    listed as multi-word; we align by walking both word lists."""
    spoken_words, cur, start = [], "", None
    for c, s, e in chars:
        if c.isspace():
            if cur:
                spoken_words.append((cur, start, last))
            cur, start = "", None
        else:
            if start is None:
                start = s
            cur += c
            last = e
    if cur:
        spoken_words.append((cur, start, last))
    disp = display.split()
    out, j = [], 0
    for w in disp:
        n = len(spoken(w).split())   # a year like 1806 becomes 3 spoken words
        grp = spoken_words[j:j + n]
        j += n
        out.append({"w": w, "s": round(grp[0][1] + offset, 3), "e": round(grp[-1][2] + offset, 3)})
    return out


def parse_marks(para):
    """Strip emphasis markup. *key idea* and {vocab term} may span several words.
    Returns (plain text, [None|'key'|'vocab'] per word)."""
    words, kinds, state = [], [], None
    for tok in para.split():
        kind = state
        if tok.startswith("*"): kind = state = "key"
        elif tok.startswith("{"): kind = state = "vocab"
        if re.search(r"[*}][^\w]*$", tok): state = None
        words.append(tok.replace("*", "").replace("{", "").replace("}", ""))
        kinds.append(kind)
    return " ".join(words), kinds


def forced_align(wav_path, spoken_text):
    """Exact word timings from ElevenLabs forced alignment on the finished audio. v3's own
    timestamps drift by up to ~0.7 s around its natural pauses; this does not. Cached by audio hash."""
    data = open(wav_path, "rb").read()
    key = hashlib.sha1(data + spoken_text.encode()).hexdigest()[:16]
    cached = os.path.join(CACHE, "align_" + key + ".json")
    if not os.path.exists(cached):
        boundary = "----jacksonvideo" + key
        body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"text\"\r\n\r\n{spoken_text}\r\n"
                f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"n.wav\"\r\n"
                f"Content-Type: audio/wav\r\n\r\n").encode() + data + f"\r\n--{boundary}--\r\n".encode()
        req = urllib.request.Request("https://api.elevenlabs.io/v1/forced-alignment", data=body, method="POST",
                                     headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"],
                                              "Content-Type": f"multipart/form-data; boundary={boundary}"})
        try:
            r = json.loads(urllib.request.urlopen(req, timeout=600).read())
        except urllib.error.HTTPError as e:
            sys.exit(f"ElevenLabs alignment {e.code}: {e.read().decode()[:400]}")
        os.makedirs(CACHE, exist_ok=True)
        json.dump(r, open(cached, "w"))
    r = json.load(open(cached))
    return [(w["text"].strip(), w["start"], w["end"]) for w in r["words"] if w["text"].strip()]


def main():
    env()
    src, name = sys.argv[1], sys.argv[2]
    use_piper = "--piper" in sys.argv
    raws = [p.strip() for p in open(src).read().split("\n\n") if p.strip()]
    marked = [parse_marks(TAG.sub("", r).strip()) for r in raws]       # display text: no tags, no marks
    paras = [m[0] for m in marked]
    tts = [spoken(r.replace("*", "").replace("{", "").replace("}", "")) for r in raws]   # tags kept for the voice
    pcm = b"\0\0" * int(RATE * LEAD_IN)
    words = []
    v3 = os.environ.get("ELEVEN_MODEL", "eleven_v3").startswith("eleven_v3")
    if not use_piper and v3 and WHOLE:
        audio, chars = eleven("\n\n".join(tts), "", "")
        chars = drop_tags(chars)
        if MAX_PAUSE > 0:
            audio, chars = tighten(audio, chars, MAX_PAUSE)
        # paragraph ends: the last sound before a newline
        ends = [i for i, (c, s, e) in enumerate(chars) if not c.isspace() and
                any(cc == "\n" for cc, _, _ in chars[i + 1:next((k for k in range(i + 1, len(chars)) if not chars[k][0].isspace()), len(chars))])]
        audio, chars = add_pauses(audio, chars, SENT_GAP, ends, PARA_GAP)
        audio = finish_take(audio, "chapter")
        ws = words_from_chars(" ".join(paras), chars, len(pcm) / 2 / RATE)
        k = 0
        for i, p in enumerate(paras):
            n = len(p.split())
            for w, kind in zip(ws[k:k + n], marked[i][1]):
                if kind: w["k"] = kind
            ws[k + n - 1]["para_end"] = True
            k += n
        words = ws
        pcm += audio + b"\0\0" * int(RATE * PARA_GAP)
        print(f"  whole chapter in one take: {len(audio) / 2 / RATE:.1f}s, {len(paras)} paragraphs", flush=True)
    else:
        for i, p in enumerate(paras):
            offset = len(pcm) / 2 / RATE
            if use_piper:
                audio, chars = piper(spoken(p))
            else:
                audio, chars = eleven(tts[i], tts[i - 1] if i else "", tts[i + 1] if i + 1 < len(paras) else "")
                chars = drop_tags(chars)
                if MAX_PAUSE > 0:
                    audio, chars = tighten(audio, chars, MAX_PAUSE)
                audio, chars = add_pauses(audio, chars, SENT_GAP)
                audio = finish_take(audio, f"paragraph {i + 1}")
            ws = words_from_chars(p, chars, offset)
            for w, k in zip(ws, marked[i][1]):
                if k: w["k"] = k
            words += ws
            words[-1]["para_end"] = True
            pcm += audio + b"\0\0" * int(RATE * PARA_GAP)
            print(f"  paragraph {i + 1}/{len(paras)}: {len(audio) / 2 / RATE:.1f}s", flush=True)
    os.makedirs(OUT, exist_ok=True)
    wav = os.path.join(OUT, name + ".wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes(pcm)
    if not use_piper and not os.environ.get("VOICE_NO_ALIGN"):
        # replace the TTS timestamps with forced-alignment timings, word for word
        aligned = forced_align(wav, " ".join(spoken(p) for p in paras))
        j = 0
        for w in words:
            n = len(spoken(w["w"]).split())
            grp = aligned[j:j + n]
            j += n
            w["s"], w["e"] = round(grp[0][1], 3), round(grp[-1][2], 3)
        assert j == len(aligned), f"alignment word count mismatch: {j} vs {len(aligned)}"
    json.dump({"voice": "piper-placeholder" if use_piper else os.environ.get("VOICE_ID"),
               "duration": round(len(pcm) / 2 / RATE, 3), "words": words},
              open(os.path.join(OUT, name + ".words.json"), "w"), indent=0)
    print(f"wrote {wav} ({len(pcm) / 2 / RATE:.1f}s, {len(words)} words)")


if __name__ == "__main__":
    main()
