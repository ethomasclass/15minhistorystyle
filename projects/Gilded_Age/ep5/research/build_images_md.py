"""Builds research/IMAGES.md: Ep 5's on-screen archival images, by topic, with credits (adapted from ep4/research/build_images_md.py).
   python3 research/build_images_md.py   (re-run after adding or removing images; credits come from public/img/credits.json)
   Contact sheets: python3 tools/sheet.py -> research/sheets/<topic>.jpg. Downloads: tools/find_images.py, tools/batch_get.py."""
import glob, json, os, re
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
C = json.load(open('public/img/credits.json'))
TOPICS = [
 ('a_work_conditions', 'Work: steel, cigar making in tenements, sweatshops, child labor'),
 ('b_1877_strike', 'The Great Railroad Strike of 1877: Martinsburg, Baltimore, Pittsburgh'),
 ('c_knights_haymarket', 'The Knights of Labor, the 1886 strikes and Haymarket'),
 ('d_afl_gompers', 'Gompers, the AFL and Labor Day'),
 ('e_homestead', 'Homestead, 1892'),
 ('f_pullman', 'Pullman and Debs, 1894'),
 ('g_farm_life', 'Farm life: Butcher\'s Nebraska sod houses, railroads and land, wheat, cotton'),
 ('h_grange_alliance', 'The Grange and the Farmers\' Alliance'),
 ('i_populists', 'The Populists, the Panic of 1893 and Coxey\'s Army'),
 ('j_1896', '1896: Bryan, McKinley, Hanna, gold and silver'),
 ('k_later_reforms', 'Later reforms: secret ballot, 16th and 17th Amendments'),
 ('l_garfield_civil_service', 'Garfield, Guiteau and civil service reform'),
 ('m_henry_george_1886', 'Henry George and the 1886 New York mayoral race'),
]
# file -> (what it shows, how it could be used, flags). Flags: CARICATURE / SENSITIVE / LATE (after 1896, label the date) / SMALL
N = {
 # a_work_conditions
 'bessemer_steel_manufacture_waud_loc.jpg': ("Harper's page by A. R. Waud: scenes of Bessemer steel making, converters, rolling, men at the furnace", 'How steel was made; crop single panels', 'scan shows the page edge: crop'),
 'making_bessemer_steel_pittsburgh_converters_loc.jpg': ("Harper's, two engravings: Bessemer converters blasting sparks in Pittsburgh; men moving ingots", 'Hero image for the heat and danger of steel work', 'crop the top panel'),
 'cigar_makers_strike_tenement_cigar_making_loc.jpg': ("Engraving: a family rolling cigars at a table in their tenement room, a small child beside them", 'Home work: Gompers\'s own trade (cigar makers)', 'scan of bound volume: crop'),
 'bohemian_cigarmakers_tenement_riis_1890_commons.jpg': ('Riis halftone: a bearded man and a boy making cigars in a cramped tenement room', 'Same subject as a photograph (How the Other Half Lives, 1890)', 'soft halftone'),
 'ludlow_street_sweaters_shop_riis_1890_commons.jpg': ('Riis photograph: men sewing garments in a crowded Ludlow Street tenement workshop', 'The sweatshop; strong B&W', ''),
 'breaker_boys_hine_LATE_1911_loc.jpg': ('Hine: a row of breaker boys standing in front of a wooden building', 'Child labor (Hine is later: label the date)', 'LATE 1911'),
 'girls_warping_machines_loray_mill_hine_LATE_1908_loc.jpg': ('Hine: girls running warping machines in the Loray mill, Gastonia, N.C.', 'Child labor in textile mills', 'LATE 1908'),
 # b_1877_strike
 'annals_of_the_great_strikes_plate_a_1877_commons.jpg': ('Plate from Annals of the Great Strikes (1877)', 'Strike scenes from a book of the year', ''),
 'annals_of_the_great_strikes_plate_b_1877_commons.jpg': ('Plate from Annals of the Great Strikes (1877)', 'Strike scenes from a book of the year', ''),
 'battle_railroad_strike_chicago_cavalry_1877_loc.jpg': ('Engraving: cavalry with swords charging strikers in Chicago', 'Force used against strikers', 'SENSITIVE (violence)'),
 'blockade_of_engines_martinsburg_harpers_1877_loc.jpg': ("Harper's page: engines blockaded at Martinsburg; the Lebanon Valley bridge burning", 'Where the strike began (Martinsburg, W. Va.)', ''),
 'burning_machine_shops_and_freight_trains_pittsburgh_1877_loc.jpg': ('Engravings: offices, machine shops and freight trains burning in Pittsburgh', 'The Pittsburgh fires', ''),
 'burning_of_the_roundhouse_pittsburgh_harpers_1877_loc.jpg': ("Harper's: the roundhouse at Pittsburgh in flames; a funeral below", 'The roundhouse siege', 'crop the top panel'),
 'burning_of_the_union_depot_headley_1882_commons.jpg': ('Book engraving (Headley 1882): the Union Depot burning', 'Pittsburgh fire, a second view', ''),
 'damaged_track_pennsylvania_railroad_photo_1877_loc.jpg': ('Photograph: torn-up track and wrecked cars on the Pennsylvania Railroad', 'Real aftermath photo', ''),
 'dennys_curve_end_of_the_fire_photo_1877_loc.jpg': ("Photograph: burned cars at Denny's Curve, outer end of the fire, Pittsburgh", 'Scale of the destruction', ''),
 'destruction_of_the_union_depot_pittsburgh_harpers_1877_commons.jpg': ("Harper's, Aug 11, 1877: crowds and flames at the Union Depot", 'The Pittsburgh climax', ''),
 'devastation_of_railroad_cars_locomotives_photo_1877_loc.jpg': ('Photograph: rows of burned cars and locomotives', 'Aftermath', ''),
 'interior_lower_roundhouse_ruins_photo_1877_loc.jpg': ('Photograph: inside the ruined lower roundhouse where troops were besieged', 'Aftermath; quiet beat', ''),
 'lower_roundhouse_where_troops_were_besieged_photo_1877_loc.jpg': ('Photograph: the lower roundhouse ruins between 26th and 27th streets', 'Aftermath', ''),
 'robert_ammon_strike_leader_fort_wayne_railroad_1877_loc.jpg': ("Leslie's: Robert Ammon, leader of the Fort Wayne line strike, directing trains", 'A face for the strikers', ''),
 'sixth_maryland_regiment_fighting_through_baltimore_harpers_1877_loc.jpg': ("Harper's: the Sixth Maryland Regiment firing as it fights through a Baltimore crowd", 'Baltimore, July 20, 1877', 'SENSITIVE (firing on people)'),
 'steeple_view_pittsburgh_conflagration_harpers_1877_loc.jpg': ("Harper's: steeple view of the Pittsburgh conflagration", 'Wide shot of the fire', ''),
 # c_knights_haymarket
 'a_knight_of_labor_print_c1890_loc.jpg': ('Print: "A knight of labor", a worker as a knight', 'Knights of Labor ideal', ''),
 'albert_parsons_portrait_c1880_commons.jpg': ('Portrait of Albert Parsons', 'Haymarket defendant', 'SMALL'),
 'august_spies_portrait_1886_commons.jpg': ('Portrait of August Spies', 'Haymarket defendant', 'SMALL'),
 'chicago_anarchists_eight_portraits_1894_commons.jpg': ('Eight portraits of the Chicago anarchists', 'The Haymarket eight', ''),
 'first_knights_of_labor_picnic_1882_loc.jpg': ('Puck (Keppler) 1882: "First annual picnic of the Knights of Labor"', 'How the comic papers saw the Knights', 'check for caricature in the crowd'),
 'haymarket_dynamite_bomb_exploding_among_police_harpers_1886_loc.jpg': ("Harper's: a bomb exploding among the police at Haymarket", 'The famous image of May 4, 1886', 'SENSITIVE (dead/injured)'),
 'leaders_of_the_knights_of_labor_powderly_1886_commons.jpg': ('Portraits of the Knights leaders around Powderly', 'Powderly and the leadership', ''),
 'martin_irons_knights_of_labor_1886_loc.jpg': ('Engraved portrait of Martin Irons, Southwest strike leader', 'The 1886 Gould strike', ''),
 'personnel_of_the_great_anarchist_trial_1886_loc.jpg': ('Print: "The first dynamite bomb thrown in America", the people of the trial', 'Trial overview', ''),
 'police_patrol_wagon_attacked_chicago_leslies_1886_loc.jpg': ("Leslie's: a police wagon attacked by a crowd in Chicago", 'Chicago May 1886 turmoil', 'SENSITIVE (violence)'),
 'street_railroad_strike_new_york_police_horsecar_1886_loc.jpg': ("Harper's (Thulstrup): police opening the way for a horsecar in the New York strike", '1886 strike wave', ''),
 'street_railway_strike_nyc_car_obstruction_1886_loc.jpg': ("Leslie's: car obstruction on Grand Street on the first day of the street railway strike", '1886 strike wave', ''),
 'strike_at_east_st_louis_firing_into_crowd_1886_loc.jpg': ("Harper's (Thulstrup): deputies firing into the crowd at East St. Louis", 'The Southwest strike turns deadly', 'SENSITIVE (firing on people)'),
 'the_strike_koehler_1886_loc.jpg': ("Koehler's painting The Strike (1886), engraved", 'Iconic image of a strike: workers confronting the owner', ''),
 'tournament_of_today_labor_vs_monopoly_puck_1883_loc.jpg': ('Puck (Graetz) 1883: labor and monopoly jousting', 'Labor vs capital framing', ''),
 'women_delegates_knights_of_labor_convention_1886_loc.jpg': ('Engraving: women delegates to the 1886 Knights convention', 'The Knights admitted women', ''),
 # d_afl_gompers
 'first_labor_day_parade_nyc_leslies_1882_commons.jpg': ("Leslie's, Sept 1882: the workingmen's procession passing the reviewing stand at Union Square", 'The first Labor Day parade, Sept 5, 1882', ''),
 'labor_day_parade_pennsylvania_avenue_c1894_loc.jpg': ('Photograph: a Labor Day parade on Pennsylvania Avenue, Washington', 'Labor Day becomes a national holiday (1894)', ''),
 'labor_day_parade_main_street_buffalo_c1895_loc.jpg': ('Photograph: Labor Day parade filling Main Street, Buffalo', 'Labor Day in the 1890s', 'date approximate'),
 'samuel_gompers_and_wife_LATE_1908_loc.jpg': ('Photograph: Samuel Gompers with his wife Sophia', 'Only usable Gompers photo found; older than in our story', 'LATE 1908'),
 # e_homestead
 'attack_on_surrendered_pinkertons_leslies_1892_loc.jpg': ("Leslie's: strikers and sympathizers attacking the surrendered Pinkertons", 'The gauntlet, July 6', 'SENSITIVE (violence)'),
 'camp_sam_black_pennsylvania_troops_homestead_1892_loc.jpg': ('Stereo photo: tents of Camp Sam Black, state troops at Homestead', 'The militia arrives', ''),
 'carnegie_mills_strikers_on_the_lookout_1892_loc.jpg': ('Stereo photo: strikers on the lookout at the Carnegie mills', 'Real strikers, July 1892', ''),
 'first_troops_in_homestead_eighteenth_regiment_1892_loc.jpg': ('Engraving: the 18th Regiment passing the Carnegie works office', 'Troops arrive', ''),
 'gen_snowdens_headquarters_homestead_stereo_1892_loc.jpg': ("Stereo photo: Gen. Snowden's headquarters", 'Occupation of the town', ''),
 'great_battle_of_homestead_pinkertons_lithograph_1892_loc.jpg': ('Kurz & Allison colour lithograph: the battle with the Pinkerton barges', 'Hero image, colour', 'SENSITIVE (gunfire)'),
 'guard_duty_around_fort_frick_carnegie_mills_1892_loc.jpg': ('Stereo photo: guard duty around "Fort Frick"', 'The fenced mill', ''),
 'homestead_riot_pinkertons_leaving_barges_harpers_1892_loc.jpg': ("Harper's: Pinkertons leaving the barges", 'Surrender', ''),
 'homestead_riot_snyder_after_dabbs_harpers_1892_loc.jpg': ("Harper's (Snyder after a photograph): the riot on the riverbank", 'The battle, full page', 'SENSITIVE'),
 'militia_inspected_by_gov_pattison_homestead_1892_loc.jpg': ('Stereo photo: militia under inspection by Gov. Pattison', 'State power', ''),
 'mob_assailing_pinkerton_men_two_scenes_1892_loc.jpg': ('Two engravings: the crowd assailing Pinkertons on the way to the rink', 'The gauntlet', 'SENSITIVE (violence)'),
 'old_homesteads_lesson_to_bread_winners_cartoon_1892_loc.jpg': ('Cartoon: "The old homestead\'s lesson to bread winners"', 'Commentary', 'SMALL-ish (1024 px)'),
 'scene_of_the_battle_with_pinkertons_stereo_1892_loc.jpg': ('Stereo photo: the riverbank where the battle was fought', 'Place of the battle', ''),
 'strikers_watching_for_scabs_station_homestead_1892_loc.jpg': ('Stereo photo: strikers watching the station for "scabs"', 'Strikers on guard', ''),
 'under_martial_law_militia_entering_homestead_1892_loc.jpg': ('Stereo photo: state militia entering Homestead under martial law', 'The end of the strike', ''),
 # f_pullman
 'american_railway_union_memento_c1895_loc.jpg': ('Memento print of the American Railway Union with Debs', 'The ARU', ''),
 'car_works_pullman_palace_car_co_1885_loc.jpg': ('Engraving: the Pullman Palace Car Co. car works and model town', 'The company town', ''),
 'eugene_debs_portrait_1897_loc.jpg': ('Photograph of Eugene V. Debs', 'Debs (label 1897)', 'LATE 1897'),
 'great_railroad_strike_1894_loc.jpg': ('Print: the great railroad strike, 1894', 'Pullman strike overview', ''),
 'great_railway_strikes_scenes_chicago_a_1894_loc.jpg': ("Harper's (Coffin): scenes in and about Chicago", 'Strike scenes', ''),
 'great_railway_strikes_scenes_chicago_b_1894_loc.jpg': ("Harper's: scenes in and about Chicago", 'Strike scenes', ''),
 'great_railway_strikes_scenes_chicago_c_1894_loc.jpg': ("Harper's (Coffin): scenes in and about Chicago", 'Strike scenes', ''),
 'great_railway_strikes_scenes_chicago_d_1894_loc.jpg': ("Harper's: scenes in and about Chicago", 'Strike scenes', ''),
 'great_railway_strikes_scenes_chicago_e_1894_loc.jpg': ("Harper's: scenes in and about Chicago", 'Strike scenes', ''),
 'king_debs_harpers_cartoon_1894_loc.jpg': ("Harper's (W. A. Rogers): \"King Debs\" blocking the railroads", 'How the press painted Debs', ''),
 'miles_of_burned_freight_cars_chicago_1894_loc.jpg': ("Harper's: miles of burned freight cars in the Chicago yards", 'Destruction', ''),
 'with_the_us_troops_in_chicago_remington_1894_loc.jpg': ("Harper's (Remington): with the U.S. troops in Chicago", 'Federal troops break the strike', ''),
 # g_farm_life
 'coburg_nebraska_and_vicinity_butcher_1884_loc.jpg': ('Butcher: a family posed in front of a long sod house with a windmill', 'Opening image for the Plains farm', ''),
 'coburgh_post_office_sod_butcher_c1889_loc.jpg': ('Butcher: the sod-built Coburgh post office, windmill, people seated in front', 'A sod settlement', ''),
 'couhig_dale_valley_butcher_1886_loc.jpg': ('Butcher: a couple, a sheep and horses before a sod house', 'Plains homestead', ''),
 'cram_sod_house_loup_county_butcher_1886_loc.jpg': ('Butcher: sod house behind a picket fence, family at the door', 'Homestead pride', ''),
 'hartley_ranch_middle_loup_butcher_1886_loc.jpg': ('Butcher: a dugout sod house built into a hillside, riders in front', 'The dugout: the harshest homes', ''),
 'haumont_two_story_sod_house_butcher_1886_loc.jpg': ('Butcher: the Haumont family before a rare two-storey sod house', 'Success on sod', ''),
 'rawding_family_sod_house_butcher_1886_loc.jpg': ('Butcher: the Rawding family, a cow on the sod roof, a mule and furniture in front', 'The classic sod-house image', ''),
 'rural_life_in_nebraska_butcher_1886_loc.jpg': ('Butcher: a woman and child at a sod house door, a bull beside', 'Home life', ''),
 'semler_near_woods_park_butcher_1886_loc.jpg': ('Butcher: a family and a mule beside a sod house', 'Plains homestead', ''),
 'william_moore_family_sargent_butcher_loc.jpg': ('Butcher: the Moore family with sheep and a windmill before a long sod house', 'Wide homestead view', ''),
 'across_the_continent_currier_ives_1868_commons.jpg': ('Currier and Ives colour: a train crossing the prairie past a new settlement', 'The railroad opens the Plains', 'pre-period (1868), iconic'),
 'iowa_and_nebraska_lands_burlington_railroad_poster_1872_commons.jpg': ('Burlington and Missouri River Railroad poster selling Iowa and Nebraska lands', 'Railroads selling the dream', ''),
 'kansas_wheat_field_harvester_combine_LATE_c1900_loc.jpg': ('Photograph: a horse-drawn combine in a flat Kansas wheat field', 'Machines and debt', 'LATE c1900'),
 'loading_whaleback_ship_at_grain_elevator_c1895_loc.jpg': ('Stereo half: grain elevators loading a whaleback ship, Chicago', 'Where the wheat went (elevators set the price)', ''),
 'group_on_a_cotton_plantation_jackson_c1880_loc.jpg': ('W. H. Jackson: Black workers with a horse beside cotton bales on a platform', 'Southern cotton farming, sharecropping era', ''),
 'scene_about_a_cotton_plantation_jackson_c1880_loc.jpg': ('W. H. Jackson: a woman and children by cotton bales, a wagon behind', 'Southern cotton farming', ''),
 # h_grange_alliance
 'gift_for_the_grangers_strobridge_1873_loc.jpg': ('Strobridge colour print "Gift for the Grangers": a farmer with scenes of farm life and Grange virtues', 'Hero image for the Grange', ''),
 'i_feed_you_all_grange_print_1875_loc.jpg': ('Colour print "I feed you all!": the farmer at the centre, lawyer, banker, merchant around him', 'The farmer\'s case in one picture', ''),
 'history_of_grange_movement_farmers_war_against_monopolies_title_1874_ia.jpg': ('Title page: History of the Grange Movement; or, The Farmer\'s War Against Monopolies (1874)', 'The fight with the railroads, in its own words', ''),
 'opening_a_farm_plowing_grange_history_1874_ia.jpg': ('Engraving from the 1874 Grange history: a farmer breaking the prairie with a plow', 'Breaking sod', 'book page; soft'),
 'new_uncle_sam_farmers_alliance_gillam_1891_loc.jpg': ('Judge (Gillam) 1891: "The new Uncle Sam": a hayseed Alliance farmer with Uncle Sam', 'How Eastern papers mocked the Alliance', ''),
 # i_populists
 'peoples_party_candidates_weaver_field_1892_loc.jpg': ('Campaign print: People\'s Party candidates Weaver and Field, 1892, "Equal rights to all"', 'Hero image for the 1892 ticket', ''),
 'peoples_party_convention_delegates_1892_loc.jpg': ("Leslie's cartoon: the People's Party convention, delegates who were not in it", 'Hostile press view', ''),
 'james_b_weaver_brady_handy_commons.jpg': ('Brady-Handy photograph of James B. Weaver, seated', 'Weaver portrait', ''),
 'mary_elizabeth_lease_portrait_c1896_commons.jpg': ('Engraved portrait of Mary Elizabeth Lease', '"Raise less corn and more hell"', ''),
 'ignatius_donnelly_portrait_c1880_commons.jpg': ('Photograph of Ignatius Donnelly', 'Author of the Omaha Platform preamble', ''),
 'thomas_e_watson_wife_and_home_1896_loc.jpg': ('New York Herald, Aug 10, 1896: Tom Watson, his wife and his home', 'Watson, 1896 Populist VP nominee', ''),
 'panic_at_the_stock_exchange_may_1893_SMALL_commons.jpg': ('Engraving: panic on the floor of the New York Stock Exchange, May 1893', 'The crash', 'SMALL'),
 'war_of_wealth_bank_run_poster_1895_commons.jpg': ('Colour theatre poster: "The run on the bank", a crowd at bank doors', 'Bank runs of 1893 (a play poster, 1895)', ''),
 'weve_all_got_to_retrench_opper_puck_1893_loc.jpg': ('Puck (Opper) 1893: "We\'ve all got to retrench!"', 'Hard times after the panic', ''),
 'coxeys_army_approaching_washington_1894_loc.jpg': ("Harper's page: Coxey's Army approaching Washington, the Capitol", 'The march arrives', ''),
 'coxeys_army_camp_goodwin_1894_commons.jpg': ("Photograph: tents of Coxey's Army at Camp Goodwin", 'The march camps', ''),
 'coxeys_army_school_children_watching_1894_loc.jpg': ('Ray Stannard Baker photo: school children watching the procession', 'Quiet human beat', ''),
 'coxeys_army_stereograph_a_jarvis_1894_commons.jpg': ("Stereograph: Coxey's Army with banners approaching Washington", 'The marchers (crop one half)', ''),
 'coxeys_army_stereograph_b_jarvis_1894_commons.jpg': ("Stereograph: Coxey's weary troops resting after a long march", 'Exhaustion; crop one half', ''),
 'coxeys_paternalism_taylor_puck_1894_loc.jpg': ('Puck (Taylor) 1894 cartoon on Coxey and "paternalism"', 'How the press laughed at the march', ''),
 # j_1896
 'william_jennings_bryan_cm_bell_1894_loc.jpg': ('C. M. Bell glass negative: young Bryan in profile', 'Bryan portrait two years before the speech', ''),
 'sixteen_to_one_speech_that_won_the_nomination_1896_loc.jpg': ('Colour broadside: Bryan, his family, and the text of the speech under a huge "16 to 1"', 'Cross of Gold speech; silver slogan', ''),
 'the_sacrilegious_candidate_hamilton_judge_1896_commons.jpg': ('Judge cover (Hamilton): Bryan carrying a cross and crown of thorns over a torn Bible', 'Reaction to "Cross of Gold"', ''),
 'bryans_gas_pughe_puck_1896_loc.jpg': ('Puck cover (Pughe): a farmer at the soda counter served "Bryan\'s free silver soda"', 'Silver as hot air (Eastern view)', ''),
 'bryan_ablest_worker_for_sound_money_opper_1896_loc.jpg': ('Puck cover (Opper): Bryan and McKinley on scales', 'Gold vs silver', ''),
 'political_pirates_taylor_puck_1896_loc.jpg': ('Puck (Taylor): "Popocracy" ship of pirates: Bryan fiddling, Altgeld, Tillman, Lease, Coxey', 'Fusion of Democrats and Populists as piracy', ''),
 'our_home_defenders_mckinley_poster_1896_loc.jpg': ('Colour campaign poster: McKinley and Hobart, "Our home defenders", protection and prosperity', 'McKinley\'s message', ''),
 'mckinley_front_porch_campaign_canton_dillon_1896_commons.jpg': ('Photograph: a delegation of men on McKinley\'s porch in Canton', 'The front porch campaign', ''),
 'mckinley_front_porch_flower_delegation_1896_commons.jpg': ('Photograph: a large delegation of women with flowers at McKinley\'s porch', 'Front porch crowds', ''),
 'dollar_mark_hanna_davenport_LATE_1900_loc.jpg': ('Homer Davenport sketch: Mark Hanna in a suit covered with dollar signs', 'The "Dollar Mark" image (Davenport drew it from 1896; this sketch dated 1900)', 'LATE 1900'),
 'j_pierpont_morgan_portrait_holl_1888_commons.jpg': ('Frank Holl oil portrait of J. Pierpont Morgan, 1888', 'Morgan, the gold rescue of 1895', ''),
 'electoral_map_1896_modern_SMALL_commons.jpg': ('Modern electoral map of 1896 (Wikimedia SVG render)', 'Reference for a drawn map: West and South for Bryan, North-East for McKinley', 'SMALL; MODERN'),
 # k_later_reforms
 'massachusetts_australian_secret_ballot_1889_commons.jpg': ('Massachusetts state ballot of Nov 1889: the first statewide Australian (secret) ballot', 'The secret ballot', 'licence CC BY 4.0 (scan): credit the uploader'),
 'seventeenth_amendment_joint_resolution_LATE_1911_commons.jpg': ('Senate joint resolution for the 17th Amendment, 1911', 'Direct election of senators', 'LATE 1911'),
 'sixteenth_amendment_ratification_cartoon_LATE_1913_commons.jpg': ('Cartoon "Who threw that!": the income tax tree, 1913', 'The 16th Amendment', 'LATE 1913'),
 # l_garfield_civil_service
 'president_garfield_half_length_loc.jpg': ('Photograph: Garfield in hat and coat, in profile', 'Garfield portrait', ''),
 'chester_a_arthur_president_buek_loc.jpg': ('Lithograph: Chester A. Arthur, President of the United States', 'Arthur signs the Pendleton Act', ''),
 'charles_j_guiteau_loc.jpg': ('Photograph of Charles Guiteau standing', 'The assassin', ''),
 'guiteau_cartoon_wales_puck_1881_commons.jpg': ('Puck (Wales), July 1881: Guiteau with a pistol and a paper "An office or your life!"', 'The office seeker as killer', ''),
 'scene_of_assassination_baltimore_potomac_station_sensitive_loc.jpg': ('Lithograph: Guiteau firing at Garfield in the Baltimore and Potomac station waiting room, seen from a distance', 'The shooting, July 2, 1881 (distant view)', 'SENSITIVE'),
 'assassination_of_garfield_historical_photo_1881_loc.jpg': ('C. M. Bell composite: the depot, the revolver, portraits of Garfield, Guiteau and doctors', 'Explains the event without gore', ''),
 'attempted_assassination_morning_greeting_1881_loc.jpg': ("Leslie's cover: Garfield in his sickbed greeting his wife and daughter", 'The long dying summer', 'SENSITIVE (mild)'),
 'events_related_to_assassination_1881_loc.jpg': ("Leslie's double page: the sickroom, the Elberon cottage", 'Garfield dying', 'SENSITIVE (mild)'),
 'civil_service_reform_nast_1877_loc.jpg': ("Harper's (Nast): office seekers bowing to a Jackson statue \"To the victor belong the spoils\"", 'The spoils system explained', ''),
 'civil_service_cerberus_hercules_of_spoils_1880_loc.jpg': ('Drawing: Hercules of spoils facing the three-headed civil service commission dog', 'Spoils vs reform', ''),
 'seven_stages_of_the_office_seeker_c1852_loc.jpg': ('Lithograph: "The seven stages of the office seeker", from hope to the grave', 'Spoils system satire (earlier, c1852)', 'pre-period'),
 'civil_service_reform_old_fable_gillam_loc.jpg': ('Puck cover (Gillam) 1885: a wolf in sheep\'s clothing', 'Reform after Pendleton', ''),
 'consistent_civil_service_reform_opper_1885_loc.jpg': ('Puck cover (Opper) 1885: Cleveland and office seekers', 'Reform after Pendleton', ''),
 'pendleton_act_page1_1883_commons.jpg': ('Page 1 of the Pendleton Act, "An Act to regulate and improve the civil service"', 'The law itself (Jan 16, 1883)', ''),
 # m_henry_george_1886
 'henry_george_1839_1897_loc.jpg': ('Photograph: Henry George seated in a carved chair', 'Henry George portrait (1890s)', ''),
 'progress_and_poverty_title_page_appleton_c1881_ia.jpg': ('Title page of Progress and Poverty (Appleton, 1881 printing)', 'The book', ''),
 'henry_george_honest_labors_temptation_keppler_1886_commons.jpg': ('Puck (Keppler), Oct 1886: George as Mephistopheles tempting a blacksmith', 'How Puck attacked George\'s campaign', ''),
 'henry_george_taking_a_tumble_keppler_1886_commons.jpg': ('Puck (Keppler), Nov 1886: George falling off a ladder at City Hall', 'George loses the election', ''),
 'dr_edward_mcglynn_campaign_poster_loc.jpg': ('Campaign poster with a portrait of Father Edward McGlynn, "Free soil"', 'The priest who backed George and was excommunicated', ''),
 'between_two_popes_mcglynn_taylor_puck_1887_commons.jpg': ('Puck (Taylor) 1887: McGlynn between Henry George as "pope" and Pope Leo XIII', 'McGlynn\'s excommunication', ''),
 'abram_hewitt_harpers_1888_commons.jpg': ("Harper's engraved portrait of Abram Hewitt", 'The winner, 1886', 'SMALL-ish (1185 px)'),
 'theodore_roosevelt_1885_bain_commons.jpg': ('Photograph: young Theodore Roosevelt in buckskins with a rifle, 1885', 'The third candidate, age 28', ''),
}
KEY = [
 'Work: "Making Bessemer steel at Pittsburgh" (Harper\'s, converters blasting) and Riis\'s Ludlow Street sweatshop.',
 'Labor: Leslie\'s first Labor Day parade (Union Square, 1882); Koehler\'s The Strike; Haymarket bomb (Harper\'s, sensitive).',
 'Strikes: the 1877 Pittsburgh photos of burned roundhouses and cars; the Homestead colour lithograph and stereo photos; "King Debs" and Remington\'s troops in Chicago.',
 'Farm: Butcher\'s Rawding family (cow on the roof), Haumont two-storey sod house, Coburg with windmill; Currier and Ives "Across the Continent"; the Burlington land poster.',
 'Grange: "Gift for the Grangers" (1873) and "I feed you all!" (1875), both large colour prints.',
 'Populists: Weaver and Field 1892 campaign print; Lease portrait; Coxey stereographs and Harper\'s page at the Capitol; "The War of Wealth" bank-run poster.',
 '1896: the "16 to 1" broadside with the speech; Judge\'s "Sacrilegious Candidate"; McKinley\'s front porch delegations; "Our Home Defenders"; Davenport\'s dollar-suit Hanna (1900).',
 'Garfield: the station lithograph (distant), the Puck "An office or your life!" Guiteau, Nast\'s "To the victor belong the spoils", the Pendleton Act page.',
 'Henry George: his portrait, the Progress and Poverty title page, Keppler\'s "Taking a Tumble", young TR in buckskins.',
]
WATCH = [
 '**Sensitive** (keep brief or distant): Haymarket bomb, East St. Louis and Baltimore firing into crowds, the Chicago 1877 cavalry charge, Homestead battle and gauntlet images, the Garfield shooting lithograph and sickbed pages.',
 '**Caricature:** none kept flagged CARICATURE. Skipped outright: a pro-Coxey 1894 cartoon built on "Rothschild\'s bonds" (antisemitic trope), Dalrymple\'s "Last ghost-dance of the free silver tribe" (Native caricature, not downloaded). Check the Puck 1882 Knights picnic crowd before a close-up. "Political Pirates" (1896) was checked: political figures only.',
 '**LATE** (label the date on screen): Hine child labor (1908, 1911), Gompers with his wife (1908), the Kansas combine (c1900), Davenport\'s Hanna sketch (1900), the 16th and 17th Amendment items (1911, 1913), Debs (1897). Pre-period: "Across the Continent" (1868), "Seven stages of the office seeker" (c1852).',
 '**SMALL:** Parsons and Spies portraits, the 1893 Stock Exchange panic, the modern 1896 electoral map (redraw it), the Lease portrait (960 px).',
 '**Licence:** everything is public domain or CC0 except the Massachusetts 1889 ballot scan (CC BY 4.0: the 1889 document is public domain, but credit the scan if used).',
 '**Gompers:** no public-domain photo of Gompers before 1900 found; the only one kept is 1908. Draw him or use a later photo with a date label.',
]
GAPS = [
 'Young Gompers (1880s) and the 1886 AFL founding: nothing public domain at usable size.',
 'Havemeyer / Brooklyn sugar refinery workers in the 1880s: only modern HABS photos of the building.',
 'Office seekers mobbing the White House (Leslie\'s, LoC 2021651183): LoC returns 404, no Commons copy.',
 'Grange meeting (Leslie\'s 1873 "Farmers\' movement in the West", LoC 2021651955): 404; no railroad-squeezing-farmer cartoon of the 1870s found.',
 'Coxey\'s arrest at the Capitol (May 1, 1894), Carl Browne on horseback, Coxey portrait 1894: LoC items have no image ("not evaluated"); Carl Browne and Coxey photos exist only from 1913/1914.',
 'Soup lines and bread lines of 1893 to 1894: none found; the 1893 Stock Exchange panic and the 1895 bank-run poster stand in.',
 'Threshing on the Plains in the 1880s: LoC threshing photos are 1900s; the Kansas combine (c1900) stands in.',
 'Henry George 1886 campaign posters, ballots, torchlight parades: none found; Keppler cartoons and the McGlynn poster stand in.',
 'Secret ballot in use (voting booth scene 1888 to 1892): only the Massachusetts ballot itself.',
 'Refused (LoC rights blank or "not evaluated"): Bryan and Sewall 1896 prints, "Destruction of the old Democratic temple" (free silver), Richmond cigarette factory, Hewitt seated portrait, Lease LoC portrait, Run on a bank c1890, Baltimore and Potomac depot photo c1897.',
]
total = sum(len(glob.glob(f'public/img/{t}/*.jpg')) for t, _ in TOPICS)
out = ['# Episode 5 archival images', '',
       f'{total} public-domain images for the edit, in `public/img/a_work_conditions` to `m_henry_george_1886`, with credits in `public/img/credits.json` '
       '(title, artist, date, licence, source page, source id). Contact sheets: `research/sheets/<topic>.jpg`. '
       'Sources: Library of Congress ("no known restrictions on publication"), Wikimedia Commons (public domain), the Internet Archive '
       '(pre-1930 books: *Annals of the Great Strikes* 1877, Martin\'s *History of the Grange Movement* 1874, *Progress and Poverty* 1881), the Met (CC0). '
       'Every file is a JPEG of at most 4000 px on the long side. Tools: `tools/find_images.py` (search, get), `tools/batch_get.py` (lists), '
       '`tools/sheet.py` (contact sheets), `tools/rename.py` and `tools/add_credit.py` (hand-made crops and stitches).', '',
       '## Key images for the script', ''] + [f'- {w}' for w in KEY] + ['', '## Watch for', ''] + [f'- {w}' for w in WATCH] + ['']
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
