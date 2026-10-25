# AI image style for the West series: tinted lithograph

Chosen by the user from the style bake-off (`ep1/review/ai_tests/sheet_styles.jpg`): the **1860s tinted lithograph**, with
**some muted colour allowed** (a series exception to the black-and-white rule, like *Dressed to Kill*'s arsenic green).
Model: **Gemini 2.5 Flash Image** (the user preferred its looser, printed feel to Pro's cleaner, more "AI" look).
Post: **`tools/weather.py`** (halftone, slight misregistration, paper fibre, foxing, stains, a crease, worn edges).

## Rules that still hold
- AI only for real gaps (no photo exists); never a recognizable real person; a source tag on every image ("illustration").
- Coral is still the one subject colour on screen. The litho tints stay muted (buff, slate blue-grey, faded brick red) so
  coral and teal marks still pop. If a tint competes with the coral subject, desaturate that plate.
- Check every image for invented text, signatures and monograms (Flash adds them) and paint them out or crop.
- Crop off any border or rounded vignette that slips through.

## Prompt (scene first, then these three paragraphs verbatim)

```
STYLE: a tinted lithograph printed in the 1860s, like the plates in the Pacific Railroad Survey reports or a Harper's
Weekly supplement. Soft crayon-grain shading drawn on stone in black, plus a limited palette of two or three muted tint
stones only: pale buff ochre, slate blue-grey and a faded brick red, laid in flat areas and slightly out of register
with the black. The paper shows through as the highlights. Muted, faded, low saturation; never bright; no modern colour
grading.

COMPOSITION: casual and asymmetric, as if drawn from life. Figures at different distances and sizes, overlapping, some
partly cut off by the edge of the picture; never a neat row of identical figures.

RULES: historically accurate for the year and place; nothing modern. No text, letters, numbers, signatures or monograms
anywhere. No frame, border, margin, vignette or rounded corners: the picture runs edge to edge across the whole 16:9
image. No recognizable real person; faces turned away, small or in shadow.
```

Call: `generationConfig: {responseModalities: ["IMAGE"], imageConfig: {aspectRatio: "16:9"}}` (see
`ep1/review/ai_tests/litho_test.py`). About 4 cents an image.

## Post-processing

```
python3 tools/weather.py <in.png> <out.jpg> --preset light|medium|heavy [--seed N] [--no-halftone] [--no-crease]
```

Default for scenes: **medium** (visible halftone at 1:1, one crease, light foxing). Use **light** for images that get a
long push-in (the halftone grows with the zoom) and **heavy** sparingly, for an object meant to look handled (a poster,
a handbill). Note: halftone screens are anachronistic for an 1860s litho (they arrive in the 1880s); it's a deliberate
texture choice for the channel, not a period claim.
