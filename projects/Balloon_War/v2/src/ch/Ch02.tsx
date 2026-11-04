// Chapter 2 skeleton (wired to the real narration). Scene plan: script/SCENES_v2.md "ch02"; build brief: script/BUILD_BRIEF_v2.md.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import words from '../../public/audio/v2_ch02_revenge_on_the_wind.words.json';
import {Highlight} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

const Placeholder: React.FC<{t: TL; a: number}> = () => (
  <AbsoluteFill><DarkPaper /><Highlight text="CH 02" x={160} y={160} size={110} at={0} seed={1} /></AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const cuts: [number, React.ReactNode][] = [
    [0, <Sequence from={0} layout="none"><Placeholder t={t} a={0} /></Sequence>],
  ];
  return <>{useScene(cuts)}</>;
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/v2_ch02_revenge_on_the_wind.wav" lead={LEAD} music={[{src: 'music/bw_revenge_on_the_wind.mp3', volume: bed('bw_revenge_on_the_wind')}]}>
    <Body />
  </ChapterShell>
);
