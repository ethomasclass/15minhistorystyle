# Joins the pitch-room push (Blender frames in build/pr_push/f) to the IMPERIALISM card at the moment the board fills the
# frame, with the chapter 4 narration underneath: renders/tests/board_push_imperialism.mp4
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vkit import EP, KIT, encode_clip
import card_imperialism as CI

d = os.path.join(EP, 'build', 'pr_push')
n = len([f for f in os.listdir(os.path.join(d, 'f')) if f.endswith('.png')])
json.dump({'dur': n / 30, 'sounds': [], 'press': False, 'grain': 0.35}, open(os.path.join(d, 'events.json'), 'w'))
subprocess.run([sys.executable, os.path.join(KIT, 'encode.py'), d, os.path.join(d, 'silent.mp4')], check=True)
t0 = CI.A - n / 30                                  # the push starts this long before the card
wav = os.path.join(EP, 'public', 'audio', 'ch04_the_pitch_meeting.wav')
a = os.path.join(d, 'clip.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(d, 'silent.mp4'), '-ss', f'{t0:.3f}', '-to', f'{CI.A:.3f}', '-i', wav,
                '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', a], check=True)
CI.S.write(CI.frame)
b = encode_clip(CI.S.name, 'ch04_the_pitch_meeting', CI.A, CI.B, os.path.join(CI.S.dir, 'clip.mp4'))
out = os.path.join(EP, 'renders', 'tests', 'board_push_imperialism.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-i', b, '-filter_complex', '[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][x]',
                '-map', '[v]', '-map', '[x]', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', out], check=True)
print('wrote', out)
