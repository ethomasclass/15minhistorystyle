// Chapter 10 masks (pattern: src/masks.ts). AI lithograph props: masks from tools/mask_jobs/props.py (pre-made).
import {maskRef} from './kit/maskref';
import c1_steer_1887 from '../public/img/masks/c1_steer_1887.json';
import b10_ikard from '../public/img/masks/b10_ikard.json';
import b10_goodnight from '../public/img/masks/b10_goodnight.json';
import b10_mccoy from '../public/img/masks/b10_mccoy.json';
import p2_coin_stack from '../public/img/masks/p2_coin_stack.json';
import p2_longhorn from '../public/img/masks/p2_longhorn.json';
import p3_saddle from '../public/img/masks/p3_saddle.json';
import p6_nugget from '../public/img/masks/p6_nugget.json';
import p1_letter from '../public/img/masks/p1_letter.json';

export const M10 = {
  /** ch01's steer mask on the restored 1887 painting. */
  c1_steer_1887: maskRef('c1_steer_1887', c1_steer_1887),
  b10_ikard: maskRef('b10_ikard', b10_ikard),
  b10_goodnight: maskRef('b10_goodnight', b10_goodnight),
  b10_mccoy: maskRef('b10_mccoy', b10_mccoy),
  p2_coin_stack: maskRef('p2_coin_stack', p2_coin_stack),
  p2_longhorn: maskRef('p2_longhorn', p2_longhorn),
  p3_saddle: maskRef('p3_saddle', p3_saddle),
  p6_nugget: maskRef('p6_nugget', p6_nugget),
  p1_letter: maskRef('p1_letter', p1_letter),
};
