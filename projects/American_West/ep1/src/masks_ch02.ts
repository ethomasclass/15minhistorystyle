// Chapter 2 subject masks (tools/mask_jobs/ch02.py -> public/img/masks/<name>.json).
import {maskRef} from './kit/maskref';
import bonds from '../public/img/masks/ch02_bonds.json';

export const M2 = {
  bonds: maskRef('ch02_bonds', bonds),
};
