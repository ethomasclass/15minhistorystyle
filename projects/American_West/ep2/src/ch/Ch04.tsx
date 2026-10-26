// Chapter 4 · STUB (the builder replaces this file). Narration: public/audio/ch04_beef_for_bosque_redondo.wav.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch04_beef_for_bosque_redondo.words.json';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';
import {Mono} from '../samples/kit';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_beef_for_bosque_redondo.wav" lead={LEAD}>
    <AbsoluteFill style={{background: '#111'}}><Mono text="Ch04 STUB" x={120} y={120} size={40} /></AbsoluteFill>
  </ChapterShell>
);
