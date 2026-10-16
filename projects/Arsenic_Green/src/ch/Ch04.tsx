// Chapter 4 · placeholder (replaced when the chapter's scenes are built).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch04_the_walls.words.json';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_the_walls.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /></AbsoluteFill>
  </ChapterShell>
);
