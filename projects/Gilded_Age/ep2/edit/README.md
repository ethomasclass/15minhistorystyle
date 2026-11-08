# Episode 2 edit: "The Ball and the Basement", cut to the narration

Built the same way as Episode 1 (`../../ep1/edit/README.md`): each chapter is a list of shots drawn with the look-dev kit
(`../../lookdev/`, including `mansion.js` and `ep2_more.js`), cut on the voiced narration's word timings
(`../public/audio/<chapter>.words.json`). Re-voice a chapter and the cuts follow the words.

| File | What it does |
|---|---|
| `edit.html` | Loads the look-dev scripts (with `mansion.js`, `ep2_more.js`), `edit.js`, `ch01.js` to `ch08.js`, `title.js`, `brand.js` |
| `edit.js` | Copied from Ep 1 (`wordAt`, 0.3 s crossfades, 12 fps desk stepping, `deskCut`, `vocabCard`, `remap`, `drawLine`, clock), plus Ep 2 pieces: `push` (desk with a slow push), `bigFig` (money in Abril), `today` (the teal "today's money" tag), `quote`, `callCard` (drawn calling cards and invitations, with a strike-through), `twoScenes` (split screen), `tick`/`cross`, `dimBy`. `LIVE` covers the Ep 2 scene renderers so they stay smooth at 30 fps |
| `ch01.js` ... `ch08.js` | The chapters; each shot is commented with its narration |
| `title.js` | Chunk intro + "The Gilded Age / The Ball and the Basement / episode 2 of 6" (intro frames from `ep1/public/img/intro/`) |
| `brand.js` | The 2 s mark snap and the 20 s end screen (as Ep 1) |
| `render_edit.mjs` | `node render_edit.mjs ch01 --stills 3,9.5 <prefix>` for check stills; frames otherwise |
| `build_ch.sh` | As Ep 1; a cue not in `../public/music/` is taken from `../../ep1/public/music/` (the series theme) |
| `assemble.sh` | ch01, title, ch02, mark snap before each of ch03 to ch08, end screen; two-pass loudnorm to -14 LUFS; 540p preview |
| `../tools/` | Copies of Ep 1's `bust_cut.py`, `crease.py`, `prop_cut.py`, `prop_cut_black.py`, `prop_fix.py`, writing to `../public/img/desk/` |

## Music (beds 17 LU under the voice: volume = 10^((-35 - cue LUFS) / 20))

| Chapter | Cue | LUFS | Volume |
|---|---|---|---|
| ch01 The Ball | `ga_the_ball` from 0:00 | -14.6 | 0.095 |
| ch02 New Money | `ga_new_money` | -14.1 | 0.090 |
| ch03 The Party | `ga_the_ball` from 1:25 (after the muffled break, the full waltz returns) | -14.6 | 0.095 |
| ch04 The Basement | `ga_below_stairs` | -14.6 | 0.095 |
| ch05 Survival of the Fittest | `ga_fittest` | -16.5 | 0.119 |
| ch06 Sunday | `ga_sunday` | -15.3 | 0.104 |
| ch07 The Gospel of Wealth | `ga_gospel_of_wealth` | -14.2 | 0.091 |
| ch08 Rags to Riches | `ga_gospel_of_wealth` from 1:15 to "So, what did the richest people" (31.6 s), then `ga_gilded_theme` from 66.2 s in | -15.4 | 0.105 |
| end screen | `ga_gilded_theme` carries on from 99.8 s, so its final chord lands on the end screen | | 0.105 |

Placement is from the loudness profile of each cue (short-term LUFS every 5 s), not from listening; check by ear.

```
./build_ch.sh ch01 ga_the_ball 0.095
./build_ch.sh ch02 ga_new_money 0.090
./build_ch.sh ch03 ga_the_ball@0.095@0@85
./build_ch.sh ch04 ga_below_stairs 0.095
./build_ch.sh ch05 ga_fittest 0.119
./build_ch.sh ch06 ga_sunday 0.104
./build_ch.sh ch07 ga_gospel_of_wealth 0.091
./build_ch.sh ch08 ga_gospel_of_wealth@0.091@0@75@31.6 ga_gilded_theme@0.105@31.6@66.18@66.72
./assemble.sh
```

## Desk assets (`../public/img/desk/`)

- Flow props: 15 of the 16 takes, cut on white (`prop_cut.py`) or black (`prop_cut_black.py`); the card case and the bell plate
  restored with `prop_fix.py fill`; the cockroach cropped to the insect (no label); `p04_coins_wages` dropped (it shows a
  Washington quarter and a modern dime); Ep 1's `p06_coins_stack` is used for Nora's pay instead.
- Cut-outs (`bust_cut.py`): Alva and Alice Vanderbilt (Mora, 1883), Mrs. Astor, Spencer (1889, Wellcome, CC BY 4.0: credit it),
  Sumner (1902), Carnegie about 1885 (from Ep 1's Brady photo). Prints (`crease.py`): Leslie's cover, Puck's "Our Imitative
  Aristocracy", 660 Fifth Avenue (street, entrance, grand staircase, Hunt's basement plan), the Braddock library, Mayflower and
  Galatea (1886), a Riis tenement flat. Credits: `../public/img/credits_ref.json`.

## Rules kept

- Word anchors count every occurrence, case-insensitive ("the", "and", "in", "they", "an", "what" repeat). Listed before choosing n.
- Vocab cards for every {term}: old money, new money, the 400, calling card, quadrille, domestic servant, live-in, survival of
  the fittest, Social Darwinism, the Gospel of Wealth, philanthropy, trustee, rags to riches.
- Today's-money tags: $250,000 ≈ $9 million (ch1, ch3); $65,000 champagne ≈ $2.3 million (ch3); $3.60 a week ≈ $130 a week
  (ch1, ch4). Nora's arithmetic drawn in ch4: $250,000 ÷ $187 a year = 1,337, "more than 1,300 years", then the Vikings timeline.
- "COMPOSITE CHARACTER" bar from Nora's first appearance (ch1, in the kitchen) and whenever the Kellys are on screen.
- Coral only for the Kellys; real people only as photographs (in the drawn sets they are silhouettes, costume outline only).
- No em dashes in any on-screen text.

## Changes made to the look-dev for the edit

- `renderFifth`, `renderBall`, `renderBallpark`, `renderFlat`, `renderLeisure` take `quiet` (drop the clip's own notes so the edit's
  notes and stamps go on instead).
- The Kellys' flat tag read "Lower East Side"; it now reads "Brooklyn" (Ep 1 puts the Kellys in Brooklyn, and Nora takes the ferry home).
