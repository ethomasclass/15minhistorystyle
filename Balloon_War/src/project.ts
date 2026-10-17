// Everything that changes from one video to the next, in one place.

/** File-name stem for renders. */
export const SLUG = 'The_Balloon_War';

/** Title card after the channel intro. */
export const TITLE = 'THE BALLOON WAR';
export const SUBTITLE = 'Fake Tanks, Paper Bombs, and D-Day';
export const DATES = '1944 – 1945';

/** Archival pictures that flip past at the start of the channel intro (they show in black and white). */
export const INTRO_CARDS = [
  'img/ch02_protector/320th_walk_balloon_to_winch_1944.jpg',
  'img/ch03_fake/rubber_tank_beside_real_tank_anzio_1944.jpg',
  'img/ch04_paper_balloon/moffett_balloon_inflated_hangar_1945.jpg',
  'img/ch02_protector/lst388_beached_under_balloon_80g252794.jpg',
  'img/ch04_paper_balloon/balloon_above_clouds_342fh3b23432.jpg',
];

/** Thumbnail portrait (template default, unused here). */
export const THUMB_PORTRAIT = {src: 'img/ch04_paper_balloon/moffett_balloon_inflated_hangar_1945.jpg', size: [3234, 4000] as [number, number],
  faceX: 1600, hairTop: 300, mouthY: 1400, crownLeft: 1200, crownRight: 2000, crownY: 400, scale: 0.4, top: 80};
export const THUMB_WORDS = {left: 'FAKE', right: 'OR DEADLY?'};
