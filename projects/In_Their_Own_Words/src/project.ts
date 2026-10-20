// Everything that changes from one video to the next, in one place.

/** File-name stem for renders: out/<SLUG>_1080p.mp4, renders/<SLUG>_720p.mp4, renders/thumbnails/<SLUG>_A.png. */
export const SLUG = 'In_Their_Own_Words';

/** Title card after the channel intro: a highlighter title, a teal subtitle and a handwritten date range. */
export const TITLE = 'IN THEIR OWN WORDS';
export const SUBTITLE = 'Secession, Fort Sumter, and the Picnic at Bull Run';
export const DATES = '1860 to 1861';

/**
 * Archival pictures that flip past at the start of the channel intro (five reads best). Paths in public/.
 * Use strong, recognisable images from this video; they show in black and white.
 */
export const INTRO_CARDS = ['img/ch01/stephens_portrait_vannerson_1859.jpg', 'img/ch05/bombardment_fort_sumter_engraving_apr1861.jpg', 'img/ch06/scotts_great_snake_elliott_1861.jpg', 'img/ch07/first_bull_run_sunday_afternoon.jpg', 'img/ch08/andersonville_southeast_view_riddle_aug1864.jpg'];

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
