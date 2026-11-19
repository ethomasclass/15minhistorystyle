# Suno prompts: Thanksgiving food video (original score, draft 1)

**The idea:** one tune, the **"table theme"**: a short, sly four-note motif that sounds like setting a table (tap, tap, clink, ta-da). Every era dresses it up differently, the same way the menu got dressed up. Same melody, new costume. That is the "mock" joke in music.

**Tempo:** narration runs about 185 words a minute, so cues stay mid-tempo and sparse under the voice. Each cue hands off on a phrase, and I trim and fade.

## Settings (same for every cue)
- **Custom** mode. Paste the **Style** box. Turn **Instrumental OFF** and paste only the structure-tag **Lyrics** box (all in [brackets]); if a take sings or hums, throw it out.
- **Exclude styles** (every time):
```
vocals, choir, lyrics, humming, rap, EDM, trap, dubstep, rock, drum kit, synth lead, whistling, holiday pop, christmas bells, sleigh bells, native american flute, epic trailer
```
- Make 2–4 takes. Keep the one whose first 30–40 s already sound right. Download as MP3 named exactly as below (prefix `tg_`).

## Cues (in order of priority)

### 1. `tg_table_theme.mp3`: the theme (cold open + ending)
*Used in:* ch1 under the cold open; ch8 ending and end screen. *At least 2:00.*
```
a sly, warm documentary main theme about dinner, a simple memorable four-note motif on pizzicato strings and celesta like setting a table, then taken up by clarinet and warm strings, light and wry with a hint of mischief, gentle build to one small satisfied peak around forty seconds, returns to the bare pizzicato motif, ends on a held chord with a tiny playful grace note, 96 BPM, 4/4, F major; documentary, restrained, space for narrator, instrumental
```
```
[Instrumental]
[Intro: solo pizzicato strings, the four-note motif alone]
[Verse: celesta joins, clarinet takes the motif]
[Build: warm strings underneath, gentle]
[Peak: one small satisfied swell]
[Break: back to bare pizzicato, the motif once]
[Outro: held chord, one playful grace note]
[End]
```

### 2. `tg_1621.mp3`: survival, mud and cold water (ch2)
*At least 1:30.* The motif slowed down and bare. No faux-"Native" instruments.
```
a sparse cold autumn documentary cue, low solo cello and soft open fifths on viola, a slow fragment of a four-note motif, damp and quiet like a river at dawn, light hand percussion like footsteps in mud, patient and observant, never sad, 70 BPM, 3/4, D dorian; documentary, restrained, space for narrator, instrumental
```

### 3. `tg_parlor_waltz.mp3`: showing off (ch3, ch4 reprise)
*At least 2:00.* The motif as a pompous Victorian parlor waltz, a little too proud of itself.
```
a pompous Victorian parlor waltz for a documentary about showing off at dinner, the four-note motif played grandly on piano and string quartet, slightly overdressed, polite brass, a wry wink in the phrasing, refined but a little ridiculous, 132 BPM waltz, 3/4, B-flat major; documentary, restrained, space for narrator, instrumental
```
*For ch4 (mock turtle), make a **second take** with this Style:* the same waltz "played by a cheaper band": solo upright piano, slightly out-of-tune, a bassoon, same melody. Name it `tg_parlor_mock.mp3`.

### 4. `tg_hale.mp3`: one determined woman, many letters (ch5)
*At least 2:00.*
```
an earnest, determined documentary cue, the four-note motif as a warm hymn-like melody on solo piano, a quill-scratch rhythm on brushed snare and pizzicato, gradually adding strings as the letters pile up, persistent and hopeful, a quiet triumph at the end, 88 BPM, 4/4, E-flat major; documentary, restrained, space for narrator, instrumental
```

### 5. `tg_gelatin.mp3`: Jell-O, the wobble (ch6)
*At least 1:45.* The motif goes "modern": wobbly and a bit uncanny.
```
a wobbly, slightly uncanny mid-century novelty cue for a documentary about gelatin, the four-note motif on vibraphone with gentle tremolo, glass harmonica shimmer, soft upright bass, a jiggly bouncing rhythm, cheerful on the surface and faintly strange underneath, 104 BPM, 4/4, A-flat major; documentary, restrained, space for narrator, instrumental
```

### 6. `tg_ad_sting.mp3`: the 1955 ad (ch6 pattern interrupt)
*At least 0:20; I'll cut a 4–6 s hit from it.* It plays under the full-frame colour ad, then cuts to silence.
```
a short bright 1950s advertising jingle fanfare, cheerful muted trumpet, celesta and bouncy pizzicato strings, the four-note motif as a sparkling ta-da, very mid-century television, 120 BPM, 4/4, C major; instrumental
```

### 7. `tg_test_kitchen.mp3`: the test kitchens (ch7)
*At least 2:30.* The motif as smooth mid-century easy listening, too perfect.
```
a smooth mid-century easy-listening cue for a documentary about 1950s test kitchens, the four-note motif on muted trumpet and vibraphone over a lounge rhythm with brushes, cheerful strings, everything a little too perfect like a magazine photo, confident and sunny, 112 BPM, 4/4, G major; documentary, restrained, space for narrator, instrumental
```

### 8. `tg_turkey.mp3`: the turkey (ch8 climax, before the ending)
*At least 1:15.* Deadpan: the bottom drops out of the cheer.
```
a deadpan, slightly ominous documentary cue, low clarinet and bassoon play a slowed four-note motif, soft timpani, sparse plucked bass, dry and awkward like a long uncomfortable pause at dinner, a little absurd, 76 BPM, 4/4, C minor; documentary, restrained, space for narrator, instrumental
```

## Reuse check
Before generating, I'll check the music library for a stand-in for each cue (e.g. a parlor cue from *When Europe Ate Mummies*: `m_parlor`). Only the theme and the gelatin, test-kitchen and ad cues are clearly new.
