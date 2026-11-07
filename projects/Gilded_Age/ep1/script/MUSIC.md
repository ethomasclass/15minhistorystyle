# Music: Gilded Age, Episode 1

Nine Suno cues made for this episode (prompts in `SUNO_PROMPTS.md`), received Nov 7, 2026. Files are in `public/music/` and in the
channel library (`music/cues/`, `music/catalog.json`, `music/README.md`). Each bed sits **15 LU** under the voice (the user asked for the music a touch lower than the channel's usual 13, Nov 7):
`volume: bed('<cue>', 15)` (the loudness is in `CUE_LUFS` in `kit/levels.ts`). Loudness charted, not listened to.

Rough mix to listen to: `public/audio/ep1_rough_mix.mp3` (narration + every cue at its bed level, plain fades, mastered to -14 LUFS).

| Time | Chapter | Cue | Length | LUFS | bed(cue, 15) | Fit |
|---|---|---|---|---|---|---|
| 0:00 | 1 The Bridge | `ga_gilded_theme` from 0:00 | 2:00 | -15.4 | 0.132 | Covers the 61 s cold open |
| 1:01 | 2 The Name | `ga_noon_twice` | 1:15 | -15.6 | 0.135 | 63 s chapter; 12 s spare |
| 2:04 | 3 The Machines | `ga_age_of_steel` | 1:24 | -14.9 | 0.124 | 71 s chapter |
| 3:14 | 4 The Refinery | `ga_sugar_house` | 1:05 | -13.5 | 0.106 | 47 s chapter |
| 4:02 | 5 The Weaver's Son | `ga_weavers_son` | 2:15 | -15.2 | 0.129 | 121 s chapter; the thin end (from ~120 s) is past the chapter, so the "drop to solo fiddle" at the private note (1:41) needs checking by ear |
| 6:03 | 6 The Con Man's Son | `ga_the_squeeze` | 2:50 | -13.4 | 0.105 | 158 s chapter; the build from ~70 s lands on the rebate (1:10 in). Its low tail carries ch 7's first 11 s |
| 8:41 | 7 The Trust Comes to Brooklyn | tail of `ga_the_squeeze`, then `ga_kellys` from 9:05 ("That night") | 1:20 | -14.7 | 0.122 | the first 13 s after the squeeze ends (8:52 to 9:05) need a bridge: the squeeze's last chord held, or room tone |
| 9:44 | 8 Leave It Alone | `ga_heroes_or_villains` | 1:15 | -15.9 | 0.140 | 58 s chapter |
| 10:41 | 9 Gold or Gilt | `ga_bad_wire` to 11:37 | 1:14 | -16.2 | 0.145 | 56 s span |
| 11:37 | 9 (ending) | `ga_gilded_theme` from 1:04 | | | 0.132 | starts 64 s in so its solo-piano close and final chord land on the end screen (out by 1:58) |

The channel sting and chapter breaks come from the library as usual.
