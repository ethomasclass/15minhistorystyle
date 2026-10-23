# Vox-style motion graphics: what the tutorials teach, and what Chunk History should take

October 2026. A follow-up to [`vox_study.md`](vox_study.md), which covered Vox's *writing* and a first pass at visuals
(the highlighter swipe that came out of it is now in the kit). This one is only about **motion graphics**: how the
look is built, frame by frame, according to Vox's own people and the most-watched tutorials that reverse-engineer it.

**Built and tested** (Oct 2026): §3.1–3.6 and §3.9 on Episode 1, chapter 6 of *Reconstruction*, from primary sources —
`projects/Reconstruction/tests/src/tests/voxkit.tsx` (the components) and `Ch06Test.tsx` (the chapter); see that
project's tests README.

**How it was researched.** Captions of 18 YouTube videos were downloaded and read in full (list in §6), plus Vox
staff interviews already cited in the first study. Where a claim comes only from a tutorial maker, it says so: those
are observed recipes, not Vox's documented method.

---

## 1. What Vox's own people say

- **The visuals do the explaining; the script walks you through them.** Joss Fong: the surface ("slick animations,
  nice music") was "liberally replicated across YouTube", but "that's not really our secret sauce. Our secret sauce is
  a way of writing that puts a lot of work into the visuals… we decided early on our animations weren't going to be
  decorative… our visuals need to be doing explanatory work, and then the script is basically walking people through
  those visualizations." (*The Gradient* podcast.)
- **Tactile and analog on purpose.** Fong again: for *Glad You Asked*, the showrunner banned motion graphics so that
  "every visualization was going to be tactile and analog" (physical objects, hands). Vox's art director Joey
  Sendaydiego (Storybench, in the first study): "we don't want it to look perfect."
- **The tools they name** ("How we got to 10 million subs", Vox, 2020): one typeface in every video (Balto); After
  Effects; **GEOlayers** for all their maps; **David Rumsey's map collection** for period maps; Newspapers.com and the
  Internet Archive for documents; the Prelinger Archives for film; the *Motion 2* and *layer random shifter* scripts;
  and a staffer learned the collage look from **Ben Marriott's paper-cutout tutorial**.
- **Fong on AI** (same podcast): "the kind of motion graphics that Vox used to distinguish our visual approach will
  become pretty trivial to make", and for people covering the real world "there is a loss of trust if you rely too
  heavily on generated imagery." Both points match the channel's rules.

## 2. The recipe every tutorial agrees on

Read across the tutorials, the "Vox look" is a short stack. The channel already has most of it.

| Ingredient | How the tutorials build it | Channel status |
|---|---|---|
| **Low frame rate** | `Posterize Time` at 12 fps (some use 8, 15 or 16) on an adjustment layer over everything | **Have**, with a difference: our *marks* step at 12 fps, our *cameras* glide. Vox posterizes the camera too. Keep ours: smooth cameras read as film, stepped marks as hand. |
| **Paper underneath** | Never pure white: a warm off-white, a crumpled-paper scan on *multiply*, a halftone or dirt layer on *overlay*, sometimes a moving paper clip at 50–70% | **Have** (dark desk paper, crease.py, halftone.py) |
| **Rough edges on everything drawn** | `Roughen Edges` / `Turbulent Displace` on strokes, highlighters and boxes; the displacement's random seed re-rolled 4–5×/s so edges "boil" | **Have** (seeded torn edges, the Highlight's jitter); boil only on some marks |
| **Draw-on strokes** | Trim paths on hand-drawn paths (underline, circle, arrow tail then tip) | **Have** (Loop, Arrow, Traced) |
| **Highlighter** | Yellow on *multiply* so the paper grain shows through, sized like a real marker (not over headlines), constant speed so you can read along | **Have** (coral swipe in the kit) |
| **Handheld drift** | `wiggle(1,5)` on a null, or a Transform at 101% with a wiggle | **Have** (Desk drift) |
| **One shared treatment for all archive** | "Footage homogenization": force B&W, grain, soft edges, so pictures from everywhere cut together | **Have** (B&W + crease + grain); edge softness is missing (§3.9) |
| **Vignette** | Curves or Lumetri vignette pulling the eye to the centre | **Have** (`Finish`) |
| **Chromatic aberration, scan lines, CRT** | "Quick Chromatic Aberration" at 0.8–1.5; Venetian blinds as scan lines on screen recordings | **Skip** (rejected in the first study; we never show screens) |

So the look is not the gap. The gap is in **how attention is moved** and **how shots join**, the two things the
better tutorials (Chris Moran's in particular) spend their time on.

## 3. Techniques we don't have yet

Each one: what it is, how it's built in After Effects, how we'd build it in Remotion, and where it would land in
*Reconstruction*.

### 3.1 Focus as a pointer ("focal callout")
**What:** the frame stays blurred except one soft circle of sharpness, and the sharp spot *travels* from place to place
as the narrator moves on. On a map or a crowded page it says "look here, now here" without drawing anything.
**AE recipe (Moran):** a radial gradient on a hidden layer drives `Compound Blur` (invert); keyframe the gradient's
start point with long eases.
**Remotion:** two copies of the image, the top one sharp and masked by a moving `radial-gradient` mask, the bottom one
`blur(6px)`. Cheap, no WebGL.
**Reconstruction:** Ep2 ch02, the five military districts: the focus moves district to district as each is named.
Ep3 ch08, the 1876 map: the three disputed states.

### 3.2 Spotlight cut ("contrast callout")
**What:** a **hard cut** (no fade) to the same picture with the blacks lifted to a pale wash everywhere except one
feathered shape, on a click. It's the inverse of a fill: the thing stays itself, everything else steps back.
**AE recipe:** an adjustment layer with Curves (raise the black point), an inverted feathered mask, cut in hard;
Moran pairs it with a short push-in whose speed peaks exactly on the cut, and a "circuit breaker" click.
**Remotion:** a `Spotlight` wrapper: `filter: contrast(0.55) brightness(1.35)` on a copy, masked with an inverted
feathered path; appears on its word.
**Reconstruction:** crowd pictures: the Union soldier in the line of *The First Vote* (Ep2 ch05); Revels among the
men in the Currier & Ives print (Ep2 ch01); one face in the Freedmen's Bureau engraving.

### 3.3 The page on a tilt, with depth of field
**What:** the document is laid back in 3D; the camera glides along it and only the line being read is in focus,
everything nearer and farther soft. Feels like leaning over a desk.
**AE recipe (Flat Pack FX):** 3D layer rotated back, a 35 mm camera with depth of field on, focus distance keyframed
with the camera move, highlighter running on the in-focus line.
**Remotion:** CSS `perspective` + `rotateX(35–50°)` on the `Doc`, and a fake depth of field: a blurred copy masked by
a horizontal band that follows the line being swiped. No WebGL.
**Reconstruction:** every statute we read aloud: the 13th Amendment's "except" (Ep1 ch06), the Mississippi Black Code
(Ep1 ch06), the 14th's §1 (Ep1 ch08), the Senate testimony transcript (Ep3 ch01).

### 3.4 Word match cut
**What:** a run of different pages flashes past, each lined up so the **same word sits dead centre** every time;
the cuts start at about 8 frames each and speed up, with a tick on each. Everything around the word changes;
the word doesn't. It says "this was everywhere."
**AE/Premiere recipe (Motion Array):** guides at frame centre, every scan positioned so the word's centre lands
there, then the shots get shorter.
**Remotion:** a `WordRun` component: a list of `{src, box}` (the word's box in source pixels), each placed so the box
centre hits 960×540, durations easing from 8 to 2 frames, `tick` per cut; the word gets a coral wash on the last one.
**Reconstruction:** Ep1 ch06: **"vagrant"** across the 1865–66 Black Codes of Mississippi, South Carolina, Alabama,
Louisiana… (the real scans, one state per flash). Ep3 ch09: **"white"** across the post-1890 state constitutions, or
"grandfather".

### 3.5 Motion carried through the cut ("match cut" in the tutorials)
**What:** the outgoing shot is drifting, say, left; the cut lands on the word; the incoming shot starts *already*
drifting left at the same speed, then eases to a stop. The eye reads one continuous move across two pictures. Every
long tutorial (Mapal, TomsProject, Moran) builds it the same way: the camera's speed curve peaks *on* the cut.
**Remotion:** a `carry` option on scene cameras: the last 8 frames of the outgoing camera and the first 12 of the
incoming share one velocity, so it's a setting, not a new component. Fits rule 4 (cut hard, on the word) without a
dissolve.
**Reconstruction:** everywhere; most useful in montage chapters (Ep1 ch07–09, the fight between Johnson and
Congress).

### 3.6 Torn-paper reveal
**What:** the top sheet tears along a ragged line and peels away to show what was underneath. In the AEffecto
*Titanic* build the torn edge even casts a shadow on what it reveals.
**Remotion:** we already make seeded torn edges; animate a clip path that opens along a ragged line, with a cream
fibre edge (from `crease.py`'s fibre band) and a hard shadow.
**Reconstruction:** the 13th Amendment tears to reveal the Black Code underneath ("except as a punishment for crime"
→ "vagrant"), Ep1 ch06. Ep3 ch09: the 15th Amendment tears to reveal Mississippi's 1890 constitution (poll tax, literacy test).

### 3.7 Ink-brush fills on maps
**What:** a region doesn't fade in; it fills with dry-brush strokes sweeping across it, like someone painting it in.
**AE recipe (Vox map tutorial):** stacked ink-stroke textures on *screen* make a luma matte; slide the matte across
the region; roads first, then land, then the green.
**Remotion:** a `BrushFill` mask: 6–10 brush-stroke PNGs (one free texture pack, white on black) as a CSS
`mask-image`, translated across the region over ~1 s, stepped at 12 fps.
**Reconstruction:** Ep3, the "Redemption" map: states fall back to the Democrats one by one, 1869–1877, each painted
in on its year. Ep2 ch02, the five districts painted in.

### 3.8 A moving pool of light
**What:** the board goes dark except a soft pool of lamp- or moonlight that slides across it, as if someone carried a
lamp past. AEffecto animates a feathered shadow mask across the paper over several seconds.
**Remotion:** a full-frame dark layer with a moving radial-gradient hole (multiply), plus a slight warm tint inside it.
**Reconstruction:** the night chapters: the Klan's night rides (Ep3 ch02), Caldwell's death (Ep3 ch07), Colfax
(Ep3 ch04). It makes "grim" a lighting choice, not just a script one.

### 3.9 Focus on arrival, and a soft lens edge
**What (Motion Array, on Johnny Harris):** a photo rises a few pixels into place over ~8 frames while going from
blur 30 to sharp, with an old projector click: "coming up into view through a lens". Separately, every shot gets a
faint blur at its edges (inverted circular mask), which reads as a real lens and makes textures react to it.
**Remotion:** a `focusIn` option on `Photo`/`Card` (8 frames, blur 24 → 0, y +18 → 0); an edge-blur layer in `Finish`
(a blurred copy masked by an inverted radial gradient, 3–4 px).
**Where:** every archival photo, if we like it; it's the cheapest upgrade on this list.

### 3.10 Year roll
**What (TomsProject):** a column of years scrolls past behind a feathered window and settles on one, with a tick.
**Remotion:** a `YearRoll from={1860} to={1865}` with a mask feathered top and bottom.
**Reconstruction:** cold opens and chapter heads that jump in time ("1877.").

### 3.11 Cut-outs with a paper margin
**What:** people cut out of photographs with a rough white margin, halftoned, standing on top of other pieces: the
magazine-collage look in its purest form. The Remotion tutorials add an offset coloured stroke behind each cut-out
for depth.
**Remotion:** we already have `rembg` masks and `halftone.py`; add a dilated, roughened white margin and a hard
shadow. On the board, a coral margin instead of the offset stroke marks the subject.
**Rule:** only real archival people (no generated faces), as now.

## 4. Grammar worth writing down (from the collage breakdowns)

Denys Zhylin's analysis of Johnny Harris's collages states rules the channel follows by instinct. Making them explicit
helps every scene:
- **Every piece explains something.** If it doesn't help the viewer understand, it doesn't go on screen (Fong says
  the same about Vox).
- **Direction means something.** Moving right = forward in time; moving left = back. On the board, earlier chapters
  sit left.
- **Closer = more important; stacking = accumulating** (debt, pardons, laws piling up).
- **Shallow depth.** Three layers, close together; the camera moves gently between them; only transitions are fast.
- **Motion starts and stops on words.** Already rule 4.

## 5. What we won't take

| Vox / tutorial habit | Why not |
|---|---|
| Chromatic aberration, scan lines, CRT and "screen treatment" | Rejected in the first study; no screens in the 1860s |
| Posterizing the camera | Our cameras glide on purpose (rule 3) |
| Yellow highlighter | Coral is the channel's |
| AI-generated people, "interview" clips of invented people (the 3D documentary and Claude/Remotion tutorials) | Channel rule: no generated faces of real or invented people presented as real |
| Google Earth flyovers, light leaks and film burns as decoration | Period maps only; decoration that doesn't explain fails Fong's test |
| Big 3D props on every page (the DaVinci 3D documentary tutorial) | We have the `3D object` technique for the rare moment that earns it |

## 6. Sources (YouTube captions read in full)

**Vox and Vox staff**
- Vox, "How we got to 10 million subs" — https://www.youtube.com/watch?v=axSh2T0uzYY
- Vox, "How to make more Vox videos happen" — https://www.youtube.com/watch?v=q0cvGRUbusQ
- *The Gradient* podcast, "Joss Fong: Videomaking, AI, and Science Communication" — https://www.youtube.com/watch?v=qgWtWsemQNc

**Analyses of Vox's craft**
- Chris Moran, "How VOX breaks the Digital Feel with Motion Graphics" — https://www.youtube.com/watch?v=sACZlG7z35Q
- Chris Moran, "How VOX Directs Your Attention" — https://www.youtube.com/watch?v=CqHb6bVoxgI
- Denys Zhylin, "How to Make Collage Animations like Johnny Harris" — https://www.youtube.com/watch?v=DwTEZukgMmk

**After Effects / Premiere tutorials**
- Motion Street, "Create Better Motion Graphics Like Vox in After Effects" — https://www.youtube.com/watch?v=mVhEb-4nnhQ
- Mapal, "How To Make Vox Style Videos" — https://www.youtube.com/watch?v=F7A503llNBA
- Motion Nerds, "How To Make A Vox Style Video" — https://www.youtube.com/watch?v=qum1ttEUPcE
- AEffecto, "How To Edit Viral Documentaries Like VOX" — https://www.youtube.com/watch?v=Ii3MVHwECys
- Flat Pack FX, "How to Create Vox Highlighter Effect" — https://www.youtube.com/watch?v=a0T3kcizcOY
- Motion Nations, "Vox Style Screen Recording Animation" — https://www.youtube.com/watch?v=L-fVQ9cG2R8
- "How to Make a Map Animation like Vox" — https://www.youtube.com/watch?v=d0mehhxMj20
- Motion Array, "How To Edit A Documentary Like Johnny Harris" — https://www.youtube.com/watch?v=nZrPVUzYHKE
- TomsProject, "I'll NEVER Edit Documentaries the Same Way Again — Vox & Johnny Harris Style" — https://www.youtube.com/watch?v=9zgp7ftturA
- Zane Hoyer, "How to Edit Premium 3D Documentary Animations" — https://www.youtube.com/watch?v=SH5_yULXa0Y

**Remotion + Claude builds of the Vox look**
- MoSidd, "I Made Vox-Style Motion Graphics Using Only Claude Code & Remotion" — https://www.youtube.com/watch?v=7wuYBfE131U
- RandomAI, "I Made Vox-Style Motion Graphics Using Only Opus 5.5 & Remotion" — https://www.youtube.com/watch?v=uIHJvUVaB34

**Gaps.** Ben Marriott's paper-cutout tutorial (the one a Vox animator credits) couldn't be read: YouTube rate-limited
the caption download. Several tutorials state frame rates (8, 12, 15, 16 fps) as "the Vox look"; Vox has never said,
so treat 12 as the convention, not a fact.
