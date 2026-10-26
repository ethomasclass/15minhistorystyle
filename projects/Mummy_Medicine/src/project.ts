// Everything that changes from one video to the next, in one place.

/** File-name stem for renders: out/<SLUG>_1080p.mp4, renders/<SLUG>_720p.mp4, renders/thumbnails/<SLUG>_A.png. */
export const SLUG = 'When_Europe_Ate_Mummies';

/** Title card after the channel intro: a highlighter title, a teal subtitle and a handwritten date range. */
export const TITLE = 'WHEN EUROPE ATE MUMMIES';
export const SUBTITLE = 'How the Dead Became Medicine';
export const DATES = '1100 – 1924';

/**
 * Archival pictures that flip past at the start of the channel intro (five reads best). Paths in public/.
 * Use strong, recognisable images from this video; they show in black and white.
 */
export const INTRO_CARDS = ['img/ch05_fakes/pomet_1712_mummies_plate.jpg', 'img/ai/ch03_tomb_night.jpg', 'img/ch08_america/gliddon_1850_unwrapping_broadsheet_yale.jpg', 'img/ch01_1924/deutsches_apothekenmuseum_mumia_jar.jpg', 'img/ai/ch07_unwrapping_party.jpg'];

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
