"""Rebuild SCRIPT.md from the chapter files (narration) + the hand-written notes below the chapters."""
import glob, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
NAMES = {
    'ch01': 'Cold Open: The Sheet Music', 'ch02': 'The Back Door', 'ch03': 'A Spy, a Hatchet and a Deathbed',
    'ch04': 'A City Sitting Up at Night', 'ch05': 'Why Italian Grocers?', 'ch06': 'Gretna',
    'ch07': 'A Letter from Hell', 'ch08': 'The Last Door', 'ch09': 'So Who Was the Axeman?',
}
files = sorted(glob.glob(os.path.join(HERE, 'ch*.txt')))
words = sum(len(re.sub(r'[*{}]', '', open(f).read()).split()) for f in files)
out = ['# Jazz It Out: The Axeman of New Orleans', '',
       f'**15 Minute History** · narration script · {words:,} words · about {words / 185:.0f} minutes of narration '
       '(about 9:20–9:40 finished, with the intro, title card and logo breaks)', '',
       '**Driving question (cold open, answered in the last chapter):** How did a killer get a whole city to throw him a party?',
       '**Answer:** He probably didn\'t. The attacks and the fear were real; newspapers gave the fear a name; innocent people were '
       'blamed again and again; and a letter that was almost certainly a prank gave a frightened city something to do with its fear. '
       'The party was real. The invitation almost certainly wasn\'t.', '',
       'Audience: general (no vocab cards). Chapter 6 is the heavy chapter: `quiet` palette, longer pauses (same voice speed), no jokes.', '',
       'Timestamps are estimates at the locked pace (~185 wpm) and get re-timed after voicing.', '', '---', '']
t = 0.0
for i, f in enumerate(files):
    stem = os.path.basename(f)[:4]
    txt = open(f).read().strip()
    out += [f'## {int(t // 60)}:{int(t % 60):02d} | {NAMES.get(stem, stem)}', '', txt, '']
    n = len(re.sub(r'[*{}]', '', txt).split())
    t += n / (165 if stem == 'ch06' else 185) * 60 + (10 if i == 0 else 2.5)
for name, title in (('plug_mid', 'Mid-video plug (end of ch04)'), ('plug_end', 'End plug (over the end screen)')):
    out += [f'## {title}', '', open(os.path.join(HERE, name + '.txt')).read().strip(), '']
out += ['---', '', open(os.path.join(HERE, '_notes.md')).read().strip(), '']
open(os.path.join(HERE, 'SCRIPT.md'), 'w').write('\n'.join(out))
print('SCRIPT.md', words, 'words, est', f'{int(t // 60)}:{int(t % 60):02d}')
