// Chapter 4 · stub: the board only (scenes to come).
import React from 'react';
import words from '../../public/audio/ch04_impeachment.words.json';
import {DarkPaper} from '../kit/common';
import {SeriesBoard} from '../kit/ep2board';
import {cut} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH04_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => {
  const B = cut(t, "His plan to give");
  return <>{useScene([[0, <DarkPaper key="d" />], [B, <SeriesBoard key="b" ch={4} from={B} at={t.at("died with him")} />]])}</>;
};

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_impeachment.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
