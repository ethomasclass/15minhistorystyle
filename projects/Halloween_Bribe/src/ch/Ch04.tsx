// Chapter 4 · skeleton (being built). Scenes cut on spoken words; see src/ch/Ch01.tsx for the patterns.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch04_the_worst_halloween.words.json';
import {Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="chapter 4 (being built)" x={200} y={460} size={80} at={0} />
  </AbsoluteFill>
);

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_the_worst_halloween.wav" lead={LEAD} music={[]}>
    <Body />
  </ChapterShell>
);
