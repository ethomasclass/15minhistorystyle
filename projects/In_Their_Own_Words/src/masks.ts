// This video's subject masks (tools/mask.py, then tools/refine_mask.py for the hand-clipped ones).
import {maskRef} from './kit/maskref';
import stephens from '../public/img/masks/stephens.json';
import lincoln from '../public/img/masks/lincoln.json';
import davis from '../public/img/masks/davis.json';
import anderson from '../public/img/masks/anderson.json';
import lee from '../public/img/masks/lee.json';
import union_soldier from '../public/img/masks/union_soldier.json';
import confed_soldier from '../public/img/masks/confed_soldier.json';
import spectator from '../public/img/masks/spectator.json';

export const MASKS = {
  stephens: maskRef('stephens', stephens),
  lincoln: maskRef('lincoln', lincoln),
  davis: maskRef('davis', davis),
  anderson: maskRef('anderson', anderson),
  lee: maskRef('lee', lee),
  union_soldier: maskRef('union_soldier', union_soldier),
  confed_soldier: maskRef('confed_soldier', confed_soldier),
  spectator: maskRef('spectator', spectator),
};
