// Placeholder: the narration over this chapter's board (replaced by the built chapter).
import React from 'react';
import words from '../../public/audio/ch06_the_bank.words.json';
import {SeriesBoard} from '../kit/ep3board';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_the_bank.wav" lead={LEAD}>
    <SeriesBoard ch={6} from={0} at={40} />
  </ChapterShell>
);
