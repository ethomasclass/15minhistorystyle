// Chapter 10 · STUB (the builder replaces this file). Narration: public/audio/ch10_the_last_of_the_5000.wav.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch10_the_last_of_the_5000.words.json';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';
import {Mono} from '../samples/kit';

const N = words as Narration;
export const CH10_FRAMES = chapterFrames(N, LEAD);

export const Ch10: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch10_the_last_of_the_5000.wav" lead={LEAD}>
    <AbsoluteFill style={{background: '#111'}}><Mono text="Ch10 STUB" x={120} y={120} size={40} /></AbsoluteFill>
  </ChapterShell>
);
