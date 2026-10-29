// Chapter 3 masks: the AI lithograph props (tools/mask_jobs/props.py).
import {maskRef} from './kit/maskref';
import longhorn from '../public/img/masks/p2_longhorn.json';
import saddle from '../public/img/masks/p3_saddle.json';
import lariat from '../public/img/masks/p3_lariat.json';
import wagon from '../public/img/masks/p4_chuck_wagon.json';

export const M3 = {
  longhorn: maskRef('p2_longhorn', longhorn),
  saddle: maskRef('p3_saddle', saddle),
  lariat: maskRef('p3_lariat', lariat),
  wagon: maskRef('p4_chuck_wagon', wagon),
};
