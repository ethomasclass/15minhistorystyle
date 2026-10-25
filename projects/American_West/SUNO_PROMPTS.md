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

### 4. `aw_legend_sours`: the myth beat, made from **two** takes
*Used in:* Ep 1 ch 5 (the golden-spike myth); later Ep 2, Ep 4  
*Why two:* Suno won't turn a fanfare sour inside one song; it stays a fanfare. So make the two halves separately and I join them:
the fanfare grinds to a halt (a tape-stop with a sour wobble, `ep1/tools/collapse.py`) right on "Sort of.", then the deflated take
comes in. **A fanfare take you already have works for 4a.**

**4a. `aw_legend_fanfare.mp3`:** *Length:* any (only the first ~6 s are used)

```
a grand heroic frontier fanfare in the style of an old Hollywood epic, bold French horns and trumpets, soaring strings, timpani rolls, big and confident from the very first note, 100 BPM, 4/4; documentary, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: full heroic fanfare from the first bar]
[Fanfare: horns and soaring strings]
[End]
```

**4b. `aw_legend_deflated.mp3`:** *Length:* at least 0:45

```
deadpan and deflated after a big letdown, sparse doubtful pizzicato strings, a lone bassoon with a few dry, slightly sheepish notes, soft upright bass, long pauses, quiet and wry rather than sad, no brass, no fanfare, no build, ends on a single low questioning note, 80 BPM, 4/4; documentary, restrained, space for narrator, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: a few sparse pizzicato plucks, silence between]
[Verse: lone bassoon, dry and doubtful, pizzicato]
[Break: almost nothing]
[Verse: bassoon and upright bass, still sparse]
[Outro: a single low questioning note]
[End]
```

*For 4b, add to Exclude:* `fanfare, heroic, epic, brass section, trumpet, timpani, triumphant`

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
1870s financial panic, a crowd rushing a bank, anxious ticking stock-ticker pulse, rapid nervous string tremolo, piano repeating a falling figure, rising tension for forty seconds, then a sudden drop to a hollow low drone and a slow descending cello line, the aftermath bleak and quiet, ends unresolved, 132 BPM, 4/4, half time after the drop; documentary, restrained, space for narrator, instrumental
```

*Lyrics box (structure tags only):*

```
[Instrumental]
[Intro: anxious ticking pulse]
[Build: nervous string tremolo, falling piano figure]
[Build: rising tension, faster, louder]
[Drop: sudden hollow low drone]
[Aftermath: slow descending cello line, bleak and quiet]
[Outro: unresolved, fading]
[End]
```

## Later episodes (whenever you like)

### 7. `aw_long_drive.mp3`: the trail
*Used in:* Ep 2 (the Long Drive)

```
1870s cattle drive across open Texas grassland, loping two-beat horse gait rhythm on hand drum and upright bass, nylon-string guitar and solo fiddle trading a plain trail melody, harmonica answering in the distance, guitarrón bass in the second half, dusty and steady, a little lonely, warm but not cheerful, never a cowboy movie theme; documentary, restrained, space for narrator, instrumental
```

### 8. `aw_boomtown.mp3`: the rush
*Used in:* Ep 2 (Black Hills gold, Deadwood)

```
1870s mining boomtown rush, restless excited energy, upright piano with a slightly out-of-tune saloon edge playing a busy figure, pizzicato strings scurrying, clattering wooden percussion, fiddle runs, a feverish build like a crowd arriving, then in the last third the energy turns hollow and uneasy with low strings and a single sour chord; documentary, restrained, space for narrator, instrumental
```

### 9. `aw_prairie_hymn.mp3`: the homestead
*Used in:* Ep 3 (homesteads)

```
1870s Great Plains homestead, a plain hymn-like melody on pump organ and solo violin over wide open sustained strings, a feeling of endless flat land and big sky, hopeful but austere and hard-working, simple and dignified, a slow gentle pulse, in the last third the wind seems to rise with a low drone and the hope thins out; documentary, restrained, space for narrator, instrumental
```

### 10. `aw_exodus.mp3`: the leaving
*Used in:* Ep 3 (the Exodusters)

```
1879 a journey toward freedom, slow resolute walking pulse, warm upright piano and solo cello carrying a melody in the spirit of a spiritual, soft strings and a low pump organ joining, building steady conviction and hope without triumph, a moment of doubt in the middle with sparse low strings, then the walk resumes, ends warm but unresolved; documentary, restrained, space for narrator, instrumental
```

### 11. `aw_white_cold.mp3`: winter as the enemy
*Used in:* Ep 2–3 (the blizzards)

```
brutal Great Plains winter blizzard, cold glassy high string harmonics, a low sustained drone like wind across empty land, sparse frozen piano notes, slow and still, no melody to speak of, a slow swell of icy dissonance in the middle then emptiness again, bleak and quiet, no percussion, ends on near silence; documentary, restrained, space for narrator, instrumental
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
