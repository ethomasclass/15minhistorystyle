// Chapter 9 · stub: the board only (scenes to come).
import React from 'react';
import words from '../../public/audio/ch09_swing_circle.words.json';
import {DarkPaper} from '../kit/common';
import {EpBoard} from '../kit/ep1board';
import {cut} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH09_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => {
  const B = cut(t, 'So, back to the question');
  return <>{useScene([[0, <DarkPaper key="d" />], [B, <EpBoard key="b" ch={9} from={B} at={t.at('Congress does')} />]])}</>;
};

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_swing_circle.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
