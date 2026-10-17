# Image prompts: The Balloon War (Google Flow)

Archival photos carry the real people, ships, decoys and balloons (`public/img/IMAGES.md`). These prompts fill the
gaps: scenes nobody photographed, moments we must not show literally (Bly), and the wide establishing shots that the
parallax moves are built on.

---

## The look: layered cut-paper silhouettes

Built from the three references: the 1840s cut-paper parlor (crisp, finely cut black figures in a softly drawn room),
the 1920s book plate (black figures at a ship's rail against a pale sea and a low sun), and the modern moonlit forest
(depth told by **flat planes of one color, each lighter as it recedes, under a big pale disc**).

**Why silhouettes suit this video:**
- **No faces to get wrong.** Real people (the 320th, Woodson, the Ghost Army, the Mitchells, Takeshita) appear only as
  profiles and shapes, which is respectful for the heavy chapters and safe for real people.
- **They read instantly on a phone.** One black shape against one glowing sky.
- **They are built in layers.** Every plane is one flat tone, so I can split each image into 3–5 depth layers in code and
  move them at different speeds (true parallax), and cut the balloon out so it can fly across the frame on its own.
- **They sit next to B&W archival photos** without pretending to be photos.

### Style paragraph (paste at the end of every prompt, word for word)

> Style: a layered cut-paper silhouette illustration, like a master silhouette artist's work crossed with a
> 1920s book-plate illustration. The scene is built from four or five clearly separated depth planes. The nearest
> plane is solid flat black (#111111) with crisp, finely cut edges and delicate detail in the outlines (hat brims,
> rifles, cables, branches, ropes). Each farther plane is ONE flat, even tint of the scene's single sky color, a little
> lighter than the plane in front of it, with no texture, no shading and no gradient inside it, like stacked sheets of
> colored paper. The sky is the lightest plane, with a soft, smooth gradient and a large pale glowing disc (the sun or
> the moon) placed as stated. Light, subtle paper grain over everything. No faces or facial features: every person is a
> solid black profile or shape. No text of any kind: no letters, numbers, words, insignia, flags, logos, signs,
> captions, signatures or watermarks. No border or frame. Not a photograph, not 3D, no glossy highlights, no lens blur,
> no depth of field. Every shape historically accurate for the stated year and place: uniforms, helmets, vehicles,
> ships, balloons, cars and buildings.

**Sky colors** (one per scene, so each chapter has its own mood; named in each prompt):
D-Day dawn **grey-teal** (#5E8C8A → #D9E4DF) · Ghost Army night **deep teal** (#1F4E57 → #9CC9C4) · Japan
**coral-peach** (#C9604F → #F6D3BF) · the Pacific night **indigo** (#2C3555 → #A9B4D6) · the newsroom **sepia**
(#6B5642 → #E9DCC4) · Oregon spring **sage** (#5F7258 → #DCE5CF) · the ending **cream gold** (#B08A4E → #F4EFE6).

## How to run them in Flow
- **Model:** Flow's image model (Nano Banana Pro if offered), largest size. **Aspect: 16:9 wide** unless marked TALL
  (9:16, for Shorts and the thumbnail).
- **Paste the scene, then the Style paragraph word for word.** After the first image you like, attach it as a
  **style reference** to every later prompt ("match the style of the attached image exactly").
- **Regenerate, don't fix,** if you see: faces, any text, numbers or insignia, flags, gradients inside a plane, a 3D or
  glossy look, extra limbs, or a wrong period detail (a modern helmet, a modern car).
- **Mask pass (where listed, for anything that will move on its own):** upload the image you kept and run:
  > Return this exact same image, pixel-aligned, with no other change at all, except: fill the silhouette of the
  > [balloon / named subject] completely with flat pure magenta (#FF00FF), including its cables and ropes. Do not move,
  > crop, recompose or redraw anything else.
- **Clean plate (optional, best quality for a moving balloon):** upload the kept image and run:
  > Return this exact same image, pixel-aligned, with no other change at all, except: remove the [balloon] and its
  > cables completely and continue the sky and background behind them naturally.
- **Send back** PNGs named as below (drag into the chat or put them in `public/img/gen/`). Name the magenta copy
  `<name>_mask.png` and the plate `<name>_plate.png`.

**Style test first:** run **S1** and **S2**, pick a favorite, and attach it as the style reference for the rest.

---

## Style test

### S1. `ch02_beach_balloon_walk.png` (ch02 "Soldiers walked them up the beach by hand") · WIDE · must-have · mask pass
> June 6, 1944, a beach in Normandy, France, at dawn. In the foreground, two American soldiers in WWII helmets and
> field packs walk up the wet sand, leaning against the pull of a thick steel cable they hold between them. The cable
> rises to a small barrage balloon floating about thirty feet above them: a fat teardrop-shaped balloon with three
> tail fins at the back. Behind them, low landing craft with open ramps sit in the surf; farther out, a line of
> warships, and over several of them more small balloons on cables. Sky color: grey-teal, with a large pale sun low on
> the horizon behind the ships.
> *[Style]* · *(Mask pass: the balloon in the foreground and its cable.)*

### S2. `ch03_tank_lift.png` (ch03 "four American soldiers pick up a tank") · WIDE · must-have
> 1944, the edge of a field in the French countryside, evening. In the foreground, four American soldiers in WWII
> uniforms and helmets lift a full-size Sherman tank off the ground with their hands, one at each corner, as if it
> weighs nothing; its tracks hang in the air. At the left edge, two French civilians in 1940s caps stand frozen beside
> their bicycles, watching. Behind, a hedgerow and a farmhouse roof. Sky color: deep teal, with a large pale moon
> rising at the right.
> *[Style]*

---

## The series

### ch01 · Look up
**`ch01_town_looking_up.png`** ("people all over America looked up") · WIDE · mask pass
> Present day, a small American main street at dusk, February. In the foreground, a row of ordinary people in winter
> coats and hats stand on the sidewalk, some pointing, some holding up phones (the phones are plain glowing
> rectangles with no screens or icons), all looking up. Behind them, low storefronts and a water tower. High in the
> sky, a tiny white round balloon with a small payload hanging below it. Sky color: grey-teal at dusk, a pale moon at
> the upper left.
> *[Style]* · *(Mask pass: the balloon.)*

**`ch01_three_balloons.png`** ("in World War Two, they had three very different jobs") · WIDE · mask pass
> A wide, empty sky over a calm sea at sunrise, seen from a low beach. Three balloons float in a row against the sky,
> each very different: at left, a fat teardrop barrage balloon with three tail fins, tethered by a long cable to a ship
> below; in the middle, a full-size army tank that is clearly inflatable, floating in the air with its tracks
> drooping; at right, a large perfectly round paper balloon with a ring of small sandbags and a bomb hanging beneath
> it. Sky color: cream gold, with a huge pale sun behind the middle balloon.
> *[Style]* · *(Mask pass: all three balloons, each separately: three magenta passes, or one pass with the three
> filled magenta, cyan #00FFFF and yellow #FFFF00 from left to right.)* *Also the thumbnail base.*

### ch02 · The protector
**`ch02_cable_diagram.png`** ("If an enemy plane dives low to attack, it could hit the cable") · WIDE
> 1944, the English Channel from low over the water. A line of barrage balloons hangs over a convoy of ships, each on a
> long, thin, taut steel cable rising from a ship's deck. A single WWII fighter plane dives low between two cables at
> the left, banking sharply away from them. Sky color: grey-teal, the sun hidden behind thin cloud.
> *[Style]*

**`ch02_diner_window.png`** ("its men watched German prisoners of war eat in restaurants that wouldn't serve them") ·
WIDE · must-have
> 1943, a small town in Tennessee at night. Outside on the sidewalk, in the foreground, two Black American soldiers in
> WWII army uniforms and garrison caps stand still, seen in profile, looking through the large window of a brightly lit
> 1940s diner. Inside, through the glass, the black profiles of several men in plain prisoner-of-war work clothes sit
> at the counter eating while a waiter serves them. The diner window glows warm; the street is dark. Sky color: deep
> teal night; the diner's window light is the pale disc of this scene.
> *[Style]*

**`ch02_aid_station.png`** ("set up an aid station on the sand, and kept going for about 30 hours") · WIDE · must-have
> June 1944, a beach in Normandy, behind a low wall of rocks and shingle. A single American army medic in a WWII
> helmet kneels in profile, bending over a soldier lying on the sand, his hands working on a bandage. Behind him,
> other soldiers sit or lie resting against the rocks. No blood, no wounds shown. Beyond the rocks, the surf, landing
> craft and balloons on cables over the water. Sky color: grey-teal, late afternoon, a pale sun low and hazy. Quiet,
> exhausted, dignified.
> *[Style]*

**`ch02_medal_in_sand.png`** ("an Army general placed a medal in the sand on that same beach") · WIDE
> Present day, a wide empty beach in Normandy at morning, calm surf. In the foreground, the profile of one soldier in a
> modern dress uniform and beret, bending down to lay a small medal on its ribbon on the sand. A short row of other
> uniformed people stands at attention behind him, saluting. Sky color: cream gold, a large pale sun over the sea.
> *[Style]*

### ch03 · The fake
**`ch03_sound_truck.png`** ("At night they drove around with huge speakers, blasting recordings of tanks") · WIDE ·
mask pass
> 1944, a dark country road in France at night. A WWII army half-track truck with a huge loudspeaker mounted on its
> back drives slowly past a hedgerow; faint curved sound-wave lines spread from the speaker across the frame. In the
> distance, behind a hill, the outlines of an army that isn't there: rows of tank shapes. Sky color: deep teal, a large
> pale moon.
> *[Style]* · *(Mask pass: the truck.)*

**`ch03_inflating_tank.png`** ("They pumped up rubber tanks") · WIDE
> 1944, a field at dusk. Three American soldiers in WWII uniforms work around a half-inflated rubber tank decoy lying
> on the grass, sagging and crumpled on one side, its gun barrel drooping. One soldier works a hand pump; a hose runs
> to the tank. Behind them, two fully inflated tank decoys stand in a row under camouflage netting. Sky color: deep
> teal, the moon low on the horizon.
> *[Style]*

**`ch03_cafe_gossip.png`** ("gossiped in cafés, in case spies were listening") · WIDE
> 1944, a small French café at night. At a table by the window, two American soldiers lean together talking with
> exaggerated, theatrical gestures; at the next table, a man in a 1940s hat and coat sits very still behind a
> newspaper, listening. Wine bottles, a hanging lamp. Sky color: sepia; the lamp is the pale disc.
> *[Style]*

### ch04 · The paper balloon
**`ch04_theater_paper.png`** ("Schools sent them to work in giant theaters and a sumo hall in Tokyo") · WIDE ·
must-have · mask pass
> 1944, inside a huge Tokyo theater. Rows of Japanese schoolgirls in wartime school clothes with their hair tied back
> sit at long tables, carefully pasting small sheets of paper into large curved panels. Above them, filling the stage
> and the tall space under the theater's balconies, a giant round paper balloon is being test-inflated. Sky color here
> is the theater's light: coral-peach; a soft round glow of light behind the balloon.
> *[Style]* · *(Mask pass: the balloon.)*

**`ch04_launch_dawn.png`** ("Japan started launching balloons across the Pacific Ocean") · WIDE · must-have · mask pass
> Late 1944, a beach on the Pacific coast of Japan at dawn. A crew of men in wartime uniforms lets go of a giant round
> paper balloon; it rises from the sand trailing ropes, with a ring of small sandbags and a dark bomb shape hanging
> beneath it. Pine trees on a low dune; two more balloons already high in the sky. Sky color: coral-peach, a large pale
> sun just above the sea.
> *[Style]* · *(Mask pass: the rising balloon and everything hanging from it.)* *Also the Short cover.*

**`ch04_pacific_night.png`** ("Rise, sink, drop a bag. For about three days.") · WIDE · mask pass · clean plate
> Night over the open Pacific Ocean, far from land. A single round paper balloon drifts high, a ring of small sandbags
> hanging beneath it, one sandbag falling away below. Long, flowing streaks of wind run across the sky from left to
> right, like a river of air. Far below, the sea and a line of cloud. Sky color: indigo, a large pale moon.
> *[Style]* · *(Mask pass: the balloon. Clean plate: yes. This is the one that flies across the screen.)*

### ch05 · Silence
**`ch05_newsroom.png`** ("the newspapers stayed quiet") · WIDE
> 1945, an American newspaper newsroom at night. Rows of desks with typewriters and desk lamps; a man in shirtsleeves
> and a visor sits in profile, his hands frozen above the keys, a telephone at his ear. A tall printing press in the
> background. Sky color: sepia; the desk lamp is the pale disc.
> *[Style]*

**`ch05_power_line.png`** ("One hit a power line in Washington State") · WIDE · mask pass
> 1945, dry open country in Washington State at night. A tall line of wooden power poles crosses the frame; a deflated
> paper balloon hangs tangled across the wires, its ropes snagged, a small spark at the wire. In the far distance, the
> low dark shape of a large industrial plant with a tall stack. Sky color: indigo, a pale moon.
> *[Style]* · *(Mask pass: the balloon.)*

### ch06 · Bly, Oregon (heavy: nothing violent, nothing shown that the narration doesn't need)
**`ch06_forest_road.png`** ("drove ... up into the mountains for a picnic") · WIDE · must-have
> May 1945, a quiet forest road in the mountains of southern Oregon in spring. A 1940s family sedan is parked at the
> side of a dirt road under tall ponderosa pines. No people. Sunlight falls between the trunks. Peaceful and still.
> Sky color: sage, a pale sun through the trees.
> *[Style]*

**`ch06_empty_woods.png`** (after "It was too late.") · WIDE · must-have
> A clearing in a spring pine forest in Oregon. Tall trunks, low bushes, soft light. Nothing else: no people, no
> objects, no smoke. Utterly still. Sky color: sage, the sun hidden behind the trees.
> *[Style]*

### ch07 · The answer
**`ch07_cranes_arrive.png`** ("a man arrived in Bly carrying a gift from Japan") · WIDE · must-have
> 1987, a small stone monument in a clearing among tall pine trees. A middle-aged man in a 1980s jacket walks toward
> it in profile, carrying in both arms long strings of folded paper cranes that hang down and sway. Sky color: cream
> gold, a large pale sun low behind the pines.
> *[Style]*

**`ch07_crane_strings.png`** ("a thousand paper cranes") · WIDE · mask pass
> Close view of many long strings of folded paper cranes hanging from a pine branch, gently turning in a breeze, each
> crane a crisp black silhouette. Sky color: cream gold, a large pale sun behind them.
> *[Style]* · *(Mask pass: the cranes.)*

**`thumb_balloon_war.png`** (thumbnail base) · WIDE
> Use `ch01_three_balloons.png` (above) as the thumbnail base; no separate prompt needed. If you want a TALL version
> for Shorts covers, run that prompt again at 9:16 with the three balloons stacked high in the sky.

---

## What I'll do with them (motion)
- **True parallax:** each image is split by its flat tones into 3–5 depth layers (`tools/silhouette_layers.py`); the
  near plane slides fastest, the sky barely moves. No AI motion needed, no wobble.
- **Flying balloons:** the mask pass (or the clean plate) cuts the balloon free. It then drifts across the scene on its
  own path, bobbing, tilting slightly in the wind, its cable swaying, passing *behind* the near trees and *in front of*
  the far ones.
- **Ch04's crossing:** the Pacific-night balloon rides the wind streaks across the screen, a sandbag drops each time it
  dips (rise, sink, drop a bag), timed to the narration.
- **Ch07:** the paper balloon from ch04 folds into a crane (drawn morph) as the closing line lands.
