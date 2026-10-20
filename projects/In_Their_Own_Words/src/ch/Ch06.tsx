// Chapter 6 · stub: replace the scenes (see script/SCENES.md). Keep the shell.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch06_sizing_up.words.json';
import {Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);

const Placeholder: React.FC<{t: TL}> = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="ch06_sizing_up" x={200} y={460} size={70} at={2} color="#ffffff" />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const scene = useScene([[0, <Placeholder t={t} />]]);
  return <>{scene}</>;
};

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_sizing_up.wav" lead={LEAD} music={[]}>
    <Body />
  </ChapterShell>
);
