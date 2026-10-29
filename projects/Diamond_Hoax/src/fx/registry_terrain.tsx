// Test compositions for the terrain 3D pieces (registered in Root.tsx as FX-<id>). The terrain builder adds entries here.
import React from 'react';
import {MESA_TEST_FRAMES, MesaTest} from './Mesa';
import {LOOPING_RIDE_TEST_FRAMES, LoopingRideTest} from './LoopingRide';
import {ANTHILL_TEST_FRAMES, AnthillCutawayTest} from './AnthillCutaway';
import {GEM_ORIGINS_TEST_FRAMES, GemOriginsTest} from './GemOrigins';

export const FX_TERRAIN: {id: string; C: React.FC; frames: number}[] = [
  {id: 'Mesa', C: MesaTest, frames: MESA_TEST_FRAMES},
  {id: 'LoopingRide', C: LoopingRideTest, frames: LOOPING_RIDE_TEST_FRAMES},
  {id: 'AnthillCutaway', C: AnthillCutawayTest, frames: ANTHILL_TEST_FRAMES},
  {id: 'GemOrigins', C: GemOriginsTest, frames: GEM_ORIGINS_TEST_FRAMES},
];
