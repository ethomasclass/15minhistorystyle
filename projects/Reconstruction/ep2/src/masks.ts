// This video's subject masks (tools/mask.py writes public/img/masks/<name>.json). Check at full size with
// tools/mask_closeup.py before showing one large. Episode 1's portraits are kept for callbacks.
import {maskRef} from './kit/maskref';
import sherman from '../public/img/masks/sherman.json';
import stanton from '../public/img/masks/stanton.json';
import lincoln from '../public/img/masks/lincoln.json';
import booth from '../public/img/masks/booth.json';
import seward from '../public/img/masks/seward.json';
import johnson from '../public/img/masks/johnson.json';
import howard from '../public/img/masks/howard.json';
import stevens from '../public/img/masks/stevens.json';
import dred_scott from '../public/img/masks/dred_scott.json';
import jdavis from '../public/img/masks/jdavis.json';
import revels from '../public/img/masks/revels.json';
import davis1859 from '../public/img/masks/davis1859.json';
import grant from '../public/img/masks/grant.json';
import ames from '../public/img/masks/ames.json';
import stanton_cdv from '../public/img/masks/stanton_cdv.json';
import lynch from '../public/img/masks/lynch.json';
import smalls from '../public/img/masks/smalls.json';

export const MASKS = {
  sherman: maskRef('sherman', sherman),
  stanton: maskRef('stanton', stanton),
  lincoln: maskRef('lincoln', lincoln),
  booth: maskRef('booth', booth),
  seward: maskRef('seward', seward),
  johnson: maskRef('johnson', johnson),
  howard: maskRef('howard', howard),
  stevens: maskRef('stevens', stevens),
  dred_scott: maskRef('dred_scott', dred_scott),
  jdavis: maskRef('jdavis', jdavis),
  revels: maskRef('revels', revels),
  davis1859: maskRef('davis1859', davis1859),
  grant: maskRef('grant', grant),
  ames: maskRef('ames', ames),
  stanton_cdv: maskRef('stanton_cdv', stanton_cdv),
  lynch: maskRef('lynch', lynch),
  smalls: maskRef('smalls', smalls),
};
