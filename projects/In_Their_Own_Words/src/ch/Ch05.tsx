// Chapter 5 · stub: replace the scenes (see script/SCENES.md). Keep the shell.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch05_fort_sumter.words.json';
import {Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

const Placeholder: React.FC<{t: TL}> = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="ch05_fort_sumter" x={200} y={460} size={70} at={2} color="#ffffff" />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const scene = useScene([[0, <Placeholder t={t} />]]);
  return <>{scene}</>;
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_fort_sumter.wav" lead={LEAD} music={[]}>
    <Body />
  </ChapterShell>
);
