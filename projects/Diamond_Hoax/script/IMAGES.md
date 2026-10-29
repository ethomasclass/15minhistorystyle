# They Fooled America's Richest Men: archival image picks

Sourced 2026-10-29 for the scene plan in `SCENES.md` (its "Archival" table) and the narration in `SCRIPT.md`. Everything lives under
`public/img/chNN/` (by the chapter that first uses it) and has an entry in `public/img/credits.json` (keyed by the path under
`public/img/`). Everything goes on screen black and white, so the sepia/colour originals (albumen prints, the atlas) are fine.
Contact sheet: `review/contact/archival_v1.jpg` (47 files, numbered in the order of the tables below).

**File-name flags**
- `FAIRUSE_…` / `CCBY_…`: **none this round.** Every file here is public domain (reason in its row). The rights caveats that do exist
  (an LOC "rights not evaluated" record, a HABS copy photo) are noted in the row.

**Newspaper crops** (`ch03/`, `ch06/`, `ch08/`, `ch09/`) come from LOC Chronicling America (OCR word boxes). Each crop has a `.json`
beside it: `size` (crop px), `crop_box_in_page_px` (where the crop sits in the `_page.jpg`, when there is one) and `phrases`
(one `[x, y, w, h]` box per printed line, in crop pixels, word-exact) for `Swipe` / `Spot`. Pages are 1868–1875, public domain by
date; LOC: no known restrictions. The Nov 26, 1872 front pages are saved whole too (`_page.jpg`, 6000 px tall) for a `DocLift`.

**Sources that failed this session** (worth a retry): Wikimedia Commons answered almost every request with HTTP 429 (rate limited)
for the whole session, so the Commons-only files listed under Gaps could not be downloaded. CDNC (cdnc.ucr.edu: Daily Alta, Sacramento
Union) and Gallica returned a Cloudflare 403 challenge. Everything below came from LOC, Chronicling America and Internet Archive.

## Identity findings (read before cutting anyone's face in)

- **"Philip Arnold and John Slack" (credited to Scottsdale Community College).** The only place it shows up is a 12News (Phoenix)
  feature on Arizona scams ([12news.com](https://12news.com/article/news/history/a-look-back-at-arizonas-historic-scams-and-scandals-as-the-state-turns-108/75-0c55926b-1e20-4f34-85f8-9f1d208329de)),
  captioned "John Slack and Phillip Arnold", credit Scottsdale Community College. I found **no archive record** behind it (no
  catalogue entry, no date, no provenance). Not used. Don't present it as the cousins.
- **Philip Arnold's single portrait** (the bearded man in most web articles): according to the text of the Elizabethtown, Ky. historical marker
  ([HMDB 170852](https://www.hmdb.org/m.asp?m=170852), as quoted in search results; the page itself returned 403), it comes from a **tintype given to the Louisville Public Library,
  bought in 1935 from a man (Macintyre) who *said* it showed Arnold.** That is a weak, single-source ID. No public-domain copy with
  a catalogue record was found. **Recommendation:** treat Arnold like Slack, as a silhouette/placeholder card (or show the tintype only
  with a Note "said to be Arnold"). The scene plan's "Arnold portrait cut-out (coral)" has no file behind it yet.
- **John Slack:** no photograph found anywhere (LOC, IA, web). Keep the "no reliable photo" silhouette card.
- **Henry Janin:** he is real (Henry Janin, San Francisco mining engineer of the Janin family of engineers; Louis Janin was his brother), but **no portrait was found**
  (LOC, IA, Harpending's 1913 book, which has 21 portraits but not Janin). The Huntington Library's Janin family papers
  (`mssJaninc`, given by Louis and Henry Janin's family) include photographs: best lead. Use a silhouette for him.
- **Ralston:** `ch02/ralston_william_harpending_plate_1913.jpg` is safe. It is captioned in print "Wm. C. Ralston, President of Bank of
  California, the first dupe in diamond fraud" (Harpending, 1913).
- **"Baron Rothschild"** (Harpending plate): the 1913 caption says only "head of the great financial institution in England in 1872".
  Which Rothschild is shown isn't certain (Lionel was the head in 1872; the sitter may be his son Nathan). On screen say "the
  Rothschild bank", not a first name.

## The newspaper result (Nov 26, 1872): fact-check note on the quote

- The *San Francisco Chronicle* page itself is **not** in Chronicling America (and CDNC was blocked). But the exposé went out on the
  telegraph the same day, and four Nov 26 pages carry it. The exact phrase "**the most gigantic and barefaced swindle of the age**" was
  **not found** in LOC OCR. The closest printed wording is the *Evening Star* (Washington), Nov 26, 1872, p. 2: "this diamond and ruby
  fraud is one of the **most gigantic and barefaced swindles ever perpetrated**." *The Sun* (NY) of the same day ties it to the
  Chronicle: "The *Chronicle* of to-day exclusively prints a full exposé of the diamond swindle, which has just been discovered to be one
  of the most gigantic frauds ever perpetrated on the public."
  **Suggestion:** swipe the *Star* line (or the *Sun* line), and caption it with that paper, not "Chronicle". If the Chronicle quote stays in
  the narration, the Sun crop is the honest bridge ("the Chronicle prints a full exposé").
- "UNMASKED!" / "THE MAMMOTH FRAUD EXPOSED" (the Chronicle's own heads) were not found; those need the Chronicle itself (see Gaps).
- **Best single image for the beat:** `ch08/gold_hill_news_1872-11-26_great_diamond_hoax.jpg`: masthead, date "TUESDAY, NOV. 26, 1872"
  and the head **GREAT DIAMOND HOAX.** (the phrase that became the event's name), plus "a humbug—a cruel fraud", "the most gigantic
  fraud ever attempted to be perpetrated on a community" and "Ralston, of the Bank of California, holds all the stock".
- Two 1875 dates disagree with the script's "two thirty-five": the *NY Tribune* says the bank "stopped paying checks at **2:45**", the
  *LA Herald* "closed at **2:40**" (and its dispatch says "at 2 o'clock"). Consider "mid-afternoon" or "just before three". The Aug 28
  *Tribune* headline says "SUICIDE OF PRESIDENT RALSTON": if used, pair it with a Note ("the papers assumed; nobody knows"), as the
  script deliberately doesn't decide.

## Images by chapter

Tag = the exact short on-screen source tag.

### Ch 1: Paid for Dirt (cold open)
No files of its own. The three quick cards at "Bankers. Generals. The most famous jeweler" use `ch02/ralston_william_harpending_plate_1913.jpg`,
`ch04/mcclellan_george_brady_cdv_1861.jpg` and `ch04/tiffany_charles_engraving_1893.jpg`.

### Ch 2: Too Late for the Bank

| # | File | Shows | Size | Source | Rights | Beat | Tag |
|---|---|---|---|---|---|---|---|
| 1 | `ch02/bank_of_california_lawrence_houseworth_c1867.jpg` | "California Bank, N.W. corner California and Sansome Streets": Ralston's Bank of California building (opened 1867), Italianate stone front, street corner, a wagon | 1536×1419 | [LOC 2002720123](https://www.loc.gov/item/2002720123/) | PD; LOC no known restrictions | "too late for the bank" (Note "closed"); ch 8 "walked into Ralston's bank"; ch 9 1875 | Lawrence & Houseworth, c. 1867 · Library of Congress |
| 2 | `ch02/ralston_hall_ballroom_belmont_c1875.jpg` | Mirror-panelled ballroom of Ralston's Belmont mansion, photo c. 1875 (HABS copy) | 3649×5000 | [LOC HABS CA-1674](https://www.loc.gov/item/ca0807/) | PD by age (c. 1875); HABS note: copy of a California Historical Society photo, "images copied from other sources may be restricted" | "find a banker": the scale of Ralston's wealth; ch 9 heavy beat (the empty ballroom) | Ralston Hall, c. 1875 · HABS / Library of Congress |
| 3 | `ch02/ralston_william_harpending_plate_1913.jpg` | **William C. Ralston**, halftone portrait with printed caption ("the first dupe in diamond fraud") | 895×1230 | [IA greatdiamondhoax00harp, n126](https://archive.org/details/greatdiamondhoax00harp/page/n126) | PD, published 1913 | "That banker was William Ralston" (coral); ch 8 domino three; ch 9 | Harpending, *The Great Diamond Hoax*, 1913 |

Ralston is modest in resolution (halftone). Better master on Commons: see Gaps.

### Ch 3: Everybody Wants a Diamond Mine

| # | File | Shows | Size | Source | Rights | Beat | Tag |
|---|---|---|---|---|---|---|---|
| 4 | `ch03/comstock_mining_cutaway_lecount_1876.jpg` | "Mining on the Comstock": lithograph cut-away of shafts, timbering and hoists under Virginia City | 1536×1115 | [LOC 93506798](https://www.loc.gov/item/93506798/) | PD; LOC no known restrictions | "Nevada silver" | *Mining on the Comstock*, 1876 · Library of Congress |
| 5 | `ch03/kimberley_diggings_town_holub_c1872.jpg` | "Kimberley": fold-out engraving of the diggings camp, tents and shacks, wagons, crowds | 3594×2236 | [IA sevenyearsinsout01holu, n97](https://archive.org/details/sevenyearsinsout01holu/page/n97) | PD, published 1881 | "Diamonds had just turned up in South Africa" (wide) | Holub, *Seven Years in South Africa*, 1881 |
| 6 | `ch03/kimberley_kopje_holub_1871.jpg` | "Kimberley Kopje in 1871": the open pit, claims cut into blocks, cable lines | 1960×1810 | [IA …holu, n94](https://archive.org/details/sevenyearsinsout01holu/page/n94) | PD, 1881 | South Africa (the pit) | Holub, 1881 |
| 7 | `ch03/kimberley_kopje_holub_1872.jpg` | "Kimberley Kopje in 1872": diggers on a staging hauling buckets up the cables | 1995×1830 | [IA …holu, n99](https://archive.org/details/sevenyearsinsout01holu/page/n99) | PD, 1881 | South Africa (people at work). **Best of the three** | Holub, 1881 |
| 8 | `ch03/virginia_city_from_cedar_hill_lawrence_houseworth_c1866.jpg` | Virginia City, Nevada, from Cedar Hill (low contrast) | 1536×1385 | [LOC 2002719276](https://www.loc.gov/item/2002719276/) | PD; LOC no known restrictions | "Nevada silver" (alt, the town) | Lawrence & Houseworth, c. 1866 · Library of Congress |
| 9 | `ch03/white_pine_news_1872-11-09_claim_notice_beginning_at_a_stake.jpg` (+ `.json`) | Mining-claim notice, "Application for Patent… under act of Congress approved May 10, 1872… **beginning at a stake** whence the main shaft…" (White Pine Co., Nev.) | 681×899 | [Chronicling America](https://www.loc.gov/resource/sn84022047/1872-11-09/ed-1/?sp=4) | PD (1872) | "staking a claim" `Definition`; ch 5 3,000 acres. Swipe "beginning at a stake" | *White Pine News*, Nov. 9, 1872 · Library of Congress |

### Ch 4: The Tiffany Test

| # | File | Shows | Size | Source | Rights | Beat | Tag |
|---|---|---|---|---|---|---|---|
| 10 | `ch04/butler_benjamin_brady_handy_c1870.jpg` | Benjamin F. Butler, seated, c. 1870 (Brady-Handy glass negative; **broken plate**, cracks top and bottom: mask the head and shoulders only) | 4438×6000 | [LOC 2017893338](https://www.loc.gov/item/2017893338/) | PD; LOC no known restrictions | "two famous Civil War generals" (small card) | Brady-Handy, c. 1870 · Library of Congress |
| 11 | `ch04/greeley_horace_engraving_walter_1872.jpg` | Horace Greeley, engraved portrait (A. B. Walter, 1872) | 4908×6000 | [LOC 2012649732](https://www.loc.gov/item/2012649732/) | PD; LOC no known restrictions | "the most famous newspaper editor" (small card) | A. B. Walter, 1872 · Library of Congress |
| 12 | `ch04/madison_square_new_york_c1870.jpg` | "New York City—Madison Square", c. 1870: park trees, railings, the buildings across the square | 4096×3254 | [LOC 2002719450](https://www.loc.gov/item/2002719450/) | PD; LOC no known restrictions | "New York. A fancy house on Madison Avenue" (wide). Barlow's house was at 23rd and Madison, on this square | Madison Square, c. 1870 · Library of Congress |
| 13 | `ch04/mcclellan_george_brady_cdv_1861.jpg` | George B. McClellan, full-length in uniform (Brady carte de visite, 1861) | 2123×3359 | [LOC 2005683068](https://www.loc.gov/item/2005683068/) | PD; LOC no known restrictions | ch 1 card; "two famous Civil War generals"; ch 6 "One of those generals" | Brady, 1861 · Library of Congress |
| 14 | `ch04/tiffany_charles_engraving_1893.jpg` | **Charles L. Tiffany**, engraved portrait with his signature (aged about 81; he was 59 in 1871) | 1497×2199 | [IA charlesltiffanyh00tiffrich, n11](https://archive.org/details/charlesltiffanyh00tiffrich/page/n11) | PD, published 1893 | "And Charles Tiffany" (coral); ch 6, ch 9. The signature can be its own cut-out | *Charles L. Tiffany and the House of Tiffany & Co.*, 1893 |
| 15 | `ch04/tiffany_store_union_square_c1870.jpg` | Tiffany & Co.'s cast-iron store on Union Square, New York (opened 1870), flag on the roof, carriages | 1993×2898 | [IA …tiffrich, n34](https://archive.org/details/charlesltiffanyh00tiffrich/page/n34) | PD, 1893 | "the man behind Tiffany and Company"; "Tiffany sold cut and polished diamonds" | Tiffany & Co., 1893 |

### Ch 5: The Long Way Around

| # | File | Shows | Size | Source | Rights | Beat | Tag |
|---|---|---|---|---|---|---|---|
| 16 | `ch05/russell_bitter_creek_valley_union_pacific_1868.jpg` | "Bitter Creek Valley": the desert badlands along the Union Pacific in southern Wyoming (A. J. Russell, Hayden's *Sun Pictures*, pl. IX) | 2570×1492 | [LOC 2003668240](https://www.loc.gov/item/2003668240/) | PD; LOC no known restrictions | "Four days on horseback" / the trip from the railroad (no Rawlins photo found, see Gaps) | A. J. Russell, 1868 · Library of Congress |
| 17 | `ch05/russell_deep_cut_bitter_creek_union_pacific_1868.jpg` | "Deep Cut, Bitter Creek, near Green River": the UP grade being cut, mesa on the horizon (left half of a stereo) | 1948×2033 | [LOC 98508935](https://www.loc.gov/item/98508935/) | PD; LOC no known restrictions | Union Pacific in Wyoming (the railroad the parties rode) | A. J. Russell, 1868 · Library of Congress |

### Ch 6: Diamond Fever

| # | File | Shows | Size | Source | Rights | Beat | Tag |
|---|---|---|---|---|---|---|---|
| 18 | `ch06/cheyenne_daily_leader_1872-09-19_diamond_fever.jpg` (+ `.json`) | Denver dispatch: "…in company with **Generals McClellan**, Marcy, Carr… **The diamond fever is increasing** here. The faith in the reality of the existence of diamond fields within ten days drive of Denver is growing." | 715×863 | [Chronicling America](https://www.loc.gov/resource/sn84022149/1872-09-19/ed-1/?sp=1) | PD (1872) | "People called it *diamond fever*": swipe the phrase (Highlight "DIAMOND FEVER"). Bonus: McClellan touring the West | *Cheyenne Daily Leader*, Sept. 19, 1872 · Library of Congress |
| 19 | `ch06/rothschild_baron_harpending_plate_1913.jpg` | "Baron Rothschild, head of the great financial institution in England in 1872" (halftone, printed caption) | 860×1210 | [IA greatdiamondhoax00harp, n200](https://archive.org/details/greatdiamondhoax00harp/page/n200) | PD, 1913 | "The Rothschild banking family" card. Identity caveat above | Harpending, 1913 |

The "Lessons in Diamond Mining" (*Laramie Independent*, 1872) column was not found; see Gaps.

### Ch 7: The Anthills

| # | File | Shows | Size | Source | Rights | Beat | Tag |
|---|---|---|---|---|---|---|---|
| 20 | `ch07/king_atlas_diamond_peak_detail_1876.jpg` | Detail of King's Fortieth Parallel atlas: **"DIAMOND PK"**, the dashed Wyoming–Colorado line, "Basin of Vermillion Creek", Browns Park and the Green River: the hoax country, mapped by King's own survey | 3603×2162 | [LOC 2016586421, sheet 11](https://www.loc.gov/resource/gmdatlases.2016586421/?sp=11) | PD, U.S. government 1876 | "They'd mapped that part of Colorado"; also ch 5 site / the mesa slab reference. **Standout** | King's *Atlas*, 1876 · Library of Congress |
| 21 | `ch07/king_atlas_green_river_basin_topographical_map_ii_1876.jpg` | Whole sheet, "Green River Basin, Map II (Topographical)": hachured relief, grey (reads well in B&W). Diamond Peak sits at about (3500, 2300) px | 6000×4108 | same | PD, 1876 | Wide before the detail; push to Diamond Peak | King's *Atlas*, 1876 · Library of Congress |
| 22 | `ch07/king_clarence_age27_c1869.jpg` | **Clarence King**, seated three-quarter length, printed caption "King at age of 27" | 923×1536 | [LOC 2023641108](https://www.loc.gov/item/2023641108/) | PD by age (c. 1869); LOC: rights status not evaluated | "Clarence King" (coral, Highlight); ch 8 quote | Clarence King, c. 1869 · Library of Congress |
| 23 | `ch07/osullivan_butte_near_green_river_city_1872.jpg` | "Butte near Green River City", Wyoming: lone butte over sage flats, O'Sullivan's 1872 season for King (mounted print; crop to the photo) | 6000×4645 | [LOC 2006677735](https://www.loc.gov/item/2006677735/) | PD; LOC no known restrictions | "Five days on horseback" / the empty country | T. H. O'Sullivan, 1872 · Library of Congress |
| 24 | `ch07/osullivan_junction_green_yampa_canyons_1872.jpg` | "Junction, Green & Yampah Cañons [Colorado]": NW Colorado canyon country, 1872 | 1536×1163 | [LOC 2004680325](https://www.loc.gov/item/2004680325/) | PD; LOC no known restrictions | "that part of Colorado" | T. H. O'Sullivan, 1872 · Library of Congress |
| 25 | `ch07/osullivan_kings_camp_salt_lake_city_1868.jpg` | "King's Camp on the bench, Salt Lake City": the survey's tents and men (left half of a stereo) | 2408×2665 | [LOC 2023632405](https://www.loc.gov/item/2023632405/) | PD; LOC no known restrictions | "men from a government survey" (the survey party in camp). It's 1868, not 1872: no year on screen | T. H. O'Sullivan, 1868 · Library of Congress |
| 26 | `ch07/osullivan_vermillion_creek_canon_1872.jpg` | "Vermillion Creek Cañon": the creek that drains the hoax site, 1872 | 1536×1192 | [LOC 2002719247](https://www.loc.gov/item/2002719247/) | PD; LOC no known restrictions | "They found the mesa" area; pairs with the map's "Basin of Vermillion Creek" | T. H. O'Sullivan, 1872 · Library of Congress |
| 27 | `ch07/osullivan_washakie_badlands_wyoming_1872.jpg` | "Washakie Bad Lands, Wyoming": eroded spire, a figure at its foot for scale | 1072×1536 | [LOC 2004680313](https://www.loc.gov/item/2004680313/) | PD; LOC no known restrictions | "geologists who'd spent five years mapping the West" / "form in very different kinds of rock" | T. H. O'Sullivan, 1872 · Library of Congress |

### Ch 8: The Dominoes

| # | File | Shows | Size | Source | Rights | Beat | Tag |
|---|---|---|---|---|---|---|---|
| 28 | `ch08/emmons_samuel_franklin_c1870.jpg` | Samuel F. Emmons, standing, arms folded (cabinet card; LOC dates it 1870, it looks later) | 976×1536 | [LOC 2005680329](https://www.loc.gov/item/2005680329/) | PD; LOC no known restrictions | "one of King's own men" | Samuel F. Emmons · Library of Congress |
| 29 | `ch08/evening_star_1872-11-26_a_gigantic_fraud.jpg` (+ `.json`) | Telegraph column: **"A GIGANTIC FRAUD. The Reported Diamond Discoveries. The Gems 'Planted' to Sell Greenhorns."** King's report: "the whole pretended discovery as a gigantic fraud"… "All stock thus far sold is still held by W. C. Ralston"… "the expected diamond fields have been **salted**" | 1031×1723 | [Chronicling America p1](https://www.loc.gov/resource/sn83045462/1872-11-26/ed-1/?sp=1) | PD (1872) | "the story hit the papers"; King's findings in print | *Evening Star*, Nov. 26, 1872 · Library of Congress |
| 30 | `ch08/evening_star_1872-11-26_a_gigantic_fraud_page.jpg` | Full front page | 4446×6000 | same | PD | `DocLift` before the crop (crop box in the `.json`) | same |
| 31 | `ch08/evening_star_1872-11-26_barefaced_swindle.jpg` (+ `.json`) | Editorial: readers should "postpone their trip until **a new crop of gems has been planted** by the 'original discoverers'… this diamond and ruby fraud is one of **the most gigantic and barefaced swindles ever perpetrated**." | 1030×604 | [Chronicling America p2](https://www.loc.gov/resource/sn83045462/1872-11-26/ed-1/?sp=2) | PD (1872) | **The highlighter swipe.** Phrase boxes: line 1 `[781.8, 419.2, 181.5, 45.8]`, line 2 `[60.0, 456.5, 892.8, 57.0]`, line 3 `[70.5, 500.8, 141.5, 42.8]` | *Evening Star*, Nov. 26, 1872 · Library of Congress |
| 32 | `ch08/evening_star_1872-11-26_barefaced_swindle_page.jpg` | Full page 2 | 4474×6000 | same | PD | DocLift | same |
| 33 | `ch08/gold_hill_news_1872-11-26_great_diamond_hoax.jpg` (+ `.json`) | Masthead "THE EVENING NEWS. GOLD HILL… TUESDAY, NOV. 26, 1872" and editorial **"GREAT DIAMOND HOAX."**: "a humbug—a cruel fraud… the most gigantic fraud ever attempted to be perpetrated on a community… Ralston, of the Bank of California, holds all the stock" | 770×1648 | [Chronicling America](https://www.loc.gov/resource/sn84022046/1872-11-26/ed-1/?sp=2) | PD (1872) | **Standout**: the head names the event; a Comstock paper, so it also bridges to ch 3's silver | *Gold Hill Daily News*, Nov. 26, 1872 · Library of Congress |
| 34 | `ch08/gold_hill_news_1872-11-26_great_diamond_hoax_page.jpg` | Full page | 4143×6000 | same | PD | DocLift | same |
| 35 | `ch08/ny_sun_1872-11-26_salted_jewel_fields.jpg` (+ `.json`) | **"THE SALTED JEWEL FIELDS. THE WHOLE THING DENOUNCED AS A SHAMELESS FRAUD"**; "The *Chronicle* of to-day exclusively prints a full exposé… one of the most gigantic frauds ever perpetrated on the public"; "**Arnold and Slack**, the men who located the claim, are said to have made one million" | 786×1014 | [Chronicling America](https://www.loc.gov/resource/sn83030272/1872-11-26/ed-1/?sp=1) | PD (1872) | The New York angle; the Chronicle bridge; the cousins named in print. (The piece mislocates the field, "Summit county… fifty miles from Fort Bridger": don't swipe that) | *The Sun* (New York), Nov. 26, 1872 · Library of Congress |
| 36 | `ch08/ny_sun_1872-11-26_salted_jewel_fields_page.jpg` | Full front page | 4629×6000 | same | PD | DocLift | same |
| 37 | `ch08/panic_1873_closing_stock_exchange_doors.jpg` | Frank Leslie's supplement cover, "The Great Financial Panic of 1873: closing the door of the Stock Exchange on its members, Saturday, Sept. 20th" | 1150×1536 | [LOC 99614016](https://www.loc.gov/item/99614016/) | PD; LOC no known restrictions | "the Stock Exchange shut down for ten days" | *Frank Leslie's*, 1873 · Library of Congress |
| 38 | `ch08/panic_1873_jay_cooke_office_wall_street.jpg` | "Scenes in Wall Street during the panic: Jay Cooke & Company's office", crowd at the door | 1089×1536 | [LOC 90707110](https://www.loc.gov/item/90707110/) | PD; LOC no known restrictions | "one big bank in New York went under" (on screen: Jay Cooke & Co.) | Wall Street, 1873 · Library of Congress |
| 39 | `ch08/panic_1873_nassau_broad_wall_street_crowd.jpg` | "The great financial panic: intersection of Nassau and Broad Streets with Wall Street", packed crowd | 1017×1536 | [LOC 2005694776](https://www.loc.gov/item/2005694776/) | PD; LOC no known restrictions | "Does that sound far-fetched?" (Highlight "1873") | Wall Street, 1873 · Library of Congress |
| 40 | `ch08/panic_1873_run_on_fourth_national_bank_leslies.jpg` | Frank Leslie's, "The Panic: run on the Fourth National Bank, No. 20 Nassau Street" | 1185×1536 | [LOC 2002723398](https://www.loc.gov/item/2002723398/) | PD; LOC no known restrictions | "That's called a bank run" `Definition` (real crowd at a bank door; or with `sil_bank_line`) | *Frank Leslie's*, 1873 · Library of Congress |
| 41 | `ch08/panic_1873_run_on_union_trust_company.jpg` | "Scenes in Wall Street during the panic: run on the Union Trust Company" | 1096×1536 | [LOC 90707111](https://www.loc.gov/item/90707111/) | PD; LOC no known restrictions | bank run (alt); ch 9 stand-in for the 1875 run if needed (label it 1873) | Wall Street, 1873 · Library of Congress |

### Ch 9: Where the Money Went

| # | File | Shows | Size | Source | Rights | Beat | Tag |
|---|---|---|---|---|---|---|---|
| 42 | `ch09/cheyenne_leader_1868-06-05_henrys_repeating_rifles_ad.jpg` (+ `.json`) | Cheyenne store ad: "Cartridges for Colt's and other Revolvers… **One Case of Henry's Repeating Rifles.**" | 681×658 | [Chronicling America](https://www.loc.gov/resource/sn84022150/1868-06-05/ed-1/?sp=3) | PD (1868) | "a good Henry rifle": swipe the line, Note "not a lawyer" | *Cheyenne Leader*, 1868 · Library of Congress |
| 43 | `ch09/henry_rifle_cavalryman_kauffman_abell_c1864.jpg` | Carte de visite of an (unidentified) 2nd West Virginia cavalryman holding a **Henry repeating rifle** | 2532×4071 | [LOC 2026166945](https://www.loc.gov/item/2026166945/) | PD; LOC no known restrictions | Henry rifle: cut out the rifle only (coral), not the man | Kauffman & Abell, 1860s · Library of Congress |
| 44 | `ch09/la_herald_1875-08-27_bank_of_california_suspended.jpg` (+ `.json`) | **"Bank of California Suspended—Intense Excitement in San Francisco"**: "the Bank of California closed its doors… in ten minutes California street from Montgomery to Sansome **was literally black with human heads**" | 856×1250 | [Chronicling America](https://www.loc.gov/resource/sn84038806/1875-08-27/ed-1/?sp=2) | PD (1875) | "people lined up": the best words for the 1875 run (no picture of it found) | *Los Angeles Herald*, Aug. 27, 1875 · Library of Congress |
| 45 | `ch09/ny_tribune_1875-08-27_suspension_bank_of_california.jpg` (+ `.json`) | **"SUSPENSION OF THE BANK OF CALIFORNIA"**: "stopped paying checks at 2:45 to-day"; Ralston interviewed | 1075×1427 | [Chronicling America](https://www.loc.gov/resource/sn83030214/1875-08-27/ed-1/?sp=1) | PD (1875) | the 1875 run; clock beat (see the 2:35 vs 2:45 note above) | *New-York Tribune*, Aug. 27, 1875 · Library of Congress |
| 46 | `ch09/ny_tribune_1875-08-27_suspension_bank_of_california_page.jpg` | Full front page | 4285×6000 | same | PD | DocLift | same |
| 47 | `ch09/ny_tribune_1875-08-28_panic_in_california.jpg` (+ `.json`) | "THE PANIC IN CALIFORNIA. A DAY OF DISASTER AND EXCITEMENT. **SUICIDE OF PRESIDENT RALSTON**… swims from a bathing house and drowns" | 1093×1443 | [Chronicling America](https://www.loc.gov/resource/sn83030214/1875-08-28/ed-1/?sp=1) | PD (1875) | Optional, heavy beat. The headline asserts suicide; the script says nobody knows. Use only with a Note, or skip | *New-York Tribune*, Aug. 28, 1875 · Library of Congress |

Ch 9 also reuses `ch02/bank_of_california_lawrence_houseworth_c1867.jpg` (the bank façade, "became a banker" and the 1875 run),
`ch02/ralston_william_harpending_plate_1913.jpg` and `ch02/ralston_hall_ballroom_belmont_c1875.jpg`.

## Not found / gaps

| Wanted (SCENES.md row) | Where I looked | Best lead | Fill with |
|---|---|---|---|
| **Philip Arnold portrait** (verified) | LOC P&P, IA (Harpending 1913 has no Arnold), web | The tintype at the Louisville Free Public Library (bought 1935, "claimed" to be Arnold; per the Elizabethtown, Ky. marker text). Also the Hardin County History Museum, Elizabethtown | Silhouette card; or the tintype with "said to be Arnold" |
| **John Slack** | same | none found; NMSU / White Oaks, N.M. records (he died there 1896) | Silhouette card "no reliable photo" (as planned) |
| **Henry Janin portrait**; his 1872 report title page | LOC, IA, Harpending 1913, web | Huntington Library, Janin family papers `mssJaninc` (photographs included); report text printed in Nov 1872 papers | Silhouette |
| **SF *Chronicle* / *Daily Alta*, Nov 26, 1872** ("UNMASKED!", "THE MAMMOTH FRAUD EXPOSED") | Chronicling America (not held); CDNC blocked (403 challenge) | CDNC *Daily Alta California* 26 Nov 1872 (try in a browser); the *Chronicle* via newspapers.com / ProQuest / SF Public Library microfilm (1872, PD by date) | The four Nov 26 pages above |
| Ralston, better master | Commons (429) | Commons `File:Bradley & Rulofson Portrait.jpg` (3933×6051, Bradley & Rulofson, labelled Ralston, PD) | Harpending plate (#3) |
| Tiffany nearer 1871 | Commons (429) | Commons `File:Charles Lewis Tiffany undated portrait photo.jpg` (2073×2969, PD) and `…cabinet card… Sarony (1892).jpg` | 1893 engraving (#14) |
| Run on the Bank of California, Aug 1875 (picture) | LOC P&P (nothing), web | *Frank Leslie's Illustrated Newspaper* / *Harper's Weekly*, Sept 1875 issues (HathiTrust volumes); California Historical Society; Bancroft | Newspaper crops #44–47 + `sil_bank_line`; or the 1873 runs labelled 1873 |
| Harper's / Leslie's illustration of the hoax itself | LOC P&P, IA | *Harper's Weekly* Dec 1872 volume (HathiTrust); *Frank Leslie's* Dec 1872 | Props and silhouettes |
| Union Pacific **at Rawlins** (1868–72) | LOC (no Rawlins views), Commons (429) | A. J. Russell's "Rawlins Springs" negatives (Oakland Museum of California; Yale Beinecke Russell album) | Russell Bitter Creek (#16–17), same line ~100 mi west |
| Stock certificate, San Francisco and New York Mining and Commercial Co. | LOC, IA, Chronicling America | Bancroft Library business records; Wyoming State Archives; scripophily dealers (image rights unclear) | `share_certificate` prop (as planned) |
| "Lessons in Diamond Mining", *Laramie Independent*, 1872 | Chronicling America (search errored; title probably not digitized there) | Wyoming Newspapers project (newspapers.wyo.gov) | Cheyenne "diamond fever" crop (#18) |
| Barlow house, 23rd & Madison | LOC | NYPL Digital Collections (Madison Square views) | Madison Square c. 1870 (#12) |
| King survey party group photo, 1872 | LOC (only 1868 camp), USGS library (not reached) | USGS Photographic Library, "King, C." / Fortieth Parallel portraits (federal, PD); BnF/Gallica O'Sullivan albums (on Commons at 7400 px) | King's camp 1868 (#25) |
| Kimberley, ILN 1872 | Commons (429) | Commons `File:The diamond diggings of South Africa.jpg` (ILN, Aug 31, 1872; 831 px) | Holub engravings (#5–7) |
| Shootout (1878) engraving, undertaker / coffin | not searched in depth | generic period street-fight engravings in *Police Gazette* | `sil_undertaker`, `undertaker_coffin` prop |

Leftovers not used: LOC HABS photos of the Bank of California's 1873 neighbour (ca0625, not Ralston's bank), Commons' modern Ralston
Hall photos, the 1853 Tiffany engraving (dropped: wrong age), and the stereo duplicates (cropped to one frame).
