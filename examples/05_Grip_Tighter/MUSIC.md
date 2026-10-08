# Music: Grip Tighter

Existing cues come first. I searched every branch of every `ethomasclass` repo for music, so everything reused below is already in `video/public/music/` with a source prefix:
- **r_**: Fix Everything (Reform-Era)
- **j_**: King Andrew (Jackson, `claude/jackson-explainer-videos-oseyfs`)
- **w_**: The War Nobody Won (Jackson, `claude/youthful-allen-f14v7e`)
- **a_**: the Bierce video (Ambrose, `claude/15min-history-video-j4wn30`)

Nothing else fits. Colonial-Coffee-House and transportrevshark have game themes and voice clips; FRQPractice has a tanpura drone.

Six chapters had no good existing match. **All six Suno cues are now in** (`public/music/founding.mp3`, `cotton_engine`, `pyramid`, `world_outside`, `southampton`, `grip`), and each replaced its fallback. Placement: ch02 starts 5 s in (the dark cello lands on "Hold that thought"); ch03 starts 6 s in; ch05 runs from the top and fades just before "…one more reason. Fear.", which lands in silence; ch08's swell falls on Harriet Jacobs; ch09's swell runs from the hiding through the hanging, then goes quiet for "Historians still wrestle"; ch10's `grip` starts 13 s in so its closing chord sits under the restated question, then `r_ending` takes over. The new cues are 3–4 dB quieter than the Reform cues, so their beds are 0.14–0.17.

**Levels (from the skill):** beds 0.13–0.17 under narration, with 15–20-frame fades. Cold open 0.17, dipping at the end. Heavy chapters (6–10) get grave cues or near-silence, and near-silence is a choice, not a gap. There is no humor anywhere, so none of the wry or comic cues (`gossip`, `campaign`, `temperance`, `schools`, `good_feelings`) are used.

## Chapter plan

| Ch | Chapter (~length) | Cue | Status | Why it fits |
|---|---|---|---|---|
| 1 | The Proclamation (0:56) | `r_cold_open` (1:16) | **reuse** | A mystery ostinato over the reward notice, with a dark accent at ~28 s ("Between 55 and 60 white people were killed") and a questioning chord under the driving question. It's also the channel's cold-open identity. |
| — | Channel intro + title card | `title_sting` | **reuse** | Channel sting (first ~10 s) |
| 2 | Supposed to Die (0:54) | **new `founding.mp3`** · fallback `r_ending`, first 50 s | **Suno · in** | Needs calm, a little stately, and quietly uncertain: the founders expect slavery to fade. It should turn on "Because that is not what happened." |
| 3 | Fifty Pounds a Day (1:42) | **new `cotton_engine.mp3`** · fallback `j_cold_open` | **Suno · in** | Nothing existing has machine momentum. The cue needs a mechanical ostinato (the gin, the looms) that grows heavier and darker as the cotton belt spreads over Native homelands. |
| 4 | Sold South (1:28) | `r_abolition_a` (1:38) | **reuse** | Solemn and dignified, with a slow heartbeat drum and a tension rise in the middle (the coffles, the ships to New Orleans), then a grieving quiet under Harriett Hill. It was written for the fight against slavery. |
| 5 | The Pyramid (1:40) | **new `pyramid.mp3`** · fallback `j_cold_open` | **Suno · in** | Cold, stately and uneasy: a hierarchy that looks elegant from the top. Its quiet tension should sit under the pies and the "puzzle," then darken on "Fear." |
| 6 | Sunup to Sundown (1:27) | `r_dix` (first ~45 s, before its hopeful rise) → `j_grief` (0:40) | **reuse** | `dix` is "grave, quiet and humane… no melodrama," which suits the field and cabin. `grief` is a solo cello for the Douglass beat and the hand-off into ch07. |
| 7 | No Law Above Him (1:37) | `w_aftermath` (0:59) → **near-silence** for Celia | **reuse** | Low strings, a muffled drum like a heartbeat, a mournful fiddle under Ruffin and the overseers. Let it end before Celia: her story plays over room tone only. |
| 8 | A World Outside Work (1:52) | **new `world_outside.mp3`** · fallback `r_dix` (its hopeful last 15 s, extended) | **Suno · in** | The video's one warm cue: dignity, family, faith and quiet resistance. Nothing existing has this. |
| 9 | Southampton (1:49) | **new `southampton.mp3`** · fallback `w_fire`, with `a_civil_war`'s somber second half for the aftermath | **Suno · in** | Dread and prophecy (visions, the eclipse), violence implied rather than scored as action, then a hollow, grave aftermath. `abolition_b`'s defiant tone is wrong here because the revolt killed children. |
| 10 | Grip Tighter (2:05) | **new `grip.mp3`** (first ~70 s) → `r_ending` (1:01) | **Suno · in** + **reuse** | `grip`: a slow, tightening ostinato for the debate, the vote and the new laws. `r_ending` is reflective, then darkens to an unresolved chord on "tearing apart." |

**Reused:** `r_cold_open`, `title_sting`, `r_abolition_a`, `r_dix`, `j_grief`, `w_aftermath`, `r_ending`. All but `title_sting` (which ships with the template) are copied in; fallbacks (`j_cold_open`, `w_fire`, `a_civil_war`) are copied too.
**Available but not planned:** `r_abolition_b`, `r_nativism`, plus the rest of the Reform, Ambrose, King Andrew and 1812 cues listed in each repo's notes.

---

## Suno prompts

**How to run them** (same as the Bierce video):
- **Mode:** Custom, **Instrumental ON**.
- **Styles:** paste the text as written. **Exclude Styles:** paste the exclude line below.
- **Length:** Suno makes 2+ minute tracks. That's fine; I cut, trim and fade to the narration. Pick the take whose **first 30–40 seconds** already sound like the cue, because I build most of each cue from its opening.
- **Sending them back:** MP3, named as shown (e.g. `cotton_engine.mp3`). Drag them into this chat, or add them to `video/public/music/`.

**Exclude** (same for every cue):
> vocals, choir, lyrics, humming, drum kit, EDM, trap, pop, rock, synth lead, dubstep, rap, gospel vocals, banjo, comedic, upbeat

### 1. `founding.mp3` · ch02 · about 55 s used
**Styles:**
> early American chamber underscore, 1790s, stately and calm, harpsichord and string quartet, slow minuet pulse, gentle and dignified, quietly uncertain harmony underneath, then darkens into a held unresolved low cello note, documentary, restrained, space for narrator, instrumental

### 2. `cotton_engine.mp3` · ch03 · about 1:45 used
**Styles:**
> industrial revolution documentary underscore, mechanical ostinato like turning gears and a cotton gin crank, pizzicato strings and muted piano repeating pattern, steady ticking pulse, gradually adds low strings and brass, momentum building relentlessly, darker and heavier as it grows, ominous undertone, no melody hooks, cinematic, space for narrator, instrumental

### 3. `pyramid.mp3` · ch05 · about 1:40 used
**Styles:**
> antebellum southern parlor elegance turned uneasy, slow stately piano and string quartet, cold and polished, quiet tension underneath, low drone, sparse harp, restrained documentary underscore, in the last third the harmony darkens and a low pulse appears like fear, space for narrator, instrumental

### 4. `world_outside.mp3` · ch08 · about 1:50 used
**Styles:**
> warm dignified documentary underscore, quiet strength and resilience, solo cello melody in the spirit of an old American spiritual, soft sustained strings, gentle piano, slow hymn-like pace, intimate and humane, gradually rises to a restrained hopeful swell, never sentimental, space for narrator, instrumental

### 5. `southampton.mp3` · ch09 · about 1:50 used
**Styles:**
> grave suspense documentary underscore, prophetic and foreboding, low string drones, distant deep drum like a slow heartbeat, sparse eerie high strings like an eclipse, dread slowly rising, a sudden dark swell, then hollow silence and a grieving low cello aftermath, restrained, no action music, no heroics, space for narrator, instrumental

### 6. `grip.mp3` · ch10 · about 70 s used (then `r_ending` takes over)
**Styles:**
> tense political documentary underscore, slow tightening ostinato in low strings, ticking clock pulse, cold and deliberate, sparse piano stabs, each phrase a little heavier and closer, restrained brass swells, ominous and inevitable, ends on a sustained dark chord, space for narrator, instrumental

---

**Credit line for the description:** "Music: original cues generated with Suno and Google Lyria for 15 Minute History."
