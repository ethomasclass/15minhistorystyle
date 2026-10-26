// Chapter 6 masks: Custer (the coral subject of the expedition beat) and the AI lithograph props.
import {maskRef} from './kit/maskref';
import custer from '../public/img/masks/c6_custer.json';
import pick from '../public/img/masks/p6_pick_shovel.json';
import pan from '../public/img/masks/p6_gold_pan.json';
import nugget from '../public/img/masks/p6_nugget.json';
import coins from '../public/img/masks/p2_coin_stack.json';

export const M6 = {
  custer: maskRef('c6_custer', custer),
  pick: maskRef('p6_pick_shovel', pick),
  pan: maskRef('p6_gold_pan', pan),
  nugget: maskRef('p6_nugget', nugget),
  coins: maskRef('p2_coin_stack', coins),
};
