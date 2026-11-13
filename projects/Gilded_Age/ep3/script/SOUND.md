# Episode 3 dialog sound (Nov 12, 2026)

Goal (user): in the dialog scenes, the viewer should feel dropped into the real conversation.

Tools: `tools/sfx_ep3.py` (ElevenLabs sound generation, raws kept in `public/sfx/raw/`), `tools/scene_mix.py` (the mix).
Outputs per scene chapter in `public/audio/`: `<ch>.scene.wav` (narration with character lines placed in their room; use it in
place of `<ch>.wav` in the edit), `<ch>.fx.wav` (beds and spots, add as an extra input at full volume), `<ch>.preview.mp3`.
All dialog scenes back to back: `public/audio/ep3_dialog_preview.mp3`.

How:
- Narrator stays dry (checked: the scene wav differs from the original only inside character lines).
- Character lines get a room: open air with a faint slap off the sea wall (ch 1, ch 4), the ship's wooden hold (ch 3), a small
  room (ch 7, ch 9 kitchen), distance for Yankel shouting through the crowd (ch 4), and Ma at her upstairs window (ch 9 street).
- An ambience bed under each scene sits low under the narrator (-40 dBFS RMS) and swells 9 dB into each character line, then
  settles. The bed for the cold open drops out on "I'll take the trunk", where the music drops out.
- Spots only for things on screen: the trunk lifted (ch 1), the trunk set down on the stoop (ch 9), the knock and the door (ch 9).

| Chapter | Bed(s) | Rooms | Spots |
|---|---|---|---|
| 1 | harbor at dusk (opening breathes louder, then settles) | outdoor | trunk lift |
| 3 | steerage, then harbor on arrival | ship | |
| 4 | rotunda crowd (low), harbor at the payoff | outdoor; Yankel far | |
| 6 | pushcart market, lifted for the "Pushcarts, end to end" list | | |
| 7 | treadles and the iron | room | |
| 9 | Brooklyn street, then the kitchen at evening | window, then room | trunk thump, knock, door |

Levels: fx stems measure -33 to -40 LUFS, peaks under -16 dBFS (beds soft-limited at 12 dB over RMS). In the dialog, the bed
sits about 15 dB under the voices. Music cues go on top as in Ep 2 (about 0.1); dip the music under the dialog scenes if the
two beds compete.
