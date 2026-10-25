// Chapter 9 · The Picture. STUB: replaced by the scene build (see SCENES.md).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch09_the_picture.words.json';
import {Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH09_FRAMES = chapterFrames(N, LEAD);

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_the_picture.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /><Note text="ch09 · The Picture" x={200} y={400} size={80} at={1} /></AbsoluteFill>
  </ChapterShell>
);
