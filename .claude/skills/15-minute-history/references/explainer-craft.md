# Explainer craft: what to borrow from Vox

Vox's explainers are easy to follow. This page lists the habits worth borrowing and how each one looks in the
channel's own style. **It is not a restyle.** The look (B&W archive, coral subject, teal marks, orange tape, 12 fps,
hard cuts, grain), the wry voice and every standing rule in the style repo's `videos/README.md` stay as they are.
Where Vox and those rules disagree, the rules win. Sources, transcripts and the evidence for each claim are in the
style repo's `techniques/vox_study.md`.

Read with `script-writing.md` (phase 2–3) and `building-scenes.md` (phase 7).

## Contents
1. Script checklist (14 rules, before/after)
2. Vox habits we don't adopt
3. Visual menu: Vox → our version
4. Build notes for the new pieces
5. A colour exception, when the subject is a colour
6. Depth, texture and 3D (from the West series)

## 1. Script checklist

Format: **what Vox does well → our version**. ✱ = new to the channel; the rest sharpen an existing rule.
Run the list on the beat outline, again on the full draft, and once more before voicing.

1. ✱ **Look again.** Vox opens on the object, then the detail that changes it ("At first, these photos look
   unextraordinary… But look at the glasses."). → Open on the artifact (existing rule); describe what anyone sees;
   then turn on one detail. Inside 20 s.
   - Before: "In 1874, Michigan published a book of wallpaper samples to warn people about arsenic."
   - After: "Michigan, 1874. A big book arrives at a library. Eighty-six pages. Every page is real wallpaper. And the letter in the front says: don't let children touch it."
2. **One-breath question, bigger promise.** The question is about the thing; the promise is about what it reveals.
   - Before: "Today we'll look at the history of arsenic in Victorian products."
   - After: "Everybody knew arsenic was poison. So how did it end up on the walls? The answer isn't really about chemistry. It's about who has to prove something is safe."
3. ✱ **Point with words.** "You're talking about the thing onscreen." → When a mark lands, the line says *this*,
   *look at*, *notice*. At least once per scene that has a mark.
   - Before: "*Punch* published a cartoon of a skeleton dancing with a lady."
   - After: "This is from *Punch*, 1862. A ball. A young woman in a green gown. And her dance partner. Look at his face."
4. ✱ **Just in time: "That's where… comes in."** Mechanisms and people enter when the story needs them.
   - Before (top of ch02): "Scheele's Green is copper arsenite, first made in 1775…"
   - After (once the gown is on screen): "So why green? Which brings us to the chemist."
5. ✱ **One name per thing.** Never swap synonyms for a key term. Name the variants once, then fold them in.
   - Before: "Scheele's Green… the emerald pigment… this copper green… Paris green…"
   - After: "Call it arsenic green. Chemists made two versions, Scheele's Green and a brighter emerald green. For this story, they're the same thing: arsenic green."
6. **One example carries it: concrete → general → why → result → back.**
   - Before: "Many children were poisoned by wallpaper. In one case, a girl named Emma got sick."
   - After: "Emma was nine. She got sick in her green bedroom and got better when they moved her out. Then they put her little brother in the same room. He got sick too."
7. ✱ **Stack, then "That means."** One-sentence recap right before the payoff.
   - Before: "Children licked the paper and there was dust, so it was dangerous."
   - After: "A wall covered in arsenic green. Dust every time someone brushes past. A toddler who licks the paper. That means the poison wasn't sitting in the walls. It was coming off them."
8. **Numbers land as a pair, a ratio or an object.** One number per sentence.
   - Before: "Output rose 2,615 percent between 1834 and 1874."
   - After: "In 1834, Britain made about 1.2 million rolls of wallpaper. Forty years later? About 32 million."
9. ✱ **Say how we know**, in two sentences.
   - Before: "All the samples contained arsenic."
   - After: "How do we know? Kedzie tested every sheet before it went in the book. Every one had arsenic."
10. **Translate a primary source right after it** (existing "Translation:").
    - After: "'…deemed too sacred to allow of excessive restriction.' Translation: a ban would mean telling businesses what they couldn't sell. He didn't think America would do that."
11. **Name the myth, correct it kindly** (existing rule; give it its own beat).
    - After: "You may have heard the wallpaper gave off a poison gas. It did, sort of. But that gas turns out to be pretty weak. The real danger was simpler: dust."
12. ✱ **Count the list out loud; each item rules something out.** Pair with a "1/3" counter on screen.
    - Before: "There were several reasons, including evidence, disagreement and money."
    - After: "So why didn't it stop? Three reasons. One: plenty of people had green walls and felt fine. Two: the doctors couldn't agree on how it worked. Three: the money."
13. **End on a short reversal, over the opening image** (existing shape).
    - After: "The green never changed. What changed was who had to prove it was safe." (over the sealed book)
14. ✱ **Confusion pass.** Vox's script editors flag "I was confused at this part." → Before voicing, read each
    chapter aloud to someone new to the story; fix every "wait, what?"; split any sentence that needs a second read.
    - Before: "Draper, whose report, commissioned by the Board, which had been founded three years earlier, found…"
    - After: "Massachusetts had just set up a Board of Health. One of its doctors, Frank Draper, went shopping. Candy. Toys. Dresses. Wallpaper."

Pace the top: no backstory before the driving question; a new beat every 1–2 sentences in the cold open.

## 2. Vox habits we don't adopt

| Vox habit | Why not | Our version |
|---|---|---|
| Expert interviews, named experts on screen | No historian names (standing rule) | The period document is the expert; "historians still argue", "modern tests suggest" |
| Host on camera; Johnny Harris desk with hands and props | Faceless channel; the virtual archival desk is the look | `Desk`, cards, `DropCard` |
| Flat vector graphics, Vox yellow highlighter, smooth 3D transitions, lens effects | Yellow was rejected (`harris` palette); hard cuts and 12 fps marks are the rhythm | Coral swipe, teal marks, hard cuts |
| Full-colour archive, colour grades | B&W + one coral subject | Only §5's exception, and only if the user picks it |
| Satellite flyovers | Period maps only; never past the map edge | `MapScene`, `RouteMap`, a period base map |
| Music changing every ~20 s | One bed per chapter | Borrow only the **drop on the reveal** |
| Modern politicians, news clips, living public figures as similes | Neutrality rules | A rare, instantly clear modern comparison |
| Answer first ("Let's get this out of the way") | The driving question is answered at the end | Answer-first only for a myth inside a chapter |
| Sponsor reads, membership plugs, Vox end cards | The channel's own intro, logo break, two subscribe lines | unchanged |

## 3. Visual menu: Vox → our version

Status: **have** = in the template kit or `techniques/components/`; **new** = build per §4.

| Vox does well | Status | Our version | Rank |
|---|---|---|---|
| Highlighter swipe along a quoted line | new (extends `DocMark`) | `swipe`: torn-edged coral wash, word-synced to the narration, stepped at 12 fps | 1 |
| Music cuts out on the reveal | partial (template cues take `from`; Ouija's `shell.tsx` adds `to`/`fadeOut`: copy it) | Bed to silence 4–6 frames before the reveal word; hold; next cue | 2 |
| Charts that build as they're narrated | partial (`Bars` staggers by frames) | `StepBars`: each bar on its own word; scale shock when the last value won't fit | 3 |
| One recurring visual anchor per video | have (Ember, Ledger, Wall) | Pick one object that returns at every mention; list its anchors in SCRIPT.md | 4 |
| "Look closer" at a detail | partial (punch-in, `Loop`) | `Loupe`: teal ring with a 3× crop joined to a small loop on the source | 5 |
| Zoom into a page; pull the line out | partial (`Doc` push, `SrcView`) | `DocLift`: page dims, the line lifts as a cream strip in its own type | 6 |
| Animated maps, route lines, map ↔ ground | have (US maps only) | Cut map → archive → map on the same pin; fit a new period base map when the story leaves the US | 7 |
| Mechanism diagrams | have (diagram boxes) | Teal line drawings stepped per anchor; orange note for the myth, struck through | 8 |
| Paired before/after | have (two views) | Optional `Wipe`: a teal line sweeps across one frame to reveal state B | 9 |
| Text callouts, 2.5D photos, paper textures, 12 fps stutter, one accent colour | have | No change | — |

Held visual anchors: once per chapter, let one picture sit 1–2 s with no new mark and no new fact.

## 4. Build notes for the new pieces

All marks sample `useGFrame()` (12 fps); cameras stay smooth. Anchor everything to words, never seconds.

```ts
// frames each word of a phrase starts (1 frame early), for word-synced marks
const wordFrames = (t: TL, phrase: string, nth = 1) => {
  const i0 = t.idx(phrase, nth), n = phrase.split(/\s+/).length;
  return t.words.slice(i0, i0 + n).map((w) => Math.round(w.s * t.fps) - 1);
};
```

- **`swipe`** (add to `DocMark` in `gt.tsx`): `swipe: {lines: [x0, yTop, x1, h][] /* source px */, words?: number[], dur?: number}`.
  Spread words over lines by character count; the front sits at the current word. Coral `multiply 0.55` +
  `color 0.4` (DocMark's tint blend), torn top/bottom edges (Highlight's seeded jitter, ±6% of line height).
  `quiet` chapters: teal at DocMark's quiet opacities. `marker_tick` 0.15 per line.
  `marks={[{at: t.at('The poisonous') - 2, swipe: {lines: L, words: wordFrames(t, 'The poisonous nature of the paper')}}]}`
- **`StepBars`** (extend `charts.tsx`): `bars: {label, value, at, subject?}[]`, `max0`, `rescale?: {at, max}`.
  Bars grow 8 frames from their own `at`; value in Abril on the bar; bone greys plus one coral. Scale shock: the
  last bar overshoots the frame for 4 frames, then the axis rescales in log space over 12 frames; `Stamp` the ratio
  on the next anchor. Numbers and sources in `src/data/charts.ts`.
- **`Loupe`**: `src size place cx cy (source px) r=160 zoom=3 to=[x, y] at`. Small `Loop` on the detail (10 f),
  6 px teal ring at `to` with the crop, bowed `Arrow` between, `tick`. Anchor on the noun ("Look at his face").
- **`DocLift`**: `src docX docY docW box (source px) at to scale=1.8 rot=-1 swipe?`. Page dims under
  `rgba(13,12,9,0.65)`; the strip is the scan's own pixels on cream with the card shadow; steps to `to` over 6 f;
  start ~8 frames before the quoted words. Clamp inside x 60…1860 and run the text probe.
- **Recurring motif** (e.g. `Swatch`, `Ledger`): `x y w at variant label`. Same place and size every time it returns,
  so viewers recognise it; a final variant for the ending (stamped, sealed, struck).
- **Music drop** (needs Ouija's per-cue `to`/`fadeOut` in `ChapterShell`): `{src, volume, to: t.at('natural causes') - 5, fadeOut: 4}`, then the next cue `from` after the held beat.
- **New base map**: B&W + `sepia(0.25)` period map, `PLACES` fitted by hand, camera clamped like `RouteMap`.
  Knowledge crossing the sea = the orange dashed letters route with the envelope.

Checks are unchanged: typecheck, `anchors.py`, stills sheet, `probe_text.mjs`, frames from the render.

## 5. A colour exception, when the subject is a colour

Vox codes a concept with a colour. The channel's version, offered only when a video is *about* a colour (first case:
*Dressed to Kill*, arsenic green). **Ask the user; present all three:**

- **A. Keep the rule.** The pigment is the coral subject. Safe, but "the most beautiful green" is shown in coral.
- **B. One-time break (suggested).** The pigment is the only real green in the video: a `Swatch` card, wallpaper
  samples and gowns via **ColourReveal**. Coral stays on the human subject in the same frame.
- **C. Swap coral for green for the whole video.** Not recommended: breaks the brand and sits close to teal.

Guardrails for B: green only on the pigment, never on text, titles, notes, arrows or charts. Sample the green from a
real scan and keep it yellow-leaning, away from teal `#2FE0C4`; don't trace a teal line straight around a green area.
In `quiet` chapters the green stays small and still (it's evidence). Let the motif close the video (e.g. the swatch
sealed in a sleeve beside the sealed book). Full proposal, with the dust-vs-gas diagram, document swipes, output
chart and the London–Boston–Michigan map: `techniques/vox_study.md` §7.


## 6. Depth, texture and 3D (from the West series)

The user's note on the first West-series samples: "it all feels a little flat… not a lot of depth variation or texture. Zooming in
might help." Studying three Vox-collage pipelines (`techniques/vox_repos_study.md`) showed why: the pure collage look is *meant* to be
flat (one plane, scanner light). The channel gets depth from camera grammar, texture and drawn 3D instead. Working examples:
`projects/American_West/ep1/src/previews/` (P1 cold open, P2 race ribbon, P3 township) and its `review/previews/README.md`.

- **Shot grammar.** Every beat is a **wide** shot then a **detail** cut-in. A cut every 3–6 s; one composition never more than ~7 s.
  One camera move per shot (push, pull, pan, tilt, parallax; static on the payoff), never the same move twice in a row. A timeline
  story pans the same direction beat to beat, pushes in on the turning point, pulls out on the takeaway.
- **Zooms need resolution.** Pull the largest scan (LOC TIFF masters) before planning a 6–8× push into a face or object.
- **A desk with depth.** Cards at different heights (CSS 3D is enough; `@remotion/three` if needed), a lamp pool over the centre,
  slight focus fall-off on near/far layers, contact shadows that grow with height, parallax inside photos (`tools/layers.py`).
- **Weight.** A *slap* (a piece starts ~130 % and snaps down), a slight overshoot settle, a small exponentially decaying camera shake
  on hard landings, a faint "breathing" sway on settled pieces, whip cuts between beats. Marks still step at 12 fps; the camera
  stays smooth.
- **Texture.** Torn edges from real torn-paper shapes, translucent tape, stains multiplied in, halftone and slight misregistration
  on cut-outs (`tools/weather.py`), grain over everything. Still no cream or white surfaces on the black desk.
- **3D where it explains.** Tilted township grids with slabs rising, elevation ribbons, cut-away diagrams. Teal contour lines on
  black, one coral element, real data where possible (or labelled control points, "heights exaggerated" on screen).
- **Hook alignment** (Kallaway). In the first ~2 s the visual, the first spoken line and a short written hook say one thing.
  After the hook, the three tracks do different jobs: the type states the point, the voice explains why, the picture shows it.
- **Design the end frame first**, then animate toward it, so pieces resolve into a composed frame rather than drifting in.
