# The Exact Spot components

Copied from `projects/Mexican_American_War/` (branch `claude/relaxed-lamport-62biq7`). The full project, with every chapter, is
in this repo. The skill template now ships `map3d.tsx`, `engraving.tsx`, the updated `parallax.tsx` and `shell.tsx`, and the tools
marked † below, so a new project already has them.

| File | What it is | Needs |
|---|---|---|
| `map3d.tsx` † | The tilted 3D map: `Map3D` (camera keys `{f, x, y, z, tilt, rot}`), `Slab`, `Fill`, `Border`, `PathText`, `Glow`, `Route`, `Flow`, `MovingBorder`, `Dot`, `Stand` (`Pin3`, `Stake`, `Flag3`, `PlaceTag`, `RegionName`, `Hand`), `StateTiles`, `Count`, and state groups (`FREE_1837`, `SLAVE_1846`, `UNION_FREE_1861`, `BORDER_1861`, `CONFEDERACY_1861`, `CESSION_STATES`, `MEXICAN_STATES(D)`) | A map JSON from `tools/build_map.py`; `../lib/anim`, `./Kit` |
| `maps/mex1846.json` | The map data used for the whole video: North America from Oregon to Yucatán, US and Mexican states, rivers, the Nueces and Rio Grande claim lines, the 1848 border, 36°30′, the Cession, Texas claims | Copy to `public/maps/` |
| `tools/build_map.py` | Builds that JSON from Natural Earth (public domain) with an Albers projection; historical borders are drawn from their legal descriptions (rivers, meridians, parallels), each with its source in a comment | Natural Earth GeoJSON (download list in the docstring) |
| `engraving.tsx` † | `Engraving`: a Flow wood engraving full frame, cropped only to 16:9, slow push, soft fade in and out, light vignette; `quiet` lowers contrast and drops the tint | `./Kit`, `./shell` (`fill`) |
| `parallax.tsx` † | Black Sox's Parallax plus `tintStrength` | `tools/layers.py` |
| `shell.tsx` † | ChapterShell with the music tail lift (`TAIL_LIFT` 1.6), longer `TAIL` (54) and `FADE` (18), per-cue `to` hand-overs, `extra` for the end screen, and `tintStrength` on CropCard | |
| `Thumbnail.tsx` | Four concepts: `Cutout` (a masked portrait with tint, trace and shadow), `SpotMap` (the strip on the 3D map), and D, the topic-led split-wash print | `map3d.tsx`, masks |
| `tools/layers.py` † | `LAYERS_FILL=paper`: for engravings, fill behind the subject with plain paper (a blurred inpaint shows as grey mush against crisp hatching), and fill holes inside the subject | |
| `tools/refine_mask.py` † | Clean up a rembg mask (`--close`, `--smooth`, drop specks, fill holes with padding so edge-touching subjects work) or combine it with hand traces (`--add`, `--sub`, `--keep`, `--only`) | template `trace.py`, `layers.py` |
| `tools/mask_closeup.py` † | Full-resolution check: each source cropped to its mask, teal outline beside the cut-out on grey | template `mask.py` JOBS |
| `tools/trace_grid.py` † | A crop with a labelled pixel grid (and the mask edge in teal) for reading off polygon points by hand | |
| `tools/text_lines.py` † | Finds the text lines on a scanned page (dark-row profile), so loops land on the right line | |
| `scenes/Ch03.tsx` | `Grievance`: a crop of a facsimile page on a card with a loop on one line and a handwritten label (4 at once = "MEXICO'S WRONGS") | project kit |
| `scenes/Ch05.tsx` | `TrapDiagram` (drawn ambush diagram), `Ambush` (the map plus the diagram inset), `Who` (broken-axis timeline), `Vote`, `TwoWeeks` (day counter) | project kit |
| `scenes/Ch08.tsx` | `Gold` (a glint clipped to a polygon on the picture), `Deal` (the Cession rising, half of Mexico sliding away, $15M), `Promises` (treaty articles highlighted / struck) | project kit |
| `scenes/Ch10.tsx` | `Vote` (free/slave tiles), `Acre` (the Cession "?"), `Appomattox` (heads kept in frame), `Thirteen` (the 1861 split, labelled), `EndScreen` | project kit |

## Using the 3D map

```tsx
<Map3D data={D} keys={[{f: a, x: 3330, y: 2420, z: 0.9, tilt: 46, rot: -6}, {f: a + 120, x: 3200, y: 2300, z: 1.2, tilt: 50, rot: -10}]}>
  {(api) => (
    <>
      <Border api={api} d={D.lines.nueces} at={t.at('Nueces')} color={MAP3D.mexico} dashed />   {/* a claim: dashed */}
      <Border api={api} d={D.lines.border1848} at={t.at('border')} color={MAP3D.us} />          {/* an agreed line: solid */}
      <Slab api={api} region="nuecesStrip" at={t.at('strip')} h={60} hatch="rgba(255,255,255,0.4)" />
      <Stand api={api} at={D.places.carricitos}><Stake /></Stand>
      <StateTiles api={api} names={CONFEDERACY_1861} at={t.at('split')} color={MAP3D.us} />
    </>
  )}
</Map3D>
```

Rules learned: a **claim** is dashed and an **agreed border** is solid; the disputed area rises as a hatched slab; labels stand up off
the paper and face the camera; one camera move per beat. When a map stands for something later (the 1861 split), say so on it:
name the sides (UNION, CONFEDERACY, "border states"), add a key and one dated pin (Fort Sumter), and put the event's title on a strip.
