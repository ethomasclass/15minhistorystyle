// Chapter 1 masks (jobs in tools/mask_jobs/ch01.py; the Russell hat added by review/ch01_mask_russell_fix.py).
import {maskRef} from './kit/maskref';
import steer from '../public/img/masks/ch01_steer.json';
import russell from '../public/img/masks/ch01_russell.json';
import letter from '../public/img/masks/p1_letter.json';
import saddle from '../public/img/masks/p3_saddle.json';
import longhorn from '../public/img/masks/p2_longhorn.json';

export const M1 = {
  steer: maskRef('ch01_steer', steer),
  russell: maskRef('ch01_russell', russell),
  letter: maskRef('p1_letter', letter),
  longhorn: maskRef('p2_longhorn', longhorn),
  saddle: maskRef('p3_saddle', saddle),
};
