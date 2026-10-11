// Every picture the Short uses, in one place (credits in public/img/credits.json, list in public/img/IMAGES.md).
// `size` is the source's pixel size; `crop` (x0, y0, x1, y1, source px) keeps the Parallax camera inside the picture.
export type Pic = {src: string; size: [number, number]; tag: string; crop?: [number, number, number, number]; fx?: number; fy?: number; pos?: string};

export const IMG = {
  crowd: {src: 'img/crowd.jpg', size: [1600, 1200], tag: 'Owensboro, Ky., August 14, 1936'} as Pic,
  /** the scaffold in the crowd photo, in frame pixels at the "She didn't" crop */
  scaffold: {x: 540, y: 700, rx: 200, ry: 160},
  town: {src: 'img/town.jpg', size: [1287, 1765], tag: ''} as Pic,
  prison: {src: 'img/prison.jpg', size: [3000, 1791], tag: ''} as Pic,
  thompson: {src: 'img/florence_thompson_portrait.jpg', size: [748, 1122], tag: 'Sheriff Florence Thompson · Daviess County Sheriff\'s Office · CC BY-SA 3.0', pos: '50% 25%'} as Pic,
  paper: {src: 'img/paper.jpg', size: [1000, 1300], tag: ''} as Pic,
  statute: {src: 'img/statute.jpg', size: [1000, 1400], tag: ''} as Pic,
};
