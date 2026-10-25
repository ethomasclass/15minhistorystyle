// Chapter 3 subject masks (tools/mask_jobs/ch03.py -> public/img/masks/<name>.json).
import {maskRef} from './kit/maskref';
import crocker from '../public/img/masks/ch03_crocker.json';
import teaBarrel from '../public/img/masks/ch03_tea_barrel.json';

export const M3 = {
  crocker: maskRef('ch03_crocker', crocker),
  teaBarrel: maskRef('ch03_tea_barrel', teaBarrel),
};
