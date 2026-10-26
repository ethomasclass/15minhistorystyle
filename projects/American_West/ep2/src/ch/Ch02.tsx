// Chapter 2 · STUB (the builder replaces this file). Narration: public/audio/ch02_four_dollar_cows.wav.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch02_four_dollar_cows.words.json';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';
import {Mono} from '../samples/kit';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_four_dollar_cows.wav" lead={LEAD}>
    <AbsoluteFill style={{background: '#111'}}><Mono text="Ch02 STUB" x={120} y={120} size={40} /></AbsoluteFill>
  </ChapterShell>
);
