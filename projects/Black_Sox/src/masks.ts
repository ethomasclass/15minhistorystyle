// This video's subject masks. After `python3 tools/mask.py <name>` writes public/img/masks/<name>.json,
// import it here and add a line to MASKS.
import {maskRef} from './kit/maskref';
import sully from '../public/img/masks/sully.json';
import landis_street from '../public/img/masks/landis_street.json';
import hulbert from '../public/img/masks/hulbert.json';
import klem from '../public/img/masks/klem.json';
import klem_full from '../public/img/masks/klem_full.json';
import chase from '../public/img/masks/chase.json';
import chase_full from '../public/img/masks/chase_full.json';
import mathewson from '../public/img/masks/mathewson.json';
import heydler from '../public/img/masks/heydler.json';
import jackson from '../public/img/masks/jackson.json';
import jackson_bat from '../public/img/masks/jackson_bat.json';
import cicotte from '../public/img/masks/cicotte.json';
import cicotte_pitch from '../public/img/masks/cicotte_pitch.json';
import gandil from '../public/img/masks/gandil.json';
import comiskey from '../public/img/masks/comiskey.json';
import rothstein from '../public/img/masks/rothstein.json';
import rath from '../public/img/masks/rath.json';
import weaver from '../public/img/masks/weaver.json';
import landis_1907 from '../public/img/masks/landis_1907.json';
import catcher_ci from '../public/img/masks/catcher_ci.json';
import landis_desk from '../public/img/masks/landis_desk.json';

export const MASKS = {
  sully: maskRef('sully', sully),
  landis_street: maskRef('landis_street', landis_street),
  hulbert: maskRef('hulbert', hulbert),
  klem: maskRef('klem', klem),
  klem_full: maskRef('klem_full', klem_full),
  chase: maskRef('chase', chase),
  chase_full: maskRef('chase_full', chase_full),
  mathewson: maskRef('mathewson', mathewson),
  heydler: maskRef('heydler', heydler),
  jackson: maskRef('jackson', jackson),
  jackson_bat: maskRef('jackson_bat', jackson_bat),
  cicotte: maskRef('cicotte', cicotte),
  cicotte_pitch: maskRef('cicotte_pitch', cicotte_pitch),
  gandil: maskRef('gandil', gandil),
  comiskey: maskRef('comiskey', comiskey),
  rothstein: maskRef('rothstein', rothstein),
  rath: maskRef('rath', rath),
  weaver: maskRef('weaver', weaver),
  landis_1907: maskRef('landis_1907', landis_1907),
  catcher_ci: maskRef('catcher_ci', catcher_ci),
  landis_desk: maskRef('landis_desk', landis_desk),
};
