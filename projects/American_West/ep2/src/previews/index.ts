import type React from 'react';
import {PTRAILS_FRAMES, PTrails} from './PTrails';

// West motion previews / checks for this episode: {id, C, frames}.
export const PREVIEWS: {id: string; C: React.FC; frames: number}[] = [
  {id: 'P-Trails', C: PTrails, frames: PTRAILS_FRAMES},
];
