# Landless, Homeless, Voteless (Reconstruction, Part 1): archival images

105 files in `ch01/`–`ch10/` (about 110 MB), all public domain: U.S. federal records (National Archives), LOC items marked
"No known restrictions" or published before 1930, Chronicling America pages (1865–66), and Commons files tagged PD. Every
file has a credit in `credits_ep1.json` (keys are relative to `img/ep1`; merge into the main credits file). Sizes are
pixels (w x h); long edge is 3000 px or less. Contact sheets of each chapter: `contact/chNN.jpg` (repo images used in that
chapter are shown at the end of each sheet, marked "(repo)").

Newspaper crops come from `tools/phrase_find.py`. Each has a `.json` beside it with the line boxes of the phrases, already
rescaled to the saved JPEG, for highlighter swipes.

Downloaded with `tools/find_images.py` / `commons.py`, or by hand:
- **NARA catalog**: the `catalog.archives.gov/proxy/records/search` JSON plus the microfilm frame JPEGs. These are federal
  records, so public domain.
- **LOC IIIF** (curl), with rights checked on each item record.
- **Commons**: 1920 px thumbnails, because originals were rate-limited (429). Commons files are marked "(thumb)" in the
  credits note.

**Already in the repo (not re-downloaded)** and where they fit:
- `tests/public/img/wall/` lincoln (ch03, ch04), johnson (ch04, ch05, ch09), seward (ch04), booth (ch04), stevens (ch05,
  ch09), pardons (ch05), acres (ch02, ch10), firstvote (ch07, dimmed BUREAU card), senators (ch10 tease), fifteenth (not
  Ep 1).
- `tests/public/img/ch06/` thirteenth_src (ch06), ms_freedmen_act and ms_vagrant_act (ch06).
- `wall/seward.jpg` and `wall/booth.jpg` are the same photographs as `ch04/seward_brady.jpg` and
  `ch04/booth_carte_de_visite_1865.jpg`. The ch04 copies are the high-resolution versions.

**Hero documents:** `ch01/edisto_petition_to_president_28oct1865_p3.jpg` ("We wish to have A home if It be but A few
acres", with the three signatures) and `ch01/edisto_letter_landless_homeless_voteless_detail.jpg` (the three words, in
Bram's hand). Both are the original manuscripts, located on the National Archives microfilm of the Freedmen's Bureau
Commissioner's letters received (M752).

### Fact-check notes found while searching (please read before voicing)

1. **ch09, "why not hang Thad Stevens?" The accounts disagree.**
   - The verbatim press transcript of the Cleveland speech (New-York Tribune, Sept. 5, 1866, and the Worcester Daily Spy,
     Sept. 5) gives the line to *a heckler*: `[A voice—"Hang Thad Stevens and Wendell Phillips."] Hang Jeff. Davis! Why
     don't you hang him?`
   - The Philadelphia Evening Telegraph (Sept. 10, 1866), summing up the tour speeches, quotes *Johnson*: "Then I would ask
     you:—'Why not hang Thad. Stevens and Wendell Phillips?'"
   - A period cartoon (`ch09/hang_thaddeus_nast_cartoon_1866.jpg`) also puts the line in Johnson's mouth.
   - Suggest hedging, e.g. "By one newspaper's account, Johnson shot back…", or rewording to what the transcripts agree on:
     Johnson traded shouts with hecklers about hanging Jefferson Davis, and newspapers reported him asking why not hang
     Thad Stevens. All three clippings are in ch09.
2. **ch02, Frazier's words.**
   - The New-York Daily Tribune (Feb. 13, 1865), the source named in the fact-check table, reads exactly "to have land,
     and turn it and till it by our own labor". The script is right.
   - The Liberator's reprint (Feb. 24) misprints "turn in"; if the Liberator crop is used, don't swipe that word.
   - The Tribune's list of ministers confirms "Garrison Frazier, aged 67 years … Slave until eight years ago, when he
     bought himself and wife, paying $1,000 in gold and silver."
3. **ch01, the three words.**
   - The manuscript reads `Landless. Homeless. Voteless.` (written with the long s: "Landlefs. Homelefs. Votelefs."), each
     word followed by a period.
   - The letter is filed as B-53 1865. The petition to the President is P-27 1865: received by the President Nov. 9, 1865,
     and "Respectfully referred to Maj Gen O O Howard … By order of the President" (see its docket).
4. **ch05, the Stevens Lancaster speech.** The 1865 pamphlet's title page dates it "September 7th, 1865" (often given as
   Sept. 6).
5. **ch04, Lincoln's last speech.** Confirmed in the Washington Evening Star, Apr. 12, 1865: "I would myself prefer that
   it were now conferred on the very intelligent, and on those who serve our cause as soldiers."
6. **ch04, the drunk swearing-in.** The Cleveland Morning Leader's "The Inaugural Disgrace" (Mar. 13, 1865) says Johnson
   presented "himself, drunk, before the Senate". The same column then says "He is not … an habitual drunkard". That is
   a good period echo of "Andy ain't a drunkard".

### Content flags
- **Violence (ch09).** The Memphis and New Orleans engravings show killings and burning. Use them plainly, per the
  heavy-chapter note.
- **Caricature (ch07).** `ch07/cruel_uncle_vetoed_babes_cartoon_1866.jpg` (Frank Leslie's, 1866) is anti-Johnson, but it
  draws the "babe" for the Freedmen's Bureau as a stereotyped Black child. Show it only as evidence, with context, or crop
  to Johnson.
- **Check before use (ch07).** `ch07/man_that_blocks_up_the_highway_cartoon_1866.jpg` is a crowded 1866 lithograph. Check
  every figure at full size before using it.
- **Not downloaded.** The 1866 Democratic poster "The Freedman's Bureau! An agency to keep the Negro in idleness…" (LOC
  2008661698) is white-supremacist propaganda, and the script doesn't discuss it. It is listed only in case the editor
  wants it as evidence.

---

## ch01

**Best picks:**
1. Open on `edisto_petition_to_president_28oct1865_p1.jpg` ("Edisto Island S.C. Oct 28th 1865. To the President of these
   United States").
2. Swipe "We wish to have A home if It be but A few acres" on `edisto_petition_to_president_28oct1865_p3.jpg`.
3. Push into the signatures on the same page.
4. For "three words", use `edisto_letter_landless_homeless_voteless_detail.jpg`.
5. Island atmosphere: `edisto_freedpeople_hopkinson_plantation_1862_moore.jpg` (actual Edisto people, 1862).

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `edisto_petition_to_president_28oct1865_p1.jpg` | Petition of the Edisto committee to the President, Oct. 28, 1865, p.1 ("P27" in the corner) | NARA M752 roll 23, frame 447 (RG 105) | 2027x3000 | **Key document**: "This is their letter … look at the handwriting" |
| `edisto_petition_to_president_28oct1865_p2.jpg` | Page 2 ("We wish to have A home" starts at the foot) | NARA M752 roll 23, frame 448 | 2008x3000 | Pan between pages |
| `edisto_petition_to_president_28oct1865_p3.jpg` | Page 3: "We wish to have A home if It be but A few acres" … "In behalf of the Freedmen, Henry Bram, Ishmael Moultrie, Yates Sampson, Committee" | NARA M752 roll 23, frame 449 | 1992x3000 | **Hero**: coral swipe on the quote, then the three signatures |
| `edisto_petition_docket_P27_1865.jpg` | Executive Office docket, Nov. 9, 1865: "Case of Freedmen of Edisto Island … Remonstrate against their removal and the restoration of those lands to the Rebel owners. Respectfully referred to Maj Gen O O Howard … By order of the President" | NARA M752 roll 23, frame 445 | 2091x2829 | "The President had already said no": the petition passed straight back to Howard |
| `edisto_petition_received_by_president_stamp.jpg` | Back of the petition: "Received by the President Nov 9 1865" stamp | NARA M752 roll 23, frame 446 | 2348x3000 | Insert/detail |
| `edisto_letter_to_howard_oct1865_p1.jpg` | Committee letter to Howard [Oct. 20/21, 1865], p.1: "General we want Homestead's; we were promised Homestead's by the government" | NARA M752 roll 19, frame 849 | 1970x2672 | Also **ch05** ("promised Homestead's" swipe) |
| `edisto_letter_to_howard_oct1865_p2.jpg` | p.2 | NARA M752 roll 19, frame 850 | 1970x2672 | Optional |
| `edisto_letter_to_howard_oct1865_p3.jpg` | p.3 ("The man who tied me to a tree & gave me 39 lashes…") | NARA M752 roll 19, frame 851 | 1970x2672 | Optional |
| `edisto_letter_to_howard_oct1865_p4.jpg` | p.4: "Landless. Homeless. Voteless." and the three signatures | NARA M752 roll 19, frame 852 | 1958x2672 | **Three words** (full page) |
| `edisto_letter_landless_homeless_voteless_detail.jpg` | Crop of p.4: "The state will make laws that we shall not be able to Hold land even If we pay for It. Landless. Homeless. Voteless." | NARA M752 roll 19, frame 852 (crop) | 1700x961 | **Motif card source** (ch01 + ch10) |
| `edisto_letter_to_howard_docket_B53_1865.jpg` | Docket: "B 53 … Edisto Island S.C. Bram, Henry, Ishmael Moultrie & Yates Sampson, Committee in behalf of the people. Remonstrate against being deprived of the lands which were promised to them by the Govt." | NARA M752 roll 19, frame 848 | 1237x2589 | Alternate insert |
| `edisto_freedpeople_hopkinson_plantation_1862_moore.jpg` | Henry P. Moore, freedpeople with a mule cart, Hopkinson's plantation, Edisto Island, 1862 (LOC title uses "Negro slaves"; Union-occupied, people freed by the war) | loc:2015650290 | 3000x2055 | "islands like this one"; also the mule for ch02. Tag "1862" |
| `edisto_gwine_to_de_field_hopkinson_1862_moore.jpg` | Same scene, Moore's mounted print with his caption "Gwine to de Field" | loc:2010651643 | 3000x2375 | Alternate (shows caption) |
| `edisto_sweet_potato_planting_hopkinson_1862_moore.jpg` | Moore, "Sweet potato planting, Hopkinson's Plantation", Edisto, 1862 | loc:2010651644 (IIIF crop of the mount) | 3000x2286 | "They had planted it." Tag "1862" |

**Gaps:**
- No portraits of Henry Bram, Ishmael Moultrie or Yates Sampson. Their handwriting and signatures stand in.
- The 1834 South Carolina law against teaching enslaved people to write was not fetched. Its period printing should be
  in IA's *Acts of the General Assembly of South Carolina* volumes (`find_images.py books "Acts of the General Assembly of
  South-Carolina"`); otherwise use a text card.

## ch02

**Best picks:**
- Order: `field_order_15_printed_jan1865_p1.jpg` (period printing, "Special Field Orders, No. 15", "not more than (40)
  forty acres" at the foot).
- People: `sherman_brady_1865.jpg` and `stanton_1865.jpg`.
- Meeting: `savannah_meeting_minutes_ny_tribune_13feb1865.jpg` (swipe "to have land … by our own labor").
- Place: `meldrim_house_sherman_hq_savannah_1865.jpg`.
- Followers: `contrabands_following_sherman_leslies_18mar1865.jpg`.
- Map: `map_military_dept_south_ga_sc_fl_1865.jpg` for the whole strip, then
  `map_seacoast_sc_ga_bulls_bay_to_ossabaw_1863_coast_survey.jpg` for Edisto–Savannah, then the repo `wall/acres.jpg` render.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `field_order_15_printed_jan1865_p1.jpg` | Special Field Orders No. 15, Savannah, Jan. 16, 1865, printed order, sections I–III | loc:mss83434256 (Gladstone Collection), crop | 1542x2572 | **Key document** (LAND card) |
| `field_order_15_printed_jan1865_p2.jpg` | Same, sections IV–VI and "By order of Major General W. T. Sherman, L. M. Dayton" | loc:mss83434256, crop | 1645x2570 | Second page / signature line |
| `savannah_meeting_minutes_ny_tribune_13feb1865.jpg` (+`.json`) | Minutes of the Jan. 12, 1865 meeting, New-York Daily Tribune, Feb. 13, 1865, p.5: the 20 ministers, Frazier "aged 67 … bought himself and wife", his answers | Chronicling America sn83030213 | 1764x3000 | **Frazier quote** swipe; the source the fact-check names |
| `savannah_meeting_minutes_liberator_24feb1865.jpg` (+`.json`) | Same minutes in The Liberator, Feb. 24, 1865, p.1, with the clean heading "Minutes of an interview between the colored ministers and church officers at Savannah with the Secretary of War and Major-General Sherman" | Chronicling America sn84031524 | 1825x3000 | Heading shot (prints "turn in": don't swipe that word) |
| `sherman_brady_1865.jpg` | William T. Sherman, Brady studio, May 1865 (mourning band on his arm) | loc:2018666487 | 1941x3000 | Sherman portrait |
| `sherman_brady_handy.jpg` | Sherman in civilian dress, Brady-Handy (postwar) | loc:2017894201 | 2458x3000 | Alternate; tag "later" |
| `stanton_1865.jpg` | Edwin M. Stanton, engraved portrait, 1865 | loc:90710898 | 2415x3000 | "the Secretary of War" |
| `stanton_brady_handy.jpg` | Stanton, Brady-Handy photograph | loc:2017896364 | 2248x3000 | Alternate (face for a mask) |
| `meldrim_house_sherman_hq_savannah_1865.jpg` | Green–Meldrim house, Sherman's headquarters, Savannah, 1865 (where the meeting was held) | loc:2018671291 | 2808x3000 | "sat down with 20 Black ministers in Savannah" |
| `contrabands_following_sherman_leslies_18mar1865.jpg` | "Contrabands accompanying the line of Sherman's march through Georgia", Frank Leslie's, Mar. 18, 1865 | loc:94514955 | 3000x2392 | "Thousands of freedpeople followed it" |
| `freedpeople_to_cotton_field_st_helena_island_1863.jpg` | Stereo: freedpeople going to the cotton field, St. Helena Island, S.C., 1863 | loc:2015646735 | 3000x1523 | "40,000 people farming that land" (Sea Islands, not Edisto; tag the place) |
| `map_military_dept_south_ga_sc_fl_1865.jpg` | "Part of the military department of the South, embracing portions of Georgia and South Carolina…", 1865 | loc:99447223 | 2319x3000 | Whole Field Order strip, Charleston to the St. Johns |
| `map_seacoast_sc_ga_bulls_bay_to_ossabaw_1863_coast_survey.jpg` | Coast Survey sketch of the sea coast, Bull's Bay to Ossabaw Sound, 1863 (Edisto, Savannah) | loc:2006636151 | 3000x1282 | Powers-of-ten middle step |
| `map_coast_sc_charleston_to_hilton_head_1862.jpg` | "Coast of South Carolina from Charleston to Hilton Head", 1862 | loc:99448824 | 3000x1921 | Edisto close step |
| (repo) `wall/acres.jpg` | Field Order 15 strip render | repo | 1920x1080 | LAND card / zoom end |

**Gaps:**
- No portrait of Garrison Frazier is known. The printed minutes with his name and the Meldrim house stand in.
- No image of mules being lent: the mule cart in `ch01/edisto_freedpeople_hopkinson_plantation_1862_moore.jpg` can carry
  "a mule".

## ch03

**Best picks:**
- Ten Percent Plan: `lincoln_amnesty_proclamation_8dec1863_p3_one_tenth_clause.jpg` (manuscript; "not less than one
  tenth in number of the votes cast"), opening on p1 ("Proclamation", red seal).
- Wade-Davis: `wade_davis_bill_text_printed_1864_p2_majority_clause.jpg` (swipe "a majority of the persons enrolled").
- Pocket veto: `lincoln_proclamation_wade_davis_pocket_veto_8jul1864.jpg`.
- Lincoln: repo `wall/lincoln.jpg` or `ch04/lincoln_gardner_feb1865.jpg`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `lincoln_amnesty_proclamation_8dec1863_p1_title.jpg` | Proclamation of Amnesty and Reconstruction, Dec. 8, 1863, signed manuscript, p.1 with seal | loc:mal2849300 (Lincoln Papers) | 1939x3000 | TEN PERCENT card |
| `lincoln_amnesty_proclamation_8dec1863_p3_one_tenth_clause.jpg` | Same, p.3: the one-tenth clause | loc:mal2849300 | 1942x3000 | **Key**: swipe the clause |
| `lincoln_amnesty_proclamation_8dec1863_p7_signed.jpg` | Same, last page: "Abraham Lincoln", seal | loc:mal2849300 | 1951x3000 | Signature insert |
| `wade_davis_bill_text_printed_1864_p2_majority_clause.jpg` | 1864 printing: Lincoln's signature block, then "A Bill to guarantee to certain States … a republican form of government"; Sec. 2 "if the persons taking that oath shall amount to a majority" | loc:scsm000581 | 1516x2219 | **Wade-Davis majority** swipe |
| `lincoln_proclamation_wade_davis_pocket_veto_8jul1864.jpg` | "Plan of restoration of states in rebellion. By the President … a proclamation", July 8, 1864 (Lincoln explains why he did not sign) | loc:scsm000581 | 1508x2240 | "Lincoln let it die" |
| `benjamin_wade_c1859.jpg` | Sen. Benjamin F. Wade (Ohio), c.1859, from a congressional album (with signature) | loc:2010649330 | 2315x3000 | Name card for Wade |
| `henry_winter_davis_brady_handy.jpg` | Rep. Henry Winter Davis (Md.), Brady-Handy, full length | loc:2017896176 | 1784x3000 | Name card for Davis |
| (repo) `wall/lincoln.jpg` | Lincoln | repo | 1080x1446 | TEN PERCENT card |

**Gaps:**
- No group image of the Radical Republicans. Use Stevens (`ch05/thaddeus_stevens_brady_handy.jpg`), Wade and Davis as a
  row of three.

## ch04

**Best picks:**
- Surrender: `mclean_house_appomattox_april1865.jpg`.
- Speech: `lincoln_last_speech_evening_star_12apr1865.jpg` (swipe "the very intelligent, and on those who serve our cause
  as soldiers").
- Booth: `booth_carte_de_visite_1865.jpg`.
- Theatre: `fords_theatre_exterior_april1865.jpg` and `our_american_cousin_playbill_fords_theatre_14apr1865.jpg`.
- The box: `fords_theatre_presidents_box_april1865.jpg`.
- The shot: `assassination_of_lincoln_currier_ives_1865.jpg`.
- The jump: `assassin_retreating_across_stage_leslies_1865.jpg`.
- Death: `lincoln_deathbed_currier_ives_1865.jpg`.
- Seward: `seward_brady.jpg` and `national_calamity_lincoln_seward_assassinated_broadside_15apr1865.jpg`.
- Johnson: `johnson_oath_kirkwood_house_15apr1865.jpg`.
- Drunk: `johnson_inauguration_drunk_editorial_cleveland_leader_13mar1865.jpg`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `mclean_house_appomattox_april1865.jpg` | McLean house, Appomattox Court House, April 1865 (O'Sullivan) | loc:2018670544 | 3000x2524 | "The main Confederate army surrenders" |
| `lee_leaving_mclean_house_waud_9apr1865.jpg` | A. R. Waud pencil sketch, "Genl. Lee leaving the McLean house after the surrender", Apr. 9, 1865 | loc:2004660288 | 1832x3000 | Alternate (faint; lift contrast) |
| `lincoln_last_speech_evening_star_12apr1865.jpg` (+`.json`) | Lincoln's Apr. 11 speech, Evening Star (Washington), Apr. 12, 1865: "elective franchise … very intelligent … serve our cause as soldiers" | Chronicling America sn83045462 | 1249x763 | **Key quote** swipe |
| `lincoln_gardner_feb1865.jpg` | Lincoln seated with spectacles and pencil, Alexander Gardner, Feb. 5, 1865 | loc:98504569 | 2133x2999 | ONE NIGHT card (Lincoln); high-res alternate to the wall image |
| `booth_carte_de_visite_1865.jpg` | John Wilkes Booth, carte de visite | loc:2008680389 | 1836x3000 | High-res of `wall/booth.jpg` |
| `booth_reward_poster_100000_april1865.jpg` | War Department reward broadside, Apr. 20, 1865 ("$100,000 Reward! The murderer of our late beloved President … is still at large"), with photos of Booth, Surratt, Herold | loc:96521960 | 2396x3000 | "escapes out the back" |
| `fords_theatre_exterior_april1865.jpg` | Ford's Theatre draped in mourning crepe, 1865 | loc:2009633713 | 3000x2271 | Establishing shot |
| `our_american_cousin_playbill_fords_theatre_14apr1865.jpg` | Playbill: Ford's Theatre, Friday evening, Apr. 14, 1865, "Our American Cousin", Laura Keene | loc:scsm000285 | 905x3000 | "a comedy at Ford's Theatre" (wall card item) |
| `fords_theatre_presidents_box_april1865.jpg` | The President's box, draped with flags, April 1865 | loc:2018671198 | 2949x3000 | "slips into the President's box" |
| `assassination_of_lincoln_currier_ives_1865.jpg` | Currier & Ives, "The assassination of President Lincoln at Ford's Theatre", 1865 | loc:90708801 | 3000x2164 | The shot (period print, not an eyewitness view) |
| `assassin_retreating_across_stage_leslies_1865.jpg` | Frank Leslie's page, 1865: "the assassin retreating across the stage", Ford's Theatre exterior below | loc:99613996 | 1070x1536 | The jump to the stage |
| `lincoln_deathbed_currier_ives_1865.jpg` | "The death bed of the martyr President Abraham Lincoln", Apr. 15, 1865 | loc:91792453 | 3000x2299 | "Lincoln dies early the next morning" |
| `petersen_house_and_seward_house_leslies_1865.jpg` | Leslie's page: the Petersen house where Lincoln died; Seward's house on Lafayette Square | loc:99613992 | 978x1536 | Seward beat (his house) |
| `seward_brady.jpg` | William H. Seward, Brady | loc:2018666383 | 1946x3000 | High-res of `wall/seward.jpg` |
| `national_calamity_lincoln_seward_assassinated_broadside_15apr1865.jpg` | "Courier–Extra. National Calamity! Lincoln & Seward Assassinated!!", Apr. 15, 1865 | loc:scsm000429 | 2092x3000 | "Across town … Seward is stabbed. He survives." (the extra wrongly reports Seward dead later that morning: crop to the top) |
| `lewis_powell_payne_gardner_1865.jpg` | "Payne, alias Wood, alias Hall, arrested as an associate of Booth" (Lewis Powell, Seward's attacker), Gardner, 1865 | loc:2019635488 | 1798x3000 | Optional: the man sent for Seward (unnamed in the script) |
| `johnson_oath_kirkwood_house_15apr1865.jpg` | Leslie's: Andrew Johnson taking the oath in the Kirkwood House parlor, Apr. 15, 1865 | loc:00650930 | 3000x2370 | "by morning … President of the United States" |
| `johnson_brady_handy_full_length_1865.jpg` | President Andrew Johnson, full length, Brady-Handy (cracked plate) | loc:2017895079 | 2420x3000 | Alternate; plate damage visible |
| `lincoln_second_inauguration_4mar1865_gardner.jpg` | Inauguration day, Mar. 4, 1865: crowd at the Capitol's east front (Gardner) | loc:2009633604 | 3000x2184 | "Six weeks earlier, at his swearing-in" (Johnson's oath was inside, in the Senate chamber) |
| `johnson_inauguration_drunk_editorial_cleveland_leader_13mar1865.jpg` (+`.json`) | "The Inaugural Disgrace", Cleveland Morning Leader, Mar. 13, 1865: "presenting himself, drunk, before the Senate … not … an habitual drunkard" | Chronicling America sn83035143 | 805x3000 | **Drunk swearing-in** document |
| (repo) `wall/lincoln.jpg`, `wall/johnson.jpg`, `wall/seward.jpg`, `wall/booth.jpg` | Board portraits | repo | ~1024 | ONE NIGHT, THREE MEN close-up |

**Gaps:**
- No image of Lincoln speaking from the White House window on Apr. 11. Use the Evening Star text, or an 1865 White House
  photo (not fetched; the LOC Civil War photos have several).
- No period engraving of the attack on Seward was found. Use the broadside, Seward's house and Powell's photo.
- No picture of Johnson's Senate-chamber swearing-in. Use the editorial plus the inauguration-day photo.

## ch05

**Best picks:**
- Johnson: `andrew_johnson_portrait_b.jpg` (engraving) or repo `wall/johnson.jpg`.
- "Treason must be made odious": `treason_must_be_made_odious_ny_tribune_17apr1865.jpg`.
- Tailor and pardon line: `johnson_pardoning_rebels_white_house_1865.jpg`. This is a Harper's Weekly cover, Oct. 14,
  1865, with the tailor shop at the top and pardon-seekers at the White House below.
- A real Edisto planter asking Johnson for a pardon: `pardon_application_mikell_edisto_planter_aug1865_p1.jpg`.
- Land: `edisto_seabrook_mansion_1862_moore.jpg`.
- Howard: `oliver_otis_howard_portrait.jpg`.
- Homesteads: `ch01/edisto_letter_to_howard_oct1865_p1.jpg`.
- Stevens: `thaddeus_stevens_brady_handy.jpg` and `stevens_lancaster_speech_reconstruction_1865_title.jpg`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `andrew_johnson_portrait_b.jpg` | Andrew Johnson, engraved portrait with the Capitol behind and his signature, c.1865 | loc:2003664866 | 2433x3000 | Johnson card (high-res) |
| `andrew_johnson_portrait_1865.jpg` | Johnson, carte de visite, A. Bogardus & Co., N.Y., 1865 | loc:2004678590 | 939x1536 | Alternate (clean face) |
| `treason_must_be_made_odious_ny_tribune_17apr1865.jpg` (+`.json`) | Johnson's remarks, New-York Daily Tribune, Apr. 17, 1865: "My notion is that treason must be made odious, that traitors must be punished and impoverished" | Chronicling America sn83030213 | 1085x560 | **Quote** swipe |
| `johnson_pardoning_rebels_white_house_1865.jpg` | Harper's Weekly cover, Oct. 14, 1865: "Andrew Johnson's tailor-shop in Greenville [sic], Tennessee" (photo by J. B. Reef) above "President Andrew Johnson pardoning Rebels at the White House" (Stanley Fox) | loc:2008680257 | 2424x3000 | **Two beats on one page**: "He worked as a tailor" and "lining up outside his office" |
| `pardon_application_mikell_edisto_planter_aug1865_p1.jpg` | J. Jenkins Mikell, Edisto Island planter, petitions "His Excellency Andrew Johnson", Aug. 1865: "being embraced in 13th exception" (over $20,000); $7,000 "for his Lands on Edisto Island (1765 acres)" | NARA M1003 roll 46 (amnesty papers, S.C.) | 1952x3000 | **"they did … by the thousands"**: an Edisto planter in the queue |
| `pardon_application_mikell_edisto_planter_aug1865_p2.jpg` | Mikell application, p.2 (the freedmen and the island; sworn Aug. 1865) | NARA M1003 roll 46 | 1992x3000 | Second page |
| `amnesty_oath_mikell_edisto_planter_1865.jpg` | Printed amnesty oath under the May 29, 1865 proclamation, signed by Mikell, "of Edisto Island", aged 57, "by profession a Planter" | NARA M1003 roll 46 | 2277x3000 | "Most white Southerners who swore loyalty got a pardon" |
| `edisto_seabrook_mansion_1862_moore.jpg` | Mansion of John E. Seabrook, Edisto Island, 1862 (Moore) | loc:2010651641 (crop) | 3000x2296 | "your property back. Including land like Edisto" |
| `edisto_hopkinson_mansion_1862_moore.jpg` | Mansion of James Hopkinson, Edisto Island, 1862 (Moore) | loc:2010651645 (crop) | 3000x2301 | Alternate planter house |
| `oliver_otis_howard_portrait.jpg` | Gen. Oliver Otis Howard in uniform (empty right sleeve) | loc:2006681382 | 1056x1536 | Howard name card (also ch07) |
| `thaddeus_stevens_brady_handy.jpg` | Thaddeus Stevens, Brady-Handy | loc:2017894254 | 2323x3000 | High-res Stevens (also ch09) |
| `stevens_lancaster_speech_reconstruction_1865_title.jpg` | "Reconstruction. Speech of the Hon. Thaddeus Stevens, delivered in the city of Lancaster, September 7th, 1865" (pamphlet) | iabook:reconstructions00stevgoog p.5 | 1975x3000 | Stevens' land plan |
| (repo) `wall/pardons.jpg` | Harper's pardons page | repo | 827x1024 | THE LAND GOES BACK card |

**Gaps:**
- Howard's reply of Oct. 22, 1865 ("right in wanting homesteads … Congress must meet") was not located. It is in RG 105,
  Letters Sent, vol. 64, a letterpress copy. Use the FSSP transcription as a typeset card, or Howard's portrait.
- The "forty acres" passage inside the Stevens pamphlet is a poor scan (pages 6–12 of the IA book); only the title page
  was saved.

## ch06

**Best picks:**
- Amendment: repo `ch06/thirteenth_src.jpg` (swipe "except as a punishment for crime").
- Code: repo `ms_vagrant_act` and `ms_freedmen_act` crops.
- Step three: `selling_a_freedman_to_pay_his_fine_monticello_fl_harpers_1867.jpg`. This is the image for "the sheriff
  could hire them out" (Florida, under its own code, Jan. 1867; tag the place and year).
- Optional opener: `scene_in_house_passage_13th_amendment_31jan1865_harpers.jpg`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `scene_in_house_passage_13th_amendment_31jan1865_harpers.jpg` | Harper's Weekly cover, Feb. 18, 1865: "Scene in the House on the passage of the proposition to amend the Constitution, January 31, 1865" | loc:00652833 | 2395x3000 | "First, the good news" (passage; ratification came Dec. 1865) |
| `selling_a_freedman_to_pay_his_fine_monticello_fl_harpers_1867.jpg` | "Selling a freedman to pay his fine, at Monticello, Florida", Harper's Weekly, Jan. 19, 1867 (sketch by Jas. E. Taylor) | loc:96519280 | 3000x2374 | **Step three** / "put to work without pay". Tag "Florida, 1867" |
| `slavery_is_dead_nast_harpers_1867.jpg` | Thomas Nast, "Slavery is dead?", Harper's Weekly, Jan. 12, 1867: 1863 emancipation vs. 1866 freedmen whipped and sold for "crime" | loc:93507943 | 3000x1936 | "And it was legal." Hold on the 1866 panel (later than the beat; tag 1867) |
| (repo) `ch06/thirteenth_src.jpg` | 13th Amendment joint resolution signed by Lincoln (LOC mal4361100) | repo | 3196x4253 | **Key** |
| (repo) `ch06/ms_freedmen_act.jpg`, `ch06/ms_vagrant_act.jpg` | Mississippi codes as printed in Mississippi papers, Nov. 1865 | repo | — | **Key** (three steps + the land clause) |

**Gaps:**
- No picture of the Mississippi legislature of 1865. The statute printings carry the beat.
- No 1865–66 Mississippi image of a hiring-out; the Florida engraving is the closest period scene.

## ch07

**Best picks:**
- Bureau: `freedmens_bureau_waud_harpers_1868.jpg`, Waud's Bureau agent standing between two armed crowds. It is the
  classic image, but from July 1868, so tag "1868".
- Food: `freedmens_bureau_issuing_rations_harpers_1866.jpg`.
- Marriages: `marriage_colored_soldier_vicksburg_freedmens_bureau_harpers_1866.jpg`.
- Schools: `primary_school_freedmen_vicksburg_harpers_1866.jpg` (old and young in one room).
- Families: `information_wanted_ad_colored_tennessean_24mar1866.jpg`.
- Vetoes: `johnson_veto_message_freedmens_bureau_bill_feb1866.jpg` and `johnson_veto_message_civil_rights_bill_mar1866.jpg`.
- Override: `outside_galleries_house_civil_rights_bill_1866.jpg`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `freedmens_bureau_waud_harpers_1868.jpg` | A. R. Waud, "The Freedmen's Bureau", Harper's Weekly, July 25, 1868 | loc:92514996 | 3000x2398 | THE BUREAU card. Tag "1868" |
| `freedmens_bureau_issuing_rations_harpers_1866.jpg` | "Glimpses at the Freedmen's Bureau. Issuing rations to the old and sick", Leslie's, 1866 (Jas. E. Taylor) | loc:2009633700 | 1536x1032 | "food and medicine" |
| `marriage_colored_soldier_vicksburg_freedmens_bureau_harpers_1866.jpg` | "Marriage of a colored soldier at Vicksburg by Chaplain Warren of the Freedmen's Bureau", Harper's Weekly, June 30, 1866 | loc:2009630217 | 3000x2428 | "made marriages from slavery legal" |
| `primary_school_freedmen_vicksburg_harpers_1866.jpg` | "Primary school for freedmen, in charge of Mrs. Green, at Vicksburg", Harper's Weekly, 1866 | loc:2023632559 | 3000x2337 | **"Grandparents sat beside their grandchildren"** |
| `misses_cookes_school_room_freedmens_bureau_richmond_1866.jpg` | Leslie's page, 1866: "The Misses Cooke's school room, Freedman's Bureau, Richmond" | loc:98510871 | 2403x3000 | Alternate school (crop to the top engraving) |
| `freedmens_union_industrial_school_richmond_leslies_1866.jpg` | "Glimpses at the Freedmen: the Freedmen's Union Industrial School, Richmond", Leslie's, 1866 | loc:98501491 | 1536x1299 | Alternate |
| `edisto_freedmens_school_1862.jpg` | Freedmen's school, Edisto Island, S.C. (Samuel A. Cooley; LOC dates it 1862) | loc:2010647918 | 3000x1844 | Edisto callback for schools (earlier than the Bureau; tag "c.1862") |
| `information_wanted_ad_colored_tennessean_24mar1866.jpg` (+`.json`) | "Information Wanted. Of my daughter, Martha James … was sold to Mr. John James, Nashville, Tenn., about nine years ago … Hannah Barnett", plus an ad for a son, Daniel. The Colored Tennessean, Mar. 24, 1866 | Chronicling America sn83025745 | 1464x1416 | **Stand-in / companion** for the Hagar Outlaw ad (see gaps) |
| `johnson_veto_message_freedmens_bureau_bill_feb1866.jpg` | "Message of the President … returning Bill (S. 60) to amend an act entitled 'An Act to establish a Bureau for the relief of Freedmen and Refugees' … with his objections", Feb. 19, 1866 (Senate Ex. Doc. 25) | loc:2022699611 | 1765x3000 | **"Johnson vetoed it."** |
| `johnson_veto_message_civil_rights_bill_mar1866.jpg` | Veto message on Bill S. 61 "to protect all persons in the United States in their civil rights", Mar. 27, 1866 (Senate Ex. Doc. 31) | loc:2024764164 | 1835x3000 | **"Johnson vetoed that too."** |
| `outside_galleries_house_civil_rights_bill_1866.jpg` | Harper's Weekly, Apr. 28, 1866: crowds outside the galleries of the House during the passage of the Civil Rights Bill | loc:2010652199 | 2391x3000 | The override (crop to the top two panels; the page also has a fashion plate) |
| `lobby_of_house_passage_civil_rights_bill_1866.jpg` | "The lobby of the House of Representatives … during the passage of the civil rights bill", 1866 (double page) | loc:2010652197 | 3000x2359 | Override alternate |
| `cruel_uncle_vetoed_babes_cartoon_1866.jpg` | Frank Leslie's, 1866: Johnson as "The cruel uncle and the vetoed babes in the wood" ("Civil Rights" and "Freedmen's Bureau" babes; "Veto Wood") | loc:2001695524 | 2407x3000 | **Flag**: anti-Johnson, but the Bureau babe is a stereotyped Black child. Evidence only / crop to Johnson |
| `man_that_blocks_up_the_highway_cartoon_1866.jpg` | "The man that blocks up the highway", 1866 lithograph: Johnson as the "Veto" gate | loc:2020780952 | 3000x2475 | Optional. Check all figures at full size before use |
| (repo) `wall/firstvote.jpg` | "The First Vote", 1867 | repo | 746x1024 | Dimmed BUREAU card per the board mockups |

**Gaps:**
- **The Hagar Outlaw ad** (*Christian Recorder*, Apr. 7, 1866) is not in Chronicling America. The Last Seen project
  (Villanova) has the scan, but its image rights need checking before use. The Colored Tennessean ad above is a
  same-year public-domain stand-in, or the script could read that one instead.
- Civil Rights Act text (14 Stat. 27) not fetched. The LOC Statutes at Large (llsl) volume 14 page could be added if
  wanted.

## ch08

**Best picks:**
- `fourteenth_amendment_joint_resolution_1866_p1.jpg` (Section 1: swipe citizenship / due process / equal protection,
  with the 1/3 counter).
- `dred_scott_photograph_c1857.jpg`.
- Tennessee: `tennessee_capitol_nashville_1863.jpg`.
- Optional: `extract_const_amend_cartoon_1866.jpg`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `fourteenth_amendment_joint_resolution_1866_p1.jpg` | Joint resolution proposing the 14th Amendment, 39th Congress, enrolled original, p.1 | commons:File:14th Amendment Pg1of2 AC.jpg (NARA; 1920 thumb) | 1920x2514 | **Key**: EQUAL PROTECTION card |
| `fourteenth_amendment_joint_resolution_1866_p2.jpg` | p.2, signatures | commons:File:14th Amendment Pg2of2 AC.jpg (1920 thumb) | 1920x2491 | Optional |
| `dred_scott_photograph_c1857.jpg` | Dred Scott, photograph, c.1857 | commons (1920 thumb) | 1920x2473 | Dred Scott vocab card |
| `dred_and_harriet_scott_leslies_june1857.jpg` | Dred and Harriet Scott, wood engraving after Fitzgibbon photographs, Frank Leslie's, June 1857 | commons (1920 thumb) | 1920x1488 | Alternate (period print) |
| `extract_const_amend_cartoon_1866.jpg` | Harper's Weekly cartoon, 1866, "Extract Const. Amend.": Columbia offers Johnson the amendment like a dose ("Now, Andy, take it right down") | loc:2001695546 | 2410x3000 | "Johnson told the Southern states to vote it down" (light touch) |
| `tennessee_capitol_nashville_1863.jpg` | The Capitol, Nashville, 1863 | loc:2005677502 | 1536x1230 | "Tennessee. Johnson's home state" |

**Gaps:**
- No image of Tennessee's ratification (July 1866) itself. The capitol photo stands in. Brownlow's telegram ("Give my
  respects to the dead dog of the White House") would make a text card if the editor wants it, but it is not in the
  script.

## ch09

**Best picks:**
- Memphis: `scenes_in_memphis_riot_harpers_may1866.jpg`, a Harper's cover, May 26, 1866, with a freedmen's school burning
  and people shot down.
- New Orleans: `new_orleans_riot_procession_harpers_aug1866.jpg` and `new_orleans_riot_mechanics_institute_harpers_1866.jpg`.
- The tour: `andys_trip_nast_harpers_oct1866.jpg`.
- Cleveland: `johnson_cleveland_speech_ny_tribune_5sep1866.jpg` (read the fact-check note first).
- Stevens: `hang_thaddeus_nast_cartoon_1866.jpg` (caption "Hang Jeff Davis" / "Then I would ask you why not hang Thad
  Stevens and Wendell Phillips?").
- Davis: `jefferson_davis_brady_c1860.jpg`.
- Pre-election verdict: `andrew_johnsons_reconstruction_how_it_works_nast_sept1866.jpg`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `scenes_in_memphis_riot_harpers_may1866.jpg` | "Scenes in Memphis, Tennessee, during the riot", Harper's Weekly cover, May 26, 1866 (A. R. Waud) | loc:94507780 | 2406x3000 | **Memphis** (violent; plain treatment) |
| `new_orleans_riot_procession_harpers_aug1866.jpg` | Harper's Weekly, Aug. 25, 1866: "the Freedmen's procession marching to the Institute — the struggle for the flag" and the siege and assault | loc:94510091 | 2383x3000 | **New Orleans** |
| `new_orleans_riot_mechanics_institute_harpers_1866.jpg` | Harper's Weekly page, 1866: the riot at the Mechanics' Institute (LOC record dates it 1865; the riot was July 30, 1866) | loc:2008680259 | 2445x3000 | New Orleans alternate |
| `massacre_at_new_orleans_nast_1867.jpg` | Thomas Nast, "The massacre at New Orleans", 1867 (colour painting) | loc:2009617747 | 3000x2374 | Optional (Nast's indictment; later than the event; tag 1867) |
| `andys_trip_nast_harpers_oct1866.jpg` | Nast, "Andy's Trip", Harper's Weekly, Oct. 27, 1866: vignettes of the Swing Around the Circle (LOC record misdated 1865) | loc:2016651601 | 3000x2251 | **SWING AROUND THE CIRCLE** |
| `johnson_cleveland_speech_ny_tribune_5sep1866.jpg` (+`.json`) | "The President's Trip. From Cleveland to Detroit. Mr. Johnson's Speech at Cleveland", New-York Tribune, Sept. 5, 1866 | Chronicling America sn83030214 | 1789x3000 | The heckling, verbatim (gives the Stevens line to a voice in the crowd) |
| `johnson_cleveland_speech_worcester_spy_5sep1866.jpg` (+`.json`) | Same exchange, Worcester Daily Spy, Sept. 5, 1866 | Chronicling America sn83021205 | 728x429 | Corroboration |
| `johnson_why_not_hang_thad_stevens_evening_telegraph_10sep1866.jpg` (+`.json`) | Philadelphia Evening Telegraph, Sept. 10, 1866: Johnson's "usual answer … 'Why not hang Thad. Stevens and Wendell Phillips?'" | Chronicling America sn83025925 | 1053x514 | The version the script uses |
| `hang_thaddeus_nast_cartoon_1866.jpg` | 1866 cartoon: Johnson bows and hands a pardon to Jefferson Davis while Stevens and Phillips hang; caption quotes the line | commons:File:Hang Thaddeus.jpg (attributed to Nast; publication not verified; 960 thumb) | 960x946 | "A sitting president, asking a crowd why nobody had hanged a congressman" |
| `king_andy_nast_harpers_3nov1866.jpg` | Nast, "King Andy", Harper's Weekly, Nov. 3, 1866 (Stevens, Sumner, Phillips awaiting the axe) | commons:File:Johnson President or King.jpg (500 px thumb) | 500x746 | Pre-election; low-res, so keep small |
| `andrew_johnsons_reconstruction_how_it_works_nast_sept1866.jpg` | Nast, "Andrew Johnson's Reconstruction and How It Works", Harper's Weekly, Sept. 1, 1866 (Memphis and New Orleans riots in the vignettes) | loc:95512439 | 2210x3000 | Bridges the riots and the election |
| `jefferson_davis_brady_c1860.jpg` | Jefferson Davis, Brady studio, c.1860 | commons:File:Jefferson Davis - NARA - 528293.jpg (1920 thumb) | 1920x2264 | "the Confederacy's president" |
| (repo) `wall/stevens.jpg`, `wall/johnson.jpg` | Board portraits | repo | ~1024 | Big canvas |

**Gaps:**
- **No clean image of the November 1866 election result.** One page tried (Portland Daily Press) was all ads.
  - Suggest a simple data card of the seats, drawn from the Clerk of the House figures, not AI.
  - Or "King Andy" / "How It Works" as the pre-election mood, then the CONGRESS DECIDES card.
- `king_andy` is only 500 px; LOC may hold a larger Harper's copy.

## ch10

**Best picks:**
- Recap: the board itself.
- Edisto: `edisto_seabrook_quarters_1862_moore.jpg` (the island from above).
- Three words: `ch01/edisto_letter_landless_homeless_voteless_detail.jpg`.
- Callback: `ch01/edisto_petition_to_president_28oct1865_p3.jpg`.
- Optional atmosphere: `freedpeople_family_and_home_st_helena_island_1863.jpg`.
- Tease: repo `wall/senators.jpg`.

| File | Shows | Source | Size | Use |
|---|---|---|---|---|
| `edisto_seabrook_quarters_1862_moore.jpg` | Moore, "Seabrook's negro quarters", Edisto Island, 1862 (view over the quarters to the water) | loc:2010651636 (crop) | 3000x2301 | "And Edisto Island? Most … lost the land" |
| `freedpeople_family_and_home_st_helena_island_1863.jpg` | Stereo: a freed family at their cabin, St. Helena Island, 1863 | loc:2015646741 | 3000x1517 | "Landless. Homeless." (Sea Islands, not Edisto; tag) |
| `freedpeople_working_cotton_thorpe_st_helena_1863.jpg` | Stereo: freedpeople working cotton under an overseer (Thorpe), St. Helena Island, 1863 | loc:2015646748 | 2999x1551 | "working for their old owners" (Sea Islands; tag) |
| (repo) `wall/senators.jpg` | Currier & Ives, first Black senator and representatives | repo | 1024x782 | "Next time … a Black senator" |
| (repo) `wall/acres.jpg` | Field Order 15 strip | repo | 1920x1080 | Map callback |

**Gaps:**
- No document of an actual Edisto restoration (for example Bleak Hall, Feb. 1866). Candidate: NARA RG 105, South
  Carolina field office "Records Relating to Restoration of Property" (Capt. A. P. Ketchum's records; digitized as file
  units 676072448 / 676070968 / 676071709, about 740–1000 frames each, not searched page by page). The Mikell pardon
  (ch05) can stand in: it is an Edisto owner asking for his land back.
- Nothing post-1866 from Edisto itself.
