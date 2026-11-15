"""Builds research/IMAGES.md: Ep 4's on-screen archival images, by topic, with credits (adapted from ep3/research/build_images_md.py).
   python3 research/build_images_md.py   (re-run after adding or removing images; credits come from public/img/credits.json)
   Contact sheets: python3 tools/sheet.py -> research/sheets/<topic>.jpg. Downloads: tools/find_images.py, tools/batch_get.py."""
import glob, json, os, re
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
C = json.load(open('public/img/credits.json'))
TOPICS = [
 ('a_city_growth', 'The city explodes: bird\'s-eye views, skylines, Chicago'),
 ('b_building_up', 'Building up: the Home Insurance Building, steel frames, elevators'),
 ('c_transit', 'Transit: the Brooklyn Bridge, elevated railways, horsecars, cable cars'),
 ('d_streets_filth', 'Too many, too fast: crowded streets, tenements, filth (Riis and the illustrated papers)'),
 ('e_fire', 'Fire: tenement fires and fire engines (nothing graphic)'),
 ('f_machine', 'The machine: Tammany Hall, elections, naturalization, favors'),
 ('g_tweed', 'Boss Tweed: portraits, the courthouse, Nast\'s cartoons, the Times exposé, the capture'),
 ('h_plunkitt', 'Plunkitt and "honest graft" (1905)'),
 ('i_brooklyn', 'Brooklyn: City Hall, McLaughlin, streets and ferries'),
 ('j_reform', 'Reform: civil service, reformers, Seth Low'),
]
# file -> (what it shows, how it could be used, flags). Flags: CARICATURE / SLUR / SENSITIVE / LATE (after 1890, label the date) / SMALL / MODERN
N = {
 # a_city_growth
 'birdseye_new_york_north_of_52nd_street_photo_1888_loc.jpg': ('Photograph from a high roof: Fifth Avenue running north past church spires and brownstones toward Central Park', 'The real city at our date, from above; under the population chart', ''),
 'broadway_east_side_9th_10th_street_photo_c1885_commons.jpg': ('Cast-iron store fronts on Broadway, a carriage at the curb', 'Commercial Manhattan, the money side of the city (wide crop)', ''),
 'chicago_birdseye_before_the_great_fire_harpers_1871_loc.jpg': ("Harper's double page: Chicago from the lake, ships in front, the grid running to the horizon", 'Chicago before it exploded (300,000 people); pair with the 1892 view', 'gutter down the middle'),
 'chicago_state_street_from_madison_stereo_1892_commons.jpg': ('Stereo card: State Street, Chicago, packed with streetcars, wagons and people', 'Chicago at full size; crop one half of the pair', 'LATE 1892'),
 'city_of_chicago_currier_ives_1892_loc.jpg': ('Currier and Ives colour view of Chicago from the lake: an endless grid of blocks and smokestacks', 'Chicago grown (about 1.1 million); the "after" for the 1871 view', 'LATE 1892'),
 'city_of_new_york_birdseye_currier_ives_1884_commons.jpg': ('Currier and Ives colour bird\'s-eye of Manhattan with the new Brooklyn Bridge, Brooklyn in the foreground', 'Opening wide shot of the setting; slow push in toward Brooklyn', ''),
 'new_york_birdseye_currier_ives_1883_commons.jpg': ('Currier and Ives bird\'s-eye of lower Manhattan for the Equitable Life building, bridge on the right', 'Alternative wide shot of the city in 1883', ''),
 'new_york_dry_goods_district_1886_commons.jpg': ('Colour poster: "A glimpse of New York\'s dry goods district", signs, wagons, crowds on Broadway', 'The busy commercial city; a colour accent among B&W', ''),
 'new_york_skyline_from_across_the_river_etching_1882_commons.jpg': ('Etching: people on a rocky shore looking across the water to the low skyline and the unfinished bridge', 'Quiet beat: the city seen from outside; weak as a main image', ''),
 # b_building_up
 'chicago_building_of_the_home_insurance_co_1885_loc.jpg': ('Framed colour lithograph: "The Chicago Building of the Home Insurance Co. of New York", ten storeys, carriages in front', 'The Home Insurance Building as new in 1885 (the key image for chapter 3)', 'frame and mat around the print'),
 'fair_building_chicago_steel_frame_under_construction_1891_loc.jpg': ('Engraving: the Fair Building in Chicago with its bare steel skeleton rising floor by floor', 'Shows how a steel frame works better than any photo; animate the floors', 'LATE 1891'),
 'home_insurance_building_chicago_1907_loc.jpg': ('Colour postcard of the Home Insurance Building on its corner, with the two storeys added in 1890', 'Second view of the building (note it is taller than in 1885)', 'LATE 1907'),
 'home_insurance_building_chicago_photo_c1920s_commons.jpg': ('Photograph of the Home Insurance Building among taller neighbours, 1920s cars below', 'Only as a small inset ("the first skyscraper, soon dwarfed")', 'SMALL; LATE c1920s'),
 'montauk_block_chicago_1886_commons.jpg': ('Engraving of the Montauk Block, Chicago (1882), a ten-storey office block over a street of carriages', 'Chicago going up before steel frames', ''),
 'new_york_northwest_from_world_building_1894_loc.jpg': ('Photograph from the World Building dome: City Hall Park, the Tweed Courthouse roofs, tall office towers', 'Skyline rising; the Tweed Courthouse is visible in the middle ground', 'LATE 1894'),
 'otis_elevator_patent_drawing_1861_commons.jpg': ("E. G. Otis's patent drawing for hoisting apparatus (elevator), 1861", 'The elevator that made tall buildings usable; insert', ''),
 'tallest_buildings_in_the_world_new_york_1901_loc.jpg': ('Colour photochrom: "The tallest buildings in the world", Park Row towers over low brick roofs', 'Where it led by 1900; end of the "up" section', 'LATE 1901'),
 # c_transit
 'a_typical_cable_accident_on_broadway_cartoon_1895_commons.jpg': ('Drawing: a crowd and a fallen woman beside a Broadway cable car, "A Typical Cable \'Accident\'"', 'Cable cars were fast and dangerous; a brief beat only', 'LATE 1895; SENSITIVE (injured woman, not graphic)'),
 'brooklyn_bridge_approaches_from_city_hall_park_1883_commons.jpg': ("Leslie's: the bridge and its Manhattan approach seen from City Hall Park, horsecars below", 'The bridge landing in the city; map-like view', 'Date: 1881 per LoC'),
 'brooklyn_bridge_cable_car_machinery_1883_commons.jpg': ("Leslie's: the engine room with huge wheels that pull the bridge's cable cars, and a car", 'How the bridge railway worked', ''),
 'brooklyn_bridge_distant_view_photo_1888_loc.jpg': ('Photograph: the bridge across rooftops and the river', 'The bridge in the Kellys\' time; B&W', ''),
 'brooklyn_bridge_grand_birdseye_currier_ives_1885_commons.jpg': ('Currier and Ives colour bird\'s-eye: the Great East River Suspension Bridge, harbour and both cities', 'Hero image for the bridge (1883)', ''),
 'brooklyn_bridge_leslies_1883_commons.jpg': ("Leslie's cover, April 28, 1883: workers lashing the stays high above the river", 'The men who built it; dizzying height', ''),
 'brooklyn_bridge_new_york_entrance_harpers_1883_loc.jpg': ("Harper's cover, May 1883: the New York entrance building, crowds, portrait of Roebling inset", 'Opening week; the station where the Kellys would walk on', ''),
 'brooklyn_bridge_opening_fireworks_1883_commons.jpg': ('Colour print: the grand display of fireworks at the opening, May 24, 1883', 'Celebration beat; colour', ''),
 'brooklyn_bridge_president_arthur_crossing_1883_commons.jpg': ("Harper's: President Arthur and his party crossing the bridge on opening day", 'Opening day', ''),
 'east_river_bridge_photo_1885_commons.jpg': ('Photograph: the bridge from the water with sailing ships and a steamer', 'Clean B&W establishing shot of the bridge', ''),
 'elevated_s_curve_110th_street_photo_c1889_commons.jpg': ('Photograph: the elevated railway on tall iron legs curving at 110th Street', 'The El at our date; dramatic structure', ''),
 'first_train_gilbert_elevated_sixth_avenue_1878_loc.jpg': ("Leslie's: the first train on the Gilbert Elevated over Sixth Avenue, crowds and horsecars below", 'The elevated arrives (1878)', ''),
 'new_york_and_brooklyn_bridge_photo_1889_loc.jpg': ('Photograph (Albertype): the bridge behind masts and waterfront sheds', 'Bridge and working port together', ''),
 'sixth_avenue_elevated_42nd_street_photo_c1888_commons.jpg': ('Photograph under the Sixth Avenue El at 42nd Street: dark iron, strips of light, shops', 'Life under the El: noise and shadow', ''),
 'the_cars_as_they_will_be_on_the_brooklyn_bridge_1883_loc.jpg': ("Harper's page: the cars as they will be on the bridge; below, at the dog pound", 'Bridge cars (top half only)', 'crop the top panel'),
 'the_crowded_horse_car_1872_loc.jpg': ('Engraving: two horses straining to pull an overloaded horsecar', 'Before electric power: horses did it all', ''),
 # d_streets_filth
 'doing_the_slums_five_points_leslies_1885_commons.jpg': ("Leslie's: well-dressed visitors with a policeman \"doing the slums\" in the Five Points; poor women and children watch", 'How the rich looked at the poor; frame it critically', 'CARICATURE (mild, the poor drawn as types)'),
 'homeless_poor_donovan_lane_five_points_1872_commons.jpg': ("Leslie's: \"Our homeless poor\", early morning in Donovan Lane near the Five Points, a crumbling alley", 'Poverty before Riis; atmosphere', ''),
 'opper_street_cleaning_authorities_summer_epidemics_1879_loc.jpg': ("Opper in Leslie's: a lone sweeper pushes garbage around while rubbish barrels overflow, \"How the street-cleaning authorities guard against summer epidemics\"", 'Filth and a city government that did not cope; light satire', 'CARICATURE (check the sweeper; he may be drawn as an Irish type)'),
 'riis_at_the_cradle_of_the_tenement_1890_commons.jpg': ('Drawing from How the Other Half Lives: two girls on the stoop of an old tenement doorway', 'Tenement children; gentle', ''),
 'riis_bandits_roost_c1888_commons.jpg': ("Riis: Bandit's Roost, a narrow alley off Mulberry Street, men in bowler hats staring at the camera", 'The iconic Riis image; framed', 'real private people'),
 'riis_baxter_street_alley_mulberry_bend_c1888_loc.jpg': ('Riis: Baxter Street alley in Mulberry Bend, wooden stairs, laundry, a figure on the steps', 'Tenement yard', 'real private people'),
 'riis_birdseye_view_east_side_tenement_block_1890_commons.jpg': ('Line drawing: a whole East Side tenement block from above, buildings packed to the back', 'Explains crowding; good under the 3D model', ''),
 'riis_gotham_court_c1890_commons.jpg': ('Drawing (Otto Bacher, after Riis): Gotham Court, a narrow tenement alley with women and children', 'The worst tenement in the city; atmosphere', ''),
 'riis_hester_street_c1890_loc.jpg': ('Riis: Hester Street, a busy market street', 'Crowded street', 'real private people'),
 'riis_how_the_other_half_lives_cover_1890_commons.jpg': ('The cloth cover of How the Other Half Lives (1890)', 'Name the book on screen', ''),
 'riis_lodgers_bayard_street_tenement_1889_commons.jpg': ('Riis: lodgers sleeping on the floor and in bunks of a crowded Bayard Street tenement room, "five cents a spot"', 'The strongest crowding image; framed, with dignity', 'SENSITIVE (people in bed, poverty); real private people'),
 'riis_mulberry_bend_c1890_commons.jpg': ('Riis: Mulberry Bend street, packed with people, carts and fire escapes', 'The crowded street, large and sharp', 'real private people'),
 'riis_stale_bread_vendor_mulberry_bend_c1890_loc.jpg': ('Riis: a woman selling stale bread from a basket in Mulberry Bend', 'Making a living on the street', 'real private people'),
 'riis_vegetable_stand_mulberry_bend_c1890_loc.jpg': ('Riis: a vegetable stand under an umbrella, a banca (bank) and post office sign', 'Immigrant street economy', 'real private people'),
 'view_of_mulberry_bend_contract_laborers_leslies_1888_commons.jpg': ("Leslie's: Mulberry Bend crowded with Italian contract laborers leaving for the coal mines", 'The street at its most crowded; who lived there', ''),
 # e_fire
 'a_fire_on_broadway_new_york_1893_loc.jpg': ('Photograph: a steam fire engine and horses working at a fire on Broadway, hoses in the street', 'The fire engines come; real equipment', 'LATE 1893'),
 'burning_of_a_tenement_house_forty_fifth_street_1860_loc.jpg': ("Harper's: a tenement house burning at night on Forty-fifth Street, crowds below", 'Night fire for the cold open (glow, no victims shown)', 'SENSITIVE (caption reports deaths; show the building only); early 1860'),
 'currier_ives_life_of_a_fireman_night_fire_c1854_commons.jpg': ('Currier and Ives colour print: a city street fire, flames and smoke, volunteer firemen hauling engines', 'Colour fire-glow reference for the drawn set', 'early (volunteer era)'),
 'firemen_spraying_burning_building_14th_street_1909_loc.jpg': ('Photograph: firemen spraying a burning building on 14th Street, smoke, a trolley in front', 'Scale of a city fire (later date)', 'LATE 1909'),
 'horse_drawn_fire_engine_rushing_to_a_fire_1900_loc.jpg': ('Photograph: three white horses pull a steam fire engine at a gallop', '"The fire engines come"', 'LATE 1900'),
 'new_york_world_building_fire_chromolithograph_1883_loc.jpg': ('Colour lithograph: the World Building on fire at night (January 1882), steam engines and crowds in the snow', 'Winter night fire with engines; strong colour', 'SENSITIVE (a deadly fire; nothing graphic shown)'),
 'number_twelve_steam_fire_engine_1897_loc.jpg': ('Photograph: Engine Number Twelve, a steam pumper with its horses and crew outside the firehouse', 'The equipment, close', 'LATE 1897'),
 'riis_tenement_fire_escape_as_extension_of_the_flat_c1890_loc.jpg': ('Riis: a tenement fire escape crammed with bedding, laundry and belongings', 'Why tenement fires were deadly: blocked escapes', ''),
 'the_american_fireman_always_ready_maurer_1858_commons.jpg': ('Currier and Ives print (Maurer): a fireman in helmet hauling an engine out of the firehouse', 'Fireman as hero; colour', 'early 1858'),
 # f_machine
 'counting_the_vote_at_elephant_johnnies_1876_loc.jpg': ("Leslie's: counting the vote on election night at \"Elephant Johnnie's\", a saloon used as a polling place, police and officials around a ballot box", 'Election day in a saloon: the machine\'s home ground', 'real named private person (the saloon keeper)'),
 'hard_coal_for_the_poor_1874_loc.jpg': ("Harper's: a coal man shovelling coal into a poor woman's bucket in the snow, children waiting", 'Coal for the winter: the kind of favor the ward heeler gave', ''),
 'john_kelly_galvanizes_the_corpse_of_tammany_puck_1882_loc.jpg': ('Puck colour cover: Tammany boss John Kelly using a battery to revive a Tammany corpse', 'Tammany in the 1880s (Kelly, boss until 1886)', 'CARICATURE (check: Tammany "Indian" costume)'),
 'nast_move_on_naturalized_voter_1871_loc.jpg': ('Nast: at the polls, an Irish-caricatured crowd and a policeman push away a Native American voter, "Move on!"', 'Only if the script discusses who was let vote', 'CARICATURE (Irish and Native American)'),
 'nast_tammany_defeat_1875_loc.jpg': ('Nast: the Republican elephant trampling "Reformed Tammany Hall", 1875', 'Tammany beaten, briefly', ''),
 'nast_tammany_hall_going_to_the_inauguration_1885_loc.jpg': ('Nast: Tammany men marching to Cleveland\'s inauguration with a "Tammany Hall: This is our funeral" banner', 'Tammany in our decade', ''),
 'naturalization_of_foreigners_judge_mccunn_1869_loc.jpg': ("Leslie's: Judge McCunn's court mass-naturalizing immigrants at night, October 1869", 'The machine turning immigrants into voters (naturalization mills)', ''),
 'naturalization_scene_in_tammany_hall_1856_commons.jpg': ("Leslie's: naturalization of foreigners at Tammany Hall, men lined up at a desk", 'Same, earlier; Tammany\'s own hall', 'CARICATURE (mild, Irish types); early 1856'),
 'october_elections_challenging_a_voter_1872_loc.jpg': ("Harper's page: challenging a voter at the polls; Pennsylvania miners at the polls", 'Election-day scenes (polls, ballot boxes)', ''),
 'pewter_mug_tavern_and_tammany_hall_1860_commons.jpg': ('Print: the Pewter Mug tavern and the old Tammany Hall on Frankfort Street, 1860, a crowd at night', 'Saloon and machine side by side', 'early'),
 'philadelphia_election_fraud_repeaters_leslies_1872_loc.jpg': ("Leslie's cover: the Philadelphia election fraud, repeaters and a scuffle at the polls", 'Vote fraud (a machine elsewhere); illustrate "votes bought and repeated"', 'SENSITIVE (scuffle)'),
 'presidential_electioneering_new_york_street_scene_1864_loc.jpg': ('Illustrated London News: presidential electioneering in New York, a street speaker and a torchlight procession', 'Torchlight parades; politics as street theatre', 'early 1864'),
 'shoe_line_bowery_gift_from_tim_sullivan_1910_loc.jpg': ('Photograph: Bowery men lined up for free shoes, a gift from Tammany\'s "Big Tim" Sullivan', 'The machine as charity: the best real photo of favors for votes', 'LATE 1910; real private people'),
 'tammany_hall_14th_street_photo_1875_commons.jpg': ('Stereo card: Tammany Hall on 14th Street', 'The building (crop one half)', ''),
 'tammany_hall_14th_street_photo_c1890_commons.jpg': ('Photograph: Tammany Hall on 14th Street, brick and arches, a horse at the curb', 'The building, clean B&W', ''),
 'tammany_hall_interior_convention_1868_commons.jpg': ('Colour print: the hall inside Tammany, decorated with flags for the 1868 Democratic convention', 'Inside the wigwam; colour', ''),
 'watching_the_election_returns_times_building_1907_loc.jpg': ('Stereo card: huge night crowds watching election returns at Times Square', 'Election night excitement (much later)', 'LATE 1907'),
 # g_tweed
 'county_court_house_kings_handbook_1893_commons.jpg': ("King's Handbook: the County Court-House (Tweed Courthouse) from the street", 'The finished courthouse', 'LATE 1893'),
 'how_new_york_is_governed_frauds_of_the_tammany_democrats_nyt_1871_ia.jpg': ('Title page of the Times pamphlet "How New York is Governed. Frauds of the Tammany Democrats" (1871)', 'The exposé in print', ''),
 'how_new_york_is_governed_ingersoll_accounts_page_nyt_1871_ia.jpg': ('Page of the same pamphlet: columns of warrants paid to Ingersoll & Co. and others for furniture and repairs', 'Zoom into the numbers (chairs, carpets); the ledger', 'names Ring members'),
 'nast_as_long_as_i_count_the_votes_harpers_1871_loc.jpg': ("Nast: Tweed leaning on a ballot box, \"In counting there is strength\": \"As long as I count the votes, what are you going to do about it?\"", 'Tweed\'s contempt in one panel; key image', ''),
 'nast_group_of_vultures_let_us_prey_harpers_1871_loc.jpg': ('Nast: the Ring as vultures on a mountain ledge over the bones of New York, "Let us prey"', 'The Ring feeding on the city', ''),
 'nast_self_portrait_harpers_1876_commons.jpg': ("Nast self-portrait at his drawing board, Harper's 1876", 'Introduce Nast', ''),
 'nast_stone_walls_do_not_a_prison_make_1872_loc.jpg': ('Nast: Tweed too big for the city jail, bursting out of it', 'Rich men did not stay in jail; the escape', ''),
 'nast_stop_thief_harpers_1871_loc.jpg': ('Nast: the Ring running from the Treasury with bags of money, "Stop thief!"', 'The Ring flees after the exposé', 'foxed scan'),
 'nast_the_arrest_of_boss_tweed_another_good_joke_1871_loc.jpg': ('Nast: Tweed laughing in a chair while officials make a show of arresting him, "another good joke"', 'Arrest of 1871', ''),
 'nast_the_brains_harpers_1871_loc.jpg': ('Nast: "The Brains", Tweed\'s body with a money bag for a head', 'The most famous Tweed image; key image', ''),
 'nast_the_power_behind_the_throne_tammany_ring_dom_in_paine_1904_ia.jpg': ('Nast: "The Tammany Ring-dom", Tweed as the power behind a puppet king (Governor Hoffman)', 'Tweed controlled the officials', 'book reprint (Paine 1904)'),
 'nast_the_spirit_of_tweed_is_mighty_still_1886_loc.jpg': ('Nast: the ghost of Tweed in prison stripes next to a poster of "bribery and corruption" in New York, 1886', 'Tweed was gone but the system lived on (our decade)', 'SMALL'),
 'nast_the_tammany_tiger_loose_harpers_1871_ia.jpg': ('Nast double page: the Tammany tiger mauling Columbia in a Roman arena while Tweed and the Ring watch, "What are you going to do about it?"', 'The great tiger image; first use of the tiger symbol', 'SENSITIVE (allegorical violence: a woman mauled, bodies in the arena); stitched across the gutter, part of the caption lost'),
 'nast_too_thin_ring_members_1871_in_paine_1904_ia.jpg': ('Nast: four Ring members (Tweed, Sweeny, Connolly, Hall) protest "We know nothing about the stolen vouchers", "Too thin!"', 'After the vouchers vanished', 'book reprint (Paine 1904)'),
 'nast_tweed_le_dee_and_tilden_dum_harpers_1876_loc.jpg': ("Nast, Harper's cover July 1, 1876: Tweed in prison stripes holding two street boys by the collar", 'The cartoon Spanish officials used to identify him', ''),
 'nast_two_great_questions_harpers_1871-08-19_ia.jpg': ('Nast full page: "Who is Ingersoll\'s Co.?" above, "Who stole the people\'s money? Do tell. \'Twas him." below', 'Both panels; the pointing circle', ''),
 'nast_two_great_questions_original_woodblock_1871_commons.jpg': ('The engraved printing block of "Two Great Questions" (metal and wood surface, image in relief)', 'How the cartoons were printed; a texture shot', ''),
 'nast_under_the_thumb_1871_in_paine_1904_ia.jpg': ('Nast: "Under the Thumb", Tweed\'s giant thumb pressing down on Manhattan, "Well, what are you going to do about it?"', 'Tweed\'s power over the city', 'SMALL; book reprint (Paine 1904)'),
 'nast_what_are_you_laughing_at_harpers_1871_commons.jpg': ("Nast, Harper's cover Nov 25, 1871: Tweed in Roman armour, the Ring smashed, \"What are you laughing at? To the victor belong the spoils\"", 'The fall of 1871', ''),
 'nast_who_stole_the_peoples_money_twas_him_harpers_1871_ia.jpg': ('Nast: the Ring in a circle, each pointing to the man beside him, "Who stole the people\'s money? Do tell. \'Twas him."', 'Key image; slow zoom around the circle', ''),
 'new_york_county_court_house_valentines_manual_1868_commons.jpg': ("Lithograph from Valentine's Manual: the planned County Court House with its dome (never built that way)", 'The courthouse as promised', ''),
 'new_york_times_front_page_1871-07-22_ia.jpg': ('The New-York Times front page, July 22, 1871: "The Secret Accounts. Proofs of undoubted frauds brought to light", columns of payments', 'The exposé; zoom to the headline and the Ingersoll table', 'microfilm, dark; grade up'),
 'the_capture_of_tweed_the_picture_that_made_spanish_officials_harpers_1876-10-07_ia.jpg': ("Harper's, Oct 7, 1876: \"The Capture of Tweed: the picture that made the Spanish officials take him for a child-stealer\", the Tweed-le-dee cartoon reprinted with the story", 'Insert for the Vigo scene: the cartoon and the caption together', ''),
 'thomas_nast_portrait_brady_c1865_commons.jpg': ('Brady studio photograph of Thomas Nast seated', 'Introduce Nast', ''),
 'tweed_courthouse_rotunda_courtyard_habs_photo_modern_commons.jpg': ('Survey photograph of the courthouse rotunda: iron galleries and arches', 'Reference for the bootblack-stand set', 'MODERN (HABS)'),
 'tweed_courthouse_side_view_stereo_c1916_commons.jpg': ('Stereo card: side view of "Boss Tweed\'s courthouse"', 'Courthouse exterior', 'LATE 1916'),
 'tweed_portrait_1873_commons.jpg': ('Engraved portrait of William M. Tweed', 'Identity card for Tweed', ''),
 'tweed_portrait_brady_handy_c1870_commons.jpg': ('Brady-Handy photograph of Tweed, head and shoulders', 'Main Tweed portrait', ''),
 # h_plunkitt
 'plunkitt_honest_graft_and_dishonest_graft_chapter_page_1905_ia.jpg': ('Book page: "Honest Graft and Dishonest Graft", the opening of Plunkitt\'s first talk', 'Text on screen for chapter 7', ''),
 'plunkitt_i_seen_my_opportunities_page_1905_ia.jpg': ('Book page beginning "...whole thing by sayin\': \'I seen my opportunities and I took \'em.\'"', 'The famous line, highlighted', ''),
 'plunkitt_of_tammany_hall_title_page_1905_ia.jpg': ('Title page: Plunkitt of Tammany Hall, "talks... from his rostrum, the New York County Court-House bootblack stand", Riordon, 1905', 'Name the book and the bootblack stand', 'LATE 1905'),
 'plunkitt_on_his_rostrum_bootblack_stand_frontispiece_1905_ia.jpg': ('Frontispiece photograph: Plunkitt in a top hat seated on his "rostrum", the courthouse bootblack stand, with other men and a girl', 'The real stand; reference for the drawn set', 'LATE 1905; real private people beside him'),
 'plunkitt_portrait_c1910_commons.jpg': ('Studio portrait of George Washington Plunkitt (spelled "Plunkett" on the plate)', 'Identity card for Plunkitt', 'LATE c1910'),
 # i_brooklyn
 'brooklyn_bridge_and_elevated_railways_from_brooklyn_1890_loc.jpg': ('Stereo card: the Brooklyn end of the bridge and the elevated railway terminal', 'Brooklyn side of the bridge, the Kellys\' way to work', ''),
 'brooklyn_city_hall_1895_commons.jpg': ('Blue roundel print of Brooklyn City Hall with flags and carriages', 'McLaughlin\'s city hall', 'LATE 1895'),
 'brooklyn_city_hall_stereo_commons.jpg': ('Stereo card: Brooklyn City Hall with its cupola and the park in front', 'Brooklyn City Hall, B&W', 'date range 1862 to 1915'),
 'brooklyn_institute_and_houses_washington_street_brooklyn_c1910_loc.jpg': ('Photograph: the Brooklyn Institute and row houses on Washington Street, the El at the end', 'A real Brooklyn street', 'LATE (print stamped 1910)'),
 'carr_picnic_prospect_park_brooklyn_1883_commons.jpg': ('Samuel Carr painting: a picnic in Prospect Park, Brooklyn, 1883, children in white under trees', 'Brooklyn leisure in our year; contrast with the tenements', ''),
 'ferry_boat_crossing_east_river_stereo_commons.jpg': ('Stereo card: a ferry crossing the East River, a bridge tower rising behind', 'How Brooklyn crossed before the bridge', 'c1870s'),
 'hugh_mclaughlin_portrait_commons.jpg': ('Engraved portrait of Hugh McLaughlin, the Brooklyn Democratic boss', 'Identity card for Brooklyn\'s own boss', 'published 1910'),
 'new_york_from_brooklyn_fulton_street_ferry_stereo_c1860s_loc.jpg': ('Stereo card: the Fulton Street ferry house in Brooklyn, Manhattan across the water', 'Brooklyn waterfront', 'early'),
 'the_city_hall_brooklyn_1863_loc.jpg': ('Photograph: Brooklyn City Hall from the side, cupola and columns', 'Brooklyn City Hall', 'early 1863'),
 'washington_street_from_fulton_brooklyn_1900_loc.jpg': ('Detroit Publishing photo: Washington Street from Fulton, Brooklyn, the El and Borough Hall park', 'Downtown Brooklyn street', 'LATE 1900'),
 # j_reform
 'charles_parkhurst_portrait_1896_commons.jpg': ('Photograph of the Rev. Charles Parkhurst in robes; his 1892 sermons attacked Tammany', 'A reformer', 'LATE 1896'),
 'civil_service_cerberus_hercules_of_spoils_1880_loc.jpg': ('Cartoon drawing: a spoils-system Hercules with a club facing a three-headed civil service watchdog', 'Civil service vs the spoils system', 'SMALL'),
 'consistent_civil_service_reform_puck_1885_loc.jpg': ('Opper, Puck cover 1885: President Cleveland and office-seekers, "Consistent civil service reform"', 'Jobs as rewards; reform', ''),
 'gillam_a_hard_job_with_the_hogs_spoilsmen_puck_1885_loc.jpg': ('Gillam, Puck 1885: President Cleveland trying to drive a herd of office-seeking hogs', 'Office-seekers wanting their jobs', ''),
 'men_may_come_work_of_reform_puck_1884_loc.jpg': ('Keppler, Puck 1884: Columbia and a reform worker, a crane lifting civil service reform into place', 'Reform as building work', ''),
 'nast_civil_service_reform_1877_loc.jpg': ('Nast 1877: office-seekers bowing at a statue of Andrew Jackson, "To the victor belong the spoils"', 'Where the spoils system came from', ''),
 'pughe_the_independents_fought_nobly_puck_1894_commons.jpg': ('Pughe, Puck 1894: the Tammany tiger and party bosses in a heap, the reform banner flying', 'Reform beats Tammany in 1894', 'LATE 1894; CARICATURE (check faces)'),
 'seth_low_portrait_1901_commons.jpg': ('Photograph of Seth Low, standing', 'Brooklyn reform mayor (1882 to 1885); this portrait is later', 'LATE 1901'),
}
WATCH = [
 '**Key images for the script:** "Who Stole the People\'s Money?" (now a clean crop of the lower panel from the IA microfilm of *Harper\'s*, Aug 19, 1871), '
 '"The Brains", "The Tammany Tiger Loose" (stitched by hand from the two microfilm pages of Nov 11, 1871: the join is invisible in the art, but the caption loses '
 '"E." of "LOOSE" in the gutter), "As long as I count the votes", "Under the Thumb", "Tweed-le-dee and Tilden-dum" and its Oct 7, 1876 reprint with the capture story, '
 'and the *Times* front page of July 22, 1871 ("The Secret Accounts").',
 '**LoC copies that failed:** LoC items 2022641895 ("Who Stole") and 2021630656 ("Tiger Loose") returned 503 errors every time; the IA microfilm versions replace them. '
 '"Under the Thumb", "Too Thin!" and "The Power behind the Throne" are crops from Paine, *Th. Nast: His Period and His Pictures* (1904): fine for insets, soft at full frame.',
 '**Caricatures** are marked CARICATURE: brief, framed by narration, never played for laughs. Nast\'s "Move On!" (1871) caricatures both Irish voters and a Native American '
 'and should appear only if the script talks about who could vote. The 1856 Tammany naturalization scene draws the Irish as rough types. Puck\'s "Tammany Fagin" (an '
 'antisemitic Fagin figure) was downloaded and then deleted. Most of the Tweed cartoons caricature Tweed himself (a public figure), not an ethnic group.',
 '**Sensitive:** "The Tammany Tiger Loose" (allegorical violence, Columbia mauled, bodies in the arena); the 1860 tenement fire (the caption reports deaths; show the '
 'burning building only); the World Building fire (deadly, nothing shown); the Philadelphia fraud cover (a scuffle); the 1895 cable car "accident" (a fallen woman); '
 'Riis\'s lodging-room photo (people in bed). Nothing gory was kept.',
 '**Date labels needed** (LATE): Plunkitt (1905 book, c1910 portrait), the Tim Sullivan shoe line (1910), election crowds (1907), the 14th Street fire (1909), '
 'Seth Low (1901) and Parkhurst (1896), the 1890s skyline views, the Home Insurance postcard (1907) and photo (1920s). Plunkitt\'s fire story itself is from 1905: '
 'narrate it as "how the machine worked."',
 '**Real private people:** Riis\'s subjects, the men in the Bowery shoe line, the men and girl beside Plunkitt on the bootblack stand, the owner of "Elephant Johnnie\'s". '
 'The *Times* and pamphlet pages name Ring members and contractors (public figures for this story).',
 '**Small files** (under 1000 px on the long side) are marked with a small square below: insets only. The Home Insurance Building has no large period photograph on '
 'Commons or LoC; the 1885 lithograph (LoC 2010634573) is the best image of it.',
 '**Scans with frames or bars:** several LoC prints include mats, frames or colour bars (Home Insurance lithograph, the Cerberus drawing was trimmed). Crop in the edit.',
]
GAPS = [
 'Electric trolley in Richmond (1888): no public-domain photo found; the only trolley images are 1897 and later (Boston, Rights not cleared at LoC).',
 'Cable cars on Brooklyn or Chicago streets in the 1880s: only the Brooklyn Bridge cable car machinery (1883) and the 1895 Broadway "accident" drawing.',
 'Horses, manure, dead horses in the street: no public-domain photo found for the 1880s (the famous ones are Municipal Archives / MCNY). Use the Opper 1879 cartoon or a drawn set.',
 'Street cleaning: Waring\'s "White Wings" (1895 onward) not found PD; after our date anyway.',
 'A burned-out family on the street at night: none found (and the plan keeps faces off screen). The cold open is better drawn; the 1860 and 1882 fire prints give the glow.',
 'Ward heeler, ward club or saloon interior in the 1880s: only "Elephant Johnnie\'s" (1876) and the Tim Sullivan shoe line (1910). No PD photo of a Tammany clubhouse interior.',
 'Hugh McLaughlin: only one engraved portrait (published 1910, 1196 px). No photograph of him or of Brooklyn\'s Democratic headquarters (Willoughby Street) found.',
 'Williamsburg in the 1880s: nothing usable; Brooklyn street photos are 1900 and later.',
 'Seth Low as Brooklyn mayor (1882 to 1885): only portraits from 1901 and later at usable size (an 1890 image is 494 px).',
 'Tweed Courthouse under construction (1860s): no photograph found; Valentine\'s 1868 lithograph shows the planned building.',
 'The Spanish arrest itself (Vigo, 1876): no image beyond Harper\'s reprint of the cartoon; the scene is drawn (`ep4_vigo`).',
 'Election day in Brooklyn in the 1880s: none; New York and Philadelphia scenes of the 1870s stand in.',
 'Not downloaded (rights "not evaluated" or blank at LoC, no Commons copy): Riis "Bootblacks, New York" (1896), "The East River, Brooklyn" (1900), the Leslie\'s 1883 bridge view (2006684386), '
 'the 1890 to 1920 horsecar and trolley photos (2005690145), the 1903 Chicago steel frame (89711517), the Harper\'s Monthly Tweed engraving (2004677360), Nast\'s "Even Tammany sachems draw the line" (Goldstein collection, restricted).',
]
total = sum(len(glob.glob(f'public/img/{t}/*.jpg')) for t, _ in TOPICS)
out = ['# Episode 4 archival images', '',
       f'{total} public-domain images for the edit, in `public/img/a_city_growth` to `j_reform`, with credits in `public/img/credits.json` '
       '(title, artist, date, licence, source page, source id). Contact sheets: `research/sheets/<topic>.jpg`. '
       'Sources: Library of Congress ("no known restrictions on publication"), Wikimedia Commons (public domain), the Internet Archive '
       '(pre-1930 publications: *Harper\'s Weekly* and *New-York Times* microfilm, Paine 1904, Riordon 1905, the 1871 *Times* pamphlet). '
       'Every file is a JPEG of at most 4000 px on the long side. Tools: `tools/find_images.py` (search, get), `tools/batch_get.py` (lists), '
       '`tools/sheet.py` (contact sheets), `tools/rename.py` and `tools/add_credit.py` (hand-made crops and stitches).', '',
       '## Watch for', ''] + [f'- {w}' for w in WATCH] + ['']
for t, name in TOPICS:
    fs = sorted(glob.glob(f'public/img/{t}/*.jpg'))
    out += [f'## {name} ({len(fs)})', '', '| file | size | date | what it shows | how it could be used | flags | source |', '|---|---|---|---|---|---|---|']
    for f in fs:
        k = os.path.relpath(f, 'public/img'); b = os.path.basename(f); m = C.get(k, {}); w, h = Image.open(f).size
        what, use, flag = N.get(b, ('', '', ''))
        date = re.sub(r'date QS.*|-01-01.*|T00.*|Published on ', '', str(m.get('date', '')))[:40]
        page = m.get('page', '')
        src = 'LoC' if 'loc.gov' in page else 'Commons' if 'wikimedia' in page else 'Internet Archive' if 'archive.org' in page else 'link'
        out.append(f"| {'▫ ' if max(w, h) < 1000 else ''}`{b}` | {w}×{h} | {date} | {what.replace('|', '/')} | {use} | {flag} | [{src}]({page}) |")
    out.append('')
out += ['## Gaps', ''] + [f'- {g}' for g in GAPS] + ['']
txt = '\n'.join(out)
assert '\u2014' not in txt, 'no em dashes'
open('research/IMAGES.md', 'w').write(txt)
missing = [os.path.basename(f) for t, _ in TOPICS for f in glob.glob(f'public/img/{t}/*.jpg') if os.path.basename(f) not in N]
print('IMAGES.md:', total, 'images; no notes for:', missing)
