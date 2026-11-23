# Ep 1 "The Pitch Meeting": scene plan (draft 4 script)

What every scene needs, chapter by chapter: the line it sits on, what's on screen, how it's made, how the camera gets in
and out of it, and the assets it needs. Times come from the draft 4 voice (`public/audio/*.words.json`); scenes are keyed
to words, so a re-voice re-times them. Times are narration time (11:28 in all); the channel intro and title card add
about 10 s after chapter 2. Replaces the visual notes in `../EP1_PITCH_MEETING_OUTLINE.md`.

## The four visual languages, one job each

| Language | Its job | Look | Made with | Proven by |
|---|---|---|---|---|
| **World** | Places and people: where it happened, who was there | Low-poly diorama, flat-shaded, hard sun, haze; people from the Quaternius kit in fitted period clothes | Blender (`blender/coldopen.py`, `look.py`, `tests/blender_church/`) | The cold open (v2), the church test |
| **Explainer** | Ideas, causes, numbers, maps, definitions | Flat vector in the brand palette on the warm desk: cut-corner tablets, orange strip labels, teal draws, coral is Hawaiʻi; pops at 12 fps, moves smooth | SVG frames (`tools/vec_test.py`, Hawaiʻi kit) | Chapter 5 test |
| **Voice** | Anything quoted | Vector quote card: a portrait traced from the period image, name on the orange strip, words in on their spoken time, teal underline, traced signature | `tools/vec_quote.py`, `tools/vtrace.py` | Jefferson test |
| **Evidence** | The real thing: documents and photographs | Archival scans on the dark desk, the channel's marks (swipe, underline, circle), mono source tags | Hawaiʻi kit desk pieces (`tools/ep.py`), `img/archival/` | Petition light table (Hawaiʻi sample 3) |

**Transitions** (the magnates style) are what make it one film instead of four: continuous camera moves that pass
through something into the next language. Through a window, into a picture on an easel, down onto a map that rises into a
3D island, along a document into the world it describes. Every chapter has at least one, and no chapter cuts to black
except at the logo breaks. Hard cuts are kept for the deadpan humor cuts and the Declaration line.

**One hero moment per chapter** (marked ★): the shot that gets the most time and polish.

## The recurring pieces

- **The Declaration line.** The real parchment, "consent of the governed" large: one teal underline (ch 6, Bayonet
  Constitution), a second (ch 6, the flag), circled (ch 9). Same camera, same frame, same silence every time.
- **The George III callback** (ch 7). The parchment, the grievance lights up, "He has" is struck, "We have" written over
  it. Its own sound, the series' signature.
- **The Ledger** (ch 9). A vector ledger card, three columns, filled in its handwriting. Same place every episode.
- **The flag on the palace tower.** Hawaiian flag in the cold open; the same shot in ch 8 with the U.S. flag. Bookend.
- **The Queen's window.** First image of the episode and the last reversal in ch 9.

## Chapter by chapter

Columns: **Line** is the word the scene starts on. **How** is the language (W world, E explainer, V voice card, D
evidence). **Status**: done / build / adapt.

### 1-2 · The Locked Room, The Question (0:00 to 0:56)

| Line | Scene | How | Assets | Status |
|---|---|---|---|---|
| "The Queen of Hawaiʻi is a prisoner" | The room: the Queen at the window from behind, camera drifting in | W | Blender cold open | done (v2, rendering) |
| "There's an armed guard" | The hall: the guard at her door, at attention | W | cold open | done |
| "The men who put her here" | Close behind her at the window | W | cold open | done |
| "In 1776" ★ | **Pull back out of her window**, past the veranda, crane up to the whole palace, Hawaiian flag flying; sentries and patrol on the grounds. The camera keeps rising until the palace is small, the frame tilts down onto the desk and the flag becomes the corner of the **Declaration** parchment (match on the flag's stripes) | W → D transition | cold open + a new 4 s tail; Declaration scan | adapt (add the tail) |
| "the consent of the governed" | The parchment, the line large (the running cut's first frame, no marks yet) | D | `img/raw/declaration_5000.jpg` | build |
| "called their government a republic" | Back to the palace wide, a slow push on the flag | W | cold open frame | done |
| "betraying its own ideals ... or living them out" | **The two-word question card**: BETRAYAL and EXPRESSION on two tablets that tip like a balance and never settle (the series question's graphic, reused in ch 4 and ch 9) | E | new vector piece | build |
| "four arguments" | Four badge silhouettes, unlit (they light up in ch 4) | E | from the ch 5 badges | adapt |
| "First, the old rule." | Hold, then the logo break | | | |

### 3 · The Old Guard (0:57 to 1:53)

| Line | Scene | How | Assets | Status |
|---|---|---|---|---|
| "stay out of it" | A vector globe with the U.S. drawn in, a teal fence going up around its coasts | E | new | build |
| "isolationism" | Definition card: term on the orange strip, its plain meaning typed under, one icon | E | vocab card template (new, reused for every term) | build |
| "Thomas Jefferson" ★ | **Jefferson quote card**: portrait at centre, glides left, "entangling alliances with none" word by word | V | done (test) | done |
| "Alaska from Russia" | The real Alaska purchase check slides onto the desk; "$7.2 million" counts up; a two-cent coin lands on one acre of the Alaska map | D + E | `img/raw/nara_alaska_check.jpg`; vector coin | adapt |
| "Seward's Folly" | Seward's traced portrait, the name on the strip | V | `img/archival/ch03_seward_brady.jpg` | build |
| "gold" (humor cut) | Hard cut: a gold nugget drops on the desk, dull thud, 1 s of nothing | E | vector nugget | build |
| "the frontier" ★ | **The 1890 census map**: the real population map, the camera low across it; settlement shown as ink spreading west over it; the pencil looks for the frontier line and lifts away with nothing drawn | D + E | `ch03_census_1890_population_distribution.jpg` | build |
| "So where next?" | **Transition:** the ink reaches the Pacific coast and beads; the camera slides off the map's edge into open blue sea, which pulls back to reveal it's the wall map in the pitch room | E → W | | build |

### 4 · The Pitch Meeting (1:54 to 4:47)

| Line | Scene | How | Assets | Status |
|---|---|---|---|---|
| "a lot of powerful Americans" | The pitch room in Blender, empty: dark panelling, the long table, the Pacific wall map, the easel | W | **new Blender set** after `c1_pitch_room` | build |
| "nobody ever put them all in one room" (cut) | Hold on the empty room, 1 s of room tone | W | | build |
| "So let's do it for them" | The four pitchers are standing there (cut, no sound) | W | **4 new costumes**: businessman (frock coat, watch chain), naval captain (1890 blue, peaked cap), minister (black coat, clerical collar, book), lecturer (tweed, spectacles, pointer) | build |
| "imperialism" | Vocab card; icons: a big tablet owning small ones outright, then holding them on strings | E | vocab card | build |
| "betrayal ... or an expression" | The two-word question card returns | E | from ch 2 | reuse |
| "The Businessman" ★ | The businessman steps to the easel; the camera **flies into the board** and lands at the **docks**: crates stacked past the warehouse roofs, wheat, cotton bales, steel; a price tag ticking down as the stacks grow | W (portal) | Blender docks after `c5_docks`; easel portal from the church transition test | build |
| "new customers overseas" | Back out through the board into the room | W | | build |
| "The Admiral" | Mahan's traced portrait pops in on "Technically, a navy captain" (the strip says CAPTAIN A. T. MAHAN) | V | `ch04_mahan_portrait_nh126.jpg` | build |
| "ruled the sea" ★ | **The coal gauge map**: a steamship crosses the vector Pacific, its coal gauge draining; it can't make Asia; pins drop for coaling stations and the gauge refills | E | new | build |
| "it is equally vain" | Mahan quote card with the title page of his book sliding in behind; then "Translation:" types under it | V + D | `ch04_mahan_sea_power_title_1890.jpg` | build |
| "Britain, France and Germany" | The 1886 Imperial Federation map (British Empire in pink); French and German colonies ink in; the U.S. alone | D + E | 1886 map (in the image search) | build |
| "Now look at the Pacific" | The camera crosses the wall map to the middle of the ocean; the harbor glints | W | | build |
| "It belonged to a queen" | Hold on Hawaiʻi on the wall map | W | | build |
| "The Preacher" | Through the board into the **mission church** (the Blender church, its congregation); Strong's portrait and *Our Country* title | W (portal) + V | Blender church (done); `ch04_josiah_strong.jpg`, `ch04_strong_our_country_title.jpg` | adapt |
| "The 'Scientist'" | Through the board into a **lecture hall**: a lecturer with a pointer at a chart; Spencer's traced portrait; "survival of the fittest" set as a quote card | W + V | new small Blender set after `c8_lecture_hall_1880s` (batch 2); `ch04_herbert_spencer.jpg` | build |
| "It sounded like science. It wasn't." | Hard cut: the chart's pointer stops; the chart is blank | W | | build |
| "the same man" | The preacher and the scientist pitchers step together; Strong's quote card, "all English-speaking peoples" | V | | build |

### 5 · The Same Islands (4:48 to 5:05)

| Line | Scene | How | Assets | Status |
|---|---|---|---|---|
| whole chapter ★ | **The four badges** (sugar and flag, Oʻahu and Pearl Harbor, the church and three generations, the stamped certificate), converging on the island card | E | done (test) | done |
| end | **Transition: map to world.** The island card's Oʻahu tilts back, the paper relief rises, and the camera dives into the Blender Honolulu harbor | E → W | Blender Honolulu (new) | build |

### 6 · The Heist (5:06 to 8:30)

| Line | Scene | How | Assets | Status |
|---|---|---|---|---|
| "a tax at the border" ★ | **The tariff gate**: a vector border gate with a toll booth; foreign sugar sacks pay at the gate; the Hawaiian sack is waved through (1875) | E | new | build |
| "Plantations boomed" | Blender cane fields and a sugar mill, smoke, workers at a distance | W | after `d1_cane_fields` and `d5_sugar_mill_1880s` (batch 2) | build |
| "Pearl Harbor" | The vector Oʻahu, Pearl Harbor pinned | E | from ch 5 | reuse |
| "King Kalākaua" | Kalākaua's traced portrait; the 1887 constitution document; armed men behind it | V + D | portrait and document (image search) | build |
| "Bayonet Constitution" (cut) | **Declaration line, underline 1** | D | | build |
| "the McKinley Tariff" | The tariff gate again: the toll booth is removed, all sacks walk through; then a coin chute pays U.S. growers two cents a pound; the Hawaiian sack gets nothing | E | tariff gate | build |
| "their sugar would count as American" | The Hawaiian sack gets a little U.S. flag stuck in it; coins drop | E | | build |
| "Liliʻuokalani" | Her traced portrait (the dignified card, no gag anywhere near it) | V | `ch01_liliuokalani_c1898_prince.jpg` or an 1891 portrait | build |
| "the Committee of Safety" (cut) | Hard cut to the committee room at night: rifles laid on the table, snap zoom, silence | W | Blender committee room after `d2_committee_room` | build |
| "This one had help." | Hold | | | |
| "John Stevens" ★ | **Honolulu harbor in Blender** (references: Flow batch 2, `h1`, `h2`, `s4`): USS *Boston* at anchor, boats rowing in, sailors and Marines marching up the street (walk cycles); Stevens's caption lower third ("Not authorized by Congress") | W | Blender harbor, cruiser model, marching column; Stevens portrait | build |
| "interventionism" | Vocab card | E | | build |
| "I yield to the superior force" | Quote card in the quiet palette, the Queen's own words | V | | build |
| "Sanford Dole" | Dole's traced portrait; the strip; a drawn fruit cup beside him (the setup, unexplained) | V + E | Dole portrait (image search) | build |
| "raised the American flag" | Blender: the government building, the U.S. flag going up the pole | W | Blender Aliʻiōlani Hale after `d3_government_building` | build |
| "flag" (cut) | **Declaration line, underline 2** | D | | build |
| "protectorate" | Vocab card | E | | build |
| "Grover Cleveland" | Cleveland quote card: "act of war ..." word by word; the Blount Report title behind it | V + D | Cleveland portrait, Blount title (image search) | build |
| "Washington's answer was no." / "Dole refused." | Two short holds: Cleveland's card; Dole's card. Deadpan | V | | |
| "Republic of Hawaii" | July 4, 1894: the government building with bunting | W | | adapt |
| "his cousin James" | Blender pineapple fields; then the fruit cup payoff: period pineapple-can label with DOLE | W + D | after `d4_pineapple_fields`; can label | build |
| "annexation" | Vocab card | E | | build |
| "a stack of paper" | The Senate desk in Blender, low light: only the edge of a tall stack, unexplained | W | small Blender set after `f1_senate_chamber_1890s` (batch 2) | build |

### 7 · He Has, We Have (8:31 to 8:51)

| Line | Scene | How | Assets | Status |
|---|---|---|---|---|
| whole chapter ★ | **The George III callback** on the parchment: the grievance lights, "He has" struck, "We have" written over it | D | Declaration scan; the strike and write marks | build |

### 8 · Under Protest (8:52 to 10:12), the quiet chapter

Quiet palette (bone and teal, no orange, no coral tint, no gags). Slower camera.

| Line | Scene | How | Assets | Status |
|---|---|---|---|---|
| "brought here, to this room" | The Blender room again, the same angle as the opening, the light later in the day | W | cold open room | adapt |
| "signed away her throne" | The abdication document on the desk | D | image search | build |
| "a fine of $5,000" | The sentence as a quote card in the quiet palette | V | | build |
| "My palace was my prison." | Her portrait card, quiet palette, held | V | | build |
| "21,269 names, on 556 pages" ★ | **The petition on the light table** (rebuild of Hawaiʻi sample 3): the loupe reads the heading, the count runs over the signatures in their own handwriting; then the stack, revealed as the same stack from ch 6 | D | NARA petition pages | adapt |
| "Oh, honest Americans" | Her book's title page, then the quote card, slow, quiet | V + D | title page (image search) | build |
| "annexed Hawaiʻi anyway" | **The palace wide from the cold open**, the same shot: the Hawaiian flag comes down and the U.S. flag goes up | W | cold open wide | adapt |
| "a joint resolution" | Vector: two vote bars, two-thirds against a simple majority | E | | build |
| "at war with Spain" | Vector Pacific map: Hawaiʻi between San Francisco and Manila | E | | build |

### 9 · Back to the Question (10:13 to 11:36)

| Line | Scene | How | Assets | Status |
|---|---|---|---|---|
| "So let's go back to the question" | The two-word question card | E | | reuse |
| "All four pitches" | The four badges light, one by one | E | | reuse |
| "never asked" (cut) ★ | **Declaration line, circled**; 2 s of silence | D | | build |
| "This series keeps a ledger" | The Ledger card fills: said / did / answered back | E | new (series asset) | build |
| "Pearl Harbor" | The base (respectfully; no attack imagery) | W or D | `e1_pearl_harbor_base` or a period photo | build |
| "Congress formally apologized" | The 1993 Apology Resolution page | D | image search | build |
| "the answer is both" | The two-word question card settles level for the first time | E | | build |
| "Except the asking." | **The Queen's window**, the opening image, held | W | cold open | reuse |
| "a ship that blew up in Havana" | The USS *Maine* wreck photo; then a newspaper front page | D | image search | build |

## What to build, in order

1. **Kit pieces used everywhere** (one week of quality in one place): the vocab card, the quote card generalised for any
   portrait (traced, with the quiet-palette variant), the two-word question card, the Ledger card, the Declaration line
   shot (underline, second underline, circle), the George III callback.
2. **Blender sets:** the pitch room with the four pitchers; the docks; Honolulu harbor with USS *Boston* and the marching
   column; the government building with the flag; the committee room; cane fields and mill; pineapple fields; the lecture
   hall; the Senate desk. Each gets the `look.py` finishing pass and one test still before animation.
3. **Transitions:** the window-to-Declaration tail (ch 2), the map-edge-to-wall-map (ch 3 to 4), the easel portal (ch 4,
   from the church transition test), the island-card-to-Honolulu dive (ch 5 to 6).
4. **Explainers:** the tariff gate, the coal gauge map, the census ink, the globe fence, the vote bars, the 1898 Pacific map.
5. **Chapter assembly**, in story order, each as a rough cut for review before polish.

## The quality bar (check every shot)

- Keyed to a word, never to a time. Cuts land 1 to 2 frames before the word.
- Every picture credited in mono; every traced portrait says "(traced)".
- Text never off the frame or inside the outer 5%; run the text probe.
- One idea per shot: if a frame needs explaining, simplify it.
- Brand palette only; coral only for Hawaiʻi and the story's subject; quiet palette in chapter 8.
- Blender people: feet planted, faces plain, clothes fitted; no gliding, no floating props.
- Motion: pops and marks at 12 fps, camera moves smooth, nothing dead still for more than 3 s.
- Check stills of every shot at full size before rendering a chapter, and frames from the finished render after.
