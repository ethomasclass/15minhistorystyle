# The character model (`rig.js`)

One file draws every person in the Gilded Age series. Load it before any scene file. Everything is a pure function of time, so a
scene renders frame by frame (Playwright today; in Remotion, put the returned SVG string in an `<svg>` or `dangerouslySetInnerHTML`).

## Draw someone

```js
figure({x, y, h, d: 1, kind: 'man', hat: 'bowler', coat: 'sack', fill: '#0D0C09',
        an: POSES.stand(t, 0.3), det, rim, tones, wear: [], prop: null})
cast('mother', {x, y, h, d: -1, an: POSES.stir(t)})   // a recurring character, ready-made
```

- `x, y`: where the feet are (screen px). `h`: height in px. `d`: facing, `1` right, `-1` left.
- `kind`: `man`, `woman`, `boy`, `girl`. `hat`: `bowler`, `top`, `cap`, `boycap`, `lady`, `kerchief`, `maid`, `kippah`, `none`.
- `coat` (men): `frock`, `sack`, `jacket`, `vest` (shirtsleeves). `beard: true`.
- `wear`: `plain` (a working skirt, no bustle), `shawl`, `apron`, `bib` (with `apron`: a maid's apron), `knickers` (knee breeches).
- `prop` in the front hand: `glass`, `iron`, `spoon`, `hammer`, `paper`, `needle`, `bowl`; also `pail: true`, `basket`, `papers`,
  `cane`, `parasol`. `lie: true` lays the figure down (feet at `x, y`, head toward `-x` when facing right).
- `an` (animation): `lean`, `bob`, `tilt` (head; + looks up), `fArm`/`bArm` `[shoulder, elbow]`, `legs` `[a, b]`, `shins`,
  `hatInHand`, `expr` (`neutral`, `smile`, `worried`, `awe`, `set`), `blink`. Angles: degrees from straight up, + toward the face.
- `det` and `rim`: detail follows size on screen. Use `lodFor(h * zoom)` -> `{det, rimA}`: a solid shape when small, a rim of light
  from about 140 px tall, the face and clothing detail from about 520 px.

## Poses (`POSES.name(t, phase)`)

`stand`, `sit`, `stir`, `sew` (at a treadle machine), `handsew`, `iron`, `drink`, `wipe`, `hammer`, `rock`, `read`, `sleep`.
A sitting figure's feet go at `fy + 0.22 * h` (`sitY` in `cutaway.js`) so the seat lands on a chair.

## Walking

`walkAn(walkPhase(distance, h), {stride, carry})`: each foot stays planted while it is down, so feet never skate. Move the figure
by the same `distance`. Characters animate at the full frame rate (`SMOOTH_MOTION = true`); set it to `false` for 12-a-second steps.

## The cast

| Key | Who | Look |
|---|---|---|
| `michael` | the Kellys' eldest, 19, a refinery worker | cap, short jacket; coral |
| `mother` | his mother | kerchief, shawl, apron, plain skirt; coral |
| `sister` | his sister, a maid on Fifth Avenue (ep 2) | maid's cap, bib apron, plain skirt; coral |
| `brother` | his younger brother, later a ward heeler (ep 4) | boy's cap, sack coat, knee breeches; coral |
| `nfather`, `nmother`, `nson`, `ndaughter` | the Jewish neighbour family (ep 3) | skullcap, beard, shirtsleeves and vest; kerchief, apron |

Names are still to be decided, so the keys are roles. The Kellys are coral (the subject colour); everyone else is ink.
Sheets: `sheets/8_round5.jpg` (the cast and the poses), `sheets/7_round4.jpg` (the five expressions).

## Added for Thanksgiving (Nov 2026)

- **1621, Wampanoag man:** `{kind: 'man', hat: 'longhair', wear: ['breechcloth', 'barefoot']}`, plus `'mantle'` (a deerskin over the far
  shoulder). Bare torso, a belt, a breechcloth with a flap before and behind, bare legs, hair long behind and short before. Kept
  plain on purpose (no feathers, no paint). Sources: Plimoth Patuxet Museums, "What to wear" (the breechcloth as the basic garment,
  leggings tied to its belt in cold or brush, mantles in cool weather); Mourt's Relation, 1622, on hair. Use `det: 0`.
- **1621, English colonist:** `{kind: 'man', hat: 'felt', coat: 'doublet', wear: ['breeches']}`: a doublet with a short skirt, full
  breeches to the knee, stockings, a plain linen falling band (pale, `tones.lite`), a broad felt hat. No buckles.
- **About 1800, dock labour:** `hat: 'felt'` or `hat: 'knit'` (a seaman's cap) with `coat: 'vest'`.
- **1950s hostess:** `{kind: 'woman', hat: 'set50', wear: ['fullskirt', 'apron']}`: a full mid-calf skirt, calves and court shoes, a
  half apron with a bow, short set hair. `paleOp: 0.96` draws pale cloth at full strength (a bright room).
- `street.js` `wagon(..., dir, {hat, coat})`: the driver's dress.
- The new outlines have no close-up detail pass: keep `det: 0` with them.
