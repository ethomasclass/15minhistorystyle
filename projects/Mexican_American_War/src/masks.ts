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
import jail_austin from '../public/img/masks/jail_austin.json';
import gonzales_flag from '../public/img/masks/gonzales_flag.json';
import gonzales_cannon from '../public/img/masks/gonzales_cannon.json';
import signer from '../public/img/masks/signer.json';
import santa_anna from '../public/img/masks/santa_anna.json';
import alamo_chapel from '../public/img/masks/alamo_chapel.json';
import huddle_santa_anna from '../public/img/masks/huddle_santa_anna.json';
import cartoon_santa_anna from '../public/img/masks/cartoon_santa_anna.json';
import houston from '../public/img/masks/houston.json';

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
  jail_austin: maskRef('jail_austin', jail_austin),
  gonzales_flag: maskRef('gonzales_flag', gonzales_flag),
  gonzales_cannon: maskRef('gonzales_cannon', gonzales_cannon),
  signer: maskRef('signer', signer),
  santa_anna: maskRef('santa_anna', santa_anna),
  alamo_chapel: maskRef('alamo_chapel', alamo_chapel),
  huddle_santa_anna: maskRef('huddle_santa_anna', huddle_santa_anna),
  cartoon_santa_anna: maskRef('cartoon_santa_anna', cartoon_santa_anna),
  houston: maskRef('houston', houston),
};
