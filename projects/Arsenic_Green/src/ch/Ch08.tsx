// Chapter 8 · placeholder (replaced when the chapter's scenes are built).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch08_back_to_the_book.words.json';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH08_FRAMES = chapterFrames(N, LEAD);

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_back_to_the_book.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /></AbsoluteFill>
  </ChapterShell>
);
