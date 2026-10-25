// Chapter 3 · The Race. STUB: replaced by the scene build (see SCENES.md).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch03_the_race.words.json';
import {Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_the_race.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /><Note text="ch03 · The Race" x={200} y={400} size={80} at={1} /></AbsoluteFill>
  </ChapterShell>
);
