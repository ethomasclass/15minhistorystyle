// Chapter 7 · placeholder (replaced when the chapter's scenes are built).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch07_arsenic_free.words.json';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_arsenic_free.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /></AbsoluteFill>
  </ChapterShell>
);
