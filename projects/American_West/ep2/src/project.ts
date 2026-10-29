// Everything that changes from one video to the next, in one place.

/** File-name stem for renders: out/<SLUG>_1080p.mp4, renders/<SLUG>_720p.mp4, renders/thumbnails/<SLUG>_A.png. */
export const SLUG = 'Cheap_As_Dirt';

/** Title card after the channel intro: a highlighter title, a teal subtitle and a handwritten date range. */
export const TITLE = 'CHEAP AS DIRT';
export const SUBTITLE = 'Cattle, Gold, and the End of the Open Range';
export const DATES = '1866 – 1887';

/**
 * (Only the old 15 Minute History intro, src/kit/Intro.tsx, reads these; the Chunk History intro doesn't.)
 * Archival pictures that flip past at the start of the channel intro (five reads best). Paths in public/.
 * Use strong, recognisable images from this video; they show in black and white.
 */
export const INTRO_CARDS = ['img/ch02/mccoy_abilene_first_cattle_train_1867_plate.jpg', 'img/ch02/texas_longhorns_herd_kansas_1878.jpg', 'img/ch03/huffman_trail_herd_breaking_camp_powder_river_1887.jpg', 'img/ch06/illingworth_custer_column_wagon_train_1874.jpg', 'img/ch06/deadwood_1876.jpg'];

/** Thumbnail portrait (split concept): source file, its pixel size, and where the head sits in source pixels. */
export const THUMB_PORTRAIT = {
  src: 'img/demo/sully_jackson_1845.jpg',
  size: [1920, 2288] as [number, number],
  /** horizontal centre of the face, the top of the hair, and the mouth (source pixels) */
  faceX: 972,
  hairTop: 206,
  mouthY: 1250,
  /** crown base, left and right edge, in source pixels: the width of the head just below the hair top */
  crownLeft: 660,
  crownRight: 1200,
  crownY: 275,
  /** how big the portrait sits: the whole head plus room above for the crown, the chin above y 840 */
  scale: 0.55,
  top: 80,
};
export const THUMB_WORDS = {left: 'HERO', right: 'OR KING?'};
