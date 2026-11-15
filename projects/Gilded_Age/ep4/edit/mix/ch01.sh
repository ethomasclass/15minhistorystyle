# ch01 music and one-shots (build_ch.sh sources this). Cue names are Ep 4's (mix/cues.tsv gives the stand-ins).
# ga_the_fire (stand-in ga_not_welcome, -14.8 LUFS): 0.095 puts it about 17 LU under the voice, as Ep 3; it runs the whole cold open.
# The scene bed (fire, bell, the pumper's gallop) is in ch01...fx.wav (../tools/scene_mix.py).
MUSIC=(ga_the_fire@0.095@0@0@95.54@1.6)
# the stamp lands on the ledger at "once" + 0.45 s (72.65); the baton card on "bursting" (92.94)
SFX="ledger_stamp@0.3@72.65 chunk_snap@0.3@92.94"
