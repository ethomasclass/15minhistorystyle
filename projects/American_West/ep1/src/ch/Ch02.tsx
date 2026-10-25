// Chapter 2 · 1862. STUB: replaced by the scene build (see SCENES.md).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch02_1862.words.json';
import {Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_1862.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /><Note text="ch02 · 1862" x={200} y={400} size={80} at={1} /></AbsoluteFill>
  </ChapterShell>
);
