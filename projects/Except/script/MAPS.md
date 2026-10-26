# 3D maps for the Civil War series

Built exactly like *The Exact Spot*'s maps: our own drawn map seen in 3D perspective with the same `src/kit/map3d.tsx`
(`Map3D`, `Slab`, `Fill`, `Border`, `Route`, `Dot`, `Stand`/`Pin3`/`Stake`/`PlaceTag`/`RegionName`/`Hand`, `StateTiles`, `Count`).
Bone-paper land, an ink-black sea with engraved water lines, slate rivers, fog toward the horizon; the camera tilts, turns and glides.
Proof: `projects/In_Their_Own_Words/src/MapTest.tsx` (composition `MapTest`, six beats, one per key map moment across the three
videos); review copy `review/Civil_War_map_test.mp4` and stills in `review/maptest/`.

**The base map** (shared by all three videos): `public/maps/civwar1861.json`, 6000 x 4658 px, Albers conic, Natural Earth
(public domain), built by `tools/build_map_civilwar.py` (adapted from *The Exact Spot*'s `tools/build_map.py`). It holds every
U.S. state on the map plus nearby Canada and Mexico (`USA:Georgia` etc.); the war's rivers (Mississippi, Ohio, Missouri, Tennessee,
Cumberland, Potomac, Rappahannock, Arkansas, Red, Savannah, Shenandoah); `lines.lowerMississippi` (Cairo to the Gulf) and
`lines.sherman` (Atlanta to Savannah) with point lists in `polylines`; the Emancipation Proclamation's exempted areas
(`regions.exemptLouisiana`, `exemptVaTidewater`, `exemptVaShore`, approximate for video scale); and `places` for every capital,
city, fort, battle and blockade station the scripts name. The kit's `UNION_FREE_1861`, `BORDER_1861` and `CONFEDERACY_1861`
groups work on it as they are (West Virginia counts with Virginia in 1861, which is right).

## The rules (same as *The Exact Spot*)

| What | How it looks |
|---|---|
| The Union | bone tiles, low (`MAP3D.free`) |
| Border states | grey tiles (`MAP3D.grey`) |
| The Confederacy, or whatever the beat is about | **coral slabs that rise** with real sides and a cast shadow, then sink when the story moves on |
| Rivers and lines that matter | drawn on in **teal** with a glow (`Border`), lifted above the slabs (`z`) so they never hide under them |
| Armies, routes, the blockade | **orange** (`MAP3D.us`): dashed for a plan or a distance, solid for what happened |
| Labels | stand up off the map and face the camera: mono caps `PlaceTag`, display-serif `RegionName`, teal or orange `Hand` notes |
| Dates | every pin that stands for an event carries its date on its tag ("Vicksburg · July 4") |
| Camera | one move per beat; wide shots at `z` about 0.36 to 0.42, close shots (Virginia, Georgia) about 1.0 to 1.4; keep any tag that matters below the top 25% (the fog) |
| Lessons from the test | a river name printed along a narrow river gets squeezed, so stand it up as a tag instead; a route over a raised slab disappears, so use a flat hatched `Fill` under routes |

---

## Video 1: In Their Own Words

| Ch | Line | Map beat |
|---|---|---|
| ch02 | "Lincoln wasn't even on the ballot in ten Southern states." | Tilted wide shot of the whole map; the 10 states (SC, GA, FL, AL, MS, LA, TX, AR, TN, NC) flash grey with a small "no Lincoln ballots" note; a big `Count` "0 electoral votes from slave states" |
| ch02 | "South Carolina votes to leave the Union." / "By February 1861, seven states are gone." | `StateTiles`: SC lifts and tilts away on "leave"; then MS, FL, AL, GA, LA, TX lift one per beat (the order they left); a pin at Montgomery with the CSA name on a strip |
| ch04 | "which in Georgia was about 44 percent" | Push into Georgia; `Slab` Georgia with a hatched fill at 44%; pin Milledgeville (the capital in 1861) |
| ch05 | "In Charleston Harbor sits Fort Sumter" | Push to Charleston; `Pin3` Fort Sumter; a small drawn supply-ship icon heading in on "Only food" |
| ch05 | "That makes eleven." / "four slave states stay" | VA, NC, TN, AR lift (11 total); then DE, MD, KY, MO rise as low grey tiles with a "border states: stay" note; Richmond pin (the new capital). Built and tested: MapTest beat A |
| ch06 | "Blockade the coast. Take the Mississippi... cut the Confederacy in two." | The Anaconda: `Dot`s for ships appear at the blockade stations (`hamptonRoads` ... `galvestonBar`) one per beat; then the `lowerMississippi` line draws on in teal and TX, AR and LA slide west, splitting the Confederacy. Built and tested: MapTest beat B. Scott's Great Snake (the real 1861 cartoon map, sourced) can follow as the archival card |
| ch07 | "only about 100 miles from Washington" | Close on Virginia: Washington and Richmond pins, a measured dashed line "about 100 miles"; Bull Run stake between them; "Forward to Richmond!" as the title. Built and tested: MapTest beat C |
| ch08 | "At Andersonville, in southwest Georgia" | Brief cut to the map: Andersonville pin in Georgia (also sets up Video 3's Georgia beats) |

## Video 2: Forever Free

| Ch | Line | Map beat |
|---|---|---|
| ch01 | "He passed Fort Sumter." | Not the 3D map: a drawn harbor diagram (Charleston, Fort Sumter, the bar, the Union ships), the *Planter*'s route stepped on each sentence. Cut back to a 3D wide shot to place Charleston once |
| ch02 | "Three enslaved men slip away to Fort Monroe" / "He needed the border states" | Pins: Fort Monroe at the tip of the Virginia peninsula; the border states glow gold (callback to Video 1) |
| ch03 | "McClellan finally moved toward Richmond" | `Route` up the peninsula from Fort Monroe toward Richmond, then pushed back (dashed retreat) on "had driven him back" |
| ch03 | "a mob in Baltimore ... railroad bridges north of the city" | Pins: Baltimore, Washington; small "x" marks on the rail line north of Baltimore |
| ch04 | "Antietam Creek, Maryland. Lee has invaded the North." | Arrow from Virginia across the Potomac into Maryland; pin Antietam; `Count` 22,700 |
| ch05 | "It doesn't apply to the border states ... or parts of the South the Union army already held." | **Key map.** The Confederacy fills coral ("covered"); then the exemptions go grey one by one: the four border states, Tennessee, West Virginia, `exemptLouisiana`, `exemptVaTidewater`, `exemptVaShore`. Key on screen: "Covered by the Proclamation / Not covered." Label it "Emancipation Proclamation, January 1, 1863" so it can't be misread. Built and tested: MapTest beat D (the two small Virginia areas need a push-in to read) |
| ch06 | "Egypt and India" | Not this map: a small world inset (or a drawn globe) with Britain, Egypt and India and cotton bales sliding in |
| ch07 | "an attack on Fort Wagner, guarding Charleston Harbor" | Back to Charleston: Fort Wagner pin beside Fort Sumter (callback to Smalls's route) |

## Video 3: Except

| Ch | Line | Map beat |
|---|---|---|
| ch01 | "Lee's army was marching into Pennsylvania." | Arrow from Virginia through Maryland into Pennsylvania; Gettysburg pin |
| ch02 | "hundreds of miles apart" / "the Union controls the whole Mississippi River ... cut in two" | Wide shot with two dated pins: Gettysburg (July 1 to 3) and Vicksburg (July 4). Then the `lowerMississippi` line fills teal and the trans-Mississippi Confederacy (TX, AR, LA) slides away: a callback to Video 1's Anaconda beat, same camera. Built and tested: MapTest beat E |
| ch05 | "Sherman captured Atlanta" / "marched from Atlanta to the sea at Savannah, about 300 miles" | **Key map.** Push into Georgia; Atlanta pin; then `Route` along `polylines.sherman` ; Milledgeville and Savannah pins; `Count` "about 300 miles". Built and tested: MapTest beat F (Georgia as a flat hatched fill so the route shows) |
| ch06 | "Appomattox Court House, in Virginia" / "Galveston, Texas" | Appomattox pin west of Richmond; then a long camera move to Galveston for Juneteenth: "June 19, 1865" dated pin |
| ch07 | "The state that put it over the top ... was Georgia." | `StateTiles` filling one per state as they ratify would be too long; instead a counter "26 of 36 ... 27" and Georgia lights up on the map |

**Extra drawn diagrams (not maps), from the scripts:** Charleston Harbor escape route (V2 ch01); the Proclamation's covered/not-covered key (V2 ch05); hard war vs. total war two-column card (V3 ch05); the Black Codes chain "no job → arrested → fined → hired out" (V3 ch07).
