# Suno prompts: American Imperialism, Episode 1 (v2, a new palette)

Copy each **Style** box and its **Lyrics** box (structure tags only) into Suno. Everything else is labels.

**Why v2:** the channel's recent cues lean on the same few sounds (felt piano, pizzicato, ticking clocks, a solo cello over a
string pad, clarinet and bassoon). This set gives every cue its own sound world, and the exclude list now bans those habits so
Suno can't drift back to them.

| Cue | Sound world | The idea |
|---|---|---|
| `ai_theme` | Two small-town brass bands playing the same hymn in different keys | The series question: one America, two versions of it, overlapping |
| `ai_locked_room` | Glass and bowed metal tones, a faint band heard through a closed window | Confinement: the world goes on outside, muffled |
| `ai_old_rule` | Hammered dulcimer and wooden flute, then wide open strings that stop dead | A young country minding its own business, until the continent runs out |
| `ai_pitch_meeting` | A banjo two-step recorded like an 1890s wax-cylinder record | A sales pitch on the newest gadget of the day; four sections, one per pitcher |
| `ai_same_islands` | A ship's bell struck four times, then a pipe organ chord | Four arguments, one harbor |
| `ai_heist` | Two pianos in an interlocking minimalist pulse, a snare approaching | A plan working like a machine |
| `ai_he_has` | A harpsichord's royal chords, taken over by an American brass choir | The crown changes hands |
| `ai_under_protest` | One old reed pump organ, a hymn on a weekday | Quiet dignity (she wrote hymns herself) |

## Settings (same for every cue)

- **Custom** mode, **Instrumental OFF**, and paste only the structure tags in the Lyrics box (they start with [Instrumental],
  so there are no words to sing). If a take hums or sings, throw it out.
- **Exclude styles** (paste every time):

```
vocals, choir, lyrics, humming, whistling, drum kit, EDM, trap, pop, rock, dubstep, rap, synth lead, epic trailer, cartoon, comedic, ukulele, luau, tiki, hula, slack key guitar, steel guitar, exotica, western movie theme, pizzicato strings, felt piano, ticking clock, solo cello
```

- Make **2 to 4 takes**; keep the one whose **first 30 to 40 seconds** already sound right.
- If a take is too short, **Extend** from its last good section. Longer is always fine: I trim and fade.
- **Download as MP3**, named exactly as shown (e.g. `ai_theme.mp3`), and send them back. I level them about 13 LU under the
  voice.
- The humor cuts play in **silence**, so the cues ask for clean stops I can cut into.

**On Hawaiʻi and the music:** still no "island" sounds (no ukulele, steel or slack key guitar). The reed organ in cue 8 is the
nearest thing to a nod: hymns were at the center of 1890s Honolulu, and Liliʻuokalani wrote them. The *Aloha ʻOe* offer still
stands: her song (1878) is in the public domain, and a quiet arrangement made by us could replace cue 8 under her own words.

---

### 1. `ai_theme.mp3`: the series theme, "Two Bands"
*Used in:* ch 2 (the 1776 line), ch 9 (the answer, the Ledger, the end screen); every episode's last chapter.
*Length:* **at least 2:00**

```
a slow, earnest patriotic hymn played by a small 1890s town brass band, cornets, alto horns, baritone horn and tuba, warm but a little out of tune; halfway through, a second brass band far in the distance drifts in playing the same hymn in a different key and a slightly different tempo, the two overlapping uneasily like two parades meeting on one street; then the near band stops and the distant band finishes alone, thin and far away, on a chord that does not resolve, 66 BPM, 4/4, B-flat major clouded by a second key; documentary underscore, sparse, space for narrator, instrumental
```

```
[Instrumental]
[Intro: near brass band, the hymn's first phrase, soft]
[Verse: the full hymn, warm, a little out of tune]
[Bridge: a distant second band enters in another key, the two overlap uneasily]
[Break: the near band stops, only the distant band remains]
[Outro: the distant band alone, unresolved chord, fades]
[End]
```

### 2. `ai_locked_room.mp3`: the cold open, "Through the Wall"
*Used in:* ch 1 and the start of ch 2 (the room, the hall, the pull back to the palace).
*Length:* **at least 1:15**

```
a still, close, airless room made of sound: long glassy tones of bowed vibraphone and glass harmonica that hang in the air and fade, a very low bowed double bass note now and then, and, as if heard through a closed window from far across the grounds, a faint muffled brass band playing a slow waltz that drifts in and out; patient, dignified, confined; no beat, free time; ends on one bowed glass tone fading to silence; documentary underscore, sparse, space for narrator, instrumental
```

```
[Instrumental]
[Intro: a single bowed glass tone, long silence]
[Verse: glass harmonica and bowed vibraphone, low bowed bass]
[Bridge: a faint distant brass waltz drifts in, muffled, then away]
[Outro: one bowed tone fades to silence]
[End]
```

### 3. `ai_old_rule.mp3`: the old guard, "Minding Its Own Business"
*Used in:* ch 3 (isolation, Alaska, the closed frontier). Replaces the library's `g_founding`.
*Length:* **at least 1:15** (needs about 45 s)

```
a modest, homespun early American tune on hammered dulcimer and wooden flute over a soft upright bass, unhurried and self-contained, like a small town that never needs to leave home; one clean stop in the middle; in the second half the tune widens into open, airy strings as if looking out across a whole continent, then stops abruptly on an open chord, as if it has run out of room, 92 BPM, 3/4, D major; documentary underscore, space for narrator, instrumental
```

```
[Instrumental]
[Intro: hammered dulcimer alone, the tune]
[Verse: wooden flute and upright bass join, easy and modest]
[Stop]
[Verse: the tune again]
[Build: open airy strings widen underneath]
[Outro: abrupt stop on an open chord]
[End]
```

### 4. `ai_pitch_meeting.mp3`: the pitch room, "The Wax Cylinder Pitch"
*Used in:* ch 4, the four pitches (about 2:30).
*Length:* **at least 3:00**

```
a confident, polished sales pitch in music, recorded like an 1890s wax cylinder phonograph record: thin, warm, narrow, a gentle crackle and hiss; a bright five-string banjo and a small parlor orchestra play a strutting two-step; four short sections with clean stops between them, each a different pitch: first jaunty banjo and cornet, prosperous; then brisk bugle calls and a parade snare, naval and proud; then a reed organ hymn, earnest and pious; then a cold, precise xylophone figure over a dry snare rim, clinical and uneasy; never loud, persuasive with a hint of menace, 100 BPM, 2/4, G major turning minor at the end; documentary underscore, space for narrator, instrumental
```

```
[Instrumental]
[Intro: banjo alone, a strutting two-step figure]
[Section 1: banjo and cornet, prosperous]
[Stop]
[Section 2: bugle calls and parade snare, naval and proud]
[Stop]
[Section 3: reed organ hymn, earnest]
[Stop]
[Section 4: cold xylophone and snare rim, clinical, uneasy]
[Outro: back to the banjo figure alone, then stops]
[End]
```

### 5. `ai_same_islands.mp3`: the twist, "Four Bells"
*Used in:* ch 5 (four pins land on the map, then through the map to Honolulu).
*Length:* **at least 0:30** (needs about 20 s)

```
a short reveal: four strikes of a large ship's bell, each one closer together and a little louder, a bowed cymbal and a low pipe organ pedal note swelling underneath, then on the reveal everything opens into one vast, quiet, sustained pipe organ chord like a cathedral above the sea, 80 BPM, 4/4; documentary underscore, sparse, instrumental
```

```
[Instrumental]
[Intro: one ship's bell strike]
[Build: three more strikes, closer together, organ pedal rising]
[Hit: the fourth strike]
[Outro: a vast quiet organ chord, fades]
[End]
```

### 6. `ai_heist.mp3`: sugar, the harbor, the overthrow, "The Mechanism"
*Used in:* ch 6 (about 2:30).
*Length:* **at least 3:15**

```
a cold, slowly tightening minimalist pulse: two pianos playing the same short repeating pattern a fraction out of step so it shimmers and slowly shifts, a muted plucked harp doubling the pattern, long low bowed double bass notes, and a distant military snare that slowly approaches in the middle as if troops are coming ashore, then recedes; methodical and controlled, never exciting, like watching a plan work; several clean drop-outs to silence, no climax, 112 BPM in steady eighth notes, 4/4, E minor; documentary underscore, space for narrator, instrumental
```

```
[Instrumental]
[Intro: one piano, the repeating pattern]
[Verse: the second piano enters slightly out of step, harp doubles]
[Stop]
[Build: the pattern shifts, low bass, a distant snare approaches]
[Main: steady and tense, snare close]
[Stop]
[Break: low bass alone]
[Verse: the pattern returns, quieter, snare receding]
[Outro: the pianos drop away to one held bass note]
[End]
```

### 7. `ai_he_has.mp3`: the George III callback, "The Crown Changes Hands" (same cue every episode)
*Used in:* ch 7, and the callback in every episode, so viewers learn the sound.
*Length:* **at least 0:30** (needs about 20 s)

```
a short signature cue for a recurring moment: a solo harpsichord plays four stately, formal court chords like a royal decree, then a low timpani roll rises under them and a grave, quiet American brass choir takes over the same four chords and holds the last one; formal and heavy, like a charge read aloud in court; free time, about 60 BPM; documentary underscore, instrumental
```

```
[Instrumental]
[Intro: solo harpsichord, four formal chords]
[Build: low timpani roll rises]
[Swell: brass choir takes over the same four chords]
[Outro: the last chord held, fades]
[End]
```

### 8. `ai_under_protest.mp3`: the quiet chapter, "Weekday Hymn"
*Used in:* ch 8 (about 1:20).
*Length:* **at least 1:45**

```
a quiet, dignified hymn on a single old reed pump organ, as if played alone in a small wooden church on a weekday: slow simple chords, soft breathy bellows you can hear, a few long held notes and long pauses, imperfect and human, no swell, no build, no melodrama, the same gentle level throughout, ends in silence, free time, about 56 BPM; documentary underscore, sparse, space for narrator, instrumental
```

```
[Instrumental]
[Intro: the bellows, one soft chord]
[Verse: slow hymn chords, long pauses]
[Verse: the hymn again, softer]
[Outro: one held chord, then silence]
[End]
```

---

## Where each cue sits in Episode 1

| Chapter | Cue | Notes |
|---|---|---|
| 1 The Locked Room | `ai_locked_room` | |
| 2 The Question | `ai_locked_room` → `ai_theme` | The theme's first phrase lands on the 1776 line |
| 3 The Old Guard | `ai_old_rule` | Its stop sits on the gold-nugget cut; the abrupt end on "The continent was full." |
| 4 The Pitch Meeting | `ai_pitch_meeting` | Silence under the empty room; one section per pitcher |
| 5 The Same Islands | `ai_same_islands` | One bell per pitch |
| 6 The Heist | `ai_heist` | Drop-outs for the Committee, Stevens and pineapple cuts |
| 7 He Has, We Have | `ai_he_has` | |
| 8 Under Protest | `ai_under_protest` | Or the *Aloha ʻOe* arrangement |
| 9 Back to the Question | `ai_theme` | Through the end screen; the two bands overlap under "betrayal or expression" |
