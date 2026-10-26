# Build notes: Ch03 · The Long Drive

`src/ch/Ch03.tsx` (`Ch03`, `CH03_FRAMES`), masks `src/masks_ch03.ts`, helpers in `src/kit/ch02_extra.tsx`. Contact sheet:
`review/stills/ch03_sheet.jpg` (28 frames).

## The map (the spine)
One `Trails` layer used by every map shot, so the trails accumulate: the Kansas Pacific (pale rail), the **Shawnee faint and unnamed**,
the **Chisholm** (`MTrail`, coral with `MHerd` walking it, 5 s draw from "Chisholm Trail" to "Abilene"), the **Western** to Dodge City
(coral on its beat, then teal), and the **Goodnight-Loving** west across Texas and up the Pecos to Fort Sumner (only that far; the
Colorado/Wyoming extension is left for later episodes). The Pecos is drawn as a thin river line with a label; New Mexico lit faintly.
After "Hold onto that one" the Goodnight-Loving stays coral and the others dim.

## Scenes
1. McCoy's plate of a herd on the trail (1867), **THE LONG DRIVE**, "the most famous roads in America".
2. Gardner 1867, cattle fording the Smoky Hill: "none of them were **roads**".
3. "Watch the map": **THE CHISHOLM TRAIL** drawing on with the longhorn · 4. Indian Territory lit ("today's Oklahoma"), Definition.
5. **THE WESTERN TRAIL**, "farther west" · 6. "another way entirely" · 7. **THE GOODNIGHT-LOVING TRAIL** draws west then north, Pecos.
8. "hold onto **that one**" (coral).
9. "Picture one drive": a dark numbers card over Harper's 1874 herd: ≈ 2,500 cattle · 10–12 men · 10–15 mi a day · 2–3 months
   (rows slap in on their words) · 10. the card on the desk with the longhorn prop, "for two or three months".
11. The crew as a drawn formation on the desk (diagram, labelled): the herd strung out, up front the trail boss (saddle prop),
    the cook and his wagon (p4_chuck_wagon, coral) · 12. pan to the back: dust cloud, lariat, "the newest riders · eating dust all day".
13. **THREE THINGS** could end a drive.
14. 1/3 · a stampede: McCoy's "midnight storm and stampede" plate · 15. "Heading a stampede" (1888) print, a hard shake on "thunder",
    "the whole herd **runs**".
16. 2/3 · rivers: McCoy's "swimming a river" plate · 17. L3 river-crossing plate, "cattle and men drowned at the crossings".
18. 3/3 · whose land it was: Indian Territory lit coral on the map · 19. closer: "CHEROKEE NATION and other nations", a toll pin on
    the Chisholm, a few longhorns at it, "sometimes paid in cattle".
20. "OVER ABOUT TWENTY YEARS · **5–10 million**": longhorns walking the Chisholm and Western again and again.
21. Hand-off: the Goodnight-Loving glows coral with a longhorn walking it: "one pair of ranchers went **the other way**",
    "best customer: the U.S. Army"; held into the tail.

## Music
`m_frontier` (`// SUNO: aw_long_drive replaces this`). The cue is only 69 s, so a second pass from 12 s in crossfades under the
toll beat (≈ 65–67 s).

## Images
Image agent (`credits_ch03.json`): McCoy's plates (Newberry/IA), Gardner's Smoky Hill stereo, Harper's "guarding the herd",
"Heading a stampede" (1888). Three McCoy plates were scanned upside down; I saved turned copies `ch03/b_mccoy_herd_on_trail_1867.jpg`,
`b_mccoy_swimming_a_river.jpg`, `b_mccoy_midnight_stampede.jpg` (`credits_ch03_b.json`, same sources). AI (no tags): L3 plate,
p2_longhorn, p3_saddle, p3_lariat, p4_chuck_wagon.

## Still rough
- The formation diagram's longhorns are flat sprites lying on the tilted desk; it reads as a diagram, not a scene.
- The image agent also found an 1891 Matador Ranch chuck-wagon photo and an 1870s Kansas Pacific trail map after this build;
  either could replace the prop wagon or add a period-map beat.
- Trails are approximate polylines from `ep2_trails.json` (tagged "trails approx.").
