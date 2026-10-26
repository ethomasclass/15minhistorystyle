// Chapter 7 · STUB (the builder replaces this file). Narration: public/audio/ch07_who_got_the_gold.wav.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch07_who_got_the_gold.words.json';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';
import {Mono} from '../samples/kit';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_who_got_the_gold.wav" lead={LEAD}>
    <AbsoluteFill style={{background: '#111'}}><Mono text="Ch07 STUB" x={120} y={120} size={40} /></AbsoluteFill>
  </ChapterShell>
);
