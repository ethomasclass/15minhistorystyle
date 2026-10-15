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

### The map's recurring jobs

| Ch | Map beat |
|---|---|
| 1 | Wide view of the continent → tilt down onto Texas → the **two rivers** draw on (Nueces, then Rio Grande) → the strip between them rises coral → "the spot?" hovers over it. This is the video's signature shot. |
| 2 | Mexico in 1821 rises as one slab, Texas a thin edge of it. **Flow arrows** (many small dashed arrows, Vox-style) stream from the American South into Texas while a counter ticks up ("Americans" vs "Tejanos"). |
| 3 | Coahuila y Tejas as one slab with a pin at Saltillo, "capital: hundreds of miles away." A small **"Come and take it" flag** stands up at Gonzales. |
| 4 | Pins stand up for the Alamo, Goliad and San Jacinto as each is named. Then Texas **grows**: the Nueces-line Texas slab rises, and the claimed Texas rises *taller* beside it, to the Rio Grande and north to 42°N. The strip is the difference ("That's where Lincoln's spot will be"). |
| 5 | Taylor's arrow from Corpus Christi into the strip, a fort pin across from Matamoros, an **X stake** at the ambush site. Then the camera pulls back across the continent while a rider icon crawls from the Rio Grande to Washington with a **day counter (14)**. |
| 6 | Santa Anna's dotted route Havana → Veracruz, slipping past three small blockade-ship markers. **Three arrows** (north, west, Veracruz → Mexico City) for the war. A Chapultepec pin. |
| 7 | Back to the strip from the cold open; the X stake from ch 5 is "the spot." |
| 8 | **The Cession rises**, big and slow, with a square-mile counter; then today's state lines fade in on top ("California, Nevada, Utah…"); a gold pin at Coloma for the gold line. |
| 10 | **The vote map:** the 1846 states seen tilted; Northern states rise, Southern states sink, labelled "yes" and "no", both parties split the same way. At the end, the camera pulls back from the strip to the whole continent while "1848 → 1861" is stamped. |

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
