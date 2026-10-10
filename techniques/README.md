# Techniques

The channel's moves, grouped by what they do on screen. For each one: what it is, when to use it, which video
introduced it, and where the code is.

**Where the code lives**
- **Template kit**: in every new project made from the skill (`.claude/skills/15-minute-history/assets/template/src/kit/`).
- **Library**: in this folder, [`components/`](components/), copied from the video that made it. It isn't wired
  into the template yet. Copy the file into a project's `src/kit/` and fix its imports (notes below).

The exact numbers (sizes, colours, frame counts) are in the style guide,
[`visual-style.md`](../.claude/skills/15-minute-history/references/visual-style.md). The scene recipes and the
component cheat sheet are in [`building-scenes.md`](../.claude/skills/15-minute-history/references/building-scenes.md).

**Look books.** [`lookbook/`](lookbook/) has 20 evenly spaced frames from each finished video, which is the quickest way
to see how the style has developed:
[Fix Everything](lookbook/01_Fix_Everything.jpg) ·
[The War Nobody Won](lookbook/02_War_Nobody_Won.jpg) (the toy-theater look, before the channel look) ·
[Bierce](lookbook/03_Bierce.jpg) · [King Andrew](lookbook/04_King_Andrew.jpg) ·
[Grip Tighter](lookbook/05_Grip_Tighter.jpg) · [Good Luck (Ouija)](lookbook/06_Good_Luck_Ouija.jpg) ·
[Say It Ain't So (Black Sox)](lookbook/07_Say_It_Aint_So.jpg)

---

## The five rules every scene follows

1. **One subject in colour.** The picture is black and white. One figure gets the coral tint and a teal trace. In heavy chapters (`quiet`) there's no coral at all.
2. **One job per colour.** Teal draws and explains. Orange is for titles. Coral is the subject.
3. **Marks step, cameras glide.** Drawn marks animate at 12 drawings a second. Camera moves are smooth.
4. **Cut hard, on the word.** Scenes cut 1–2 frames before the word they belong to, with a whoosh. No dissolves. Every mark is keyed to a spoken word (`t.at('phrase')`), never to a number of seconds.
5. **Credit every picture, keep every word on screen.** Every image gets a mono source tag, and no text runs off the frame (run `tools/probe_text.mjs` before every render).

---

## Titles and words

| Technique | What it does | Use it for | From | Code |
|---|---|---|---|---|
| **Highlight** | Abril caps on a torn orange strip that wipes on from the left in 8 frames, tilted −2°. Optional `after` words in orange outside the strip. | Every title; vocab terms; a place name by its pin | Fix Everything | template `Kit.tsx` |
| **Note** | Lowercase Nanum Pen handwriting (×1.55) with a hard ink outline, written on left to right. Teal by default, white for neutral asides, orange for disputed claims, coral for a punchline. | Asides, labels, the wry line | Fix Everything | template `Kit.tsx` |
| **Definition** | Dark bar under a title: the term in teal with syllable dots, then a plain definition in Inter. | Every vocab word (10–20 a video) | Fix Everything → King Andrew | template `shell.tsx` |
| **Stamp** | A big Abril word or number that slams in (1.35 → 0.95 → 1). | Onomatopoeia (KNOCK), big numbers, the climax word | Fix Everything | template `shell.tsx`; louder variant in `components/ambrose/bits.tsx` |
| **Quote** | Playfair 900 primary-source quote, cream, with a mono attribution. | Short quotes shown whole | Fix Everything | template `shell.tsx` |
| **SyncQuote** | The quote appears word by word as the narrator reads it. Each word rises 12 px. Chosen words get a coloured underline. | Any quote the narrator reads aloud. It's the strongest quote treatment so far. | Bierce (`Quote`) → Ouija → Black Sox | `components/ouija/oj.tsx`, `components/ambrose/bits.tsx`, `components/black_sox/bs.tsx` (keeps commas) |
| **Plain / Line** | A bone Playfair statement that just fades in, with no colour and no marks. | Facts in heavy chapters that should get no decoration | Grip Tighter | inline in Grip Tighter Ch06–Ch10 (copy from there) |
| **Strike-through** | An orange 8 px stroke drawn across a note in 5 frames. | Rejected ideas ("guns?", "pray harder?") | Fix Everything | `components/ambrose/bits.tsx` `StrikeLine` |
| **Big statement** | Stacked 96 px lines alternating orange-box and plain teal type on a dimmed map. | The driving question, the thesis | Fix Everything | compose from Highlight |
| **Scene counter** | "1/7" or "LIFE 3/7" in mono at top right. | Montages and episodic structures | Fix Everything, Bierce | `components/ambrose/bits.tsx` `Lives` |

## Marking up a picture

| Technique | What it does | Use it for | From | Code |
|---|---|---|---|---|
| **Tint + Traced** | The subject (from a mask) tinted coral with three blend layers, which keeps the engraving's line shading, and circled by a loose teal outline that draws on and stays a little open. | The one subject of every image | Fix Everything | template `Kit.tsx`; masks from `tools/mask.py` (rembg) or a Gemini magenta pass + `tools/trace.py` |
| **Loop** | A hand-drawn ellipse that overshoots its start. | "Look here": a name, a date, a face in a crowd | Fix Everything | template `Kit.tsx` |
| **Arrow** | A bowed teal stroke, with an open chevron once the stroke completes. | Linking a note to its subject | Fix Everything | template `Kit.tsx` |
| **ColourReveal** | The original colour image creeps in from the right edge. | "Colour coming into it": the one exception to B&W | Fix Everything | template `Kit.tsx`; animated version as `Layered reveal` in `oj.tsx` |
| **Punch-in** | A hard cut to a 1.65–2.3× crop of a detail, still creeping in. A hard ×1.14 punch lands on the climax word. | Energy in light chapters | Fix Everything | Fix Everything `Ch02.tsx` `PunchIns` |
| **Doc + DocMark** | A scanned document on a cream card. Boxes, loops, underlines and a coral wash are drawn **in the scan's own pixels**, so they move with the paper as the camera pushes in. | Primary sources: notices, laws, articles, census pages | Grip Tighter (used 24×) | `components/grip_tighter/gt.tsx` (needs `src/imgs.ts` from `img_sizes.py`) |
| **SrcView** | A camera that travels over a large document or picture along keyframes, with marks in source pixels. | Reading across a magazine cover, ad or article | Ouija | `components/ouija/oj.tsx` |
| **Engraving detail as a stand-in** | rembg (`isnet-general-use`) on a tight crop of one small figure in a big period print, then a `CropCard` or vertical `Parallax` on that detail with the coral tint. | A person with no surviving photo (Black Sox: the 1865 catcher, cut out of the 1866 Currier & Ives Hoboken print). | Black Sox | `tools/mask.py` job with a crop box; `LAYERS_MAX=4000 tools/layers.py` |

## Pictures on the desk

| Technique | What it does | Use it for | From | Code |
|---|---|---|---|---|
| **DarkPaper** | The desk: a warm near-black gradient with faint 64 px ruling. | Behind cards, diagrams, quotes | Fix Everything | template `common.tsx` |
| **Card / PhotoCard** | A cream-bordered print that pops on (0.6 → 1 in 5 frames) at ±4°. | Portraits, documents, groups of 2–3 | Fix Everything / King Andrew | template `common.tsx`, `shell.tsx` |
| **CropCard** | An image cropped into a window on a card, with mask and trace support. | "Subject left, notes right" | King Andrew | template `shell.tsx` |
| **TabCard / Wall** | Cards with an orange Abril label tab hanging off the bottom, popping in 3 frames apart. | A "wall of causes", lists of people | Fix Everything | `components/ambrose/bits.tsx` `TabCard` |
| **Desk** | DarkPaper with a slow push and a tiny handheld drift; everything on it rides along. | Any desk scene. It makes the desk feel filmed rather than flat. | Ouija | `components/ouija/oj.tsx` |
| **DropCard** | A card falls onto the desk with a spring, a little air rotation, motion blur and a contact shadow that tightens. | Instead of the pop, when a card should feel like it has weight | Ouija | `components/ouija/oj.tsx` (needs `@remotion/motion-blur`) |
| **Photo** | A full-bleed B&W image with a slow push (1.02 → 1.10), optional tint and trace. | Most archival beats | King Andrew | template `shell.tsx` |
| **Parallax (archival 2.5D)** | Any masked photo split into subject and background layers (`tools/layers.py`, from the rembg mask, no Gemini pass), with parallax, contact shadow, drift, optional living detail. `crop` keeps the camera inside a glass negative's black border; `frame` makes it work in 9:16. | Every Bain portrait in Black Sox, and the vertical Shorts. | Black Sox | `components/black_sox/parallax.tsx`, `tools/layers.py`, `tools/mask_preview.py` |
| **Blurred fill** | A portrait fitted `contain` over a blurred, darkened copy of itself. | Tall images in a 16:9 frame | Fix Everything / Bierce | `components/ambrose/bits.tsx` `Full` |

## Paintings (AI illustrations for gaps)

| Technique | What it does | Use it for | From | Code |
|---|---|---|---|---|
| **Gen** | A Gemini painting full-bleed with a push. Until the file exists it shows a dashed "painting to come" stand-in. With a mask, the magenta subject gets the tint and trace. | Any scene with no surviving image | Bierce / Grip Tighter | `components/ambrose/bits.tsx` (with masks), `components/grip_tighter/gt.tsx` |
| **Layered (2.5D)** | The painting split into background and subject layers (`tools/gen_layers.py`), with parallax, a contact shadow and handheld drift, plus **one living detail**: lamp flicker, dust, snow, steam, a flashlight beam, halftone dots or film weave. | Every painting in Ouija. It's the biggest quality jump since the template. | Ouija (21×) | `components/ouija/oj.tsx`, `components/ouija/tools/gen_layers.py` |
| **Same frame, different hands** | One locked-off composition repeated across eras (same board and camera; only hands, light and props change), so cuts become match cuts. | Showing "the object stayed the same, the people changed" | Ouija | Prompt pattern in `examples/06_Good_Luck_Ouija/PROMPTS.md` |
| **PlateScene** | A period engraving cut into 7 parallax layers, with one camera path and a whip-out. | Bringing a single famous engraving to life | Ouija (the Fox sisters plate) | `components/ouija/plate.tsx`, `tools/plate_layers.py` (written for one plate; generalise before reuse) |

Every painting prompt ends with the shared **style paragraph**, which is in
[`images-and-masks.md`](../.claude/skills/15-minute-history/references/images-and-masks.md). There are era versions for the
1820s–50s (Bingham/Mount), the late 1800s (Homer/Remington) and the early 1900s (magazine illustration); see each video's prompts in
[`examples/`](../examples/). Never show a recognizable real person. Paintings are tagged `Illustration · …` on screen.

## Maps

| Technique | What it does | Use it for | From | Code |
|---|---|---|---|---|
| **MapScene + Pin / Route / Region** | The 1836 Mitchell map, dimmed, with a camera that zooms in log space. Teal pins pop on, routes draw on with a riding dot, regions get a translucent fill. `PLACES` has 38 fitted locations. | Where things happened; spread; journeys | Fix Everything → King Andrew → Grip Tighter | template `map.tsx` |
| **Letters route** | An orange dashed arc with a small envelope riding it. | Mail, news, pamphlets travelling | Fix Everything | Fix Everything `Ch01.tsx` |
| **Ripple / fever glow** | Teal rings expanding from a point; a coral-to-orange glow that blooms and pulses. | News spreading; a "fever" of activity | Fix Everything | Fix Everything `Ch01.tsx`, `Ch02.tsx` |
| **RouteMap** | A second base map (USGS 1880). Legs are drawn per spoken place, older legs fade, the last leg is dashed ("off the map"), and ✕ markers mark deaths. The camera is clamped so it never shows past the map's edge. | One person's journey across the country | Bierce | `components/ambrose/map.tsx` |
| **Tiles** | A state tile grid: fill, label, ring or dim per state. | Elections, suffrage, which states did what | King Andrew | template `tiles.tsx` |

## Numbers and diagrams

| Technique | What it does | Use it for | From | Code |
|---|---|---|---|---|
| **Pie / Bars / SplitBar / HBars / CountUp** | Charts in the house look: a hand-jittered teal rim or baseline, **one coral subject** and bone greys for everything else, labels on the marks (no legends), numbers in Abril. | Census numbers, part-to-whole, comparisons | Grip Tighter | template `charts.tsx`; stills in the Grip Tighter look book |
| **Data file with sources** | Every on-screen number lives in one `data/charts.ts` with its source in a comment. | Any video with numbers. Do this every time. | Grip Tighter | `components/grip_tighter/charts.ts` |
| **Bands** | Overlapping translucent eras on a year axis, with no y-axis (LOVE / FUN / GRIEF / FEAR). | Qualitative "it wasn't a light switch" timelines | Ouija | `components/ouija/oj.tsx` |
| **Timeline** | A teal line with dots, the start in teal and the end in coral. | Dates in order | Fix Everything | Fix Everything `Ch08.tsx` `Years` |
| **Diagram boxes** | Hand-jittered teal boxes, locks and arrows, with coral for the "after" state. | Explaining a system (predestination flipped, the American System) | Fix Everything, King Andrew | Fix Everything `Ch02.tsx`; `components/king_andrew/figures.tsx` `SystemCards` |
| **Person** | A drawn voter or crowd figure; dashed for the people left out. | Who could vote; who counted as "the people" | King Andrew | template `figures.tsx` |
| **Pyramid** | A social-pyramid diagram with one level lit. | Class structure | Grip Tighter | Grip Tighter `Ch05.tsx` |
| **Ember** | A coral ember with rising sparks that flares on cue. | A recurring motif ("the spark") | Fix Everything | template `common.tsx` |
| **Ledger** | A cream ruled ledger card titled BANNED that fills in across chapters, one handwritten row per scandal, each with a fate (coral FOR LIFE, teal "back by 1870", a strike-through for the ones that didn't stick); stamped in the finale. | A recurring tally that carries the argument from chapter to chapter. | Black Sox | `components/black_sox/bs.tsx` `Ledger`, `ROWS` |
| **Wall** | Teal hand-drawn bricks built row by row at 12 fps; `knock` makes them fall; `line` redraws it as one dashed line. | A rule going up, coming down, and the line that's left. | Black Sox | `components/black_sox/bs.tsx` `Wall` |
| **Phone sketch** | A teal hand-drawn phone with a slight line boil, drawn on in 12 frames; a company's logo on a coral screen, optional YES/NO buttons. | A modern company or app, drawn in the channel's own style instead of a screenshot. | Black Sox (Polymarket) | `components/black_sox/bs.tsx` `PhoneSketch` |

## Structure and transitions

| Technique | What it does | From | Code |
|---|---|---|---|
| **Cold open → channel intro → title card** | The cold open asks the question, then the 4.4 s wordmark intro (cards flip, the clock fills a quarter hour, the title sting) and a 5 s title card (orange TITLE, teal subtitle, handwritten dates). Never narrated. | Fix Everything | template `Intro.tsx`, `Ch01.tsx`; [`brand/logo/channel_intro.mp4`](../brand/logo/channel_intro.mp4) |
| **Logo break** | Chapters 2+ open on a quiet 44-frame break: fade to black, the wordmark at 62%, three soft clock ticks, fade up. No chapter title cards. | King Andrew (the standard since) | template `LogoBreak.tsx`, `shell.tsx`; [`brand/logo/chapter_logo_break.mp4`](../brand/logo/chapter_logo_break.mp4) |
| **ChapterShell + `quiet`** | Wraps a chapter: logo break, narration, music cues with fades, palette, step, finish. `quiet` switches to teal-only with bone titles for heavy chapters. | King Andrew | template `shell.tsx` (Ouija's version adds per-cue `to`, `fadeIn` and `fadeOut`, and an `extra` tail for an end screen) |
| **Spelled chapter titles** | A topic-specific opener: the 3D planchette spells a word, then the chapter title stamps on. One per chapter, replacing the logo break. | Ouija | `components/ouija/title.tsx`, `board3d.tsx` |
| **3D object** | A real 3D prop (`@remotion/three`) lit by candle, lamp or bulb, with cameras that dolly, push or whip. Render with `--gl=angle`. | Ouija (the talking board) | `components/ouija/board3d.tsx`; needs `three`, `@react-three/fiber`, `@remotion/three` (see `components/ouija/package.json`) |
| **Chapter wrapper with sound lists** | Adds a whoosh per cut and stamp, write, tick and boom sounds from lists of cue words, so sound doesn't have to be placed by hand. | Bierce | `components/ambrose/bits.tsx` `Chapter` |
| **End screen** | Hold the last image about 15 s with music only, leaving room for YouTube's end-screen elements. | Ouija | `ChapterShell extra` in Ouija's `shell.tsx` |
| **Two subscribe reminders** | A wry, topic-tied plug a third of the way in (on screen: a SUBSCRIBE title and a small "subscribe ↓" note), and a one-line thank-you plus subscribe after the closing line, over the end screen. | Every video (standing rule) | Ouija → Black Sox | narration; `Ch03` and `Ch08` in `projects/Black_Sox/src/ch/` |
| **Native vertical Shorts** | 1080×1920 compositions that splice hook-first lines out of the chapter WAVs (`build()`), relay the scenes for 9:16 with the same assets, add 3-word captions that never cross a sentence end, a small wordmark top-left and a 3 s end card pointing to the full video. Text stays out of YouTube's UI zones. | 3–4 Shorts per video, 30–45 s each | Black Sox | `components/black_sox/vshorts.tsx` |
| **Montage** | Seven hard cuts on the beat, with a counter and a tick on each. | Fix Everything | Fix Everything `Ch01.tsx` |

## Checks (run them, every time)

| Tool | What it catches | Where |
|---|---|---|
| `tools/probe_text.mjs` | Text crossing the frame edge. You've flagged this in four videos. | template |
| `tools/anchors.py` | Cue phrases that no longer exist after a re-voice | template |
| `tools/stills.mjs` + `tools/sheet.py` | Contact sheets to look at before you do | template |
| `audit_text.py` | Titles on screen for under 2 s (your rule) | `components/ambrose/tools/` (hard-codes 30 fps) |
| `trace.py fromfile` alignment check | A Gemini mask pass that was redrawn or shifted instead of pixel-aligned | `components/ambrose/tools/trace.py` (the template's copy lacks the check and the `matte` mode) |
| `tools/youtube_check.py` | Title, description, tag and chapter limits | template |
| `tools/mask_preview.py` | Masks that miss a light uniform or cut a limb, before any scene uses them (coral fill + teal outline contact sheet) | `components/black_sox/tools/` |
| `tools/script_pdf.py` | A readable script PDF for the user's review (timestamps, vocab underlined, subscribe lines boxed), via headless Chromium | `components/black_sox/tools/` |

---

## Things tried and set aside

- **Rejected looks (Fix Everything style test):** yellow highlighter outlines (`harris` palette), the Anton collage, the Fraunces cinematic look. The palette sheets are in `Reform-Era/review/palettes/`, and `TCO_*.jpg` panel A is the one you chose.
- **Toy theater** (*The War Nobody Won*) and **broadside** (*Age of Jackson Part One*) came before the channel look. They're not part of it, but the toy theater is a complete style if a one-off ever wants it (see its look book and HANDOFF).
- **Props you rejected:** fussy illustrated props like King Andrew's stool. Drawn diagrams and cards read better.
- **24 fps (Ouija).** Ouija ran at 24 fps so marks step evenly every 2 frames. Every other video is 30 fps with marks on a 2.5-frame step. Frame-count durations weren't rescaled, so Ouija's animations run about 25% slower. The template stays at 30 fps. If you switch, change `FPS` in `lib/theme.ts`, set both `StepCtx` values to 2, and scale the frame counts.
- **Colour grades (Ouija).** Ouija used warm and full-colour grades on its paintings and a full-colour thumbnail. That's a departure from "B&W plus one coral subject"; decide per video whether a subject earns it.
- **Letterboxed Shorts (Black Sox).** The first Shorts pass put the 16:9 scene in a band across the middle of a 9:16 frame. It wasted two-thirds of the screen and shrank every note; you asked for native vertical instead. Kept as `projects/Black_Sox/src/shorts.tsx`.
- **Flow "tobacco card" prints (Black Sox).** A flat five-ink baseball-card illustration style in channel colours was written up as an alternative to painterly AI images, then not used (no AI images this video). Prompts and the style paragraph are in `examples/07_Say_It_Aint_So/PROMPTS.md`.
