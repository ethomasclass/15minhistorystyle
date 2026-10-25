// ch05 masks (jobs in tools/mask_jobs/ch05.py; rembg, checked at full size).
import {maskRef} from './kit/maskref';
import spike from '../public/img/masks/c5_spike.json';
import telegraphkey from '../public/img/masks/c5_telegraph_key.json';
import railtie from '../public/img/masks/c5_rail_tie.json';
import ironspike from '../public/img/masks/c5_iron_spike.json';
import sledgehammer from '../public/img/masks/c5_sledgehammer.json';

export const M5 = {
  spike: maskRef('c5_spike', spike),
  telegraphkey: maskRef('c5_telegraph_key', telegraphkey),
  railtie: maskRef('c5_rail_tie', railtie),
  ironspike: maskRef('c5_iron_spike', ironspike),
  sledgehammer: maskRef('c5_sledgehammer', sledgehammer),
};
