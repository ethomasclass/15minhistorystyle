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

### Round 13c (Nov 9): contacts, and the "Looking Backward" read

- **Contacts are solved, not placed.** `ep3.js` now carries forward kinematics and two-bone IK that match `rig.js`'s limb chain
  exactly (`E3K.hand`, `E3K.foot`, `E3K.armIK`, `E3K.legIK`, with lean and bob). Held things are drawn at the grip
  (`holding`, `hanging`); hands that work on something are solved onto it (`reach`); feet are solved onto floors, treads and
  treadles (`plant`, `sitOn`); walkers use `stepWalk`, which plants each foot on a foothold until it lifts (on the stoop each
  foothold is a tread). Every contact is logged to `window.E3LOG` (target vs reached) each frame.
- **Audit** (every other frame of every Ep 3 clip, `scratchpad` script `verify.mjs`): holds and hand contacts 0 px error; planted
  feet 0 to 0.1 px error and 0 to 0.1 px drift while planted; seated feet 0 px (steerage berth sitters 2 px at a 72 px figure).
  The rig's palm is drawn within about 5 px of the grip at a 400 px figure (the mitten's own offset).
- **Rig change (backward compatible):** `rig.js` treats `an.standing` as "not seated" when choosing a woman's skirt, so a woman
  climbing a stair (thigh raised past 60 degrees) keeps her standing skirt. Unset everywhere else, so Ep 1 and Ep 2 render as before.
- **`ep3_looking_backward` (25 s, new).** Keppler's *Puck* centre spread of January 11, 1893 on the desk, then a guided read:
  the five men in top hats ringed and an arrow to the newcomer they block; a teal line from each man up to his shadow (the poor
  immigrant he or his father was; "THE SHADOWS HAVE NO LABELS"); the caption underlined and set as a quote card; arrows from the
  shadows down to the men and "KEPPLER WAS AN IMMIGRANT TOO: BORN IN VIENNA, 1838"; a "Look again" question card. Facts and a
  65-word draft narration timed to the beats: `../ep3/research/LOOKING_BACKWARD.md`. Source image is the 1280 px Commons copy, so
  the pushes (to 2.35x) are soft; swap in a larger scan when one can be fetched.

## Round 14 diagrams (Nov 12): Episode 3 explainers

`ep3_explain.js` (loaded by `bridge.html` right after `ep3.js`; reads, never edits, `ep3.js`'s `E3`, `E3_LAND`, `E3P`,
`E3_RUSSIA`, `nb()` and `e3Defs`, plus `tag`, `penS`, `tapeS`, `card`, `icon`, `frame` from `explainers.js`). Nine diagram clips,
720p in `review/ep3/` (`<clip>_720p.mp4`), two or three stills each (`xp_<name>_N.jpg`, e.g. `xp_pale_map_1.jpg`). The look is the explainer board: near-black
teal with faint graph-paper squares, mono tags on dark boxes, orange torn strips (Abril) for titles, Nanum Pen handwriting, the
series' index cards for vocabulary. Every chart builds in steps; teal draws and explains; orange is strips and handwriting; the
Rabinowitzes (and Jewish arrivals) are wheat gold; the Kellys coral; everyone else ink or a muted grey-green.

| Clip | Ch | s | What builds |
|---|---|---|---|
| `ep3_pale_map` | 2 | 14 | The letter map's projection zoomed on eastern Europe: the Russian Empire hatched ("RUSSIAN EMPIRE"), the Pale of Settlement traced in teal dashes and shaded (the 15 western provinces, hand traced and rounded; tag "ABOUT 1884 · BORDERS APPROXIMATE"), "where most Jews had to live", the orange "HOME" dot; then three index cards stack on the right: Pale of Settlement, Pogrom, May Laws (glossary wording). |
| `ep3_chain` | 3 | 15 | A numbered story, New York (left) and the old country (right); each arrow draws in and its own label lands beside it. Westbound arcs stack in time order: 1. Yankel goes first (1882), 4. the family follows (1884), 5. later: a cousin (dotted, not yet happened). 2. WORKS, SAVES sits under the New York Yankel (pressing board, coins). 3. letters, money, a ticket: the one eastbound arc, under the sea, labelled below it; The Sun, June 11, 1884 shipping ads cropped and laid in, "Steerage, $18" ringed, tag "$18 ≈ $650 TODAY". Cards: Chain migration, Prepaid ticket. (Restructured Nov 12 after review: steps were out of order and two arcs were unlabelled.) |
| `ep3_stat_cg` | 4 | 10.5 | CASTLE GARDEN strip and a small fort; "1855 to 1890"; "≈ 8 MILLION PEOPLE"; three figures, two turn teal; "2 OF EVERY 3 / IMMIGRANTS" with "WHO CAME TO THE U.S. IN THOSE YEARS". |
| `ep3_old_new` | 5 | 15 | The old vs new chart rebuilt on cream notebook paper (no textbook image): headers, the 1880 line as an orange torn strip with an "1880" scrap, then the five rows one at a time; row 4 reads "SEEN AS similar ... / SEEN AS different" with "SEEN AS" underlined in teal, the row highlighted, and "WHO DECIDED? / NATIVE-BORN PROTESTANT AMERICANS"; the Kellys (four coral figures) slide into the old column and a teal arrow leads to "except the Irish: Catholic" under "Mainly Protestant". |
| `ep3_decades` | 5 | 13.5 | Bars grow one by one: 1870s 2.8 M, 1880s 5.2 M (teal), 1890s 3.7 M, 1900s 8.8 M (source tag: DHS Yearbook, Table 1); "1884" on the 1880s bar, an arrow to "1 in 50": fifty figures, one gold and ringed, "ABOUT 11,000 OF 500,000+ WERE JEWISH". |
| `ep3_piecework` | 7 | 15 | BIG COMPANY (cuts the cloth) → CONTRACTOR (ink, walking with bundles) → THE FAMILY'S ROOM (gold: presser, machine, finisher, thread puller); coins "PAID BY THE PIECE"; FINISHED GARMENTS ride back; cards Contractor and Sweatshop; then a Riis card line by line: "knee pants: 70¢ a dozen", "beginners: $2 to $5 a week", "sunrise to 9 p.m.", tag "JACOB RIIS, 1890". |
| `ep3_laws` | 8 | 15 | WALLS AND WELCOME: a 1882 to 1887 line; walls above in ink cards with orange strips (1882 Chinese Exclusion Act, "first major law to keep out a group by nationality"; 1882 head tax + "public charge"; 1885 contract labor ban), welcome below in teal ("The New Colossus" 1883; the pedestal fund 1885 to 1886, a teal span on the line; Statue dedicated October 28, 1886). Held complete, then the line steps back and the Nativism card lands. |
| `ep3_pedestal` | 8 | 11 | THE PEDESTAL FUND: "100,000+ / PEOPLE CHIPPED IN", "1885"; 100 figures fill a 10 x 10 grid (EACH FIGURE = 1,000 PEOPLE); "most gave $1 or less" and a row of dollar coins. |
| `ep3_tenement_plan` | 6 | 11.5 | One floor from above, flat and schematic after the 1879 dumbbell plans: outline draws on, four flats (FLAT 1 to 4) of three rooms, only the street and yard rooms lit, the inside rooms go dark ("inside rooms: no windows"); the hall with stairs and ONE SINK FOR THE WHOLE FLOOR; the Rabinowitzes' flat outlined in gold, four gold dots in one room and a boarder in the kitchen, "THE RABINOWITZES: 4 PEOPLE + A BOARDER". |

Notes and decisions:
- **Numbers are as briefed.** "$18 ≈ $650 TODAY" is the brief's conversion (the script itself says "about a month's pay for a
  laborer"; RESEARCH found no dollar fare for Hamburg, so the $18 is the 1884 Sun ad's Anchor Line steerage rate, ringed on screen).
- **The law timeline runs 1882 to 1887, not 1882 to 1893.** All the briefed events fall between 1882 and 1886; a linear axis to
  1893 left most of the width empty and crowded the cards. If 1891 (the Immigration Act) and 1892 (Geary Act) are wanted, the
  axis can be extended and two wall cards added (both are in RESEARCH 4.3 and 4.7).
- **The Pale outline is approximate** (15 provinces, Congress Poland left out as in most maps of the Pale); it says so on screen.
- **Text audit:** `audit_text.mjs <clip> [step]` (adapted from `ep2/edit/audit_text.mjs`) samples a clip every 0.2 s and reports
  any visible text whose rotated font box leaves title safe (96 / 54 px) or overlaps another text, texts on screen under 2.5 s,
  and how long the final set of texts is held. Final pass: no OUT, no OVERLAP, no SHORT on all nine; the complete chart is held
  3.0 to 5.2 s at the end of every clip.

## Round 14 map (Nov 12): ep3_enclave

`ep3_map.js` (loaded by `bridge.html` right after `ep3.js`; uses `rig.js` helpers, `tag`/`card`/`frame`/`SAFE` from
`explainers.js`, `e3Defs` and `drawOn` from `ep3.js`). One clip for chapter 6, "The Lower East Side": **`ep3_enclave`**, 57 s,
720p in `review/ep3/ep3_enclave_720p.mp4`, stills `en_*.jpg`.

- **A real 3D model, drawn as SVG.** World units are feet (x east, y north, z up). A camera with target, yaw, pitch and distance
  (keyframes interpolated by a monotone cubic, so it never overshoots or stops dead) projects every point in perspective
  (focal 2400 px) with near-plane clipping. Each building is a box whose faces are back-face culled and shaded by a cream light
  from the south-west; buildings, pushcarts and people are sorted by distance from the camera (painter's algorithm; lots share a
  25 ft grid, so the sort is exact for them). Far things mix into a teal-slate haze; the whole picture gets the paper mottle
  (`texDef`) and grain.
- **The Lower East Side model.** Three blocks by three rows, two rows of 25 x 85 ft lots per block (4 to 6 floors: store 13 ft,
  floors 12 ft), yards between. Tenements carry window grids, a dark cornice with a lit lip, shop windows and sloping awnings, fire
  escapes with railings, ladders and washing on the street front, a chimney on the roof. Hester Street has pushcarts end to end
  along both curbs (some with umbrellas, goods heaped on top) and a crowd; the other sidewalks have walkers. Flat ghost blocks run
  out into the haze. The Rabinowitzes' building (wheat gold, 6 floors) faces Hester; its neighbours are held to 5 floors so its
  open top floor can be seen from above.
- **Beats, keyed to the narration.** The clip starts at narration second 23.0 (`EM_T0`); every cue is a word start time from
  `ch06_the_lower_east_side.words.json`, kept in `EM_CUE` so a re-voice is a table edit. Each place LIFTS 82 ft (enough to clear
  the roofs, so it floats free) with a small overshoot, a soft shadow and a dark vacated lot, turns pale with a cream edge (blended in as it rises, so nothing pops), and a
  teal arc draws from the gold building's roof to it. Tags sit on cream leader lines; a small solver keeps them apart, off the
  fixed place tag, headline and card, and inside `SAFE`.

  | clip t | narration | beat |
  | --- | --- | --- |
  | 0 to 1.1 | "It felt ... like home" | the model from high up, "THE RABINOWITZES" |
  | 1.1 | "That was the point" | Hester's market lifts: "PUSHCART MARKET" |
  | 3.2 to 10.5 | "enclave: a neighborhood ..." | the camera slides the map left, the vocab card "Enclave" |
  | 11.3 | "found work through a man from his own town" | a workshop lifts: "A JOB THROUGH A MAN FROM HOME" |
  | 14.7 | "kosher meat" | "KOSHER BUTCHER" |
  | 16.3 | "a little synagogue upstairs over a shop" | "SYNAGOGUE UPSTAIRS OVER A SHOP" (its first floor up has tall bright windows) |
  | 19.9 to 29.2 | "landsmanshaftn ... sick ... doctor ... grave" | a hall lifts: "LANDSMANSHAFT", then "A SICK FUND · A DOCTOR · A GRAVE" one by one |
  | 30.2 to 32.8 | "Irish families had built the same thing" | pull back, pan across the East River (ferry), headline tag |
  | 33.6 to 35.3 | "a parish, a saloon, a savings bank" | Brooklyn, coral Kelly building: "PARISH CHURCH", "SALOON", "SAVINGS BANK" |
  | 38.7 to 41.7 | "Ma Kelly's neighborhood was an enclave too" | both models side by side: "LOWER EAST SIDE", "THE KELLYS' BROOKLYN / AN ENCLAVE TOO" |
  | 40.7 to 44.4 | "But the Lower East Side had a cost" | lifts settle, lines fade; the camera flies back and dives, orbiting 90 degrees |
  | 44.3 to 46 | "buildings called tenements" | the gold building's top floor and roof lift off and slide away: the floor plan |
  | 47.7 | "one sink in the hall for the whole floor" | the sink ringed in teal: "ONE SINK IN THE HALL / FOR THE WHOLE FLOOR" |
  | 51.3 | "slept four in one room" | four gold sleepers (parents on the bed, two children on a floor mattress), room outlined: "FOUR IN ONE ROOM" |
  | 53.0 to 57 | "a boarder in the kitchen" | the boarder on a cot by the stove (ink): "A BOARDER IN THE KITCHEN" |

- **The floor.** A dumbbell tenement of the 1880s (the 1879 law's shape: airshafts pinch the middle), 25 x 85 ft: four flats of
  three rooms (front room, kitchen, small dark inner bedroom), the hall and stairs down the middle, two water closets, ONE sink. The
  Rabinowitzes have the front flat on the west side, tinted gold (front room with two sewing machines and a cutting table: the
  next chapter's sweatshop; kitchen with stove, table and the boarder's cot; bedroom). The other flats sleep ink families. Walls
  are cut at 3.4 ft so the rooms read from above.
- **Brooklyn.** Two blocks by two rows, lower buildings; the Kellys' building is coral (saloon floor plus five floors of flats,
  as in `cutaway.js`). Parish church (nave, gable roof, tower and spire, lancet windows), a corner saloon, a savings bank with
  columns and a pediment.
- **Colour.** Gold only for the Rabinowitzes (their building, their flat, the four sleepers); coral only for the Kellys' building;
  everything else ink or slate; teal only for the network arcs, the room outlines and the sink ring; no orange needed. No in-world
  writing. Map-scale people are ink strokes with a head (at this size there are no feet to place).

Known limits: the blocks are a generic grid, not surveyed Hester Street lots; the Emigrant Industrial Savings Bank stood on
Chambers Street in Manhattan, so the Brooklyn bank is a stand-in for "a savings bank started by Irish immigrants"; the corner
saloon is separate from the saloon under the Kellys (Ep 1), so both can be read; from straight above, map-scale people read as
dark pills; the network lines are drawn over everything (a diagram, not occluded).

QA (three passes, stills read at about 30 timepoints plus a frame-difference pop check over all 1710 frames): lifted places first
rose only 42 ft and were hidden by the rows in front (raised to 82 ft); tags collided with the place tag and the headline and ran
off the bottom (the solver now treats fixed text as obstacles; Brooklyn and side-by-side framings moved); the gold roof slab first
rose into the lens and covered the plan (it now slides away north); the open building was sorted to the front and its side showed
through its neighbour (fixed); the ink-to-pale switch at each lift start popped (now blended). Clip: 57 s at 30 fps.

## Round 14 (Nov 12): Episode 3 scenes for the script

The drawn scenes `ep3/script/VISUALS.md` asks for, in `ep3.js` (new code at the end of the file, under "Round 14"). The family
has names now: Yankel (father), Sore (mother), Rivke (12), Shmuel (7), still the cast keys `nfather`, `nmother`, `ndaughter`
(scale 0.8), `nson` (scale 0.5), all wheat gold; the Kellys coral; everyone else ink. 720p clips in `review/ep3/`, three stills
each, and a reference sheet per scene (`sheet_<name>.jpg`, our stills beside period and Flow prop references).

New helpers (all contacts go through E3K and are logged to `E3LOG`):
- `e3Clasp(A, wa, B, wb, P, name)`: two hands meet at one point; both arms are solved onto it and the hand to hand distance is
  logged as a `pair`. Used for every hand held between two people.
- `e3Settle(fo, u, name)`: after a walk stops a stride apart, the back foot steps up beside the front one (front foot planted).
- `e3Move(...)`: a hand on its way somewhere, solved like `reach` but logged as `move`, so the audit only counts real contacts.
- `e3LongShadow(body, G)`: a low-sun shadow, the figure sheared along the ground and flattened; `e3TrunkAt(hx, hy)`: the trunk
  drawn from its top handle; `e3HugBed(fo)`: a roped feather bed hugged with both hands under it; `e3Trap`: trapezoid travel.
- `cgOutside(t, {city: false})`: Round 13's Castle Garden drawing without the Manhattan skyline (the fort from the Battery side).

Scenes:
- **`ep3_runner` (ch 1 cold open + ch 4 payoff, 23 s).** The Battery at dusk, May 1884: low sun on the right, long shadows
  thrown left, warm rims, the Jersey shore and ships at anchor (masts, yards, stays) on the harbour, the fort (Castle Garden,
  small, behind the depot's iron fence with its gate standing open), a ferry house on the right with arched slips, a blank sign
  board with scribbles and a walking-beam ferry. Sore walks out with the trunk hanging from her near hand and Shmuel by the other
  (`e3Clasp`), Rivke behind hugging the roped feather bed. The man in the good coat (ink, bowler) waits at the lamp post at the
  right edge, a pure silhouette (no face detail) until he comes close; he walks up (5.6 to 8.4 s), smiling once the camera is in,
  stoops and takes the trunk out of Sore's hand (both hands on the handle, then it swings across to his far hand), offers his
  near hand, and Shmuel lets go of his mother, takes two steps and takes it (exact clasp at 11.3 s). Hard freeze 11.5 to 14.5 s:
  a white flash, the frame dims, a teal ring on the two hands, "he has never heard of Yankel Rabinowitz", "NEW YORK CALLED THEM
  RUNNERS". Cut through black to the payoff ("A FEW MINUTES LATER"): he leads Shmuel by the hand along the Battery with the
  trunk, Sore follows with the feather bed; Rivke looks back at the ferry slips (teal arrow, "the ferries were this way",
  "heading away from the ferries"), turns and runs, takes Shmuel's other hand (clasp) and pulls; he lets go, drops the trunk and
  hurries off left out of frame; Yankel pushes through a crowd from the ferries (the crowd leans out of his way); "the man in the
  good coat was gone". Nothing readable in the world: the ferry sign is scribbles.
- **`ep3_shtetl` (ch 2, 18 s).** (1) Friday night: outside the small wooden house, the window with two brass Sabbath candles
  lit (after the Flow candlesticks and challah props); the house opens up like `cutaway.js`: the whitewashed clay oven, the white
  cloth, the challah under its embroidered cover, Sore circling her hands over the candles and covering her eyes, Rivke at the
  table, Yankel and Shmuel seated (Shmuel's feet hang: a seven-year-old on a grown-up's chair; no foot contact is claimed).
  (2) Spring 1881, night: far roofs burned to black rafters on the horizon against a red glow, smoke and sparks; no people, no
  violence; Rivke at the dark window of the house in the foreground. (3) Dawn, 1882: Yankel leaves with a bundle on a stick,
  steps down from the sill, turns and waves, walks off; Sore at the door post with Shmuel by the hand, Rivke on the step waving.
- **`ep3_hester` (ch 6, 21 s).** A side-scroll down a pushcart market on Episode 1's tenement row (`street.js` `tenement()`):
  signboards in Hebrew-style letters that cannot be read (`hebrewish`), carts end to end at the curb after the Flow pushcart
  (plank box, two big spoked wheels, legs, long handles) with pots, apples, bolts of cloth, used coats on a pole; herring and
  pickle barrels; a vendor behind each cart with a hand on its edge; shoppers bargaining in front (hands out, then pointing); a
  goat on a rope held by a boy. Yankel walks ahead; Rivke follows, stops at the goat (feet settle together), and hurries to
  catch up. Texts: "Rivke's first morning", "pushcarts, end to end", "for a second, it felt like home", "an enclave". Then the
  same night: the room (`e3Room`, 84 px to the foot) and a kitchen beside it; Yankel and Sore asleep in the bed, Rivke and Shmuel
  on the feather bed on the floor, the boarder (ink) on two chairs pushed together in the kitchen under his coat.
- **`ep3_knock` (ch 9, 16 s).** The Kellys' flat in the evening, kelly_flat's look at room scale (wallpaper, airshaft window
  with washing, coal stove and kettle, shelf of pots, the lamp, a pile of shirts), the door in the cut wall and the dark hall
  outside with a gas jet. Sore and Rivke come along the hall; Rivke knocks three times (her knuckles touch the door at each
  tap); Ma gets up from her sewing (feet planted, then under her), crosses the room, takes the handle and pulls the door open,
  then folds her arms. Rivke translates, turning to her mother and back; Sore asks with an open hand ("a ticket, for her
  sister"); Ma, arms folded, listens, then unfolds them and nods ("Ma knew exactly where").
- **`ep3_moving_in` updated (ch 9, now 15 s).** Tag "SPRING 1886". Yankel wrestles the trunk at the foot of the stoop (its back
  end on the flags); Michael Kelly (coral) comes home along the sidewalk, crouches and takes the other end in both hands (handle
  and corner); they lift it level and carry it up the stoop between them, Yankel ahead with his far hand on the front handle;
  the trunk tilts with the treads. Sore, Rivke and Shmuel wait out of sight and follow with the feather bed, samovar and
  candlestick. The camera rises to Ma at her window, arms folded ("Ma Kelly is not so sure").
- **`ep3_looking_backward` updated.** Now the 3000 x 1983 Internet Archive scan
  (`ep3/public/img/g_nativism/keppler_looking_backward_puck_1893_ia_sim_puck_827.jpg`), referenced in place (no copy), cropped to the
  picture and caption (black margins and the PUCK masthead left out) and shown at its own aspect (1254 x 809). Every mark was
  re-measured on the scan (pixel coordinates in `LBM`: the five men's heads and hats, their shadows' heads, the centre man's raised
  hand, the newcomer's face, the caption line) and mapped to the desk through the crop, including the print's 0.6 degree turn on
  the desk. The camera's shadow and caption pushes were re-aimed. The old 1280 px copy's offsets are kept as `LBP` (carried onto
  the scan by an OpenCV ECC affine fit, correlation 0.86) for anything still measured on it.

QA (two rounds of renders and stills, frames read at several times per clip):
- **Round 1** (stills at 6 to 10 times per clip): the payoff ran off the promenade (sky showing under the floor), the ferry house
  was out of frame, Sore crouching pushed her skirt through the floor (she now holds the trunk and the runner takes it from her
  hand), the freeze drained the family's gold (now only dimmed), Rivke's bed hands and Shmuel's chair feet could not reach
  (bed regrabbed; his feet now hang), the Shabbat window flames had no contrast, the boarder overhung his chairs, the fish floated
  by a child, Michael's first takes of the trunk were out of reach, walkers stopped mid-stride (`e3Settle`), Ma's door handle
  passed through her (she now pulls the door to about 30 degrees and lets it swing on).
- **Round 2** (after a full render, plus the container restart): every clip re-rendered from the final code and checked as a
  contact sheet of frames every 2 s; text audit (`audit_text.mjs`, every 0.25 s) found four short texts in our new scenes and five
  in the Round 13 `ep3_looking_backward` read (all now at least 2.5 s; the read's beats were overlapped to make room). Final: no
  OUT, no OVERLAP, no SHORT in all six clips.
- **Contact audit** (every other frame, scratchpad `verify.mjs`; `move` hands excluded, they touch nothing): holds 0 px; hands
  and hand to hand pairs 0 to 0.22 px; planted feet 0 to 0.52 px error and 0 to 0.52 px drift (the worst is Rivke's last run in
  the payoff); seated and resting contacts 0 px. Moving_in: Michael's two hands on the trunk 0 px (he leans into the load on the
  stoop). Knock: all 0 px except planted feet 0.17 px.
- **Clips:** `ep3_runner` 23 s, `ep3_shtetl` 18 s, `ep3_hester` 21 s, `ep3_knock` 16 s, `ep3_moving_in` 15 s,
  `ep3_looking_backward` 25 s. Stills: `rn_open/freeze/payoff`, `sh_candles/night/dawn`, `hs_carts/goat/room`,
  `kn_knock/door/nod`, `mi_wide/stoop/window` (replaced), `lb_men/shadows/caption` (replaced). Sheets: `sheet_runner`, `sheet_shtetl`,
  `sheet_hester`, `sheet_knock`, `sheet_moving_in`, `sheet_looking_backward` (built by a copy of `ep3sheet.py`'s layout).

Known weak spots: the runner payoff is wide, so its figures are small (no faces); Rivke's run reads as a fast walk (the walk
cycle is not a run); Sore covering her eyes is a rough hand pose; in the night room the sleepers are side-on silhouettes on a
plain quilt; the goat is small and dark; the Hebrew-style sign letters are random strokes (unreadable on purpose) and might be
checked by someone who reads Hebrew so no real word appears by chance; ch 2's "burned roofs" are a generic far row.

### Round 14b (Nov 13): review fixes and the walk

- **The walk (user note: "weird and creepy gait").** `stepWalk` put the figure's origin 2% of its height below the floor and
  always aimed the ankle 0.03 h above the sole, so both knees stayed bent through the whole cycle: a crouching, sneaking walk in
  every Episode 3 clip. rig.js never draws an ankle lower than 0.03 h above the origin, so a sole rests on the origin's line
  whenever its ankle is anywhere from 0 to 0.03 h up. New `e3Legs`: the origin sits on the floor while a planted leg can reach
  nearly straight (99% of its length) and dips only as much as the stride needs at double support (about 2% of height: the natural
  bob, lowest at double support, highest at passing); a planted foot on the floor line aims its ankle as low as that clamp allows,
  so the stance leg straightens; the swing foot lifts 0.045 h (was 0.07). Arms now swing opposite the legs (about 16 degrees,
  elbows a little bent) wherever a scene has not posed them for holding something; the runner and Yankel's "shove" lost their
  frozen or outstretched arms. `e3Settle` and the new `e3Stand` end with straight legs. Since every Ep 3 walker uses `stepWalk`,
  this also fixes `ep3_steerage`, `ep3_castle_garden`, `ep3_sweatshop` and `ep3_moving_in`; all eight walking clips re-rendered.
  Filmstrips (10 fps, one cycle) were read for every walker: the runner (before/after: `review/ep3/gait_runner_before.jpg`,
  `gait_runner_after.jpg`), the family walking out, Rivke's dash, Yankel through the crowd, Yankel and Rivke on Hester Street,
  Yankel leaving the shtetl, Ma crossing her room, Michael on the sidewalk and the trunk carried up the stoop, the contractor,
  the pier walkers. Planted feet are now 0.00 px error and drift in all eight clips.
- **`ep3_knock`:** Rivke stands on straight legs, steps back from the door after knocking and stands clear of the door frame in the
  hall (Sore further back), then turns to her mother as she translates; Sore's open-hand gesture is lower; "COMPOSITE CHARACTERS"
  moved off the door to the floor area, bottom right.
- **`ep3_hester` signs:** no letter shapes at all now (`e3SignMarks`: broken dashes at two heights and a few ticks on a pale board).
  The ferry sign in `ep3_runner` is the cursive scribble line. (`ep3_names` still uses `hebrewish`; left for review.)
- **`ep3_runner` payoff:** a push-in (z 2.0) on Rivke taking Shmuel's hand and the trunk dropping, 17.0 to 18.7 s, then back out.
- Audits after the fixes: contacts (holds 0, hands and pairs 0 to 0.25 px, planted feet 0.00 px error and drift; steerage's berth
  sitters 2 px as in Round 13c); text audit clean (no OUT, OVERLAP or SHORT) on runner, hester, knock.
