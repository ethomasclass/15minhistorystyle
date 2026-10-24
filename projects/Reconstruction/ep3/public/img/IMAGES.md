# Reconstruction, Episode 3 ("Redemption"): archival images

91 files, about 100 MB, all public domain / PDM / CC0 / "no known restrictions" (LOC), or pre-1930 printings; every file has a credit in
`credits_ep3.json` (keys are relative to `img/ep3/`; merge into the project's `credits.json`). Sizes are pixels (w x h); long edge is
capped at 3000. Contact sheets of every chapter: `contact/chNN.jpg`.

**How the files were made.** Library of Congress prints and photos via `find_images.py get` or the item's IIIF/TIFF (curl). Internet
Archive book pages via `find_images.py get iabook:<id>:<n>` (`n` is the scan index). Newspaper pages from Chronicling America (IIIF),
cropped by hand to the column. Supreme Court and statute pages are LOC *U.S. Reports* / govinfo PDFs rendered at 300 dpi. Wikimedia
Commons rate-limited originals during this run, so six Commons files are 1920 px thumbnails and two are 3840 px thumbnails, marked
`note` in the credits. Three Smithsonian Open Access (CC0) items came from `ids.si.edu`.

**Highlight boxes for the transcript and telegram treatments.** The testimony pages have a `.json` next to them (`{size, source,
phrases: {phrase: [[x, y, w, h], ...one box per printed line]}}`) in the image's own pixels, made from the Internet Archive's hOCR. They
cover every line the narration quotes: "When did he die?", "Thursday night, in the Christmas.", "wanted to die in the open air…",
"Remember when you kill me…", "Never say you killed a coward", "for obeying Governor Ames; and that was all they had against him".
The *New York Herald* crops have the same kind of JSON for "tired out" / "annual autumnal outbreaks" (from `phrase_find.py`). The
boxes are whole printed lines, so trim the swipe to the words.

**Verified for the fact-check table.** Flag 17: Ames telegraphed Grant on Sept 7 and 8, 1875 (*National Republican*, Sept 9); the
White House answered that the Attorney General decided; Pierrepont's letter of Sept 14 quotes Grant's despatch, "The whole public are
tired out with these annual autumnal outbreaks in the South, and the great majority are ready now to condemn any interference on the
part of the Government" (*New York Herald*, Sept 17). Note the printed verb is "are", not "was"; the script's "it said, was 'tired out
with…'" keeps the quote marks off the verb, so it's fine. Flags 2, 3, 17a and 19 match the printed Senate page word for word.

**Content flags.** Marked **VIOLENCE** (the beat needs it; no close gore) or **PROPAGANDA / CARICATURE** (show as evidence, with
context). No Klan warning notices or White League posters were taken.

**Already in the repo; use them, don't re-download** (`tests/public/img/wall/`): `firstvote.jpg`, `senators.jpg`, `fifteenth.jpg` (the
ch02 recap and ch09's "15th Amendment's gaps"); `stevens.jpg` (ch10, "Stevens's plan died with him"); `acres.jpg` (ch10, the
Edisto/Field Order 15 map, "Most of Edisto Island went back"); `lincoln`, `johnson`, `seward`, `booth`, `pardons`, `stereocard` (only in
the ch10 zoom-out of the whole wall). The **Edisto petition** ("A home if It be but A few acres"), the last image of the series, is an
Episode 1 asset and isn't in this folder.

---

## ch01: A Christmas Drink

**Best picks:** `caldwell_testimony_p435_when_did_he_die_1876.jpg` (the transcript page: heading, "Mrs. Margaret Ann Caldwell
(colored) sworn and examined", "When did he die?—A. Thursday night, in the Christmas."), then `…p438_open_air_coward_1876.jpg` for
"open air… like a dog" and "Never say you killed a coward". Open on `mississippi_in_1875_title_page_1876.jpg` so the viewer sees it's
a Senate document. Alternate: `ch07/senate_report_assassination_of_senator_caldwell_1876.jpg` (the committee's own report quotes the
same Q-and-A under the heading "ASSASSINATION OF SENATOR CALDWELL").

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `mississippi_in_1875_title_page_1876.jpg` | Title page, *Mississippi in 1875. Report of the Select Committee to Inquire into the Mississippi Election of 1875, with the Testimony and Documentary Evidence*, vol. 1, GPO 1876 | iabook:mississippiin18701unit:6 | 1756x3000 | Establishing shot of the document: "testified under oath to a committee of the U.S. Senate" |
| `caldwell_testimony_p435_when_did_he_die_1876.jpg` (+ `.json`) | p.435: "MRS. CALDWELL—HINDS COUNTY. Jackson, Miss., June 20, 1876", sworn and examined, "THE WIDOW OF SENATOR CALDWELL", "When did he die?—A. Thursday night, in the Christmas. Him and his brother was killed." | iabook:mississippiin18701unit:554 | 1756x3000 | **Key document.** Transcript treatment; boxes for 7 lines |
| `caldwell_testimony_p437_christmas_treat_1876.jpg` (+ `.json`) | p.437: "he didn't want any Christmas… told him to drink for a Christmas treat" | iabook:mississippiin18701unit:556 | 1756x3000 | "talked a state senator into a Christmas drink" |
| `caldwell_testimony_p438_open_air_coward_1876.jpg` (+ `.json`) | p.438: "wanted to die in the open air, and did not want to die like a dog closed up"; Preacher Nelson; "thirty or forty of their loads"; "Remember when you kill me you kill a gentleman and a brave man. Never say you killed a coward." | iabook:mississippiin18701unit:557 | 1756x3000 | **Key document** for the last third of the chapter. **VIOLENCE** in the text only |

**Gaps:**
- **Charles Caldwell: no portrait found** in LOC, Commons, IA or Smithsonian. Margaret Ann Caldwell: none either. Stand-ins: his
  name in the printed testimony (p.435 "Charles"); his own words in `ch07/national_republican_1875-09-09_statement_of_senator_caldwell.jpg`;
  Ep 2's convention-roll card; or a silhouette (no AI face).
- Clinton itself: no period view found. `ch07/asher_adams_1874_hinds_county_clinton_jackson_crop.jpg` shows Clinton on the railroad between Vicksburg and Jackson.
  The script's "drawn plan of the Clinton street" would be a graphic, not archival.
- An optional newspaper account of the killing: the *National Republican*, Jan 1, 1876, p.1, "Shooting Affray in Mississippi"
  (a Memphis wire story that blames the Caldwells). It wasn't taken: the scan is torn, and the testimony tells the story better.

## ch02: The Night

**Best picks:** `visit_of_the_ku_klux_harpers_1872.jpg` (Klansmen at a cabin door at night: "The Klan wanted the night back"), with
`two_members_ku_klux_klan_disguises_harpers_1868.jpg` for the robes. Board card THE NIGHT: Visit of the Ku-Klux. Recap: the wall's
`firstvote`, `senators`, `fifteenth`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `visit_of_the_ku_klux_harpers_1872.jpg` | "Visit of the Ku-Klux", drawn by Frank Bellew, *Harper's Weekly*, Feb 24, 1872: a family by lamplight, a masked man aiming through the door | loc:2001695506 | 3000x2349 | **Board card.** "They rode at night"; "Night mattered". **VIOLENCE** (threat, no blood) |
| `two_members_ku_klux_klan_disguises_harpers_1868.jpg` | "Two members of the Ku-Klux Klan in their disguises", *Harper's Weekly*, Dec 19, 1868 (full page; the lower engraving is an unrelated English election riot) | loc:97516403 | 2404x3000 | "in masks and robes"; crop to the top figures |
| `memphis_riot_burning_freedmens_school_house_harpers_1866_crop.jpg` | "Scenes in Memphis… burning a freedmen's school-house", *Harper's Weekly*, May 26, 1866 | loc:94507780 | 1070x840 | "teachers at Black schools, churches". Tag it **Memphis riot, May 1866: a white mob, not the Klan** |
| `scenes_in_memphis_riot_school_house_burning_harpers_1866.jpg` | The full page; the lower engraving shows Black residents shot down | loc:94507780 | 2407x3000 | Reference only. **VIOLENCE**: use the crop |
| `ku_klux_report_joint_select_committee_title_1872.jpg` | Title page, *Report of the Joint Select Committee to Inquire into the Condition of Affairs in the Late Insurrectionary States* (the "Ku Klux Report"), 1872 | iabook:reportofjointsel01unit:6 | 1791x3000 | "This was terrorism": Congress's 13-volume record of it. Library stamps on the page |

**Gaps:** Pulaski, Tennessee, and the six founders: no period image. Slave patrols / "white patrols controlled the roads after dark": no
good engraving found; use the night scene. Night meetings of freedpeople (church, political clubs): none taken; Ep 2 may have a
Union League image.

## ch03: Protection

**Best picks:** `yorkville_enquirer_1871-10-26_proclamation_now_therefore_nine_counties_us_grant.jpg` (Grant's own words: "do hereby
suspend the privileges of the writ of habeas corpus within the counties of Spartanburg, York, Marion, Chester, Laurens, Newberry,
Fairfield, Lancaster, and Chesterfield… U. S. GRANT"), printed in a York County paper. Then `ku_klux_klan_act_statutes_at_large_p13_1871.jpg`
for "The biggest is often called the Ku Klux Klan Act", and `yorkville_enquirer_1871-10-26_arrests_of_citizens_york_county_part1.jpg` for
"Soldiers and federal marshals arrested hundreds". **Board card PROTECTION WORKS:** the proclamation crop.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `yorkville_enquirer_1871-10-26_proclamation_now_therefore_nine_counties_us_grant.jpg` | The operative paragraph and signature of the proclamation of Oct 17, 1871: the nine counties named, "U. S. GRANT. By the President: J. C. Bancroft Davis" | chronam:sn84026925/1871-10-26 p2 | 640x1225 | **Key document / board card.** "declared nine counties… suspended habeas corpus" |
| `yorkville_enquirer_1871-10-26_proclamation_habeas_corpus_suspended.jpg` | Headline "A PROCLAMATION. Habeas Corpus Suspended in Portions of South Carolina" and the "Whereas…" clauses citing the Act of April 20, 1871 | same | 640x2932 | Lead-in to the paragraph above; slow scroll |
| `yorkville_enquirer_1871-10-26_arrests_of_citizens_york_county_part1.jpg` + `…_part2_names.jpg` | Same page: "ARRESTS OF CITIZENS": cavalry squadrons, arrests "for violations of the 'Ku-Klux' and 'Enforcement' Acts", "The total number now in the jail at this place is 79", and the list of names | same | 670x2250 + 670x2097 (one column split in two, overlapping) | "arrested hundreds of men"; the column of names is a strong visual |
| `yorkville_enquirer_1871-10-26_the_enforcement_act_text.jpg` | Same page: "THE ENFORCEMENT ACT", the text of the Act of May 31, 1870 ("…shall be entitled and allowed to vote at all such elections, without distinction of race, color, or previous condition of servitude") | same | 645x1880 | "Congress passed a series of Enforcement Acts"; ink blots lower down |
| `ku_klux_klan_act_statutes_at_large_p13_1871.jpg` | *Statutes at Large* vol. 17, p.13: "CHAP. XXII.—An Act to enforce the Provisions of the Fourteenth Amendment… April 20, 1871" (the Ku Klux Klan Act), §2 on conspiracies "by force, intimidation, or threat" | iabook:sim_…statutes-at-large_1871-1873_17:52 | 1836x3000 | "The biggest is often called the Ku Klux Klan Act" |
| `ku_klux_trials_columbia_sc_proceedings_title_1872.jpg` | Title page, *Proceedings in the Ku Klux Trials at Columbia, S.C., in the United States Circuit Court, November Term, 1871* | iabook:proceedingsinkuk00unit:6 | 1843x3000 | "Federal courts held trials" |
| `mississippi_ku_klux_captured_disguises_harpers_1872.jpg` | "Mississippi Ku-Klux in the disguises in which they were captured [from a photograph]", *Harper's Weekly*, Jan 27, 1872 | loc:2006687376 | 1411x1536 | "the Klan, as an organization, was largely broken". It's Mississippi, not S.C.; say "captured Klansmen" |
| `grant_president_1873.jpg` | Ulysses S. Grant, full-length, c.1873 (glass negative; a crack runs across) | loc:2016688109 (TIFF) | 2186x3000 | Grant as President. Mask the crack or crop to half-length |
| `grant_president_portrait_1869.jpg` | Grant, half-length, seated, 1869 | loc:96522531 | 1028x1280 | Cleaner, smaller alternate |
| `asher_adams_1874_south_carolina_counties_crop.jpg` | Asher & Adams' *North Carolina and South Carolina*, 1874: South Carolina with the upstate counties (Spartanburg, York, Chester, Union, Laurens, Newberry…) | commons (David Rumsey scan), 3840 px thumbnail, cropped | 2050x1670 | Light up the nine counties as Grant names them |

**Gaps:** No engraving of the 1871 South Carolina arrests or of the Columbia trials found. Amos Akerman (the attorney general who ran the
prosecutions) isn't named in the script, so he wasn't searched.

## ch04: Colfax

**Best picks:** `louisiana_murders_gathering_the_dead_colfax_harpers_1873_crop.jpg` (Harper's own engraving of the aftermath, May 10,
1873), then `us_v_cruikshank_92us554_equal_protection_states_only_1876.jpg` for the ruling. **Board card COLFAX:** the engraving crop, with
the Cruikshank page as the string to EQUAL PROTECTION.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `louisiana_murders_gathering_the_dead_colfax_harpers_1873_crop.jpg` | "The Louisiana Murders—Gathering the Dead and Wounded", *Harper's Weekly*, May 10, 1873, p.397: women and children dragging the dead on a sled, bodies in the grass, mounted white men watching | loc:94507783 | 1670x1390 | **Board card.** "How many died? We don't know exactly". **VIOLENCE** (bodies at a distance) |
| `louisiana_murders_gathering_the_dead_colfax_harpers_1873.jpg` | The full page, with "The Disputed Prize" (an eagle and a hyena over a carcass) beneath | loc:94507783 | 2390x3000 | Document shot with the dated header |
| `us_v_cruikshank_92us542_first_page_1876.jpg` | *United States v. Cruikshank*, 92 U.S. 542, first page (syllabus) | loc:usrep092542 | 1796x2704 | "The case went all the way to the Supreme Court" |
| `us_v_cruikshank_92us554_equal_protection_states_only_1876.jpg` | p.554: "The fourteenth amendment prohibits a State from denying to any person within its jurisdiction the equal protection of the laws; but this provision does not… add any thing to the rights which one citizen has under the Constitution against another" (runs onto p.555) | loc:usrep092542 | 1796x2704 | **Key document**: "It doesn't cover private citizens attacking other private citizens". Highlight the last paragraph |
| `us_v_cruikshank_92us555_1876.jpg` | p.555: the sentence's end ("…to the rights which one citizen has under the Constitution against another. The equality of the rights of citizens is a principle of republicanism…") | loc:usrep092542 | 1796x2704 | Second page of the quote |
| `nast_union_as_it_was_white_league_kkk_1874.jpg` | Thomas Nast, "The Union as it was / The lost cause, worse than slavery", *Harper's Weekly*, Oct 24, 1874: a White League man and a Klansman shake hands over a terrified Black family | loc:2001696840 | 2423x3000 | The White League / Klan link, Louisiana 1874. Anti-Klan, but Nast's drawing of the family is period caricature: **CARICATURE, show with context** |
| `julia_hayden_white_league_victim_harpers_1874.jpg` | *Harper's Weekly*, Oct 3, 1874, p.813: "Louisiana and the rule of terror": portrait of Julia Hayden, a Black schoolteacher murdered at Hartsville, Tennessee, in August 1874 (one of the "latest victims of the White Man's League"), above the White League's attack on the police in New Orleans (Sept 14, 1874) | commons, 1920 px thumbnail | 1920x2554 | Optional: Louisiana violence after Colfax. **VIOLENCE** (street battle) |
| `asher_adams_1874_grant_parish_colfax_crop.jpg` | Asher & Adams' *Louisiana and Mississippi*, 1874: Grant Parish with Colfax, Alexandria, the Red River | commons (MDAH copy), crop | 1000x800 | "the small town of Colfax": a locator pin |

**Gaps:** No period image of the Colfax courthouse (it burned in the massacre). The 1872 disputed Louisiana election (Kellogg vs.
McEnery) has Nast and Leslie's cartoons, but none were taken. Chief Justice Waite, who wrote *Cruikshank*, isn't named in the script.

## ch05: Tired

**Best picks:** `panic_1873_closing_stock_exchange_leslies.jpg` for the Panic, `nast_probe_away_whiskey_ring_harpers_1876.jpg` for
the Whiskey Ring, and `civil_rights_act_1875_statutes_at_large_p336_inns_theaters.jpg` for the 1875 Act. **Board card TIRED:** the Panic
engraving with the Nast barrel pinned beside it.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `panic_1873_closing_stock_exchange_leslies.jpg` | "The Great Financial Panic of 1873—Closing the door of the Stock Exchange on its members, Saturday, Sept. 20th", *Frank Leslie's* supplement | loc:99614016 | 1150x1536 | "the Panic of 1873" |
| `panic_1873_jay_cooke_office_wall_street.jpg` | "Scenes in Wall Street during the panic. Jay Cooke & Company's office", 1873 | loc:90707110 | 1089x1536 | "one of the country's biggest banks collapsed" (Jay Cooke & Co., Sept 18, 1873) |
| `panic_1873_run_on_fourth_national_bank.jpg` | "The Panic—Run on the Fourth National Bank, No. 20 Nassau Street", *Leslie's*, Oct 4, 1873 | loc:2002723398 | 1185x1536 | "Businesses failed": crowds at a bank |
| `bellew_panic_sweeping_wall_street_1873.jpg` | Frank Bellew, "Panic, as a health officer, sweeping the garbage out of Wall Street", *The Daily Graphic* cover, Sept 1873 | commons (LOC 2013650090), 3840 px thumbnail | 2115x3000 | Cartoon alternate; a strong full-page cover |
| `nast_probe_away_whiskey_ring_harpers_1876.jpg` | Nast, "Probe Away!", *Harper's Weekly*, Mar 18, 1876: Uncle Sam probing a "Bourbon Whiskey" barrel with the "St. Louis" keg; Secretary Bristow's notice "These frauds… shall be probed to the very bottom" | commons (DPLA), cropped from the page | 1590x1660 | "The worst was the Whiskey Ring" |
| `babcock_orville_portrait.jpg` | Orville E. Babcock in uniform (Civil War era) | loc:2004668266 | 1027x1536 | "the President's own private secretary". Wartime photo, so tag "Babcock, c.1865" |
| `nast_third_term_panic_harpers_1874.jpg` | Nast, "The Third-Term Panic", *Harper's Weekly*, Nov 7, 1874 (the first Republican elephant) | loc:2004682001 | 3000x2260 | "In 1874, voters gave Democrats control of the House". The cartoon is about Grant third-term rumours and appeared just before the vote, so use it as "the 1874 campaign", not as a results image |
| `civil_rights_act_1875_statutes_at_large_p335.jpg` | *Statutes at Large* vol. 18, p.335: "CHAP. 114.—An act to protect all citizens in their civil and legal rights. March 1, 1875" and its preamble | iabook:sim_…statutes-at-large_1873-1875_18:366 | 1934x3000 | Title of the Act (at the bottom of the page) |
| `civil_rights_act_1875_statutes_at_large_p336_inns_theaters.jpg` | p.336, §1: "full and equal enjoyment of the accommodations… of inns, public conveyances on land or water, theaters, and other places of public amusement" | iabook:…:367 | 1934x3000 | **Key document**: "hotels, theaters and trains" |
| `shackle_broken_genius_of_freedom_elliott_civil_rights_1874.jpg` | "The Shackle Broken—by the Genius of Freedom" (E. Sachse & Co., 1874): Rep. Robert Brown Elliott of South Carolina speaking for the civil rights bill in the House, Jan 6, 1874 | loc:2003690777 | 3000x2520 | "one last law": the fight for the bill. Elliott isn't named; caption it by the print's title |
| `civil_rights_cases_109us3_first_page_1883.jpg` | *Civil Rights Cases*, 109 U.S. 3 (1883), first page: "The 1st and 2d sections of the Civil Rights Act passed March 1st, 1875, are unconstitutional…" | loc:usrep109003 | 1796x2704 | "The Supreme Court struck it down eight years later" |

**Gaps:** No single image says "reformers turned to cleaning up the government"; the Nast barrel covers it.

## ch06: The Bank

**Best picks:** `colored_tennessean_1866-03-24_freedmans_saving_bank_ad.jpg` ("Freedman's Saving Bank. Come one, come all! …The attention of
soldiers"), then `freedmans_savings_bank_exterior_1880s_sia.jpg`, `douglass_brady_1877.jpg`, and the two dividend checks for "only
about half… was ever paid back". **Board card THE BANK:** the 16-cent dividend check (no passbook found; see Gaps).

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `colored_tennessean_1866-03-24_freedmans_saving_bank_ad.jpg` | Ad in the *Colored Tennessean* (Nashville), Mar 24, 1866: "AND deposit your money in one among the best institutions in the United States… THE ATTENTION OF SOLDIERS… is particularly called to this Bank", John J. Cary, Cashier | chronam:sn83025745/1866-03-24 p3 | 1060x930 | **Key document**: "Soldiers saved their pay"; "Many depositors believed the government stood behind it" |
| `freedmans_savings_bank_exterior_1880s_sia.jpg` | The Freedman's Savings Bank building, Pennsylvania Avenue at Madison Place, Washington, 1880s | si:SIA-MAH-2502-000004 (CC0) | 2404x3000 | The bank. The photo is from the 1880s, after the bank failed (the building later housed the Justice Department) |
| `freedmans_bank_beaufort_sc_1863.jpg` | Stereograph "Freedman's Bank, Beaufort, So. Ca.": a two-storey house with a picket fence. LOC's date of 1863 must be wrong: the bank wasn't chartered until 1865 | loc:2016645520 | 3000x1540 | A local branch: "Tens of thousands of people opened accounts". Tag "c.1865–74" |
| `douglass_brady_1877.jpg` | Frederick Douglass, Brady studio, c.1877 (one half of a stereo negative) | loc:2017895330 | 1420x2280 | "Frederick Douglass, to be its president" |
| `douglass_leads_sumner_mourners_capitol_1874.jpg` | *Frank Leslie's*, March 1874: Douglass leading Black Washingtonians past Charles Sumner's coffin in the Capitol | loc:2012646118 | 2217x3000 | Alternate: Douglass in 1874, the year of the bank; "the most famous Black man in America" |
| `douglass_letter_freedmans_savings_bank_letterhead_3jul1874_nmaahc.jpg` | Douglass's letter on the bank's "Principal Office" letterhead, July 3, 1874, to J.A.J. Creswell (about the commissioners appointed to wind the bank up), signed "Fredk. Douglass, Prest." | si:NMAAHC-2021_58_2_001 (CC0) | 2397x3000 | **Key document**: "Within months, the bank closed"; Douglass's signature as president |
| `freedmans_bank_commissioners_dividend_check_1878.jpg` | Check from the "Office of the Commissioners of the Freedman's Savings and Trust Company", March 20, 1878, account 10799, "Pay to the order of Arthur A. Baker, Sixteen Cents", 2nd dividend | loc:scsm000519 | 2442x1098 | **Board card.** "only about half of what they were owed was ever paid back". The LOC page has no rights statement; it's an 1878 document, so public domain by age |
| `freedmans_bank_dividend_check_1880s_nmaahc.jpg` | Another commissioners' dividend check (New York branch, "2nd dividend"), 1880s per the museum | si:NMAAHC-2021_9_001 (CC0) | 3000x1427 | Alternate; two small checks side by side |

**Gaps:** **No passbook found** in LOC, Commons or Smithsonian Open Access (NMAAHC holds bank material, but no CC0 passbook image
turned up). The board card uses the dividend check instead. The depositor signature registers (National Archives) weren't searched.

## ch07: Mississippi, 1875

**Best picks:** For the telegram thread, `national_republican_1875-09-09_ames_telegrams_to_grant.jpg` (Ames → Grant, Sept 7; the
White House reply, Sept 8; Ames's formal call, Sept 8) and `ny_herald_1875-09-17_tired_out_column.jpg` (Pierrepont's letter, Sept 14,
quoting Grant: "tired out with these annual autumnal outbreaks"). Ames: `ames_hon_adelbert_ames_of_miss_brady_handy.jpg`. For the
transcript, `caldwell_testimony_p439_obeying_governor_ames_1876.jpg`. **Board card MISSISSIPPI, 1875:** the Herald column, with the p.439
page beside it.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `national_republican_1875-09-09_ames_telegrams_to_grant.jpg` | "GOV. AMES TO THE PRESIDENT": Ames's telegram, Jackson, Sept 7, 1875, "To His Excellency U. S. Grant… Domestic violence in its most aggravated form exists in certain parts of this State…"; the Executive Mansion reply, Sept 8 (Levi P. Luckey); "OFFICIAL CALL FOR FEDERAL ASSISTANCE", Ames, Sept 8 | chronam:sn86053573/1875-09-09 p1 | 790x1980 | **Key document** for "He telegraphed President Grant for troops". Cut it into three slips for the message thread |
| `ny_herald_1875-09-17_tired_out_column.jpg` (+ `.json`) | *New York Herald*, Sept 17, 1875: "THE MISSISSIPPI AFFAIR. The letter of the Attorney General to Governor Ames—President Grant's appreciation of public sentiment…", Pierrepont, Sept 14: "The whole public are tired out with these annual autumnal outbreaks in the South…" | chronam:sn83030313/1875-09-17 p3 | 1230x2059 | **Key document**: the reply slip. Boxes for "tired out" and "annual autumnal outbreaks" |
| `ny_herald_1875-09-17_pierrepont_letter.jpg` (+ `.json`) | The same letter in a wider crop with the neighbouring column | same | 2455x2570 | Alternate framing |
| `national_republican_1875-09-09_mississippi_massacre_headline.jpg` | Headline stack: "MISSISSIPPI MASSACRE. Details of the Great Diabolism. Another Fatal Riot at Satartia. Gov. Ames Demands Federal Aid" | chronam:sn86053573/1875-09-09 p1 | 690x460 | The Clinton riot as the news broke |
| `national_republican_1875-09-09_statement_of_senator_caldwell.jpg` | Same page: "STATEMENT OF STATE SENATOR CALDWELL" on the Clinton rally ("Judge Johnson had spoken about one hour to an audience of over two thousand… I remarked, 'My young friend, for God's sake, don't disturb the meeting'") | same | 790x1230 | **Caldwell's own words**: "about 2,000 Black Mississippians… gathered for a Republican rally" |
| `national_republican_1875-09-09_masthead.jpg` | *National Republican* masthead, Washington, Thursday, Sept 9, 1875 | same | 2793x530 | Header for the newspaper slips |
| `caldwell_testimony_p439_obeying_governor_ames_1876.jpg` (+ `.json`) | Senate report p.439: "…they intended to kill him because for carrying the militia to Edwards; for obeying Governor Ames; and that was all they had against him." Also "THREATS AGAINST MR. CALDWELL AFTER THE CLINTON RIOT" | iabook:mississippiin18701unit:558 | 1756x3000 | **Key document**: "His wife told the Senate why…" |
| `senate_report_assassination_of_senator_caldwell_1876.jpg` (+ `.json`) | The committee's report, p.XXI: "ASSASSINATION OF SENATOR CALDWELL. An equally horrid crime was the murder of Senator Caldwell and his brother, at Clinton, Christmas night…", then her testimony quoted | iabook:mississippiin18701unit:26 | 1756x3000 | Alternate transcript page (works for ch01 too) |
| `ames_hon_adelbert_ames_of_miss_brady_handy.jpg` | "Hon. Adelbert Ames of Miss.", Brady-Handy, c.1870–74 (seated, civilian dress) | loc:2017893690 | 2343x3000 | **Main Ames portrait** (his Mississippi years) |
| `ames_maj_gen_brady_1860s.jpg` | Maj. Gen. Adelbert Ames, Brady, 1860s | loc:2018666388 | 1903x3000 | Callback to Ep 2 ("the carpetbagger from Maine") |
| `pierrepont_attorney_general_brady_handy.jpg` | "Pierrepont, Hon. Edwards, Attny General—Grant Adm.", Brady-Handy | loc:2017894635 | 2444x3000 | "Grant's attorney general" (not named in the script) |
| `frost_of_course_he_wants_to_vote_democratic_harpers_1876.jpg` | A. B. Frost, "'Of course he wants to vote the Democratic ticket!'", *Harper's Weekly*, Oct 21, 1876: armed white Democrats holding a pistol to a Black voter's head | commons, 1920 px thumbnail | 1920x1345 | "Armed clubs of white men… the Mississippi Plan". A Republican cartoon against the shotgun policy, drawn with period caricature: **CARICATURE + VIOLENCE (threat), show with context**. Dated 1876, a year later; tag it |
| `asher_adams_louisiana_mississippi_map_1874.jpg` | Asher & Adams' *Louisiana and Mississippi*, 1874 | commons (MDAH), 3840 px thumbnail | 2032x3000 | Map for Mississippi (and Louisiana in ch04) |
| `asher_adams_1874_hinds_county_clinton_jackson_crop.jpg` | Detail: Hinds County with Clinton, Jackson, Raymond, Edwards, Bolton and Vicksburg on the railroad | same, crop | 1100x800 | "just outside Clinton"; "men from a nearby town" (the Vicksburg train); "deliver guns" to Edwards |

**Gaps:**
- Ames's telegrams and Pierrepont's letter survive here as **newspaper printings**, not the original telegraph forms. For the "real
  telegram slips" look, set the printed text on period-style slips and tag them "text as printed in the *National Republican*, Sept 9,
  1875" and "*New York Herald*, Sept 17, 1875".
- No image of the Clinton rally, the militia company, Ames's peace conference, or Election Day 1875.
- **Fact-check flag 20** (Republican votes of 12, 7, 4, 2 and 0 in Black-majority counties): not found in a scan yet. The county
  returns should be in the Senate report's documentary volume (vol. 2), but no page was found this run. Keep the line as words; don't
  put numbers on screen.
- "Redeemers": no image needed.

## ch08: Two Sets of Results

**Best picks:** The portraits `hayes_president_brady.jpg` and `tilden_portrait_1876.jpg`; `presidential_elections_chart_1877_crop_1876_election_map.jpg`
(a period map printed with the result: "Hayes… received 185 votes. Tilden… received 184 votes… Disputes… over the votes of South
Carolina, Florida, Louisiana and Oregon… decided by a Commission"); `electoral_commission_secret_session_candlelight_leslies_1877.jpg`;
`nast_a_truce_not_a_compromise_1877.jpg` for "Tilden or Blood"; and `louisiana_withdrawal_federal_troops_state_house_april_1877.jpg` for
the ending. **Board card TWO SETS OF RESULTS:** the 1876 map crop (the drawn 184/165 tally sits on top).

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `hayes_president_brady.jpg` | Rutherford B. Hayes, Brady, c.1870–80 | loc:2017893107 | 2080x3000 | Hayes portrait (board close-up) |
| `tilden_portrait_1876.jpg` | Samuel J. Tilden, engraved portrait, 1876 | loc:2018697211 | 2322x3000 | Tilden portrait |
| `grand_national_republican_banner_hayes_1876.jpg` | Currier & Ives, "Grand National Republican Banner": Hayes and Wheeler, 1876 | loc:2003656594 | 2439x3000 | "Republican Rutherford B. Hayes…" |
| `grand_national_democratic_banner_tilden_1876.jpg` | Currier & Ives, "Grand National Democratic Banner": Tilden and Hendricks, 1876 | loc:2003656575 | 2359x3000 | "…against Democrat Samuel Tilden". A matched pair with the one above |
| `presidential_elections_chart_1877_crop_1876_election_map.jpg` | H. C. Donnell, *The Presidential Elections of the United States* (San Francisco, 1877): the 1876 panel and its caption (185 to 184; the disputed states "referred to, and decided by a Commission") | loc:2012586608 (IIIF region at full resolution) | 3000x2057 | **Board card / key image** |
| `presidential_elections_of_the_united_states_chart_1877.jpg` | The whole chart, 1789–1876 | loc:2012586608 | 2897x2379 | Zoom-from context |
| `electoral_commission_secret_session_candlelight_leslies_1877.jpg` | *Leslie's*, 1877: "Washington, D.C.—The Electoral Commission holding a secret session by candle-light, on the Louisiana question" | loc:89712291 | 1536x942 | "a special commission of 15 men… voted along party lines, 8 to 7" |
| `nast_a_truce_not_a_compromise_1877.jpg` | Nast, "A Truce—Not a Compromise, but a Chance for High-Toned Gentlemen to Retire Gracefully from Their Very Civil Declarations of War", *Harper's Weekly*, 1877: a hand on a revolver over "Tilden or Blood" and "Civil War" handbills | loc:93510088 | 3000x2122 | "For months, nobody knew who the next president would be" |
| `south_carolina_deadlock_state_legislature_columbia_leslies_1876.jpg` | *Leslie's*, December 1876: "South Carolina—The November election—The dead-lock in the state legislature at Columbia" (two rival Houses) | loc:98518306 | 2413x3000 | "both parties claimed to have won… Two sets of results". Leslie's draws the Black legislators with some caricature: **check before close-ups** |
| `political_farce_of_1876.jpg` | Broadside "The Political Farce of 1876… The Two Negroes and Ten Whites who defeated the will of the American people", 1877, attacking the Louisiana Returning Board and the commission | loc:2006677483 | 3000x2398 | **PROPAGANDA (Democratic, racial framing): evidence only, with context**, if the beat wants how Democrats saw it |
| `hayes_oath_of_office_1877.jpg` | Stereograph: Hayes's inauguration at the Capitol, March 5, 1877 | loc:96506818 | 2523x1564 | "Hayes becomes president". Crop one half of the pair |
| `louisiana_withdrawal_federal_troops_state_house_april_1877.jpg` | 1877 engraving (LOC): "Louisiana—The withdrawal of the federal troops from the State House in New Orleans, at noon, on April 24th" | loc:93505869 | 3000x2394 | **Key image** for "Hayes ordered the soldiers guarding the statehouses… to leave" |

**Gaps:** The Fassett painting *The Florida Case before the Electoral Commission* (1879, U.S. Senate collection, public domain) exists
online only as a 610 px Commons copy; get a large file from senate.gov if it's wanted. No image of the South Carolina withdrawal
(April 10, 1877). The original rival electoral certificates (National Archives) weren't searched. Dashed string "no proof of a written
deal": no image needed.

## ch09: Voteless

**Best picks:** `louisiana_registered_voters_by_race_1896_1902report.jpg` and `louisiana_grandfather_clause_registrations_by_race_1902.jpg`
(the state's own tables), `louisiana_constitution_1898_p79_sec5_grandfather_clause.jpg`,
`mississippi_constitution_1890_sec243_poll_tax_sec244_reading_test.jpg`, and `russell_lee_colored_water_cooler_oklahoma_city_1939.jpg`
for Jim Crow (tag it as later). **Board:** VOTELESS rewritten on the petition (no new image).

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `mississippi_constitution_1890_article12_franchise_sec241.jpg` | Mississippi Constitution of 1890, Art. 12 "Franchise", §§240–242 (§241: an elector must have "paid… all taxes… on or before the first day of February") | iabook:cu31924005756956:42 | 1546x2496 | The first state to do it. Highlight the tax-payment clause |
| `mississippi_constitution_1890_sec243_poll_tax_sec244_reading_test.jpg` | §243 "A uniform poll tax of two dollars"; §244 every elector must "be able to read any section of the constitution of this State; or… understand the same when read to him, or give a reasonable interpretation thereof" | iabook:cu31924005756956:43 | 1546x2496 | **Key document**: "A poll tax" and "A literacy test… graded by white officials" (the understanding clause) |
| `louisiana_constitution_1898_p77_art197_suffrage.jpg` | Louisiana Constitution of 1898, Art. 197 "Suffrage and Elections" begins | iabook:constitutionsta02louigoog:79 | 1878x3000 | Lead-in. Google scan with a small "Digitized by Google" mark at the bottom; crop it |
| `louisiana_constitution_1898_p78_written_application_literacy_test.jpg` | §3: the applicant must fill out the registration form "entirely written, dated and signed by him… without assistance"; §4: the $300 property alternative | iabook:…:80 | 1878x3000 | Literacy test, Louisiana version |
| `louisiana_constitution_1898_p79_sec5_grandfather_clause.jpg` | §5: "No male person who was on January 1st, 1867… entitled to vote… and no son or grandson of any such person… shall be denied the right to register and vote… by reason of his failure to possess the educational or property qualifications"; the oath "(or, I am the son, or grandson)" | iabook:…:81 | 1878x3000 | **Key document**: "A grandfather clause" |
| `louisiana_registered_voters_by_race_1896_1902report.jpg` | *Report of the Secretary of State* (Louisiana, 1902), p.554: "Statement Registered Voters, 1896", by parish, with columns for white and colored voters | iabook:reportofsecretar00loui:561 | 1878x3000 | **"In 1896, Louisiana had about 130,000 Black men registered"**. There's no totals row on this page, so don't show 130,344 as if printed here |
| `louisiana_registered_voters_by_race_jan1898_1902report.jpg` | Same report, p.555: "Statement of Registered Voters on January 1, 1898" (after the 1896 registration law): totals 87,240 registered, 12,902 colored | iabook:…:562 | 1878x3000 | The middle step: 130,344 → 12,902 → 1,342 |
| `louisiana_grandfather_clause_registrations_by_race_1902.jpg` | Same report, p.558: "Number of Persons Listed and Qualified for Registration under Section 5 of Article 212 [sic; it is Art. 197] of the Constitution of 1898": **White 37,877, Colored 111** | iabook:…:565 | 1878x3000 | **Key document**: "Which, in the South, meant white men." |
| `poll_tax_receipt_jefferson_county_alabama_1920.jpg` | Poll tax receipt for Rosa Boyles, Jefferson County, Alabama, Oct 22, 1920 | commons, 1920 px thumbnail (from PNG) | 1920x893 | A real receipt; "a fee you had to pay to vote". Tag 1920 (later) |
| `russell_lee_colored_water_cooler_oklahoma_city_1939.jpg` | Russell Lee (FSA), a man drinking at a "Colored" water cooler, streetcar terminal, Oklahoma City, July 1939 | commons, 1920 px thumbnail | 1920x1291 | "water fountains… Jim Crow laws". **Later photo (1939); tag it** |
| `bubley_colored_waiting_room_sign_1943.jpg` | Esther Bubley (OWI), "Colored Waiting Room" sign, bus station, 1943 | commons | 1433x1503 | "waiting rooms". **Later photo (1943); tag it** |

**Correction (found while building ch09):** "A uniform poll tax of two dollars" is printed at the foot of `mississippi_constitution_1890_article12_franchise_sec241.jpg` (p. 39), not on the `…sec243…` file; §244's reading test is on the `…sec243…` file as listed.

**Gaps:** The **1904 figure (1,342)** isn't in a scan here (the 1902 report stops at 1898 and 1900); it needs the 1904 Louisiana
Secretary of State report or a period compilation. No pre-1900 Jim Crow photographs. A "Jim Crow car" engraving wasn't found in
copyright-safe sources. Pre-1930 poll-tax receipts from Mississippi or Louisiana weren't found; the Alabama 1920 one stands in.

## ch10: A Few Acres

**Best picks:** `primary_school_freedmen_vicksburg_harpers_1866.jpg` ("Schools"), `colored_tennessean_1866-03-24_information_wanted_column.jpg`
("Families that found each other"), `heroes_of_the_colored_race_1881.jpg` ("A generation of Black leaders"), then
`brown_v_board_347us495_inherently_unequal_1954.jpg` and `voting_rights_act_1965_79stat437_enforce_fifteenth.jpg` ("The words…
were still there, waiting"). The series ends on the Edisto petition (Ep 1's asset).

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `primary_school_freedmen_vicksburg_harpers_1866.jpg` | "Primary School for Freedmen, in charge of Mrs. Green, at Vicksburg, Mississippi", *Harper's Weekly*, 1866 | loc:2023632559 | 3000x2337 | "Schools." (Mississippi, so it ties to Caldwell) |
| `misses_cookes_school_room_freedmens_bureau_richmond_1866.jpg` | *Leslie's*, 1866: "The Misses Cooke's school room, Freedman's Bureau, Richmond, Va." (full page) | loc:98510871 | 2404x3000 | Alternate school scene; crop to the top engraving |
| `colored_tennessean_1866-03-24_information_wanted_column.jpg` | "Information Wanted" column, *Colored Tennessean*, Mar 24, 1866: Hannah Barnett seeking her daughter Martha ("was sold to Mr. John James, Nashville… about nine years ago"), Robert Williams seeking his son Daniel, a family of five children… | chronam:sn83025745/1866-03-24 p3 | 1050x2860 | **"Families that found each other"**: slow scroll |
| `heroes_of_the_colored_race_1881.jpg` | "Heroes of the Colored Race" (1881 chromolithograph): Blanche K. Bruce, Frederick Douglass, Hiram Revels, with vignettes | loc:00651114 | 3000x2210 | "A generation of Black leaders" (Revels and Bruce were Mississippi's senators) |
| `brown_v_board_347us495_inherently_unequal_1954.jpg` | *Brown v. Board of Education*, 347 U.S. 483 (1954), p.495: "Separate educational facilities are inherently unequal… deprived of the equal protection of the laws guaranteed by the Fourteenth Amendment" | loc:usrep347483 | 1796x2704 | **Key document**: "In 1954…" |
| `voting_rights_act_1965_79stat437_enforce_fifteenth.jpg` | Public Law 89-110, 79 Stat. 437, Aug 6, 1965: "AN ACT To enforce the fifteenth amendment to the Constitution of the United States" | govinfo:STATUTE-79-Pg437 | 1899x2841 | **Key document**: "Congress finally put real force behind the 15th" (the title says it) |
| `johnson_king_voting_rights_act_signing_1965.jpg` | Yoichi Okamoto (White House), President Johnson hands Martin Luther King Jr. a pen at the Voting Rights Act signing, Aug 6, 1965 | commons, 1920 px thumbnail | 1920x1285 | Optional. A 1965 president, not a modern politician, but the document alone may be enough |

**Gaps:** "Churches": no good period image of a freedpeople's church (try "First African Baptist Church" or Harper's "Prayer meeting"
next time). LOC's 1954 (Nettie Hunt) and 1965 Selma photos are marked "publication may be restricted" (New York World-Telegram) and
weren't taken. The Edisto petition and the three amendments' texts are Ep 1–2 assets.
