// Every picture the Short uses: path in public/, pixel size, and the on-screen source tag (from credits.json).
export type Pic = {src: string; size: [number, number]; tag?: string};

export const IMG = {
  dad: {src: 'img/fairuse/FAIRUSE_houstonchronicle_1975-06-03_obryan_leaving_court.jpg', size: [1488, 1448], tag: 'Houston Chronicle, June 3, 1975 · Othell O. Owensby Jr.'},
  pail: {src: 'img/candy/pumpkin_pail_full.jpg', size: [1600, 1200], tag: 'Photo: Petey21 · CC0'},
  kid79: {src: 'img/halloween/skeleton_kid_porch_1979.jpg', size: [981, 974], tag: 'Halloween 1979 · Don Scarborough · CC BY-SA 2.5'},
  fda: {src: 'img/gov/fr_1982-11-05_p50442_tamper_resistant_rule.jpg', size: [2430, 3271], tag: 'Federal Register, Nov. 5, 1982 · FDA'},
  ap: {src: 'img/fairuse/FAIRUSE_thehour_1982-10-28_p2_halloween_kooks_article.png', size: [1044, 826], tag: 'AP, in The Hour (Norwalk, Conn.), Oct. 28, 1982'},
  dea: {src: 'img/gov/dea_2022-08-30_press_release_lede_card.png', size: [1881, 743], tag: 'DEA press release, Aug. 30, 2022'},
  pills: {src: 'img/gov/dea_2022_rainbow_fentanyl_m30_pills.jpg', size: [3768, 3024], tag: 'DEA photo, 2022'},
} satisfies Record<string, Pic>;
