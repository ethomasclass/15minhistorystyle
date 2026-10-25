// ch04 masks (jobs in tools/mask_jobs/ch04.py; rembg, checked at full size).
import {maskRef} from './kit/maskref';
import driller from '../public/img/masks/c4_driller.json';
import crocker from '../public/img/masks/c4_crocker.json';
import drillsledge from '../public/img/masks/c4_drill_sledge.json';
import powderkeg from '../public/img/masks/c4_powder_keg.json';
import nitrocan from '../public/img/masks/c4_nitro_can.json';

export const M4 = {
  driller: maskRef('c4_driller', driller),
  crocker: maskRef('c4_crocker', crocker),
  drillsledge: maskRef('c4_drill_sledge', drillsledge),
  powderkeg: maskRef('c4_powder_keg', powderkeg),
  nitrocan: maskRef('c4_nitro_can', nitrocan),
};
