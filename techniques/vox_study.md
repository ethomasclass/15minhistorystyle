# What Vox does well, and what 15 Minute History should borrow

A study of Vox's explainer videos (the main channel, Darkroom, Borders, Atlas, Earworm, Almanac/Overrated) and two
alumni (Johnny Harris, Phil Edwards). It asks one question: **which of their habits would make this channel's videos
easier to follow, without making them look or sound like Vox?**

**This is not a restyle.** The channel keeps its own identity: black-and-white archive on a dark desk, one coral
subject with a teal trace, orange torn-tape titles, teal handwriting, 12 fps marks, hard cuts, grain, the wry voice,
and every standing rule in `videos/README.md`. Where Vox and those rules disagree, the rules win. Each item below is
written as **what Vox does well → the channel's own version (or skip)**.

The short, loadable version of this study is the skill reference
[`explainer-craft.md`](../.claude/skills/15-minute-history/references/explainer-craft.md).

**Evidence labels used throughout**

| Label | Meaning |
|---|---|
| **[D]** | Documented: Vox staff or alumni say it themselves (interview, talk, their own video description) |
| **[T]** | Transcript: what the narration of a real Vox video does (captions pulled from YouTube, read by me) |
| **[3P]** | Third-party: a tutorial, analysis or trade article about the Vox look, not Vox's own account |
| **[I]** | My inference: a pattern I'm drawing, or a proposal for this channel |

## Contents
1. Sources
2. What Vox's own people say about the craft [D]
3. The scripts, read closely [T]
4. Script checklist for this channel (14 rules, before/after)
5. Visual techniques: Vox → the channel's version (or skip)
6. Upgrade ranking, and build sketches for the top 5
7. *Dressed to Kill* (the arsenic-green video): concrete proposals
8. What we deliberately don't adopt
9. Gaps and things I couldn't verify

---

## 1. Sources

**Interviews and trade coverage (staff in their own words)**
- S1. "Videogram: How a Vox Video Explains the Science behind the First Photo of a Black Hole" (Joss Fong, interviewed by Tiên Nguyễn), *The Open Notebook*, Jan 7 2020 — https://www.theopennotebook.com/2020/01/07/videogram-how-a-vox-video-explains-the-science-behind-the-first-photo-of-a-black-hole/
- S2. "How Vox uses animation to make complicated topics digestible for everyone" (art director Joey Sendaydiego), *Storybench* — https://www.storybench.org/how-vox-uses-animation-to-make-complicated-topics-digestible-for-everyone/
- S3. "Vox Atlas: Producer Sam Ellis on his distinctive map animations," *Storybench*, Nov 1 2022 — https://www.storybench.org/vox-atlas-producer-sam-ellis-on-his-map-animations/
- S4. "Behind the scenes of the Vox web series 'Borders'" (Johnny Harris), *Storybench*, Mar 11 2020 — https://www.storybench.org/behind-the-scenes-of-the-vox-web-series-borders/
- S5. "Explainer: an interview with Vox pop video essayist Estelle Caswell," *Film Independent* — https://www.filmindependent.org/blog/explainer-an-interview-with-vox-pop-video-essayist-estelle-caswell/
- S6. Andrew Kersley, "How Vox became world's top news publisher on YouTube," *Press Gazette*, Jul 14 2022 (Mona Lalwani; Johnny Harris paraphrased) — https://pressgazette.co.uk/vox-youtube/
- S7. "Why the best journalists on YouTube are all former Vox employees," *The Long Story* (Substack) (Fong, Posner, Edwards, Harris) — https://thelongstory.substack.com/p/why-the-best-journalists-on-youtube
- S8. "Learning for a Living: Howtown's Joss Fong…," *Storybench* — https://www.storybench.org/learning-for-a-living-howtowns-joss-fong-is-on-a-mission-to-reinvent-science-explainer-videos/
- S9. Joe Posner, *In Sync* / Video Consortium, ep. 10 — https://videoconsortium.org/mag/episode-10-joe-posner
- S10. Laura Hazard Owen, "Inspired by 'independent YouTubers,' wary of cable, Vox.com takes its explainer mission to video," *Nieman Lab*, Apr 2016 — https://www.niemanlab.org/2016/04/inspired-by-independent-youtubers-wary-of-cable-vox-com-takes-its-explainer-mission-to-video/ (site blocked my fetch; claims taken from search excerpts, so treat as secondhand)
- S11. ONA Student Newsroom, "A good explainer video, explained" (ONA19 session incl. Vox managing producer Valerie Lipinski), Sep 13 2019 — https://newsroom.journalists.org/2019/09/13/a-good-explainer-video-explained/
- S12. Michelle Balmeo, "Video explainers engage readers," JEA, Mar 14 2016 (a Vox producer's tip, secondhand) — https://jea.org/digital-media/video-explainers-engage-readers/
- S13. David Perell, *How I Write*: "Johnny Harris Reveals How He Writes YouTube Videos," Mar 2025 — https://www.youtube.com/watch?v=zq4b96m1AvM (chapter list read; see §9)

**Vox videos read from their captions [T]** (all on Vox's YouTube channel)
- V1. "How the Hindenburg killed an entire industry" (Darkroom), 2019 — https://www.youtube.com/watch?v=g9bkQ7OiEdQ
- V2. "Where Manhattan's grid plan came from" (Phil Edwards, Almanac: Road Trip), 2019 — https://www.youtube.com/watch?v=QaIOfgz8FVY
- V3. "The first faked photograph" (Darkroom), 2019 — https://www.youtube.com/watch?v=SXe9WCeccOw
- V4. "These photos ended child labor in the US" (Darkroom), 2019 — https://www.youtube.com/watch?v=ddiOJLuu2mo
- V5. "The white lie we've been told about Roman statues" (a pigment story), 2019 — https://www.youtube.com/watch?v=4jmMWohs1XM
- V6. "The facial prosthetics of World War I," 2018 — https://www.youtube.com/watch?v=BJzjt_aFc00
- V7. "How American Gothic became an icon" (Phil Edwards, Overrated), 2017 — https://www.youtube.com/watch?v=Lf3ER5Ope_s
- V8. "Why danger symbols can't last forever" (with 99% Invisible), 2018 — https://www.youtube.com/watch?v=lOEqzt36JEM
- V9. "Flint's water crisis, explained in 3 minutes" (Joe Posner; lead poisoning), 2016 — https://www.youtube.com/watch?v=NUSiLOwkrIw
- V10. "How did pink become a girly color?" (color history, expert-led), 2015 — https://www.youtube.com/watch?v=KaGSYGhUkvM

**Third-party analyses and tutorials [3P]**
- P1. PremiumBeat, "Replicating Vox motion graphics" — https://www.premiumbeat.com/blog/replicating-vox-motion-graphic/
- P2. WeVideo, "Animated textures" — https://www.wevideo.com/blog/animated-textures
- P3. Kapwing, "How to make informational videos like Vox" — https://kapwing.com/resources/how-to-make-informational-videos-like-vox
- P4. No Film School, "How to create Vox-style map animations in After Effects" — https://nofilmschool.com/how-create-vox-style-map-animations-after-effects
- P5. aescripts, "How Johnny Harris makes maps" (GEOlayers) — https://aescripts.com/learn/how-johnny-harris-makes-maps/
- P6. Video Production Stack Exchange thread on the Vox marker/highlighter effect (Turbulent Displace edges) — https://avp.stackexchange.com/q/36982 (seen via a search-result mirror; not opened directly)

---

## 2. What Vox's own people say about the craft [D]

| Claim | Who | Source | What it means for this channel |
|---|---|---|---|
| Voice-over can't "afford to be too clever or beautiful"; viewers are taking in sound and pictures at once | Joss Fong | S1 | Matches the channel's plain voice. Keep it. |
| "there's a really high risk of charging forward and not realizing that the viewer is not with you"; a good script editor says "I was confused at this part" | Fong | S1 | Add a **confusion pass** to the review loop (rule 14). |
| "You always want something very fast-paced at the very top" | Fong | S1 | Cold open: no backstory before the question. |
| She held the black-hole photo back ("I didn't want the photo to be the first thing that people see") and built up how hard it was first | Fong | S1 | Sometimes delay the reveal so it lands (rule 1 variant). |
| Music changes roughly every 20 s as a cue; she paused on the reveal with a reflective musical moment | Fong | S1 | Borrow only the **music drop on the reveal**; keep one bed per chapter. |
| Abstract scale needs a picture (Google Earth Studio for an "Earth-sized telescope") | Fong | S1 | Maps for "where", charts for "how much". Period maps only. |
| "the whole point of video is that you're talking about the thing onscreen"; the editor "holds me accountable to making sure the story is visual" | Estelle Caswell | S5 | Narration should **point** at the picture (rule 3). |
| Pitch "three ideas that all have headlines" | Caswell | S5 | Driving question = the headline; write it first. |
| Choose a headline early to guide the story; "start by looking for the unexplained" | Valerie Lipinski / ONA19 panel (paraphrase) | S11 | Same. |
| Explain it to a friend first, "starting with the word 'so'" | a Vox producer (secondhand) | S12 | Draft the driving question and answer as two "So…" sentences before the outline. |
| Only tell a story in video if it has "elements that were distinctly visual"; b-roll and stock over narration doesn't count | Joe Posner | S7 | Every beat needs a real picture, document, map or drawn diagram. The channel already works this way. |
| Early rule: no desks; steered the team away from interviews | Posner | S10 (secondhand) | Supports the channel's no-talking-heads stance. ("Desk" here means a TV anchor desk, not a prop desk.) |
| A strong story can't be saved by visual polish | Posner | S9 | Script first; the channel already locks the script before scenes. |
| Find one unique visual and "hold on to [it as] my anchor for the rest of the video"; "that could be a repeating motif" | Joey Sendaydiego | S2 | A recurring object per video (Black Sox ledger, Ember). For arsenic green: the **swatch** (§7). |
| "You don't want it to look perfect because that might make it look more like an ad than an editorial piece" | Sendaydiego | S2 | Keep the hand-drawn wobble and open loops. |
| Don't make serious topics pretty: "producing stuff just because it's beautiful" is a trap | Sendaydiego | S2 | Matches the `quiet` heavy-chapter rule. |
| Looks are chosen per topic (construction paper for schools, protest-poster style for Fred Hampton) | Sendaydiego | S2 | The channel varies inside one look (Ouija paintings, Black Sox ledger), not between looks. Keep that. |
| "Toggling between a map and what's happening on the ground seems to really help people understand"; maps traced "using old books" | Sam Ellis | S3 | Cut map → archive photo → map. Period maps are the channel's version. |
| "We do the story first… I tend to do more of a story arc, with a beginning, middle, and end" | Ellis | S3 | Same. |
| "visual anchors": "I don't have to say it. I can just show that." | Johnny Harris | S4 | Let a picture carry a beat with no narration over it (a held 1–2 s). |
| Vox style = balancing visual evidence and explanation: frequent first-hand visual anchors, then a quick, concise explanation (paraphrase) | Harris via S6 | S6 | **Show, then explain**, in that order (rule 1, rule 3). |
| Aim to "over-deliver" context; a "memorability factor"; medium length (5–15 min) is their sweet spot | Mona Lalwani | S6 | Fits the channel's 10–15 min length and fact-check flags. |
| Fong and Adam Cole appear in each other's videos as "a proxy for the audience" asking "I was confused about this" | Fong (Howtown) | S8 | The channel's version: the narrator asks the viewer's question out loud ("Why didn't anyone stop it?"). No second voice. |
| Graphics rendered at 12 fps inside a 24 fps edit for a stutter with "personality" | PremiumBeat [3P] | P1 | The channel already does this (12 fps marks on 30 fps). |
| Textures cycled behind still images for subtle movement; paper/halftone/clipping collage; elements "slide, drop, or snap into position" | [3P] | P1, P2, P3 | The channel already has grain, desk paper, cards that pop and drop. No change. |

---

## 3. The scripts, read closely [T]

Ten Vox videos, read from their captions. Quotes are kept to short phrases.

### 3.1 Openings (first 20–30 s)

- **"This is…" on the artifact, in the first line.** "This is the airship Hindenburg…" (V1); "This is the first staged photo." (V3); "this is Caesar Augustus" (V5); "Sadie Pfeifer was 9 years old when this photo was taken." (V4). The channel's rule "open on a real document or artifact" is the same move. **Already aligned.**
- **"Look again."** The first look is ordinary; then one detail changes it. "At first, this looks like a perfectly normal map… But then you realize that the map is… wrong." (V2). "At first, these World War I era photos look unextraordinary… But look at the glasses." (V6). "he's not supposed to look like this. He's supposed to look like this" (V5). **This is the strongest opening device in the sample, and the channel doesn't use it on purpose yet.** [I]
- **A stake in one line, before any history.** "And all it took was a spark to bring the whole thing down." (V1). "And doomed to obscurity." (V3).
- **The promise is bigger than the object.** "It says something about how — and why — all cities develop the way they do." (V2). "This isn't just about the color pink…" (V10, at the end). The question is about the thing; the promise is about what the thing reveals. [I]
- **The question, when it's asked, is one breath.** "How could this possibly happen in 2016? You've got to rewind back to 2011." (V9). "That's the big question. How did a third place, $300 painting… turn into an icon?" (V7, asked after a 3-minute setup, which is late for this channel).

### 3.2 Signposting and structure

- **"That's where X comes in."** New characters and mechanisms enter exactly when the story needs them: "That's where the sculptors came in." (V6); "And that's where Francois Arago steps in." (V3); "And that is where this failed plan comes in" (V2); "Which brings us to a very important element in this story – hydrogen." (V1). Nothing is front-loaded. [T]
- **Stack, then "That means."** V1 lists the conditions (late, leaking, charged air) and then sums them in one sentence: "That means they were trying to quickly land an enormous hydrogen-filled airship, in electrically charged conditions, that was likely leaking flammable gas." Then the payoff. A recap right before the climax so nobody arrives lost. [T]
- **Ordinals for a list.** V8's six design criteria: "First… It also had to… On top of that… And lastly…", and each criterion **rules something out** ("That ruled out simple shapes…"). [T]
- **One example carries the whole explanation.** V4 opens on Sadie, widens to 1.75 million children, then says "Let's use the photos of cotton mill workers like Sadie as an example" and explains Hine's technique on her photo, and ends on Hine's line about "a tiny spinner in a Carolina cotton mill." Concrete → general → mechanism → consequence → back to the concrete. V6 does the same: the glasses → the artillery chart (cause) → 20,000 facial injuries → the sculptors → what it meant. [T]
- **Restate the question, then answer in one line.** "Why did Flint poison its citizenry? Under emergency managers from the state, it wanted to save money." (V9). [T] The channel's "So let's go back to the question" is the same.
- **Callbacks by name.** "remember Augustus" (V5). The channel already does this ("Remember that kid.").

### 3.3 Explaining a mechanism

- **Just-in-time and short.** V1 explains hydrogen in three sentences at the moment it matters: lighter than air, highly flammable but cheap, unlike "its safer, non-flammable cousin, helium", and the US embargoed helium. Then straight back to the story. [T]
- **Define by contrast with a second picture.** V4 explains shallow depth of field ("basically means a narrow part of the photo is in focus") and then shows a Jacob Riis photo for the opposite. [T]
- **Appositive definitions.** "a camera obscura, which is essentially a dark room with a tiny hole in it" (V3). The channel already does this ("a tariff, a tax on imported goods").
- **Show how we know.** V5 spends a section on the method: surviving descriptions, traces of paint, then UV light ("certain pigments glow under UV light"). V9 names the test that proved it (outside researchers found elevated lead). The method makes the claim believable. [T]
- **Name the misconception, then correct it, without shaming.** "We're wrong but it's not our fault" (V5); "The Hindenburg wasn't the first or even the deadliest passenger airship disaster." (V1). The channel already names myths. [T]

### 3.4 Numbers made tangible

- **Size by comparison:** "Imagine something the size of an ocean liner, but in the air." (V1)
- **A pair, small then big:** "At Gettysburg, 32,000 rounds were fired. At Somme, in 1916: 4,000,000." (V6)
- **Count plus ratio:** "1.75 million children under the age of 16, more than one in five" (V4)
- **Turn a toll around:** "about two-thirds of the people inside… actually escaped" (V1), which sets up the point that the numbers didn't matter.
- **Narrate the chart and tell the eye where to go:** "This chart shows all the jobs. The big one to notice is agriculture… Now let's go to 1920." (V7) [T]

### 3.5 Primary sources and experts

- **Period voices do the heavy lifting.** V1's climax is Herbert Morrison's radio call; V3 reads Bayard's own caption; V4 quotes Hine's 1909 speech twice (middle and end); V2 reads the 1811 commissioners' report and then translates it ("Basically, did they want L'enfant's Washington or a uniform grid?"). [T]
- **Experts, when used, are short clips or audio, never a sit-down segment.** V9 cuts in a researcher for one line; V8 uses Benford in two short audio quotes; V10 is the exception (built around one author). Their names are on screen. [T] **This is the part the channel does not adopt** (no historian names). The channel's version: the period document is the expert, and "historians still argue" covers disagreement.

### 3.6 Sentence-level habits

- **Short and declarative**, with fragments: "Hippolyte Bayard was an artist. A gardener. A collector. And an experimenter." (V3). Same as the channel.
- **Deictic words tie the line to the frame**: "this 1767 map shows…", "This 1776 map…", "This 1789 map shows what happened to their planned square. It disappeared." (V2). Count of "this/these/look/notice" in V2's first 90 s: about a dozen. [T] The channel's scripts use them less. [I]
- **Second person to put the viewer in the scene**: "You zoom in and there's Broadway" (V2); "You probably know how this symbol is supposed to make you feel." (V8).
- **Dry asides**: "Also windmills. He loved windmills." / "And as a response, Bayard killed himself. Well, metaphorically." (V3); "(Delaney was a typo)" (V2). Vox's wry register is close to the channel's. [T]
- **The key term never changes name.** V1 says "hydrogen" every time; V4 says "photo stories"; V8 "meaningfulness score". [T] For arsenic green this matters a lot (§7).
- **Rhetorical questions in the viewer's voice**, then answered at once: "The city's response?" (V9); "The real reason…?" (V2). [T]

### 3.7 Endings

- **A short reversal that answers the title.** "It was just the one that was caught on film — and that's why it was the last." (V1). "City plans reflect values. And then they shape culture." (V2). "…a photograph doesn't always show the truth." (V3). [T]
- **Back to the opening image.** V4 ends on Hine's line about the spinner, which is Sadie. V6 ends on the two faces of Ladd's memorial, "night" and "dawn". [T]
- **The closing line is one short sentence, often with a turn.** The channel's endings already have this shape ("King." / "It's who's watching when they do.") and the outline's "The green never changed. What changed was who had to prove it was safe." is a textbook Vox reversal. **Already aligned.**

---

## 4. Script checklist for this channel

Fourteen rules. Each is "what Vox does well → the channel's version". Examples are written in the channel's voice,
mostly from the arsenic-green video so they can be used directly. Rules marked ✱ are new to the channel; the rest
sharpen something it already does.

**1. ✱ Open on the artifact, then make the viewer look again** (V2, V5, V6). Describe what anyone would see; then
the one detail that changes it. Inside 20 seconds.
- Before: "In 1874, Michigan's Board of Health published a book of wallpaper samples to warn people about arsenic."
- After: "Michigan, 1874. A big book arrives at a public library. Eighty-six pages. Flowers, vines, little gold stars. Every page is real wallpaper. And the letter tucked in the front says: don't let children touch it."

**2. Ask the question in one breath, and promise something bigger than the object** (V2, S11 "headline early").
- Before: "Today we're going to look at the history of arsenic in Victorian products and why it was used."
- After: "Everybody knew arsenic was poison. So how did it end up on the walls? The answer isn't really about chemistry. It's about who has to prove something is safe."

**3. ✱ Point with your words** (Caswell S5, V2, V7). When the picture matters, the line says *this*, *look at*,
*notice*, so the eye goes where the mark lands. At least once per scene that has a mark.
- Before: "*Punch* published a cartoon of a skeleton dancing with a lady in 1862."
- After: "This is from *Punch*, 1862. A ball. A young woman in a green gown. And her dance partner. Look at his face."

**4. ✱ Bring a fact in when the story needs it: "That's where… comes in"** (V1, V3, V6). No chemistry lesson
before there's a reason to care.
- Before (opening ch02): "Scheele's Green is copper arsenite, a compound of copper and arsenic first made in 1775…"
- After (once the gown is on screen): "So why green? Which brings us to the chemist."

**5. ✱ One name per thing, every time** (V1, V4, V8). Never swap synonyms for a key term to sound varied. Name the
variants once, then fold them into the one name.
- Before: "Scheele's Green covered the walls. The emerald pigment was in dresses. This copper green… Paris green…"
- After: "Call it arsenic green. Chemists made two versions, Scheele's Green and a brighter one called emerald green. For this story, they're the same thing: arsenic green." (Later, once: "Same arsenic green. New name: Paris green.")

**6. One example carries the explanation: concrete → general → why → what happened → back** (V4, V6).
- Before: "Many children were poisoned by wallpaper in the 1870s. In one case, a girl named Emma got sick."
- After: "Emma was nine. She got sick in her green bedroom, and got better when they moved her out. Then they put her little brother in the same room. He got sick too. Kedzie found the same story in house after house."

**7. ✱ Stack the facts, then say "That means"** (V1). A one-sentence recap right before the payoff.
- Before: "Children licked the paper and dust was in the air, so the arsenic was dangerous."
- After: "A wall covered in arsenic green. Dust in the air every time someone brushes past. A toddler who licks the wallpaper. That means the poison wasn't sitting in the walls. It was coming off them."

**8. Make the number land: a pair, a ratio or an object** (V1, V4, V6). One number per sentence.
- Before: "British wallpaper output rose by 2,615 percent between 1834 and 1874."
- After: "In 1834, Britain made about 1.2 million rolls of wallpaper. Forty years later? About 32 million. Twenty-six times as much."

**9. ✱ Say how we know, in two sentences** (V5, V9). The method makes the claim trustworthy, and teachers like it.
- Before: "All the samples contained arsenic."
- After: "How do we know? Kedzie tested every sheet before it went in the book. Every one had arsenic."

**10. Translate a primary source right after it** ("Basically," V2; the channel's "Translation:").
- Before: [Draper's full sentence about rights "deemed too sacred", then the next topic.]
- After: "'The rights of individuals and of industrial pursuits are deemed too sacred…' Translation: a ban would mean telling businesses what they couldn't sell. And he didn't think America would do that."

**11. Name the myth, then correct it, kindly** (V1, V5). Already a channel rule; Vox shows it works as a beat of its own.
- Before: "Damp walls released deadly arsine gas."
- After: "You may have heard the wallpaper gave off a poison gas. It did, sort of. In damp rooms, mould turned the arsenic into a gas that smelled like garlic. But that gas turns out to be pretty weak. The real danger was simpler: dust."

**12. ✱ Count a list out loud, and let each item rule something out** (V8).
- Before: "There were several reasons it didn't stop, including uncertain evidence, scientific disagreement and money."
- After: "So why didn't it stop? Three reasons. One: plenty of people had green walls and felt fine. Two: the doctors couldn't agree on *how* it poisoned anyone. Three: the money."

**13. End on a short reversal, over the opening image** (V1, V4). Already the channel's shape; keep it.
- Before: "So, in the end, arsenic green faded out as people became more aware of its dangers."
- After: "The green never changed. What changed was who had to prove it was safe." (Over the sealed library book.)

**14. ✱ Write for the ear, then run a confusion pass** (Fong, S1). Read each chapter aloud to someone who doesn't know
the story; mark every "wait, what?"; fix those lines before voicing. Split any sentence that needs a second read.
- Before: "Draper, whose report, commissioned by the State Board, which had been founded only three years earlier, found…"
- After: "Massachusetts had just set up a Board of Health. One of its doctors, Frank Draper, went shopping. Candy. Toys. Dresses. Wallpaper."

**Vox habits that conflict with the standing rules (not adopted)**
- **Named experts and interview clips** (V8, V9, V10). Conflicts with *no historian names*. The period document is the expert; "historians still argue" / "modern tests suggest" cover disagreement.
- **Modern politicians and present-day news clips as the hook** (V9 opens on governors and presidential candidates). Conflicts with *no modern politicians*.
- **Pop-culture comparisons to living public figures** (V7 compares a 1920s critic to a living TV host). The channel allows a rare, instantly clear modern comparison, never a living public figure.
- **Answer first** ("Let's get this out of the way", V5). The channel answers the driving question at the end. Use answer-first only for a myth correction inside a chapter.
- **Host-forward first person** (V7 "helped me appreciate it"; Harris on camera). The channel is faceless; "I" stays in "the question I want to answer today" and the subscribe lines.
- **Sponsor and membership reads** (V1, V3, V4). The channel has its own two subscribe reminders.

---

## 5. Visual techniques: Vox → the channel's version (or skip)

"Have" means it already exists in the template kit or `techniques/components/`.

| Vox technique | Evidence | Channel status | Channel's version (or skip) |
|---|---|---|---|
| **Highlighter swipe** across a line of a document or clipping, rough-edged | [3P] P6; seen across Vox's document beats [I] | **Partial.** `Doc` + `DocMark` (Grip Tighter) draw boxes, loops, underlines and a coral wash *in the scan's pixels*, but the wash fades in; nothing sweeps along the line as it's read | **`swipe` DocMark**: a torn-edged coral wash that sweeps left→right word by word as the narrator reads the line (§6.1). Coral, not Vox yellow: the channel already rejected yellow (`harris` palette), and DocMark's coral wash is the established convention. |
| **Zoom into a document; pull the line out** | [I] (common in V2, V4 document beats) | **Partial.** `Doc` push-in, `SrcView` camera travel | **`DocLift`**: dim the page, lift the quoted line off it as a cream strip, bigger, still in the scan's own type (§6.3). |
| **2.5D parallax photos** | [3P] | **Have.** `Parallax` (Black Sox), `Layered`, `PlateScene` (Ouija) | Nothing new. |
| **Paper/collage textures, boil** | [D] S2 "don't want it to look perfect"; [3P] P1–P3 | **Have.** DarkPaper, cream cards, torn tape, 15 fps grain, `Desk` drift, `DropCard`, line boil on the phone sketch | Skip (the channel's own texture set is already complete). |
| **Animated maps, route lines, labels** | [D] S3 Ellis; [3P] P4, P5 | **Have** for the US (1836 Mitchell map, USGS 1880 `RouteMap`, `Route`, letters route, `Ripple`) | **Gap:** no Atlantic or British base map. Fit one period map (§7.5). |
| **Toggle map ↔ ground** | [D] S3 | Have in practice | Write it into recipes: cut map → archive photo → map, same pin. |
| **Kinetic charts that build in steps, narrated** | [T] V6, V7 | **Partial.** `Bars`/`HBars`/`Pie`/`CountUp` with one coral subject; bars stagger by `per` frames, not by spoken words | **`StepBars`**: each bar lands on its own word; optional **scale shock** where the axis rescales because the last value won't fit (§6.2). |
| **Text callouts synced to narration** | [T] | **Have.** `Highlight`, `Note`, `SyncQuote`, `Stamp`, `Definition` | Nothing new. |
| **Johnny Harris "desk/board" of physical objects, hands, tracing paper** | [3P] (no first-hand source found) | The channel's virtual desk *is* its version | Skip props and hands on camera. |
| **Split screen / paired comparison** | [T] V4 (Hine's mirrored spreads), V5 (white vs painted) | **Have.** two-views divider, two-column cards | Optional **`Wipe`**: same frame, a teal hand-drawn line sweeps across to reveal state B (sample → "arsenic-free" sample). Low priority. |
| **"Look closer" detail callout** | [T] V6 "look at the glasses", V7 "look at the pitchfork" | **Partial.** Punch-ins, `Loop` | **`Loupe`**: a teal ring with a 3× crop of the detail, joined to a small loop on the source (§6.4). Keeps the whole image on screen, unlike a punch-in. |
| **Consistent color coding of a concept** | [I] | **Have.** "one job per colour" | Extend with the **green swatch** for this video only (§7.1). |
| **One accent color** | [3P] P3 | **Have** (coral) | Nothing new. |
| **Frame-within-frame** (grids framing 4:3 footage) | [3P] P2 | **Have** (cards, `CropCard`) | Skip. |
| **A recurring visual motif / anchor** | [D] S2 Sendaydiego | **Have** (Ember, Ledger, Wall) | Yes: one per video. Here, the swatch. |
| **Sound: paper, marker squeaks, risers; music as cue; music drop on the reveal** | [D] S1 (music); [I] (sfx) | **Have** whoosh, stamp, marker, tick, page turn, boom; one bed per chapter | **Music drop**: cut the bed to silence 4–6 frames before the key reveal word and bring it back after a held beat (the template's cues only take `from`; Ouija's `ChapterShell` adds per-cue `to`/`fadeOut`, so port that). Add a **paper slide** sfx on `Doc` arrival. |
| **Fast top; held visual anchors** | [D] S1, S4 | Scenes 4–12 s | Cold open beats every 2–4 s; then let one picture hold 1–2 s with no new mark ("I don't have to say it"). |
| **Smooth 3D camera moves, chromatic aberration, flat vector icons** | [3P] P1 | Not used | **Skip** (§8). |

---

## 6. Upgrade ranking, and build sketches for the top 5

Impact = how much it helps a viewer follow and stay. Effort = build time in this pipeline. Both 1–5. [I]

| # | Upgrade | Impact | Effort | Ratio | Notes |
|---|---|---|---|---|---|
| 1 | `swipe` DocMark (word-synced highlighter) | 5 | 1 | 5.0 | Extends `DocMark`; every quote beat gets it |
| 2 | Music drop on the reveal | 3 | 0.5 | 6.0 | Port Ouija's per-cue `to`/`fadeOut` into the template shell, then it's a cue setting. (Highest ratio, lowest ceiling.) |
| 3 | `StepBars` (bars on words + scale shock) | 4 | 2 | 2.0 | Extends `charts.tsx` `Bars` |
| 4 | `Swatch` motif (this video) | 4 | 2 | 2.0 | Recurring anchor; one-video palette exception |
| 5 | `Loupe` (look-closer inset) | 3 | 1.5 | 2.0 | Reuses `Loop`, crop math from `CropCard` |
| 6 | `DocLift` (pull the line off the page) | 4 | 2.5 | 1.6 | Pairs with swipe |
| 7 | Atlantic period base map + `PLACES` | 3 | 3 | 1.0 | Needed for this video's map; reusable |
| 8 | Mechanism diagram (dust vs gas) | 4 | 4 | 1.0 | Bespoke per video |
| 9 | `Wipe` before/after | 2 | 1.5 | 1.3 | Nice to have |
| 10 | Paper-slide sfx on `Doc` | 1 | 0.5 | 2.0 | Trivial |

The top five by usefulness across videos: **swipe, StepBars, Swatch-style motif, Loupe, DocLift** (the music drop
needs no build sketch: set the bed's `to` at `t.at(word) - 5` and start the next cue after the held beat).

### 6.1 `swipe` (a new DocMark kind in `gt.tsx`)

```ts
// in DocMark
swipe?: {lines: [number, number, number, number][];   // [x0, yTop, x1, h] per printed line, SOURCE pixels
         words?: number[];                            // frame each spoken word starts (from wordFrames)
         dur?: number}                                // fallback sweep when not read aloud (10 f per line)
// helper, in the scene
const wordFrames = (t: TL, phrase: string, nth = 1) => {
  const i0 = t.idx(phrase, nth), n = phrase.split(/\s+/).length;
  return t.words.slice(i0, i0 + n).map((w) => Math.round(w.s * t.fps) - 1);
};
```
- Spread the words over the lines by character count; the wash front sits at the current word's end, so progress
  is piecewise-linear between word starts. Sample on `useGFrame()` so it steps at 12 fps like every other mark.
- Draw: coral at `multiply 0.55` + `color 0.4` (DocMark's tint blend), top and bottom edges torn with the
  Highlight's seeded 41-point jitter at ±6% of line height, so it reads as the channel's tape, not Vox's marker.
  In `quiet` chapters the wash is teal at the lighter quiet opacities, as DocMark already does.
- Sound: `marker_tick` at 0.15 on each new line.
- Use: `marks={[{at: t.at('The poisonous') - 2, swipe: {lines: L, words: wordFrames(t, 'The poisonous nature of the paper')}}]}`.

### 6.2 `StepBars` (extends `charts.tsx` `Bars`)

```tsx
<StepBars x={260} y={180} w={1400} h={700}
  bars={[{label: '1834', value: 1.22, at: t.at('In 1834')},
         {label: '1874', value: 32, at: t.at('Forty years later'), subject: true}]}
  max0={2} rescale={{at: t.at('Forty years later') + 6, max: 36}} unit="m rolls" />
```
- Each bar grows over 8 frames from its own anchor (stepped). The value lands on the bar in Abril; labels on marks,
  no legend; bone greys plus one coral subject, as in `charts.tsx`.
- **Scale shock:** the first bar is shown at a scale where it's big (`max0`). When the second value lands, it
  overshoots the top of the frame for 4 frames, then the axis rescales to `max` in log space over 12 frames so the
  first bar shrinks to a sliver. Then a `Stamp` "×26" on the next anchor. The rescale is the explanation.
- Numbers and sources live in `src/data/charts.ts` (standing practice).

### 6.3 `DocLift`

```tsx
<DocLift src="img/ch06/draper_1872_p20.jpg" docX={180} docY={60} docW={760}
  box={[118, 1412, 1530, 1478]} at={t.at('deemed too sacred') - 8}
  to={[220, 520]} scale={1.8} rot={-1} swipe={wordFrames(t, 'deemed too sacred')} />
```
- At `at`, the page dims under a `rgba(13,12,9,0.65)` layer; the line is cut from the same scan (CSS
  `background-position` into the source pixels), lifted onto a cream strip with the card shadow, and steps to `to`
  at `scale` over 6 frames. The swipe then runs on the lifted strip.
- Keeps the user's "text never off the frame" rule: clamp `to` + strip width inside x 60…1860 and run the probe.

### 6.4 `Loupe`

```tsx
<Loupe src="img/ch03/arsenic_waltz.jpg" size={[2400, 1800]} place={place}
  cx={1310} cy={640} r={160} zoom={3} to={[1480, 380]} at={t.at('Look at his face')} />
```
- Draws a small teal `Loop` on the source detail (10 frames), then a 6 px teal ring at `to` filled with a `zoom`×
  crop of the same pixels (B&W; the coral tint carries over if the mask covers it), joined by a bowed `Arrow`.
  `tick` on the ring. Whole image stays on screen behind it, unlike a punch-in.

### 6.5 `Swatch` (recurring motif; generalises to any video's object)

```tsx
<Swatch x={1600} y={90} w={200} at={t.at('arsenic green')} src="img/swatch/emerald_draper_sample.jpg"
  label="ARSENIC GREEN" variant="card" />          // 'card' | 'strip' (full-height sample) | 'sealed' (ending)
```
- A cream-bordered square cut from a real scan of the pigment (a bound sample in Draper's 1872 report or a Kedzie
  leaf), mono caps label under it, pops like `Card`, sits top-right whenever the narration says "arsenic green".
- `sealed` adds a plastic-sleeve sheen and crease for the ending, to rhyme with the book "sealed in plastic".
- List its anchors in SCRIPT.md production notes, the way the Black Sox ledger's rows were listed.

---

## 7. *Dressed to Kill* (the arsenic-green video): concrete proposals

The outline is in `projects/Dressed_To_Kill/OUTLINE.md`. Working title: **Dressed to Kill**.

### 7.1 The green swatch, and the coral rule: three options for the user

The coral rule says one subject per image is coral and nothing else has colour. This video is *about a colour*.

| Option | What it looks like | For | Against |
|---|---|---|---|
| **A. Keep the rule.** No green anywhere; the pigment is the coral subject like any other. | Gowns, walls and wreaths tinted coral. | Zero brand risk. | The viewer is told "the most beautiful green anyone had ever seen" while looking at coral. Confusing, and wastes the one story where colour *is* the subject. |
| **B. One-time break: the pigment is the only green in the whole video.** (my recommendation) [I] | Real green appears only *on the pigment itself*: the `Swatch` card, a wallpaper sample, the gown or wreath (via the existing **ColourReveal**, which already licenses "colour creeping in"). Coral stays on the human subject in the same frame (the lady in the gown is coral, her gown is green; the skeleton in *The Arsenic Waltz* coral). | A deliberate, memorable rule-break the audience can feel; it codes the concept with colour, which is exactly what Vox does well, inside the channel's own grammar. | One exception to manage. Needs the guardrails below. |
| **C. Swap coral for green for the whole video.** | Green replaces coral as the subject colour. | Simple. | Breaks the brand, and green sits close to the channel's teal. Not recommended. |

**Guardrails for option B** [I]
- **Green only on pigment.** Never on text, titles, notes, arrows or charts. Titles stay orange, marks teal.
- **Sample the green from a real scan** (Draper's bound samples, a Kedzie leaf, the Met's green dress), and keep it
  **yellow-leaning** so it doesn't read as the channel's teal `#2FE0C4`. Never draw a teal trace directly around a
  green area; let the cream card border or a coral subject outline do it.
- **Heavy chapter (ch04, `quiet`):** no coral, per the rule; the green stays, small and still (one sample card, the
  Limehouse room's walls via a slow ColourReveal), because it is the evidence, not decoration.
- **Thumbnail:** the green is allowed there too (gown or swatch), with a coral face as usual.
- **ch07 coda (Paris green on the farm):** the same `Swatch` drops onto the potato-beetle plate: "Same green. New name."
- **Ending:** `Swatch variant="sealed"` next to the sealed book.

### 7.2 Dust vs gas: a drawn mechanism diagram (ch05)

The channel prefers clean drawn diagrams to props. A teal line cross-section of a room wall, three beats, each on
a spoken anchor:
1. **The wall:** teal outline of plaster, paper, and a pigment layer (green under option B, coral under A). Label
   note "arsenic green, ~ a few grains per sq ft" only if sourced (Kedzie 5.47 grains/sq ft).
2. **Gas (the myth):** mould spots (teal stipple) on a damp corner; wisps rise; orange note "deadly arsine?" (orange
   = disputed claim), then a teal note "garlic gas: real, but weak" and the orange strike-through on "deadly".
3. **Dust (the danger):** 12 fps specks shed from the paper, drift down to a drawn hand, then a cup; a third path to
   a child's mouth (the Turner children licked the paper). Highlight **DUST** on the payoff word.
Narration for this is rule 11's after-text; anchor beats on "gas", "pretty weak", "dust".

### 7.3 Documents with the swipe

- **The library-book letter (ch01, ch06, ch08).** Note: the "don't let children handle it" line is from the Michigan
  State Board of Health's covering letter, signed by **Henry B. Baker**, Secretary, bound into Kedzie's *Shadows from
  the Walls of Death* (Nov 1874; NLM scan). Tag it "Covering letter, Michigan State Board of Health, Nov. 1874 · NLM",
  not "Kedzie's letter". `Doc` on the desk, `swipe` on "not allowing it to be handled by children" as it's read.
- **Draper's opener (ch06):** `Loupe` or swipe on "Everybody knows that arsenic is a deadly poison." (his report's
  first line), then the hard cut to the green samples bound into the same report (PDF pp. ~46, 53–56).
- **Draper's "too sacred" (ch06):** `DocLift` the sentence, swipe "deemed too sacred", then a teal Note
  "translation: no bans here" and a `Definition` bar for {laissez-faire}. This is the APUSH beat; give it 6–8 s.
- **Morris's "witch fever" letter (ch05):** `SyncQuote` (it's read aloud) over the dimmed letter scan.

### 7.4 Output chart (ch02)

`StepBars`, two bars: 1834 ≈ 1.22 million rolls; 1874 ≈ 32 million rolls (Hawksley via Hyperallergic, already in
`research/HISTORY_RESEARCH.md`, rated Medium-High). Scale shock on "Forty years later", `Stamp` "×26", one coral
bar (1874). Put the numbers and the source in `src/data/charts.ts`.

### 7.5 Map: London – Boston – Michigan

- **Base map:** a public-domain period map of the North Atlantic or the world, c. 1860–1875 (Library of Congress or
  David Rumsey), B&W + `sepia(0.25)` like the 1836 map. Fit `PLACES` for Köping (Scheele), Schweinfurt, London/
  Limehouse, Devon Great Consols, Boston, Lansing, Detroit, Jackson, Spring Port. The camera must never show past the
  map's edge (standing rule): clamp like `RouteMap`.
- **Routes:** the pigment's trade in teal; **knowledge** crossing the Atlantic as the existing orange dashed
  **letters route** with the envelope (London cases → Draper's Boston report → Kedzie's Lansing book). Pins pop on
  their spoken names; `Ripple` from Lansing on "100 public libraries".
- **Map ↔ ground toggling** (Ellis): map pin on "Limehouse" → hard cut to the Limehouse room → back to the map for
  the jump to Boston.

### 7.6 Script notes for this video, from the checklist

- **Rule 5 is the big one here:** pick **"arsenic green"** as the one narration name. Scheele's Green and emerald
  green are named once in ch02 and folded in; "Paris green" once in ch07. On screen, the `Swatch` label always says
  ARSENIC GREEN.
- **Rule 1:** the cold open already starts on the book; add the "look again" turn (pretty pages → the letter).
- **Rule 3:** ch03's *Arsenic Waltz* beat is a natural "look at his face" moment with a `Loupe`.
- **Rule 12:** ch05's "Why didn't it stop?" already has three reasons; count them out loud with a "1/3" counter.
- **Music drop:** on "natural causes" (ch04, quiet) or on the Spring Port death (ch06).

---

## 8. What we deliberately don't adopt

| Vox habit | Why not |
|---|---|
| **Expert talking heads, named experts on screen** | Standing rule: no historian names. Posner himself steered Vox away from interviews (S10). The period documents are the channel's experts. |
| **A host on camera, the Johnny Harris desk with hands, props and tracing paper** | The channel is faceless (voice clone) and its desk is virtual and archival. Hands and props would be a new look. |
| **The flat vector motion-graphics look, Vox yellow, slick 3D camera transitions, chromatic aberration** | The channel already rejected the yellow highlighter (`harris` palette); hard cuts and stepped marks are its rhythm; "don't want it to look perfect" (S2) points the same way. |
| **Full-colour archival and colour grades** | B&W plus one coral subject is the brand. The only exception proposed is the pigment in §7.1, as an explicit, one-video option. |
| **Satellite/Google Earth flyovers** | Period maps only; the camera never leaves the map. |
| **Music changes every ~20 s** | One bed per chapter at 0.13–0.17 is the channel's mix. Borrow only the drop on the reveal. |
| **Modern politicians, news clips, living public figures as hooks or similes** | Standing neutrality rules. |
| **Sponsor reads, membership plugs, Vox branding conventions (end-card style, logo stingers)** | The channel has its own intro, logo break, two subscribe lines and end screen. |
| **Answer-first structure** | The channel answers the driving question at the end; answer-first only for a myth inside a chapter. |

---

## 9. Gaps and things I couldn't verify

- **No first-hand Vox account of the highlighter swipe or the document zoom.** The technique is ubiquitous in their
  videos, but the only written description I found is a third-party Stack Exchange thread (P6). Treat as observed
  practice, not documented method.
- **Johnny Harris's own writing method** (S13: chapters "Writing visual scripts", "Every story is a promise",
  "Finding the paradoxes", "Writing for retention"): I could read the episode's chapter list but not its captions
  (YouTube rate-limited the download). Nothing in this study depends on it.
- **Nieman Lab (S10)** blocked direct fetching; the "no desks / away from interviews" rule is from search excerpts
  of that article and from S7.
- **Darkroom host credit:** V1, V3 and V4 are Darkroom episodes; I didn't find a source confirming the host's name,
  so none is given.
- **Cut pacing** (seconds per shot) is not documented anywhere I found; the "fast top" advice is Fong's (S1), and the
  2–4 s cold-open beat is my inference.
- **Transcripts** come from YouTube captions (some auto-generated), so a word here and there may differ from the
  spoken line; all quotes used are short phrases.
