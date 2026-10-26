# Music: The American West after the Civil War (series)

**Generators:** ElevenLabs Music stays the channel's in-project tool (`tools/music_eleven.py`; licensed, on the account we already
pay for). **Suno** for the cues below, made by you in the Suno app. Every prompt here also works pasted into `music_eleven.py` if
you'd rather make one on ElevenLabs.

**Prefix for this series:** `aw_`. When a cue comes back, it goes in the style repo's `music/cues/` with a row in
`music/README.md` and `music/catalog.json`, like every other cue.

**Reuse first.** The library already covers a lot of this series (map below). The 12 new cues fill real gaps, and each one is written
to be reused well past the West. The *Reuse* line under each says where.

Levels match Black Sox: narration at -18 LUFS, each bed set ~13 LU under it from the cue's measured loudness (`ep1/src/kit/levels.ts`,
`bed()`; 14–15 for a grave stretch), cold open as in Black Sox, tail lift ×1.6 after the last word. Measure each new cue and add it to `CUE_LUFS`.

---

## Suno settings (every cue)

- **Custom** mode, **Instrumental ON**, paste the Styles text as written (it's under Suno's style-box limit).
- **Exclude** (the library default, plus two for this series):
  > vocals, choir, lyrics, humming, drum kit, EDM, trap, pop, rock, synth lead, dubstep, rap, gospel vocals, banjo, comedic, upbeat, western movie theme, whistling
- Make **2–4 takes** and pick the one whose **first 30–40 seconds** already sound right (scenes rarely use more than ~70 s of a cue).
- Every Styles line ends with the channel's tag: *documentary, restrained, space for narrator, instrumental*.
- Send them back named as below (MP3 is fine).

**A rule for Ep 4 (Plains Nations):** no AI imitation of Native music. Leave out "Native American flute," "tribal drums,"
"chanting" and "powwow"; they come out as Hollywood stereotype, not anyone's real music. The grave cues below use the same orchestral
and piano vocabulary as the rest of the channel, so the dignity comes from restraint, not costume. (The library's `w_frontier` has a
low wooden flute; I'd not lead Ep 4 with it.)

---

## The 12 new cues

### Motion and progress

**1. `aw_iron_horse.mp3`: the machine age**
*Here:* Ep 1 ch 3 (the race), ch 5 (ten miles in a day). *Reuse:* any building or industry montage: the Erie Canal, steel, the
Brooklyn Bridge, the Panama Canal, the assembly line.
> 1860s railroad construction, driving rhythmic pulse like hammers on spikes and iron wheels on rails, col legno strings and low string ostinato, anvil-like metallic percussion, a steady locomotive chug that slowly gathers speed, low brass entering in the second half, determined and relentless, impressive but not triumphant, ends on a held low chord; documentary, restrained, space for narrator, instrumental

**2. `aw_long_drive.mp3`: the trail**
*Here:* Ep 2 ch 3 (the Long Drive), ch 5 (who the cowboys were). *Reuse:* any overland journey: the Oregon Trail, the Pony Express,
the Mormon trek, a migration on foot.
> 1870s cattle drive across open Texas grassland, loping two-beat horse gait rhythm on hand drum and upright bass, nylon-string guitar and solo fiddle trading a plain trail melody, harmonica answering in the distance, guitarrón bass in the second half, dusty and steady, a little lonely, warm but not cheerful, never a cowboy movie theme; documentary, restrained, space for narrator, instrumental

**3. `aw_boomtown.mp3`: the rush**
*Here:* Ep 2 ch 6–7 (Black Hills gold, Deadwood). *Reuse:* any boom: the Gold Rush, oil strikes, land runs, speculation manias, the
1920s stock bubble (with the ending).
> 1870s mining boomtown rush, restless excited energy, upright piano with a slightly out-of-tune saloon edge playing a busy figure, pizzicato strings scurrying, clattering wooden percussion, fiddle runs, a feverish build like a crowd arriving, then in the last third the energy turns hollow and uneasy with low strings and a single sour chord; documentary, restrained, space for narrator, instrumental

### Money, power and scandal

**4. `aw_robber_barons.mp3`: the swagger**
*Here:* Ep 1 ch 7 (Crédit Mobilier, the Whiskey Ring). *Reuse:* the Gilded Age, Tammany Hall, trusts and monopolies, Teapot Dome, any
"the men in charge got rich" chapter. Heavier and more confident than the library's `a_price` caper.
> Gilded Age swagger, smug and well-fed, slow strutting tempo, tuba and low brass oom-pah under a sly muted trumpet melody, parlor piano chords, pizzicato strings, a cigar-smoke lazy confidence with a hint of menace underneath, two short cheeky brass stings, ends on a knowing unresolved chord; documentary, restrained, space for narrator, instrumental

**5. `aw_panic.mp3`: the crash**
*Here:* Ep 1 ch 8 (the Panic of 1873). *Reuse:* the Panics of 1837 and 1893, the 1929 crash, bank runs, any sudden collapse.
> 1870s financial panic, a crowd rushing a bank, anxious ticking stock-ticker pulse, rapid nervous string tremolo, piano repeating a falling figure, rising tension for forty seconds, then a sudden drop to a hollow low drone and a slow descending cello line, the aftermath bleak and quiet, ends unresolved; documentary, restrained, space for narrator, instrumental

### The land and the people on it

**6. `aw_prairie_hymn.mp3`: the homestead**
*Here:* Ep 3 ch 2 (160 acres), ch 4 (sod houses). *Reuse:* settlers and immigrants, farm life, faith communities, the Dust Bowl (it
darkens at the end), any "new life on hard ground" chapter.
> 1870s Great Plains homestead, a plain hymn-like melody on pump organ and solo violin over wide open sustained strings, a feeling of endless flat land and big sky, hopeful but austere and hard-working, simple and dignified, a slow gentle pulse, in the last third the wind seems to rise with a low drone and the hope thins out; documentary, restrained, space for narrator, instrumental

**7. `aw_exodus.mp3`: the leaving**
*Here:* Ep 3 ch 7 (the Exodusters, Nicodemus). *Reuse:* the Great Migration, Reconstruction, any chapter about people leaving to find
freedom. A companion to the library's `g_world_outside`, with more forward motion.
> 1879 a journey toward freedom, slow resolute walking pulse, warm upright piano and solo cello carrying a melody in the spirit of a spiritual, soft strings and a low pump organ joining, building steady conviction and hope without triumph, a moment of doubt in the middle with sparse low strings, then the walk resumes, ends warm but unresolved; documentary, restrained, space for narrator, instrumental

**8. `aw_white_cold.mp3`: winter as the enemy**
*Here:* Ep 2 ch 9 (the Big Die-Up), Ep 3 ch 8 (the Children's Blizzard, heavy). *Reuse:* the Donner Party, Valley Forge, any
disaster where weather is the villain.
> brutal Great Plains winter blizzard, cold glassy high string harmonics, a low sustained drone like wind across empty land, sparse frozen piano notes, slow and still, no melody to speak of, a slow swell of icy dissonance in the middle then emptiness again, bleak and quiet, no percussion, ends on near silence; documentary, restrained, space for narrator, instrumental

### Promises, treaties and grief

**9. `aw_treaty.mp3`: the council**
*Here:* Ep 4 ch 1–2 (Fort Laramie, Horse Creek), ch 5 (Red Cloud's War won at the table). *Reuse:* any treaty, negotiation or
solemn agreement, and any promise the story will later break.
> a solemn treaty council, grave and dignified, slow sustained low strings, a simple measured theme on solo viola and piano, long pauses, a quiet sense of weight and ceremony and of two sides measuring each other, restrained tension underneath, no drums, ends on an open unresolved chord; documentary, restrained, space for narrator, instrumental

**10. `aw_long_grief.mp3`: the long quiet**
*Here:* Ep 4 ch 4 (Sand Creek), ch 10 (Wounded Knee), Ep 1 ch 4 (the strike). *Reuse:* the heaviest chapter of any video. It's long,
so the bed never runs out mid-chapter (the library's `j_grief` is only 40 s).
> a long, very quiet grieving bed for the heaviest moments, three minutes, a soft sustained string pad barely moving, a few slow solo cello phrases with long silences between, one low piano note now and then, no swell, no build, no melodrama, the same calm level from start to finish, ends in silence; documentary, restrained, space for narrator, instrumental

### Myth and the series

**11. `aw_legend_sours.mp3`: the myth beat**
*Here:* Ep 1 ch 5 (the golden spike), Ep 2 ch 5 (the movie cowboy), Ep 4 ch 6 (*Custer's Last Fight* vs. the Red Horse drawings).
*Reuse:* any "you may have heard…" myth beat in any video: a heroic legend that deflates when the facts arrive.
> a grand heroic frontier fanfare in the style of an old Hollywood epic, bold horns and soaring strings for about twenty seconds, then it falters, the horns go out of tune, the strings slide down, the tempo drags, and it deflates into a sparse doubtful pizzicato and a single low questioning note; documentary, restrained, space for narrator, instrumental

**12. `aw_promise_theme.mp3`: the series theme (and the ledger)**
*Here:* every episode's last chapter, under the Promise Ledger and the closing line; the Ep 4 series ending. *Reuse:* any future
multi-part series; the closing reflection of any video. Pair it with the library's `r_ending`.
> a reflective main theme for a documentary series about promises, a simple memorable four-note motif first on solo piano, then taken up by warm strings and a single French horn, earnest and thoughtful with a thread of doubt, builds gently to one restrained peak at about forty-five seconds, then returns to the solo piano motif, ends on an unresolved chord that leaves a question hanging; documentary, restrained, space for narrator, instrumental

**Optional, if Suno handles short cues:** `aw_hinge_sting.mp3`, a 3–5 s stinger for the hinge-year stamps.
> a single short dramatic stinger for a date appearing on screen, one deep low drum hit with a low string and piano stab, a short ringing tail, three seconds long; documentary, restrained, instrumental

---

## Episode maps (library cues + new cues)

Fallbacks are library cues, so any episode can be finished before the new cues come back.

### Ep 1 · Not in the Picture

| Ch | Cue | Fallback | Bed |
|---|---|---|---|
| 1 Cold open | `r_cold_open` (the channel's "investigators" cue) | — | 0.17 |
| 2 1862 | `g_founding` → `g_grip` at "Here's the deal" | — | 0.15 |
| 3 The Race | **`aw_iron_horse`** | `g_cotton_engine` | 0.15 |
| 4 The Mountain (strike quiet) | `w_aftermath` → **`aw_long_grief`** at "In June 1867" | `j_grief` | 0.14 → 0.12 |
| 5 Done | **`aw_legend_sours`** on the golden-spike myth, then **`aw_iron_horse`** reprise | `a_price` | 0.15 |
| 6 Let Us Have Peace | `r_curtain` | `g_world_outside` | 0.15 |
| 7 Most Good (+ plug) | **`aw_robber_barons`** | `a_price` | 0.15 |
| 8 Panic | **`aw_panic`** | `w_fire` | 0.15 |
| 9 The Picture | `r_nativism` (uneasy part) → **`aw_promise_theme`** at "So let's go back to the question" | `r_ending` | 0.15 → 0.16 |

### Ep 2 · Cheap as Dirt

| Ch | Cue | Fallback | Bed |
|---|---|---|---|
| 1 Cold open (Russell's steer) | **`aw_white_cold`** (opening) | `r_cold_open` | 0.17 |
| 2 Four-Dollar Cows | `m_frontier` → **`aw_iron_horse`** at "That's where the railroad comes in" (callback) | — | 0.15 |
| 3 The Long Drive | **`aw_long_drive`** | `m_frontier` | 0.15 |
| 4 Beef for Bosque Redondo | `m_lament` | `r_dix` | 0.13 |
| 5 Who the Cowboys Were | **`aw_legend_sours`** (myth) → **`aw_long_drive`** reprise | `a_mexico` | 0.15 |
| 6 1874 | `j_intrigue` → **`aw_boomtown`** at "Newspapers did the rest" | `r_temperance` | 0.15 |
| 7 Who Got the Gold (+ plug) | **`aw_boomtown`** (hollow turn on "Just underground.") | `g_cotton_engine` | 0.15 |
| 8 Cheap as Dirt | `g_grip` | `r_nativism` | 0.15 |
| 9 Big Die-Up | **`aw_white_cold`** | `j_grief` | 0.12 |
| 10 Answer | **`aw_promise_theme`** | `r_ending` | 0.16 |

### Ep 3 · Free Land

| Ch | Cue | Fallback | Bed |
|---|---|---|---|
| 1 Cold open (handbill) | `r_cold_open` | — | 0.17 |
| 2 160 Acres | **`aw_prairie_hymn`** | `r_utopia` (hymn part) | 0.15 |
| 3 Go West | `a_newsroom` (promoters, fraud) | `j_gossip` | 0.15 |
| 4 Nebraska Marble | **`aw_prairie_hymn`** reprise | `m_frontier` | 0.15 |
| 5 The Machine Card | **`aw_iron_horse`** (callback) | `g_cotton_engine` | 0.15 |
| 6 The Edge of the Rain | **`aw_legend_sours`** ("rain follows the plow") → `r_dix` for Powell | `m_lament` | 0.15 |
| 7 Exodus (+ plug) | **`aw_exodus`** | `g_world_outside` | 0.15 |
| 8 Children's Blizzard (heavy) | **`aw_white_cold`** | `j_grief` | 0.12 |
| 9 No Frontier Line | **`aw_promise_theme`** | `r_ending` | 0.16 |

### Ep 4 · Absolute and Undisturbed

| Ch | Cue | Fallback | Bed |
|---|---|---|---|
| 1 Cold open (the treaty) | **`aw_treaty`** | `g_founding` | 0.17 |
| 2 Horse Creek | **`aw_treaty`** | `r_abolition_a` | 0.15 |
| 3 The Other War | `w_aftermath` → `m_lament` at the Long Walk | `r_dix` | 0.14 |
| 4 Sand Creek (heavy) | **`aw_long_grief`** | `j_grief` or near-silence | 0.12 |
| 5 The War Red Cloud Won | `r_abolition_b` → **`aw_treaty`** reprise at the 1868 treaty | `r_curtain` | 0.15 |
| 6 Two Pictures | **`aw_legend_sours`** under the beer-company lithograph, silence under Red Horse | `g_grip` | 0.15 |
| 7 South and North (+ plug) | `m_war_drums` (Red River) → `m_lament` (Nez Perce) | `a_civil_war` (somber half) | 0.15 |
| 8 The Bison | **`aw_iron_horse`** (callback, slowed by the edit) → silence on the skull pile | `g_cotton_engine` | 0.14 |
| 9 Kill the Indian | `g_pyramid` (polished, cold) | `g_grip` | 0.14 |
| 10 Wounded Knee (heaviest) | **`aw_long_grief`**, or near-silence | — | 0.10–0.12 |
| 11 For Whom? | **`aw_promise_theme`**, full statement, last chord under the Harkness question | `r_ending` | 0.16 |

---

## Priority if you only make a few

1. `aw_promise_theme` (every episode ends on it)
2. `aw_iron_horse` (used in three episodes)
3. `aw_long_grief` (every heavy chapter in the series, and future videos)
4. `aw_legend_sours` (a myth beat in every episode, and in most future videos)
5. `aw_prairie_hymn`, `aw_white_cold`, `aw_treaty`
6. The rest

## Credit line (description)

None. Descriptions don't mention AI music, AI images or the AI voice (your rule).
