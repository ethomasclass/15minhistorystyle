# Image, music and sound prompts: Good Luck (Ouija)

These cover only what we **can't reuse** from Fix Everything (Reform Era), Grip Tighter or Ambrose. The reuse list is first, so nothing gets made twice.

Real people (Kennard, Bond, Fuld, Pearl Curran, Conan Doyle, Faraday, Blatty) always come from archival photos (Part 3). No prompt here shows a recognizable real person or actor. Where a real event happens (the patent test, Pearl's séance, the 1949 case, *The Exorcist*), the painting shows **hands only** or figures **from behind**.

---

## Status (Oct 6)

- **All 21 images are in** `video/public/img/gen/`, as originals. Masks and teal outlines for the 15 with a mask pass are in `video/public/img/masks/`. They're pixel-aligned with the originals; checked automatically.
- **Still wanted:**
  - `board_flat.png` (#16), so the 3D board matches the painted sun-and-moon board.
  - Larger downloads (2K or 4K) if Gemini offers them. Everything came in at 1376×768.

# Part 0: Reused from the other repos (nothing to make)

| What | From | Where it goes |
|---|---|---|
| Fox family plate, Hydesville house, Fox sisters 1852, *Rochester Knockings* 1851, Knock pamphlet art | Reform Era `img/ch03/` | ch02 (already used in the test scene) |
| Civil War soldier portraits (`soldier1–3`), Shiloh/Pittsburg Landing engravings | Reform Era `img/ch03/`, Ambrose `img/war/` | ch02 "after the Civil War" |
| P. T. Barnum (optional) | Reform Era `img/ch03/` | ch02, if you want one beat on the sisters going public |
| `title_sting.mp3`, channel intro | Reform Era | after the cold open |
| `spirits.mp3` (first ~50 s: music box, detuned piano, soft knocks) | Reform Era | ch02, made for the Fox sisters |
| `schools.mp3` (light, curious, comic button) | Reform Era | ch03 Kennard Novelty / patent legend / subscribe plug |
| `cold_open.mp3` (felt-piano ostinato, ticking clock, "investigators") | Reform Era | ch09 science section (Faraday, the blindfold study) |
| `dix.mp3` (grave piano and cello) | Reform Era | backup for ch06 if `theme_grief` doesn't land |
| SFX: knock, whoosh, stamp, boom, page_turn, marker_tick, pencil_soft, tick, quill | Reform Era `sfx/` | everywhere (already copied into `video/public/sfx/`) |
| 3D board, board artwork (`board_tex.png`), planchette, scrape sound | this repo (test scene) | every board shot and chapter title |

---

# Part 1: Gemini images

## How to run them

- **Model:** Gemini image generation (Nano Banana Pro), at the largest size it offers. **Aspect ratio:** 16:9 for every image.
- **Paste the whole block, including the Style paragraph** (and the Composition paragraph for the hands series). Keeping them identical is what makes the images look like one series.
- **Reference images:**
  - **Hands series:** attach `video/public/img/test/board_tex.png` (our board artwork) to every prompt, so the painted board matches the 3D one. After you have `hands_00_board.png`, attach that too.
  - **Other scenes with a board in them:** attach `board_tex.png`.
- **Sending them back:** PNG, named as shown. Drag them into this chat, or add them to `video/public/img/gen/`. If a result has text (other than the board's letters), extra fingers, modern objects or a wrong detail, regenerate it rather than fixing it.
- **Mask pass (where listed):** once you have an image you like, upload that same image back with the mask prompt and send me both files. Name the magenta copy `<name>_mask.png`. The mask lets me put the coral color and the teal outline exactly on the subject.

**Style** (goes at the end of every prompt below):

> Style: an American oil painting in the manner of early-twentieth-century American magazine illustration and realist painting. Confident visible brushwork, muted palette (umber, ochre, slate blue, dull red, bone), warm directional light with soft shadows, faint craquelure and slightly aged varnish. Every detail must be historically accurate for the stated year and place: clothing, hairstyles, furniture, wallpaper, lamps, toys and tools. No text of any kind: no letters, words, signs, labels, captions, logos, signatures, dates or watermarks, except the letters already printed on the talking board in the attached reference. No frame or border. No recognizable real historical person and no recognizable actor. Faces, where visible, belong to ordinary anonymous people.

**Composition** (hands series only, goes before the Style paragraph):

> Composition, identical for every image in this series: the camera is directly overhead, looking straight down. The talking board from the attached reference lies flat and square to the frame, filling the central 70% of the frame, with YES at top left and NO at top right. A heart-shaped wooden planchette with a round window rests in the center of the board. Show hands and forearms only, entering from the bottom and sides of the frame. No heads, faces or shoulders anywhere.

**Mask pass** (the same for every hands image):

> Return this exact same image, pixel-aligned, with no other change at all, except: fill the silhouette of the planchette completely with flat pure magenta (#FF00FF). Keep the fill tight to its outline, including where fingers overlap it (fingers stay unfilled). Do not move, crop, recompose or redraw anything else.

---

## The hands series ("same board, different hands")

The video's spine: one board and one angle; only the hands, light and props change. Make `hands_00` first, then attach it as a second reference for the rest.

### H0. `hands_00_board.png` (ch09 "the board barely changed"; reference for the series)
> *[Composition]* No hands at all. The board rests on a plain dark walnut tabletop. Soft, even, neutral daylight from the top of the frame. The planchette sits alone in the center. Quiet and still.
> *[Style]*

### H1. `hands_1920_couple.png` (ch04 "knees touching"; ch06 downstairs)
> *[Composition]* 1920, a middle-class American parlor at night. The board rests across two people's laps, and at the bottom edge of the frame you can just see a woman's knee in a pale silk dress touching a man's knee in grey wool trousers. Two pairs of hands, hers with a thin lace cuff and a small ring, his with a starched white shirt cuff and a plain cufflink, have their fingertips on the planchette, almost touching each other. Warm amber light from a fringed table lamp at the top left. A dance card and a pencil lie at the top right edge. Playful, intimate, a little flirtatious.
> *[Style]*
> *(Mask pass: yes.)*

### H2. `hands_1913_pearl.png` (ch05 Patience Worth)
> *[Composition]* July 1913, a St. Louis parlor on a hot summer night. Two women's hands rest lightly on the planchette: one pair with a plain gold wedding band and rolled-up white shirtwaist sleeves, the other with a dark sleeve. At the right edge of the frame, a third person's hand holds a pencil over a notebook, writing down letters. A palm-leaf fan and a glass of water at the top left. Warm gaslight from the left, a feeling of hush and concentration.
> *[Style]*
> *(Mask pass: yes.)*

### H3. `hands_1918_mother.png` (ch06 Empty Chairs; heavy chapter)
> *[Composition]* Autumn 1918, an American bedroom. One older woman's hands alone on the planchette: worn knuckles, a thin wedding band, a black mourning cuff at the wrist. At the top right edge of the frame, a small framed portrait photograph lies face up, too small to make out (a young soldier in a WWI U.S. Army campaign hat, face indistinct), beside an opened telegram envelope with no readable writing. Cold grey window light from the top. Very still and quiet, grief without melodrama.
> *[Style]*
> *(No mask: heavy chapter, teal lines only.)*

### H4. `hands_1967_kids.png` (ch07 Next to Monopoly)
> *[Composition]* 1967, a wood-paneled suburban basement rec room at a sleepover. The board sits on shag carpet. Three children's hands crowd onto the planchette, one with a woven friendship bracelet, one in a striped pajama sleeve. A flashlight beam crosses the board from the bottom right; the rest of the frame is dim. The edge of a plaid sleeping bag at the left and a bowl of popcorn at the top. The open lid of a game box at the top right edge, plain, with no printing. Giggly, spooky fun.
> *[Style]*
> *(Mask pass: yes.)*

### H5. `hands_1973_alone.png` (ch01 cold open, right half; ch08)
> *[Composition]* 1973, an unfinished house basement in winter. The board lies on a bare concrete floor. One child's hand alone rests on the planchette, small, in the cuff of a knitted 1970s sweater. Harsh light from a single bare bulb above the top of the frame; deep shadow at the edges; a cold blue cast from a high basement window at the top left. Cardboard boxes at the edge of the frame. Lonely and uneasy, but nothing supernatural visible.
> *[Style]*
> *(Mask pass: yes.)*

---

## Scenes

### 1. `ch01_basement.png` (cold open: "a 12-year-old girl finds the same kind of board in her basement")
> A wide view of an unfinished house basement in Washington, D.C., in December 1973: concrete floor, exposed joists, a furnace, storage shelves with cardboard boxes, a single bare bulb on a pull chain. A girl of about twelve in a 1970s nightgown and cardigan kneels on the floor with her back to us, small in the frame, a talking board in front of her. Cold blue light from a high window and a warm pool of bulb light. Quiet, ordinary, a little uneasy. Nothing supernatural.
> *[Style]*

**Mask pass:** fill the silhouette of the kneeling girl.

### 2. `ch02_alphabet_seance.png` ("Someone calls out the alphabet… and waits for a knock")
> An American parlor séance around 1855, by oil lamp. Six people sit around a round wooden table with their hands flat on it. A man in a frock coat stands holding up a printed alphabet card and pointing at a letter with a pencil, looking toward the table. One woman rests her forehead on her hand, bored; another leans in to listen. Patient, slow and slightly comic. Faces anonymous.
> *[Style]*

**Mask pass:** fill the man with the alphabet card.

### 3. `ch02_ohio_camp.png` (1886 talking board in Ohio)
> A Spiritualist summer camp in northern Ohio, August 1886: white wooden cottages with porches among tall trees by a lake. On one porch, a small group of men and women in 1880s summer clothes crowd around a small table where two people have their hands on a homemade wooden talking board with painted letters. Late-afternoon gold light, lanterns not yet lit. Curious and excited, like a new gadget.
> *[Style]*

**Mask pass:** fill the talking board and the table it sits on.

### 4. `ch03_novelty_workshop.png` ("the Kennard Novelty Company. Novelty. As in, a toy.")
> A small woodworking shop in Baltimore, 1890. Stacks of identical blank pale wooden boards, a worker in shirtsleeves and a canvas apron, seen from behind, brushing black lettering onto a board through a stencil, rows of finished boards drying on racks, small heart-shaped wooden pointers in a crate, sawdust, a pot-bellied stove, tall dusty windows with afternoon light. Busy and commercial, like a toy factory.
> *[Style]*

### 5. `ch03_patent_office.png` (the patent-office legend)
> Washington, D.C., 1890, a high-ceilinged government examining room: tall windows, dark wood cabinets of small drawers, stacks of patent models and ledgers. On a wide desk lies a talking board. Three people's hands, two men's in dark sleeves and one woman's in a lace cuff, rest on its planchette. A government examiner in a three-piece suit and spectacles stands behind the desk, seen from the side and slightly behind so his face is turned away, arms folded, skeptical. Cool daylight. A sense of a test underway.
> *[Style]*

**Mask pass:** fill the planchette and the hands on it, as one shape.

### 6. `ch03_locket.png` ("Helen was wearing a locket that night")
> An extreme close-up of an open gold Victorian oval locket hanging on a fine chain against a woman's high lace collar, around 1890. Inside the locket is a tiny engraved portrait of a woman with dark hair in an 1860s style (an anonymous face). The facing half of the locket is a small blank cream oval plate with nothing written on it. Soft lamplight glinting on the gold. Shallow depth of field.
> *[Style]*

*(I'll write "Ouija" on the blank plate as a handwritten teal note, so no text is needed in the image.)*

**Mask pass:** fill the locket (both halves).

### 7. `ch04_parlor_chaperone.png` ("Parents watched. Neighbors talked.")
> A middle-class American front parlor around 1905, evening. A young man and young woman sit facing each other on two chairs, knee to knee, a talking board across their laps, fingertips on the planchette, absorbed. In the doorway behind them, an older woman in a dark dress sits with knitting, watching them over her spectacles. Patterned wallpaper, a piano with framed photographs, a fringed lamp. Warm, gently comic. Faces anonymous.
> *[Style]*

**Mask pass:** fill the young couple and the board, as one shape.

### 8. `ch05_patience_imagined.png` (optional: "a voice from three hundred years ago")
> How a 1910s reader might have imagined "Patience Worth": a plain young Englishwoman of the 1600s, in a simple dark Puritan-era dress, white coif and apron, standing at the half-open door of a thatched stone cottage in the English countryside at dusk, looking out at fields. Her face is soft and anonymous, partly in shadow. Hazy, slightly dreamlike, painted like a memory.
> *[Style]*

*(It goes on screen with the note "how readers imagined her", so it's never presented as a real person.)*

### 9. `ch06_house_cutaway.png` (ch06 "So picture one house around 1920"; heavy chapter)
> A dollhouse-style cutaway view of a two-story American frame house around 1920, at night, with the front wall removed so both floors are visible. Downstairs in a lamplit parlor, a young couple sit knee to knee with a talking board on their laps, laughing. Upstairs in a dim bedroom directly above them, an older woman sits alone on the edge of a bed with a talking board on her lap, one hand on its planchette; a soldier's photograph on the nightstand (face indistinct). Warm amber light downstairs, cold grey-blue upstairs. Faces small and anonymous. Quiet and bittersweet.
> *[Style]*

*(No mask: heavy chapter. I'll trace the two planchettes in teal.)*

### 10. `ch07_toy_aisle.png` ("Now it sits on toy-store shelves next to Monopoly and Clue")
> A department-store toy aisle in 1967: long shelves stacked with board-game boxes in bright 1960s colors, all plain with no printing at all, a few toy rockets and dolls on the end cap, fluorescent ceiling light, linoleum floor. A boy and a girl in 1960s clothes, seen from behind, look up at the shelves; the girl reaches for a long flat box. Cheerful and commercial.
> *[Style]*

**Mask pass:** fill the long flat box in the girl's hands.

### 11. `ch07_sleepover.png` ("Lights off, flashlight on, whispering, 'Is anybody there?'")
> A wide view of a 1967 suburban basement rec room at night: wood paneling, a plaid couch, shag carpet, a portable record player. Four girls of about twelve in pajamas and sleeping bags sit in a circle on the floor around a talking board, lit only by a flashlight held under one girl's chin (seen from behind and the side, faces mostly in shadow). Giggly, spooky fun, not frightening.
> *[Style]*

**Mask pass:** fill the board and the hands on it.

### 12. `ch08_1949_house.png` ("In 1949… a teenage boy from just outside Washington, D.C.")
> A modest two-story brick and frame house in a Maryland suburb outside Washington, D.C., on a winter night in 1949. Bare trees, a light dusting of snow, a 1940s sedan parked at the curb, one upstairs window lit warm yellow, every other window dark. Seen from across the quiet street under a single streetlamp. Still, ordinary, faintly ominous. No people.
> *[Style]*

**Mask pass:** fill the lit upstairs window.

### 13. `ch08_theater_line.png` ("People lined up around the block")
> A city street in winter, late December 1973, at night. A long line of moviegoers in 1970s winter coats, scarves and knit hats stretches from an old movie palace down the sidewalk and around the corner. The theater's marquee glows with rows of bulbs but its letter board is completely blank. Steam rises from a manhole; the wet pavement reflects the lights. Excited, cold, crowded. Faces small and anonymous.
> *[Style]*

**Mask pass:** fill the line of people, as one shape.

### 14. `ch09_blindfold_lab.png` (fallback, only if you don't shoot your own blindfold footage)
> A plain university psychology lab around 2012: white walls, a simple table under soft overhead light. A young adult, seen from behind and the side, sits blindfolded with a black sleep mask, fingertips resting on a planchette on a talking board. Across the table, a second person, seen from behind, lifts both hands away from the planchette. A laptop and a clipboard at the edge of the table, screens blank. Calm, clinical, curious.
> *[Style]*

**Mask pass:** fill the blindfolded person's hands and the planchette, as one shape.

### 16. `board_flat.png` (texture for the 3D board)
> A talking board photographed straight on from directly above, filling the entire frame edge to edge with no background showing: the same design as the attached `hands_00_board` image (sun at top left, moon at top right, YES and NO, two arcs of letters, a row of digits, GOOD BYE, ornamental corners), but with **no planchette and nothing on it**. Even, soft, shadowless light. Flat and square, no perspective.
> *[Style]*

*(Attach `hands_00_board`.)*

### 15. `thumb_split.png` (thumbnail background)
> A talking board seen from directly above, split diagonally from top left to bottom right. The upper-left half is a warm, cozy 1920 parlor: amber lamplight, lace, a rose. The lower-right half is a cold dark 1970s basement: concrete, blue shadow, a bare bulb's harsh light. The planchette sits exactly on the dividing line. No hands. Strong contrast, simple and bold, readable at a small size.
> *[Style]*
> *(Attach `board_tex.png`. I'll add the title text myself.)*

---

# Part 2: Suno music

> **Not needed for this video:** we're out of Suno downloads, so every cue is reused from the other videos. See `MUSIC.md`. These prompts stay here for later.

## How to run them

- **Mode:** Custom, **Instrumental ON**. Paste the **Styles** text as written, and the **Exclude** text into Exclude Styles.
- **The trick for this video: one melody, six arrangements.** Make the **theme** first. Pick the take with the simplest, clearest tune in the first 20 seconds. Then make every other cue as a **Cover** of that take (open the song → Remix/Edit → **Cover**), pasting the new Styles text. Cover keeps the melody and changes the arrangement, so the same tune comes back as a love song, a lament, a toy jingle and a horror drone: the board never changed, only the story around it.
- **Length:** anything 1:30 or longer is fine. I cut, trim and fade to the narration.
- **Pick** the take where the first 30 seconds already sound like the cue.
- **Sending them back:** MP3 (WAV if your plan has it), named as shown. Drag them into this chat, or add them to `video/public/music/`.

**Exclude** (the same for every cue):
> vocals, choir, lyrics, drum kit, EDM, trap, pop, rock, synth lead, dubstep, rap

**Lyrics box** (the same for every cue; with Instrumental on, these only guide the structure):
> [Intro] [Main Theme] [Variation] [Break] [Main Theme] [Outro] [End]

---

### 1. `theme_parlor.mp3` · ch01 (the Rockwell half), ch04 · about 70 s used · **make this first**
**Styles:**
> gentle 1910s parlor waltz in 3/4, slow and tender, a simple memorable six-note melody played first alone on a music box, then by an upright parlor piano, soft pizzicato upright bass, light brushed hand percussion, sweet and a little flirtatious with a hint of mystery, courting couple by lamplight, warm vintage room sound, faint record crackle, sparse, space for narrator, documentary underscore, instrumental

### 2. `theme_consort.mp3` · ch05 Patience Worth · about 45 s used · **Cover of #1**
**Styles:**
> the same melody as a 17th-century English chamber piece, viola da gamba, baroque recorder, harpsichord, slow and candlelit, wondering and slightly uncanny, a soft high string harmonic shimmer, intimate and sparse, early music, space for narrator, instrumental

### 3. `theme_grief.mp3` · ch06 Empty Chairs · about 60 s used · **Cover of #1**
**Styles:**
> the same melody very slow and bare, solo cello over soft felt piano, long pauses, quiet grief for families who lost sons to war and pandemic, restrained and humane, no swelling orchestra, no percussion, ends on a single held cello note, cinematic documentary, instrumental

### 4. `theme_toy.mp3` · ch07 Next to Monopoly; returns under the Hasbro twist in ch08 · about 45 s used · **Cover of #1**
**Styles:**
> the same melody as a 1960s children's television and toy commercial tune, celesta, glockenspiel, plucked upright bass, soft brushed snare, bouncy and bright, a playful Halloween-fun spookiness with a combo organ and a slide whistle, cartoonish, not scary, vintage 1960s mix, instrumental

### 5. `theme_horror.mp3` · ch01 (the 1973 half), ch08 Captain Howdy · about 75 s used · **Cover of #1**
**Styles:**
> the same melody slowed and detuned into 1970s horror film underscore, low sustained string drone, prepared piano, reversed piano notes, sparse glassy bell tones, tense silences between phrases, slow-building dread, one deep low hit near the end, analog and restrained, no jump-scare stingers, dark cinematic, instrumental

### 6. `theme_ending.mp3` · ch09 the ending, plus the 15-second end screen · about 75 s used · **Cover of #1**
**Styles:**
> the same melody on solo upright piano, slow, warm and reflective, close-miked with soft pedal and key noise, quiet room ambience, the last phrase left hanging, then resolving gently on a soft final chord, no other instruments, intimate, instrumental

**How they're used:** ch01 starts on `theme_parlor` over the Rockwell cover and cuts **on the same beat** into `theme_horror` for the basement. ch09 brings back four short phrases in order (parlor → grief → toy → horror) over the hand montage, then lands on `theme_ending`.

---

# Part 3: Archival images (I'll pull these)

All public domain (published in the U.S. before 1931, or a U.S. government work) unless noted.

| Image | Source | Chapter |
|---|---|---|
| Norman Rockwell, "The Ouija Board," *Saturday Evening Post* cover, May 1, 1920 | magazine scan (public domain) | ch01, ch04, ch09 |
| 1886 *New York Tribune* talking-board story and drawing | Library of Congress, Chronicling America | ch02 |
| Elijah Bond's patent drawing, US 446,054, "Toy or Game," 1891 | USPTO / Google Patents | ch03 |
| Feb. 1891 Pittsburgh newspaper Ouija ad ("marvelous accuracy," $1.50) | Chronicling America (Pittsburgh papers) | ch03 (replaces the reconstruction in the test) |
| Early Kennard and Fuld boards, 1890s–1920s | museum/collector photos (check each license; Commons where possible) | ch03, ch09 |
| William Fuld portrait, 1910s–20s | newspaper photo, pre-1931 | ch03 |
| Pearl Curran photo; *Patience Worth: A Psychic Mystery* (Casper Yost, 1916) title page | Internet Archive | ch05 |
| WWI U.S. soldiers; 1918 flu wards and masks | Library of Congress, National Archives, Naval History and Heritage Command (U.S. government) | ch06 |
| Arthur Conan Doyle portrait, c. 1920 | Commons (public domain) | ch06 |
| Salem witch-trial lithograph ("The Witch No. 1," 1892) | Library of Congress | ch07 (the "yes, that Salem" gag) |
| Michael Faraday portrait; his 1853 table-turning test (period engraving, or I redraw the apparatus as a teal diagram) | Commons / *Illustrated London News* | ch09 |

**Not public domain, used small and briefly with commentary (fair use):** the 1949 *Washington Post* headline (or I reconstruct it as a typed card), *The Exorcist* (1973) poster, the *Ouija* (2014) poster, and a 1960s Parker Brothers box, which is best photographed from your own copy if you have one. None of these should be shown full-frame.

---

# Part 4: Sound effects (ElevenLabs, `tools/sfx_eleven.py`)

New ones only; everything else is reused (Part 0).

| File | Prompt |
|---|---|
| `scrape_long.wav` | a wooden planchette with felt feet sliding slowly across a varnished wooden board, close-up, quiet room |
| `scrape_quick.wav` | a quick short slide of a small wooden pointer on a wooden board, then a soft stop |
| `candle.wav` | a candle flame flickering and guttering in a still room, very close, soft crackle |
| `bulb_hum.wav` | the low electrical hum of a bare light bulb in a quiet basement, a distant furnace ticking |
| `typewriter.wav` | an early-1900s manual typewriter typing a slow sentence, then the carriage bell (for Patience Worth's pages) |
| `telegram.wav` | a paper envelope being torn open slowly in a quiet room |
| `flashlight.wav` | a 1960s metal flashlight clicking on, then children's sleeping bags rustling (no voices) |
| `projector.wav` | a 1970s film projector starting up and running, steady clatter |
| `crowd_street.wav` | a crowd murmuring on a cold city street at night, distant traffic, no clear words |
| `room_tone.wav` | quiet empty old house room tone, faint air, 60 seconds, for under everything |
