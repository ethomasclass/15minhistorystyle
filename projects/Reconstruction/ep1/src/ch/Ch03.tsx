// Chapter 3 · stub: the board only (scenes to come).
import React from 'react';
import words from '../../public/audio/ch03_ten_percent.words.json';
import {DarkPaper} from '../kit/common';
import {EpBoard} from '../kit/ep1board';
import {cut} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH03_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => {
  const B = cut(t, 'So the President had one plan');
  return <>{useScene([[0, <DarkPaper key="d" />], [B, <EpBoard key="b" ch={3} from={B} at={t.at('neither had won')} />]])}</>;
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_ten_percent.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
