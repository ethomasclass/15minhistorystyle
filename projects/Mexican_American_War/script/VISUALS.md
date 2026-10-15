# Visual plan: The Exact Spot

The look stays the channel's: black-and-white archival images on the dark desk, one coral subject traced in teal, orange
torn-tape titles, teal handwritten notes, graphics stepping at 12 fps over smooth camera moves. **What's new in this video is
the map.** It's our own drawn map seen in 3D perspective (the Vox style). It carries the story: about a third of the screen
time is on it.

## 1. The tilted map (new: `src/kit/map3d.tsx`)

- **Our own map, drawn from public-domain outlines** (Natural Earth). `tools/build_map.py` projects coastlines, rivers, lakes
  and today's state lines, and draws the historical borders from their legal descriptions: the Nueces Strip, the Republic of
  Texas's 1836 claim, the Adams–Onís line (1819), Mexico before 1836, the Mexican Cession, and the Gadsden Purchase. Output:
  `public/maps/mex1846.json`.
- **The look:** bone-paper land, ink-black sea with engraved water lines hugging the coast, slate rivers. The camera **tilts**
  (up to ~55°), **turns** and **glides**, with fog toward the horizon for depth. It's redrawn sharp at every zoom.
- **Regions rise off the map as coral slabs** with real sides and a cast shadow, then sink again when the story moves on.
- **Rivers and borders draw on in teal with a glow.** Routes are dashed arrows with heads.
- **Labels, pins and notes stand up off the map and face the camera**: place tags in mono caps, region names in the display
  serif, teal handwriting for notes.
- Proof: `out/maptest/MapTest.mp4` (the review copy is in `review/`).

### How borders and claims are shown (every map beat uses the same code)

Rivers that are borders or claims are never just "a river." Each one is drawn as a **border**: a thick line with border ticks and
a glow, and **its name and whose line it is printed along it** on the map (it reads in perspective, like a printed atlas).

| Line | Style | Name along it |
|---|---|---|
| **Nueces**: Mexico's line | teal, **dashed** (a claim) | NUECES · MEXICO'S LINE |
| **Rio Grande**: Texas's (later the U.S.'s) claim | orange, **dashed** (a claim) | RIO GRANDE · TEXAS'S CLAIM |
| The **Nueces Strip** between them | coral hatching, "DISPUTED" standing on it | — |
| The **1819 line** (Sabine, Red River, Arkansas River, 100°W, 42°N): Mexico's real northern border before 1836 | bone, **solid** | SABINE · RED RIVER · ARKANSAS RIVER · 42°N |
| Texas's claim north from the Rio Grande's source to 42°N | orange, dashed | TEXAS'S CLAIM |
| The **1848 border** (Rio Grande to El Paso, the old New Mexico line, the Gila, to the Pacific) | teal, **solid** (agreed) | RIO GRANDE · NEW BORDER, 1848 / GILA RIVER |

Rule: **dashed = a claim, solid = an agreed border.** Teal = Mexico's side, orange = Texas/U.S. claims, coral = the land in
dispute or changing hands. The colour key appears once, in ch 1, as two small swatches standing on the map.

### Every map beat

| Ch | Narration cue | Map beat | What it helps people understand |
|---|---|---|---|
| 1 | "So look at Texas. Two rivers." | Wide continent → tilt onto Texas. The **Nueces border** draws on (teal, dashed, named), then the **Rio Grande border** (orange, dashed, named). The strip fills with coral hatching, "DISPUTED" stands up, "the spot?" hovers. | Where the argument is, and that it's an argument about which river. |
| 2 | "Texas isn't empty… only a few thousand." | **Comanche lands** shaded and named; three **Tejano towns** (San Antonio, Goliad, Nacogdoches) as dots in a huge frontier. | Why Mexico wanted settlers at all. |
| 2 | "Americans jump at the deal… from the South" | **Flow arrows** stream from the American South into Texas; a counter ticks "Americans" past "Tejanos". | How fast Texas filled up, and from where. |
| 2 | "In 1830, Mexico bans new American settlers" | The **1819 border** (Sabine) draws on solid, a **CLOSED** stamp lands on it… and the arrows keep crossing. | The ban, and that it didn't work. |
| 3 | "joined it to a bigger one, Coahuila" | **Coahuila y Tejas** rises as one slab; a pin at Saltillo; a route line "hundreds of miles" to the Texas settlements. | Why Texans wanted their own state. |
| 3 | "moves power to the capital… centralism" | Mexico's **state lines** light up, then **arrows pull from every state into Mexico City** as the states dim. | The vocab word, as a picture. |
| 3 | "October 1835. Gonzales" | The small **"Come and take it" flag** stands up at Gonzales. | Where the revolution started. |
| 4 | "Santa Anna marches north" → San Jacinto | Santa Anna's **route north** from Mexico City to San Antonio; pins for the **Alamo, Goliad**; Houston's **retreat east**, then the turn at **San Jacinto**. | The distances, and why "caught off guard" worked. |
| 4 | "says its border is the Rio Grande… stopped at the Nueces" | The **Mexican-Texas slab** (to the Nueces) rises; then the **claimed Texas** rises taller beside it (to the Rio Grande and north to 42°N, the orange dashed claim line drawing on). The difference glows: the strip. | How much bigger the claim was than Texas, and where the spot will be. |
| 4 | "a big new slave state would start a fight" | The U.S. turns: **13 free states** (bone) and **13 slave states** (dark red) rise, counters "13 free / 13 slave", then **Texas lands on the slave side**, bigger than any of them. | Why annexation waited nine years. |
| 5 | "He wants California… harbor at San Francisco" | California and New Mexico outlined in a **dotted "for sale" line**, a **$25 million** tag standing on it, a pin at San Francisco Bay. | What Polk wanted, and that he tried to buy it first. |
| 5 | "orders… to the Rio Grande" → "April 25th" | Taylor's **arrow** from Corpus Christi across the strip; a fort pin across from Matamoros; the **X stake** lands at the ambush site, inside the hatched strip. | Who moved into whose claim. |
| 5 | "news travels at the speed of a horse" | Camera pulls back across the continent; a rider icon crawls the Rio Grande → Washington line, **day counter 1 → 14**. | Why Polk could decide before the news arrived. |
| 6 | "let me through your navy's blockade" | Santa Anna's **dashed sea route** Havana → Veracruz, slipping between three blockade-ship markers. | The double-cross, in one move. |
| 6 | "captured his cork leg on the battlefield" | A pin at **Cerro Gordo** on Scott's route, the leg standing on it. | Where the leg story happened. |
| 6 | "push in from three directions" | **Three arrows**: Taylor south from the Rio Grande, the West (Santa Fe → California), Scott Veracruz → Mexico City; pins at Chapultepec and Mexico City. | The shape of the war in 15 seconds. |
| 7 | "That fight happened in the strip" | Back to the cold-open map: both claim lines, the hatched strip, the X stake. | Lincoln's point, on the map. |
| 8 | "the Rio Grande is the border… the Mexican Cession" | The **Rio Grande becomes solid** (agreed border, "RIO GRANDE · NEW BORDER, 1848"), the **Gila** draws on; the **Cession rises**, square-mile counter. | The new border is a river border too, and the size of the Cession. |
| 8 | "Today that's California, Nevada, Utah…" | **Today's state lines** fade in on the Cession slab; the states that came from it get names. | Connects 1848 to the map people know. |
| 8 | "Counting Texas, Mexico lost about half its land" | **Mexico in 1821** as one teal slab; **Texas and the Cession lift off and slide north**, leaving today's Mexico; "about 50%". | How big the loss was for Mexico. |
| 8 | "Nine days earlier… found gold" | Two pins with dates: **Coloma, Jan 24** and **Guadalupe Hidalgo, Feb 2**, a line between them. | Nobody at the table knew; news was slow. |
| 9 | "They didn't move. The border did." (quiet, teal only) | Town dots (Santa Fe, Taos, Albuquerque, Tucson, Los Angeles, San Diego, Monterey, San Francisco) stay put while **the border slides south over them**, from the 1819 line to the 1848 line. **Native nations' names** stand up across the region. | Who was already living there, and that they weren't asked. |
| 10 | "look at the vote" | The 1846 states: **Northern states rise** ("yes"), **Southern states sink** ("no"); party labels split the same way. | Sectionalism, as a picture. |
| 10 | "Every acre forced the question" | The Cession slab with a **question mark**; optional: the **36°30′ line** extends west across it (sets up Lesson 3). | Why new land made slavery harder. |
| 10 | "Where was the spot?" | Back to the strip and the X stake, both claim lines. | The answer to the cold open. |
| 10 | "It took about 13 years to work." | The Cession glows, then the same states **split in 1861**: Union (bone), border states (grey), Confederacy (coral, rising). | The poison taking effect. |

Built and tested so far (`src/MapTest.tsx`, review copy `review/Exact_Spot_map_test.mp4`): the river claims and disputed strip,
the free/slave balance with Texas, Mexico losing half, the border sweeping over the towns with Native nations named, 1861, and
the frontier (Comanche lands, Tejano towns, settler flow, the Gonzales flag). Every other beat uses the same pieces.

## 2. Archival and paintings, with the coral subject

| Ch | Images (coral subject in **bold**) |
|---|---|
| 1 | Lincoln's **Spot Resolutions** manuscript, "the particular spot" circled in teal; **Lincoln** (c. 1846 daguerreotype); **Polk**; the war message with "American blood upon the American soil" underlined. |
| 2 | **Stephen F. Austin** portrait; settlers painting (the **enslaved men and women** are the subject: they're the people this chapter is quietly about); Tejano ranch painting; the 1829 decree. |
| 3 | **Two documents** split screen: the Declaration (grievances ticked in teal, "slavery: 0 mentions") vs. the Constitution's §9 boxed. **Santa Anna** portrait. Austin's cell painting. Gonzales painting with the flag lettered by us. **Navarro**. |
| 4 | Alamo dawn painting (the **chapel** as subject). **Seguín** (1838 portrait). The marsh-grass painting (the **crouching man**). Sam Houston. |
| 5 | John Gast's *American Progress* (1872, labelled with its date) for **Manifest Destiny**, the floating figure as subject. Polk's **diary page** for May 9. The rider painting. The war bill. |
| 6 | Blockade painting; the **cork leg** (painting, or the museum photo if licensed); Nebel's Chapultepec lithograph (the **castle**); San Patricios in quiet mode (no hanging shown, the distant painting or a drawn diagram); the young officers in a row of portraits. |
| 7 | The Spot Resolutions again; a "Spotty Lincoln" newspaper; the **85–81** vote as a tally; young **Grant**; the two-views split (supporters left, critics right). |
| 8 | **Trist**; the 65-page letter painting (the **stack of pages**); the treaty's signature page; the gold painting (the **gold**); Article VIII highlighted, Article X **struck through** as the Senate cuts it. |
| 9 | Quiet mode, teal only: 1 battle figure : 7 disease figures; the land-hearing painting; **Seguín** again with his quote, then silence. |
| 10 | **Wilmot**; the Proviso's one sentence; the vote map; **Emerson** + the arsenic still life; Appomattox lithograph (**Grant and Lee** as one subject); final map pull-back. |

All masking as usual: rembg masks → coral tint + teal trace; 2.5D parallax on the strongest photos (Lincoln, Polk, Seguín,
Grant) using the Black Sox `Parallax` component.

## 2b. The engraving treatment (locked: "version B")

Every Flow engraving goes through `Engraving` (`src/kit/engraving.tsx`): black and white with contrast 1.25, a slow push,
and a **soft fade from a bright centre into the dark desk** (opaque to 58% of the oval, gone at the edge). The bright
centre is placed over the scene's subject (`focus`), and the fade **blooms open from the dark** as the scene starts and
closes at the end. Coral tint and teal trace work as usual inside the bright area. Tag: `Illustration · …`.

- **Quiet chapters** (ch 9, the San Patricios beat): `quiet` = the heavier "faded print" (small bright centre, washed-out
  ink, no coral tint).
- **Real archival documents and portraits** don't get the fade: they stay cards on the desk, so an illustration never
  passes for a source.
- Look test: `StyleTest` composition.

## 3. Transitions (new)

You said the chapter endings feel abrupt, so the shell now does this at the end of every chapter:
1. **~1.8 s hold after the last word.** The picture keeps its slow move and nothing new appears.
2. **The music lifts** (×1.6) into that space instead of cutting out.
3. A **0.6 s dip to black** (was 0.33 s), then the logo break.

Inside chapters, a scene change still lands on a spoken word, but map ↔ archival changes use a short "lift": the map plane
tilts flat and the archival card rises off it, instead of a hard cut.

## 4. The end screen (new, built in)

**20 seconds** after the closing line, music only plus the narrated thank-you line:
- Background: the tilted map drifting slowly, dimmed.
- Left: two empty 16:9 slots (outlined in teal) where YouTube's "next video" end-screen elements go. Suggested picks:
  *Grip Tighter* and *King Andrew*.
- Right: an empty circle where YouTube's subscribe element goes, and a teal "thanks for watching" note.
- Nothing important within YouTube's element areas, and the text clears the frame edges (text probe).

## 5. Thumbnail ideas (for later)

- **A:** the tilted map, the strip raised coral, a big teal **X** on it, and the headline **"THE EXACT SPOT"**; Lincoln's head on the left.
- **B:** Polk vs. Lincoln split portrait with a question mark on the map between them.
- **C:** the cork leg on the map. Odd enough to click.
