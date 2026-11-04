// Test compositions for the 3D pieces (src/fx/*.tsx), registered in Root as FX-<id>. Each piece adds {id, C, frames} here.
import React from 'react';
import {PACIFIC_WINDS_TEST_FRAMES, PacificWindsTest} from './PacificWinds';
import {ALTITUDE_RIBBON_TEST_FRAMES, AltitudeRibbonTest, AltitudeRibbonWideTest} from './AltitudeRibbon';
import {SAND_TO_BEACH_TEST_FRAMES, SandToBeachTest} from './SandToBeach';
import {LANDING_MAP_BLY_TEST_FRAMES, LANDING_MAP_TEST_FRAMES, LandingMapBlyTest, LandingMapTest} from './LandingMap';

export const FX: {id: string; C: React.FC; frames: number}[] = [
  {id: 'PacificWinds', C: PacificWindsTest, frames: PACIFIC_WINDS_TEST_FRAMES},
  {id: 'LandingMap', C: LandingMapTest, frames: LANDING_MAP_TEST_FRAMES},
  {id: 'LandingMapBly', C: LandingMapBlyTest, frames: LANDING_MAP_BLY_TEST_FRAMES},
  {id: 'SandToBeach', C: SandToBeachTest, frames: SAND_TO_BEACH_TEST_FRAMES},
  {id: 'AltitudeRibbon', C: AltitudeRibbonTest, frames: ALTITUDE_RIBBON_TEST_FRAMES},
  {id: 'AltitudeRibbonWide', C: AltitudeRibbonWideTest, frames: ALTITUDE_RIBBON_TEST_FRAMES},
];
