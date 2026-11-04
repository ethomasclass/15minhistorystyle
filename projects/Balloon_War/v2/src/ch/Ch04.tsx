// Chapter 4 skeleton (wired to the real narration). Scene plan: script/SCENES_v2.md "ch04"; build brief: script/BUILD_BRIEF_v2.md.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import words from '../../public/audio/v2_ch04_the_boy_on_the_beach.words.json';
import {Highlight} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

const Placeholder: React.FC<{t: TL; a: number}> = () => (
  <AbsoluteFill><DarkPaper /><Highlight text="CH 04" x={160} y={160} size={110} at={0} seed={1} /></AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const cuts: [number, React.ReactNode][] = [
    [0, <Sequence from={0} layout="none"><Placeholder t={t} a={0} /></Sequence>],
  ];
  return <>{useScene(cuts)}</>;
};

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/v2_ch04_the_boy_on_the_beach.wav" lead={LEAD} music={[{src: 'music/bw_dawn_launch.mp3', volume: bed('bw_dawn_launch')}]}>
    <Body />
  </ChapterShell>
);
