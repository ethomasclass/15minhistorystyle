// Every picture the Short uses, in one place (credits in public/img/credits.json, list in public/img/IMAGES.md).
// `size` is the source's pixel size; `crop` (x0, y0, x1, y1, source px) keeps the Parallax camera inside the picture.
export type Pic = {src: string; size: [number, number]; tag: string; crop?: [number, number, number, number]; fx?: number; fy?: number; pos?: string};

export const IMG = {
  crowd: {src: 'img/crowd_owensboro_1936_left_vertical_ivp.jpg', size: [900, 1723], tag: 'Owensboro, Ky., Aug. 14, 1936 · NEA · Imperial Valley Press · LOC'} as Pic,
  town: {src: 'img/owensboro_courthouse_post_office_1901.jpg', size: [1280, 1755], tag: 'Owensboro courthouse and post office, 1901 · Wikimedia Commons'} as Pic,
  prison: {src: 'img/kentucky_state_penitentiary_eddyville_1939.jpg', size: [1920, 1146], tag: 'Kentucky State Penitentiary, Eddyville, 1939 · TVA · National Archives'} as Pic,
  thompson: {src: 'img/florence_thompson_1936_woman_sheriff_headline_portrait.jpg', size: [810, 1930], tag: 'Sheriff Florence Thompson, 1936 · NEA · Hendersonville Times-News · LOC'} as Pic,
  scaffold: {src: 'img/scaffold_lower_crop_adw_1936.jpg', size: [1239, 863], tag: 'Owensboro, Aug. 14, 1936 · INS · Atlanta Daily World · LOC'} as Pic,
  holiday: {src: 'img/imperial_valley_press_1936-08-20_death_makes_a_holiday_headline.jpg', size: [2770, 250], tag: 'Imperial Valley Press, Aug. 20, 1936 · LOC'} as Pic,
  affair: {src: 'img/laredo_times_1936-08-17_holiday_affair_headline.jpg', size: [1770, 125], tag: 'Laredo Times, Aug. 17, 1936 · LOC'} as Pic,
  watch15: {src: 'img/washington_daily_news_1936-08-14_15000_watch_headline.jpg', size: [3659, 1930], tag: 'Washington Daily News, Aug. 14, 1936 · LOC'} as Pic,
  anderson: {src: 'img/charles_w_anderson_jr_1938_adw.jpg', size: [660, 1180], tag: 'Rep. Charles W. Anderson Jr., 1938 · Atlanta Daily World · LOC'} as Pic,
  faces: {src: 'img/sunday_star_1936_watching_faces_no_caption.jpg', size: [1945, 1496], tag: 'Owensboro, Aug. 14, 1936 · AP · Sunday Star · LOC'} as Pic,
};
