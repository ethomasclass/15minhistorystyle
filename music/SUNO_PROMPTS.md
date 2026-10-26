# Suno prompts: library gaps

The 38 cues in `cues/` are almost all 1800s American in feel. These prompts fill the gaps that *When Europe Ate Mummies*
exposed: Old World, Middle Eastern, macabre-comic and 1920s. Each one is written to be reused in later videos. Save them with
the **`m_`** prefix, add them to `catalog.json` and to "Pick by feeling" in the README, and record the LUFS (Suno usually
masters to −15 to −17, so the bed runs at about 0.2).

## How to run them in Suno

- Use **Custom mode** and turn **Instrumental** on.
- **Style of Music:** paste the style line.
- **Exclude Styles:** paste the shared exclude line below.
- **Lyrics:** paste the structure block for the cue type (bed or Short). Suno reads the tags as section cues.
- **Title:** use the cue name (e.g. `m_apothecary`).
- Generate twice, keep the best take and trim it later if needed. Listen for a steady middle section without a big melody.
  Those are the parts that sit under narration.
- Don't name real composers or artists. Suno rejects them, and the instrument lists below do the same job.

**Shared exclude line** (all cues):
```
vocals, singing, choir words, rap, EDM, trap, dubstep, drum machine, synth bass, autotune, modern pop, distorted guitar
```

**Structure block: beds** (long-episode chapters, 2–3 min):
```
[Intro: sparse, 8 bars]
[Instrumental]
[Verse: steady, low melody, leave space]
[Instrumental]
[Break: drop to one instrument]
[Verse: steady, low melody, leave space]
[Outro: thin out]
[End]
```

**Structure block: Shorts** (about 60 s with a hard ending):
```
[Intro: one instrument, 2 bars]
[Build: add layers every 4 bars]
[Instrumental]
[Build: tension rising]
[Hit: full band, short]
[End: hard stop on one chord]
[End]
```

---

## The cues

### 1. `m_apothecary`: dark whimsy
**Feeling:** sneaky, mischievous, slightly ghoulish, a raised eyebrow. **Mummies:** ch 4–5 (the trade, the fakes, "made in Lyon").
**Reuse:** scams and frauds, weird medicine, quack cures, Halloween topics, any "you won't believe people did this" chapter.
```
Dark whimsical chamber music, pizzicato strings, bassoon, harpsichord, celesta, light tick-tock percussion, sneaky mischievous mood, playful but macabre, mid-tempo, sparse, room for narration, instrumental
```

### 2. `m_old_world`: Renaissance curiosity
**Feeling:** curious, learned, candlelit, turning pages. **Mummies:** ch 2–3 (the word, the translation mistake), ch 7.
**Reuse:** anything set in Europe from 1100 to 1650: scholars, monks, Tudors, exploration, early science, printing.
```
Renaissance early music, lute, viola da gamba, recorder, soft frame drum, curious and contemplative, candlelit study, gentle mid-tempo, modal melody, warm and intimate, sparse, instrumental
```

### 3. `m_alexandria`: port city at night
**Feeling:** mystery and trade, a crowded harbor after dark, deals in the back room. **Mummies:** ch 4–5 (Cairo, Alexandria, the dealer).
**Reuse:** Egypt, the Ottoman Empire, the Silk Road, Crusades, spice trade, 19th-century Egyptomania.
```
Middle Eastern cinematic underscore, oud, ney flute, qanun, riq and darbuka, low string drone, maqam hijaz, mysterious night market, slow steady groove, restrained, documentary, instrumental
```

### 4. `m_tomb`: descent
**Feeling:** quiet tension, lantern light, something is down there. **Mummies:** ch 4 (the tomb raid), ch 5 (the storeroom).
**Reuse:** discoveries and excavations, unsolved mysteries, crime chapters, any "they went in at night" moment.
```
Dark ambient cinematic tension, low cello drone, deep frame drum heartbeat, distant metallic scrapes, breathy low flute, slow build, suspenseful and patient, no melody hook, minimal, instrumental
```

### 5. `m_lament_baroque`: early-modern grave
**Feeling:** solemn and respectful, with no drama. This is the heavy-chapter cue for anything before 1800 (the library's grave cues all sound American 1800s).
**Mummies:** ch 6 (corpse medicine, executions). Run it at about 0.12 or use near-silence.
**Reuse:** plague, executions, wars of religion, witch trials, famine.
```
Baroque lament, solo viola da gamba and cello, soft chamber organ, slow descending bass line, grave and respectful, very sparse, long held notes, no percussion, quiet, instrumental
```

### 6. `m_1924`: jazz-age catalog
**Feeling:** wry and brisk, like a scratchy record from 1924 with a wink. **Mummies:** ch 1 cold open (the Merck catalog), ch 9 return to 1924.
**Reuse:** the 1920s generally: Prohibition, Tutankhamun, flappers, the Scopes trial, the boom before the crash.
```
1920s foxtrot dance band, muted trumpet, clarinet, tuba bass, banjo, stride piano, brushed snare, vintage shellac record warmth, wry and jaunty, light, mid-tempo, instrumental
```

### 7. `m_parlor`: Victorian curiosity
**Feeling:** gaslit parlor and polite fascination, with something odd under the dust cover. **Mummies:** ch 8 (America's mummies, Twain, mummy paper, mummy brown).
**Reuse:** Victorian oddities, spiritualism, World's Fairs, sideshows, dime museums, inventors.
```
Victorian parlor music, upright piano, music box, clarinet, pizzicato violin, waltz time, quaint and curious with a slightly eerie undertone, gaslight atmosphere, gentle, sparse, instrumental
```

### 8. `m_reveal`: Shorts engine
**Feeling:** a 60-second build that keeps people watching and lands on a hard button. Time the button to the payoff line, the way `a_price` was.
**Reuse:** any standalone Short. Generate a few takes in different keys and tempos so Shorts don't all sound the same.
Use the **Shorts** structure block.
```
Cinematic documentary build, ticking clock percussion, pizzicato strings, low piano ostinato, rising tension, layers added every few bars, punchy, ends with one hard orchestral hit and silence, 60 seconds, instrumental
```

---

## Mummy episode cue map (draft)

| Ch | Cue | Bed |
|---|---|---|
| 1 Cold open (1924) | `m_1924` | 0.17, dipping at the end |
| 2 The word | `m_old_world` | 0.2 |
| 3 The mistake | `m_old_world` (second half) | 0.2 |
| 4 The trade | `m_alexandria` → `m_tomb` for the raid | 0.2 |
| 5 The fakes | `m_apothecary` | 0.2 |
| 6 Beyond mummies | `m_lament_baroque` or near-silence | 0.12 |
| 7 The decline | `m_old_world` reprise | 0.18 |
| 8 America's mummies | `m_parlor` | 0.2 |
| 9 Answer | `m_1924` (ending), or the library's `r_ending` | 0.17 |
