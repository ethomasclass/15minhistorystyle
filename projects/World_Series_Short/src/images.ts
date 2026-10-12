// Every picture the Short uses, in one place. User-supplied (copyrighted, commentary use): public/img/USER_SUPPLIED.md.
// Archival (public domain): public/img/credits.json and IMAGES.md.
export type Pic = {src: string; size: [number, number]; tag?: string};

export const IMG = {
  jays: {src: 'img/blue_jays_1992_celebration.jpg', size: [1440, 810], tag: 'Toronto Blue Jays, 1992'} as Pic,
  si: {src: 'img/si_cover_1992_canadas_team.jpg', size: [544, 701]} as Pic,
  logo: {src: 'img/ws_logo_1997_globe.png', size: [500, 281]} as Pic,
  venezuela: {src: 'img/venezuela_wbc_2026_celebration.jpg', size: [480, 639], tag: 'Venezuela, World Baseball Classic, 2026'} as Pic,
  // archival, filled in when the image search lands
  world: {src: 'img/new_york_world_masthead.jpg', size: [1600, 400]} as Pic,
  grays: {src: 'img/providence_grays_1884.jpg', size: [1200, 900]} as Pic,
  headline1884: {src: 'img/worlds_championship_headline_1884.jpg', size: [1600, 300]} as Pic,
  brush: {src: 'img/john_t_brush.jpg', size: [800, 1100]} as Pic,
};
