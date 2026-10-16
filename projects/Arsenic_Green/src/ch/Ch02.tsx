// Chapter 2 · placeholder (replaced when the chapter's scenes are built).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch02_perfect_green.words.json';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_perfect_green.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /></AbsoluteFill>
  </ChapterShell>
);
