// Chapter 3 · STUB (the builder replaces this file). Narration: public/audio/ch03_the_long_drive.wav.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch03_the_long_drive.words.json';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';
import {Mono} from '../samples/kit';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_the_long_drive.wav" lead={LEAD}>
    <AbsoluteFill style={{background: '#111'}}><Mono text="Ch03 STUB" x={120} y={120} size={40} /></AbsoluteFill>
  </ChapterShell>
);
