// Chapter 8 skeleton (wired to the real narration). Scene plan: script/SCENES.md "ch08"; build brief: script/BUILD_BRIEF.md.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import words from '../../public/audio/ch08_not_enough_money.words.json';
import {Highlight} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';

const N = words as Narration;
export const CH08_FRAMES = chapterFrames(N, LEAD);

const Placeholder: React.FC<{t: TL; a: number}> = () => (
  <AbsoluteFill><DarkPaper /><Highlight text="CH 08" x={160} y={160} size={110} at={0} seed={1} /></AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const cuts: [number, React.ReactNode][] = [
    [0, <Sequence from={0} layout="none"><Placeholder t={t} a={0} /></Sequence>],
  ];
  return <>{useScene(cuts)}</>;
};

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_not_enough_money.wav" lead={LEAD} music={[{src: 'music/aw_panic.mp3', volume: bed('aw_panic')}]}>
    <Body />
  </ChapterShell>
);
