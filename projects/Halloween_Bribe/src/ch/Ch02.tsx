// Chapter 2 · skeleton (being built). Scenes cut on spoken words; see src/ch/Ch01.tsx for the patterns.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch02_the_night_the_dead_came_home.words.json';
import {Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="chapter 2 (being built)" x={200} y={460} size={80} at={0} />
  </AbsoluteFill>
);

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_the_night_the_dead_came_home.wav" lead={LEAD} music={[]}>
    <Body />
  </ChapterShell>
);
