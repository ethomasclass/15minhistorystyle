# Suno prompts: The American West series

Copy each **Style** box (and, for Episode 1, the **Lyrics** tags box) into Suno. Everything else on this page is just labels.

**Why these tempos:** the narration runs about 150 words a minute, so slow-to-mid tempos sit under it without fighting it. The
busy cues (the race, the panic) are quick but sparse, and the grave ones barely have a pulse. I hand cues over on a musical phrase,
so the exact BPM doesn't need to match anything; it just sets the feel.

## Settings (same for every cue)

- **Custom** mode.
- **Style:** paste the box for the cue (for the Episode 1 cues the tempo is already in it).
- **Lyrics:** for the Episode 1 cues, paste the *structure tags* box. Suno hides the Lyrics box when Instrumental is on, so turn
  **Instrumental OFF** and paste only the tags: they're all in [brackets] and start with [Instrumental], so there are no words to sing. If a take hums or
  sings anyway, throw it out (or switch Instrumental back on and use the Style box alone; it still works).
- **Exclude styles:** paste this every time:

```
vocals, choir, lyrics, humming, drum kit, EDM, trap, pop, rock, synth lead, dubstep, rap, gospel vocals, banjo, comedic, upbeat, western movie theme, whistling
```

- Make **2–4 takes**; keep the one whose **first 30–40 seconds** already sound right.
- **Length:** Suno songs usually run 2–4 minutes, which is plenty. If a take is too short, use **Extend** from its last good
  section. Longer is always fine: I trim and fade, so only the minimums below matter.
- **Download as MP3** and name it exactly as shown (e.g. `aw_iron_horse.mp3`). Send them back and I'll level and place them.

## Episode 1 cues (make these first, in this order)

### 1. `aw_promise_theme.mp3`: the series theme (and the ledger)
*Used in:* Ep 1 ch 9 ending, and every episode's last chapter  
*Length:* **at least 2:00** (Ep 1 needs ~1:48: the last 1:28 of ch 9 plus the 20 s end screen)

```
a reflective main theme for a documentary series about promises, a simple memorable four-note motif first on solo piano, then taken up by warm strings and a single French horn, earnest and thoughtful with a thread of doubt, builds gently to one restrained peak at about forty-five seconds, then returns to the solo piano motif, ends on an unresolved chord that leaves a question hanging, 72 BPM, 4/4, D minor; documentary, restrained, space for narrator, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: solo piano, the four-note motif, alone]
[Verse: warm strings take up the motif, piano underneath]
[Build: slow and gentle, French horn enters]
[Peak: one restrained swell, horn and strings]
[Break: back to solo piano, the motif once more]
[Outro: soft strings hold, unresolved chord]
[End]
```

### 2. `aw_iron_horse.mp3`: the machine age
*Used in:* Ep 1 ch 3 (the race) + ch 5 reprise  
*Length:* **at least 2:00** (ch 3 runs 1:47; the ch 5 reprise reuses ~30 s from later in the cue)

```
1860s railroad construction, driving rhythmic pulse like hammers on spikes and iron wheels on rails, col legno strings and low string ostinato, anvil-like metallic percussion, a steady locomotive chug that slowly gathers speed, low brass entering in the second half, determined and relentless, impressive but not triumphant, ends on a held low chord, 112 BPM, 4/4; documentary, restrained, space for narrator, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: low string ostinato, col legno taps]
[Build: anvil percussion joins, locomotive chug]
[Main: driving, relentless, steady pulse]
[Break: drop back to the bare ostinato]
[Build: low brass enters, heavier]
[Main: full, determined, not triumphant]
[Outro: held low chord]
[End]
```

### 3. `aw_long_grief.mp3`: the long quiet
*Used in:* Ep 1 ch 4 (the strike); later Ep 4  
*Length:* **3:00** (Ep 1 only needs ~40 s, but Sand Creek and Wounded Knee in Ep 4 need the full length)

```
a long, very quiet grieving bed for the heaviest moments, three minutes, a soft sustained string pad barely moving, a few slow solo cello phrases with long silences between, one low piano note now and then, no swell, no build, no melodrama, the same calm level from start to finish, ends in silence, free time, about 56 BPM; documentary, restrained, space for narrator, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: soft sustained string pad]
[Section: slow solo cello phrase, long silence]
[Section: one low piano note, string pad]
[Section: slow solo cello phrase, long silence]
[Section: string pad alone, barely moving]
[Section: slow solo cello phrase]
[Outro: string pad fades to silence]
[End]
```

### 4. `aw_legend_sours.mp3`: the myth beat
*Used in:* Ep 1 ch 5 (the golden-spike myth); later Ep 2, Ep 4  
*Length:* at least 0:45. The fanfare only needs to last a few seconds before it falls apart; I line the collapse up with "Sort of."

```
two-part cue: a short heroic Hollywood-western fanfare that falls apart into a deflated, deadpan letdown, bold French horns and trumpets with timpani for the opening, then the brass sags out of tune, the tempo drags to a halt, and only sparse doubtful pizzicato, a lone dry bassoon and soft upright bass remain, wry and sheepish rather than sad, 100 BPM slowing to 70 BPM; documentary, restrained, space for narrator, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: heroic brass fanfare, timpani, 4 bars only]
[Break: the brass goes flat and sour, a downward trombone slide]
[Silence]
[Verse: sparse pizzicato, lone bassoon, no brass]
[Verse: dry bassoon and upright bass, long pauses]
[Outro: a single low questioning bassoon note]
[End]
```

*Exclude for this one:* use the normal list **minus** `comedic` and `upbeat` (they fight the wry letdown) and add `choir, epic trailer`.

*If a take still stays fanfare throughout:* send me the best fanfare take plus any sparse, deadpan pizzicato/bassoon take, and I'll
join them with a tape-stop collapse (`ep1/tools/collapse.py`, demo in `ep1/review/legend_sours_collapse_demo.mp3`).

### 5. `aw_robber_barons.mp3`: the swagger
*Used in:* Ep 1 ch 7 (Crédit Mobilier, Whiskey Ring)  
*Length:* **at least 2:00** (ch 7 runs 1:48)

```
Gilded Age swagger, smug and well-fed, slow strutting tempo, tuba and low brass oom-pah under a sly muted trumpet melody, parlor piano chords, pizzicato strings, a cigar-smoke lazy confidence with a hint of menace underneath, two short cheeky brass stings, ends on a knowing unresolved chord, 84 BPM, 4/4, a slow strut; documentary, restrained, space for narrator, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: tuba oom-pah, parlor piano chords]
[Verse: sly muted trumpet melody, pizzicato]
[Sting: short cheeky brass hit]
[Verse: the strut continues, a little menace underneath]
[Sting: short cheeky brass hit]
[Outro: knowing unresolved chord]
[End]
```

### 6. `aw_panic.mp3`: the crash
*Used in:* Ep 1 ch 8 (the Panic of 1873)  
*Length:* **at least 1:50** (ch 8 runs 1:39)

```
1870s Wall Street panic, a busy anxious bustle of a crowd rushing the banks, hurried upright piano with a ragtime edge, clacking stock-ticker woodblock rhythm, scurrying pizzicato strings, nervous clarinet runs, brushed snare, energy rising as things spin out of control, then the bustle stops and a sober, plain aftermath on piano and low strings, sad and reflective like a long hard time ahead, period chamber orchestra, 126 BPM then half time; documentary, restrained, space for narrator, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: ticker-tape woodblock, hurried piano figure]
[Verse: scurrying pizzicato, nervous clarinet, busy and anxious]
[Build: faster, the crowd rushes the banks, brushed snare]
[Break: everything stops on one piano chord]
[Verse: half time, plain sober piano, low strings, reflective]
[Outro: piano alone, unresolved]
[End]
```

*Exclude for this one:* the normal list plus `horror, suspense thriller, eerie, dissonant, drone, string tremolo, jump scare, dark ambient, cinematic trailer`.


## Episode 2 cues (*Cheap as Dirt*; make these three next)

### 7. `aw_long_drive.mp3`: the trail
*Used in:* Ep 2 ch 3 (the Long Drive, ~1:35) and ch 5 after the myth beat (~1:05, from later in the cue)  
*Length:* **at least 2:45** (I use two different stretches of it)

```
1870s cattle drive across open Texas grassland, a loping two-beat horse-gait rhythm on hand drum and upright bass, nylon-string guitar and solo fiddle trading a plain trail melody, harmonica answering far off, guitarrón bass in the second half, dusty and steady, a little lonely, warm but not cheerful, never a cowboy movie theme, 92 BPM, 2/4 feel, G major with a modal edge; documentary, restrained, space for narrator, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: hand drum and upright bass, the loping gait, alone]
[Verse: nylon guitar enters with the trail melody]
[Verse: solo fiddle answers the guitar]
[Break: harmonica far off, drum and bass only]
[Verse: guitarrón bass joins, a little fuller, still steady]
[Verse: fiddle and guitar together, the melody once more]
[Outro: the gait slows, guitar alone, open chord]
[End]
```

### 8. `aw_boomtown.mp3`: the rush, then the hollow (two takes; I join them)
*Used in:* Ep 2 ch 6 from "Newspapers did the rest" through ch 7. The fall-off lands on ch 7's "Working for wages. Just
underground."  
**Why two takes:** Suno won't fall off at a set time inside one song (it keeps the energy up, like the legend cue did). So make the
rush and the hollow as **two separate songs**; I join them with `tools/collapse.py` (the rush slows and stops, a beat of silence, then
the hollow), placed so the stop lands exactly on "Just underground." Same method as `aw_legend_sours`.

**8a. `aw_boomtown_rush.mp3`** · *Length:* **at least 2:15**, no ending needed (I cut it)
(v2: the first take came out modern, with a drum kit and beats. This version is acoustic chamber music with period instruments only, and
the rhythm comes from the strings and piano, not drums.)

```
acoustic period film score for a documentary about an 1876 gold rush, played by a small chamber ensemble on 19th-century instruments only: a slightly out-of-tune upright parlor piano playing a busy restless figure, string quartet playing fast scurrying pizzicato and short spiccato, a solo fiddle with quick folk runs, a concertina, light wooden taps and spoons for rhythm, no drum kit, acoustic and dry, crowded and feverish like a camp filling with prospectors, keeps building, no slow section, 120 BPM, 2/4 feel, A minor; documentary, restrained, space for narrator, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: busy parlor piano figure, alone, acoustic]
[Verse: string pizzicato scurries in, wooden taps]
[Build: fiddle runs, concertina, more crowded]
[Main: feverish chamber ensemble, restless]
[Build: all the acoustic instruments at once, still rising]
[Main: feverish, crowded, restless]
[Build: still rising, no letup]
```

*Exclude styles (paste this instead of the usual list for 8a):*

```
drum kit, drums, snare, kick drum, hi-hat, drum machine, 808, beat, trap, hip hop, EDM, electronic, synth, pad, bass guitar, electric guitar, distortion, modern production, cinematic trailer, epic, braam, lo-fi, pop, rock, vocals, choir, humming, whistling, banjo, slow, ballad, fade out
```

**8b. `aw_boomtown_hollow.mp3`** · *Length:* **at least 1:00**

```
the empty aftermath of a gold rush, hollow and uneasy, no rhythm, no percussion, low sustained strings and a dark cello drone, one sour unresolved piano chord that rings and decays, a lonely detuned saloon piano note now and then, the feeling of a played-out mining camp and men going underground for wages, slow and bleak, free time, about 56 BPM, A minor; documentary, restrained, space for narrator, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: one sour piano chord, ringing out]
[Verse: low sustained strings, cello drone]
[Verse: a single detuned piano note, far apart]
[Outro: drone thins out, unresolved]
[End]
```

*Exclude styles (add to the usual list):* `drums, percussion, upbeat, fast, hopeful, major key`

If a take of 8a happens to drop out on its own somewhere, tell me the time; it may save the join.

### 9. `aw_white_cold.mp3`: winter as the enemy
*Used in:* Ep 2 ch 1 (under Russell's steer, ~1:15) and ch 9 (the Big Die-Up, ~1:40, the quiet chapter); later Ep 3 (the
Children's Blizzard)  
*Length:* **at least 3:00** (I use the opening for ch 1 and a different stretch for ch 9)

```
brutal Great Plains winter blizzard, cold glassy high string harmonics, a low sustained drone like wind across empty land, a few sparse frozen piano notes, slow and still, no melody to speak of, a slow swell of icy dissonance in the middle then emptiness again, bleak and still, no percussion, ends on near silence, free time, about 50 BPM; documentary, restrained, space for narrator, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: wind-like low drone, alone]
[Verse: glassy high string harmonics over the drone]
[Verse: a few sparse piano notes, far apart]
[Build: slow swell of icy dissonance]
[Break: back to the bare drone]
[Verse: harmonics and single piano notes, very still]
[Outro: thinning to near silence]
[End]
```

**Reused in Ep 2 (no new takes needed):** `aw_iron_horse` (ch 2, "That's where the railroad comes in"), `aw_legend_sours` (ch 5's
myth beat: the turn lands on "none of those"), `aw_promise_theme` (ch 10, the ledger to the end screen).

## Later episodes (whenever you like)

### 10. `aw_prairie_hymn.mp3`: the homestead
*Used in:* Ep 3 (homesteads)

```
1870s Great Plains homestead, a plain hymn-like melody on pump organ and solo violin over wide open sustained strings, a feeling of endless flat land and big sky, hopeful but austere and hard-working, simple and dignified, a slow gentle pulse, in the last third the wind seems to rise with a low drone and the hope thins out; documentary, restrained, space for narrator, instrumental
```

### 11. `aw_exodus.mp3`: the leaving
*Used in:* Ep 3 (the Exodusters)

```
1879 a journey toward freedom, slow resolute walking pulse, warm upright piano and solo cello carrying a melody in the spirit of a spiritual, soft strings and a low pump organ joining, building steady conviction and hope without triumph, a moment of doubt in the middle with sparse low strings, then the walk resumes, ends warm but unresolved; documentary, restrained, space for narrator, instrumental
```

### 12. `aw_treaty.mp3`: the council
*Used in:* Ep 4 (treaty councils)

```
a solemn treaty council, grave and dignified, slow sustained low strings, a simple measured theme on solo viola and piano, long pauses, a quiet sense of weight and ceremony and of two sides measuring each other, restrained tension underneath, no drums, ends on an open unresolved chord; documentary, restrained, space for narrator, instrumental
```

## Optional

### `aw_hinge_sting.mp3`: a 3–5 s date stinger (only if Suno makes short cues well)

```
a single short dramatic stinger for a date appearing on screen, one deep low drum hit with a low string and piano stab, a short ringing tail, three seconds long; documentary, restrained, instrumental
```

## Channel jingle (Chunk History), for the intro and the chapter breaks

**Retired (Oct 2026):** the branding sound is clicks and page turns only, no music (the user's call); see `HANDOFF.md`. Kept for the record.

What the intro does, so the music can land on it: six teal blocks fly in and knock into place (0.5–2.5 s), the **coral quarter
swings in like a minute hand and locks at 2.80 s**, then the two word-slabs **CHUNK** (3.60 s) and **HISTORY** (3.95 s) slam in;
the logo holds until 5.5 s. The idea for the sound: blocks knocking together into a rhythm, a clock tick, one bright "lock" hit,
two slab hits, a short warm ring-out. Same instruments as the channel (piano, strings, low brass, timpani), not EDM.

### J1. `chunk_jingle.mp3`: the intro (about 5 seconds)

```
short channel logo jingle for a history documentary series, five seconds, a few crisp wooden block knocks and a soft clock tick building a quick rhythm, then one bright satisfying lock hit with piano and a low timpani at almost three seconds, two bold low brass and timpani slab hits right after, a short warm string and piano chord ringing out, confident and clever, not epic, 120 BPM; instrumental, logo sting
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: wooden block knocks and a clock tick, quick and light]
[Hit: one bright lock hit, piano and timpani]
[Hit: two bold slab hits, low brass and timpani]
[Outro: short warm chord rings out]
[End]
```

*Exclude:* the normal list plus `epic trailer, braam, whoosh, riser, EDM drop, synth`.  
*Length:* Suno won't make a 5-second song; any length is fine. I find the best 5 seconds in the take and line its lock hit up
with the coral quarter (2.80 s), so pick the take with the clearest **knock-knock-LOCK, BOOM-BOOM** shape near the start.

### J2. `chunk_snap.mp3`: the chapter-break sting (about 1.5 seconds)

Easiest made from J1 (I cut its lock hit and ring-out into the 2-second break, so the breaks echo the intro). If you'd rather
have its own sound, a separate take:

```
a single short logo sting, one soft wooden block knock then one bright warm lock hit with piano and soft timpani, a short gentle ring-out, one and a half seconds, quiet and tidy; instrumental, logo sting
```
