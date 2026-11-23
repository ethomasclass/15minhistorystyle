# Suno prompts: American Imperialism, Episode 1 (v3, one tune in three voices)

Built from `research/SCORING_RESEARCH.md`. v2 gave every cue its own instruments but nothing tied them together. v3 keeps
the variety in the **instruments** and puts one short **tune** through the whole series, the way documentary scores do it.

## The idea: one argument, three voices

| Voice | Stands for | Sound | Rule |
|---|---|---|---|
| **The Claim** | What America said | The tune proud and sincere: cornet band, major key | Always played straight, never mocked |
| **The Deed** | What America did | The same tune bent: euphonium and tuba, slower, a little flat; or a player piano | Never louder than the Claim. Same tune, not a villain |
| **The Answer** | Who answered back | Its own tune, new each episode. Ep 1: one small reed organ, a hymn in the tradition Liliʻuokalani wrote in | Never the Claim's tune |

The series theme is the Claim and the Deed played against each other in two keys at once (the 1890s composer Charles Ives
built pieces from two bands marching past each other in different keys). The argument never settles until chapter 9, where
the two play together, in one key, once: "the answer is both."

**Silence is part of the score:**
- **The Declaration line** (ch 2, twice in ch 6, ch 9) is always silent. The cue before it stops dead on the cut, so the
  missing music becomes the sign.
- **Humor cuts** go to silence. The music comes back on the first beat of a **new** phrase, never where it stopped.
- **No music** under "I yield to the superior force," and none under the Queen's own words in chapter 8.

## How to make them

Make **cue 1 first**. Most of the others are **Covers** of it (Suno's Cover keeps the melody and changes the style), so the
tune carries through. If a Cover loses the tune, make that cue fresh with the same Style text.

**Settings:**
- **Custom** mode. Paste the **Style** box and the **Lyrics** box (structure tags only, no words).
- **Instrumental:** v2 used OFF with tags; the music library's notes say ON. On cue 1, try **both** and tell me which one
  stayed free of voices. Use that setting for the rest.
- **Exclude styles:** a short core every time, plus the few extra words each cue lists:

```
vocals, choir, humming, wordless vocals, drum kit, synth
```

- Make **2 to 4 takes**. Keep the one whose **first 30 to 40 seconds** already sound right and keep to the tempo and key.
- Too short? **Extend** from the last good section. Longer is fine: I trim, fade and cut the stops myself.
- Download as **MP3**, named exactly as shown, and send them back. I level them about 13 LU under the voice and audition
  every take under the real narration. A take that hides the consonants gets rejected.
- **Get Stems**, if your plan has it, on cues 2, 6 and 9: I may need to pull the lead out under busy lines.

**Still banned** (the channel's overused sounds and the island clichés): felt piano, pizzicato, ticking clocks, solo cello
over a pad, clarinet and bassoon, ukulele, steel or slack-key guitar, hula drums. And never type "Hawaiian", "island" or
"tropical" as a style: name instruments instead.

| # | File | Voice | Used in | Make it as |
|---|---|---|---|---|
| 1 | `ai_motif.mp3` | Claim | the seed (and the ch 2 rise) | new |
| 2 | `ai_theme.mp3` | Claim vs Deed | ch 2, ch 9, every episode | Cover of 1 |
| 3 | `ai_locked_room.mp3` | (room) | ch 1, ch 8 room | new |
| 4 | `ai_palace_band.mp3` | Claim as a waltz | through the wall in ch 1; the ch 8 flag change | Cover of 1 |
| 5 | `ai_old_rule.mp3` | Claim, small | ch 3 | Cover of 1 |
| 6a-d | `ai_pitch_business/admiral/preacher/scientist.mp3` | Claim, four ways | ch 4 | Covers of 1, same tempo and key |
| 7 | `ai_four_bells.mp3` | (organ) | ch 5, into the dive to Honolulu | new |
| 8 | `ai_mechanism.mp3` | Deed | ch 6 | Cover of 1 |
| 9 | `ai_charge.mp3` | signature | ch 7, every episode | new |
| 10 | `ai_answer.mp3` | Answer | ch 8, ch 9's last chord | new |
| 11 | `ai_ledger.mp3` | all three | ch 9, every episode | new |
| 12 | `ai_both.mp3` | Claim and Deed together | ch 9 "the answer is both" | Cover of 1 |
| 13 | `ai_next.mp3` | (tease) | ch 9 end, the *Maine* | new |

---

### 1. `ai_motif.mp3`: the tune, plainly
*Length:* **0:40 or more**. *Make first.* Everything else grows from this. It should be hummable after one hearing:
a short phrase that opens on a rising bugle-like leap, simple as a hymn.

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
*Exclude extra:* `trumpet fanfare, orchestra, epic`

---

### 2. `ai_theme.mp3`: the series theme, "Claim and Deed"
*Length:* **2:00 or more**. *Cover of `ai_motif`.* The tune proud on cornet; the same tune answered by euphonium and tuba,
slower and a half step flat, like a second band in the wrong key. They overlap more and more and never agree.

**Style**
```
documentary theme, two brass bands in different keys, cornet plays the tune in B-flat major, euphonium and tuba answer the same tune slower and slightly flat, 72 BPM, 4/4, restrained, unresolved, sparse, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: solo cornet, the tune]
[Verse: euphonium and tuba answer, the tune bent and flat]
[Verse: cornet and euphonium trade phrases, field drum]
[Bridge: both at once, two keys clashing, soft]
[Outro: cornet and tuba hold clashing notes]
[End]
```
*Exclude extra:* `trumpet, orchestra, epic trailer, choir`

---

### 3. `ai_locked_room.mp3`: confinement
*Length:* **1:30 or more**. *New.* The room itself: still, glassy, a held breath. (The band outside is cue 4, a separate
file, so I can filter it "through the wall" and bring it back in chapter 8.)

**Style**
```
minimal ambient score, bowed vibraphone, glass harmonica, low bowed double bass drone, 60 BPM, free time, D minor, still and confined, very sparse, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: one bowed vibraphone note]
[Verse: glass harmonica, slow, the bass drone under]
[Outro: the drone alone, fading]
[End]
```
*Exclude extra:* `piano, strings swell, percussion`

---

### 4. `ai_palace_band.mp3`: the band outside
*Length:* **1:00 or more**. *Cover of `ai_motif`.* The tune as a slow waltz by a European-style military band, the kind
Henri Berger led in Honolulu. Record it plain: I'll muffle it myself. In chapter 8 it plays under the flag change.

**Style**
```
1890s military brass band waltz, cornets, alto horns, tuba, bass drum, the tune in slow 3/4, 84 BPM, B-flat major, stately, outdoor band, instrumental
```
**Lyrics**
```
[Instrumental]
[Verse: the band plays the tune as a waltz]
[Verse: again, fuller]
[Outro: final chord]
[End]
```
*Exclude extra:* `orchestra, strings, accordion`

---

### 5. `ai_old_rule.mp3`: a young country minding its own business
*Length:* **1:30 or more**. *Cover of `ai_motif`.* Small and homespun, fife and field drum, widening into a village band
as the country grows west. I'll cut it dead on "The continent was full."

**Style**
```
1860s American fife and drum, wooden fife plays the tune, field drum, then a small village cornet band joins, 96 BPM, 2/4 march, B-flat major, innocent and open, regular 8-bar phrases, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: fife alone, the tune]
[Verse: field drum joins]
[Verse: small cornet band joins, wider]
[Outro: full band, final cadence]
[End]
```
*Exclude extra:* `bagpipes, celtic, orchestra`

---

### 6. The four pitches (`ai_pitch_business`, `ai_pitch_admiral`, `ai_pitch_preacher`, `ai_pitch_scientist`)
*Length:* **0:50 or more each**. *Covers of `ai_motif`, all at **108 BPM in B-flat**,* so I can cut from one to the next.
All four play it **straight**: each pitcher believes what he's selling. The silences ("one room," "It wasn't.") are mine.

**6a. `ai_pitch_business.mp3`: the Businessman**
```
1890s cornet band two-step, cornets and tuba, fingerpicked classic parlor banjo, the tune in 6/8, 108 BPM, B-flat major, prosperous and confident, regular 8-bar phrases, instrumental
```
**6b. `ai_pitch_admiral.mp3`: the Admiral**
```
naval brass, bugle calls quoting the tune, field drum, low brass chords, 108 BPM, 4/4, B-flat major, disciplined and expansive, short phrases with space between, instrumental
```
**6c. `ai_pitch_preacher.mp3`: the Preacher**
```
instrumental gospel hymn tune, pipe organ and brass quartet, the tune as a Sunday hymn, 108 BPM, 4/4, B-flat major, public and confident, regular phrases, instrumental
```
**6d. `ai_pitch_scientist.mp3`: the "Scientist"**
```
precise player piano, xylophone, snare rim clicks, the tune exact and mechanical, 108 BPM, 4/4, B-flat major, clinical and self-assured, regular 8-bar phrases, instrumental
```
**Lyrics** (the same for all four)
```
[Instrumental]
[Verse: the tune]
[Verse: the tune again, a little fuller]
[Outro: final cadence]
[End]
```
*Exclude extra:* 6a `bluegrass, country, minstrel`; 6b `trumpet fanfare, epic`; 6c `choir, gospel vocals, church choir`;
6d `ticking clock, music box, synth`

---

### 7. `ai_four_bells.mp3`: four arguments, one harbor
*Length:* **0:40 or more**. *New.* I place the four ship's-bell strikes by hand on the badges, so this is only the organ
swell that follows and carries the camera down into Honolulu.

**Style**
```
pipe organ, one long rising swell from a low pedal note to a full chord, slow, 60 BPM, B-flat major, grand but not loud, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: low organ pedal note]
[Build: the organ swells to a full chord]
[Outro: the chord held, then released]
[End]
```
*Exclude extra:* `choir, bells, wedding`

---

### 8. `ai_mechanism.mp3`: the plan working like a machine (the Deed)
*Length:* **2:30 or more** (Extend as needed: chapter 6 is long). *Cover of `ai_motif`.* The tune on a player piano,
exact and unhurried, a steam-engine pulse under it, a field drum getting closer. The tune in the low brass, bent, near
the end (for the flag going up). Many silences get cut into this one, so steady phrases matter.

**Style**
```
player piano plays the tune exact and mechanical, steady low pulse like a steam engine, distant field drum slowly approaching, 92 BPM, 4/4, B-flat minor, cool and inevitable, regular 8-bar phrases, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: player piano alone, the tune in minor]
[Verse: the steam pulse joins]
[Verse: the field drum, far away]
[Verse: the drum closer, steady]
[Outro: euphonium and tuba play the tune slow and flat]
[End]
```
*Exclude extra:* `ticking clock, felt piano, orchestra, epic`

---

### 9. `ai_charge.mp3`: the George III callback (the same file every episode)
*Length:* **0:20**, with the first **3 to 5 seconds** recognizable on their own. *New.* Dry royal harpsichord chords,
taken over by an American brass choir: the crown changes hands. It rings into silence.

**Style**
```
baroque harpsichord, three dry royal chords, then a brass choir of cornets, alto horns and euphonium takes the same chords, timpani roll, 80 BPM, D major, formal and grave, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: harpsichord, three chords]
[Verse: the brass choir takes the chords, timpani roll]
[Outro: one held brass chord]
[End]
```
*Exclude extra:* `orchestra, epic trailer, choir`

---

### 10. `ai_answer.mp3`: the Answer (chapter 8, and the last chord of the episode)
*Length:* **2:00 or more**. *New, not a Cover:* its own tune. One small reed pump organ in a quiet parlor, the bellows
audible, a hymn tune played slowly and plainly. No swell, no strings, nothing added. This is the quiet chapter.

**Style**
```
small reed pump organ, instrumental hymn tune, audible bellows, played slowly and plainly, 56 BPM, free time, F major, intimate and dignified, no swell, instrumental
```
**Lyrics**
```
[Instrumental]
[Verse: reed organ, the hymn tune]
[Verse: the hymn again, softer]
[Outro: one long chord]
[End]
```
*Exclude extra:* `choir, church choir, pipe organ, strings, piano`

**Her own music, as an option:** Liliʻuokalani composed *Ke Aloha o ka Haku* (The Queen's Prayer) on March 22, 1895,
imprisoned in the room this episode shows, as a hymn of forgiveness. The score is in the public domain. I can arrange it
for reed organ myself (credited on screen) to use in place of, or after, this cue. Don't ask Suno to imitate it. I'd
avoid *Aloha ʻOe*: American sheet music turned it into a tourist farewell.

---

### 11. `ai_ledger.mp3`: the Ledger (every episode; only the third phrase changes)
*Length:* **0:15**. *New.* Three equal phrases, one per column: Said (cornet), Did (euphonium, a little flat), Answered
back (reed organ). Make the whole thing here; in later episodes only the last phrase gets remade.

**Style**
```
three short equal phrases: solo cornet, then euphonium slightly flat, then small reed organ, simple hymn-like phrases, 72 BPM, 4/4, B-flat major, plain and even, instrumental
```
**Lyrics**
```
[Instrumental]
[Verse: solo cornet, one phrase]
[Verse: euphonium, one phrase]
[Verse: reed organ, one phrase]
[End]
```
*Exclude extra:* `orchestra, percussion, choir`

---

### 12. `ai_both.mp3`: "the answer is both"
*Length:* **0:30 or more**. *Cover of `ai_motif`.* The Claim and the Deed together for the first time: cornet and
euphonium play the tune in unison, in **one** key, at equal weight. Grave, not triumphant.

**Style**
```
cornet and euphonium play the tune together in unison, same key, equal weight, soft tuba under, 72 BPM, 4/4, B-flat major, grave and honest, not triumphant, instrumental
```
**Lyrics**
```
[Instrumental]
[Verse: cornet and euphonium together, the tune]
[Outro: held unison note]
[End]
```
*Exclude extra:* `trumpet fanfare, epic, orchestra`

---

### 13. `ai_next.mp3`: the tease (the USS *Maine*, Episode 2)
*Length:* **0:30**. *New.* A new texture for a new story: a lone field drum and a low brass note that doesn't resolve.

**Style**
```
lone military field drum, slow roll, one low brass note held under it, 70 BPM, 4/4, unresolved, ominous but restrained, instrumental
```
**Lyrics**
```
[Instrumental]
[Intro: field drum roll]
[Verse: low brass note under the drum]
[End]
```
*Exclude extra:* `orchestra, epic trailer, cinematic hit`

---

## Where each cue plays (Episode 1)

| Ch | Music | Silence |
|---|---|---|
| 1 Locked Room | `ai_locked_room`, with `ai_palace_band` faint through the wall | |
| 2 Question | `ai_motif` rises on the "In 1776" pull-back; `ai_theme` under the two tablets; ends on "First, the old rule." | the parchment |
| 3 Old Guard | `ai_old_rule`; one held low note carries "So where next?" into the pitch room | the nugget; a dead stop on "The continent was full." |
| 4 Pitch Meeting | room tone, then `ai_pitch_*` one per pitcher | "one room," the pitchers' appearance, "It wasn't." |
| 5 Same Islands | four bell strikes by hand, then `ai_four_bells` into the dive | |
| 6 Heist | `ai_mechanism`; the bent tune in the low brass at the flag | both underlines, every humor cut, "I yield" |
| 7 He Has | `ai_charge`, ringing out | after it |
| 8 Under Protest | `ai_answer` from "brought here, to this room"; `ai_palace_band`, muffled, under the flag change | the Queen's own words |
| 9 The Question | `ai_theme` low; `ai_ledger`; `ai_both` on "the answer is both"; `ai_answer`'s last chord after the window; `ai_next` under the *Maine* | the circle (2 s); "Except the asking." |
