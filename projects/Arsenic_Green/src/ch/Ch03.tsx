// Chapter 3 · placeholder (replaced when the chapter's scenes are built).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch03_dressed_to_kill.words.json';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_dressed_to_kill.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /></AbsoluteFill>
  </ChapterShell>
);
