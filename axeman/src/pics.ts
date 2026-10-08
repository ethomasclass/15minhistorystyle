// Every archival picture the chapters use, by role: the file in public/ and its on-screen source tag.
// Swap a file here and every scene that uses it follows. Sizes come from src/imgs.ts (tools/img_sizes.py).
export type Pic = {src: string; tag: string};

export const P = {
  // ch01 · the sheet music and the party
  sheet: {src: 'img/ch01/mysterious_axmans_jazz_1919.jpg', tag: "The Mysterious Axman's Jazz, sheet music, 1919 · The Historic New Orleans Collection"},
  band: {src: 'img/ch01/odjb_1918.jpg', tag: 'Original Dixieland Jass Band, publicity photograph, 1918 · public domain'},
  band2: {src: 'img/ch07/jazz_band_1919.jpg', tag: 'A New Orleans jazz band, c. 1919 · public domain'},
  // ch02 · the Maggios
  panelMap: {src: 'img/ch06/axeman_attack_map_march1919.jpg', tag: 'The "Panel Burglar" theory of the ax murders, Times-Picayune, March 1919 · public domain'},
  maggios: {src: 'img/ch02/maggios_1918.jpg', tag: 'Joseph and Catherine Maggio, Times-Picayune, May 1918 · public domain'},
  grocery: {src: 'img/ch02/corner_grocery.jpg', tag: 'A New Orleans corner grocery · Library of Congress'},
  davi: {src: 'img/ch02/davi_1911.jpg', tag: 'Times-Picayune, June 1911 · public domain'},
  rissetto: {src: 'img/ch02/rissettos_1910.jpg', tag: 'Times-Picayune, September 1910 · public domain'},
  // ch03 · Besumer
  besumer: {src: 'img/ch03/besumer_1918.jpg', tag: 'Louis Besumer, Times-Picayune, 1918 · public domain'},
  spyPoster: {src: 'img/ch03/spies_poster_1917.jpg', tag: 'Committee on Public Information advertisement, 1917 · Library of Congress'},
  // ch04 · the panic and the quiet
  axMap1918: {src: 'img/ch04/map_of_axeman_1918.jpg', tag: 'Map of the ax attacks, Times-Picayune, September 3, 1918 · public domain'},
  flu: {src: 'img/ch04/influenza_1918.jpg', tag: 'Influenza epidemic, 1918 · National Archives'},
  armistice: {src: 'img/ch04/armistice_1918.jpg', tag: 'Armistice Day, November 11, 1918 · National Archives'},
  // ch05 · Italian New Orleans
  market: {src: 'img/ch05/french_market.jpg', tag: 'French Market, New Orleans, c. 1910 · Library of Congress (Detroit Publishing Co.)'},
  blackHand: {src: 'img/ch05/black_hand_letter.jpg', tag: 'A Black Hand extortion letter, newspaper reproduction · public domain'},
  lynching1891: {src: 'img/ch05/lynching_1891.jpg', tag: 'Parish Prison, New Orleans, March 14, 1891, engraving · public domain'},
  // ch06 · Gretna
  gretna: {src: 'img/ch06/gretna_ferry.jpg', tag: 'Ferry to Gretna across the Mississippi · public domain'},
  courthouse: {src: 'img/ch06/courthouse.jpg', tag: 'Courthouse, c. 1910s · public domain'},
  cortimiglia: {src: 'img/ch06/cortimiglia_1919.jpg', tag: 'Times-Picayune, March 1919 · public domain'},
  // ch07 · the letter
  letter: {src: 'img/ch07/axeman_letter_1919.jpg', tag: 'The Axeman letter as printed, March 1919 · public domain'},
  cartoon: {src: 'img/ch07/cartoon_axeman_1919.jpg', tag: 'Cartoon, Times-Picayune, March 1919 · public domain'},
  nationalPage: {src: 'img/ch07/newspaper_march1919.jpg', tag: 'Newspaper page, March 1919 · Library of Congress, Chronicling America'},
  // ch08 · the last attacks
  pepitone: {src: 'img/ch08/pepitone_1919.jpg', tag: 'Times-Picayune, October 1919 · public domain'},
  street: {src: 'img/ch08/street_night.jpg', tag: 'New Orleans street, c. 1910s · Library of Congress'},
  // ch09 · who
  la: {src: 'img/ch09/los_angeles_1921.jpg', tag: 'Los Angeles, c. 1920 · public domain'},
  canal: {src: 'img/ch09/canal_street.jpg', tag: 'Canal Street, New Orleans, c. 1910s · Library of Congress (Detroit Publishing Co.)'},
} satisfies Record<string, Pic>;
