"""Episode 4 scene sounds with ElevenLabs sound generation (costs credits; cached: an existing raw file is never re-bought).
  python3 sfx_ep4.py                 # make every missing sound (the key is read at run time from ELEVEN_KEY_FILE, default below)
  python3 sfx_ep4.py --finish        # re-convert the raws to 44.1 kHz mono wav (free)
-> ../public/sfx/raw/<name>.mp3 (the paid original; git-ignored) and ../public/sfx/<name>.wav
Beds are ambience under a whole scene (looped by scene_mix.py); spots are single events on screen (VISUALS.md section C).
Every sound is something on screen (channel rule): no whooshes, no page turns. The key is never printed or written anywhere."""
import json, os, subprocess, sys, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'public', 'sfx')
RAW = os.path.join(OUT, 'raw')
KEY_FILE = os.environ.get('ELEVEN_KEY_FILE', '/tmp/claude-0/-home-user-15minhistorystyle/7afe6234-6524-526b-bd0e-87942f84759b/scratchpad/.eleven_key')
NO = ' No music, no modern sounds, no clear words.'
SFX = {
    # beds (looped under a scene by scene_mix.py)
    'bed_fire_night': ('A winter night street in the 1880s with a tenement fire nearby: a big fire roaring and crackling, wood snapping, '
                       'a fire bell clanging now and then a little way off, worried voices murmuring in the cold, soft wind.' + NO, 22),
    'bed_clubhouse': ('The back room of a crowded 1880s saloon: a low murmur of men talking and laughing behind a wall, glasses clinking '
                      'now and then, a chair scraping on a wooden floor, a gas lamp hissing softly.' + NO, 22),
    'bed_street_horses': ('A busy 1880s city street: many horses clopping on cobblestones, iron-rimmed wagon wheels rumbling, a horse '
                          'snorting, a horsecar bell far off, crowds of people murmuring.' + NO, 22),
    'bed_winter_kitchen': ('A quiet small tenement kitchen on a winter evening in the 1880s: a coal stove ticking and murmuring as it burns, '
                           'a kettle simmering softly, wind against a window pane, faint street sounds far below.' + NO, 22),
    'bed_election_street': ('An 1880s city street on election day outside a barbershop: a crowd of men murmuring and talking, footsteps on a '
                            'wooden sidewalk, a horse and wagon passing, a man calling out in the distance.' + NO, 22),
    # spots
    'fire_bell': ('An old brass fire alarm bell ringing in the night, a few loud strokes, heard from a city street.' + NO, 4),
    'pumper_gallop': ('A team of horses galloping hard on cobblestones pulling a heavy iron steam fire engine, its brass bell clanging, '
                      'coming closer and stopping.' + NO, 6),
    'coal_chute': ('Coal shovelled from a wagon rattling down a metal chute into a cellar coal bin, a few shovelfuls.' + NO, 5),
    'ledger_stamp': ('One firm rubber stamp pressed down on a ledger page lying on a wooden desk, a single thump.' + NO, 1),
}


def make(name):
    text, dur = SFX[name]
    raw = os.path.join(RAW, name + '.mp3')
    if not os.path.exists(raw):
        key = open(KEY_FILE).read().strip()
        body = {'text': text, 'duration_seconds': dur, 'prompt_influence': 0.5}
        req = urllib.request.Request('https://api.elevenlabs.io/v1/sound-generation', data=json.dumps(body).encode(), method='POST',
                                     headers={'xi-api-key': key, 'Content-Type': 'application/json'})
        try:
            data = urllib.request.urlopen(req, timeout=300).read()
        except urllib.error.HTTPError as e:
            sys.exit(f'ElevenLabs {e.code} for {name}: {e.read().decode()[:300]}')
        open(raw, 'wb').write(data)
        print('bought', name)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-ac', '1', '-ar', '44100', os.path.join(OUT, name + '.wav')], check=True)


if __name__ == '__main__':
    os.makedirs(RAW, exist_ok=True)
    for n in [a for a in sys.argv[1:] if not a.startswith('--')] or SFX:
        if '--finish' in sys.argv and not os.path.exists(os.path.join(RAW, n + '.mp3')):
            continue
        make(n)
    print('done')
