// This video's subject masks (tools/mask.py; check them with tools/mask_preview.py).
import {maskRef} from './kit/maskref';
import sully from '../public/img/masks/sully.json';
import lee from '../public/img/masks/lee.json';
import grant from '../public/img/masks/grant.json';
import everett from '../public/img/masks/everett.json';
import sherman from '../public/img/masks/sherman.json';
import granger from '../public/img/masks/granger.json';
import lee_1865 from '../public/img/masks/lee_1865.json';
import galveston_officer from '../public/img/masks/galveston_officer.json';
import hired_man from '../public/img/masks/hired_man.json';

export const MASKS = {
  sully: maskRef('sully', sully), // the template thumbnail's portrait (Thumbnail.tsx)
  lee: maskRef('lee', lee),
  grant: maskRef('grant', grant),
  everett: maskRef('everett', everett),
  sherman: maskRef('sherman', sherman),
  granger: maskRef('granger', granger),
  lee_1865: maskRef('lee_1865', lee_1865),
  galveston_officer: maskRef('galveston_officer', galveston_officer),
  hired_man: maskRef('hired_man', hired_man),
};
