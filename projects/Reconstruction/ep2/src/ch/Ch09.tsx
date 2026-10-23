// Chapter 9 · stub: the board only (scenes to come).
import React from 'react';
import words from '../../public/audio/ch09_the_debt.words.json';
import {DarkPaper} from '../kit/common';
import {SeriesBoard} from '../kit/ep2board';
import {cut} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH09_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => {
  const B = cut(t, "It's called");
  return <>{useScene([[0, <DarkPaper key="d" />], [B, <SeriesBoard key="b" ch={9} from={B} at={t.at("And it was legal")} />]])}</>;
};

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_the_debt.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
