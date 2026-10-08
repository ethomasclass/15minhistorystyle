# Production plan: Ouija

Prompts for every image, music cue and sound effect we need to make are in `PROMPTS.md`.

Builds on the house look in Reform Era's `review/DESIGN_STYLE_GUIDE.md` and the kit in `Slaveryvideo/video/src/kit/` (Highlight, Traced, Loop, Tint, ColourReveal, Stamp, Note, Doc, Quote, MapView, Bars, CountUp, Definition, Finish). Everything below either reuses a kit piece or names the one new piece it needs. The ideas are ranked by how much each lifts the video for the work it takes.

---

## 1. The big three

### A. The planchette is the video's cursor (new component: `Planchette`)
A top-down planchette that glides over the board and stops on letters. One asset with a lot of jobs:
- **Chapter titles get spelled out on the board.** K-N-O-C-K, then G-O-O-D L-U-C-K, and so on. This replaces the usual title card. Each letter lights up teal under the window, and the full word then stamps on as a Highlight box.
- **Motion rule:** the camera moves smoothly, the planchette moves on the 12 fps step, with a slight ±2px drift between stops. That drift is the ideomotor effect, planted from the first minute and paid off in ch09.
- **In ch09** it's the punchline: replay the same glide with a faint teal *hand* ghosted in underneath, pushing it.
- **Sound:** a real felt-on-wood scrape and a soft click at each stop. Record it on a $15 board (see 2B).

### B. "Same board, different hands": a locked-off overhead series (Gemini)
One fixed overhead composition, with the same board and camera angle in every frame. Only the hands, sleeves, light and props change. Cutting between them is a pure match cut, which **shows** the thesis instead of saying it.

| File | Chapter | Hands and light |
|---|---|---|
| `hands_1920_couple.png` | ch04 | Two pairs of hands, a 1920 lace cuff and a wool suit cuff, fingertips almost touching; warm lamp; a dance card on the table |
| `hands_1913_pearl.png` | ch05 | One woman's hands; a second person's pencil and notebook at the frame edge; gaslight |
| `hands_1918_mother.png` | ch06 | One older woman's hands alone; a folded telegram and a soldier's photo card at the edge; grey window light. Heavy mode: teal only |
| `hands_1967_kids.png` | ch07 | Three kids' hands, a flashlight beam, a sleeping-bag edge, a Parker Brothers–style box lid (no logo text) |
| `hands_1973_alone.png` | ch08 | One child's hand alone; basement bare bulb; cold blue |
| `hands_today_blank.png` | ch09 | No hands. Board and planchette only. Then rebuild all five as a quick montage, ending on the empty board |

Prompt rule: append "identical overhead composition, board centered and filling 70% of the frame, camera directly above" plus the style paragraph, and send the first image back as a reference for each later one. Hands only, no faces, so none of these can be mistaken for real people.

The Tint rule here: the **planchette** is the one coral subject in every frame, and it's traced in teal.

### C. Shoot 3 minutes of real footage
Nothing else lifts the quality as much as real footage does. One afternoon, a cheap board, a phone on a tripod overhead:
- Macro slides across the letters, raking light, with candle and lamp versions.
- Your own hands on the planchette, blindfolded (ch09, the UBC study). Real hands make the science feel like an experiment, not a lecture.
- Clean audio of the scrape, a knock on wood, and a box lid opening.
Grade it to the house B&W (`grayscale(1) contrast(1.25)`) so it sits with the archival images.

---

## 2. Chapter by chapter

| Ch | Visual beats |
|---|---|
| **01 Two Pictures** | Split screen: the Rockwell cover (public domain, 1920) on the left, the basement (`hands_1973_alone`) on the right. Teal loops on both boards, then the frames slide together until the two boards overlap exactly ("Same board"). Highlight: **TOY OR SPIRIT?** is held back for ch03. The question goes on screen as a Quote. "Not a light switch" gets a quick teal note: *love · fun · grief · fear, all at once*. |
| **02 Knock Once** | Reuse Reform Era's KNOCK onomatopoeia and the Fox sisters image (a series callback, with a corner tag *see: Fix Everything*). "Scroll through the alphabet": a fast A→Z ticker under a blinking cursor, then the 1886 Tribune woodcut drops in as a Doc card, and the ticker snaps onto the board's letters. |
| **03 Good Luck** | Map pin: Baltimore. The patent drawing (US 446,054) is drawn on in teal, line by line, and **TOY OR GAME** stamps on. The locket: an AI close-up of an oval Victorian locket, with a Loop around the name and the note *(she was wearing it)*. 1891 ad as a Doc, with *"marvelous accuracy"* underlined coral and *"amusement"* underlined teal, and a **TOY / SPIRIT** two-column tag that comes back in ch09. The Fuld quote as a Quote card over his photo. **Subscribe plug:** the planchette glides S-U-B-S-C-R-I-B-E (a quick 12 fps hop per letter, scrape SFX on each), lands on YES, and a subscribe button stamps on in the orange-box style. On "that's my hand," a teal hand outline is ghosted under the pointer for a beat, with the note *(ok, that was me)*. About 8 seconds. |
| **04 Knees Touching** | The Rockwell cover again, with ColourReveal creeping in from the right on "it's a date." Then `hands_1920_couple`. The questions appear as handwritten Notes: *does he like me? / will we marry?* A Definition bar for **parlor game**. |
| **05 Patience Worth** | Map pin: St. Louis. `hands_1913_pearl`, then the planchette spells M-A-N-Y M-O-O-N-S with each letter landing as a typewriter character on a growing page. A CountUp to **4,000,000 words** as pages stack up. Book covers (public domain, 1915–1920s) land as PhotoCards. |
| **06 Empty Chairs** | Heavy mode. Bars: 116,000 (war) next to 675,000 (flu), drawn slowly with no orange. A Conan Doyle photo card. Then the "one house" image: a split cross-section of a house, parlor `hands_1920_couple` downstairs and `hands_1918_mother` upstairs, both pointers moving in sync. The strongest single image of the "not a light switch" idea. |
| **07 Next to Monopoly** | Map pin: Salem, and a teal note *(yes, that Salem)* with a tiny 1692 tag. A Bars race: Ouija vs. Monopoly, 1967. `hands_1967_kids` under a flashlight that sweeps the frame. |
| **08 Captain Howdy** | The 1949 *Washington Post* headline as a Doc (check licensing or use a reconstruction). For the film, use the poster as a small PhotoCard (fair use, brief) plus `hands_1973_alone`, never stills of the actors. The Murch quote over a Psycho-style shower-curtain silhouette, drawn in teal. Then the twist: the 2014 *Ouija* poster thumbnail, with a Loop around the studio credit and the note *(the toy company)*, and a CountUp to **$100M+**. |
| **09 Who Moves It?** | 1891 board and modern board overlaid with a wipe; letters line up exactly. Faraday's table indicator, redrawn as a teal diagram. The UBC result as a SplitBar, **50% said aloud vs. 65% through the board**. Your blindfold footage. The hand montage (all five) collapses into the empty board, and the planchette drifts to **GOOD BYE**. Last line on black. |

---

## 3. The "not a light switch" timeline (new component, small)
A horizontal timeline from 1890 to 2014 with four **overlapping** translucent bands: LOVE, GRIEF, FUN, FEAR. It's qualitative, with no y-axis and no numbers, labelled *rough eras, they overlap*. Show it three times: ch01 (empty), ch06 (love and grief filled in), ch09 (all four). It answers your caution visually, so the narration doesn't need to keep repeating it.

## 4. Sound and music: one motif, four arrangements
Ask Lyria for **the same simple six-note melody** in four arrangements:
1. 1890s–1920s parlor: upright piano or music box, light.
2. 1918 grief: solo cello, slow.
3. 1960s toy: celesta and plucked bass, playful.
4. 1973 onward: the same notes as a low, detuned drone.
The music proves the thesis on its own: same tune, different story. In ch09, bring the four back in order, then end on the bare piano version.
SFX: the planchette scrape (recorded), knocks (callback), a typewriter for Patience, wind and a hum for the basement, and a film-projector clatter under the 1973 cut.

## 5. Era textures (on the board shots only)
Keep the house B&W look everywhere, but give the board shots a light per-era texture: 1920 magazine halftone dots, 1960s offset-print misregistration (a 2px teal/orange split), 1973 film grain and slight gate weave. It's subtle, one layer over `Finish`, and it reinforces "the board stayed the same, the frame around it changed."

## 6. Packaging
- **End screen:** hold the final empty board for 15 seconds with the piano motif, no narration. Leave space on the right for YouTube's subscribe and next-video elements.
- **Thumbnail:** one board split diagonally, the warm Rockwell side against a dark basement side, with the planchette exactly on the seam. Text: **WHO MADE IT SCARY?** (Abril, orange box). No movie stills.
- **Shorts from the cut material:** Fuld's fall from the factory roof; the pink Ouija (2008); "the spirits read her necklace"; the UBC blindfold study.
- **AI disclosure:** answer Yes. The hands series and the locket are AI-illustrated.
