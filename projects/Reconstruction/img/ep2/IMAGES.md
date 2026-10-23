# Bottom Rail on Top (Episode 2): archival images

86 files (about 95 MB), all public domain, PDM, CC0 or CC BY. Every file has a credit in `credits_ep2.json` (keys are
relative to `img/ep2/`; merge into the main credits file when the scenes are built). Sources: Library of Congress (Prints &
Photographs, Geography & Map, Chronicling America), Internet Archive scans of *Harper's Weekly*, *Frank Leslie's Illustrated
Newspaper*, the 1868 Mississippi convention journal and Edward McPherson's *Political History of the United States … during
the Period of Reconstruction* (1871), and Wikimedia Commons (NARA, Cooper Hewitt, The Met). Contact sheets per chapter:
`contact/chNN.jpg` (they also show the wall images each chapter reuses, marked `[reuse]`).

**File-name flags.** `LATER_` = made after the period the narration covers; tag it with its own date on screen.
`PROPAGANDA_` = white-supremacist or Lost Cause imagery; show it only as evidence, with context ("a racist cartoon of the time").
Sizes are pixels (w x h); long edge is capped at 3000. Wikimedia rate-limited downloads, so Commons files are 1920 px (or
smaller) standard thumbnails; re-fetch originals later if one needs to be bigger.

**Already in the repo (not re-downloaded):** `tests/public/img/wall/` `senators.jpg` (ch01, ch06, ch10), `fifteenth.jpg`
(ch05, ch10), `firstvote.jpg` (ch03), `johnson.jpg` and `pardons.jpg` (ch02 recap, ch04), `stevens.jpg` (ch04, ch08),
`acres.jpg` (ch08, ch10), `lincoln.jpg`, `seward.jpg`, `booth.jpg`, `stereocard.jpg` (not needed in this episode).
The wall copies of the Currier & Ives print and the Kelly *Fifteenth Amendment* print are only 1024 px wide; for the ch01
Loupe on Revels, re-fetch the LOC master at full size.

**Fact-check #4 (resolved):** in the Currier & Ives print, Revels is seated **far left** (caption: "U.S. Senator H. R. Revels,
of Mississippi"). "Look at the man seated on the left" is correct.

## ch01: The First Black Senator

**Best picks:** the wall print (`wall/senators.jpg`) with a Loupe on Revels, then `revels_oath_leslies_1870_engraving.jpg`
for "took the oath". Davis: `jefferson_davis_1859_brady.jpg`. The 48 to 8 vote: `ny_tribune_1870-02-26_revels_sworn_in_48_8.jpg`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `jefferson_davis_1859_brady.jpg` | Jefferson Davis, three-quarter length, Brady studio, c. 1859 (as a U.S. senator) | loc:2004673617 | 2341x3000 | "Jefferson Davis walked out of the Senate": the senator he was |
| `jefferson_davis_1861.jpg` | Davis carte de visite, "President Jefferson Davis, C.S.A.", 1861 | loc:2021669722 (World Digital Library) | 1789x2720 | Alternate; "to lead the Confederacy" |
| `revels_brady_handy_1870.jpg` | Hiram R. Revels, seated, Brady-Handy glass negative, c. 1870 | loc:2017894095 | 2545x3000 | Main Revels portrait; best for a mask |
| `revels_oath_leslies_1870-03-12_cover.jpg` | *Frank Leslie's* cover, March 12, 1870: "Administering the oath to Hiram Revels, colored senator from the State of Mississippi … February 25, 1870" | iabook:sim_leslies-weekly_1870-03-12_29_754:0 | 1985x3000 | Dated document shot (masthead and caption) |
| `revels_oath_leslies_1870_engraving.jpg` | The same engraving, cropped with its caption: Revels, hand raised, at the Vice-President's desk | same | 2844x3000 | **Key image** for "the Senate voted 48 to 8, and Revels took the oath" |
| `ny_tribune_1870-02-26_revels_sworn_in_48_8.jpg` | *New-York Tribune*, Feb 26, 1870, p.4: referral of his credentials fails "Yeas, 8; Nays, 48", "MR. REVELS SWORN IN", oath vote "Yeas, 48; Nays, 8" | Chronicling America sn83030214 | 680x1270 | Highlight "Yeas, 48; Nays, 8". Native scan resolution; keep it to a card |

## ch02: The Army Goes Back In

**Best picks:** `reconstruction_act_text_mcpherson_1871_p191.jpg` (the Act, with the five districts named state by state) and
`reconstruction_act_sec5_mcpherson_1871_p192.jpg` ("of whatever race, color, or previous condition"; "article fourteen";
"Passed March 2, 1867"), one page per part of the count. Map: `military_map_1869_south_detail.jpg` (then the 3D slab map).
Closing line: `waud_the_freedmens_bureau_harpers_1868-07-25.jpg`. Recap: wall `johnson`, `pardons`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `reconstruction_act_text_mcpherson_1871_p191.jpg` | McPherson, *Political Manual*, p.191: "Reconstruction Act of Thirty-Ninth Congress. An Act to provide for the more efficient government of the rebel States", Secs. 1–4 (Virginia the first district; N.C. and S.C. the second; Ga., Ala., Fla. the third; Miss. and Ark. the fourth; La. and Texas the fifth) | iabook:politicalhistory00lcmcph:204 | 1825x3000 | **Key document.** Parts one: highlight the district list |
| `reconstruction_act_sec5_mcpherson_1871_p192.jpg` | p.192: Sec. 5 (new constitution, voters "of whatever race, color, or previous condition", ratify "article fourteen"), "Passed March 2, 1867", and the start of the supplementary Act (registration oath) | iabook:politicalhistory00lcmcph:205 | 1825x3000 | Parts two and three. The oath also suits ch03 registration |
| `reconstruction_act_votes_and_veto_mcpherson_1871_p166.jpg` | p.166: votes on the bill, "The Senate passed it over the veto", and the start of Johnson's "Veto of the Reconstruction Bill, March 2, 1867" | iabook:politicalhistory00lcmcph:179 | 1825x3000 | "over Johnson's veto" |
| `military_map_of_the_united_states_1869_districts_in_red.jpg` | War Department *Military Map of the United States* (E. Freyhold, 1869), military districts and departments outlined and labelled in red | loc:98685167 (Geography & Map, free to use) | 3000x2130 | Period map. **Dated 1869**: by then several states were readmitted and the districts partly reorganised, so use it as texture, not as the 1867 layout. The 1867 five districts are best drawn as the 3D slab diagram |
| `military_map_1869_south_detail.jpg` | IIIF crop of the South from the same map ("5th Mil. District" across Texas) | same | 3000x1168 | Pan across the South before the diagram |
| `hq_second_military_district_label_nara.jpg` | Printed label "Headquarters Second Military District", with "Map of South and North Edisto" written in | Commons / NARA 70653080 | 1920x775 | Neat tie to Edisto (Second District = the Carolinas) |
| `gen_ord_with_family_1865.jpg` | Maj. Gen. E. O. C. Ord with his wife and daughter, Brady carte, 1865 | loc:2019635491 | 1823x3000 | "each run by a Union general": Ord ran the Fourth District (Mississippi); his General Orders convened Caldwell's convention. Crop to Ord |
| `waud_the_freedmens_bureau_harpers_1868-07-25.jpg` | A. R. Waud, "The Freedmen's Bureau", *Harper's Weekly*, July 25, 1868: a Union officer standing between armed white men and armed freedmen | iabook:sim_harpers-weekly_1868-07-25_12_604:8 (rotated upright) | 3000x2113 | "a government with soldiers, standing on their side". Waud draws both crowds as mobs and the officer as the calm arbiter: show it with context |
| `reconstruction_allegory_1867.jpg` | "Reconstruction" (1867), allegorical lithograph: the Union rebuilt on pillars, with Black and white citizens | Commons / LOC 2004665356 | 1536x1228 | Optional for "Congress was in charge" |

## ch03: The Blacksmith

**Best picks:** `registration_at_the_south_asheville_harpers_1867_crop.jpg` ("hundreds of thousands … registered"),
`electioneering_at_the_south_harpers_1868.jpg` ("they organized"), then Caldwell's name:
`ms_convention_journal_1868_roll_caldwell_p5.jpg` (**the board card for THE BLACKSMITH**). Schools: `freedmen_primary_school_vicksburg_1866.jpg`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `registration_at_the_south_asheville_harpers_1867_crop.jpg` | "Registration at the South: Scene at Asheville, North Carolina" (A. W. Thompson), *Harper's*, Sept 28, 1867 | iabook:sim_harpers-weekly_1867-09-28_11_561:12 | 3000x2071 | Registration crowd. The right edge has a stereotyped dancer and banjo player: frame left of centre |
| `registration_at_the_south_asheville_harpers_1867.jpg` | The full page, with the "Registration Scenes" article | same | 2149x3000 | Dated document shot |
| `electioneering_at_the_south_harpers_1868.jpg` | W. L. Sheppard, "Electioneering at the South", *Harper's*, July 25, 1868: a speaker addressing freedmen and women on benches | iabook:sim_harpers-weekly_1868-07-25_12_604:3 | 3000x2328 | "In churches, at rallies, in political clubs". Some faces are drawn in caricature; keep the frame wide |
| `ms_convention_journal_1868_roll_caldwell_p5.jpg` | *Journal of the Proceedings in the Constitutional Convention of the State of Mississippi, 1868* (pub. 1871), p.5: first-day roll, "The following delegates answered to their names: … Charles Caldwell …" (Jackson, Jan 7, 1868; convened under "General Orders No. 42, Head Quarters Fourth Military District") | iabook:journalofproceed01miss_0:10 | 1698x3000 | **Key document**: his name, line 8 of the roll. Highlight it |
| `ms_convention_journal_1868_first_day_p4.jpg` | p.4, the opening speech of the convention | iabook:journalofproceed01miss_0:9 | 1727x3000 | Second page for a page-turn |
| `freedmen_primary_school_vicksburg_1866.jpg` | "Noon at the primary school for freedmen, Vicksburg, Mississippi" and "Primary school … in charge of Mrs. Green" (A. R. Waud), *Harper's*, June 23, 1866 | loc:2022642515 | 1050x1536 | "public schools … for the first time". Mississippi, but **before** the 1870 state system (a Freedmen's Bureau / missionary school); also ch06 |
| `LATER_blacksmithing_am_college_greensboro_1899.jpg` | "Blacksmithing", students at the Agricultural and Mechanical College, Greensboro, N.C., 1899 (Du Bois/Paris Exposition set) | loc:2001705881 | 640x473 | **Stand-in only** for "he became a blacksmith". Tag "Black blacksmiths, North Carolina, 1899"; never imply it is Caldwell. Small |

## ch04: One Vote Short

**Best picks:** the vote: `impeachment_vote_may16_ross_not_guilty_leslies_1868.jpg`, with the tally documents
`impeachment_judgment_35_19_mcpherson_1871_p282.jpg` and `evening_star_1868-05-16_acquittal_headline_35_19.jpg` (for the
35–19 diagram). Stevens carried in: `stevens_bingham_before_senate_1868.jpg` and the *Evening Star* line "Mr. Stevens was
carried out in his arm-chair". Stevens's death: `stevens_lying_in_state_harpers_1868-08-29_cover.jpg`, then the grave.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `tenure_of_office_act_text_mcpherson_1871.jpg` | McPherson: "An Act regulating the tenure of certain civil offices", 1867 | iabook:politicalhistory00lcmcph:189 | 1825x3000 | {Tenure of Office Act} vocab card |
| `stanton_secretary_of_war.jpg` | "Secretary of War Edwin Stanton", carte de visite | loc:2021669453 (World Digital Library) | 1789x2720 | Stanton portrait (best for a mask) |
| `stanton_1865.jpg` | Stanton, seated, engraving with signature, 1865 | loc:90710898 | 2415x3000 | Alternate |
| `articles_of_impeachment_art1_stanton_mcpherson_1871.jpg` | McPherson: Articles of Impeachment, Article I (the order "for the removal of Edwin M. Stanton") | iabook:politicalhistory00lcmcph:280 | 1825x3000 | "Three days later, the House voted to impeach him" |
| `formal_notice_impeachment_1868.jpg` | Stevens and Bingham giving the Senate formal notice of the impeachment, Feb 25, 1868 (illustrated-paper engraving) | loc:2002697737 | 1536x1009 | "The House accuses" |
| `stevens_bingham_before_senate_1868.jpg` | *Harper's* cover, March 14, 1868: "Impeachment: Thaddeus Stevens and John A. Bingham before the Senate" (T. R. Davis) | loc:00652828 | 2400x3000 | Stevens as a manager; he is seated, frail |
| `stevens_closing_debate_harpers_1868.jpg` | "The Last Speech on Impeachment: Thaddeus Stevens closing the debate in the House, March 2" (sketched by T. R. Davis, 1868) | loc:92520334 | 3000x2412 | "argued the case against him" |
| `senate_court_of_impeachment_1868.jpg` | "The Senate as a Court of Impeachment for the Trial of Andrew Johnson" (sketched by Theodore R. Davis, 1868) | loc:96521681 | 1280x1024 | "the Senate holds a trial" (small) |
| `senate_court_of_impeachment_1868_alt.jpg` | Same subject, alternate printing | loc:2002725328 | 1536x979 | Alternate |
| `ladies_gallery_impeachment_1868.jpg` | "The ladies' gallery of the Senate during the impeachment trial" (W. S. L. Jewett, *Harper's*) | loc:97516412 | 3000x2401 | Crowd texture |
| `summons_preparing_1868.jpg` | Office of the Secretary of the Senate, preparing the summons for President Johnson (1868 engraving) | loc:2003655357 | 1111x1536 | Optional |
| `impeachment_admission_ticket_1868.jpg` | U.S. Senate admission ticket, "Impeachment of the President … Gallery … May 18th 1868" | Commons / U.S. Senate collection | 1499x903 | Object insert. **Dated May 18**, not a vote day (votes were May 16 and 26): don't caption it as vote-day |
| `impeachment_vote_may16_ross_not_guilty_leslies_1868.jpg` | "Taking the vote on the impeachment of President Johnson, Senate Chamber, May 16th, 1868: Senator Ross, of Kansas, voting 'Not Guilty'" (J. E. Taylor, *Leslie's*, June 6, 1868) | iabook:sim_leslies-weekly_1868-06-06_26_662:11 | 3000x2335 | **Key image** for "In May, the Senate voted" |
| `edmund_ross_brady_handy.jpg` | Senator Edmund G. Ross of Kansas, Brady-Handy | Commons (Brady-Handy, PD) | 1920x2271 | The deciding "not guilty" (not named in the script; optional) |
| `impeachment_judgment_35_19_mcpherson_1871_p282.jpg` | McPherson p.282, "The Judgment of the Senate": "The vote was 35 'guilty,' 19 'not guilty'", with every name | iabook:politicalhistory00lcmcph:295 | 1825x3000 | **Key document** under the 35–19 tally diagram |
| `evening_star_1868-05-16_acquittal_extra.jpg` | *Evening Star* (Washington), May 16, 1868, "2d Extra. Impeachment. The Vote on the Eleventh Article. Acquittal of the President", and "4th Extra"; includes "Mr. Stevens was carried out in his arm-chair" | Chronicling America sn83045462 | 2139x3000 | Newspaper page |
| `evening_star_1868-05-16_acquittal_headline_35_19.jpg` | Left-column crop: the headline stack and "The vote resulted 35 to 19" | same | 962x1878 | Headline punch-in |
| `johnson_congratulated_on_acquittal_leslies_1868.jpg` | "President Johnson receiving the congratulations of his friends on the verdict of acquittal", White House (*Leslie's*, June 6, 1868) | iabook:sim_leslies-weekly_1868-06-06_26_662:11 | 3000x2582 | "Either way, Johnson stayed" |
| `stevens_lying_in_state_harpers_1868-08-29_cover.jpg` | *Harper's* cover, Aug 29, 1868: "The body of Thaddeus Stevens lying in state at the Capitol" (after Brady), guarded by Black soldiers | iabook:sim_harpers-weekly_1868-08-29_12_609:0 | 2113x3000 | "Stevens died that summer" |
| `stevens_grave_shreiner_concord_2014_ccby.jpg` | Stevens's tomb, Shreiner-Concord Cemetery, Lancaster, Pa. (**modern photo, 2014**) | Commons, JamesPFisherIII, **CC BY 4.0 (credit required)** | 1280x1024 | "His gravestone says…": the epitaph panel is on the tomb. Tag as a modern photo |

## ch05: The 15th Amendment

**Best picks:** `fifteenth_amendment_joint_resolution_1869_nara.jpg` (the document itself; highlight "race, color, or previous
condition of servitude"), wall `fifteenth.jpg` for the celebration. **Caldwell beat (new):**
`ms_senate_ratifies_15th_caldwell_yea_1870-01-15_mcpherson_p558.jpg`: Mississippi's state Senate ratifying the amendment on
Jan 15, 1870, with "Charles Caldwell" among the yeas (and Revels on p.559). Grant: `grant_brady_nara_526674.jpg`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `grant_brady_nara_526674.jpg` | Gen. Ulysses S. Grant, Brady, c. 1864–65 | Commons / NARA 526674 | 1920x2499 | "the general who had won the war" |
| `grant_nominee_portrait_leslies_1868-06-06.jpg` | Grant, decorative nominee portrait, *Leslie's*, June 6, 1868 | iabook:sim_leslies-weekly_1868-06-06_26_662:7 | 2017x3000 | "That fall, 1868…" |
| `republican_convention_chicago_1868_leslies_cover.jpg` | *Leslie's* cover, June 6, 1868: National Union Republican Convention, Chicago, May 20, 1868 | iabook:…:0 | 2032x3000 | "He was a Republican" |
| `republican_chart_1868_grant_colfax.jpg` | "Republican Chart for the Presidential Campaign, 1868" (Grant & Colfax, platform) | Commons / LOC 2012648821 | 2303x3000 | Campaign document |
| `fifteenth_amendment_joint_resolution_1869_nara.jpg` | The enrolled Joint Resolution proposing the 15th Amendment, 40th Congress, Feb 1869, signed by Colfax and Wade | Commons / NARA 299797 | 1920x2690 | **Key document** for the quoted words |
| `fifteenth_amendment_text_and_vote_mcpherson_p399.jpg` | McPherson: "XVth Constitutional Amendment", printed text and the final votes, Feb 1869 | iabook:politicalhistory00lcmcph:412 | 1825x3000 | Printed text, easier to read than the manuscript; good for the "read it closely" beat |
| `ms_senate_ratifies_15th_caldwell_yea_1870-01-15_mcpherson_p558.jpg` | McPherson p.558, ratification votes by state; bottom right: "Mississippi. Senate, January 15, 1870. Yeas—Messrs. F. M. Abbott, Horatio N. Ballard, Charles Caldwell…" | iabook:politicalhistory00lcmcph:571 | 1825x3000 | **Caldwell's name again**: "It was ratified in 1870". Ties the blacksmith to the amendment |
| `ms_ratifies_15th_revels_yea_mcpherson_p559.jpg` | p.559: the Mississippi Senate yeas continue ("… Hiram R. Revels …—28. Nays—0"), then the House, Jan 17, 1870 | iabook:politicalhistory00lcmcph:572 | 1825x3000 | Revels voted for it as a state senator, weeks before Washington |
| `fifteenth_amendment_and_its_results_1870.jpg` | "The Fifteenth Amendment and its results" (celebration at Baltimore, May 19, 1870) | loc:2003690774 | 3000x2376 | Alternate celebration print |
| `fifteenth_amendment_1870_print.jpg` | Thomas Kelly, "The Fifteenth Amendment" (1870): the same design as `wall/fifteenth.jpg` (parade of May 19, 1870; Grant, Colfax, Dulany, Douglass, Revels medallions) | loc:93510386 | 3000x2386 | **Full-size copy of the wall print**: use it for any zoom or Loupe (the wall file is 1024 px). One small vignette at top left is drawn in caricature |
| `fifteenth_amendment_1871.jpg` | "The Fifteenth Amendment. Signed by President Grant, March 1870" (lithograph, c. 1871): Grant and others at a table, with vignettes ("Justice for all", "A freeman's right", soldier, school) | loc:2006678638 | 3000x2390 | Alternate for "It was ratified in 1870" (monochrome; reads well in B&W) |
| `woman_suffrage_deputation_judiciary_1871.jpg` | House Judiciary Committee receiving a deputation of woman suffragists (Victoria Woodhull reading), *Leslie's*, 1871 | loc:2004670399 | 3000x1931 | "it says nothing about women" |
| `stanton_and_anthony_1880s.jpg` | Elizabeth Cady Stanton (seated) and Susan B. Anthony | loc:97500087 | 2467x3000 | "split the women's movement": the National side. **1880s photo**: tag the date |
| `lucy_stone.jpg` | Lucy Stone, head and shoulders (1840s–60s) | loc:97500092 | 1028x1280 | The American side of the split |

## ch06: Bottom Rail on Top

**Best picks:** the wall print again (`wall/senators.jpg`), then portraits of officeholders: `revels_seated_brady_handy_1870.jpg`,
`john_r_lynch_mississippi_eminent_colored_men_1884.jpg` (Mississippi), `robert_smalls_brady_handy.jpg`. "Cartoons of people
who hated the idea": `PROPAGANDA_black_vomit_bottom_rail_c1867.jpg`. Tweed: `nast_who_stole_the_peoples_money_tweed_ring_1871.jpg`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `revels_seated_brady_handy_1870.jpg` | Revels, three-quarter length, seated by a table, Brady-Handy c. 1870 | loc:90705922 | 1191x1536 | "a minister and a teacher" |
| `revels_brady_handy_1870_alt.jpg` | Revels, second Brady-Handy pose (left half of the double negative) | loc:2017892963 | 1500x1974 | Alternate |
| `john_r_lynch_mississippi_eminent_colored_men_1884.jpg` | "Eminent colored men. Hon. John R. Lynch, of Mississippi" (print, 1884) | loc:2018646819 | 2436x3000 | One of the 16 in Congress; Speaker of the Mississippi House 1872. Print dated 1884 |
| `robert_smalls_brady_handy.jpg` | Robert Smalls, S.C., M.C., Brady-Handy | loc:2017893186 | 2263x3000 | Another of the 16 |
| `LATER_heroes_of_the_colored_race_1881.jpg` | Joseph Hoover, "Heroes of the colored race" (1881): Bruce, Douglass, Revels, with vignettes | loc:00651114 | 3000x2210 | Optional for "two senators, both from Mississippi" (Revels and Bruce). 1881 |
| `PROPAGANDA_black_vomit_bottom_rail_c1867.jpg` | Racist broadside, "The Black Vomit; or, The Bottom Rail on Top" (c. 1867, Virginia) | loc:2023640389 | 1170x1536 | **Propaganda: show as evidence, with context**, for "in the cartoons of people who hated the idea". Brief, dimmed, never full screen without a label |
| `PROPAGANDA_nast_colored_rule_1874.jpg` | Thomas Nast, "Colored Rule in a Reconstructed(?) State" (*Harper's*, 1874): racist caricature of the South Carolina legislature | loc:91705051 | 2071x3000 | **Propaganda** for "Critics, then and later, made that the whole story". Note that even Nast turned. Optional |
| `nast_who_stole_the_peoples_money_tweed_ring_1871.jpg` | Nast, "Who stole the people's money? Do tell. 'Twas him." (the Tammany Ring in a circle), *Harper's*, Aug 19, 1871 | iabook:sim_harpers-weekly_1871-08-19_15_764:3 | 3000x2228 | **Tweed beat** |
| `nast_tweed_ring_vultures_1871.jpg` | Nast, "A group of vultures waiting for the storm to 'blow over'" (Tweed Ring), Sept 1871 | loc:00649771 | 2095x3000 | Alternate |

## ch07: Carpetbaggers and Scalawags

**Best picks:** `carpet_bag_usa_1860s_cooper_hewitt.jpg` (the object, for the insult's origin), `ames_senator_brady_handy.jpg`,
and the seat twist: `senate_roster_1870_mississippi_revels_ames_mcpherson_p507.jpg` ("Mississippi—Hiram R. Revels, Adelbert
Ames") against `nast_time_works_wonders_1870.jpg` (the 1870 cartoon that spread the "Davis's seat" myth).

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `carpet_bag_usa_1860s_cooper_hewitt.jpg` | Carpet bag, USA, 1860–69 (colour) | Commons / Cooper Hewitt 18408269 (PD) | 1920x2383 | "a cheap bag made of carpet" |
| `carpetbag_met_c1860_bw.jpg` | Three carpetbags, c. 1860 (The Met 63.32.46, b/w photo) | Commons, CC0 | 1920x1624 | Alternate |
| `nast_man_with_the_carpet_bags_1872.jpg` | Nast, "The Man with the (Carpet) Bags" (1872; Carl Schurz with a "Carpet Bag South") | loc:99614234 | 1524x1536 | Period use of the word in a cartoon (satire of Schurz, not racial) |
| `PROPAGANDA_strong_government_weak_government_1880.jpg` | *Puck*, J. A. Wales, "The 'Strong' Government 1869–1877 / The 'Weak' Government 1877–1881": the South crushed under a carpetbag, ridden by Grant, with bayonets | loc:93505647 | 2577x3000 | **Lost Cause propaganda: show as evidence, with context**. Optional; also fits "rule by bayonet" (ch02) |
| `alcorn_scalawag_governor_brady_handy_1870.jpg` | James Lusk Alcorn of Mississippi, Brady-Handy c. 1870 (left half of the stereo negative) | loc:2017893312 | 1500x1954 | A real "scalawag": ex-Whig planter, Republican governor of Mississippi 1870 (not named in the script; optional face for the type) |
| `ames_maj_gen_civil_war.jpg` | Maj. Gen. Adelbert Ames in uniform, Brady | loc:2018668540 | 1909x3000 | "a Union general from Maine, ran one of those military districts" |
| `ames_senator_brady_handy.jpg` | "Hon. Adelbert Ames of Miss.", Brady-Handy, seated, c. 1870 | loc:2017893690 | 2343x3000 | **Main Ames portrait** (senator era); the board card |
| `senate_roster_1870_mississippi_revels_ames_mcpherson_p507.jpg` | McPherson p.507, members of the 41st Congress: "Mississippi*—Hiram R. Revels, Adelbert Ames"; footnote "Mr. Revels qualified February 25, 1870; Mr. Ames, April 1, 1870" | iabook:politicalhistory00lcmcph:520 | 1825x3000 | **Key document** for "Mississippi has two Senate seats" |
| `nast_time_works_wonders_1870.jpg` | Nast, "Time Works Wonders" (*Harper's*, April 9, 1870): Jefferson Davis as Iago glaring at Revels in the Senate, captioned "the lusty Moor hath leap'd into my seat" | loc:93508073 | 2385x3000 | "You might hear that Revels took Jefferson Davis's old seat": the 1870 source of the myth. Nast is pro-Revels, but the Othello caption plays on race: show with context |

## ch08: No Land

**Best picks:** `sharecropping_contract_desoto_ms_1867.jpg` (a real Mississippi contract, 1867: the freedman signs with an X;
the landowner pays "one half of the crop … after deducting the amount he may advance"), the Bureau contract
`freedmens_bureau_labor_agreement_truss_hall_1865_nara.jpg`, and `picking_cotton_near_montgomery_alabama_stereo.jpg`. Plot
callback: `wall/acres.jpg` (powers-of-ten).

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `freedmens_bureau_labor_agreement_truss_hall_1865_nara.jpg` | Freedmen's Bureau labor agreement, Lumberton, N.C., Aug 28, 1865: Robert McKenzie to pay Truss B. Hall "$4.00 per month until 25th day of December next" for "true and faithful service" and to "obey all lawful commands"; Hall signs with his mark | Commons / NARA 595055 | 892x720 | "The Freedmen's Bureau pushed them to sign work contracts" |
| `freedmens_bureau_labor_agreement_montgomery_1866_nara.jpg` | Agreement of labor for a Mr. Montgomery and others, Dec 24, 1866 (list of hands and wages) | Commons / NARA 595058 | 405x945 | Alternate (small) |
| `sharecropping_contract_desoto_ms_1867.jpg` | Handwritten contract, De Soto County, Mississippi, Feb 4, 1867: W. J. Johnson and freedman Daniel [Elias], land, team and tools, half the crop | IA sc2014.069 (Salisbury Univ. Nabb Center; **Public Domain Mark**) | 2317x3000 | **Key document** for "So they landed on a deal": land, mule, tools, split the crop. Also the board card for SHARECROPPING if the plot callback is not used |
| `picking_cotton_near_montgomery_alabama_stereo.jpg` | Stereograph "Picking cotton near Montgomery, Alabama" (date uncertain; LOC dates it 1860s) | loc:2012648057 | 3000x1508 | The family at work. Crop one half |
| `LATER_cotton_picking_mississippi_1896.jpg` | "Cotton picking, Mississippi", 1896 | loc:2006686821 | 1522x1536 | Tag "1896" |
| `LATER_picking_cotton_arkansas_1906.jpg` | Stereograph, "Picking cotton, cotton fields of Arkansas", 1906: woman and children with a basket | loc:2022642595 | 1224x1536 | "A family working together". Tag "1906" |
| `LATER_old_cabin_c1906.jpg` | "Old Negro cabin" (Detroit Publishing, c. 1906) | loc:2011660962 | 1536x1210 | "with a cabin". Tag the date |

## ch09: The Debt

**Best picks:** `promissory_note_desoto_ms_1867.jpg` (a freedman's debt due "on or before the 25 day of December next",
i.e. after harvest, with revenue stamps), the ledger diagram (drawn), `convicts_leased_to_harvest_timber_florida_1915.jpg`
for convict leasing. Callback: the 13th Amendment from Episode 1.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `promissory_note_desoto_ms_1867.jpg` | Promissory note, De Soto County, Miss., April 17, 1867: "On or before the 25 day of December next I promis to pay S M McGehee the sum of Thirty four 55/100 Dollars for a wagon", with two 2-cent revenue stamps (same file as the contract) | IA sc2014.069:3 (**PDM**) | 1790x1330 | "So they bought what they needed on credit": the debt falls due after harvest. Cropped to the note |
| `LATER_weighing_cotton_texas_1904.jpg` | Stereograph, "Weighing cotton, in one of the large cotton fields in Texas", 1904 | loc:93500568 | 3000x2402 | "The crop is sold": the weigh-up. Tag "1904" |
| `LATER_commissary_gold_dust_plantation_ms_1937.jpg` | Commissary (plantation store) of the Gold Dust Plantation near Clarksdale, Mississippi, 1937 (FSA) | loc:2017770199 | 3000x2403 | "the store was often owned by the planter". **1937**: tag it |
| `convicts_leased_to_harvest_timber_florida_1915.jpg` | "Convicts Leased to Harvest Timber" (Florida, c. 1915): four Black men in striped uniforms | loc:2021669926 (World Digital Library / State Archives of Florida) | 3000x2832 | **Convict leasing.** Tag the date (later than the narration's start, but the system it describes) |
| `LATER_convict_system_of_alabama_dawson_1892_cover.jpg` | R. H. Dawson (president, Alabama Board of Inspectors of Convicts), *The Convict System of Alabama, as it was and as it is* (1892) | iabook:convictsystemofa00daws:0 | 1886x3000 | Official document title for "It's called convict leasing. And it was legal." Written by the system's own inspector |

## ch10: The Ground They Stood On

No new files: this chapter replays the episode over the board. Suggested order (see `contact/ch10.jpg`): Revels's oath
(`ch01/revels_oath_leslies_1870_engraving.jpg`) → wall print → the 1869 map and Waud's *Freedmen's Bureau* ("the soldiers who
protected them") → the 15th Amendment pages → the Edisto card (`wall/acres.jpg`, LANDLESS circled) → the 1867 contract →
Caldwell's two documents (the convention roll and the 1870 ratification yea) on "Charles Caldwell was still in the state senate".

## Gaps

- **Charles Caldwell: no portrait found.** Not at LOC, Commons, IA or in the period illustrated papers. (MDAH not searchable
  from here; check it before the narration says none survives.) **Stand-ins found:** his name on the 1868 convention roll
  (ch03) and in the Mississippi Senate's Jan 15, 1870 vote ratifying the 15th Amendment (ch05). Use the 1899 blacksmith
  photo only as a labelled stand-in for the trade.
- **Caldwell's 1873 militia commission** (ch10): no document found online. Use his two documents again, or an engraving of a
  Black militia company from Episode 3's search.
- **Clinton, Mississippi / the Old Capitol in Jackson:** LOC's c.1900 Old Capitol photo is not digitised (thumbnail only). No
  period view of Clinton found.
- **Crop-lien contract and store ledger (ch09):** no public-domain crop-lien form or Reconstruction-era store ledger with page
  images was found (one 1899 S.C. "Negro ledger" on IA has no page images and a BY-NC-ND upload licence). The 1867 promissory
  note and the contract's "after deducting the amount he may advance" clause cover the idea; the settling-up sum should be the
  drawn ledger diagram the production notes already plan.
- **Convict leasing in the 1870s:** no period photograph exists online that passes the licence test; the best image is the
  c. 1915 Florida photo (tag it). Mississippi's 1870s penitentiary/lessee reports were not found on IA.
- **1867 military-district map:** no period map of the five original districts was found; the 1869 War Department map shows
  the later arrangement. Draw the 1867 districts as the planned 3D diagram.
- **Sharecropping in the 1870s:** no dated 1870s photograph of a sharecropping family found; the field images are 1860s–1906
  stereographs and photos, tagged `LATER_` where needed.
- **Hospitals, roads, railroads (ch06):** not searched in depth; low priority (one line of narration).
- **Garrison Frazier (ch08 callback):** no image exists; reuse Episode 1's treatment.
