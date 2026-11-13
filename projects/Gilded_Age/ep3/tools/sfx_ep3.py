"""Episode 3 scene sounds with ElevenLabs sound generation (costs credits; cached: an existing raw file is never re-bought).
  ELEVEN_KEY_FILE=/path/to/key python3 sfx_ep3.py            # make every missing sound
  python3 sfx_ep3.py --finish                                # re-convert raws to 44.1 kHz mono wav (free)
-> ../public/sfx/raw/<name>.mp3 (the paid original) and ../public/sfx/<name>.wav
Beds are ambience under a whole dialog scene (looped by scene_mix.py); spots are single events on screen.
Every sound is something on screen (channel rule): no whooshes, no page turns."""
import json, os, subprocess, sys, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'public', 'sfx')
RAW = os.path.join(OUT, 'raw')
NO = ' No music, no modern sounds, no clear words.'
SFX = {
    # beds (looped)
    'bed_harbor_dusk': ('Evening harbor ambience in 1880s New York: water lapping against a stone sea wall, distant seagulls, '
                        'wooden boats creaking at their moorings, a ship bell far away, a faint murmur of people on a waterfront.' + NO, 20),
    'bed_steerage': ('Below deck in a crowded nineteenth century steamship: the wooden hull creaking slowly with the swell, a deep '
                     'steady engine thrum through the walls, water sloshing against the hull, faint tired murmurs far away.' + NO, 20),
    'bed_rotunda': ('A large round stone hall full of newly arrived immigrants in the 1880s: many quiet overlapping voices in different '
                    'European languages, indistinct, shuffling footsteps, bundles set down, big reverberant room.' + NO, 20),
    'bed_market': ('A busy 1880s pushcart street market in a crowded immigrant neighborhood: lively indistinct bargaining voices, a '
                   'vendor calling out in the distance, wooden cart wheels on cobblestones, a horse clopping past.' + NO, 20),
    'bed_sweatshop': ('A small crowded room used as a sewing workshop: two treadle sewing machines whirring steadily, a heavy flat iron '
                      'thumping on a pressing board with a short hiss of steam now and then, cloth rustling.' + NO, 20),
    'bed_brooklyn_street': ('A quiet 1880s city side street in late afternoon: a horse and wagon on cobblestones, a horse-drawn '
                            'streetcar bell in the distance, children playing far off, a door closing down the block.' + NO, 20),
    'bed_kitchen_evening': ('A quiet small tenement kitchen in the evening, 1880s: a wall clock ticking, a kettle simmering softly on a coal '
                            'stove, faint street sounds through a closed window.' + NO, 20),
    # spots
    'door_knock': ('Three firm knocks on an old wooden apartment door, heard from inside a small quiet room.' + NO, 2),
    'door_open': ('An old wooden door with an iron latch opening slowly with a soft creak, inside a small room.' + NO, 2),
    'trunk_lift': ('A heavy wooden steamer trunk lifted off stone pavement, a short scrape and a thump of the handle.' + NO, 2),
    'trunk_thump': ('A heavy wooden trunk set down on stone steps, one dull thud.' + NO, 1.5),
}


def make(name):
    text, dur = SFX[name]
    raw = os.path.join(RAW, name + '.mp3')
    if not os.path.exists(raw):
        key = open(os.environ['ELEVEN_KEY_FILE']).read().strip()
        body = {'text': text, 'duration_seconds': dur, 'prompt_influence': 0.5}
        req = urllib.request.Request('https://api.elevenlabs.io/v1/sound-generation', data=json.dumps(body).encode(), method='POST',
                                     headers={'xi-api-key': key, 'Content-Type': 'application/json'})
        try:
            open(raw, 'wb').write(urllib.request.urlopen(req, timeout=300).read())
        except urllib.error.HTTPError as e:
            sys.exit(f'ElevenLabs {e.code}: {e.read().decode()[:300]}')
        print('bought', name)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-ac', '1', '-ar', '44100', os.path.join(OUT, name + '.wav')], check=True)


if __name__ == '__main__':
    os.makedirs(RAW, exist_ok=True)
    for n in SFX:
        if '--finish' in sys.argv and not os.path.exists(os.path.join(RAW, n + '.mp3')):
            continue
        make(n)
    print('done')
