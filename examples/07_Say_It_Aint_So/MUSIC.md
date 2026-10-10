# Music: Say It Ain't So

**Reuse first.** Every chapter has a cue from the channel library (`music/cues/` in the style repo), with an alternate
so you can pick. Only three new items are suggested, and all three are optional. Levels follow `music/README.md`: beds
at 0.13–0.17, raised for quieter cues by their LUFS.

| Chapter | Pick (A) | Alternate (B) | Why | Bed |
|---|---|---|---|---|
| ch01 Two Documents | `r_cold_open` (felt-piano ostinato, ticking clock, "investigators") | `j_cold_open` (low cello, ticking pulse) | Two documents side by side is an investigation; the held questioning chord lands on the driving question. | 0.17, dip at the end |
| Intro | `r_title_sting` | | Channel standard. | 0.45 |
| ch02 Everybody Bet | `r_temperance` (tipsy honky-tonk piano, fiddle, tuba) | `a_price` (caper underscore) | 1860s ballgrounds: beer, bets and a crowd. Its hopeful turn halfway works for "someone is going to try to rig one". | 0.14 |
| ch03 On Paper | `j_intrigue` (sly backroom deal, ticking harpsichord, brass sting mid-cue) | `a_newsroom` (typewriter ticks, 1890s newsroom) | Telegrams, a newspaperman asking questions. Time the brass sting to "The league banned all four." | 0.17 |
| ch04 The Open Secret | `a_newsroom` (ragtime-tinged piano, muted trumpet, witty swagger) | `j_gossip` | The ragtime 1900s; sly and sardonic fits "Nobody really asks." | 0.17 |
| ch05 Prince Hal | `a_price` (Gilded Age caper, cheeky triumphant button) | `j_intrigue` | Chase keeps getting away with it; the cheeky button lands on "Chase gets his job" or "the Giants sign him". | 0.20 (quiet cue, −17.3 LUFS) |
| ch06 The Fix | `g_grip` (slow tightening low-string ostinato, ticking clock) | `r_nativism` 4th section (tense secretive muted-snare march, ~80 s in) | The plan coming together; tension without drama. | 0.18 |
| ch07 Regardless | `j_cold_open` (lone cello, slow suspense build, unresolved) | `w_aftermath` | The trial and the ban. Drop the bed to near silence on "For life." | 0.20 |
| ch08 Full Circle + end screen | `r_ending` (warm reflective piano, then darker, unresolved) | `r_utopia` 3rd part (darkening unease) | The answer has two readings; the unresolved chord fits "who's watching". Its second half carries the 15 s end screen. | 0.14 |

**Sound effects** (all in the template or `sfx/`): `crowd_cheer` under the 1860s and 1900s crowds (very low),
`rowdy_crowd` for the grandstand bettors, `gavel` on "not guilty" and on Landis's ban, `stamp` on each ledger entry,
`tick_soft` on the telegrams, `whoosh` on cuts. New, optional: a bat crack and a ball hitting a mitt (ElevenLabs SFX,
`tools/sfx_eleven.py`), for the passed balls and the signal pitch.

---

## New, optional (three ideas)

### N1. A real 1908 recording of "Take Me Out to the Ball Game" (archival, free)
The song was published in 1908. Edward Meeker's 1908 Edison cylinder recording is in the U.S. public domain (sound
recordings made before 1923 entered it in 2022). The Library of Congress National Jukebox, Internet Archive and
Wikimedia Commons all have copies. Use about 8 seconds of the scratchy original, very low, under the ch04 line
"Baseball booms", or as the end-screen button. It's a real period sound, which matches "real images first". I can
find and check a copy if you want it.

### N2. `s_the_fix` (Suno): only if `g_grip` feels too much like *Grip Tighter*
> slow dark ragtime, 1919, minor key, solo upright piano with a sly stride left hand slowed to a crawl, muted cornet,
> brushed snare, upright bass pizzicato, a ticking pocket-watch pulse, tense and knowing rather than scary, builds
> slightly, ends on an unresolved low chord, instrumental, no vocals, 90 seconds

### N3. `s_music_box_ballgame` (Suno): an optional theme for the cold open and the last line
> an old music box slowly playing a simple waltz-time melody in the spirit of a 1908 American ballpark song (an
> original melody, not a known tune), slightly detuned, one tine sticking, warm tape hiss, very sparse low cello
> drone underneath, nostalgic with a faint unease, instrumental, no vocals, 60 seconds

*If you make N2 or N3, they go into the style repo's library with a new prefix (`s_` for "Say It Ain't So").*
