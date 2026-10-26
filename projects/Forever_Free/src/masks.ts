// This video's subject masks (tools/mask.py). Every one is a single figure; crops for group pictures are in the job list.
import {maskRef} from './kit/maskref';
import smalls from '../public/img/masks/smalls.json';
import smalls_1862 from '../public/img/masks/smalls_1862.json';
import butler from '../public/img/masks/butler.json';
import mcclellan from '../public/img/masks/mcclellan.json';
import taney from '../public/img/masks/taney.json';
import lincoln_tent from '../public/img/masks/lincoln_tent.json';
import greeley from '../public/img/masks/greeley.json';
import lincoln_reading from '../public/img/masks/lincoln_reading.json';
import barton from '../public/img/masks/barton.json';
import dix from '../public/img/masks/dix.json';
import sully from '../public/img/masks/sully.json';
import douglass from '../public/img/masks/douglass.json';

export const MASKS = {
  smalls: maskRef('smalls', smalls),
  smalls_1862: maskRef('smalls_1862', smalls_1862),
  butler: maskRef('butler', butler),
  mcclellan: maskRef('mcclellan', mcclellan),
  taney: maskRef('taney', taney),
  lincoln_tent: maskRef('lincoln_tent', lincoln_tent),
  greeley: maskRef('greeley', greeley),
  lincoln_reading: maskRef('lincoln_reading', lincoln_reading),
  barton: maskRef('barton', barton),
  dix: maskRef('dix', dix),
  douglass: maskRef('douglass', douglass),
  /** the template thumbnail's demo portrait (the thumbnail is made later) */
  sully: maskRef('sully', sully),
};
