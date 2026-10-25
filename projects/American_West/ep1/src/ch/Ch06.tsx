// Chapter 6 · Let Us Have Peace. STUB: replaced by the scene build (see SCENES.md).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch06_let_us_have_peace.words.json';
import {Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_let_us_have_peace.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /><Note text="ch06 · Let Us Have Peace" x={200} y={400} size={80} at={1} /></AbsoluteFill>
  </ChapterShell>
);
