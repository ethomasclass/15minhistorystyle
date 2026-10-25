// Chapter 7 subject masks (tools/mask_jobs/ch07.py; hand fixes in tools/traces/c7_*.json, see review/build_ch07-09.md).
import {maskRef} from './kit/maskref';
import ames from '../public/img/masks/c7_ames.json';
import babcock from '../public/img/masks/c7_babcock.json';
import colfax from '../public/img/masks/c7_colfax.json';
import grant from '../public/img/masks/c7_grant.json';
import certificate from '../public/img/masks/c7_certificate.json';
import coins from '../public/img/masks/c7_coins.json';
import barrels from '../public/img/masks/c7_barrels.json';

export const M7 = {
  ames: maskRef('c7_ames', ames),
  babcock: maskRef('c7_babcock', babcock),
  colfax: maskRef('c7_colfax', colfax),
  grant: maskRef('c7_grant', grant),
  certificate: maskRef('c7_certificate', certificate),
  coins: maskRef('c7_coins', coins),
  barrels: maskRef('c7_barrels', barrels),
};
