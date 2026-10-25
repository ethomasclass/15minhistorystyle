# AI images · chapter 7 (3 new)

Gemini 2.5 Flash Image (`gemini-2.5-flash-image`, 1:1), lithograph master style (../LITHO_PROMPT.md STYLE + RULES, with a prop-sheet paragraph instead of the composition paragraph), generated on plain white, weathered with `tools/weather.py --preset light --no-crease`, masked with `tools/mask.py` (jobs in `tools/mask_jobs/ch07.py`). Raw PNGs and prompts: `review/ai_ch07-09/`. No on-screen tag (the user's rule); recorded in `public/img/credits_ch07.json`.

| File | Used in | Notes |
|---|---|---|
| `public/img/ch07/ai_stock_certificate.jpg` | "handed out shares" (three certificates fan in beside Ames) | mask = bounding rectangle (rembg hollowed the blank centre): `tools/traces/c7_certificate_rect.json` |
| `public/img/ch07/ai_coins_notes.jpg` | the money loop, under "$$$ far more than it cost" | shown small; one coin carries an illegible date that would read as an anachronism if zoomed — keep it small |
| `public/img/ch07/ai_whiskey_barrels.jpg` | the Whiskey Ring tax diagram | rembg mask clean |

### `p7_stock_certificate`

```
A single 1860s American railroad company stock certificate lying flat, seen from straight above: an ornate engraved border, a small vignette of a steam locomotive at the top, a round seal, blank decorative panels.

STYLE: a tinted lithograph printed in the 1860s, like the plates in the Pacific Railroad Survey reports or a Harper's Weekly supplement. Soft crayon-grain shading drawn on stone in black, plus a limited palette of two or three muted tint stones only: pale buff ochre, slate blue-grey and a faded brick red, laid in flat areas and slightly out of register with the black. The paper shows through as the highlights. Muted, faded, low saturation; never bright; no modern colour grading.

PROP SHEET: the object alone, whole, centred with a wide margin, isolated on a plain flat pure white background, no ground, no cast shadow, no other objects.

RULES: historically accurate for the 1870s United States; nothing modern. No text, letters, numbers, signatures or monograms anywhere (any lettering is replaced by illegible engraved flourishes). No frame, border or vignette. No people.
```
### `p7_coins_notes`

```
A small loose pile of 1870s American gold coins and a few folded generic banknotes with ornate engraved patterns, seen from slightly above.

STYLE: a tinted lithograph printed in the 1860s, like the plates in the Pacific Railroad Survey reports or a Harper's Weekly supplement. Soft crayon-grain shading drawn on stone in black, plus a limited palette of two or three muted tint stones only: pale buff ochre, slate blue-grey and a faded brick red, laid in flat areas and slightly out of register with the black. The paper shows through as the highlights. Muted, faded, low saturation; never bright; no modern colour grading.

PROP SHEET: the object alone, whole, centred with a wide margin, isolated on a plain flat pure white background, no ground, no cast shadow, no other objects.

RULES: historically accurate for the 1870s United States; nothing modern. No text, letters, numbers, signatures or monograms anywhere (any lettering is replaced by illegible engraved flourishes). No frame, border or vignette. No people.
```
### `p7_whiskey_barrels`

```
Three oak whiskey barrels with iron hoops, two standing upright and one lying on its side in front, seen from a three-quarter view.

STYLE: a tinted lithograph printed in the 1860s, like the plates in the Pacific Railroad Survey reports or a Harper's Weekly supplement. Soft crayon-grain shading drawn on stone in black, plus a limited palette of two or three muted tint stones only: pale buff ochre, slate blue-grey and a faded brick red, laid in flat areas and slightly out of register with the black. The paper shows through as the highlights. Muted, faded, low saturation; never bright; no modern colour grading.

PROP SHEET: the object alone, whole, centred with a wide margin, isolated on a plain flat pure white background, no ground, no cast shadow, no other objects.

RULES: historically accurate for the 1870s United States; nothing modern. No text, letters, numbers, signatures or monograms anywhere (any lettering is replaced by illegible engraved flourishes). No frame, border or vignette. No people.
```
