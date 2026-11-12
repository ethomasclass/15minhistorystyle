// This video's subject masks (tools/mask.py). Import the JSON and add a line to MASKS.
import {maskRef} from './kit/maskref';
import sully from '../public/img/masks/sully.json';
import roman_traveler from '../public/img/masks/roman_traveler.json';
import port_merchant from '../public/img/masks/port_merchant.json';
import caravan_guide from '../public/img/masks/caravan_guide.json';

export const MASKS = {
  sully: maskRef('sully', sully),
  roman_traveler: maskRef('roman_traveler', roman_traveler),
  port_merchant: maskRef('port_merchant', port_merchant),
  caravan_guide: maskRef('caravan_guide', caravan_guide),
};
