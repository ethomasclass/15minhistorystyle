// Chapter 5 masks: the portrait busts (Bose Ikard and Bass Reeves, coral; Goodnight, plain), Remington's vaquero (coral, a
// painting, kept as a print) and the AI lithograph props.
import {maskRef} from './kit/maskref';
import ikard from '../public/img/masks/c5_ikard.json';
import ikardBust from '../public/img/masks/c5_ikard_bust.json';
import reevesBust from '../public/img/masks/c5_reeves_bust.json';
import goodnight from '../public/img/masks/c4_goodnight.json';
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
  ikardBust: maskRef('c5_ikard_bust', ikardBust),
  reevesBust: maskRef('c5_reeves_bust', reevesBust),
  goodnight: maskRef('c4_goodnight', goodnight),
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
