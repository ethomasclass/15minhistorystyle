// Chapter 5 · Done. STUB: replaced by the scene build (see SCENES.md).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch05_done.words.json';
import {Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_done.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /><Note text="ch05 · Done" x={200} y={400} size={80} at={1} /></AbsoluteFill>
  </ChapterShell>
);
