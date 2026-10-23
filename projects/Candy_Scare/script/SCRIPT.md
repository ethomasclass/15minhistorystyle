# The Candy Man: The Halloween Poison Scare (Short)

**15 Minute History** · standalone vertical Short (1080×1920) · draft 3 · 162 story words + like/subscribe line · about 58 s, built to loop

**Driving question:** How many kids has a stranger's Halloween candy actually killed?
**Answer:** None that anyone can find. The one real poisoned-candy murder (1974) was a father killing his own son, and the 1982 Tylenol murders turned that story into a national panic.

**Tone:** heavy (a child's death): plain statements, no jokes, no wry asides. The like/subscribe line comes after the payoff, never on it.
**Timing:** posting window closes Oct 31.
**Decided:** 15 Minute History wordmark (top-left, small); the dad's real photo as the coral cut-out; built on the merged style branch (standalone-Short kit, notebook cut-outs).

---

## 0:00 | The Candy Man

`ch01_candy_scare.txt` · 162 story words + the 17-word like/subscribe line · about 58 s with the standalone-Short voice
settings (`VOICE_STRETCH=1.15`, one file, a 0.6–0.9 s beat before "Thanks" via `withBeat()`). Beat times are estimates.

| ~Time | Beat | Narration |
|---|---|---|
| 0:00 | **Hook**: a scene with a person + a death | An 8-year-old eats a Pixy Stix on Halloween night. Within an hour, he's dead. |
| 0:05 | **The claim** (the image everyone remembers) | His dad says it came from a dark house. Just a hand, reaching out the door. |
| 0:10 | **Why it's worth watching + the question** | That hand is a big reason parents still check Halloween candy. So whose hand was it? |
| 0:16 | **But** (stakes up) | Four more Pixy Stix turn up in other kids' bags. All laced with cyanide. And the dark house? The owner was at work. |
| 0:24 | **Twist** | The poisoner was *the dad*. He'd just bought life insurance on his kids. |
| 0:28 | **Therefore** (the loop stays open: the fear) | He was caught. The fear wasn't. In 1982, someone poisoned Tylenol in Chicago. Seven people died. That Halloween, some towns banned trick-or-treating. |
| 0:37 | **Today** | Forty years later, it was rainbow fentanyl: pills that looked like candy. Clinics still X-ray candy. |
| 0:43 | **The question, said out loud → payoff** | So how many kids has a stranger's candy killed? A sociologist has tracked the reports since 1958. Hoaxes. A few pins. *Not one child.* |
| 0:51 | **Reversal = loop** (last line reframes the first) | There was never a hand at the door. Just a dad, walking his kids from house to house. |
| 0:56 | beat, then **end card** | Thanks for watching. If you want more history like this, tap like, and subscribe. They're right there. |

**Loop map** (the story-loops rule: never a stretch with every question closed)

| Loop | Opens | Closes |
|---|---|---|
| The hand: who gave him the candy? | 0:05 (asked out loud at 0:13) | 0:24 "the dad" |
| The fear: is a stranger's candy really dangerous? | 0:10 "parents still check" (said again at 0:28 "The fear wasn't") | 0:50 "Not one child" |
| Rewatch | 0:55 "There was never a hand at the door" | frame 0 (the cover is the same door) |

**Draft history.** Draft 2 restructured for retention (death first, loops, but/therefore, loop ending). Draft 3 added
today (2022 fentanyl warning, candy X-rays; "has tracked the reports since 1958" so "Not one child" covers today) and
moved to the standalone-Short format from the latest style branch (story words to 162, the channel's like/subscribe line
and end card; names and extra dates cut: "Outside Houston, 1974" lives on screen).

---


## Why draft 2 is built this way (story-arc research)

What the research says, and what changed from draft 1 because of it. Most Shorts advice online is from creator-tool blogs; the
points below are the ones several sources agree on, plus YouTube's own statements and this channel's retention data
(`examples/09_Dressed_To_Kill/RETENTION.md`).

1. **The first 1–3 seconds decide the swipe.** YouTube counts whether a viewer *chose to watch or swiped away* (Studio →
   Shorts: "Viewed vs. swiped away") before retention matters at all. A specific, concrete hook beats a vague one ("This is
   a strange case" fails).
   → Draft 1 opened on the dad holding candy; the stakes (a dead child) arrived at 0:05. **Draft 2 puts the death in the
   first sentence**, and the image of the hand and the Pixy Stix is on screen from frame 0.
2. **Make it about the viewer early.** A hook works best when it touches something the viewer has lived.
   → New line at 0:10: "That hand is a big reason parents still check Halloween candy." Almost everyone watching had
   their candy checked.
3. **Open loops, stacked so one opens before the last closes.** Viewers leave right after a question is answered unless
   another is already open. Draft 1 answered "who did it?" at 0:15 and then wandered into 1982 with no question pending,
   the classic mid-Short drop.
   → **Loop 1** ("So whose hand was it?") is asked out loud at 0:13 and closed at 0:24. **Loop 2** opens in the very next
   breath ("He was caught. The fear wasn't.") and is closed by the number at 0:46.
4. **"But / therefore," never "and then."** Each beat should turn the one before it (a screenwriting rule from the *South
   Park* writers that story Shorts use heavily). Draft 2's beats: dad blames a stranger → *but* four more poisoned
   sticks, and the stranger was at work → *therefore* the dad → *but* the fear outlives him → *therefore* 1982 → *so*
   how many really? → zero.
5. **Something new every 5–8 seconds.** Each beat in the table above adds a fact, a number or a turn; no sentence just
   restates.
6. **End on the reveal, then loop.** Goodbye endings, "follow for more," a final music note or a frozen last frame tell
   viewers it's over. A loop works when the **last line reframes the first** (a narrative loop) and the **last frame
   matches the first** (a visual loop). Test: play the last 3 s straight into the first 3 s.
   → The last line ("There was never a hand at the door. Just a dad, walking his kids...") flows straight into "An
   8-year-old eats a Pixy Stix on Halloween night." A rewatch now hears the opening knowing who the dad is. The last frame
   is the opening's dark door; the music bed runs through the cut instead of resolving.
7. **Length: one story, 140–160 words, under a minute.** Story Shorts that run 45–55 s are normal; loops work better the
   shorter they are. Draft 2 is 162 words (about 52 s). The trim list below takes it to about 45 s.
8. **Pay off the promise exactly.** The question asked at 0:39 is answered in the same words the viewer has been waiting
   for ("Not one child.") with the number on screen.

### Draft 1 → draft 2

| Draft 1 | Draft 2 | Why |
|---|---|---|
| Opened on the dad and the Pixy Stix; the death at 0:05 | The death in the first sentence | Swipe decision happens in 1–3 s (point 1) |
| No line about the viewer | "That hand is a big reason parents still check Halloween candy." | Relevance (point 2) |
| No question until 0:39 | "So whose hand was it?" at 0:13 | Open loop 1 (point 3) |
| "But people remembered the stranger." | "He was caught. The fear wasn't." | Re-hook right after the twist (points 3, 4) |
| "And there was no hand." (told) | "And the man at the dark house? He was at work." (shown) | A new fact instead of a statement |
| Ended on a closing line + 3 s end card | Ends on the line that loops back to frame 0 | Loop (point 6) |
| 160 words | 162 words | Same length, tighter turns |

## If the voice runs over 59 s

| Cut | Words |
|---|---|
| "All laced with cyanide." (the Loupe says it on screen) | −4 |
| "He was caught." (keep "The fear wasn't.") | −3 |
| "A sociologist has tracked the reports since 1958." → "One study has tracked them since 1958." | −2 |

## Visual plan (draft 3)

Follows the newest house rules (style branch `ccr-76f2028e-9z2soe`: `references/shorts.md` checklist, *The Balloon War*
cut-outs rule) plus the Vox-study pieces. **House rules this plan keeps:** every photo is a cut-out on the dark ruled
notebook (`Cut`) or a cream card on the desk (`Desk`); no full-screen photo pushes, no 3D photo fly-throughs, no
silhouettes, everything black and white (the rainbow pills too, with coral as the one colour). Nothing to read in the
first 15 s. A new picture every 3–5 s. Safe zone x 60–930, y 150–1150; captions at y ~1185; tags at y ~1490.

### The big idea: door to door

The Short is a trick-or-treat route. A **street of front doors in CSS 3D**, built like the *Mummies* Short 6 gallery corridor
(`short6.tsx`: CSS 3D planes, not a photo), drawn in teal line on the dark paper with porch lights. Each beat, the camera glides
to the next door and the door opens on that beat's evidence. Walking "from house to house" is literally the last line, so
the device pays off the ending, and it's a running device ("what's behind the next door?") that keeps people swiping *in*
rather than away.

The first door is the **hand at the door**: the door open a crack, a drawn hand holding out a Pixy Stix (coral). It comes back
as a **match cut** each time the fear returns, with a new thing in the same hand (*Ouija*'s "same frame, different hands"):

| Door | When | What's in the hand |
|---|---|---|
| 1 | 0:00 · 0:10 | a giant Pixy Stix |
| 1 | 0:28 "The fear wasn't" | a Tylenol capsule |
| 1 | 0:37 "Forty years later" | a rainbow pill |
| 1 | 0:51 "never a hand at the door" | nothing: the hand pulls back and the door swings open on an empty hall |

### Beat by beat

| ~Time | Picture | Kit (from) |
|---|---|---|
| 0:00 | **Cover frame, fully drawn on frame 0:** door 1 with the hand and coral Pixy Stix, big type **WHO POISONED THE HALLOWEEN CANDY?** (Abril, 130 px). Topic strip **THE HALLOWEEN CANDY SCARE** stays up all the way through. Wordmark top-left. | `cover.tsx`, `TopicStrip`, `Mark` (`vshort.tsx`) |
| 0:02 | "Within an hour": a soft porch-light flicker, the music falls away under "he's dead". | music drop (*Dressed to Kill*) |
| 0:05 | The hand reaches a little further out; the stick gets a teal `Loop`. | `Loop` |
| 0:13 | "So whose hand was it?" A teal **?** handwritten beside the hand. | `Note` |
| 0:16 | Camera glides down the street; **door 2** opens on four trick-or-treat bags (drawn), a real **Pixy Stix** cut-out dropping into each. Four teal checks: "uneaten". | street, `Cut`, `Note` |
| 0:19 | **Look closer** on "cyanide": a teal ring zooms 3× on the stick's stapled top: "refilled · stapled shut". (Past 15 s, so a short label is fine.) | `Loupe` (Vox study §6.4) |
| 0:21 | Back to door 1; the hand gets an orange strike-through; teal note "owner at work · 200+ witnesses". | `StrikeLine` |
| 0:24 | **"the dad"**: door 3 opens and the dad's **cut-out** rises from below, coral, teal trace (his real photo, approved; fair use, credited in the source tag). The bed drops 4–6 frames before "the dad". | `Cut` (template `desk.tsx`), music drop |
| 0:26 | A policy card drops on the desk; three stamps: **$10,000 JAN · $20,000 SEPT · $20,000 OCT** (per child). | `Desk`, `Stamp` |
| 0:28 | "The fear wasn't." **Match cut** to door 1: the hand now holds a **capsule**. | motif |
| 0:31 | A small drawn map with one pin on Chicago, an orange **7**. | `Stamp`, map pin |
| 0:34 | A 1982 clipping about cancelled trick-or-treating as a desk card; a coral highlighter sweeps along the headline as it's read. | `Desk` + `DocMark swipe` (*Dressed to Kill*) |
| 0:37 | **Match cut** to door 1: the hand holds a **rainbow pill**. Stacked tape **1982 / 2022**. | motif, then/now |
| 0:39 | The DEA's 2022 warning (public-domain U.S. government page) as a card; its line about brightly colored fentanyl lifts off the page. Beside it, the DEA's photo of the pills as a cut-out, B&W with the pills in coral. | `DocLift` (Vox study §6.3), `Cut` |
| 0:41 | **The X-ray:** door 4 opens on a drawn candy bag; a teal scan line sweeps down and turns it into an X-ray negative behind the line. Just candy inside. A faint beep. | `Wipe` (Vox study §5), small new build |
| 0:43 | **The counter that won't move.** Years flip 1958 → 2026 across the top; grey tags pop in ("hoax", "pin", "hoax"); below, **KIDS KILLED BY A STRANGER'S CANDY** stays at **0**. | `Counter` (`vshort.tsx`), `Note` |
| 0:50 | "Not one child." Orange **0** stamped; the picture holds with nothing new. | `Stamp`, held anchor (Vox study §5) |
| 0:51 | Door 1 one last time: the hand pulls back, the door swings open on an empty hall. The camera turns to the street: a drawn teal dad walking two drawn kids from porch to porch (drawn, not his photo, so it never reads as a record of that night). | street |
| 0:55 | The camera settles back on door 1, on the exact cover framing (the loop frame). | loop |
| 0:56 | Beat, then the **end card** with arrows to YouTube's like and Subscribe buttons. | `EndCard` (`vshort.tsx`) |

**Images.** Real, used as cut-outs or cards: a Pixy Stix product photo (B&W), the DEA warning page and pill photo (U.S.
government, public domain), a 1982 clipping crop, and the dad's photo (approved by you; fair use). Everything else is drawn in
teal on the notebook: the street and doors, the hand, the bags, the policy, the map pin, the X-ray, the counter. **No AI
images needed.**

**Sound.** Calm, curious bed (per *The Balloon War* note: felt piano or pizzicato, nothing military) from `music/`, its
ending accent timed to "Not one child"; a door creak at 0:00 and 0:51; footsteps on the street glides; the music drop before
"the dad"; a stamp on the **0**; a whoosh per cut.

**Post.** Title under 60 characters, a claim or a question ("The Only Real Poisoned Halloween Candy Case"); the description's
first line repeats the hook; three hashtags; pinned comment, a question anyone can answer ("Did your parents check your
candy?"); "Related video": *Dressed to Kill*; altered content: Yes; not made for kids.

## Pronunciation (for ElevenLabs)

| Word | Say it |
|---|---|
| Pixy Stix | Pixie Sticks |
| cyanide | sigh-uh-nide (the voice usually gets it) |
| Tylenol | Tie-luh-nol |

## Fact-check flags

| Script says | Record | Why the wording is safe |
|---|---|---|
| "Just a hand, reaching out the door." | O'Bryan told police a person cracked the door of a dark house and handed him five Pixy Stix; he saw only a "hairy" arm. The sticks were 21 inches long, refilled with potassium cyanide and resealed with staples. | His own story, told as his story ("His dad says"). |
| "An 8-year-old eats a Pixy Stix on Halloween night. Within an hour, he's dead." | Timothy O'Bryan, 8, died on the way to the hospital less than an hour after eating it, Oct 31, 1974. | Matches. |
| "OUTSIDE HOUSTON · 1974" (on screen only) | The family lived in Deer Park; they trick-or-treated in Pasadena, Texas. Sources split on which town to name. | Both are Houston suburbs, so "outside Houston" is true either way. |
| "Four more Pixy Stix turn up in other kids' bags. All laced with cyanide." | He gave the other four to his daughter (about 5) and three other children; all four were recovered uneaten (one boy fell asleep holding his, unable to open the staples). | Matches. |
| "And the dark house? The owner was at work." | The homeowner, Courtney Melvin, was ruled out: more than 200 people confirmed he was at work at Hobby Airport that night. | Matches. |
| "He'd just bought life insurance on his kids." | $10,000 each in Jan 1974, $20,000 each about a month before, and more in the days before Halloween. He was about $100,000 in debt. | "Just" fits the last policies; the card shows the build-up. |
| (not in narration) | Convicted of capital murder June 3, 1975; executed by lethal injection March 31, 1984 (TDCJ lists March 30: the execution began that night and he died just after midnight), at Huntsville. Often misreported as executed on Halloween. | Kept out of the Short for time; worth a pinned comment. |
| "In 1982, someone poisoned Tylenol in Chicago. Seven people died." | Seven deaths in the Chicago area, late Sept to early Oct 1982. No one was ever charged with the murders. | Matches; "someone" because it's unsolved. |
| "That hand is a big reason parents still check Halloween candy." | Fears of tainted treats began in the late 1960s, before this case; the 1974 case is the one real death the warnings point to, and 1982 made the checks routine. | "A big reason," not "the reason." |
| "some towns banned trick-or-treating" | Vineland, NJ cancelled it outright; suburbs in OH, PA, IL and MA followed; candy sales fell 20–50% in many stores. | "Some towns." AP on Oct 28, 1982 (*The Hour*, Norwalk, p. 2) counted "at least 40 cities" that banned traditional trick-or-treating, Vineland, N.J. among them; a 1983 Senate hearing: "numerous communities felt compelled to cancel their own Halloween activities." Candy-sales figures differ (Mental Floss: 20–50% in many stores; *Christian Science Monitor*, Oct 1983: "generally off 10 to 25 percent"), so the narration gives no number. |
| "Forty years later, it was rainbow fentanyl: pills that looked like candy." | On Aug 30, 2022 the DEA warned of brightly colored fentanyl pills ("rainbow fentanyl") that it said were made to appeal to young people. The DEA did not mention Halloween; the Halloween warnings followed that fall. Drug experts and Best said there was no evidence of a Halloween threat, and none turned up. | "Pills that looked like candy" is the DEA's own description; the script doesn't say the warning was right or wrong, and "Not one child" covers it. 1982 → 2022 is exactly 40 years. |
| "Clinics still X-ray candy." | Urgent-care chains and ERs in several states run free candy X-ray nights each Halloween (Patient First in the Mid-Atlantic; ERs in Central Texas). X-rays find metal, not drugs. | "Clinics" (no company named); "offer." Re-check before posting that it's still running this year. |
| "A sociologist has tracked the reports since 1958. Hoaxes. A few pins. Not one child." | Joel Best (with Gerald Horiuchi, 1985) searched coverage 1958–1983 and has kept tracking it every year since (2022 and 2023 interviews: still no case): 76 reported incidents, a handful of minor injuries, many hoaxes, no child killed or seriously hurt by a treat from trick-or-treating. Best still says so (2023). The O'Bryan death is the one exception, and it wasn't a stranger. | Named as "a sociologist" (no scholar names on screen); "not one child killed" is his finding about strangers' treats, framed by the question. |

## Sources

- [Ronald Clark O'Bryan](https://en.wikipedia.org/wiki/Ronald_Clark_O%27Bryan), Wikipedia (trial and insurance details)
- [Snopes: Poisoned Halloween candy](https://snopes.com/horrors/poison/halloween.asp) (execution date)
- [Mental Floss: How a person who poisoned bottles of Tylenol almost killed Halloween](https://mentalfloss.com/article/87981/how-person-who-poisoned-bottles-tylenol-almost-killed-halloween)
- [Chicago History Museum: the Tylenol murders](https://www.chicagohistory.org/tylenol-murders/)
- [Best & Horiuchi, "The Razor Blade in the Apple," *Social Problems* 1985](https://www.gwern.net/doc/sociology/1985-best.pdf)
- [Joel Best, "My Seasonal Job," University of Delaware Research](https://www1.udel.edu/researchmagazine/issue/vol4_no1/my_seasonal_job.html)
- [NPR/WNYC 2023: Why the urban legend of contaminated Halloween candy won't disappear](https://wnyc.org/story/why-the-urban-legend-of-contaminated-halloween-candy-wont-disappear/)

- [NPR: Unfounded fears about rainbow fentanyl become the latest Halloween boogeyman (2022)](https://www.npr.org/2022/10/31/1132737831/rainbow-fentanyl-halloween-candy)
- [Today: Rainbow fentanyl is the latest Halloween candy scare (2022)](https://www.today.com/today/amp/rcna51880)
- [Axios: Halloween candy doesn't need to be X-rayed (2023)](https://www.axios.com/local/tampa-bay/2023/10/29/halloween-candy-safe-danger-avoid)
- [KXXV: Central Texas ERs X-raying Halloween candy](https://www.kxxv.com/hometown/bell-county/ctx-emergency-rooms-x-raying-halloween-candy-for-sharp-objects)

**Story-arc and Shorts retention research** (mostly practitioner blogs; used where several agree)

- [TechCrunch: YouTube demystifies the Shorts algorithm](https://techcrunch.com/2023/08/25/youtube-demystifies-the-shorts-algorithm-views-and-answers-other-creator-questions/) (Shorts product lead: audience over algorithm; seed-audience testing)
- [vidIQ: How the YouTube Shorts algorithm works](https://vidiq.com/blog/post/youtube-shorts-algorithm/)
- [Shortimize: Shorts retention rate](https://www.shortimize.com/blog/youtube-shorts-retention-rate) and [How to analyze Shorts performance](https://www.shortimize.com/blog/how-to-analyze-youtube-shorts-performance) (viewed vs. swiped away)
- [Virvid: Looping structure in Shorts](https://virvid.ai/blog/looping-structure-shorts-retention-2026) and [The first 3 seconds](https://virvid.ai/blog/first-3-seconds-hook-faceless-shorts-2026)
- [Prepublish: Shorts retention](https://prepublish.ai/guides/youtube-shorts-retention) and [6 narrative structures](https://prepublish.ai/guides/youtube-storytelling-narrative-structures) (story Shorts loop poorly unless the ending reframes the start)
- [Fluxnote: True crime Shorts](https://fluxnote.io/guides/how-to-make-true-crime-youtube-shorts) (three acts in 60 s, 140–160 words)
- [ContentStudio: Shorts analytics](https://contentstudio.io/blog/youtube-shorts-analytics-guide) ("stayed to watch" vs. swiped)
- This channel's own data: `examples/09_Dressed_To_Kill/RETENTION.md`
