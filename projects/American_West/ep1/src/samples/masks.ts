// Masks for the style-sample scenes (public/img/masks/s_*). Made with rembg via ep1/tools/mask.py's run(), then
// hand-traced where rembg failed (s_up, s_montague, s_worker: polygon-only; s_goliah: rembg + pilot polygon).
// Do not re-run rembg over these; the traces and commands are listed in review/samples/README.md.
import {maskRef} from '../kit/maskref';
import goliah from '../../public/img/masks/s_goliah.json';
import montague from '../../public/img/masks/s_montague.json';
import redcloud from '../../public/img/masks/s_redcloud.json';
import up from '../../public/img/masks/s_up.json';
import worker from '../../public/img/masks/s_worker.json';

export const SM = {
  goliah: maskRef('s_goliah', goliah),
  montague: maskRef('s_montague', montague),
  redcloud: maskRef('s_redcloud', redcloud),
  up: maskRef('s_up', up),
  worker: maskRef('s_worker', worker),
};

/** Source pixel sizes of the sample images (public/img/samples). */
export const SZ = {
  spike: [3840, 2922] as [number, number],
  tunnel8: [2090, 2000] as [number, number],
  goliah: [2104, 2040] as [number, number],
  carbutt: [2012, 2087] as [number, number],
  redcloud: [2162, 3140] as [number, number],
  act: [2100, 3400] as [number, number],
  warren: [4000, 3671] as [number, number],
  dodge: [6000, 2131] as [number, number],
};

export const IMG = {
  spike: 'img/samples/spike_russell_1869.jpg',
  tunnel8: 'img/samples/hart_tunnel8_worker.jpg',
  goliah: 'img/samples/hart_goliah_mirrored.jpg',
  carbutt: 'img/samples/carbutt_up_100th_1866.jpg',
  redcloud: 'img/samples/red_cloud_trager_kuhn_1891.jpg',
  act1: 'img/samples/pacific_railway_act_1862_p1.jpg',
  act4: 'img/samples/pacific_railway_act_1862_p4.jpg',
  warren: 'img/samples/map_warren_1868.jpg',
  dodge: 'img/samples/map_up_dodge_1869.jpg',
};

/** Places on the 1868 Warren/Freyhold map (source px of map_warren_1868.jpg; read off a grid, approximate). */
export const WARREN = {
  promontory: [1358, 1176] as [number, number],
  saltLake: [1365, 1235] as [number, number],
  powderRiver: [1850, 850] as [number, number],
};
