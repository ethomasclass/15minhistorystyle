// Chapter 09 masks (pattern: src/masks.ts). AI lithograph props: masks from tools/mask_jobs/props.py (pre-made).
import {maskRef} from './kit/maskref';
import p9_post_drift from '../public/img/masks/p9_post_drift.json';
import p9_haystack from '../public/img/masks/p9_haystack.json';
import p9_hay_rake from '../public/img/masks/p9_hay_rake.json';
import p2_longhorn from '../public/img/masks/p2_longhorn.json';

export const M9 = {
  p9_post_drift: maskRef('p9_post_drift', p9_post_drift),
  p9_haystack: maskRef('p9_haystack', p9_haystack),
  p9_hay_rake: maskRef('p9_hay_rake', p9_hay_rake),
  p2_longhorn: maskRef('p2_longhorn', p2_longhorn),
};
