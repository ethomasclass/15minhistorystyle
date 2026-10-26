// Chapter 10 masks (pattern: src/masks.ts). AI lithograph props: masks from tools/mask_jobs/props.py (pre-made).
import {maskRef} from './kit/maskref';
import p2_coin_stack from '../public/img/masks/p2_coin_stack.json';
import p2_longhorn from '../public/img/masks/p2_longhorn.json';
import p3_saddle from '../public/img/masks/p3_saddle.json';
import p6_nugget from '../public/img/masks/p6_nugget.json';
import p1_letter from '../public/img/masks/p1_letter.json';

export const M10 = {
  p2_coin_stack: maskRef('p2_coin_stack', p2_coin_stack),
  p2_longhorn: maskRef('p2_longhorn', p2_longhorn),
  p3_saddle: maskRef('p3_saddle', p3_saddle),
  p6_nugget: maskRef('p6_nugget', p6_nugget),
  p1_letter: maskRef('p1_letter', p1_letter),
};
