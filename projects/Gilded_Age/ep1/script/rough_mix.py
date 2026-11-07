"""Rough mix for listening: the narration with every music cue placed per MUSIC.md, at bed 17 LU under the voice.
  python3 script/rough_mix.py   -> public/audio/ep1_rough_mix.mp3 (positions follow the chapters' current lengths)"""
import json, glob, os, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.join(HERE, '..')
GAP = 17
L = {c['canonical']: c['integrated_lufs'] for c in json.load(open(os.path.join(EP, '../../../music/catalog.json')))['cues'] if c['canonical'].startswith('ga_')}
VOL = {k: round(10 ** ((-18 - GAP - l) / 20), 3) for k, l in L.items()}
D = [json.load(open(f))['duration'] for f in sorted(glob.glob(os.path.join(EP, 'public/audio/ch0*.words.json')))]
S = [sum(D[:i]) for i in range(len(D) + 1)]
w9 = json.load(open(sorted(glob.glob(os.path.join(EP, 'public/audio/ch09*.words.json')))[0]))['words']
w7 = json.load(open(sorted(glob.glob(os.path.join(EP, 'public/audio/ch07*.words.json')))[0]))['words']
end9 = S[8] + next(w['s'] for w in w9 if w['w'] == 'So' and w['s'] > 50) - 0.5      # "So how did America get so rich" (the ending)
kel = S[6] + next(w['s'] for w in w7 if w['w'] == 'That') - 0.5                       # "That night"
C = [('ga_gilded_theme', 0, 0, S[1]), ('ga_noon_twice', S[1], 0, S[2]), ('ga_age_of_steel', S[2], 0, S[3]), ('ga_sugar_house', S[3], 0, S[4]),
     ('ga_weavers_son', S[4], 0, S[5]), ('ga_the_squeeze', S[5], 0, kel), ('ga_kellys', kel, 0, S[7]), ('ga_heroes_or_villains', S[7], 0, S[8]),
     ('ga_bad_wire', S[8], 0, end9), ('ga_gilded_theme', end9, 118 - (S[9] - end9), S[9])]
args = ['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(EP, 'public/audio/ep1_narration.mp3')]; fl = []
for i, (c, st, off, en) in enumerate(C, 1):
    args += ['-ss', str(off), '-i', os.path.join(EP, f'public/music/{c}.mp3')]; d = en - st
    fl.append(f"[{i}]atrim=0:{d},asetpts=PTS-STARTPTS,volume={VOL[c]},afade=t=in:d=0.8,afade=t=out:st={max(0, d - 1.2)}:d=1.2,aformat=channel_layouts=stereo,adelay={int(st * 1000)}|{int(st * 1000)}[m{i}]")
fl.append('[0]aformat=channel_layouts=stereo[v]')
fl.append('[v]' + ''.join(f'[m{i}]' for i in range(1, len(C) + 1)) + f'amix=inputs={len(C) + 1}:normalize=0,loudnorm=I=-14:TP=-1.5[out]')
args += ['-filter_complex', ';'.join(fl), '-map', '[out]', '-ar', '44100', '-b:a', '160k', os.path.join(EP, 'public/audio/ep1_rough_mix.mp3')]
subprocess.run(args, check=True); print('ep1_rough_mix.mp3', round(S[9], 1), 's')
