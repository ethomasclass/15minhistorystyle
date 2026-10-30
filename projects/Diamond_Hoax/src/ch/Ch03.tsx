// Chapter 3 skeleton (wired to the real narration). Scene plan: script/SCENES.md "ch03"; build brief: script/BUILD_BRIEF.md.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import words from '../../public/audio/ch03_everybody_wants_a_diamond_mine.words.json';
import {Highlight} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

const Placeholder: React.FC<{t: TL; a: number}> = () => (
  <AbsoluteFill><DarkPaper /><Highlight text="CH 03" x={160} y={160} size={110} at={0} seed={1} /></AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const cuts: [number, React.ReactNode][] = [
    [0, <Sequence from={0} layout="none"><Placeholder t={t} a={0} /></Sequence>],
  ];
  return <>{useScene(cuts)}</>;
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_everybody_wants_a_diamond_mine.wav" lead={LEAD} music={[{src: 'music/hb_mischief_rag.mp3', volume: bed('hb_mischief_rag')}]}>
    <Body />
  </ChapterShell>
);
