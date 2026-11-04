# Images and masks

> **House rule (the user's, after *The Balloon War*): cut-outs on the notebook first.** Every photo goes on the dark ruled
> paper (`DarkPaper`): its subject cut out (`Cut` in `src/kit/desk.tsx`: B&W, teal trace, coral on the one key subject), or, when the picture has
> no single subject or the mask fails (landscapes, crowds, rooms, a speck in the sky), as a print on the desk (`Print` in
> `src/kit/print.tsx`; no cream card or mount since the West series: everything new stays on the black desk).
> **No full-screen photos with slow pushes (no "Ken Burns"), no 3D depth fly-throughs, and no color photos**, modern ones
> included: everything is black and white. Cut masks for every photo while sourcing, not after the scenes are built.

## Contents
1. Archival first: finding and crediting images
2. AI paintings for gaps (Gemini prompts)
3. Masks: the coral tint and teal trace
4. Getting files from the user
5. Archival parallax and checking masks
6. Wood engravings, clean masks and marked-up pages (from *The Exact Spot*)
7. Google AI Studio (Gemini) and the lithograph style (from the West series)
8. Masks on real-photo videos (from *The Balloon War*)
9. Silhouette paintings and AI props (from *Trick-or-Treating Was a Bribe* and the Diamond Hoax; partly superseded by §11)
10. Portraits are bust cut-outs; white props on black (West Ep 2)
11. **Silhouette scenes, the current look and pipeline** (from *The Balloon War* v2): one locked palette, solid black figures,
    split by colour and region, the stress test; props on the black desk

## 1. Archival first

Real people, places, documents and events come from period sources: engravings, lithographs, political cartoons,
portraits, daguerreotypes, broadsides, maps and scanned book plates. Every image shows black and white on screen,
so a good engraving beats a muddy color painting.

```sh
python3 tools/find_images.py search "Treaty of New Echota"                 # every source at once
python3 tools/find_images.py search "John Ross Cherokee" --src=loc,commons
python3 tools/find_images.py books "life of Andrew Jackson"                # pre-1930 scanned books (plates!)
python3 tools/find_images.py pages <ia-identifier> 1 60 out/pages.jpg      # contact sheet of a book's pages
python3 tools/find_images.py get loc:2003656574 public/img/ch10/ross.jpg   # download + record the credit
```

- Sources it searches: Wikimedia Commons, Library of Congress, The Met, Art Institute of Chicago, Cleveland Museum
  of Art, Internet Archive (and its pre-1930 books). It refuses anything that fails that source's public-domain or
  open-licence test, and every `get` is written to `public/img/credits.json`. Those credits feed the on-screen
  `Tag` and the description's "Sources & credits" line.
- Folder per chapter: `public/img/chNN/`. Name files for what they show (`ross_lithograph_1843.jpg`).
- Get more than you need: an alternate per key moment and a strong image for each person named.
- **Newspapers and printed laws** (Library of Congress, Chronicling America, with word-level OCR boxes):
  `tools/phrase_find.py <page-url> --sp N --phrase "..." --out public/img/chNN/x` cuts the page region and writes a box per
  printed line of each phrase (for `Swipe` / `Spot`); `tools/word_hunt.py --word vagrant --states ... --out DIR` finds one
  word across many papers and crops it dead centre (for `WordRun`). loc.gov rate-limits: keep 5 s between requests.
- **Treatments:** `tools/crease.py` turns a photo into a frameless, creased old print (the board's look);
  `tools/halftone.py` a newsprint halftone; `tools/silhouette.py` a cut-paper silhouette traced from a real portrait
  (an unknown sitter stands in for "who?"); `tools/distress.py` a wear mask for the worn logo.
- The 1836 Mitchell map ships with the template (`public/img/maps/`). For other eras, find a period wall map of
  the right decade, at least 4000 px wide, and read new `PLACES` pixel positions off it.

## 2. AI paintings for gaps

Use Gemini only for moments with no surviving image: a scene, a crowd, a room, a mood. The user runs the prompts
and uploads the PNGs. Write the prompts into `script/GEMINI_PROMPTS.md`:

- One entry per image: the file name (`chNN_slug.png`), the narration line it covers, the prompt, and
  **must-have** if the scene is noticeably worse without it.
- A prompt names the year, the place, what is in the frame, the light and the mood. Be specific about period
  clothing, buildings and objects.
- **No recognizable real person.** Where a real person must be in the scene, show them from behind, at a distance
  or in shadow, face not visible. Anonymous ordinary people may show faces.
- **Every prompt ends with the identical style paragraph**, so the images read as one series. Adjust only the
  decades to the video's era, then keep it word for word for the whole video:

> Style: an American oil painting from the 1820s–1830s in the manner of the period's genre painters, such as
> George Caleb Bingham and William Sidney Mount. Muted earth palette (umber, ochre, slate blue, dull red), warm
> directional light, visible brushwork, faint craquelure, slightly aged varnish. Every detail must be historically
> accurate for the stated year and place: clothing, hairstyles, buildings, furniture, lamps and tools. No text of
> any kind: no letters, words, signs, labels, captions, signatures, dates or watermarks. No frame or border. No
> recognizable real historical person. Faces, where visible, belong to ordinary anonymous people.

- Header notes to include for the user: the model (Gemini image generation at its largest size), aspect 16:9,
  paste the whole prompt including the style paragraph, regenerate rather than fix anything with text, extra
  fingers, modern objects or wrong details, and the scene still works if they skip an image.
- In scenes: read the real size (it won't be exactly 16:9), tag it `Illustration · <what it shows>`, and treat it
  like any archival image (B&W, one coral subject).
- **Offer a style test before writing all the prompts.** Give the user one scene in two or three styles (*Dressed to Kill*:
  oil painting, graphic novel, Victorian silhouette) and let them pick. The **silhouette** paragraph that won:

> Style: a Victorian cut-paper silhouette, like the black profile portraits and silhouette scenes popular in the 1800s. Every
> figure, object and piece of furniture is a solid, flat black shape with crisp, finely cut edges and delicate details in the
> outlines (curls of hair, lace, leaf tips, the folds of a skirt). Background in warm cream paper with a faint paper texture,
> and soft grey tones only for distance and haze. The only colour in the entire image is a flat, bright, [colour], used only
> on the [things] named in the scene; everything else is black, cream and grey. Period details must be accurate for the
> stated year and place: no modern buildings, clothing or objects. No text of any kind: no letters, words, captions, signs,
> labels, signatures or watermarks. No frame or border. No recognizable real historical person; every figure is an anonymous
> silhouette.

  Silhouettes stay in their own colours on screen (no grayscale, no coral; `Sil` in `techniques/components/dressed_to_kill/dk.tsx`).
  The user can paste all prompts as one Flow upload (style once, then numbered scenes, each labelled with its file name);
  if Flow merges scenes, run them one at a time.
- **Check every AI image for text** at full size before use: one silhouette came back with "SCHEELE'S GREEN" on a farmer's tin
  (wrong, and AI text). Paint it out (`cv2.inpaint` on the letter strokes inside a tight polygon, then flatten to the label's
  median tone) and keep the original in `public/img/gen/tests/`.
- **Pre-photography videos: use the wood-engraving style instead** (section 6). It sits beside real period prints,
  looks less "AI", and masks cleanly.

## 3. Masks

The coral subject and teal outline need a mask of the subject, the same size as the image.

**Default: rembg, locally** (`tools/mask.py`). Add a job and run it:

```python
JOBS = {
    "ross": ("img/ch10/john_ross.jpg", None, "isnet-general-use"),                 # whole image
    "voters_a": ("img/gen/ch05_new_voters.png", (80, 120, 420, 850), "isnet-general-use"),  # crop to one figure
}
```

`python3 tools/mask.py ross voters_a` writes `public/img/masks/<name>_subject.png`, `<name>_subject_a.png` (the
alpha used by `Tint`) and `<name>.json` (outline paths for `Traced`). Then import the JSON in `src/masks.ts`:

```ts
import ross from '../public/img/masks/ross.json';
export const MASKS = { ..., ross: maskRef('ross', ross) };
```

- Crop to one figure when a picture has several people; the largest piece is kept.
- Look at every mask on a still before relying on it (`node tools/stills.mjs ...`): the trace should hug the
  figure just outside its edge. Portraits and single figures work almost every time; busy engravings may need a
  tighter crop.
- Setup once: `pip install rembg onnxruntime opencv-python-headless pillow numpy` (the first run downloads the
  isnet model, ~170 MB).

**Optional: Gemini mask pass.** The prompt asks Gemini to return the same image with the subject filled flat
magenta (#FF00FF) and a second subject green (#00FF00). Then
`python3 tools/trace.py fromfile <painted.png> <original.png> <name>` turns the fills into a mask. **Check it
lines up**: overlay the mask on the original. On *King Andrew* only one of five Gemini mask passes came back
pixel-aligned; the rest were redrawn and had to be masked with rembg instead. Users also sometimes upload the
mask version in place of the original; compare the two files before using either.

## 4. Getting files from the user

- Ask where uploads will land (a folder, or a separate branch). If they use another branch, read from it with
  `git fetch origin <branch>` and `git checkout origin/<branch> -- <paths>` (or `git show`), and never push to it.
- Check what arrived: file names, sizes, and that the originals aren't the mask versions.
- Copy images into `public/img/gen/` (AI) or `public/img/chNN/` (archival) with the names the scenes expect.

## 5. Archival parallax and checking masks (from *Say It Ain't So*)

- **Check every mask** before a scene uses it: `python3 tools/mask_preview.py out/masks.jpg name1 name2 ...` (coral fill
  and teal outline on a contact sheet). A white uniform against a pale sky often comes back as a head only: re-run that job
  with `u2net_human_seg` instead of `isnet-general-use`. Engraved portraits that fade out at the bottom also do better with it.
- **2.5D layers for any masked photo**: `python3 tools/layers.py [names]` writes `public/img/layers/<name>_fg.webp` and
  `_bg.jpg` from the rembg mask (no Gemini pass needed). `src/kit/parallax.tsx`'s `Parallax` uses them (falls back to the flat
  picture until they exist). Pass `crop` (source pixels) to keep the camera inside a glass negative's black border, and
  `frame={[1080, 1920]}` for vertical.
- **A figure from an engraving can stand in for a person with no photo**: give `mask.py` a tight crop box around one small
  figure in a big print, then show that detail (`CropCard`, or `Parallax` with a small `crop`; build its layers with
  `LAYERS_MAX=4000` so they stay sharp). Say on screen whose photo doesn't survive.
- **AI paintings and silhouettes** (*Dressed to Kill*): crop each mask job to one figure, and when the figure is fused to a prop
  (hands on a table, a tray in front) add **cut rects** (a list of rectangles among `mask.py` JOBS' optional fields, beside `min_area`) to remove the prop. If arms or the prop
  still split between layers, delete that picture's layers so `Parallax` falls back to a flat camera move. `layers.py` now fills
  small pictures (under 2000 px) with a tight, sharp hole (no smeared halo); check `fg` on magenta and `bg` side by side, plus a
  composite with the figure shifted ~20 px, before building scenes. Keep parallax depth gentle (1.05) on paintings.
- **Tight portraits don't fit a full-bleed frame**: a close-up (a face that fills the source) zoomed to cover 16:9 puts
  every note on the face. Use the "subject left, notes right" `CropCard` layout instead.

## 6. Wood engravings, clean masks and marked-up pages (from *The Exact Spot*)

**Flow wood engravings.** For a story before photography, ask for every gap image as a black-and-white wood engraving
from an 1840s–50s illustrated newspaper, all from **one master prompt** (Google Flow) so they read as a series. The
style block, kept word for word (adjust the decades):

> A black-and-white wood engraving from an illustrated newspaper of the 1840s–1850s, such as the Illustrated London News.
> All shading made with fine parallel lines and cross-hatching. Crisp black ink on slightly yellowed paper, white
> highlights cut out of the block, slight ink spread and uneven printing. Bold, clean line work and high contrast. No
> color, no grey gradients, no airbrushing, no painterly texture, no photographic look. Figures drawn the way period
> engravers drew them: slightly stiff, clear silhouettes, simple uncluttered backgrounds. Light and mood are shown only
> through the density of lines (dense hatching for night and shadow, open paper for daylight).

Plus the usual rules (accurate details, no text anywhere, including flags; no frame; no recognizable real person; one
clear subject; no gore). The full prompt is `examples/08_Exact_Spot/FLOW_PROMPT.md`. Show them with `Engraving`
(`src/kit/engraving.tsx`: full frame, cropped only to 16:9, slow push, soft fade in and out) or `Parallax` with layers
built by `LAYERS_FILL=paper python3 tools/layers.py <name>` (plain paper behind the subject; a blurred inpaint looks like
grey mush against hatching). Real documents and portraits stay cards on the desk, so an illustration never passes for a source.
**If a picture can be misread, replace it**: an engraving of dragoons inside a ranch fence read as a pen, not an ambush;
a drawn diagram beside the map fixed it.

**Search anywhere for archival images**: Library of Congress, Internet Archive scans of pre-1930 books (often the only
good copy of a facsimile or a diary page), state collections, museums. Wikimedia rate-limits; don't depend on it. Credit
every file in `public/img/credits.json`.

**Masks are checked at full resolution, and fixed by hand when rembg can't.** The user caught a rough portrait mask
that looked fine on the contact sheet.

1. `python3 tools/mask.py <name>` (rembg). A 4th JOBS field sets the smallest piece kept (`min_area`, default 20000 px).
2. `python3 tools/mask_closeup.py out/closeup.jpg <names>`: each mask at full size, outline beside the cut-out. Look at
   every edge: hair, hands, sleeves, chair backs, a bucket the figure holds.
3. Fix with `python3 tools/refine_mask.py <name>`: `--close N` closes gaps, `--smooth N` smooths the edge, holes are filled
   (it pads first, so subjects touching the image edge work), specks dropped. For what rembg gets wrong, trace polygons
   by hand: `python3 tools/trace_grid.py <src> out/grid.jpg x0 y0 x1 y1 step [mask]` gives a crop with a labelled pixel
   grid; write the points (source pixels) to `tools/traces/<name>.json` and apply with `--add` (union), `--sub` (cut away a
   chair or table), `--keep` (clip, e.g. to a portrait's oval) or `--only` (the trace alone, for flags, cannons, buildings
   and small figures rembg finds nothing in).
4. Write each command in `tools/traces/README.md`, and comment the job in `mask.py` "hand-traced: tools/traces/… do not
   re-run", so nobody overwrites it with a fresh rembg pass. Then rebuild layers and look again.

**Loops on the right line of a scanned page.** Eyeballed coordinates put the loops on Polk's diary one line off. Run
`python3 tools/text_lines.py <page.jpg> [x0 x1]`: it prints each text line's centre and extent in source pixels; use them
for the `Loop`'s `cy` and `rx` inside a `CropCard`'s `S()` mapping, then check a still.

**Keep heads in frame.** On a push into a picture of two or more people, set the focus (`fy`) on the faces, keep the push
small (`z` 1.0 → 1.05) with no vertical drift, and look at the first and last frame. Grant and Lee's heads left the shot on
the first try.



## 7. Google AI Studio (Gemini) and the lithograph style (from the West series)

- **Key:** `GEMINI_API_KEY` in the project's `.env` (the user's paid AI Studio project). Never print or commit it.
- **Model:** `gemini-2.5-flash-image` (about 4 cents an image), `generationConfig: {responseModalities: ["IMAGE"], imageConfig:
  {aspectRatio: "16:9"}}`. The user preferred it to `gemini-3-pro-image` (about 13 cents), which looked "more AI".
- **West-series style:** tinted 1860s lithograph with muted colour; the master prompt and rules are in
  `projects/American_West/LITHO_PROMPT.md`. Flash habits to fix every time: invented signatures (paint out), borders and rounded
  vignettes (crop), figures lined up in a row (the prompt's composition paragraph).
- **Post:** `python3 tools/weather.py in.png out.jpg --preset medium` (the user's pick).
- **No on-screen tag for AI images and never "AI" on screen** (the user's rule); keep the record in `credits.json` and the prompt log.
- **Other uses that worked** (`projects/American_West/ep1/review/ai_tests/`): texture packs on pure black for keying (torn paper,
  translucent tape) and stains on white (multiply); props shot on a white seamless background for cut-outs (mask them with
  `tools/mask.py`, not a white key, or a grey shadow fringe stays); **finding exact line positions on a scanned document** with
  `gemini-flash-latest` and `responseMimeType: application/json` (boxes `[ymin, xmin, ymax, xmax]` normalised 0–1000), which places
  swipes and zooms exactly; transcribing handwriting; describing archival photos.
- **Free routes tested and dropped (Oct 2026):** Pollinations (watermarked, swapped model, ignores style), Hugging Face Inference
  (no free image credit; Flux removed from the free tier), local SDXL-Turbo on CPU (fine for background plates, wrong on people).

## 8. Masks on real-photo videos (from *The Balloon War*)
- **The object can be the subject.** A balloon, a decoy tank or a crumpled envelope takes the coral tint and teal trace as
  well as a person does, and it ties the look to the story ("this is the thing"). Draw the trace on the word that names it,
  in place of a hand-drawn loop.
- **Tiny subjects work**: crop the mask job tightly around a small object in a big photo (the barrage balloon over LST-388 was
  380 × 250 px of a 3840 px negative) and the trace still reads. Frame the shot so the subject and its context (the ship) both fit.
- **Tall photos don't go full-bleed.** A portrait-shaped picture covered to 16:9 crops the subject. Put it on a card on the desk
  with the tint and trace inside the card (`Cutout ... whole`), and the notes beside it.
- **A cut-out figure on the desk**: show the `_fg.webp` layer alone, tinted and traced, on dark paper, with any edge the source
  cut off (a shoulder, the waist) placed off-frame so no straight cut shows. It springs up from below on its cue.
- **Expect some misses**: busy crowd scenes and soft, pale shapes against sky (a half-filled paper balloon, a deflated barrage
  balloon among seated soldiers) came back wrong twice. Two tries, then drop it and pick another photo.

## 9. Silhouette paintings in multi-plane parallax, and AI props (from *Trick-or-Treating Was a Bribe*)

> **Superseded in part by §11 (*The Balloon War* v2, Nov 2026).** Two things below are no longer the channel's way: a palette per
> scene (now **one locked palette per video**, `tools/sil_palette.py`) and the **depth split** as the default (now **split by colour
> and region**, `tools/sil_regions.py`, then `tools/sil_stress.py`). The prompt habits, the landscape checks and the prop notes still hold.

- **Layered-silhouette paintings** (black foreground, ochre haze bands, big moon, one orange light; style paragraph in that project's
  `script/GEMINI_PROMPTS.md`) on `gemini-3-pro-image` at 2K (`tools/gemini_image.py`, `SIZE=2K`). Name anything that must not be
  orange ("a pale turnip, NOT a pumpkin"); reject any take with painted lettering on signs; crop baked-in letterbox bars.
- **Split into depth planes** (the Halloween method; prefer §11's colour/region split now): `DEPTH_MODEL=~/models/da2_small.onnx python3 tools/sil_layers.py <painting.jpg>` (Depth Anything V2
  small, from huggingface `onnx-community/depth-anything-v2-small`). Luminance alone split the sky into patches; depth keeps lanterns
  with the hands holding them. Show it with `SilScene` (`src/kit/silparallax.tsx`): camera push, each plane at its own speed, fog
  between the back planes, flickering lights.
- **The user's note (Oct 2026): faint ghost outlines of foreground shapes showed on the planes behind them** as the planes slid.
  Cause: each nearer shape's soft, anti-aliased rim lay outside the area that was painted out. Fixed in `sil_layers.py` with
  `EDGE = 6` (paint out 6 px beyond every nearer shape and let the rim take the fill). Before using a new set of layers, look at each
  back plate (`L{n}.jpg`) at full size for traces of the shapes in front of it; raise `EDGE` if any remain.
- **AI props** (photoreal period objects on white, `gemini-3-pro-image`, 1:1): `tools/prop_cut.py` cuts them out to WebP; `Prop`
  (`src/kit/prop.tsx`) shows them B&W on the desk with an optional coral tint and teal outline. No source tag, never presented as a
  specific real artifact.

- **A palette per scene** (*They Fooled America's Richest Men*; **retired by *The Balloon War* v2**, see §11: next to the black desk
  the per-scene palettes read as eleven different films; the user: "other colours… whatever matches the vibe"): name the palette
  and the mood in each prompt (e.g. "midnight blue to violet, lantern amber, one red ruby glint; a crime in progress"), keep one light
  source per scene. Contact sheet: `projects/Diamond_Hoax/review/contact/scenes_v2.jpg`.
- **Check the landscape, not just the figures.** Gemini put desert mesas behind San Francisco, the Bay and the California foothills;
  name what the background must and must not be ("rounded oak hills, NO mesas, NO buttes, NO desert"). It also painted "BAN…" on a
  bank: say "NO sign, NO lettering, NO name carved or painted anywhere".
- **`sil_layers.py` works on any painting**, including a B&W engraving (the banker's office behind the cold-open reveal).
- **Props whose inside is pale** (a blank certificate, a watch dial) come out of `prop_cut.py` with holes. Re-cut them by removing only
  the white connected to the image border (flood fill), or fill the largest interior hole of the rembg mask with the source pixels;
  never fill a hole without putting the original pixels back (it goes black). An engraving with hatched background shading cuts out
  with ragged patches: strip the background first with `tools/gemini_edit.py` ("remove all background hatching… keep the man
  exactly as he is").

## 10. Portraits are bust cut-outs; white props on black (West Ep 2, Oct 2026)

- **Every portrait of one person is a full bust cut-out**: head and shoulders only, cut out of the page (no print border, no photo
  background, no circle mount, no oval or poster frame), on the desk with a soft contact shadow. `tools/mask.py` with
  `u2net_human_seg` (or `isnet-general-use`), crop to the bust, hand-fix the edge, check with `tools/mask_closeup.py`. The beat's
  subject gets the coral tint and teal trace; anyone else is plain black and white; quiet sections have no coral. Group photos and
  scenes stay as prints; photos of Native people stay plain prints, never cut out.
- **AI props on white** mask well with `tools/mask_white.py` (anything not paper-white in the clean original, small holes filled,
  real openings kept). **White props (snow, paper, bone) go on black instead** (`tools/props.py` `ON_BLACK`, then
  `tools/mask_white.py --bg=black`): snow drawn on white gave a ragged edge the user caught.

## 11. Silhouette scenes: the current look and pipeline (from *The Balloon War* v2, Nov 2026)

The channel's AI illustration style for scenes with no photo (*The Balloon War* v2 had 16; the worked files are
`projects/Balloon_War/script/SILHOUETTES.md` and `FLOW_PROMPT.md`, the planes in `public/img/layers/sil/`). This replaces §9's
palette-per-scene and depth split.

**The look (the user's rules)**
- **One uniform palette per video, locked to the channel.** Warm ink `#0D0C09` for everything in front (the desk's ink, so scenes
  join the desk), a **teal-slate haze** for the distance (`#111B1B` → `#1C3332` → `#335652` → `#5F857F` → `#A3BAB2`, a dark quiet
  cousin of the channel teal), a pale sage glow `#DFE0D6`, **cream `#F4EFE6` light** (moon, dawn line, lamps, windows; never yellow
  or orange), and **coral `#FF6F61` only on the scene's subject** (one coral thing per scene, the same rule as the coral tint on
  photos; a scene with no subject has none). Never orange (that's the tape), yellow, purple or a warm sunset. Only the time of day
  varies: where the cream light sits and how bright it is.
- **The QUIET ramp** for the heavy chapter (`sil_palette.py --quiet`): flatter grey-green fog, no glow, **no coral**.
- **Figures are ONE solid black shape**: no faces, no eyes, no light or see-through lines for collars, folds, buttons or seams, no
  rim light or glow. Only the outer outline carries information, in clear profile. (The Diamond Hoax figures had white interior
  lines; not any more.) Thin light lines that slip in are filled with `tools/sil_solidify.py`.
- **Anonymous.** A real person with no photo is an anonymous silhouette, labelled once in mono with `NoPhoto` (`src/kit/print.tsx`:
  "REI MINAMIMURA · NO PHOTO SURVIVES"), never presented as a likeness. No silhouettes of victims, before or after (§ Respect in
  `visual-style.md` §2.5).
- **Shown full frame in layered parallax** (`SilScene`, `src/kit/silparallax.tsx`), with motion inside: mist drifting between the
  planes (the palette's sage haze), dust motes in a lamp beam (`dust`), a cut-out riding a plane (`insert` + `PlaneImg`: a balloon
  that rises on its own). **No container**: a kamishibai paper stage on the desk and a shadowbox diorama around the screen were both
  prototyped and turned down (`projects/Balloon_War/src/test/PaperStage.tsx`, `ShadowBox.tsx`; `review/paper_stage_test.mp4`,
  `shadow_box_test.mp4`). Silhouettes keep their own colours: no grayscale, no coral added, no source tag.

**The prompt: one ordered Google Flow prompt for the whole set.** Write a single prompt that covers every scene in order
(`FLOW_PROMPT.md` is the model): the output rules (16:9, highest resolution, exact file names, no border), the style (flat bands
front to back: ink foreground with detail only in the outline, two or three hazier distance layers each with a mist band at its
base, a quiet sky), **the figure rule** in capitals, **the palette with hex codes**, composition rules that make the split work
(3–4 clearly separated depth bands, figures small and in profile and not tangled, everything important inside the central 80%, one
light source, no light rays over the foreground), period accuracy, **no text of any kind**, no real person, and then the shots.
Image 1 is the master style reference; later shots name it, and any earlier shot they share a place with, as references, so the
style and the locations carry across the whole set. (Gemini at 2K with the same paragraph per scene also works:
`tools/gemini_image.py`, `SIZE=2K`.)

**The pipeline, per scene**
1. **Fix what the model got wrong** before anything else. A Fu-Go paper balloon came back as a teardrop (a hot-air-balloon
   shape); it was redrawn round in cut paper (`projects/Balloon_War/tools/round_balloon.py`) and pasted over. Keep a fixed copy in
   `public/img/gen/scenes/plates/<name>.jpg` (a plate without a figure that will move on its own goes there too).
2. **Upscale 2×**: `tools/upscale_all.sh` (Real-ESRGAN x4plus ONNX, `tools/upscale.py`, about a minute an image on CPU) →
   `public/img/gen/scenes/2x/`. The parallax push needs the pixels.
3. **Lock the palette**: `python3 tools/sil_palette.py in.jpg out.jpg` (`--quiet`, `--accent=none`): a gradient map onto the ramp
   above, warm saturated pixels to coral. Lock before splitting so every plane is in palette. Check at full size that nothing is
   coral except the subject.
4. **Split by colour and region, not by depth**: `python3 tools/sil_regions.py <name>` with one recipe per scene (or `--ink` /
   `--tiers=` for a quick start). Depth splitting (`sil_layers.py` + Depth Anything) **tore objects in half**: a window's bars on
   two planes, a man's head on one and his body on another, tree trunks fading from near at the foot to far at the top, lamps cut
   from their light cones; the halves slid apart when the camera moved, and rims left ghost outlines behind. The rules:
   - **each object whole on one plane** (the man with his desk; the girl with her table and the sheet on it);
   - **a continuous structure on one plane** (a corridor's walls, floor and door; a fence with its posts; a press with its paper);
   - soft things stay with what makes them (smoke with its chimney, a lamp with its cone), or everything misty stays on the back plate;
   - **empty bands are fine**: most scenes need two or three real planes; the unused ones are written empty.
   The first colour split was `projects/Balloon_War/tools/bw12_layers.py`; its fourteen recipes are in that project's
   `tools/sil_regions.py` (copy the patterns, not the coordinates), and `tools/split_all.sh` there records how each scene was made.
   `sil_layers.py` (now with `SOLID=1`) stays for a scene whose depth split passes the stress test as it is.
5. **Stress-test the planes**: `python3 tools/sil_stress.py <name>` shifts each plane 12, 24 and 36 px per step of depth, both
   ways, and lays the six results on one sheet (`out/stress/<name>.jpg`). Look at every tile: anything that tears, doubles, leaves a
   dark outline beside its shape or opens a hole gets its recipe fixed. Ship a scene only when all six tiles are clean.
6. **Build** with `SilScene` (the `size` and `bands` from `layers.json`), a camera move that suits the line, and the motion layers.

**Props on the black desk (the same video).** Gemini props (`gemini-3-pro-image`, 2K, 1:1, the prompt saved beside each source in
`public/img/props/src/<name>.txt`) are shot as **white or pale objects on black** when they are light (paper, a crane, a card):
`tools/prop_cut_black.py` keys them from brightness, keeps the largest object and fills small holes. Others on white go through
`tools/prop_cut.py`; `FILL_HOLES=1` puts back the enclosed pale parts rembg drops (a barometer's dial, the paste in a pot). Shown
with `Prop` (B&W; coral is a **see-through** tint, never a flat red block). Check each against the period (a barometer came back
with two clock hands, a sandbag in cloth when the real ones were paper, a round Western pastry brush): retake, don't excuse.
Never presented as a specific real artifact; no source tag. Archival photos go down as `Print`s (`src/kit/print.tsx`): B&W, no
mount or frame, a deep shadow, a slap with a little overshoot, the source tag under the print.

