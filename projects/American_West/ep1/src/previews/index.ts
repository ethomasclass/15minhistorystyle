// Motion previews (low-res review renders), registered in src/Root.tsx; render with src/previews/render.mjs.
import type React from 'react';
import {P1_FRAMES, P1ColdOpen} from './P1ColdOpen';
import {P2_FRAMES, P2Race} from './P2Race';
import {P3_FRAMES, P3Checker} from './P3Checker';

export const PREVIEWS: {id: string; C: React.FC; frames: number}[] = [
  {id: 'P1-ColdOpen', C: P1ColdOpen, frames: P1_FRAMES},
  {id: 'P2-Race', C: P2Race, frames: P2_FRAMES},
  {id: 'P3-Checker', C: P3Checker, frames: P3_FRAMES},
];
