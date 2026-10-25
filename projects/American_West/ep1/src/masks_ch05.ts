// ch05 masks (jobs in tools/mask_jobs/ch05.py; rembg, checked at full size).
import {maskRef} from './kit/maskref';
import spike from '../public/img/masks/c5_spike.json';

export const M5 = {
  spike: maskRef('c5_spike', spike),
};
