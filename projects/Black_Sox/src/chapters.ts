// time, joins them and masters once. Add a line per chapter as you build it.
import React from 'react';
import {Ch01, CH01_FRAMES} from './ch/Ch01';

export const CHAPTERS: {id: string; C: React.FC; frames: number}[] = [
  {id: 'Ch01', C: Ch01, frames: CH01_FRAMES},
];
