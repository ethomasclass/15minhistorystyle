// Chapter 8 · STUB (the builder replaces this file). Narration: public/audio/ch08_cheap_as_dirt.wav.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch08_cheap_as_dirt.words.json';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';
import {Mono} from '../samples/kit';

const N = words as Narration;
export const CH08_FRAMES = chapterFrames(N, LEAD);

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_cheap_as_dirt.wav" lead={LEAD}>
    <AbsoluteFill style={{background: '#111'}}><Mono text="Ch08 STUB" x={120} y={120} size={40} /></AbsoluteFill>
  </ChapterShell>
);
