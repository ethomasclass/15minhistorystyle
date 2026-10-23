// This video's subject masks. After `python3 tools/mask.py <name>` writes public/img/masks/<name>.json,
// import it here and add a line to MASKS.
import {maskRef} from './kit/maskref';
import dad from '../public/img/masks/dad.json';
import pail from '../public/img/masks/pail.json';
import kid79 from '../public/img/masks/kid79.json';

export const MASKS = {
  dad: maskRef('dad', dad),
  pail: maskRef('pail', pail),
  kid79: maskRef('kid79', kid79),
};
