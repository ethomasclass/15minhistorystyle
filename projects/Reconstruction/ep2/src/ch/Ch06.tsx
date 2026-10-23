// Chapter 6 · stub: the board only (scenes to come).
import React from 'react';
import words from '../../public/audio/ch06_bottom_rail.words.json';
import {DarkPaper} from '../kit/common';
import {SeriesBoard} from '../kit/ep2board';
import {cut} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH06_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => {
  const B = cut(t, "But corruption");
  return <>{useScene([[0, <DarkPaper key="d" />], [B, <SeriesBoard key="b" ch={6} from={B} at={t.at("fit to govern themselves")} />]])}</>;
};

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_bottom_rail.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
