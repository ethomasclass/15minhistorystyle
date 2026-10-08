# Music: Good Luck (Ouija)

**No new music for this video.** Every cue below already exists in our other videos and is copied into `video/public/music/` with a prefix for where it came from:
- **r_** Fix Everything (Reform Era)
- **a_** The Man Who Couldn't Sit Still (Ambrose)
- **j_** King Andrew (Jackson, `claude/jackson-explainer-videos-oseyfs`)
- **w_** The War Nobody Won (Jackson, `claude/youthful-allen-f14v7e`)

I searched all six repos (Ouija, Reform-Era, Slaveryvideo, Ambrose, Jackson, Jackson-Videos), including every branch of the Jackson repo. After duplicates, there are 38 distinct tracks. `r_spirits_dark` is the mastered version of the Suno track "Knock Once for Yes," so it's counted once.

## The idea: four feelings, four cues

The Suno plan was one melody arranged four ways: love, grief, fun, fear. We can't make that now, so each feeling gets one recurring existing cue, used the same way:

| Feeling | Cue | Where it plays |
|---|---|---|
| **Love** | `j_good_feelings` (light, warm parlor fiddle and piano-forte, "pleasant and a little too cozy, with a faint hint of mischief") | ch01 (the Rockwell half), ch04, ch09 montage, end screen |
| **Grief** | `j_grief` (solo cello over a soft string pad) | ch06, ch09 montage |
| **Fun** | `r_schools` (bright pizzicato, glockenspiel, clarinet, comic final button) | ch07, ch09 montage |
| **Fear** | `r_spirits_dark` (dark, low and eerie; the Suno "Knock Once for Yes" cue) | ch01 (the 1973 half), ch08, ch09 montage |

The cold open plays **love, then a hard cut to fear** on the same frame as the picture cut. Chapter 9 brings back all four in order, a few seconds each, over the hands montage. The end screen returns to `j_good_feelings`, closing the circle.

## Chapter plan

| Ch | Chapter (start) | Cue | Why it fits |
|---|---|---|---|
| 1 | Two Pictures (0:00) | `j_good_feelings` → hard cut → `r_spirits_dark` | Sweet date night, then the basement. The cut on "Now jump ahead fifty-three years" is the whole video in one beat. |
| — | Title card | `r_title_sting` | The channel sting. |
| 2 | Knock Once for Yes (1:17) | `r_intrigue` (your pick) | Sly suspense: clarinet and bassoon, sneaky pizzicato, a ticking harpsichord, a brass sting midway. Mysterious with a wink for "we could sell this." |
| 3 | Good Luck (2:01) | `a_price` | "Caper underscore, Gilded Age confidence, sneaky build of tension, then a cheeky brass button at the end." That's 1890 businessmen and the patent-office legend. The button lands on "I'm a Presbyterian." It also runs under the subscribe plug. |
| 4 | Knees Touching (3:20) | `j_good_feelings` | Love theme, second appearance: lilting parlor fiddle for the courting couples. |
| 5 | Patience Worth (4:22) | `j_cold_open` (King Andrew; your pick) | Restrained suspense: low cello, a soft ticking pulse, a lonely fiddle, building to a held, unresolved chord. |
| 6 | Empty Chairs (4:40) | `w_aftermath` → `j_grief` at "So picture one house" | `w_aftermath`: low strings, a distant muffled field drum like a heartbeat, a mournful fiddle. That suits WWI and the flu. Then the grief theme for the mother upstairs. Heavy chapter: beds at 0.12. |
| 7 | Next to Monopoly (5:36) | `r_schools` | Fun theme: bright, toy-like glockenspiel. The comic button lands on "It's the point." It cuts out for "Which made it the perfect setup…" (the line plays dry). |
| 8 | Captain Howdy (6:06) | `r_spirits_dark` → `j_gossip` at "But here's the twist" | Fear theme for 1949 and *The Exorcist*. Then the twist turns wry: `j_gossip`'s sly pizzicato and "gasp" string swells for Hasbro making a horror movie about its own toy. |
| 9 | Who Moves It? (7:11) | `r_cold_open` → four-feeling montage → `r_ending` (first ~30 s) → `j_good_feelings` for the end screen | `r_cold_open` is the "investigators" cue: ticking clock, felt piano. It runs under Faraday and the blindfold study. The montage plays love, grief, fun and fear for "Love. Grief. Fun. Fear." Only the warm first half of `r_ending` runs under the last lines. |

**Alternates in the folder:** `r_dix` (grave piano and cello; backup for ch06), `r_intrigue` (sly backroom suspense; backup for ch03 or ch08's twist), `r_utopia` (backup for ch05), `w_dawn` (dark, then a warm sunrise swell; backup for the ending).

**Not used (and why):** the war and battle cues (`w_sea_battle`, `w_frontier`, `w_fire`, `a_civil_war`) are too martial. `j_campaign` is too rowdy. The Grip Tighter cues (`southampton`, `pyramid`, `grip`, `world_outside`, `cotton_engine`, `founding`) were written for slavery and Nat Turner; they're kept for that story. `a_mexico` and `a_newsroom` are tied to Bierce.

## Levels

- **Beds:** 0.13–0.17 under narration, with 15–20-frame fades, as in the other videos.
- **Loudness differences:** the King Andrew cues (`j_good_feelings`, `j_gossip`) are about 6 dB quieter than the Reform cues, so their beds go about 2× higher (0.26–0.3). `r_spirits_dark`, `w_aftermath` and `r_schools` are the loudest; keep them at 0.12–0.14.
- **Mastering:** `tools/master.py` normalizes the whole mix to −14 LUFS at the end, so these only need to balance against each other.

**Credit line for the description:** "Music: original cues generated with Suno, ElevenLabs and Google Lyria for 15 Minute History."
