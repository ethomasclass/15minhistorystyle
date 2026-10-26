// Chapter 5 · STUB (the builder replaces this file). Narration: public/audio/ch05_who_the_cowboys_were.wav.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch05_who_the_cowboys_were.words.json';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';
import {Mono} from '../samples/kit';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_who_the_cowboys_were.wav" lead={LEAD}>
    <AbsoluteFill style={{background: '#111'}}><Mono text="Ch05 STUB" x={120} y={120} size={40} /></AbsoluteFill>
  </ChapterShell>
);
