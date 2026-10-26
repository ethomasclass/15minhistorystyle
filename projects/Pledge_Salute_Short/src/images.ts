// Every picture the Short uses (credits in public/img/credits.json, list in public/img/IMAGES.md).
export type Pic = {src: string; size: [number, number]; tag?: string; pos?: string};

export const IMG = {
  photo1942: {src: 'img/southington_1942_arms_crop.jpg', size: [3120, 2890], tag: 'Southington, Conn., May 1942 · Fenno Jacobs, OWI · Library of Congress', pos: '50% 40%'} as Pic,
  classroom: {src: 'img/southington_1942_salute_user.jpg', size: [478, 641], tag: 'American classroom, c. 1941', pos: '45% 45%'} as Pic,
  magazine: {src: 'img/youths_companion_1892_09_08_official_programme_page.jpg', size: [3892, 5860], tag: "The Youth's Companion, Sept. 8, 1892"} as Pic,
  bellamy: {src: 'img/francis_bellamy_portrait.jpg', size: [552, 654], tag: 'Francis Bellamy'} as Pic,
  schoolroom: {src: 'img/whittier_primary_school_1899_saluting_the_flag.jpg', size: [1536, 1204], tag: 'Saluting the flag, Hampton, Va., 1899 · Frances Benjamin Johnston · Library of Congress', pos: '50% 60%'} as Pic,
  flagcode: {src: 'img/flag_code_1942.jpg', size: [1200, 1600], tag: 'Flag Code amendment, Dec. 22, 1942'} as Pic,
};
