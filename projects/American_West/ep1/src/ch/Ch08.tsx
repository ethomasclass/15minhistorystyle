// Chapter 8 · Panic. STUB: replaced by the scene build (see SCENES.md).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch08_panic.words.json';
import {Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH08_FRAMES = chapterFrames(N, LEAD);

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_panic.wav" lead={LEAD}>
    <AbsoluteFill><DarkPaper /><Note text="ch08 · Panic" x={200} y={400} size={80} at={1} /></AbsoluteFill>
  </ChapterShell>
);
