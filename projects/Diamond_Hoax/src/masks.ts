// This video's subject masks. After `python3 tools/mask.py <name>` writes public/img/masks/<name>.json,
// import it here and add a line to MASKS. The demo portrait's mask ships with the template.
import {maskRef} from './kit/maskref';
import sully from '../public/img/masks/sully.json';
import tycoon_b from '../public/img/masks/tycoon_b.json';
import tycoon_c from '../public/img/masks/tycoon_c.json';
import rock_c from '../public/img/masks/rock_c.json';

export const MASKS = {
  sully: maskRef('sully', sully),
  tycoon_b: maskRef('tycoon_b', tycoon_b),
  tycoon_c: maskRef('tycoon_c', tycoon_c),
  rock_c: maskRef('rock_c', rock_c),
};
