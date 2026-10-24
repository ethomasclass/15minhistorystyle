"""Music cues from ElevenLabs Music, saved to public/music/<name>.mp3 (+ a local .wav, git-ignored).

  python3 tools/music_eleven.py rc_codes                 # one cue
  python3 tools/music_eleven.py rc_jubilo rc_parlor      # several

Needs ELEVENLABS_API_KEY in the project's .env (git-ignored; the same key as the narration). Music costs roughly 850
credits a minute: check the budget first (GET https://api.elevenlabs.io/v1/user/subscription, character_count of
character_limit) and keep cues 60-80 s, reused across chapters.

The recipe that worked for Reconstruction (Oct 2026), one prompt per mood the video needs:
  1. The moment and its period, in plain words ("laws written to keep freed people working without pay (1865)").
  2. Period instruments by name (fretless banjo, fiddle, saxhorn brass band, reed harmonium, upright parlor piano,
     field drum), never a named song or artist (the real period recordings come from tools/jukebox.py instead).
  3. How it moves over its length (hopeful, then the second half thins to the fiddle with a hint of doubt) and how
     it ends (a held dark chord, an open unresolved chord, fades to near-silence): the end is what the chapter tail
     lifts (TAIL_LIFT), so ask for one worth hearing.
  4. The standard suffix (TAIL below): instrumental, no choir, restrained, room for a narrator.
  5. The length in milliseconds.
After generating: measure loudness (ffmpeg -i x.mp3 -af loudnorm=print_format=summary -f null -) and set the bed from
it (ElevenLabs comes out quiet, -16 to -19.5 LUFS, so beds run ~0.17-0.24 where a -12 LUFS cue runs 0.13); listen to
the first 30-40 s, which is what most chapters use; then add the cue to the style repo's music library
(music/cues/ + a row in music/README.md + an entry in music/catalog.json with its prompt) under the video's prefix.
"""
import json, os, subprocess, sys, urllib.error, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from voice import FFMPEG, env  # noqa: E402

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "music")

# Every cue is instrumental, sparse in the narration's frequency range, and period-flavoured
# (fiddle, cello, fife, snare, piano-forte) without being a pastiche.
# Write one cue per mood the video needs (cold open, wry middle, intrigue, grief, heavy chapter, ending) and
# reuse them across chapters. Every prompt: instrumental only, no vocals, leaves room for a narrator,
# period-flavoured instruments without pastiche, and the length in milliseconds.
# Every prompt ends with this, so cues sound like one series and leave room for the voice.
TAIL = ("Instrumental only, no vocals, no choir. Documentary underscore, restrained and textured, period instruments without pastiche, leaves clear space in the midrange for a narrator.")

CUES = {
    "cold_open": ("Tense, restrained documentary underscore for a history explainer about an 1806 pistol duel "
                  "in Tennessee. Low solo cello and string drones, sparse plucked pizzicato, a soft ticking "
                  "pulse, distant frame drum heartbeat, a lonely fiddle line. Slow build of suspense, then a "
                  "held, unresolved chord. Instrumental only, no vocals, leaves room for a narrator.", 62000),
    "good_feelings": ("Light, warm, slightly wry documentary underscore for a history explainer about the calm "
                      "'Era of Good Feelings' in 1820s America. Gentle plucked strings, a lilting parlor "
                      "fiddle melody, soft fife, piano-forte, a relaxed walking pulse; pleasant and a little "
                      "too cozy, with a faint hint of mischief near the end. Instrumental only, no vocals, "
                      "leaves room for a narrator.", 90000),
    # Reconstruction (1865-1877), prefix rc_ (the recipe in the docstring; all five are in the music library).
    "rc_codes": ("Grave, cold, legalistic underscore for laws written to keep freed people working without pay (1865): a slow "
                 "ticking pocket-watch pulse, a walking pizzicato bass, a solemn reed harmonium chord progression, and a single "
                 "fiddle line that sounds trapped, circling the same few notes; tension tightens slowly, never melodramatic, "
                 "ends on a held dark chord. " + TAIL, 70000),
    "rc_jubilo": ("Hopeful but fragile underscore for 1865, the first months of freedom after the American Civil War: a gently "
                  "picked fretless banjo and a warm, plain fiddle trade a simple folk melody in the spirit of an 1860s jubilee "
                  "song, soft hand-drum pulse, upright bass; quietly joyful at first, then the second half thins to the fiddle "
                  "alone with a hint of doubt, ending on an open, unresolved chord. " + TAIL, 80000),
}


def generate(name):
    prompt, ms = CUES[name]
    body = {"prompt": prompt, "music_length_ms": ms, "force_instrumental": True}
    req = urllib.request.Request("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128",
                                 data=json.dumps(body).encode(), method="POST",
                                 headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"],
                                          "Content-Type": "application/json"})
    try:
        mp3 = urllib.request.urlopen(req, timeout=600).read()
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs music {e.code}: {e.read().decode()[:500]}")
    os.makedirs(OUT, exist_ok=True)
    src = os.path.join(OUT, name + ".mp3")
    open(src, "wb").write(mp3)
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", src, "-ar", "44100", "-ac", "2",
                    os.path.join(OUT, name + ".wav")], check=True)
    print("music/", name)


if __name__ == "__main__":
    env()
    for n in sys.argv[1:] or list(CUES):
        generate(n)
