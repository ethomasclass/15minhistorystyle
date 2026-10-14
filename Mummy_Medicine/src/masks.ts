// This video's subject masks (tools/mask.py; tomb_bundle and oven_bundles drawn by hand as polygons).
import {maskRef} from './kit/maskref';
import sully from '../public/img/masks/sully.json';
import seep_man from '../public/img/masks/seep_man.json';
import translator from '../public/img/masks/translator.json';
import tomb_bundle from '../public/img/masks/tomb_bundle.json';
import dealer from '../public/img/masks/dealer.json';
import apothecary from '../public/img/masks/apothecary.json';
import oven_bundles from '../public/img/masks/oven_bundles.json';
import party_bundle from '../public/img/masks/party_bundle.json';
import pare from '../public/img/masks/pare.json';
import twain from '../public/img/masks/twain.json';

export const MASKS = {
  sully: maskRef('sully', sully),
  seep_man: maskRef('seep_man', seep_man),
  translator: maskRef('translator', translator),
  tomb_bundle: maskRef('tomb_bundle', tomb_bundle),
  dealer: maskRef('dealer', dealer),
  apothecary: maskRef('apothecary', apothecary),
  oven_bundles: maskRef('oven_bundles', oven_bundles),
  party_bundle: maskRef('party_bundle', party_bundle),
  pare: maskRef('pare', pare),
  twain: maskRef('twain', twain),
};
