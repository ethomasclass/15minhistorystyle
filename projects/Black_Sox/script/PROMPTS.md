# Image prompts: Say It Ain't So (Google Flow)

> **Not used (Oct 10).** The user chose no AI images for this video; every gap is filled with archival material (see `public/img/IMAGES.md`). Kept for reference: the tobacco-card style may suit a later video.

Real people (Landis, Jackson, Cicotte, Comiskey, Chase, Mathewson, Klem, Hulbert, Weaver and the rest) come **only from
archival photos** (`public/img/IMAGES.md`). These prompts fill the gaps where no photo exists: a pool seller, the
telegrams, the 1908 bribe, the signal pitch, the boy outside the courthouse, a phone in the stands.

---

## The look: "tobacco card" prints

**The idea.** Instead of painterly AI images, make every gap image a **flat, limited-ink print in the style of a 1910
tobacco baseball card**, using the channel's own colors. In the video each one is a **card dropped on the desk**
(`DropCard`), with a real cream border, a soft shadow, and an orange Abril name tab added in Remotion. It is never shown
full-bleed like a photo.

**Why it shouldn't read as AI:**
- **Flat shapes hide the usual tells.** Waxy skin, plastic lighting, too much detail and odd depth of field don't exist in
  a five-ink print. Hands and faces are simple shapes.
- **No faces to get wrong.** Real people are seen from behind, in silhouette or turned away. Anonymous people get simple,
  graphic faces.
- **They look designed, not generated.** The colors are the channel's (coral subject, teal, orange, ink, cream), so
  they sit next to our drawn diagrams and charts rather than pretending to be photos. Photos stay B&W, and cards are the
  only full-color things on screen. That's a clear rule the audience picks up on.
- **The real texture comes from us.** The card stock, edge wear, grain and shadow are added in Remotion, so every card
  shares one physical finish no matter how the generator varies.
- **Coral is already on the subject.** The subject is printed coral, so the mask only drives the teal trace and the
  parallax split. Flat backgrounds make the masks almost perfect.

**Make a style test first.** Run cards **T1–T3** below, in both palette A and palette B, and pick one, the way the
channel palette was picked for *Fix Everything*. Then run the series with the winner. That's six images before
committing to about fourteen.

## How to run them in Flow

- **Model:** Flow's image model (Nano Banana Pro if it's offered), at the largest size.
- **Aspect:** **portrait 3:4** for cards if Flow offers it, otherwise **9:16** (I'll crop to the card). The three
  marked **WIDE** are 16:9, for full-frame parallax scenes.
- **Paste the whole block, including the Style paragraph, word for word.** Keeping it identical is what makes the set
  look like one printed series.
- **After the first card you like, attach it as a style reference** to every later prompt ("match the style of the
  attached image exactly").
- **Regenerate, don't fix,** if you see: any text, letters or numbers (on jerseys too), gradients or a 3D/glossy look,
  extra fingers, modern objects, or a recognizable face on a real person.
- **Send back** PNGs named as shown (drag into the chat, or put them in `public/img/gen/`). No mask pass is needed:
  rembg handles flat backgrounds well.

### Style paragraph, palette A (channel colors, exact)

> Style: a flat, hand-cut screen-print illustration in the manner of a 1910 American tobacco baseball card crossed with
> a 1930s WPA poster. Bold simplified flat shapes, no gradients. Strictly limited to five flat inks on warm uncoated
> cream card stock (#F4EFE6): near-black ink (#111111) for outlines and shadow shapes; coral (#FF6F61) used ONLY on
> the single main subject; bright teal (#2FE0C4) for the sky or one large background shape; orange (#FF9F1C) as one
> tiny accent; and bare cream paper for highlights. Thick, confident ink outlines with a slight hand wobble. The color
> fills sit 1–2 pixels off-register from the outlines, like an old offset print. Fine halftone dots in the shadow
> areas, light paper grain, a few tiny ink specks. Simple and graphic, readable at a glance, like a designer cut it
> from paper: not a painting, not a photo, no 3D rendering, no glossy highlights, no airbrushed gradients, no blur,
> no depth of field. Every detail historically accurate for the stated year and place: uniforms, caps, gloves, suits,
> hats, ballpark architecture. No text of any kind: no letters, numbers, words, logos, team names or numbers on
> uniforms, signs, captions, signatures or watermarks. No border or frame. No recognizable real historical person:
> real people appear only from behind, in silhouette, or with faces turned away. Anonymous ordinary people may show
> simple graphic faces.

### Style paragraph, palette B (same colors, aged)

> *Use palette A word for word, but replace the ink list with:* Strictly limited to five flat inks on aged, slightly
> yellowed cream card stock (#EDE3CF): warm black ink (#1A1714); faded coral (#E8705F) ONLY on the single main subject;
> dusty teal (#3FB8A5) for the sky or one large background shape; faded orange (#E89A3A) as one tiny accent; and bare
> paper for highlights.

*Palette A pops and matches the on-screen marks exactly. Palette B looks more like a real 1910 card and is
easier on the eyes next to B&W photos. My guess is B, with the Remotion grade nudging the coral toward the tint we
use on photos.*

---

## Style test (do these first)

### T1. `card_pool_seller.png` (ch02 "pool selling": the strongest test of the style)
> 1866, the edge of a ballfield near Hoboken, New Jersey. A pool seller in a bowler hat, checked waistcoat and long
> dark coat stands on an upturned wooden crate, one arm raised high holding a small blank paper slip, mouth open
> mid-shout like an auctioneer. Below him, the backs and hats of a small crowd of men in 1860s suits holding up
> folded banknotes. In the far background, tiny ballplayers in long trousers and bibbed 1860s shirts on a grass field.
> The pool seller is the coral subject. Teal sky.
> *[Style paragraph]*

### T2. `card_catcher_1865.png` (ch02 "Six passed balls")
> 1865, an open grass ballfield. An 1860s catcher seen from behind and slightly to the side, crouched bare-handed
> (no glove, no mask, no chest protector, as in 1865), in long trousers, a bibbed baseball shirt and a soft cap,
> twisting to look back as the ball skips past him into the grass. His face is turned away. The ball is a small
> cream circle mid-bounce. Coral subject: the catcher. Teal sky, a low line of spectators in the far distance.
> *[Style paragraph]*

### T3. `card_phone_stands.png` (ch08 "a phone in every pocket": proves the style holds for today)
> Present day, the upper deck of a big-league ballpark at night. Seen from behind, a fan in a plain baseball cap and
> a plain hooded sweatshirt (no logos) holds up a smartphone in one hand. The phone screen is a plain glowing
> rectangle of flat orange with no text, numbers or icons. Below and far away, the bright diamond of the field under
> stadium lights, tiny players. Coral subject: the fan. Teal night sky. Make it feel like a 1910 card that somehow
> shows the present.
> *[Style paragraph]*

---

## The series

| # | File | Chapter, line | Aspect | Must-have |
|---|---|---|---|---|
| 1 | `card_pool_seller.png` (T1) | ch02 "Gamblers run something called pool selling" | card | **yes** |
| 2 | `card_catcher_1865.png` (T2) | ch02 "Six passed balls" | card | **yes** |
| 3 | `card_cash_hands.png` | ch02 "reportedly paid Wansley 100 dollars" | card | yes |
| 4 | `wide_hoboken_1865.png` | ch02 opening / ch08 last line (parallax) | **WIDE** | optional (the Currier & Ives print may cover it) |
| 5 | `card_telegrams.png` | ch03 "a lot of telegrams" | card | **yes** |
| 6 | `card_hippodrome.png` | ch03 "hippodroming, like a staged race at the circus" | card | optional |
| 7 | `wide_grandstand_bettors.png` | ch04 "Bettors work openly in the stands" (parallax) | **WIDE** | **yes** |
| 8 | `card_quiet_release.png` | ch04 "A trade. A release. No headlines." | card | optional |
| 9 | `card_bribe_1908.png` | ch04 "a man offers umpire Bill Klem thousands of dollars" | card | **yes** |
| 10 | `card_signal_pitch.png` | ch06 "Cicotte's second pitch hits the Reds' leadoff man" | card | **yes** |
| 11 | `card_hotel_envelope.png` | ch06 "only part of the money" / ch07 "$5,000" | card | yes |
| 12 | `card_courthouse_boy.png` | ch07 "Say it ain't so, Joe" | card | **yes** |
| 13 | `wide_empty_field.png` | ch07 "This time, nobody came back" (parallax) | **WIDE** | optional |
| 14 | `card_phone_stands.png` (T3) | ch08 "a phone in every pocket" | card | **yes** |

### 3. `card_cash_hands.png`
> 1865. Close up: two hands meet over a wooden rail at the edge of a ballfield. One hand, in the dark wool sleeve and
> white cuff of a gambler's coat, presses a folded wad of banknotes into the other, a ballplayer's bare, rough hand
> with the bibbed shirt's sleeve rolled up. Hands and forearms only, no faces. Coral subject: the banknotes and the
> player's hand. Teal background.
> *[Style paragraph]*

### 4. `wide_hoboken_1865.png` (WIDE 16:9)
> 1865, the Elysian Fields in Hoboken, New Jersey, a wide grassy ballground on the Hudson River. Distant Manhattan
> shoreline with church spires and masts across the river. A large crowd in 1860s dress (top hats, bowlers, women in
> wide skirts with parasols) lines the field in a loose ring. Tiny players in long trousers mid-game. In the near
> foreground, at the left, a knot of men in bowler hats leans together, one holding up banknotes. Layered clearly in
> depth: foreground figures, middle crowd, field, river, far shore, sky. Coral subject: the foreground knot of
> bettors. Teal sky and river.
> *[Style paragraph]*

### 5. `card_telegrams.png`
> 1877, a hotel room in Louisville, Kentucky, at night. On a plain wooden table under an oil lamp, a small pile of
> folded telegram forms and their envelopes (blank: no writing, no printing). A hand in a dark coat sleeve is
> reaching in from the edge of the frame to take one. A ballplayer's soft cap and a bat lean against the wall.
> Coral subject: the stack of telegrams. Teal wall.
> *[Style paragraph]*

### 6. `card_hippodrome.png` (optional)
> 1870s, a circus hippodrome track under a big tent. Two jockeys on horses race neck and neck, but one rider, seen
> from the side, is quietly pulling back on his reins with a sly glance over his shoulder. Simple crowd shapes in the
> stands. Coral subject: the rider pulling back. Teal tent canvas.
> *[Style paragraph]*

### 7. `wide_grandstand_bettors.png` (WIDE 16:9)
> About 1910, the covered grandstand of a big-league ballpark on a sunny afternoon, with steel columns and a wooden
> roof. Rows of men in straw boater hats, bowlers and shirtsleeves. In the near foreground, two men turned toward
> each other: one holds out a fan of banknotes, the other counts, both faces in profile and simple. Behind them, the
> crowd watches the game. Beyond the roof edge, the bright field and tiny players in baggy 1910 uniforms. Layered
> clearly in depth: the two bettors, the crowd rows, the field, the far fence, sky. Coral subject: the man holding
> out the banknotes. Teal sky.
> *[Style paragraph]*

### 8. `card_quiet_release.png` (optional)
> About 1910, a ballpark clubhouse doorway. Seen from behind, a ballplayer in a dark suit and flat cap walks out
> carrying a battered leather bag, his uniform folded over his arm. Behind him, a closed office door with a frosted
> glass panel (blank, no lettering). Quiet, nobody watching. Coral subject: the departing player. Teal wall.
> *[Style paragraph]*

### 9. `card_bribe_1908.png`
> October 1908, a New York City street at night, a row of brownstone houses under a gas streetlamp. On the
> sidewalk, an umpire in a dark three-piece suit, dark cap and overcoat is seen from behind and to the side, face
> turned away. A man in a doorway on the stoop leans toward him, holding out a fat roll of banknotes. Coral subject:
> the man with the money. Teal night sky.
> *[Style paragraph]*

### 10. `card_signal_pitch.png`
> October 1919, a big-league ballpark in Cincinnati, a sunny afternoon, big crowds in the stands. Seen from behind
> the pitcher's mound: a pitcher in a white 1919 wool uniform with a soft cap (no letters, no numbers), his
> follow-through just finished. At home plate, the batter in a grey-blue road-style uniform has turned away, and the
> ball, a small cream circle, has just struck him in the back. Catcher and umpire crouched behind. Nobody's face
> visible. Coral subject: the pitcher. Teal sky.
> *[Style paragraph]*

### 11. `card_hotel_envelope.png`
> 1919, a hotel room. A plain made bed with a white pillow, and half tucked under the pillow a thick plain envelope
> spilling banknotes. A ballplayer's soft cap rests on the bedpost. Window blinds throw stripes of light across the
> bed. No people. Coral subject: the envelope of money. Teal wall.
> *[Style paragraph]*

### 12. `card_courthouse_boy.png`
> September 1920, the steps of a big stone courthouse in Chicago. A small boy in a flat newsboy cap, short trousers
> and knee socks looks up, his simple face worried. Facing him, his back to us, a tall man in a dark suit and a
> straw boater hat (we never see his face). A crowd of adult men in hats is blurred into flat shapes behind them.
> Coral subject: the boy. Teal sky.
> *[Style paragraph]*

### 13. `wide_empty_field.png` (WIDE 16:9, optional)
> About 1921, an empty big-league ballpark at dusk. Empty wooden grandstand, empty field, bases still in place, a
> single wooden bat lying on the grass near home plate. Long shadows. Layered clearly in depth: the bat in the
> foreground, the infield, the grandstand, the sky. Coral subject: the bat. Teal sky.
> *[Style paragraph]*

### 14. `card_phone_stands.png` (T3, above)

---

## In the video (notes for the build)

- **DropCard** with a 14 px cream border, rounded 6 px corners, a faint edge wear, and an orange Abril tab under it
  naming the moment ("POOL SELLING · 1866"). The text goes on the tab, never in the art.
- **Parallax:** the three WIDE images split into foreground/background with `tools/layers.py` (subject from rembg,
  background inpainted), with a slow push and a 2–3% layer offset. Cards get a subtle 2-layer lift: the subject rises
  2–3 px off the card as it lands.
- **One living detail** per wide scene, as in *Good Luck*: drifting cigar smoke (grandstand), a flickering gas lamp
  (1908 street), blowing grass (Hoboken, the empty field).
- **Tag:** `Illustration · pool selling, 1860s` etc., same mono tag as every image.
