// Chapter 6 · STUB (the builder replaces this file). Narration: public/audio/ch06_1874.wav.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch06_1874.words.json';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';
import {Mono} from '../samples/kit';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_1874.wav" lead={LEAD}>
    <AbsoluteFill style={{background: '#111'}}><Mono text="Ch06 STUB" x={120} y={120} size={40} /></AbsoluteFill>
  </ChapterShell>
);
