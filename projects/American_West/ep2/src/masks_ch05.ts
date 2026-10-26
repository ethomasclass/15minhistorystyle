// Chapter 5 masks: the coral subjects (Bose Ikard, Bass Reeves, Remington's vaquero) and the AI lithograph props.
import {maskRef} from './kit/maskref';
import ikard from '../public/img/masks/c5_ikard.json';
import reeves from '../public/img/masks/c5_reeves.json';
import vaquero from '../public/img/masks/c5_vaquero.json';
import coin from '../public/img/masks/p2_coin_one.json';
import iron from '../public/img/masks/p3_branding_iron.json';
import lariat from '../public/img/masks/p3_lariat.json';
import chaps from '../public/img/masks/p5_chaps.json';
import sombrero from '../public/img/masks/p5_sombrero.json';
import corral from '../public/img/masks/p5_corral.json';
import bronco from '../public/img/masks/p5_bronco.json';

export const M5 = {
  ikard: maskRef('c5_ikard', ikard),
  reeves: maskRef('c5_reeves', reeves),
  vaquero: maskRef('c5_vaquero', vaquero),
  coin: maskRef('p2_coin_one', coin),
  iron: maskRef('p3_branding_iron', iron),
  lariat: maskRef('p3_lariat', lariat),
  chaps: maskRef('p5_chaps', chaps),
  sombrero: maskRef('p5_sombrero', sombrero),
  corral: maskRef('p5_corral', corral),
  bronco: maskRef('p5_bronco', bronco),
};
