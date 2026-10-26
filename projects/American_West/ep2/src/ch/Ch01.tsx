// Chapter 1 · STUB (the builder replaces this file). Narration: public/audio/ch01_last_of_the_5000.wav.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch01_last_of_the_5000.words.json';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';
import {Mono} from '../samples/kit';

const N = words as Narration;
export const CH01_FRAMES = chapterFrames(N, LEAD);

export const Ch01: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch01_last_of_the_5000.wav" lead={LEAD}>
    <AbsoluteFill style={{background: '#111'}}><Mono text="Ch01 STUB" x={120} y={120} size={40} /></AbsoluteFill>
  </ChapterShell>
);
