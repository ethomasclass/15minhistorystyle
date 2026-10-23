// Every picture the Short uses, in one place (credits in public/img/credits.json, list in public/img/IMAGES.md).
export type Pic = {src: string; size: [number, number]; tag?: string};

export const IMG = {
  poster: {src: 'img/rumpelstiltskin_1987_poster.jpg', size: [1920, 2560]} as Pic,
  grimm1812: {src: 'img/khm_1812_rumpelstilzchen_p253.jpg', size: [1168, 1752]} as Pic,
  spinning: {src: 'img/anderson_millers_daughter_spinning.jpg', size: [600, 827]} as Pic,
  name: {src: 'img/cruikshank_name_guessing.jpg', size: [1618, 1883]} as Pic,
  /** p. 255 of the Grimms' own 1812 copy: the printed ending crossed out, the 1857 one in the margin (crop) */
  page255: {src: 'img/khm_1812_p255_both_endings_crop.jpg', size: [714, 494]} as Pic,
  nielsen: {src: 'img/nielsen_1925_rumpelstiltskin_stamps_in_rage.jpg', size: [1280, 1735]} as Pic,
};
