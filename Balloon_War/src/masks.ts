// This video's subject masks. After `python3 tools/mask.py <name>` writes public/img/masks/<name>.json,
// import it here and add a line to MASKS. The demo portrait's mask ships with the template.
import {maskRef} from './kit/maskref';
import sully from '../public/img/masks/sully.json';
import alturas from '../public/img/masks/alturas.json';
import collapsed from '../public/img/masks/collapsed.json';
import lst388_balloon from '../public/img/masks/lst388_balloon.json';
import rubber_tank from '../public/img/masks/rubber_tank.json';
import woodson from '../public/img/masks/woodson.json';

export const MASKS = {
  sully: maskRef('sully', sully),
  alturas: maskRef('alturas', alturas),
  collapsed: maskRef('collapsed', collapsed),
  lst388_balloon: maskRef('lst388_balloon', lst388_balloon),
  rubber_tank: maskRef('rubber_tank', rubber_tank),
  woodson: maskRef('woodson', woodson),
};
