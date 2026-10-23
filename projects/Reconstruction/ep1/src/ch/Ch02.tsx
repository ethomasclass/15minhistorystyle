// Chapter 2 · stub: the board only (scenes to come).
import React from 'react';
import words from '../../public/audio/ch02_forty_acres.words.json';
import {DarkPaper} from '../kit/common';
import {EpBoard} from '../kit/ep1board';
import {cut} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH02_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => {
  const B = cut(t, 'And nobody in Washington');
  return <>{useScene([[0, <DarkPaper key="d" />], [B, <EpBoard key="b" ch={2} from={B} at={t.at('whether it would last')} />]])}</>;
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_forty_acres.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
