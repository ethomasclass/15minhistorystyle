// ch06 masks (jobs in tools/mask_jobs/ch06.py; rembg u2net_human_seg, checked at full size).
import {maskRef} from './kit/maskref';
import grant from '../public/img/masks/c6_grant.json';

export const M6 = {
  grant: maskRef('c6_grant', grant),
};
