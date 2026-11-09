# Gilded Age series: look development (Nov 7, 2026)

A test of a **2D side-scrolling silhouette style** for Chunk History's Gilded Age series, on one scene: the Brooklyn Bridge
opening, May 24, 1883, with Michael Kelly (the composite family's eldest son) in the crowd. **Everything is drawn in code**
(no AI images, no Veo): sky, skyline, bridge, boats, pier, crowd and Michael are SVG shapes, so they stay consistent from shot
to shot, can be edited, and can be animated. The figures are rigs: limbs are separate strokes, so a walk or a wave just turns joints.

| File | What it is |
|---|---|
| `scene.js` | The scene builder: five looks, five parallax planes (0.25 / 0.5 / 0.75 / 1.0 / 1.35), the figure rig |
| `text.js` | On-screen text options: three section titles, five vocab cards, callouts + the composite label, the series question |
| `bridge.html` | The page both load into; fonts come from `brand/fonts/` |
| `render.mjs` | `node render.mjs [filter]` renders the frames to `out/` (1920x1080) |
| `scroll.mjs` | `node scroll.mjs <dir>` renders the 9-second scroll test's frames; then `ffmpeg -framerate 30 -i <dir>/f%04d.png -vf scale=1280:720 -c:v libx264 -pix_fmt yuv420p -crf 20 out/scroll_test_720p.mp4` |
| `sheet.py` | Converts frames to JPG and builds the four labelled sheets in `sheets/` |
| `frames/`, `review/` | Copies of the 19 frames and the scroll test (`out/` is git-ignored, as in every project) |

Checked against the bridge's real proportions (towers about 276 ft above the water, main span 1,595 ft, side spans 930 ft,
deck about 119 ft up). One known cheat: a true side view hides the towers' Gothic arches; like most illustrations, we show them.
Not yet decided: the look, coral meaning "a Kelly", which text styles, and whether "GOLD" gets its one off-palette gold leaf.

## Round 2 (same day): looks 1 and 2, a living scene, detail that follows the camera

- **Movement.** Everyone idles (breathing, weight shifts, glances); some cheer with a hat, point, wave or hop; the child on his
  father's shoulders waves. Flags ripple, bunting sways, ships rock, the ferry's walking beam rocks and its smoke drifts, rowers pull,
  gulls cross, mist drifts, the river shimmers, and at night the fireworks launch, burst and fall. Drawn motion steps at 12 drawings
  a second; the camera and mist glide.
- **Detail follows the camera.** A figure under about 400 px tall on screen is one solid shape; bigger, it gains a rim of light on the
  lit side (at night it flickers with the fireworks); in a close-up (over about 600 px) it gains collar, lapel, buttons, cuffs, a
  trouser crease, a hat band, hair, an ear, an eye that blinks, and on women a lace collar, buttons and skirt folds. Wides keep the
  channel's solid-silhouette rule; close-ups loosen it on purpose.
- **Vocab:** index card and x-ray chosen; the handwritten words are now orange, the drawn lines stay teal.
- `anim.mjs <clip> <dir> [start] [end]` renders a clip's frames (clips: `alive_dusk`, `fireworks_night`, `closeup_night` in
  `scene.js`). The three clips are in `review/`.

## Round 3: Michael walks home

`street.js`: a Lower East Side tenement street at dusk, about 1883, in look 1. The camera tracks Michael as he walks home from the
refinery with a tin dinner pail. The rig now has a walk cycle (`walkAn`: thighs swing, the knee bends on the swing, arms
counter-swing, the body bobs twice a stride), stepped at 12 drawings a second while the camera glides.

Around him: five-storey tenements with cornices, fire escapes (required on tenements after 1867) hung with laundry, gaslit windows
with figures in some, shop awnings and stoops; a pushcart peddler; a delivery wagon and a walking horse going the other way, its
spoked wheels turning; telegraph poles strung with the overhead wires New York buried only after 1889; gas street lamps; factory
smoke and a steeple beyond; people passing on both sidewalks and a boy chasing a hoop. Signs are blank on purpose.

Clips: `walk_wide` (10 s, the whole street) and `walk_medium` (7 s, zoom 4.2, where his close-up detail shows). In `review/`.

## Round 4: better reads

- **Heads are profiles now** (skull, forehead, brow, nose, lips, chin, jaw) for every figure, so even a solid silhouette reads as a
  face in profile; women get a softer brow and smaller nose, children a rounder, larger head.
- **Expressions for close-ups**: neutral, smile, worried, awe, set (determined), plus blinks. Each is a brow, an eye and a mouth
  (and a cheek crease for a smile); awe also drops the jaw in the silhouette. `out/` sheet: `7_round4`.
- **The walk is locked to the ground** (`walkPhase` + `walkAn` in `street.js`): each foot stays planted while it is down, and
  positions step with the drawings, so feet no longer skate.
- **The wagon driver sits** (thighs forward, shins down, hidden by the box), and **the horse walks a four-beat gait** with the hind
  legs folding the other way at the hock, tapering legs and a mane.
- In the clips: Michael walks home tired and set, smiles and nods at the neighbour with the basket as she passes (she smiles back),
  and blinks; at the bridge he smiles while he waves, then looks up in awe. The night crowd watches in awe or smiles.

## Round 5: a reusable model, smooth motion, the tenement cutaway

- **`rig.js`** now holds the whole character model (see `RIG.md`): tapered limbs, mitten hands with a thumb, boots, working skirts,
  shawls, aprons, a maid's cap and apron, knee breeches, a skullcap, shirtsleeves and vest, props, lying down, twelve poses, the
  cast, and one level-of-detail rule. Detail now arrives sooner (face from about 520 px tall instead of 680).
- **Smooth motion.** Characters animate at the full frame rate (you found the 12-a-second steps blurred the faces); clips are now
  encoded at 1080p.
- **`cutaway.js`**: a six-storey tenement cut from the street to the back yard, about 1883. Roof (laundry, children, chimney smoke);
  five floors of railroad flats with dark middle rooms; the Jewish neighbours' garment shop on the fourth floor; the Kellys on the
  third; boarders, a cradle, lodgers asleep; a saloon at street level; a cobbler and a lodger in the cellar; the dark stair hall;
  privies, a hydrant and laundry on pulleys in the yard; the rear tenement. Clip `cutaway_push` (14 s): the building alive,
  Michael climbs the stairs, the camera pushes into the Kellys' flat, he comes in, his mother turns from the stove, his brother and
  sister look up. A labelled still shows the teaching version (teal leader lines, orange handwriting).

## Round 6: a worn, candlelit dumbbell tenement in the city

- **Worn rooms**: faded wallpaper (three patterns), peeling plaster with the lath showing, water stains from the ceiling, cracks,
  soot along the ceilings and above each flame, grime along the floors, worn floorboards; bare brick in the cellar and the hall.
- **Period light**: small kerosene lamps and candles (a hanging lamp in the saloon); dim, flickering pools that stay inside each
  room; the stair hall unlit. No electric light anywhere. (Script tie: the Kellys' lamp burns cheap kerosene from Rockefeller.)
- **The dumbbell airshaft**: about 2 1/2 feet wide, open to the sky, down the middle of the building. The middle rooms and the
  kitchens each get one small window onto it; garbage at the bottom, laundry strung across, stale air that hangs. (The 1879 law
  required a window in every room; builders met it with shafts like this.)
- **Fire escapes** on the front and back walls.
- **The city behind**: two layers of rooftops, chimneys and cornices, steeples, smoking factory chimneys and a Brooklyn Bridge
  tower in the distance, moving at their own depth as the camera pushes in. The wide shot starts farther back to show it.

## Round 7: the two integration explainers (Episode 1's teaching core)

`explainers.js`, two clips:
- **`vi_explainer`, vertical integration (22 s).** The camera hops along Carnegie's chain and holds on each step while the narration
  names it: an open-pit iron mine in Minnesota (a steam shovel swinging, ore cars climbing out), an ore dock and a long ore boat on
  the Great Lakes, a bench of glowing coke ovens, the mill (a blast furnace, a Bessemer converter throwing sparks, a glowing rail
  sliding out), his railroad (a train of new rails), the city that buys the steel (a frame going up, a crane). A teal line ties each
  step to the last; the camera pulls back to one line running the whole chain; the tape title, "carnegie owned every step," and the
  index card land.
- **`hi_explainer`, horizontal integration and rebates (24 s).** Cleveland's Standard Oil works and 26 rival refineries in two rows
  along the river. The camera drops into the railroad's freight office: the big shipper and a rival, and the clerk sliding money
  back under the counter to the big one (a rebate), with a bar for each one's shipping cost per barrel. Back out: one by one, 22
  rivals go dark, their smoke stops, a teal outline marks them, and a branch of Standard's teal pipeline reaches each one, with a
  counter "BOUGHT: 22 OF 26 RIVALS." The tape title, the card, "rockefeller bought his rivals."

Teal explains, orange labels, no coral (it means a Kelly). Labels are drawn in screen space so they stay readable when the camera
pulls back. Note for the script: say "22 of his 26 rivals" to match the picture (research flag: some sources say 21).

## Round 8: "vertical" made literal, bigger text, texture, the refinery

- **Vertical, shown vertically.** After the side-scroll and pull-back, Carnegie's six steps fly out of the landscape into a column:
  the iron mine at the bottom, the customers at the top, a teal arrow running up it ("raw material" at the foot, "the customer" at
  the head). The horizontal clip now ends on a side-by-side card: VERTICAL (a column of different steps, "every step, one
  company," carnegie) next to HORIZONTAL (a row of the same refinery, "one step, every rival," rockefeller).
- **Bigger text everywhere in the explainers**: tags 28 px mono (was 20), handwriting 1.3x, index cards 36 px body and 52 to 64 px
  titles, the shipping-cost chart 26 to 28 px. The camera also leans in on the rebate as the money changes hands.
- **Texture, not flat**: `texDef` in `rig.js` mottles and grains whatever it's applied to, fixed to the world so it moves with the
  surfaces (a broad patchy layer plus a fine grain, light and dark, kept inside the shapes); patterns for brick, planks, rivets and
  hatching (`TEX_PATTERNS`); slow clouds across the skies. Applied to the explainers' hills and sets and to the refinery.
- **`refinery.js`, the refinery tour (17 s)**: Havemeyers & Elder in Williamsburg, cut through like the tenement. The camera follows
  the sugar (a cream stream running through the pipes): a ship unloading sacks at the wharf by hoist; melting tanks on the ground
  floor; the pump and the riser to the top; cloth bag filters dripping; bone-char cylinders through two floors with men shovelling
  from a catwalk; vacuum pans with gauges and glowing sight glasses; centrifugals spinning crystals out (Michael's floor, in coral,
  wiping his brow: "hot work: ten hours or more"); barrels packed on the ground floor. Brick walls, plank floors, riveted iron,
  daylight falling in through tall windows, Manhattan across the river. The floor order is the usual sequence, simplified (noted
  in the file).

## Round 9: materials instead of a filter, and the weaver's son

- **The round-8 mottle filter is off** (it painted the same noise on everything; still available with `{force: true}`). In its place,
  **`MAT` in `rig.js`**, a material for each kind of surface: `brick` (bricks that vary one by one, mortar, soot at the foot or the
  roofline), `stone` (irregular blocks, each its own tone), `planks` (boards that vary board by board, knots), `iron` (a highlight so
  cylinders read round, seams of rivets), `water` (darker with depth, ripples drifting at different speeds, glints), `smoke`
  (billowing puffs that rise, swell, drift and thin), `ground` (pebbles and tufts along a surface), `trees` (firs and round crowns
  along a ridge). `MAT_DEFS` holds their gradients.
- Applied: the explainers (red ore bands in the mine pit, a lake that looks like water, a riveted iron ore boat, brick coke ovens and
  mill, iron furnaces and stoves, brick refineries with iron tanks, a river, plank freight office, tree lines on every ridge, pebbled
  ground) and the refinery (a brick back wall sooted at the top, plank floors, iron tanks, char cylinders and pans, water at the
  wharf, a plank-hulled ship).
- **`loom.js`, the weaver's son (18 s)**: Dunfermline in the 1840s. The camera starts in the Carnegies' stone cottage: William at
  his hand loom (front view: warp threads, the shuttle flying across, the beater packing each thread), Andrew about 11 watching, his
  mother mending by the hearth. It pans down the stone street (smoking chimneys, the abbey on its hill) to the steam weaving factory
  of 1847 (brick, rows of power looms, belts from a turning line shaft, a boiler and a spinning flywheel, a tall smoking chimney,
  women tending the looms), then back to the cottage: the loom has stopped, the father sits still, his son beside him. "a machine
  took his father's trade." William and Andrew are solid silhouettes with no face detail, tagged (no photographs survive of the
  father at work; the channel's rule for real people).

## Round 10: Bessemer steel, the x-ray (shot 11)

- **`bessemer.js` (18 s)**: a steel mill at night. A crane ladle pours melted iron into a converter lying on its side ("iron is
  strong, but brittle"); the converter swings upright and the blow starts: a tongue of flame, a fountain of sparks, the shed lit up.
  The camera pushes in and the shell turns to an x-ray (teal cut edge, a firebrick lining): air comes in through the hollow trunnion,
  down the pipe to the wind box, and up through the holes in the bottom as teal bubbles; the carbon specks in the white-hot iron each
  flare and vanish. A clock sweeps the minutes and a "carbon left" bar drains. "no fuel needed: the burning makes its own heat."
  The x-ray closes, the converter tips and pours steel into a ladle; "the old way: a day or more / Bessemer: 10 to 20 minutes";
  then the index card, with "cheap steel, so cheap rails" (the hand-off to shot 12, the rail-price chart).
- Materials: a sooted brick shed with arched windows, riveted iron columns, crane girder and vessel plates, plank floor, smoke.
- The men are anonymous workers, scaled so the converter reads about two and a half times a man's height.


## Round 11: Episode 2 sets (the Vanderbilt ball, March 26, 1883)

`mansion.js` (loaded by `bridge.html` after `bessemer.js`; uses `rig.js`, `street.js`'s horse, `explainers.js`' camera, labels and
frame). Four clips, all in `review/ep2/` (720p) with JPG stills and a contact sheet per scene that puts our frames beside the
reference images (`sheet_*.jpg`, built by `ep2sheet.py`). Stills: `node ep2stills.mjs <dir> name:clip:t[:labels]`.

- **Decisions applied (Nov 8):** all street lighting is gas (the arc lamp is gone); police are 1880s NYPD (dark knee-length frock
  coat, brass buttons, domed helmet, club at the belt); the sister works in the Vanderbilts' own kitchen; the ballpark is Brooklyn,
  1884, with no price on screen; Alice stays the one pale glowing figure. Fixes: the dawn shot opens wide with sky above the
  roofline; the cutaway roof has the exterior's iron cresting, crocketed stone gable and turret; hobby horses are one clean shape in
  a lighter tone; the ballpark crowd mixes bowlers, caps, toppers, women (one with a parasol), boys, drinkers and standers.
- **`fifth_night` (s1, 10 s).** Fifth Avenue at 52nd Street, looking west. Hunt's limestone chateau after the 1903 stereo view and
  his drawings: steep slate roof with iron cresting, three Gothic dormers with pinnacles, the crocketed stone gable at the north
  end, the corner turret corbelled out and capped by a tall slate cone, stone-mullioned cross windows under hood mouldings, carved
  string courses, the oriel and balcony over the arched main entrance, lanterns either side, the areaway railing and barred
  basement windows. Across 52nd Street, W. H. Vanderbilt's brownstone; St. Thomas's tower a block north. Every window blazes. A queue
  of broughams (coachmen in top hats, lit carriage lamps, spoked wheels turning) advances one carriage every 4.6 s; at the canopy
  a footman in livery holds the door and a costumed couple comes out from behind the carriage and up the carpet. Police hold a
  crowd back on the house's sidewalk; onlookers in the foreground. Gas lamps along the curb. Slow side-scroll.
- **`ball_cutaway` (s2/s3, 16 s).** The house cut open like the tenement. Attic: the servants' small rooms under the slates, empty
  tonight, one candle. Third floor: the gymnasium, where the Sun says the quadrilles assembled, hobby horses waiting. Second floor:
  supper (tables set, Delmonico's waiters, gasoliers). First floor: the dining hall (tapestries, the stone mantel), the great hall
  with palms, the hobby-horse quadrille advancing and retiring, Alva as a Venetian princess (halo headdress, train, a dove) at the
  foot of the grand staircase, Alice Vanderbilt as the Electric Light (a pale gown that glitters, a glowing battery torch raised)
  and the next quadrille coming down the stairs. Basement, from Hunt's plan: kitchen (range under a hood, copper pans, cooks in
  toques, the high areaway window), servants' hall (footmen in knee breeches), wine cellar with the butler, the dumbwaiter and the
  service stair. The camera holds on the whole house, pushes to the great hall, then down into the kitchen, where the sister
  (coral) carries a tray of ices and cakes to the dumbwaiter and back ("COMPOSITE CHARACTER" tag). A labelled still
  (`s2_cut_labels`) shows the teaching version.
- **`fifth_dawn` (s4, 9 s).** The same street at dawn: a pale sky wash, most windows dark, the lamplighter's
  pole putting the gas lamps out one by one, carriages pulling away, a couple coming down the steps, and the sister climbing the
  area steps from the basement door with a pail of ashes; she stops at the top and looks up at them. The camera eases in on her.
- **`ballpark` (s5, 9 s).** A Sunday game in the mid-1880s: a roofed wooden grandstand with bunting and flags, open plank
  bleachers (the cheap seats), a board fence; Michael and his sister in the bleachers (coral), a beer vendor in the aisle; the
  pitch, the swing, the hit, the whole crowd up. "25 cents, and beer for sale."

- **`kelly_flat` (s8, 9 s).** The contrast to the mansion: one room of the Kellys' flat (the same kitchen as `cutaway.js`), after
  Riis's photographs. Faded, peeling wallpaper with lath showing, a water stain, soot above the stove; a cast-iron coal stove with a
  steaming kettle and its pipe into the chimney; pots on a shelf, a basket, a washtub, a narrow bed; one small kerosene lamp that
  flickers; the only window opens on the airshaft (a brick wall, a neighbour's window, washing across the shaft). The mother sews
  piecework shirts by the lamp, a pile of finished ones on a chair; the younger brother bastes beside her. The sister comes in from
  the dark hall in her maid's dress and puts her wages on the table ("her week's wages", "COMPOSITE CHARACTERS"). All coral.

Real people (Alva, Alice, every guest) are solid silhouettes, `det: 0`, costume outline only.
- **Carriages, fixed (Nov 8):** `msHorse` in `mansion.js` re-derives street.js's four-beat walk so the cycle length matches the
  hoof's sweep while planted (checked numerically: a planted hoof's x holds to 0.1 px across frames); wheels turn at
  distance / radius; the body bobs and rocks on elliptic springs with speed; carriages ease into the canopy and away; standing
  horses rest a hind leg and toss their heads; the coachmen sway.

## Round 12: the rest of Episode 2

`ep2_more.js` (loaded after `mansion.js`). The sister is now **Nora Kelly, 17**. Five clips, 720p in `review/ep2/`, three stills each.

- **`fittest_explainer` (ch5, 10 s).** A moving teal diagram in three beats. Nature: a sooty trunk, two dark moths hidden on it, a
  pale one that shows; a bird takes the pale one ("fit" means suited, not best); a cockroach scuttles past ("a cockroach is very
  fit"). The claim: society as a pyramid of silhouettes (top hats at the top, caps and shawls at the base), a teal arrow ("the
  strongest rise", "the weak fall") and the index card "Social Darwinism". Sumner, 1883: A and B (top hats) put their heads
  together, an arrow points at C (bowler, orange letter, "the Forgotten Man", the ordinary taxpayer), who hands a coin to D. The
  quote on screen is from *What Social Classes Owe to Each Other*: "A and B put their heads together to decide what C shall be made
  to do for D."
- **`spencer_banquet` (ch5, 9 s), redone (it read as a church).** An 1880s restaurant banquet room: flat gilt-framed mirrors and
  panels, square-headed windows with heavy draped curtains and tassels, gas chandeliers with glass globes, palms in tubs; two long
  tables in white crowded with plates, glasses, bottles, silver platters, menu cards and flower centrepieces; waiters in white
  aprons carrying trays, one pouring wine. A printed menu card opens the shot ("DELMONICO'S · DINNER TO HERBERT SPENCER · NOVEMBER
  9, 1882"). Spencer stands at his place among the diners, not raised, napkin in hand (side whiskers, no face); glasses go up;
  cigar smoke drifts in at the end. No pointed arches.
- **`rich_leisure` (ch6, 10 s).** One side-scroll: a Newport shingle-style cottage with a veranda and tower, lawn tennis (a woman
  in a bustled dress, a man in flannels and cap, underarm strokes, a net), onlookers with parasols; polo, four riders cantering
  (the planted-hoof horse) with mallets swinging; then the water, three racing cutters heeling under huge gaff mainsails, topsails
  and jibs, after the 1886 America's Cup photographs.
- **`carnegie_library` (ch7, 9 s).** The Carnegie Free Library at Braddock (opened 1889) after the 1893 photograph: rough stone,
  a round corner tower with a conical roof, steep gables, arched windows lit, an arched door; mill chimneys smoking beyond; workers
  and a boy walking up. Dissolve to the reading room: shelves of books, warm lamps on long tables, working men with newspapers, a
  boy reading, the librarian at her desk. "free to anyone."
- **`nora_attic` (ch4, 9 s).** Nora's room at the top of 660 Fifth Avenue: the roof sloping in, a small dormer with the night sky,
  bare boards, an iron bed, a washstand with pitcher and basin, one candle on a chair, her uniform (black dress, white apron and
  cap) on a hook. Nora (coral) sits on the bed; the call bell on its spring rings (teal ring marks), and she gets up. "on call, day
  and night." The room's details are typical of servants' attic rooms, not from a plan of this house (no attic plan found).

## Round 13: Episode 3 draft sets (Immigration, about 1884)

`ep3.js` (loaded by `bridge.html` after `ep2_more.js`; reuses `rig.js`, the camera/labels/frame from `explainers.js`, `msDefs`,
`glowC` and the planted-hoof `msHorse` from `mansion.js`, `camAt` from `ep2_more.js`). DRAFTS for review, no script yet. Six
10 s clips (720p) in `review/ep3/`, three JPG stills each, and a reference sheet per scene (`sheet_*.jpg`, built by `ep3sheet.py`,
our stills beside the period references). References: `../ep3/research/REFERENCES.md`, files in `../ep3/public/img/ref/`.

- **The neighbours' colour.** The Jewish family from the Russian Empire (composites, not Kellys; names to come) is drawn in one
  accent, **muted wheat gold `#E2B864`** (`E3.acc`; detail tones `#7A5B22` / `#FFF0C9`), via `nb(castKey, opts)`. Coral stays only
  for the Kellys. `nb` takes `scale` so the daughter (about 12) is taller than the rig's default girl (0.8 vs 0.56); the boy is 0.5.
  Outdoors the father wears a cap and a long coat; at home a skullcap and vest; the mother a head scarf.
- **`ep3_steerage`.** An early-1880s Atlantic liner side-on, cut open like `cutaway.js`: two raked funnels (smoke trailing aft),
  three masts with furled sails and rigging, lifeboats and first-class strollers on the deckhouse; the first-class dining saloon
  (gilt lamps, mirrors, long tables, stewards); steerage in the 'tween deck fore and aft of the boiler casing (two-tier berths,
  lanterns that swing more as the sea gets up, portholes, people sitting, lying, standing); boilers with stokers and furnace glow,
  the compound engine's crank, holds. The ship rolls and heaves, foam at the bow and in the wake, the sea see-through over the hull
  below the waterline. The camera pushes from the whole ship into forward steerage: the family on a berth with a trunk, a rolled
  feather bed and brass candlesticks; the daughter looks up toward first class. "a week or two at sea."
- **`ep3_castle_garden`.** Outside (0 to 5 s), after the 1880s stereo views: the round sandstone fort with its broad low roof and
  arched-window lantern, flags, the arched gate and a blank name board; the Battery's bare trees, lower Manhattan behind (Trinity's
  spire); a two-deck barge full of people with bundles is towed in by a tug, and they walk onto the depot's pier. Inside (5 to 10 s),
  after the NYPL engraving: the rotunda's gallery ring, offices round the wall, iron columns opening into fans of ribs, light from
  the lantern; clerks on high stools at high desks; benches of waiting families; the family steps up and the father gives their
  name ("name, age, where from, where to").
- **`ep3_moving_in`.** A Brooklyn tenement front (brick, bracketed cornice, stone lintels, curtains, fire escapes with washing,
  a stoop rising along the front, areaway windows), gas lamp, telegraph wires. A wagon at the curb (the horse stands, rests a hind
  leg, tosses its head) holds a roped feather bed, a trunk, a samovar and chairs; the family carries them up the stoop one by one
  (trunk on the father's shoulder, feather bed, samovar, candlesticks). A one-horse horsecar passes in front. Neighbours watch from
  a stoop and a fire escape; the camera rises to Ma Kelly (coral) at her second-floor window, arms folded, turning her head to
  follow them. "Ma Kelly is not so sure."
- **`ep3_sweatshop`.** After Riis's Ludlow Street and Division Street photographs: one room, garments on a line overhead, the
  window to the street; two of three treadle machines run (wheels and treadles turning); the father presses at his board (steam on
  each stroke, irons heating on the stove); the daughter sews at a machine; the boy pulls threads by the pile; the mother finishes
  by hand at the window. At 4.4 s the contractor (ink, bowler) brings a bundle, drops it, and leaves; the pile grows.
  "home by night, workshop by day", "paid by the piece".
- **`ep3_letter`.** The kitchen table by lamplight (samovar, candlesticks, kerosene lamp): the father writes, the mother looks on.
  The letter rises in screen space, its unreadable Yiddish-style script written **right to left**, and a prepaid steamship ticket
  slides in on top. Then the map (Natural Earth 1:50m land, embedded as `E3_LAND`, equirectangular squashed by cos 48°): the
  Russian Empire hatched; an envelope carries the letter east from New York to "home" (a town in the Pale); then the cousin's route
  draws west in teal dots, by rail to Hamburg, by steamship (a little ship icon) to New York.
- **`ep3_nativism`** (added Nov 9 on request). The desk layer: creased prints (`ep2/tools/crease.py` into
  `../ep3/public/img/desk/`) land one by one either side of a teal rule, "SHUT OUT BY LAW" (the Chinese Exclusion Act text,
  Frank Leslie's "The Only One Barred Out", 1882) and "LET IN, BUT MOCKED" (Opper's anti-Irish Puck cover, 1883; Keppler's "Looking
  Backward", 1893), each with a mono caption; Lazarus's 1883 line on a card as the contrast; the camera pushes into "Looking
  Backward" with its caption as the pull-quote. Then the irony in the family: Ma Kelly at her window. "not long ago, the cartoons
  mocked the Irish" / "now Ma Kelly watches the newcomers". Caricatures are shown briefly and small, never animated or mocked;
  REFERENCES.md flags which prints carry slurs or caricatures.
- `bridge.html`'s `draw()` now also waits for `window.E3_PRELOAD` (the desk prints) and two animation frames, so `<image>` prints
  are decoded before a screenshot.

Known draft limits: the steamship is a generic type (no plan of a specific Hamburg-America ship found yet); the barge and horsecar
are generic; the Brooklyn street has no Brooklyn-specific reference; Ma's folded arms read as hands at her chest in profile.

### Round 13b (Nov 9): surfaces, the Ep 1 building, room scale, name changes

Applied the user's feedback and decisions (neighbours stay wheat gold `#E2B864`; The Wasp's 1881 cartoon left out; no "No Irish
Need Apply" window sign; Ma Kelly came over about 1870; route rail to Hamburg, steamship to New York, home town unnamed).

- **Surfaces.** Every standing figure now gets a contact shadow on its floor (`e3Shadow`, built into `nb`, `kel` and `e3Person`;
  sitting, lying and window figures skip it or take `floorY`). Ship: plank decks in perspective on the saloon, 'tween deck and hold
  levels and on the deckhouse roof, the black deck sections below them, chairs under the first-class diners. Rotunda: flagstones
  running back to the wall. Street: flagstone sidewalk, curb, cobbles. Rooms: a back wall with a baseboard, worn boards receding to
  it, a plaster ceiling with a crack and a stain, the cut side walls and slabs in black (`e3Room`).
- **`ep3_moving_in` rebuilt on Episode 1's tenement.** The row is drawn with `street.js`'s own `tenement()` (same facade colours,
  bracketed cornice, three windows a floor with lintels, fire escape and washing, the saloon's awning at street level, doorway and
  stoop) and `stFar()` behind; coordinates are street.js's. The Kellys' building has five floors of flats over the saloon as in
  `cutaway.js`, and Ma Kelly is at the middle front window of the third floor, where cutaway.js puts the Kellys. The family walks
  from the wagon, climbs the stoop's four steps and goes in at the door. Horsecar and wagon rescaled to the facade.
- **Folded arms that read.** `kel(..., {fold: true})` poses the arms (elbow forward, forearm back across the chest) and draws
  `foldedArms()` over them with a darker crease, so the fold reads in silhouette.
- **Room scale.** `RM`/`e3Room()`: a front room about 12 ft wide with an 8 1/2 ft ceiling at about 84 px to the foot (a man 480 px).
  `ep3_sweatshop` is now that room: stove and pressing board by the door, the father pressing, two treadle machines nearly touching
  (the daughter and the mother at them), the bed against the back wall heaped with cloth, coats strung just under the ceiling, cut
  cloth piled on the floor, the boy pulling threads at their feet, the contractor coming in through the door. The letter's kitchen
  uses the same room (stove, airshaft window, shelf, table with samovar, candlesticks and lamp).
- **Castle Garden.** The barge is 1.45x bigger and lands in view at the depot pier.
- **`ep3_nativism`.** The ending note now reads "in 1883, Puck was still mocking the Irish" (Opper's cover is 1883), then "now Ma
  Kelly watches the newcomers", on the new window.
- **New: `ep3_names` (10 s).** At the Castle Garden desk the clerk copies a row from the ship's passenger list ("WRITTEN IN
  HAMBURG") into the register ("COPIED FROM THE LIST"), a teal arc carrying it across, while the name changes from unreadable
  Hebrew-style letters to the Hamburg clerk's spelling, RABINOWITSCH ("the clerk copied the name; he did not change it"). Later,
  at school, the daughter crosses out Rivke on her slate and writes Rebecca. Later still, the father's shop sign RABINOWITZ becomes
  RABIN ("most name changes came later, made by families themselves"). The surname is invented for the composite family.
  Sources and the script wording are in `../ep3/research/REFERENCES.md`.
