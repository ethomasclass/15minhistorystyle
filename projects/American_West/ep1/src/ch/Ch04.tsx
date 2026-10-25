// Chapter 4 · The Mountain. STUB: replaced by the scene build (see SCENES.md).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch04_the_mountain.words.json';
import {Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_the_mountain.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /><Note text="ch04 · The Mountain" x={200} y={400} size={80} at={1} /></AbsoluteFill>
  </ChapterShell>
);
