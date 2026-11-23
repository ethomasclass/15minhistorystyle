# Scoring research: American Imperialism, Ep 1 "The Pitch Meeting"

A brief on how professional documentary and comedy composers work, what 1867-1898 America and Hawaiʻi actually sounded like,
and how to get Suno to do what we ask. It feeds the next rewrite of `../SUNO_PROMPTS.md` (v2). It does not contain the final
prompts.

**What the research says about v2, in five lines**

1. **Variety without unity.** v2 has eight unrelated sound worlds. That fixes the channel's worn-out sounds, but nothing
   ties the episode together. Long-form documentaries do the opposite: one tune in many arrangements.
2. **The theme's lead sits on the voice.** A bright solo trumpet puts its energy in the 1 to 4 kHz band, where speech
   intelligibility lives. And its bass clarinet answer breaks the clarinet ban.
3. **The prompts are too long and do too much.** Suno weights the first descriptors most, and it stops following the prompt
   after 30 to 60 s. A four-section, three-minute prompt (`ai_pitch_meeting`) is asking for drift.
4. **The joke cues tip the joke.** "Persuasive with a hint of menace" comments on the pitch. Comedy composers say to play it
   straight and let the cut get the laugh.
5. **The mid-cue `[Stop]` tags aren't documented.** We can't count on Suno for frame-accurate silences. Make those in the edit.

---

## (a) Principles to adopt

**1. One tune, many coats.** Burns's editor Craig Mellish takes one tune and records "10, 15, 20 versions of it with
different instrumentations and different tempos and moods"; *The Civil War* uses "Ashokan Farewell" 25 times. Britell built
*Succession* on 18th-century theme and variations.
*So for us:* apply the variety rule to **timbre, not melody**. Most cues quote one series motif in their own instruments.

**2. Music as a director.** Burns records music before or early in the edit, so it "is one of the directors of the film",
and trims shots to fit its phrases.
*So for us:* make the theme first, and cut chapters 2 and 9 to its phrases.

**3. Frame the voice; melody in the gaps.** Consonants live around 2 to 4 kHz and are easily masked (DPA, Production
Expert). Sound On Sound favors arrangement over aggressive EQ. Mellish pushes songs "below the narration" and lets them up
between lines.
*So for us:* under words, use low (tuba, bass drum, organ pedal) and high (bells, glass) registers. The cornet motif speaks
in the `[beat]`s. Use Suno stems to duck only the lead.

**4. Silence is a cue.** Joel Goodman criticizes "55 minutes of music" in a 57-minute film. Jeff Beal rejects "the wallpaper
school of scoring". Jóhannsson called silence "a very important element".
*So for us:* the scene plan's silences are written into the music plan below. The Declaration line is always silent.

**5. Play the joke straight.** Theodore Shapiro is "the straight man", and Mickey-Mousing is "nothing less funny". Matt
Novack: absurd characters think it's real, "so you play it straight". Burwell decided the *Burn After Reading* composer
should be "equally deluded".
*So for us:* the pitch music **believes every pitch**. No menace, no turn to minor. The laugh is the cut into silence.

**6. Get irony from juxtaposition.** Adam Curtis gets meaning from the gap between sincere music and what it sits under.
Britell: "When things sound right for the Roy family, it's wrong." Fincher wanted Grieg treated "not comical".
*So for us:* a sincere period march under the Committee of Safety *is* the irony. Keep one "wrongness" device
(polytonality) for the series theme only.

**7. Entries and exits are punctuation.** Miriam Cutler: "whenever you get out, it's going to be noticed."
*So for us:* enter under a line, exit on a cut, and change cues on the camera transitions, never mid-sentence.

**8. Signatures read in one second.** Mike Post's *Law & Order* "Clang" is a stylized cell door locking, the same every time.
*So for us:* the George III callback's first chord must say "the charge is read". Use the same file in every episode.

**9. Build from the place's own sounds.** Guðnadóttir made *Chernobyl*'s score entirely from power-plant recordings.
*So for us:* use the ship's bell, Navy bugle calls, the sugar mill's steam and the palace band, not ticking clocks.

---

## (b) The musical architecture

### Three voices in one argument (the whole series)

One short motif (four to six notes, hymn-simple, opening on a bugle-like rising interval) appears in three voices:

| Voice | Stands for | Sound | Rule |
|---|---|---|---|
| **The Claim** | What America said | Proud and sincere: cornet band, major, march or hymn | Always played straight |
| **The Deed** | What America did | The same motif bent: tuba or euphonium, slower, slightly detuned, or played by a player piano | Never louder than the Claim; same tune, not a villain |
| **The Answer** | Who answered back | New each episode. Ep 1: a small reed organ hymn, from the Hawaiian hymn tradition (*hīmeni*) Liliʻuokalani wrote in | Its own tune, never the Claim's |

Charles Ives is the period's own model for this. His bandmaster father marched two bands past each other in different keys,
and *Putnam's Camp* stages it. The series theme is the Claim and the Deed in two keys that never resolve, which is v2's
option B, "Proud and Wrong", made Ivesian.

### Signatures

| Device | Signature |
|---|---|
| **Declaration line** (ch 2, ch 6 twice, ch 9) | **Silence.** The cue before it stops dead on the cut, so the missing music becomes the sign. In ch 9: 2 s of nothing. |
| **George III callback** (ch 7, every episode) | Keep v2's idea: dry harpsichord chords taken over by an American brass choir. The first chord alone must be recognizable, with a 3 to 5 s core and a 20 s full version. The same file every time. |
| **The Ledger** (ch 9, every episode) | Three equal phrases, one per column: Said = Claim (cornet), Did = Deed (tuba or player piano), Answered back = the Answer (Ep 1: reed organ). About 12 to 15 s. Only the third phrase changes between episodes. |
| **Quiet chapter** (ch 8) | The Answer at full length. No Claim or Deed under her words. |
| **Humor cuts** | A hard cut to silence or room tone. The music re-enters on the downbeat of a **new** phrase, not where it stopped. |
| **Palace band** (ch 1, ch 8) | A brass band heard through a wall, playing the Claim as a slow waltz. By 1895 it was the renamed "Government Band": in 1893 the Royal Hawaiian Band's musicians had refused the new regime's loyalty oath (the origin of *Kaulana Nā Pua*). It returns under the ch 8 flag change. |

### Cue map, Episode 1

| Ch | Music | Entries, exits, silence |
|---|---|---|
| 1 Locked Room | **Locked Room**: glass and bowed tones, palace band faint outside | Starts before the first word |
| 2 Question | The Claim rises on the "In 1776" pull-back | **Silence** on the parchment. Theme (Claim against Deed) after "say yes", under the two tablets. Buttons on "First, the old rule." |
| 3 Old Guard | **Old Rule**: the motif small and homespun, widening west | Silence on the nugget. A dead stop on "The continent was full." One held low note carries "So where next?" across the transition |
| 4 Pitch Meeting | Room tone, then **four pitch cues** in the Claim's family, all sincere | Silence on "one room", on the pitchers' appearance and on "It wasn't." |
| 5 Same Islands | **Four Bells**: bells placed by hand on the badges, then an organ swell | The organ carries the dive into Honolulu |
| 6 Heist | **The Mechanism**: player piano, steam pulse, the Marines' field drum approaching. The Deed in the low brass at the flag | Silence for both underlines and every humor cut. **No music** under "I yield to the superior force" |
| 7 He Has | **The Charge** | Rings into silence |
| 8 Under Protest | **The Answer** | Enters on "brought here, to this room". Stops at the `[pause]` before "July 7th". The flag change plays to the muffled palace band, then the narration runs dry |
| 9 The Question | Theme low | Silence at the circle, then the **Ledger**. Pearl Harbor quiet. On "the answer is both", the Claim and the Deed sound together at equal weight for the first time. Silence on "Except the asking." and the window; the reed organ gets the last chord. A new texture under the *Maine* tease |

**On ch 8's melody:** *Aloha ʻOe* is public domain, but American sheet music made it a tourist farewell (the "romantic
Eden" clichés Houghton Library describes), so it pulls toward the exotica we've banned. If we use one of her melodies, a
better choice is **Ke Aloha o ka Haku (The Queen's Prayer)**. She composed it on 22 March 1895, imprisoned in the room the
episode shows, as a hymn of forgiveness. Arrange it ourselves from the public-domain score (organ only, credited on
screen). Don't ask Suno to imitate it. Otherwise, keep an original hymn in her idiom.

---

## (c) Period palette, 1867-1898

**The real sounds.** The **cornet band**: Sousa's *Washington Post* (1889, 6/8) became the two-step craze's anthem.
**Phonograph cylinders** were mostly band marches and banjo solos (Vess Ossman, from 1896). The **reed organ** was the most
popular instrument of its day, in parlors and chapels alike. The **classic parlor banjo** had been rebranded as a
genteel, fingerstyle, gut-string instrument (S. S. Stewart). Hawaiʻi had **Henri Berger's** European-style military band
from 1872, the national hymn *Hawaiʻi Ponoʻī* (Kalākaua's words, Berger's music), and a **hīmeni** tradition with a first
hymnal in 1823. Liliʻuokalani played guitar, piano, organ, autoharp and zither, and wrote mainly in hymn and waltz forms.
The **Pianola** was built in 1895 and sold from 1898.

**Modern treatments that fit:** Ives-style collision; slowed, detuned brass for the Deed; "through the wall" filtering;
player-piano exactness; Basinski-style tape decay, sparingly, for endings. **Wax-cylinder texture is a trap under
narration:** it squeezes the music into the voice's own band. Keep it for the holes, or add it in post.

| Cue | Instruments (2 or 3 per take) | Note |
|---|---|---|
| Series theme | Solo cornet; tuba or euphonium; field drum; organ pedal | Cornet replaces trumpet. Euphonium replaces bass clarinet, which breaks the clarinet ban |
| Locked Room | Bowed vibraphone, glass harmonica, low bowed bass; muffled distant brass band waltz | Keep. A German military band in style |
| Old Rule | Fife and field drum giving way to a small village cornet band | The motif innocent, then a dead stop |
| Pitch: Businessman | 6/8 cornet-band two-step, classic parlor banjo (fingerpicked) | "Classic parlor" keeps it off minstrel and bluegrass |
| Pitch: Admiral | Navy bugle calls, field drum, low brass | Short calls fit between lines |
| Pitch: Preacher | Pipe organ and brass quartet, a gospel hymn tune | Big public Sunday, against the Queen's small weekday organ |
| Pitch: Scientist | Xylophone, snare rim, precise player piano | Clinical, self-assured |
| Four Bells | Ship's bell (placed by hand), bowed cymbal, pipe organ | Suno only for the organ |
| The Mechanism | Player piano, steam pulse, approaching field drum, tuba | Replaces two pianos and a plucked harp |
| The Charge | Harpsichord; cornets, alto horns, euphonium; timpani roll | Keep v2's idea |
| The Answer | One small reed organ with audible bellows; optionally a soft autoharp | No swell |

**Still banned:** felt piano, pizzicato, ticking clocks, solo cello over a pad, clarinet and bassoon (bass clarinet
included), ukulele, steel or slack-key guitar, hula drums. **Hold ragtime for Ep 2** (it arrives 1897-99); the cakewalk
needs care because of its ties to minstrelsy.

---

## (d) Suno prompting rules

1. **Front-load.** Start with genre and period, then the lead instrument, then tempo, meter and key; the first descriptors
   weigh most. Use 4 to 7 core descriptors and at most one sentence about change.
2. **Two or three instruments, each with a job** (bass, pulse, melody, color). Any more turns to mud.
3. **Lock BPM and key at the front, and reuse them** across cues that hand off (the four pitches, theme and Ledger). Fix
   small drift in post.
4. **Movement goes in the tags**, as short colon descriptors (`[Verse: tuba and bass drum only]`). Use no more than 2 or 3
   tags in a row, and `[Build]` once at most.
5. **One idea per generation.** Adherence decays after 30 to 60 s, so make suites (the four pitchers) as separate
   generations or Extends at the same BPM and key.
6. **Make stops in the edit.** `[Stop]` isn't documented, and `[Break]` is about one bar. Ask for "regular 8-bar phrases,
   clear cadences" to get cut points. `[End]` after a **short** last section works about 85-90% of the time. Suno clips
   reverb tails, so fade ourselves.
7. **Vocals:** use the Exclude field (more reliable than "no X"). Keep the style text technical, with no poetic lines or
   quotes, and always put tags in the lyrics box. "Hymn", "anthem" and "church" invite choirs: write "instrumental hymn
   tune on organ" and exclude choir. `music/README.md` says Instrumental **ON**; v2 says **OFF** with tags. Test both once.
8. **Keep Exclude short and specific to the cue.** A community guide warns that over-excluding confuses the model. Use a
   core (vocals, choir, humming, wordless vocals, drum kit, synth) plus the cue's 3 to 6 likeliest drifts, and A/B test it
   against the current 28 items.
9. **Never name the culture as a style.** "Hawaiian", "island" and "tropical" pull exotica. Name instruments and forms. Don't
   name artists either.
10. **Theme first, then Cover.** Expose the motif on one instrument, then make variations as Covers with new style text.
    Covers keep the melody; Personas don't. Test how much survives.
11. **Get Stems** (Pro) to pull the lead under dense lines.
12. **Audition takes under the real voice** at -13 LU after the first-40-seconds test. If you lose consonants, reject the take.

**Illustrative fragments** (not final prompts):

```
1890s American cornet band march, solo cornet and tuba, 6/8 two-step, 108 BPM, B-flat major, sincere and prosperous,
clean modern recording, regular 8-bar phrases, documentary underscore, instrumental
```

```
[Instrumental]
[Intro: solo cornet, the tune once]
[Verse: tuba and bass drum join, same tune]
[Outro: cornet alone, final cadence]
[End]
```

```
small reed pump organ, instrumental hymn tune, audible bellows, 56 BPM, free time, F major, intimate, no swell
```

---

## (e) Sources

**Documentary and comedy scoring craft**
- Craig Mellish on Florentine Films' music workflow: https://www.provideocoalition.com/art-cut-ken-burns-doc-editor-craig-mellish-ace/
- Ken Burns MasterClass, "The Power of Music": https://www.masterclass.com/classes/ken-burns-teaches-documentary-filmmaking/chapters/the-power-of-music-7d9d78c3-6050-4388-b73a-ddc4eee8a7a0
- *The Civil War* (Ashokan Farewell, 25 times): https://en.wikipedia.org/wiki/The_Civil_War_(miniseries)
- IDA, "Composers' Confab" (Goodman, Beal, Cutler, Davison, Adler): https://documentary.org/index%2ephp/feature/composers-confab-creating-best-score-your-film
- NPR on Nicholas Britell and *Succession*: https://www.npr.org/2023/05/25/1178008172/nicholas-britell-succession
- NME on the *Succession* theme: https://www.nme.com/tv-interviews/succession-theme-nicholas-britell-2689089
- NPR, "What Makes A Comedy Funnier? Music With A Straight Face" (Shapiro): https://www.npr.org/2016/07/16/486060013/what-makes-a-comedy-funnier-music-with-a-straight-face%EF%BB%BF
- Inverse interview with Theodore Shapiro: https://inverse.com/severance-composer-theodore-shapiro-interview-apple-tv
- Matt Novack on comedy scoring: https://wegotthiscovered.com/tv/exclusive-murderville-composer-on-the-secret-to-crafting-music-for-comedy/
- Focus Features on Carter Burwell: https://www.focusfeatures.com/article/carter_burwell
- Little White Lies, Colin Stetson on Jóhannsson's *Prisoners*: https://lwlies.com/articles/know-the-score-colin-stetson-on-johann-johannssons-prisoners/
- Electronic Sound on Jóhannsson and silence: https://www.electronicsound.co.uk/features/long-reads/johann-johannsson-ice-cold-thrillers/
- Emily Baker on Adam Curtis (UCL): https://discovery.ucl.ac.uk/id/eprint/10208427/3/Baker_vc-7-4.pdf
- *The Social Network* soundtrack (Grieg treatment): https://en.wikipedia.org/wiki/The_Social_Network_(soundtrack)
- Reznor on the Grieg cue: https://thewrap.com/trent-reznor-talks-social-network-22039
- Sound On Sound on Guðnadóttir's *Chernobyl*: https://www.soundonsound.com/people/hildur-gudnadottir-sam-slater
- Mike Post's "Clang" (CBC): https://www.cbc.ca/arts/q/the-story-behind-the-dun-dun-sound-on-law-order-1.7170453
- DPA, speech intelligibility: https://dpamicrophones.com/mic-university/facts-about-speech-intelligibility
- ProSoundWeb, balancing dialog: https://www.prosoundweb.com/in-the-studio-balancing-dialog-in-post-production/
- Sound On Sound, mixing for mobile: https://www.soundonsound.com/techniques/mixing-mobile

**Period and Hawaiʻi**
- Britannica on Charles Ives: https://www.britannica.com/biography/Charles-Edward-Ives
- US Marine Band on *The Washington Post* march: https://www.marineband.marines.mil/Audio-Resources/The-Complete-Marches-of-John-Philip-Sousa/The-Washington-Post-March/
- *The Washington Post* march and the two-step: https://en.wikipedia.org/wiki/The_Washington_Post_(march)
- UCSB Cylinder Archive, early recordings: https://cylinders.library.ucsb.edu/incunabula2.php
- Vess Ossman: https://en.wikipedia.org/wiki/Vess_Ossman
- The Met on the S. S. Stewart banjo: https://www.metmuseum.org/art/collection/search/923336
- Estey Organ Museum, reed organs: https://www.esteyorganmuseum.org/our-collections/reed-organ-collection/
- Pianola Institute on Edwin Votey: https://pianola.org/factsheets/votey.cfm
- Henri Berger: https://en.wikipedia.org/wiki/Henri_Berger
- Hawaiʻi State Archives, Berger manuscripts: https://ags.hawaii.gov/?p=35782
- Huapala on *Hawaiʻi Ponoʻī*: https://www.huapala.org/Hawaii/Hawaii_Ponoi.html
- *Kaulana Nā Pua* and the band's oath refusal: https://en.wikipedia.org/wiki/Kaulana_N%C4%81_Pua
- Kamehameha Schools on *Kaulana Nā Pua*: https://www.ksbe.edu/article/kuukahekahe-mele-ai-phaku
- Kamehameha Schools on the first Hawaiian hymnal (1823): https://kaiwakiloumoku.ksbe.edu/article/historical-snapshots-first-hawaiian-hymn-book-1823
- *Himene*: https://en.wikipedia.org/wiki/Himene
- Smithsonian on Liliʻuokalani's music: https://www.smithsonianmag.com/smithsonian-institution/how-music-hawaiis-last-ruler-guided-islands-people-through-crisis-180971783/
- List of Liliʻuokalani's compositions: https://en.wikipedia.org/wiki/List_of_compositions_by_Lili%CA%BBuokalani
- United Methodist Discipleship on *The Queen's Prayer*: https://www.umcdiscipleship.org/resources/o-kou-aloha-no-the-queens-prayer
- Houghton Library on *Aloha ʻOe* and American sheet music: https://sites.harvard.edu/houghton-library/2016/03/09/queen-lili%ca%bbuokalanis-composition-aloha-%ca%bboe-and-american-sheet-music-about-hawai%ca%bbi
- Sound On Sound on Basinski's *Disintegration Loops*: https://www.soundonsound.com/techniques/classic-tracks-william-basinski-disintegration-loops

**Suno** (mostly community sources; behavior varies by version)
- Suno Field Guide (community): https://github.com/mttkllr/suno-field-guide
- Blake Crosley's Suno guide (V5.5): https://blakecrosley.com/guides/suno-ai-music-generation
- Blake Crosley on the Style field and Style Influence: https://blakecrosley.com/blog/suno-style-field-style-influence
- Meta-tags reference: https://niller2005.github.io/suno/guide/meta-tags.html
- Suno Help, Exclude: https://help.suno.com/en/articles/3161921
- Suno Help, Covers: https://help.suno.com/en/articles/2872257
- Suno Help, stems: https://help.suno.com/en/articles/13925185
- Jack Righteous on instrumentation and arrangement (community): https://jackrighteous.com/blogs/guides-using-suno-ai-music-creation/instrumentation-and-arrangement-in-suno-v5
