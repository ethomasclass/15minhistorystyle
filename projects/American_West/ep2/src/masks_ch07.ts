// Chapter 07 masks (pattern: src/masks.ts). AI lithograph props: masks from tools/mask_jobs/props.py (pre-made).
import {maskRef} from './kit/maskref';
import p6_gold_pan from '../public/img/masks/p6_gold_pan.json';
import p6_nugget from '../public/img/masks/p6_nugget.json';
import p7_sluice from '../public/img/masks/p7_sluice.json';
import p7_headframe from '../public/img/masks/p7_headframe.json';
import p7_stamp_mill from '../public/img/masks/p7_stamp_mill.json';
import p7_ore_cart from '../public/img/masks/p7_ore_cart.json';
import p2_coin_stack from '../public/img/masks/p2_coin_stack.json';
import p8_wire_spool from '../public/img/masks/p8_wire_spool.json';

export const M7 = {
  p6_gold_pan: maskRef('p6_gold_pan', p6_gold_pan),
  p6_nugget: maskRef('p6_nugget', p6_nugget),
  p7_sluice: maskRef('p7_sluice', p7_sluice),
  p7_headframe: maskRef('p7_headframe', p7_headframe),
  p7_stamp_mill: maskRef('p7_stamp_mill', p7_stamp_mill),
  p7_ore_cart: maskRef('p7_ore_cart', p7_ore_cart),
  p2_coin_stack: maskRef('p2_coin_stack', p2_coin_stack),
  p8_wire_spool: maskRef('p8_wire_spool', p8_wire_spool),
};
