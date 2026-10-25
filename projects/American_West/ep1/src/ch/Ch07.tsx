// Chapter 7 · Where It Will Do Most Good. STUB: replaced by the scene build (see SCENES.md).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch07_where_it_will_do_most_good.words.json';
import {Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_where_it_will_do_most_good.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /><Note text="ch07 · Where It Will Do Most Good" x={200} y={400} size={80} at={1} /></AbsoluteFill>
  </ChapterShell>
);
