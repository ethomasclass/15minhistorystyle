# Brand

## Logo

The logo is the **15 MINUTE HISTORY wordmark**: a hand-drawn teal clock with a coral quarter hour swept in and a cream "15",
then MINUTE on a torn orange strip and HISTORY in teal over an orange underline. All of these files were rendered from the channel's
own intro code (`src/kit/Intro.tsx`, `src/Brand.tsx` in the template), so they match the videos exactly.

| File | Size | Use |
|---|---|---|
| [`logo/wordmark.jpg`](logo/wordmark.jpg) | 1920×1080 | The wordmark on the dark desk, as the intro ends |
| [`logo/wordmark-transparent.png`](logo/wordmark-transparent.png) | 1920×1080, transparent | Over pictures, slides, documents |
| [`logo/avatar.png`](logo/avatar.png) | 800×800 | YouTube profile picture (YouTube crops it to a circle; the clock fits inside) |
| [`logo/clock-transparent.png`](logo/clock-transparent.png) | 800×800, transparent | The clock mark alone |
| [`logo/watermark.png`](logo/watermark.png) | 150×150, transparent | YouTube video watermark (Customization → Branding) |
| [`logo/banner.jpg`](logo/banner.jpg) | 2560×1440 | YouTube channel banner. The wordmark sits inside the 1546×423 area that shows on every device. |
| [`logo/square.jpg`](logo/square.jpg) | 1080×1080 | Social posts |
| [`logo/channel_intro.mp4`](logo/channel_intro.mp4) | 4.4 s | The channel intro with the title sting (the five flip cards change per video; these are the template's demo pictures) |
| [`logo/chapter_logo_break.mp4`](logo/chapter_logo_break.mp4) | 2 s | The quiet logo break that opens chapters 2+ |

To re-render at another size, add an entry to `BRAND` in the template's `src/Brand.tsx` and run
`node tools/brand.mjs out/brand`.

**Logo rules**
- Thumbnails put the wordmark small in the top-left corner.
- Don't recolour it. Teal, orange, coral and cream are the whole mark.
- On a light background, put it on a dark panel; the cream "15" disappears on white.

## Colour

One job per colour. That rule is the whole look.

| Colour | Hex | Job |
|---|---|---|
| **Teal** (mark) | `#2FE0C4` | Everything drawn: outlines, loops, arrows, handwriting, map routes and pins |
| **Orange** (box) | `#FF9F1C` | Torn title strips, and nothing else (plus the wordmark underline and strike-throughs) |
| **Coral** (subject) | `#FF6F61` | The one subject in each image; the clock's quarter hour |
| **Ink** | `#111111` | Type on the orange strip; the outline around handwriting |
| **Bone** | `#EDE7DC` | Title strips in heavy (`quiet`) chapters, which have no orange and no coral |
| **Cream** | `#F4EFE6` | Photo-card borders, the "15", quotes |
| **Desk** | `#2a2620` → `#16140f` → `#0d0c09` | The background: a warm near-black radial gradient with faint ruled lines |

Pictures are **black and white** with the contrast boosted (`grayscale(1) contrast(1.2)`), plus film grain at 13% and a soft vignette.
Machine-readable values: [`palette.json`](palette.json). For web pages and slides: [`palette.css`](palette.css) (CSS variables + Google Fonts).

## Type

| Face | Use | Rule |
|---|---|---|
| **Abril Fatface** | Titles, the wordmark, big numbers | UPPERCASE, on the orange strip, tilted about −2° |
| **Nanum Pen Script** | Handwritten notes | lowercase and conversational; render at 1.55× the nominal size (it runs small) |
| **Playfair Display 900** | Primary-source quotes | Sentence case, cream, curly quotes |
| **Inter 600 / 800** | Definition bars / map symbols | Sentence case |
| **IBM Plex Mono** | Source tags, counters | UPPERCASE, 18 px, 1 px letter-spacing |

The font files are in [`fonts/`](fonts/). All six are free Google Fonts (SIL Open Font License), so they can be used anywhere.

## Thumbnails

Every thumbnail made so far is in [`thumbnails/`](thumbnails/). The one marked ★ is the one that was uploaded.

| Video | Thumbnail | Headline |
|---|---|---|
| Fix Everything | ★ [`01_Fix_Everything.png`](thumbnails/01_Fix_Everything.png) | "The Time America Wanted to" / FIX / EVERYTHING |
| The War Nobody Won | ★ [`02_War_Nobody_Won.jpg`](thumbnails/02_War_Nobody_Won.jpg) | toy-theater look, before the channel look |
| Ambrose Bierce | [`A`](thumbnails/03_Bierce_A.png) · [`B`](thumbnails/03_Bierce_B.png) · [`C`](thumbnails/03_Bierce_C.png) (choice not recorded) | WALKED OFF THE MAP · 7 LIVES · WHERE DID HE GO? |
| King Andrew | ★ [`A`](thumbnails/04_King_Andrew_A.png) · [`B`](thumbnails/04_King_Andrew_B.png) · [`C`](thumbnails/04_King_Andrew_C.png) | HERO / OR KING? (split teal/coral portrait, drawn crown) |
| Grip Tighter | [`A`](thumbnails/05_Grip_Tighter_A.png) · ★ [`B`](thumbnails/05_Grip_Tighter_B.png) | SLAVERY WAS SUPPOSED TO FADE… / "then came cotton." |
| Good Luck (Ouija) | ★ [`06_Good_Luck_Ouija.png`](thumbnails/06_Good_Luck_Ouija.png) | WHO MADE IT / SCARY? (full-colour painting; breaks the usual rules) |

**The formula** (full rules in
[`thumbnail-and-youtube.md`](../.claude/skills/15-minute-history/references/thumbnail-and-youtube.md)):
- 1280×720, built in `src/Thumbnail.tsx` from the video's own kit. Make 2–3 concepts and let the user pick.
- One B&W image, big, with **one coral-tinted, teal-traced subject**.
- 2–4 words in Abril Fatface on torn orange strips, plus an optional small teal handwritten setup line.
- The headline is a question or a paradox: HERO OR KING?, WHERE DID HE GO?, WHO MADE IT SCARY?
- The wordmark goes small in the top-left. Keep the bottom-right corner clear, because YouTube's duration badge covers it.
- The whole head stays in frame, and text never covers a face.
