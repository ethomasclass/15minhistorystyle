// This video's subject masks (regenerate this list after `python3 tools/mask.py <name>`).
import {maskRef} from './kit/maskref';
import alturas from '../public/img/masks/alturas.json';
import collapsed from '../public/img/masks/collapsed.json';
import dsc_medal from '../public/img/masks/dsc_medal.json';
import f22 from '../public/img/masks/f22.json';
import gold_medal from '../public/img/masks/gold_medal.json';
import lst388_balloon from '../public/img/masks/lst388_balloon.json';
import medics from '../public/img/masks/medics.json';
import moffett from '../public/img/masks/moffett.json';
import navy_envelope from '../public/img/masks/navy_envelope.json';
import place_tank from '../public/img/masks/place_tank.json';
import rubber_tank from '../public/img/masks/rubber_tank.json';
import sherman_lst from '../public/img/masks/sherman_lst.json';
import sully from '../public/img/masks/sully.json';
import two_tanks from '../public/img/masks/two_tanks.json';
import u2_balloon from '../public/img/masks/u2_balloon.json';
import walk320 from '../public/img/masks/walk320.json';
import woodson from '../public/img/masks/woodson.json';

export const MASKS = {
  alturas: maskRef('alturas', alturas),
  collapsed: maskRef('collapsed', collapsed),
  dsc_medal: maskRef('dsc_medal', dsc_medal),
  f22: maskRef('f22', f22),
  gold_medal: maskRef('gold_medal', gold_medal),
  lst388_balloon: maskRef('lst388_balloon', lst388_balloon),
  medics: maskRef('medics', medics),
  moffett: maskRef('moffett', moffett),
  navy_envelope: maskRef('navy_envelope', navy_envelope),
  place_tank: maskRef('place_tank', place_tank),
  rubber_tank: maskRef('rubber_tank', rubber_tank),
  sherman_lst: maskRef('sherman_lst', sherman_lst),
  sully: maskRef('sully', sully),
  two_tanks: maskRef('two_tanks', two_tanks),
  u2_balloon: maskRef('u2_balloon', u2_balloon),
  walk320: maskRef('walk320', walk320),
  woodson: maskRef('woodson', woodson),
};
