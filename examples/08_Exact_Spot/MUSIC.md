# Music: The Exact Spot

Reuse first: 11 cues from the library (`music/cues/` in the style repo) cover most of the video. **Three new Suno cues** fill
the real gaps, and each is written to be reused: a frontier theme, a war-outbreak cue, and a borderlands lament. They take the
prefix **`m_`** (this video) when they go into the library.

Levels follow the library: beds 0.13–0.17, cold open 0.17, the heavy chapter ~0.12. New in this video: every chapter's music
**lifts to ×1.6 for the ~2 s after the last word**, then fades with the picture (`TAIL_LIFT` in `src/kit/shell.tsx`). Pick cues
whose tail still sounds good louder.

## Chapter by chapter

| Ch | Chapter | Cue (from) | Why it fits | Bed |
|---|---|---|---|---|
| 1 | The Exact Spot | `r_cold_open` (library) | The channel's "investigators" cue: Lincoln's question is a mystery to solve. | 0.17 |
| 2 | Come On In | **`m_frontier`** (new) · fallback `j_good_feelings` | Wide-open Texas, settlers arriving; "a little too well" lands on its turn toward unease. | 0.15 |
| 3 | Come and Take It | `g_grip` (library) → `r_abolition_b` at "October 1835" | Grievances tighten like a ratchet; Gonzales kicks off the defiant build. | 0.15 |
| 4 | Remember the Alamo | `w_aftermath` (library) to Goliad, then `a_mexico` from "April 21st" | Heartbeat drum + mournful fiddle for the Alamo; the guitar-and-trumpet drive for San Jacinto and the Republic. | 0.14 / 0.15 |
| 5 | Polk Acts First | `j_intrigue` (library) → **`m_war_drums`** (new) from "So in January 1846" | Polk's cabinet is a backroom deal; the march to the Rio Grande needs drums. | 0.15 |
| 6 | Plot Twists | `a_price` (caper) for the deal + leg → `m_war_drums` at "Meanwhile" → silence/`j_grief` low at "That same morning" | Comic double-cross, then the push on Mexico City, then the San Patricios with near-silence. | 0.15 → 0.12 |
| 7 | The Spot | `r_cold_open` reprise (from 0:30 in) | Calls back the cold open as Lincoln's question returns; the subscribe line sits on its lighter close. | 0.15 |
| 8 | The Man Who Was Fired | `a_price` (from 0:40 in) or `j_gossip` | Trist's 65-page "no" is a caper; the gold line gets a button. | 0.15 |
| 9 | Who Paid (heavy) | **`m_lament`** (new) · fallback `r_dix` | Grave, humane, borderlands colour for Seguín and the Californios. | 0.12 |
| 10 | Poison | `g_grip` → `r_ending` from "So, back to Lincoln's question" | Wilmot tightens the screw; the channel's closer turns dark and unresolved under "It took about 13 years to work." | 0.15 → 0.16 |
| End screen | | `m_frontier` reprise or `r_ending` tail | Music-only under the end screen and the thank-you line. | 0.18 |

I'll mix two options for chapters 2 and 9 (new cue vs. fallback) so you can choose by ear.

## The three new Suno cues

**Delivered** (Oct 15): `m_frontier` (1:09, -15.2 LUFS) → ch 2 at 0.12 · `m_war_drums` (1:09, builds to its peak ~50 s, -17.9 LUFS) → ch 5 from "So in January 1846" (peak lands on "Congress declares war") and ch 6 from "Meanwhile" (from 0:20) at 0.17 · `m_lament` (1:08, -16.3 LUFS) → ch 9 at 0.13. The end screen keeps `r_ending`'s tail.

Suno: **Custom** mode, **Instrumental ON**, paste Styles as written, and use the library's default Exclude line:
> vocals, choir, lyrics, humming, drum kit, EDM, trap, pop, rock, synth lead, dubstep, rap, gospel vocals, banjo, comedic, upbeat

Pick the take whose **first 30–40 seconds** already sound right. Send them back named as below (MP3 is fine).

### 1. `m_frontier.mp3`: the frontier theme
*Here:* ch 2 (settlers arrive in Texas), the end screen. *Reuse:* westward expansion, the Oregon Trail, the Gold Rush, any
"new land" chapter in the 1800s.
> 1820s–1840s American and Mexican frontier, wide open plains at dawn, nylon-string guitar and solo fiddle trading a simple folk melody, soft guitarrón bass, light hand drum and shaker, open fifths, gentle walking pulse; hopeful and curious at first, then a slow undercurrent of unease creeps in with low strings in the second half; documentary, restrained, space for narrator, instrumental

### 2. `m_war_drums.mp3`: the war-outbreak cue
*Here:* ch 5 (Taylor marches to the Rio Grande, war declared), ch 6 (the push on Mexico City). *Reuse:* the start of any war:
the Civil War, the Spanish-American War, a battle montage.
> 1840s army on the march, steady field snare and bass drum cadence, low string ostinato, distant bugle-like brass call, building momentum and tension over two minutes, ominous and serious, never triumphant or heroic, no fanfare payoff, ends on a held low note; documentary, restrained, space for narrator, instrumental

### 3. `m_lament.mp3`: the borderlands lament
*Here:* ch 9 (Who Paid: the land changing hands, Seguín). *Reuse:* any heavy chapter about loss of land or home, Mexican American
and Southwestern history, removal and displacement.
> grave borderlands lament, slow solo nylon-string guitar arpeggios and a low cello melody, sparse, one distant muted trumpet phrase near the middle, long silences between phrases, humane and dignified, no melodrama, no swell, ends quiet and unresolved; documentary, restrained, space for narrator, instrumental

## Gaps if the new cues don't come back

Every row has a library fallback, so the video can be finished without them: `j_good_feelings` (ch 2), `a_civil_war`'s opening
march (ch 5–6), `r_dix` (ch 9).

## Credit line (description)

None. Descriptions don't mention AI images, AI music or the AI voice (the user's rule).
