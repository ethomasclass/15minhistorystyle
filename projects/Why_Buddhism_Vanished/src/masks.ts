// This video's subject masks (tools/mask.py). Import the JSON and add a line to MASKS.
import {maskRef} from './kit/maskref';
import sully from '../public/img/masks/sully.json';
import vedic_priest from '../public/img/masks/vedic_priest.json';
import puja_woman from '../public/img/masks/puja_woman.json';
import indenture_woman from '../public/img/masks/indenture_woman.json';
import old_man from '../public/img/masks/old_man.json';
import ashoka from '../public/img/masks/ashoka.json';
import silk_monk from '../public/img/masks/silk_monk.json';
import nalanda_monk from '../public/img/masks/nalanda_monk.json';
import langar_volunteer from '../public/img/masks/langar_volunteer.json';
import sikh_man from '../public/img/masks/sikh_man.json';

export const MASKS = {
  sully: maskRef('sully', sully),
  vedic_priest: maskRef('vedic_priest', vedic_priest),
  puja_woman: maskRef('puja_woman', puja_woman),
  indenture_woman: maskRef('indenture_woman', indenture_woman),
  old_man: maskRef('old_man', old_man),
  ashoka: maskRef('ashoka', ashoka),
  silk_monk: maskRef('silk_monk', silk_monk),
  nalanda_monk: maskRef('nalanda_monk', nalanda_monk),
  langar_volunteer: maskRef('langar_volunteer', langar_volunteer),
  sikh_man: maskRef('sikh_man', sikh_man),
};
