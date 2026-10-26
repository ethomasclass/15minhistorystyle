// Chapter 9 · STUB (the builder replaces this file). Narration: public/audio/ch09_the_big_die_up.wav.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch09_the_big_die_up.words.json';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';
import {Mono} from '../samples/kit';

const N = words as Narration;
export const CH09_FRAMES = chapterFrames(N, LEAD);

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_the_big_die_up.wav" lead={LEAD}>
    <AbsoluteFill style={{background: '#111'}}><Mono text="Ch09 STUB" x={120} y={120} size={40} /></AbsoluteFill>
  </ChapterShell>
);
