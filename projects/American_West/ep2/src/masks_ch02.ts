// Chapter 2 masks (McCoy: hand polygon, review/ch02_mask_mccoy_poly.py; props from tools/mask_jobs/props.py).
import {maskRef} from './kit/maskref';
import mccoy from '../public/img/masks/ch02_mccoy.json';
import coinOne from '../public/img/masks/p2_coin_one.json';
import coinStack from '../public/img/masks/p2_coin_stack.json';
import stockCar from '../public/img/masks/p2_stock_car.json';
import longhorn from '../public/img/masks/p2_longhorn.json';

export const M2 = {
  mccoy: maskRef('ch02_mccoy', mccoy),
  coinOne: maskRef('p2_coin_one', coinOne),
  coinStack: maskRef('p2_coin_stack', coinStack),
  stockCar: maskRef('p2_stock_car', stockCar),
  longhorn: maskRef('p2_longhorn', longhorn),
};
