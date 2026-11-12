"""Builds research/IMAGES.md: Ep 3's on-screen archival images (B&W photo cards on the desk), by topic, with credits.
   python3 research/build_images_md.py   (re-run after adding or removing images; credits come from public/img/credits.json)
   Contact sheets: research/sheets/<topic>.jpg. Look-dev references for the drawn sets are a separate set (REFERENCES.md)."""
import glob, json, os, re
from PIL import Image
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
C = json.load(open('public/img/credits.json'))
TOPICS = [
 ('a_departure', 'Why they left: pogroms and departure (1881 to 1882)'),
 ('b_steerage', 'The crossing: steamships and steerage'),
 ('c_arrival', 'Arrival: Liberty, Castle Garden, the Barge Office, Ellis Island'),
 ('d_streets', 'The Lower East Side and its streets'),
 ('e_sweatshop', 'Home work and sweatshops (Riis, about 1889)'),
 ('f_letters', 'Letters, tickets, steamship lines, aid societies'),
 ('g_nativism', 'Nativism and the answer to it (cartoons, the Exclusion Act)'),
 ('h_names', 'Names: manifests and naturalization'),
 ('i_portraits', 'Portraits'),
]
# file -> (what it shows, how it could be used, flags). Flags: CARICATURE / SLUR / LATE (after 1893, label the date) / SMALL / SENSITIVE
N = {
 # a_departure
 'alexander_ii_on_his_deathbed_makovsky_1881_commons.jpg': ('Makovsky painting: Tsar Alexander II on his deathbed after the bomb of March 1881', 'The trigger: the assassination that set off the pogroms', ''),
 'german_emigrants_embarking_hamburg_steamer_harpers_1874_commons.jpg': ("Harper's double page: emigrants crowd the gangway and deck of a Hamburg steamer", 'Departure from Hamburg (earlier decade, same port and ships)', 'Date: 1874'),
 'kiev_expulsion_of_jewish_families_ilustracion_espanola_1881_commons.jpg': ('Spanish weekly, June 1881: Jewish families driven from their homes in Kiev, carts and bundles', 'The pogroms of 1881 seen by the world press', 'SENSITIVE (violence implied)'),
 'kiev_pogrom_engraving_1881_commons.jpg': ('Engraving of the Kiev pogrom, 1881: a mob with clubs and an axe drags a Jewish man through the street while soldiers stand by', 'The pogroms themselves; brief, framed by narration', 'SENSITIVE (mob violence)'),
 'odessa_pogrom_1881_commons.jpg': ('Small engraving of the 1881 Odessa riots', 'Inset only', 'SMALL; SENSITIVE'),
 'stop_your_cruel_oppression_of_the_jews_puck_1904_loc2004671428.jpg': ('Puck: Theodore Roosevelt tells the Tsar to stop crushing a Jewish man under a sack labelled "Oppression"', 'American opinion against Russian persecution', 'LATE 1904 (after Kishinev); mild CARICATURE'),
 'the_emigrants_die_auswanderer_print_1882_loc2013646643.jpg': ('German-American print: a family walks out of its village with animals and bundles', 'Leaving home (generic, sentimental)', 'Not Jewish or Russian; rural German'),
 'the_emigrants_farewell_abschied_print_1883_loc2013646644.jpg': ('Print: villagers say goodbye at the town gate where the wagons wait', 'The goodbye', 'Generic central European village'),
 # b_steerage
 'castaigne_on_the_steerage_deck_1898_loc2010715345.jpg': ('Pencil drawing: a mother and children huddled on deck', 'Steerage family', 'SMALL; 1898'),
 'horrors_of_emigrant_ship_hold_harpers_1869_loc92522099.jpg': ("Harper's: crowded below-deck steerage berths in the hold of an emigrant ship", 'What steerage below decks looked like (sailing-ship era)', 'Date: 1869'),
 'leslies_welcome_land_of_freedom_steerage_deck_1887_loc97502086.jpg': ("Frank Leslie's, July 2, 1887: steerage passengers cheer as their steamer passes the new Statue of Liberty", 'The key arrival image: first sight of the statue', ''),
 'ss_city_of_berlin_inman_line_1890s_loc2016805763.jpg': ('Photo: the Inman liner City of Berlin (1875) at sea', 'The kind of ship (single funnel, masts)', 'Photo 1890s'),
 'steerage_deck_friedrich_der_grosse_c1907_loc2001704446.jpg': ('Photo: emigrants on the open steerage deck of a German liner', 'Steerage passengers on deck', 'LATE c1907'),
 'stieglitz_the_steerage_1907_loc89715190.jpg': ('Alfred Stieglitz, "The Steerage" (photogravure)', 'The famous image of steerage', 'LATE 1907 (and the ship was eastbound)'),
 # c_arrival
 'annie_moore_arrival_1892_commons.jpg': ('National Archives passenger list page with Annie Moore, the first person registered at Ellis Island (SS Nevada, from Queenstown)', 'Annie Moore beat; also the names beat', 'Check the line before zooming to her name'),
 'barge_office_battery_place_kings_handbook_1893_ia_p78.jpg': ("King's Handbook halftone: the U.S. Barge Office at the Battery, the immigrant station of 1890 to 1891", 'Between Castle Garden and Ellis Island', ''),
 'barge_office_battery_stereo_c1865_loc2017645395.jpg': ('Stereo: the old Barge Office on its pier at the Battery', 'Context only', 'Date c1865 (an older building)'),
 'barge_office_landing_immigrants_1902_commons.jpg': ('Photo: immigrants landing from the Ellis Island ferry outside the Barge Office', 'Bundles, families, the crush at the landing', 'LATE 1902'),
 'castle_garden_depot_exterior_c1870s_nypl1266460.jpg': ('Engraving: the State Emigrant Landing Depot (Castle Garden) from the land side, flags flying', 'Castle Garden exterior', 'c1861 to 1880'),
 'castle_garden_depot_three_views_c1870s_nypl422119.jpg': ('Three engravings: the depot from the water, the interior, the Ward\'s Island refuge', 'Castle Garden overview card', 'c1861 to 1880'),
 'castle_garden_first_thanksgiving_dinner_harpers_1884_loc90707729.jpg': ("Harper's, Nov 1884: three newcomers eat their first Thanksgiving dinner on a bench at Castle Garden", 'Our year exactly; warm, human', ''),
 'castle_garden_landing_barge_office_met_dr175.jpg': ('Colour print: Castle Garden and the Barge Office landing seen from above, the harbour busy with ships', 'Bird\'s-eye of the landing', 'Met CC0; undated (1850 to 1900)'),
 'castle_garden_rotunda_interior_c1870s_nypl423062.jpg': ('Engraving: the rotunda inside Castle Garden, galleries on iron columns, people waiting at rails', 'The registration hall', 'c1861 to 1880'),
 'castle_garden_stereo_anthony_1880s_loc2017649604.jpg': ('Stereo view of Castle Garden across the Battery\'s trees', 'Castle Garden exterior photo', ''),
 'castle_garden_with_statue_of_liberty_c1887_loc92516023.jpg': ('Colour print: Castle Garden on the Battery with the Statue of Liberty across the bay', 'Puts the station and the statue in one frame', ''),
 'dargaud_statue_of_liberty_in_gaget_workshop_paris_1884_commons.jpg': ('Painting: the statue rising above the rooftops of Paris in the Gaget workshop yard, 1884', 'Bartholdi\'s statue being built', ''),
 'ellis_eye_examination_inspectors_1913_loc97501532.jpg': ('Photo: inspectors examine immigrants\' eyes (the buttonhook test for trachoma)', 'Eye exam beat', 'LATE 1913'),
 'ellis_immigrants_awaiting_examination_c1900s_loc2017660810.jpg': ('Stereo: the registry hall full of immigrants waiting for examination', 'The crowd inside', 'LATE (second building)'),
 'ellis_island_first_building_c1896_commons.jpg': ('Photo: the first (wooden) Ellis Island station, opened 1892, burned 1897', 'The real 1892 building', 'SMALL'),
 'ellis_island_immigrants_just_arrived_c1904_loc97501095.jpg': ('Stereo: immigrants just arrived in the Ellis Island building', 'Arrival crowd', 'LATE c1904'),
 'ellis_island_station_kings_handbook_1893_commons.jpg': ("King's Handbook 1893: five views of the first Ellis Island station (landing, main building, dining hall, surgeon's house, detention room)", 'The 1892 station inside and out', '1280 px'),
 'ellis_medical_examination_c1902_1913_dpla.jpg': ('Photo: a doctor examines a woman and children at a rail in the medical line', 'Medical inspection', 'LATE 1902 to 1913'),
 'ellis_physicians_examining_jewish_immigrants_c1907_loc2012646350.jpg': ('Photo: physicians examine a line of Jewish immigrant men, stripped to the waist', 'Medical inspection', 'LATE c1907; SENSITIVE (partial undress)'),
 'evening_post_liberty_statue_page_oct28_1886_commons.jpg': ('New York Evening Post front page, Oct 28, 1886: "Liberty\'s Statue"', 'Dedication day headline', ''),
 'immigrants_landing_castle_garden_1880_loc2023631214.jpg': ("Harper's, May 29, 1880: two scenes of immigrants landing at Castle Garden", 'Landing at Castle Garden', 'SMALL'),
 'immigrants_landing_castle_garden_shults_harpers_1880_loc90707732.jpg': ("Harper's 1880 (A. B. Shults): a crowd with bundles and children comes ashore under the Castle Garden shed", 'Landing at Castle Garden', ''),
 'labor_exchange_castle_garden_harpers_1868_loc90709503.jpg': ("Harper's, 1868: immigrants waiting on the Battery; the labor exchange hall inside", 'The labor exchange', 'Date: 1868'),
 'lazarus_new_colossus_manuscript_1883_commons.jpg': ('Emma Lazarus\'s handwritten "The New Colossus", 1883', 'The poem in her hand', 'SMALL (501 px); a larger scan is at the American Jewish Historical Society'),
 'liberty_inauguration_salute_currier_ives_1886_commons.jpg': ('Currier & Ives: the inauguration of the statue, Oct 28, 1886, in fog and gun smoke', 'Dedication day', ''),
 'moran_unveiling_statue_of_liberty_1886_commons.jpg': ('Edward Moran painting: the unveiling, fireworks and the fleet', 'Dedication day (colour)', ''),
 'new_colossus_plaque_1903_nps_commons.jpg': ('The bronze "New Colossus" plaque put up in the pedestal in 1903', 'The poem was little known in 1886', 'LATE 1903'),
 'port_of_new_york_birds_eye_from_battery_1892_loc91482228.jpg': ('Colour bird\'s-eye: the Port of New York from the Battery, 1892, Castle Garden in front', 'Establishing shot of the harbour', ''),
 'registering_emigrants_castle_garden_1866_loc2001697361.jpg': ('Engraving: a clerk at a high desk registers emigrants at Castle Garden', 'The clerk writes the name (names beat)', 'Date: 1866'),
 'statue_of_liberty_illumination_harbor_1886_loc99614266.jpg': ('Engraving: the statue and the harbour lit by fireworks, 1886', 'Dedication night', ''),
 'statue_pedestal_bedloes_island_1885_loc99614265.jpg': ('Engraving: the pedestal under construction on Bedloe\'s Island, with Bartholdi inset', 'The pedestal fund (Lazarus wrote for it)', ''),
 'ulrich_in_the_land_of_promise_castle_garden_1884_commons.jpg': ('Charles Ulrich painting, 1884: a young mother nursing her baby among waiting immigrants inside Castle Garden', 'The strongest single image for our year and place', ''),
 'unveiling_statue_of_liberty_leslies_1886_loc99614119.jpg': ("Frank Leslie's: sailors watch the unveiling as the fleet salutes", 'Dedication day', ''),
 # d_streets
 'brooklyn_bridge_tenements_c1909_loc2007665887.jpg': ('Joseph Pennell drawing: tenements packed under the Brooklyn Bridge', 'Tenements and the bridge (links to Ep 1)', 'LATE c1909; SMALL'),
 'hester_street_market_panorama_c1902_loc2007661243.jpg': ('Panorama: Hester Street jammed with pushcarts and shoppers', 'Pushcart market', 'LATE c1902 (thin it out for the 1880s)'),
 'hester_street_stereo_1897_loc2017659396.jpg': ('Stereo: a Hester Street corner, awnings and crowds', 'Street life', '1897'),
 'in_hester_st_candy_stereo_c1896_loc90713721.jpg': ('Stereo: a candy pushcart with children on Hester Street', 'Pushcarts, children', 'c1896'),
 'jewish_new_year_east_side_c1905_loc91482962.jpg': ('Photo: crowds on an East Side street at the Jewish New Year', 'Community and holidays', 'LATE c1905'),
 'norfolk_and_hester_street_c1898_commons.jpg': ('Photo: Norfolk and Hester Streets, pushcarts and women in shawls', 'Pushcarts (best street photo of the set)', 'c1898'),
 'pushcarts_elizabeth_st_from_hester_c1902_loc2007678128.jpg': ('Stereo: a long row of pushcarts and fire escapes on Elizabeth Street', 'Density of the street', 'LATE c1902'),
 'riis_bandits_roost_mulberry_st_1888_commons.jpg': ('Riis: "Bandits\' Roost," an alley off Mulberry Street', 'Tenement alleys (Riis\'s most famous)', 'Italian district; framed as slum by Riis'),
 'riis_baxter_street_alley_mulberry_bend_1888_loc2002710255.jpg': ('Riis: Baxter Street alley in Mulberry Bend', 'Tenement backs', ''),
 'riis_five_cents_a_spot_bayard_st_lodgings_1890_loc2002710259.jpg': ('Riis: "Five cents a spot," lodgers crowded into a Bayard Street tenement room', 'Crowding', 'SENSITIVE (poverty, people in bed)'),
 'riis_hester_street_1890_loc2002710254.jpg': ('Riis: Hester Street, 1890, shop signs, carts and men in the street', 'The Jewish quarter in our decade', ''),
 'riis_ludlow_street_cellar_habitation_1895_loc2002710266.jpg': ('Riis: a family living in a Ludlow Street cellar', 'Living conditions', 'SENSITIVE (poverty)'),
 'riis_ludlow_street_stands_1887_loc2015647196.jpg': ('Riis: street stands along Ludlow Street in front of a public school, 1887', 'Peddlers in our decade (rare 1887 date)', ''),
 'riis_peddler_slept_in_cellar_1890_loc2002710253.jpg': ('Riis: a peddler who slept in a cellar, sitting on his bed of barrels', 'Peddlers', 'SENSITIVE (poverty)'),
 'riis_street_arabs_sleeping_1890s_commons.jpg': ('Riis: homeless boys asleep in a tenement passage', 'Children in the streets', 'SENSITIVE (homeless children)'),
 'riis_tenement_fire_escape_1890_loc2002710276.jpg': ('Riis: a fire escape used as an extra room, laundry hanging', 'Tenement exterior', ''),
 'riis_vegetable_stand_mulberry_bend_1890_loc2002710252.jpg': ('Riis: a vegetable stand under an umbrella, Mulberry Bend', 'Street selling', 'Italian district'),
 'williamsburg_grand_street_ferry_stereo_dennis_commons.jpg': ('Stereo: the East River from the Grand Street ferry, Williamsburg (Brooklyn, E.D.)', 'Williamsburg, where many families moved', 'Undated (1862 to 1890s)'),
 # e_sweatshop
 'riis_bohemian_cigarmakers_tenement_1889_loc2002710251.jpg': ('Riis: a Bohemian family rolling cigars in their tenement room', 'Cigar making at home (Gompers\'s trade)', 'Children working'),
 'riis_boy_pulling_threads_sweatshop_1889_loc2002710250.jpg': ('Riis: a twelve-year-old boy "pulling threads" among the men', 'Child labor in the garment trade', 'Children working'),
 'riis_necktie_workshop_division_st_1889_loc2002710291.jpg': ('Riis: a necktie workshop in a Division Street tenement, girls at the table', 'Sweatshop interior (largest scan)', 'Children working'),
 'riis_sewing_pants_gotham_court_1890_loc2002710299.jpg': ('Riis: women sewing pants for the trade in a Gotham Court flat', 'Home work, paid by the piece', ''),
 'riis_shoemaker_working_in_house_1895_loc2002710273.jpg': ('Riis: a shoemaker working in his room', 'Home trades', '1895'),
 'riis_sweatshop_ludlow_street_c1889_loc2002710271.jpg': ('Riis: "Sweatshop in Ludlow Street Tenement," men at work among heaps of coats', 'The Ludlow Street sweatshop', ''),
 'riis_women_sewing_elizabeth_st_1889_loc2002711500.jpg': ('Riis: women sewing by lamplight in an Elizabeth Street room', 'Home finishing work', ''),
 # f_letters
 'hamburg_american_packet_co_page_kings_handbook_1893_ia_p94.jpg': ("King's Handbook page: the Hamburg-American Packet Company, its steamers and saloons", 'The line most Russian Jews sailed from Hamburg', 'Full page (crop in the edit)'),
 'hebrew_emigrant_aid_society_report_1882_cover_commons.jpg': ('Cover of the Hebrew Emigrant Aid Society report, 1882 (German edition, "Bericht")', 'Aid societies', 'SMALL (312 px)'),
 'irish_depositors_emigrant_savings_bank_1880_loc2012646222.jpg': ("Frank Leslie's, 1880: Irish depositors at the Emigrant Savings Bank withdraw money to send to relatives", 'Money and tickets sent home; chain migration', ''),
 'national_line_steamships_egypt_spain_ad_c1879_loc2002709991.jpg': ('Colour print advertising the National Line steamships Egypt and Spain, New York to Liverpool', 'Steamship line advertising', 'c1879'),
 'north_german_lloyd_page_kings_handbook_1893_ia_p92.jpg': ("King's Handbook page: the North German Lloyd (Bremen line) and its steamers", 'The Bremen route', 'Full page'),
 'red_star_line_poster_cassiers_1898_commons.jpg': ('Henri Cassiers poster: Red Star Line, Antwerp to New York', 'Steamship poster', 'LATE 1898; colour'),
 'steamship_ads_prepaid_steerage_the_sun_jun11_1884_loc_sn83030272.jpg': ('The Sun, June 11, 1884: "Shipping" ads column; Monarch, National and Red Star lines offer "prepaid steerage" tickets ($18 to $19)', 'Prepaid tickets bought in America for relatives (our year)', 'SMALL width (690 px): newspaper scan'),
 # g_nativism
 'a_trio_that_must_go_puck_1883_loc2012645510.jpg': ('Puck cover, Sept 1883: a church bell, a battered Republican elephant and a Chinese man as "a trio that must go"', 'Anti-Chinese politics as a punchline', 'CARICATURE'),
 'anti_chinese_wall_puck_1882_loc96500349.jpg': ('Puck, 1882: Irish, Black, Italian, Jewish and other workers build an anti-Chinese wall with "Congressional mortar" while China opens its own wall to trade', 'The irony beat: immigrants shutting out the next group (critical of exclusion)', 'CARICATURE (every group drawn as a type)'),
 'chinese_exclusion_act_1882_enrolled_text_nara_commons.jpg': ('The enrolled Chinese Exclusion Act, May 1882 (National Archives)', 'The law\'s own words', 'Wording of the law uses period terms'),
 'columbia_welcomes_victims_of_persecution_1881_loc2001696516.jpg': ("Frank Leslie's, Jan 1881: Columbia welcomes Jewish refugees from German persecution", 'A sympathetic cartoon', 'CARICATURE (features exaggerated though kindly meant)'),
 'gillam_sop_to_cerberus_puck_1882_commons.jpg': ('Puck cover, May 1882: President Arthur throws the Exclusion bill as a sop to the three-headed anti-Chinese dog', 'Why the law passed (Western votes)', 'Political caricature'),
 'hamilton_where_the_blame_lies_judge_1891_loc97515495.jpg': ('Judge, April 1891: a line of immigrants drawn as criminals and anarchists pours off a ship while Uncle Sam is told "the blame lies" with lax laws', 'Openly nativist; show briefly as the restrictionist argument', 'CARICATURE; strongly offensive types'),
 'hobsons_choice_chinese_1886_loc91793034.jpg': ('Puck cover, 1886: a man in an "Oregon" hat shoots Chinese men off a cliff; a torn "Treaty with China" on the ground (condemns the violence)', 'Anti-Chinese violence in the West', 'CARICATURE; SENSITIVE (killing shown)'),
 'keppler_darn_ye_both_apa_puck_1894_loc2012648672.jpg': ('Puck, 1894 (Udo Keppler): Uncle Sam knocks together an APA man and a Catholic priest', 'The American Protective Association', 'LATE 1894; mild caricature'),
 'keppler_looking_backward_puck_1893_colour_commons.jpg': ('"Looking Backward," colour copy (1438 px original)', 'Colour reference only; use the IA scan on screen', 'CARICATURE'),
 'keppler_looking_backward_puck_1893_ia_sim_puck_827.jpg': ('"Looking Backward," Puck, Jan 11, 1893: rich men bar a newcomer; behind each stands the shadow of his own immigrant father. Stitched from the Internet Archive microfilm of the issue', 'The irony beat; zoom on shadows, newcomer and caption (hi-res source: 7300 px stitch)', 'CARICATURE; B&W (original is colour)'),
 'keppler_uncle_sams_lodging_house_puck_1882_loc2004670115.jpg': ('Puck, 1882: Uncle Sam scolds a rowdy Irish lodger who keeps the other nationalities awake', 'Anti-Irish stereotype in the Kellys\' decade', 'CARICATURE; a berth label is a period racial term'),
 'keppler_welcome_to_all_puck_1880_loc2002719044.jpg': ('Puck, 1880: Uncle Sam welcomes immigrants into the "U.S. Ark of Refuge"', 'The welcome side, for contrast', 'Mild caricature'),
 'nast_every_dog_has_his_day_harpers_1879_loc2002706054.jpg': ("Nast, Harper's 1879: a Native American tells a Chinese man \"Pale face 'fraid you crowd him out, as he did me\"", 'Nast against anti-Chinese politics', 'CARICATURE; dialect caption'),
 'nast_the_chinese_question_harpers_1871_commons.jpg': ("Nast, Harper's Feb 18, 1871: Columbia shields a Chinese man from a mob; the wall is plastered with anti-Chinese slogans", 'The case for fairness; slogans show the slurs of the time', 'SLUR (the wall posters); larger copy of the LoC file'),
 'nast_the_chinese_question_harpers_1871_loc2005696252.jpg': ('Same Nast cartoon, LoC copy', 'Backup copy', 'SLUR; smaller'),
 'nast_which_color_is_to_be_tabooed_next_harpers_1882_loc91793231.jpg': ("Nast, Harper's 1882: a Chinese man and a Black man face the question \"Which color is to be tabooed next?\" (against the exclusion bill)", 'Exclusion as racial, from a critic', 'CARICATURE'),
 'new_transatlantic_hebrew_line_1881_loc2002720441.jpg': ('Opper, Puck, Jan 19, 1881: "The New Trans-Atlantic Hebrew Line, for the exclusive use of the persecuted," a ship shaped like a hooked nose crowded with Jewish emigrants', 'Show only if the script names antisemitic mockery; otherwise leave out', 'CARICATURE; antisemitic; strongly offensive'),
 'opper_irish_declaration_puck_1883_loc2012645471.jpg': ('Puck cover by Opper, May 1883: a huge Irish cook shakes her fist at her mistress', 'Anti-Irish servant stereotype (ties to Nora)', 'CARICATURE'),
 'taylor_mortar_of_assimilation_puck_1889_commons.jpg': ('Puck 1889 (C. J. Taylor): "The mortar of assimilation, and the one element that won\'t mix," an Irishman with a knife refuses to blend in', 'Assimilation debate; anti-Irish', 'CARICATURE; SMALL (446 px)'),
 'the_american_pope_puck_1894_loc2012648656.jpg': ('Puck 1894: Cardinal Satolli on an "American Headquarters" dome, casting the Pope\'s shadow over the U.S. and its schools', 'Anti-Catholic fear in the APA years', 'LATE 1894; anti-Catholic CARICATURE'),
 'the_only_one_barred_out_leslies_1882_cartoon_crop_loc2001696530.jpg': ('Crop of the cartoon: a Chinese man sits outside the shut "Golden Gate of Liberty"', 'The exclusion beat', 'SLUR (notice); CARICATURE'),
 'the_only_one_barred_out_leslies_1882_loc2001696530.jpg': ("Frank Leslie's, April 1, 1882: full page with the cartoon among the ads", 'Full page as a desk prop', 'SLUR; CARICATURE'),
 'their_new_jerusalem_judge_1892_loc2005681047.jpg': ('Judge 1892: "Their New Jerusalem," Jewish immigrants streaming into a New York of Jewish-named shops', 'Antisemitic nativism of 1892; only with narration', 'CARICATURE; antisemitic; strongly offensive'),
 'uncle_sam_return_quota_assisted_immigrants_1887_loc2010717610.jpg': ('W. A. Rogers cartoon, c1887: Uncle Sam ships "assisted" paupers back to Britain', 'The "public charge" rule (1882 Act)', 'CARICATURE; SMALL'),
 'wasp_first_blow_at_the_chinese_question_1877_commons.jpg': ('The Wasp, Dec 1877: San Francisco workingmen attack a Chinese man', 'Anti-Chinese movement in California before 1882', 'CARICATURE; SENSITIVE (violence)'),
 'wasp_the_chinese_must_go_who_keeps_them_1878_commons.jpg': ('The Wasp, May 1878: "The Chinese Must Go! But, Who Keeps Them?," employers who hire Chinese labor beside Denis Kearney\'s crowd', 'Labor competition argument', 'CARICATURE'),
 # h_names
 'manifest_ss_russia_1891_names_detail_nara_m237_r580_p1039.jpg': ('Detail: passengers 1 to 17 with age, sex, trade, country (Russia, Poland, Hungary) and town (Kovno, Odessa)', 'Zoom on how a German clerk in Hamburg spelled Yiddish names (Abrahamson, Mottel, Sussel)', ''),
 'manifest_ss_russia_hamburg_1891_nara_m237_r580_p1039.jpg': ('Real passenger list: S.S. Russia, Hamburg and Havre to New York, arrived Dec 31, 1891, sheet 1 (45 passengers, many from Russia and Poland)', 'The names beat: the clerk copied the name from this list', 'Real names of real people: keep zooms general'),
 'naturalization_of_foreigners_nyc_harpers_1869_loc98511394.jpg': ("Harper's 1869: Judge McCunn's court naturalizing a crowd of immigrants", 'Becoming a citizen', 'Date: 1869 (Tammany-era mass naturalization)'),
 'naturalization_record_solomon_aarons_1880_dpla_commons.jpg': ('Index card: Solomon Aarons, naturalized in the U.S. District Court, New York, Oct 17, 1880 (seaman, English)', 'A real 1880 naturalization record', 'Card typed later (index of old records)'),
 # i_portraits
 'emma_lazarus_c1888_loc99402695.jpg': ('Emma Lazarus, engraving after a Kurtz photograph, with signature', 'Lazarus portrait (largest)', ''),
 'emma_lazarus_engraving_1889_commons.jpg': ('Emma Lazarus, engraving, 1889', 'Lazarus portrait', ''),
 'emma_lazarus_photo_kurtz_1872_commons.jpg': ('Emma Lazarus, photograph by W. Kurtz, 1872', 'Inset', 'SMALL'),
 'henry_f_bowers_apa_founder_commons.jpg': ('Henry F. Bowers, founder of the American Protective Association (1887)', 'The APA', 'SMALL'),
 'jacob_riis_seated_c1890_loc2001704054.jpg': ('Jacob Riis seated, about 1890', 'Riis portrait (immigrant from Denmark)', 'SMALL'),
 'joseph_keppler_1880_commons.jpg': ('Joseph Keppler, 1880', 'Keppler portrait (immigrant from Austria, founder of Puck)', 'SMALL'),
 'joseph_keppler_1893_commons.jpg': ('Joseph Keppler, drawn 1893', 'Keppler in the year of "Looking Backward"', 'SMALL'),
 'samuel_gompers_c1902_loc2002717893.jpg': ('Samuel Gompers about 1902', 'Gompers (cigar maker from London, AFL president)', 'LATE c1902; no early photo found'),
}
WATCH = [
 '**Keppler "Looking Backward":** the old `desk/keppler_looking_backward_1893_large.png` is only 1254x790 and soft. The new on-screen file is '
 '`g_nativism/keppler_looking_backward_puck_1893_ia_sim_puck_827.jpg`, stitched from the Internet Archive microfilm of *Puck* no. 827 '
 '(Jan 11, 1893, pages n7 and n8, each 3964x5141). The seam was aligned by matching the overlap; no visible join. Black and white (the print is colour). '
 'LoC\'s own scan (LC-USZ62-29010) is thumbnail-only outside the Library. Re-stitch from the IA pages for a 7300 px master if a deep zoom needs it.',
 '**Caricatures and slurs** are marked CARICATURE / SLUR (HANDOFF "Ep 3 addition"): brief, framed by narration, never played for laughs. '
 'Three are strongly offensive and should appear only if the script names what they show: `new_transatlantic_hebrew_line_1881`, '
 '`their_new_jerusalem_judge_1892` (both antisemitic) and `hamilton_where_the_blame_lies_judge_1891`. The Wasp\'s "A Statue for Our Harbor" stays out (decision of Nov 9).',
 '**Sensitive content:** pogrom engravings (mob violence), "Hobson\'s Choice" (Chinese men shot), The Wasp 1877 (assault), the c1907 Ellis medical photo (men stripped to the waist), '
 'Riis\'s poverty photos (children, people in bed). Riis framed his subjects as a reformer; narration should give them dignity.',
 '**Date labels needed** (LATE): anything after 1893: Ellis Island photos of 1902 to 1913, Stieglitz 1907, Hester Street c1902, Gompers c1902, the 1903 plaque, '
 'Puck 1894 and 1904, Red Star poster 1898. Earlier context: Castle Garden engravings of the 1860s and 1870s, Harper\'s 1869 steerage hold.',
 '**Real names:** the S.S. Russia list and Annie Moore\'s page name real people. Zoom on spelling, not on one family\'s story, unless the script is about them.',
 '**Small files** (under 1000 px on the long side) are marked with a small square below: insets or desk props, not full frame.',
 'Riis photos come from LoC prints of his work (most are 1536 px); the Museum of the City of New York holds the negatives (not free to use).',
]
GAPS = [
 'Brody (1881 to 1882 refugee camp) and the Hamburg emigrant halls of the 1880s: no public-domain picture found (BallinStadt photos are 1900s).',
 'A Jewish family at the Hamburg or Bremen docks in the 1880s: none; the 1874 Harper\'s Hamburg steamer is the closest.',
 'An 1880s photograph of steerage berths: none (Harper\'s 1869 engraving or drawn).',
 'Annie Moore herself: no authentic photograph (the widely shared one is another woman). Use her list page and the 1892 building.',
 'Ellis Island chalk marks: no PD photo of chalk-marked coats found; the eye exam and medical line photos are 1902 to 1913.',
 'The first Ellis Island building: only King\'s Handbook (1280 px) and a 722 px photo. A larger King\'s scan was blocked (Commons rate limit); the IA copy of King\'s 1893 is a different edition.',
 'Williamsburg/Brooklyn streets in the 1880s: only a ferry stereo. Brooklyn Public Library holds more (not all PD).',
 'Letters home in Yiddish, prepaid ticket stubs, landsmanshaft society photos: none found PD for the period; use a drawn prop (`p05_letter_ticket`).',
 'Synagogues of the era (e.g. Eldridge Street, 1887): no period image found; HABS photos are modern.',
 'American Protective Association material beyond Bowers\'s portrait and Puck: none. Immigration Restriction League (founded 1894): outside our years, none taken.',
 'A naturalization certificate of the 1880s: only a later index card (Aarons, 1880). NARA naturalization images on Commons are 1900s to 1940s.',
 'Gompers, Lazarus manuscript: early Gompers photo not found; the manuscript is only 501 px (AJHS holds a larger scan).',
 'Not downloaded (rights "not evaluated" at LoC, though published before 1930): "In the steerage" (1891), Keppler photo 1880 (LoC copy), Lillian Wald, C. J. Taylor\'s "Mortar of assimilation" (LoC copy; a small Commons copy is used). '
 'Not digitized at LoC: Life\'s "And we open our arms to them" (1883), the Harrison restriction cartoon (1889), Gillam\'s "They are pretty safe there" (1882).',
]
total = sum(len(glob.glob(f'public/img/{t}/*.jpg')) for t, _ in TOPICS)
out = ['# Episode 3 archival images', '',
       f'{total} public-domain images for the edit (B&W photo cards on the desk), in `public/img/a_departure` to `i_portraits`, with credits in '
       '`public/img/credits.json` (title, artist, date, source page, rights). Contact sheets: `research/sheets/<topic>.jpg`. '
       'Sources: Library of Congress ("no known restrictions on publication"), Wikimedia Commons (public domain), the Internet Archive '
       '(pre-1930 publications; National Archives microfilm), Chronicling America. Look-dev references for the drawn sets are separate (`REFERENCES.md`).', '',
       '## Watch for', ''] + [f'- {w}' for w in WATCH] + ['']
for t, name in TOPICS:
    fs = sorted(glob.glob(f'public/img/{t}/*.jpg'))
    out += [f'## {name} ({len(fs)})', '', '| file | size | date | what it shows | how it could be used | flags | source |', '|---|---|---|---|---|---|---|']
    for f in fs:
        k = os.path.relpath(f, 'public/img'); b = os.path.basename(f); m = C.get(k, {}); w, h = Image.open(f).size
        what, use, flag = N.get(b, ('', '', ''))
        date = re.sub(r'date QS.*|-01-01.*|T00.*|Published on ', '', str(m.get('date', '')))[:16]
        page = m.get('page', '')
        src = 'LoC' if 'loc.gov' in page else 'Commons' if 'wikimedia' in page else 'Internet Archive' if 'archive.org' in page else 'link'
        out.append(f"| {'▫ ' if max(w, h) < 1000 else ''}`{b}` | {w}×{h} | {date} | {what.replace('|', '/')} | {use} | {flag} | [{src}]({page}) |")
    out.append('')
out += ['## Gaps', ''] + [f'- {g}' for g in GAPS] + ['']
txt = '\n'.join(out)
assert '—' not in txt, 'no em dashes'
open('research/IMAGES.md', 'w').write(txt)
missing = [os.path.basename(f) for t, _ in TOPICS for f in glob.glob(f'public/img/{t}/*.jpg') if os.path.basename(f) not in N]
print('IMAGES.md:', total, 'images; no notes for:', missing)
