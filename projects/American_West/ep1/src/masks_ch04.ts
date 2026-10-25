// ch04 masks (jobs in tools/mask_jobs/ch04.py; rembg, checked at full size).
import {maskRef} from './kit/maskref';
import driller from '../public/img/masks/c4_driller.json';
import crocker from '../public/img/masks/c4_crocker.json';

export const M4 = {
  driller: maskRef('c4_driller', driller),
  crocker: maskRef('c4_crocker', crocker),
};
