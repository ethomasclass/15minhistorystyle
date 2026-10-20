# Music: the Civil War series (all three videos)

**Reuse first.** The channel library (`music/` in the style repo) already covers several of this series' moods. New Suno cues fill only
the gaps, all with the prefix `cw_` (Civil War) so they can join the library afterwards.

## Reused cues

| Video | Chapter | Cue | Why |
|---|---|---|---|
| all | channel intro | `r_title_sting` | the channel sting |
| V1 | ch01 cold open | `r_cold_open` | the "investigators" mystery bed under "Same man. Two different stories." |
| V1 | ch03, ch04 (quiet) | `g_pyramid` | antebellum parlor elegance turning cold, under the declarations and the Cornerstone Speech |
| V1 | ch05 Fort Sumter | `m_war_drums` | made for a war breaking out; peak around 50 s on "They did." |
| V1 | ch08 (quiet) | `a_civil_war` (second half) | its somber cello half, under disease and Andersonville |
| V2 | ch02, ch05 (quiet) | `g_world_outside` | dignified, spiritual-inflected cello for contraband and the Proclamation |
| V2 | ch03 Lincoln's problems | `j_intrigue` | sly backroom tension for McClellan and Taney |
| V3 | ch04, ch07 (quiet) | `r_dix` (first 45 s), `j_grief` | grave and humane for the draft riots and the Black Codes |
| V3 | ch08 ending | `r_ending` | warm, then unresolved: "It didn't answer what kind of country it would be." |

## New Suno cues (the gaps)

How to run them (from the library's README): Suno **Custom** mode, **Instrumental ON**, paste the Styles text exactly, and paste this in
**Exclude Styles** for every cue except the two marked *wry*:

```
vocals, choir, lyrics, humming, drum kit, EDM, trap, pop, rock, synth lead, dubstep, rap, gospel vocals, banjo, comedic, upbeat
```

For the *wry* cues, drop `comedic, upbeat` from that line. Pick the take whose **first 30 to 40 seconds** already sound like the cue.
Save each as its name + `.mp3` (e.g. `cw_secession_fever.mp3`) and drop them in the chat.

These are written as **original melodies in the style of 1860s music**, not covers of real songs: Suno rarely reproduces a named
melody faithfully, and an original tune can't be mistaken for (or flagged as) someone else's recording.

### 1. `cw_secession_fever` (V1 ch02: secession, "seven states are gone")
> 1860 Southern secession rally, fife and field drum quickstep with a bright brass band, proud and excited at first, cheering energy, then the harmony slowly turns minor and ominous as low strings and a muffled bass drum creep in, ends on a hanging unresolved chord; documentary, restrained, space for narrator, instrumental

### 2. `cw_parlor_march` *(wry)* (V1 ch06: sizing up the sides, the Anaconda Plan, the subscribe line)
> 1860s American parlor piano and small brass band, a jaunty confident march in the style of a Civil War quickstep, cornet melody, tuba bass, snare rolls, a little pompous and overconfident, light and wry, sly woodwind asides, ends on a cheeky final button; documentary, restrained, space for narrator, instrumental

### 3. `cw_picnic_to_panic` *(wry, then not)* (V1 ch07: the picnic at Bull Run)
> Sunny 1861 picnic music turning into chaos: starts as a light pastoral waltz with flute, fiddle and parlor piano, cheerful and naive, then distant drums and cannon-like timpani interrupt, the waltz stumbles and speeds up into frantic tremolo strings and clashing brass, a stampede, then sudden silence and one low held note; documentary, space for narrator, instrumental

### 4. `cw_campfire` (V1 ch08 opening and V2 ch07: soldiers' lives, letters home)
> 1860s soldiers' camp at night, a slow wistful original folk ballad on solo fiddle in the style of a Civil War parlor song, soft harmonica answering, gentle acoustic guitar, very sparse, homesick and tender, no percussion, ends quietly on the fiddle alone; documentary, restrained, space for narrator, instrumental

### 5. `cw_night_harbor` (V2 ch01: Robert Smalls and the *Planter*)
> Night escape across a harbor, 1862, quiet held-breath tension: low string drones, soft lapping water-like harp, a slow steam-engine pulse on muted timpani and low piano, a lonely clarinet line, tension tightening for a minute, then at dawn the strings open into a warm, hopeful, dignified major chord; documentary, restrained, space for narrator, instrumental

### 6. `cw_proclamation` (V2 ch04 end and ch08: "Forever free", "didn't wait for him")
> Dignified American hymn in the style of an 1860s church anthem, solo cello melody shaped like a spiritual over soft brass choir and organ-like strings, slow and steady, builds to a restrained, hopeful, proud swell without fanfare, ends warm and quiet; documentary, restrained, space for narrator, instrumental

### 7. `cw_gettysburg` (V3 ch02: one week in July, Pickett's Charge)
> 1863 battlefield, grave and massive: slow building field drums, low brass and string ostinato, rising dread as a long line advances, timpani like distant artillery, a huge dark climax around the one-minute mark, then a sudden drop to near silence with a lone mournful fiddle; never heroic, no triumphant fanfare; documentary, space for narrator, instrumental

### 8. `cw_new_birth` (V3 ch03: the Gettysburg Address)
> Solemn, noble Americana for a memorial dedication, 1863, slow brass choir and warm low strings like a military funeral hymn, a simple dignified melody, quiet and reverent, a gentle rise of hope in the second half, no drums, ends on a soft open chord; documentary, restrained, space for narrator, instrumental

### 9. `cw_hard_war` (V3 ch05: Sherman's march to the sea)
> Relentless 1864 army march through farm country, a driving low string ostinato and steady marching bass drum, iron-on-iron clanks like rails being torn up, smoke-dark brass, grim and unstoppable rather than heroic, slowly builds weight and menace, ends abruptly on a heavy chord; documentary, restrained, space for narrator, instrumental

### 10. `cw_jubilee` (V3 ch06: Appomattox to Juneteenth)
> Quiet surrender at a Virginia village in 1865 turning into celebration: begins with a lone bugle-like muted trumpet and soft strings, weary and gentle, then warms into a joyful, dignified jubilee in the style of an 1860s brass band and fiddle, hand claps and stomps, rising happiness without vocals, ends bright and warm; documentary, space for narrator, instrumental

**Must-have:** 3 (Bull Run), 5 (the *Planter*), 7 (Gettysburg), 10 (Juneteenth). The rest have reuse fallbacks: `j_campaign` for 1 and 2,
`a_civil_war` for 4, `g_world_outside` for 6, `r_dix`'s hopeful rise for 8, `g_cotton_engine` for 9.
