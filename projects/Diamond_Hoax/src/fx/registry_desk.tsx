// Test compositions for the desk 3D pieces (registered in Root.tsx as FX-<id>). The desk builder adds entries here.
import React from 'react';
import {DominoesTest, DOMINOES_TEST_FRAMES} from './Dominoes';
import {BankVaultTest, BANKVAULT_TEST_FRAMES} from './BankVault';
import {ShareSlicesTest, SHARESLICES_TEST_FRAMES} from './ShareSlices';
import {ShortSaleTest, SHORTSALE_TEST_FRAMES} from './ShortSale';
import {MoneyMapTest, MONEYMAP_TEST_FRAMES} from './MoneyMap';
import {ColdOpenDepthTest, COLDOPEN_TEST_FRAMES} from './ColdOpenDepth';

export const FX_DESK: {id: string; C: React.FC; frames: number}[] = [
  {id: 'Dominoes', C: DominoesTest, frames: DOMINOES_TEST_FRAMES},
  {id: 'BankVault', C: BankVaultTest, frames: BANKVAULT_TEST_FRAMES},
  {id: 'ShareSlices', C: ShareSlicesTest, frames: SHARESLICES_TEST_FRAMES},
  {id: 'ShortSale', C: ShortSaleTest, frames: SHORTSALE_TEST_FRAMES},
  {id: 'MoneyMap', C: MoneyMapTest, frames: MONEYMAP_TEST_FRAMES},
  {id: 'ColdOpenDepth', C: ColdOpenDepthTest, frames: COLDOPEN_TEST_FRAMES},
];
