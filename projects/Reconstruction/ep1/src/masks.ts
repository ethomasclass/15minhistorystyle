// This video's subject masks (tools/mask.py writes public/img/masks/<name>.json). Check at full size with
// tools/mask_closeup.py before showing one large.
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
};
