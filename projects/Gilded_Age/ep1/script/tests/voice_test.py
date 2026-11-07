"""Gilded Age voice tests on eleven_v4: narrator (Ellis, kept even) + the Kellys. Key from ELEVEN_KEY_FILE (never in the repo).
   python3 voice_test.py   -> pronunciation.mp3, scene_bridge.mp3, scene_dinner.mp3"""
import os, re, json, hashlib, subprocess, urllib.request
KEY = open(os.environ['ELEVEN_KEY_FILE']).read().strip()
VOICES = {'NARR': 'mI4rIAStSQeKeqsz4FwM', 'MICHAEL': 'UxeFpulW6hsy9Wt6E0Ai', 'MA': 'ingzPMbrZqU3iFbHVKBR'}
# the narrator stays fairly even (teacher); the characters get a little more life
SETTINGS = {'NARR': {'stability': 0.65, 'similarity_boost': 0.85, 'style': 0.0, 'use_speaker_boost': True, 'speed': 1.0},
            'CHAR': {'stability': 0.45, 'similarity_boost': 0.85, 'style': 0.25, 'use_speaker_boost': True, 'speed': 1.0}}
PRONOUNCE = {'Carnegie': 'Car-NAY-gee', 'Havemeyers': 'HAYV-my-ers', 'laissez-faire': 'lessay-fair', 'solder': 'sodder'}
CACHE = os.path.join(os.path.dirname(__file__) or '.', 'cache'); os.makedirs(CACHE, exist_ok=True)

def say(who, text):
    for k, v in PRONOUNCE.items(): text = re.sub(r'\b%s\b' % re.escape(k), v, text)
    text = text.replace('*', '')
    vid = VOICES[who]; body = {'text': text, 'model_id': 'eleven_v4', 'voice_settings': SETTINGS['NARR' if who == 'NARR' else 'CHAR']}
    h = hashlib.sha1(json.dumps([vid, body], sort_keys=True).encode()).hexdigest()[:16]; out = os.path.join(CACHE, h + '.mp3')
    if not os.path.exists(out):
        req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128', data=json.dumps(body).encode(),
                                     headers={'xi-api-key': KEY, 'Content-Type': 'application/json'})
        open(out, 'wb').write(urllib.request.urlopen(req, timeout=120).read())
    return out

def build(name, lines, gap=0.7):
    parts = [say(w, t) for w, t in lines]
    sil = os.path.join(CACHE, f'sil{gap}.mp3')
    if not os.path.exists(sil): subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', f'anullsrc=r=44100:cl=mono', '-t', str(gap), '-c:a', 'libmp3lame', '-b:a', '128k', sil], check=True)
    lst = os.path.join(CACHE, name + '.txt')
    open(lst, 'w').write(''.join(f"file '{os.path.abspath(p)}'\nfile '{os.path.abspath(sil)}'\n" for p in parts))
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '128k', name + '.mp3'], check=True)
    print('wrote', name + '.mp3')

build('pronunciation', [('NARR', s) for s in [
    "Andrew Carnegie said his own name Car-NAY-gee, so that's how we'll say it.",
    "Michael works at the Havemeyers and Elder sugar refinery in Brooklyn.",
    "Then came the Bessemer process: blow air through melted iron, and the air burns out the extra carbon.",
    "The idea was called laissez-faire: French for let them do it.",
    "John D. Rockefeller grew up on farms in upstate New York.",
    "Chasing more money was one of the worst species of idolatry.",
    "He got a machine to seal oil cans with thirty-nine drops of solder, a metal glue, instead of forty.",
    "At twelve, Andrew was changing spools of thread in a cotton mill near Pittsburgh.",
]], gap=0.9)

build('scene_bridge', [
    ('NARR', "On the day the Brooklyn Bridge opened, a hundred and fifty thousand people walked across it. And some of the steel wire holding them up... had already failed its safety test."),
    ('NARR', "Nobody in that crowd knew. Not even the nineteen-year-old who works ten-hour shifts in a sugar factory across the river."),
    ('MICHAEL', "[amazed] Would you look at it. You can see the whole river from up here."),
    ('NARR', "That's Michael Kelly. He's made up. But everything that happens to him really happened to people like him."),
])
build('scene_dinner', [
    ('NARR', "Michael didn't change jobs. Same heat. Same long shifts. But the refinery down the street wasn't a rival anymore. It was the same company. If he didn't like the pay, there were a lot fewer places to go."),
    ('NARR', "That night, the family eats by the light of a kerosene lamp."),
    ('MA', "So. Same work, same pay, is it?"),
    ('MICHAEL', "Same work. Same pay. Only now the place down the street has the same boss."),
    ('MA', "[dry] Well. The rent's the same too. Pass me that lamp, love."),
    ('NARR', "That lamp burns kerosene. Most likely, Rockefeller's kerosene. One monopoly lighting the table, after a day working for another."),
], gap=0.55)
