# Music library

Every music cue made for 15 Minute History so far: **38 cues, about 66 MB**, one copy of each. They were collected from all of
the video repos and branches and deduplicated by file contents. Files are in [`cues/`](cues/), named `<prefix>_<name>.mp3`, and the
prefix says which video the cue was made for:

| Prefix | Made for | Generator |
|---|---|---|
| `r_` | *Fix Everything: America's Reform Era* | Google Lyria (`music_lyria.py`), plus one Suno cue (`r_spirits_dark`) |
| `j_` | *The Age of Jackson* / *King Andrew* | ElevenLabs Music (`music_eleven.py`) |
| `w_` | *The War Nobody Won* (War of 1812) | Google Lyria |
| `a_` | *The Man Who Couldn't Sit Still* (Ambrose Bierce) | Suno |
| `g_` | *Grip Tighter: Slavery and the Cotton South* | Suno |

*Good Luck* (Ouija) made no new music; it reused 19 of these. Keep the prefixes when you copy a cue into a video
(`video/public/music/r_dix.mp3`) so anyone can trace it back here.

**Reuse first.** Before generating anything, find a cue below for each chapter and write the video's `script/MUSIC.md`
(chapter, cue, why it fits, gaps). Generate only for real gaps, then add the new cue here with a new prefix (see the end of this page).

[`catalog.json`](catalog.json) has the same information in a form a script can read.

## Levels

- **Beds under narration: 0.13–0.17**, with 15–20-frame fades (`ChapterShell` does the fades). The default bed is 0.15.
- **Cold open: 0.17**, dipping at the end. **Title sting: 0.45**, starting 4 frames before the "15" (already wired into `Intro.tsx`).
- **Heavy chapters** get a grave cue at about 0.12, or near-silence. Near-silence is a choice, not a gap.
- **The generators master to different levels.** Lyria cues measure −10.7 to −13.1 LUFS. ElevenLabs cues measure −12.8 to −19.6, and Suno
  cues −14.7 to −17.3. So a quiet cue needs a higher bed: `j_good_feelings` (−19.6) ran at 0.26–0.3 in *Good Luck*. Use the LUFS column:
  every 6 dB quieter than about −12 means roughly doubling the bed. The loudest cues (`r_spirits_dark`, `w_aftermath`, `r_schools`) sit at 0.12–0.14.
- `tools/master.py` normalizes the final mix to −14 LUFS, so cues only need to balance against each other and the voice.

**Credit line for the description:** "Music: original cues generated with Suno, ElevenLabs and Google Lyria for 15 Minute History."

## Pick by feeling


### Stings

| Cue | Length | LUFS | What it sounds like | Best part | Used in |
|---|---|---|---|---|---|
| [`r_title_sting`](cues/r_title_sting.mp3) | 0:30 | -11.3 | Channel title sting: one warm, bold orchestral + piano hit with a low boom and rising string swell that rings out. | Only the first ~10 s are used (the file is 29.6 s); the intro fades it out by frame 74 (~2.5 s after the hit). | Fix Everything, The Man Who Couldn't Sit Still, King Andrew, Grip Tighter, Good Luck |
| [`w_title_fanfare`](cues/w_title_fanfare.mp3) | 0:29 | -10.8 | Short theatrical overture flourish: bright brass fanfare, fife + field drums, martial 1812 march phrase, cymbal crash, big ringing final chord. |  | The War Nobody Won |

### Cold opens and mystery

| Cue | Length | LUFS | What it sounds like | Best part | Used in |
|---|---|---|---|---|---|
| [`r_cold_open`](cues/r_cold_open.mp3) | 1:16 | -12.4 | Mystery / 'investigators' cue: felt-piano ostinato, muted pizzicato bass, ticking clock; dark accent ~28 s; then restless montage energy; ends on a held questioning chord. | Dark accent at ~28 s (Grip Tighter lands it on 'Between 55 and 60 white people were killed'); the closing questioning chord sits under the video's big question. | Fix Everything, The Man Who Couldn't Sit Still, King Andrew, Grip Tighter, Good Luck |
| [`j_cold_open`](cues/j_cold_open.mp3) | 1:02 | -17.8 | Tense, restrained: low solo cello, string drones, sparse pizzicato, soft ticking pulse, distant frame-drum heartbeat, lonely fiddle; slow suspense build to a held unresolved chord. | Written for the 1806 duel: King Andrew MUSIC.md says start it at 'Then came the Revolution' so the swell lands on the duel. | Jackson Video 1 / Part One, King Andrew, Good Luck, Grip Tighter |
| [`j_intrigue`](cues/j_intrigue.mp3) | 2:05 | -15.4 | Sly, suspenseful backroom deal: low clarinet + bassoon, sneaky pizzicato, ticking harpsichord, muted snare; angry brass sting mid-cue; brooding suspicious tail. | Brass sting around the middle of the 125 s cue (per its prompt; not timed): King Andrew lines it up with 'Judas of the West'. The brooding tail was the suggested fallback for the Bank War chapter. | Jackson Video 1 / Part One, King Andrew, The War Nobody Won, Fix Everything, Good Luck |
| [`r_spirits`](cues/r_spirits.mp3) | 1:42 | -10.7 | Playful and eerie: music box, detuned piano, tremolo strings, soft knocks; second half turns earnest and wide (pioneers trekking west). | First ~50 s (music box, detuned piano, soft knocks) is the Fox-sisters part; the second half turns earnest/wide. | Fix Everything, Good Luck |
| [`w_calm_sea`](cues/w_calm_sea.mp3) | 1:07 | -12.5 | Calm, open, slightly uneasy morning at sea: rocking 6/8 low strings, solo wooden flute shanty phrase, harp, col legno rope creaks; darkens after ~30 s with a low cello ostinato; held unresolved minor chord. | First ~30 s calm; the threat (cello ostinato) creeps in after ~30 s. | The War Nobody Won, Good Luck |

### Light, wry and comic

| Cue | Length | LUFS | What it sounds like | Best part | Used in |
|---|---|---|---|---|---|
| [`r_schools`](cues/r_schools.mp3) | 1:02 | -12.4 | Light, bright, curious: pizzicato, glockenspiel, clarinet, bouncy piano; knowing comic final button (Ouija's 'fun' theme). | The comic final button (Ouija lands it on "It's the point."). | Fix Everything, The Man Who Couldn't Sit Still, Good Luck |
| [`j_gossip`](cues/j_gossip.mp3) | 2:00 | -12.8 | Playful, gossipy, mischievous: tiptoeing pizzicato, fussy harpsichord, sly clarinet, teacup percussion, 'gasp' string swells, dramatic finish. |  | Jackson Video 1 / Part One, King Andrew, The War Nobody Won, Good Luck |
| [`a_price`](cues/a_price.mp3) | 1:05 | -17.3 | Caper underscore, Gilded Age confidence: walking upright bass, staccato clarinet, pizzicato, piano stabs, brushed snare, sneaky tension, cheeky triumphant brass button at the end. | The cheeky brass button at the end. | The Man Who Couldn't Sit Still, Good Luck |
| [`a_newsroom`](cues/a_newsroom.mp3) | 1:05 | -15.1 | Sly sardonic 1890s newsroom: ragtime-tinged piano, pizzicato, staccato bassoon, muted trumpet, typewriter ticks, witty swagger. |  | The Man Who Couldn't Sit Still |
| [`r_temperance`](cues/r_temperance.mp3) | 1:01 | -12.6 | Comic, bouncy, tipsy honky-tonk piano + fiddle + tuba; halfway turns hopeful/determined, ends warm and upbeat. |  | Fix Everything, The Man Who Couldn't Sit Still |
| [`j_good_feelings`](cues/j_good_feelings.mp3) | 1:30 | -19.6 | Light, warm, slightly wry: plucked strings, lilting parlor fiddle, soft fife, piano-forte, relaxed walking pulse; 'pleasant and a little too cozy, with a faint hint of mischief near the end' (Ouija's 'love' theme). | Ouija starts it 8 s in (startFrom 240) to skip the intro; mischief is near the end. | Jackson Video 1 / Part One, King Andrew, The War Nobody Won, Good Luck |
| [`j_campaign`](cues/j_campaign.mp3) | 1:40 | -14.5 | Rowdy, energetic 1820s campaign march: fife + field drum, bright brass band, banjo, fiddle, hand claps, crowd feel; playful and a bit chaotic. |  | Jackson Video 1 / Part One, King Andrew, The War Nobody Won |

### Warm, hopeful and dignified

| Cue | Length | LUFS | What it sounds like | Best part | Used in |
|---|---|---|---|---|---|
| [`g_world_outside`](cues/g_world_outside.mp3) | 1:50 | -14.7 | Warm, dignified: solo cello melody in the spirit of a spiritual, soft strings, gentle piano, hymn-like; rises to a restrained hopeful swell. |  | Grip Tighter |
| [`r_curtain`](cues/r_curtain.mp3) | 1:31 | -12.7 | Women's rights: restrained, quietly indignant (low strings, piano pulse) → determined build with noble horn → proud restrained peak → thoughtful settle. |  | Fix Everything |
| [`r_utopia`](cues/r_utopia.mp3) | 2:02 | -12.1 | Three parts: dreamy pastoral (guitar, flute, birdsong) → plain hymn in the style of 'Simple Gifts' → darkening unease, low drones, somber unresolved end. |  | Fix Everything, Good Luck |
| [`r_revival`](cues/r_revival.mp3) | 1:31 | -12.1 | 1820s camp-meeting revival: stomping/clapping 3/4, droning fiddle, shape-note open fifths, building fervor, settles to a warm glow. |  | Fix Everything |
| [`g_founding`](cues/g_founding.mp3) | 0:55 | -15.5 | Early American chamber (1790s): harpsichord + string quartet, slow minuet, stately, quietly uncertain; darkens into a held low cello note. |  | Grip Tighter, Good Luck |

### Grave (heavy chapters)

| Cue | Length | LUFS | What it sounds like | Best part | Used in |
|---|---|---|---|---|---|
| [`r_dix`](cues/r_dix.mp3) | 1:02 | -11.9 | Grave, quiet, humane: sparse solo piano + low cello, cold and restrained, no melodrama; slow hopeful string rise in the last ~15 s. | First ~45 s before its hopeful rise = grave bed; the last ~15 s is the hopeful rise. | Fix Everything, The Man Who Couldn't Sit Still, Grip Tighter, Good Luck |
| [`j_grief`](cues/j_grief.mp3) | 0:40 | -14.0 | Quiet grieving solo cello over a soft sustained string pad, slow and simple (Ouija's 'grief' theme). |  | Jackson Video 1 / Part One, King Andrew, The War Nobody Won, Grip Tighter, Good Luck |
| [`w_aftermath`](cues/w_aftermath.mp3) | 0:59 | -12.8 | Aftermath of an attack: low sustained strings, distant muffled field drum like a heartbeat, mournful solo fiddle, sparse and grave; second half questioning, slow crescendo + soft snare roll. | First half is the grave part; second half builds tension. | The War Nobody Won, King Andrew, Grip Tighter, Good Luck |
| [`r_abolition_a`](cues/r_abolition_a.mp3) | 1:38 | -13.1 | Serious, resolute, dignified: low strings, slow deep heartbeat drum, solemn piano theme; tension rise mid-cue; falls to grieving quiet. | Tension rise in the middle (Grip Tighter: coffles / ships to New Orleans), grieving quiet at the end. | Fix Everything, Grip Tighter |
| [`a_civil_war`](cues/a_civil_war.mp3) | 1:25 | -15.4 | Lone field snare + fife-like flute, young eager march → somber heavy (low strings, muted brass, timpani) → fragile quiet solo cello. | Somber second half is the reusable grave part. | The Man Who Couldn't Sit Still, Grip Tighter |
| [`w_frontier`](cues/w_frontier.mp3) | 1:36 | -12.0 | Tecumseh / Tenskwatawa: dignified, slow solo cello + low wooden flute, heartbeat drum; urgency/alarm mid-cue (dawn battle); grieving burnt-out quiet. |  | The War Nobody Won, King Andrew |

### Tension, dread and dark

| Cue | Length | LUFS | What it sounds like | Best part | Used in |
|---|---|---|---|---|---|
| [`r_spirits_dark`](cues/r_spirits_dark.mp3) | 1:40 | -12.1 | Dark, low and eerie (Ouija's 'fear' theme); the darker Suno replacement for r_spirits. |  | Fix Everything, The Man Who Couldn't Sit Still, Good Luck |
| [`g_grip`](cues/g_grip.mp3) | 1:10 | -16.3 | Tense political: slow tightening low-string ostinato, ticking clock, sparse piano stabs, restrained brass swells, ominous, ends on a sustained dark chord. | First ~70 s used; starting 13 s into the chapter puts its closing chord under the restated question. | Grip Tighter |
| [`g_southampton`](cues/g_southampton.mp3) | 1:50 | -15.9 | Grave prophetic suspense: low drones, slow heartbeat drum, eerie high strings (eclipse), rising dread, sudden dark swell, hollow silence, grieving cello aftermath. |  | Grip Tighter |
| [`g_pyramid`](cues/g_pyramid.mp3) | 1:40 | -15.8 | Antebellum parlor elegance turned uneasy: stately piano + string quartet, cold and polished, low drone, harp; last third darkens with a low fear pulse. |  | Grip Tighter, Good Luck |
| [`g_cotton_engine`](cues/g_cotton_engine.mp3) | 1:45 | -14.9 | Industrial mechanical ostinato (gin crank, gears): pizzicato + muted piano, ticking pulse, adds low strings/brass, relentless, darker and heavier. |  | Grip Tighter |
| [`r_nativism`](cues/r_nativism.mp3) | 1:48 | -12.3 | Four moods: Irish low whistle + cello lament (famine) → uneasy pulsing ostinato, dark brass (mob, fire) → sly sardonic pizzicato → tense secretive muted-snare march. | Second half (from ~55 s: sardonic pizzicato then the secretive march) is the reusable part for non-immigration stories. | Fix Everything, King Andrew, The Man Who Couldn't Sit Still, Grip Tighter |
| [`r_abolition_b`](cues/r_abolition_b.mp3) | 1:49 | -12.3 | Defiant and building: driving low strings → powerful uncompromising theme with timpani → dissonant chaos (a mob) → stubborn resolved ending. |  | Fix Everything, King Andrew, The Man Who Couldn't Sit Still, Grip Tighter |

### Action and war

| Cue | Length | LUFS | What it sounds like | Best part | Used in |
|---|---|---|---|---|---|
| [`w_sea_battle`](cues/w_sea_battle.mp3) | 1:16 | -11.3 | Heroic swashbuckling naval battle: brisk strings, brass fanfares, fife, field drums, timpani like cannon fire, triumphant cheering ending. |  | The War Nobody Won, King Andrew |
| [`w_fire`](cues/w_fire.mp3) | 1:28 | -11.1 | Burning of Washington: urgent anxious tremolo + ticking clock → tender quiet interlude (saving the painting) → dark and heavy, low brass, timpani, descending minor theme. |  | The War Nobody Won, Grip Tighter |
| [`w_dawn`](cues/w_dawn.mp3) | 1:06 | -11.6 | Night bombardment of Fort McHenry: rumbling timpani, anxious strings in the dark, then a slow sunrise swell into a warm noble hopeful brass/string chorale. | Dark first part, then the sunrise swell (the hopeful part) later in the cue. | The War Nobody Won, Good Luck |
| [`a_mexico`](cues/a_mexico.mp3) | 1:30 | -15.7 | Mexican Revolution 1913: nylon guitar, guitarrón, lonely trumpet, chugging train rhythm, dusty building tension, ends suspended and quiet. |  | The Man Who Couldn't Sit Still |
| [`a_mexico_short`](cues/a_mexico_short.mp3) | 1:05 | -14.7 | Alternate take of a_mexico (65 s, low dynamic range). |  | The Man Who Couldn't Sit Still |

### Endings

| Cue | Length | LUFS | What it sounds like | Best part | Used in |
|---|---|---|---|---|---|
| [`r_ending`](cues/r_ending.mp3) | 1:01 | -12.0 | Closing cue: reflective warm piano + strings, second half turns dark/tense with low strings and brass, ends on an unresolved chord. | Warm first ~30 s; the darkening and the unresolved chord are in the second half (King Andrew starts it ~30 s in so the chord lands on 'King'). | Fix Everything, The Man Who Couldn't Sit Still, King Andrew, Grip Tighter, Good Luck |

## Recurring roles

These cues have become the channel's regulars:

- **`r_title_sting`** is the channel sting, in every intro.
- **`r_cold_open`** is the "investigators" cue (felt piano, ticking clock). It's the cold-open identity and works under any evidence or science section.
- **`r_ending`**: use its warm first ~30 s under a final answer, or the whole cue for an unresolved, darkening close.
- **`r_dix`, `j_grief` and `w_aftermath`** are the grave set for heavy chapters.
- **Ouija's four feelings:** `j_good_feelings` (love), `j_grief` (grief), `r_schools` (fun) and `r_spirits_dark` (fear).

## Making a new cue

**Suno** (made by hand; the best results so far):
- Mode **Custom**, **Instrumental ON**. Paste the Styles text as written.
- **Exclude Styles** (the stricter Grip Tighter line, use it by default):
  > vocals, choir, lyrics, humming, drum kit, EDM, trap, pop, rock, synth lead, dubstep, rap, gospel vocals, banjo, comedic, upbeat

  Drop `comedic, upbeat` when the cue is meant to be funny.
- Suno makes 2+ minute tracks. Pick the take whose **first 30–40 seconds** already sound like the cue, because most cues are built from their opening.
- Write the Styles text as: genre and period, instruments, tempo and pulse, how it changes over time, then "documentary, restrained, space for narrator, instrumental". The prompts for every Suno cue are below.
- **One-melody trick** (planned for Ouija, never made): make the theme first, then make each other cue as a **Cover** of that take with new Styles text, so one tune comes back in several arrangements.

**Google Lyria** (`tools/music_lyria.py <cue>`, key `GEMINI_API_KEY`, about $0.08 a cue). Add the prompt to `CUES`; every full cue
gets this suffix:
> Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

**ElevenLabs** (`tools/music_eleven.py <name>`, in the template; about 850 credits a minute). Instrumental is forced, and its cues come out quiet, so measure the LUFS.

**Adding a cue to this library:** give it the new video's prefix, copy it to `cues/`, measure it
(`ffmpeg -i cues/x.mp3 -af loudnorm=print_format=summary -f null -`), and add a row above and an entry in `catalog.json` with its prompt.

## Every cue with its prompt


### `r_title_sting`

0:30 · -11.3 LUFS · Google Lyria (`lyria-3-clip-preview`) · made for *Fix Everything*

> A 10-second title sting for a history documentary called 'Fix Everything': one warm, bold orchestral and piano hit with a low boom and a rising string swell that rings out. Instrumental only.

Channel identity. Also ships in the 15-minute-history skill template on the King Andrew branch.

- Fix Everything: Intro / title card (Intro.tsx), starts 4 frames before the '15' · bed 0.45 (fade 0→0.45 in 3 f, hold to f50, out by f74)
- The Man Who Couldn't Sit Still: Intro / title card · bed 0.45
- King Andrew: Intro / title card (music/v3/title_sting.mp3) · bed 0.45
- Grip Tighter: Intro / title card · bed 0.45
- Good Luck: Intro / title card (music/title_sting.mp3; r_title_sting.mp3 is an identical copy) · bed 0.45

### `w_title_fanfare`

0:29 · -10.8 LUFS · Google Lyria (`lyria-3-clip-preview`) · made for *The War Nobody Won*

> A short theatrical overture flourish for the title card of a toy-theater play: bright brass fanfare, fife and field drums playing a martial 1812-era march phrase, cymbal crash, then a big final chord that rings out. Instrumental only, no vocals.

The War Nobody Won's own title sting (toy-theater look) — not the channel sting.

- The War Nobody Won: ColdOpen → title playbill · bed 0.5
- The War Nobody Won: Legacy (closing flourish) · bed 0.45

### `r_cold_open`

1:16 · -12.4 LUFS · Google Lyria (`lyria-3.5`) · made for *Fix Everything*

> A 75-second cue. Opens as a mystery: a low, patient felt-piano ostinato, muted pizzicato basses and a soft ticking clock pulse, like investigators tracing a ship's route on a map. It tightens and builds suspense to a sharp, dark accent at about 28 seconds, then opens up curious and restless: brisk pizzicato strings and light percussion driving a quick montage, rising to a held, questioning chord at the end. Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

The channel's cold-open identity cue.

- Fix Everything: Ch01 Cold open: the pamphlet in Savannah · bed 0.17, dipping to 0.06 at the end
- The Man Who Couldn't Sit Still: Ch01 An Unknown Destination · bed 0.17
- The Man Who Couldn't Sit Still: Ch09 Walking Off the Map (until 'So back', then r_ending) · bed 0.15
- King Andrew: Ch01 King Andrew the First (music/v3/r_cold_open.mp3) · bed 0.17, fading to 0 at the end
- Grip Tighter: Ch01 The Proclamation · bed 0.17 → 0.12 over the last 60 frames
- Good Luck: Ch09 Who Moves It? (Faraday / blindfold study, before the four-feeling montage) · bed 0.13

### `j_cold_open`

1:02 · -17.8 LUFS · ElevenLabs Music (`ElevenLabs /v1/music`) · made for *Jackson Video 1 / Part One*

> Tense, restrained documentary underscore for a history explainer about an 1806 pistol duel in Tennessee. Low solo cello and string drones, sparse plucked pizzicato, a soft ticking pulse, distant frame drum heartbeat, a lonely fiddle line. Slow build of suspense, then a held, unresolved chord. Instrumental only, no vocals, leaves room for a narrator.

Quiet file (−17.8 LUFS) — needs a higher bed than Lyria cues (Ouija uses 0.27).

- Jackson Video 1 / Part One: v1 ColdOpen (the 1806 Dickinson duel) · bed bedVol curve (pulled down for the shot, gone for 'boring', back for the title)
- King Andrew: Ch02 Dirty Boots · bed 0.14
- Good Luck: Ch05 Patience Worth · bed 0.27
- Grip Tighter: Fallback for Ch03/Ch05; copied in as j_cold_open, unused · bed —

### `j_intrigue`

2:05 · -15.4 LUFS · ElevenLabs Music (`ElevenLabs /v1/music`) · made for *Jackson Video 1 / Part One*

> Sly, suspenseful documentary underscore about a backroom political deal in 1825 Washington. Low clarinet and bassoon, sneaky pizzicato strings, a ticking harpsichord, a muted snare brushing in; tension that builds to an angry brass sting around the middle, then a brooding, suspicious tail. Instrumental only, no vocals, leaves room for a narrator.

Generated for Jackson Video 1 (ElevenLabs); Reform-Era copied it as intrigue.mp3, so Ouija named it r_intrigue — canonical prefix is j_.

- Jackson Video 1 / Part One: v1 Judas1824 (Corrupt Bargain) · bed 0.15
- Jackson Video 1 / Part One: v1 PunchBowl (from B until 'weird') · bed 0.12
- King Andrew: Ch04 The Corrupt Bargain · bed 0.13
- The War Nobody Won: Lowell (until 'home') · bed 0.13
- Fix Everything: jh/MapTest (a map-motion test, not a chapter; file is music/intrigue.mp3 in Reform-Era) · bed 0.16
- Good Luck: Ch02 Knock Once for Yes (as r_intrigue) · bed 0.26

### `r_spirits`

1:42 · -10.7 LUFS · Google Lyria (`lyria-3.5`) · made for *Fix Everything*

> A 100-second cue: playful and eerie for a story about spirit rappings and seances in 1848: a music box, slightly detuned piano, tremolo strings and soft knocks, curious and a little comic; in the second half it turns earnest and wide for pioneers trekking west across the country. Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

- Fix Everything: Originally scored for Ch03 Knock Once for Yes, then replaced by r_spirits_dark (Suno) in commit 8e5d49a; not referenced by any Reform chapter now · bed —
- Good Luck: Ch01, quiet music-box bed under the title card after the sting (startFrom 240 f = 8 s) · bed 0.16
- Good Luck: TestScene (production test 'Knock Once for Yes') · bed animated

### `w_calm_sea`

1:07 · -12.5 LUFS · Google Lyria (`lyria-3.5`) · made for *The War Nobody Won*

> A 70-second cue. Calm, open, slightly uneasy morning at sea, June 1807: a small theater-pit orchestra - gently rocking 6/8 low strings like swells, a solo wooden flute with a simple sea-shanty-like phrase, soft harp, creaking-rope textures from col legno strings. After about 30 seconds a low cello ostinato creeps in and the harmony darkens as a threat approaches. End on a held, unresolved minor chord. Instrumental only, no vocals. Documentary underscore for a classroom history video staged as a 19th-century paper toy theater; leave space in the midrange for a narrator; no drum kit, no synths, no modern pop production.

- The War Nobody Won: ColdOpen (Chesapeake–Leopard, until 'opens fire') · bed 0.2
- Good Luck: Previously ch05 Patience Worth (review/music_options/ch05_current_calm_sea), replaced by j_cold_open; still in the folder · bed —

### `r_schools`

1:02 · -12.4 LUFS · Google Lyria (`lyria-3.5`) · made for *Fix Everything*

> A 60-second cue: light, bright and curious for the story of the first free public schools: pizzicato strings, glockenspiel, clarinet and a bouncy piano, playful with a knowing, comic final button. Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

Ouija MUSIC.md: among the loudest cues; keep 0.12–0.14.

- Fix Everything: Ch07 The Equalizer (Horace Mann) · bed 0.15
- The Man Who Couldn't Sit Still: Ch02 Thirteen A's · bed 0.15
- Good Luck: Ch07 Next to Monopoly (cuts out at 'Which made…') · bed 0.13
- Good Luck: Ch09 montage, 'Fun' beat (startFrom 72 f) · bed 0.13

### `j_gossip`

2:00 · -12.8 LUFS · ElevenLabs Music (`ElevenLabs /v1/music`) · made for *Jackson Video 1 / Part One*

> Playful, gossipy, mischievous documentary underscore about a scandal among 1830s Washington high society: tiptoeing pizzicato strings, a fussy harpsichord, a sly clarinet, teacup-delicate percussion, occasional dramatic 'gasp' string swells, building to a dramatic finish. Instrumental only, no vocals, leaves room for a narrator.

Ouija treats it as a quiet King Andrew cue (bed 0.3), though its integrated loudness (−12.8 LUFS) is close to the Lyria cues; its range is wide (LRA 14).

- Jackson Video 1 / Part One: v1 Petticoat (Petticoat Affair) · bed 0.15
- King Andrew: Ch07 The Petticoat Affair · bed 0.13
- The War Nobody Won: NewOrleans (from the twist) · bed 0.12
- Good Luck: Ch08 Captain Howdy (from 'But here's the twist', startFrom 240 f = 8 s) · bed 0.3

### `a_price`

1:05 · -17.3 LUFS · Suno (`Suno`) · made for *The Man Who Couldn't Sit Still*

> caper underscore, gilded age confidence, plucked upright bass walking line, staccato clarinet, pizzicato strings, piano stabs, light brushed snare, sneaky build of tension, then a triumphant cheeky brass button at the end, playful, witty, documentary, space for narrator, instrumental

Quietest Suno cue (−17.3 LUFS).

- The Man Who Couldn't Sit Still: Ch06 Name Your Price · bed 0.15
- Good Luck: Ch03 Good Luck (button lands on "I'm a Presbyterian"; runs under the subscribe plug) · bed 0.2

### `a_newsroom`

1:05 · -15.1 LUFS · Suno (`Suno`) · made for *The Man Who Couldn't Sit Still*

> sly sardonic underscore, 1890s newsroom, ragtime-tinged upright piano, pizzicato strings, staccato bassoon, muted trumpet, typewriter-like percussion ticks, mischievous, sharp, witty, confident swagger, documentary, space for narrator, instrumental

*INFERRED: the file is 'Newsroom' (Suno title) and replaced the `bitter.mp3` slot in Ch05; PROMPTS.md has no cue named newsroom, but the bitter.mp3 Styles text is the '1890s newsroom' prompt.*

Tied to Bierce (Ouija MUSIC.md). Very low dynamic range (LRA 2.2).

- The Man Who Couldn't Sit Still: Ch05 Bitter Bierce, first half (until 'And in his', then r_spirits_dark) · bed 0.15

### `r_temperance`

1:01 · -12.6 LUFS · Google Lyria (`lyria-3.5`) · made for *Fix Everything*

> A 60-second cue: comic and bouncy for America's 1830s drinking habits: a honky-tonk upright piano and fiddle with tuba and brushes, a little tipsy; halfway it shifts to hopeful and determined strings as reformers get people to sign a pledge, ending warm and upbeat. Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

- Fix Everything: Ch05 Seven Gallons (temperance) · bed 0.15
- The Man Who Couldn't Sit Still: Ch04 Go West, Young Grump (stand-in; the Suno west.mp3 never arrived) · bed 0.15

### `j_good_feelings`

1:30 · -19.6 LUFS · ElevenLabs Music (`ElevenLabs /v1/music`) · made for *Jackson Video 1 / Part One*

> Light, warm, slightly wry documentary underscore for a history explainer about the calm 'Era of Good Feelings' in 1820s America. Gentle plucked strings, a lilting parlor fiddle melody, soft fife, piano-forte, a relaxed walking pulse; pleasant and a little too cozy, with a faint hint of mischief near the end. Instrumental only, no vocals, leaves room for a narrator.

Quietest file in the library (−19.6 LUFS, ~7 dB under the Lyria cues): beds 0.26–0.3 in Ouija.

- Jackson Video 1 / Part One: v1 Election1820 (Era of Good Feelings) · bed 0.15
- Jackson Video 1 / Part One: v1 Campaign1828 (scene music) · bed 0.15
- King Andrew: Ch06 To the Victors · bed 0.13
- King Andrew: v3 BreakDemo · bed 0.15
- The War Nobody Won: Lowell (from 'home') · bed 0.14
- The War Nobody Won: Legacy (from 'why' to 'sad') · bed 0.14
- Good Luck: Ch01 Two Pictures (Rockwell half, hard cut to r_spirits_dark) · bed 0.3
- Good Luck: Ch04 Knees Touching (startFrom 240 f = 8 s) · bed 0.28
- Good Luck: Ch09 montage 'Love' beat (startFrom 240) and end screen · bed 0.3

### `j_campaign`

1:40 · -14.5 LUFS · ElevenLabs Music (`ElevenLabs /v1/music`) · made for *Jackson Video 1 / Part One*

> Rowdy, energetic 1820s American campaign march for a history explainer: fife and field drum, a bright brass band, banjo and fiddle, hand claps and a crowd feel, playful and a bit chaotic. Instrumental only, no vocals, leaves room for a narrator.

- Jackson Video 1 / Part One: v1 PunchBowl (scene music) · bed 0.15
- Jackson Video 1 / Part One: v1 Campaign1828 (from Cb) · bed 0.15
- King Andrew: Ch05 King Mob (before grief, then again from startFrom 600 f = 20 s for the inauguration) · bed 0.12
- The War Nobody Won: WarHawks · bed 0.12

### `g_world_outside`

1:50 · -14.7 LUFS · Suno (`Suno`) · made for *Grip Tighter*

> warm dignified documentary underscore, quiet strength and resilience, solo cello melody in the spirit of an old American spiritual, soft sustained strings, gentle piano, slow hymn-like pace, intimate and humane, gradually rises to a restrained hopeful swell, never sentimental, space for narrator, instrumental

Grip Tighter's one warm cue.

- Grip Tighter: Ch08 A World Outside Work (the swell falls on Harriet Jacobs) · bed 0.14

### `r_curtain`

1:31 · -12.7 LUFS · Google Lyria (`lyria-3.5`) · made for *Fix Everything*

> A 90-second cue for women's rights in the 1840s: starts restrained and quietly indignant (low strings, a steady piano pulse), builds with determination through rising strings and a noble horn line, and reaches a proud but restrained high point, then settles thoughtfully. Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

- Fix Everything: Ch08 The Curtain (Seneca Falls) · bed 0.15

### `r_utopia`

2:02 · -12.1 LUFS · Google Lyria (`lyria-3.5`) · made for *Fix Everything*

> A 120-second cue in three parts: first dreamy and pastoral for writers seeking truth in nature (acoustic guitar, flute, soft strings, birdsong-like figures); then a gentle, plain hymn-like section in the style of the 1848 Shaker tune 'Simple Gifts', played by strings and flute; then it darkens into unease and quiet menace with low drones for a controlling commune, ending somber and unresolved. Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

- Fix Everything: Ch09 Utopia (Transcendentalists, Shakers, Oneida) · bed 0.15
- Good Luck: Alternate in the folder (backup for ch05) · bed —

### `r_revival`

1:31 · -12.1 LUFS · Google Lyria (`lyria-3.5`) · made for *Fix Everything*

> A 90-second cue for an 1820s camp-meeting revival in upstate New York: a stomping, clapping 3/4 pulse, a droning fiddle, open-fifth harmonies with the rugged sound of shape-note Sacred Harp singing played by low strings and a wordless hummed choir pad (no words), building in fervor like a revival spreading from town to town, then settling to a warm glow at the end. Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

- Fix Everything: Ch02 Burned Over (Second Great Awakening) · bed 0.15

### `g_founding`

0:55 · -15.5 LUFS · Suno (`Suno`) · made for *Grip Tighter*

> early American chamber underscore, 1790s, stately and calm, harpsichord and string quartet, slow minuet pulse, gentle and dignified, quietly uncertain harmony underneath, then darkens into a held unresolved low cello note, documentary, restrained, space for narrator, instrumental

- Grip Tighter: Ch02 Supposed to Die (enters at chapter frame 150 = 5 s; the dark cello lands on 'Hold that thought') · bed 0.17
- Good Luck: Copied in as g_founding; not used (listed as written for slavery) · bed —

### `r_dix`

1:02 · -11.9 LUFS · Google Lyria (`lyria-3.5`) · made for *Fix Everything*

> A 60-second cue: grave, quiet and humane for a reformer documenting suffering in jails and poorhouses: a sparse solo piano and a low cello, cold and restrained, no melodrama; in the last 15 seconds a slow, hopeful rise with strings as her work succeeds. Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

- Fix Everything: Ch06 Cages (Dorothea Dix) · bed 0.14
- The Man Who Couldn't Sit Still: Ch07 Not a Highlight Reel (heavy chapter) · bed 0.14
- Grip Tighter: Ch06 Sunup to Sundown (first ~45 s, then j_grief) · bed 0.12
- Grip Tighter: Fallback for Ch08 (its hopeful last 15 s, extended) · bed —
- Good Luck: Alternate in the folder (backup for ch06) · bed —

### `j_grief`

0:40 · -14.0 LUFS · ElevenLabs Music (`ElevenLabs /v1/music`) · made for *Jackson Video 1 / Part One*

> Quiet, grieving solo cello with a soft sustained string pad, slow and simple, for the death of a beloved wife in 1828. Instrumental only, no vocals.

Short (40 s). Requested length 40000 ms.

- Jackson Video 1 / Part One: v1 Campaign1828 (Rachel Jackson's death) · bed 0.16
- King Andrew: Ch05 King Mob (Rachel's death, solo) · bed 0.16
- The War Nobody Won: Legacy (from 'sad') · bed 0.16
- Grip Tighter: Ch06 Sunup to Sundown (from 'Some enslaved people', Douglass beat) · bed 0.12
- Good Luck: Ch06 Empty Chairs (from 'So picture one house') · bed 0.15
- Good Luck: Ch09 montage 'Grief' beat · bed 0.16

### `w_aftermath`

0:59 · -12.8 LUFS · Google Lyria (`lyria-3.5`) · made for *The War Nobody Won*

> A 60-second cue. The aftermath of a sudden naval attack, 1807: low sustained strings, a distant muffled field drum like a heartbeat, a mournful solo fiddle line, sparse and grave. In the second half it turns quietly questioning and builds tension toward something larger, with a slow crescendo in the strings and a soft snare roll. Instrumental only, no vocals. Documentary underscore for a classroom history video staged as a 19th-century paper toy theater; leave space in the midrange for a narrator; no drum kit, no synths, no modern pop production.

Ouija MUSIC.md: among the loudest; keep 0.12–0.14.

- The War Nobody Won: ColdOpen (from 'Three') · bed 0.2
- The War Nobody Won: Impressment · bed 0.15
- The War Nobody Won: Legacy (until 'why') · bed 0.13
- King Andrew: Ch10 Let Him Enforce It, Trail of Tears (after w_frontier) · bed 0.13
- Grip Tighter: Ch07 No Law Above Him (ends before Celia; her story plays over room tone) · bed 0.12
- Good Luck: Ch06 Empty Chairs (until 'So picture') · bed 0.12

### `r_abolition_a`

1:38 · -13.1 LUFS · Google Lyria (`lyria-3.5`) · made for *Fix Everything*

> A 100-second cue: serious, resolute and dignified for the fight against slavery and David Walker's Appeal of 1829: low strings and a slow, deep heartbeat drum, a solemn piano theme; tension rises for a hidden pamphlet smuggled south and a bounty, then falls to a grieving quiet. No stereotypes. Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

- Fix Everything: Ch10 Not Someday, first half (David Walker), until 'mid' · bed 0.14
- Grip Tighter: Ch04 Sold South · bed 0.13

### `a_civil_war`

1:25 · -15.4 LUFS · Suno (`Suno`) · made for *The Man Who Couldn't Sit Still*

> Civil War documentary underscore, begins with a lone field snare and a fife-like wooden flute, young and eager march, then turns somber and heavy, low strings, distant muted brass, slow timpani, grief without melodrama, then fragile and quiet with solo cello, restrained, respectful, space for narrator, cinematic, instrumental

- The Man Who Couldn't Sit Still: Ch03 Broke Like a Walnut · bed 0.15
- Grip Tighter: Fallback (somber second half) for Ch09 aftermath; copied in as a_civil_war, unused · bed —

### `w_frontier`

1:36 · -12.0 LUFS · Google Lyria (`lyria-3.5`) · made for *The War Nobody Won*

> A 95-second cue for the story of the Shawnee leader Tecumseh and his brother, Indiana Territory, 1805-1811: dignified and serious, a slow solo cello and a low wooden flute over sustained strings, a soft, steady deep drum like a heartbeat; builds to urgency and alarm in the middle for a dawn battle, then falls to a grieving, burnt-out quiet. Respectful, no stereotypes, no chanting. Instrumental only, no vocals. Documentary underscore for a classroom history video staged as a 19th-century paper toy theater; leave space in the midrange for a narrator; no drum kit, no synths, no modern pop production.

- The War Nobody Won: Tecumseh · bed 0.17
- King Andrew: Ch10 Let Him Enforce It (before w_aftermath) · bed 0.12

### `r_spirits_dark`

1:40 · -12.1 LUFS · Suno (`Suno`) · made for *Fix Everything*

*No prompt was saved for this cue.*

Mastered version of the Suno download r_spirits_dark_suno_src (same Suno id; +4.7 dB, 44.1 kHz/192k). Ouija MUSIC.md: one of the loudest cues, keep at 0.12–0.14.

- Fix Everything: Ch03 Knock Once for Yes (new religions) · bed 0.17
- The Man Who Couldn't Sit Still: Ch05 Bitter Bierce, second half (Owl Creek, from 'And in his') · bed 0.16
- Good Luck: Ch01 Two Pictures (the 1973 half, hard cut from j_good_feelings) · bed 0.15 → 0.12
- Good Luck: Ch08 Captain Howdy (until 'But here's the twist') · bed 0.13
- Good Luck: Ch09 four-feeling montage, 'Fear' beat (startFrom 960 f = 32 s) · bed 0.14

### `g_grip`

1:10 · -16.3 LUFS · Suno (`Suno`) · made for *Grip Tighter*

> tense political documentary underscore, slow tightening ostinato in low strings, ticking clock pulse, cold and deliberate, sparse piano stabs, each phrase a little heavier and closer, restrained brass swells, ominous and inevitable, ends on a sustained dark chord, space for narrator, instrumental

- Grip Tighter: Ch10 Grip Tighter (enters at chapter frame 390 = 13 s, until 'Then the cotton', then r_ending) · bed 0.15

### `g_southampton`

1:50 · -15.9 LUFS · Suno (`Suno`) · made for *Grip Tighter*

> grave suspense documentary underscore, prophetic and foreboding, low string drones, distant deep drum like a slow heartbeat, sparse eerie high strings like an eclipse, dread slowly rising, a sudden dark swell, then hollow silence and a grieving low cello aftermath, restrained, no action music, no heroics, space for narrator, instrumental

Embedded Suno title tag says 'World Outside' (id 0a2e74c2…), but it was uploaded as 'South Hampton.mp3' and differs from g_world_outside.

- Grip Tighter: Ch09 Southampton (swell runs from the hiding through the hanging, then quiet for 'Historians still wrestle') · bed 0.14

### `g_pyramid`

1:40 · -15.8 LUFS · Suno (`Suno`) · made for *Grip Tighter*

> antebellum southern parlor elegance turned uneasy, slow stately piano and string quartet, cold and polished, quiet tension underneath, low drone, sparse harp, restrained documentary underscore, in the last third the harmony darkens and a low pulse appears like fear, space for narrator, instrumental

- Grip Tighter: Ch05 The Pyramid (from the top; fades just before '…one more reason. Fear.') · bed 0.17
- Good Luck: Copied in as g_pyramid; was option A for ch02/C for ch05 (review/music_options), not used · bed —

### `g_cotton_engine`

1:45 · -14.9 LUFS · Suno (`Suno`) · made for *Grip Tighter*

> industrial revolution documentary underscore, mechanical ostinato like turning gears and a cotton gin crank, pizzicato strings and muted piano repeating pattern, steady ticking pulse, gradually adds low strings and brass, momentum building relentlessly, darker and heavier as it grows, ominous undertone, no melody hooks, cinematic, space for narrator, instrumental

Embedded Suno title tag says 'Founding' (id 27d1a598…), but it was uploaded as 'Cotton Engine.mp3' and is a different take from g_founding.

- Grip Tighter: Ch03 Fifty Pounds a Day (enters at chapter frame 180 = 6 s) · bed 0.16

### `r_nativism`

1:48 · -12.3 LUFS · Google Lyria (`lyria-3.5`) · made for *Fix Everything*

> A 110-second cue about immigrants and the hostility they met, 1830s-1850s: opens with a sorrowful Irish low whistle and cello lament over sustained strings (famine and emigration), then turns uneasy and ominous with a low pulsing ostinato and dark brass swells (a mob, a burning building), then sly and sardonic with plucked strings (a fake bestseller), ending with a tense, secretive march on muted snare. Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

- Fix Everything: Ch04 Know Nothing (immigration, nativism) · bed 0.15
- King Andrew: Ch09 The Monster (Bank War gap filler; startFrom 1650 f = 55 s, i.e. the second half) · bed 0.12
- The Man Who Couldn't Sit Still: Fallback for Ch05 if newsroom.mp3 missing (skip 50 f) · bed 0.15
- Grip Tighter: Fallback for Ch10 if grip.mp3 missing; copied in as r_nativism but unused · bed —

### `r_abolition_b`

1:49 · -12.3 LUFS · Google Lyria (`lyria-3.5`) · made for *Fix Everything*

> A 110-second cue: defiant and building for a newspaper editor who refuses to back down, 1831: driving low strings and a steady pulse that grow into a powerful, uncompromising theme with timpani hits, then danger and chaos (a mob) with dissonant strings, then a stubborn, resolved ending. Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

- Fix Everything: Ch10 Not Someday, second half (Garrison) · bed 0.14
- King Andrew: Ch08 It Must Be Preserved (music/v3/r_abolition_b.mp3) · bed 0.12
- The Man Who Couldn't Sit Still: Fallback for Ch06 if price.mp3 missing · bed 0.15
- Grip Tighter: Copied in as r_abolition_b, unused · bed —

### `w_sea_battle`

1:16 · -11.3 LUFS · Google Lyria (`lyria-3.5`) · made for *The War Nobody Won*

> A 75-second cue: a heroic, swashbuckling 1812 naval battle for a toy theater: brisk strings, brass fanfares, fife, field drums and timpani like cannon fire, a triumphant cheering ending. Instrumental only, no vocals. Documentary underscore for a classroom history video staged as a 19th-century paper toy theater; leave space in the midrange for a narrator; no drum kit, no synths, no modern pop production.

- The War Nobody Won: Ironsides · bed 0.15
- The War Nobody Won: NewOrleans (until the twist) · bed 0.14
- King Andrew: Ch03 Old Hickory (duck low under the Creek land-grab lines) · bed 0.13

### `w_fire`

1:28 · -11.1 LUFS · Google Lyria (`lyria-3.5`) · made for *The War Nobody Won*

> A 90-second cue: the night the British burned Washington, 1814. Opens urgent and anxious (hurried tremolo strings, a ticking clock pulse), a tender quiet interlude for saving a treasured painting, then dark and heavy as flames rise: low brass, timpani rolls, a descending minor theme. Instrumental only, no vocals. Documentary underscore for a classroom history video staged as a 19th-century paper toy theater; leave space in the midrange for a narrator; no drum kit, no synths, no modern pop production.

Loudest Lyria cue (−11.1 LUFS, true peak +0.8 dBTP).

- The War Nobody Won: WashingtonBurns · bed 0.16
- Grip Tighter: Fallback for Ch09 Southampton; copied in as w_fire, unused · bed —

### `w_dawn`

1:06 · -11.6 LUFS · Google Lyria (`lyria-3.5`) · made for *The War Nobody Won*

> A 65-second cue: night bombardment of a harbour fort, 1814: low rumbling timpani and anxious strings waiting in the dark, then a slow sunrise swell into a warm, noble, hopeful chorale for brass and strings as a flag is revealed still flying. Instrumental only, no vocals. Documentary underscore for a classroom history video staged as a 19th-century paper toy theater; leave space in the midrange for a narrator; no drum kit, no synths, no modern pop production.

- The War Nobody Won: FortMcHenry · bed 0.17
- The War Nobody Won: Legacy (final, from fin−10) · bed 0.16
- Good Luck: Alternate in the folder (backup for the ending) · bed —

### `a_mexico`

1:30 · -15.7 LUFS · Suno (`Suno`) · made for *The Man Who Couldn't Sit Still*

> cinematic underscore for the Mexican Revolution of 1913, nylon-string guitar, deep guitarrón bass, distant lonely trumpet, steady chugging train rhythm on hand percussion, dusty desert expanse, building tension and momentum, respectful and dramatic, not comic, not mariachi party, ends suspended and quiet, space for narrator, instrumental

*Suno take uploaded as 'Mexico (1).mp3'*

Tied to Bierce (Ouija MUSIC.md).

- The Man Who Couldn't Sit Still: Ch08 One Last War · bed 0.15

### `a_mexico_short`

1:05 · -14.7 LUFS · Suno (`Suno`) · made for *The Man Who Couldn't Sit Still*

> cinematic underscore for the Mexican Revolution of 1913, nylon-string guitar, deep guitarrón bass, distant lonely trumpet, steady chugging train rhythm on hand percussion, dusty desert expanse, building tension and momentum, respectful and dramatic, not comic, not mariachi party, ends suspended and quiet, space for narrator, instrumental

*Alternate Suno take of the same prompt (uploaded as 'Mexico.mp3'; different Suno id 7449d32f…)*

- The Man Who Couldn't Sit Still: Not referenced by any chapter · bed —

### `r_ending`

1:01 · -12.0 LUFS · Google Lyria (`lyria-3.5`) · made for *Fix Everything*

> A 60-second closing cue: reflective, warm piano and strings looking back over a story; in the second half it slowly turns dark and tense with low strings and brass, ending on an unresolved chord. Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.

- Fix Everything: Ch11 Why (conclusion) · bed 0.15 rising to 0.2 at the end
- The Man Who Couldn't Sit Still: Ch09 Walking Off the Map (from 'So back') · bed 0.16
- King Andrew: Ch11 Same Man, Two Crowns (music/v3/r_ending.mp3) · bed 0.15
- Grip Tighter: Ch10 Grip Tighter (takes over from grip at 'Then the cotton') · bed 0.12
- Grip Tighter: Fallback for Ch02 (first 50 s) if founding.mp3 missing · bed —
- Good Luck: Ch09 Who Moves It?, last lines (warm first ~30 s only) · bed 0.13
