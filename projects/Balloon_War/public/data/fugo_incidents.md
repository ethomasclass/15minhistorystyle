# Fu-Go balloon-bomb incidents: `fugo_incidents.json`

## Source

Robert C. Mikesh, *Japan's World War II Balloon Bomb Attacks on North America*, Smithsonian Annals of Flight No. 9 (Smithsonian Institution Press, 1973). The book is public domain (a US government work). Scan: <https://archive.org/details/japanese-balloon-bombs-1943>.

The list comes from the appendix "Chronology of Balloon-bomb Incidents" on printed pp. 69–77 (scan leaves 76–84). Mikesh took it from G-2 Periodic Report No. 188, 4 August 1945. The maps are Figs. 87–90 on pp. 78–81: US and Mexico, Canada, Alaska and the Aleutians, and Hawaii.

## How it was digitized

1. I downloaded the archive.org DjVu XML, which has the OCR text with a position for every word. The plain `_djvu.txt` mixes up the three columns (Place, Recovery date, Remarks), so I rebuilt the table from the word positions instead. Words were grouped into rows by height on the page and into columns by x-position. A new entry starts on each row that has a date. When a place name runs onto two lines, the date sits on the second line, so the first line was carried forward to that entry.
2. This gave exactly 285 entries. The OCR'd entry numbers that survived (14, 16–19, 23, 24, 33, 53, 55, 70, 78–80, 82, 90, 102–285) all match the order. The book's own text also says "285 incidents".
3. I read the full-resolution page images for every Place and Recovery-date cell, all 285 rows, and corrected the OCR by hand:
   - Dates: `{2 Feb` → 12 Feb, `3 Apt.` → 3 Apr, `7 Sun.` → 7 Jun, `4yul.` → 4 Jul.
   - Missing asterisk: No. 153 Olds is marked * in the scan.
   - Place names: `Ashiey` → Ashley, `Exwok` → Ekwok, `Colibran` → Collbran, `lowa` → Iowa, `Hanson {sland` → Hanson Island. The OCR also dropped "Kailua," for No. 2.
   - Remarks: OCR noise removed (`Tigging`, `MWY`, `Balioon`, `1!2-kg` (the scan reads "12-kg, tin-type", a misprint of fin-type), stray page numbers, broken hyphenation). The remarks are otherwise as the OCR gave them and were not checked word by word.
4. Years: entries 1–8 are 1944 and entries 9–285 are 1945 (the table has a "1945" heading before No. 9).
5. Geocoding:
   - Most places were matched in GeoNames (through the Open-Meteo geocoder) and OpenStreetMap Nominatim, limited to the right state or province.
   - Places I could not identify for certain were checked against where Mikesh's own maps (Figs. 87–89) put their numbered dots. Those maps are rough. In southern BC some dots are clearly misplaced (for example, No. 227 Vedder Mt. is plotted about 2° from where it is), so where a real place of that name exists I used the name over the map.
   - The `geo` field says how each point was placed (see the fields table).

## Fields

| field | meaning |
|---|---|
| `n` | Entry number in the source (1–285). The file is in source order. |
| `date` | ISO date. The source column is "Recovery date" (when the item was found or reported), not necessarily the landing date. |
| `approx` | `true` for the 14 dates marked `*` in the source, "Indicates the estimated landing date": Nos. 25, 26, 50, 85, 131, 139, 153, 179, 180, 197, 198, 199, 200, 210. No date is month-only. |
| `place`, `source_place` | The place as printed (the source spelling is kept). `source_place` is the full original string. |
| `place_modern` | Modern or corrected name, where it differs (Laurens, Puyallup, Philipsburg, Yahk, Mount McLoughlin, Goodnews Bay and so on). |
| `region` | State, province or territory. "District of McKenzie" is given as Northwest Territories, "Yukon Territory" as Yukon, and the Aleutians as Alaska. Hawaii (then a US territory) is `"Hawaii"`. |
| `country` | `US`, `Canada`, `Mexico`, or `At sea` (region `Pacific Ocean`). |
| `lat`, `lon` | Decimal degrees. Aleutian points west of 180° have **positive** longitude: Shemya, Attu, Little Sitkin and Amchitka. Your projection has to handle the antimeridian. |
| `geo` | How the point was placed. `town`: populated place. `feature`: lake, river, mountain, island, pass or airfield. `region`: a vague place, put at its center (Canol Road, Hoopa Reservation). `site`: an exact site (Bly / Gearhart Mountain). `sea`: coordinates given in the source, or worked out from its description. `map`: a place not identified, put where Mikesh's map shows it (low confidence). `unknown`: no position (No. 12). |
| `kind` | My classification of the Remarks text: `balloon` (balloon, envelope or apparatus found or landed), `fragments` (paper, envelope fragments or pieces only), `bomb` (bomb or incendiary, or its fragments, with no balloon gear), `balloon+bomb` (balloon gear found with bombs), `shot down` (shot down or forced down by aircraft or ship). |
| `bomb`, `explosion` | `true` when the remarks mention a bomb or incendiary, or an explosion. |
| `fatalities`, `outside_north_america`, `plot` | Special flags. See "Sanity checks" and "Doubts" below. |
| `remarks` | Source Remarks text (OCR, lightly cleaned). |
| `note` | My notes on geocoding and identification. |
| `source_page` | Printed page number (69–77). |

## Counts

- **285 entries.** No entries were skipped. All 285 source rows are in the file.
- **Dates:** every entry has a day-level date. 271 are exact as printed, and 14 are estimated landing dates (`approx: true`).
- **By country:** US 199 (including Alaska 24 and Hawaii 1), Canada 78, Mexico 2, At sea 6.
- **By kind:** balloon 154, fragments 61, bomb 33, balloon+bomb 20, shot down 17. 54 entries mention a bomb or incendiary. Mikesh's own breakdown uses different categories: 120 balloon recoveries, 32 recoveries with bombs, 20 downed and not recovered, 28 bomb-only incidents and 85 related incidents.
- **By month:** Nov 1944: 2, Dec: 6, Jan 1945: 19, Feb: 55, Mar: 114, Apr: 42, May: 16, Jun: 17, Jul: 14. The source's "Summary of Positive Incidents Reported" (p. 77) gives Mar 114, Apr 42, May 16, Jun 17, Jul 14, all identical. It gives Nov–Jan 28 and Feb 54, against 27 and 55 here. The difference is expected, because the summary counts by landing date. The summary also gives Canada 78 and Mexico 2, both identical.
- **Busiest regions:** Oregon 41, British Columbia 39, Montana 32, Washington 25, Alaska 24, California 20, Alberta 17.

## Sanity checks

- **First and last dates:** 1944-11-04 (No. 1, at sea off San Pedro, California) and 1945-07-20 (Nos. 284 Mount Pitt, Oregon and 285 Indian Springs, Nevada).
- **Easternmost (western hemisphere):** No. 180 **Farmington, Michigan**, 25 Mar 1945 (estimated), fragments of a 5-kg incendiary, at 42.46, -83.38. Next is No. 71 Grand Rapids, Michigan. Counted by raw longitude, the Aleutian islands west of 180° come out "east", so filter on `lon < 0`.
- **Alaska / Aleutians:** 24 Alaska entries, 5 of them in the Aleutians: No. 24 Shemya (25 Jan, shot down), **No. 211 Attu (12 Apr, shot down)**, **No. 213 Attu (13 Apr, nine balloons shot down, one recovered)**, No. 214 Little Sitkin (13 Apr, shot down) and No. 219 Amchitka (15 Apr). No. 217 (15 Apr, shot down at sea, 52°46′N 178°30′W, near Adak) is listed as `At sea`.
- **Mexico:** No. 147 **Sonoyta, Sonora**, 19 Mar 1945, balloon found. No. 183 **Laguna Salada, Baja California**, 28 Mar 1945, balloon shot down.
- **Bly, Oregon (No. 240), 5 May 1945:** "Balloon, complete with parts (incident involving bomb explosion, killing five children and one woman)". This is the only fatal incident of the campaign. Flags are `fatalities: 6` and `kind: "balloon+bomb"`. The point is the Mitchell Monument on Gearhart Mountain (42.4316, -120.8608), about 10 mi east-northeast of the town of Bly, not the town itself. The listed date matches the date of the tragedy given in the narrative (pp. 67–68 and Fig. 84).

## Doubts and known OCR or source problems

- **No. 12** (5 Jan 1945, merchant-vessel crew shot down a balloon): the source prints "At sea: 52:5 N, 106:00 W", which is inland Saskatchewan. It is a misprint in the source, and the point is not on any of the maps. `lat`/`lon` are `null` and `plot: false`.
- **Outside North America:** No. 2 Kailua, Hawaii, which Fig. 90 plots on Oahu. The remark says "at sea 5 miles west of Kailua", which would fit Kailua-Kona better. No. 283 is "At sea (430 mi. ESE of Tokyo)", put at roughly 33.3N 146.7E. Both are flagged `outside_north_america`.
- **Low-confidence placements (`geo: "map"`):**
  - No. 111 Legg, Montana
  - No. 116 Bechland, Montana
  - No. 120 Phillips, Alaska
  - No. 151 William Lake, Manitoba
  - No. 184 Whitewater, BC
  - No. 210 Bald Mountain, Oregon
  - No. 261 Skukuma Creek, BC

  Each could be off by 0.5–2°.
- **Uncertain identifications (named place chosen; the map disagrees or the name is ambiguous):**
  - No. 47 "Marie River, District of McKenzie": taken as Jean Marie River, NWT.
  - No. 128 Hay Lake, Alberta: placed at the Hay-Zama Lakes in NW Alberta to match Fig. 88, not at Hay Lakes village near Edmonton.
  - No. 170 Barrier Lake, BC: the one near Squamish. The map suggests the Barriere area.
  - No. 176 "Britain River": taken as Brittain River (Sunshine Coast). The map suggests the Kamloops area.
  - No. 185 Canol Road: put at Ross River.
  - No. 224 "Morica Lake": taken as Morice Lake.
  - No. 209 "Plane, Idaho": taken as Plano, Idaho.
  - No. 70 Bigelow, Kansas: a ghost town, position approximate.
  - No. 25 Kashunuk, Alaska: river or old village site.
  - No. 270 Old Crow River: a point on the river.
- **Source spellings kept in `place`:** Laurence (Laurens), Puyalup, Phillipsburg, Yank (Yahk), Lake Hyatt (Hyatt Lake), Mount Pitt (Mount McLoughlin), Mumtrak (Goodnews Bay), Hoopa Indian "Reservoir" (Reservation), Coal Harbor, Porcupine Plains.
- **Order:** No. 43 Calistoga (23 Feb) sits among the 12–13 Feb entries. The source itself marks it "[Out of sequence.]". The file keeps the source order, so sort by `date` if you need chronological order.
- **Remarks:** the remarks text is OCR. Places and dates were checked against the scan images, but the remarks were not checked word for word.
- **What the dates mean:** dates are recovery or report dates. A balloon may have landed days or weeks earlier, and several remarks say so.
