// This video's subject masks. After `python3 tools/mask.py <name>` writes public/img/masks/<name>.json,
// import it here and add a line to MASKS. The demo portrait's mask ships with the template.
import {maskRef} from './kit/maskref';
import sully from '../public/img/masks/sully.json';
import settlers_enslaved from '../public/img/masks/settlers_enslaved.json';
import corkleg_soldier from '../public/img/masks/corkleg_soldier.json';
import corkleg_leg from '../public/img/masks/corkleg_leg.json';
import rider from '../public/img/masks/rider.json';
import lincoln from '../public/img/masks/lincoln.json';
import polk from '../public/img/masks/polk.json';
import tejano_rancher from '../public/img/masks/tejano_rancher.json';
import austin from '../public/img/masks/austin.json';

export const MASKS = {
  sully: maskRef('sully', sully),
  settlers_enslaved: maskRef('settlers_enslaved', settlers_enslaved),
  corkleg_soldier: maskRef('corkleg_soldier', corkleg_soldier),
  corkleg_leg: maskRef('corkleg_leg', corkleg_leg),
  rider: maskRef('rider', rider),
  lincoln: maskRef('lincoln', lincoln),
  polk: maskRef('polk', polk),
  tejano_rancher: maskRef('tejano_rancher', tejano_rancher),
  austin: maskRef('austin', austin),
};
