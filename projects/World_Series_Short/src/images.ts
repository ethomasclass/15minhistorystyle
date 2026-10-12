// Every picture the Short uses, in one place. User-supplied (copyrighted, commentary use): public/img/USER_SUPPLIED.md.
// Archival (public domain): public/img/credits.json and IMAGES.md.
export type Pic = {src: string; size: [number, number]; tag?: string};

export const IMG = {
  jays: {src: 'img/blue_jays_1992_celebration.jpg', size: [1440, 810], tag: 'Toronto Blue Jays, 1992'} as Pic,
  si: {src: 'img/si_cover_1992_canadas_team.jpg', size: [544, 701]} as Pic,
  logo: {src: 'img/ws_logo_1997_globe.png', size: [500, 281]} as Pic,
  venezuela: {src: 'img/venezuela_wbc_2026_celebration.jpg', size: [480, 639], tag: 'Venezuela, World Baseball Classic, 2026'} as Pic,
  // archival, filled in when the image search lands
  world: {src: 'img/new_york_sunday_world_poster_1896.jpg', size: [1994, 3000], tag: 'The New York World, 1896 · Library of Congress'} as Pic,
  grays: {src: 'img/providence_grays_1884_alt.jpg', size: [980, 641], tag: 'Providence Grays, 1884'} as Pic,
  headline1884: {src: 'img/worlds_championship_records_heading_spalding_1906.jpg', size: [2248, 790]} as Pic,
  brush: {src: 'img/john_t_brush_crop.jpg', size: [1498, 2161], tag: 'John T. Brush · Bain News Service · Library of Congress'} as Pic,
  noSeries: {src: 'img/no_series_1904_reach_1905_crop.jpg', size: [2275, 772]} as Pic,
};
