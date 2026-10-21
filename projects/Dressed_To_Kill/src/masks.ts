// This video's subject masks (tools/mask.py writes public/img/masks/<name>.json; layers.py makes the parallax pair).
import {maskRef} from './kit/maskref';
import sully from '../public/img/masks/sully.json';
import g_library from '../public/img/masks/g_library.json';
import g_ballroom from '../public/img/masks/g_ballroom.json';
import g_matilda from '../public/img/masks/g_matilda.json';
import g_workshop from '../public/img/masks/g_workshop.json';
import g_street from '../public/img/masks/g_street.json';
import g_doctor from '../public/img/masks/g_doctor.json';
import g_chemist from '../public/img/masks/g_chemist.json';
import g_emma from '../public/img/masks/g_emma.json';
import g_farmer from '../public/img/masks/g_farmer.json';
import waltz_lady from '../public/img/masks/waltz_lady.json';
import waltz_man from '../public/img/masks/waltz_man.json';
import morris from '../public/img/masks/morris.json';
import draper from '../public/img/masks/draper.json';
import kedzie from '../public/img/masks/kedzie.json';
import dress from '../public/img/masks/dress.json';
import scheele from '../public/img/masks/scheele.json';

export const MASKS = {
  sully: maskRef('sully', sully),
  g_library: maskRef('g_library', g_library),
  g_ballroom: maskRef('g_ballroom', g_ballroom),
  g_matilda: maskRef('g_matilda', g_matilda),
  g_workshop: maskRef('g_workshop', g_workshop),
  g_street: maskRef('g_street', g_street),
  g_doctor: maskRef('g_doctor', g_doctor),
  g_chemist: maskRef('g_chemist', g_chemist),
  g_emma: maskRef('g_emma', g_emma),
  g_farmer: maskRef('g_farmer', g_farmer),
  waltz_lady: maskRef('waltz_lady', waltz_lady),
  waltz_man: maskRef('waltz_man', waltz_man),
  morris: maskRef('morris', morris),
  draper: maskRef('draper', draper),
  kedzie: maskRef('kedzie', kedzie),
  dress: maskRef('dress', dress),
  scheele: maskRef('scheele', scheele),
};
