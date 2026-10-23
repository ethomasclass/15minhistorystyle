// Chapter 3 · stub: the board only (scenes to come).
import React from 'react';
import words from '../../public/audio/ch03_the_blacksmith.words.json';
import {DarkPaper} from '../kit/common';
import {SeriesBoard} from '../kit/ep2board';
import {cut} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH03_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => {
  const B = cut(t, "Remember Edisto's");
  return <>{useScene([[0, <DarkPaper key="d" />], [B, <SeriesBoard key="b" ch={3} from={B} at={t.at("get past the President")} />]])}</>;
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_the_blacksmith.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
