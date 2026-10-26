// Chapter 08 masks (pattern: src/masks.ts). AI lithograph props: masks from tools/mask_jobs/props.py (pre-made).
import {maskRef} from './kit/maskref';
import p8_barb from '../public/img/masks/p8_barb.json';
import p8_nippers from '../public/img/masks/p8_nippers.json';
import p8_wire_spool from '../public/img/masks/p8_wire_spool.json';
import p2_longhorn from '../public/img/masks/p2_longhorn.json';
import p6_nugget from '../public/img/masks/p6_nugget.json';

export const M8 = {
  p8_barb: maskRef('p8_barb', p8_barb),
  p8_nippers: maskRef('p8_nippers', p8_nippers),
  p8_wire_spool: maskRef('p8_wire_spool', p8_wire_spool),
  p2_longhorn: maskRef('p2_longhorn', p2_longhorn),
  p6_nugget: maskRef('p6_nugget', p6_nugget),
};
