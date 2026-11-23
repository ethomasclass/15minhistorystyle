"""Put a measured silence at every [beat] / [pause] mark in a chapter's script, after voicing (voice.py strips the marks, and
VOICE_MAX_PAUSE shortens the voice's own pauses, so deadpan beats are added back here on purpose).

  python3 tools/beats.py script/ch02_the_question.txt ch02_the_question [seconds=0.6]

Runs tools/pause.py before the three words that follow each mark. Run it once after each (re)voice of the chapter.
"""
import os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
src, stem = sys.argv[1], sys.argv[2]
sec = sys.argv[3] if len(sys.argv) > 3 else "0.6"
text = open(src).read()
for m in re.finditer(r"\[(?:beat|pause)\]", text, re.I):
    rest = re.sub(r"\[[^\]]*\]", " ", text[m.end():])
    words = re.sub(r"[*{}]", "", rest).split()[:3]
    phrase = " ".join(words)
    print(f"{stem}: {sec} s before {phrase!r}")
    subprocess.run([sys.executable, os.path.join(HERE, "pause.py"), stem, phrase, sec], check=True)
