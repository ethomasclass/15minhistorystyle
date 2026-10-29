# They Fooled America's Richest Men: scene plan

Narration is voiced (Ellis, `eleven_v4`, one take per chapter; `public/audio/chNN_*.wav` + `.words.json`, 14:56 total). Build every
scene on the real word timings (`makeTimeline(N, 30)`, `t.at('phrase')`). Script and notes: `script/SCRIPT.md`. Thumbnail: H1.

## The look for this video

Three layers of picture, each with its own job, all on the dark notebook desk:

| Layer | What | Jobs in this video | Colour |
|---|---|---|---|
| **Archival** | Real people, places, papers: portraits, O'Sullivan's survey photos, period newspapers and engravings | Who and where; proof; every real person | B&W, one coral subject + teal trace, source `Tag` on every one |
| **Cut-out props** (Halloween's `Prop`) | Period objects shot photoreal on plain backgrounds, cut out, dropped on the desk with a slap | The con's physical evidence: the bag, the stones, the stake, the loupe | B&W, coral on the one that matters; no tag, never "AI" on screen |
| **Silhouette scenes** (Halloween's `SilScene`) | Layered shadow-puppet paintings, foreground black, hazy layers behind, multi-plane parallax | The things nobody photographed: night salting, the long ride, the dawn race, the crowd at the bank | Their own colours, **a palette per scene to match its mood** (the user: "other colors… whatever matches the vibe"); each has one light source |
| **Drawn 3D** (West's `Desk3D`, `map3d.tsx`, three.js like Halloween's `fx/`) | Teal-line terrain, cutaways, tiles on the desk | Explaining how: the salted patch, the looping ride, the geology, the dominoes, the bank vault | Teal lines on black, one coral element, "not to scale" where it isn't |

**Recurring pieces**
- **The bag** (prop `leather_pouch`): the video's object. Cold open, ch 2 (Arnold holds it "like it might bite him"), ch 3 (the bigger
  bag), ch 5 ("There was a bag."), ch 9 recap ("The bait: a bag of diamonds"). Same prop, same coral, every time.
- **The Con Card** (small slip, lower corner, 3–4 s, only when a move is named): ch 1 flash of the empty card at "six moves"; ch 2
  rows 1–2; ch 4 row 3; ch 5 row 4; ch 6 rows 5 and 6; ch 9 full card, checked off one by one, gone before the closing line.
- **The dominoes** (3D tiles): ch 8 four tiles stand, each named and tipped; "For now." they stand back up; ch 9 "Remember those
  dominoes?" they fall for real.
- **Money tags**: every converted number is big in Abril (**$15 million**) with the 1872 figure small under it in mono
  (*$550,000 in 1872*). First appears at ch 3's money note as a two-line exchange-rate card (**$1 then ≈ $27 now**).

**Pace and depth** (`explainer-craft.md` §6, the West rules): wide shot then a detail cut-in per beat, a cut every 3–6 s, one
camera move per shot, slap and settle on props, lamp pool and contact shadows on the desk, grain over everything.

## Assets to make or find

### Archival (search first; LOC TIFF masters for anything we zoom into)
| Image | Where it's used |
|---|---|
| William Ralston portrait | ch 2 "That banker was William Ralston"; ch 8 domino three; ch 9 |
| Bank of California building, San Francisco (1860s–70s photo) | ch 2 "too late for the bank"; ch 8 "walked into Ralston's bank"; ch 9 1875 |
| Comstock silver mine / Virginia City photo | ch 3 "Nevada silver" |
| South African diamond diggings (Kimberley, c. 1871–72 photo or engraving) | ch 3 "Diamonds had just turned up in South Africa" |
| Charles L. Tiffany portrait | ch 4 (the coral subject), ch 6, ch 9 |
| McClellan, Butler, Greeley portraits | ch 4 "two famous Civil War generals… newspaper editor" (three small cards) |
| Madison Avenue / Manhattan street 1870s | ch 4 opening wide |
| Henry Janin portrait (if one exists) | ch 5; otherwise a silhouette and his report's title page if findable |
| Union Pacific at Rawlins, Wyoming (1868–72) | ch 5 the trip |
| Timothy O'Sullivan, 40th Parallel Survey photographs (King's camp, the country, the survey team) | ch 7 heavy use |
| Clarence King portrait (c. 1869–72) | ch 7 coral subject; ch 8 |
| Samuel F. Emmons portrait | ch 8 "one of King's own men" |
| *San Francisco Chronicle* / *Daily Alta California*, Nov 26, 1872 ("UNMASKED!", "THE MAMMOTH FRAUD EXPOSED") | ch 8 the papers (DocLift + swipe "most gigantic and barefaced swindle") |
| Panic of 1873: Frank Leslie's / Harper's engravings (run on a New York bank, the closed Stock Exchange) | ch 8 "Does that sound far-fetched?" |
| Run on the Bank of California, Aug 1875 (period engraving or photo) | ch 9 the 1875 run |
| Philip Arnold portrait | ch 2, ch 6, ch 9 |
| Henry rifle (period advertisement or museum photo) | ch 9 "a good Henry rifle" |
| Period mining claim notice / plat | ch 3 "staking a claim"; ch 5 3,000 acres |
| A real stock certificate of the San Francisco and New York Mining and Commercial Company, if one survives | ch 5 shares, ch 6; otherwise the generic prop below |

### Cut-out props (Gemini, photoreal catalog style on white, `tools/prop_cut.py` as in Halloween; ~13¢ each on Pro, 4¢ on Flash)
`leather_pouch` (hero, drawstring, worn) · `rough_diamond` (cloudy, uncut: hero stone) · `rough_rubies` (a few) · `stone_pile`
(mixed uncut gems spilled) · `diamond_drill_bit` (1870s rock-drill crown with industrial diamond tips) · `claim_stake` (wooden stake
with a blank paper notice nailed on) · `jeweler_loupe` · `lantern` (tin miner's lantern) · `pointed_stick` · `bandana_blindfold` ·
`slouch_hat` · `top_hat` · `share_certificate` (generic engraved certificate, **no legible text or company name**) · `banknotes_stack`
(1870s-style bills, no legible text) · `cup_of_sugar` (tin cup, for the short-sale line) · `pocket_watch` (ch 8 clock) ·
`undertaker_coffin` (plain pine coffin, ch 9) · `domino_tile` (if the dominoes are props rather than 3D). About 18 props.

### Silhouette scenes (Gemini 3 Pro Image, 2K 16:9, one style paragraph for all; `tools/layers.py` for parallax planes)
Style (one paragraph shared by all, from Halloween): foreground solid black with crisp detail in the outlines (sagebrush, rock,
hats, horses, wheels); behind it two or three layers of distance in progressively lighter, hazier flat tones; a big sky; **one light
source per scene** (a lantern, a window, a fire, the sun on the horizon, a stone's glint). Period-accurate (1870–75). No text, no
recognizable person. **Palette per scene** (the user: other colours are fine, whatever matches the vibe), named in each prompt:
| Scene | Beat | Palette (mood) |
|---|---|---|
| `sil_sf_night` | ch 2: a gaslit San Francisco street at night, two men with a bag heading for one lit office window; the bank next door dark | fog indigo and blue-grey, warm gaslamp amber (secretive) |
| `sil_salting` | **ch 5 hero:** night on the mesa, two figures with a lantern kneeling by anthills, one pressing a stone in with a stick | midnight blue to violet under a full moon, lantern amber, a coral-red glint of a ruby (the crime) |
| `sil_ride` | ch 5: a line of riders crossing ridges, one blindfolded, the leader pointing the wrong way | hot afternoon: burnt orange, ochre, dusty tan, white sun (disorienting heat) |
| `sil_fever` | ch 6: prospectors fanning out across the desert with pans and picks at sunrise | rose gold, peach and pale lilac sunrise (optimism, greed) |
| `sil_train` | ch 7 opener: a train crossing California hills, one lit car window (the meeting on the train) | dusk: deep green-teal hills to plum sky, one gold window (chance) |
| `sil_cold_mesa` | ch 7: King's party on horseback in snow on the mesa, a small campfire | icy blue, grey and snow white, one orange campfire (the cold truth) |
| `sil_stranger` | ch 7: a lone rider coming over the rise toward the camp (the dealer) | blood-orange and red sunset, long shadows (a threat) |
| `sil_dawn_ride` | **ch 8 hero:** a lone rider at full gallop before dawn, the far-off smoke of a train on the horizon | cold steel blue to a thin pale-gold horizon line (the clock running out) |
| `sil_bank_line` | ch 8 domino three (generic) and ch 9 1875: a crowd packed outside a stone bank's doors (archival first for 1875) | overcast grey-green, sickly yellow lamplight in the doorway (dread) |
| `sil_bay_dusk` | ch 9, heavy beat: the empty bay at dusk, no figure, still water | muted slate and dusty lavender, a faint low sun (quiet, grief) |
| `sil_undertaker` | ch 9: a small adobe New Mexico street, one lit workshop window, a coffin leaning by the door | late-afternoon terracotta, adobe pink and sand (dry irony) |

### Drawn 3D builds
| Build | Beat | How |
|---|---|---|
| **H1 in depth** (cold open) | Frame 0 = the thumbnail without its words: cousins foreground, tycoon mid, desk back, a slow dolly in | Thumbnail assets on `Desk3D` planes |
| **The mesa** | ch 5 salting → ch 7 King finds it | A tilted teal-contour terrain slab of the Colorado–Wyoming corner ("not to scale"); the salted patch glows; coral points drop in on "Pressing them into the dirt" |
| **The looping ride** | ch 5 "Arnold keeps getting lost" | On the same terrain: Rawlins pin, the straight line to the mesa (dashed), then the real route drawing itself in loops and doubling back |
| **The money map** | ch 3 → ch 4 | `map3d` slab: San Francisco → London (purchase, orange dashed) → New York (Tiffany); a bag icon travels |
| **Where gems are born** | ch 7 "form in very different kinds of rock" | A 3D cut-away of the earth, three columns: diamond deep in a pipe, ruby in marble, sapphire in another rock; then all three lifted onto one surface with a red X |
| **The anthill cut-away** | ch 7 the boot prints | An anthill sliced open: a ruby about eight inches down at the end of a stick hole; boot prints around in coral, untouched anthills plain |
| **Shares as slices** | ch 5 "A share is a small slice of ownership" | A block (the company) sliced into thin slices; one slice lifts and grows when "strikes it rich"; Janin's stack of 1,000 |
| **The short sale** | ch 7 | Four lanes left to right: BORROW (a share slides in, with the cup of sugar prop) → SELL (+$1,000) → CRASH (the share shrinks to $20) → RETURN (keep $980). One coral share token travels the lanes |
| **The dominoes** | ch 8 → ch 9 | Four tall tiles in three.js on the desk, labelled INSIDERS · CRASH · BANK · EVERYONE in orange tape; each tips on its line; reset at "For now."; the real fall in ch 9 |
| **The bank vault** | ch 8 domino three | A cut-away bank: deposits pour in, most flow out the side as loans (to houses, shops, mines), a thin layer stays in the vault; then the line forms and the vault empties |

## Chapter by chapter

### ch01 · Paid for Dirt (cold open, 61 s) → 1 s beat → channel intro → title
1. **0 → "By the time"**: H1 in depth at frame 0 (no fade), camera already pushing in. The coral stone in the tycoon's hand.
2. "eighteen million dollars" → money tag **$18 million** / *$660,000 in 1872*.
3. "Bankers. Generals. The most famous jeweler" → three quick archival cards slap down (Ralston, McClellan, Tiffany), no names.
4. "two guys in slouch hats" → back to the cousins' backs (H1), Note "these two".
5. "A diamond field" → the mesa 3D slab, wide, stones glinting; "sitting in anthills" → push into one anthill, a coral glint.
6. "The diamonds were real" → `rough_diamond` prop slaps down, coral; "The diamond field wasn't" → the slab's colour drains.
7. "So how do two cousins" → the question in orange tape over the H1 picture.
8. "six moves" → the Con Card flashes, empty, 1 s. "those anthills" → anthill again, brief.
9. "a knock on an office door" → `sil_sf_night`, one lit window. Then the beat, the intro, the title.

### ch02 · Too Late for the Bank (82 s)
1. "San Francisco" → `sil_sf_night` (parallax), Highlight "SAN FRANCISCO, 1870".
2. "They're cousins" → Arnold portrait cut-out (coral) + a placeholder card for Slack (silhouette slouch hat, Note "no reliable photo").
3. "a small leather bag like it might bite him" → `leather_pouch` slaps onto the desk with a small shake.
4. "Bank of California" → archival bank photo, Note "closed"; "Could he keep it safe?" → back to the bag.
5. "Rough diamonds" → the bag tips, `stone_pile` spills, coral on the diamonds; `Definition` {rough diamonds}.
6. "Somewhere secret" → a blank map of the West with a big teal "?" (no pin).
7. "the mark" → `Definition` {mark}; Con Card pop-in, row 1 THE BAIT ("show the mark something he already wants"), row 2
   PLAY HARD TO GET.
8. "find a banker" → Ralston portrait slaps down (coral), Highlight "WILLIAM RALSTON".
9. "Why would a man like that believe" → Ralston and the bag side by side, teal "?".

### ch03 · Everybody Wants a Diamond Mine (86 s)
1. "Because he wanted to." → hold on Ralston, push in.
2. "Nevada silver" → Comstock photo; "South Africa" → diamond diggings; "So why not here?" → the map of the West, a coral glint.
3. "Quick money note" → the exchange-rate card **$1 then ≈ $27 now** (coins stack to 27).
4. "a bigger bag… 16 million dollars" → the bag again, bigger, money tag.
5. "That's the trick" → `diamond_drill_bit` prop, push into the tips; Note "cheap, flawed diamonds".
6. "nearly three million dollars for a piece of their claim" → money tag; then `claim_stake` prop hammered in (4 stakes drop
   around a square on the desk) with `Definition` {staking a claim}.
7. "To London" → the money map: SF → London, orange dashed arc; Note "fake names"; "Rejects." → stones fall into the bag.
8. "somebody famous to call them treasure" → the map arc continues toward New York.

### ch04 · The Tiffany Test (65 s)
1. "New York… Madison Avenue" → Manhattan photo wide; three small cards (two generals, Greeley) slap in a row.
2. "And Charles Tiffany" → Tiffany portrait, coral, teal trace.
3. "holds them up to the light" → `jeweler_loupe` + `rough_diamond` props, a light flare.
4. The quote → `SyncQuote` word by word, attributed "Charles L. Tiffany, 1871".
5. "about four million dollars" → money tag; "Forty million dollars." → a `Stamp`, the bag swelling.
6. "move three: borrowed trust" → Con Card row 3.
7. "Tiffany sold cut and polished diamonds" → a split: a cut gem (sparkle) vs a rough stone (dull), Note "not the same thing".
8. "Somebody had to go stand on that diamond field." → push in on a blank mesa slab, empty. Hold.

### ch05 · The Long Way Around (113 s)
1. "There was a bag." → the bag alone on the desk. "made one" → the mesa slab.
2. "Picture a flat, empty mesa" → `sil_salting` (hero, slow parallax), lantern glow; "Pressing them into the dirt" → the 3D slab,
   coral points drop in one by one; "Poking them into anthills" → `pointed_stick` prop.
3. "That's called salting" → `Definition` {salting}.
4. "Henry Janin" → portrait (or silhouette) + Highlight "THE EXPERT"; "Four days on horseback" → `sil_ride`; "keeps getting lost"
   → **the looping ride** on the terrain; "blindfolded" → `bandana_blindfold` prop + Note "by one account".
5. "start finding stones" → the slab's coral points light up under a teal circle.
6. "3,000 acres" → four stakes on the slab, a big square.
7. "shares" → **shares as slices**; "about a thousand dollars each" → money tag.
8. "And Janin would know" → Janin's stack of 1,000 slices, quarter price → full price, money tag **$800,000**, Note "for saying yes".
9. "move four: the proof" → Con Card row 4.
10. "getting out with the money" → the bag closes, slides off the desk.

### ch06 · Diamond Fever (70 s)
1. "The new company" → `share_certificate` prop (or the real one), money tag **over $270 million**.
2. "One of those generals. The Rothschild banking family. Tiffany himself." → three cards drop onto the certificate.
3. "Newspapers printed how-to articles" → a period newspaper column ("Lessons in Diamond Mining", Laramie, 1872, if found);
   "Prospectors fanned out" → `sil_fever`; Highlight "DIAMOND FEVER".
4. "move five: the rush" → Con Card row 5.
5. "a smart con man leaves" → Con Card row 6 at "the exit"; money tags for Arnold and Slack; `banknotes_stack` sliding off-frame.
6. "Arnold went home to Kentucky" → Arnold portrait shrinking away on a map of the US; "Slack just disappeared" → his placeholder
   card fades to nothing.
7. "a geologist got on the wrong train" → `sil_train`.

### ch07 · The Anthills (123 s)
1. "A train in California" → `sil_train` (lit window); "Henry Janin is showing off his diamonds" → `rough_diamond` in a palm.
2. "men from a government survey" → O'Sullivan photo of the survey party; "Clarence King" → King portrait, coral, Highlight.
3. "They'd mapped that part of Colorado" → an O'Sullivan landscape + the survey's map, "no diamonds" Note.
4. "form in very different kinds of rock" → **where gems are born** cut-away, then the red X.
5. "Five days on horseback, in the cold" → `sil_cold_mesa`.
6. "about a dozen rubies near it" → on the mesa slab, one diamond with exactly 12 ruby points in a ring; counter 1–12; "Nature is
   not that tidy." Note.
7. "Then they looked at the anthills" → **the anthill cut-away** (the long loop closes): boot prints coral, the stick hole.
8. "Then a stranger rode up" → `sil_stranger`; the quote → `SyncQuote`.
9. "To sell short" → `Definition` {sell short}; **the short sale** lanes; "like borrowing a cup of sugar" → `cup_of_sugar` prop pops
   in the BORROW lane (the joke lands on the prop).
10. "King wanted to warn everybody. The dealer wanted a head start." → split screen: King (coral) and the stranger's silhouette.

### ch08 · The Dominoes (154 s)
1. "a lot bigger than one bad stock" → the desk clears; four domino tiles rise into place.
2. Domino one / two / four → each tile named in tape and tips into the next on its line (stopping just short of the next).
3. Domino three → Ralston portrait on the tile; "a bank doesn't keep your money in a vault" → **the bank vault** cut-away;
   "That's called a bank run" → `Definition` {bank run} over `sil_bank_line`.
4. "Paychecks stop. Savings disappear." → quick cards: a closed shop, an empty pay envelope (props or archival).
5. "Does that sound far-fetched?" → Panic of 1873 engraving, Highlight "1873", Note "the very next year".
6. "the dominoes got taller" → the tiles grow; `pocket_watch` ticking.
7. "He left before dawn" → `sil_dawn_ride` (hero, fastest parallax in the video); "November 10th" → a date stamp.
8. "convincing Janin he'd been fooled" → Janin's portrait under a lamp, clock hands spinning.
9. "walked into Ralston's bank" → bank photo; "a fraud" → Stamp FRAUD.
10. "a director suggested King might wait" → Note "Domino one, right there in the room" with tile 1 wobbling.
11. King's quote → `SyncQuote`, King's portrait coral. **Music drop** just before "There is not enough money".
12. "the story hit the papers" → the Nov 26, 1872 front page, DocLift + swipe on "most gigantic and barefaced swindle".
13. "The dominoes stayed standing. For now." → the tiles stand back up, still.
14. Plug: the small teal "subscribe ↓" note over the standing tiles. "Which is exactly what a con man would say" → the tycoon from
    H1 glances at the camera (a 2-frame head turn, or a wink Note).
15. "where did all that money go?" → the bag, empty.

### ch09 · Where the Money Went (133 s)
1. "Most of it went home with the cousins" → `banknotes_stack` leaving with Arnold's card.
2. "a good Henry rifle" → Henry rifle (archival ad or prop), Note "not a lawyer".
3. "then became a banker. Of course he did." → Arnold card + a bank façade, coral Note "of course".
4. "a shootout" → a quick period engraving of a street fight or a silhouette flash; no gore.
5. "You may have heard that he vanished. He didn't." → Slack's placeholder card re-appears; `sil_undertaker`; `undertaker_coffin` prop.
6. **Ralston (heavy beat, `quiet` palette for this stretch, no jokes):** "Remember those dominoes?" → the 3D tiles fall, for real,
   all four; "people lined up" → the 1875 run (archival, or `sil_bank_line`); "two thirty-five" → a clock face stopping at 2:35;
   "went for his usual swim" → `sil_bay_dusk`, slow, no figure; hold a beat after "nobody knows if it was an accident."
7. "So let's go back to the question." → back to H1, wide.
8. The six moves → the full Con Card, each move checked off as it's said (with the bag, the secret map, Tiffany, the mesa, the
   certificate, the empty bag as tiny thumbnails per row).
9. "A mark who wants it to be true" → the tycoon in coral, push in on his face. "Check the list." → the card, then gone.
10. "The diamonds were real. The field was dirt." → H1 picture, the stone in his hand drains from coral to grey on "dirt".
    "And the richest men in America paid for it." → hold, then the end screen with the thank-you.

## Open choices for the user
1. **AI budget:** about 18 props + 11 silhouette scenes ≈ 29 Gemini images (≈ $4 on Pro). Archival first for every real person and event.
2. ~~Silhouette palette~~: decided, a palette per scene to match its mood (table above).
3. **Arnold's and Slack's faces:** Arnold has a portrait; the photo said to show both cousins has a disputed caption. Proposed: Arnold's
   portrait, and for Slack a silhouette card with "no reliable photo" (honest, and it pays off "he vanished").
4. **Music:** reuse first (the Balloon War "they fooled everyone" cue; the `hb_` and West cues), then a Suno doc for gaps.
