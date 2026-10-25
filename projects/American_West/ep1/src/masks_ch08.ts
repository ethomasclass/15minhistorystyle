// Chapter 8 masks (tools/mask_jobs/ch08.py): the AI lithograph ballot box prop.
import {maskRef} from './kit/maskref';
import ballot from '../public/img/masks/c8_ballot.json';

export const M8 = {
  ballot: maskRef('c8_ballot', ballot),
};
