# Shorts layout, covers and lessons

Everything learned making the first three shorts (King Andrew "He wouldn't bow to a king", Fix Everything's Fox sisters
and Temperance). Read it before building scenes. Each rule lists the mistake that taught it, so you can tell when it
applies.

## The frame

1080 × 1920 at 30 fps. YouTube draws over the frame: the search bar and back arrow along the top, the title, channel,
caption and music line along the bottom, and the like, comment, share and remix buttons down the right side.

| Band | y (px) | What goes there |
|---|---|---|
| YouTube's top bar | 0–170 | nothing that matters (the top of a full-bleed picture is fine) |
| Headline | 190–470 | the two lines of orange tape, on every frame |
| Picture band | 500–1230 | faces, cards, maps, notes, arrows, highlights |
| Captions | 1250–1440 | the shell's word captions; keep marks out of here |
| Source tag | 1462 | `TagV`, the small credit line |
| YouTube's bottom overlay | 1480–1920 | nothing that matters |
| YouTube's buttons | x > 950, y > 900 | no notes or faces in the bottom-right corner |

The shell draws, from back to front: your scene, a dark gradient at the bottom (so the captions read), the headline on
a dark gradient at the top, the captions, grain and vignette. Faces under the top or bottom gradient go dark, so keep
the subject's head in the picture band.

## Choosing a layout for each picture

The long video's scenes are 16:9. Few pictures fill a 9:16 frame, so decide per picture:

| The picture | Layout | Example |
|---|---|---|
| A portrait or tall picture at enough resolution (upscale ≤ ~1.5×) | `fillV(size, fx, fy, z)` full-bleed, with a slow push | The Sully portrait; the 1830s election engraving at `fillV(size, 450, 2000, 1.8→1.88)` |
| Low resolution, or wider than tall | `CropV` card in the picture band, ~900–940 px wide | The whiskey-ration and breakfast paintings, 940 × 525–560 |
| A face for the cover | `CropV` with `mask` (coral tint, teal trace), drawn at `at={-100}` | The Fox sisters' daguerreotype, 460 × 608, `rot={-3}` |
| A document, print or the thumbnail | `Card` (from the kit's `common`) | The outro thumbnail, 880 wide, `filter="none"` |
| Places | `MapViewV` (the camera centre lands at 540, 860) with `PinV` pins and `mapToScreenV` for loops | Spiritualism spreading; the Maine Law |
| A number | Drawn objects on `DarkPaper`, big | Seven 175 px jugs in two rows for "7 gallons" |

- **Upscales over ~1.5× look soft on a phone.** Check `size × scale` against the frame. A soft full-bleed picture
  is worse than a sharp card.
- **Engravings with a printed caption at the bottom:** zoom with `fy` set so the clamped `top` pushes the caption
  off the bottom edge. In the King Andrew short, "The Brave Boy of the Waxhaws" lettering otherwise showed up in the
  cover.
- **A payoff picture whose head is at the very top** (the "King Andrew the First" cartoon) goes on a card in the
  picture band. Full-bleed puts the face under the headline.
- **`CropV` crops a window:** the source around `(fx, fy)` at `scale` inside `w × h`, clamped so it never shows past
  the edge. For a whole picture on a card, use `scale = w / size[0]` and `h = size[1] * scale`. `reveal` lets the
  colour creep in from the right. `children(S)` gets a source-to-screen mapper for loops and arrows on the picture.

## Text

- **Nothing on a face**: no note, highlight or arrow. In the Fox short, the "Hydesville, N.Y." note crossed a sister's
  face on the cover, so it moved above the card.
- **Notes don't collide.** Change a scene's notes over time rather than stacking them. In the Temperance short, the
  "≈ 3×" landed on the earlier notes; those notes now hide at `t.at("That's")` and the jugs for today appear in their
  place.
- **Width before you place it** (the frame is only 1080 wide):
  - Nanum handwriting (`Note`): about `size × 0.42 × characters` wide (its rendered size is 1.55 × `size`).
  - Abril on tape (`Highlight`): about `size × 0.62 × characters`, plus the tape's ends.
  - At headline size 92 a line holds ~15 characters; at 86, ~16.
  - Highlights in the picture band: 60–96 px, two words a line.
- Run `probe_text.mjs` on every short. Its "partly on screen" test must use the composition's size; older projects'
  copies used 1920 × 1080 and silently skipped the bottom half of a vertical frame. The fixed line is
  `sizes[h.id] = [composition.width, composition.height]`.

## Covers

YouTube doesn't document which frame becomes a Short's cover. Creators report it looks arbitrary, and the creator can
pick a frame in the YouTube app. Design for any frame:

1. **Frame 0 is the cover.** The headline is fully drawn (`at={-100}`), the strongest picture is already on screen
   (`at={-100}`, `traceAt={-100}`), and a face is coral-tinted if possible.
2. **The headline never leaves.** The shell keeps it on every frame.
3. **Check frame 0, 25 %, 50 % and 75 % with `cover_frames.py`,** plus any scene you're unsure about. Each must show a
   picture under the headline. The failures so far:
   - *Fox, 75 % (43.7 s): nearly empty desk.* The scene began with a pause before its card appeared. Now the card
     appears at `t.at('Oh')`, the first word of the scene. Rule: **show a scene's main picture at its first frame**;
     add notes later.
   - *Fox, 50 %: the Spiritualism newspaper under a 0.65 dark overlay.* Lowered to 0.45. Rule: **never dim a picture
     past ~0.45** to make notes read; move the notes instead.
   - *Temperance, 0:00:* the seven jugs are on the desk from frame 0 and only bump one at a time on "seven", so the
     cover isn't an empty desk waiting for them. Apply the same to any count or build-up scene that opens a short.
4. **Keep the outro out of the 75 % point:** the story part runs ≥ ~30 s for a ~9 s outro.
5. Save `cover_frame0.jpg` next to the short and tell the user "pick 0:00 in the YouTube app if you'd rather choose."

## Timing across clips

- `joinWords(CLIPS)` re-times every kept word onto the short's clock, so `t.at('phrase')` works across clips. Cut in
  pauses: `segments.py` sets `from`/`to` halfway into the silence, so no word is clipped.
- Repeated words are the usual bug. `t.at('Andrew')` finds the first one; pass the occurrence (`t.at('Andrew', 2)`) or
  a longer phrase (`t.end('King Andrew')`). `check_anchors.py` lists every cue phrase that is missing or repeated in
  the joined words, and which one the code gets.
- Switch scenes with `useCurrentFrame()` in the body (the `cuts.reduce` pattern), not `useGFrame()`. The g-frame
  steps at 12 drawings a second, so a cut would land up to two frames off its word.
- A cut is one frame before its word (`at('Word') - 1`), with a whoosh from the shell.

## Captions

The shell's `Captions`: chunks of up to 3 words, breaking at punctuation and paragraph ends, the spoken word in teal,
Inter 800 at 70 px, white with a heavy black outline, centred in y 1250–1440. They're on for every short (most people
watch muted). Curly quotes are stripped.

## Music

| Cue | What it sounds like | Used for | Cue loudness | `volume` | `duck` (`duckTo`) |
|---|---|---|---|---|---|
| `j_campaign` | rowdy 1820s campaign march | King Andrew, "He wouldn't bow to a king" | −14.5 LUFS | 0.12 | "by the end of the war… no family left" (0.4) |
| `r_spirits` | playful-eerie music box | Fox sisters | −10.7 LUFS | 0.09 | the Civil War beat, "Think"→"Mary" (0.5) |
| `r_temperance` | honky-tonk piano, fiddle, tuba | Temperance | −12.6 LUFS | 0.12 | "the damage everywhere" (0.5) |

- Pick something fun from the style repo's `music/README.md`, ideally the chapter's own cue if it's upbeat, else one
  from the same video. A loud cue needs a lower `volume`: about 0.12 at −14 LUFS, 0.09 at −11.
- `duck` takes frame ranges (`[[T.at('Think'), T.at('Mary')]]`). The bed fades in over 10 frames and out over the last 40.
- Copy the cue into the project's `public/music/`; don't link to the style repo.

## Masks for the cover face

If the cover picture has no mask yet, make one with the project's `tools/mask.py` (rembg, `isnet-general-use`), which
saves `<name>_subject(_a).png` and `<name>.json` via `trace.py`'s `save()`, then add it to `src/masks.ts`. `mask.py`
keeps only the largest piece of the cut-out. For two people in one picture (the Fox sisters), keep every piece larger
than 5 % of the image instead, or one sister loses her tint.

## The outro

- One line per long video, recorded once: "Want the rest of the story? Watch the full video, TITLE, right here on the
  channel. And subscribe for more 15 Minute History." It's about 7–9 s at the locked pace.
- `OutroWatch` (cut on `'Want'`): "want the rest of the story?" note, the long video's thumbnail on a card **in
  colour** (`filter="none"`; the kit's `Card` greys pictures by default, and the first version came out grey), and
  "the full video is linked below" on `'right here'`.
- `OutroSubscribe` (cut on `'And subscribe'`): the wordmark, SUBSCRIBE on tape, an arrow toward YouTube's subscribe
  button.
- The channel prefers likes and subscribes in the description, not the narration, for the long videos. In a Short the
  voiced outro is the user's request, so keep it there.

## Delivering

- Master to −14 LUFS with `tools/master.py`. Shorts come out 9–35 MB.
- For chat, anything over 30 MB gets a re-encoded copy at 3600 kbps; the full-quality file stays in the repo.
- The upload text goes in `SHORTS.md`: caption, alternate, description, hashtags, Related video, cover time, AI
  disclosure. Fix Everything's Temperance short has two AI-illustrated scenes, so its disclosure is **Yes**. The Fox
  and King Andrew shorts are all archival.
