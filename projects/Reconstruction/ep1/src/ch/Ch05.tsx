// Chapter 5 · stub: the board only (scenes to come).
import React from 'react';
import words from '../../public/audio/ch05_treason_odious.words.json';
import {DarkPaper} from '../kit/common';
import {EpBoard} from '../kit/ep1board';
import {cut} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH05_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => {
  const B = cut(t, 'But first, the South');
  return <>{useScene([[0, <DarkPaper key="d" />], [B, <EpBoard key="b" ch={5} from={B} at={t.at('What was it going to do')} />]])}</>;
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_treason_odious.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
