// Every picture the Short uses (credits in public/img/credits.json, list in public/img/IMAGES.md).
export type Pic = {src: string; size: [number, number]; tag?: string; pos?: string};

export const IMG = {
  photo1942: {src: 'img/southington_1942_salute_user.jpg', size: [478, 641], tag: 'Southington, Conn., 1942 · Fenno Jacobs, Office of War Information · Library of Congress', pos: '45% 45%'} as Pic,
  magazine: {src: 'img/youths_companion_1892_09_08_official_programme_page.jpg', size: [3892, 5860], tag: "The Youth's Companion, Sept. 8, 1892"} as Pic,
  bellamy: {src: 'img/francis_bellamy_portrait.jpg', size: [552, 654], tag: 'Francis Bellamy'} as Pic,
  schoolroom: {src: 'img/schoolroom_1890s.jpg', size: [3000, 2200], tag: 'Schoolchildren, 1890s · Library of Congress', pos: '50% 50%'} as Pic,
  flagcode: {src: 'img/flag_code_1942.jpg', size: [1200, 1600], tag: 'Flag Code amendment, Dec. 22, 1942'} as Pic,
};
