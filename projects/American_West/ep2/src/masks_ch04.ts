// Chapter 4 masks: Goodnight (coral subject) and the AI lithograph props used as cut-outs. The Diné and Apache people at
// Bosque Redondo stay in their own photographs: no masks of them, by design.
import {maskRef} from './kit/maskref';
import goodnight from '../public/img/masks/c4_goodnight.json';
import longhorn from '../public/img/masks/p2_longhorn.json';
import coins from '../public/img/masks/p2_coin_stack.json';
import wagon from '../public/img/masks/p4_chuck_wagon.json';
import saddle from '../public/img/masks/p3_saddle.json';
import lariat from '../public/img/masks/p3_lariat.json';

export const M4 = {
  goodnight: maskRef('c4_goodnight', goodnight),
  longhorn: maskRef('p2_longhorn', longhorn),
  coins: maskRef('p2_coin_stack', coins),
  wagon: maskRef('p4_chuck_wagon', wagon),
  saddle: maskRef('p3_saddle', saddle),
  lariat: maskRef('p3_lariat', lariat),
};
