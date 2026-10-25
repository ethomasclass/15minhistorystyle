// Chapter 9 subject masks (tools/mask_jobs/ch09.py; c9_longhorn is hand-traced: tools/traces/c9_longhorn.json, do not re-run rembg).
import {maskRef} from './kit/maskref';
import longhorn from '../public/img/masks/c9_longhorn.json';

export const M9 = {
  longhorn: maskRef('c9_longhorn', longhorn),
};
