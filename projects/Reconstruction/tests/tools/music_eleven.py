"""Music cues from ElevenLabs Music, one per scene, saved to public/music/<name>.mp3 (+ a local .wav).
Music costs roughly 850 credits per minute, so cues are short and reused rather than wall-to-wall.

  python3 tools/music_eleven.py cold_open
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
CUES = {
    # Reconstruction (1865-1877), prefix rc_. Period instruments: fretless banjo, fiddle, saxhorn brass band, reed
    # harmonium, upright parlor piano, field drum. No named tunes (the real period recordings are in ../music/period).
    "rc_jubilo": ("Hopeful but fragile underscore for 1865, the first months of freedom after the American Civil War: a gently "
                  "picked fretless banjo and a warm, plain fiddle trade a simple folk melody in the spirit of an 1860s jubilee "
                  "song, soft hand-drum pulse, upright bass; quietly joyful at first, then the second half thins to the fiddle "
                  "alone with a hint of doubt, ending on an open, unresolved chord. Instrumental only, no vocals, no choir. Documentary underscore, restrained and textured, period instruments without pastiche, leaves clear space in the midrange for a narrator.", 80000),
    "rc_brass_dirge": ("A distant 1860s brass band of saxhorns and a muffled field drum playing a slow, solemn funeral march in "
                       "April 1865, heard from far away, a single cornet line over low horns; one restrained swell in the middle, "
                       "then it fades into near-silence. Instrumental only, no vocals, no choir. Documentary underscore, restrained and textured, period instruments without pastiche, leaves clear space in the midrange for a narrator.", 70000),
    "rc_codes": ("Grave, cold, legalistic underscore for laws written to keep freed people working without pay (1865): a slow "
                 "ticking pocket-watch pulse, a walking pizzicato bass, a solemn reed harmonium chord progression, and a single "
                 "fiddle line that sounds trapped, circling the same few notes; tension tightens slowly, never melodramatic, "
                 "ends on a held dark chord. Instrumental only, no vocals, no choir. Documentary underscore, restrained and textured, period instruments without pastiche, leaves clear space in the midrange for a narrator.", 70000),
    "rc_night_riders": ("Dread for night violence in the rural South around 1870: a low droning fiddle with slow scraping bows, "
                        "a muffled, irregular hoofbeat rhythm on a frame drum that comes closer and passes, distant low brass, "
                        "creaking wood; cold and quiet rather than loud, ends on a single low unresolved drone. Instrumental only, no vocals, no choir. Documentary underscore, restrained and textured, period instruments without pastiche, leaves clear space in the midrange for a narrator.", 75000),
    "rc_parlor": ("Gilded Age parlor in the 1870s North: an upright piano and a reed harmonium play a polite, slightly out-of-tune "
                  "waltz, comfortable and complacent; gradually the harmony sours, a low cello note of unease creeps in under the "
                  "waltz, which carries on as if nothing is wrong; ends politely on a wrong-sounding chord. Instrumental only, no vocals, no choir. Documentary underscore, restrained and textured, period instruments without pastiche, leaves clear space in the midrange for a narrator.", 70000),
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
