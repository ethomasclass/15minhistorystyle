// Chapter 5's subject masks (tools/mask.py hale_1880). The lead can fold these into src/masks.ts.
import {maskRef} from './kit/maskref';
import hale1880 from '../public/img/masks/hale_1880.json';

export const MASKS_CH05 = {
  hale_1880: maskRef('hale_1880', hale1880),
};
