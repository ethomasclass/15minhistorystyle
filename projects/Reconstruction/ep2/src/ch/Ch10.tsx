// Chapter 10 · stub: the board only (scenes to come).
import React from 'react';
import words from '../../public/audio/ch10_ground.words.json';
import {DarkPaper} from '../kit/common';
import {SeriesBoard} from '../kit/ep2board';
import {cut} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH10_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => {
  const B = cut(t, "Thanks for watching");
  return <>{useScene([[0, <DarkPaper key="d" />], [B, <SeriesBoard key="b" ch={10} from={B} at={t.at("subscribe")} />]])}</>;
};

export const Ch10: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch10_ground.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
