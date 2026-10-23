// Chapter 8 · stub: the board only (scenes to come).
import React from 'react';
import words from '../../public/audio/ch08_equal_protection.words.json';
import {DarkPaper} from '../kit/common';
import {EpBoard} from '../kit/ep1board';
import {cut} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH08_FRAMES = chapterFrames(N, LEAD);

const Body: React.FC = () => {
  const B = cut(t, 'Which must have made');
  return <>{useScene([[0, <DarkPaper key="d" />], [B, <EpBoard key="b" ch={8} from={B} at={t.at('awkward trip home')} />]])}</>;
};

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_equal_protection.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
