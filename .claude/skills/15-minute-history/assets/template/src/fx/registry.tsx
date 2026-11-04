// Test compositions for the 3D pieces (src/fx/*.tsx), registered in Root as FX-<id>. Each piece exports a self-contained test
// (its beats at fixed frames) and adds {id, C, frames} here, so it can be checked on its own before a chapter uses it:
//   node tools/glstills.mjs out/fx FX-<id>:0,60,120
import React from 'react';
import {DemoSlab, DEMO_SLAB_FRAMES} from './DemoSlab';

export const FX: {id: string; C: React.FC; frames: number}[] = [
  {id: 'DemoSlab', C: DemoSlab, frames: DEMO_SLAB_FRAMES},
];
