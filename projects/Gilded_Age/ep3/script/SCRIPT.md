# He Sent Me: The Gilded Age, Episode 3 (working title)

**Chunk History** · Gilded Age series, Episode 3 · narration script · **draft 1 (about 2,140 words with outro)** · about 14:00 finished (trim target 1,900 for about 12:30)

Markup as in Episodes 1 and 2: `*emphasis*`, `{vocab}`, `[tag]` = ElevenLabs delivery cue (not spoken). No em dashes.
`SORE:` / `RIVKE:` / `YANKEL:` / `RUNNER:` / `MA:` / `MICHAEL:` paragraphs are character lines. Facts and safe wordings come from
`../RESEARCH.md` §4 and §6; decisions from `SCRIPT_NOTES.md` and `COLD_OPEN_OPTIONS.md` (A2).

**Core concept:** a family crosses an ocean with almost nothing, and the help (and the danger) comes mostly from people who made the
same trip.
**Driving question (~0:55):** *Who helped newcomers make it in America, and who tried to keep them out?*
**Answer (ch 9):** the help came mostly from other immigrants: family, neighbors, people from home. The walls came from Americans,
some of whom had been newcomers themselves. Sometimes they were the same people.
**Implicit evidence for the unit question** (never named): ordinary people helping each other (the ticket, the enclave, the
landsmanshaft, Ma at the end); the government mostly building walls (1882 Acts, 1885); the rich barely appear (Pulitzer's pennies
campaign is ordinary donors).
**Long loop:** the runner's hand on the trunk (ch 1), paid off at the Battery (ch 4) and in Ma's warning (ch 9).
**Irony loop:** Ma Kelly came through the same fort (ch 4) → "More of them." (ch 9) → she helps anyway.
**Callbacks:** Michael's refinery (Ep 1); Ma and the piecework shirts (Ep 2); Ep 2's teaser "new neighbors move into the Kellys'
building."
**Handoff:** Episode 4, cities and machines.

## Transitions: the baton rule (new for Episode 3)

The user asked for chunk breaks that feel like the natural end of a sentence. Rule:

1. **Each chunk ends on the next chunk's title, spoken as the last words of a sentence.** The chapter card slams in *on those words*
   (timed from the outgoing chapter's `words.json`, not after the held tail), holds 2 s under a music swell, and the next chunk opens.
2. **The next chunk's first line picks the thread straight back up**, usually by echoing the title or answering it. No "Now let's
   talk about."
3. **Vary the shape** so it doesn't become a tic: a fragment ("...a word: *Pogrom*" style), a question answered by the title, a
   place name, a verb.
4. **Edit note:** the card replaces the held tail. Last word ends → 0.15 s → card in (torn orange strip, Abril, -2°) → 2.0 s →
   next chunk's first shot. Music: the outgoing cue rides through the card and crossfades into the next under the first line.

| Out of | Last words (= next title) | In to | First line picks up |
|---|---|---|---|
| 1 | "...what they left behind." | (episode title card) then 2 | "What they left behind was..." |
| 2 | "...one piece of paper: a ticket." | 3 | "The ticket came in a letter." |
| 3 | "...an old round fort called Castle Garden." | 4 | "Castle Garden was..." |
| 4 | "...Americans had a name for them: new immigrants." | 5 | "New, compared to who?" |
| 5 | "...crowded into one neighborhood: the Lower East Side." | 6 | "The Lower East Side was..." |
| 6 | "...the front room became a sweatshop." | 7 | "A sweatshop..." |
| 7 | "...some Americans wanted to shut the door." | 8 | "The door started closing..." |
| 8 | "...about to get new neighbors." | 9 | "The new neighbors came in the spring." |

### Characters

| Character | Voice | Direction |
|---|---|---|
| **Sore (Sarah) Rabinowitz**, ~35 (composite; mother) | to design: warm, low, Eastern European Yiddish accent, an adult woman | lines in English on screen tagged *in Yiddish* (mono, small); one real Yiddish line, subtitled |
| **Rivke (Rebecca)**, 12 | design an adult voice that reads young (ElevenLabs blocks under-18 designs); quick, curious, picking up English | the only Rabinowitz who speaks English by ch 9 |
| **Yankel (Jacob)**, ~38 | tired, gentle, accent | two short lines |
| **The Runner**, ~40 | smooth, friendly, too friendly; same accent as Sore | face in shadow until he smiles |
| **Shmuel (Sam)**, 7 | no lines | |
| **Ma Kelly**, **Michael Kelly** | existing voices from Eps 1 and 2 | |

Yiddish lines: voiced in English with the *in Yiddish* tag (ElevenLabs Yiddish is unreliable). The one real Yiddish line is Sore's
"Kinder, kumt" ("Children, come"), short enough to voice phonetically; check pronunciation before generating.

### Inflation

1884 → 2026 about **36x** (same Minneapolis Fed series as Ep 2; 1884 CPI ≈ 1883). $18 ticket ≈ **$650 today** (tag only).

### Chapters

| Chapter | Words | Scene(s) |
|---|---|---|
| 1 He Sent Me (cold open) | 230 | `ep3_runner` (new): the Battery at dusk, the trunk, the hand |
| 2 What They Left Behind | 200 | map of the Pale; burned roofs, not bodies; the shtetl house |
| 3 The Ticket | 200 | `ep3_letter` (route part); Sun ad 1884; `ep3_steerage` |
| 4 Castle Garden | 300 | Ulrich 1884; Shults 1880; names (manifest); Ellis flash-forward; back to `ep3_runner` |
| 5 Old and New | 190 | chart (rebuilt); decade bars |
| 6 The Lower East Side | 230 | the walk (Rivke's POV); Riis; Hester St (dated) |
| 7 Sweatshop | 200 | `ep3_sweatshop`; Riis Ludlow St |
| 8 Shut the Door | 250 | Puck 1882 wall; Exclusion Act text; Keppler 1893 read; pedestal; New Colossus |
| 9 New Neighbors | 200 | `ep3_moving_in` (stoop); Ma's kitchen; the knock |
| | **~2,140** | trim target 1,900 after the read-through |

---

## 1 | He Sent Me (cold open)

May, 1884. The bottom tip of Manhattan. The sun is going down.

A woman walks out of an old round stone fort with two children, a roped feather bed and a trunk. Everything they own.

Three weeks ago they lived in the Russian Empire. Tonight, they have no idea where they'll sleep.

Her husband was supposed to be waiting right here. He isn't.

But someone else is.

He's been watching them since they came through the gate. Good coat. Clean boots. A man who has watched a lot of boats come in.

He walks over, smiling, and speaks to her in her own language.

**RUNNER:** [warm] Welcome, welcome! Who are you waiting for?

**SORE:** [tired, hopeful] My husband. Yankel Rabinowitz.

**RUNNER:** [delighted] Yankel! Of course. He sent me. Come. I'll take the trunk.

[music drops out]

He has never heard of Yankel Rabinowitz.

And the little boy lets go of his mother's hand, and takes his.

New York had a name for men like this. {Runners}. The state built a fence around this entire fort to keep them out.

It didn't work.

Where does he want to take them? We'll get back to that.

In America, with almost nothing, you had to decide fast who to trust.

So here's my question. *Who helped newcomers make it in America, and who tried to keep them out?*

To answer it, we have to go back three weeks and four thousand miles, to what they left behind.

## 2 | What They Left Behind

What they left behind was a small wooden house in a small town, in what is now Ukraine.

The Rabinowitzes are made up. But millions of families lived just like them.

They were Jewish, and in the Russian Empire, Jews were mostly required to live in one region in the west, called the {Pale of Settlement}. Many jobs and schools were closed to them.

Then, in March 1881, a group of revolutionaries assassinated the tsar, Alexander the Second. A rumor spread that the Jews were behind it. They weren't.

That spring, mobs attacked Jewish homes and shops in town after town. Houses burned. The police often stood by.

English got a new word from those months. {Pogrom}. It comes from a Russian word for "devastation."

The next year, the government passed the {May Laws}. They were called "temporary." They lasted thirty-five years, pushing Jews out of villages and out of work.

So families had a choice. Stay and hope. Or leave.

More than two million Jews would leave over the next forty years, most of them for America. And they almost never came back.

But leaving costs money. So Yankel went first, alone, in 1882. And for two years the rest of the family waited for one piece of paper: a ticket.

## 3 | The Ticket

The ticket came in a letter.

Yankel had found work in New York, pressing coats. He lived as a boarder in somebody else's room. He saved every penny he could, and he bought a {prepaid ticket}: a ticket bought in America, for someone back in Europe.

In 1884, New York newspapers advertised prepaid steerage tickets for about eighteen dollars a person. That's about a month's pay for a laborer here.

This is how most immigrants came. Not alone, and not blind. One person goes first, finds work, writes home, and sends money for the next. Historians call it {chain migration}.

So in the spring of 1884, Sore packed the candlesticks, the feather bed and the samovar, and took the children west by train, across Germany, to the port of Hamburg.

There they boarded a steamship, in {steerage}: the cheapest space on the ship, below deck. Rows of bunks. Hardly any air. Hundreds of people, seasick, for about two weeks.

**RIVKE:** [quiet] Mama, how much farther?

**SORE:** [soft] Until we see your father.

Then one morning, a strip of land. A harbor full of masts and smoke. A barge carried them across the water to an old round fort called Castle Garden.

## 4 | Castle Garden

Castle Garden was the front door of America.

Since 1855, it was where immigrants landed in New York. About eight million people passed through it. That's about two out of every three immigrants of those years.

Inside, clerks asked each newcomer the same questions. Name. Age. Country. Where are you going? Officials watched for anyone who seemed sick. Then on, past money changers, railroad ticket sellers, and a desk that handed out jobs.

Fourteen years earlier, a young Irishwoman had stood in this same room, holding the same kind of bundle. You've met her. That's Ma Kelly.

Now, about names. You may have heard that clerks changed people's names when they arrived, because they couldn't spell them.

It almost never happened. The clerks copied names from the ship's passenger list, and that list was written back in Europe. Names did change, but later, and usually by choice: at school, at work, on a shop sign.

Rabinovich, in Russian letters, became "Rabinowitsch" on a German ticket, and Rabinowitz in New York. Rivke would become Rebecca at school.

Ellis Island, where most of the famous photos come from, didn't open until 1892.

And just outside it, a man was walking away with their trunk.

But Rivke was twelve, and she was watching. They were heading away from the ferries.

**RIVKE:** [sharp] Mama. Stop.

**YANKEL:** [shouting, far off] Sore! Sore!

Yankel shoved through the crowd, late from work. When they turned around, the man with the good coat was gone.

Runners worked for shady boarding houses and ticket sellers, charging newcomers too much for a bed or a ticket. And very often, they were immigrants themselves, working their own people in their own language.

So the first person to try to cheat this family in America was a newcomer too.

And the Rabinowitzes were part of a giant new wave. Americans had a name for them: new immigrants.

## 5 | Old and New

New, compared to who?

Here's how textbooks usually sort them. The {old immigrants} came mostly before 1880, from Northern and Western Europe, like Germany, Britain and Ireland. Most were Protestant. Many settled on farms as well as in cities.

The {new immigrants} came mostly from 1880 to 1910, from Southern and Eastern Europe, like Italy, Poland and Russia. Most were Catholic, Jewish, or Orthodox Christian. Most settled in cities.

And here's the one that matters most. Native-born Protestant Americans saw the old immigrants as similar to themselves, and the new ones as different. That was a judgment, not a fact.

Because look at the Kellys. They're old immigrants, from Ireland. But they're Catholic. And thirty years earlier, Irish Catholics were the ones Americans called different.

The numbers changed fast. In the 1870s, about 2.8 million immigrants came to the United States. In the 1880s, 5.2 million. And by the 1900s, almost 9 million in one decade.

In 1884, Jewish families like the Rabinowitzes were still a small part of the crowd, about one arrival in fifty. Most of them crowded into one neighborhood: the Lower East Side.

## 6 | The Lower East Side

The Lower East Side was loud.

Rivke's first morning, she followed her father down the stairs and into the street.

Pushcarts, end to end. Herring in barrels. Pickles. Pots. Used coats. Women bargaining in Yiddish. Signs in Hebrew letters. Somebody's goat. Everybody shouting.

It felt, for a second, like home.

That was the point. This was an {enclave}: a neighborhood where people from the same place live close together, keep their language, and look after each other.

Here, Yankel found work through a man from his own town. Sore could buy kosher meat. There was a little synagogue upstairs over a shop. And soon there would be {landsmanshaftn}: clubs for people from the same hometown. You paid a little each month. If you got sick, they paid the doctor. If you died, they paid for your grave.

Irish families had built the same thing a generation earlier. A parish, a saloon, a savings bank started by Irish immigrants. Ma Kelly's neighborhood was an enclave too.

But the Lower East Side had a cost. The apartments, in buildings called {tenements}, were tiny and dark, with one sink in the hall for the whole floor. The Rabinowitzes slept four in one room, with a boarder in the kitchen to help pay rent.

A few years later, a reporter claimed it was the most crowded place on Earth.

And on Monday morning, the front room became a sweatshop.

## 7 | Sweatshop

A {sweatshop} was a workshop where people worked long hours, for very little money, often right inside a family's home.

New York made more ready-made clothes than anywhere in America. Big companies cut the cloth. Then a middleman, a {contractor}, carried bundles of cut pieces to rooms like this one, and paid by the piece.

So Yankel pressed seams with a heavy iron heated on the stove. Rivke, twelve, ran a sewing machine. Sore sewed buttons and finished the hems by hand. Even Shmuel pulled loose threads.

**SORE:** [counting under her breath] Fourteen. Fifteen. Sixteen.

A reporter named Jacob Riis visited shops like this a few years later. He described one where a shop full of workers made knee pants for seventy cents a dozen. Beginners earned two to five dollars a week. They worked from sunrise until nine at night.

Sound familiar? Back in Brooklyn, Ma Kelly was sewing shirts by the piece too.

It was brutal. But the Rabinowitzes were together, earning, and saving. And every week, a few cents went into a jar marked for a cousin's ticket.

So who helped newcomers? Mostly, other newcomers. Family. Neighbors. People from home.

But outside the neighborhood, some Americans wanted to shut the door.

## 8 | Shut the Door

The door started closing on the other side of the country.

In California, a movement grew against Chinese workers, who had built railroads and mined for low pay. One of its loudest leaders was Denis Kearney. He ended his speeches with "The Chinese must go!"

Kearney was an immigrant himself. From Ireland.

In 1882, Congress passed the {Chinese Exclusion Act}. It banned Chinese workers from coming to the United States. It was the first major law to keep out a group of people because of their nationality.

That same year, Congress began taxing every arrival and turning away anyone who looked too poor to support themselves.

Hostility to newcomers has a name: {nativism}.

And there's a strange pattern in it. In 1882, a magazine called Puck printed a cartoon of workers building a wall against the Chinese. Irish, Jewish, and Italian workers. Immigrants, building the wall.

Nine years later, Puck's founder, Joseph Keppler, drew this. Rich men turning a newcomer away. But look at their shadows. Each one is a poor immigrant: the man he, or his father, used to be. The caption says they would close "the bridge that carried them and their fathers over."

Keppler was an immigrant too, from Austria.

But here's the other side.

In 1883, a poet named Emma Lazarus, who had volunteered with Jewish refugees, wrote a poem for a giant statue coming from France. "Give me your tired, your poor, your huddled masses yearning to breathe free."

The statue needed a pedestal, and the money ran out. So a newspaper asked ordinary people to chip in. More than a hundred thousand people did, most giving a dollar or less.

And across the river in Brooklyn, the Kellys were about to get new neighbors.

## 9 | New Neighbors

The new neighbors came in the spring of 1886.

Yankel had found steadier work, at a shop across the East River. A few Jewish families were starting to move to Williamsburg, for more space and cheaper rent. Most wouldn't come for another twenty years.

Michael Kelly was coming home from the refinery when he saw them on the stoop, wrestling a trunk.

He grabbed the other end.

Upstairs, Ma watched from the window, arms folded.

**MA:** [flat] More of them.

That evening, there was a knock at her door. Mrs. Rabinowitz, and Rivke beside her to translate.

**RIVKE:** [careful] My mother asks: where do you buy a ticket for someone to come from the old country? For her sister.

Ma knew exactly where. She'd done it herself, for Nora.

**MA:** [grudging] Tell her I'll take her. Saturday.

**RIVKE:** [apologetic] Saturday is our Sabbath.

**MA:** [beat] Sunday, then. And tell her this. When the sister lands, nobody talks to anybody at that dock. *Nobody.*

So, who helped newcomers make it in America, and who tried to keep them out?

Mostly, newcomers helped each other. A letter. A ticket. A job through a friend. A neighbor at the door.

The walls came from Americans, and some of them had once been newcomers too.

And sometimes, like Ma Kelly, the same person did a little of both.

That fall, the Statue of Liberty was finally dedicated in New York Harbor. And the Rabinowitzes sent a letter, with a ticket folded inside.

Next time: Michael meets a man who can get you a job, a ton of coal, or a lawyer. All he wants in return is your vote.

Thanks for watching. Subscribe for more, and I'll see you next time.

---

## Fact-check before voicing

| Line | Status | Action |
|---|---|---|
| Runners: touts for boarding houses; fence to keep them out | period description via Norway Heritage (RESEARCH 4.3) | safe |
| Runners "very often" immigrants working their own countrymen; worthless tickets, overcharging | **VERIFY** (standard in secondary sources; no source in RESEARCH yet) | find one secondary source or soften to "often spoke their language" |
| "Three weeks" journey (rail + ~2 weeks sea + Hamburg wait) | judgment from RESEARCH 4.2 | fine |
| Tsar killed March 1881; rumor blamed Jews | RESEARCH 4.1 | safe |
| pogroms: homes and shops in town after town; police often stood by | RESEARCH 4.1 (glossary: "officials looking the other way") | safe; no death toll |
| "pogrom" from Russian "devastation" | unverified; standard | check a dictionary |
| May Laws 1882, "temporary," lasted until 1917 (35 years); barred settling in villages | RESEARCH 4.1 | safe |
| "More than two million Jews would leave over the next forty years, most for America" | **checked Nov 14**: about 2 million left the Russian Empire 1881 to 1914, about 78 to 80% to the U.S. (Kononczuk 2020, https://www.kh-ihpan.edu.pl/images/KH2020-3/05_Kononczuk.pdf ; Boustan, https://lboustan.scholar.princeton.edu/document/30 ; JTA: 1,681,683 Russia to U.S. 1881 to 1923, https://www.jta.org/archive/1681683-jews-emigrated-from-russia-to-united-states-between-1881-and-1923 ). Over forty years "more than two million" holds | safe |
| Jews almost never went back | Joseph 1914 (RESEARCH 4.1) | safe |
| prepaid steerage ~$18 in 1884 NY ads | The Sun, June 11, 1884 (image found; Monarch, National, Red Star lines) | safe as worded |
| about a month's pay for a laborer | Keeling 2013 | safe |
| Hamburg; ~2 weeks | RESEARCH 4.2 | safe |
| barge to Castle Garden | RESEARCH 4.2 (Hoboken docking unverified, so the pier isn't named) | safe as worded |
| Castle Garden since 1855; ~8 million; two of three | RESEARCH 4.3 | safe |
| fort, then concert hall | standard (Castle Clinton, Castle Garden theater) | check NPS |
| questions, health check, money changers, rail tickets, labor bureau | RESEARCH 4.3 | safe |
| Ma Kelly via Castle Garden ~1870 | series bible | fine (14 years before 1884) |
| name myth | USCIS / Marian L. Smith (RESEARCH 4.9) | safe |
| Ellis Island opened 1892 | RESEARCH | safe |
| decade totals 2.8 / 5.2 / 3.7 / 8.8 M | RESEARCH beat 5 | safe ("almost 9 million") |
| 1884: ~11,000 of 500,000+ Jewish = "about one in fifty" | RESEARCH (11,000/518,000 ≈ 1 in 47) | safe |
| synagogue over a shop, kosher butcher on the LES by 1884 | judgment | **VERIFY** lightly |
| landsmanshaftn "soon" | RESEARCH 4.5 says young in 1884; "soon" | safe as worded |
| Irish savings bank (Emigrant Savings Bank, 1850) | RESEARCH 4.5 | safe |
| one sink in the hall; boarders | standard for pre-1901 tenements | **VERIFY** lightly |
| "a reporter claimed it was the most crowded place on Earth" | Riis 1890, "it is said" | safe as worded |
| NY the leading ready-made clothing center | standard | **VERIFY** |
| contractor, piece rates | RESEARCH 4.6 | safe |
| Riis: knee pants 70 cents a dozen; learners $2 to $5; daybreak to 9 p.m. | Riis ch. XI (RESEARCH 4.6) | safe; "a few years later" covers 1890 |
| Kearney, "The Chinese must go!", Irish immigrant | RESEARCH 4.7 | safe; Cork omitted |
| Exclusion Act 1882, first major nationality ban | RESEARCH; standard | safe |
| 1882 Act: 50 cents, public charge | RESEARCH 4.3 | safe |
| 1885 contract labor law (Foran Act) | RESEARCH | safe |
| Puck 1882 "The anti-Chinese wall": Irish, Jewish, Italian workers | IMAGES.md (Black worker also shown) | **VERIFY** at full size which groups are labelled; adjust list |
| Keppler founded Puck; "nine years later" (1893) | RESEARCH 4.10 | safe |
| Keppler caption, shadows | LOOKING_BACKWARD.md (read at full size) | safe |
| Lazarus volunteered with refugees; poem 1883 | RESEARCH 4.5, 4.8 | safe |
| pedestal: >100,000 donors, most $1 or less | NPS (RESEARCH) | safe; it ran in 1885, so ch 8's "And in 1884" line is a time jump back: keep the pedestal lines in past tense |
| Statue dedicated October 1886 | standard | safe |
| A few Jewish families in Williamsburg mid-1880s; wave after 1903 | RESEARCH (German Jews first; early and rare) | safe as worded |
| Sabbath on Saturday | | safe |

## Open items

- **Timeline in ch 8/9:** ch 8 spans 1882 to 1893 and the pedestal (1885); its last line carries no year, and ch 9 gets an on-screen
  date tag, 1886.
- **Length:** ~2,140 words; target 1,900. Trim candidates: the names paragraph (ch 4), the Kearney setup (ch 8), the tenement details (ch 6), the decade numbers (let the chart carry them).
- **Neighborhood Guild (1886) one-liner:** cut for length; revisit if under.
