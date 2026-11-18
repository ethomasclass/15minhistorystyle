"""Episode 5 scene sounds with ElevenLabs sound generation (costs credits; cached: an existing raw file is never re-bought).
  python3 sfx_ep5.py                 # make every missing sound (the key is read at run time from ELEVEN_KEY_FILE, default below)
  python3 sfx_ep5.py --finish        # re-convert the raws to 44.1 kHz mono wav (free)
-> ../public/sfx/raw/<name>.mp3 (the paid original; git-ignored) and ../public/sfx/<name>.wav
Beds are ambience under a whole scene (looped by scene_mix.py); spots are single events on screen (../script/VISUALS.md).
Every sound is something on screen (channel rule): no whooshes, no page turns. The key is never printed or written anywhere."""
import json, os, subprocess, sys, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'public', 'sfx')
RAW = os.path.join(OUT, 'raw')
KEY_FILE = os.environ.get('ELEVEN_KEY_FILE', '/tmp/claude-0/-home-user-15minhistorystyle/7afe6234-6524-526b-bd0e-87942f84759b/scratchpad/.eleven_key')
NO = ' No music, no modern sounds, no clear words.'
SFX = {
    # beds (looped under a scene by scene_mix.py)
    'bed_river_night': ('A wide river before dawn in 1892 in thick fog: dark water lapping against a wooden landing, a slow current, '
                        'the deep distant rumble of a huge steel mill across the water, a far-off clank of iron now and then, no birds.' + NO, 22),
    'bed_refinery_floor': ('Inside a hot 1880s sugar refinery: big open vats boiling and bubbling, steam hissing from pipes, heavy machinery '
                           'thumping and grinding, a coal shovel scraping now and then, a large echoing brick hall.' + NO, 22),
    'bed_sod_winter': ('Inside a small sod house on the prairie on a winter night in the 1890s: a cast iron stove crackling and ticking, '
                       'the wind howling and gusting outside against a small window, snow hissing on the glass, very quiet inside.' + NO, 22),
    'bed_prairie_wind': ('Open prairie in Nebraska in the 1890s: a steady dry wind through tall grass, a wooden windmill creaking slowly, '
                         'a distant crow, wide open space.' + NO, 22),
    'bed_convention_crowd': ('A huge packed convention hall in 1896: thousands of people murmuring and talking under a high roof, chairs '
                             'creaking, a gavel far off, a big echoing indoor crowd waiting.' + NO, 22),
    'bed_street_crowd': ('A crowd gathered in a city street in the 1890s: many people talking at once outdoors, footsteps on stone, a horse '
                         'and wagon passing, a man calling out in the distance.' + NO, 22),
    # spots (each on a thing on screen)
    'steam_whistle': ('One huge factory steam whistle blasting, long and loud, across a foggy river at night, then echoing away.' + NO, 4),
    'gate_clank': ('A heavy wooden board fence gate pushed open hard and falling over with a crash and a clank of iron hinges.' + NO, 2),
    'door_slam_dust': ('A heavy old wooden door slamming shut hard in an empty corridor, a deep thud, the latch clacking, a short echo.' + NO, 2),
    'stamp_thud': ('One heavy rubber stamp slammed down on paper on a wooden table, a single solid thump.' + NO, 1),
    'corn_flare': ('Dry ears of corn tossed into a burning iron stove: a soft whoomp as they catch, then crackling and popping flames.' + NO, 3),
    'crowd_roar': ('A huge indoor convention crowd suddenly erupting into a roar of cheering and shouting and stamping, then sustaining.' + NO, 6),
    'train_arrive': ('An 1890s steam train pulling into a small town station: chuffing slowing down, brakes squealing, a big hiss of steam, '
                     'a bell clanging.' + NO, 6),
    'fireworks_distant': ('Distant fireworks over a city at night heard from a bridge: soft far-away pops and crackles, a few at a time, '
                          'with light wind.' + NO, 8),
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
