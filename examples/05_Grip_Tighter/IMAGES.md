# Images: Grip Tighter

Archival images are in `video/public/img/chNN/`. Each was downloaded with `tools/find_images.py` / `tools/commons.py`, and every one is recorded with its source, author, date and licence in `video/public/img/credits.json`. **The video is now all archival: no generated paintings.** The 11 painting slots were filled from `video/public/img/arch/<scene>/` (table below); `GEMINI_PROMPTS.md` is retired. On screen, every image carries a source tag.

Status key: **have** = downloaded and checked on a contact sheet; **need** = still to find; **gen** = Gemini (you).


## Archival replacements for the painting slots (current)

| Scene | Was (painting) | Now | Marks on screen |
|---|---|---|---|
| ch03 Seeds | seeds by hand | Sydenham Edwards, cotton, *Botanical Register* pl. 84, 1815 (BHL) · `arch/seeds_by_hand/cotton_plant_boll_botanical_register_1815.jpg` | coral loop + tint on the open boll at "sticky" |
| ch04 Passage | coffle on a road | Lewis Miller, *Slave Trader, Sold to Tennessee*, eyewitness sketch, Staunton, c. 1853 (Abby Aldrich Rockefeller Folk Art Museum) · `arch/coffle_road/…miller…` | his caption tinted; the coffle outlined |
| ch06 WeighIn | weighing cotton | Solomon Northup, *Twelve Years a Slave*, 1853, pp. 167–68 (Internet Archive) | "where the cotton is weighed", "If it falls short…", "exceeded it… next day's task accordingly" washed as read |
| ch06 Gangs (added) | none | Lakin stereograph, *Picking cotton near Montgomery*, c. 1860 (LoC) | none |
| ch06 Cabin | cabin interior | HABS photo, McLeod Plantation quarters, 1990 (LoC) · `arch/cabin_interior/mcleod…` | none |
| ch07 Cabin | cabin at night | *State v. Celia* indictment, Aug. 1855 (Callaway Co. Circuit Court, via UMKC Famous Trials) | "Celia otherwise Celia Newsom, a Slave"; "with a large piece of wood" |
| ch08 Harbor | hush harbor | John Antrobus, *Plantation Burial*, 1860 (Historic New Orleans Collection), tagged as a night funeral | none |
| ch08 Crawl | crawl space | Harriet Jacobs, *Incidents*, 1861, pp. 173, 175 (Internet Archive) | "nine feet long and seven wide… three feet high"; "Through my peeping-hole…" |
| ch09 Eclipse, ch10 Sky | eclipse over fields | Asa Smith, *Illustrated Astronomy*, 1849, Fig. 9 "Annular Eclipse of the Sun" (Internet Archive) | slow push into the ring |
| ch09 Woods | meeting in the woods | *Confessions*, 1831, p. 12 | "prepared in the woods a dinner", "on that night" |
| ch09 Hiding | hiding place | *Confessions*, 1831, p. 17 (+ Floyd proclamation card) | "scratched a hole under a pile of fence rails"; "Mr. Benjamin Phipps, in a little hole" |
| ch10 Debate | House of Delegates | *Capitol of Virginia, Richmond*, engraving, London, 1831 (NYPL) | none |
| ch02 Rewind (added) | none | *First Census… 1790*, population by states (Census Bureau reprint, 1908) | "Slaves." column |
| ch02 Ban (added) | none | An Act to Prohibit the Importation of Slaves, 1807, p. 1 (National Archives) | the Act's title and "from and after the first day of January… eight" |
| ch04 Hill (added) | none | Federal Writers' Project, Arkansas narratives, Harriett Hill, p. 258 (LoC) | "I was sold away from my dear old mammy at three years old" |

Candidates kept but not used: Johnston's 1831 *Great Solar Eclipse* (comic ad), Guillemin total-eclipse plate (wrong eclipse type), Köhler cotton plate, churka drawing, Leslie's 1862 page, 1864 coffle engraving, Simon c. 1908 weighing photo (sharecropping era), Hopsewee HABS, Fisk Jubilee Singers, Waud 1867, Darley 1863 imagined Turner (invents a face: do not use), Confederate engineers' map, Brady 1865 Capitol, *Liberator* no. 1, Walker's *Appeal* (not in the narration), NC 1790 heads-of-families page, Celia verdict/fees/inquest, Ballou's 1858.

## ch01 · Cold open (the reward proclamation)

| Shot | File | Status |
|---|---|---|
| **Opening document:** Gov. John Floyd's $500 reward proclamation, Sept 17, 1831, page 1 (signature and seal) | `ch01/floyd_reward_proclamation_1831_p1.jpg` | have (600 px LVA web scan; see note) |
| Page 2: the physical description of Turner | `ch01/floyd_reward_proclamation_1831_p2.jpg` | have (600 px) |
| 1831 map of the eclipse's path across the U.S. (Boston Public Library) | `ch01/eclipse_map_1831.jpg` | have (6,000+ px; used in ch09 now) |
| "Horrid Massacre in Virginia," 1831 woodcut | `ch01/horrid_massacre_woodcut_1831.jpg` | have. Use with care: it's white Southern propaganda. Show it as "how white newspapers told it," held briefly, never as neutral illustration. |

**Note on the proclamation:** the Library of Virginia's online scans are only 600 px wide. That's fine for a card on the desk, about a third of the frame, with a slow push-in on the description lines. For a full-screen hold, request a high-resolution reproduction from the Library of Virginia (Governor's Office, Letters Received, John Floyd, RG 3). The document is public domain (1831). Some phrases on page 2 are struck through in the original ("about 30 or 35," "by the kick of a mule," "by a bite"). The narration reads only words that aren't struck through.

## ch02 · Supposed to Die

| Shot | File | Status |
|---|---|---|
| Thomas Jefferson, Rembrandt Peale, 1800 | `ch02/jefferson_peale_1800.jpg` | have |
| James Madison, Gilbert Stuart, c. 1821 (NGA, CC0) | `ch02/madison_stuart_1821.jpg` | have |
| Enslaved workers packing tobacco, Virginia (18th-century engraving) | `ch02/tobacco_plantation_virginia.jpg` | have |
| An Act to Prohibit the Importation of Slaves, 1807 (National Archives) | none | need: retry `find_images.py get` on the DPLA page-1 file |
| 1790 census return page | none | need: inner page of *Heads of Families… 1790 (Virginia)* |

## ch03 · Fifty Pounds a Day

| Shot | File | Status |
|---|---|---|
| Power-loom weaving shed, Baines, *History of the Cotton Manufacture*, 1835 | `ch03/power_loom_baines_1835.png` | have |
| Eli Whitney, Samuel F. B. Morse, 1822 | `ch03/whitney_morse_1822.jpg` | have |
| Whitney's cotton gin patent drawing, March 14, 1794 (National Archives) | `ch03/whitney_patent_drawing_1794.jpg` | have, large. Best image for the gin's mechanism. |
| "The First Cotton-Gin," Harper's Weekly, 1869 | `ch03/cotton_gin_harpers_1869.jpg` | have (an 1869 imagining; tag the date) |
| "Scenes in Cotton Land: The Cotton Gin," 1871 | `ch03/cotton_gin_scenes_cotton_land_1871.jpg` | have (alternate) |
| Hand-cleaning seeds | none | gen `ch03_seeds_by_hand.png` |
| Cotton belt / removal map | (map kit) | built as a graphic on the template's 1836 Mitchell map |

## ch04 · Sold South

| Shot | File | Status |
|---|---|---|
| "A Slave-Coffle Passing the Capitol," c. 1815 (LoC) | `ch04/coffle_passing_capitol_1815.jpg` | have. Crop off the library stamp. |
| "United States Slave Trade, 1830" broadside engraving | `ch04/slave_trade_washington_1830.jpg` | have |
| Price, Birch & Co., Dealers in Slaves, Alexandria, 1863 photograph | `ch04/price_birch_alexandria.jpg` | have (photo taken after Union capture; tag the date) |
| Slave auction at Richmond, Illustrated London News, 1856 | `ch04/slave_auction_richmond_1856.jpg` | have (small, 65 KB; hold as a card) |
| Sale of estates, pictures and slaves in the Rotunda, New Orleans, 1842 | `ch04/rotunda_new_orleans_1842.jpg` | have |
| A coffle on the road (wide, respectful) | none | gen `ch04_coffle_road.png` |
| Harriett Hill's interview page (LoC, FWP Arkansas vol. 2, pt. 3, mesn023) | none | need: LoC blocks automated download. Typeset the quote as a text card instead, or download the page by hand. |

## ch05 · The Pyramid

| Shot | File | Status |
|---|---|---|
| "North Carolina Emigrants: Poor White Folks," James Henry Beard, 1845 | `ch05/poor_white_folks_beard_1845.jpg` | have |
| Planter mansion | none | need: a pre-1860 plantation-house lithograph or HABS photograph |
| Yeoman farm family | none | need: a period genre engraving |
| **Pie charts** | built in code | see `SCRIPT.md` → Charts |

## ch06 · Sunup to Sundown

| Shot | File | Status |
|---|---|---|
| Brick slave quarters, The Hermitage, Savannah | `ch06/hermitage_slave_quarters_savannah.jpg` | have |
| Frederick Douglass, daguerreotype in case, c. 1840s | `ch06/douglass_portrait.jpg` | have. Crop to the plate. |
| Weighing cotton at day's end | none | gen `ch06_weighing_cotton.png` |
| Cabin interior | none | gen `ch06_cabin_interior.png` |
| Cotton field / picking (period photograph) | none | need: 1860s stereograph (LoC), tagged with its date |

## ch07 · No Law Above Him

| Shot | File | Status |
|---|---|---|
| Thomas Ruffin, portrait | `ch07/thomas_ruffin.jpg` | have (small; hold as a card) |
| "The Scourged Back," Gordon, Baton Rouge, 1863 (NPG) | `ch07/gordon_scourged_back_1863.jpg` | have. One respectful hold only; no zoom, no tint. |
| Celia | none | **no authentic image exists.** gen `ch07_empty_cabin_night.png` plus a Missouri map pin |

## ch08 · A World Outside Work

| Shot | File | Status |
|---|---|---|
| Family on Smith's Plantation, Beaufort, S.C., 1862 (Timothy O'Sullivan) | `ch08/five_generations_smiths_plantation_1862.jpg` | have. Strong image for "family." |
| Harriet Jacobs, Gilbert Studios, 1894 | `ch08/harriet_jacobs_1894.jpg` | have |
| *Incidents in the Life of a Slave Girl*, title page, 1861 | `ch08/incidents_title_page_1861.jpg` | have |
| Hush harbor | none | gen `ch08_hush_harbor.png` |
| The crawl space | none | gen `ch08_crawl_space.png` |

## ch09 · Southampton

| Shot | File | Status |
|---|---|---|
| *The Confessions of Nat Turner*, title page, 1831 | `ch09/confessions_title_page_1831.jpg` | have |
| "Discovery of Nat Turner," William H. Shelton, c. 1880s wood engraving | `ch09/discovery_of_nat_turner_shelton.jpg` | have. Tag as a later imagining (drawn ~50 years after); it's an artist's idea of Turner, not a likeness. |
| 1831 eclipse path map | `ch01/eclipse_map_1831.jpg` | have |
| Eclipse over the fields | none | gen `ch01_eclipse.png` |
| The woods, the hiding place | none | gen `ch09_woods_meeting.png`, `ch09_hiding_place.png` |

## ch10 · Grip Tighter

| Shot | File | Status |
|---|---|---|
| Thomas Jefferson Randolph, portrait | `ch10/thomas_jefferson_randolph.jpg` | have (small) |
| John C. Calhoun, Mathew Brady daguerreotype, 1849 | `ch10/calhoun_brady_1849.jpg` | have |
| Virginia State Capitol, 1830s | none | need: an engraving from Howe, *Historical Collections of Virginia* (1845), plate page to find |
| House of Delegates in session | none | gen `ch10_house_of_delegates.png` |
| Charts: value comparison, population counter | built in code | see `SCRIPT.md` → Charts |

## Never use

- **Any "portrait of Nat Turner."** None exists. The painting on the lecture's title slide is John Singleton Copley's *Head of a Negro* (c. 1777–78, Detroit Institute of Arts), painted in London more than 20 years before Turner was born. It's often mislabeled online as Turner. (Checked side by side against the slide. My earlier guess, the Exeter "Portrait of a Man in a Red Suit," was wrong.)
- The photo on the lecture's Celia slide: no authenticated image of Celia exists.
- The dramatization still on the lecture's Harriet Jacobs slide.
