# Steel, Oil, and Sugar: The Gilded Age, Episode 1 (working title)

**Chunk History** · Gilded Age series, Episode 1 · narration script · **draft 3 (1947 words, with the Kellys' lines; cut menu below)** · about **12:32** finished
(165 words a minute with pauses, plus the Chunk intro after the cold open, short chapter breaks and a 20-second end screen)

Markup: `*emphasis*`, `{vocab}`, `[tag]` = ElevenLabs delivery cue (not spoken). No em dashes (series rule). Draft 1 (2,414 words,
about 15 minutes, everything in) is kept in `drafts/` so any cut line can come back.

**Core concept:** in one lifetime America built a machine that looked like solid gold; who built it, how, and who owned it.
**Driving question (~0:40):** *How did America get so rich, so fast... and who ended up with the money?*
**Answer (ch 9, out loud):** New machines made things cheap. Two poor boys found ways to control whole industries: one owned every
step, one bought every rival. And a government that mostly stood back let them. Carnegie and Rockefeller became two of the richest
people who ever lived; Michael got a day's pay and went home to a kerosene lamp.
**Closing line:** "*Who got the gold... and who only got the gilt?*" (the series question, over the bridge at night)
**Long loop:** the bad wire, opened in the first sentence (0:00), explained step by step and closed in ch 9.
**Second loop:** "two boys who started out poorer than Michael... one whose father lost his job to a machine, one whose father was a
con man" (ch 1 → ch 5 and ch 6).
**Midpoint twist (end of ch 5, about 5:30):** Carnegie's private note at 33: chasing money is "one of the worst species of idolatry";
he'll quit at 35. He did not quit at 35.
**Climax twist (ch 7):** Michael never changes jobs, but his refinery stops competing with the one down the street: the trust has come
to Brooklyn. Then the kerosene lamp: one monopoly lighting the table after a day working for another.
**Ending device:** the wire. Perfect outside, cheap inside, and it held: the Gilded Age in miniature, said in the cold open and paid off.
**Handoff:** Michael's sister goes to work as a maid in a Fifth Avenue mansion (Episode 2).
**Frame 0:** the bridge at dusk with the crowd (look-dev looks 1 and 2), camera already moving, coral on Michael in the crowd. The
wire gets its teal x-ray in ch 9.

### Voices (eleven_v4)

| Voice | ElevenLabs voice | Settings | Direction |
|---|---|---|---|
| **Narrator** (Ellis, the teacher) | `Ellis` (cloned) · `mI4rIAStSQeKeqsz4FwM` | stability 0.65, similarity 0.85, style 0 | **Fairly even throughout, not much emotion** (your direction, Nov 7). No delivery cues on narrator lines except `[pause]`; the jokes land deadpan. |
| **Michael** | `Michael (British Immigrant)` (generated; Cork accent) · `UxeFpulW6hsy9Wt6E0Ai` | stability 0.45, style 0.25 | Light cues allowed (`[tired]`, `[amazed]`) |
| **Ma** (Mrs. Kelly) | `Irish Mother` (generated; Cork accent) · `ingzPMbrZqU3iFbHVKBR` | stability 0.45, style 0.25 | Light cues allowed (`[dry]`) |

Markup: a paragraph that starts `MICHAEL:` or `MA:` is that character's line (each its own take, in that voice). Characters never
explain or define anything; the narrator does all the teaching. Five lines in this episode (ch 1, ch 4, ch 7).
Respellings for the narrator: Carnegie → Car-NAY-ghee (hard g, picked Nov 7), Havemeyers → HAYV-my-ers, laissez-faire → lessay-fair, solder → sodder.
Test files: `tests/pronunciation.mp3`, `tests/scene_bridge.mp3`, `tests/scene_dinner.mp3` (made with `tests/voice_test.py`).

### Characters

| Character | Side | Want / job | Arc in this episode | Source |
|---|---|---|---|---|
| **Michael Kelly**, 19 (fictional composite, said in ch 1; born in County Cork, came to New York as a boy) | worker | Keep his job in the heat | Crosses the bridge → the refinery floor → his refinery joins a trust → home to a kerosene lamp | RESEARCH §5 Kellys' thread |
| **Andrew Carnegie** | owner | Get his family out of poverty | Weaver's son → bobbin boy → the $10 check → steel, every step → "I'll quit at 35" → didn't | RESEARCH §5a |
| **John D. Rockefeller** | owner | Order, savings, control | Con man's son → the notebook → "his father charged him interest" → 22 of 26 → a monopoly and a trust | RESEARCH §5b |
| **Ma (Mrs. Kelly)**, mid-40s, from County Cork (fictional) | worker's family | Keep the household going | Dinner by the kerosene lamp: "Same work, same pay, is it?" | composite |
| **Margaret Carnegie / Eliza Rockefeller** (both unnamed in narration) | the mothers | Hold the family together | Margaret mortgages the house; Eliza runs the farm and counts every penny | RESEARCH §5a, §5b |
| **The wire supplier** (J. Lloyd Haigh, unnamed in narration; source tag only) | the con | Profit | Swaps tested wire for failed wire → caught by a pile that never grew | RESEARCH §4a |

All of them meet at the end: the bridge built of Carnegie's kind of steel and Haigh's kind of shortcut, Michael crossing it, the
lamp burning Rockefeller's oil.

### Chapters

| Starts | Chapter | Words | Arc | Whose chapter |
|---|---|---|---|---|
| 0:00 | The Bridge (cold open) | 165 | Hook | Michael, all threads in one breath |
| 1:08 | The Name | 165 | Act I · setup | the era |
| 2:10 | The Machines | 173 | Act I · setup | the inventors |
| 3:14 | The Refinery | 126 | Act I · setup | Michael |
| 4:02 | The Weaver's Son | 303 | Act II · escalation + midpoint twist | Carnegie (and his mother) |
| 5:54 | The Con Man's Son | 422 | Act II → III · escalation | Rockefeller (and his mother) |
| 8:30 | The Trust Comes to Brooklyn | 140 | Act III · climax twist + plug | Michael and Ma |
| 9:23 | Leave It Alone | 144 | Act IV · fallout, both readings | the government, fans and critics |
| 10:17 | Gold or Gilt | 309 | Act IV · answer + loop closed | Michael, the bridge, all of them |
| | **Total** | **1947** | | about 12:32 finished |

---

## 0:00 | The Bridge (cold open)

On the day the Brooklyn Bridge opened, a hundred and fifty thousand people walked across it. And some of the steel wire holding them up... had already *failed its safety test*.

Nobody in that crowd knew. Not even the nineteen-year-old who works ten-hour shifts in a sugar factory across the river.

**MICHAEL:** [amazed] Would you look at it. You can see the whole river from up here.

That's Michael Kelly. He's made up. But everything that happens to him really happened to people like him.

It's 1883. America is changing fast, and a few men are getting richer than kings.

So here's the question. *How did America get so rich, so fast... and who ended up with the money?*

To answer it, we need two boys who started out poorer than Michael. One whose father lost his job to a machine. And one whose father was a con man.

And we'll come back to that bad wire. It turns out to be the whole story, in miniature.

---

## 1:08 | The Name

First, the name. Because the name is an insult.

In 1873, Mark Twain and a friend wrote a novel making fun of greedy businessmen and crooked politicians. They called it *The Gilded Age*.

{Gilded} means covered in a thin layer of gold. That thin, shiny layer is called {gilt}. Shiny outside, cheap metal underneath. If a "gold" necklace has ever turned your neck green, you've owned something gilded.

People later borrowed the name for the whole era, about 1870 to 1900. A time when everything moved fast. Especially the railroads.

They got so powerful, they changed time. Every town used to set its clocks by the sun, which made train schedules a nightmare. So in 1883, the railroads switched the country to a handful of time zones. Some towns heard noon twice that day.

If you live in North America, the time zone you're in right now? It started with the railroads.

And all those trains needed rails. Which were about to get very cheap.

---

## 2:10 | The Machines

The big word for all this is {industrialization}: making things by machine, in factories, in huge numbers, instead of by hand.

Take steel. Iron snaps. Steel bends. But steel took a day or more to make. Then came the {Bessemer process}: blow air through melted iron, and the air burns out the extra carbon. Minutes, not a day.

Steel rails fell from more than 170 dollars a ton to about 17. *Same steel. One-tenth the price.* The steel frame inside every tall building you've ever been in starts right here.

Inventions came in a flood: the telephone, the typewriter, electric light. And you've probably heard that Thomas Edison invented the light bulb. [pause] He didn't. Other inventors got there first.

What Edison made was a bulb that *lasted*, plus the whole system around it: a power plant, wires under the street, and a meter to measure what you used. So the next time someone complains about the electric bill... that's Edison too.

New machines meant new factories. And factories needed people. People like Michael.

---

## 3:14 | The Refinery

Michael works at the Havemeyers and Elder sugar refinery in Brooklyn: a factory that turns raw brown sugar into the white stuff in your kitchen. About a thousand men. About 5,000 barrels a day.

The sugar is pumped to the top of the building and works its way down, floor by floor. Melted. Filtered through charcoal made from animal bones. Yes. Bones. Boiled, and spun dry.

Michael's floor is one of the hottest. Ten hours or more. No work, no pay.

**MICHAEL:** [tired] And if I don't like it, there's fifty men at that gate who'd take my place by dinner.

The men who owned places like this were becoming some of the richest people in history. And the two richest of all started out poorer than Michael.

---

## 4:02 | The Weaver's Son

Andrew Carnegie was born in a one-room cottage in Scotland. His father wove fine linen by hand, one thread at a time.

When Andrew was 11, a steam-powered weaving factory opened in town. Its machines never got tired, and they didn't need weavers. A machine taking someone's job isn't a new worry. Ask a weaver in 1847.

The family borrowed twenty pounds and sailed for America. At 12, Andrew was changing spools of thread in a cotton mill near Pittsburgh. Twelve hours a day, for one dollar and twenty cents. A week.

Then he delivered telegrams, taught himself to read the telegraph's clicks by ear, and got hired by a railroad boss.

That boss offered him a few shares of a company, for about 500 dollars. Andrew didn't have 500 dollars. So his mother *mortgaged the family's house*. If it went wrong, they'd lose it.

Then a check came in the mail. Ten dollars. Andrew hadn't worked for it. His money had. He called it "the goose that lays the golden eggs."

Railroads, bridges, iron, then steel. He named his giant new steel mill after the president of the Pennsylvania Railroad... which just happened to be the customer he wanted most. Subtle.

Then he bought the iron mines. The coal. The ore ships. The railroads. That's {vertical integration}: owning every step of making and moving your product. Stack the steps, mine at the bottom, customer at the top, and he owns the whole column. Like a pizza place that also owns the farm, the cheese factory and the delivery cars.

[pause] But here's the strange part. At 33, Carnegie wrote himself a private note. He had plenty, he wrote, and chasing more money was "one of the worst species of idolatry." Translation: worshipping money. He'd quit at 35.

He did not quit at 35.

---

## 5:54 | The Con Man's Son

John D. Rockefeller grew up on farms in upstate New York. His father sold bottles of homemade medicine that he said could cure almost anything. Even cancer. It couldn't.

He vanished for months at a time, and, it turned out, had a second wife under a fake name. Not exactly father of the year. So John's mother ran the farm, and counted every penny.

As a boy, John lent 50 dollars of his turkey money to a neighbor, and got it back with interest. Same lesson as Carnegie's ten-dollar check: money can make money.

At 16, he got a job as a bookkeeper, and wrote down every penny of his own in a little red notebook. At 19, he started his own business, with 1,000 dollars borrowed from his father. *His father charged him interest.*

Then came oil. Rockefeller refined it into kerosene: lamp oil, the way most families lit their homes at night.

He was obsessed with cutting costs. He liked to tell how he once got a machine to seal oil cans with 39 drops of solder, a metal glue, instead of 40. One drop, saved on every can, forever.

Then he went after his rivals. His secret weapon was a {rebate}. He shipped so much oil that the railroads secretly paid him money back, so his shipping cost less than everyone else's. Imagine the delivery company charging your rival full price... and quietly sending *you* a refund.

Cheaper shipping meant he could sell his oil for less. So his rivals had to cut their prices too, until they were losing money on every barrel.

Lower costs. Lower prices. Rivals bleeding money. *That means* he could make an offer they couldn't really refuse: sell to me now, while your business is still worth something... or keep going, and go broke.

In 1872, Cleveland had 26 oil refineries. In about six weeks, he bought 22 of them. Some owners were glad to sell. Others said they felt they had no choice.

That's {horizontal integration}: buying up your competitors, the companies that do the same job you do. Line them up side by side, and he owns the whole row. Every pizza place in town.

By about 1880, his company, Standard Oil, refined about 90 percent of America's oil. That's a {monopoly}: one company controlling almost all of something. Yes, like the board game. Which started out as a warning.

To run it, he set up a {trust}: dozens of companies handing control to one small board, run like one giant business.

---

## 8:30 | The Trust Comes to Brooklyn

Back in Brooklyn, in 1887, the sugar refiners copied Rockefeller. Michael's refinery, and most of the others, joined one sugar trust.

Michael didn't change jobs. Same heat. Same long shifts. But the refinery down the street wasn't a rival anymore. It was the same company. If he didn't like the pay, there were a lot fewer places to go.

That night, the family eats by the light of a kerosene lamp.

**MA:** So. Same work, same pay, is it?

**MICHAEL:** Same work. Same pay. Only now the place down the street has the same boss.

**MA:** [dry] Well. The rent's the same too. Pass me that lamp, love.

That lamp burns kerosene. Most likely, Rockefeller's kerosene. One monopoly lighting the table, after a day working for another.

Quick favor: hit subscribe. It's free. And unlike kerosene in 1887, you've got other options. Subscribe anyway.

---

## 9:23 | Leave It Alone

So where was the government? Mostly... standing back.

The idea was {laissez-faire}: French for "let them do it." Leave business alone, and let the {free market}, buyers and sellers, decide prices, wages, and who wins. So there was no minimum wage. No limit on hours. No safety rules. No two-day weekend, either. People had to fight for that one.

But it wasn't totally hands-off. The government gave railroads more land than all of California, and taxed foreign goods to protect American factories.

So were these {entrepreneurs}, people who build a business and risk it failing, heroes or villains? To their fans, they were {captains of industry}: steel got cheap, lamp oil got cheap, millions got jobs. To their critics, they were {robber barons}: they crushed rivals with secret deals and got rich off men like Michael.

Both sides were looking at the same facts.

---

## 10:17 | Gold or Gilt

So, back to the bridge. And that bad wire.

Each of its four main cables is more than five thousand steel wires, bundled tight. Every load of wire had to pass a strength test at the factory before it went to the bridge.

The supplier found a way around it. A wagon of good wire passed the test and got its certificate. On the way to the bridge, it stopped at another building. The good wire came off. Wire that had *failed* went on. Same wagon. Same certificate. And the good wire went back to be tested. Again.

They caught on when someone noticed the pile of rejected wire... never got any bigger.

By then, tons of bad wire were in the cables. So the engineers added 150 extra wires to each one, and made the supplier pay. The bridge had been built six times stronger than it needed to be. Even with the bad wire, it held. People walk across it every day.

So how did America get so rich, so fast? New machines made things cheap. Two poor boys found ways to control whole industries: one owned every step, one bought every rival. And a government that mostly stood back let them.

And who got the money? Carnegie and Rockefeller became two of the richest people who ever lived. Michael got a day's pay, and went home to a kerosene lamp.

From the outside, the Gilded Age looked like solid gold. So did the bridge. Inside, some of it was cheap wire, holding on.

Gold is the real thing. Gilt is the thin coat that only looks like it.

[pause] *Who got the gold... and who only got the gilt?*

Next time: Michael's sister gets a job inside one of those golden mansions. As a maid.

Thanks for watching. Subscribe for more, and I'll see you next time.

---

## The humor (one dry aside about every minute, never two in a row, never on the heavy beats)

| Ch | Line | Why it works |
|---|---|---|
| 2 | "If a 'gold' necklace has ever turned your neck green, you've owned something gilded." (right after *gilt* is defined) | Defines *gilded* through something every kid has seen |
| 2 | "Some towns heard noon twice that day." | A true, absurd consequence |
| 3 | "He didn't." / "the next time someone complains about the electric bill... that's Edison too." | The myth beat, with a household payoff |
| 4 | "Yes. Bones." | Bone char: true, gross, memorable |
| 5 | "...which just happened to be the customer he wanted most. Subtle." | The mill named for a customer |
| 5 | "He did not quit at 35." | The midpoint twist lands as a deadpan |
| 6 | "Even cancer. It couldn't." / "Not exactly father of the year." / "His father charged him interest." | Humanizes Rockefeller without mocking real hardship |
| 6 | "Yes, like the board game. Which started out as a warning." | True (see flags), and a tease worth a pause |
| 7 | "unlike kerosene in 1887, you've got other options. Subscribe anyway." | The plug, tied to monopoly |
| 8 | "No two-day weekend, either. People had to fight for that one." | Plants the labor episode |
| 9 | "...never got any bigger." | The wire scheme's punchline is the clue that caught it |

## Connections to today (all evergreen: no brands, prices, apps or current events)

| Ch | Bridge to now | Evergreen check |
|---|---|---|
| 2 | The necklace that turns your neck green; the time zone you're in started with the railroads (North America) | Jewelry and time zones won't date |
| 3 | The steel frame in every tall building; the electric bill and its meter | Both are permanent |
| 4 | "the white stuff in your kitchen" | Sugar won't date |
| 5 | "A machine taking someone's job isn't a new worry. Ask a weaver in 1847." Investing: money earning money | Works for any new technology without naming one |
| 5 & 6 | The pizza place: owning every step (vertical) vs buying every pizza place in town (horizontal) | A plain analogy, no brand |
| 6 | The delivery company that charges your rival full price and refunds you (a rebate); Monopoly, the board game | Both evergreen |
| 8 | Minimum wage, the two-day weekend: things that didn't exist yet | Evergreen; no politics |
| 9 | "People walk across it every day." | True as long as the bridge stands |

## Production notes

- **Picture plan:** the look-dev scenes map onto chapters: the bridge (ch 1, 9), the street walk and the tenement cutaway (ch 1, 7), the
  Bessemer x-ray (ch 3), the refinery tour (ch 4), the weaver's son (ch 5), the vertical-integration explainer (ch 5), the
  horizontal-integration explainer with the rebate and "bought: N of 26" (ch 6), the wire x-ray and detour map (ch 9, to build).
  Still to build: Edison's bulb-to-system pull-back, the time-zone map, Rockefeller's childhood and ledger, the solder can, the
  two-views card. Full shot list: `../ANIMATION_PLAN.md` (to re-time against this draft).
- **The squeeze (your note, Nov 7):** ch 6 now runs the chain in order: rebate → cheaper shipping → lower prices → rivals losing
  money on every barrel → "sell to me now... or keep going, and go broke" → 22 of 26. The horizontal-integration explainer needs one
  more beat between the rebate and the buyouts: Standard's price tag drops, the rivals' tags follow, their cost bars go red, then the
  buy-out offers land one by one.
- **"Vertical" said and shown:** ch 5's "stack the steps... he owns the whole column" lands on the stack animation; ch 6's "line them up
  side by side... the whole row" lands on the row. The compare card can close ch 6.
- **The Kellys are a composite:** said once in ch 1 ("He's made up. But everything that happens to him really happened to people like
  him.") plus an on-screen tag.
- **No heavy chapter** in this episode. Ch 4 (the heat) and ch 7 stay plain, not jokey.
- **Plug:** end of ch 7 (about 80% in), after the climax twist, while the wire loop is still open. Thank-you after the closing line.
- **One-second beat** after the cold open's last line, then the Chunk intro.

### Vocab cards (index card, orange tape)
gilded · gilt (the thin layer itself, restated in ch 9 before the closing question) · industrialization · Bessemer process · vertical integration · rebate · horizontal integration · monopoly · trust ·
laissez-faire · free market · entrepreneur · captains of industry / robber barons (one two-views card)

### Loop map

| Loop | Opens | Closes |
|---|---|---|
| The bad wire | ch 1, first sentence | ch 9 |
| How did America get so rich, so fast, and who got the money? | ch 1 | ch 9 ("So how did America...") |
| Two boys poorer than Michael (a machine; a con man) | ch 1 | ch 5, ch 6 |
| "the name is an insult" | ch 2 open | ch 2 (gilded) |
| Rails "about to get very cheap" | ch 2 end | ch 3 |
| "the two richest started out poorer than Michael" | ch 4 end | ch 5 |
| "He'd quit at 35" | ch 5 | ch 5 ("He did not") |
| The trust | ch 6 end | ch 7 (it comes to Brooklyn) |
| Heroes or villains? | ch 8 | ch 8 (both readings; no verdict) |
| Who got the gold? | ch 9 | Episode 2 onward |

## Cut menu: from 12:32 to 10:00 (pick what goes; about 270 words)

Ranked from least to most painful. Seconds at 165 words a minute.

| # | Cut | Ch | Words | Saves |
|---|---|---|---|---|
| 1 | "Inventions came in a flood: the telephone, the typewriter, electric light." → start at "You've probably heard..." | 3 | 11 | 4 s |
| 2 | "[thoughtful] It turns out to be the whole story, in miniature." | 1 | 10 | 4 s |
| 3 | Shorten the Twain line: "A novel from 1873 mocked greedy businessmen and crooked politicians. Its title: *The Gilded Age*." | 2 | 9 | 3 s |
| 4 | "Most likely, Rockefeller's kerosene. One monopoly lighting the table, after a day working for another." | 7 | 15 | 5 s |
| 5 | The answer paragraph in ch 9 shortened to two sentences | 9 | 25 | 9 s |
| 6 | The solder story (39 drops instead of 40) | 6 | 35 | 13 s |
| 7 | The red notebook and the father's loan ("His father charged him interest.") | 6 | 40 | 15 s |
| 8 | The time zones ("Some towns heard noon twice") | 2 | 55 | 20 s |
| 9 | The telegraph job and the railroad boss, folded into one clause | 5 | 15 | 5 s |
| 10 | The rebate analogy ("Imagine the delivery company...") | 6 | 17 | 6 s |
| 11 | The wire's safety margin ("built six times stronger...") | 9 | 17 | 6 s |
| 12 | The board-game aside | 6 | 9 | 3 s |

Since this menu was first written, the Kellys' lines (about 40 words) and the rebate chain in ch 6 (about 45 words) went in, so the
draft now runs about 12:24. Cuts 1 to 8 save about 200 words (about 1:13); all twelve, about 260 (about 1:35), so about 10:50.
Cut 10 (the rebate analogy) is no longer recommended: the rebate now drives the whole squeeze. Reaching 10:00 now also means
cutting a whole beat (the Edison myth, or Rockefeller's childhood down to two sentences). My recommendation: let this episode run
about 11 minutes; it has the most ground to cover of the six.

## Pronunciation (for ElevenLabs)

| Word | Say it |
|---|---|
| Carnegie | Car-NAY-ghee (hard g, as in "get"; how he said it; respelling picked by ear Nov 7) |
| Havemeyers | HAYV-my-ers |
| Bessemer | BESS-uh-mer |
| laissez-faire | LESS-ay FAIR |
| Rockefeller | ROCK-uh-fell-er |
| idolatry | eye-DOLL-uh-tree |
| solder | SOD-er (American) |
| Pittsburgh | PITS-burg |

## Fact-check flags (new in this draft; the rest are in `../RESEARCH.md` §8)

| Script says | The record | Why the wording is safe |
|---|---|---|
| "a hundred and fifty thousand people walked across it" | About 150,000 crossed on opening day, May 24, 1883 | Solid |
| "some of the steel wire... had already failed its safety test" | Haigh's swap put rejected wire into the cables (caught 1878) | Solid; "some", no tonnage |
| "If you live in North America, the time zone you're in... started with the railroads" | U.S. and Canadian railroads adopted standard time Nov 18, 1883; Congress made it law in 1918; zones elsewhere came from other countries | Limited to North America; "started with" (boundaries have moved since) |
| "Iron snaps. Steel bends." | Cast iron is brittle; steel is tougher and more ductile | A simplification for the audience; fine |
| "Minutes, not a day." | A Bessemer blow took 10 to 20 minutes | Solid |
| "Inventions came in a flood: the telephone, the typewriter, electric light." | Telephone patent 1876; the first commercial typewriter (Sholes and Glidden) 1874; Edison's lamp 1879 | Solid |
| "Other inventors got there first." | Swan and others had working bulbs; Edison made a long-lasting one and the system | Solid (myth beat) |
| "a meter to measure what you used" | Edison's chemical meter was used to bill Pearl Street customers from 1882 | Solid |
| "Filtered through charcoal made from animal bones" | Bone char was the standard sugar filter in 19th-century refineries | Solid |
| "Ten hours or more. No work, no pay. And there's always another man at the gate who wants his job." | Shifts of at least ten hours; day wages; a large pool of unskilled labor | Characterization of Michael, consistent with the record |
| "When Andrew was 11, a steam-powered weaving factory opened" | 1847; born Nov 1835 | Solid |
| "At 12... a cotton mill near Pittsburgh. Twelve hours a day, for one dollar and twenty cents. A week." | Bobbin boy in Allegheny City, $1.20 a week | Solid; "near Pittsburgh" covers Allegheny City |
| "taught himself to read the telegraph's clicks by ear" | His own account and a fellow operator's | Hedge-free phrasing avoids "first to" |
| "the customer he wanted most" | Edgar Thomson Works, named for the Pennsylvania Railroad's president; the railroad ordered its first rails | Solid |
| "He had plenty, he wrote, and chasing more money was 'one of the worst species of idolatry.' ... He'd quit at 35." | The 1868 memo (Carnegie Birthplace Museum transcription) | Solid; quote exact |
| "he lent 50 dollars of his turkey money to a neighbor, and got it back with interest" | $50 at 7%; age varies by source | "As a boy", no age |
| "His father charged him interest." | $1,000 at 10% | Solid |
| "He liked to tell how he once got a machine to seal oil cans with 39 drops of solder" | His own retelling | Framed as his story |
| "In 1872... 26 oil refineries. In about six weeks, he bought 22 of them." | 22 of 26 (most sources); 21 (one) | Solid with flag |
| "Cheaper shipping meant he could sell his oil for less. So his rivals had to cut their prices too, until they were losing money" | Rebates let Standard undersell rivals; price cutting to squeeze competitors is documented (the 1879 Hepburn Committee, later court findings) | Solid in substance; general, not tied to one refinery |
| "sell to me now, while your business is still worth something... or keep going, and go broke" | Rivals described Standard's offers (cash or Standard stock) as take it or be ruined; Rockefeller said he offered fair prices to rescue a failing industry | Framed as the offer's logic; the next line gives both sides ("glad to sell" / "no choice") |
| "Some owners were glad to sell. Others said they felt they had no choice." | Both on the record | Balanced |
| "By about 1880... about 90 percent" | About 90% of U.S. refining by 1879 to 1880 | Solid |
| "Yes, like the board game. Which started out as a warning." | Monopoly grew out of *The Landlord's Game*, patented by Lizzie Magie in 1904 to show how owning everything (there, land) leaves everyone else broke | Solid; "a warning" is fair to her stated aim |
| "Back in Brooklyn, in 1887... most of the others, joined one sugar trust." | Sugar Refineries Company, Oct 1887, under Henry O. Havemeyer | Solid; "most of the others" |
| "If he didn't like the pay, there were a lot fewer places to go." | An inference: one employer in place of rivals | Plain and modest |
| "Most likely, Rockefeller's kerosene." | Standard Oil refined about 90% | "Most likely" carries it |
| "more land than all of California" | About 130 million acres of federal grants; California is about 104 million acres | Solid |
| "No two-day weekend, either. People had to fight for that one." | The five-day, 40-hour week spread through union campaigns in the early 1900s and the 1938 federal law | Solid in substance |
| "The bridge had been built six times stronger than it needed to be. Even with the bad wire, it held." | Designed about 6x; afterward about 4x to 5x; 150 extra wires per cable | Solid |
| "Carnegie and Rockefeller became two of the richest people who ever lived." | Standard claim; Rockefeller often ranked the richest American ever, adjusted | Solid |

## Sources

All sources from `../RESEARCH.md`, plus:
- Monopoly's origin: Mary Pilon, *The Monopolists* (2015); Elizabeth Magie's patent for *The Landlord's Game*, U.S. Patent 748,626 (1904).
- Bone char in sugar refining: Encyclopaedia Britannica, "bone black" and "sugar: refining".
- Bessemer blow times: the 1911 Encyclopaedia Britannica, "Iron and Steel"; chemeurope, "Bessemer process".
- The five-day week: U.S. Department of Labor, history of the Fair Labor Standards Act (1938).
