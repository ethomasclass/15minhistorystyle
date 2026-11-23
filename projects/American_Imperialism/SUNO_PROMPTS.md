# Suno prompts: American Imperialism, Episode 1 (v4, one melody, every cue its own world)

v3 put one tune through everything, but on the same brass, the same tempo, the same opening: it all sounded alike. v4
keeps the **melody** (the motif) as the thread and throws away the rest. Every cue gets its own genre, its own
instruments, its own tempo, key and way in. Period sound is one colour among many, not the rule.

## The rules that keep it from sounding samey

1. **The melody is a guest, not the host.** Only some cues carry it, and each in its own way: whole, in the bass line,
   as a four-note fragment, slowed to a crawl, or not at all. Cues that don't need it don't get it.
2. **No two cues open the same way.** Never "the tune alone, then the band joins." Each cue below names its first
   sound, and in most of them the melody arrives late or never.
3. **Brass band once.** The cornet band is cue 1, the seed, and nowhere else as the main sound.
4. **Different tempo, key and meter everywhere.** The cuts are the joke, so the cues don't have to match each other.
5. **Each scene picks its genre from what the scene *is*,** not from the year: a pitch meeting sounds like a sales film,
   a heist sounds like a heist.

**Still from v3:**
- **Silence is part of the score.** The Declaration line is always silent (the cue before it stops dead on the cut). Humor
  cuts go to silence and the music comes back on a **new** phrase. No music under "I yield to the superior force" or the
  Queen's own words.
- **The Claim and the Deed** are still the idea: what America said against what it did. Now they're two *treatments* of
  the melody (bright and sincere vs. slowed, lowered, mechanical), not two brass sections.

## How to make them

**The seed first.** Make cue 1 (or keep the motif take you already like). Then, for every cue marked *Cover*:
- **Trim the seed to the melody alone** (about 8 to 12 seconds, no intro, no band entrance) and Cover **that** clip. Suno
  copies the source's opening and arrangement along with its tune; give it only the tune and it has nothing else to copy.
- If your Suno shows an **Audio Influence** slider on Covers, start around **40 to 50%**: enough to keep the melody, low
  enough to let the new style take over. Too high and it sounds like the brass band again; too low and the tune is gone.
- Cues marked *New* are made fresh with no source. They should **not** sound like the seed.

**Settings:**
- **Custom** mode. Paste the **Style** box and the **Lyrics** box (structure tags only, no words).
- **Instrumental:** use whichever setting kept cue 1 free of voices.
- **Exclude styles:** the core below, plus each cue's extras. (Some cues take words out of the core; they say so.)

```
vocals, choir, humming, wordless vocals
```

- Make **2 to 4 takes**; keep the one whose **first 30 seconds** already sound right. Extend from the last good section if
  it's short. Download **MP3**, named as shown. I level, trim and cut the stops myself, and audition every take under the
  real narration.
- **Get Stems**, if your plan has it, on cues 2, 6a and 8.

**Still banned** (the channel's overused sounds and the island clichés): felt piano, pizzicato strings, ticking clocks,
solo cello over a pad, clarinet and bassoon, ukulele, steel or slack-key guitar, hula drums, music box. Never type
"Hawaiian", "island" or "tropical" as a style. No artist names (Suno refuses them): describe the sound instead.

| # | File | Genre | Melody | Opens on | Make it as |
|---|---|---|---|---|---|
| 1 | `ai_motif` | 1890s cornet band | whole, plain | solo cornet | new (the seed) |
| 2 | `ai_theme` | minimalist pulse | whole, then against itself | interlocking marimbas | Cover |
| 3 | `ai_locked_room` | dark ambient | none | a bowed metal swell | new |
| 4 | `ai_palace_band` | worn wax-cylinder waltz | whole, warped | needle crackle | Cover |
| 5 | `ai_old_rule` | old-time string band | whole, as a reel | fiddle and foot stomp | Cover |
| 6a | `ai_pitch_business` | mid-century sales film | whole, cheerful | walking bass | Cover |
| 6b | `ai_pitch_admiral` | war-film march | the first four notes | low strings ostinato | Cover |
| 6c | `ai_pitch_preacher` | gospel organ | whole, slow and soulful | organ swell and tambourine | Cover |
| 6d | `ai_pitch_scientist` | 1950s science film | whole, on theremin | oscillating vibraphone | Cover |
| 7 | `ai_four_bells` | rising swell | none | bowed cymbal | new |
| 8 | `ai_mechanism` | heist thriller | hidden in the bass line | upright bass riff | Cover |
| 9 | `ai_charge` | harpsichord to orchestra | none | three harpsichord chords | new |
| 10 | `ai_answer` | parlor reed organ hymn | its own hymn | the bellows | new |
| 11 | `ai_ledger` | three timbres | three short phrases | a glockenspiel phrase | Cover |
| 12 | `ai_both` | string quartet chorale | whole, in unison | a held open fifth | Cover |
| 13 | `ai_next` | underwater dread | none | a muffled boom | new |

---

### 1. `ai_motif.mp3`: the seed (the Claim at its plainest)
*Length:* **0:40 or more**. *New.* The only brass band in the episode. Short, hummable, opening on a rising bugle-like
leap, simple as a hymn. (If you already have a motif take you like, keep it and skip this.)

**Style**
```
1890s American cornet band, solo cornet melody, simple noble hymn-like tune opening with a rising bugle leap, 72 BPM, 4/4, B-flat major, sincere, clean modern recording, regular 8-bar phrases, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: solo cornet, the tune once, alone]
[Verse: soft tuba and bass drum join, same tune]
[Outro: cornet alone, final cadence]
[End]
```
*Exclude extra:* `drum kit, synth, trumpet fanfare, orchestra, epic`

---

### 2. `ai_theme.mp3`: the series theme (Claim against Deed)
*Length:* **2:00 or more**. *Cover of the trimmed seed.* A modern documentary theme, nothing like a band: two marimbas
locking into a steady pulse, piano doubling. The melody on a bright glockenspiel and vibraphone, then the same melody an
octave down on bowed bass, slower, half a step off, so the two drift against each other and never agree. It should feel
like a machine thinking.

**Style**
```
minimalist documentary theme, two interlocking marimbas, steady pulse, piano doubling, glockenspiel and vibraphone play the melody, low bowed bass answers the same melody slower and slightly out of tune, 120 BPM, 4/4, E minor, hypnotic, restrained, unresolved, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: two marimbas lock into a pulse]
[Verse: glockenspiel and vibraphone enter with the melody]
[Verse: bowed bass answers, slower, out of tune]
[Bridge: both melodies at once, clashing, the pulse never stops]
[Outro: the marimbas thin to one, then stop]
[End]
```
*Exclude extra:* `brass, brass band, cornet, epic, trailer, drum kit`

---

### 3. `ai_locked_room.mp3`: confinement
*Length:* **1:30 or more**. *New, no melody.* The room itself. Not music so much as air pressure: a bowed metal swell,
a low hum like a building at night, rain far off. (The band outside is cue 4, a separate file.)

**Style**
```
dark ambient soundscape, bowed metal and bowed cymbal swells, low tape hum, distant rain, a slowly breathing low drone, sparse prepared piano notes far apart, free time, D minor, still, confined, airless, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: a bowed metal swell out of silence]
[Verse: the low drone breathes, distant rain]
[Verse: a few prepared piano notes, far apart]
[Outro: the drone alone, fading]
[End]
```
*Exclude extra:* `melody, strings swell, percussion, brass, felt piano`

---

### 4. `ai_palace_band.mp3`: the band outside, like an old record
*Length:* **1:00 or more**. *Cover of the trimmed seed.* The melody as a slow waltz, but heard as a worn wax cylinder:
thin, wobbling in pitch, crackle and hiss, the high end gone. Through the wall in chapter 1; in chapter 8 it comes back
under the flag change, more warped.

**Style**
```
1900s wax cylinder recording, small military band waltz, thin and distant, warped wobbling pitch, needle crackle and hiss, lo-fi, 3/4, 80 BPM, A-flat major, faded and melancholy, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: needle crackle, then the band fades in mid-phrase]
[Verse: the waltz, wobbling]
[Verse: again, the pitch sagging]
[Outro: the record runs down]
[End]
```
*Exclude extra:* `orchestra, strings, accordion, clean modern recording, hi-fi`

---

### 5. `ai_old_rule.mp3`: a young country minding its own business
*Length:* **1:30 or more**. *Cover of the trimmed seed.* Front-porch and cheerful: a fiddle plays the melody as a reel
over a stomping foot and an upright bass, a fingerpicked guitar joins, then a banjo, the band getting bigger as the
country grows west. I cut it dead on "The continent was full."

**Style**
```
old-time American string band, fiddle plays the melody as a reel, foot stomps, upright bass, fingerpicked acoustic guitar, clawhammer banjo joins later, 116 BPM, 2/4, D major, homespun and sunny, live room, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: foot stomp and fiddle, already playing]
[Verse: the melody as a reel, upright bass]
[Verse: guitar joins]
[Verse: banjo joins, fuller]
[Outro: everyone, final stomp]
[End]
```
*Exclude extra:* `bluegrass vocals, country vocals, celtic, bagpipes, brass`

---

### 6. The four pitches
*Length:* **0:50 or more each**. *Covers of the trimmed seed.* Four salesmen, four totally different sales soundtracks.
They don't need to match: I cut between them hard, and the silences ("one room," "It wasn't.") are mine. Each pitcher
believes what he's selling, so each cue plays it **straight**.

**6a. `ai_pitch_business.mp3`: the Businessman, as a 1950s corporate film**
A cheerful industrial short about the wonders of trade: walking bass, brushed snare, vibraphone and flute with the
melody, a muted trumpet answering low.
```
1950s corporate industrial film music, walking upright bass, brushed snare, vibraphone and flute play the melody, low muted trumpet answers, finger snaps, 132 BPM, 4/4, F major, upbeat, optimistic, salesmanlike, instrumental
```
*Exclude extra:* `big band, swing vocals, synth, drum kit fill`

**6b. `ai_pitch_admiral.mp3`: the Admiral, as a war-film march**
Low strings driving a steady figure, snare, French horns with **only the first four notes** of the melody, over and
over, building: a fleet on the horizon.
```
cinematic naval march, driving low strings ostinato, military snare, French horns repeat a four-note motif, timpani, building steadily, 100 BPM, 4/4, C minor, determined, expansive, restrained, instrumental
```
*Exclude extra:* `trailer, epic, choir, cinematic hit, braam, cornet`

**6c. `ai_pitch_preacher.mp3`: the Preacher, as a gospel organ**
A warm electric organ with a rotating speaker, slow and soulful, tambourine on the backbeat, hand claps, bass. Sunday
morning, and he means every word.
```
instrumental gospel, warm tonewheel organ with rotating speaker plays the melody slow and soulful, tambourine on the backbeat, hand claps, electric bass, 76 BPM, 12/8, E-flat major, joyful and sincere, instrumental
```
*Exclude extra:* `gospel vocals, church choir, preacher voice, pipe organ`

**6d. `ai_pitch_scientist.mp3`: the "Scientist", as a 1950s science filmstrip**
The melody on a theremin, very serious, over a vibraphone pattern and celesta, a little tremolo guitar: the sound of
confident, official, completely wrong science.
```
1950s educational science film music, theremin plays the melody, oscillating vibraphone pattern, celesta, tremolo electric guitar, upright bass, 90 BPM, 4/4, G minor, earnest, eerie, authoritative, instrumental
```
*Exclude extra:* `modern synth, edm, horror, music box, ticking clock`

**Lyrics** (the same tags for all four, with the opening named)
```
[Instrumental]
[Intro: the rhythm section first, no melody yet]
[Verse: the melody enters]
[Verse: the melody again, fuller]
[Outro: a button ending]
[End]
```

---

### 7. `ai_four_bells.mp3`: four arguments, one harbor
*Length:* **0:40 or more**. *New, no melody.* I place the four ship's-bell strikes by hand. This is what follows: a
bowed cymbal opening into a slow rising swell of low strings and brass pads, carrying the camera down into Honolulu.

**Style**
```
slow rising swell, bowed cymbal, low strings and soft horns rising from one low note to a wide open chord, deep floor tom heartbeat, 60 BPM, B major, vast, grave, not loud, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: bowed cymbal out of silence]
[Build: low strings and horns rise]
[Outro: the open chord held, then released]
[End]
```
*Exclude extra:* `choir, bells, trailer, epic, cinematic hit, braam`

---

### 8. `ai_mechanism.mp3`: the heist (the Deed)
*Length:* **2:30 or more** (Extend as needed: chapter 6 is long). *Cover of the trimmed seed.* A cool, dark heist score:
an upright bass riff built from the melody's notes, low and slowed, so the tune is in the floor, not on top. Brushed snare,
bongos, a low flute, harpsichord stabs. Every phrase steady, because I cut many silences into it. Near the end the melody
surfaces whole, slow and low on bass trombone, for the flag going up.

**Style**
```
1960s heist film score, cool and dark, upright bass riff built from the melody, brushed snare, bongos, low flute, dry harpsichord stabs, low tenor saxophone, 96 BPM, 4/4, B-flat minor, sly, inevitable, steady 8-bar phrases, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: the upright bass riff alone]
[Verse: brushed snare and bongos join]
[Verse: low flute and harpsichord stabs]
[Verse: tenor saxophone, darker]
[Outro: bass trombone plays the melody slow and low]
[End]
```
*Exclude extra:* `swing vocals, big band, ticking clock, felt piano, epic, drum kit fill`

---

### 9. `ai_charge.mp3`: the George III callback (the same file every episode)
*Length:* **0:20**, with the first **3 to 5 seconds** recognizable on their own. *New, no melody.* Three dry, courtly
harpsichord chords, then a full symphony orchestra takes the same three chords with a timpani roll: the crown changes
hands. The only orchestra in the series, so it lands. It rings into silence.

**Style**
```
baroque harpsichord plays three dry royal chords, then a full symphony orchestra takes the same three chords, timpani roll, 80 BPM, D major, formal, grave, ringing out, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: harpsichord, three chords]
[Verse: the orchestra takes the chords, timpani roll]
[Outro: one held chord, ringing into silence]
[End]
```
*Exclude extra:* `trailer, epic, choir, braam, brass band`

---

### 10. `ai_answer.mp3`: the Answer (chapter 8, and the last chord of the episode)
*Length:* **2:00 or more**. *New, its own hymn, not the melody.* Unchanged from v3: it was already its own world. One
small reed pump organ in a quiet parlor, the bellows audible, a hymn played slowly and plainly. Nothing added.

**Style**
```
small reed pump organ, instrumental hymn tune, audible bellows, played slowly and plainly, 56 BPM, free time, F major, intimate and dignified, no swell, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: the bellows, then the first chord]
[Verse: reed organ, the hymn tune]
[Verse: the hymn again, softer]
[Outro: one long chord]
[End]
```
*Exclude extra:* `choir, church choir, pipe organ, strings, piano, synth`

**Her own music, as an option:** Liliʻuokalani composed *Ke Aloha o ka Haku* (The Queen's Prayer) on March 22, 1895,
imprisoned in the room this episode shows. The score is in the public domain. I can arrange it for reed organ myself
(credited on screen) to use in place of, or after, this cue. Don't ask Suno to imitate it. I'd avoid *Aloha ʻOe*:
American sheet music turned it into a tourist farewell.

---

### 11. `ai_ledger.mp3`: the Ledger (every episode; only the third phrase changes)
*Length:* **0:15**. *Cover of the trimmed seed.* Three equal phrases, one per column, each in a different sound:
**Said** on bright glockenspiel, **Did** on a detuned upright piano, slower, **Answered back** on the reed organ.

**Style**
```
three short equal phrases of the melody: bright glockenspiel, then a detuned old upright piano a little slower, then a small reed organ, 72 BPM, 4/4, B-flat major, plain and even, instrumental
```
**Lyrics**
```
[Instrumental]
[Verse: glockenspiel, one phrase]
[Verse: detuned upright piano, one phrase]
[Verse: reed organ, one phrase]
[End]
```
*Exclude extra:* `orchestra, percussion, brass, felt piano`

---

### 12. `ai_both.mp3`: "the answer is both"
*Length:* **0:30 or more**. *Cover of the trimmed seed.* For the first time the melody played by everyone **together**,
in one key, plainly: a string quartet in unison, then opening into a four-part chorale. Grave and honest, not
triumphant. A sound we haven't used yet, saved for this.

**Style**
```
string quartet, the melody in unison, then opening into a plain four-part chorale, close-miked, 66 BPM, 4/4, B-flat major, grave, honest, warm, not triumphant, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: a held open fifth]
[Verse: the quartet plays the melody in unison]
[Verse: the melody again as a four-part chorale]
[Outro: a held chord]
[End]
```
*Exclude extra:* `orchestra, epic, solo cello, pad, piano, brass`

---

### 13. `ai_next.mp3`: the tease (the USS *Maine*, Episode 2)
*Length:* **0:30**. *New, no melody.* Heard from under the water: a muffled boom, a low pressure drone, a field drum
somewhere far above, metal groaning. It doesn't resolve.

**Style**
```
underwater dark ambient, muffled distant boom, low pressure drone, metal groaning, a faint field drum far above, 70 BPM, unresolved, ominous, restrained, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: a muffled boom]
[Verse: low drone and groaning metal, the far drum]
[End]
```
*Exclude extra:* `trailer, epic, cinematic hit, braam, orchestra, melody`

---

## Where each cue plays (Episode 1)

| Ch | Music | Silence |
|---|---|---|
| 1 Locked Room | `ai_locked_room`, with `ai_palace_band` faint through the wall | |
| 2 Question | `ai_motif` rises on the "In 1776" pull-back; `ai_theme` under the two tablets; ends on "First, the old rule." | the parchment |
| 3 Old Guard | `ai_old_rule`; one held low note carries "So where next?" into the pitch room | the nugget; a dead stop on "The continent was full." |
| 4 Pitch Meeting | room tone, then `ai_pitch_*` one per pitcher | "one room," the pitchers' appearance, "It wasn't." |
| 5 Same Islands | four bell strikes by hand, then `ai_four_bells` into the dive | |
| 6 Heist | `ai_mechanism`; the melody surfaces on bass trombone at the flag | both underlines, every humor cut, "I yield" |
| 7 He Has | `ai_charge`, ringing out | after it |
| 8 Under Protest | `ai_answer` from "brought here, to this room"; `ai_palace_band`, more warped, under the flag change | the Queen's own words |
| 9 The Question | `ai_theme` low; `ai_ledger`; `ai_both` on "the answer is both"; `ai_answer`'s last chord after the window; `ai_next` under the *Maine* | the circle (2 s); "Except the asking." |

**How varied it is now:** 16 files, each in its own sound world (the ledger borrows the Answer's reed organ on purpose),
tempos from free time to 132 BPM, 11 keys, four meters (4/4, 3/4, 2/4, 12/8). Besides the seed, the melody is in 10 cues,
whole in 7, and opens only the 15-second ledger.
