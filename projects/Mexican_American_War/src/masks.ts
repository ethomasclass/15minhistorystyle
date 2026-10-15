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
import gast_columbia from '../public/img/masks/gast_columbia.json';
import camp_matamoros from '../public/img/masks/camp_matamoros.json';
import ambush_dragoons from '../public/img/masks/ambush_dragoons.json';
import blockade_steamer from '../public/img/masks/blockade_steamer.json';
import chapultepec_castle from '../public/img/masks/chapultepec_castle.json';
import grant from '../public/img/masks/grant.json';
import lee from '../public/img/masks/lee.json';
import jackson from '../public/img/masks/jackson.json';
import trist from '../public/img/masks/trist.json';
import trist_stack from '../public/img/masks/trist_stack.json';
import gold from '../public/img/masks/gold.json';
import orderly from '../public/img/masks/orderly.json';
import ranchero from '../public/img/masks/ranchero.json';

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
  gast_columbia: maskRef('gast_columbia', gast_columbia),
  camp_matamoros: maskRef('camp_matamoros', camp_matamoros),
  ambush_dragoons: maskRef('ambush_dragoons', ambush_dragoons),
  blockade_steamer: maskRef('blockade_steamer', blockade_steamer),
  chapultepec_castle: maskRef('chapultepec_castle', chapultepec_castle),
  grant: maskRef('grant', grant),
  lee: maskRef('lee', lee),
  jackson: maskRef('jackson', jackson),
  trist: maskRef('trist', trist),
  trist_stack: maskRef('trist_stack', trist_stack),
  gold: maskRef('gold', gold),
  orderly: maskRef('orderly', orderly),
  ranchero: maskRef('ranchero', ranchero),
};
