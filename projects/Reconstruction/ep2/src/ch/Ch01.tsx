// Chapter 1 · stub: the board only (scenes to come).
import React from 'react';
import words from '../../public/audio/ch01_cold_open.words.json';
import {DarkPaper} from '../kit/common';
import {SeriesBoard} from '../kit/ep2board';
import {cut} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH01_FRAMES = chapterFrames(N, 0);

const Body: React.FC = () => {
  const B = cut(t, "We'll find out");
  return <>{useScene([[0, <DarkPaper key="d" />], [B, <SeriesBoard key="b" ch={1} from={B} at={t.at("Hold onto him")} />]])}</>;
};

export const Ch01: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch01_cold_open.wav" lead={0}>
    <Body />
  </ChapterShell>
);
