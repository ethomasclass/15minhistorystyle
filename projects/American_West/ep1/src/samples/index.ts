// Style-sample compositions (stills only), registered in src/Root.tsx. Each is a short clip; the review still is
// taken at STILL_FRAME, after every mark has landed.
import type React from 'react';
import {S1A, S1B, S1C} from './S1Spike';
import {S2A, S2B, S2C} from './S2Checker';
import {S3A, S3B, S3C} from './S3Race';
import {S4A, S4B} from './S4Ledger';
import {S5A, S5B, S5C, S5D} from './S5System';

export const SAMPLE_FRAMES = 90;
export const STILL_FRAME = 84;
export const SAMPLES: {id: string; C: React.FC}[] = [
  {id: 'S1-Spike-A', C: S1A}, {id: 'S1-Spike-B', C: S1B}, {id: 'S1-Spike-C', C: S1C},
  {id: 'S2-Checker-A', C: S2A}, {id: 'S2-Checker-B', C: S2B}, {id: 'S2-Checker-C', C: S2C},
  {id: 'S3-Race-A', C: S3A}, {id: 'S3-Race-B', C: S3B}, {id: 'S3-Race-C', C: S3C},
  {id: 'S4-Ledger-A', C: S4A}, {id: 'S4-Ledger-B', C: S4B},
  {id: 'S5-Hinge-A', C: S5A}, {id: 'S5-Hinge-B', C: S5B}, {id: 'S5-Resist-A', C: S5C}, {id: 'S5-Resist-B', C: S5D},
];
