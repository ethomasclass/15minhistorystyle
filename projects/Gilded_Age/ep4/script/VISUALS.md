# Episode 4 visuals plan (draft 1)

Colors as always: Kellys coral `#FF6F61`; Rabinowitzes wheat gold `#E2B864`; everyone else ink; teal explains; orange torn strips and
handwriting. **New for Ep 4:** money is a small warm-gold glint (the captain's watch chain, coins, padded bills), never a fill colour for
people. Real people never get faces (Tweed, Nast, Plunkitt, McLaughlin, Low, Riis: archival only, or faceless silhouettes from behind).
Violence and fire stay off-screen as glow, smoke and reflections; nobody is shown burning or hurt.

## A. Silhouette scenes (drawn sets, rig.js, Episode 1 walk cycle)

| ID | Chapter | Set and action | Notes |
|---|---|---|---|
| `ep4_fire` | 1 | Williamsburg street, night, snow falling. The burning tenement is seen as orange glow in its windows and smoke rising (flames never on people). Families in nightclothes on the street, a child with shoes in her hands, Mrs. Doyle with a baby. A horse-drawn steam pumper gallops in (horses: Ep 1 horse rig, sparks from the stack). Then the captain and three men stride in; the captain wraps a blanket around Mrs. Doyle and points the family toward a waiting cab. Michael (coral) on his stoop; the captain turns, tips his hat to him. | The hero scene. Captain silhouette: long coat, bowler, a gold glint of watch chain. Dialogue acting as Ep 3 ch 1 (speaker-driven gestures, push-in on his line). Snow + glow make it read at a glance. |
| `ep4_kelly_flat` | 2, 8 | The Kellys' kitchen (Ep 2 kelly_flat set, winter): Ma, Michael, Tommy (coral, smaller, quick), an empty coal bucket by the stove. Ch 8: the bucket full, Tommy bursting in with the job offer, Michael at the window looking toward the refinery stacks. | Re-introduces the family in two lines (ch 2). Ends the episode (ch 8). |
| `ep4_coal` | 5 | Outside the tenement, morning: a coal wagon at the curb, a man shovels coal down the cellar chute (dust puffs), Ma watching from the doorway; the captain tips his hat and walks on. | Short (4 to 6 s). Sound: coal rattling down the chute (on screen). |
| `ep4_clubhouse` | 5 | The ward club: a back room behind a saloon, gaslight. The captain at a table with a ledger; a line of people waiting for favors (a mother with a letter, an old man, a young man with his cap in his hands); Tommy darting in with a message and out again. On the wall, an empty frame (the boss, faceless). | Shows "favors for votes" without words; Tommy's job. |
| `ep4_papers` | 5 | The hallway of the Kellys' building (Ep 3 knock set): Yankel (gold) holding papers, Rivke translating, the captain nodding kindly: "Tell your father we'll help with his papers." | 5 to 8 s; reuses Ep 3 rigs. |
| `ep4_vigo` | 6 | A sunny dock in Vigo, Spain, 1876: two officials hold up a newspaper cartoon and look from it to a large man in a hat stepping off a gangplank (Tweed, faceless, from behind). They step in front of him. | Gentle comedy beat; the real Nast cartoon "Tweed-le-dee and Tilden-dum" appears as the insert. |
| `ep4_bootblack` | 7 | A courthouse rotunda (the Tweed Courthouse interior, simplified): a shoeshine stand, a man in a top hat seated high on it, seen from behind, talking; a younger man with a notebook (the reporter) writing. Plunkitt's quotes appear as handwriting. | Real person: faceless and from behind; archival portrait for identity. |
| `ep4_polls` | 8 | Election day, November 1887: a polling place in a barbershop, a line of men. Tommy outside handing out the party's printed ballot (before the secret ballot, parties printed their own tickets, colours easy to spot). Michael takes one, looks at it. | Accurate detail: New York adopted the secret ballot in 1890 [VERIFY]. |

## B. Non-silhouette visuals

### 3D city model (`ep3_map.js`, the user's favourite; reuse heavily)
- **The fire dive (ch 1):** from the night city down to the glowing block in Williamsburg, into `ep4_fire`.
- **Brooklyn grows (ch 2):** blocks fill in decade by decade, 1870 → 1890, the bridge lands, the river traffic thickens.
- **The machine network (ch 5, signature shot):** wards outlined on the model; a captain dot on each block, lines up to the ward boss,
  up to the boss. Favors flow down as small gold glints; votes flow up as teal pulses. Callback: the fire block lights up.
- **Two cities (ch 6):** the camera crosses the river to Manhattan for Tammany: "across the river" made literal.

### Blender hero shots (lookdev test: `../../lookdev/blender/`; 3 shots, 5 to 10 s each, rendered in the background)
1. **City rising, 1870 → 1900 (ch 2 or 3):** buildings grow from the ground at dusk; elevated tracks and trolley wires appear; haze thickens.
2. **The crowded street (ch 4):** slow eye-level push through a crowded, filthy tenement street: laundry lines, mud and manure, pushcarts,
   gas lamps in haze; our own drawn silhouettes as cut-out people so it matches the series.
3. **The courthouse (ch 6):** scaffolding and the courthouse rising while padded bills pile up and the cost counter climbs past the
   $250,000 line to $13 million.

### Diagrams (teal explains, `ep4_explain.js`)
- `ep4_urban`: people icons, 1 in 4 → 4 in 10 (1870 → 1900); a US map with dots for cities over 100,000 multiplying from 14 to 38.
- `ep4_chicago`: bars for Chicago and Brooklyn, with a small "annexed 1889" note.
- `ep4_frame`: a cutaway of a tall building: elevator car in its shaft, iron frame carrying the floors, the walls hung on it.
- `ep4_rings`: a streetcar map: lines radiating from downtown; houses along the lines are larger and farther out ("who can pay the fare").
- `ep4_tenement`: reuse Ep 3 `ep3_tenement_plan` (one sink per floor, privy in the yard).
- `ep4_horses`: counters (175,000 horses; 3 to 4 million pounds a day; 15,000 dead horses a year), with small horse icons.
- `ep4_relief`: a bar for 1877 (46,350 people helped) that drops to zero in 1878; the squirrel quote as a printed clipping.
- `ep4_pyramid`: captain → ward boss → boss, favors down, votes up (pairs with the 3D network).
- `ep4_ledger`: the courthouse ledger page: $250,000 limit stamped, then thermometers $7,500, carpets $675,534.44, plasterer $138,187
  (two days), the total climbing to $11 to 13 million; the chairs line in ch 1 as "the books showed."
- `ep4_graft`: Plunkitt's park: a map with a swamp; he buys it (coins), the park plan lands on it, the city pays him (more coins).
- `ep4_scorecard`: two columns, HELPER and THIEF, filling with icons as ch 8 is read (no verdict line).
- `ep4_civil`: a civil service exam card ("passed a test, not voted the right way").

### Archival (see `../research/IMAGES.md` when collection finishes)
Nast cartoons ("Who Stole the People's Money?", "The Brains", "Tammany Tiger Loose", "Tweed-le-dee and Tilden-dum"), the Tweed
Courthouse, Tweed and Plunkitt portraits, the 1871 *Times* pages, Riis photographs (framed), elevated railways, the Brooklyn Bridge,
the Home Insurance Building, fire engines, an 1880s election day, Brooklyn City Hall, Seth Low. Caricatures (Nast's Irish
caricatures) brief and framed by narration.

## C. Sound notes
- Beds: winter night street with fire bell far off (ch 1), the clubhouse murmur (ch 5), a busy 1880s street with horses (ch 4).
- Spots only for things on screen: the fire bell, horses' hooves and the pumper's bell, coal down the chute, a ledger stamp.
- Dialogue placed in rooms as Ep 3 (outdoor: no reverb).
