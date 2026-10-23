// Chapter 7 · stub: the board only (scenes to come).
import React from 'react';
import words from '../../public/audio/ch07_carpetbaggers.words.json';
import {DarkPaper} from '../kit/common';
import {SeriesBoard} from '../kit/ep2board';
import {cut} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH07_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => {
  const B = cut(t, "We'll see Ames again");
  return <>{useScene([[0, <DarkPaper key="d" />], [B, <SeriesBoard key="b" ch={7} from={B} at={t.at("asking for help")} />]])}</>;
};

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_carpetbaggers.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
