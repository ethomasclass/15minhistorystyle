// This video's subject masks (tools/mask.py writes public/img/masks/<name>.json).
import {maskRef} from './kit/maskref';
import sully from '../public/img/masks/sully.json';
import harrison from '../public/img/masks/harrison.json';
import vanburen from '../public/img/masks/vanburen.json';
import vanburen_bust from '../public/img/masks/vanburen_bust.json';
import clay from '../public/img/masks/clay.json';
import tyler from '../public/img/masks/tyler.json';
import bharrison from '../public/img/masks/bharrison.json';

export const MASKS = {
  sully: maskRef('sully', sully),
  harrison: maskRef('harrison', harrison),
  vanburen: maskRef('vanburen', vanburen),
  vanburen_bust: maskRef('vanburen_bust', vanburen_bust),
  clay: maskRef('clay', clay),
  tyler: maskRef('tyler', tyler),
  bharrison: maskRef('bharrison', bharrison),
};
