// Chapter 5 · placeholder (replaced when the chapter's scenes are built).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch05_witch_fever.words.json';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_witch_fever.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /></AbsoluteFill>
  </ChapterShell>
);
