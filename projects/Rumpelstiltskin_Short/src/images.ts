// Every picture the Short uses, in one place (credits in public/img/credits.json, list in public/img/IMAGES.md).
export type Pic = {src: string; size: [number, number]; tag?: string};

export const IMG = {
  poster: {src: 'img/rumpelstiltskin_1987_poster.jpg', size: [1920, 2560]} as Pic,
  grimm1812: {src: 'img/grimm_1812_rumpelstilzchen.jpg', size: [900, 1400]} as Pic,
  spinning: {src: 'img/anderson_millers_daughter_spinning.jpg', size: [600, 827]} as Pic,
  name: {src: 'img/cruikshank_name_guessing.jpg', size: [1618, 1883]} as Pic,
  dance: {src: 'img/anderson_rumpelstiltskin_fire_dance.jpg', size: [600, 713]} as Pic,
  ending: {src: 'img/rumpelstiltskin_ending.jpg', size: [900, 1200]} as Pic,
};
